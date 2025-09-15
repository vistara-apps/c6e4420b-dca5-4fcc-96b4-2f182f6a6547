import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createPostSchema = z.object({
  userId: z.string(),
  matchId: z.string().optional(),
  content: z.string().min(1).max(1000),
  type: z.enum(['insight', 'banter', 'discussion']),
  isBoosted: z.boolean().optional(),
  boostCost: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    if (matchId) where.matchId = matchId;
    if (userId) where.userId = userId;
    if (type) where.type = type;

    const posts = await prisma.post.findMany({
      where,
      take: limit,
      skip: offset,
      include: {
        user: {
          select: {
            userId: true,
            username: true,
            profilePicUrl: true,
            farcasterId: true,
          },
        },
        match: {
          select: {
            matchId: true,
            teams: true,
            league: true,
            status: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likedBy: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createPostSchema.parse(body);

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { userId: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify match exists if provided
    if (validatedData.matchId) {
      const match = await prisma.match.findUnique({
        where: { matchId: validatedData.matchId },
      });

      if (!match) {
        return NextResponse.json(
          { error: 'Match not found' },
          { status: 404 }
        );
      }
    }

    const post = await prisma.post.create({
      data: {
        userId: validatedData.userId,
        matchId: validatedData.matchId,
        content: validatedData.content,
        type: validatedData.type,
        isBoosted: validatedData.isBoosted || false,
        boostCost: validatedData.boostCost,
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
        match: {
          select: {
            matchId: true,
            teams: true,
            league: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

