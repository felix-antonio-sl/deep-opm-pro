// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { useEffect, useState } from "preact/hooks";
import { puertoExactoCompartidoDeAbanico } from "../../modelo/abanicos";
import { anclaEnlaceMasCercana, OPCIONES_ANCLA_RELOJ_ENLACE } from "../../modelo/anclajesEnlace";
import { nombreExtremo } from "../../modelo/extremos";
import { estadosDeEntidad } from "../../modelo/operaciones";
import type { Abanico, Enlace, Id, Modelo, OperadorAbanico } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { tokens } from "../tokens";

interface Props {
  abanico: Abanico | undefined;
  modelo: Modelo;
  onAlternarOperador: (operador: OperadorAbanico) => void;
  onProbabilidades: (probabilidades: Record<Id, number> | undefined) => void;
  onQuitarRama: () => void;
  onDisolver: () => void;
  onResolver: () => void;
}

export interface FilaEditorProbabilidadAbanico {
  enlaceId: Id;
  etiqueta: string;
  valor: string;
}

export interface EditorProbabilidadesAbanico {
  filas: FilaEditorProbabilidadAbanico[];
  suma: number;
  error: string | null;
  pesos: Record<Id, number> | null;
}

export function SeccionAbanico(props: Props) {
  if (!props.abanico) return null;
  return <SeccionAbanicoActiva {...props} abanico={props.abanico} />;
}

interface PropsActiva extends Omit<Props, "abanico"> {
  abanico: Abanico;
}

function SeccionAbanicoActiva(props: PropsActiva) {
  const [probabilidades, setProbabilidades] = useState<Record<Id, string>>({});
  const puerto = puertoExactoCompartidoDeAbanico(props.modelo, props.abanico);
  const entidadPuerto = puerto ? props.modelo.entidades[puerto.entidadId] : undefined;
  const aparienciaPuerto = puerto
    ? Object.values(props.modelo.opds[props.abanico.opdId]?.apariencias ?? {})
      .find((apariencia) => apariencia.entidadId === puerto.entidadId)
    : undefined;
  const puertoApariencia = puerto ? aparienciaPuerto?.ports?.[puerto.portId] : undefined;
  const ancla = puertoApariencia ? OPCIONES_ANCLA_RELOJ_ENLACE.find((opcion) => opcion.id === anclaEnlaceMasCercana(puertoApariencia)) : undefined;
  const decision = props.abanico.operador === "XOR" ? describirDecision(props.modelo, props.abanico) : null;
  const versionProbabilidades = props.abanico.enlaceIds
    .map((enlaceId) => props.modelo.enlaces[enlaceId]?.probabilidad ?? "")
    .join("|");

  useEffect(() => {
    setProbabilidades(valoresInicialesProbabilidades(props.modelo, props.abanico));
  }, [props.abanico.id, props.abanico.enlaceIds.join("|"), versionProbabilidades]);

  const editorProbabilidades = props.abanico.operador === "XOR"
    ? modeloEditorProbabilidadesAbanico(props.modelo, props.abanico, probabilidades)
    : null;
  const aplicarProbabilidades = () => {
    if (!editorProbabilidades?.pesos) return;
    props.onProbabilidades(editorProbabilidades.pesos);
  };
  const limpiarProbabilidades = () => {
    setProbabilidades(Object.fromEntries(props.abanico.enlaceIds.map((enlaceId) => [enlaceId, ""])));
    props.onProbabilidades(undefined);
  };

  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Abanico {props.abanico.operador}</h3>
      <div style={helpStyle}>
        {props.abanico.enlaceIds.length} ramas comparten puerto.{" "}
        {props.abanico.operador === "XOR" ? "Exactamente una se cumple." : "Al menos una se cumple."}
      </div>
      <div data-testid="abanico-puerto-exacto" style={puertoPanelStyle}>
        <span style={puertoLabelStyle}>Puerto común</span>
        {puerto && entidadPuerto ? (
          <>
            <span style={puertoValorStyle}>
              {entidadPuerto.nombre} · {puerto.lado} · {ancla?.hora ?? "puerto exacto"}
            </span>
            <code style={puertoCodeStyle}>{puerto.portId}</code>
          </>
        ) : (
          <span style={puertoIncompletoStyle}>sin puerto exacto visible</span>
        )}
      </div>
      {decision ? (
        <div data-testid="abanico-decision" style={puertoPanelStyle}>
          <span style={puertoLabelStyle}>Decisión</span>
          <span style={puertoValorStyle}>{decision.label}</span>
          <span style={decisionTraceStyle}>{decision.detail}</span>
          <button type="button" style={style.secondaryButton} disabled={!decision.resoluble} onClick={props.onResolver}>
            Resolver ahora
          </button>
        </div>
      ) : null}
      {editorProbabilidades ? (
        <div data-testid="abanico-probabilidades" style={puertoPanelStyle}>
          <span style={puertoLabelStyle}>Probabilidades</span>
          <span style={puertoValorStyle}>Política explícita de decisión XOR</span>
          <div style={probabilidadesGridStyle}>
            {editorProbabilidades.filas.map((fila) => (
              <label key={fila.enlaceId} style={probabilidadRowStyle}>
                <span title={fila.enlaceId} style={probabilidadRamaStyle}>{fila.etiqueta}</span>
                <span style={probabilidadInputWrapStyle}>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    inputMode="decimal"
                    aria-label={`Probabilidad ${fila.etiqueta}`}
                    data-testid={`abanico-probabilidad-${fila.enlaceId}`}
                    style={editorProbabilidades.error ? inputProbabilidadErrorStyle : inputProbabilidadStyle}
                    value={fila.valor}
                    onInput={(event) => setProbabilidades((actual) => ({ ...actual, [fila.enlaceId]: event.currentTarget.value }))}
                  />
                  <span style={porcentajeSuffixStyle}>%</span>
                </span>
              </label>
            ))}
          </div>
          <span style={editorProbabilidades.error ? probabilidadErrorStyle : probabilidadSumaStyle}>
            Suma: {formatearNumero(editorProbabilidades.suma)}%
          </span>
          {editorProbabilidades.error ? <span role="alert" style={probabilidadErrorStyle}>{editorProbabilidades.error}</span> : null}
          <div style={buttonRowStyle}>
            <button type="button" data-testid="abanico-probabilidades-aplicar" style={style.secondaryButton} disabled={!editorProbabilidades.pesos} onClick={aplicarProbabilidades}>
              Aplicar probabilidades
            </button>
            <button type="button" data-testid="abanico-probabilidades-limpiar" style={style.secondaryButton} onClick={limpiarProbabilidades}>
              Limpiar probabilidades
            </button>
          </div>
        </div>
      ) : null}
      <div style={buttonRowStyle}>
        <button type="button" data-testid="abanico-toggle-O" style={style.secondaryButton} disabled={props.abanico.operador === "O"} onClick={() => props.onAlternarOperador("O" satisfies OperadorAbanico)}>O</button>
        <button type="button" data-testid="abanico-toggle-XOR" style={style.secondaryButton} disabled={props.abanico.operador === "XOR"} onClick={() => props.onAlternarOperador("XOR" satisfies OperadorAbanico)}>XOR</button>
      </div>
      <div style={buttonRowStyle}>
        <button type="button" style={style.secondaryButton} onClick={props.onQuitarRama}>Quitar rama</button>
        <button type="button" style={style.secondaryButton} onClick={props.onDisolver}>Disolver abanico</button>
      </div>
    </section>
  );
}

function describirDecision(modelo: Modelo, abanico: Abanico): { label: string; detail: string; resoluble: boolean } {
  const enlaces = abanico.enlaceIds.map((id) => modelo.enlaces[id]).filter((enlace): enlace is Enlace => !!enlace);
  if (abanico.decision) {
    if (abanico.decision.modo === "estado-fijo") return { label: "Estado fijo", detail: modelo.estados[abanico.decision.estadoId]?.nombre ?? abanico.decision.estadoId, resoluble: true };
    if (abanico.decision.modo === "uniforme") return { label: "Uniforme", detail: "Distribuye las ramas en partes iguales.", resoluble: true };
    if (abanico.decision.modo === "probabilidades") return { label: "Probabilidades explícitas", detail: "Usa los pesos definidos en la política.", resoluble: true };
    return { label: "Función registrada", detail: abanico.decision.funcionId, resoluble: false };
  }
  if (enlaces.length > 0 && enlaces.every((enlace) => enlace.probabilidad !== undefined)) {
    return { label: "Probabilidades explícitas", detail: enlaces.map((enlace) => `${enlace.id}: ${enlace.probabilidad}`).join(" · "), resoluble: true };
  }
  const objetoId = objetoComunDestino(enlaces);
  if (objetoId && estadosDeEntidad(modelo, objetoId).length > 0) {
    return { label: "Uniforme", detail: `${modelo.entidades[objetoId]?.nombre ?? objetoId}: estados equiprobables`, resoluble: true };
  }
  return { label: "Sin política resoluble", detail: "Define probabilidades o ramas hacia estados para resolver.", resoluble: false };
}

export function modeloEditorProbabilidadesAbanico(
  modelo: Modelo,
  abanico: Abanico,
  valores: Record<Id, string> = valoresInicialesProbabilidades(modelo, abanico),
): EditorProbabilidadesAbanico {
  const puerto = puertoExactoCompartidoDeAbanico(modelo, abanico);
  const filas = abanico.enlaceIds.map((enlaceId) => {
    const enlace = modelo.enlaces[enlaceId];
    return {
      enlaceId,
      etiqueta: enlace ? etiquetaRamaAbanico(modelo, enlace, puerto) : enlaceId,
      valor: valores[enlaceId] ?? "",
    };
  });
  const numeros: Record<Id, number> = {};
  let suma = 0;
  const todosVacios = filas.every((fila) => fila.valor.trim() === "");
  if (todosVacios) {
    return { filas, suma, error: null, pesos: null };
  }
  for (const fila of filas) {
    const texto = fila.valor.trim();
    if (texto === "") {
      return { filas, suma, error: "Completa todas las ramas para aplicar probabilidades.", pesos: null };
    }
    const numero = Number(texto.replace(",", "."));
    if (!Number.isFinite(numero) || numero < 0 || numero > 100) {
      return { filas, suma, error: "Usa porcentajes entre 0 y 100.", pesos: null };
    }
    numeros[fila.enlaceId] = numero;
    suma += numero;
  }
  suma = redondearPorcentaje(suma);
  if (Math.abs(suma - 100) > 1e-6) {
    return { filas, suma, error: "Las probabilidades deben sumar 100%.", pesos: null };
  }
  const pesos = Object.fromEntries(Object.entries(numeros).map(([enlaceId, porcentaje]) => [enlaceId, porcentaje / 100]));
  return { filas, suma, error: null, pesos };
}

function valoresInicialesProbabilidades(modelo: Modelo, abanico: Abanico): Record<Id, string> {
  return Object.fromEntries(abanico.enlaceIds.map((enlaceId) => {
    const probabilidad = modelo.enlaces[enlaceId]?.probabilidad;
    return [enlaceId, probabilidad === undefined ? "" : formatearNumero(probabilidad * 100)];
  }));
}

function etiquetaRamaAbanico(modelo: Modelo, enlace: Enlace, puerto: ReturnType<typeof puertoExactoCompartidoDeAbanico>): string {
  const extremo = puerto?.lado === "destino" ? enlace.origenId : enlace.destinoId;
  return nombreExtremo(modelo, extremo);
}

function objetoComunDestino(enlaces: readonly Enlace[]): Id | null {
  const ids = new Set(enlaces.map((enlace) => enlace.destinoId.kind === "entidad" ? enlace.destinoId.id : null).filter((id): id is Id => !!id));
  return ids.size === 1 ? [...ids][0]! : null;
}

function redondearPorcentaje(value: number): number {
  return Math.round(value * 1_000_000) / 1_000_000;
}

function formatearNumero(value: number): string {
  return Number.isInteger(value) ? String(value) : String(redondearPorcentaje(value));
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px", padding: "8px", background: tokens.colors.paper, border: `1px solid ${tokens.colors.ink15}`, borderRadius: tokens.radii.xs } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const helpStyle = { color: tokens.colors.textoTerciario, fontSize: "12px", fontWeight: 600 } satisfies preact.JSX.CSSProperties;
const puertoPanelStyle = { display: "grid", gap: "4px", padding: "8px", border: `1px solid ${tokens.colors.ink15}`, borderRadius: tokens.radii.xs, background: tokens.colors.paper } satisfies preact.JSX.CSSProperties;
const puertoLabelStyle = { color: tokens.colors.ink70, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em" } satisfies preact.JSX.CSSProperties;
const puertoValorStyle = { color: tokens.colors.textoPrimario, fontSize: "12px", fontWeight: 700, overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const puertoCodeStyle = { color: tokens.colors.textoTerciario, fontSize: "11px", overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const puertoIncompletoStyle = { color: tokens.colors.errorTexto, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const decisionTraceStyle = { color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamilyMono, fontSize: "10px", overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const buttonRowStyle = { display: "grid", gap: "8px", gridTemplateColumns: "1fr" } satisfies preact.JSX.CSSProperties;
const probabilidadesGridStyle = { display: "grid", gap: "6px" } satisfies preact.JSX.CSSProperties;
const probabilidadRowStyle = { display: "grid", gridTemplateColumns: "minmax(0, 1fr) 88px", alignItems: "center", gap: "8px" } satisfies preact.JSX.CSSProperties;
const probabilidadRamaStyle = { color: tokens.colors.textoPrimario, fontSize: "12px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const } satisfies preact.JSX.CSSProperties;
const probabilidadInputWrapStyle = { display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center", gap: "4px" } satisfies preact.JSX.CSSProperties;
const inputProbabilidadStyle = { ...style.input, height: "28px", padding: "4px 6px", fontFamily: tokens.typography.fontFamilyMono, fontSize: "12px", textAlign: "right" as const } satisfies preact.JSX.CSSProperties;
const inputProbabilidadErrorStyle = { ...inputProbabilidadStyle, borderColor: tokens.colors.errorBase, outlineColor: tokens.colors.errorBase } satisfies preact.JSX.CSSProperties;
const porcentajeSuffixStyle = { color: tokens.colors.ink50, fontFamily: tokens.typography.fontFamilyMono, fontSize: "11px" } satisfies preact.JSX.CSSProperties;
const probabilidadSumaStyle = { color: tokens.colors.ink70, fontFamily: tokens.typography.fontFamilyMono, fontSize: "11px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const probabilidadErrorStyle = { color: tokens.colors.errorTexto, fontSize: "11px", fontWeight: 700, lineHeight: 1.4 } satisfies preact.JSX.CSSProperties;
