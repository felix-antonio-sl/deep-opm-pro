import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso, descomponerProceso } from "../../modelo/operaciones";
import type { Modelo } from "../../modelo/tipos";
import { construirDescriptorMapa, proyectarMapaSistemaAJointCells } from "./mapaSistema";

function must<T>(r: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function crearModeloConArbol(): Modelo {
  let modelo = crearModelo("Modelo de prueba");
  const baseOpdId = modelo.opdRaizId;

  // SD con proceso A -> SD1 con subB, subC
  modelo = must(crearProceso(modelo, baseOpdId, { x: 100, y: 100 }, "Proceso A"));
  const procesoA = Object.values(modelo.entidades).find((e) => e.nombre === "Proceso A")!;
  modelo = must(descomponerProceso(modelo, baseOpdId, procesoA.id)).modelo;

  // Crear subprocesos en SD1
  const sd1 = Object.values(modelo.opds).find((o) => o.padreId === baseOpdId)!;
  modelo = must(crearProceso(modelo, sd1.id, { x: 100, y: 50 }, "SubB"));
  modelo = must(crearProceso(modelo, sd1.id, { x: 100, y: 200 }, "SubC"));

  return modelo;
}

describe("mapaSistema", () => {
  describe("construirDescriptorMapa", () => {
    test("produce 1 nodo por OPD", () => {
      const modelo = crearModeloConArbol();
      const totalOpds = Object.keys(modelo.opds).length;
      const descriptor = construirDescriptorMapa(modelo);
      expect(descriptor.nodos.length).toBe(totalOpds);
    });

    test("produce 1 arista por par (padre, hijo)", () => {
      const modelo = crearModeloConArbol();
      const aristasEsperadas = Object.values(modelo.opds).filter(
        (opd) => opd.padreId !== null,
      ).length;
      const descriptor = construirDescriptorMapa(modelo);
      expect(descriptor.aristas.length).toBe(aristasEsperadas);
    });

    test("la raiz es tipo 'raiz' y no tiene arista entrante", () => {
      const modelo = crearModeloConArbol();
      const descriptor = construirDescriptorMapa(modelo);

      const nodoRaiz = descriptor.nodos.find(
        (n) => n.opdId === modelo.opdRaizId,
      );
      expect(nodoRaiz).toBeDefined();
      expect(nodoRaiz!.tipoRefinamiento).toBe("raiz");

      // La raíz no debe ser target de ninguna arista
      const targetIds = new Set(descriptor.aristas.map((a) => a.haciaOpdId));
      expect(targetIds.has(modelo.opdRaizId)).toBe(false);
    });

    test("el descriptor es determinista: mismo modelo -> mismo descriptor", () => {
      const modelo = crearModeloConArbol();
      const d1 = construirDescriptorMapa(modelo);
      const d2 = construirDescriptorMapa(modelo);
      expect(JSON.stringify(d1)).toBe(JSON.stringify(d2));
    });

    test("el thumbnail tiene contadores correctos de entidades y enlaces", () => {
      const modelo = crearModeloConArbol();
      const descriptor = construirDescriptorMapa(modelo);

      for (const nodo of descriptor.nodos) {
        const opd = modelo.opds[nodo.opdId];
        expect(opd).toBeDefined();
        expect(nodo.thumbnailEntidades).toBe(Object.keys(opd!.apariencias).length);
        expect(nodo.thumbnailEnlaces).toBe(Object.keys(opd!.enlaces).length);
      }
    });
  });

  describe("proyectarMapaSistemaAJointCells", () => {
    test("emite Rectangle por nodo y Link por arista", () => {
      const modelo = crearModeloConArbol();
      const descriptor = construirDescriptorMapa(modelo);
      const celdas = proyectarMapaSistemaAJointCells(descriptor);

      const rects = celdas.filter((c) => c.type === "standard.Rectangle");
      const links = celdas.filter((c) => c.type === "standard.Link");

      expect(rects.length).toBe(descriptor.nodos.length);
      expect(links.length).toBe(descriptor.aristas.length);
    });

    test("las aristas no usan estilo OPM", () => {
      const modelo = crearModeloConArbol();
      const descriptor = construirDescriptorMapa(modelo);
      const celdas = proyectarMapaSistemaAJointCells(descriptor);
      const links = celdas.filter((c) => c.type === "standard.Link");

      for (const link of links) {
        const attrs = link.attrs as Record<string, Record<string, unknown>> | undefined;
        const lineStroke = attrs?.line?.stroke;
        // Debe ser gris neutro, no los colores OPM (#70E483, #3BC3FF, etc.)
        expect(lineStroke).toBe("#9ca3af");
      }
    });
  });
});
