/**
 * ViewContainer ToolbarSeleccion: acciones contextuales de seleccion y slot L4. [JOYAS §1-3], [V-0c], IFML H-2.
 */
import addConnectedIcon from "../../../../assets/svg/addConnected.svg";
import templateIcon from "../../../../assets/svg/template.svg";
import type { Id } from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import { toolbarStyle as style, etiquetaModoGlobal, siguienteModoGlobal } from "./toolbarStyles";

interface ToolbarSeleccionProps {
  slotBarraFlotante?: preact.ComponentChildren;
}

/**
 * ViewContainer ToolbarSeleccion: una entidad o enlace seleccionado. [JOYAS §1-3], [V-0c].
 * Slot L4: BarraHerramientasElemento puede montarse aqui sin cambiar el export estable Toolbar.
 */
export function ToolbarSeleccion({ slotBarraFlotante }: ToolbarSeleccionProps) {
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const modelo = useOpmStore((s) => s.modelo);
  const abrirDialogoTraerConectados = useOpmStore((s) => s.abrirDialogoTraerConectados);
  const abrirDialogoPlantillas = useOpmStore((s) => s.abrirDialogoPlantillas);
  const uiAliasVisibles = useOpmStore((s) => s.uiAliasVisibles);
  const uiDescripcionesVisibles = useOpmStore((s) => s.uiDescripcionesVisibles);
  const toggleAliasVisibles = useOpmStore((s) => s.toggleAliasVisibles);
  const toggleDescripcionesVisibles = useOpmStore((s) => s.toggleDescripcionesVisibles);
  const uiModoImagenGlobal = useOpmStore((s) => s.uiModoImagenGlobal);
  const fijarModoImagenGlobal = useOpmStore((s) => s.fijarModoImagenGlobal);
  const abrirModalImagen = useOpmStore((s) => s.abrirModalImagen);
  const entidadSeleccionada = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const puedeEditarImagen = entidadSeleccionada?.tipo === "objeto";
  const hayEntidadSeleccionada = !!seleccionId || seleccionados.some((id) => !!modelo.entidades[id]);

  function handleAbrirImagen() {
    if (seleccionId) abrirModalImagen(seleccionId);
  }
  function handleSiguienteModoImagen() {
    fijarModoImagenGlobal(siguienteModoGlobal(uiModoImagenGlobal));
  }

  return (
    <>
      <span style={style.divider} />
      <button style={hayEntidadSeleccionada ? style.iconTextButton : style.disabledButton} type="button" disabled={!hayEntidadSeleccionada} onClick={abrirDialogoTraerConectados} title={hayEntidadSeleccionada ? "Traer conectados (Ctrl+Shift+T)" : "Selecciona una cosa visible"} data-testid="toolbar-traer-conectados">
        <img src={addConnectedIcon} alt="" style={style.smallIcon} />Traer
      </button>
      <button style={style.iconTextButton} type="button" onClick={abrirDialogoPlantillas} title="Plantillas" data-testid="toolbar-plantillas">
        <img src={templateIcon} alt="" style={style.smallIcon} />Plantillas
      </button>
      <span style={style.divider} />
      <button style={uiAliasVisibles ? style.activeButton : style.button} type="button" onClick={toggleAliasVisibles} aria-pressed={uiAliasVisibles} title={uiAliasVisibles ? "Ocultar alias bajo el nombre" : "Mostrar alias bajo el nombre"}>Alias</button>
      <button style={uiDescripcionesVisibles ? style.activeButton : style.button} type="button" onClick={toggleDescripcionesVisibles} aria-pressed={uiDescripcionesVisibles} title={uiDescripcionesVisibles ? "Ocultar descripciones bajo el nombre" : "Mostrar descripciones bajo el nombre"}>Desc</button>
      <button style={puedeEditarImagen ? style.button : style.disabledButton} type="button" disabled={!puedeEditarImagen} onClick={handleAbrirImagen} title={puedeEditarImagen ? "Editar imagen del objeto seleccionado" : "Selecciona un objeto"} aria-label="Editar imagen del objeto">
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path d="M3 6 L6 6 L7 4 L13 4 L14 6 L17 6 L17 16 L3 16 Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
          <circle cx="10" cy="11" r="3" fill="none" stroke="currentColor" strokeWidth="1.4"/>
        </svg>
      </button>
      <button style={uiModoImagenGlobal ? style.activeButton : style.button} type="button" onClick={handleSiguienteModoImagen} aria-pressed={uiModoImagenGlobal !== null} data-testid="toolbar-modo-imagen-global" title={`Modo imagen global: ${etiquetaModoGlobal(uiModoImagenGlobal)}`}>{etiquetaModoGlobal(uiModoImagenGlobal)}</button>
      {slotBarraFlotante ?? null}
    </>
  );
}
