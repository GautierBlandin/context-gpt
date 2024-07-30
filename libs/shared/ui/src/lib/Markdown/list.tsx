import React from 'react';
import { cn } from '../cn';

export const List = ({
  children,
  ordered,
  className,
}: {
  children: React.ReactNode;
  ordered: boolean;
  className?: string;
}) => {
  const Component = ordered ? 'ol' : 'ul';
  return <Component className={cn(className, 'pl-6', ordered ? 'list-decimal' : 'list-disc')}>{children}</Component>;
};

export const ListItem = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <li className={cn(className, 'mb-1')}>{children}</li>;
};

export const list = {
  render: 'List',
  attributes: {
    ordered: { type: Boolean },
  },
};

export const listItem = {
  render: 'ListItem',
};
