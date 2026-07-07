/**
 * Estado de la vitrina de revisión para el modelo activo. El corazón de la
 * ramificación del chip A′-vitrina (spec 2026-07-06-puente-directo §6).
 *
 * `hayCambiosLocales === dirty`: es el ÚNICO estado que una recarga a la
 * revisión del agente descartaría silenciosamente. El 409 fast-forward del
 * backend garantiza que toda revisión remota más nueva se construyó sobre el
 * estado consolidado del operador → con `dirty=false` recargar es sin pérdida.
 * Ver docs/memorias-aprendizajes/notas-vitrina.md.
 */
export type EstadoVitrina =
  | { visible: false }
  | { visible: true; revisionRemota: number; hayCambiosLocales: boolean };

export function evaluarVitrina(input: {
  modeloPersistidoId: string | null;
  revisionRemota: { modeloId: string; revision: number } | null;
  revisionBase: number | null;
  dirty: boolean;
}): EstadoVitrina {
  const { modeloPersistidoId, revisionRemota, revisionBase, dirty } = input;
  if (modeloPersistidoId === null) return { visible: false };
  if (revisionRemota === null || revisionRemota.modeloId !== modeloPersistidoId) return { visible: false };
  if (revisionBase === null) return { visible: false };
  if (revisionRemota.revision <= revisionBase) return { visible: false };
  return { visible: true, revisionRemota: revisionRemota.revision, hayCambiosLocales: dirty };
}
