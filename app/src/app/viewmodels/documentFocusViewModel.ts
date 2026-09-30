import { refinaA, refinamientosDe } from "../../modelo/refinamientos";
import type { Id, Modelo, TipoRefinamiento } from "../../modelo/tipos";
import { useZustandOpdNavigationPort } from "../ports/zustandOpdNavigationPort";

export interface DocumentFocusSegment {
  opdId: Id;
  nombre: string;
  nivel: number;
}

export interface DocumentRefinementTarget {
  opdId: Id;
  opdNombre: string;
  entidadId: Id;
  entidadNombre: string;
  tipo: TipoRefinamiento;
}

export interface DocumentFocusViewModel {
  root: { opdId: Id; nombre: string } | null;
  active: { opdId: Id; nombre: string; nivel: number } | null;
  path: DocumentFocusSegment[];
  referrer: { opdId: Id; nombre: string; entidadId: Id; entidadNombre: string; tipo: TipoRefinamiento } | null;
  refinements: DocumentRefinementTarget[];
  opl: {
    panel: "modelo-completo" | "opd-local";
    copyLocal: { opdId: Id; etiqueta: string } | null;
    exportComplete: { etiqueta: string; comando: "exportar-opl-modelo" };
  };
  actions: {
    navigateRefinement: { kind: "navigation"; changesModel: false; targets: DocumentRefinementTarget[] };
    createRefinement: { kind: "creation"; changesModel: true; requiresQuestion: true };
    materializeView: { kind: "view-materialization"; supported: false; createsOpmFacts: false };
    proposeRefinement: { kind: "proposal"; supported: true; createsOpmFacts: false; requiresConfirmation: true };
    changeDeclaredOrder: { kind: "semantic-change"; field: "ordenInzoom"; bands: Id[][] } | null;
  };
}

/**
 * Proyección pura del foco documental. La navegación identifica un destino ya
 * existente y no cambia el modelo; crear y proponer refinamiento quedan como
 * acciones distintas, con el límite de propuesta explícito.
 */
export function derivarDocumentFocusViewModel(modelo: Modelo, opdActivoId: Id): DocumentFocusViewModel {
  const rootOpd = modelo.opds[modelo.opdRaizId];
  const root = rootOpd ? { opdId: rootOpd.id, nombre: rootOpd.nombre } : null;
  const path = derivarRuta(modelo, opdActivoId);
  const opdActivo = modelo.opds[opdActivoId] ?? null;
  const active = opdActivo
    ? { opdId: opdActivo.id, nombre: opdActivo.nombre, nivel: path.length > 0 ? path.length - 1 : 0 }
    : null;
  const referencia = opdActivo?.padreId ? resolverReferente(modelo, opdActivo.id, opdActivo.padreId) : null;
  const refinements = opdActivo ? derivarRefinamientosExistentes(modelo, opdActivo.id) : [];
  const oplPanel = esApunteLocal(modelo, opdActivoId) ? "opd-local" : "modelo-completo";
  const bands = opdActivo?.ordenInzoom?.map((banda) => [...banda]);
  const copyLocal = opdActivo
    ? { opdId: opdActivo.id, etiqueta: `OPL local · ${opdActivo.nombre}` }
    : null;

  return {
    root,
    active,
    path,
    referrer: referencia,
    refinements,
    opl: {
      panel: oplPanel,
      copyLocal,
      exportComplete: { etiqueta: "OPL completo del modelo", comando: "exportar-opl-modelo" },
    },
    actions: {
      navigateRefinement: { kind: "navigation", changesModel: false, targets: refinements },
      createRefinement: { kind: "creation", changesModel: true, requiresQuestion: true },
      materializeView: { kind: "view-materialization", supported: false, createsOpmFacts: false },
      proposeRefinement: { kind: "proposal", supported: true, createsOpmFacts: false, requiresConfirmation: true },
      changeDeclaredOrder: bands ? { kind: "semantic-change", field: "ordenInzoom", bands } : null,
    },
  };
}

export function useDocumentFocusViewModel(): DocumentFocusViewModel {
  const { modelo, opdActivoId } = useZustandOpdNavigationPort();
  return derivarDocumentFocusViewModel(modelo, opdActivoId);
}

function derivarRuta(modelo: Modelo, opdActivoId: Id): DocumentFocusSegment[] {
  const ruta: DocumentFocusSegment[] = [];
  const vistos = new Set<Id>();
  let actual = modelo.opds[opdActivoId];
  while (actual && !vistos.has(actual.id)) {
    vistos.add(actual.id);
    ruta.push({ opdId: actual.id, nombre: actual.nombre, nivel: ruta.length });
    actual = actual.padreId ? modelo.opds[actual.padreId] : undefined;
  }
  return ruta.reverse().map((segmento, nivel) => ({ ...segmento, nivel }));
}

function resolverReferente(
  modelo: Modelo,
  opdId: Id,
  opdPadreId: Id,
): DocumentFocusViewModel["referrer"] {
  if (!modelo.opds[opdId] || !modelo.opds[opdPadreId]) return null;
  for (const entidad of Object.values(modelo.entidades)) {
    const enlace = refinaA(entidad, opdId);
    if (!enlace) continue;
    return {
      opdId,
      nombre: modelo.opds[opdId]!.nombre,
      entidadId: entidad.id,
      entidadNombre: entidad.nombre,
      tipo: enlace.tipo,
    };
  }
  return null;
}

function derivarRefinamientosExistentes(modelo: Modelo, opdPadreId: Id): DocumentRefinementTarget[] {
  const objetivos: DocumentRefinementTarget[] = [];
  for (const entidad of Object.values(modelo.entidades)) {
    if (!Object.values(modelo.opds[opdPadreId]!.apariencias).some((apariencia) => apariencia.entidadId === entidad.id)) continue;
    for (const refinamiento of refinamientosDe(entidad)) {
      const opdHijo = modelo.opds[refinamiento.opdId];
      if (opdHijo?.padreId !== opdPadreId) continue;
      objetivos.push({
        opdId: opdHijo.id,
        opdNombre: opdHijo.nombre,
        entidadId: entidad.id,
        entidadNombre: entidad.nombre,
        tipo: refinamiento.tipo,
      });
    }
  }
  return objetivos.sort((a, b) => a.opdId.localeCompare(b.opdId) || a.tipo.localeCompare(b.tipo));
}

function esApunteLocal(modelo: Modelo, opdActivoId: Id): boolean {
  const opd = modelo.opds[opdActivoId];
  return Boolean(opd && opd.id !== modelo.opdRaizId && opd.padreId === null && opd.vista === undefined);
}
