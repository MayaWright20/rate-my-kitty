export function calculateScore(upvotes: number, downvotes: number): number {
  const total = upvotes + downvotes;
  if (total === 0) return 0;
  return Math.round((upvotes / total) * 100);
}
