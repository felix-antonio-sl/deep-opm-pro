import { useMemo } from "preact/hooks";
import { validarFirmaEnlace } from "../../modelo/operaciones";
import type { Apariencia, Entidad } from "../../modelo/tipos";
import { useZustandEditabilityPort } from "../ports/zustandEditabilityPort";
import { useZustandModelCommandPort } from "../ports/zustandModelCommandPort";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";

export interface SugerenciaEnlaceResultado {
  proceso: Entidad;
  objeto: Entidad;
}

export function useEstadoVacioOpmViewModel() {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  const { readOnly } = useZustandEditabilityPort();
  const { crearEnlaceEntreEntidades } = useZustandModelCommandPort();

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

export type EstadoVacioOpmViewModel = ReturnType<typeof useEstadoVacioOpmViewModel>;
