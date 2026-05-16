/**
 * ViewContainer Toolbar: orquestador delgado por modo editor. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-10/H-12.
 */
import { Suspense } from "preact/compat";
import { useOpmStore } from "../store";
import { ToolbarBase } from "./toolbar/ToolbarBase";
import { ToolbarCreacion } from "./toolbar/ToolbarCreacion";
import { ToolbarMapaSistema } from "./toolbar/ToolbarMapaSistema";
import { ToolbarMultiseleccion } from "./toolbar/ToolbarMultiseleccion";
import { toolbarStyle as style } from "./toolbar/toolbarStyles";

/**
 * Toolbar ronda 13 L1: orquestador por modo del editor.
 * SSOT: [JOYAS §1-3], [V-0c]/[V-63]; contrato T2.1 opcion B + IFML H-2/H-5/H-10/H-12.
 */
export function Toolbar() {
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const cantidadSeleccion = seleccionados.length;

  return (
    <div data-testid="toolbar-root" style={style.bar}>
      <Suspense fallback={null}>
        <ToolbarBase
          modelarSlot={cantidadSeleccion >= 2 ? <ToolbarMultiseleccion /> : null}
          conectarSlot={<ToolbarCreacion />}
          validarSlot={vistaMapaActiva ? <ToolbarMapaSistema /> : null}
          statusSlot={(
            <>
              {autosalvado.activo ? (
                <span
                  style={autosalvado.salvando ? style.autosaveSaving : style.autosaveIdle}
                  title={autosalvado.ultimo
                    ? `Autosalvado activo · Último: ${new Date(autosalvado.ultimo).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`
                    : "Autosalvado activo"}
                >
                  {autosalvado.salvando ? "●" : "○"} Auto
                </span>
              ) : null}
            </>
          )}
        />
      </Suspense>
    </div>
  );
}
