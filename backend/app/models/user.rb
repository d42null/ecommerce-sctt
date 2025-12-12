class User < ApplicationRecord

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2]

  def self.from_omniauth(auth)
    user = where(provider: auth.provider, uid: auth.uid).first
    return user if user

    user = where(email: auth.info.email).first
    if user
      user.update(provider: auth.provider, uid: auth.uid)
      return user
    end

    create do |u|
      u.email = auth.info.email
      u.provider = auth.provider
      u.uid = auth.uid
      u.password = Devise.friendly_token[0, 20]
      u.first_name = auth.info.first_name || auth.info.name.split.first
      u.last_name = auth.info.last_name || auth.info.name.split.last
    end
  end
         
  has_many :orders

  def admin?
    role == 'admin'
  end
end
