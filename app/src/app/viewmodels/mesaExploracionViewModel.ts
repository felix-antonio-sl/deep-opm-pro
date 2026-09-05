import { useMemo } from "preact/hooks";
import { previsualizarPropuestaExploracion } from "../../modelo/mesaExploracion";
import type {
  ConfirmacionExploracion,
  FuenteExploracionTexto,
  Id,
  Modelo,
  PropuestaOpmExploracion,
  TrazoExploracion,
} from "../../modelo/tipos";
import { generarOpl } from "../../opl/generar";
import { useOpmStore } from "../../store";
import { deriveExplorationIntent, runTutorPolicy } from "../../tutor";

export type EtapaMesaExploracion = "fuente" | "trazo" | "interpretacion" | "propuesta" | "confirmado";
export type TipoEntidadExploracion = "objeto" | "proceso";

export interface FuenteMesaExploracionViewModel {
  id: Id;
  contenido: string;
}

export interface TrazoMesaExploracionViewModel {
  id: Id;
  texto: string;
}

export interface PropuestaMesaExploracionViewModel {
  id: Id;
  estado: "pendiente" | "confirmada";
  entidadTipo: TipoEntidadExploracion;
  nombre: string;
}

export type PreviewMesaExploracionViewModel =
  | {
      error: null;
      lineas: string[];
      tipo: TipoEntidadExploracion;
      nombre: string;
    }
  | {
      error: string;
      lineas: [];
      tipo: null;
      nombre: null;
    };

interface RastroActual {
  fuente: FuenteExploracionTexto | null;
  trazo: TrazoExploracion | null;
  propuesta: PropuestaOpmExploracion | null;
  confirmacion: ConfirmacionExploracion | null;
}

/**
 * Frontera de aplicación de la Mesa. La UI recibe datos presentables y
 * comandos intencionales; kernel, OPL, Tutor y store permanecen detrás.
 */
export function useMesaExploracionViewModel() {
  const modelo = useOpmStore((state) => state.modelo);
  const opdActivoId = useOpmStore((state) => state.opdActivoId);
  const esApunte = useOpmStore((state) => state.indice.modelos.some((item) =>
    item.id === state.modelo.id && item.esApunte === true && item.archivado !== true
  ));
  const agregarFuente = useOpmStore((state) => state.agregarFuenteExploracion);
  const agregarTrazo = useOpmStore((state) => state.agregarTrazoExploracion);
  const editarTrazo = useOpmStore((state) => state.editarTrazoExploracion);
  const crearPropuesta = useOpmStore((state) => state.crearPropuestaExploracion);
  const editarPropuesta = useOpmStore((state) => state.editarPropuestaExploracion);
  const confirmarPropuesta = useOpmStore((state) => state.confirmarPropuestaExploracion);
  const deshacer = useOpmStore((state) => state.deshacer);
  const seleccionarEntidad = useOpmStore((state) => state.seleccionarEntidad);
  const cambiarOpdActivo = useOpmStore((state) => state.cambiarOpdActivo);

  const actual = useMemo(() => resolverRastroExploracion(modelo), [modelo]);
  const etapa = etapaDe(actual);
  const preview = useMemo(
    () => actual.propuesta?.estado === "pendiente"
      ? derivarPreviewMesaExploracion(modelo, actual.propuesta.id, esApunte)
      : null,
    [actual.propuesta, esApunte, modelo],
  );
  const intervention = runTutorPolicy(deriveExplorationIntent(
    etapa === "confirmado"
      ? {
          intentId: "mesa-exploracion:confirmado",
          phase: "confirmed",
          resultId: actual.confirmacion?.id ?? actual.propuesta?.id ?? "confirmacion",
        }
      : {
          intentId: `mesa-exploracion:${etapa}`,
          phase: etapa === "fuente"
            ? "source"
            : etapa === "trazo"
              ? "trace"
              : etapa === "interpretacion"
                ? "interpretation"
                : "proposal",
        },
  ));

  const target = actual.confirmacion?.targets[0];
  const hecho = target ? modelo.entidades[target.id] : undefined;
  const targetDisponible = Boolean(target && hecho && modelo.opds[target.opdId]);

  return {
    modeloId: modelo.id,
    /** Token opaco de revisión para invalidar el undo efímero al mutar el modelo. */
    modeloRevision: modelo as object,
    etapa,
    fuente: actual.fuente ? { id: actual.fuente.id, contenido: actual.fuente.contenido } : null,
    trazo: actual.trazo ? { id: actual.trazo.id, texto: actual.trazo.texto } : null,
    propuesta: actual.propuesta
      ? {
          id: actual.propuesta.id,
          estado: actual.propuesta.estado,
          entidadTipo: actual.propuesta.operacion.entidadTipo,
          nombre: actual.propuesta.operacion.nombre,
        }
      : null,
    confirmacionId: actual.confirmacion?.id ?? null,
    preview,
    intervention,
    targetDisponible,
    hechoNombre: hecho?.nombre,
    conservarFuente(contenido: string): boolean {
      return Boolean(agregarFuente({ contenido }));
    },
    conservarTrazo(texto: string): boolean {
      if (!actual.fuente) return false;
      return Boolean(agregarTrazo({ fuenteIds: [actual.fuente.id], texto }));
    },
    editarTrazo(texto: string): void {
      if (actual.trazo) editarTrazo(actual.trazo.id, texto);
    },
    crearPropuesta(entidadTipo: TipoEntidadExploracion, nombre: string): boolean {
      if (!actual.trazo) return false;
      return Boolean(crearPropuesta({
        trazoIds: [actual.trazo.id],
        entidadTipo,
        nombre,
        opdId: opdActivoId,
      }));
    },
    editarPropuesta(entidadTipo: TipoEntidadExploracion, nombre: string): void {
      if (actual.propuesta) editarPropuesta(actual.propuesta.id, {
        entidadTipo,
        nombre,
        opdId: opdActivoId,
      });
    },
    confirmarPropuesta(): boolean {
      if (!actual.propuesta || !preview || preview.error !== null) return false;
      return Boolean(confirmarPropuesta(actual.propuesta.id));
    },
    irAlHecho(): boolean {
      if (!targetDisponible || !target) return false;
      cambiarOpdActivo(target.opdId);
      seleccionarEntidad(target.id);
      return true;
    },
    deshacerConfirmacion: deshacer,
  };
}

/** Deriva la vista previa desde el hecho realmente creado por el kernel. */
export function derivarPreviewMesaExploracion(
  modelo: Modelo,
  propuestaId: Id,
  esApunte: boolean,
): PreviewMesaExploracionViewModel {
  const resultado = previsualizarPropuestaExploracion(modelo, propuestaId);
  if (!resultado.ok) {
    return { error: resultado.error, lineas: [], tipo: null, nombre: null };
  }
  const entidad = resultado.value.modelo.entidades[resultado.value.targetId];
  if (!entidad) {
    return {
      error: "La vista previa no produjo un hecho OPM identificable",
      lineas: [],
      tipo: null,
      nombre: null,
    };
  }
  const opdId = modelo.mesaExploracion?.propuestas[propuestaId]?.operacion.opdId;
  if (!opdId || !resultado.value.modelo.opds[opdId]) {
    return {
      error: "La vista previa no produjo una apariencia OPM identificable",
      lineas: [],
      tipo: null,
      nombre: null,
    };
  }
  const actuales = new Set(generarOpl(modelo, opdId, { esencia: "siempre", esApunte }));
  const lineas = generarOpl(resultado.value.modelo, opdId, { esencia: "siempre", esApunte })
    .filter((linea) => !actuales.has(linea));
  return { error: null, lineas, tipo: entidad.tipo, nombre: entidad.nombre };
}

export function resolverRastroExploracion(modelo: Modelo): RastroActual {
  const mesa = modelo.mesaExploracion;
  if (!mesa) return { fuente: null, trazo: null, propuesta: null, confirmacion: null };
  const propuesta = ultimo(Object.values(mesa.propuestas));
  const confirmacion = propuesta?.confirmacionId
    ? mesa.confirmaciones[propuesta.confirmacionId] ?? null
    : null;
  const trazo = propuesta?.trazoIds.length
    ? mesa.trazos[propuesta.trazoIds.at(-1) as Id] ?? null
    : ultimo(Object.values(mesa.trazos));
  const fuente = trazo?.fuenteIds.length
    ? mesa.fuentes[trazo.fuenteIds.at(-1) as Id] ?? null
    : ultimo(Object.values(mesa.fuentes));
  return { fuente, trazo, propuesta, confirmacion };
}

function ultimo<T>(items: T[]): T | null {
  return items.at(-1) ?? null;
}

function etapaDe(actual: RastroActual): EtapaMesaExploracion {
  if (!actual.fuente) return "fuente";
  if (!actual.trazo) return "trazo";
  if (!actual.propuesta) return "interpretacion";
  return actual.propuesta.estado === "confirmada" ? "confirmado" : "propuesta";
}

export type MesaExploracionViewModel = ReturnType<typeof useMesaExploracionViewModel>;
