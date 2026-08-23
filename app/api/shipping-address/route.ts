import { NextResponse } from 'next/server';
import { getAddress, getMode, saveAddress, type Address } from '../../../lib/store';
export async function GET() {
  return NextResponse.json({ address: getAddress(), mode: getMode() });
}
export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<Address>;
  if (!body.street?.trim()) {
    return NextResponse.json({ error: 'Street is required' }, { status: 400 });
  }
  const current = getAddress();
  return NextResponse.json({
    address: saveAddress({ ...current, ...body, street: body.street.trim() }),
  });
}
