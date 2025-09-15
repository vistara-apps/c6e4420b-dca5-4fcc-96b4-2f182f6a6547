import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const createCommentSchema = z.object({
  userId: z.string(),
  content: z.string().min(1).max(500),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const comments = await prisma.comment.findMany({
      where: { postId: id },
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
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = createCommentSchema.parse(body);

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { postId: id },
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { userId: validatedData.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId: id,
        userId: validatedData.userId,
        content: validatedData.content,
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

    // Update post replies count
    await prisma.post.update({
      where: { postId: id },
      data: {
        repliesCount: {
          increment: 1,
        },
      },
    });

    // Create notification for post author
    if (post.userId !== validatedData.userId) {
      await prisma.notification.create({
        data: {
          userId: post.userId,
          type: 'reply',
          message: `${user.username} replied to your post`,
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
