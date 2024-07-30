import type { Meta, StoryObj } from '@storybook/react';
import { SheetFooter } from './sheet';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SheetFooter> = {
  component: SheetFooter,
  title: 'SheetFooter',
};
export default meta;
type Story = StoryObj<typeof SheetFooter>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to SheetFooter!/gi)).toBeTruthy();
  },
};
