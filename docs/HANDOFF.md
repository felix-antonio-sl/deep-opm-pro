# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-06-08 · **Repositorio**: `deep-opm-pro` · **Rama**: `main`
**Corte de producto vigente (2026-06-06)**: persistencia OPM backend-only desplegada con optimistic locking y corte C5 de erradicación de storage navegador ya en producción. Modelos, versiones, workspace/carpetas, recientes, autosave, ownership y revisión viven en Postgres/API; no hay cache, fallback ni recuperación legacy desde storage del navegador.
**Instancia**: `https://opforja.sanixai.com` — pública sin auth perimetral. **BLINDAJE EJECUTADO 2026-06-06**: secrets reales rotados, volumen Postgres recreado limpio, **backup diario** `pg_dump` con retención 14d, **rate-limit nginx** por IP real. **Persistencia C1-C5 desplegada 2026-06-06**: backend/API/Postgres son SSOT única. Auth/tenants real sigue pendiente como próximo corte mayor.
**Frentes desplegados**: canvas infinito (2026-06-03), mobile solo-lectura v1 (2026-06-06), paneles OPL/Inspector hideables y resizable (2026-06-08), migración familia-V→skill F5-parcial (2026-06-08).
**Programa integrado**: F0/F1/F2/F3 están en `main` con kernels y UX ad-hoc; simulación Ss queda verde en e2e beta2.

> **Historia completa**: las actualizaciones anteriores a 2026-06-06 están en la historia git.

---

## Actualización 2026-06-08 — migración familia-V→skill F5-parcial (V3/V4/V5/V7 RETIRADAS del compilador)

**Estado:** F5-parcial cerrado. Retiradas las 4 reglas migrable-estricto (V3/V4/V5/V7) de `mapearFamiliaV` (`src/autoria/compilar/normalizador.ts`), tras migrar las 7 líneas del proto HODOM a su forma E2 estricta.

**Cambio (dos pasos):**
1. **Proto HODOM** (`/home/felix/projects/hd-opm/docs/modelo-opm-hodom-completo.md`, SSOT de dominio): 7 líneas laxo→E2. Aplicadas vía script auto-verificante `app/scripts/aplicar-f5-parcial-hodom.ts`.
2. **Compilador**: retiradas `mapearPuedeIniciar`/`mapearAlimenta`/`mapearDetecta`/`mapearPrecedeA` + sus regexes + las 4 líneas de despacho.

**Contrato nuevo (verificado):** la forma laxa de las 4 ahora **rechaza ruidoso**. La E2 estricta compila por la ruta canónica produciendo el mismo modelo observable.

**Verificación:** `cd app && bun run check` → **2325 pass / 0 fail**; `bun run lint` limpio. Golden hd-opm v1.6 regenerado byte-idéntico.

**Prompt breve de continuación:** "F5-parcial cerrado. Frentes abiertos gateados: (b) transporte de las 12 requiere-decisión, empezar por V12; (c) corte mayor auth/tenants. No tocar el resto de `mapearFamiliaV` sin (b)."

## Actualización 2026-06-08 — migración familia-V→skill F5-V12 (cola `cuando` retirada de V12, 4 líneas HODOM migradas a E2+RATIFICAR)

**Estado:** F5-V12 cerrado. Estrechada V12 en el compilador: retirada la cola `cuando` del regex de `mapearColaCondicional` (`normalizador.ts:720`). La cola `según` multi-destino y R4 (`dentro del`) sobreviven. Las 4 líneas `cuando` del proto HODOM migradas a forma E2 estricta + `[RATIFICAR: ...]` explícito.

**Cambio (dos pasos):**
1. **Compilador** (`normalizador.ts`): eliminado `COLA_CUANDO_RE` del dispatch V12. `cuando` ahora **rechaza ruidoso** (la skill debe emitir TS/efecto/requiere estricto + `[RATIFICAR]` explícito). Principio P3: compilador = verificador, no puenteador silencioso.
2. **Proto HODOM** (SSOT `hd-opm`): 4 líneas migradas vía script auto-verificante `app/scripts/aplicar-f5-v12-hodom.ts` (idempotente, guarda: −4 rechazos / 0 nuevos / 4 anclas RATIFICAR presentes).

**Las 4 líneas migradas:**
| Línea | Forma laxa (`cuando`, rechazada) | Forma E2 estricta |
|---|---|---|
| `cambia Indicación médica a 'cumplida' cuando se completa la orden` | Cola tautológica | `cambia Indicación médica a 'cumplida'. [RATIFICAR: se completa la orden]` |
| `requiere Voluntad anticipada vigente cuando la decisión puede escalar` | Estado pegado como adjetivo | `requiere Voluntad anticipada en estado 'vigente'. [RATIFICAR: la decisión puede escalar — Ley 20.584]` |
| `cambia Indicación médica a 'suspendida' cuando supersede una indicación previa` | Regla de negocio | `cambia Indicación médica a 'suspendida'. [RATIFICAR: supersede una indicación previa]` |
| `genera Evento adverso cuando detecta una IAAS` | Cola informativa | `genera Evento adverso. [RATIFICAR: detecta una IAAS]` |

**Decisiones del operador (2026-06-08):**
- Línea 2: condición de estado estricta `en estado 'vigente'` + ancla normativa Ley 20.584 (Q3).
- Línea 7 (`se ejecuta solo cuando la atención incluye un medicamento de alto riesgo`): descartada del slice; es prosa comentario, no OPL compilable. El probe la reportó como match de regex pero no está en bloque ` ```opl `.
- Línea 4 (`por una Causal de exclusión`): NO era V12 (clasificada `estricta` por el compilador; `por una` no matchea los regex de V12). El paso hermano propuesto (`requiere Causal`) queda **descartado**: supersedido por el re-modelado activo del operador (split `Causal de exclusión` XOR-4 + `Requisito de ingreso incumplido` XOR-3, D-drift-4).
- **G-abanico** (línea 6, `según Disponibilidad de admisión`): diferido a mini-spike futuro. Sigue en V12 como única forma sobreviviente de `según` multi-destino.

**Verificación:**
- `cd app && bun run check` → **2333 pass / 0 fail**
- `bun run lint` limpio.
- Script `aplicar-f5-v12-hodom.ts` idempotente: guarda −4/0/4.
- Tests volteados al contrato nuevo: `normalizador.test.ts` (`cuando` ya no mapea V12), `familia-v.test.ts` (`cuando` no produce ancla silenciosa), `anclas.test.ts` (reentrancia re-apuntada a `según` sobreviviente).
- Golden DSL hd-opm byte-idéntico (el golden es independiente del proto; no se mueve).

**Pendientes F5-V12:**
- Línea 6 G-abanico (`según Disponibilidad de admisión`) — mini-spike aparte.
- Línea 7 (`se ejecuta solo cuando`) — prosa, no OPL; fuera del pipeline del compilador.

**Prompt breve de continuación:** "F5-V12 cerrado (cola `cuando` retirada de V12, 4 líneas HODOM migradas a E2+RATIFICAR). Frentes abiertos: G-abanico (línea 6 `según Disponibilidad`) como mini-spike, luego las 11 requiere-decisión restantes. No tocar `mapearFamiliaV` sin decisión del operador."

## Actualización 2026-06-08 — BUGs paneles OPL/Inspector hideables y resizable

**Estado:** ambos bugs resueltos y desplegados en producción. Panel OPL izquierdo resizable horizontalmente (160–400px); ambos paneles se pueden ocultar/mostrar vía botones en headers. Bundle vigente `assets/index-C8dIvPcf.js`. **Validado por operador 2026-06-08.**

**Pendientes:** posible persistencia del estado de visibilidad; atajo de teclado para toggle; posible animación CSS.

## Actualización 2026-06-08 — migración familia-V→skill F3 (auditoría usoFamiliaV)

**Estado:** F3 cerrado. Instrumentación de auditoría `usoFamiliaV` no bloqueante. Mapa de dependencia real medido: HODOM 27 usos (7 migrable-estricto + 20 requiere-decisión).

## Actualización 2026-06-07 — migración familia-V→skill F2 (equivalencia ejecutable)

**Estado:** F2 cerrado. Clasificación medida empíricamente: V3/V4/V5/V7 migrable-estrictas, 12 requieren decisión de transporte. 25 tests verdes.

## Actualización 2026-06-06 — mobile solo-lectura v1 Fases 0-5 DESPLEGADAS

**Estado:** Fases 0-5 implementadas, verificadas y **desplegadas en producción**. `VITE_MOBILE_READONLY=true` activado, bundle `assets/index-BzdEpu38.js` contiene `MobileReadonlyApp`. Fix post-deploy 2026-06-07: `pageStyle` usa `layout.page` en modo solo lectura.

**Spec:** `docs/specs/mobile-readonly-v1-steipete-cat-jointjs.md`.

## Actualización 2026-06-06 — frontera autoría/modelo/OPL sincronizada

**Estado:** consolidada la separación de responsabilidades entre `src/autoria` y el resto de `src`. `autoria` queda como capa headless de construcción/DSL sobre el modelo. Tests de arquitectura protegen la frontera. Gate: `cd app && bun run check` → **2259 pass / 0 fail**.

## Actualización 2026-06-06 — persistencia C5 storage navegador erradicado

**Estado:** implementado y desplegado. Se eliminó `app/src/persistencia/local.ts`. Backend/API/Postgres son SSOT única. Sin migración legacy desde navegador.

## Actualización 2026-06-06 — persistencia C4 optimistic locking

**Estado:** cerrado. `revision` por modelo; guardado con revisión obsoleta devuelve 409.

## Actualización 2026-06-06 — simulación conceptual por microfases OPM

**Estado:** runtime observable recorre microfases `preparación → consumo → proceso → resultado → cierre`. Desplegado en producción.

## Actualización 2026-06-05 — retiro del sistema de avance HU

**Estado:** retirado el subsistema que convertía HU en porcentaje de avance. `gate:refactor` vuelve a medir solo artefactos ejecutables.

---

## Frentes abiertos (orden sugerido)

1. **Transporte familia-V→skill** — las 12 requiere-decisión (empezar por V12): superficie reverse / emisión estructurada / legacy permanente.
2. **Auth/tenants real** — identidad, login, administración de tenants, invitaciones/roles, ownership compuesto.
3. **GAPs de alineación OPD** — backlog en `docs/roadmap/` §22 de spec-forja-opd-es.

## Riesgos activos

- Instancia pública sin auth perimetral (decisión del operador, blindaje ejecutado).
- Sesiones abiertas antes del deploy de persistencia pueden necesitar recarga.
- `VITE_MOBILE_READONLY` como build flag requiere rebuild/redeploy para rollback.
