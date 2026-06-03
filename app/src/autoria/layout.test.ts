import { describe, expect, test } from "bun:test";
import { crearAutor } from "./dsl";
import { aplicarLayoutCompleto } from "./layout";
import type { Apariencia, Modelo } from "../modelo/tipos";

/**
 * Cobertura directa del motor de layout (`aplicarLayoutCompleto`). El test de bundle
 * de `autoria.test.ts` solo ejercita la cafetera (in-zoom + raíz-plana). Aquí se cubren
 * las ramas faltantes: UNFOLD (despliegue de objeto) y la detección de ciclos en la
 * topología de invocación, más el determinismo del layout.
 */

function contiene(a: Apariencia, b: Apariencia): boolean {
  return a.x <= b.x && a.y <= b.y && a.x + a.width >= b.x + b.width && a.y + a.height >= b.y + b.height;
}
function intersecta(a: Apariencia, b: Apariencia): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
/** Solapes reales (excluyendo contención contorno↔interno). */
function solapesReales(modelo: Modelo): number {
  let solapes = 0;
  for (const opd of Object.values(modelo.opds)) {
    const aps = Object.values(opd.apariencias);
    for (let i = 0; i < aps.length; i += 1) {
      for (let j = i + 1; j < aps.length; j += 1) {
        const a = aps[i]!, b = aps[j]!;
        if (intersecta(a, b) && !contiene(a, b) && !contiene(b, a)) solapes += 1;
      }
    }
  }
  return solapes;
}
function posiciones(modelo: Modelo): Record<string, { x: number; y: number; width: number; height: number }> {
  const out: Record<string, { x: number; y: number; width: number; height: number }> = {};
  for (const opd of Object.values(modelo.opds)) {
    for (const a of Object.values(opd.apariencias)) {
      out[a.id] = { x: a.x, y: a.y, width: a.width, height: a.height };
    }
  }
  return out;
}

/** Objeto "Café" desplegado (agregación) en sus partes → ejercita layoutUnfold. */
function modeloUnfold() {
  const a = crearAutor({ id: "u", nombre: "Unfold" });
  a.opd("sd0", "SD0", null);
  a.opd("desp", "Café (unfold)", "sd0", 10);
  a.entidad("preparar", "proceso", "Preparar", "fisica", "sistemica");
  a.entidad("cafe", "objeto", "Café", "fisica", "sistemica");
  a.entidad("agua", "objeto", "Agua", "fisica", "sistemica");
  a.entidad("grano", "objeto", "Grano molido", "fisica", "sistemica");
  a.entidad("filtro", "objeto", "Filtro de papel", "fisica", "sistemica");
  a.refDespliegue("cafe", "desp");
  a.ver("sd0", "preparar", 0, 0);
  a.ver("sd0", "cafe", 0, 0);
  a.enlazar("sd0", "preparar", "cafe", "resultado");
  a.ver("desp", "cafe", 0, 0);
  a.ver("desp", "agua", 0, 0);
  a.ver("desp", "grano", 0, 0);
  a.ver("desp", "filtro", 0, 0);
  a.enlazar("desp", "cafe", "agua", "agregacion");
  a.enlazar("desp", "cafe", "grano", "agregacion");
  a.enlazar("desp", "cafe", "filtro", "agregacion");
  return a;
}

/** SD plano: un proceso central + objetos por rol, sin refinamiento → ejercita layoutRaizPlana. */
function modeloPlano() {
  const a = crearAutor({ id: "f", nombre: "Plano" });
  a.opd("sd0", "SD0", null);
  a.entidad("entrada", "objeto", "Entrada", "fisica", "sistemica");
  a.entidad("procesar", "proceso", "Procesar", "fisica", "sistemica");
  a.entidad("salida", "objeto", "Salida", "fisica", "sistemica");
  a.entidad("agente", "objeto", "Operador", "fisica", "ambiental");
  a.ver("sd0", "entrada", 0, 0);
  a.ver("sd0", "procesar", 0, 0);
  a.ver("sd0", "salida", 0, 0);
  a.ver("sd0", "agente", 0, 0);
  a.enlazar("sd0", "entrada", "procesar", "consumo");
  a.enlazar("sd0", "procesar", "salida", "resultado");
  a.enlazar("sd0", "agente", "procesar", "agente");
  return a;
}

/** In-zoom con dos subprocesos que se invocan MUTUAMENTE → ejercita detección de ciclos. */
function modeloCicloInvocacion() {
  const a = crearAutor({ id: "c", nombre: "Ciclo" });
  a.opd("sd0", "SD0", null);
  a.opd("inz", "P (in-zoom)", "sd0", 10);
  a.entidad("p", "proceso", "P", "fisica", "sistemica");
  a.entidad("sa", "proceso", "Sub A", "fisica", "sistemica");
  a.entidad("sb", "proceso", "Sub B", "fisica", "sistemica");
  a.refDescomp("p", "inz");
  a.ver("sd0", "p", 0, 0);
  a.ver("inz", "p", 0, 0); // contorno
  a.ver("inz", "sa", 0, 0);
  a.ver("inz", "sb", 0, 0);
  a.enlazar("inz", "p", "sa", "agregacion"); // contención interna
  a.enlazar("inz", "p", "sb", "agregacion");
  a.enlazar("inz", "sa", "sb", "invocacion"); // A → B
  a.enlazar("inz", "sb", "sa", "invocacion"); // B → A (ciclo)
  return a;
}

describe("autoria/layout — cobertura directa del motor", () => {
  test("layoutUnfold (despliegue): coloca refinable + partes sin solapes", () => {
    const a = modeloUnfold();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    expect(solapesReales(a.modelo)).toBe(0);
    // las partes quedan en el OPD de despliegue con geometría asignada (no en 0,0 todas).
    const desp = a.modelo.opds["opd-desp"]!;
    const xs = Object.values(desp.apariencias).map((ap) => ap.x);
    expect(new Set(xs).size).toBeGreaterThan(1); // se distribuyeron, no se apilaron
  });

  test("layoutRaizPlana: el proceso de mayor grado queda central, sin solapes", () => {
    const a = modeloPlano();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    expect(solapesReales(a.modelo)).toBe(0);
    const sd0 = a.modelo.opds["opd-sd0"]!;
    const procesar = Object.values(sd0.apariencias).find((ap) => ap.entidadId === a.id("procesar"))!;
    const otros = Object.values(sd0.apariencias).filter((ap) => ap.entidadId !== a.id("procesar"));
    // el central (proceso de mayor grado) queda rodeado: hay objetos a cada lado.
    expect(otros.some((o) => o.x < procesar.x)).toBe(true);
    expect(otros.some((o) => o.x > procesar.x || o.y < procesar.y || o.y > procesar.y)).toBe(true);
  });

  test("detección de ciclos: invocación mutua no cuelga ni solapa", () => {
    const a = modeloCicloInvocacion();
    // si nivelTopologicoInvocacion no cortara el ciclo, esto colgaría (timeout del runner).
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    expect(solapesReales(a.modelo)).toBe(0);
  });

  test("determinista: dos corridas del layout dan posiciones idénticas", () => {
    const a1 = modeloUnfold();
    const a2 = modeloUnfold();
    aplicarLayoutCompleto(a1.modelo, a1.internosInzoom);
    aplicarLayoutCompleto(a2.modelo, a2.internosInzoom);
    expect(posiciones(a1.modelo)).toEqual(posiciones(a2.modelo));
  });
});
