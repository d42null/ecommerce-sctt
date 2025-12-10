require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:two)
    @user = users(:one)
    sign_in @admin
  end

  test "should get index" do
    get users_url
    assert_response :success
  end

  test "should update user role" do
    patch user_url(@user), params: { user: { role: 'admin' } }
    assert_response :success
    @user.reload
    assert_equal 'admin', @user.role
  end
end
