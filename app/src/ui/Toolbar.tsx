/**
 * ViewContainer Toolbar: orquestador delgado por modo editor. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-10/H-12.
 */
import { Suspense } from "preact/compat";
import { useToolbarViewModel } from "../app/viewmodels/toolbarViewModel";
import { ToolbarBase } from "./toolbar/ToolbarBase";
import { ToolbarCreacion } from "./toolbar/ToolbarCreacion";
import { toolbarStyle as style } from "./toolbar/toolbarStyles";

/**
 * Toolbar ronda 13 L1: orquestador por modo del editor.
 * SSOT: [JOYAS §1-3], [V-0c]/[V-63]; contrato T2.1 opcion B + IFML H-2/H-5/H-10/H-12.
 */
export function Toolbar() {
  const { autosalvado } = useToolbarViewModel();

  return (
    <div data-testid="toolbar-root" style={style.bar}>
      <Suspense fallback={null}>
        <ToolbarBase
          conectarSlot={<ToolbarCreacion />}
          statusSlot={(
            <span
              data-testid="toolbar-autosave-status"
              style={style.inlineStatus}
              role="status"
              aria-label={autosalvado.activo ? "Autosalvado activo" : "Autosalvado pausado"}
              title={autosalvado.ultimo
                ? `Autosalvado ${autosalvado.activo ? "activo" : "pausado"} · Último: ${new Date(autosalvado.ultimo).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`
                : `Autosalvado ${autosalvado.activo ? "activo" : "pausado"}`}
            >
              <span aria-hidden="true" style={style.statusDot}>{autosalvado.activo ? "●" : "○"}</span>
              <span style={style.statusLabel}>Auto</span>
            </span>
          )}
        />
      </Suspense>
    </div>
  );
}
