# Notas — corte A′-vitrina (chip revisión nueva + colapso de hitos)

Lecciones del bucle de construcción de la vitrina del puente mesa↔skill (Ola 2).
Una lección por bloque, resumen de una línea al inicio.

## El 409 fast-forward colapsa el dirty-bit a `dirty` a secas

**Resumen:** «cambios locales en riesgo» = `dirty` (edición en memoria sin persistir); nada más.

El riesgo top-2 del comité era que no existe un dirty-bit limpio y que `dirty` sub-reporta
(el autosalvado lo apaga). El análisis del optimistic locking lo resuelve: en producción el
repo Postgres incrementa `revision` en transacción y lanza `PersistenciaConflictError` (409)
si la revisión enviada no coincide con la actual. Consecuencia: **cualquier revisión remota
más nueva que la base fue necesariamente construida sobre el último estado consolidado
(guardado/autosalvado) del operador** — nunca sobre una bifurcación vieja (esa da 409 y el
agente no escribe). Por lo tanto, cuando `dirty === false`, recargar a la revisión del agente
es demostrablemente sin pérdida. Cuando `dirty === true`, hay edición en memoria que una
recarga descartaría → rama cautelosa. Plegar la pila de undo o la frescura del autosalvado
(los hedges de la spec) sólo agregaría falsos positivos (marcaría trabajo ya guardado como
«en riesgo» = cry-wolf). El autosalvado consolida el `json` principal y avanza la base, así
que post-autosalvado `dirty=false` refleja correctamente «nada en memoria en riesgo».

## La base de revisión debe avanzar con los guardados PROPIOS del operador

**Resumen:** sin actualizar la base al guardar/autosalvar, el chip gatilla con tu propio guardado.

`revisionBasePorModelo[id]` se fija en los 3 puntos donde el store aprende una revisión fresca
del modelo activo: cargar (`persistencia.ts:410`), guardar (`:357`), autosalvar (`:494`), más
`abrirPestanaConModelo`. Si se omite el autosalvado, la base queda atrás, el poll ve la revisión
propia avanzada y el chip miente «revisión nueva» sobre trabajo del propio operador.

## `revisionRemota` se etiqueta por `modeloId` para no mostrar chip rancio al cambiar de pestaña

**Resumen:** `{ modeloId, revision }` en vez de un número suelto evita el flash cross-modelo.

El chip sólo se muestra si `revisionRemota.modeloId === modeloPersistidoId`. Así una lectura
del poll de un modelo previo nunca se muestra sobre el modelo recién activado.

## `<ChipPersistencia/>` es código muerto; el chip vivo es `ToolbarPersistenceStatus`

**Resumen:** el chip del chrome se reimplementa inline en `ToolbarBase.tsx:398`, montado en `cluster-modelo` (:289-298).

`ChipPersistencia.tsx` sólo aporta funciones puras (`clasificarVariante`, `labelChip`, …); su
componente JSX no se monta. El chip hermano de revisión va en `cluster-modelo`, junto a
`ToolbarPersistenceStatus`. No existe `src/ui/n.ts` (era artefacto de salida de `rg`).

## El marcador de drift es un badge del canvas, no un chip del chrome

**Resumen:** drift = círculo 15px hairline en rampa ink sobre la entidad JointJS (glifo ⟳); mi chip es DOM rectangular en el chrome.

Diferenciación de vocabulario visual: distinta superficie (SVG canvas vs DOM chrome), distinta
forma (círculo vs rectángulo plano), distinto glifo (NO ⟳), y mi chip es botón accionable con
texto. TINTA = `ink` (#171511); crimson es acento UI-only y ya lo toma el «pendiente» del chip
de persistencia. `design:governance` no impone tinta-only ni prohíbe hex — sólo exige paridad
de tokens y cero sombras offset.

## Gotcha operativo: la salida de `rg` en este shell enmascara palabras a `n`

**Resumen:** usar la herramienta Read (no `rg -n`) para contenido autoritativo; `rg` mutila «drift»/«iniciarAutosalvado»/etc. a `n`.

Los listados de archivos (`rg -l`, `ls`, `wc`) están bien; el contenido con `-n` no.
