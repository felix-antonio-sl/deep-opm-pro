import { useEffect, useRef, useState } from "preact/hooks";
import { useCommandPaletteViewModel } from "../app/viewmodels/commandPaletteViewModel";
import type { AccionContextual, AccionContextualId } from "../store/acciones-contextuales";
import { accionesContextualesEntidad, accionesParaSuperficie } from "../store/acciones-contextuales";
import { formatearCombo, listarAtajos, type RegistroAtajo } from "./atajosTeclado";
import { primerEnlaceVisualDeEntidad } from "./BarraHerramientasElemento";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
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
          placeholder="Buscar acciones..."
          style={style.input}
        />
        <div id="command-palette-list" role="listbox" style={style.lista}>
          {items.length === 0 ? (
            <div style={style.empty}>Sin resultados</div>
          ) : items.map((item, index) => {
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
                  {item.atajo ? <span style={style.atajo}>{formatearCombo(item.atajo)}</span> : null}
                  <span style={style.categoria}>{item.categoria}</span>
                </span>
              </button>
            );
          })}
        </div>
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
  return items.filter((item) => terminos.every((termino) => item.textoBusqueda.includes(termino)));
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
 * Estilos del CommandPalette — Ronda 28 L2 (Bauhaus monocromática).
 *
 *   - Dialogo modal: borde 1.5px ink, sombra plana 12 12 0 ink-15.
 *   - Sin border-radius (Bauhaus rechaza esquinas redondas en chrome).
 *   - Input: borderless con borderBottom 1.5px ink, mono = Inter Tight.
 *   - Item activo: barra lateral 2px cinabrio + fondo ink-04. La barra
 *     comunica el cursor sin tinte azul, en línea con el brief L2.
 *   - Atajo: kbd con borde ink-30, mono JetBrains.
 *   - Categoria: utility class `.opm-label-uppercase` (uppercase tracking).
 */
const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
    display: "grid",
    placeItems: "start center",
    paddingTop: "88px",
    // Backdrop ink semitransparente (no slate azul). Cumple el contraste
    // sin teñir el fondo del dialogo.
    background: "rgb(10 10 10 / 0.32)",
  },
  dialogo: {
    width: "min(720px, calc(100vw - 32px))",
    maxHeight: "min(680px, calc(100vh - 120px))",
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr)",
    border: `1.5px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
    boxShadow: `12px 12px 0 0 ${tokens.colors.ink15}`,
    overflow: "hidden",
  },
  input: {
    width: "100%",
    height: "52px",
    border: 0,
    borderBottom: `1.5px solid ${tokens.colors.ink}`,
    padding: "0 18px",
    fontFamily: tokens.typography.fontFamily,
    fontSize: `${tokens.typography.sizes.lg}px`,
    fontWeight: tokens.typography.weights.medium,
    outline: "none",
    color: tokens.colors.ink,
    background: tokens.colors.paper,
  },
  lista: {
    display: "grid",
    gap: "0",
    padding: "8px",
    overflowY: "auto",
  },
  item: {
    width: "100%",
    minHeight: "52px",
    border: 0,
    background: "transparent",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "12px",
    alignItems: "center",
    padding: "8px 12px",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 150ms ease-out",
  },
  itemActivo: {
    width: "100%",
    minHeight: "52px",
    border: 0,
    background: tokens.colors.ink04,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "12px",
    alignItems: "center",
    padding: "8px 12px",
    textAlign: "left",
    cursor: "pointer",
    boxShadow: `inset 2px 0 0 0 ${tokens.colors.accent}`,
  },
  itemTextos: { display: "grid", minWidth: 0, gap: "2px" },
  itemLabel: { color: tokens.colors.ink, fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.base}px`, fontWeight: tokens.typography.weights.semibold, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemDescripcion: { color: tokens.colors.ink70, fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.sm}px`, fontWeight: tokens.typography.weights.normal, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemMeta: { display: "inline-flex", alignItems: "center", gap: "10px", justifySelf: "end" },
  atajo: {
    minWidth: "42px",
    height: "22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 6px",
    border: `1px solid ${tokens.colors.ink30}`,
    background: tokens.colors.paper,
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: `${tokens.typography.sizes.xs}px`,
    fontWeight: tokens.typography.weights.medium,
    letterSpacing: 0,
  },
  categoria: { color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.xxs}px`, fontWeight: tokens.typography.weights.medium, textTransform: "uppercase", letterSpacing: "0.08em" },
  empty: { padding: "20px 14px", color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamily, fontSize: `${tokens.typography.sizes.base}px`, fontWeight: tokens.typography.weights.medium },
} satisfies Record<string, preact.JSX.CSSProperties>;
