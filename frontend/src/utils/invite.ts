/** Generate a shareable invite link for a group */
export function getInviteLink(groupId: number): string {
  return `${window.location.origin}/dashboard?join=${groupId}`;
}

export function copyInviteLink(groupId: number): void {
  navigator.clipboard.writeText(getInviteLink(groupId));
}
