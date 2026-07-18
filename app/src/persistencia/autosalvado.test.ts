import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { crearAutosalvado, type AutosalvadoEstado } from "./autosalvado";

describe("autosalvado (L4)", () => {
  let dirty = false;
  let salvados = 0;

  beforeEach(() => {
    dirty = false;
    salvados = 0;
  });

  test("timer dispara al intervalo y ejecuta salvado", async () => {
    const estados: AutosalvadoEstado[] = [];
    const ctrl = crearAutosalvado({
      esDirty: () => dirty,
      ejecutarSalvado: async () => { salvados++; },
      intervaloMs: 50,
    });
    ctrl.onEstado((e) => estados.push(e));
    ctrl.iniciar(50);

    dirty = true;
    await new Promise((r) => setTimeout(r, 120));
    ctrl.detener();

    expect(salvados).toBeGreaterThanOrEqual(1);
  });

  test("no dispara si no está dirty", async () => {
    const ctrl = crearAutosalvado({
      esDirty: () => dirty,
      ejecutarSalvado: async () => { salvados++; },
      intervaloMs: 50,
    });
    ctrl.iniciar(50);

    // dirty sigue en false
    await new Promise((r) => setTimeout(r, 120));
    ctrl.detener();

    expect(salvados).toBe(0);
  });

  test("un intento fallido no actualiza la marca de último autosave", async () => {
    const ctrl = crearAutosalvado({
      esDirty: () => true,
      ejecutarSalvado: async () => false,
      intervaloMs: 30,
    });
    ctrl.iniciar(30);

    await new Promise((r) => setTimeout(r, 70));
    ctrl.detener();

    expect(ctrl.estado().ultimo).toBeNull();
  });

  test("marca salvandoAhora durante la ejecución", async () => {
    let capturadoSalvando = false;
    const ctrl = crearAutosalvado({
      esDirty: () => dirty,
      ejecutarSalvado: async () => {
        capturadoSalvando = ctrl.estado().salvando;
        salvados++;
        await new Promise((r) => setTimeout(r, 20));
      },
      intervaloMs: 50,
    });
    ctrl.iniciar(50);

    dirty = true;
    await new Promise((r) => setTimeout(r, 120));
    ctrl.detener();

    expect(salvados).toBeGreaterThanOrEqual(1);
    expect(capturadoSalvando).toBe(true);
  });

  test("detener apaga el timer", async () => {
    const ctrl = crearAutosalvado({
      esDirty: () => true,
      ejecutarSalvado: async () => { salvados++; },
      intervaloMs: 50,
    });
    ctrl.iniciar(50);
    ctrl.detener();

    expect(ctrl.estado().activo).toBe(false);
    const antes = salvados;
    await new Promise((r) => setTimeout(r, 120));
    expect(salvados).toBe(antes);
  });

  test("detener invalida un tick que todavía espera respuesta", async () => {
    let resolverInicio = () => {};
    let resolverSalvado = () => {};
    const iniciado = new Promise<void>((resolve) => { resolverInicio = resolve; });
    const liberar = new Promise<void>((resolve) => { resolverSalvado = resolve; });
    const ctrl = crearAutosalvado({
      esDirty: () => true,
      ejecutarSalvado: async () => {
        resolverInicio();
        await liberar;
      },
      intervaloMs: 10,
    });
    ctrl.iniciar(10);
    await iniciado;

    ctrl.detener();
    resolverSalvado();
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(ctrl.estado()).toEqual({ activo: false, ultimo: null, salvando: false });
  });

  test("iniciar es idempotente", () => {
    const ctrl = crearAutosalvado({
      esDirty: () => true,
      ejecutarSalvado: async () => {},
      intervaloMs: 5000,
    });
    ctrl.iniciar();
    ctrl.iniciar(); // segunda llamada no debería crear nuevo timer
    expect(ctrl.estado().activo).toBe(true);
    ctrl.detener();
  });

  test("salta si ya está salvando", async () => {
    let ejecuciones = 0;
    let resolviendo = false;
    const ctrl = crearAutosalvado({
      esDirty: () => true,
      ejecutarSalvado: async () => {
        ejecuciones++;
        if (!resolviendo) {
          resolviendo = true;
          await new Promise((r) => setTimeout(r, 80));
          resolviendo = false;
        }
      },
      intervaloMs: 30,
    });
    ctrl.iniciar(30);

    await new Promise((r) => setTimeout(r, 200));
    ctrl.detener();

    // Con intervalos de 30ms y ejecución de 80ms, las ejecuciones deberían ser limitadas
    expect(ejecuciones).toBeLessThanOrEqual(5);
  });

  test("onEstado notifica cambios", () => {
    const estados: AutosalvadoEstado[] = [];
    const ctrl = crearAutosalvado({
      esDirty: () => true,
      ejecutarSalvado: async () => {},
    });
    ctrl.onEstado((e) => estados.push(e));
    ctrl.iniciar();
    expect(estados.length).toBeGreaterThanOrEqual(1);
    const ultimo = estados[estados.length - 1];
    expect(ultimo).toBeDefined();
    if (ultimo) expect(ultimo.activo).toBe(true);
    ctrl.detener();
  });
});
