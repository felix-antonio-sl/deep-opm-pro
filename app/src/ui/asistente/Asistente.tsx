// Orquestador del wizard AsistenteNuevoModelo (12 etapas, IFML DE-WIZ).
//
// SSOT: metodologia-opm-es.md §6.
// Lee asistente del store, despacha siguienteEtapa/etapaAnterior/cancelar/
// confirmar, mapea etapaActual al sub-componente Etapa* y renderiza progress
// bar + footer con botones.
//
// Ronda 9 L3: las 11 funciones Etapa* y la pantalla Bienvenida viven ahora en
// asistente/{Bienvenida,Etapa*}.tsx; este componente queda como cableado UI.
import {
  ETAPA_AMBIENTALES,
  ETAPA_ATRIBUTO,
  ETAPA_BENEFICIARIO,
  ETAPA_BIENVENIDA,
  ETAPA_CONFIRMAR,
  ETAPA_ENTRADAS,
  ETAPA_FUNCION,
  ETAPA_HANDLER,
  ETAPA_HERRAMIENTAS,
  ETAPA_NOMBRE_SISTEMA,
  ETAPA_SALIDAS,
  TOTAL_ETAPAS,
  type DatosAsistente,
  type EtapaAsistente,
} from "../../modelo/creacionWizard";
import { store, useOpmStore } from "../../store";
import { Bienvenida } from "./Bienvenida";
import { EtapaAmbientales } from "./EtapaAmbientales";
import { EtapaAtributo } from "./EtapaAtributo";
import { EtapaBeneficiario } from "./EtapaBeneficiario";
import { EtapaConfirmar } from "./EtapaConfirmar";
import { EtapaEntradas } from "./EtapaEntradas";
import { EtapaFuncionPrincipal } from "./EtapaFuncionPrincipal";
import { EtapaHandler } from "./EtapaHandler";
import { EtapaHerramientas } from "./EtapaHerramientas";
import { EtapaNombreSistema } from "./EtapaNombreSistema";
import { EtapaSalidas } from "./EtapaSalidas";
import { S } from "./estilos";

const ETAPAS_OPCIONALES: EtapaAsistente[] = [
  ETAPA_ATRIBUTO,
  ETAPA_HANDLER,
  ETAPA_HERRAMIENTAS,
  ETAPA_ENTRADAS,
  ETAPA_SALIDAS,
  ETAPA_AMBIENTALES,
];

export function AsistenteNuevoModelo() {
  const asistente = useOpmStore((s) => s.asistente);
  const mensaje = useOpmStore((s) => s.mensaje);

  if (!asistente) return null;

  const etapa = asistente.etapaActual;
  const datos = asistente.datos;
  const cancelado = asistente.cancelado;
  const pct = ((etapa + 1) / TOTAL_ETAPAS) * 100;

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

  const esOpcional = ETAPAS_OPCIONALES.includes(etapa);
  const muestraAtras = debeMostrarAtrasWizard(etapa);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelar();
    }
  };

  const cosasParaAmbientales = construirCosasAmbientales(datos);

  return (
    <div
      style={S.backdrop}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      ref={(el: HTMLElement | null) => el?.focus()}
    >
      <div
        style={S.modal}
        role="dialog"
        aria-modal="true"
        aria-label="Asistente nuevo modelo"
        data-ifml-stereotype="Modal"
        data-ifml-modal="true"
        data-ifml-pattern="DE-WIZ"
        data-ifml-back="real"
        data-ifml-cache="store.asistente.datos"
      >
        <div style={S.header}>
          <span style={S.etapaLabel}>Etapa {etapa + 1} de {TOTAL_ETAPAS}</span>
          <div style={S.progressBar}>
            <div style={S.progressFill(pct)} />
          </div>
        </div>

        <div style={S.body}>
          {cancelado ? (
            <div>
              <h3 style={S.title}>¿Descartar el asistente?</h3>
              <p style={S.desc}>Perderas los datos ingresados hasta ahora.</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button type="button" style={S.btn(true)} onClick={handleDescartarConfirmado}>
                  Si, descartar
                </button>
                <button type="button" style={S.btn(false)} onClick={handleCancelarConfirmacion}>
                  No, continuar
                </button>
              </div>
            </div>
          ) : (
            <>
              {etapa === ETAPA_BIENVENIDA && <Bienvenida />}

              {etapa === ETAPA_FUNCION && (
                <EtapaFuncionPrincipal
                  valor={datos.funcionPrincipal ?? ""}
                  onChange={(v) => setDato("funcionPrincipal", v)}
                  onEnter={handleSiguiente}
                />
              )}

              {etapa === ETAPA_BENEFICIARIO && (
                <EtapaBeneficiario
                  valor={datos.beneficiario ?? ""}
                  onChange={(v) => setDato("beneficiario", v)}
                  onEnter={handleSiguiente}
                />
              )}

              {etapa === ETAPA_ATRIBUTO && (
                <EtapaAtributo
                  valor={datos.atributo ?? null}
                  onChange={(v) => setDato("atributo", v)}
                />
              )}

              {etapa === ETAPA_HANDLER && (
                <EtapaHandler
                  esHandler={datos.beneficiarioEsHandler ?? true}
                  agentes={datos.agentesAdicionales ?? []}
                  onEsHandler={(v) => setDato("beneficiarioEsHandler", v)}
                  onAgentes={(v) => setDato("agentesAdicionales", v)}
                />
              )}

              {etapa === ETAPA_NOMBRE_SISTEMA && (
                <EtapaNombreSistema
                  valor={datos.nombreSistema ?? ""}
                  onChange={(v) => setDato("nombreSistema", v)}
                  onEnter={handleSiguiente}
                />
              )}

              {etapa === ETAPA_HERRAMIENTAS && (
                <EtapaHerramientas
                  valor={datos.herramientas ?? []}
                  onChange={(v) => setDato("herramientas", v)}
                />
              )}

              {etapa === ETAPA_ENTRADAS && (
                <EtapaEntradas
                  valor={datos.entradas ?? []}
                  onChange={(v) => setDato("entradas", v)}
                />
              )}

              {etapa === ETAPA_SALIDAS && (
                <EtapaSalidas
                  valor={datos.salidas ?? []}
                  onChange={(v) => setDato("salidas", v)}
                />
              )}

              {etapa === ETAPA_AMBIENTALES && (
                <EtapaAmbientales
                  cosas={cosasParaAmbientales}
                  seleccionados={datos.ambientales ?? []}
                  onToggle={(v) => setDato("ambientales", v)}
                />
              )}

              {etapa === ETAPA_CONFIRMAR && (
                <EtapaConfirmar datos={datos} />
              )}

              {mensaje && <div style={S.mensaje}>{mensaje}</div>}
            </>
          )}
        </div>

        {!cancelado && (
          <div style={S.footer}>
            <div>
              {muestraAtras && etapa < ETAPA_CONFIRMAR && (
                <button type="button" style={S.btn(false)} onClick={handleAnterior}>
                  Atrás
                </button>
              )}
            </div>
            <div style={S.btnGroup}>
              {etapa < ETAPA_CONFIRMAR && (
                <button type="button" style={S.btn(false)} onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
              {etapa < ETAPA_CONFIRMAR && esOpcional && (
                <button type="button" style={S.skipBtn} onClick={handleSaltar}>
                  Saltar
                </button>
              )}
              {etapa < ETAPA_CONFIRMAR && (
                <button type="button" style={S.btn(true)} onClick={handleSiguiente}>
                  Siguiente
                </button>
              )}
              {etapa === ETAPA_CONFIRMAR && (
                <>
                  <button type="button" style={S.btn(false)} onClick={handleAnterior}>
                    Atrás
                  </button>
                  <button type="button" style={S.btn(true)} onClick={handleConfirmar}>
                    Confirmar y crear modelo
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
