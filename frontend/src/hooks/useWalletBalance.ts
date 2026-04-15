import { useBalance, useAccount } from 'wagmi';
import { celo } from 'wagmi/chains';

export function useWalletBalance() {
  const { address } = useAccount();
  return useBalance({ address, chainId: celo.id });
}
