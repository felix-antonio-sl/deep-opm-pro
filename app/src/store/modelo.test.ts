import { describe, expect, test } from "bun:test";
import { store } from "../store";
import { exportarModelo } from "../serializacion/json";
import type { Apariencia, Id, Modelo } from "../modelo/tipos";

describe("slice modelo", () => {
  test("deshacer y rehacer conservan el historial publico", () => {
    store.getState().nuevoModelo();
    expect(store.getState().puedeDeshacer).toBe(false);

    store.getState().crearObjetoDemo();
    expect(store.getState().puedeDeshacer).toBe(true);
    const conObjeto = Object.keys(store.getState().modelo.entidades).length;

    store.getState().deshacer();
    expect(Object.keys(store.getState().modelo.entidades)).toHaveLength(0);
    expect(store.getState().puedeRehacer).toBe(true);

    store.getState().rehacer();
    expect(Object.keys(store.getState().modelo.entidades)).toHaveLength(conObjeto);
  });

  test("aplicarLayoutSugerido incrementa solicitudFitToken cuando hay cambio (P0-5)", () => {
    // P0-5 (informe UI/UX 2026-05-07): la accion de auto-layout debe gatillar
    // fit-to-view tras reordenar. El canvas observa solicitudFitToken y hace
    // fit; aqui verificamos el contrato del store.
    store.getState().nuevoModelo();
    store.getState().crearObjetoDemo();
    store.getState().crearProcesoDemo();
    const tokenAntes = store.getState().solicitudFitToken;

    store.getState().aplicarLayoutSugerido();
    const tokenDespues = store.getState().solicitudFitToken;

    expect(tokenDespues).toBeGreaterThan(tokenAntes);
  });

  test("aplicarLayoutSugerido NO incrementa solicitudFitToken cuando layout ya esta aplicado", () => {
    store.getState().nuevoModelo();
    store.getState().crearObjetoDemo();
    store.getState().aplicarLayoutSugerido();
    const tokenInicial = store.getState().solicitudFitToken;

    // Aplicar otra vez sobre el mismo modelo no produce cambio: no se hace
    // fit innecesario.
    store.getState().aplicarLayoutSugerido();
    expect(store.getState().solicitudFitToken).toBe(tokenInicial);
  });
});

/**
 * U8.3 — el drag manual de un subproceso interno de un in-zoom DECLARA el orden
 * (sincronización viva canvas→campo). Construye un in-zoom de proceso con tres
 * subprocesos a distintas Y, sin campo previo, y carga el modelo en el store.
 * `subs` = [id, x, y]; el contorno los envuelve.
 */
function inzoomSerializable(subs: Array<[Id, number, number]>): Modelo {
  const opdHijoId = "opd-h";
  const entidades: Modelo["entidades"] = {
    "p-contorno": {
      id: "p-contorno", tipo: "proceso", nombre: "Atender", esencia: "informacional", afiliacion: "sistemica",
      refinamientos: { descomposicion: { opdId: opdHijoId } },
    },
  };
  const apariencias: Record<Id, Apariencia> = {
    "ac-contorno": { id: "ac-contorno", entidadId: "p-contorno", opdId: opdHijoId, x: 0, y: 0, width: 4000, height: 4000 },
    // El contorno también aparece en la raíz (es el proceso refinable visible arriba).
  };
  for (const [id, x, y] of subs) {
    entidades[id] = { id, tipo: "proceso", nombre: `Sub ${id}`, esencia: "informacional", afiliacion: "sistemica" };
    apariencias[`a-${id}`] = { id: `a-${id}`, entidadId: id, opdId: opdHijoId, x, y, width: 135, height: 60 };
  }
  return {
    id: "m", nombre: "U8.3", opdRaizId: "opd-raiz",
    opds: {
      "opd-raiz": {
        id: "opd-raiz", nombre: "SD", padreId: null,
        apariencias: { "ar-contorno": { id: "ar-contorno", entidadId: "p-contorno", opdId: "opd-raiz", x: 100, y: 100, width: 200, height: 100 } },
        enlaces: {},
      },
      [opdHijoId]: { id: opdHijoId, nombre: "SD1", padreId: "opd-raiz", apariencias, enlaces: {} },
    },
    entidades, estados: {}, enlaces: {}, nextSeq: 100,
  };
}

/** Carga el modelo en el store singleton y activa el OPD hijo del in-zoom. */
function cargarInzoom(modelo: Modelo): void {
  store.getState().importarJson(exportarModelo(modelo));
  store.getState().cambiarOpdActivo("opd-h");
}

const ordenDe = (): Id[][] | undefined => store.getState().modelo.opds["opd-h"]?.ordenInzoom;

describe("U8.3 · drag-end de subproceso interno declara el orden (canvas→campo)", () => {
  test("arrastrar un subproceso para cruzar una banda DECLARA el ordenInzoom", () => {
    // a,b,c en una sola banda Y (todo paralelo) → sin orden. Bajamos c y b para
    // formar [[a],[b],[c]]. Tras el drag, el campo refleja la geometría.
    cargarInzoom(inzoomSerializable([["a", 100, 100], ["b", 400, 100], ["c", 700, 100]]));
    expect(ordenDe()).toBeUndefined();

    store.getState().moverAparienciaConPuertos("a-b", 100, 500, []);
    store.getState().moverAparienciaConPuertos("a-c", 100, 900, []);

    expect(ordenDe()).toEqual([["a"], ["b"], ["c"]]);
  });

  test("el move + la derivación del orden se deshacen como UNA transacción de undo", () => {
    // Partimos de paralelo (a,b a la misma Y → sin orden) y separamos: el drag
    // produce DOS efectos (move + campo derivado) que deben revertirse juntos.
    cargarInzoom(inzoomSerializable([["a", 100, 100], ["b", 400, 100]]));
    expect(ordenDe()).toBeUndefined();

    store.getState().moverAparienciaConPuertos("a-b", 100, 600, []);
    expect(ordenDe()).toEqual([["a"], ["b"]]);

    // UN solo undo revierte move + campo juntos: la geometría vuelve y el campo se va.
    store.getState().deshacer();
    expect(ordenDe()).toBeUndefined();
    const apB = Object.values(store.getState().modelo.opds["opd-h"]!.apariencias).find((a) => a.entidadId === "b")!;
    expect(apB.y).toBe(100);
  });

  test("nudge cosmético dentro de tolerancia NO toca el campo (guard de idempotencia D2)", () => {
    // Modelo CON campo declarado [[a],[b]] y geometría consistente. Un nudge de 3px
    // a `b` (sigue en su banda) deriva el MISMO campo → no se reescribe el orden.
    const modelo = inzoomSerializable([["a", 100, 100], ["b", 100, 500]]);
    modelo.opds["opd-h"]!.ordenInzoom = [["a"], ["b"]];
    cargarInzoom(modelo);
    expect(ordenDe()).toEqual([["a"], ["b"]]);
    const ordenRef = ordenDe();

    store.getState().moverAparienciaConPuertos("a-b", 103, 503, []);

    // El campo sigue siendo [[a],[b]] y es la MISMA referencia (no se reescribió).
    expect(ordenDe()).toEqual([["a"], ["b"]]);
    expect(ordenDe()).toBe(ordenRef);
  });

  test("arrastrar una entidad que NO es subproceso de un in-zoom no crea ordenInzoom", () => {
    // En la raíz (no es in-zoom): mover el contorno no debe inventar un campo.
    const modelo = inzoomSerializable([["a", 100, 100], ["b", 100, 500]]);
    store.getState().importarJson(exportarModelo(modelo));
    store.getState().cambiarOpdActivo("opd-raiz");

    store.getState().moverAparienciaConPuertos("ar-contorno", 300, 300, []);

    expect(store.getState().modelo.opds["opd-raiz"]?.ordenInzoom).toBeUndefined();
  });
});
