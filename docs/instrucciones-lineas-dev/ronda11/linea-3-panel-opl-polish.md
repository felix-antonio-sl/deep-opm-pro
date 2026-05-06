# Línea 3 — Panel OPL polish (numeración + posición + minimizar + indentar)

## 1. Misión

Cerrar la **EPICA-50 panel OPL** en sus HU restantes (8 HU pendientes) llevando el panel OPL-ES de su estado actual (visible, numerado, búsqueda + copiar + exportar HTML cubiertos en ronda 10 L5) a la UX completa de OPCloud:

- **Toggle "123"** para alternar prefijos numéricos de oraciones (HU-50.003).
- **Mover panel a lateral**: panel puede colocarse en franja inferior (default) o en panel lateral derecho.
- **Minimizar/Restaurar**: barra colapsada con botón para volver a expandir.
- **Selección por enlace específico** en oraciones multi-enlace (HU-50.021): permite distinguir cuál enlace de una oración con múltiples está siendo referido.
- **Indentación jerárquica**: oraciones de OPDs hijos se indentan según nivel.
- **Expandir/colapsar bloques**: bloques OPL de OPDs hijos se pueden contraer/expandir.
- **Toggle AI Text** (W priority): icon-only para futuras oraciones generadas por LLM (placeholder solo, no implementación funcional).

Slice mínimo entregable: feature **UI panel OPL** sin tocar generadores OPL ni kernel. Toda la lógica vive en `ui/PanelOpl.tsx` + `ui/panelOpl/*` + nuevo `ui/panelOpl/Toolbar.tsx` + `opl/interaccion.ts` extendido.

**Fuera de slice**:
- HU-50.019/.020/.022 (edición OPL bidireccional): peso alto, requiere parser; ronda 12+.
- No tocar generadores OPL (`opl/generadores/*`); estructura de oraciones es invariante.
- Toggle AI Text es solo placeholder UI: NO conectar a nada (LLM no es scope MVP-α).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L3 |
|---|---|---|
| HU-50.003 — Toggle "123" alternar numeración | pendiente | Botón `123` en nuevo `ui/panelOpl/Toolbar.tsx`; persiste en `PreferenciasUiUsuario.oplNumeracionVisible?: boolean`. Default `true`. Cuando off, oculta prefijo `1.`, `2.`... pero mantiene anclas para hover/click. |
| HU-50.004 — Mover panel a panel lateral | pendiente | Botón "Mover a lateral" en Toolbar; persiste `PreferenciasUiUsuario.oplPosicion?: "inferior" \| "lateral-derecho"`. Default `inferior`. Cambia layout en App.tsx. |
| HU-50.005 — Minimizar y detener render | pendiente | Botón "Minimizar" colapsa panel a barra delgada (~24px) con título y botón restaurar. Mientras minimizado, NO renderiza líneas (perf). Persiste `oplMinimizado?: boolean`. |
| HU-50.006 — Restaurar desde barra colapsada | pendiente | Click sobre barra minimizada o botón explícito restaura panel completo. |
| HU-50.021 — Seleccionar enlace en oración multi-enlace | pendiente | En oraciones que mencionan múltiples enlaces (ej. abanicos), cada token enlace es clickeable independiente y dispara `seleccionarEnlace(enlaceId)` específico, no la selección global de la oración. |
| HU-50.026 — Indentar oraciones por nivel OPD | pendiente | Cada bloque OPL hijo se renderiza con `padding-left: 16px * nivel`. Visual claro de jerarquía. |
| HU-50.027 — Expandir/colapsar bloques OPL | C priority | Botón triángulo `▶/▼` al inicio de cada bloque OPD hijo; click expande/colapsa el bloque. Estado en `PreferenciasUiUsuario.oplBloquesContraidos?: Record<Id, true>`. |
| HU-50.028 — Toggle AI Text | W priority | Botón placeholder en Toolbar `AI`; click muestra mensaje "Próximamente" (toast). NO implementación funcional. |

**Total esperado**: 8 HU cubiertas (todas EPICA-50 vivas que faltaban; HU-50.019/.020/.022 quedan como pendientes para ronda 12+ por dependencia de parser).

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` D5-D8: bloques OPL son las oraciones agrupadas por OPD activo. La indentación es ortogonal a la semántica.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §lente OPL: el panel es vista derivada del modelo. UI no altera modelo.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/oplPane/oplPane.component.ts` — sidebar vs bottom toggle + minimize.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/oplPane/oplPane.component.html` — layout de toolbar superior.
- **Estado actual del código (post-ronda-10)**:
  - `app/src/ui/PanelOpl.tsx` (~80 LOC, ronda 10 L5 agregó búsqueda + copiar + exportar): renderiza líneas OPL con tokens interactivos. **L3 extiende con Toolbar superior + reposicionamiento + minimizar.**
  - `app/src/ui/panelOpl/Bloques.tsx`: render de bloques agrupados por OPD. **L3 agrega indentación + toggle expandir/colapsar por bloque.**
  - `app/src/ui/panelOpl/RenderToken.tsx`: render de tokens (entidad/enlace/estado/literal). **L3 NO toca esto; el comportamiento de selección por enlace específico se logra en el handler de click del panel, no en el token.**
  - `app/src/opl/interaccion.ts` (~120 LOC ronda 8): tipos `OplLineaInteractiva`, `OplReferencia`, `filtrarLineasPorReferencia`. **L3 agrega helper `referenciaEnlaceEspecifico(linea, posicionToken)` para HU-50.021.**
  - `app/src/store/modelo/acciones-canvas.ts` (ronda 9.5): tiene `seleccionarDesdeOpl`, `renombrarEntidadDesdeOpl`. **L3 agrega `alternarNumeracionOpl`, `cambiarPosicionOpl`, `minimizarOpl`, `restaurarOpl`, `alternarBloqueContraido`.**
  - `app/src/ui/App.tsx`: layout principal. **L3 EDIT mínimo para soportar `oplPosicion: "lateral-derecho"` con grid template alternativo.**

## 4. Archivos permitidos

```text
app/src/modelo/tipos/ui.ts                        EDIT aditivo (PreferenciasUiUsuario.{oplPosicion?, oplNumeracionVisible?, oplMinimizado?, oplBloquesContraidos?})
app/src/store/tipos.ts                            EDIT aditivo (4-5 acciones panel OPL nuevas)
app/src/store/modelo/acciones-canvas.ts           EDIT extiende (alternarNumeracionOpl, cambiarPosicionOpl, minimizarOpl, restaurarOpl, alternarBloqueContraido)
app/src/store/modelo/acciones-ui.ts               EDIT aditivo opcional (si requiere acción dedicada)
app/src/ui/PanelOpl.tsx                           EDIT extiende (Toolbar superior, lectura de preferencias, layout colapsado)
app/src/ui/panelOpl/Toolbar.tsx                   NUEVO (botones 123, mover, minimizar, AI placeholder)
app/src/ui/panelOpl/Bloques.tsx                   EDIT extiende (indentación + toggle expandir/colapsar bloque)
app/src/ui/panelOpl/Bloques.test.tsx              NUEVO opcional
app/src/ui/App.tsx                                EDIT aditivo (layout dual: bottom panel vs lateral panel)
app/src/opl/interaccion.ts                        EDIT extiende (referenciaEnlaceEspecifico)
app/src/opl/interaccion.test.ts                   EDIT aditivo
app/e2e/opm-smoke.spec.ts                         EDIT aditivo (smokes panel OPL polish)
opm-extracted/**                                  LECTURA
docs/HANDOFF.md                                   LECTURA
docs/historias-usuario-v2/**                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar generadores OPL**: `opl/generar.ts`, `opl/generadores/*`. La estructura de oraciones es invariante.
- **No tocar `acciones-opd.ts`** (territorio L1).
- **No tocar `acciones-enlace.ts` ni `acciones-entidad.ts`** (territorio L4).
- **No tocar `ArbolOpd.tsx`, `arbol/*`** (territorio L1).
- **No tocar `Dialogo*.tsx`, `MenuPrincipal.tsx`, `PantallaInicio.tsx`** (territorio L2).
- **No tocar `Toolbar.tsx`, `BibliotecaCosa.tsx`, `MenuTipoEnlace.tsx`** (territorio L4).
- **No tocar `runtime.ts`, `progress-dashboard.mjs`** (territorio L5).
- **`tipos/ui.ts`**: L3 agrega 4 campos opcionales del panel OPL. Disjunto de L1 (5 prefs árbol+OPL navegación) y L2 (recientes+orden cargar).
- **`PanelOpl.tsx`**: L3 reescribe layout a tener Toolbar superior + cuerpo. L5 agregará indicador read-only en Toolbar (hunk pequeño separado).
- **`acciones-canvas.ts`**: L3 agrega 5 acciones panel OPL. L4 agrega 3 acciones modelado. Hunks disjuntos.
- **`App.tsx`**: L3 toca solo el grid template / layout para soportar lateral-derecho. Otras líneas no tocan App.tsx.

## 6. Comportamiento esperado

- **Toolbar superior del panel** con orden: `[ ▼ Minimizar ]` `[ 🔢 123 ]` `[ ↔ Posición ]` `[ AI ]` `[ 🔍 Buscar... ]` `[ 📋 Copiar ]` `[ 📤 Exportar ]`. Los últimos 3 ya existen (ronda 10 L5).
- **Minimizar**: panel colapsa a barra de 24-32px alto que muestra "OPL · N oraciones · [Restaurar]". Mientras minimizado, `useEffect` evita re-renderizar líneas (memoización).
- **Restaurar**: click sobre barra minimizada o botón explícito vuelve al alto previo.
- **Mover a lateral**: botón cicla entre "Inferior" (default) ↔ "Lateral derecho". Layout cambia en `App.tsx`:
  - Inferior: grid 3 filas (Toolbar / Canvas + Inspector / OPL).
  - Lateral derecho: grid 4 columnas (Árbol / Canvas / Inspector / OPL). Inspector se acomoda según ancho disponible.
- **Toggle 123**: oculta los prefijos numéricos visualmente con CSS `opacity: 0` o display none, manteniendo el ancla para hover/click. Tests existentes con `data-testid="opl-line"` siguen funcionando.
- **Selección enlace específico**: en oraciones que enumeran ≥2 enlaces (ej. abanicos OR/XOR: "X invoca a A, B y C"), cada nombre/token clickeable dispara selección del enlace correspondiente. Si dos enlaces comparten un endpoint, se distingue por el `enlaceId` registrado en el token interactivo.
- **Indentación**: cada bloque OPL hijo (OPD descompuesto/desplegado) tiene `style={{paddingLeft: 16 * nivel}}px` con borde izquierdo sutil para visualizar jerarquía. Nivel 0 = SD raíz, nivel 1 = OPD hijo directo, etc.
- **Expandir/colapsar bloque**: botón triángulo al inicio del header de bloque (`▶ SD1: Procesar descompuesto` / `▼ SD1: Procesar descompuesto`). Click alterna `oplBloquesContraidos[opdId]`. Cuando contraído, oraciones del bloque ocultas pero el header visible.
- **Toggle AI**: click muestra toast/dialog informativo "Próximamente: oraciones generadas por LLM" y NO hace nada más. El icon es persistente (placeholder).

## 7. Pruebas requeridas

**Unit tests**:

- `interaccion.test.ts`: `referenciaEnlaceEspecifico(linea, tokenIndex)` retorna `OplReferencia` con `enlaceId` correcto incluso si la línea menciona varios enlaces.
- `Bloques.test.tsx`: render con bloques de niveles 0/1/2 → verificar `paddingLeft` correcto. Click en triángulo alterna estado contraído.

**Smoke browser** (~6 nuevos):

- "OPL toggle 123 oculta numeración manteniendo selección": estado inicial visible, click en `123`, prefijos invisibles, click en oración sigue seleccionando.
- "OPL minimiza panel y muestra barra colapsada": click `Minimizar`, panel reducido a barra, click sobre barra restaura.
- "OPL mueve panel a lateral derecho y persiste": click `Mover a lateral`, layout cambia, recargar, layout permanece lateral.
- "OPL bloques se indentan por nivel OPD": modelo con descomposición → bloques hijos con `padding-left` mayor que raíz.
- "OPL bloque se contrae con triángulo": click en `▶`, oraciones del bloque ocultas; click en `▼`, visibles.
- "OPL selecciona enlace específico en oración multi-enlace": modelo con abanico OR (2 enlaces compartidos), click en token de enlace 1, verificar `enlaceSeleccionId` apunta al enlace 1; click en enlace 2, apunta al 2.

## 8. Métricas esperadas

- **Tests aditivos**: ~6 unit + 6 smokes nuevos.
- **HU cerradas**: 8 HU pendientes (toda EPICA-50 viva cerrable).
- **Reglas detector ronda 11 que esta línea aporta**:
  - HU-50.003 → 1 regla (toggle 123).
  - HU-50.004/.005/.006 → 1 regla (posición + minimizar + restaurar).
  - HU-50.021 → 1 regla (selección enlace específico).
  - HU-50.026/.027 → 1 regla (indentación + colapsar bloque).
  - HU-50.028 → 1 regla (placeholder AI).
  - **Total estimado**: 5 reglas nuevas.
- **Build**: chunk principal + ~1-3 KB. Despreciable.
- **Smoke browser**: 59 → ~65 (con L1 + L2 ya integradas).

## 9. Loop verde y commits

```bash
cd app
bun run check          # 597 → ~605 unit
bun run browser:smoke  # 59 → ~65 (con L1+L2)
bun run build          # main chunk objetivo < 168 KB / < 45 KB gzip
```

Commits sugeridos:

1. `feat(opl): Toolbar superior con botones canónicos (HU-50.003/.004/.005/.028)`
2. `feat(opl): toggle numeración 123 (HU-50.003)`
3. `feat(opl): minimizar/restaurar panel (HU-50.005/.006)`
4. `feat(opl): mover panel a lateral derecho (HU-50.004)`
5. `feat(opl): indentación jerárquica + colapsar bloques (HU-50.026/.027)`
6. `feat(opl): selección enlace específico en oración multi (HU-50.021)`
7. `feat(opl): placeholder AI Text (HU-50.028)`
8. `test(e2e): smokes panel OPL polish (6 nuevos)`

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Layout lateral derecho rompe diseño Inspector**: Inspector ya ocupa lateral derecho en algunas configuraciones. | Cuando OPL es lateral-derecho, Inspector y OPL comparten panel derecho dividido (50/50 default, divisor arrastrable). Si Inspector está oculto, OPL ocupa todo el lateral. |
| **Memoización de Bloques contra re-render** mientras minimizado: si state interno cambia (selección, hover), bloques re-renderizan innecesariamente. | `useMemo` sobre lista de bloques; deps explícitas. Si minimizado, return null directamente sin computar. |
| **Indentación con paddingLeft excesivo en niveles profundos** (>5) causa scroll horizontal. | Cap de nivel a 4 visual; niveles >4 todos comparten `paddingLeft = 64px` con badge de nivel real. |
| **`oplBloquesContraidos` crece sin límite** si el operador colapsa muchos OPDs. | Persistencia en preferencias OK; limpiar entradas para OPDs eliminados al cargar modelo. |
| **HU-50.021 multi-enlace requiere mapeo token → enlaceId**: si el token no tiene metadata suficiente. | El generador ya emite tokens con `OplReferencia` específica por enlace. Verificar en `interaccion.ts` que `linea.referencias` distingue enlaces. Si no, agregar campo `tokenEspecifico` aditivo. |
| **Toggle 123 vs lectores de pantalla**: ocultar visualmente debe mantener accesibilidad. | Usar `aria-hidden="true"` solo en el span del prefijo si invisible, no `display:none`. Texto sigue accesible para lectores. |
| **Choque con L5 read-only**: L5 agregará indicador read-only en Toolbar. | L5 agrega un botón/icon adicional al Toolbar al final, sin tocar los botones de L3. Hunks disjuntos. |

## 11. Salida esperada

Al cierre de L3, el operador debe poder:

- Alternar visibilidad de numeración con un click.
- Mover panel OPL a la posición que prefiera (inferior o lateral derecho).
- Minimizar el panel para liberar espacio del canvas.
- Distinguir cuál enlace seleccionar en oraciones complejas.
- Ver claramente la jerarquía OPD por indentación.
- Contraer bloques de OPDs hijos para simplificar la lectura.

EPICA-50 cierra en sus 8 HU pendientes; quedan HU-50.019/.020/.022 (edición OPL bidireccional) como ronda futura por requerir parser. MVP-α avanza ~6 puntos porcentuales por L3.
