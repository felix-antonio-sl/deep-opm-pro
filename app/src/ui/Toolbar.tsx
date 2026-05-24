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
            <>
              {autosalvado.activo ? (
                <span
                  data-testid="toolbar-autosave-status"
                  style={autosalvado.salvando ? style.autosaveSaving : style.autosaveIdle}
                  title={autosalvado.ultimo
                    ? `Autosalvado activo · Último: ${new Date(autosalvado.ultimo).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`
                    : "Autosalvado activo"}
                >
                  {/* Ronda 28 L2 Bauhaus: glyph ● activo (autosalvado en curso)
                      o ○ pausado, ink en ambos casos. NO usar verde. */}
                  <span aria-hidden="true">{autosalvado.salvando ? "●" : "○"}</span>
                  <span>Auto</span>
                </span>
              ) : null}
            </>
          )}
        />
      </Suspense>
    </div>
  );
}
