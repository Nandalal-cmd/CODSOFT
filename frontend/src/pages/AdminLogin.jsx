import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';

function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (values) => {
    await login('admin', values);
    navigate('/admin/dashboard');
  };

  return (
    <AuthForm
      isAdmin
      onSubmit={handleSubmit}
      submitLabel="Enter Admin Portal"
      subtitle="This login is separate from the customer storefront and reserved for the system-managed administrator account."
      title="Sign in to the StyleCart admin portal."
    />
  );
}

export default AdminLogin;
