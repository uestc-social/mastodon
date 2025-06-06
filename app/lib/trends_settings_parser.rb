# frozen_string_literal: true

module TrendsSettingsParser
  def self.parse_duration(value, default_duration)
    return default_duration if value.blank?

    # numbers with units: "2.days", "4.hours", "30.minutes"
    if (match = value.match(/^\s*(\d+(?:\.\d+)?)\s*\.\s*(\w+)\s*$/))
      num = match[1].to_f
      unit = match[2].singularize.to_sym

      return num.public_send(unit) if ActiveSupport::Duration::PARTS.include?(unit)
    end

    # plain numbers
    if value.match?(/^\s*\d+(?:\.\d+)?\s*$/)
      num = value.to_f
      unit = ActiveSupport::Duration.build(default_duration).parts.keys.first || :seconds
      return num.public_send(unit)
    end

    default_duration
  end
end
