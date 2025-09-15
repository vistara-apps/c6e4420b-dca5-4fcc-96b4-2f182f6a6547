import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';
import { prisma } from '@/lib/db';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const initSocketIO = (httpServer: NetServer) => {
  const io = new ServerIO(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Store active users per match
  const matchRooms = new Map<string, Set<string>>();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-match', async (data: { matchId: string; userId: string }) => {
      const { matchId, userId } = data;

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { userId },
        select: { userId: true, username: true, profilePicUrl: true },
      });

      if (!user) {
        socket.emit('error', { message: 'User not found' });
        return;
      }

      // Join match room
      socket.join(matchId);

      // Track active users in this match
      if (!matchRooms.has(matchId)) {
        matchRooms.set(matchId, new Set());
      }
      matchRooms.get(matchId)!.add(userId);

      // Notify others in the room
      socket.to(matchId).emit('user-joined', {
        user,
        activeUsers: Array.from(matchRooms.get(matchId)!),
      });

      // Send current active users to the new user
      socket.emit('match-joined', {
        activeUsers: Array.from(matchRooms.get(matchId)!),
      });
    });

    socket.on('leave-match', (data: { matchId: string; userId: string }) => {
      const { matchId, userId } = data;

      socket.leave(matchId);

      // Remove from active users
      if (matchRooms.has(matchId)) {
        matchRooms.get(matchId)!.delete(userId);

        // If room is empty, clean up
        if (matchRooms.get(matchId)!.size === 0) {
          matchRooms.delete(matchId);
        } else {
          // Notify others
          socket.to(matchId).emit('user-left', {
            userId,
            activeUsers: Array.from(matchRooms.get(matchId)!),
          });
        }
      }
    });

    socket.on('send-message', async (data: {
      matchId: string;
      userId: string;
      content: string;
      type: 'insight' | 'banter' | 'discussion';
    }) => {
      const { matchId, userId, content, type } = data;

      // Verify user and match
      const [user, match] = await Promise.all([
        prisma.user.findUnique({
          where: { userId },
          select: { userId: true, username: true, profilePicUrl: true, farcasterId: true },
        }),
        prisma.match.findUnique({
          where: { matchId },
          select: { matchId: true, status: true },
        }),
      ]);

      if (!user || !match) {
        socket.emit('error', { message: 'Invalid user or match' });
        return;
      }

      // Create post in database
      const post = await prisma.post.create({
        data: {
          userId,
          matchId,
          content,
          type,
        },
        include: {
          user: {
            select: {
              userId: true,
              username: true,
              profilePicUrl: true,
              farcasterId: true,
            },
          },
        },
      });

      // Broadcast to match room
      io.to(matchId).emit('new-message', {
        post,
        timestamp: new Date(),
      });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      // Clean up user from all match rooms
      for (const [matchId, users] of matchRooms.entries()) {
        // Note: In a real implementation, you'd need to track socketId to userId mapping
        // For now, we'll clean up empty rooms periodically
        if (users.size === 0) {
          matchRooms.delete(matchId);
        }
      }
    });
  });

  return io;
};

