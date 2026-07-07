import { describe, expect, test } from "bun:test";
import { evaluarVitrina } from "./revisionVitrina";

const RR = (modeloId: string, revision: number) => ({ modeloId, revision });

describe("evaluarVitrina", () => {
  test("no persistido → oculto", () => {
    expect(evaluarVitrina({ modeloPersistidoId: null, revisionRemota: RR("m", 5), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("sin lectura de poll → oculto", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: null, revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("poll de OTRO modelo (rancio) → oculto", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("otro", 9), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("base desconocida → oculto (no falso positivo)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 9), revisionBase: null, dirty: false }))
      .toEqual({ visible: false });
  });
  test("remota == base → oculto (mi propio estado)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 3), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("remota < base → oculto (nunca retrocede)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 2), revisionBase: 3, dirty: false }))
      .toEqual({ visible: false });
  });
  test("remota > base, limpio → visible sin cambios locales (rama Recargar)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 6), revisionBase: 5, dirty: false }))
      .toEqual({ visible: true, revisionRemota: 6, hayCambiosLocales: false });
  });
  test("remota > base, dirty → visible con cambios locales (rama no-destructiva)", () => {
    expect(evaluarVitrina({ modeloPersistidoId: "m", revisionRemota: RR("m", 6), revisionBase: 5, dirty: true }))
      .toEqual({ visible: true, revisionRemota: 6, hayCambiosLocales: true });
  });
});
