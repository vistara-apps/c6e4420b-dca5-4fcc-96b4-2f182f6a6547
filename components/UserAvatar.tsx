'use client';

import { cn } from '../lib/utils';

interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'w-8 h-8',
  default: 'w-10 h-10',
  large: 'w-12 h-12',
};

export function UserAvatar({ src, alt, size = 'default', className }: UserAvatarProps) {
  return (
    <div className={cn(
      'rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={cn('rounded-full object-cover', sizeClasses[size])}
        />
      ) : (
        <span className="text-white font-semibold text-sm">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
