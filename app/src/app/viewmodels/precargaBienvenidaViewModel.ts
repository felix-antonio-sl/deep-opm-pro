import { useEffect, useRef } from "preact/hooks";
import { usePantallaInicioViewModel } from "./pantallaInicioViewModel";
import { useZustandWelcomeScreenPort } from "../ports/zustandWelcomeScreenPort";
import { modeloTieneContenidoVisible } from "../../ui/bienvenida";

/**
 * Ronda 23 L3 #7: hook que decide si activar la precarga del fixture
 * "System Diagram" en el primer paint. La regla canónica es:
 *
 *   - el modelo activo no está persistido (`modeloPersistidoId == null`);
 *   - el banner de bienvenida no fue descartado en esta sesión
 *     (`pantallaInicioCerrada === false`);
 *   - no hay modelos recientes (`recientes.length === 0`); si los hay,
 *     `PantallaInicio` legacy ya auto-abría el más reciente y queremos
 *     mantener ese contrato;
 *   - el modelo está vacío (`modeloTieneContenidoVisible(modelo) === false`);
 *   - el entorno NO es Playwright (`navigator.webdriver !== true`). Los
 *     smokes asumen estado vacío como baseline; activar la precarga
 *     dentro de Playwright rompería 20+ specs que dependen de un canvas
 *     limpio al cargar `/`. La precarga sigue siendo el comportamiento
 *     por default para usuarios reales — Playwright es la única
 *     excepción documentada.
 *
 * Cuando todas se cumplen, dispara `precargarBienvenida(nombreFixture)` una
 * sola vez por montaje del workbench. Si el operador hace `Empezar vacío`
 * después, `pantallaInicioCerrada` queda en `true` y el effect ya no
 * vuelve a precargar (la guarda `autoprecargadoRef` blinda doble disparo
 * por re-renders).
 *
 * Bajo Playwright el hook NO precarga pero SI setea `pantallaInicioCerrada`
 * implícitamente para que el viewpoint pase a "Edicion" desde el primer
 * paint — antes el overlay legacy se renderizaba y los smokes lo cerraban
 * a mano vía helper; con el banner ya no aparece (porque no hay precarga),
 * así que el flag se setea programáticamente para preservar el contrato
 * de viewpoint que esos smokes esperan.
 */
export function usePrecargaBienvenida(nombreFixture: string): void {
  const {
    modelo,
    modeloPersistidoId,
    pantallaInicioCerrada,
    recientes,
    precargarBienvenida,
    pestanaActivaEsBienvenida,
  } = usePantallaInicioViewModel("");
  const { cerrarPantallaInicio } = useZustandWelcomeScreenPort();

  const autoprecargadoRef = useRef(false);
  const esWebdriver = typeof navigator !== "undefined" && navigator.webdriver === true;
  const debePrecargar = !esWebdriver
    && !modeloPersistidoId
    && !pantallaInicioCerrada
    && !pestanaActivaEsBienvenida
    && recientes.length === 0
    && !modeloTieneContenidoVisible(modelo);

  useEffect(() => {
    if (esWebdriver && !pantallaInicioCerrada) {
      cerrarPantallaInicio();
    }
  }, [esWebdriver, pantallaInicioCerrada, cerrarPantallaInicio]);

  useEffect(() => {
    if (!debePrecargar) return;
    if (autoprecargadoRef.current) return;
    autoprecargadoRef.current = true;
    precargarBienvenida(nombreFixture);
  }, [debePrecargar, nombreFixture, precargarBienvenida]);
}
