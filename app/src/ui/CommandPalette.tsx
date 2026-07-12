import { useEffect, useRef, useState } from "preact/hooks";
import {
  BUG_CAPTURE_OPEN_EVENT,
  BUG_CAPTURE_SHORTCUT,
  BUG_LEDGER_OPEN_EVENT,
  bugCaptureHabilitado,
  emitirEventoBugCapture,
} from "../app/bugCapture";
import { useCommandPaletteViewModel } from "../app/viewmodels/commandPaletteViewModel";
import type { AccionContextual, AccionContextualId } from "../store/acciones-contextuales";
import { accionesContextualesEntidad, accionesParaSuperficie } from "../store/acciones-contextuales";
import { listarAtajos, type RegistroAtajo } from "./atajosTeclado";
import { descargarOpdActualPng, descargarTodosLosOpdsPngZip } from "../render/jointjs/mapaExport";
import { perfilCanonDiagrama } from "../modelo/perfilDiagrama";
import { esOpdSuelto } from "../modelo/opdSueltos";
import { gateOpdsSinAdoptar } from "../serializacion/perfilesExport";
import { useOpmStore } from "../store";
import { useCanvasPaper } from "./CanvasAdapterContext";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import {
  GLIFO_CMD,
  GLIFO_ENTER,
  GLIFO_NAV_DOWN,
  GLIFO_NAV_UP,
  GLIFO_SEP,
  GLIFO_VACIO,
  formatearComboCodex,
} from "./codex/glifos";
import { ejecutarAccionContextualEntidad } from "./ejecutarAccionContextual";
import { tokens } from "./tokens";
import { etiquetaModoGlobal, siguienteModoGlobal } from "./toolbar/toolbarStyles";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

export interface CommandPaletteItem {
  id: string;
  tipo: "atajo" | "accion-contextual" | "accion-menu";
  label: string;
  descripcion: string;
  categoria: string;
  textoBusqueda: string;
  atajo?: string;
  registroIndex?: number;
  accionId?: AccionContextualId;
  menuActionId?: string;
  frecuenciaUso: number;
}

export interface CommandPaletteMenuAction {
  id: string;
  label: string;
  descripcion: string;
  categoria: string;
  atajo?: string;
  enabled?: boolean;
  run: () => void;
}

// Tres estratos, no seis grupos. La paleta liviana ordena por relación con el
// foco: lo que aplica a la SELECCIÓN, los verbos de FUNDACIÓN, y el resto —
// abrir/guardar/exportar/vista/navegación — por frecuencia de uso.
export const SECCIONES_COMMAND_PALETTE = ["CONTEXTUAL", "CREAR", "RECIENTES"] as const;

export type CommandPaletteSeccion = (typeof SECCIONES_COMMAND_PALETTE)[number];

/**
 * Rótulos visibles es-CL de cada estrato. El identificador queda como código
 * estable (single-word, alimenta el testid `command-palette-section-<slug>`),
 * el rótulo humano se resuelve aquí al renderizar.
 */
export const ROTULO_SECCION: Readonly<Record<CommandPaletteSeccion, string>> = {
  CONTEXTUAL: "Para la selección",
  CREAR: "Crear",
  RECIENTES: "Recientes",
};

export interface CommandPaletteGrupo {
  seccion: CommandPaletteSeccion;
  items: CommandPaletteItem[];
}

/**
 * Estrato de cada acción de menú que NO cae por defecto en RECIENTES: los menús
 * condicionados a la selección (CONTEXTUAL) y los verbos de fundación (CREAR).
 * `crear-requisito` es dual y se resuelve por label en seccionVisualCommandPalette.
 * Todo lo no listado (abrir/guardar/exportar/vista/navegación) es RECIENTES.
 */
const SECCION_POR_ACCION_MENU: Readonly<Record<string, CommandPaletteSeccion>> = {
  // Menús que solo tienen sentido con algo seleccionado (aparecen gated).
  "marcar-requisito": "CONTEXTUAL",
  "satisfacer-requisito": "CONTEXTUAL",
  "conectar-submodelo": "CONTEXTUAL",
  "split-parcial": "CONTEXTUAL",
  "recolectar-contorno": "CONTEXTUAL",
  "distribuir-contorno": "CONTEXTUAL",
  "resolver-decision": "CONTEXTUAL",
  "urls-objeto": "CONTEXTUAL",
  "editar-imagen-objeto": "CONTEXTUAL",
  // Verbos de creación no contextuales.
  "nuevo-modelo": "CREAR",
  "vitrina-estereotipos": "CREAR",
};

export function CommandPalette({ abierto, onCerrar }: Props) {
  const [query, setQuery] = useState("");
  const [activo, setActivo] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmarSiDirty = useConfirmarSiDirty();
  const canvasPaper = useCanvasPaper();
  // R-OPD-REF-20: la especie del modelo activo (bit persistido del índice). En un
  // apunte, «OPD sin adoptar» degrada a observación y no bloquea la realización PNG.
  const esApunte = useOpmStore((s) => s.indice.modelos.some((m) => m.id === s.modelo.id && m.esApunte === true));
  const {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceSeleccionId,
    seleccionados,
    nacerApunte,
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
    abrirDialogoVersiones,
    abrirDialogoSimulacionNumerica,
    modeloPersistidoId,
    gridConfig,
    toggleGrid,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirTablaEnlaces,
    abrirCheatsheetAtajos,
    frecuenciaUso,
    registrarUsoCommandPalette,
    exportarJsonAlPortapapeles,
    exportarDiagnosticoAlPortapapeles,
    exportarOplModeloMarkdownAlPortapapeles,
    exportarCanonDocumentoAlPortapapeles,
    copiarContextoSkill,
    copiarLogDecisiones,
    cerrarSesion,
    abrirPestanaNueva,
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
    abrirModalUrls,
    uiAliasVisibles,
    toggleAliasVisibles,
    uiDescripcionesVisibles,
    toggleDescripcionesVisibles,
    uiSoloCanvas,
    toggleSoloCanvas,
    uiModoImagenGlobal,
    fijarModoImagenGlobal,
    abrirModalImagen,
    mostrarArchivados,
    toggleMostrarArchivados,
    mostrarVersiones,
    toggleMostrarVersiones,
    abrirDialogoOntologia,
    abrirDialogoRequisito,
    abrirDialogoSubmodelo,
    abrirVitrinaEstereotipos,
    splitEffectParcialSeleccionado,
    recolectarEnlaceContornoSeleccionado,
    distribuirEnlaceContornoSeleccionado,
    resolverDecisionSeleccionada,
  } = useCommandPaletteViewModel();

  const objetoSeleccionadoId = seleccionId && modelo.entidades[seleccionId]?.tipo === "objeto" ? seleccionId : null;
  const entidad = seleccionId ? modelo.entidades[seleccionId] ?? null : null;
  const accionesContextuales = accionesParaSuperficie(
    accionesContextualesEntidad({
      entidad,
      inspectorAbierto: true,
      multi: seleccionados.length >= 2,
    }),
    "command-palette",
  ).filter((accion) => accion.enabled);
  const accionesMenu = construirAccionesMenuCommandPalette({
    nacerApunte: () => confirmarSiDirty(nacerApunte),
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
    abrirDialogoOntologia,
    abrirDialogoVersiones: modeloPersistidoId ? () => abrirDialogoVersiones(modeloPersistidoId) : null,
    modeloPersistidoId,
    toggleGrid,
    gridActiva: gridConfig.activa,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirDialogoSimulacionNumerica,
    abrirTablaEnlaces,
    abrirCheatsheetAtajos,
    exportarJson: exportarJsonAlPortapapeles,
    exportarDiagnostico: exportarDiagnosticoAlPortapapeles,
    exportarOplModeloMarkdown: exportarOplModeloMarkdownAlPortapapeles,
    exportarCanonDocumento: exportarCanonDocumentoAlPortapapeles,
    copiarContextoSkill,
    copiarLogDecisiones,
    cerrarSesion,
    // EXPORT-GATE (R-VIS-EXP-2): el PNG es la realización de canon-diagrama;
    // un OPD sobre el máximo de apariencias no se exporta (comando deshabilitado;
    // el diagnóstico de densidad explica la acción correctiva).
    opdActivoBloqueadoDensidad: perfilCanonDiagrama(modelo, opdActivoId).estado === "bloqueado",
    modeloBloqueadoDensidad: Object.keys(modelo.opds).some(
      (opdId) => perfilCanonDiagrama(modelo, opdId).estado === "bloqueado",
    ),
    // R-OPD-REF-20 (EXPORT-GATE): un OPD suelto no adoptado no se realiza como
    // PNG canónico; en apunte degrada a observación (se permite con la marca de
    // bosquejo). El ZIP itera todos los OPDs, así que gatea a nivel de modelo.
    opdActivoBloqueadoSuelto: esOpdSuelto(modelo, opdActivoId) && !esApunte,
    modeloBloqueadoSueltos: !gateOpdsSinAdoptar(modelo, { esApunte }).ok,
    exportarOpdPng: canvasPaper ? () => { void descargarOpdActualPng(canvasPaper, modelo, opdActivoId); } : null,
    exportarOpdsPngZip: () => { void descargarTodosLosOpdsPngZip(modelo); },
    abrirPestanaNueva,
    abrirBusquedaCosas,
    abrirBusquedaGlobal,
    abrirUrlsObjeto: objetoSeleccionadoId ? () => abrirModalUrls(objetoSeleccionadoId) : null,
    editarImagenObjeto: objetoSeleccionadoId ? () => abrirModalImagen(objetoSeleccionadoId) : null,
    toggleAliasVisibles,
    aliasVisibles: uiAliasVisibles,
    toggleDescripcionesVisibles,
    descripcionesVisibles: uiDescripcionesVisibles,
    toggleSoloCanvas,
    soloCanvasActivo: uiSoloCanvas,
    ciclarModoImagenGlobal: () => fijarModoImagenGlobal(siguienteModoGlobal(uiModoImagenGlobal)),
    etiquetaModoImagenGlobal: etiquetaModoGlobal(uiModoImagenGlobal),
    modoImagenGlobalActivo: uiModoImagenGlobal !== null,
    toggleMostrarArchivados,
    mostrarArchivados,
    toggleMostrarVersiones,
    mostrarVersiones,
    abrirCapturadorBug: () => emitirEventoBugCapture(BUG_CAPTURE_OPEN_EVENT),
    abrirBugLedger: () => emitirEventoBugCapture(BUG_LEDGER_OPEN_EVENT),
    abrirCrearRequisito: () => abrirDialogoRequisito("crear"),
    abrirMarcarRequisito: () => abrirDialogoRequisito("marcar"),
    abrirSatisfacerRequisito: () => abrirDialogoRequisito("satisfacer"),
    abrirDialogoSubmodelo,
    abrirVitrinaEstereotipos,
    splitEffectParcial: splitEffectParcialSeleccionado,
    recolectarContorno: recolectarEnlaceContornoSeleccionado,
    distribuirContorno: distribuirEnlaceContornoSeleccionado,
    resolverDecision: resolverDecisionSeleccionada,
    hayEntidadSeleccionada: !!seleccionId,
    hayEnlaceSeleccionado: !!enlaceSeleccionId,
  });
  const registros = listarAtajos();
  const items = filtrarItemsCommandPalette(
    construirItemsCommandPalette(registros, accionesContextuales, accionesMenu, frecuenciaUso),
    query,
  ).slice(0, query.trim() ? 12 : 60);
  const grupos = gruposCommandPaletteParaRender(items, query);
  const indicePorItemId = new Map(items.map((item, index) => [item.id, index]));
  const itemActivo = items[activo] ?? items[0] ?? null;

  useEffect(() => {
    if (!abierto) return;
    setQuery("");
    setActivo(0);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return;
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      onCerrar();
    };
    window.addEventListener("keydown", cerrarConEscape, true);
    return () => window.removeEventListener("keydown", cerrarConEscape, true);
  }, [abierto, onCerrar]);

  useEffect(() => {
    if (activo >= items.length) setActivo(Math.max(0, items.length - 1));
  }, [activo, items.length]);

  if (!abierto) return null;

  const ejecutar = (item: CommandPaletteItem | null) => {
    if (!item) return;
    registrarUsoCommandPalette(item.id);
    if (item.tipo === "atajo") {
      const registro = item.registroIndex !== undefined ? registros[item.registroIndex] : undefined;
      registro?.handler(new KeyboardEvent("keydown"));
    } else if (item.accionId) {
      ejecutarAccionContextualEntidad(item.accionId, {
        onEditarAlias: () => enfocarSeccionInspector("inspector-seccion-alias"),
      });
    } else if (item.menuActionId) {
      accionesMenu.find((accion) => accion.id === item.menuActionId)?.run();
    }
    onCerrar();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onCerrar();
      return;
    }
    if (event.key === "Tab") {
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActivo((valor) => Math.min(valor + 1, Math.max(0, items.length - 1)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActivo((valor) => Math.max(0, valor - 1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      ejecutar(itemActivo);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Comandos"
      data-testid="command-palette"
      data-ifml-stereotype="Modal"
      data-ifml-modal="true"
      style={style.backdrop}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onCerrar();
      }}
    >
      <div style={style.dialogo} onMouseDown={(event) => event.stopPropagation()}>
        <div style={style.cabecera}>
          <span style={style.headerKbd}>{GLIFO_CMD}K</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-controls="command-palette-list"
            aria-expanded="true"
            aria-activedescendant={itemActivo ? `command-palette-option-${itemActivo.id}` : undefined}
            value={query}
            onInput={(event) => {
              setQuery(event.currentTarget.value);
              setActivo(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="buscar comando..."
            style={style.input}
          />
          <span style={style.escape}>esc</span>
        </div>
        <div id="command-palette-list" role="listbox" style={style.lista}>
          {items.length === 0 ? (
            <div style={style.empty}>
              Sin comandos para «{query}». ¿Buscas algo del modelo? Prueba Ctrl+F.
            </div>
          ) : grupos.map((grupo) => (
            <section
              key={grupo.seccion ?? "resultados"}
              aria-label={grupo.seccion ? ROTULO_SECCION[grupo.seccion] : "Resultados"}
              data-testid={`command-palette-section-${(grupo.seccion ?? "resultados").toLowerCase()}`}
              style={grupo.seccion === null ? style.seccionPlana : style.seccion}
            >
              {grupo.seccion !== null ? <div style={style.seccionTitulo}>{ROTULO_SECCION[grupo.seccion]}</div> : null}
              <div style={style.seccionItems}>
                {grupo.items.length === 0 ? (
                  <div style={style.seccionVacia}>{GLIFO_VACIO}</div>
                ) : grupo.items.map((item) => {
                  const index = indicePorItemId.get(item.id) ?? 0;
                  const seleccionado = index === activo;
                  return (
                    <button
                      key={item.id}
                      id={`command-palette-option-${item.id}`}
                      type="button"
                      role="option"
                      aria-selected={seleccionado}
                      data-testid={`command-palette-item-${item.id}`}
                      style={seleccionado ? style.itemActivo : style.item}
                      onMouseEnter={() => setActivo(index)}
                      onClick={() => ejecutar(item)}
                    >
                      <span style={style.itemTextos}>
                        <span style={style.itemLabel}>{item.label}</span>
                        {item.descripcion && normalizarTextoBusqueda(item.descripcion) !== normalizarTextoBusqueda(item.label)
                          ? <span style={style.itemDescripcion}>{item.descripcion}</span>
                          : null}
                      </span>
                      <span style={style.itemMeta}>
                        {item.atajo ? <span style={style.atajo}>{formatearComboCodex(item.atajo)}</span> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
        <footer style={style.footer}>
          <span>{GLIFO_NAV_UP}{GLIFO_NAV_DOWN} navegar</span>
          <span style={style.footerSep}>{GLIFO_SEP}</span>
          <span>{GLIFO_ENTER} ejecutar</span>
          <span style={style.footerSep}>{GLIFO_SEP}</span>
          <span>esc cerrar</span>
        </footer>
      </div>
    </div>
  );
}

export function construirItemsCommandPalette(
  registros: readonly RegistroAtajo[],
  acciones: readonly AccionContextual[],
  accionesMenu: readonly CommandPaletteMenuAction[] = [],
  frecuenciaUso: Readonly<Record<string, number>> = {},
): CommandPaletteItem[] {
  const accionesMenuHabilitadas = accionesMenu.filter((accion) => accion.enabled !== false);
  const accionesMenuPorAtajo = new Set(
    accionesMenuHabilitadas
      .filter((accion) => accion.atajo)
      .map((accion) => claveAtajoPalette(accion.atajo!, accion.label)),
  );
  // Ronda23 L1 #3: dedup palette por (combo + label). Si un mismo atajo se
  // registra en varios contextos (p.ej. Ctrl+D en `global` y `panel-arbol`
  // para abrir gestión del árbol OPD) muestra una sola fila en el buscador.
  // El handler real sigue arbitrado por `registroAplicable` segun foco.
  const atajosVistos = new Set<string>();
  const itemsAtajos = registros.flatMap((registro, index) => {
    // M-1: Escape no es un comando — nadie lo busca en la paleta y su fila
    // («Cerrar modal…») era ruido que competía con comandos reales.
    if (registro.combo === "Escape") return [];
    const label = registro.etiqueta ?? registro.descripcion;
    const descripcion = registro.descripcionLarga ?? registro.descripcion;
    const clave = claveAtajoPalette(registro.combo, label);
    if (accionesMenuPorAtajo.has(clave)) return [];
    if (atajosVistos.has(clave)) return [];
    atajosVistos.add(clave);
    const id = `atajo-${index}-${normalizarTextoBusqueda(registro.ctx)}-${normalizarTextoBusqueda(registro.combo)}`;
    return [{
      id,
      tipo: "atajo" as const,
      label,
      descripcion,
      categoria: registro.categoria,
      atajo: registro.combo,
      registroIndex: index,
      textoBusqueda: textoBusqueda([label, descripcion, registro.categoria, registro.combo, registro.ctx]),
      frecuenciaUso: frecuenciaUso[id] ?? 0,
    }];
  });
  const itemsAcciones = acciones.map((accion) => {
    const id = `accion-${accion.id}`;
    // Ronda23 L1 #10: incluir aliasBusqueda para que la nomenclatura OPM en
    // inglés ("inzoom"/"unfold") siga matcheando aunque el label visible se
    // muestre en castellano canónico ("Descomponer"/"Desplegar").
    const aliasBusqueda = accion.aliasBusqueda ?? [];
    return {
      id,
      tipo: "accion-contextual" as const,
      label: accion.label,
      descripcion: accion.label,
      categoria: accion.categoria,
      ...(accion.atajo ? { atajo: accion.atajo } : {}),
      accionId: accion.id,
      textoBusqueda: textoBusqueda([accion.label, accion.categoria, accion.atajo ?? "", ...aliasBusqueda]),
      frecuenciaUso: frecuenciaUso[id] ?? 0,
    };
  });
  const itemsMenu = accionesMenuHabilitadas
    .map((accion) => {
      const id = `menu-${accion.id}`;
      return {
        id,
        tipo: "accion-menu" as const,
        label: accion.label,
        descripcion: accion.descripcion,
        categoria: accion.categoria,
        ...(accion.atajo ? { atajo: accion.atajo } : {}),
        menuActionId: accion.id,
        textoBusqueda: textoBusqueda([accion.label, accion.descripcion, accion.categoria, accion.atajo ?? ""]),
        frecuenciaUso: frecuenciaUso[id] ?? 0,
      };
    });
  return [...itemsAcciones, ...itemsAtajos, ...itemsMenu].sort((a, b) => {
    const frecuencia = b.frecuenciaUso - a.frecuenciaUso;
    return frecuencia === 0 ? a.label.localeCompare(b.label, "es") : frecuencia;
  });
}

function claveAtajoPalette(combo: string, label: string): string {
  return `${combo}|${normalizarTextoBusqueda(label)}`;
}

interface AccionesMenuCommandPaletteDeps {
  nacerApunte: () => void;
  abrirCargarModelo: () => void;
  abrirGuardarComo: () => void;
  abrirDialogoConfiguracion: () => void;
  abrirDialogoOntologia: () => void;
  abrirDialogoVersiones: (() => void) | null;
  modeloPersistidoId: string | null;
  toggleGrid: () => void;
  gridActiva: boolean;
  aplicarLayoutSugerido: () => void;
  iniciarModoSimulacion: () => void;
  abrirDialogoSimulacionNumerica: () => void;
  abrirTablaEnlaces: () => void;
  abrirCheatsheetAtajos: () => void;
  exportarJson: () => void;
  exportarDiagnostico: () => void;
  exportarOplModeloMarkdown: () => void;
  /** Documento canónico (canon-documento, R-VIS-EXP-2); el gate de densidad rechaza con mensaje. */
  exportarCanonDocumento: () => void;
  /** EXPORT-GATE: true si el OPD activo / algún OPD supera el máximo de apariencias. */
  opdActivoBloqueadoDensidad: boolean;
  modeloBloqueadoDensidad: boolean;
  /** EXPORT-GATE (R-OPD-REF-20): true si el OPD activo es un suelto no adoptado (y no es apunte). */
  opdActivoBloqueadoSuelto: boolean;
  /** EXPORT-GATE (R-OPD-REF-20): true si el modelo tiene OPDs sueltos que bloquean el ZIP canónico. */
  modeloBloqueadoSueltos: boolean;
  /** W6.0: puente de contexto 1-click app→skill `modelamiento-opm`. */
  copiarContextoSkill: () => void;
  /** W6.5-b: export del LogDecisiones v0 para `re-elicitar`. */
  copiarLogDecisiones: () => void;
  cerrarSesion: () => void;
  exportarOpdPng: (() => void) | null;
  exportarOpdsPngZip: (() => void) | null;
  abrirPestanaNueva: () => void;
  abrirBusquedaCosas: () => void;
  abrirBusquedaGlobal: () => void;
  abrirUrlsObjeto: (() => void) | null;
  editarImagenObjeto: (() => void) | null;
  toggleAliasVisibles: () => void;
  aliasVisibles: boolean;
  toggleDescripcionesVisibles: () => void;
  descripcionesVisibles: boolean;
  toggleSoloCanvas: () => void;
  soloCanvasActivo: boolean;
  ciclarModoImagenGlobal: () => void;
  etiquetaModoImagenGlobal: string;
  modoImagenGlobalActivo: boolean;
  toggleMostrarArchivados: () => void;
  mostrarArchivados: boolean;
  toggleMostrarVersiones: () => void;
  mostrarVersiones: boolean;
  abrirCapturadorBug: () => void;
  abrirBugLedger: () => void;
  abrirCrearRequisito: () => void;
  abrirMarcarRequisito: () => void;
  abrirSatisfacerRequisito: () => void;
  abrirDialogoSubmodelo: () => void;
  abrirVitrinaEstereotipos: () => void;
  splitEffectParcial: () => void;
  recolectarContorno: () => void;
  distribuirContorno: () => void;
  resolverDecision: () => void;
  hayEntidadSeleccionada: boolean;
  hayEnlaceSeleccionado: boolean;
}

export function construirAccionesMenuCommandPalette(deps: AccionesMenuCommandPaletteDeps): CommandPaletteMenuAction[] {
  return [
    { id: "nuevo-modelo", label: "Nuevo", descripcion: "Abrir un apunte y explorar", categoria: "archivo", run: deps.nacerApunte },
    { id: "abrir-importar", label: "Abrir / importar modelo", descripcion: "Abrir modelos guardados, archivados o JSON", categoria: "archivo", run: deps.abrirCargarModelo },
    { id: "guardar-como", label: "Guardar como", descripcion: "Guardar una copia editable del modelo", categoria: "archivo", run: deps.abrirGuardarComo },
    { id: "abrir-pestana", label: "Abrir como pestaña", descripcion: "Duplicar el modelo actual en una pestaña adicional", categoria: "archivo", atajo: "Ctrl+T", run: deps.abrirPestanaNueva },
    { id: "configuracion", label: "Configuración", descripcion: "Renombrar el modelo, ajustar preferencias y cuadrícula", categoria: "archivo", run: deps.abrirDialogoConfiguracion },
    { id: "configurar-ontologia", label: "Configurar ontología", descripcion: "Editar términos canónicos, sinónimos y modo de control", categoria: "archivo", run: deps.abrirDialogoOntologia },
    { id: "versiones-modelo", label: "Versiones del modelo", descripcion: "Abrir el historial de versiones del modelo", categoria: "archivo", enabled: !!deps.abrirDialogoVersiones, run: deps.abrirDialogoVersiones ?? (() => {}) },
    { id: "crear-requisito", label: deps.hayEntidadSeleccionada || deps.hayEnlaceSeleccionado ? "Crear requisito vinculado" : "Crear requisito", descripcion: "Crea un requisito visible y navegable en el modelo", categoria: "edicion", run: deps.abrirCrearRequisito },
    { id: "marcar-requisito", label: "Marcar como requisito", descripcion: "Convierte el objeto seleccionado en un requisito", categoria: "edicion", enabled: deps.hayEntidadSeleccionada, run: deps.abrirMarcarRequisito },
    { id: "satisfacer-requisito", label: "Vincular requisito existente", descripcion: "Relacionar un requisito con la selección actual", categoria: "edicion", enabled: deps.hayEntidadSeleccionada || deps.hayEnlaceSeleccionado, run: deps.abrirSatisfacerRequisito },
    { id: "conectar-submodelo", label: "Conectar submodelo", descripcion: "Traer otro modelo como vista de solo lectura (referencia LF-04)", categoria: "refinamiento", enabled: deps.hayEntidadSeleccionada, run: deps.abrirDialogoSubmodelo },
    { id: "vitrina-estereotipos", label: "Piezas", descripcion: "Trae Piezas al lienzo: estereotipos de este modelo o entidades de una biblioteca (Calcar / Anclar)", categoria: "edicion", run: deps.abrirVitrinaEstereotipos },
    { id: "split-parcial", label: "Separar efecto en consumo + resultado", descripcion: "Convertir el efecto seleccionado (split parcial TS4/TS5)", categoria: "edicion", enabled: deps.hayEnlaceSeleccionado, run: deps.splitEffectParcial },
    { id: "recolectar-contorno", label: "Recolectar enlace de contorno", descripcion: "Materializar el enlace padre en el OPD de refinamiento", categoria: "refinamiento", enabled: deps.hayEnlaceSeleccionado, run: deps.recolectarContorno },
    { id: "distribuir-contorno", label: "Distribuir enlace de contorno", descripcion: "Restaurar la proyección automática del enlace externo", categoria: "refinamiento", enabled: deps.hayEnlaceSeleccionado, run: deps.distribuirContorno },
    { id: "resolver-decision", label: "Resolver decisión", descripcion: "Evaluar la política visible del enlace o abanico seleccionado", categoria: "vista", enabled: deps.hayEnlaceSeleccionado, run: deps.resolverDecision },
    { id: "buscar-modelo", label: "Buscar en el modelo", descripcion: "Buscar objetos y procesos por nombre en el modelo activo", categoria: "navegacion", atajo: "Ctrl+F", run: deps.abrirBusquedaCosas },
    { id: "buscar-workspace", label: "Buscar en el workspace", descripcion: "Buscar en todos los modelos guardados del workspace", categoria: "navegacion", atajo: "Ctrl+Shift+F", run: deps.abrirBusquedaGlobal },
    { id: "exportar-json", label: "Exportar JSON al portapapeles", descripcion: "Copiar el JSON OPM actual al portapapeles", categoria: "archivo", run: deps.exportarJson },
    { id: "exportar-diagnostico", label: "Exportar diagnóstico (JSON)", descripcion: "Copiar todas las sugerencias del diagnóstico al portapapeles", categoria: "archivo", run: deps.exportarDiagnostico },
    { id: "exportar-opl-modelo", label: "Exportar OPL del modelo (Markdown)", descripcion: "Copiar el OPL completo de todos los OPDs al portapapeles como Markdown", categoria: "archivo", run: deps.exportarOplModeloMarkdown },
    { id: "exportar-canon-documento", label: "Exportar documento canónico (Markdown)", descripcion: "Copiar el perfil canon-documento (portada, métricas, árbol de OPDs, OPL, procedencia) al portapapeles", categoria: "archivo", run: deps.exportarCanonDocumento },
    { id: "copiar-contexto-skill", label: "Copiar contexto para la skill", descripcion: "Copiar procedencia + pendientes [RATIFICAR] + notas de mesa + diagnóstico + OPL para pegar en la sesión de modelamiento-opm", categoria: "archivo", run: deps.copiarContextoSkill },
    { id: "copiar-log-decisiones", label: "Copiar log de decisiones para la skill", descripcion: "Copiar el protocolo LogDecisiones v0 con transiciones [RATIFICAR] para re-elicitar en la skill", categoria: "archivo", run: deps.copiarLogDecisiones },
    { id: "auth-cerrar-sesion", label: "Cerrar sesión", descripcion: "Cerrar la sesión de esta cuenta y volver a la pantalla de login", categoria: "archivo", run: deps.cerrarSesion },
    ...(deps.exportarOpdPng ? [{ id: "exportar-opd-png", label: "Exportar OPD actual como PNG", descripcion: "Descargar el OPD activo como imagen PNG", categoria: "archivo", enabled: !deps.opdActivoBloqueadoDensidad && !deps.opdActivoBloqueadoSuelto, run: deps.exportarOpdPng }] : []),
    ...(deps.exportarOpdsPngZip ? [{ id: "exportar-opds-png-zip", label: "Exportar todos los OPDs como PNG", descripcion: "Descargar un ZIP con una imagen PNG por OPD", categoria: "archivo", enabled: !deps.modeloBloqueadoDensidad && !deps.modeloBloqueadoSueltos, run: deps.exportarOpdsPngZip }] : []),
    { id: "simulacion-conceptual", label: "Simulación conceptual", descripcion: "Entrar al modo de simulación del modelo", categoria: "vista", run: deps.iniciarModoSimulacion },
    { id: "simulacion-numerica", label: "Simulación numérica", descripcion: "Generar datos simulados de atributos y descargar CSV", categoria: "vista", run: deps.abrirDialogoSimulacionNumerica },
    { id: "grid-canvas", label: deps.gridActiva ? "Ocultar cuadrícula del canvas" : "Mostrar cuadrícula del canvas", descripcion: "Alternar la cuadrícula visual del canvas", categoria: "vista", run: deps.toggleGrid },
    { id: "solo-canvas", label: deps.soloCanvasActivo ? "Salir de modo solo canvas" : "Modo solo canvas", descripcion: "100% canvas: oculta OPL, índice, inspector y chrome secundario", categoria: "vista", atajo: "Ctrl+Shift+M", run: deps.toggleSoloCanvas },
    { id: "alias-visibles", label: deps.aliasVisibles ? "Ocultar alias" : "Mostrar alias", descripcion: "Alternar la visibilidad de los alias de las cosas", categoria: "vista", run: deps.toggleAliasVisibles },
    { id: "descripciones-visibles", label: deps.descripcionesVisibles ? "Ocultar descripciones" : "Mostrar descripciones", descripcion: "Alternar la visibilidad de las descripciones de las cosas", categoria: "vista", run: deps.toggleDescripcionesVisibles },
    { id: "modo-imagen-global", label: `Imagen: ${deps.etiquetaModoImagenGlobal}`, descripcion: "Ciclar el modo de imagen global de los objetos", categoria: "vista", run: deps.ciclarModoImagenGlobal },
    ...(deps.editarImagenObjeto ? [{ id: "editar-imagen-objeto", label: "Editar imagen del objeto", descripcion: "Editar la imagen del objeto seleccionado", categoria: "vista", run: deps.editarImagenObjeto }] : []),
    { id: "auto-layout", label: "Auto-layout", descripcion: "Aplicar layout sugerido al OPD activo", categoria: "vista", run: deps.aplicarLayoutSugerido },
    { id: "tabla-enlaces", label: "Tabla de enlaces", descripcion: "Abrir la tabla de enlaces del modelo", categoria: "vista", run: deps.abrirTablaEnlaces },
    ...(deps.abrirUrlsObjeto ? [{ id: "urls-objeto", label: "URLs del objeto", descripcion: "Editar las URLs del objeto seleccionado", categoria: "vista", run: deps.abrirUrlsObjeto }] : []),
    { id: "mostrar-archivados", label: deps.mostrarArchivados ? "Ocultar archivados" : "Mostrar archivados", descripcion: "Alternar la visibilidad de los modelos archivados", categoria: "vista", run: deps.toggleMostrarArchivados },
    { id: "mostrar-versiones", label: deps.mostrarVersiones ? "Ocultar glifos de versiones" : "Mostrar glifos de versiones", descripcion: "Alternar los glifos de versiones en el workspace", categoria: "vista", run: deps.toggleMostrarVersiones },
    ...(bugCaptureHabilitado() ? [
      { id: "capturar-bug", label: "Capturar bug", descripcion: "Abrir el capturador de bugs del workspace", categoria: "vista", atajo: BUG_CAPTURE_SHORTCUT, run: deps.abrirCapturadorBug },
      { id: "bug-ledger", label: "Bugs y features", descripcion: "Abrir el ledger local de bugs y features", categoria: "vista", run: deps.abrirBugLedger },
    ] : []),
    { id: "atajos-teclado", label: "Atajos de teclado", descripcion: "Mostrar la referencia de atajos registrados", categoria: "navegacion", run: deps.abrirCheatsheetAtajos },
  ];
}

export function filtrarItemsCommandPalette(items: readonly CommandPaletteItem[], query: string): CommandPaletteItem[] {
  const consulta = normalizarTextoBusqueda(query);
  const terminos = consulta.split(" ").filter(Boolean);
  if (terminos.length === 0) return [...items];
  const coincidentes = items.filter((item) => {
    const texto = `${item.textoBusqueda} ${normalizarTextoBusqueda(seccionVisualCommandPalette(item))}`;
    return terminos.every((termino) => texto.includes(termino));
  });
  // M-2 (auditoría UX 2026-06-12): el prefijo del LABEL manda sobre el fuzzy
  // de descripción/categoría — quien escribe «abrir» quiere los comandos que
  // EMPIEZAN con «Abrir», no el primero que mencione abrir en su descripción.
  // El sort es estable: dentro de cada tier se conserva frecuencia/alfabético.
  return coincidentes.sort((a, b) => tierPrefijoLabel(a, consulta) - tierPrefijoLabel(b, consulta));
}

function tierPrefijoLabel(item: CommandPaletteItem, consulta: string): number {
  return normalizarTextoBusqueda(item.label).startsWith(consulta) ? 0 : 1;
}

/**
 * M-1 (auditoría UX 2026-06-12): con query, la lista es PLANA — el orden
 * visual ES el orden de ejecución (↵ ejecuta lo primero que se ve). Las
 * secciones agrupadas quedan para la vista de exploración sin query.
 */
export interface CommandPaletteGrupoRender {
  seccion: CommandPaletteSeccion | null;
  items: CommandPaletteItem[];
}

export function gruposCommandPaletteParaRender(
  items: readonly CommandPaletteItem[],
  query: string,
): CommandPaletteGrupoRender[] {
  if (query.trim()) return [{ seccion: null, items: [...items] }];
  // Vista de exploración por estratos: los vacíos se ocultan. En particular
  // CONTEXTUAL solo se renderiza cuando hay algo seleccionado que lo pueble.
  return agruparItemsCommandPalette(items, { incluirSeccionesVacias: false });
}

export function agruparItemsCommandPalette(
  items: readonly CommandPaletteItem[],
  opciones: { incluirSeccionesVacias?: boolean } = {},
): CommandPaletteGrupo[] {
  const incluirSeccionesVacias = opciones.incluirSeccionesVacias ?? true;
  const grupos = new Map<CommandPaletteSeccion, CommandPaletteItem[]>(
    SECCIONES_COMMAND_PALETTE.map((seccion) => [seccion, []]),
  );
  for (const item of items) {
    grupos.get(seccionVisualCommandPalette(item))?.push(item);
  }
  return SECCIONES_COMMAND_PALETTE
    .map((seccion) => ({
      seccion,
      items: grupos.get(seccion) ?? [],
    }))
    .filter((grupo) => incluirSeccionesVacias || grupo.items.length > 0);
}

export function seccionVisualCommandPalette(item: CommandPaletteItem): CommandPaletteSeccion {
  // `componer-modelo` es una accion-contextual SIEMPRE visible (compone el
  // modelo entero con otro, no la selección). Si cayera en CONTEXTUAL poblaría
  // «Para la selección» sin selección (spec §4). Su casa es CREAR: verbo de
  // fundación a nivel-modelo.
  if (item.accionId === "componer-modelo") return "CREAR";
  // CONTEXTUAL: las acciones contextuales (dependen de la cosa/enlace en foco)
  // y las acciones de menú que solo tienen sentido con algo seleccionado.
  if (item.tipo === "accion-contextual") return "CONTEXTUAL";
  const menuId = item.menuActionId;
  if (menuId) {
    // `crear-requisito` es dual: vinculado a la selección (CONTEXTUAL) vs suelto
    // como verbo de fundación (CREAR). El label codifica el estado de selección.
    if (menuId === "crear-requisito") {
      return normalizarTextoBusqueda(item.label).includes("vinculado") ? "CONTEXTUAL" : "CREAR";
    }
    const seccion = SECCION_POR_ACCION_MENU[menuId];
    if (seccion) return seccion;
  }
  // RECIENTES: abrir/guardar/exportar/vista/navegación y los atajos globales —
  // el grueso del catálogo, presentado por frecuencia de uso.
  return "RECIENTES";
}

export function normalizarTextoBusqueda(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
}

function textoBusqueda(partes: readonly string[]): string {
  return normalizarTextoBusqueda(partes.join(" "));
}

function enfocarSeccionInspector(testId: string): void {
  window.setTimeout(() => {
    const seccion = document.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
    const foco = seccion?.querySelector<HTMLElement>("input, textarea, button, select");
    foco?.focus();
    seccion?.scrollIntoView({ block: "nearest" });
  }, 0);
}

/**
 * Estilos del CommandPalette — Codex L6.
 *
 * Backdrop paper+blur, grilla editorial de tres estratos y cursor con rail
 * crimson. Mantiene roles/testids existentes; solo cambia presentacion.
 */
const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: "grid",
    placeItems: "start center",
    paddingTop: "88px",
    background: "rgb(250 250 248 / 0.8)",
    backdropFilter: "blur(2px)",
  },
  dialogo: {
    width: "min(760px, calc(100vw - 32px))",
    maxHeight: "min(620px, calc(100vh - 120px))",
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr) auto",
    border: `1px solid ${tokens.colors.ruleStrong}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    boxShadow: tokens.shadows.none,
    overflow: "hidden",
  },
  cabecera: {
    minHeight: "52px",
    display: "grid",
    gridTemplateColumns: "auto minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "12px",
    padding: "0 22px",
    borderBottom: `1px solid ${tokens.colors.rule}`,
  },
  headerKbd: {
    color: tokens.colors.crimson,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    letterSpacing: tokens.typography.ls.kbd,
    border: `1px solid ${tokens.colors.rule}`,
    padding: "2px 5px",
  },
  input: {
    width: "100%",
    height: "50px",
    border: 0,
    padding: 0,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs22}px`,
    fontWeight: tokens.typography.weights.regular,
    outline: "none",
    color: tokens.colors.ink,
    background: tokens.colors.paper,
  },
  escape: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    letterSpacing: tokens.typography.ls.kbd,
    textTransform: "uppercase",
  },
  // M-1 (auditoría UX 2026-06-12): una sola columna a lo ancho del modal —
  // las 3 columnas de 220px truncaban los labels («Abrir como pe…») en el
  // surface del power user. El verbo y el objeto no se truncan jamás.
  lista: {
    display: "grid",
    gridTemplateColumns: "1fr",
    alignContent: "start",
    gap: 0,
    padding: 0,
    overflowY: "auto",
  },
  seccion: {
    minHeight: 0,
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr)",
    alignContent: "start",
    borderBottom: `1px dotted ${tokens.colors.rule}`,
    padding: "12px 12px 10px",
  },
  // M-1: con query la lista es plana — sin header de sección ni borde.
  seccionPlana: {
    minHeight: 0,
    display: "grid",
    alignContent: "start",
    padding: "8px 12px 10px",
  },
  seccionTitulo: {
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.sans,
    fontSize: `${tokens.typography.fs.fs10}px`,
    fontWeight: tokens.typography.weights.semibold,
    letterSpacing: tokens.typography.ls.section,
    marginBottom: "8px",
  },
  seccionItems: {
    display: "grid",
    alignContent: "start",
    gap: "2px",
    minWidth: 0,
    minHeight: 0,
    overflowY: "auto",
  },
  seccionVacia: {
    padding: "7px 10px",
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
  },
  item: {
    width: "100%",
    minHeight: "42px",
    border: 0,
    borderLeft: "2px solid transparent",
    background: "transparent",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "8px",
    alignItems: "center",
    padding: "7px 8px",
    textAlign: "left",
    cursor: "pointer",
    transition: `background ${tokens.transitions.slow}, border-color ${tokens.transitions.slow}`,
  },
  itemActivo: {
    width: "100%",
    minHeight: "42px",
    border: 0,
    borderLeft: `2px solid ${tokens.colors.crimson}`,
    background: tokens.colors.paperWarm,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "8px",
    alignItems: "center",
    padding: "7px 8px 7px 14px",
    textAlign: "left",
    cursor: "pointer",
    transition: `background ${tokens.transitions.slow}, border-color ${tokens.transitions.slow}`,
  },
  itemTextos: { display: "grid", minWidth: 0, gap: "2px" },
  // M-1: el label NUNCA se trunca — a una columna hay ancho de sobra.
  itemLabel: { color: tokens.colors.ink, fontFamily: tokens.typography.serif, fontSize: `${tokens.typography.fs.fs13}px`, fontWeight: tokens.typography.weights.regular },
  itemDescripcion: { color: tokens.colors.inkMid, fontFamily: tokens.typography.sans, fontSize: `${tokens.typography.fs.fs11}px`, fontWeight: tokens.typography.weights.regular, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemMeta: { display: "inline-flex", alignItems: "center", gap: "8px", justifySelf: "end" },
  atajo: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "28px",
    padding: "2px 5px",
    border: `1px solid ${tokens.colors.rule}`,
    background: tokens.colors.paper,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    fontWeight: tokens.typography.weights.regular,
    letterSpacing: tokens.typography.ls.kbd,
  },
  categoria: { color: tokens.colors.inkSoft, fontFamily: tokens.typography.sans, fontSize: `${tokens.typography.fs.fs9}px`, fontWeight: tokens.typography.weights.regular, textTransform: "uppercase", letterSpacing: tokens.typography.ls.mark },
  footer: {
    minHeight: "38px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "0 22px",
    borderTop: `1px solid ${tokens.colors.rule}`,
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    letterSpacing: tokens.typography.ls.kbd,
  },
  footerSep: {
    color: tokens.colors.inkFaint,
    fontFamily: tokens.typography.serif,
    letterSpacing: 0,
  },
  empty: { padding: "20px 22px", color: tokens.colors.inkSoft, fontFamily: tokens.typography.serif, fontSize: `${tokens.typography.fs.fs13}px`, fontStyle: "italic", gridColumn: "1 / -1" },
} satisfies Record<string, preact.JSX.CSSProperties>;
