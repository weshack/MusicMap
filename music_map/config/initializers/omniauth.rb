OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '75965900421', '7f3051162139e3fec21fe450ae988b64'
end
