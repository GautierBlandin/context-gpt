import type { Meta, StoryObj } from '@storybook/react';
import { Paragraph } from './paragraph';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Paragraph> = {
  component: Paragraph,
  title: 'Paragraph',
};
export default meta;
type Story = StoryObj<typeof Paragraph>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Paragraph!/gi)).toBeTruthy();
  },
};
