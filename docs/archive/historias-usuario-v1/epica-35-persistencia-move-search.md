---
epica: "EPICA-35"
titulo: "Persistencia — Mover Modelos y Buscar Cosas (Ctrl+F intra-modelo)"
doc_fuente: "opcloud-reverse/35-persistencia-move-search.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M1"
hu_emitidas: 20
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-35.md"
---

## Resumen

Esta épica cubre dos capacidades complementarias agrupadas bajo el paraguas de **operaciones que no alteran el canvas OPM** pero son críticas para manejar modelos reales:

1. **Mover Modelos**: trasladar un modelo completo entre carpetas del workspace conservando identidad lógica, historial de versiones y autoguardados. Se implementa vía `Cortar Modelo` + `Pegar Modelo` con confirmación explícita, además de arrastrar-y-soltar tile a tile.
2. **Buscar Cosas**: localizar cosas (Objetos / Procesos) dentro del modelo abierto con `Ctrl+F` o botón de la barra de herramientas secundaria, con lista de apariciones por OPD y salto al OPD seleccionado al hacer clic en un resultado.

La segunda capacidad tiene un segundo punto de entrada via el panel lateral `Cosas OPM Arrastrables` (campo `Buscar` + clic derecho → `Buscar` sobre una entrada). Ambas features integran con el Navegador OPD, el panel OPL-ES y el sistema de permisos (EPICA-40).

Las HU se numeran siguiendo la aparición en el doc fuente. HU-35.001–35.007 cubren Mover Modelos; HU-35.008–35.020 cubren Buscar Cosas y sus integraciones.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-35.001 | Cortar un modelo desde el diálogo Cargar Modelo | ME | M1 | S | opcloud-ui | — |
| HU-35.002 | Pegar un modelo cortado en carpeta destino con confirmación | ME | M1 | M | opcloud-ui | — |
| HU-35.003 | Habilitar Pegar Modelo solo con corte pendiente y permisos de escritura | ME | M1 | S | opcloud-ui | — |
| HU-35.004 | Mover modelo por arrastrar-y-soltar entre tiles | ME | S | M | opcloud-ui | — |
| HU-35.005 | Arrastrar versiones y autoguardados junto al modelo movido | ME | M1 | S | opcloud-ui | — |
| HU-35.006 | Ver carpeta `<Modelo> Versions` post-mover con Mostrar Versiones activado | ME | S | XS | opcloud-ui | — |
| HU-35.007 | Preservar ACL del modelo y unir permisos con carpeta destino | AO | M1 | M | opcloud-ui | — |
| HU-35.008 | Abrir diálogo Buscar Cosas del Modelo con Ctrl+F | ME | M0 | S | opcloud-ui | — |
| HU-35.009 | Abrir diálogo Buscar Cosas del Modelo desde barra de herramientas secundaria | MN | M0 | XS | opcloud-ui | — |
| HU-35.010 | Filtrar resultados incrementalmente por nombre (subcadena) | ME | M0 | S | opcloud-ui | — |
| HU-35.011 | Filtrar resultados por tipo Todos/Procesos/Objetos | ME | M1 | S | opcloud-ui | — |
| HU-35.012 | Ver tabla Elemento | Ubicación con una fila por aparición | ME | M0 | M | opcloud-ui | — |
| HU-35.013 | Conservar color semántico del tipo en la columna Elemento | MN | M1 | XS | opcloud-ui | — |
| HU-35.014 | Navegar al OPD del resultado haciendo clic en la fila | ME | M0 | S | opcloud-ui | — |
| HU-35.015 | Cerrar el diálogo sin navegar con Cerrar o ESC | ME | M1 | XS | opcloud-ui | — |
| HU-35.016 | Filtrar panel Cosas OPM Arrastrables con campo Buscar lateral | ME | M1 | S | opcloud-ui | — |
| HU-35.017 | Abrir búsqueda pre-cargada desde panel lateral vía clic derecho | ME | S | S | opcloud-ui | — |
| HU-35.018 | Decidir la política de marca visual post-salto de búsqueda | MN | S | M | opcloud-ui | — |
| HU-35.019 | Mostrar tabla vacía silenciosa cuando no hay resultados | ME | C | XS | opcloud-ui | — |
| HU-35.020 | Actualizar panel OPL-ES al saltar al OPD del resultado | MN | M1 | XS | opcloud-ui | — |

Total: **20 historias de usuario** (20 opcloud-ui).

## Historias de usuario

### HU-35.001 — Cortar un modelo desde el diálogo Cargar Modelo

**Actor primario:** ME (modelador experto).
**Actores secundarios:** AO (admin de organización cuando reorganiza workspace compartido).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** P (persistencia) primario; U (afordancia botón) secundario.
**Superficie UI:** dialogo-modal-cargar-modelo (pie del dialogo modal + barra de herramientas superior en vista detallada).
**Gesto canónico:** selección de tile de modelo + clic en botón `Cortar Carpeta`/`Cortar Modelo`.

**Historia:**
> Como modelador experto, quiero cortar un modelo desde el diálogo `Cargar Modelo` para marcarlo como pendiente de mover y navegar a su destino sin perder la selección.

**Contexto de negocio:**
El workspace de un modelador real acumula decenas o cientos de modelos en jerarquías de carpetas. Reorganizar sin perder historial (versiones, autoguardados, permisos) requiere un gesto explícito de **corte** que se mantenga entre navegaciones del dialogo modal. El botón comparte nombre visual `Cortar Carpeta` con el de carpetas, pero actúa como `Cortar Modelo` cuando la selección es un modelo — convención UI heredada de OPCloud.

**Criterios de aceptación:**
- **Dado** que abrí `Cargar Modelo` y seleccioné un modelo (ej. `OnStar System To Move`), **cuando** hago clic en el botón `Cortar Carpeta` del pie, **entonces** el modelo queda marcado como "cortado pendiente de pegar" en la sesión actual.
- **Dado** que hay un modelo cortado, **cuando** navego a otra carpeta del dialogo modal, **entonces** la marca de corte se preserva.
- **Dado** que hay un modelo cortado, **cuando** hago clic en `Cortar Carpeta` sobre otro modelo, **entonces** el corte previo se descarta y el nuevo toma su lugar (corte único por sesión).
- **Dado** que no hay selección, **cuando** miro el botón `Cortar Carpeta`, **entonces** aparece deshabilitado.
- **Dado** que la selección es un modelo, **cuando** se evalúa el nombre textual del botón (tooltip), **entonces** se muestra `Cortar Modelo` (nombre contextual aunque el botón base diga `Cortar Carpeta`).

**Reglas y restricciones:**
- Corte único por sesión — no se soporta multi-corte.
- El corte es transitorio, asociado a la sesión del usuario. Política al cerrar el dialogo modal sin pegar: **pregunta abierta** (§11.3 fuente).
- El botón base se llama `Cortar Carpeta` por herencia de UI; el nombre contextual `Cortar Modelo` se muestra en tooltip.

**Modelo de datos tocado:**
- `sesion.corte_pendiente` — `{tipo: "modelo" | "carpeta", id: UUID} | null` — transitorio.

**Dependencias:**
- Bloqueada por: HU de EPICA-30 (apertura del dialogo modal `Cargar Modelo`).
- Bloquea a: HU-35.002, HU-35.003.

**Integraciones:**
- Diálogo `Cargar Modelo` (EPICA-30).
- Sistema análogo sobre carpetas (HU de EPICA-31 §3.5).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/35-persistencia-move-search.md` §3.1 pasos 3–5, §9.
- Frames: frame_00013 (vista detallada con modelo seleccionable), frame_00008 (corte ya activo).
- Transcripción: "the button Cut Folder becomes Cut Model when the selection is a model" (Intro 42).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, workspace, cortar, mover, dialogo-modal].

---

### HU-35.002 — Pegar un modelo cortado en carpeta destino con confirmación

**Actor primario:** ME.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** P primario; U (dialogo modal advertencia) secundario.
**Superficie UI:** dialogo-modal-cargar-modelo (pie + cuarto ícono contextual barra de herramientas superior) + dialogo-modal-confirmacion-advertencia.
**Gesto canónico:** navegación a carpeta destino + clic en `Pegar Modelo` + confirmación de la advertencia.

**Historia:**
> Como modelador experto, quiero pegar el modelo cortado en la carpeta destino con una confirmación explícita para completar el mover de manera reversible hasta el último clic.

**Contexto de negocio:**
El mover de un modelo implica reasignación de carpeta + posible cambio de permisos efectivos + migración de versiones y autoguardados. Una confirmación tipo advertencia evita arrastres accidentales y clics equivocados. La transcripción confirma: "the warning message shall appear and when I click ok now the model is moved".

**Criterios de aceptación:**
- **Dado** que tengo un modelo cortado y navegué a una carpeta destino con permisos de escritura, **cuando** hago clic en `Pegar Modelo` (pie del dialogo modal o cuarto ícono contextual), **entonces** se abre un dialogo modal de advertencia secundario.
- **Dado** que la advertencia está abierta, **cuando** confirmo con `OK`, **entonces** el modelo se mueve a la carpeta destino, su `model.folder_id` se actualiza y la marca de corte se limpia.
- **Dado** que la advertencia está abierta, **cuando** cancelo con `Cancelar`/`ESC`, **entonces** el mover se aborta, el modelo permanece en su carpeta original y la marca de corte se preserva.
- **Dado** que completé el pegado, **cuando** reabro el dialogo modal y navego a la carpeta destino, **entonces** el modelo aparece listado allí.
- **Dado** que completé el pegado, **cuando** miro la carpeta origen, **entonces** el modelo ya no aparece allí.

**Reglas y restricciones:**
- La advertencia no es parametrizable (no hay "no volver a preguntar" observado).
- Tras confirmar, el corte se limpia automáticamente.
- El tooltip del cuarto ícono contextual dice `Pegar Modelo` (frame_00013).

**Modelo de datos tocado:**
- `model.folder_id` — UUID — persistente.
- `model.versions.folder_id` — UUID (actualización en bloque) — persistente.
- `model.autosaves.folder_id` — UUID (actualización en bloque) — persistente.
- `sesion.corte_pendiente` — `null` tras confirmación exitosa — transitorio.

**Dependencias:**
- Bloqueada por: HU-35.001 (requiere corte pendiente).
- Bloquea a: HU-35.005 (versiones viajan con el modelo), HU-35.007 (ACL).

**Integraciones:**
- Workspace / árbol de carpetas.
- Sistema de versionado (EPICA-30 §3.9).
- Sistema de permisos (EPICA-40).

**Notas de evidencia:**
- Fuente: §3.1 pasos 7–10, §4.2, §5.1.
- Frames: frame_00008 (pie con `Pegar Modelo` habilitado), frame_00013 (tooltip `Pegar Modelo`).
- Transcripción: "the warning message shall appear and when I click ok now the model is moved".
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [persistencia, workspace, pegar, mover, advertencia, dialogo-modal].

---

### HU-35.003 — Habilitar Pegar Modelo solo con corte pendiente y permisos de escritura

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U primario; P (lectura de permisos).
**Superficie UI:** dialogo-modal-cargar-modelo (botón `Pegar Modelo`).
**Gesto canónico:** ninguno (render condicionado).

**Historia:**
> Como modelador, quiero que `Pegar Modelo` aparezca deshabilitado cuando no hay corte pendiente o cuando la carpeta destino no permite escritura, para evitar intentos fallidos.

**Contexto de negocio:**
Los dos estados habilitado/deshabilitado de `Pegar Modelo` comunican pasivamente el estado del sistema: "no hay nada que pegar" vs "aquí no podés pegar". Es un eco de los invariantes de permisos (EPICA-40) y del estado de sesión (corte pendiente).

**Criterios de aceptación:**
- **Dado** que no hay corte pendiente, **cuando** miro el botón `Pegar Modelo`, **entonces** está deshabilitado (gris).
- **Dado** que hay corte pendiente y la carpeta actual permite escritura, **cuando** miro el botón, **entonces** está habilitado.
- **Dado** que hay corte pendiente pero la carpeta actual NO permite escritura, **cuando** miro el botón, **entonces** está deshabilitado.
- **Dado** que miro el pie del dialogo modal, **cuando** abro el botón `Permisos de Carpeta Actual`, **entonces** veo la matriz O/W/R sobre la carpeta actual (evidencia frame_00017 doc fuente).

**Reglas y restricciones:**
- La evaluación de permisos es en vivo — al navegar de carpeta, el estado del botón recalcula.
- Regla de permiso mínimo: `write` sobre la carpeta destino.

**Modelo de datos tocado:**
- Lectura de `folder.acl` del usuario actual — no persiste.

**Dependencias:**
- Bloqueada por: HU-35.001, HU-35.002.
- Bloqueada por: HU de EPICA-40 (sistema de permisos).

**Integraciones:**
- Sistema de permisos (EPICA-40).
- Botón `Permisos de Carpeta Actual` del pie del dialogo modal.

**Notas de evidencia:**
- Fuente: §4.1, §4.3.
- Frames: frame_00017 (`Permisos de Carpeta Actual` visible).
- Clase de afirmación: observado (estado enabled/disabled) + inferido (regla de permiso de escritura, por analogía con 31-persistencia-folders).

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, workspace, pegar, permisos, validación].

---

### HU-35.004 — Mover modelo por arrastrar-y-soltar entre tiles

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U primario; P (persiste mismo cambio que pegado).
**Superficie UI:** dialogo-modal-cargar-modelo (vista de íconos: tiles de modelos y carpetas).
**Gesto canónico:** arrastrar el tile del modelo sobre el tile de una carpeta destino.

**Historia:**
> Como modelador experto, quiero arrastrar el tile de un modelo sobre el tile de una carpeta destino para mover el modelo con un solo gesto cuando ambos son visibles simultáneamente.

**Contexto de negocio:**
El arrastrar-y-soltar es la afordancia directa cuando origen y destino están en la misma vista (misma carpeta padre en vista de íconos). Reduce la fricción del flujo Cortar/Pegar de 3 gestos a 1 cuando el contexto lo permite. No reemplaza a Cortar/Pegar, lo complementa.

**Criterios de aceptación:**
- **Dado** que estoy en vista de íconos con un modelo y una carpeta destino visibles, **cuando** arrastro el tile del modelo sobre el tile de la carpeta, **entonces** se dispara la misma advertencia de confirmación que en `Pegar Modelo`.
- **Dado** que confirmo la advertencia, **cuando** se completa, **entonces** el modelo se aloja dentro de la carpeta destino y desaparece del nivel actual.
- **Dado** que cancelo la advertencia, **cuando** cierro, **entonces** el modelo permanece en su posición original.
- **Dado** que arrastro sobre una carpeta sin permiso de escritura, **cuando** suelto, **entonces** la operación se rechaza (feedback visual: no-permitido).
- **Dado** que arrastro fuera de cualquier tile válido, **cuando** suelto, **entonces** no ocurre nada.

**Reglas y restricciones:**
- El arrastrar-y-soltar es alternativa, no reemplazo, de Cortar/Pegar.
- Comportamiento cuando la carpeta destino NO es visible (requiere scroll o cambio de breadcrumb durante el arrastre): **pregunta abierta** (§11.4 fuente).

**Modelo de datos tocado:**
- Mismo shape que HU-35.002 (cambio de `model.folder_id` + versiones + autoguardados).

**Dependencias:**
- Bloqueada por: HU-35.002 (comparte pipeline de advertencia + pegado).
- Bloquea a: (nada; es alternativa).

**Integraciones:**
- Diálogo `Cargar Modelo` (EPICA-30).
- Sistema de permisos (EPICA-40).

**Notas de evidencia:**
- Fuente: §3.2.
- Transcripción: "alternative to cut/paste when source and destination are visible at once" (Intro 42).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [persistencia, workspace, arrastrar, mover, dialogo-modal].

---

### HU-35.005 — Arrastrar versiones y autoguardados junto al modelo movido

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** P.
**Superficie UI:** ninguna directa (efecto invisible del mover hasta activar `Mostrar Versiones`).
**Gesto canónico:** ninguno (efecto lateral de HU-35.002).

**Historia:**
> Como modelador, quiero que al mover un modelo su historial de versiones y sus autoguardados migren con él para no perder trazabilidad ni respaldos.

**Contexto de negocio:**
El principio de identidad del modelo es que sus versiones y autoguardados **pertenecen** al modelo, no a la carpeta. Un mover que dejara el historial atrás rompería el principio y forzaría al usuario a reorganizar manualmente. OPCloud lo resuelve migrando la carpeta derivada `<Modelo> Versions` y todos sus contenidos como efecto automático del pegado.

**Criterios de aceptación:**
- **Dado** que un modelo `M` tiene versiones y autoguardados en `Carpeta/M Versions`, **cuando** muevo `M` a otra carpeta `Destino`, **entonces** al completarse el pegado, `Destino` contiene también `M Versions` con idéntico contenido.
- **Dado** que completé el mover, **cuando** activo `Mostrar Versiones` en el dialogo modal y navego a `Destino`, **entonces** veo la subcarpeta `M Versions` con todas las versiones originales.
- **Dado** que completé el mover, **cuando** navego a la carpeta origen, **entonces** ya no existe la carpeta `M Versions` allí.
- **Dado** que completé el mover, **cuando** abro el modelo y uso `Comparar Modelos`, **entonces** puedo comparar contra las versiones migradas sin pérdida.

**Reglas y restricciones:**
- No hay opción observada para "mover sin historial" — versiones y autoguardados siempre viajan.
- La política de retención de 12 snapshots (EPICA-30 §3.9) se mantiene intacta tras el mover.

**Modelo de datos tocado:**
- `model.versions.folder_id` — actualización en bloque — persistente.
- `model.autosaves.folder_id` — actualización en bloque — persistente.

**Dependencias:**
- Bloqueada por: HU-35.002.
- Relaciona: EPICA-30 §3.9 (retención), §7.8 (Comparar Modelos).

**Integraciones:**
- Sistema de versiones (EPICA-30).
- Sistema de autoguardados (EPICA-30).
- `Comparar Modelos` (EPICA-30 §7.8).

**Notas de evidencia:**
- Fuente: §3.1 paso 11, §6.1, §7.2, §9.
- Frames: frame_00015 (tras el mover, `<Modelo> Versions` visible en destino).
- Transcripción: "the folder `<Modelo> Versions` travels with the model" (Intro 42).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, workspace, mover, versiones, autoguardado].

---

### HU-35.006 — Ver carpeta `<Modelo> Versions` post-mover con Mostrar Versiones activado

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U primario; P (lectura estructura).
**Superficie UI:** dialogo-modal-cargar-modelo (alternador `Mostrar Versiones` en cabecera).
**Gesto canónico:** clic en alternador.

**Historia:**
> Como modelador experto, quiero activar `Mostrar Versiones` después de un mover para verificar que la carpeta `<Modelo> Versions` está efectivamente en la carpeta destino.

**Contexto de negocio:**
El alternador `Mostrar Versiones` condiciona la **visibilidad** en el dialogo modal (no el comportamiento del mover). Sin él, la carpeta destino puede parecer contener solo el modelo, ocultando la subcarpeta de versiones. Activarlo después de un mover es el gesto de verificación canónico.

**Criterios de aceptación:**
- **Dado** que completé un mover y `Mostrar Versiones` está desactivado, **cuando** navego al destino, **entonces** veo solo el modelo movido.
- **Dado** que activo `Mostrar Versiones`, **cuando** miro la misma carpeta, **entonces** aparece adicionalmente la subcarpeta `<Modelo> Versions`.
- **Dado** que `Mostrar Versiones` está activado, **cuando** entro a `<Modelo> Versions`, **entonces** veo las versiones individuales con fecha y autor (evidencia frame_00015: `12-06-2023 8:45:46`).
- **Dado** que desactivo `Mostrar Versiones`, **cuando** miro la carpeta, **entonces** la subcarpeta se oculta de nuevo.

**Reglas y restricciones:**
- El alternador afecta solo la visualización, nunca el modelo de datos.
- Por defecto: `Mostrar Versiones` desactivado al abrir el dialogo modal.

**Modelo de datos tocado:**
- `sesion.show_versions` — bool — transitorio.

**Dependencias:**
- Bloqueada por: HU-35.005 (versiones ya movidas).
- Relaciona: EPICA-30 (alternador nativo del dialogo modal Cargar).

**Integraciones:**
- Diálogo `Cargar Modelo` (EPICA-30).

**Notas de evidencia:**
- Fuente: §3.1 paso 11, §5.1, §9.
- Frames: frame_00015.
- Clase de afirmación: observado + confirmado.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [persistencia, workspace, versiones, mostrar-versiones, alternador].

---

### HU-35.007 — Preservar ACL del modelo y unir permisos con carpeta destino

**Actor primario:** AO (admin de organización).
**Actores secundarios:** ME, CO.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** P primario; C (semántica de permisos).
**Superficie UI:** implícita (efecto sobre ACL).
**Gesto canónico:** ninguno (efecto lateral del pegado).

**Historia:**
> Como admin de organización, quiero que al mover un modelo sus permisos propios se preserven y se unan con los heredables de la carpeta destino para no sorprender al equipo con cambios de acceso silenciosos.

**Contexto de negocio:**
La política observada ("los permisos del origen se unen a los del destino") es análoga a la de mover de carpetas y garantiza que ningún usuario pierda acceso silenciosamente. La unión es siempre conservadora (suma de accesos, nunca resta) — decisión de seguridad relevante en workspaces compartidos.

**Criterios de aceptación:**
- **Dado** que un modelo `M` tiene ACL propio `{user_a: W, user_b: R}` y la carpeta destino `D` tiene ACL `{user_c: R}`, **cuando** completo el mover, **entonces** los permisos efectivos sobre `M` en `D` son la unión: `{user_a: W, user_b: R, user_c: R}`.
- **Dado** que la carpeta destino otorga mayor acceso a `user_b` que el ACL propio del modelo, **cuando** completo el mover, **entonces** el acceso efectivo es el mayor de los dos (no se regresa).
- **Dado** que completé el mover, **cuando** consulto `Permisos de Carpeta Actual` sobre el modelo, **entonces** refleja la matriz unificada.

**Reglas y restricciones:**
- La unión es conservadora (máximo por usuario), nunca restrictiva.
- La regla es análoga a mover de carpetas (EPICA-31 §3.5).
- El ACL propio del modelo se preserva; no se "colapsa" al ACL de la nueva carpeta.

**Modelo de datos tocado:**
- `model.acl` — mapa `{user_id → permiso}` — persistente, preservado.
- `folder.acl` — mapa — leído, no mutado.

**Dependencias:**
- Bloqueada por: HU-35.002.
- Relaciona: EPICA-40 (sistema de permisos completo), EPICA-31 (analogía con mover de carpetas).

**Integraciones:**
- Sistema de permisos (EPICA-40).
- Sistema de carpetas (EPICA-31).

**Notas de evidencia:**
- Fuente: §3.3, §6.1, §7.3.
- Transcripción: política "unión" observada en mover de carpetas; por analogía aplicada aquí.
- Clase de afirmación: inferido por analogía (confirmado en carpetas; análogo en modelos).

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [persistencia, workspace, permisos, acl, mover, integración-EPICA-40].

---

### HU-35.008 — Abrir diálogo Buscar Cosas del Modelo con Ctrl+F

**Actor primario:** ME.
**Actores secundarios:** MN (también lo usa cuando el modelo crece).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U primario; L (lente de búsqueda) secundario.
**Superficie UI:** dialogo-modal-buscar-cosas-modelo.
**Gesto canónico:** atajo `Ctrl+F`.

**Historia:**
> Como modelador experto, quiero abrir `Buscar Cosas del Modelo` con `Ctrl+F` para localizar cosas en modelos con muchos OPDs sin depender del árbol OPD.

**Contexto de negocio:**
`Ctrl+F` es el atajo universal de búsqueda intra-documento. En modelos OPM grandes, con decenas de OPDs y cientos de cosas, el árbol OPD se vuelve insuficiente — el modelador no sabe de antemano en qué OPD vive una cosa particular. La búsqueda por nombre es el atajo cognitivo adecuado.

**Criterios de aceptación:**
- **Dado** que hay un modelo cargado y el foco está en el canvas o en un área sin captura propia del atajo, **cuando** presiono `Ctrl+F`, **entonces** se abre el diálogo `Buscar Cosas del Modelo` centrado sobre el canvas.
- **Dado** que el diálogo se abre, **cuando** carga por primera vez, **entonces** el dropdown de tipo muestra `Todos los Elementos` y el campo `Buscar por nombre` está vacío y con foco.
- **Dado** que el diálogo se abre, **cuando** carga, **entonces** la tabla `Elemento | Ubicación` muestra todas las cosas del modelo (ninguna filtrada).
- **Dado** que el diálogo ya está abierto, **cuando** presiono `Ctrl+F` de nuevo, **entonces** NO se abre un segundo diálogo (idempotencia, hipótesis por consistencia UX).

**Reglas y restricciones:**
- El atajo opera sobre el modelo cargado en memoria; no requiere persistencia (hipótesis §4.4 fuente).
- Captura del atajo: solo cuando el foco NO está en un campo de texto editable que ya lo use.

**Modelo de datos tocado:**
- Ninguno persistente; solo lectura del modelo y construcción de índice transitorio (ver HU-35.012).

**Dependencias:**
- Bloqueada por: HU de EPICA-30 (modelo cargado).
- Bloquea a: HU-35.010, HU-35.011, HU-35.012, HU-35.014.

**Integraciones:**
- Sistema de atajos (EPICA-90).
- Modelo cargado (EPICA-30).

**Notas de evidencia:**
- Fuente: §3.4 paso 1, §8.
- Transcripción: "Ctrl+F opens the Model Things Searching dialog" (Intro 17).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [buscar, atajo, intra-modelo, dialogo-modal, ctrl-f].

---

### HU-35.009 — Abrir diálogo Buscar Cosas del Modelo desde barra de herramientas secundaria

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U.
**Superficie UI:** barra-herramientas-secundaria (botón de búsqueda zona izquierda-centro).
**Gesto canónico:** clic en botón.

**Historia:**
> Como modelador novato, quiero abrir la búsqueda desde un botón visible en la barra de herramientas secundaria para no depender de recordar el atajo `Ctrl+F`.

**Contexto de negocio:**
Los novatos rara vez conocen los atajos. Tener un botón visible en la barra de herramientas es la afordancia descubrible, complementaria a `Ctrl+F` para expertos. Ambos puntos de entrada deben abrir el mismo diálogo en el mismo estado inicial.

**Criterios de aceptación:**
- **Dado** que miro la barra de herramientas secundaria, **cuando** está habilitado el modelo, **entonces** veo un botón de búsqueda en la zona izquierda-centro.
- **Dado** que hago clic en el botón, **cuando** reacciona, **entonces** se abre el mismo diálogo `Buscar Cosas del Modelo` que con `Ctrl+F` (mismo estado inicial).
- **Dado** que hover sobre el botón, **cuando** se muestra el tooltip, **entonces** aclara `Buscar Cosas` o equivalente.

**Reglas y restricciones:**
- El botón siempre está visible cuando hay un modelo cargado.
- El estado inicial del diálogo es idéntico al de HU-35.008.

**Modelo de datos tocado:**
- Mismo que HU-35.008.

**Dependencias:**
- Bloqueada por: HU de EPICA-30.
- Bloquea a: HU-35.010+.

**Integraciones:**
- Barra de herramientas secundaria.

**Notas de evidencia:**
- Fuente: §2 tabla (`Botón Buscar Cosas`), §3.4 paso 1.
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [buscar, barra-herramientas, intra-modelo, dialogo-modal].

---

### HU-35.010 — Filtrar resultados incrementalmente por nombre (subcadena)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** L primario; U (input) secundario.
**Superficie UI:** dialogo-modal-buscar-cosas-modelo (campo `Buscar por nombre`).
**Gesto canónico:** tecleo en input.

**Historia:**
> Como modelador, quiero filtrar incrementalmente la tabla de resultados mientras escribo el nombre para encontrar cosas con pocas letras y sin presionar Enter.

**Contexto de negocio:**
El filtro incremental es la gramática de búsqueda moderna. En un modelo con cientos de cosas, empezar a escribir `tur` debe reducir la tabla a `Turbojet*`, `Temperature`, etc. en tiempo real. Presionar Enter sería una fricción innecesaria.

**Criterios de aceptación:**
- **Dado** que la tabla muestra todas las cosas del modelo, **cuando** escribo `tur` en el campo `Buscar por nombre`, **entonces** la tabla filtra a las cosas cuyo nombre contiene `tur` (subcadena).
- **Dado** que la tabla ya está filtrada, **cuando** agrego más caracteres (`turb`), **entonces** la tabla se re-filtra en vivo sin perder posición del scroll si aplica.
- **Dado** que borro caracteres, **cuando** queda `tu`, **entonces** la tabla se re-expande con más resultados.
- **Dado** que dejo el campo vacío, **cuando** miro la tabla, **entonces** se muestran todas las cosas del modelo (sin filtro).
- **Dado** que escribo `TUR` vs `tur`, **cuando** comparo resultados: la distinción mayúsculas/minúsculas es **pregunta abierta** (§5.2, §11.5 fuente).

**Reglas y restricciones:**
- Subcadena (contiene), no solo prefijo ni difusa.
- Distinción mayúsculas/minúsculas: inferido insensible a mayúsculas por analogía estándar (no verificado con caso límite).
- Normalización Unicode (acentos): no testada.
- No hay regex ni comodines observados (§5.2 fuente).

**Modelo de datos tocado:**
- `sesion.search.query` — string — transitorio.

**Dependencias:**
- Bloqueada por: HU-35.008 o HU-35.009.
- Bloquea a: HU-35.012 (tabla de resultados).

**Integraciones:**
- Motor de filtrado (implementación en `src/ui/buscar/` o análogo).

**Notas de evidencia:**
- Fuente: §3.4 paso 4, §5.2.
- Frames: frames 00003–00006 carpeta 16 (progresivo vaciado al tipear).
- Clase de afirmación: observado (filtrado incremental) + inferido (case-insensitive).
- Etiqueta: `requires-clarification` sobre case-sensitivity y Unicode.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [buscar, filtro, subcadena, incremental, requires-clarification].

---

### HU-35.011 — Filtrar resultados por tipo Todos/Procesos/Objetos

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** L primario; U (dropdown) secundario.
**Superficie UI:** dialogo-modal-buscar-cosas-modelo (dropdown esquina superior izquierda).
**Gesto canónico:** selección en dropdown.

**Historia:**
> Como modelador, quiero filtrar la búsqueda por tipo (Todos los Elementos / Procesos / Objetos) para reducir la tabla cuando sé qué clase de cosa busco.

**Contexto de negocio:**
OPM tiene dos primitivas Cosa (Proceso, Objeto). En modelos grandes, filtrar por tipo es la forma más rápida de reducir ruido. El dropdown ofrece exactamente 3 opciones fijas: `Todos los Elementos` (por defecto), `Procesos`, `Objetos`.

**Criterios de aceptación:**
- **Dado** que el dropdown está en `Todos los Elementos`, **cuando** cambio a `Procesos`, **entonces** la tabla muestra solo Procesos (y sus apariciones) que coinciden con el filtro de nombre actual.
- **Dado** que selecciono `Objetos`, **cuando** reacciona, **entonces** la tabla muestra solo Objetos.
- **Dado** que vuelvo a `Todos los Elementos`, **cuando** reacciona, **entonces** la tabla incluye Procesos y Objetos.
- **Dado** que el filtro de nombre y el filtro de tipo están ambos activos, **cuando** aplican, **entonces** se combinan por `AND` (nombre contiene Y tipo coincide).

**Reglas y restricciones:**
- Dropdown con 3 opciones fijas (no extensible a estados u otros elementos OPM según §5.2 fuente).
- Por defecto: `Todos los Elementos`.
- La comunicación con el filtro de nombre es `AND`.
- Comportamiento sobre apariciones in-zoomed de un proceso refinado: **pregunta abierta** (§11.9 fuente).

**Modelo de datos tocado:**
- `sesion.search.tipo` — `"all" | "process" | "object"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-35.008 o HU-35.009.
- Bloquea a: HU-35.012.

**Integraciones:**
- Motor de filtrado.

**Notas de evidencia:**
- Fuente: §2 tabla (`Selector de tipo`), §3.4 paso 3, §5.2.
- Frames: frame_00002 carpeta 16 (`Todos los Elementos` visible).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [buscar, filtro, tipo, dropdown].

---

### HU-35.012 — Ver tabla Elemento | Ubicación con una fila por aparición

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** L primario; V (render tabla) secundario.
**Superficie UI:** dialogo-modal-buscar-cosas-modelo (cuerpo de la tabla).
**Gesto canónico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero ver una fila por cada aparición de la cosa en cada OPD para navegar directamente al contexto donde vive, no solo a la entidad lógica.

**Contexto de negocio:**
Una cosa OPM puede aparecer en múltiples OPDs (instancias visuales de la misma entidad lógica, principio "entidad única, múltiples apariencias" — EPICA-17). La búsqueda debe exponer esas **apariciones** como unidades navegables, no colapsarlas en una sola fila. El frame_00002 del doc fuente muestra `Turbojet Engine System {tes}` con 4 filas distintas (`SD`, `Turbojet Engine Operating`, `Stagnation Pressure Recovering`, `Turbojet Engine System {tes}`).

**Criterios de aceptación:**
- **Dado** que una cosa aparece en 3 OPDs, **cuando** abro la búsqueda sin filtro, **entonces** la tabla muestra 3 filas para esa cosa, cada una con su `Ubicación` distinta.
- **Dado** que la cosa aparece una sola vez, **cuando** miro la tabla, **entonces** veo 1 fila.
- **Dado** que miro una fila, **cuando** la leo, **entonces** veo dos columnas: `Elemento` (nombre de la cosa) y `Ubicación` (nombre del OPD).
- **Dado** que la cosa tiene alias en llaves (ej. `Turbojet Engine System {tes}`), **cuando** aparece en la tabla, **entonces** el alias se muestra junto al nombre — comportamiento de filtrado por alias es **pregunta abierta** (§11.7 fuente).
- **Dado** que una cosa aparece N veces en el **mismo** OPD (instancias visuales múltiples), **cuando** miro la tabla: **pregunta abierta** si se muestra N filas o 1 fila agrupada (§11.6 fuente).

**Reglas y restricciones:**
- Cada fila representa un par `(thing_id, opd_id)` — posiblemente `(thing_id, opd_id, visual_instance_id)` según se resuelva §11.6.
- El índice de búsqueda es **transitorio**, reconstruido en cliente a partir del modelo cargado.
- No se persiste nada del estado de la tabla al cerrar el diálogo.

**Modelo de datos tocado:**
- `indice_busqueda` — lista `{thing_id, opd_id, visual_instance_id}` — transitorio, derivado.

**Dependencias:**
- Bloqueada por: HU-35.010, HU-35.011.
- Bloquea a: HU-35.013, HU-35.014.

**Integraciones:**
- Modelo cargado (EPICA-30).
- Sistema de instancias visuales (EPICA-17).
- Árbol OPD (EPICA-20).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.4 paso 5, §6.2.
- Frames: frame_00002 carpeta 16.
- Clase de afirmación: observado + abierto (reglas de deduplicación).
- Etiqueta: `requires-clarification`.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [buscar, tabla, ubicacion, opd, apariciones, requires-clarification].

---

### HU-35.013 — Conservar color semántico del tipo en la columna Elemento

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** V.
**Superficie UI:** dialogo-modal-buscar-cosas-modelo (columna `Elemento` de la tabla).
**Gesto canónico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero que el nombre de la cosa en la tabla use el mismo color que en canvas y OPL-ES para reconocer tipo de un vistazo sin leer el dropdown de filtro.

**Contexto de negocio:**
OPM usa color semántico consistente: azul para Objeto, verde para Proceso, verde claro para Objeto-atributo. Reutilizarlo en la tabla de búsqueda refuerza la identificación del tipo y reduce carga cognitiva. Es un principio de coherencia visual entre superficies.

**Criterios de aceptación:**
- **Dado** que un Objeto `Driver` aparece en la tabla, **cuando** miro la columna `Elemento`, **entonces** su nombre se renderiza en azul (consistente con canvas).
- **Dado** que un Proceso `Turbojet Engine Operating` aparece, **cuando** miro, **entonces** su nombre se renderiza en verde.
- **Dado** que miro la fila completa, **cuando** leo, **entonces** el color solo aplica al nombre en `Elemento`, no a la columna `Ubicación`.

**Reglas y restricciones:**
- Los colores deben coincidir con los de canvas y OPL-ES (invariante visual cross-superficie).
- Ver SSOT visual (`ssot/opm-visual-es.md` V-xx) para códigos exactos.

**Modelo de datos tocado:**
- Ninguno; propiedad de render derivada de `cosa.tipo`.

**Dependencias:**
- Bloqueada por: HU-35.012.

**Integraciones:**
- SSOT visual.
- Renderizador.

**Notas de evidencia:**
- Fuente: §9 convenciones.
- Frames: frame_00002 carpeta 16.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [buscar, render, color, semantico, ssot-visual].

---

### HU-35.014 — Navegar al OPD del resultado haciendo clic en la fila

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U primario; L (navegación derivada).
**Superficie UI:** dialogo-modal-buscar-cosas-modelo (filas) + canvas-opd.
**Gesto canónico:** clic simple en fila.

**Historia:**
> Como modelador, quiero hacer clic en una fila de resultado para saltar al OPD donde vive la cosa y cerrar el diálogo en un solo gesto.

**Contexto de negocio:**
El salto inmediato al OPD destino es el resultado central de la búsqueda. Un clic confirma la elección, cierra el dialogo modal y posiciona el canvas sobre el OPD donde la cosa aparece. Es la alternativa al doble-clic sobre nodos del árbol OPD cuando el usuario no conoce la jerarquía.

**Criterios de aceptación:**
- **Dado** que la tabla muestra un resultado con `Ubicación = Turbojet Engine Operating`, **cuando** hago clic en la fila, **entonces** el dialogo modal se cierra y el canvas cambia al OPD `Turbojet Engine Operating`.
- **Dado** que salto al nuevo OPD, **cuando** miro el canvas, **entonces** está posicionado sobre ese OPD.
- **Dado** que hago clic sobre una fila seleccionada (banda azul oscuro), **cuando** ocurre el clic, **entonces** la navegación es inmediata.
- **Dado** que el salto ocurre, **cuando** miro el árbol OPD, **entonces** el nodo del OPD destino queda marcado como activo.

**Reglas y restricciones:**
- Un solo clic basta (no requiere doble-clic).
- Tras el salto, la marca visual sobre la cosa hallada: **pregunta abierta** deliberada (§7.7, §11.1 fuente, ver HU-35.018).
- La navegación es equivalente al doble-clic sobre un nodo del árbol OPD (EPICA-20).

**Modelo de datos tocado:**
- `sesion.opd_activo` — UUID — transitorio.

**Dependencias:**
- Bloqueada por: HU-35.012.
- Bloquea a: HU-35.018, HU-35.020.

**Integraciones:**
- Árbol OPD (EPICA-20).
- Panel OPL-ES (HU-35.020).
- Renderizador.

**Notas de evidencia:**
- Fuente: §3.4 paso 6, §7.4.
- Frames: frame_00004 (fila seleccionada), frame_00007 (canvas tras el salto).
- Clase de afirmación: observado + confirmado.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [buscar, navegacion, opd, salto, clic].

---

### HU-35.015 — Cerrar el diálogo sin navegar con Cerrar o ESC

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U.
**Superficie UI:** dialogo-modal-buscar-cosas-modelo (botón `Cerrar` en pie).
**Gesto canónico:** clic en botón `Cerrar` o tecla `ESC`.

**Historia:**
> Como modelador, quiero cerrar el diálogo de búsqueda sin navegar para cancelar una búsqueda en curso sin efectos sobre el canvas.

**Contexto de negocio:**
La búsqueda debe ser cancelable sin costo. Si el usuario abrió el diálogo por error, o si la búsqueda confirmó que la cosa no existe, debe poder cerrar y continuar en el OPD actual sin salto accidental.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto, **cuando** hago clic en `Cerrar`, **entonces** el dialogo modal se cierra y el canvas permanece en el OPD original.
- **Dado** que el diálogo está abierto, **cuando** presiono `ESC`, **entonces** el dialogo modal se cierra igual que con `Cerrar` (inferido por convención estándar).
- **Dado** que cerré el diálogo, **cuando** lo reabro, **entonces** el estado de filtro y consulta NO se conserva (nuevo estado inicial) — **pregunta abierta** si persiste historial.

**Reglas y restricciones:**
- Cerrar y ESC son equivalentes.
- Cancelar no produce efectos laterales sobre canvas ni modelo.
- No hay historial de búsquedas observado (§5.2 fuente).

**Dependencias:**
- Bloqueada por: HU-35.008 o HU-35.009.

**Integraciones:**
- Sistema de dialogos modales.

**Notas de evidencia:**
- Fuente: §3.6, §2 tabla.
- Clase de afirmación: observado (Cerrar) + inferido (ESC).

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [buscar, dialogo-modal, cierre, cancelar, esc].

---

### HU-35.016 — Filtrar panel Cosas OPM Arrastrables con campo Buscar lateral

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** L primario; U (input).
**Superficie UI:** panel-lateral-izquierdo (Cosas OPM Arrastrables, fila superior con campo `Buscar`).
**Gesto canónico:** tecleo en input lateral.

**Historia:**
> Como modelador, quiero filtrar el panel `Cosas OPM Arrastrables` escribiendo en el campo de búsqueda lateral para encontrar cosas reutilizables sin abrir el dialogo modal.

**Contexto de negocio:**
El panel lateral es una **vista del modelo** (no una paleta estática — EPICA-10 HU-10.017). Filtrarlo por nombre es la versión inline y siempre-visible de la búsqueda, complementaria al dialogo modal. Útil para el modelador que quiere arrastrar una cosa existente a otro OPD.

**Criterios de aceptación:**
- **Dado** que el panel lateral está visible con una lista de cosas, **cuando** escribo `tur` en el campo `Buscar`, **entonces** la lista se reduce a las cosas cuyo nombre contiene `tur` (frame_00011 carpeta 16 lo confirma: `Temperature`, `Turbojet Engine`, `Turbojet Engine System`, `Temptature Calculating`).
- **Dado** que borro el campo, **cuando** queda vacío, **entonces** la lista completa vuelve.
- **Dado** que escribo en el panel lateral, **cuando** aplica, **entonces** el diálogo `Buscar Cosas del Modelo` NO se abre (son búsquedas separadas).
- **Dado** que hago clic en un ícono ojo adyacente al campo, **cuando** activa, **entonces** alterna la visibilidad de las cosas de la lista (no cubierto aquí, delegado a EPICA-10).

**Reglas y restricciones:**
- El filtro del panel es independiente del filtro del dialogo modal.
- Distinción mayúsculas/minúsculas análoga a HU-35.010 (insensible a mayúsculas inferido).
- Panel siempre lista entidades lógicas, una por `thing_id` (no apariciones).

**Modelo de datos tocado:**
- `panel.filtro` — string — transitorio.

**Dependencias:**
- Relaciona: EPICA-10 HU-10.017 (panel como vista del modelo).
- Bloquea a: HU-35.017.

**Integraciones:**
- Panel lateral biblioteca.

**Notas de evidencia:**
- Fuente: §2 tabla (`Campo Buscar del panel`), §3.5 paso 1, §7.5.
- Frames: frame_00011 carpeta 16.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [buscar, panel-lateral, filtro, biblioteca, cosas-arrastrables].

---

### HU-35.017 — Abrir búsqueda pre-cargada desde panel lateral vía clic derecho

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U primario; L.
**Superficie UI:** panel-lateral-izquierdo (menú contextual sobre entrada) → dialogo-modal-buscar-cosas-modelo.
**Gesto canónico:** clic derecho sobre entrada del panel + clic en opción `Buscar`.

**Historia:**
> Como modelador experto, quiero abrir el diálogo `Buscar Cosas del Modelo` ya pre-filtrado al nombre de una cosa haciendo clic derecho sobre ella en el panel lateral, para ver sus apariciones en todos los OPDs.

**Contexto de negocio:**
El panel muestra la entidad lógica sin apariciones. Si el modelador quiere saber **dónde** se usa, el atajo natural es clic derecho → `Buscar` que abre el dialogo modal con el filtro pre-cargado. Integra las dos entradas de búsqueda (panel + diálogo) en un solo flujo.

**Criterios de aceptación:**
- **Dado** que hago clic derecho sobre una entrada del panel (ej. `Turbojet Engine System`), **cuando** aparece el menú contextual, **entonces** veo una opción `Buscar`.
- **Dado** que hago clic en `Buscar`, **cuando** reacciona, **entonces** se abre el diálogo `Buscar Cosas del Modelo` con el campo `Buscar por nombre` pre-cargado a `Turbojet Engine System`.
- **Dado** que el dialogo modal se abre pre-cargado, **cuando** miro la tabla, **entonces** muestra solo las apariciones de esa cosa en todos los OPDs donde aparece.
- **Dado** que el dialogo modal está pre-cargado, **cuando** modifico el filtro, **entonces** se comporta como búsqueda normal (HU-35.010).

**Reglas y restricciones:**
- La opción `Buscar` del menú contextual existe solo sobre entradas válidas (no sobre zonas vacías del panel).
- El filtro pre-cargado usa el nombre exacto (sin llaves/alias) por defecto.

**Modelo de datos tocado:**
- `sesion.search.query` — pre-cargado con el nombre — transitorio.

**Dependencias:**
- Bloqueada por: HU-35.016, HU-35.008/009, HU-35.010.
- Relaciona: EPICA-10 HU-10.017.

**Integraciones:**
- Panel lateral + diálogo búsqueda.
- Sistema de menús contextuales.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.5 paso 2, §7.5.
- Transcripción: "right-click on a row in the panel opens a Search option" (Intro 15).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [buscar, panel-lateral, menu-contextual, integracion, clic-derecho].

---

### HU-35.018 — Decidir la política de marca visual post-salto de búsqueda

**Actor primario:** MN (principal beneficiario de feedback visual).
**Actores secundarios:** ME, IS (ingeniero de simulación — por reserva V-53/V-54).
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** V primario; C (política).
**Superficie UI:** canvas-opd (render post-salto).
**Gesto canónico:** ninguno.

**Historia:**
> Como modelador, quiero una decisión de diseño sobre si hay marca visual sobre la cosa hallada tras el salto de búsqueda, para saber si ubicarla con la vista o si el canvas me lo señala.

**Contexto de negocio:**
OPCloud opta deliberadamente por **no marcar** la cosa tras el salto, preservando la reserva de vocabulario visual V-53/V-54 para simulación (cambio de borde/relleno). Esta decisión protege la semántica de resaltado como exclusiva de simulación. En modelos grandes, sin embargo, sin marca el modelador debe escanear el OPD — fricción documentada. Esta HU pide decidir explícitamente la política del repo: mantener la reserva (no marca) o introducir una codificación no colisionante (ej. glow exterior transitorio, contorno punteado ≤2s).

**Criterios de aceptación:**
- **Dado** que se adopta la política "sin marca" (mimética a OPCloud), **cuando** salto a un OPD, **entonces** el canvas queda posicionado sobre el OPD pero no se distingue la cosa hallada con estilo extra.
- **Dado** que se adopta la política "marca transitoria no-colisionante", **cuando** salto, **entonces** la cosa recibe un glow exterior (o equivalente) de duración ≤2 segundos que desaparece automáticamente.
- **Dado** que se adopta la política "marca transitoria", **cuando** ocurre, **entonces** el estilo elegido NO colisiona con V-53/V-54 (no puede ser cambio de borde ni de relleno reservados a simulación).
- **Dado** que se adopta cualquiera de las políticas, **cuando** se documenta, **entonces** queda registrado en `ssot/opm-visual-es.md` con un V-xx nuevo.

**Reglas y restricciones:**
- Opción 1 (sin marca): mimética a OPCloud, respeta reserva absoluta, sacrifica feedback rápido.
- Opción 2 (marca transitoria no-colisionante): mejora UX a costa de abrir vocabulario nuevo.
- La decisión es de diseño explícita, no automática.

**Modelo de datos tocado:**
- Eventualmente `render.highlight_transitorio` — `{thing_id, ttl}` — transitorio UI.

**Dependencias:**
- Bloqueada por: HU-35.014.
- Relaciona: EPICA-B0 (simulación) por reserva V-53/V-54.

**Integraciones:**
- SSOT visual.
- Renderizador JointJS.
- Simulación (EPICA-B0).

**Notas de evidencia:**
- Fuente: §7.7, §11.1.
- Clase de afirmación: observado (sin marca en OPCloud) + abierto (política repo).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [buscar, render, v-53, reserva-vocabulario, politica, requires-clarification].

---

### HU-35.019 — Mostrar tabla vacía silenciosa cuando no hay resultados

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** U primario; L.
**Superficie UI:** dialogo-modal-buscar-cosas-modelo (tabla).
**Gesto canónico:** ninguno (render condicionado).

**Historia:**
> Como modelador, quiero que la tabla quede vacía sin mensaje explícito cuando mi filtro no produce resultados, para confirmar rápido que la cosa no existe bajo ese nombre.

**Contexto de negocio:**
OPCloud no muestra mensaje "sin resultados" explícito — la tabla simplemente queda vacía. Es una señal negativa suficiente en contextos de filtro incremental (el usuario ve cómo la tabla se reduce letra a letra hasta vaciarse). Añadir un mensaje sería sobre-ingeniería para el flujo observado.

**Criterios de aceptación:**
- **Dado** que escribo un filtro que no coincide con ninguna cosa del modelo, **cuando** la tabla se re-filtra, **entonces** queda sin filas, sin mensaje "sin resultados".
- **Dado** que la tabla queda vacía, **cuando** borro caracteres hasta volver a obtener coincidencias, **entonces** la tabla se re-puebla en vivo.
- **Dado** que el modelo no tiene cosas, **cuando** abro el diálogo sin filtro, **entonces** la tabla aparece vacía (caso trivial).

**Reglas y restricciones:**
- No se muestra mensaje tipo "sin resultados" (observado).
- Silencio es coherente con filtrado incremental.
- Alternativa (mostrar placeholder tenue tipo "Sin resultados") es **decisión de repo**, no observada en OPCloud.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-35.012.

**Integraciones:**
- Tabla de resultados.

**Notas de evidencia:**
- Fuente: §4.5.
- Frames: frames 00003–00006 carpeta 16 (progresivo vaciado).
- Clase de afirmación: observado + inferido (comportamiento estándar).

**Prioridad:** C.
**Tamaño:** XS.
**Etiquetas:** [buscar, ui, empty-state].

---

### HU-35.020 — Actualizar panel OPL-ES al saltar al OPD del resultado

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Fuente:** opcloud-reverse/35-persistencia-move-search.md.
**Nivel categórico:** L primario; V.
**Superficie UI:** panel-opl-es (inferior).
**Gesto canónico:** ninguno (actualización automática post-salto).

**Historia:**
> Como modelador novato, quiero que el panel OPL-ES muestre las oraciones del OPD al que salto para leer la semántica del nuevo contexto de inmediato.

**Contexto de negocio:**
El panel OPL-ES es el eco narrativo del OPD activo. Tras un salto de búsqueda, la convención es que el OPL-ES refleje el nuevo OPD — coherente con el principio de que el OPL-ES es siempre **del OPD visible**, no del modelo entero. Esto da orientación rápida al modelador en el nuevo contexto.

**Criterios de aceptación:**
- **Dado** que estaba viendo el OPD `SD` y salto al OPD `Turbojet Engine Operating` via búsqueda, **cuando** completa el salto, **entonces** el panel OPL-ES actualiza su contenido a las oraciones del nuevo OPD.
- **Dado** que el OPL-ES se actualiza, **cuando** leo, **entonces** refleja fielmente las cosas y enlaces del OPD activo (no del anterior).
- **Dado** que el diálogo se cerró y el salto terminó, **cuando** miro el OPL-ES, **entonces** la actualización es inmediata (sin demora perceptible).

**Reglas y restricciones:**
- El OPL-ES siempre refleja el OPD activo, invariante del repo.
- La actualización no es un efecto lateral de la búsqueda sino del cambio de OPD (reuso del pipeline estándar).

**Modelo de datos tocado:**
- Ninguno persistente; solo re-render del OPL-ES.

**Dependencias:**
- Bloqueada por: HU-35.014.
- Relaciona: EPICA-50 (panel OPL-ES).

**Integraciones:**
- Motor OPL-ES (`src/render/opl-renderer.ts`).
- Panel OPL-ES.

**Notas de evidencia:**
- Fuente: §7.6.
- Frames: frames 00007, 00011 carpeta 16 (OPL-ES refleja nuevo OPD).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [buscar, opl-es, navegacion, integracion, pipeline-estandar].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q35.1**: Política de marca visual post-búsqueda — ¿sin marca (mimético a OPCloud, preserva reserva V-53/V-54), o marca transitoria no-colisionante? Decisión de diseño pendiente (cf. HU-35.018). Etiqueta: `requires-clarification`.
- **Q35.2**: Anotaciones sticky note (frame_00011) — ¿parte del modelo exportable? ¿Viajan en guardar/cargar? ¿Se imprimen en PDF/SVG? No observado. Candidata a HU separada en EPICA-42 (colaboracion-notes).
- **Q35.3**: Corte pendiente tras cancelar el dialogo modal `Cargar Modelo` — ¿se preserva o se descarta al cerrar? No observado (cf. HU-35.001).
- **Q35.4**: Arrastrar-y-soltar sobre carpeta no visible (scroll / cambio de breadcrumb durante arrastre) — ¿cómo se maneja? No observado (cf. HU-35.004).
- **Q35.5**: Distinción mayúsculas/minúsculas del filtro `Buscar por nombre` + normalización Unicode (acentos) — no verificado (cf. HU-35.010). Etiqueta: `requires-clarification`.
- **Q35.6**: Deduplicación en tabla de resultados — si una cosa aparece N veces en el **mismo** OPD (instancias visuales múltiples), ¿N filas o 1 fila agrupada? (cf. HU-35.012). Frame_00002 sugiere que instancias refinadas cuentan como ubicación propia, pero la regla exacta no está clara. Etiqueta: `requires-clarification`.
- **Q35.7**: Búsqueda por alias (`{tes}`) vs nombre canónico (`Turbojet Engine System`) — ¿el filtro indexa alias o solo nombre? No observado (cf. HU-35.012).
- **Q35.8**: Pegar Modelo en carpeta origen (misma carpeta) — ¿rechazado, sin-operación, o crea duplicado? No observado (cf. HU-35.002).
- **Q35.9**: Filtro `Procesos` sobre apariciones in-zoomed de un proceso refinado — ¿excluye o incluye las apariciones dentro del in-zoom? No observado (cf. HU-35.011).
- **Q35.10**: Historial de búsquedas — no hay evidencia de persistencia entre aperturas del dialogo modal; HU de historial queda como candidata diferida si se decide implementarla (delegada a evolución del repo, no HU emitida en esta épica).

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/35-persistencia-move-search.md`.
- Épicas relacionadas:
  - **EPICA-30** (persistencia-save-load): dialogo modal `Cargar Modelo` base, alternador `Mostrar Versiones`, política de retención de 12 snapshots, `Comparar Modelos`.
  - **EPICA-31** (persistencia-folders): mecanismo análogo `Cortar Carpeta` / `Pegar Carpeta`, política de unión de permisos al mover carpetas.
  - **EPICA-40** (colaboracion-permisos): ACL del modelo y de las carpetas, `Permisos de Carpeta Actual`, regla de unión conservadora.
  - **EPICA-20** (estructura-opd-tree): navegación al OPD equivalente al doble-clic sobre nodos del árbol.
  - **EPICA-10** (canvas-creacion-cosas): panel `Cosas OPM Arrastrables` como vista del modelo (HU-10.017).
  - **EPICA-17** (canvas-atributos-instancias): sistema de instancias visuales múltiples de la misma entidad lógica.
  - **EPICA-50** (opl-pane): actualización automática del OPL-ES al cambiar OPD activo.
  - **EPICA-90** (interaccion-shortcuts): atajo `Ctrl+F`.
  - **EPICA-42** (colaboracion-notes): sticky notes (§11.2 fuente).
  - **EPICA-B0** (simulation-conceptual): reserva de vocabulario visual V-53/V-54 sobre la que se decide la política de HU-35.018.
- Invariantes del repo tocados:
  - `src/persistencia/` — metadatos de workspace (`model.folder_id`, versiones, autoguardados, sesión de corte).
  - `src/ui/` — diálogo de búsqueda, panel lateral, menús contextuales.
  - `src/render/opl-renderer.ts` — actualización automática post-salto.
  - `ssot/opm-visual-es.md` — V-xx a declarar si se adopta marca transitoria (HU-35.018).
