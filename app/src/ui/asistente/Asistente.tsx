// Orquestador del wizard AsistenteNuevoModelo (3 etapas, IFML DE-WIZ).
//
// Ronda 23 L3 #6: tras la poda 9→3, las únicas etapas son Función,
// Beneficiario y Sembrar. La pantalla de Bienvenida y las 6 etapas
// opcionales fueron eliminadas; su funcionalidad vive en el inspector
// tras crear el modelo. La etapa de confirmación se fusiona en
// `EtapaSembrar` (preview + sembrar).
//
// SSOT: metodologia-opm-es.md §6.
import {
  debeMostrarAtrasWizard,
  useAsistenteNuevoModeloViewModel,
} from "../../app/viewmodels/asistenteNuevoModeloViewModel";
import {
  ETAPA_BENEFICIARIO,
  ETAPA_FUNCION,
  ETAPA_SEMBRAR,
  TOTAL_ETAPAS,
} from "../../modelo/creacionWizard";
import { EtapaBeneficiario } from "./EtapaBeneficiario";
import { EtapaFuncionPrincipal } from "./EtapaFuncionPrincipal";
import { EtapaSembrar } from "./EtapaSembrar";
import { S } from "./estilos";

export { debeMostrarAtrasWizard };

export function AsistenteNuevoModelo() {
  const vm = useAsistenteNuevoModeloViewModel();

  if (!vm) return null;

  const {
    mensaje,
    etapa,
    datos,
    cancelado,
    pct,
    muestraAtras,
    setDato,
    handleSiguiente,
    handleAnterior,
    handleCancelar,
    handleConfirmar,
    handleDescartarConfirmado,
    handleCancelarConfirmacion,
  } = vm;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancelar();
    }
  };

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
              <p style={S.desc}>Perderás los datos ingresados hasta ahora.</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                <button type="button" style={S.btn(true)} onClick={handleDescartarConfirmado}>
                  Sí, descartar
                </button>
                <button type="button" style={S.btn(false)} onClick={handleCancelarConfirmacion}>
                  No, continuar
                </button>
              </div>
            </div>
          ) : (
            <>
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

              {etapa === ETAPA_SEMBRAR && <EtapaSembrar datos={datos} />}

              {mensaje && <div style={S.mensaje}>{mensaje}</div>}
            </>
          )}
        </div>

        {!cancelado && (
          <div style={S.footer}>
            <div>
              {muestraAtras && etapa < ETAPA_SEMBRAR && (
                <button type="button" style={S.btn(false)} onClick={handleAnterior}>
                  Atrás
                </button>
              )}
            </div>
            <div style={S.btnGroup}>
              {etapa < ETAPA_SEMBRAR && (
                <button type="button" style={S.btn(false)} onClick={handleCancelar}>
                  Cancelar
                </button>
              )}
              {etapa < ETAPA_SEMBRAR && (
                <button type="button" style={S.btn(true)} onClick={handleSiguiente}>
                  Siguiente
                </button>
              )}
              {etapa === ETAPA_SEMBRAR && (
                <>
                  <button type="button" style={S.btn(false)} onClick={handleAnterior}>
                    Atrás
                  </button>
                  <button type="button" style={S.btn(true)} onClick={handleConfirmar}>
                    Sembrar modelo
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
