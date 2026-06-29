// B5 (gesto de anclar) — Cinta de modo de biblioteca.
//
// Spec gobernante: docs/superpowers/specs/2026-06-29-gesto-anclar-puerta-design.md
// §2(d). Vive en el slot `topbar` de `CodexCanvasMount` (donde viven los
// banners de modo, p. ej. `BarraSimulacion`) y declara DOS estados según
// `readOnly`, ambos solo cuando el modelo abierto es biblioteca
// (`esBibliotecaAbierta`):
//
//   solo-lectura:  ⊙ Biblioteca «‹nombre›» · solo lectura      [ Editar biblioteca ]
//   editando:      ◉ Editando «‹nombre›» · los anclados verán un aviso [ Terminar edición ]
//
// El desbloqueo «Editar biblioteca» pide UNA confirmación (no por-edición: las
// confirmaciones por-edición entrenan a descartar avisos a ciegas, el
// anti-patrón que el Centinela combate). La gravedad la lleva el COPY, CERO
// crimson — la cinta de «editando» carga el peligro de ahí en adelante con
// tinta plena en el borde superior, no con color de alarma.
import type { JSX } from "preact";
import { useRef, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

/**
 * COPY exacto del diálogo de confirmación (spec §2(d)). Exportado para que el
 * gate lo falsee contra deriva textual: la advertencia es deliberadamente
 * tranquilizadora ("No se rompe nada: solo se enteran") — su trabajo es dar
 * fricción consciente sin alarmar.
 */
export const COPY_ADVERTENCIA_BIBLIOTECA =
  "Editar esta biblioteca puede hacer divergir los modelos anclados a ella. " +
  "La próxima vez que se abran, verán un aviso de cambio. No se rompe nada: solo se enteran.";

export function CintaBiblioteca(): JSX.Element | null {
  const esBibliotecaAbierta = useOpmStore((s) => s.esBibliotecaAbierta);
  const readOnly = useOpmStore((s) => s.readOnly);
  const nombre = useOpmStore((s) => s.modelo.nombre);
  const activarReadOnly = useOpmStore((s) => s.activarReadOnly);
  const [confirmando, setConfirmando] = useState(false);
  const cancelarRef = useRef<HTMLButtonElement>(null);

  // La cinta solo existe sobre una biblioteca; el resto de la app no la ve.
  if (!esBibliotecaAbierta) return null;

  const editando = !readOnly;

  return (
    <div
      data-testid="cinta-biblioteca"
      role="status"
      aria-live="polite"
      style={editando ? { ...s.cinta, ...s.cintaEditando } : s.cinta}
    >
      <span style={s.glifo} aria-hidden="true">{editando ? "◉" : "⊙"}</span>
      <span style={s.texto} data-testid="cinta-biblioteca-estado">
        {editando ? (
          <>
            Editando <span style={s.nombre}>{`«${nombre}»`}</span> {"·"} los anclados verán un aviso
          </>
        ) : (
          <>
            Biblioteca <span style={s.nombre}>{`«${nombre}»`}</span> {"·"} solo lectura
          </>
        )}
      </span>
      <span style={s.spacer} aria-hidden="true" />
      {editando ? (
        <button
          type="button"
          data-testid="cinta-biblioteca-terminar"
          style={s.accion}
          onClick={() => activarReadOnly(true)}
          title="Volver a solo lectura"
        >
          Terminar edición
        </button>
      ) : (
        <button
          type="button"
          data-testid="cinta-biblioteca-editar"
          style={s.accion}
          onClick={() => setConfirmando(true)}
        >
          Editar biblioteca
        </button>
      )}

      <Dialogo
        open={confirmando}
        title="Editar biblioteca"
        size="sm"
        onCancel={() => setConfirmando(false)}
        initialFocusRef={cancelarRef}
        testId="dialogo-editar-biblioteca"
        actions={(
          <>
            <DialogoAccion
              innerRef={cancelarRef}
              onClick={() => setConfirmando(false)}
              testId="dialogo-editar-biblioteca-cancelar"
            >
              Cancelar
            </DialogoAccion>
            <DialogoAccion
              tono="primaria"
              onClick={() => {
                activarReadOnly(false);
                setConfirmando(false);
              }}
              testId="dialogo-editar-biblioteca-confirmar"
            >
              Editar de todos modos
            </DialogoAccion>
          </>
        )}
      >
        <span data-testid="dialogo-editar-biblioteca-copy">{COPY_ADVERTENCIA_BIBLIOTECA}</span>
      </Dialogo>
    </div>
  );
}

const C = tokens.colors;
const T = tokens.typography;

// Estilos tinta-papel, sin sombras (gate `design:governance`), sin crimson. La
// diferencia solo-lectura → editando se comunica subiendo el peso del borde
// superior de hairline `ruleStrong` a 2px `ink` (más atención, mismo canal de
// tinta), nunca con color de alarma.
const s = {
  cinta: {
    display: "flex",
    alignItems: "center",
    gap: tokens.spacing.sm,
    padding: `6px ${tokens.spacing.md}px`,
    minHeight: 38,
    background: C.paperWarm,
    borderTop: `1px solid ${C.ruleStrong}`,
    borderBottom: `1px solid ${C.rule}`,
    fontFamily: T.serif,
    fontSize: T.fs.fs13,
    color: C.ink,
  },
  cintaEditando: {
    borderTop: `2px solid ${C.ink}`,
  },
  glifo: {
    fontFamily: T.mono,
    fontSize: T.fs.fs14,
    color: C.inkMid,
    lineHeight: 1,
    flex: "0 0 auto",
  },
  texto: {
    color: C.inkMid,
    minWidth: 0,
  },
  nombre: {
    color: C.ink,
    fontWeight: T.weights.bold,
  },
  spacer: {
    flex: "1 1 auto",
  },
  accion: {
    appearance: "none",
    border: `1px solid ${C.ruleStrong}`,
    borderRadius: 0,
    background: "transparent",
    color: C.ink,
    fontFamily: T.serif,
    fontSize: T.fs.fs13,
    lineHeight: tokens.typography.lh.tight,
    letterSpacing: tokens.typography.ls.body,
    padding: "3px 10px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    flex: "0 0 auto",
    transition: tokens.transitions.fast,
  },
} satisfies Record<string, JSX.CSSProperties>;
