export interface User {
  userId: string;
  username: string;
  farcasterId?: string;
  profilePicUrl?: string;
  following: string[];
  followers: string[];
  teamAffiliations: string[];
}

export interface Match {
  matchId: string;
  teams: [string, string];
  startTime: Date;
  endTime?: Date;
  status: 'upcoming' | 'live' | 'finished';
  league: string;
  score?: [number, number];
}

export interface Post {
  postId: string;
  userId: string;
  matchId?: string;
  content: string;
  timestamp: Date;
  type: 'insight' | 'banter' | 'discussion';
  likes: number;
  replies: number;
  user?: User;
}

export interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: Date;
  user?: User;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  participants: number;
  lastActivity: Date;
  category: string;
  isLive?: boolean;
}
