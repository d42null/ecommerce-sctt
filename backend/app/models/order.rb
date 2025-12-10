class Order < ApplicationRecord
  belongs_to :user
  has_many :order_descriptions
  has_many :items, through: :order_descriptions
end
