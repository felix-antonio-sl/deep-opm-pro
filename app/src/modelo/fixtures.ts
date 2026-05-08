import {
  agregarEstado,
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  desplegarObjeto,
  designarEstadoFinal,
  designarEstadoInicial,
  renombrarEntidad,
  renombrarEstado,
} from "./operaciones";
import appModeladoraOpmDeseadaDoc from "./demo-models/app-modeladora-opm-deseada.json";
import { tieneRefinamiento } from "./refinamientos";
import { hidratarModelo } from "../serializacion/json";
import type { Id, Modelo } from "./tipos";

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(`Fixture error: ${resultado.error}`);
  return resultado.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

/**
 * Categoria del fixture en el catalogo Beta1 (ronda 16 L4).
 *
 * - "demo-pedagogica": ejemplos pequeños y didacticos del wizard SD canonico
 *   (Cafetera, OnStar, SD Generico, etc.) y demos secundarias para enseñar
 *   patrones aislados (estados, descomposicion, agregacion).
 * - "ancla-real": modelos no triviales con multi-OPD, estados, descomposicion
 *   y/o despliegue, usados como base de eval Beta1 (criterios de cierre §174
 *   en HANDOFF). Distinto de "demo-pedagogica" porque condensa un dominio
 *   completo, no un patron aislado.
 *
 * El catalogo simple (DialogoCargarModelo / PantallaInicio) lista ambos sin
 * carpetas. El campo es declarativo: filtros y agrupaciones son
 * responsabilidad de consumidores (no se introducen aqui).
 */
export type CategoriaFixture = "demo-pedagogica" | "ancla-real";

function fixtureDesdeDocumento(documento: unknown, proposito: string, descripcion: string): FixtureDemo {
  const hidratado = hidratarModelo(JSON.stringify(documento));
  if (!hidratado.ok) throw new Error(`Fixture JSON invalido: ${hidratado.error}`);
  return { modelo: hidratado.value, proposito, descripcion };
}

function renombrarRefinadores(modelo: Modelo, opdId: Id, contornoId: Id, nombres: string[]): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) throw new Error(`OPD no encontrado: ${opdId}`);
  const refinadores = Object.values(opd.apariencias)
    .map((apariencia) => ({
      apariencia,
      entidad: modelo.entidades[apariencia.entidadId],
    }))
    .filter((item): item is { apariencia: typeof item.apariencia; entidad: NonNullable<typeof item.entidad> } => (
      item.entidad !== undefined && item.entidad.id !== contornoId
    ))
    .sort((a, b) => a.apariencia.y === b.apariencia.y ? a.apariencia.x - b.apariencia.x : a.apariencia.y - b.apariencia.y);

  let actual = modelo;
  for (const [index, nombre] of nombres.entries()) {
    const entidad = refinadores[index]?.entidad;
    if (!entidad) continue;
    actual = must(renombrarEntidad(actual, entidad.id, nombre));
  }
  return actual;
}

export interface FixtureDemo {
  modelo: Modelo;
  proposito: string;
  descripcion: string;
  /** Categoria del fixture. Default `"demo-pedagogica"` para preservar fixtures previas sin tocarlas. */
  categoria?: CategoriaFixture;
}

export function crearModeloVacioFixture(): FixtureDemo {
  return {
    modelo: crearModelo("Modelo Vacio"),
    proposito: "Probar el estado inicial, canvas vacio, guardado y primer flujo de modelamiento.",
    descripcion: "Fixture minimo equivalente a fixtures/empty-model. Sirve para QA de onboarding, estado vacio y acciones iniciales.",
    categoria: "demo-pedagogica",
  };
}

export function crearCafetera(): FixtureDemo {
  let modelo = crearModelo("Cafetera Domestica");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Persona"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 90 }, "Cafe Molido"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 430, y: 90 }, "Agua"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 600, y: 90 }, "Cafetera"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 345, y: 230 }, "Hacer Cafe"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 345, y: 370 }, "Cafe Hecho"));

  const persona = entidadPorNombre(modelo, "Persona");
  const cafeMolido = entidadPorNombre(modelo, "Cafe Molido");
  const agua = entidadPorNombre(modelo, "Agua");
  const cafetera = entidadPorNombre(modelo, "Cafetera");
  const hacerCafe = entidadPorNombre(modelo, "Hacer Cafe");
  const cafeHecho = entidadPorNombre(modelo, "Cafe Hecho");

  for (const id of [persona, cafetera, hacerCafe, cafeHecho, cafeMolido, agua]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  modelo = must(cambiarAfiliacion(modelo, persona, "ambiental"));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, cafeMolido, hacerCafe, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, agua, hacerCafe, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, hacerCafe, cafeHecho, "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, persona, hacerCafe, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, cafetera, hacerCafe, "instrumento"));

  return {
    modelo,
    proposito: "Transformar cafe molido y agua en cafe hecho, mediante una persona y una cafetera.",
    descripcion: "Ejemplo canonico del wizard SD del manual metodologico OPM. Modelo minimo con consumo, produccion, agente e instrumento.",
    categoria: "demo-pedagogica",
  };
}

export function crearDiagnosticoClinico(): FixtureDemo {
  let modelo = crearModelo("Diagnostico Clinico");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Medico"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 330, y: 90 }, "Paciente"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 570, y: 90 }, "Historia Clinica"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 345, y: 370 }, "Sistema Clinico"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 345, y: 230 }, "Diagnosticar"));

  const medico = entidadPorNombre(modelo, "Medico");
  const paciente = entidadPorNombre(modelo, "Paciente");
  const historia = entidadPorNombre(modelo, "Historia Clinica");
  const sistema = entidadPorNombre(modelo, "Sistema Clinico");
  const diagnosticar = entidadPorNombre(modelo, "Diagnosticar");

  for (const id of [medico, paciente, historia, sistema, diagnosticar]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  modelo = must(cambiarAfiliacion(modelo, medico, "ambiental"));
  modelo = must(cambiarAfiliacion(modelo, paciente, "ambiental"));

  const estRes = must(crearEstadosIniciales(modelo, paciente));
  modelo = estRes.modelo;
  const [e1Id, e2Id] = estRes.estadoIds;
  modelo = must(renombrarEstado(modelo, e1Id, "no-diagnosticado"));
  modelo = must(renombrarEstado(modelo, e2Id, "diagnosticado"));
  modelo = must(designarEstadoInicial(modelo, e1Id));
  modelo = must(designarEstadoFinal(modelo, e2Id));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, diagnosticar, paciente, "efecto"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, medico, diagnosticar, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, historia, diagnosticar, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistema, diagnosticar, "instrumento"));

  return {
    modelo,
    proposito: "Transformar un paciente no-diagnosticado en diagnosticado, mediante un medico y su historia clinica.",
    descripcion: "SD canonico con estados (no-diagnosticado / diagnosticado) y efecto a nivel entidad. Dos instrumentos.",
    categoria: "demo-pedagogica",
  };
}

export function crearLogisticaEnvios(): FixtureDemo {
  let modelo = crearModelo("Logistica de Envios");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Pedido"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 330, y: 90 }, "Operador Logistico"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 570, y: 90 }, "Sistema Logistico"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 345, y: 230 }, "Procesar Envio"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 345, y: 370 }, "Entrega"));

  const pedido = entidadPorNombre(modelo, "Pedido");
  const operador = entidadPorNombre(modelo, "Operador Logistico");
  const sistemaLog = entidadPorNombre(modelo, "Sistema Logistico");
  const procesar = entidadPorNombre(modelo, "Procesar Envio");
  const entrega = entidadPorNombre(modelo, "Entrega");

  for (const id of [pedido, operador, sistemaLog, procesar, entrega]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  modelo = must(cambiarAfiliacion(modelo, operador, "ambiental"));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, pedido, procesar, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesar, entrega, "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, operador, procesar, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistemaLog, procesar, "instrumento"));

  const descRes = must(descomponerProceso(modelo, modelo.opdRaizId, procesar));
  modelo = descRes.modelo;
  const sd1Id = descRes.opdId;

  const sd1 = modelo.opds[sd1Id];
  if (!sd1) throw new Error("SD1 no creado");

  const subEntidades = Object.values(modelo.entidades)
    .filter((e) => e.tipo === "proceso"
      && !tieneRefinamiento(e)
      && Object.values(sd1.apariencias).some((a) => a.entidadId === e.id));
  const subIds = subEntidades.map((e) => e.id);

  if (subIds.length >= 3) {
    modelo = must(renombrarEntidad(modelo, subIds[0]!, "Recibir Pedido"));
    modelo = must(renombrarEntidad(modelo, subIds[1]!, "Preparar Paquete"));
    modelo = must(renombrarEntidad(modelo, subIds[2]!, "Enviar Paquete"));

    for (const sid of subIds) {
      modelo = must(cambiarEsencia(modelo, sid, "fisica"));
    }
    modelo = must(crearEnlace(modelo, sd1Id, subIds[0]!, subIds[1]!, "invocacion"));
    modelo = must(crearEnlace(modelo, sd1Id, subIds[1]!, subIds[2]!, "invocacion"));
  }

  return {
    modelo,
    proposito: "Transformar un pedido en una entrega mediante procesamiento logistico con tres sub-procesos.",
    descripcion: "Modelo multi-nivel: SD con in-zooming a SD1 (Recibir Pedido, Preparar Paquete, Enviar Paquete). Incluye invocacion entre sub-procesos.",
    categoria: "demo-pedagogica",
  };
}

export function crearControlCalidad(): FixtureDemo {
  let modelo = crearModelo("Control de Calidad");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Producto"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 330, y: 90 }, "Inspector"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 570, y: 90 }, "Estandar de Calidad"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 345, y: 230 }, "Inspeccionar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 345, y: 370 }, "Sistema de Inspeccion"));

  const producto = entidadPorNombre(modelo, "Producto");
  const inspector = entidadPorNombre(modelo, "Inspector");
  const estandar = entidadPorNombre(modelo, "Estandar de Calidad");
  const inspeccionar = entidadPorNombre(modelo, "Inspeccionar");
  const sistemaInsp = entidadPorNombre(modelo, "Sistema de Inspeccion");

  for (const id of [producto, inspector, estandar, inspeccionar, sistemaInsp]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  modelo = must(cambiarAfiliacion(modelo, inspector, "ambiental"));
  modelo = must(cambiarAfiliacion(modelo, producto, "ambiental"));

  const estRes = must(crearEstadosIniciales(modelo, producto));
  modelo = estRes.modelo;
  const [e1Id, e2Id] = estRes.estadoIds;
  modelo = must(renombrarEstado(modelo, e1Id, "no-inspeccionado"));
  modelo = must(renombrarEstado(modelo, e2Id, "aprobado"));
  modelo = must(designarEstadoInicial(modelo, e1Id));
  modelo = must(designarEstadoFinal(modelo, e2Id));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, inspeccionar, producto, "efecto"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, inspector, inspeccionar, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, estandar, inspeccionar, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sistemaInsp, inspeccionar, "instrumento"));

  return {
    modelo,
    proposito: "Transformar un producto no-inspeccionado en aprobado, mediante un inspector que usa un estandar de calidad.",
    descripcion: "SD con estados en objeto transformee (no-inspeccionado / aprobado) y efecto a nivel entidad. Dos instrumentos.",
    categoria: "demo-pedagogica",
  };
}

export function crearOnStarSystem(): FixtureDemo {
  let modelo = crearModelo("OnStar System");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 50 }, "Driver"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 660, y: 50 }, "OnStar System"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 760, y: 110 }, "GPS"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 760, y: 180 }, "Cellular Network"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 760, y: 250 }, "VCIM"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 760, y: 320 }, "OnStar Console"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 390, y: 200 }, "Driver Rescuing"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 210, y: 310 }, "OnStar Advisor"));

  const driver = entidadPorNombre(modelo, "Driver");
  const onstarSys = entidadPorNombre(modelo, "OnStar System");
  const gps = entidadPorNombre(modelo, "GPS");
  const celNet = entidadPorNombre(modelo, "Cellular Network");
  const vcim = entidadPorNombre(modelo, "VCIM");
  const console_ = entidadPorNombre(modelo, "OnStar Console");
  const rescuing = entidadPorNombre(modelo, "Driver Rescuing");
  const advisor = entidadPorNombre(modelo, "OnStar Advisor");

  for (const id of [driver, onstarSys, gps, celNet, vcim, console_, rescuing, advisor]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  modelo = must(cambiarAfiliacion(modelo, driver, "ambiental"));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, gps, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, celNet, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, vcim, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, console_, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, advisor, rescuing, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, rescuing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, rescuing, driver, "efecto"));

  return {
    modelo,
    proposito: "Rescatar a un conductor en peligro mediante el sistema OnStar y un asesor.",
    descripcion: "Ejemplo clasico OPM del estandar ISO 19450. Agregacion estructural (OnStar System consta de GPS, Cellular Network, VCIM, OnStar Console), agente (OnStar Advisor), instrumento (OnStar System) y efecto sobre Driver.",
    categoria: "demo-pedagogica",
  };
}

export function crearSdTemplate(): FixtureDemo {
  let modelo = crearModelo("SD Generico");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 50 }, "System Name"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 50 }, "System Handler"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 430, y: 50 }, "System Tool Set"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 150 }, "Main Input"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 660, y: 50 }, "Beneficiary Group"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 660, y: 150 }, "Beneficiary Attribute"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 390, y: 230 }, "Main System Doing"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 390, y: 370 }, "Main Output"));

  const sysName = entidadPorNombre(modelo, "System Name");
  const handler = entidadPorNombre(modelo, "System Handler");
  const toolSet = entidadPorNombre(modelo, "System Tool Set");
  const mainInput = entidadPorNombre(modelo, "Main Input");
  const beneficiary = entidadPorNombre(modelo, "Beneficiary Group");
  const attr = entidadPorNombre(modelo, "Beneficiary Attribute");
  const mainDoing = entidadPorNombre(modelo, "Main System Doing");
  const mainOutput = entidadPorNombre(modelo, "Main Output");

  modelo = must(cambiarEsencia(modelo, handler, "fisica"));
  modelo = must(cambiarEsencia(modelo, beneficiary, "fisica"));
  modelo = must(cambiarEsencia(modelo, mainDoing, "fisica"));

  const estRes = must(crearEstadosIniciales(modelo, attr));
  modelo = estRes.modelo;
  const [e1Id, e2Id] = estRes.estadoIds;
  modelo = must(renombrarEstado(modelo, e1Id, "problematic"));
  modelo = must(renombrarEstado(modelo, e2Id, "satisfactory"));
  modelo = must(designarEstadoInicial(modelo, e1Id));
  modelo = must(designarEstadoFinal(modelo, e2Id));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sysName, mainDoing, "exhibicion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, beneficiary, attr, "exhibicion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainDoing, attr, "efecto"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, handler, mainDoing, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainInput, mainDoing, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sysName, mainDoing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, toolSet, mainDoing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainDoing, mainOutput, "resultado"));

  return {
    modelo,
    proposito: "Plantilla generica de SD con agente, instrumentos, consumo, produccion y efecto con cambio de estado.",
    descripcion: "Plantilla wizard canonica: System Name exhibe Main System Doing, System Handler + Tool Set como enablers, Main Input consumido, Main Output producido, Beneficiary con atributo de estado problematic→satisfactory.",
    categoria: "demo-pedagogica",
  };
}

export function crearSystemDiagramFixture(): FixtureDemo {
  const fixture = crearSdTemplate();
  return {
    modelo: {
      ...fixture.modelo,
      nombre: "System Diagram",
      descripcion: "Equivalente kernel del fixture observacional fixtures/system-diagram.",
    },
    proposito: "Representar un System Diagram canonico con input, output, handler, tool set y beneficiario.",
    descripcion: "Demo equivalente a fixtures/system-diagram: SD raiz con proceso central, consumo, resultado, agente, instrumentos y cambio de estado del atributo beneficiario.",
    categoria: "demo-pedagogica",
  };
}

export function crearSdAsyncInzoomed(): FixtureDemo {
  let modelo = crearModelo("SD Async");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 50 }, "System Name"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 50 }, "System Handler"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 430, y: 50 }, "System Tool Set"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 600, y: 50 }, "Main Input"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 390, y: 230 }, "Main System Doing"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 390, y: 370 }, "Main Output"));

  const sysName = entidadPorNombre(modelo, "System Name");
  const handler = entidadPorNombre(modelo, "System Handler");
  const toolSet = entidadPorNombre(modelo, "System Tool Set");
  const mainInput = entidadPorNombre(modelo, "Main Input");
  const mainDoing = entidadPorNombre(modelo, "Main System Doing");
  const mainOutput = entidadPorNombre(modelo, "Main Output");

  modelo = must(cambiarEsencia(modelo, handler, "fisica"));
  modelo = must(cambiarEsencia(modelo, mainDoing, "fisica"));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sysName, mainDoing, "exhibicion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, handler, mainDoing, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainInput, mainDoing, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sysName, mainDoing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, toolSet, mainDoing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainDoing, mainOutput, "resultado"));

  const descRes = must(descomponerProceso(modelo, modelo.opdRaizId, mainDoing));
  modelo = descRes.modelo;
  const sd1Id = descRes.opdId;
  const sd1 = modelo.opds[sd1Id];
  if (!sd1) throw new Error("SD1 no creado");

  const subEntidades = Object.values(modelo.entidades)
    .filter((e) => e.tipo === "proceso"
      && !tieneRefinamiento(e)
      && Object.values(sd1.apariencias).some((a) => a.entidadId === e.id));
  const subIds = subEntidades.map((e) => e.id);

  if (subIds.length >= 3) {
    modelo = must(renombrarEntidad(modelo, subIds[0]!, "First Processing"));
    modelo = must(renombrarEntidad(modelo, subIds[1]!, "Second Processing"));
    modelo = must(renombrarEntidad(modelo, subIds[2]!, "Third Processing"));

    for (const sid of subIds) {
      modelo = must(cambiarEsencia(modelo, sid, "fisica"));
    }
    modelo = must(crearEnlace(modelo, sd1Id, subIds[0]!, subIds[1]!, "invocacion"));
    modelo = must(crearEnlace(modelo, sd1Id, subIds[1]!, subIds[2]!, "invocacion"));
  }

  return {
    modelo,
    proposito: "Procesamiento asincrono con descomposicion en 3 sub-procesos independientes.",
    descripcion: "SD con in-zooming asincrono: Main System Doing se descompone en First/Second/Third Processing. Sub-procesos invocados secuencialmente pero sin dependencia de estado (asincrono).",
    categoria: "demo-pedagogica",
  };
}

export function crearSdSyncInzoomed(): FixtureDemo {
  let modelo = crearModelo("SD Sync");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 50 }, "System Name"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 50 }, "System Handler"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 430, y: 50 }, "System Tool Set"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 150 }, "Main Input"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 660, y: 50 }, "Beneficiary Group"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 660, y: 150 }, "Beneficiary Relevant Attribute"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 390, y: 230 }, "Main System Doing"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 390, y: 370 }, "Main Output"));

  const sysName = entidadPorNombre(modelo, "System Name");
  const handler = entidadPorNombre(modelo, "System Handler");
  const toolSet = entidadPorNombre(modelo, "System Tool Set");
  const mainInput = entidadPorNombre(modelo, "Main Input");
  const beneficiary = entidadPorNombre(modelo, "Beneficiary Group");
  const attr = entidadPorNombre(modelo, "Beneficiary Relevant Attribute");
  const mainDoing = entidadPorNombre(modelo, "Main System Doing");
  const mainOutput = entidadPorNombre(modelo, "Main Output");

  modelo = must(cambiarEsencia(modelo, handler, "fisica"));
  modelo = must(cambiarEsencia(modelo, beneficiary, "fisica"));
  modelo = must(cambiarEsencia(modelo, mainDoing, "fisica"));

  const estRes = must(crearEstadosIniciales(modelo, attr));
  modelo = estRes.modelo;
  const [e1Id, e2Id] = estRes.estadoIds;
  modelo = must(renombrarEstado(modelo, e1Id, "problematic"));
  modelo = must(renombrarEstado(modelo, e2Id, "satisfactory"));
  modelo = must(designarEstadoInicial(modelo, e1Id));
  modelo = must(designarEstadoFinal(modelo, e2Id));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sysName, mainDoing, "exhibicion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, beneficiary, attr, "exhibicion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainDoing, attr, "efecto"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, handler, mainDoing, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainInput, mainDoing, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, sysName, mainDoing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, toolSet, mainDoing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, mainDoing, mainOutput, "resultado"));

  const descRes = must(descomponerProceso(modelo, modelo.opdRaizId, mainDoing));
  modelo = descRes.modelo;
  const sd1Id = descRes.opdId;
  const sd1 = modelo.opds[sd1Id];
  if (!sd1) throw new Error("SD1 no creado");
  const subProcesos = Object.values(modelo.entidades)
    .filter((e) => e.tipo === "proceso"
      && e.id !== mainDoing
      && !tieneRefinamiento(e)
      && Object.values(sd1.apariencias).some((a) => a.entidadId === e.id))
    .sort((a, b) => {
      const aparienciaA = Object.values(sd1.apariencias).find((item) => item.entidadId === a.id);
      const aparienciaB = Object.values(sd1.apariencias).find((item) => item.entidadId === b.id);
      return (aparienciaA?.x ?? 0) - (aparienciaB?.x ?? 0);
    });
  for (const [index, nombre] of ["First Processing", "Second Processing", "Third Processing"].entries()) {
    const subProceso = subProcesos[index];
    if (subProceso) modelo = must(renombrarEntidad(modelo, subProceso.id, nombre));
  }
  modelo = must(crearProceso(modelo, sd1Id, { x: 720, y: 250 }, "Last Processing"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 90, y: 90 }, "SD1 Main Input"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 570, y: 90 }, "Main I/O Output"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 570, y: 180 }, "I/O Object Relevant Attribute"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 430, y: 370 }, "Temp Object"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 720, y: 370 }, "SD1 Main Output"));

  const first = entidadPorNombre(modelo, "First Processing");
  const second = entidadPorNombre(modelo, "Second Processing");
  const third = entidadPorNombre(modelo, "Third Processing");
  const last = entidadPorNombre(modelo, "Last Processing");
  const sd1Input = entidadPorNombre(modelo, "SD1 Main Input");
  const ioOutput = entidadPorNombre(modelo, "Main I/O Output");
  const ioAttr = entidadPorNombre(modelo, "I/O Object Relevant Attribute");
  const temp = entidadPorNombre(modelo, "Temp Object");
  const sd1Output = entidadPorNombre(modelo, "SD1 Main Output");

  for (const id of [first, second, third, last]) modelo = must(cambiarEsencia(modelo, id, "fisica"));
  modelo = must(crearEnlace(modelo, sd1Id, ioOutput, ioAttr, "exhibicion"));
  modelo = must(crearEnlace(modelo, sd1Id, sd1Input, first, "consumo"));
  modelo = must(crearEnlace(modelo, sd1Id, first, ioAttr, "efecto"));
  modelo = must(crearEnlace(modelo, sd1Id, first, temp, "resultado"));
  modelo = must(crearEnlace(modelo, sd1Id, temp, second, "consumo"));
  modelo = must(crearEnlace(modelo, sd1Id, second, ioAttr, "efecto"));
  modelo = must(crearEnlace(modelo, sd1Id, third, ioAttr, "efecto"));
  modelo = must(crearEnlace(modelo, sd1Id, third, temp, "efecto"));
  modelo = must(crearEnlace(modelo, sd1Id, temp, last, "consumo"));
  modelo = must(crearEnlace(modelo, sd1Id, last, sd1Output, "resultado"));
  modelo = must(crearEnlace(modelo, sd1Id, first, second, "invocacion"));
  modelo = must(crearEnlace(modelo, sd1Id, second, third, "invocacion"));
  modelo = must(crearEnlace(modelo, sd1Id, third, last, "invocacion"));

  return {
    modelo,
    proposito: "Ejercitar in-zoom sincronico con cadena de subprocesos, objeto temporal y atributo afectado.",
    descripcion: "Equivalente kernel de fixtures/sd-sync: SD raiz con transformacion y SD1 con First/Second/Third/Last Processing, Temp Object y Main I/O Output.",
    categoria: "demo-pedagogica",
  };
}

export function crearOpmStructureMetaModel(): FixtureDemo {
  let modelo = crearModelo("OPM Structure Meta Model");

  const nombres = [
    "OPM Model", "System", "OPD Set", "OPL Spec", "OPM Stereotype", "OPD",
    "OPL Paragraph", "OPD Construct", "OPL Sentence", "Link Set", "Link",
    "Thing Set", "Thing", "Name", "Phrase", "Reserved Phrase",
  ];
  for (const [index, nombre] of nombres.entries()) {
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, {
      x: 60 + (index % 4) * 190,
      y: 40 + Math.floor(index / 4) * 105,
    }, nombre));
  }

  const id = (nombre: string) => entidadPorNombre(modelo, nombre);
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPM Model"), id("System"), "exhibicion", "specifies"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPM Model"), id("OPD Set"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPM Model"), id("OPL Spec"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPM Model"), id("OPM Stereotype"), "generalizacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPD Set"), id("OPD"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPL Spec"), id("OPL Paragraph"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPL Paragraph"), id("OPL Sentence"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPD"), id("OPD Construct"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPD Construct"), id("OPL Sentence"), "exhibicion", "equivalent"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPD Construct"), id("Link Set"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("OPD Construct"), id("Thing Set"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("Link Set"), id("Link"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("Thing Set"), id("Thing"), "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("Thing"), id("Name"), "exhibicion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, id("Phrase"), id("Reserved Phrase"), "generalizacion"));

  const construct = id("OPD Construct");
  const constructUnfold = must(desplegarObjeto(modelo, modelo.opdRaizId, construct, "agregacion"));
  modelo = renombrarRefinadores(constructUnfold.modelo, constructUnfold.opdId, construct, ["Construct Link Set", "Construct Thing Set", "Construct OPL Sentence"]);

  const thing = id("Thing");
  const thingUnfold = must(desplegarObjeto(modelo, modelo.opdRaizId, thing, "generalizacion"));
  modelo = renombrarRefinadores(thingUnfold.modelo, thingUnfold.opdId, thing, ["Linked Thing", "OPM Object", "OPM Process"]);

  const link = id("Link");
  const linkUnfold = must(desplegarObjeto(modelo, modelo.opdRaizId, link, "agregacion"));
  modelo = renombrarRefinadores(linkUnfold.modelo, linkUnfold.opdId, link, ["Source", "Connector", "Destination"]);

  return {
    modelo,
    proposito: "Mostrar la estructura de OPM como modelo: OPD, OPL, constructos, cosas y enlaces.",
    descripcion: "Equivalente kernel reducido de fixtures/opm-meta-model. Incluye SD raiz y despliegues de OPD Construct, Thing y Link para ejercitar arbol OPD y enlaces estructurales.",
    categoria: "demo-pedagogica",
  };
}

export function crearAppModeladoraOpmDeseada(): FixtureDemo {
  return {
    ...fixtureDesdeDocumento(
    appModeladoraOpmDeseadaDoc,
    "Modelo amplio derivado de historias-usuario-v2 para probar la app como sistema modelado.",
    "Modelo de 8 OPDs usado en la auditoria UX: fuerza importacion, arbol OPD profundo, biblioteca, OPL filtrable, validacion metodologica y guardado local.",
    ),
    categoria: "ancla-real",
  };
}

export function crearEjemploOrganizacional(): FixtureDemo {
  let modelo = crearModelo("Ejemplo organizacional");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 50 }, "Cliente"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 50 }, "Necesidad"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 430, y: 50 }, "Persona"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 600, y: 50 }, "Agente IA"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 340 }, "Organizacion"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 600, y: 340 }, "Servicio"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 345, y: 430 }, "Aprendizaje"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 345, y: 195 }, "Entregar Valor"));

  const cliente = entidadPorNombre(modelo, "Cliente");
  const necesidad = entidadPorNombre(modelo, "Necesidad");
  const persona = entidadPorNombre(modelo, "Persona");
  const agenteIa = entidadPorNombre(modelo, "Agente IA");
  const organizacion = entidadPorNombre(modelo, "Organizacion");
  const servicio = entidadPorNombre(modelo, "Servicio");
  const aprendizaje = entidadPorNombre(modelo, "Aprendizaje");
  const entregarValor = entidadPorNombre(modelo, "Entregar Valor");

  modelo = must(cambiarEsencia(modelo, cliente, "fisica"));
  modelo = must(cambiarEsencia(modelo, persona, "fisica"));
  modelo = must(cambiarEsencia(modelo, entregarValor, "fisica"));
  modelo = must(cambiarAfiliacion(modelo, cliente, "ambiental"));
  modelo = must(cambiarAfiliacion(modelo, persona, "ambiental"));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, necesidad, entregarValor, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entregarValor, servicio, "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entregarValor, aprendizaje, "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, persona, entregarValor, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, agenteIa, entregarValor, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, organizacion, entregarValor, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entregarValor, cliente, "efecto"));

  const descRes = must(descomponerProceso(modelo, modelo.opdRaizId, entregarValor));
  modelo = descRes.modelo;
  const sd1Id = descRes.opdId;
  const sd1 = modelo.opds[sd1Id];
  if (!sd1) throw new Error("SD1 no creado");

  const subEntidades = Object.values(modelo.entidades)
    .filter((e) => e.tipo === "proceso"
      && !tieneRefinamiento(e)
      && Object.values(sd1.apariencias).some((a) => a.entidadId === e.id));
  const subIds = subEntidades.map((e) => e.id);

  if (subIds.length >= 3) {
    modelo = must(renombrarEntidad(modelo, subIds[0]!, "Analizar Necesidad"));
    modelo = must(renombrarEntidad(modelo, subIds[1]!, "Disenar Solucion"));
    modelo = must(renombrarEntidad(modelo, subIds[2]!, "Validar Entrega"));

    for (const sid of subIds) {
      modelo = must(cambiarEsencia(modelo, sid, "fisica"));
    }
    modelo = must(crearEnlace(modelo, sd1Id, subIds[0]!, subIds[1]!, "invocacion"));
    modelo = must(crearEnlace(modelo, sd1Id, subIds[1]!, subIds[2]!, "invocacion"));
  }

  return {
    modelo,
    proposito: "Transformar necesidades de clientes en servicios entregados, mediante personas como agentes y Agente IA + Organizacion como instrumentos.",
    descripcion: "Ejemplo organizacional canonico: SD con 8 entidades (7+1), wizard completo. Agente IA como instrumento (no agente: OPM §agente requiere entidad fisica). SD1 con in-zooming a 3 sub-procesos encadenados por invocacion.",
    categoria: "demo-pedagogica",
  };
}

/**
 * Ancla pedagogico Beta1 (ronda 16 L4).
 *
 * Modelo "Prestamo Bibliotecario": dominio NO clinico (HODOM-HSC reservado a L5)
 * que ejerce los criterios de cierre Beta1 (ver HANDOFF §174):
 *   1) multi-OPD: SD raiz + SD1 in-zoom de "Procesar Prestamo" + OPD despliegue
 *      de "Biblioteca" como agregacion estructural.
 *   2) descomposicion + despliegue ortogonales en distintas entidades (schema
 *      dual ronda 15.2; usa helpers de ./refinamientos para preservar el
 *      contrato post-15.2).
 *   3) estados de "Libro": disponible/prestado/atrasado, con designacion
 *      inicial y final via crearEstadosIniciales + agregarEstado.
 *   4) >= 6 enlaces variados: agente, instrumento, consumo, resultado, efecto,
 *      agregacion (estructural) e invocacion (en SD1).
 *
 * El modelo es sintetico, construido desde conocimiento general (no se importa
 * de repos hd-dt/hdos/hdos-app porque ninguno expone modelos OPM verificables
 * — decision documentada en docs/roadmap/plan-betas-operativo.md). Es seguro
 * para rerun: el catalogo simple lo lista junto a las demos pedagogicas con la
 * categoria "ancla-real".
 *
 * Refs: SSOT opm-iso-19450-es.md §3.69 in-zoom, §3.71 State, §refinamiento.
 */
export function crearPrestamoBibliotecario(): FixtureDemo {
  let modelo = crearModelo("Prestamo Bibliotecario");

  // SD raiz: Socio + Libro + Bibliotecario + Biblioteca + Procesar Prestamo + Boleta de Prestamo.
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 60 }, "Socio"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 280, y: 60 }, "Libro"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 470, y: 60 }, "Bibliotecario"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 660, y: 60 }, "Biblioteca"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 380, y: 230 }, "Procesar Prestamo"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 380, y: 380 }, "Boleta de Prestamo"));

  const socio = entidadPorNombre(modelo, "Socio");
  const libro = entidadPorNombre(modelo, "Libro");
  const bibliotecario = entidadPorNombre(modelo, "Bibliotecario");
  const biblioteca = entidadPorNombre(modelo, "Biblioteca");
  const procesarPrestamo = entidadPorNombre(modelo, "Procesar Prestamo");
  const boleta = entidadPorNombre(modelo, "Boleta de Prestamo");

  // Esencia fisica para participantes humanos y artefactos materiales.
  for (const id of [socio, libro, bibliotecario, biblioteca, procesarPrestamo, boleta]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  // Socio y Bibliotecario son ambientales (externos al sistema biblioteca).
  modelo = must(cambiarAfiliacion(modelo, socio, "ambiental"));
  modelo = must(cambiarAfiliacion(modelo, bibliotecario, "ambiental"));

  // Estados de Libro: disponible -> prestado, mas un tercer estado "atrasado"
  // para ejercer agregarEstado() ademas de crearEstadosIniciales().
  const estResLibro = must(crearEstadosIniciales(modelo, libro));
  modelo = estResLibro.modelo;
  const [eDisponibleId, ePrestadoId] = estResLibro.estadoIds;
  modelo = must(renombrarEstado(modelo, eDisponibleId, "disponible"));
  modelo = must(renombrarEstado(modelo, ePrestadoId, "prestado"));
  modelo = must(designarEstadoInicial(modelo, eDisponibleId));
  modelo = must(designarEstadoFinal(modelo, ePrestadoId));
  const estResAtrasado = must(agregarEstado(modelo, libro, "atrasado"));
  modelo = estResAtrasado.modelo;

  // Enlaces SD raiz: 5 variados del wizard SD canonico (agente, instrumento,
  // consumo, resultado, efecto). La agregacion estructural Biblioteca->{partes}
  // se materializa en el OPD despliegue (SD1) y NO en el SD raiz; replicarla
  // aqui seria redundante. Una agregacion Biblioteca->Bibliotecario seria
  // OPM-incorrecta (el bibliotecario es agente ambiental, no parte estructural).
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, bibliotecario, procesarPrestamo, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, biblioteca, procesarPrestamo, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, socio, procesarPrestamo, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesarPrestamo, boleta, "resultado"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, procesarPrestamo, libro, "efecto"));

  // Despliegue estructural de Biblioteca como agregacion (Estructura, ortogonal
  // a Comportamiento). Slot "despliegue" indexado en entidad.refinamientos
  // (helpers fijarRefinamiento, ver ronda 15.2).
  const desRes = must(desplegarObjeto(modelo, modelo.opdRaizId, biblioteca, "agregacion"));
  modelo = desRes.modelo;
  const opdBibliotecaId = desRes.opdId;
  const opdBiblioteca = modelo.opds[opdBibliotecaId];
  if (!opdBiblioteca) throw new Error("OPD despliegue Biblioteca no creado");

  // El despliegue genera 3 partes placeholder (UNFOLD.partesIniciales = 3).
  // Renombrarlas a los componentes estructurales reales: Sucursal Central,
  // Sucursal Barrial, Catalogo Digital. Conservar esencia "fisica" para las
  // partes (asset material) salvo el Catalogo (informacional).
  const partesBiblioteca = Object.values(modelo.entidades)
    .filter((e) => e.tipo === "objeto"
      && !tieneRefinamiento(e)
      && e.id !== biblioteca
      && Object.values(opdBiblioteca.apariencias).some((a) => a.entidadId === e.id))
    .map((e) => e.id);

  if (partesBiblioteca.length >= 3) {
    modelo = must(renombrarEntidad(modelo, partesBiblioteca[0]!, "Sucursal Central"));
    modelo = must(renombrarEntidad(modelo, partesBiblioteca[1]!, "Sucursal Barrial"));
    modelo = must(renombrarEntidad(modelo, partesBiblioteca[2]!, "Catalogo Digital"));
    for (const sid of partesBiblioteca.slice(0, 2)) {
      modelo = must(cambiarEsencia(modelo, sid, "fisica"));
    }
    // Catalogo Digital queda en informacional (default) por ser activo digital.
  }

  // Descomposicion de "Procesar Prestamo" en SD1 con sub-procesos en cadena.
  const descRes = must(descomponerProceso(modelo, modelo.opdRaizId, procesarPrestamo));
  modelo = descRes.modelo;
  const sd1Id = descRes.opdId;
  const sd1 = modelo.opds[sd1Id];
  if (!sd1) throw new Error("SD1 Procesar Prestamo no creado");

  const subProcesos = Object.values(modelo.entidades)
    .filter((e) => e.tipo === "proceso"
      && !tieneRefinamiento(e)
      && Object.values(sd1.apariencias).some((a) => a.entidadId === e.id))
    .map((e) => e.id);

  if (subProcesos.length >= 3) {
    modelo = must(renombrarEntidad(modelo, subProcesos[0]!, "Validar Socio"));
    modelo = must(renombrarEntidad(modelo, subProcesos[1]!, "Registrar Prestamo"));
    modelo = must(renombrarEntidad(modelo, subProcesos[2]!, "Entregar Libro"));
    for (const sid of subProcesos) {
      modelo = must(cambiarEsencia(modelo, sid, "fisica"));
    }
    // Encadenar via invocacion sincrona: validar -> registrar -> entregar.
    modelo = must(crearEnlace(modelo, sd1Id, subProcesos[0]!, subProcesos[1]!, "invocacion"));
    modelo = must(crearEnlace(modelo, sd1Id, subProcesos[1]!, subProcesos[2]!, "invocacion"));
  }

  return {
    modelo,
    proposito: "Transformar un libro disponible en libro prestado, mediante un bibliotecario que registra la operacion en una boleta para un socio externo.",
    descripcion: "Ancla Beta1 pedagogica multi-OPD. Biblioteca se despliega en SD-Biblioteca (Sucursal Central, Sucursal Barrial, Catalogo Digital). Procesar Prestamo se descompone en SD1 (Validar Socio -> Registrar Prestamo -> Entregar Libro). Estados Libro: disponible/prestado/atrasado.",
    categoria: "ancla-real",
  };
}

/**
 * Ancla pedagogica secundaria liviana Beta1 (ronda 16 L4).
 *
 * Modelo "Comprar Pan": SD unico, sin descomposicion ni despliegue, sin
 * estados de objeto. Ejerce el catalogo simple para verificar que la
 * categoria "ancla-real" puede convivir con un modelo trivial cuando el
 * dominio asi lo amerita; es complementaria al ancla primaria (cuyo SD raiz
 * es denso) para mostrar dos extremos de tamaño.
 *
 * Refs: SSOT opm-iso-19450-es.md §3.55, §3.69, §3 vinculos transformantes.
 */
export function crearComprarPan(): FixtureDemo {
  let modelo = crearModelo("Comprar Pan");

  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 90, y: 90 }, "Cliente"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 270, y: 90 }, "Dinero"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 460, y: 90 }, "Panadero"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 640, y: 90 }, "Panaderia"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 360, y: 230 }, "Comprar Pan"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 360, y: 380 }, "Pan"));

  const cliente = entidadPorNombre(modelo, "Cliente");
  const dinero = entidadPorNombre(modelo, "Dinero");
  const panadero = entidadPorNombre(modelo, "Panadero");
  const panaderia = entidadPorNombre(modelo, "Panaderia");
  const comprarPan = entidadPorNombre(modelo, "Comprar Pan");
  const pan = entidadPorNombre(modelo, "Pan");

  for (const id of [cliente, dinero, panadero, panaderia, comprarPan, pan]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  modelo = must(cambiarAfiliacion(modelo, cliente, "ambiental"));
  modelo = must(cambiarAfiliacion(modelo, panadero, "ambiental"));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, cliente, comprarPan, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, panadero, comprarPan, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, panaderia, comprarPan, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, dinero, comprarPan, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, comprarPan, pan, "resultado"));

  return {
    modelo,
    proposito: "Transformar dinero en pan mediante un cliente y un panadero que operan en la panaderia.",
    descripcion: "Ancla Beta1 secundaria liviana. SD unico, 5 enlaces (dos agentes, un instrumento, consumo, resultado). Sin descomposicion ni estados; util para validar el catalogo simple sobre un modelo plano.",
    categoria: "ancla-real",
  };
}

export function fixtureTodos(): FixtureDemo[] {
  return [
    crearCafetera(),
    crearOnStarSystem(),
    crearDiagnosticoClinico(),
    crearSdTemplate(),
    crearSystemDiagramFixture(),
    crearLogisticaEnvios(),
    crearSdAsyncInzoomed(),
    crearSdSyncInzoomed(),
    crearControlCalidad(),
    crearEjemploOrganizacional(),
    crearPrestamoBibliotecario(),
    crearComprarPan(),
    crearModeloVacioFixture(),
    crearOpmStructureMetaModel(),
    crearAppModeladoraOpmDeseada(),
  ];
}

/**
 * Filtra fixtures por categoria. Helper publico para consumidores del catalogo
 * simple (UI catalogo Beta1, scripts de eval). No introduce ordenamiento ni
 * permisos: deja la decision visual al consumidor.
 */
export function fixturesPorCategoria(categoria: CategoriaFixture): FixtureDemo[] {
  return fixtureTodos().filter((f) => (f.categoria ?? "demo-pedagogica") === categoria);
}
