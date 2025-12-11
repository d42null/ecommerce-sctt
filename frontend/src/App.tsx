import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

import { Toaster } from 'react-hot-toast';
import { useGetCurrentUserQuery } from './store/api/apiSlice';

function App() {
  const { isLoading: loading } = useGetCurrentUserQuery();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          } />
          
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />

          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
