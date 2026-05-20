import { useEffect, useRef } from "preact/hooks";
import { usePantallaInicioViewModel } from "./pantallaInicioViewModel";
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
 *   - el modelo está vacío (`modeloTieneContenidoVisible(modelo) === false`).
 *
 * Cuando todas se cumplen, dispara `precargarBienvenida(nombreFixture)` una
 * sola vez por montaje del workbench. Si el operador hace `Empezar vacío`
 * después, `pantallaInicioCerrada` queda en `true` y el effect ya no
 * vuelve a precargar (la guarda `autoprecargadoRef` blinda doble disparo
 * por re-renders).
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

  const autoprecargadoRef = useRef(false);
  const debePrecargar = !modeloPersistidoId
    && !pantallaInicioCerrada
    && !pestanaActivaEsBienvenida
    && recientes.length === 0
    && !modeloTieneContenidoVisible(modelo);

  useEffect(() => {
    if (!debePrecargar) return;
    if (autoprecargadoRef.current) return;
    autoprecargadoRef.current = true;
    precargarBienvenida(nombreFixture);
  }, [debePrecargar, nombreFixture, precargarBienvenida]);
}
