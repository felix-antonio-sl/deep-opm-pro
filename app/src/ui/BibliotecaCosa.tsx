// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import objectIcon from "../../../assets/svg/list-logical/object.svg";
import objectDashedIcon from "../../../assets/svg/list-logical/objectDashed.svg";
import processIcon from "../../../assets/svg/list-logical/process.svg";
import processDashedIcon from "../../../assets/svg/list-logical/processDashed.svg";
import type { Entidad, Id, Modelo, TipoEntidad } from "../modelo/tipos";
import { tokens } from "./tokens";

/**
 * Biblioteca de cosas con iconografía list-logical canónica.
 * SSOT: [V-209] variantes visuales objeto/proceso por esencia
 * (informacional → dashed, fisica → solid). [Glos 3.55] Object, [Glos 3.69] Process.
 * Assets: assets/svg/list-logical/{object,objectDashed,process,processDashed}.svg [JOYAS §2].
 */
function iconoListLogical(entidad: Entidad): string {
  const dashed = entidad.esencia === "informacional";
  if (entidad.tipo === "objeto") return dashed ? objectDashedIcon : objectIcon;
  return dashed ? processDashedIcon : processIcon;
}

interface Props {
  modelo: Modelo;
  opdActivoId: Id;
  onCerrar: () => void;
  onNavegarOpd: (opdId: Id) => void;
  /**
   * Modo de presentación. L3 ronda 20: el modo "dock" suprime el chrome
   * `position: fixed` para que el componente pueda montarse dentro del
   * tree-pane. La API publica preserva el modo "overlay" como default.
   */
  modo?: "overlay" | "dock";
}

export function BibliotecaCosa({ modelo, opdActivoId, onCerrar, onNavegarOpd, modo = "overlay" }: Props) {
  const objetos = cosasPorTipo(modelo, "objeto");
  const procesos = cosasPorTipo(modelo, "proceso");
  return (
    <aside style={modo === "dock" ? style.panelDock : style.panel} data-testid="biblioteca-cosa" aria-label="Biblioteca de cosas">
      <div style={style.header}>
        <strong>Biblioteca</strong>
        <button type="button" style={style.closeButton} onClick={onCerrar} aria-label="Cerrar biblioteca">x</button>
      </div>
      <GrupoBiblioteca titulo="Objetos" items={objetos} modelo={modelo} opdActivoId={opdActivoId} onNavegarOpd={onNavegarOpd} />
      <GrupoBiblioteca titulo="Procesos" items={procesos} modelo={modelo} opdActivoId={opdActivoId} onNavegarOpd={onNavegarOpd} />
    </aside>
  );
}

function GrupoBiblioteca(props: {
  titulo: string;
  items: ReturnType<typeof cosasPorTipo>;
  modelo: Modelo;
  opdActivoId: Id;
  onNavegarOpd: (opdId: Id) => void;
}) {
  return (
    <section style={style.group}>
      <h3 style={style.groupTitle}>{props.titulo} ({props.items.length})</h3>
      {props.items.length === 0 ? <span style={style.empty}>Sin elementos</span> : null}
      {props.items.map((entidad) => {
        const apariciones = aparicionesDeEntidad(props.modelo, entidad.id);
        const apareceActivo = apariciones.some((item) => item.opdId === props.opdActivoId);
        return (
          <div
            key={entidad.id}
            style={style.item}
            draggable
            data-testid={`biblioteca-item-${entidad.id}`}
            onDragStart={(event) => {
              event.dataTransfer?.setData("application/x-opm-entidad-id", entidad.id);
              event.dataTransfer?.setData("text/plain", entidad.nombre);
              if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
            }}
          >
            <div style={style.itemMain}>
              <img
                src={iconoListLogical(entidad)}
                alt=""
                aria-hidden="true"
                title={`${entidad.tipo === "objeto" ? "Objeto" : "Proceso"} ${entidad.esencia === "informacional" ? "informacional" : "físico"}`}
                style={style.iconLogical}
              />
              <span style={style.name}>{entidad.nombre}</span>
              {apareceActivo ? <span style={style.badge}>OPD actual</span> : null}
            </div>
            <div style={style.opdList}>
              {apariciones.map((item) => (
                <button
                  key={`${entidad.id}-${item.opdId}-${item.aparienciaId}`}
                  type="button"
                  style={item.opdId === props.opdActivoId ? style.opdButtonActive : style.opdButton}
                  onClick={() => props.onNavegarOpd(item.opdId)}
                  title={`Ir a ${item.opdNombre}`}
                >
                  {item.opdNombre}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function cosasPorTipo(modelo: Modelo, tipo: TipoEntidad) {
  return Object.values(modelo.entidades)
    .filter((entidad) => entidad.tipo === tipo)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function aparicionesDeEntidad(modelo: Modelo, entidadId: Id) {
  return Object.values(modelo.opds).flatMap((opd) => (
    Object.values(opd.apariencias)
      .filter((apariencia) => apariencia.entidadId === entidadId)
      .map((apariencia) => ({
        opdId: opd.id,
        opdNombre: opd.nombre,
        aparienciaId: apariencia.id,
      }))
  ));
}

const style = {
  panel: {
    position: "fixed",
    left: "252px",
    top: "88px",
    bottom: "188px",
    width: "260px",
    zIndex: 20,
    display: "grid",
    alignContent: "start",
    gap: "10px",
    overflow: "auto",
    padding: "10px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.menu,
  },
  // L3 ronda 20: variante "dock" sin position:fixed; el contenedor padre
  // (BibliotecaDock) controla el flujo. Sin sombra fuerte para integrarse
  // con el tree-pane.
  panelDock: {
    display: "grid",
    alignContent: "start",
    gap: "10px",
    overflow: "auto",
    padding: "10px",
    border: "none",
    borderRadius: 0,
    background: "transparent",
    boxShadow: "none",
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", color: tokens.colors.textoPrimario, fontSize: "14px" },
  closeButton: { width: "26px", height: "26px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoElevado, cursor: "pointer" },
  group: { display: "grid", gap: "6px" },
  groupTitle: { margin: "4px 0", fontSize: "12px", color: tokens.colors.textoSecundario, textTransform: "uppercase", letterSpacing: "0" },
  empty: { color: tokens.colors.textoDeshabilitado, fontSize: "12px" },
  item: { display: "grid", gap: "5px", padding: "8px", border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.md, background: tokens.colors.fondoCard, cursor: "grab" },
  itemMain: { display: "flex", alignItems: "center", gap: "7px", minWidth: 0 },
  objectDot: { width: "10px", height: "10px", borderRadius: "2px", background: tokens.colors.canvas.objeto, border: `1px solid ${tokens.colors.verdeObjetoOscuro}` },
  processDot: { width: "12px", height: "8px", borderRadius: tokens.radii.pill, background: tokens.colors.canvas.proceso, border: `1px solid ${tokens.colors.azulAccion}` },
  iconLogical: { width: "18px", height: "14px", display: "block", flex: "0 0 auto" },
  name: { flex: "1 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "13px", fontWeight: 700, color: tokens.colors.textoPrimario },
  badge: { flex: "0 0 auto", fontSize: "10px", color: tokens.colors.verdeObjetoOscuro, fontWeight: 700 },
  opdList: { display: "flex", flexWrap: "wrap", gap: "4px" },
  opdButton: { border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, fontSize: "11px", cursor: "pointer" },
  opdButtonActive: { border: `1px solid ${tokens.colors.canvas.proceso}`, borderRadius: tokens.radii.sm, background: tokens.colors.acentoUiSuave, color: tokens.colors.azulAccion, fontSize: "11px", cursor: "pointer" },
} satisfies Record<string, preact.JSX.CSSProperties>;
