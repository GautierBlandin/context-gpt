import React from 'react';
import { useRegisterForm } from './RegisterForm.state';
import { SubmitButton, TextInput } from '@context-gpt/shared/ui';
import { Result } from '@context-gpt/errors';

interface RegisterFormProps {
  onRegister: (args: { email: string; password: string }) => Promise<Result<void, string>>;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const { email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, error, onSubmit } =
    useRegisterForm({ register: onRegister });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
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
        autoComplete="new-password"
      />
      <TextInput
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        setValue={setConfirmPassword}
        required
        autoComplete="new-password"
      />
      {error && <p className="text-error-primary text-sm">{error}</p>}
      <SubmitButton onClick={onSubmit}>Register</SubmitButton>
    </form>
  );
};
