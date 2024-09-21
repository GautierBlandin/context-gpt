import { Result } from '@context-gpt/errors';
import { proxy, useSnapshot } from 'valtio';
import { useRef } from 'react';

export function useRegisterForm({ register }: UseRegisterFormInput): UseRegisterFormOutput {
  const registerFormState = useRef(proxy(new RegisterFormState(register)));
  const snapshot = useSnapshot(registerFormState.current);

  return {
    onSubmit: () => registerFormState.current.onSubmit(),
    email: snapshot.email,
    setEmail: (email: string) => registerFormState.current.setEmail(email),
    password: snapshot.password,
    setPassword: (password: string) => registerFormState.current.setPassword(password),
    confirmPassword: snapshot.confirmPassword,
    setConfirmPassword: (confirmPassword: string) => registerFormState.current.setConfirmPassword(confirmPassword),
    error: snapshot.error,
    hasSuccessfullyRegistered: snapshot.hasSuccessfullyRegistered,
  };
}

interface UseRegisterFormInput {
  register(args: { email: string; password: string }): Promise<Result<void, string>>;
}

interface UseRegisterFormOutput {
  onSubmit: () => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  error: string | null;
  hasSuccessfullyRegistered: boolean;
}

export class RegisterFormState {
  public email: string;
  public password: string;
  public confirmPassword: string;
  public error: string | null;
  public hasSuccessfullyRegistered;

  private registerFn: (args: { email: string; password: string }) => Promise<Result<void, string>>;

  constructor(registerFn: (args: { email: string; password: string }) => Promise<Result<void, string>>) {
    this.registerFn = registerFn;
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.error = null;
    this.hasSuccessfullyRegistered = false;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  public async onSubmit(): Promise<void> {
    const validationError = this.validateForm();
    if (validationError) {
      this.error = validationError;
      return;
    }

    const result = await this.registerFn({ email: this.email, password: this.password });
    if (result.type === 'error') {
      this.error = result.error;
    } else {
      this.hasSuccessfullyRegistered = true;
      this.resetFormFields();
      this.error = null;
    }
  }

  setConfirmPassword(confirmPassword: string): void {
    this.confirmPassword = confirmPassword;
  }

  private validateForm(): string | null {
    if (!this.email || !this.password || !this.confirmPassword) {
      return 'All fields are required';
    }
    if (!/@/.test(this.email)) {
      return 'Invalid email format';
    }
    if (this.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (this.password !== this.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  }

  private resetFormFields(): void {
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.error = null;
  }
}
