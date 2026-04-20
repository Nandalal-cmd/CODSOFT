import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const redirectMap = {
  admin: '/admin',
  user: '/login',
};

function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectMap[allowedRole] || '/login'} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
}

export default ProtectedRoute;
