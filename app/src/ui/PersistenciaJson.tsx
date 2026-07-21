// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useMemo, useState } from "preact/hooks";
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { useZustandWorkspacePort } from "../app/ports/zustandWorkspacePort";
import { hidratarModelo } from "../serializacion/json";
import type { Modelo } from "../modelo/tipos";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { useOpmStore } from "../store";
import { runTutorPolicy } from "../tutor/politica";
import type { PersistenceIntentSnapshot } from "../tutor/tipos";
import { tokens } from "./tokens";
import { TutorInterventionDetails } from "./TutorDetails";

type VistaPreviaImportacion = { ok: true; texto: string } | { ok: false; error: string };

interface PersistenciaJsonProps {
  onImported?: () => void;
  mostrarModelosLocales?: boolean;
}

export function PersistenciaJson({ onImported, mostrarModelosLocales = true }: PersistenciaJsonProps) {
  const persistencia = useZustandPersistencePort();
  const workspace = useZustandWorkspacePort();
  const [texto, setTexto] = useState("");
  const [archivoNombre, setArchivoNombre] = useState("");
  const [errorImportacion, setErrorImportacion] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [modeloSeleccionadoId, setModeloSeleccionadoId] = useState("");
  const [operacionTutor, setOperacionTutor] = useState<"import-active" | "import-new" | "export" | null>(null);
  const modeloSeleccionado = modeloSeleccionadoId || workspace.modelosGuardados[0]?.id || "";
  const vistaPrevia = useMemo(() => (texto.trim() ? obtenerVistaPreviaImportacion(texto) : null), [texto]);
  const mensajeError = errorImportacion ?? (vistaPrevia?.ok === false ? vistaPrevia.error : null);
  const confirmarSiDirty = useConfirmarSiDirty();
  const abrirPestanaImportandoJson = useOpmStore((s) => s.abrirPestanaImportandoJson);
  const intervencionTutor = operacionTutor && (operacionTutor === "export" || vistaPrevia?.ok)
    ? runTutorPolicy(
      construirSnapshotPersistencia(operacionTutor, persistencia.dirtyModelo),
      operacionTutor === "import-active" && persistencia.dirtyModelo
        ? [{ owner: "product", intentId: "persistence:import-active" }]
        : [],
    )
    : null;

  useEffect(() => {
    persistencia.listarModelosGuardados();
  }, [persistencia.listarModelosGuardados]);

  useEffect(() => {
    if (!modeloSeleccionadoId && workspace.modelosGuardados[0]?.id) setModeloSeleccionadoId(workspace.modelosGuardados[0].id);
    if (modeloSeleccionadoId && !workspace.modelosGuardados.some((modelo) => modelo.id === modeloSeleccionadoId)) {
      setModeloSeleccionadoId(workspace.modelosGuardados[0]?.id ?? "");
    }
  }, [modeloSeleccionadoId, workspace.modelosGuardados]);

  const manejarArchivo = async (file: File | null) => {
    if (!file) return;
    try {
      const contenido = await file.text();
      setTexto(contenido);
      setArchivoNombre(file.name);
      setErrorImportacion(null);
    } catch {
      setErrorImportacion("No se pudo leer el archivo JSON");
    }
  };

  const manejarImportar = () => {
    setOperacionTutor("import-active");
    const validacion = validarImportacionActual(texto);
    if (!validacion.ok) {
      setErrorImportacion(validacion.error);
      return;
    }
    setErrorImportacion(null);
    confirmarSiDirty(() => {
      persistencia.importarJson(texto);
      setErrorImportacion(null);
      onImported?.();
    });
  };

  const manejarImportarEnPestanaNueva = () => {
    setOperacionTutor("import-new");
    const validacion = validarImportacionActual(texto);
    if (!validacion.ok) {
      setErrorImportacion(validacion.error);
      return;
    }
    setErrorImportacion(null);
    abrirPestanaImportandoJson(texto);
    onImported?.();
  };

  return (
    <div style={style.root}>
      {mostrarModelosLocales ? <div key="modelos-locales" style={style.block}>
        <div style={style.title}>Modelos locales</div>
        <div style={style.actions}>
          <select
            aria-label="Modelo local"
            style={style.select}
            value={modeloSeleccionado}
            onChange={(event) => setModeloSeleccionadoId(event.currentTarget.value)}
          >
            {workspace.modelosGuardados.length === 0 ? <option value="">Sin modelos</option> : null}
            {workspace.modelosGuardados.map((modelo) => (
              <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
            ))}
          </select>
          <button
            type="button"
            style={modeloSeleccionado ? style.button : style.disabledButton}
            disabled={!modeloSeleccionado}
            onClick={() => confirmarSiDirty(() => persistencia.cargarLocal(modeloSeleccionado))}
          >
            Cargar
          </button>
          <button type="button" style={modeloSeleccionado ? style.button : style.disabledButton} disabled={!modeloSeleccionado} onClick={() => persistencia.borrarLocal(modeloSeleccionado)}>Borrar</button>
        </div>
      </div> : null}

      <div key="json" style={style.block}>
        <div style={style.title}>JSON</div>
        <div style={style.actions}>
          <button
            type="button"
            style={style.button}
            onFocus={() => setOperacionTutor("export")}
            onClick={() => {
              setTexto(persistencia.exportarJson());
              setArchivoNombre("");
              setErrorImportacion(null);
            }}
          >
            Exportar
          </button>
          <button
            type="button"
            style={style.button}
            onFocus={() => setOperacionTutor("export")}
            onClick={() => {
              const json = persistencia.exportarJson();
              setTexto(json);
              setArchivoNombre("");
              setErrorImportacion(null);
              descargarJsonBackup(json);
            }}
          >
            Descargar JSON
          </button>
          <button type="button" data-tutor-entrypoint="workspace:import-active" style={style.button} onFocus={() => setOperacionTutor("import-active")} onClick={manejarImportar}>Importar y reemplazar pestaña activa</button>
          <button type="button" data-tutor-entrypoint="workspace:import-new-tab" style={style.button} onFocus={() => setOperacionTutor("import-new")} onClick={manejarImportarEnPestanaNueva}>Importar en pestaña nueva</button>
        </div>
      </div>

      <div key="tutor" style={style.tutorSlot}>
        {intervencionTutor ? (
          <TutorInterventionDetails intervention={intervencionTutor} abrirEnPrimerUso={false} testId="tutor-importacion-json" />
        ) : null}
      </div>

      <div key="archivo-json" style={style.block}>
        <div style={style.title}>Archivo JSON</div>
        <label style={style.filePicker}>
          <span style={style.filePickerRow}>
            <span style={style.filePickerButton}>Elegir archivo…</span>
            <span style={style.filePickerName} title={archivoNombre || "Sin archivo"}>
              {archivoNombre || "Sin archivo"}
            </span>
            <input
              aria-label="Archivo JSON"
              style={style.fileInputOculto}
              type="file"
              accept="application/json,.json"
              onChange={(event) => {
                void manejarArchivo(event.currentTarget.files?.[0] ?? null);
                event.currentTarget.value = "";
              }}
            />
          </span>
        </label>
        <div
          style={arrastrando ? style.dropZoneActive : style.dropZone}
          onDragEnter={(event) => {
            event.preventDefault();
            setArrastrando(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={(event) => {
            event.preventDefault();
            setArrastrando(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setArrastrando(false);
            void manejarArchivo(event.dataTransfer?.files?.[0] ?? null);
          }}
        >
          Soltar JSON
        </div>
        {archivoNombre ? <div style={style.meta}>Archivo: {archivoNombre}</div> : null}
        {vistaPrevia?.ok ? <div data-testid="import-preview" style={style.preview}>{vistaPrevia.texto}</div> : null}
        {mensajeError ? <div role="alert" style={style.error}>{mensajeError}</div> : null}
        <textarea
          data-testid="textarea-json"
          aria-label="Pegar JSON del modelo OPM"
          placeholder="Pega aquí el JSON del modelo o usa Importar/Soltar JSON"
          style={style.textarea}
          value={texto}
          spellcheck={false}
          onInput={(event) => {
            setTexto(event.currentTarget.value);
            setArchivoNombre("");
            setErrorImportacion(null);
          }}
        />
      </div>
    </div>
  );
}

function construirSnapshotPersistencia(
  operation: "import-active" | "import-new" | "export",
  hasUnsavedChanges: boolean,
): PersistenceIntentSnapshot {
  const base = {
    kind: "persistence" as const,
    intentId: `persistence:${operation}`,
    interactionMode: "editable" as const,
    hasUnsavedChanges,
    destructiveConfirmed: false,
    phase: "decision" as const,
  };
  if (operation === "import-active") {
    return { ...base, operation, actionId: "workspace:import-active", surface: "workspace-manager" };
  }
  if (operation === "import-new") {
    return { ...base, operation, actionId: "workspace:import-new-tab", surface: "workspace-manager" };
  }
  return { ...base, operation, actionId: "palette:exportar-json", surface: "command-palette" };
}

function validarImportacionActual(texto: string): VistaPreviaImportacion {
  if (!texto.trim()) return { ok: false, error: "Pega o selecciona un JSON de modelo" };
  return obtenerVistaPreviaImportacion(texto);
}

function obtenerVistaPreviaImportacion(texto: string): VistaPreviaImportacion {
  const resultado = hidratarModelo(texto);
  if (!resultado.ok) return { ok: false, error: resultado.error };
  return { ok: true, texto: describirModelo(resultado.value) };
}

function describirModelo(modelo: Modelo): string {
  const entidades = Object.keys(modelo.entidades).length;
  const opds = Object.keys(modelo.opds).length;
  const enlaces = Object.keys(modelo.enlaces).length;
  return `Modelo "${modelo.nombre}" — ${cantidad(entidades, "entidad", "entidades")}, ${cantidad(opds, "OPD", "OPDs")}, ${cantidad(enlaces, "enlace", "enlaces")}`;
}

function cantidad(valor: number, singular: string, plural: string): string {
  return `${valor} ${valor === 1 ? singular : plural}`;
}

function descargarJsonBackup(json: string): void {
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");
  enlace.href = url;
  enlace.download = nombreArchivoBackupJson(json);
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  URL.revokeObjectURL(url);
}

function nombreArchivoBackupJson(json: string, now = new Date()): string {
  const nombre = nombreModeloDesdeJson(json) ?? "modelo-opm";
  return `${slugArchivo(nombre)}-${now.toISOString().slice(0, 10)}.json`;
}

function nombreModeloDesdeJson(json: string): string | null {
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const modelo = (parsed as { modelo?: unknown }).modelo;
    if (!modelo || typeof modelo !== "object") return null;
    const nombre = (modelo as { nombre?: unknown }).nombre;
    return typeof nombre === "string" && nombre.trim() ? nombre.trim() : null;
  } catch {
    return null;
  }
}

function slugArchivo(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "modelo-opm";
}

const style = {
  // Contenedor del componente: stack de tres tarjetas (Modelos locales / JSON / Archivo JSON).
  root: {
    display: "grid",
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.lg,
  },
  tutorSlot: { display: "contents" },
  // Cada tarjeta: borde + radio + padding tokenizados, fondo elevado.
  block: {
    display: "grid",
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    border: `1px solid ${tokens.colors.bordeChrome}`,
    borderRadius: tokens.radii.md,
    background: tokens.colors.fondoCard,
  },
  title: {
    color: tokens.colors.textoSecundario,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
  },
  actions: {
    display: "flex",
    gap: tokens.spacing.sm,
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    height: 30,
    padding: `0 ${tokens.spacing.sm}px`,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    cursor: "pointer",
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
  },
  disabledButton: {
    height: 30,
    padding: `0 ${tokens.spacing.sm}px`,
    border: `1px solid ${tokens.colors.bordeIntermedio}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoDeshabilitado,
    color: tokens.colors.textoDeshabilitado,
    cursor: "default",
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
  },
  select: {
    minWidth: 0,
    flex: "1 1 auto",
    height: 30,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoPrimario,
    fontSize: tokens.typography.sizes.sm,
  },
  // File picker custom: label envuelve la fila visible y el input oculto pero accesible.
  filePicker: {
    display: "block",
    cursor: "pointer",
  },
  filePickerRow: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    background: tokens.colors.fondoChrome,
    position: "relative",
  },
  filePickerButton: {
    display: "inline-block",
    padding: `${tokens.spacing.xs}px ${tokens.spacing.sm}px`,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoCard,
    color: tokens.colors.textoPrimario,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.semibold,
    whiteSpace: "nowrap",
    cursor: "pointer",
  },
  filePickerName: {
    flex: "1 1 auto",
    minWidth: 0,
    color: tokens.colors.textoSecundario,
    fontSize: tokens.typography.sizes.sm,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  // <input type=file> oculto visualmente pero accesible: preserva aria-label y permite
  // setInputFiles desde Playwright (smoke 01-carga-y-workspace).
  fileInputOculto: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
    pointerEvents: "none",
  },
  dropZone: {
    display: "grid",
    placeItems: "center",
    minHeight: 42,
    border: `1px dashed ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.fondoChrome,
    color: tokens.colors.textoSecundario,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
  },
  dropZoneActive: {
    display: "grid",
    placeItems: "center",
    minHeight: 42,
    border: `1px dashed ${tokens.colors.infoBorde}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.infoFondo,
    color: tokens.colors.infoTextoOscuro,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
  },
  meta: {
    color: tokens.colors.textoTerciario,
    fontSize: tokens.typography.sizes.sm,
    lineHeight: 1.35,
  },
  preview: {
    padding: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.bordeInput}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.infoFondoClaro,
    color: tokens.colors.infoTextoOscuro,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: 1.35,
  },
  error: {
    padding: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.errorBordeFuerte}`,
    borderRadius: tokens.radii.sm,
    background: tokens.colors.errorFondo,
    color: tokens.colors.errorTexto,
    fontSize: tokens.typography.sizes.sm,
    fontWeight: tokens.typography.weights.bold,
    lineHeight: 1.35,
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    resize: "vertical",
    padding: tokens.spacing.sm,
    border: `1px solid ${tokens.colors.bordeControl}`,
    borderRadius: tokens.radii.sm,
    color: tokens.colors.textoPrimario,
    background: tokens.colors.fondoChrome,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: tokens.typography.sizes.xs,
    lineHeight: 1.4,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
