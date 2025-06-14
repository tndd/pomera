'use client';
import { useEffect, useState } from 'react';

export default function ClientOnly() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  if (!ready) return null;
  return (
    <div>
      <h1>ClientShadow</h1>
      <p>This content only appears after client-side rendering.</p>
    </div>
  );
}
