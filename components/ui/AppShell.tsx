import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface AppShellProps {
  children: ReactNode;
  variant?: 'default';
  className?: string;
}

export function AppShell({ children, variant = 'default', className }: AppShellProps) {
  return (
    <div className={clsx(
      'min-h-screen bg-bg',
      'flex flex-col',
      className
    )}>
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}

