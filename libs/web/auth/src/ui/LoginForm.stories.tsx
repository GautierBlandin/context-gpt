import { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './LoginForm';
import { Result } from '@context-gpt/errors';
import { userEvent, within } from '@storybook/testing-library';

const meta: Meta<typeof LoginForm> = {
  component: LoginForm,
  title: 'Auth/LoginForm',
  argTypes: {
    onLogin: { action: 'onLogin' },
  },
};

export default meta;
type Story = StoryObj<typeof LoginForm>;

const mockLoginSuccess = async (): Promise<Result<void, string>> => {
  return { type: 'success', value: undefined };
};

const mockLoginError = async (): Promise<Result<void, string>> => {
  return { type: 'error', error: 'Email or password is incorrect' };
};

export const Default: Story = {
  args: {
    onLogin: mockLoginSuccess,
  },
};

export const SuccessfulLogin: Story = {
  args: {
    onLogin: mockLoginSuccess,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText('Email');
    const passwordInput = canvas.getByLabelText('Password');
    const submitButton = canvas.getByRole('button', { name: 'Log in' });

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
  },
};

export const LoginError: Story = {
  args: {
    onLogin: mockLoginError,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText('Email');
    const passwordInput = canvas.getByLabelText('Password');
    const submitButton = canvas.getByRole('button', { name: 'Log in' });

    await userEvent.type(emailInput, 'invalid@example.com');
    await userEvent.type(passwordInput, 'wrongpassword');
    await userEvent.click(submitButton);
  },
};
