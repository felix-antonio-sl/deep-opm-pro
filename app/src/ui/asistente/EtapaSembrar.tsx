// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
//
// Ronda 23 L3 #6: etapa final del wizard tras la poda 9→3. Reemplaza a la
// antigua `EtapaConfirmar` y la fusiona con un preview escueto: muestra
// los dos campos capturados y explica qué se sembrará en el lienzo.
import { NOMBRE_SISTEMA_DEFAULT, TOTAL_ETAPAS, type DatosAsistente } from "../../modelo/creacionWizard";
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
      <h3 style={S.title}>Etapa {TOTAL_ETAPAS} de {TOTAL_ETAPAS} — Sembrar modelo</h3>
      <p style={S.desc}>
        Revisa los datos antes de sembrar el modelo. Al confirmar se creará
        el SD canónico con layout radial y podrás afinar todo lo demás
        (atributos, herramientas, entradas, salidas, agentes adicionales)
        en el inspector.
      </p>
      <div style={resumen}>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Función principal:</span>
          <span style={S.resumenValor}>{funcion || pendiente()}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Beneficiario:</span>
          <span style={S.resumenValor}>{beneficiario || pendiente()}</span>
        </div>
        <div style={S.resumenLinea}>
          <span style={S.resumenLabel}>Sistema:</span>
          <span style={S.resumenValor}>{NOMBRE_SISTEMA_DEFAULT}</span>
        </div>
      </div>
      <p style={{ ...S.desc, fontSize: "13px", color: tokens.colors.textoTerciario }}>
        El sistema se nombra <strong>{NOMBRE_SISTEMA_DEFAULT}</strong> por
        defecto; puedes renombrarlo en el inspector cuando lo necesites.
      </p>
    </div>
  );
}

function pendiente() {
  return <em style={{ color: tokens.colors.errorOscuro }}>(pendiente)</em>;
}

const resumen: preact.JSX.CSSProperties = {
  background: tokens.colors.fondoCard,
  borderRadius: tokens.radii.md,
  padding: "12px 16px",
  marginBottom: "12px",
};
