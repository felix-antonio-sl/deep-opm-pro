import { describe, expect, test } from "bun:test";
import { crearModelo, crearObjeto, crearProceso } from "./creacion";
import { crearOpdSuelto } from "./opdSuelto";
import { adoptarOpd, devolverOpdABocetos } from "./refinamiento/establecer";
import { fijarRefinamiento, obtenerRefinamiento } from "../refinamientos";
import { esOpdSuelto } from "../opdSueltos";
import { exportarModelo, hidratarModelo } from "../../serializacion/json";
import { validarReferenciasOpd } from "../../serializacion/validarIntegridad";
import type { Modelo, Resultado } from "../tipos";

/** Desempaqueta un Resultado en tests (idioma del repo: lanza ante fallo). */
function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
function primerProcesoId(m: Modelo): string {
  return Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
}

describe("crearOpdSuelto", () => {
  test("crea un OPD suelto (padreId null, ≠ raíz) e incrementa nextSeq", () => {
    const m0 = crearModelo("M");
    const seq0 = m0.nextSeq;
    const { modelo, opdId } = crearOpdSuelto(m0);
    expect(modelo.opds[opdId]!.padreId).toBeNull();
    expect(opdId).not.toBe(modelo.opdRaizId);
    expect(esOpdSuelto(modelo, opdId)).toBe(true);
    // nextSeq AVANZA (consume el contador único). En un modelo recién creado
    // salta la colisión con la raíz `opd-1`, por lo que puede avanzar más de 1;
    // la invariante falsable es la monotonía estricta, no un delta exacto.
    expect(modelo.nextSeq).toBeGreaterThan(seq0);
    expect(modelo.opds[opdId]!.apariencias).toEqual({});
  });

  test("dos sueltos consecutivos no colisionan de id", () => {
    const a = crearOpdSuelto(crearModelo("M"));
    const b = crearOpdSuelto(a.modelo);
    expect(a.opdId).not.toBe(b.opdId);
  });
});

describe("adoptarOpd", () => {
  test("adopta un suelto como descomposición: fija padre y slot", () => {
    let m: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(m);
    const creado = crearOpdSuelto(m); m = creado.modelo;
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: creado.opdId, tipo: "descomposicion" });
    expect(r.ok).toBe(true);
    const out = must(r);
    expect(out.opds[creado.opdId]!.padreId).toBe("opd-1");
    expect(obtenerRefinamiento(out.entidades[procesoId]!, "descomposicion")?.opdId).toBe(creado.opdId);
    expect(esOpdSuelto(out, creado.opdId)).toBe(false); // ya no es suelto: fue adoptado
  });

  test("materializa una descomposición serializable y la inversa sobrevive guardar y abrir", () => {
    let modelo: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(modelo);
    const creado = crearOpdSuelto(modelo, "Hipótesis");
    modelo = must(crearProceso(creado.modelo, creado.opdId, { x: 240, y: 180 }, "Proyectar"));
    const bocetoPersistido = must(hidratarModelo(exportarModelo(modelo)));

    const adoptado = must(adoptarOpd(bocetoPersistido, {
      opdPadreId: bocetoPersistido.opdRaizId,
      entidadId: procesoId,
      opdSueltoId: creado.opdId,
      tipo: "descomposicion",
    }));

    expect(validarReferenciasOpd(adoptado)).toEqual({ ok: true, value: true });
    const reabierto = must(hidratarModelo(exportarModelo(adoptado)));
    const devuelto = must(devolverOpdABocetos(reabierto, creado.opdId)).modelo;
    expect(devuelto).toEqual(bocetoPersistido);
  });

  test("materializa un despliegue serializable y reversible", () => {
    let modelo: Modelo = must(crearObjeto(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Pedido"));
    const objetoId = Object.values(modelo.entidades).find((entidad) => entidad.tipo === "objeto")!.id;
    const creado = crearOpdSuelto(modelo, "Estructura");
    modelo = must(crearObjeto(creado.modelo, creado.opdId, { x: 240, y: 180 }, "Parte"));
    const antesDeAdoptar = modelo;

    const adoptado = must(adoptarOpd(modelo, {
      opdPadreId: modelo.opdRaizId,
      entidadId: objetoId,
      opdSueltoId: creado.opdId,
      tipo: "despliegue",
      modo: "agregacion",
    }));

    expect(validarReferenciasOpd(adoptado)).toEqual({ ok: true, value: true });
    expect(must(devolverOpdABocetos(adoptado, creado.opdId)).modelo).toEqual(antesDeAdoptar);
  });

  test("rechaza adoptar un OPD que no es suelto (ya tiene padre)", () => {
    let m: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(m);
    m = { ...m, opds: { ...m.opds, "opd-con-padre": { id: "opd-con-padre", nombre: "x", padreId: "opd-1", apariencias: {}, enlaces: {} } } };
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: "opd-con-padre", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });

  test("rechaza adoptar la raíz", () => {
    const m: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(m);
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: m.opdRaizId, tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });
});

describe("devolverOpdABocetos", () => {
  test("es la inversa no destructiva de adoptar: preserva identidad y contenido", () => {
    let modelo: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar"));
    const procesoId = primerProcesoId(modelo);
    const creado = crearOpdSuelto(modelo, "Hipótesis");
    modelo = {
      ...creado.modelo,
      opds: {
        ...creado.modelo.opds,
        [creado.opdId]: {
          ...creado.modelo.opds[creado.opdId]!,
          preguntaGuia: "¿Cómo cargar?",
        },
      },
    };
    const antesDeAdoptar = modelo;
    const adoptado = must(adoptarOpd(modelo, {
      opdPadreId: modelo.opdRaizId,
      entidadId: procesoId,
      opdSueltoId: creado.opdId,
      tipo: "descomposicion",
    }));

    const devuelto = must(devolverOpdABocetos(adoptado, creado.opdId));

    expect(devuelto).toEqual(expect.objectContaining({
      opdId: creado.opdId,
      entidadId: procesoId,
      tipo: "descomposicion",
    }));
    expect(devuelto.modelo).toEqual(antesDeAdoptar);
    expect(esOpdSuelto(devuelto.modelo, creado.opdId)).toBe(true);
  });

  test("preserva por identidad todo el subárbol integrado", () => {
    let modelo: Modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Padre"));
    const padreId = primerProcesoId(modelo);
    const hijo = crearOpdSuelto(modelo, "Hijo");
    modelo = must(adoptarOpd(hijo.modelo, {
      opdPadreId: modelo.opdRaizId,
      entidadId: padreId,
      opdSueltoId: hijo.opdId,
      tipo: "descomposicion",
    }));
    modelo = must(crearProceso(modelo, hijo.opdId, { x: 40, y: 40 }, "Nieto"));
    const nietoEntidadId = Object.values(modelo.entidades).find((entidad) => entidad.nombre === "Nieto")!.id;
    const nieto = crearOpdSuelto(modelo, "Detalle");
    modelo = must(adoptarOpd(nieto.modelo, {
      opdPadreId: hijo.opdId,
      entidadId: nietoEntidadId,
      opdSueltoId: nieto.opdId,
      tipo: "descomposicion",
    }));
    const opdsAntes = Object.keys(modelo.opds).sort();
    const entidadesAntes = Object.keys(modelo.entidades).sort();

    const devuelto = must(devolverOpdABocetos(modelo, hijo.opdId)).modelo;

    expect(Object.keys(devuelto.opds).sort()).toEqual(opdsAntes);
    expect(Object.keys(devuelto.entidades).sort()).toEqual(entidadesAntes);
    expect(devuelto.opds[hijo.opdId]!.padreId).toBeNull();
    expect(devuelto.opds[nieto.opdId]!.padreId).toBe(hijo.opdId);
    expect(obtenerRefinamiento(devuelto.entidades[nietoEntidadId]!, "descomposicion")?.opdId).toBe(nieto.opdId);
  });

  test("rechaza raíz, Boceto ya suelto e integrado sin vínculo", () => {
    const modelo = crearModelo("M");
    expect(devolverOpdABocetos(modelo, modelo.opdRaizId)).toEqual({
      ok: false,
      error: "La raíz del modelo no puede convertirse en Boceto",
    });
    const suelto = crearOpdSuelto(modelo);
    expect(devolverOpdABocetos(suelto.modelo, suelto.opdId)).toEqual({
      ok: false,
      error: `El OPD ${suelto.opdId} ya está en Bocetos`,
    });
    const inconsistente: Modelo = {
      ...suelto.modelo,
      opds: {
        ...suelto.modelo.opds,
        [suelto.opdId]: { ...suelto.modelo.opds[suelto.opdId]!, padreId: modelo.opdRaizId },
      },
    };
    expect(devolverOpdABocetos(inconsistente, suelto.opdId)).toEqual({
      ok: false,
      error: "El OPD integrado no tiene un vínculo de refinamiento que devolver",
    });
  });

  test("falla cerrado si más de una cosa reclama el mismo OPD", () => {
    let modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Uno"));
    modelo = must(crearProceso(modelo, "opd-1", { x: 200, y: 0 }, "Dos"));
    const procesos = Object.values(modelo.entidades).filter((entidad) => entidad.tipo === "proceso");
    const creado = crearOpdSuelto(modelo);
    modelo = must(adoptarOpd(creado.modelo, {
      opdPadreId: modelo.opdRaizId,
      entidadId: procesos[0]!.id,
      opdSueltoId: creado.opdId,
      tipo: "descomposicion",
    }));
    modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [procesos[1]!.id]: fijarRefinamiento(
          modelo.entidades[procesos[1]!.id]!,
          "descomposicion",
          { opdId: creado.opdId },
        ),
      },
    };

    expect(devolverOpdABocetos(modelo, creado.opdId)).toEqual({
      ok: false,
      error: "El OPD está vinculado por más de un refinamiento; corrige la integridad antes de devolverlo",
    });
  });

  test("falla cerrado si dos slots de la misma cosa reclaman el mismo OPD", () => {
    let modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Uno"));
    const procesoId = primerProcesoId(modelo);
    const creado = crearOpdSuelto(modelo);
    modelo = must(adoptarOpd(creado.modelo, {
      opdPadreId: modelo.opdRaizId,
      entidadId: procesoId,
      opdSueltoId: creado.opdId,
      tipo: "descomposicion",
    }));
    modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [procesoId]: fijarRefinamiento(
          modelo.entidades[procesoId]!,
          "despliegue",
          { opdId: creado.opdId },
        ),
      },
    };

    expect(devolverOpdABocetos(modelo, creado.opdId)).toEqual({
      ok: false,
      error: "El OPD está vinculado por más de un refinamiento; corrige la integridad antes de devolverlo",
    });
  });

  test("falla cerrado si el vínculo no coincide con el padre del OPD", () => {
    let modelo = must(crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Uno"));
    const procesoId = primerProcesoId(modelo);
    const creado = crearOpdSuelto(modelo);
    modelo = must(adoptarOpd(creado.modelo, {
      opdPadreId: modelo.opdRaizId,
      entidadId: procesoId,
      opdSueltoId: creado.opdId,
      tipo: "descomposicion",
    }));
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [creado.opdId]: { ...modelo.opds[creado.opdId]!, padreId: "opd-inexistente" },
      },
    };

    expect(devolverOpdABocetos(modelo, creado.opdId)).toEqual({
      ok: false,
      error: "El vínculo de refinamiento no coincide con el padre del OPD; corrige la integridad antes de devolverlo",
    });
  });
});
