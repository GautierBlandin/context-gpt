import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './ChatInput';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { withContainer } from '../storybook-utils/container';

const meta: Meta<typeof ChatInput> = {
  component: ChatInput,
  title: 'ChatInput',
  decorators: [withContainer],
};
export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {
    value: 'Welcome to ChatInput!',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to ChatInput!/gi)).toBeTruthy();
  },
};

export const LotOfText: Story = {
  args: {
    value:
      'This is a very long input text that simulates a user typing a lot of content into the chat input. It helps to test how the component handles and displays large amounts of text. Does it wrap properly? Does it expand? Does it maintain good usability with a lot of content? These are all important aspects to consider when dealing with chat interfaces where users might type lengthy messages.',
  },
};

export const LotLotOfText: Story = {
  args: {
    value: `This is an extremely long input text that simulates a user typing an enormous amount of content into the chat input. It's designed to push the limits of how the component handles and displays exceptionally large amounts of text.

    We want to ensure that the component can gracefully handle such extreme cases. Does it still wrap properly with this much text? Does it expand appropriately, or does it reach a maximum height and then scroll? How does it affect the overall layout of the page? Does it maintain good usability and readability with this excessive amount of content?

    Testing with this much text helps us identify any potential issues or breaking points in our design. It's particularly important for chat interfaces where some users might paste large chunks of text, code snippets, or very detailed messages.

    Edge cases like this help us ensure our component is robust and can handle a wide variety of user inputs without breaking or becoming unusable. It's always better to over-prepare and handle these extreme scenarios gracefully, even if they might be rare in real-world usage.`,
  },
};

export const SubmitDisabled: Story = {
  args: {
    submitDisabled: true,
  },
};
