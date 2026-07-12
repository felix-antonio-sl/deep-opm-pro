/** Formato HH:mm 24h para superficies de persistencia e Inspector. */
export function formatearHoraGuardado(timestamp: number | null | undefined): string | null {
  if (!timestamp || !Number.isFinite(timestamp)) return null;
  return new Date(timestamp).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
