import { describe, expect, test } from "bun:test";
import {
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
} from "../modelo/operaciones";
import { agregarEstado } from "../modelo/operaciones/estados";
import { designarInicial } from "../modelo/estadosDesignaciones";
import { fijarDuracion } from "../modelo/objetoDuracion";
import { desplegar, iniciarSimulacion } from "../modelo/simulacion/runner";
import {
  COSTO_IDENTIDAD,
  aristasDeCorrida,
  categoriaDeCosto,
  categoriaDeCostoDeCorridas,
  componerCosto,
  costoDeCamino,
} from "../modelo/simulacion/costoCategoria";
import { extremoEntidad, extremoEstado } from "../modelo/extremos";
import type { Id, Modelo, Resultado } from "../modelo/tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Fixture fail: ${resultado.error}`);
  return resultado.value;
}

function eid(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((it) => it.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

/**
 * Pieza: cruda --Tallar(5min)--> semielaborada --Pulir(3min)--> terminada.
 * Traza de 2 pasos: reloj = 300 + 180 = 480 s.
 */
function modeloCadena(): { modelo: Modelo; crudaId: Id; semiId: Id; terminadaId: Id } {
  let modelo = crearModelo("Cadena de costo");
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 120 }, "Pieza"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 60 }, "Tallar"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 280, y: 220 }, "Pulir"));
  const piezaId = eid(modelo, "Pieza");

  const estados = must(crearEstadosIniciales(modelo, piezaId));
  modelo = estados.modelo;
  const [crudaId, semiId] = estados.estadoIds as [Id, Id];
  const tercero = must(agregarEstado(modelo, piezaId, "terminada"));
  modelo = tercero.modelo;
  const terminadaId = tercero.estadoId;

  modelo = must(designarInicial(modelo, crudaId));
  modelo = must(fijarDuracion(modelo, semiId, { unidad: "min", min: 2, nominal: 5, max: 8 }));
  modelo = must(fijarDuracion(modelo, terminadaId, { unidad: "min", min: 1, nominal: 3, max: 6 }));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(crudaId), extremoEntidad(eid(modelo, "Tallar")), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(eid(modelo, "Tallar")), extremoEstado(semiId), "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(semiId), extremoEntidad(eid(modelo, "Pulir")), "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEntidad(eid(modelo, "Pulir")), extremoEstado(terminadaId), "resultado"));

  return { modelo, crudaId, semiId, terminadaId };
}

describe("LEY F-D3 (Cost-category) — el enriquecimiento como monoide de costos, no agregación", () => {
  test("monoide: costoDeCamino = foldMap(duración) = suma de los pasos (≠ máximo)", () => {
    const { modelo } = modeloCadena();
    const corrida = desplegar(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));

    expect(costoDeCamino(corrida)).toBe(480); // 300 + 180, la suma del monoide
    expect(corrida.reloj).toBe(480); // consistente con el reloj
    // control de no-tautología: la composición es SUMA, no máximo ni primero.
    const duraciones = corrida.trace.map((p) => p.duracion ?? 0);
    expect(Math.max(...duraciones)).toBe(300);
    expect(costoDeCamino(corrida)).not.toBe(Math.max(...duraciones));
  });

  test("monoide: la unidad es 0 (traza vacía) y componerCosto es asociativa", () => {
    const { modelo } = modeloCadena();
    const preparada = iniciarSimulacion(modelo, modelo.opdRaizId); // sin ejecutar: trace vacío
    expect(costoDeCamino(preparada)).toBe(COSTO_IDENTIDAD);
    expect(componerCosto(7, COSTO_IDENTIDAD)).toBe(7); // unidad por derecha
    expect(componerCosto(COSTO_IDENTIDAD, 7)).toBe(7); // unidad por izquierda
    expect(componerCosto(componerCosto(2, 3), 4)).toBe(componerCosto(2, componerCosto(3, 4))); // asociativa
  });

  test("Cost-category: identidad X(x,x)=0, triángulo y shortest-path (min,+) — ejemplo canónico", () => {
    // corpus icas-enriquecimiento: A→C:10, A→B:3, B→C:2 ⟹ X(A,C)=min(10,3+2)=5.
    const cat = categoriaDeCosto(
      ["A", "B", "C"],
      [
        { origen: "A", destino: "C", costo: 10 },
        { origen: "A", destino: "B", costo: 3 },
        { origen: "B", destino: "C", costo: 2 },
      ],
    );
    expect(cat.hom("A", "A")).toBe(0); // identidad = unidad del monoide
    // control de no-tautología: el costo directo 10 se CORRIGE al shortest-path 5 (la cerradura no es no-op).
    expect(cat.hom("A", "C")).toBe(5);
    expect(cat.hom("A", "C")).toBeLessThan(10);
    // desigualdad triangular: X(A,C) ≤ X(A,B) + X(B,C).
    expect(cat.hom("A", "C")).toBeLessThanOrEqual(cat.hom("A", "B") + cat.hom("B", "C"));
  });

  test("Cost-category: la composición de la categoría ES la suma del monoide (vía traza real)", () => {
    const { modelo, crudaId, semiId, terminadaId } = modeloCadena();
    const corrida = desplegar(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));
    const cat = categoriaDeCostoDeCorridas([corrida]);

    expect(cat.hom(crudaId, semiId)).toBe(300);
    expect(cat.hom(semiId, terminadaId)).toBe(180);
    // composición transitiva: X(cruda, terminada) = X(cruda, semi) ⊗ X(semi, terminada).
    expect(cat.hom(crudaId, terminadaId)).toBe(componerCosto(cat.hom(crudaId, semiId), cat.hom(semiId, terminadaId)));
    expect(cat.hom(crudaId, terminadaId)).toBe(480);
    expect(cat.hom(crudaId, crudaId)).toBe(COSTO_IDENTIDAD);
  });

  test("Cost-category: shortest-path elige el rodeo barato sobre el directo caro (min real)", () => {
    // control de no-tautología del (min,+): si la cerradura usara max o ignorara rodeos, X(A,C)=10.
    const cat = categoriaDeCosto(
      ["A", "B", "C"],
      [
        { origen: "A", destino: "B", costo: 1 },
        { origen: "B", destino: "C", costo: 1 },
        { origen: "A", destino: "C", costo: 100 },
      ],
    );
    expect(cat.hom("A", "C")).toBe(2); // 1+1 vence a 100
  });

  test("aristasDeCorrida deriva las transiciones de estado con su costo", () => {
    const { modelo, crudaId, semiId, terminadaId } = modeloCadena();
    const corrida = desplegar(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));
    const aristas = aristasDeCorrida(corrida);

    expect(aristas).toContainEqual({ origen: crudaId, destino: semiId, costo: 300 });
    expect(aristas).toContainEqual({ origen: semiId, destino: terminadaId, costo: 180 });
  });
});
