// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { formatearCombo, listarAtajos, type CategoriaAtajo } from "./atajosTeclado";
import { OPFORJA_BUILD, OPFORJA_VERSION } from "../version";
import { tokens } from "./tokens";

interface CheatsheetAtajosProps {
  abierto: boolean;
  onCerrar: () => void;
}

const CATEGORIAS: Array<{ id: CategoriaAtajo; label: string }> = [
  { id: "archivo", label: "Archivo" },
  { id: "navegacion", label: "Navegación" },
  { id: "seleccion", label: "Selección" },
  { id: "edicion", label: "Edición" },
  { id: "vista", label: "Vista" },
];

export function CheatsheetAtajos({ abierto, onCerrar }: CheatsheetAtajosProps) {
  if (!abierto) return null;
  const registros = listarAtajos();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Atajos de teclado"
      data-testid="cheatsheet-atajos"
      data-ifml-stereotype="Modal"
      data-ifml-modal="true"
      style={style.backdrop}
    >
      <section style={style.modal}>
        <header style={style.header}>
          <h2 style={style.title}>Atajos de teclado</h2>
          <button type="button" style={style.close} onClick={onCerrar} aria-label="Cerrar">×</button>
        </header>
        <div style={style.body}>
          {CATEGORIAS.map((categoria) => {
            const items = registros
              .filter((registro) => registro.categoria === categoria.id)
              .sort((a, b) => a.combo.localeCompare(b.combo, "es-CL"));
            if (items.length === 0) return null;
            return (
              <section key={categoria.id} style={style.section}>
                <h3 style={style.sectionTitle}>{categoria.label}</h3>
                <table style={style.table}>
                  <tbody>
                    {items.map((item) => (
                      <tr key={`${item.ctx}:${item.combo}:${item.descripcion}`}>
                        <td style={style.combo}><kbd style={style.kbd}>{formatearCombo(item.combo)}</kbd></td>
                        <td style={style.descripcion}>{item.descripcion}</td>
                        <td style={style.ctx}>{item.ctx}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            );
          })}
        </div>
        <footer style={style.footer}>
          <span style={style.version} title={`build ${OPFORJA_BUILD}`}>opforja · {OPFORJA_VERSION}</span>
          <button type="button" style={style.primary} onClick={onCerrar}>Cerrar</button>
        </footer>
      </section>
    </div>
  );
}

// Ronda 28 L5: Bauhaus monocromático. kbd JetBrains Mono 12 con border 1.5px
// ink-30 sin border-radius. Section titles uppercase tracking +0.08em ink-50.
const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1300,
    background: "rgba(10, 10, 10, 0.30)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  modal: {
    width: "min(760px, 100%)",
    maxHeight: "min(760px, 90vh)",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    boxShadow: tokens.shadows.flatXl,
    display: "grid",
    gridTemplateRows: "auto minmax(0, 1fr) auto",
    overflow: "hidden",
    fontFamily: tokens.typography.familyChrome,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    padding: "20px 24px 18px",
  },
  title: {
    margin: 0,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "20px",
    fontWeight: 700,
    color: tokens.colors.ink,
    letterSpacing: "-0.01em",
  },
  close: {
    width: "32px",
    height: "32px",
    border: `1px solid ${tokens.colors.ink15}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontSize: "18px",
    lineHeight: 1,
  },
  body: {
    overflow: "auto",
    padding: "20px 24px",
    display: "grid",
    gap: "20px",
  },
  section: {
    display: "grid",
    gap: "8px",
  },
  sectionTitle: {
    margin: 0,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 500,
    color: tokens.colors.ink50,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  combo: {
    width: "150px",
    padding: "8px 8px 8px 0",
    borderTop: `1px solid ${tokens.colors.ink08}`,
  },
  kbd: {
    display: "inline-block",
    minWidth: "80px",
    padding: "3px 8px",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink30}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "12px",
    fontWeight: 400,
    color: tokens.colors.ink,
    textAlign: "center",
    fontVariantNumeric: "tabular-nums",
  },
  descripcion: {
    padding: "8px",
    borderTop: `1px solid ${tokens.colors.ink08}`,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 400,
    color: tokens.colors.ink,
  },
  ctx: {
    width: "110px",
    padding: "8px 0 8px 8px",
    borderTop: `1px solid ${tokens.colors.ink08}`,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 500,
    color: tokens.colors.ink50,
    textAlign: "right",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: `${tokens.stroke.base}px solid ${tokens.colors.ink15}`,
    padding: "16px 24px",
  },
  version: {
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: "11px",
    fontWeight: 400,
    color: tokens.colors.ink50,
    letterSpacing: "0.04em",
    fontVariantNumeric: "tabular-nums",
  },
  primary: {
    minHeight: "32px",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    padding: "8px 18px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
