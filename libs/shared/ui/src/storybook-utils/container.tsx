import type { Decorator } from '@storybook/react';

export const withContainer: Decorator = (Story) => (
  <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
    <Story />
  </div>
);
