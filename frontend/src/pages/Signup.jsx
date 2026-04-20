import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../hooks/useAuth';

function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (values) => {
    await register('user', values);
    navigate('/shop');
  };

  return (
    <AuthForm
      onSubmit={handleSubmit}
      showName
      submitLabel="Create Account"
      subtitle="Create a customer account to save your shopping flow and access the storefront as a signed-in user."
      switchLabel="Already registered?"
      switchPath="/login"
      switchTo="Sign in"
      title="Create your StyleCart customer account."
    />
  );
}

export default Signup;
