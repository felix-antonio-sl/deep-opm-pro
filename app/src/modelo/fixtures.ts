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
      && !e.refinamiento
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

export function fixtureTodos(): FixtureDemo[] {
  return [
    crearCafetera(),
    crearDiagnosticoClinico(),
    crearLogisticaEnvios(),
    crearControlCalidad(),
  ];
}
