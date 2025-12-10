class OrdersController < ApplicationController
  before_action :authenticate_user!

  def index
    @orders = current_user.orders.includes(order_descriptions: :item).order(created_at: :desc)
    render json: @orders, include: { order_descriptions: { include: :item } }
  end

  def show
    @order = current_user.orders.includes(order_descriptions: :item).find(params[:id])
    render json: @order, include: { order_descriptions: { include: :item } }
  end

  def create
    ActiveRecord::Base.transaction do
      @order = current_user.orders.new(amount: 0)
      
      items_params = params[:items] || [] 
      total_amount = 0

      items_params.each do |item_data|
        item = Item.find(item_data[:item_id])
        quantity = item_data[:quantity].to_i
        next if quantity <= 0
        
        @order.order_descriptions.build(item: item, quantity: quantity)
        total_amount += item.price * quantity
      end

      @order.amount = total_amount
      
      if @order.save
        render json: @order, include: :order_descriptions, status: :created
      else
        render json: @order.errors, status: :unprocessable_entity
        raise ActiveRecord::Rollback
      end
    end
  rescue ActiveRecord::RecordNotFound
    render json: { error: "Item not found" }, status: :not_found
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end
