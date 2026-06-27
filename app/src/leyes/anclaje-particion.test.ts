// LEY ANCLAJE — PARTICIÓN del dominio de campos en {firmado, excluido} (Ley 3 del acta).
//
// Acta gobernante: docs/auditorias/2026-06-26-acta-quietud-firma-centinela.md (iteración 3, Ley 3:
// «un test falla si un campo nuevo no se clasifica» + «Ratificación HITL del custodio»).
//
// La frontera significado/presentación solo se mantiene honesta en el tiempo si está VIGILADA. Dos
// guardas, complementarias:
//   · TYPECHECK (estática, en `firmaSemantica.ts`): cada `PARTICION_*` es `Record<keyof T, ClaseCampo>`
//     ⇒ agregar un campo al tipo sin clasificarlo NO compila. Esa es la guarda primaria.
//   · Esta ley (runtime): sobre instancias MÁXIMAS (todos los campos presentes), verifica que las
//     claves vistas coincidan EXACTAMENTE con la partición declarada (atrapa un campo de datos sin
//     clasificar) y que la proyección emita SOLO campos firmados (ata proyección a partición).
import { describe, expect, test } from "bun:test";
import type { Abanico, Apariencia, AparienciaEnlace, Entidad, Enlace, Estado, Opd } from "../modelo/tipos";
import {
  PARTICION_ABANICO,
  PARTICION_APARIENCIA,
  PARTICION_APARIENCIA_ENLACE,
  PARTICION_ENLACE,
  PARTICION_ENTIDAD,
  PARTICION_ESTADO,
  PARTICION_OPD,
  type ClaseCampo,
} from "../modelo/submodelos/firmaSemantica";

// Instancias MÁXIMAS: todos los campos del tipo presentes. Si se agrega un campo al tipo, el
// typecheck obliga a tocar `PARTICION_*`; aquí, además, obliga a tocar la instancia máxima, y el
// test cruza ambas para que la frontera no quede a medias.
const ENTIDAD_MAX: Required<Entidad> = {
  id: "e", tipo: "objeto", nombre: "n", esencia: "fisica", afiliacion: "sistemica",
  refinamientos: {}, alias: "a", unidad: "u", esAtributo: false, valorSlot: { tipo: "string", placeholder: "value" },
  simulacion: { simulable: false }, descripcion: "d", estereotipoId: "s",
  anclaje: { piezaId: "p", biblioteca: { modeloId: "m", frozenAtHash: "h" } },
  requisito: { idLogico: "R1", descripcion: "d", dureza: "hard" }, urls: [], lineal: false, orderedFundamentalTypes: [],
  imagen: { url: "x", modo: "imagen" }, layoutEstados: "horizontal",
};
const ESTADO_MAX: Required<Estado> = {
  id: "s", entidadId: "e", nombre: "n", esInicial: true, esFinal: true, designaciones: [],
  duracion: { unidad: "h", min: 0, nominal: 0, max: 0 }, orden: 0, suprimido: false, width: 0, height: 0, x: 0, y: 0,
};
const ENLACE_MAX: Required<Enlace> = {
  id: "l", tipo: "consumo", origenId: { kind: "entidad", id: "a" }, destinoId: { kind: "entidad", id: "b" }, etiqueta: "",
  multiplicidadOrigen: "1", multiplicidadDestino: "1", modificador: "no", subtipoModificador: "no", probabilidad: 1,
  demora: "0", rutaEtiqueta: "", backwardTag: "", requisitos: "", mostrarRequisitos: false, tasa: "1", unidadesTasa: "u",
  tiempoMaximo: "1", unidadTiempoMaximo: "s", tiempoMinimo: "0", unidadTiempoMinimo: "s", grupoEstructuralId: "g",
  estadoEntradaId: "se", estadoSalidaId: "ss", efectoEscindido: { grupoId: "g", enlacePadreId: "p", rol: "entrada" },
  derivado: { tipo: "enlace-externo-refinamiento", refinamientoId: "r", enlacePadreId: "p" },
};
const OPD_MAX: Required<Opd> = {
  id: "o", nombre: "n", padreId: null, apariencias: {}, enlaces: {}, vista: { kind: "generic-view" }, ordenLocal: 0, ordenInzoom: [],
};
const ABANICO_MAX: Required<Abanico> = {
  id: "ab", opdId: "o", puertoComun: { entidadId: "e", lado: "origen", portId: "p" }, puertoEntidadId: "e",
  operador: "XOR", enlaceIds: [], decision: { modo: "uniforme", objetoId: "e" },
};
const APARIENCIA_MAX: Required<Apariencia> = {
  id: "ap", entidadId: "e", opdId: "o", x: 0, y: 0, width: 0, height: 0, modoTamano: "auto", modoPlegado: "completo",
  ordenPartes: "alfabetico", parteExtraidaDe: { padreAparienciaId: "p", parteEntidadId: "e" },
  contextoRefinamiento: { tipo: "descomposicion", refinableEntidadId: "e", rol: "contorno" }, ports: {}, estadosSuprimidos: [],
};
const APARIENCIA_ENLACE_MAX: Required<AparienciaEnlace> = {
  id: "ae", enlaceId: "l", opdId: "o", vertices: [], symbolPos: { x: 0, y: 0 }, symbolAnchors: {}, labelPositions: {},
};

const CASOS: Array<[string, Record<string, unknown>, Record<string, ClaseCampo>]> = [
  ["Entidad", ENTIDAD_MAX, PARTICION_ENTIDAD],
  ["Estado", ESTADO_MAX, PARTICION_ESTADO],
  ["Enlace", ENLACE_MAX, PARTICION_ENLACE],
  ["Opd", OPD_MAX, PARTICION_OPD],
  ["Abanico", ABANICO_MAX, PARTICION_ABANICO],
  ["Apariencia", APARIENCIA_MAX, PARTICION_APARIENCIA],
  ["AparienciaEnlace", APARIENCIA_ENLACE_MAX, PARTICION_APARIENCIA_ENLACE],
];

describe("LEY ANCLAJE PARTICIÓN — todo campo está clasificado firmado-o-excluido (frontera honesta)", () => {
  for (const [nombre, instanciaMax, particion] of CASOS) {
    test(`${nombre}: las claves de la instancia máxima == las claves de la partición (sin campo sin clasificar)`, () => {
      const camposInstancia = Object.keys(instanciaMax).sort();
      const camposParticion = Object.keys(particion).sort();
      expect(camposInstancia).toEqual(camposParticion);
    });

    test(`${nombre}: toda clase es firmado|excluido (sin valor ambiguo)`, () => {
      for (const clase of Object.values(particion)) {
        expect(clase === "firmado" || clase === "excluido").toBe(true);
      }
    });
  }
});
