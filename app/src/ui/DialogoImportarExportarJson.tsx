import { Dialogo } from "./Dialogo";
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
      actions={(
        <button type="button" onClick={onCerrar}>
          Cerrar
        </button>
      )}
    >
      <PersistenciaJson onImported={onCerrar} />
    </Dialogo>
  );
}
