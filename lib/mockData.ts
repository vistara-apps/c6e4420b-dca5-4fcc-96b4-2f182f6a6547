import { Post, Match, Topic, User } from './types';
import { generateMockUser } from './utils';

export const mockUsers: User[] = [
  generateMockUser('1'),
  generateMockUser('2'),
  generateMockUser('3'),
  generateMockUser('4'),
  generateMockUser('5'),
];

export const mockMatches: Match[] = [
  {
    matchId: '1',
    teams: ['Arsenal', 'Chelsea'],
    startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    status: 'live',
    league: 'Premier League',
    score: [2, 1],
  },
  {
    matchId: '2',
    teams: ['Liverpool', 'Man City'],
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    status: 'upcoming',
    league: 'Premier League',
  },
  {
    matchId: '3',
    teams: ['Barcelona', 'Real Madrid'],
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    status: 'upcoming',
    league: 'La Liga',
  },
];

export const mockPosts: Post[] = [
  {
    postId: '1',
    userId: '1',
    matchId: '1',
    content: 'What a save from the keeper! Incredible reflexes to deny that header 🧤',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'insight',
    likes: 12,
    replies: 3,
    user: mockUsers[0],
  },
  {
    postId: '2',
    userId: '2',
    matchId: '1',
    content: 'Watching this at 3AM. Worth it! This is why we love football ⚽',
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    type: 'banter',
    likes: 8,
    replies: 5,
    user: mockUsers[1],
  },
  {
    postId: '3',
    userId: '3',
    matchId: '1',
    content: 'The tactical switch to 4-3-3 is working perfectly. Much better ball circulation now.',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    type: 'insight',
    likes: 15,
    replies: 7,
    user: mockUsers[2],
  },
  {
    postId: '4',
    userId: '4',
    content: 'Who else thinks VAR is ruining the beautiful game? The delays are killing the momentum.',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    type: 'discussion',
    likes: 23,
    replies: 12,
    user: mockUsers[3],
  },
];

export const mockTopics: Topic[] = [
  {
    id: '1',
    title: 'Mbappe Misses Penalty! Foul Foul Foul',
    description: 'Discussion about the controversial penalty decision',
    participants: 847,
    lastActivity: new Date(Date.now() - 10 * 60 * 1000),
    category: 'Live Match',
    isLive: true,
  },
  {
    id: '2',
    title: 'Cristiano Matches vs Pelé! Goat Control',
    description: 'Comparing legendary goal-scoring records',
    participants: 1203,
    lastActivity: new Date(Date.now() - 25 * 60 * 1000),
    category: 'Discussion',
  },
  {
    id: '3',
    title: 'Verry1st Matches for Feyenoord',
    description: 'Young talent making their debut',
    participants: 156,
    lastActivity: new Date(Date.now() - 45 * 60 * 1000),
    category: 'Player News',
  },
  {
    id: '4',
    title: 'My World: For Big Clubs',
    description: 'Transfer rumors and big club strategies',
    participants: 892,
    lastActivity: new Date(Date.now() - 60 * 60 * 1000),
    category: 'Transfers',
  },
];
