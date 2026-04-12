import { formatEther } from 'viem';
interface Props { totalCycles: bigint; memberCount: bigint; contributionAmount: bigint; }
export default function GroupStats({ totalCycles, memberCount, contributionAmount }: Props) {
  const totalVolume = totalCycles * memberCount * contributionAmount;
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      {[
        { label: 'Cycles', value: totalCycles.toString() },
        { label: 'Members', value: memberCount.toString() },
        { label: 'Total Volume', value: `${parseFloat(formatEther(totalVolume)).toFixed(2)} CELO` },
      ].map((s, i) => (
        <div key={i} className="bg-app-hover rounded-xl p-3">
          <p className="font-bold text-lg">{s.value}</p>
          <p className="text-xs text-text-dim">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
