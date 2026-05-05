import { naturalezaDeEnlace } from "./constantes";
import { crearEnlace } from "./operaciones";
import type { Enlace, Id, Modelo, Modificador, Resultado } from "./tipos";

export function aplicarModificador(modelo: Modelo, enlaceId: Id, modificador: Modificador): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const legal = validarModificadorEnlace(enlace, modificador);
  if (!legal.ok) return legal;
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: limpiarCamposIncompatibles({
        ...enlace,
        modificador,
      }),
    },
  });
}

export function quitarModificador(modelo: Modelo, enlaceId: Id): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const { modificador: _modificador, probabilidad: _probabilidad, ...resto } = enlace;
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: resto,
    },
  });
}

export function definirProbabilidad(modelo: Modelo, enlaceId: Id, probabilidad: number | undefined): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (probabilidad === undefined) {
    const { probabilidad: _probabilidad, ...resto } = enlace;
    return ok({
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlaceId]: resto,
      },
    });
  }
  if (enlace.modificador !== "evento") return fallo("La probabilidad solo aplica a enlaces evento [Glos 3.60]");
  if (!probabilidadValida(probabilidad)) return fallo("La probabilidad debe estar entre 0 y 1");
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: {
        ...enlace,
        probabilidad,
      },
    },
  });
}

export function definirDemora(modelo: Modelo, enlaceId: Id, demora: string | undefined): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const texto = demora?.trim();
  if (!texto) {
    const { demora: _demora, ...resto } = enlace;
    return ok({
      ...modelo,
      enlaces: {
        ...modelo.enlaces,
        [enlaceId]: resto,
      },
    });
  }
  if (enlace.tipo !== "invocacion") return fallo("La demora solo aplica a enlaces de invocacion [V-240]");
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: {
        ...enlace,
        demora: texto,
      },
    },
  });
}

export function crearInvocacion(
  modelo: Modelo,
  opdId: Id,
  procesoOrigenId: Id,
  procesoDestinoId: Id,
): Resultado<Modelo> {
  const origen = modelo.entidades[procesoOrigenId];
  const destino = modelo.entidades[procesoDestinoId];
  if (!origen || origen.tipo !== "proceso") return fallo("La invocacion requiere proceso origen [V-240]");
  if (!destino || destino.tipo !== "proceso") return fallo("La invocacion requiere proceso destino [V-240]");
  return crearEnlace(modelo, opdId, procesoOrigenId, procesoDestinoId, "invocacion");
}

export function validarMetadatosEnlace(enlace: Enlace): Resultado<true> {
  if (enlace.modificador) {
    const modificador = validarModificadorEnlace(enlace, enlace.modificador);
    if (!modificador.ok) return modificador;
  }
  if (enlace.probabilidad !== undefined) {
    if (enlace.modificador !== "evento") return fallo("La probabilidad solo aplica a enlaces evento [Glos 3.60]");
    if (!probabilidadValida(enlace.probabilidad)) return fallo("La probabilidad debe estar entre 0 y 1");
  }
  if (enlace.demora !== undefined) {
    if (enlace.tipo !== "invocacion") return fallo("La demora solo aplica a enlaces de invocacion [V-240]");
    if (enlace.demora.trim().length === 0) return fallo("La demora no puede estar vacia");
  }
  return ok(true);
}

export function esModificador(value: unknown): value is Modificador {
  return value === "condicion" || value === "evento" || value === "no";
}

export function probabilidadValida(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function validarModificadorEnlace(enlace: Enlace, modificador: Modificador): Resultado<true> {
  if (naturalezaDeEnlace(enlace.tipo) !== "procedural") {
    return fallo("Los modificadores condicion/evento/NO aplican solo a enlaces procedurales [V-240]");
  }
  if (modificador === "no" && enlace.tipo === "invocacion") {
    return fallo("NO no se aplica a invocacion en el slice M0 [V-240]");
  }
  return ok(true);
}

function limpiarCamposIncompatibles(enlace: Enlace): Enlace {
  if (enlace.modificador !== "evento") {
    const { probabilidad: _probabilidad, ...resto } = enlace;
    return resto;
  }
  return enlace;
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
