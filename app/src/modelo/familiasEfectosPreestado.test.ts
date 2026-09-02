import { describe, expect, test } from "bun:test";
import { definirRutaEtiqueta } from "./rutas";
import {
  agregarEstado,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  renombrarEstado,
} from "./operaciones";
import type { FamiliaEfectosPreestado, Id, Modelo, Resultado } from "./tipos";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { generarOpl } from "../opl/generar";
import { aplicarPatchesOpl, planificarEdicionOplLibre } from "../opl/parser";
import { proyectarModeloAJointCells } from "../render/jointjs/proyeccion";
import { compilarProto } from "../autoria/compilar/compilador";

type ModeloFixture = Modelo & {
  familiasEfectosPreestado?: Record<Id, FamiliaEfectosPreestado>;
};

describe("familia de efectos indexada por preestado (extensión declarada)", () => {
  test("round-trip JSON conserva identidad, dominio, membresía y cobertura", () => {
    const modelo = modeloConFamilia();

    const hidratado = must(hidratarModelo(exportarModelo(modelo))) as ModeloFixture;

    expect(hidratado.familiasEfectosPreestado?.F_C01).toEqual(
      (modelo as ModeloFixture).familiasEfectosPreestado?.F_C01,
    );
  });

  test("hidratación rechaza una familia que no constituye una partición válida", () => {
    const casos: Array<{
      nombre: string;
      mutar: (modelo: ModeloFixture) => void;
    }> = [
      {
        nombre: "miembro repetido",
        mutar: (modelo) => {
          const familia = familiaDe(modelo);
          familia.enlaceIds[1] = familia.enlaceIds[0]!;
        },
      },
      {
        nombre: "dos miembros para el mismo preestado",
        mutar: (modelo) => {
          const familia = familiaDe(modelo);
          const primero = modelo.enlaces[familia.enlaceIds[0]!]!;
          const segundo = modelo.enlaces[familia.enlaceIds[1]!]!;
          if (!primero.estadoEntradaId) throw new Error("Fixture sin preestado");
          segundo.estadoEntradaId = primero.estadoEntradaId;
        },
      },
      {
        nombre: "cobertura total con dominio incompleto",
        mutar: (modelo) => {
          familiaDe(modelo).dominioEstadoIds.pop();
        },
      },
      {
        nombre: "miembro sin ruta estable",
        mutar: (modelo) => {
          const familia = familiaDe(modelo);
          delete modelo.enlaces[familia.enlaceIds[0]!]!.rutaEtiqueta;
        },
      },
    ];

    for (const caso of casos) {
      const documento = JSON.parse(exportarModelo(modeloConFamilia())) as { modelo: ModeloFixture };
      caso.mutar(documento.modelo);

      const resultado = hidratarModelo(JSON.stringify(documento));

      expect(resultado.ok, caso.nombre).toBe(false);
      if (!resultado.ok) expect(resultado.error).toContain("Familia de efectos por preestado");
    }
  });

  test("OPL declara la extensión, su cobertura y cada preestado-ruta-salida", () => {
    const opl = generarOpl(modeloConFamilia());

    expect(opl).toContain(
      "[Extensión declarada: F_C01] La familia total indexada por preestado de *Proveer Atención* sobre **Grado de Cobertura** tiene dominio {`nulo`; `insuficiente`; `suficiente`} y comprende `nulo` —ruta `establecer cobertura`→ `suficiente`; `insuficiente` —ruta `completar cobertura`→ `suficiente`; `suficiente` —ruta `sostener cobertura`→ `suficiente`; exactamente un miembro aplica para el preestado real.",
    );
  });

  test("round-trip OPL reverse reconstruye la familia sin convertirla en abanico", () => {
    const original = modeloConFamilia();
    const oplOriginal = generarOpl(original);
    const vacio = crearModelo("Reverse familia por preestado");

    const preview = planificarEdicionOplLibre(vacio, oplOriginal.join("\n"), {
      opdActivoId: vacio.opdRaizId,
    });
    expect(preview.diagnosticos.filter((item) => item.severidad === "error")).toEqual([]);
    const recuperado = must(aplicarPatchesOpl(vacio, preview.patches, vacio.opdRaizId));
    const familia = (recuperado as ModeloFixture).familiasEfectosPreestado?.F_C01;

    expect(familia).toBeDefined();
    expect(Object.keys(recuperado.abanicos ?? {})).toHaveLength(0);
    expect(triplesFamilia(recuperado, familia!)).toEqual([
      "nulo|establecer cobertura|suficiente",
      "insuficiente|completar cobertura|suficiente",
      "suficiente|sostener cobertura|suficiente",
    ]);
    expect(generarOpl(recuperado)).toEqual(oplOriginal);
  });

  test("OPD muestra una agrupación declarada distinta de O, XOR y AND", () => {
    const modelo = modeloConFamilia();

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const overlay = cells.find((cell) => cell.opm.kind === "overlay-familia-preestado");

    expect(overlay?.type).toBe("standard.Rectangle");
    expect(overlay?.opm).toMatchObject({
      kind: "overlay-familia-preestado",
      familiaId: "F_C01",
      cobertura: "total",
    });
    expect(((overlay?.attrs as { label?: { text?: string } } | undefined)?.label?.text)).toBe(
      "EXTENSIÓN DECLARADA · F_C01 · partición total por preestado\nnulo → establecer cobertura → suficiente · insuficiente → completar cobertura → suficiente · suficiente → sostener cobertura → suficiente\nexactamente 1 miembro aplica para el preestado real",
    );
    expect(((overlay?.attrs as { label?: { lineHeight?: unknown } } | undefined)?.label?.lineHeight)).toBe("1.35em");
    const familia = familiaDe(modelo as ModeloFixture);
    const segmentosMiembro = cells.filter(
      (cell) => cell.opm.kind === "enlace" && cell.opm.segmentoTs3 && familia.enlaceIds.includes(cell.opm.enlaceId),
    );
    expect(segmentosMiembro).toHaveLength(6);
    expect(segmentosMiembro.every((cell) => ((cell.labels as unknown[] | undefined) ?? []).length === 0)).toBe(true);
    expect(cells.some((cell) => cell.opm.kind === "overlay-abanico")).toBe(false);
  });

  test("apila el contrato no nuclear después de la familia sin superponer overlays", () => {
    const modelo = modeloConFamilia();
    modelo.declaracionesNoNucleares = {
      "C04-FUNCION-C01": {
        id: "C04-FUNCION-C01",
        clase: "frontera",
        afirmacion: "C04 referencia la transformación que pertenece a C01.",
        targets: [{ tipo: "opd", id: modelo.opdRaizId }],
        propietarioSemantico: "C01",
        procedencia: ["c01-bootstrap-contrato-funcional.md"],
        estadoAsercion: "ratificada",
      },
    };

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const familia = cells.find((cell) => cell.opm.kind === "overlay-familia-preestado");
    const contrato = cells.find((cell) => cell.opm.kind === "overlay-declaracion-no-nuclear");
    const posicionFamilia = familia?.position as { y?: number } | undefined;
    const tamanoFamilia = familia?.size as { height?: number } | undefined;
    const posicionContrato = contrato?.position as { y?: number } | undefined;
    const fondoFamilia = (posicionFamilia?.y ?? 0) + (tamanoFamilia?.height ?? 0);

    expect(familia).toBeDefined();
    expect(contrato).toBeDefined();
    expect(posicionContrato?.y).toBeGreaterThanOrEqual(fondoFamilia + 16);
  });

  test("el compilador Proto emite la familia como hecho tipado recuperable", () => {
    const opl = generarOpl(modeloConFamilia()).join("\n");
    const proto = `# SD0 — Familia por preestado\n\n\`\`\`opl\n${opl}\n\`\`\`\n`;

    const compilado = compilarProto(proto, { id: "familia-proto", nombre: "Familia Proto" });

    expect(compilado.ledger.entradas.filter((entrada) => entrada.tipo === "fallo" || entrada.tipo === "rechazada")).toEqual([]);
    expect(compilado.modelo.familiasEfectosPreestado?.F_C01).toBeDefined();
    expect(triplesFamilia(compilado.modelo, compilado.modelo.familiasEfectosPreestado!.F_C01!)).toEqual([
      "nulo|establecer cobertura|suficiente",
      "insuficiente|completar cobertura|suficiente",
      "suficiente|sostener cobertura|suficiente",
    ]);
  });
});

function modeloConFamilia(): Modelo {
  let modelo = crearModelo("Familia por preestado");
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 320, y: 80 }, "Proveer Atención"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 40, y: 80 }, "Grado de Cobertura"));
  const procesoId = entidadId(modelo, "Proveer Atención");
  const objetoId = entidadId(modelo, "Grado de Cobertura");
  const iniciales = must(crearEstadosIniciales(modelo, objetoId));
  modelo = iniciales.modelo;
  const [nuloId, insuficienteId] = iniciales.estadoIds;
  if (!nuloId || !insuficienteId) throw new Error("Fixture requiere dos estados");
  modelo = must(renombrarEstado(modelo, nuloId, "nulo"));
  modelo = must(renombrarEstado(modelo, insuficienteId, "insuficiente"));
  const suficiente = must(agregarEstado(modelo, objetoId, "suficiente"));
  modelo = suficiente.modelo;

  const rutas = [
    { entradaId: nuloId, salidaId: suficiente.estadoId, ruta: "establecer cobertura" },
    { entradaId: insuficienteId, salidaId: suficiente.estadoId, ruta: "completar cobertura" },
    { entradaId: suficiente.estadoId, salidaId: suficiente.estadoId, ruta: "sostener cobertura" },
  ];
  const enlaceIds: Id[] = [];
  for (const ruta of rutas) {
    const previo = new Set(Object.keys(modelo.enlaces));
    modelo = must(crearEnlace(
      modelo,
      modelo.opdRaizId,
      procesoId,
      objetoId,
      "efecto",
      "",
      { estadoEntradaId: ruta.entradaId, estadoSalidaId: ruta.salidaId },
    ));
    const enlaceId = Object.keys(modelo.enlaces).find((id) => !previo.has(id));
    if (!enlaceId) throw new Error("Fixture no creó el efecto");
    modelo = must(definirRutaEtiqueta(modelo, enlaceId, ruta.ruta));
    enlaceIds.push(enlaceId);
  }

  const familia: FamiliaEfectosPreestado = {
    id: "F_C01",
    tipo: "particion-preestado",
    estatuto: "extension-declarada",
    opdId: modelo.opdRaizId,
    procesoId,
    objetoId,
    enlaceIds,
    dominioEstadoIds: [nuloId, insuficienteId, suficiente.estadoId],
    cobertura: "total",
    aplicacion: "exactamente-uno-por-preestado",
  };
  return {
    ...modelo,
    familiasEfectosPreestado: { [familia.id]: familia },
  } as ModeloFixture;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function familiaDe(modelo: ModeloFixture): FamiliaEfectosPreestado {
  const familia = modelo.familiasEfectosPreestado?.F_C01;
  if (!familia) throw new Error("Fixture sin familia F_C01");
  return familia;
}

function triplesFamilia(modelo: Modelo, familia: FamiliaEfectosPreestado): string[] {
  return familia.enlaceIds.map((enlaceId) => {
    const enlace = modelo.enlaces[enlaceId];
    const entrada = enlace?.estadoEntradaId ? modelo.estados[enlace.estadoEntradaId] : undefined;
    const salida = enlace?.estadoSalidaId ? modelo.estados[enlace.estadoSalidaId] : undefined;
    if (!enlace || !entrada || !salida || !enlace.rutaEtiqueta) throw new Error("Familia incompleta");
    return `${entrada.nombre}|${enlace.rutaEtiqueta}|${salida.nombre}`;
  });
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
