import { validarFirmaEnlace } from "../modelo/operaciones";
import type { Apariencia, Entidad, Id, Modelo, TipoEnlace } from "../modelo/tipos";
import { tokens } from "../ui/tokens";

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
    if (entidad.id === origenId) {
      evaluados.push({ apariencia, entidad, esOrigen: true, esValido: false, razonInvalidez: "El enlace requiere dos extremos distintos" });
      continue;
    }
    const firma = validarFirmaEnlace(tipo, origen, entidad);
    evaluados.push({
      apariencia,
      entidad,
      esOrigen: false,
      esValido: firma.ok,
      ...(firma.ok ? {} : { razonInvalidez: firma.error }),
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
