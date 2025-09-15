'use client';

import { cn } from '../lib/utils';
import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'loading';
  children: React.ReactNode;
}

export function PrimaryButton({ 
  variant = 'default', 
  children, 
  className, 
  disabled,
  ...props 
}: PrimaryButtonProps) {
  const isLoading = variant === 'loading';

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200',
        'bg-primary hover:bg-blue-700 text-white',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
}
