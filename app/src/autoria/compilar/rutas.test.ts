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

  test("no desdobla una condición canónica y conserva su ruta", () => {
    const proto = `# SD0

\`\`\`opl
Pedido es informacional y sistémico.
Procesar es un proceso físico y sistémico.
Por ruta condición, Procesar ocurre si Pedido está en \`abierto\`, en cuyo caso Procesar cambia Pedido de \`abierto\` a \`cerrado\`, de lo contrario Procesar se omite.
\`\`\``;
    const compilado = compilarProto(proto, { id: "ruta-condicion", nombre: "Ruta condición" });

    expect(compilado.resumen.rechazadas).toBe(0);
    expect(compilado.resumen.fallos).toBe(0);
    expect(Object.values(compilado.modelo.enlaces)).toEqual([
      expect.objectContaining({
        tipo: "efecto",
        modificador: "condicion",
        rutaEtiqueta: "condición",
        estadoEntradaId: expect.any(String),
        estadoSalidaId: expect.any(String),
      }),
    ]);

    const condicion = "Por ruta condición, *Procesar* ocurre si **Pedido** está en `abierto`, en cuyo caso *Procesar* cambia **Pedido** de `abierto` a `cerrado`, de lo contrario *Procesar* se omite.";
    const opl = generarOpl(compilado.modelo);
    expect(opl).toContain(condicion);

    const vacio = crearModelo("reverse-ruta-condicion");
    const preview = planificarEdicionOplLibre(vacio, opl.join("\n"), { opdActivoId: vacio.opdRaizId });
    expect(preview.diagnosticos.filter((diagnostico) => diagnostico.severidad === "error")).toEqual([]);
    const recuperado = must(aplicarPatchesOpl(vacio, preview.patches, vacio.opdRaizId));
    expect(efectoUnico(recuperado)).toEqual(expect.objectContaining({
      modificador: "condicion",
      rutaEtiqueta: "condición",
      estadoEntradaId: expect.any(String),
      estadoSalidaId: expect.any(String),
    }));
    expect(generarOpl(recuperado)).toContain(condicion);
  });

  test("preserva una condición canónica con estado solo de salida", () => {
    const proto = `# SD0

\`\`\`opl
Pedido es informacional y sistémico.
Pedido puede estar \`abierto\` o \`cerrado\`.
Procesar es un proceso físico y sistémico.
Por ruta cierre, Procesar ocurre si Pedido existe, en cuyo caso Procesar cambia Pedido a \`cerrado\`, de lo contrario Procesar se omite.
\`\`\``;
    const compilado = compilarProto(proto, { id: "ruta-condicion-salida", nombre: "Ruta condición salida" });

    expect(compilado.resumen.rechazadas).toBe(0);
    expect(compilado.resumen.fallos).toBe(0);
    expect(efectoUnico(compilado.modelo)).toEqual(expect.objectContaining({
      modificador: "condicion",
      rutaEtiqueta: "cierre",
      estadoSalidaId: expect.any(String),
    }));

    const condicion = "Por ruta cierre, *Procesar* ocurre si **Pedido** existe, en cuyo caso *Procesar* cambia **Pedido** a `cerrado`, de lo contrario *Procesar* se omite.";
    const opl = generarOpl(compilado.modelo);
    expect(opl).toContain(condicion);

    const vacio = crearModelo("reverse-ruta-condicion-salida");
    const preview = planificarEdicionOplLibre(vacio, opl.join("\n"), { opdActivoId: vacio.opdRaizId });
    expect(preview.diagnosticos.filter((diagnostico) => diagnostico.severidad === "error")).toEqual([]);
    const recuperado = must(aplicarPatchesOpl(vacio, preview.patches, vacio.opdRaizId));
    const efecto = efectoUnico(recuperado);
    expect(efecto).toEqual(expect.objectContaining({
      modificador: "condicion",
      rutaEtiqueta: "cierre",
      estadoSalidaId: expect.any(String),
    }));
    expect(efecto.estadoEntradaId).toBeUndefined();
    expect(generarOpl(recuperado)).toContain(condicion);
  });

  test("conserva la ruta en un evento con estado", () => {
    const proto = `# SD0

\`\`\`opl
Pedido es informacional y sistémico.
Pedido puede estar \`abierto\` o \`cerrado\`.
Procesar es un proceso físico y sistémico.
Por ruta evento, Pedido en \`abierto\` inicia Procesar, que consume Pedido en \`abierto\`.
\`\`\``;
    const compilado = compilarProto(proto, { id: "ruta-evento", nombre: "Ruta evento" });

    expect(compilado.resumen.rechazadas).toBe(0);
    expect(compilado.resumen.fallos).toBe(0);
    expect(Object.values(compilado.modelo.enlaces)).toEqual([
      expect.objectContaining({
        tipo: "consumo",
        modificador: "evento",
        rutaEtiqueta: "evento",
      }),
    ]);
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
