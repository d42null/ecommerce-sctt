# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
# Create Admin User
User.find_or_create_by!(email: 'admin@example.com') do |u|
  u.first_name = 'Admin'
  u.last_name = 'User'
  u.password = 'password'
  u.password_confirmation = 'password'
  u.role = 'admin'
end

# Create Regular User
User.find_or_create_by!(email: 'user@example.com') do |u|
  u.first_name = 'Regular'
  u.last_name = 'User'
  u.password = 'password'
  u.password_confirmation = 'password'
  u.role = 'user'
end

# Create Sample Items
10.times do |i|
  Item.find_or_create_by!(name: "Product #{i + 1}") do |item|
    item.description = "Description for product #{i + 1}"
    item.price = (i + 1) * 10.99
  end
end

puts "Seeding done!"
