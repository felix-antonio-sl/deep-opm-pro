# Ronda 4 — Instrucciones de líneas de desarrollo paralelas

**Fecha**: 2026-05-05
**Base**: `main` @ commit `338c1de` — MVP-α + rondas 1, 2 y 3 completas, con auditoría HU regenerada
**Objetivo**: 5 líneas paralelas que cierran brechas directas del HANDOFF sin inflar `app/src/modelo/operaciones.ts`, ancladas en HU v2, SSOT OPM y evidencia de `opm-extracted/`.

## 1. Filosofía operativa

- **No reinventar**: antes de diseñar, revisar `opm-extracted/INDEX.md`, `opm-extracted/MODULES.md`, `opm-extracted/README.md`, `opm-extracted/REFACTOR-NOTES.md`, `opm-extracted/assets/INDEX.md`, módulos `src/` relevantes, `assets/svg/`, `docs/JOYAS.md`, `fixtures/` y la SSOT `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- **HU como contrato**: cada línea cierra HU explícitas o reduce una brecha registrada por auditoría. Si una HU no cabe, queda fuera con razón documentada.
- **Aditividad estricta**: campos nuevos opcionales, helpers nuevos y módulos nuevos. No renombrar tipos, no romper JSON legacy, no reordenar APIs públicas sin necesidad.
- **Modularidad por dominio**: `operaciones.ts` ya está en 1743 LOC. Toda lógica nueva vive en archivo de dominio nuevo o helper nuevo; `operaciones.ts` solo admite wrappers mínimos y justificados.
- **Loop verde obligatorio**: cada línea cierra con `cd app && bun run check`; si toca UI/render, también `bun run browser:smoke`; si toca proyección JointJS pesada, también `bun run build`.

## 2. Reglas duras comunes

1. **Scope estricto**: solo tocar archivos permitidos por el brief. Si aparece un cambio cross-line no previsto, detenerse y reportar.
2. **No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`** desde líneas individuales. La consolidación final actualiza el handoff único.
3. **No copiar código 1:1 desde `opm-extracted/`**. Se usa como evidencia semántica, UX y trazabilidad, no como fuente portable.
4. **Citas explícitas**: toda decisión semántica cita SSOT (`opm-iso-19450-es.md`, `opm-visual-es.md`, `opm-opl-es.md`) o documento interno (`docs/JOYAS.md`, `opm-extracted/...`).
5. **Assets canónicos**: markers y conectores salen de `assets/svg/links/`. Para L1, usar `assets/svg/links/logical/{xor,or}.svg`; no redibujar a mano salvo normalización trazable para JointJS.
6. **JSON lossless**: cualquier campo nuevo se serializa/deserializa con default seguro; modelos previos siguen cargando.
7. **Tests por capa**: kernel, serialización, OPL, render y store/UI se prueban según el blast radius de cada línea.
8. **Idiomas**: documentación y mensajes de usuario en es-CL; identificadores siguen el estilo existente del repo.
9. **No introducir backend, Firebase, auth, Rappid ni dependencias nuevas** para estas líneas.
10. **Commits de línea**: mensajes imperativos con `feat(...)`, `test(...)` o `refactor(...)`; reportar hashes y comandos ejecutados al cerrar.

## 3. Stack y comandos

- Bun 1.3+, TypeScript strict, Preact 10 + Signals, Zustand 5, JointJS 3.7 core, Vite 6, Playwright.
- Working directory: `/home/felix/projects/deep-opm-pro`; app en `app/`.

```bash
cd app
bun run check          # typecheck + unit tests
bun run browser:smoke  # Playwright Chromium para UI/render
bun run build          # build Vite; warning de chunk JointJS esperado
bun run dev            # localhost:5173
```

Auditoría HU al cierre de consolidación:

```bash
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

## 4. Visión general de las 5 líneas

| ID | Título | Pendiente que cierra | HU eje | Tamaño | Riesgo |
|---|---|---|---|---|---|
| **L1** | Conectores lógicos canónicos O/XOR | HANDOFF 1: overlay textual de abanicos | HU-15.010, HU-15.011 | S | bajo |
| **L2** | Gesto directo a cápsula de estado | HANDOFF 2: cerrar HU-13.014 plena | HU-13.014 | M | medio |
| **L3** | Abanicos a estados y etiquetas de ruta | HANDOFF 3-4: HU-15.013 + rutas | HU-15.013, HU-15.005, HU-15.007 | M | medio-alto |
| **L4** | Auto-invocación con demora por defecto | HANDOFF 5 | HU-15.020 | M | medio |
| **L5** | Plegado parcial nesting y filas activas | HANDOFF 6: EPICA-18 nesting | HU-18.008, HU-18.014, HU-18.015 + Q18.1 | M | medio |

Quedan fuera de ronda: OPL bidireccional plena, code splitting JointJS, licencia, IndexedDB y redistribución pública.

## 5. Mapa de archivos por línea

Convención: `aditivo` = solo agregar o conectar helper; `nuevo` = archivo creado por esa línea; `lectura` = puede leerse pero no editarse; vacío = sin contacto.

| Archivo | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|
| `app/src/modelo/tipos.ts` | lectura | lectura | aditivo (`rutaEtiqueta?`) | lectura | aditivo (`ordenPartes?`, si se necesita) |
| `app/src/modelo/operaciones.ts` | lectura | lectura | lectura | aditivo acotado solo si `crearAutoInvocacion` requiere helper común | lectura |
| `app/src/modelo/extremos.ts` | lectura | lectura | lectura | lectura | lectura |
| `app/src/modelo/abanicos.ts` | lectura | lectura | aditivo (puerto exacto con extremos estado) | lectura | lectura |
| `app/src/modelo/rutas.ts` | — | — | **nuevo** | — | — |
| `app/src/modelo/autoinvocacion.ts` | — | — | — | **nuevo** | — |
| `app/src/modelo/plegado.ts` | lectura | lectura | lectura | lectura | aditivo |
| `app/src/render/jointjs/linkAssets.ts` | aditivo (`logical`) | lectura | lectura | lectura | lectura |
| `app/src/render/jointjs/proyeccion.ts` | aditivo acotado | aditivo acotado | aditivo acotado | aditivo acotado | aditivo acotado |
| `app/src/render/jointjs/abanicoOverlay.ts` | **nuevo** | — | — | — | — |
| `app/src/render/jointjs/estadoTargets.ts` | — | **nuevo** | lectura | — | — |
| `app/src/render/jointjs/rutaLabels.ts` | — | — | **nuevo** | — | — |
| `app/src/render/jointjs/autoinvocacionLoop.ts` | — | — | — | **nuevo** | — |
| `app/src/render/jointjs/plegadoNesting.ts` | — | — | — | — | **nuevo** |
| `app/src/render/jointjs/proyeccion.test.ts` | aditivo | aditivo | aditivo | aditivo | aditivo |
| `app/src/render/jointjs/JointCanvas.tsx` | lectura | aditivo (evento sobre cápsula) | lectura | lectura | aditivo (filas activas plegadas) |
| `app/src/store.ts` | lectura | aditivo (crear enlace a estado desde gesto) | aditivo (ruta) | aditivo (auto-invocación) | aditivo |
| `app/src/ui/InspectorEnlace.tsx` | lectura | lectura | aditivo (rutaEtiqueta) | lectura | lectura |
| `app/src/ui/InspectorEntidad.tsx` | lectura | lectura | lectura | aditivo (auto-invocación) | aditivo (orden/acciones plegado) |
| `app/src/ui/Toolbar.tsx` | lectura | lectura | lectura | lectura salvo decisión explícita | lectura |
| `app/src/opl/generar.ts` | lectura | lectura | aditivo (rutas + abanico a estados) | aditivo (IV2) | lectura |
| `app/src/opl/generar.test.ts` | lectura | lectura | aditivo | aditivo | lectura |
| `app/src/serializacion/json.ts` | lectura | lectura | aditivo (`rutaEtiqueta`) | lectura | aditivo (`ordenPartes?`) |
| `app/src/serializacion/json.test.ts` | lectura | lectura | aditivo | lectura | aditivo |
| `app/src/completitud.test.ts` | lectura | lectura | aditivo si se crea union nueva | aditivo si se crea union nueva | aditivo si se crea union nueva |
| `app/e2e/opm-smoke.spec.ts` | aditivo | aditivo | aditivo | aditivo | aditivo |
| `assets/svg/links/logical/{xor,or}.svg` | lectura canónica | — | — | — | — |

Reglas de colisión:
- `proyeccion.ts` es el único punto con edición compartida por las 5 líneas. Cada línea debe extraer su lógica a helper nuevo y dejar en `proyeccion.ts` solo una llamada pequeña.
- `store.ts` tolera entradas aditivas; no reordenar acciones existentes.
- L3 es la única línea que toca `abanicos.ts`.
- L4 no debe agregar `auto-invocacion` a `TipoEnlace` salvo que documente por qué `tipo="invocacion"` con mismo proceso no alcanza.

## 6. Protocolo de conciliación

Orden de merge sugerido: **L1 → L2 → L3 → L4 → L5**.

1. **L1 primero**: render-only y bajo riesgo; deja cerrado el overlay canónico de abanicos.
2. **L2 segundo**: habilita gesto directo a estado y produce evidencia e2e que L3 puede reutilizar.
3. **L3 tercero**: consume `ExtremoEnlace`, abanicos existentes y el gesto de L2 para ramas a estados + rutas.
4. **L4 cuarto**: toca invocación, OPL y render; independiente de L3, pero se beneficia de switch/cobertura ya estabilizados.
5. **L5 último**: mayor contacto con `proyeccion.ts`/`JointCanvas.tsx`; integra después de que el canvas de enlaces esté estable.

Después de cada merge: `cd app && bun run check`; si tocó UI/render: `bun run browser:smoke`; al cierre de ronda: `bun run build`.

## 7. Anclaje obligatorio a HU y SSOT

Antes de codificar cada línea, leer:

- HU listadas en el brief bajo `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/`.
- SSOT en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`:
  - `opm-visual-es.md`: V-239, V-240, §5 abanicos, §9 invocación.
  - `opm-opl-es.md`: TS3, IV1/IV2, §11 XOR/OR, §13 rutas.
  - `opm-iso-19450-es.md`: Glosario 3.60, 3.68, 3.81; combinatoria de abanicos y trayectorias de ejecución.
- Evidencia OPCloud en `opm-extracted/`:
  - `INDEX.md`, `MODULES.md`, `README.md`, `REFACTOR-NOTES.md`, `assets/INDEX.md`.
  - Módulos puntuales citados en cada brief (`linkDrawing.ts`, `InvocationLink.ts`, `SelfInvocationLink.ts`, consistency y Rappid/DrawnPart).

Si SSOT y OPCloud difieren, manda SSOT. OPCloud operacionaliza; no redefine semántica.

## 8. Brief por línea

| Línea | Brief |
|---|---|
| L1 | [linea-1-conectores-logicos-canonicos.md](./linea-1-conectores-logicos-canonicos.md) |
| L2 | [linea-2-gesto-directo-capsula-estado.md](./linea-2-gesto-directo-capsula-estado.md) |
| L3 | [linea-3-rutas-y-abanicos-a-estados.md](./linea-3-rutas-y-abanicos-a-estados.md) |
| L4 | [linea-4-auto-invocacion-demora.md](./linea-4-auto-invocacion-demora.md) |
| L5 | [linea-5-plegado-nesting-filas-activas.md](./linea-5-plegado-nesting-filas-activas.md) |

Prompt para asignar líneas: [prompt-asignacion.md](./prompt-asignacion.md).

## 9. Verificación al cierre de la ronda

```bash
cd app
bun run check
bun run browser:smoke
bun run build
cd ..
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

Métricas esperadas post-ronda 4:

- Unit tests: base 226; objetivo conservador **>= 260 tests verdes**.
- Smoke browser: base 23; objetivo conservador **>= 28 tests verdes**.
- HU cerradas o elevadas: HU-15.010, HU-15.011, HU-13.014, HU-15.013, HU-15.005, HU-15.007, HU-15.020, HU-18.008, HU-18.014, HU-18.015.
- `operaciones.ts` no debe crecer más de wrappers mínimos; cualquier crecimiento neto relevante se justifica en el reporte.
- `docs/HANDOFF.md` permanece intacto durante las líneas; se actualiza solo en consolidación final.
