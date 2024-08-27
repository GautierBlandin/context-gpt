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
  return (
    <Component className={cn(className, 'pl-10', 'py-2', ordered ? 'list-decimal' : 'list-disc')}>{children}</Component>
  );
};

export const list = {
  render: 'List',
  attributes: {
    ordered: { type: Boolean },
  },
};
