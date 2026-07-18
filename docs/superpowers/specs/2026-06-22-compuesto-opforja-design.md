# Compuesto OpForja — diseño gobernante (spec)

**Fecha:** 2026-06-22 · **Estado:** REALIZADO; conserva el contrato arquitectónico del compuesto, no el estado de ejecución.
**Fuente:** deliberación allan-kelly × steipete con gate de rigor cat-thinking (runs `wf_9adcc678` + correcciones `wf_6bf94e6b`); 52 agentes, ~5.5M tokens; cada decisión verificada en código y pasada por el gate categorial.
**Alcance:** este documento conserva el diseño del compuesto. La dirección viva está en `docs/roadmap/roadmap-2026-07-18.md`; el estado, en `docs/handoff-2026-07-18.md`.

---

## 0. Norte — criterio de éxito (el sueño del operador)

El trabajo se considera exitoso cuando opforja, como sistema integrado, ofrece:

1. Un diseño **elegante y consistente**: frontend/UI con componentes e interacciones que se sientan como **guantes de seda** y una UX que se sienta como **telepatía**.
2. La herramienta de modelado **fluida**, ahora con **estereotipos disponibles en vitrinas** de objetos, enlaces y patrones compuestos, listos para incorporar a los modelos.
3. Una **skill** que, invocada en Claude Code u OpenCode, actúa como **facilitador e intermediario**: el conocedor del dominio expresa su conocimiento → se captura en un **intermedio (proto)** → se **despliega automáticamente headless** en opforja para análisis **semántico y sintáctico** → ciclos iterativos con el conocedor del dominio → hasta que pueda **desplegarse en `opforja.sanixai.com`**.
4. En producción: **editar, comentar, simular, persistir, enriquecer, corregir y nutrir** el modelo con los estereotipos existentes; y volver vía skill a **re-craftear** el modelo con el conocedor del dominio, iterando las veces necesarias **hasta un modelo suficiente para las necesidades de las partes interesadas**.

Todo entregable se evalúa contra este norte. Output (código movido) ≠ outcome (el sueño avanza).

---

## 1. Gobernanza y reglas de operación

- **Alcance de kora-pneuma:** SOLO artefactos de conocimiento referenciales **inmutables y de solo lectura** (la SSOT OPM/Forja + familia ICAS). **Toda documentación y artefacto de trabajo de opforja vive en el repo `deep-opm-pro`.** (Corrige la ubicación del manual en D4: el manual y su puente viven en el repo, no en pneuma.)
- **Autoridad y dudas → consenso:** cualquier cuestión de autoridad/propiedad o cualquier duda de diseño se **delega al consenso deliberativo de steipete × allan-kelly**, no al operador. Si no convergen, **arbitra steve-jobs con la skill mente-omega**. La confianza está en su criterio combinado.
- **Modo de trabajo:** autónomo. Paralelizar y delegar a subagentes que encarnan agentes/skills según necesidad. Ante convergencia de múltiples líneas, analizar incrementalmente y **sintetizar solo al final**.
- **Precedencia normativa (inalterada):** `reglas-opm-estrictas-es` > `spec-forja-opd-es` > `ui-forja/GOVERNANCE.md` > implementación. Lo OPM-semántico lo gobierna la SSOT; ui-forja gobierna estética/chrome.
- **Costura de gobierno pneuma:** sobre la SSOT (en pneuma) el compuesto solo **propone** (proceso custodio-kora); sobre app/docs (en el repo) se **escribe**. `R-CONF-7` es el árbitro explícito de la frontera SSOT↔app.

---

## 2. Marco — el super-robot de cinco órganos

**Un robot, no cinco piezas.** Los cinco componentes — (1) SSOT OPM/Forja en kora-pneuma, (2) la app deep-opm-pro, (3) la documentación del repo, (4) la skill `modelamiento-opm`, (5) la metodología/manual integrado — son **cinco representaciones del mismo conocimiento OPM** bajo functores distintos. Lo que los hace *un* robot: un cambio en un órgano **propaga sano a los otros en el mismo corte**, y esa conmutación es **verificable por máquina** — naturalidad O(N) (un testigo central por corte) en vez de coherencia heroica O(N²). **Integración de componentes ≠ federación multi-usuario** (locks/tenants/CRDT/fold = máquina categóricamente distinta, **track diferido**, hard block).

**El cordón umbilical = triángulo de tres testigos que ya existen a medias** — anclaje URN, sello de procedencia, y co-evolución gobernada (`R-CONF-7` + `protocolo-re-pin`). El trabajo es **elevar y conectar**, no inventar infraestructura (sin bus de eventos, sin daemon). *Less is more.*

**Cierre como IMPLICACIÓN, no bicondicional (honestidad impuesta por el gate):** hoy *verde de gate ⟹ las fronteras **testificadas** conmutan*. El bicondicional pleno (*verde ⟺ los 5 órganos coherentes*) es **meta**, no hecho, porque dos fronteras aún no tienen testigo (deploy de skill; `uso-productivo.md`). Declararlo cerrado hoy sería el anti-patrón "loop abierto declarado hecho".

**Owner del Cordón:** accountability **única** del valor del TODO; autoridad de escritura **partida** (propone sobre SSOT/skill, escribe sobre app/docs). **Ley de naturalidad con vector:** frontera + eval + rollback + visibilidad. **Honestidad de coste invariante:** la divergencia se reporta (sello), la brecha se declara (R-CONF-7), el golden se re-pin con bump+ojo humano; nunca se degrada ni se silencia.

---

## 3. Los ocho entregables

### D1 — Refactorización de opforja
- Blindar fronteras internas con **naturalidad + owner nombrado** por frontera.
- Deuda categorial `O(N²)` (coproducto tagged de selección, ~74 archivos; `KindSeleccion` ya existe en `tipos.ts:217`, derivación en `estadoSeleccionDesdeIds`) → pagar a `O(1)` **solo bajo trigger** (4º tipo seleccionable que D6/D7 podrían disparar; el disparo es decisión de valor, no técnica).
- Des-derivar bestia→pneuma por URN (los 4 puentes `docs/canon-opm/` hardcodean `Path:` a `/home/felix/kora/...`); check de existencia por URN que **emite el delta de versión** cuando el URN resuelve más nuevo que el puente.
- Congelar la ley **render↛SSOT** como test falsable (`dependencias-unidireccionales.test.ts`, allowlist congelado, caso negativo de control).
- Split `enlaces.ts → firmas.ts` solo si abarata una decisión futura (no por tamaño). NO tocar el par espejo OPL.
- Orden blast-ascendente con owner por fila; frentes gobernados (puentes, sello) no mergean sin acta.

### D2 — Roadmap reescrito desde 0
- Tres tramos: **C-cordón** / **E-expresión** / **X-exoesqueleto**. Owner del TODO nombrado en **C0** (distinto del owner del super-modelo de la federación diferida).
- Métrica maestra **lead-time-to-validated-value** con registrador (Owner del TODO) + vehículo (`registro-conformidad-ssot.md` extendido + `logDecisiones.ts`) + cadencia (cierre de corte + HANDOFF). NO es gate de CI.
- `output ≠ outcome` elevado a **invariante de corte** (ningún corte se reporta entregado solo por gate verde).
- Jubilar `cortes-operativos.md` + `backlog-contingencial.md`; **extender** `registro-conformidad-ssot.md`. NO jubilar por fiat `UX-EXTERNA`/`EQUILIBRIO` (actas HITL vigentes).

### D3 — Skill `modelamiento-opm`
- Re-sincronizar procedencia (prosa `fuente:`) a las versiones vivas + bump a **v1.10.0**; confirmar (no reescribir) que el cuerpo sigue alineado con la SSOT.
- Añadir bloque **"Límites de la mesa"** (frontera de capacidad: out-zoom/diff/PDF/cosimulación/T1-T4) distinto de "Qué NO hace la app por la skill" (división de labor).
- Check `version-match` (~20 líneas) que vive **en deep-opm-pro** — **NO** es 14º check de ley pneuma (el registro está lleno a 13).

### D4 — Metodología/manual integrado *(ubicación corregida: en el repo)*
- El `manual-opforja` existe vivo (2 shards, v0.2.2). **Se trae al repo** (`docs/`), no a pneuma (regla de alcance). Re-anclar + 2 piezas nuevas (**§A pista-agente**, **§L límites**) + puente por URN.
- `§10` ejemplo end-to-end **NO es golden** (no anclar a HODOM; mantener pedagógicamente abstracto).
- Check `manual:límites` = **no-contradicción** §L ↔ `registro-conformidad-ssot.md` (no "ausencia-en-código").
- Doble pista entrelazada (humano §3-§5 / agente §A) sobre tronco común; el manual es **derivado y delgado** (cita por URN, no copia).

### D5 — Exoesqueleto = super-robot de 5 componentes *(reencuadrado)*
- El cordón = **tres testigos elevados**: (i) **sello a 5 componentes** `{protoHash, autoriaVersion, layoutVersion, doctrinaVersion, skillVersion}` aditivo y rollback-free — **prereq bloqueante:** colapsar la lista duplicada (`procedencia.ts:88` vs `json.ts:344`) a un punto de verdad + corregir el off-by-one del comentario `json.ts:335` ("4"→"3"); (ii) **resolutor URN vivo** des-hardcodeando los 4 Paths (`metodologia:31`, `reglas:30`, `spec-opd:28`, `spec-opl:28`) **con su test en el mismo corte** (el test es el rollback); (iii) **gate version-match** skill↔app como **7ª conjunción** de `gate:refactor`, que **nombra la nave suelta** (greppable, no exit 1 genérico).
- Cierre = **implicación** (no bicondicional). Owner del Cordón, autoridad partida. Escribir los **Intent Contracts** faltantes (SSOT↔skill, skill↔app, docs↔todos, deploy↔SSOT).
- **Federación multi-usuario = track separado y diferido.** Ningún mecanismo de federación entra al cordón.

### D6 — Sistema de estereotipos (≥ OpCloud, 100% opforja)
- Estereotipo = **plantilla de subgrafo OPM** clonada-e-injertada (cosas+enlaces reales; replica `cloneStereotypeToOpd` + `replaceClonedStereotypeToActualThing`), **no** flag/icono.
- `Modelo.estereotipos?` capa **aditiva** (hermana de `anclasNormativas`, excluida de `validarModelo`/conteo OPL/checkers). `Entidad.estereotipo?:'requirement'` → `Entidad.estereotipoId?:Id` con adaptador (no 2º string-union). Migración del `requirement` toca **9 sitios**; `validarEntidades.ts:59` es **cambio de contrato de import** (simétrico a `ordenInzoom`).
- **OPL-invariante v1** (R-VIS-STEREO-1: «Nombre» es PUEDE en OPL, DEBE solo en canvas `<<Nombre>>`). **No** estereotipos de enlace (sería sexta familia encubierta). `Estereotipo.propositoDeModelado?` = owner de valor del catálogo.
- **Vitrinas** (el sueño): galerías de objetos / enlaces / patrones compuestos listos para injertar. Propaga a las 5 partes **en el mismo corte**.

### D7 — Modo light / pizarra de bosquejo
- Capa `Opd.bocetos?` **aditiva, excluida del kernel** (patrón `generic-view`). Captura barro: tirar líneas, fragmentos, cosas varias que **no son (todavía) modelo OPM**.
- Promoción **boceto→modelo** reusa el **rechazo ruidoso** de `validarNombreEntidad` (nunca auto-sufijo silencioso): nombre colisionante **falla sin consumir ni colapsar**. Es el gesto de adecuación instrumentado (quién promovió, contra qué propósito).
- `bocetoSeleccionadoId` en un `PizarraSlice` propio, **fuera del trío sellado** de selección (no dispara la deuda).

### D8 — Sistema de gestión y consistencia de diseño *(DESIGN.md como vehículo)*
- SSOT única de tokens = `ui-forja/tokens.json` (W3C DTCG); `tokens.css`, el bloque canónico de `tokens.ts` y un `DESIGN.md` raíz pasan a **derivados**. Gate `design:governance` de unidireccional → **bidireccional** (`spec:gen --check`, falla con nombre de archivo).
- **Ola A** (valor real, barato, independiente): **versión única** — resolver la deriva viva (`tokens.json` 1.1.0 vs `GOVERNANCE`/`01-design-spec` 1.2) y que el gate **lea la versión de la SSOT** en vez de hardcodearla. Entrega valor solo, sin generador.
- **Ola B** (condicional, solo si Ola A prueba el balance de lead-time): generador `spec:gen` — P2a (`tokens.css` + front-matter `DESIGN.md`, byte-idéntico) → **P2b** (`tokens.ts`) **gateado por un spike de byte-identidad** (si falla, **diferir** y dejar `tokens.ts` como espejo verificado) → P3 gate v2 → P5 Intent Contract con criterio net-positive.
- `DESIGN.md` es **vehículo** para legibilidad-humana + anclaje por la **skill local `design`** (NO el SaaS Claude Design, que tira de su nube vía DesignSync). **Frontera dura:** lo OPM-semántico queda FUERA de `DESIGN.md`. *Seam* de dos escritores en `tokens.ts` = gestionado, no resuelto. Sirve al sueño (consistencia de diseño = guante de seda).

---

## 4. Secuencia de ejecución

- **C0** — nombrar el Owner del TODO + extender `registro-conformidad-ssot.md` (vehículo de la métrica).
- **Tramo C (cordón):** C1 `version-match` + reconocimiento de fronteras + fijar cuál KORA testifica → C2 sello a 5 (con prereqs: colapsar lista duplicada + arreglar off-by-one) → **C3 resolutor URN** atómico con su test (el más frágil, al final). D3/D4 se tejen aquí.
- **Tramo X (D8), en paralelo a C:** Ola A (versión única) → Ola B condicional.
- **Tramo E (expresión):** D6 (estereotipos+vitrinas) y D7 (pizarra) como tests de estrés de la co-evolución, cada uno con gate de filtro de valor.
- **D1** distribuido: la ley render↛SSOT y el des-derivar caen temprano (blast bajo); la deuda `O(N²)` solo si un trigger se dispara.

---

## 5. Decisiones de autoridad — RESUELTAS por consenso (2026-06-22)

Resueltas por consenso **pleno** steipete × allan-kelly (sin necesidad de arbitraje), run `wf_e6cdedc0`, bajo las reglas de §1:

1. **Skill `modelamiento-opm` → fuente autoritativa = pneuma** (es capacidad referencial, no working-artifact). El repo es **consumidor-testigo**: el `version-match` lee la copia **DESPLEGADA** (`~/.claude/skills/.../SKILL.md`) vs una constante `SKILL_VERSION_ESPERADA` pineada en el repo (testificar la fuente dejaría verde un deploy stale = falso verde). **Prereq C1:** el transmutador `_emision/claude-code` de pneuma hoy **borra** el `version` del frontmatter; el corte no cierra hasta que el deploy lo porte (degradación declarada si no se puede tocar pneuma). Bestia 1.8.0 = congelada, no se toca.
2. **`doctrinaVersion` = hash de contenido normalizado (FNV-1a) de las 4 SSOT** (reglas+spec-opd+spec-opl+metodología) resueltas por URN, construido en el **consumidor** (script de emisión), no en el navegador. **Depende duro de (3).** No se sella sin su check reportador de deriva. El semver observado viaja como atributo legible junto al hash. **Prereq:** colapsar la lista del sello (3 sitios + 2 comentarios: `procedencia.ts:88`, `json.ts:344`, `extensiones.ts:143`, off-by-one `json.ts:335`, `reproducibilidad.ts:5`) a un punto de verdad **antes** de añadir el 5º componente.
3. **Mapa URN→path → config de DATOS pura en el repo** (`docs/canon-opm/resolutor-urn.json` + lectora ~15 líneas), **no** delegar a `kora.py` (acoplar el build a un repo hermano = frágil). **El mapa apunta a PNEUMA** (resuelto con evidencia: el régimen-de-ley HITL 2026-06-15 consignado en el frontmatter del SSOT nombra a pneuma como SSOT viva y a la bestia como origen histórico congelado). Path relativo a `KORA_RAIZ` (env, default operador); test acompaña en el mismo corte (existencia + match de `source:`), con SKIP nombrado si la raíz no está montada; el delta de versión se **reporta, no bloquea**.
4. **Manual-opforja → al repo, consolidado en UN archivo** `docs/manual-opforja.md` (los 2 shards estaban fragmentados por límite de tamaño del corpus, no por semántica). **Cita la SSOT por URN, nunca la transcribe** (sería 4ª copia que envejece). Puente inverso (URN del manual → path del repo) añadido al mapa de (3). `§10` no se ancla a HODOM. Los shards de la bestia quedan como rastro congelado (no se borran).
5. **Huecos de autoridad:** (a) eval deploy↔SSOT en dos capas: **a1 versión** cubierta por el `version-match` (reportador, no bloqueante); **a2 semántica diferida** (ojo humano, declarada en R-CONF-7). (b) **Control plane** = artefacto pasivo on-demand `bun run cordon:estado` (~30 líneas) que imprime las 5 versiones y **lista explícitamente las fronteras sin testigo**, consignado por corte en `registro-conformidad-ssot.md` (no daemon, no servicio — federación es hard-block). (c) **Morfismo de `uso-productivo.md` diferido** con trigger explícito (cuando adquiera una afirmación verificable contra la app); hasta entonces el cierre se reporta como **implicación**, con la fila "sin testigo" visible cada corte.

---

## 6. Huecos abiertos (deuda de diseño declarada)

1. Frontera-6 (deploy-de-skill ↔ SSOT): falta el **artefacto** del eval de sincronización.
2. *Seam* de dos escritores en `tokens.ts`: sin testigo que verifique que la capa compat no derivó del bloque canónico.
3. Morfismo de comparación de `uso-productivo.md` (órgano-5): falta definir su formato — mantiene el cierre en implicación.
4. Denominador de la métrica de naturalidad (6 vs 7 fronteras): ambiguo hasta fijar cuál KORA testifica.
5. *Control plane* de visibilidad (versiones de los 5 órganos por corte): sin hogar especificado.
6. Determinismo Bun↔Node del generador `spec:gen` (D8).

---

## 7. Veredicto

**Arquitectónicamente coherente y listo para ejecutar por olas.** Los 8 forman un super-robot de integración-de-representaciones (verificado: D5 teje a D1/D3/D4/D6/D7 sin re-litigarlos; D8 es espina de diseño interna al órgano-3, sin tocar KORA). Su **cierre como organismo** es **meta, no hecho de hoy** — y ningún entregable finge lo contrario. Se procede por olas, cerrando el loop (gate verde + outcome declarado) en cada corte, sin abrir el siguiente sin cerrar el actual.
