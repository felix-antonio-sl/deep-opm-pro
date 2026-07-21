import { useEffect, useRef, useState } from "preact/hooks";
import type {
  FichaTrabajo,
  LenteConocimiento,
  TipoModelo,
} from "../../modelo/tipos";
import { useOpmStore } from "../../store";
import {
  deriveFichaLocalIntent,
  deriveKnowledgeIntent,
  runTutorPolicy,
  type FichaLocalTutorState,
  type TutorEntrypointId,
} from "../../tutor";
import { inspectorStyles } from "../inspectorStyles";
import { tokens } from "../tokens";
import { TutorInterventionDetails, mapearLentesTutor } from "../TutorDetails";
import { SeccionDisclosure } from "./SeccionDisclosure";

const TIPOS: readonly { id: TipoModelo; label: string }[] = [
  { id: "dominio", label: "Dominio" },
  { id: "realizacion", label: "Realización" },
  { id: "introduccion-operacion", label: "Introducción / operación" },
];

const LENTES: readonly { id: LenteConocimiento; label: string }[] = [
  { id: "sistemas", label: "Sistemas" },
  { id: "software", label: "Software" },
  { id: "salud", label: "Salud" },
];

export function SeccionFichaTrabajo() {
  const ficha = useOpmStore((s) => s.modelo.fichaTrabajo);
  const procedencia = useOpmStore((s) => s.modelo.procedencia);
  const lentes = useOpmStore((s) => s.modelo.lentesConocimiento ?? []);
  const actualizarFicha = useOpmStore((s) => s.actualizarFichaTrabajo);
  const actualizarLentes = useOpmStore((s) => s.actualizarLentesConocimiento);
  const secuenciaResultado = useRef(0);
  const [ultimoCambio, setUltimoCambio] = useState<{
    field: CampoFichaTutor;
    resultId: string;
    expectedValue: string;
  } | null>(null);
  useEffect(() => {
    if (
      ultimoCambio
      && valorFichaTutor(ficha, lentes, ultimoCambio.field) !== ultimoCambio.expectedValue
    ) {
      setUltimoCambio(null);
    }
  }, [ficha, lentes, ultimoCambio]);
  const intervencionUpstream = runTutorPolicy(deriveKnowledgeIntent({
    intentId: "ficha:upstream",
    focus: "upstream-ficha",
    hasUpstreamProvenance: true,
    localEditorAvailable: false,
  }));
  const intervencionLocal = ultimoCambio
    ? runTutorPolicy(deriveFichaLocalIntent({
        intentId: `ficha:${ultimoCambio.field}`,
        field: ultimoCambio.field,
        phase: "committed",
        valueChanged: true,
        resultId: ultimoCambio.resultId,
        activeLenses: mapearLentesTutor(lentes),
      }))
    : null;

  const confirmarCambio = (field: CampoFichaTutor, expected: unknown, actualizar: () => void) => {
    actualizar();
    secuenciaResultado.current += 1;
    setUltimoCambio({
      field,
      resultId: `ficha:${field}:${secuenciaResultado.current}`,
      expectedValue: JSON.stringify(expected ?? null),
    });
  };

  if (procedencia) {
    return (
      <SeccionDisclosure titulo="Ficha de trabajo" colapsoId="modelo.ficha" testid="inspector-ficha-trabajo">
        <p
          style={style.notaUpstream}
          data-tutor-claim="product"
          data-tutor-intent="ficha:upstream"
          data-tutor-policy-kind={intervencionUpstream.kind}
        >
          Propiedad upstream · opforja no crea una ficha local paralela. Para cambiarla, re-elicita en la fuente autoral.
        </p>
        {ficha ? <FichaLectura ficha={ficha} /> : null}
      </SeccionDisclosure>
    );
  }

  const actualizarCampo = (field: CampoFichaTutor, campo: keyof FichaTrabajo, valor: string) => {
    const siguiente = fichaConCampo(ficha, campo, valor);
    confirmarCambio(field, siguiente[campo], () => actualizarFicha(siguiente));
  };

  return (
    <SeccionDisclosure titulo="Ficha de trabajo" colapsoId="modelo.ficha" testid="inspector-ficha-trabajo">
      <div style={style.cuerpo}>
        <p style={style.apoyo}>Completa solo lo que ayude a decidir. La ficha no emite OPL ni bloquea el modelado.</p>
        <CampoTexto
          label="Pregunta habilitante"
          entrypoint="inspector:ficha-pregunta-habilitante"
          value={ficha?.preguntaHabilitante ?? ""}
          onCommit={(value) => actualizarCampo("pregunta-habilitante", "preguntaHabilitante", value)}
        />
        <CampoTexto
          label="Dueño del significado"
          entrypoint="inspector:ficha-dueno-significado"
          value={ficha?.duenoSignificado ?? ""}
          onCommit={(value) => actualizarCampo("dueno-significado", "duenoSignificado", value)}
        />
        <CampoTexto
          label="Responsable de la decisión"
          entrypoint="inspector:ficha-responsable-decision"
          value={ficha?.responsableDecision ?? ""}
          onCommit={(value) => actualizarCampo("responsable-decision", "responsableDecision", value)}
        />
        <GrupoChecks
          label="Tipos de modelo"
          entrypoint="inspector:ficha-tipos-modelo"
          opciones={TIPOS}
          seleccionadas={ficha?.tiposModelo ?? []}
          onChange={(tiposModelo) => confirmarCambio("tipos-modelo", tiposModelo, () => actualizarFicha({ ...(ficha ?? {}), tiposModelo }))}
        />
        <CampoTexto
          label="Criterio de suficiencia"
          entrypoint="inspector:ficha-criterio-suficiencia"
          value={ficha?.criterioSuficiencia ?? ""}
          onCommit={(value) => actualizarCampo("criterio-suficiencia", "criterioSuficiencia", value)}
        />
        <label style={style.campo}>
          <span style={inspectorStyles.label}>Vida útil</span>
          <select
            aria-label="Vida útil"
            data-tutor-entrypoint="inspector:ficha-vida-util"
            style={inspectorStyles.input}
            value={ficha?.vidaUtil ?? ""}
            onKeyDown={reenviarUndoGlobalDesdeControl}
            onChange={(event) => {
              const value = event.currentTarget.value;
              const { vidaUtil: _previa, ...base } = ficha ?? {};
              confirmarCambio("vida-util", value || undefined, () => actualizarFicha(value
                ? { ...base, vidaUtil: value as NonNullable<FichaTrabajo["vidaUtil"]> }
                : base));
            }}
          >
            <option value="">Sin declarar</option>
            <option value="respuesta-puntual">Respuesta puntual</option>
            <option value="referencia-viva">Referencia viva</option>
          </select>
        </label>
        <CampoTexto
          label="Revisar cuando"
          entrypoint="inspector:ficha-revisar-cuando"
          value={ficha?.revisarCuando ?? ""}
          onCommit={(value) => actualizarCampo("revisar-cuando", "revisarCuando", value)}
        />
        <GrupoChecks
          label="Enfoques de conocimiento"
          entrypoint="inspector:ficha-lentes-conocimiento"
          opciones={LENTES}
          seleccionadas={lentes}
          onChange={(siguientes) => confirmarCambio("lentes-conocimiento", siguientes, () => actualizarLentes(siguientes))}
        />
        {intervencionLocal ? (
          <TutorInterventionDetails intervention={intervencionLocal} testId="tutor-ficha-trabajo" />
        ) : null}
      </div>
    </SeccionDisclosure>
  );
}

function CampoTexto(props: { label: string; entrypoint: TutorEntrypointId; value: string; onCommit: (value: string) => void }) {
  const [value, setValue] = useState(props.value);
  useEffect(() => setValue(props.value), [props.value]);
  return (
    <label style={style.campo}>
      <span style={inspectorStyles.label}>{props.label}</span>
      <textarea
        aria-label={props.label}
        data-tutor-entrypoint={props.entrypoint}
        style={{ ...inspectorStyles.input, ...style.textarea }}
        value={value}
        onInput={(event) => setValue(event.currentTarget.value)}
        onBlur={() => {
          if (value.trim() !== props.value) props.onCommit(value);
        }}
      />
    </label>
  );
}

function GrupoChecks<T extends string>(props: {
  label: string;
  entrypoint: TutorEntrypointId;
  opciones: readonly { id: T; label: string }[];
  seleccionadas: readonly T[];
  onChange: (values: T[]) => void;
}) {
  return (
    <fieldset style={style.fieldset}>
      <legend style={inspectorStyles.label}>{props.label}</legend>
      {props.opciones.map((opcion) => (
        <label key={opcion.id} style={style.check}>
          <input
            type="checkbox"
            data-tutor-entrypoint={props.entrypoint}
            checked={props.seleccionadas.includes(opcion.id)}
            onKeyDown={reenviarUndoGlobalDesdeControl}
            onChange={(event) => {
              const siguiente = event.currentTarget.checked
                ? [...props.seleccionadas, opcion.id]
                : props.seleccionadas.filter((id) => id !== opcion.id);
              props.onChange(siguiente);
            }}
          />
          <span>{opcion.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

type CampoFichaTutor = FichaLocalTutorState["field"];

function reenviarUndoGlobalDesdeControl(
  event: preact.JSX.TargetedKeyboardEvent<HTMLInputElement | HTMLSelectElement>,
): void {
  const ctrl = event.ctrlKey || event.metaKey;
  const key = event.key.toLowerCase();
  if (!ctrl || (key !== "z" && key !== "y")) return;
  event.preventDefault();
  event.stopPropagation();
  window.dispatchEvent(new KeyboardEvent("keydown", {
    key: event.key,
    code: event.code,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    shiftKey: event.shiftKey,
    altKey: event.altKey,
    bubbles: true,
    cancelable: true,
    composed: true,
  }));
}

function valorFichaTutor(
  ficha: FichaTrabajo | undefined,
  lentes: readonly LenteConocimiento[],
  field: CampoFichaTutor,
): string {
  if (field === "lentes-conocimiento") return JSON.stringify(lentes);
  const campoFicha: Record<Exclude<CampoFichaTutor, "lentes-conocimiento">, keyof FichaTrabajo> = {
    "pregunta-habilitante": "preguntaHabilitante",
    "dueno-significado": "duenoSignificado",
    "responsable-decision": "responsableDecision",
    "tipos-modelo": "tiposModelo",
    "criterio-suficiencia": "criterioSuficiencia",
    "vida-util": "vidaUtil",
    "revisar-cuando": "revisarCuando",
  };
  return JSON.stringify(ficha?.[campoFicha[field]] ?? null);
}

function FichaLectura({ ficha }: { ficha: FichaTrabajo }) {
  const lineas = Object.entries(ficha).filter(([, value]) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
  return (
    <dl style={style.lectura}>
      {lineas.map(([key, value]) => (
        <div key={key}>
          <dt style={inspectorStyles.label}>{rotuloCampo(key)}</dt>
          <dd style={style.valorLectura}>{Array.isArray(value) ? value.join(" · ") : String(value)}</dd>
        </div>
      ))}
    </dl>
  );
}

function fichaConCampo(
  ficha: FichaTrabajo | undefined,
  campo: keyof FichaTrabajo,
  valor: string,
): FichaTrabajo {
  const base = { ...(ficha ?? {}) } as Record<string, unknown>;
  if (valor.trim()) base[campo] = valor;
  else delete base[campo];
  return base as FichaTrabajo;
}

function rotuloCampo(campo: string): string {
  return campo.replace(/([A-Z])/g, " $1").toLocaleLowerCase("es");
}

const style = {
  cuerpo: { display: "grid", gap: `${tokens.spacing.sm}px` },
  apoyo: {
    margin: 0,
    color: tokens.colors.ink70,
    fontSize: `${tokens.typography.sizes.xs}px`,
    lineHeight: 1.45,
  },
  campo: { display: "grid", gap: `${tokens.spacing.xs}px` },
  textarea: { height: "54px", minHeight: "54px", resize: "vertical" },
  fieldset: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    margin: 0,
    padding: `${tokens.spacing.sm}px 0 0`,
    border: 0,
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
  },
  check: {
    display: "flex",
    alignItems: "center",
    gap: `${tokens.spacing.sm}px`,
    color: tokens.colors.ink70,
    fontSize: `${tokens.typography.sizes.sm}px`,
  },
  notaUpstream: {
    margin: 0,
    color: tokens.colors.ink70,
    fontSize: `${tokens.typography.sizes.xs}px`,
    lineHeight: 1.5,
  },
  lectura: { display: "grid", gap: `${tokens.spacing.sm}px`, margin: `${tokens.spacing.sm}px 0 0` },
  valorLectura: { margin: "2px 0 0", color: tokens.colors.ink70, fontSize: `${tokens.typography.sizes.sm}px` },
} satisfies Record<string, preact.JSX.CSSProperties>;
