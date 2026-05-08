# Ronda 21 — Cierre residual UX: inicio, responsive y evals permanentes

**Fecha**: 2026-05-08
**Base**: `main` @ commit `a7dfce4` más rondas 19 y 20 cuando estén mergeadas.
**Objetivo**: llevar a líneas de desarrollo todo lo que queda del informe `docs/audits/opm-app-ux-2026-05-07/informe-final-ui-ux.md` que no fue corregido en Fase 0 ni concretizado en rondas 19 y 20: estado vacío OPM, responsive como modo revisión y evals UX permanentes.

> **Nota de partición**: 3 líneas. L1 toca el primer valor del flujo principal. L2 redefine comportamiento responsive sin reabrir desktop. L3 convierte los evals mínimos del informe en infraestructura repetible. Las tres pueden desarrollarse en paralelo porque sus archivos de escritura son mayormente disjuntos.

## 1. Filosofía operativa

- **Cierre de informe, no wishlist**: cada línea existe porque el informe dejó un pendiente explícito fuera de Fase 0/ronda19/ronda20.
- **No tutorial mode**: EPICA-91 está descartada del proyecto. El estado vacío puede ofrecer acciones compactas, pero no onboarding guiado ni overlays pedagógicos.
- **Modo mobile realista**: a 390px la app es de revisión/navegación, no de modelado desktop comprimido.
- **Evals como producto**: las pruebas visuales no son screenshots decorativos; deben medir flujos, tiempos, fallos, responsive y regresiones.
- **No reinventar**: antes de diseñar controles, revisar `opm-extracted/`, `assets/`, `docs/JOYAS.md`, SSOT OPM y scripts visuales existentes en `app/scripts/`.

## 2. Reglas duras comunes

1. No tocar `docs/HANDOFF.md`, `docs/historias-usuario-v2/` ni el informe histórico.
2. Preservar todos los `data-testid` y `aria-label` existentes. Agregar hooks nuevos solo cuando el brief lo pida.
3. Usar `tokens.ts` para chrome UI. Cero hex literales nuevos.
4. Mantener el canvas OPM canónico: dimensiones 135x60, Arial 14 semibold, colores de `docs/JOYAS.md`, markers de `assets/svg/links/`.
5. Cambios aditivos por defecto. Si una línea requiere ocultar una acción en mobile, debe seguir disponible en desktop/tablet y con alternativa de revisión en mobile.
6. Cada línea debe agregar tests y cerrar loop verde: `bun run check`, `bun run lint`, `bun run build`, `bun run browser:smoke`.
7. Cada línea debe incluir audit visual in-vivo con screenshots regenerables bajo `app/test-results/` o `app/_eval-output/`; no versionar capturas.
8. Si se proponen HU nuevas, declararlas como propuestas en commit. No editar backlog vivo.
9. Revisar `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md` y `opm-extracted/assets/` antes de implementar.

## 3. Stack y comandos

```bash
cd app
bun run check
bun run lint
bun run build
bun run browser:smoke
bun run scripts/evaluacion-exhaustiva.mjs http://127.0.0.1:5173/ --out ronda21
```

Dev server: `cd app && bun run dev`.

## 4. Visión general de las 3 líneas

| ID | Título | Pendiente que cierra | HU eje | Tamaño | Riesgo |
|---|---|---|---|---|---|
| L1 | Estado vacío OPM con inicio compacto | informe §P2 estado vacío + eval "crear SD <60s" | EPICA-10, EPICA-34 | M | bajo |
| L2 | Responsive como modo revisión/navegación | informe §P2 responsive + eval mobile | EPICA-20, EPICA-50, EPICA-90 | M-L | medio |
| L3 | Evals UX permanentes con fixtures y métricas | informe §Fase 3 + evals mínimos | roadmap/evals | M | medio |

## 5. Mapa de archivos por línea

| Archivo | L1 inicio OPM | L2 responsive review | L3 evals UX |
|---|---|---|---|
| `src/ui/CanvasVacio.tsx` o componente equivalente | aditivo | lectura | lectura |
| `src/ui/EstadoVacioOpm.tsx` (NUEVO) | NUEVO | vacio | lectura |
| `src/ui/App.tsx` | aditivo | aditivo | lectura |
| `src/ui/toolbar/ToolbarBase.tsx` | lectura | aditivo | lectura |
| `src/ui/layoutResponsive.ts` (NUEVO) | vacio | NUEVO | lectura |
| `src/ui/ModoRevisionMobile.tsx` (NUEVO) | vacio | NUEVO | lectura |
| `src/ui/tokens.ts` | aditivo | aditivo | vacio |
| `src/store/modelo/acciones-canvas.ts` | aditivo | vacio | lectura |
| `src/store/sliceTypes.ts` | aditivo | aditivo | vacio |
| `src/store/uiPanel.ts` | aditivo | aditivo | vacio |
| `src/store/modelo/acciones-ui.ts` | aditivo | aditivo | vacio |
| `e2e/21-estado-vacio-opm.spec.ts` (NUEVO) | NUEVO | vacio | lectura |
| `e2e/22-responsive-review.spec.ts` (NUEVO) | vacio | NUEVO | lectura |
| `scripts/evaluacion-exhaustiva.mjs` | lectura | lectura | aditivo |
| `scripts/evaluacion-ux-permanente.mjs` (NUEVO) | vacio | vacio | NUEVO |
| `scripts/fixtures-ux-regresion.mjs` (NUEVO) | vacio | vacio | NUEVO |
| `package.json` | vacio | vacio | aditivo (script) |

Colisiones controladas: `App.tsx`, `tokens.ts`, `sliceTypes.ts`, `uiPanel.ts` y `acciones-ui.ts`. L1 y L2 agregan campos distintos; L3 solo lee app y escribe scripts.

## 6. Protocolo de conciliación

Orden de merge sugerido: **L3 → L1 → L2**.

Rationale: L3 crea medición antes de cambiar UX; L1 mejora primer valor sin depender de responsive; L2 va al final porque altera prioridades por viewport y debe medirse con el harness ya estabilizado.

## 7. Anclaje a HU y SSOT

- EPICA-10: creación de proceso/objeto/enlace inicial.
- EPICA-20: navegación OPD.
- EPICA-30/34: persistencia/nuevo modelo.
- EPICA-40/refinamiento vía árbol OPD e Inspector: crear/navegar refinamientos sin perder contexto.
- EPICA-50: OPL como lente textual.
- EPICA-42: comentarios/notas solo como capacidad de revisión si ya existe; no inventar comentarios desde esta ronda si no hay base productiva.
- EPICA-90: atajos y axioma de no creación por teclado.
- EPICA-91 no se usa: está descartada.
- SSOT: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Evidencia OPCloud: `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/assets/`.

## 8. Brief por línea

| ID | Brief |
|---|---|
| L1 | [linea-1-estado-vacio-opm.md](linea-1-estado-vacio-opm.md) |
| L2 | [linea-2-responsive-modo-revision.md](linea-2-responsive-modo-revision.md) |
| L3 | [linea-3-evals-ux-permanentes.md](linea-3-evals-ux-permanentes.md) |

Prompt de asignación: [prompt-asignacion.md](prompt-asignacion.md).

## 9. Verificación al cierre de la ronda

- `bun run check` → unit tests verdes.
- `bun run lint` → clean.
- `bun run build` → bundle dentro del tope que deje ronda20.
- `bun run browser:smoke` → 149+ smoke pass / 0 fail.
- `bun run scripts/evaluacion-ux-permanente.mjs --strict` → genera reporte JSON/MD, screenshots regenerables y FAIL/WARN accionables.
- Evals mínimos del informe cubiertos por tests o criterios explícitos:
  - crear SD mínimo desde vacío en menos de 60s;
  - enlace click-click y drag source-target;
  - nombre consistente tras fixture/import;
  - modelo activo y OPD activo visibles simultáneamente;
  - refinar al menos una entidad y navegar el OPD hijo;
  - navegar 8 OPDs y distinguir refinamiento;
  - warning legible a 1280x720;
  - OPL filtrado por selección;
  - auto-layout encaja todo;
  - persistencia entendible al guardar/importar/exportar/descartar/versionar;
  - mobile revisa OPD/OPL/issues/selección y comentarios-notas si existen, sin toolbar saturada.

## 10. Matriz de cobertura del informe UI/UX

| Pendiente del informe | Estado de empaquetado |
|---|---|
| P0 identidad de modelo | Cerrado en Fase 0, commits previos documentados en `docs/HANDOFF.md` |
| P0 toolbar/menús solapados | Cerrado en Fase 0 y estructurado para Fase 1 en `ronda19/L1` |
| P0 creación de enlaces implícita | Concretizado en `ronda19/L2` |
| P1 validación mal presentada | Concretizado en `ronda19/L3` |
| P1 OPD tree subestimado | Concretizado en `ronda19/L4` |
| P2 chip persistencia | Concretizado en `ronda19/L5` |
| P1 Inspector con demasiadas responsabilidades | Concretizado en `ronda20/L1` |
| P1 OPL fuerte con contratos confusos + rail minimizado | Concretizado en `ronda20/L2` |
| P1 Biblioteca mal ubicada | Concretizado en `ronda20/L3` |
| P1 estados con nombres pobres | Concretizado en `ronda20/L4` |
| P1 auto-layout sin fit-to-view | Cerrado en Fase 0 |
| P2 feedback compite con errores | Cerrado en Fase 0 |
| P2 estado vacío demasiado neutral | Concretizado en `ronda21/L1` |
| P2 responsive es compresión | Concretizado en `ronda21/L2` |
| Fase 3 evals UX permanentes | Concretizado en `ronda21/L3` |

Con esta matriz, todo lo no corregido en Fase 0 ni concretizado en ronda19 queda asignado a ronda20 o ronda21.

## 11. Matriz de cobertura de resultado esperado

| Resultado esperado del informe | Línea responsable |
|---|---|
| Crear un SD inicial en menos de un minuto | `ronda21/L1` + eval `ronda21/L3` |
| Conectar entidades con enlaces válidos sin adivinar gestos | `ronda19/L2` + eval `ronda21/L3` |
| Ver siempre qué modelo y OPD está editando | Fase 0 identidad + `ronda19/L4` OPD activo + `ronda19/L5` chip persistencia |
| Diferenciar error estructural, mejora metodológica y preferencia visual | `ronda19/L3` |
| Navegar refinamientos OPD como estructura del sistema | `ronda19/L4` + `ronda20/L1` tab Refinamiento |
| Leer OPL como vista bimodal con acciones honestas | Fase 0 AI Text beta + `ronda20/L2` |
| Guardar, importar, descartar, exportar y versionar sin dudas | `ronda19/L1` cluster Modelo + `ronda19/L5` chip + eval `ronda21/L3` |
| Mobile como revisión/navegación, no desktop comprimido | `ronda21/L2` |
| Evals permanentes de flujos, screenshots, tiempos y fallos | `ronda21/L3` |
