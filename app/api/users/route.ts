import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createUserSchema = z.object({
  username: z.string().min(3).max(50),
  farcasterId: z.string().optional(),
  profilePicUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  teamAffiliations: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const users = await prisma.user.findMany({
      take: limit,
      skip: offset,
      select: {
        userId: true,
        username: true,
        profilePicUrl: true,
        bio: true,
        teamAffiliations: true,
        tokenBalance: true,
        _count: {
          select: {
            followers: true,
            following: true,
            posts: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createUserSchema.parse(body);

    const user = await prisma.user.create({
      data: {
        username: validatedData.username,
        farcasterId: validatedData.farcasterId,
        profilePicUrl: validatedData.profilePicUrl,
        bio: validatedData.bio,
        teamAffiliations: validatedData.teamAffiliations || [],
      },
      select: {
        userId: true,
        username: true,
        farcasterId: true,
        profilePicUrl: true,
        bio: true,
        teamAffiliations: true,
        tokenBalance: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

