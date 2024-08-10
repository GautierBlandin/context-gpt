import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';
import { withContainer } from '../storybook-utils/container';

const meta: Meta<typeof Loader> = {
  component: Loader,
  title: 'Loader',
  tags: ['autodocs'],
  decorators: [withContainer],
};
export default meta;
type Story = StoryObj<typeof Loader>;

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
};
