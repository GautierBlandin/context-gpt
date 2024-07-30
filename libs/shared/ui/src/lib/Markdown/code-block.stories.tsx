import type { Meta, StoryObj } from '@storybook/react';
import { CodeBlock } from './code-block';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof CodeBlock> = {
  component: CodeBlock,
  title: 'CodeBlock',
};
export default meta;
type Story = StoryObj<typeof CodeBlock>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to CodeBlock!/gi)).toBeTruthy();
  },
};
