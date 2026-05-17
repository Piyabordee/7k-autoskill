import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export async function GET(request: NextRequest) {
  try {
    const redis = Redis.fromEnv();

    // Test storing a value
    const testKey = 'test:ping';
    const testValue = `pong-${Date.now()}`;

    await redis.set(testKey, testValue, { ex: 60 });
    const retrieved = await redis.get<string>(testKey);

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
      name: error instanceof Error ? error.name : null
    }, { status: 500 });
  }
}