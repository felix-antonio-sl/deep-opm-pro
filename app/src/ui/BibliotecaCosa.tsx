import objectIcon from "../../../assets/svg/list-logical/object.svg";
import objectDashedIcon from "../../../assets/svg/list-logical/objectDashed.svg";
import processIcon from "../../../assets/svg/list-logical/process.svg";
import processDashedIcon from "../../../assets/svg/list-logical/processDashed.svg";
import type { Entidad, Id, Modelo, TipoEntidad } from "../modelo/tipos";

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
}

export function BibliotecaCosa({ modelo, opdActivoId, onCerrar, onNavegarOpd }: Props) {
  const objetos = cosasPorTipo(modelo, "objeto");
  const procesos = cosasPorTipo(modelo, "proceso");
  return (
    <aside style={style.panel} data-testid="biblioteca-cosa" aria-label="Biblioteca de cosas">
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
    border: "1px solid #c8d2df",
    borderRadius: "6px",
    background: "#ffffff",
    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.14)",
  },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", color: "#1f2937", fontSize: "14px" },
  closeButton: { width: "26px", height: "26px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#f8fafc", cursor: "pointer" },
  group: { display: "grid", gap: "6px" },
  groupTitle: { margin: "4px 0", fontSize: "12px", color: "#475467", textTransform: "uppercase", letterSpacing: "0" },
  empty: { color: "#98a2b3", fontSize: "12px" },
  item: { display: "grid", gap: "5px", padding: "8px", border: "1px solid #e5e7eb", borderRadius: "6px", background: "#f9fbfd", cursor: "grab" },
  itemMain: { display: "flex", alignItems: "center", gap: "7px", minWidth: 0 },
  objectDot: { width: "10px", height: "10px", borderRadius: "2px", background: "#70e483", border: "1px solid #0e7c66" },
  processDot: { width: "12px", height: "8px", borderRadius: "999px", background: "#3bc3ff", border: "1px solid #1d4ed8" },
  iconLogical: { width: "18px", height: "14px", display: "block", flex: "0 0 auto" },
  name: { flex: "1 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "13px", fontWeight: 700, color: "#1f2937" },
  badge: { flex: "0 0 auto", fontSize: "10px", color: "#0e7c66", fontWeight: 700 },
  opdList: { display: "flex", flexWrap: "wrap", gap: "4px" },
  opdButton: { border: "1px solid #d9e0ea", borderRadius: "4px", background: "#ffffff", color: "#475467", fontSize: "11px", cursor: "pointer" },
  opdButtonActive: { border: "1px solid #3bc3ff", borderRadius: "4px", background: "#eaf8ff", color: "#1d4ed8", fontSize: "11px", cursor: "pointer" },
} satisfies Record<string, preact.JSX.CSSProperties>;
