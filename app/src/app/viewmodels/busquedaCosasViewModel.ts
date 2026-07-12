import { useMemo } from "preact/hooks";
import type { Apariencia, Id, Modelo } from "../../modelo/tipos";
import type { BusquedaCosasFiltro, ResultadoBusquedaSalto } from "../../store/tipos";
import { useZustandModelSearchDialogPort } from "../ports/zustandSearchDialogsPort";

export type { BusquedaCosasFiltro };

export type ResultadoTipo = "objeto" | "proceso" | "estado" | "enlace";

export interface ResultadoBusqueda {
  /** Clave única para `key=` y testid. */
  clave: string;
  /** Tipo a mostrar en la fila. */
  tipo: ResultadoTipo;
  /** Etiqueta principal (nombre canónico). */
  etiqueta: string;
  /** Etiqueta secundaria (entidad padre cuando aplica, vacía si no). */
  contexto: string;
  /** Nombre del OPD destino. */
  opdNombre: string;
  /** Payload para `saltarAResultadoBusqueda`. */
  salto: ResultadoBusquedaSalto;
}

/**
 * Calcula apariciones que matchean `query` bajo el filtro `filtro`.
 * Pure: solo lee `modelo`. Sin caché global; si la performance fuera un
 * problema observable, indexar derivados (no introducir índice persistente).
 */
export function calcularResultadosBusquedaCosas(
  modelo: Modelo,
  query: string,
  filtro: BusquedaCosasFiltro,
): ResultadoBusqueda[] {
  const q = query.trim().toLocaleLowerCase("es-CL");
  if (!q) return [];

  const resultados: ResultadoBusqueda[] = [];
  const incluyeObjetos = filtro === "todos" || filtro === "objetos";
  const incluyeProcesos = filtro === "todos" || filtro === "procesos";
  const incluyeEstados = filtro === "todos" || filtro === "estados";
  const incluyeEnlaces = filtro === "todos" || filtro === "enlaces";

  // Apariciones de entidades: una fila por OPD donde aparece.
  if (incluyeObjetos || incluyeProcesos) {
    for (const entidad of Object.values(modelo.entidades)) {
      if (entidad.tipo === "objeto" && !incluyeObjetos) continue;
      if (entidad.tipo === "proceso" && !incluyeProcesos) continue;
      if (!entidad.nombre.toLocaleLowerCase("es-CL").includes(q)) continue;

      for (const opd of Object.values(modelo.opds)) {
        const apariencia = aparienciaDeEntidadEnOpd(opd.apariencias, entidad.id);
        if (!apariencia) continue;
        resultados.push({
          clave: `entidad:${entidad.id}:${opd.id}`,
          tipo: entidad.tipo as "objeto" | "proceso",
          etiqueta: entidad.nombre,
          contexto: "",
          opdNombre: opd.nombre,
          salto: {
            tipo: "entidad",
            entidadId: entidad.id,
            opdId: opd.id,
            aparienciaId: apariencia.id,
          },
        });
      }
    }
  }

  // Apariciones de estados: en OPDs donde la entidad padre tiene apariencia.
  if (incluyeEstados) {
    for (const estado of Object.values(modelo.estados)) {
      if (!estado.nombre.toLocaleLowerCase("es-CL").includes(q)) continue;
      const entidad = modelo.entidades[estado.entidadId];
      if (!entidad) continue;
      for (const opd of Object.values(modelo.opds)) {
        const apariencia = aparienciaDeEntidadEnOpd(opd.apariencias, entidad.id);
        if (!apariencia) continue;
        resultados.push({
          clave: `estado:${estado.id}:${opd.id}`,
          tipo: "estado",
          etiqueta: estado.nombre,
          contexto: entidad.nombre,
          opdNombre: opd.nombre,
          salto: {
            tipo: "estado",
            estadoId: estado.id,
            entidadId: entidad.id,
            opdId: opd.id,
            aparienciaId: apariencia.id,
          },
        });
      }
    }
  }

  // Etiquetas de enlace: una fila por OPD donde el enlace tiene apariencia.
  if (incluyeEnlaces) {
    for (const enlace of Object.values(modelo.enlaces)) {
      const etiqueta = enlace.etiqueta?.trim() ?? "";
      if (!etiqueta) continue;
      if (!etiqueta.toLocaleLowerCase("es-CL").includes(q)) continue;
      for (const opd of Object.values(modelo.opds)) {
        const aparece = Object.values(opd.enlaces).some((ap) => ap.enlaceId === enlace.id);
        if (!aparece) continue;
        resultados.push({
          clave: `enlace:${enlace.id}:${opd.id}`,
          tipo: "enlace",
          etiqueta,
          contexto: enlace.tipo,
          opdNombre: opd.nombre,
          salto: { tipo: "enlace", enlaceId: enlace.id, opdId: opd.id },
        });
      }
    }
  }

  return resultados.sort(ordenarResultados);
}

function aparienciaDeEntidadEnOpd(
  apariencias: Record<Id, Apariencia>,
  entidadId: Id,
): Apariencia | undefined {
  return Object.values(apariencias).find((ap) => ap.entidadId === entidadId);
}

function ordenarResultados(a: ResultadoBusqueda, b: ResultadoBusqueda): number {
  // Procesos primero, luego objetos, luego estados, luego enlaces.
  const orden: Record<ResultadoTipo, number> = { proceso: 0, objeto: 1, estado: 2, enlace: 3 };
  if (orden[a.tipo] !== orden[b.tipo]) return orden[a.tipo] - orden[b.tipo];
  const cmp = a.etiqueta.localeCompare(b.etiqueta, "es-CL");
  if (cmp !== 0) return cmp;
  return a.opdNombre.localeCompare(b.opdNombre, "es-CL");
}

/** Entidades (objeto/proceso) del resultado que NO aparecen en el OPD activo:
 *  candidatas a "Traer a este OPD" (una Thing puede aparecer en varios OPDs). */
export function entidadesTraiblesAlOpd(
  modelo: Modelo,
  resultados: readonly ResultadoBusqueda[],
  opdActivoId: Id,
): Set<Id> {
  const visibles = new Set(
    Object.values(modelo.opds[opdActivoId]?.apariencias ?? {}).map((apariencia) => apariencia.entidadId),
  );
  const traibles = new Set<Id>();
  for (const resultado of resultados) {
    if (resultado.salto.tipo !== "entidad") continue;
    if (!visibles.has(resultado.salto.entidadId)) traibles.add(resultado.salto.entidadId);
  }
  return traibles;
}

export function useDialogoBuscarCosasViewModel() {
  const { abierto, query, filtro, modelo, opdActivoId, cerrar, fijarQuery, fijarFiltro, saltar, traerAlOpdActivo, buscarEnWorkspace } =
    useZustandModelSearchDialogPort();

  const resultados = useMemo(
    () => calcularResultadosBusquedaCosas(modelo, query, filtro),
    [modelo, query, filtro],
  );
  const traibles = useMemo(
    () => entidadesTraiblesAlOpd(modelo, resultados, opdActivoId),
    [modelo, resultados, opdActivoId],
  );

  return {
    abierto,
    query,
    filtro,
    resultados,
    traibles,
    cerrar,
    fijarQuery,
    fijarFiltro,
    saltar,
    traerAlOpdActivo,
    buscarEnWorkspace,
  };
}

export type DialogoBuscarCosasViewModel = ReturnType<typeof useDialogoBuscarCosasViewModel>;
