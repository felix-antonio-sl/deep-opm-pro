// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import autosaveIcon from "../../../assets/svg/autosave.svg";
import lockIcon from "../../../assets/svg/lock.svg";
import regFileIcon from "../../../assets/svg/regFile.svg";
import verFileIcon from "../../../assets/svg/verFile.svg";
import type { Id } from "../modelo/tipos";
import type { ResumenModeloPersistido } from "../persistencia/local";
import type { CarpetaIndice } from "../persistencia/workspace";
import { rutaDeCarpeta, listarHijosDeCarpeta } from "../persistencia/workspace";
import { listarFixtures } from "../store/runtime";
import { useOpmStore } from "../store";
import { Dialogo } from "./Dialogo";
import { useConfirmarSiDirty } from "./ConfirmacionContext";
import { PanelCarpetas, type VistaModo } from "./PanelCarpetas";
import { tokens } from "./tokens";

/**
 * Diálogo de carga local. Persistencia/carga: [Met §6].
 * Los ejemplos se leen desde `fixtureTodos()` como catálogo único.
 */
export function DialogoCargarModelo() {
  const open = useOpmStore((s) => s.dialogoCargarModeloAbierto);
  const cerrar = useOpmStore((s) => s.cerrarCargarModelo);
  const modelos = useOpmStore((s) => s.modelosGuardados);
  const indice = useOpmStore((s) => s.indice);
  const carpetaActualId = useOpmStore((s) => s.carpetaActualId);
  const listar = useOpmStore((s) => s.listarModelosGuardados);
  const cargar = useOpmStore((s) => s.cargarLocal);
  const cargarFixtureDemo = useOpmStore((s) => s.cargarFixtureDemo);
  const abrirPestanaConModelo = useOpmStore((s) => s.abrirPestanaConModelo);
  const abrirCarpeta = useOpmStore((s) => s.abrirCarpeta);
  const crearCarpeta = useOpmStore((s) => s.crearCarpetaEnActual);
  const renombrarCarpeta = useOpmStore((s) => s.renombrarCarpetaEnIndice);
  const eliminarCarpeta = useOpmStore((s) => s.eliminarCarpetaEnIndice);
  const cortarModelo = useOpmStore((s) => s.cortarModelo);
  const cortarCarpeta = useOpmStore((s) => s.cortarCarpeta);
  const pegarEn = useOpmStore((s) => s.pegarEn);
  const moverModeloDirecto = useOpmStore((s) => s.moverModeloDirecto);
  const moverCarpetaDirecto = useOpmStore((s) => s.moverCarpetaDirecto);
  const archivarModelo = useOpmStore((s) => s.archivarModeloPorId);
  const restaurarModelo = useOpmStore((s) => s.restaurarModeloPorId);
  const archivarCarpeta = useOpmStore((s) => s.archivarCarpetaPorId);
  const restaurarCarpeta = useOpmStore((s) => s.restaurarCarpetaPorId);
  const abrirVersiones = useOpmStore((s) => s.abrirDialogoVersiones);
  const portapapeles = useOpmStore((s) => s.portapapelesWorkspace);
  const cancelarPortapapeles = useOpmStore((s) => s.cancelarPortapapelesWorkspace);
  const mostrarArchivados = useOpmStore((s) => s.mostrarArchivados);
  const mostrarVersiones = useOpmStore((s) => s.mostrarVersiones);
  const toggleMostrarArchivados = useOpmStore((s) => s.toggleMostrarArchivados);
  const toggleMostrarVersiones = useOpmStore((s) => s.toggleMostrarVersiones);
  const confirmarSiDirty = useConfirmarSiDirty();
  const [modo, setModo] = useState<VistaModo>(() => leerVistaCargar());
  const [seleccionadoId, setSeleccionadoId] = useState<Id | null>(null);
  const [orden, setOrden] = useState<OrdenCargar>(() => leerOrdenCargar());
  const [query, setQuery] = useState("");
  const [breadcrumb, setBreadcrumb] = useState<CarpetaIndice[]>([]);
  const [demoSeleccionado, setDemoSeleccionado] = useState("");
  const demos = useMemo(() => listarFixtures(), []);

  useEffect(() => {
    if (!open) return;
	    listar();
	    setQuery("");
	    setSeleccionadoId(null);
	  }, [listar, open]);

  useEffect(() => {
    setBreadcrumb(rutaDeCarpeta(indice, carpetaActualId));
  }, [indice, carpetaActualId]);

  // Filtrar modelos por carpeta actual
  const hijos = useMemo(() => {
    const raw = listarHijosDeCarpeta(indice, carpetaActualId, { incluirArchivados: mostrarArchivados });
    const modelosFiltrados = raw.modelos
      .map((m) => {
        const guardado = modelos.find((gm) => gm.id === m.id);
        return guardado ? { ...guardado, archivado: guardado.archivado || m.archivado, archivadoEn: guardado.archivadoEn ?? m.archivadoEn, versiones: guardado.versiones ?? m.versiones } : undefined;
      })
      .filter((m) => m !== undefined);
    return {
      carpetas: raw.carpetas,
      modelos: modelosFiltrados as typeof modelos,
    };
  }, [indice, carpetaActualId, modelos, mostrarArchivados]);

  const navegarBreadcrumb = useCallback((carpetaId: Id | null, _segmentIndex: number) => {
    abrirCarpeta(carpetaId);
  }, [abrirCarpeta]);
  const modelosCatalogo = useMemo(() => ordenarModelos(
    hijos.modelos.filter((modelo) => coincideBusqueda(modelo, query)),
    orden,
  ), [hijos.modelos, orden, query]);
  const seleccionado = modelosCatalogo.find((modelo) => modelo.id === seleccionadoId) ?? null;
  const cambiarModo = useCallback((siguiente: VistaModo) => {
    setModo(siguiente);
    escribirVistaCargar(siguiente);
  }, []);
  const alternarOrden = useCallback((columna: OrdenCargar["columna"]) => {
    setOrden((actual) => {
      const siguiente: OrdenCargar = actual.columna === columna
        ? { columna, direccion: actual.direccion === "asc" ? "desc" : "asc" }
        : { columna, direccion: columna === "nombre" ? "asc" : "desc" };
      escribirOrdenCargar(siguiente);
      return siguiente;
    });
  }, []);
  const abrirSeleccionado = useCallback((modeloId: Id | null) => {
    if (!modeloId) return;
    confirmarSiDirty(() => cargar(modeloId));
  }, [cargar, confirmarSiDirty]);
  const cargarEjemplo = useCallback((accion: () => void) => {
    confirmarSiDirty(() => {
      cerrar();
      accion();
    });
  }, [cerrar, confirmarSiDirty]);

  return (
    <Dialogo
      open={open}
      title="Cargar modelo"
      onCancel={cerrar}
      size="lg"
	      actions={(
	        <>
	          <button type="button" style={style.secondaryButton} onClick={cerrar}>Cancelar</button>
	          <button type="button" style={seleccionado ? style.primaryButton : style.disabledButton} disabled={!seleccionado} onClick={() => abrirSeleccionado(seleccionado?.id ?? null)}>Cargar</button>
	        </>
	      )}
	    >
	      <div style={style.container}>
        <div style={style.exampleBar}>
          <select
            aria-label="Cargar modelo de ejemplo"
            value={demoSeleccionado}
            style={style.demoSelect}
            onChange={(e) => {
              const nombre = e.currentTarget.value;
              if (!nombre) return;
              setDemoSeleccionado("");
              cargarEjemplo(() => {
                cargarFixtureDemo(nombre);
              });
            }}
          >
            <option value="" disabled>Ejemplos...</option>
            {demos.map((d) => (
              <option key={d.modelo.nombre} value={d.modelo.nombre} title={d.proposito}>
                {d.modelo.nombre}
              </option>
            ))}
          </select>
        </div>
	        <div style={style.flagsBar}>
          <label style={style.flag}>
            <input type="checkbox" checked={mostrarArchivados} onChange={toggleMostrarArchivados} />
            Mostrar archivados
          </label>
          <label style={style.flag}>
            <input type="checkbox" checked={mostrarVersiones} onChange={toggleMostrarVersiones} />
            Mostrar versiones
	          </label>
	        </div>
	        <div style={style.catalogo}>
	          <div style={style.catalogoToolbar}>
	            <input
	              type="search"
	              aria-label="Buscar modelos por nombre"
	              placeholder="Buscar por nombre o descripción..."
	              style={style.searchInput}
	              value={query}
	              onInput={(event) => setQuery(event.currentTarget.value)}
	            />
	            <button type="button" style={modo === "tiles" ? style.activeToggle : style.toggle} onClick={() => cambiarModo("tiles")} title="Vista de tiles" aria-label="Vista de tiles" aria-pressed={modo === "tiles"}><span aria-hidden="true">▦</span></button>
	            <button type="button" style={modo === "lista" ? style.activeToggle : style.toggle} onClick={() => cambiarModo("lista")} title="Vista de lista" aria-label="Vista de lista" aria-pressed={modo === "lista"}><span aria-hidden="true">☰</span></button>
	          </div>
	          {modo === "lista" ? (
	            <TablaModelos
	              modelos={modelosCatalogo}
	              seleccionadoId={seleccionadoId}
	              orden={orden}
	              mostrarVersiones={mostrarVersiones}
	              onOrden={alternarOrden}
	              onSeleccionar={setSeleccionadoId}
	              onAbrir={abrirSeleccionado}
	            />
	          ) : (
	            <div style={style.gridModelos}>
	              {modelosCatalogo.map((modelo) => (
	                <TileModelo
	                  key={modelo.id}
	                  modelo={modelo}
	                  seleccionado={modelo.id === seleccionadoId}
	                  mostrarVersiones={mostrarVersiones}
	                  onSeleccionar={setSeleccionadoId}
	                  onAbrir={abrirSeleccionado}
	                />
	              ))}
	            </div>
	          )}
	          {modelosCatalogo.length === 0 ? <div style={style.empty}>{query ? "Sin resultados para la búsqueda." : "Sin modelos en esta carpeta."}</div> : null}
	        </div>
	        <details open style={style.legacyExplorer}>
	          <summary style={style.folderSummary}>Explorar carpetas</summary>
	          <PanelCarpetas
	          hijos={hijos}
          breadcrumb={breadcrumb}
          carpetaActualId={carpetaActualId}
          vista={modo}
          query={query}
          onQueryChange={setQuery}
          onVistaChange={setModo}
          onAbrirCarpeta={(cId) => abrirCarpeta(cId)}
          onNavegarBreadcrumb={navegarBreadcrumb}
          onCrearCarpeta={crearCarpeta}
          onRenombrarCarpeta={renombrarCarpeta}
          onEliminarCarpeta={(cId) => { void eliminarCarpeta(cId, { cascada: false }); }}
	          onAbrirModelo={(mId) => {
	            setSeleccionadoId(mId);
	          }}
          onAbrirModeloEnPestana={(mId) => abrirPestanaConModelo(mId)}
          onCortarModelo={cortarModelo}
          onCortarCarpeta={cortarCarpeta}
          onPegarEn={pegarEn}
          onMoverModelo={moverModeloDirecto}
          onMoverCarpeta={moverCarpetaDirecto}
          onArchivarModelo={(mId) => { void archivarModelo(mId); }}
          onRestaurarModelo={(mId) => { void restaurarModelo(mId); }}
          onArchivarCarpeta={archivarCarpeta}
          onRestaurarCarpeta={restaurarCarpeta}
	          onAbrirVersiones={abrirVersiones}
          portapapeles={portapapeles}
          onCancelarPortapapeles={cancelarPortapapeles}
          mostrarVersiones={mostrarVersiones}
          recientes={[]}
          modoOperacion="carga"
	          />
	        </details>
	      </div>
	    </Dialogo>
	  );
}

type OrdenCargar = { columna: "nombre" | "descripcion" | "actualizadoEn" | "bytes"; direccion: "asc" | "desc" };
const VISTA_CARGAR_KEY = "deep-opm-pro:ui:vista-cargar";
const ORDEN_CARGAR_KEY = "deep-opm-pro:ui:orden-cargar";

function TileModelo(props: {
  modelo: ResumenModeloPersistido;
  seleccionado: boolean;
  mostrarVersiones: boolean;
  onSeleccionar: (id: Id) => void;
  onAbrir: (id: Id) => void;
}) {
  return (
    <div
      data-testid="modelo-tile-cargar"
      style={props.seleccionado ? style.tileSeleccionado : style.tileModelo}
      onClick={() => props.onSeleccionar(props.modelo.id)}
      onDblClick={() => props.onAbrir(props.modelo.id)}
      title={props.modelo.nombre}
    >
      <img src={regFileIcon} alt="" style={style.tileIcon} />
      <strong style={style.tileTitle}>{props.modelo.nombre}</strong>
      <span style={style.tileDesc}>{props.modelo.descripcion || "Sin descripción"}</span>
      <span style={style.tileDate}>{new Date(props.modelo.actualizadoEn).toLocaleString("es-CL")}</span>
      <Glifos modelo={props.modelo} mostrarVersiones={props.mostrarVersiones} />
      {props.modelo.archivado ? <span style={style.archiveBadge}>Archivado</span> : null}
      <button
        type="button"
        data-testid="reciente-modelo"
        style={style.tileLoadButton}
        onClick={(event) => {
          event.stopPropagation();
          props.onAbrir(props.modelo.id);
        }}
        onDblClick={(event) => event.stopPropagation()}
      >
        Cargar {props.modelo.nombre}
      </button>
    </div>
  );
}

function TablaModelos(props: {
  modelos: ResumenModeloPersistido[];
  seleccionadoId: Id | null;
  orden: OrdenCargar;
  mostrarVersiones: boolean;
  onOrden: (columna: OrdenCargar["columna"]) => void;
  onSeleccionar: (id: Id) => void;
  onAbrir: (id: Id) => void;
}) {
  return (
    <table style={style.table}>
      <thead>
        <tr>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("nombre")}>Nombre {marcaOrden(props.orden, "nombre")}</button></th>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("descripcion")}>Descripción {marcaOrden(props.orden, "descripcion")}</button></th>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("actualizadoEn")}>Modificado {marcaOrden(props.orden, "actualizadoEn")}</button></th>
          <th style={style.thButton}><button type="button" style={style.headerButton} onClick={() => props.onOrden("bytes")}>Tamaño {marcaOrden(props.orden, "bytes")}</button></th>
          <th style={style.th}>Glifos</th>
          <th style={style.th}>Acción</th>
        </tr>
      </thead>
      <tbody>
        {props.modelos.map((modelo) => (
          <tr
            key={modelo.id}
            style={props.seleccionadoId === modelo.id ? style.rowSeleccionada : style.row}
            onClick={() => props.onSeleccionar(modelo.id)}
            onDblClick={() => props.onAbrir(modelo.id)}
            data-testid="modelo-fila-cargar"
          >
            <td style={style.tdStrong}>{modelo.nombre}</td>
            <td style={style.td}>{modelo.descripcion || "Sin descripción"}</td>
            <td style={style.td}>{new Date(modelo.actualizadoEn).toLocaleString("es-CL")}</td>
            <td style={style.td}>{tamanoModelo(modelo)}</td>
            <td style={style.td}><Glifos modelo={modelo} mostrarVersiones={props.mostrarVersiones} /></td>
            <td style={style.td}>
              <button
                type="button"
                data-testid="reciente-modelo"
                style={style.inlineLoadButton}
                onClick={(event) => {
                  event.stopPropagation();
                  props.onAbrir(modelo.id);
                }}
              >
                Cargar {modelo.nombre}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Glifos(props: { modelo: ResumenModeloPersistido; mostrarVersiones: boolean }) {
  const versiones = props.modelo.versiones?.length ?? 0;
  return (
    <span style={style.glyphs}>
      <span title="Editable" aria-label="Editable" style={style.glyphText}>✎</span>
      {props.modelo.archivado ? <img src={lockIcon} alt="candado" style={style.glyphIcon} title="Archivado" /> : null}
      {props.modelo.autosalvado ? <img src={autosaveIcon} alt="autosalvado" style={style.glyphIcon} title="Autosalvado" /> : null}
      {props.mostrarVersiones && versiones > 0 ? <img src={verFileIcon} alt={`${versiones} versiones`} style={style.glyphIcon} title={`${versiones} versiones`} /> : null}
    </span>
  );
}

function coincideBusqueda(modelo: ResumenModeloPersistido, query: string): boolean {
  const q = query.trim().toLocaleLowerCase("es-CL");
  if (!q) return true;
  return modelo.nombre.toLocaleLowerCase("es-CL").includes(q) ||
    modelo.descripcion.toLocaleLowerCase("es-CL").includes(q);
}

function ordenarModelos(modelos: ResumenModeloPersistido[], orden: OrdenCargar): ResumenModeloPersistido[] {
  const dir = orden.direccion === "asc" ? 1 : -1;
  return [...modelos].sort((a, b) => {
    const va = valorOrden(a, orden.columna);
    const vb = valorOrden(b, orden.columna);
    return va.localeCompare(vb, "es-CL", { numeric: true }) * dir;
  });
}

function valorOrden(modelo: ResumenModeloPersistido, columna: OrdenCargar["columna"]): string {
  if (columna === "descripcion") return modelo.descripcion;
  if (columna === "actualizadoEn") return modelo.actualizadoEn;
  if (columna === "bytes") return tamanoModelo(modelo).padStart(12, "0");
  return modelo.nombre;
}

function tamanoModelo(modelo: ResumenModeloPersistido): string {
  return String(modelo.versiones?.[0]?.bytes ?? 0);
}

function marcaOrden(orden: OrdenCargar, columna: OrdenCargar["columna"]): string {
  if (orden.columna !== columna) return "";
  return orden.direccion === "asc" ? "↑" : "↓";
}

function leerVistaCargar(): VistaModo {
  try {
    const raw = globalThis.localStorage?.getItem(VISTA_CARGAR_KEY);
    return raw === "lista" ? "lista" : "tiles";
  } catch {
    return "tiles";
  }
}

function escribirVistaCargar(modo: VistaModo): void {
  try { globalThis.localStorage?.setItem(VISTA_CARGAR_KEY, modo); } catch { /* storage no disponible */ }
}

function leerOrdenCargar(): OrdenCargar {
  try {
    const raw = globalThis.localStorage?.getItem(ORDEN_CARGAR_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed && ["nombre", "descripcion", "actualizadoEn", "bytes"].includes(parsed.columna) && (parsed.direccion === "asc" || parsed.direccion === "desc")) {
      return parsed;
    }
  } catch { /* storage no disponible */ }
  return { columna: "actualizadoEn", direccion: "desc" };
}

function escribirOrdenCargar(orden: OrdenCargar): void {
  try { globalThis.localStorage?.setItem(ORDEN_CARGAR_KEY, JSON.stringify(orden)); } catch { /* storage no disponible */ }
}

const style = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "300px",
  },
  exampleBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    alignItems: "center",
  },
  demoSelect: {
    height: "34px",
    padding: "0 8px",
    border: "1px solid ${tokens.colors.bordeControl}",
    borderRadius: tokens.radii.sm,
    background: "${tokens.colors.fondoChrome}",
    color: "${tokens.colors.textoSecundario}",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    maxWidth: "220px",
  },
  primaryButton: {
    height: "34px",
    padding: "0 14px",
    border: "1px solid ${tokens.colors.chromeNeutral}",
    borderRadius: tokens.radii.sm,
    background: "${tokens.colors.chromeNeutral}",
    color: "${tokens.colors.fondoChrome}",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
  },
  secondaryButton: {
    height: "34px",
    padding: "0 14px",
    border: "1px solid ${tokens.colors.bordeControl}",
    borderRadius: tokens.radii.sm,
    background: "${tokens.colors.fondoChrome}",
    color: "${tokens.colors.textoSecundario}",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  disabledButton: {
    height: "34px",
    padding: "0 14px",
    border: "1px solid ${tokens.colors.bordeIntermedio}",
    borderRadius: tokens.radii.sm,
    background: "${tokens.colors.fondoDeshabilitado}",
    color: "${tokens.colors.textoDeshabilitado}",
    fontSize: "13px",
    fontWeight: 700,
  },
  flagsBar: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  flag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: "${tokens.colors.textoSecundario}",
    fontSize: "12px",
    fontWeight: 700,
  },
  catalogo: {
    display: "grid",
    gap: "8px",
    minHeight: "220px",
    border: "1px solid ${tokens.colors.bordeChrome}",
    borderRadius: tokens.radii.md,
    padding: "10px",
    background: "${tokens.colors.fondoCard}",
  },
  catalogoToolbar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  searchInput: {
    flex: "1 1 auto",
    height: "32px",
    border: "1px solid ${tokens.colors.bordeInput}",
    borderRadius: tokens.radii.sm,
    padding: "0 9px",
    fontSize: "13px",
  },
  toggle: botonToggle("${tokens.colors.bordeIntermedio}", "${tokens.colors.fondoChrome}", "${tokens.colors.textoSecundario}", 400),
  activeToggle: botonToggle("${tokens.colors.chromeNeutral}", "${tokens.colors.chromeNeutralSuave}", "${tokens.colors.textoPrimario}", 700),
  gridModelos: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "8px",
    maxHeight: "320px",
    overflow: "auto",
  },
  tileModelo: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "24px auto auto 18px 30px",
    gap: "4px",
    minHeight: "140px",
    padding: "10px",
    border: "1px solid ${tokens.colors.bordeIntermedio}",
    borderRadius: tokens.radii.md,
    background: "${tokens.colors.fondoChrome}",
    color: "${tokens.colors.textoPrimario}",
    textAlign: "left",
    cursor: "pointer",
  },
  tileSeleccionado: {
    position: "relative",
    display: "grid",
    gridTemplateRows: "24px auto auto 18px 30px",
    gap: "4px",
    minHeight: "140px",
    padding: "10px",
    border: "1px solid ${tokens.colors.canvas.proceso}",
    borderRadius: tokens.radii.md,
    background: "${tokens.colors.acentoUiSuave}",
    color: "${tokens.colors.textoPrimario}",
    textAlign: "left",
    cursor: "pointer",
  },
  tileIcon: { width: "24px", height: "24px" },
  tileTitle: { fontSize: "13px", overflowWrap: "anywhere" },
  tileDesc: { color: "${tokens.colors.textoTerciario}", fontSize: "12px", lineHeight: 1.25, overflowWrap: "anywhere" },
  tileDate: { color: "${tokens.colors.textoTerciario}", fontSize: "11px", fontWeight: 700 },
  tileLoadButton: { alignSelf: "end", height: "28px", border: "1px solid ${tokens.colors.chromeNeutral}", borderRadius: tokens.radii.sm, background: "${tokens.colors.fondoChrome}", color: "${tokens.colors.textoControl}", cursor: "pointer", fontSize: "12px", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  inlineLoadButton: { height: "28px", border: "1px solid ${tokens.colors.chromeNeutral}", borderRadius: tokens.radii.sm, background: "${tokens.colors.fondoChrome}", color: "${tokens.colors.textoControl}", cursor: "pointer", fontSize: "12px", fontWeight: 700 },
  glyphs: { display: "inline-flex", gap: "5px", alignItems: "center", justifySelf: "end" },
  glyphIcon: { width: "14px", height: "14px" },
  glyphText: { color: "${tokens.colors.chromeNeutral}", fontSize: "14px", fontWeight: 800, lineHeight: 1 },
  archiveBadge: {
    position: "absolute",
    right: "8px",
    top: "8px",
    padding: "1px 5px",
    border: "1px solid ${tokens.colors.bordeControl}",
    borderRadius: tokens.radii.sm,
    background: "${tokens.colors.fondoChrome}",
    color: "${tokens.colors.chromeNeutral}",
    fontSize: "10px",
    fontWeight: 800,
  },
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: { padding: "6px 8px", borderBottom: "2px solid ${tokens.colors.bordeIntermedio}", color: "${tokens.colors.textoTerciario}", textAlign: "left" },
  thButton: { padding: 0, borderBottom: "2px solid ${tokens.colors.bordeIntermedio}", textAlign: "left" },
  headerButton: { width: "100%", minHeight: "30px", border: 0, background: "transparent", color: "${tokens.colors.textoTerciario}", fontWeight: 800, textAlign: "left", cursor: "pointer" },
  row: { borderBottom: "1px solid ${tokens.colors.fondoMuted}", cursor: "pointer" },
  rowSeleccionada: { borderBottom: "1px solid ${tokens.colors.fondoMuted}", background: "${tokens.colors.acentoUiSuave}", cursor: "pointer" },
  td: { padding: "8px", color: "${tokens.colors.textoSecundario}", verticalAlign: "top" },
  tdStrong: { padding: "8px", color: "${tokens.colors.textoPrimario}", fontWeight: 800, verticalAlign: "top" },
  empty: { padding: "18px", border: "1px dashed ${tokens.colors.bordeControl}", borderRadius: tokens.radii.sm, color: "${tokens.colors.textoTerciario}", fontSize: "13px", fontWeight: 700, textAlign: "center" },
  legacyExplorer: { border: "1px solid ${tokens.colors.bordeChrome}", borderRadius: tokens.radii.md, padding: "8px", background: "${tokens.colors.fondoChrome}" },
  folderSummary: { color: "${tokens.colors.chromeNeutral}", fontSize: "13px", fontWeight: 800, cursor: "pointer" },
} satisfies Record<string, preact.JSX.CSSProperties>;

function botonToggle(border: string, background: string, color: string, fontWeight: number): preact.JSX.CSSProperties {
  return { width: "30px", height: "30px", border: `1px solid ${border}`, borderRadius: tokens.radii.sm, background, color, cursor: "pointer", fontSize: "15px", lineHeight: 1, padding: 0, fontWeight };
}
