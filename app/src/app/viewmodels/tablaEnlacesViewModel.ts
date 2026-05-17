import { useEffect, useMemo, useState } from "preact/hooks";
import { store, useOpmStore } from "../../store";
import { naturalezaDeEnlace } from "../../modelo/constantes";
import type { Enlace, ExtremoEnlace, Id, Modelo, TipoEnlace } from "../../modelo/tipos";

export interface FilaEnlace {
  enlaceId: Id;
  origen: string;
  destino: string;
  tipo: TipoEnlace;
  familia: "estructural" | "procedural";
  etiqueta: string;
  multOrigen: string;
  multDestino: string;
  opds: string;
  opdsCount: number;
  opdIds: Id[];
}

export type FiltroFamiliaEnlace = "todos" | "procedural" | "estructural";
export type FocoTabla = { filas: number; visibles: number; opdNombre: string };

export const TABLA_ENLACES_COLUMNAS: ReadonlyArray<{ clave: keyof FilaEnlace; label: string; sortable: boolean }> = [
  { clave: "tipo", label: "Tipo", sortable: true },
  { clave: "origen", label: "Origen", sortable: true },
  { clave: "destino", label: "Destino", sortable: true },
  { clave: "etiqueta", label: "Etiqueta", sortable: true },
  { clave: "multOrigen", label: "Mult. origen", sortable: true },
  { clave: "multDestino", label: "Mult. destino", sortable: true },
  { clave: "opds", label: "OPDs", sortable: true },
];

export interface TablaEnlacesViewModel {
  modelo: Modelo;
  opdActivoId: Id;
  filtroTipo: TipoEnlace | "todos";
  ordenColumna: string | null;
  ordenDireccion: "asc" | "desc";
  enlaceSeleccionId: Id | null;
  query: string;
  filtroFamilia: FiltroFamiliaEnlace;
  focoTabla: FocoTabla | null;
  filas: FilaEnlace[];
  totalEnlaces: number;
  conteoFamilias: Record<"procedural" | "estructural", number>;
  filtrosActivos: boolean;
  visiblesEnOpdActivo: number;
  opdActivoNombre: string;
  puedeEnfocar: boolean;
  cerrar: () => void;
  fijarQuery: (query: string) => void;
  fijarFiltroFamilia: (familia: FiltroFamiliaEnlace) => void;
  fijarFiltroTipo: (tipo: TipoEnlace | "todos") => void;
  limpiarFiltros: () => void;
  fijarOrden: (clave: string) => void;
  navegar: (id: Id) => void;
  irAExtremo: (id: Id, lado: "origen" | "destino") => void;
  eliminarEnlace: (id: Id) => void;
  enfocarFiltrados: () => void;
}

export function useTablaEnlacesViewModel(): TablaEnlacesViewModel | null {
  const abierta = useOpmStore((s) => s.tablaEnlacesAbierta);
  const cerrar = useOpmStore((s) => s.cerrarTablaEnlaces);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const filtroTipo = useOpmStore((s) => s.tablaEnlacesFiltroTipo);
  const fijarFiltroTipo = useOpmStore((s) => s.fijarFiltroTablaEnlaces);
  const ordenColumna = useOpmStore((s) => s.tablaEnlacesOrdenColumna);
  const ordenDireccion = useOpmStore((s) => s.tablaEnlacesOrdenDireccion);
  const fijarOrden = useOpmStore((s) => s.fijarOrdenTablaEnlaces);
  const navegar = useOpmStore((s) => s.navegarAEnlaceDesdeTabla);
  const irAExtremo = useOpmStore((s) => s.irAExtremoEnlaceTabla);
  const eliminarEnlace = useOpmStore((s) => s.eliminarEnlaceDesdeTabla);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const resaltarTemporalmente = useOpmStore((s) => s.resaltarTemporalmente);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);

  const [query, setQuery] = useState("");
  const [filtroFamilia, setFiltroFamilia] = useState<FiltroFamiliaEnlace>("todos");
  const [focoTabla, setFocoTabla] = useState<FocoTabla | null>(null);

  const filasBase: FilaEnlace[] = useMemo(
    () => Object.values(modelo.enlaces).map((enlace) => construirFila(modelo, enlace)),
    [modelo],
  );
  const filas: FilaEnlace[] = useMemo(() => {
    const q = normalizarBusqueda(query);
    const lista = filasBase.filter((fila) => {
      if (filtroTipo !== "todos" && fila.tipo !== filtroTipo) return false;
      if (filtroFamilia !== "todos" && fila.familia !== filtroFamilia) return false;
      if (!q) return true;
      return textoBusquedaFila(fila).includes(q);
    });
    if (ordenColumna) {
      lista.sort((a, b) => {
        const aVal = String((a as unknown as Record<string, unknown>)[ordenColumna] ?? "");
        const bVal = String((b as unknown as Record<string, unknown>)[ordenColumna] ?? "");
        const cmp = aVal.localeCompare(bVal, "es", { sensitivity: "base" });
        return ordenDireccion === "asc" ? cmp : -cmp;
      });
    }
    return lista;
  }, [filasBase, filtroFamilia, filtroTipo, ordenColumna, ordenDireccion, query]);

  const totalEnlaces = filasBase.length;
  const conteoFamilias = useMemo(() => contarFamilias(filasBase), [filasBase]);
  const filtrosActivos = query.trim().length > 0 || filtroTipo !== "todos" || filtroFamilia !== "todos";
  const visiblesEnOpdActivo = useMemo(() => contarFilasEnOpd(filas, opdActivoId), [filas, opdActivoId]);
  const opdActivoNombre = modelo.opds[opdActivoId]?.nombre ?? opdActivoId;
  const puedeEnfocar = filas.length > 0;

  const limpiarFiltros = () => {
    setQuery("");
    setFiltroFamilia("todos");
    fijarFiltroTipo("todos");
  };

  const enfocarFiltrados = () => {
    if (!puedeEnfocar) return;
    const opdObjetivoId = elegirOpdObjetivo(filas, opdActivoId);
    if (opdObjetivoId !== opdActivoId) cambiarOpdActivo(opdObjetivoId);
    const ids = idsSubgrafoDesdeFilas(modelo, filas);
    resaltarTemporalmente(ids, 4500);
    setFocoTabla({
      filas: filas.length,
      visibles: contarFilasEnOpd(filas, opdObjetivoId),
      opdNombre: modelo.opds[opdObjetivoId]?.nombre ?? opdObjetivoId,
    });
  };

  useEffect(() => {
    if (!abierta) {
      setQuery("");
      setFiltroFamilia("todos");
      setFocoTabla(null);
    }
  }, [abierta]);

  useEffect(() => {
    setFocoTabla(null);
  }, [filtroFamilia, filtroTipo, modelo.id, query]);

  if (!abierta) return null;

  return {
    modelo,
    opdActivoId,
    filtroTipo,
    ordenColumna,
    ordenDireccion,
    enlaceSeleccionId,
    query,
    filtroFamilia,
    focoTabla,
    filas,
    totalEnlaces,
    conteoFamilias,
    filtrosActivos,
    visiblesEnOpdActivo,
    opdActivoNombre,
    puedeEnfocar,
    cerrar,
    fijarQuery: setQuery,
    fijarFiltroFamilia: setFiltroFamilia,
    fijarFiltroTipo,
    limpiarFiltros,
    fijarOrden,
    navegar,
    irAExtremo,
    eliminarEnlace,
    enfocarFiltrados,
  };
}

export function useRenombrarEtiquetaEnlaceTabla(): (enlace: Enlace, etiqueta: string) => void {
  const renombrarEtiquetaEnlace = useOpmStore((s) => s.renombrarEtiquetaEnlaceSeleccionado);
  return (enlace, etiqueta) => {
    const st = store.getState();
    if (st.enlaceSeleccionId !== enlace.id) {
      st.seleccionarEnlace(enlace.id);
    }
    renombrarEtiquetaEnlace(etiqueta);
  };
}

export function useFijarMultiplicidadEnlaceTabla(): (enlaceId: Id, lado: "origen" | "destino", valor: string) => void {
  return useOpmStore((s) => s.fijarMultiplicidadEnlace);
}

function construirFila(modelo: Modelo, enlace: Enlace): FilaEnlace {
  const opdsConApariencia: string[] = [];
  const opdIds: Id[] = [];
  for (const opd of Object.values(modelo.opds)) {
    if (Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlace.id)) {
      opdsConApariencia.push(opd.nombre);
      opdIds.push(opd.id);
    }
  }
  return {
    enlaceId: enlace.id,
    origen: nombreExtremo(modelo, enlace.origenId.id),
    destino: nombreExtremo(modelo, enlace.destinoId.id),
    tipo: enlace.tipo,
    familia: naturalezaDeEnlace(enlace.tipo),
    etiqueta: enlace.etiqueta,
    multOrigen: enlace.multiplicidadOrigen ?? "",
    multDestino: enlace.multiplicidadDestino ?? "",
    opds: opdsConApariencia.join(", "),
    opdsCount: opdsConApariencia.length,
    opdIds,
  };
}

function nombreExtremo(modelo: Modelo, extremoId: string): string {
  const entidad = modelo.entidades[extremoId];
  if (entidad) return entidad.nombre;
  const estado = modelo.estados[extremoId];
  if (estado) {
    const portadora = modelo.entidades[estado.entidadId];
    return portadora ? `${portadora.nombre}.${estado.nombre}` : estado.nombre;
  }
  return extremoId;
}

function textoBusquedaFila(fila: FilaEnlace): string {
  return normalizarBusqueda([
    fila.tipo,
    fila.familia,
    capitalizar(fila.tipo),
    fila.origen,
    fila.destino,
    fila.etiqueta,
    fila.multOrigen,
    fila.multDestino,
    fila.opds,
  ].join(" "));
}

function normalizarBusqueda(texto: string): string {
  return texto
    .trim()
    .toLocaleLowerCase("es-CL")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function contarFamilias(filas: FilaEnlace[]): Record<"procedural" | "estructural", number> {
  return filas.reduce(
    (acc, fila) => {
      acc[fila.familia] += 1;
      return acc;
    },
    { procedural: 0, estructural: 0 },
  );
}

function contarFilasEnOpd(filas: readonly FilaEnlace[], opdId: Id): number {
  return filas.filter((fila) => fila.opdIds.includes(opdId)).length;
}

function elegirOpdObjetivo(filas: readonly FilaEnlace[], opdActivoId: Id): Id {
  if (contarFilasEnOpd(filas, opdActivoId) > 0) return opdActivoId;
  return filas.find((fila) => fila.opdIds.length > 0)?.opdIds[0] ?? opdActivoId;
}

function idsSubgrafoDesdeFilas(modelo: Modelo, filas: readonly FilaEnlace[]): Id[] {
  const ids = new Set<Id>();
  for (const fila of filas) {
    const enlace = modelo.enlaces[fila.enlaceId];
    if (!enlace) continue;
    ids.add(enlace.id);
    const origenId = idFocoDeExtremo(modelo, enlace.origenId);
    const destinoId = idFocoDeExtremo(modelo, enlace.destinoId);
    if (origenId) ids.add(origenId);
    if (destinoId) ids.add(destinoId);
  }
  return Array.from(ids);
}

function idFocoDeExtremo(modelo: Modelo, extremo: ExtremoEnlace): Id | null {
  if (extremo.kind === "estado") return modelo.estados[extremo.id] ? extremo.id : null;
  return modelo.entidades[extremo.id] ? extremo.id : null;
}

export function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
