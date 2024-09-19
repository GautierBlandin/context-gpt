import { describe, expect, it, Mock, vi } from 'vitest';
import { LoginFormState } from './useLoginForm';

describe('LoginFormState', () => {
  let loginFormState: LoginFormState;
  let mockLogin: Mock;

  beforeEach(() => {
    mockLogin = vi.fn();
    loginFormState = new LoginFormState(mockLogin);
  });

  it('initializes with empty email and password', () => {
    expect(loginFormState.email).toBe('');
    expect(loginFormState.password).toBe('');
    expect(loginFormState.error).toBeNull();
  });

  it('updates email', () => {
    loginFormState.setEmail('test@example.com');
    expect(loginFormState.email).toBe('test@example.com');
  });

  it('updates password', () => {
    loginFormState.setPassword('password123');
    expect(loginFormState.password).toBe('password123');
  });

  it('calls login function and handles success', async () => {
    mockLogin.mockResolvedValue({ type: 'success', value: undefined });
    loginFormState.setEmail('test@example.com');
    loginFormState.setPassword('password123');

    await loginFormState.onSubmit();

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(loginFormState.error).toBeNull();
  });

  it('calls login function and handles error', async () => {
    const errorMessage = 'Invalid credentials';
    mockLogin.mockResolvedValue({ type: 'error', error: errorMessage });
    loginFormState.setEmail('test@example.com');
    loginFormState.setPassword('password123');

    await loginFormState.onSubmit();

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(loginFormState.error).toBe(errorMessage);
  });
});
