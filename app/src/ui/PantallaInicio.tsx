// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useState } from "preact/hooks";
import autosaveIcon from "../../../assets/svg/autosave.svg";
import regFileIcon from "../../../assets/svg/regFile.svg";
import verFileIcon from "../../../assets/svg/verFile.svg";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/local";
import { listarFixtures } from "../store/runtime";
import { useOpmStore } from "../store";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";

export function PantallaInicio() {
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const pantallaInicioCerrada = useOpmStore((s) => s.pantallaInicioCerrada);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const listar = useOpmStore((s) => s.listarModelosGuardados);
  const cargar = useOpmStore((s) => s.cargarLocal);
  const nuevoModelo = useOpmStore((s) => s.nuevoModelo);
  const cargarFixtureDemo = useOpmStore((s) => s.cargarFixtureDemo);
  const cerrarPantallaInicio = useOpmStore((s) => s.cerrarPantallaInicio);
  const confirmarSiDirty = useConfirmarSiDirty();
  const [query, setQuery] = useState("");
  const [demoSeleccionado, setDemoSeleccionado] = useState("");

  const demos = useMemo(() => listarFixtures(), []);

  useEffect(() => {
    listar();
  }, [listar]);

  const hayRecientes = modelos.some((modelo) => !modelo.archivado);
  const visible = !modeloPersistidoId && !pantallaInicioCerrada && hayRecientes;
  const recientes = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("es-CL");
    return [...modelos]
      .filter((modelo) => !modelo.archivado)
      .filter((modelo) => !q || modelo.nombre.toLocaleLowerCase("es-CL").includes(q))
      .sort((a, b) => fechaUso(b).localeCompare(fechaUso(a)))
      .slice(0, 12);
  }, [modelos, query]);

  if (!visible) return null;

  const abrir = (id: Id) => confirmarSiDirty(() => cargar(id));
  const ejecutarNuevo = () => {
    cerrarPantallaInicio();
    nuevoModelo();
  };

  return (
    <div data-testid="pantalla-inicio" style={style.overlay}>
      <div style={style.telon} />
      <section style={style.panel} aria-label="Modelos recientes">
        <div style={style.header}>
          <h2 style={style.title}>Modelos recientes</h2>
          <input
            type="search"
            aria-label="Buscar modelos recientes"
            placeholder="Buscar modelo..."
            style={style.search}
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
        </div>
        <div style={style.actions}>
          <button type="button" style={style.primaryButton} onClick={ejecutarNuevo}>Nuevo</button>
          <select
            aria-label="Cargar modelo de ejemplo"
            value={demoSeleccionado}
            style={style.demoSelect}
            onChange={(e) => {
              const nombre = e.currentTarget.value;
              if (!nombre) return;
              setDemoSeleccionado("");
              confirmarSiDirty(() => {
                cerrarPantallaInicio();
                cargarFixtureDemo(nombre);
              });
            }}
          >
            <option value="" disabled>Ejemplos...</option>
            {demos.map((d) => (
              <option key={d.modelo.nombre} value={d.modelo.nombre} title={d.proposito}>
                {d.modelo.nombre}
              </option>
            ))}
          </select>
        </div>
        <div style={style.grid}>
          {recientes.map((modelo) => <TileReciente key={modelo.id} modelo={modelo} onAbrir={abrir} />)}
        </div>
        {recientes.length === 0 ? <div style={style.empty}>No hay modelos recientes.</div> : null}
      </section>
    </div>
  );
}

function TileReciente(props: { modelo: ResumenModeloPersistido; onAbrir: (id: Id) => void }) {
  const versiones = props.modelo.versiones?.length ?? 0;
  return (
    <button
      type="button"
      data-testid="pantalla-inicio-modelo"
      style={style.tile}
      onClick={() => props.onAbrir(props.modelo.id)}
      onDblClick={() => props.onAbrir(props.modelo.id)}
      title={props.modelo.nombre}
    >
      <img src={regFileIcon} alt="" style={style.tileIcon} />
      <strong style={style.tileName}>{props.modelo.nombre}</strong>
      <span style={style.tileDesc}>{props.modelo.descripcion || "Sin descripción"}</span>
      <span style={style.tileDate}>{new Date(fechaUso(props.modelo)).toLocaleString("es-CL")}</span>
      <span style={style.glyphs}>
        <span title="Editable" style={style.glyphText}>✎</span>
        {props.modelo.autosalvado ? <img src={autosaveIcon} alt="autosalvado" style={style.glyphIcon} title="Autosalvado" /> : null}
        {versiones > 0 ? <img src={verFileIcon} alt={`${versiones} versiones`} style={style.glyphIcon} title={`${versiones} versiones`} /> : null}
      </span>
    </button>
  );
}

function fechaUso(modelo: ResumenModeloPersistido): string {
  return modelo.ultimaApertura ?? modelo.actualizadoEn ?? modelo.creadoEn;
}

const style = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 850,
    display: "grid",
    placeItems: "center",
    pointerEvents: "auto",
  },
  telon: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.48)",
  },
  panel: {
    position: "relative",
    width: "min(1120px, calc(100vw - 48px))",
    maxHeight: "min(720px, calc(100vh - 72px))",
    display: "grid",
    gridTemplateRows: "auto auto minmax(0, 1fr) auto",
    gap: "12px",
    padding: "18px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.lg,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.inicio,
    overflow: "hidden",
  },
  header: { display: "flex", alignItems: "center", gap: "12px" },
  title: { margin: 0, color: tokens.colors.textoPrimario, fontSize: "20px", fontWeight: 800 },
  search: { marginLeft: "auto", width: "min(360px, 45vw)", height: "34px", border: `1px solid ${tokens.colors.bordeInput}`, borderRadius: tokens.radii.sm, padding: "0 10px", fontSize: "13px" },
  actions: { display: "flex", flexWrap: "wrap", gap: "8px" },
  primaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  demoSelect: { height: "34px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 700, maxWidth: "220px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px", overflow: "auto", minHeight: 0 },
  tile: { position: "relative", minHeight: "140px", display: "grid", gridTemplateRows: "24px auto auto 18px", gap: "4px", padding: "10px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.md, background: tokens.colors.fondoCard, color: tokens.colors.textoPrimario, textAlign: "left", cursor: "pointer" },
  tileIcon: { width: "24px", height: "24px" },
  tileName: { fontSize: "13px", overflowWrap: "anywhere" },
  tileDesc: { color: tokens.colors.textoTerciario, fontSize: "12px", lineHeight: 1.25, overflowWrap: "anywhere" },
  tileDate: { color: tokens.colors.textoTerciario, fontSize: "11px", fontWeight: 700 },
  glyphs: { display: "inline-flex", gap: "5px", alignItems: "center", justifySelf: "end" },
  glyphIcon: { width: "14px", height: "14px" },
  glyphText: { color: tokens.colors.chromeNeutral, fontSize: "14px", fontWeight: 800, lineHeight: 1 },
  empty: { padding: "18px", border: `1px dashed ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, color: tokens.colors.textoTerciario, fontSize: "13px", fontWeight: 700, textAlign: "center" },
} satisfies Record<string, preact.JSX.CSSProperties>;
