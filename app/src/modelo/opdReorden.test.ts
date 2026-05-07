import { describe, expect, test } from "bun:test";
import {
  listarHermanos,
  moverNodo,
  ordenSegunCanvasPadre,
  ordenarHermanos,
  reordenarHermanos,
  validarMovimientoSinCiclo,
} from "./opdReorden";
import { crearModelo, crearProceso, descomponerProceso } from "./operaciones";
import type { Modelo } from "./tipos";

function must<T>(r: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function crearModeloConArbol(): Modelo {
  // SD con proceso A -> descompone en SD1 con subB y subC
  let modelo = crearModelo("Modelo de prueba");
  const baseOpdId = modelo.opdRaizId;

  // Crear proceso A en SD
  modelo = must(crearProceso(modelo, baseOpdId, { x: 100, y: 100 }, "Proceso A"));
  const entidades = Object.values(modelo.entidades);
  const procesoA = entidades.find((e) => e.nombre === "Proceso A")!;

  // Descomponer proceso A -> crea SD1
  modelo = must(descomponerProceso(modelo, baseOpdId, procesoA.id)).modelo;

  // Crear subB y subC en el nuevo SD1
  const opds = Object.values(modelo.opds);
  const sd1 = opds.find((o) => o.padreId === baseOpdId)!;
  modelo = must(crearProceso(modelo, sd1.id, { x: 100, y: 50 }, "Subproceso B"));
  modelo = must(crearProceso(modelo, sd1.id, { x: 100, y: 200 }, "Subproceso C"));

  return modelo;
}

describe("opdReorden", () => {
  describe("listarHermanos", () => {
    test("devuelve ids de hermanos compartiendo padreId", () => {
      const modelo = crearModeloConArbol();
      const baseOpdId = modelo.opdRaizId;
      const hijos = Object.values(modelo.opds).filter((o) => o.padreId === baseOpdId);

      expect(hijos.length).toBeGreaterThanOrEqual(1);
      const primerHijoId = hijos[0]!.id;
      const hermanos = listarHermanos(modelo, primerHijoId);

      expect(hermanos.length).toBe(hijos.length);
      for (const id of hermanos) {
        expect(modelo.opds[id]?.padreId).toBe(baseOpdId);
      }
    });
  });

  describe("ordenarHermanos", () => {
    test("ordena por ordenLocal cuando todos lo tienen", () => {
      const hermanosConOrden = [
        { id: "b", nombre: "B", padreId: null, apariencias: {}, enlaces: {}, ordenLocal: 2 },
        { id: "a", nombre: "A", padreId: null, apariencias: {}, enlaces: {}, ordenLocal: 0 },
        { id: "c", nombre: "C", padreId: null, apariencias: {}, enlaces: {}, ordenLocal: 1 },
      ];
      const resultado = ordenarHermanos(hermanosConOrden);
      expect(resultado).toEqual(["a", "c", "b"]);
    });

    test("ordena alfabeticamente cuando no todos tienen ordenLocal", () => {
      const mixtos = [
        { id: "z", nombre: "Z", padreId: null, apariencias: {}, enlaces: {} },
        { id: "a", nombre: "A", padreId: null, apariencias: {}, enlaces: {}, ordenLocal: 0 },
        { id: "m", nombre: "M", padreId: null, apariencias: {}, enlaces: {} },
      ];
      const resultado = ordenarHermanos(mixtos);
      expect(resultado).toEqual(["a", "m", "z"]);
    });
  });

  describe("validarMovimientoSinCiclo", () => {
    test("rechaza mover un OPD bajo sí mismo", () => {
      const modelo = crearModeloConArbol();
      const baseOpdId = modelo.opdRaizId;
      const resultado = validarMovimientoSinCiclo(modelo, baseOpdId, baseOpdId);
      expect(resultado.ok).toBe(false);
    });

    test("rechaza mover un OPD bajo su descendiente (crearia ciclo)", () => {
      const modelo = crearModeloConArbol();
      const baseOpdId = modelo.opdRaizId;
      const hijo = Object.values(modelo.opds).find((o) => o.padreId === baseOpdId)!;
      const resultado = validarMovimientoSinCiclo(modelo, baseOpdId, hijo.id);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) {
        expect(resultado.error).toContain("ciclo");
      }
    });

    test("permite mover un OPD bajo un hermano no descendiente", () => {
      // Crear dos OPDs hermanos bajo SD
      let modelo = crearModelo("Dos hermanos");
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "A"));
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 300, y: 100 }, "B"));

      const a = Object.values(modelo.entidades).find((e) => e.nombre === "A")!;
      modelo = must(descomponerProceso(modelo, modelo.opdRaizId, a.id)).modelo;
      const b = Object.values(modelo.entidades).find((e) => e.nombre === "B")!;
      modelo = must(descomponerProceso(modelo, modelo.opdRaizId, b.id)).modelo;

      const sd1 = Object.values(modelo.opds).find((o) => {
        const ref = Object.values(modelo.entidades).find(
          (e) => (e.refinamientos?.descomposicion?.opdId === o.id || e.refinamientos?.despliegue?.opdId === o.id) && e.nombre === "A",
        );
        return ref != null;
      })!;

      const sd2 = Object.values(modelo.opds).find((o) => {
        const ref = Object.values(modelo.entidades).find(
          (e) => (e.refinamientos?.descomposicion?.opdId === o.id || e.refinamientos?.despliegue?.opdId === o.id) && e.nombre === "B",
        );
        return ref != null;
      })!;

      // Mover SD2 bajo SD1 deberia ser valido (son hermanos, no hay ciclo)
      const resultado = validarMovimientoSinCiclo(modelo, sd2.id, sd1.id);
      expect(resultado.ok).toBe(true);
    });
  });

  describe("moverNodo", () => {
    test("rechaza mover el OPD raíz SD", () => {
      const modelo = crearModeloConArbol();
      const resultado = moverNodo(modelo, modelo.opdRaizId, null);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) {
        expect(resultado.error).toContain("raíz");
      }
    });

    test("mueve un OPD a un nuevo padre y asigna ordenLocal", () => {
      let modelo = crearModelo("Mover prueba");
      const sdId = modelo.opdRaizId;
      modelo = must(crearProceso(modelo, sdId, { x: 100, y: 100 }, "A"));
      modelo = must(crearProceso(modelo, sdId, { x: 300, y: 100 }, "B"));
      const a = Object.values(modelo.entidades).find((e) => e.nombre === "A")!;
      const b = Object.values(modelo.entidades).find((e) => e.nombre === "B")!;
      modelo = must(descomponerProceso(modelo, sdId, a.id)).modelo;
      modelo = must(descomponerProceso(modelo, sdId, b.id)).modelo;

      const sd1 = Object.values(modelo.opds).find((o) => {
        const ref = Object.values(modelo.entidades).find(
          (e) => (e.refinamientos?.descomposicion?.opdId === o.id || e.refinamientos?.despliegue?.opdId === o.id) && e.nombre === "A",
        );
        return ref != null;
      })!;

      const sd2 = Object.values(modelo.opds).find((o) => {
        const ref = Object.values(modelo.entidades).find(
          (e) => (e.refinamientos?.descomposicion?.opdId === o.id || e.refinamientos?.despliegue?.opdId === o.id) && e.nombre === "B",
        );
        return ref != null;
      })!;

      expect(sd1.padreId).toBe(sdId);
      expect(sd2.padreId).toBe(sdId);

      const resultado = moverNodo(modelo, sd2.id, sd1.id);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        const movido = resultado.value.opds[sd2.id];
        expect(movido).toBeDefined();
        expect(movido!.padreId).toBe(sd1.id);
        // Debe tener ordenLocal asignado
        expect(movido!.ordenLocal).toBeDefined();
        expect(typeof movido!.ordenLocal).toBe("number");
      }
    });

    test("rechaza mover un OPD bajo su descendiente", () => {
      // Crear árbol: SD > SD1 > SD1.1 (tres niveles)
      // Intentar mover SD1 bajo SD1.1 (su propio hijo) debe fallar por ciclo
      let modelo = crearModelo("Ciclo prueba");
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "A"));
      const a = Object.values(modelo.entidades).find((e) => e.nombre === "A")!;
      modelo = must(descomponerProceso(modelo, modelo.opdRaizId, a.id)).modelo;

      // Encontrar SD1 y descomponer un subproceso dentro
      const sd1 = Object.values(modelo.opds).find((o) => o.padreId === modelo.opdRaizId)!;
      modelo = must(crearProceso(modelo, sd1.id, { x: 100, y: 100 }, "SubA"));
      const subA = Object.values(modelo.entidades).find((e) => e.nombre === "SubA")!;
      modelo = must(descomponerProceso(modelo, sd1.id, subA.id)).modelo;

      const sd11 = Object.values(modelo.opds).find((o) => o.padreId === sd1.id)!;

      // Intentar mover SD1 bajo SD1.1 (su propio descendiente) -> ciclo
      const resultado = moverNodo(modelo, sd1.id, sd11.id);
      expect(resultado.ok).toBe(false);
      if (!resultado.ok) {
        expect(resultado.error).toContain("ciclo");
      }
    });
  });

  describe("reordenarHermanos", () => {
    test("valida que el orden nuevo contenga los mismos ids", () => {
      const modelo = crearModeloConArbol();
      const baseOpdId = modelo.opdRaizId;
      const hijos = Object.values(modelo.opds).filter((o) => o.padreId === baseOpdId);
      const idsHijos = hijos.map((h) => h.id);

      // Orden con id faltante
      const resultadoFalta = reordenarHermanos(modelo, baseOpdId, idsHijos.slice(1));
      expect(resultadoFalta.ok).toBe(false);

      // Orden con id duplicado
      const conDuplicado = [idsHijos[0]!, ...idsHijos];
      const resultadoDup = reordenarHermanos(modelo, baseOpdId, conDuplicado);
      expect(resultadoDup.ok).toBe(false);
    });

    test("reasigna ordenLocal a hermanos en el orden dado", () => {
      const modelo = crearModeloConArbol();
      const baseOpdId = modelo.opdRaizId;
      const hijos = Object.values(modelo.opds).filter((o) => o.padreId === baseOpdId);

      if (hijos.length < 2) return; // Necesita al menos 2

      const ordenInverso = [...hijos].reverse().map((h) => h.id);
      const resultado = reordenarHermanos(modelo, baseOpdId, ordenInverso);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        for (const [idx, id] of ordenInverso.entries()) {
          expect(resultado.value.opds[id]!.ordenLocal).toBe(idx);
        }
      }
    });
  });

  describe("ordenSegunCanvasPadre", () => {
    test("ordena hijos de descomposicion por apariencia.y", () => {
      let modelo = crearModelo("Orden Y");
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 300 }, "Proceso Bajo"));
      modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 100, y: 100 }, "Proceso Alto"));

      const alto = Object.values(modelo.entidades).find((e) => e.nombre === "Proceso Alto")!;
      modelo = must(descomponerProceso(modelo, modelo.opdRaizId, alto.id)).modelo;

      const bajo = Object.values(modelo.entidades).find((e) => e.nombre === "Proceso Bajo")!;
      modelo = must(descomponerProceso(modelo, modelo.opdRaizId, bajo.id)).modelo;

      const baseOpdId = modelo.opdRaizId;
      const resultado = ordenSegunCanvasPadre(modelo, baseOpdId);
      expect(resultado.ok).toBe(true);
      if (resultado.ok) {
        const ordenados = resultado.value;
        // El que esta mas arriba (y=100) debe aparecer primero
        const hijos = Object.values(modelo.opds).filter((o) => o.padreId === baseOpdId);
        expect(ordenados.length).toBe(hijos.length);

        // Verificar que el orden corresponde a Y
        const yDeOrdenados = ordenados.map((id) => {
          const refinador = Object.values(modelo.entidades).find(
            (e) => (e.refinamientos?.descomposicion?.opdId === id || e.refinamientos?.despliegue?.opdId === id),
          );
          if (!refinador) return Number.POSITIVE_INFINITY;
          const ap = Object.values(modelo.opds[baseOpdId]!.apariencias).find(
            (ap) => ap.entidadId === refinador.id,
          );
          return ap?.y ?? Number.POSITIVE_INFINITY;
        });

        for (let i = 1; i < yDeOrdenados.length; i++) {
          expect(yDeOrdenados[i]!).toBeGreaterThanOrEqual(yDeOrdenados[i - 1]!);
        }
      }
    });
  });
});
