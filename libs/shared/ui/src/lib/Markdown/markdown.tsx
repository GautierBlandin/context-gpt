import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { CodeBlock } from './code-block';
import { markdownConfig } from './config';
import { Paragraph } from './paragraph';
import { List, ListItem } from './list';

interface Props {
  content: string;
}

export function Markdown({ content }: Props) {
  const ast = Markdoc.parse(content);

  const transformedContent = Markdoc.transform(ast, {
    ...markdownConfig,
  });

  return (
    <>
      {Markdoc.renderers.react(transformedContent, React, {
        components: { Paragraph, CodeBlock, List, ListItem },
      })}
    </>
  );
}
