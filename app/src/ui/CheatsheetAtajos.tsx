// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { formatearCombo, listarAtajos, type CategoriaAtajo } from "./atajosTeclado";
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
          <button type="button" style={style.primary} onClick={onCerrar}>Cerrar</button>
        </footer>
      </section>
    </div>
  );
}

const style = {
  backdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 1300,
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },
  modal: {
    width: "min(760px, 100%)",
    maxHeight: "min(760px, 90vh)",
    borderRadius: tokens.radii.lg,
    background: tokens.colors.fondoChrome,
    boxShadow: tokens.shadows.modalAmplio,
    display: "grid",
    gridTemplateRows: "48px minmax(0, 1fr) 52px",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: `1px solid ${tokens.colors.bordeChrome}`,
    padding: "0 16px",
  },
  title: {
    margin: 0,
    fontSize: "16px",
    color: tokens.colors.textoPrimario,
  },
  close: {
    width: "30px",
    height: "30px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    cursor: "pointer",
    fontSize: "18px",
  },
  body: {
    overflow: "auto",
    padding: "14px 16px",
    display: "grid",
    gap: "14px",
  },
  section: {
    display: "grid",
    gap: "6px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "13px",
    color: tokens.colors.textoSecundario,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  combo: {
    width: "130px",
    padding: "5px 8px",
    borderTop: `1px solid ${tokens.colors.fondoMuted}`,
  },
  kbd: {
    display: "inline-block",
    minWidth: "72px",
    padding: "2px 6px",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderBottomColor: tokens.colors.textoDeshabilitado,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoElevado,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "12px",
    color: tokens.colors.textoPrimario,
    textAlign: "center",
  },
  descripcion: {
    padding: "5px 8px",
    borderTop: `1px solid ${tokens.colors.fondoMuted}`,
    fontSize: "13px",
    color: tokens.colors.textoPrimario,
  },
  ctx: {
    width: "110px",
    padding: "5px 8px",
    borderTop: `1px solid ${tokens.colors.fondoMuted}`,
    fontSize: "12px",
    color: tokens.colors.textoTerciario,
    textAlign: "right",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    borderTop: `1px solid ${tokens.colors.bordeChrome}`,
    padding: "0 16px",
  },
  primary: {
    minHeight: "32px",
    border: `1px solid ${tokens.colors.chromeNeutral}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.chromeNeutral,
    color: tokens.colors.fondoChrome,
    fontWeight: 700,
    cursor: "pointer",
    padding: "0 14px",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
