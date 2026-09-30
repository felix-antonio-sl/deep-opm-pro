import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones/creacion";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { migrateDocument } from "./documentMigration";

describe("migrateDocument", () => {
  test("reconoce las especies legadas sólo desde flags y no las reescribe", () => {
    const json = exportarModelo(crearModelo("Mismo nombre"));
    const casos = [
      [{ esApunte: true }, "apunte"],
      [{ esApunte: false }, "modelo"],
      [{ esBiblioteca: true }, "biblioteca"],
      [{}, "desconocida"],
    ] as const;

    for (const [record, expected] of casos) {
      const result = migrateDocument({ json, ...record });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.value.sourceProfile.species).toBe(expected);
    }
  });

  test("mantiene ids, OPD suelto, procedencia y ficha al serializar y reabrir", () => {
    const loose = crearOpdSuelto(crearModelo("Continuidad"), "Bosquejo");
    const model = {
      ...loose.modelo,
      procedencia: { protoHash: "proto-1", autoriaVersion: "2", layoutVersion: "3" },
      fichaTrabajo: {
        preguntaHabilitante: "¿Qué representar?",
        modalidad: "exploratorio" as const,
        revisionesHumanas: [{ actorId: "persona-1", revision: 4, scope: [loose.opdId], outcome: "abierto" as const, revisadoEn: "2026-09-20" }],
      },
    };
    const original = exportarModelo(model);
    const result = migrateDocument(original);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const reopened = hidratarModelo(exportarModelo(result.value.document));
    expect(reopened.ok).toBe(true);
    if (!reopened.ok) return;
    expect(reopened.value.id).toBe(model.id);
    expect(Object.keys(reopened.value.opds)).toEqual(Object.keys(model.opds));
    expect(reopened.value.opds[loose.opdId]?.padreId).toBeNull();
    expect(reopened.value.procedencia).toEqual(model.procedencia);
    expect(reopened.value.fichaTrabajo).toEqual(model.fichaTrabajo);
    expect(result.value.sourceProfile.looseOpdIds).toEqual([loose.opdId]);
    expect(result.value.recoverableOriginal).toBe(original);
  });

  test("devuelve el texto original exacto y avisa sobre campos sin representación", () => {
    const base = JSON.parse(exportarModelo(crearModelo("Con campo legado"))) as { modelo: Record<string, unknown> };
    const originalId = base.modelo.id as string;
    base.modelo.campoSinSucesor = { dato: "recuperable" };
    const original = `\n${JSON.stringify(base, null, 1)}\n`;
    const result = migrateDocument(original);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.recoverableOriginal).toBe(original);
    expect(result.value.unrepresentedData).toContainEqual({ path: "modelo.campoSinSucesor", value: { dato: "recuperable" } });
    expect(result.value.differences.join(" ")).toContain("sólo pueden recuperarse desde el original");
    expect(result.value.document.id).toBe(originalId);
  });

  test("no gradúa ni certifica al abrir un Apunte con OPD suelto", () => {
    const loose = crearOpdSuelto(crearModelo("Borrador"), "Boceto");
    const result = migrateDocument({ json: exportarModelo(loose.modelo), esApunte: true });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.sourceProfile.species).toBe("apunte");
    expect(result.value.document.opds[loose.opdId]?.padreId).toBeNull();
    expect(result.value.document.fichaTrabajo?.revisionesHumanas).toBeUndefined();
  });
});
