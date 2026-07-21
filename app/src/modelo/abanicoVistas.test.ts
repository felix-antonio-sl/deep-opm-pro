import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria";
import { proyectarModeloAJointCells } from "../render/jointjs/proyeccion";
import { exportarModelo } from "../serializacion/json";
import {
  formarAbanico,
  proyeccionesAbanicoEnOpd,
  puedeEditarAbanicoEnOpd,
} from "./abanicos";
import { eliminarOpdHoja } from "./opdEliminacion";
import { sincronizarPuertosEnlaces } from "./operaciones";
import type { Id, Modelo, Resultado } from "./tipos";

describe("abanicos lógicos proyectados en vistas", () => {
  test("la vista genérica completa reutiliza el abanico sin crear hechos", () => {
    const { modelo, abanicoId, propietarioId, vistaId, enlaceIds } = modeloConAbanicoYVista(2);
    const antes = exportarModelo(modelo);

    const proyecciones = proyeccionesAbanicoEnOpd(modelo, vistaId);
    const overlay = proyectarModeloAJointCells(modelo, vistaId, null, null)
      .find((cell) => cell.opm.kind === "overlay-abanico");

    expect(proyecciones).toEqual([expect.objectContaining({
      abanicoId,
      opdPropietarioId: propietarioId,
      opdVisualId: vistaId,
      enlaceIdsVisibles: enlaceIds,
      completa: true,
      heredada: true,
    })]);
    expect(overlay?.opm).toEqual({
      kind: "overlay-abanico",
      opdId: vistaId,
      abanicoId,
      operador: "XOR",
    });
    expect(exportarModelo(modelo)).toBe(antes);
    expect(Object.keys(modelo.abanicos ?? {})).toEqual([abanicoId]);
  });

  test("la vista parcial conserva membresía y puerto pero no dibuja un arco falso", () => {
    const { modelo, abanicoId, vistaId, enlaceIds, procesoId } = modeloConAbanicoYVista(1);
    const abanico = modelo.abanicos?.[abanicoId];
    if (!abanico) throw new Error("La prueba esperaba abanico");

    const proyeccion = proyeccionesAbanicoEnOpd(modelo, vistaId)[0];
    const sincronizado = sincronizarPuertosEnlaces(modelo, vistaId);
    const enlaceVisible = sincronizado.enlaces[enlaceIds[0]!]!;
    const aparienciaProceso = Object.values(sincronizado.opds[vistaId]!.apariencias)
      .find((apariencia) => apariencia.entidadId === procesoId);
    const celdas = proyectarModeloAJointCells(sincronizado, vistaId, null, null);
    const overlay = celdas.find((cell) => cell.opm.kind === "overlay-abanico");
    const ramaVisible = celdas.find((cell) => cell.opm.kind === "enlace" && cell.opm.enlaceId === enlaceIds[0]);

    expect(proyeccion).toEqual(expect.objectContaining({
      abanicoId,
      enlaceIdsVisibles: [enlaceIds[0]],
      completa: false,
      heredada: true,
    }));
    expect(overlay).toBeUndefined();
    expect(enlaceVisible.origenId.portId).toBe(abanico.puertoComun.portId);
    expect(aparienciaProceso?.ports?.[abanico.puertoComun.portId]).toBeDefined();
    expect(ramaVisible?.source).toMatchObject({ port: abanico.puertoComun.portId });
    expect(sincronizado.abanicos).toEqual(modelo.abanicos);
  });

  test("sincroniza la geometría local usando el puerto compartido del abanico heredado", () => {
    const { modelo, abanicoId, vistaId, procesoId } = modeloConAbanicoYVista(2);
    const abanico = modelo.abanicos?.[abanicoId];
    if (!abanico) throw new Error("La prueba esperaba abanico");

    const sincronizado = sincronizarPuertosEnlaces(modelo, vistaId);
    const aparienciaProceso = Object.values(sincronizado.opds[vistaId]!.apariencias)
      .find((apariencia) => apariencia.entidadId === procesoId);

    expect(aparienciaProceso?.ports?.[abanico.puertoComun.portId]).toEqual({ x: 0.5, y: 0 });
  });

  test("solo el OPD propietario tiene capacidad de editar el abanico", () => {
    const { modelo, abanicoId, propietarioId, vistaId } = modeloConAbanicoYVista(2);
    const abanico = modelo.abanicos?.[abanicoId];
    if (!abanico) throw new Error("La prueba esperaba abanico");

    expect(puedeEditarAbanicoEnOpd(abanico, propietarioId)).toBe(true);
    expect(puedeEditarAbanicoEnOpd(abanico, vistaId)).toBe(false);
  });

  test("rechaza crear un abanico en una vista genérica y duplicar miembros en otro OPD", () => {
    const { modelo, vistaId, enlaceIds } = modeloConAbanicoYVista(2);

    const enVista = formarAbanico(modelo, vistaId, enlaceIds, "XOR");
    expect(enVista.ok).toBe(false);
    if (enVista.ok) return;
    expect(enVista.error).toContain("vista genérica");

    const opdVista = modelo.opds[vistaId]!;
    const { vista: _vista, ...opdOrdinario } = opdVista;
    const comoOpdOrdinario: Modelo = {
      ...modelo,
      opds: { ...modelo.opds, [vistaId]: opdOrdinario },
    };
    const duplicado = formarAbanico(comoOpdOrdinario, vistaId, enlaceIds, "XOR");
    expect(duplicado.ok).toBe(false);
    if (duplicado.ok) return;
    expect(duplicado.error).toContain("otro abanico");
  });

  test("eliminar una vista no toca el abanico y eliminar al propietario lo retira", () => {
    const primero = modeloConAbanicoYVista(2);
    const sinVista = must(eliminarOpdHoja(primero.modelo, primero.vistaId)).modelo;
    expect(sinVista.abanicos?.[primero.abanicoId]).toEqual(primero.modelo.abanicos?.[primero.abanicoId]);

    const segundo = modeloConAbanicoYVista(2);
    const sinPropietario = must(eliminarOpdHoja(segundo.modelo, segundo.propietarioId)).modelo;
    expect(sinPropietario.abanicos).toEqual({});
    expect(proyeccionesAbanicoEnOpd(sinPropietario, segundo.vistaId)).toEqual([]);
  });
});

function modeloConAbanicoYVista(ramasVisibles: 1 | 2): {
  modelo: Modelo;
  abanicoId: Id;
  propietarioId: Id;
  vistaId: Id;
  enlaceIds: Id[];
  procesoId: Id;
} {
  const autor = crearAutor({ id: "fan-vista", nombre: "Fan en vista" });
  autor.opd("sd0", "SD0", null);
  autor.opd("propietario", "Decisión propietaria", "sd0");
  autor.opd("vista", "Escenario", "sd0");
  autor.vistaGenerica("vista");
  autor.entidad("p", "proceso", "Decidir", "fisica", "sistemica");
  autor.entidad("a", "objeto", "Resultado A", "informacional", "sistemica");
  autor.entidad("b", "objeto", "Resultado B", "informacional", "sistemica");
  autor.ver("propietario", "p", 200, 200);
  autor.ver("propietario", "a", 100, 0);
  autor.ver("propietario", "b", 300, 0);
  autor.ver("vista", "p", 200, 200);
  autor.ver("vista", "a", 100, 0);
  if (ramasVisibles === 2) autor.ver("vista", "b", 300, 0);
  const enlaceA = autor.enlazar("propietario", "p", "a", "resultado");
  const enlaceB = autor.enlazar("propietario", "p", "b", "resultado");
  if (!enlaceA || !enlaceB) throw new Error("La prueba esperaba dos enlaces");
  const enlaceIds = [enlaceA, enlaceB];
  const abanicoId = autor.abanico("propietario", enlaceIds, "XOR");
  autor.aparecerEnlacePorId("vista", enlaceA);
  if (ramasVisibles === 2) autor.aparecerEnlacePorId("vista", enlaceB);
  const proceso = Object.values(autor.modelo.entidades).find((entidad) => entidad.nombre === "Decidir");
  if (!proceso) throw new Error("La prueba esperaba el proceso Decidir");
  return {
    modelo: autor.modelo,
    abanicoId,
    propietarioId: autor.idOpd("propietario"),
    vistaId: autor.idOpd("vista"),
    enlaceIds,
    procesoId: proceso.id,
  };
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
