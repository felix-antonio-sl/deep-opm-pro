/**
 * ViewContainer ToolbarCreacion: modo creacion y enlace. [JOYAS §1-3], [V-0c], [Glos 3.x], IFML H-10.
 *
 * Ronda 18 L1 P3: cluster Enlace + cluster Vista. La etiqueta visual
 * "Enlace" se removió porque el placeholder del select ("Tipo de enlace…")
 * ya transmite la intención.
 *
 * Ronda 19 L1: queda acotado al cluster Conectar. Los controles de Vista
 * viven en ToolbarBase para exponer la intención como group propio.
 */
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import type { Id, TipoEnlace } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { BibliotecaCosa } from "../BibliotecaCosa";
import { MenuTipoEnlace } from "../MenuTipoEnlace";
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
  // L3 ronda 20: el overlay legacy ahora vive en el store para que el toggle
  // del dock pueda cerrarlo al abrirse (mutuamente exclusivos). El testid
  // `abrir-biblioteca-cosa` se preserva intacto.
  const bibliotecaAbierta = useOpmStore((s) => s.bibliotecaCosaAbierta);
  const toggleBibliotecaCosa = useOpmStore((s) => s.toggleBibliotecaCosa);
  const cerrarBibliotecaCosa = useOpmStore((s) => s.cerrarBibliotecaCosa);
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
    return seleccionados.find((id) => id !== origenMenuTipo && !!modelo.entidades[id]) ?? null;
  }, [modelo.entidades, modoEnlace, origenMenuTipo, seleccionId, seleccionados]);
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

  return (
    <>
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
      <button style={bibliotecaAbierta ? style.activeButton : style.button} type="button" onClick={toggleBibliotecaCosa} data-testid="abrir-biblioteca-cosa" title="Biblioteca de cosas · arrastra al canvas para reusar">Biblioteca</button>
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
      {bibliotecaAbierta ? <BibliotecaCosa modelo={modelo} opdActivoId={opdActivoId} onCerrar={cerrarBibliotecaCosa} onNavegarOpd={cambiarOpdActivo} /> : null}
      {menuTiposAbierto ? (
        <div ref={menuTiposRef}>
          <MenuTipoEnlace modelo={modelo} origenId={origenMenuTipo} destinoId={destinoMenuTipo} direccion={direccionTipoEnlace} onDireccion={setDireccionTipoEnlace} onElegir={handleElegirTipoValido} />
        </div>
      ) : null}
    </>
  );
}
