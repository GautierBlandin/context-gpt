import React from 'react';
import { useLoginForm } from './LoginForm.state';
import { SubmitButton, TextInput } from '@context-gpt/shared/ui';
import { Result } from '@context-gpt/errors';

interface LoginFormProps {
  onLogin: (args: { email: string; password: string }) => Promise<Result<void, string>>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const { email, setEmail, password, setPassword, error, onSubmit } = useLoginForm({ login: onLogin });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="space-y-6 max-w-sm mx-auto"
    >
      <TextInput label="Email" type="email" value={email} setValue={setEmail} required autoComplete="email" />
      <TextInput
        label="Password"
        type="password"
        value={password}
        setValue={setPassword}
        required
        autoComplete="current-password"
      />
      {error && <p className="text-error-primary text-sm">{error}</p>}
      <SubmitButton onClick={onSubmit}>Log in</SubmitButton>
    </form>
  );
};
