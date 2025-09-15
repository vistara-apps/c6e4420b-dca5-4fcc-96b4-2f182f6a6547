'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient, Match } from '@/lib/api/client';
import { AppShell } from '@/components/ui/AppShell';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Play, Users, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const { user, logout } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const allMatches = await apiClient.getMatches({ limit: 20 });
        setMatches(allMatches);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMatches();
  }, []);

  return (
    <AppShell>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Kickback Collective
          </h1>
          <p className="text-xl text-primary/80 mb-6">
            Your real-time football chat and insights hub
          </p>

          {user ? (
            <div className="flex items-center justify-center gap-4">
              <span className="text-body">Welcome, {user.username}!</span>
              <PrimaryButton onClick={logout} variant="default">
                Logout
              </PrimaryButton>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4">
              <span className="text-body">Connect to join the conversation</span>
              <PrimaryButton>
                Connect Farcaster
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-surface rounded-lg p-6 shadow-card text-center">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Live Match Chat
            </h3>
            <p className="text-body">
              Real-time discussions during matches with fellow fans
            </p>
          </div>

          <div className="bg-surface rounded-lg p-6 shadow-card text-center">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Expert Insights
            </h3>
            <p className="text-body">
              Share tactical observations and game analysis
            </p>
          </div>

          <div className="bg-surface rounded-lg p-6 shadow-card text-center">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-primary mb-2">
              Fan Community
            </h3>
            <p className="text-body">
              Connect with fans who share your football passion
            </p>
          </div>
        </div>

        {/* Live Matches */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6">Live Matches</h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-body">No matches available right now.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {matches.map((match) => (
                <Link
                  key={match.matchId}
                  href={`/match/${match.matchId}`}
                  className="block"
                >
                  <div className="bg-surface rounded-lg p-6 shadow-card hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-primary">
                        {match.teams.join(' vs ')}
                      </h3>
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

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-primary/60">
                        🕐 {new Date(match.startTime).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-primary/60">
                        <Users className="w-4 h-4" />
                        {match._count?.posts || 0} posts
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

