import { useEffect, useMemo, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { esRequisito } from "../modelo/estereotipos";
import type { EstadoSatisfaccionRequisito, Modelo, RequisitoEntidadMetadata } from "../modelo/tipos";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

export function DialogoRequisito() {
  const modo = useOpmStore((s) => s.dialogoRequisitoAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const enlaceSeleccionId = useOpmStore((s) => s.enlaceSeleccionId);
  const cerrar = useOpmStore((s) => s.cerrarDialogoRequisito);
  const crear = useOpmStore((s) => s.crearRequisitoEnOpd);
  const marcar = useOpmStore((s) => s.marcarSeleccionComoRequisito);
  const satisfacer = useOpmStore((s) => s.satisfacerSeleccionConRequisito);
  const [nombre, setNombre] = useState("Nuevo requisito");
  const [idLogico, setIdLogico] = useState("REQ-1");
  const [descripcion, setDescripcion] = useState("");
  const [dureza, setDureza] = useState<RequisitoEntidadMetadata["dureza"]>("hard");
  const [actor, setActor] = useState("");
  const [satisfaction, setSatisfaction] = useState<EstadoSatisfaccionRequisito>("pendiente");
  const requisitos = useMemo(
    () => Object.values(modelo.entidades).filter((entidad) => esRequisito(entidad) && entidad.requisito),
    [modelo.entidades],
  );
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState("");
  const target = describirTarget(modelo, seleccionId, enlaceSeleccionId);

  useEffect(() => {
    if (!modo) return;
    const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
    setNombre(modo === "crear" ? "Nuevo requisito" : entidad?.nombre ?? "Requisito");
    setIdLogico(entidad?.requisito?.idLogico ?? siguienteReqId(modelo));
    setDescripcion(entidad?.requisito?.descripcion ?? "");
    setDureza(entidad?.requisito?.dureza ?? "hard");
    setActor(entidad?.requisito?.actor ?? "");
    setSatisfaction(entidad?.requisito?.satisfaction ?? "pendiente");
    setRequisitoSeleccionado(requisitos[0]?.id ?? "");
  }, [modo, modelo, seleccionId, requisitos]);

  if (!modo) return null;

  const metadata = (): RequisitoEntidadMetadata => ({
    idLogico: idLogico.trim(),
    descripcion: descripcion.trim(),
    dureza,
    ...(actor.trim() ? { actor: actor.trim() } : {}),
    satisfaction,
  });
  const guardar = () => {
    if (modo === "crear") {
      crear({ nombre: nombre.trim(), metadata: metadata() });
      return;
    }
    if (modo === "marcar") {
      marcar(metadata());
      return;
    }
    satisfacer({
      requisitoEntidadId: requisitoSeleccionado,
      estado: satisfaction,
      ...(descripcion.trim() ? { descripcion: descripcion.trim() } : {}),
    });
  };
  const guardarDisabled = modo === "satisfacer"
    ? !requisitoSeleccionado
    : !idLogico.trim() || !descripcion.trim() || (modo === "crear" && !nombre.trim());

  return (
    <Dialogo
      open={!!modo}
      title={titulo(modo)}
      onCancel={cerrar}
      size="lg"
      testId="dialogo-requisito"
      actions={(
        <>
          <DialogoAccion onClick={cerrar}>Cancelar</DialogoAccion>
          <DialogoAccion tono="primaria" disabled={guardarDisabled} onClick={guardar}>Guardar</DialogoAccion>
        </>
      )}
    >
      <div style={formStyles.body}>
        {modo === "crear" ? (
          <>
            <label style={formStyles.field}>
              <span style={formStyles.label}>Nombre</span>
              <input style={formStyles.input} value={nombre} onInput={(event) => setNombre(event.currentTarget.value)} />
            </label>
            <p style={formStyles.hint}>{target.vinculable ? `Se vinculará a: ${target.label}` : "Se creará como requisito independiente."}</p>
          </>
        ) : null}
        {modo === "satisfacer" ? (
          <>
            <label style={formStyles.field}>
              <span style={formStyles.label}>Requisito</span>
              <select style={formStyles.input} value={requisitoSeleccionado} onChange={(event) => setRequisitoSeleccionado(event.currentTarget.value)}>
                {requisitos.map((entidad) => <option key={entidad.id} value={entidad.id}>{entidad.requisito?.idLogico} · {entidad.nombre}</option>)}
              </select>
            </label>
            <p style={formStyles.hint}>Target: {target.label}</p>
          </>
        ) : (
          <label style={formStyles.field}>
            <span style={formStyles.label}>ID</span>
            <input style={formStyles.input} value={idLogico} onInput={(event) => setIdLogico(event.currentTarget.value)} />
          </label>
        )}
        <label style={formStyles.stack}>
          <span style={formStyles.label}>{modo === "satisfacer" ? "Nota" : "Descripción"}</span>
          <textarea style={formStyles.textarea} rows={4} value={descripcion} onInput={(event) => setDescripcion(event.currentTarget.value)} />
        </label>
        {modo !== "satisfacer" ? (
          <>
            <label style={formStyles.field}>
              <span style={formStyles.label}>Dureza</span>
              <select style={formStyles.input} value={dureza} onChange={(event) => setDureza(event.currentTarget.value as RequisitoEntidadMetadata["dureza"])}>
                <option value="hard">hard</option>
                <option value="soft">soft</option>
              </select>
            </label>
            <label style={formStyles.field}>
              <span style={formStyles.label}>Actor</span>
              <input style={formStyles.input} value={actor} onInput={(event) => setActor(event.currentTarget.value)} />
            </label>
          </>
        ) : null}
        <label style={formStyles.field}>
          <span style={formStyles.label}>Estado</span>
          <select style={formStyles.input} value={satisfaction} onChange={(event) => setSatisfaction(event.currentTarget.value as EstadoSatisfaccionRequisito)}>
            <option value="pendiente">pendiente</option>
            <option value="satisface">satisface</option>
            <option value="parcial">parcial</option>
            <option value="no-satisface">no-satisface</option>
          </select>
        </label>
      </div>
    </Dialogo>
  );
}

function titulo(modo: "crear" | "marcar" | "satisfacer"): string {
  if (modo === "crear") return "Crear requisito";
  if (modo === "marcar") return "Marcar requisito";
  return "Satisfacer requisito";
}

function siguienteReqId(modelo: Modelo): string {
  const usados = new Set(Object.values(modelo.entidades).map((entidad) => entidad.requisito?.idLogico).filter(Boolean));
  for (let index = 1; index < 10000; index += 1) {
    const candidato = `REQ-${index}`;
    if (!usados.has(candidato)) return candidato;
  }
  return `REQ-${modelo.nextSeq}`;
}

function describirTarget(modelo: Modelo, seleccionId: string | null, enlaceSeleccionId: string | null): { label: string; vinculable: boolean } {
  if (seleccionId) {
    const entidad = modelo.entidades[seleccionId];
    if (!entidad) return { label: seleccionId, vinculable: false };
    if (esRequisito(entidad)) return { label: entidad.nombre, vinculable: false };
    return { label: `${entidad.nombre} (${entidad.tipo})`, vinculable: true };
  }
  if (enlaceSeleccionId) {
    const enlace = modelo.enlaces[enlaceSeleccionId];
    return { label: enlace ? `enlace ${enlace.tipo}` : enlaceSeleccionId, vinculable: !!enlace };
  }
  return { label: "sin selección", vinculable: false };
}

const formStyles = {
  body: { display: "grid", gap: "14px", width: "100%" },
  field: { display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", alignItems: "center", gap: "10px" },
  stack: { display: "grid", gap: "8px" },
  label: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  input: { height: "32px", minWidth: 0, border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  textarea: { minHeight: "96px", resize: "vertical", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, padding: "10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", lineHeight: 1.45 },
  hint: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
