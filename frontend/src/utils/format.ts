import { formatEther } from 'viem';

export function formatCELO(wei: bigint, decimals = 4): string {
  return `${parseFloat(formatEther(wei)).toFixed(decimals)} CELO`;
}

export function formatAddress(addr: string): string {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString();
}
