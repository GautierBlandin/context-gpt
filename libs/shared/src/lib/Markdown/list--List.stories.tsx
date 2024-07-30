import type { Meta, StoryObj } from '@storybook/react';
import { List } from './list';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof List> = {
  component: List,
  title: 'List',
};
export default meta;
type Story = StoryObj<typeof List>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to List!/gi)).toBeTruthy();
  },
};
