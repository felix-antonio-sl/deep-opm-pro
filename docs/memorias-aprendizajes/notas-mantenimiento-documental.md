# Notas de mantenimiento documental

Lecciones de la auditoría documental integral del 2026-06-23. Una por hallazgo crítico, con resumen de una línea.

## 1. Handoff cronológico vs fotografía operativa

**Resumen**: acumular cierres por fecha convirtió el handoff en bitácora; consolidarlo demostró que el estado debe ser una fotografía y la historia debe vivir en Git.

La práctica se deslizó al patrón fácil de añadir `## Actualización <fecha>` en cada corte. El verificador de contexto fresco confirmó que ese formato impide orientarse. La historia Git conserva el detalle commit a commit, por lo que retirarlo del estado vivo no pierde trazabilidad.

**Antídoto**: desde 2026-07-12, no acumular actualizaciones cronológicas. Mientras
un mismo corte todavía se está cerrando, completar su única fotografía vigente;
un cambio operativo posterior crea `handoff-AAAA-MM-DD.md` nuevo y desplaza el
anterior a `_archivo/`. No usar número de líneas como proxy de legibilidad.

## 2. Sidecar `opforja-bug-capture` escribe como root

**Resumen**: archivar masivamente `docs/bugs/BUG-*` requiere `docker stop opforja-bug-capture` + `sudo chown -R felix:felix docs/bugs` porque el sidecar del contenedor Docker escribe vía bind mount como root.

El capturador integrado de la app escribe los reports en `docs/bugs/` desde dentro del contenedor (que corre como root). Los dirs `BUG-*` quedan `root:felix`, y `felix` no puede `git mv` sin sudo. El sidecar también puede crear dirs nuevos durante el archivado (race).

**Antídoto**: para archivado masivo de bugs, detener el sidecar, chown recursivo, mover, regenerar con `bun run bug:index`, reiniciar sidecar. El README de bugs/ ya documenta `archive/**`; los bugs resueltos van ahí y se regeneran INDEX/HISTORY desde los `payload.json`/`report.md` de cada uno.

## 3. La doctrina de idioma debe distinguir legado y regla futura

**Resumen**: el código heredado usa español en el vocabulario OPM (`formarAbanico`, `commitModelo`), pero el estándar del host exige inglés para identificadores nuevos; ocultar cualquiera de los dos hechos hace mentir a la doctrina.

La política vigente desde 2026-07-12 es: documentación y comunicación en español de Chile; código nuevo, comandos e identificadores en inglés. Los identificadores OPM existentes en español son una excepción heredada que no se amplía. Migrarlos requiere un corte de código propio y no forma parte del mantenimiento documental.

**Antídoto**: declarar por separado el estándar futuro y la deuda heredada; nunca reetiquetar el legado como regla para evitar una migración.

## 4. Auditorías con referencias vivas no son "implementadas"

**Resumen**: las 4 auditorías que parecían "implementadas/resueltas" y candidatas a eliminación tenían 15+ referencias vivas de autoridad en código productivo y corpus normativo (comentarios que las citan como fuente por ID de hallazgo); la política "referencia viva o valor prospectivo" las ampara.

Un subagente verificador de contexto fresco cazó esto antes de ejecutar la eliminación: `deploy/nginx.conf`, `deploy/backup-opforja-db.sh`, `app/scripts/model-persistence-api.ts` citan la auditoría de persistencia por ID (#1/#3/#4); `app/src/leyes/silencio-readonly.test.ts`, `CommandPalette.tsx`, `globalShortcutsPort.ts` citan la UX-Jobs por IDs C-1/M-1/M-2 (11 sitios); `docs/canon-opm/*` y `ui-forja/*` citan la ssot-corpus como origen de enmiendas vigentes; `registro-conformidad-ssot.md` cita la opforja-vs-ssot bidireccionalmente por IDs A1-1/A6-1. Eliminar las auditorías habría dejado 15+ comentarios colgantes.

**Antídoto**: antes de eliminar un documento por "implementado", grep de sus IDs/citas en todo el repo (código incluido, no solo docs). La política de vigencia del repo dice "mientras tengan referencia viva" — una cita de autoridad en un comentario de código productivo es referencia viva, aunque el documento ya no describa estado actual.

## 5. Las líneas no miden legibilidad

**Resumen**: un handoff de 136 líneas volvió a ser inmanejable porque acumuló 60 KB y párrafos de miles de caracteres; el límite útil es semántico, no lineal.

La alarma anterior de 200 líneas no detectó la recaída. El estado operativo mezcló cronología, decisiones permanentes, gates antiguos y estados mutuamente incompatibles dentro de líneas extensas.

**Antídoto**: el handoff es una fotografía con estado, pendientes, defectos y riesgos. La historia va a Git; las decisiones a specs o actas; la dirección al roadmap.

## 6. Estado, plan, defectos e historia son capas distintas

**Resumen**: declarar el handoff como fuente “exclusiva” ocultó que el roadmap y el índice de bugs tienen autoridades diferentes y legítimas.

La jerarquía estable es: `CLAUDE.md` gobierna; el handoff fecha el estado; el roadmap fecha la dirección; `bugs/INDEX.md` registra defectos; Git conserva historia. Ninguna capa debe duplicar las demás.

**Antídoto**: cada afirmación volátil tiene un solo domicilio y los demás documentos enlazan, no copian.

## 7. Un operativo resuelto no debe parecer ejecutable

**Resumen**: planes, prompts y solicitudes cerradas conservaron casillas pendientes e instrucciones imperativas después del despliegue, induciendo a repetir trabajo.

**Antídoto**: al cerrar un corte, desplazar su scaffolding a `_archivo/` y conservar en el árbol vivo solo contratos con autoridad, brechas abiertas y el resultado actual.

## 8. Un fallo del runner no demuestra una regresión del producto

**[HECHO COMPROBADO · 2026-07-18]:** 38 trazas Playwright fallaron con
`ERR_NETWORK_CHANGED` mientras otro repositorio creaba, destruía o reemplazaba
interfaces Docker `veth`. El HTML respondió, pero Chromium canceló módulos y
dejó la aplicación en blanco. Las cuatro pruebas afectadas en la repetición
amplia aprobaron después, en serie, con puertos propios y Docker estable.

**[DECISIÓN]:** no corregir código de producto sin una falla reproducible en un
entorno estable. Conservar la traza, correlacionar tiempo con infraestructura y
repetir solo los casos afectados antes de clasificar.

**[ALTERNATIVA DESCARTADA]:** aumentar timeouts o modificar selectores. Habría
ocultado la causa sin evitar que el navegador abortara recursos.

**[RESTRICCIÓN]:** ejecutar E2E sin Testcontainers o despliegues Docker
concurrentes y asignar un `PW_PORT` distinto a cada runner. Si la contaminación
se vuelve recurrente, el asunto pendiente es aislar la infraestructura de CI,
no flexibilizar las aserciones.

Fuente de cierre: `../handoff-2026-07-18.md`.
