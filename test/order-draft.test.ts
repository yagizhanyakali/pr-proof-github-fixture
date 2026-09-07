import { describe, expect, it } from 'vitest';
import { POST } from '../app/api/order-draft/route.js';

function request(body: unknown) {
  return new Request('http://localhost:3002/api/order-draft', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('order draft API', () => {
  it('creates a draft that preserves the submitted quantity and product details', async () => {
    const response = await POST(request({ quantity: '4', deliveryNote: 'Leave with reception' }));

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toMatchObject({
      draftId: expect.stringMatching(/^draft_/),
      quantity: 4,
      deliveryNote: 'Leave with reception',
      product: {
        id: 'pr-proof-mug',
        name: 'PR Proof Ceramic Mug',
        image: '/products/pr-proof-mug.svg',
      },
    });
  });

  it.each([0, -1, 1.5, 100, 'not-a-number'])('rejects invalid quantities: %s', async (quantity) => {
    const response = await POST(request({ quantity }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Quantity must be a whole number between 1 and 99',
    });
  });

  it('trims an accepted delivery note and rejects notes beyond the API boundary', async () => {
    const accepted = await POST(request({ quantity: 1, deliveryNote: '  Ring bell  ' }));
    await expect(accepted.json()).resolves.toMatchObject({ deliveryNote: 'Ring bell' });

    const rejected = await POST(request({ quantity: 1, deliveryNote: 'a'.repeat(81) }));
    expect(rejected.status).toBe(400);
    await expect(rejected.json()).resolves.toEqual({
      error: 'Delivery note must be 80 characters or fewer',
    });
  });

  it('requires a recipient for gift orders and preserves gift details in the draft', async () => {
    const missingRecipient = await POST(request({ quantity: 2, giftWrap: true }));
    expect(missingRecipient.status).toBe(400);
    await expect(missingRecipient.json()).resolves.toEqual({
      error: 'Recipient name is required for a gift order',
    });

    const accepted = await POST(
      request({
        quantity: 2,
        giftWrap: true,
        recipientName: '  Ada Lovelace ',
        giftMessage: '  Enjoy your mug!  ',
      }),
    );
    expect(accepted.status).toBe(201);
    await expect(accepted.json()).resolves.toMatchObject({
      gift: { enabled: true, recipientName: 'Ada Lovelace', message: 'Enjoy your mug!', fee: 5 },
      total: 41,
    });
  });

  it('rejects gift messages beyond the server boundary', async () => {
    const response = await POST(
      request({ quantity: 1, giftWrap: true, recipientName: 'Ada', giftMessage: 'a'.repeat(121) }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Gift message must be 120 characters or fewer',
    });
  });
});
