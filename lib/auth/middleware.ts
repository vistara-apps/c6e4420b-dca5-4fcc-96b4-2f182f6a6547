import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT, getTokenFromHeader } from './jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    username: string;
    farcasterId?: string;
  };
}

export function withAuth(
  handler: (req: AuthenticatedRequest, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const authHeader = req.headers.get('authorization');
    const token = getTokenFromHeader(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    (req as AuthenticatedRequest).user = payload;
    return handler(req as AuthenticatedRequest, context);
  };
}

