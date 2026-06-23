# Notas de mantenimiento documental

Lecciones de la auditoría documental integral del 2026-06-23. Una por hallazgo crítico, con resumen de una línea.

## 1. HANDOFF appendado vs consolidado

**Resumen**: el handoff se acumuló durante 18 días (603 líneas, 128 KB) hasta violar su propia doctrina ("Reescribir y consolidar; nunca crear handoffs paralelos o fechados"); la consolidación agresiva respaldada por la historia git lo dejó en 87 líneas legibles.

La doctrina del repo ya era explícita (CLAUDE.md regla 4), pero la práctica se deslizó al patrón fácil de appendar `## Actualización <fecha>` en cada corte. El verificador de contexto fresco confirmó que un recién llegado no puede orientarse leyendo 603 líneas; sí con 87. La historia git conserva el detalle commit-por-commit de cada actualización previa, así que consolidar **no pierde** información — la mueve al sitio correcto.

**Antídoto**: cada vez que el operador pide "actualiza el HANDOFF", aplicar el protocolo de consolidación (reescribir el estado vigente), no el de append (añadir una sección nueva con fecha). Si el handoff supera ~200 líneas, es señal de que se está appendando.

## 2. Sidecar `opforja-bug-capture` escribe como root

**Resumen**: archivar masivamente `docs/bugs/BUG-*` requiere `docker stop opforja-bug-capture` + `sudo chown -R felix:felix docs/bugs` porque el sidecar del contenedor Docker escribe vía bind mount como root.

El capturador integrado de la app escribe los reports en `docs/bugs/` desde dentro del contenedor (que corre como root). Los dirs `BUG-*` quedan `root:felix`, y `felix` no puede `git mv` sin sudo. El sidecar también puede crear dirs nuevos durante el archivado (race).

**Antídoto**: para archivado masivo de bugs, detener el sidecar, chown recursivo, mover, regenerar con `bun run bug:index`, reiniciar sidecar. El README de bugs/ ya documenta `archive/**`; los bugs resueltos van ahí y se regeneran INDEX/HISTORY desde los `payload.json`/`report.md` de cada uno.

## 3. Invariante de idioma falsa en la doctrina

**Resumen**: CLAUDE.md y docs/README.md declaraban "inglés para identificadores de código", pero el código usa español para el vocabulario OPM del dominio (`formarAbanico`, `commitModelo`, `OpmStore`) — la doctrina mentía sobre la práctica desde el inicio del repo.

El verificador de contexto fresco cazó este FAIL. La decisión real del repo (coherente con OPM/ISO 19450 modelado en español por el operador) es: **el vocabulario del dominio OPM vive en español** en el código (entidades, operaciones, tipos del modelo), y **la infraestructura en inglés** (stack, dependencias, utilidades). Corregí ambas doctrinas (CLAUDE.md:131, docs/README.md:81) para reflejar la realidad, en vez de intentar migrar el código.

**Antídoto**: cuando una doctrina no calza con la práctica establecida, lo barato es corregir la doctrina; lo caro es migrar el código. Verificar la doctrina contra muestras reales antes de declararla.

## 4. Auditorías con referencias vivas no son "implementadas"

**Resumen**: las 4 auditorías que parecían "implementadas/resueltas" y candidatas a eliminación tenían 15+ referencias vivas de autoridad en código productivo y corpus normativo (comentarios que las citan como fuente por ID de hallazgo); la política "referencia viva o valor prospectivo" las ampara.

Un subagente verificador de contexto fresco cazó esto antes de ejecutar la eliminación: `deploy/nginx.conf`, `deploy/backup-opforja-db.sh`, `app/scripts/model-persistence-api.ts` citan la auditoría de persistencia por ID (#1/#3/#4); `app/src/leyes/silencio-readonly.test.ts`, `CommandPalette.tsx`, `globalShortcutsPort.ts` citan la UX-Jobs por IDs C-1/M-1/M-2 (11 sitios); `docs/canon-opm/*` y `ui-forja/*` citan la ssot-corpus como origen de enmiendas vigentes; `registro-conformidad-ssot.md` cita la opforja-vs-ssot bidireccionalmente por IDs A1-1/A6-1. Eliminar las auditorías habría dejado 15+ comentarios colgantes.

**Antídoto**: antes de eliminar un documento por "implementado", grep de sus IDs/citas en todo el repo (código incluido, no solo docs). La política de vigencia del repo dice "mientras tengan referencia viva" — una cita de autoridad en un comentario de código productivo es referencia viva, aunque el documento ya no describa estado actual.
