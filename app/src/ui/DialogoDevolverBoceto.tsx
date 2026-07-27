import { useRef } from "preact/hooks";
import { useOpmStore } from "../store";
import { deriveEntryIntent, runTutorPolicy } from "../tutor";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { TutorInterventionDetails, mapearLentesTutor } from "./TutorDetails";

export function DialogoDevolverBoceto() {
  const confirmacion = useOpmStore((s) => s.confirmacionDevolverBoceto);
  const modelo = useOpmStore((s) => s.modelo);
  const confirmar = useOpmStore((s) => s.confirmarDevolverOpdABocetos);
  const cancelar = useOpmStore((s) => s.cancelarDevolverOpdABocetos);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const opd = confirmacion ? modelo.opds[confirmacion.opdId] : undefined;
  const intentId = `refinement:${confirmacion?.opdId ?? "none"}:return-sketch`;
  const intervencionTutor = runTutorPolicy(deriveEntryIntent({
    intentId,
    focus: "lifecycle",
    transition: "return-sketch",
    factsPreserved: true,
    activeLenses: mapearLentesTutor(modelo.lentesConocimiento ?? []),
  }));

  return (
    <Dialogo
      open={!!confirmacion}
      title="Devolver OPD a Bocetos"
      size="sm"
      onCancel={cancelar}
      initialFocusRef={cancelarRef}
      testId="dialogo-devolver-boceto"
      actions={(
        <>
          <DialogoAccion innerRef={cancelarRef} onClick={cancelar}>Cancelar</DialogoAccion>
          <DialogoAccion
            tono="primaria"
            testId="dialogo-devolver-boceto-confirmar"
            tutorEntrypoint="tree:return-sketch"
            onClick={confirmar}
          >
            Devolver a Bocetos
          </DialogoAccion>
        </>
      )}
    >
      <TutorInterventionDetails intervention={intervencionTutor} testId="tutor-dialogo-devolver-boceto" />
      <div data-tutor-surface-owner="product" data-tutor-intent={intentId}>
        <p>
          «{opd?.nombre ?? "Este OPD"}» dejará de refinar a su cosa actual y quedará disponible en Bocetos.
        </p>
        <p>
          Se conservarán su identidad y sus {confirmacion?.opdIds.length ?? 0} OPD
          {(confirmacion?.opdIds.length ?? 0) === 1 ? "" : "s"} de subárbol, junto con cosas,
          enlaces, estados, geometría y pregunta guía.
        </p>
        <p>No se elimina contenido. Puedes volver a integrarlo después.</p>
      </div>
    </Dialogo>
  );
}
