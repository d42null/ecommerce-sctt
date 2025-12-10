class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :check_admin, only: [:index]

  def current
    render json: current_user
  end

  def index
    @users = User.all
    render json: @users
  end

  def update
    @user = User.find(params[:id])
    
    unless current_user.admin? || current_user.id == @user.id
      render json: { error: 'Unauthorized' }, status: :unauthorized
      return
    end

    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  private

  def user_params
    permitted = [:first_name, :last_name, :email]
    permitted << :role if current_user.admin?
    params.require(:user).permit(*permitted)
  end

  def check_admin
    unless current_user&.admin?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
