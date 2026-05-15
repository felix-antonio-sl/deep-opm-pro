/**
 * ViewContainer ToolbarCreacion: modo creacion y enlace. [JOYAS §1-3], [V-0c], [Glos 3.x], IFML H-10.
 *
 * Ronda 19 L1: queda acotado al cluster Conectar. Los controles de Vista
 * viven en ToolbarBase para exponer la intención como group propio.
 */
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Id, TipoEnlace } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { MenuTipoEnlace, TIPOS_ENLACE_MENU } from "../MenuTipoEnlace";
import { toolbarStyle as style } from "./toolbarStyles";

/**
 * ViewContainer ToolbarCreacion: activacion de creacion y controles derivados. [JOYAS §1-3], [V-0c].
 * IFML H-10/V7: MenuTipoEnlace es la superficie primaria; no hay select legacy.
 */
export const TIPOS_ENLACE: Array<{ tipo: TipoEnlace; label: string }> = TIPOS_ENLACE_MENU;

export function ToolbarCreacion() {
  const elegirTipoEnlace = useOpmStore((s) => s.elegirTipoEnlace);
  const cancelarEnlace = useOpmStore((s) => s.cancelarEnlace);
  const modoEnlace = useOpmStore((s) => s.modoEnlace);
  const modoCreacion = useOpmStore((s) => s.modoCreacion);
  const fijarModoCreacion = useOpmStore((s) => s.fijarModoCreacion);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const modoSeleccion = useOpmStore((s) => s.modoSeleccion);
  const modelo = useOpmStore((s) => s.modelo);
  const opdActivoId = useOpmStore((s) => s.opdActivoId);
  const crearEnlaceEntreEntidades = useOpmStore((s) => s.crearEnlaceEntreEntidades);
  const [menuTiposAbierto, setMenuTiposAbierto] = useState(false);
  const [direccionTipoEnlace, setDireccionTipoEnlace] = useState<"saliente" | "entrante">("saliente");
  const triggerTiposRef = useRef<HTMLButtonElement | null>(null);
  const menuTiposRef = useRef<HTMLDivElement | null>(null);
  const menuTiposAbiertoRef = useRef(false);
  menuTiposAbiertoRef.current = menuTiposAbierto;

  // P1-4 ronda 4: si modoEnlace esta activo, el origen viene de
  // `modoEnlace.origenId` (canon SSOT del modo conectar). El destino sigue
  // siendo la segunda entidad seleccionada o el `seleccionId` cuando este
  // difiere del origen. Esto permite que el popover guie progresivamente:
  // "origen elegido, selecciona destino" en vez de "selecciona dos cosas".
  const origenMenuTipo = useMemo(() => {
    if (modoEnlace && modelo.entidades[modoEnlace.origenId]) return modoEnlace.origenId;
    return seleccionId ?? seleccionados.find((id) => !!modelo.entidades[id]) ?? null;
  }, [modelo.entidades, modoEnlace, seleccionId, seleccionados]);
  const destinoMenuTipo = useMemo(() => {
    if (modoEnlace && seleccionId && seleccionId !== origenMenuTipo && modelo.entidades[seleccionId]) return seleccionId;
    if (modoSeleccion !== "multi") return null;
    return seleccionados.find((id) => id !== origenMenuTipo && !!modelo.entidades[id]) ?? null;
  }, [modelo.entidades, modoEnlace, modoSeleccion, origenMenuTipo, seleccionId, seleccionados]);
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
      // P0-6 (informe UI/UX 2026-05-07): "Tipos validos" promete preview OPL
      // al seleccionar dos cosas. El gesto de seleccion ocurre en el canvas
      // — si el listener cerraba el menu en ese pointerdown, el usuario
      // perdia la promesa. Solucion: clicks dentro del canvas no cierran
      // el menu; solo updatean la seleccion y el menu se actualiza.
      // Cualquier click fuera del canvas y fuera del menu/trigger SI cierra.
      if (target instanceof Element) {
        const canvasPane = target.closest('[data-testid="canvas-pane"]');
        if (canvasPane) return;
      }
      setMenuTiposAbierto(false);
    }
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
    };
  }, []);

  function handleToggleTiposValidos() {
    if (selectorEnlaceDeshabilitado) return;
    setMenuTiposAbierto((actual) => !actual);
  }
  function handleElegirTipoValido(tipo: TipoEnlace, origenId: Id, destinoId: Id) {
    crearEnlaceEntreEntidades(origenId, destinoId, tipo);
    setMenuTiposAbierto(false);
  }
  function handleElegirTipoPendiente(tipo: TipoEnlace) {
    elegirTipoEnlace(tipo);
    setMenuTiposAbierto(false);
  }
  function handleCancelarCreacion() {
    fijarModoCreacion(null);
  }

  return (
    <>
      <button
        ref={triggerTiposRef}
        style={estiloBotonTipos}
        type="button"
        onClick={handleToggleTiposValidos}
        disabled={selectorEnlaceDeshabilitado}
        aria-haspopup="dialog"
        aria-expanded={menuTiposAbierto}
        data-testid="abrir-menu-tipo-enlace"
        title={selectorEnlaceDeshabilitado ? "Selecciona una cosa origen" : "Conectar cosas con tipos válidos"}
      >
        Conectar ⌖
      </button>
      {modoEnlace ? <button style={style.secondaryButton} type="button" onClick={cancelarEnlace} title="Cancelar creación de enlace">Cancelar</button> : null}
      {/* P1 sticky ronda 4: barra de modo canonica unica. Reemplaza el badge */}
      {/* "Modo sticky" + chip de modoEnlace dispersos por una sola etiqueta */}
      {/* que dice inequivocamente que pasaria si el usuario hace click en */}
      {/* canvas. P0-2 garantiza que modoEnlace, modoCreacion, vistaMapaActiva */}
      {/* y contextoSimulacion son mutuamente excluyentes. */}
      {modoEnlace ? (
        <span style={style.stickyBadge} data-testid="indicador-modo-canonico" data-modo="conectar">
          Conectando: {TIPOS_ENLACE.find((item) => item.tipo === modoEnlace.tipo)?.label ?? modoEnlace.tipo}
        </span>
      ) : modoCreacion ? (
        <>
          <span style={style.stickyBadge} data-testid="indicador-modo-canonico" data-modo={`insertar-${modoCreacion}`}>
            Insertando: {modoCreacion === "objeto" ? "Objeto" : "Proceso"}
          </span>
          <button style={style.secondaryButton} type="button" onClick={handleCancelarCreacion} title="Salir del modo creación sticky">Cancelar</button>
        </>
      ) : null}
      {menuTiposAbierto ? (
        <div ref={menuTiposRef}>
          <MenuTipoEnlace
            modelo={modelo}
            origenId={origenMenuTipo}
            destinoId={destinoMenuTipo}
            direccion={direccionTipoEnlace}
            onDireccion={setDireccionTipoEnlace}
            onElegir={handleElegirTipoValido}
            onElegirPendiente={handleElegirTipoPendiente}
          />
        </div>
      ) : null}
    </>
  );
}
