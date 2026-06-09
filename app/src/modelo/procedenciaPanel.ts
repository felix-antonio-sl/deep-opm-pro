import type { Modelo, SelloProcedencia } from "./tipos";

/**
 * W6.6: datos del panel de procedencia/staleness (Inspector, rama vacía).
 * Proyección pura Modelo → panel. La verificación REAL de divergencia
 * (recomputar `protoHash`) solo puede correr donde vive el proto — CLI
 * `verify:reproducible` (H2) — porque la app no porta el proto. Aquí la app
 * REPORTA honesto (acta flujo-canónico: la divergencia se reporta, no degrada):
 * muestra el sello y, si el modelo fue editado en la app, advierte que difiere
 * del bundle emitido (el canal de corrección es re-elicitar en la skill).
 */
export interface InfoProcedencia {
  sello: SelloProcedencia;
  /** Doctrina read-through: el proto es la fuente única. */
  nota: string;
  /** Solo cuando el modelo fue editado en la app tras la emisión. */
  advertencia: string | null;
}

export function infoProcedencia(
  modelo: Modelo,
  opciones: { editadoEnApp?: boolean },
): InfoProcedencia | null {
  const sello = modelo.procedencia;
  if (!sello) return null;
  return {
    sello,
    nota: "Emitido por el compilador de autoría. El proto es la fuente única: las correcciones se re-elicitan en la skill.",
    advertencia: opciones.editadoEnApp === true
      ? "Editado en la app: difiere del bundle emitido. Verificar con verify:reproducible donde vive el proto."
      : null,
  };
}
