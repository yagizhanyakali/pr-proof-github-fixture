import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = process.env.TEST_USER_EMAIL ?? 'test@example.com';
  const password = process.env.TEST_USER_PASSWORD ?? 'change-me';
  if (body.email !== email || body.password !== password) {
    return NextResponse.json({ error: 'Invalid test credentials' }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
