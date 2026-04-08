import { formatEther } from 'viem';
import { usePublicClient } from 'wagmi';
import { useEffect, useState } from 'react';
import { STOKVEL_ADDRESS, STOKVEL_ABI } from '../contract';

interface PayoutEvent {
  cycle: string;
  recipient: string;
  amount: string;
  txHash: string;
}

export default function CycleHistory({ groupId }: { groupId: bigint }) {
  const client = usePublicClient();
  const [events, setEvents] = useState<PayoutEvent[]>([]);

  useEffect(() => {
    if (!client) return;
    client.getLogs({
      address: STOKVEL_ADDRESS,
      event: STOKVEL_ABI.find(e => e.type === 'event' && e.name === 'PayoutSent') as any,
      args: { groupId },
      fromBlock: 'earliest',
    }).then(logs => {
      setEvents(logs.map(l => ({
        cycle: (l.args as any).cycle?.toString() ?? '',
        recipient: (l.args as any).recipient ?? '',
        amount: formatEther((l.args as any).amount ?? 0n),
        txHash: l.transactionHash ?? '',
      })));
    });
  }, [client, groupId]);

  if (!events.length) return null;

  return (
    <div className="mt-4">
      <p className="text-xs text-text-dim uppercase tracking-widest mb-2">Payout History</p>
      <div className="flex flex-col gap-2">
        {events.map((e, i) => (
          <div key={i} className="flex items-center justify-between text-sm bg-app-hover rounded-xl px-4 py-2">
            <span className="text-text-dim">Cycle {e.cycle}</span>
            <span className="font-mono text-xs">{e.recipient.slice(0,6)}…{e.recipient.slice(-4)}</span>
            <span className="font-bold">{e.amount} CELO</span>
          </div>
        ))}
      </div>
    </div>
  );
}
