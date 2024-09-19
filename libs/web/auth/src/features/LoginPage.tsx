import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { authenticationStore } from './Authentication.store';
import { LoginForm } from './LoginForm/LoginForm';
import { AuthenticationStateType } from '../core';

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSnapshot(authenticationStore);

  useEffect(() => {
    if (auth.authState.type === AuthenticationStateType.Authenticated) {
      navigate(location.state?.from ?? '/');
    }
  }, [auth.authState, navigate, location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-primary">
      <LoginForm />
    </div>
  );
}
