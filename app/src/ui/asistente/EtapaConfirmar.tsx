// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { TOTAL_ETAPAS, VERBO_SALIDA_ES, type DatosAsistente } from "../../modelo/creacionWizard";
import { S } from "./estilos";
import { tokens } from "../tokens";

interface Props {
  datos: Partial<DatosAsistente>;
}

export function EtapaConfirmar({ datos }: Props) {
  return (
    <div>
      <h3 style={S.title}>Etapa 11 de {TOTAL_ETAPAS} — Confirmar y Crear Modelo</h3>
      <p style={S.desc}>
        Revisa los datos ingresados antes de sembrar el modelo. Al confirmar
        se creará el SD con layout radial y podrás continuar modelando.
      </p>
      <div style={{ background: tokens.colors.fondoCard, borderRadius: tokens.radii.md, padding: "12px 16px", marginBottom: "12px" }}>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Función principal:</span>
          <span style={S.resumenValor}>{datos.funcionPrincipal || <em style={{ color: tokens.colors.errorOscuro }}>(pendiente)</em>}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Beneficiario:</span>
          <span style={S.resumenValor}>{datos.beneficiario || <em style={{ color: tokens.colors.errorOscuro }}>(pendiente)</em>}</span>
        </div>
        {datos.atributo?.nombre && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Atributo:</span>
            <span style={S.resumenValor}>{datos.atributo.nombre} [{datos.atributo.estadoEntrada} → {datos.atributo.estadoSalida}]</span>
          </div>
        )}
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Handler:</span>
          <span style={S.resumenValor}>{datos.beneficiarioEsHandler ? "Beneficiario es handler" : (datos.agentesAdicionales ?? []).join(", ") || "(pendiente)"}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Nombre del sistema:</span>
          <span style={S.resumenValor}>{datos.nombreSistema || <em style={{ color: tokens.colors.errorOscuro }}>(pendiente)</em>}</span>
        </div>
        {(datos.herramientas?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Herramientas:</span>
            <span style={S.resumenValor}>{datos.herramientas!.join(", ")}</span>
          </div>
        )}
        {(datos.entradas?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Entradas:</span>
            <span style={S.resumenValor}>{datos.entradas!.join(", ")}</span>
          </div>
        )}
        {(datos.salidas?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Salidas:</span>
            <span style={S.resumenValor}>{datos.salidas!.map((s) => `${s.nombre} (${VERBO_SALIDA_ES[s.verbo]})`).join(", ")}</span>
          </div>
        )}
        {(datos.ambientales?.length ?? 0) > 0 && (
          <div style={S.resumenLinea}>
            <span style={S.resumenLabel}>Ambientales:</span>
            <span style={S.resumenValor}>{datos.ambientales!.join(", ")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
