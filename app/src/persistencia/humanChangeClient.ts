import { obtenerSesionBackend } from "./backend";
import { encodeSessionIdentity, SESSION_IDENTITY_HEADER } from "./sessionIdentity";
import { AgentClientError, type PreparedAgentChange } from "./agentClient";

/** Purpose-specific human proposals use the existing authenticated change API. */
export async function prepareHumanAuthoringRequest<T extends PreparedAgentChange>(
  route: "refinements" | "pieces",
  input: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const session = await obtenerSesionBackend();
  if (!session.ok) throw new AgentClientError(401, session.error);
  const response = await fetch(`/__deep-opm/agent/${route}`, {
    method: "POST", credentials: "same-origin", cache: "no-store",
    headers: { "content-type": "application/json", [SESSION_IDENTITY_HEADER]: encodeSessionIdentity(session.value) },
    body: JSON.stringify(input), ...(signal ? { signal } : {}),
  });
  const result: unknown = await response.json();
  if (!response.ok) {
    const error = result && typeof result === "object" && "error" in result ? result.error : null;
    throw new AgentClientError(response.status, typeof error === "string" ? error : "No se pudo preparar la propuesta");
  }
  return result as T;
}
