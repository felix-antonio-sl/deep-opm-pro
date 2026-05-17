import { useRef, useState } from "preact/hooks";
import { useBugCaptureContext } from "../app/viewmodels/capturadorBugsViewModel";
import { Dialogo } from "./Dialogo";
import { useBreakpoint } from "./layoutResponsive";
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

export function CapturadorBugs() {
  const breakpoint = useBreakpoint();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [screenshots, setScreenshots] = useState<ScreenshotAdjunto[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultado, setResultado] = useState<BugCaptureResponse | null>(null);
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
      if (!response.ok || !body?.id || !body.path || !body.directory) {
        throw new Error(body?.error ?? "No se pudo guardar el reporte en el servidor local.");
      }
      setResultado({
        id: body.id,
        path: body.path,
        directory: body.directory,
        screenshots: typeof body.screenshots === "number" ? body.screenshots : screenshots.length,
      });
      setTexto("");
      setScreenshots([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el reporte.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <button
        type="button"
        aria-label="Capturar bug"
        title="Capturar bug · feedback al equipo"
        data-testid="bug-capture-open"
        style={fabStyle(breakpoint === "mobile")}
        onClick={abrir}
      >
        {/* P0-4 (informe UI/UX 2026-05-07): FAB en color chrome neutral
            (azul accent), no rojo de error metodologico. El rojo queda
            reservado a severidad de issues OPM. Cambia tambien el simbolo
            de "!" (alerta) a un icono de bocadillo de feedback inline SVG,
            congruente con la semantica "este es un canal de feedback".
            aria-label se mantiene "Capturar bug" para preservar smokes
            (regla 5.5 ronda 18: smokes intactos > reorganizacion). */}
        <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style.fabIcon}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

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
    </>
  );
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
  fab: {
    // P0-4: chrome neutral en vez de rojo error. El rojo queda reservado a
    // severidad de issues metodologicos en validacion OPM. Acentos UI
    // (azul `acentoUi`) para distinguir feedback como herramienta auxiliar.
    position: "fixed",
    right: tokens.spacing.lg,
    bottom: tokens.spacing.lg,
    zIndex: 920,
    width: 42,
    height: 42,
    display: "grid",
    placeItems: "center",
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.full,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.acentoUi,
    boxShadow: tokens.shadows.flotante,
    fontFamily: tokens.typography.familyChrome,
    cursor: "pointer",
  },
  fabIcon: {
    width: 20,
    height: 20,
    color: "currentColor",
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

function fabStyle(esMobile: boolean): preact.JSX.CSSProperties {
  if (!esMobile) return style.fab;
  return {
    ...style.fab,
    bottom: tokens.mobileNav.altoBarra + tokens.spacing.lg,
  };
}
