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
