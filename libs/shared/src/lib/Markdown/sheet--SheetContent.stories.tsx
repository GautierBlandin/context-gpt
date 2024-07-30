import type { Meta, StoryObj } from '@storybook/react';
import { SheetContent } from './sheet';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SheetContent> = {
  component: SheetContent,
  title: 'SheetContent',
};
export default meta;
type Story = StoryObj<typeof SheetContent>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to SheetContent!/gi)).toBeTruthy();
  },
};
