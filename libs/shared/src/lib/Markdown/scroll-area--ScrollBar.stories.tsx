import type { Meta, StoryObj } from '@storybook/react';
import { ScrollBar } from './scroll-area';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof ScrollBar> = {
  component: ScrollBar,
  title: 'ScrollBar',
};
export default meta;
type Story = StoryObj<typeof ScrollBar>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to ScrollBar!/gi)).toBeTruthy();
  },
};
