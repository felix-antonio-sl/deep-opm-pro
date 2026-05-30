// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { esEnlaceEstructuralFundamental } from "../../modelo/constantes";
import { entidadDeExtremo, extremoEntidad, extremoEstado } from "../../modelo/extremos";
import { estadosDeEntidad } from "../../modelo/operaciones";
import type { Enlace, ExtremoEnlace, Id, Modelo } from "../../modelo/tipos";
import { inspectorStyles as style } from "../inspectorStyles";
import { enlaceProcedural } from "./SeccionMultiplicidad";
import { tokens } from "../tokens";
import { detalleContratoPuertoEnlace, type DetalleExtremoPuerto } from "./detalleContratoPuerto";

interface Props {
  modelo: Modelo;
  opdId: Id;
  enlace: Enlace;
  onApuntarExtremo: (lado: "origen" | "destino", extremo: ExtremoEnlace) => void;
  onCrearFan: (lado: "origen" | "destino") => void;
  onAbrirMoverPuerto: () => void;
}

// BUG-20260530T214922Z-fb6c2c: la sección "Extremos" (selectores de extremo +
// "Reanclar extremo"/"Mover ancla exacta" → DialogoMoverPuerto) también debe
// estar disponible para enlaces estructurales fundamentales. El kernel ya admite
// reasignar su origen/destino (apuntarExtremoEnlace + validarFirmaEnlace exige
// misma clase OPM para agregacion/generalizacion/clasificacion y deja libre
// exhibicion); solo el fan/abanico es propio de los procedurales.
export function seccionExtremosVisible(tipo: Enlace["tipo"]): boolean {
  return enlaceProcedural(tipo) || esEnlaceEstructuralFundamental(tipo);
}

export function SeccionExtremos(props: Props) {
  const selectores = selectoresEstadoExtremo(props.modelo, props.enlace);
  if (!seccionExtremosVisible(props.enlace.tipo)) return null;
  const muestraFan = enlaceProcedural(props.enlace.tipo);
  const contrato = detalleContratoPuertoEnlace(props.modelo, props.opdId, props.enlace);
  return (
    <section style={sectionStyle}>
      <h3 style={titleStyle}>Extremos</h3>
      <div data-testid="contrato-puertos-enlace" style={contratoPanelStyle}>
        <div style={contratoHeaderStyle}>
          <span style={contratoTitleStyle}>Anclaje exacto</span>
          {muestraFan && contrato.fan ? <span data-testid="contrato-fan-exacto" style={fanBadgeStyle}>Fan {contrato.fan.operador} · {contrato.fan.ramas} ramas</span> : null}
        </div>
        <div style={contratoGridStyle}>
          {contrato.extremos.map((detalle) => (
            <div key={detalle.lado} data-testid={`contrato-puerto-${detalle.lado}`} style={contratoItemStyle}>
              <span style={contratoLadoStyle}>{detalle.lado === "origen" ? "Origen" : "Destino"}</span>
              <strong style={contratoNombreStyle}>{detalle.nombre}</strong>
              <span style={contratoMetaStyle}>{descripcionPuerto(detalle)}</span>
              {detalle.portId ? <code style={contratoCodeStyle}>{detalle.portId}</code> : null}
            </div>
          ))}
        </div>
        {!muestraFan ? null : contrato.fan ? (
          <div data-testid="contrato-fan-puerto" style={fanDetalleStyle}>
            Puerto común: {contrato.fan.entidadNombre} · {contrato.fan.ladoCompartido} · {contrato.fan.hora ?? "exacto"}
          </div>
        ) : contrato.fansPosibles.length > 0 ? (
          <div data-testid="fan-posible-enlace" style={fanPosibleStyle}>
            {contrato.fansPosibles.map((fan) => (
              <div key={`${fan.lado}-${fan.entidadId}`} style={fanPosibleFilaStyle}>
                <span>
                  {descripcionFanPosible(fan.lado, fan.ramas, fan.tipo, fan.entidadNombre)}
                </span>
                <button
                  type="button"
                  data-testid={`crear-fan-${fan.lado}`}
                  style={fanCrearButtonStyle}
                  title="Alinea las ramas compatibles en un puerto comun y crea el fan"
                  onClick={() => props.onCrearFan(fan.lado)}
                >
                  Crear fan
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div data-testid="contrato-fan-puerto" style={fanDetalleMutedStyle}>Sin fan exacto</div>
        )}
      </div>
      {selectores.map(({ lado, entidad, estados, actual }) => (
        <label key={lado} style={style.field}>
          <span class="opm-label-uppercase" style={style.label}>{lado === "origen" ? "Origen" : "Destino"}</span>
          <select
            data-testid={`extremo-${lado}-estado-select`}
            style={style.input}
            value={actual.kind === "estado" ? actual.id : entidad.id}
            onChange={(event) => {
              const value = event.currentTarget.value;
              props.onApuntarExtremo(lado, value === entidad.id ? extremoEntidad(entidad.id) : extremoEstado(value));
            }}
          >
            <option value={entidad.id}>(toda la entidad)</option>
            {estados.map((estado) => <option key={estado.id} value={estado.id}>{estado.nombre}</option>)}
          </select>
        </label>
      ))}
      <button type="button" data-testid="mover-puerto-btn" style={style.secondaryButton} onClick={props.onAbrirMoverPuerto}>
        Mover ancla exacta
      </button>
      <button type="button" data-testid="reanclar-extremo-btn" style={style.secondaryButton} onClick={props.onAbrirMoverPuerto} title="Reancla origen o destino preservando el puerto exacto">
        Reanclar extremo
      </button>
    </section>
  );
}

export function selectoresEstadoExtremo(modelo: Modelo, enlace: Enlace): Array<{
  lado: "origen" | "destino";
  entidad: NonNullable<ReturnType<typeof entidadDeExtremo>>;
  estados: ReturnType<typeof estadosDeEntidad>;
  actual: ExtremoEnlace;
}> {
  if (!enlaceProcedural(enlace.tipo)) return [];
  return (["origen", "destino"] as const).flatMap((lado) => {
    const actual = lado === "origen" ? enlace.origenId : enlace.destinoId;
    const entidad = entidadDeExtremo(modelo, actual);
    if (!entidad || entidad.tipo !== "objeto") return [];
    const estados = estadosDeEntidad(modelo, entidad.id);
    return estados.length >= 2 ? [{ lado, entidad, estados, actual }] : [];
  });
}

function descripcionPuerto(detalle: DetalleExtremoPuerto): string {
  if (detalle.modo === "estado") return "Estado";
  if (detalle.modo === "puerto-exacto") return `Puerto exacto · ${detalle.hora ?? "ancla"}`;
  if (detalle.modo === "puerto-no-visible") return "Puerto sin apariencia visible";
  if (detalle.modo === "automatico") return "Puerto automático";
  return "Extremo inválido";
}

function descripcionFanPosible(lado: "origen" | "destino", ramas: number, tipo: string, entidadNombre: string): string {
  const direccion = lado === "origen" ? "desde" : "hacia";
  return `Fan posible: ${ramas} ramas ${tipo} ${direccion} ${entidadNombre}`;
}

const sectionStyle = { display: "grid", gap: "8px", marginBottom: "14px" } satisfies preact.JSX.CSSProperties;
const titleStyle = { margin: "0 0 8px", color: tokens.colors.textoPrimario, fontSize: "13px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const contratoPanelStyle = { display: "grid", gap: "8px", padding: "10px", marginBottom: "10px", border: `1px solid ${tokens.colors.infoBordeSuave}`, borderRadius: tokens.radii.md, background: tokens.colors.azulMuySuave } satisfies preact.JSX.CSSProperties;
const contratoHeaderStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" } satisfies preact.JSX.CSSProperties;
const contratoTitleStyle = { color: tokens.colors.infoTextoOscuro, fontSize: "12px", fontWeight: 800 } satisfies preact.JSX.CSSProperties;
const fanBadgeStyle = { display: "inline-flex", alignItems: "center", minHeight: "22px", padding: "0 8px", border: `1px solid ${tokens.colors.infoBordeSuave}`, borderRadius: tokens.radii.pill, background: tokens.colors.fondoChrome, color: tokens.colors.infoTextoOscuro, fontSize: "11px", fontWeight: 800, whiteSpace: "nowrap" } satisfies preact.JSX.CSSProperties;
const contratoGridStyle = { display: "grid", gap: "8px", gridTemplateColumns: "minmax(0, 1fr)" } satisfies preact.JSX.CSSProperties;
const contratoItemStyle = { display: "grid", gap: "3px", minWidth: 0, padding: "8px", border: `1px solid ${tokens.colors.bordeTabla}`, borderRadius: tokens.radii.sm, background: tokens.colors.fondoChrome } satisfies preact.JSX.CSSProperties;
const contratoLadoStyle = { color: tokens.colors.textoTerciario, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" } satisfies preact.JSX.CSSProperties;
const contratoNombreStyle = { color: tokens.colors.textoPrimario, fontSize: "12px", fontWeight: 800, overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const contratoMetaStyle = { color: tokens.colors.textoSecundario, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const contratoCodeStyle = { color: tokens.colors.textoTerciario, fontSize: "11px", overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const fanDetalleStyle = { color: tokens.colors.infoTextoOscuro, fontSize: "12px", fontWeight: 800, overflowWrap: "anywhere" } satisfies preact.JSX.CSSProperties;
const fanDetalleMutedStyle = { color: tokens.colors.textoTerciario, fontSize: "12px", fontWeight: 700 } satisfies preact.JSX.CSSProperties;
const fanPosibleStyle = { display: "grid", gap: "8px" } satisfies preact.JSX.CSSProperties;
const fanPosibleFilaStyle = { display: "grid", gap: "8px", color: tokens.colors.infoTextoOscuro, fontSize: "12px", fontWeight: 800 } satisfies preact.JSX.CSSProperties;
const fanCrearButtonStyle = { ...style.primaryButton, marginBottom: 0 } satisfies preact.JSX.CSSProperties;
