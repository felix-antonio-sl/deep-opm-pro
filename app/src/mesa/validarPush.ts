import { hidratarModelo } from "../serializacion/json";
import type { Especie } from "../persistencia/especie";

/**
 * Lógica pura (sin red, sin DOM) de `mesa push`: decidir si la escritura del
 * bundle candidato hacia el destino está permitida. Cuatro reglas, en orden:
 *   1. Contrato de import: el bundle debe hidratar a un modelo legítimo.
 *   2. Especie del destino: biblioteca es de solo-lectura.
 *   3. Carril por procedencia: un modelo con sello (nacido de un proto) sólo
 *      acepta bundles también sellados (emitidos por el compilador de
 *      autoría) — rechaza bundles artesanales.
 *   4. Base ratificada: si la base del pull fue autosave (no consolidado),
 *      el push exige confirmación explícita del operador.
 * Al crear (sin destino) se exige declarar la especie explícitamente.
 */
export type VeredictoPush = { ok: true; especieDestino: "apunte" | "modelo" } | { ok: false; motivo: string };

/**
 * El sello de procedencia vive en `Modelo.procedencia` — que en el documento
 * serializado por `exportarModelo` queda anidado bajo `.modelo`, NO en la raíz
 * del documento (`{ formato, modelo, carpetaId? }`). Solo el compilador de
 * autoría lo emite; un bundle artesanal (mesa) nunca lo trae.
 */
function bundleTieneSello(json: string): boolean {
  try {
    const doc = JSON.parse(json) as { modelo?: { procedencia?: unknown } };
    const procedencia = doc.modelo?.procedencia;
    return procedencia != null && typeof procedencia === "object";
  } catch {
    return false;
  }
}

export function evaluarPush(input: {
  bundleJson: string;
  destino?: { tieneSello: boolean; especie: Especie };
  baseFueAutosave: boolean;
  confirmadoPorOperador: boolean;
  especieAlCrear?: "apunte" | "modelo";
}): VeredictoPush {
  // 1. Contrato de import duro: el bundle debe hidratar a un modelo legítimo.
  const hidratado = hidratarModelo(input.bundleJson);
  if (!hidratado.ok) return { ok: false, motivo: `bundle inválido: ${hidratado.error}` };

  // 2. Crear vs actualizar.
  if (!input.destino) {
    if (!input.especieAlCrear) return { ok: false, motivo: "al crear se debe declarar --especie apunte|modelo" };
    return { ok: true, especieDestino: input.especieAlCrear };
  }

  // 3. Biblioteca = solo-lectura.
  if (input.destino.especie === "biblioteca") return { ok: false, motivo: "destino biblioteca es solo-lectura" };

  // 4. Carril por procedencia: modelo con sello exige bundle del compilador.
  if (input.destino.tieneSello && !bundleTieneSello(input.bundleJson)) {
    return { ok: false, motivo: "el modelo tiene proto: edita el proto y recompila (bundle sin sello rechazado)" };
  }

  // 5. Base no ratificada: si la base del pull fue autosave, exige confirmación.
  if (input.baseFueAutosave && !input.confirmadoPorOperador) {
    return { ok: false, motivo: "base no ratificada (autosave): el operador debe confirmar (--confirmado-por-operador)" };
  }

  return { ok: true, especieDestino: input.destino.especie };
}
