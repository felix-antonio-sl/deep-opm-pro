import { describe, expect, test } from "bun:test";
import { calcularMetricasComplejidad } from "./metricasComplejidad";
import {
  agregarFuenteExploracion,
  agregarTrazoExploracion,
  confirmarPropuestaExploracion,
  crearPropuestaExploracion,
  editarPropuestaExploracion,
  editarTrazoExploracion,
  previsualizarPropuestaExploracion,
} from "./mesaExploracion";
import {
  crearModelo,
  crearObjeto,
  crearOpdSuelto,
  definirOntologiaOrganizacional,
} from "./operaciones";
import { eliminarOpdHoja } from "./opdEliminacion";
import { firmaSnapshotSubmodelo } from "./submodelos/estado";
import type { Id, Modelo, Resultado } from "./tipos";
import { exportarOplOpdMarkdown } from "../opl/exportarMarkdown";
import { generarOpl } from "../opl/generar";
import { planificarEdicionOplLibre } from "../opl/parser";

const AHORA = "2026-08-31T10:00:00.000Z";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function fuente(modelo: Modelo, contenido: string): { modelo: Modelo; fuenteId: Id } {
  return must(agregarFuenteExploracion(modelo, { contenido }, AHORA));
}

function trazo(modelo: Modelo, fuenteIds: Id[], texto: string): { modelo: Modelo; trazoId: Id } {
  return must(agregarTrazoExploracion(modelo, { fuenteIds, texto }, AHORA));
}

function propuesta(
  modelo: Modelo,
  trazoIds: Id[],
  entidadTipo: "objeto" | "proceso" = "objeto",
  nombre = "Solicitud",
): { modelo: Modelo; propuestaId: Id } {
  return must(crearPropuestaExploracion(modelo, {
    trazoIds,
    operacion: {
      tipo: "crear-entidad",
      entidadTipo,
      nombre,
      opdId: modelo.opdRaizId,
    },
  }, AHORA));
}

describe("Mesa de exploración · capa meta", () => {
  test("fuentes, trazos y propuestas pendientes no alteran OPM, OPL, métricas ni firma semántica", () => {
    const inicial = crearModelo("Mesa");
    const firmaInicial = firmaSnapshotSubmodelo(inicial);
    const oplInicial = exportarOplOpdMarkdown(inicial, inicial.opdRaizId, { esApunte: true });
    const metricasIniciales = calcularMetricasComplejidad(inicial);
    const nextSeqInicial = inicial.nextSeq;

    const f = fuente(inicial, "La solicitud llega y luego se revisa");
    const t = trazo(f.modelo, [f.fuenteId], "La solicitud llega");
    const p = propuesta(t.modelo, [t.trazoId]);

    expect(p.modelo.mesaExploracion?.fuentes[f.fuenteId]?.contenido).toBe("La solicitud llega y luego se revisa");
    expect(p.modelo.mesaExploracion?.trazos[t.trazoId]?.fuenteIds).toEqual([f.fuenteId]);
    expect(p.modelo.mesaExploracion?.propuestas[p.propuestaId]?.estado).toBe("pendiente");
    expect(Object.keys(p.modelo.entidades)).toHaveLength(0);
    expect(p.modelo.nextSeq).toBe(nextSeqInicial);
    expect(exportarOplOpdMarkdown(p.modelo, p.modelo.opdRaizId, { esApunte: true })).toBe(oplInicial);
    expect(calcularMetricasComplejidad(p.modelo)).toEqual(metricasIniciales);
    expect(firmaSnapshotSubmodelo(p.modelo)).toBe(firmaInicial);
  });

  test("un trazo puede conservar muchas fuentes y una propuesta muchos trazos", () => {
    const f1 = fuente(crearModelo("N:M"), "Registro A");
    const f2 = fuente(f1.modelo, "Registro B");
    const t1 = trazo(f2.modelo, [f1.fuenteId, f2.fuenteId], "Ambos registros describen la entrada");
    const t2 = trazo(t1.modelo, [f2.fuenteId], "El segundo también describe una revisión");
    const p = propuesta(t2.modelo, [t1.trazoId, t2.trazoId], "proceso", "Revisar solicitud");

    expect(p.modelo.mesaExploracion?.trazos[t1.trazoId]?.fuenteIds).toEqual([f1.fuenteId, f2.fuenteId]);
    expect(p.modelo.mesaExploracion?.propuestas[p.propuestaId]?.trazoIds).toEqual([t1.trazoId, t2.trazoId]);
  });

  test("rechaza referencias preformales inexistentes y conserva el modelo original", () => {
    const modelo = crearModelo("Roto");
    const resultado = agregarTrazoExploracion(modelo, { fuenteIds: ["fuente-ausente"], texto: "fragmento" }, AHORA);

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("fuente");
    expect(modelo.mesaExploracion).toBeUndefined();
  });

  test("conserva el texto original de la fuente verbatim", () => {
    const original = "  primera línea\nsegunda línea  ";
    const f = fuente(crearModelo("Fidelidad"), original);

    expect(f.modelo.mesaExploracion?.fuentes[f.fuenteId]?.contenido).toBe(original);
  });

  test("limita solo los adjuntos Markdown explícitos a 128 kB", () => {
    const modelo = crearModelo("Fuente grande");
    const resultado = agregarFuenteExploracion(modelo, {
      contenido: "x".repeat(128_001),
      mediaType: "text/markdown",
    }, AHORA);

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("128 kB");
    expect(modelo.mesaExploracion).toBeUndefined();
    expect(agregarFuenteExploracion(modelo, { contenido: "y".repeat(128_001) }, AHORA).ok).toBe(true);
  });

  test("edita texto e interpretación pendientes sin convertirlos en hechos", () => {
    const f = fuente(crearModelo("Editar"), "texto inicial");
    const t = trazo(f.modelo, [f.fuenteId], "fragmento inicial");
    const p = propuesta(t.modelo, [t.trazoId]);
    const conTrazo = must(editarTrazoExploracion(p.modelo, t.trazoId, "fragmento corregido", AHORA));
    const conPropuesta = must(editarPropuestaExploracion(conTrazo, p.propuestaId, {
      entidadTipo: "proceso",
      nombre: "Revisar solicitud",
    }));

    expect(conPropuesta.mesaExploracion?.trazos[t.trazoId]?.texto).toBe("fragmento corregido");
    expect(conPropuesta.mesaExploracion?.propuestas[p.propuestaId]?.operacion).toEqual({
      tipo: "crear-entidad",
      entidadTipo: "proceso",
      nombre: "Revisar solicitud",
      opdId: conPropuesta.opdRaizId,
    });
    expect(Object.keys(conPropuesta.entidades)).toHaveLength(0);
  });

  test("impide eliminar el OPD que mantiene una propuesta pendiente", () => {
    const boceto = crearOpdSuelto(crearModelo("Propuesta anclada"), "Boceto de propuesta");
    const f = fuente(boceto.modelo, "Existe una solicitud");
    const t = trazo(f.modelo, [f.fuenteId], "una solicitud");
    const p = must(crearPropuestaExploracion(t.modelo, {
      trazoIds: [t.trazoId],
      operacion: {
        tipo: "crear-entidad",
        entidadTipo: "objeto",
        nombre: "Solicitud",
        opdId: boceto.opdId,
      },
    }, AHORA));

    const resultado = eliminarOpdHoja(p.modelo, boceto.opdId);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("propuesta pendiente");

    const rebasado = must(editarPropuestaExploracion(p.modelo, p.propuestaId, {
      entidadTipo: "objeto",
      nombre: "Solicitud",
      opdId: p.modelo.opdRaizId,
    }));
    const eliminado = eliminarOpdHoja(rebasado, boceto.opdId);
    expect(eliminado.ok).toBe(true);
    if (eliminado.ok) {
      expect(eliminado.value.modelo.mesaExploracion?.propuestas[p.propuestaId]?.operacion.opdId)
        .toBe(p.modelo.opdRaizId);
    }
  });
});

describe("Mesa de exploración · propuesta → hecho", () => {
  test("previsualiza sin mutar y confirma un hecho con proveniencia navegable", () => {
    const f1 = fuente(crearModelo("Confirmar"), "Formulario recibido");
    const f2 = fuente(f1.modelo, "Relato de la persona");
    const t = trazo(f2.modelo, [f1.fuenteId, f2.fuenteId], "Existe una solicitud");
    const p = propuesta(t.modelo, [t.trazoId], "objeto", "Solicitud");

    const preview = must(previsualizarPropuestaExploracion(p.modelo, p.propuestaId));
    expect(Object.keys(p.modelo.entidades)).toHaveLength(0);
    expect(preview.modelo.entidades[preview.targetId]?.nombre).toBe("Solicitud");
    expect(preview.modelo.mesaExploracion?.propuestas[p.propuestaId]?.estado).toBe("pendiente");

    const confirmado = must(confirmarPropuestaExploracion(p.modelo, p.propuestaId, AHORA));
    const meta = confirmado.modelo.mesaExploracion!;
    expect(confirmado.modelo.entidades[confirmado.targetId]?.nombre).toBe("Solicitud");
    expect(meta.propuestas[p.propuestaId]).toMatchObject({
      estado: "confirmada",
      confirmacionId: confirmado.confirmacionId,
    });
    expect(meta.confirmaciones[confirmado.confirmacionId]).toMatchObject({
      propuestaId: p.propuestaId,
      fuenteIds: [f1.fuenteId, f2.fuenteId],
      trazoIds: [t.trazoId],
      targets: [{ tipo: "entidad", id: confirmado.targetId, opdId: confirmado.modelo.opdRaizId }],
    });
  });

  test("el hecho confirmado conserva simetría OPD→OPL→plan inverso y la capa meta no se emite", () => {
    const materialPreformal = "MATERIAL-PREFORMAL-QUE-NO-ES-OPL";
    const f = fuente(crearModelo("Bimodal"), materialPreformal);
    const t = trazo(f.modelo, [f.fuenteId], "trazo preformal no canónico");
    const p = propuesta(t.modelo, [t.trazoId], "objeto", "Solicitud trazable");
    const confirmado = must(confirmarPropuestaExploracion(p.modelo, p.propuestaId, AHORA));

    const opl = generarOpl(confirmado.modelo, confirmado.modelo.opdRaizId).join("\n");
    const planInverso = planificarEdicionOplLibre(confirmado.modelo, opl, {
      opdActivoId: confirmado.modelo.opdRaizId,
    });

    expect(opl).toContain("**Solicitud trazable** es un objeto");
    expect(opl).not.toContain(materialPreformal);
    expect(opl).not.toContain("trazo preformal no canónico");
    expect(planInverso.patches).toEqual([]);
    expect(planInverso.diagnosticos.filter((item) => item.severidad === "error")).toEqual([]);
  });

  test("un cambio ontológico que altera el hecho vuelve obsoleta la propuesta hasta revisarla", () => {
    const f = fuente(crearModelo("Ontología transaccional"), "Existe un pedido");
    const t = trazo(f.modelo, [f.fuenteId], "un pedido");
    const p = propuesta(t.modelo, [t.trazoId], "objeto", "Pedido");
    const conOntologia = must(definirOntologiaOrganizacional(p.modelo, {
      modo: "enforce",
      terminos: [{ canonico: "Solicitud", sinonimos: ["Pedido"] }],
    }));

    const previewObsoleto = previsualizarPropuestaExploracion(conOntologia, p.propuestaId);
    const confirmacionObsoleta = confirmarPropuestaExploracion(conOntologia, p.propuestaId, AHORA);

    expect(previewObsoleto.ok).toBe(false);
    expect(confirmacionObsoleta.ok).toBe(false);
    if (!previewObsoleto.ok) expect(previewObsoleto.error).toContain("cambió");

    const revisado = must(editarPropuestaExploracion(conOntologia, p.propuestaId, {
      entidadTipo: "objeto",
      nombre: "Pedido",
    }));
    const previewRevisado = must(previsualizarPropuestaExploracion(revisado, p.propuestaId));
    expect(previewRevisado.modelo.entidades[previewRevisado.targetId]?.nombre).toBe("Solicitud");
  });

  test("cambiar solo la descripción ontológica no invalida una propuesta", () => {
    let modelo = crearModelo("Ontología sin ruido");
    modelo = must(definirOntologiaOrganizacional(modelo, {
      modo: "enforce",
      terminos: [{ canonico: "Solicitud", sinonimos: ["Pedido"], descripcion: "Versión inicial" }],
    }));
    const f = fuente(modelo, "Existe un pedido");
    const t = trazo(f.modelo, [f.fuenteId], "un pedido");
    const p = propuesta(t.modelo, [t.trazoId], "objeto", "Pedido");
    const soloDescripcion = must(definirOntologiaOrganizacional(p.modelo, {
      modo: "enforce",
      terminos: [{ canonico: "Solicitud", sinonimos: ["Pedido"], descripcion: "Texto editorial nuevo" }],
    }));

    const preview = must(previsualizarPropuestaExploracion(soloDescripcion, p.propuestaId));
    expect(preview.modelo.entidades[preview.targetId]?.nombre).toBe("Solicitud");
  });

  test("rechaza una propuesta obsoleta tras un cambio semántico", () => {
    const f = fuente(crearModelo("Stale"), "Existe una solicitud");
    const t = trazo(f.modelo, [f.fuenteId], "solicitud");
    const p = propuesta(t.modelo, [t.trazoId]);
    const cambiado = must(crearObjeto(p.modelo, p.modelo.opdRaizId, { x: 20, y: 20 }, "Otro objeto"));

    const resultado = confirmarPropuestaExploracion(cambiado, p.propuestaId, AHORA);
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("cambió");
    expect(Object.values(cambiado.entidades).some((item) => item.nombre === "Solicitud")).toBe(false);
    expect(cambiado.mesaExploracion?.propuestas[p.propuestaId]?.estado).toBe("pendiente");
  });

  test("una revisión explícita rebasa la propuesta obsoleta y permite confirmarla", () => {
    const f = fuente(crearModelo("Recuperar stale"), "Existe una solicitud");
    const t = trazo(f.modelo, [f.fuenteId], "solicitud");
    const p = propuesta(t.modelo, [t.trazoId]);
    const cambiado = must(crearObjeto(p.modelo, p.modelo.opdRaizId, { x: 20, y: 20 }, "Contexto nuevo"));
    expect(confirmarPropuestaExploracion(cambiado, p.propuestaId, AHORA).ok).toBe(false);

    const revisado = must(editarPropuestaExploracion(cambiado, p.propuestaId, {
      entidadTipo: "objeto",
      nombre: "Solicitud revisada",
    }));
    const resultado = confirmarPropuestaExploracion(revisado, p.propuestaId, AHORA);

    expect(resultado.ok).toBe(true);
    if (resultado.ok) expect(resultado.value.modelo.entidades[resultado.value.targetId]?.nombre).toBe("Solicitud revisada");
  });

  test("permite confirmar tras un cambio exclusivamente de layout", () => {
    let modelo = crearModelo("Layout");
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 20 }, "Existente"));
    const f = fuente(modelo, "Existe una solicitud");
    const t = trazo(f.modelo, [f.fuenteId], "solicitud");
    const p = propuesta(t.modelo, [t.trazoId]);
    const [aparienciaId, apariencia] = Object.entries(p.modelo.opds[p.modelo.opdRaizId]!.apariencias)[0]!;
    const soloLayout: Modelo = {
      ...p.modelo,
      opds: {
        ...p.modelo.opds,
        [p.modelo.opdRaizId]: {
          ...p.modelo.opds[p.modelo.opdRaizId]!,
          apariencias: {
            ...p.modelo.opds[p.modelo.opdRaizId]!.apariencias,
            [aparienciaId]: { ...apariencia, x: apariencia.x + 137 },
          },
        },
      },
    };

    expect(firmaSnapshotSubmodelo(soloLayout)).toBe(firmaSnapshotSubmodelo(p.modelo));
    const resultado = confirmarPropuestaExploracion(soloLayout, p.propuestaId, AHORA);
    expect(resultado.ok).toBe(true);
    if (resultado.ok) expect(resultado.value.modelo.entidades[resultado.value.targetId]?.nombre).toBe("Solicitud");
  });
});
