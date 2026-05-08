// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { inspectorStyles as style } from "../inspectorStyles";

/**
 * L1 ronda 20 — Tabs por intención del Inspector.
 *
 * Componente genérico tipado por la unión de ids de tab. Renderiza una
 * barra `role="tablist"` con un botón `role="tab"` por cada tab, marcando
 * `aria-selected` y conectando con el panel destino vía `aria-controls`.
 *
 * Decisión bloqueada §10 brief: solo texto, peso 700 al activo, sin íconos.
 * Divisor: gap mayor sin línea sólida entre tabs (sí un borde inferior
 * sutil en la fila completa para respiración visual con el panel).
 *
 * Anchor para tests:
 * - data-testid="inspector-tabs-{ariaLabel kebab}" sobre la fila;
 * - data-testid del propio tab (provisto por consumidor) sobre cada botón.
 */

export interface InspectorTabDef<T extends string> {
  readonly id: T;
  readonly label: string;
  readonly testid: string;
}

interface Props<T extends string> {
  tabs: ReadonlyArray<InspectorTabDef<T>>;
  activo: T;
  onCambiar: (tab: T) => void;
  ariaLabel: string;
  /** Prefijo para `aria-controls`/`id` del panel: por defecto `inspector-panel`. */
  panelIdPrefix?: string;
}

export function InspectorTabs<T extends string>({ tabs, activo, onCambiar, ariaLabel, panelIdPrefix = "inspector-panel" }: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      data-testid="inspector-tabs"
      style={style.tabsRow}
    >
      {tabs.map((tab) => {
        const seleccionado = tab.id === activo;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={seleccionado}
            aria-controls={`${panelIdPrefix}-${tab.id}`}
            data-testid={tab.testid}
            tabIndex={seleccionado ? 0 : -1}
            style={seleccionado ? style.tabActive : style.tab}
            onClick={() => {
              if (!seleccionado) onCambiar(tab.id);
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
