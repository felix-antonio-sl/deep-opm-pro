import { describe, expect, test } from "bun:test";
import {
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  desplegarObjeto,
} from "../modelo/operaciones";
import { aparienciaDeEntidadEnOpd } from "../modelo/politicaApariciones";
import { suprimirEstado } from "../modelo/estadosDesignaciones";
import type { Estado, Id, Modelo, Resultado } from "../modelo/tipos";
import {
  estadoVisibleEnAparicion,
  estadosVisiblesEnAparicion,
  suprimirEstadoEnAparicion,
} from "../modelo/visibilidadEstados";
import { proyectarModeloAJointCells } from "../render/jointjs/proyeccion";
import { exportarModelo, hidratarModelo } from "../serializacion/json";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

/**
 * Construye un objeto con dos estados que aparece en DOS OPDs (raíz + OPD de
 * despliegue), para verificar la independencia de fibras de la supresión local.
 */
function modeloObjetoEnDosOpds(): { modelo: Modelo; objetoId: Id; opdRaizId: Id; opdHijoId: Id; estados: Estado[] } {
  let modelo = crearModelo();
  const opdRaizId = modelo.opdRaizId;
  modelo = must(crearObjeto(modelo, opdRaizId, { x: 200, y: 120 }, "Documento"));
  const objetoId = Object.values(modelo.entidades).find((e) => e.tipo === "objeto")!.id;
  modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
  const despliegue = must(desplegarObjeto(modelo, opdRaizId, objetoId, "agregacion"));
  modelo = despliegue.modelo;
  const opdHijoId = despliegue.opdId;
  const estados = Object.values(modelo.estados).filter((s) => s.entidadId === objetoId);
  return { modelo, objetoId, opdRaizId, opdHijoId, estados };
}

describe("LEY: supresión de estados por aparición (per-OPD)", () => {
  test("law-local-no-contamina-otras-apariciones: ocultar en un OPD no afecta el otro", () => {
    const { modelo, objetoId, opdRaizId, opdHijoId, estados } = modeloObjetoEnDosOpds();
    const apRaiz = aparienciaDeEntidadEnOpd(modelo.opds[opdRaizId]!, objetoId)!;
    const apHijo = aparienciaDeEntidadEnOpd(modelo.opds[opdHijoId]!, objetoId)!;
    expect(apRaiz).toBeTruthy();
    expect(apHijo).toBeTruthy();
    const estadoVictima = estados[0]!;

    const m = must(suprimirEstadoEnAparicion(modelo, opdRaizId, apRaiz.id, estadoVictima.id));

    const apRaizDespues = aparienciaDeEntidadEnOpd(m.opds[opdRaizId]!, objetoId)!;
    const apHijoDespues = aparienciaDeEntidadEnOpd(m.opds[opdHijoId]!, objetoId)!;
    // Oculto en raíz
    expect(estadoVisibleEnAparicion(estadoVictima, apRaizDespues)).toBe(false);
    // VISIBLE en el hijo: la fibra del otro OPD es independiente
    expect(estadoVisibleEnAparicion(estadoVictima, apHijoDespues)).toBe(true);
  });

  test("law-global-domina-local: estado.suprimido global oculta en TODAS las apariciones", () => {
    const { modelo, objetoId, opdRaizId, opdHijoId, estados } = modeloObjetoEnDosOpds();
    const estadoVictima = estados[0]!;
    // Primero oculto localmente solo en raíz, luego suprimo globalmente
    const apRaiz = aparienciaDeEntidadEnOpd(modelo.opds[opdRaizId]!, objetoId)!;
    let m = must(suprimirEstadoEnAparicion(modelo, opdRaizId, apRaiz.id, estadoVictima.id));
    m = must(suprimirEstado(m, estadoVictima.id));

    const estadoGlobal = m.estados[estadoVictima.id]!;
    const apRaizF = aparienciaDeEntidadEnOpd(m.opds[opdRaizId]!, objetoId)!;
    const apHijoF = aparienciaDeEntidadEnOpd(m.opds[opdHijoId]!, objetoId)!;
    // Global domina en ambas, sin importar el estado local
    expect(estadoVisibleEnAparicion(estadoGlobal, apRaizF)).toBe(false);
    expect(estadoVisibleEnAparicion(estadoGlobal, apHijoF)).toBe(false);
  });

  test("law-orthogonalidad: quitar la global no resucita lo ocultado localmente", () => {
    const { modelo, objetoId, opdRaizId, estados } = modeloObjetoEnDosOpds();
    const estadoVictima = estados[0]!;
    const apRaiz = aparienciaDeEntidadEnOpd(modelo.opds[opdRaizId]!, objetoId)!;
    // Local + global, luego quito la global a mano (delete suprimido)
    let m = must(suprimirEstadoEnAparicion(modelo, opdRaizId, apRaiz.id, estadoVictima.id));
    m = must(suprimirEstado(m, estadoVictima.id));
    const sinGlobal = { ...m.estados[estadoVictima.id]! };
    delete sinGlobal.suprimido;
    m = { ...m, estados: { ...m.estados, [estadoVictima.id]: sinGlobal } };

    const apRaizF = aparienciaDeEntidadEnOpd(m.opds[opdRaizId]!, objetoId)!;
    // Sigue oculto en raíz por el flag LOCAL persistente
    expect(estadoVisibleEnAparicion(sinGlobal, apRaizF)).toBe(false);
  });

  test("law-render-respeta-predicado: el OPD con supresión local renderiza una cápsula menos", () => {
    const { modelo, objetoId, opdRaizId, opdHijoId, estados } = modeloObjetoEnDosOpds();
    const apRaiz = aparienciaDeEntidadEnOpd(modelo.opds[opdRaizId]!, objetoId)!;
    const m = must(suprimirEstadoEnAparicion(modelo, opdRaizId, apRaiz.id, estados[0]!.id));

    const apHijo = aparienciaDeEntidadEnOpd(m.opds[opdHijoId]!, objetoId)!;
    const apRaizF = aparienciaDeEntidadEnOpd(m.opds[opdRaizId]!, objetoId)!;
    // El kernel reporta la diferencia de visibles por aparición
    expect(estadosVisiblesEnAparicion(m, objetoId, apRaizF).length).toBe(estados.length - 1);
    expect(estadosVisiblesEnAparicion(m, objetoId, apHijo).length).toBe(estados.length);

    // Y el render no rompe (proyecta ambos OPDs sin lanzar)
    expect(() => proyectarModeloAJointCells(m, opdRaizId, null, null)).not.toThrow();
    expect(() => proyectarModeloAJointCells(m, opdHijoId, null, null)).not.toThrow();
  });

  test("law-roundtrip: estadosSuprimidos sobrevive export/hidratar", () => {
    const { modelo, objetoId, opdRaizId, estados } = modeloObjetoEnDosOpds();
    const apRaiz = aparienciaDeEntidadEnOpd(modelo.opds[opdRaizId]!, objetoId)!;
    const m = must(suprimirEstadoEnAparicion(modelo, opdRaizId, apRaiz.id, estados[0]!.id));

    const hidratado = must(hidratarModelo(exportarModelo(m)));
    const apRaizH = aparienciaDeEntidadEnOpd(hidratado.opds[opdRaizId]!, objetoId)!;
    expect(apRaizH.estadosSuprimidos).toEqual([estados[0]!.id]);
  });
});
