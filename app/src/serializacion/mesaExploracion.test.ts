import { describe, expect, test } from "bun:test";
import {
  agregarFuenteExploracion,
  agregarTrazoExploracion,
  confirmarPropuestaExploracion,
  crearPropuestaExploracion,
} from "../modelo/mesaExploracion";
import { crearModelo, crearOpdSuelto, eliminarEntidad } from "../modelo/operaciones";
import { eliminarOpdHoja } from "../modelo/opdEliminacion";
import type { Modelo, Resultado } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";
import { filtrarModeloPorPerfil } from "./perfilesExport";

const AHORA = "2026-08-31T10:00:00.000Z";

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function conMesaConfirmada(): Modelo {
  let modelo = crearModelo("Roundtrip mesa");
  const fuente = must(agregarFuenteExploracion(modelo, { titulo: "Relato", contenido: "Existe una solicitud" }, AHORA));
  modelo = fuente.modelo;
  const trazo = must(agregarTrazoExploracion(modelo, { fuenteIds: [fuente.fuenteId], texto: "una solicitud" }, AHORA));
  modelo = trazo.modelo;
  const propuesta = must(crearPropuestaExploracion(modelo, {
    trazoIds: [trazo.trazoId],
    operacion: { tipo: "crear-entidad", entidadTipo: "objeto", nombre: "Solicitud", opdId: modelo.opdRaizId },
  }, AHORA));
  return must(confirmarPropuestaExploracion(propuesta.modelo, propuesta.propuestaId, AHORA)).modelo;
}

describe("serialización Mesa de exploración", () => {
  test("roundtrip preserva fuente, trazos, propuesta, hecho y recibo de proveniencia", () => {
    const original = conMesaConfirmada();
    const hidratado = must(hidratarModelo(exportarModelo(original)));

    expect(hidratado.mesaExploracion).toEqual(original.mesaExploracion);
    const recibo = Object.values(hidratado.mesaExploracion!.confirmaciones)[0]!;
    expect(hidratado.entidades[recibo.targets[0]!.id]?.nombre).toBe("Solicitud");
  });

  test("roundtrip conserva el tipo y los bytes UTF-8 originales de una fuente Markdown", () => {
    const originalBytes = "\uFEFF# Retiro\r\n\r\nCamión y distribución.";
    const added = must(agregarFuenteExploracion(crearModelo("Markdown"), {
      titulo: "pedido.md",
      contenido: originalBytes,
      mediaType: "text/markdown",
    }, AHORA));

    const hydrated = must(hidratarModelo(exportarModelo(added.modelo)));
    const source = hydrated.mesaExploracion?.fuentes[added.fuenteId];

    expect(source).toMatchObject({ mediaType: "text/markdown", contenido: originalBytes });
    expect(new TextEncoder().encode(source?.contenido)).toEqual(new TextEncoder().encode(originalBytes));
  });

  test("un modelo sin Mesa no gana la extensión opcional", () => {
    const json = exportarModelo(crearModelo("Limpio"));
    expect(json).not.toContain("mesaExploracion");
    expect(must(hidratarModelo(json)).mesaExploracion).toBeUndefined();
  });

  test("rechaza un trazo que referencia una fuente ausente", () => {
    const json = exportarModelo(conMesaConfirmada());
    const documento = JSON.parse(json) as { modelo: Modelo };
    const trazo = Object.values(documento.modelo.mesaExploracion!.trazos)[0]!;
    trazo.fuenteIds = ["fuente-ausente"];

    const resultado = hidratarModelo(JSON.stringify(documento));
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("fuente");
  });

  test("rechaza una confirmación que atribuye una fuente existente pero ajena a sus trazos", () => {
    const confirmado = conMesaConfirmada();
    const extra = must(agregarFuenteExploracion(
      confirmado,
      { contenido: "Fuente real, pero ajena a la propuesta confirmada" },
      AHORA,
    ));
    const documento = JSON.parse(exportarModelo(extra.modelo)) as { modelo: Modelo };
    const recibo = Object.values(documento.modelo.mesaExploracion!.confirmaciones)[0]!;
    recibo.fuenteIds = [extra.fuenteId];

    const resultado = hidratarModelo(JSON.stringify(documento));
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("fuenteIds");
  });

  test("rechaza confirmaciones v1 con más de un target", () => {
    const documento = JSON.parse(exportarModelo(conMesaConfirmada())) as { modelo: Modelo };
    const recibo = Object.values(documento.modelo.mesaExploracion!.confirmaciones)[0]!;
    recibo.targets.push({
      tipo: "entidad",
      id: "target-adicional-no-producido",
      opdId: documento.modelo.opdRaizId,
    });

    const resultado = hidratarModelo(JSON.stringify(documento));
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("un solo target");
  });

  test("rechaza una propuesta pendiente cuyo OPD ya no existe", () => {
    let modelo = crearModelo("Pendiente colgante");
    const boceto = crearOpdSuelto(modelo, "Boceto temporal");
    modelo = boceto.modelo;
    const fuente = must(agregarFuenteExploracion(modelo, { contenido: "Existe una solicitud" }, AHORA));
    const trazo = must(agregarTrazoExploracion(fuente.modelo, {
      fuenteIds: [fuente.fuenteId],
      texto: "una solicitud",
    }, AHORA));
    const propuesta = must(crearPropuestaExploracion(trazo.modelo, {
      trazoIds: [trazo.trazoId],
      operacion: {
        tipo: "crear-entidad",
        entidadTipo: "objeto",
        nombre: "Solicitud",
        opdId: boceto.opdId,
      },
    }, AHORA));
    const documento = JSON.parse(exportarModelo(propuesta.modelo)) as { modelo: Modelo };
    delete documento.modelo.opds[boceto.opdId];

    const resultado = hidratarModelo(JSON.stringify(documento));
    expect(resultado.ok).toBe(false);
    if (!resultado.ok) expect(resultado.error).toContain("opdId");
  });

  test("conserva un recibo confirmado aunque después se retire su OPD", () => {
    let modelo = crearModelo("Hecho histórico");
    const boceto = crearOpdSuelto(modelo, "Boceto confirmado");
    modelo = boceto.modelo;
    const fuente = must(agregarFuenteExploracion(modelo, { contenido: "Existe una solicitud" }, AHORA));
    const trazo = must(agregarTrazoExploracion(fuente.modelo, {
      fuenteIds: [fuente.fuenteId],
      texto: "una solicitud",
    }, AHORA));
    const propuesta = must(crearPropuestaExploracion(trazo.modelo, {
      trazoIds: [trazo.trazoId],
      operacion: {
        tipo: "crear-entidad",
        entidadTipo: "objeto",
        nombre: "Solicitud",
        opdId: boceto.opdId,
      },
    }, AHORA));
    const confirmado = must(confirmarPropuestaExploracion(propuesta.modelo, propuesta.propuestaId, AHORA));
    const retirado = must(eliminarOpdHoja(confirmado.modelo, boceto.opdId));

    const hidratado = must(hidratarModelo(exportarModelo(retirado.modelo)));
    const recibo = Object.values(hidratado.mesaExploracion!.confirmaciones)[0]!;
    expect(hidratado.opds[boceto.opdId]).toBeUndefined();
    expect(hidratado.entidades[recibo.targets[0]!.id]).toBeUndefined();
    expect(recibo.targets[0]!.opdId).toBe(boceto.opdId);
  });

  test("eliminar el hecho conserva y rehidrata la fuente, el trazo y el recibo histórico", () => {
    const confirmado = conMesaConfirmada();
    const recibo = Object.values(confirmado.mesaExploracion!.confirmaciones)[0]!;
    const sinHecho = must(eliminarEntidad(confirmado, recibo.targets[0]!.id));
    expect(sinHecho.entidades[recibo.targets[0]!.id]).toBeUndefined();

    const hidratado = must(hidratarModelo(exportarModelo(sinHecho)));
    expect(hidratado.mesaExploracion?.fuentes).toEqual(sinHecho.mesaExploracion?.fuentes);
    expect(hidratado.mesaExploracion?.trazos).toEqual(sinHecho.mesaExploracion?.trazos);
    expect(hidratado.mesaExploracion?.confirmaciones).toEqual(sinHecho.mesaExploracion?.confirmaciones);
  });

  test("perfiles canónicos excluyen la capa meta e intercambio la conserva", () => {
    const modelo = conMesaConfirmada();
    expect(filtrarModeloPorPerfil(modelo, "canon-diagrama").mesaExploracion).toBeUndefined();
    expect(filtrarModeloPorPerfil(modelo, "canon-documento").mesaExploracion).toBeUndefined();
    expect(filtrarModeloPorPerfil(modelo, "intercambio").mesaExploracion).toBe(modelo.mesaExploracion);
  });
});
