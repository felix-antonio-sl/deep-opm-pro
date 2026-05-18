import {
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
import { tieneRefinamiento } from "./refinamientos";
import type { Apariencia, Id, Modelo } from "./tipos";

function must<T>(resultado: { ok: true; value: T } | { ok: false; error: string }): T {
  if (!resultado.ok) throw new Error(`Fixture error: ${resultado.error}`);
  return resultado.value;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Id {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
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

function subprocesosRefinadoresOrdenados(modelo: Modelo, opdId: Id, contornoId: Id): Id[] {
  const opd = modelo.opds[opdId];
  if (!opd) throw new Error(`OPD no encontrado: ${opdId}`);
  return Object.values(modelo.entidades)
    .filter((entidad) => entidad.tipo === "proceso"
      && entidad.id !== contornoId
      && !tieneRefinamiento(entidad)
      && Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidad.id))
    .sort((a, b) => {
      const apA = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === a.id);
      const apB = Object.values(opd.apariencias).find((apariencia) => apariencia.entidadId === b.id);
      return (apA?.x ?? 0) - (apB?.x ?? 0);
    })
    .map((entidad) => entidad.id);
}

function asegurarApariencia(modelo: Modelo, opdId: Id, entidadId: Id, x: number, y: number): Modelo {
  const opd = modelo.opds[opdId];
  if (!opd) throw new Error(`OPD no encontrado: ${opdId}`);
  if (Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidadId)) return modelo;
  const aparienciaId = `a-${modelo.nextSeq}`;
  const apariencia: Apariencia = {
    id: aparienciaId,
    entidadId,
    opdId,
    x,
    y,
    width: 135,
    height: 60,
  };
  return {
    ...modelo,
    nextSeq: modelo.nextSeq + 1,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: apariencia,
        },
      },
    },
  };
}

export type CategoriaFixture = "opcloud-sandbox";

export interface FixtureDemo {
  modelo: Modelo;
  proposito: string;
  descripcion: string;
  categoria: CategoriaFixture;
}

export function crearModeloVacioFixture(): FixtureDemo {
  return {
    modelo: crearModelo("Modelo Vacio"),
    proposito: "Probar el estado inicial, canvas vacio, guardado y primer flujo de modelamiento.",
    descripcion: "Replica funcional del fixture OPCloud sandbox Empty Model.",
    categoria: "opcloud-sandbox",
  };
}

export function crearSystemDiagramFixture(): FixtureDemo {
  let modelo = crearModelo("System Diagram");

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

  return {
    modelo,
    proposito: "Representar el System Diagram generico publicado en OPCloud sandbox.",
    descripcion: "Replica funcional de fixtures/system-diagram: proceso central, input, output, handler, tool set y atributo beneficiario con estados problematic/satisfactory.",
    categoria: "opcloud-sandbox",
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
  const subIds = subprocesosRefinadoresOrdenados(modelo, sd1Id, mainDoing);

  for (const [index, nombre] of ["First Processing", "Second Processing", "Third Processing"].entries()) {
    const subId = subIds[index];
    if (!subId) continue;
    modelo = must(renombrarEntidad(modelo, subId, nombre));
    modelo = must(cambiarEsencia(modelo, subId, "fisica"));
  }
  if (subIds.length >= 3) {
    modelo = must(crearEnlace(modelo, sd1Id, subIds[0]!, subIds[1]!, "invocacion"));
    modelo = must(crearEnlace(modelo, sd1Id, subIds[1]!, subIds[2]!, "invocacion"));
  }

  return {
    modelo,
    proposito: "Replicar el sandbox SD and SD1 asynchronous process.",
    descripcion: "SD raiz con in-zoom de Main System Doing a First/Second/Third Processing, equivalente funcional de fixtures/sd-async.",
    categoria: "opcloud-sandbox",
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
  const subIds = subprocesosRefinadoresOrdenados(modelo, sd1Id, mainDoing);

  for (const [index, nombre] of ["First Processing", "Second Processing", "Third Processing"].entries()) {
    const subId = subIds[index];
    if (!subId) continue;
    modelo = must(renombrarEntidad(modelo, subId, nombre));
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
    proposito: "Replicar el sandbox SD and SD1 synchronous process.",
    descripcion: "SD raiz con atributo beneficiario y SD1 sincronico con First/Second/Third/Last Processing, Temp Object y Main I/O Output.",
    categoria: "opcloud-sandbox",
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
  const cellNet = entidadPorNombre(modelo, "Cellular Network");
  const vcim = entidadPorNombre(modelo, "VCIM");
  const console_ = entidadPorNombre(modelo, "OnStar Console");
  const rescuing = entidadPorNombre(modelo, "Driver Rescuing");
  const advisor = entidadPorNombre(modelo, "OnStar Advisor");

  for (const id of [driver, onstarSys, gps, cellNet, vcim, console_, rescuing, advisor]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  modelo = must(cambiarAfiliacion(modelo, driver, "ambiental"));

  const driverStates = must(crearEstadosIniciales(modelo, driver));
  modelo = driverStates.modelo;
  modelo = must(renombrarEstado(modelo, driverStates.estadoIds[0]!, "endangered"));
  modelo = must(renombrarEstado(modelo, driverStates.estadoIds[1]!, "safe"));
  modelo = must(designarEstadoInicial(modelo, driverStates.estadoIds[0]!));
  modelo = must(designarEstadoFinal(modelo, driverStates.estadoIds[1]!));

  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, gps, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, cellNet, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, vcim, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, console_, "agregacion"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, advisor, rescuing, "agente"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, onstarSys, rescuing, "instrumento"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, rescuing, driver, "efecto"));

  const descRes = must(descomponerProceso(modelo, modelo.opdRaizId, rescuing));
  modelo = descRes.modelo;
  const sd1Id = descRes.opdId;
  for (const [id, x, y] of [
    [driver, 50, 70],
    [advisor, 50, 330],
    [onstarSys, 640, 60],
    [cellNet, 640, 150],
    [gps, 640, 240],
    [console_, 640, 330],
  ] as const) {
    modelo = asegurarApariencia(modelo, sd1Id, id, x, y);
  }

  const subIds = subprocesosRefinadoresOrdenados(modelo, sd1Id, rescuing);
  for (const [index, nombre] of ["Call Making", "Call Transmitting", "Call Handling"].entries()) {
    const subId = subIds[index];
    if (!subId) continue;
    modelo = must(renombrarEntidad(modelo, subId, nombre));
    modelo = must(cambiarEsencia(modelo, subId, "fisica"));
  }
  modelo = must(crearProceso(modelo, sd1Id, { x: 430, y: 250 }, "Vehicle Location Calculating"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 240, y: 90 }, "Danger Status"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 430, y: 90 }, "Vehicle Location"));
  modelo = must(crearObjeto(modelo, sd1Id, { x: 240, y: 360 }, "Call"));

  const callMaking = entidadPorNombre(modelo, "Call Making");
  const callTransmitting = entidadPorNombre(modelo, "Call Transmitting");
  const callHandling = entidadPorNombre(modelo, "Call Handling");
  const locationCalculating = entidadPorNombre(modelo, "Vehicle Location Calculating");
  const dangerStatus = entidadPorNombre(modelo, "Danger Status");
  const vehicleLocation = entidadPorNombre(modelo, "Vehicle Location");
  const call = entidadPorNombre(modelo, "Call");

  for (const id of [locationCalculating, dangerStatus, vehicleLocation, call]) {
    modelo = must(cambiarEsencia(modelo, id, "fisica"));
  }
  const callStates = must(crearEstadosIniciales(modelo, call));
  modelo = callStates.modelo;
  modelo = must(renombrarEstado(modelo, callStates.estadoIds[0]!, "requested"));
  modelo = must(renombrarEstado(modelo, callStates.estadoIds[1]!, "online"));
  modelo = must(designarEstadoInicial(modelo, callStates.estadoIds[0]!));
  modelo = must(designarEstadoFinal(modelo, callStates.estadoIds[1]!));

  modelo = must(crearEnlace(modelo, sd1Id, driver, callMaking, "agente"));
  modelo = must(crearEnlace(modelo, sd1Id, callMaking, call, "resultado"));
  modelo = must(crearEnlace(modelo, sd1Id, call, callTransmitting, "consumo"));
  modelo = must(crearEnlace(modelo, sd1Id, cellNet, callTransmitting, "instrumento"));
  modelo = must(crearEnlace(modelo, sd1Id, callMaking, callTransmitting, "invocacion"));
  modelo = must(crearEnlace(modelo, sd1Id, gps, locationCalculating, "instrumento"));
  modelo = must(crearEnlace(modelo, sd1Id, locationCalculating, vehicleLocation, "resultado"));
  modelo = must(crearEnlace(modelo, sd1Id, vehicleLocation, callHandling, "instrumento"));
  modelo = must(crearEnlace(modelo, sd1Id, dangerStatus, callHandling, "consumo"));
  modelo = must(crearEnlace(modelo, sd1Id, callTransmitting, callHandling, "invocacion"));
  modelo = must(crearEnlace(modelo, sd1Id, advisor, callHandling, "agente"));
  modelo = must(crearEnlace(modelo, sd1Id, console_, callHandling, "instrumento"));
  modelo = must(crearEnlace(modelo, sd1Id, callHandling, driver, "efecto"));

  return {
    modelo,
    proposito: "Replicar el sandbox OnStar System y conservar el ejemplo formativo del libro curado.",
    descripcion: "OnStar System es el unico ejemplo del libro curado elegido: el capitulo 8 desarrolla ACR/OnStar y el sandbox ya lo trae como fixture observado. Incluye SD raiz y SD1 Driver Rescuing con Call Making, Call Transmitting, Call Handling y Vehicle Location Calculating.",
    categoria: "opcloud-sandbox",
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
    proposito: "Replicar el sandbox OPM Structure Meta Model.",
    descripcion: "Meta-modelo OPM observado en fixtures/opm-meta-model. Incluye SD raiz y despliegues de OPD Construct, Thing y Link para ejercitar arbol OPD y enlaces estructurales.",
    categoria: "opcloud-sandbox",
  };
}

export function fixtureTodos(): FixtureDemo[] {
  return [
    crearSystemDiagramFixture(),
    crearSdSyncInzoomed(),
    crearSdAsyncInzoomed(),
    crearOnStarSystem(),
    crearOpmStructureMetaModel(),
    crearModeloVacioFixture(),
  ];
}

export function fixturesPorCategoria(categoria: CategoriaFixture): FixtureDemo[] {
  return fixtureTodos().filter((fixture) => fixture.categoria === categoria);
}
