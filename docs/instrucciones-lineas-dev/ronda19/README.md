# Ronda 19 — Fase 1 UX: reordenamiento estructural (post-Fase 0)

**Fecha**: 2026-05-08
**Base**: `main` @ commit `a7dfce4` — Fase 0 UX cerrada (P0-1..P0-6 del informe `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md`).
**Objetivo**: ejecutar la **Fase 1** del plan de remediación del informe UI/UX 2026-05-07. Reordenar superficies primarias por **intención**: significado vs vista vs administración. Bajar entropía del chrome. Hacer visible la deuda metodológica. Promover OPD tree y biblioteca como navegación primaria.

> **Nota de partición**: 5 líneas, una de blast radius alto (L2 modo enlace) que define contrato canvas/store, las otras 4 aditivas. La línea L2 ejecuta primero o se aísla en worktree. Ronda 18 fue serial-tres-pasadas (chrome visual); esta es 5-paralelas-disjuntas porque las 5 superficies tocan dominios físicamente separados.

## 1. Filosofía operativa

- **No reinventar**: tokens visuales ya existen en `app/src/ui/tokens.ts`. Toolbar, Inspector, OPL, ArbolOpd, paneles tienen sus archivos de estilos exportados (`toolbarStyles.ts`, `inspectorStyles.ts`, etc.). **Prohibido inventar paleta o escala nueva.**
- **HU como contrato**: cada línea cita HU específicas del backlog vivo (`docs/historias-usuario-v2/`).
- **Aditividad de comportamiento, sustitución acotada de estilo**: la API pública del store, JSX y firmas de componentes se preservan. Reorganización de JSX y nuevos sub-componentes sí permitidos.
- **Preservación dura de testIds y aria-label**: cualquier acción movida a un cluster nuevo, menú secundario o tab debe re-emitir el mismo testId/aria. Si una acción ya tiene smoke con `getByTestId(...)` o `getByLabel(...)`, ese hook debe seguir resolviendo.
- **Loop verde + audit visual obligatorios**: cada línea cierra solo con `bun run check`, `bun run lint`, `bun run browser:smoke` y un audit visual in-vivo con la skill `test-vivo-iterativo-opmkv` que confirme los criterios de salida del informe.

## 2. Reglas duras comunes

1. **Cambios solo aditivos en API**:
   - No renombrar ni eliminar exports de `tokens.ts`, `inspectorStyles.ts`, `toolbarStyles.ts`, `panelOpl/styles.ts`, `arbolOpdStyles.ts`.
   - No cambiar firmas de componentes públicos (`<Inspector />`, `<ArbolOpd />`, `<Toolbar />`, `<PanelOpl />`, `<PanelMetodologia />`, `<PanelAvisos />`).
   - Sí permitido: agregar campos, agregar sub-componentes locales, reorganizar JSX por cluster.
2. **Preservar todos los `data-testid` y `aria-label` existentes**. Si un control en banda pasa al menú `⋯ Más` o a un tab, el testId se conserva en el item del menú/tab.
3. **Tokens existentes únicamente**. Cualquier valor que no salga de `tokens.colors|spacing|radii|shadows|typography` se rechaza. Si necesita un valor nuevo, se agrega a `tokens.ts` con cita en este README.
4. **No tocar dominio funcional**: nada de cambios en `app/src/modelo/**`, `app/src/canvas/**` (excepto L2 que sí toca canvas con scope estricto), `app/src/render/jointjs/**` (excepto L2), `app/src/serializacion/**`, `app/src/opl/**`. Lectura permitida.
5. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`**. Esos archivos los actualiza el operador o steipete al cerrar la ronda.
6. **Anclaje a HU**: cada línea cita las HU UI correspondientes en su sección 2 del brief.
7. **Idiomas**: documentación es-CL; identificadores de código tal como están.
8. **Commits por línea**: cada línea cierra con 1-3 commits con prefijos `feat(...)`, `style(...)` o `refactor(...)`. Co-author footer estándar.
9. **Audit visual obligatorio antes de mergear cada línea**: skill `test-vivo-iterativo-opmkv` con criterios visuales que deriven del informe UI/UX 2026-05-07. La evidencia (screenshots + reporte) se referencia en el commit.
10. **`opm-extracted/` es referencia obligatoria**. Antes de inventar layout de cluster, leer `INDEX.md`, `MODULES.md`, `assets/` y los SVGs de toolbar para reusar patterns.

## 3. Stack y comandos

Working directory: `/home/felix/projects/deep-opm-pro`. Toda app vive en `app/`.

```bash
cd app

# Loop de verificación (obligatorio antes de cerrar cada línea)
bun run check          # typecheck + unit tests (977 unit a no romper)

# Audit funcional UI (obligatorio si toca chrome — todas las líneas tocan chrome)
bun run browser:smoke  # Playwright Chromium (149 smoke a no romper)

# Build (validar peso, esperado ~284 KB)
bun run build

# Dev server para audit visual in-vivo
bun run dev            # localhost:5173 (host 0.0.0.0)
```

Server público disponible en `http://138.201.53.205:5173/` (puerto abierto en ufw).

## 4. Visión general de las 5 líneas

| ID | Título | Pendiente que cierra | HU eje | Tamaño | Riesgo |
|---|---|---|---|---|---|
| L1 | Toolbar agrupada por intención | P0-2 informe UX (toolbar) | EPICA-90 toolbar | M | bajo |
| L2 | Modo enlace con estado canvas | P0-3 informe UX (enlaces) | EPICA-10 enlaces, EPICA-20 canvas | L | **alto** |
| L3 | Issues separados estructura/metodología/estilo | P1 informe UX (validación) | EPICA-50 validación, EPICA-60 OPL | M | medio |
| L4 | OPD tree como navegación primaria con badges | P1 informe UX (OPD tree) | EPICA-30 árbol OPD, EPICA-40 refinamiento | M | bajo |
| L5 | Chip de persistencia visible | P2 informe UX (persistencia) | EPICA-30 persistencia | S | bajo |

Tamaño: S=<2h, M=2-6h, L=>6h.

## 5. Mapa de archivos por línea (tabla de colisiones)

| Archivo | L1 toolbar | L2 enlace | L3 issues | L4 árbol | L5 chip |
|---|---|---|---|---|---|
| `src/ui/Toolbar.tsx` | aditivo | lectura | vacio | vacio | aditivo |
| `src/ui/toolbar/ToolbarBase.tsx` | aditivo | lectura | vacio | vacio | aditivo |
| `src/ui/toolbar/ToolbarCreacion.tsx` | aditivo | aditivo | vacio | vacio | vacio |
| `src/ui/toolbar/ToolbarMas.tsx` | aditivo | vacio | vacio | vacio | vacio |
| `src/ui/toolbar/toolbarStyles.ts` | aditivo | lectura | vacio | vacio | aditivo |
| `src/ui/MenuTipoEnlace.tsx` | vacio | aditivo | vacio | vacio | vacio |
| `src/ui/PanelMetodologia.tsx` | vacio | vacio | aditivo | vacio | vacio |
| `src/ui/PanelAvisos.tsx` | vacio | vacio | aditivo | vacio | vacio |
| `src/ui/ArbolOpd.tsx` | vacio | vacio | vacio | aditivo | vacio |
| `src/ui/ArbolOpd/*` (nuevo subdir) | vacio | vacio | vacio | NUEVO | vacio |
| `src/canvas/modoEnlace.ts` (nuevo) | vacio | NUEVO | vacio | vacio | vacio |
| `src/render/jointjs/handlers/modoEnlace.ts` (nuevo) | vacio | NUEVO | vacio | vacio | vacio |
| `src/store/modelo/acciones-canvas.ts` | vacio | aditivo | vacio | vacio | vacio |
| `src/modelo/validaciones/clasificador.ts` (nuevo) | vacio | vacio | NUEVO | vacio | vacio |
| `src/ui/tokens.ts` | aditivo (clusters) | vacio | aditivo (severidades) | aditivo (badges) | aditivo (chip) |

Sin celdas `aditivo+aditivo` en el mismo archivo cross-líneas. El único conflicto potencial es `tokens.ts` — política: cada línea agrega su sección con bloque comentado `/* L<N> */` para mergeo trivial.

## 6. Protocolo de conciliación

Orden de merge sugerido: **L5 → L4 → L1 → L3 → L2**.

Rationale:
- L5 (chip persistencia): cambio mínimo y aditivo, abre la primera ronda con verde rápido.
- L4 (árbol OPD): bajo riesgo, solo añade badges y reorganiza labels. No toca contrato del store.
- L1 (toolbar agrupada): refactor visual con preservación de testids; merge antes de L2 para que L2 trabaje sobre toolbar agrupada estable.
- L3 (issues separados): toca PanelMetodologia + helpers de clasificación; aditivo.
- L2 (modo enlace): blast radius alto, requiere canvas operativo + toolbar estable. Va al final.

Si dos líneas hacen merge concurrente y chocan en tabla de colisiones: L<menor> precede; L<mayor> rebase sobre L<menor>.

## 7. Anclaje a HU y SSOT

Cada brief cita HU específicas del backlog vivo en `docs/historias-usuario-v2/`. Cuando una línea introduce un patrón nuevo (modo enlace, badge OPD), cita evidencia OPCloud:
- `opm-extracted/INDEX.md` para clases relevantes.
- `opm-extracted/assets/svg/` para iconos.
- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.

## 8. Brief por línea

| ID | Brief |
|---|---|
| L1 | [linea-1-toolbar-agrupada-intencion.md](linea-1-toolbar-agrupada-intencion.md) |
| L2 | [linea-2-modo-enlace-canvas.md](linea-2-modo-enlace-canvas.md) |
| L3 | [linea-3-issues-separados.md](linea-3-issues-separados.md) |
| L4 | [linea-4-opd-tree-navegacion-primaria.md](linea-4-opd-tree-navegacion-primaria.md) |
| L5 | [linea-5-chip-persistencia.md](linea-5-chip-persistencia.md) |

## 9. Verificación al cierre de la ronda

- `bun run check` → 977+ unit pass / 0 fail (cada línea agrega entre 5 y 25 tests).
- `bun run lint` → clean.
- `bun run build` → `index.js` ≤ 320 KB (margen +12% sobre la base 284 KB para crecimiento esperado de Fase 1).
- `bun run browser:smoke` → 149+ smoke pass / 0 fail. Smokes nuevos por línea: L2 ~4, L3 ~2, L4 ~2, L1 ~2, L5 ~1.
- Audit visual in-vivo (skill `test-vivo-iterativo-opmkv`) confirma los criterios de salida específicos del informe UI/UX 2026-05-07 §Plan viable §Fase 1.
- HANDOFF.md actualizado por el operador al cerrar.
