// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Ronda Codex v2 / L3 (C9): el Inspector pasó de tabs a una ficha tipográfica
// continua. `FichaSeccion` es el bloque base de esa ficha — kicker mono
// uppercase + contenido (las `Seccion*.tsx` existentes), separado del bloque
// anterior por una hairline superior (ui-forja §9 CodexInspectSection). El
// apéndice §02:483 prohíbe explícitamente los tabs con underline-active.
//
// C′·A (re-auditoría 2026-07-07, M-4): las secciones ganan plegado opcional
// (`colapsable`) con memoria de sesión. El kicker se vuelve un header-botón con
// chevron; el contenido plegado NO se renderiza (no roba foco/tab). El conteo
// no-colapsable conserva el markup previo (retrocompatible; el Inspector de
// enlace lo reusa vía `FichaSeccionEnlace`).
import type { ComponentChildren } from "preact";
import { inspectorStyles as style } from "../inspectorStyles";
import { useColapso } from "./useColapso";

interface Props {
  kicker: string;
  /** testid del bloque — conserva los `inspector-panel-{id}` previos a los tabs. */
  testid: string;
  /** La primera sección no lleva border-top (ya separada del input/summary). */
  primera?: boolean;
  /** Cuando true, el kicker es un toggle y el contenido se pliega (memoria de sesión). */
  colapsable?: boolean;
  /** Estado inicial cuando no hay memoria de sesión (solo si `colapsable`). */
  defaultAbierta?: boolean;
  /** Clave de persistencia/evento; por defecto el kicker. */
  colapsoId?: string;
  children: ComponentChildren;
}

/**
 * Envoltorio de una sección apilada en la ficha del Inspector. Renderiza un
 * kicker mono uppercase y el contenido bajo una hairline superior. Con
 * `colapsable`, delega en `FichaSeccionColapsable` (que sí usa hook de estado).
 */
export function FichaSeccion({ kicker, testid, primera, colapsable = false, defaultAbierta = true, colapsoId, children }: Props) {
  if (colapsable) {
    return (
      <FichaSeccionColapsable
        kicker={kicker}
        testid={testid}
        primera={primera ?? false}
        defaultAbierta={defaultAbierta}
        colapsoId={colapsoId ?? kicker}
      >
        {children}
      </FichaSeccionColapsable>
    );
  }
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

interface ColapsableProps {
  kicker: string;
  testid: string;
  primera?: boolean;
  defaultAbierta: boolean;
  colapsoId: string;
  children: ComponentChildren;
}

function FichaSeccionColapsable({ kicker, testid, primera, defaultAbierta, colapsoId, children }: ColapsableProps) {
  const [abierta, alternar] = useColapso(colapsoId, defaultAbierta);
  const panelId = `${testid}-contenido`;
  return (
    <section
      data-testid={testid}
      data-inspector-seccion={kicker}
      data-colapso-key={colapsoId}
      style={primera ? style.fichaSeccionPrimera : style.fichaSeccion}
      aria-label={kicker}
    >
      <button
        type="button"
        style={style.fichaKickerBoton}
        aria-expanded={abierta}
        aria-controls={panelId}
        data-testid={`${testid}-toggle`}
        onClick={alternar}
      >
        <span style={style.fichaKicker}>{kicker}</span>
        <span style={style.fichaChevron} aria-hidden="true">{abierta ? "▾" : "▸"}</span>
      </button>
      {/* Plegado = `display:none`: fuera del layout (mata la altura de M-4) pero
          presente en el DOM y no-tabbable, para que `abrirSeccionesDe` pueda
          expandir al navegar (quick-action que enfoca un input aquí dentro). */}
      <div id={panelId} data-abierta={abierta ? "true" : "false"} style={abierta ? style.fichaContenido : style.fichaContenidoOculto}>{children}</div>
    </section>
  );
}

/** Alias para el inspector de enlace (mismo contrato, nombre simétrico). */
export const FichaSeccionEnlace = FichaSeccion;
