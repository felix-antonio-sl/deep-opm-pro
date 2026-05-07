import type { OpcionesProyeccion } from "./proyeccionTipos";

type OpcionesProyeccionEntrada = {
  aliasVisibles?: boolean | undefined;
  descripcionesVisibles?: boolean | undefined;
  modoImagenGlobal?: OpcionesProyeccion["modoImagenGlobal"] | undefined;
};

export const OPCIONES_PROYECCION_DEFAULT: Required<OpcionesProyeccion> = {
  aliasVisibles: true,
  descripcionesVisibles: true,
  modoImagenGlobal: null,
};

export function normalizarOpcionesProyeccion(opciones: OpcionesProyeccionEntrada): Required<OpcionesProyeccion> {
  return {
    aliasVisibles: opciones.aliasVisibles ?? OPCIONES_PROYECCION_DEFAULT.aliasVisibles,
    descripcionesVisibles: opciones.descripcionesVisibles ?? OPCIONES_PROYECCION_DEFAULT.descripcionesVisibles,
    modoImagenGlobal: opciones.modoImagenGlobal ?? OPCIONES_PROYECCION_DEFAULT.modoImagenGlobal,
  };
}

export function opcionesProyeccionDesdeEntornoLegacy(): Required<OpcionesProyeccion> {
  const global = globalThis as typeof globalThis & {
    __deepOpmUiAliasVisibles?: boolean;
    __deepOpmUiDescripcionesVisibles?: boolean;
    __deepOpmUiModoImagenGlobal?: OpcionesProyeccion["modoImagenGlobal"];
  };
  return normalizarOpcionesProyeccion({
    aliasVisibles: global.__deepOpmUiAliasVisibles,
    descripcionesVisibles: global.__deepOpmUiDescripcionesVisibles,
    modoImagenGlobal: global.__deepOpmUiModoImagenGlobal,
  });
}

export function fijarOpcionesProyeccionGlobal(opciones: OpcionesProyeccion): void {
  const global = globalThis as typeof globalThis & {
    __deepOpmUiAliasVisibles?: boolean;
    __deepOpmUiDescripcionesVisibles?: boolean;
    __deepOpmUiModoImagenGlobal?: OpcionesProyeccion["modoImagenGlobal"];
  };
  const actuales = opcionesProyeccionDesdeEntornoLegacy();
  global.__deepOpmUiAliasVisibles = opciones.aliasVisibles ?? actuales.aliasVisibles;
  global.__deepOpmUiDescripcionesVisibles = opciones.descripcionesVisibles ?? actuales.descripcionesVisibles;
  global.__deepOpmUiModoImagenGlobal = opciones.modoImagenGlobal ?? null;
}
