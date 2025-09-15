import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { followerId } = body;

    if (!followerId) {
      return NextResponse.json(
        { error: 'followerId is required' },
        { status: 400 }
      );
    }

    // Check if users exist
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ where: { userId: followerId } }),
      prisma.user.findUnique({ where: { userId: id } }),
    ]);

    if (!follower || !following) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.user.findFirst({
      where: {
        userId: followerId,
        following: {
          some: {
            userId: id,
          },
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json(
        { error: 'Already following this user' },
        { status: 400 }
      );
    }

    // Add follow relationship
    await prisma.user.update({
      where: { userId: followerId },
      data: {
        following: {
          connect: { userId: id },
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: id,
        type: 'follow',
        message: `${follower.username} started following you`,
      },
    });

    return NextResponse.json({ message: 'Successfully followed user' });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { followerId } = body;

    if (!followerId) {
      return NextResponse.json(
        { error: 'followerId is required' },
        { status: 400 }
      );
    }

    // Remove follow relationship
    await prisma.user.update({
      where: { userId: followerId },
      data: {
        following: {
          disconnect: { userId: id },
        },
      },
    });

    return NextResponse.json({ message: 'Successfully unfollowed user' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}
