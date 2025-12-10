require "test_helper"

class OrdersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @order = orders(:one)
    sign_in @user
  end

  test "should get index" do
    get orders_url
    assert_response :success
  end

  test "should get show" do
    get order_url(@order)
    assert_response :success
  end

  test "should create order" do
    # Assuming create takes item_ids or similar. Adjust based on controller.
    # For now, just a basic post
    post orders_url, params: { order: { items: [ { id: items(:one).id, quantity: 1 } ] } }
    assert_response :success
  end
end
