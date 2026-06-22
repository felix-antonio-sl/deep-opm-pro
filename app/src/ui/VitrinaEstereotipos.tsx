// D6.4 — Vitrina de estereotipos: galería agrupada (marcadores / objetos /
// enlaces / patrones compuestos) lista para INJERTAR en el OPD activo, más un
// camino para GUARDAR la selección actual como estereotipo reusable. Es el bucle
// del sueño: el conocedor de dominio cura sus patrones y los reincorpora.
//
// Dependencias unidireccionales: la UI invoca acciones del store; el store
// invoca el kernel (injertarEstereotipo / crearEstereotipoDesdeSeleccion). La
// vitrina NO re-implementa reglas. La selección/resaltado de items es estado
// LOCAL (useState) — nunca el trío sellado del store.
import { useEffect, useState } from "preact/hooks";
import { useOpmStore } from "../store";
import { enumerarEstereotipos } from "../modelo/estereotipos";
import { agruparEstereotipos, type GruposEstereotipos } from "../modelo/estereotiposVitrina";
import type { Estereotipo } from "../modelo/tipos";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

const GRUPOS: ReadonlyArray<{ clave: keyof GruposEstereotipos; titulo: string }> = [
  { clave: "objetos", titulo: "Objetos" },
  { clave: "enlaces", titulo: "Enlaces" },
  { clave: "patrones", titulo: "Patrones compuestos" },
  { clave: "marcadores", titulo: "Marcadores" },
];

export function VitrinaEstereotipos() {
  const abierta = useOpmStore((s) => s.vitrinaEstereotiposAbierta);
  const modelo = useOpmStore((s) => s.modelo);
  const seleccionados = useOpmStore((s) => s.seleccionados);
  const cerrar = useOpmStore((s) => s.cerrarVitrinaEstereotipos);
  const injertar = useOpmStore((s) => s.injertarEstereotipoEnOpd);
  const crearDesdeSeleccion = useOpmStore((s) => s.crearEstereotipoDesdeSeleccionActual);

  // Estado LOCAL del componente (no toca el trío sellado del store).
  const [nombre, setNombre] = useState("");
  const [proposito, setProposito] = useState("");
  const [resaltadoId, setResaltadoId] = useState<string | null>(null);

  useEffect(() => {
    if (!abierta) {
      setNombre("");
      setProposito("");
      setResaltadoId(null);
    }
  }, [abierta]);

  if (!abierta) return null;

  const grupos = agruparEstereotipos(enumerarEstereotipos(modelo));
  const conPlantilla = grupos.objetos.length + grupos.enlaces.length + grupos.patrones.length;
  const soloRequirement = conPlantilla === 0;
  const haySeleccion = seleccionados.length > 0;
  const nombreLimpio = nombre.trim();

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
      title="Vitrina de estereotipos"
      onCancel={cerrar}
      size="lg"
      testId="vitrina-estereotipos"
      actions={<DialogoAccion onClick={cerrar}>Cerrar</DialogoAccion>}
    >
      <div style={style.body}>
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
                    {...(estereotipo.plantilla ? { onInjertar: () => injertar(estereotipo.id) } : {})}
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
      </div>
    </Dialogo>
  );
}

interface ItemProps {
  estereotipo: Estereotipo;
  resaltado: boolean;
  onResaltar: () => void;
  onInjertar?: () => void;
}

function ItemEstereotipo({ estereotipo, resaltado, onResaltar, onInjertar }: ItemProps) {
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
      {onInjertar ? (
        <DialogoAccion
          tono="primaria"
          onClick={onInjertar}
          testId={`vitrina-injertar-${estereotipo.id}`}
        >
          Injertar
        </DialogoAccion>
      ) : (
        <span style={style.itemMarcador} aria-hidden="true">marcador</span>
      )}
    </li>
  );
}

const style = {
  body: { display: "grid", gap: "16px", width: "100%" },
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
