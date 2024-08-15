import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnapshot } from 'valtio';
import { authenticationStore } from './Authentication.store';
import { AuthenticationStateType } from '../core';
import { Loader } from '@context-gpt/shared/ui';

export function withAuth<PROPS extends React.JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<PROPS>) {
  return function AuthenticatedComponent(props: PROPS) {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useSnapshot(authenticationStore);

    useEffect(() => {
      if (auth.authState.type === AuthenticationStateType.PreInitialization) {
        authenticationStore.initialize();
      }
    }, [auth]);

    useEffect(() => {
      if (auth.authState.type === AuthenticationStateType.Anonymous) {
        navigate('/login', { state: { from: location }, replace: true });
      }
    }, [auth.authState, navigate, location]);

    if (auth.authState.type !== AuthenticationStateType.Authenticated) {
      return <Loader size="large" />;
    }

    return <WrappedComponent {...props} />;
  };
}
