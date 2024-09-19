import { Result } from '@context-gpt/errors';
import { proxy, useSnapshot } from 'valtio';

export function useLoginForm({ login }: UseLoginFormInput): UseLoginFormOutput {
  const loginFormState = proxy(new LoginFormState(login));
  const snapshot = useSnapshot(loginFormState);

  return {
    onSubmit: () => loginFormState.onSubmit(),
    email: snapshot.email,
    setEmail: (email: string) => loginFormState.setEmail(email),
    password: snapshot.password,
    setPassword: (password: string) => loginFormState.setPassword(password),
    error: snapshot.error,
  };
}

interface UseLoginFormInput {
  login(args: { email: string; password: string }): Promise<Result<void, string>>;
}

interface UseLoginFormOutput {
  onSubmit: () => Promise<void>;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string | null;
}

export class LoginFormState {
  public email: string;
  public password: string;
  public error: string | null;

  private loginFn: (args: { email: string; password: string }) => Promise<Result<void, string>>;

  constructor(loginFn: (args: { email: string; password: string }) => Promise<Result<void, string>>) {
    this.loginFn = loginFn;
    this.email = '';
    this.password = '';
    this.error = null;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPassword(password: string): void {
    this.password = password;
  }

  async onSubmit(): Promise<void> {
    const result = await this.loginFn({ email: this.email, password: this.password });
    if (result.type === 'error') {
      this.error = result.error;
    } else {
      this.error = null;
    }
  }
}
