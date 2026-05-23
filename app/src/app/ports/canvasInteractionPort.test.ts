import { describe, expect, test } from "bun:test";
import type { CanvasSessionPort } from "./canvasSessionPort";
import { componerCanvasInteractionPort } from "./canvasInteractionPort";
import type { ModelCommandPort } from "./modelCommandPort";
import type { SelectionPort } from "./selectionPort";

describe("CanvasInteractionPort", () => {
  test("compone solo la frontera que JointCanvas consume desde sesion, seleccion y comandos", () => {
    const fn = () => undefined;
    const session = {
      modoEnlace: null,
      modoCreacion: null,
      modelo: { id: "modelo" },
      opdActivoId: "opd-1",
      hoverOplRef: null,
      uiAliasVisibles: true,
      uiDescripcionesVisibles: true,
      uiModoImagenGlobal: false,
      contextoSimulacion: null,
      alternarModoImagenEntidad: fn,
      abrirModalImagen: fn,
      fijarHoverOpl: fn,
      gridConfig: { activa: true, paso: 10, color: "#d8e2ee", strokeWidth: 1, escala: 1, snapActivo: true },
      solicitudFitToken: 7,
    } as unknown as CanvasSessionPort;
    const selection = {
      seleccionId: "entidad-1",
      seleccionados: ["entidad-1"],
      enlaceSeleccionId: null,
      estadoSeleccionId: null,
      idsResaltadosTemporales: [],
      seleccionarEntidad: fn,
      seleccionarPartePlegada: fn,
      seleccionarEstadoComoExtremo: fn,
      seleccionarEnlace: fn,
      seleccionarGrupoEstructural: fn,
      setSeleccion: fn,
      setSeleccionPorTipo: fn,
      agregarASeleccion: fn,
      toggleSeleccion: fn,
      vaciarSeleccion: fn,
      seleccionarEstado: fn,
      agregarEstadoASeleccion: fn,
      toggleSeleccionEstado: fn,
    } as unknown as SelectionPort;
    const commands = {
      cambiarOpdActivo: fn,
      moverAparienciaConPuertos: fn,
      actualizarPosicionSimboloEstructural: fn,
      actualizarAnclajesSimboloEstructural: fn,
      cambiarModoPlegadoApariencia: fn,
      extraerParteDePlegado: fn,
      actualizarVerticesEnlace: fn,
      actualizarPosicionLabelEnlace: fn,
      crearEntidadEnCanvas: fn,
      crearAparienciaEntidadEnCanvas: fn,
      crearEnlaceEntreEntidades: fn,
      elegirTipoEnlace: fn,
      iniciarConexionDesdeApariencia: fn,
      cancelarEnlace: fn,
      redimensionarAparienciaEnCanvas: fn,
      reanclarExtremoAccion: fn,
      renombrarEntidadDesdeOpl: fn,
    } as unknown as ModelCommandPort;

    const port = componerCanvasInteractionPort(session, selection, commands);

    expect(port.modelo).toBe(session.modelo);
    expect(port.seleccionados).toBe(selection.seleccionados);
    expect(port.crearEnlaceEntreEntidades).toBe(commands.crearEnlaceEntreEntidades);
    expect(Object.keys(port).sort()).toEqual([
      "abrirModalImagen",
      "actualizarAnclajesSimboloEstructural",
      "actualizarPosicionLabelEnlace",
      "actualizarPosicionSimboloEstructural",
      "actualizarVerticesEnlace",
      "agregarASeleccion",
      "agregarEstadoASeleccion",
      "alternarModoImagenEntidad",
      "cambiarModoPlegadoApariencia",
      "cambiarOpdActivo",
      "cancelarEnlace",
      "contextoSimulacion",
      "crearAparienciaEntidadEnCanvas",
      "crearEnlaceEntreEntidades",
      "crearEntidadEnCanvas",
      "elegirTipoEnlace",
      "enlaceSeleccionId",
      "estadoSeleccionId",
      "extraerParteDePlegado",
      "fijarHoverOpl",
      "gridConfig",
      "hoverOplRef",
      "idsResaltadosTemporales",
      "iniciarConexionDesdeApariencia",
      "modelo",
      "modoCreacion",
      "modoEnlace",
      "moverAparienciaConPuertos",
      "opdActivoId",
      "reanclarExtremoAccion",
      "redimensionarAparienciaEnCanvas",
      "renombrarEntidadDesdeOpl",
      "seleccionId",
      "seleccionados",
      "seleccionarEnlace",
      "seleccionarEntidad",
      "seleccionarEstado",
      "seleccionarEstadoComoExtremo",
      "seleccionarGrupoEstructural",
      "seleccionarPartePlegada",
      "setSeleccion",
      "solicitudFitToken",
      "toggleSeleccion",
      "toggleSeleccionEstado",
      "uiAliasVisibles",
      "uiDescripcionesVisibles",
      "uiModoImagenGlobal",
      "vaciarSeleccion",
    ]);
  });
});
