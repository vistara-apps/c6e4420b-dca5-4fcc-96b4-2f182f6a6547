import React from 'react';
import { clsx } from 'clsx';
import { UserAvatar } from './UserAvatar';
import { TrendingUp, Users, MessageCircle } from 'lucide-react';

interface InsightCardProps {
  insight: {
    postId: string;
    content: string;
    timestamp: string;
    likesCount: number;
    repliesCount: number;
    isBoosted: boolean;
    boostCost?: number;
    user: {
      userId: string;
      username: string;
      profilePicUrl?: string;
      farcasterId?: string;
    };
    match?: {
      matchId: string;
      teams: string[];
      league: string;
      status: string;
    };
  };
  variant?: 'default';
  onLike?: (postId: string) => void;
  onReply?: (postId: string) => void;
  onShare?: (postId: string) => void;
  isLiked?: boolean;
}

export function InsightCard({
  insight,
  variant = 'default',
  onLike,
  onReply,
  onShare,
  isLiked = false
}: InsightCardProps) {
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

  return (
    <div className="bg-surface rounded-lg p-4 shadow-card border border-primary/10">
      <div className="flex items-start gap-3 mb-3">
        <UserAvatar user={insight.user} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-primary">{insight.user.username}</span>
            {insight.user.farcasterId && (
              <span className="text-sm text-primary/60">@{insight.user.farcasterId}</span>
            )}
            <span className="text-sm text-primary/60">·</span>
            <span className="text-sm text-primary/60">{formatTime(insight.timestamp)}</span>
          </div>

          {insight.match && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-primary/60">
                {insight.match.teams.join(' vs ')} • {insight.match.league}
              </span>
              <span className={clsx(
                'px-2 py-1 rounded-full text-xs font-medium',
                insight.match.status === 'live' ? 'bg-accent text-white' : 'bg-primary/20 text-primary'
              )}>
                {insight.match.status}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 mb-3">
        <TrendingUp className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <p className="text-body leading-7">{insight.content}</p>
      </div>

      {insight.isBoosted && insight.boostCost && (
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-1 rounded text-xs font-medium bg-accent text-white">
            Boosted for {insight.boostCost} tokens
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onLike?.(insight.postId)}
            className={clsx(
              'flex items-center gap-1 text-sm transition-colors',
              isLiked ? 'text-accent' : 'text-primary/60 hover:text-accent'
            )}
          >
            <TrendingUp className="w-4 h-4" />
            {insight.likesCount > 0 && <span>{insight.likesCount}</span>}
          </button>

          <button
            onClick={() => onReply?.(insight.postId)}
            className="flex items-center gap-1 text-sm text-primary/60 hover:text-primary transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {insight.repliesCount > 0 && <span>{insight.repliesCount}</span>}
          </button>
        </div>

        <button
          onClick={() => onShare?.(insight.postId)}
          className="flex items-center gap-1 text-sm text-primary/60 hover:text-primary transition-colors"
        >
          <Users className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}

