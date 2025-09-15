import React from 'react';
import { clsx } from 'clsx';

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
  return (
    <button
      className={clsx(
        'px-6 py-3 rounded-lg font-semibold transition-all duration-250 ease-cubic-bezier',
        'shadow-card hover:shadow-lg active:shadow-sm',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        {
          'bg-primary text-white hover:bg-primary/90 active:bg-primary/80': variant === 'default',
          'bg-surface text-primary cursor-not-allowed opacity-60': variant === 'loading' || disabled,
        },
        className
      )}
      disabled={variant === 'loading' || disabled}
      {...props}
    >
      {variant === 'loading' ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
}

