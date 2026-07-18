# Notas — corte A′-vitrina (chip revisión nueva + colapso de hitos)

Lecciones del bucle de construcción de la vitrina del puente mesa↔skill (Ola 2).
Una lección por bloque, resumen de una línea al inicio.

## El `dirty` local solo es confiable si el push está ligado a su base

**Resumen corregido (2026-07-18):** el optimistic locking interno no bastaba;
la seguridad exige ligar el bundle a la base exacta observada por `pull`.

El riesgo top-2 del comité era que no existe un dirty-bit limpio y que `dirty` sub-reporta
(el autosalvado lo apaga). La inferencia original de este bloque fue refutada:
el `409` antiguo solo protegía la revisión leída dentro de `push`; un bundle
nacido de un `pull` anterior podía sobrescribir una revisión posterior. El
protocolo 2.0 corrige la ley con un
[`Testigo-Base`](../manual-opforja.md#a6-puente-directo-mesaskill-cli) que
identifica guardado y autosave, y el servidor lo revalida dentro del commit
atómico. Bajo ese protocolo, `dirty === false` significa que no quedan cambios
en memoria posteriores a la rama persistida que el agente observó;
`dirty === true` mantiene la rama cautelosa. La fuente actual implementa esa
garantía, pero producción no debe atribuírsela hasta desplegarla y comprobarla.

## La base de revisión debe avanzar con los guardados PROPIOS del operador

**Resumen corregido (2026-07-18):** la revisión base avanza al cargar o guardar;
el autosave conserva una rama separada bajo CAS y no finge un guardado principal.

`revisionBasePorModelo[id]` se actualiza cuando el store aprende una revisión
guardada fresca: carga, guardado manual o apertura de pestaña. El autosave usa
esa revisión como precondición, persiste su propio snapshot y no incrementa la
revisión guardada; por eso el poll no puede confundirlo con una revisión nueva
del agente.

## Modelo y workspace necesitan revisiones distintas

**[HECHO COMPROBADO · 2026-07-18]:** modelo y workspace son agregados
independientes; ambos usan CAS, pero no comparten contador.

El modelo protege su contenido y versiones. El workspace protege carpetas,
orden, preferencias y pertenencia. Un único contador aumentaría conflictos
falsos; dejar el workspace en última escritura gana perdería movimientos
concurrentes. La fuente aplica `revisionBase` por agregado y reconcilia el
workspace con merge de tres vías. Pruebas:
`../../app/src/store/persistencia.test.ts` y
`../../app/src/server/modelPersistence.test.ts`.

**[DECISIÓN]:** mantener ambos CAS separados y monotónicos.

**[PENDIENTE]:** la migración v5 sigue sin ejecutarse en producción; no atribuir
esta garantía al despliegue `88bfd2dd`.

## Un cambio de sesión cancela el trabajo asíncrono anterior

**[HECHO COMPROBADO · 2026-07-18]:** una respuesta iniciada antes de login,
logout o cambio de tenant puede llegar después y debe descartarse.

La solución verificada combina época local, identidad de sesión observada,
purga al recibir `401` y coalescing de `/session` solo dentro de la misma
frontera. Confiar únicamente en la cookie vigente no basta porque una promesa
antigua ya lleva sus efectos en vuelo. Fuentes:
`../../app/src/store/sessionEpoch.ts`,
`../../app/src/persistencia/sessionIdentity.ts` y
`../../app/src/store/auth.test.ts`.

**[DECISIÓN]:** tratar cada cambio de identidad como frontera de cancelación,
no como simple actualización de credenciales.

**[HIPÓTESIS DESCARTADA]:** «reintentar el request tras `401` recupera la
consistencia». Puede ejecutar la misma intención bajo otra identidad.

## Un contrato atómico no degrada silenciosamente

**[DECISIÓN · 2026-07-18]:** si el endpoint de revisión atómica no existe, el
cliente falla de forma explícita; no recompone la intención con endpoints
heredados.

Un fallback ante `404`, `405` o `501` convertiría una incompatibilidad de
versión en escrituras parciales. La compatibilidad segura es negociar o
desplegar el contrato, no fingir atomicidad. Fuentes:
`../../app/src/mesa/roundtrip.test.ts` y
`../../app/src/server/modelPersistenceAuth.test.ts`.

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

## Key duplicada en el colapso: la fila-resumen del hito colisiona con su primer hijo

**Resumen:** la key del resumen del hito DEBE prefijarse (`hito-<id>`); si no, colisiona con la key de la primera versión interna (mismo id) al expandir.

`clave = fila.versiones[0].id` (el push más nuevo). La fila-resumen y la primera fila anidada
comparten ese id → Preact: «two or more children with the same key attribute: a3». Los unit
tests + typecheck + design:governance pasaron; el warning SÓLO apareció in-vivo al expandir el
hito. Lección: el colapso es quisquilloso — validar la expansión en el navegador, no sólo el
agrupador puro. Fix: `key={`hito-${clave}`}` en la fila-resumen.
