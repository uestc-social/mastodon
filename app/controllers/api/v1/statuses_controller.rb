# frozen_string_literal: true

class Api::V1::StatusesController < Api::BaseController
  include Authorization

  before_action -> { authorize_if_got_token! :read, :'read:statuses' }, except: [:create, :update, :destroy]
  before_action -> { doorkeeper_authorize! :write, :'write:statuses' }, only:   [:create, :update, :destroy]
  before_action :require_user!, except:      [:index, :show, :context]
  before_action :set_statuses, only:         [:index]
  before_action :set_status, only:           [:show, :context]
  before_action :set_thread, only:           [:create]
  before_action :check_statuses_limit, only: [:index]

  override_rate_limit_headers :create, family: :statuses
  override_rate_limit_headers :update, family: :statuses

  # This API was originally unlimited, pagination cannot be introduced without
  # breaking backwards-compatibility. Arbitrarily high number to cover most
  # conversations as quasi-unlimited, it would be too much work to render more
  # than this anyway
  CONTEXT_LIMIT = 4_096

  # This remains expensive and we don't want to show everything to logged-out users
  ANCESTORS_LIMIT         = 40
  DESCENDANTS_LIMIT       = 60
  DESCENDANTS_DEPTH_LIMIT = 20

  def index
    @statuses = preload_collection(@statuses, Status)
    render json: @statuses, each_serializer: REST::StatusSerializer
  end

  def show
    cache_if_unauthenticated!
    @status = preload_collection([@status], Status).first
    render json: @status, serializer: REST::StatusSerializer
  end

  def context
    cache_if_unauthenticated!

    ancestors_limit         = CONTEXT_LIMIT
    descendants_limit       = CONTEXT_LIMIT
    descendants_depth_limit = nil

    if current_account.nil?
      ancestors_limit         = ANCESTORS_LIMIT
      descendants_limit       = DESCENDANTS_LIMIT
      descendants_depth_limit = DESCENDANTS_DEPTH_LIMIT
    end

    ancestors_results   = @status.in_reply_to_id.nil? ? [] : @status.ancestors(ancestors_limit, current_account)
    descendants_results = @status.descendants(descendants_limit, current_account, descendants_depth_limit)
    loaded_ancestors    = preload_collection(ancestors_results, Status)
    loaded_descendants  = preload_collection(descendants_results, Status)

    @context = Context.new(ancestors: loaded_ancestors, descendants: loaded_descendants)
    statuses = [@status] + @context.ancestors + @context.descendants

    render json: @context, serializer: REST::ContextSerializer, relationships: StatusRelationshipsPresenter.new(statuses, current_user&.account_id)

    ActivityPub::FetchAllRepliesWorker.perform_async(@status.id) if !current_account.nil? && @status.should_fetch_replies?
  end

  def create
    original_text = status_params[:status]

    if should_post_anonymously?(original_text)
      anon_config = Rails.configuration.x.anon
      proxy_account = Account.find_by(username: anon_config.account_username)

      if proxy_account
        anonymous_name = generate_anonymous_name(current_user.account)

        if anonymous_name
          cleaned_text = Status.new.clean_anonymous_tag(original_text)
          processed_text = "[#{anonymous_name}]:\n#{cleaned_text}"
          sender_account = proxy_account
        else
          processed_text = original_text
          sender_account = current_user.account
        end
      else
        processed_text = original_text
        sender_account = current_user.account
      end
    else
      sender_account = current_user.account
      processed_text = original_text
    end

    @status = PostStatusService.new.call(
      sender_account,
      text: processed_text,
      thread: @thread,
      media_ids: status_params[:media_ids],
      sensitive: status_params[:sensitive],
      spoiler_text: status_params[:spoiler_text],
      visibility: status_params[:visibility],
      language: status_params[:language],
      scheduled_at: status_params[:scheduled_at],
      application: doorkeeper_token.application,
      poll: status_params[:poll],
      content_type: status_params[:content_type],
      allowed_mentions: status_params[:allowed_mentions],
      idempotency: request.headers['Idempotency-Key'],
      with_rate_limit: true
    )

    render json: @status, serializer: serializer_for_status
  rescue PostStatusService::UnexpectedMentionsError => e
    render json: unexpected_accounts_error_json(e), status: 422
  end

  def update
    @status = Status.where(account: current_account).find(params[:id])
    authorize @status, :update?

    UpdateStatusService.new.call(
      @status,
      current_account.id,
      text: status_params[:status],
      media_ids: status_params[:media_ids],
      media_attributes: status_params[:media_attributes],
      sensitive: status_params[:sensitive],
      language: status_params[:language],
      spoiler_text: status_params[:spoiler_text],
      poll: status_params[:poll],
      content_type: status_params[:content_type]
    )

    render json: @status, serializer: REST::StatusSerializer
  end

  def destroy
    @status = Status.where(account: current_account).find(params[:id])
    authorize @status, :destroy?

    @status.discard_with_reblogs
    StatusPin.find_by(status: @status)&.destroy
    @status.account.statuses_count = @status.account.statuses_count - 1
    json = render_to_body json: @status, serializer: REST::StatusSerializer, source_requested: true

    RemovalWorker.perform_async(@status.id, { 'redraft' => !truthy_param?(:delete_media) })

    render json: json
  end

  private

  def set_statuses
    @statuses = Status.permitted_statuses_from_ids(status_ids, current_account)
  end

  def set_status
    @status = Status.find(params[:id])
    authorize @status, :show?
  rescue Mastodon::NotPermittedError
    not_found
  end

  def set_thread
    @thread = Status.find(status_params[:in_reply_to_id]) if status_params[:in_reply_to_id].present?
    authorize(@thread, :show?) if @thread.present?
  rescue ActiveRecord::RecordNotFound, Mastodon::NotPermittedError
    render json: { error: I18n.t('statuses.errors.in_reply_not_found') }, status: 404
  end

  def check_statuses_limit
    raise(Mastodon::ValidationError) if status_ids.size > DEFAULT_STATUSES_LIMIT
  end

  def status_ids
    Array(statuses_params[:id]).uniq.map(&:to_i)
  end

  def statuses_params
    params.permit(id: [])
  end

  def status_params
    params.permit(
      :status,
      :in_reply_to_id,
      :sensitive,
      :spoiler_text,
      :visibility,
      :language,
      :scheduled_at,
      :content_type,
      allowed_mentions: [],
      media_ids: [],
      media_attributes: [
        :id,
        :thumbnail,
        :description,
        :focus,
      ],
      poll: [
        :multiple,
        :hide_totals,
        :expires_in,
        options: [],
      ]
    )
  end

  def serializer_for_status
    @status.is_a?(ScheduledStatus) ? REST::ScheduledStatusSerializer : REST::StatusSerializer
  end

  def unexpected_accounts_error_json(error)
    {
      error: error.message,
      unexpected_accounts: serialized_accounts(error.accounts),
    }
  end

  def serialized_accounts(accounts)
    ActiveModel::Serializer::CollectionSerializer.new(accounts, serializer: REST::AccountSerializer)
  end

  def should_post_anonymously?(text)
    anon_config = Rails.configuration.x.anon
    anon_config.enabled &&
    anon_config.account_username.present? &&
    anon_config.tag.present? &&
    text.strip.match?(/#{Regexp.escape(anon_config.tag)}(?:\s+#{Regexp.escape('👁')}\ufe0f?)?\s*\z/)
  end

  def generate_anonymous_name(account)
    anon_config = Rails.configuration.x.anon
    return nil unless anon_config.enabled && anon_config.account_username.present? && anon_config.name_list.any?

    # Calculate time window
    period_hours = anon_config.period_hours
    current_time_utc = Time.current.utc
    hours_since_epoch = current_time_utc.to_i / 3600
    time_window = hours_since_epoch / period_hours
    
    redis_key = "anon_names:#{time_window}"
    
    # Check name conflict
    existing_name = redis.hget(redis_key, account.username)
    return existing_name if existing_name.present?

    input = "#{account.username}#{anon_config.salt}#{time_window}"
    name_index = Digest::SHA2.hexdigest(input).to_i(16) % anon_config.name_list.size

    selected_name = with_redis do |redis_conn|
      redis_conn.multi do |transaction|
        used_names = transaction.hvals(redis_key).value || []

        available_name = find_available_name(anon_config.name_list, used_names, name_index)

        transaction.hset(redis_key, account.username, available_name)
        transaction.expire(redis_key, (period_hours + 1) * 3600)
        
        available_name
      end.last
    end
    
    selected_name
  rescue Redis::BaseError => e
    Rails.logger.warn("Anonymous name generation failed: #{e.message}")
    # Fallback: generate name without collision detection
    input = "#{account.username}#{anon_config.salt}#{time_window}"
    name_index = Digest::SHA2.hexdigest(input).to_i(16) % anon_config.name_list.size
    anon_config.name_list[name_index]
  end

  private

  def find_available_name(name_list, used_names, start_index)
    used_names_set = used_names.to_set

    name_list.size.times do |offset|
      index = (start_index + offset) % name_list.size
      name = name_list[index]
      return name unless used_names_set.include?(name)
    end

    # If all names used, generate combination
    base_name = name_list[start_index]
    suffix_index = used_names.size % name_list.size
    suffix_name = name_list[suffix_index]
    "#{base_name}#{suffix_name}"
  end
end
