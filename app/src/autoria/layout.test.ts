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

  test("ordenInzoom del modelo agrupa paralelos en banda y la secuencia debajo (Fase 1·U2)", () => {
    const a = crearAutor({ id: "ord", nombre: "Orden" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "Evaluar (in-zoom)", "sd0", 10);
    a.entidad("p", "proceso", "Evaluar", "fisica", "sistemica");
    a.refDescomp("p", "inz");
    a.ver("sd0", "p", 0, 0);
    a.ver("inz", "p", 0, 0);
    for (const k of ["sa", "sb", "sc"]) {
      a.entidad(k, "proceso", `Sub ${k}`, "fisica", "sistemica");
      a.ver("inz", k, 0, 0);
      a.enlazar("inz", "p", k, "agregacion");
    }
    // Campo de orden en el modelo: [sa, sb] en paralelo (anticadena), luego sc.
    a.modelo.opds[a.idOpd("inz")]!.ordenInzoom = [[a.id("sa"), a.id("sb")], [a.id("sc")]];

    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    const apOf = (key: string) =>
      Object.values(a.modelo.opds[a.idOpd("inz")]!.apariencias).find((ap) => ap.entidadId === a.id(key))!;
    expect(apOf("sa").y).toBe(apOf("sb").y); // misma banda (paralelo)
    expect(apOf("sc").y).toBeGreaterThan(apOf("sa").y); // banda siguiente (secuencia)
    expect(solapesReales(a.modelo)).toBe(0);
  });

  test("in-zoom con banda ancha: envuelve subprocesos preservando lectura izquierda→derecha arriba→abajo", () => {
    const a = crearAutor({ id: "wrap", nombre: "Wrap" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "Proceso ancho (in-zoom)", "sd0", 10);
    a.entidad("p", "proceso", "Proceso ancho", "fisica", "sistemica");
    a.refDescomp("p", "inz");
    a.ver("sd0", "p", 0, 0);
    a.ver("inz", "p", 0, 0);
    for (let i = 0; i < 9; i += 1) {
      const key = `s${i}`;
      a.entidad(key, "proceso", `Subproceso ${i + 1}`, "fisica", "sistemica");
      a.ver("inz", key, 0, 0);
      a.enlazar("inz", "p", key, "agregacion");
    }

    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    expect(solapesReales(a.modelo)).toBe(0);
    const opd = a.modelo.opds[a.idOpd("inz")]!;
    const subs = Object.values(opd.apariencias)
      .filter((ap) => ap.entidadId !== a.id("p"))
      .sort((a1, b1) => a1.y - b1.y || a1.x - b1.x);
    const filas = new Set(subs.map((ap) => ap.y));
    expect(filas.size).toBeGreaterThan(1);
    expect(subs.map((ap) => a.modelo.entidades[ap.entidadId]!.nombre)).toEqual(
      Array.from({ length: 9 }, (_, index) => `Subproceso ${index + 1}`),
    );
  });

  test("in-zoom con banda pequeña: no envuelve solo por nombres largos", () => {
    const a = crearAutor({ id: "nowrap", nombre: "No Wrap" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "Proceso con banda legible (in-zoom)", "sd0", 10);
    a.entidad("p", "proceso", "Proceso con banda legible", "fisica", "sistemica");
    a.refDescomp("p", "inz");
    a.ver("sd0", "p", 0, 0);
    a.ver("inz", "p", 0, 0);
    for (let i = 0; i < 5; i += 1) {
      const key = `s${i}`;
      a.entidad(key, "proceso", `Subproceso operacional con nombre largo ${i + 1}`, "fisica", "sistemica");
      a.ver("inz", key, 0, 0);
      a.enlazar("inz", "p", key, "agregacion");
    }

    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    expect(solapesReales(a.modelo)).toBe(0);
    const opd = a.modelo.opds[a.idOpd("inz")]!;
    const filas = new Set(
      Object.values(opd.apariencias)
        .filter((ap) => ap.entidadId !== a.id("p"))
        .map((ap) => ap.y),
    );
    expect(filas.size).toBe(1);
  });

  test("externos estructuralmente vinculados quedan próximos dentro de su zona de rol", () => {
    const a = crearAutor({ id: "prox", nombre: "Proximidad" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "P (in-zoom)", "sd0", 10);
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.entidad("reg", "objeto", "Registro clinico", "informacional", "sistemica");
    a.entidad("asi", "objeto", "Asiento clinico", "informacional", "sistemica");
    a.refDescomp("p", "inz");
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "reg", 0, 0);
    a.ver("sd0", "asi", 0, 0);
    a.enlazar("sd0", "reg", "p", "consumo");
    a.enlazar("sd0", "asi", "p", "consumo");
    a.ver("inz", "p", 0, 0);
    a.ver("inz", "reg", 0, 0);
    a.ver("inz", "asi", 0, 0);
    for (let i = 0; i < 4; i += 1) {
      const key = `s${i}`;
      a.entidad(key, "proceso", `Sub ${i + 1}`, "fisica", "sistemica");
      a.ver("inz", key, 0, 0);
      a.enlazar("inz", "p", key, "agregacion");
      if (i > 0) a.enlazar("inz", `s${i - 1}`, key, "invocacion");
    }
    a.enlazar("inz", "reg", "s0", "consumo");
    a.enlazar("inz", "asi", "s3", "consumo");
    a.enlazar("inz", "reg", "asi", "agregacion");

    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    expect(solapesReales(a.modelo)).toBe(0);
    const opd = a.modelo.opds[a.idOpd("inz")]!;
    const reg = Object.values(opd.apariencias).find((ap) => ap.entidadId === a.id("reg"))!;
    const asi = Object.values(opd.apariencias).find((ap) => ap.entidadId === a.id("asi"))!;
    expect(Math.abs(reg.y - asi.y)).toBeLessThanOrEqual(150);
  });

  test("externos laterales densos se distribuyen en columnas sin inflar el contorno", () => {
    const a = crearAutor({ id: "cols", nombre: "Columnas" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "P (in-zoom)", "sd0", 10);
    a.entidad("p", "proceso", "Procesar", "fisica", "sistemica");
    a.refDescomp("p", "inz");
    a.ver("sd0", "p", 0, 0);
    a.ver("inz", "p", 0, 0);
    for (let i = 0; i < 9; i += 1) {
      const key = `s${i}`;
      a.entidad(key, "proceso", `Sub ${i + 1}`, "fisica", "sistemica");
      a.ver("inz", key, 0, 0);
      a.enlazar("inz", "p", key, "agregacion");
    }
    for (let i = 0; i < 16; i += 1) {
      const key = `e${i}`;
      a.entidad(key, "objeto", `Entrada externa ${i + 1}`, "informacional", "sistemica");
      a.ver("sd0", key, 0, 0);
      a.ver("inz", key, 0, 0);
      a.enlazar("sd0", key, "p", "consumo");
      a.enlazar("inz", key, `s${Math.min(i, 8)}`, "consumo");
    }

    aplicarLayoutCompleto(a.modelo, a.internosInzoom);

    expect(solapesReales(a.modelo)).toBe(0);
    const opd = a.modelo.opds[a.idOpd("inz")]!;
    const contorno = Object.values(opd.apariencias).find((ap) => ap.entidadId === a.id("p"))!;
    const externos = Object.values(opd.apariencias).filter((ap) => ap.entidadId !== a.id("p") && ap.x < contorno.x);
    const columnas = new Set(externos.map((ap) => Math.round(ap.x + ap.width)));
    expect(columnas.size).toBeGreaterThan(1);
    expect(contorno.height).toBeLessThan(900);
  });

  // V16-5 (validación visual HODOM v1.6, U4): en unfolds multi-fila, el drop vertical
  // del bus (x = centro de cada caja) atravesaba las cajas de la fila superior.
  test("unfold multi-fila: el centro de cada caja de filas 2+ cae en un hueco de la fila superior", () => {
    const a = crearAutor({ id: "mf", nombre: "Multifila" });
    a.opd("sd0", "SD0", null);
    a.opd("desp", "Doc (unfold)", "sd0", 10);
    a.entidad("hacer", "proceso", "Hacer", "fisica", "sistemica");
    a.entidad("doc", "objeto", "Documento maestro", "informacional", "sistemica");
    a.ver("sd0", "hacer", 0, 0);
    a.ver("sd0", "doc", 0, 0);
    a.enlazar("sd0", "hacer", "doc", "resultado");
    a.refDespliegue("doc", "desp");
    a.ver("desp", "doc", 0, 0);
    // 14 partes con nombres variados → varias filas con wrap a 2200
    for (let i = 0; i < 14; i++) {
      const key = `p${i}`;
      a.entidad(key, "objeto", `Parte documental número ${i} del episodio`, "informacional", "sistemica");
      a.ver("desp", key, 0, 0);
      a.enlazar("desp", "doc", key, "agregacion");
    }
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    expect(solapesReales(a.modelo)).toBe(0);
    const desp = a.modelo.opds[a.idOpd("desp")]!;
    const partes = Object.values(desp.apariencias).filter((ap) => ap.entidadId !== a.id("doc"));
    // filas por banda Y
    const porY = new Map<number, typeof partes>();
    for (const p of partes) {
      const fila = porY.get(p.y) ?? [];
      fila.push(p);
      porY.set(p.y, fila);
    }
    const ys = [...porY.keys()].sort((m, n) => m - n);
    expect(ys.length).toBeGreaterThan(1); // el escenario realmente produce multi-fila
    for (let i = 1; i < ys.length; i++) {
      const sup = porY.get(ys[i - 1]!)!;
      const inf = porY.get(ys[i]!)!;
      for (const caja of inf) {
        const cx = caja.x + caja.width / 2;
        const invade = sup.some((s) => cx > s.x - 14 && cx < s.x + s.width + 14);
        expect(invade).toBe(false);
      }
    }
  });

  test("determinista: dos corridas del layout dan posiciones idénticas", () => {
    const a1 = modeloUnfold();
    const a2 = modeloUnfold();
    aplicarLayoutCompleto(a1.modelo, a1.internosInzoom);
    aplicarLayoutCompleto(a2.modelo, a2.internosInzoom);
    expect(posiciones(a1.modelo)).toEqual(posiciones(a2.modelo));
  });
});

// ── Auditoría SSOT 2026-06-11 (spec-forja-opd-es §10/§11) ────────────────────
// A-1: objetos internos pegados al contenido real (no al cursor inflado).
// N-3: contención ELÍPTICA (el render inscribe la elipse en el bbox).
// A-2: externos enlazados estructuralmente clusterizan en el mismo lado.
// N-1: raíz plana sin oclusión (R-OPD-LAY-1 "no debe haber oclusión").
// N-2: in-zoom de OBJETO también es contenedor (R-OPD-REF-1 "rectángulo").
describe("auditoría layout SSOT — remediaciones", () => {
  function esquinasDentroDeElipse(contorno: Apariencia, a: Apariencia, epsilon = 0.02): boolean {
    const cx = contorno.x + contorno.width / 2;
    const cy = contorno.y + contorno.height / 2;
    const rx = contorno.width / 2;
    const ry = contorno.height / 2;
    const esquinas = [
      [a.x, a.y], [a.x + a.width, a.y], [a.x, a.y + a.height], [a.x + a.width, a.y + a.height],
    ] as const;
    return esquinas.every(([px, py]) => ((px - cx) / rx) ** 2 + ((py - cy) / ry) ** 2 <= 1 + epsilon);
  }

  /** In-zoom con banda ancha que envuelve (8 subs) + objetos internos. */
  function modeloWrap() {
    const a = crearAutor({ id: "w", nombre: "Wrap" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "P (in-zoom)", "sd0", 10);
    a.entidad("p", "proceso", "Operar planta", "fisica", "sistemica");
    a.refDescomp("p", "inz");
    a.ver("sd0", "p", 0, 0);
    a.ver("inz", "p", 0, 0);
    const subs = [
      "Preparar la línea de producción", "Calibrar instrumentos de medición",
      "Cargar materias primas certificadas", "Ejecutar el ciclo de transformación",
      "Inspeccionar la calidad del lote", "Empacar unidades terminadas",
      "Etiquetar para distribución", "Despachar al centro logístico",
    ];
    subs.forEach((nombre, i) => {
      a.entidad(`s${i}`, "proceso", nombre, "fisica", "sistemica");
      a.ver("inz", `s${i}`, 0, 0);
      a.enlazar("inz", "p", `s${i}`, "agregacion");
    });
    const objetos = [["reg", "Registro de turno"], ["bit", "Bitácora"], ["par", "Parte diario"], ["act", "Acta de lote"]] as const;
    objetos.forEach(([k, n], i) => {
      a.entidad(k, "objeto", n, "informacional", "sistemica");
      a.ver("inz", k, 0, 0);
      a.enlazar("inz", `s${i + 2}`, k, "resultado");
    });
    return a;
  }

  test("A-1: los objetos internos quedan a GAP_OBJ del fondo REAL de los subprocesos", () => {
    const a = modeloWrap();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    const opd = Object.values(a.modelo.opds).find((o) => o.padreId)!;
    const apDe = (nombre: string) => {
      const ent = Object.values(a.modelo.entidades).find((e) => e.nombre === nombre)!;
      return Object.values(opd.apariencias).find((ap) => ap.entidadId === ent.id)!;
    };
    const subsBottom = Math.max(...["Preparar la línea de producción", "Despachar al centro logístico",
      "Ejecutar el ciclo de transformación", "Empacar unidades terminadas"].map((n) => apDe(n).y + apDe(n).height));
    const objsTop = Math.min(...["Registro de turno", "Bitácora", "Parte diario", "Acta de lote"].map((n) => apDe(n).y));
    // Los objetos cuelgan del fondo real de los subs (antes: del cursor
    // acumulado ROWH + wrap fantasma, ~180px de aire muerto — "contorno >
    // contenido", caso SD0-P de hd-opm).
    expect(objsTop).toBeGreaterThan(subsBottom);
    expect(objsTop - subsBottom).toBeLessThanOrEqual(70);
  });

  test("N-4: fila-abajo alinea cada objeto bajo su subproceso ancla (mitiga diagonales largas)", () => {
    const a = modeloWrap();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    const opd = Object.values(a.modelo.opds).find((o) => o.padreId)!;
    const entPorNombre = (nombre: string) => Object.values(a.modelo.entidades).find((e) => e.nombre === nombre)!;
    const apDe = (nombre: string) => Object.values(opd.apariencias).find((ap) => ap.entidadId === entPorNombre(nombre).id)!;
    const pares: Array<[string, string]> = [
      ["Registro de turno", "Cargar materias primas certificadas"],
      ["Bitácora", "Ejecutar el ciclo de transformación"],
      ["Parte diario", "Inspeccionar la calidad del lote"],
      ["Acta de lote", "Empacar unidades terminadas"],
    ];
    for (const [obj, sub] of pares) {
      // El objeto arranca al menos en la x de su ancla (el cursor solo empuja a la derecha).
      expect(apDe(obj).x + 1).toBeGreaterThanOrEqual(apDe(sub).x);
    }
  });

  test("N-3: TODAS las esquinas de los internos caen dentro de la CURVA de la elipse", () => {
    const a = modeloWrap();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    const opd = Object.values(a.modelo.opds).find((o) => o.padreId)!;
    const contornoEnt = Object.values(a.modelo.entidades).find((e) => e.nombre === "Operar planta")!;
    const contorno = Object.values(opd.apariencias).find((ap) => ap.entidadId === contornoEnt.id)!;
    for (const ap of Object.values(opd.apariencias)) {
      if (ap.id === contorno.id) continue;
      if (ap.contextoRefinamiento?.rol === "externo") continue;
      expect(esquinasDentroDeElipse(contorno, ap)).toBe(true);
    }
  });

  /** In-zoom secuencial con externos de roles opuestos enlazados estructuralmente. */
  function modeloClusterExternos() {
    const a = crearAutor({ id: "x", nombre: "Cluster" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "P (in-zoom)", "sd0", 10);
    a.entidad("p", "proceso", "Atender", "fisica", "sistemica");
    a.entidad("s1", "proceso", "Evaluar", "fisica", "sistemica");
    a.entidad("s2", "proceso", "Resolver", "fisica", "sistemica");
    a.entidad("reg", "objeto", "Registro clínico", "informacional", "ambiental");
    a.entidad("asi", "objeto", "Asiento evolutivo", "informacional", "ambiental");
    a.refDescomp("p", "inz");
    a.ver("sd0", "p", 0, 0);
    a.ver("inz", "p", 0, 0);
    for (const k of ["s1", "s2", "reg", "asi"]) a.ver("inz", k, 0, 0);
    a.enlazar("inz", "p", "s1", "agregacion");
    a.enlazar("inz", "p", "s2", "agregacion");
    a.enlazar("inz", "s1", "s2", "invocacion"); // secuencial
    a.enlazar("inz", "reg", "s1", "consumo");   // entrada → left
    a.enlazar("inz", "s2", "asi", "resultado"); // salida → right
    a.enlazar("inz", "reg", "asi", "exhibicion"); // estructural externo↔externo
    return a;
  }

  test("A-2: externos enlazados estructuralmente quedan en el MISMO lado y adyacentes", () => {
    const a = modeloClusterExternos();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    const opd = Object.values(a.modelo.opds).find((o) => o.padreId)!;
    const apDe = (nombre: string) => {
      const ent = Object.values(a.modelo.entidades).find((e) => e.nombre === nombre)!;
      return Object.values(opd.apariencias).find((ap) => ap.entidadId === ent.id)!;
    };
    const contornoEnt = Object.values(a.modelo.entidades).find((e) => e.nombre === "Atender")!;
    const contorno = Object.values(opd.apariencias).find((ap) => ap.entidadId === contornoEnt.id)!;
    const reg = apDe("Registro clínico");
    const asi = apDe("Asiento evolutivo");
    const lado = (ap: Apariencia) => (ap.x + ap.width / 2 < contorno.x + contorno.width / 2 ? "left" : "right");
    expect(lado(reg)).toBe(lado(asi));
    // Adyacentes verticalmente (misma columna, separación de estante normal).
    expect(Math.abs(reg.y - asi.y)).toBeLessThanOrEqual(reg.height + asi.height + 96);
  });

  /** Raíz plana con fila top ancha + columna izquierda alta (riesgo de esquina). */
  function modeloPlanoDenso() {
    const a = crearAutor({ id: "d", nombre: "Denso" });
    a.opd("sd0", "SD0", null);
    a.entidad("p", "proceso", "Coordinar", "fisica", "sistemica");
    a.ver("sd0", "p", 0, 0);
    const agentes = [
      "Equipo de coordinación territorial de la red asistencial",
      "Departamento de gestión de operaciones intrahospitalarias",
      "Unidad de monitoreo continuo de pacientes en domicilio",
    ];
    agentes.forEach((nombre, i) => {
      a.entidad(`ag${i}`, "objeto", nombre, "fisica", "ambiental");
      a.ver("sd0", `ag${i}`, 0, 0);
      a.enlazar("sd0", `ag${i}`, "p", "agente");
    });
    for (let i = 0; i < 6; i++) {
      a.entidad(`in${i}`, "objeto", `Insumo ${i}`, "fisica", "ambiental");
      a.ver("sd0", `in${i}`, 0, 0);
      a.enlazar("sd0", `in${i}`, "p", "consumo");
    }
    return a;
  }

  test("N-1: raíz plana densa NO produce oclusión entre cosas (R-OPD-LAY-1)", () => {
    const a = modeloPlanoDenso();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    expect(solapesReales(a.modelo)).toBe(0);
  });

  /** In-zoom de OBJETO: el rectángulo contenedor también contiene (R-OPD-REF-1). */
  function modeloObjetoInzoom() {
    const a = crearAutor({ id: "o", nombre: "ObjInzoom" });
    a.opd("sd0", "SD0", null);
    a.opd("inz", "Equipo (in-zoom)", "sd0", 10);
    a.entidad("eq", "objeto", "Equipo HODOM", "fisica", "sistemica");
    a.entidad("c1", "objeto", "Médico tratante", "fisica", "sistemica");
    a.entidad("c2", "objeto", "Enfermera de cabecera", "fisica", "sistemica");
    a.refDescomp("eq", "inz");
    a.ver("sd0", "eq", 0, 0);
    a.ver("inz", "eq", 0, 0);
    a.ver("inz", "c1", 0, 0);
    a.ver("inz", "c2", 0, 0);
    a.enlazar("inz", "eq", "c1", "agregacion");
    a.enlazar("inz", "eq", "c2", "agregacion");
    return a;
  }

  test("N-2: in-zoom de objeto contiene a sus componentes en el contenedor", () => {
    const a = modeloObjetoInzoom();
    aplicarLayoutCompleto(a.modelo, a.internosInzoom);
    const opd = Object.values(a.modelo.opds).find((o) => o.padreId)!;
    const contornoEnt = Object.values(a.modelo.entidades).find((e) => e.nombre === "Equipo HODOM")!;
    const contorno = Object.values(opd.apariencias).find((ap) => ap.entidadId === contornoEnt.id)!;
    for (const nombre of ["Médico tratante", "Enfermera de cabecera"]) {
      const ent = Object.values(a.modelo.entidades).find((e) => e.nombre === nombre)!;
      const ap = Object.values(opd.apariencias).find((x) => x.entidadId === ent.id)!;
      expect(contiene(contorno, ap)).toBe(true);
    }
  });
});
