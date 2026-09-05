import { crearObjeto, crearProceso } from "./operaciones/creacion";
import { nombreReforzadoPorOntologia } from "./ontologia";
import { firmaSnapshotSubmodelo } from "./submodelos/estado";
import { MESA_EXPLORACION_SCHEMA } from "./tipos/extensiones";
import type {
  Id,
  MesaExploracionV1,
  Modelo,
  OperacionSemanticaExploracion,
  Resultado,
} from "./tipos";

export interface AgregarFuenteExploracionInput {
  titulo?: string;
  contenido: string;
}

export interface AgregarTrazoExploracionInput {
  fuenteIds: Id[];
  texto: string;
}

export interface CrearPropuestaExploracionInput {
  trazoIds: Id[];
  operacion: OperacionSemanticaExploracion;
}

export interface EditarPropuestaExploracionInput {
  entidadTipo: "objeto" | "proceso";
  nombre: string;
  /** Permite rebasar explícitamente una propuesta a otro OPD antes de retirar el anterior. */
  opdId?: Id;
}

export function agregarFuenteExploracion(
  modelo: Modelo,
  input: AgregarFuenteExploracionInput,
  creadaEn: string,
): Resultado<{ modelo: Modelo; fuenteId: Id }> {
  const contenido = input.contenido.trim();
  if (!contenido) return fallo("La fuente de texto está vacía");
  const timestamp = fechaValida(creadaEn);
  if (!timestamp.ok) return timestamp;
  const mesa = mesaActual(modelo);
  const fuenteId = siguienteIdMeta(mesa.fuentes, "fuente-exploracion");
  const titulo = input.titulo?.trim();
  return ok({
    fuenteId,
    modelo: conMesa(modelo, {
      ...mesa,
      fuentes: {
        ...mesa.fuentes,
        [fuenteId]: {
          id: fuenteId,
          tipo: "texto",
          ...(titulo ? { titulo } : {}),
          contenido: input.contenido,
          creadaEn: timestamp.value,
        },
      },
    }),
  });
}

export function agregarTrazoExploracion(
  modelo: Modelo,
  input: AgregarTrazoExploracionInput,
  creadoEn: string,
): Resultado<{ modelo: Modelo; trazoId: Id }> {
  const texto = input.texto.trim();
  if (!texto) return fallo("El trazo está vacío");
  const fuenteIds = idsUnicos(input.fuenteIds);
  if (fuenteIds.length === 0) return fallo("El trazo requiere al menos una fuente");
  const timestamp = fechaValida(creadoEn);
  if (!timestamp.ok) return timestamp;
  const mesa = mesaActual(modelo);
  for (const fuenteId of fuenteIds) {
    if (!mesa.fuentes[fuenteId]) return fallo(`El trazo referencia una fuente inexistente: ${fuenteId}`);
  }
  const trazoId = siguienteIdMeta(mesa.trazos, "trazo-exploracion");
  return ok({
    trazoId,
    modelo: conMesa(modelo, {
      ...mesa,
      trazos: {
        ...mesa.trazos,
        [trazoId]: { id: trazoId, fuenteIds, texto, creadoEn: timestamp.value },
      },
    }),
  });
}

export function editarTrazoExploracion(
  modelo: Modelo,
  trazoId: Id,
  texto: string,
  editadoEn: string,
): Resultado<Modelo> {
  const mesa = modelo.mesaExploracion;
  const trazo = mesa?.trazos[trazoId];
  if (!mesa || !trazo) return fallo(`Trazo inexistente: ${trazoId}`);
  const limpio = texto.trim();
  if (!limpio) return fallo("El trazo está vacío");
  const timestamp = fechaValida(editadoEn);
  if (!timestamp.ok) return timestamp;
  return ok(conMesa(modelo, {
    ...mesa,
    trazos: {
      ...mesa.trazos,
      [trazoId]: { ...trazo, texto: limpio, editadoEn: timestamp.value },
    },
  }));
}

export function crearPropuestaExploracion(
  modelo: Modelo,
  input: CrearPropuestaExploracionInput,
  creadaEn: string,
): Resultado<{ modelo: Modelo; propuestaId: Id }> {
  const mesa = mesaActual(modelo);
  const trazoIds = idsUnicos(input.trazoIds);
  if (trazoIds.length === 0) return fallo("La propuesta requiere al menos un trazo");
  for (const trazoId of trazoIds) {
    if (!mesa.trazos[trazoId]) return fallo(`La propuesta referencia un trazo inexistente: ${trazoId}`);
  }
  const operacion = validarOperacion(modelo, input.operacion);
  if (!operacion.ok) return operacion;
  const timestamp = fechaValida(creadaEn);
  if (!timestamp.ok) return timestamp;
  const propuestaId = siguienteIdMeta(mesa.propuestas, "propuesta-exploracion");
  return ok({
    propuestaId,
    modelo: conMesa(modelo, {
      ...mesa,
      propuestas: {
        ...mesa.propuestas,
        [propuestaId]: {
          id: propuestaId,
          trazoIds,
          baseFirmaSemantica: firmaEjecucionPropuesta(modelo, operacion.value),
          operacion: operacion.value,
          estado: "pendiente",
          creadaEn: timestamp.value,
        },
      },
    }),
  });
}

export function editarPropuestaExploracion(
  modelo: Modelo,
  propuestaId: Id,
  input: EditarPropuestaExploracionInput,
): Resultado<Modelo> {
  const mesa = modelo.mesaExploracion;
  const propuesta = mesa?.propuestas[propuestaId];
  if (!mesa || !propuesta) return fallo(`Propuesta inexistente: ${propuestaId}`);
  if (propuesta.estado !== "pendiente") return fallo("Una propuesta confirmada no se edita; deshaz la confirmación primero");
  const operacion = validarOperacion(modelo, {
    ...propuesta.operacion,
    entidadTipo: input.entidadTipo,
    nombre: input.nombre,
    ...(input.opdId ? { opdId: input.opdId } : {}),
  });
  if (!operacion.ok) return operacion;
  return ok(conMesa(modelo, {
    ...mesa,
    propuestas: {
      ...mesa.propuestas,
      [propuestaId]: {
        ...propuesta,
        operacion: operacion.value,
        // Editar es el acto humano explícito de revisar la propuesta contra el
        // estado vivo; por eso establece una nueva base semántica.
        baseFirmaSemantica: firmaEjecucionPropuesta(modelo, operacion.value),
      },
    },
  }));
}

export function previsualizarPropuestaExploracion(
  modelo: Modelo,
  propuestaId: Id,
): Resultado<{ modelo: Modelo; targetId: Id }> {
  const propuesta = modelo.mesaExploracion?.propuestas[propuestaId];
  if (!propuesta) return fallo(`Propuesta inexistente: ${propuestaId}`);
  if (propuesta.estado !== "pendiente") return fallo("La propuesta ya fue confirmada");
  if (firmaEjecucionPropuesta(modelo, propuesta.operacion) !== propuesta.baseFirmaSemantica) {
    return fallo("El modelo cambió semánticamente desde que se creó la propuesta; revísala antes de confirmar");
  }
  return aplicarOperacion(modelo, propuesta.operacion);
}

export function confirmarPropuestaExploracion(
  modelo: Modelo,
  propuestaId: Id,
  confirmadoEn: string,
): Resultado<{ modelo: Modelo; targetId: Id; confirmacionId: Id }> {
  const timestamp = fechaValida(confirmadoEn);
  if (!timestamp.ok) return timestamp;
  const mesa = modelo.mesaExploracion;
  const propuesta = mesa?.propuestas[propuestaId];
  if (!mesa || !propuesta) return fallo(`Propuesta inexistente: ${propuestaId}`);
  const aplicado = previsualizarPropuestaExploracion(modelo, propuestaId);
  if (!aplicado.ok) return aplicado;
  const confirmacionId = siguienteIdMeta(mesa.confirmaciones, "confirmacion-exploracion");
  const fuenteIds = idsUnicos(
    propuesta.trazoIds.flatMap((trazoId) => mesa.trazos[trazoId]?.fuenteIds ?? []),
  );
  const mesaConfirmada: MesaExploracionV1 = {
    ...mesa,
    propuestas: {
      ...mesa.propuestas,
      [propuestaId]: { ...propuesta, estado: "confirmada", confirmacionId },
    },
    confirmaciones: {
      ...mesa.confirmaciones,
      [confirmacionId]: {
        id: confirmacionId,
        propuestaId,
        targets: [{ tipo: "entidad", id: aplicado.value.targetId, opdId: propuesta.operacion.opdId }],
        fuenteIds,
        trazoIds: [...propuesta.trazoIds],
        confirmadoEn: timestamp.value,
      },
    },
  };
  return ok({
    modelo: conMesa(aplicado.value.modelo, mesaConfirmada),
    targetId: aplicado.value.targetId,
    confirmacionId,
  });
}

function aplicarOperacion(
  modelo: Modelo,
  operacion: OperacionSemanticaExploracion,
): Resultado<{ modelo: Modelo; targetId: Id }> {
  const antes = new Set(Object.keys(modelo.entidades));
  const posicion = posicionNueva(modelo, operacion.opdId);
  const resultado = operacion.entidadTipo === "objeto"
    ? crearObjeto(modelo, operacion.opdId, posicion, operacion.nombre)
    : crearProceso(modelo, operacion.opdId, posicion, operacion.nombre);
  if (!resultado.ok) return resultado;
  const targetId = Object.keys(resultado.value.entidades).find((id) => !antes.has(id));
  if (!targetId) return fallo("La operación no produjo un hecho OPM identificable");
  return ok({ modelo: resultado.value, targetId });
}

/**
 * Precondición de ejecución de una propuesta. La firma general conserva su
 * frontera histórica; aquí añadimos solo el resultado ontológico que consume
 * la creación de entidad. Cambios editoriales o términos ajenos no invalidan
 * una transacción cuyo hecho efectivo permanece idéntico.
 */
function firmaEjecucionPropuesta(
  modelo: Modelo,
  operacion: OperacionSemanticaExploracion,
): string {
  return JSON.stringify({
    modelo: firmaSnapshotSubmodelo(modelo),
    nombreEfectivo: nombreReforzadoPorOntologia(modelo, operacion.nombre),
  });
}

function validarOperacion(
  modelo: Modelo,
  operacion: OperacionSemanticaExploracion,
): Resultado<OperacionSemanticaExploracion> {
  if (operacion.tipo !== "crear-entidad") return fallo("Operación de propuesta no soportada");
  if (operacion.entidadTipo !== "objeto" && operacion.entidadTipo !== "proceso") {
    return fallo("La propuesta debe crear un objeto o un proceso");
  }
  const nombre = operacion.nombre.trim();
  if (!nombre) return fallo("La propuesta requiere un nombre OPM");
  if (!modelo.opds[operacion.opdId]) return fallo(`OPD de propuesta inexistente: ${operacion.opdId}`);
  return ok({ ...operacion, nombre });
}

function mesaActual(modelo: Modelo): MesaExploracionV1 {
  return modelo.mesaExploracion ?? {
    schema: MESA_EXPLORACION_SCHEMA,
    fuentes: {},
    trazos: {},
    propuestas: {},
    confirmaciones: {},
  };
}

function conMesa(modelo: Modelo, mesaExploracion: MesaExploracionV1): Modelo {
  return { ...modelo, mesaExploracion };
}

function siguienteIdMeta<T>(record: Record<Id, T>, prefijo: string): Id {
  let maximo = 0;
  const patron = new RegExp(`^${prefijo}-(\\d+)$`);
  for (const id of Object.keys(record)) {
    const match = patron.exec(id);
    if (match) maximo = Math.max(maximo, Number(match[1]));
  }
  return `${prefijo}-${maximo + 1}`;
}

function idsUnicos(ids: readonly Id[]): Id[] {
  return [...new Set(ids)];
}

function fechaValida(value: string): Resultado<string> {
  const limpia = value.trim();
  return limpia ? ok(limpia) : fallo("La fecha de la Mesa de exploración está vacía");
}

function posicionNueva(modelo: Modelo, opdId: Id): { x: number; y: number } {
  const cantidad = Object.keys(modelo.opds[opdId]?.apariencias ?? {}).length;
  return {
    x: 80 + (cantidad % 3) * 190,
    y: 80 + Math.floor(cantidad / 3) * 120,
  };
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
