// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Ronda Codex v2 / L3 (C9): el Inspector pasó de tabs a una ficha tipográfica
// continua. `FichaSeccion` es el bloque base de esa ficha — kicker mono
// uppercase + contenido (las `Seccion*.tsx` existentes), separado del bloque
// anterior por una hairline superior (ui-forja §9 CodexInspectSection). El
// apéndice §02:483 prohíbe explícitamente los tabs con underline-active.
import type { ComponentChildren } from "preact";
import { inspectorStyles as style } from "../inspectorStyles";

interface Props {
  kicker: string;
  /** testid del bloque — conserva los `inspector-panel-{id}` previos a los tabs. */
  testid: string;
  /** La primera sección no lleva border-top (ya separada del input/summary). */
  primera?: boolean;
  children: ComponentChildren;
}

/**
 * Envoltorio de una sección apilada en la ficha del Inspector (entidad o
 * enlace). Renderiza un kicker mono uppercase y el contenido bajo una hairline
 * superior. Reemplaza al antiguo `role="tabpanel"`.
 */
export function FichaSeccion({ kicker, testid, primera, children }: Props) {
  return (
    <section
      data-testid={testid}
      data-inspector-seccion={kicker}
      style={primera ? style.fichaSeccionPrimera : style.fichaSeccion}
      aria-label={kicker}
    >
      <p style={style.fichaKicker}>{kicker}</p>
      <div style={style.fichaContenido}>{children}</div>
    </section>
  );
}

/** Alias para el inspector de enlace (mismo contrato, nombre simétrico). */
export const FichaSeccionEnlace = FichaSeccion;
