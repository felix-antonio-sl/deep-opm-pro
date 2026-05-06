import { useEffect, useState } from "preact/hooks";
import { precargarBitmap, registrarCacheImagen, validarUrlImagen } from "../modelo/imagenObjeto";
import type { ImagenEntidad, ModoImagenEntidad } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";

const MODOS: Array<{ value: ModoImagenEntidad; label: string }> = [
  { value: "imagen-texto", label: "Imagen + texto" },
  { value: "imagen", label: "Imagen" },
  { value: "texto", label: "Texto" },
];

export function ModalImagenObjeto() {
  const abierto = useOpmStore((s) => s.modalImagenAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const cerrar = useOpmStore((s) => s.cerrarModalImagen);
  const editar = useOpmStore((s) => s.editarImagenEntidad);
  const quitar = useOpmStore((s) => s.quitarImagenEntidad);
  const entidad = abierto ? modelo.entidades[abierto] : undefined;
  const imagenActual = entidad?.imagen;
  const [url, setUrl] = useState("");
  const [modo, setModo] = useState<ModoImagenEntidad>("imagen-texto");
  const [error, setError] = useState<string | null>(null);
  const [previewFallida, setPreviewFallida] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setUrl(imagenActual?.url ?? "");
    setModo(imagenActual?.modo ?? "imagen-texto");
    setError(null);
    setPreviewFallida(false);
    setGuardando(false);
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
          <span style={style.label}>URL pública</span>
          <input
            aria-label="URL de imagen"
            style={error || errorValidacion ? style.inputError : style.input}
            value={url}
            placeholder="https://example.com/imagen.png"
            onInput={(event) => {
              setUrl(event.currentTarget.value);
              setError(null);
              setPreviewFallida(false);
            }}
          />
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

const style = {
  body: { display: "grid", gap: "10px", minWidth: "min(560px, calc(100vw - 80px))" },
  field: { display: "grid", gap: "6px" },
  label: { color: "#475467", fontSize: "12px", fontWeight: 800 },
  input: { height: "34px", padding: "0 10px", border: "1px solid #c8d2df", borderRadius: "4px", fontSize: "13px" },
  inputError: { height: "34px", padding: "0 10px", border: "1px solid #d92d20", borderRadius: "4px", fontSize: "13px" },
  modos: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" },
  modo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#f9fbfd", color: "#475467", fontSize: "12px", fontWeight: 700 },
  modoActivo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", border: "1px solid #586D8C", borderRadius: "4px", background: "#e8eef5", color: "#1f2937", fontSize: "12px", fontWeight: 800 },
  preview: { display: "grid", placeItems: "center", height: "190px", border: "1px solid #d9e0ea", borderRadius: "4px", background: "#f8fafc", overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "contain" },
  empty: { color: "#667085", fontSize: "13px", fontWeight: 700 },
  error: { color: "#b42318", fontSize: "12px", fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 12px", border: "1px solid #586D8C", borderRadius: "4px", background: "#586D8C", color: "#ffffff", cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 12px", border: "1px solid #c8d2df", borderRadius: "4px", background: "#ffffff", color: "#475467", cursor: "pointer", fontWeight: 700 },
  dangerButton: { height: "34px", padding: "0 12px", border: "1px solid #f2b8b5", borderRadius: "4px", background: "#fff5f5", color: "#b42318", cursor: "pointer", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
