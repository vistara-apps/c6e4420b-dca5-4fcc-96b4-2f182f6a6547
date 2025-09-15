import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createMatchSchema = z.object({
  teams: z.array(z.string()).length(2),
  startTime: z.string().datetime(),
  league: z.string(),
  status: z.enum(['upcoming', 'live', 'finished']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const league = searchParams.get('league');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: any = {};
    if (status) where.status = status;
    if (league) where.league = league;

    const matches = await prisma.match.findMany({
      where,
      take: limit,
      select: {
        matchId: true,
        teams: true,
        startTime: true,
        endTime: true,
        status: true,
        league: true,
        score: true,
        _count: {
          select: {
            posts: true,
          },
        },
        createdAt: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createMatchSchema.parse(body);

    const match = await prisma.match.create({
      data: {
        teams: validatedData.teams,
        startTime: new Date(validatedData.startTime),
        league: validatedData.league,
        status: validatedData.status || 'upcoming',
      },
      select: {
        matchId: true,
        teams: true,
        startTime: true,
        status: true,
        league: true,
        createdAt: true,
      },
    });

    return NextResponse.json(match, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating match:', error);
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    );
  }
}

