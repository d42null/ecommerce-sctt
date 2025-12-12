# E-Commerce Project

A full-stack e-commerce application built with React (Vite) and Ruby on Rails API.

## 🔗 Live Demo & API

*   **Frontend (App)**: [INSERT_FRONTEND_URL_HERE](INSERT_FRONTEND_URL_HERE) - *Log in with credentials below*
*   **Backend (Swagger API)**: [INSERT_BACKEND_URL_HERE/api-docs](INSERT_BACKEND_URL_HERE/api-docs)

## 🚀 Features

*   **Authentication**: JWT-based auth, Google OAuth integration.
*   **Role Management**: Admin and User roles. Admins can manage items and user roles.
*   **Products**: Browsing, searching, pagination, image support.
*   **Cart & Orders**: Add to cart, view cart, checkout (create order).
*   **UI/UX**: Responsive design with Tailwind CSS, loading states, toast notifications.

## 🛠 Tech Stack

*   **Frontend**: React, Redux Toolkit, Tailwind CSS, Vite, TypeScript.
*   **Backend**: Ruby on Rails 8 (API mode), PostgreSQL, Devise, JWT.
*   **Testing**: Minitest (Backend).

## 📥 Setup & Installation

### Prerequisites

*   Node.js & npm
*   Ruby 3.x & Bundler
*   PostgreSQL

### Backend Setup

1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    bundle install
    ```
3.  Setup Database:
    ```bash
    rails db:create db:migrate db:seed
    ```
    *Note: `db:seed` will populate the database with sample products and default users.*
4.  Start server:
    ```bash
    rails s
    ```
    API will run at `http://localhost:3000`.

### Frontend Setup

1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start development server:
    ```bash
    npm run dev
    ```
    App will run at `http://localhost:5173`.

## 🔐 Credentials for Testing

Use these accounts to explore the application:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `password` |
| **User** | `user@example.com` | `password` |

*   **Admin functions**: Go to `/admin` (or click "Admin Dashboard" in profile menu) to manage items and user roles.
*   **User functions**: Browse products, add to cart, place orders.

## 🌍 Deployment

This project is ready for deployment.

*   **Backend**: Can be deployed to Render, Railway, or Heroku. Ensure `RAILS_MASTER_KEY` or environment variables (DB credentials, `DEVISE_JWT_SECRET_KEY`, `GOOGLE_CLIENT_ID`, etc.) are set.
*   **Frontend**: Can be deployed to Vercel, Netlify, or AWS Amplify. Set `VITE_API_URL` to your backend URL.
