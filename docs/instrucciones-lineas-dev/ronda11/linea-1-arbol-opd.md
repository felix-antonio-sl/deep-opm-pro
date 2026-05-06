# Línea 1 — Árbol OPD completo (navegación + interacción + gestión modal)

## 1. Misión

Cerrar la **EPICA-20 árbol OPD** (12 HU pendientes) llevando el panel de árbol de su estado actual (visible, navegable por clic, expansión básica) a la UX completa de OPCloud:

- **Navegación por teclado**: `Ctrl+↑/↓` recorre nodos visibles del árbol; `F2` renombra; `Ctrl+D` abre gestión modal.
- **Divisor arrastrable persistente**: ancho del panel árbol guardado en `PreferenciasUiUsuario.anchoPanelArbol` con doble-click reset a default.
- **Menú contextual canónico**: clic derecho sobre nodo → Renombrar / Eliminar / Reordenar / Ir a OPD / Buscar.
- **Expandir/colapsar todo**: botón en header del panel + atajo.
- **Toggle "Ocultar/Mostrar nombres"**: complemento al toggle existente.
- **Renombrado inline**: doble clic sobre nodo o `F2` → input emergente confirma con Enter / cancela con Esc.
- **Reordenado de hermanos**: manual (drag dentro del árbol) y automático (según orden Y de apariencias en canvas del padre).
- **Gestión modal `Ctrl+D`**: lista buscable de OPDs con cortar/pegar y reordenar.

Slice mínimo entregable: feature **UI navegación** sin tocar kernel ni serialización OPM. Toda la lógica vive en `ui/ArbolOpd.tsx` + `ui/arbol/*` + nuevo `ui/DialogoGestionArbol.tsx` + `atajosTeclado.ts` + `acciones-opd.ts` extendido.

**Fuera de slice**:
- L2 toca persistencia de `PreferenciasUiUsuario` general; L1 solo agrega los campos opcionales nuevos del árbol.
- No tocar `acciones-canvas.ts` (territorio L3+L4).
- No agregar nuevos tipos de OPD ni cambiar refinamiento (territorio histórico ronda 9 L1 + ronda 10 L3).
- No tocar mapa del sistema (vista derivada, EPICA-21).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L1 |
|---|---|---|
| HU-20.009 — Navegar Ctrl+↑/↓ | pendiente | Atajo registrado en `atajosTeclado.ts` con contexto `arbol-opd`; mueve foco entre nodos visibles del árbol con scroll into view. |
| HU-20.010 — Divisor arrastrable | pendiente | `divisorPanel.tsx` ya existe; agregar persistencia de ancho en `PreferenciasUiUsuario.anchoPanelArbol` + doble-click reset a 280px. |
| HU-20.011 — Menú contextual árbol | pendiente | `MenuContextualArbol.tsx` ya existe; extender con Renombrar / Eliminar (HU-20.015) / Reordenar (sub-menú con manual+automático) / Buscar (abre Ctrl+D). |
| HU-20.012 — Expandir o colapsar todo | pendiente | Botón en header + atajo `Ctrl+E` (expandir) / `Ctrl+Shift+E` (colapsar); función `expandirTodos`/`colapsarTodos` en `togglesArbol.ts`. |
| HU-20.013 — Toggle Ocultar/Mostrar nombres | pendiente | `nombresArbolVisibles?` ya existe en preferencias; agregar botón visible en header del árbol con icon. |
| HU-20.014 — Renombrar OPD desde árbol | pendiente | Doble clic sobre nodo → input inline con foco + selección; Enter confirma, Esc cancela. F2 con nodo seleccionado abre el mismo input. |
| HU-20.017 — Reordenar manual con arrastre | pendiente | Drag handler en `NodoOpd.tsx` con `draggable`; al soltar, llama `reordenarOpdsHermanos(padreId, ordenIds[])` en `acciones-opd.ts`. Modo "Manual" en preferencias. |
| HU-20.018 — Reordenar automático según canvas | pendiente | Función `reordenarHermanosAutomaticamente(modelo, opdPadreId)` que ordena por Y de la apariencia del proceso refinado en el OPD padre. Modo "Automático" en preferencias. |
| HU-20.019 — Configurar modo Auto/Manual | pendiente | `PreferenciasUiUsuario.arbolOrden?: "automatico" \| "manual"` aditivo. Toggle en header del árbol o en gestión modal. |
| HU-20.020 — Abrir gestión Ctrl+D | pendiente | Atajo registrado con `Ctrl+D`; abre `DialogoGestionArbol.tsx` (NUEVO) con lista de OPDs, búsqueda y operaciones. |
| HU-20.021 — Buscar OPD por nombre/número | pendiente | Input de búsqueda en `DialogoGestionArbol.tsx` filtra por `nombre` o `id` (SDn pattern). |
| HU-20.022 — Cortar y pegar nodos en gestión | pendiente | Botones Cortar/Pegar en gestión modal; opera reasignando `padreId` del OPD movido. Validación: no permite cortar raíz, no permite pegar como descendiente. |

**Total esperado**: 12 HU cubiertas (todas pendientes pasan a cubierto).

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §navegación de OPDs: el árbol jerárquico es ortogonal a la semántica OPM. Toda interacción del árbol es UI.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §refinamiento: SDn naming convention preservada (HU-12.005 ya cubierto).
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/MenuesAndCommands/treeViewService.ts` — patrón de tree con context menu + drag.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/MenuesAndCommands/contextMenusActions.ts` — acciones del menú contextual.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/dialogs/tree-management-dialog/` (si existe) — gestión modal.
- **Estado actual del código (post-ronda-10)**:
  - `app/src/ui/ArbolOpd.tsx` (~150 LOC): tree visible con clic selecciona OPD activo. Toggle expand/collapse por nodo individual. **L1 extiende con teclado, expandir todo, modo orden.**
  - `app/src/ui/arbol/NodoOpd.tsx`: ya tiene render por nivel + toggle expansion. **L1 agrega renombrado inline + drag handle.**
  - `app/src/ui/arbol/handlersTeclado.ts` (~60 LOC): ya tiene Tab/Enter en árbol. **L1 agrega Ctrl+↑↓, F2, Ctrl+E, Ctrl+D.**
  - `app/src/ui/arbol/togglesArbol.ts`: helpers de expansión por nodo. **L1 agrega `expandirTodos`/`colapsarTodos`.**
  - `app/src/ui/MenuContextualArbol.tsx`: ya tiene Renombrar/Eliminar básicos (probablemente). **L1 extiende con Reordenar + Buscar + opciones avanzadas.**
  - `app/src/ui/divisorPanel.tsx` (~100 LOC ronda 8): ya tiene drag con persist de ancho. **L1 agrega doble-click reset a default + lectura de `PreferenciasUiUsuario.anchoPanelArbol`.**
  - `app/src/store/modelo/acciones-opd.ts` (~150 LOC ronda 9.5): ya tiene `cambiarOpdActivo`, `eliminarOpdDesdeArbol`, `reasignarEnlaceExternoManual`. **L1 agrega `renombrarOpd`, `reordenarOpdsHermanos`, `expandirTodos/colapsarTodos`.**

## 4. Archivos permitidos

```text
app/src/modelo/tipos/ui.ts                        EDIT aditivo (PreferenciasUiUsuario.{arbolOrden?, arbolExpandidoPersistente?})
app/src/store/tipos.ts                            EDIT aditivo (5 acciones árbol nuevas en OpmStore)
app/src/store/modelo/acciones-opd.ts              EDIT extiende (renombrarOpdDesdeArbol, reordenarOpdsHermanos, expandirTodos, colapsarTodos, navegarAOpdSiguiente)
app/src/store/modelo/acciones-ui.ts               EDIT extiende (abrirGestionArbol, cerrarGestionArbol)
app/src/persistencia/workspace.ts                 EDIT aditivo (persistir orden hermanos)
app/src/ui/ArbolOpd.tsx                           EDIT extiende (header con expandir todo + ocultar nombres + Ctrl+D button + foco visible)
app/src/ui/arbol/NodoOpd.tsx                      EDIT aditivo (renombrado inline doble clic, drag handle, foco visible)
app/src/ui/arbol/handlersTeclado.ts               EDIT extiende (Ctrl+↑↓, F2, Ctrl+E, Ctrl+D)
app/src/ui/arbol/togglesArbol.ts                  EDIT extiende (expandirTodos, colapsarTodos)
app/src/ui/MenuContextualArbol.tsx                EDIT extiende (Reordenar sub-menu, Buscar, sub-opciones)
app/src/ui/DialogoGestionArbol.tsx                NUEVO (gestión modal Ctrl+D con lista, búsqueda, cortar/pegar)
app/src/ui/divisorPanel.tsx                       EDIT aditivo (doble-click reset a default + lectura preferencias)
app/src/ui/atajosTeclado.ts                       EDIT aditivo (registrar Ctrl+↑↓, F2, Ctrl+E, Ctrl+D, Ctrl+Shift+E)
app/src/ui/RenombradoInline.tsx                   LECTURA (reusable de ronda 10 L3, ya existe)
app/e2e/opm-smoke.spec.ts                         EDIT aditivo (smokes árbol L1)
app/src/ui/arbol/handlersTeclado.test.ts          EDIT aditivo (tests teclado nuevos)
app/src/ui/arbol/togglesArbol.test.ts             EDIT aditivo (tests expandir/colapsar todo)
app/src/store/modelo/acciones-opd.test.ts         NUEVO opcional si no existe
opm-extracted/**                                  LECTURA
docs/HANDOFF.md                                   LECTURA
docs/historias-usuario-v2/**                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `acciones-canvas.ts`** (territorio L3 panel OPL + L4 modelado).
- **No tocar `acciones-enlace.ts`** (territorio L4).
- **No tocar `Toolbar.tsx`** (territorio L2 autosalvado glifo + L4 drag handlers + L5 read-only).
- **No tocar `MenuPrincipal.tsx`** (territorio L2 + L5).
- **No tocar `PanelOpl.tsx` ni `panelOpl/*`** (territorio L3).
- **No tocar `Dialogo{Cargar,GuardarComo,Versiones,Archivados,BuscarGlobal}.tsx`** (territorio L2). El nuevo `DialogoGestionArbol.tsx` es exclusivo de L1.
- **No tocar `BibliotecaCosa.tsx` ni `MenuTipoEnlace.tsx`** (territorio L4, archivos nuevos).
- **No tocar `runtime.ts`** (territorio L2 confirmaciones + L5 read-only).
- **No tocar el detector ledger** (territorio consolidación L5).
- **`tipos/ui.ts`**: L1 agrega `arbolOrden?`, `arbolExpandidoPersistente?`. L2 agrega `recientesOrden?`. L3 agrega 4 prefs OPL. Todos campos opcionales aditivos en `PreferenciasUiUsuario`. Cero conflicto si cada línea solo agrega los suyos.

## 6. Comportamiento esperado

- **Foco visible en árbol**: el nodo seleccionado tiene outline azul accesible (contraste AAA con fondo). Al cargar el modelo, foco va automáticamente a la raíz.
- **Ctrl+↑/↓**: navega entre nodos visibles (respeta colapsados); con `Shift` extiende selección si en futuro se permite multi (no en MVP-α). Scroll into view automático.
- **F2 con nodo seleccionado**: abre input inline con texto completo seleccionado para reemplazo rápido.
- **Doble clic sobre label de nodo**: equivalente a F2.
- **Ctrl+E**: expande todos los nodos visibles del árbol.
- **Ctrl+Shift+E**: colapsa todos excepto la raíz.
- **Ctrl+D**: abre `DialogoGestionArbol`. Si ya está abierto, foco va al input de búsqueda.
- **Drag manual de nodo**: solo permitido entre hermanos del mismo padre. Visual ghost durante drag, drop indicator entre nodos. Al soltar, persiste el orden manual y cambia automáticamente a modo "Manual" si estaba en "Automático" (con confirmación).
- **Modo "Automático"**: el orden se recalcula desde Y del proceso refinado en cada operación que afecte canvas.
- **Renombrado inline**: si el nuevo nombre está vacío, mantiene el original. Si duplica un nombre existente del mismo padre, agrega sufijo numérico automático.
- **Eliminar desde menú contextual**: usa `eliminarOpdDesdeArbol` ya existente; restricciones de hoja preservadas (HU-20.015/.016 ya cubiertos).
- **Cortar/pegar en gestión modal**: solo aplica entre OPDs cuyo proceso refinado pueda re-asignarse sin romper jerarquía. Si no se puede, mensaje claro.

## 7. Pruebas requeridas

**Unit tests (`app/src/ui/arbol/handlersTeclado.test.ts`, `togglesArbol.test.ts`, opcional `acciones-opd.test.ts`):**

- Ctrl+↑/↓ mueve foco al nodo siguiente/anterior visible.
- F2 abre input de renombrado.
- Ctrl+E expande todos los nodos; Ctrl+Shift+E colapsa todos excepto raíz.
- `expandirTodos(modelo)` retorna `Set<Id>` con todos los OPDs.
- `reordenarOpdsHermanos(modelo, padreId, [id1, id2, id3])` actualiza orden persistido.
- `reordenarHermanosAutomaticamente(modelo, opdPadreId)` ordena por Y de apariencia del proceso refinado en padre.
- Renombrado vacío preserva original; duplicado agrega sufijo.

**Smoke browser (`app/e2e/opm-smoke.spec.ts`)**, ~5 nuevos:

- "Árbol Ctrl+↑/↓ navega y sincroniza canvas": crear modelo con 3 OPDs anidados, foco en raíz, Ctrl+↓ tres veces, verificar OPD activo cambia y nodo focused.
- "Árbol F2 renombra inline": doble clic sobre nodo, escribir, Enter, verificar nombre nuevo persistido en `modelo.opds[id].nombre`.
- "Árbol Ctrl+E expande todo": colapsar manualmente, Ctrl+E, verificar todos visibles.
- "Árbol Ctrl+D abre gestión modal": presionar Ctrl+D, verificar dialog visible con input búsqueda con foco.
- "Gestión árbol cortar/pegar reasigna padre": en modal, cortar OPD interno, pegar bajo otro padre, verificar `modelo.opds[id]` reasignado y árbol re-renderizado.

## 8. Métricas esperadas

- **Tests aditivos**: ~12 unit + 5 smokes nuevos.
- **HU cerradas**: 12 HU pendientes → cubiertas (todas EPICA-20 que faltaban).
- **Reglas detector ronda 11 que esta línea aporta** (a registrar en consolidación L5):
  - HU-20.009/.010/.011/.012/.013 → 1 regla agrupada (atajos teclado + divisor + menú contextual + expandir todo + ocultar nombres).
  - HU-20.014 → 1 regla (renombrado inline, comparte evidencia con `RenombradoInline.tsx` ya existente).
  - HU-20.017/.018/.019 → 1 regla (reorden manual + automático + modo configurable).
  - HU-20.020/.021/.022 → 1 regla (gestión modal + búsqueda + cortar/pegar).
  - **Total estimado**: 4 reglas nuevas.
- **Build**: chunk principal + ~3-5 KB (DialogoGestionArbol nuevo se carga lazy si supera 5 KB).
- **Smoke browser**: 59 → ~64.

## 9. Loop verde y commits

Loop por commit:

```bash
cd app
bun run check          # 597 → 609 unit
bun run browser:smoke  # 59 → 64
bun run build          # main chunk objetivo < 170 KB / < 45 KB gzip
```

Commits sugeridos (orden):

1. `feat(arbol): atajos Ctrl+↑/↓, F2, Ctrl+E, Ctrl+Shift+E con foco visible (HU-20.009/.012)`
2. `feat(arbol): renombrado inline doble clic + F2 sobre nodo (HU-20.014)`
3. `feat(arbol): toggle Ocultar/Mostrar nombres + divisor doble-click reset (HU-20.013/.010)`
4. `feat(arbol): reorden manual drag + automático Y-canvas + modo configurable (HU-20.017/.018/.019)`
5. `feat(arbol): menú contextual extendido con Reordenar y Buscar (HU-20.011)`
6. `feat(arbol): DialogoGestionArbol Ctrl+D con búsqueda y cortar/pegar (HU-20.020/.021/.022)`
7. `test(e2e): smokes árbol L1 (5 nuevos)`

Cada commit debe dejar la rama verde. Co-author si aplica.

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **Choque sobre `acciones-opd.ts` con L2 o L4**: ambos pueden tocar acciones de OPD para diferentes razones. | L1 extiende solo acciones de árbol (renombrar, reordenar). L2 NO toca este archivo (persistencia opera sobre `acciones-ui.ts` + `persistencia/*`). L4 NO toca acciones-opd. Sin conflicto. |
| **Atajos colisionan con atajos existentes**: Ctrl+D es global pero podría chocar con un atajo browser default (bookmarks). | Usar `event.preventDefault()` cuando contexto es árbol-opd. Documentar en `atajosTeclado.ts`. Verificar en smoke que el atajo NO triggerea bookmark del navegador. |
| **Drag manual en árbol bloquea click**: el handler drag puede impedir clic normal. | Threshold de movimiento mínimo (5px) antes de iniciar drag. Si no se mueve, es clic normal. Patrón JointJS rubberBand. |
| **Renombrado inline rompe foco al hacer scroll/expansion**: si el árbol re-renderiza durante input, foco se pierde. | Componente `RenombradoInline` (ronda 10 L3) ya maneja focus restoration. Reusar tal cual. |
| **Modo Automático sobreescribe orden manual del usuario**: si usuario reordena manualmente y luego cambia algo en canvas, el orden manual se pierde. | Cambio a modo Automático debe pedir confirmación si hay orden manual previo. Por defecto, los nuevos OPDs quedan en modo "Automático". |
| **`PreferenciasUiUsuario.arbolOrden`**: nuevo campo opcional puede romper hidratación si no es defaultable. | Default `"automatico"` en lectura, `undefined` en escritura cuando no se configuró. Validador en `runtime.ts esPreferenciasUi` con check explícito. |
| **Gestión modal Ctrl+D vs Ctrl+B existente**: si ya hay otro Ctrl+D registrado. | Verificar `atajosTeclado.ts`; si Ctrl+D ya está, usar Ctrl+Shift+T como fallback (similar al "tree" mnemonic). |

## 11. Salida esperada

Al cierre de L1, el operador debe poder:

- Navegar el árbol completo solo con teclado (Ctrl+↑↓ + F2 + Ctrl+E + Ctrl+D + Esc).
- Renombrar OPDs sin abrir un diálogo, con feedback visual inmediato.
- Reordenar hermanos del árbol arrastrando o dejando que el sistema los ordene automáticamente.
- Abrir una gestión modal completa con búsqueda y operaciones avanzadas.
- Persistir orden manual de hermanos al cerrar y reabrir el modelo (orden vive en workspace, no en el JSON OPM).

EPICA-20 cierra al 100% (12/12 cubiertas). Cero parciales en árbol OPD.
