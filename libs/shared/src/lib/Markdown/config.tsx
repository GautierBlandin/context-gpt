import { Config } from '@markdoc/markdoc';
import { fence } from './code-block';
import { paragraph } from './paragraph';

export const citationConfig: Config = {
  nodes: {
    paragraph,
    fence,
  },
};
