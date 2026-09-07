import { NextResponse } from 'next/server';

const product = {
  id: 'pr-proof-mug',
  name: 'PR Proof Ceramic Mug',
  image: '/products/pr-proof-mug.svg',
  unitPrice: 18,
};
export async function POST(request: Request) {
  const body = (await request.json()) as {
    quantity?: unknown;
    deliveryNote?: unknown;
    giftWrap?: unknown;
    recipientName?: unknown;
    giftMessage?: unknown;
  };
  const quantity = Number(body.quantity);
  const deliveryNote = typeof body.deliveryNote === 'string' ? body.deliveryNote.trim() : '';
  const giftWrap = body.giftWrap === true;
  const recipientName = typeof body.recipientName === 'string' ? body.recipientName.trim() : '';
  const giftMessage = typeof body.giftMessage === 'string' ? body.giftMessage.trim() : '';
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
  if (giftWrap && !recipientName) {
    return NextResponse.json({ error: 'Recipient name is required for a gift order' }, { status: 400 });
  }
  if (giftMessage.length > 120) {
    return NextResponse.json(
      { error: 'Gift message must be 120 characters or fewer' },
      { status: 400 },
    );
  }
  const giftFee = giftWrap ? 5 : 0;
  return NextResponse.json(
    {
      draftId: `draft_${crypto.randomUUID().slice(0, 8)}`,
      product,
      quantity,
      deliveryNote,
      gift: { enabled: giftWrap, recipientName, message: giftMessage, fee: giftFee },
      total: quantity * product.unitPrice + giftFee,
    },
    { status: 201 },
  );
}
