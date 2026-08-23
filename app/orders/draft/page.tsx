'use client';

import { useSyncExternalStore } from 'react';

type Draft = {
  draftId: string;
  product: { name: string; image: string; unitPrice: number };
  quantity: number;
  deliveryNote: string;
  gift: { enabled: boolean; recipientName: string; message: string; fee: number };
  total: number;
};

const subscribeToDraft = () => () => {};
const getServerDraft = () => null;

function getStoredDraft(): Draft | null {
  const stored = sessionStorage.getItem('pr-proof-order-draft');
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as Draft;
  } catch {
    return null;
  }
}

export default function OrderDraftPage() {
  const draft = useSyncExternalStore(subscribeToDraft, getStoredDraft, getServerDraft);

  if (!draft) {
    return (
      <main>
        <p data-testid="draft-loading">Loading your order draft…</p>
      </main>
    );
  }

  return (
    <main data-testid="order-draft-page">
      <div className="tag">Orders · Draft</div>
      <h1>Your order draft</h1>
      <p>Review the product and quantity before placing the order.</p>
      <img
        src={draft.product.image}
        alt="PR Proof Ceramic Mug"
        style={{ width: '100%', maxWidth: 240, borderRadius: 12, border: '1px solid #365778' }}
      />
      <h2 data-testid="draft-product-name">{draft.product.name}</h2>
      <p>
        Quantity: <strong data-testid="draft-quantity">{draft.quantity}</strong>
      </p>
      <p>
        Delivery note:{' '}
        <strong data-testid="draft-delivery-note">{draft.deliveryNote || 'None'}</strong>
      </p>
      <p>
        Gift wrap:{' '}
        <strong data-testid="draft-gift-wrap">
          {draft.gift.enabled ? `Yes — €${draft.gift.fee.toFixed(2)}` : 'No'}
        </strong>
      </p>
      {draft.gift.enabled && (
        <section data-testid="draft-gift-details">
          <p>
            Recipient: <strong data-testid="draft-gift-recipient">{draft.gift.recipientName}</strong>
          </p>
          <p>
            Gift message: <strong data-testid="draft-gift-message">{draft.gift.message || 'None'}</strong>
          </p>
        </section>
      )}
      <p>
        Total: <strong data-testid="draft-total">€{draft.total.toFixed(2)}</strong>
      </p>
      <p className="status">Draft {draft.draftId} is ready for review.</p>
    </main>
  );
}
