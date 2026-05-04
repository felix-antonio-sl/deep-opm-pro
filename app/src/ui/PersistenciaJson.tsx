import { useEffect, useMemo, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { hidratarModelo } from "../serializacion/json";
import type { Modelo } from "../modelo/tipos";
import { useConfirmarSiDirty } from "./DialogoConfirmacion";

type VistaPreviaImportacion = { ok: true; texto: string } | { ok: false; error: string };

export function PersistenciaJson() {
  const exportarJson = useOpmStore((s) => s.exportarJson);
  const importarJson = useOpmStore((s) => s.importarJson);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const listarModelosGuardados = useOpmStore((s) => s.listarModelosGuardados);
  const cargarLocal = useOpmStore((s) => s.cargarLocal);
  const borrarLocal = useOpmStore((s) => s.borrarLocal);
  const [texto, setTexto] = useState("");
  const [archivoNombre, setArchivoNombre] = useState("");
  const [errorImportacion, setErrorImportacion] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [modeloSeleccionadoId, setModeloSeleccionadoId] = useState("");
  const modeloSeleccionado = modeloSeleccionadoId || modelosGuardados[0]?.id || "";
  const vistaPrevia = useMemo(() => (texto.trim() ? obtenerVistaPreviaImportacion(texto) : null), [texto]);
  const mensajeError = errorImportacion ?? (vistaPrevia?.ok === false ? vistaPrevia.error : null);
  const { confirmarSiDirty, dialogoConfirmacion } = useConfirmarSiDirty();

  useEffect(() => {
    listarModelosGuardados();
  }, [listarModelosGuardados]);

  useEffect(() => {
    if (!modeloSeleccionadoId && modelosGuardados[0]?.id) setModeloSeleccionadoId(modelosGuardados[0].id);
    if (modeloSeleccionadoId && !modelosGuardados.some((modelo) => modelo.id === modeloSeleccionadoId)) {
      setModeloSeleccionadoId(modelosGuardados[0]?.id ?? "");
    }
  }, [modeloSeleccionadoId, modelosGuardados]);

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
    const validacion = validarImportacionActual(texto);
    if (!validacion.ok) {
      setErrorImportacion(validacion.error);
      return;
    }
    setErrorImportacion(null);
    confirmarSiDirty(() => {
      importarJson(texto);
      setErrorImportacion(null);
    });
  };

  return (
    <div style={style.block}>
      <div style={style.title}>Modelos locales</div>
      <div style={style.actions}>
        <select
          aria-label="Modelo local"
          style={style.select}
          value={modeloSeleccionado}
          onChange={(event) => setModeloSeleccionadoId(event.currentTarget.value)}
        >
          {modelosGuardados.length === 0 ? <option value="">Sin modelos</option> : null}
          {modelosGuardados.map((modelo) => (
            <option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>
          ))}
        </select>
        <button
          type="button"
          style={modeloSeleccionado ? style.button : style.disabledButton}
          disabled={!modeloSeleccionado}
          onClick={() => confirmarSiDirty(() => cargarLocal(modeloSeleccionado))}
        >
          Cargar
        </button>
        <button type="button" style={modeloSeleccionado ? style.button : style.disabledButton} disabled={!modeloSeleccionado} onClick={() => borrarLocal(modeloSeleccionado)}>Borrar</button>
      </div>
      <div style={style.title}>JSON</div>
      <div style={style.actions}>
        <button
          type="button"
          style={style.button}
          onClick={() => {
            setTexto(exportarJson());
            setArchivoNombre("");
            setErrorImportacion(null);
          }}
        >
          Exportar
        </button>
        <button type="button" style={style.button} onClick={manejarImportar}>Importar</button>
      </div>
      <label style={style.filePicker}>
        <span style={style.fileLabel}>Archivo JSON</span>
        <input
          aria-label="Archivo JSON"
          style={style.fileInput}
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            void manejarArchivo(event.currentTarget.files?.[0] ?? null);
            event.currentTarget.value = "";
          }}
        />
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
        style={style.textarea}
        value={texto}
        spellcheck={false}
        onInput={(event) => {
          setTexto(event.currentTarget.value);
          setArchivoNombre("");
          setErrorImportacion(null);
        }}
      />
      {dialogoConfirmacion}
    </div>
  );
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

const style = {
  block: {
    display: "grid",
    gap: "8px",
    marginTop: "18px",
    paddingTop: "14px",
    borderTop: "1px solid #e4eaf1",
  },
  title: {
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  actions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    height: "30px",
    padding: "0 10px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#1f2937",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: 600,
  },
  disabledButton: {
    height: "30px",
    padding: "0 10px",
    border: "1px solid #d9e0ea",
    borderRadius: "4px",
    background: "#f2f4f7",
    color: "#98a2b3",
    cursor: "default",
    fontSize: "12px",
    fontWeight: 600,
  },
  select: {
    minWidth: 0,
    flex: "1 1 auto",
    height: "30px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "12px",
  },
  filePicker: {
    display: "grid",
    gap: "4px",
  },
  fileLabel: {
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  fileInput: {
    width: "100%",
    color: "#1f2937",
    fontSize: "12px",
  },
  dropZone: {
    display: "grid",
    placeItems: "center",
    minHeight: "42px",
    border: "1px dashed #c8d2df",
    borderRadius: "4px",
    background: "#f9fbfd",
    color: "#475467",
    fontSize: "12px",
    fontWeight: 700,
  },
  dropZoneActive: {
    display: "grid",
    placeItems: "center",
    minHeight: "42px",
    border: "1px dashed #147aa5",
    borderRadius: "4px",
    background: "#e8f7ff",
    color: "#0f5f82",
    fontSize: "12px",
    fontWeight: 700,
  },
  meta: {
    color: "#667085",
    fontSize: "12px",
    lineHeight: 1.35,
  },
  preview: {
    padding: "8px",
    border: "1px solid #b9c5d4",
    borderRadius: "4px",
    background: "#eef8ff",
    color: "#0f5f82",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.35,
  },
  error: {
    padding: "8px",
    border: "1px solid #f1b8b8",
    borderRadius: "4px",
    background: "#fff5f5",
    color: "#b42318",
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.35,
  },
  textarea: {
    width: "100%",
    minHeight: "120px",
    resize: "vertical",
    padding: "8px",
    border: "1px solid #c8d2df",
    borderRadius: "4px",
    color: "#1f2937",
    background: "#ffffff",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    fontSize: "11px",
    lineHeight: 1.4,
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
