import { describe, expect, test } from "bun:test";
import { hidratarModelo } from "../../serializacion/json";
import { emitirBundle } from "../bundle";
import { compilarProto } from "./compilador";

const PROTO = `# SD0 — Decidir

\`\`\`opl
Decidir es un proceso informacional y sistémico.
\`\`\`
`;

describe("ficha upstream — proto, compilador y bundle", () => {
  test("normaliza la declaración tipada y la conserva con procedencia", () => {
    const compilado = compilarProto(PROTO, {
      id: "decision",
      nombre: "Decisión",
      fichaTrabajo: {
        preguntaHabilitante: "  ¿Qué decisión debe habilitar?  ",
        responsableDecision: "  Comité  ",
        tiposModelo: ["realizacion", "dominio", "realizacion"],
        vidaUtil: "referencia-viva",
      },
      lentesConocimiento: ["salud", "sistemas", "salud"],
    });

    expect(compilado.modelo.fichaTrabajo).toEqual({
      preguntaHabilitante: "¿Qué decisión debe habilitar?",
      responsableDecision: "Comité",
      tiposModelo: ["dominio", "realizacion"],
      vidaUtil: "referencia-viva",
    });
    expect(compilado.modelo.lentesConocimiento).toEqual(["sistemas", "salud"]);

    const bundle = emitirBundle(compilado.autor, {
      lanzarEnError: false,
      procedencia: {
        protoHash: "sha256-proto",
        autoriaVersion: "2",
        layoutVersion: "1",
      },
    });
    const hidratado = hidratarModelo(bundle.json);
    expect(hidratado.ok).toBeTrue();
    if (!hidratado.ok) return;
    expect(hidratado.value.fichaTrabajo).toEqual(compilado.modelo.fichaTrabajo);
    expect(hidratado.value.lentesConocimiento).toEqual(["sistemas", "salud"]);
    expect(hidratado.value.procedencia?.protoHash).toBe("sha256-proto");
  });

  test("legacy no materializa ficha ni lentes", () => {
    const compilado = compilarProto(PROTO, { id: "legacy" });
    expect(compilado.modelo.fichaTrabajo).toBeUndefined();
    expect(compilado.modelo.lentesConocimiento).toBeUndefined();
  });
});
