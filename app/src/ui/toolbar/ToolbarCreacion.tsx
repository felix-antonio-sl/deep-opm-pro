/**
 * ViewContainer ToolbarCreacion: modo creacion y enlace. [JOYAS §1-3], [V-0c], [Glos 3.x], IFML H-10.
 *
 * Ronda 15 L2: el toggle Grid queda visible porque es accion frecuente. El
 * boton "Config grid" tambien queda en banda por compatibilidad con tests
 * legacy (testId `config-grid`); ademas se replica en el menu ⋯ Más como
 * ruta secundaria de discoverability con etiqueta "Configurar grid…".
 */
import { useMemo, useState } from "preact/hooks";
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

  const origenMenuTipo = useMemo(() => seleccionId ?? seleccionados.find((id) => !!modelo.entidades[id]) ?? null, [modelo.entidades, seleccionId, seleccionados]);
  const destinoMenuTipo = useMemo(() => seleccionados.find((id) => id !== origenMenuTipo && !!modelo.entidades[id]) ?? null, [modelo.entidades, origenMenuTipo, seleccionados]);
  const selectorEnlaceDeshabilitado = !origenMenuTipo && !modoEnlace;

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
      <span style={style.divider} />
      <label style={style.linkPicker}>
        <span style={style.linkPickerLabel}>Enlace</span>
        <select aria-label="Tipo de enlace" title={selectorEnlaceDeshabilitado ? "Selecciona una entidad origen" : undefined} disabled={selectorEnlaceDeshabilitado} style={selectorEnlaceDeshabilitado ? style.disabledSelect : modoEnlace ? style.activeSelect : style.select} value={modoEnlace?.tipo ?? ""} onChange={handleCambiarTipoEnlace}>
          <option value="">Tipo...</option>
          {TIPOS_ENLACE.map((item) => <option key={item.tipo} value={item.tipo}>{item.label}</option>)}
        </select>
      </label>
      {modoEnlace ? <button style={style.secondaryButton} type="button" onClick={cancelarEnlace} title="Cancelar creación de enlace">Cancelar</button> : null}
      <button style={menuTiposAbierto ? style.activeButton : selectorEnlaceDeshabilitado ? style.disabledButton : style.button} type="button" onClick={handleToggleTiposValidos} disabled={selectorEnlaceDeshabilitado} data-testid="abrir-menu-tipo-enlace" title={selectorEnlaceDeshabilitado ? "Selecciona una entidad origen" : "Tipos válidos · sugerencias OPL para origen/destino"}>
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
      <button style={gridConfig.activa ? style.activeButton : style.button} type="button" onClick={toggleGrid} aria-pressed={gridConfig.activa} data-testid="toggle-grid" title={gridConfig.activa ? "Grid activa · clic para ocultar" : "Mostrar grid del canvas"}>Grid</button>
      <button style={style.secondaryButton} type="button" onClick={handleAbrirGridConfig} data-testid="config-grid" title="Configurar paso, color y snap del grid">Config grid</button>
      {/* Ronda 15 L4: layout sugerido como accion explicita. No persiste */}
      {/* automaticamente al cargar; cada clic crea una entrada undo atomica. */}
      <button style={style.button} type="button" onClick={aplicarLayoutSugerido} data-testid="toolbar-aplicar-layout" title="Sugerir layout · reorganiza apariencias del OPD activo en niveles top-down. Undoable con Ctrl+Z.">Sugerir layout</button>
      <ModalConfiguracionGrid abierto={gridModalAbierto} config={gridConfig} onCerrar={handleCerrarGridConfig} onGuardar={fijarGridConfig} />
      {bibliotecaAbierta ? <BibliotecaCosa modelo={modelo} opdActivoId={opdActivoId} onCerrar={() => setBibliotecaAbierta(false)} onNavegarOpd={cambiarOpdActivo} /> : null}
      {menuTiposAbierto ? <MenuTipoEnlace modelo={modelo} origenId={origenMenuTipo} destinoId={destinoMenuTipo} direccion={direccionTipoEnlace} onDireccion={setDireccionTipoEnlace} onElegir={handleElegirTipoValido} /> : null}
    </>
  );
}
