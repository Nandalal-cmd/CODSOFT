import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (values) => {
    await login('user', values);
    navigate('/shop');
  };

  return (
    <AuthForm
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      subtitle="Sign in to keep your cart, move through checkout, and continue shopping with your account."
      switchLabel="Need an account?"
      switchPath="/signup"
      switchTo="Create one"
      title="Welcome back to your StyleCart account."
    />
  );
}

export default Login;
