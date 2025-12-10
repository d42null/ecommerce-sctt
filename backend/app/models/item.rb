class Item < ApplicationRecord
  has_many :order_descriptions
  has_many :orders, through: :order_descriptions
end
