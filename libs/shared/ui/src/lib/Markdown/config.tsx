// Dev/context-gpt/libs/shared/ui/src/lib/Markdown/config.tsx

import { Config } from '@markdoc/markdoc';
import { fence } from './code-block';
import { paragraph } from './paragraph';
import { list } from './list';
import { heading } from './heading'; // Add this import

export const markdownConfig: Config = {
  nodes: {
    paragraph,
    fence,
    list,
    heading,
  },
};
