import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useGetCurrentUserQuery, useLogoutMutation } from '../store/api/apiSlice';
import { selectCartTotalItems } from '../store/slices/cartSlice';
import { ShoppingCart, LogOut } from 'lucide-react';

export default function Navbar() {
  const { data: user } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();
  const totalItems = useAppSelector(selectCartTotalItems);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout().unwrap();
    // Cache invalidation handles user data clearing, but we might want to ensure navigation happens after
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-indigo-600">ShopApp</Link>
            {user && (
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Products</Link>
                <Link to="/orders" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md font-medium">Orders</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-red-700 hover:text-red-900 px-3 py-2 rounded-md font-medium">Admin</Link>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user.first_name}</span>
                <Link to="/cart" className="text-gray-700 hover:text-indigo-600 relative">
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-500">Login</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
