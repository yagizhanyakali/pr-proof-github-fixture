'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
type Address = { name: string; street: string; city: string; postalCode: string; country: string };
export default function ShippingAddressPage() {
  const router = useRouter();
  const [persisted, setPersisted] = useState<Address | null>(null);
  const [draft, setDraft] = useState<Address | null>(null);
  const [mode, setMode] = useState('healthy');
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (localStorage.getItem('pr-proof-session') !== 'verified') {
      router.replace('/login');
      return;
    }
    fetch('/api/shipping-address')
      .then((r) => r.json())
      .then(({ address, mode: nextMode }) => {
        setPersisted(address);
        setDraft(address);
        setMode(nextMode);
      });
  }, [router]);
  if (!draft || !persisted) {
    return (
      <main>
        <p>Loading UAT account…</p>
      </main>
    );
  }
  async function save() {
    setStatus('');
    const response = await fetch('/api/shipping-address', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(draft),
    });
    if (!response.ok) {
      setStatus('Could not save address');
      return;
    }
    const { address } = await response.json();
    setPersisted(address);
    setDraft(address);
    setStatus('Address saved!');
  }
  function cancel() {
    if (mode === 'healthy') {
      setDraft(persisted);
    }
    // Deliberate UAT test fixture bug. Used by PR Proof E2E tests.
    if (mode === 'cancel-bug') {
      setStatus('Changes cancelled');
    } else {
      setStatus('Changes discarded');
    }
  }
  return (
    <main data-testid="shipping-address-page">
      <div className="tag">Account settings · UAT</div>
      <h1>Shipping address</h1>
      <p>Changes are persisted only after Save.</p>
      <label>
        Street address
        <input
          data-testid="street"
          value={draft.street}
          onChange={(e) => setDraft({ ...draft, street: e.target.value })}
        />
      </label>
      <label>
        City
        <input
          data-testid="city"
          value={draft.city}
          onChange={(e) => setDraft({ ...draft, city: e.target.value })}
        />
      </label>
      <label>
        Postal code
        <input
          data-testid="postal-code"
          value={draft.postalCode}
          onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })}
        />
      </label>
      <label>
        Country
        <input
          data-testid="country"
          value={draft.country}
          onChange={(e) => setDraft({ ...draft, country: e.target.value })}
        />
      </label>
      <button data-testid="save-address" onClick={save}>
        Save address
      </button>
      <button data-testid="cancel-address" className="secondary" onClick={cancel}>
        Cancel
      </button>
      <p data-testid="save-status" className="status">
        {status}
      </p>
    </main>
  );
}
