import { useRef } from "preact/hooks";
import { useOpmStore } from "../store";
import { Dialogo, DialogoAccion } from "./Dialogo";

export function DialogoEliminarRefinamiento() {
  const confirmacion = useOpmStore((s) => s.confirmacionEliminarRefinamiento);
  const modelo = useOpmStore((s) => s.modelo);
  const confirmar = useOpmStore((s) => s.confirmarEliminarRefinamiento);
  const cancelar = useOpmStore((s) => s.cancelarEliminarRefinamiento);
  const cancelarRef = useRef<HTMLButtonElement>(null);

  const opds = confirmacion?.opdIds
    .map((opdId) => modelo.opds[opdId])
    .filter((opd): opd is NonNullable<typeof opd> => !!opd)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es")) ?? [];

  return (
    <Dialogo
      open={!!confirmacion}
      title="Eliminar refinamiento y subárbol"
      size="sm"
      onCancel={cancelar}
      initialFocusRef={cancelarRef}
      testId="dialogo-eliminar-refinamiento"
      actions={(
        <>
          <DialogoAccion
            innerRef={cancelarRef}
            onClick={cancelar}
            testId="dialogo-eliminar-refinamiento-cancelar"
          >
            Cancelar
          </DialogoAccion>
          <DialogoAccion
            tono="destructiva"
            onClick={confirmar}
            testId="dialogo-eliminar-refinamiento-confirmar"
          >
            Eliminar refinamiento y subárbol
          </DialogoAccion>
        </>
      )}
    >
      <p>Se eliminarán {opds.length} OPD{opds.length === 1 ? "" : "s"}:</p>
      <ul>
        {opds.map((opd) => <li key={opd.id}>{opd.nombre}</li>)}
      </ul>
      <p>El subárbol no vuelve al Taller. Esta operación se puede deshacer.</p>
    </Dialogo>
  );
}
