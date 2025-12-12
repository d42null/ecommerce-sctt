require 'devise/strategies/authenticatable'

module Devise
  module Strategies
    class Jwt < Authenticatable
      def valid?
        request.headers['Authorization'].present?
      end

      def authenticate!
        token = request.headers['Authorization'].split(' ').last
        decoded = JwtService.decode(token)

        if decoded && (user = User.find_by(id: decoded[:user_id]))
          success!(user)
        else
          fail!("Invalid token")
        end
      end
    end
  end
end

Warden::Strategies.add(:jwt, Devise::Strategies::Jwt)
