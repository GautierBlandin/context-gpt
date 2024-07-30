import type { Meta, StoryObj } from '@storybook/react';
import { ListItem } from './list';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof ListItem> = {
  component: ListItem,
  title: 'ListItem',
};
export default meta;
type Story = StoryObj<typeof ListItem>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to ListItem!/gi)).toBeTruthy();
  },
};
