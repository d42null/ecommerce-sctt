class ItemsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :check_admin, except: [:index, :show]

  def index
    page = (params[:page] || 1).to_i
    per_page = 20
    
    if params[:q].present?
      query = Item.where("name ILIKE ?", "%#{params[:q]}%")
    else
      query = Item.all
    end

    total_count = query.count
    @items = query.offset((page - 1) * per_page).limit(per_page)
    
    response.headers['Total-Pages'] = (total_count / per_page.to_f).ceil.to_s
    response.headers['Current-Page'] = page.to_s
    
    render json: @items
  end

  def show
    @item = Item.find(params[:id])
    render json: @item
  end

  def create
    @item = Item.new(item_params)
    if @item.save
      render json: @item, status: :created
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def update
    @item = Item.find(params[:id])
    if @item.update(item_params)
      render json: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @item = Item.find(params[:id])
    @item.destroy
    head :no_content
  end

  private

  def item_params
    params.require(:item).permit(:name, :description, :price)
  end

  def check_admin
    unless current_user&.admin?
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
end
