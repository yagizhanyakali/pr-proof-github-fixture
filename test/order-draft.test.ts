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

    const rejected = await POST(request({ quantity: 1, deliveryNote: 'a'.repeat(141) }));
    expect(rejected.status).toBe(400);
    await expect(rejected.json()).resolves.toEqual({
      error: 'Delivery note must be 140 characters or fewer',
    });
  });
});
