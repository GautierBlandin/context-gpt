import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { Loader, SubmitButton, TextInput } from '@context-gpt/shared/ui';
import { authenticationStore } from './Authentication.store';
import { AuthenticationStateType } from '../core';

export function LoginForm() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useSnapshot(authenticationStore);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await authenticationStore.submitToken({ token });
    } catch (err) {
      setError('Failed to validate token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (auth.authState.type === AuthenticationStateType.Authenticated) {
    return <Loader size="large" />;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-4"
      >
        <TextInput
          label="Access Token"
          value={token}
          setValue={setToken}
          type="password"
          disabled={isLoading}
          required
        />
        <SubmitButton onClick={handleSubmit} disabled={isLoading || !token}>
          {isLoading ? <Loader size="small" /> : 'Login'}
        </SubmitButton>
      </form>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
