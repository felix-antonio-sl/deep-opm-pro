import { CANON } from "../constantes";
import { contextoInternoDescomposicion } from "../contextoRefinamiento";
import { contenedorRefinamiento, encajarAparienciaEnContorno } from "../layout";
import type {
  Afiliacion,
  Apariencia,
  AparienciaEnlace,
  Enlace,
  Entidad,
  Esencia,
  Id,
  Modelo,
  ParametrosSimulacionEntidad,
  Opd,
  Resultado,
  TipoValorSlot,
  ValorConcreto,
  ValorSlot,
} from "../tipos";
import { normalizarParametrosSimulacion } from "../simulacion/parametros";
import { aparienciaDeEntidadEnOpd } from "../politicaApariciones";
import { placeholderValorSlot, validarValorSlot } from "../validadores/valorSlot";
import { fallo, ok, siguienteId } from "./helpers";

/**
 * Operaciones de edición de entidad: renombrar, cambiar esencia, cambiar afiliación.
 * Funciones puras sobre Modelo. La validación de nombre vacío vive aquí; metadata
 * extendida (alias, unidad, descripción, URLs) tiene su propio módulo
 * `modelo/objetoMetadata.ts` (no es parte de operaciones).
 *
 * Refs: SSOT opm-iso-19450-es.md §3.55 / §3.69 (esencia/afiliación),
 *       [Glos 3.4] atributo, [V-163] slot de valor visible, [OPL-ES §14].
 */

export interface CrearAtributoOpciones {
  tipoSlot?: TipoValorSlot;
  unidad?: string;
  valor?: ValorConcreto;
}

export interface AtributoCreado {
  modelo: Modelo;
  atributoId: Id;
  aparienciaId: Id;
  enlaceId: Id;
}

export function renombrarEntidad(modelo: Modelo, entidadId: Id, nombre: string, opdActivoId?: Id): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  const validado = validarNombreEntidad(modelo, entidadId, nombre, opdActivoId);
  if (!validado.ok) return validado;
  const compuesto = parsearNombreUnidadEntidad(nombre, entidad.unidad);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: {
        ...entidad,
        nombre: validado.value,
        ...(compuesto.unidad ? { unidad: compuesto.unidad } : {}),
      },
    },
  });
}

/**
 * Valida nombre de entidad: rechaza vacío y rechaza duplicados globales de
 * nombre canónico. En OPM, varias apariencias pueden compartir una entidad,
 * pero dos entidades distintas no deben colisionar por nombre.
 */
export function validarNombreEntidad(
  modelo: Modelo,
  entidadId: Id,
  nombre: string,
  _opdActivoId?: Id,
): Resultado<string> {
  const limpio = parsearNombreUnidadEntidad(nombre).nombre;
  if (limpio.length === 0) return fallo("El nombre no puede estar vacío");
  const duplicada = entidadPorNombreCanonico(modelo, limpio, entidadId);
  if (duplicada) {
    return fallo(`Ya existe '${limpio}' en el modelo`);
  }
  return ok(limpio);
}

export function nombreEntidadDisponible(modelo: Modelo, nombre: string, excluirEntidadId?: Id): boolean {
  return !entidadPorNombreCanonico(modelo, nombre, excluirEntidadId);
}

export function nombreUnicoEntidad(modelo: Modelo, base: string): string {
  const raiz = parsearNombreUnidadEntidad(base).nombre || "Cosa";
  if (nombreEntidadDisponible(modelo, raiz)) return raiz;
  let indice = 2;
  while (!nombreEntidadDisponible(modelo, `${raiz}_${indice}`)) indice += 1;
  return `${raiz}_${indice}`;
}

export function crearAtributoEnObjeto(
  modelo: Modelo,
  opdId: Id,
  objetoPadreId: Id,
  nombreAtributo: string,
  opciones: CrearAtributoOpciones = {},
): Resultado<AtributoCreado> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const padre = modelo.entidades[objetoPadreId];
  if (!padre || padre.tipo !== "objeto") return fallo("Crear atributo requiere un objeto padre");
  const aparienciaPadre = aparienciaDeEntidadEnOpd(opd, objetoPadreId);
  if (!aparienciaPadre) return fallo("El objeto padre debe tener apariencia en el OPD activo");

  const compuesto = parsearNombreUnidadEntidad(nombreAtributo);
  const nombre = compuesto.nombre || nombreUnicoEntidad(modelo, "Atributo");
  if (!nombreEntidadDisponible(modelo, nombre)) return fallo(`Ya existe '${nombre}' en el modelo`);
  const unidad = opciones.unidad?.trim() || compuesto.unidad;
  const atributoId = siguienteId(modelo, "o");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "a");
  const enlaceId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 2 }, "e");
  const aparienciaEnlaceId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 3 }, "ae");
  const valorSlot = opciones.tipoSlot ? crearValorSlotInicial(opciones.tipoSlot, opciones.valor) : undefined;
  if (valorSlot && !valorSlot.ok) return valorSlot;

  const atributo: Entidad = {
    id: atributoId,
    tipo: "objeto",
    nombre,
    esencia: "informacional",
    afiliacion: padre.afiliacion,
    esAtributo: true,
    ...(unidad ? { unidad } : {}),
    ...(valorSlot?.ok ? { valorSlot: valorSlot.value } : {}),
  };
  const aparienciaBase: Apariencia = {
    id: aparienciaId,
    entidadId: atributoId,
    opdId,
    x: aparienciaPadre.x + aparienciaPadre.width + 80,
    y: aparienciaPadre.y,
    width: CANON.dims.cosaWidth,
    height: CANON.dims.cosaHeight,
  };
  const contorno = contenedorRefinamiento(modelo, opdId);
  const posicionAtributo = contorno ? encajarAparienciaEnContorno(aparienciaBase, contorno) : aparienciaBase;
  const apariencia: Apariencia = {
    ...aparienciaBase,
    x: posicionAtributo.x,
    y: posicionAtributo.y,
    ...(contorno ? { contextoRefinamiento: contextoInternoDescomposicion(contorno.entidadId, contorno.id) } : {}),
  };
  const enlace: Enlace = {
    id: enlaceId,
    tipo: "exhibicion",
    origenId: { kind: "entidad", id: objetoPadreId },
    destinoId: { kind: "entidad", id: atributoId },
    etiqueta: "",
  };
  const aparienciaEnlace: AparienciaEnlace = { id: aparienciaEnlaceId, enlaceId, opdId, vertices: [] };
  const nextOpd: Opd = {
    ...opd,
    apariencias: { ...opd.apariencias, [aparienciaId]: apariencia },
    enlaces: { ...opd.enlaces, [aparienciaEnlaceId]: aparienciaEnlace },
  };
  const siguiente: Modelo = {
    ...modelo,
    nextSeq: modelo.nextSeq + 4,
    entidades: { ...modelo.entidades, [atributoId]: atributo },
    enlaces: { ...modelo.enlaces, [enlaceId]: enlace },
    opds: { ...modelo.opds, [opdId]: nextOpd },
  };
  return ok({ modelo: siguiente, atributoId, aparienciaId, enlaceId });
}

export function esAtributoDerivado(modelo: Modelo, entidadId: Id): boolean {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return false;
  if (entidad.esAtributo === true) return true;
  return Object.values(modelo.enlaces).some((enlace) =>
    enlace.tipo === "exhibicion" &&
    enlace.destinoId.kind === "entidad" &&
    enlace.destinoId.id === entidadId
  );
}

export function asignarValorAtributo(modelo: Modelo, entidadId: Id, valor: ValorConcreto): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (!esAtributoDerivado(modelo, entidadId) || !entidad.valorSlot) return fallo("La entidad no tiene slot de valor de atributo");
  const validado = validarValorSlot(entidad.valorSlot.tipo, valor);
  if (!validado.ok) return validado;
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: {
        ...entidad,
        esAtributo: true,
        valorSlot: { ...entidad.valorSlot, valor: validado.value },
      },
    },
  });
}

export function cambiarTipoValorAtributo(modelo: Modelo, entidadId: Id, tipo: TipoValorSlot): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (!esAtributoDerivado(modelo, entidadId)) return fallo("La entidad no es atributo");
  const valorSlot: ValorSlot = { tipo, placeholder: placeholderValorSlot() };
  const { simulacion: _simulacion, ...entidadBase } = entidad;
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidadBase, esAtributo: true, valorSlot },
    },
  });
}

export function configurarSimulacionAtributo(
  modelo: Modelo,
  entidadId: Id,
  parametros: ParametrosSimulacionEntidad | undefined,
): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (!esAtributoDerivado(modelo, entidadId) || !entidad.valorSlot) {
    return fallo("La entidad no tiene slot de valor de atributo");
  }
  const { simulacion: _simulacion, ...entidadBase } = entidad;
  if (!parametros || !parametros.simulable) {
    return ok({
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [entidadId]: entidadBase,
      },
    });
  }
  const normalizado = normalizarParametrosSimulacion(parametros, entidad.valorSlot.tipo);
  if (!normalizado.ok) return normalizado;
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: {
        ...entidadBase,
        esAtributo: true,
        simulacion: normalizado.value,
      },
    },
  });
}

export function cambiarEsencia(modelo: Modelo, entidadId: Id, esencia: Esencia): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, esencia },
    },
  });
}

export function cambiarAfiliacion(modelo: Modelo, entidadId: Id, afiliacion: Afiliacion): Resultado<Modelo> {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  return ok({
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [entidadId]: { ...entidad, afiliacion },
    },
  });
}

function crearValorSlotInicial(tipo: TipoValorSlot, valor?: ValorConcreto): Resultado<ValorSlot> {
  const base: ValorSlot = { tipo, placeholder: placeholderValorSlot() };
  if (valor === undefined) return ok(base);
  const validado = validarValorSlot(tipo, valor);
  return validado.ok ? ok({ ...base, valor: validado.value }) : validado;
}

function parsearNombreUnidadEntidad(nombre: string, unidadActual?: string): { nombre: string; unidad?: string } {
  const limpio = nombre.trim();
  const match = /^(?<nombre>.*?)(?<!\\)\s+\[(?<unidad>[^\]\r\n]+)\]$/.exec(limpio);
  if (!match?.groups) return { nombre: limpio };
  const base = (match.groups.nombre ?? "").trim();
  const unidad = (match.groups.unidad ?? "").trim();
  if (!base || !unidad || unidad.length > 20) return { nombre: limpio };
  return { nombre: base, unidad: unidadActual && unidadActual === unidad ? unidadActual : unidad };
}

function entidadPorNombreCanonico(modelo: Modelo, nombre: string, excluirEntidadId?: Id): Entidad | null {
  const clave = claveNombreCanonico(nombre);
  return Object.values(modelo.entidades).find((entidad) =>
    entidad.id !== excluirEntidadId && claveNombreCanonico(entidad.nombre) === clave
  ) ?? null;
}

function claveNombreCanonico(nombre: string): string {
  return nombre.trim().toLocaleLowerCase("es-CL");
}
