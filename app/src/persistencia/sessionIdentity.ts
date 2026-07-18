export const SESSION_IDENTITY_HEADER = "x-opforja-session-identity";

export interface SessionIdentity {
  tenantId: string;
  userId: string;
}

/**
 * Untrusted expectation sent by the browser and compared with the identity
 * resolved from its HttpOnly cookie. It never grants authority by itself.
 */
export function encodeSessionIdentity(session: SessionIdentity): string {
  return `${encodeURIComponent(session.tenantId)}:${encodeURIComponent(session.userId)}`;
}
