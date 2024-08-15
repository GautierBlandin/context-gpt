import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { AuthenticationStateType, authenticationStore, LoginForm } from '@context-gpt/authentication';

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useSnapshot(authenticationStore);

  useEffect(() => {
    if (auth.authState.type === AuthenticationStateType.Authenticated) {
      navigate(-1);
    }
  }, [auth.authState, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}
