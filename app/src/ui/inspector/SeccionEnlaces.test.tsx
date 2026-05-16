import { describe, expect, test } from "bun:test";
import { extremoEstado } from "../../modelo/extremos";
import { crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, estadosDeEntidad } from "../../modelo/operaciones";
import type { Id, Modelo, Resultado } from "../../modelo/tipos";
import { listarEnlacesEntidad, SeccionEnlaces } from "./SeccionEnlaces";

describe("listarEnlacesEntidad", () => {
  test("agrupa enlaces entrantes y salientes con contraparte y OPD", () => {
    const { modelo, procesoId } = modeloFlujoBasico();

    const resumen = listarEnlacesEntidad(modelo, procesoId);

    expect(resumen.entrantes).toHaveLength(1);
    expect(resumen.entrantes[0]).toMatchObject({
      direccion: "entrante",
      simbolo: "←",
      tipoOpl: "consumo",
      contraparte: "Entrada",
      opds: "SD",
      opdsCount: 1,
    });
    expect(resumen.salientes).toHaveLength(1);
    expect(resumen.salientes[0]).toMatchObject({
      direccion: "saliente",
      simbolo: "→",
      tipoOpl: "resultado",
      contraparte: "Salida",
      opds: "SD",
      opdsCount: 1,
    });
  });

  test("considera un extremo Estado como participación de su objeto portador", () => {
    let modelo = crearModelo("Estados");
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Pedido"));
    const pedidoId = entidad(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!aprobado) throw new Error("La prueba esperaba estado aprobado");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidad(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));

    const resumen = listarEnlacesEntidad(modelo, pedidoId);

    expect(resumen.entrantes).toHaveLength(1);
    expect(resumen.entrantes[0]?.contraparte).toBe("Aprobar");
    expect(resumen.salientes).toHaveLength(0);
  });

  test("lista refinamientos como grupo informativo del tab Enlaces", () => {
    const modelo = modeloConRefinamientos();

    const resumen = listarEnlacesEntidad(modelo, "p-padre");

    expect(resumen.refinamientos).toEqual([
      { id: "descomposicion:opd-zoom", tipo: "descomposicion", etiqueta: "inzoom", opdNombre: "SD1 zoom", modo: undefined },
      { id: "despliegue:opd-unfold", tipo: "despliegue", etiqueta: "despliegue", opdNombre: "SD2 unfold", modo: "agregacion" },
    ]);
  });
});

describe("SeccionEnlaces contrato", () => {
  test("exporta una función componente y acepta props mínimas", () => {
    const { modelo, procesoId } = modeloFlujoBasico();
    const vnode = (
      <SeccionEnlaces
        modelo={modelo}
        entidad={modelo.entidades[procesoId]!}
        onNavegarEnlace={() => {}}
      />
    );
    expect(typeof SeccionEnlaces).toBe("function");
    expect(vnode).toBeDefined();
  });
});

function modeloFlujoBasico(): { modelo: Modelo; procesoId: Id } {
  let modelo = crearModelo("Flujo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 0, y: 0 }, "Entrada"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 0 }, "Procesar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 440, y: 0 }, "Salida"));
  const entradaId = entidad(modelo, "Entrada");
  const procesoId = entidad(modelo, "Procesar");
  const salidaId = entidad(modelo, "Salida");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entradaId, procesoId, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesoId, salidaId, "resultado"));
  return { modelo, procesoId };
}

function modeloConRefinamientos(): Modelo {
  return {
    id: "m-ref",
    nombre: "Refinamientos",
    opdRaizId: "opd-1",
    nextSeq: 1,
    entidades: {
      "p-padre": {
        id: "p-padre",
        tipo: "proceso",
        nombre: "Padre",
        esencia: "informacional",
        afiliacion: "sistemica",
        refinamientos: {
          descomposicion: { opdId: "opd-zoom" },
          despliegue: { opdId: "opd-unfold", modo: "agregacion" },
        },
      },
    },
    estados: {},
    enlaces: {},
    opds: {
      "opd-1": { id: "opd-1", nombre: "SD", padreId: null, apariencias: {}, enlaces: {} },
      "opd-zoom": { id: "opd-zoom", nombre: "SD1 zoom", padreId: "opd-1", apariencias: {}, enlaces: {} },
      "opd-unfold": { id: "opd-unfold", nombre: "SD2 unfold", padreId: "opd-1", apariencias: {}, enlaces: {} },
    },
  } satisfies Modelo;
}

function entidad(modelo: Modelo, nombre: string): Id {
  const encontrada = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!encontrada) throw new Error(`Entidad no encontrada: ${nombre}`);
  return encontrada.id;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
