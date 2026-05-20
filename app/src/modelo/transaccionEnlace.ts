import { formarAbanicoAutomatico } from "./abanicos";
import type { AnclaRelojEnlace } from "./anclajesEnlace";
import { crearEnlace, type LadoExtremoEnlace } from "./operaciones/enlaces";
import { fijarAnclaExtremoEnlace, sincronizarPuertosTodosLosOpd } from "./operaciones/ports";
import { crearEnlaceConExtremoPlegado } from "./plegado";
import type { ExtremoEntrada } from "./extremos";
import type { Id, Modelo, OperadorAbanico, Resultado, TipoEnlace } from "./tipos";

export interface CrearEnlaceTransaccionalOpciones {
  etiqueta?: string;
  anclaOrigen?: AnclaRelojEnlace;
  anclaDestino?: AnclaRelojEnlace;
  operadorAbanico?: OperadorAbanico;
  permitirExtremoPlegado?: boolean;
}

export interface CrearEnlaceTransaccionalResultado {
  modelo: Modelo;
  enlaceId: Id | null;
}

export function crearEnlaceTransaccional(
  modelo: Modelo,
  opdId: Id,
  origen: ExtremoEntrada,
  destino: ExtremoEntrada,
  tipo: TipoEnlace,
  opciones: CrearEnlaceTransaccionalOpciones = {},
): Resultado<CrearEnlaceTransaccionalResultado> {
  const creado = crearEnlaceBase(modelo, opdId, origen, destino, tipo, opciones);
  if (!creado.ok) return creado;

  let modeloFinal = creado.value;
  const enlaceId = enlaceNuevo(modelo, modeloFinal);
  if (!enlaceId) return ok({ modelo: sincronizarPuertosTodosLosOpd(modeloFinal), enlaceId: null });

  const abanico = formarAbanicoAutomatico(modeloFinal, opdId, enlaceId, opciones.operadorAbanico ?? "O");
  if (abanico.ok) modeloFinal = abanico.value;

  const anclas: Array<[LadoExtremoEnlace, AnclaRelojEnlace | undefined]> = [
    ["origen", opciones.anclaOrigen],
    ["destino", opciones.anclaDestino],
  ];
  for (const [lado, ancla] of anclas) {
    if (!ancla) continue;
    const anclado = fijarAnclaExtremoEnlace(modeloFinal, opdId, enlaceId, lado, ancla);
    if (!anclado.ok) return anclado;
    modeloFinal = anclado.value;
  }

  return ok({ modelo: sincronizarPuertosTodosLosOpd(modeloFinal), enlaceId });
}

function crearEnlaceBase(
  modelo: Modelo,
  opdId: Id,
  origen: ExtremoEntrada,
  destino: ExtremoEntrada,
  tipo: TipoEnlace,
  opciones: CrearEnlaceTransaccionalOpciones,
): Resultado<Modelo> {
  const creado = crearEnlace(modelo, opdId, origen, destino, tipo, opciones.etiqueta ?? "");
  if (creado.ok || !opciones.permitirExtremoPlegado || !esFalloDeVisibilidadDirecta(creado.error)) return creado;
  return crearEnlaceConExtremoPlegado(modelo, opdId, origen, destino, tipo, opciones.etiqueta ?? "");
}

function esFalloDeVisibilidadDirecta(error: string): boolean {
  return error.includes("apariencia en el OPD");
}

function enlaceNuevo(previo: Modelo, siguiente: Modelo): Id | null {
  const previos = new Set(Object.keys(previo.enlaces));
  return Object.keys(siguiente.enlaces).find((id) => !previos.has(id)) ?? null;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}
