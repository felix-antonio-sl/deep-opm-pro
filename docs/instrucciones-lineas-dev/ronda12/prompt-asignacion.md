# Prompt de asignación — Ronda 12

Plantilla genérica para invocar a un agente sobre una línea específica + invocaciones concretas + reglas duras + loop verde.

## Plantilla genérica

Copia el bloque siguiente, sustituye `{{LINEA}}` y `{{PATH_BRIEF}}`, y envíalo al agente.

```
Toma control de la línea {{LINEA}} de la ronda 12 de deep-opm-pro: ronda de CIERRE MVP-α (1 línea) + APERTURA MVP-β controlada (3 líneas) + transversales/ledger (1 línea). Ruta categorial **C asimétrica** decidida vía cat-thinking + persona steipete: coproducto disjunto entre Right-Kan-extension de Inc_α y Inc_β restringida a épicas blast-aditivo (EPICA-17 valor numérico, EPICA-1B traer conectados, EPICA-33 plantillas privadas). EPICA-32 sub-modelos peer y HU-50.019/.020/.022 parser OPL bidireccional EXPLÍCITAMENTE DIFERIDAS a rondas 13-14 dedicadas.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ ff75966 (post-ronda-11, MVP-α 91.1% ponderado, detector 92/92)

Lee primero, en este orden de jerarquía SSOT (auditoría docs/auditorias/2026-05-07-ssot-opm-extracted.md):

NIVEL 1 (autoridad obligatoria):
1. SSOT relevante en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/ según la línea (opm-iso-19450-es.md, opm-visual-es.md, opm-opl-es.md, metodologia-opm-es.md).
2. /home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/00-METODOLOGIA.md §6 (jerarquía SSOT y citas obligatorias por tipo HU).
3. /home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/06-PROVENANCE.md §2 (política operativa: reuso obligatorio SVGs/dimensiones/colores/tipografía/plantillas OPL).

NIVEL 2 (coherencia obligatoria):
4. /home/felix/projects/deep-opm-pro/app/src/modelo/tipos.ts (SSOT viva del modelo en TS).

NIVEL 3 (respaldo opcional pero recomendado):
5. /home/felix/projects/deep-opm-pro/docs/JOYAS.md (paleta canónica + dimensiones + tipografía — elevado a contrato visual obligatorio por PROVENANCE §2).
6. /home/felix/projects/deep-opm-pro/assets/svg/ (inventario iconos canónicos — reuso obligatorio por PROVENANCE §2).
7. /home/felix/projects/deep-opm-pro/opm-extracted/ dirigido a la línea: paths verificados en README §5 + grep amplio (`grep -ri "concepto-clave" opm-extracted/src/app -l`) ANTES de citar. Cualquier path no verificable con `ls`/`grep` se rechaza (RF-1 evita recurrencia).

CONTRATO HEREDADO:
8. {{PATH_BRIEF}} (brief de la línea).
9. /home/felix/projects/deep-opm-pro/docs/instrucciones-lineas-dev/ronda12/README.md (filosofía SSOT-céntrico §1 + reglas §2 + opm-extracted §5 + assets §5b + JOYAS §5c + citas SSOT §5d + colisiones §7 + merge §8 + anclaje §9).
10. /home/felix/projects/deep-opm-pro/docs/HANDOFF.md (decisiones vigentes rondas 1-11 que NO se reabren).
11. /home/felix/projects/deep-opm-pro/docs/auditorias/2026-05-07-ssot-opm-extracted.md (marco SSOT-céntrico + hallazgos RF-1..RF-4 + recomendaciones R1..R6).

Antes de codificar, captura:
- Lista exacta de archivos permitidos (§4 del brief).
- HU eje cubiertas + estado actual (§2 del brief).
- Contrato observable a preservar (APIs públicas estables, JSON lossless donde aplica, OPL invariante salvo declaradas).
- Comandos de verificación (§9 del brief).
- Decisiones que tomarás (§10 del brief).
- Assets canónicos a reusar (§5b del README + §3 del brief).

Reglas duras comunes (no negociables):

JERARQUÍA SSOT-CÉNTRICA (auditoría 2026-05-07):
1. **SSOT (nivel 1) es autoridad obligatoria**. Cada archivo nuevo o feature nueva agrega cita SSOT al header según tipo de HU: `[V-xxx]` (visual), `[Glos 3.x]` (glosario ISO 19450), `[OPL-ES …]` (OPL canónica), `[Met §x]` (metodología/etapas SD), `[JOYAS §x]` (cuando aplique visualmente). Ver README §5d para mapeo por línea. **RF-2 evita reincidencia**: EPICA-30 sin citas SSOT fue red flag de la auditoría; ronda 12 lo remedia parcialmente.
2. **`tipos.ts` (nivel 2)** es SSOT viva en TS: cualquier cambio kernel debe ser coherente con ISO-19450.
3. **JOYAS y `assets/svg/` son contrato operativo obligatorio** (PROVENANCE §2: "SVGs/dimensiones/colores/tipografía se reutilizan"). Cualquier desviación declarada con rationale.
4. **`opm-extracted/` es nivel 3 (respaldo técnico opcional)**: usar para evitar reinventar lógica destilada por OPCloud, pero NUNCA copiar 1:1 (depende de Angular/Rappid/Firebase). Reescribir en Preact + Zustand + JointJS OSS preservando la semántica. Citas opcionales pero recomendadas. **Paths verificados con `ls`/`grep` SIEMPRE** (RF-1 evita recurrencia).

ADITIVIDAD Y CONTRATOS:
5. **Aditividad**: tipos opcionales (`?:`), funciones nuevas exportadas, NO renames, NO breaks de firma pública.
6. **Scope estricto**: solo archivos permitidos. Si aparece cambio cross-line, detente y reporta.
7. **Tests existentes intactos**: 624 baseline pasa sin tocar.
8. **JSON roundtrip lossless**: cargar JSON pre-ronda 12 produce modelo válido sin pérdida. Crítico para L2 (`Entidad.valorSlot?` opcional con default `undefined`).
9. **OPL invariante donde aplica**: oraciones existentes preservadas; oraciones nuevas son aditivas. **L2 declara explícitamente la nueva oración canónica `Atributo es valor [Unidad].`**. Otras líneas no agregan oraciones.
10. **Patrón canónico (rondas 8-11)**: barrel + sub-archivos por dominio + composer overlay separado para features visuales aditivas + slices Zustand con runtime singleton.

OPERATIVA:
11. **No introducir dependencias nuevas** (libs, frameworks, utilidades).
12. **Si descubres bug fuera de scope**: entrega como patch a /tmp/, NO commitees ni mezcles.
13. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo.
14. **No tocar**: docs/HANDOFF.md (excepto L5 en consolidación), docs/historias-usuario-v2/, docs/JOYAS.md, docs/auditorias/, docs/instrucciones-lineas-dev/ronda1..11/, customShapes.ts, in-vivo-test.mjs, home/.

DIFERIMIENTOS:
15. **EPICA-70/91 descartadas del proyecto** desde 2026-05-05; no proponerlas.
16. **EPICA-32 sub-modelos y HU-50.019/.020/.022 parser OPL DIFERIDAS** a rondas 13-14 dedicadas; no incluir.
17. **HU-33.004/.005/.016/.017/.019/.020/.021** (plantillas org/global, modo plantilla AO, favoritas, cortar carpeta) DIFERIDAS post multi-user; no incluir.
18. **HU-1B.006/.014** (preferencias default + burbuja sugerencia) DIFERIDAS bajo prioridad; no incluir.
19. **RF-3/R5 auditoría** (delta consistency rules + linter SSOT en CI) DIFERIDOS a ronda 13+; no incluir en briefs ronda 12.
20. **No reabrir contratos rondas 1-11** (HANDOFF §Decisiones Vigentes).
21. **Detector ledger es territorio L5**: cada línea declara internamente sus reglas detector pero NO edita progress-dashboard.mjs (excepto L5).

Loop verde obligatorio antes de cerrar:
- cd app && bun run check          (624+ tests, sin regresión)
- cd app && bun run browser:smoke  (72+/72+ con tus smokes nuevos; smoke 854 conocido flaky → reintento normalmente verde, L1 lo estabiliza)
- cd app && bun run build          (chunk principal sin regresión grave; objetivo < 195 KB / < 55 KB gzip al cierre)
- node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real (NO ejecutar tú; lo hace consolidación L5)

Forma del entregable (al cerrar):
- Hash final del último commit en main.
- LOC nuevos por archivo (`wc -l`).
- Output de cada comando de verificación (último tail).
- Lista de tests aditivos creados + conteo.
- Lista de smokes aditivos + conteo.
- Decisiones declaradas (§10 del brief).
- HU cerradas con id (de §2 del brief).
- Reglas detector que esta línea declara para consolidación L5 (§8 del brief).
- **Citas SSOT agregadas en headers** (lista por archivo: `[V-…]`, `[Glos 3.x]`, `[OPL-ES …]`, `[Met §x]`, `[JOYAS §x]`) — RF-2 remediation.
- **Assets reusados de assets/svg/** (lista explícita; obligatorio por PROVENANCE §2).
- **Patrones de opm-extracted/ reusados semánticamente** (con paths verificados con `ls`/`grep`; opcional pero recomendado).
- Bloqueos o desviaciones explícitas con rationale.
- Confirmación de archivos no tocados (de §11 del brief).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
```

## Invocaciones concretas listas para copia-pega

### L1 — Cierre MVP-α (residuales + smoke 854 + ejemplo organizacional)

```
Toma control de la línea L1 de la ronda 12 de deep-opm-pro: cierre MVP-α (14 HU residuales: 4 pendientes + 10 parciales + smoke 854 stabilization + ejemplo organizacional canónico).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ ff75966

Lee primero:
1. docs/JOYAS.md
2. assets/svg/ (foco: lock.svg HU-30.036, example.svg HU-30.021)
3. docs/instrucciones-lineas-dev/ronda12/linea-1-cierre-mvp-alpha.md
4. docs/instrucciones-lineas-dev/ronda12/README.md (reglas §2, assets §5b, JOYAS §5c, colisiones §7, merge §8)
5. opm-extracted/ — verificar paths citados antes de usar; este brief reusa principalmente patrones del propio repo (no opm-extracted)
6. docs/HANDOFF.md (decisiones vigentes; NO reabrir read-only flag de runtime, validarNombreEntidad, modo barra creación sticky, multi-pestaña sesión-only, undo per-pestaña)
7. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §read-only + opm-iso-19450-es.md §3.55 §3.69

Foco:
- HU-10.004 wiring SeccionDescripcion para cosas
- HU-11.001 indicador modo sticky
- HU-11.007 multi-al-todo wiring UI (Ctrl+Alt+T)
- HU-30.036 redirigir Guardar→Guardar Como en read-only
- HU-30.021 ejemplo organizacional JSON canónico nuevo
- HU-30.008 roundtrip payload íntegro
- HU-SHARED-002/.007 undo granular + eco OPL multi-al-todo
- Smoke 854 stabilization

Archivos permitidos: §4 del brief.
Archivos prohibidos: tipos/entidad.ts + tipos/opl.ts (L2), opl/generadores/* (L2), canvas/operacionesBatch.ts salvo verificación (L3+L4), MenuContextualEntidad.tsx + DialogoTraerConectados.tsx (L3), DialogoPlantillas.tsx + DialogoGuardarPlantilla.tsx + persistencia/plantillas.ts (L4), MenuPrincipal.tsx para Plantillas (L4), progress-dashboard.mjs (L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L2 — EPICA-17 valor numérico + sintaxis compuesta

```
Toma control de la línea L2 de la ronda 12 de deep-opm-pro: apertura MVP-β fase kernel-aditivo. Slot de valor numérico canónico sobre atributos. 7 HU vivas EPICA-17 (HU-17.011/.012/.013/.014/.015/.016/.017).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ ff75966

Lee primero:
1. docs/JOYAS.md (paleta + dimensiones para sintaxis compuesta canvas)
2. assets/svg/ (foco: editAlias.svg, editUnits.svg, objectDrag.svg)
3. docs/instrucciones-lineas-dev/ronda12/linea-2-valor-numerico.md
4. docs/instrucciones-lineas-dev/ronda12/README.md
5. opm-extracted/src/app/models/modules/attribute-validation/attribute-value.ts (clase AttributeValue + ValueAttributeType enum), char-range.ts, validation-module.ts. **Reuso semántico, NO copy 1:1 (depende de stereotypes Angular).**
6. docs/HANDOFF.md (decisiones vigentes; NO reabrir alias/unidad/descripción/URLs, designaciones de estado, validarNombreEntidad)
7. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md §3.4 atributo + §3.40 exhibición + opm-visual-es.md V-163 + opm-opl-es.md (oración Atributo es valor [Unidad].)

Foco:
- Entidad.valorSlot? + Entidad.esAtributo? aditivos kernel
- Validador valorSlot por tipo (integer/float/char/string)
- crearAtributoEnObjeto + parseo automático nombre [unidad]
- Oración OPL canónica nueva: "Atributo es valor [Unidad]."
- Render sintaxis compuesta Nombre [Unidad] {alias}
- SeccionAtributo nueva en inspector
- Botón Toolbar "Crear atributo numérico" con drag

Archivos permitidos: §4 del brief.
Archivos prohibidos: acciones-canvas.ts (L1+L3+L4), acciones-ui.ts (L1+L3+L4), MenuPrincipal.tsx (L4), MenuContextualEntidad.tsx (L3 nuevo), Dialogo* (L1/L3/L4), canvas/operacionesBatch.ts (L3+L4), progress-dashboard.mjs (L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L3 — EPICA-1B traer conectados

```
Toma control de la línea L3 de la ronda 12 de deep-opm-pro: apertura MVP-β fase canvas-aditivo. Operación "traer conectados" para hidratar OPD activo con cosas y enlaces vecinos. 13 HU vivas EPICA-1B (HU-1B.001..005/.007..011/.013/.015/.016).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ ff75966

Lee primero:
1. docs/JOYAS.md (dimensiones apariencia + arquitectura wrapper+line enlace)
2. assets/svg/ (foco: addConnected.svg)
3. docs/instrucciones-lineas-dev/ronda12/linea-3-traer-conectados.md
4. docs/instrucciones-lineas-dev/ronda12/README.md
5. opm-extracted/src/app/models/Actions/BringConnectedEntitiesAction.ts (clase canónica con act() + métodos filterRelevantRules, collectEntitiesAndLinks, filterEntitiesAndRelations, createNeededThings, createNeededRelations, bringLinksBetweenBroughtEntities). **Reuso semántico, NO copy 1:1.**
6. opm-extracted/src/app/models/consistency/bringConnectedRules.ts (clases por familia: BringProceduralEnablersRelations, BringProceduralTransformersRelations, BringUniBiDirectionalRelations, BringFundamentalRelations + enum BringConnectedTypes). **Patrón canónico de reglas por familia.**
7. opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts (handle halo bring-connected). **Patrón referencial halo button.**
8. docs/HANDOFF.md (decisiones vigentes; NO reabrir multi-selección, modo barra creación sticky, mapa = vista derivada)
9. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §multi-OPD + opm-iso-19450-es.md §3.6 apariencia.

Foco:
- traerConectadosBatch + reglas por familia (procedural-habilitador, transformador, direccional, estructural)
- traerEnlacesEntreBatch + enlacesInternosSeleccion (multi-selección)
- ocultarAparienciaBatch (HU-1B.015 reverso, sin tocar logical)
- layoutRadial para cosas traídas (HU-1B.011)
- DialogoTraerConectados nuevo (familias enum)
- MenuContextualEntidad nuevo (apariencia: Traer/Ocultar)
- Botón Toolbar Traer conectados con addConnected.svg
- HU-1B.013 OPL idempotencia (verificación, sin tocar generadores)

Archivos permitidos: §4 del brief.
Archivos prohibidos: tipos/entidad.ts + tipos/opl.ts (L2), opl/generadores/* (OPL invariante), acciones-entidad.ts (L1+L2), MenuPrincipal.tsx (L4), persistencia/* salvo lectura (L4), inspector/* (L1+L2), DialogoPlantillas.tsx + DialogoGuardarPlantilla.tsx (L4), canvas/operacionesBatch.ts solo agregas tus 3 batchs nuevos sin tocar otros, progress-dashboard.mjs (L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L4 — EPICA-33 plantillas privadas

```
Toma control de la línea L4 de la ronda 12 de deep-opm-pro: apertura MVP-β fase dominio-aditivo. Plantillas como artefactos reutilizables, ámbito Privado únicamente (org/global diferidos). 13 HU vivas EPICA-33 (HU-33.001/.002/.003/.006..010/.012/.014/.015/.018/.022).

Repo: /home/felix/projects/deep-opm-pro
Base: main @ ff75966

Lee primero:
1. docs/JOYAS.md (paleta secundaria #FFFC7F para halo temporal HU-33.010)
2. assets/svg/ (foco: template.svg)
3. docs/instrucciones-lineas-dev/ronda12/linea-4-plantillas-privadas.md
4. docs/instrucciones-lineas-dev/ronda12/README.md
5. opm-extracted/src/app/dialogs/templates-import/templates-import.ts (TemplatesComponent con tabs por TemplateType.PERSONAL/ORG/SYS, modes save/edit/import). **Patrón referencial; simplificación MVP-β: solo tab Privado.**
6. opm-extracted/src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts (manejo nombre duplicado con "Use Existing Thing"). **Patrón referencial; en MVP-β temprano elegimos sufijo _n automático sin diálogo.**
7. opm-extracted/src/app/dialogs/submodel-name-dialog/ (input nombre canónico). **Patrón para DialogoGuardarPlantilla.**
8. docs/HANDOFF.md (decisiones vigentes; NO reabrir workspace single-user MVP, política log-scale versiones, auto-archivar 90d, EPICA-31 carpetas/permisos diferida)
9. SSOT en /home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md §plantillas + opm-iso-19450-es.md §3.6.

Foco:
- Tipos Plantilla, PlantillaIndice, AmbitoPlantilla aditivos
- Persistencia plantillas (CRUD localStorage namespace opm:plantilla)
- insertarPlantillaBatch (atómico, IDs nuevos para HU-33.018 desacople, sufijo _n para HU-33.008, sub-OPDs HU-33.007, etiquetas preservadas HU-33.009)
- Halo temporal HU-33.010 (resaltarTemporalmente con setTimeout 3s)
- DialogoPlantillas con catálogo + búsqueda + breadcrumb (HU-33.012/.014/.015)
- DialogoGuardarPlantilla con nombre + ámbito Privado (HU-33.001/.002/.022)
- MenuPrincipal con Guardar como plantilla + Plantillas...
- Botón Toolbar Plantillas con template.svg

Archivos permitidos: §4 del brief.
Archivos prohibidos: tipos/entidad.ts + tipos/enlace.ts + tipos/modelo.ts + tipos/opl.ts (L2), opl/generadores/* (OPL invariante), acciones-entidad.ts (L1+L2), MenuContextualEntidad.tsx + DialogoTraerConectados.tsx (L3), reglas traer + layoutRadial + seleccionMultiple (L3), persistencia/local.ts salvo lectura (L4 plantillas tiene su propio namespace), progress-dashboard.mjs (L5).

[plantilla genérica de reglas duras + loop verde + entregable]
```

### L5 — Transversales + ledger ronda 12

```
Toma control de la línea L5 de la ronda 12 de deep-opm-pro: cierre con cascadas residuales + recalibración detector ronda 12 + draft handoff post-ronda-12.

Repo: /home/felix/projects/deep-opm-pro
Base: main @ ff75966

ESTA LÍNEA SE EJECUTA AL FINAL DE LA RONDA, después de L1+L2+L3+L4 mergeadas. Si alguna está incompleta, declarar dependencia y pausar.

Lee primero:
1. docs/instrucciones-lineas-dev/ronda12/linea-5-transversales-ledger.md
2. docs/instrucciones-lineas-dev/ronda12/README.md (consolidación final)
3. docs/instrucciones-lineas-dev/ronda12/linea-1..4-*.md (reglas detector declaradas en cada brief §8)
4. docs/instrucciones-lineas-dev/ronda11/linea-5-transversales-ledger.md (referencia patrón)
5. docs/HANDOFF.md (a reescribir post-ronda-12)
6. docs/historias-usuario-v2/tools/progress-dashboard.mjs (detector vigente)

Foco:
- Cascadas residuales tras merge (Toolbar/acciones-canvas/acciones-ui/operacionesBatch hunks disjuntos)
- ~22 reglas detector nuevas (L1: ~4, L2: ~5, L3: ~6, L4: ~6, L5: ~1)
- Corrección de drift en reglas previas si emerge
- Draft HANDOFF post-ronda-12 (consolidación final lo aplica)
- Verificación métricas: bun run check ≥680 unit, browser:smoke ≥90, build <195 KB / <55 KB gzip, dashboard --sync-real ≥110 reglas matched + MVP-α ≥98%

Archivos permitidos: §4 del brief, INCLUYE progress-dashboard.mjs (exclusivo L5) + docs/HANDOFF.md en consolidación final.
Archivos prohibidos: features de L1/L2/L3/L4 salvo cascadas estrictamente necesarias documentadas; archivos HU files; briefs ya emitidos.

[plantilla genérica de reglas duras + loop verde + entregable]
```

## Reglas comunes de coordinación

1. **Orden de merge**: L2 → L3 → L4 → L1 → L5 → consolidación.
2. **Cero sleep / cero polling**: cada línea opera sobre su `main` actualizada antes de empezar; al cerrar, hace `git pull --rebase` y verifica que loop verde sigue verde.
3. **Conflictos en archivos compartidos** (Toolbar, acciones-canvas, acciones-ui, tipos/ui, canvas/operacionesBatch): se resuelven a favor de la línea con scope explícito sobre el archivo (ver §7 del README); si ambas reclaman scope, se pide al operador.
4. **Bug fuera de scope** detectado por una línea: se entrega como patch a `/tmp/ronda12-bug-{nombre}.patch` y se documenta. NO se commitea.
5. **Si el detector unmatchea reglas existentes**: la línea responsable del cambio que rompió el match debe corregirla en el mismo commit (igual que ronda 8/9/9.5/10/11).
6. **Reuso obligatorio assets + JOYAS**: cada línea documenta en su entregable los assets reusados de `assets/svg/` (obligatorio por PROVENANCE §2). Patrones reusados semánticamente de `opm-extracted/` son opcionales pero recomendados (con paths verificados — RF-1 evita recurrencia).
7. **Citas SSOT obligatorias en headers**: cada archivo nuevo o modificado materialmente cita SSOT según tipo de HU (`[V-…]`, `[Glos 3.x]`, `[OPL-ES …]`, `[Met §x]`, `[JOYAS §x]`). RF-2 remediation: especialmente crítico para L1 sobre HU EPICA-30.

## Cierre de ronda

Una vez las 5 líneas mergeadas:

1. Crear/actualizar `docs/HANDOFF.md` reescribiéndolo a "post-ronda 12" (incluye nuevo estado MVP-α ≥98% + apertura MVP-β + decisiones de ronda 12 + cascadas resueltas + métricas finales + cita explícita a ruta C asimétrica con URNs ICAS).
2. Recalibrar detector con `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`. Esperar ≥110 reglas matched. MVP-α esperado: ≥98% ponderado.
3. Confirmar `bun run check` + `bun run browser:smoke` + `bun run build` verde.
4. Commit final: `chore(handoff): cierra ronda 12 — MVP-α ≥98% + apertura MVP-β`. Push.

Si MVP-α < 98% post-ronda-12, registrar en HANDOFF las HU que quedaron sin cerrar y los rationales (HU sin evidencia code-side, HU con peso M0/M1 alto que requiere ronda 13+, etc.). MVP-α 95-97% sigue siendo válido como cierre presentable.
