# Ronda 12.1 — Cierre fino MVP-α + UX polish (3 líneas paralelas)

**Fecha**: 2026-05-07
**Base**: `main` @ commit `3805455` (`docs(handoff): cierra ronda 12 — MVP-α 90.8% ponderado`) — HANDOFF vigente con rondas 1-12 cerradas. **MVP-α 90.8% ponderado, detector 98/100 reglas matched, bundle principal 211.49 kB / 57.39 kB gzip (sobre objetivo heredado < 195 / < 55)**.
**Objetivo**: 3 líneas paralelas chicas. **Coproducto disjunto por dominio funcional**: L1 cierra HU semánticas residuales MVP-α (kernel + store + smokes); L2 mejora la base UI (build/bundle + paleta tokens mínima + Dialogo refactor); L3 ejecuta UX polish del chrome (Toolbar tooltips + assets canónicos en Inspector + conteo en DialogoTraerConectados + iconografía list-logical). **Triángulo cerrado, sin apertura de épicas grandes**. Apertura UX foundation (BarraHerramientasElemento.tsx, tokens.ts central completo, split Toolbar en tres bandas, sprite-sheet modificadores procedurales) DIFERIDA explícitamente a **ronda 13 dedicada**.

## 1. Filosofía operativa

- **Marco SSOT-céntrico** (referencia: `docs/auditorias/2026-05-07-ssot-opm-extracted.md`, `docs/historias-usuario-v2/00-METODOLOGIA.md §6`). Mismas tres jerarquías de autoridad que ronda 12 (nivel 1 SSOT, nivel 2 `tipos.ts`, nivel 3 `opm-extracted/` + `assets/svg/` + `JOYAS.md`). Citas obligatorias por tipo HU (`[V-xxx]`, `[Glos 3.x]`, `[OPL-ES …]`, `[Met §x]`, `[JOYAS §x]`).
- **Ronda corta de cierre + polish**, no apertura. Ronda 12 cerró 4 épicas grandes (EPICA-17 valor numérico, EPICA-1B traer conectados, EPICA-33 plantillas privadas) más la consolidación de transversales. Ronda 12.1 cosecha los residuales MVP-α que no cerraron (3 pendientes + 8 parciales) más una capa de polish del chrome derivada de auditoría comparativa contra `opm-extracted/`. **Foco en honestidad de cobertura** (HU-SHARED-002 evidencia granular, HU-SHARED-007 inverso queda diferido a EPICA-50 fase posterior con parser).
- **Aditividad estricta** preservada (`urn:fxsl:kb:icas-extension`): cada cambio agrega tipos opcionales (`?:`), exports nuevos, ningún rename. **L2 introduce módulo nuevo `app/src/ui/tokens.ts` mínimo** (solo paleta UI, no migración total — eso es ronda 13). **L3 toca solo iconografía + tooltips**, no rediseña componentes.
- **Diferimiento por blast** (`urn:fxsl:kb:icas-calidad-riesgo`): tareas de UX foundation con cascada amplia se difieren a ronda 13 dedicada. Ver §4b lista cerrada.
- **Faithful sobre rondas 1-12** (`urn:fxsl:kb:icas-preservacion`): contratos públicos preservados, JSON lossless, OPL invariante. Cero rename.
- **Loop verde obligatorio**: cada línea cierra con `cd app && bun run check`; si toca UI/render: `bun run browser:smoke`; si toca proyección o bundle: `bun run build`. Línea base post-ronda-12: 659 unit / 2643 expect / 0 fail, 81/81 smoke (~1.5 min), chunk principal 211.49 KB / 57.39 KB gzip, detector 98/100 reglas matched. **Objetivo de bundle post-ronda-12.1**: < 200 KB (lazy DialogoTraerConectados + DialogoPlantillas).
- **Ship-beats-perfect**: si una HU expone bug fuera de scope, se entrega como patch a `/tmp/` y NO se commitea (regla feedback consolidada).
- **Honestidad sobre inflación**: HU-SHARED-002 y HU-SHARED-007 ya están en parcial. Si la evidencia granular no se completa en esta ronda, **se preservan como parciales en el ledger en lugar de declararlas cubiertas**. La métrica refleja la verdad estructural (decisión heredada de ronda 12 L5).

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Cualquier cambio cross-line no previsto se reporta y detiene.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde las líneas. El handoff único se actualiza solo en consolidación final (no hay L5 separado en esta ronda corta — la consolidación la ejecuta el operador con un commit `chore(ronda12.1)` final). Tampoco tocar `docs/instrucciones-lineas-dev/ronda1..12/`, ni `docs/JOYAS.md`, ni la SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/` (lectura).
3. **No tocar archivos sueltos del operador**: ni `app/scripts/in-vivo-test.mjs` ni `app/src/render/jointjs/customShapes.ts` ni `home/`.
4. **No copiar código 1:1 desde `opm-extracted/`**. Se usa como evidencia semántica/UX/arquitectura; la implementación se reescribe con Preact/Zustand/JointJS OSS.
5. **Citas explícitas**: cada decisión arquitectural cita SSOT o documento interno con paths absolutos + líneas.
6. **APIs públicas estables**: ningún rename de export. **L2 introduce `app/src/ui/tokens.ts` con exports nuevos**, no rename de existentes.
7. **JSON lossless**: roundtrip permanece intacto. Sin cambios kernel en esta ronda (L1 toca solo store de coordinación + smokes; L2/L3 son UI pura).
8. **Idiomas**: docs y mensajes UI en es-CL; identificadores en estilo del repo (camelCase TS, kebab-case `data-testid`).
9. **Tests por capa**: cada feature trae tests al lado. Tests viejos se preservan sin reescribir.
10. **No introducir backend, Firebase, auth, Rappid, jspdf, pdf-lib, papaparse ni dependencias nuevas** en esta ronda.
11. **Commits de línea**: `feat(...)` para cierres HU + features chicas, `refactor(...)` para extracción tokens (L2 paleta), `test(...)` para evidencia, `chore(...)` para SVG copy + glue. Co-author footer si aplica.
12. **No reabrir contratos rondas 1-12**: `docs/HANDOFF.md §Decisiones Vigentes` es contrato. Mantener vigentes en particular: read-only flag de runtime no de modelo, validación nominal `validarNombreEntidad`, modo barra creación sticky (decisión consciente de NO consolidar duplicación Objeto/Objeto-sticky en Toolbar — ver §4 nota arquitectónica), atajos centralizados, paleta canónica canvas (`#70E483`/`#3BC3FF`/`#586D8C`), aditividad estricta. **L2 separa el acento UI del color de proceso, pero NO cambia la paleta semántica del canvas**.
13. **EPICA-70 (OPCAT) y EPICA-91 (tutorial) descartadas del proyecto** desde 2026-05-05.
14. **Diferimiento explícito ronda 13** (lista cerrada, ver §4b): `BarraHerramientasElemento.tsx` flotante (element-tool-bar canónico OPCloud), `app/src/ui/tokens.ts` central completo (migración archivo por archivo), split `Toolbar.tsx` en tres bandas, sprite-sheet 17 modificadores procedurales, minimapa flotante, dark mode, ESLint rule color literales, validation/methodological-checking pipeline visual, parser OPL bidireccional (HU-50.019/.020/.022, EPICA-32 sub-modelos peer). Ninguna línea de ronda 12.1 los aborda.
15. **Cada línea registra sus reglas detector ronda 12.1**: agrega reglas nuevas en `docs/historias-usuario-v2/tools/progress-dashboard.mjs` solo en consolidación final del operador, pero declara internamente qué HU cierra y qué evidencia lo respalda.

## 3. Stack y comandos del repo

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests (659 baseline post-ronda-12)
bun run browser:smoke  # Playwright Chromium 81/81 baseline
bun run build          # build Vite; chunk principal 211.49 kB / 57.39 kB gzip baseline
bun run dev            # localhost:5173
```

Auditoría HU al cierre de consolidación:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Diagnóstico del estado y objetivos ronda 12.1

Estado post-ronda-12:

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 302 | 30 | 416 | 378 | **27.5%** |
| MVP-α | 121 | 110 | 8 | 3 | 0 | **90.8%** |

**11 HU residuales MVP-α** (objetivo combinado L1+L2+L3 → cierre):

| ID | Estado | Tamaño | Comentario | Línea |
|---|---|---|---|---|
| HU-10.003 | parcial | M0 | Modal nombre tras crear; existe `data-testid="modal-nombre-cosa"` (ronda 11 L4); afinar smoke. | **L1** |
| HU-30.019 | pendiente | M0 | Cargar doble clic; smoke explícito en `DialogoCargarModelo`. | **L1** |
| HU-30.020 | pendiente | M0 | Cargar clic+botón; smoke análogo. | **L1** |
| HU-30.037 | parcial | M0 | Cancelar modal Esc/Cancelar sin persistir; **`Dialogo.tsx` ya captura Esc** (líneas 33-35); **falta solo cobertura tests** para `DialogoVersiones`, `DialogoArchivados`, `DialogoBuscarGlobal`. | **L2** |
| HU-10.021 | parcial | C | Descomposición objeto mismo diagrama; verificar inzoom para objetos (no solo procesos). | **L1** |
| HU-11.012 | parcial | M0 | Enlace estructural etiquetado completo (exhibición/generalización/clasificación) con etiqueta editable inline. | **L1** |
| HU-SHARED-002 | parcial | M0 | Pila undo/redo granular; tests aditivos por comando ronda 11 (cada uno = un solo undoStack push). | **L1** |
| HU-SHARED-007 | parcial | M0 | Eco OPL bidireccional editable; **forward cubierto, inverso requiere parser** (HU-50.019/.020/.022, ronda 14). **Permanece parcial honestamente**, no se infla. | **(diferido ronda 14)** |
| HU-10.004 | pendiente* | S | Modal cargar ejemplo regional; ronda 12 lo cubrió como `app/examples/ejemplo-organizacional.json` con regla detector. **Ya cubierto efectivamente** — verificar regla detector y recategorizar a "cubierto" en consolidación. | **(consolidación)** |
| HU-30.008 | parcial* | M0 | Persistir payload OPM íntegro; ronda 12 lo cubrió con regla detector compartida HU-30.021+.008. **Ya cubierto efectivamente** — verificar. | **(consolidación)** |
| HU-30.021 | pendiente* | S | Cargar Ejemplo Organizacional; cubierto en ronda 12 L1 (`ejemplo-organizacional.json` + carga vía URL asset). **Ya cubierto efectivamente** — verificar. | **(consolidación)** |

*Las HU marcadas con asterisco probablemente ya están cubiertas por reglas detector de ronda 12 — la consolidación final del operador verifica con `--sync-real` y recategoriza si aplica. No requieren trabajo nuevo en líneas.

**Objetivos paralelos no atados a HU**:

- **Bundle <200 KB** (objetivo conservador; ideal <195): lazy splits de `DialogoTraerConectados` y `DialogoPlantillas` que hoy entran al chunk principal. Ahorro estimado 8-12 KB. **L2**.
- **Paleta UI separada de paleta canvas**: introducir `--color-acento-ui = #3DA8FF` (azul UI) que no colisione con `#3BC3FF` (semántica de proceso en canvas). Aplicar sólo en `Dialogo.tsx` (acentos UI puntuales). Toolbar.tsx queda fuera por scope (ronda 13). **L2**.
- **Tooltips sistemáticos en Toolbar.tsx**: ~6-8 botones del chrome central no tienen `title=` (Objeto/Proceso drag, Deshacer/Rehacer, Nuevo/Demo, Cargar, Tipos válidos, Biblioteca, Img+Txt/Img/Texto/Respeta, Desc, Mapa). Auditar con `grep "title=" Toolbar.tsx` y completar. **L3**.
- **Iconografía canónica en Inspector secciones**: importar `inzoom.svg`/`unfold.svg` en `SeccionRefinamiento`, `addStates.svg` en `SeccionLayoutEstados`, `timeDuration.svg` en `SeccionDuracion`. **Todos ya están en `assets/svg/` del repo** (verificado con `ls`); la deuda es de cableado, no de assets. **L3**.
- **Iconografía list-logical en árbol y biblioteca**: `assets/svg/list-logical/{object,objectDashed,process,processDashed}.svg` ya están en el repo; cablear en `ArbolOpd.tsx` y `BibliotecaCosa.tsx`. **L3**.
- **Conteo por familia en `DialogoTraerConectados`**: hoy muestra 4 checkboxes sin contar candidatos; agregar conteo `("Procedurales habilitadores · 3 candidatos")`. **L3**.

### 4b. Diferimiento explícito a ronda 13 (lista cerrada)

Las siguientes apuestas estructurales NO entran en ronda 12.1 (van a **ronda 13 dedicada UX foundation**):

- **`BarraHerramientasElemento.tsx` flotante** anclado a la apariencia seleccionada (~12 acciones primarias canónicas). Cambio estructural que requiere ronda dedicada con coordinación render+UI.
- **`app/src/ui/tokens.ts` central completo** con migración archivo por archivo de Toolbar, Inspector, MenuContextual*, todos los Dialogo*. Ronda 12.1 introduce solo el módulo mínimo + uso puntual en Dialogo.tsx; ronda 13 hace la migración completa.
- **Split `Toolbar.tsx` (1051 LOC) en tres bandas** (`BarraEncabezado` / `BarraTipos` / `BarraContextual`). Refactor estructural con cascada en App.tsx + acciones-ui.
- **Sprite-sheet de 17 modificadores procedurales** (event/condition/negation × 4 familias procedurales) reemplazando badges textuales `e/c/n` en `markers.ts`.
- **Minimapa flotante** esquina inferior-derecha con viewport sincronizado.
- **Dark mode** y tema configurable.
- **ESLint rule** prohibiendo color literales en `app/src/ui/`.
- **Validation/methodological-checking pipeline visual** (drill-down de warnings desde `consistency/{behavioral,structural,bringConnected}.rules.ts` en `PanelAvisos`).
- **Consolidar duplicación Toolbar Objeto/Objeto-sticky** (botón drag inmediato vs modo sticky persistente). Decisión consciente de mantener ambos affordances en ronda 12.1 (decisión vigente desde rondas previas, ver §2 regla 12); ronda 13 evalúa consolidación con UX research.
- **EPICA-32 sub-modelos peer** y **HU-50.019/.020/.022 parser OPL bidireccional**: van a ronda 14 dedicada.

## 5. Patrones técnicos referenciales en `opm-extracted/` (nivel 3, respaldo opcional)

Esta ronda corta usa pocos patrones de OPCloud porque la mayoría de cambios son cosecha sobre código propio del repo. Los pertinentes:

| Patrón OPCloud | Path verificado | Aplicación ronda 12.1 |
|---|---|---|
| **Iconografía list-logical** | `opm-extracted/assets/svg/list-logical/{object,objectDashed,process,processDashed}.svg` (ya copiados a `assets/svg/list-logical/` del repo, verificado con `ls`). | **L3** cablear en `ArbolOpd.tsx` y `BibliotecaCosa.tsx`. |
| **Iconografía descomposición/estados/duración** | `opm-extracted/assets/svg/{inzoom,unfold,addStates,timeDuration,delete,editAlias,editUnits}.svg` (ya copiados a `assets/svg/` del repo, verificado con `ls`). | **L3** cablear en `SeccionRefinamiento`, `SeccionLayoutEstados`, `SeccionDuracion` y menús contextuales. |
| **matTooltip universal en handles** | OPCloud usa `matTooltip` en cada botón/handle (Material Design). | **L3** equivalente en es-CL: `title="Acción · Atajo"` sistemático en cada botón Toolbar. |
| **Conteo de candidatos en bring-connected** | `opm-extracted/src/app/dialogs/bring-connected-entities/` (verificar) muestra cantidades por familia. | **L3** `DialogoTraerConectados` agrega conteo derivado de `reglasTraer.ts`. |
| **Test de undo granular** | OPCloud no expone tests; el patrón de "una operación = un undoStack push" es propio del repo (`canvas/operacionesBatch.ts`). | **L1** tests aditivos verifican atomicidad por comando ronda 11. |

Ningún brief debe inventar paths bajo `opm-extracted/`. Si un path no aparece en esta tabla o no se verifica con `ls`/`grep` antes, NO se cita en un brief.

## 5b. Assets SVG canónicos a reusar (obligatorio)

Política `06-PROVENANCE.md §2`: **"SVGs, dimensiones, colores, tipografía y plantillas OPL se reutilizan"**. **Todos los SVGs siguientes ya están en `assets/svg/` del repo** (verificado con `ls`); el trabajo es **cablearlos**, no importarlos:

| Archivo SVG (en `assets/svg/`) | Aplicación ronda 12.1 |
|---|---|
| `inzoom.svg` | **L3** `inspector/SeccionRefinamiento.tsx` botón "Inzoom" + "Descomponer". |
| `unfold.svg` | **L3** `inspector/SeccionRefinamiento.tsx` botón "Desplegar" / "Despliegue out". |
| `addStates.svg` | **L3** `inspector/SeccionLayoutEstados.tsx` botón "Agregar estado". |
| `timeDuration.svg` | **L3** `inspector/SeccionDuracion.tsx` ícono junto al control de duración. |
| `delete.svg` | **L3** `MenuContextualEntidad.tsx` y `MenuContextualArbol.tsx` ítem "Eliminar". (`MenuContextualEnlace.tsx` reservado a L1 para HU-11.012 wiring.) |
| `addConnected.svg` | (ya cableado en Toolbar — no re-cablear). |
| `template.svg` | (ya cableado en Toolbar/MenuPrincipal — no re-cablear). |
| `list-logical/object.svg`, `object-dashed.svg`, `process.svg`, `process-dashed.svg` (en `assets/svg/`, sin subcarpeta del repo) | **L3** `ArbolOpd.tsx` y `BibliotecaCosa.tsx` para distinguir objeto/proceso e informático/físico (dashed). |
| `lock.svg` | (ya cableado para HU-30.036 ronda 12 L1 — no re-cablear). |
| `example.svg` | (ya cableado para HU-30.021 ronda 12 L1 — no re-cablear). |

Si un brief necesita un icono que no está en `assets/svg/`, primero verifica con `ls assets/svg/` y `ls opm-extracted/assets/svg/`. Si está en `opm-extracted/` pero no en repo, copiarlo con `cp` y citar origen.

## 5c. JOYAS canónicas (paleta + dimensiones) — contrato visual obligatorio

`docs/JOYAS.md` documenta paleta y dimensiones del bundle real de OPCloud. Ronda 12.1 respeta:

- **Paleta semántica canvas** (`docs/JOYAS.md §1`, **invariante**): `#70E483` Object stroke, `#3BC3FF` Process stroke, `#586D8C` link stroke, `#fdffff` fill, `#000002` text.
- **Paleta UI nueva en ronda 12.1**: `#3DA8FF` acento UI primario, `#1a3763` acento UI secundario, `#586D8C` neutral chrome (compartido con link stroke; coexiste sin conflicto porque link stroke es shape, no acento UI). **Esta separación es la decisión central de L2** y resuelve la colisión semántica detectada en auditoría comparativa: hoy `Toolbar.tsx` usa `#3BC3FF` como acento UI (líneas 774, 823) cuando debería ser color de proceso del canvas.
- **Dimensiones canónicas** (`docs/JOYAS.md §2`, invariante).
- **Tipografía** (`docs/JOYAS.md §3`, invariante).

L2 introduce `app/src/ui/tokens.ts` mínimo (solo colores UI nuevos + alias de paleta canvas para uso UI controlado). **No migra Toolbar.tsx** (eso es ronda 13). Migra solo `Dialogo.tsx`. Aplicación quirúrgica.

## 5d. Política de citas SSOT obligatorias en archivos nuevos (RF-2 vigente)

Política heredada de ronda 12. Cada archivo nuevo o modificado materialmente cita SSOT al header según tipo de HU. Aplicación concreta ronda 12.1:

- **L1** HU-10.021 (`opm-semantica`): `[Glos 3.55]` Object o `[Glos 3.69]` Process + `[Met §inzoom]`.
- **L1** HU-11.012 (`opm-semantica`): `[V-239]` familias estructurales + `[Glos 3.x]` link signature.
- **L1** HU-SHARED-002 (`mixto` undo granular): `[Met §6]` etapas SD + comentario sobre atomicidad.
- **L1** HU-30.019/.020 (`mixto` persistencia): `[Met §6]`.
- **L2** `app/src/ui/tokens.ts` (nuevo, **`opcloud-ui`**): `[JOYAS §1]` paleta + cita al rationale "separar acento UI del color de proceso".
- **L2** `app/src/ui/Dialogo.tsx` (modificación token): `[JOYAS §1]`.
- **L3** Toolbar tooltips (`mixto`): no requieren cita SSOT (texto es-CL operativo). Las secciones Inspector tocadas (`Refinamiento`, `LayoutEstados`, `Duracion`) ya tienen citas previas — **no remover**.
- **L3** `ArbolOpd.tsx` y `BibliotecaCosa.tsx` para list-logical: `[V-209]` o `[Glos 3.55/3.69]` (objeto/proceso) — verificar visual canónico exacto.

## 6. Visión general de las 3 líneas

| ID | Título | HU eje | Capa principal | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Cierre HU semánticas MVP-α (modal nombre + cargar tiles + descomposición objeto + enlace estructural etiquetado + undo granular) | HU-10.003, HU-10.021, HU-11.012, HU-30.019, HU-30.020, HU-SHARED-002 (6 HU directas) | `app/src/canvas/operacionesBatch.test.ts` + `app/src/store.test.ts` + `app/src/store/persistencia.test.ts` + `app/src/store/modelo/acciones-canvas.ts` (HU-11.012 wiring si falta) + `app/src/ui/MenuContextualEnlace.tsx` (HU-11.012 etiqueta inline) + `app/src/ui/InspectorEntidad.tsx` (HU-10.021 verificar inzoom para objetos) + `app/e2e/opm-smoke.spec.ts` (~6 smokes) | S | bajo |
| **L2** | Build + bundle + paleta tokens mínima + Dialogo refactor | HU-30.037 (cobertura), bundle <200 KB | `app/src/ui/tokens.ts` (NUEVO) + `app/src/ui/Dialogo.tsx` (token + size prop opcional) + `app/src/ui/App.tsx` (lazy DialogoTraerConectados + DialogoPlantillas) + `app/src/ui/DialogoCargarModelo.tsx` y `DialogoPlantillas.tsx` (props size lectura/aplicación) + smokes Esc cobertura | S | bajo |
| **L3** | UX polish chrome (Toolbar tooltips + iconografía Inspector + list-logical + conteo TraerConectados) | (no HU directa; mejora descubribilidad y reduce densidad cognitiva) | `app/src/ui/Toolbar.tsx` (tooltips ~6-8 botones) + `app/src/ui/inspector/SeccionRefinamiento.tsx` + `SeccionLayoutEstados.tsx` + `SeccionDuracion.tsx` (íconos canónicos) + `app/src/ui/DialogoTraerConectados.tsx` (conteo familias) + `app/src/ui/ArbolOpd.tsx` + `app/src/ui/BibliotecaCosa.tsx` (list-logical/*.svg) + `app/src/ui/MenuContextualEntidad.tsx` + `app/src/ui/MenuContextualArbol.tsx` (delete.svg) | M | bajo |

Quedan fuera de ronda 12.1 (diferidas a ronda 13/14, ver §4b lista cerrada).

## 7. Mapa de archivos por línea

Convención: `aditivo` = solo agregar campos opcionales/funciones nuevas; `nuevo` = archivo creado por esa línea; `lectura` = puede leerse pero no editarse; `extiende` = agrega funciones públicas nuevas sin tocar las previas; vacío = sin contacto.

| Archivo | L1 | L2 | L3 |
|---|---|---|---|
| `app/src/ui/tokens.ts` | — | **nuevo** | — |
| `app/src/ui/Dialogo.tsx` | — | aditivo (token acento + `size?` prop opcional) | — |
| `app/src/ui/App.tsx` | — | — | — |
| `app/src/ui/DialogoTraerConectados.tsx` | — | lectura (estructura para lazy) | aditivo (conteo por familia) |
| `app/src/ui/DialogoPlantillas.tsx` | — | aditivo (`size="lg"`) | — |
| `app/src/ui/DialogoCargarModelo.tsx` | — | aditivo (`size="lg"`) | — |
| `app/src/ui/DialogoVersiones.tsx` | — | lectura (smoke Esc cobertura) | — |
| `app/src/ui/DialogoArchivados.tsx` | — | lectura (smoke Esc cobertura) | — |
| `app/src/ui/DialogoBuscarGlobal.tsx` | — | lectura (smoke Esc cobertura) | — |
| `app/src/ui/Toolbar.tsx` | — | aditivo restringido (SOLO imports `lazy(...)` líneas 14/19 + `<Suspense>` wrapper líneas 684-685 para DialogoTraerConectados + DialogoPlantillas; NO otros hunks) | aditivo (tooltips ~6-8 botones; **NO refactor, NO tokens, NO consolidar Objeto/sticky**) |
| `app/src/ui/inspector/SeccionRefinamiento.tsx` | — | — | aditivo (íconos `inzoom.svg`/`unfold.svg`) |
| `app/src/ui/inspector/SeccionLayoutEstados.tsx` | — | — | aditivo (ícono `addStates.svg`) |
| `app/src/ui/inspector/SeccionDuracion.tsx` | — | — | aditivo (ícono `timeDuration.svg`) |
| `app/src/ui/InspectorEntidad.tsx` | aditivo (HU-10.021 verificar inzoom para objetos si falta) | — | — |
| `app/src/ui/ArbolOpd.tsx` | — | — | aditivo (íconos `list-logical/{object,objectDashed,process,processDashed}.svg`) |
| `app/src/ui/BibliotecaCosa.tsx` | — | — | aditivo (íconos `list-logical/{object,process}.svg`) |
| `app/src/ui/MenuContextualEntidad.tsx` | — | — | aditivo (ícono `delete.svg` en ítem "Eliminar"; **NO modificar handlers/lógica**) |
| `app/src/ui/MenuContextualEnlace.tsx` | aditivo (HU-11.012 etiqueta inline si falta) | — | — (RESERVADO para L1) |
| `app/src/ui/MenuContextualArbol.tsx` | — | — | aditivo (ícono `delete.svg` en ítem "Eliminar"; **NO modificar handlers/lógica**) |
| `app/src/store/modelo/acciones-canvas.ts` | extiende (HU-11.012 `editarEtiquetaEnlaceEstructural` si falta) | — | — |
| `app/src/store/tipos.ts` | aditivo (acción HU-11.012 si nueva) | — | — |
| `app/src/canvas/operacionesBatch.test.ts` | aditivo (~5 tests undo granular HU-SHARED-002) | — | — |
| `app/src/store.test.ts` | aditivo (~3 tests integrados HU-SHARED-002 + HU-11.012) | — | — |
| `app/src/store/persistencia.test.ts` | aditivo (~1 test HU-30.019/.020 si modela) | — | — |
| `app/e2e/opm-smoke.spec.ts` | aditivo (~6 smokes L1: HU-10.003, HU-30.019, HU-30.020, HU-10.021, HU-11.012, HU-SHARED-002) | aditivo (~3 smokes Esc cobertura HU-30.037) | aditivo (~2 smokes UX: tooltips visibles, conteo TraerConectados) |
| `app/index.html` | — | — | — |
| `vite.config.ts` | — | — | — |
| `assets/svg/**` | LECTURA | LECTURA | LECTURA |
| `opm-extracted/**` | LECTURA | LECTURA | LECTURA |
| `docs/HANDOFF.md` | — | — | — |
| `docs/historias-usuario-v2/**` | — | — | — |
| `docs/historias-usuario-v2/tools/progress-dashboard.mjs` | — | — | — |

Reglas de colisión:

- **`MenuContextualEnlace.tsx`**: solo L1 (wiring HU-11.012 etiqueta). L3 NO toca este archivo (decisión de partición para evitar conflicto). El ícono `delete.svg` en ítems "Eliminar" se cablea en `MenuContextualEntidad.tsx` y `MenuContextualArbol.tsx` por L3, no en `MenuContextualEnlace.tsx`.
- **`DialogoTraerConectados.tsx`**: L2 lo lee para confirmar export pattern (lazy); L3 agrega conteo. Conflicto evitado porque L2 NO modifica el componente, solo cambia el `import` en `App.tsx` a `lazy()`.
- **`DialogoCargarModelo.tsx`**: L2 aplica `size="lg"` (prop nueva opcional). L3 NO toca. Sin conflicto.
- **`opm-smoke.spec.ts`**: TODAS las líneas agregan tests al final del archivo sin tocar tests previos. **L1 ~6, L2 ~3, L3 ~2** smokes nuevos (~11 total).
- **Toolbar.tsx**: **L2 y L3 lo comparten en hunks disjuntos garantizados**. L2 toca SOLO 3 puntos: imports líneas 14, 19 (convertir a `lazy(...)` para DialogoTraerConectados + DialogoPlantillas) + render líneas 684-685 (envolver en `<Suspense fallback={null}>`). L3 toca SOLO `title=` aditivos en ~6-8 botones del JSX (botones distintos a los hunks de L2). **L2 NO migra Toolbar.tsx a tokens** (eso es ronda 13). **L2 NO refactor de Toolbar.tsx**. **L3 NO consolida duplicación Objeto/sticky** (ronda 13). **L1 NO toca Toolbar.tsx**. Coordinación de orden de merge (L1 → L2 → L3) garantiza que L3 ve los lazy imports ya en HEAD cuando agrega `title=`.
- **App.tsx**: ronda 12.1 NO lo toca. Los lazy imports de DialogoTraerConectados/DialogoPlantillas viven en Toolbar.tsx (descubrimiento durante ejecución; brief original asumió incorrectamente App.tsx).
- **Detector ledger**: cada línea declara internamente sus reglas; consolidación final del operador las agrega.

## 8. Protocolo de conciliación (orden de merge)

Orden sugerido: **L1 → L2 → L3 → consolidación operador**.

Rationale categorial:

1. **L1 cierre HU semánticas primero** (riesgo bajo, kernel/store/smokes): si alguna HU expone bug fuera de scope, se detecta antes que L2/L3 modifiquen UI. Wire de etiqueta enlace estructural en `MenuContextualEnlace.tsx` aterriza limpio.
2. **L2 build + paleta + Dialogo segundo**: introduce `tokens.ts` y migra `Dialogo.tsx` sobre código L1 ya estable. Lazy splits del bundle aterrizan sobre import tree post-L1.
3. **L3 UX polish chrome tercero**: tooltips, iconografía Inspector y list-logical aterrizan al final, sobre `Dialogo.tsx` ya migrado y `Toolbar.tsx` intacto.
4. **Consolidación operador**: 1 commit final `chore(ronda12.1): glue + ledger` con regeneración detector + actualización HANDOFF a "post-ronda 12.1". No requiere L5 separado por la escala chica.

Después de cada merge: `cd app && bun run check`; si tocó UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build` y auditoría HU con `--sync-real`.

Chequeo de contrato por merge:

- **Export surface**: cada línea declara qué exports nuevos agrega. Cero rename, cero break.
- **JSON lossless**: roundtrip permanece intacto (sin cambios kernel en esta ronda).
- **OPL invariante**: ninguna oración nueva. **Las generadores OPL no se tocan**.
- **Behavioral surface**: `data-testid` previos preservados. `data-testid` nuevos van en `Dialogo.tsx` (HU-30.037 cobertura), Inspector secciones (íconos canónicos) y Toolbar (atajos en tooltips).
- **Bundle**: post-L2 chunk principal debe medir < 200 KB. Si crece más, L2 reporta y propone medida adicional (ej. lazy split de `MapaSistema` adicional).
- **Detector surface**: cada HU cerrada declara su evidencia; consolidación operador agrega ~6-8 reglas nuevas (L1: ~5, L2: ~1, L3: ~2 si aplican como evidencia HU; L3 mayoritariamente UX no cierra HU).

## 9. Anclaje obligatorio: SSOT (autoridad) + nivel 2 + nivel 3 (respaldo)

Antes de codificar cada línea, leer **en este orden**:

**Nivel 1 — SSOT (autoridad obligatoria)** en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:

- `metodologia-opm-es.md`: §6 etapas SD (relevante L1 HU-30.019/.020), §inzoom (L1 HU-10.021).
- `opm-iso-19450-es.md`: §3.55 Object, §3.69 Process (L1 HU-10.021), §3.x link signature (L1 HU-11.012).
- `opm-visual-es.md`: V-239 familias estructurales (L1 HU-11.012), V-209 list-logical (L3 ArbolOpd).
- `06-PROVENANCE.md §2`: política operativa.
- `00-METODOLOGIA.md §6`: jerarquía SSOT.

**Nivel 2 — `app/src/modelo/tipos.ts` (SSOT viva)**: ronda 12.1 NO modifica tipos kernel.

**Nivel 3 — respaldo técnico (citas opcionales pero recomendadas)**:

- **`docs/JOYAS.md`** completo: paleta canónica para L2 tokens.
- **`assets/svg/`** inventario: la mayoría de SVGs canónicos ya están en el repo (verificar con `ls assets/svg/` antes de inventar import).
- **`opm-extracted/`** dirigido: §5 paths verificados; ronda 12.1 usa pocos patrones de OPCloud.
- **HANDOFF + briefs ronda 12** (`docs/HANDOFF.md §Decisiones Vigentes`): contrato heredado.

**Orden de prioridad cuando hay conflicto**: SSOT (nivel 1) manda → `tipos.ts` (nivel 2) → JOYAS + assets/svg → opm-extracted (nivel 3).

## 10. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-cierre-fino-mvp-alpha.md](./linea-1-cierre-fino-mvp-alpha.md) |
| L2 | [linea-2-build-paleta-dialogo.md](./linea-2-build-paleta-dialogo.md) |
| L3 | [linea-3-ux-polish-chrome.md](./linea-3-ux-polish-chrome.md) |

Prompt para asignar líneas: [prompt-asignacion.md](./prompt-asignacion.md).

## 11. Verificación al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Métricas esperadas post-ronda 12.1 (sobre base post-ronda-12: 659 unit / 2643 expect, 81/81 smoke, chunk principal 211.49 KB / 57.39 KB gzip, detector 98/100 reglas, MVP-α 90.8%):

- **Unit tests ≥ 670** (L1 ~9 nuevos; L2 ~0-1; L3 ~0).
- **Smoke browser ≥ 92** (L1 ~6, L2 ~3, L3 ~2).
- **Build**: chunk principal ≤ 200 KB / ≤ 53 KB gzip (L2 lazy splits aportan ahorro 8-12 KB).
- **Detector ledger ≥ 104 reglas matched** (vs 98 baseline; +6 nuevas: L1 ~5, L2 ~1, L3 0). Cero unmatched nuevos.
- **MVP-α: 90.8% → ≥95% ponderado** (cierre de 6 HU residuales L1 + verificación de las 3 marcadas con asterisco en consolidación). Si HU-SHARED-007 permanece honestamente parcial, MVP-α no llega a 100% — eso es esperado y se documenta.
- **APIs públicas sin cambios**: cada feature como export nuevo o campo opcional aditivo.
- **Contratos observables sin cambios**: JSON roundtrip preservado, OPL invariante (cero oraciones nuevas), `data-testid` previos preservados.
- **`docs/HANDOFF.md` permanece intacto** durante las líneas; se actualiza solo en consolidación final del operador.

Si una métrica no se cumple, la línea correspondiente lo declara explícito con rationale (incluyendo HU que permanecen parciales por decisión consciente, no por falla).
