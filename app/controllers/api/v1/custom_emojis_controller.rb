# frozen_string_literal: true

class Api::V1::CustomEmojisController < Api::BaseController
  skip_before_action :require_authenticated_user!

  vary_by ''

  # Override `current_user` to avoid reading session cookies unless in whitelist mode
  def current_user
    super if limited_federation_mode?
  end

  def index
    cache_even_if_authenticated!
    render_with_cache(each_serializer: REST::CustomEmojiSerializer) { CustomEmoji.listed.includes(:category) }
  end
end
