/**
 * Generador del modelo canónico "Laboratorio de simulación OPM v3".
 *
 * Modelo de prueba del motor de simulación: ejercita TODOS los patrones que el
 * runner sabe ejecutar, construido con operaciones del kernel (validez por
 * construcción — rechazo ruidoso si algo es ilegal):
 *
 *  - habilitadores (agente, instrumento anclado a estado HS)         → fase preparación
 *  - evento sobre habilitador (ET: Analizador en `disponible`)       → omisión "evento no ocurrido"
 *  - consumo/resultado anclados a estados (pares TS escindidos)      → transiciones current
 *  - consumible sin estados (Reactivo)                               → consumo puro
 *  - condición con bypass R-EJEC-7/8 (Manejar Demora, Emitir Informe)→ "omitido por condición"
 *  - abanico XOR de salida con probabilidades + rutas etiquetadas    → decisión det./muestreo
 *  - in-zoom con 5 subprocesos en secuencia vertical (eje temporal)  → descenso del plan
 *  - excepción temporal sobretiempo con proceso de manejo ambiental  → desvío ejecutable
 *  - duración temporal de estado (min/nominal/max)                   → reloj + sobretiempo estocástico
 *  - invocación con demora                                           → salto post-terminación
 *  - efecto compacto con par de estados (Bitácora)                   → OPL «cambia»/tokens
 *    (gap conocido del motor: el par compacto del efecto NO transiciona en
 *    runtime — solo los pares consumo↔resultado anclados a estados)
 *  - designaciones inicial/final/current                             → estadosCurrentIniciales
 *  - atributos simulables (normal y uniform)                         → simulación numérica
 *
 * Diseño conforme al canon: el SD tiene UN solo proceso sistémico (R-SD-4) y
 * todo el flujo vive dentro de su in-zoom; los subprocesos quedan conectados a
 * la función principal por refinamiento. El padre solo porta habilitadores
 * (limitación del motor: las transiciones de frontera duplicadas padre/hijo se
 * aplicarían dos veces — hallazgo B.5 de la auditoría de simulación).
 *
 * Uso:  bun scripts/generar-laboratorio-simulacion.ts [--subir]
 *   sin flags: construye, valida, corre la simulación de sanidad y escribe
 *              /tmp/laboratorio-simulacion-opm.json
 *   --subir:   además hace login en https://opforja.sanixai.com con las
 *              credenciales de ~/.opforja-operator-credentials y guarda el
 *              modelo en el backend (id lab-sim-opm-v3; no toca otros modelos).
 */

import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { formarAbanico, definirProbabilidadesAbanico } from "../src/modelo/abanicos";
import { designarCurrent, designarFinal, designarInicial } from "../src/modelo/estadosDesignaciones";
import { extremoEntidad, extremoEstado } from "../src/modelo/extremos";
import { definirTiempoExcepcionEnlace } from "../src/modelo/enlaceMetadatos";
import { aplicarModificador, definirDemora } from "../src/modelo/modificadores";
import { fijarDuracion } from "../src/modelo/objetoDuracion";
import {
  agregarEstado,
  cambiarAfiliacion,
  cambiarEsencia,
  configurarSimulacionAtributo,
  crearAtributoEnObjeto,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  moverApariencia,
  redimensionarApariencia,
  renombrarEntidad,
  renombrarEstado,
} from "../src/modelo/operaciones";
import { compartirAnclaExtremosEnlaces } from "../src/modelo/operaciones/ports";
import { descomponerProceso } from "../src/modelo/operaciones/refinamiento/descomposicion";
import { definirRutaEtiqueta } from "../src/modelo/rutas";
import { ejecutarCorrida, iniciarSimulacion } from "../src/modelo/simulacion/runner";
import type { Id, Modelo, Resultado } from "../src/modelo/tipos";
import { validarModelo } from "../src/modelo/validaciones";
import { verificarMetodologia } from "../src/modelo/checkers";
import { traerEntidadAlOpd } from "../src/canvas/operacionesBatch";
import { exportarModelo } from "../src/serializacion/json";

function must<T>(r: Resultado<T>): T {
  if (!r.ok) throw new Error(r.error);
  return r.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((e) => e.nombre === nombre);
  if (!entidad) throw new Error(`No existe la entidad "${nombre}"`);
  return entidad.id;
}

function estadoId(modelo: Modelo, entidadNombre: string, estadoNombre: string): Id {
  const eId = entidadId(modelo, entidadNombre);
  const estado = Object.values(modelo.estados).find((s) => s.entidadId === eId && s.nombre === estadoNombre);
  if (!estado) throw new Error(`No existe el estado "${estadoNombre}" de "${entidadNombre}"`);
  return estado.id;
}

function ultimoEnlaceId(modelo: Modelo): Id {
  const ids = Object.keys(modelo.enlaces).sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));
  const ultimo = ids.at(-1);
  if (!ultimo) throw new Error("Sin enlaces");
  return ultimo;
}

function conEstados(modelo: Modelo, entidadNombre: string, nombres: string[]): Modelo {
  // crearEstadosIniciales crea 2; renombramos y agregamos el resto.
  const eId = entidadId(modelo, entidadNombre);
  let m = must(crearEstadosIniciales(modelo, eId)).modelo;
  const iniciales = Object.values(m.estados).filter((s) => s.entidadId === eId).map((s) => s.id);
  m = must(renombrarEstado(m, iniciales[0]!, nombres[0]!));
  if (nombres.length > 1) m = must(renombrarEstado(m, iniciales[1]!, nombres[1]!));
  for (const nombre of nombres.slice(2)) m = must(agregarEstado(m, eId, nombre)).modelo;
  return m;
}

export function construirLaboratorio(): Modelo {
  let m = crearModelo("Laboratorio de simulación OPM v3");
  const SD = m.opdRaizId;

  // ── SD: cosas + UN solo proceso sistémico (R-SD-4) ─────────────────────
  m = must(crearObjeto(m, SD, { x: 60, y: 40 }, "Técnico"));
  m = must(crearObjeto(m, SD, { x: 60, y: 240 }, "Analizador"));
  m = must(crearObjeto(m, SD, { x: 60, y: 520 }, "Muestra"));
  m = must(crearObjeto(m, SD, { x: 60, y: 760 }, "Reactivo"));
  m = must(crearObjeto(m, SD, { x: 980, y: 160 }, "Informe"));
  m = must(crearObjeto(m, SD, { x: 980, y: 400 }, "Registro LIS"));
  m = must(crearObjeto(m, SD, { x: 980, y: 640 }, "Bitácora"));
  m = must(crearProceso(m, SD, { x: 520, y: 380 }, "Procesar Muestra"));

  // Esencias: las cosas tangibles del laboratorio son físicas (el agente
  // EXIGE objeto físico); Informe/Registro/Bitácora quedan informacionales.
  for (const nombre of ["Técnico", "Analizador", "Muestra", "Reactivo"]) {
    m = must(cambiarEsencia(m, entidadId(m, nombre), "fisica"));
  }

  m = conEstados(m, "Analizador", ["disponible", "ocupado"]);
  m = conEstados(m, "Muestra", ["recibida", "preparada", "analizada", "validada"]);
  m = conEstados(m, "Informe", ["borrador", "emitido"]);
  m = conEstados(m, "Registro LIS", ["desactualizado", "actualizado"]);
  m = conEstados(m, "Bitácora", ["pendiente", "actualizada"]);

  // Designaciones: inicial/current/final.
  m = must(designarInicial(m, estadoId(m, "Analizador", "disponible")));
  m = must(designarInicial(m, estadoId(m, "Muestra", "recibida")));
  m = must(designarCurrent(m, estadoId(m, "Muestra", "recibida")));
  m = must(designarFinal(m, estadoId(m, "Muestra", "validada")));
  m = must(designarInicial(m, estadoId(m, "Informe", "borrador")));
  m = must(designarFinal(m, estadoId(m, "Informe", "emitido")));
  m = must(designarInicial(m, estadoId(m, "Registro LIS", "desactualizado")));
  m = must(designarInicial(m, estadoId(m, "Bitácora", "pendiente")));

  // Duración temporal: el motor infiere la duración del paso desde el estado
  // RESULTANTE de su transición — `analizada` dota de duración al paso
  // Analizar Muestra (4-15 min, nominal 6). Con el umbral de sobretiempo en
  // 8 min, la corrida determinista (observada = nominal 6) NO desvía; el
  // muestreo puede exceder 8 y entonces detecta el evento y desvía al manejador.
  m = must(fijarDuracion(m, estadoId(m, "Muestra", "analizada"), { unidad: "min", min: 4, nominal: 6, max: 15 }));

  // Atributos simulables (simulación numérica): normal y uniform.
  const temp = must(crearAtributoEnObjeto(m, SD, entidadId(m, "Analizador"), "Temperatura", { tipoSlot: "float", unidad: "°C", valor: 37 }));
  m = temp.modelo;
  m = must(configurarSimulacionAtributo(m, temp.atributoId, {
    simulable: true,
    configuracion: { modo: "numerica", distribucion: "normal", normalMu: 37, normalSigma: 0.4 },
  }));
  m = must(moverApariencia(m, SD, temp.atributoId, { x: 320, y: 150 }));
  const vol = must(crearAtributoEnObjeto(m, SD, entidadId(m, "Muestra"), "Volumen", { tipoSlot: "float", unidad: "ml", valor: 5 }));
  m = vol.modelo;
  m = must(moverApariencia(m, SD, vol.atributoId, { x: 320, y: 640 }));
  m = must(configurarSimulacionAtributo(m, vol.atributoId, {
    simulable: true,
    configuracion: { modo: "numerica", distribucion: "uniform", uniformMin: 2, uniformMax: 10 },
  }));

  // ── SD: habilitadores del proceso principal ────────────────────────────
  const procesar = entidadId(m, "Procesar Muestra");
  m = must(crearEnlace(m, SD, extremoEntidad(entidadId(m, "Técnico")), extremoEntidad(procesar), "agente"));
  // Instrumento anclado a estado (HS) + EVENTO: "Analizador en `disponible` inicia".
  m = must(crearEnlace(m, SD, extremoEstado(estadoId(m, "Analizador", "disponible")), extremoEntidad(procesar), "instrumento"));
  m = must(aplicarModificador(m, ultimoEnlaceId(m), "evento"));

  // ── In-zoom: Procesar Muestra se descompone ────────────────────────────
  const descomposicion = must(descomponerProceso(m, SD, procesar));
  m = descomposicion.modelo;
  const HIJO = descomposicion.opdId;
  const contorno = Object.values(m.opds[HIJO]!.apariencias).find((a) => a.entidadId === procesar);
  if (!contorno) throw new Error("El in-zoom no tiene contorno");

  // Contorno amplio para 6 bandas verticales. El render inscribe la ELIPSE en
  // el bbox: la columna interna va centrada en el eje para quedar dentro de la
  // curva (lección N-3 de la auditoría de layout).
  const ANCHO = 700;
  const ALTO = 1080;
  m = must(redimensionarApariencia(m, HIJO, contorno.id, ANCHO, ALTO));
  const cAct = m.opds[HIJO]!.apariencias[contorno.id]!;
  const cx = cAct.x;
  const cy = cAct.y;
  const ejeX = cx + ANCHO / 2 - 67; // centro del bbox − semiancho de cosa

  // descomponerProceso SIEMBRA 3 subprocesos placeholder: renombrarlos es el
  // camino canónico (el checker INZOOM_NOMBRES_PLACEHOLDER_HIJOS lo exige).
  m = must(renombrarEntidad(m, entidadId(m, "Procesar Muestra 1"), "Preparar Muestra"));
  m = must(renombrarEntidad(m, entidadId(m, "Procesar Muestra 2"), "Analizar Muestra"));
  m = must(renombrarEntidad(m, entidadId(m, "Procesar Muestra 3"), "Validar Resultado"));
  const preparar = entidadId(m, "Preparar Muestra");
  const analizar = entidadId(m, "Analizar Muestra");
  const validar = entidadId(m, "Validar Resultado");
  m = must(crearProceso(m, HIJO, { x: ejeX, y: cy + 600 }, "Emitir Informe"));
  m = must(crearProceso(m, HIJO, { x: ejeX, y: cy + 750 }, "Archivar Informe"));
  const emitir = entidadId(m, "Emitir Informe");
  const archivar = entidadId(m, "Archivar Informe");
  // El manejador de excepción es AMBIENTAL y pertenece al ambiente del
  // refinamiento: vive DENTRO del contorno (regla ambiental-dentro-contorno),
  // igual que la señal Demora que lo condiciona.
  m = must(crearProceso(m, HIJO, { x: ejeX, y: cy + 880 }, "Manejar Demora"));
  m = must(cambiarAfiliacion(m, entidadId(m, "Manejar Demora"), "ambiental"));
  m = must(crearObjeto(m, HIJO, { x: cx + 150, y: cy + 955 }, "Demora"));
  m = conEstados(m, "Demora", ["ausente", "detectada"]);
  m = must(designarInicial(m, estadoId(m, "Demora", "ausente")));
  m = must(cambiarAfiliacion(m, entidadId(m, "Demora"), "ambiental"));

  // Secuencia VERTICAL de los subprocesos renombrados (eje temporal).
  m = must(moverApariencia(m, HIJO, preparar, { x: ejeX, y: cy + 150 }));
  m = must(moverApariencia(m, HIJO, analizar, { x: ejeX, y: cy + 300 }));
  m = must(moverApariencia(m, HIJO, validar, { x: ejeX, y: cy + 450 }));

  // Externos del hijo: traer las cosas de SD (una Thing, apariciones en varios
  // OPDs). Los atributos viajan con su dueño para preservar la frontera.
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Muestra"), { x: cx - 360, y: cy + 200 }));
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Volumen"), { x: cx - 560, y: cy + 200 }));
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Reactivo"), { x: cx - 360, y: cy + 460 }));
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Analizador"), { x: cx - 360, y: cy - 40 }));
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Temperatura"), { x: cx - 560, y: cy - 40 }));
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Informe"), { x: cx + ANCHO + 120, y: cy + 460 }));
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Registro LIS"), { x: cx + ANCHO + 120, y: cy + 640 }));
  m = must(traerEntidadAlOpd(m, HIJO, entidadId(m, "Bitácora"), { x: cx + ANCHO + 120, y: cy + 820 }));

  // Cosas que NACEN en el hijo.
  m = must(crearObjeto(m, HIJO, { x: cx + ANCHO + 120, y: cy + 280 }, "Veredicto"));
  m = conEstados(m, "Veredicto", ["aprobado", "rechazado"]);
  m = must(crearObjeto(m, HIJO, { x: cx + ANCHO + 120, y: cy + 1000 }, "Alerta de Demora"));

  // Flujo del hijo: transiciones de Muestra por pares estado↔proceso.
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Muestra", "recibida")), extremoEntidad(preparar), "consumo"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(preparar), extremoEstado(estadoId(m, "Muestra", "preparada")), "resultado"));
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Muestra", "preparada")), extremoEntidad(analizar), "consumo"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(analizar), extremoEstado(estadoId(m, "Muestra", "analizada")), "resultado"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(entidadId(m, "Reactivo")), extremoEntidad(analizar), "consumo"));
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Analizador", "disponible")), extremoEntidad(analizar), "instrumento"));
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Muestra", "analizada")), extremoEntidad(validar), "consumo"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(validar), extremoEstado(estadoId(m, "Muestra", "validada")), "resultado"));

  // Excepción temporal: si Analizar excede 8 min, desvía a Manejar Demora.
  m = must(crearEnlace(m, HIJO, extremoEntidad(analizar), extremoEntidad(entidadId(m, "Manejar Demora")), "excepcionSobretiempo"));
  m = must(definirTiempoExcepcionEnlace(m, ultimoEnlaceId(m), { tiempoMaximo: "8", unidadTiempoMaximo: "min" }));

  // Manejar Demora: condicional (en el flujo feliz queda OMITIDO por condición).
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Demora", "detectada")), extremoEntidad(entidadId(m, "Manejar Demora")), "consumo"));
  m = must(aplicarModificador(m, ultimoEnlaceId(m), "condicion"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(entidadId(m, "Manejar Demora")), extremoEntidad(entidadId(m, "Alerta de Demora")), "resultado"));

  // Abanico XOR de salida de Validar con probabilidades y rutas etiquetadas.
  m = must(crearEnlace(m, HIJO, extremoEntidad(validar), extremoEstado(estadoId(m, "Veredicto", "aprobado")), "resultado"));
  const ramaAprobada = ultimoEnlaceId(m);
  m = must(crearEnlace(m, HIJO, extremoEntidad(validar), extremoEstado(estadoId(m, "Veredicto", "rechazado")), "resultado"));
  const ramaRechazada = ultimoEnlaceId(m);
  m = must(definirRutaEtiqueta(m, ramaAprobada, "aprobación"));
  m = must(definirRutaEtiqueta(m, ramaRechazada, "rechazo"));
  // Mismo camino que la acción de UI: compartir el ancla del lado común
  // desambigua el puerto exacto antes de formar el abanico.
  m = must(compartirAnclaExtremosEnlaces(m, HIJO, [ramaAprobada, ramaRechazada], "origen", "E"));
  m = must(formarAbanico(m, HIJO, [ramaAprobada, ramaRechazada], "XOR"));
  const abanicoId = Object.keys(m.abanicos ?? {}).at(-1)!;
  m = must(definirProbabilidadesAbanico(m, abanicoId, { [ramaAprobada]: 0.7, [ramaRechazada]: 0.3 }));

  // Emitir Informe: condición sobre el Veredicto + transición de Informe y
  // Registro LIS por pares anclados, y efecto COMPACTO sobre la Bitácora
  // (par como metadato del enlace — verbaliza «cambia» en OPL).
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Veredicto", "aprobado")), extremoEntidad(emitir), "consumo"));
  m = must(aplicarModificador(m, ultimoEnlaceId(m), "condicion"));
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Informe", "borrador")), extremoEntidad(emitir), "consumo"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(emitir), extremoEstado(estadoId(m, "Informe", "emitido")), "resultado"));
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Registro LIS", "desactualizado")), extremoEntidad(emitir), "consumo"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(emitir), extremoEstado(estadoId(m, "Registro LIS", "actualizado")), "resultado"));
  m = must(crearEnlace(m, HIJO, extremoEntidad(emitir), extremoEntidad(entidadId(m, "Bitácora")), "efecto"));
  const efectoBitacora = ultimoEnlaceId(m);
  m = {
    ...m,
    enlaces: {
      ...m.enlaces,
      [efectoBitacora]: {
        ...m.enlaces[efectoBitacora]!,
        estadoEntradaId: estadoId(m, "Bitácora", "pendiente"),
        estadoSalidaId: estadoId(m, "Bitácora", "actualizada"),
      },
    },
  };

  // Invocación con demora + Archivar consume el Informe emitido.
  m = must(crearEnlace(m, HIJO, extremoEntidad(emitir), extremoEntidad(archivar), "invocacion"));
  m = must(definirDemora(m, ultimoEnlaceId(m), "2 min"));
  m = must(crearEnlace(m, HIJO, extremoEstado(estadoId(m, "Informe", "emitido")), extremoEntidad(archivar), "consumo"));

  return m;
}

// ── Sanidad: validación + corrida real del motor ─────────────────────────
function sanear(modelo: Modelo): void {
  const validacion = Object.keys(modelo.opds).flatMap((opdId) => validarModelo(modelo, opdId));
  if (validacion.length > 0) {
    throw new Error(`validarModelo reporta ${validacion.length} problemas:\n${validacion.map((v) => `  - ${JSON.stringify(v)}`).join("\n")}`);
  }
  const avisos = verificarMetodologia(modelo);
  console.log(`checkers metodológicos: ${avisos.length} avisos${avisos.length ? `\n${avisos.map((a) => `  - [${a.codigo}] ${a.mensaje}`).join("\n")}` : ""}`);

  const nombreEstado = (id: Id | undefined) => (id ? modelo.estados[id]?.nombre ?? id : "—");
  const currentDe = (ctx: { estadosCurrent: Record<Id, Id> }, nombre: string) =>
    nombreEstado(ctx.estadosCurrent[Object.values(modelo.entidades).find((e) => e.nombre === nombre)!.id]);

  // Corrida determinista: debe completar el flujo feliz.
  const det = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));
  console.log(`\ncorrida determinista: estado=${det.estado} pasos=${det.trace.length} reloj=${det.reloj ?? 0}`);
  for (const entrada of det.trace) {
    const transiciones = entrada.transicionesAplicadas
      .map((t) => `${nombreEstado(t.estadoAntesId ?? undefined)}→${nombreEstado(t.estadoDespuesId ?? undefined)}`)
      .join(", ");
    console.log(`  - ${entrada.procesoNombre}${entrada.omitido ? " [OMITIDO]" : ""}${entrada.diagnostico ? ` (${entrada.diagnostico})` : ""}${transiciones ? ` [${transiciones}]` : ""}${entrada.eventosTemporales?.length ? ` ⚠eventos=${entrada.eventosTemporales.length}` : ""}`);
  }
  console.log(`  finales: Muestra=${currentDe(det, "Muestra")} Veredicto=${currentDe(det, "Veredicto")} Informe=${currentDe(det, "Informe")} Registro LIS=${currentDe(det, "Registro LIS")} Bitácora=${currentDe(det, "Bitácora")}`);

  if (det.estado !== "completado") throw new Error("La corrida determinista no completó");
  if (currentDe(det, "Muestra") !== "validada") throw new Error("Muestra no llegó a validada");
  if (currentDe(det, "Registro LIS") !== "actualizado") throw new Error("Registro LIS no llegó a actualizado");
  const validarEntrada = det.trace.find((t) => t.procesoNombre.startsWith("Validar"));
  const eligioAprobado = validarEntrada?.transicionesAplicadas.some((t) => nombreEstado(t.estadoDespuesId ?? undefined) === "aprobado");
  if (!eligioAprobado) throw new Error("Determinista debía elegir la rama de mayor Pr (aprobado)");
  const emitirEntrada = det.trace.find((t) => t.procesoNombre === "Emitir Informe");
  if (emitirEntrada?.omitido) throw new Error("Emitir Informe no debía omitirse en el flujo feliz");
  if (!det.trace.find((t) => t.procesoNombre === "Manejar Demora")?.omitido) {
    throw new Error("Manejar Demora debía quedar omitido por condición en el flujo feliz");
  }

  // Muestreo: buscar semillas que tomen la rama de rechazo y que detecten
  // sobretiempo (demuestra Dist + excepción temporal estocástica).
  let vistoRechazo = false;
  let vistoSobretiempo = false;
  for (let semilla = 1; semilla <= 60 && !(vistoRechazo && vistoSobretiempo); semilla++) {
    // `modo` vive en el contexto (lo fija el store en la app); aquí se inyecta.
    const mu = ejecutarCorrida(modelo, { ...iniciarSimulacion(modelo, modelo.opdRaizId, { semilla }), modo: "muestreo" as const });
    const veredicto = currentDe(mu, "Veredicto");
    const sobretiempo = mu.trace.some((t) => t.eventosTemporales?.some((ev) => ev.tipo === "sobretiempo"));
    if (veredicto === "rechazado" && !vistoRechazo) {
      vistoRechazo = true;
      const emitirMu = mu.trace.find((t) => t.procesoNombre === "Emitir Informe");
      console.log(`\nmuestreo semilla=${semilla}: Veredicto=rechazado → Emitir Informe omitido=${emitirMu?.omitido === true}`);
      if (!emitirMu?.omitido) throw new Error("Con veredicto rechazado, Emitir Informe debía omitirse por condición");
    }
    if (sobretiempo && !vistoSobretiempo) {
      vistoSobretiempo = true;
      console.log(`muestreo semilla=${semilla}: SOBRETIEMPO detectado en Analizar (desvío al manejador)`);
    }
  }
  if (!vistoRechazo) throw new Error("Ninguna semilla 1-60 tomó la rama de rechazo (Pr 0.3): sospechoso");
  if (!vistoSobretiempo) console.log("nota: ninguna semilla 1-60 excedió los 8 min (duración 4-15, posible)");
}

async function subir(modelo: Modelo): Promise<void> {
  const credenciales = readFileSync(join(homedir(), ".opforja-operator-credentials"), "utf8");
  const email = credenciales.match(/email:\s*(\S+)/)?.[1];
  const password = credenciales.match(/password temporal:\s*(\S+)/)?.[1];
  if (!email || !password) throw new Error("No pude leer email/password de ~/.opforja-operator-credentials");

  const base = "https://opforja.sanixai.com";
  const login = await fetch(`${base}/__deep-opm/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (login.status !== 200) throw new Error(`login falló: ${login.status}`);
  const cookie = login.headers.get("set-cookie")?.split(";")[0];
  if (!cookie) throw new Error("login sin cookie");

  const ahora = new Date().toISOString();
  const persistido = {
    id: "lab-sim-opm-v3",
    nombre: modelo.nombre,
    descripcion: "Modelo canónico de prueba del motor de simulación (generado por scripts/generar-laboratorio-simulacion.ts)",
    creadoEn: ahora,
    actualizadoEn: ahora,
    json: exportarModelo(modelo),
  };
  const respuesta = await fetch(`${base}/__deep-opm/modelos`, {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify({ modelo: persistido }),
  });
  console.log(`\nsubida a ${base}: HTTP ${respuesta.status}`);
  if (respuesta.status !== 200) throw new Error(`guardar falló: ${respuesta.status} ${await respuesta.text()}`);
  const lista = await fetch(`${base}/__deep-opm/modelos`, { headers: { cookie } });
  const cuerpo = (await lista.json()) as { modelos?: Array<{ id: string; nombre: string }> };
  console.log(`modelos del tenant: ${cuerpo.modelos?.map((mm) => `${mm.nombre} (${mm.id})`).join(" · ")}`);
}

const modelo = construirLaboratorio();
console.log(`modelo: ${modelo.nombre}`);
console.log(`  entidades=${Object.keys(modelo.entidades).length} estados=${Object.keys(modelo.estados).length} enlaces=${Object.keys(modelo.enlaces).length} opds=${Object.keys(modelo.opds).length} abanicos=${Object.keys(modelo.abanicos ?? {}).length}`);
sanear(modelo);
writeFileSync("/tmp/laboratorio-simulacion-opm.json", exportarModelo(modelo));
console.log("\nJSON escrito en /tmp/laboratorio-simulacion-opm.json");
if (process.argv.includes("--subir")) {
  await subir(modelo);
}
