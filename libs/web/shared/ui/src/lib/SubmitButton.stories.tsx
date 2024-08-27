import type { Meta, StoryObj } from '@storybook/react';
import { SubmitButton } from './SubmitButton';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { withContainer } from '../storybook-utils/container';

const meta: Meta<typeof SubmitButton> = {
  component: SubmitButton,
  title: 'SubmitButton',
  decorators: [withContainer],
};
export default meta;
type Story = StoryObj<typeof SubmitButton>;

export const Primary: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText('Submit')).toBeTruthy();
  },
};
