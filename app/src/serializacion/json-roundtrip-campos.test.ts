import { describe, expect, test } from "bun:test";
import type {
  Abanico,
  AnclaNormativa,
  Apariencia,
  AparienciaEnlace,
  Entidad,
  Estado,
  Enlace,
  Modelo,
  OntologiaOrganizacional,
  Opd,
  RatificacionAncla,
  ReferenciaNorma,
  ReferenciaPadreSubmodelo,
  RequisitoEntidadMetadata,
  SatisfaccionRequisito,
  SelloProcedencia,
  SubmodeloAnchor,
  SubmodeloContrato,
  SubmodeloMaterializacion,
  SubmodeloReferencia,
  SubmodeloSource,
  TerminoOntologia,
  VersionResumen,
} from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";

const CAMPOS_MODELO = {
  id: true,
  nombre: true,
  descripcion: true,
  opdRaizId: true,
  opds: true,
  entidades: true,
  estados: true,
  enlaces: true,
  abanicos: true,
  ontologia: true,
  satisfaccionesRequisito: true,
  anclasNormativas: true,
  procedencia: true,
  submodelos: true,
  referenciaPadreSubmodelo: true,
  archivado: true,
  archivadoEn: true,
  versiones: true,
  crearVersionAlGuardar: true,
  nextSeq: true,
} satisfies Record<keyof Modelo, true>;

const CAMPOS_ENTIDAD = {
  id: true,
  tipo: true,
  nombre: true,
  esencia: true,
  afiliacion: true,
  refinamientos: true,
  alias: true,
  unidad: true,
  esAtributo: true,
  valorSlot: true,
  simulacion: true,
  descripcion: true,
  estereotipo: true,
  requisito: true,
  urls: true,
  imagen: true,
  layoutEstados: true,
  lineal: true,
  orderedFundamentalTypes: true,
} satisfies Record<keyof Entidad, true>;

const CAMPOS_ESTADO = {
  id: true,
  entidadId: true,
  nombre: true,
  esInicial: true,
  esFinal: true,
  designaciones: true,
  duracion: true,
  suprimido: true,
  width: true,
  height: true,
  x: true,
  y: true,
  orden: true,
} satisfies Record<keyof Estado, true>;

const CAMPOS_APARIENCIA = {
  id: true,
  entidadId: true,
  opdId: true,
  x: true,
  y: true,
  width: true,
  height: true,
  modoTamano: true,
  modoPlegado: true,
  ordenPartes: true,
  parteExtraidaDe: true,
  contextoRefinamiento: true,
  ports: true,
  estadosSuprimidos: true,
} satisfies Record<keyof Apariencia, true>;

const CAMPOS_ENLACE = {
  id: true,
  tipo: true,
  origenId: true,
  destinoId: true,
  etiqueta: true,
  multiplicidadOrigen: true,
  multiplicidadDestino: true,
  modificador: true,
  subtipoModificador: true,
  probabilidad: true,
  demora: true,
  rutaEtiqueta: true,
  backwardTag: true,
  requisitos: true,
  mostrarRequisitos: true,
  tasa: true,
  unidadesTasa: true,
  tiempoMaximo: true,
  unidadTiempoMaximo: true,
  tiempoMinimo: true,
  unidadTiempoMinimo: true,
  grupoEstructuralId: true,
  estadoEntradaId: true,
  estadoSalidaId: true,
  efectoEscindido: true,
  derivado: true,
} satisfies Record<keyof Enlace, true>;

const CAMPOS_APARIENCIA_ENLACE = {
  id: true,
  enlaceId: true,
  opdId: true,
  vertices: true,
  symbolPos: true,
  symbolAnchors: true,
  labelPositions: true,
} satisfies Record<keyof AparienciaEnlace, true>;

const CAMPOS_OPD = {
  id: true,
  nombre: true,
  padreId: true,
  apariencias: true,
  enlaces: true,
  vista: true,
  ordenLocal: true,
} satisfies Record<keyof Opd, true>;

const CAMPOS_ABANICO = {
  id: true,
  opdId: true,
  puertoComun: true,
  puertoEntidadId: true,
  operador: true,
  enlaceIds: true,
  decision: true,
} satisfies Record<keyof Abanico, true>;

const CAMPOS_VERSION = {
  id: true,
  creadoEn: true,
  nombre: true,
  descripcion: true,
  preservar: true,
  modeloPayloadKey: true,
  bytes: true,
} satisfies Record<keyof VersionResumen, true>;

const CAMPOS_TERMINO_ONTOLOGIA = {
  canonico: true,
  sinonimos: true,
  descripcion: true,
} satisfies Record<keyof TerminoOntologia, true>;

const CAMPOS_ONTOLOGIA = {
  modo: true,
  terminos: true,
} satisfies Record<keyof OntologiaOrganizacional, true>;

const CAMPOS_REQUISITO = {
  idLogico: true,
  descripcion: true,
  dureza: true,
  actor: true,
  satisfaction: true,
} satisfies Record<keyof RequisitoEntidadMetadata, true>;

const CAMPOS_SATISFACCION = {
  id: true,
  requisitoEntidadId: true,
  target: true,
  estado: true,
  descripcion: true,
} satisfies Record<keyof SatisfaccionRequisito, true>;

const CAMPOS_REFERENCIA_NORMA = {
  norma: true,
  articulos: true,
  seccion: true,
} satisfies Record<keyof ReferenciaNorma, true>;

const CAMPOS_RATIFICACION = {
  nivelAutoridad: true,
  estadoRatificacion: true,
  fuente: true,
  responsable: true,
  anotadoEn: true,
  ratificadoEn: true,
} satisfies Record<keyof RatificacionAncla, true>;

const CAMPOS_ANCLA = {
  id: true,
  claveProto: true,
  target: true,
  estado: true,
  referencias: true,
  nota: true,
  ratificacion: true,
} satisfies Record<keyof AnclaNormativa, true>;

const CAMPOS_PROCEDENCIA = {
  protoHash: true,
  autoriaVersion: true,
  layoutVersion: true,
} satisfies Record<keyof SelloProcedencia, true>;

const CAMPOS_SUBMODELO_SOURCE = {
  modeloId: true,
  nombre: true,
  revisionHash: true,
} satisfies Record<keyof SubmodeloSource, true>;

const CAMPOS_SUBMODELO_ANCHOR = {
  entidadId: true,
  opdId: true,
} satisfies Record<keyof SubmodeloAnchor, true>;

const CAMPOS_SUBMODELO_CONTRATO = {
  compartidas: true,
  frozenAtHash: true,
} satisfies Record<keyof SubmodeloContrato, true>;

const CAMPOS_SUBMODELO_MATERIALIZACION = {
  opdVistaId: true,
  scope: true,
  entidadMap: true,
  estadoMap: true,
  enlaceMap: true,
  abanicoMap: true,
  sourceHash: true,
  materializedAt: true,
} satisfies Record<keyof SubmodeloMaterializacion, true>;

const CAMPOS_SUBMODELO = {
  id: true,
  modeloId: true,
  nombre: true,
  anchorEntidadId: true,
  opdVistaId: true,
  estado: true,
  compartidas: true,
  source: true,
  anchor: true,
  contrato: true,
  materializacion: true,
} satisfies Record<keyof SubmodeloReferencia, true>;

const CAMPOS_REFERENCIA_PADRE = {
  modeloId: true,
  refId: true,
  anchorEntidadId: true,
  estado: true,
} satisfies Record<keyof ReferenciaPadreSubmodelo, true>;

void [
  CAMPOS_MODELO,
  CAMPOS_ENTIDAD,
  CAMPOS_ESTADO,
  CAMPOS_APARIENCIA,
  CAMPOS_ENLACE,
  CAMPOS_APARIENCIA_ENLACE,
  CAMPOS_OPD,
  CAMPOS_ABANICO,
  CAMPOS_VERSION,
  CAMPOS_TERMINO_ONTOLOGIA,
  CAMPOS_ONTOLOGIA,
  CAMPOS_REQUISITO,
  CAMPOS_SATISFACCION,
  CAMPOS_REFERENCIA_NORMA,
  CAMPOS_RATIFICACION,
  CAMPOS_ANCLA,
  CAMPOS_PROCEDENCIA,
  CAMPOS_SUBMODELO_SOURCE,
  CAMPOS_SUBMODELO_ANCHOR,
  CAMPOS_SUBMODELO_CONTRATO,
  CAMPOS_SUBMODELO_MATERIALIZACION,
  CAMPOS_SUBMODELO,
  CAMPOS_REFERENCIA_PADRE,
];

describe("serializacion JSON - round-trip de campos persistibles", () => {
  test("preserva campos opcionales declarados en los tipos del modelo", () => {
    const modelo = modeloConCamposOpcionales();
    const json = exportarModelo(modelo);
    const hidratado = hidratarModelo(json);

    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) throw new Error(hidratado.error);

    const canonico = JSON.parse(json).modelo;
    expect(hidratado.value).toEqual(canonico);
    expect(JSON.parse(exportarModelo(hidratado.value)).modelo).toEqual(canonico);
    expect(hidratado.value.entidades["o-pedido"]?.requisito?.actor).toBe("Mesa clinica");
    expect(hidratado.value.enlaces["e-effect"]?.efectoEscindido).toEqual({
      grupoId: "fx-1",
      enlacePadreId: "e-resultado",
      rol: "salida",
      modo: "par",
    });
    expect(hidratado.value.opds["opd-unfold"]?.enlaces["ae-agreg"]?.symbolAnchors).toEqual({
      refinable: { dx: -12, dy: 0 },
      refinador: { dx: 14, dy: 1 },
    });
    expect(hidratado.value.opds["opd-sd0"]?.enlaces["ae-consumo"]?.labelPositions?.etiqueta).toEqual({
      distance: 0.42,
      offset: { x: 4, y: -6 },
      angle: 0,
    });
    expect(hidratado.value.submodelos?.["sub-1"]?.materializacion?.materializedAt).toBe("2026-06-06T00:00:00.000Z");
    expect(hidratado.value.versiones?.[0]?.preservar).toBe(true);
  });
});

function modeloConCamposOpcionales(): Modelo {
  return {
    id: "modelo-roundtrip-campos",
    nombre: "Roundtrip Campos",
    descripcion: "Modelo sintetico para preservar campos opcionales.",
    opdRaizId: "opd-sd0",
    nextSeq: 1000,
    entidades: {
      "o-pedido": {
        id: "o-pedido",
        tipo: "objeto",
        nombre: "Pedido",
        esencia: "fisica",
        afiliacion: "sistemica",
        refinamientos: {
          descomposicion: { opdId: "opd-dec" },
          despliegue: { opdId: "opd-unfold", modo: "agregacion" },
        },
        alias: "PED",
        unidad: "casos",
        esAtributo: true,
        valorSlot: { tipo: "float", placeholder: "value", valor: 12.5 },
        simulacion: {
          simulable: true,
          configuracion: {
            modo: "numerica",
            distribucion: "uniform",
            entero: false,
            rangoMin: 0,
            rangoMax: 100,
            uniformMin: 5,
            uniformMax: 15,
          },
        },
        descripcion: "Pedido trazable.",
        estereotipo: "requirement",
        requisito: {
          idLogico: "REQ-1",
          descripcion: "El pedido debe quedar trazado.",
          dureza: "hard",
          actor: "Mesa clinica",
          satisfaction: "parcial",
        },
        urls: [{ id: "url-1", url: "https://example.com/pedido", tipo: "articulo" }],
        imagen: { url: "https://example.com/pedido.png", modo: "imagen-texto" },
        layoutEstados: "vertical",
        lineal: true,
        orderedFundamentalTypes: ["agregacion", "exhibicion"],
      },
      "o-insumo-a": { id: "o-insumo-a", tipo: "objeto", nombre: "Insumo A", esencia: "fisica", afiliacion: "ambiental" },
      "o-insumo-b": { id: "o-insumo-b", tipo: "objeto", nombre: "Insumo B", esencia: "fisica", afiliacion: "ambiental" },
      "o-resultado": { id: "o-resultado", tipo: "objeto", nombre: "Resultado", esencia: "informacional", afiliacion: "sistemica" },
      "p-aprobar": { id: "p-aprobar", tipo: "proceso", nombre: "Aprobar", esencia: "fisica", afiliacion: "sistemica" },
      "p-revisar": { id: "p-revisar", tipo: "proceso", nombre: "Revisar", esencia: "fisica", afiliacion: "sistemica" },
      "p-escalar": { id: "p-escalar", tipo: "proceso", nombre: "Escalar", esencia: "fisica", afiliacion: "sistemica" },
      "p-manejar": { id: "p-manejar", tipo: "proceso", nombre: "Manejar excepcion", esencia: "fisica", afiliacion: "sistemica" },
    },
    estados: {
      "s-pend": {
        id: "s-pend",
        entidadId: "o-pedido",
        nombre: "pendiente",
        esInicial: true,
        designaciones: ["inicial", "default"],
        duracion: { unidad: "h", min: 1, nominal: 2, max: 4 },
        width: 86,
        height: 28,
        x: 12,
        y: 18,
        orden: 0,
      },
      "s-aprob": {
        id: "s-aprob",
        entidadId: "o-pedido",
        nombre: "aprobado",
        esFinal: true,
        designaciones: ["final", "current"],
        suprimido: true,
        width: 92,
        height: 30,
        x: 118,
        y: 18,
        orden: 1,
      },
    },
    enlaces: {
      "e-consumo": {
        id: "e-consumo",
        tipo: "consumo",
        origenId: { kind: "estado", id: "s-pend" },
        destinoId: { kind: "entidad", id: "p-aprobar", portId: "port-consumo" },
        etiqueta: "habilita",
        multiplicidadOrigen: "1",
        multiplicidadDestino: "1..N",
        modificador: "evento",
        subtipoModificador: "E",
        probabilidad: 0.75,
        rutaEtiqueta: "ruta principal",
        requisitos: "REQ-1",
        mostrarRequisitos: true,
      },
      "e-resultado": {
        id: "e-resultado",
        tipo: "resultado",
        origenId: { kind: "entidad", id: "p-aprobar" },
        destinoId: { kind: "entidad", id: "o-resultado" },
        etiqueta: "",
      },
      "e-effect": {
        id: "e-effect",
        tipo: "efecto",
        origenId: { kind: "entidad", id: "p-aprobar" },
        destinoId: { kind: "entidad", id: "o-pedido" },
        etiqueta: "actualiza",
        tasa: "2",
        unidadesTasa: "casos/h",
        estadoEntradaId: "s-pend",
        estadoSalidaId: "s-aprob",
        efectoEscindido: { grupoId: "fx-1", enlacePadreId: "e-resultado", rol: "salida", modo: "par" },
        derivado: {
          tipo: "enlace-externo-refinamiento",
          refinamientoId: "o-pedido",
          enlacePadreId: "e-resultado",
          origen: "manual",
        },
      },
      "e-invoc": {
        id: "e-invoc",
        tipo: "invocacion",
        origenId: { kind: "entidad", id: "p-aprobar" },
        destinoId: { kind: "entidad", id: "p-escalar" },
        etiqueta: "",
        demora: "5 min",
      },
      "e-time": {
        id: "e-time",
        tipo: "excepcionSubSobretiempo",
        origenId: { kind: "entidad", id: "p-aprobar" },
        destinoId: { kind: "entidad", id: "p-manejar" },
        etiqueta: "",
        tiempoMinimo: "1",
        unidadTiempoMinimo: "min",
        tiempoMaximo: "10",
        unidadTiempoMaximo: "min",
      },
      "e-bidir": {
        id: "e-bidir",
        tipo: "etiquetadoBidireccional",
        origenId: { kind: "entidad", id: "o-pedido" },
        destinoId: { kind: "entidad", id: "o-resultado" },
        etiqueta: "porta",
        backwardTag: "es portado por",
      },
      "e-agreg": {
        id: "e-agreg",
        tipo: "agregacion",
        origenId: { kind: "entidad", id: "o-pedido" },
        destinoId: { kind: "entidad", id: "o-insumo-a" },
        etiqueta: "",
        grupoEstructuralId: "grupo-1",
      },
      "e-fan1": {
        id: "e-fan1",
        tipo: "consumo",
        origenId: { kind: "entidad", id: "o-insumo-a" },
        destinoId: { kind: "entidad", id: "p-aprobar", portId: "port-fan-in" },
        etiqueta: "",
      },
      "e-fan2": {
        id: "e-fan2",
        tipo: "consumo",
        origenId: { kind: "entidad", id: "o-insumo-b" },
        destinoId: { kind: "entidad", id: "p-aprobar", portId: "port-fan-in" },
        etiqueta: "",
      },
    },
    opds: {
      "opd-sd0": {
        id: "opd-sd0",
        nombre: "SD0",
        padreId: null,
        ordenLocal: 0,
        apariencias: {
          "a-pedido": {
            id: "a-pedido",
            entidadId: "o-pedido",
            opdId: "opd-sd0",
            x: 40,
            y: 70,
            width: 220,
            height: 120,
            modoTamano: "manual",
            modoPlegado: "parcial",
            ordenPartes: "creacion",
            ports: { "port-pedido": { x: 0.5, y: 0.5 } },
            estadosSuprimidos: ["s-aprob"],
          },
          "a-insumo-a": {
            id: "a-insumo-a",
            entidadId: "o-insumo-a",
            opdId: "opd-sd0",
            x: 310,
            y: 80,
            width: 120,
            height: 64,
            modoPlegado: "completo",
            parteExtraidaDe: { padreAparienciaId: "a-pedido", parteEntidadId: "o-insumo-a" },
          },
          "a-insumo-b": { id: "a-insumo-b", entidadId: "o-insumo-b", opdId: "opd-sd0", x: 310, y: 190, width: 120, height: 64, modoPlegado: "completo" },
          "a-resultado": { id: "a-resultado", entidadId: "o-resultado", opdId: "opd-sd0", x: 760, y: 130, width: 140, height: 70, modoPlegado: "completo" },
          "a-aprobar": {
            id: "a-aprobar",
            entidadId: "p-aprobar",
            opdId: "opd-sd0",
            x: 520,
            y: 125,
            width: 130,
            height: 78,
            modoPlegado: "completo",
            ports: {
              "port-consumo": { x: 0, y: 0.5 },
              "port-fan-in": { x: 0.5, y: 1 },
            },
          },
          "a-escalar": { id: "a-escalar", entidadId: "p-escalar", opdId: "opd-sd0", x: 520, y: 20, width: 130, height: 72, modoPlegado: "completo" },
          "a-manejar": { id: "a-manejar", entidadId: "p-manejar", opdId: "opd-sd0", x: 520, y: 250, width: 150, height: 72, modoPlegado: "completo" },
        },
        enlaces: {
          "ae-consumo": {
            id: "ae-consumo",
            enlaceId: "e-consumo",
            opdId: "opd-sd0",
            vertices: [{ x: 350, y: 130 }],
            labelPositions: { etiqueta: { distance: 0.42, offset: { x: 4, y: -6 }, angle: 0 } },
          },
          "ae-resultado": { id: "ae-resultado", enlaceId: "e-resultado", opdId: "opd-sd0", vertices: [] },
          "ae-effect": { id: "ae-effect", enlaceId: "e-effect", opdId: "opd-sd0", vertices: [{ x: 700, y: 80 }] },
          "ae-invoc": { id: "ae-invoc", enlaceId: "e-invoc", opdId: "opd-sd0", vertices: [] },
          "ae-time": { id: "ae-time", enlaceId: "e-time", opdId: "opd-sd0", vertices: [] },
          "ae-bidir": { id: "ae-bidir", enlaceId: "e-bidir", opdId: "opd-sd0", vertices: [] },
          "ae-fan1": { id: "ae-fan1", enlaceId: "e-fan1", opdId: "opd-sd0", vertices: [] },
          "ae-fan2": { id: "ae-fan2", enlaceId: "e-fan2", opdId: "opd-sd0", vertices: [] },
        },
      },
      "opd-dec": {
        id: "opd-dec",
        nombre: "SD0.1",
        padreId: "opd-sd0",
        ordenLocal: 1,
        apariencias: {
          "a-pedido-dec": {
            id: "a-pedido-dec",
            entidadId: "o-pedido",
            opdId: "opd-dec",
            x: 20,
            y: 20,
            width: 520,
            height: 320,
            modoPlegado: "completo",
            contextoRefinamiento: { tipo: "descomposicion", refinableEntidadId: "o-pedido", rol: "contorno", enlacesPadreIds: ["e-consumo"] },
          },
          "a-revisar-dec": {
            id: "a-revisar-dec",
            entidadId: "p-revisar",
            opdId: "opd-dec",
            x: 110,
            y: 120,
            width: 130,
            height: 72,
            modoPlegado: "completo",
            contextoRefinamiento: {
              tipo: "descomposicion",
              refinableEntidadId: "o-pedido",
              rol: "interno",
              contenedorAparienciaId: "a-pedido-dec",
            },
          },
        },
        enlaces: {},
      },
      "opd-unfold": {
        id: "opd-unfold",
        nombre: "SD0.U",
        padreId: "opd-sd0",
        ordenLocal: 2,
        apariencias: {
          "a-pedido-unfold": { id: "a-pedido-unfold", entidadId: "o-pedido", opdId: "opd-unfold", x: 80, y: 80, width: 180, height: 90, modoPlegado: "completo" },
          "a-insumo-a-unfold": { id: "a-insumo-a-unfold", entidadId: "o-insumo-a", opdId: "opd-unfold", x: 380, y: 80, width: 120, height: 64, modoPlegado: "completo" },
        },
        enlaces: {
          "ae-agreg": {
            id: "ae-agreg",
            enlaceId: "e-agreg",
            opdId: "opd-unfold",
            vertices: [{ x: 300, y: 112 }],
            symbolPos: { x: 300, y: 112 },
            symbolAnchors: { refinable: { dx: -12, dy: 0 }, refinador: { dx: 14, dy: 1 } },
            labelPositions: { etiqueta: { distance: 0.5 } },
          },
        },
      },
      "opd-req": {
        id: "opd-req",
        nombre: "REQ",
        padreId: "opd-sd0",
        ordenLocal: 3,
        vista: { kind: "requirement-view", requisitoEntidadId: "o-pedido", readOnly: true },
        apariencias: {
          "a-pedido-req": { id: "a-pedido-req", entidadId: "o-pedido", opdId: "opd-req", x: 40, y: 40, width: 200, height: 90, modoPlegado: "completo" },
        },
        enlaces: {},
      },
      "opd-sub": {
        id: "opd-sub",
        nombre: "SUB",
        padreId: "opd-sd0",
        ordenLocal: 4,
        vista: { kind: "submodel-view", submodeloRefId: "sub-1", readOnly: true, syncState: "cargado-sincronizado" },
        apariencias: {},
        enlaces: {},
      },
    },
    abanicos: {
      "ab-1": {
        id: "ab-1",
        opdId: "opd-sd0",
        puertoComun: { entidadId: "p-aprobar", lado: "destino", portId: "port-fan-in" },
        puertoEntidadId: "p-aprobar",
        operador: "XOR",
        enlaceIds: ["e-fan1", "e-fan2"],
        decision: { modo: "probabilidades", pesos: { "e-fan1": 0.3, "e-fan2": 0.7 } },
      },
    },
    ontologia: {
      modo: "suggest",
      terminos: [{ canonico: "Pedido", sinonimos: ["Solicitud"], descripcion: "Unidad de trabajo." }],
    },
    satisfaccionesRequisito: {
      "sat-1": {
        id: "sat-1",
        requisitoEntidadId: "o-pedido",
        target: { tipo: "enlace", id: "e-effect" },
        estado: "parcial",
        descripcion: "Cubierto por actualizacion.",
      },
    },
    anclasNormativas: {
      "anc-1": {
        id: "anc-1",
        claveProto: "ancla:pedido",
        target: { tipo: "modelo" },
        estado: "pendiente-ratificacion",
        referencias: [{ norma: "Norma interna", articulos: ["1", "2"], seccion: "trazabilidad" }],
        nota: "Validar fuente definitiva.",
        ratificacion: {
          nivelAutoridad: "mesa",
          estadoRatificacion: "ratificado-con-fuente",
          fuente: "Acta 2026-06-06",
          responsable: "Equipo OPM",
          anotadoEn: "2026-06-06",
          ratificadoEn: "2026-06-06",
        },
      },
    },
    procedencia: {
      protoHash: "sha256-proto",
      autoriaVersion: "test",
      layoutVersion: "test",
    },
    submodelos: {
      "sub-1": {
        id: "sub-1",
        modeloId: "modelo-sub",
        nombre: "Submodelo",
        anchorEntidadId: "o-pedido",
        opdVistaId: "opd-sub",
        estado: "cargado-sincronizado",
        compartidas: { "o-pedido": "remote-o-pedido" },
        source: { modeloId: "modelo-sub", nombre: "Submodelo remoto", revisionHash: "rev-1" },
        anchor: { entidadId: "o-pedido", opdId: "opd-sd0" },
        contrato: { compartidas: { "o-pedido": "remote-o-pedido" }, frozenAtHash: "freeze-1" },
        materializacion: {
          opdVistaId: "opd-sub",
          scope: "sd-root",
          entidadMap: { "o-pedido": "remote-o-pedido" },
          estadoMap: { "s-pend": "remote-s-pend" },
          enlaceMap: { "e-effect": "remote-e-effect" },
          abanicoMap: { "ab-1": "remote-ab-1" },
          sourceHash: "source-1",
          materializedAt: "2026-06-06T00:00:00.000Z",
        },
      },
    },
    referenciaPadreSubmodelo: {
      modeloId: "modelo-padre",
      refId: "sub-padre",
      anchorEntidadId: "o-pedido",
      estado: "desconectado",
    },
    archivado: true,
    archivadoEn: "2026-06-06T01:00:00.000Z",
    versiones: [{
      id: "ver-1",
      creadoEn: "2026-06-06T00:30:00.000Z",
      nombre: "Version preservada",
      descripcion: "Incluye bandera preservar.",
      preservar: true,
      modeloPayloadKey: "payload-1",
      bytes: 1234,
    }],
    crearVersionAlGuardar: true,
  };
}
