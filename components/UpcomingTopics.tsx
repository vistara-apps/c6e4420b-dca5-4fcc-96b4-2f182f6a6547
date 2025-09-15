'use client';

import { Calendar, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { mockTopics, mockMatches } from '../lib/mockData';
import { formatTimeAgo, formatMatchTime } from '../lib/utils';

export function UpcomingTopics() {
  return (
    <div className="space-y-6">
      {/* Upcoming Topics */}
      <div className="bg-dark-surface rounded-lg p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upcoming Topics</h3>
          <button className="text-gray-400 hover:text-white transition-all duration-200">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          {mockTopics.slice(0, 4).map((topic) => (
            <div
              key={topic.id}
              className="p-3 bg-dark-card rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">
                    {topic.title.charAt(0)}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm leading-tight mb-1">
                    {topic.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                    {topic.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2 text-gray-500">
                      <Users className="w-3 h-3" />
                      <span>{topic.participants.toLocaleString()}</span>
                    </div>
                    <span className="text-gray-500">
                      {formatTimeAgo(topic.lastActivity)}
                    </span>
                  </div>
                  
                  {topic.isLive && (
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-xs font-medium">LIVE</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Matches */}
      <div className="bg-dark-surface rounded-lg p-4 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Upcoming Matches</h3>
          <button className="text-gray-400 hover:text-white transition-all duration-200">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
        
        <div className="space-y-3">
          {mockMatches.filter(match => match.status === 'upcoming').map((match) => (
            <div
              key={match.matchId}
              className="p-3 bg-dark-card rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium text-sm">
                    {match.teams[0]} vs {match.teams[1]}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">
                  {formatMatchTime(match.startTime)}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{match.league}</span>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="w-3 h-3 text-accent" />
                  <span className="text-accent">High Interest</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Match */}
      {mockMatches.filter(match => match.status === 'live').map((match) => (
        <div
          key={match.matchId}
          className="bg-gradient-to-r from-red-900/20 to-red-800/20 rounded-lg p-4 border border-red-800/50"
        >
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400 text-sm font-medium">LIVE NOW</span>
          </div>
          
          <div className="text-center">
            <div className="text-white font-bold text-lg mb-1">
              {match.teams[0]} {match.score?.[0]} - {match.score?.[1]} {match.teams[1]}
            </div>
            <div className="text-gray-400 text-sm mb-3">{match.league}</div>
            
            <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200">
              Join Live Chat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
