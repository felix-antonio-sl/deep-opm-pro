import { describe, expect, test } from "bun:test";
import { crearAutor } from "./dsl";
import { generarOpl } from "../opl/generar";

/**
 * W4.1 (Tanda 1 del inventario `inventario-primitivas-dsl.md (retirado 2a83c1c5, en git)`) — primitivas
 * ADITIVAS del DSL que delegan 1:1 a operaciones del kernel ya existentes. Por cada primitiva:
 *   (i)   caso feliz: el efecto queda en el modelo emitido,
 *   (ii)  caso de error: el kernel rechaza la construcción ilegal (no es un test siempre-verde),
 *   (iii) round-trip OPL: el forward (`generarOpl`, oráculo) verbaliza la oración esperada.
 *
 * Las seis primitivas: abanico XOR/OR (#30), multiplicidadOrigen (#31), demora (#21),
 * autoinvocación (#22), modificador "no" (#19), designaciones default/current (#5).
 */

// ─── #30 — Abanico XOR/OR (formarAbanico) ──────────────────────────────────────
describe("W4.1 — abanico XOR/OR (delega a formarAbanico)", () => {
  function autorConRamas() {
    const a = crearAutor({ id: "ab", nombre: "Abanico" });
    a.opd("sd0", "SD0", null);
    a.entidad("proc", "proceso", "Decidir", "fisica", "sistemica");
    a.entidad("ra", "proceso", "Ruta A", "fisica", "sistemica");
    a.entidad("rb", "proceso", "Ruta B", "fisica", "sistemica");
    a.ver("sd0", "proc", 0, 0);
    a.ver("sd0", "ra", 200, 0);
    a.ver("sd0", "rb", 200, 100);
    const e1 = a.enlazar("sd0", "proc", "ra", "invocacion");
    const e2 = a.enlazar("sd0", "proc", "rb", "invocacion");
    return { a, e1: e1!, e2: e2! };
  }

  test("(i) caso feliz: forma un abanico con las dos ramas y operador XOR", () => {
    const { a, e1, e2 } = autorConRamas();
    const abanicoId = a.abanico("sd0", [e1, e2], "XOR");
    const abanico = a.modelo.abanicos?.[abanicoId];
    expect(abanico).toBeDefined();
    expect(abanico!.operador).toBe("XOR");
    expect(abanico!.enlaceIds.sort()).toEqual([e1, e2].sort());
    expect(abanico!.opdId).toBe("opd-sd0");
  });

  test("(i') operador O por defecto", () => {
    const { a, e1, e2 } = autorConRamas();
    const abanicoId = a.abanico("sd0", [e1, e2]);
    expect(a.modelo.abanicos?.[abanicoId]?.operador).toBe("O");
  });

  test("(ii) caso de error: el kernel rechaza un abanico con <2 enlaces", () => {
    const { a, e1 } = autorConRamas();
    expect(() => a.abanico("sd0", [e1], "XOR")).toThrow(/Abanico ilegal.*al menos dos enlaces/);
  });

  test("(ii') caso de error: enlace inexistente", () => {
    const { a, e1 } = autorConRamas();
    expect(() => a.abanico("sd0", [e1, "e-inexistente"], "XOR")).toThrow(/enlace inexistente/);
  });

  test("(iii) round-trip OPL: el forward verbaliza el cuantificador XOR", () => {
    const { a, e1, e2 } = autorConRamas();
    a.abanico("sd0", [e1, e2], "XOR");
    const opl = generarOpl(a.modelo);
    expect(opl).toContain("*Decidir* invoca exactamente uno de *Ruta A* y *Ruta B*.");
  });

  test("(iii') round-trip OPL: operador O verbaliza 'al menos uno de'", () => {
    const { a, e1, e2 } = autorConRamas();
    a.abanico("sd0", [e1, e2], "O");
    const opl = generarOpl(a.modelo);
    expect(opl).toContain("*Decidir* invoca al menos uno de *Ruta A* y *Ruta B*.");
  });
});

// ─── #31 — Multiplicidad de origen ─────────────────────────────────────────────
describe("W4.1 — multiplicidadOrigen (espejo de multiplicidadDestino)", () => {
  function autorConsumo() {
    const a = crearAutor({ id: "mo", nombre: "Mult" });
    a.opd("sd0", "SD0", null);
    a.entidad("ped", "objeto", "Pedido", "fisica", "sistemica");
    a.entidad("desp", "proceso", "Despachar", "fisica", "sistemica");
    a.ver("sd0", "ped", 0, 0);
    a.ver("sd0", "desp", 200, 0);
    return a;
  }

  test("(i) caso feliz: escribe multiplicidadOrigen en el enlace", () => {
    const a = autorConsumo();
    const id = a.enlazar("sd0", "ped", "desp", "consumo", { multiplicidadOrigen: "2" });
    expect(a.modelo.enlaces[id!]!.multiplicidadOrigen).toBe("2");
  });

  test("(ii) no rompe la firma del kernel: consumo proceso→objeto sigue ilegal con multiplicidad", () => {
    const a = autorConsumo();
    // La multiplicidad de origen no afecta la validación de firma (sigue exigiendo objeto→proceso).
    expect(() => a.enlazar("sd0", "desp", "ped", "consumo", { multiplicidadOrigen: "2" })).toThrow(
      /Firma de enlace ilegal/,
    );
  });

  test("(iii) round-trip OPL: el forward emite el prefijo numérico de origen", () => {
    const a = autorConsumo();
    a.enlazar("sd0", "ped", "desp", "consumo", { multiplicidadOrigen: "2" });
    const opl = generarOpl(a.modelo);
    expect(opl).toContain("*Despachar* consume 2 **Pedidos**.");
  });
});

// ─── #21 — Demora de invocación (definirDemora) ────────────────────────────────
describe("W4.1 — demora de invocación (delega a definirDemora)", () => {
  function autorInvocacion() {
    const a = crearAutor({ id: "dm", nombre: "Demora" });
    a.opd("sd0", "SD0", null);
    a.entidad("p1", "proceso", "Disparar", "fisica", "sistemica");
    a.entidad("p2", "proceso", "Recibir", "fisica", "sistemica");
    a.ver("sd0", "p1", 0, 0);
    a.ver("sd0", "p2", 200, 0);
    return a;
  }

  test("(i) caso feliz: escribe demora en el enlace de invocación", () => {
    const a = autorInvocacion();
    const id = a.enlazar("sd0", "p1", "p2", "invocacion", { demora: "3s" });
    expect(a.modelo.enlaces[id!]!.demora).toBe("3s");
  });

  test("(ii) caso de error: el kernel rechaza demora sobre un enlace no-invocación", () => {
    const a = crearAutor({ id: "dm2", nombre: "Demora2" });
    a.opd("sd0", "SD0", null);
    a.entidad("o", "objeto", "Insumo", "fisica", "sistemica");
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.ver("sd0", "o", 0, 0);
    a.ver("sd0", "p", 200, 0);
    // consumo objeto→proceso es legal de firma, pero la demora solo aplica a invocación.
    expect(() => a.enlazar("sd0", "o", "p", "consumo", { demora: "3s" })).toThrow(
      /Demora ilegal.*solo aplica a enlaces de invocacion/,
    );
  });

  test("(iii) round-trip OPL: el forward verbaliza 'después de Ns'", () => {
    const a = autorInvocacion();
    a.enlazar("sd0", "p1", "p2", "invocacion", { demora: "3s" });
    const opl = generarOpl(a.modelo);
    expect(opl).toContain("*Disparar* invoca *Recibir* después de 3s.");
  });
});

// ─── #22 — Autoinvocación (crearAutoInvocacion) ────────────────────────────────
describe("W4.1 — autoinvocación (delega a crearAutoInvocacion)", () => {
  function autorProceso() {
    const a = crearAutor({ id: "ai", nombre: "Auto" });
    a.opd("sd0", "SD0", null);
    a.entidad("p", "proceso", "Reintentar", "fisica", "sistemica");
    a.ver("sd0", "p", 0, 0);
    return a;
  }

  test("(i) caso feliz: crea un self-link de invocación con demora", () => {
    const a = autorProceso();
    const id = a.autoinvocacion("sd0", "p", "5s");
    const enlace = a.modelo.enlaces[id]!;
    expect(enlace.tipo).toBe("invocacion");
    expect(enlace.origenId).toEqual(enlace.destinoId);
    expect(enlace.demora).toBe("5s");
  });

  test("(i') demora por defecto del kernel cuando se omite", () => {
    const a = autorProceso();
    const id = a.autoinvocacion("sd0", "p");
    expect(a.modelo.enlaces[id]!.demora).toBe("1s");
  });

  test("(ii) caso de error: el kernel rechaza autoinvocación sobre un objeto", () => {
    const a = crearAutor({ id: "ai2", nombre: "Auto2" });
    a.opd("sd0", "SD0", null);
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    a.ver("sd0", "o", 0, 0);
    expect(() => a.autoinvocacion("sd0", "o")).toThrow(/Auto-invocación ilegal.*requiere un proceso/);
  });

  test("(ii') caso de error: el kernel rechaza si el proceso no tiene apariencia en el OPD", () => {
    const a = crearAutor({ id: "ai3", nombre: "Auto3" });
    a.opd("sd0", "SD0", null);
    a.entidad("p", "proceso", "Sin Aparicion", "fisica", "sistemica");
    // sin a.ver(...)
    expect(() => a.autoinvocacion("sd0", "p")).toThrow(/requiere que el proceso tenga apariencia/);
  });

  test("(iii) round-trip OPL: el forward verbaliza 'se invoca a sí mismo después de Ns'", () => {
    const a = autorProceso();
    a.autoinvocacion("sd0", "p", "5s");
    const opl = generarOpl(a.modelo);
    expect(opl).toContain("*Reintentar* se invoca a sí mismo después de 5s.");
  });
});

// ─── #19 — Modificador "no" (negación) ─────────────────────────────────────────
describe("W4.1 — modificador 'no' (subtipo mapeado)", () => {
  function autorAgente() {
    const a = crearAutor({ id: "no", nombre: "No" });
    a.opd("sd0", "SD0", null);
    a.entidad("o", "objeto", "Lápiz", "fisica", "sistemica");
    a.entidad("pr", "proceso", "Escribir", "fisica", "sistemica");
    a.ver("sd0", "o", 0, 0);
    a.ver("sd0", "pr", 200, 0);
    return a;
  }

  test("(i) caso feliz: el enlace lleva modificador 'no' Y subtipo 'no'", () => {
    const a = autorAgente();
    const id = a.enlazar("sd0", "o", "pr", "agente", { modificador: "no" });
    const enlace = a.modelo.enlaces[id!]!;
    expect(enlace.modificador).toBe("no");
    // Regresión guardada: antes el subtipo solo se mapeaba para evento/condición; "no" caía a undefined.
    expect(enlace.subtipoModificador).toBe("no");
  });

  test("(i') control de no-tautología: evento/condición conservan su subtipo E/C", () => {
    const a = autorAgente();
    const ev = a.enlazar("sd0", "o", "pr", "agente", { modificador: "evento" });
    expect(a.modelo.enlaces[ev!]!.subtipoModificador).toBe("E");
  });

  test("(iii) round-trip OPL: el forward verbaliza la negación", () => {
    const a = autorAgente();
    a.enlazar("sd0", "o", "pr", "agente", { modificador: "no" });
    const opl = generarOpl(a.modelo);
    expect(opl).toContain("**Lápiz** no maneja *Escribir*.");
  });
});

// ─── #5 — Designaciones default/current ────────────────────────────────────────
describe("W4.1 — designaciones default/current (espejo de inicial/final)", () => {
  function autorConEstados() {
    const a = crearAutor({ id: "de", nombre: "Desig" });
    a.opd("sd0", "SD0", null);
    a.entidad("obj", "objeto", "Pedido", "fisica", "sistemica");
    a.estados("obj", ["nuevo", "pagado", "cerrado"], "nuevo", "cerrado");
    a.ver("sd0", "obj", 0, 0);
    return a;
  }

  test("(i) caso feliz: escribe la designación en el estado", () => {
    const a = autorConEstados();
    a.designarEstado("obj", "pagado", "default");
    a.designarEstado("obj", "cerrado", "current");
    const idPagado = a.idEstado("obj", "pagado");
    const idCerrado = a.idEstado("obj", "cerrado");
    expect(a.modelo.estados[idPagado]!.designaciones).toContain("default");
    expect(a.modelo.estados[idCerrado]!.designaciones).toContain("current");
    // No duplica si se aplica dos veces (idempotente).
    a.designarEstado("obj", "pagado", "default");
    expect(a.modelo.estados[idPagado]!.designaciones).toEqual(["default"]);
  });

  test("(ii) caso de error: designar un estado no declarado lanza", () => {
    const a = autorConEstados();
    expect(() => a.designarEstado("obj", "inexistente", "default")).toThrow(/Estado no registrado/);
  });

  test("(iii) round-trip OPL: el forward verbaliza 'es Default' / 'es Current'", () => {
    const a = autorConEstados();
    a.designarEstado("obj", "pagado", "default");
    a.designarEstado("obj", "cerrado", "current");
    const opl = generarOpl(a.modelo);
    expect(opl).toContain("Estado `pagado` de **Pedido** es Default.");
    expect(opl).toContain("Estado `cerrado` de **Pedido** es Current.");
  });
});
