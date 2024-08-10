'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnapshot } from 'valtio';
import { authenticationStore } from './Authentication.store';
import { AuthenticationStateType } from '../core';
import { Loader } from '@context-gpt/shared/ui';

export function withAuth<PROPS extends React.JSX.IntrinsicAttributes>(WrappedComponent: React.ComponentType<PROPS>) {
  return function AuthenticatedComponent(props: PROPS) {
    const router = useRouter();
    const auth = useSnapshot(authenticationStore);

    useEffect(() => {
      if (auth.authState.type === AuthenticationStateType.PreInitialization) {
        authenticationStore.initialize();
      }
    }, [auth]);

    useEffect(() => {
      if (auth.authState.type === AuthenticationStateType.Anonymous) {
        router.push('/login');
      }
    }, [auth.authState, router]);

    if (auth.authState.type !== AuthenticationStateType.Authenticated) {
      return <Loader size="large" />;
    }

    return <WrappedComponent {...props} />;
  };
}