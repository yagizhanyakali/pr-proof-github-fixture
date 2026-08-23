import { NextResponse } from 'next/server';

const product = {
  id: 'pr-proof-mug',
  name: 'PR Proof Ceramic Mug',
  image: '/products/pr-proof-mug.svg',
};
export async function POST(request: Request) {
  const body = (await request.json()) as { quantity?: unknown; deliveryNote?: unknown };
  const quantity = Number(body.quantity);
  const deliveryNote = typeof body.deliveryNote === 'string' ? body.deliveryNote.trim() : '';
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
    return NextResponse.json(
      { error: 'Quantity must be a whole number between 1 and 99' },
      { status: 400 },
    );
  }
  if (deliveryNote.length > 80) {
    return NextResponse.json(
      { error: 'Delivery note must be 80 characters or fewer' },
      { status: 400 },
    );
  }
  return NextResponse.json(
    { draftId: `draft_${crypto.randomUUID().slice(0, 8)}`, product, quantity, deliveryNote },
    { status: 201 },
  );
}
