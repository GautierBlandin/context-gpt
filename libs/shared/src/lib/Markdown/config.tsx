import { Config } from '@markdoc/markdoc';
import { fence } from './code-block';
import { paragraph } from './paragraph';
import { list } from './list';

export const citationConfig: Config = {
  nodes: {
    paragraph,
    fence,
    list,
  },
};
