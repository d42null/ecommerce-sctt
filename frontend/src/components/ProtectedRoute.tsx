import { Navigate, useLocation } from 'react-router-dom';
import { useGetCurrentUserQuery } from '../store/api/apiSlice';

export default function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { data: user, isLoading: loading } = useGetCurrentUserQuery();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
