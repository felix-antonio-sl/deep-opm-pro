import { listarAvisosDiagnostico, type AvisoDiagnostico } from "./diagnostico";
import { severidadDiagnostico } from "./diagnosticoSeveridad";
import { opdsSueltos } from "./opdSueltos";
import type { Modelo } from "./tipos";

export interface EstadoCierreModelo {
  bloqueosIntegridad: number;
  bloqueosCierre: number;
  mejoras: number;
  bocetos: number;
  pendientes: number;
  listoFormalmente: boolean;
}

type AvisoClasificable = Pick<AvisoDiagnostico, "origen" | "codigo" | "severidad">;

/**
 * Resume el cierre sin introducir un estado persistido paralelo.
 *
 * La diferencia entre la severidad en Apunte y en Modelo separa:
 * - integridad: permanece bloqueo en ambos regímenes;
 * - cierre formal: bloquea como Modelo, pero se observa como Apunte;
 * - mejoras: son exigibles como mejora al evaluar el Modelo.
 *
 * Los Bocetos se cuentan aparte porque son una condición estructural visible
 * del proceso de integración, no un diagnóstico inventado.
 */
export function clasificarEstadoCierre(
  avisos: readonly AvisoClasificable[],
  bocetos: number,
): EstadoCierreModelo {
  let bloqueosIntegridad = 0;
  let bloqueosCierre = 0;
  let mejoras = 0;

  for (const aviso of avisos) {
    const formal = severidadDiagnostico(aviso, { esApunte: false });
    const enTaller = severidadDiagnostico(aviso, { esApunte: true });
    if (formal === "bloqueo") {
      if (enTaller === "bloqueo") bloqueosIntegridad += 1;
      else bloqueosCierre += 1;
    } else if (formal === "mejora") {
      mejoras += 1;
    }
  }

  const pendientes = bloqueosIntegridad + bloqueosCierre + mejoras + bocetos;
  return {
    bloqueosIntegridad,
    bloqueosCierre,
    mejoras,
    bocetos,
    pendientes,
    listoFormalmente: pendientes === 0,
  };
}

export function resumirEstadoCierre(modelo: Modelo): EstadoCierreModelo {
  return clasificarEstadoCierre(
    listarAvisosDiagnostico(modelo, { tipo: "modelo" }),
    opdsSueltos(modelo).length,
  );
}
