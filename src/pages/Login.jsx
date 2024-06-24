import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth, SupabaseAuthUI } from '@/integrations/supabase/auth/index.jsx';

const Login = () => {
  const { session } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <SupabaseAuthUI />
      </div>
    </div>
  );
};

export default Login;