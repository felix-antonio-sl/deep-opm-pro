import { useEffect, useMemo, useState } from "preact/hooks";
import regFileIcon from "../../../assets/svg/regFile.svg";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/modelos";
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { useZustandWorkspacePort } from "../app/ports/zustandWorkspacePort";
import { useOpmStore } from "../store";
import { deriveReuseIntent, runTutorPolicy } from "../tutor";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";
import { TutorInterventionDetails, mapearLentesTutor } from "./TutorDetails";

export function DialogoSubmodelo() {
  const persistencia = useZustandPersistencePort();
  const workspace = useZustandWorkspacePort();
  const abierto = useOpmStore((s) => s.dialogoSubmodeloAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const seleccionId = useOpmStore((s) => s.seleccionId);
  const cerrar = useOpmStore((s) => s.cerrarDialogoSubmodelo);
  const conectar = useOpmStore((s) => s.conectarSubmodeloSeleccionado);
  const entidad = seleccionId ? modelo.entidades[seleccionId] : undefined;
  const [seleccionadoId, setSeleccionadoId] = useState<Id | null>(null);
  const [nombre, setNombre] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!abierto) return;
    persistencia.listarModelosGuardados();
    setSeleccionadoId(null);
    setNombre("");
    setQuery("");
  }, [abierto, persistencia.listarModelosGuardados]);

  const hijos = useMemo(() => {
    return workspace.listarHijosActuales({ incluirArchivados: workspace.mostrarArchivados });
  }, [workspace.indice, workspace.carpetaActualId, workspace.modelosGuardados, workspace.mostrarArchivados]);

  const modelosCatalogo = useMemo(() => ordenarModelos(
    hijos.modelos
      .filter((item) => item.id !== modeloPersistidoId)
      .filter((item) => coincideBusqueda(item, query)),
  ), [hijos.modelos, modeloPersistidoId, query]);

  const seleccionado = modelosCatalogo.find((item) => item.id === seleccionadoId) ?? null;
  const intervencionTutor = runTutorPolicy(deriveReuseIntent({
    intentId: `submodel:${seleccionId ?? "none"}:choice`,
    focus: "submodel",
    phase: "choice",
    referenceLoaded: !!seleccionado,
    readOnly: true,
    activeLenses: mapearLentesTutor(modelo.lentesConocimiento ?? []),
  }));
  const seleccionarModelo = (id: Id) => {
    const item = modelosCatalogo.find((modeloGuardado) => modeloGuardado.id === id);
    setSeleccionadoId(id);
    if (item) setNombre(item.nombre);
  };
  const guardar = () => {
    if (!seleccionado) return;
    conectar({ modeloId: seleccionado.id, nombre: nombre.trim() || seleccionado.nombre });
  };
  const disabled = !seleccionId || !seleccionado || !nombre.trim();

  return (
    <Dialogo
      open={abierto}
      title="Conectar submodelo"
      onCancel={cerrar}
      size="xl"
      testId="dialogo-submodelo"
      actions={(
        <>
          <DialogoAccion onClick={cerrar}>Cancelar</DialogoAccion>
          <DialogoAccion tutorEntrypoint="submodel:connect-reference" tono="primaria" disabled={disabled} onClick={guardar}>Conectar</DialogoAccion>
        </>
      )}
    >
      <div style={formStyles.body}>
        <TutorInterventionDetails intervention={intervencionTutor} testId="tutor-dialogo-submodelo" />
        <div style={formStyles.status}>
          <span style={formStyles.statusStrong}>Ancla</span>
          <span>{entidad?.nombre ?? "sin selección"}</span>
        </div>
        <div style={formStyles.flagsBar}>
          <label style={formStyles.flag}>
            <input type="checkbox" checked={workspace.mostrarArchivados} onChange={workspace.toggleMostrarArchivados} />
            Mostrar archivados
          </label>
          <label style={formStyles.flag}>
            <input type="checkbox" checked={workspace.mostrarVersiones} onChange={workspace.toggleMostrarVersiones} />
            Mostrar versiones
          </label>
        </div>
        <section style={formStyles.catalogo} aria-label="Modelos existentes">
          <input
            type="search"
            aria-label="Buscar modelo para submodelo"
            placeholder="Buscar por nombre o descripción..."
            style={formStyles.searchInput}
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
          {modelosCatalogo.length > 0 ? (
            <div style={formStyles.gridModelos}>
              {modelosCatalogo.map((item) => (
                <ModeloSubmodeloTile
                  key={item.id}
                  modelo={item}
                  seleccionado={item.id === seleccionadoId}
                  mostrarVersiones={workspace.mostrarVersiones}
                  onSeleccionar={seleccionarModelo}
                />
              ))}
            </div>
          ) : (
            <div style={formStyles.empty}>
              {query
                ? "Sin resultados para la búsqueda."
                : modeloPersistidoId
                  ? "No hay otros modelos guardados en esta carpeta."
                  : "No hay modelos guardados en esta carpeta."}
            </div>
          )}
        </section>
        <label style={formStyles.field}>
          <span style={formStyles.label}>Vista</span>
          <input style={formStyles.input} value={nombre} onInput={(event) => setNombre(event.currentTarget.value)} />
        </label>
        <p style={formStyles.hint}>Se conectará el modelo seleccionado como referencia LF-04 y se creará una vista derivada de solo lectura. El OPD padre seguirá siendo editable.</p>
      </div>
    </Dialogo>
  );
}

function ModeloSubmodeloTile(props: {
  modelo: ResumenModeloPersistido;
  seleccionado: boolean;
  mostrarVersiones: boolean;
  onSeleccionar: (id: Id) => void;
}) {
  const versiones = props.modelo.versiones?.length ?? 0;
  return (
    <button
      type="button"
      data-testid="submodelo-modelo-tile"
      aria-pressed={props.seleccionado}
      style={props.seleccionado ? formStyles.tileSeleccionado : formStyles.tileModelo}
      onClick={() => props.onSeleccionar(props.modelo.id)}
    >
      <img src={regFileIcon} alt="" style={formStyles.tileIcon} />
      <strong style={formStyles.tileTitle}>{props.modelo.nombre}</strong>
      <span style={formStyles.tileDesc}>{props.modelo.descripcion || "Sin descripción"}</span>
      <span style={formStyles.tileDate}>{new Date(props.modelo.actualizadoEn).toLocaleString("es-CL")}</span>
      {props.modelo.archivado ? <span style={formStyles.archiveBadge}>Archivado</span> : null}
      {props.mostrarVersiones && versiones > 0 ? <span style={formStyles.versionBadge}>{versiones} versiones</span> : null}
    </button>
  );
}

function coincideBusqueda(modelo: ResumenModeloPersistido, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("es-CL");
  if (!q) return true;
  return modelo.nombre.toLocaleLowerCase("es-CL").includes(q) ||
    modelo.descripcion.toLocaleLowerCase("es-CL").includes(q);
}

function ordenarModelos(modelos: ResumenModeloPersistido[]): ResumenModeloPersistido[] {
  return [...modelos].sort((a, b) =>
    b.actualizadoEn.localeCompare(a.actualizadoEn) ||
    a.nombre.localeCompare(b.nombre, "es-CL", { numeric: true })
  );
}

const formStyles = {
  body: { display: "grid", gap: "14px", width: "100%" },
  field: { display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", alignItems: "center", gap: "10px" },
  label: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  input: { height: "32px", minWidth: 0, border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  hint: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
  status: { display: "grid", gridTemplateColumns: "96px minmax(0, 1fr)", gap: "10px", alignItems: "center", padding: "8px 10px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
  statusStrong: { color: tokens.colors.ink, fontWeight: 700 },
  flagsBar: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" },
  flag: { display: "inline-flex", alignItems: "center", gap: "6px", color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400 },
  catalogo: { display: "grid", gap: "8px", minHeight: "220px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "12px", background: tokens.colors.paper },
  searchInput: { height: "32px", minWidth: 0, border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.crimson },
  gridModelos: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px", maxHeight: "320px", overflow: "auto" },
  tileModelo: { position: "relative", display: "grid", gridTemplateRows: "24px auto auto 18px", gap: "4px", minHeight: "122px", padding: "12px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, textAlign: "left", cursor: "pointer", fontFamily: tokens.typography.familyChrome },
  tileSeleccionado: { position: "relative", display: "grid", gridTemplateRows: "24px auto auto 18px", gap: "4px", minHeight: "122px", padding: "12px", border: `${tokens.stroke.bold}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink04, color: tokens.colors.ink, textAlign: "left", cursor: "pointer", fontFamily: tokens.typography.familyChrome },
  tileIcon: { width: "24px", height: "24px" },
  tileTitle: { color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 600, overflowWrap: "anywhere" },
  tileDesc: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400, lineHeight: 1.4, overflowWrap: "anywhere" },
  tileDate: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500 },
  archiveBadge: { position: "absolute", right: "8px", top: "8px", padding: "2px 6px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em" },
  versionBadge: { position: "absolute", right: "8px", bottom: "8px", color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500 },
  empty: { padding: "20px", border: `${tokens.stroke.hairline}px dashed ${tokens.colors.ink15}`, borderRadius: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400, textAlign: "center" },
} satisfies Record<string, preact.JSX.CSSProperties>;
