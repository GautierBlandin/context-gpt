import { describe, expect, it, Mock, vi } from 'vitest';
import { RegisterFormState } from './RegisterForm.state';

describe('RegisterFormState', () => {
  let registerFormState: RegisterFormState;
  let mockRegister: Mock;

  beforeEach(() => {
    mockRegister = vi.fn();
    registerFormState = new RegisterFormState(mockRegister);
  });

  it('initializes with empty fields', () => {
    expect(registerFormState.email).toBe('');
    expect(registerFormState.password).toBe('');
    expect(registerFormState.confirmPassword).toBe('');
    expect(registerFormState.error).toBeNull();
  });

  it('updates fields correctly', () => {
    registerFormState.setEmail('test@example.com');
    registerFormState.setPassword('password123');
    registerFormState.setConfirmPassword('password123');

    expect(registerFormState.email).toBe('test@example.com');
    expect(registerFormState.password).toBe('password123');
    expect(registerFormState.confirmPassword).toBe('password123');
  });

  it('validates form fields', async () => {
    registerFormState.setEmail('invalid-email');
    registerFormState.setPassword('short');
    registerFormState.setConfirmPassword('notmatching');

    await registerFormState.onSubmit();
    expect(registerFormState.error).toBe('Invalid email format');

    registerFormState.setEmail('valid@example.com');
    await registerFormState.onSubmit();
    expect(registerFormState.error).toBe('Password must be at least 8 characters long');

    registerFormState.setPassword('validpassword');
    await registerFormState.onSubmit();
    expect(registerFormState.error).toBe('Passwords do not match');
  });

  it('calls register function and handles success', async () => {
    mockRegister.mockResolvedValue({ type: 'success', value: undefined });
    registerFormState.setEmail('test@example.com');
    registerFormState.setPassword('password123');
    registerFormState.setConfirmPassword('password123');

    await registerFormState.onSubmit();

    expect(mockRegister).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(registerFormState.error).toBeNull();
  });

  it('calls register function and handles error', async () => {
    const errorMessage = 'Registration failed';
    mockRegister.mockResolvedValue({ type: 'error', error: errorMessage });
    registerFormState.setEmail('test@example.com');
    registerFormState.setPassword('password123');
    registerFormState.setConfirmPassword('password123');

    await registerFormState.onSubmit();

    expect(mockRegister).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(registerFormState.error).toBe(errorMessage);
  });

  it('clears fields and sets isRegistered to true on successful registration', async () => {
    mockRegister.mockResolvedValue({ type: 'success', value: undefined });
    registerFormState.setEmail('test@example.com');
    registerFormState.setPassword('password123');
    registerFormState.setConfirmPassword('password123');

    await registerFormState.onSubmit();

    expect(registerFormState.email).toBe('');
    expect(registerFormState.password).toBe('');
    expect(registerFormState.confirmPassword).toBe('');
    expect(registerFormState.hasSuccessfullyRegistered).toBe(true);
    expect(registerFormState.error).toBeNull();
  });
});
