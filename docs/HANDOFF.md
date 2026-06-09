# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-06-09 · **Repositorio**: `deep-opm-pro` · **Rama**: `main`
**Corte de producto vigente (2026-06-06)**: persistencia OPM backend-only desplegada con optimistic locking y corte C5 de erradicación de storage navegador ya en producción. Modelos, versiones, workspace/carpetas, recientes, autosave, ownership y revisión viven en Postgres/API; no hay cache, fallback ni recuperación legacy desde storage del navegador.
**Instancia**: `https://opforja.sanixai.com` — pública sin auth perimetral. **BLINDAJE EJECUTADO 2026-06-06**: secrets reales rotados, volumen Postgres recreado limpio, **backup diario** `pg_dump` con retención 14d, **rate-limit nginx** por IP real. **Persistencia C1-C5 desplegada 2026-06-06**: backend/API/Postgres son SSOT única. Auth/tenants real sigue pendiente como próximo corte mayor.
**Frentes desplegados**: canvas infinito (2026-06-03), mobile solo-lectura v1 (2026-06-06), paneles OPL/Inspector hideables y resizable (2026-06-08). **Migración familia-V→skill**: fase activa de retiro cerrada (V3/V4/V5/V7 + colas `cuando`/`según`); ver § Estado de la migración familia-V→skill.
**Programa integrado**: F0/F1/F2/F3 están en `main` con kernels y UX ad-hoc; simulación Ss queda verde en e2e beta2.

> **Historia completa**: las actualizaciones anteriores a 2026-06-06 están en la historia git.

---

## Estado de la migración familia-V→skill (consolidado, actualizado 2026-06-09)

`mapearFamiliaV` (`src/autoria/compilar/normalizador.ts`) es el adaptador legacy que puentea formas OPL laxas del proto-modelo al modelo. La migración retira reglas del puente conforme la skill `modelamiento-opm` emite la forma E2 estricta — principio **P3: «compilador = verificador, no puenteador silencioso»**. Los docs de trabajo `docs/proto-modelo/*` se retiraron (commit `2a83c1c5`); el SSOT del estado es **esta sección + la historia git + los fixtures/tests** (`familia-v-e2.fixtures.ts` = ledger ejecutable; `migracion-familia-v.test.ts` = guardas de retiro).

**Fase activa de retiro — CERRADA (3 retiros):**
- **V3/V4/V5/V7** (F5-parcial, 2026-06-08): tenían E2 estricta byte-idéntica; 7 líneas HODOM migradas (`aplicar-f5-parcial-hodom.ts`). Retiradas `mapearPuedeIniciar/Alimenta/Detecta/PrecedeA`.
- **Cola `cuando`** (F5-V12, `f3421906`, 2026-06-09): era ancla meta (no OPM nuclear — el spike probó que vive fuera del plano bimodal; su canal reverse es `re-elicitar`, no el parser). 4 líneas HODOM → E2 + `[RATIFICAR]` (`aplicar-f5-v12-hodom.ts`, idempotente, guarda −4/0/4). Tabla abajo.
- **Cola `según`** (auditoría 2026-06-09): **era un bug de pérdida silenciosa** — tiraba enlaces+ancla sin error cuando el objeto de la cola estaba declarado (HODOM real l.1594 `… a 'a','b' o 'c' según Disponibilidad de admisión` → 0 enlaces). Ahora **rechaza ruidoso**. `mapearColaCondicional` renombrada `mapearRequiereDentro` (solo R4 `dentro del` sobrevive ahí); `expandirTsMultidestino` eliminada (muerta).

Contrato: las formas laxas retiradas **rechazan ruidoso**; la E2 estricta compila por la ruta canónica con el mismo modelo observable. Golden DSL hd-opm **byte-idéntico** (independiente del proto). Gate **2335/0**, lint limpio.

**Las 4 líneas `cuando` migradas (F5-V12):**
| Forma laxa (`cuando`, ahora rechazada) | Forma E2 estricta emitida por la skill |
|---|---|
| `cambia Indicación médica a 'cumplida' cuando se completa la orden` | `cambia Indicación médica a 'cumplida'. [RATIFICAR: se completa la orden]` |
| `requiere Voluntad anticipada vigente cuando la decisión puede escalar` | `requiere Voluntad anticipada en estado 'vigente'. [RATIFICAR: la decisión puede escalar — Ley 20.584]` |
| `cambia Indicación médica a 'suspendida' cuando supersede una indicación previa` | `cambia Indicación médica a 'suspendida'. [RATIFICAR: supersede una indicación previa]` |
| `genera Evento adverso cuando detecta una IAAS` | `genera Evento adverso. [RATIFICAR: detecta una IAAS]` |

**Resto = legacy estable (NO en migración activa):** las 11 reglas requiere-decisión (`V1 V2 V6 V8 V9 V10 V11 V13 V14 V15 V16 V17`) siguen en `mapearFamiliaV` como legacy. El **método para migrar cualquiera está fijado por el spike**: ¿la forma es **OPM nuclear** (estructura con glifo+oración bimodal) → modelar estricto (Opción 1); o **meta/pendiente** (ancla, sin superficie bimodal) → `[RATIFICAR]`/legacy (Opción 2/3)? No hay corte agendado; **no tocar `mapearFamiliaV` sin decisión del operador**.

**Pendientes de dominio (hd-opm, WIP del operador — NO tocar desde deep-opm-pro):**
- Línea 1594 (`según Disponibilidad`) ahora rechaza ruidoso: necesita modelado estricto (abanico 3-vías + correspondencia estado→rama, p.ej. condición estructural o `[RATIFICAR]`) — cae en el re-modelado activo de admisión (Causal/Requisito de ingreso).
- Línea `se ejecuta solo cuando … medicamento de alto riesgo`: prosa, no OPL compilable; sin acción.

## Actualización 2026-06-08 — BUGs paneles OPL/Inspector hideables y resizable

**Estado:** ambos bugs resueltos y desplegados en producción. Panel OPL izquierdo resizable horizontalmente (160–400px); ambos paneles se pueden ocultar/mostrar vía botones en headers. Bundle vigente `assets/index-C8dIvPcf.js`. **Validado por operador 2026-06-08.**

**Pendientes:** posible persistencia del estado de visibilidad; atajo de teclado para toggle; posible animación CSS.

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
