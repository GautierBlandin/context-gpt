import { cn } from '../cn';

export const Paragraph = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn(className)}>{children}</div>;
};

export const paragraph = {
  render: 'Paragraph',
};
