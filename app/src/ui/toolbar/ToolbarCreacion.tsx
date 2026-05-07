/**
 * ViewContainer ToolbarCreacion: modo creacion y enlace. [JOYAS §1-3], [V-0c], [Glos 3.x], IFML H-10.
 *
 * Ronda 15 L2: el toggle Grid queda visible porque es accion frecuente. El
 * boton "Config grid" tambien queda en banda por compatibilidad con tests
 * legacy (testId `config-grid`); ademas se replica en el menu ⋯ Más como
 * ruta secundaria de discoverability con etiqueta "Configurar grid…".
 *
 * Ronda 18 L1 P3: cluster Enlace + cluster Vista. La etiqueta visual
 * "Enlace" se removió porque el placeholder del select ("Tipo de enlace…")
 * ya transmite la intención. "Sugerir layout" se renombró a "Auto-layout"
 * (ahorra ~6 chars y deja de truncarse en viewport ~1280). El testId
 * `toolbar-aplicar-layout` se preserva.
 */
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { normalizarGridConfig } from "../../canvas/grid";
import type { Id, TipoEnlace } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { BibliotecaCosa } from "../BibliotecaCosa";
import { MenuTipoEnlace } from "../MenuTipoEnlace";
import { ModalConfiguracionGrid } from "../ModalConfiguracionGrid";
import { toolbarStyle as style } from "./toolbarStyles";

/**
 * ViewContainer ToolbarCreacion: activacion de creacion y controles derivados. [JOYAS §1-3], [V-0c].
 * IFML H-10: selector de enlace y "Tipos validos" comparten el mismo guard.
 */
export const TIPOS_ENLACE: Array<{ tipo: TipoEnlace; label: string }> = [
  { tipo: "agregacion", label: "Agregación" },
  { tipo: "exhibicion", label: "Exhibición" },
  { tipo: "generalizacion", label: "Generalización" },
  { tipo: "clasificacion", label: "Clasificación" },
  { tipo: "agente", label: "Agente" },
  { tipo: "instrumento", label: "Instrumento" },
  { tipo: "consumo", label: "Consumo" },
  { tipo: "resultado", label: "Resultado" },
  { tipo: "efecto", label: "Efecto" },
  { tipo: "invocacion", label: "Invocación" },
];

export function ToolbarCreacion() {
  const elegirTipoEnlace = useOpmStore((s) => s.elegirTipoEnlace);
  const cancelarEnlace = useOpmStore((s) => s.cancelarEnlace);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const fijarModoCreacion = useOpmStore((s) => s.fijarModoCreacion);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const cambiarOpdActivo = useOpmStore((s) => s.cambiarOpdActivo);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);
  const aplicarLayoutSugerido = useOpmStore((s) => s.aplicarLayoutSugerido);
  const gridConfig = useOpmStore((s) => normalizarGridConfig(s.gridConfig ?? s.indice.preferenciasUi?.gridConfig));
  const toggleGrid = useOpmStore((s) => s.toggleGrid);
  const fijarGridConfig = useOpmStore((s) => s.fijarGridConfig);
  const [gridModalAbierto, setGridModalAbierto] = useState(false);
  const [bibliotecaAbierta, setBibliotecaAbierta] = useState(false);
  const [menuTiposAbierto, setMenuTiposAbierto] = useState(false);
  const [direccionTipoEnlace, setDireccionTipoEnlace] = useState<"saliente" | "entrante">("saliente");
  const triggerTiposRef = useRef<HTMLButtonElement | null>(null);
  const menuTiposRef = useRef<HTMLDivElement | null>(null);
  const menuTiposAbiertoRef = useRef(false);
  menuTiposAbiertoRef.current = menuTiposAbierto;

  const origenMenuTipo = useMemo(() => seleccionId ?? seleccionados.find((id) => !!modelo.entidades[id]) ?? null, [modelo.entidades, seleccionId, seleccionados]);
  const destinoMenuTipo = useMemo(() => seleccionados.find((id) => id !== origenMenuTipo && !!modelo.entidades[id]) ?? null, [modelo.entidades, origenMenuTipo, seleccionados]);
  const selectorEnlaceDeshabilitado = !origenMenuTipo && !modoEnlace;
  const estiloBotonTipos = selectorEnlaceDeshabilitado
    ? style.disabledButton
    : menuTiposAbierto
      ? style.activeButton
      : style.button;

  useEffect(() => {
    if (selectorEnlaceDeshabilitado) setMenuTiposAbierto(false);
  }, [selectorEnlaceDeshabilitado]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (!menuTiposAbiertoRef.current) return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      setMenuTiposAbierto(false);
      triggerTiposRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!menuTiposAbiertoRef.current) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuTiposRef.current?.contains(target)) return;
      if (triggerTiposRef.current?.contains(target)) return;
      setMenuTiposAbierto(false);
    }
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, []);

  function handleCambiarTipoEnlace(event: Event) {
    const tipo = (event.currentTarget as HTMLSelectElement).value;
    if (tipo) elegirTipoEnlace(tipo as TipoEnlace);
    else cancelarEnlace();
  }
  function handleToggleTiposValidos() {
    if (selectorEnlaceDeshabilitado) return;
    setMenuTiposAbierto((actual) => !actual);
  }
  function handleElegirTipoValido(tipo: TipoEnlace, origenId: Id, destinoId: Id) {
    crearEnlaceEntreEntidades(origenId, destinoId, tipo);
    setMenuTiposAbierto(false);
  }
  function handleCancelarCreacion() {
    fijarModoCreacion(null);
  }
  function handleAbrirGridConfig() {
    setGridModalAbierto(true);
  }
  function handleCerrarGridConfig() {
    setGridModalAbierto(false);
  }

  return (
    <>
      {/* Cluster Enlace */}
      <label style={style.linkPicker}>
        <select aria-label="Tipo de enlace" title={selectorEnlaceDeshabilitado ? "Selecciona una entidad origen" : undefined} disabled={selectorEnlaceDeshabilitado} style={selectorEnlaceDeshabilitado ? style.disabledSelect : modoEnlace ? style.activeSelect : style.select} value={modoEnlace?.tipo ?? ""} onChange={handleCambiarTipoEnlace}>
          <option value="">Tipo de enlace…</option>
          {TIPOS_ENLACE.map((item) => <option key={item.tipo} value={item.tipo}>{item.label}</option>)}
        </select>
      </label>
      {modoEnlace ? <button style={style.secondaryButton} type="button" onClick={cancelarEnlace} title="Cancelar creación de enlace">Cancelar</button> : null}
      <button ref={triggerTiposRef} style={estiloBotonTipos} type="button" onClick={handleToggleTiposValidos} disabled={selectorEnlaceDeshabilitado} aria-haspopup="dialog" aria-expanded={menuTiposAbierto} data-testid="abrir-menu-tipo-enlace" title={selectorEnlaceDeshabilitado ? "Selecciona una entidad origen" : "Tipos válidos · sugerencias OPL para origen/destino"}>
        Tipos válidos
      </button>
      <button style={bibliotecaAbierta ? style.activeButton : style.button} type="button" onClick={() => setBibliotecaAbierta((actual) => !actual)} data-testid="abrir-biblioteca-cosa" title="Biblioteca de cosas · arrastra al canvas para reusar">Biblioteca</button>
      {modoCreacion ? (
        <>
          <span style={style.stickyBadge} data-testid="indicador-modo-sticky">Modo sticky: {modoCreacion === "objeto" ? "Objeto" : "Proceso"}</span>
          <button style={style.secondaryButton} type="button" onClick={handleCancelarCreacion} title="Salir del modo creación sticky">Cancelar creación</button>
        </>
      ) : null}
      <span style={style.divider} />
      {/* Cluster Vista */}
      <button style={gridConfig.activa ? style.activeButton : style.button} type="button" onClick={toggleGrid} aria-pressed={gridConfig.activa} data-testid="toggle-grid" title={gridConfig.activa ? "Grid activa · clic para ocultar" : "Mostrar grid del canvas"}>Grid</button>
      {/* Ronda 18 P3: `Config grid` se mantiene en banda. Decisión documentada
          en commit: 3 smokes (08, 11) hacen `getByTestId("config-grid").click()`
          directamente sin abrir el menú ⋯ Más, así que el en-banda es
          load-bearing. El menú "Más" lo espeja con `toolbar-mas-config-grid`. */}
      <button style={style.secondaryButton} type="button" onClick={handleAbrirGridConfig} data-testid="config-grid" title="Configurar paso, color y snap del grid">Config grid</button>
      {/* Ronda 15 L4: layout sugerido como accion explicita. No persiste */}
      {/* automaticamente al cargar; cada clic crea una entrada undo atomica. */}
      <button style={style.button} type="button" onClick={aplicarLayoutSugerido} data-testid="toolbar-aplicar-layout" title="Auto-layout · reorganiza apariencias del OPD activo en niveles top-down. Undoable con Ctrl+Z.">Auto-layout</button>
      <ModalConfiguracionGrid abierto={gridModalAbierto} config={gridConfig} onCerrar={handleCerrarGridConfig} onGuardar={fijarGridConfig} />
      {bibliotecaAbierta ? <BibliotecaCosa modelo={modelo} opdActivoId={opdActivoId} onCerrar={() => setBibliotecaAbierta(false)} onNavegarOpd={cambiarOpdActivo} /> : null}
      {menuTiposAbierto ? (
        <div ref={menuTiposRef}>
          <MenuTipoEnlace modelo={modelo} origenId={origenMenuTipo} destinoId={destinoMenuTipo} direccion={direccionTipoEnlace} onDireccion={setDireccionTipoEnlace} onElegir={handleElegirTipoValido} />
        </div>
      ) : null}
    </>
  );
}
