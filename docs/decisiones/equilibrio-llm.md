# EQUILIBRIO — distribución del LLM

- **Decisión original:** 2026-06-04
- **Última revisión documental:** 2026-08-09
- **Estado:** vigente

## Decisión

El kernel de opforja y la gestión de modelos permanecen deterministas. El LLM opera
fuera de ese núcleo, mediante agentes o skills que aportan orientación, propuestas y
contexto; no se convierte en autoridad semántica, fuente de estado ni dependencia
oculta de una operación de modelamiento.

La aplicación conserva dentro:

- modelo, operaciones, validación, persistencia y transacciones;
- navegación, edición OPD/OPL, diagnóstico y recuperación;
- contratos reproducibles para intercambiar contexto con agentes.

La capa asistida conserva fuera:

- interpretación abierta, pedagogía y exploración de alternativas;
- consulta de corpus y apoyo al juicio humano;
- generación de propuestas que la aplicación valida antes de aceptar.

## Consecuencias

- Una respuesta del LLM no muta por sí sola el modelo ni reemplaza los gates del kernel.
- El Tutor contextual puede ser determinista y local; no necesita una segunda fuente de
  estado ni una llamada de red para cada gesto.
- El puente mesa↔skill transporta contexto y recibos explícitos. No autoriza escritura
  externa ni promoción de modelos por implicación.
- Incorporar inferencia dentro de la aplicación exige un nuevo contrato de efectos,
  fallo, privacidad, costo y recuperación aprobado por el operador.

## Procedencia

La deliberación original del 2026-06-04 fue archivada sin edición el 2026-08-09. Este
documento conserva solo la decisión que sigue gobernando; Git retiene el detalle del
debate.
