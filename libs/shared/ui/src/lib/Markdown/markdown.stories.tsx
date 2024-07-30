import type { Meta, StoryObj } from '@storybook/react';
import { Markdown } from './markdown';

const meta: Meta<typeof Markdown> = {
  component: Markdown,
  title: 'Markdown',
  tags: ['autodocs'],
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
# Markdown with Code Block

Here's a sample code block:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`
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
