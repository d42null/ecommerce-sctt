class Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    token = JwtService.encode(user_id: resource.id)
    response.headers['Authorization'] = "Bearer #{token}"
    render json: {
      status: { code: 200, message: 'Logged in successfully.' },
      data: resource
    }, status: :ok
  end

  def respond_to_on_destroy
    # JWT is stateless, so we just return success. Client should delete token.
    render json: {
      status: 200,
      message: "logged out successfully"
    }, status: :ok
  end
end
