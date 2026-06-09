// E-1 (solicitud upstream hd-opm 2026-06-06): vista ad-hoc `generic-view`.
// Reúne apariciones arbitrarias SIN semántica de refinamiento (no in-zoom, no
// unfold). hd-opm la necesita para la vista causal de ingreso P1 (Causal de
// exclusión + Requisito incumplido + Disponibilidad + Solicitud), donde el
// unfold mixto no es realizable (sin raíz todo-parte común, condición U11).

import { describe, expect, test } from "bun:test";
import { crearAutor } from "./index";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { checkDescomposicionSinSubprocesos, checkDescomposicionPreservaFrontera } from "../modelo/checkers";

function modeloConVistaAdHoc() {
  const a = crearAutor({ id: "v", nombre: "V" });
  a.entidad("p", "proceso", "Evaluación de ingreso", "fisica", "sistemica");
  a.entidad("o", "objeto", "Solicitud", "informacional", "sistemica");
  a.estados("o", ["recibida", "aceptada"], "recibida");
  a.opd("sd0", "SD0", null);
  a.ver("sd0", "p", 0, 0);
  a.ver("sd0", "o", 200, 0);
  a.enlazar("sd0", "p", "o", "resultado");
  // OPD vista ad-hoc: reúne una aparición de una entidad existente, sin refinamiento.
  a.opd("vista-causal", "Vista causal de ingreso", null);
  a.ver("vista-causal", "o", 40, 40);
  a.vistaGenerica("vista-causal");
  return a.modelo;
}

describe("E-1 — vista ad-hoc generic-view", () => {
  test("se autora, serializa y round-trips preservando la vista", () => {
    const json = exportarModelo(modeloConVistaAdHoc());
    const r = hidratarModelo(json);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const vistaOpd = Object.values(r.value.opds).find((o) => o.nombre === "Vista causal de ingreso");
    expect(vistaOpd?.vista).toEqual({ kind: "generic-view" });
  });

  test("readOnly opcional se preserva en el round-trip", () => {
    const a = crearAutor({ id: "v2", nombre: "V2" });
    a.entidad("o", "objeto", "Cosa", "informacional", "sistemica");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "o", 0, 0);
    a.opd("vista", "Vista", null);
    a.ver("vista", "o", 10, 10);
    a.vistaGenerica("vista", { readOnly: true });
    const r = hidratarModelo(exportarModelo(a.modelo));
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    const v = Object.values(r.value.opds).find((o) => o.nombre === "Vista");
    expect(v?.vista).toEqual({ kind: "generic-view", readOnly: true });
  });

  test("la vista NO es refinamiento: no genera avisos de descomposición/frontera", () => {
    const modelo = modeloConVistaAdHoc();
    const vistaOpd = Object.values(modelo.opds).find((o) => o.nombre === "Vista causal de ingreso")!;
    const avisos = [
      ...checkDescomposicionSinSubprocesos(modelo),
      ...checkDescomposicionPreservaFrontera(modelo),
    ];
    expect(avisos.filter((av) => av.opdId === vistaOpd.id)).toHaveLength(0);
  });
});
