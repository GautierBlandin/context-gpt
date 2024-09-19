// TODO: Completely refactor this component once ui/LoginForm is done
import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { useForm } from 'react-hook-form';
import { Loader, SubmitButton, TextInput } from '@context-gpt/shared/ui';
import { authenticationStore } from '../Authentication.store';
import { AuthenticationStateType } from '../../core';

interface LoginFormInputs {
  email: string;
  password: string;
}

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const auth = useSnapshot(authenticationStore);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    mode: 'onChange',
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authenticationStore.login(data);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (auth.authState.type === AuthenticationStateType.Authenticated) {
    return <Loader size="large" />;
  }

  return (
    <div className="p-8 rounded-lg shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-center">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label="Email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          error={errors.email?.message}
          disabled={isLoading}
        />
        <TextInput
          label="Password"
          type="password"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
          error={errors.password?.message}
          disabled={isLoading}
        />
        <SubmitButton onClick={handleSubmit(onSubmit)} disabled={isLoading || !isValid}>
          {isLoading ? <Loader size="small" /> : 'Login'}
        </SubmitButton>
      </form>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
