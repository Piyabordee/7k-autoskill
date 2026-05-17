import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET(request: NextRequest) {
  try {
    // Test storing a value
    const testKey = 'test:ping';
    const testValue = `pong-${Date.now()}`;

    await kv.set(testKey, testValue, { ex: 60 }); // expire in 60 seconds
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
      stack: error instanceof Error ? error.stack : null
    }, { status: 500 });
  }
}