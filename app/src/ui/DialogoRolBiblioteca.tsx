import { useRef } from "preact/hooks";
import { useOpmStore } from "../store";
import { deriveEntryIntent, runTutorPolicy } from "../tutor";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { TutorInterventionDetails } from "./TutorDetails";

export function DialogoRolBiblioteca() {
  const modeloId = useOpmStore((s) => s.dialogoRolBibliotecaModeloId);
  const entrada = useOpmStore((s) => s.indice.modelos.find((modelo) => modelo.id === s.dialogoRolBibliotecaModeloId));
  const nombre = useOpmStore((s) =>
    s.modelosGuardados.find((modelo) => modelo.id === s.dialogoRolBibliotecaModeloId)?.nombre ?? "Modelo",
  );
  const confirmar = useOpmStore((s) => s.confirmarRolBiblioteca);
  const cancelar = useOpmStore((s) => s.cancelarRolBiblioteca);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const quitar = entrada?.esBiblioteca === true;
  const intervencionTutor = runTutorPolicy(deriveEntryIntent({
    intentId: `lifecycle:${modeloId ?? "none"}:${quitar ? "unmark-library" : "mark-library"}`,
    focus: "lifecycle",
    transition: quitar ? "unmark-library" : "mark-library",
    factsPreserved: true,
  }));

  return (
    <Dialogo
      open={modeloId !== null}
      title={quitar ? "Quitar de bibliotecas" : "Marcar como Biblioteca"}
      size="sm"
      onCancel={cancelar}
      initialFocusRef={cancelarRef}
      testId="dialogo-rol-biblioteca"
      actions={(
        <>
          <DialogoAccion innerRef={cancelarRef} onClick={cancelar}>Cancelar</DialogoAccion>
          <DialogoAccion tutorEntrypoint={quitar ? "workspace:unmark-library" : "workspace:mark-library"} tono="primaria" onClick={confirmar}>
            {quitar ? "Quitar de bibliotecas" : "Marcar como Biblioteca"}
          </DialogoAccion>
        </>
      )}
    >
      <TutorInterventionDetails intervention={intervencionTutor} testId="tutor-dialogo-biblioteca" />
      <p>
        {quitar
          ? `«${nombre}» volverá a Modelo de Trabajo, nunca a Apunte. El contenido y el rigor no cambian.`
          : `«${nombre}»: cambia el rol a Biblioteca. El contenido y el rigor no cambian. Marcar no abre el modelo.`}
      </p>
    </Dialogo>
  );
}
