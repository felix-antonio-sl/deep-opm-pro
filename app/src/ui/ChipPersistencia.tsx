/**
 * ChipPersistencia (Ronda 19 L5): chip visible junto al titulo del modelo
 * que comunica de forma inmediata el estado de almacenamiento.
 *
 * Variantes:
 *   - local-clean: persistido y sin cambios pendientes.
 *   - local-dirty: persistido con cambios pendientes.
 *   - importado: cargado desde JSON, no persistido.
 *   - asistente: generado por asistente IA, no persistido.
 *   - nuevo: recien creado, no persistido y sin cambios.
 *
 * Decisiones (brief §10):
 *   - Iconos como SVG inline simples (no emoji) para coherencia con resto
 *     del chrome ya consolidado en ronda 18.
 *   - Hashtag de version corto: `v3` (ahorra ancho en toolbar saturado).
 *   - Click abre `Guardar como` (acción primaria del chip).
 *   - Tiempo relativo en es-CL: `hace X min`, `hace X s`, etc.
 */
import { useZustandPersistencePort } from "../app/ports/zustandPersistencePort";
import type { OrigenPestana } from "../modelo/tipos";
import { tokens } from "./tokens";

export type VarianteChipTipo =
  | "local-clean"
  | "local-dirty"
  | "importado"
  | "fixture"
  | "asistente"
  | "nuevo";

export interface VarianteChip {
  tipo: VarianteChipTipo;
  versiones: number;
  tiempoRelativo: string | null;
}

interface EntradaClasificarVariante {
  modeloPersistidoId: string | null;
  dirty: boolean;
  cargadoDesde: OrigenPestana;
  esFixture: boolean;
  versiones: number;
  tiempoRelativo: string | null;
}

export function clasificarVariante(input: EntradaClasificarVariante): VarianteChip {
  const { modeloPersistidoId, dirty, cargadoDesde, esFixture, versiones, tiempoRelativo } = input;
  if (modeloPersistidoId) {
    return {
      tipo: dirty ? "local-dirty" : "local-clean",
      versiones,
      tiempoRelativo,
    };
  }
  if (cargadoDesde === "importado") {
    return { tipo: "importado", versiones, tiempoRelativo: null };
  }
  if (esFixture) {
    return { tipo: "fixture", versiones, tiempoRelativo: null };
  }
  if (cargadoDesde === "asistente") {
    return { tipo: "asistente", versiones, tiempoRelativo: null };
  }
  return { tipo: "nuevo", versiones, tiempoRelativo: null };
}

/**
 * Formatea un timestamp absoluto en tiempo relativo es-CL.
 * Convención: `hace N s`, `hace N min`, `hace N h`, `hace N d`.
 * Para deltas <5s usa `recién` (afín a Slack/Linear).
 */
export function formatearTiempoRelativo(ultimoMs: number, ahoraMs: number = Date.now()): string {
  const delta = Math.max(0, Math.floor((ahoraMs - ultimoMs) / 1000));
  if (delta < 5) return "recién";
  if (delta < 60) return `hace ${delta} s`;
  if (delta < 3600) {
    const min = Math.floor(delta / 60);
    return `hace ${min} min`;
  }
  if (delta < 86400) {
    const horas = Math.floor(delta / 3600);
    return `hace ${horas} h`;
  }
  const dias = Math.floor(delta / 86400);
  return `hace ${dias} d`;
}

/**
 * Ronda 24 L2 #5: el copy del chip se descompone en 4 estados coherentes
 * con el chip `● Auto` del toolbar. El criterio es si el modelo tiene
 * identidad persistida (= el autosalvado periodico ya lo respalda) o no
 * (= Ctrl+S es la accion necesaria para abrir Guardar como):
 *
 *   - "Guardado · HH:mm"     · local-clean sin guardado en curso.
 *   - "Guardando…"           · cualquier variante con autosalvado en curso.
 *   - "Cambios sin guardar"  · local-dirty (persistido + cambios en cola;
 *                              el autosalvado periodico los recogera).
 *   - "Sin guardar · Ctrl+S" · variantes no persistidas (importado,
 *                              fixture, asistente, nuevo); el autosalvado
 *                              no opera sobre ellas, hay que invocar
 *                              Guardar como manualmente.
 *
 * Asi, "Sin guardar · Ctrl+S" deja de aparecer cuando el autosalvado activo
 * respalda el modelo, eliminando el mensaje contradictorio "● Auto" + "Sin
 * guardar".
 */
export function labelChip(variante: VarianteChip, opts: { salvando?: boolean; horaGuardado?: string | null } = {}): string {
  if (opts.salvando) return "Guardando…";
  if (variante.tipo === "local-clean") {
    return opts.horaGuardado ? `Guardado · ${opts.horaGuardado}` : "Guardado";
  }
  if (variante.tipo === "local-dirty") {
    return "Cambios sin guardar";
  }
  return "Sin guardar · Ctrl+S";
}

/**
 * Formato HH:mm 24h para el sufijo del label `Guardado · HH:mm`.
 * Devuelve `null` si el timestamp no es un número finito.
 */
export function formatearHoraGuardado(timestamp: number | null | undefined): string | null {
  if (!timestamp || !Number.isFinite(timestamp)) return null;
  return new Date(timestamp).toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function detallarChip(
  variante: VarianteChip,
  nombreModelo: string,
  opts: { salvando?: boolean; horaGuardado?: string | null } = {},
): string {
  const lineas: string[] = [];
  lineas.push(labelChip(variante, opts));
  lineas.push("─");
  lineas.push(`Modelo: ${nombreModelo}`);
  switch (variante.tipo) {
    case "local-clean":
      lineas.push("Origen: persistido en almacenamiento local");
      lineas.push("Cambios pendientes: no");
      break;
    case "local-dirty":
      lineas.push("Origen: persistido en almacenamiento local");
      lineas.push("Cambios pendientes: sí");
      break;
    case "importado":
      lineas.push("Origen: importado desde archivo JSON");
      lineas.push("Cambios pendientes: sí (aún no persistido)");
      break;
    case "fixture":
      lineas.push("Origen: fixture del catálogo local");
      lineas.push("Cambios pendientes: sí (aún no persistido)");
      break;
    case "asistente":
      lineas.push("Origen: generado por asistente IA");
      lineas.push("Cambios pendientes: sí (aún no persistido)");
      break;
    case "nuevo":
      lineas.push("Origen: modelo nuevo");
      lineas.push("Cambios pendientes: sí (aún no persistido)");
      break;
  }
  lineas.push("Click para Guardar como o nueva versión");
  return lineas.join("\n");
}

interface IconoProps {
  tipo: VarianteChipTipo;
}

function IconoVariante({ tipo }: IconoProps): preact.JSX.Element {
  const stroke = "currentColor";
  switch (tipo) {
    case "local-clean":
      return (
        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 8 L7 12 L13 4" stroke={stroke} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "local-dirty":
      return (
        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <circle cx="8" cy="8" r="4" fill={stroke}/>
        </svg>
      );
    case "importado":
      return (
        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 2 L8 11 M5 8 L8 11 L11 8" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13 L13 13" stroke={stroke} strokeWidth="1.6" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case "fixture":
      return (
        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 4 H13 V12 H3 Z" stroke={stroke} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
          <path d="M5 6 H11 M5 8 H9 M5 10 H10" stroke={stroke} strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        </svg>
      );
    case "asistente":
      return (
        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 2 L9.6 6.4 L14 8 L9.6 9.6 L8 14 L6.4 9.6 L2 8 L6.4 6.4 Z" fill={stroke}/>
        </svg>
      );
    case "nuevo":
      return (
        <svg width="11" height="11" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 3 L8 13 M3 8 L13 8" stroke={stroke} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        </svg>
      );
  }
}

export function ChipPersistencia(): preact.JSX.Element {
  const {
    modeloPersistidoId,
    dirty,
    cargadoDesde,
    esFixture,
    versiones,
    ultimoAutosalvado,
    autosalvadoEnCurso,
    modeloNombre,
    abrirGuardarComo,
  } = useZustandPersistencePort();
  const tiempoRelativo = ultimoAutosalvado ? formatearTiempoRelativo(ultimoAutosalvado) : null;
  const horaGuardado = formatearHoraGuardado(ultimoAutosalvado);

  const variante = clasificarVariante({
    modeloPersistidoId,
    dirty,
    cargadoDesde,
    esFixture,
    versiones,
    tiempoRelativo,
  });
  const opcionesLabel = { salvando: autosalvadoEnCurso, horaGuardado };
  const label = labelChip(variante, opcionesLabel);

  return (
    <button
      type="button"
      style={chipEstilo(variante.tipo, autosalvadoEnCurso)}
      title={detallarChip(variante, modeloNombre, opcionesLabel)}
      onClick={abrirGuardarComo}
      data-testid="chip-persistencia"
      data-variante={variante.tipo}
      data-salvando={autosalvadoEnCurso ? "true" : "false"}
      aria-label={`Estado de almacenamiento: ${label}`}
    >
      <span style={chipIconStyle}>
        <IconoVariante tipo={autosalvadoEnCurso ? "local-clean" : variante.tipo} />
      </span>
      <span style={chipLabelStyle}>{label}</span>
    </button>
  );
}

const chipBase: preact.JSX.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: `${tokens.spacing.xs}px`,
  height: "24px",
  padding: `0 ${tokens.spacing.sm + 2}px`,
  border: `1px solid ${tokens.colors.bordeControl}`,
  borderRadius: tokens.radii.pill,
  background: tokens.colors.fondoCard,
  color: tokens.colors.textoSecundario,
  cursor: "pointer",
  fontSize: `${tokens.typography.sizes.xs}px`,
  fontWeight: tokens.typography.weights.semibold,
  whiteSpace: "nowrap",
  flex: "0 0 auto",
  fontFamily: tokens.typography.familyChrome,
  boxShadow: tokens.shadows.xs,
};

/**
 * Ronda 24 L2 #5: el chip conserva 3 paletas visuales (éxito / info /
 * advertencia) sobre las 4 variantes de copy. El amarillo ámbar cubre
 * tanto `local-dirty` ("Cambios sin guardar") como las no persistidas
 * ("Sin guardar · Ctrl+S"); la paleta no distingue entre ambos porque
 * ambos son "estados con acción pendiente":
 *  - `local-clean` sin guardado en curso → tokens de éxito (verde suave).
 *  - guardado en curso → tokens informacionales (azul suave).
 *  - cualquier otro caso → tokens de advertencia (dot ámbar implicito en
 *    los colores `advertencia*`).
 */
function chipEstilo(tipo: VarianteChipTipo, salvando: boolean): preact.JSX.CSSProperties {
  if (salvando) {
    return {
      ...chipBase,
      background: tokens.colors.infoFondoClaro,
      borderColor: tokens.colors.infoBordeSuave,
      color: tokens.colors.infoTextoOscuro,
    };
  }
  if (tipo === "local-clean") {
    return {
      ...chipBase,
      background: tokens.colors.exitoFondo,
      borderColor: tokens.colors.exitoBase,
      color: tokens.colors.exitoTexto,
    };
  }
  return {
    ...chipBase,
    background: tokens.colors.advertenciaFondo,
    borderColor: tokens.colors.advertenciaBorde,
    color: tokens.colors.alertaTexto,
  };
}

const chipIconStyle: preact.JSX.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "0 0 auto",
};

const chipLabelStyle: preact.JSX.CSSProperties = {
  lineHeight: 1,
};
