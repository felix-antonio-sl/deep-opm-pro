// [JOYAS §1-3] Chrome UI consume tokens centralizados; canvas semántico invariante.
import { S } from "./estilos";
import { tokens } from "../tokens";

export function Bienvenida() {
  return (
    <div>
      <h3 style={S.title}>Bienvenida</h3>
      <p style={S.desc}>
        Este asistente te guiará paso a paso para crear un nuevo modelo OPM.
        Comenzaremos identificando el proceso principal del sistema y
        continuaremos con el beneficiario, atributos, agentes y más.
      </p>
      <p style={S.desc}>
        Al finalizar, tu modelo quedará sembrado en el lienzo con un layout
        radial automático y el panel OPL pre-poblado. Podrás continuar
        modelando de inmediato.
      </p>
      <p style={{ ...S.desc, color: tokens.colors.textoTerciario, fontSize: "13px" }}>
        Las etapas marcadas como opcionales se pueden saltar. Al confirmar
        podrás revisar todo antes de crear el modelo.
      </p>
    </div>
  );
}
