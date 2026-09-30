# EQUILIBRIO — distribución del LLM

- **Decisión original:** 2026-06-04
- **Última revisión documental:** 2026-09-23
- **Estado:** vigente

## Decisión

El kernel de opforja y la gestión de modelos permanecen deterministas. El producto
incorpora un servicio de tareas que interpreta encargos mediante un proveedor
generativo y propone operaciones tipadas. La aplicación valida sus efectos,
autoridad y base antes de incorporarlos; el proveedor no posee el modelo ni
concede permisos. La edición manual y la exportación siguen disponibles cuando
el servicio de inferencia está deshabilitado o falla.

La aplicación conserva dentro:

- modelo, operaciones, validación, persistencia y transacciones;
- navegación, edición OPD/OPL, diagnóstico y recuperación;
- contratos reproducibles para intercambiar contexto con agentes.
- tareas con intención versionada, presupuesto, cancelación, resultados y recibos;
- propuestas revisables e incorporación mediante el mismo circuito de cambios.

La inferencia se mantiene fuera del kernel:

- interpretación abierta, pedagogía y exploración de alternativas;
- consulta de corpus y apoyo al juicio humano;
- generación de propuestas que la aplicación valida antes de aceptar.

## Consecuencias

- Una respuesta del LLM no muta por sí sola el modelo ni reemplaza los gates del kernel.
- El Tutor contextual puede ser determinista y local; no necesita una segunda fuente de
  estado ni una llamada de red para cada gesto.
- El puente mesa↔skill transporta contexto y recibos explícitos. No autoriza escritura
  externa ni promoción de modelos por implicación.
- El contrato integrado conserva comprobaciones de base, sesión, alcance,
  propiedad externa y perfil. Cada incorporación tiene recibo recuperable e
  inversa condicionada al trabajo posterior; una respuesta de red perdida no se
  interpreta como ausencia de efectos.
- MiMo `mimo-v2.6-pro` es el proveedor candidato elegido por el operador. Su clave
  permanece en servidor. Las pruebas controladas no sustituyen la sonda real ni
  la evaluación de modelado con personas; ambas tienen aceptación separada.
- Jev puede aportar juicios tipados sobre candidatos y evidencia. Las sondas
  sintéticas actuales no justifican una dependencia productiva ni sustituir
  generación, autorización, cálculo o validación semántica por sus probabilidades.

## Procedencia

La deliberación original del 2026-06-04 fue archivada sin edición el 2026-08-09. Este
documento conserva solo la decisión que sigue gobernando; Git retiene el detalle del
debate.

La revisión del 2026-09-23 realiza el encargo del operador de integrar el agente y
optimizar el producto. Sus contratos están en la
[especificación del producto integrado](../specs/opforja-producto-integrado.md),
la configuración vigente en [operación](../deploy/opforja.md) y la evidencia
acotada de Jev en [su evaluación](../auditorias/2026-09-23-evaluacion-jev.md).
