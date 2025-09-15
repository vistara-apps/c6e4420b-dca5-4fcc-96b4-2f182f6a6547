// API client utilities for the Kickback Collective app

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface User {
  userId: string;
  username: string;
  farcasterId?: string;
  profilePicUrl?: string;
  bio?: string;
  teamAffiliations: string[];
  tokenBalance: number;
  _count?: {
    followers: number;
    following: number;
    posts: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  matchId: string;
  teams: string[];
  startTime: string;
  endTime?: string;
  status: 'upcoming' | 'live' | 'finished';
  league: string;
  score?: string;
  _count?: {
    posts: number;
  };
  createdAt: string;
}

export interface Post {
  postId: string;
  userId: string;
  matchId?: string;
  content: string;
  timestamp: string;
  type: 'insight' | 'banter' | 'discussion';
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
  _count?: {
    comments: number;
    likedBy: number;
  };
}

export interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
  user: {
    userId: string;
    username: string;
    profilePicUrl?: string;
    farcasterId?: string;
  };
}

class APIClient {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(farcasterId: string) {
    return this.request<{ token: string; user: User }>('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'login', farcasterId }),
    });
  }

  async signup(data: {
    username: string;
    farcasterId: string;
    profilePicUrl?: string;
  }) {
    return this.request<{ token: string; user: User }>('/api/auth', {
      method: 'POST',
      body: JSON.stringify({ action: 'signup', ...data }),
    });
  }

  // User endpoints
  async getUsers(params?: { limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    return this.request<User[]>(
      `/api/users?${searchParams.toString()}`
    );
  }

  async getUser(userId: string) {
    return this.request<User>(`/api/users/${userId}`);
  }

  async updateUser(userId: string, data: Partial<User>) {
    return this.request<User>(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async followUser(userId: string, followerId: string) {
    return this.request<{ message: string }>(`/api/users/${userId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ followerId }),
    });
  }

  async unfollowUser(userId: string, followerId: string) {
    return this.request<{ message: string }>(`/api/users/${userId}/follow`, {
      method: 'DELETE',
      body: JSON.stringify({ followerId }),
    });
  }

  // Match endpoints
  async getMatches(params?: {
    status?: string;
    league?: string;
    limit?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.league) searchParams.set('league', params.league);
    if (params?.limit) searchParams.set('limit', params.limit.toString());

    return this.request<Match[]>(
      `/api/matches?${searchParams.toString()}`
    );
  }

  async createMatch(data: {
    teams: string[];
    startTime: string;
    league: string;
    status?: 'upcoming' | 'live' | 'finished';
  }) {
    return this.request<Match>('/api/matches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Post endpoints
  async getPosts(params?: {
    matchId?: string;
    userId?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.matchId) searchParams.set('matchId', params.matchId);
    if (params?.userId) searchParams.set('userId', params.userId);
    if (params?.type) searchParams.set('type', params.type);
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    return this.request<Post[]>(
      `/api/posts?${searchParams.toString()}`
    );
  }

  async createPost(data: {
    userId: string;
    matchId?: string;
    content: string;
    type: 'insight' | 'banter' | 'discussion';
    isBoosted?: boolean;
    boostCost?: number;
  }) {
    return this.request<Post>('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async likePost(postId: string, userId: string) {
    return this.request<{ message: string }>(`/api/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async unlikePost(postId: string, userId: string) {
    return this.request<{ message: string }>(`/api/posts/${postId}/like`, {
      method: 'DELETE',
      body: JSON.stringify({ userId }),
    });
  }

  // Comment endpoints
  async getComments(postId: string, params?: { limit?: number; offset?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.offset) searchParams.set('offset', params.offset.toString());

    return this.request<Comment[]>(
      `/api/posts/${postId}/comments?${searchParams.toString()}`
    );
  }

  async createComment(postId: string, data: { userId: string; content: string }) {
    return this.request<Comment>(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new APIClient();

