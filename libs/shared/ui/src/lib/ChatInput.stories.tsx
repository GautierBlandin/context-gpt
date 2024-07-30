import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './ChatInput';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { withContainer } from '../storybook-utils/container';

const meta: Meta<typeof ChatInput> = {
  component: ChatInput,
  title: 'ChatInput',
  decorators: [withContainer],
};
export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {
    value: 'Welcome to ChatInput!',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to ChatInput!/gi)).toBeTruthy();
  },
};

export const SubmitDisabled: Story = {
  args: {
    submitDisabled: true,
  },
};
