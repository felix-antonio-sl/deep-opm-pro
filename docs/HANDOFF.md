# HANDOFF — Corte pre-betas (ronda 18 + 15.2 + hotfixes consolidados)

**Fecha**: 2026-05-08
**Repositorio**: `deep-opm-pro`
**Rama**: `main`
**HEAD**: `cf289ce`
**Corte**: pre-Beta1/Beta2. Todo lo planificado para Beta0 + el polish visual de chrome (ronda 18) + el schema dual ortogonal de refinamiento (ronda 15.2) está consolidado en main. Beta1 (ronda 16) y Beta2 (ronda 17) están **diseñadas pero no ejecutadas**.

## Política De Handoff Único

`docs/HANDOFF.md` es la única memoria de traspaso vigente del proyecto. Este
archivo reemplaza y consolida el handoff anterior. No crear handoffs paralelos,
fechados ni duplicados.

## Contexto Normativo

El modelador OPM vive en `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
La arquitectura sigue siendo propia: no Angular, no Firebase, no Rappid.

Autoridad semantica:

- SSOT OPM/ISO 19450: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
- Evidencia operacional OPCloud: `opm-extracted/`
- Evidencia visual canonica: `assets/svg/`, `assets/png/`, `docs/JOYAS.md`
- Backlog vivo: `docs/historias-usuario-v2/`
- Corte operativo vivo: `docs/roadmap/cortes-operativos.md`

Regla viva: OPCloud operacionaliza OPM, pero no redefine la semantica. Antes de
crear una solucion nueva, revisar SSOT, `assets/`, `docs/JOYAS.md` y
`opm-extracted/`.

## Estado Ejecutivo

`main` está 20 commits adelante de `origin/main` y agrupa cuatro bloques sucesivos sobre el cierre Beta0 anterior (`6d26146`):

1. **Ronda 18** — refactor visual chrome (4 commits + 3 merges no-ff).
2. **Ronda 15.2** — schema dual ortogonal de refinamiento (6 commits, breaking change semántico via migración legacy faithful).
3. **Hotfix triple** — Delete cross-OPD, unicidad global de nombres canónicos, menú Tipos válidos cierra con Escape/click-outside (3 commits + 1 ajuste de smoke).
4. **Hotfix barra contextual** — siembra de estados iniciales y Unfold paritario (2 commits previos a ronda 18).

Loop verde sobre `main @ cf289ce`:

- `bun run check` → **926 unit pass / 0 fail / 3684 expect()**
- `bun run lint` → clean
- `bun run build` → `index.js` ~260 KB (gzip ≈69 KB)
- `bun run browser:smoke` → **129 passed / 0 fail / 5 skipped** (contrato TablaEnlaces pending implementation)
- Working tree limpio. Solo branch `main`. Cero worktrees auxiliares.

La siguiente ronda operacional **disponible** es **ronda 16 / Beta1**:
`docs/instrucciones-lineas-dev/ronda16/`. Ronda 17 / Beta2 también está empacada en `docs/instrucciones-lineas-dev/ronda17/`. Decisión de orden Beta1→Beta2 sigue siendo del operador.

## Memoria Consolidada Del Corte

### Ronda 18 — Refactor visual chrome (3 pasadas seriales mergeadas con --no-ff)

Línea única L1 con tres pasadas en archivos disjuntos. Briefs en `docs/instrucciones-lineas-dev/ronda18/`.

- **P1** (`a536578` + merge `fe6fa5f`): `Inspector` vacío rediseñado con jerarquía (título 14/700, body 13/normal secundario, card "Atajos para empezar"); `<PersistenciaJson />` envuelto en `<details open>` cuando inspector vacío (`open` por defecto autorizado por sección 10 del brief para preservar smokes que hacen `fill()` sobre textarea JSON sin selección previa); `<input type=file>` reemplazado por label custom + nombre con `text-overflow: ellipsis`; tres bloques (`Modelos locales`, `JSON`, `Archivo JSON`) en tarjeta única con border + radius + padding tokenizados.
- **P2** (`69b6b30` + merge `549e49e`): cabecera del panel OPL en tres clusters separados por dividers — chrome (`▾`, `↔`), display (`123`, `AI`, `Editar`), consulta (búsqueda, `Copiar`, `HTML`); toggle `Filtrar por selección` al extremo derecho con divider previo; tipografía 12 (de 11), height 28 (de 26), search input minWidth 180; cero hex literales fuera de `tokens.ts`.
- **P3** (`cd9c87b` + merge `dd5ba9a`): toolbar superior en cinco clusters por intención — Crear · Historia · Modelo · Enlace · Vista — separados por dividers; `Deshacer`/`Rehacer` como iconos `↶`/`↷` con `aria-label` explícito; `Sugerir layout` renombrado a `Auto-layout`; placeholder del select de enlace `Tipo de enlace…` (sin label `Enlace` previo); `botonBase` sin `minWidth`, `height: 30`, padding y tipografía con tokens. **Dos desviaciones documentadas en commit, autorizadas por regla 5.5 del README ronda18 ("smokes intactos > reorganización")**: `Crear varios objetos/procesos` mantenidos en banda (8+ smokes hacen `dragTo()` directo y `ToolbarMasItem` no soporta `draggable`); `Config grid` en banda mantenido (3 smokes hacen click directo, espejo `toolbar-mas-config-grid` ya en menú).

Cierra `BUG-20260507T212356Z-692129` ("paneles horribles, refactorizar visualmente"). Política: tokens existentes únicamente, cero hex literales nuevos, preservación dura de `data-testid` y `aria-label`.

### Ronda 15.2 — Schema dual ortogonal de refinamiento

Cierre semántico de la ortogonalidad descomposición/despliegue. 6 commits.

- `a3bc6de` `feat(modelo)!`: schema dual `Entidad.refinamientos: Partial<Record<TipoRefinamiento, SlotRefinamiento>>` con migración legacy en `validarRefinamientos`. Campo `refinamiento` eliminado del tipo TS — solo sobrevive como interface de input legacy del migrador.
- `fdecd2c` `refactor(operaciones)`: `descomponerProceso`/`desplegarObjeto` escriben a su slot via `fijarRefinamiento`; idempotencia preservada (mismo tipo → reabrir OPD existente); cross-reject removido.
- `fed4dfb` `refactor(modelo,canvas)`: consumers internos migrados via helpers (`obtenerRefinamiento`, `refinaA`, `refinamientosDe`, `fijarRefinamiento`).
- `a19939b` `refactor(render,ui,opl)`: `SeccionRefinamiento` muestra ambos botones independientes; OPL `oracionesRefinamiento` emite UNA oración por slot presente; `NodoOpd`/`Timeline` buscan refinador por `refinaA(opdId)`.
- `aa18120` `test(refinamiento)`: suite focal `refinamientos.test.ts`, ley `law-refinement-thing-matrix` extendida con caso dual, e2e nuevo `ronda 15.2: descomposicion + despliegue simultaneos` en `05-refinamiento-y-plegado.spec.ts`.
- `0e6cec4` `fix(opl,leyes)`: completa migración dual en `aparienciasInternasDeRefinamiento` y test helper `internasDelRefinamiento` (omitidos por el agente porque rebaseó sobre base previa al hotfix `6d26146`).

Lectura categorial: schema migra de **coproducto exclusivo** a **producto parcial indexado por tipo**; migración legacy → record es funtor faithful (modelos pre-15.2 cargan sin pérdida); aciclicidad V-220/V-221 preservada por construcción.

### Hotfix triple — pre-betas

- `e5a0613` `fix(modelo,canvas,store)`: **BUG-20260507T231712Z-91e001** (Delete solo borraba en OPD activo) y **BUG-20260507T231852Z-13c786** (creación permitía nombres duplicados). `canvas/operacionesBatch.ts` Delete remueve la entidad lógica del modelo completo; `Ocultar apariencia` queda como vía local. `modelo/operaciones/entidad.ts` y `creacion.ts` enforce unicidad global del nombre canónico al crear/renombrar; placeholders sin nombre auto-suffix `Objeto_2` para no bloquear el flujo de creación antes del modal. `store/modelo/acciones-entidad.ts` deja el modal abierto con error de duplicado en lugar de cerrar silenciosamente.
- `1e55a72` `fix(toolbar)`: **BUG-20260507T231609Z-13e330** (menú "Tipos válidos" se quedaba pegado). Refs al trigger y al contenedor del menú; listeners globales en captura para Escape (foco vuelve al botón) y `pointerdown` fuera del menú/trigger; `aria-haspopup="dialog"` + `aria-expanded` sobre el trigger; cierre automático cuando el selector se deshabilita.
- `cf289ce` `test(e2e)`: ajusta `02-canvas-y-render.spec.ts:351 renderiza agregacion como triangulo estructural` — regresión esperada del Fix A. Filter por regex `/^Objeto(_\d+)?$/` para cubrir el segundo placeholder con auto-suffix.

### Hotfix barra contextual (previo a ronda 18)

- `4232029` `fix(barra-contextual)`: agregar-estado siembra dos iniciales (`Estado1`, `Estado2`) si no existen.
- `49a1238` `feat(barra-contextual)`: agrega Unfold paritario al Inzoom (botón `barra-unfold` aparece junto a `barra-inzoom` cuando aplica).

## Bugs Cerrados En Este Ciclo

| Bug | Cerrado por | Lectura operativa |
|---|---|---|
| `BUG-20260507T211702Z-372334` | `e1c8528` + `d63c8e2` + `6d26146` (cierre previo) | Despliegue/unfold no proyecta contorno embebido y posiciona partes fuera del padre. |
| `BUG-20260507T211815Z-d78ae2` | `c51e109` (cierre previo) | Botones Copiar/Pegar de barra contextual ocultos cuando no hay enlace operable. |
| `BUG-20260507T212356Z-692129` | Ronda 18 P1+P2+P3 (`a536578`/`69b6b30`/`cd9c87b` + 3 merges) | Refactor visual chrome de Inspector vacío + cabecera OPL + toolbar superior. |
| `BUG-20260507T231609Z-13e330` | `1e55a72` | Menú Tipos válidos cierra con Escape y click fuera. |
| `BUG-20260507T231712Z-91e001` | `e5a0613` | Delete cross-OPD: borra la entidad lógica del modelo completo. |
| `BUG-20260507T231852Z-13c786` | `e5a0613` | Unicidad global de nombres canónicos enforced en creación/rename. |

Reportes versionados bajo `docs/bugs/` con payload + screenshots como evidencia.

## Decisiones Vigentes

1. **Política tokens-only para chrome UI**: cualquier valor visual de chrome (no canvas) sale de `app/src/ui/tokens.ts`. Cero hex literales nuevos. Paleta canvas (`docs/JOYAS.md`) sigue invariante.
2. **`<details open>` en `Inspector` vacío**: smokes hacen `fill()` sobre `<textarea>` JSON sin selección previa; `<details>` cerrado provoca `display:none` y timeout de Playwright. Mantener `open` por defecto; el operador puede colapsar manualmente.
3. **Schema dual de refinamiento**: una entidad puede tener simultáneamente descomposición y despliegue, cada uno apuntando a un OPD hijo distinto. Migración legacy es faithful.
4. **Unicidad global de nombres canónicos**: enforced en creación y rename. Placeholders sin nombre confirmado auto-suffix `Objeto_2`. El modal de nombre permanece abierto con error si el operador intenta confirmar un duplicado.
5. **Delete cross-OPD vs Ocultar apariencia**: `Delete` borra la entidad lógica del modelo completo; `Ocultar apariencia` solo deja de mostrarla en el OPD activo. Decisión documentada porque en el bug original el operador mencionó las dos vías como alternativas — quedaron ambas con semántica clara y disjunta.
6. **Smokes > reorganización (regla 5.5 ronda 18)**: cuando un cambio de UX rompe smokes, prevalece el smoke a menos que el cambio sea estrictamente necesario por brief. Aplicado en P3 con `Crear varios *` y `Config grid` mantenidos en banda.
7. **Política de handoff único** (sin cambio): `docs/HANDOFF.md` se reescribe, no se acumulan handoffs paralelos.
8. **Política de no actuar fuera de scope** (sin cambio): bugs descubiertos durante un fix se anotan como reportes nuevos, no se mezclan con el commit del fix en curso.

## Commits Relevantes Del Corte

| Bloque | Commits | Aporte |
|---|---|---|
| Hotfix barra-contextual | `49a1238` `4232029` | Unfold paritario al Inzoom; agregar-estado siembra dos estados iniciales. |
| Ronda 18 docs | `eb9f42e` | Briefs en `docs/instrucciones-lineas-dev/ronda18/`. |
| Ronda 18 P1 | `a536578` + merge `fe6fa5f` | Inspector vacío + file picker custom. |
| Ronda 18 P2 | `69b6b30` + merge `549e49e` | Cabecera OPL en 3 clusters. |
| Ronda 18 P3 | `cd9c87b` + merge `dd5ba9a` | Toolbar superior en 5 clusters. |
| Ronda 15.2 | `a3bc6de` `fdecd2c` `fed4dfb` `a19939b` `aa18120` `0e6cec4` | Schema dual ortogonal + migración + tests. |
| Hotfix triple | `e5a0613` `1e55a72` `cf289ce` | Delete cross-OPD + unicidad global + menú Tipos cierra + smoke ajustado. |

## Verificacion Final Conocida

`main @ cf289ce`:

```bash
cd app && bun run check
# 926 unit pass / 0 fail / 3684 expect() / 93 files

cd app && bun run lint
# clean

cd app && bun run build
# index-CP93Ui3X.js ~260 KB / ~69 KB gzip
# vendor-jointjs-Cfe4rKV_.js 470 KB / 130 KB gzip (lazy)

cd app && bun run browser:smoke
# 129 passed / 0 fail / 5 skipped (contrato TablaEnlaces pending implementation)
```

Notas:

- Vite dev server estuvo activo en `http://138.201.53.205:5173/` durante validación in-vivo. El puerto 5173 está abierto en `ufw allow`. El puerto 5174 NO; cualquier reinicio externo del server debe usar `--host 0.0.0.0 --port 5173 --strictPort`.
- Bundle `index.js` subió ~3 KB vs corte ronda 15.1 (`256 KB → 260 KB`); atribuible a ronda 15.2 + ronda 18 + hotfix triple. Sigue dentro del umbral del proyecto.

## Pendientes Y Supuestos Para Beta1/Beta2

### Beta1 (ronda 16) — diseñada, no ejecutada

`docs/instrucciones-lineas-dev/ronda16/` empaca cinco líneas:

1. **L1 Tabla de Enlaces workbench**: convertir `TablaEnlaces` en superficie de inspección/edición real (contrato actual vive como `describe.skip` en `e2e/15-superficie-contextual.spec.ts`).
2. **L2 Búsqueda intra-modelo**: Ctrl/Cmd+F, apariciones, salto a OPD, selección visible, OPL sync.
3. **L3 Validación metodológica accionable**: avisos con severidad, cita SSOT, navegación y revalidación.
4. **L4 Catálogo simple + modelos ancla**: fijar evals reales sobre `hd-dt`, `hdos`, `hdos-app` o KORA/HDOS/HODOM/GOREOS.
5. **L5 Eval Beta1 dominio real**: flujo end-to-end sin workaround.

Orden recomendado: **L4 → L3 → L1 → L2 → L5**.

### Beta2 (ronda 17) — diseñada, no ejecutada

`docs/instrucciones-lineas-dev/ronda17/` empaca cuatro líneas para simulación conceptual + valores simples:

1. **L1 Kernel de simulación conceptual** (`modelo/simulacion/*` nuevo).
2. **L2 UI modo simulación** (`ui/simulacion/*` nuevo).
3. **L3 Valores simples y transiciones** (reusa EPICA-17 value slots y `validadores/valorSlot.ts`).
4. **L4 Eval Beta2 sobre dominio ancla**.

Beta2 supone **al menos un dominio ancla real cerrado por Beta1**.

### Criterios de cierre Beta1 (sin cambio)

Beta1 solo cierra cuando al menos un dominio ancla real:

1. se modela con multiples OPDs;
2. usa descomposicion, estados, enlaces avanzados y propiedades;
3. pasa validacion metodologica con avisos accionables;
4. permite buscar elementos y navegar al resultado;
5. permite inspeccionar/editar enlaces desde TablaEnlaces;
6. guarda/carga sin perdida;
7. no requiere editar JSON ni usar workaround de desarrollo;
8. resuelve o documenta explicitamente bugs capturados que afecten el flujo.

### Deuda viva no bloqueante

| Item | Origen | Sugerencia |
|---|---|---|
| `linkPickerLabel` huérfano en `toolbarStyles.ts` | Ronda 18 P3 | Limpieza no aditiva en próxima micro-ronda. |
| `mask-image` affordance scroll horizontal Toolbar no reintroducida | Ronda 15 L1/L2 | Polish post-Beta1 o micro-ronda visual. |
| Canvas `role="application"` no reintroducido | Ronda 15 L1/L4 | Requiere migrar helpers `getByRole("img")` en bloque. |
| Acciones replicadas en banda y menú Más (`config-grid`, `Crear varios *`) | Ronda 15 L2 + ronda 18 P3 | El espejo es deliberado por compatibilidad smoke; cleanup con migración smoke en bloque. |
| FAIL eval `dialogo-biblioteca` / `dialogo-menu-principal` | Ronda 15 L3 | Refinar criterios: panel/menu inline no son Dialogo canónico. |
| Icono "Traer" superpuesto en `ToolbarMapaSistema.tsx` | Captura BUG-692129 | Anotado fuera de scope ronda 18; bug nuevo si persiste. |
| HU-13.005 duplicate-id en dashboard legado | Anterior | Sin bloqueo. |

### Riesgos

1. **Branch `worktree-agent-a2cf56ddc79a6d145` ya borrada**, pero su trabajo está consolidado en main como ronda 15.2. No quedan worktrees auxiliares ni branches huérfanas.
2. **20 commits ahead de origin** sin pushear. El push controlado se hace en este corte.
3. **Beta1 y Beta2 no han pasado eval real**. Las precondiciones están sostenidas, pero el primer dominio ancla cerrado decidirá si los criterios son alcanzables como están escritos.
4. **`<details open>` en Inspector vacío**: si futuras rondas modifican el flujo de selección o el modal de nombre, revalidar que la afordancia sigue siendo legible y no añade ruido visual. Riesgo bajo; mitigado por unit/smoke vigentes.
5. **Schema dual de refinamiento**: cualquier consumer nuevo debe usar helpers `obtenerRefinamiento` / `refinaA` / `refinamientosDe`, **nunca** acceder a `entidad.refinamiento` directamente — el campo singular fue eliminado del tipo TS.

## Proximos Pasos Operativos

1. **Decidir orden de ejecución**: Beta1 (ronda 16) primero o iniciar paralelo cauteloso con Beta2 (ronda 17). Recomendación: Beta1 primero porque Beta2 supone dominio ancla cerrado.
2. **Antes de abrir ronda 16**:
   - Calibrar `progress-dashboard.mjs` si la deuda de detector documentada en ciclos previos sigue presente (revisar contra estado actual).
   - Revisar si los reportes en `docs/bugs/` post-cierre hacen surgir bugs adicionales no listados acá.
   - Considerar si el icono "Traer" en `ToolbarMapaSistema.tsx` (anotado durante ronda 18 P3) merece bug propio.
3. **Mantener loop verde**:
   - `cd app && bun run check`
   - `cd app && bun run lint`
   - `cd app && bun run build`
   - `cd app && bun run browser:smoke`
   - `node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real`
4. **Push controlado a `origin/main`** ejecutado en este corte. Posteriores empujes desde main por el operador habituales.

## Prompt De Continuacion Breve

Usa `docs/HANDOFF.md` como memoria única. Estado: `main @ cf289ce`, 20 commits empujados a `origin/main` en el corte pre-Beta1/Beta2. Loop verde 926 unit / 129 smoke / build ~260 KB. Ronda 18 (refactor visual chrome) y ronda 15.2 (schema dual ortogonal de refinamiento) integradas; bugs 692129 + 91e001 + 13c786 + 13e330 cerrados. Beta1 (ronda 16) y Beta2 (ronda 17) están **diseñadas pero no ejecutadas** en `docs/instrucciones-lineas-dev/ronda{16,17}/`. Próximo paso: ejecutar Beta1 desde ronda 16 con orden L4 → L3 → L1 → L2 → L5 sobre un dominio ancla real, manteniendo política tokens-only y handoff único.
