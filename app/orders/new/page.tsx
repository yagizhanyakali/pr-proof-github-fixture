'use client';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
const product = {
  id: 'pr-proof-mug',
  name: 'PR Proof Ceramic Mug',
  image: '/products/pr-proof-mug.svg',
};
export default function CreateOrderPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState('1');
  const [deliveryNote, setDeliveryNote] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/order-draft', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ quantity, deliveryNote }),
    });
    const draft = await response.json();
    if (!response.ok) {
      setError(draft.error ?? 'Could not create draft');
      return;
    }
    sessionStorage.setItem('pr-proof-order-draft', JSON.stringify(draft));
    router.push('/orders/draft');
  }
  return (
    <main data-testid="order-create-page">
      <div className="tag">Orders · UAT</div>
      <h1>Create an order</h1>
      <p>Choose the quantity for your product, then review it as a draft.</p>
      <img
        data-testid="product-image"
        src={product.image}
        alt="PR Proof Ceramic Mug"
        style={{ width: '100%', maxWidth: 280, borderRadius: 12, border: '1px solid #365778' }}
      />
      <h2 data-testid="product-name" style={{ marginBottom: 0 }}>
        {product.name}
      </h2>
      <form noValidate onSubmit={submit}>
        <label>
          Quantity
          <input
            data-testid="order-quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            type="number"
            min="1"
            max="99"
          />
        </label>
        <label>
          Delivery note
          <input
            data-testid="delivery-note"
            value={deliveryNote}
            onChange={(event) => setDeliveryNote(event.target.value)}
            maxLength={200}
          />
        </label>
        {error && (
          <p className="error" data-testid="order-error">
            {error}
          </p>
        )}
        <button data-testid="create-order" type="submit">
          Continue to draft
        </button>
      </form>
    </main>
  );
}
