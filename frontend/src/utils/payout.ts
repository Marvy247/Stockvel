/** Returns the address that will receive the payout for a given cycle */
export function getPayoutRecipient(members: string[], cycle: number): string {
  if (!members.length) return '';
  return members[cycle % members.length];
}
