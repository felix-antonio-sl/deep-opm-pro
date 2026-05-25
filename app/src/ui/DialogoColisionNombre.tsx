import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

export function DialogoColisionNombre() {
  const colisionPendiente = useOpmStore((s) => s.colisionPendiente);
  const modelo = useOpmStore((s) => s.modelo);
  const reutilizar = useOpmStore((s) => s.resolverColisionReutilizar);
  const renombrar = useOpmStore((s) => s.resolverColisionRenombrar);
  const cancelar = useOpmStore((s) => s.resolverColisionCancelar);
  const irAUbicacion = useOpmStore((s) => s.irAUbicacionColision);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nombreAlternativo, setNombreAlternativo] = useState("");

  useEffect(() => {
    if (!colisionPendiente) return;
    setNombreAlternativo(`${colisionPendiente.colision.nombre} 2`);
  }, [colisionPendiente]);

  const ubicacionPrincipal = colisionPendiente?.colision.ubicaciones[0] ?? null;
  const entidadExistente = colisionPendiente ? modelo.entidades[colisionPendiente.colision.entidadExistenteId] : null;
  const opdPrincipal = ubicacionPrincipal ? modelo.opds[ubicacionPrincipal.opdId] : null;
  const puedeReutilizar = colisionPendiente?.contexto === "creacion" && colisionPendiente.colision.mismoTipo;
  const tipoExistente = entidadExistente?.tipo === "proceso" ? "proceso" : "objeto";
  const accionPrimaria = puedeReutilizar ? "Reutilizar" : "Usar otro nombre";
  const nombreValido = nombreAlternativo.trim().length > 0;

  const resumenUbicaciones = useMemo(() => {
    const cantidad = colisionPendiente?.colision.ubicaciones.length ?? 0;
    if (cantidad === 0) return "sin apariciones visibles";
    if (cantidad === 1) return `1 aparición · ${opdPrincipal?.nombre ?? ubicacionPrincipal?.opdId ?? "OPD"}`;
    return `${cantidad} apariciones`;
  }, [colisionPendiente?.colision.ubicaciones.length, opdPrincipal?.nombre, ubicacionPrincipal?.opdId]);

  function confirmarAlternativo(event?: Event) {
    event?.preventDefault();
    if (!nombreValido) return;
    renombrar(nombreAlternativo.trim());
  }

  return (
    <Dialogo
      open={!!colisionPendiente}
      title="Nombre ya existe"
      onCancel={cancelar}
      initialFocusRef={inputRef}
      testId="dialogo-colision-nombre"
      actions={(
        <>
          {puedeReutilizar ? (
            <DialogoAccion tono="primaria" onClick={reutilizar}>{accionPrimaria}</DialogoAccion>
          ) : null}
          <DialogoAccion tono={puedeReutilizar ? "default" : "primaria"} disabled={!nombreValido} onClick={() => confirmarAlternativo()}>
            Usar otro nombre
          </DialogoAccion>
          {ubicacionPrincipal ? (
            <DialogoAccion onClick={() => irAUbicacion(ubicacionPrincipal.opdId)}>Ir a ubicación</DialogoAccion>
          ) : null}
          <DialogoAccion onClick={cancelar}>Cancelar</DialogoAccion>
        </>
      )}
    >
      <form onSubmit={confirmarAlternativo} style={style.form}>
        <p style={style.texto}>
          Ya existe un {tipoExistente} llamado <strong style={style.nombre}>{colisionPendiente?.colision.nombre}</strong>.
        </p>
        <p style={style.meta}>{resumenUbicaciones}</p>
        {puedeReutilizar ? (
          <p style={style.texto}>Puedes reutilizar la cosa existente como una nueva aparición o escribir un nombre distinto.</p>
        ) : (
          <p style={style.texto}>El nombre canónico debe ser único. Escribe una alternativa para continuar.</p>
        )}
        <label style={style.label}>
          <span>Nombre alternativo</span>
          <input
            ref={inputRef}
            aria-label="Nombre alternativo"
            value={nombreAlternativo}
            onInput={(event) => setNombreAlternativo(event.currentTarget.value)}
            style={style.input}
          />
        </label>
      </form>
    </Dialogo>
  );
}

const style = {
  form: {
    display: "grid",
    gap: "14px",
    minWidth: 0,
  },
  texto: {
    margin: 0,
    color: tokens.colors.inkMid,
  },
  nombre: {
    color: tokens.colors.ink,
    fontWeight: tokens.typography.weights.bold,
  },
  meta: {
    margin: 0,
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs10}px`,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  label: {
    display: "grid",
    gap: "6px",
    color: tokens.colors.inkMid,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs12}px`,
  },
  input: {
    minWidth: 0,
    border: "none",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    background: "transparent",
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs14}px`,
    outline: "none",
    padding: "6px 0",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;
