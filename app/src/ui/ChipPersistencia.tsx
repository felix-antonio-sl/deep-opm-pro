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
import type { OrigenPestana } from "../modelo/tipos";
import { useOpmStore } from "../store";
import { listarFixtures } from "../store/runtime";
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

export function labelChip(variante: VarianteChip): string {
  switch (variante.tipo) {
    case "local-clean": {
      const sufijoVersion = variante.versiones > 0 ? ` · v${variante.versiones}` : "";
      const sufijoTiempo = variante.tiempoRelativo ? ` · ${variante.tiempoRelativo}` : "";
      return `Local${sufijoVersion}${sufijoTiempo}`;
    }
    case "local-dirty": {
      const sufijoVersion = variante.versiones > 0 ? ` · v${variante.versiones}` : "";
      return `Local${sufijoVersion} · sin guardar`;
    }
    case "importado":
      return "Importado · sin guardar";
    case "fixture":
      return "Fixture · sin guardar";
    case "asistente":
      return "Asistente · sin guardar";
    case "nuevo":
      return "Nuevo · sin guardar";
  }
}

export function detallarChip(variante: VarianteChip, nombreModelo: string): string {
  const lineas: string[] = [];
  const cabecera = labelChip(variante);
  lineas.push(cabecera);
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
  const modeloPersistidoId = useOpmStore((s) => s.modeloPersistidoId);
  const dirty = useOpmStore((s) => s.dirty);
  const autosalvado = useOpmStore((s) => s.autosalvado);
  const pestanasAbiertas = useOpmStore((s) => s.pestanasAbiertas);
  const pestanaActivaId = useOpmStore((s) => s.pestanaActivaId);
  const indice = useOpmStore((s) => s.indice);
  const modeloNombre = useOpmStore((s) => s.modelo.nombre);
  const abrirGuardarComo = useOpmStore((s) => s.abrirGuardarComo);

  const pestanaActiva = pestanasAbiertas.find((p) => p.id === pestanaActivaId);
  const cargadoDesde: OrigenPestana = pestanaActiva?.cargadoDesde ?? "nuevo";
  const esFixture = !modeloPersistidoId && listarFixtures().some((fixture) => fixture.modelo.nombre === modeloNombre);
  const versiones = modeloPersistidoId
    ? indice.modelos.find((m) => m.id === modeloPersistidoId)?.versiones?.length ?? 0
    : 0;
  const tiempoRelativo = autosalvado.ultimo ? formatearTiempoRelativo(autosalvado.ultimo) : null;

  const variante = clasificarVariante({
    modeloPersistidoId,
    dirty,
    cargadoDesde,
    esFixture,
    versiones,
    tiempoRelativo,
  });

  return (
    <button
      type="button"
      style={chipEstilo(variante.tipo)}
      title={detallarChip(variante, modeloNombre)}
      onClick={abrirGuardarComo}
      data-testid="chip-persistencia"
      data-variante={variante.tipo}
      aria-label={`Estado de almacenamiento: ${labelChip(variante)}`}
    >
      <span style={chipIconStyle}>
        <IconoVariante tipo={variante.tipo} />
      </span>
      <span style={chipLabelStyle}>{labelChip(variante)}</span>
    </button>
  );
}

const chipBase: preact.JSX.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: `${tokens.spacing.xs}px`,
  height: "22px",
  padding: `0 ${tokens.spacing.sm}px`,
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
};

function chipEstilo(tipo: VarianteChipTipo): preact.JSX.CSSProperties {
  switch (tipo) {
    case "local-clean":
      return {
        ...chipBase,
        background: tokens.colors.exitoFondo,
        borderColor: tokens.colors.exitoBase,
        color: tokens.colors.exitoTexto,
      };
    case "local-dirty":
      return {
        ...chipBase,
        background: tokens.colors.advertenciaFondo,
        borderColor: tokens.colors.advertenciaBorde,
        color: tokens.colors.alertaTexto,
      };
    case "importado":
      return {
        ...chipBase,
        background: tokens.colors.azulPanelSuave,
        borderColor: tokens.colors.infoBordeSuave,
        color: tokens.colors.infoTextoOscuro,
      };
    case "fixture":
      return {
        ...chipBase,
        background: tokens.colors.fondoCard,
        borderColor: tokens.colors.bordeSlate,
        color: tokens.colors.textoSlate,
      };
    case "asistente":
      return {
        ...chipBase,
        background: tokens.colors.infoFondoClaro,
        borderColor: tokens.colors.infoBordeSuave,
        color: tokens.colors.azulInfo,
      };
    case "nuevo":
      return {
        ...chipBase,
        background: tokens.colors.fondoNeutral,
        borderColor: tokens.colors.bordeNeutral,
        color: tokens.colors.textoSecundario,
      };
  }
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
