import { ANCLAS_RELOJ_ENLACE, esAnclaRelojEnlace, type AnclaRelojEnlace } from "../modelo/anclajesEnlace";
import { evaluarTiposEnlacePermitidos } from "../modelo/opcionesEnlace";
import type { Apariencia, Entidad, Id, Modelo, TipoEnlace } from "../modelo/tipos";
import { tokens } from "../ui/tokens";

export const ANCHORS_CONEXION = ANCLAS_RELOJ_ENLACE;
export type AnchorConexion = AnclaRelojEnlace;

export interface ModoEnlace {
  tipo: TipoEnlace;
  origenId: Id;
  fase?: "boton" | "drag-from-anchor";
  origenAparienciaId?: Id;
  anchor?: AnchorConexion;
}

const PRIORIDAD_TIPO_INICIAL: TipoEnlace[] = [
  "consumo",
  "resultado",
  "agente",
  "instrumento",
  "efecto",
  "invocacion",
  "agregacion",
  "exhibicion",
  "generalizacion",
  "clasificacion",
  "etiquetado",
  "etiquetadoBidireccional",
  "excepcionSobretiempo",
  "excepcionSubtiempo",
  "excepcionSubSobretiempo",
];

export interface DestinoEvaluado {
  apariencia: Apariencia;
  entidad: Entidad;
  esOrigen: boolean;
  esValido: boolean;
  razonInvalidez?: string;
}

export function evaluarDestinos(
  modelo: Modelo,
  opdId: Id,
  origenId: Id,
  tipo: TipoEnlace,
): DestinoEvaluado[] {
  const opd = modelo.opds[opdId];
  const origen = modelo.entidades[origenId];
  if (!opd || !origen) return [];

  const evaluados: DestinoEvaluado[] = [];
  for (const apariencia of Object.values(opd.apariencias)) {
    const entidad = modelo.entidades[apariencia.entidadId];
    if (!entidad) continue;
    const esOrigen = entidad.id === origenId;
    const evaluacion = evaluarTiposEnlacePermitidos(modelo, origenId, entidad.id, "saliente", [tipo])[0];
    evaluados.push({
      apariencia,
      entidad,
      esOrigen,
      esValido: !esOrigen && !!evaluacion?.permitido,
      ...(!evaluacion?.permitido ? { razonInvalidez: evaluacion?.motivo ?? "Conexión inválida" } : {}),
    });
  }
  return evaluados;
}

export function entidadDestinoValida(
  modelo: Modelo,
  opdId: Id,
  origenId: Id,
  destinoId: Id,
  tipo: TipoEnlace,
): boolean {
  return evaluarDestinos(modelo, opdId, origenId, tipo).some((destino) =>
    destino.entidad.id === destinoId && destino.esValido
  );
}

export function colorHaloPorTipo(tipo: TipoEnlace): string {
  if (tipo === "agregacion" || tipo === "exhibicion" || tipo === "generalizacion" || tipo === "clasificacion") {
    return tokens.colors.canvas.enlace;
  }
  if (tipo === "resultado" ||
    tipo === "efecto" ||
    tipo === "invocacion" ||
    tipo === "excepcionSobretiempo" ||
    tipo === "excepcionSubtiempo" ||
    tipo === "excepcionSubSobretiempo") return tokens.colors.canvas.proceso;
  if (tipo === "agente" || tipo === "instrumento" || tipo === "consumo") return tokens.colors.canvas.objeto;
  return tokens.colors.acentoUi;
}

export function esAnchorConexion(valor: string | null | undefined): valor is AnchorConexion {
  return esAnclaRelojEnlace(valor);
}

export function anchorConexionDesdeSelector(selector: string | null): AnchorConexion | null {
  if (!selector?.startsWith("connect-anchor-")) return null;
  const anchor = selector.slice("connect-anchor-".length).toUpperCase();
  return esAnchorConexion(anchor) ? anchor : null;
}

export function tipoInicialConexionDesdeEntidad(modelo: Modelo, opdId: Id, origenId: Id): TipoEnlace {
  const origen = modelo.entidades[origenId];
  const opd = modelo.opds[opdId];
  if (!origen || !opd) return "etiquetado";
  const destinos = Object.values(opd.apariencias)
    .map((apariencia) => modelo.entidades[apariencia.entidadId])
    .filter((entidad): entidad is Entidad => !!entidad && entidad.id !== origenId);
  for (const tipo of PRIORIDAD_TIPO_INICIAL) {
    if (destinos.some((destino) => evaluarTiposEnlacePermitidos(modelo, origenId, destino.id, "saliente", [tipo])[0]?.permitido)) return tipo;
  }
  return "etiquetado";
}
