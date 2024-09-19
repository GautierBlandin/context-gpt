import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'TextInput',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    setValue: { action: 'setValue' },
  },
};

export default meta;
type Story = StoryObj<typeof TextInput>;

export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Email',
    value: 'user@example.com',
    placeholder: 'Enter your email',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    value: 'This input is disabled',
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'Error Input',
    value: 'Invalid input',
    error: 'This input is invalid',
  },
};
