import type { JSX, RefObject } from "preact";
import type {
  EtapaMesaExploracion,
  FuenteMesaExploracionViewModel,
  PreviewMesaExploracionViewModel,
  PropuestaMesaExploracionViewModel,
  TrazoMesaExploracionViewModel,
} from "../app/viewmodels/mesaExploracionViewModel";
import { useMesaExploracionViewModel } from "../app/viewmodels/mesaExploracionViewModel";
import { useEffect, useRef, useState } from "preact/hooks";
import { decodeMarkdownSource } from "../agent/markdownSource";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { TutorInterventionDetails } from "./TutorDetails";
import { tokens } from "./tokens";

interface DialogoMesaExploracionProps {
  open: boolean;
  onCerrar: () => void;
}

/**
 * Mesa preformal lineal del Apunte. La etapa se deriva de los registros meta;
 * los únicos estados locales son borradores de campo y navegación efímera.
 */
export function DialogoMesaExploracion({ open, onCerrar }: DialogoMesaExploracionProps) {
  const mesa = useMesaExploracionViewModel();
  const { etapa } = mesa;
  const [fuenteBorrador, setFuenteBorrador] = useState("");
  const [errorFuenteMarkdown, setErrorFuenteMarkdown] = useState<string | null>(null);
  const [trazoBorrador, setTrazoBorrador] = useState("");
  const [tipoElegido, setTipoElegido] = useState<"objeto" | "proceso" | null>(null);
  const [nombreBorrador, setNombreBorrador] = useState("");
  const [editandoTrazo, setEditandoTrazo] = useState(false);
  const [corrigiendoPropuesta, setCorrigiendoPropuesta] = useState(false);
  const [mostrandoFuente, setMostrandoFuente] = useState(false);
  const [confirmadoEnSesion, setConfirmadoEnSesion] = useState(false);
  const modeloAnterior = useRef(mesa.modeloRevision);
  const modeloIdAnterior = useRef(mesa.modeloId);
  const fuenteRef = useRef<HTMLTextAreaElement>(null);
  const trazoRef = useRef<HTMLTextAreaElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);

  // Si el modelo cambia mientras la Mesa está cerrada, ya no podemos afirmar
  // que la confirmación sea la cima del historial global.
  useEffect(() => {
    if (!open && modeloAnterior.current !== mesa.modeloRevision) setConfirmadoEnSesion(false);
    modeloAnterior.current = mesa.modeloRevision;
  }, [mesa.modeloRevision, open]);

  // Los borradores pertenecen al documento donde nacieron. Un commit dentro
  // del mismo modelo conserva el paso actual; cambiar de documento descarta
  // únicamente estado UI efímero y cierra una Mesa que hubiese quedado abierta.
  useEffect(() => {
    if (modeloIdAnterior.current === mesa.modeloId) return;
    modeloIdAnterior.current = mesa.modeloId;
    setFuenteBorrador("");
    setTrazoBorrador("");
    setTipoElegido(null);
    setNombreBorrador("");
    setEditandoTrazo(false);
    setCorrigiendoPropuesta(false);
    setMostrandoFuente(false);
    setConfirmadoEnSesion(false);
    if (open) onCerrar();
  }, [mesa.modeloId, onCerrar, open]);

  useEffect(() => {
    if (!open) return;
    const target = etapa === "fuente"
      ? fuenteRef.current
      : etapa === "trazo" || editandoTrazo
        ? trazoRef.current
        : tipoElegido || corrigiendoPropuesta
          ? nombreRef.current
          : null;
    const timer = window.setTimeout(() => target?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [open, etapa, editandoTrazo, tipoElegido, corrigiendoPropuesta]);

  const conservarFuente = () => {
    if (mesa.conservarFuente(fuenteBorrador)) {
      setFuenteBorrador("");
      setErrorFuenteMarkdown(null);
    }
  };
  const conservarArchivoMarkdown = async (file: File | null) => {
    if (!file) return;
    try {
      const source = decodeMarkdownSource(file.name, new Uint8Array(await file.arrayBuffer()));
      if (mesa.conservarFuente(source.content, { titulo: source.title, mediaType: source.mediaType })) setErrorFuenteMarkdown(null);
    } catch (error) {
      setErrorFuenteMarkdown(error instanceof Error ? error.message : "No se pudo conservar el archivo Markdown");
    }
  };
  const conservarTrazo = () => {
    if (mesa.conservarTrazo(trazoBorrador)) setTrazoBorrador("");
  };
  const guardarEdicionTrazo = () => {
    if (!mesa.trazo) return;
    mesa.editarTrazo(trazoBorrador);
    setEditandoTrazo(false);
  };
  const abrirEdicionTrazo = () => {
    if (!mesa.trazo) return;
    setTrazoBorrador(mesa.trazo.texto);
    setEditandoTrazo(true);
  };
  const previsualizar = () => {
    if (!mesa.trazo || !tipoElegido) return;
    if (mesa.crearPropuesta(tipoElegido, nombreBorrador)) {
      setNombreBorrador("");
      setTipoElegido(null);
    }
  };
  const guardarCorreccion = () => {
    if (!mesa.propuesta || !tipoElegido) return;
    mesa.editarPropuesta(tipoElegido, nombreRef.current?.value ?? nombreBorrador);
    setCorrigiendoPropuesta(false);
    setTipoElegido(null);
    setNombreBorrador("");
  };
  const abrirCorreccion = () => {
    if (!mesa.propuesta) return;
    setTipoElegido(mesa.propuesta.entidadTipo);
    setNombreBorrador(mesa.propuesta.nombre);
    setCorrigiendoPropuesta(true);
  };
  const confirmar = () => {
    if (mesa.confirmarPropuesta()) {
      setConfirmadoEnSesion(true);
      setMostrandoFuente(false);
    }
  };
  const irAlHecho = () => {
    if (mesa.irAlHecho()) onCerrar();
  };
  const deshacerConfirmacion = () => {
    if (!confirmadoEnSesion) return;
    mesa.deshacerConfirmacion();
    setConfirmadoEnSesion(false);
    setMostrandoFuente(false);
  };

  return (
    <Dialogo
      open={open}
      title="Mesa de exploración"
      onCancel={onCerrar}
      actions={accionesDeEtapa({
        etapa,
        fuenteBorrador,
        trazoBorrador,
        tipoElegido,
        nombreBorrador,
        editandoTrazo,
        corrigiendoPropuesta,
        mostrandoFuente,
        confirmadoEnSesion,
        targetDisponible: mesa.targetDisponible,
        previewError: mesa.preview?.error ?? null,
        onCerrar,
        guardarEdicionTrazo,
        confirmar,
        irAlHecho,
        setMostrandoFuente,
        deshacerConfirmacion,
      })}
      initialFocusRef={fuenteRef as RefObject<HTMLElement>}
      size="lg"
      testId="dialogo-mesa-exploracion"
    >
      <div style={style.raiz} data-tutor-capability="cap.exploration.preformal">
        <EstadoEtapa etapa={etapa} />

        {etapa !== "confirmado" ? (
          <TutorInterventionDetails
            intervention={mesa.intervention}
            abrirEnPrimerUso
            testId="tutor-mesa-exploracion"
          />
        ) : null}

        {etapa === "fuente" ? (
          <form id="mesa-form-fuente" onSubmit={(event) => { event.preventDefault(); conservarFuente(); }} style={style.paso}>
            <label for="mesa-fuente-texto" style={style.label}>¿Qué material original quieres conservar?</label>
            <p id="mesa-fuente-ayuda" style={style.ayuda}>Pega el texto tal como llegó. Todavía no lo conviertas en OPM.</p>
            <textarea
              ref={fuenteRef}
              id="mesa-fuente-texto"
              data-testid="mesa-fuente-texto"
              aria-describedby="mesa-fuente-ayuda"
              aria-label="Material original"
              value={fuenteBorrador}
              onInput={(event) => setFuenteBorrador(event.currentTarget.value)}
              rows={5}
              style={style.textarea}
            />
            <label for="mesa-fuente-markdown" style={style.label}>O adjunta un archivo Markdown (.md), hasta 128 kB</label>
            <input
              id="mesa-fuente-markdown"
              data-testid="mesa-fuente-markdown"
              aria-describedby="mesa-fuente-markdown-ayuda"
              type="file"
              accept=".md,text/markdown"
              onChange={(event) => { void conservarArchivoMarkdown(event.currentTarget.files?.[0] ?? null); }}
            />
            <p id="mesa-fuente-markdown-ayuda" style={style.ayuda}>Se conserva el texto UTF-8 sin normalizar. Los enlaces incluidos no se abren automáticamente.</p>
            {errorFuenteMarkdown ? <p role="alert" style={style.ayuda}>{errorFuenteMarkdown}</p> : null}
          </form>
        ) : null}

        {etapa === "trazo" ? (
          <form id="mesa-form-trazo" onSubmit={(event) => { event.preventDefault(); conservarTrazo(); }} style={style.paso}>
            <FuenteConservada fuente={mesa.fuente} />
            <label for="mesa-trazo-texto" style={style.label}>¿Qué fragmento observable quieres señalar?</label>
            <p id="mesa-trazo-ayuda" style={style.ayuda}>Transcribe solo el fragmento. Un trazo todavía no afirma semántica OPM.</p>
            <textarea
              ref={trazoRef}
              id="mesa-trazo-texto"
              aria-describedby="mesa-trazo-ayuda"
              aria-label="Fragmento observable"
              value={trazoBorrador}
              onInput={(event) => setTrazoBorrador(event.currentTarget.value)}
              rows={3}
              style={style.textarea}
            />
          </form>
        ) : null}

        {etapa === "interpretacion" ? (
          <div style={style.paso}>
            <RastroMeta fuente={mesa.fuente} trazo={mesa.trazo} />
            {editandoTrazo ? (
              <form id="mesa-form-editar-trazo" onSubmit={(event) => { event.preventDefault(); guardarEdicionTrazo(); }} style={style.pasoCompacto}>
                <label for="mesa-editar-trazo" style={style.label}>Corrige el fragmento observable</label>
                <textarea
                  ref={trazoRef}
                  id="mesa-editar-trazo"
                  aria-label="Editar fragmento observable"
                  value={trazoBorrador}
                  onInput={(event) => setTrazoBorrador(event.currentTarget.value)}
                  rows={3}
                  style={style.textarea}
                />
              </form>
            ) : (
              <button type="button" data-tutor-entrypoint="exploration:interpret" style={style.accionTexto} onClick={abrirEdicionTrazo}>Editar trazo</button>
            )}
            {!editandoTrazo ? (
              <section aria-labelledby="mesa-pregunta-interpretacion" style={style.preguntaBloque}>
                <h3 id="mesa-pregunta-interpretacion" style={style.pregunta}>¿Qué describe el trazo?</h3>
                <div style={style.opciones}>
                  <button
                    type="button"
                    data-tutor-entrypoint="exploration:interpret"
                    style={opcionStyle(tipoElegido === "objeto")}
                    aria-pressed={tipoElegido === "objeto"}
                    onClick={() => { setTipoElegido("objeto"); setNombreBorrador(""); }}
                  >
                    <strong>Una cosa que existe</strong>
                    <span style={style.opcionMeta}>Se propondrá un objeto</span>
                  </button>
                  <button
                    type="button"
                    data-tutor-entrypoint="exploration:interpret"
                    style={opcionStyle(tipoElegido === "proceso")}
                    aria-pressed={tipoElegido === "proceso"}
                    onClick={() => { setTipoElegido("proceso"); setNombreBorrador(""); }}
                  >
                    <strong>Algo que ocurre o cambia</strong>
                    <span style={style.opcionMeta}>Se propondrá un proceso</span>
                  </button>
                </div>
                {tipoElegido ? (
                  <form id="mesa-form-propuesta" onSubmit={(event) => { event.preventDefault(); previsualizar(); }} style={style.nombreForm}>
                    <label for="mesa-nombre-propuesta" style={style.label}>
                      {tipoElegido === "objeto" ? "Nombre del objeto propuesto" : "Nombre del proceso propuesto"}
                    </label>
                    <input
                      ref={nombreRef}
                      id="mesa-nombre-propuesta"
                      aria-label={tipoElegido === "objeto" ? "Nombre del objeto propuesto" : "Nombre del proceso propuesto"}
                      value={nombreBorrador}
                      onInput={(event) => setNombreBorrador(event.currentTarget.value)}
                      style={style.input}
                    />
                  </form>
                ) : null}
              </section>
            ) : null}
          </div>
        ) : null}

        {etapa === "propuesta" && mesa.propuesta ? (
          <div style={style.paso}>
            <RastroMeta fuente={mesa.fuente} trazo={mesa.trazo} />
            {corrigiendoPropuesta ? (
              <form id="mesa-form-corregir" onSubmit={(event) => { event.preventDefault(); guardarCorreccion(); }} style={style.pasoCompacto}>
                <fieldset style={style.fieldset}>
                  <legend style={style.label}>Corrige la interpretación</legend>
                  <label style={style.radioLabel}>
                    <input type="radio" name="mesa-tipo-correccion" checked={tipoElegido === "objeto"} onChange={() => setTipoElegido("objeto")} />
                    Objeto · una cosa que existe
                  </label>
                  <label style={style.radioLabel}>
                    <input type="radio" name="mesa-tipo-correccion" checked={tipoElegido === "proceso"} onChange={() => setTipoElegido("proceso")} />
                    Proceso · algo que ocurre o cambia
                  </label>
                </fieldset>
                <label for="mesa-corregir-nombre" style={style.label}>
                  {tipoElegido === "objeto" ? "Nombre del objeto propuesto" : "Nombre del proceso propuesto"}
                </label>
                <input
                  ref={nombreRef}
                  id="mesa-corregir-nombre"
                  aria-label={tipoElegido === "objeto" ? "Nombre del objeto propuesto" : "Nombre del proceso propuesto"}
                  value={nombreBorrador}
                  onInput={(event) => setNombreBorrador(event.currentTarget.value)}
                  style={style.input}
                />
              </form>
            ) : (
              <>
                <VistaPrevia preview={mesa.preview} />
                <button
                  type="button"
                  data-tutor-entrypoint="exploration:interpret"
                  style={style.accionTexto}
                  onClick={abrirCorreccion}
                >
                  Corregir propuesta
                </button>
              </>
            )}
          </div>
        ) : null}

        {etapa === "confirmado" ? (
          mostrandoFuente ? (
            <div style={style.paso}>
              <RastroMeta fuente={mesa.fuente} trazo={mesa.trazo} />
              {!mesa.targetDisponible ? <HechoNoDisponible /> : null}
            </div>
          ) : (
            <Proveniencia
              fuente={mesa.fuente}
              trazo={mesa.trazo}
              propuesta={mesa.propuesta}
              hechoNombre={mesa.hechoNombre}
              targetDisponible={mesa.targetDisponible}
            />
          )
        ) : null}
      </div>
    </Dialogo>
  );
}

function EstadoEtapa({ etapa }: { etapa: EtapaMesaExploracion }) {
  const texto = etapa === "fuente"
    ? "Sin interpretar · Fuente"
    : etapa === "trazo"
      ? "Sin interpretar · Trazo"
      : etapa === "interpretacion"
        ? "Sin interpretar · Interpretación manual"
        : etapa === "propuesta"
          ? "Propuesta pendiente · todavía no cambia el modelo"
          : "Hecho OPM confirmado";
  return <p data-testid="mesa-estado" role="status" aria-live="polite" style={style.estado}>{texto}</p>;
}

function FuenteConservada({ fuente }: { fuente: FuenteMesaExploracionViewModel | null }) {
  if (!fuente) return null;
  return (
    <blockquote data-testid="mesa-fuente-conservada" style={style.material}>
      <span style={style.kicker}>Fuente conservada</span>
      {fuente.contenido}
    </blockquote>
  );
}

function RastroMeta({ fuente, trazo }: {
  fuente: FuenteMesaExploracionViewModel | null;
  trazo: TrazoMesaExploracionViewModel | null;
}) {
  return (
    <div style={style.rastroMeta} aria-label="Fuente y trazo conservados">
      <FuenteConservada fuente={fuente} />
      {trazo ? (
        <blockquote data-testid="mesa-trazo-conservado" style={style.material}>
          <span style={style.kicker}>Trazo señalado</span>
          {trazo.texto}
        </blockquote>
      ) : null}
    </div>
  );
}

function VistaPrevia({ preview }: { preview: PreviewMesaExploracionViewModel | null }) {
  if (!preview || preview.error !== null) {
    return (
      <section aria-labelledby="mesa-preview-titulo" style={style.preview}>
        <h3 id="mesa-preview-titulo" style={style.pregunta}>Vista previa conjunta</h3>
        <p role="alert" style={style.error}>
          {preview?.error ?? "La vista previa todavía no está disponible"}
        </p>
      </section>
    );
  }
  const { tipo, nombre, lineas } = preview;
  return (
    <section aria-labelledby="mesa-preview-titulo" style={style.preview}>
      <h3 id="mesa-preview-titulo" style={style.pregunta}>Vista previa conjunta</h3>
      <div style={style.previewGrid}>
        <div style={style.previewPanel}>
          <span style={style.kicker}>Mini-OPD</span>
          <div
            data-testid="mesa-mini-opd"
            role="img"
            aria-label={`Mini-OPD: ${tipo} ${nombre}`}
            style={style.miniOpdLienzo}
          >
            <div style={miniOpdStyle(tipo)}>
              <strong>{tipo === "objeto" ? "Objeto" : "Proceso"}: {nombre}</strong>
              <span style={style.formaTipo}>{tipo === "objeto" ? "Cosa que existe" : "Algo que ocurre o cambia"}</span>
            </div>
          </div>
        </div>
        <div style={style.previewPanel}>
          <span style={style.kicker}>OPL que se creará</span>
          <div data-testid="mesa-opl-preview" aria-label="Vista previa OPL" style={style.oplPreview}>
            {lineas.map((linea) => <p key={linea} style={style.oplLinea}>{linea}</p>)}
          </div>
        </div>
      </div>
      <p style={style.cambio}>Se creará un {tipo} llamado «{nombre}» en el OPD activo. La fuente y el trazo seguirán siendo meta.</p>
    </section>
  );
}

function Proveniencia({ fuente, trazo, propuesta, hechoNombre, targetDisponible }: {
  fuente: FuenteMesaExploracionViewModel | null;
  trazo: TrazoMesaExploracionViewModel | null;
  propuesta: PropuestaMesaExploracionViewModel | null;
  hechoNombre: string | undefined;
  targetDisponible: boolean;
}) {
  return (
    <section data-testid="mesa-proveniencia" aria-labelledby="mesa-proveniencia-titulo" style={style.proveniencia}>
      <h3 id="mesa-proveniencia-titulo" style={style.pregunta}>Rastro navegable</h3>
      <p style={style.cadena} aria-label="Fuente a trazo a hecho OPM">Fuente → Trazo → Hecho OPM</p>
      <dl style={style.listaRastro}>
        <dt style={style.kicker}>Fuente</dt>
        <dd style={style.valorRastro}>{fuente?.contenido ?? "Fuente no disponible"}</dd>
        <dt style={style.kicker}>Trazo</dt>
        <dd style={style.valorRastro}>{trazo?.texto ?? "Trazo no disponible"}</dd>
        <dt style={style.kicker}>Hecho OPM</dt>
        <dd style={style.valorRastro}>
          {targetDisponible ? `${propuesta?.entidadTipo === "objeto" ? "Objeto" : "Proceso"}: ${hechoNombre}` : "Hecho retirado o no disponible"}
        </dd>
      </dl>
      {!targetDisponible ? <HechoNoDisponible /> : null}
    </section>
  );
}

function HechoNoDisponible() {
  return <p role="note" data-testid="mesa-hecho-no-disponible" style={style.aviso}>Hecho retirado o no disponible. La fuente y el trazo permanecen conservados.</p>;
}

function accionesDeEtapa(input: {
  etapa: EtapaMesaExploracion;
  fuenteBorrador: string;
  trazoBorrador: string;
  tipoElegido: "objeto" | "proceso" | null;
  nombreBorrador: string;
  editandoTrazo: boolean;
  corrigiendoPropuesta: boolean;
  mostrandoFuente: boolean;
  confirmadoEnSesion: boolean;
  targetDisponible: boolean;
  previewError: string | null;
  onCerrar: () => void;
  guardarEdicionTrazo: () => void;
  confirmar: () => void;
  irAlHecho: () => void;
  setMostrandoFuente: (value: boolean) => void;
  deshacerConfirmacion: () => void;
}) {
  const cerrar = <DialogoAccion onClick={input.onCerrar}>Cerrar</DialogoAccion>;
  if (input.etapa === "fuente") {
    return <>{cerrar}<DialogoAccion tono="primaria" type="submit" form="mesa-form-fuente" tutorEntrypoint="exploration:interpret" disabled={!input.fuenteBorrador.trim()}>Conservar fuente</DialogoAccion></>;
  }
  if (input.etapa === "trazo") {
    return <>{cerrar}<DialogoAccion tono="primaria" type="submit" form="mesa-form-trazo" tutorEntrypoint="exploration:interpret" disabled={!input.trazoBorrador.trim()}>Guardar trazo</DialogoAccion></>;
  }
  if (input.etapa === "interpretacion") {
    if (input.editandoTrazo) {
      return <>{cerrar}<DialogoAccion onClick={() => input.guardarEdicionTrazo()} tono="primaria" tutorEntrypoint="exploration:interpret" disabled={!input.trazoBorrador.trim()}>Actualizar trazo</DialogoAccion></>;
    }
    return <>{cerrar}{input.tipoElegido ? <DialogoAccion tono="primaria" type="submit" form="mesa-form-propuesta" tutorEntrypoint="exploration:interpret" disabled={!input.nombreBorrador.trim()}>Previsualizar propuesta</DialogoAccion> : null}</>;
  }
  if (input.etapa === "propuesta") {
    if (input.corrigiendoPropuesta) {
      return <>{cerrar}<DialogoAccion tono="primaria" type="submit" form="mesa-form-corregir" tutorEntrypoint="exploration:interpret" disabled={!input.tipoElegido || !input.nombreBorrador.trim()}>Actualizar propuesta</DialogoAccion></>;
    }
    return (
      <>
        {cerrar}
        <DialogoAccion onClick={() => input.confirmar()} tono="primaria" tutorEntrypoint="exploration:confirm" disabled={Boolean(input.previewError)}>Confirmar como hecho OPM</DialogoAccion>
      </>
    );
  }
  return (
    <>
      {cerrar}
      {input.mostrandoFuente ? (
        <DialogoAccion onClick={() => input.setMostrandoFuente(false)}>
          {input.targetDisponible ? "Volver al hecho" : "Volver al rastro"}
        </DialogoAccion>
      ) : (
        <>
          <DialogoAccion onClick={() => input.setMostrandoFuente(true)}>Ver fuente</DialogoAccion>
          {input.targetDisponible ? <DialogoAccion tono="primaria" onClick={input.irAlHecho}>Ir al hecho OPM</DialogoAccion> : null}
          {input.confirmadoEnSesion ? <DialogoAccion tono="destructiva" tutorEntrypoint="exploration:undo" onClick={input.deshacerConfirmacion}>Deshacer confirmación</DialogoAccion> : null}
        </>
      )}
    </>
  );
}

function opcionStyle(activa: boolean): JSX.CSSProperties {
  return {
    ...style.opcion,
    borderColor: activa ? tokens.colors.ink : tokens.colors.ruleStrong,
    background: activa ? tokens.colors.paperWarm : tokens.colors.paper,
  };
}

function miniOpdStyle(tipo: "objeto" | "proceso"): JSX.CSSProperties {
  return {
    ...style.forma,
    borderRadius: tipo === "proceso" ? "999px" : 0,
    borderColor: tipo === "proceso" ? tokens.colors.opm.process : tokens.colors.opm.object,
  };
}

const style = {
  raiz: { display: "grid", gap: tokens.spacing.lg, minWidth: 0 },
  estado: { margin: 0, fontFamily: tokens.typography.mono, fontSize: `${tokens.typography.fs.fs10}px`, color: tokens.colors.inkSoft, textTransform: "uppercase", letterSpacing: tokens.typography.ls.meta },
  paso: { display: "grid", gap: tokens.spacing.md, margin: 0 },
  pasoCompacto: { display: "grid", gap: tokens.spacing.sm, margin: 0 },
  label: { color: tokens.colors.ink, fontWeight: tokens.typography.weights.bold },
  ayuda: { margin: 0, color: tokens.colors.inkSoft },
  textarea: { boxSizing: "border-box", width: "100%", padding: `${tokens.spacing.sm}px`, border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.serif, fontSize: `${tokens.typography.fs.fs14}px`, lineHeight: 1.5, resize: "vertical" },
  input: { boxSizing: "border-box", width: "100%", minHeight: 38, padding: `0 ${tokens.spacing.sm}px`, border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.serif, fontSize: `${tokens.typography.fs.fs14}px` },
  material: { display: "grid", gap: tokens.spacing.xs, margin: 0, padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, borderLeft: `2px solid ${tokens.colors.inkSoft}`, background: tokens.colors.paperWarm, color: tokens.colors.ink, whiteSpace: "pre-wrap" },
  kicker: { fontFamily: tokens.typography.mono, fontSize: `${tokens.typography.fs.fs9}px`, color: tokens.colors.inkSoft, textTransform: "uppercase", letterSpacing: tokens.typography.ls.kicker },
  rastroMeta: { display: "grid", gap: tokens.spacing.sm },
  accionTexto: { display: "inline-flex", minHeight: 24, alignItems: "center", justifySelf: "start", border: 0, borderBottom: `1px solid ${tokens.colors.inkSoft}`, padding: "2px 0", background: "transparent", color: tokens.colors.inkSoft, fontFamily: tokens.typography.serif, cursor: "pointer" },
  preguntaBloque: { display: "grid", gap: tokens.spacing.md, paddingTop: tokens.spacing.sm, borderTop: `1px solid ${tokens.colors.rule}` },
  pregunta: { margin: 0, color: tokens.colors.ink, fontFamily: tokens.typography.serif, fontSize: `${tokens.typography.fs.fs17}px` },
  opciones: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: tokens.spacing.sm },
  opcion: { display: "grid", gap: tokens.spacing.xs, minHeight: 72, padding: tokens.spacing.md, border: `1px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, color: tokens.colors.ink, fontFamily: tokens.typography.serif, textAlign: "left", cursor: "pointer" },
  opcionMeta: { color: tokens.colors.inkSoft, fontSize: `${tokens.typography.fs.fs11}px` },
  nombreForm: { display: "grid", gap: tokens.spacing.sm },
  fieldset: { display: "grid", gap: tokens.spacing.xs, margin: 0, padding: tokens.spacing.sm, border: `1px solid ${tokens.colors.rule}` },
  radioLabel: { display: "flex", alignItems: "center", gap: tokens.spacing.xs },
  preview: { display: "grid", gap: tokens.spacing.md },
  previewGrid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: tokens.spacing.md },
  previewPanel: { display: "grid", gap: tokens.spacing.sm, minWidth: 0, padding: tokens.spacing.md, border: `1px solid ${tokens.colors.rule}`, background: tokens.colors.paper },
  miniOpdLienzo: { display: "grid", minHeight: 150, placeItems: "center", padding: tokens.spacing.md, background: tokens.colors.paperWarm },
  forma: { display: "grid", gap: tokens.spacing.xs, width: "min(240px, 80%)", minHeight: 64, placeItems: "center", padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, border: `2px solid ${tokens.colors.ink}`, background: tokens.colors.paper, color: tokens.colors.ink, textAlign: "center" },
  formaTipo: { fontFamily: tokens.typography.mono, fontSize: `${tokens.typography.fs.fs9}px`, color: tokens.colors.inkSoft },
  oplPreview: { minHeight: 150, padding: tokens.spacing.md, borderLeft: `2px solid ${tokens.colors.ink}`, background: tokens.colors.paperWarm, color: tokens.colors.ink, fontFamily: tokens.typography.mono, overflowWrap: "anywhere" },
  oplLinea: { margin: `0 0 ${tokens.spacing.sm}px` },
  error: { color: tokens.colors.crimson },
  cambio: { margin: 0, color: tokens.colors.inkMid },
  proveniencia: { display: "grid", gap: tokens.spacing.md },
  cadena: { margin: 0, color: tokens.colors.ink, fontFamily: tokens.typography.mono, fontWeight: tokens.typography.weights.bold },
  listaRastro: { display: "grid", gridTemplateColumns: "110px minmax(0, 1fr)", gap: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, margin: 0, padding: tokens.spacing.md, border: `1px solid ${tokens.colors.rule}` },
  valorRastro: { margin: 0, color: tokens.colors.ink, overflowWrap: "anywhere" },
  aviso: { margin: 0, padding: tokens.spacing.sm, borderLeft: `2px solid ${tokens.colors.crimson}`, color: tokens.colors.inkMid, background: tokens.colors.paperWarm },
} satisfies Record<string, JSX.CSSProperties>;
