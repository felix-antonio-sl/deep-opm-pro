export type SessionEpoch = number;

let currentEpoch = 0;
let pendingRemoteLogout: Promise<void> = Promise.resolve();

/** Captures the session boundary an async operation belongs to. */
export function captureSessionEpoch(): SessionEpoch {
  return currentEpoch;
}

/** Invalidates every async operation captured before this transition. */
export function advanceSessionEpoch(): SessionEpoch {
  currentEpoch += 1;
  return currentEpoch;
}

export function isSessionEpochCurrent(epoch: SessionEpoch): boolean {
  return epoch === currentEpoch;
}

/**
 * Serializes remote logout effects. Login waits for this chain so a delayed
 * logout Set-Cookie cannot erase the cookie created by the next login.
 */
export function enqueueRemoteLogout<T>(effect: () => Promise<T>): Promise<T> {
  const result = pendingRemoteLogout.then(effect, effect);
  pendingRemoteLogout = result.then(
      () => undefined,
      () => undefined,
  );
  return result;
}

export async function waitForPendingRemoteLogout(): Promise<void> {
  await pendingRemoteLogout;
}
