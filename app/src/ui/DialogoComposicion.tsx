import { useEffect, useMemo, useState } from "preact/hooks";
import regFileIcon from "../../../assets/svg/regFile.svg";
import { resumenComposicion, sugerirCompartidasPorInterfaz } from "../modelo/composicion";
import type { Id, Modelo, TipoEntidad } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/modelos";
import { cargarModeloBackend, persistenciaBackendHabilitada } from "../persistencia/backend";
import { hidratarModelo } from "../serializacion/json";
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import { useZustandWorkspacePort } from "../app/ports/zustandWorkspacePort";
import { useOpmStore } from "../store";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

export function DialogoComposicion() {
  const persistencia = useZustandPersistencePort();
  const workspace = useZustandWorkspacePort();
  const abierto = useOpmStore((s) => s.dialogoComposicionAbierto);
  const modelo = useOpmStore((s) => s.modelo);
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const cerrar = useOpmStore((s) => s.cerrarDialogoComposicion);
  const componer = useOpmStore((s) => s.componerConModeloGuardado);
  const [seleccionadoId, setSeleccionadoId] = useState<Id | null>(null);
  const [query, setQuery] = useState("");
  const [modeloB, setModeloB] = useState<Modelo | null>(null);
  const [errorModelo, setErrorModelo] = useState<string | null>(null);
  const [compartidas, setCompartidas] = useState<Record<Id, Id>>({});
  // Flags LOCALES al diálogo: antes toggleaban estado global del workspace (afectaba
  // el árbol de toda la app) — efecto secundario sorpresivo desde un modal.
  const [mostrarArchivados, setMostrarArchivados] = useState(false);
  const [mostrarVersiones, setMostrarVersiones] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    persistencia.listarModelosGuardados();
    setSeleccionadoId(null);
    setQuery("");
    setModeloB(null);
    setErrorModelo(null);
    setCompartidas({});
    setMostrarArchivados(false);
    setMostrarVersiones(false);
  }, [abierto, persistencia.listarModelosGuardados]);

  const hijos = useMemo(() => {
    return workspace.listarHijosActuales({ incluirArchivados: mostrarArchivados });
  }, [workspace.indice, workspace.carpetaActualId, workspace.modelosGuardados, mostrarArchivados]);

  const modelosCatalogo = useMemo(() => ordenarModelos(
    hijos.modelos
      .filter((item) => item.id !== modeloPersistidoId)
      .filter((item) => coincideBusqueda(item, query)),
  ), [hijos.modelos, modeloPersistidoId, query]);

  const seleccionado = modelosCatalogo.find((item) => item.id === seleccionadoId) ?? null;

  const seleccionarModelo = (id: Id) => {
    setSeleccionadoId(id);
    if (persistenciaBackendHabilitada()) {
      setModeloB(null);
      setErrorModelo("Cargando modelo desde servidor...");
      setCompartidas({});
      void cargarModeloBackend(id).then((cargado) => {
        if (!cargado.ok) {
          setModeloB(null);
          setErrorModelo(cargado.error);
          setCompartidas({});
          return;
        }
        const hidratado = hidratarModelo(cargado.value.json);
        if (!hidratado.ok) {
          setModeloB(null);
          setErrorModelo(`No se pudo leer el modelo: ${hidratado.error}`);
          setCompartidas({});
          return;
        }
        setModeloB(hidratado.value);
        setErrorModelo(null);
        setCompartidas(sugerirCompartidasPorInterfaz(modelo, hidratado.value));
      });
      return;
    }
    setModeloB(null);
    setErrorModelo("Backend de modelos no disponible");
    setCompartidas({});
  };

  const entidadesA = useMemo(() => ordenarEntidades(modelo), [modelo]);
  const entidadesB = useMemo(() => ordenarEntidades(modeloB), [modeloB]);
  const compartirActivas = normalizarCompartidas(compartidas, modelo, modeloB);
  // Preview del delta antes de confirmar (anti Generation Surprise).
  const resumen = useMemo(
    () => (modeloB ? resumenComposicion(modelo, modeloB, normalizarCompartidas(compartidas, modelo, modeloB)) : null),
    [modelo, modeloB, compartidas],
  );

  const fijarCompartida = (bId: Id, aId: Id | "") => {
    setCompartidas((actual) => {
      const siguiente = { ...actual };
      if (!aId) delete siguiente[bId];
      else siguiente[bId] = aId;
      return siguiente;
    });
  };

  const guardar = () => {
    if (!seleccionado) return;
    componer({ modeloId: seleccionado.id, compartidas: compartirActivas });
  };

  return (
    <Dialogo
      open={abierto}
      title="Componer con modelo"
      onCancel={cerrar}
      size="xl"
      testId="dialogo-composicion"
      actions={(
        <>
          <DialogoAccion onClick={cerrar}>Cancelar</DialogoAccion>
          <DialogoAccion tono="primaria" disabled={!seleccionado || !!errorModelo} onClick={guardar}>Componer</DialogoAccion>
        </>
      )}
    >
      <div style={styles.body}>
        <div style={styles.flagsBar}>
          <label style={styles.flag}>
            <input type="checkbox" checked={mostrarArchivados} onChange={(event) => setMostrarArchivados(event.currentTarget.checked)} />
            Mostrar archivados
          </label>
          <label style={styles.flag}>
            <input type="checkbox" checked={mostrarVersiones} onChange={(event) => setMostrarVersiones(event.currentTarget.checked)} />
            Mostrar versiones
          </label>
        </div>
        <section style={styles.catalogo} aria-label="Modelos existentes">
          <input
            type="search"
            aria-label="Buscar modelo para composición"
            placeholder="Buscar por nombre o descripción..."
            style={styles.searchInput}
            value={query}
            onInput={(event) => setQuery(event.currentTarget.value)}
          />
          {modelosCatalogo.length > 0 ? (
            <div style={styles.gridModelos}>
              {modelosCatalogo.map((item) => (
                <ModeloComposicionTile
                  key={item.id}
                  modelo={item}
                  seleccionado={item.id === seleccionadoId}
                  mostrarVersiones={mostrarVersiones}
                  onSeleccionar={seleccionarModelo}
                />
              ))}
            </div>
          ) : (
            <div style={styles.empty}>
              {query ? "Sin resultados para la búsqueda." : "No hay otros modelos guardados en esta carpeta."}
            </div>
          )}
        </section>
        <section style={styles.interfaz} aria-label="Interfaz compartida">
          <div style={styles.sectionHeader}>
            <strong style={styles.sectionTitle}>Interfaz compartida</strong>
            <span style={styles.sectionMeta}>{Object.keys(compartirActivas).length} activa{Object.keys(compartirActivas).length === 1 ? "" : "s"}</span>
          </div>
          {resumen ? (
            <div style={resumen.conflictosLineal > 0 ? styles.previewWarn : styles.preview} data-testid="composicion-preview">
              {`Resultado: +${resumen.entidadesNuevas} cosa${resumen.entidadesNuevas === 1 ? "" : "s"}, +${resumen.enlacesNuevos} enlace${resumen.enlacesNuevos === 1 ? "" : "s"} · ${resumen.compartidas} compartida${resumen.compartidas === 1 ? "" : "s"}`}
              {resumen.conflictosLineal > 0 ? ` · ⚠ ${resumen.conflictosLineal} conflicto${resumen.conflictosLineal === 1 ? "" : "s"} de linealidad` : ""}
            </div>
          ) : null}
          {errorModelo ? <div style={styles.error}>{errorModelo}</div> : null}
          {!modeloB && !errorModelo ? <div style={styles.empty}>Selecciona un modelo para revisar la interfaz.</div> : null}
          {modeloB && entidadesB.length > 0 ? (
            <div style={styles.mappingList}>
              {entidadesB.map((entidadB) => (
                <label key={entidadB.id} style={styles.mappingRow}>
                  <span style={styles.entidadB}>
                    <strong style={styles.nombreEntidad}>{entidadB.nombre}</strong>
                    <span style={styles.tipoEntidad}>{labelTipo(entidadB.tipo)}</span>
                  </span>
                  <select
                    aria-label={`Compartir ${entidadB.nombre}`}
                    style={styles.select}
                    value={compartidas[entidadB.id] ?? ""}
                    onChange={(event) => fijarCompartida(entidadB.id, event.currentTarget.value as Id | "")}
                  >
                    <option value="">No compartir</option>
                    {entidadesA
                      .filter((entidadA) => entidadA.tipo === entidadB.tipo)
                      .map((entidadA) => (
                        <option key={entidadA.id} value={entidadA.id}>{entidadA.nombre}</option>
                      ))}
                  </select>
                </label>
              ))}
            </div>
          ) : null}
        </section>
        <p style={styles.inPlace}>Se compone sobre el modelo activo; es reversible con deshacer.</p>
      </div>
    </Dialogo>
  );
}

function ModeloComposicionTile(props: {
  modelo: ResumenModeloPersistido;
  seleccionado: boolean;
  mostrarVersiones: boolean;
  onSeleccionar: (id: Id) => void;
}) {
  const versiones = props.modelo.versiones?.length ?? 0;
  return (
    <button
      type="button"
      data-testid="composicion-modelo-tile"
      aria-pressed={props.seleccionado}
      style={props.seleccionado ? styles.tileSeleccionado : styles.tileModelo}
      onClick={() => props.onSeleccionar(props.modelo.id)}
    >
      <img src={regFileIcon} alt="" style={styles.tileIcon} />
      <strong style={styles.tileTitle}>{props.modelo.nombre}</strong>
      <span style={styles.tileDesc}>{props.modelo.descripcion || "Sin descripción"}</span>
      <span style={styles.tileDate}>{new Date(props.modelo.actualizadoEn).toLocaleString("es-CL")}</span>
      {props.modelo.archivado ? <span style={styles.archiveBadge}>Archivado</span> : null}
      {props.mostrarVersiones && versiones > 0 ? <span style={styles.versionBadge}>{versiones} versiones</span> : null}
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

function ordenarEntidades(modelo: Modelo | null): Array<{ id: Id; nombre: string; tipo: TipoEntidad }> {
  if (!modelo) return [];
  return Object.values(modelo.entidades)
    .map((entidad) => ({ id: entidad.id, nombre: entidad.nombre, tipo: entidad.tipo }))
    .sort((a, b) => a.tipo.localeCompare(b.tipo, "es-CL") || a.nombre.localeCompare(b.nombre, "es-CL", { numeric: true }));
}

function normalizarCompartidas(compartidas: Record<Id, Id>, a: Modelo, b: Modelo | null): Record<Id, Id> {
  if (!b) return {};
  return Object.fromEntries(Object.entries(compartidas).filter(([bId, aId]) => {
    const entidadB = b.entidades[bId];
    const entidadA = a.entidades[aId];
    return !!entidadA && !!entidadB && entidadA.tipo === entidadB.tipo;
  }));
}

function labelTipo(tipo: TipoEntidad): string {
  return tipo === "objeto" ? "Objeto" : "Proceso";
}

const styles = {
  body: { display: "grid", gap: "14px", width: "100%" },
  flagsBar: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" },
  flag: { display: "inline-flex", alignItems: "center", gap: "6px", color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400 },
  catalogo: { display: "grid", gap: "8px", minHeight: "180px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "12px", background: tokens.colors.paper },
  searchInput: { height: "32px", minWidth: 0, border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "0 10px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", caretColor: tokens.colors.crimson },
  gridModelos: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "8px", maxHeight: "240px", overflow: "auto" },
  tileModelo: { position: "relative", display: "grid", gridTemplateRows: "24px auto auto 18px", gap: "4px", minHeight: "122px", padding: "12px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink, textAlign: "left", cursor: "pointer", fontFamily: tokens.typography.familyChrome },
  tileSeleccionado: { position: "relative", display: "grid", gridTemplateRows: "24px auto auto 18px", gap: "4px", minHeight: "122px", padding: "12px", border: `${tokens.stroke.bold}px solid ${tokens.colors.ink}`, borderRadius: 0, background: tokens.colors.ink04, color: tokens.colors.ink, textAlign: "left", cursor: "pointer", fontFamily: tokens.typography.familyChrome },
  tileIcon: { width: "24px", height: "24px" },
  tileTitle: { color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 600, overflowWrap: "anywhere" },
  tileDesc: { color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 400, lineHeight: 1.4, overflowWrap: "anywhere" },
  tileDate: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500 },
  archiveBadge: { position: "absolute", right: "8px", top: "8px", padding: "2px 6px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0 },
  versionBadge: { position: "absolute", right: "8px", bottom: "8px", color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500 },
  interfaz: { display: "grid", gap: "8px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "12px", background: tokens.colors.paper },
  sectionHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" },
  sectionTitle: { color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 700 },
  sectionMeta: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  mappingList: { display: "grid", gap: "6px", maxHeight: "260px", overflow: "auto" },
  mappingRow: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(180px, 260px)", alignItems: "center", gap: "10px", minHeight: "38px", padding: "6px 0", borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.ink08}` },
  entidadB: { display: "grid", gap: "2px", minWidth: 0 },
  nombreEntidad: { color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 600, overflowWrap: "anywhere" },
  tipoEntidad: { color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0 },
  select: { height: "32px", minWidth: 0, border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, padding: "0 8px", background: tokens.colors.paper, color: tokens.colors.ink, fontFamily: tokens.typography.familyChrome, fontSize: "13px" },
  empty: { padding: "18px", border: `${tokens.stroke.hairline}px dashed ${tokens.colors.ink15}`, borderRadius: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 400, textAlign: "center" },
  error: { padding: "10px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.accentDark}`, borderRadius: 0, color: tokens.colors.accentDark, background: tokens.colors.paper, fontFamily: tokens.typography.familyChrome, fontSize: "13px", fontWeight: 500 },
  preview: { padding: "8px 10px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`, borderRadius: 0, background: tokens.colors.ink04, color: tokens.colors.ink70, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 500 },
  previewWarn: { padding: "8px 10px", border: `${tokens.stroke.hairline}px solid ${tokens.colors.accentDark}`, borderRadius: 0, background: tokens.colors.paper, color: tokens.colors.accentDark, fontFamily: tokens.typography.familyChrome, fontSize: "12px", fontWeight: 600 },
  inPlace: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "11px", fontWeight: 400, fontStyle: "italic" },
} satisfies Record<string, preact.JSX.CSSProperties>;
