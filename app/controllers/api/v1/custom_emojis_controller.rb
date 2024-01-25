# frozen_string_literal: true

class Api::V1::CustomEmojisController < Api::BaseController
  skip_before_action :require_authenticated_user!

  vary_by '', unless: :disallow_unauthenticated_api_access?

  def index
    cache_even_if_authenticated! unless disallow_unauthenticated_api_access?
    render_with_cache(each_serializer: REST::CustomEmojiSerializer) { CustomEmoji.listed.includes(:category) }
  end
end
