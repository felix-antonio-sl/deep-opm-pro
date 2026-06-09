# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-06-09 · **Repositorio**: `deep-opm-pro` · **Rama**: `main`
**Corte de producto vigente (2026-06-06)**: persistencia OPM backend-only desplegada con optimistic locking y corte C5 de erradicación de storage navegador ya en producción. Modelos, versiones, workspace/carpetas, recientes, autosave, ownership y revisión viven en Postgres/API; no hay cache, fallback ni recuperación legacy desde storage del navegador.
**Instancia**: `https://opforja.sanixai.com` — pública sin auth perimetral. **BLINDAJE EJECUTADO 2026-06-06**: secrets reales rotados, volumen Postgres recreado limpio, **backup diario** `pg_dump` con retención 14d, **rate-limit nginx** por IP real. **Persistencia C1-C5 desplegada 2026-06-06**: backend/API/Postgres son SSOT única. Auth/tenants real sigue pendiente como próximo corte mayor.
**Frentes desplegados**: canvas infinito (2026-06-03), mobile solo-lectura v1 (2026-06-06), paneles OPL/Inspector hideables y resizable (2026-06-08). **Migración familia-V→skill**: fase activa de retiro cerrada (V3/V4/V5/V7 + colas `cuando`/`según`); ver § Estado de la migración familia-V→skill.
**Programa integrado**: F0/F1/F2/F3 están en `main` con kernels y UX ad-hoc; simulación Ss queda verde en e2e beta2.

> **Historia completa**: las actualizaciones anteriores a 2026-06-06 están en la historia git.

---

## Actualización 2026-06-09 — H1 render headless (loop dominio→opforja, primer corte)

**Contexto:** reencuadre del operador del pedido upstream H1. En vez de "exportar imágenes muertas de un bundle", **opforja consume el proto del dominio** y se vuelve espejo **read-through** (el proto sigue siendo fuente única; no hay proto-reverse). Primer corte = **solo la herramienta en deep-opm-pro** (la skill `modelamiento-opm` que orquesta el loop es corte 2, gobernado en KORA).

**Entregado (rama `feat/render-headless-h1`, TDD, modo ship-discipline):**
- `scripts/render-headless.ts` (CLI `bun run render:headless --proto <md>|--modelo <json> --out <dir>`): compila el proto (Node puro: `compilarProto`+`emitirBundle` con `lanzarEnError:false`) y conduce un **Vite efímero + Chromium** para un render **fiel** a opforja. Escribe por OPD `NN-slug.png` (el agente lo VE vía Read) + `NN-slug.svg` (diff estable) + `00-indice.json` + `opl.md`/`reporte.md`/`avisos.json`/`ledger.json`/`procedencia.json`/`conteos.json`.
- `src/render/jointjs/headlessRender.ts` (nuevo): hook `window.__opmRenderHeadless__` (montado en `main.tsx` **solo bajo `VITE_HEADLESS_RENDER`** → DCE lo elimina en prod, **verificado ausente en `dist/`**). Reusa la cadena de export del canvas.
- `src/render/jointjs/mapaExport.ts` (refactor): extraído `conPaperOffscreen`; nueva `exportarOpdOffscreenSvgPng` (SVG+PNG de un solo montaje); `exportarOpdOffscreenPng` delega (regresión cero en la paleta).
- Tests: `headlessRender.test.ts` (camino de error sin DOM) + caso en `mapaExport.test.ts`; smoke E2E `scripts/render-headless-smoke.ts` (`bun run render:headless:smoke`).

**Por qué fiel:** layout de **autoría** (`aplicarLayoutCompleto`, no `layoutSugerido`) + `document.fonts.ready` antes de medir texto. PNG = ver; SVG = diff; byte-identidad se asegura sobre el JSON (eso es H2, próximo frente). Detalle en `docs/render-headless.md`.

**Gate:** `check` 2381/0 · lint limpio · build OK · DCE OK · smoke E2E OK (render del proto-cafe verificado in-vivo, diagrama OPM correcto). **NO desplegado** (herramienta dev). Corte 1 **mergeado a `main`** (`9a88cc1f`, ff).

**Corte 2 (KORA) HECHO 2026-06-09.** La skill `modelamiento-opm` v1.6.0 (KORA, commit `f3163e5`) enchufa el loop: nuevo estado `revisar-visual` (el agente corre `render:headless`, lee PNG+avisos y vuelve a refinar el **proto** read-through) y `serializar-opd` con H1 primario sobre jointjs. Gates KORA: index 745 + check --strict 37/37 + unittest 383 OK; transmutado a claude-code/codex/openclaw/opencode + deployado al runtime `~/.claude/skills/`. **Pendiente (operador):** push de `main` (deep-opm-pro, ahead) y del commit KORA (master local; soy primary).

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

## Actualización 2026-06-09 — solicitud upstream hd-opm: insumos vs. productos (G1 hecho)

Tercera solicitud upstream de hd-opm (`solicitud-upstream-insumos-vs-productos-2026-06-09.md`): distinguir **insumo autoral** (glosario sellado por hash) vs. **producto generado** (OPL, modelo textual), y cerrar las dos affordances a medias. Diagnóstico verificado exacto contra el código (5 claims). Respuesta en `hd-opm/docs/memorias-aprendizajes/respuesta-deep-opm-pro-insumos-vs-productos-2026-06-09.md`.

- **G1 (P1) — HECHO** (`1f4d61ee`): `OpcionesBundle.emitirModeloTextual?: boolean` (opt-in). Con true, `ResultadoBundle` gana `modeloTextual` — markdown derivado (`<!-- DERIVADO — no editar a mano -->` + `# {modelo}` + `## {OPD}`), reusando la función pura `exportarOplModeloMarkdown` (sin tocar store/UI). Opt-in + spread condicional (`exactOptionalPropertyTypes`) ⇒ salidas existentes intactas (**byte-identidad de consumidores preservada**). TDD 2 tests; gate 2377/0. Desbloquea a hd-opm: ya no mantiene el modelo textual a mano (drift imposible).
- **G2 (P2) — RESUELTO por ELIMINACIÓN del glosario** (`98784c1c`): decisión del operador OPUESTA al pedido — en vez de hacer el glosario un insumo consumido, se eliminó por completo. El glosario solo se hasheaba (detector de drift de un doc inerte); las anclas/designaciones ya se compilan del **proto** (fuente única autoral). El sello de procedencia pasó de **4 a 3 componentes** (`{protoHash, autoriaVersion, layoutVersion}`): removidos `InsumosSello.glosarioTexto`, `glosarioHash` (en `construirSello`/`SelloProcedencia`/`json.ts`/reporte), y el script piloto deja de leer glosario. Deserializador **tolerante** a bundles viejos con `glosarioHash` (campo huérfano descartado). TDD, gate 2378/0. **CONTRATO ROTO (autorizado):** hd-opm debe regenerar su golden (sello 3 comp) y dejar de pasar `glosarioTexto` — coordinado en la respuesta upstream. Browser: el cambio en `json.ts` (deserializador tolerante) llega a opforja con deploy; bajo riesgo (opforja no emite procedencia), deploy opcional.
- **G3 (P3) — NO se promueve a la SSOT (decisión del operador, 2026-06-09)**: el pedido era fijar la doctrina «insumos vs. productos» en `metodologia-forja-es`. Declinado: (1) un desliz de implementación del consumidor (hd-opm mantuvo un producto a mano) no se promueve reflejamente a la ley del método; el fix correcto fue **arreglar la herramienta** (G1 genera el producto, G2 retira el insumo inerte), no legislar; (2) el **kernel ya está en la SSOT** — Apéndice F de `metodologia-forja-es`: «exportación = instantánea, no fuente de verdad». Una sección extra citando `emitirBundle`/`construirSello` sería demasiado específica de la herramienta y violaría el invariante de pureza del artefacto (§0.3). KORA NO se tocó. Se exploró vía custodio-kora hasta el draft y se descartó por estas razones. La solicitud upstream queda: **G1 hecho, G2 hecho-por-eliminación, G3 declinado-para-SSOT** (los tres resueltos).

## Actualización 2026-06-09 — saneamiento browser:smoke + backend in-memory dev + 2 bugs de producto

**Estado:** los ~31 fallos preexistentes del `browser:smoke` quedaron resueltos. La suite pasa salvo flakes ya conocidos. En el camino se encontraron y corrigieron **2 bugs reales de producto** (los tests los capturaban correctamente). También se cerró el BUG overscroll-back del canvas (`overscroll-behavior-x: none` en `html`/`body`; `ab0daa81`).

**Causas raíz de los 31 (por cluster):**
- **Cluster A — sin backend de persistencia en dev (14)** (`4bf78bfb`). La persistencia es backend-only desde C5; en prod nginx proxya `/__deep-opm/{session,workspace,modelos}` a `model-api` (Postgres), pero `bun run dev`/`preview` no tenían backend → todo flujo guardar/cargar/workspace fallaba. Fix: middleware vite que monta el MISMO handler de prod (`crearModelPersistenceFetchHandler`) sobre un repo in-memory. Piezas: `src/server/repoMemoria.ts` (extraído del test, fuente única), `src/server/devModelPersistence.ts` (adaptador Request/Response↔Node + `crearCookieSessionResolver` → cada contexto Playwright = tenant aislado, sin contaminación cruzada), wire en `vite.config.ts` (`configureServer`+`configurePreviewServer`; NO afecta prod: no corre en `build`).
- **Aserciones obsoletas (3+4)**: `opl.width>250`→`>200` (default OPL pasó a 240 al ser resizable) y cita SSOT `metodologia-opm-es`→`reglas-opm-estrictas-es` (`e7a2552f`); esencia **combinada** (forma OPCloud `X es un objeto E y A.`, no escindida — commit `59ad3a98` actualizó el generador pero no estos e2e) en 06:302/28/20:11, y copy de simulación `No hay procesos para simular` en 12:91 (`acc99267`).
- **BUG de producto #1 — HaloEstado no aparecía tras click en cápsula (`e40d0f64`)**: el drag de estados marca `data-opm-state-gesture=true` en pointerdown y lo limpia en el `mouseup` de window; en un click sin arrastre JointJS captura el puntero y ese `mouseup` no llega → flag pegado → el guard del halo lo ocultaba permanentemente. Fix: `onElementPointerup` (element:pointerup de JointJS, fiable en click) finaliza el gesto cuando fue click. Verificado in-vivo (sonda) + e2e 15 11/11.
- **BUG de producto #2 — verbo "cambia" del efecto con transición no seleccionable (`4d3b11a9`)**: `verbosPorTipo.efecto` en `refsHints.ts` solo listaba `["afecta","afectan"]`; el efecto TS3 con par de estados verbaliza con "cambia" (como consumo/resultado, que sí lo incluyen) → su token no era verbo interactivo. Fix: añadir "cambia" a `efecto`. Capturado por 07:434.
- **Cluster G — mobile-readonly (7)** (`fc7c2c3e`): el shell solo monta con `VITE_MOBILE_READONLY=true` + viewport mobile, incompatible con la app productiva en un mismo server → el smoke nunca lo activó (suite **nunca verde**, creada sin lane flag-on). Fix: segundo `webServer` en PORT+1 con el flag + project `mobile` (testMatch) con su baseURL; `chromium` lo excluye. Helper `esperarMobileLectura` (el shell no tiene `toolbar-root`/`canvas-pane`) y drag apunta a `mobile-vista-diagrama`. **9/11 verdes**; 2 (`bottom sheet`, `búsqueda no muta`) marcados `test.fixme`: requieren una fixture que siembre un modelo con contenido en el backend readonly (el dev backend arranca vacío y el shell no importa) → `[data-opm-kind=entidad]`/`mobile-busqueda-hit` no existen sin datos.

**Gate:** unit **2388/0** · typecheck estricto · lint limpio · `design:governance` OK · `browser:smoke` saneado (ver flakes abajo).

**Flakes/known residuales del smoke (NO regresiones):** 02/04/05 canvas-sensibles (documentados de antes); simulación (aislamiento por store singleton). El test 28 mantiene `waitForLoadState("networkidle")` para el settling async de la UI (render del panel OPL); pasa en el gate single-run, con flake residual de timing OPL solo bajo `--repeat-each` de estrés (categoría 02/04/05), no del clobber de preferencias (ya endurecido).

**Pendientes derivados — RESUELTOS 2026-06-09:**
- **(2) Hardening del race de bootstrap del workspace — HECHO** (`290bb729`): `fusionarPreferenciasBootstrap` (helper puro, 3 unit tests) da precedencia por clave a las preferencias locales en-sesión sobre las del backend en `sincronizarListadoBackend`, para que el load del workspace no pise cambios de preferencia tempranos. Endurece la ruta real del clobber (el bootstrap); el residual de timing OPL de 28 es ortogonal.
- **(1) Carga de modelo en mobile — DECISIÓN: routing por URL ELIMINADO** (`96b88166`): al investigar el fixture mobile se descubrió que el shell parseaba `/m/:modeloId` pero nunca cargaba ese modelo (solo usaba el OPD; reescribía la URL a `modelo.id`). En vez de completar la carga por URL, **el operador decidió eliminar todo el routing/carga por URL del mobile y sus cascadas de efectos**, dejando solo la **carga directa del modelo ACTIVO de la sesión desde el backend** — porque la selección de qué modelo se ve se asociará a la futura capa de **tenants/auth**, no al path. Ejecutado: borrado `routerMovil.ts`(+test); `MobileReadonlyApp` sin import del router, sin `vistaDesdeRuta`/`VISTAS`, sin los 3 efectos de URL (sync-OPD, rewrite, popstate); `vista` ahora es estado interno. e2e: removidos los tests de parsing/fallback de URL, conservado "desktop no monta" (por viewport) + "vista por defecto = diagrama". Gate: typecheck/lint, unit 2375/0, mobile e2e 8/8. Los **2 `test.fixme`** (bottom-sheet, búsqueda) siguen diferidos: necesitan un modelo con contenido seleccionable, que llegará con **tenants/auth** (ya NO vía URL); secundario, `window.__opmStore` no está expuesto (chequeo de no-mutación no-op). Reactivar al implementar selección de modelo por tenant.

**DESPLEGADO 2026-06-09** en `https://opforja.sanixai.com` (`docker compose up -d --build`, Postgres preservado 3d). Bundle vigente `assets/index-DsYJ9V4y.js`. Verificado in-vivo: raíz/healthz/session 200; `overscroll-behavior-x: none` aplicado en `documentElement`+`body` (fix swipe-back vivo); **mobile sin router** confirmado (viewport 390 → shell mobile, `url` queda en `/`, ya NO reescribe a `/m/modelo-1`); desktop (1440) monta toolbar+panel OPL; sin errores de runtime. Incluye los 3 fixes de producto (overscroll, HaloEstado gesto, OPL verbo "cambia") + hardening del store (bootstrap preferencias) + eliminación del routing mobile. **Pendiente solo:** validación del gesto trackpad macOS (operador) y del halo de estado por tap, in-vivo.

## Actualización 2026-06-09 — solicitud upstream hd-opm: triage + E-1(+F1/F2) + B-4 + B-2 + B-6

**Estado actual:** respondida la solicitud upstream consolidada de hd-opm (18 ítems, 5 áreas) + los dos follow-ups de E-1, verificando cada uno contra el código vivo. Triage en `hd-opm/docs/memorias-aprendizajes/respuesta-deep-opm-pro-2026-06-09.md` (responde a `solicitud-upstream-deep-opm-pro-2026-06-06.md`); follow-ups en `solicitud-upstream-e1-followups-2026-06-09.md`. Ítems ejecutados por TDD y commiteados:
- **E-1** (`14abe8c9`) + **F1/F2** (`663ad8e7`): variante `generic-view` de `OpdVista` — vista ad-hoc sin refinamiento. Tipo en `modelo/tipos/extensiones.ts`; DSL `vistaGenerica(opdKey,{readOnly?})`; serialización `validarOpds.ts`; test `autoria/vista-generica.test.ts`. Excluida de checkers de frontera/descomposición. **Follow-ups que la completan de extremo a extremo:** **F1** = `Autor.aparecerEnlacePorId(opdKey, enlaceId)` — añade aparición de enlace por id (los multi-edges legítimos por transición de estado, p.ej. e-26/e-34/e-369/e-370 de la vista causal P1, son ambiguos para `aparecerEnlace`); mismo contador `ae-<n>`, idempotente. **F2** = el emisor OPL (`generarLineasOpl`) devuelve `[]` para OPD `generic-view` (vista navega/explica, no crea hechos; §243/V-114) → conteo OPL invariante a añadir vista (verificado Δ0 sobre golden HODOM v1.6).
- **B-4** (`22614924`): checker `EFECTO_OBJETO_SIN_ESTADOS` (§3.15) — `modelo/checkers.ts::checkEfectoObjetoSinEstados`, severidad `mejora`. Aceptación: golden HODOM v1.6 → **0** avisos.
- **B-2** (`5ab6be3f`): checker `ENTIDAD_SIN_APARICIONES` — `modelo/checkers.ts::checkEntidadSinApariciones`, severidad `mejora`, en `verificarMetodologia`. Acusa entidad declarada sin apariciones en ningún OPD (no se emite al OPL). Exención declarativa por glosa `[sin-aparicion-deliberada]` (escape-hatch transitorio; el waiver general por código es B-5). Aceptación: entidad desconectada → 1 aviso; golden HODOM v1.6 → **0** (no tenía fantasmas).
- **B-6** (`5ab6be3f`): calibración es-CL de `PROCESO_NOMBRE_FORMA_VERBAL` y `OBJETO_NOMBRE_SINGULAR`. Procesos: léxico de deverbales irregulares (Ingreso/Cierre/Retiro/Traslado…) + sufijos `-ura`/`-ncia`, excluyendo sustantivos no-verbales. Objetos: la singularidad se juzga sobre la **cabeza** nominal (antes del primer conector de/para/según/y/que), no sobre el complemento plural. Golden HODOM: PROCESO 35→**0**, OBJETO 11→**1** (residual `Cuidados de enfermería` = cabeza plural fija de dominio, frontera de waiver B-5).

Gate **2388/0 · typecheck estricto · lint limpio**.

**DESPLEGADO 2026-06-09** en `https://opforja.sanixai.com` (`docker compose up -d --build`; Postgres preservado). Bundle vigente `assets/index-Yvokf931.js` — verificado in-vivo que contiene B-2/B-6/F1/F2 (marcador `[sin-aparicion-deliberada]`, código `ENTIDAD_SIN_APARICIONES`, señales F1/B-6). HTTP 200, healthz OK, persistencia (session/modelos/workspace) operativa. **Nota sobre el gate de deploy:** `browser:smoke` reportó 31 fallos; **probados preexistentes** corriendo el subconjunto crítico (01/11/20/28) contra el baseline `3cf55106` (antes de esta sesión) → **fallan idénticos** (p.ej. spec 11 espera una cita SSOT obsoleta `/metodologia-opm-es|Glos/` fijada el 2026-06-03, código que estos commits no tocan). Cero regresión atribuible; el frente de avisos es kernel headless cubierto por los 2388 unit verdes.

**Decisiones / artefactos:** el triage halló que **gran parte ya estaba resuelta** (B-1, C-1, C-3 hechos; **toda el área D no-issue** — D-1 fue diagnóstico erróneo: el generador NO emite `se describe como`, solo el parser reverse lo acepta). C-2: `aparecerEnlace`/`posicionarEtiqueta` YA están en `dsl.ts` → acción de adopción es de hd-opm (borrar duplicado local).

**Pendientes (orden del operador):** **residuos P1 de layout** A-1 (recalibrar contorno tras wrap de bandas; `envolverBanda` ya existe) y A-2 (anclaje proximidad externo↔externo; `anclasEstructurales` ya hace externo↔interno) — **gateados por byte-identidad del golden hd-opm → exigen re-pin gobernado, no tocar sin protocolo** (ver Riesgos); mayores **L** B-3 (estado-sin-escritor + exenciones LF-19 vía glosa) y B-5 (waiver por código+entidad + UI; subsume la whitelist local de B-2 y el residual `Cuidados de enfermería` de B-6); P3 A-3 (routing ortogonal).

**Quinto hilo upstream — observabilidad del consumidor *agente* (H1-H5, `solicitud-upstream-observabilidad-agente-2026-06-09.md`):** el consumidor headless de la librería `src/autoria` (hd-opm) no sufre ergonomía sino **opacidad** — emite a ciegas, prueba reproducibilidad a mano, no distingue señal de ruido. **H1** (P1, "el bottleneck"): camino headless «bundle JSON → SVG/PNG por OPD, con el mismo layout que opforja produciría», sin UI ni humano (vía recipe Playwright contra el dev server reusando `test-vivo-iterativo-opmkv`, o render desacoplado del DOM); le da ojos al agente y **vuelve iterables A-1/A-2/A-3** (subsume parcialmente su verificación). **H2** (P1): `verificarReproducibilidad(autor, bundleEsperado)`/golden-harness invocable en CI, reemplaza el `md5sum` manual; compone con el sello de procedencia (3 comp tras G2). **H3=C-3** (resuelto) y **H4=B-5** (abierto) — deduplicados. **H5** (P3, menor): azúcar `aparecerEnlacePorTransicion(...)` que complementa F1. Ninguno bloquea a hd-opm hoy.

**Índice único canónico del hilo upstream:** `hd-opm/docs/memorias-aprendizajes/registro-solicitudes-upstream-deep-opm-pro.md` (documento vivo: 24 peticiones, **15 resueltas / 9 abiertas**; supersede las solicitudes individuales). **Adoptado aguas abajo:** G1 → hd-opm `15aea74`; C-2 → hd-opm `e3c6029`. Prioridad recomendada desde hd-opm: `H1 ≫ A-1 ≈ A-2 ≈ H2 > B-5 ≈ B-3 > A-3 ≈ G3 ≈ H5`.

**Supuestos:** B-4 emitido como `mejora`, NO bloqueo (escalable a `validarModelo` cuando el operador lo decida); `generic-view.readOnly` opcional; E-1 es suficiente para que hd-opm construya su vista causal de ingreso P1 (Causal+Requisito+Disponibilidad+Solicitud) sin refinamientos falsos — hd-opm la autora.

**Riesgos:** (1) **concurrencia** — durante E-1 la sesión del operador revirtió `extensiones.ts` y se llevó la variante; se re-aplicó (lección: en cambios de tipo correr `tsc` explícito, no confiar en `bun test` verde que no typechequea). (2) **A-1/A-2 tocan byte-identidad del golden hd-opm** → requieren re-pin gobernado + auditoría visual; no abordarlos sin protocolo. (3) B-4 candidato a bloqueo: si hd-opm tuviera efectos legítimos a objetos que el canon §3.15 no contempla, sobre-acusaría — mitigado por ahora (0 en golden vigente).

**Hallazgos laterales de la sesión (no abordados):**
- **Suite `browser:smoke` — SANEADA 2026-06-09** (los ~31 fallos preexistentes resueltos). Ver § Saneamiento browser:smoke abajo.
- **BUG overscroll-back del canvas — RESUELTO 2026-06-09** (`docs/bugs/BUG-20260609T032249Z-2c59cf`, operador, Mac/Chrome). Causa raíz: el swipe-back de macOS/Chrome se gobierna en el **scroller raíz** (`documentElement`), no en scrollers anidados; el `overscroll-behavior: contain` del canvas (`JointCanvas` `style.viewport`, vigente desde 2026-05-04, desplegado >1 mes) **nunca** lo previno — y `contain`↔`none` son idénticos para la navegación. Fix: `overscroll-behavior-x: none` en `html` y `body` (`app/index.html`); como `body` es `overflow:hidden`, solo desactiva la affordance de navegación sin afectar scrolls internos. Verificado in-vivo (computed style `none` en `documentElement`/`body`); **confirmación final del gesto requiere trackpad macOS (operador)**. Pendiente de deploy. (Se descartó un WIP previo `contain→none` en el div interno del canvas: a ciegas, no atacaba la causa.)
- **`src/autoria/` es librería OPM agnóstica del dominio y reutilizable** (hd-opm es el 2º consumidor vía import path; opforja el 1º). Viaja con `modelo/`+`opl/`+`serializacion/`; no es paquete npm independiente. Para reutilización cross-machine falta empaquetado (extraer esos 4 con `exports`) — corte acotado, no reescritura.

**Prompt de continuación (vigente, cierre 2026-06-09 noche):** "Retomar `deep-opm-pro`. `main == origin/main` (HEAD `6a81250e`), árbol limpio. **Frente upstream hd-opm 'observabilidad del agente' CERRADO y pusheado** (H1+H2+H5): **H1** render headless fiel del proto/modelo → PNG+SVG por OPD (`app/scripts/render-headless.ts` + hook `window.__opmRenderHeadless__` gated `VITE_HEADLESS_RENDER` con DCE en prod + `exportarOpdOffscreenSvgPng`; `bun run render:headless --proto <md>|--modelo <json> --out <dir>`; `docs/render-headless.md`); el loop dominio→opforja vive además en la skill KORA `modelamiento-opm` v1.6.0 (commit KORA `f3163e5`, pusheado) — estado `revisar-visual` + `serializar-opd` H1-primario, **read-through** (el agente corrige el proto, fuente única). **H2** golden-harness de reproducibilidad (`app/src/autoria/reproducibilidad.ts` + `bun run verify:reproducible --proto|--modelo --golden`; reemplaza el `md5sum` manual; `docs/verify-reproducible.md`). **H5** azúcar `aparecerEnlacePorTransicion` en `autoria/dsl.ts` (sube el lookup de multi-edge por transición). Gate: check 2391/0, lint, build, `render:headless:smoke` + `verify:reproducible:smoke` OK, DCE OK. **Pendientes (backlog mayor, sin agenda — orden del operador):** **A-1/A-2** residuos P1 de layout **gateados por byte-identidad del golden hd-opm → re-pin gobernado, NO tocar sin protocolo**; **B-3/B-5** (L: estado-sin-escritor + waiver por código/UI); A-3/G3 (P3); y los frentes propios de §Frentes abiertos (transporte familia-V, auth/tenants, GAPs OPD, F1.9/F1.21/F1.22). **Notas:** `render:headless`/`verify:reproducible` viven en deep-opm-pro/app, los invoca el consumidor (hd-opm) en la misma máquina; empaquetado cross-machine = corte aparte. Render fiel es browser-bound (Vite efímero + Chromium); `emitirBundle({lanzarEnError:false})` para que las advertencias de canon no aborten. Editar la skill KORA: fuente `SKILL.md` → `kora check --strict`+unittest → `kora transmute --target X` → copiar `_BUILD/claude-code/.../` al runtime."

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

## Actualización 2026-06-09 — pendientes concientes UX (ronda 3 del BUG-20260608T171552Z-17477a)

**Estado:** de los 22 hallazgos de la auditoría ux-design (ronda 2), 16 se aplicaron en rondas 2 y 3. **6 quedan diferidos como frentes propios o verificaciones abiertas** porque su blast radius supera el scope del bug 17477a o son falsos positivos de la auditoría. Documentados aquí para que no se pierdan en la historia git.

### F1.9 — Responsive canónico de la barra de simulación (frente propio, prioridad media)

**Hallazgo:** la barra de simulación tiene 5 reglas defensivas (`flex: 1 1 520px` narrativa + `minWidth: 280` + `flexBasis: 100%` + `maxHeight: 90px` + `overflow: hidden`) que se complementan para que la barra se acomode en cualquier ancho. Esto es "responsive por accidente", no por diseño. `s.barraMobile` ya tiene branch dedicado pero entre 768px y el ancho "desktop" no hay un breakpoint intermedio explícito.

**Por qué se difirió (dialéctica):**
- Tesis: 5 reglas defensivas son frágiles. Mejor 3 anchos canónicos con breakpoints claros.
- Antítesis: la barra YA tiene branch mobile (`s.barraMobile`, 48px touch). `useBreakpoint()` ya está cableado. Definir 3 anchos canónicos cruza con `ToolbarBase`, `ToolbarCreacion`, `ToolbarMas` (toolbar productiva) y `MobileReadonlyApp` (shell mobile-readonly) — scope de un frente aparte, no de este bug.
- Síntesis: NO hacer. La barra funciona en todos los viewports actuales (verificado prod, mobile-readonly incluido). El "fragilidad" es teórica, no empírica.

**Trabajo a hacer (cuando se aborde como frente):**
1. Auditar `ui-forja/` y `app/src/ui/` para ver si existe un design token de breakpoints (`--breakpoint-sm/md/lg`) o un hook compartido (más allá de `useBreakpoint()` que ya está cableado).
2. Si existe, usarlo. Si no, **proponer el sistema canónico** en `ui-forja/tokens.css` + `useBreakpoint()`.
3. Definir 3 anchos canónicos: mobile (full, scroll horizontal, controles compactos), tablet (2 filas, controles visibles), desktop (layout actual).
4. Refactorizar `s.barra` / `s.barraMobile` para usar `@media` o `useBreakpoint()` en el render (no en CSS).
5. Validar contra `ToolbarBase` (toolbar productiva) y `MobileReadonlyApp` (shell mobile-readonly) que usan el mismo sistema.
6. Smoke E2E con Playwright en 3 viewports (375px, 834px, 1440px).

**Estimado:** 1 sesión dedicada, blast radius 3-4 archivos, 1 cambio de scope (consolidar breakpoints globales).

### F1.21 — Barra de simulación en shell mobile-no-readonly (verificación abierta)

**Hallazgo:** `app/src/ui/App.tsx` línea 195 renderiza `BarraSimulacion` cuando `contextoWorkbench.modo === "simulacion"` Y `esMobile === true` Y `modoSoloLectura === false`. Esto tensiona el canon: la barra productiva (diseñada para desktop/tablet) aparece dentro del shell mobile, contradiciendo el patrón "mobile-readonly = `MobileReadonlyApp`; resto = `Toolbar` o `BarraSimulacion`".

**Trabajo a hacer (frente pequeño, 1 archivo):**
1. Confirmar en prod con el dev server (mobile viewport, sin mobile-readonly) si la barra aparece.
2. Si aparece, gatear el render con `useBreakpoint()` para que la barra sólo se monte en desktop/tablet. Alternativamente, agregar un guard `modoSoloLectura` al render de la línea 195 (paridad con el `MobileReadonlyApp` que NO la incluye).
3. Validar E2E con `22-responsive-review.spec.ts` y `mobile-readonly.spec.ts`.

**Blast radius:** 1 archivo (`App.tsx`). Riesgo: bajo.

### F1.22 — Panel de ayuda con atajo `?` (frente propio, prioridad baja)

**Hallazgo:** la ronda 2 agregó atajos inline al status `[P] reproducir · [⎋] salir`. Los demás atajos (`paso`, `correr`, `reiniciar`, `headless`/`rápido`, segmented) se descubren leyendo los labels. Un panel `?` con descripción de cada botón mejoraría descubribilidad para usuarios nuevos.

**Por qué se difirió:**
- Tesis: 80% de los usuarios descubren los labels leyéndolos. El 20% que busca atajos los ve en el status. Los atajos restantes están en los `title` de los botones.
- Antítesis: la barra YA muestra los 6 controles con labels visibles. Un panel `?` implica UI nueva (overlay, estado global, focus trap).
- Síntesis: NO hacer en este bug. Suficiente con los labels + atajos del status.

**Trabajo a hacer (cuando se aborde como frente):**
1. Agregar atajo `?` que abra un overlay de ayuda.
2. Listar todos los atajos del producto (no sólo los de la barra) en una sola superficie.
3. Pattern de marginalia al pie de la oración (canon §2: "Tooltip flotante con caret → usar marginalia al pie de la oración OPL").

---

## Frentes abiertos (orden sugerido)

1. **Transporte familia-V→skill** — las 12 requiere-decisión (empezar por V12): superficie reverse / emisión estructurada / legacy permanente.
2. **Auth/tenants real** — identidad, login, administración de tenants, invitaciones/roles, ownership compuesto.
3. **GAPs de alineación OPD** — backlog en `docs/roadmap/` §22 de spec-forja-opd-es.
4. **F1.9 responsive canónico** — consolidar 3 anchos en `ui-forja/tokens.css` + refactor de la barra + 2-3 archivos relacionados. Estimado: 1 sesión.
5. **F1.21 barra en mobile-no-readonly** — gatear render en `App.tsx:195`. Estimado: <30 min, blast radius 1 archivo.
6. **F1.22 panel de ayuda con atajo `?`** — overlay de ayuda + atajos del producto. Estimado: 1 sesión, blast radius 1-2 archivos (modal + atajos).

> **Observabilidad del agente (upstream hd-opm) — H1 + H2 + H5 HECHOS 2026-06-09. Frente CERRADO.** **H1** render headless del proto/modelo → PNG+SVG por OPD (`docs/render-headless.md`; corte 1 en `main` `9a88cc1f` + corte 2 skill `modelamiento-opm` v1.6.0 en KORA `f3163e5`). **H2** golden-harness de reproducibilidad: `src/autoria/reproducibilidad.ts` + CLI `bun run verify:reproducible` (`docs/verify-reproducible.md`), reemplaza el `md5sum` manual. **H5** azúcar `aparecerEnlacePorTransicion` en el DSL (`autoria/dsl.ts`): sube el lookup de multi-edge por transición que hd-opm reimplementaba a mano; complementa F1. Herramientas dev/CLI (no desplegadas). Del hilo upstream solo quedan abiertos los mayores con agenda propia (A-1/A-2 re-pin gobernado, B-3/B-5).

## Riesgos activos

- Instancia pública sin auth perimetral (decisión del operador, blindaje ejecutado).
- Sesiones abiertas antes del deploy de persistencia pueden necesitar recarga.
- `VITE_MOBILE_READONLY` como build flag requiere rebuild/redeploy para rollback.
- F1.21: si el operador entra a un modelo en modo simulación desde un viewport mobile-no-readonly, la barra productiva aparece dentro del shell mobile (UX tensionada, no roto). Documentado arriba.
