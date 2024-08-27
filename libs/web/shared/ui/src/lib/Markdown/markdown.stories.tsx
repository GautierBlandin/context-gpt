import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from './markdown';
import { withContainer } from '../../storybook-utils/container';

const meta: Meta<typeof Markdown> = {
  component: Markdown,
  title: 'Markdown',
  decorators: [withContainer],
};

export default meta;
type Story = StoryObj<typeof Markdown>;

export const Primary: Story = {
  args: {
    content: '# Hello, Markdown!\n\nThis is a sample markdown content.',
  },
};

export const WithCodeBlock: Story = {
  args: {
    content: `
# Advanced Markdown with Code Blocks

In this example, we'll explore various features of markdown, including a more complex code block and additional text.

## Introduction

Markdown is a lightweight markup language that you can use to add formatting elements to plaintext text documents. It's widely used for documentation, README files, and even in content management systems.

## Code Example

Here's a more comprehensive code block demonstrating a React component:

\`\`\`jsx
import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return \`\${minutes.toString().padStart(2, '0')}:\${remainingSeconds.toString().padStart(2, '0')}\`;
  };

  return (
    <div>
      <h2>Timer: {formatTime(seconds)}</h2>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
};

export default Timer;
\`\`\`

## Explanation

The code above demonstrates a simple React component that implements a timer. Here's a breakdown of its functionality:

1. We use the \`useState\` hook to manage the \`seconds\` state.
2. The \`useEffect\` hook is used to set up an interval that increments the seconds every 1000ms (1 second).
3. We define a \`formatTime\` function to convert the total seconds into a MM:SS format.
4. The component renders the formatted time and a reset button.

## Conclusion

This example showcases how you can create interactive components in React using hooks. It's a simple yet effective demonstration of state management and side effects in functional components.

Remember, when working with timers or any side effects in React, it's crucial to clean up to prevent memory leaks. In this case, we're clearing the interval in the cleanup function returned by \`useEffect\`.

---

Feel free to use this markdown content in your projects or documentation. Happy coding!
    `,
  },
};

export const WithList: Story = {
  args: {
    content: `
# Markdown with List

- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2
- Item 3
    `,
  },
};

export const WithNumericList: Story = {
  args: {
    content: `
# Markdown with Numeric List

1. First item
2. Second item
   1. Subitem 2.1
   2. Subitem 2.2
3. Third item
4. Fourth item
    `,
  },
};
