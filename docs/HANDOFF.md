# HANDOFF — Estado operativo del modelador OPM

**Consolidación**: 2026-06-23 · **Repositorio**: `deep-opm-pro` · **Rama**: `main` (`1d6e45ed` == `origin/main`)
**Instancia**: `https://opforja.sanixai.com` — login obligatorio (auth v1, 2026-06-10).
**Doctrina**: este documento es la **única memoria de traspaso versionada** (CLAUDE.md §Reglas de oro 4). Se **reescribe y consolida**; no se acumulan actualizaciones fechadas ni se crean handoffs paralelos. El detalle commit-por-commit de cada corte (deploys, verificaciones in-vivo, remediaciones) vive en la **historia git** del repo. Lo que sigue es el **estado vigente**.

---

## Estado del producto (vigente al 2026-06-23)

Modelador OPM/ISO 19450 con arquitectura propia (no es fork de OPCloud), en producción con login obligatorio. Lo desplegado a la fecha:

| Subsistema | Corte | Nota |
|---|---|---|
| **Persistencia backend-only (C1-C5)** | 2026-06-06 | Modelos, versiones, workspace, autosave, ownership y revisión viven en Postgres/API. Optimistic locking por `revision` (409 ante guardado obsoleto). Sin cache ni fallback OPM en storage del navegador. |
| **Blindaje** | 2026-06-06 | Secrets rotados, volumen Postgres recreado limpio, backup diario `pg_dump` (retención 14d, `deploy/backup-opforja-db.sh`), rate-limit nginx por IP real. |
| **Auth/identidad v1** | 2026-06-10 | Login obligatorio single-operator; registro cerrado por CLI (`bun run auth:cuenta`). Cookie HMAC firmada `{tenantId,userId,auth:true}` Max-Age 30d, fail-closed. Migración 4 `auth_identidad` (`opforja_accounts` + membresía `opforja_account_tenants`). |
| **Mobile solo-lectura v1** | 2026-06-06 | Shell `MobileReadonlyApp` con gestos táctiles (pinch-zoom anclado, pan), selección de modelo del tenant. Build flag `VITE_MOBILE_READONLY=true`. |
| **Canvas infinito · paneles hideables/resizable** | 2026-03 · 2026-06-08 | Paneles OPL/Inspector resizable horizontalmente + toggle de visibilidad. |
| **Invocación implícita bimodal** | 2026-06-15 | `Opd.ordenInzoom: Id[][]` (campo de 1ª clase) declara el orden de subprocesos secuenciales en in-zoom; checker U5 acusa la doble vara en banda adyacente; layout/OPL/simulación lo consumen. Golden HODOM re-pineado y re-importado (279·480·44). |
| **Bucle dominio→opforja (H1+H2+H5)** | 2026-06-09 | `bun run render:headless` (PNG+SVG por OPD), `bun run verify:reproducible` (golden-harness). Skill `modelamiento-opm` v1.6.0 cierra el loop con el estado `revisar-visual`. |
| **Ciclo re-elicitación mesa↔skill (W6 ejecutable)** | 2026-06-09/10 | W6.0 puente de contexto (1-click) + W6.3 chip Vista + W6.4 anclas en Inspector + W6.5-a notas de mesa + W6.5-b registro [RATIFICAR] tipificado + W6.6 panel procedencia + LogDecisiones v0. El ciclo queda **cerrado de punta a punta**. |
| **Conformidad SSOT R-CONF-7** | 2026-06-12/14 | Todo DEBE implementado, declarado con gate o enmendado en KORA (`reglas-opm-estrictas-es` v1.4.0: sexta familia de enlace / excepción procedimental; `spec-forja-opd-es` v1.1.1; `spec-forja-opl-es` v1.2.1; bases co-enmendadas). Registro: `docs/roadmap/registro-conformidad-ssot.md`. |
| **Export por perfil + saneo de colas** | 2026-06-11 | `canon-diagrama` / `canon-documento` / `intercambio` subordinados a `gateDensidadCanonica`; `emitirDocumentoCanonico` (Markdown determinista). `pdf.ts`/`diff.ts` eliminados (colas colgantes). |
| **Compuesto OpForja (tramos C+D1+D4+D6+D8A)** | 2026-06-22 | Sello a 5 testigos colapsado a punto de verdad único; `doctrinaVersion`+`skillVersion` aditivas rollback-free; resolutor URN como datos (`docs/canon-opm/resolutor-urn.json`); ley render↛SSOT como test falsable; manual integrado (`docs/manual-opforja.md`); estereotipos+vitrinas D6 (`Entidad.estereotipoId?` + `Modelo.estereotipos?` + `<<Nombre>>` en canvas + `requirement` como estereotipo de fábrica). D6 verificado en vivo 2026-06-23 (0 defectos, 1 obs UX). |
| **Revert D7 (modo boceto/pizarra)** | 2026-06-23 | Construido y desplegado, **revertido** por «no resultó como quería» el operador. D6 intacto. HODOM sin regresión. |
| **Cordón C1 — version-match skill↔app** | 2026-06-24 | 7ª conjunción de `gate:refactor` (`bun run cordon:skill`): lee el `version` + `hash-fuente` del sello del **cuerpo** del deploy de la skill `modelamiento-opm` y rompe ante *deploy stale* (`[CORDON] FALLO: deploy stale`). Matriz version-duro / hash-blando / target / skip-nombrado. **Sin prereq de pneuma** (la premisa «el transmutador borra el version» era falsa: vive en el sello). Infra de gate, **no toca el bundle**. |

**Último deploy** (`1d6e45ed`): 4 contenedores healthy (`opforja` · `opforja-model-api` · `opforja-bug-capture` · `opforja-postgres`); bundle servido `index-CeJEaBAM.js`; HTTP 200 / `/__deep-opm/session` 401 sin cookie; HODOM `d22c8fc1` rev 2 sin regresión (279 entidades · 480 enlaces · 44 OPDs · 14 con `ordenInzoom`).

---

## Frentes abiertos (backlog)

Roadmap canónico: `docs/roadmap/cortes.md` (tramos C-cordón · E-expresión · X-exoesqueleto).

1. **gist-anchor / Stereotype real** — **BLOQUEADA**: doctrina custodio-kora + consenso de alcance + greda-bundle de gist. Análisis categorial cerrado (4 lentes convergentes): D6 es **Plantilla** (coproducto/Σ), no Stereotype; el Stereotype real = fibración de Grothendieck sobre registro global gobernado; composición = pullback; `Unlink` = forgetful. Hilo: `gist-opm/docs/derivaciones/*-2026-06-23.md`.
2. **Tramo C restante del compuesto**: ~~C1 version-match~~ **✅ RESUELTO 2026-06-24** (lee el `version` del sello del cuerpo del deploy, no del frontmatter; `bun run cordon:skill` en `gate:refactor`; sin prereq de pneuma — la premisa «el transmutador borra el version» era falsa). Restan: D3 skill re-sync (propuesta a custodio-kora); D8 Ola B (`spec:gen`, condicional al balance de lead-time de Ola A).
3. **Auth/tenants v2**: invitaciones, roles efectivos (la membresía `opforja_account_tenants` ya existe con `rol`), UI de administración, multiusuario por tenant. Diferido hasta demanda nombrada (horizonte 1-3 meses para artefactos derivados DT/hospital/GOREOS).
4. **Transporte familia-V→skill**: 12 reglas requiere-decisión restantes (legacy estable, sin corte agendado). **No tocar `mapearFamiliaV` sin decisión del operador.** Las retiradas (V3/V4/V5/V7 + colas `cuando`/`según`) rechazan ruidoso; el método está fijado por el spike (¿OPM nuclear → modelar estricto; o meta/pendiente → `[RATIFICAR]`/legacy?).
5. **Frentes UX diferidos**: F1.9 responsive canónico de la barra de simulación (1 sesión, blast 3-4 archivos) · F1.21 barra en mobile-no-readonly (1 archivo) · F1.22 panel ayuda `?` (1 sesión).
6. **GAPs §22** de `spec-forja-opd-es`: frente con agenda propia.
7. **Deuda categorial O(N²)**: coproducto tagged de selección (ver abajo). Se paga **solo** si un corte introduce un 4º tipo seleccionable.

---

## Decisiones rectoras (HITL — no reabrir sin HITL explícito)

- **EQUILIBRIO C1-C5** — distribución del LLM en el bucle mesa↔skill. Acta: `docs/auditorias/2026-06-04-acta-mesa-equilibrio-encarnacion.md`.
- **Flujo canónico E0-E6** — arquitectura hd-opm ↔ OpForja. Acta: `docs/auditorias/2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md`.
- **Estatuto R-CONF-7** (2026-06-11): reglas DEBE con tráfico = deuda exigible; sin tráfico se programan o enmiendan con nota explícita; **brecha silenciosa PROHIBIDA**. Canonizada en `reglas-opm-estrictas-es` v1.3.0+.
- **Clasificación de dominio vía ontología/tags, no estereotipos de §10** (2026-06-11): los 7 estereotipos §10.1.1 descartados como lote; explorar clasificación consultable barata primero.
- **Cristalización del compuesto OpForja** (2026-06-22, spec `docs/superpowers/specs/2026-06-22-compuesto-opforja-design.md`): 5 órganos (kora-pneuma SSOT · app · docs · skill · metodología/manual) que co-evolucionan. 5 decisiones de autoridad resueltas por consenso pleno (spec §5). Tramos C/E/X.
- **`kora-pneuma` = SSOT inmutable de solo lectura**; todo working-artifact vive en este repo. Toda decisión de autoridad o duda → consenso deliberativo, no al operador.

## Deuda categorial activa

**Trigger hacia coproducto tagged de selección (refactor A → B)**: `OpmStore` usa tres campos paralelos `seleccionId / enlaceSeleccionId / estadoSeleccionId`, sellados por invariante de exclusividad mutua en `setSeleccionPorTipo`. Al introducir un cuarto tipo seleccionable, migrar antes: reemplazar por `seleccion: { tipo: KindSeleccion; id: Id } | null` discriminado, con adaptadores backwards-compat. Fundamento (`urn:fxsl:kb:icas-universales`): el coproducto tagged es universal; N campos paralelos escalan el invariante a O(N²); el discriminado lo mantiene en O(1).

## Épicas descartadas

EPICA-70 (Importación OPCAT 4.2) y EPICA-91 (Modo tutorial). No proponer en rondas ni briefs.

## Riesgos activos

- **Password temporal del operador** en `~/.opforja-operator-credentials` (chmod 600) hasta reset (`docker exec -it opforja-model-api bun run ./app/scripts/auth-cuenta.ts reset felixsanhuezaluna@gmail.com`).
- **Deploy no automático**: `main` pusheado ≠ desplegado. Requiere `docker compose up -d --build` manual. Si el password quedó stale, verificar HODOM leyendo Postgres directo.
- **`VITE_MOBILE_READONLY` como build flag**: rebuild/redeploy para rollback.
- **F1.21**: el operador en modo simulación desde un viewport mobile-no-readonly ve la barra productiva dentro del shell mobile (UX tensionada, no roto).
- **Doctrina R-VIS-STEREO-1 en vuelo**: v1 omite «Nombre» del OPL núcleo (conforme con "PUEDE"); la ratificación/ampliación es del custodio-kora (`docs/solicitudes-upstream/2026-06-22-estereotipos-vitrinas-ssot-skill.md`).
- **Cambios de contrato de import (deseados)**: bundles externos con `Entidad.estereotipoId` que no resuelva a fábrica/catálogo, o con `Opd.ordenInzoom` referenciando ids no internos, ahora **fallan al importar** (simétrico a anclas/notasMesa). Comportamiento canónico; a tener presente para imports legacy fabricados a mano.

## Gate y verificación

Stack: Bun 1.3+, TypeScript strict, JointJS 3.7 core (sin Rappid), Preact 10 + Signals, Zustand 5, Vite 6, Playwright. Comandos desde `app/`:

```bash
bun run check             # typecheck + unit (gate mínimo antes de commit)
bun run lint              # eslint src/
bun run design:governance # gate ui-forja (tokens, sombras, offset)
bun run build             # build producción a app/dist/
bun run browser:smoke     # smoke Playwright/Chromium (e2e/)
bun run gate:refactor     # check + lint + build + governance + smoke + quality ledger
```

**Advertencia**: vite en background + `browser:smoke` en paralelo produce flakes en specs canvas-sensibles (02, 05). Apagar dev server antes de smoke. Capturar siempre a archivo (`> log 2>&1; echo $?`); `2>&1 | tail` enmascara el exit y los errores.

Último gate verde de referencia (corte C1, 2026-06-24): `check` **2814/0** + typecheck + lint + build + design:governance OK + `cordon:skill` OK (`[CORDON] OK: skill v1.9.0`) + `browser:smoke` **274/0**.
