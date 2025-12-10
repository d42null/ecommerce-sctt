Rails.application.routes.draw do
  mount Rswag::Api::Engine => '/api-docs'
  mount Rswag::Ui::Engine => '/api-docs'
  scope defaults: { format: :json } do
    devise_for :users
    get 'current_user', to: 'users#current'
    resources :items
    resources :orders, only: [:index, :show, :create]
    resources :users, only: [:index, :update]
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
