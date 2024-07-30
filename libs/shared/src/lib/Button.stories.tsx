import type { Meta, StoryObj } from '@storybook/react';
import { SubmitButton } from './Button';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SubmitButton> = {
  component: SubmitButton,
  title: 'SubmitButton',
};
export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to SubmitButton!/gi)).toBeTruthy();
  },
};
