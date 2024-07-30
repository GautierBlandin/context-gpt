import { Config } from '@markdoc/markdoc';
import { fence } from './code-block';
import { paragraph } from './paragraph';
import { list } from './list';

export const markdownConfig: Config = {
  nodes: {
    paragraph,
    fence,
    list,
  },
};
