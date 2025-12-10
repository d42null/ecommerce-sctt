require "test_helper"

class ItemsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:two)
    @user = users(:one)
    @item = items(:one)
    sign_in @admin
  end

  test "should get index" do
    get items_url
    assert_response :success
  end

  test "should get show" do
    get item_url(@item)
    assert_response :success
  end

  test "should create item" do
    assert_difference("Item.count") do
      post items_url, params: { item: { name: "New Item", description: "Desc", price: 10.0 } }
    end
    assert_response :success # or :created
  end

  test "should update item" do
    patch item_url(@item), params: { item: { name: "Updated" } }
    assert_response :success
  end

  test "should destroy item" do
    item_to_delete = Item.create!(name: "To Delete", description: "Desc", price: 10.0)
    assert_difference("Item.count", -1) do
      delete item_url(item_to_delete)
    end
    assert_response :success # or :no_content
  end
end
