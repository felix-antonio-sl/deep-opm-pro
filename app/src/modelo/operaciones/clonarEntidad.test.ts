// Unit del verbo Calcar (corte "gesto de anclar", B2+B3): `clonarEntidadConIdFresco`.
//
// El Calco de una Pieza externa es ENTIDAD cruda → identidad fresca, estados clonados,
// SIN anclaje (Calcar = copiar y olvidar). Aquí se falsea: id fresco distinto del origen,
// estados remapeados al clon, aparición creada en el OPD destino y CERO anclaje/contexto
// de origen filtrado (refinamientos/estereotipoId/requisito).
import { describe, expect, test } from "bun:test";
import {
  anclarAPieza,
  clonarEntidadConIdFresco,
  crearModelo,
  crearObjeto,
} from "../operaciones";
import type { BibliotecaRef, Entidad, Estado, Id, Modelo, Resultado } from "../tipos";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Entidad {
  const e = Object.values(modelo.entidades).find((x) => x.nombre === nombre);
  if (!e) throw new Error(`Entidad no encontrada: ${nombre}`);
  return e;
}

/** Biblioteca de origen: un objeto "Recurso" con dos estados + un objeto anclado/refinado para probar el filtrado. */
function biblioteca(): Modelo {
  let lib = crearModelo("gist-lib");
  lib = { ...lib, id: "gist-lib" };
  lib = must(crearObjeto(lib, lib.opdRaizId, { x: 0, y: 0 }, "Recurso"));
  const recurso = entidadPorNombre(lib, "Recurso");
  // Dos estados crudos del objeto Recurso (en su biblioteca de origen).
  const s1: Estado = { id: "s-origen-1", entidadId: recurso.id, nombre: "en origen", esInicial: true };
  const s2: Estado = { id: "s-origen-2", entidadId: recurso.id, nombre: "en destino", esFinal: true };
  return { ...lib, estados: { ...lib.estados, [s1.id]: s1, [s2.id]: s2 } };
}

describe("clonarEntidadConIdFresco — Calcar una Pieza al OPD destino", () => {
  test("clona con id FRESCO en el modelo destino y crea aparición en el OPD activo", () => {
    const lib = biblioteca();
    const recurso = entidadPorNombre(lib, "Recurso");
    // Destino con una cosa preexistente: el id fresco debe esquivarla.
    const base = crearModelo("HODOM");
    const destino = must(crearObjeto(base, base.opdRaizId, { x: 0, y: 0 }, "Existente"));

    const r = must(clonarEntidadConIdFresco(destino, recurso, Object.values(lib.estados), destino.opdRaizId, { x: 100, y: 200 }));

    // "Fresco" = no colisiona con ninguna entidad ya presente en el destino.
    expect(Object.keys(destino.entidades)).not.toContain(r.entidadId);
    const clon = r.modelo.entidades[r.entidadId];
    expect(clon).toBeDefined();
    expect(clon!.nombre).toBe("Recurso");
    expect(clon!.tipo).toBe("objeto");
    // La aparición existe en el OPD destino, en la posición pedida.
    const aparicion = r.modelo.opds[destino.opdRaizId]!.apariencias[r.aparienciaId];
    expect(aparicion).toBeDefined();
    expect(aparicion!.entidadId).toBe(r.entidadId);
    expect(aparicion!.x).toBe(100);
    expect(aparicion!.y).toBe(200);
  });

  test("clona los estados con ids frescos y entidadId remapeado al clon", () => {
    const lib = biblioteca();
    const recurso = entidadPorNombre(lib, "Recurso");
    const destino = crearModelo("HODOM");

    const r = must(clonarEntidadConIdFresco(destino, recurso, Object.values(lib.estados), destino.opdRaizId, { x: 0, y: 0 }));

    expect(r.estadosCreados).toHaveLength(2);
    for (const sid of r.estadosCreados) {
      const estado = r.modelo.estados[sid];
      expect(estado).toBeDefined();
      expect(estado!.entidadId).toBe(r.entidadId); // remapeado al clon, no al origen
      expect(["en origen", "en destino"]).toContain(estado!.nombre);
    }
    // Los ids de origen NO se reusan.
    expect(r.estadosCreados).not.toContain("s-origen-1" as Id);
    expect(r.estadosCreados).not.toContain("s-origen-2" as Id);
  });

  test("Calcar NO deja anclaje (es copiar y olvidar)", () => {
    const lib = biblioteca();
    const recurso = entidadPorNombre(lib, "Recurso");
    const destino = crearModelo("HODOM");

    const r = must(clonarEntidadConIdFresco(destino, recurso, Object.values(lib.estados), destino.opdRaizId, { x: 0, y: 0 }));
    expect(r.modelo.entidades[r.entidadId]!.anclaje).toBeUndefined();
  });

  test("filtra el contexto de origen: refinamientos, estereotipoId, requisito y anclaje previo se descartan", () => {
    const lib = biblioteca();
    const recurso = entidadPorNombre(lib, "Recurso");
    // Pieza "sucia": trae contexto de su biblioteca de origen que no debe viajar.
    const biblio: BibliotecaRef = { modeloId: "otra-lib", frozenAtHash: "fnv1a-deadbeef" };
    const piezaSucia: Entidad = {
      ...recurso,
      estereotipoId: "est-local-origen",
      refinamientos: { descomposicion: { opdId: "opd-ajeno" } },
      requisito: { idLogico: "REQ-1", descripcion: "requisito de origen", dureza: "soft" },
      anclaje: { piezaId: "pieza-vieja", biblioteca: biblio },
    };
    const destino = crearModelo("HODOM");

    const r = must(clonarEntidadConIdFresco(destino, piezaSucia, [], destino.opdRaizId, { x: 0, y: 0 }));
    const clon = r.modelo.entidades[r.entidadId]!;
    expect(clon.estereotipoId).toBeUndefined();
    expect(clon.refinamientos).toBeUndefined();
    expect(clon.requisito).toBeUndefined();
    expect(clon.anclaje).toBeUndefined();
  });

  test("avanza nextSeq de forma aditiva (no colisiona ids con el modelo destino)", () => {
    const lib = biblioteca();
    const recurso = entidadPorNombre(lib, "Recurso");
    let destino = crearModelo("HODOM");
    destino = must(crearObjeto(destino, destino.opdRaizId, { x: 0, y: 0 }, "Existente"));
    const seqAntes = destino.nextSeq;

    const r = must(clonarEntidadConIdFresco(destino, recurso, Object.values(lib.estados), destino.opdRaizId, { x: 0, y: 0 }));
    expect(r.modelo.nextSeq).toBeGreaterThan(seqAntes);
    // La cosa preexistente sigue intacta.
    expect(entidadPorNombre(r.modelo, "Existente")).toBeDefined();
  });

  test("Anclar = Calcar + anclarAPieza: la composición deja anclaje sobre la entidad clonada", () => {
    const lib = biblioteca();
    const recurso = entidadPorNombre(lib, "Recurso");
    const destino = crearModelo("HODOM");

    const r = must(clonarEntidadConIdFresco(destino, recurso, Object.values(lib.estados), destino.opdRaizId, { x: 0, y: 0 }));
    const biblio: BibliotecaRef = { modeloId: lib.id, nombre: lib.nombre, frozenAtHash: "fnv1a-cafe1234" };
    const anclado = must(anclarAPieza(r.modelo, r.entidadId, biblio, recurso.id));

    const clon = anclado.entidades[r.entidadId]!;
    expect(clon.anclaje).toBeDefined();
    expect(clon.anclaje!.piezaId).toBe(recurso.id);
    expect(clon.anclaje!.biblioteca.frozenAtHash).toBe("fnv1a-cafe1234");
  });
});
