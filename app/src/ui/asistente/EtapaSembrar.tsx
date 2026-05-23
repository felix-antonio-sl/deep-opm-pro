// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Ronda 28 L5: etapa final Bauhaus. Resumen vive en una caja ink-04 con
// labels uppercase y valores Inter Tight 14. Pendientes en cinabrio (accent).
import { NOMBRE_SISTEMA_DEFAULT, type DatosAsistente } from "../../modelo/creacionWizard";
import { tokens } from "../tokens";
import { S } from "./estilos";

interface Props {
  datos: Partial<DatosAsistente>;
}

export function EtapaSembrar({ datos }: Props) {
  const funcion = (datos.funcionPrincipal ?? "").trim();
  const beneficiario = (datos.beneficiario ?? "").trim();

  return (
    <div>
      <h3 style={S.title}>Sembrar modelo</h3>
      <p style={S.desc}>
        Revisa los datos antes de sembrar el modelo. Al confirmar se creará
        el SD canónico con layout radial y podrás afinar todo lo demás
        (atributos, herramientas, entradas, salidas, agentes adicionales)
        en el inspector.
      </p>
      <div style={resumen}>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Función principal</span>
          <span style={S.resumenValor}>{funcion || pendiente()}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Beneficiario</span>
          <span style={S.resumenValor}>{beneficiario || pendiente()}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Sistema</span>
          <span style={S.resumenValor}>{NOMBRE_SISTEMA_DEFAULT}</span>
        </div>
      </div>
      <p style={notaTenue}>
        El sistema se nombra <strong>{NOMBRE_SISTEMA_DEFAULT}</strong> por
        defecto; puedes renombrarlo en el inspector cuando lo necesites.
      </p>
    </div>
  );
}

function pendiente() {
  return <em style={{ color: tokens.colors.accent, fontStyle: "normal" }}>(pendiente)</em>;
}

const resumen: preact.JSX.CSSProperties = {
  background: tokens.colors.ink04,
  border: `1px solid ${tokens.colors.ink15}`,
  borderRadius: 0,
  padding: "16px 20px",
  marginBottom: "16px",
};

const notaTenue: preact.JSX.CSSProperties = {
  margin: 0,
  fontFamily: tokens.typography.familyChrome,
  fontSize: "13px",
  fontWeight: 400,
  color: tokens.colors.ink50,
  lineHeight: 1.5,
};
