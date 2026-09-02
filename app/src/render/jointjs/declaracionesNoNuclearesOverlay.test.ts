import { describe, expect, test } from "bun:test";
import { crearAutor } from "../../autoria";
import { proyectarModeloAJointCells } from "./proyeccion";

describe("overlay de contratos y fronteras no nucleares", () => {
  test("hace visible en el OPD una declaración tipada sin convertirla en cosa OPM", () => {
    const autor = crearAutor({ id: "contratos", nombre: "Contratos" });
    autor.entidad("unidad", "objeto", "Unidad", "fisica", "sistemica");
    autor.entidad("provision", "proceso", "Provisión", "fisica", "sistemica");
    autor.opd("sd0", "SD0", null);
    autor.ver("sd0", "unidad", 40, 40);
    autor.ver("sd0", "provision", 320, 40);
    autor.enlazar("sd0", "unidad", "provision", "exhibicion");
    autor.modelo.declaracionesNoNucleares = {
      "C04-RESP-A01": {
        id: "C04-RESP-A01",
        clase: "restriccion",
        afirmacion: "La responsabilidad cambia solo bajo el contrato propietario A01.",
        targets: [{ tipo: "opd", id: autor.idOpd("sd0") }],
        propietarioSemantico: "A01",
        procedencia: ["a01-bootstrap-trayectoria-responsabilidad.md"],
        estadoAsercion: "ratificada",
        estadoEvaluacion: "no-evaluada",
      },
    };

    const cells = proyectarModeloAJointCells(autor.modelo, autor.idOpd("sd0"), null, null);
    const overlay = cells.find((cell) => cell.opm.kind === "overlay-declaracion-no-nuclear");

    expect(overlay?.type).toBe("standard.Rectangle");
    expect(overlay?.opm).toMatchObject({
      kind: "overlay-declaracion-no-nuclear",
      declaracionId: "C04-RESP-A01",
      clase: "restriccion",
      estadoAsercion: "ratificada",
      estadoEvaluacion: "no-evaluada",
    });
    expect(((overlay?.attrs as { label?: { text?: string } } | undefined)?.label?.text)).toBe(
      "CONTRATO NO NUCLEAR · C04-RESP-A01 · restricción · ratificada · no evaluada\n" +
      "Propietario: A01\n" +
      "La responsabilidad cambia solo bajo el contrato propietario A01.",
    );
    expect(((overlay?.attrs as { label?: { lineHeight?: unknown } } | undefined)?.label?.lineHeight)).toBe("1.35em");
    expect(cells.filter((cell) => cell.opm.kind === "entidad")).toHaveLength(2);
  });
});
