import { describe, expect, test } from "bun:test";
import { crearModelo } from "./operaciones/creacion";
import { crearOpdSuelto } from "./operaciones/opdSuelto";
import { deriveDocumentPolicy } from "./documentPolicy";

describe("deriveDocumentPolicy", () => {
  test("conserva especie previa y no infiere modalidad ni permisos desde el nombre", () => {
    const model = crearModelo("Biblioteca apunte existente");

    const apunte = deriveDocumentPolicy({ ...model, esApunte: true });
    const library = deriveDocumentPolicy({ ...model, esBiblioteca: true });
    const unlockedLibrary = deriveDocumentPolicy({ ...model, esBiblioteca: true, readOnly: false });
    const summary = deriveDocumentPolicy({ id: model.id, esApunte: true });

    expect(apunte.profile.species).toBe("apunte");
    expect(apunte.modality).toBe("sin-declarar");
    expect(apunte.actions.canGraduateApunte).toBe(true);
    expect(library.actions.edit).toBe("read-only-by-default");
    expect(unlockedLibrary.actions.edit).toBe("available");
    expect(summary.ownership).toBe("indeterminada");
    expect(summary.actions.edit).toBe("indeterminate");
  });

  test("deriva propiedad upstream, OPD suelto, supuestos y pendientes sin modificar el modelo", () => {
    const base = crearModelo("Documento");
    const suelto = crearOpdSuelto(base, "Boceto de proceso");
    const document = {
      ...suelto.modelo,
      procedencia: { protoHash: "hash", autoriaVersion: "1", layoutVersion: "1" },
      fichaTrabajo: { modalidad: "propuesto" as const },
      declaracionesNoNucleares: {
        h1: {
          id: "h1", clase: "restriccion" as const, afirmacion: "Supuesto abierto", targets: [{ tipo: "modelo" as const }],
          propietarioSemantico: "equipo", procedencia: [], estadoAsercion: "hipotesis" as const,
        },
      },
      notasMesa: { n1: { id: "n1", target: { tipo: "modelo" as const }, texto: "Verificar alcance", fecha: "2026-09-01" } },
    };
    const before = JSON.stringify(document);

    const policy = deriveDocumentPolicy(document);

    expect(policy.ownership).toBe("upstream");
    expect(policy.modality).toBe("propuesto");
    expect(policy.profile.looseOpdIds).toEqual([suelto.opdId]);
    expect(policy.pending.map(({ kind }) => kind)).toContain("opd-suelto");
    expect(policy.pending.map(({ kind }) => kind)).toContain("declaracion");
    expect(policy.pending.map(({ kind }) => kind)).not.toContain("nota-mesa");
    expect(policy.contextNotes).toEqual([{ id: "n1", label: "Verificar alcance" }]);
    expect(policy.actions.edit).toBe("upstream-owned");
    expect(JSON.stringify(document)).toBe(before);
  });
});
