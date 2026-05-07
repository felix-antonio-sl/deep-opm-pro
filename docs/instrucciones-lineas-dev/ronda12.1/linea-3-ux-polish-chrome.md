# Línea 3 — UX polish del chrome (Toolbar tooltips + iconografía Inspector + list-logical en árbol/biblioteca + conteo TraerConectados + delete.svg en menús)

## 1. Misión

Reducir densidad cognitiva del chrome aplicando **iconografía canónica ya disponible en `assets/svg/`** y **tooltips sistemáticos** en botones del toolbar que hoy no tienen `title=`. **No es rediseño**: es polish quirúrgico que rentabiliza assets ya cableables, sin tocar paleta ni estructura. La auditoría comparativa contra `opm-extracted/` reveló que la mayoría de SVGs marcados "ausentes" **ya están en el repo** (`assets/svg/inzoom.svg`, `unfold.svg`, `addStates.svg`, `timeDuration.svg`, `delete.svg`, `list-logical/*.svg`); la deuda es de **cableado**, no de assets.

Triángulo de cambios:

- **Toolbar tooltips sistemáticos**: ~6-8 botones del chrome central no tienen `title=`. Auditar con `grep "title=" app/src/ui/Toolbar.tsx` (~13 ya existen) y completar los faltantes con formato `"Acción · Atajo"`. **No refactor de Toolbar**, solo aditivo `title=` por botón. **Coordinación con L2 (corrección post-V1)**: L2 también edita Toolbar.tsx en 3 puntos restringidos (imports líneas 14/19 → `lazy(...)`; montaje líneas 684-685 → `<Suspense>`) para lazy split de DialogoTraerConectados + DialogoPlantillas. Hunks disjuntos garantizados — L3 toca `title=` en botones del JSX, L2 toca solo imports y wrapper de los dos diálogos. Verificar en `git diff` post-merge L2 que tus hunks no chocan; si chocan, abortar y reportar.
- **Iconografía Inspector**: agregar íconos canónicos en secciones que hoy son texto:
  - `SeccionRefinamiento.tsx`: `inzoom.svg` + `unfold.svg`.
  - `SeccionLayoutEstados.tsx`: `addStates.svg`.
  - `SeccionDuracion.tsx`: `timeDuration.svg`.
- **list-logical en árbol y biblioteca**: cablear `list-logical/{object,objectDashed,process,processDashed}.svg` (en `assets/svg/list-logical/`) en `ArbolOpd.tsx` y `BibliotecaCosa.tsx` para distinguir objeto/proceso e informático/físico (dashed).
- **Conteo por familia en `DialogoTraerConectados`**: hoy muestra 4 checkboxes sin contar candidatos. Agregar conteo derivado de `reglasTraer.ts` por familia (ej. "Procedurales habilitadores · 3 candidatos"). Si el conteo es 0, deshabilitar el checkbox visualmente.
- **`delete.svg` en menús contextuales**: `MenuContextualEntidad.tsx` y `MenuContextualArbol.tsx` usan ítem "Eliminar" en texto plano; agregar ícono. **NO tocar `MenuContextualEnlace.tsx`** (territorio L1 para HU-11.012).

Slice mínimo entregable: feature **chrome polish iconografía + tooltips + conteo**, sin tocar lógica de negocio ni acciones store. Reuso obligatorio de `assets/svg/` (PROVENANCE §2).

**Fuera de slice**:

- **No tocar `app/src/ui/Toolbar.tsx` salvo `title=` aditivo**. NO consolidar duplicación Objeto/Objeto-sticky (decisión vigente desde rondas previas, ver README §2 regla 12). NO refactor de overflow horizontal. NO migrar a tokens (ronda 13).
- **No tocar `app/src/ui/Dialogo.tsx`** (territorio L2).
- **No tocar `app/src/ui/tokens.ts` ni paleta** (territorio L2).
- **No tocar `MenuContextualEnlace.tsx`** (territorio L1 para HU-11.012).
- **No agregar acciones nuevas** en `acciones-canvas.ts`/`acciones-ui.ts`/`store/tipos.ts`. L3 es UI pura.
- **No modificar handlers ni lógica** de `MenuContextual*`, `DialogoTraerConectados`, Inspector secciones; solo agregar elementos visuales.
- **No introducir BarraHerramientasElemento.tsx** (ronda 13 dedicada).
- **No introducir minimapa, dark mode, sprite-sheet modificadores procedurales** (ronda 13).
- **No tocar tests existentes**.

## 2. Deudas que cierra

| Objetivo | Estado actual | Aporte L3 |
|---|---|---|
| **Tooltips Toolbar sistemáticos** | ~13 botones tienen `title=`; ~6-8 faltan (Objeto/Proceso drag inmediato líneas 300/322 aprox., Deshacer/Rehacer, Nuevo/Demo, Cargar, Tipos válidos selector, Biblioteca, Img+Txt/Img/Texto/Respeta líneas 530-540, Desc, Mapa) | Auditar con `grep -nE "<button|title=" app/src/ui/Toolbar.tsx` cruzado para identificar botones sin `title=`. Agregar `title="Acción · Atajo"` (con atajo solo si existe; si no, solo etiqueta). NO modificar onClick, NO modificar styles. |
| **Inspector íconos canónicos** | 3 secciones renderean botones de acción solo con texto | `SeccionRefinamiento.tsx`: agregar `<img src="/assets/svg/inzoom.svg" alt="Inzoom" />` junto al botón "Inzoom" (verificar path de import canónico del repo); `<img src="/assets/svg/unfold.svg" alt="Despliegue" />` junto a "Despliegue out". `SeccionLayoutEstados.tsx`: ícono `addStates.svg` junto a "Agregar estado". `SeccionDuracion.tsx`: ícono `timeDuration.svg` junto al control de duración. **Verificar primero el patrón de import de SVGs en otras secciones** (algunos usan `import` ESM, otros `<img src=...>`). Mantener consistencia. |
| **Árbol y biblioteca con list-logical** | `ArbolOpd.tsx` y `BibliotecaCosa.tsx` renderean nodos sin diferenciar objeto/proceso visualmente | En cada renderItem del árbol: si entidad es `Objeto` con `esInformatico === false` (o equivalente del kernel), usar `list-logical/object.svg`; si es `Objeto` con `esInformatico === true`, usar `objectDashed.svg`; idem para `Proceso`. Verificar primero el discriminante real en `tipos/entidad.ts` (puede ser `esInformatico?` opcional o variante de essence). Si el discriminante no existe en kernel, usar solo `object.svg`/`process.svg` sin variante dashed. |
| **Conteo por familia en DialogoTraerConectados** | 4 checkboxes sin conteo | Para cada familia (procedural-habilitador, procedural-transformador, direccional, estructural), invocar `reglasTraer.contarCandidatos(familia, entidadFoco)` o equivalente (verificar export real en `app/src/canvas/reglasTraer.ts`) y mostrar `"Procedurales habilitadores · {N} candidatos"`. Si N === 0, agregar `disabled={true}` al checkbox + estilo gris. **Si la función no existe**, NO crearla en L3 (sale del scope UI puro); reportar como mejora futura. |
| **delete.svg en menús contextuales** | Texto plano "Eliminar" en `MenuContextualEntidad.tsx` y `MenuContextualArbol.tsx` | Agregar `<img src="/assets/svg/delete.svg" alt="" width={14} height={14} />` antes del label "Eliminar". NO modificar handler `onClick` ni la acción que se invoca. |

**Total esperado**: chrome polish con descubribilidad mejorada + iconografía canónica reusada.

## 3. Anclaje a evidencia

**Nivel 1 — SSOT (citas opcionales en este caso)**:

- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`: V-209 (variantes visuales objeto/proceso informático). **Cita opcional ArbolOpd/BibliotecaCosa list-logical**: `[V-209]`.
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.55, §3.69 (objeto/proceso). **Cita opcional list-logical**: `[Glos 3.55]` o `[Glos 3.69]`.

**Nivel 2 — `app/src/modelo/tipos.ts`**: ronda 12.1 NO modifica tipos kernel. Verificar discriminante `esInformatico?` o equivalente en `tipos/entidad.ts` antes de cablear list-logical.

**Nivel 3 — respaldo técnico (citas obligatorias por contrato visual)**:

- **`docs/JOYAS.md`**: dimensiones canónicas de íconos. **Cita header componentes con SVGs nuevos**: `[JOYAS §2]`.
- **opm-extracted/ verificado**:
  - `opm-extracted/assets/svg/list-logical/{object,objectDashed,process,processDashed}.svg` ✓ (ya copiados a `assets/svg/list-logical/` del repo).
  - `opm-extracted/assets/svg/{inzoom,unfold,addStates,timeDuration,delete}.svg` ✓ (ya en `assets/svg/` del repo).
  - `opm-extracted/src/app/modules/layout/element-tool-bar/element-tool-bar.component.ts`: patrón referencial de `matTooltip` (NO copiar — usar `title=` HTML nativo equivalente).

**Estado actual del código (post-ronda-12, verificado)**:

- `app/src/ui/Toolbar.tsx` (1051 LOC): líneas 300, 322 (Objeto crear vs sticky), líneas 530-540 (Img+Txt/Img/Texto/Respeta), línea 519 (Desc). 13 `title=` ya existen (líneas 277, 292, 309, 343, 354, 394, 404, 422, 428, 530, 540, 571 + alguno más).
- `app/src/ui/inspector/SeccionRefinamiento.tsx`: existe (verificar contenido).
- `app/src/ui/inspector/SeccionLayoutEstados.tsx`: existe.
- `app/src/ui/inspector/SeccionDuracion.tsx`: existe.
- `app/src/ui/ArbolOpd.tsx`: 349 LOC (no usa list-logical hoy).
- `app/src/ui/BibliotecaCosa.tsx`: existe (no usa list-logical hoy).
- `app/src/ui/MenuContextualEntidad.tsx` (70 LOC): tiene 4 ítems texto plano.
- `app/src/ui/MenuContextualArbol.tsx`: existe (verificar).
- `app/src/ui/MenuContextualEnlace.tsx`: **NO TOCAR** (territorio L1).
- `app/src/ui/DialogoTraerConectados.tsx` (124 LOC): 4 checkboxes sin conteo.
- `app/src/canvas/reglasTraer.ts`: verificar export `contarCandidatos` o equivalente.
- `assets/svg/list-logical/`: verificado con `ls`, contiene los 4 SVGs canónicos.
- `assets/svg/`: contiene `inzoom.svg`, `unfold.svg`, `addStates.svg`, `timeDuration.svg`, `delete.svg` (verificado).

## 4. Archivos permitidos

```text
app/src/ui/Toolbar.tsx                             EDIT aditivo (~6-8 title= en botones distintos a líneas 14/19/684-685 que son territorio L2 lazy; NO refactor; NO consolidar Objeto/sticky; NO tokens)
app/src/ui/inspector/SeccionRefinamiento.tsx      EDIT aditivo (íconos inzoom.svg + unfold.svg)
app/src/ui/inspector/SeccionLayoutEstados.tsx     EDIT aditivo (ícono addStates.svg)
app/src/ui/inspector/SeccionDuracion.tsx          EDIT aditivo (ícono timeDuration.svg)
app/src/ui/ArbolOpd.tsx                            EDIT aditivo (íconos list-logical/{object,objectDashed,process,processDashed}.svg si discriminante existe en kernel)
app/src/ui/BibliotecaCosa.tsx                     EDIT aditivo (íconos list-logical/{object,process}.svg)
app/src/ui/MenuContextualEntidad.tsx              EDIT aditivo (ícono delete.svg en ítem "Eliminar"; NO modificar handler)
app/src/ui/MenuContextualArbol.tsx                EDIT aditivo (ícono delete.svg en ítem "Eliminar"; NO modificar handler)
app/src/ui/DialogoTraerConectados.tsx             EDIT aditivo (conteo por familia; deshabilitar checkbox si N===0)
app/src/canvas/reglasTraer.ts                     LECTURA (verificar export `contarCandidatos`; si no existe, reportar)
app/src/modelo/tipos/entidad.ts                   LECTURA (verificar discriminante `esInformatico?` para variante dashed)
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (~2 smokes UX al final del archivo)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
docs/historias-usuario-v2/**                       LECTURA
docs/JOYAS.md                                      LECTURA
assets/svg/**                                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

### Nota arquitectónica

- **Toolbar.tsx no refactor**: la auditoría comparativa propone split en tres bandas — eso es **ronda 13 dedicada UX foundation**. L3 solo agrega `title=` quirúrgicos. Cualquier cambio estructural es bloqueante.
- **Discriminante list-logical**: si `tipos/entidad.ts` no expone `esInformatico?` u otro discriminante, **omitir variante dashed** y usar solo `object.svg`/`process.svg`. Documentar en commit. NO inventar campo nuevo en kernel (sale del scope L3 UI pura).
- **Conteo TraerConectados**: si `reglasTraer.ts` no exporta `contarCandidatos`, **omitir conteo y reportar**. NO crear función nueva en `reglasTraer.ts` (sale del scope ronda corta; podría requerir cambios en módulos kernel).
- **Path de import SVGs**: verificar el patrón usado en otros componentes (`<img src="/assets/svg/...">` vía Vite asset URL, o `import iconUrl from "../../assets/svg/...?url"`). Mantener consistencia con el patrón ya consolidado del repo.

## 5. Restricciones de no-colisión

- **No tocar `app/src/ui/MenuContextualEnlace.tsx`** (territorio L1 para HU-11.012).
- **No tocar `app/src/ui/Dialogo.tsx`** (territorio L2).
- **No tocar `app/src/ui/tokens.ts`** (NUEVO en L2).
- **No tocar `app/src/ui/App.tsx`** (territorio L2 lazy imports).
- **No tocar `app/src/ui/DialogoCargarModelo.tsx`, `DialogoPlantillas.tsx`** (territorio L2 size prop).
- **No tocar `app/src/ui/InspectorEntidad.tsx`** (territorio L1 HU-10.021 si aplica). L3 toca solo las **secciones individuales** del Inspector, no el contenedor.
- **No tocar `acciones-canvas.ts`, `acciones-ui.ts`, `acciones-entidad.ts`, `store/tipos.ts`, `store/persistencia.ts`** (territorio L1 si aplica).
- **No tocar generadores OPL** (`app/src/opl/generadores/*.ts`).
- **No tocar serializadores ni JSON canónico**.
- **No tocar tests existentes** (operacionesBatch.test.ts, store.test.ts, persistencia.test.ts) — territorio L1.
- **No tocar `progress-dashboard.mjs`** (consolidación operador).

## 6. Comportamiento esperado

- **Toolbar tooltips**: pasar el cursor sobre cada botón muestra `title=` con etiqueta + atajo (cuando aplique). Ejemplo formato:
  - `title="Crear objeto · arrastra al canvas"` (botón Objeto drag).
  - `title="Modo creación objeto sticky · clic para activar"` (botón sticky).
  - `title="Deshacer · Ctrl+Z"`.
  - `title="Rehacer · Ctrl+Shift+Z"`.
  - `title="Nuevo modelo"`.
  - `title="Demo · cargar modelo de ejemplo"`.
  - `title="Cargar modelo · Ctrl+O"`.
  - `title="Mapa del sistema · Ctrl+M"`.
- **Inspector íconos**: cada botón de acción en `SeccionRefinamiento`/`SeccionLayoutEstados`/`SeccionDuracion` muestra ícono SVG canónico junto al texto, con `width={16} height={16}` y `alt=""` (decorativo, etiqueta visual ya en texto).
- **ArbolOpd con list-logical**: cada nodo del árbol que representa entidad muestra ícono visual del tipo (object/process; dashed si esInformatico).
- **BibliotecaCosa con list-logical**: idem para tiles del catálogo.
- **DialogoTraerConectados conteo**: cada label de checkbox incluye el conteo derivado:
  ```
  ☐ Procedurales habilitadores · 3 candidatos
  ☐ Procedurales transformadores · 0 candidatos  (deshabilitado, gris)
  ☐ Direccionales · 1 candidato
  ☐ Estructurales · 2 candidatos
  ```
- **MenuContextualEntidad/Arbol delete.svg**: ítem "Eliminar" muestra ícono delete a la izquierda del label, sin cambiar comportamiento del onClick.

## 7. Pruebas requeridas

**Unit tests (~0 nuevos)**: ronda corta de chrome polish; los cambios visuales se verifican por smokes y revisión visual.

**Smoke browser (`app/e2e/opm-smoke.spec.ts`), ~2 nuevos**:

- "UX-tooltips: hover sobre botón Toolbar muestra title con etiqueta+atajo" (tomar 2-3 botones representativos: Deshacer, Cargar, Mapa).
- "UX-conteo-traer: DialogoTraerConectados muestra conteo por familia" (abrir diálogo con entidad seleccionada, verificar que cada checkbox muestra `· N candidatos`).

**Detector**: L3 declara las reglas siguientes para consolidación operador (~0 reglas; chrome polish no cierra HU del backlog):

- (opcional) Si la consolidación quiere registrar evidencia de UX polish, una regla agrupada chrome con paths `Toolbar.tsx` (count `title=` ≥ 20) + `inspector/SeccionRefinamiento.tsx` (string `inzoom.svg`) + `ArbolOpd.tsx` (string `list-logical`) + `DialogoTraerConectados.tsx` (string `candidatos`).

## 8. Métricas esperadas

- **Tests aditivos**: ~0 unit + 2 smokes nuevos.
- **HU cerradas L3 directas**: 0 (chrome polish, no cierra HU; mejora descubribilidad).
- **Reglas detector que esta línea aporta**: ~0-1 regla agrupada opcional.
- **Build**: cero impacto significativo (solo agregamos imports de SVG existentes y `title=`/`<img>` en JSX).
- **Smoke browser**: 81 → ~83.

## 9. Loop verde y commits

```bash
cd app
bun run check          # 659 → ~659 unit
bun run browser:smoke  # 81 → ~83
bun run build          # main chunk sin crecimiento (SVGs son referencias asset URL)
```

Commits sugeridos (orden):

1. `feat(ui): tooltips sistemáticos en Toolbar (descubribilidad)`
2. `feat(inspector): iconografía canónica en secciones Refinamiento/LayoutEstados/Duracion`
3. `feat(arbol): list-logical SVGs en ArbolOpd y BibliotecaCosa`
4. `feat(menu): icono delete.svg en MenuContextualEntidad y MenuContextualArbol`
5. `feat(traer): conteo por familia en DialogoTraerConectados`
6. `test(e2e): smokes UX tooltips + conteo TraerConectados`

Cada commit debe dejar la rama verde. Co-author si aplica.

## 10. Decisiones que tomas vos (documentar en commit)

- **Atajos exactos en tooltips Toolbar**: usar los registrados en `app/src/ui/atajosTeclado.ts`. Si un botón no tiene atajo, solo etiqueta. Documentar tabla final en commit.
- **Patrón de import SVGs**: si el repo usa `import url from "...?url"` o `<img src="/assets/svg/...">` directo, seguir el patrón ya consolidado. Documentar.
- **Discriminante list-logical**: si `tipos/entidad.ts` no expone `esInformatico?` ni equivalente, omitir dashed. Documentar.
- **Conteo TraerConectados**: si `reglasTraer.ts` no exporta `contarCandidatos`, omitir conteo y reportar.
- **Tooltips formato `Acción · Atajo` vs `Acción (Atajo)`**: elegir uno y mantener consistencia. Si el repo ya tiene un patrón consolidado en los `title=` existentes, respetarlo.
- **Si el discriminante list-logical agrega complejidad significativa**: usar solo variantes simples (`object.svg`/`process.svg`) sin dashed. Documentar.
- **Si un Inspector seccion tiene su propio sistema de iconografía** (ej. usa emoji o text-only consciente), respetar y NO forzar SVG (puede ser decisión de diseño previa). Documentar.

## 11. Forma del entregable

Al cierre de L3, declarar:

- Hash final del último commit en main.
- LOC delta por archivo (`git diff --stat HEAD~6`).
- Output de `bun run check`, `bun run browser:smoke`, `bun run build` (último tail).
- Lista de tests aditivos creados + conteo (esperado: ~0 unit + 2 smokes).
- Decisiones declaradas (§10).
- Tabla final de tooltips Toolbar agregados (botón → `title=` text).
- Lista de SVGs cableados por archivo destino.
- Reglas detector declaradas para consolidación operador (§7 final).
- **Citas SSOT agregadas en headers** (`[V-209]`, `[JOYAS §2]`) — RF-2 remediation.
- Bloqueos o desviaciones explícitas con rationale (especialmente: discriminante list-logical, función `contarCandidatos`).
- Confirmación de archivos no tocados (de §5 lista) — **especialmente confirmación de no haber tocado `MenuContextualEnlace.tsx`** (reservado L1).

Si dudás de un caso límite: detente y reporta al operador antes de actuar. Mejor pausar que invadir scope.

Co-author footer en commits si corresponde.
