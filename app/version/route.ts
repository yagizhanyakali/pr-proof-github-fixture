import { NextResponse } from 'next/server';
import { getMode } from '../../lib/store';
export async function GET() {
  return NextResponse.json({
    commitSha:
      process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.GIT_COMMIT_SHA ?? process.env.TESTBED_COMMIT_SHA ?? 'abc123',
    environment: 'uat',
    mode: getMode(),
  });
}
