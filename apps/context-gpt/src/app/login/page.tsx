'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnapshot } from 'valtio';
import { AuthenticationStateType, authenticationStore, LoginForm } from '@context-gpt/authentication';

export default function LoginPage() {
  const router = useRouter();
  const auth = useSnapshot(authenticationStore);

  useEffect(() => {
    if (auth.authState.type === AuthenticationStateType.Authenticated) {
      router.back();
    }
  }, [auth.authState, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <LoginForm />
    </div>
  );
}
