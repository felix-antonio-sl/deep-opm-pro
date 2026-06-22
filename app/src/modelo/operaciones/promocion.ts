import { CANON } from "../constantes";
import { contextoInternoDescomposicion } from "../contextoRefinamiento";
import { contenedorRefinamiento, encajarAparienciaEnContorno } from "../layout";
import type {
  Apariencia,
  Boceto,
  Entidad,
  Id,
  Modelo,
  Opd,
  Resultado,
  TipoEnlace,
  TipoEntidad,
} from "../tipos";
import type { ExtremoEntrada } from "../extremos";
import { crearEnlace } from "./enlaces";
import { validarNombreEntidad } from "./entidad";
import { fallo, ok, siguienteId } from "./helpers";

/**
 * Promoción de boceto (D7.1): convierte un trazo de pizarra NO-SEMÁNTICO en un
 * hecho OPM de primera clase y CONSUME el boceto de su OPD.
 *
 * Régimen de nombre (load-bearing, decisión de consenso D7): la promoción REUSA
 * `validarNombreEntidad` — RECHAZO RUIDOSO ante un nombre colisionante. JAMÁS usa
 * `nombreUnicoEntidad` (auto-sufijo silencioso): el humano nombró el boceto y el
 * sistema NO muta su elección en silencio. Si el nombre colisiona (o dos bocetos
 * son homónimos al promover de a uno), la operación FALLA ruidoso y NO consume el
 * boceto — el modelo retornado es exactamente el de entrada (reversibilidad
 * trivial: nada cambió). Defendido por `law-promocion-reversible`
 * (src/leyes/promocion-reversible.test.ts).
 *
 * Dos destinos:
 *  - `entidad` (default): crea una Entidad OPM (objeto/proceso) en `opdId`,
 *    tomando el nombre del `texto` del boceto (o el provisto en opciones).
 *  - `enlace`: crea un Enlace OPM entre dos extremos ya existentes, delegando en
 *    `crearEnlace` — que valida la FIRMA y NO consume nada si la firma es ilegal.
 *    Reúsa la geometría/puntos del boceto solo como gesto; el enlace es el hecho.
 *
 * La SELECCIÓN de bocetos NO se toca aquí (no entra al trío sellado del store;
 * vive en el futuro PizarraSlice — corte D7.2).
 */

export interface PromoverBocetoEntidadOpciones {
  destino?: "entidad";
  /** Clase OPM del hecho creado. Default `objeto`. */
  tipoEntidad?: TipoEntidad;
  /** Nombre explícito; si falta, se toma el `texto` del boceto. */
  nombre?: string;
}

export interface PromoverBocetoEnlaceOpciones {
  destino: "enlace";
  origenId: ExtremoEntrada;
  destinoId: ExtremoEntrada;
  tipo: TipoEnlace;
  etiqueta?: string;
}

export type PromoverBocetoOpciones = PromoverBocetoEntidadOpciones | PromoverBocetoEnlaceOpciones;

export interface BocetoPromovido {
  modelo: Modelo;
  /** Id del hecho OPM creado: entidad (objeto/proceso) o enlace. */
  hechoId: Id;
  /** Clase del hecho creado, para que el llamador enfoque la selección correcta. */
  clase: "entidad" | "enlace";
}

export function promoverBoceto(
  modelo: Modelo,
  opdId: Id,
  bocetoId: Id,
  opciones: PromoverBocetoOpciones = {},
): Resultado<BocetoPromovido> {
  const opd = modelo.opds[opdId];
  if (!opd) return fallo(`OPD no existe: ${opdId}`);
  const boceto = opd.bocetos?.[bocetoId];
  if (!boceto) return fallo(`Boceto no existe: ${opdId}.${bocetoId}`);

  if (opciones.destino === "enlace") {
    return promoverABocetoEnlace(modelo, opd, boceto, opciones);
  }
  return promoverABocetoEntidad(modelo, opd, boceto, opciones);
}

function promoverABocetoEntidad(
  modelo: Modelo,
  opd: Opd,
  boceto: Boceto,
  opciones: PromoverBocetoEntidadOpciones,
): Resultado<BocetoPromovido> {
  const tipo: TipoEntidad = opciones.tipoEntidad ?? "objeto";
  const nombreCrudo = (opciones.nombre ?? boceto.texto ?? "").trim();
  if (!nombreCrudo) {
    return fallo("La promoción requiere un nombre: el boceto no tiene texto ni se proveyó uno");
  }
  // RECHAZO RUIDOSO ante colisión (NUNCA auto-sufijo). Si falla, no se consume el
  // boceto: devolvemos el fallo y el modelo de entrada queda intacto.
  const validado = validarNombreEntidad(modelo, undefined, nombreCrudo);
  if (!validado.ok) return validado;

  const entidadId = siguienteId(modelo, tipo === "objeto" ? "o" : "p");
  const aparienciaId = siguienteId({ ...modelo, nextSeq: modelo.nextSeq + 1 }, "a");

  const entidad: Entidad = {
    id: entidadId,
    tipo,
    nombre: validado.value,
    esencia: "informacional",
    afiliacion: "sistemica",
  };
  const aparienciaBase: Apariencia = {
    id: aparienciaId,
    entidadId,
    opdId: opd.id,
    x: boceto.x ?? boceto.puntos?.[0]?.x ?? 0,
    y: boceto.y ?? boceto.puntos?.[0]?.y ?? 0,
    width: boceto.w ?? CANON.dims.cosaWidth,
    height: boceto.h ?? CANON.dims.cosaHeight,
  };
  const contorno = contenedorRefinamiento(modelo, opd.id);
  const encajada = contorno ? encajarAparienciaEnContorno(aparienciaBase, contorno) : aparienciaBase;
  const apariencia: Apariencia = {
    ...aparienciaBase,
    x: encajada.x,
    y: encajada.y,
    ...(contorno ? { contextoRefinamiento: contextoInternoDescomposicion(contorno.entidadId, contorno.id) } : {}),
  };

  const bocetosRestantes = sinBoceto(opd.bocetos, boceto.id);
  const { bocetos: _bocetosPrevios, ...opdSinBocetos } = opd;
  const nextOpd: Opd = {
    ...opdSinBocetos,
    apariencias: { ...opd.apariencias, [aparienciaId]: apariencia },
    // Omitir la clave si no quedan bocetos (exactOptionalPropertyTypes: nada de `undefined` explícito).
    ...(bocetosRestantes ? { bocetos: bocetosRestantes } : {}),
  };
  const siguiente: Modelo = {
    ...modelo,
    nextSeq: modelo.nextSeq + 2,
    entidades: { ...modelo.entidades, [entidadId]: entidad },
    opds: { ...modelo.opds, [opd.id]: nextOpd },
  };
  return ok({ modelo: siguiente, hechoId: entidadId, clase: "entidad" });
}

function promoverABocetoEnlace(
  modelo: Modelo,
  opd: Opd,
  boceto: Boceto,
  opciones: PromoverBocetoEnlaceOpciones,
): Resultado<BocetoPromovido> {
  // `crearEnlace` valida la FIRMA y no consume nada si es ilegal: si falla,
  // devolvemos su fallo y el boceto queda intacto (modelo de entrada).
  const conEnlace = crearEnlace(modelo, opd.id, opciones.origenId, opciones.destinoId, opciones.tipo, opciones.etiqueta ?? "");
  if (!conEnlace.ok) return conEnlace;

  const enlaceId = enlacePrimarioCreado(modelo, conEnlace.value, opd.id);
  if (!enlaceId) return fallo("No se pudo identificar el enlace creado al promover el boceto");

  const opdActualizado = conEnlace.value.opds[opd.id];
  if (!opdActualizado) return fallo(`OPD no existe tras crear el enlace: ${opd.id}`);
  const bocetosRestantes = sinBoceto(opdActualizado.bocetos, boceto.id);
  const { bocetos: _bocetosPrevios, ...opdSinBocetos } = opdActualizado;
  const siguiente: Modelo = {
    ...conEnlace.value,
    opds: {
      ...conEnlace.value.opds,
      [opd.id]: { ...opdSinBocetos, ...(bocetosRestantes ? { bocetos: bocetosRestantes } : {}) },
    },
  };
  return ok({ modelo: siguiente, hechoId: enlaceId, clase: "enlace" });
}

/** Devuelve los bocetos sin el promovido, u `undefined` si era el último. */
function sinBoceto(bocetos: Opd["bocetos"], bocetoId: Id): Opd["bocetos"] {
  if (!bocetos) return undefined;
  const { [bocetoId]: _, ...resto } = bocetos;
  return Object.keys(resto).length > 0 ? resto : undefined;
}

/**
 * Captura el enlace PRIMARIO recién creado por `crearEnlace`, por su PROPIEDAD
 * ESTRUCTURAL (no por orden de enumeración): el nuevo enlace NO derivado con
 * apariencia en el OPD de la promoción. `crearEnlace` puede materializar enlaces
 * DERIVADOS en OPDs hijos (campo `derivado` presente); tomar "la primera clave
 * nueva" sería frágil al orden de inserción — anti-patrón documentado (lab-sim-v3:
 * capturar por estructura/extremos, NO por ultimoEnlaceId).
 */
function enlacePrimarioCreado(antes: Modelo, despues: Modelo, opdId: Id): Id | undefined {
  const nuevos = Object.keys(despues.enlaces).filter((id) => !(id in antes.enlaces));
  const enOpd = new Set(Object.values(despues.opds[opdId]?.enlaces ?? {}).map((ae) => ae.enlaceId));
  return (
    nuevos.find((id) => !despues.enlaces[id]?.derivado && enOpd.has(id)) ??
    nuevos.find((id) => !despues.enlaces[id]?.derivado) ??
    nuevos[0]
  );
}
