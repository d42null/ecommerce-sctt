OmniAuth.config.allowed_request_methods = [:post, :get]
OmniAuth.config.silence_get_warning = true

if Rails.env.production?
  OmniAuth.config.full_host = "https://#{ENV['HOST'] || 'ecommerce-sctt.onrender.com'}"
end
