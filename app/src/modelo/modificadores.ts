import { enlaceAdmiteTasa, enlaceAdmiteTiempoMaximo, enlaceAdmiteTiempoMinimo, esEnlaceExcepcionTemporal, naturalezaDeEnlace } from "./constantes";
import { crearEnlace } from "./operaciones";
import type { Enlace, Id, Modelo, Modificador, Resultado, SubtipoModificador } from "./tipos";

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
        subtipoModificador: subtipoParaModificador(modificador),
      }),
    },
  });
}

export function quitarModificador(modelo: Modelo, enlaceId: Id): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  const { modificador: _modificador, subtipoModificador: _subtipoModificador, probabilidad: _probabilidad, ...resto } = enlace;
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: resto,
    },
  });
}

export function aplicarSubtipoModificador(
  modelo: Modelo,
  enlaceId: Id,
  subtipo: SubtipoModificador,
): Resultado<Modelo> {
  const enlace = modelo.enlaces[enlaceId];
  if (!enlace) return fallo(`Enlace no existe: ${enlaceId}`);
  if (!enlace.modificador) return fallo("El subtipo requiere un modificador de enlace activo");
  const requerido = modificadorParaSubtipo(subtipo);
  if (enlace.modificador !== requerido) {
    return fallo(`El subtipo ${subtipo} requiere modificador ${requerido}`);
  }
  const legal = validarSubtipoModificador(enlace, subtipo);
  if (!legal.ok) return legal;
  return ok({
    ...modelo,
    enlaces: {
      ...modelo.enlaces,
      [enlaceId]: {
        ...enlace,
        subtipoModificador: subtipo,
      },
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
  if (enlace.subtipoModificador !== undefined) {
    const subtipo = validarSubtipoModificador(enlace, enlace.subtipoModificador);
    if (!subtipo.ok) return subtipo;
  }
  if (enlace.probabilidad !== undefined) {
    // Pr=p vive en ramas de abanico XOR (definirProbabilidadesAbanico la
    // escribe en cada rama) o en eventos [Glos 3.60]. Ambos son procedurales;
    // la membresía exacta al abanico se valida a nivel abanico, no aquí
    // (este validador no ve el modelo). Antes se exigía modificador evento y
    // un modelo con XOR probabilizado NO se podía reimportar.
    if (naturalezaDeEnlace(enlace.tipo) !== "procedural") {
      return fallo("La probabilidad solo aplica a enlaces procedurales (ramas de abanico XOR o eventos) [Glos 3.60]");
    }
    if (!probabilidadValida(enlace.probabilidad)) return fallo("La probabilidad debe estar entre 0 y 1");
  }
  if (enlace.demora !== undefined) {
    if (enlace.tipo !== "invocacion") return fallo("La demora solo aplica a enlaces de invocacion [V-240]");
    if (enlace.demora.trim().length === 0) return fallo("La demora no puede estar vacia");
  }
  if (enlace.backwardTag !== undefined && enlace.tipo !== "etiquetadoBidireccional") {
    return fallo("backwardTag solo aplica a enlace etiquetado bidireccional");
  }
  if (enlace.mostrarRequisitos !== undefined && typeof enlace.mostrarRequisitos !== "boolean") {
    return fallo("mostrarRequisitos debe ser booleano");
  }
  if (enlace.tasa !== undefined) {
    if (!enlaceAdmiteTasa(enlace.tipo)) return fallo("La tasa solo aplica a consumo, resultado o efecto");
    if (enlace.tasa.trim().length === 0) return fallo("La tasa no puede estar vacia");
  }
  if (enlace.unidadesTasa !== undefined) {
    if (!enlace.tasa) return fallo("Las unidades de tasa requieren tasa");
    if (enlace.unidadesTasa.trim().length === 0) return fallo("Las unidades de tasa no pueden estar vacias");
  }
  if (enlace.tiempoMinimo !== undefined) {
    if (!enlaceAdmiteTiempoMinimo(enlace.tipo)) return fallo("El tiempo minimo solo aplica a excepciones por subtiempo");
    if (enlace.tiempoMinimo.trim().length === 0) return fallo("El tiempo minimo no puede estar vacio");
  }
  if (enlace.unidadTiempoMinimo !== undefined) {
    if (!enlace.tiempoMinimo) return fallo("La unidad minima requiere tiempo minimo");
    if (enlace.unidadTiempoMinimo.trim().length === 0) return fallo("La unidad minima no puede estar vacia");
  }
  if (enlace.tiempoMaximo !== undefined) {
    if (!enlaceAdmiteTiempoMaximo(enlace.tipo)) return fallo("El tiempo maximo solo aplica a excepciones por sobretiempo");
    if (enlace.tiempoMaximo.trim().length === 0) return fallo("El tiempo maximo no puede estar vacio");
  }
  if (enlace.unidadTiempoMaximo !== undefined) {
    if (!enlace.tiempoMaximo) return fallo("La unidad maxima requiere tiempo maximo");
    if (enlace.unidadTiempoMaximo.trim().length === 0) return fallo("La unidad maxima no puede estar vacia");
  }
  return ok(true);
}

export function esModificador(value: unknown): value is Modificador {
  return value === "condicion" || value === "evento" || value === "no";
}

export function esSubtipoModificador(value: unknown): value is SubtipoModificador {
  return value === "C" || value === "E" || value === "no";
}

export function probabilidadValida(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

function validarModificadorEnlace(enlace: Enlace, modificador: Modificador): Resultado<true> {
  if (naturalezaDeEnlace(enlace.tipo) !== "procedural") {
    return fallo("Los modificadores condicion/evento/NO aplican solo a enlaces procedurales [V-240]");
  }
  if (enlace.tipo === "resultado" || enlace.tipo === "invocacion" || esEnlaceExcepcionTemporal(enlace.tipo)) {
    return fallo("Los modificadores condicion/evento/NO no aplican a resultado, invocacion ni excepciones temporales [AP-01][AP-02][AP-03][AP-10]");
  }
  if (enlace.efectoEscindido?.modo === "par") {
    return fallo("Los modificadores condicion/evento/NO no aplican a enlaces TS4/TS5 escindidos [AP-08]");
  }
  return ok(true);
}

function validarSubtipoModificador(enlace: Enlace, subtipo: SubtipoModificador): Resultado<true> {
  const requerido = modificadorParaSubtipo(subtipo);
  if (enlace.modificador !== requerido) {
    return fallo(`El subtipo ${subtipo} requiere modificador ${requerido}`);
  }
  const legal = validarModificadorEnlace(enlace, requerido);
  if (!legal.ok) return legal;
  return ok(true);
}

function limpiarCamposIncompatibles(enlace: Enlace): Enlace {
  if (enlace.modificador !== "evento") {
    const { probabilidad: _probabilidad, ...resto } = enlace;
    return limpiarSubtipoIncompatible(resto);
  }
  return limpiarSubtipoIncompatible(enlace);
}

function limpiarSubtipoIncompatible(enlace: Enlace): Enlace {
  if (!enlace.modificador) {
    const { subtipoModificador: _subtipoModificador, ...resto } = enlace;
    return resto;
  }
  if (enlace.subtipoModificador !== undefined && modificadorParaSubtipo(enlace.subtipoModificador) !== enlace.modificador) {
    const { subtipoModificador: _subtipoModificador, ...resto } = enlace;
    return resto;
  }
  return enlace;
}

function subtipoParaModificador(modificador: Modificador): SubtipoModificador {
  if (modificador === "condicion") return "C";
  if (modificador === "evento") return "E";
  return "no";
}

function modificadorParaSubtipo(subtipo: SubtipoModificador): Modificador {
  if (subtipo === "C") return "condicion";
  if (subtipo === "E") return "evento";
  return "no";
}

function ok<T>(value: T): Resultado<T> {
  return { ok: true, value };
}

function fallo(error: string): Resultado<never> {
  return { ok: false, error };
}
