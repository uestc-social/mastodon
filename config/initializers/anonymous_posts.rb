# frozen_string_literal: true

Rails.application.configure do
  config.x.anon.enabled = ENV['ANON_ENABLED'] == 'true'
  config.x.anon.tag = ENV.fetch('ANON_TAG', '匿了')
  config.x.anon.account_username = ENV['ANON_ACCOUNT']
  config.x.anon.namelist_path = ENV['ANON_NAMELIST_PATH']
  config.x.anon.salt = ENV['ANON_SALT']
  config.x.anon.period_hours = ENV.fetch('ANON_PERIOD', '24').to_i

  if config.x.anon.enabled
    config.x.anon.name_list = []
    
    if config.x.anon.account_username.blank?
      Rails.logger.info("Anonymous posting disabled: ANON_ACCOUNT not configured")
      config.x.anon.enabled = false
    elsif config.x.anon.namelist_path.blank?
      Rails.logger.info("Anonymous posting disabled: ANON_NAMELIST_PATH not configured")
      config.x.anon.enabled = false
    elsif config.x.anon.salt.blank?
      Rails.logger.info("Anonymous posting disabled: ANON_SALT not configured")
      config.x.anon.enabled = false
    elsif !File.exist?(config.x.anon.namelist_path)
      Rails.logger.info("Anonymous posting disabled: Name list file not found at #{config.x.anon.namelist_path}")
      config.x.anon.enabled = false
    else
      begin
        config.x.anon.name_list = File.readlines(config.x.anon.namelist_path).map(&:strip).reject(&:blank?)
        if config.x.anon.name_list.empty?
          Rails.logger.info("Anonymous posting disabled: Name list is empty")
          config.x.anon.enabled = false
        else
          Rails.logger.info("Anonymous posting enabled with #{config.x.anon.name_list.size} names")
        end
      rescue => e
        Rails.logger.info("Anonymous posting disabled: Failed to load name list - #{e.message}")
        config.x.anon.enabled = false
      end
    end
  end
end