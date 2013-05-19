OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  if Rails.env.development?
    OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE
    provider :facebook, '75965900421', '7f3051162139e3fec21fe450ae988b64'
  else
    provider :facebook, '75965900421', '7f3051162139e3fec21fe450ae988b64'
  end
end
