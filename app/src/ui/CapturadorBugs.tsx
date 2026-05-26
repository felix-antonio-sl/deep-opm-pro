import { useEffect, useRef, useState } from "preact/hooks";
import { useBugCaptureContext } from "../app/viewmodels/capturadorBugsViewModel";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

type ScreenshotAdjunto = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type BugCaptureResponse = {
  id: string;
  path: string;
  directory: string;
  screenshots: number;
};

type BugLedgerEntry = {
  id: string;
  scope: "Activo" | "Histórico";
  type: string;
  status: string;
  resolution: string;
  createdAt: string;
  reportPath: string;
  text: string;
  modelName: string;
  opdName: string;
  screenshots: number;
  note: string;
};

type BugLedgerResponse = {
  active: BugLedgerEntry[];
  history: BugLedgerEntry[];
  counts?: {
    active?: number;
    history?: number;
  };
};

export function CapturadorBugs() {
  if (!bugCaptureHabilitado()) return null;
  return <CapturadorBugsInteractivo />;
}

function CapturadorBugsInteractivo() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [screenshots, setScreenshots] = useState<ScreenshotAdjunto[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<BugCaptureResponse | null>(null);
  const [listaAbierta, setListaAbierta] = useState(false);
  const [ledger, setLedger] = useState<BugLedgerResponse | null>(null);
  const [ledgerTab, setLedgerTab] = useState<"activos" | "historico">("activos");
  const [cargandoLedger, setCargandoLedger] = useState(false);
  const [errorLedger, setErrorLedger] = useState<string | null>(null);
  const contexto = useBugCaptureContext();

  const cerrar = () => {
    if (enviando) return;
    setAbierto(false);
    setError(null);
  };

  const abrir = () => {
    setAbierto(true);
    setError(null);
    setResultado(null);
  };

  useEffect(() => {
    const abrirConAtajo = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "b") return;
      if (!event.shiftKey || (!event.ctrlKey && !event.metaKey)) return;
      event.preventDefault();
      event.stopPropagation();
      abrir();
    };
    window.addEventListener("keydown", abrirConAtajo, { capture: true });
    return () => window.removeEventListener("keydown", abrirConAtajo, { capture: true });
  }, []);

  useEffect(() => {
    const abrirCaptura = () => abrir();
    const abrirLedger = () => abrirLista();
    window.addEventListener("opforja:bug-capture:open", abrirCaptura);
    window.addEventListener("opforja:bug-ledger:open", abrirLedger);
    return () => {
      window.removeEventListener("opforja:bug-capture:open", abrirCaptura);
      window.removeEventListener("opforja:bug-ledger:open", abrirLedger);
    };
  }, []);

  const abrirLista = () => {
    setListaAbierta(true);
    setLedgerTab("activos");
    void cargarLedger();
  };

  const cargarLedger = async () => {
    setCargandoLedger(true);
    setErrorLedger(null);
    try {
      const response = await fetch("/__deep-opm/bug-reports", { method: "GET" });
      const body = await response.json().catch(() => null) as BugLedgerResponse | { error?: string } | null;
      if (!response.ok || !body || !("active" in body) || !("history" in body)) {
        const message = body && "error" in body ? body.error : null;
        throw new Error(message ?? "No se pudo cargar la lista de bugs.");
      }
      setLedger(body);
    } catch (err) {
      setErrorLedger(err instanceof Error ? err.message : "No se pudo cargar la lista de bugs.");
    } finally {
      setCargandoLedger(false);
    }
  };

  const agregarArchivos = async (files: FileList | File[]) => {
    const imagenes = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (imagenes.length === 0) return;
    const adjuntos = await Promise.all(imagenes.map(leerScreenshot));
    setScreenshots((actuales) => [...actuales, ...adjuntos]);
    setError(null);
  };

  const enviar = async () => {
    const text = texto.trim();
    if (!text) {
      setError("Describe el bug antes de guardar el reporte.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const response = await fetch("/__deep-opm/bug-reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          text,
          screenshots: screenshots.map(({ name, type, dataUrl }) => ({ name, type, dataUrl })),
          context: contexto,
        }),
      });
      const body = await response.json().catch(() => null) as Partial<BugCaptureResponse> & { error?: string } | null;
      if (!response.ok && body === null) {
        throw new Error("Capturador de bugs no disponible en despliegue estatico. Copia la descripcion y reportala fuera de la app.");
      }
      if (!response.ok || !body?.id || !body.path || !body.directory) {
        throw new Error(body?.error ?? "No se pudo guardar el reporte en el servidor local.");
      }
      await copiarTextoPortapapeles(body.id);
      setResultado({
        id: body.id,
        path: body.path,
        directory: body.directory,
        screenshots: typeof body.screenshots === "number" ? body.screenshots : screenshots.length,
      });
      setTexto("");
      setScreenshots([]);
      setAbierto(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el reporte.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <Dialogo
        open={abierto}
        title="Capturar bug"
        size="lg"
        onCancel={cerrar}
        actions={(
          <>
            <button type="button" style={style.secondaryButton} onClick={cerrar} disabled={enviando}>Cerrar</button>
            <button type="button" style={style.primaryButton} onClick={enviar} disabled={enviando}>
              {enviando ? "Guardando..." : "Guardar reporte"}
            </button>
          </>
        )}
      >
        <div
          style={style.body}
          data-testid="bug-capture-dialog"
          onPaste={(event) => {
            const files = imagenesDesdeClipboard(event);
            if (files.length > 0) void agregarArchivos(files);
          }}
        >
          {resultado ? (
            <div style={style.resultado} data-testid="bug-capture-result">
              <strong style={style.resultadoId}>{resultado.id}</strong>
              <span>Guardado en {resultado.path}</span>
            </div>
          ) : null}

          <label style={style.label}>
            <span style={style.labelText}>Descripción</span>
            <textarea
              aria-label="Descripción del bug"
              style={style.textarea}
              value={texto}
              rows={7}
              placeholder="Qué pasó, qué esperabas y cómo reproducirlo."
              onInput={(event) => setTexto(event.currentTarget.value)}
            />
          </label>

          <section style={style.attachments} aria-label="Screenshots adjuntos">
            <div style={style.attachmentsHeader}>
              <span style={style.labelText}>Screenshots opcionales</span>
              <button type="button" style={style.secondaryButton} onClick={() => fileInputRef.current?.click()}>
                Agregar screenshot
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              aria-label="Screenshots"
              accept="image/png,image/jpeg,image/webp"
              multiple
              style={style.hiddenInput}
              onChange={(event) => {
                const files = event.currentTarget.files;
                if (files) void agregarArchivos(files);
                event.currentTarget.value = "";
              }}
            />
            {screenshots.length === 0 ? (
              <div style={style.empty}>Puedes pegar o adjuntar 0 o más capturas.</div>
            ) : (
              <ul style={style.lista}>
                {screenshots.map((screenshot) => (
                  <li key={screenshot.id} style={style.item}>
                    <img src={screenshot.dataUrl} alt="" style={style.thumb} />
                    <span style={style.fileName}>{screenshot.name}</span>
                    <span style={style.fileSize}>{formatearBytes(screenshot.size)}</span>
                    <button
                      type="button"
                      aria-label={`Quitar ${screenshot.name}`}
                      style={style.removeButton}
                      onClick={() => setScreenshots((actuales) => actuales.filter((item) => item.id !== screenshot.id))}
                    >
                      x
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {error ? <div role="alert" style={style.error}>{error}</div> : null}
        </div>
      </Dialogo>
      <Dialogo
        open={listaAbierta}
        title="Bugs y features"
        size="xl"
        onCancel={() => setListaAbierta(false)}
        testId="bug-ledger-dialog"
        actions={(
          <>
            <button type="button" style={style.secondaryButton} onClick={() => void cargarLedger()} disabled={cargandoLedger}>Actualizar</button>
            <button type="button" style={style.primaryButton} onClick={() => setListaAbierta(false)}>Cerrar</button>
          </>
        )}
      >
        <div style={style.ledgerBody}>
          <div style={style.ledgerSummary}>
            <button
              type="button"
              aria-pressed={ledgerTab === "activos"}
              style={ledgerTab === "activos" ? style.tabActivo : style.tab}
              onClick={() => setLedgerTab("activos")}
            >
              Activos {ledger ? `(${ledger.active.length})` : ""}
            </button>
            <button
              type="button"
              aria-pressed={ledgerTab === "historico"}
              style={ledgerTab === "historico" ? style.tabActivo : style.tab}
              onClick={() => setLedgerTab("historico")}
            >
              Histórico {ledger ? `(${ledger.history.length})` : ""}
            </button>
          </div>

          {cargandoLedger && !ledger ? <div style={style.empty}>Cargando lista...</div> : null}
          {errorLedger ? <div role="alert" style={style.error}>{errorLedger}</div> : null}
          {ledger ? (
            <BugLedgerTable entries={ledgerTab === "activos" ? ledger.active : ledger.history} includeScope={ledgerTab === "historico"} />
          ) : null}
        </div>
      </Dialogo>
    </>
  );
}

function BugLedgerTable({ entries, includeScope }: { entries: BugLedgerEntry[]; includeScope: boolean }) {
  if (entries.length === 0) return <div style={style.empty}>No hay registros.</div>;
  return (
    <div style={style.tableWrap}>
      <table style={style.table}>
        <thead>
          <tr>
            {includeScope ? <th style={style.th}>Alcance</th> : null}
            <th style={style.th}>Tipo</th>
            <th style={style.th}>Estado</th>
            <th style={style.th}>ID</th>
            <th style={style.th}>Resumen</th>
            <th style={style.th}>Resolución</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={`${entry.scope}-${entry.id}`}>
              {includeScope ? <td style={style.tdMuted}>{entry.scope}</td> : null}
              <td style={style.tdMuted}>{entry.type}</td>
              <td style={style.td}>{entry.status}</td>
              <td style={style.tdMono}>{entry.id}</td>
              <td style={style.td}>{entry.text}</td>
              <td style={style.td}>{entry.resolution || entry.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function bugCaptureHabilitado(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_ENABLE_BUG_CAPTURE === "true";
}

function leerScreenshot(file: File): Promise<ScreenshotAdjunto> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({
      id: crearIdLocal(),
      name: file.name || "captura",
      type: file.type || "image/png",
      size: file.size,
      dataUrl: String(reader.result ?? ""),
    });
    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.readAsDataURL(file);
  });
}

function imagenesDesdeClipboard(event: ClipboardEvent): File[] {
  const data = event.clipboardData;
  if (!data) return [];
  const files = Array.from(data.files).filter((file) => file.type.startsWith("image/"));
  if (files.length > 0) return files;
  return Array.from(data.items)
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter((file): file is File => file !== null);
}

async function copiarTextoPortapapeles(texto: string): Promise<void> {
  try {
    await globalThis.navigator?.clipboard?.writeText(texto);
  } catch {
    // El reporte ya fue persistido; si el portapapeles no está disponible no
    // debe bloquear el cierre del flujo.
  }
}

function crearIdLocal(): string {
  try {
    return globalThis.crypto?.randomUUID?.() ?? `screenshot-${Date.now().toString(36)}`;
  } catch {
    return `screenshot-${Date.now().toString(36)}`;
  }
}

function formatearBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const style = {
  ledgerBody: {
    display: "grid",
    gap: tokens.spacing.md,
    minHeight: 280,
  },
  ledgerSummary: {
    display: "flex",
    gap: tokens.spacing.xs,
    alignItems: "center",
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink15}`,
    paddingBottom: tokens.spacing.sm,
  },
  tab: {
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink30}`,
    borderRadius: 0,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    padding: "8px 12px",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizeSm,
    fontWeight: tokens.typography.weightSemibold,
    cursor: "pointer",
  },
  tabActivo: {
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    borderRadius: 0,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    padding: "8px 12px",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizeSm,
    fontWeight: tokens.typography.weightSemibold,
    cursor: "pointer",
  },
  tableWrap: {
    maxHeight: "min(58vh, 560px)",
    overflow: "auto",
    border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizeXs,
  },
  th: {
    position: "sticky",
    top: 0,
    zIndex: 1,
    padding: "8px 10px",
    borderBottom: `${tokens.stroke.base}px solid ${tokens.colors.ink}`,
    background: tokens.colors.paper02,
    color: tokens.colors.ink70,
    textAlign: "left",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: tokens.typography.sizeXxs,
    fontWeight: tokens.typography.weightBold,
  },
  td: {
    verticalAlign: "top",
    padding: "9px 10px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    color: tokens.colors.ink,
    lineHeight: 1.35,
    wordBreak: "break-word",
  },
  tdMuted: {
    verticalAlign: "top",
    padding: "9px 10px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    color: tokens.colors.ink70,
    lineHeight: 1.35,
    wordBreak: "break-word",
  },
  tdMono: {
    verticalAlign: "top",
    padding: "9px 10px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.fontFamilyMono,
    fontSize: tokens.typography.sizeXxs,
    lineHeight: 1.35,
    wordBreak: "break-all",
  },
  body: {
    display: "grid",
    gap: tokens.spacing.md,
    color: tokens.colors.textoSecundario,
  },
  label: {
    display: "grid",
    gap: tokens.spacing.xs,
  },
  labelText: {
    color: tokens.colors.textoPrimario,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
  },
  textarea: {
    width: "100%",
    resize: "vertical",
    minHeight: 150,
    boxSizing: "border-box",
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.md,
    padding: tokens.spacing.md,
    background: tokens.colors.fondoInput,
    color: tokens.colors.textoPrimario,
    fontFamily: tokens.typography.familyChrome,
    fontSize: tokens.typography.sizes.md,
    lineHeight: 1.45,
    outlineColor: tokens.colors.acentoUi,
  },
  attachments: {
    display: "grid",
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    border: `1px solid ${tokens.colors.bordeSuave}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoElevado,
  },
  attachmentsHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacing.md,
  },
  hiddenInput: {
    display: "none",
  },
  empty: {
    color: tokens.colors.textoTerciario,
    fontSize: tokens.typography.sizes.sm,
  },
  lista: {
    display: "grid",
    gap: tokens.spacing.sm,
    margin: 0,
    padding: 0,
    listStyle: "none",
  },
  item: {
    display: "grid",
    gridTemplateColumns: "48px minmax(0, 1fr) auto 28px",
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoChrome,
  },
  thumb: {
    width: 48,
    height: 34,
    objectFit: "cover",
    border: `1px solid ${tokens.colors.bordeSuave}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoMuted,
  },
  fileName: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    color: tokens.colors.textoPrimario,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
  },
  fileSize: {
    color: tokens.colors.textoTerciario,
    fontSize: tokens.typography.sizes.xs,
  },
  removeButton: {
    width: 26,
    height: 26,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.control,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    cursor: "pointer",
  },
  primaryButton: {
    border: `1px solid ${tokens.colors.acentoUi}`,
    borderRadius: tokens.radii.control,
    background: tokens.colors.acentoUi,
    color: tokens.colors.fondoChrome,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    fontWeight: tokens.typography.weights.bold,
    cursor: "pointer",
  },
  secondaryButton: {
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.control,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
    fontWeight: tokens.typography.weights.semibold,
    cursor: "pointer",
  },
  error: {
    padding: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.errorBorde}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.errorFondo,
    color: tokens.colors.errorTexto,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
  },
  resultado: {
    display: "grid",
    gap: tokens.spacing.xs,
    padding: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.exitoBase}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.exitoFondo,
    color: tokens.colors.exitoTexto,
    fontSize: tokens.typography.sizes.sm,
  },
  resultadoId: {
    color: tokens.colors.textoPrimario,
    fontSize: tokens.typography.sizes.md,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
