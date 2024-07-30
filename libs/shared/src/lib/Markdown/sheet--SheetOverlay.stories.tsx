import type { Meta, StoryObj } from '@storybook/react';
import { SheetOverlay } from './sheet';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SheetOverlay> = {
  component: SheetOverlay,
  title: 'SheetOverlay',
};
export default meta;
type Story = StoryObj<typeof SheetOverlay>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to SheetOverlay!/gi)).toBeTruthy();
  },
};
