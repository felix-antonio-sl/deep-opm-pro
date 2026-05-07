import { describe, expect, test } from "bun:test";
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
  quitarDescomposicionProceso,
  quitarDespliegueObjeto,
} from "../modelo/operaciones";
import type {
  Apariencia,
  Entidad,
  ExtremoEnlace,
  Id,
  Modelo,
  Resultado,
  TipoEntidad,
  TipoRefinamiento,
} from "../modelo/tipos";
import { proyectarModeloAJointCells, type JointCellJson } from "../render/jointjs/proyeccion";
import { exportarModelo, hidratarModelo } from "../serializacion/json";

type CasoThingRefinamiento = {
  thing: TipoEntidad;
  refinamiento: TipoRefinamiento;
};

const CASOS_THING_REFINAMIENTO: CasoThingRefinamiento[] = [
  { thing: "proceso", refinamiento: "descomposicion" },
  { thing: "proceso", refinamiento: "despliegue" },
  { thing: "objeto", refinamiento: "descomposicion" },
  { thing: "objeto", refinamiento: "despliegue" },
];

describe("leyes de proyeccion JSON/render/refinement", () => {
  test("law-json-roundtrip preserva identidad, refinamiento y referencias", () => {
    for (const caso of CASOS_THING_REFINAMIENTO) {
      const modelo = modeloRefinamientoThing(caso.thing, caso.refinamiento);
      const entidadId = entidadRefinadaId(modelo, caso);
      const refinamiento = refinamientoDe(modelo, entidadId);
      const aparienciasContorno = snapshotAparienciasContorno(modelo, entidadId);

      const hidratado = roundTrip(modelo);

      expect(ids(hidratado.entidades)).toEqual(ids(modelo.entidades));
      expect(ids(hidratado.estados)).toEqual(ids(modelo.estados));
      expect(ids(hidratado.enlaces)).toEqual(ids(modelo.enlaces));
      expect(ids(hidratado.opds)).toEqual(ids(modelo.opds));
      expect(hidratado.entidades[entidadId]?.refinamiento).toEqual(refinamiento);
      expect(hidratado.opds[refinamiento.opdId]?.padreId).toBe(modelo.opdRaizId);
      expect(snapshotAparienciasContorno(hidratado, entidadId)).toEqual(aparienciasContorno);
      assertSinReferenciasHuerfanas(hidratado);
    }
  });

  test("law-render-stable-metadata preserva metadatos OPM y contorno refinado", () => {
    const modelo = roundTrip(modeloRefinamientoThing("objeto", "descomposicion"));
    const entidadId = entidadRefinadaId(modelo, { thing: "objeto", refinamiento: "descomposicion" });
    const refinamiento = refinamientoDe(modelo, entidadId);
    const aparienciaPadre = aparienciaDeEntidad(modelo, modelo.opdRaizId, entidadId);
    const aparienciaContorno = aparienciaDeEntidad(modelo, refinamiento.opdId, entidadId);

    const cellsPadre = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const cellsHijo = proyectarModeloAJointCells(modelo, refinamiento.opdId, null, null);
    const cellPadre = celdaEntidad(cellsPadre, entidadId);
    const cellContorno = celdaEntidad(cellsHijo, entidadId);
    const enlacePadre = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    const cellEnlace = enlacePadre
      ? cellsPadre.find((cell) => cell.opm.kind === "enlace" && cell.opm.aparienciaEnlaceId === enlacePadre.id)
      : undefined;

    assertMetadataEntidad(cellPadre, {
      opdId: modelo.opdRaizId,
      entidadId,
      aparienciaId: aparienciaPadre.id,
      rol: "externo",
    });
    assertMetadataEntidad(cellContorno, {
      opdId: refinamiento.opdId,
      entidadId,
      aparienciaId: aparienciaContorno.id,
      rol: "contorno",
    });
    expect(idsUnicos((cellContorno?.opm.kind === "entidad" ? cellContorno.opm.estadosInteractivos ?? [] : [])
      .map((target) => target.estadoId))).toEqual(estadosDeEntidad(modelo, entidadId).map((estado) => estado.id));
    expect(bodyAttrs(cellContorno).strokeWidth).toBe(4);
    expect(bodyAttrs(cellContorno).strokeDasharray).toBe("8 4");
    expect(bodyAttrs(cellContorno).filter).toBe("drop-shadow(1px 2px 2px rgb(0 0 0 / 0.25))");
    expect(cellContorno?.z).toBe(0);
    if (!enlacePadre) throw new Error("La ley esperaba enlace padre visible");
    expect(cellEnlace?.opm).toEqual({
      kind: "enlace",
      opdId: modelo.opdRaizId,
      enlaceId: enlacePadre.enlaceId,
      aparienciaEnlaceId: enlacePadre.id,
      tipo: "consumo",
    });
  });

  test("law-refinement-thing-matrix acepta Thing x descomposicion/despliegue", () => {
    for (const caso of CASOS_THING_REFINAMIENTO) {
      const modelo = roundTrip(modeloRefinamientoThing(caso.thing, caso.refinamiento));
      const entidadId = entidadRefinadaId(modelo, caso);
      const entidad = entidadRequerida(modelo, entidadId);
      const refinamiento = refinamientoDe(modelo, entidadId);
      const opdHijo = opdRequerido(modelo, refinamiento.opdId);
      const contorno = aparienciaDeEntidad(modelo, opdHijo.id, entidadId);
      const internas = internasDelRefinamiento(modelo, opdHijo.id, entidadId);
      const cells = proyectarModeloAJointCells(modelo, opdHijo.id, null, null);
      const cellContorno = celdaEntidad(cells, entidadId);

      expect(entidad.refinamiento?.tipo).toBe(caso.refinamiento);
      expect(opdHijo.padreId).toBe(modelo.opdRaizId);
      // BUG-372334: descomposicion (inzoom) renderiza el padre como contorno
      // con partes embebidas (dentroDe=true). Despliegue (unfold) renderiza el
      // padre como entidad normal y las partes viven FUERA, conectadas por
      // enlaces estructurales canonicos.
      const rolEsperado = caso.refinamiento === "descomposicion" ? "contorno" : "externo";
      assertMetadataEntidad(cellContorno, {
        opdId: opdHijo.id,
        entidadId,
        aparienciaId: contorno.id,
        rol: rolEsperado,
      });
      // strokeWidth=4 vive sobre cualquier entidad refinada (refinada=true en
      // composer); aplica para los dos refinamientos como marca visual.
      expect(bodyAttrs(cellContorno).strokeWidth).toBe(4);
      expect(internas).toHaveLength(3);
      for (const interna of internas) {
        const internaEntidad = entidadRequerida(modelo, interna.entidadId);
        expect(internaEntidad.tipo).toBe(caso.thing);
        expect(internaEntidad.esencia).toBe(entidad.esencia);
        expect(internaEntidad.afiliacion).toBe(entidad.afiliacion);
        if (caso.refinamiento === "descomposicion") {
          expect(dentroDe(interna, contorno)).toBe(true);
        } else {
          expect(dentroDe(interna, contorno)).toBe(false);
        }
      }

      if (caso.refinamiento === "despliegue") {
        const estructurales = Object.values(opdHijo.enlaces)
          .map((apariencia) => modelo.enlaces[apariencia.enlaceId])
          .filter((enlace) => enlace?.tipo === "agregacion" && enlace.origenId.id === entidadId);
        expect(estructurales).toHaveLength(3);
      }
      assertSinReferenciasHuerfanas(modelo);
    }
  });

  test("law-refinement-removal remueve descomposicion de proceso sin huerfanos", () => {
    let modelo = modeloRefinamientoThing("proceso", "descomposicion");
    const procesoId = entidadRefinadaId(modelo, { thing: "proceso", refinamiento: "descomposicion" });
    const opdHijoId = refinamientoDe(modelo, procesoId).opdId;
    modelo = must(crearObjeto(modelo, opdHijoId, { x: 230, y: 190 }, "Objeto interno"));
    const internoId = entidadPorNombre(modelo, "Objeto interno").id;
    modelo = must(crearEstadosIniciales(modelo, internoId)).modelo;
    const removibles = snapshotSubarbolRemovible(modelo, opdHijoId);

    const removido = must(quitarDescomposicionProceso(modelo, procesoId));

    expect(removido.opds[opdHijoId]).toBeUndefined();
    expect(removido.entidades[procesoId]?.refinamiento).toBeUndefined();
    assertIdsAusentes(removido.opds, removibles.opdIds);
    assertIdsAusentes(removido.entidades, removibles.entidadIds);
    assertIdsAusentes(removido.estados, removibles.estadoIds);
    assertIdsAusentes(removido.enlaces, removibles.enlaceIds);
    assertSinReferenciasHuerfanas(removido);
  });

  test("law-refinement-removal remueve despliegue de objeto sin huerfanos", () => {
    let modelo = modeloRefinamientoThing("objeto", "despliegue");
    const objetoId = entidadRefinadaId(modelo, { thing: "objeto", refinamiento: "despliegue" });
    const opdHijoId = refinamientoDe(modelo, objetoId).opdId;
    const parteId = internasDelRefinamiento(modelo, opdHijoId, objetoId)[0]?.entidadId;
    if (!parteId) throw new Error("La ley esperaba parte interna");
    modelo = must(crearEstadosIniciales(modelo, parteId)).modelo;
    const removibles = snapshotSubarbolRemovible(modelo, opdHijoId);

    const removido = must(quitarDespliegueObjeto(modelo, objetoId));

    expect(removido.opds[opdHijoId]).toBeUndefined();
    expect(removido.entidades[objetoId]?.refinamiento).toBeUndefined();
    assertIdsAusentes(removido.opds, removibles.opdIds);
    assertIdsAusentes(removido.entidades, removibles.entidadIds);
    assertIdsAusentes(removido.estados, removibles.estadoIds);
    assertIdsAusentes(removido.enlaces, removibles.enlaceIds);
    assertSinReferenciasHuerfanas(removido);
  });
});

function modeloRefinamientoThing(tipo: "objeto" | "proceso", refinamiento: "descomposicion" | "despliegue"): Modelo {
  let modelo = crearModelo(`Ley ${tipo} ${refinamiento}`);
  const nombre = nombreRefinado(tipo, refinamiento);
  modelo = tipo === "objeto"
    ? must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 120 }, nombre))
    : must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 120 }, nombre));
  const entidadId = entidadPorNombre(modelo, nombre).id;
  modelo = must(cambiarEsencia(modelo, entidadId, "fisica"));
  modelo = must(cambiarAfiliacion(modelo, entidadId, "ambiental"));
  modelo = withApariencia(modelo, modelo.opdRaizId, aparienciaDeEntidad(modelo, modelo.opdRaizId, entidadId).id, {
    estilo: { borderColor: "#3bc3ff", fill: "#fdffff" },
  });

  if (tipo === "objeto") {
    modelo = must(crearEstadosIniciales(modelo, entidadId)).modelo;
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 520, y: 128 }, `Operar ${nombre}`));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadId, entidadPorNombre(modelo, `Operar ${nombre}`).id, "consumo"));
  } else {
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 128 }, `Entrada ${nombre}`));
    const externoId = entidadPorNombre(modelo, `Entrada ${nombre}`).id;
    modelo = must(crearEstadosIniciales(modelo, externoId)).modelo;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, externoId, entidadId, "consumo"));
  }

  const refinado = refinamiento === "descomposicion"
    ? must(descomponerProceso(modelo, modelo.opdRaizId, entidadId))
    : must(desplegarObjeto(modelo, modelo.opdRaizId, entidadId, "agregacion"));
  return refinado.modelo;
}

function roundTrip(modelo: Modelo): Modelo {
  return must(hidratarModelo(exportarModelo(modelo)));
}

function assertSinReferenciasHuerfanas(modelo: Modelo): void {
  expect(modelo.opds[modelo.opdRaizId]).toBeDefined();
  for (const [opdId, opd] of Object.entries(modelo.opds)) {
    if (opd.padreId !== null) expect(modelo.opds[opd.padreId]).toBeDefined();
    for (const [aparienciaId, apariencia] of Object.entries(opd.apariencias)) {
      expect(apariencia.id).toBe(aparienciaId);
      expect(apariencia.opdId).toBe(opdId);
      expect(modelo.entidades[apariencia.entidadId]).toBeDefined();
    }
    for (const [aparienciaEnlaceId, apariencia] of Object.entries(opd.enlaces)) {
      expect(apariencia.id).toBe(aparienciaEnlaceId);
      expect(apariencia.opdId).toBe(opdId);
      expect(modelo.enlaces[apariencia.enlaceId]).toBeDefined();
    }
  }
  for (const estado of Object.values(modelo.estados)) {
    expect(modelo.entidades[estado.entidadId]).toBeDefined();
  }
  for (const enlace of Object.values(modelo.enlaces)) {
    expect(extremoExiste(modelo, enlace.origenId)).toBe(true);
    expect(extremoExiste(modelo, enlace.destinoId)).toBe(true);
    expect(enlaceVisible(modelo, enlace.id)).toBe(true);
    if (enlace.derivado?.tipo === "enlace-externo-refinamiento") {
      expect(modelo.entidades[enlace.derivado.refinamientoId]?.refinamiento).toBeDefined();
      expect(modelo.enlaces[enlace.derivado.enlacePadreId]).toBeDefined();
    }
  }
  for (const entidad of Object.values(modelo.entidades)) {
    if (!entidad.refinamiento) continue;
    const opd = modelo.opds[entidad.refinamiento.opdId];
    expect(opd).toBeDefined();
    expect(opd ? Object.values(opd.apariencias).some((apariencia) => apariencia.entidadId === entidad.id) : false).toBe(true);
  }
}

function snapshotSubarbolRemovible(modelo: Modelo, opdRaizId: Id): {
  opdIds: Id[];
  entidadIds: Id[];
  estadoIds: Id[];
  enlaceIds: Id[];
} {
  const opdIds = idsSubarbol(modelo, opdRaizId);
  const entidadesExternas = new Set(
    Object.values(modelo.opds)
      .filter((opd) => !opdIds.includes(opd.id))
      .flatMap((opd) => Object.values(opd.apariencias).map((apariencia) => apariencia.entidadId)),
  );
  const enlaceIds = idsUnicos(
    opdIds.flatMap((opdId) => Object.values(modelo.opds[opdId]?.enlaces ?? {}).map((apariencia) => apariencia.enlaceId))
      .filter((enlaceId) => !enlaceVisibleFueraDe(modelo, enlaceId, opdIds)),
  );
  const entidadIds = idsUnicos(
    opdIds.flatMap((opdId) => Object.values(modelo.opds[opdId]?.apariencias ?? {}).map((apariencia) => apariencia.entidadId))
      .filter((entidadId) => !entidadesExternas.has(entidadId)),
  );
  const estadoIds = Object.values(modelo.estados)
    .filter((estado) => entidadIds.includes(estado.entidadId))
    .map((estado) => estado.id)
    .sort();
  return { opdIds, entidadIds, estadoIds, enlaceIds };
}

function assertIdsAusentes<T>(record: Record<Id, T>, ausentes: Id[]): void {
  for (const id of ausentes) expect(record[id]).toBeUndefined();
}

function idsSubarbol(modelo: Modelo, raizId: Id): Id[] {
  const visitados = new Set<Id>();
  const pendientes = [raizId];
  while (pendientes.length > 0) {
    const actual = pendientes.pop();
    if (!actual || visitados.has(actual) || !modelo.opds[actual]) continue;
    visitados.add(actual);
    for (const opd of Object.values(modelo.opds)) {
      if (opd.padreId === actual) pendientes.push(opd.id);
    }
  }
  return [...visitados].sort();
}

function enlaceVisible(modelo: Modelo, enlaceId: Id): boolean {
  return Object.values(modelo.opds).some((opd) =>
    Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId)
  );
}

function enlaceVisibleFueraDe(modelo: Modelo, enlaceId: Id, opdIds: Id[]): boolean {
  const removidos = new Set(opdIds);
  return Object.values(modelo.opds)
    .filter((opd) => !removidos.has(opd.id))
    .some((opd) => Object.values(opd.enlaces).some((apariencia) => apariencia.enlaceId === enlaceId));
}

function extremoExiste(modelo: Modelo, extremo: ExtremoEnlace): boolean {
  if (extremo.kind === "entidad") return modelo.entidades[extremo.id] !== undefined;
  const estado = modelo.estados[extremo.id];
  return estado !== undefined && modelo.entidades[estado.entidadId] !== undefined;
}

function internasDelRefinamiento(modelo: Modelo, opdId: Id, entidadId: Id): Apariencia[] {
  const contorno = aparienciaDeEntidad(modelo, opdId, entidadId);
  const tipo = modelo.entidades[entidadId]?.refinamiento?.tipo;
  // BUG-372334: en despliegue las partes viven FUERA del padre. La pertenencia
  // se determina por presencia en el OPD hijo, no por contencion espacial.
  const filtroEspacial = tipo === "despliegue"
    ? () => true
    : (apariencia: Apariencia) => dentroDe(apariencia, contorno);
  return Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .filter((apariencia) => apariencia.entidadId !== entidadId)
    .filter(filtroEspacial)
    .sort((a, b) => a.y - b.y || a.x - b.x || a.id.localeCompare(b.id));
}

function dentroDe(apariencia: Apariencia, contorno: Apariencia): boolean {
  return (
    apariencia.x >= contorno.x &&
    apariencia.y >= contorno.y &&
    apariencia.x + apariencia.width <= contorno.x + contorno.width &&
    apariencia.y + apariencia.height <= contorno.y + contorno.height
  );
}

function celdaEntidad(cells: JointCellJson[], entidadId: Id): JointCellJson | undefined {
  return cells.find((cell) => cell.opm.kind === "entidad" && cell.opm.entidadId === entidadId);
}

function bodyAttrs(cell: JointCellJson | undefined): Record<string, unknown> {
  const attrs = cell?.attrs as Record<string, unknown> | undefined;
  return (attrs?.body ?? {}) as Record<string, unknown>;
}

function assertMetadataEntidad(
  cell: JointCellJson | undefined,
  esperado: { opdId: Id; entidadId: Id; aparienciaId: Id; rol: "contorno" | "interno" | "externo" },
): void {
  expect(cell?.opm.kind).toBe("entidad");
  if (cell?.opm.kind !== "entidad") return;
  expect(cell.opm.opdId).toBe(esperado.opdId);
  expect(cell.opm.entidadId).toBe(esperado.entidadId);
  expect(cell.opm.aparienciaId).toBe(esperado.aparienciaId);
  expect(cell.opm.rol).toBe(esperado.rol);
}

function aparienciasDeEntidad(modelo: Modelo, entidadId: Id): Record<Id, Apariencia> {
  const apariencias: Record<Id, Apariencia> = {};
  for (const opd of Object.values(modelo.opds)) {
    for (const apariencia of Object.values(opd.apariencias)) {
      if (apariencia.entidadId === entidadId) apariencias[apariencia.id] = apariencia;
    }
  }
  return apariencias;
}

function snapshotAparienciasContorno(modelo: Modelo, entidadId: Id): Record<Id, Pick<Apariencia, "id" | "entidadId" | "opdId" | "x" | "y" | "width" | "height" | "estilo">> {
  const snapshot: Record<Id, Pick<Apariencia, "id" | "entidadId" | "opdId" | "x" | "y" | "width" | "height" | "estilo">> = {};
  for (const [aparienciaId, apariencia] of Object.entries(aparienciasDeEntidad(modelo, entidadId))) {
    snapshot[aparienciaId] = {
      id: apariencia.id,
      entidadId: apariencia.entidadId,
      opdId: apariencia.opdId,
      x: apariencia.x,
      y: apariencia.y,
      width: apariencia.width,
      height: apariencia.height,
      ...(apariencia.estilo ? { estilo: apariencia.estilo } : {}),
    };
  }
  return snapshot;
}

function aparienciaDeEntidad(modelo: Modelo, opdId: Id, entidadId: Id): Apariencia {
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {})
    .find((item) => item.entidadId === entidadId);
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId} en ${opdId}`);
  return apariencia;
}

function entidadRefinadaId(modelo: Modelo, caso: CasoThingRefinamiento): Id {
  return entidadPorNombre(modelo, nombreRefinado(caso.thing, caso.refinamiento)).id;
}

function entidadPorNombre(modelo: Modelo, nombre: string): Entidad {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad;
}

function entidadRequerida(modelo: Modelo, entidadId: Id): Entidad {
  const entidad = modelo.entidades[entidadId];
  if (!entidad) throw new Error(`Entidad no encontrada: ${entidadId}`);
  return entidad;
}

function opdRequerido(modelo: Modelo, opdId: Id): Modelo["opds"][Id] {
  const opd = modelo.opds[opdId];
  if (!opd) throw new Error(`OPD no encontrado: ${opdId}`);
  return opd;
}

function refinamientoDe(modelo: Modelo, entidadId: Id): NonNullable<Entidad["refinamiento"]> {
  const refinamiento = modelo.entidades[entidadId]?.refinamiento;
  if (!refinamiento) throw new Error(`Refinamiento no encontrado: ${entidadId}`);
  return refinamiento;
}

function withApariencia(modelo: Modelo, opdId: Id, aparienciaId: Id, patch: Partial<Apariencia>): Modelo {
  const opd = opdRequerido(modelo, opdId);
  const apariencia = opd.apariencias[aparienciaId];
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${aparienciaId}`);
  return {
    ...modelo,
    opds: {
      ...modelo.opds,
      [opdId]: {
        ...opd,
        apariencias: {
          ...opd.apariencias,
          [aparienciaId]: { ...apariencia, ...patch },
        },
      },
    },
  };
}

function estadosDeEntidad(modelo: Modelo, entidadId: Id): Array<{ id: Id }> {
  return Object.values(modelo.estados)
    .filter((estado) => estado.entidadId === entidadId)
    .sort((a, b) => a.id.localeCompare(b.id));
}

function nombreRefinado(tipo: TipoEntidad, refinamiento: TipoRefinamiento): string {
  return `${tipo === "objeto" ? "Objeto" : "Proceso"} ${refinamiento}`;
}

function ids<T>(record: Record<Id, T>): Id[] {
  return Object.keys(record).sort();
}

function idsUnicos(items: Id[]): Id[] {
  return [...new Set(items)].sort();
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(`Ley fallo en preparacion: ${resultado.error}`);
  return resultado.value;
}
