// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import autosaveIcon from "../../../assets/svg/autosave.svg";
import regFileIcon from "../../../assets/svg/regFile.svg";
import verFileIcon from "../../../assets/svg/verFile.svg";
import { fechaUsoPantallaInicio, usePantallaInicioViewModel } from "../app/viewmodels/pantallaInicioViewModel";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/local";
import { modeloTieneContenidoVisible } from "./bienvenida";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { tokens } from "./tokens";

export const GLOSA_BIENVENIDA_OPM = [
  { termino: "Cosa", definicion: "objeto o proceso del sistema que modelas." },
  { termino: "OPD", definicion: "diagrama donde dibujas cosas y enlaces." },
  { termino: "Apariencia", definicion: "cómo aparece una cosa en un OPD; la misma cosa puede aparecer en varios OPDs." },
  { termino: "Enlace", definicion: "relación entre dos cosas." },
] as const;
export const DIMENSION_ACCION_BIENVENIDA_PX = 160;

export function PantallaInicio() {
  const confirmarSiDirty = useConfirmarSiDirty();
  const [query, setQuery] = useState("");
  const [demoSeleccionado, setDemoSeleccionado] = useState("");
  const [glosaAbierta, setGlosaAbierta] = useState(false);
  const {
    modelo,
    modeloPersistidoId,
    pantallaInicioCerrada,
    recientes,
    demos,
    cargar,
    nuevoModelo,
    cargarFixtureDemo,
    cerrarPantallaInicio,
    iniciarAsistente,
  } = usePantallaInicioViewModel(query);
  const modeloTieneContenido = useMemo(() => modeloTieneContenidoVisible(modelo), [modelo]);

  const candidatoVisible = !modeloPersistidoId && !pantallaInicioCerrada && !modeloTieneContenido;
  // Corte 3.5 sustracción de chrome: si hay al menos un reciente, abrir el
  // último directo en vez de mostrar el overlay. Solo se evalúa con `query`
  // vacío para no interferir con el filtro de búsqueda manual.
  const autoabriobiertoRef = useRef(false);
  const debeAutoabrirReciente = candidatoVisible && query.trim() === "" && recientes.length > 0;
  useEffect(() => {
    if (!debeAutoabrirReciente) return;
    if (autoabriobiertoRef.current) return;
    const ultimo = recientes[0];
    if (!ultimo) return;
    autoabriobiertoRef.current = true;
    confirmarSiDirty(() => cargar(ultimo.id));
  }, [debeAutoabrirReciente, recientes, cargar, confirmarSiDirty]);

  const visible = candidatoVisible && !debeAutoabrirReciente;
  if (!visible) return null;

  const abrir = (id: Id) => confirmarSiDirty(() => cargar(id));
  const ejecutarNuevo = () => {
    cerrarPantallaInicio();
    nuevoModelo();
  };
  const ejecutarAsistente = () => {
    cerrarPantallaInicio();
    iniciarAsistente();
  };

  return (
    <div data-testid="pantalla-inicio" style={style.overlay}>
      <div style={style.telon} />
      <section
        style={style.panel}
        aria-label="Bienvenida deep-opm-pro"
        data-ifml-viewpoint="Bienvenida"
        data-ifml-pattern="CN-DEF"
      >
        <div style={style.header}>
          <div>
            <div style={style.titleRow}>
              <span style={style.brandMark}>OPM</span>
              <h2 style={style.title}>deep-opm-pro</h2>
            </div>
            <p style={style.subtitle}>Modelador de sistemas en OPM/ISO 19450</p>
          </div>
          <input
            type="search"
            aria-label="Buscar modelos recientes"
            placeholder="Buscar modelo..."
            style={style.search}
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
          {/* Corte 3.5 sustracción de chrome: la glosa OPM ya no ocupa ~80px
              verticales por defecto. Se ofrece como drawer plegable disparado
              por este botón `?` en el header del overlay. */}
          <button
            type="button"
            data-testid="pantalla-inicio-glosa-toggle"
            aria-label="Glosa OPM"
            aria-expanded={glosaAbierta}
            aria-controls="pantalla-inicio-glosa"
            title="Glosa de términos OPM"
            style={glosaAbierta ? style.glosaToggleActivo : style.glosaToggle}
            onClick={() => setGlosaAbierta((abierta) => !abierta)}
          >
            ?
          </button>
        </div>
        <div style={style.actions}>
          {/*
           * ronda 23 chrome: re-jerarquía. "Asistente guiado" como tarjeta
           * principal — texto descriptivo más rico + borde de acento — para
           * empujar al usuario al flujo asistido (mejor onboarding OPM).
           * "Empezar vacío" y "Abrir ejemplo" como tarjetas secundarias.
           */}
          <button type="button" style={style.actionCardPrimary} onClick={ejecutarAsistente}>
            <span style={style.actionIconPrimary}>✦</span>
            <strong style={style.actionCardTitle}>Asistente guiado</strong>
            <span style={style.actionCardDesc}>Conversación que siembra un SD desde función y beneficiario.</span>
          </button>
          <button type="button" style={style.actionCardSecundario} onClick={ejecutarNuevo}>
            <span style={style.actionIconSecundario}>+</span>
            <strong style={style.actionCardSecondaryLabel}>Empezar vacío</strong>
          </button>
          <label style={style.actionCardSecundarioLabel}>
            <span style={style.actionIconSecundario}>▸</span>
            <strong style={style.actionCardSecondaryLabel}>Abrir ejemplo</strong>
            <select
              aria-label="Elegir ejemplo de bienvenida"
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
              <option value="" disabled>Elegir ejemplo</option>
              {demos.map((d) => (
                <option key={d.modelo.nombre} value={d.modelo.nombre} title={d.proposito}>
                  {d.modelo.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        <h3 style={style.sectionTitle}>Recientes</h3>
        <div style={style.grid}>
          {recientes.map((modelo) => <TileReciente key={modelo.id} modelo={modelo} onAbrir={abrir} />)}
        </div>
        {recientes.length === 0 ? <div style={style.empty}>No hay modelos recientes.</div> : null}
        {glosaAbierta ? (
          <dl
            id="pantalla-inicio-glosa"
            data-testid="pantalla-inicio-glosa"
            style={style.glosa}
            aria-label="Glosa OPM de bienvenida"
          >
            {GLOSA_BIENVENIDA_OPM.map((item) => (
              <div key={item.termino} style={style.glosaItem}>
                <dt style={style.glosaTermino}>{item.termino}</dt>
                <dd style={style.glosaDefinicion}>
                  <span aria-hidden="true" style={style.glosaSeparador}>—</span>
                  {item.definicion}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
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
      <span style={style.tileDate}>{new Date(fechaUsoPantallaInicio(props.modelo)).toLocaleString("es-CL")}</span>
      <span style={style.glyphs}>
        <span title="Editable" style={style.glyphText}>✎</span>
        {props.modelo.autosalvado ? <img src={autosaveIcon} alt="autosalvado" style={style.glyphIcon} title="Autosalvado" /> : null}
        {versiones > 0 ? <img src={verFileIcon} alt={`${versiones} versiones`} style={style.glyphIcon} title={`${versiones} versiones`} /> : null}
      </span>
    </button>
  );
}

const style = {
  overlay: {
    position: "fixed",
    inset: 0,
    zIndex: 850,
    display: "grid",
    placeItems: "center",
    pointerEvents: "none",
  },
  telon: {
    position: "absolute",
    inset: 0,
    background: "rgba(15, 23, 42, 0.48)",
    pointerEvents: "none",
  },
  panel: {
    position: "relative",
    width: "min(1120px, calc(100vw - 48px))",
    maxHeight: "min(720px, calc(100vh - 72px))",
    display: "grid",
    // Corte 3.5 sustracción de chrome: la glosa pasó a drawer plegable; el
    // slot fijo final desaparece para recuperar ~80px verticales por defecto.
    gridTemplateRows: "auto auto auto minmax(0, 1fr) auto",
    gap: "12px",
    padding: "18px",
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.lg,
    background: tokens.colors.fondoChrome,
    boxShadow: "0 28px 80px rgba(14, 44, 63, 0.28)",
    overflow: "auto",
    pointerEvents: "auto",
  },
  header: { display: "flex", alignItems: "center", gap: "12px" },
  titleRow: { display: "flex", alignItems: "center", gap: "10px" },
  brandMark: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "44px",
    height: "30px",
    borderRadius: tokens.radii.md,
    background: tokens.colors.acentoSecundario,
    color: tokens.colors.fondoChrome,
    fontSize: "13px",
    fontWeight: tokens.typography.weights.heavy,
    letterSpacing: 0,
    boxShadow: "0 8px 18px rgba(14, 44, 63, 0.24)",
  },
  title: { margin: 0, color: tokens.colors.textoPrimario, fontSize: "20px", fontWeight: 800 },
  subtitle: { margin: "4px 0 0", color: tokens.colors.textoSecundario, fontSize: "13px", fontWeight: 700 },
  search: { marginLeft: "auto", width: "min(360px, 45vw)", height: "34px", border: `1px solid ${tokens.colors.bordeInput}`, borderRadius: tokens.radii.sm, padding: "0 10px", fontSize: "13px" },
  glosaToggle: {
    width: "34px",
    height: "34px",
    flex: "0 0 auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: tokens.typography.weights.bold,
    lineHeight: 1,
  },
  glosaToggleActivo: {
    width: "34px",
    height: "34px",
    flex: "0 0 auto",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.acentoUiSuave,
    color: tokens.colors.acentoUi,
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: tokens.typography.weights.bold,
    lineHeight: 1,
  },
  // ronda 23 chrome: layout 2-col asimétrico. La primaria ocupa col-1 con
  // doble alto; las dos secundarias se apilan en col-2.
  actions: {
    display: "grid",
    gridTemplateColumns: "minmax(280px, 1.4fr) minmax(220px, 1fr)",
    gridTemplateRows: "auto auto",
    gap: "12px",
  },
  actionCardPrimary: {
    gridColumn: "1 / 2",
    gridRow: "1 / 3",
    minHeight: `${DIMENSION_ACCION_BIENVENIDA_PX}px`,
    display: "grid",
    gridTemplateRows: "auto auto auto",
    alignContent: "center",
    justifyItems: "start",
    rowGap: "10px",
    padding: "20px",
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.lg,
    background: "linear-gradient(135deg, #DDF7FF 0%, #EAFFF0 100%)",
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: tokens.typography.weights.semibold,
    textAlign: "left",
    boxShadow: "0 14px 34px rgba(0, 125, 184, 0.16)",
  },
  actionCardTitle: { fontSize: "16px", fontWeight: tokens.typography.weights.bold, color: tokens.colors.textoPrimario },
  actionCardDesc: { fontSize: "13px", fontWeight: tokens.typography.weights.normal, color: tokens.colors.textoSecundario, lineHeight: 1.45 },
  actionCardSecundario: {
    minHeight: "0",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    alignItems: "center",
    columnGap: "10px",
    padding: "14px 16px",
    border: `1px solid ${tokens.colors.bordeSuave}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoPanelSuave,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: tokens.typography.weights.semibold,
    textAlign: "left",
  },
  actionCardSecundarioLabel: {
    minHeight: "0",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    alignItems: "center",
    columnGap: "10px",
    padding: "14px 16px",
    border: `1px solid ${tokens.colors.bordeSuave}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoPanelSuave,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: tokens.typography.weights.semibold,
  },
  actionCardSecondaryLabel: { fontSize: "13px", fontWeight: tokens.typography.weights.semibold, color: tokens.colors.textoPrimario },
  actionIcon: { fontSize: "24px", color: tokens.colors.chromeNeutral, fontWeight: 900, opacity: 0.7 },
  actionIconPrimary: { fontSize: "28px", color: tokens.colors.acentoUi, opacity: 0.9, lineHeight: 1 },
  actionIconSecundario: { fontSize: "20px", color: tokens.colors.chromeNeutral, opacity: 0.7, lineHeight: 1 },
  sectionTitle: { margin: "2px 0 0", color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0 },
  primaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "13px", fontWeight: 700 },
  demoSelect: { height: "32px", padding: "0 8px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontSize: "12px", fontWeight: 700, maxWidth: "220px" },
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
  // ronda 23 chrome: mini-glosario sin caja envolvente — solo texto con
  // tipografía editorial. Pesos bajados a semibold para que no compita con
  // las acciones primarias.
  glosa: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "6px 18px",
    margin: 0,
    padding: 0,
    color: tokens.colors.textoSecundario,
    fontSize: "12px",
    lineHeight: 1.45,
  },
  glosaItem: { display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "start", columnGap: "6px", minWidth: 0 },
  glosaTermino: { margin: 0, color: tokens.colors.textoPrimario, fontWeight: tokens.typography.weights.semibold, whiteSpace: "nowrap" },
  glosaDefinicion: { display: "flex", gap: "6px", minWidth: 0, margin: 0, overflowWrap: "anywhere" },
  glosaSeparador: { color: tokens.colors.textoTerciario, fontWeight: tokens.typography.weights.normal },
} satisfies Record<string, preact.JSX.CSSProperties>;
