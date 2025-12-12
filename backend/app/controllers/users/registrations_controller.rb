class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    if resource.persisted?
      token = JwtService.encode(user_id: resource.id)
      response.headers['Authorization'] = "Bearer #{token}"
      render json: {
        status: {code: 200, message: 'Signed up successfully.'},
        data: resource
      }
    else
      render json: {
        status: {message: "User could not be created successfully", errors: resource.errors.full_messages}
      }, status: :unprocessable_entity
    end
  end

  def sign_up_params
    params.require(:user).permit(:email, :password, :password_confirmation, :first_name, :last_name)
  end

  def account_update_params
    params.require(:user).permit(:email, :password, :password_confirmation, :current_password, :first_name, :last_name)
  end
end
