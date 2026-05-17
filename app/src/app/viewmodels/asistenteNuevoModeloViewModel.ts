import {
  ETAPA_BIENVENIDA,
  TOTAL_ETAPAS,
  type DatosAsistente,
  type EtapaAsistente,
} from "../../modelo/creacionWizard";
import { ETAPAS_ASISTENTE_OPCIONALES } from "../ports/newModelAssistantPort";
import { useZustandNewModelAssistantPort } from "../ports/zustandNewModelAssistantPort";

export function useAsistenteNuevoModeloViewModel() {
  const {
    asistente,
    mensaje,
    setDato,
    siguiente,
    saltar,
    anterior,
    cancelar,
    confirmar,
    descartarConfirmado,
    cancelarConfirmacion,
  } = useZustandNewModelAssistantPort();

  if (!asistente) return null;

  const etapa = asistente.etapaActual;
  const datos = asistente.datos;
  const cancelado = asistente.cancelado;
  const pct = ((etapa + 1) / TOTAL_ETAPAS) * 100;
  const esOpcional = ETAPAS_ASISTENTE_OPCIONALES.includes(etapa);
  const muestraAtras = debeMostrarAtrasWizard(etapa);
  const cosasParaAmbientales = construirCosasAmbientales(datos);

  return {
    asistente,
    mensaje,
    etapa,
    datos,
    cancelado,
    pct,
    esOpcional,
    muestraAtras,
    cosasParaAmbientales,
    setDato,
    handleSiguiente: siguiente,
    handleSaltar: saltar,
    handleAnterior: anterior,
    handleCancelar: cancelar,
    handleConfirmar: confirmar,
    handleDescartarConfirmado: descartarConfirmado,
    handleCancelarConfirmacion: cancelarConfirmacion,
  };
}

export type AsistenteNuevoModeloViewModel = ReturnType<typeof useAsistenteNuevoModeloViewModel>;

export function debeMostrarAtrasWizard(etapa: EtapaAsistente): boolean {
  return etapa > ETAPA_BIENVENIDA;
}

function construirCosasAmbientales(datos: Partial<DatosAsistente>): string[] {
  const nombres: string[] = [];
  if (datos.funcionPrincipal?.trim()) nombres.push(datos.funcionPrincipal.trim());
  if (datos.beneficiario?.trim()) nombres.push(datos.beneficiario.trim());
  if (datos.atributo?.nombre.trim()) nombres.push(datos.atributo.nombre.trim());
  if (datos.nombreSistema?.trim()) nombres.push(datos.nombreSistema.trim());
  for (const a of datos.agentesAdicionales ?? []) { if (a.trim()) nombres.push(a.trim()); }
  for (const h of datos.herramientas ?? []) { if (h.trim()) nombres.push(h.trim()); }
  for (const e of datos.entradas ?? []) { if (e.trim()) nombres.push(e.trim()); }
  for (const s of datos.salidas ?? []) { if (s.nombre.trim()) nombres.push(s.nombre.trim()); }
  return nombres
    .filter((n) => n !== datos.funcionPrincipal?.trim())
    .sort((a, b) => a.localeCompare(b, "es"));
}
