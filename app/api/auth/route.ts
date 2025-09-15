import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { signJWT } from '@/lib/auth/jwt';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  farcasterId: z.string(),
});

const signupSchema = z.object({
  username: z.string().min(3).max(50),
  farcasterId: z.string(),
  profilePicUrl: z.string().url().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'login') {
      const { farcasterId } = loginSchema.parse(body);

      const user = await prisma.user.findUnique({
        where: { farcasterId },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      const token = signJWT({
        userId: user.userId,
        username: user.username,
        farcasterId: user.farcasterId || undefined,
      });

      return NextResponse.json({
        token,
        user: {
          userId: user.userId,
          username: user.username,
          farcasterId: user.farcasterId,
          profilePicUrl: user.profilePicUrl,
          bio: user.bio,
          teamAffiliations: user.teamAffiliations,
          tokenBalance: user.tokenBalance,
        },
      });
    }

    if (action === 'signup') {
      const validatedData = signupSchema.parse(body);

      // Check if username or farcasterId already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: validatedData.username },
            { farcasterId: validatedData.farcasterId },
          ],
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: 'Username or Farcaster ID already exists' },
          { status: 400 }
        );
      }

      const user = await prisma.user.create({
        data: {
          username: validatedData.username,
          farcasterId: validatedData.farcasterId,
          profilePicUrl: validatedData.profilePicUrl,
          teamAffiliations: [],
        },
      });

      const token = signJWT({
        userId: user.userId,
        username: user.username,
        farcasterId: user.farcasterId || undefined,
      });

      return NextResponse.json({
        token,
        user: {
          userId: user.userId,
          username: user.username,
          farcasterId: user.farcasterId,
          profilePicUrl: user.profilePicUrl,
          bio: user.bio,
          teamAffiliations: user.teamAffiliations,
          tokenBalance: user.tokenBalance,
        },
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "login" or "signup"' },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
