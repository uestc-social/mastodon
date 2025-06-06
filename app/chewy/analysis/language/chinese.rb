# frozen_string_literal: true

module Analysis
  module Language
    module Chinese
      def self.settings
        {
          analysis: {
            char_filter: {
              chinese_t2s: {
                type: 'stconvert',
                convert_type: 't2s',
              },
            },
            analyzer: {
              chinese_ik: {
                tokenizer: 'ik_smart',
                char_filter: %w(chinese_t2s),
              },
            },
          },
        }
      end
    end
  end
end
