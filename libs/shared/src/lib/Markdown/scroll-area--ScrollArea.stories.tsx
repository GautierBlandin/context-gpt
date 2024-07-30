import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './scroll-area';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof ScrollArea> = {
  component: ScrollArea,
  title: 'ScrollArea',
};
export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to ScrollArea!/gi)).toBeTruthy();
  },
};
