'use client';

import { Heart, MessageSquare, TrendingUp } from 'lucide-react';
import { Post } from '../lib/types';
import { formatTimeAgo } from '../lib/utils';
import { UserAvatar } from './UserAvatar';
import { cn } from '../lib/utils';

interface InsightCardProps {
  post: Post;
  variant?: 'default' | 'compact';
}

export function InsightCard({ post, variant = 'default' }: InsightCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div className={cn(
      'bg-dark-card rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer',
      isCompact ? 'p-3' : 'p-4'
    )}>
      <div className="flex items-start space-x-3">
        <UserAvatar 
          src={post.user?.profilePicUrl}
          alt={post.user?.username || 'User'}
          size={isCompact ? 'small' : 'default'}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className={cn(
              'font-semibold text-white',
              isCompact ? 'text-sm' : 'text-base'
            )}>
              {post.user?.username || 'Anonymous'}
            </span>
            <span className={cn(
              'text-gray-500',
              isCompact ? 'text-xs' : 'text-sm'
            )}>
              {formatTimeAgo(post.timestamp)}
            </span>
            {post.type === 'insight' && (
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                💡
              </span>
            )}
          </div>
          
          <p className={cn(
            'text-gray-100 mb-3 leading-relaxed',
            isCompact ? 'text-sm line-clamp-2' : 'text-base'
          )}>
            {post.content}
          </p>
          
          <div className="flex items-center space-x-4 text-gray-400">
            <button className="flex items-center space-x-1 hover:text-red-400 transition-all duration-200">
              <Heart className={cn('w-4 h-4', isCompact && 'w-3 h-3')} />
              <span className={cn(isCompact ? 'text-xs' : 'text-sm')}>
                {post.likes}
              </span>
            </button>
            
            <button className="flex items-center space-x-1 hover:text-blue-400 transition-all duration-200">
              <MessageSquare className={cn('w-4 h-4', isCompact && 'w-3 h-3')} />
              <span className={cn(isCompact ? 'text-xs' : 'text-sm')}>
                {post.replies}
              </span>
            </button>
            
            {post.type === 'insight' && (
              <div className="flex items-center space-x-1 text-accent">
                <TrendingUp className={cn('w-4 h-4', isCompact && 'w-3 h-3')} />
                <span className={cn(isCompact ? 'text-xs' : 'text-sm')}>
                  Trending
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
