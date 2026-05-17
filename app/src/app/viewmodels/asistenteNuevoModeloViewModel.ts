import {
  ETAPA_AMBIENTALES,
  ETAPA_ATRIBUTO,
  ETAPA_BIENVENIDA,
  ETAPA_CONFIRMAR,
  ETAPA_ENTRADAS,
  ETAPA_HANDLER,
  ETAPA_HERRAMIENTAS,
  ETAPA_SALIDAS,
  TOTAL_ETAPAS,
  type DatosAsistente,
  type EtapaAsistente,
} from "../../modelo/creacionWizard";
import { store, useOpmStore } from "../../store";

const ETAPAS_OPCIONALES: EtapaAsistente[] = [
  ETAPA_ATRIBUTO,
  ETAPA_HANDLER,
  ETAPA_HERRAMIENTAS,
  ETAPA_ENTRADAS,
  ETAPA_SALIDAS,
  ETAPA_AMBIENTALES,
];

export function useAsistenteNuevoModeloViewModel() {
  const asistente = useOpmStore((s) => s.asistente);
  const mensaje = useOpmStore((s) => s.mensaje);

  if (!asistente) return null;

  const etapa = asistente.etapaActual;
  const datos = asistente.datos;
  const cancelado = asistente.cancelado;
  const pct = ((etapa + 1) / TOTAL_ETAPAS) * 100;
  const esOpcional = ETAPAS_OPCIONALES.includes(etapa);
  const muestraAtras = debeMostrarAtrasWizard(etapa);
  const cosasParaAmbientales = construirCosasAmbientales(datos);

  const setDato = <K extends keyof DatosAsistente>(clave: K, valor: DatosAsistente[K]) => {
    store.setState((s) => {
      if (!s.asistente) return {};
      return { asistente: { ...s.asistente, datos: { ...s.asistente.datos, [clave]: valor } } };
    });
  };

  const handleSiguiente = () => {
    const state = store.getState();
    if (!state.asistente) return;
    const et = state.asistente.etapaActual;
    if (ETAPAS_OPCIONALES.includes(et)) {
      const sig = Math.min(et + 1, 11) as EtapaAsistente;
      store.setState((s) => {
        if (!s.asistente) return {};
        return { asistente: { ...s.asistente, etapaActual: sig } };
      });
      return;
    }
    store.getState().siguienteEtapa({});
  };

  const handleSaltar = () => {
    const state = store.getState();
    if (!state.asistente) return;
    const sig = Math.min(state.asistente.etapaActual + 1, 11) as EtapaAsistente;
    store.setState((s) => {
      if (!s.asistente) return {};
      return { asistente: { ...s.asistente, etapaActual: sig } };
    });
  };

  const handleAnterior = () => store.getState().etapaAnterior();
  const handleCancelar = () => store.getState().cancelarAsistente();
  const handleConfirmar = () => store.getState().confirmarAsistente();
  const handleDescartarConfirmado = () => store.setState({ asistente: null });
  const handleCancelarConfirmacion = () => {
    const state = store.getState();
    if (!state.asistente) return;
    store.setState({ asistente: { ...state.asistente, cancelado: false } });
  };

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
    handleSiguiente,
    handleSaltar,
    handleAnterior,
    handleCancelar,
    handleConfirmar,
    handleDescartarConfirmado,
    handleCancelarConfirmacion,
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
