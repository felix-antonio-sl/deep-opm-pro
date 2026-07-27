import { useOpmStore } from "../store";
import { deriveEntryIntent, runTutorPolicy } from "../tutor";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { TutorInterventionDetails, mapearLentesTutor } from "./TutorDetails";

export function DialogoReabrirTaller() {
  const modeloId = useOpmStore((s) => s.dialogoReabrirModeloId);
  const modelo = useOpmStore((s) => s.reaperturaModeloObjetivo);
  const enCurso = useOpmStore((s) => s.reaperturaEnCurso);
  const error = useOpmStore((s) => s.reaperturaError);
  const cerrar = useOpmStore((s) => s.cerrarReaperturaTaller);
  const confirmar = useOpmStore((s) => s.confirmarReaperturaTaller);
  const intentId = `lifecycle:${modeloId ?? "none"}:reopen-workshop`;
  const intervencionTutor = runTutorPolicy(deriveEntryIntent({
    intentId,
    focus: "lifecycle",
    transition: "reopen-workshop",
    factsPreserved: true,
    activeLenses: mapearLentesTutor(modelo?.lentesConocimiento ?? []),
  }), [{ owner: "product", intentId }]);

  return (
    <Dialogo
      open={modeloId !== null}
      title="Reabrir Modelo en Taller"
      size="sm"
      onCancel={cerrar}
      testId="dialogo-reabrir-taller"
      actions={(
        <>
          <DialogoAccion disabled={enCurso && modelo !== null} onClick={cerrar}>Cancelar</DialogoAccion>
          <DialogoAccion
            tono="primaria"
            testId="reabrir-taller-confirmar"
            tutorEntrypoint="workspace:reopen-workshop"
            disabled={!modelo || enCurso}
            onClick={confirmar}
          >
            {enCurso ? (modelo ? "Reabriendo…" : "Preparando…") : "Reabrir en Taller"}
          </DialogoAccion>
        </>
      )}
    >
      <TutorInterventionDetails intervention={intervencionTutor} testId="tutor-dialogo-reabrir" />
      <div data-tutor-surface-owner="product" data-tutor-intent={intentId}>
        <p>
          El mismo documento dejará el espacio Modelos y volverá al Taller como Apunte.
          Podrás explorar y corregir sin que las condiciones de cierre formal bloqueen el trabajo.
        </p>
        <p>
          No cambian su ID, nombre, carpeta, entidades, enlaces, OPDs, OPL ni Bocetos.
          Se creará una versión «Reapertura en Taller».
        </p>
        <p>
          La validación humana, si existiera fuera de OpForja, no se transfiere ni se
          invalida automáticamente: debe evaluarse contra la versión correspondiente.
        </p>
      </div>
      {error ? <p role="alert" data-testid="reabrir-taller-error">{error}</p> : null}
    </Dialogo>
  );
}
