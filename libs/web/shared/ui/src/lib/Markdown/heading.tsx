import React from 'react';
import { cn } from '../cn';

interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ children, level, className }) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;

  const styles = {
    h1: 'text-4xl font-bold mb-4',
    h2: 'text-3xl font-semibold mb-3',
    h3: 'text-2xl font-medium mb-2',
    h4: 'text-xl font-medium mb-2',
    h5: 'text-lg font-medium mb-1',
    h6: 'text-base font-medium mb-1',
  };

  return <Component className={cn(styles[`h${level}`], className)}>{children}</Component>;
};

export const heading = {
  render: 'Heading',
  attributes: {
    level: { type: Number, required: true },
  },
};
