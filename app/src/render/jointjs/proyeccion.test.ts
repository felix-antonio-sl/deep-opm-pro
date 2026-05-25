import { describe, expect, test } from "bun:test";
import { formarAbanico } from "../../modelo/abanicos";
import { crearAutoInvocacion } from "../../modelo/autoinvocacion";
import { renombrarEtiquetaEnlace } from "../../modelo/etiquetasEnlace";
import { entidadIdDeExtremo, extremoEstado } from "../../modelo/extremos";
import { aplicarEstiloApariencia } from "../../modelo/estilos";
import { aplicarModificador, definirDemora, definirProbabilidad } from "../../modelo/modificadores";
import { ajustarMultiplicidad, cambiarAfiliacion, cambiarEsencia, crearEnlace, crearEstadosIniciales, crearModelo, crearObjeto, crearProceso, definirBackwardTag, definirRequisitosEnlace, definirTasaEnlace, definirTiempoExcepcionEnlace, designarEstadoFinal, designarEstadoInicial, descomponerProceso, desplegarObjeto, estadosDeEntidad, plegarCompletoGrupoEstructural, renombrarEstado } from "../../modelo/operaciones";
import { editarAlias, editarDescripcion } from "../../modelo/objetoMetadata";
import { cambiarModoPlegado, crearEnlaceConExtremoPlegado, extraerParteDePlegado, reinsertarParteEnPlegado } from "../../modelo/plegado";
import { definirRutaEtiqueta } from "../../modelo/rutas";
import type { Apariencia, Modelo, Resultado, TipoEnlace } from "../../modelo/tipos";
import { CODEX } from "./constantes.codex";
import { LINK_ASSETS } from "./linkAssets";
import { proyectarModeloAJointCells } from "./proyeccion";

describe("proyeccion JointJS", () => {
  test("opciones explicitas no leen ni heredan estado global", () => {
    const modelo = modeloConAliasYDescripcion();
    const entidadId = entidadPorNombre(modelo, "Solicitud");
    const descriptores = capturarDescriptoresOpcionesGlobales();
    instalarOpcionesGlobalesQueFallen();
    try {
      const visible = cellDeEntidad(proyectarModeloAJointCells(
        modelo,
        modelo.opdRaizId,
        null,
        null,
        null,
        [],
        { aliasVisibles: true, descripcionesVisibles: true, modoImagenGlobal: null },
      ), entidadId);
      const oculta = cellDeEntidad(proyectarModeloAJointCells(
        modelo,
        modelo.opdRaizId,
        null,
        null,
        null,
        [],
        { aliasVisibles: false, descripcionesVisibles: false, modoImagenGlobal: null },
      ), entidadId);

      expect(textoEtiqueta(visible)).toBe("Solicitud {sol}");
      expect(textoEtiqueta(oculta)).toBe("Solicitud");
      expect((visible.markup as Array<Attrs> | undefined)?.some((item) => item.selector === "descBadge")).toBe(true);
      expect((oculta.markup as Array<Attrs> | undefined)?.some((item) => item.selector === "descBadge") ?? false).toBe(false);
    } finally {
      restaurarDescriptoresOpcionesGlobales(descriptores);
    }
  });

  test("default canonico no lee ni hereda estado global", () => {
    const modelo = modeloConAliasYDescripcion();
    const entidadId = entidadPorNombre(modelo, "Solicitud");
    const descriptores = capturarDescriptoresOpcionesGlobales();
    instalarOpcionesGlobalesQueFallen();
    try {
      const cell = cellDeEntidad(proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null), entidadId);

      expect(textoEtiqueta(cell)).toBe("Solicitud {sol}");
      expect((cell.markup as Array<Attrs> | undefined)?.some((item) => item.selector === "descBadge")).toBe(true);
    } finally {
      restaurarDescriptoresOpcionesGlobales(descriptores);
    }
  });

  test("proyecta apariencias como ids de celdas y mantiene metadata OPM", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Driver"));
    const entidad = Object.values(modelo.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    expect(apariencia).toBeDefined();
    if (!apariencia) return;

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, entidad.id, null);
    // SEL-1 (Codex rev2 §5.1): el underline de selección única va EMBEBIDO en la
    // celda de la entidad (no como celda-halo aparte), así que sigue habiendo 1
    // sola celda y el conteo de `.joint-element` no cambia.
    expect(cells).toHaveLength(1);
    expect(cells[0]?.id).toBe(apariencia.id);
    expect(cells[0]?.type).toBe("standard.Rectangle");
    expect(cells[0]?.opm).toEqual({
      kind: "entidad",
      opdId: modelo.opdRaizId,
      entidadId: entidad.id,
      aparienciaId: apariencia.id,
      rol: "interno",
    });
    expect(((cells[0]?.attrs as Attrs | undefined)?.label as Attrs | undefined)?.textWrap).toEqual({ width: -16, height: -16, ellipsis: false });
  });

  test("SEL-2: la entidad seleccionada no emite resize-handles flotantes", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Driver"));
    const entidad = Object.values(modelo.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, entidad.id, null);
    const celdaEntidad = cells.find((cell) => cell.opm.kind === "entidad");
    const markup = (celdaEntidad?.markup as Array<Attrs> | undefined) ?? [];
    const tieneResize = markup.some((item) => typeof item.selector === "string" && (item.selector as string).startsWith("resize-"));
    expect(tieneResize).toBe(false);
    // Los connect-anchors del modo enlace SÍ siguen presentes en selección.
    const tieneAnchors = markup.some((item) => typeof item.selector === "string" && (item.selector as string).startsWith("connect-anchor-"));
    expect(tieneAnchors).toBe(true);
  });

  test("SEL-1: selección única emite el underline crimson embebido en la celda", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Driver"));
    const entidad = Object.values(modelo.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const sinSeleccion = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const celdaSin = sinSeleccion.find((cell) => cell.opm.kind === "entidad");
    const tieneUnderlineSin = ((celdaSin?.markup as Array<Attrs> | undefined) ?? []).some((item) => item.selector === "selectionUnderline");
    expect(tieneUnderlineSin).toBe(false);

    const conSeleccion = proyectarModeloAJointCells(modelo, modelo.opdRaizId, entidad.id, null);
    // El underline va embebido: no hay celda-halo aparte en selección única.
    expect(conSeleccion.some((cell) => cell.opm.kind === "selection-halo")).toBe(false);
    const celdaCon = conSeleccion.find((cell) => cell.opm.kind === "entidad");
    const markup = (celdaCon?.markup as Array<Attrs> | undefined) ?? [];
    expect(markup.some((item) => item.selector === "selectionUnderline")).toBe(true);
    const underline = (celdaCon?.attrs as Attrs | undefined)?.selectionUnderline as Attrs | undefined;
    expect(underline?.stroke).toBe(CODEX.colores.crimson);
    expect(typeof underline?.d).toBe("string");
  });

  test("resalta entidad desde hover OPL sin persistir estilo", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Orden"));
    const entidad = Object.values(modelo.entidades)[0];
    expect(entidad).toBeDefined();
    if (!entidad) return;

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null, { tipo: "entidad", id: entidad.id })[0];
    const body = (cell?.attrs as Attrs | undefined)?.body as Attrs | undefined;

    expect(body?.fill).toBe("#f4f3ec");
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0]?.estilo).toBeUndefined();
  });

  test("resalta enlace desde hover OPL", () => {
    const modelo = modeloConEnlace("consumo");
    const enlace = Object.values(modelo.enlaces)[0];
    expect(enlace).toBeDefined();
    if (!enlace) return;

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null, { tipo: "enlace", id: enlace.id })
      .find((item) => item.type === "standard.Link");
    const line = (cell?.attrs as Attrs | undefined)?.line as Attrs | undefined;

    expect(line?.strokeWidth).toBe(3);
  });

  test("proyecta foco de simulacion en proceso, objetos involucrados, estado current y token de enlace", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 40 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 130 }, "Aprobar"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    const aprobarId = entidadPorNombre(modelo, "Aprobar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, aprobadoId] = estados.estadoIds;
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendienteId), aprobarId, "consumo"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, aprobarId, extremoEstado(aprobadoId), "resultado"));
    const enlaceIds = Object.keys(modelo.enlaces);

    const cells = proyectarModeloAJointCells(
      modelo,
      modelo.opdRaizId,
      null,
      null,
      null,
      [],
      {},
      {
        procesoActivoId: aprobarId,
        estadosCurrent: { [pedidoId]: pendienteId },
        entidadesInvolucradasIds: [pedidoId, aprobarId],
        enlacesInvolucradosIds: enlaceIds,
      },
    );

    const procesoHalo = cells.find((item) => item.opm.kind === "simulacion-halo" && item.opm.tipo === "proceso-activo");
    const objetoHalo = cells.find((item) => item.opm.kind === "simulacion-halo" && item.opm.tipo === "entidad-involucrada" && item.opm.targetId === pedidoId);
    const currentPin = cells.find((item) => item.opm.kind === "simulacion-halo" && item.opm.tipo === "estado-current");
    const enlaceActivo = cells.find((item) => item.opm.kind === "enlace" && item.opm.enlaceId === enlaceIds[0]);
    const line = (enlaceActivo?.attrs as Attrs | undefined)?.line as Attrs | undefined;
    const labels = enlaceActivo?.labels as Array<{ markup?: Array<{ selector?: string }> }> | undefined;

    expect(procesoHalo).toBeDefined();
    expect(objetoHalo).toBeDefined();
    expect(currentPin?.type).toBe("standard.Path");
    expect(line?.stroke).toBe("#8e2a2e");
    expect(labels?.some((label) => label.markup?.some((node) => node.selector === "token"))).toBe(true);
  });

  test("proyecta halo del estado inicial designado durante simulacion (B0.019)", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 40 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 240, y: 130 }, "Aprobar"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    const aprobarId = entidadPorNombre(modelo, "Aprobar");
    const estados = must(crearEstadosIniciales(modelo, pedidoId));
    modelo = estados.modelo;
    const [pendienteId, aprobadoId] = estados.estadoIds;
    modelo = must(designarEstadoInicial(modelo, pendienteId));
    const aparienciaObjeto = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find(
      (ap) => ap.entidadId === pedidoId,
    );
    if (!aparienciaObjeto) throw new Error("La prueba esperaba apariencia de objeto");

    const cells = proyectarModeloAJointCells(
      modelo,
      modelo.opdRaizId,
      null,
      null,
      null,
      [],
      {},
      {
        procesoActivoId: aprobarId,
        estadosCurrent: { [pedidoId]: aprobadoId },
        entidadesInvolucradasIds: [pedidoId, aprobarId],
        enlacesInvolucradosIds: [],
        estadosInicialesIds: [pendienteId],
      },
    );

    const inicialHalo = cells.find(
      (item) => item.opm.kind === "simulacion-halo" && item.opm.tipo === "estado-inicial",
    );
    expect(inicialHalo).toBeDefined();
    expect(inicialHalo?.id).toBe(`sim-inicial-${aparienciaObjeto.id}-${pendienteId}`);
    if (inicialHalo?.opm.kind === "simulacion-halo") {
      expect(inicialHalo.opm.targetId).toBe(pedidoId);
    }
  });

  test("aplica overrides de fill y borde en attrs JointJS de la cosa", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Validar"));
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!apariencia) throw new Error("La prueba esperaba apariencia");
    modelo = must(aplicarEstiloApariencia(modelo, modelo.opdRaizId, apariencia.id, {
      fill: "#586D8C",
      borderColor: "#70E483",
    }));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)[0];
    const body = ((cell?.attrs as Attrs | undefined)?.body as Attrs | undefined);
    const label = ((cell?.attrs as Attrs | undefined)?.label as Attrs | undefined);

    expect(body).toMatchObject({ fill: "#586d8c", stroke: "#70e483" });
    expect(label?.fill).toBe("#ffffff");
  });

  test("preserva dash de afiliacion ambiental al cambiar color de borde", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Ambiente"));
    const entidad = Object.values(modelo.entidades)[0];
    const apariencia = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {})[0];
    if (!entidad || !apariencia) throw new Error("La prueba esperaba cosa");
    modelo = must(cambiarAfiliacion(modelo, entidad.id, "ambiental"));
    modelo = must(aplicarEstiloApariencia(modelo, modelo.opdRaizId, apariencia.id, { borderColor: "#3BC3FF" }));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)[0];
    const body = ((cell?.attrs as Attrs | undefined)?.body as Attrs | undefined);

    expect(body?.stroke).toBe("#3bc3ff");
    expect(body?.strokeDasharray).toBe("8 4");
  });

  test("proyecta agente con marker canonico desde assets SVG", () => {
    const modelo = modeloConAgente();
    const enlace = Object.values(modelo.enlaces)[0];
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(enlace).toBeDefined();
    expect(aparienciaEnlace).toBeDefined();
    if (!enlace || !aparienciaEnlace) return;

    const aparienciaPorEntidad = new Map(
      Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).map((apariencia) => [
        apariencia.entidadId,
        apariencia.id,
      ]),
    );

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const cellEnlace = cells.find((cell) => cell.id === aparienciaEnlace.id);
    expect(cellEnlace?.type).toBe("standard.Link");
    expect((cellEnlace?.source as { id?: string } | undefined)?.id).toBe(aparienciaPorEntidad.get(entidadIdDeExtremo(modelo, enlace.origenId) ?? ""));
    expect((cellEnlace?.target as { id?: string } | undefined)?.id).toBe(aparienciaPorEntidad.get(entidadIdDeExtremo(modelo, enlace.destinoId) ?? ""));
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
    expect(line?.sourceMarker).toBeNull();
    // P3-2 ronda 4: agente usa path lollipop (stick + circulo) en vez de
    // circle simple. Mantiene fill color enlace (semantica agente=lleno).
    expect((line?.targetMarker as Attrs | undefined)?.type).toBe("path");
    expect((line?.targetMarker as Attrs | undefined)?.d).toBe(LINK_ASSETS.procedural.agente.marker.d);
    expect((line?.targetMarker as Attrs | undefined)?.fill).toBe("#171511");
    expect(cellEnlace?.opm).toMatchObject({
      kind: "enlace",
      enlaceId: enlace.id,
      aparienciaEnlaceId: aparienciaEnlace.id,
      tipo: "agente",
    });
  });

  test("proyecta efecto como enlace bidireccional", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Objeto"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Objeto"), entidadPorNombre(modelo, "Proceso"), "efecto"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);

    expect((line?.sourceMarker as Attrs | undefined)?.d).toBe(LINK_ASSETS.procedural.efecto.marker.d);
    expect((line?.targetMarker as Attrs | undefined)?.d).toBe(LINK_ASSETS.procedural.efecto.marker.d);
  });

  test("BUG-7fcdba: consumo, resultado y efecto usan ancla canonica center+boundary aunque el modelo persista ports", () => {
    for (const tipo of ["consumo", "resultado", "efecto"] as const) {
      const modelo = modeloConEnlace(tipo);
      const enlace = Object.values(modelo.enlaces)[0];
      expect(enlace?.origenId.kind === "entidad" ? enlace.origenId.portId : undefined).toBeDefined();
      expect(enlace?.destinoId.kind === "entidad" ? enlace.destinoId.portId : undefined).toBeDefined();

      const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
        .find((cell) => cell.type === "standard.Link");

      expect(cellEnlace?.source).toEqual({
        id: expect.any(String),
        anchor: { name: "center" },
        connectionPoint: { name: "boundary", args: { offset: 0, sticky: true } },
      });
      expect(cellEnlace?.target).toEqual({
        id: expect.any(String),
        anchor: { name: "center" },
        connectionPoint: { name: "boundary", args: { offset: 0, sticky: true } },
      });
    }
  });

  test("proyecta markers procedimentales restantes desde assets SVG canonicos", () => {
    const casos: Array<{ tipo: TipoEnlace; marker: Attrs }> = [
      { tipo: "instrumento", marker: LINK_ASSETS.procedural.instrumento.marker },
      { tipo: "consumo", marker: LINK_ASSETS.procedural.consumo.marker },
      { tipo: "resultado", marker: LINK_ASSETS.procedural.resultado.marker },
      { tipo: "excepcionSobretiempo", marker: LINK_ASSETS.procedural.excepcionSobretiempo.marker },
      { tipo: "excepcionSubtiempo", marker: LINK_ASSETS.procedural.excepcionSubtiempo.marker },
      { tipo: "excepcionSubSobretiempo", marker: LINK_ASSETS.procedural.excepcionSubSobretiempo.marker },
    ];

    for (const caso of casos) {
      const modelo = modeloConEnlace(caso.tipo);
      const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
      const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
      const targetMarker = line?.targetMarker as Attrs | undefined;

      expect(targetMarker?.type).toBe(caso.marker.type);
      if (caso.marker.type === "circle") {
        expect(targetMarker?.r).toBe(caso.marker.r);
      } else if (caso.marker.type === "polygon") {
        expect(targetMarker?.points).toBe(caso.marker.points);
      } else if (caso.marker.type === "polyline") {
        expect(targetMarker?.points).toBe(caso.marker.points);
      } else {
        expect(targetMarker?.d).toBe(caso.marker.d);
      }
      expect(targetMarker?.fill).toBe(caso.marker.fill);
      expect(targetMarker?.stroke).toBe(caso.marker.stroke);
    }
  });

  test("proyecta enlace etiquetado unidireccional con marker abierto OPCloud y tag no italico", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Sistema"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 130 }, "Requisito"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Sistema"), entidadPorNombre(modelo, "Requisito"), "etiquetado"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, "satisface"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
    const labels = cellEnlace?.labels as Array<{ opmLabelKey?: string; attrs?: { label?: Attrs }; position?: { distance?: unknown; offset?: unknown } }> | undefined;
    const tag = labels?.find((label) => label.opmLabelKey === "etiqueta");

    expect((line?.targetMarker as Attrs | undefined)?.points).toBe(LINK_ASSETS.procedural.etiquetado.marker.points);
    expect(line?.sourceMarker).toBeNull();
    expect(cellEnlace?.router).toBeUndefined();
    expect(tag?.attrs?.label).toMatchObject({ text: "satisface", fontFamily: "Inria Serif, Georgia, serif", fontWeight: 400 });
    expect(tag?.attrs?.label?.fontStyle).toBeUndefined();
    expect(tag?.position).toMatchObject({ distance: 0.5, offset: -20 });
  });

  test("proyecta enlace etiquetado bidireccional con harpoon y labels forward/backward", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 130 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte"), "etiquetadoBidireccional"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, "contiene"));
    modelo = must(definirBackwardTag(modelo, enlaceId, "pertenece a"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
    const labels = cellEnlace?.labels as Array<{ opmLabelKey?: string; attrs?: { label?: Attrs }; position?: { distance?: unknown; offset?: unknown } }> | undefined;
    const forward = labels?.find((label) => label.opmLabelKey === "etiqueta");
    const backward = labels?.find((label) => label.opmLabelKey === "backwardTag");

    expect((line?.sourceMarker as Attrs | undefined)?.points).toBe("0.5,0 20,10");
    expect((line?.targetMarker as Attrs | undefined)?.points).toBe("0.5,0 20,10");
    expect(cellEnlace?.router).toBeUndefined();
    expect(forward?.attrs?.label?.text).toBe("contiene");
    expect(forward?.position).toMatchObject({ distance: 0.8, offset: -10 });
    expect(backward?.attrs?.label?.text).toBe("pertenece a");
    expect(backward?.position).toMatchObject({ distance: 0.2, offset: 10 });
  });

  test("invierte harpoon bidireccional cuando el destino queda a la izquierda", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 320, y: 30 }, "Derecha"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 130 }, "Izquierda"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Derecha"), entidadPorNombre(modelo, "Izquierda"), "etiquetadoBidireccional"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);

    expect((line?.sourceMarker as Attrs | undefined)?.points).toBe("0.5,0 20,-10");
    expect((line?.targetMarker as Attrs | undefined)?.points).toBe("0.5,0 20,-10");
  });

  test("proyecta tasa y requisitos con posiciones OPCloud", () => {
    let modelo = modeloConEnlace("consumo");
    const consumoId = Object.keys(modelo.enlaces)[0];
    if (!consumoId) throw new Error("La prueba esperaba consumo");
    modelo = must(definirTasaEnlace(modelo, consumoId, "2", "kg/h"));
    modelo = must(definirRequisitosEnlace(modelo, consumoId, "REQ-1", true));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const labels = cellEnlace?.labels as Array<{ opmLabelKey?: string; attrs?: { label?: Attrs }; position?: { distance?: unknown; offset?: unknown } }> | undefined;
    const tasa = labels?.find((label) => label.opmLabelKey === "tasa");
    const requisitos = labels?.find((label) => label.opmLabelKey === "requisitos");

    expect(tasa?.attrs?.label?.text).toBe("Rate = 2 [kg/h]");
    expect(tasa?.position).toMatchObject({ distance: 0.55, offset: 10 });
    expect(requisitos?.attrs?.label?.text).toBe("Satisfied: REQ-1");
    expect(requisitos?.position).toMatchObject({ distance: 0.5, offset: -30 });
  });

  test("proyecta umbrales temporales de excepcion como labels independientes", () => {
    let modelo = modeloConEnlace("excepcionSubSobretiempo");
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba excepcion temporal");
    modelo = must(definirTiempoExcepcionEnlace(modelo, enlaceId, {
      tiempoMinimo: "5",
      unidadTiempoMinimo: "s",
      tiempoMaximo: "30",
      unidadTiempoMaximo: "s",
    }));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const labels = cellEnlace?.labels as Array<{ opmLabelKey?: string; attrs?: { label?: Attrs }; position?: { distance?: unknown; offset?: unknown } }> | undefined;
    const minimo = labels?.find((label) => label.opmLabelKey === "tiempo:minimo");
    const maximo = labels?.find((label) => label.opmLabelKey === "tiempo:maximo");

    expect(minimo?.attrs?.label?.text).toBe("Min: 5 s");
    expect(minimo?.position).toMatchObject({ distance: 0.35, offset: 18 });
    expect(maximo?.attrs?.label?.text).toBe("Max: 30 s");
    expect(maximo?.position).toMatchObject({ distance: 0.65, offset: 18 });
  });

  test("proyecta etiquetas de multiplicidad cerca de origen y destino", () => {
    let modelo = modeloConEnlace("consumo");
    const enlaceId = Object.values(modelo.enlaces)[0]?.id;
    expect(enlaceId).toBeDefined();
    if (!enlaceId) return;
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "origen", "2"));
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "destino", "1..N"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const labels = cellEnlace?.labels as Array<{ attrs?: Attrs; position?: { distance?: number; offset?: number; args?: { keepGradient?: boolean } } }> | undefined;

    expect(labels).toHaveLength(2);
    expect(labels?.[0]?.attrs?.label).toMatchObject({ text: "2", fontFamily: "Inria Serif, Georgia, serif", fontSize: 12, fill: "#171511" });
    // OPCloud canon: distancia es FRACCION del path (0..1), no pixeles.
    // Procedural origen 0.1, destino 0.9.
    expect(labels?.[0]?.position).toMatchObject({ distance: 0.1, offset: -12 });
    expect(labels?.[0]?.position?.args?.keepGradient).toBe(false);
    expect(labels?.[1]?.attrs?.label).toMatchObject({ text: "1..N", fontFamily: "Inria Serif, Georgia, serif", fontSize: 12, fill: "#171511" });
    expect(labels?.[1]?.position).toMatchObject({ distance: 0.9, offset: -12 });
    expect(labels?.[1]?.position?.args?.keepGradient).toBe(false);
  });

  test("proyecta badges de modificador, probabilidad y demora", () => {
    let modelo = modeloConEnlace("consumo");
    const consumoId = Object.values(modelo.enlaces)[0]?.id;
    expect(consumoId).toBeDefined();
    if (!consumoId) return;
    modelo = must(aplicarModificador(modelo, consumoId, "evento"));
    modelo = must(definirProbabilidad(modelo, consumoId, 0.7));

    let cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.type === "standard.Link");
    let labels = cellEnlace?.labels as Array<{ attrs?: { label?: { text?: unknown } } }> | undefined;
    expect(labels?.some((label) => label.attrs?.label?.text === "e")).toBe(true);
    expect(labels?.some((label) => label.attrs?.label?.text === "70%")).toBe(true);

    modelo = modeloConEnlace("invocacion");
    const invocacionId = Object.values(modelo.enlaces)[0]?.id;
    expect(invocacionId).toBeDefined();
    if (!invocacionId) return;
    modelo = must(aplicarModificador(modelo, invocacionId, "condicion"));
    modelo = must(definirDemora(modelo, invocacionId, "1s"));
    cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.type === "standard.Link");
    labels = cellEnlace?.labels as Array<{ attrs?: { label?: { text?: unknown } } }> | undefined;
    expect(labels?.some((label) => label.attrs?.label?.text === "c")).toBe(true);
    expect(labels?.some((label) => label.attrs?.label?.text === "1s")).toBe(true);
  });

  test("proyecta etiqueta de ruta sin reemplazar multiplicidad ni modificador", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Aprobar"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 300, y: 90 }, "Pedido"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [, aprobado] = estadosDeEntidad(modelo, pedidoId);
    if (!aprobado) throw new Error("La prueba esperaba estado");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Aprobar"), extremoEstado(aprobado.id), "resultado"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(ajustarMultiplicidad(modelo, enlaceId, "destino", "1"));
    modelo = must(aplicarModificador(modelo, enlaceId, "condicion"));
    modelo = must(definirRutaEtiqueta(modelo, enlaceId, "exitoso"));

    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");
    const labels = cellEnlace?.labels as Array<{ attrs?: { label?: { text?: unknown; fontSize?: unknown; fontFamily?: unknown; fill?: unknown } }; position?: { distance?: unknown; offset?: unknown } }> | undefined;

    expect(labels?.some((label) => label.attrs?.label?.text === "1")).toBe(true);
    expect(labels?.some((label) => label.attrs?.label?.text === "c")).toBe(true);
    const ruta = labels?.find((label) => label.attrs?.label?.text === "exitoso");
    expect(ruta?.attrs?.label).toMatchObject({ fontSize: 12, fill: "#5a564c", fontFamily: "Inria Serif, Georgia, serif" });
    expect(ruta?.position).toMatchObject({ distance: 0.33, offset: -24 });
  });

  test("proyecta invocacion como rayo zigzag por defecto", () => {
    const modelo = modeloConEnlace("invocacion");
    const cellEnlace = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((cell) => cell.type === "standard.Link");

    const vertices = cellEnlace?.vertices as Array<{ x: number; y: number }> | undefined;
    expect(vertices).toHaveLength(3);
    expect(vertices?.[0]?.y).toBe(160);
    expect(vertices?.[1]?.y).toBeGreaterThan(vertices?.[0]?.y ?? 0);
    expect(vertices?.[2]?.y).toBe(vertices?.[0]?.y);
    expect(cellEnlace?.router).toBeUndefined();
    const line = ((cellEnlace?.attrs as Attrs | undefined)?.line as Attrs | undefined);
    expect(line?.sourceMarker).toBeNull();
    // CANON-V2 (ronda 28 L4): invocacion = ROMBO vacio path (antes polygon
    // swallowtail blanco con `points`). El marker expone `d` en vez de
    // `points`. Stroke-width validado via `strokeWidth` (camelCase) ya que
    // `stroke-width` kebab era especifico al swallowtail polygon viejo.
    expect((line?.targetMarker as Attrs | undefined)?.d).toBe(LINK_ASSETS.procedural.invocacion.marker.d);
    expect((line?.targetMarker as Attrs | undefined)?.strokeWidth).toBe(1);
  });

  test("proyecta auto-invocacion como loop visible con demora", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 120, y: 80 }, "Reintentar"));
    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Reintentar")));
    const enlace = Object.values(modelo.enlaces)[0];
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(enlace).toBeDefined();
    expect(aparienciaEnlace).toBeDefined();
    if (!enlace || !aparienciaEnlace) return;

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, enlace.id);
    const tramos = cells.filter((cell) => String(cell.id).startsWith(aparienciaEnlace.id));

    expect(tramos).toHaveLength(2);
    expect(tramos.every((cell) => cell.type === "standard.Link")).toBe(true);
    expect(tramos.every((cell) => cell.opm.kind === "enlace" && cell.opm.enlaceId === enlace.id)).toBe(true);
    const retorno = tramos.find((cell) => String(cell.id).endsWith("-auto-retorno"));
    const labels = retorno?.labels as Array<{ attrs?: { label?: { text?: unknown } } }> | undefined;
    expect(labels?.some((label) => label.attrs?.label?.text === "1s")).toBe(true);
    const line = ((retorno?.attrs as Attrs | undefined)?.line as Attrs | undefined);
    // CANON-V2 (ronda 28 L4): invocacion = path rombo (.d), no polygon
    // (.points). Ver linkAssets.ts.
    expect((line?.targetMarker as Attrs | undefined)?.d).toBe(LINK_ASSETS.procedural.invocacion.marker.d);
  });

  test("BUG-06f1ed: auto-invocacion usa vertices OpCloud de cuatro puntos en cada tramo", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 120, y: 80 }, "Reintentar"));
    modelo = must(crearAutoInvocacion(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Reintentar")));
    const aparienciaEnlace = Object.values(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    expect(aparienciaEnlace).toBeDefined();
    if (!aparienciaEnlace) return;

    const tramos = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .filter((cell) => String(cell.id).startsWith(aparienciaEnlace.id));
    const salida = tramos.find((cell) => String(cell.id).endsWith("-auto-salida"));
    const retorno = tramos.find((cell) => String(cell.id).endsWith("-auto-retorno"));

    expect(salida?.vertices).toHaveLength(4);
    expect(retorno?.vertices).toHaveLength(4);
  });

  test("proyecta O como doble arco concentrico sin overlay textual", () => {
    const modelo = modeloConAbanico("O");
    const abanico = Object.values(modelo.abanicos ?? {})[0];
    expect(abanico).toBeDefined();
    if (!abanico) return;

    const overlay = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.opm.kind === "overlay-abanico");
    const attrs = overlay?.attrs as Attrs | undefined;
    const body = attrs?.body as Attrs | undefined;

    // Shape custom sin refD heredado (evita el rectangulo punteado de bbox).
    expect(overlay?.type).toBe("opm.AbanicoArc");
    expect(attrs?.label).toBeUndefined();
    const d = body?.d;
    expect(typeof d).toBe("string");
    // O = dos arcos concentricos r=30 y r=35, asi que el path tiene 2 'A '.
    expect((d as string).match(/A 30 30/g)?.length).toBe(1);
    expect((d as string).match(/A 35 35/g)?.length).toBe(1);
    expect(body?.fill).toBe("none");
    expect(body?.stroke).toBe("#171511");
    expect(body?.strokeWidth).toBe(1.5);
    expect(body?.strokeDasharray).toBe("4 1");
    expect(overlay?.opm).toEqual({
      kind: "overlay-abanico",
      opdId: modelo.opdRaizId,
      abanicoId: abanico.id,
      operador: "O",
    });
  });

  test("proyecta XOR como un solo arco canonico y conserva metadata de abanico", () => {
    const modelo = modeloConAbanico("XOR");
    const abanico = Object.values(modelo.abanicos ?? {})[0];
    expect(abanico).toBeDefined();
    if (!abanico) return;

    const overlay = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.opm.kind === "overlay-abanico");
    const attrs = overlay?.attrs as Attrs | undefined;
    const body = attrs?.body as Attrs | undefined;

    expect(overlay?.type).toBe("opm.AbanicoArc");
    expect(attrs?.label).toBeUndefined();
    const d = body?.d;
    expect(typeof d).toBe("string");
    // XOR = un solo arco r=30, sin segundo arco r=35.
    expect((d as string).match(/A 30 30/g)?.length).toBe(1);
    expect((d as string).includes("A 35 35")).toBe(false);
    expect(body?.fill).toBe("none");
    expect(body?.stroke).toBe("#171511");
    expect(body?.strokeWidth).toBe(1.5);
    expect(body?.strokeDasharray).toBe("4 1");
    expect(overlay?.opm).toEqual({
      kind: "overlay-abanico",
      opdId: modelo.opdRaizId,
      abanicoId: abanico.id,
      operador: "XOR",
    });
  });

  test("enlaces dentro de un abanico usan router recto (no manhattan)", () => {
    const modelo = modeloConAbanico("O");
    const abanico = Object.values(modelo.abanicos ?? {})[0];
    expect(abanico).toBeDefined();
    if (!abanico) return;

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const enlacesFan = cells.filter(
      (cell) => cell.opm.kind === "enlace" && abanico.enlaceIds.includes(cell.opm.enlaceId),
    );
    expect(enlacesFan.length).toBe(abanico.enlaceIds.length);
    for (const enlace of enlacesFan) {
      expect(enlace.router).toBeUndefined();
    }
  });

  test("proyecta exhibicion como triangulo contorno + triangulo interno relleno", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Vehiculo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Color"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Vehiculo"), entidadPorNombre(modelo, "Color"), "exhibicion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    const links = cells.filter((cell) => cell.type === "standard.Link");
    expect(links).toHaveLength(2);
    const polygons = cells.filter((cell) => cell.type === "standard.Polygon");
    expect(polygons).toHaveLength(2);

    const grande = polygons.find((cell) => !String(cell.id).endsWith("-pequeno"));
    const pequeno = polygons.find((cell) => String(cell.id).endsWith("-pequeno"));
    expect(grande).toBeDefined();
    expect(pequeno).toBeDefined();

    const markerPosition = grande?.position as { x?: number; y?: number } | undefined;
    expect(markerPosition).toBeDefined();
    expect(links[0]?.target).toEqual(extremoTrianguloEsperado(String(grande?.id), "in"));
    expect(links[1]?.source).toEqual(extremoTrianguloEsperado(String(grande?.id), "out"));
    expect(links[0]?.router).toBeUndefined();
    expect(links[1]?.router).toBeUndefined();
    expect(itemsPuertosTriangulo(grande)).toEqual(["in", "out"]);

    const bodyGrande = (grande?.attrs as Attrs | undefined)?.body as Attrs | undefined;
    const bodyPequeno = (pequeno?.attrs as Attrs | undefined)?.body as Attrs | undefined;
    expect(grande?.angle).toBe(0);
    expect(bodyGrande?.refPoints).toBe(LINK_ASSETS.structural.agregacion.markerPoints);
    // Outer = solo contorno (fill blanco para que se vea el stroke).
    // CANON-V2 (ronda 28 L4): outer triangulo exhibicion = fill paper +
    // stroke ink (antes "white" + "#586D8C"). Inner pequeno relleno ink.
    expect(bodyGrande?.fill).toBe("#fafaf8");
    expect(bodyGrande?.stroke).toBe("#171511");
    expect(pequeno?.position).toEqual({ x: (markerPosition?.x ?? 0) + 9, y: (markerPosition?.y ?? 0) + 12 });
    expect(pequeno?.size).toEqual({ width: 12, height: 12 });
    expect(bodyPequeno?.refPoints).toBe(LINK_ASSETS.structural.agregacion.markerPoints);
    expect(bodyPequeno?.fill).toBe("#171511");
    expect(grande?.z).toBeLessThan(pequeno?.z ?? 0);
  });

  test("proyecta generalizacion como triangulo vacio (fill blanco con stroke enlace)", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Animal"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Perro"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Animal"), entidadPorNombre(modelo, "Perro"), "generalizacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    const marker = cells.find((cell) => cell.type === "standard.Polygon");
    expect(marker).toBeDefined();
    const body = (marker?.attrs as Attrs | undefined)?.body as Attrs | undefined;
    expect(marker?.angle).toBe(0);
    expect(body?.refPoints).toBe(LINK_ASSETS.structural.generalizacion.markerPoints);
    expect(body?.fill).toBe(LINK_ASSETS.structural.generalizacion.markerFill);
    expect(body?.stroke).toBe("#171511");
  });

  test("proyecta clasificacion como triangulo vacio mas dot interno", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Persona"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Juan"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Persona"), entidadPorNombre(modelo, "Juan"), "clasificacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    const triangulo = cells.find((cell) => cell.type === "standard.Polygon");
    const dot = cells.find((cell) => cell.type === "standard.Circle");
    expect(triangulo).toBeDefined();
    expect(dot).toBeDefined();
    const triBody = (triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined;
    expect(triangulo?.angle).toBe(0);
    expect(triBody?.refPoints).toBe(LINK_ASSETS.structural.clasificacion.markerPoints);
    expect(triBody?.fill).toBe(LINK_ASSETS.structural.clasificacion.markerFill);
    const dotSize = dot?.size as { width?: number; height?: number } | undefined;
    expect(dotSize?.width).toBe(LINK_ASSETS.structural.clasificacion.markerDot.r * 2);
    const dotPosition = dot?.position as { x?: number; y?: number } | undefined;
    const trianglePosition = triangulo?.position as { x?: number; y?: number } | undefined;
    expect(dotPosition?.x).toBe((trianglePosition?.x ?? 0) + LINK_ASSETS.structural.clasificacion.markerDot.cx - LINK_ASSETS.structural.clasificacion.markerDot.r);
    expect(dotPosition?.y).toBe((trianglePosition?.y ?? 0) + LINK_ASSETS.structural.clasificacion.markerDot.cy - LINK_ASSETS.structural.clasificacion.markerDot.r);
  });

  test("proyecta agregacion con triangulo estructural separado", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Whole"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Part"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Whole"), entidadPorNombre(modelo, "Part"), "agregacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, Object.values(modelo.enlaces)[0]?.id ?? null);

    const links = cells.filter((cell) => cell.type === "standard.Link");
    expect(links).toHaveLength(2);
    const triangulo = cells.find((cell) => cell.type === "standard.Polygon");
    expect(triangulo).toBeDefined();
    expect(links[0]?.target).toEqual(extremoTrianguloEsperado(String(triangulo?.id), "in"));
    expect(links[1]?.source).toEqual(extremoTrianguloEsperado(String(triangulo?.id), "out"));
    expect(itemsPuertosTriangulo(triangulo)).toEqual(["in", "out"]);
    expect(posicionPuertoTriangulo(triangulo, "in")).toEqual({ x: 15, y: 0 });
    expect(posicionPuertoTriangulo(triangulo, "out")).toEqual({ x: 15, y: 30 });
    expect(triangulo?.angle).toBe(0);
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.refPoints).toBe(LINK_ASSETS.structural.agregacion.markerPoints);
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.fill).toBe("#171511");
    expect(((triangulo?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.strokeWidth).toBe(1.2);
  });

  test("proyecta triangulo estructural simple desde symbolPos persistido", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Whole"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Part"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Whole"), entidadPorNombre(modelo, "Part"), "agregacion"));
    const aparienciaEnlaceId = Object.keys(modelo.opds[modelo.opdRaizId]!.enlaces)[0]!;
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          enlaces: {
            ...modelo.opds[modelo.opdRaizId]!.enlaces,
            [aparienciaEnlaceId]: {
              ...modelo.opds[modelo.opdRaizId]!.enlaces[aparienciaEnlaceId]!,
              symbolPos: { x: 180, y: 260 },
            },
          },
        },
      },
    };

    const triangulo = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.type === "standard.Polygon");

    expect(triangulo?.position).toEqual({ x: 165, y: 245 });
    expect(triangulo?.opm.kind === "enlace" ? triangulo.opm.rolEstructural : null).toBe("simbolo");
    expect(triangulo?.opm.kind === "enlace" ? triangulo.opm.aparienciaEnlaceIds : null).toEqual([aparienciaEnlaceId]);
  });

  test("simbolo estructural simple ancla enlaces al centro superior e inferior", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 80 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 80 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte"), "agregacion"));

    const triangulo = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.type === "standard.Polygon");

    expect(posicionPuertoTriangulo(triangulo, "in")).toEqual({ x: 15, y: 0 });
    expect(posicionPuertoTriangulo(triangulo, "out")).toEqual({ x: 15, y: 30 });
  });

  test("fusiona dos agregaciones del mismo todo en bus con triangulo unico", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 170 }, "Parte B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte B"), "agregacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    const links = cells.filter((cell) => cell.type === "standard.Link");
    expect(links).toHaveLength(3);
    const triangulos = cells.filter((cell) => cell.type === "standard.Polygon");
    expect(triangulos).toHaveLength(1);
    expect(String(triangulos[0]?.id)).toContain("struct-bus");
    const ramas = links.filter((cell) => String(cell.id).includes("-rama"));
    expect(ramas).toHaveLength(2);
    expect(ramas.every((cell) => (cell.source as { id?: unknown; port?: unknown }).id === triangulos[0]?.id)).toBe(true);
    const puertosRama = ramas.map((cell) => (cell.source as { port?: unknown }).port);
    expect(puertosRama).toEqual(["out", "out"]);
    expect(itemsPuertosTriangulo(triangulos[0]).sort()).toEqual(["in", "out"]);
    const refinable = links.find((cell) => String(cell.id).endsWith("-refinable"));
    expect((refinable?.target as { id?: unknown; port?: unknown }).id).toBe(triangulos[0]?.id);
    expect((refinable?.target as { id?: unknown; port?: unknown }).port).toBe("in");
    expect(new Set(ramas.map((cell) => cell.opm.kind === "enlace" ? cell.opm.enlaceId : ""))).toEqual(new Set(Object.keys(modelo.enlaces)));
  });

  test("bus estructural ancla enlaces al centro superior e inferior aunque refinadores esten al costado", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 170 }, "Parte B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte B"), "agregacion"));

    const triangulo = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.type === "standard.Polygon");

    expect(posicionPuertoTriangulo(triangulo, "in")).toEqual({ x: 15, y: 0 });
    expect(posicionPuertoTriangulo(triangulo, "out")).toEqual({ x: 15, y: 30 });
  });

  test("bus estructural ordenado muestra label ordered en tramo refinable", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 170 }, "Parte B"));
    const todoId = entidadPorNombre(modelo, "Todo");
    modelo = {
      ...modelo,
      entidades: {
        ...modelo.entidades,
        [todoId]: { ...modelo.entidades[todoId]!, orderedFundamentalTypes: ["agregacion"] },
      },
    };
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, entidadPorNombre(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, entidadPorNombre(modelo, "Parte B"), "agregacion"));

    const refinable = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.type === "standard.Link" && String(cell.id).endsWith("-refinable"));
    const labels = refinable?.labels as Array<{ attrs?: { label?: { text?: unknown } } }> | undefined;

    expect(labels?.[0]?.attrs?.label?.text).toBe("ordered");
  });

  test("bus estructural usa symbolPos persistido y expone todas sus apariencias", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 170 }, "Parte B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte B"), "agregacion"));
    const aparienciaEnlaceIds = Object.keys(modelo.opds[modelo.opdRaizId]!.enlaces);
    const anclajes = Object.fromEntries(aparienciaEnlaceIds.map((id, index) => [
      id,
      {
        refinable: { dx: 0, dy: -14 },
        refinador: { dx: index === 0 ? -8 : 10, dy: 15 },
      },
    ]));
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          enlaces: Object.fromEntries(Object.entries(modelo.opds[modelo.opdRaizId]!.enlaces)
            .map(([id, apariencia]) => {
              const symbolAnchors = anclajes[id];
              return [id, symbolAnchors
                ? { ...apariencia, symbolPos: { x: 210, y: 220 }, symbolAnchors }
                : { ...apariencia, symbolPos: { x: 210, y: 220 } }];
            })),
        },
      },
    };

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const triangulo = cells
      .find((cell) => cell.type === "standard.Polygon");
    const ramas = cells.filter((cell) => cell.type === "standard.Link" && String(cell.id).includes("-rama"));

    expect(triangulo?.position).toEqual({ x: 195, y: 205 });
    expect(triangulo?.opm.kind === "enlace" ? triangulo.opm.aparienciaEnlaceIds : null).toEqual(aparienciaEnlaceIds);
    expect(triangulo?.opm.kind === "enlace" ? triangulo.opm.enlaceIds : null).toEqual(Object.keys(modelo.enlaces));
    expect(posicionPuertoTriangulo(triangulo, "in")).toEqual({ x: 15, y: 1 });
    expect(posicionPuertoTriangulo(triangulo, "out")).toEqual({ x: 16, y: 30 });
    for (const rama of ramas) {
      const port = String((rama.source as { port?: unknown }).port);
      expect(port).toBe("out");
    }
  });

  test("simbolo estructural seleccionado expone handles de anclas", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 170 }, "Parte B"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte B"), "agregacion"));
    const enlaceSeleccionadoId = Object.keys(modelo.enlaces)[0]!;

    const triangulo = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, enlaceSeleccionadoId)
      .find((cell) => cell.type === "standard.Polygon");
    const portBody = attrsPuertoTriangulo(triangulo);

    expect(portBody?.r).toBe(4);
    expect(portBody?.stroke).toBe("#8e2a2e");
    expect(portBody?.cursor).toBe("grab");
  });

  test("fusiona estructurales del mismo tipo y refinable, no solo agregacion", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Animal"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Perro"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 170 }, "Gato"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Animal"), entidadPorNombre(modelo, "Perro"), "generalizacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Animal"), entidadPorNombre(modelo, "Gato"), "generalizacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(3);
    expect(cells.filter((cell) => cell.type === "standard.Polygon")).toHaveLength(1);
    expect(cells.filter((cell) => String(cell.id).includes("-rama"))).toHaveLength(2);
  });

  test("grupoEstructuralId separa ramas del agrupamiento automatico", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 120 }, "Animal"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Perro"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 150 }, "Gato"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 280 }, "Ave"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Animal"), entidadPorNombre(modelo, "Perro"), "generalizacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Animal"), entidadPorNombre(modelo, "Gato"), "generalizacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Animal"), entidadPorNombre(modelo, "Ave"), "generalizacion"));
    const separadoId = Object.keys(modelo.enlaces)[2]!;
    modelo = { ...modelo, enlaces: { ...modelo.enlaces, [separadoId]: { ...modelo.enlaces[separadoId]!, grupoEstructuralId: "grupo-ave" } } };

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(5);
    expect(cells.filter((cell) => cell.type === "standard.Polygon")).toHaveLength(2);
    expect(cells.filter((cell) => String(cell.id).includes("-rama"))).toHaveLength(2);
  });

  test("separa triangulo manual cuando caeria sobre el bus estructural automatico", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 90 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 20 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 190 }, "Parte B"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 105 }, "Parte C"));
    const todoId = entidadPorNombre(modelo, "Todo");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, entidadPorNombre(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, entidadPorNombre(modelo, "Parte B"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, entidadPorNombre(modelo, "Parte C"), "agregacion"));
    const separadoId = Object.keys(modelo.enlaces)[2]!;
    modelo = { ...modelo, enlaces: { ...modelo.enlaces, [separadoId]: { ...modelo.enlaces[separadoId]!, grupoEstructuralId: "grupo-c" } } };

    const triangulos = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .filter((cell) => cell.type === "standard.Polygon" && cell.opm.kind === "enlace" && cell.opm.rolEstructural === "simbolo");
    const centros = triangulos.map((cell) => centroTriangulo(cell));

    expect(centros).toHaveLength(2);
    expect(Math.abs(centros[0]!.x - centros[1]!.x)).toBeGreaterThanOrEqual(45);
    expect(Math.abs(centros[0]!.y - centros[1]!.y)).toBeLessThanOrEqual(1);
  });

  test("una sola agregacion conserva render simple sin bus", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte"), "agregacion"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);

    expect(cells.filter((cell) => cell.type === "standard.Link")).toHaveLength(2);
    expect(cells.filter((cell) => cell.type === "standard.Polygon")).toHaveLength(1);
    expect(cells.some((cell) => String(cell.id).includes("struct-bus"))).toBe(false);
  });

  test("proyecta etiqueta de enlace como tag italico", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte"), "agregacion"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, "componente critico"));

    const enlaceConEtiqueta = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((cell) => cell.type === "standard.Link" && (cell.labels as unknown[] | undefined)?.length);
    const labels = enlaceConEtiqueta?.labels as Array<{ attrs?: { label?: { text?: unknown; fontStyle?: unknown } } }> | undefined;

    expect(labels?.[0]?.attrs?.label).toMatchObject({ text: "componente critico", fontStyle: "italic" });
  });

  test("envuelve labels largos de enlace con ancho de tramo visible JointJS", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Parte"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Todo"), entidadPorNombre(modelo, "Parte"), "agregacion"));
    const enlaceId = Object.keys(modelo.enlaces)[0];
    if (!enlaceId) throw new Error("La prueba esperaba enlace");
    const textoLargo = "componente estructural longitudinal critico";
    modelo = must(renombrarEtiquetaEnlace(modelo, enlaceId, textoLargo));

    const label = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .flatMap((cell) => (cell.labels as Array<{ attrs?: { label?: { text?: unknown; textWrap?: unknown } } }> | undefined) ?? [])
      .find((item) => item.attrs?.label?.text === textoLargo);

    const wrap = label?.attrs?.label?.textWrap as { width?: number; height?: unknown } | undefined;
    expect(wrap?.height).toBeNull();
    expect(wrap?.width).toBeGreaterThanOrEqual(40);
    expect(wrap?.width).toBeLessThan(132);
  });

  test("aplica posicion persistida de label de enlace", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Origen"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 260, y: 130 }, "Destino"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Origen"), entidadPorNombre(modelo, "Destino"), "agregacion", "ruta alternativa"));
    const aparienciaId = Object.keys(modelo.opds[modelo.opdRaizId]?.enlaces ?? {})[0];
    if (!aparienciaId) throw new Error("La prueba esperaba apariencia de enlace");
    modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [modelo.opdRaizId]: {
          ...modelo.opds[modelo.opdRaizId]!,
          enlaces: {
            ...modelo.opds[modelo.opdRaizId]!.enlaces,
            [aparienciaId]: {
              ...modelo.opds[modelo.opdRaizId]!.enlaces[aparienciaId]!,
              labelPositions: {
                etiqueta: { distance: 0.72, offset: 34 },
              },
            },
          },
        },
      },
    };

    const label = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .flatMap((cell) => (cell.labels as Array<{ opmLabelKey?: string; position?: unknown }> | undefined) ?? [])
      .find((item) => item.opmLabelKey === "etiqueta");

    expect(label?.position).toMatchObject({ distance: 0.72, offset: 34 });
  });

  test("proyecta proceso descompuesto con contorno grueso", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
    const procesoId = entidadPorNombre(modelo, "Proceso");
    modelo = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId)).modelo;

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null).find((item) => item.opm.kind === "entidad");
    expect(((cell?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.strokeWidth).toBe(4);
  });

  test("proyecta contorno de descomposicion detras del contenido interno", () => {
    let modelo = crearModelo();
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
    const procesoId = entidadPorNombre(modelo, "Proceso");
    const descompuesto = must(descomponerProceso(modelo, modelo.opdRaizId, procesoId));
    modelo = must(crearObjeto(descompuesto.modelo, descompuesto.opdId, { x: 190, y: 170 }, "Entrada"));

    const cells = proyectarModeloAJointCells(modelo, descompuesto.opdId, null, null);
    const contorno = cells.find((item) => item.opm.kind === "entidad" && item.opm.entidadId === procesoId);
    const contenido = cells.find((item) => item.opm.kind === "entidad" && item.opm.entidadId !== procesoId);

    expect(contorno?.z).toBe(0);
    expect(contenido?.z).toBe(10);
  });

  test("BUG-372334 proyecta despliegue en OPD hijo como entidad normal, no contorno", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Agua"));
    const objetoId = entidadPorNombre(modelo, "Agua");
    const desplegado = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId));
    modelo = desplegado.modelo;

    const cell = cellDeEntidad(proyectarModeloAJointCells(modelo, desplegado.opdId, null, null), objetoId);
    const attrs = cell.attrs as Attrs | undefined;
    const label = attrs?.label as Attrs | undefined;

    expect(cell.z).toBe(10);
    expect(cell.opm.kind === "entidad" ? cell.opm.rol : null).not.toBe("contorno");
    expect(label?.refY).toBe("50%");
    expect(label?.textVerticalAnchor).toBe("middle");
  });

  test("proyecta badge de partes en plegado completo", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect((attrs?.foldBadge as Attrs | undefined)?.text).toBe("▾");
    expect((cell?.markup as Array<Attrs> | undefined)?.some((item) => item.selector === "foldBadge")).toBe(true);
  });

  test("proyecta plegado estructural completo como badge compacto sin filas", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Todo"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 300, y: 40 }, "Parte A"));
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 300, y: 160 }, "Parte B"));
    const todoId = entidadPorNombre(modelo, "Todo");
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, entidadPorNombre(modelo, "Parte A"), "agregacion"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, todoId, entidadPorNombre(modelo, "Parte B"), "agregacion"));
    modelo = must(plegarCompletoGrupoEstructural(modelo, modelo.opdRaizId, Object.keys(modelo.enlaces)));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === todoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect((attrs?.foldBadge as Attrs | undefined)?.text).toBe("▸");
    expect((attrs?.foldBadge as Attrs | undefined)?.title).toContain("2 relación");
    expect(cell?.opm.kind === "entidad" ? cell.opm.partesPlegadas : undefined).toBeUndefined();
  });

  test("proyecta plegado parcial como filas internas sin agregar celdas de partes al OPD padre", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const cell = cells.find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect(cells.filter((item) => item.opm.kind === "entidad")).toHaveLength(1);
    expect((cell?.size as { height?: number } | undefined)?.height).toBeGreaterThan(60);
    expect((attrs?.partLabel0 as Attrs | undefined)?.text).toBe("Vehiculo parte 1");
    expect((attrs?.partLabel1 as Attrs | undefined)?.text).toBe("Vehiculo parte 2");
    expect((attrs?.partLabel2 as Attrs | undefined)?.text).toBe("Vehiculo parte 3");
    expect((cell?.markup as Array<Attrs> | undefined)?.some((item) => item.selector === "foldBadge")).toBe(false);
  });

  test("fila plegada con partes propias expone indicador y target estable", () => {
    let modelo = modeloConVehiculoDesplegado();
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    const parteId = entidadPorNombre(modelo, "Vehiculo parte 1");
    const opdDespliegueId = modelo.entidades[objetoId]?.refinamientos?.despliegue?.opdId;
    if (!opdDespliegueId) throw new Error("Despliegue no encontrado");
    modelo = must(desplegarObjeto(modelo, opdDespliegueId, parteId)).modelo;
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, padre.id, "parcial"));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect((attrs?.partLabel0 as Attrs | undefined)?.text).toBe("▸ Vehiculo parte 1");
    expect(cell?.opm).toMatchObject({
      kind: "entidad",
      partesPlegadas: expect.arrayContaining([
        { selector: "partLabel0", entidadId: parteId },
        { selector: "partHit0", entidadId: parteId },
      ]),
    });
    expect((cell?.size as { height?: number } | undefined)?.height).toBeLessThan(140);
  });

  test("proyecta estados de objeto como capsulas internas inferiores", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    const objetoId = entidadPorNombre(modelo, "Pedido");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    const [primero, segundo] = estadosDeEntidad(modelo, objetoId);
    if (!primero || !segundo) throw new Error("La prueba esperaba dos estados");
    modelo = must(renombrarEstado(modelo, primero.id, "pendiente"));
    modelo = must(renombrarEstado(modelo, segundo.id, "cerrado"));
    modelo = must(designarEstadoInicial(modelo, primero.id));
    modelo = must(designarEstadoFinal(modelo, segundo.id));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const attrs = cell?.attrs as Attrs | undefined;

    expect((cell?.size as { height?: number } | undefined)?.height).toBe(100);
    expect((cell?.markup as Array<Attrs> | undefined)?.filter((item) => String(item.selector).startsWith("stateCapsule"))).toHaveLength(2);
    // CANON-V2 (ronda 28 L4): capsulas de estado en paper Bauhaus + stroke
    // ink. Final con tinte ink-08 (antes #eef8ff azul corporate); regular
    expect(attrs?.stateCapsule0).toMatchObject({ height: 24, rx: 8, fill: "#ece9e1", stroke: "#7e8338", strokeWidth: 3 }); // BUG-9e3b9b: rountangle rx=ESTADOS.radius
    expect(attrs?.stateCapsule1).toMatchObject({ height: 24, rx: 8, fill: "#E8E8E8", stroke: "#7e8338", strokeWidth: 1.2 }); // BUG-9e3b9b: rountangle rx=ESTADOS.radius
    expect((attrs?.stateCapsule0 as Attrs | undefined)?.y).toBe(70);
    expect((attrs?.stateLabel0 as Attrs | undefined)?.text).toBe("pendiente");
    expect((attrs?.stateLabel1 as Attrs | undefined)?.text).toBe("cerrado");
    expect((attrs?.stateCapsule0 as Attrs | undefined)?.pointerEvents).toBe("auto");
    expect((attrs?.stateLabel0 as Attrs | undefined)?.pointerEvents).toBe("auto");
    expect((attrs?.stateCapsule0 as Attrs | undefined)?.cursor).toBe("crosshair");
    expect(cell?.opm).toMatchObject({
      kind: "entidad",
      estadosInteractivos: [
        { selector: "stateCapsule0", estadoId: primero.id },
        { selector: "stateLabel0", estadoId: primero.id },
        { selector: "stateCapsule1", estadoId: segundo.id },
        { selector: "stateLabel1", estadoId: segundo.id },
      ],
    });
  });

  test("proyecta extremo Estado como sub-selector del cell padre (BUG-1fc4d2)", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 90 }, "Aprobar"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    const aprobarId = entidadPorNombre(modelo, "Aprobar");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente) throw new Error("La prueba esperaba un estado");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), aprobarId, "consumo"));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const enlaceCell = cells.find((item) => item.opm.kind === "enlace");
    const aparienciaPedido = aparienciaDeEntidad(modelo, modelo.opdRaizId, pedidoId);
    const aparienciaAprobar = aparienciaDeEntidad(modelo, modelo.opdRaizId, aprobarId);

    // BUG-1fc4d2: el extremo a estado debe ser un endpoint id+selector, no un
    // punto literal {x, y}. Esto permite que JointJS reposicione la flecha en
    // cada drag del padre y que la linea termine en el sub-rect de la capsula.
    expect(enlaceCell?.source).toEqual({
      id: aparienciaPedido.id,
      selector: "stateCapsule0",
      anchor: { name: "midSide" },
      connectionPoint: { name: "boundary", args: { offset: 0, sticky: true } },
    });
    expect((enlaceCell?.target as { id?: string } | undefined)?.id).toBe(aparienciaAprobar.id);
    // BUG-1fc4d2: enlaces que tocan estado se proyectan en z=20 para quedar
    // por encima del cell del Objeto contenedor (z=10) y no ocultos detras.
    expect(enlaceCell?.z).toBe(20);
  });

  test("proyecta foco temporal de extremo Estado sobre la capsula, no sobre todo el objeto", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 90 }, "Aprobar"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    const aprobarId = entidadPorNombre(modelo, "Aprobar");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    const [pendiente] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente) throw new Error("La prueba esperaba un estado");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), aprobarId, "consumo"));
    const enlace = Object.values(modelo.enlaces).find((item) => item.tipo === "consumo");
    if (!enlace) throw new Error("La prueba esperaba un enlace de consumo");

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null, null, [enlace.id, pendiente.id]);
    const haloEstado = cells.find((item) => item.opm.kind === "selection-halo" && item.opm.targetId === pendiente.id);
    const haloObjeto = cells.find((item) => item.opm.kind === "selection-halo" && item.opm.targetId === pedidoId);

    expect(haloEstado?.opm).toMatchObject({
      kind: "selection-halo",
      opdId: modelo.opdRaizId,
      targetId: pendiente.id,
      targetKind: "estado",
    });
    expect(haloEstado?.type).toBe("standard.Path");
    expect(((haloEstado?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.stroke).toBe("#8e2a2e");
    expect(((haloEstado?.attrs as Attrs | undefined)?.body as Attrs | undefined)?.fill).toBe("none");
    expect(haloEstado?.z).toBeGreaterThan(30);
    expect(haloObjeto).toBeUndefined();
  });

  test("degrada foco temporal de estado plegado al objeto contenedor", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Pedido"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 260, y: 90 }, "Aprobar"));
    const pedidoId = entidadPorNombre(modelo, "Pedido");
    const aprobarId = entidadPorNombre(modelo, "Aprobar");
    modelo = must(crearEstadosIniciales(modelo, pedidoId)).modelo;
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, pedidoId)).modelo;
    const [pendiente] = estadosDeEntidad(modelo, pedidoId);
    if (!pendiente) throw new Error("La prueba esperaba un estado");
    modelo = must(renombrarEstado(modelo, pendiente.id, "pendiente"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, extremoEstado(pendiente.id), aprobarId, "consumo"));
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, pedidoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));
    const enlace = Object.values(modelo.enlaces).find((item) => item.tipo === "consumo");
    if (!enlace) throw new Error("La prueba esperaba un enlace de consumo");

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null, null, [enlace.id, pendiente.id]);
    const haloEstado = cells.find((item) => item.opm.kind === "selection-halo" && item.opm.targetId === pendiente.id);
    const haloObjeto = cells.find((item) => item.opm.kind === "selection-halo" && item.opm.targetId === pedidoId);

    expect(haloEstado).toBeUndefined();
    expect(haloObjeto?.opm).toEqual({ kind: "selection-halo", opdId: modelo.opdRaizId, targetId: pedidoId });
  });

  test("plegado parcial oculta capsulas de estado y conserva filas de partes", () => {
    let modelo = crearModelo();
    modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    modelo = must(crearEstadosIniciales(modelo, objetoId)).modelo;
    modelo = must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
    const apariencia = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, apariencia.id, "parcial"));

    const cell = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "entidad" && item.opm.entidadId === objetoId);
    const markup = cell?.markup as Array<Attrs> | undefined;
    const attrs = cell?.attrs as Attrs | undefined;

    expect(markup?.some((item) => String(item.selector).startsWith("stateCapsule"))).toBe(false);
    expect((attrs?.partLabel0 as Attrs | undefined)?.text).toBe("Vehiculo parte 1");
  });

  test("proyecta parte extraida con proxy punteado, marca visual y contador", () => {
    let modelo = modeloConVehiculoDesplegado();
    modelo = agregarPartes(modelo, 2);
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, padre.id, "parcial"));
    modelo = must(extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, entidadPorNombre(modelo, "Vehiculo parte 1")));

    const cells = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null);
    const padreCell = cells.find((item) => item.opm.kind === "entidad" && item.opm.aparienciaId === padre.id);
    const attrs = padreCell?.attrs as Attrs | undefined;
    const proxy = cells.find((item) => item.opm.kind === "proxy-plegado");

    expect(cells.filter((item) => item.opm.kind === "entidad")).toHaveLength(2);
    expect((attrs?.partLabel0 as Attrs | undefined)?.text).toBe("Vehiculo parte 1");
    expect((attrs?.partLabel0 as Attrs | undefined)?.textDecoration).toBe("line-through");
    expect((attrs?.partCounter1 as Attrs | undefined)?.text).toBe("y 4 partes más");
    expect(proxy?.type).toBe("standard.Link");
    expect(((proxy?.attrs as Attrs | undefined)?.line as Attrs | undefined)?.strokeDasharray).toBe("5 4");
  });

  test("reancla enlaces a parte reinsertada en el rectangulo padre con etiqueta", () => {
    let modelo = modeloConVehiculoDesplegado();
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    const parteId = entidadPorNombre(modelo, "Vehiculo parte 1");
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, padre.id, "parcial"));
    modelo = must(extraerParteDePlegado(modelo, modelo.opdRaizId, padre.id, parteId));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 360, y: 110 }, "Mover"));
    modelo = must(crearEnlace(modelo, modelo.opdRaizId, parteId, entidadPorNombre(modelo, "Mover"), "instrumento"));
    const extraida = Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).find((apariencia) => apariencia.entidadId === parteId && apariencia.parteExtraidaDe);
    expect(extraida).toBeDefined();
    if (!extraida) return;
    modelo = must(reinsertarParteEnPlegado(modelo, extraida.id));

    const link = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "enlace" && item.type === "standard.Link");
    const labels = link?.labels as Array<{ attrs?: { label?: { text?: string } } }> | undefined;

    expect((link?.source as { id?: string } | undefined)?.id).toBe(padre.id);
    expect(labels?.some((label) => label.attrs?.label?.text === "Vehiculo parte 1")).toBe(true);
  });

  test("proyecta enlace creado desde fila plegada al padre con etiqueta de parte", () => {
    let modelo = modeloConVehiculoDesplegado();
    const objetoId = entidadPorNombre(modelo, "Vehiculo");
    const padre = aparienciaDeEntidad(modelo, modelo.opdRaizId, objetoId);
    const parteId = entidadPorNombre(modelo, "Vehiculo parte 1");
    modelo = must(cambiarModoPlegado(modelo, modelo.opdRaizId, padre.id, "parcial"));
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 360, y: 110 }, "Mover"));
    modelo = must(crearEnlaceConExtremoPlegado(modelo, modelo.opdRaizId, parteId, entidadPorNombre(modelo, "Mover"), "instrumento"));

    const link = proyectarModeloAJointCells(modelo, modelo.opdRaizId, null, null)
      .find((item) => item.opm.kind === "enlace" && item.type === "standard.Link");
    const labels = link?.labels as Array<{ attrs?: { label?: { text?: string } } }> | undefined;

    expect((link?.source as { id?: string } | undefined)?.id).toBe(padre.id);
    expect(labels?.some((label) => label.attrs?.label?.text === "Vehiculo parte 1")).toBe(true);
    expect(Object.values(modelo.opds[modelo.opdRaizId]?.apariencias ?? {}).some((apariencia) => apariencia.entidadId === parteId)).toBe(false);
  });
});

type Attrs = Record<string, unknown>;

type OpcionGlobal = "__deepOpmUiAliasVisibles" | "__deepOpmUiDescripcionesVisibles" | "__deepOpmUiModoImagenGlobal";

const OPCIONES_GLOBALES: readonly OpcionGlobal[] = [
  "__deepOpmUiAliasVisibles",
  "__deepOpmUiDescripcionesVisibles",
  "__deepOpmUiModoImagenGlobal",
];

function capturarDescriptoresOpcionesGlobales(): Array<[OpcionGlobal, PropertyDescriptor | undefined]> {
  return OPCIONES_GLOBALES.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
}

function instalarOpcionesGlobalesQueFallen(): void {
  for (const key of OPCIONES_GLOBALES) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      get() {
        throw new Error(`La proyeccion explicita no debe leer ${key}`);
      },
      set() {
        throw new Error(`La proyeccion explicita no debe escribir ${key}`);
      },
    });
  }
}

function restaurarDescriptoresOpcionesGlobales(descriptores: Array<[OpcionGlobal, PropertyDescriptor | undefined]>): void {
  for (const [key, descriptor] of descriptores) {
    if (descriptor) {
      Object.defineProperty(globalThis, key, descriptor);
    } else {
      delete (globalThis as unknown as Record<OpcionGlobal, unknown>)[key];
    }
  }
}

function modeloConAliasYDescripcion(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Solicitud"));
  const entidadId = entidadPorNombre(modelo, "Solicitud");
  modelo = must(editarAlias(modelo, entidadId, "sol"));
  return must(editarDescripcion(modelo, entidadId, "Descripcion visible"));
}

function centroTriangulo(cell: ReturnType<typeof proyectarModeloAJointCells>[number]): { x: number; y: number } {
  const position = cell.position as { x?: number; y?: number } | undefined;
  const size = cell.size as { width?: number; height?: number } | undefined;
  return {
    x: (position?.x ?? 0) + (size?.width ?? 30) / 2,
    y: (position?.y ?? 0) + (size?.height ?? 30) / 2,
  };
}

function cellDeEntidad(cells: ReturnType<typeof proyectarModeloAJointCells>, entidadId: string) {
  const cell = cells.find((item) => item.opm.kind === "entidad" && item.opm.entidadId === entidadId);
  expect(cell).toBeDefined();
  if (!cell) throw new Error(`Cell no encontrada: ${entidadId}`);
  return cell;
}

function textoEtiqueta(cell: ReturnType<typeof cellDeEntidad>): unknown {
  return ((cell.attrs as Attrs | undefined)?.label as Attrs | undefined)?.text;
}

function modeloConAgente(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Driver"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Driver Rescuing"));
  const driver = entidadPorNombre(modelo, "Driver");
  const rescate = entidadPorNombre(modelo, "Driver Rescuing");
  modelo = must(cambiarEsencia(modelo, driver, "fisica"));
  return must(crearEnlace(modelo, modelo.opdRaizId, driver, rescate, "agente"));
}

function modeloConEnlace(tipo: TipoEnlace): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 30 }, "Objeto"));
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Proceso"));
  const objeto = entidadPorNombre(modelo, "Objeto");
  const proceso = entidadPorNombre(modelo, "Proceso");

  if (tipo === "resultado") {
    return must(crearEnlace(modelo, modelo.opdRaizId, proceso, objeto, tipo));
  }
  if (tipo === "invocacion" || tipo === "excepcionSobretiempo" || tipo === "excepcionSubtiempo" || tipo === "excepcionSubSobretiempo") {
    modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 420, y: 130 }, "Proceso 2"));
    return must(crearEnlace(modelo, modelo.opdRaizId, proceso, entidadPorNombre(modelo, "Proceso 2"), tipo));
  }
  return must(crearEnlace(modelo, modelo.opdRaizId, objeto, proceso, tipo));
}

function modeloConAbanico(operador: "O" | "XOR"): Modelo {
  let modelo = crearModelo();
  modelo = must(crearProceso(modelo, modelo.opdRaizId, { x: 220, y: 130 }, "Procesar"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 50 }, "Entrada A"));
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 20, y: 220 }, "Entrada B"));
  const procesar = entidadPorNombre(modelo, "Procesar");
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Entrada A"), procesar, "consumo"));
  modelo = must(crearEnlace(modelo, modelo.opdRaizId, entidadPorNombre(modelo, "Entrada B"), procesar, "consumo"));
  modelo = fijarPuertoCompartidoEnlaces(modelo, Object.keys(modelo.enlaces), "destino");
  return must(formarAbanico(modelo, modelo.opdRaizId, Object.keys(modelo.enlaces), operador));
}

function fijarPuertoCompartidoEnlaces(modelo: Modelo, enlaceIds: string[], lado: "origen" | "destino"): Modelo {
  const campo = lado === "origen" ? "origenId" : "destinoId";
  const portId = `port-test-${lado}`;
  const enlaces = { ...modelo.enlaces };
  for (const enlaceId of enlaceIds) {
    const enlace = enlaces[enlaceId];
    if (!enlace) continue;
    const extremo = enlace[campo];
    if (extremo.kind !== "entidad") continue;
    enlaces[enlaceId] = { ...enlace, [campo]: { ...extremo, portId } };
  }
  return { ...modelo, enlaces };
}

function modeloConVehiculoDesplegado(): Modelo {
  let modelo = crearModelo();
  modelo = must(crearObjeto(modelo, modelo.opdRaizId, { x: 80, y: 90 }, "Vehiculo"));
  const objetoId = entidadPorNombre(modelo, "Vehiculo");
  return must(desplegarObjeto(modelo, modelo.opdRaizId, objetoId)).modelo;
}

function agregarPartes(modeloInicial: Modelo, cantidad: number): Modelo {
  let modelo = modeloInicial;
  const objetoId = entidadPorNombre(modelo, "Vehiculo");
  const opdDespliegueId = modelo.entidades[objetoId]?.refinamientos?.despliegue?.opdId;
  expect(opdDespliegueId).toBeDefined();
  if (!opdDespliegueId) throw new Error("Despliegue no encontrado");

  for (let indice = 0; indice < cantidad; indice += 1) {
    const nombre = `Vehiculo parte ${indice + 4}`;
    modelo = must(crearObjeto(modelo, opdDespliegueId, { x: 90 + indice * 130, y: 230 }, nombre));
    modelo = must(crearEnlace(modelo, opdDespliegueId, objetoId, entidadPorNombre(modelo, nombre), "agregacion"));
  }

  return modelo;
}

function entidadPorNombre(modelo: Modelo, nombre: string): string {
  const entidad = Object.values(modelo.entidades).find((item) => item.nombre === nombre);
  expect(entidad).toBeDefined();
  if (!entidad) throw new Error(`Entidad no encontrada: ${nombre}`);
  return entidad.id;
}

function aparienciaDeEntidad(modelo: Modelo, opdId: string, entidadId: string): Apariencia {
  const apariencia = Object.values(modelo.opds[opdId]?.apariencias ?? {}).find((item) => item.entidadId === entidadId);
  expect(apariencia).toBeDefined();
  if (!apariencia) throw new Error(`Apariencia no encontrada: ${entidadId}`);
  return apariencia;
}

function extremoTrianguloEsperado(id: string, port: "in" | "out"): Record<string, unknown> {
  return { id, port, connectionPoint: { name: "anchor" } };
}

function itemsPuertosTriangulo(cell: unknown): string[] {
  const ports = (cell as { ports?: unknown } | undefined)?.ports as { items?: Array<{ id?: string }> } | undefined;
  return (ports?.items ?? []).flatMap((item) => item.id ? [item.id] : []);
}

function posicionPuertoTriangulo(cell: unknown, id: string): { x?: unknown; y?: unknown } | undefined {
  const ports = (cell as { ports?: unknown } | undefined)?.ports as { items?: Array<{ id?: string; args?: { x?: unknown; y?: unknown }; position?: { args?: { x?: unknown; y?: unknown } } }> } | undefined;
  const item = (ports?.items ?? []).find((puerto) => puerto.id === id);
  return item?.args;
}

function attrsPuertoTriangulo(cell: unknown): { r?: unknown; stroke?: unknown; cursor?: unknown } | undefined {
  const ports = (cell as { ports?: unknown } | undefined)?.ports as { groups?: { symbolAnchor?: { attrs?: { portBody?: { r?: unknown; stroke?: unknown; cursor?: unknown } } } } } | undefined;
  return ports?.groups?.symbolAnchor?.attrs?.portBody;
}

function must<T>(resultado: Resultado<T>): T {
  if (!resultado.ok) throw new Error(resultado.error);
  return resultado.value;
}
