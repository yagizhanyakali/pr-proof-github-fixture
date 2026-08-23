import { NextResponse } from 'next/server';
import { getMode } from '../../../lib/store';
export async function GET() {
  return NextResponse.json({
    commitSha: process.env.TESTBED_COMMIT_SHA ?? 'abc123',
    environment: 'uat',
    mode: getMode(),
  });
}
