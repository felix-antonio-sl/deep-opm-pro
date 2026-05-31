import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import type { ModoReforzamientoOntologia, TerminoOntologia } from "../modelo/tipos";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

export function DialogoOntologia() {
  const abierto = useOpmStore((s) => s.dialogoOntologiaAbierto);
  const ontologia = useOpmStore((s) => s.modelo.ontologia);
  const cerrar = useOpmStore((s) => s.cerrarDialogoOntologia);
  const guardarOntologia = useOpmStore((s) => s.definirOntologiaOrganizacionalActual);
  const [modo, setModo] = useState<ModoReforzamientoOntologia>(ontologia?.modo ?? "none");
  const [texto, setTexto] = useState(serializarTerminos(ontologia?.terminos ?? []));

  useEffect(() => {
    if (!abierto) return;
    setModo(ontologia?.modo ?? "none");
    setTexto(serializarTerminos(ontologia?.terminos ?? []));
  }, [abierto, ontologia]);

  const guardar = () => {
    guardarOntologia({ modo, terminos: parsearTerminos(texto) });
  };
  const terminos = parsearTerminos(texto);
  const totalSinonimos = terminos.reduce((total, termino) => total + (termino.sinonimos?.length ?? 0), 0);

  return (
    <Dialogo
      open={abierto}
      title="Ontología"
      onCancel={cerrar}
      size="lg"
      testId="dialogo-ontologia"
      actions={(
        <>
          <DialogoAccion onClick={cerrar}>Cancelar</DialogoAccion>
          <DialogoAccion onClick={() => guardarOntologia(undefined)}>Desactivar</DialogoAccion>
          <DialogoAccion tono="primaria" onClick={guardar}>Guardar</DialogoAccion>
        </>
      )}
    >
      <div style={formStyles.body}>
        <label style={formStyles.field}>
          <span style={formStyles.label}>Modo</span>
          <select style={formStyles.input} value={modo} onChange={(event) => setModo(event.currentTarget.value as ModoReforzamientoOntologia)}>
            <option value="none">Sin control</option>
            <option value="suggest">Sugerir canónico</option>
            <option value="enforce">Reforzar canónico</option>
          </select>
        </label>
        <div style={formStyles.status} data-testid="ontologia-resumen">
          <span style={formStyles.statusStrong}>{etiquetaModo(modo)}</span>
          <span>{terminos.length} términos · {totalSinonimos} sinónimos</span>
        </div>
        <label style={formStyles.stack}>
          <span style={formStyles.label}>Términos</span>
          <textarea
            style={formStyles.textarea}
            value={texto}
            rows={8}
            placeholder={"Paciente = Usuario, Cliente\nSolicitud = Pedido"}
            onInput={(event) => setTexto(event.currentTarget.value)}
          />
        </label>
        <p style={formStyles.hint}>
          Una línea por término: canónico = sinónimo, sinónimo. Sugerir conserva el nombre escrito; reforzar reemplaza el sinónimo por el canónico.
        </p>
      </div>
    </Dialogo>
  );
}

function serializarTerminos(terminos: readonly TerminoOntologia[]): string {
  return terminos.map((termino) => {
    const sinonimos = termino.sinonimos?.join(", ");
    return sinonimos ? `${termino.canonico} = ${sinonimos}` : termino.canonico;
  }).join("\n");
}

function parsearTerminos(texto: string): TerminoOntologia[] {
  return texto.split(/\r?\n/)
    .map((linea) => linea.trim())
    .filter(Boolean)
    .map((linea) => {
      const [canonico = "", alias = ""] = linea.split("=");
      const sinonimos = alias.split(",").map((item) => item.trim()).filter(Boolean);
      return {
        canonico: canonico.trim(),
        ...(sinonimos.length > 0 ? { sinonimos } : {}),
      };
    });
}

function etiquetaModo(modo: ModoReforzamientoOntologia): string {
  if (modo === "suggest") return "Sugerir";
  if (modo === "enforce") return "Reforzar";
  return "Sin control";
}

const formStyles = {
  body: { display: "grid", gap: "14px", width: "100%" },
  field: { display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", alignItems: "center", gap: "10px" },
  stack: { display: "grid", gap: "8px" },
  label: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  input: { height: "32px", minWidth: 0, border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  textarea: { minHeight: "180px", resize: "vertical", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, padding: "10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", lineHeight: 1.45 },
  hint: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
  status: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "10px", alignItems: "center", padding: "8px 10px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
  statusStrong: { color: tokens.colors.ink, fontWeight: 700 },
} satisfies Record<string, preact.JSX.CSSProperties>;
