import type { Meta, StoryObj } from '@storybook/react';
import { SheetDescription } from './sheet';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SheetDescription> = {
  component: SheetDescription,
  title: 'SheetDescription',
};
export default meta;
type Story = StoryObj<typeof SheetDescription>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to SheetDescription!/gi)).toBeTruthy();
  },
};
