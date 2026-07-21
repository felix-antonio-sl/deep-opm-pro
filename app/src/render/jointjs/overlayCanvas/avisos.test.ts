import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../../modelo/operaciones";
import type { Apariencia, AparienciaEnlace, Enlace, Entidad, Id, Modelo } from "../../../modelo/tipos";
import { anchorCellIdParaAviso, construirAvisosFeedbackCanvas } from "./avisos";

describe("avisos feedback canvas", () => {
  test("mapea aviso de entidad al cell de apariencia del OPD activo", () => {
    const modelo = modeloConAmbientalFueraDeContorno();

    expect(anchorCellIdParaAviso(modelo, "opd-hijo", "entidad", "o-ambiente")).toBe("a-ambiente");
    expect(construirAvisosFeedbackCanvas(modelo, "opd-hijo")).toContainEqual(expect.objectContaining({
      anchorCellId: "a-ambiente",
      reglaId: "ambiental-dentro-contorno",
      severidad: "advertencia",
    }));
    expect(construirAvisosFeedbackCanvas(modelo, "opd-hijo", { esApunte: true })).toContainEqual(expect.objectContaining({
      anchorCellId: "a-ambiente",
      reglaId: "ambiental-dentro-contorno",
      severidad: "info",
    }));
  });

  test("mapea aviso de enlace al cell de apariencia de enlace del OPD activo", () => {
    const modelo = modeloCon({
      entidades: [
        entidad("o-software", "objeto", "Software", "informacional"),
        entidad("p-operar", "proceso", "Operar", "informacional"),
      ],
      enlaces: [enlace("e-agente", "agente", "o-software", "p-operar")],
    });

    expect(construirAvisosFeedbackCanvas(modelo, modelo.opdRaizId)).toContainEqual(expect.objectContaining({
      anchorCellId: "ae-e-agente",
      reglaId: "agente-requiere-objeto-fisico",
      severidad: "error",
    }));
  });

  test("mantiene ErrorBadge para validacion anclable desde la fuente comun", () => {
    const modelo = modeloCon({
      entidades: [entidad("p-proceso", "proceso", "Proceso", "informacional")],
    });

    const avisos = construirAvisosFeedbackCanvas(modelo, modelo.opdRaizId);

    expect(avisos).toContainEqual(expect.objectContaining({
      anchorCellId: "a-p-proceso",
      reglaId: "PROCESO_NO_TRANSFORMA",
      severidad: "error",
    }));
    expect(avisos.some((aviso) => aviso.reglaId === "PROCESO_NOMBRE_FORMA_VERBAL")).toBe(false);
  });
});

function modeloCon(input: { entidades: Entidad[]; enlaces?: Enlace[] }): Modelo {
  const base = crearModelo("Modelo");
  const enlaces = input.enlaces ?? [];
  return {
    ...base,
    entidades: Object.fromEntries(input.entidades.map((item) => [item.id, item])),
    enlaces: Object.fromEntries(enlaces.map((item) => [item.id, item])),
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: Object.fromEntries(input.entidades.map((item, index) => [
          `a-${item.id}`,
          apariencia(`a-${item.id}`, item.id, base.opdRaizId, index),
        ])),
        enlaces: Object.fromEntries(enlaces.map((item) => [
          `ae-${item.id}`,
          aparienciaEnlace(`ae-${item.id}`, item.id, base.opdRaizId),
        ])),
      },
    },
  };
}

function modeloConAmbientalFueraDeContorno(): Modelo {
  const base = crearModelo("Modelo inzoom");
  const padre = entidad("p-padre", "proceso", "Atender", "informacional", {
    tipo: "descomposicion",
    opdId: "opd-hijo",
  });
  const hijo = entidad("p-hijo", "proceso", "Examinar", "informacional");
  const ambiente = {
    ...entidad("o-ambiente", "objeto", "Ambiente", "informacional"),
    afiliacion: "ambiental" as const,
  };
  const enlacePadreHijo = enlace("e-padre-hijo", "generalizacion", padre.id, hijo.id);

  return {
    ...base,
    entidades: {
      [padre.id]: padre,
      [hijo.id]: hijo,
      [ambiente.id]: ambiente,
    },
    enlaces: {
      [enlacePadreHijo.id]: enlacePadreHijo,
    },
    opds: {
      [base.opdRaizId]: {
        ...base.opds[base.opdRaizId]!,
        apariencias: {
          "a-padre-raiz": { id: "a-padre-raiz", entidadId: padre.id, opdId: base.opdRaizId, x: 100, y: 100, width: 135, height: 60 },
        },
        enlaces: {},
      },
      "opd-hijo": {
        id: "opd-hijo",
        nombre: "SD1",
        padreId: base.opdRaizId,
        apariencias: {
          "a-padre-hijo": { id: "a-padre-hijo", entidadId: padre.id, opdId: "opd-hijo", x: 100, y: 80, width: 420, height: 280 },
          "a-subproceso": { id: "a-subproceso", entidadId: hijo.id, opdId: "opd-hijo", x: 150, y: 140, width: 135, height: 60 },
          "a-ambiente": { id: "a-ambiente", entidadId: ambiente.id, opdId: "opd-hijo", x: 20, y: 20, width: 135, height: 60 },
        },
        enlaces: {
          "ae-padre-hijo": aparienciaEnlace("ae-padre-hijo", enlacePadreHijo.id, "opd-hijo"),
        },
      },
    },
  };
}

function entidad(
  id: Id,
  tipo: Entidad["tipo"],
  nombre: string,
  esencia: Entidad["esencia"],
  refinamiento?: import("../../../modelo/tipos").RefinamientoEntidad,
): Entidad {
  return {
    id,
    tipo,
    nombre,
    esencia,
    afiliacion: "sistemica",
    ...(refinamiento
      ? {
          refinamientos: {
            [refinamiento.tipo]: refinamiento.tipo === "despliegue"
              ? { opdId: refinamiento.opdId, ...(refinamiento.modo ? { modo: refinamiento.modo } : {}) }
              : { opdId: refinamiento.opdId },
          },
        }
      : {}),
  };
}

function enlace(id: Id, tipo: Enlace["tipo"], origenId: Id, destinoId: Id): Enlace {
  return {
    id,
    tipo,
    origenId: { kind: "entidad", id: origenId },
    destinoId: { kind: "entidad", id: destinoId },
    etiqueta: "",
  };
}

function apariencia(id: Id, entidadId: Id, opdId: Id, index: number): Apariencia {
  return {
    id,
    entidadId,
    opdId,
    x: 40 + index * 180,
    y: 80,
    width: 135,
    height: 60,
  };
}

function aparienciaEnlace(id: Id, enlaceId: Id, opdId: Id): AparienciaEnlace {
  return { id, enlaceId, opdId, vertices: [] };
}
