import { NextRequest, NextResponse } from 'next/server';
import { getHash } from '@/lib/shortlinks';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const hash = await getHash(id);

  if (!hash) {
    return NextResponse.json(
      { error: 'Build not found or expired' },
      { status: 404 }
    );
  }

  // Redirect to planner with hash
  const plannerUrl = new URL('/planner', request.url);
  plannerUrl.hash = hash;

  return NextResponse.redirect(plannerUrl, 302);
}