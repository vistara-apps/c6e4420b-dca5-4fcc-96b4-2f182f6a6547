import React from 'react';
import { clsx } from 'clsx';
import { UserAvatar } from './UserAvatar';
import { Heart, MessageCircle, TrendingUp } from 'lucide-react';

interface MatchChatItemProps {
  post: {
    postId: string;
    content: string;
    type: 'insight' | 'banter' | 'discussion';
    timestamp: string;
    likesCount: number;
    repliesCount: number;
    isBoosted: boolean;
    user: {
      userId: string;
      username: string;
      profilePicUrl?: string;
      farcasterId?: string;
    };
  };
  variant?: 'default' | 'withInsightTag';
  onLike?: (postId: string) => void;
  onReply?: (postId: string) => void;
  isLiked?: boolean;
}

export function MatchChatItem({
  post,
  variant = 'default',
  onLike,
  onReply,
  isLiked = false
}: MatchChatItemProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'insight': return 'bg-accent text-white';
      case 'banter': return 'bg-primary text-white';
      case 'discussion': return 'bg-surface text-primary';
      default: return 'bg-surface text-primary';
    }
  };

  return (
    <div className="bg-surface rounded-lg p-4 shadow-card">
      <div className="flex items-start gap-3">
        <UserAvatar user={post.user} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-primary">{post.user.username}</span>
            {post.user.farcasterId && (
              <span className="text-sm text-primary/60">@{post.user.farcasterId}</span>
            )}
            <span className="text-sm text-primary/60">·</span>
            <span className="text-sm text-primary/60">{formatTime(post.timestamp)}</span>
          </div>

          {variant === 'withInsightTag' && (
            <div className="flex items-center gap-2 mb-2">
              <span className={clsx(
                'px-2 py-1 rounded text-xs font-medium',
                getTypeColor(post.type)
              )}>
                {post.type === 'insight' && <TrendingUp className="w-3 h-3 inline mr-1" />}
                {post.type.charAt(0).toUpperCase() + post.type.slice(1)}
              </span>
              {post.isBoosted && (
                <span className="px-2 py-1 rounded text-xs font-medium bg-accent text-white">
                  Boosted
                </span>
              )}
            </div>
          )}

          <p className="text-body leading-7 mb-3">{post.content}</p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onLike?.(post.postId)}
              className={clsx(
                'flex items-center gap-1 text-sm transition-colors',
                isLiked ? 'text-accent' : 'text-primary/60 hover:text-accent'
              )}
            >
              <Heart className={clsx('w-4 h-4', isLiked && 'fill-current')} />
              {post.likesCount > 0 && <span>{post.likesCount}</span>}
            </button>

            <button
              onClick={() => onReply?.(post.postId)}
              className="flex items-center gap-1 text-sm text-primary/60 hover:text-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {post.repliesCount > 0 && <span>{post.repliesCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

