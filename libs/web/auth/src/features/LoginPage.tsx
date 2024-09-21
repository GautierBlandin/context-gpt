import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { authenticationStore } from './Authentication.store';
import { LoginFormController } from './LoginFormController';
import { AuthenticationStateType } from '../core';
import { CenteredLayout } from '@context-gpt/shared/ui';

export function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useSnapshot(authenticationStore);

  // Redirect to the previous page when the user is authenticated
  useEffect(() => {
    if (auth.authState.type === AuthenticationStateType.Authenticated) {
      navigate(location.state?.from ?? '/');
    }
  }, [auth.authState, navigate, location]);

  return (
    <CenteredLayout>
      <LoginFormController />
    </CenteredLayout>
  );
}
