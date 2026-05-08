# Ronda 20 — Fase 2 UX: Inspector y OPL como producto serio

**Fecha**: 2026-05-08
**Base**: `main` @ commit `a7dfce4` (cierre Fase 0 UX) más la ejecución acumulativa de **ronda 19 / Fase 1 UX** cuando esté mergeada.
**Objetivo**: ejecutar la **Fase 2** del plan de remediación del informe UI/UX 2026-05-07 (`docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md` §"Plan viable de remediacion §Fase 2 - Inspector y OPL como producto serio, 2 a 3 semanas"). Bajar entropía del Inspector partiéndolo por intención semántica. Hacer honestos los contratos de OPL editor y biblioteca. Promover la creación de estados a primer nivel metodológico.

> **Nota de partición**: 4 líneas. Una de blast radius medio (L2 OPL editor, redefine la barra de edición en `panelOpl/Toolbar.tsx` y agrega un planificador honesto). Las otras 3 son aditivas con dominio físico distinto (Inspector, BibliotecaCosa, SeccionLayoutEstados). No hay líneas con blast radius alto: la Fase 2 es polish sobre superficies maduras, no rediseño de canvas.

## 1. Filosofía operativa

- **No reinventar**: tokens visuales viven en `app/src/ui/tokens.ts`. Inspector, OPL panel, BibliotecaCosa y SeccionLayoutEstados ya tienen estilos inline + tokens. **Prohibido** inventar paleta nueva.
- **HU como contrato**: cada línea cita HU específicas del backlog vivo (`docs/historias-usuario-v2/`). Las HU "nuevas" se declaran en el commit como propuestas; el operador decide formalizarlas. Como en ronda 19, los IDs nuevos usan rangos altos por épica para no chocar con HU canónicas existentes.
- **Aditividad de comportamiento, sustitución acotada de estilo**: las firmas públicas de `<Inspector />`, `<InspectorEntidad />`, `<PanelOpl />`, `<BibliotecaCosa />`, `<SeccionLayoutEstados />` se preservan. Sí permitido: introducir sub-componentes locales, reorganizar JSX por tab/sección, agregar campos al store solo cuando la línea lo justifica.
- **Preservación dura de testIds y aria-label**: cualquier acción movida a un tab nuevo, panel dockable o sub-sección debe re-emitir el mismo testId/aria. Si una acción ya tiene smoke con `getByTestId(...)` o `getByLabel(...)`, ese hook debe seguir resolviendo. Regla 5.5 ronda 18 sigue vigente.
- **Loop verde + audit visual obligatorios**: cada línea cierra solo con `bun run check`, `bun run lint`, `bun run browser:smoke` y un audit visual in-vivo con la skill `test-vivo-iterativo-opmkv` que confirme los criterios de salida del informe. La evidencia (screenshots + reporte) se referencia en el commit.

## 2. Reglas duras comunes

1. **Cambios solo aditivos en API**:
   - No renombrar ni eliminar exports de `inspectorStyles.ts`, `panelOpl/*` (Toolbar, Bloques, RenderToken), `BibliotecaCosa.tsx`, `tokens.ts`, `inspector/*`.
   - No cambiar firmas de componentes públicos (`<Inspector />`, `<InspectorEntidad />`, `<InspectorEnlace />`, `<PanelOpl />`, `<BibliotecaCosa />`, `<SeccionLayoutEstados />`).
   - Sí permitido: agregar campos al store, agregar sub-componentes locales, reorganizar JSX por tab/sección/dock.
2. **Preservar todos los `data-testid` y `aria-label` existentes**. Si un control en sección plana pasa a un tab del Inspector, el testId se conserva en el tab. Si la BibliotecaCosa cambia de overlay a panel dock, los `biblioteca-item-${id}` siguen vivos.
3. **Tokens existentes únicamente**. Cualquier valor que no salga de `tokens.colors|spacing|radii|shadows|typography` se rechaza. Si necesita un valor nuevo, se agrega a `tokens.ts` con cita en este README.
4. **No tocar dominio funcional**: cero cambios en `app/src/modelo/**` (excepto helpers puros nuevos para previews honestos), `app/src/canvas/**`, `app/src/render/jointjs/**`, `app/src/serializacion/**`, `app/src/opl/**` (excepto agregar funciones planificadoras puras testeables, ver L2). Lectura permitida.
5. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`**. Esos archivos los actualiza el operador o steipete al cerrar la ronda.
6. **Anclaje a HU**: cada línea cita las HU existentes correspondientes y, si propone HU nuevas, las declara en el commit como propuestas con ID en rango libre (ej. `HU-50.040+`, `HU-13.050+`).
7. **Idiomas**: documentación es-CL; identificadores de código tal como están.
8. **Commits por línea**: cada línea cierra con 1-3 commits con prefijos `feat(...)`, `style(...)`, `refactor(...)` o `test(...)`. Co-author footer estándar.
9. **Audit visual obligatorio antes de mergear cada línea**: skill `test-vivo-iterativo-opmkv` con criterios visuales que deriven del informe UI/UX 2026-05-07 §Fase 2.
10. **`opm-extracted/` es referencia obligatoria**. Antes de inventar layout de tabs, lectura de `INDEX.md`, `MODULES.md`, los SVG de inspector/biblioteca y los componentes Angular de OPCloud (`OpdNodeComponent`, `LibraryComponent`, `InspectorComponent`) para reusar patrones. Si se rompe esa regla, la línea se rechaza.

## 3. Stack y comandos

Working directory: `/home/felix/projects/deep-opm-pro`. Toda la app vive en `app/`.

```bash
cd app

# Loop de verificación (obligatorio antes de cerrar cada línea)
bun run check          # typecheck + unit tests (977 unit a no romper, +Δ por línea)

# Audit funcional UI (obligatorio si toca chrome — todas las líneas tocan chrome)
bun run browser:smoke  # Playwright Chromium (149 smoke a no romper, +Δ por línea)

# Build (validar peso, esperado ~284 KB pre-Fase 2; tope 340 KB)
bun run build

# Dev server para audit visual in-vivo
bun run dev            # localhost:5173 (host 0.0.0.0)
```

Server público disponible en `http://138.201.53.205:5173/` (puerto abierto en ufw).

## 4. Visión general de las 4 líneas

| ID | Título | Pendiente del informe que cierra | HU eje | Tamaño | Riesgo |
|---|---|---|---|---|---|
| L1 | Inspector en tabs Semántica/Enlaces/Refinamiento/Apariciones/Estilo | informe §P1 inspector líneas 98-114 | EPICA-11/EPICA-17 inspector | M | bajo |
| L2 | OPL editor honesto: texto vs sentencias reconocidas vs cambios aplicables/no aplicables | informe §P1 OPL líneas 132-147 | EPICA-50 panel OPL | M-L | medio |
| L3 | Biblioteca dockable junto al árbol OPD con búsqueda y filtros | informe §P1 biblioteca líneas 149-159 | EPICA-19 biblioteca, EPICA-20 árbol OPD | M | bajo |
| L4 | Creación de estados con nombres reales y preview OPL | informe §P1 inspector líneas 102, 114 | EPICA-13 estados | S-M | bajo |

Tamaño: S=<2h, M=2-6h, L=>6h.

## 5. Mapa de archivos por línea (tabla de colisiones)

| Archivo | L1 inspector tabs | L2 OPL editor | L3 biblioteca dock | L4 estados con nombres |
|---|---|---|---|---|
| `src/ui/Inspector.tsx` | aditivo | vacio | vacio | vacio |
| `src/ui/InspectorEntidad.tsx` | aditivo | vacio | vacio | vacio |
| `src/ui/InspectorEnlace.tsx` | aditivo | vacio | vacio | vacio |
| `src/ui/inspector/InspectorTabs.tsx` (NUEVO) | NUEVO | vacio | vacio | vacio |
| `src/ui/inspector/SeccionLayoutEstados.tsx` | aditivo (mover a tab Semántica) | vacio | vacio | aditivo (modal de creación) |
| `src/ui/inspector/SeccionRefinamiento.tsx` | aditivo (mover a tab Refinamiento) | vacio | vacio | vacio |
| `src/ui/inspector/SeccionApariciones.tsx` (NUEVO) | NUEVO | vacio | vacio | vacio |
| `src/ui/inspectorStyles.ts` | aditivo (tabs styles) | vacio | vacio | vacio |
| `src/ui/PanelOpl.tsx` | vacio | aditivo | vacio | vacio |
| `src/ui/panelOpl/Toolbar.tsx` | vacio | aditivo | vacio | vacio |
| `src/ui/panelOpl/EditorOplHonesto.tsx` (NUEVO) | vacio | NUEVO | vacio | vacio |
| `src/opl/parser.ts` | vacio | aditivo (planificador clasificador) | vacio | vacio |
| `src/opl/clasificadorEdicion.ts` (NUEVO) | vacio | NUEVO (puro) | vacio | vacio |
| `src/ui/BibliotecaCosa.tsx` | vacio | vacio | aditivo | vacio |
| `src/ui/biblioteca/BibliotecaDock.tsx` (NUEVO) | vacio | vacio | NUEVO | vacio |
| `src/ui/biblioteca/filtrosBiblioteca.ts` (NUEVO) | vacio | vacio | NUEVO | vacio |
| `src/ui/App.tsx` | aditivo (zindex inspector tabs) | vacio | aditivo (mount dock) | vacio |
| `src/ui/inspector/ModalCrearEstados.tsx` (NUEVO) | vacio | vacio | vacio | NUEVO |
| `src/store/uiPanel.ts` | vacio | vacio | aditivo (bibliotecaDock) | vacio |
| `src/store/sliceTypes.ts` | vacio | vacio | aditivo (bibliotecaDockAbierto) | vacio |
| `src/store/modelo/acciones-ui.ts` | aditivo (tab activo Inspector) | vacio | aditivo (toggle dock) | vacio |
| `src/ui/tokens.ts` | aditivo (tabs) | aditivo (clasificador edicion) | aditivo (dock) | aditivo (modal estados) |

Sin celdas `aditivo+aditivo` en el mismo archivo cross-líneas. Únicas excepciones controladas:
- `tokens.ts`: cada línea agrega su sección con bloque comentado `/* L<N> ronda 20 */` para mergeo trivial. Igual política que ronda 19.
- `App.tsx`: L1 toca z-index del pane Inspector, L3 monta el dock biblioteca como sibling del tree-pane. Ambas zonas son JSX disjunto. Anchor comments para coordinación.
- `acciones-ui.ts`: L1 agrega `cambiarTabInspector(tab)`, L3 agrega `toggleBibliotecaDock()`. Acciones distintas, no chocan.

## 6. Protocolo de conciliación

Orden de merge sugerido: **L4 → L3 → L1 → L2**.

Rationale:
- **L4 (estados con nombres)** primero: cambio mínimo, refactor de un modal contained dentro de SeccionLayoutEstados. Verde rápido. Sirve de calentamiento.
- **L3 (biblioteca dock)** segundo: bajo riesgo, agrega componente nuevo + slice en store + toggle. No depende de tabs.
- **L1 (inspector tabs)** tercero: refactor visual con preservación de testIds. Va antes de L2 porque define cómo se navega la columna derecha (afecta cómo el OPL editor honesto se relaciona con Inspector cuando se abre un enlace por OPL).
- **L2 (OPL editor honesto)** al final: blast radius mediano, agrega planificador puro + reescribe modo edición de PanelOpl con clasificación. Va al final para que el resto de Fase 2 esté cerrado y los smokes de OPL se puedan estabilizar sobre tabs ya mergeados.

Si dos líneas hacen merge concurrente y chocan en tabla de colisiones: L<menor> precede; L<mayor> rebase sobre L<menor>.

**Dependencia con ronda 19**: ninguna línea de ronda 20 depende estrictamente de ronda 19. Pueden ejecutarse en paralelo. **Pero**: si ronda 19 L1 (toolbar agrupada) cierra antes, ronda 20 L3 (biblioteca dock) puede aprovechar el cluster Vista para añadir el toggle "Biblioteca". Si no, L3 monta el toggle en su slot existente (`abrir-biblioteca-cosa`).

## 7. Anclaje a HU y SSOT

Cada brief cita HU específicas del backlog vivo en `docs/historias-usuario-v2/epicas/`. Cuando una línea propone una HU nueva, usa rango alto por épica:
- EPICA-11 inspector: HU-11.030+ libre.
- EPICA-13 estados: HU-13.050+ libre.
- EPICA-17 objetos avanzados: HU-17.050+ libre.
- EPICA-19 biblioteca: HU-19.030+ libre.
- EPICA-20 árbol OPD: HU-20.030+ libre.
- EPICA-50 panel OPL: HU-50.040+ libre.

Evidencia OPCloud:
- `opm-extracted/INDEX.md` y `opm-extracted/MODULES.md` para clases relevantes (`InspectorComponent`, `LibraryComponent`, `OplPaneComponent`, `OpdNodeComponent`).
- `opm-extracted/assets/svg/` y `opm-extracted/assets/png/` para iconos canónicos.
- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Auditoría UX vigente: `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md` (intocable, evidencia histórica).

## 8. Brief por línea

| ID | Brief |
|---|---|
| L1 | [linea-1-inspector-tabs.md](linea-1-inspector-tabs.md) |
| L2 | [linea-2-opl-editor-honesto.md](linea-2-opl-editor-honesto.md) |
| L3 | [linea-3-biblioteca-dockable.md](linea-3-biblioteca-dockable.md) |
| L4 | [linea-4-estados-con-nombres-reales.md](linea-4-estados-con-nombres-reales.md) |

Prompt de asignación: [prompt-asignacion.md](prompt-asignacion.md).

## 9. Verificación al cierre de la ronda

- `bun run check` → 977+ unit pass / 0 fail (cada línea agrega entre 8 y 25 tests).
- `bun run lint` → clean.
- `bun run build` → `index.js` ≤ 340 KB (margen +20% sobre 284 KB para crecimiento esperado de Fase 2; OPL editor honesto agrega bytes).
- `bun run browser:smoke` → 149+ smoke pass / 0 fail. Smokes nuevos por línea: L1 ~3, L2 ~4, L3 ~3, L4 ~2.
- Audit visual in-vivo (skill `test-vivo-iterativo-opmkv`) confirma los criterios de salida específicos del informe UI/UX 2026-05-07 §Fase 2.
- HANDOFF.md actualizado por el operador al cerrar la ronda.

## 10. Definition of done de la ronda

Una línea está "lista" cuando:

1. Loop verde local: `bun run check` + `bun run lint` + `bun run browser:smoke` + `bun run build`.
2. Audit visual con skill `test-vivo-iterativo-opmkv` documentado y los criterios de salida del informe (literales abajo) están confirmados.
3. Tests nuevos del brief están escritos y verdes.
4. testIds y aria-labels existentes intactos.
5. Tokens nuevos (si los hay) registrados en `tokens.ts` y citados en commit.
6. HU nuevas (si las hay) declaradas en commit con ID propuesto.
7. Commit con co-author footer estándar.
8. Reporte final con hash, métricas, decisiones tomadas, bloqueos, y desviaciones documentadas.

**Criterios de salida del informe que cierra cada línea** (texto literal §Fase 2 + §Evals mínimos):

- **L1 Inspector tabs** — "Al seleccionar un proceso descompuesto, la primera pantalla del inspector debe mostrar significado y refinamiento principal sin scroll excesivo." (informe línea 114).
- **L2 OPL editor honesto** — "Al editar OPL, antes de aplicar debe quedar claro que cambios modificaran el modelo y cuales son solo texto no accionable." (informe línea 147).
- **L3 Biblioteca dock** — "Abrir la biblioteca no debe tapar el area central del modelo salvo en mobile. Debe poder quedar visible mientras se navega el canvas." (informe línea 159).
- **L4 Estados con nombres** — "Crear estados debe pedir nombres reales y mostrar preview OPL antes de aplicar." (informe línea 114, segunda parte).

## 11. Anti-patrones a evitar

| Anti-patrón | Razón del rechazo |
|---|---|
| Tab gigante con todo dentro | Anula el propósito de tabs; cada tab debe tener responsabilidad clara |
| Editor OPL "modo libre" sin clasificación | Volvemos al estado pre-Fase 2; rechazado |
| Biblioteca dock que reemplaza el árbol | El árbol es navegación primaria; biblioteca convive |
| Estados creados con `estado1/estado2/estadoN` por default | El informe lo señala como pobre; rechazo absoluto |
| Mover smoke ids a otros componentes silenciosamente | Romper smokes es regresión; usar regla 5.5 ronda 18 |
| Inventar tokens nuevos para chrome | Política tokens-only; agregar a `tokens.ts` con cita |
| Commit sin loop verde verificado localmente | Definition of done lo prohíbe |
| Tocar `docs/HANDOFF.md` o `docs/historias-usuario-v2/` durante la línea | Reservado al operador |
