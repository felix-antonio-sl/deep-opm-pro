export function isValidTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value));
}

export function isTimestampAfter(candidate: string, base: string): boolean {
  const candidateMs = Date.parse(candidate);
  const baseMs = Date.parse(base);
  return Number.isFinite(candidateMs) && Number.isFinite(baseMs) && candidateMs > baseMs;
}
