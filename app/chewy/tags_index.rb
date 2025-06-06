# frozen_string_literal: true

require_relative 'analysis/language/chinese'

class TagsIndex < Chewy::Index
  include DatetimeClampingConcern

  LANGUAGES = [
    Analysis::Language::Chinese,
  ].freeze

  settings(
    [
      {
        index: index_preset(refresh_interval: '30s'),
        analysis: {
          analyzer: {
            content: {
              tokenizer: 'keyword',
              filter: %w(
                word_delimiter_graph
                lowercase
                asciifolding
                cjk_width
              ),
            },

            edge_ngram: {
              tokenizer: 'edge_ngram',
              filter: %w(
                lowercase
                asciifolding
                cjk_width
              ),
            },
          },

          tokenizer: {
            edge_ngram: {
              type: 'edge_ngram',
              min_gram: 2,
              max_gram: 15,
            },
          },
        },
      },
      *LANGUAGES.map(&:settings),
    ].reduce({}, :deep_merge)
  )

  index_scope ::Tag.listable

  crutch :time_period do
    7.days.ago.to_date..0.days.ago.to_date
  end

  root date_detection: false do
    field(:name, type: 'text', analyzer: 'content', value: :display_name) do
      field(:edge_ngram, type: 'text', analyzer: 'edge_ngram', search_analyzer: 'content')
      field(:chinese, type: 'text', analyzer: 'chinese_ik')
    end
    field(:reviewed, type: 'boolean', value: ->(tag) { tag.reviewed? })
    field(:usage, type: 'long', value: ->(tag, crutches) { tag.history.aggregate(crutches.time_period).accounts })
    field(:last_status_at, type: 'date', value: ->(tag) { clamp_date(tag.last_status_at || tag.created_at) })
  end
end
