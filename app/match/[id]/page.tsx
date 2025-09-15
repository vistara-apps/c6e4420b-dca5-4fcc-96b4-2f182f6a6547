'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import { apiClient, Match, Post } from '@/lib/api/client';
import { AppShell } from '@/components/ui/AppShell';
import { MatchChatItem } from '@/components/ui/MatchChatItem';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Send, TrendingUp, MessageSquare } from 'lucide-react';

export default function MatchChatPage() {
  const params = useParams();
  const matchId = params.id as string;
  const { user } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'insight' | 'banter' | 'discussion'>('banter');
  const [isLoading, setIsLoading] = useState(true);

  const { isConnected, messages, activeUsers, sendMessage } = useSocket(
    matchId,
    user?.userId
  );

  useEffect(() => {
    const loadMatch = async () => {
      try {
        // Get match details
        const matches = await apiClient.getMatches();
        const currentMatch = matches.find(m => m.matchId === matchId);
        if (currentMatch) {
          setMatch(currentMatch);
        }

        // Get existing posts
        const existingPosts = await apiClient.getPosts({ matchId, limit: 50 });
        setPosts(existingPosts);
      } catch (error) {
        console.error('Error loading match:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (matchId) {
      loadMatch();
    }
  }, [matchId]);

  // Update posts when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      const newPosts = messages.map(msg => ({
        ...msg.post,
        timestamp: msg.timestamp.toISOString(),
        likesCount: 0,
        repliesCount: 0,
        isBoosted: false,
        userId: msg.post.user.userId,
      }));
      setPosts(prev => [...prev, ...newPosts]);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user) return;

    try {
      await apiClient.createPost({
        userId: user.userId,
        matchId,
        content: message.trim(),
        type: messageType,
      });

      // Also send via socket for real-time updates
      sendMessage(message.trim(), messageType);

      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) return;

    try {
      await apiClient.likePost(postId, user.userId);
      // Update local state
      setPosts(prev => prev.map(post =>
        post.postId === postId
          ? { ...post, likesCount: post.likesCount + 1 }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (!match) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <h1 className="text-display font-bold text-primary mb-4">Match Not Found</h1>
          <p className="text-body">The match you're looking for doesn't exist.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Match Header */}
        <div className="bg-surface rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-display font-bold text-primary">
              {match.teams.join(' vs ')}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-primary/60">{match.league}</span>
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium
                ${match.status === 'live' ? 'bg-accent text-white' : 'bg-primary/20 text-primary'}
              `}>
                {match.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-primary/60">
            <span>🕐 {new Date(match.startTime).toLocaleString()}</span>
            {isConnected && (
              <span className="text-accent">● {activeUsers.length} watching</span>
            )}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {posts.map((post) => (
            <MatchChatItem
              key={post.postId}
              post={post}
              variant="withInsightTag"
              onLike={handleLike}
            />
          ))}
        </div>

        {/* Message Input */}
        {user && (
          <div className="bg-surface rounded-lg p-4 shadow-card">
            <div className="flex gap-3 mb-3">
              <button
                onClick={() => setMessageType('banter')}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  messageType === 'banter'
                    ? 'bg-primary text-white'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Banter
              </button>
              <button
                onClick={() => setMessageType('insight')}
                className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                  messageType === 'insight'
                    ? 'bg-accent text-white'
                    : 'bg-accent/10 text-accent hover:bg-accent/20'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Insight
              </button>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Share your ${messageType}...`}
                className="flex-1 px-4 py-3 rounded-lg border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <PrimaryButton
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4" />
              </PrimaryButton>
            </div>
          </div>
        )}

        {!user && (
          <div className="bg-surface rounded-lg p-6 shadow-card text-center">
            <h3 className="text-heading font-semibold text-primary mb-2">
              Join the Conversation
            </h3>
            <p className="text-body mb-4">
              Connect with Farcaster to share your thoughts and insights.
            </p>
            <PrimaryButton>
              Connect Farcaster
            </PrimaryButton>
          </div>
        )}
      </div>
    </AppShell>
  );
}
