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
