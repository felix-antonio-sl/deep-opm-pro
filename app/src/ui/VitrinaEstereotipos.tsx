// Superficie «Piezas» (corte "gesto de anclar", B2+B3) — la PUERTA del Anclaje.
//
// Generaliza la antigua Vitrina de estereotipos en una superficie con SELECTOR DE
// FUENTE: «Este modelo» (estereotipos locales del modelo activo, comportamiento de
// siempre) + cada modelo designado biblioteca (`esBiblioteca=true`), cuyas ENTIDADES
// son Piezas. Sobre una Pieza externa hay dos verbos:
//   · Calcar (default brutal, tinta sólida): clona-y-olvida, sin anclaje.
//   · Anclar (hairline callado, SOLO fuente externa): clona + ata a la biblioteca viva.
// La Pieza aterriza SELECCIONADA reusando el `seleccionId` del store (sin 4º tipo
// seleccionable). El renombre es de la CARA (título + etiquetas), NO el refactor
// interno `estereotipo*`→`calco*` (sigue diferido); el símbolo sigue siendo
// `VitrinaEstereotipos` (el lazy-import de App.tsx queda intacto).
//
// Dependencias unidireccionales: la UI invoca acciones del store; el store invoca el
// kernel. La fuente externa se LEE del backend (`cargarModeloBackend`) solo para
// listar Piezas; la mutación (Calcar/Anclar) pasa por el store. La selección/resaltado
// de items es estado LOCAL (useState) — nunca el trío sellado del store.
//
// Spec: docs/superpowers/specs/2026-06-29-gesto-anclar-puerta-design.md §1, §2.
import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { enumerarEstereotipos } from "../modelo/estereotipos";
import { agruparEstereotipos, type GruposEstereotipos } from "../modelo/estereotiposVitrina";
import type { Entidad, Estado, Estereotipo, Modelo, TipoEntidad } from "../modelo/tipos";
import { listarBibliotecas } from "../persistencia/workspace";
import { cargarModeloBackend } from "../persistencia/backend";
import { hidratarModelo } from "../serializacion/json";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

const GRUPOS: ReadonlyArray<{ clave: keyof GruposEstereotipos; titulo: string }> = [
  { clave: "objetos", titulo: "Objetos" },
  { clave: "enlaces", titulo: "Enlaces" },
  { clave: "patrones", titulo: "Patrones compuestos" },
  { clave: "marcadores", titulo: "Marcadores" },
];

const PIEZA_GRUPOS: ReadonlyArray<{ tipo: TipoEntidad; titulo: string }> = [
  { tipo: "objeto", titulo: "Objetos" },
  { tipo: "proceso", titulo: "Procesos" },
];

const FUENTE_LOCAL = "local" as const;

interface BibliotecaCargada {
  modeloId: string;
  modelo: Modelo;
}

export function VitrinaEstereotipos() {
  const abierta = useOpmStore((s) => s.vitrinaEstereotiposAbierta);
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const indice = useOpmStore((s) => s.indice);
  const modelosGuardados = useOpmStore((s) => s.modelosGuardados);
  const cerrar = useOpmStore((s) => s.cerrarVitrinaEstereotipos);
  const injertar = useOpmStore((s) => s.injertarEstereotipoEnOpd);
  const crearDesdeSeleccion = useOpmStore((s) => s.crearEstereotipoDesdeSeleccionActual);
  const calcarPieza = useOpmStore((s) => s.calcarPiezaBiblioteca);
  const anclarPieza = useOpmStore((s) => s.anclarPiezaBiblioteca);

  // Estado LOCAL del componente (no toca el trío sellado del store).
  const [fuente, setFuente] = useState<string>(FUENTE_LOCAL);
  const [biblioteca, setBiblioteca] = useState<BibliotecaCargada | null>(null);
  const [cargando, setCargando] = useState(false);
  const [errorCarga, setErrorCarga] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [proposito, setProposito] = useState("");
  const [resaltadoId, setResaltadoId] = useState<string | null>(null);

  // Bibliotecas designadas (B1): id del índice cruzado con `modelosGuardados` por nombre.
  const nombrePorId = new Map(modelosGuardados.map((m) => [m.id, m.nombre]));
  const bibliotecas = listarBibliotecas(indice).map((m) => ({
    id: m.id,
    nombre: nombrePorId.get(m.id) ?? m.id,
  }));

  // Reset total al cerrar.
  useEffect(() => {
    if (!abierta) {
      setFuente(FUENTE_LOCAL);
      setBiblioteca(null);
      setCargando(false);
      setErrorCarga(null);
      setNombre("");
      setProposito("");
      setResaltadoId(null);
    }
  }, [abierta]);

  // Carga de la biblioteca externa seleccionada (lee del backend solo para listar).
  useEffect(() => {
    if (!abierta || fuente === FUENTE_LOCAL) {
      setBiblioteca(null);
      setErrorCarga(null);
      setCargando(false);
      return;
    }
    if (biblioteca?.modeloId === fuente) return;
    let vigente = true;
    setCargando(true);
    setErrorCarga(null);
    setBiblioteca(null);
    void (async () => {
      const cargado = await cargarModeloBackend(fuente);
      if (!vigente) return;
      if (!cargado.ok) {
        setCargando(false);
        setErrorCarga("No se pudo leer la biblioteca.");
        return;
      }
      const hidratado = hidratarModelo(cargado.value.json);
      if (!vigente) return;
      if (!hidratado.ok) {
        setCargando(false);
        setErrorCarga("La biblioteca tiene un formato inválido.");
        return;
      }
      setBiblioteca({ modeloId: fuente, modelo: hidratado.value });
      setCargando(false);
    })();
    return () => {
      vigente = false;
    };
  }, [abierta, fuente, biblioteca?.modeloId]);

  if (!abierta) return null;

  const esLocal = fuente === FUENTE_LOCAL;
  const nombreFuente = esLocal ? "este modelo" : (bibliotecas.find((b) => b.id === fuente)?.nombre ?? fuente);

  const grupos = agruparEstereotipos(enumerarEstereotipos(modelo));
  const conPlantilla = grupos.objetos.length + grupos.enlaces.length + grupos.patrones.length;
  const soloRequirement = conPlantilla === 0;
  const haySeleccion = seleccionados.length > 0;
  const nombreLimpio = nombre.trim();

  // Piezas de la biblioteca: entidades objeto/proceso (sin atributos).
  const piezasPorTipo = (tipo: TipoEntidad): Entidad[] =>
    biblioteca
      ? Object.values(biblioteca.modelo.entidades)
          .filter((e) => e.tipo === tipo && !e.esAtributo)
          .sort((a, b) => a.nombre.localeCompare(b.nombre, "es-CL"))
      : [];
  const totalPiezas = piezasPorTipo("objeto").length + piezasPorTipo("proceso").length;

  const estadosDePieza = (pieza: Entidad): Estado[] =>
    biblioteca ? Object.values(biblioteca.modelo.estados).filter((s) => s.entidadId === pieza.id) : [];

  const calcar = (pieza: Entidad) => calcarPieza({ entidad: pieza, estados: estadosDePieza(pieza) });
  const anclar = (pieza: Entidad) => {
    if (!biblioteca) return;
    void anclarPieza({
      entidad: pieza,
      estados: estadosDePieza(pieza),
      modeloId: biblioteca.modeloId,
      nombre: nombreFuente,
    });
  };

  const guardar = () => {
    if (!nombreLimpio || !haySeleccion) return;
    const propLimpio = proposito.trim();
    crearDesdeSeleccion(nombreLimpio, propLimpio ? { propositoDeModelado: propLimpio } : undefined);
    setNombre("");
    setProposito("");
  };

  return (
    <Dialogo
      open={abierta}
      title="Piezas"
      onCancel={cerrar}
      size="lg"
      testId="vitrina-estereotipos"
      actions={<DialogoAccion onClick={cerrar}>Cerrar</DialogoAccion>}
    >
      <div style={style.body}>
        <section style={style.fuente} aria-label="Fuente de Piezas">
          <span style={style.fuenteRotulo}>Fuente</span>
          <div style={style.fuenteChips} role="radiogroup" aria-label="Fuente de Piezas">
            <ChipFuente activo={esLocal} onClick={() => setFuente(FUENTE_LOCAL)} testId="piezas-fuente-local">
              Este modelo
            </ChipFuente>
            {bibliotecas.map((b) => (
              <ChipFuente
                key={b.id}
                activo={fuente === b.id}
                onClick={() => setFuente(b.id)}
                testId={`piezas-fuente-${b.id}`}
              >
                {b.nombre}
              </ChipFuente>
            ))}
          </div>
          <p style={style.fuenteAyuda} data-testid="piezas-ayuda">
            {esLocal
              ? "Estereotipos de este modelo. Calcar inserta una copia en el OPD activo."
              : `De ${nombreFuente}: Calcar trae una copia tuya; Anclar la mantiene vigilada (te avisa si ${nombreFuente} cambia).`}
          </p>
        </section>

        {esLocal ? (
          <>
            {soloRequirement ? (
              <p style={style.empty} data-testid="vitrina-empty">
                Aún no has guardado estereotipos. Selecciona cosas en el lienzo y guárdalas como
                estereotipo para reusarlas.
              </p>
            ) : null}

            {GRUPOS.map(({ clave, titulo }) => {
              const items = grupos[clave];
              if (items.length === 0) return null;
              return (
                <section key={clave} style={style.grupo} aria-label={titulo}>
                  <h3 style={style.grupoTitulo}>
                    {titulo} <span style={style.grupoCuenta}>{items.length}</span>
                  </h3>
                  <ul style={style.lista}>
                    {items.map((estereotipo) => (
                      <ItemEstereotipo
                        key={estereotipo.id}
                        estereotipo={estereotipo}
                        resaltado={resaltadoId === estereotipo.id}
                        onResaltar={() => setResaltadoId(estereotipo.id)}
                        {...(estereotipo.plantilla ? { onCalcar: () => injertar(estereotipo.id) } : {})}
                      />
                    ))}
                  </ul>
                </section>
              );
            })}

            <section style={style.guardar} aria-label="Guardar selección como estereotipo">
              <h3 style={style.grupoTitulo}>Guardar selección como estereotipo</h3>
              <div style={style.guardarFila}>
                <input
                  type="text"
                  value={nombre}
                  placeholder="Nombre del estereotipo"
                  aria-label="Nombre del nuevo estereotipo"
                  onInput={(event) => setNombre(event.currentTarget.value)}
                  style={style.input}
                />
                <DialogoAccion
                  tono="primaria"
                  disabled={!haySeleccion || !nombreLimpio}
                  onClick={guardar}
                  testId="vitrina-guardar"
                >
                  Guardar
                </DialogoAccion>
              </div>
              <input
                type="text"
                value={proposito}
                placeholder="Propósito de modelado (opcional): por qué/cuándo usarlo"
                aria-label="Propósito de modelado del estereotipo (opcional)"
                onInput={(event) => setProposito(event.currentTarget.value)}
                style={style.input}
                data-testid="vitrina-proposito"
              />
              <p style={style.hint}>
                {haySeleccion
                  ? `${seleccionados.length} cosa${seleccionados.length === 1 ? "" : "s"} seleccionada${seleccionados.length === 1 ? "" : "s"} se capturarán como plantilla injertable.`
                  : "Selecciona cosas en el lienzo para habilitar el guardado."}
              </p>
            </section>
          </>
        ) : (
          <>
            {cargando ? (
              <p style={style.empty} data-testid="piezas-cargando">Cargando Piezas…</p>
            ) : errorCarga ? (
              <p style={style.empty} data-testid="piezas-error">{errorCarga}</p>
            ) : totalPiezas === 0 ? (
              <p style={style.empty} data-testid="piezas-empty">
                Esta biblioteca no tiene Piezas (objetos o procesos) para traer.
              </p>
            ) : (
              PIEZA_GRUPOS.map(({ tipo, titulo }) => {
                const items = piezasPorTipo(tipo);
                if (items.length === 0) return null;
                return (
                  <section key={tipo} style={style.grupo} aria-label={titulo}>
                    <h3 style={style.grupoTitulo}>
                      {titulo} <span style={style.grupoCuenta}>{items.length}</span>
                    </h3>
                    <ul style={style.lista}>
                      {items.map((pieza) => (
                        <ItemPieza
                          key={pieza.id}
                          pieza={pieza}
                          resaltado={resaltadoId === pieza.id}
                          onResaltar={() => setResaltadoId(pieza.id)}
                          onCalcar={() => calcar(pieza)}
                          onAnclar={() => anclar(pieza)}
                        />
                      ))}
                    </ul>
                  </section>
                );
              })
            )}
          </>
        )}
      </div>
    </Dialogo>
  );
}

interface ChipFuenteProps {
  activo: boolean;
  onClick: () => void;
  testId: string;
  children: preact.ComponentChildren;
}

function ChipFuente({ activo, onClick, testId, children }: ChipFuenteProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activo}
      onClick={onClick}
      data-testid={testId}
      style={activo ? style.fuenteChipActivo : style.fuenteChip}
    >
      {children}
    </button>
  );
}

interface ItemEstereotipoProps {
  estereotipo: Estereotipo;
  resaltado: boolean;
  onResaltar: () => void;
  onCalcar?: () => void;
}

function ItemEstereotipo({ estereotipo, resaltado, onResaltar, onCalcar }: ItemEstereotipoProps) {
  return (
    <li
      data-testid={`vitrina-item-${estereotipo.id}`}
      onMouseEnter={onResaltar}
      style={resaltado ? style.itemResaltado : style.item}
    >
      <div style={style.itemTexto}>
        <span style={style.itemNombre}>{`<<${estereotipo.nombre}>>`}</span>
        {estereotipo.propositoDeModelado ? (
          <span style={style.itemProposito}>{estereotipo.propositoDeModelado}</span>
        ) : null}
      </div>
      {onCalcar ? (
        <button type="button" onClick={onCalcar} data-testid={`vitrina-injertar-${estereotipo.id}`} style={style.botonCalcar}>
          Calcar
        </button>
      ) : (
        <span style={style.itemMarcador} aria-hidden="true">marcador</span>
      )}
    </li>
  );
}

interface ItemPiezaProps {
  pieza: Entidad;
  resaltado: boolean;
  onResaltar: () => void;
  onCalcar: () => void;
  onAnclar: () => void;
}

function ItemPieza({ pieza, resaltado, onResaltar, onCalcar, onAnclar }: ItemPiezaProps) {
  const subtitulo = pieza.tipo === "objeto" ? "objeto" : "proceso";
  return (
    <li
      data-testid={`pieza-item-${pieza.id}`}
      tabIndex={0}
      onMouseEnter={onResaltar}
      onFocus={onResaltar}
      onKeyDown={(event) => {
        // Enter sobre el ítem enfocado = Calcar (default brutal). Solo cuando el foco
        // está en la fila, no en un botón interno (evita doble disparo con Anclar).
        if (event.key === "Enter" && event.target === event.currentTarget) {
          event.preventDefault();
          onCalcar();
        }
      }}
      style={resaltado ? style.itemResaltado : style.item}
    >
      <div style={style.itemTexto}>
        <span style={style.itemNombre}>{pieza.nombre}</span>
        <span style={style.itemProposito}>{subtitulo}</span>
      </div>
      <div style={style.piezaAcciones}>
        <button type="button" onClick={onCalcar} data-testid={`pieza-calcar-${pieza.id}`} style={style.botonCalcar}>
          Calcar
        </button>
        <button type="button" onClick={onAnclar} data-testid={`pieza-anclar-${pieza.id}`} style={style.botonAnclar}>
          Anclar
        </button>
      </div>
    </li>
  );
}

const style = {
  body: { display: "grid", gap: "16px", width: "100%" },
  fuente: {
    display: "grid",
    gap: "8px",
    paddingBottom: "12px",
    borderBottom: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  fuenteRotulo: {
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  fuenteChips: { display: "flex", flexWrap: "wrap", gap: "6px" },
  fuenteChip: {
    padding: "5px 12px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    cursor: "pointer",
  },
  fuenteChipActivo: {
    padding: "5px 12px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  fuenteAyuda: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px", lineHeight: 1.5 },
  empty: {
    margin: 0,
    padding: "12px 14px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    lineHeight: 1.5,
  },
  grupo: { display: "grid", gap: "8px" },
  grupoTitulo: {
    margin: 0,
    color: tokens.colors.ink70,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  grupoCuenta: {
    color: tokens.colors.ink50,
    fontVariantNumeric: "tabular-nums",
    fontWeight: 400,
  },
  lista: { listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "6px" },
  item: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "12px",
    padding: "8px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    background: tokens.colors.paper,
  },
  itemResaltado: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    gap: "12px",
    padding: "8px 10px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    background: tokens.colors.paperWarm,
  },
  itemTexto: { display: "grid", gap: "2px", minWidth: 0 },
  itemNombre: {
    color: tokens.colors.ink,
    fontFamily: tokens.typography.serif,
    fontSize: "13px",
    fontWeight: 700,
  },
  itemProposito: {
    color: tokens.colors.ink50,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    lineHeight: 1.4,
  },
  itemMarcador: {
    color: tokens.colors.inkFaint,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  piezaAcciones: { display: "flex", alignItems: "center", gap: "8px" },
  // Calcar — acción primaria, tinta sólida (no crimson). Espeja `botonResync`.
  botonCalcar: {
    height: "28px",
    padding: "0 14px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.ink,
    color: tokens.colors.paper,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 600,
  },
  // Anclar — escotilla hairline callada. Espeja `botonSoltar`.
  botonAnclar: {
    height: "28px",
    padding: "0 12px",
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ink15}`,
    borderRadius: tokens.radii.xs,
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    cursor: "pointer",
    fontFamily: tokens.typography.familyChrome,
    fontSize: "12px",
    fontWeight: 600,
  },
  guardar: {
    display: "grid",
    gap: "8px",
    paddingTop: "12px",
    borderTop: `${tokens.stroke.hairline}px solid ${tokens.colors.rule}`,
  },
  guardarFila: { display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "10px", alignItems: "center" },
  input: {
    height: "32px",
    minWidth: 0,
    border: `${tokens.stroke.hairline}px solid ${tokens.colors.ruleStrong}`,
    borderRadius: 0,
    padding: "0 10px",
    background: tokens.colors.paper,
    color: tokens.colors.ink,
    fontFamily: tokens.typography.familyChrome,
    fontSize: "13px",
  },
  hint: { margin: 0, color: tokens.colors.ink50, fontFamily: tokens.typography.familyChrome, fontSize: "12px" },
} satisfies Record<string, preact.JSX.CSSProperties>;
