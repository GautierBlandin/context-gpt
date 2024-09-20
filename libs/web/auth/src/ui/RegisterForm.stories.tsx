import { Meta, StoryObj } from '@storybook/react';
import { RegisterForm } from './RegisterForm';
import { Result } from '@context-gpt/errors';
import { userEvent, within } from '@storybook/testing-library';

const meta: Meta<typeof RegisterForm> = {
  component: RegisterForm,
  title: 'Auth/RegisterForm',
  argTypes: {
    onRegister: { action: 'onRegister' },
  },
};

export default meta;
type Story = StoryObj<typeof RegisterForm>;

const mockRegisterSuccess = async (): Promise<Result<void, string>> => {
  return { type: 'success', value: undefined };
};

const mockRegisterError = async (): Promise<Result<void, string>> => {
  return { type: 'error', error: 'Registration failed. Please try again.' };
};

export const Default: Story = {
  args: {
    onRegister: mockRegisterSuccess,
  },
};

export const SuccessfulRegistration: Story = {
  args: {
    onRegister: mockRegisterSuccess,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText('Email');
    const passwordInput = canvas.getByLabelText('Password');
    const confirmPasswordInput = canvas.getByLabelText('Confirm Password');
    const submitButton = canvas.getByRole('button', { name: 'Register' });

    await userEvent.type(emailInput, 'newuser@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);
  },
};

export const RegistrationError: Story = {
  args: {
    onRegister: mockRegisterError,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText('Email');
    const passwordInput = canvas.getByLabelText('Password');
    const confirmPasswordInput = canvas.getByLabelText('Confirm Password');
    const submitButton = canvas.getByRole('button', { name: 'Register' });

    await userEvent.type(emailInput, 'existinguser@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password123');
    await userEvent.click(submitButton);
  },
};

export const ValidationError: Story = {
  args: {
    onRegister: mockRegisterSuccess,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emailInput = canvas.getByLabelText('Email');
    const passwordInput = canvas.getByLabelText('Password');
    const confirmPasswordInput = canvas.getByLabelText('Confirm Password');
    const submitButton = canvas.getByRole('button', { name: 'Register' });

    await userEvent.type(emailInput, 'invaliduser@example');
    await userEvent.type(passwordInput, 'short');
    await userEvent.type(confirmPasswordInput, 'notmatching');
    await userEvent.click(submitButton);
  },
};
