import type { Meta, StoryObj } from '@storybook/react';
import { TextInput } from './TextInput';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof TextInput> = {
  component: TextInput,
  title: 'TextInput',
};
export default meta;
type Story = StoryObj<typeof TextInput>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to TextInput!/gi)).toBeTruthy();
  },
};
