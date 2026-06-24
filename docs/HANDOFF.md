# HANDOFF — Estado operativo del modelador OPM

**Consolidación**: 2026-06-24 · **Repositorio**: `deep-opm-pro` · **Rama**: `main` (`afda0adb`)
**Sesión 2026-06-24:** Tramo C cerrado (C1 resuelto · D3 propuesto · D8 diferido) + **gist-anchor avanzado de punta a punta** (alcance · nominación propia Calco/Anclaje/Pieza · kernel corte-1 re-nominado · ley de la adjunción verde · valor real condicionado) + **Centinela de Drift (C-1) construido y verde** (kernel del aviso de divergencia: `frozenAtHash` congelado vs hash vivo de la biblioteca; aditivo, sin UI, sin deploy).
**Deploy vigente**: `1d6e45ed` (bundle `index-CeJEaBAM.js`) — **nada nuevo desplegado**: el Centinela es kernel puro del modelo (sin UI, no toca el bundle). Gate completo verde sobre este corte: check **2836/0** + typecheck + lint + build + design:governance + cordon:skill (`v1.9.0`) + browser:smoke **274/0** + quality:gate PASS (6/6 leyes canónicas).
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

1. **gist-anchor / Anclaje — el reuso de tipos VIVO (la gran apuesta).** Permitir que una cosa quede **anclada** (referencia viva) a un tipo de una biblioteca gobernada, para que modelos sobre la misma biblioteca sean **comparables** (composabilidad). Tres condiciones de desbloqueo: **(a)** doctrina custodio-kora R-VIS-STEREO-1 — **PENDIENTE [HITL externo]**: fija la forma OPL/visual del Anclaje, el verbo de fundación del curador y si muta esencia · **(b)** alcance · **(c)** kernel + nominación + ley + valor — **todo cerrado 2026-06-24**. Detalle en 3 actas: `docs/auditorias/2026-06-24-acta-{alcance-anchor-gist,nominacion-reuso-tipos-opforja,valor-anclaje-centinela-drift}.md`.
   - **Nominación propia** (consenso Jobs×steipete+cat-thinking×allan+mente-omega): OpForja **no usa «Template/Stereotype»**. **Calcar→Calco** (copia desacoplada/Σ = el graft D6 ya desplegado) · **Anclar→Anclaje a una Pieza** (referencia viva/Δ) · **Pieza** (tipo de biblioteca gobernada) · **Soltar** (Δ→Σ, pérdida de comparabilidad, irreversible: Calco→Anclaje prohibido). Tres capas: kernel = una adjunción **Σ⊣Δ** (`Unlink=Σ`); frontera = dos sustantivos por dos beneficiarios; puerta = decisión-en-el-gesto (no «disponibilidad contextual»), default Calcar. Invariantes: (i) base evolutiva no-congelada · (ii) Δ-funtorial + ids estables · (iii) anclar=view+validate, **jamás muta esencia** · (iv) Calco terminal-en-procedencia · (v) Σ-sin-sección. Cuarto actor = **curador** (verbo `promover-a-Pieza`, admin-only) — mismo hueco que (a).
   - **Construido y verde** (gate **2836/0**; kernel **aditivo, sin UI, NO desplegado**): `tipos/extensiones.ts` (`BibliotecaRef`, `Anclaje`, `EstadoDrift`) · `Entidad.anclaje?` · `operaciones/anclaje.ts` (`anclarAPieza` NO materializa; **Centinela de Drift**: `firmaBiblioteca`, `evaluarDrift`, `evaluarDriftEntidad`, `evaluarDriftModelo`, `reSincronizarAnclaje`, `soltarAnclaje`) · validación+roundtrip [C2] en `validarEntidades.ts` · **ley de la adjunción** `src/leyes/calco-anclaje-adjuncion.test.ts` (4/4) + **ley del Centinela** `src/leyes/anclaje-centinela.test.ts` (14/14, ciclo de valor end-to-end falsable: el mutante «nunca avisa» pone 4 rojos). El marker `Entidad.estereotipoId` (Calco/D6) intacto.
   - **Valor = REAL CONDICIONADO** (duelo Allan↔Jobs): beneficiario = **Félix-curador** (mantener gist+HODOM+GORE_OS coherentes sin perseguir a mano las copias divergentes que el Calco esconde en silencio). **Centinela de Drift (C-1) = kernel construido:** una cosa anclada compara su `frozenAtHash` contra el hash VIVO de la biblioteca (`firmaBiblioteca`, reusa `firmaSnapshotSubmodelo`); difieren → `divergente`; biblioteca irresoluble → `no-resuelto` (no inventa divergencia). El curador Re-sincroniza (re-congela al hash vivo) o Suelta (Δ→Σ, irreversible). El hash vivo se **inyecta** (`resolverHashVivo`) → kernel puro sin tocar persistencia; un C4 futuro sube la granularidad biblioteca→pieza sin cambiar la firma. **Honestidad (no inflar):** el kernel está verde y falsable en test, pero el VALOR VISIBLE aún NO se entrega — faltan (i) la **UI del Centinela** (marcador «divergente» + botones, corte propio CON deploy) y (ii) la **validación con gist real en HODOM**. **3 condiciones duras del acta:** (1) Centinela primero ✅ (este corte, antes que la plomería de (a)); (2) falsabilidad del valor — **pendiente probar con gist real** (si no ahorra dolor, se mata el frente); (3) cero matemática en superficie ✅ (vocabulario sincronizado/divergente/no-resuelto/Soltar, jamás fibración/pullback).
   - **Pendiente:** **UI del Centinela** (exponer el aviso de divergencia + Re-sincronizar/Soltar, corte propio CON deploy) · **validación con gist real en HODOM** (condición 2 del acta) · resolución externa completa + drift granular a pieza (C4/C5) · validación viva + herencia mutacional (C9/C10) · OPL/render del Anclaje (C6/C7, esperan **(a)**) · renombre **D6→Calco** (370+ refs, toca UI desplegada = corte propio, ya **fertilizado** por la ley) · Δ-funtorial completa.
2. **Tramo C restante del compuesto**: ~~C1 version-match~~ **✅ RESUELTO 2026-06-24** (lee el `version` del sello del cuerpo del deploy; `bun run cordon:skill` en `gate:refactor`). **D3 skill re-sync**: propuesta upstream **redactada** (`docs/solicitudes-upstream/2026-06-24-d3-resync-skill-modelamiento-opm.md`: re-sync a versiones vivas 1.4.1/1.1.2/1.2.2/1.5.1 + bump v1.10.0 + bloque «Límites de la mesa») — **pendiente HITL custodio-kora**. **D8 Ola B**: **DIFERIDA 2026-06-24** — spike de byte-identidad negativo (`tokens.ts` es artefacto de ingeniería, no derivado mecánico) y el «espejo verificado» ya existe en X-OlaA (`design-governance-audit.mjs:181-214` valida coherencia de valores). Detalle: `docs/roadmap/cortes.md` (X-OlaB).
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

Último gate verde de referencia (2026-06-24, `afda0adb`): `check` **2822/0** + typecheck + lint + build + design:governance OK + `cordon:skill` OK (`[CORDON] OK: skill v1.9.0`) + `browser:smoke` **273/1** (el 1 fallo = flake conocido de `e2e/01-carga-y-workspace`, confirmado: pasa 12/12 al re-correr aislado).
