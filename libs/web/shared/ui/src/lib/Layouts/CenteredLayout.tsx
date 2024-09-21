export function CenteredLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-primary">{children}</div>;
}
