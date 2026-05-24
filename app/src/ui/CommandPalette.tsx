import { useEffect, useRef, useState } from "preact/hooks";
import { useCommandPaletteViewModel } from "../app/viewmodels/commandPaletteViewModel";
import type { AccionContextual, AccionContextualId } from "../store/acciones-contextuales";
import { accionesContextualesEntidad, accionesParaSuperficie } from "../store/acciones-contextuales";
import { listarAtajos, type RegistroAtajo } from "./atajosTeclado";
import { primerEnlaceVisualDeEntidad } from "./BarraHerramientasElemento";
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

export const SECCIONES_COMMAND_PALETTE = ["MODELO", "CREAR", "NAVEGAR", "EXPORTAR", "VISTA", "ASISTENTE"] as const;

export type CommandPaletteSeccion = (typeof SECCIONES_COMMAND_PALETTE)[number];

export interface CommandPaletteGrupo {
  seccion: CommandPaletteSeccion;
  items: CommandPaletteItem[];
}

const seccionesPorAccionMenu: Readonly<Record<string, CommandPaletteSeccion>> = {
  "nuevo-modelo": "MODELO",
  "abrir-importar": "MODELO",
  "guardar-como": "MODELO",
  configuracion: "MODELO",
  "guardar-plantilla": "MODELO",
  plantillas: "MODELO",
  "versiones-modelo": "MODELO",
  "exportar-json": "EXPORTAR",
  "simulacion-conceptual": "VISTA",
  "grid-canvas": "VISTA",
  "auto-layout": "VISTA",
  "tabla-enlaces": "VISTA",
  "atajos-teclado": "VISTA",
};

export function CommandPalette({ abierto, onCerrar }: Props) {
  const [query, setQuery] = useState("");
  const [activo, setActivo] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const confirmarSiDirty = useConfirmarSiDirty();
  const {
    modelo,
    opdActivoId,
    seleccionId,
    enlaceEstiloPortapapeles,
    seleccionados,
    nuevoModelo,
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
    abrirDialogoGuardarPlantilla,
    abrirDialogoPlantillas,
    abrirDialogoVersiones,
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
  } = useCommandPaletteViewModel();

  const entidad = seleccionId ? modelo.entidades[seleccionId] ?? null : null;
  const enlaceEstiloId = entidad ? primerEnlaceVisualDeEntidad(modelo, opdActivoId, entidad.id) : null;
  const accionesContextuales = accionesParaSuperficie(
    accionesContextualesEntidad({
      entidad,
      enlaceEstiloId,
      hayEstiloEnPortapapeles: !!enlaceEstiloPortapapeles,
      inspectorAbierto: true,
      multi: seleccionados.length >= 2,
    }),
    "command-palette",
  ).filter((accion) => accion.enabled);
  const accionesMenu = construirAccionesMenuCommandPalette({
    nuevoModelo: () => confirmarSiDirty(nuevoModelo),
    abrirCargarModelo,
    abrirGuardarComo,
    abrirDialogoConfiguracion,
    abrirDialogoGuardarPlantilla,
    abrirDialogoPlantillas,
    abrirDialogoVersiones: modeloPersistidoId ? () => abrirDialogoVersiones(modeloPersistidoId) : null,
    modeloPersistidoId,
    toggleGrid,
    gridActiva: gridConfig.activa,
    aplicarLayoutSugerido,
    iniciarModoSimulacion,
    abrirTablaEnlaces,
    abrirCheatsheetAtajos,
    exportarJson: exportarJsonAlPortapapeles,
  });
  const registros = listarAtajos();
  const items = filtrarItemsCommandPalette(
    construirItemsCommandPalette(registros, accionesContextuales, accionesMenu, frecuenciaUso),
    query,
  ).slice(0, 60);
  const grupos = agruparItemsCommandPalette(items);
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
            <div style={style.empty}>sin resultados {GLIFO_VACIO} {GLIFO_CMD}. para registrar acción</div>
          ) : grupos.map((grupo) => (
            <section
              key={grupo.seccion}
              aria-label={grupo.seccion}
              data-testid={`command-palette-section-${grupo.seccion.toLowerCase()}`}
              style={style.seccion}
            >
              <div style={style.seccionTitulo}>{grupo.seccion}</div>
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
                        <span style={style.itemDescripcion}>{item.descripcion}</span>
                      </span>
                      <span style={style.itemMeta}>
                        {item.atajo ? <span style={style.atajo}>{formatearComboCodex(item.atajo)}</span> : null}
                        <span style={style.categoria}>{item.categoria}</span>
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
          <span>{GLIFO_CMD}. ayuda</span>
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
  // Ronda23 L1 #3: dedup palette por (combo + label). Si un mismo atajo se
  // registra en varios contextos (p.ej. Ctrl+D en `global` y `panel-arbol`
  // para abrir gestión del árbol OPD) muestra una sola fila en el buscador.
  // El handler real sigue arbitrado por `registroAplicable` segun foco.
  const atajosVistos = new Set<string>();
  const itemsAtajos = registros.flatMap((registro, index) => {
    const label = registro.etiqueta ?? registro.descripcion;
    const descripcion = registro.descripcionLarga ?? registro.descripcion;
    const clave = `${registro.combo}|${label}`;
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
  const itemsMenu = accionesMenu
    .filter((accion) => accion.enabled !== false)
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

interface AccionesMenuCommandPaletteDeps {
  nuevoModelo: () => void;
  abrirCargarModelo: () => void;
  abrirGuardarComo: () => void;
  abrirDialogoConfiguracion: () => void;
  abrirDialogoGuardarPlantilla: () => void;
  abrirDialogoPlantillas: () => void;
  abrirDialogoVersiones: (() => void) | null;
  modeloPersistidoId: string | null;
  toggleGrid: () => void;
  gridActiva: boolean;
  aplicarLayoutSugerido: () => void;
  iniciarModoSimulacion: () => void;
  abrirTablaEnlaces: () => void;
  abrirCheatsheetAtajos: () => void;
  exportarJson: () => void;
}

function construirAccionesMenuCommandPalette(deps: AccionesMenuCommandPaletteDeps): CommandPaletteMenuAction[] {
  return [
    { id: "nuevo-modelo", label: "Nuevo modelo", descripcion: "Crear un modelo vacío", categoria: "archivo", run: deps.nuevoModelo },
    { id: "abrir-importar", label: "Abrir / importar modelo", descripcion: "Abrir modelos guardados, archivados, ejemplos o JSON", categoria: "archivo", run: deps.abrirCargarModelo },
    { id: "guardar-como", label: "Guardar como", descripcion: "Guardar una copia editable del modelo", categoria: "archivo", run: deps.abrirGuardarComo },
    { id: "configuracion", label: "Configuración", descripcion: "Renombrar modelo y ajustar cuadrícula", categoria: "archivo", run: deps.abrirDialogoConfiguracion },
    { id: "guardar-plantilla", label: "Guardar como plantilla", descripcion: "Crear una plantilla privada desde la selección", categoria: "archivo", run: deps.abrirDialogoGuardarPlantilla },
    { id: "plantillas", label: "Plantillas", descripcion: "Abrir el catálogo de plantillas privadas", categoria: "archivo", run: deps.abrirDialogoPlantillas },
    { id: "versiones-modelo", label: "Versiones del modelo", descripcion: "Abrir el historial de versiones del modelo", categoria: "archivo", enabled: !!deps.abrirDialogoVersiones, run: deps.abrirDialogoVersiones ?? (() => {}) },
    { id: "exportar-json", label: "Exportar JSON al portapapeles", descripcion: "Copiar el JSON OPM actual al portapapeles", categoria: "archivo", run: deps.exportarJson },
    { id: "simulacion-conceptual", label: "Simulación conceptual", descripcion: "Entrar al modo de simulación del modelo", categoria: "vista", run: deps.iniciarModoSimulacion },
    { id: "grid-canvas", label: deps.gridActiva ? "Ocultar cuadrícula del canvas" : "Mostrar cuadrícula del canvas", descripcion: "Alternar la cuadrícula visual del canvas", categoria: "vista", run: deps.toggleGrid },
    { id: "auto-layout", label: "Auto-layout", descripcion: "Aplicar layout sugerido al OPD activo", categoria: "vista", run: deps.aplicarLayoutSugerido },
    { id: "tabla-enlaces", label: "Tabla de enlaces", descripcion: "Abrir la tabla de enlaces del modelo", categoria: "vista", run: deps.abrirTablaEnlaces },
    { id: "atajos-teclado", label: "Atajos de teclado", descripcion: "Mostrar la referencia de atajos registrados", categoria: "navegacion", run: deps.abrirCheatsheetAtajos },
  ];
}

export function filtrarItemsCommandPalette(items: readonly CommandPaletteItem[], query: string): CommandPaletteItem[] {
  const terminos = normalizarTextoBusqueda(query).split(" ").filter(Boolean);
  if (terminos.length === 0) return [...items];
  return items.filter((item) => {
    const texto = `${item.textoBusqueda} ${normalizarTextoBusqueda(seccionVisualCommandPalette(item))}`;
    return terminos.every((termino) => texto.includes(termino));
  });
}

export function agruparItemsCommandPalette(items: readonly CommandPaletteItem[]): CommandPaletteGrupo[] {
  const grupos = new Map<CommandPaletteSeccion, CommandPaletteItem[]>(
    SECCIONES_COMMAND_PALETTE.map((seccion) => [seccion, []]),
  );
  for (const item of items) {
    grupos.get(seccionVisualCommandPalette(item))?.push(item);
  }
  return SECCIONES_COMMAND_PALETTE.map((seccion) => ({
    seccion,
    items: grupos.get(seccion) ?? [],
  }));
}

export function seccionVisualCommandPalette(item: CommandPaletteItem): CommandPaletteSeccion {
  const seccionMenu = item.menuActionId ? seccionesPorAccionMenu[item.menuActionId] : undefined;
  if (seccionMenu) return seccionMenu;
  const texto = normalizarTextoBusqueda([item.label, item.descripcion, item.categoria, item.menuActionId ?? ""].join(" "));
  if (texto.includes("asistente")) return "ASISTENTE";
  if (texto.includes("export") || texto.includes("json") || texto.includes("svg") || texto.includes("html")) return "EXPORTAR";
  if (item.categoria === "archivo") return "MODELO";
  if (item.categoria === "navegacion") return "NAVEGAR";
  if (item.categoria === "vista") return "VISTA";
  if (
    texto.includes("crear")
    || texto.includes("nuevo objeto")
    || texto.includes("nuevo proceso")
    || texto.includes("nuevo estado")
    || texto.includes("nueva relacion")
    || texto.includes("nuevo opd")
    || texto.includes("descomponer")
    || texto.includes("desplegar")
    || texto.includes("refinamiento")
    || item.categoria === "edicion"
    || item.categoria === "seleccion"
  ) return "CREAR";
  return "VISTA";
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
 * Backdrop paper+blur, grilla editorial de seis secciones y cursor con rail
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
  lista: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gridAutoRows: "minmax(0, 1fr)",
    alignContent: "stretch",
    gap: 0,
    padding: 0,
    overflow: "hidden",
  },
  seccion: {
    minHeight: 0,
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr)",
    alignContent: "start",
    borderRight: `1px dotted ${tokens.colors.rule}`,
    borderBottom: `1px dotted ${tokens.colors.rule}`,
    padding: "12px 12px 10px",
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
  itemLabel: { color: tokens.colors.ink, fontFamily: tokens.typography.serif, fontSize: `${tokens.typography.fs.fs13}px`, fontWeight: tokens.typography.weights.regular, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
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
