import type { Meta, StoryObj } from '@storybook/react';
import { Loader } from './Loader';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { withContainer } from '../storybook-utils/container';

const meta: Meta<typeof Loader> = {
  component: Loader,
  title: 'Loader',
  decorators: [withContainer],
};
export default meta;
type Story = StoryObj<typeof Loader>;

export const Small: Story = {
  args: {
    size: 'small',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loader = canvas.getByRole('status');
    expect(loader).toBeTruthy();
    expect(loader.classList.contains('w-4')).toBeTruthy();
    expect(loader.classList.contains('h-4')).toBeTruthy();
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loader = canvas.getByRole('status');
    expect(loader).toBeTruthy();
    expect(loader.classList.contains('w-8')).toBeTruthy();
    expect(loader.classList.contains('h-8')).toBeTruthy();
  },
};

export const Large: Story = {
  args: {
    size: 'large',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loader = canvas.getByRole('status');
    expect(loader).toBeTruthy();
    expect(loader.classList.contains('w-12')).toBeTruthy();
    expect(loader.classList.contains('h-12')).toBeTruthy();
  },
};
