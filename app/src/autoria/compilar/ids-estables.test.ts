import { describe, expect, test } from "bun:test";
import type { Enlace, Modelo, Resultado } from "../../modelo/tipos";
import { entidadIdDeExtremo } from "../../modelo/extremos";
import { hidratarModelo } from "../../serializacion/json";
import { emitirBundle } from "../bundle";
import { compilarProto } from "./compilador";

const HECHOS_BASE = [
  "Solicitud es informacional y ambiental.",
  "Solicitud puede estar `pendiente`, `resuelta` o `cancelada`.",
  "Atender es física y sistémica.",
  "Plan es informacional y sistémico.",
  "Atender requiere Plan.",
  "Atender cambia Solicitud de `pendiente` a exactamente uno de `resuelta` o `cancelada`.",
];

describe("IDs propietarios del compilador proto", () => {
  test("no cambian ante inserciones no relacionadas", () => {
    const base = compilar(HECHOS_BASE);
    const conInsercion = compilar([
      "Registro es informacional y ambiental.",
      "Atender genera Registro.",
      "Entrega es informacional y ambiental.",
      "Entrega puede estar `inicial`, `completa` o `fallida`.",
      "Preparar es física y sistémica.",
      "Preparar cambia Entrega de `inicial` a exactamente uno de `completa` o `fallida`.",
      ...HECHOS_BASE,
    ]);

    expect(idsCompartidos(base, conInsercion)).toEqual(idsReferenciables(base));
  });

  test("no cambian al reordenar los mismos hechos", () => {
    const base = compilar(HECHOS_BASE);
    const reordenado = compilar([
      HECHOS_BASE[3]!,
      HECHOS_BASE[2]!,
      HECHOS_BASE[0]!,
      HECHOS_BASE[1]!,
      HECHOS_BASE[5]!,
      HECHOS_BASE[4]!,
    ]);

    expect(idsReferenciables(reordenado)).toEqual(idsReferenciables(base));
  });

  test("un enlace enriquecido conserva identidad sin depender de qué oración llegó primero", () => {
    const declaraciones = [
      "Pedido es físico y ambiental.",
      "Pedido puede estar `abierto` o `cerrado`.",
      "Procesar es un proceso físico y sistémico.",
    ];
    const requisitoPrimero = compilar([
      ...declaraciones,
      "Procesar requiere Pedido.",
      "Pedido en `abierto` inicia Procesar.",
    ]);
    const eventoPrimero = compilar([
      ...declaraciones,
      "Pedido en `abierto` inicia Procesar.",
      "Procesar requiere Pedido.",
    ]);

    expect(idsReferenciables(eventoPrimero)).toEqual(idsReferenciables(requisitoPrimero));
  });

  test("los OPD sin encabezado no dependen del ordinal de refinamiento", () => {
    const base = compilarSinEncabezados(["Atender", "Preparar"]);
    const conInsercion = compilarSinEncabezados(["Registrar", "Atender", "Preparar"]);

    expect(idOpdPorNombre(conInsercion, "In-zoom de Atender")).toBe(idOpdPorNombre(base, "In-zoom de Atender"));
    expect(idOpdPorNombre(conInsercion, "In-zoom de Preparar")).toBe(idOpdPorNombre(base, "In-zoom de Preparar"));
  });

  test("una declaración idéntica repetida conserva un solo hecho", () => {
    const resultado = compilarProto(`# SD0 — duplicado

\`\`\`opl
Atender es física y sistémica.
Registro es informacional y ambiental.
Atender genera Registro.
Atender genera Registro.
\`\`\``, { id: "duplicado", nombre: "Duplicado idempotente" });

    expect(resultado.resumen.fallos).toBe(0);
    expect(Object.values(resultado.modelo.enlaces).filter((enlace) => enlace.tipo === "resultado")).toHaveLength(1);
    const apariencias = Object.values(resultado.modelo.opds[resultado.modelo.opdRaizId]!.enlaces);
    expect(apariencias).toHaveLength(1);
  });
});

function compilar(hechos: string[]): Modelo {
  const proto = `# SD0 — Servicio

\`\`\`opl
${hechos.join("\n")}
\`\`\`

# SD1 — detalle de Atender

\`\`\`opl
Atender se descompone en Revisar y Resolver.
Revisar es un proceso físico y sistémico.
Resolver es un proceso físico y sistémico.
Revisar invoca Resolver.
\`\`\``;
  const resultado = compilarProto(proto, { id: "ids", nombre: "IDs estables" });
  expect(resultado.resumen.fallos).toBe(0);
  const bundle = emitirBundle(resultado.autor, { lanzarEnError: false });
  return must(hidratarModelo(bundle.json));
}

function compilarSinEncabezados(refinables: string[]): Modelo {
  const bloques = [
    "\`\`\`opl\nServicio es físico y sistémico.\n\`\`\`",
    ...refinables.map((nombre) => `\`\`\`opl\n${nombre} se descompone en Ejecutar ${nombre}.\nEjecutar ${nombre} es un proceso físico y sistémico.\n\`\`\``),
  ];
  const resultado = compilarProto(bloques.join("\n\n"), { id: "opd-sin-encabezado", nombre: "OPD estables" });
  expect(resultado.resumen.fallos).toBe(0);
  return resultado.modelo;
}

function idOpdPorNombre(modelo: Modelo, nombre: string): string | undefined {
  return Object.values(modelo.opds).find((opd) => opd.nombre === nombre)?.id;
}

function idsReferenciables(modelo: Modelo): Record<string, string> {
  const ids: Record<string, string> = {};
  for (const entidad of Object.values(modelo.entidades)) ids[`entidad:${entidad.nombre}`] = entidad.id;
  for (const estado of Object.values(modelo.estados)) {
    const portador = modelo.entidades[estado.entidadId];
    ids[`estado:${portador?.nombre ?? estado.entidadId}:${estado.nombre}`] = estado.id;
  }
  for (const enlace of Object.values(modelo.enlaces)) ids[`enlace:${firmaEnlace(modelo, enlace)}`] = enlace.id;
  for (const abanico of Object.values(modelo.abanicos ?? {})) {
    const miembros = abanico.enlaceIds.map((id) => modelo.enlaces[id]).filter((item): item is Enlace => Boolean(item));
    ids[`abanico:${abanico.operador}:${miembros.map((enlace) => firmaEnlace(modelo, enlace)).sort().join("|")}`] = abanico.id;
  }
  for (const opd of Object.values(modelo.opds)) ids[`opd:${opd.nombre}`] = opd.id;
  return ordenar(ids);
}

function idsCompartidos(base: Modelo, candidato: Modelo): Record<string, string> {
  const esperados = idsReferenciables(base);
  const observados = idsReferenciables(candidato);
  return ordenar(Object.fromEntries(Object.keys(esperados).map((clave) => [clave, observados[clave] ?? "<ausente>"])));
}

function firmaEnlace(modelo: Modelo, enlace: Enlace): string {
  const origen = nombreExtremo(modelo, enlace.origenId);
  const destino = nombreExtremo(modelo, enlace.destinoId);
  const entrada = enlace.estadoEntradaId ? modelo.estados[enlace.estadoEntradaId]?.nombre : undefined;
  const salida = enlace.estadoSalidaId ? modelo.estados[enlace.estadoSalidaId]?.nombre : undefined;
  return [enlace.tipo, origen, destino, entrada ?? "", salida ?? "", enlace.rutaEtiqueta ?? ""].join(":");
}

function nombreExtremo(modelo: Modelo, extremo: Enlace["origenId"]): string {
  const entidadId = entidadIdDeExtremo(modelo, extremo);
  const entidad = entidadId ? modelo.entidades[entidadId] : undefined;
  if (extremo.kind !== "estado") return entidad?.nombre ?? extremo.id;
  return `${entidad?.nombre ?? entidadId ?? "?"}@${modelo.estados[extremo.id]?.nombre ?? extremo.id}`;
}

function ordenar(registro: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(registro).sort(([a], [b]) => a.localeCompare(b)));
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
