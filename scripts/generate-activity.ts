#!/usr/bin/env node
/**
 * Stokvel Activity Generator
 * - Contributes to the current cycle
 * - Triggers payout if cycle is over (advances to next cycle)
 * - Runs every 3 minutes via run-activity.sh
 * Usage: npx tsx scripts/generate-activity.ts
 */

import { createWalletClient, createPublicClient, http, parseEther } from 'viem';
import { celo } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const env = readFileSync(resolve(__dirname, '../contracts/.env'), 'utf8');
const match = env.match(/PRIVATE_KEY=(.+)/);
if (!match) { console.error('PRIVATE_KEY not found in contracts/.env'); process.exit(1); }
const PRIVATE_KEY = match[1].trim() as `0x${string}`;

const CONTRACT = '0x076D775b1d0365527ebE730222b718bc2E9f3EB6' as `0x${string}`;
const GROUP_ID = 0n;
const AMOUNT = parseEther('0.01');

const ABI = [
  { name: 'contribute',     type: 'function', stateMutability: 'payable',    inputs: [{ name: 'groupId', type: 'uint256' }], outputs: [] },
  { name: 'triggerPayout',  type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'groupId', type: 'uint256' }], outputs: [] },
  { name: 'getGroup',       type: 'function', stateMutability: 'view',
    inputs: [{ name: 'groupId', type: 'uint256' }],
    outputs: [
      { name: 'name',               type: 'string'  },
      { name: 'admin',              type: 'address' },
      { name: 'contributionAmount', type: 'uint256' },
      { name: 'cycleDuration',      type: 'uint256' },
      { name: 'cycleStart',         type: 'uint256' },
      { name: 'currentCycle',       type: 'uint256' },
      { name: 'memberCount',        type: 'uint256' },
    ]
  },
  { name: 'hasContributed', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'groupId', type: 'uint256' }, { name: 'cycle', type: 'uint256' }, { name: 'member', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }]
  },
] as const;

const account = privateKeyToAccount(PRIVATE_KEY);
const publicClient = createPublicClient({ chain: celo, transport: http() });
const walletClient = createWalletClient({ account, chain: celo, transport: http() });

async function send(fn: 'contribute' | 'triggerPayout', value?: bigint) {
  try {
    const hash = await walletClient.writeContract({
      address: CONTRACT, abi: ABI, functionName: fn,
      args: [GROUP_ID],
      ...(value ? { value } : {}),
    });
    console.log(`  ✅ ${fn}: https://explorer.celo.org/mainnet/tx/${hash}`);
    return true;
  } catch (e: any) {
    console.error(`  ❌ ${fn}: ${e.shortMessage ?? e.message}`);
    return false;
  }
}

async function main() {
  console.log(`[${new Date().toISOString()}] Sender: ${account.address}`);

  const group = await publicClient.readContract({ address: CONTRACT, abi: ABI, functionName: 'getGroup', args: [GROUP_ID] });
  const [,, , cycleDuration, cycleStart, currentCycle] = group;
  const cycleOver = BigInt(Math.floor(Date.now() / 1000)) >= cycleStart + cycleDuration;

  console.log(`  Cycle ${currentCycle} | cycleOver: ${cycleOver}`);

  if (cycleOver) {
    // Trigger payout to advance cycle
    await send('triggerPayout');
  }

  // Contribute to current (or new) cycle
  const already = await publicClient.readContract({
    address: CONTRACT, abi: ABI, functionName: 'hasContributed',
    args: [GROUP_ID, currentCycle + (cycleOver ? 1n : 0n), account.address],
  });

  if (!already) {
    await send('contribute', AMOUNT);
  } else {
    console.log('  ℹ️  Already contributed this cycle — waiting for next cycle');
  }
}

main().catch(console.error);
