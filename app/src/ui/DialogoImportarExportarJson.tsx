/**
 * DialogoImportarExportarJson «Modal».
 * S.4 ronda 22: `PersistenciaJson` vive solo dentro de este Dialogo; el
 * Inspector vacio conserva un CTA y ya no monta un `<details>` permanente.
 */
import { Dialogo, DialogoAccion } from "./Dialogo";
import { PersistenciaJson } from "./PersistenciaJson";

interface Props {
  open: boolean;
  onCerrar: () => void;
}

export function DialogoImportarExportarJson({ open, onCerrar }: Props) {
  return (
    <Dialogo
      open={open}
      title="Importar / Exportar JSON"
      onCancel={onCerrar}
      size="xl"
      testId="dialogo-importar-exportar-json"
      actions={<DialogoAccion onClick={onCerrar}>Cerrar</DialogoAccion>}
    >
      <PersistenciaJson onImported={onCerrar} />
    </Dialogo>
  );
}
