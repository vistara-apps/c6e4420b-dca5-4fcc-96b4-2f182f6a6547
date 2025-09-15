import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Message {
  post: {
    postId: string;
    content: string;
    type: 'insight' | 'banter' | 'discussion';
    timestamp: string;
    user: {
      userId: string;
      username: string;
      profilePicUrl?: string;
      farcasterId?: string;
    };
  };
  timestamp: Date;
}

export interface User {
  userId: string;
  username: string;
  profilePicUrl?: string;
  farcasterId?: string;
}

export function useSocket(matchId?: string, userId?: string) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId || !userId) return;

    // Initialize socket connection
    const socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socket',
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      setError(null);

      // Join the match room
      socket.emit('join-match', { matchId, userId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('error', (error) => {
      setError(error.message);
    });

    socket.on('match-joined', (data: { activeUsers: string[] }) => {
      // In a real implementation, you'd fetch user details for activeUsers
      setActiveUsers([]);
    });

    socket.on('user-joined', (data: { user: User; activeUsers: string[] }) => {
      setActiveUsers(prev => [...prev.filter(u => u.userId !== data.user.userId), data.user]);
    });

    socket.on('user-left', (data: { userId: string; activeUsers: string[] }) => {
      setActiveUsers(prev => prev.filter(u => u.userId !== data.userId));
    });

    socket.on('new-message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      if (socket) {
        socket.emit('leave-match', { matchId, userId });
        socket.disconnect();
      }
    };
  }, [matchId, userId]);

  const sendMessage = (content: string, type: 'insight' | 'banter' | 'discussion' = 'banter') => {
    if (socketRef.current && matchId && userId) {
      socketRef.current.emit('send-message', {
        matchId,
        userId,
        content,
        type,
      });
    }
  };

  return {
    isConnected,
    messages,
    activeUsers,
    error,
    sendMessage,
  };
}

