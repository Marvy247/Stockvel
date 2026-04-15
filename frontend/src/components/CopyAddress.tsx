import { useState } from 'react';

export default function CopyAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="font-mono text-sm text-text-dim hover:text-accent-indigo transition-colors">
      {address.slice(0,6)}…{address.slice(-4)} {copied ? '✓' : '⎘'}
    </button>
  );
}
