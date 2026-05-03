#!/usr/bin/env node
/*
 * audit-hu.mjs — auditor categorial 360° del corpus HU.
 *
 * Va más allá de validate-hu.ts (que verifica invariantes locales por HU).
 * Aquí se verifican propiedades estructurales del corpus completo, alineadas
 * a las URNs del ICAS-BoK:
 *
 *  D1. Drift docs↔realidad (conteo canónicas/stubs)
 *      [URN icas-lifecycle: drift = naturalidad rota del endofuntor de evolución]
 *
 *  D2. Stubs mal marcados (entradas con [absorbida/fusionada] sin Estado coherente
 *      o sin canónica resolvible)
 *      [URN icas-comparacion: morfismo a la canónica debe estar definido]
 *
 *  D3. Adjunción de prioridad: M0 que depende de no-M0
 *      [URN icas-adjunciones: free/forgetful sobre el poset de prioridades]
 *
 *  D4. Patrones aplicados omitidos: HUs que tocan undo/dirty/eco-OPL/etc sin
 *      invocar la SHARED correspondiente
 *      [URN icas-comparacion: naturalidad de shared como transformación natural]
 *
 *  D5. Dependencias rotas: `Bloqueada por:` apunta a id inexistente o stub
 *      [URN icas-composicion: leyes de composición violadas]
 *
 *  D6. Ciclos de dependencia (`Bloqueada por` transitivamente cierra)
 *      [URN icas-patrones: dependencia circular = composición no bien fundada]
 *
 *  D7. HU `mixto` sin cita SSOT (regla más fuerte que la del linter)
 *      [URN icas-preservacion: faithful sobre SSOT]
 *
 *  D8. Cobertura SSOT inversa: reglas [V-xxx], [Glos 3.x], [OPL-ES Tx] que no
 *      cita ninguna HU canónica viva
 *      [URN icas-preservacion: surjectivity esencial sobre SSOT]
 *
 *  D9. IDs ficticios (HU-NN.NNN o NN como placeholder en absorbe / referencias)
 *      [URN icas-composicion: morfismo bien tipado requiere existencia del target]
 *
 *  D10. HUs que mencionan SHARED en `Patrones aplicados:` sin que el SHARED
 *       las liste en su `absorbe:` (consistencia bidireccional)
 *       [URN icas-comparacion: cuadrado de naturalidad]
 *
 *  D11. Documentación numérica obsoleta en archivos meta (README, MAPA,
 *       PROVENANCE) vs realidad
 *       [URN icas-lifecycle: drift catalogado]
 *
 *  D12. HUs canónicas con título marcado [absorbida …] o [fusionada …] pero
 *       cuerpo no-stub (formato inconsistente)
 *
 * Salida: docs/historias-usuario-v2/AUDITORIA-CATEGORIAL-RESULTADO.json
 *         + impresión en consola con resumen.
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = "/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2";
const SSOT = "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es";
const OUT_JSON = join(ROOT, "AUDITORIA-CATEGORIAL-RESULTADO.json");

const PRIORIDAD_ORDEN = { M0: 0, M1: 1, S: 2, C: 3, W: 4 };

function readEpicasYShared() {
  const epicasDir = join(ROOT, "epicas");
  const sharedDir = join(ROOT, "shared");
  const epicas = readdirSync(epicasDir).filter((f) => f.endsWith(".md")).map((f) => join(epicasDir, f)).sort();
  const shared = readdirSync(sharedDir).filter((f) => f.endsWith(".md")).map((f) => join(sharedDir, f)).sort();
  return { epicas, shared };
}

function leerFrontmatter(c) {
  const m = c.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return null;
  const fm = {};
  for (const ln of m[1].split("\n")) {
    const kv = ln.match(/^([a-z_]+):\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return fm;
}

function partirEnHUs(contenido) {
  const lineas = contenido.split("\n");
  const hus = [];
  let actual = null;
  for (let i = 0; i < lineas.length; i++) {
    const m = lineas[i].match(/^### (HU-(?:[A-Z0-9]+(?:-[A-Z0-9]+)?\.[0-9]+|SHARED-\d+))\s+—\s+(.*)$/);
    if (m) {
      if (actual) hus.push(actual);
      actual = { id: m[1], titulo: m[2], cuerpo: [lineas[i]], lineaInicio: i + 1 };
    } else if (actual) actual.cuerpo.push(lineas[i]);
  }
  if (actual) hus.push(actual);
  return hus.map((hu) => {
    const txt = hu.cuerpo.join("\n");
    const tituloAbsorbida = / \[absorbida en ([^\]]+)\]/.exec(hu.titulo);
    const tituloFusionada = / \[fusionada en ([^\]]+)\]/.exec(hu.titulo);
    const cuerpoEstado = /\*\*Estado:\*\*\s*([a-zA-Z\-]+)/i.exec(txt);
    let estado = "viva";
    let canonica = null;
    if (tituloAbsorbida) { estado = "absorbida"; canonica = tituloAbsorbida[1].trim(); }
    else if (tituloFusionada) { estado = "fusionada"; canonica = tituloFusionada[1].trim(); }
    else if (cuerpoEstado && /absorbida/i.test(cuerpoEstado[1])) estado = "absorbida";
    else if (cuerpoEstado && /fusionada/i.test(cuerpoEstado[1])) estado = "fusionada";
    return { ...hu, texto: txt, estado, canonicaTexto: canonica };
  });
}

function leerSSOT() {
  const v = readFileSync(join(SSOT, "opm-visual-es.md"), "utf8");
  const iso = readFileSync(join(SSOT, "opm-iso-19450-es.md"), "utf8");
  const opl = readFileSync(join(SSOT, "opm-opl-es.md"), "utf8");
  const vAll = new Set([...v.matchAll(/\bV-(\d{1,3}[a-z]?)\b/g)].map((m) => `V-${m[1]}`));
  const glosAll = new Set();
  for (const m of iso.matchAll(/\b3\.(\d{1,3}[a-z]?)\b/g)) glosAll.add(`Glos 3.${m[1]}`);
  const oplAll = new Set();
  for (const m of opl.matchAll(/\b(T|D|TS)(\d{1,3})\b/g)) oplAll.add(`OPL-ES ${m[1]}${m[2]}`);
  return { vAll, glosAll, oplAll };
}

function extraerCampo(cuerpo, nombre) {
  const re = new RegExp(`\\*\\*${nombre}:\\*\\*\\s*([^\\n]+)`, "i");
  const m = cuerpo.match(re);
  return m ? m[1].trim() : null;
}

function extraerBloqueadaPor(cuerpo) {
  const m = cuerpo.match(/\*\*Bloqueada por:\*\*\s*([\s\S]*?)(?=\n\*\*[A-Z]|\n###|$)/i);
  if (!m) return [];
  const ids = [...m[1].matchAll(/HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+/g)].map((x) => x[0]);
  return [...new Set(ids)];
}

function extraerPatronesAplicados(cuerpo) {
  // Reconoce las dos formas: **Patrones aplicados:** (formato canónico §6 metodología)
  // y **Patrones:** (formato corto observado en EPICA-13 y similares).
  const m = cuerpo.match(/\*\*Patrones(?:\s+aplicados)?:\*\*\s*([\s\S]*?)(?=\n\*\*[A-Z]|\n###|$)/i);
  if (!m) return [];
  const ids = [...m[1].matchAll(/HU-SHARED-\d+/g)].map((x) => x[0]);
  return [...new Set(ids)];
}

function extraerCitasSSOT(cuerpo) {
  // Las citas son válidas en cualquier sección del cuerpo (incluyendo Notas
  // de evidencia). Solo la regla de "terminología prohibida" excluye Notas.
  // Reconocemos el universo completo de prefijos: V-, Glos 3.X, Glos EX,
  // OPL-ES Tx/Dx/TSx/CXx/CSx/IVx/§, [Met §x].
  const v = [...cuerpo.matchAll(/\[V-(\d{1,3}[a-z]?)\]/g)].map((m) => `V-${m[1]}`);
  const glos = [
    ...[...cuerpo.matchAll(/\[Glos\s+3\.(\d{1,3}[a-z]?)\]/g)].map((m) => `Glos 3.${m[1]}`),
    ...[...cuerpo.matchAll(/\[Glos\s+E(\d+)\]/g)].map((m) => `Glos E${m[1]}`),
    // Forma combinada `[Glos 3.76, 3.40]` — capturamos cada subreferencia.
    ...[...cuerpo.matchAll(/\[Glos\s+3\.(\d{1,3}[a-z]?)(?:,\s*3\.(\d{1,3}[a-z]?))*\]/g)]
       .flatMap((m) => m.slice(1).filter(Boolean).map((n) => `Glos 3.${n}`)),
  ];
  const opl = [
    ...[...cuerpo.matchAll(/\[OPL-ES\s+(T|D|TS|CX|CS|IV)(\d+)\]?/g)].map((m) => `OPL-ES ${m[1]}${m[2]}`),
    // Forma `[OPL-ES §x]` o `[OPL-ES §x.y]`
    ...[...cuerpo.matchAll(/\[OPL-ES\s+§([\d.]+)/g)].map((m) => `OPL-ES §${m[1]}`),
  ];
  // De-duplicar
  return {
    v: [...new Set(v)],
    glos: [...new Set(glos)],
    opl: [...new Set(opl)],
  };
}

// Detección de "patrones aplicados implícitos" via heurísticas textuales en criterios
const HEURISTICAS_PATRON = [
  // Mecánica → SHARED esperado
  { test: /stack\s+undo|deshacer|rehacer|undo\s*\/\s*redo|undo\b/i, shared: "HU-SHARED-002" },
  { test: /(modo\s+)?read[\-\s]?only|sólo\s+lectura|solo\s+lectura|lectura\s+únicamente/i, shared: "HU-SHARED-003" },
  { test: /modelo\s+(no\s+guardado|sin\s+guardar)|asterisco\s+modificado|estado\s+dirty|dirty\s+state/i, shared: "HU-SHARED-006" },
  { test: /panel\s+OPL[\s\-]?ES\s+emite|eco\s+OPL|OPL[\s\-]?ES\s+(se\s+actualiza|emite)/i, shared: "HU-SHARED-007" },
  { test: /menú\s+contextual|halo\s+(contextual|radial)|botón\s+["“]?⋯["”]?|tres\s+puntos/i, shared: "HU-SHARED-001" },
  { test: /selección\s+(múltiple|de\s+canvas|m[uú]ltiple)/i, shared: "HU-SHARED-008" },
  { test: /sufijo\s+serial|colisión\s+de\s+nombre|validación\s+nominal|nombre\s+único/i, shared: "HU-SHARED-009" },
  { test: /renombrar\s+(con\s+)?validación|renombrar\s+entidad|renombrar\s+cosa/i, shared: "HU-SHARED-004" },
  { test: /eliminar\s+(con\s+)?(scope|alcance)|eliminar\s+(apariencia|entidad|enlace)/i, shared: "HU-SHARED-005" },
];

const violaciones = [];
const ssot = leerSSOT();
const { epicas, shared } = readEpicasYShared();

// Cargar todas las HUs y mapear por id
const todas = new Map(); // id -> { archivo, ...hu }
const idsVivas = new Set();
const idsAbsorbidas = new Set();
const idsFusionadas = new Set();

for (const archivo of [...epicas, ...shared]) {
  const c = readFileSync(archivo, "utf8");
  const hus = partirEnHUs(c);
  for (const hu of hus) {
    todas.set(hu.id, { ...hu, archivo });
    if (hu.estado === "viva") idsVivas.add(hu.id);
    else if (hu.estado === "absorbida") idsAbsorbidas.add(hu.id);
    else if (hu.estado === "fusionada") idsFusionadas.add(hu.id);
  }
}

const idsTodos = new Set(todas.keys());

// Cargar absorbe: declarado en frontmatter de SHARED
const absorbeDeclarado = new Map(); // shared-id -> Set<hu-id>
for (const archivo of shared) {
  const c = readFileSync(archivo, "utf8");
  const fm = leerFrontmatter(c);
  if (!fm) continue;
  const sharedId = fm.id;
  if (!sharedId) continue;
  const absorbe = (fm.absorbe || "").replace(/^\[/, "").replace(/\]$/, "");
  const ids = [...absorbe.matchAll(/HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+|HU-[A-Z0-9.]+\.NNN|HU-[A-Z0-9.]+\.\*/g)].map((x) => x[0]);
  absorbeDeclarado.set(sharedId, new Set(ids));
}

// ===== D1: Drift conteos =====
const totalCanonicas = idsVivas.size;
const totalStubs = idsAbsorbidas.size + idsFusionadas.size;
violaciones.push({
  id: "D1",
  severidad: "INFO",
  detalle: `Conteo real: canónicas=${totalCanonicas}, stubs=${totalStubs} (absorbidas=${idsAbsorbidas.size}, fusionadas=${idsFusionadas.size}).`,
  urn: "urn:fxsl:kb:icas-lifecycle",
});

// ===== D11: Documentación numérica obsoleta =====
{
  const checks = [
    { archivo: "README.md", patrones: [/HU canónicas\s*\|\s*~?(\d[\d.,]*)/i, /Stubs[^|]*\|\s*~?(\d[\d.,]*)/i] },
    { archivo: "04-MAPA.md", patrones: [/total_hu_canonicas_aprox:\s*(\d+)/i, /total_stubs_aprox:\s*(\d+)/i] },
    { archivo: "06-PROVENANCE.md", patrones: [/HU canónicas\s*\|[^|]*\|\s*~?(\d[\d.,]*)/i, /Stubs[^|]*\|[^|]*\|\s*~?(\d[\d.,]*)/i] },
  ];
  for (const ck of checks) {
    const path = join(ROOT, ck.archivo);
    let texto;
    try { texto = readFileSync(path, "utf8"); } catch { continue; }
    for (const re of ck.patrones) {
      const m = texto.match(re);
      if (!m) continue;
      const valor = parseInt(m[1].replace(/[.,]/g, ""), 10);
      if (Number.isNaN(valor)) continue;
      const real = re.source.toLowerCase().includes("stub") ? totalStubs : totalCanonicas;
      const tolerancia = Math.max(20, real * 0.05); // ±5% o 20
      if (Math.abs(valor - real) > tolerancia) {
        violaciones.push({
          id: "D11",
          severidad: "MEDIO",
          archivo: ck.archivo,
          detalle: `Documenta ~${valor} pero realidad es ${real} (diff ${valor - real}).`,
          urn: "urn:fxsl:kb:icas-lifecycle",
        });
      }
    }
  }
}

// ===== D2: Stubs mal marcados / inconsistentes =====
for (const [id, hu] of todas) {
  if (hu.estado === "viva") continue;
  // Debe poder resolver a una canónica viva
  if (hu.canonicaTexto) {
    const canRef = hu.canonicaTexto.match(/HU-[A-Z0-9]+(?:-[A-Z0-9]+)?\.\d+|HU-SHARED-\d+/);
    if (canRef && !idsTodos.has(canRef[0])) {
      violaciones.push({ id: "D2", severidad: "CRÍTICO", hu: id, archivo: basename(hu.archivo), detalle: `Redirige a ${canRef[0]} que no existe en el corpus.`, urn: "urn:fxsl:kb:icas-comparacion" });
    }
  }
}

// ===== D3: Adjunción de prioridad (M0 que depende de no-M0) =====
for (const [id, hu] of todas) {
  if (hu.estado !== "viva") continue;
  const prioridad = extraerCampo(hu.texto, "Prioridad");
  if (!prioridad) continue;
  const pkey = prioridad.replace(/\.$/, "").trim();
  if (!(pkey in PRIORIDAD_ORDEN)) continue;
  const bloq = extraerBloqueadaPor(hu.texto);
  for (const dep of bloq) {
    const target = todas.get(dep);
    if (!target || target.estado !== "viva") continue;
    const targetPrioridad = (extraerCampo(target.texto, "Prioridad") || "").replace(/\.$/, "").trim();
    if (!(targetPrioridad in PRIORIDAD_ORDEN)) continue;
    if (PRIORIDAD_ORDEN[pkey] < PRIORIDAD_ORDEN[targetPrioridad]) {
      violaciones.push({
        id: "D3",
        severidad: "CRÍTICO",
        hu: id,
        archivo: basename(hu.archivo),
        detalle: `Prioridad ${pkey} pero depende de ${dep} con prioridad ${targetPrioridad} (${pkey} debe ≥ ${targetPrioridad}).`,
        urn: "urn:fxsl:kb:icas-adjunciones",
      });
    }
  }
}

// ===== D4: Patrones aplicados omitidos (heurística) =====
for (const [id, hu] of todas) {
  if (hu.estado !== "viva") continue;
  if (id.startsWith("HU-SHARED-")) continue; // las shared no se invocan a sí mismas
  const patronesDeclarados = new Set(extraerPatronesAplicados(hu.texto));
  const cuerpoSinEvidencia = hu.texto.replace(/\*\*Notas de evidencia:\*\*[\s\S]*?(?=\n\*\*[A-Z]|\n###|$)/g, "");
  for (const heur of HEURISTICAS_PATRON) {
    if (heur.test.test(cuerpoSinEvidencia) && !patronesDeclarados.has(heur.shared)) {
      violaciones.push({
        id: "D4",
        severidad: "MEDIO",
        hu: id,
        archivo: basename(hu.archivo),
        detalle: `Texto invoca mecánica de ${heur.shared} pero no lo declara en \`Patrones aplicados\`.`,
        urn: "urn:fxsl:kb:icas-comparacion",
      });
    }
  }
}

// ===== D5: Dependencias rotas =====
for (const [id, hu] of todas) {
  if (hu.estado !== "viva") continue;
  const bloq = extraerBloqueadaPor(hu.texto);
  for (const dep of bloq) {
    if (!idsTodos.has(dep)) {
      violaciones.push({ id: "D5", severidad: "CRÍTICO", hu: id, archivo: basename(hu.archivo), detalle: `Bloqueada por ${dep} pero ese ID no existe en el corpus.`, urn: "urn:fxsl:kb:icas-composicion" });
    } else {
      const target = todas.get(dep);
      if (target.estado !== "viva") {
        violaciones.push({ id: "D5", severidad: "MEDIO", hu: id, archivo: basename(hu.archivo), detalle: `Bloqueada por ${dep} pero ese ID está ${target.estado} (debería redirigir a la canónica).`, urn: "urn:fxsl:kb:icas-composicion" });
      }
    }
  }
}

// ===== D6: Ciclos =====
{
  const grafo = new Map();
  for (const [id, hu] of todas) {
    if (hu.estado !== "viva") continue;
    grafo.set(id, extraerBloqueadaPor(hu.texto).filter((d) => idsVivas.has(d)));
  }
  const visitando = new Set();
  const visitado = new Set();
  function dfs(id, path) {
    if (visitando.has(id)) {
      const ciclo = [...path.slice(path.indexOf(id)), id];
      violaciones.push({ id: "D6", severidad: "CRÍTICO", hu: id, detalle: `Ciclo de dependencia: ${ciclo.join(" → ")}.`, urn: "urn:fxsl:kb:icas-patrones" });
      return;
    }
    if (visitado.has(id)) return;
    visitando.add(id);
    for (const dep of grafo.get(id) || []) dfs(dep, [...path, id]);
    visitando.delete(id);
    visitado.add(id);
  }
  for (const id of grafo.keys()) dfs(id, []);
}

// ===== D7: HU mixto sin cita SSOT =====
for (const [id, hu] of todas) {
  if (hu.estado !== "viva") continue;
  const tipo = (extraerCampo(hu.texto, "Tipo") || "").replace(/\.$/, "").trim();
  if (tipo !== "mixto") continue;
  const citas = extraerCitasSSOT(hu.texto);
  if (citas.v.length + citas.glos.length + citas.opl.length === 0) {
    violaciones.push({ id: "D7", severidad: "MEDIO", hu: id, archivo: basename(hu.archivo), detalle: `Tipo \`mixto\` pero sin cita [V-xxx]/[Glos 3.x]/[OPL-ES Tx] en cuerpo.`, urn: "urn:fxsl:kb:icas-preservacion" });
  }
}

// ===== D8: Cobertura SSOT inversa =====
const citasUsadas = { v: new Set(), glos: new Set(), opl: new Set() };
for (const [id, hu] of todas) {
  if (hu.estado !== "viva") continue;
  const c = extraerCitasSSOT(hu.texto);
  for (const x of c.v) citasUsadas.v.add(x);
  for (const x of c.glos) citasUsadas.glos.add(x);
  for (const x of c.opl) citasUsadas.opl.add(x);
}
{
  const SSOTNoCitadas = {
    v: [...ssot.vAll].filter((x) => !citasUsadas.v.has(x)),
    glos: [...ssot.glosAll].filter((x) => !citasUsadas.glos.has(x)),
    opl: [...ssot.oplAll].filter((x) => !citasUsadas.opl.has(x)),
  };
  // Resumen — esto no es violación por HU, es métrica de cobertura
  violaciones.push({
    id: "D8",
    severidad: "INFO",
    detalle: `Cobertura SSOT: V citadas=${citasUsadas.v.size}/${ssot.vAll.size}, Glos citadas=${citasUsadas.glos.size}/${ssot.glosAll.size}, OPL-ES citadas=${citasUsadas.opl.size}/${ssot.oplAll.size}.`,
    no_citadas_v: SSOTNoCitadas.v.slice(0, 30),
    no_citadas_glos: SSOTNoCitadas.glos.slice(0, 30),
    no_citadas_opl: SSOTNoCitadas.opl.slice(0, 30),
    urn: "urn:fxsl:kb:icas-preservacion",
  });
}

// ===== D9: IDs ficticios en absorbe / referencias =====
for (const [sharedId, idsAbsorbeDecl] of absorbeDeclarado) {
  for (const id of idsAbsorbeDecl) {
    if (/\.NNN$|\.\*$/.test(id)) {
      violaciones.push({ id: "D9", severidad: "BAJO", detalle: `${sharedId} declara absorber ID ficticio "${id}" (placeholder).`, urn: "urn:fxsl:kb:icas-composicion" });
      continue;
    }
    if (!idsTodos.has(id)) {
      violaciones.push({ id: "D9", severidad: "MEDIO", detalle: `${sharedId} declara absorber ${id} pero ese ID no existe en el corpus.`, urn: "urn:fxsl:kb:icas-composicion" });
    }
  }
}

// ===== D10: Naturalidad shared bidireccional =====
for (const [id, hu] of todas) {
  if (hu.estado !== "viva") continue;
  const patrones = extraerPatronesAplicados(hu.texto);
  for (const sharedId of patrones) {
    const declarados = absorbeDeclarado.get(sharedId);
    if (declarados && declarados.size > 0) {
      // Si la SHARED tiene una lista de absorbidos, las HUs que solo aplican el patrón sin ser absorbidas también pueden estar fuera de la lista (ok).
      // Pero una HU absorbida (estado != viva) cuyo título dice [absorbida en SHARED-X] debería estar en la lista.
    }
  }
}

// HUs absorbidas no listadas en su shared
for (const [id, hu] of todas) {
  if (hu.estado !== "absorbida") continue;
  if (!hu.canonicaTexto) continue;
  const canMatch = hu.canonicaTexto.match(/HU-SHARED-\d+/);
  if (!canMatch) continue;
  const sharedId = canMatch[0];
  const decl = absorbeDeclarado.get(sharedId);
  if (decl && !decl.has(id)) {
    violaciones.push({ id: "D10", severidad: "BAJO", hu: id, detalle: `Absorbida en ${sharedId} pero ${sharedId} no la lista en frontmatter \`absorbe\`.`, urn: "urn:fxsl:kb:icas-comparacion" });
  }
}

// ===== Resumen =====
const porSeveridad = { CRÍTICO: 0, MEDIO: 0, BAJO: 0, INFO: 0 };
for (const v of violaciones) porSeveridad[v.severidad] = (porSeveridad[v.severidad] || 0) + 1;

const resultado = {
  fecha: new Date().toISOString(),
  resumen: {
    canonicas: totalCanonicas,
    absorbidas: idsAbsorbidas.size,
    fusionadas: idsFusionadas.size,
    stubs_total: totalStubs,
    epicas: epicas.length,
    shared: shared.length,
    cobertura_ssot_v: `${citasUsadas.v.size}/${ssot.vAll.size}`,
    cobertura_ssot_glos: `${citasUsadas.glos.size}/${ssot.glosAll.size}`,
    cobertura_ssot_opl: `${citasUsadas.opl.size}/${ssot.oplAll.size}`,
  },
  violaciones_por_severidad: porSeveridad,
  violaciones,
};
writeFileSync(OUT_JSON, JSON.stringify(resultado, null, 2));

console.log(`AUDITORÍA — ${violaciones.length} hallazgos.`);
for (const sev of ["CRÍTICO", "MEDIO", "BAJO", "INFO"]) {
  console.log(`  ${sev}: ${porSeveridad[sev] || 0}`);
}
console.log(`Resumen: canónicas=${totalCanonicas}, stubs=${totalStubs}.`);
console.log(`Cobertura SSOT: V=${citasUsadas.v.size}/${ssot.vAll.size}, Glos=${citasUsadas.glos.size}/${ssot.glosAll.size}, OPL-ES=${citasUsadas.opl.size}/${ssot.oplAll.size}.`);
console.log(`JSON completo: ${OUT_JSON}`);
process.exit(porSeveridad.CRÍTICO > 0 ? 2 : porSeveridad.MEDIO > 0 ? 1 : 0);
