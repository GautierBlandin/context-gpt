import type { Meta, StoryObj } from '@storybook/react';
import { SheetTitle } from './sheet';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof SheetTitle> = {
  component: SheetTitle,
  title: 'SheetTitle',
};
export default meta;
type Story = StoryObj<typeof SheetTitle>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to SheetTitle!/gi)).toBeTruthy();
  },
};
