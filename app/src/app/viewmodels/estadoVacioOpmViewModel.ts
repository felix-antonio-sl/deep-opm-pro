import { useMemo } from "preact/hooks";
import { posicionLibre } from "../../modelo/layout";
import { validarFirmaEnlace } from "../../modelo/operaciones";
import type { Apariencia, Entidad, Id, Modelo, TipoEntidad } from "../../modelo/tipos";
import { useZustandEditabilityPort } from "../ports/zustandEditabilityPort";
import { useZustandModelBootstrapPort } from "../ports/zustandModelBootstrapPort";
import { useZustandModelCommandPort } from "../ports/zustandModelCommandPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";

export interface SugerenciaEnlaceResultado {
  proceso: Entidad;
  objeto: Entidad;
}

export function useEstadoVacioOpmViewModel() {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const { readOnly } = useZustandEditabilityPort();
  const { crearEntidadEnCanvas, crearEnlaceEntreEntidades } = useZustandModelCommandPort();
  const { iniciarAsistente } = useZustandModelBootstrapPort();

  const apariencias = useMemo(
    () => Object.values(modelo.opds[opdActivoId]?.apariencias ?? {}) as Apariencia[],
    [modelo.opds, opdActivoId],
  );
  const enlacesEnOpd = useMemo(
    () => Object.values(modelo.opds[opdActivoId]?.enlaces ?? {}),
    [modelo.opds, opdActivoId],
  );
  const entidadesVisibles = useMemo(
    () => apariencias
      .map((apariencia) => modelo.entidades[apariencia.entidadId])
      .filter((entidad): entidad is Entidad => !!entidad),
    [apariencias, modelo.entidades],
  );
  const sugerenciaResultado = sugerirEnlaceResultado(entidadesVisibles, enlacesEnOpd.length);

  const crearEntidadCentrada = (tipo: TipoEntidad) => {
    handleCrearCentrado(crearEntidadEnCanvas, modelo, opdActivoId, tipo);
  };

  const conectarResultado = () => {
    if (!sugerenciaResultado) return;
    crearEnlaceEntreEntidades(
      sugerenciaResultado.proceso.id,
      sugerenciaResultado.objeto.id,
      "resultado",
    );
  };

  return {
    readOnly,
    estaVacio: apariencias.length === 0,
    sugerenciaResultado,
    crearProceso: () => crearEntidadCentrada("proceso"),
    crearObjeto: () => crearEntidadCentrada("objeto"),
    crearAgenteInstrumento: () => crearEntidadCentrada("objeto"),
    iniciarAsistente,
    conectarResultado,
  };
}

/**
 * Determina si conviene ofrecer "Conectar como resultado" en el OPD activo.
 *
 * Reglas (cerradas):
 *  - Exactamente 2 entidades visibles (no mas: arriba de eso el estado vacio
 *    cumplio su rol y el usuario tiene toolbar/contextual).
 *  - Una proceso, una objeto.
 *  - 0 enlaces aun.
 *  - Firma legal validarFirmaEnlace("resultado", proceso, objeto).
 */
export function sugerirEnlaceResultado(
  entidadesVisibles: readonly Entidad[],
  cantidadEnlaces: number,
): SugerenciaEnlaceResultado | null {
  if (entidadesVisibles.length !== 2) return null;
  if (cantidadEnlaces > 0) return null;
  const proceso = entidadesVisibles.find((entidad) => entidad.tipo === "proceso");
  const objeto = entidadesVisibles.find((entidad) => entidad.tipo === "objeto");
  if (!proceso || !objeto) return null;
  const firma = validarFirmaEnlace("resultado", proceso, objeto);
  if (!firma.ok) return null;
  return { proceso, objeto };
}

function handleCrearCentrado(
  crearEntidadEnCanvas: (tipo: TipoEntidad, posicion: { x: number; y: number }) => void,
  modelo: Modelo,
  opdActivoId: Id,
  tipo: TipoEntidad,
): void {
  // Reutilizamos `posicionLibre` (la misma que usan crearObjetoDemo/
  // crearProcesoDemo) para conservar el layout canonico. La accion
  // `crearEntidadEnCanvas` activa `nuevaCosaPendiente`, que monta el
  // modal de nombre (sub-ViewContainer existente). NO inventamos flujo.
  const posicion = posicionLibre(modelo, opdActivoId, tipo);
  crearEntidadEnCanvas(tipo, posicion);
}

export type EstadoVacioOpmViewModel = ReturnType<typeof useEstadoVacioOpmViewModel>;
