'use client';

import { useState } from 'react';
import { Home, Calendar, MessageSquare, Users, Trophy, Settings, Search, Bell } from 'lucide-react';
import { cn } from '../lib/utils';

interface AppShellProps {
  children: React.ReactNode;
}

const navigationItems = [
  { icon: Home, label: 'Home', href: '/', active: true },
  { icon: Calendar, label: 'Matches', href: '/matches' },
  { icon: MessageSquare, label: 'Discussions', href: '/discussions' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Trophy, label: 'Leaderboard', href: '/leaderboard' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-background text-white">
      {/* Header */}
      <header className="bg-dark-surface border-b border-gray-800 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Kickback Collective</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.slice(0, 3).map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  item.active
                    ? 'bg-yellow-500 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-dark-card'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-400 transition-all duration-200">
              4 Goals
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-all duration-200">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-all duration-200">
              <Search className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"></div>
              <span className="text-sm font-medium">Users</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-surface border-r border-gray-800 min-h-screen p-4">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    item.active
                      ? 'bg-yellow-500 text-black'
                      : 'text-gray-300 hover:text-white hover:bg-dark-card'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
