import { writeFileSync } from "node:fs";
import { crearAutor, emitirBundle } from "../../src/autoria";
import { exportarModelo, hidratarModelo } from "../../src/serializacion/json";
import { iniciarSimulacion, ejecutarCorrida } from "../../src/modelo/simulacion/runner";
import { planificarSimulacion } from "../../src/modelo/simulacion/plan";
import type { Id } from "../../src/modelo/tipos";

const salida = "app/_local/bundles/simulacion-opm-laboratorio-complejo.json";

const a = crearAutor({
  id: "modelo-simulacion-lab-complejo",
  nombre: "Laboratorio complejo de simulacion OPM",
});

const mustId = (id: Id | null, contexto: string): Id => {
  if (!id) throw new Error(`${contexto}: se esperaba enlace creado`);
  return id;
};

const enlace = (id: Id) => {
  const e = a.modelo.enlaces[id];
  if (!e) throw new Error(`Enlace no encontrado: ${id}`);
  return e;
};

const estado = (entidad: string, nombre: string) => {
  const id = a.idEstado(entidad, nombre);
  const e = a.modelo.estados[id];
  if (!e) throw new Error(`Estado no encontrado: ${entidad}:${nombre}`);
  return e;
};

const entidad = (key: string) => {
  const id = a.id(key);
  const e = a.modelo.entidades[id];
  if (!e) throw new Error(`Entidad no encontrada: ${key}`);
  return e;
};

const setRuta = (ids: Id[], ruta: string) => {
  for (const id of ids) enlace(id).rutaEtiqueta = ruta;
};

const setTiempoMax = (id: Id, valor: string, unidad: string) => {
  const e = enlace(id);
  e.tiempoMaximo = valor;
  e.unidadTiempoMaximo = unidad;
};

const setProb = (id: Id, probabilidad: number) => {
  const e = enlace(id);
  e.modificador = "evento";
  e.subtipoModificador = "E";
  e.probabilidad = probabilidad;
};

// OPDs
// SD raiz: vista sintética. SD1: realización descompuesta que alimenta la simulación.
a.opd("sd", "SD - Laboratorio de despacho critico", null, 0);
a.opd("orquestacion", "SD1 - Orquestacion simulable del despacho critico", "sd", 1);

// Objetos y procesos principales.
a.entidad("orden", "objeto", "Orden de despacho", "informacional", "sistemica", "Solicitud operativa que cambia de estado hasta cierre.");
a.entidad("paquete", "objeto", "Paquete fisico", "fisica", "sistemica", "Unidad material preparada, transportada y entregada.");
a.entidad("riesgo", "objeto", "Riesgo operativo", "informacional", "sistemica", "Estado de excepcion que puede activar escalamiento.");
a.entidad("coordinador", "objeto", "Coordinador logistico", "fisica", "sistemica", "Agente responsable de decisiones operativas.");
a.entidad("wms", "objeto", "Plataforma WMS", "informacional", "sistemica", "Instrumento informacional usado para validar, priorizar y registrar.");
a.entidad("vehiculo", "objeto", "Vehiculo asignado", "fisica", "sistemica", "Instrumento fisico que ejecuta el transporte.");
a.entidad("cliente", "objeto", "Cliente receptor", "fisica", "ambiental", "Actor ambiental que confirma la recepcion.");
a.entidad("orquestar", "proceso", "Orquestar despacho critico", "informacional", "sistemica", "Proceso raiz descompuesto en pasos simulables.");

// Atributos de valor runtime: prueban copia atributo->atributo y parametros de simulacion.
a.atributo("prioridad-solicitada", "Prioridad solicitada", "Valor inicial usado por el WMS para asignar prioridad.");
a.atributo("prioridad-asignada", "Prioridad asignada", "Valor runtime producido por el calculo de prioridad.");
entidad("prioridad-solicitada").valorSlot = { tipo: "integer", placeholder: "value", valor: 4 };
entidad("prioridad-solicitada").simulacion = {
  simulable: true,
  configuracion: { modo: "numerica", distribucion: "uniform", entero: true, uniformMin: 1, uniformMax: 5 },
};
entidad("prioridad-asignada").valorSlot = { tipo: "integer", placeholder: "value", valor: 0 };

// Procesos internos del in-zoom.
a.entidad("validar", "proceso", "Validar orden recibida", "informacional", "sistemica");
a.entidad("calcular", "proceso", "Calcular prioridad operativa", "informacional", "sistemica");
a.entidad("autorizar", "proceso", "Autorizar cumplimiento por ruta", "informacional", "sistemica");
a.entidad("investigar-rechazo", "proceso", "Investigar rechazo", "informacional", "sistemica");
a.entidad("preparar", "proceso", "Preparar paquete fisico", "fisica", "sistemica");
a.entidad("elegir", "proceso", "Elegir modo de despacho", "informacional", "sistemica");
a.entidad("transportar", "proceso", "Transportar paquete", "fisica", "sistemica");
a.entidad("gestionar-demora", "proceso", "Gestionar demora", "informacional", "sistemica");
a.entidad("escalar", "proceso", "Escalar riesgo operativo", "informacional", "sistemica");
a.entidad("confirmar", "proceso", "Confirmar recepcion", "informacional", "sistemica");
a.entidad("cerrar", "proceso", "Cerrar orden de despacho", "informacional", "sistemica");

// State sets con designaciones explícitas.
a.estados("orden", [
  "recibida",
  "validada",
  "rechazada",
  "priorizada",
  "reservada",
  "preparada",
  "despachada express",
  "despachada estandar",
  "cerrada",
], "recibida", "cerrada");
a.designarEstado("orden", "recibida", "current");

a.estados("paquete", ["pendiente de armado", "armado", "en transito", "entregado"], "pendiente de armado", "entregado");
a.designarEstado("paquete", "pendiente de armado", "current");

a.estados("riesgo", ["normal", "demora detectada", "escalado"], "normal", "escalado");
a.designarEstado("riesgo", "normal", "current");

// Duraciones: el transporte nominal excede el umbral de sobretiempo y debe informar evento temporal.
estado("paquete", "en transito").duracion = { unidad: "h", min: 3, nominal: 4, max: 6 };
estado("orden", "reservada").duracion = { unidad: "min", min: 10, nominal: 15, max: 25 };
estado("orden", "preparada").duracion = { unidad: "min", min: 20, nominal: 30, max: 45 };

// Refinamiento del proceso raiz.
a.refDescomp("orquestar", "orquestacion");

// SD raiz.
a.ver("sd", "orden", 80, 140, 230, 120);
a.ver("sd", "orquestar", 390, 150, 260, 120);
a.ver("sd", "paquete", 730, 120, 220, 110);
a.ver("sd", "riesgo", 730, 300, 220, 100);
a.ver("sd", "coordinador", 110, 340, 220, 90);
a.ver("sd", "wms", 390, 340, 220, 90);
a.ver("sd", "vehiculo", 730, 460, 220, 90);
a.ver("sd", "prioridad-solicitada", 80, 500, 210, 80);
a.ver("sd", "prioridad-asignada", 390, 500, 210, 80);
a.ver("sd", "cliente", 1010, 150, 220, 90);
a.enlazar("sd", "orden", "orquestar", "consumo");
a.enlazar("sd", "orden", "orquestar", "instrumento", { modificador: "condicion" });
a.enlazar("sd", "orquestar", "orden", "resultado");
a.enlazar("sd", "paquete", "orquestar", "consumo");
a.enlazar("sd", "paquete", "orquestar", "instrumento", { modificador: "condicion" });
a.enlazar("sd", "orquestar", "paquete", "resultado");
a.enlazar("sd", "coordinador", "orquestar", "agente");
a.enlazar("sd", "wms", "orquestar", "instrumento");
a.enlazar("sd", "cliente", "orquestar", "agente");

// SD1: contorno y objetos contextuales.
a.ver("orquestacion", "orquestar", 40, 30, 1320, 960);
a.ver("orquestacion", "orden", 90, 150, 245, 132);
a.ver("orquestacion", "paquete", 90, 520, 245, 120);
a.ver("orquestacion", "riesgo", 90, 760, 230, 108);
a.ver("orquestacion", "prioridad-solicitada", 90, 340, 210, 80);
a.ver("orquestacion", "prioridad-asignada", 1120, 340, 210, 80);
a.ver("orquestacion", "coordinador", 1120, 120, 220, 86);
a.ver("orquestacion", "wms", 1120, 230, 220, 86);
a.ver("orquestacion", "vehiculo", 1120, 540, 220, 86);
a.ver("orquestacion", "cliente", 1120, 790, 220, 86);

a.ver("orquestacion", "validar", 460, 120, 230, 82);
a.ver("orquestacion", "calcular", 460, 240, 245, 82);
a.ver("orquestacion", "autorizar", 460, 360, 260, 82);
a.ver("orquestacion", "investigar-rechazo", 760, 360, 245, 82);
a.ver("orquestacion", "preparar", 460, 500, 245, 82);
a.ver("orquestacion", "elegir", 460, 620, 245, 82);
a.ver("orquestacion", "transportar", 460, 740, 230, 82);
a.ver("orquestacion", "gestionar-demora", 760, 740, 230, 82);
a.ver("orquestacion", "escalar", 760, 860, 245, 82);
a.ver("orquestacion", "confirmar", 460, 980, 230, 82);
a.ver("orquestacion", "cerrar", 760, 980, 245, 82);

for (const p of ["validar", "calcular", "autorizar", "investigar-rechazo", "preparar", "elegir", "transportar", "gestionar-demora", "escalar", "confirmar", "cerrar"]) {
  a.enlazar("orquestacion", "orquestar", p, "agregacion");
}

// Estructurales contextuales.
a.enlazar("orquestacion", "orden", "prioridad-solicitada", "exhibicion", { etiqueta: "declara" });
a.enlazar("orquestacion", "orden", "prioridad-asignada", "exhibicion", { etiqueta: "porta" });
a.enlazar("orquestacion", "paquete", "vehiculo", "etiquetado", { etiqueta: "es transportado por" });
a.aparecerEnlace("sd", "orden", "prioridad-solicitada", "exhibicion");
a.aparecerEnlace("sd", "orden", "prioridad-asignada", "exhibicion");
a.aparecerEnlace("sd", "paquete", "vehiculo", "etiquetado");

// Enlaces agente/instrumento que deben verse durante preparación.
for (const p of ["validar", "calcular", "autorizar", "investigar-rechazo", "elegir", "cerrar"]) {
  a.enlazar("orquestacion", "coordinador", p, "agente");
  a.enlazar("orquestacion", "wms", p, "instrumento");
}
a.enlazar("orquestacion", "vehiculo", "transportar", "instrumento");
a.enlazar("orquestacion", "cliente", "confirmar", "agente");

// Cadena principal de estados de Orden.
a.enlazar("orquestacion", { entidad: "orden", estado: "recibida" }, "validar", "consumo");
a.enlazar("orquestacion", "validar", { entidad: "orden", estado: "validada" }, "resultado");

a.enlazar("orquestacion", { entidad: "orden", estado: "validada" }, "calcular", "consumo");
a.enlazar("orquestacion", "calcular", { entidad: "orden", estado: "priorizada" }, "resultado");
a.enlazar("orquestacion", "prioridad-solicitada", "calcular", "consumo");
a.enlazar("orquestacion", "calcular", "prioridad-asignada", "resultado");

// Rama de diagnóstico: al no estar la orden rechazada, debe omitirse con explicación.
a.enlazar("orquestacion", { entidad: "orden", estado: "rechazada" }, "investigar-rechazo", "consumo", { modificador: "condicion" });
a.enlazar("orquestacion", "investigar-rechazo", { entidad: "orden", estado: "cerrada" }, "resultado");

// Mismo proceso, dos rutas consumo-resultado secuenciales: prueba paths canónicos.
const r1c = mustId(a.enlazar("orquestacion", { entidad: "orden", estado: "priorizada" }, "autorizar", "consumo"), "ruta priorizada-reservada consumo");
const r1r = mustId(a.enlazar("orquestacion", "autorizar", { entidad: "orden", estado: "reservada" }, "resultado"), "ruta priorizada-reservada resultado");
const r2c = mustId(a.enlazar("orquestacion", { entidad: "orden", estado: "reservada" }, "autorizar", "consumo"), "ruta reservada-preparada consumo");
const r2r = mustId(a.enlazar("orquestacion", "autorizar", { entidad: "orden", estado: "preparada" }, "resultado"), "ruta reservada-preparada resultado");
setRuta([r1c, r1r], "priorizada-reservada");
setRuta([r2c, r2r], "reservada-preparada");
a.posicionarEtiqueta("orquestacion", { entidad: "orden", estado: "priorizada" }, "autorizar", "consumo", 0.35, { offset: { x: -18, y: -16 } });
a.posicionarEtiqueta("orquestacion", "autorizar", { entidad: "orden", estado: "preparada" }, "resultado", 0.65, { offset: { x: 18, y: 16 } });

// Preparación física del paquete, conectada a la orden preparada como condición.
a.enlazar("orquestacion", { entidad: "orden", estado: "preparada" }, "preparar", "instrumento", { modificador: "condicion" });
a.enlazar("orquestacion", { entidad: "paquete", estado: "pendiente de armado" }, "preparar", "consumo");
a.enlazar("orquestacion", "preparar", { entidad: "paquete", estado: "armado" }, "resultado");

// XOR de salida: determinista elige estandar por mayor probabilidad; muestreo/exhaustivo prueba ramas.
a.enlazar("orquestacion", { entidad: "orden", estado: "preparada" }, "elegir", "consumo");
const express = mustId(a.enlazar("orquestacion", "elegir", { entidad: "orden", estado: "despachada express" }, "resultado", { etiqueta: "express" }), "rama express");
const estandar = mustId(a.enlazar("orquestacion", "elegir", { entidad: "orden", estado: "despachada estandar" }, "resultado", { etiqueta: "estandar" }), "rama estandar");
const abanico = a.abanico("orquestacion", [express, estandar], "XOR");
setProb(express, 0.35);
setProb(estandar, 0.65);
const fan = a.modelo.abanicos?.[abanico];
if (!fan) throw new Error("Abanico XOR no localizado");
fan.decision = { modo: "probabilidades", pesos: { [express]: 0.35, [estandar]: 0.65 } };

// Transporte con duración y excepción temporal observable.
a.enlazar("orquestacion", { entidad: "paquete", estado: "armado" }, "transportar", "consumo");
a.enlazar("orquestacion", "transportar", { entidad: "paquete", estado: "en transito" }, "resultado");
const sobretiempo = mustId(a.enlazar("orquestacion", "transportar", "gestionar-demora", "excepcionSobretiempo"), "excepcion sobretiempo");
setTiempoMax(sobretiempo, "2", "h");

// Gestión de excepción temporal y condición que queda satisfecha después de gestionar la demora.
a.enlazar("orquestacion", { entidad: "riesgo", estado: "normal" }, "gestionar-demora", "consumo");
a.enlazar("orquestacion", "gestionar-demora", { entidad: "riesgo", estado: "demora detectada" }, "resultado");
a.enlazar("orquestacion", { entidad: "riesgo", estado: "demora detectada" }, "escalar", "consumo", { modificador: "condicion" });
a.enlazar("orquestacion", "escalar", { entidad: "riesgo", estado: "escalado" }, "resultado");

// Cierre operativo.
a.enlazar("orquestacion", { entidad: "paquete", estado: "en transito" }, "confirmar", "consumo");
a.enlazar("orquestacion", "confirmar", { entidad: "paquete", estado: "entregado" }, "resultado");
a.enlazar("orquestacion", { entidad: "paquete", estado: "entregado" }, "cerrar", "instrumento", { modificador: "condicion" });
a.enlazar("orquestacion", "cerrar", { entidad: "orden", estado: "cerrada" }, "resultado");

const resultado = emitirBundle(a, {
  // El laboratorio conserva deliberadamente un doble consumo ruteado del mismo objeto
  // en "Autorizar cumplimiento por ruta" para probar paths; el canon metodológico lo
  // reporta como advertencia, pero el wire format y la simulación deben aceptarlo.
  lanzarEnError: false,
  descripcion: [
    "Laboratorio no-HODOM para probar simulacion OPM de opforja.",
    "Cubre microfases, estados anclables, rutas consumo-resultado, XOR probabilistico, condiciones omitidas, duracion, excepciones temporales y copia atributo->atributo.",
    "Dominio deliberadamente acotado: despacho critico con orden informacional, paquete fisico, riesgo operativo, agentes e instrumentos.",
  ],
  reporteExtra: [
    "Criterio de diseno: complejidad semantica antes que volumen visual.",
    "La ruta priorizada-reservada / reservada-preparada prueba el mecanismo path sobre el mismo proceso y el mismo objeto.",
    "La rama XOR de despacho prueba decision determinista, muestreo y exhaustivo sin duplicar procesos.",
  ],
});

const hidratadoInicial = hidratarModelo(resultado.json);
if (!hidratadoInicial.ok) throw new Error(`Hidratacion pre-ajuste fallo: ${hidratadoInicial.error}`);
const modeloAjustado = hidratadoInicial.value;

// El layout canónico optimiza legibilidad general, pero este bundle es un laboratorio de simulación:
// la coordenada Y de los procesos es el orden temporal ejecutable. La fijamos explícitamente.
const fijarProceso = (key: string, x: number, y: number) => {
  const entidadId = a.id(key);
  const opd = modeloAjustado.opds[a.idOpd("orquestacion")];
  if (!opd) throw new Error("OPD de orquestación no encontrado");
  const apariencia = Object.values(opd.apariencias).find((item) => item.entidadId === entidadId);
  if (!apariencia) throw new Error(`Apariencia no encontrada para ${key}`);
  apariencia.x = x;
  apariencia.y = y;
};

fijarProceso("validar", 460, 120);
fijarProceso("investigar-rechazo", 760, 210);
fijarProceso("calcular", 460, 300);
fijarProceso("autorizar", 460, 420);
fijarProceso("preparar", 460, 560);
fijarProceso("elegir", 460, 680);
fijarProceso("transportar", 460, 800);
fijarProceso("gestionar-demora", 760, 900);
fijarProceso("escalar", 760, 1020);
fijarProceso("confirmar", 460, 1140);
fijarProceso("cerrar", 760, 1260);

const jsonFinal = exportarModelo(modeloAjustado);
writeFileSync(salida, `${jsonFinal}\n`, "utf8");

const hidratado = hidratarModelo(jsonFinal);
if (!hidratado.ok) throw new Error(`Hidratacion fallo: ${hidratado.error}`);
const modelo = hidratado.value;
const plan = planificarSimulacion(modelo, modelo.opdRaizId);
const corrida = ejecutarCorrida(modelo, iniciarSimulacion(modelo, modelo.opdRaizId));
const eventosTemporales = corrida.trace.flatMap((t) => t.eventosTemporales ?? []);
const omitidos = corrida.trace.filter((t) => t.omitido);
const cambiosValor = corrida.trace.flatMap((t) => t.cambiosValor);
const rutas = corrida.trace.flatMap((t) => t.transicionesAplicadas.map((x) => x.rutaEtiqueta).filter(Boolean));
const ramaXor = corrida.trace.find((t) => t.procesoNombre === "Elegir modo de despacho")?.diagnostico;

if (plan.length < 10) throw new Error(`Plan demasiado pobre: ${plan.length}`);
if (eventosTemporales.length < 1) throw new Error("No se detectaron eventos temporales");
if (omitidos.length < 1) throw new Error("No se detecto proceso omitido por condicion");
if (cambiosValor.length < 1) throw new Error("No se detecto cambio de valor runtime");
if (!rutas.includes("priorizada-reservada") || !rutas.includes("reservada-preparada")) {
  throw new Error(`Rutas esperadas ausentes: ${rutas.join(", ")}`);
}
if (!ramaXor?.includes("rama")) throw new Error("No se registro diagnostico de rama XOR");

console.log(JSON.stringify({
  salida,
  conteos: resultado.conteos,
  avisos: resultado.avisos.length,
  plan: plan.map((p) => `${p.opdNombre} :: ${p.procesoNombre}${p.transicionesPlanificadas.length ? ` [${p.transicionesPlanificadas.map((t) => t.rutaEtiqueta ?? "-").join("|")}]` : ""}`),
  trace: corrida.trace.map((t) => ({
    n: t.numero,
    proceso: t.procesoNombre,
    omitido: Boolean(t.omitido),
    diagnostico: t.diagnostico,
    transiciones: t.transicionesAplicadas.map((x) => x.rutaEtiqueta ?? `${x.estadoAntesId ?? "null"}->${x.estadoDespuesId ?? "null"}`),
    cambiosValor: t.cambiosValor.length,
    eventosTemporales: t.eventosTemporales?.map((e) => e.tipo) ?? [],
    duracion: t.duracion,
  })),
}, null, 2));
