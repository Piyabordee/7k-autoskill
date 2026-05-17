import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Dynamically import kv to see the actual error
    const { kv } = await import('@vercel/kv');

    // Test storing a value
    const testKey = 'test:ping';
    const testValue = `pong-${Date.now()}`;

    await kv.set(testKey, testValue, { ex: 60 });
    const retrieved = await kv.get(testKey);

    return NextResponse.json({
      status: 'ok',
      test: {
        key: testKey,
        stored: testValue,
        retrieved: retrieved,
        match: retrieved === testValue
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : null,
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}