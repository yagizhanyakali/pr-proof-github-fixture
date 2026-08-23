'use client';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      setError('Invalid test credentials');
      return;
    }
    localStorage.setItem('pr-proof-session', 'verified');
    router.push('/profile/shipping-address');
  }
  return (
    <main>
      <div className="tag">PR Proof · UAT testbed</div>
      <h1>Sign in</h1>
      <p>Use the dedicated test account to verify the shipping-address flow.</p>
      <form onSubmit={submit}>
        <label>
          Email
          <input
            data-testid="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </label>
        <label>
          Password
          <input
            data-testid="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button data-testid="login-submit" type="submit">
          Continue
        </button>
      </form>
    </main>
  );
}
