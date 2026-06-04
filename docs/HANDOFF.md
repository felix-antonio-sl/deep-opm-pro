# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-06-04 · **Repositorio**: `deep-opm-pro` · **Rama**: `main`
**Corte de producto vigente (2026-06-03)**: persistencia backend consolidada para modelos nuevos: modelos, workspace/carpetas, versiones, autosave y ownership por tenant anonimo con cookie firmada. Corte anterior público: `bc69829` (`feat(opforja): agregar persistencia backend postgres`). Este corte reduce la dependencia de `localStorage` a cache/espejo transicional y mantiene la UX existente sin migrar pruebas antiguas. Corte de ingenieria posterior: CIERRE de la capa categorial (Fs + Ss + integración + UX de composición + F2↔S + F-D1/F-D3) documentado abajo; runtime desplegado desde el cierre categorial `c37ef98`.
**Instancia**: `https://opforja.sanixai.com` — pública sin auth perimetral. **Redeploy 2026-06-03** (consolidación de `main` @ `f77dad5`: saneamiento de simulación + módulo de autoría headless + remediación de auditoría de cobertura/robustez + sync dashboard HU): `docker compose up -d --build`; `opforja` healthy, `opforja-bug-capture` ok, `opforja-model-api` healthy, `opforja-postgres` healthy (volumen preservado), `curl -fsSI` externo HTTP/2 200, `/__deep-opm/modelos` → `{"modelos":[]}`. Bundle servido: entry **`index-DOCrDXTQ.js`**. (build docker con `VITE_ENABLE_BUG_CAPTURE=true`; hash difiere del build local sin esa flag).
**Frente: canvas infinito — DESPLEGADO 2026-06-03** (commit `849930e`, bundle `index-DaVSdw1e.js`). El OPD vacío parte a pantalla y el paper crece/desplaza sus límites en cualquier dirección con `paper.fitToContent({allowNewOrigin:'any'})`, reemplazando el piso fijo 7200×5200 + crecimiento solo derecha/abajo. Detalle del corte abajo (§ Canvas infinito); el spec de origen fue consolidado aquí y eliminado (historia git: `aec1bcd`).
**Programa integrado**: F0/F1/F2/F3 están en `main` con kernels y UX ad-hoc; simulación Ss queda verde en e2e beta2; rama `codex/ux-composicion-f1` fue squash-mergeada sobre `main` para cerrar la brecha de composición. Diseño/planes relevantes: `docs/roadmap/capa-categorial-opforja.md`, `docs/roadmap/simulacion-categorial-opforja.md`, `docs/superpowers/plans/2026-06-01-capa-categorial-*.md`, `docs/superpowers/plans/2026-06-02-ux-adhoc-fs.md`.

## Actualización 2026-06-04 — Simulación visual viva: tokens viajeros, estados current/resultado y halos geométricos

**Estado:** la simulación cobra vida visual sobre el diagrama. Proceso activo con pulso crimson, objetos involucrados con respiración verde/azul OPM, estados `current` y `resultado` resaltados sobre la cápsula de la entidad, enlaces runtime con trazo animado y tokens con aura/estela viajando por el path. Todo es affordance runtime vía atributos `data-opm-sim` + CSS `@keyframes`, sin nueva primitiva OPM.

**Cambios principales:**
- **Foco de simulación** (`modelo/simulacion/foco.ts`): expone `estadosOrigenIds` y `estadosResultadoIds` (antes solo proceso activo + entidades/enlaces involucrados). Derivados de `transicionesActivasEnPaso`.
- **Halos de simulación** (`render/jointjs/composers/halos.ts`): geometría corregida para entidades con estados — usan `dimensionesEntidadRenderizada()` compartida en lugar de `apariencia.width/height` (la entidad crece al renderizar estados). Fills semánticos: proceso activo con `fill=opmProcesoSuave` + `data-opm-sim="process-active"`; entidad involucrada con fill OPM + `data-opm-sim="entity-involved"`; nuevos halos para `state-current` y `state-result`. Los halos reciben `Modelo` + `OpcionesProyeccion` completos.
- **Función extractada** `dimensionesEntidadRenderizada()` en `composers/entidad.ts:198`: geometría efectiva de una entidad considerando estados, plegado parcial y contorno de descomposición. Consumida tanto por la proyección de entidad como por los halos de simulación.
- **Enlaces runtime** (`composers/enlace.ts`): `strokeDasharray="7 4"` + `data-opm-sim="runtime-link"`; tokens estáticos coloreados por tipo de enlace (`colorTokenSimulacion`: resultado→verde, efecto/invocación→azul, agente/instrumento→oliva); token markup enriquecido con aura + trail + core + `data-opm-sim-token` attributes.
- **Tokens viajeros** (`JointCanvas.tsx`): corregido el lookup de `cell` JointJS — antes buscaba por id semántico del enlace, pero la celda JointJS usa id de apariencia; ahora resuelve por metadata `opm.enlaceId` (`celdaJointDeEnlaceSimulacion`). Cada enlace activo emite 3 tokens escalonados (0ms, 22%, 44% de duración) con `<g>` SVG que agrupa aura-circle + trail-path + core-circle. Soporta `prefers-reduced-motion` (suprime toda animación de simulación). Limpieza vía `clearTimeout` + `token.remove()`.
- **CSS de animación** (`jointjs.css`): `@keyframes` para flow-line (stroke-dashoffset infinito), dash (offset en halos), breathe/soft-breathe (opacity+scale en proceso/objeto), state-current/state-result (opacity+scale diferenciados), token-aura/core/trail (opacity+scale). Todo encapsulado bajo `[data-opm-sim]` / `[data-opm-sim-token]`. `@media (prefers-reduced-motion: reduce)` suprime todas las animaciones.
- **Proyección** (`proyeccion.ts`, `proyeccionTipos.ts`, `constantes.codex.ts`): firma de `proyectarHaloSimulacion*` ampliada para pasar modelo y opciones; nuevas constantes `opmProcesoSuave`.

**Verificación:**
- `bun run check` -> **2136 pass / 0 fail** (regresión en `halos.test.ts:90`: halo `196×110` cubre entidad `186×100`, exactamente +5 px/lado)
- `bun run lint` -> OK
- `bun run build` -> OK, bundle `index-DceuzejP.js`
- `bun run design:governance` -> OK
- `PW_PORT=5213 bunx playwright test e2e/12-beta2-modo-simulacion.spec.ts --workers=1` -> **8 passed**
- Sonda visual Playwright: 1 proceso activo, 1 estado current, 1 estado resultado, 2 enlaces runtime, 2 tokens estáticos, 4 tokens viajeros; sin `pageErrors`

**Handoff explícito:**
- *Estado actual:* simulación visual viva y verificada end-to-end. No se tocó `runner.ts` ni el kernel de simulación; todo el enriquecimiento es capa de proyección visual con atributos `data-opm-sim`.
- *Supuestos:* los colores de token viajero se derivan de `colorTokenSimulacion(tipoEnlace)`; la geometría de halos comparte `dimensionesEntidadRenderizada` con la proyección de entidad; `prefers-reduced-motion` es respetado tanto en CSS como en JS.
- *Riesgos:* los tokens viajeros son efímeros (se limpian al cambiar de paso); `celdaJointDeEnlaceSimulacion` hace O(n) walk sobre `getCells()` como fallback — ok para la escala actual de simulación pero podría iterarse si se simulan cientos de enlaces simultáneos.

## Actualización 2026-06-04 — Flujo canónico dominio→OpForja: consenso de mesa + ejecución autónoma W1–W5.1

**Estado:** las dos líneas evolutivas (hd-opm autoría ↔ OpForja plataforma) quedaron **reconciliadas por consenso deliberativo y ejecutadas hasta W5.1** bajo mandato autónomo del operador. Autoridad: `docs/auditorias/2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` (mesa Besto/Resto, orquestación, 3 ciclos, 9 críticas resueltas) + `2026-06-04-acta-mesa-equilibrio-encarnacion.md` (mesa Asto/Besto/Resto, DOS deliberaciones: realización EQUILIBRIO C1-C5 + distribución del LLM por naturaleza del juicio). Corte operativo: `docs/roadmap/backlog-contingencial.md` (HU v2 + cortes-operativos CONGELADOS por HITL-3; § Estado de ejecución al día).

**Decisiones selladas:** arquitectura de tres capas con pivote único `modelo.v0` · proto-modelo = prosa con bloques `opl` en sub-dialecto laxo cerrado por gramática (HITL-1 «bastante libre») · compilador = `autoria/compilar/` (el parser reverse NO hace bootstrap multi-OPD por diseño, `parsear.ts:1123`; reverse = edición en mesa) · **byte-identidad hd-opm SE CONSERVA + re-pin gobernado** (`docs/roadmap/protocolo-re-pin.md`, aprobado HITL-2) · UX-EXTERNA + EQUILIBRIO (LLM vía skill por naturaleza del juicio; la app ve/gestiona artefactos; gatillos falsables g1/g2/g3) · trazabilidad normativa = tipo `AnclaNormativa` (diseño adjudicado `docs/proto-modelo/diseno-ancla-normativa.md` §10).

**Ejecutado (commits `8ddb772`→`3c6140f` aquí + `2376ea8` en hd-opm; suite 2117/0; byte-identidad verde en todas las ondas):**
- **W1**: gramática del sub-dialecto v0.1 **falsada contra el corpus real** (469 líneas: 93.4% cobertura de hechos, L1 verde 100%, 30 rechazos legítimos T3); normalizador TDD (42 tests, idempotente, valida contra el parser real); inventario de 46 clases de hecho vs DSL; diseño AnclaNormativa adjudicado. Hallazgos de parser: especialización=`es un` (el canon `puede ser` es trampa), forma estricta de estados SIN prefijo, AESS obligatoria, TS5 compacta aceptada, GAP multiplicidad sufija.
- **W2**: protocolo re-pin documentado; conteo de control hd-opm reconciliado (**262/192/433/37** — incluye U-EST); regeneración byte-idéntica verificada como harness. W2.2 (validación visual) la hizo el operador en paralelo (fixes V16).
- **W3**: DSL valida firma de enlaces vía kernel (vía b; residuo: creación de entidades requiere re-pin de ids — documentado en `dsl.ts`); constantes in-zoom unificadas en `canvas/constantesInzoom.ts` (hallazgo: la «triplicación» H1 era doble; el LAYOUT de autoría es un juego distinto); **ley L7** contención por ROL declarado (la clasificación geométrica era tautológica — corregida) con controles de no-tautología.
- **W4.1**: 6 primitivas nuevas del DSL delegando 1:1 al kernel (abanico XOR/OR, multiplicidadOrigen, demora, autoinvocación, modificador `no`, designaciones default/current).
- **W4.2**: **compilador proto→Modelo** (`compilar/{estructura,resolutor,emisor,compilador}.ts`) con ledger L2 (ninguna línea sin destino); **piloto sobre el proto v1.9 ENTERO**: 11 OPDs, 250 entidades, 284 enlaces, validación PASS, roundtrip OPL 92.3%, 17 tensiones genuinas documentadas (`docs/proto-modelo/piloto-compilador-2026-06-04.md`).
- **W5.1**: `AnclaNormativa` aditiva en el formato (target 4 niveles, claveProto estable, ratificación tipificada «la app registra, no decide») + DSL `ancla()` + L8 round-trip nivel-enlace + L9 preparatorio. Nota: el allowlist de byte-identidad vive en DOS sitios (`json.ts` + `validarNormalizacion.ts`).
- **Cierre externo KORA 2026-06-04**: la derivación C2 ya fue absorbida en KORA: `modelamiento-opm` gana el estado `re-elicitar` y Dori delega esa mecánica explícitamente. Se agregó evidencia de store para HU-15.008 (`forma abanico automatico al conectar segunda rama`) porque el quality gate exigía 73/105 reglas automáticas; dashboard HU re-sincronizado.

**Handoff explícito:**
- *Pendientes:* (1) **W4.3-cierre** — las **17 tensiones del piloto están RESUELTAS** (sesión dialéctica 2026-06-04: instrumento-evento por defecto + A12 u→o [decisiones del operador] + 3 fixes objetivos + 2 ediciones al proto v1.10 de hd-opm [SEREMI→proceso emisor; objeto del homónimo Despacho→`Remesa de recursos`]; piloto: **fallos 0, excluidas 0**, 418→443 hechos, commits `927275e` + hd-opm `f9612ec`); los 31 rechazos T3 se resolvieron en segunda sesión dialéctica (**familia V**, commit `c0d8f59`: 15 mapeos decididos por el operador — guardas→condición, alimenta→instrumento, detecta→genera, compromete/libera→afecta+etiqueta, precede-a→invoca, 4 tagged, colas→hecho+`AnclaNormativa` pendiente, XOR; cobertura **98.9%**, rechazos 31→**5**); quedan SOLO las **5 oraciones en-reflexión del operador** (proyecta-REM, está-acotado-por, determinan-como, cola «Otros profesionales», Inspección-habilita-Vehículo — test explícito las protege) y luego la migración real de `generar-bundle-hodom.ts` OPD-por-OPD; (2) **W5.2 CERRADO** (commit `4b6e3d9`: anclas inline compiladas a `AnclaNormativa` con ledger L8 — hallazgo: las citas normativas del corpus HODOM viven en PROSA = alcance E2/skill, no del compilador determinista); queda **W5.3** procedencia/staleness L6; (3) **W6** superficie UX (W6.0 puente primero; W6.1 gate de release = re-protección, HITL; W6.5 exportará logs solo cuando su consumidor KORA ya comprometido se use efectivamente). Nota: el golden hd-opm evoluciona con el dominio (hoy 264/192/438/37); la fuente de conteo es el propio generador, nunca un documento.
- *Supuestos:* el proto v1.9 y el bundle v1.6 divergieron legítimamente (el piloto NO compara contra el bundle; oráculo = coherencia interna L2+validación+roundtrip); los stashes `codex-preserve-*` del deploy intermedio ya están incorporados en la línea W3.
- *Riesgos:* incidente de concurrencia REAL durante W3 (un deploy intermedio revirtió `dsl.ts` a mitad de refactor; detectado y re-aplicado; la línea quedó detached y fue mergeada en `bea53b7`) — coordinar deploys con rondas de agentes; el residuo W3.2 (entidades fuera del kernel) es deuda visible que solo se paga con re-pin.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md` § `Flujo canónico dominio→OpForja` + `docs/roadmap/backlog-contingencial.md` § Estado de ejecución. Frente sugerido: W4.3 (migración OPD-por-OPD de hd-opm con el operador resolviendo las 17 tensiones del piloto — sesión dialéctica con `modelamiento-opm`) o W5.2 (compilar anclas desde el proto: el normalizador ya las captura como clase `ancla`; emisor → `autor.ancla()`). Gates: byte-identidad hd-opm + `bun run check` + protocolo re-pin para cualquier cambio deliberado."

## Actualización 2026-06-04 — spec-forja-opd-es PUBLICADA (SSOT visual/OPD de opforja)

**Estado:** `urn:fxsl:kb:spec-forja-opd-es` v1.0.0 **publicada en KORA** (`~/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/spec-forja-opd-es.md`, 876 L, vía `kora promote` desde `_SCRIPTORIUM/REVIEW`; gate `kora check --strict` 34/34). Completa la familia forja: método + OPL + **visual/OPD**. Es la primera SSOT operativa de la realización visual de opforja: gramática gráfica íntegra (§2–§9), refinamiento/distribución/precedencia (§10), layout/routing (§11), canvas/interacción/edición (§13–§15), validación visual con tabla AP+Enforcement (§17), **catálogo formal con paths/dashes/z-order verificados contra el código** (§18), bimodalidad (§19), simulación visual (§20), exportación canónica (§21) y **tabla de trazabilidad spec↔app con 19 familias `GAP-OPD-*`** (§22). En el repo: puente `docs/canon-opm/spec-forja-opd.md` + reglas de oro 1–2 del `CLAUDE.md` actualizadas.

**Proceso (calidad):** 14 lectores paralelos sobre fuentes canónicas+laxas (~1.500 hechos citados; destilados en `_local/spec-forja-opd-sources/`, gitignored) → síntesis central → 6 verificadores adversariales (1 crítico: doble acepción convergente/divergente; 7 altos, incl. cita normativa fabricada «ISO 80000-3», swallowtail 23×16, e/c sobre fan de resultado, V-186 silenciada, tres «alineado» sobre-declarados) → **todos los hallazgos corregidos antes de promover**.

**Decisiones de canonicidad (HITL operador):** precedencia `reglas-opm-estrictas-es` > `spec-forja-opd-es` > `ui-forja/GOVERNANCE` (solo estética/chrome/tokens) > implementación. La spec **deroga ui-forja/08** en tres puntos (GAP-OPD-UIFORJA-08a/b/c): estado = rountangle rx8 (no pill), exhibición = triángulo-interior y clasificación = triángulo+punto (no cuadrado/círculo — la app ya era conforme), `jumpover` admitido como presentación. Grid = afordance de edición (default lo gobierna ui-forja) con supresión obligatoria en export. Canvas infinito reconciliado con el límite 20-25: gate **por OPD lógico**. Crimson compartido UI/simulación con separación por dash/glifo/z (disyunción en el plano canónico).

**Handoff explícito:**
- *Estado actual:* KORA con la spec publicada e indexada; repo con puente + CLAUDE.md; cero cambios de código de producto en este corte.
- *Pendientes (backlog de alineación = §22 de la spec, prioridad sugerida):* (1) GAP-OPD-PERFIL-EXPORT — declarar e implementar perfiles `canon-diagrama`/`canon-documento` (el mayor: sin él la regla rectora V-0 no tiene testigo material) + GAP-OPD-EXPORT-GATE (densidad >25); (2) corregir `ui-forja/08-jointjs-styling.md` según GAP-OPD-UIFORJA-08a/b/c y declarar allí la subordinación; (3) quick-wins: GAP-OPD-TAGGED-ITALIC (1 línea: `fontStyle: italic` en `etiquetaTextoTagged`), GAP-OPD-PROB-NOTACION (`N%`→`Pr=p`), GAP-OPD-DEFAULT-GLIFO (flecha abierta entrante); (4) medianos: DURACION-ELIPSE, POS-MODIFICADOR, FAN-M, COLECCION-INCOMPLETA, FEEDBACK-LEGACY, PROXY-TOKEN, CATEGORIAS-OPD, DUPLICADO; (5) VERIFY: serialización `Current` declarado-vs-runtime, cobertura de la matriz de distribución, ids persistentes de OPD vs DSL posicional (liga al acta flujo-canónico 2026-06-04).
- *Supuestos:* los destilados `_local/` son regenerables (workflow + fuentes); el catálogo §18 refleja el código a `main` de hoy — si el renderer cambia, §22 es la tabla a re-sincronizar; GAP-OPD-AGENTE-HUMANO asume que el proxy esencia-física es aceptable hasta que el kernel tenga tipo humano.
- *Riesgos:* doble fuente transitoria mientras ui-forja/08 no se corrija (un agente que lea solo el 08 implementaría markers derogados); la spec declara DEBEs aún no implementados (perfiles de export) — no confundir norma con estado; ediciones masivas de la spec por regex pueden degradar tablas (misma lección que el catálogo de fixtures).

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md` § `spec-forja-opd-es PUBLICADA`. La SSOT visual es `urn:fxsl:kb:spec-forja-opd-es` (puente `docs/canon-opm/spec-forja-opd.md`); el backlog de alineación es su §22. Frente sugerido: corte 1 = perfiles de export canónico (GAP-OPD-PERFIL-EXPORT + EXPORT-GATE, TDD sobre el renderer/export) o, si se quiere bajo riesgo, los quick-wins TAGGED-ITALIC + PROB-NOTACION + DEFAULT-GLIFO con sus tests de markers; en paralelo documental, corregir ui-forja/08 (GAP-OPD-UIFORJA-08a/b/c). Toda regla visual nueva entra a la spec (R-§25-DEP-2), nunca a notas sueltas; gates `bun run check` + `design:governance`."

## Actualización 2026-06-04 — Auditoría de persistencia (diagnóstico, EN PAUSA)

**Estado:** auditoría de primera mano del subsistema de persistencia (código + config viva + DB en producción) completada y documentada en `docs/auditorias/2026-06-04-persistencia-backend.md`. **Decisión del operador: NO implementar todavía.** Sin cambios de código en este corte.

**Hallazgos clave:** (1) **el techo de almacenamiento sigue siendo localStorage (~5-10 MB por navegador)** — el guardado es local-primero y aborta sin llegar al backend si la cuota revienta (`store/persistencia.ts:291-299`); el límite por modelo es 15 MB (API) bajo nginx 25 MB; un modelo escala-HODOM (~5 MB) roza la cuota. (2) **Críticos activos en producción:** secret de sesión y password de Postgres corriendo con los defaults hardcodeados del compose (cookies de tenant forjables), **sin backup** del volumen `opforja-postgres-data`, sin rate limiting en instancia pública. (3) Deuda estructural: sin migraciones/FKs/transacciones/poda/logging; last-write-wins silencioso multi-pestaña.

**Handoff explícito:**
- *Estado actual:* diagnóstico completo con 4 cortes propuestos y priorizados en la auditoría; producción funciona pero con configuración de desarrollo expuesta.
- *Pendientes (al retomar, en orden):* (1) blindaje urgente — secrets reales + `pg_dump` cron + rate limit; (2) backend-primero (elimina el techo localStorage; ya era pendiente del corte de persistencia); (3) migraciones/FKs/transacciones/poda/logging; (4) optimistic locking multi-pestaña.
- *Supuestos:* los 12 tenants / 7 modelos actuales parecen pruebas, pero **confirmar antes de rotar el secret** (la rotación invalida todas las cookies); Postgres solo es alcanzable por la red Docker interna (mitiga el password default).
- *Riesgos mientras siga en pausa:* cookies forjables por cualquiera que lea el repo público de deploy; pérdida total ante corrupción/`down -v` del volumen (sin backup); crecimiento sin freno si la instancia gana tráfico.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md` § `Auditoría de persistencia (diagnóstico, EN PAUSA)` y `docs/auditorias/2026-06-04-persistencia-backend.md`. Ejecutar el corte 1 (blindaje urgente: `OPFORJA_SESSION_SECRET`/`OPFORJA_DB_PASSWORD` reales, backup pg_dump con retención, rate limiting) confirmando antes con el operador si los tenants actuales son descartables; luego evaluar corte 2 (backend-primero) que elimina el techo de localStorage. TDD sobre `modelPersistence.test.ts`; verificación post-deploy con smoke de cookie jar como en el corte de persistencia original."

## Actualización 2026-06-03 — Reverse OPL: catálogo de roundtrip 23/23 ESTRICTO

**Estado:** cerrados los 3 frentes restantes del reverse (commit `6824e87`); **todas** las fixtures del catálogo quedan en bisimetría estricta — generador y parser amarrados ida-y-vuelta para todo el territorio cubierto por fixtures. (1) **Demora de invocación**: el parser capturaba y descartaba `después de Ns`; ahora viaja AST → patch → `definirDemora`. (2) **Autoinvocación**: el parser ya producía el self-link; el aplicador lo desvía a `crearAutoInvocacion` (con demora). (3) **Gramática HS**: agente/instrumento aceptan el sufijo `en \`estado\`` reusando `limpiarObjetoConEstadoConMultiplicidad`; el aplicador ancla el extremo origen al estado del objeto (`resolverExtremosPatch`/`destinoObjetoDeEntrada` extendidos a habilitadores).

**Verificación:** roundtrip 24/24 (23 fixtures estrictas + smoke de catálogo); `bun test src/` **2009 pass / 0 fail**; typecheck/lint/governance/build OK; e2e 03 + 02 dirigidos verdes. Lo que el reverse aún NO cubre sigue documentado en la cabecera del catálogo (modificadores complejos, rutas, refinamientos, abanicos avanzados) — sin fixture estricta, por diseño.

**Handoff explícito (cierre del día 2026-06-03, cinco cortes encadenados):**
- *Estado actual:* `main == origin/main`; producción corre el último código (bundle `index-B8Kw65eM.js` = `6824e87`), 4 contenedores healthy, volumen Postgres preservado. Entregado hoy: canvas infinito (`849930e`), BUG-f314c4 TS3 compacto (`3813bfe`), e2e 02/04/05 reconciliados 47/47 (`42f77d0`), ciclo estado-objeto L5 (`20d61af`), y los 3 frentes finales del reverse (`6824e87`) → catálogo de roundtrip **23/23 estricto**.
- *Pendientes (sin fecha, por prioridad sugerida):* (1) ampliar el reverse a las exclusiones documentadas en la cabecera del catálogo — modificadores complejos, rutas, multiplicidades en formas no cubiertas, refinamientos, abanicos avanzados — cada una con su fixture estricta al cerrarla; (2) regenerar el bundle HODOM desde hd-opm para materializar los `cambia ... de ... a ...` TS3 (lado consumidor del BUG-f314c4); (3) afinar `CANVAS_PADDING` (1800) si el uso real lo pide (no bajar de ~media pantalla sin revisar el recentrado); (4) soltar el `3600/2600` de `autoria/layout.ts` como corte separado coordinado con hd-opm (rompe byte-identidad; opcional, solo limpieza).
- *Supuestos:* la demora viaja como string canónico (`"1s"`); la autoinvocación reversa sin demora explícita usa el default del kernel; en HS el estado califica al objeto del extremo ORIGEN; el catálogo de fixtures es la SSOT de qué territorio del reverse está amarrado.
- *Riesgos:* el catálogo es sensible a ediciones masivas por regex/replace (un flag puede degradarse en silencio — lección `d573608`; verificar conteo true/false tras editar); quedan flakes de entorno headless ajenos al producto (`02:56` flaky de batch, drags sensibles a visibilidad); instancia pública sin auth perimetral (riesgo conocido, decisión del operador).

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Reverse OPL: catálogo de roundtrip 23/23 ESTRICTO`. El reverse cubierto por fixtures está amarrado ida-y-vuelta; el siguiente frente natural es ampliar cobertura a las exclusiones listadas en la cabecera de `app/src/opl/fixtures-roundtrip.ts` (modificadores complejos, rutas, refinamientos, abanicos avanzados), cerrando cada una con su fixture estricta y TDD. Alternativas: regenerar bundle HODOM en hd-opm (ver los `cambia` TS3) o el corte opcional de soltar 3600/2600 en autoría (coordinar byte-identidad con hd-opm). Mantener kernel→store→UI, gates `bun run check`/lint/governance, e2e con PW_PORT libre y sin dev server en background."

## Actualización 2026-06-03 — Ciclo estado-objeto del reverse-aplicador CERRADO (L5)

**Estado:** cerrado y verificado (commit `20d61af`). La frase de estados (`X puede estar ...`) ahora acepta un objeto declarado en una línea previa del MISMO texto: el planificador emite una referencia pendiente por nombre (mismo mecanismo `refEntidadPendiente` que los enlaces) y el aplicador la resuelve vía el mapa `creadas` tras `crear-entidad` (orden por línea). El patch `sincronizar-estados` pasa de `objetoId: Id` a `objeto: ReferenciaEntidadPatch`.

**Resultado:** **5 fixtures de roundtrip suben a bisimetría ESTRICTA** (`objeto-con-estados`, `cambio-estado-ts3` escindida, `cambio-estado-ts3-compacto` del BUG-f314c4, `ts4`, `ts5`) — el territorio de transiciones de estado queda amarrado ida-y-vuelta entre generador y parser. Quedan no-estrictas, con razón documentada en el catálogo, tres limitaciones de OTROS territorios (candidatos a frentes futuros): (1) gramática HS del parser — `X en \`estado\` maneja Y` llega con el sufijo crudo como nombre; (2) la demora de invocación no se inversa (el enlace recreado pierde `después de Ns`); (3) el self-link de autoinvocación no está soportado en reverse.

**Verificación:** roundtrip 24/24; `bun test src/` **2009 pass / 0 fail**; typecheck/lint/governance/build OK; e2e 03 (panel OPL) 11 passed.

## Actualización 2026-06-03 — BUG-f314c4 resuelto + e2e 02/04/05 reconciliados

**Estado:** ambos frentes cerrados y verificados. Commits `3813bfe` (fix OPL), `42f77d0` (e2e), `752720a` (triage).

**BUG-f314c4 (efecto TS3 compacto):** `oracionEfecto` ahora verbaliza la transición del enlace `efecto` con metadato `estadoEntradaId/estadoSalidaId` — `*Proceso* cambia **Objeto** de \`a\` a \`b\`.` + variantes parciales, ambas direcciones — en vez de degradar al genérico `afecta`. El reverse ya existía (parser ETS2 + `aplicar.ts` reancla al metadato); sellado con test del par completo (`parser/ts45.test.ts`). Fixture roundtrip `cambio-estado-ts3-compacto` (no-estricta SOLO por la limitación preexistente del ciclo estado-objeto del aplicador — "puede estar" sobre objeto declarado en el mismo texto, pendiente L5; ese es el siguiente paso natural para subir a estricta las 5 fixtures de estados).

**e2e 02/04/05 — 4 fallos preexistentes resueltos (47/47 verdes):** eran aserciones obsoletas tras cortes recientes, no bugs de render: (1) frases OPL viejas (`(probabilidad:` → `\`Pr=0.7\``; `despues` → `después`); (2) token de color viejo (`#cfcbc1` → `inkFaint #b5b0a4`, cambiado en `d19f675` sin actualizar el e2e); (3) en 05, el drag de paralelo necesitaba el elemento visible (scrollIntoView), regex con `\s+` entre nodos inline, y el bloque "ambiental clamp" usaba el flujo de creación viejo (hoy el botón crea directo FUERA del contorno vía `posicionLibre`/`columnasFueraDe`; la creación posicionada es el modo sticky Shift+clic — y el contorno inzoom es ELIPSE, así que el click va dentro del path, no en la esquina del bbox). Verificación: `bun test src/` **2009 pass / 0 fail**; typecheck/lint/governance/build OK.

## Actualización 2026-06-03 — Canvas infinito (DESPLEGADO)

**Estado:** implementado en el renderer (capa desechable) + e2e reconciliados + verificado in-vivo, **committeado y desplegado**. Commit de código `849930e` (`feat(canvas): canvas infinito con fitToContent y scroll-compensation`). Deploy `docker compose up -d --build`: `opforja` healthy, `opforja-model-api` healthy, `opforja-postgres` healthy (volumen preservado), `opforja-bug-capture` up; `curl -fsSI` externo HTTP/2 200; bundle servido **`index-DaVSdw1e.js`**; `/__deep-opm/modelos` → `{"modelos":[]}`. Smoke read-only post-deploy en producción: OPD vacío parte a pantalla (`scrollWidth==clientWidth`, `aPantalla:true`), 0 pageErrors.

**Qué hace:** el OPD vacío parte enfocado a pantalla (el paper = tamaño del viewport, sin scroll, sin piso 7200×5200); al cargar/cambiar de OPD el viewport encuadra el bbox del contenido (centrado); y crear/mover cosas hacia cualquier dirección (incl. arriba/izquierda → coordenadas negativas) hace crecer el paper **sin que el contenido salte**. Reemplaza `setPaperDimensions(paper, dimensionesPaper(cells))` (piso fijo + crecimiento solo +X/+Y) por `paper.fitToContent({allowNewOrigin:'any', useModelGeometry:true, padding, minWidth/minHeight=viewport})`.

**Diseño real (drift corregido vs el spec):**
- El spec asumía tocar el "slice `mapa` (pan/zoom)". **No existe tal slice para el canvas de edición**: el pan es **scroll DOM** del `<div viewport overflow:auto>` sobre un `<div paperHost>`; el `MapaSlice` es solo la vista de mapa de OPDs. La "pieza no-trivial" (no-salto al desplazarse el origen) se resolvió como **scroll-compensation**: `scrollLeft/Top += Δtranslate` tras cada `fitToContent` (`calcularAjusteScroll`, pura y unit-tested). En cambio de OPD / primera apariencia se recentra al centro del `getContentBBox` (reemplaza el centro fijo 3600/2600).
- **`fitToContent` suma el padding aun con contenido vacío** (Paper.mjs) → un OPD vacío daría 2×padding. Fix: padding 0 cuando `getContentArea` es vacío → el paper cae a `minWidth/minHeight` = viewport. (Bug hallado in-vivo, corregido por TDD.)
- **NO se tocó `autoria/layout.ts::centrarOpdsEnCanvas` (el "3600/2600")**: solo lo usa el módulo de autoría headless que `hd-opm` regenera **byte-idéntico**; soltarlo rompería esa garantía sin aportar al objetivo (con canvas infinito el offset absoluto es invisible: el contenido se encuadra y recentra igual). Queda como no-op benigno; soltarlo es un corte separado coordinado con hd-opm si el operador lo quiere.

**Artefactos:** `app/src/render/jointjs/handlers/helpers.ts` (`calcularAjusteScroll`, `ajustarPaperAContenido`, `contentBBoxPaper`; se eliminó `dimensionesPaper`), `jointCanvasAdapter.ts` (`sincronizarCells` ya no dimensiona), `JointCanvas.tsx` (ajuste tras embeber/rutear + recentrado vs scroll-comp + `paperHost` elástico), `mapaExport.ts` (offscreen usa `fitToContent`). Tests: `handlers/helpers.test.ts`, `jointCanvasAdapter.test.ts` reconciliados; e2e `04/05/21` (asserts de scroll `>2500/1800` ligados a 3600/2600 → `>0`, preservando el assert de centrado). Sonda in-vivo: script efímero (eliminado tras la verificación; resultados en `app/test-results/in-vivo/`, gitignored).

**Verificación:** `bun run typecheck` OK; `bun test src/` **2002 pass / 0 fail**; `bun run lint` OK; `bun run design:governance` OK; `bun run build` OK. e2e con `PW_PORT` libre: 04/05/21 → los sub-tests de encuadre **pasan**; in-vivo (`ci-a-vacio.png`, `ci-c-incremental.png`) → (a) vacío a pantalla (size=viewport, sin scroll) y (c) crecer sin salto (maxSalto=0, origen desplazado), 0 pageErrors. **Fallos preexistentes (NO regresión, confirmado en `main` baseline por `git stash`):** `02:184`, `02:343`, `04:212`, `05:679` (drags/CSS flaky en headless); `02:56` flaky de batch (pasa aislado/re-run). El "salto" al crear elementos fuera de cuadro es el auto-centrado de selección preexistente (`centrarSiFueraDeViewport`), ajeno a este frente.

**Pendiente (opcional):** afinar `CANVAS_PADDING` (1800) si el uso real lo pide; es el aire scrolleable que permite centrar contenido pequeño en el viewport (no bajarlo de ~media pantalla sin revisar el recentrado). Soltar el `3600/2600` de `autoria/layout.ts` sigue siendo un corte separado coordinado con hd-opm (byte-identidad), si se quiere por limpieza.

## Actualización 2026-06-03 — módulo `app/src/autoria/` (autoría headless dominio-agnóstica)

**Estado:** nuevo módulo committeado en `7f0abf0` (`feat(autoria): modulo headless dominio-agnostico…`). Capacidad reusable para **construir un Modelo OPM programáticamente y emitir un bundle validado**, sobre cualquier dominio, con la calidad de layout/canon que se desarrolló para HODOM (extraída del generador `hd-opm/scripts/generar-bundle-hodom.ts`). Headless puro (sin DOM/JointJS/store) → tree-shaken del bundle del browser; testeable con `bun test src`; consumible por scripts (`import { crearAutor, emitirBundle } from ".../app/src/autoria"`).

**API:** `crearAutor(opts?) → Autor` (DSL imperativo **re-entrante** por instancia; métodos `entidad/objeto-proceso/estados/opd/ver/enlazar/refDescomp/refDespliegue[Exh|Gen]/atributo…`, destructurables para estilo conciso). `emitirBundle(autor, opts?) → { json, opl, reporte, conteos, avisos }`: aplica `aplicarLayoutCompleto` (orden de ejecución→bandas, fishbone/peine, contorno-al-contenido, colocación adaptiva anti-aireado) → valida (round-trip estable + contención + política de canon: bloquean solo avisos estructurales) → emite. La narrativa de dominio (descripción, notas) es **parámetro** del consumidor (`opciones.descripcion`/`reporteExtra`); el reporte base es genérico.

**Archivos:** `app/src/autoria/{tipos,dsl,layout,bundle,index}.ts` + `_fixtures/cafetera.ts` (demo NO-HODOM) + `autoria.test.ts`. **Verificación:** typecheck limpio bajo config estricto (`exactOptionalPropertyTypes`); `bun test src/autoria` → 9/9 pass (DSL re-entrante, agregación consumida a contención, pipeline end-to-end con **cero solapamientos** y canon sin bloqueantes sobre un dominio NO-HODOM). Spec/plan: `~/projects/hd-opm/docs/superpowers/{specs,plans}/2026-06-03-autoria-bundle-agnostico*`.

**Dogfood — HECHO (hd-opm `6db1c74`):** `hd-opm/scripts/generar-bundle-hodom.ts` ya CONSUME esta librería (borró el DSL+layout+pipeline inline, ~1000 líneas; 3186→2182). Prueba de la extracción a escala (36 OPDs): regenera el bundle v1.6 **byte-idéntico** (JSON y OPL; `diff -q` vacío), **261·192·430·36**, cero solapes, canon PASS (0 bloqueantes), round-trip/contención PASS. La capacidad reproduce fielmente, sobre el dominio real más grande, lo que producía el generador artesanal. Único cambio derivado: el reporte usa la cabecera genérica de `emitirBundle` + `reporteExtra` (corrige de paso el título obsoleto "v1.3"). Roadmap completo en el plan citado (Tasks 1-7 ✓).

## Actualización 2026-06-03 — auditoría categorial y saneamiento UX de simulación/razonamiento

**Estado:** auditado con `mente-omega` + `cat-thinking` y remediado lo corregible del último corte. El runtime de condiciones/invocaciones conserva el contrato kernel -> store -> UI; la superficie de opforja ahora muestra de forma explícita los estados nuevos (`omitido` por condición y `bloqueado` por límite de loop), sin copiar gestos OPCloud ni introducir primitiva OPM nueva.

**Lectura categorial trazable:** `runner.ts` sigue siendo una coalgebra cuyo despliegue genera una traza por anamorfismo (`urn:fxsl:kb:icas-efectos`). Las condiciones se tratan como efecto explícito de omisión/logging, no como transición transformacional. El bloqueo por límite es guardrail de safety sobre el comportamiento, no hecho del modelo (`urn:fxsl:kb:icas-safety-alignment`). La proyección UI/store es preservación controlada de estructura desde runtime a superficie, con tests de proyección, no equivalencia formal total (`urn:fxsl:kb:icas-preservacion`). `impacto-aguas-abajo` se mantiene como cierre composicional descendente del grafo OPM y se proyecta al canvas como cono completo (cosas + enlaces de propagación), coherente con composición de flechas (`urn:fxsl:kb:icas-composicion`).

**Remediaciones realizadas:** (1) el límite de seguridad ya aplica también al paso manual/autoavance, no solo a `correr`; al bloquear, el store apaga autoavance y emite mensaje. (2) la barra de simulación usa una proyección pura testeable para texto/controles/rótulos; muestra `Bloqueada`, deshabilita acciones de ejecución y rotula entradas `omitido` en el trace. (3) la autoinvocación ahora sobrevive round-trip JSON: el validador permite el caso self-link solo para `invocacion` entidad->misma entidad. (4) `derivar` tiene guard exhaustivo `never`, de modo que nuevas consultas F3 no pueden quedar sin implementación silenciosa. (5) `impacto-aguas-abajo` resalta también los enlaces que propagan la cascada; el conteo visible sigue contando cosas, no enlaces.

**Artefactos:** `app/src/modelo/simulacion/runner.ts`, `app/src/store/simulacion.ts`, `app/src/ui/simulacion/BarraSimulacion.tsx`, `app/src/ui/simulacion/proyeccionBarra.ts`, `app/src/serializacion/validarEnlaces.ts`, `app/src/modelo/razonamiento/derivar.ts`, `app/src/store/modelo/acciones-capacidades.ts`. Tests nuevos/reforzados: `app/src/ui/simulacion/proyeccionBarra.test.ts`, `app/src/store/simulacion.test.ts`, `app/src/serializacion/json.test.ts`, `app/src/store/modelo/razonamiento-ux.test.ts`.

**Verificación:** `cd app && bun run check` -> **1979 pass / 0 fail**; `bun run lint` -> OK; `bun run build` -> OK; `bun run design:governance` -> OK; `bun run quality:gate` -> PASS tras regenerar `docs/roadmap/hu-progress.*` con `progress-dashboard --sync-real`; `git diff --check` -> OK.

**Commit/push/deploy:** corte de código `ef746d0` (`fix(simulacion): sanear loops y trace canonico`) en `origin/main`. Deploy con `docker compose up -d --build` desde `main`: bundle servido `assets/index-DOCrDXTQ.js`; `opforja` healthy, `opforja-model-api` healthy, `opforja-postgres` healthy, `opforja-bug-capture` up; `healthz` web interno `ok`; APIs internas `200 {"ok":true}`; `https://opforja.sanixai.com/` HTTP/2 200.

**Handoff explícito:** estado actual desplegado en producción. Supuesto vigente: el límite global de seguridad de simulación es 200 pasos, aplicable a corrida, manual y autoavance; una simulación legítimamente más larga requerirá control de límite configurable antes de subir el umbral. Riesgo residual: la UI de simulación expone el bloqueo y la omisión, pero aún no muestra una vista explicativa completa de la política de loop/condición; por ahora el trace y el toast son la superficie canónica suficiente. No hay cambio SSOT KORA requerido en este corte porque se implementa el canon ya promovido.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Actualización 2026-06-03 — auditoría categorial y saneamiento UX de simulación/razonamiento`. Validar en producción que autoinvocación guardada/cargada, autoavance bloqueado y trace con `omitido` se ven correctamente. Si se mejora el runtime, priorizar límite configurable y explicación de condiciones/loops en UI sin introducir símbolo OPM nuevo."

## Actualización 2026-06-03 — condiciones y loops OPM ejecutables

**Estado:** implementado en el kernel de simulación sin añadir primitiva OPM nueva. La investigación web/local confirmó el canon: condición `c` = bypass/omisión; loops = invocación/autoinvocación y, en descomposición, orden/altura como invocación implícita. No se implementa un símbolo `while`.

**Decisiones:** una condición incumplida se registra como `trace.omitido`, no aplica transiciones, valores, duración ni salidas, y avanza al siguiente paso. Múltiples condiciones son AND para ejecutar y OR para omitir. Una invocación explícita `Proceso → Proceso` toma el destino como siguiente paso al terminar exitosamente; la autoinvocación repite el mismo proceso hasta que una condición de salida produzca bypass. Bucle sin salida: límite de seguridad de runtime con diagnóstico `bloqueado`, sin persistir semántica nueva en el modelo.

**Artefactos:** `app/src/modelo/simulacion/runner.ts`, `app/src/modelo/simulacion/tipos.ts`, `app/src/modelo/simulacion/integracionHechos.ts`, pruebas en `app/src/modelo/simulacion/runner.test.ts` y `app/src/leyes/integracion-ss-fs.test.ts`. SSOT KORA actualizadas: `urn:fxsl:kb:reglas-opm-estrictas-es` v1.1.2 (`R-EJEC-7..10`), `urn:fxsl:kb:metodologia-forja-opm-es` v1.4.1 (`F.2 Runtime opforja — condiciones y bucles`) y `urn:fxsl:kb:opm-categorial-es` fuente ajustada a esas versiones.

**Verificación local actualizada:** este corte quedó subsumido por la auditoría posterior del mismo día: `cd app && bun run check` -> **1979 pass / 0 fail**; `bun run lint` -> OK; `bun run build` -> OK; `bun run design:governance` -> OK; `bun run quality:gate` -> PASS.

**Riesgos/limitaciones:** la existencia runtime de objetos sin estados aún no se modela como token consumible; para ausencia/presencia ejecutable usar estados explícitos `existente`/`no-existente` o condición a estado. Los abanicos XOR de invocación complejos quedan fuera de este slice; se mantiene soporte de invocación explícita simple/autoinvocación.

## Actualización 2026-06-03 — OPL fan de efecto Objeto→Procesos

**Estado:** remediado `BUG-20260603T050454Z-276ea7` por corrección semántica, no por clonación de gesto/texto OPCloud. En OPM, un efecto lo ejerce un proceso sobre un objeto; por tanto el objeto común de un abanico hacia procesos no puede verbalizarse como sujeto afectante.

**Decisión canónica:** fan de efecto con objeto común y procesos alternativos:
- sin control explícito: `**O** es afectado por exactamente uno de *P*, *Q* y *R*.`
- con evento: `**O** inicia exactamente uno de *P*, *Q* y *R*, y es afectado por el proceso que ocurre.`
- con condición: `Exactamente uno de *P*, *Q* y *R* ocurre si **O** existe, en cuyo caso afecta **O**, de lo contrario se omite.`

**Artefactos:** `app/src/opl/generadores/abanico.ts`, `app/src/opl/parser/parsear.ts`, pruebas en `app/src/opl/generar.test.ts` y `app/src/opl/parser/parser.test.ts`, reporte `docs/bugs/BUG-20260603T050454Z-276ea7/report.md`. En KORA se alinearon las SSOTs `urn:fxsl:kb:reglas-opm-estrictas-es` v1.1.1, `urn:fxsl:kb:spec-forja-opl-es` v1.1.1 y `urn:fxsl:kb:opl-es` v3.0.1; commit KORA `917878a`. El parser conserva compatibilidad de entrada con la forma legacy `O afecta a exactamente uno de los procesos ...`, pero al regenerar normaliza a la pasiva canónica.

**Handoff:** `GAP-FAN-EVENTO` queda parcial, no cerrado global: efecto con objeto común y procesos alternativos está implementado forward+reverse; otros roles bajo evento con fan siguen como GAP. Pendiente tras deploy: smoke visual en producción creando O→{P,Q,R} con/sin evento si se quiere validar la captura exacta del caso reportado.

## Corte actual — Cierre de la capa categorial (Fs + Ss + integración + UX)

**Estado 2026-06-03:** la capa categorial queda **cerrada y verificada end-to-end por leyes falsificables** — deja de ser dos teorías inconexas con verde tautológico y pasa a ser una capa coherente. Trabajo de ingeniería de kernel + leyes + UX de composición; no cambia el corte de producto (persistencia backend, otra línea). Commits del corte en `main` (`34239d9`/`c5e852e` ya en origin; el resto se pushea con este cierre): `34239d9` (P0 solape composición), `c5e852e` (P0 aviso linealidad en UX), `3104bab` (F3 `alcanzable`), `825d227` (ley F1↔S), `05372c7` (UX composición P1/P2: preview + flags locales + aviso in-place), `a31d1a7` (coherencia F0-F3 por ley), `d504f05` (ley F2↔S).

**Decisiones canónicas (mente-omega + cat-thinking):**
- **F3 `alcanzable`** = 4ta consulta del contrato §6.2 (reachability de estados por BFS sobre el grafo de transición consumo→resultado). Es el **dual estático** del recorrido dinámico de la simulación (`urn:fxsl:kb:icas-efectos`, fold/unfold sobre el mismo grafo).
- **reúsa-F0 resuelto como LEY, no como refactor.** El refactor literal es INCORRECTO: `hechosDe` (F0) proyecta entidades+estados+enlaces pero **no refinamientos**, e `impacto-de-eliminar` los necesita. La coherencia F0-F3 (no divergencia) se garantiza por `law-derivacion-no-contradice` (extendida a las 4 consultas): toda referencia derivada existe en `hechosDe`. Acople por ley = lectura más débil que cumple el trabajo, sin romper refinamientos.
- **Integración Ss↔Fs:** puente `simulacion/integracionHechos.ts` (la traza de S es una sección del haz de hechos F0) sella **S⊑F0** y la **dualidad S→F3** (todo objeto que S transicionó, F3 lo reconoce). **F1↔S:** la composición preserva la simulabilidad (`simular(A∘B)` ejerce los procesos de A y B). **F2↔S:** un in-zoom F2-coherente es simulable, respeta S⊑F0 y ahora la simulación del OPD hijo ejerce la misma firma de frontera que el proceso abstracto (`verificarBisimulacionFrontera`, con control de no-tautología).
- **F-D1/F-D3:** el reloj de simulación ya tiene semántica operativa: cada paso puede conservar la ventana `DuracionTemporal`, convertir duración observada a segundos, disparar eventos de sobretiempo/subtiempo desde enlaces de excepción temporal y reducir varias corridas a un resumen cuantitativo (duración total/media/min/max + conteo de eventos). Es enriquecimiento de la traza, no nueva primitiva OPM.
- **UX composición P1/P2:** preview del delta antes de confirmar (anti Generation Surprise; `resumenComposicion` puro reusa `verificarLinealidad`), flags `mostrar archivados/versiones` LOCALES al diálogo (eran estado global del workspace), aviso explícito de operación in-place reversible. El solape P0 se corrige en el kernel con margen horizontal; la linealidad se advierte sin bloquear (undoable).

**Artefactos principales:** `app/src/modelo/razonamiento/derivar.ts`, `app/src/modelo/composicion/{componer,interfaz,index}.ts`, `app/src/modelo/simulacion/{integracionHechos,tiempo,enriquecimiento}.ts`, `app/src/ui/DialogoComposicion.tsx`, `app/src/store/modelo/acciones-capacidades.ts`, y leyes `app/src/leyes/{razonamiento,composicion,integracion-ss-fs,tiempo-enriquecimiento}.test.ts`. Diseño y síntesis: `docs/roadmap/{capa-categorial,simulacion-categorial}-opforja.md`, `docs/capa-categorial.md` (conocimiento conceptual destilado).

**SSOT promovida (KORA, repo `~/kora`, `origin/master`):** el conocimiento categorial quedó normado en **4 piezas** de la SSOT OPM (capas **opforja**, NO ISO), cada una en su capa propietaria, validadas con el toolchain (`lint-md` 0, `check --strict` **34/34**, `kb-graph` sin huérfanos):
- `urn:fxsl:kb:reglas-opm-estrictas-es` **v1.1.0** — Anexo C: reglas `R-CAT-LIN` (linealidad), `R-CAT-EQ` (equivalencia por frontera), `R-CAT-COMP` (composición). Commit KORA `7c6de40`.
- `urn:fxsl:kb:metodologia-forja-opm-es` **v1.4.0** — A0.4: equivalencia funcional de realizaciones (cierre de A0; criterio in-zoom↔out-zoom). Commit KORA `9a1279b`.
- `urn:fxsl:kb:spec-forja-opl-es` **v1.1.0** — §24: composición por interfaz en OPL (unión deduplicada de párrafos). Commit KORA `9a1279b`.
- `urn:fxsl:kb:opm-categorial-es` **v1.0.0** — artefacto-puente OPM↔TC (mapa primitiva→construcción categorial→URN ICAS); la "nota al margen formal" aislada, nunca expuesta al modelador. Commit KORA `6e6e62a`.

La misma verdad expresada una vez por capa (regla / método / gramática OPL / mapa), referenciándose entre sí y a las leyes de `app/src/leyes/`. Capas ISO (`opm-es`/`opd-es`/`opl-es`) **intactas**. El puente `docs/canon-opm/reglas-opm-estrictas.md` no requiere cambio (apuntador estable a la URN, ya resuelve a v1.1.0).

**Verificación fresca de cierre:** `cd app && bun test src/` -> **1920 pass / 0 fail**; `bun run typecheck` -> **0 errores**; `bun run design:governance` -> OK; `PW_PORT=5198 bunx playwright test e2e/32-composicion-modelos.spec.ts` -> 1 pass; `PW_PORT=5199 bunx playwright test e2e/12-beta2-modo-simulacion.spec.ts` -> 7 pass. (Nota: `bun test` SIN scope produce ~40 "errors" espurios al recoger los specs Playwright de `e2e/`; el gate unit es `bun test src/` o `bun run check`.)

**Actualización 2026-06-03 — F2↔S frontera plena (Codex):** se cerró la deuda de bisimulación de frontera operativa. La firma de frontera se comparte entre `equivalencia/frontera.ts` y `simulacion/integracionHechos.ts`; la ley nueva en `app/src/leyes/integracion-ss-fs.test.ts` verifica que `desplegar(modelo, iniciarSimulacion(modelo, opdHijoId))` ejerce los roles netos de frontera del proceso abstracto y falla si falta un derivado de frontera. Verificación local: `cd app && bun run check` -> **1936 pass / 0 fail**; `bun run lint` -> OK.

**Actualización 2026-06-03 — F-D1/F-D3 tiempo + enriquecimiento cuantitativo (Codex):** se cerró el siguiente frente dinámico. `simulacion/tiempo.ts` define segundos como unidad canónica de reloj, proyecta `DuracionTemporal` a ventana observada y detecta eventos de excepción temporal desde `excepcionSobretiempo`, `excepcionSubtiempo` y `excepcionSubSobretiempo`. `simulacion/enriquecimiento.ts` resume corridas como acumulación cuantitativa de duración y eventos. La ley `app/src/leyes/tiempo-enriquecimiento.test.ts` verifica: (1) ventana temporal preservada + sobretiempo por umbral; (2) resumen total/media/min/max y conteo de eventos sobre dos corridas. Verificación local tras este corte: `cd app && bun run check` -> **1938 pass / 0 fail**; `bun run lint` -> OK; `git diff --check` -> OK.

**Actualización 2026-06-03 — F-V1/F-V2 eje vertical: adjunción + fibración (Claude):** se formalizó por primera vez el eje vertical de OPM (refinamiento) con leyes falsificables. Verificador puro nuevo `app/src/modelo/equivalencia/verticalidad.ts`: `firmaFronteraEntidad` (observable de la unit de la adjunción) y `verificarLiftCartesianoFrontera` (propiedad cartesiana de la fibración). Ley nueva `app/src/leyes/refinamiento-adjuncion.test.ts` (8 tests): **F-V1** — `out-zoom ∘ in-zoom` preserva exactamente la frontera del proceso (unit iso) + in-zoom idempotente; **F-V2** — biyección {enlaces de frontera del padre} ↔ {derivados del hijo} (lift cartesiano: existencia, unicidad, cambio de base coherente y funtorial); **puente F-V1↔F-D2** — la frontera que la bisimulación de Codex ejerce es la que la adjunción preserva, convirtiendo la hipótesis bajo F-D2 en **teorema verificado**. Tres controles de no-tautología (frontera mutilada, lift huérfano, lift faltante) comparten verificador con los positivos y dan veredicto opuesto. Construye sobre `observarPreservacionFrontera` (cara estática) sin duplicarla. Verificación local: `cd app && bun run typecheck` -> OK; `bun test src/` -> **1948 pass / 0 fail**; `bun run lint` -> OK. Sin nueva primitiva OPM, sin jerga categorial al modelador. No desplegado (kernel+leyes puros, no cambia bundle). Commit repo `a167754` (push `origin/main`). **SSOT promovida:** artefacto-puente `urn:fxsl:kb:opm-categorial-es` **v1.1.0** (fila del eje vertical + §2 adjunción/fibración + trazabilidad a la ley; `derived_from` suma `icas-adjunciones`/`icas-extension`); KORA commit `69a8fb4` push `origin/master`, gates `lint-md 0` + `check --strict 34/34` + `kb-graph` sin huérfanos.

**Actualización 2026-06-03 — pendientes honestos del eje vertical/dinámico CERRADOS (Claude, steipete + cat-thinking + modelamiento-opm):** los tres pendientes que quedaban se implementaron como leyes falsificables con control de no-tautología (+13 tests sobre `refinamiento-adjuncion.test.ts` y el nuevo `enriquecimiento-cost.test.ts`). (1) **Round-trip de `despliegue`** — `out-zoom ∘ in-zoom(unfold)` preserva la frontera externa del objeto; distinción verificada empíricamente: unfold NO proyecta frontera externa como derivados (su fibración es parte-todo), lo opuesto a `descomposicion`. (2) **Identidades triangulares** — verificadas como el observable de que `T = out-zoom ∘ in-zoom` es operador clausura (`T²=T` sobre la frontera, `icas-adjunciones §Galois`) y el refinamiento libre es reproducible; no se afirma la naturalidad plena de η/ε (lectura más débil que cumple). (3) **F-D3 a Cost-category formal** — nuevo `app/src/modelo/simulacion/costoCategoria.ts` (`costoDeCamino = foldMap(duración)` en el monoide `(ℝ≥0,+,0)`; `categoriaDeCosto` = categoría enriquecida en Cost vía cerradura (min,+) con `X(x,x)=0`, triángulo y shortest-path) + `app/src/leyes/enriquecimiento-cost.test.ts`; **complementa** (no reemplaza) el agregador `enriquecimiento.ts` de Codex — ya es estructura, no agregación. Verificación local: `bun run typecheck` OK; `bun test src/` **1963 pass / 0 fail**; `bun run lint` OK. Sin primitiva OPM nueva, sin jerga al modelador, no cambia bundle (no requiere redeploy).

**Actualización 2026-06-03 — Impacto aguas abajo: F3 al canvas (Claude, steipete + cat-thinking + modelamiento-opm):** a partir de un análisis de los límites de opforja (4 "techos": T1 multiusuario/merge, T2 cosimulación entre OPDs, T3 federación viva, T4 razonamiento sin superficie), se implementó lo único autónomo-seguro y de alto valor: el **Techo #4** (parcial). HALLAZGO: el motor F3 NO tenía cierre transitivo aguas abajo (`impactoDeEliminar` es solo primer nivel; `requeridoPor` cierra aguas ARRIBA). Slice vertical kernel→store→UI: (1) **kernel** — nueva consulta F3 `impacto-aguas-abajo` en `app/src/modelo/razonamiento/derivar.ts` = cierre transitivo del flujo forward (resultado/efecto: proceso→objeto; consumo/agente/instrumento: objeto→proceso), dual descendente de `requerido-por`; ley `law-impacto-aguas-abajo` en `leyes/razonamiento.test.ts` (transitividad, direccionalidad, unidad, pureza; control de no-tautología: es MÁS que el primer nivel y excluye lo aguas arriba). (2) **store** — `consultarRazonamiento` proyecta el cono COMPLETO al canvas (cosas afectadas **+ los enlaces que propagan el impacto**) vía la multiselección existente, que ya admite ids mixtos entidad/enlace (`estadoSeleccionDesdeIds` + proyección); sin primitiva de render ni token nuevo. (3) **UI** — acción contextual + command palette `razonar-impacto-aguas-abajo` ("Ver impacto aguas abajo"). T1/T2/T3 NO implementables ahora: T1 = backend (otra línea), T2 = colisiona con WIP de simulación del operador + exige decisiones de acoplamiento, T3 = grado de investigación. Verificación: `bun run typecheck` OK; `bun test src/` **1974 pass / 0 fail**; `bun run lint` OK; `bun run design:governance` OK; sin impacto en e2e. No cambia bundle.

**Deploy 2026-06-03 — cierre categorial dinámico:** commit `c37ef98` (`feat(opforja): fortalecer capa categorial dinamica`) fue pusheado a `origin/main` y desplegado con `docker compose up -d --build`. Build Vite OK, bundle `assets/index-BkxFMKQ2.js`. Verificación post-deploy: `docker compose ps` -> `opforja` healthy, `opforja-model-api` healthy, `opforja-postgres` healthy; healthz interno web `ok`; bug-capture `{"ok":true}`; model-api `200 {"ok":true}`; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200; sesión pública y workspace para tenant nuevo OK.

**Handoff explícito:**
- *Estado actual:* capa categorial cerrada y verificada; `main` ahead de origin con los commits del corte; gate global verde → seguro para push y deploy.
- *Pendientes:* (1) Residuales UX composición: guard de cero-modelos (hoy `componer-modelo` siempre visible → empty state honesto, no crash), sugerencia de interfaz visualmente marcada como sugerida. (2) UX de `alcanzable` expuesta solo como toast (sin selector de estado meta dedicado). (3) Extensiones menores de la capa categorial (los pendientes honestos del eje vertical/dinámico YA están cerrados): otros modos de unfold para el round-trip, naturalidad plena de η/ε, y QoS/optimización sobre la Cost-category (caminos críticos, [0,1]-fiabilidad, profunctors). (4) Próximo fortalecimiento categorial: F-H1 identidad/Yoneda o F-D4 sistemas abiertos/lentes, solo si aparece una garantía falsificable.
- *Supuestos:* F0 (`hechosDe`) es proyección PARCIAL del modelo (sin refinamientos) por diseño; la coherencia con F3 se garantiza por ley, no por compartir implementación. La simulación de un in-zoom usa `iniciarSimulacion(modelo, opdHijoId)` (la maquinaria ya existe).
- *Riesgos:* el margen fijo de composición no es layout automático completo para composiciones grandes (heredado del P0); la UX de `alcanzable` es mínima. **Backend Postgres = OTRA LÍNEA, no auditado en este corte.**

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Corte actual — Cierre de la capa categorial (Fs + Ss + integración + UX)`. Cerrados por leyes falsificables: F2↔S frontera plena y F-D1/F-D3 tiempo+cuantitativo (`integracion-ss-fs.test.ts`, `tiempo-enriquecimiento.test.ts`, Codex) y **F-V1/F-V2 eje vertical: adjunción + fibración** (`refinamiento-adjuncion.test.ts` + `equivalencia/verticalidad.ts`, Claude — incluye el puente F-V1↔F-D2 que convierte la hipótesis bajo la bisimulación en teorema). Los pendientes honestos del eje vertical/dinámico YA están cerrados (round-trip de `despliegue`, identidades triangulares como operador clausura, y F-D3 a Cost-category formal en `costoCategoria.ts` + `enriquecimiento-cost.test.ts`). Extensiones menores: otros modos de unfold, naturalidad plena de η/ε, QoS sobre la Cost-category. Próximo frente categorial solo si da ley falsificable: F-H1 identidad/Yoneda o F-D4 sistemas abiertos/lentes. El conocimiento categorial está normado en la SSOT KORA (4 piezas, ver bloque 'SSOT promovida'); **F-V1/F-V2 ya promovidos al artefacto-puente `opm-categorial-es` v1.1.0** (KORA `69a8fb4`); futuros cambios a la SSOT vía `custodio-kora`, nunca tocan capas ISO. Mantener kernel→store→UI, leyes en `src/leyes/`, y el eje verdad-estructural-sobre-verde. Backend Postgres es otra línea."

## Corte actual — Persistencia backend con tenant, workspace, versiones y autosave

**Estado 2026-06-03:** `model-api` ya no es solo guardado de payload de modelo. El backend crea una sesión anónima firmada en cookie HTTP-only (`opforja_session`) y usa `tenant_id`/`owner_id` para aislar catálogo, workspace, versiones y autosave. No es login de aplicación ni identidad multiusuario fuerte; es ownership operativo por tenant anónimo para que la instancia pública deje de ser un catálogo único compartido por defecto.

**Decisiones:** el frontend mantiene `localStorage` como cache/espejo para flujos que todavía requieren lectura síncrona, pero la SSOT operativa nueva queda en Postgres: `opforja_models`, `opforja_workspaces`, `opforja_model_versions`, `opforja_model_autosaves`, `opforja_tenants`, `opforja_users`. `WorkspaceIndice` se persiste como snapshot JSONB para conservar la UX actual de carpetas/recientes/preferencias sin duplicar toda la lógica del árbol en el servidor. Versiones y autosave tienen endpoints propios; restaurar versión intenta local primero y backend como fallback.

**Artefactos principales:** `app/src/server/modelPersistence.ts`, `app/scripts/model-persistence-api.ts`, `app/src/persistencia/backend.ts`, `app/src/store/runtime.ts`, `app/src/store/persistencia.ts`, `app/src/store/modelo/acciones-ui.ts`, `app/src/store/workspaceMod.ts`, `app/src/store/carpetas.ts`, `deploy/nginx.conf`, `docker-compose.yml`, `app/src/server/modelPersistence.test.ts`, `app/src/persistencia/backend.test.ts`.

**Verificación:** `bun run typecheck` -> OK; `bun run lint` -> OK; `bun run build` -> OK; `bun run design:governance` -> OK; `bun run check` -> **1903 pass / 0 fail**; foco backend/store -> **30 pass / 0 fail**; `bun build scripts/model-persistence-api.ts --target=bun` -> OK; `docker compose config --quiet` -> OK; `docker compose up -d --build` -> OK. Producción: `docker compose ps` -> `opforja` healthy, `opforja-model-api` healthy, `opforja-postgres` healthy; health interno `model-api` -> `200 {"ok":true}`; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200. Smoke con cookie jar: `GET /__deep-opm/session` emite cookie; tenant A guarda workspace/modelo/versión/autosave y los lee; tenant B no ve modelos de tenant A; cleanup deja tenant A sin modelos de smoke.

**Pendientes/riesgos:** no hay login real, roles ni multiusuario con invitación; la sesión anónima depende de conservar la cookie del navegador. El siguiente corte debería agregar auth de aplicación deliberada, administración de tenants, export/import de workspace completo desde backend y retiro gradual de lecturas síncronas de `localStorage` donde ya no sean necesarias.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Corte actual — Persistencia backend con tenant, workspace, versiones y autosave`; avanzar a auth de aplicación real, administración de tenants y eliminación progresiva de dependencias síncronas de localStorage, manteniendo kernel -> store -> UI."

## Corte histórico — Backend Postgres para modelos nuevos

**Estado 2026-06-02:** se decidió dejar de tratar `localStorage` como almacenamiento serio. No hay migración de modelos antiguos porque los existentes eran pruebas. Se agregó un backend interno `model-api` servido bajo el mismo dominio en `/__deep-opm/modelos`, con Postgres `opforja-postgres` y volumen Docker `opforja-postgres-data`. El frontend conserva `localStorage` como cache/espejo transicional para no romper flujos que aún esperan lectura síncrona local (submodelos, composición, diálogos), pero los guardados nuevos se espejan al servidor y la lista del catálogo intenta hidratarse desde backend.

**Decisiones:** backend separado del sidecar de bugs; Nginx proxifica `/__deep-opm/modelos` hacia `model-api:3001`; Postgres guarda `payload` como `JSONB` real, no string escapado. La lista backend puede incluir payload (`includePayload=1`) para rehidratar la cache local en esta fase. `opforja` espera el healthcheck de `model-api`; `model-api` espera Postgres healthy. Sin migrador legacy ni borrado automático de localStorage.

**Artefactos principales:** `app/src/server/modelPersistence.ts`, `app/scripts/model-persistence-api.ts`, `app/src/persistencia/backend.ts`, `app/src/persistencia/local.ts` (`espejarModeloLocal`), `app/src/store/persistencia.ts`, `app/src/store/modelo/acciones-ui.ts`, `Dockerfile`, `docker-compose.yml`, `deploy/nginx.conf`, `app/src/server/modelPersistence.test.ts`, `app/src/persistencia/backend.test.ts`.

**Verificación:** `bun test src/server/modelPersistence.test.ts src/persistencia/backend.test.ts src/persistencia/local.test.ts src/store/persistencia.test.ts` -> 33 pass / 0 fail; `bun run typecheck` -> OK; `bun run check` -> **1897 pass / 0 fail**; `bun run lint` -> OK; `bun run build` -> OK; `bun build scripts/model-persistence-api.ts --target=bun` -> OK; `docker compose config --quiet` -> OK; `docker compose up -d --build` -> OK; `docker compose ps` -> `opforja` healthy, `opforja-model-api` healthy, `opforja-postgres` healthy; health interno `model-api` -> `200 {"ok":true}`; `curl https://opforja.sanixai.com/__deep-opm/modelos` -> `{"modelos":[]}` tras limpiar smoke. Smoke directo producción: guardar/cargar/borrar `/home/felix/projects/hd-opm/models/hodom-completo-v1.4.deep-opm-pro.modelo.v0.json` -> OK; guardar/cargar/borrar payload sintético de 5.24 MB -> OK; tabla `opforja_models` vuelve a 0; `jsonb_typeof(payload)=object` verificado en Postgres.

**Pendientes/riesgos:** la transición todavía conserva cache local y algunas operaciones de metadata de workspace (mover/archivar/renombrar avanzado) pueden quedar local-first hasta el siguiente guardado; no hay auth de aplicación ni ownership multiusuario, así que la instancia pública implica catálogo compartido. El próximo corte debería convertir carpetas/versiones/autosave en recursos backend completos, añadir auth/tenant y reducir dependencia de cache local.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Corte actual — Backend Postgres para modelos nuevos`; consolidar persistencia backend como SSOT completa: carpetas, versiones/autosave, metadata de workspace, auth/tenant y retiro gradual de localStorage como cache obligatoria."

## Corte actual — Integración Ss + Fs + UX + exportación PNG

**Estado 2026-06-02:** se revisó el historial local/remoto, ramas y worktrees. `main` ya contenía los kernels Fs (F0 cimiento, F1 composición, F2 equivalencia, F3 razonamiento), la simulación Ss/S1-S4 y la integración `Ss+Fs`; quedaba pendiente colapsar la UX de composición (`codex/ux-composicion-f1`) y el WIP de exportación de imágenes. Se hizo squash-merge controlado de `codex/ux-composicion-f1` sobre `main`, se reaplicó el WIP de exportación PNG/ZIP y se corrigió la documentación viva que todavía hablaba de exportar SVG.

**Decisiones canónicas:** la composición F1 no copia gestos OPCloud. La superficie op-forja vive en acciones contextuales + Command Palette + diálogo de catálogo: el operador elige un modelo guardado, revisa la interfaz compartida sugerida por identidad/nombre+tipo y confirma la composición. La exportación visual reemplaza la función SVG por dos comandos canónicos de salida raster: OPD activo como PNG y todos los OPDs como ZIP de PNGs. La simulación se conserva como modo de trabajo propio, sin mezclar jerga categorial en la UI.

**Artefactos principales:** `app/src/modelo/composicion/interfaz.ts`, `app/src/ui/DialogoComposicion.tsx`, `app/src/store/modelo/acciones-capacidades.ts`, `app/src/store/acciones-contextuales.ts`, `app/src/render/jointjs/mapaExport.ts`, `app/src/ui/CommandPalette.tsx`, `app/e2e/32-composicion-modelos.spec.ts`, `app/e2e/02-canvas-y-render.spec.ts`, `docs/cumplimiento-opforja.md`, `docs/uso-productivo.md`, `docs/deploy/opforja.md`, `ui-forja/02-components.md`.

**Verificación fresca del corte integrado:** `git diff --cached --check` -> OK; `cd app && bun run check` -> **1891 pass / 0 fail**, typecheck limpio; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK; `PW_PORT=5250 bunx playwright test e2e/32-composicion-modelos.spec.ts --workers=1` -> 1 pass; `PW_PORT=5251 bunx playwright test e2e/02-canvas-y-render.spec.ts -g "Exportar" --workers=1` -> 2 pass; `PW_PORT=5252 bunx playwright test e2e/12-toolbar-overflow.spec.ts -g "superset" --workers=1` -> 1 pass; `PW_PORT=5253 bunx playwright test e2e/12-beta2-modo-simulacion.spec.ts --workers=1` -> 7 pass; `PW_PORT=5254 bun run browser:preview` -> 1 pass; `docker compose up -d --build` -> OK; `docker compose ps` -> `opforja` healthy + `opforja-bug-capture` up; health interno app -> `ok`; health sidecar -> `{"ok":true}`; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200; chunks públicos `index-4YstLL91.js` y `DialogoComposicion-CFhrE5Om.js` -> HTTP/2 200.

**Handoff explícito:** estado actual listo para commit/push/deploy en `main`; no quedan cambios no intencionales en el worktree. La rama `codex/capa-categorial-cimiento` ya está contenida en `main`; la rama/worktree `codex/ux-composicion-f1` queda lista para eliminar después del commit porque su diff fue absorbido por squash. Supuestos: los modelos guardados viven en `localStorage`; la composición F1 usa modelos persistidos locales y no crea suscripciones vivas entre modelos; el ZIP de OPDs usa PNGs rasterizados desde el paper y no promete salida vectorial. Riesgos residuales: no se ejecutó la suite Playwright completa por duración, solo focos críticos + preview; exportación PNG no expone DPI/escala; la representación visual rica de compartidas transparentes sigue pendiente como mejora posterior, no bloqueo de composición.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Corte actual — Integración Ss + Fs + UX + exportación PNG`; verificar el commit/deploy de ese corte en `main`, mantener UX por acciones contextuales/Command Palette/inspector, y continuar solo mejoras residuales: DPI/escala de PNG, visualización rica de compartidas y full Playwright si se requiere auditoría completa."

## Corte histórico — Capa categorial OPM (cimiento F0 + planes de fases)

**Estado 2026-06-01:** se abrió un programa de **capa categorial** para opforja: dotar al kernel del eje horizontal de OPM (composición, equivalencia, razonamiento) y refundar la simulación, como **semántica verificable bajo la superficie** — sin tocar primitivas OPM. **Cimiento F0 implementado por Codex (rama `codex/capa-categorial-cimiento`), revisado y commiteado AISLADO en `main` como `e7822ee`.** No desplegado (kernel puro, sin UI; no es corte de producto).

**Actualización 2026-06-02 — auditoría + remediación de los Fs (Claude; territorio: los Fs, NO simulación).** Otro agente implementó F1/F2 + simulación de una tanda; `bun run check` daba verde PERO con bugs ocultos por **tests tautológicos** (verde ≠ correcto). Auditoría (3 revisores + verificación de primera mano) y corrección:
- **F1 composición (`3515f5f`):** `componerModelos` dejaba referencias **huérfanas** al traer B (refinamientos `opdId`, apariencias `contextoRefinamiento/parteExtraidaDe/estadosSuprimidos`, enlaces `derivado/efectoEscindido/estados/grupoEstructural`, abanicos `decision`) → corrupción silenciosa en modelos con estructura. Reescrito reusando el rigor de remapeo de `submodelos/materializacion.ts` (que el plan F1 pedía y se había ignorado) pero remapeando refinamientos (materializacion los descarta porque solo materializa el SD raíz; componer trae el modelo completo). Test de integridad referencial vía `validarReferenciasOpd` (RED→GREEN).
- **F2 equivalencia (`c01d487`):** `verificarEquivalencia` comparaba `seccionLocal` completa → incluía los enlaces a subprocesos **internos** → dos realizaciones funcionalmente equivalentes con interior distinto **jamás** daban equivalente (inútil para el método A0). Reescrito a **firma de frontera** (rol neto `entidad|tipoEnlace|rol`, abstrayendo el subproceso interno). Tests reales (interior distinto + mismo rol → equivalente; rol distinto → no).
- **Gate:** `bun run check` → **1841 pass / 0 fail**; typecheck limpio. Commits aislados (`git add` específico; no tocan el WIP de Felix ni simulación).

**Fs completos (kernels):** F0 (`e7822ee`) + F1 (`3515f5f`) + F2 (`c01d487`) + F3 (`55dd5df`); los cuatro verdes con tests reales. **F3 razonamiento** = motor de derivación puro (consultas `afectan-a` / `requerido-por` cierre transitivo / `impacto-de-eliminar`), todo `inferido:true`, frontera dura anti-FOL en el módulo. **UX ad-hoc:** **Linealidad COMPLETA** — toggle Lineal/Copiable en el Inspector de objeto (`fea7ae7`) + diagnóstico de recurso lineal con >1 consumidor en el `PanelMetodologia` (`21889b5`). **Razonamiento COMPLETA** (`d1c1edd`) — las 3 consultas como **acciones contextuales** (`razonar-afectan-a` / `razonar-requerido-por` / `razonar-impacto-eliminar`) que aparecen en menú contextual + Cmd+K; afectan-a/requerido-por seleccionan el subgrafo derivado en canvas (halo existente) + toast, impacto-de-eliminar → toast-advertencia; grupo propio en el menú contextual. Ruta MEJOR que el plan (acción contextual ⇒ no toca `CommandPalette.tsx`, esquivó el WIP de Felix); corrección Ψ: `idsResaltadosTemporales` no existía → la selección múltiple ES el resaltado. **Equivalencia COMPLETA** (`14af2d2`) — replanteada por reachability (Ψ): opforja no permite dos realizaciones hermanas de un proceso, así que la aplicación reachable del kernel F2 es la **ley in-zoom ↔ out-zoom** (la descomposición debe ser frontera-equivalente al proceso abstracto). Checker navegable `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (pasivo, surge solo si se rompe la frontera) + acción contextual `verificar-coherencia-descomposicion` (toast). **Composición COMPLETA en rama `codex/ux-composicion-f1`** — acción contextual `componer-modelo` (menú contextual + Cmd+K, sin tocar `CommandPalette.tsx`) abre `DialogoComposicion`: catálogo de modelos guardados, auto-match de interfaz compartida por identidad/nombre+tipo (`sugerirCompartidasPorInterfaz`), ajuste manual por selects y ejecución de `componerModelos` sobre el modelo activo. Verificado con TDD + e2e; no toca simulación. Todas con gate + `design:governance` verdes; aditivas (sin tocar testids existentes).

**Actualización 2026-06-03 — revisión rigurosa de Composición F1 UX + fix de sugerencia de interfaz (Claude).** Auditoría de primera mano de `468b717` (Composición F1 UX): arquitectura correcta (acción contextual → diálogo lazy → `componerConModeloGuardado` → `componerModelos`, undoable; el namespacing del kernel y la integridad referencial de `3515f5f`/`2f39e45` intactos; `composicion-ux.test.ts` y `e2e/32` reales, no tautológicos). **Defecto encontrado y corregido (`a0a817a`):** `sugerirCompartidasPorInterfaz` fusionaba dos entidades por compartir id ignorando el nombre; como los ids de opforja son secuenciales por modelo (`o-1`, `p-1`…), dos modelos independientes del catálogo casi siempre colisionan en id sin ser la misma entidad → el default sugerido fusionaba entidades distintas (probado: `Factura`→`Paciente`). El diálogo lo dejaba corregir (no era corrupción silenciosa), pero era un default erróneo en el caso común. **Fix:** la rama por-id exige ahora que el nombre normalizado también coincida — preserva el caso versión/derivado y, al caer a la rama por-nombre, además desbloquea matches correctos que el id ensombrecía. El test `prefiere identidad de id` blindaba el bug; reescrito a id+nombre + nuevo test del caso de colisión real (RED→GREEN). Gate: typecheck limpio · **1909 unit / 0 fail** · `design:governance` OK. **Hallazgos menores no bloqueantes (residuales):** (#3) `componer-modelo` tiene `visible:true` incondicional → aparece en el menú contextual de toda entidad pese a ser comando a nivel de modelo (cosmético); (#4) la composición sobrescribe el modelo activo (undoable) en vez de abrir pestaña nueva (decisión de diseño defendible). **Fuera de scope de esta revisión:** backend Postgres (`bc69829`) — superficie de seguridad propia (API HTTP, SQL, Docker), pendiente de auditoría dedicada; integración Ss↔F0 (`aca2a6a`) solo lee el haz de hechos, no toca el cimiento F0.

**Push/estado histórico:** este bloqueo quedó supersedido el 2026-06-02 por autorización explícita del operador para colapsar Ss + Fs + UX + bugs sobre `main`, pushear y desplegar. Ver el corte actual al inicio de este archivo.

**Rama histórica integrada:** `codex/ux-composicion-f1` fue squash-mergeada sobre `main` en el corte 2026-06-02. El worktree global quedó apto para limpieza posterior al commit.

**Hallazgo entregado al otro agente (simulación, NO corregido por Claude):** 5/7 e2e de `12-beta2-modo-simulacion` rotos — testid `barra-simulacion-progreso` ausente en la rama "sin procesos"; accessible name del control de velocidad es `"2x"` y el e2e busca `"Velocidad 2x"` (`BarraSimulacion.tsx`); muestreo sin semilla. (e2e 171/191 son **preexistentes**: D1 combinada y breadcrumb, no del agente.)

**Qué es F0 (cimiento):** módulo puro `app/src/modelo/hechos/` que reifica el **hecho OPM** como dato computable (`Hecho`, `ConjuntoDeHechos`, `claveHecho`, `hechosDe`, `seccionLocal`) + el **sheaf-check de pegado** entre OPDs (`verificarPegado`, ley `law-pegado-opd`). Es la base de los 4 pisos (linealidad, composición, equivalencia, razonamiento) y de la simulación. F0 detecta **separación** (un OPD que muestra un enlace hacia un estado que él mismo suprime); el **gluing** entra en F1. Diagnóstico puro: **no toca `validarModelo` ni el wire format**.

**Revisión de F0 (verificada de primera mano, no del reporte):** módulo puro (cero imports fuera del kernel); **13 tests pass / 0 fail** (corridos por mí); typecheck global limpio; F0 aislado (único consumidor = la ley). Codex corrigió en revisión delegada dos cosas legítimas, una de ellas un **bug latente del plan original**: usar `designacionesEstado` (consolida flags legacy `esInicial/esFinal`) en vez de `designaciones ?? []`; y clonar extremos / congelar designaciones para que los hechos no aliasen el modelo. Ambas con tests dirigidos.

**Decisiones canónicas:**
- La capa categorial está **pre-autorizada por el corpus** (`metodologia-forja §0.2-0.3`: lente formal como nota al margen, nunca principio para el humano). Lenguaje OPM/dominio en código; lectura formal solo en docs.
- Principio rector: **comparar en la denotación de hechos**, no en la superficie (strings OPL ni layout).
- Cambios a la SSOT OPM (KORA) = **propuestas**, no ejecución; deciden operador + `custodio-kora`.
- La **simulación es el anamorfismo** (unfold de una coalgebra) y el **gemelo dinámico del razonamiento** (catamorfismo); B0 ya es un anamorfismo a medio construir (`runner.ts::ejecutarPaso` = coalgebra pura). Se **generaliza**, no se reescribe.

**Artefactos:** diseño maestro `docs/roadmap/capa-categorial-opforja.md` (cimiento + 4 pisos); simulación `docs/roadmap/simulacion-categorial-opforja.md` (motor anamórfico + experiencia); planes ejecutables `docs/superpowers/plans/2026-06-01-capa-categorial-{cimiento,composicion,equivalencia,razonamiento}.md`. Código F0: `app/src/modelo/hechos/` + `app/src/leyes/hechos-pegado.test.ts` (commit `e7822ee`).

**Verificación UX Composición (`codex/ux-composicion-f1`):** `cd app && bun run check` -> **1887 pass / 0 fail**; `bun run lint` -> OK; `bun run design:governance` -> OK; `PW_PORT=5217 bunx playwright test e2e/32-composicion-modelos.spec.ts --workers=1` -> **1 pass / 0 fail**.

**Handoff histórico — pendientes ya supersedidos o residuales:**
- **Simulación** — el foco beta2 queda verde en el corte actual; el diseño maestro en `docs/roadmap/simulacion-categorial-opforja.md` sigue como referencia para mejoras posteriores.
- **Integración de la rama UX Composición** — supersedida: la rama fue integrada por squash sobre `main`.
- **Propuestas SSOT** — linealidad como 4ª genérica en `opm-es`; equivalencia como cierre de A0 en `metodologia-forja`; composición por interfaz en `spec-forja-opl §21`. Pendientes de `custodio-kora`.

**Supuestos históricos:** el cimiento de hechos es la base común de pisos + simulación; B0 simulación se generaliza, no se reescribe; el mapeo de interfaz de Composición es autoría local op-forja, no gesto OPCloud clonado.

**Riesgos históricos/residuales:** (1) Visual rico de cosas compartidas transparentes sigue pendiente (no bloquea la UX F1 básica; hoy el pushout usa el kernel existente). (2) Techo de legibilidad: jamás exponer jerga categorial al usuario; UX en lenguaje de dominio. (3) Razonamiento: scope creep hacia demostrador — frontera dura en CONTRIBUTING.

**Prompt histórico supersedido:** usar el prompt del corte actual al inicio de este archivo.

## Corte actual — Vista LF-04 materializada al navegar desde árbol OPD

**Estado 2026-06-01:** corregido el bug reportado: al entrar a la vista de un submodelo desde el árbol OPD ya no aparece un canvas blanco si el submodelo fue seleccionado desde el catálogo local. `conectarSubmodeloSeleccionado` carga e hidrata el modelo guardado elegido; `conectarSubmodelo` acepta ese `snapshot` y crea una vista `submodel-view` read-only con el SD raíz materializado. La referencia queda en estado `cargado-sincronizado`; si el modelo local no existe o el storage no está disponible, se conserva el fallback anterior `descargado` sin romper flujos programáticos.

**Decisión canónica UX/UI:** el árbol OPD debe abrir una vista derivada visible, no una promesa vacía. No se copian gestos OPCloud: el operador selecciona el submodelo en el catálogo op-forja y luego navega por el árbol como con cualquier OPD; la vista hija queda solo lectura para preservar que el padre mantiene la referencia LF-04 y no se edita una copia accidental.

**Implementación:** el snapshot namespaced copia entidades, estados, enlaces, apariencias de enlace y abanicos del SD raíz del submodelo hacia la vista derivada. Los ids se prefijan por referencia LF-04 para evitar colisiones; se remapean extremos, estados TS4/TS5, derivaciones, efectos escindidos y policies de decisión cuando aplican. Los `refinamientos` de entidades copiadas se omiten deliberadamente para no crear navegación rota a OPDs hijos no materializados.

**Artefactos principales:** `app/src/modelo/submodelos.ts`, `app/src/store/modelo/acciones-capacidades.ts`, `app/src/modelo/capacidadesOpcloud.test.ts`, `app/e2e/20-inspector-tabs.spec.ts`.

**Verificación:** `cd app && bun run check` -> **1770 pass / 0 fail**; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK (`index-CcAYBvjs.js` local); `git diff --check` -> OK; `PW_PORT=5207 bunx playwright test e2e/20-inspector-tabs.spec.ts -g "conectar submodelo" --workers=1` -> **1 pass / 0 fail**. Deploy: `docker compose up -d --build` OK; `docker compose ps` -> `opforja` healthy y `opforja-bug-capture` up; `docker exec opforja wget -qO- http://127.0.0.1:8080/healthz` -> `ok`; `docker exec opforja-bug-capture bun -e .../healthz` -> `{"ok":true}`; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200; bundle servido `index-rh0x1ujK.js`, chunks `DialogoSubmodelo-C2uxh_zU.js` y `CommandPalette-Db968qZ5.js`.

**Handoff explícito / pendientes:** el bug queda cerrado para submodelos creados desde modelos guardados en el catálogo local. Pendiente real: refresh/lazy-load avanzado cuando cambia el modelo hijo después de conectado; materialización multinivel de OPDs hijos del submodelo; tratamiento visual rico de cosas compartidas transparentes; y reconciliación de sync si se edita o reemplaza el submodelo origen. Supuesto vigente: la vista LF-04 es una instantánea read-only del SD raíz en el momento de conexión, no una suscripción viva al modelo hijo. Riesgo: la palabra `cargado-sincronizado` describe sincronía inicial, no seguimiento automático posterior.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Corte actual — Vista LF-04 materializada al navegar desde árbol OPD`; continuar con refresh/lazy-load real de submodelos, materialización multinivel opcional y representación transparente de compartidas, manteniendo kernel -> store -> UI y la navegación canónica op-forja por catálogo/inspector/árbol."

## Corte actual — Selector de submodelo existente y retiro total de estilo

**Estado 2026-06-01:** el gesto canónico de op-forja para LF-04 queda en inspector/paleta/contexto, pero al conectar un submodelo ya no se escribe un identificador manual. `DialogoSubmodelo` abre el catálogo de modelos guardados de la carpeta actual, permite buscar por nombre/descripción, alternar archivados/versiones, excluye el modelo persistido actual y selecciona explícitamente el modelo que será la referencia LF-04. La vista derivada toma por defecto el nombre del modelo seleccionado, sigue editable antes de conectar y se crea read-only como antes.

**Decisión UX:** esto conserva la isomorfía funcional con OPCloud sin copiar su gesto: el operador elige un modelo real existente, ve el ancla seleccionada y entiende que el padre continúa editable mientras la vista derivada queda solo lectura. No se crea un submodelo fantasma por texto libre.

**Retiro de estilo:** se elimina la función completa de estilo porque era lastre y no una capacidad fiable. Se borran `StyleControls`, `DialogoEstiloEnlace`, secciones de estilo del inspector de enlace, módulos de kernel `modelo/estilos*` y `modelo/enlaceEstilo*`; se retiran campos `apariencia.estilo` y `enlace.estilo`, acciones de copiar/pegar/aplicar estilo, atajos globales, command palette, menús contextuales, toolbar, serialización, validadores y tests/e2e asociados. Render vuelve a usar únicamente tokens canónicos OPM/UI. En el inspector de entidad queda solo `Tamaño`, porque tamaño/geometría sí es capacidad operable.

**Artefactos principales:** `app/src/ui/DialogoSubmodelo.tsx`, `app/src/ui/InspectorEntidad.tsx`, `app/src/ui/InspectorEnlace.tsx`, `app/src/ui/{BarraHerramientasElemento,CommandPalette,MenuContextualEntidad,MenuContextualEnlace}.tsx`, puertos/viewmodels en `app/src/app/{ports,viewmodels}`, `app/src/modelo/tipos/{apariencia,enlace,ui}.ts`, render JointJS, serialización, store y e2e `15/20/inspector-focus`.

**Verificación:** `cd app && bun run check` -> **1769 pass / 0 fail**; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK (`index-Dd6-JrJu.js` local); `PW_PORT=5205 bunx playwright test e2e/20-inspector-tabs.spec.ts e2e/inspector-focus.spec.ts e2e/15-superficie-contextual.spec.ts --workers=1` -> **22 pass / 0 fail**. El e2e nuevo valida que el diálogo de submodelo lista un modelo persistido real, lo selecciona y crea la referencia LF-04 con vista read-only. Deploy: `docker compose up -d --build` OK; `docker compose ps` -> `opforja` healthy y `opforja-bug-capture` up; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200; bundle servido `index-CkxBp0hi.js`; chunk `DialogoSubmodelo-2rJhzM9D.js` HTTP/2 200; grep del entry sin `StyleControls` ni `DialogoEstiloEnlace`.

**Handoff explícito / pendientes:** publicado en `opforja.sanixai.com`. Si se reintroduce personalización visual en el futuro, debe ser una feature nueva con semántica, persistencia y pruebas propias; no resucitar el panel retirado.

## Corte actual — Bugs UX de inspector, diagnóstico y chrome Codex

**Estado 2026-06-01:** cerrado paquete de cuatro reportes de producción:

- `BUG-20260601T164425Z-844f4e`: el panel de estilo fue primero corregido, pero queda **supersedido** por el corte vigente: la capacidad fue retirada por decisión de producto.
- `BUG-20260601T164538Z-3575b7`: `PanelDiagnostico` se mueve desde el inspector derecho al margen izquierdo bajo OPL. Conserva expandir/colapsar, revalidar, citas SSOT y navegación; al navegar a un aviso se colapsa igual que antes. El inspector derecho vuelve a estar dedicado a índice OPD + propiedades.
- `BUG-20260601T164709Z-aad990`: se elimina la barra inferior Codex. Su funcionalidad real era redundante: ViewPoint ya está en breadcrumb/contexto, los atajos O/P/S/R están en los creadores, `⌘K` queda en header meta y el diagnóstico vive en su panel bajo OPL.
- `BUG-20260601T164807Z-b5a202`: se retiran los botones visibles dedicados a abrir la paleta (`☰` y `Buscar comandos`). La paleta sigue disponible por `Ctrl/Cmd+K`; tests y helpers E2E dejan de depender de chrome visible.

**Artefactos principales del corte histórico:** `app/src/ui/App.tsx`, `app/src/ui/codex/CodexFrame.tsx`, `app/src/ui/toolbar/ToolbarBase.tsx`, `app/src/app/ports/globalShortcutsPort.ts`, `app/e2e/_smoke-helpers.ts`, specs `01/02/08/10/12/20/27`, `docs/bugs/statuses.json`, reportes de los cuatro bugs y `docs/bugs/{INDEX,HISTORY}.md`. Los artefactos de estilo mencionados en ese bug ya no existen en el corte vigente.

**Verificación:** `bun test app/src/modelo/estilos.test.ts` -> 4 pass / 0 fail; `cd app && bun run check` -> 1808 pass / 0 fail; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK (`index-BNUzPaPp.js` local); `PW_PORT=5201 bunx playwright test e2e/12-toolbar-overflow.spec.ts e2e/27-visual-compliance-25-05.spec.ts e2e/01-carga-y-workspace.spec.ts e2e/15-superficie-contextual.spec.ts --workers=1` -> 26 pass / 1 fail inicial por cierre de test, corregido; `PW_PORT=5202 bunx playwright test e2e/12-toolbar-overflow.spec.ts --workers=1` -> 8 pass / 0 fail; `PW_PORT=5203 bunx playwright test e2e/02-canvas-y-render.spec.ts -g "L1 toolbar split" --workers=1` -> 1 pass / 0 fail. Deploy: `docker compose up -d --build` OK; producción `HTTP/2 200`; `opforja` healthy; bundle servido `index-CnGXeYbr.js`.

**Pendiente / riesgo:** `CodexFooterKey` queda como utilidad/test histórico no montado; se puede eliminar en una limpieza posterior si no quedan consumidores. No se eliminó la paleta de comandos: sigue siendo superficie canónica, solo sin botón visible.

## Corte actual — Reanclaje de enlaces sin duplicidad y autoinvocación operable

**Estado 2026-06-01:** `Mover ancla exacta` y `Reanclar extremo` eran equivalentes: ambos abrían el mismo `DialogoMoverPuerto` con el mismo handler. Se eliminó la acción duplicada y queda una sola superficie, `Reanclar extremo`, con diálogo del mismo nombre y feedback `Reanclaje aplicado`. El diálogo conserva la capacidad real: cambiar origen/destino, fijar ancla exacta y remover relación.

Para autoinvocación, el bug estaba en render/tools: el loop se proyecta como dos celdas JointJS con el mismo `enlaceId`, pero las herramientas se instalaban solo en la primera. Ahora cada tramo declara `rolInvocacion` (`auto-salida` / `auto-retorno`), `toolsEnlace` instala herramientas en ambos tramos y limita el reanclaje al extremo semántico correcto: origen en salida, destino en retorno. El loop sigue siendo geometría dedicada; al reanclar un extremo a otra cosa, el enlace deja de ser autoinvocación y vuelve al render normal de invocación.

**Artefactos principales:** `app/src/ui/inspectorEnlace/SeccionExtremos.tsx`, `app/src/ui/DialogoMoverPuerto.tsx`, `app/src/store/modelo/acciones-enlace.ts`, `app/src/render/jointjs/autoinvocacionLoop.ts`, `app/src/render/jointjs/handlers/toolsEnlace.ts`, `app/src/render/jointjs/proyeccionTipos.ts` y tests/e2e vinculados.

**Verificación:** `bun run check` -> 1807 pass / 0 fail; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK (`index-B2tf9gvu.js` local); `PW_PORT=5193 bunx playwright test e2e/02-canvas-y-render.spec.ts -g "mover puerto" --workers=1` -> 1 pass / 0 fail; `PW_PORT=5194 bunx playwright test e2e/30-reanclaje-estructural.spec.ts --workers=1` -> 1 pass / 0 fail; `docker compose up -d --build` -> OK; producción `HTTP/2 200`, `opforja` healthy, bundle servido `index-DmbCsWyp.js`.

## Corte actual — Invocación normal sin quiebre distal

**Estado 2026-06-01:** el enlace de invocación normal conserva el marker transformador swallowtail canónico, pero el rayo/zigzag deja de agregar el tercer vértice de retorno al eje cerca del target. La geometría queda en dos puntos manuales: un punto axial y un punto lateral. La autoinvocación mantiene su loop dedicado con vértices OPCloud porque es otro compositor visual.

**Artefactos principales:** `app/src/render/jointjs/composers/enlace.ts`, `app/src/render/jointjs/composers/enlace.test.ts`, `app/src/render/jointjs/proyeccion.test.ts`.

**Verificación:** `bun test src/render/jointjs/composers/enlace.test.ts src/render/jointjs/proyeccion.test.ts -t "invocacion|markers"` -> 8 pass / 0 fail; `bun run check` -> 1805 pass / 0 fail; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK (`index-Bk0rCKtz.js` local); `docker compose up -d --build` -> OK; producción `HTTP/2 200`, `opforja` healthy, bundle servido `index-DnS9V4zF.js`.

## Corte actual — Ajustes visuales canvas: ghost limpio, contraste y marker de invocación

**Estado 2026-06-01:** se aplicó un ajuste de canonicidad visual sobre el canvas:

- El ghost temporal al lanzar un enlace desde un anchor queda **sin marker** (`sourceMarker=null`, `targetMarker=null`) hasta que existe target y tipo canónico confirmado. Evita mostrar el swallowtail transformador como si el enlace ya estuviera decidido.
- Invocación y autoinvocación conservan el rayo/zigzag del tramo, pero su marker de destino pasa al **mismo swallowtail transformador** que consumo/resultado/efecto: `M 0 0 L 23 8 L 12 0 L 23 -8 Z`, `fill=paper`, `stroke=ink`.
- La paleta OPM del canvas mantiene la familia cromática pero aumenta contraste: objeto `#27613f`, proceso `#1d3f78`, estado `#68711f`, fill de estado `#dedacb`, fill final `#d6d2c6`.
- La sombra semántica de cosas físicas queda más marcada: `dropShadow(dx=6, dy=6, blur=2, color=rgba(23, 21, 17, 0.68))`. Se documenta como excepción OPM semántica; no habilita sombras de elevación UI.

**Artefactos principales:** `app/src/render/jointjs/linkAssets.ts`, `app/src/render/jointjs/handlers/modoEnlace.ts`, `app/src/render/jointjs/composers/entidad.ts`, `app/src/render/jointjs/constantes.codex.ts`, `app/src/ui/tokens.ts`, `ui-forja/{tokens.css,tokens.json,GOVERNANCE.md,08-jointjs-styling.md}` y tests focales de render/tokens/canvas.

**Verificación:** TDD red observado en markers/proyección/ghost/tokens/sombra; luego `cd app && bun run check` -> 1805 pass / 0 fail; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK (`index-Bz_kB9TN.js` local); `PW_PORT=5189 bunx playwright test e2e/14-canvas-fidelity.spec.ts -g "modelo markers canonicos" --workers=1` -> 1 pass / 0 fail.

## Corte actual — BUG-20260601T023324Z-66ff2f, triage vivo y refactor total

**Estado 2026-06-01:** se corrigió el bug visual reportado como `BUG-20260601T023324Z-66ff2f`. La causa raíz era una inversión de criterio: `linkAssets.ts`, pruebas y `ui-forja/08` habían blindado "punta cerrada" como triángulo lleno simple para transformadores, mientras la evidencia curada `docs/JOYAS.md §5` y las capturas OPCloud del bug muestran el marker transformador como **swallowtail cerrado**. La interpretación vigente queda:

- **Consumo / resultado / efecto:** swallowtail cerrado `M 0 0 L 23 8 L 12 0 L 23 -8 Z`, `fill=paper`, `stroke=ink`.
- **Efecto:** mismo marker en source y target.
- **Invocación:** rayo/zigzag en el tramo + el mismo swallowtail transformador `M 0 0 L 23 8 L 12 0 L 23 -8 Z`.

**Artefactos tocados:** `app/src/render/jointjs/linkAssets.ts`, `app/src/render/jointjs/composers/markers.test.ts`, `app/e2e/14-canvas-fidelity.spec.ts`, `app/src/modelo/constantes.bauhaus.ts`, `ui-forja/08-jointjs-styling.md`, `docs/bugs/statuses.json`, `docs/bugs/INDEX.md`, `docs/bugs/HISTORY.md`, `docs/bugs/BUG-20260601T023324Z-66ff2f/report.md`.

**Verificación focal:** `bun test src/render/jointjs/composers/markers.test.ts src/render/jointjs/proyeccion.test.ts -t "marker|efecto|procedimentales|transformadores|invocacion"` -> 15 pass / 0 fail. `PW_PORT=5187 bunx playwright test e2e/14-canvas-fidelity.spec.ts -g "modelo markers canonicos" --workers=1` -> 1 pass / 0 fail, con verificación DOM de marker en `defs`.

**Triage activo consolidado:** el índice vivo sigue mezclando bugs resueltos y nuevos porque muchos reportes activos no han sido archivados, pero `statuses.json` ya resuelve los sobrescritos importantes. Prioridad operativa:

1. `BUG-20260530T214922Z-fb6c2c`: el inspector ya permite reanclar estructurales, pero queda pendiente el reanclaje por arrastre de arrowheads en canvas.
2. `BUG-20260526T020725Z-b2477a`: barra de alinear/distribuir visible pero no responde tras el primer uso.
3. `BUG-20260526T021201Z-9cad06`: "estado volador" al seleccionar estado; requiere reproducción visual.
4. `BUG-20260526T020413Z-ec523c`: orden del inspector nombre -> esencia -> afiliación -> descripción; cambio UI acotado.
5. `BUG-20260526T020225Z-f897bc`: OPL más prosaico; requiere diseño, porque el intento anterior rompía refinamiento y resaltado por hecho.

**Auditoría/refactorización total:** hubo ejecución real de refactor, no solo documentación: commits `refactor(...)` extraen viewmodels, puertos, adapter JointJS, persistencia/workspace, OPL/diagnóstico y contratos del store. El cierre vigente, sin embargo, **no está reproducible**: `bun run quality:gate` falla hoy por bundle gzip 135.55 kB > 129.62 kB, cobertura MVP-alpha 84/121 vs mínimo 104, avance alpha 66% vs 86.2%, reglas auto matched 76/105 vs mínimo 89, y dashboard HU stale. Estado correcto: refactorización ejecutada en gran parte, cierre histórico documentado, cierre actual roto o al menos no revalidado.

## Corte actual — UX/UI canónica para capacidades OPCloud aspiracionales

**Estado:** el corte pasa de "kernel sin UX/UI completa" a **superficie UX/UI base implementada en op-forja** para las capacidades objetivo, manteniendo función **isomorfa** y no gestos copiados de OPCloud. La decisión vigente se mantiene: OPCloud es evidencia observacional; la autoridad semántica vive en KORA (`urn:fxsl:kb:reglas-opm-estrictas-es`), OPL operativo vive en KORA (`urn:fxsl:kb:spec-forja-opl-es`), y la interacción de producto se resuelve con patrón op-forja: **runtime/store primero, command palette, inspector y menú contextual**. Los archivos `docs/canon-opm/*.md` son puentes locales.

## Corte actual — Canon OPM/OPL promovido a KORA y enlazado desde deep-opm-pro

Se promovieron a KORA las dos piezas locales de canon que aún vivían completas en `docs/canon-opm/`:

- `urn:fxsl:kb:reglas-opm-estrictas-es` → `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/reglas-opm-estrictas-es.md`
- `urn:fxsl:kb:spec-forja-opl-es` → `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/spec-forja-opl-es.md`

`docs/canon-opm/reglas-opm-estrictas.md`, `docs/canon-opm/spec-forja-opl.md` y `docs/canon-opm/metodologia-forja.md` quedan como **puentes operativos**, no como SSOT. Cualquier cambio de canon debe hacerse primero en KORA, validarse con `python3 toolchain/kora lint-md`, `python3 toolchain/kora check`, reindexarse con `python3 toolchain/kora index`, y recién entonces mantener los puentes estables.

**Decisiones UX/UI aplicadas:**
- **Read-only por `opd.vista`:** `commitModelo` bloquea cualquier mutación cuando el OPD activo es una vista derivada `readOnly`; el puerto de editabilidad lo refleja en UI; la toolbar deshabilita creadores y muestra badge `solo lectura`. Las acciones que aún pueden abrir un diálogo caen igualmente en el bloqueo centralizado del store.
- **Ontología organizacional:** comando "Configurar ontología" en paleta abre un diálogo plano Codex para editar modo `none/suggest/enforce` y términos `canónico = sinónimo, sinónimo`; persiste con `definirOntologiaOrganizacional`.
- **Requisitos estructurados:** paleta, inspector y menú contextual permiten crear `<<Requirement>>`, marcar objeto existente, satisfacer requisito desde cosa/enlace y crear requirement view read-only.
- **Submodelos LF-04:** paleta, inspector y menú contextual conectan un submodelo desde la cosa seleccionada; el inspector lista referencias y permite desconectar. La acción crea vista read-only pero conserva la edición en el OPD padre.
- **Distribuir/recolectar contorno y split TS4/TS5 parcial:** expuestos como comandos de paleta e inspector de enlace; no se replica el gesto de arrastre OPCloud.
- **Resolver decisión XOR:** comando de paleta e inspector de enlace evalúan la política de decisión existente (`estado`, uniforme 50/50, porcentajes o función registrada).

**Artefactos principales nuevos/modificados:** `app/src/store/modelo/acciones-capacidades.ts`; `app/src/store/{modelo,tipos,runtime}.ts`; puertos/viewmodels en `app/src/app/{ports,viewmodels}`; diálogos `app/src/ui/Dialogo{Ontologia,Requisito,Submodelo}.tsx`; superficies `app/src/ui/{CommandPalette,InspectorEntidad,InspectorEnlace,MenuContextualEntidad,ToolbarBase}.tsx`; ejecución contextual `app/src/ui/ejecutarAccionContextual.ts`; pruebas `app/src/store/capacidadesOpcloudUi.test.ts`, `app/src/store/runtime.test.ts`, `app/src/store/acciones-contextuales.test.ts`, `app/src/ui/CommandPalette.test.ts`.

**Verificación del corte UX/UI:** `cd app && bun run check` -> **1798 pass / 0 fail**; `bun run lint` -> OK; `bun run design:governance` -> OK; `bun run build` -> OK; `git diff --check -- app/src docs/HANDOFF.md` -> OK. Deploy: `docker compose up -d --build` OK; `docker compose ps` -> `opforja` healthy; `curl -I https://opforja.sanixai.com` -> HTTP/2 200; assets vivos `index-DCJuglAp.js`, `CommandPalette-B4Fcp9Rv.js`, `DialogoOntologia-Be9YE3k_.js`.

**Handoff explícito / pendientes reales:**
- No afirmar "UX/UI completa OPCloud": la cobertura actual es la superficie canónica mínima de op-forja. Faltan edición avanzada y feedback inline para sugerencias de ontología en modo `suggest`.
- Requirement views y submodel views siguen siendo vistas derivadas simples/snapshots read-only; falta refresh incremental dedicado y navegación/gestión más rica.
- Submodelo LF-04 aún no implementa lazy-load multiarchivo real, rendering transparente de compartidas, ni confirmación modal específica para desconexión irreversible.
- Decisión XOR tiene resolución UI, pero no editor visual completo de las cuatro policies; la policy `funcion` depende del registry runtime y falla explícitamente si no existe.
- Distribución/recolección y split parcial están en inspector/paleta; si se quiere menú contextual de enlace dedicado, hacerlo como adaptación op-forja, no como copia de gesto OPCloud.
- Worktree sigue mezclado con cambios previos ajenos en `docs/bugs/**`, borrados de docs y auditorías sin versionar; no forman parte de este corte ni deben stagearse.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md` sección `Corte actual — UX/UI canónica para capacidades OPCloud aspiracionales`; cerrar pendientes reales: suggestion UI de ontología, editor de policies de decisión, refresh/navegación de requirement/submodel views, LF-04 lazy-load/compartidas/confirmación irreversible y menú contextual de enlace si aporta a op-forja."

### Actualización jobs-web-ux — revisión de homologación OPCloud sin copiar gestos

**Estado:** se revisó la superficie nueva con `jobs-web-ux` aplicada como criterio de producto: sustracción, copy como UI, command palette/inspector como superficies canónicas y cero "botones mágicos". Se mantuvo la isomorfía funcional con OPCloud, no la mímica gestual.

**Decisiones aplicadas:**
- **Requisitos desde propiedades:** al crear un requisito vinculado desde la cosa/enlace seleccionado, queda visible en `Requisitos vinculados` con acción `Abrir`; la vista de requisito reutiliza el OPD existente si ya fue creada, evitando duplicados invisibles.
- **Ontología:** el diálogo dejó de hablar en `none/suggest/enforce` y muestra `Sin control / Sugerir canónico / Reforzar canónico`, resumen inmediato de términos/sinónimos y microcopy que explica la diferencia operativa entre sugerir y reforzar.
- **Submodelos LF-04:** el diálogo propone defaults útiles (`modelo-<cosa>-detalle`, `<cosa> detalle`), explicita que se crea una vista derivada read-only, y el inspector lista submodelos con estado editable, acción `Abrir` y confirmación antes de desconectar.
- **Requisitos/metadata de enlaces:** el bloque dejó de llamarse "OPCloud"; ahora separa `Satisfied textual` de requisitos estructurados, con copy que dirige a `Crear requisito vinculado` / `Vincular requisito existente`.
- **Contorno, split TS4/TS5 y decisión:** el inspector de enlaces muestra recolectar/distribuir solo cuando aplica; `Resolver decisión` aparece solo si hay política resoluble; el abanico XOR muestra la política visible y desactiva la acción para funciones sin registry runtime.
- **Command palette:** los comandos se nombran según contexto (`Crear requisito vinculado`, `Vincular requisito existente`, `Conectar submodelo` con vista read-only, `Resolver decisión`) para que la operación sea descubrible sin entrenamiento.
- **Calidad visual:** la corrección previa de swatches queda obsoleta; `StyleControls` fue eliminado en el corte vigente.

**Verificación de esta actualización:** smoke Playwright manual en dev (`ontology`, requisito vinculado, submodelo, navegación read-only) -> OK sin `pageerror`/`console.error`; `cd app && bun run check` -> **1800 pass / 0 fail**; `bun run lint` -> OK; `bun run build` -> OK (`index-H8aGiLp7.js` local); `bun run design:governance` -> OK; `git diff --check -- app/src` -> OK. Deploy posterior: `docker compose up -d --build` OK; `opforja` healthy; `bug-capture` OK; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200; bundle vivo `index-B3ytqv2I.js` con chunks `CommandPalette-BrWQTeA5.js`, `DialogoOntologia-CbUMg9or.js`, `DialogoSubmodelo-IvGEHQIe.js`.

**Pendientes tras esta actualización:** sigue pendiente el editor completo de policies de decisión, sugerencias inline de ontología, refresh dedicado de requirement/submodel views, lazy-load real LF-04 y gestión rica de compartidas transparentes. No clonar gestos OPCloud: cualquier siguiente superficie debe pasar por inspector, command palette o menú contextual op-forja.

**Prompt breve de continuación:** "Retomar desde `docs/HANDOFF.md`, sección `Actualización jobs-web-ux — revisión de homologación OPCloud sin copiar gestos`; continuar con editor de policies de decisión, suggestion UI de ontología y refresh/navegación avanzada de requirement/submodel views, manteniendo kernel -> store -> UI y superficies canónicas op-forja."

## Corte actual — Supresión de estados POR APARICIÓN (per-OPD) + chip de conteo (sesión 2026-05-31)

**1. Supresión de estados por aparición (`e69cf1d`, 13 archivos, estilo OPCloud `suppress`/`suppressAll`/`expressAll`).** Se añade ocultar estados de un objeto en un OPD concreto **sin** afectar otras apariciones ni el modelo global, **conservando** la supresión GLOBAL (`Estado.suprimido`) intacta como override maestro. Diseño sellado con `cat-thinking` (`urn:fxsl:kb:icas-topoi`): la visibilidad de estados es un presheaf `Vis : OPD^op → Set`; el dato local vive en la **fibra** `Apariencia.estadosSuprimidos: Id[]` (no en `Estado`, que colapsaría las fibras); visibilidad efectiva = **meet** en Ω `visible = ¬global ∧ ¬local` (global domina, local refina); global y local son **ortogonales** (quitar la global no resucita lo ocultado localmente). SSOT del predicado + ops puras en `app/src/modelo/visibilidadEstados.ts` (`estadoVisibleEnAparicion`, `suprimir/mostrar[Todos]EnAparicion`); rechaza estados con enlaces incidentes (paridad con la global). Capas: campo en `apariencia.ts`; render filtra cápsulas por el predicado efectivo (`composers/{estados,entidad}.ts`, índices `stateCapsuleN` alineados); store expone 4 acciones vía la selección de estado ciudadano; UI "Ocultar/Mostrar (todos) en esta vista" en `MenuContextualEstado.tsx`; validador `validarApariencias.ts` sanea el campo; ley `leyes/supresion-estados-aparicion.test.ts` (no-contaminación entre apariciones, global-domina, ortogonalidad, render, roundtrip). Compat hacia atrás: campo opcional, ausente = ninguno.

**Incremento 2 — OPL por-OPD refleja la supresión local (decisión del operador "reflejar en OPL", SELLO 4 resuelto).** El generador (`opl/generar.ts`) ya itera `opd.apariencias`, así que enumera por la fibra usando `estadoVisibleEnAparicion`: el OPL de un OPD lista solo los estados visibles en *esa* vista. **Bisimetría preservada**: el parser reverse NO borra estados por omisión y alinea posición→id por refs/nombre, así que un OPL con estados ocultos por supresión local hace roundtrip sin corromper ni renombrar el estado oculto (tests "incremento 2" en `opl/generar.test.ts`: vista + roundtrip generar→parsear→aplicar).

**2. Chip `⋯N` de conteo para estados ocultos (`a29e15a`, 2 archivos).** El badge de esquina pasa de un `…` plano a un **chip hairline en tinta** (`rect` paper + borde ink `rx/ry`=pill detrás del `text`) con el **conteo** de estados ocultos en la vista (`⋯N`) y tooltip pluralizado ("N estados ocultos en este OPD"). El badge se dispara por supresión de **cualquier** causa (global o local) en esa aparición. Gobernanza: crimson queda fuera (UI-only, no marca semántica en el OPD, `ui-forja/06 §100`) → expresividad tipográfica, no cromática; `bun run design:governance` OK. Conteo `suppressedCount` transportado por `metadatosEntidad`; ancho del chip dinámico por dígitos.

**Gate del corte:** `bun run check` → **1786 pass / 0 fail**; lint limpio; `design:governance` OK. **Desplegado** en `opforja.sanixai.com` (entry bundle `index-DWseXsaH.js`; chip en `index-DWseXsaH.js`, supresión en `feature-dialogos-pesados`/`index`), HTTP 200, healthy. **Artefactos nuevos:** `app/src/modelo/visibilidadEstados.ts` (+test), `app/src/leyes/supresion-estados-aparicion.test.ts`.

## Corte previo — Reanclaje estructural + OPL a Markdown + reconciliación e2e (sesión 2026-05-31)

**1. Reanclaje de extremos en enlaces estructurales (`2bbff4e`, BUG-20260530T214922Z-fb6c2c).** La sección "Extremos" del inspector de enlaces (selectores + "Reanclar extremo" → `DialogoMoverPuerto`) se ocultaba para todo enlace no-procedural (`SeccionExtremos.tsx` retornaba `null`), dejando a los estructurales fundamentales sin vía para reasignar su cosa origen/destino — aunque el kernel (`apuntarExtremoEnlace` + `validarFirmaEnlace`) ya lo admitía. Fix: predicado `seccionExtremosVisible` (procedural ∪ estructural fundamental); el bloque de fan/abanico y los selectores de estado quedan solo para procedurales (los estructurales rechazan extremos Estado, V-237). **Brecha viva**: el reanclaje por **arrastre de arrowheads en canvas** sigue roto para estructurales (compuesto triangular `-refinable`/`-refinador`); reanclar funciona hoy solo por el inspector. Arreglar el canvas requiere instalar SourceArrowhead en `-refinable` y TargetArrowhead en `-refinador` (cirugía multi-celda en `toolsEnlace.ts`/`composers/enlace.ts`).

**2. Exportación de OPL a Markdown + retiro total de HTML (`9767912`).** Las frases OPL ya nacen en Markdown inline (`**objeto**`, `*proceso*`, `` `estado` ``), así que exportar a Markdown sólo las envuelve. Kernel puro `app/src/opl/exportarMarkdown.ts`: `exportarOplOpdMarkdown` (OPD en vista, `# {modelo} — {OPD}` + viñetas) y `exportarOplModeloMarkdown` (modelo completo, `# {modelo}` + sección `## {OPD}` por OPD en recorrido jerárquico). Superficies: **panel OPL** botón "copiar md" (`copiarOplActualAlPortapapeles`, OPD en vista) y **paleta Cmd+K** comando "Exportar OPL del modelo (Markdown)" (`copiarOplModeloMarkdownAlPortapapeles`, modelo completo, sección EXPORTAR). **HTML retirado por completo** por decisión del operador: se eliminó `generarHtmlOpl` (de `runtime.ts` y de 7 barrels que lo importaban muerto), la acción `exportarOplActualHtml` y los botones `html`/`exportar` del panel. Ya no se genera ningún archivo HTML.

**3. Reconciliación e2e con el canon combinado (`8caf4d1`).** `e2e/03` y `e2e/12` cargaban aserciones obsoletas desde `59ad3a9` (D1 recombinó esencia+afiliación en una sola oración "forma OPCloud", revirtiendo el split de `245b031` del 25-may sin actualizar los e2e). Corregidas a la forma combinada (counts 5→3 y 2→1; "Cliente" 3→2; "X es un objeto físico y ambiental." en vez de dos oraciones; "OPL · 1 oraciones"), más el color de hover del token OPL (`rgb(238,236,226)` = `paperWarm`/`#eeece2` vigente, antes `#f4f3ec`) y un stub de `navigator.clipboard` en el e2e de diagnóstico (evita `pageerror` por permiso de clipboard en headless). Causa raíz = deriva de tests vs canon/token, **no regresión de producto** (unit verdes afirman la combinada; `src` intacto, sin redeploy). Verificado con `PW_PORT` (servidor propio, evita la colisión con el vite de `hd-hsc-os` en :5173): 19 passed / 1 skipped.

**Gate sesión:** `bun run check` → 1756 pass / 0 fail; lint limpio. e2e nuevos: panel copia Markdown (03), paleta copia modelo completo (12), reanclaje estructural expone botones (30). **Artefactos nuevos:** `app/src/opl/exportarMarkdown.ts` (+test), `app/src/ui/inspectorEnlace/SeccionExtremos.test.ts`, `app/e2e/30-reanclaje-estructural.spec.ts`.

## Corte previo — Exportador de diagnóstico del modelo a JSON (paleta de comandos)

**Commit `e5ff438` (atómico, 8 archivos):** nuevo comando **"Exportar diagnóstico (JSON)"** en la paleta (Cmd+K), sección EXPORTAR, que **copia al portapapeles** un JSON con **todas las sugerencias del diagnóstico del modelo completo** (alcance `{ tipo: "modelo" }`). Sin descarga de archivo, sin botón en panel — solo paleta, por decisión del operador.

**Forma del JSON** (envoltorio + array, indentación 2): `{ modelo, fecha, alcance: "modelo", totales: { bloqueo, mejora, estilo, total }, sugerencias: [ { id, origen, severidad, codigo, titulo, mensaje, destino, citaSSOT, opdId?, elementoId?, elementoTipo? } ] }`. La `severidad` es la **clasificada visible** (bloqueo/mejora/estilo) vía `severidadDiagnostico`, no el `SeveridadAviso` crudo, para que el JSON coincida 1:1 con el panel. Se omiten campos no serializables (`navegar`, `avisoNavegable`). Fecha inyectable para tests deterministas.

**Decisión de capa (relevante):** la serialización es función pura del kernel (`app/src/modelo/exportarDiagnostico.ts`). Como `severidadDiagnostico`/`severidadDesdeAviso` vivían en `app/viewmodels/` y `modelo/` no puede importar hacia arriba (regla de dependencia unidireccional), se **movieron al kernel** `app/src/modelo/diagnosticoSeveridad.ts` (donde ya viven `clasificarSeveridad`/`SeveridadIssue`) y el viewmodel ahora las **reexporta** para no romper consumidores. La clasificación de severidad es lógica de dominio pura; su sitio natural es el kernel.

**Artefactos:** `app/src/modelo/exportarDiagnostico.ts` (+`.test.ts`, 8 unit), `app/src/modelo/diagnosticoSeveridad.ts` (severidad movida), `app/src/app/viewmodels/panelDiagnosticoViewModel.ts` (reexport), `app/src/app/viewmodels/commandPaletteViewModel.ts` (`exportarDiagnosticoAlPortapapeles`), `app/src/ui/CommandPalette.tsx` (+`.test.ts`, ítem `exportar-diagnostico`), `app/e2e/12-command-palette.spec.ts` (e2e paleta). Gate: `bun run check` → **1750 pass / 0 fail**; lint limpio; e2e 7/7. Verificado en bundle desplegado (chunk `CommandPalette-BLPl2eGv.js`).

**Nota de flujo (e2e):** Playwright con `reuseExistingServer` se conecta al primer vite en `:5173`; si hay otro proyecto sirviendo ahí (p.ej. `hd-hsc-os`), usar `PW_PORT` libre o apagar el otro vite antes de correr el smoke de este repo.

## Corte previo — D1 esencia/afiliación combinada (forma OPCloud) + cierre de remediación GAP OPL + auditoría de divergencias OPL vs OPCloud (rama `codex/remediacion-gap-opl`, integrada a `main`)

**D1 combinada (commit `59ad3a9`):** `oracionEntidad` compone UNA oración con sustantivo de tipo — `**Cosa** es un {objeto|proceso} {esencia} y {afiliacion}.` (p.ej. `*Rescatar* es un proceso informacional y sistémico.`) — en vez de dos oraciones escindidas sin sustantivo de tipo. Es la forma del eco OPCloud (`docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md`), consistente con la coordinación canónica de D5/D10. El parser ya reconocía la forma combinada (roundtrip preservado). Se invirtió la doctrina previa en spec-forja (R-ENT-3, §2.7, §2.8, §9 R-COMP-ELEG-2) y el comentario de `estructural.ts`; bajo `solo-difiere` coordina solo lo que difiere del default. Gate: `bun run check` → 1741 pass / 0 fail; lint OK. Tests/fixtures actualizados por el cambio de forma e índices de línea.

**Remediación GAP OPL (ejecutada en 3 olas, commits del operador y del agente):**

**Ola 1 — bugs reales cerrados con TDD:**
- Placeholder OPL: `refsHints.ts·entidadOplEsEmitible` suprime procesos placeholder usando `esNombreProcesoPlaceholder`.
- INPUT-only: evento/condición sobre resultado e invocación degradan a la oración base; se elimina la emisión no canónica `puede generarse` en fan resultado+condición.
- Invocación: emisión canónica `después de`; parser compatible con `despues de` legacy.
- Probabilidad: export OPL emite `Pr=p` y retira el sufijo porcentual legacy; parser descarta `Pr=p` como anotación de superficie.

**Ola 2 — spec-forja ajustada:**
- `docs/canon-opm/spec-forja-opl.md` reclasifica `GAP-XOR` como `GAP-XOR-FEATURE`, documenta `unidades-tiempo` como metavariable, ubica colisión/recomposición en kernel de modelo, deja `GAP-COMP-GUARDA` como no-aplicable hasta `GAP-COMPOSICION`, y traza helpers display/metadatos antes marcados `GAP-spec`.
- §20 quedó sincronizada con los fixes: placeholder, modificadores inválidos, invocación, probabilidad, fan resultado+condición, click→foco fuera de `app/src/opl/**`.

**Ola 3 — fixtures roundtrip:**
- `app/src/opl/fixtures-roundtrip.ts` agrega fixtures de efecto básico, TS3/TS4/TS5, habilitadores con estado HS1/HS2, exhibición, clasificación, evento canónico, invocación/autoinvocación con tilde y degradación evento→invocación base.
- Las familias con reverse incompleto desde modelo vacío quedan explícitamente `bisimetricaEstricta: false`; las rutas ya cerradas quedan estrictas.
- `docs/canon-opm/spec-forja-opl.md` marca esos fixture gaps como cerrados o cerrados-para-emisión, manteniendo vivos solo los gaps reales de parser/procedencia.

**Auditoría de divergencias OPL vs OPCloud (commit `952346d`, `docs/auditorias/2026-05-26-alineacion-opl/divergencias-opcloud.md`):** se buscaron todas las divergencias entre la generación OPL de OPFORJA y el eco OPCloud (HU-SHARED-007), **arbitrando cada una por precedencia** (canon supremo `reglas-opm-estrictas`+`opm-opl-es` manda; OPCloud observacional). Resultado: **solo D1 era adoptable** (ya hecho). Las otras divergencias son **eco OPCloud equivocado** que OPFORJA correctamente NO clonó: D5 estados (`puede ser` es mal-traducción de "can be"; canon = `puede estar`), agregación (`consiste en` vs canon `consta de`), T6 dirección de habilitador (HU invierte sujeto/objeto). **Cero GAP-OPCLOUD de código nuevo; OPFORJA está alineado al canon.** Confirmado además que `duracionMetadata.ts:69` emite `puede estar` (el viejo bug C1 está resuelto). Lección: el eco OPCloud no es fiel al canon en ≥3 formas — OPCloud es observacional, no autoridad.
**Backlog vivo**: features/parsers diferidos de la auditoría §4: `GAP-XOR-FEATURE/PARSER`, `GAP-ABANICO-AGENTE-PARSE`, `GAP-TAG-PARSER`, `GAP-SSE-PARSER`, `GAP-CX-PARSER`, `GAP-FAN-EVENTO` parcial (restan roles bajo evento distintos de efecto con objeto común y procesos alternativos), `GAP-FAN-M`, `GAP-COMPOSICION/GAP-COMP-REVERSE`, `GAP-PARSE-TS4/TS5`, `GAP-PROCEDENCIA-ESCIND`, `GAP-NOMBRE-INSTANCIA`, `GAP-VARIA/TIPO/REFINA/PLIEGA/RECOMPONE`.

## Corte previo — spec-forja OPL: SSOT OPL consolidada de OPFORJA (producida)

Se produjo `docs/canon-opm/spec-forja-opl.md` (~3069 líneas), hoy promovida a KORA como `urn:fxsl:kb:spec-forja-opl-es`: la **SSOT OPL única, bidireccional y operativa** de OPFORJA, conforme 100% a las specs KORA aplicables (KORA/MD v12 familia `spec` + spec-md v1 + knowledge-spec v3). Brainstorming → diseño (`docs/superpowers/specs/2026-05-26-spec-forja-opl-design.md`) → plan (`docs/superpowers/plans/2026-05-26-spec-forja-opl.md`) → ejecución subagent-driven (18 tareas, un `opm-specialist` por sección, commits aislados de solo-docs en `main`).

**Decisiones selladas**: SSOT única consolidada (absorbe `opm-opl-es`+`reglas §4` para OPFORJA); bidireccional (generación+parser+presentación+roundtrip); precedencia `urn:fxsl:kb:reglas-opm-estrictas-es` > Dori > OPCloud > curso; eje ontológico con contrato por constructo; combinatoria amplia + composición de prosa (§9) + patrones sociotécnicos/agénticos (Apéndice B); conformidad KORA en forma y en catálogo (`urn:fxsl:kb:spec-forja-opl-es`); OPL solo es-CL sin EN↔ES.

**Contenido**: 4 secciones de preámbulo (Definición/Definiciones/Precedencia/Convenciones) + §1–§20 cuerpo (vocabulario, entidades, transformadores, habilitadores, modificadores, estructurales, refinamiento, combinatoria, **§9 composición de prosa** que resuelve BUG-f897bc por sub-spans con `ref`/`hint` por hecho, multiplicidad, ruta, plegado, panel, interacción, edición, configuración, fallos, EBNF, roundtrip, **§20 trazabilidad**) + §21 Invariantes/§22 Validación-con-`Enforcement`/§23 Migración + Apéndices A (ejemplo end-to-end), B (5 patrones sociotécnicos/agénticos, 4 canon + 1 extensión declarada), C (índice de IDs). Orden = esqueleto spec-md §10.

**Hallazgo de valor — GAPs código↔canon (§20)**: 53 filas en tabla maestra, **44 GAPs consolidados**, **4 GAP-spec** (código sin entrada). GAPs notables: GAP-EVENTO-RESULTADO/GAP-CONDICION-RESULTADO (el generador emite evento/condición de resultado violando la regla INPUT-only de modificadores), GAP-XOR/XOR-PARSER (`puede ser` especialización XOR sin generador ni parser), GAP-PLACEHOLDER-ENTIDAD (`entidadOplEsEmitible` siempre true → supresión de placeholders no cableada), GAPs de fixtures roundtrip, GAP-COMPOSICION (capacidad nueva).

**Verificación (gates KORA)**: hedging 0; EN↔ES 0 (solo mención legítima de la regla); `Traces to:` 0 usos reales (2 menciones que prohíben su uso); tabla `Validación` con columna `Enforcement`; 30 secciones H2 en orden de esqueleto `spec`. `status: borrador` (pendiente promover a `publicado` si el operador aprueba). Commits `f59c9b4`..`9896e5e` (solo-docs, aislados de los cambios in-flight del operador en `app/`).

**Pendiente derivado (corte siguiente)**: **auditoría de alineación del sistema de generación/parser** (`app/src/opl/**`) contra esta spec, usando la tabla §20 como punto de partida — cerrar cada `GAP-*`.

## Corte previo — Auditoría de canon `reglas-opm-estrictas.md` vs SSOT OPM

Se auditó la SSOT suprema operativa (`docs/canon-opm/reglas-opm-estrictas.md`, hoy promovida a `urn:fxsl:kb:reglas-opm-estrictas-es`) contra la SSOT OPM original externa (`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`: `opm-iso-19450-es.md`, `opm-opl-es.md`, `opm-visual-es.md`, `metodologia-opm-es.md`) en 4 líneas paralelas (un `opm-specialist` por dimensión: visual, OPL, ISO/ontología/enlaces, metodología/refinamiento).

**Veredicto: cero conflictos semánticos de canon.** El archivo es fiel a OPM en entidades, taxonomía de enlaces, vocabulario/plantillas OPL-ES (verbos 1:1 con SSOT, EBNF y equivalencia EN↔ES consistentes), primitivas visuales, geometría de abanicos y mecanismos de refinamiento. Los hallazgos fueron **extensiones de producto presentadas como canon SSOT sin marcar** (no contradicciones).

**Correcciones aplicadas (marcado de procedencia, sin alterar fuerza prescriptiva):**
- **§3.12 R-LAY-1 / R-LAY-2**: umbral graduado + bloqueo de export y re-ruteo automático obligatorio marcados como *extensión de implementación* sobre `V-50`/`V-51` (que solo fijan límite de legibilidad y minimización de cruces).
- **§4.13 R-ATR-3..6**: unidades/dominios/intervalos/mutabilidad marcados como extensión local; `SSOT-opl §14` solo canoniza las plantillas textuales.
- **§4.12 R-OPL-RUTA-3**: la restricción a consumo/resultado marcada como decisión de producto; `A.5` admite cualquier procedimental tras `Por ruta`.
- **§8.4 R-ESC-1A**: la escisión como mecanismo *único* marcada como endurecimiento local; `SSOT-metod §7.4` la describe como *la* resolución pero sin exclusividad.
- **§5.8 R-ROL-UNIC-1**: distingue unicidad de rol (canon ISO) de la resolución por fuerza semántica (capa visual, §6.5).

**Falsos hallazgos descartados tras verificación directa (no se tocaron):**
- §5.7 R-EXC-1A (excepción ambiental): correcto — `SSOT-visual §4.4` lo dice literalmente.
- "V-N son evidencia OPCloud": falso — §1.2 ya define `V-N` como reglas de `opm-visual-es.md`.
- §6.5/§6.6 "mal atribuidos a ISO": ya citaban `SSOT-visual §13.x`/`V-43`/`V-44` inline.
- Anexo B R-VIS-DUR-1 (formato duración): R-VIS-DUR-1 + R-VIS-DUR-2 cubren el formato completo de `V-45` entre ambas.

**Artefacto:** `docs/canon-opm/reglas-opm-estrictas.md` (7 inserciones / 5 borrados), actualmente puente local a `urn:fxsl:kb:reglas-opm-estrictas-es`. Corte de solo-docs, aislado de los cambios in-flight del operador en `app/src/**` y de la cola de bugs.

## Corte previo — Ronda de bugs UX delegada (captura/atajos/paneles)

Se paralelizó la resolución de una ronda de bugs reportados desde el capturador en producción, repartidos en **5 líneas con dominios disjuntos** delegadas a subagentes, con reconciliación final (gate unit + e2e afectado). **6 bugs resueltos, 1 revertido por requerir diseño.** El operador integró el resultado commiteándolo atómicamente en `main` (ver hashes arriba) y resolvió en paralelo bugs adicionales (atributos, usabilidad de modelos, contraste de paleta).

**Decisiones aplicadas (resueltos):**
- **BUG-5a6c58** — atajo del capturador de bugs cambia de `Alt+Ctrl/Cmd+B` a **`Shift+Ctrl/Cmd+B`** (`CapturadorBugs.tsx`); e2e `10-capturador` reconciliado al nuevo combo.
- **BUG-c76a40 + BUG-58fefc** — atajos de canvas (`O/P/S/R`) no disparaban tras cambiar de OPD por **click** en el árbol: el foco quedaba en `[data-atajos-contexto="panel-arbol"]`. Fix en `atajosTeclado.ts` `contextoDesdeEvento`: si el panel contextual no tiene registro propio para ese combo, cae a `canvas`. `R` sigue exigiendo cosa seleccionada **por contrato** (no se tocó).
- **BUG-fbb0f1 + BUG-f23d0a** — apilamiento de paneles: Inspector y diagnóstico pasan a columna flex (un solo scroll, diagnóstico acotado a `40%`) en `App.tsx`/`inspectorStyles.ts`; la barra de simulación se vuelve overlay `position:fixed; top:60; zIndex:30` en escritorio/tablet (`BarraSimulacion.tsx`).
- **BUG-895504** — auditoría de canonicidad de la barra superior: **veredicto canónica** (cero hex hardcodeado, sin sombras offset, tipografía/colores por token; `design:governance` OK). Sin cambios de código.

**Revertido (pendiente de diseño):**
- **BUG-f897bc** — "OPL más prosaico con cópulas/conectores". Se implementó agrupación enumerada estructural ("A exhibe B, C y D" en una frase, bisimétrica) pero **colisiona con la ruta de refinamiento/despliegue (HU-50.015)**: fusiona los enlaces hijos de un objeto refinado en la forma plural "son", eliminando las frases individuales con token-verbo + ref por enlace que el resaltado interactivo necesita (rompía 7 tests en `generar.test.ts`). Se revirtió. Requiere diseño: excluir de la agrupación los enlaces en contexto de despliegue/refinamiento preservando tokens por enlace.

**Artefactos relevantes (7 archivos, solo `app/`):** `src/ui/CapturadorBugs.tsx`, `src/ui/atajosTeclado.ts` (+ `.test.ts`), `src/ui/App.tsx`, `src/ui/inspectorStyles.ts`, `src/ui/simulacion/BarraSimulacion.tsx`, `e2e/10-capturador-bugs.spec.ts`.

**Verificación del corte:**
- `cd app && bun run check` → **1707 pass / 0 fail**, typecheck limpio.
- e2e afectado (`10`, `12-beta2`, `30-simulacion`, `inspector-focus`, `23-inspector-resize`, `--workers=1`) → **15/16 pass**. El único fallo (`12-beta2:260` B0.026) es **pre-existente y ajeno**: su aserción espera `"system diagram"` pero el modelo del propio test se llama `"Sim multi OPD"` y la importación no se aplica; ningún archivo tocado roza el flujo de import/breadcrumb.

**Estado / pendientes derivados:**
- El **marcado `Resuelto` en `docs/bugs/*` y la regeneración de `INDEX.md`/`HISTORY.md` (`cd app && bun run bug:index`) quedan al flujo del operador**: no se incluyeron en este commit para mantenerlo aislado y atómico (el índice ya contiene ~24 capturas nuevas sin triar de la cola del operador).
- Bugs nuevos sin abordar en esta ronda (cola de triage): `0e3997, ec523c, b2477a, e7fe11, 9cad06, 86aa78, 738f53, 679f28, 142989, f28eb5, b768d4, 00f799, f81da4, 4c5463, 16a874, 5d7651, 0c3cde, a41f5c`.

## Corte previo — Auditoría prescriptiva Jobs + IFML: primer paint vacío y sin demo

Se ejecutó el P0 de `docs/auditorias/2026-05-26-jobs-ifml-opforja-prescriptivo/informe-prescriptivo-ui-ux-opforja.md`: Opforja deja de abrir como demo/asistente y pasa a abrir como herramienta de modelado vacía, honesta y lista para trabajar. El estado inicial real es `Modelo` + `SD`, sin OPL precargada y sin `System Diagram` como etiqueta visible por defecto.

**Decisiones aplicadas:**
- Se eliminan las superficies de onboarding, bienvenida, asistente, ejemplos, fixtures demo y plantillas guardadas como experiencia de producto. El primer paint queda vacío; el usuario empieza modelando, no descartando una demo.
- La command palette conserva acciones reales de trabajo y depuración, pero retira asistente/ejemplos/plantillas; con búsqueda activa sólo muestra grupos con resultados y el vacío queda como `sin resultados - escribe otro comando`.
- El capturador de bugs deja de exponer FABs visibles. Se mantiene operativo por atajos/command palette y por el sidecar de producción.
- `Abrir/importar` deja de sugerir ejemplos: el diálogo queda como `Abrir modelo` con acción primaria `Abrir`.
- El inspector vacío se reduce a `Selecciona un elemento.` y el breadcrumb base queda `modelo · sd`.
- La limpieza se hace también en store/runtime/persistencia/e2e para no dejar puertos, acciones o pruebas dependientes de la experiencia demo.

**Artefactos relevantes:**
- Auditoría fuente: `docs/auditorias/2026-05-26-jobs-ifml-opforja-prescriptivo/` (informe, evidencia y screenshots).
- UI removida: `PantallaInicio`, `bienvenida`, `asistente/*`, `DialogoPlantillas` y sus puertos/viewmodels.
- Store/runtime limpiado: acciones y estado de asistente, bienvenida, fixture demo y plantillas; persistencia de plantillas retirada del workspace.
- Superficie actualizada: `CommandPalette`, `DialogoCargarModelo`, `CapturadorBugs`, `Inspector`, `Breadcrumb`, `EstadoVacioOpm`, `ChipPersistencia`.
- E2E: helpers pasan de cerrar bienvenida a esperar workbench inicial; specs obsoletas de onboarding/catálogos demo se eliminan o se convierten en aserciones negativas.

**Verificación del corte:**
- `cd app && bun run check` -> **1705 pass / 0 fail**.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check -- app/src app/e2e docs/HANDOFF.md docs/auditorias/2026-05-26-jobs-ifml-opforja-prescriptivo` -> OK.
- `cd app && bunx playwright test e2e/01-carga-y-workspace.spec.ts e2e/12-command-palette.spec.ts e2e/12-toolbar-overflow.spec.ts e2e/21-estado-vacio-opm.spec.ts e2e/27-visual-compliance-25-05.spec.ts` -> **27/27 verde**.

**Estado:** commiteado sobre `main` y desplegado en `https://opforja.sanixai.com` con bundle `index-Cjnl1ime.js` (`docker compose up -d --build`; `opforja` healthy + `bug-capture` up; healthz interno `ok`; `curl -I` externo `HTTP/2 200`; certificado Let's Encrypt R13 vigente hasta 2026-08-16). Mantener fuera del commit de producto los artefactos locales no relacionados: `docs/bugs/**`, `docs/auditorias/2026-05-26-jobs-web-ux-opforja/` y `docs/instrucciones-lineas-dev/ronda-refactor-eje-a/`.

## Corte previo — Tier 1 completo: simulación numérica CSV + e2e de cierre

Se cierra la brecha **F** del Tier 1 (auditoría Opforja vs manual simulado OPCloud): la simulación numérica queda conectada de extremo a extremo a la UI, con export CSV. También se cierran los e2e de las brechas ya integradas (esencia OPL y colisión de nombre), dejando el corte Tier 1 verificado end-to-end.

**Decisiones aplicadas:**
- `generarDatosSimulados` (kernel existente) se conecta vía `DialogoSimulacionNumerica`, abierto desde el command palette (doctrina ⌘K-only), con N corridas síncronas, tabla de resultados y descarga CSV.
- `filasSimulacionACsv` es una función pura con escape estilo RFC-4180, sin dependencias nuevas; columnas = atributos con `esAtributo && valorSlot && simulacion.simulable`; estado vacío guía a marcar atributos simulables.
- Fuera de este corte (diferido): corridas async, export Excel, y la visibilidad de unidades/alias en OPL (tejida en la capa de nombres OPL — hints/parser/roundtrip; merece su propio corte).

**Artefactos relevantes:**
- `app/src/modelo/simulacion/csv.ts` (+ test) — `filasSimulacionACsv` puro.
- `app/src/ui/DialogoSimulacionNumerica.tsx` + `app/src/app/ports/{,zustand}simulacionNumericaDialogPort.ts` + viewmodel + `CommandPalette.tsx` + `App.tsx` — UI de simulación numérica.
- Tests focales: `e2e/30-simulacion-numerica.spec.ts`, `e2e/29-colision-nombre.spec.ts`, `e2e/28-opl-visibilidad-esencia.spec.ts`, `src/modelo/simulacion/csv.test.ts`.

**Verificación del corte:**
- `cd app && bun run check` -> **1755 pass / 0 fail**.
- `cd app && bun run lint && bun run build && bun run design:governance` -> OK.
- `cd app && bunx playwright test e2e/28-opl-visibilidad-esencia.spec.ts e2e/29-colision-nombre.spec.ts e2e/30-simulacion-numerica.spec.ts` -> **7/7 verde**.

**Estado:** commiteado y pusheado a `origin/main` y **desplegado** en `https://opforja.sanixai.com` (bundle `index-i8iXchqs.js`, `docker compose up -d --build`; `opforja` healthy + `bug-capture` up; HTTP/2 200).

**Procedencia (auditoría de cobertura Opforja vs manual simulado OPCloud):** 369 capacidades evaluadas → **47% cubierto / 24% parcial / 29% ausente**. El Tier 1 cerró las 3 brechas reales de mayor valor y bajo riesgo (A esencia OPL · B colisión de nombre · F simulación numérica CSV). Ausencias mayores que siguen abiertas: stereotypes, ontología organizacional, métricas del modelo, requisitos estructurados, informative grading, missing-knowledge (ver Pendientes).

## Corte previo — resolucion base de colisiones de nombre + captura viva

Se consolida el siguiente incremento sobre `main`: el capturador sigue escribiendo artefactos versionables en `docs/bugs/` y el flujo de nombres duplicados deja de caer en error seco. La deteccion pura ya integrada se conecta ahora con estado suspendido, resolutores y un dialogo Codex minimo.

**Decisiones aplicadas:**
- Si una creacion inline intenta usar un nombre canonico existente, la operacion queda suspendida en `colisionPendiente` y se abre `DialogoColisionNombre`.
- En creacion con mismo tipo, `Reutilizar` elimina la entidad provisional y crea una nueva aparicion de la entidad existente en la posicion original, en un commit undo atomico.
- En creacion o rename, `Usar otro nombre` aplica `renombrarEntidad`; si el nuevo nombre sigue siendo invalido, se preserva el mensaje de dominio.
- En cancelacion de creacion suspendida, la entidad provisional se elimina para no dejar basura semantica.
- El bug vivo `BUG-20260525T233828Z-895504` queda registrado como pendiente de auditoria de barra superior.

**Artefactos relevantes:**
- `app/src/store/modelo/acciones-entidad.ts`, `acciones-ui.ts`, `contrato.ts`, `store/tipos.ts` — estado y resolutores de colision.
- `app/src/ui/DialogoColisionNombre.tsx`, `App.tsx` — UI modal tipografica sin chrome pesado.
- `app/src/store.test.ts` — regresiones de suspension, reuso, renombrado alternativo y rename sin mutacion prematura.
- `docs/bugs/BUG-20260525T233828Z-895504/`, `docs/bugs/INDEX.md`, `docs/bugs/HISTORY.md` — artefacto capturado por operador.

**Pendientes derivados:**
- Reauditar visualmente la barra superior con el bug nuevo y decidir si se resuelve con ajuste de diseño o se marca no-defecto contra `ui-forja`.
- Si el dialogo de colision crece, extraer un puerto/viewmodel dedicado; por ahora el acoplamiento directo a store mantiene el corte pequeno.

## Corte anterior — Tier 1 + recuperacion operativa capturador/scroll

Se llevo la rama `feat/cierre-brechas-tier1` a `main` con dos bloques cerrados: preferencias de visibilidad de esencia en OPL y recuperacion operativa del capturador de bugs/desplazamiento nativo del canvas.

**Decisiones aplicadas:**
- La OPL mantiene una forma canonica interna/roundtrip completa, pero el panel puede ocultar oraciones de esencia desde Configuracion (`oplEsenciaVisibilidad`) para lectura editorial.
- La preferencia de visibilidad de esencia se aplica al Guardar en Configuracion, siguiendo el contrato ya usado por grilla/modos visuales.
- `detectarColisionNombre` queda como helper puro del modelo para identificar colisiones por nombre, tipo y ubicaciones. La UI completa de resolucion de colisiones se integro en el corte siguiente.
- Se repusieron accesos visibles del capturador de bugs (`bug-capture-open`, `bug-ledger-open`) ademas de `Ctrl+Alt+B` y command palette.
- El viewport real de JointJS vuelve a `overflow: auto`, recuperando desplazamiento nativo por canvas; el pan/zoom y centrado programatico siguen funcionando sobre el mismo viewport.
- Se actualizo la auditoria visual e2e para reflejar que capturador visible y scroll nativo son comportamiento esperado, no regresion visual.

**Artefactos relevantes:**
- `app/src/opl/opciones.ts`, `generar.ts`, `panel.ts`, `generadores/estructural.ts` — visibilidad display vs canonica de esencia.
- `app/src/ui/DialogoConfiguracion.tsx` + puertos/viewmodel de configuracion — selector de visibilidad de esencia.
- `app/src/modelo/operaciones/colisionNombre.ts` — helper puro de colision por nombre.
- `app/src/ui/CapturadorBugs.tsx` — accesos visibles restaurados.
- `app/src/render/jointjs/JointCanvas.tsx` — viewport scrolleable restaurado.
- Tests focales: `e2e/28-opl-visibilidad-esencia.spec.ts`, `e2e/10-capturador-bugs.spec.ts`, `e2e/27-visual-compliance-25-05.spec.ts`, `e2e/21-estado-vacio-opm.spec.ts`, unit tests de OPL y colision de nombre.

**Verificacion del corte:**
- `cd app && bun run check` -> verde.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check` -> OK.
- `cd app && bunx playwright test e2e/10-capturador-bugs.spec.ts e2e/27-visual-compliance-25-05.spec.ts e2e/21-estado-vacio-opm.spec.ts` -> verde.

**Estado local al cierre:** no stagear automaticamente `docs/auditorias/inclumplimiento-visual-25-05-2026.md` ni `docs/manual-simulado-opcloud-capacidades.md`; contienen cambios previos/no relacionados con este commit de producto.

**Pendientes derivados:**
- Integrar de punta a punta el flujo de colision de nombre: store actions, modal, reuso por aparicion, rename sin fusion y navegacion a ubicaciones.
- Reauditar visualmente el posicionamiento de los dos accesos del capturador en desktop y mobile para asegurar que no tapan controles criticos.

## Corte previo — Ronda 2 Codex v1.1: OPL canonica, canvas y diagnostico

Se resolvio la auditoria "Incumplimientos Codex — Ronda 2" del 25 mayo 2026, visible con modelo cargado, diagnostico expandido y refinamientos SD1/SD1.1. El foco fue preservar funcionalidad y elevar el cumplimiento contra la SSOT suprema `docs/canon-opm/reglas-opm-estrictas.md` y la autoridad visual `ui-forja/GOVERNANCE.md`.

**Decisiones aplicadas:**
- La OPL forward emite nombres canonicos legibles, no slugs: `Hospitalización_domiciliaria` se proyecta como `Hospitalización Domiciliaria` en OPL, canvas e hints.
- Los procesos placeholder (`Proceso`, `Proceso parte 1`, etc.) no producen OPL canonica; quedan como diagnostico metodologico hasta recibir un nombre verbal/deverbal valido.
- Los estados placeholder (`estado1`, `estado2`) no producen la oracion `puede estar`; se reportan con `ESTADO_NOMBRE_CANONICO` para obligar nombre descriptivo en minusculas.
- Las etiquetas de canvas preservan palabras y autoexpanden el ancho cuando el nombre canonico lo requiere; los contornos de descomposicion crecen para respetar padding interno minimo de 16 px.
- Los identificadores visuales de apariencias internas de descomposicion se renderizan jerarquicos (`p.01.1`, `p.01.2`, `o.01.1`) en vez de saltos top-level (`p.21`, `o.11`).
- El diagnostico deja de ser panel encajonado: vive como marginalia editorial dentro del inspector, con `revalidar` inline italic, conteos `△ N sugerencias`, categorias de una columna, filas sin chip y citas con border-left hairline.
- Al expandir diagnostico, reemplaza visualmente el inspector vacio; al navegar a un aviso, colapsa para mostrar el inspector poblado.
- El indicador flotante de sugerencias en canvas pasa de chip negro `!` a marca tipografica `△` sin fondo.
- El breadcrumb largo colapsa con marca explicita `…`, sin `text-overflow: ellipsis` silencioso.
- El caret huerfano del panel OPL queda etiquetado como `plegar ▾`.

**Decision normativa explicitada:**
- No se cambio el marker de `exhibicion` a cuadrado. La auditoria lo pidio, pero entra en conflicto con el canon vigente y los tests actuales: `ui-forja/08-jointjs-styling.md`, `app/src/render/jointjs/linkAssets.ts` y `proyeccion.test.ts` mantienen exhibicion como triangulo de contorno con triangulo interno. Ante conflicto, manda `docs/canon-opm/reglas-opm-estrictas.md` + autoridad visual versionada, no la captura.

**Artefactos relevantes:**
- `app/src/modelo/nombresCanonicos.ts` — normalizacion de nombres canonicos de entidades/estados y deteccion de placeholders.
- `app/src/opl/generar.ts` + `app/src/opl/generadores/*` — supresion OPL de placeholders y emision canonica.
- `app/src/modelo/checkers.ts` — diagnostico `ESTADO_NOMBRE_CANONICO`.
- `app/src/render/jointjs/composers/entidad.ts` — labels canonicos, auto-size, padding de compounds e IDs jerarquicos.
- `app/src/ui/PanelDiagnostico.tsx`, `App.tsx`, `Breadcrumb.tsx`, `panelOpl/Toolbar.tsx` — diagnostico editorial, reemplazo de inspector, breadcrumb colapsado y toolbar OPL etiquetada.
- Tests focales: `generar.test.ts`, `diagnostico.test.ts`, `entidad.test.ts`, `Breadcrumb.test.ts` y specs Playwright ajustadas a los contratos canonicos.

**Verificacion del corte:**
- `cd app && bun run check` -> verde (typecheck + unit).
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check` -> OK.
- `bun run visual:gate` no existe en `app/package.json`; se uso Playwright como gate visual disponible:
  - `cd app && bunx playwright test --shard=1/3` -> verde.
  - `cd app && bunx playwright test --shard=2/3` -> verde.
  - `cd app && bunx playwright test --shard=3/3` -> verde.

**Estado local al cierre:** no stagear automaticamente `docs/auditorias/inclumplimiento-visual-25-05-2026.md` ni `docs/manual-simulado-opcloud-capacidades.md`; contienen cambios previos/no relacionados con este commit de producto.

**Pendientes derivados:**
- Convertir esta ronda en DDR si se quiere formalizar el patron de diagnostico editorial como norma estable.
- Agregar gate dedicado si el equipo decide llamar `visual:gate` a la combinacion Playwright/visual audit.
- Reauditar con captura nueva de SD, SD1 y SD1.1 tras deploy para confirmar cobertura visual cercana a 97%.

## Corte visual previo — Auditoría visual Codex v1.1 cerrada y desplegada

Se resolvió `docs/auditorias/inclumplimiento-visual-25-05-2026.md` contra la captura del 25 mayo 2026. El corte es de ajuste visual/estructural, sin cambiar la semántica OPM ni la SSOT `docs/canon-opm/reglas-opm-estrictas.md`.

**Decisiones aplicadas:**
- El capturador de bugs deja de exponer floating action buttons. Sigue montado como servicio operativo y se abre por `Ctrl+Alt+B` o command palette (`Capturar bug`, `Bugs y features`). Decisión formal: `docs/decisiones/DDR-0007-botones-flotantes-capturador.md`.
- El inspector vacío queda reducido a una sola frase italic; renombrar modelo vive en command palette → `MODELO`.
- El breadcrumb del workspace muestra la jerarquía editorial `sistema · system diagram` y agrega OPDs hijos en minúsculas.
- La toolbar OPL usa palabras inline, sin checkbox para filtro por selección y sin cajas para acciones de pie.
- Se elimina `LIVE` redundante de OPL/Inspector y el árbol sólo muestra disclosure cuando hay hijos.
- El viewport JointJS queda sin scrollbar nativa (`overflow: hidden`); el pan/zoom sigue siendo responsabilidad del canvas.
- Los glifos y kbd de creación respetan color canónico por clase OPM.

**Artefactos relevantes:**
- `docs/auditorias/inclumplimiento-visual-25-05-2026.md` — crítica original y resolución aplicada.
- `docs/decisiones/DDR-0007-botones-flotantes-capturador.md` — decisión de retirar FABs.
- `app/e2e/27-visual-compliance-25-05.spec.ts` — cobertura Playwright focal de la auditoría.
- Componentes tocados: `Breadcrumb`, `CommandPalette`, `Inspector`, `PantallaInicio`, `CapturadorBugs`, `panelOpl/Toolbar`, `toolbarPrimitives`, `ToolbarCreacion`, `NodoOpd`, `CodexFooterKey`, `JointCanvas`.

**Verificación del corte:**
- `cd app && bun run check` -> **1718 pass / 0 fail**.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check` -> OK.
- Playwright focal ejecutado: auditoría visual 25-05, onboarding precargado, capturador de bugs, OPL panel, carga/workspace, responsive review, superficie contextual, inspector tabs, árbol/pestañas, toolbar overflow, canvas/render e inspector resize.

**Deploy verificado:**
- `docker compose ps` -> `opforja` healthy y `opforja-bug-capture` up.
- `docker exec opforja wget -qO- http://127.0.0.1:8080/healthz` -> `ok`.
- `docker exec opforja wget -qO- http://bug-capture:3000/healthz` -> `{"ok":true}`.
- `curl -I https://opforja.sanixai.com/` -> `HTTP/2 200`, `content-type: text/html`.
- Certificado TLS Let's Encrypt para `CN = opforja.sanixai.com`, vigente hasta 2026-08-16.

**Estado local al cierre:** quedan cambios no stageados/no incluidos en `docs/auditorias/inclumplimiento-visual-25-05-2026.md` y `docs/manual-simulado-opcloud-capacidades.md`; no pertenecen al commit documental de handoff y no deben stagearse automáticamente.

## Corte normativo base — ui-forja-governance como autoridad normativa de diseño

`ui-forja/` deja de ser una propuesta y queda consolidado como **ui-forja-governance**, autoridad normativa de diseño para Opforja.

**Precedencia vigente:**
1. `urn:fxsl:kb:reglas-opm-estrictas-es` manda para canonicidad OPM/OPD/OPL; `docs/canon-opm/reglas-opm-estrictas.md` es puente local.
2. `ui-forja/GOVERNANCE.md` manda para frame, chrome, tokens, tipografía, composición, componentes, interacción visual y apariencia JointJS.
3. `ui-forja/01-design-spec.md` ... `08-jointjs-styling.md` detallan la norma por capa.
4. `app/src/ui/tokens.ts`, `app/src/ui/` y `app/src/render/jointjs/` implementan la norma.

**Artefactos nuevos / actualizados:**
- `ui-forja/GOVERNANCE.md` — jerarquía, invariantes, excepciones, política de cambio y definición de listo.
- `ui-forja/README.md`, `01-design-spec.md`, `02-components.md`, `03-scenes.md`, `05-interactions.md`, `tokens.css`, `tokens.json` — actualizados a Codex v1.1 (`OPL ← canvas → Índice + Inspector`, tabs workspace en header, columnas 360/360).
- `app/scripts/design-governance-audit.mjs` + `bun run design:governance` — gate ejecutable para tokens, layout documental y sombras offset prohibidas.

**Auditoría aplicada en implementación:**
- Sombras offset eliminadas de overlays/menús secundarios detectados (`BarraHerramientasElemento`, `MenuTipoEnlace`, `HaloEstado`, modal de nombre en toolbar). Se preservan rings `0 0 0`, inset hairlines y aliases `tokens.shadows.*` permitidos.
- `gate:refactor` ahora incluye `bun run design:governance`.

**Gate local de este corte:**
- `cd app && bun run design:governance` -> OK.
- `cd app && bun test src/ui/tokens.test.ts src/ui/toolbar/toolbarStyles.test.ts src/ui/BarraHerramientasElemento.test.ts` -> 75 pass / 0 fail.
- `cd app && bun run check` -> 1713 pass / 0 fail.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bunx playwright test e2e/02-canvas-y-render.spec.ts e2e/03-opl-panel.spec.ts e2e/04-arbol-y-pestanas.spec.ts e2e/12-toolbar-overflow.spec.ts e2e/22-responsive-review.spec.ts e2e/23-inspector-resize.spec.ts` -> 55 passed / 1 skipped.

## Ronda bugs-canvas (en main, pusheada y desplegada)

7 bugs de canvas/atajos resueltos en 4 líneas paralelas (worktrees, dominios disjuntos) — `docs/bugs/` todos en Resuelto:
- **Símbolos** (L-A): sombra física suave (`6ae261`), estado como rountangle de radio fijo (`9e3b9b`), proceso sistémico refinado conserva contorno sólido (`a8c184`).
- **Enlaces** (L-B): ancla canónica center+boundary para consumo/resultado/efecto (`7fcdba`), self-loop de autoinvocación con geometría/marca canónicas (`06f1ed`).
- **Viewport** (L-C): OPD hijo refinado se ancla al centro geométrico → el encuadre lo centra (`b6be2b`).
- **Atajos** (L-D): teclas O/P/S/R crean objeto/proceso/estado/enlace con canvas activo, con guard de foco (`445a97`).

Verde: **1696 unit + 237 e2e / 0 fail**. Lección operativa: los subagentes en worktree a veces resuelven rutas absolutas al checkout principal (contaminan `main`); el orquestador resetea el working tree y mergea solo las ramas committeadas. Ver [[feedback-ronda-paralela-reconciliacion-e2e]].

> Este es el **único** handoff vigente del proyecto. No crear handoffs paralelos ni fechados: reescribir y consolidar aquí.

## Corte documental previo — Baseline funcional OPCloud/OPCAT para auditoria de cumplimiento

Se consolido un manual funcional simulado de capacidades OPCloud/OPCAT como artefacto de referencia para chequear avance, granularidad y cumplimiento del desarrollo de Opforja. El documento suma capacidades sin distinguir entre OPCAT y OPCloud y describe **que hace** el software, no como lo implementa.

**Artefacto nuevo:**
- `docs/manual-simulado-opcloud-capacidades.md` — inventario enriquecido de capacidades funcionales agrupado por modelado OPM nuclear, refinamiento, OPD/OPL, canvas, conectividad contextual, gestion de modelos, reutilizacion/gobierno semantico, requisitos, analisis, import/export, simulacion/ejecucion y entrada de usuario.

**Fuentes consolidadas:**
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/opm-curso-applied-modeling.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/opm-curso-sd-wizard.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/opm-iso.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/fxsl/opm-methodology/OPM version felix.md`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/opm-libro-curado/`
- `/home/felix/kora/artifacts/knowledge/_SCRIPTORIUM/INBOX/opm/transcripciones-videos-opcloud.txt`

**Decision de uso:**
- Este manual queda como baseline externo funcional para auditorias de brecha Opforja vs. capacidades OPCloud/OPCAT, complementario al backlog HU (`docs/historias-usuario-v2/`) y al dashboard `docs/roadmap/hu-progress.*`.
- No reemplaza la SSOT OPM ni `docs/canon-opm/reglas-opm-estrictas.md`; cuando una capacidad OPCloud/OPCAT diverge del canon, manda la SSOT.
- Para medir avance, convertir cada capacidad del manual en criterio verificable contra codigo, tests, e2e, UI viva o artefacto documental antes de marcarla cubierta.

**Verificacion documental del corte:**
- `wc -l docs/manual-simulado-opcloud-capacidades.md` -> 909 lineas.
- `rg -n '^## ' docs/manual-simulado-opcloud-capacidades.md` -> secciones 1,2,3,4,5,6,7,9,10,11,12,13,14 y Fuentes usadas; se conserva el salto 7→9 del indice base entregado.
- `git diff --check -- docs/manual-simulado-opcloud-capacidades.md docs/HANDOFF.md` -> sin whitespace errors.

## Corte funcional previo — Runtime sociotecnico/agentico de simulacion

Se implemento el primer corte vertical del sistema de simulacion y computo de Opforja orientado a sistemas sociotecnicos complejos y sistemas computacionales agenticos. El corte es deliberadamente pequeno, puro y verificable: no conecta todavia con UI, runner conceptual existente, persistencia ni herramientas externas reales.

**Artefactos nuevos:**
- `app/src/modelo/simulacion/sociotecnico.ts` — modulo puro tipado para actores, agentes, politicas de autonomia, decisiones, efectos pendientes y trace sociotecnico.
- `app/src/modelo/simulacion/sociotecnico.test.ts` — tests TDD del comportamiento base.

**Decisiones de diseno vigentes:**
- El runtime sociotecnico queda separado del simulador conceptual actual (`runner.ts`/`plan.ts`) para evitar acoplar prematuramente UI, animacion de tokens y ejecucion agentica.
- Las decisiones agenticas se evaluan como datos puros: `permitida`, `suspendida` o `bloqueada`.
- Los efectos externos (`ask-human`, `tool-call`, `http`, `python`, `mqtt`, `sql`, `ros`, `genai`) no se ejecutan; quedan como `efectosPendientes` para que futuros puertos los resuelvan.
- La politica de autonomia resuelve con precedencia: politica por herramienta > politica por accion > politica por defecto.
- Una decision que requiere supervision genera un efecto `ask-human`; una herramienta bloqueada por politica no genera efecto pendiente.
- El trace sociotecnico es inmutable y numerado; `aplicarDecisionSociotecnica` no muta el runtime de entrada.

**Verificacion del corte:**
- TDD rojo inicial confirmado: el test fallaba por modulo inexistente.
- `cd app && bun test src/modelo/simulacion/sociotecnico.test.ts` -> **4 pass / 0 fail**.
- `cd app && bun run typecheck` -> **0 errores**.
- `cd app && bun run test` -> **1700 pass / 0 fail**.

**Estado de worktree al cierre del corte:** existen cambios previos/no relacionados fuera de este commit en render/tests/docs de bugs (`app/src/leyes/proyecciones.test.ts`, `app/src/render/jointjs/*`, `docs/bugs/*`). No forman parte del corte sociotecnico y no deben stagearse automaticamente.

## Último corte funcional — Ronda Codex v2 (cerrada y desplegada)

Cierre completo de la **Auditoría Codex v1.0 ↔ Implementación rev2** (`/home/felix/_TEMP_BORRAR/OpForja_diff.pdf`): las ~28 desviaciones se ejecutaron en **6 líneas paralelas** (worktrees aislados, 2 olas, orden de merge controlado) documentadas en `docs/instrucciones-lineas-dev/ronda-codex-v2/`.

**Desviaciones cerradas:**
- **Canon OPL** (L1): enumeración de estados con `puede estar` (SSOT línea 411); clasificación escindida en esencia + afiliación (D1–D4). Cambio coordinado generador↔parser↔fixtures.
- **Chrome** (L2): wordmark único "Opforja" sin chip; botones top-bar sin caja; breadcrumb + meta en el header de `CodexFrame`; `CodexFooterKey` con leyenda de teclas + diagnóstico; tree-header "ÍNDICE/OPDs".
- **Inspector** (L3): ficha tipográfica continua sin tabs; identificador con punto `o.11`; sin contadores en estado vacío.
- **Canvas** (L4): sin resize-handles (SEL-2); underline crimson en selección única (SEL-1); una sola voz (`CodexSelectionAnnotation` funcional, `BarraHerramientasElemento` retirada del desktop).
- **Comandos** (L5): `⌘K` como vía única; `MenuPrincipal` eliminado, `☰` abre el palette; navegación `⌘1-9`; etiquetas de atajo por plataforma.
- **Tokens** (L6): pesos 500/600; anchos canónicos 210/360; color legacy (lime/cyan) erradicado; sombras/radius fuera de token retirados; chip de filtro OPL.

**Verificación verde:** `bun run check` = **1685 unit / 0 fail**; `bun run browser:smoke` = **237 e2e / 0 fail** (2 skips intencionales: AI-Text placeholder y resize-handles retirados); `lint` + `build` limpios. La reconciliación e2e final confirmó **cero regresiones de producto** (las 15 fallas eran aserciones obsoletas por el cambio de canon/anchos).

## Corte actual — Ronda bugs OPM/OPL/OPD 2026-05-26

Se cerro la tanda de 19 bugs capturados entre `BUG-20260526T024016Z-b768d4`
y `BUG-20260526T033451Z-59993d`, con trabajo paralelo en tres dominios:
OPL/canon, semantica de enlaces/render JointJS y UX de interaccion.

**Fuentes normativas usadas:**
- Repo: `docs/canon-opm/reglas-opm-estrictas.md`.
- SSOT externa indicada por el operador:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`

**Decisiones y comportamiento cerrado:**
- `efecto` ya no acepta `Objeto -> Proceso`; las firmas validas son
  `Proceso -> Objeto` y `Estado -> Proceso` como efecto de entrada.
- El split de efecto TS3 escinde a dos efectos TS4/TS5 acoplados
  (`Estado -> Proceso` y `Proceso -> Estado`) sin crear objeto sintetico ni
  reemplazar por consumo/resultado.
- La serializacion JSON preserva metadatos de efecto TS3/TS4:
  `estadoEntradaId`, `estadoSalidaId` y `efectoEscindido`.
- OPL vuelve a emitirse aunque los nombres no pasen heuristicas de canon; las
  heuristicas quedan como diagnostico, no como supresion de lenguaje.
- OPL cubre efectos con estados, multiplicidad opcional (`?`, `0..1`),
  agrupaciones opcionales, modificadores y frases naturales de instrumento
  para procesos como manejar/conducir.
- La raiz visual de un bus estructural se identifica como `grupo-enlaces`, no
  como la primera rama.
- Los markers de enlaces transformadores usan punta cerrada canonica.
- Cosas y estados se pueden redimensionar; Backspace/Delete elimina estados
  seleccionados y limpia enlaces asociados; la anotacion contextual ya no
  desborda ni superpone acciones.

**Artefactos principales:**
- Modelo/kernel: `app/src/modelo/operaciones/helpers.ts`,
  `app/src/modelo/operaciones/eliminacion.ts`,
  `app/src/modelo/tipos/enlace.ts`,
  `app/src/serializacion/validarEnlaces.ts`.
- OPL: `app/src/opl/generar.ts`,
  `app/src/opl/generadores/procedural.ts`,
  `app/src/opl/generadores/estructural.ts`,
  `app/src/opl/parser/parsear.ts`.
- Render/UI: `app/src/render/jointjs/*`,
  `app/src/store/modelo/acciones-estados.ts`,
  `app/src/ui/codex/CodexSelectionAnnotation.tsx`.
- Regresion e2e nueva: `app/e2e/31-domain-c-ui-interactions.spec.ts`.
- Trazabilidad bugs: `docs/bugs/statuses.json`, `docs/bugs/INDEX.md`,
  `docs/bugs/HISTORY.md`.

**Verificacion verde del corte:**
- `cd app && bun run check` -> **1723 pass / 0 fail**.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK.
- `cd app && bun run design:governance` -> OK.
- `git diff --check -- app/src app/e2e docs/bugs/statuses.json docs/bugs/INDEX.md docs/bugs/HISTORY.md` -> OK.
- Playwright focal:
  `bunx playwright test e2e/02-canvas-y-render.spec.ts e2e/07-enlaces-avanzados.spec.ts:435 e2e/14-canvas-fidelity.spec.ts e2e/25-produccion-backup.spec.ts e2e/31-domain-c-ui-interactions.spec.ts --workers=1`
  -> **29 passed**.

**Smoke completo observado:**
- `cd app && bun run browser:smoke -- --workers=1` fue ejecutado antes de los
  ultimos ajustes y arrojo **223 passed / 17 failed / 2 skipped**.
- Las fallas de esta tanda detectadas por ese smoke (fixtures de markers con
  efecto en direccion antigua, split TS3 y preservacion de metadata TS3/TS4)
  quedaron corregidas y cubiertas por la verificacion focal anterior.
- Persisten fallas e2e historicas/no relacionadas con este corte: aserciones
  visuales obsoletas de colores, expectativas antiguas de OPL vacio en
  refinamientos, grid/configuracion, tabla densa, simulacion multi-OPD, anchor
  drag y colision de nombres. No bloquearon este commit por estar fuera del
  alcance de los 19 bugs.

**Estado git/documental:**
- Rama de trabajo: `main`.
- Hay cambios ajenos no relacionados en el worktree que no pertenecen a este
  corte: deletes documentales previos y directorios nuevos bajo
  `docs/auditorias/**` / `docs/bugs/BUG-*`. No stagear salvo instruccion
  explicita.

## Corte actual — Submodelos LF-04 canónicos: kernel → store → UI

Se implementó la primera versión estructural del rediseño aprobado para
submodelos LF-04. La regla de producto queda explícita: un submodelo en op-forja
es una **referencia inter-modelo materializable**, no un OPD hijo editable ni una
copia silenciosa de cosas.

**Decisiones cerradas:**
- El estado visible del submodelo ya no es una propiedad editable desde UI. Se
  deriva de la referencia (`source`), la materialización (`materializacion`) y
  el estado irreversible `desconectado`.
- La referencia mantiene compatibilidad v0 (`modeloId`, `anchorEntidadId`,
  `opdVistaId`, `estado`, `compartidas`), pero ahora puede persistir:
  `source`, `anchor`, `contrato` y `materializacion`.
- La materialización guarda mapas fuente→vista para entidades, estados, enlaces
  y abanicos. Esto permite descargar/actualizar la vista sin dejar residuos
  globales ni romper validación referencial.
- La UI del inspector reemplaza el selector manual de estado por acciones:
  `Abrir`, `Actualizar`, `Descargar`, `Desvincular`, más badge derivado
  (`sin cargar`, `sincronizado`, `desactualizado`, `desvinculado`).
- El árbol OPD etiqueta vistas de submodelo con badge `SM` y estado corto.
- OPL emite composición inter-modelo CM1/CM2 para `submodel-view`, sin sustituir
  la OPL interna de la vista materializada.

**Artefactos principales:**
- Kernel: `app/src/modelo/submodelos.ts`,
  `app/src/modelo/submodelos/estado.ts`,
  `app/src/modelo/submodelos/materializacion.ts`.
- Tipos/persistencia: `app/src/modelo/tipos/extensiones.ts`,
  `app/src/modelo/tipos.ts`, `app/src/serializacion/json.ts`.
- Store/UI: `app/src/store/modelo/acciones-capacidades.ts`,
  `app/src/store/tipos.ts`, `app/src/ui/InspectorEntidad.tsx`,
  `app/src/ui/arbol/NodoOpd.tsx`.
- OPL: `app/src/opl/generadores/composicionIntermodelo.ts`,
  `app/src/opl/generar.ts`.

**Verificación ejecutada:**
- `cd app && bun run typecheck` -> OK.
- `cd app && bun run lint` -> OK.
- `cd app && bun run build` -> OK (`index-B29GF8Nt.js`,
  `DialogoSubmodelo-CdHOppzx.js`, `CommandPalette-w8v6A7sa.js`).
- `cd app && bun run test` -> **1771 pass / 0 fail**.
- Focal adicional post-ajuste:
  `bun test src/modelo/capacidadesOpcloud.test.ts src/store/capacidadesOpcloudUi.test.ts src/opl/generar.test.ts`
  -> **90 pass / 0 fail**.
- Commit/push: `5a52f1f feat(opforja): canonizar submodelos LF-04`,
  pusheado a `origin/main`.
- Deploy: `docker compose up -d --build` -> OK; `opforja` healthy,
  `opforja-bug-capture` up; healthz interno `ok`; bug-capture healthz
  `{"ok":true}`; `curl -fsSI https://opforja.sanixai.com/` -> HTTP/2 200.
  Bundle servido: `index-Cbp89wDk.js`, `DialogoSubmodelo-B3mgpFq2.js`,
  `CommandPalette-Dkh0LyuS.js`.

**Pendientes/riesgos:**
- CM3 queda implementado solo para `compartidas` explícitas resolubles; la UI aún
  no ofrece un mapeo inteligente de cosas compartidas/frozen boundary.
- `Actualizar` depende de que el modelo hijo exista en persistencia local. Si no,
  el store muestra mensaje y no muta.
- `Descargar` usa mapas de materialización nuevos y reconstruye mapas para
  materializaciones legacy con IDs prefijados. Si un archivo antiguo fue editado
  manualmente y perdió esos prefijos, se bloquea con mensaje en vez de dejar
  residuos huérfanos.
- Falta Playwright específico de inspector/árbol para acciones `Actualizar` y
  `Descargar`; hoy queda cubierto por kernel, store y tests OPL.

**Prompt de continuación breve:**
> Continúa desde `docs/HANDOFF.md`, sección "Corte actual — Submodelos LF-04
> canónicos: kernel → store → UI". Validar in-vivo la UX de inspector/árbol:
> conectar modelo, abrir vista derivada read-only, descargar, actualizar y
> desvincular. Si se agregan compartidas LF-04, diseñar UI de mapeo de boundary
> antes de emitir CM3 como feature completa.

## Fuentes normativas y técnicas

- **SSOT suprema de canon OPM/opforja**: `urn:fxsl:kb:reglas-opm-estrictas-es` — autoritativa para verbos/plantillas OPL (estados=`puede estar`, especialización=`puede ser`); puente local en `docs/canon-opm/reglas-opm-estrictas.md`.
- **SSOT OPL operativa de opforja**: `urn:fxsl:kb:spec-forja-opl-es`; puente local en `docs/canon-opm/spec-forja-opl.md`.
- SSOT OPM base: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`.
- Autoridad normativa de diseño: `ui-forja/GOVERNANCE.md` + `ui-forja/` (`01-design-spec.md` … `08-jointjs-styling.md`, `tokens.css`, `tokens.json`).
- Evidencia OPCloud preferente: `opm-extracted/` (antes que `decompiled/`).
- Baseline funcional OPCloud/OPCAT para auditoria de cumplimiento: `docs/manual-simulado-opcloud-capacidades.md`.
- Canon visual local: `docs/JOYAS.md` y `assets/svg/`.
- Arquitectura interna, comandos y reglas de oro: `CLAUDE.md` (raíz del repo) — documento único de orientación.

## Decisiones vigentes (no reabrir sin causa)

- Inspector = ficha continua (sin tabs). Comandos = solo palette `⌘K` (sin menú lateral). Selección = solo underline crimson (sin resize-handles). OPL de estados = `puede estar`.
- **OPL — visibilidad de esencia (Tier 1)**: la preferencia `oplEsenciaVisibilidad` (Configuración) es de **presentación**; el texto canónico que alimenta editor libre y parser SIEMPRE se genera completo (roundtrip protegido). No filtrar el canónico.
- **Colisión de nombre (Tier 1)**: reuse-vs-rename; *reutilizar* solo crea una nueva aparición de la entidad existente (nunca entidad nueva ni fusión); tipos incompatibles no se reutilizan; rename hacia un nombre existente solo ofrece renombrar/cancelar.
- **Simulación numérica (Tier 1)**: se abre desde command palette (no chrome); síncrona; export CSV con `filasSimulacionACsv` (puro, sin deps); columnas = atributos `simulable`.
- Deuda categorial activa: trigger del coproducto tagged de selección (refactor A→B en `OpmStore`) — ver `CLAUDE.md` § "Deuda categorial".
- Épicas descartadas: EPICA-70 (Importación OPCAT) y EPICA-91 (Modo tutorial).

## Pendientes

- **Brechas diferidas del Tier 1** (cada una merece su propia spec→plan):
  - *Visibilidad de unidades/alias en OPL*: están tejidas en la capa de nombres (`refsHints.ts` `nombreOpl`/`nombreOplBase`) usada por todos los generadores y por los hints de hover OPL↔canvas y la delimitación de tokens del parser; ocultarlas con consistencia exige enhebrar la opción por toda la capa + regresión hover/parser/roundtrip. Por eso A se acotó a esencia.
  - *D — herencia de generalización computada*: propagar rasgos/estados/relaciones de generales a especializados; es cambio de kernel y debe alinearse con `urn:fxsl:kb:reglas-opm-estrictas-es`.
  - *E — condiciones/loops ejecutables en simulación*: hoy `plan.ts`/`runner.ts` solo ordenan por Y; los modificadores `condicion`/`evento`/`invocacion`/`autoinvocacion` se modelan pero no se ejecutan.
  - *G — cablear el runtime sociotécnico*: `sociotecnico.ts` está aislado (sin UI/persistencia); depende de E + de "procesos computacionales" (subsistema ausente).
- **Auditoria post-deploy con modelo cargado**: tomar nueva captura de SD, SD1 y SD1.1 con diagnostico expandido y una seleccion activa para confirmar la resolucion visual completa de Ronda 2.
- **Deuda Codex v1.1 fuera de este corte**: proceso activo in-flight, asistente SD wizard, sub-modelos, switcher de lengua OPL, dark mode, frame letterbox 1700×950.
- **Integrar runtime sociotecnico con OPM**: mapear procesos computacionales/agenticos a `DecisionSim`, enlaces procedurales a pre/postcondiciones, y objetos/estados a contexto operativo.
- **Agregar puertos de efectos**: definir puertos para aprobacion humana, tool-call, HTTP, Python, MQTT, SQL, ROS y GenAI sin ejecutar efectos desde el kernel puro.
- **Disenar UI de laboratorio de simulacion**: inspeccion de agentes, politicas, decisiones suspendidas, trace sociotecnico y cola de efectos pendientes.
- **Escenarios y corridas**: conectar el runtime sociotecnico con parametros/distribuciones existentes para exploracion Monte Carlo y analisis de resiliencia.
- **Limpieza menor post-ronda**: campos `tab*Activo`/`cambiarTab*` del store y puertos quedaron huérfanos tras L3 (Inspector sin tabs) — candidatos a poda por el dueño de `store/`/`ports/`.
- **Inria Sans 600** no existe como master en `@fontsource` — los pesos 500/600 quedan sintetizados por el navegador (documentado en `main.tsx`).
- Opcional: regenerar la auditoría como **rev3** para confirmar cobertura ≈95%.
- Convertir `docs/manual-simulado-opcloud-capacidades.md` en matriz trazable de cumplimiento Opforja: capacidad → HU/epica → evidencia en codigo/tests/e2e/UI → estado.

## Supuestos

- `app/node_modules` se mantiene localmente (gitignored); los worktrees lo symlinkean.
- El gate mínimo antes de cualquier commit de producto es `cd app && bun run check`; si toca UI/canvas, agregar `bun run design:governance` y el subset Playwright afectado.
- El canvas no es fuente de verdad: el renderer JointJS proyecta el modelo; no se versiona estado de render.

## Riesgos

- **Semantica sociotecnica inicial**: el tratamiento de `ocupado` vs `no-disponible`, aprobaciones humanas, prioridad entre politicas y reintentos de efectos aun es base; debe validarse con modelos reales antes de exponerlo como comportamiento final.
- **Kernel sin persistencia ni UI**: el nuevo runtime existe en `src/modelo/simulacion`, pero todavia no se serializa dentro de `Modelo`, no aparece en inspector/canvas y no se ejecuta desde la barra de simulacion.
- **Ejecucion externa deliberadamente deshabilitada**: los efectos `python/http/mqtt/sql/ros/genai` son descriptores pendientes, no side effects reales. Cualquier conexion futura debe pasar por puertos auditables y permisos explicitos.
- **Instancia pública sin auth**: por decisión del operador se retiró el Basic Auth de Traefik. El endpoint `POST /__deep-opm/bug-reports` (sidecar `bug-capture`, `VITE_ENABLE_BUG_CAPTURE=true`) queda **público y escribe a disco** → riesgo de abuso/llenado. Revertir: re-agregar `opforja-auth@docker` al router + `basicauth.users` en `docker-compose.yml` (hash APR1 para `fsanhuezal`: `$$apr1$$opforja$$08lJpTQlgp0W79vrFxMnR/`) y `docker compose up -d`.
- Worktrees de la ronda quedaron bloqueados por el runtime de agentes (`.claude/worktrees/`); se autolimpian, no forzar.

## Prompt de continuación

> Continúa desde `docs/HANDOFF.md`, sección "Corte actual — Ronda bugs OPM/OPL/OPD 2026-05-26". La tanda de 19 bugs OPM/OPL/OPD quedo cerrada en `main` con verificacion verde local (`bun run check`, `lint`, `build`, `design:governance` y Playwright focal 29/29). Si se retoma producto, priorizar: (1) limpiar las fallas historicas de `browser:smoke` completo no relacionadas con este corte; (2) triar la cola documental de bugs capturados en `docs/bugs/BUG-*` antes de stagearla; (3) continuar brechas diferidas del Tier 1 (visibilidad unidades/alias OPL; D herencia; E condiciones/loops; G sociotecnico). Antes de tocar OPM/OPL leer las SSOT KORA `urn:fxsl:kb:reglas-opm-estrictas-es`, `urn:fxsl:kb:spec-forja-opl-es` y las capas base en `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`; los archivos `docs/canon-opm/*.md` son puentes. Antes de tocar UI/canvas leer `ui-forja/GOVERNANCE.md`. Gate UI: `cd app && bun run check && bun run lint && bun run build && bun run design:governance` + Playwright del layout/canvas afectado. Recordatorio operativo: vite-bg + e2e en paralelo produce flakes (correr e2e con `--workers=1` o apagar el dev server). No stagear cambios ajenos (`docs/auditorias/**`, deletes documentales previos, bug dirs no triados) sin instruccion explicita.
