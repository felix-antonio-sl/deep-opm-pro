import { useEffect, useRef, useState } from "preact/hooks";
import type { AccionContextual, AccionContextualId } from "../store/acciones-contextuales";
import { accionesContextualesEntidad, accionesParaSuperficie } from "../store/acciones-contextuales";
import { useOpmStore } from "../store";
import { formatearCombo, listarAtajos, type RegistroAtajo } from "./atajosTeclado";
import { primerEnlaceVisualDeEntidad } from "./BarraHerramientasElemento";
import { ejecutarAccionContextualEntidad } from "./ejecutarAccionContextual";
import { tokens } from "./tokens";

interface Props {
  abierto: boolean;
  onCerrar: () => void;
}

export interface CommandPaletteItem {
  id: string;
  tipo: "atajo" | "accion-contextual";
  label: string;
  descripcion: string;
  categoria: string;
  textoBusqueda: string;
  atajo?: string;
  registroIndex?: number;
  accionId?: AccionContextualId;
}

export function CommandPalette({ abierto, onCerrar }: Props) {
  const [query, setQuery] = useState("");
  const [activo, setActivo] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceEstiloPortapapeles = useOpmStore((s) => s.enlaceEstiloPortapapeles);
  const seleccionados = useOpmStore((s) => s.seleccionados);

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
  const registros = listarAtajos();
  const items = filtrarItemsCommandPalette(
    construirItemsCommandPalette(registros, accionesContextuales),
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
    if (activo >= items.length) setActivo(Math.max(0, items.length - 1));
  }, [activo, items.length]);

  if (!abierto) return null;

  const ejecutar = (item: CommandPaletteItem | null) => {
    if (!item) return;
    if (item.tipo === "atajo") {
      const registro = item.registroIndex !== undefined ? registros[item.registroIndex] : undefined;
      registro?.handler(new KeyboardEvent("keydown"));
    } else if (item.accionId) {
      ejecutarAccionContextualEntidad(item.accionId, {
        onEditarAlias: () => enfocarSeccionInspector("inspector-seccion-alias"),
      });
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
): CommandPaletteItem[] {
  const itemsAtajos = registros.map((registro, index) => {
    const label = registro.etiqueta ?? registro.descripcion;
    const descripcion = registro.descripcionLarga ?? registro.descripcion;
    return {
      id: `atajo-${index}-${normalizarTextoBusqueda(registro.ctx)}-${normalizarTextoBusqueda(registro.combo)}`,
      tipo: "atajo" as const,
      label,
      descripcion,
      categoria: registro.categoria,
      atajo: registro.combo,
      registroIndex: index,
      textoBusqueda: textoBusqueda([label, descripcion, registro.categoria, registro.combo, registro.ctx]),
    };
  });
  const itemsAcciones = acciones.map((accion) => ({
    id: `accion-${accion.id}`,
    tipo: "accion-contextual" as const,
    label: accion.label,
    descripcion: accion.label,
    categoria: accion.categoria,
    ...(accion.atajo ? { atajo: accion.atajo } : {}),
    accionId: accion.id,
    textoBusqueda: textoBusqueda([accion.label, accion.categoria, accion.atajo ?? ""]),
  }));
  return [...itemsAcciones, ...itemsAtajos].sort((a, b) => {
    const categoria = a.categoria.localeCompare(b.categoria, "es");
    return categoria === 0 ? a.label.localeCompare(b.label, "es") : categoria;
  });
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

const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 90,
    display: "grid",
    placeItems: "start center",
    paddingTop: "88px",
    background: "rgb(15 23 42 / 0.18)",
  },
  dialogo: {
    width: "min(720px, calc(100vw - 32px))",
    maxHeight: "min(680px, calc(100vh - 120px))",
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr)",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.lg,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.modal,
    overflow: "hidden",
  },
  input: {
    width: "100%",
    height: "46px",
    border: 0,
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    padding: "0 16px",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "15px",
    fontWeight: 600,
    outline: "none",
    color: tokens.colors.textoPrimario,
  },
  lista: {
    display: "grid",
    gap: "2px",
    padding: "8px",
    overflowY: "auto",
  },
  item: {
    width: "100%",
    minHeight: "48px",
    border: 0,
    borderRadius: tokens.radii.sm,
    background: "transparent",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "12px",
    alignItems: "center",
    padding: "7px 10px",
    textAlign: "left",
    cursor: "pointer",
  },
  itemActivo: {
    width: "100%",
    minHeight: "48px",
    border: 0,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.acentoUiSuave,
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "12px",
    alignItems: "center",
    padding: "7px 10px",
    textAlign: "left",
    cursor: "pointer",
  },
  itemTextos: { display: "grid", minWidth: 0, gap: "2px" },
  itemLabel: { color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemDescripcion: { color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  itemMeta: { display: "inline-flex", alignItems: "center", gap: "8px", justifySelf: "end" },
  atajo: {
    minWidth: "42px",
    height: "22px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 6px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoSecundario,
    background: tokens.colors.fondoNeutral,
    fontSize: "11px",
    fontWeight: 700,
  },
  categoria: { color: tokens.colors.textoTerciario, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" },
  empty: { padding: "18px 12px", color: tokens.colors.textoSecundario, fontSize: "13px", fontWeight: 600 },
} satisfies Record<string, preact.JSX.CSSProperties>;
