// Pipeline de emisión de bundle (dominio-agnóstico). Aplica el layout canónico, valida
// (round-trip estable + contención de refinamientos + política de canon) y emite el JSON
// `deep-opm-pro.modelo.v0` + OPL + reporte genérico. Extraído de hd-opm (escribirSalidas).
import { contenedorRefinamiento } from "../modelo/layout";
import type { AvisoDiagnostico } from "../modelo/diagnostico";
import { listarAvisosDiagnostico } from "../modelo/diagnostico";
import { moverAparienciaPorId } from "../modelo/operaciones/apariencias";
import type { Modelo } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "../serializacion/json";
import { generarOpl } from "../opl/generar";
import { exportarOplModeloMarkdown } from "../opl/exportarMarkdown";
import { clasificarContencionOpd } from "./contencion";
import type { Autor } from "./dsl";
import { aplicarLayoutCompleto } from "./layout";
import type { OpcionesBundle, ResultadoBundle } from "./tipos";

interface ResumenContencion {
  opds: number;
  internas: number;
  externas: number;
  externosDentro: number;
  fallos: string[];
}

/** Verifica que cada in-zoom contenga sus internas y mantenga las externas fuera del contorno. */
function verificarContencion(modeloHidratado: Modelo): ResumenContencion {
  const resumen: ResumenContencion = { opds: 0, internas: 0, externas: 0, externosDentro: 0, fallos: [] };
  const dx = 37;
  const dy = 29;
  for (const opd of Object.values(modeloHidratado.opds).sort((a, b) => (a.ordenLocal ?? 0) - (b.ordenLocal ?? 0))) {
    const contorno = contenedorRefinamiento(modeloHidratado, opd.id);
    if (!contorno) continue;
    // W3.3: la clasificación geométrica (internas/externas + incumplimientos) vive en
    // `clasificarContencionOpd`; aquí se mantiene la verificación de rigidez de arrastre.
    const clasificacion = clasificarContencionOpd(modeloHidratado, opd.id)!;
    const { internas, externas, externosDentro } = clasificacion;
    resumen.opds += 1;
    resumen.internas += internas.length;
    resumen.externas += externas.length;
    resumen.externosDentro += externosDentro.length;
    if (externosDentro.length > 0) {
      resumen.fallos.push(`${opd.nombre}: ${externosDentro.length} apariencias externas quedaron dentro del contorno.`);
    }
    const movido = moverAparienciaPorId(modeloHidratado, opd.id, contorno.id, { x: contorno.x + dx, y: contorno.y + dy });
    if (!movido.ok) {
      resumen.fallos.push(`${opd.nombre}: no se pudo mover contorno (${movido.error}).`);
      continue;
    }
    const aparienciasMovidas = movido.value.opds[opd.id]?.apariencias ?? {};
    for (const interna of internas) {
      const siguiente = aparienciasMovidas[interna.id];
      if (!siguiente || siguiente.x !== interna.x + dx || siguiente.y !== interna.y + dy) {
        const nombre = modeloHidratado.entidades[interna.entidadId]?.nombre ?? interna.entidadId;
        resumen.fallos.push(`${opd.nombre}: ${nombre} no se desplaza con el contorno.`);
      }
    }
    for (const externa of externas) {
      const siguiente = aparienciasMovidas[externa.id];
      if (!siguiente || siguiente.x !== externa.x || siguiente.y !== externa.y) {
        const nombre = modeloHidratado.entidades[externa.entidadId]?.nombre ?? externa.entidadId;
        resumen.fallos.push(`${opd.nombre}: ${nombre} externo se desplaza con el contorno.`);
      }
    }
  }
  return resumen;
}

/** Política de canon: bloquean los avisos ESTRUCTURALES (no `info`, no `metodologia`). Los
 * metodológicos (mejora/estilo) son sugerencias y no bloquean. Devuelve la partición. */
function particionarCanon(avisos: AvisoDiagnostico[]): { bloqueantes: AvisoDiagnostico[]; metodologicos: number; info: number } {
  const esMetodologico = (a: AvisoDiagnostico) => a.origen === "metodologia";
  return {
    bloqueantes: avisos.filter((a) => a.severidad !== "info" && !esMetodologico(a)),
    metodologicos: avisos.filter(esMetodologico).length,
    info: avisos.filter((a) => a.severidad === "info").length,
  };
}

/**
 * Emite un bundle validado a partir de un autor (con su modelo + internosInzoom). Aplica el layout
 * canónico, valida round-trip + contención + canon, y devuelve { json, opl, reporte, conteos, avisos }.
 * No escribe archivos: el consumidor decide dónde persistir. Lanza ante fallo de round-trip/contención,
 * y (si lanzarEnError, default true) ante avisos de severidad `error` o bloqueantes de canon.
 */
export function emitirBundle(autor: Autor, opciones: OpcionesBundle = {}): ResultadoBundle {
  const { modelo, internosInzoom } = autor;
  const lanzar = opciones.lanzarEnError ?? true;
  if (opciones.descripcion && opciones.descripcion.length) {
    modelo.descripcion = opciones.descripcion.join(" ");
  }
  // W5.3/L6: el sello de procedencia viaja DENTRO del modelo serializado (sobrevive al
  // round-trip y queda consultable al importar en opforja). Solo si el consumidor lo pasa.
  if (opciones.procedencia) {
    modelo.procedencia = opciones.procedencia;
  }

  aplicarLayoutCompleto(modelo, internosInzoom);

  const jsonCrudo = exportarModelo(modelo);
  const hidratadoPre = hidratarModelo(jsonCrudo);
  if (!hidratadoPre.ok) throw new Error(`Bundle inválido: ${hidratadoPre.error}`);

  const jsonCanonico = exportarModelo(hidratadoPre.value);
  const roundtrip = hidratarModelo(jsonCanonico);
  if (!roundtrip.ok) throw new Error(`Bundle canónico inválido tras round-trip: ${roundtrip.error}`);
  if (exportarModelo(roundtrip.value) !== jsonCanonico) {
    throw new Error("Bundle canónico no es estable tras hidratar y reexportar.");
  }
  const hidratado = roundtrip.value;

  const avisos = listarAvisosDiagnostico(hidratado, { tipo: "modelo" });
  const errores = avisos.filter((a) => a.severidad === "error").length;
  if (lanzar && errores > 0) throw new Error(`Diagnóstico contiene ${errores} errores.`);
  const canon = particionarCanon(avisos);
  if (lanzar && canon.bloqueantes.length > 0) {
    throw new Error(["Canon inválido:", ...canon.bloqueantes.map((a) => `- ${a.severidad} ${a.codigo}: ${a.destino} :: ${a.mensaje}`)].join("\n"));
  }
  const contencion = verificarContencion(hidratado);
  if (contencion.fallos.length > 0) throw new Error(`Contención de refinamientos inválida:\n${contencion.fallos.join("\n")}`);

  const lineasOpl: string[] = [];
  for (const opd of Object.values(hidratado.opds).sort((a, b) => (a.ordenLocal ?? 0) - (b.ordenLocal ?? 0))) {
    lineasOpl.push(`# ${opd.nombre}`, "");
    lineasOpl.push(...generarOpl(hidratado, opd.id), "");
  }
  const opl = lineasOpl.join("\n");

  const conteos = {
    entidades: Object.keys(hidratado.entidades).length,
    estados: Object.keys(hidratado.estados).length,
    enlaces: Object.keys(hidratado.enlaces).length,
    opds: Object.keys(hidratado.opds).length,
  };
  // W5.1/W5.2: las anclas normativas viajan en el bundle (extensión meta del autor; no son
  // cosas y por eso no entran en `conteos`). Se reportan aparte solo si existen (byte-identidad:
  // un bundle sin anclas no gana líneas en el reporte). El conteo incluye el desglose de
  // pendientes de ratificación (registro consultable, L8).
  const anclasBundle = Object.values(hidratado.anclasNormativas ?? {});
  const numAnclas = anclasBundle.length;
  const numAnclasPendientes = anclasBundle.filter((a) => a.estado === "pendiente-ratificacion").length;

  const reporte = [
    `# Reporte de bundle — ${modelo.nombre}`,
    "",
    "- Formato: `deep-opm-pro.modelo.v0`.",
    `- Entidades: ${conteos.entidades} · Estados: ${conteos.estados} · Enlaces: ${conteos.enlaces} · OPDs: ${conteos.opds}.`,
    "- Validación estructural de import: PASS vía `hidratarModelo`.",
    "- Round-trip JSON: PASS estable tras hidratar y reexportar.",
    `- Canon: ${canon.bloqueantes.length === 0 ? "PASS" : "FAIL"} (${canon.bloqueantes.length} bloqueantes, ${canon.metodologicos} metodológicos, ${canon.info} info).`,
    `- Contención de in-zoom: PASS (${contencion.opds} OPDs, ${contencion.internas} internas, ${contencion.externas} externas, ${contencion.externosDentro} externas dentro de contorno).`,
    ...(numAnclas > 0 ? [`- Anclas normativas (extensión meta, no-OPL): ${numAnclas} (${numAnclasPendientes} pendiente(s) de ratificación).`] : []),
    // W5.3/L6: el reporte declara el sello solo si existe (byte-identidad sin procedencia).
    ...(hidratado.procedencia
      ? [
          `- Procedencia (L6): proto \`${hidratado.procedencia.protoHash}\` · autoría v${hidratado.procedencia.autoriaVersion} · layout v${hidratado.procedencia.layoutVersion}.`,
        ]
      : []),
    ...(opciones.reporteExtra && opciones.reporteExtra.length ? ["", ...opciones.reporteExtra] : []),
  ].join("\n");

  // G1 (solicitud upstream hd-opm): el modelo textual es un PRODUCTO derivado.
  // Se emite solo opt-in para no perturbar salidas existentes (byte-identidad).
  // Reusa la función pura `exportarOplModeloMarkdown` — el consumidor agnóstico
  // ya no necesita mantenerlo a mano ni tocar store/UI.
  // exactOptionalPropertyTypes: la clave se incluye solo si se opta por ella
  // (un opcional ausente ≠ presente-undefined; preserva byte-identidad del shape).
  const modeloTextual = opciones.emitirModeloTextual
    ? { modeloTextual: `<!-- DERIVADO — no editar a mano -->\n\n${exportarOplModeloMarkdown(hidratado)}` }
    : {};

  return { json: jsonCanonico, opl, reporte, conteos, avisos, ...modeloTextual };
}
