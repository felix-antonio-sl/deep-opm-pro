import { useEffect, useState } from "preact/hooks";
import type { LenteConocimiento } from "../modelo/tipos";
import type { KnowledgeLens, TutorContentId, TutorIntervention } from "../tutor/tipos";
import { tokens } from "./tokens";
import { useTutorContent, type TutorSourceView } from "./useTutorContent";

interface TutorDetailsProps {
  contentId: TutorContentId;
  lenses?: readonly KnowledgeLens[];
  mostrarAhora?: boolean;
  rotuloCriterio?: string;
  abrirEnPrimerUso?: boolean;
  testId?: string;
}

export type CapaTutor = "criterio" | "fundamento";

/** Profundidad progresiva reutilizada dentro de la superficie propietaria.
 * Solo conserva preferencias de experiencia en localStorage; nunca toca Modelo. */
export function TutorDetails({
  contentId,
  lenses = [],
  mostrarAhora = true,
  rotuloCriterio = "Criterio",
  abrirEnPrimerUso = false,
  testId,
}: TutorDetailsProps) {
  const vista = useTutorContent(contentId, lenses);
  const [criterioAbierto, setCriterioAbierto] = useTutorDisclosurePreference(
    contentId,
    "criterio",
    abrirEnPrimerUso && !leerVisto(contentId),
  );
  const [fundamentoAbierto, setFundamentoAbierto] = useTutorDisclosurePreference(contentId, "fundamento");
  const idContenido = `tutor-inline-${contentId.replace(/[^a-z0-9-]/gi, "-")}`;

  useEffect(() => guardarVisto(contentId), [contentId]);

  return (
    <div
      data-testid={testId ?? `tutor-details-${contentId}`}
      data-tutor-content={contentId}
      id={idContenido}
      style={style.contenedor}
    >
      {vista ? (
        <div style={style.contenido}>
          {mostrarAhora ? <p style={style.ahora}>{vista.contenido.now}</p> : null}
          <details
            open={criterioAbierto}
            style={style.detalle}
            onToggle={(event) => {
              const abierto = event.currentTarget.open;
              setCriterioAbierto(abierto);
            }}
          >
            <summary>{rotuloCriterio}</summary>
            <p style={style.texto}>{vista.contenido.criterion}</p>
            {vista.contenido.lensDetails.map((detalle) => (
              <p key={detalle.lens} style={style.lente}>{detalle.criterion}</p>
            ))}
          </details>
          <details
            open={fundamentoAbierto}
            style={style.detalle}
            onToggle={(event) => {
              const abierto = event.currentTarget.open;
              setFundamentoAbierto(abierto);
            }}
          >
            <summary>Fundamento</summary>
            <TutorFoundationLinks referencias={vista.referencias} />
          </details>
        </div>
      ) : null}
    </div>
  );
}

/** Citas navegables para presenters que ya tienen una superficie propietaria
 * (pregunta guía o simulación) y no deben montar otro TutorDetails. */
export function TutorFoundationLinks({
  referencias,
  inline = false,
}: {
  referencias: readonly TutorSourceView[];
  inline?: boolean;
}) {
  if (inline) {
    return (
      <span style={style.fuentesInline}>
        {referencias.map((referencia, index) => (
          <span key={referencia.key}>
            {index > 0 ? " · " : null}
            <a href={referencia.href} target="_blank" rel="noreferrer" style={style.fuente}>
              {referencia.title} · {referencia.href}
            </a>
          </span>
        ))}
      </span>
    );
  }
  return (
    <ul style={style.fuentes}>
      {referencias.map((referencia) => (
        <li key={referencia.key}>
          <a href={referencia.href} target="_blank" rel="noreferrer" style={style.fuente}>
            {referencia.title} · {referencia.href}
          </a>
        </li>
      ))}
    </ul>
  );
}

interface TutorInterventionDetailsProps {
  intervention: TutorIntervention;
  rotuloCriterio?: string;
  abrirEnPrimerUso?: boolean;
  testId?: string;
}

/** Renderiza exactamente la intervención elegida por la política en la
 * superficie propietaria. Los atributos hacen falsable la decisión sin añadir
 * una segunda voz al copy contextual. */
export function TutorInterventionDetails({
  intervention,
  rotuloCriterio,
  abrirEnPrimerUso,
  testId,
}: TutorInterventionDetailsProps) {
  if (intervention.kind === "silent") return null;
  return (
    <div
      data-testid={testId}
      data-tutor-intervention={intervention.kind}
      data-tutor-action={intervention.actionId}
      data-tutor-priority={intervention.priority}
    >
      <TutorDetails
        contentId={intervention.contentId}
        lenses={intervention.activeLenses}
        mostrarAhora
        {...(rotuloCriterio === undefined ? {} : { rotuloCriterio })}
        abrirEnPrimerUso={abrirEnPrimerUso ?? false}
      />
    </div>
  );
}

const PREFIJO_MEMORIA = "opforja:tutor:profundidad";
const PREFIJO_VISTO = "opforja:tutor:visto";

function leerVisto(contentId: TutorContentId): boolean {
  try {
    return globalThis.localStorage?.getItem(`${PREFIJO_VISTO}:${contentId}`) === "si";
  } catch {
    return false;
  }
}

function guardarVisto(contentId: TutorContentId): void {
  try {
    globalThis.localStorage?.setItem(`${PREFIJO_VISTO}:${contentId}`, "si");
  } catch {
    // La guía sigue operable aunque el navegador no permita persistir preferencia.
  }
}

function leerCapa(contentId: TutorContentId, capa: CapaTutor, abrirPorDefecto = false): boolean {
  try {
    const valor = globalThis.localStorage?.getItem(claveCapa(contentId, capa));
    return valor === null || valor === undefined ? abrirPorDefecto : valor === "abierto";
  } catch {
    return abrirPorDefecto;
  }
}

function guardarCapa(contentId: TutorContentId, capa: CapaTutor, abierta: boolean): void {
  try {
    globalThis.localStorage?.setItem(claveCapa(contentId, capa), abierta ? "abierto" : "cerrado");
  } catch {
    // Storage puede estar deshabilitado; la profundidad sigue operable en sesión.
  }
}

export function useTutorDisclosurePreference(
  contentId: TutorContentId,
  capa: CapaTutor,
  abrirPorDefecto = false,
) {
  const [abierta, setAbierta] = useState(() => leerCapa(contentId, capa, abrirPorDefecto));
  useEffect(() => setAbierta(leerCapa(contentId, capa, abrirPorDefecto)), [contentId, capa, abrirPorDefecto]);
  const actualizar = (siguiente: boolean) => {
    setAbierta(siguiente);
    guardarCapa(contentId, capa, siguiente);
  };
  return [abierta, actualizar] as const;
}

function claveCapa(contentId: TutorContentId, capa: CapaTutor): string {
  return `${PREFIJO_MEMORIA}:${contentId}:${capa}`;
}

const style = {
  contenedor: {
    display: "grid",
    gap: `${tokens.spacing.xs}px`,
    minWidth: 0,
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.serif,
    fontSize: `${tokens.typography.fs.fs11}px`,
    lineHeight: 1.45,
  },
  contenido: { display: "grid", gap: `${tokens.spacing.xs}px` },
  ahora: { margin: 0, color: tokens.colors.inkMid },
  detalle: { minWidth: 0 },
  texto: { margin: "5px 0 0" },
  lente: { margin: "4px 0 0", fontStyle: "italic" },
  fuentes: { display: "grid", gap: "4px", margin: "5px 0 0", paddingLeft: "18px" },
  fuentesInline: { display: "inline" },
  fuente: {
    color: tokens.colors.inkSoft,
    fontFamily: tokens.typography.mono,
    fontSize: `${tokens.typography.fs.fs9}px`,
    overflowWrap: "anywhere",
  },
} satisfies Record<string, preact.JSX.CSSProperties>;

export function mapearLentesTutor(lentes: readonly LenteConocimiento[]): KnowledgeLens[] {
  return lentes.map((lente) => {
    if (lente === "sistemas") return "systems";
    if (lente === "salud") return "health";
    return "software";
  });
}
