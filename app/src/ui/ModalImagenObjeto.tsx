// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { useModalImagenObjetoViewModel } from "../app/viewmodels/modalImagenObjetoViewModel";
import { precargarBitmap, registrarCacheImagen, validarUrlImagen } from "../modelo/imagenObjeto";
import type { ImagenEntidad, ModoImagenEntidad } from "../modelo/tipos";
import { Dialogo } from "./Dialogo";
import { tokens } from "./tokens";

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
  label: { color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 800 },
  input: { height: "34px", padding: "0 10px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, fontSize: "13px" },
  inputError: { height: "34px", padding: "0 10px", border: `1px solid ${tokens.colors.errorBase}`, borderRadius: tokens.radii.sm, fontSize: "13px" },
  modos: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" },
  modo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoCard, color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 700 },
  modoActivo: { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutralSuave, color: tokens.colors.textoPrimario, fontSize: "12px", fontWeight: 800 },
  preview: { display: "grid", placeItems: "center", height: "190px", border: `1px solid ${tokens.colors.bordeIntermedio}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoElevado, overflow: "hidden" },
  image: { width: "100%", height: "100%", objectFit: "contain" },
  empty: { color: tokens.colors.textoTerciario, fontSize: "13px", fontWeight: 700 },
  error: { color: tokens.colors.errorTexto, fontSize: "12px", fontWeight: 700 },
  primaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.chromeNeutral}`, borderRadius: tokens.radii.sm, background: tokens.colors.chromeNeutral, color: tokens.colors.fondoChrome, cursor: "pointer", fontWeight: 700 },
  secondaryButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.bordeControl}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome, color: tokens.colors.textoSecundario, cursor: "pointer", fontWeight: 700 },
  dangerButton: { height: "34px", padding: "0 12px", border: `1px solid ${tokens.colors.errorBorde}`, borderRadius: tokens.radii.sm, background: tokens.colors.errorFondo, color: tokens.colors.errorTexto, cursor: "pointer", fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
