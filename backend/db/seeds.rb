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
OrderDescription.destroy_all
Order.destroy_all
Item.destroy_all
puts "Old items and orders destroyed"

images = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80",
  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=300&q=80"
]

12.times do |i|
  Item.create!(
    name: "Premium Product #{i + 1}",
    description: "Experience the quality of our premium product #{i + 1}. Perfect for daily use.",
    price: (i + 1) * 15.99,
    image_url: images[i % images.length]
  )
end

puts "Seeding done!"
