/**
 * ViewContainer Toolbar: orquestador delgado por modo editor. [JOYAS §1-3], [V-0c], IFML H-2/H-5/H-10/H-12.
 */
import { Suspense } from "preact/compat";
import { useEffect } from "preact/hooks";
import { useOpmStore } from "../store";
import { ToolbarBase } from "./toolbar/ToolbarBase";
import { ToolbarCreacion, TIPOS_ENLACE } from "./toolbar/ToolbarCreacion";
import { ToolbarMapaSistema } from "./toolbar/ToolbarMapaSistema";
import { ToolbarMultiseleccion } from "./toolbar/ToolbarMultiseleccion";
import { ToolbarSeleccion } from "./toolbar/ToolbarSeleccion";
import { toolbarStyle as style } from "./toolbar/toolbarStyles";

export { TIPOS_ENLACE };

/**
 * Toolbar ronda 13 L1: orquestador por modo del editor.
 * SSOT: [JOYAS §1-3], [V-0c]/[V-63]; contrato T2.1 opcion B + IFML H-2/H-5/H-10/H-12.
 */
export function Toolbar() {
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const vistaMapaActiva = useOpmStore((s) => s.vistaMapaActiva);
  const mensaje = useOpmStore((s) => s.mensaje);
  const limpiarMensaje = useOpmStore((s) => s.limpiarMensaje);
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const cantidadSeleccion = seleccionados.length;

  useEffect(() => {
    if (!mensaje || modoEnlace || modoCreacion) return undefined;
    const timeout = window.setTimeout(limpiarMensaje, 4_500);
    return () => window.clearTimeout(timeout);
  }, [limpiarMensaje, mensaje, modoCreacion, modoEnlace]);

  return (
    <div data-testid="toolbar-root" style={style.bar}>
      <Suspense fallback={null}>
        <ToolbarBase>
          <ToolbarCreacion />
          <ToolbarSeleccion />
          {cantidadSeleccion >= 2 ? <ToolbarMultiseleccion /> : null}
          {vistaMapaActiva ? <ToolbarMapaSistema /> : null}
          {mensaje ? <span style={style.status}>{mensaje}</span> : null}
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
        </ToolbarBase>
      </Suspense>
    </div>
  );
}
