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
  oracionesEsperadas: ["**Carro** es informacional.", "**Carro** es sistémico."],
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
  oracionesEsperadas: ["*Procesar* es informacional.", "*Procesar* es sistémico."],
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
  oracionesEsperadas: ["**Bomba** es físico.", "**Bomba** es ambiental."],
  bisimetricaEstricta: true,
};

/**
 * Fixture 4: objeto con dos estados (sincronizar-estados + designaciones default).
 *
 * NO es bisimetricamente estricta hoy: el aplicador `aplicar.ts` requiere que la
 * entidad exista en el modelo de entrada para sincronizar sus estados. Cuando
 * todo se construye desde texto libre sobre un modelo vacio, el patch
 * `crear-entidad` (linea 1) se aplica antes que `sincronizar-estados` (linea 2),
 * pero el PLANIFICADOR procesa AST linea a linea contra el modelo ANTERIOR a los
 * patches, por lo que en linea 2 el objeto aun no existe y se emite diagnostico
 * `unknown-symbol` en vez del patch. Documentado como limitacion real del
 * reverse-aplicador; cuando L5 (designaciones + plegado) cierre el ciclo
 * estado-objeto, esta fixture deberia subir a estricta.
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
    "**Pedido** es informacional.",
    "**Pedido** es sistémico.",
    "**Pedido** puede estar `pendiente` o `aprobado`.",
  ],
  bisimetricaEstricta: false,
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
    "**Entrada** es informacional.",
    "**Entrada** es sistémico.",
    "*Procesar* es informacional.",
    "*Procesar* es sistémico.",
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
    "*Procesar* es informacional.",
    "*Procesar* es sistémico.",
    "**Salida** es informacional.",
    "**Salida** es sistémico.",
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
    "**Herramienta** es informacional.",
    "**Herramienta** es sistémico.",
    "*Procesar* es informacional.",
    "*Procesar* es sistémico.",
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
    "**Operador** es físico.",
    "**Operador** es sistémico.",
    "*Procesar* es informacional.",
    "*Procesar* es sistémico.",
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
    "**Vehiculo** es informacional.",
    "**Vehiculo** es sistémico.",
    "**Motor** es informacional.",
    "**Motor** es sistémico.",
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
    "**Vehiculo** es informacional.",
    "**Vehiculo** es sistémico.",
    "**Camion** es informacional.",
    "**Camion** es sistémico.",
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
    "*Procesar* es informacional.",
    "*Procesar* es sistémico.",
    "**Objeto 2** es informacional.",
    "**Objeto 2** es sistémico.",
    "*Procesar* genera **Objeto 2**.",
  ],
  bisimetricaEstricta: false,
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
    "*Actualizar* es informacional.",
    "*Actualizar* es sistémico.",
    "**Sistema** es informacional.",
    "**Sistema** es sistémico.",
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
    "**Pedido** es informacional.",
    "**Pedido** es sistémico.",
    "**Pedido** puede estar `pendiente` o `aprobado`.",
    "*Aprobar* es informacional.",
    "*Aprobar* es sistémico.",
    "*Aprobar* cambia **Pedido** de `pendiente` a `aprobado`.",
  ],
  bisimetricaEstricta: false,
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
    "**Documento** es informacional.",
    "**Documento** es sistémico.",
    "**Documento** puede estar `borrador` o `archivado`.",
    "*Archivar* es informacional.",
    "*Archivar* es sistémico.",
    "*Archivar* cambia **Documento** a `borrador`.",
  ],
  bisimetricaEstricta: false,
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
    "**Ticket** es informacional.",
    "**Ticket** es sistémico.",
    "**Ticket** puede estar `abierto` o `cerrado`.",
    "*Resolver* es informacional.",
    "*Resolver* es sistémico.",
    "*Resolver* cambia **Ticket** de `abierto`.",
  ],
  bisimetricaEstricta: false,
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
    "**Operador** es físico.",
    "**Operador** es sistémico.",
    "**Operador** puede estar `disponible` o `ocupado`.",
    "**Equipo** es informacional.",
    "**Equipo** es sistémico.",
    "**Equipo** puede estar `calibrado` o `fuera de servicio`.",
    "*Operar* es informacional.",
    "*Operar* es sistémico.",
    "**Operador** en `disponible` maneja *Operar*.",
    "*Operar* requiere **Equipo** en `calibrado`.",
  ],
  bisimetricaEstricta: false,
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
    "**Auto** es informacional.",
    "**Auto** es sistémico.",
    "**Color** es informacional.",
    "**Color** es sistémico.",
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
    "**Vehiculo** es informacional.",
    "**Vehiculo** es sistémico.",
    "**Patente 123** es informacional.",
    "**Patente 123** es sistémico.",
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
    "**Solicitud** es informacional.",
    "**Solicitud** es sistémico.",
    "*Procesar* es informacional.",
    "*Procesar* es sistémico.",
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
    "*Preparar* es informacional.",
    "*Preparar* es sistémico.",
    "*Servir* es informacional.",
    "*Servir* es sistémico.",
    "*Preparar* invoca *Servir* después de 1s.",
  ],
  bisimetricaEstricta: false,
};

const fixtureEventoInvocacionDegrada: FixtureRoundtrip = {
  nombre: "evento-invocacion-degrada-base",
  construir: () => {
    let m = crearModelo("M");
    m = must(crearProceso(m, m.opdRaizId, { x: 0, y: 0 }, "Preparar"));
    m = must(crearProceso(m, m.opdRaizId, { x: 200, y: 0 }, "Servir"));
    m = must(crearEnlace(m, m.opdRaizId, entidadId(m, "Preparar"), entidadId(m, "Servir"), "invocacion"));
    m = must(aplicarModificador(m, enlaceIdUnico(m), "evento"));
    return m;
  },
  oracionesEsperadas: [
    "*Preparar* es informacional.",
    "*Preparar* es sistémico.",
    "*Servir* es informacional.",
    "*Servir* es sistémico.",
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
    "*Validar* es informacional.",
    "*Validar* es sistémico.",
    "*Validar* se invoca a sí mismo después de 1s.",
  ],
  bisimetricaEstricta: false,
};

fixturesRoundtripExtra.push(
  fixtureEfectoSimple,
  fixtureTransicionTs3,
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
