import { describe, expect, test } from "bun:test";
import { crearAutor } from "./dsl";

/**
 * W3.2 — el DSL valida la firma del enlace EN el punto de construcción, componiendo
 * el validador canónico del kernel (`validarFirmaEnlace`). Antes de este cambio una
 * firma ilegal se escribía silenciosamente y solo el diagnóstico de emisión la
 * detectaba (tarde). Ahora `enlazar` lanza temprano, trazable a la línea del autor.
 *
 * Control de no-tautología: el mismo grafo con firma LEGAL no lanza (las dos ramas
 * del validador se ejercitan; no es un test que siempre verde).
 */
describe("autoría DSL — validación de firma sobre el kernel (W3.2)", () => {
  function autorBase() {
    const a = crearAutor({ id: "k", nombre: "Kernel" });
    a.opd("sd0", "SD0", null);
    a.entidad("obj1", "objeto", "Objeto Uno", "fisica", "ambiental");
    a.entidad("obj2", "objeto", "Objeto Dos", "fisica", "sistemica");
    a.entidad("proc", "proceso", "Procesar", "fisica", "sistemica");
    a.ver("sd0", "obj1", 0, 0);
    a.ver("sd0", "obj2", 0, 0);
    a.ver("sd0", "proc", 0, 0);
    return a;
  }

  test("rechaza agente objeto→objeto en el punto de construcción (no en la emisión)", () => {
    const a = autorBase();
    // agente requiere Objeto físico -> Proceso; objeto→objeto es ilegal.
    expect(() => a.enlazar("sd0", "obj1", "obj2", "agente")).toThrow(/Firma de enlace ilegal/);
  });

  test("rechaza consumo proceso→objeto (dirección invertida)", () => {
    const a = autorBase();
    // consumo requiere Objeto -> Proceso; proceso→objeto es ilegal.
    expect(() => a.enlazar("sd0", "proc", "obj1", "consumo")).toThrow(/Firma de enlace ilegal/);
  });

  test("rechaza invocación con extremo objeto (requiere Proceso→Proceso)", () => {
    const a = autorBase();
    expect(() => a.enlazar("sd0", "proc", "obj1", "invocacion")).toThrow(/Firma de enlace ilegal/);
  });

  test("control de no-tautología: la firma LEGAL no lanza y crea el enlace", () => {
    const a = autorBase();
    // agente legal: objeto físico -> proceso.
    expect(() => a.enlazar("sd0", "obj1", "proc", "agente")).not.toThrow();
    // consumo legal: objeto -> proceso.
    expect(() => a.enlazar("sd0", "obj2", "proc", "consumo")).not.toThrow();
    // resultado legal: proceso -> objeto.
    expect(() => a.enlazar("sd0", "proc", "obj1", "resultado")).not.toThrow();
    expect(Object.keys(a.modelo.enlaces).length).toBe(3);
  });

  test("el mensaje de error nombra el OPD y los extremos para trazar la línea del autor", () => {
    const a = autorBase();
    expect(() => a.enlazar("sd0", "obj1", "obj2", "agente")).toThrow(
      /OPD 'sd0'.*Objeto Uno agente Objeto Dos/,
    );
  });
});
