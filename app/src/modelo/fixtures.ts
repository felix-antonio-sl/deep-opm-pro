import {
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  descomponerProceso,
  designarEstadoFinal,
  designarEstadoInicial,
  renombrarEntidad,
  renombrarEstado,
} from "./operaciones";
import { tieneRefinamiento } from "./refinamientos";
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

export interface FixtureDemo {
  modelo: Modelo;
  proposito: string;
  descripcion: string;
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
  };
}

export function fixtureTodos(): FixtureDemo[] {
  return [
    crearCafetera(),
    crearOnStarSystem(),
    crearDiagnosticoClinico(),
    crearSdTemplate(),
    crearLogisticaEnvios(),
    crearSdAsyncInzoomed(),
    crearControlCalidad(),
    crearEjemploOrganizacional(),
  ];
}
