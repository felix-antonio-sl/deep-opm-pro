// [Ronda 26 / L6 B1] Catalogo extensible de fixtures para el framework de
// roundtrip bisimetrico OPL. Cada fixture declara como construir un modelo
// (programaticamente, usando operaciones canonicas) y la OPL canonica que
// debe emitir `generarOpl` sobre ese modelo.
//
// Bisimetria que valida el framework (cf. `roundtrip.test.ts`):
//   modeloInicial ─ generarOpl ─▶ opl1
//   opl1 ─ planificarEdicionOplLibre(modeloVacio) ─▶ patches
//   modeloVacio + patches ─ aplicarPatchesOpl ─▶ modeloRecuperado
//   modeloRecuperado ─ generarOpl ─▶ opl2
//   opl1 === opl2  (igualdad linea-por-linea, no solo set-equality)
//
// Hoy se cubren las familias bisimetricamente cerradas por el aplicador
// (`aplicar.ts`): descripcion-cosa, estados (sincronizar-estados),
// procedimentales sin estado, estructurales binarias. Las familias que el
// parser entiende pero el aplicador NO inversa todavia (modificadores,
// rutas, multiplicidades, refinamientos, abanicos) NO entran como fixtures
// bisimetricos — caerian en `opl1 !== opl2` por diseno.
//
// Las lineas paralelas en curso (L1 eventos, L2 condicion+excepcion,
// L5 designaciones+plegado) deben agregar sus propios fixtures con
// `fixturesRoundtripExtra.push(...)` cuando merguen: la lista es mutable.

import {
  cambiarAfiliacion,
  cambiarEsencia,
  crearEnlace,
  crearEstadosIniciales,
  crearModelo,
  crearObjeto,
  crearProceso,
  renombrarEstado,
} from "../modelo/operaciones";
import { estadosDeEntidad } from "../modelo/operaciones";
import { extremoEstado } from "../modelo/extremos";
import { crearAutoInvocacion } from "../modelo/autoinvocacion";
import { aplicarModificador, definirDemora } from "../modelo/modificadores";
import type { Abanico, Id, Modelo, Resultado } from "../modelo/tipos";

export interface FixtureRoundtrip {
  /** Nombre estable para identificar la fixture en reportes de fallo. */
  nombre: string;
  /** Constructor puro: devuelve un modelo nuevo (sin compartir estado). */
  construir: () => Modelo;
  /** OPL canonica esperada como array de lineas (igual que `generarOpl`). */
  oracionesEsperadas: string[];
  /**
   * Bisimetria estricta: si `true`, `generarOpl(modeloRecuperado)` debe
   * coincidir linea por linea con la OPL inicial. Si `false`, la fixture
   * se queda en la fase "modelo → OPL" sin exigir reverse aplicado
   * (util para regresiones de bugs OPL que aun no tienen kernel reverse).
   */
  bisimetricaEstricta?: boolean;
}

/**
 * Helper sin azucar: extrae el resultado o lanza para que las fixtures se
 * construyan de forma lineal y los errores no se silencien.
 */
function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}

function entidadId(modelo: Modelo, nombre: string): Id {
  const ent = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!ent) throw new Error(`fixture invalida: no existe entidad '${nombre}'`);
  return ent.id;
}

function enlaceIdUnico(modelo: Modelo): Id {
  const enlace = Object.values(modelo.enlaces).at(-1);
  if (!enlace) throw new Error("fixture invalida: no existe enlace");
  return enlace.id;
}

function estadosNombrados(modelo: Modelo, entidad: Id, primero: string, segundo: string): Modelo {
  const creados = must(crearEstadosIniciales(modelo, entidad));
  let m = creados.modelo;
  m = must(renombrarEstado(m, creados.estadoIds[0], primero));
  m = must(renombrarEstado(m, creados.estadoIds[1], segundo));
  return m;
}

// ── Fixtures bisimetricas iniciales (corte 08638a8) ──────────────────────
//
// Cubren las 8 familias declaradas en la mision L6 B1 que el aplicador
// `aplicar.ts` puede recrear desde texto libre hoy. Cada bloque deja un
// comentario corto explicando que pieza del aplicador valida.

/** Fixture 1: descripcion de objeto solitario (default fisico+sistemico). */
const fixtureObjetoSolo: FixtureRoundtrip = {
  nombre: "entidad-objeto-sola",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Carro"));
    return m;
  },
  oracionesEsperadas: ["**Carro** es un objeto informacional y sistémico."],
  bisimetricaEstricta: true,
};

/** Fixture 2: descripcion de proceso solitario. */
const fixtureProcesoSolo: FixtureRoundtrip = {
  nombre: "entidad-proceso-sola",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Procesar"));
    return m;
  },
  oracionesEsperadas: ["*Procesar* es un proceso informacional y sistémico."],
  bisimetricaEstricta: true,
};

/** Fixture 3: objeto con esencia fisica y afiliacion ambiental. */
const fixtureObjetoEsenciaAfiliacion: FixtureRoundtrip = {
  nombre: "entidad-objeto-fisica-ambiental",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Bomba"));
    const id = entidadId(m, "Bomba");
    m = must(cambiarEsencia(m, id, "fisica"));
    m = must(cambiarAfiliacion(m, id, "ambiental"));
    return m;
  },
  oracionesEsperadas: ["**Bomba** es un objeto físico y ambiental."],
  bisimetricaEstricta: true,
};

/**
 * Fixture 4: objeto con dos estados (sincronizar-estados + designaciones default).
 *
 * Estricta desde el cierre del ciclo estado-objeto: el planificador acepta la
 * frase de estados sobre una entidad PLANIFICADA en una linea previa del mismo
 * texto (referencia pendiente por nombre, igual que crear-enlace) y el
 * aplicador la resuelve tras aplicar `crear-entidad` (orden por linea).
 */
const fixtureObjetoConEstados: FixtureRoundtrip = {
  nombre: "objeto-con-estados",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    const id = entidadId(m, "Pedido");
    m = must(crearEstadosIniciales(m, id)).modelo;
    const [s1, s2] = estadosDeEntidad(m, id);
    if (!s1 || !s2) throw new Error("fixture invalida: estados iniciales");
    m = must(renombrarEstado(m, s1.id, "pendiente"));
    m = must(renombrarEstado(m, s2.id, "aprobado"));
    return m;
  },
  oracionesEsperadas: [
    "**Pedido** es un objeto informacional y sistémico.",
    "**Pedido** puede estar `pendiente` o `aprobado`.",
  ],
  bisimetricaEstricta: true,
};

/** Fixture 5: enlace consumo simple (sin estado, sin modificador). */
const fixtureConsumoSimple: FixtureRoundtrip = {
  nombre: "enlace-consumo-simple",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Entrada"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Entrada"), entidadId(m, "Procesar"), "consumo"));
    return m;
  },
  oracionesEsperadas: [
    "**Entrada** es un objeto informacional y sistémico.",
    "*Procesar* es un proceso informacional y sistémico.",
    "*Procesar* consume **Entrada**.",
  ],
  bisimetricaEstricta: true,
};

/** Fixture 6: enlace resultado simple. */
const fixtureResultadoSimple: FixtureRoundtrip = {
  nombre: "enlace-resultado-simple",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Procesar"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Salida"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Procesar"), entidadId(m, "Salida"), "resultado"));
    return m;
  },
  oracionesEsperadas: [
    "*Procesar* es un proceso informacional y sistémico.",
    "**Salida** es un objeto informacional y sistémico.",
    "*Procesar* genera **Salida**.",
  ],
  bisimetricaEstricta: true,
};

/** Fixture 7: enlace instrumento ("requiere"). */
const fixtureInstrumentoSimple: FixtureRoundtrip = {
  nombre: "enlace-instrumento-simple",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Herramienta"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Herramienta"), entidadId(m, "Procesar"), "instrumento"));
    return m;
  },
  oracionesEsperadas: [
    "**Herramienta** es un objeto informacional y sistémico.",
    "*Procesar* es un proceso informacional y sistémico.",
    "*Procesar* requiere **Herramienta**.",
  ],
  bisimetricaEstricta: true,
};

/** Fixture 8: enlace agente ("maneja"). */
const fixtureAgenteSimple: FixtureRoundtrip = {
  nombre: "enlace-agente-simple",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Operador"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    m = must(cambiarEsencia(m, entidadId(m, "Operador"), "fisica"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Operador"), entidadId(m, "Procesar"), "agente"));
    return m;
  },
  oracionesEsperadas: [
    "**Operador** es un objeto físico y sistémico.",
    "*Procesar* es un proceso informacional y sistémico.",
    "**Operador** maneja *Procesar*.",
  ],
  bisimetricaEstricta: true,
};

/** Fixture 9: enlace estructural agregacion. */
const fixtureAgregacion: FixtureRoundtrip = {
  nombre: "enlace-estructural-agregacion",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Vehiculo"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Motor"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Vehiculo"), entidadId(m, "Motor"), "agregacion"));
    return m;
  },
  oracionesEsperadas: [
    "**Vehiculo** es un objeto informacional y sistémico.",
    "**Motor** es un objeto informacional y sistémico.",
    "**Vehiculo** consta de **Motor**.",
  ],
  bisimetricaEstricta: true,
};

/** Fixture 10: enlace estructural generalizacion. */
const fixtureGeneralizacion: FixtureRoundtrip = {
  nombre: "enlace-estructural-generalizacion",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Vehiculo"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Camion"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Vehiculo"), entidadId(m, "Camion"), "generalizacion"));
    return m;
  },
  oracionesEsperadas: [
    "**Vehiculo** es un objeto informacional y sistémico.",
    "**Camion** es un objeto informacional y sistémico.",
    "**Camion** es un **Vehiculo**.",
  ],
  bisimetricaEstricta: true,
};

/**
 * Fixture 11 (bug 62ee85): abanico de dos resultados al mismo objeto sin
 * estados diferenciados. Antes del fix de ronda 26/L6 B3 la OPL emitia
 * `*Procesar* genera al menos uno de **Objeto 2** y **Objeto 2**.`
 * (nombre duplicado), texto semanticamente vacio. Post-fix, la oracion del
 * abanico se deduplica y, al quedar un solo extremo distinto, cae a la
 * oracion individual: `*Procesar* genera **Objeto 2**.`
 *
 * NO bisimetrica estricta: el aplicador no inversa abanicos desde texto
 * libre, asi que el modelo recuperado no recreara el abanico (solo los
 * enlaces individuales). Verificamos la oracion canonica del generador,
 * que es lo que el bug afectaba.
 */
const fixtureBug62ee85AbanicoDeduplicado: FixtureRoundtrip = {
  nombre: "bug-62ee85-abanico-resultados-mismo-objeto",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Procesar"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Objeto_2"));
    const procesoId = entidadId(m, "Procesar");
    const objetoId = entidadId(m, "Objeto_2");
    // Dos resultados Procesar→Objeto_2 (modelo del bug: el canvas creo dos
    // enlaces visualmente diferentes pero ambos terminan en la misma entidad).
    m = must(crearEnlace(m, m.opdRaizId, procesoId, objetoId, "resultado"));
    m = must(crearEnlace(m, m.opdRaizId, procesoId, objetoId, "resultado"));
    const enlaceIds = Object.keys(m.enlaces);
    if (enlaceIds.length !== 2) throw new Error("fixture invalida: enlaces");
    // Forzamos el abanico compartiendo port en el origen.
    const portId = "port-fan-bug-62ee85";
    const enlacesActualizados = { ...m.enlaces };
    for (const id of enlaceIds) {
      const e = enlacesActualizados[id]!;
      enlacesActualizados[id] = {
        ...e,
        origenId: { ...e.origenId, portId },
      };
    }
    const abanico: Abanico = {
      id: "ab-bug-62ee85",
      opdId: m.opdRaizId,
      puertoComun: { entidadId: procesoId, lado: "origen", portId },
      puertoEntidadId: procesoId,
      operador: "O",
      enlaceIds,
    };
    m = {
      ...m,
      enlaces: enlacesActualizados,
      abanicos: { ...(m.abanicos ?? {}), [abanico.id]: abanico },
    };
    return m;
  },
  oracionesEsperadas: [
    "*Procesar* es un proceso informacional y sistémico.",
    "**Objeto 2** es un objeto informacional y sistémico.",
    "*Procesar* genera **Objeto 2**.",
  ],
  bisimetricaEstricta: true,
};

/**
 * Catalogo nucleo bisimetrico, congelado al cierre del L6 (ronda 26).
 * No mutes esta lista en el mismo archivo: agrega tus fixtures nuevas
 * (eventos, condicion+excepcion, designaciones+plegado, etc.) al array
 * `fixturesRoundtripExtra` desde la linea paralela correspondiente cuando
 * merguen, asi se mantiene la separacion entre nucleo y extension.
 */
export const fixturesRoundtripNucleo: readonly FixtureRoundtrip[] = [
  fixtureObjetoSolo,
  fixtureProcesoSolo,
  fixtureObjetoEsenciaAfiliacion,
  fixtureObjetoConEstados,
  fixtureConsumoSimple,
  fixtureResultadoSimple,
  fixtureInstrumentoSimple,
  fixtureAgenteSimple,
  fixtureAgregacion,
  fixtureGeneralizacion,
  fixtureBug62ee85AbanicoDeduplicado,
] as const;

/**
 * Array MUTABLE de extension. Las lineas L1/L2/L5 (y futuras) pueden hacer
 * `import { fixturesRoundtripExtra } from "./fixtures-roundtrip";` y
 * pushear sus fixtures aqui — o, mejor, abrir un archivo nuevo
 * (`fixtures-roundtrip-eventos.ts`) que `export const ... = [...]` y
 * desde un init re-exportarlas. Lo que NO se debe hacer es mutar el nucleo.
 */
export const fixturesRoundtripExtra: FixtureRoundtrip[] = [];

const fixtureEfectoSimple: FixtureRoundtrip = {
  nombre: "enlace-efecto-simple",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Actualizar"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Sistema"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Actualizar"), entidadId(m, "Sistema"), "efecto"));
    return m;
  },
  oracionesEsperadas: [
    "*Actualizar* es un proceso informacional y sistémico.",
    "**Sistema** es un objeto informacional y sistémico.",
    "*Actualizar* afecta **Sistema**.",
  ],
  bisimetricaEstricta: true,
};

const fixtureTransicionTs3: FixtureRoundtrip = {
  nombre: "cambio-estado-ts3",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Pedido"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Aprobar"));
    const pedidoId = entidadId(m, "Pedido");
    m = estadosNombrados(m, pedidoId, "pendiente", "aprobado");
    const [pendiente, aprobado] = estadosDeEntidad(m, pedidoId);
    if (!pendiente || !aprobado) throw new Error("fixture invalida: estados TS3");
    m = must(crearEnlace(m, m.opdRaizId, extremoEstado(pendiente.id), entidadId(m, "Aprobar"), "consumo"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Aprobar"), extremoEstado(aprobado.id), "resultado"));
    return m;
  },
  oracionesEsperadas: [
    "**Pedido** es un objeto informacional y sistémico.",
    "**Pedido** puede estar `pendiente` o `aprobado`.",
    "*Aprobar* es un proceso informacional y sistémico.",
    "*Aprobar* cambia **Pedido** de `pendiente` a `aprobado`.",
  ],
  bisimetricaEstricta: true,
};

// BUG-f314c4: efecto TS3 COMPACTO — el par de estados vive como metadato del
// enlace efecto entidad→entidad (no escindido en consumo+resultado). El
// generador debe emitir la transición `cambia ... de ... a ...` y el parser
// (ETS2 + aplicador) la reancla al metadato: bisimetría estricta.
const fixtureTransicionTs3Compacta: FixtureRoundtrip = {
  nombre: "cambio-estado-ts3-compacto",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Paciente"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Egresar"));
    const pacienteId = entidadId(m, "Paciente");
    m = estadosNombrados(m, pacienteId, "ingresado", "egresado");
    const [ingresado, egresado] = estadosDeEntidad(m, pacienteId);
    if (!ingresado || !egresado) throw new Error("fixture invalida: estados TS3 compacto");
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Egresar"), pacienteId, "efecto"));
    const enlaceId = Object.keys(m.enlaces).find((id) => m.enlaces[id]?.tipo === "efecto");
    if (!enlaceId) throw new Error("fixture invalida: enlace TS3 compacto");
    m = {
      ...m,
      enlaces: {
        ...m.enlaces,
        [enlaceId]: { ...m.enlaces[enlaceId]!, estadoEntradaId: ingresado.id, estadoSalidaId: egresado.id },
      },
    };
    return m;
  },
  oracionesEsperadas: [
    "**Paciente** es un objeto informacional y sistémico.",
    "**Paciente** puede estar `ingresado` o `egresado`.",
    "*Egresar* es un proceso informacional y sistémico.",
    "*Egresar* cambia **Paciente** de `ingresado` a `egresado`.",
  ],
  // Estricta desde el cierre del ciclo estado-objeto: generador y parser
  // quedan amarrados ida-y-vuelta para la transición TS3 compacta.
  bisimetricaEstricta: true,
};

const fixtureTransicionTs4: FixtureRoundtrip = {
  nombre: "cambio-estado-ts4-solo-entrada",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Documento"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Archivar"));
    const documentoId = entidadId(m, "Documento");
    m = estadosNombrados(m, documentoId, "borrador", "archivado");
    const [borrador] = estadosDeEntidad(m, documentoId);
    if (!borrador) throw new Error("fixture invalida: estado TS4");
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Archivar"), extremoEstado(borrador.id), "efecto"));
    return m;
  },
  oracionesEsperadas: [
    "**Documento** es un objeto informacional y sistémico.",
    "**Documento** puede estar `borrador` o `archivado`.",
    "*Archivar* es un proceso informacional y sistémico.",
    "*Archivar* cambia **Documento** a `borrador`.",
  ],
  bisimetricaEstricta: true,
};

const fixtureTransicionTs5: FixtureRoundtrip = {
  nombre: "cambio-estado-ts5-solo-salida",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Ticket"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Resolver"));
    const ticketId = entidadId(m, "Ticket");
    m = estadosNombrados(m, ticketId, "abierto", "cerrado");
    const [abierto] = estadosDeEntidad(m, ticketId);
    if (!abierto) throw new Error("fixture invalida: estado TS5");
    m = must(crearEnlace(m, m.opdRaizId, extremoEstado(abierto.id), entidadId(m, "Resolver"), "efecto"));
    return m;
  },
  oracionesEsperadas: [
    "**Ticket** es un objeto informacional y sistémico.",
    "**Ticket** puede estar `abierto` o `cerrado`.",
    "*Resolver* es un proceso informacional y sistémico.",
    "*Resolver* cambia **Ticket** de `abierto`.",
  ],
  bisimetricaEstricta: true,
};

const fixtureHabilitadorConEstado: FixtureRoundtrip = {
  nombre: "habilitador-con-estado-hs",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Operador"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 120 }, "Equipo"));
    m = must(crearProceso(m, m.opdRaizId, { x: 220, y: 0 }, "Operar"));
    m = must(cambiarEsencia(m, entidadId(m, "Operador"), "fisica"));
    m = estadosNombrados(m, entidadId(m, "Operador"), "disponible", "ocupado");
    m = estadosNombrados(m, entidadId(m, "Equipo"), "calibrado", "fuera de servicio");
    const [disponible] = estadosDeEntidad(m, entidadId(m, "Operador"));
    const [calibrado] = estadosDeEntidad(m, entidadId(m, "Equipo"));
    if (!disponible || !calibrado) throw new Error("fixture invalida: estados HS");
    m = must(crearEnlace(m, m.opdRaizId, extremoEstado(disponible.id), entidadId(m, "Operar"), "agente"));
    m = must(crearEnlace(m, m.opdRaizId, extremoEstado(calibrado.id), entidadId(m, "Operar"), "instrumento"));
    return m;
  },
  oracionesEsperadas: [
    "**Operador** es un objeto físico y sistémico.",
    "**Operador** puede estar `disponible` o `ocupado`.",
    "**Equipo** es un objeto informacional y sistémico.",
    "**Equipo** puede estar `calibrado` o `fuera de servicio`.",
    "*Operar* es un proceso informacional y sistémico.",
    "**Operador** en `disponible` maneja *Operar*.",
    "*Operar* requiere **Equipo** en `calibrado`.",
  ],
  // Estricta desde el cierre de la gramática HS del reverse: el parser separa
  // el sufijo "en `estado`" del habilitador y el aplicador ancla el extremo
  // origen al estado del objeto.
  bisimetricaEstricta: true,
};

const fixtureExhibicion: FixtureRoundtrip = {
  nombre: "enlace-estructural-exhibicion",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Auto"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Color"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Auto"), entidadId(m, "Color"), "exhibicion"));
    return m;
  },
  oracionesEsperadas: [
    "**Auto** es un objeto informacional y sistémico.",
    "**Color** es un objeto informacional y sistémico.",
    "**Auto** exhibe **Color**.",
  ],
  bisimetricaEstricta: true,
};

const fixtureClasificacion: FixtureRoundtrip = {
  nombre: "enlace-estructural-clasificacion",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Vehiculo"));
    m = must(crearObjeto(m, m.opdRaizId, { x: 200, y: 0 }, "Patente 123"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Vehiculo"), entidadId(m, "Patente 123"), "clasificacion"));
    return m;
  },
  oracionesEsperadas: [
    "**Vehiculo** es un objeto informacional y sistémico.",
    "**Patente 123** es un objeto informacional y sistémico.",
    "**Patente 123** es una instancia de **Vehiculo**.",
  ],
  bisimetricaEstricta: true,
};

const fixtureEventoConsumo: FixtureRoundtrip = {
  nombre: "evento-consumo-canonico",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearObjeto(m, m.opdRaizId, { x: 0, y: 0 }, "Solicitud"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Procesar"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Solicitud"), entidadId(m, "Procesar"), "consumo"));
    m = must(aplicarModificador(m, enlaceIdUnico(m), "evento"));
    return m;
  },
  oracionesEsperadas: [
    "**Solicitud** es un objeto informacional y sistémico.",
    "*Procesar* es un proceso informacional y sistémico.",
    "**Solicitud** inicia *Procesar*, que consume **Solicitud**.",
  ],
  bisimetricaEstricta: true,
};

const fixtureInvocacionTilde: FixtureRoundtrip = {
  nombre: "invocacion-con-demora-tilde",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Preparar"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Servir"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Preparar"), entidadId(m, "Servir"), "invocacion"));
    m = must(definirDemora(m, enlaceIdUnico(m), "1s"));
    return m;
  },
  oracionesEsperadas: [
    "*Preparar* es un proceso informacional y sistémico.",
    "*Servir* es un proceso informacional y sistémico.",
    "*Preparar* invoca *Servir* después de 1s.",
  ],
  // Estricta desde el cierre del reverse de demora: el parser captura
  // "después de Ns" y el aplicador la aplica con definirDemora.
  bisimetricaEstricta: true,
};

const fixtureEventoInvocacionDegrada: FixtureRoundtrip = {
  nombre: "evento-invocacion-degrada-base",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Preparar"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Servir"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Preparar"), entidadId(m, "Servir"), "invocacion"));
    const enlaceId = enlaceIdUnico(m);
    m = {
      ...m,
      enlaces: {
        ...m.enlaces,
        [enlaceId]: { ...m.enlaces[enlaceId]!, modificador: "evento" },
      },
    };
    return m;
  },
  oracionesEsperadas: [
    "*Preparar* es un proceso informacional y sistémico.",
    "*Servir* es un proceso informacional y sistémico.",
    "*Preparar* invoca *Servir*.",
  ],
  bisimetricaEstricta: true,
};

const fixtureAutoInvocacionTilde: FixtureRoundtrip = {
  nombre: "autoinvocacion-con-demora-tilde",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Validar"));
    m = must(crearAutoInvocacion(m, m.opdRaizId, entidadId(m, "Validar"), "1s"));
    return m;
  },
  oracionesEsperadas: [
    "*Validar* es un proceso informacional y sistémico.",
    "*Validar* se invoca a sí mismo después de 1s.",
  ],
  // Estricta desde el cierre del reverse de autoinvocación: el aplicador
  // desvía el self-link Proceso→Proceso a crearAutoInvocacion (con demora).
  bisimetricaEstricta: true,
};

fixturesRoundtripExtra.push(
  fixtureEfectoSimple,
  fixtureTransicionTs3,
  fixtureTransicionTs3Compacta,
  fixtureTransicionTs4,
  fixtureTransicionTs5,
  fixtureHabilitadorConEstado,
  fixtureExhibicion,
  fixtureClasificacion,
  fixtureEventoConsumo,
  fixtureInvocacionTilde,
  fixtureEventoInvocacionDegrada,
  fixtureAutoInvocacionTilde,
);

/**
 * Vista combinada nucleo + extension para que los tests no tengan que
 * importar dos arrays. Se evalua en cada llamada — las extensiones
 * agregadas en otros archivos del repo aparecen automaticamente.
 */
export function fixturesRoundtrip(): readonly FixtureRoundtrip[] {
  return [...fixturesRoundtripNucleo, ...fixturesRoundtripExtra];
}
