import { describe, expect, test } from "bun:test";
import { crearAutor } from "../autoria/dsl";
import { aplicarLayoutCompleto } from "../autoria/layout";
import { clasificarContencion, clasificarContencionOpd } from "../autoria/contencion";
import { construirCafetera } from "../autoria/_fixtures/cafetera";
import { contenedorRefinamiento } from "../modelo/layout";
import type { Apariencia, Modelo } from "../modelo/tipos";

/**
 * LEY L7 — contención de refinamiento (in-zoom).
 *
 * Para todo modelo con OPD con contorno (in-zoom), la geometría deja a cada INTERNO dentro del
 * bbox del contorno y a cada EXTERNO fuera. Formalmente, para cada OPD con contorno:
 *   ∀ interno.  caja(interno)  ⊆ bbox(contorno)      → `internosFuera`  = ∅
 *   ∀ externo. ¬(caja(externo) ⊆ bbox(contorno))     → `externosDentro` = ∅
 *
 * El predicado es `clasificarContencionOpd` (generalización del núcleo geométrico de
 * `verificarContencion` de `autoria/bundle.ts`, reusado sin cambiar el comportamiento del bundle).
 *
 * Control de NO-TAUTOLOGÍA: el último test construye un modelo MAL a propósito (un interno movido
 * fuera del contorno) y exige que la ley FALLE. Sin ese caso, los tests positivos podrían pasar
 * trivialmente aunque el predicado fuera siempre-verde.
 */

function internoFueraDe(c: { internosFuera: Apariencia[] }): number {
  return c.internosFuera.length;
}
function externoDentroDe(c: { externosDentro: Apariencia[] }): number {
  return c.externosDentro.length;
}

/** Cuenta cuántos OPDs del modelo tienen contorno (in-zoom). */
function opdsConContorno(modelo: Modelo): number {
  return Object.values(modelo.opds).filter((opd) => contenedorRefinamiento(modelo, opd.id)).length;
}

describe("LEY L7: contención de refinamiento (in-zoom)", () => {
  test("law-contencion-cafetera: in-zoom con layout canónico cumple internos-dentro / externos-fuera", () => {
    const a = construirCafetera();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    const clasificacion = clasificarContencion(a.modelo);
    // La cafetera tiene exactamente 1 in-zoom (Hacer café). El modelo realmente lo ejercita.
    expect(clasificacion.length).toBeGreaterThanOrEqual(1);
    expect(clasificacion.length).toBe(opdsConContorno(a.modelo));

    for (const c of clasificacion) {
      // hay contenido real que clasificar (no es un in-zoom vacío que pasaría trivialmente)
      expect(c.internas.length).toBeGreaterThan(0);
      expect(internoFueraDe(c)).toBe(0);
      expect(externoDentroDe(c)).toBe(0);
    }
  });

  test("law-contencion-multiples-inzoom: in-zoom anidado (proceso→sub→sub-sub) cumple en cada nivel", () => {
    const a = crearAutor({ id: "l7", nombre: "L7 anidado" });
    a.opd("sd0", "SD0", null, 0);
    a.opd("inzP", "P (in-zoom)", "sd0", 10);
    a.opd("inzSb", "Sub B (in-zoom)", "inzP", 20);
    a.entidad("p", "proceso", "P", "fisica", "sistemica");
    a.entidad("sa", "proceso", "Sub A", "fisica", "sistemica");
    a.entidad("sb", "proceso", "Sub B", "fisica", "sistemica");
    a.entidad("sb1", "proceso", "Sub B uno", "fisica", "sistemica");
    a.entidad("sb2", "proceso", "Sub B dos", "fisica", "sistemica");
    a.entidad("ent", "objeto", "Entrada", "fisica", "ambiental");
    a.refDescomp("p", "inzP");
    a.refDescomp("sb", "inzSb");
    // SD raíz
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "ent", 0, 0);
    a.enlazar("sd0", "ent", "p", "consumo");
    // in-zoom de P
    a.ver("inzP", "p", 0, 0); // contorno
    a.ver("inzP", "sa", 0, 0);
    a.ver("inzP", "sb", 0, 0);
    a.ver("inzP", "ent", 0, 0); // externo (consumido por sa)
    a.enlazar("inzP", "p", "sa", "agregacion");
    a.enlazar("inzP", "p", "sb", "agregacion");
    a.enlazar("inzP", "sa", "sb", "invocacion");
    a.enlazar("inzP", "ent", "sa", "consumo");
    // in-zoom de Sub B
    a.ver("inzSb", "sb", 0, 0); // contorno
    a.ver("inzSb", "sb1", 0, 0);
    a.ver("inzSb", "sb2", 0, 0);
    a.enlazar("inzSb", "sb", "sb1", "agregacion");
    a.enlazar("inzSb", "sb", "sb2", "agregacion");
    a.enlazar("inzSb", "sb1", "sb2", "invocacion");

    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    const clasificacion = clasificarContencion(a.modelo);
    expect(clasificacion.length).toBe(2); // inzP + inzSb
    for (const c of clasificacion) {
      expect(internoFueraDe(c)).toBe(0);
      expect(externoDentroDe(c)).toBe(0);
    }
  });

  test("law-NO-tautologia: un interno movido FUERA del contorno hace FALLAR la ley (control)", () => {
    const a = construirCafetera();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    // Localiza el OPD in-zoom y un interno; lo arrastra lejos del contorno a mano.
    const opdInzoom = Object.values(a.modelo.opds).find((opd) => contenedorRefinamiento(a.modelo, opd.id))!;
    const antes = clasificarContencionOpd(a.modelo, opdInzoom.id)!;
    // Pre-condición del control: ANTES de romper, la ley se cumple (si ya fallara, el test no
    // probaría nada).
    expect(internoFueraDe(antes)).toBe(0);

    const internoVictima = antes.internas[0]!;
    const contorno = contenedorRefinamiento(a.modelo, opdInzoom.id)!;
    // Mueve la víctima MUY a la derecha del contorno: su caja deja de estar contenida.
    const ap = opdInzoom.apariencias[internoVictima.id]!;
    ap.x = contorno.x + contorno.width + 500;
    ap.y = contorno.y + contorno.height + 500;

    const despues = clasificarContencionOpd(a.modelo, opdInzoom.id)!;
    // La ley DEBE detectar el incumplimiento (no es siempre-verde).
    expect(internoFueraDe(despues)).toBeGreaterThan(0);
    expect(despues.internosFuera.some((x) => x.id === internoVictima.id)).toBe(true);
  });

  test("law-NO-tautologia: un externo metido DENTRO del contorno hace FALLAR la ley (control)", () => {
    const a = construirCafetera();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    const opdInzoom = Object.values(a.modelo.opds).find((opd) => contenedorRefinamiento(a.modelo, opd.id))!;
    const antes = clasificarContencionOpd(a.modelo, opdInzoom.id)!;
    expect(externoDentroDe(antes)).toBe(0);
    // Requiere que el escenario realmente tenga externos para mover (si no, el control es vacío).
    expect(antes.externas.length).toBeGreaterThan(0);

    const externoVictima = antes.externas[0]!;
    const contorno = contenedorRefinamiento(a.modelo, opdInzoom.id)!;
    const ap = opdInzoom.apariencias[externoVictima.id]!;
    // Mete el externo bien dentro del bbox del contorno.
    ap.x = contorno.x + 10;
    ap.y = contorno.y + contorno.height / 2;

    const despues = clasificarContencionOpd(a.modelo, opdInzoom.id)!;
    expect(externoDentroDe(despues)).toBeGreaterThan(0);
    expect(despues.externosDentro.some((x) => x.id === externoVictima.id)).toBe(true);
  });
});
