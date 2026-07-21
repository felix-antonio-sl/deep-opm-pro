import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones";
import { generarOpl } from "../../opl/generar";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "../../opl/parser";
import { hidratarModelo } from "../../serializacion/json";
import type { Enlace, Modelo, Resultado } from "../../modelo/tipos";
import { emitirBundle } from "../bundle";
import { compilarProto } from "./compilador";

const PROTO_RUTA_TS3 = `# SD0

\`\`\`opl
Nivel de Servicio es informacional y ambiental.
Nivel de Servicio puede estar \`bajo\`, \`medio\` o \`alto\`.
Prestar Servicio es física y sistémica.
Plan de Servicio es informacional y sistémico.
Prestar Servicio requiere Plan de Servicio.
Por ruta elevar servicio, Prestar Servicio cambia Nivel de Servicio de \`bajo\` a \`alto\`.
\`\`\``;

describe("compilación de rutas sobre efectos TS3 compactos", () => {
  test("preserva la ruta en proto → modelo → OPL → reverse", () => {
    const compilado = compilarProto(PROTO_RUTA_TS3, { id: "ruta-ts3", nombre: "Ruta TS3" });
    expect(compilado.resumen.fallos).toBe(0);

    const efecto = efectoUnico(compilado.modelo);
    expect(efecto.rutaEtiqueta).toBe("elevar servicio");

    const bundle = emitirBundle(compilado.autor, { lanzarEnError: false });
    const hidratado = must(hidratarModelo(bundle.json));
    expect(efectoUnico(hidratado).rutaEtiqueta).toBe("elevar servicio");

    const opl = generarOpl(hidratado);
    const transicion = "Por ruta elevar servicio, *Prestar Servicio* cambia **Nivel de Servicio** de `bajo` a `alto`.";
    expect(opl).toContain(transicion);

    const vacio = crearModelo("reverse-ruta-ts3");
    const preview = planificarEdicionOplLibre(vacio, opl.join("\n"), { opdActivoId: vacio.opdRaizId });
    expect(preview.diagnosticos.filter((diagnostico) => diagnostico.severidad === "error")).toEqual([]);

    const recuperado = must(aplicarPatchesOpl(vacio, preview.patches, vacio.opdRaizId));
    expect(efectoUnico(recuperado).rutaEtiqueta).toBe("elevar servicio");
    expect(generarOpl(recuperado)).toContain(transicion);
  });
});

function efectoUnico(modelo: Modelo): Enlace {
  const efectos = Object.values(modelo.enlaces).filter((enlace) => enlace.tipo === "efecto");
  expect(efectos).toHaveLength(1);
  return efectos[0]!;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
