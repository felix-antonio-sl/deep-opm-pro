# Ronda 18 — Refactor visual chrome (post-Beta1)

**Fecha**: 2026-05-07
**Base**: `main` @ commit `16bebbd` — ronda 15 cerrada (Beta0 hardening), ronda 16 (Beta1) y ronda 17 (Beta2) ya planificadas en paralelo.
**Objetivo**: cerrar el bug visual reportado en `docs/bugs/BUG-20260507T212356Z-692129/` ("paneles horribles") con un refactor visual de tres superficies de chrome UI sin tocar dominio funcional ni semántica OPM.

> **Nota de forma**: esta ronda contiene **una sola línea con 3 pasadas seriales** (P1 → P2 → P3), no la partición típica de N líneas paralelas. Justificación: el operador pidió empacarlo así porque las 3 superficies son pequeñas, los archivos son disjuntos, el riesgo es bajo, y la auditoría visual in-vivo conviene encadenarse de menor a mayor blast radius. La forma del README, brief y prompt se mantiene fiel al patrón canónico de la skill `lineas-paralelas`.

## 1. Filosofía operativa

- **No reinventar**: tokens visuales ya existen en `app/src/ui/tokens.ts` (spacing 4/8/12/16/24/32, typography sizes 10–18 con weights 400/500/600/700, paleta `chrome*`/`borde*`/`texto*`/`acentoUi*`). **Prohibido inventar paleta o escala nueva.**
- **HU como contrato**: cada pasada está anclada a HU UI específicas (EPICA-50 panel OPL, EPICA-30 persistencia, EPICA-90 interacción/shortcuts). El refactor no agrega funciones nuevas — reagrupa, ajusta densidad y arregla truncamientos.
- **Aditividad de comportamiento, sustitución acotada de estilo**: el JSX puede reorganizarse y los `style` literales pueden tocarse. No cambia handlers, ni el store, ni firmas exportadas.
- **Preservación dura de testIds/aria**: todos los `data-testid` y `aria-label` actuales viven. Si una acción se mueve al menú `⋯ Más`, el testId se reemite desde el item del menú con el mismo nombre.
- **Loop verde obligatorio + audit visual**: ninguna pasada cierra sin `bun run check` y `bun run browser:smoke` en verde, y sin un audit visual in-vivo con la skill `test-vivo-iterativo-opmkv` que confirme que los 3 problemas reportados desaparecen sin regresión.

## 2. Reglas duras comunes

1. **Cambios solo aditivos en API**:
   - No renombrar ni eliminar exports de `tokens.ts`, `inspectorStyles.ts`, `toolbarStyles.ts`.
   - No cambiar firmas de los componentes (`<Inspector />`, `<PersistenciaJson />`, `<ToolbarOpl />`, `<ToolbarBase />`, `<ToolbarCreacion />`).
   - Sí permitido: agregar nuevos campos a los objetos de estilos exportados, agregar nuevos sub-componentes locales, reorganizar JSX.
2. **Preservar todos los `data-testid` y `aria-label`** existentes en los archivos tocados. Si un control en banda pasa al menú `⋯ Más`, el testId se conserva en el item del menú.
3. **Tokens existentes únicamente**. Cualquier valor que no salga de `tokens.colors|spacing|radii|shadows|typography` se rechaza. Si se necesita un valor nuevo (ej. ancho de cluster), agregarlo a `tokens.ts` con cita en este README.
4. **No tocar dominio funcional**: nada de cambios en `app/src/modelo/**`, `app/src/store/**`, `app/src/canvas/**`, `app/src/render/**`, `app/src/serializacion/**`, `app/src/opl/**`. Lectura permitida.
5. **No tocar HANDOFF.md ni `docs/historias-usuario-v2/`**.
6. **Anclaje a HU**: cada pasada cita las HU UI correspondientes en su sección 2 del brief.
7. **Idiomas**: documentación es-CL; identificadores de código tal como están.
8. **Commits por pasada**: 3 commits exactos en el orden P1 → P2 → P3, con prefijos `style(...)` o `refactor(...)`. Co-author footer estándar.
9. **Audit visual obligatorio antes de mergear cada pasada**: `Skill test-vivo-iterativo-opmkv` con criterios visuales que deriven del bug reportado y de los mockups del brief. La evidencia (screenshots + reporte) queda referenciada en el commit.

## 3. Stack y comandos

Working directory: `/home/felix/projects/deep-opm-pro`. Toda app vive en `app/`.

```bash
cd app

# Loop de verificación (obligatorio antes de cerrar cada pasada)
bun run check          # typecheck + unit tests (283 unit a no romper)

# Audit funcional UI (obligatorio si toca chrome — todas las pasadas tocan chrome)
bun run browser:smoke  # Playwright Chromium (34 smoke a no romper)

# Build (validar peso, esperado ~843 KB)
bun run build

# Dev server para audit visual in-vivo
bun run dev            # localhost:5173
```

Audit visual in-vivo (obligatorio antes de mergear cada pasada):

```
Skill: test-vivo-iterativo-opmkv
Foco: <superficie de la pasada>
Criterios: derivados del bug BUG-20260507T212356Z-692129 + mockup del brief sección 6.x
Salida: reporte ejecutivo + screenshots actualizados que reemplazan al previo
```

## 4. Visión general

| ID | Título | Pasadas | Pendiente que cierra | HU eje | Tamaño | Riesgo |
|---|---|---|---|---|---|---|
| **L1** | Refactor visual chrome (post-Beta1) | P1 + P2 + P3 | BUG-20260507T212356Z-692129 | HU-30.x (Modelos locales), HU-50.018/023/024/025 (toolbar OPL), EPICA-90 (toolbar superior) | M | bajo a medio |

**Pasadas internas de L1** (seriales, mismo brief, commits separados):

| Pasada | Superficie | Archivos dominio | Riesgo |
|---|---|---|---|
| **P1** | Inspector vacío + file picker | `Inspector.tsx`, `PersistenciaJson.tsx`, `inspectorStyles.ts` | bajo |
| **P2** | Cabecera panel OPL | `panelOpl/Toolbar.tsx` | bajo |
| **P3** | Toolbar superior | `toolbar/ToolbarBase.tsx`, `toolbar/ToolbarCreacion.tsx`, `toolbar/toolbarStyles.ts` | medio |

## 5. Mapa de archivos por pasada (tabla de colisiones)

Convención: `aditivo` = solo agregar (en estilos exportados o en JSX). `EDIT` = reorganizar JSX y reemitir estilos sin renombrar exports. `lectura` = consulta. Casilla vacía = sin contacto.

| Archivo | P1 | P2 | P3 |
|---|---|---|---|
| `app/src/ui/Inspector.tsx` | EDIT (rediseñar `InspectorVacio`, envolver `<PersistenciaJson />` en `<details>`) | — | — |
| `app/src/ui/PersistenciaJson.tsx` | EDIT (file picker custom, tarjetas) | — | — |
| `app/src/ui/inspectorStyles.ts` | aditivo (`vacioCard`, `vacioTitle`, `vacioBody`, `vacioCaption`) | — | — |
| `app/src/ui/panelOpl/Toolbar.tsx` | — | EDIT (3 clusters, dividers, tipografía 12, height 28) | — |
| `app/src/ui/panelOpl/Bloques.tsx` | — | lectura | — |
| `app/src/ui/toolbar/ToolbarBase.tsx` | — | — | EDIT (5 clusters, mover `Crear varios *` a `⋯ Más`) |
| `app/src/ui/toolbar/ToolbarCreacion.tsx` | — | — | EDIT (quitar label "Enlace", quitar botón "Config grid" en banda) |
| `app/src/ui/toolbar/toolbarStyles.ts` | — | — | aditivo (`botonBase` sin `minWidth`, `height:30`, `divider.margin`) |
| `app/src/ui/toolbar/ToolbarMas.tsx` | — | — | lectura (los items se construyen en `ToolbarBase`) |
| `app/src/ui/tokens.ts` | lectura | lectura | lectura (puede recibir tokens nuevos solo si justificados en commit) |
| `app/e2e/01-carga-y-workspace.spec.ts` | lectura (verificar que `aria-label="Archivo JSON"` sigue válido) | — | — |
| `app/e2e/03-opl-panel.spec.ts` | — | lectura (verificar testIds) | — |
| `app/e2e/14-canvas-fidelity.spec.ts` | — | — | lectura (verificar `Sugerir layout` y `config-grid`) |

Reglas de oro derivadas:

1. **Cero colisión entre pasadas**: las 3 trabajan archivos disjuntos. Si una pasada necesita tocar un archivo de otra, **detenerse y consultar**.
2. **Si P3 mueve `Crear varios objetos` / `Crear varios procesos` al menú `⋯ Más`**, el testId `toolbar-modo-creacion-objeto` y `toolbar-modo-creacion-proceso` debe reemitirse desde el item del menú. Verificar en `app/e2e/` antes de cerrar.
3. **Si P3 elimina el botón en banda `Config grid`**, el testId `config-grid` ya está duplicado en el menú "Más" (`toolbar-mas-config-grid`). Confirmar que ningún smoke depende exclusivamente del en-banda `config-grid` (`rg "data-testid=\"config-grid\"" app/e2e`). Si depende, dejar el botón en banda y solo aliviar la toolbar moviendo otras acciones.

## 6. Protocolo de conciliación

Las 3 pasadas son **seriales**, no paralelas. Cada pasada se mergea a `main` antes de empezar la siguiente:

1. **P1 (Inspector + file picker)** primero. Riesgo más bajo: el `<input type=file>` truncado es la queja más concreta del bug.
2. **P2 (Toolbar OPL)** segundo. Riesgo bajo, alta visibilidad.
3. **P3 (Toolbar superior)** tercero. Riesgo medio porque mueve controles entre banda y menú; necesita verificación cuidadosa de testIds en smoke.

Entre pasada y pasada: audit visual in-vivo obligatorio (`test-vivo-iterativo-opmkv`) antes de mergear. Si un audit falla, se itera dentro de la misma pasada hasta cerrar el criterio antes de avanzar.

## 7. Anclaje obligatorio a HU y SSOT

| Pasada | HU UI ancla | Path | Aporte |
|---|---|---|---|
| P1 | HU-30.x (Modelos locales / Save-Load) | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Inspector vacío comunica claramente atajos para empezar; file picker no se trunca |
| P2 | HU-50.018, 023, 024, 025 | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | Búsqueda, filtro selección, copiar, exportar HTML legibles y agrupados por intención |
| P3 | EPICA-90 + EPICA-21 | `docs/historias-usuario-v2/epicas/epica-90-interaccion-shortcuts.md` | Toolbar de chrome legible: clusters Crear · Hist · Modelo · Enlace · Vista · Más |

SSOT visual: `docs/JOYAS.md` para paleta canvas (invariante; **no se toca**) y dimensiones canónicas.

Corpus reusable interno (revisión obligatoria antes de inventar):

- `opm-extracted/src/app/rappid-components/rappid-toolbar/rappid-toolbar.component.ts` y `toolbar.component.ts`: patrón de agrupación de acciones y "Más" con menú colapsado en OPCloud. Lectura, no copia.
- `opm-extracted/src/app/rappid-components/rappid-opl/rappid-opl.component.ts` y `opm-extracted/src/app/modules/layout/opl-container/opl-container.component.ts`: patrón visual de cabecera OPL. Lectura.
- `opm-extracted/src/app/dialogs/opl-dialog/opl-dialog.component.ts`: chrome del panel OPL. Lectura.
- `app/src/ui/tokens.ts`: tokens vivos, escala completa. **Uso obligatorio.**
- `app/src/ui/toolbar/ToolbarMas.tsx`: ya implementa el patrón menú accesible (Enter/Space/ArrowDown/Escape, `aria-haspopup="menu"`). **Reusar tal cual.**

## 8. Brief

| Línea | Brief |
|---|---|
| L1 | [linea-1-refactor-visual-chrome.md](linea-1-refactor-visual-chrome.md) |

## 9. Verificación al cierre de la ronda

Métricas esperadas post-ronda:

- **Unit tests**: 283 verde (sin agregar ni quitar).
- **Smoke browser**: 34 verde (sin agregar ni quitar). Si una pasada agrega smoke focal de regresión visual, se reporta como diff explícito.
- **Build**: ~843 KB ± 5%. Esta ronda no debería mover el bundle más que ruido.
- **Audit visual in-vivo**: 3 reportes (uno por pasada) con FAIL/WARN previos del bug en CLEAR/PASS, sin nuevos FAIL.
- **Bug**: `docs/bugs/BUG-20260507T212356Z-692129/` cerrado con commit que cita el bug ID y referencia los 3 commits de las pasadas.

## 10. Lo que NO toca esta ronda

- Paleta canvas (`docs/JOYAS.md`): invariante.
- Dominio funcional: nada de modelo, store, render, opl, serialización.
- Otros toolbars secundarios (`ToolbarSeleccion.tsx`, `ToolbarMultiseleccion.tsx`, `ToolbarMapaSistema.tsx`): si se detecta queja visual ahí (ej. icono "Traer" superpuesto en ToolbarMapaSistema según la captura), se anota como bug nuevo, **no se mete a esta ronda**.
- Beta1 (ronda 16) ni Beta2 (ronda 17): rondas paralelas en curso. Esta ronda 18 se mergea cuando estén estables.
- Línea de UX accesibilidad sistémica (a11y audit completo): otra ronda.
