import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { storeHash, SHORTLINK_TTL_SECONDS } from '@/lib/shortlinks';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash } = body;

    if (!hash || typeof hash !== 'string') {
      return NextResponse.json(
        { error: 'Invalid hash format' },
        { status: 400 }
      );
    }

    // Generate short ID (10 characters)
    const shortId = nanoid(10);

    await storeHash(shortId, hash);

    // Get base URL from request
    const baseUrl = request.nextUrl.origin;

    // Calculate expiry
    const expiresAt = new Date(Date.now() + SHORTLINK_TTL_SECONDS * 1000);

    return NextResponse.json(
      {
        shortId,
        shortUrl: `${baseUrl}/s/${shortId}`,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Shorten error:', error);
    return NextResponse.json(
      { error: 'Failed to create short URL' },
      { status: 500 }
    );
  }
}