import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <FullLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.isAdmin()) return <Navigate to="/" replace />;
  return children;
}

export function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <FullLoader />;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export function FullLoader() {
  return (
    <div className="page-loader" style={{ minHeight:'100vh' }}>
      <div className="spinner-shop" />
      <span>Loading...</span>
    </div>
  );
}
