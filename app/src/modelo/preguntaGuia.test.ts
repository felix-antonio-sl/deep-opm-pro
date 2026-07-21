import { describe, expect, test } from "bun:test";
import { generarOpl } from "../opl/generar";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import {
  adoptarOpd,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
} from "./operaciones";
import { crearOpdSuelto } from "./operaciones/opdSuelto";
import type { Modelo, Resultado } from "./tipos";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

describe("pregunta guía del refinamiento", () => {
  test("descomponer crea OPD, vínculo y pregunta en un único modelo siguiente", () => {
    const base = must(crearProceso(crearModelo("Guía"), "opd-1", { x: 40, y: 40 }, "Atender"));
    const procesoId = entidadId(base, "Atender");

    const resultado = must(descomponerProceso(base, base.opdRaizId, procesoId, {
      preguntaGuia: "  ¿Cómo se atiende la solicitud?  ",
    }));

    expect(resultado.creado).toBe(true);
    expect(resultado.modelo.opds[resultado.opdId]?.preguntaGuia).toBe("¿Cómo se atiende la solicitud?");
    expect(resultado.modelo.entidades[procesoId]?.refinamientos?.descomposicion?.opdId).toBe(resultado.opdId);
  });

  for (const modo of ["agregacion", "exhibicion", "generalizacion", "clasificacion"] as const) {
    test(`desplegar conserva pregunta y relación explícita: ${modo}`, () => {
      const base = must(crearObjeto(crearModelo("Unfold"), "opd-1", { x: 40, y: 40 }, "Sistema"));
      const objetoId = entidadId(base, "Sistema");

      const resultado = must(desplegarObjeto(base, base.opdRaizId, objetoId, modo, {
        preguntaGuia: `¿Qué revela ${modo}?`,
      }));

      expect(resultado.modelo.opds[resultado.opdId]?.preguntaGuia).toBe(`¿Qué revela ${modo}?`);
      expect(resultado.modelo.entidades[objetoId]?.refinamientos?.despliegue?.modo).toBe(modo);
    });
  }

  test("adoptar escribe la pregunta mediante el mismo constructor de refinamiento", () => {
    let base = must(crearProceso(crearModelo("Taller"), "opd-1", { x: 40, y: 40 }, "Resolver"));
    const procesoId = entidadId(base, "Resolver");
    const suelto = crearOpdSuelto(base, "Hipótesis");
    base = suelto.modelo;

    const adoptado = must(adoptarOpd(base, {
      opdPadreId: base.opdRaizId,
      entidadId: procesoId,
      opdSueltoId: suelto.opdId,
      tipo: "descomposicion",
      preguntaGuia: "¿Qué decisión resuelve este OPD?",
    }));

    expect(adoptado.opds[suelto.opdId]?.preguntaGuia).toBe("¿Qué decisión resuelve este OPD?");
    expect(adoptado.opds[suelto.opdId]?.padreId).toBe(base.opdRaizId);
  });

  test("roundtrip conserva pregunta; legacy no materializa el campo", () => {
    const legacy = crearModelo("Legacy");
    const legacyHidratado = must(hidratarModelo(exportarModelo(legacy)));
    expect(legacyHidratado.opds[legacyHidratado.opdRaizId]?.preguntaGuia).toBeUndefined();
    expect(exportarModelo(legacyHidratado)).toBe(exportarModelo(legacy));

    const conPregunta = {
      ...legacy,
      opds: {
        ...legacy.opds,
        [legacy.opdRaizId]: {
          ...legacy.opds[legacy.opdRaizId]!,
          preguntaGuia: "¿Qué transforma el sistema?",
        },
      },
    };
    const hidratado = must(hidratarModelo(exportarModelo(conPregunta)));
    expect(hidratado.opds[hidratado.opdRaizId]?.preguntaGuia).toBe("¿Qué transforma el sistema?");
  });

  test("la pregunta no altera OPL y la hidratación rechaza valores inválidos", () => {
    const base = crearModelo("Invariante OPL");
    const conPregunta = {
      ...base,
      opds: {
        ...base.opds,
        [base.opdRaizId]: { ...base.opds[base.opdRaizId]!, preguntaGuia: "¿Para qué existe?" },
      },
    };
    expect(generarOpl(conPregunta)).toEqual(generarOpl(base));

    const raw = JSON.parse(exportarModelo(base)) as { modelo: { opds: Record<string, Record<string, unknown>> } };
    const opds = raw.modelo.opds;
    opds[base.opdRaizId]!.preguntaGuia = "   ";
    const blanco = hidratarModelo(JSON.stringify(raw));
    expect(blanco.ok).toBe(false);
    if (!blanco.ok) expect(blanco.error).toContain("preguntaGuia");

    opds[base.opdRaizId]!.preguntaGuia = 42;
    const noString = hidratarModelo(JSON.stringify(raw));
    expect(noString.ok).toBe(false);
    if (!noString.ok) expect(noString.error).toContain("preguntaGuia");
  });
});
