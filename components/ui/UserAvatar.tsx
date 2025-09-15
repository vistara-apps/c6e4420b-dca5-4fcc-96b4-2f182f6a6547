import React from 'react';
import { clsx } from 'clsx';

interface UserAvatarProps {
  user: {
    userId: string;
    username: string;
    profilePicUrl?: string;
  };
  variant?: 'default' | 'small';
  className?: string;
}

export function UserAvatar({ user, variant = 'default', className }: UserAvatarProps) {
  const size = variant === 'small' ? 'w-8 h-8' : 'w-12 h-12';

  return (
    <div className={clsx('relative', size, className)}>
      {user.profilePicUrl ? (
        <img
          src={user.profilePicUrl}
          alt={user.username}
          className={clsx('w-full h-full rounded-full object-cover', size)}
        />
      ) : (
        <div className={clsx(
          'w-full h-full rounded-full bg-accent flex items-center justify-center text-white font-semibold',
          size
        )}>
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

