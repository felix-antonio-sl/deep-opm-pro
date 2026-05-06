import { describe, expect, test } from "bun:test";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { crearCosaEnPosicion } from "./creacionInterna";
import { contenedorRefinamiento } from "./layout";
import { crearModelo, crearProceso, descomponerProceso } from "./operaciones";
import type { Modelo } from "./tipos";

describe("creacion interna por posicion", () => {
  test("crea objeto interno en OPD hijo dentro del contorno refinado", () => {
    const base = modeloConDescomposicion();
    const contorno = contenedorRefinamiento(base.modelo, base.opdHijoId);
    if (!contorno) throw new Error("La prueba esperaba contorno de refinamiento");

    const resultado = crearCosaEnPosicion(base.modelo, base.opdHijoId, "objeto", {
      x: contorno.x + 28,
      y: contorno.y + 92,
    });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.interna).toBe(true);
    const apariencia = resultado.value.modelo.opds[base.opdHijoId]?.apariencias[resultado.value.aparienciaId];
    expect(apariencia?.opdId).toBe(base.opdHijoId);
    expect(apariencia?.entidadId).toBe(resultado.value.entidadId);
    if (!apariencia) return;
    expect(dentroDeContorno(apariencia, contorno)).toBe(true);
    expect(Object.values(resultado.value.modelo.opds[resultado.value.modelo.opdRaizId]?.apariencias ?? {})
      .some((item) => item.entidadId === resultado.value.entidadId)).toBe(false);
  });

  test("crear fuera del contorno conserva creacion en posicion sin marcar interna", () => {
    const base = modeloConDescomposicion();

    const resultado = crearCosaEnPosicion(base.modelo, base.opdHijoId, "objeto", { x: 8, y: 12 });

    expect(resultado.ok).toBe(true);
    if (!resultado.ok) return;
    expect(resultado.value.interna).toBe(false);
    const apariencia = resultado.value.modelo.opds[base.opdHijoId]?.apariencias[resultado.value.aparienciaId];
    expect(apariencia).toMatchObject({ opdId: base.opdHijoId, x: 8, y: 12 });
  });

  test("round-trip preserva OPD y apariencia de cosa interna", () => {
    const base = modeloConDescomposicion();
    const contorno = contenedorRefinamiento(base.modelo, base.opdHijoId);
    if (!contorno) throw new Error("La prueba esperaba contorno de refinamiento");
    const creado = must(crearCosaEnPosicion(base.modelo, base.opdHijoId, "objeto", {
      x: contorno.x + 48,
      y: contorno.y + 120,
    }));

    const hidratado = hidratarModelo(exportarModelo(creado.modelo));

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    const apariencia = hidratado.value.opds[base.opdHijoId]?.apariencias[creado.aparienciaId];
    expect(apariencia).toMatchObject({
      id: creado.aparienciaId,
      entidadId: creado.entidadId,
      opdId: base.opdHijoId,
    });
    expect(hidratado.value.entidades[creado.entidadId]?.tipo).toBe("objeto");
  });

  test("crear ambiental dentro del contorno hereda afiliacion y clampea bbox", () => {
    const base = modeloConDescomposicion("ambiental");
    const contorno = contenedorRefinamiento(base.modelo, base.opdHijoId);
    if (!contorno) throw new Error("La prueba esperaba contorno de refinamiento");

    const creado = must(crearCosaEnPosicion(base.modelo, base.opdHijoId, "objeto", {
      x: contorno.x + contorno.width - 12,
      y: contorno.y + contorno.height - 12,
    }));
    const apariencia = creado.modelo.opds[base.opdHijoId]?.apariencias[creado.aparienciaId];

    expect(creado.modelo.entidades[creado.entidadId]?.afiliacion).toBe("ambiental");
    expect(apariencia).toBeDefined();
    if (!apariencia) return;
    expect(dentroDeContorno(apariencia, contorno)).toBe(true);
  });
});

function modeloConDescomposicion(afiliacion: "sistemica" | "ambiental" = "sistemica"): { modelo: Modelo; opdHijoId: string } {
  let modelo = crearModelo();
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 140 }, "Procesar"));
  const procesoId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Procesar")?.id;
  if (!procesoId) throw new Error("La prueba esperaba proceso");
  modelo = {
    ...modelo,
    entidades: {
      ...modelo.entidades,
      [procesoId]: {
        ...modelo.entidades[procesoId]!,
        afiliacion,
      },
    },
  };
  const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
  return { modelo: descompuesto.modelo, opdHijoId: descompuesto.opdId };
}

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function dentroDeContorno(
  apariencia: { x: number; y: number; width: number; height: number },
  contorno: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}
