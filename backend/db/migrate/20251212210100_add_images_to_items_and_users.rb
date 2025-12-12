class AddImagesToItemsAndUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :items, :image_url, :string
    add_column :users, :avatar_url, :string
  end
end
