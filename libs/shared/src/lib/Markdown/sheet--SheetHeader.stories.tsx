import type { Meta, StoryObj } from '@storybook/react';
import { SheetHeader } from './sheet';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SheetHeader> = {
  component: SheetHeader,
  title: 'SheetHeader',
};
export default meta;
type Story = StoryObj<typeof SheetHeader>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to SheetHeader!/gi)).toBeTruthy();
  },
};
