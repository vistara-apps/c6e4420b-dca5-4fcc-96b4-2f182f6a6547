'use client';

import { useState } from 'react';
import { MessageSquare, Heart, Share, MoreHorizontal, Send } from 'lucide-react';
import { mockPosts } from '../lib/mockData';
import { formatTimeAgo } from '../lib/utils';
import { UserAvatar } from './UserAvatar';
import { InsightCard } from './InsightCard';

export function MatchChatFeed() {
  const [newMessage, setNewMessage] = useState('');
  const [posts] = useState(mockPosts);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your API
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-dark-surface rounded-lg p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Arsenal Fan Community</h1>
            <p className="text-gray-400">Live • Goal • Goal • Goal</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-all duration-200">
              Dominate
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-all duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Message Input */}
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <UserAvatar 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=current-user"
            alt="Your avatar"
            size="small"
          />
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Share your thoughts on the match..."
              className="w-full bg-dark-card border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-all duration-200"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-accent hover:text-green-400 disabled:text-gray-600 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Popular Topics */}
      <div className="bg-dark-surface rounded-lg p-4 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Popular Topics</h3>
        <div className="space-y-3">
          {posts.slice(0, 3).map((post) => (
            <InsightCard key={post.postId} post={post} variant="compact" />
          ))}
        </div>
      </div>

      {/* Live Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.postId}
            className="bg-dark-surface rounded-lg p-6 border border-gray-800 hover:border-gray-700 transition-all duration-200"
          >
            <div className="flex items-start space-x-4">
              <UserAvatar 
                src={post.user?.profilePicUrl}
                alt={post.user?.username || 'User'}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-white">
                    {post.user?.username || 'Anonymous'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    @{post.user?.farcasterId || 'unknown'}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {formatTimeAgo(post.timestamp)}
                  </span>
                  {post.type === 'insight' && (
                    <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
                      Insight
                    </span>
                  )}
                </div>
                
                <p className="text-gray-100 mb-4 leading-relaxed">
                  {post.content}
                </p>
                
                <div className="flex items-center space-x-6 text-gray-400">
                  <button className="flex items-center space-x-2 hover:text-red-400 transition-all duration-200">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 hover:text-blue-400 transition-all duration-200">
                    <MessageSquare className="w-5 h-5" />
                    <span className="text-sm">{post.replies}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 hover:text-green-400 transition-all duration-200">
                    <Share className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
