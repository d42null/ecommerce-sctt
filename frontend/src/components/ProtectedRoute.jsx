import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !user.admin) {
    // Assuming backend returns 'admin' boolean or we check role
    // user.role === 'admin' based on backend logic
    if (user.role !== 'admin') {
       return <Navigate to="/" replace />;
    }
  }

  return children;
}
