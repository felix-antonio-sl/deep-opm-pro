// W3.3 — Clasificación geométrica de contención de in-zoom (pura, sin JointJS, sin emisión).
// Generaliza el núcleo geométrico de `verificarContencion` (antes embebido en `bundle.ts`):
// para cada OPD con contorno (in-zoom), parte sus apariencias en INTERNAS y EXTERNAS según su ROL
// DECLARADO (`contextoRefinamiento.rol`, semántico — NO geométrico) y mide los dos incumplimientos
// geométricos posibles:
//   - `internosFuera`:  internas cuya caja NO está completamente dentro del bbox del contorno.
//   - `externosDentro`: externas cuya caja SÍ cae (completa) dentro del bbox del contorno.
// La invariante de contención (Ley L7) exige ambos contadores en CERO.
//
// Importante (falsificabilidad): la partición interna/externa se hace por el ROL declarado, no por
// la geometría. Si se clasificara por geometría (como `aparienciaEsInternaDeRefinamiento`, que pide
// `rol==="interno" && dentroDelContorno`), entonces "internos están dentro" sería TAUTOLÓGICO —
// mover un interno fuera lo re-clasificaría como no-interno y el incumplimiento desaparecería. Con
// rol declarado, mover un interno fuera SÍ se cuenta como `internosFuera` (la ley es falsificable).
//
// `bundle.ts` consume esta clasificación para el reporte/gate de emisión (y le añade encima la
// verificación de rigidez de arrastre: mover el contorno arrastra internas, no externas). La ley
// `leyes/contencion-refinamiento.test.ts` la consume como predicado de invariante. En modelos bien
// formados (todo interno dentro, todo externo fuera) la partición por rol coincide con la histórica
// de `aparienciaEsInternaDeRefinamiento`, por lo que `bundle.ts` mantiene su comportamiento exacto
// (verificado por byte-identidad del golden y por `autoria.test.ts` § contención PASS).
import { contenedorRefinamiento, dentroDeApariencia } from "../modelo/layout";
import type { Apariencia, Id, Modelo } from "../modelo/tipos";

/** Clasificación de contención de un OPD con contorno (in-zoom). */
export interface ContencionOpd {
  opdId: Id;
  nombre: string;
  internas: Apariencia[];
  externas: Apariencia[];
  /** Internas cuya caja NO está completamente dentro del bbox del contorno (incumplimiento). */
  internosFuera: Apariencia[];
  /** Externas cuya caja SÍ cae dentro del bbox del contorno (incumplimiento). */
  externosDentro: Apariencia[];
}

/**
 * Clasifica un único OPD. Devuelve `null` si el OPD no tiene contorno de refinamiento
 * (no es un in-zoom, la contención no aplica).
 */
export function clasificarContencionOpd(modelo: Modelo, opdId: Id): ContencionOpd | null {
  const opd = modelo.opds[opdId];
  if (!opd) return null;
  const contorno = contenedorRefinamiento(modelo, opdId);
  if (!contorno) return null;

  // Partición por ROL DECLARADO (semántico, no geométrico) — clave para la falsificabilidad de L7.
  const candidatas = Object.values(opd.apariencias).filter((apariencia) => apariencia.id !== contorno.id);
  const internas = candidatas.filter((apariencia) => apariencia.contextoRefinamiento?.rol === "interno");
  const externas = candidatas.filter((apariencia) => apariencia.contextoRefinamiento?.rol === "externo");

  const internosFuera = internas.filter((apariencia) => !dentroDeApariencia(apariencia, contorno));
  const externosDentro = externas.filter((apariencia) => dentroDeApariencia(apariencia, contorno));

  return { opdId, nombre: opd.nombre, internas, externas, internosFuera, externosDentro };
}

/** Clasifica todos los OPDs con contorno del modelo (orden estable por `ordenLocal`). */
export function clasificarContencion(modelo: Modelo): ContencionOpd[] {
  return Object.values(modelo.opds)
    .sort((a, b) => (a.ordenLocal ?? 0) - (b.ordenLocal ?? 0))
    .map((opd) => clasificarContencionOpd(modelo, opd.id))
    .filter((c): c is ContencionOpd => c !== null);
}
