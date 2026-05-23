// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { useModalImagenObjetoViewModel } from "../app/viewmodels/modalImagenObjetoViewModel";
import { precargarBitmap, registrarCacheImagen, validarUrlImagen } from "../modelo/imagenObjeto";
import type { ImagenEntidad, ModoImagenEntidad } from "../modelo/tipos";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

const TIPOS_LOCALES_PERMITIDOS = new Set(["image/png", "image/jpeg", "image/gif", "image/webp"]);

const MODOS: Array<{ value: ModoImagenEntidad; label: string }> = [
  { value: "imagen-texto", label: "Imagen + texto" },
  { value: "imagen", label: "Imagen" },
  { value: "texto", label: "Texto" },
];

export function ModalImagenObjeto() {
  const { abierto, entidad, cerrar, editar, quitar } = useModalImagenObjetoViewModel();
  const imagenActual = entidad?.imagen;
  const [url, setUrl] = useState("");
  const [modo, setModo] = useState<ModoImagenEntidad>("imagen-texto");
  const [error, setError] = useState<string | null>(null);
  const [previewFallida, setPreviewFallida] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [archivoLocalNombre, setArchivoLocalNombre] = useState<string | null>(null);

  useEffect(() => {
    setUrl(imagenActual?.url ?? "");
    setModo(imagenActual?.modo ?? "imagen-texto");
    setError(null);
    setPreviewFallida(false);
    setGuardando(false);
    setArchivoLocalNombre(null);
  }, [abierto, imagenActual?.modo, imagenActual?.url]);

  const validacion = url.trim() ? validarUrlImagen(url) : null;
  const errorValidacion = validacion && !validacion.ok ? validacion.error : null;

  const confirmar = async () => {
    if (!entidad || entidad.tipo !== "objeto") return;
    const validado = validarUrlImagen(url);
    if (!validado.ok) {
      setError(validado.error);
      return;
    }
    setGuardando(true);
    const bitmap = await precargarBitmap(validado.value);
    const cache = registrarCacheImagen(validado.value, bitmap ? "ok" : "fallido");
    const imagen: ImagenEntidad = {
      url: validado.value,
      modo: bitmap ? modo : "texto",
      cache,
    };
    editar(entidad.id, imagen);
    setGuardando(false);
  };

  const cargarArchivoLocal = async (file: File | undefined) => {
    if (!file) return;
    if (!TIPOS_LOCALES_PERMITIDOS.has(file.type)) {
      setError("La imagen local debe ser PNG, JPG, GIF o WebP");
      return;
    }
    try {
      const dataUrl = await leerArchivoComoDataUrl(file);
      const validado = validarUrlImagen(dataUrl);
      if (!validado.ok) {
        setError(validado.error);
        return;
      }
      setUrl(validado.value);
      setArchivoLocalNombre(file.name);
      setError(null);
      setPreviewFallida(false);
    } catch {
      setError("No se pudo leer la imagen local");
    }
  };

  return (
    <Dialogo
      open={abierto !== null}
      title={`Imagen de ${entidad?.nombre ?? "objeto"}`}
      onCancel={cerrar}
      actions={(
        <>
          {imagenActual ? (
            <button type="button" style={style.dangerButton} onClick={() => entidad && quitar(entidad.id)}>
              Quitar
            </button>
          ) : null}
          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
          <button type="button" style={style.primaryButton} onClick={confirmar} disabled={guardando}>
            {guardando ? "Verificando..." : "Confirmar"}
          </button>
        </>
      )}
    >
      <div data-testid="modal-imagen-objeto" style={style.body}>
        <label style={style.field}>
          <span style={style.label}>URL pública o imagen local</span>
          <input
            aria-label="URL de imagen"
            style={error || errorValidacion ? style.inputError : style.input}
            value={url}
            placeholder="https://example.com/imagen.png"
            onInput={(event) => {
              setUrl(event.currentTarget.value);
              setArchivoLocalNombre(null);
              setError(null);
              setPreviewFallida(false);
            }}
          />
        </label>
        <label style={style.fileField}>
          <span style={style.fileButton}>Imagen local</span>
          <input
            aria-label="Imagen local"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            style={style.fileInput}
            onChange={(event) => void cargarArchivoLocal(event.currentTarget.files?.[0])}
          />
          <span style={style.fileName}>{archivoLocalNombre ?? "Sin archivo"}</span>
        </label>
        <div style={style.modos} role="radiogroup" aria-label="Modo de imagen">
          {MODOS.map((item) => (
            <label key={item.value} style={modo === item.value ? style.modoActivo : style.modo}>
              <input
                type="radio"
                name="modo-imagen"
                value={item.value}
                checked={modo === item.value}
                onChange={() => setModo(item.value)}
              />
              {item.label}
            </label>
          ))}
        </div>
        <div style={style.preview}>
          {validacion?.ok ? (
            <img
              src={validacion.value}
              alt=""
              style={style.image}
              onError={() => setPreviewFallida(true)}
              onLoad={() => setPreviewFallida(false)}
            />
          ) : (
            <span style={style.empty}>Sin previsualización</span>
          )}
        </div>
        {error || errorValidacion || previewFallida ? (
          <div style={style.error}>
            {error ?? errorValidacion ?? "URL no accesible para previsualización; se guardará en modo texto si falla al verificar."}
          </div>
        ) : null}
      </div>
    </Dialogo>
  );
}

// Ronda 28 L5: Bauhaus monocromático. Danger = cinabrio (accent + accentDark
// para texto WCAG-AA sobre paper). Modos activo/inactivo con borde 1.5px ink
// vs 1px ink-15.
const style = {
  body: { display: "grid", gap: "14px", minWidth: "min(560px, calc(100vw - 80px))" },
  field: { display: "grid", gap: "6px" },
  label: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  input: { height: "34px", padding: "0 10px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.accent },
  inputError: { height: "34px", padding: "0 10px", border: `${tokens.stroke.base}px solid ${tokens.colors.accent}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.accent },
  modos: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" },
  modo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "34px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400, cursor: "pointer" },
  modoActivo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "34px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500, cursor: "pointer" },
  preview: { display: "grid", placeItems: "center", height: "190px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.ink04, overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "contain" },
  empty: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400 },
  error: { color: tokens.colors.accent, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  fileField: { display: "grid", gridTemplateColumns: "max-content minmax(0, 1fr)", alignItems: "center", gap: "10px" },
  fileButton: { display: "inline-flex", alignItems: "center", justifyContent: "center", height: "34px", padding: "0 14px", border: `1px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  fileInput: { position: "absolute", width: "1px", height: "1px", opacity: 0, pointerEvents: "none" },
  fileName: { minWidth: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  primaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink, color: tokens.colors.paper, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  secondaryButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  dangerButton: { minHeight: "32px", padding: "8px 18px", border: `${tokens.stroke.base}px solid ${tokens.colors.accent}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.accentDark, cursor: "pointer", fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
} satisfies Record<string, preact.JSX.CSSProperties>;

function leerArchivoComoDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("No se pudo leer la imagen local"));
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("No se pudo leer la imagen local"));
    };
    reader.readAsDataURL(file);
  });
}
