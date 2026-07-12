import { infoProcedencia } from "../../modelo/procedenciaPanel";
import { formatearHoraGuardado } from "./formatoPersistencia";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";
import { useZustandPersistencePort } from "../ports/zustandPersistencePort";
import { useZustandSelectionPort } from "../ports/zustandSelectionPort";
import { useZustandWorkbenchViewControlsPort } from "../ports/zustandWorkbenchViewControlsPort";

/**
 * Paquete "Estados ciudadanos de primera clase" (2026-05-23):
 * `modo` discrimina los tres ciudadanos del coproducto de selección
 * (entidad/enlace/estado) además de `vacio`. Cada caso renderiza un
 * inspector dedicado; ningún componente asume "estoy dentro de una
 * entidad seleccionada" — pattern-match natural sobre los tres campos.
 *
 * Spec: docs/superpowers/specs/2026-05-23-estados-ciudadania-primera-clase-design.md §4.4, §5.2.
 */
export type InspectorModo = "entidad" | "enlace" | "estado" | "vacio";

export interface ConteosModeloInspector {
  objetos: number;
  procesos: number;
  opds: number;
}

export function calcularConteosModelo(
  entidades: Record<string, { tipo: "objeto" | "proceso" }>,
  opds: Record<string, unknown>,
): ConteosModeloInspector {
  let objetos = 0;
  let procesos = 0;
  for (const id in entidades) {
    const entidad = entidades[id];
    if (!entidad) continue;
    if (entidad.tipo === "objeto") objetos += 1;
    else if (entidad.tipo === "proceso") procesos += 1;
  }
  return { objetos, procesos, opds: Object.keys(opds).length };
}

export function useInspectorViewModel() {
  const { modelo } = useZustandOpdNavigationPort();
  const { seleccionId, enlaceSeleccionId, estadoSeleccionId } = useZustandSelectionPort();
  const { modeloNombre, ultimoAutosalvado, dirty } = useZustandPersistencePort();
  const { abrirDialogoConfiguracion } = useZustandWorkbenchViewControlsPort();
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const enlace = enlaceSeleccionId ? modelo.enlaces[enlaceSeleccionId] : undefined;
  const estado = estadoSeleccionId ? modelo.estados?.[estadoSeleccionId] : undefined;
  // Discriminador natural sobre el invariante sellado: máximo uno de los tres
  // campos exclusivos es no-null al mismo tiempo (sello §4.2 del spec).
  const modo: InspectorModo = estado ? "estado" : entidad ? "entidad" : enlace ? "enlace" : "vacio";

  const conteos = calcularConteosModelo(modelo.entidades, modelo.opds);
  const horaEditado = formatearHoraGuardado(ultimoAutosalvado);
  // W6.6: panel de procedencia/staleness (rama vacía del Inspector). `dirty` =
  // editado en la app tras la emisión → la advertencia reporta, no degrada.
  const procedencia = infoProcedencia(modelo, { editadoEnApp: dirty });

  return {
    modo,
    entidad,
    enlace,
    estado,
    modeloNombre,
    conteos,
    horaEditado,
    procedencia,
    abrirDialogoConfiguracion,
  };
}

export type InspectorViewModel = ReturnType<typeof useInspectorViewModel>;
