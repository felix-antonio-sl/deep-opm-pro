# HANDOFF — Estado operativo del modelador OPM

**Fecha**: 2026-06-10 · **Repositorio**: `deep-opm-pro` · **Rama**: `main`
**Corte de producto vigente (2026-06-06)**: persistencia OPM backend-only desplegada con optimistic locking y corte C5 de erradicación de storage navegador ya en producción. Modelos, versiones, workspace/carpetas, recientes, autosave, ownership y revisión viven en Postgres/API; no hay cache, fallback ni recuperación legacy desde storage del navegador.
**Instancia**: `https://opforja.sanixai.com` — **login obligatorio DESPLEGADO 2026-06-10** (auth v1: identidad single-operator, registro cerrado por CLI; ver corte auth/identidad v1 y `docs/deploy/opforja.md` § Cuentas y login). **BLINDAJE EJECUTADO 2026-06-06**: secrets reales rotados, volumen Postgres recreado limpio, **backup diario** `pg_dump` con retención 14d, **rate-limit nginx** por IP real. **Persistencia C1-C5 desplegada 2026-06-06**: backend/API/Postgres son SSOT única.
**Frentes desplegados**: canvas infinito (2026-06-03), mobile solo-lectura v1 (2026-06-06), paneles OPL/Inspector hideables y resizable (2026-06-08). **Migración familia-V→skill**: fase activa de retiro cerrada (V3/V4/V5/V7 + colas `cuando`/`según`); ver § Estado de la migración familia-V→skill.
**Programa integrado**: F0/F1/F2/F3 están en `main` con kernels y UX ad-hoc; simulación Ss queda verde en e2e beta2.

> **Historia completa**: las actualizaciones anteriores a 2026-06-06 están en la historia git.

---

## Actualización 2026-06-14 — paquete-pausa de la auditoría SSOT RESUELTO (panel deliberado + arbitraje del operador → reglas-opm-estrictas-es v1.4.0)

**Mandato**: resolver de forma dialéctica el paquete-pausa de 14 decisiones que la auditoría de coherencia del corpus (2026-06-12) dejó al operador. Skill `consenso-deliberativo`, modo encarnación, panel **dov-dori × polymath/cat-thinking × custodio-kora** (gate de diversidad: se sustituyó opm-specialist por custodio-kora para evitar clones epistémicos). Triaje: 6 hallazgos de tensión conceptual al panel, 6 mecánicos por OK directo, 1 decisión de producto (#24-2) al operador.

**Decisiones arbitradas y materializadas en KORA** (`reglas-opm-estrictas-es` **v1.3.1 → v1.4.0**; bases `opm-iso` 3.0.2 / `opm-visual` 3.0.2 / `opm-opl` 3.0.3; specs `spec-opd` 1.1.1 / `spec-opl` 1.2.1):
- **#12 — Excepción = 6.ª familia de enlace** (`§5.1` familia 4, `R-EXC-1B`; paridad con la invocación V-240). Co-enmiendas base: `opm-iso §Control` (acota «modificador» a evento/condición), `opm-visual §4.4` (excepción = control autónomo). Specs: `spec-opl §5.3` y `spec-opd §4.1`+scope citan la 6.ª familia.
- **#14 — Partición de plantillas OPL**: `§Mapa de familia` declara que reglas conserva las tablas §4/§7.3/§9.2 como gate de validez (R-BI-TAB-1) y spec-opl es dueña de la superficie operativa; desempate: ante divergencia manda reglas.
- **#32 — Abanicos convergentes de habilitadores** (`R-FAN-HAB-1`, AND por defecto): `§7.2/§7.3` + `opm-visual §5.5` + `opm-opl §11.2` admiten N agentes/instrumentos → 1 proceso (derogada la celda «(no aplica)»).
- **#33 — `Pr=p` DEBE + modo «probabilístico sin pesos»**: `§6.8`/`R-FAN-PROB-1` distinguen casos A (con pesos → DEBE) / B (alternativo sin anotar → sin exigencia) / C (declarado sin pesos → estado explícito); procedencia `metod-opm §10.14`; el default uniforme 1/n es regla de simulación, no de modelado. (Único disenso del panel — DEBE vs SHOULD — lo cerró el operador eligiendo DEBE+modo-sin-pesos.)
- **#9/#35/#39 — Ruta sobre habilitadores**: retirada la fila de `§11.2`; `§4.12 R-OPL-RUTA-3` es el domicilio único (canónica-condicionada); `spec-opl` C-25/§8.4 alineados.
- **R-NOM-PROC-1 ampliada** a criterio deverbal del español (no lista cerrada de sufijos; excluye no-verbales); el checker es-CL (B-6) deja de ser divergencia y pasa a realización.
- **Mecánicos**: `§9.2` plantillas exactas (RF2/CX1 con «y»), `§6.5` acotada a recomposición + R-EDIT-8, `R-CONF-7` sin sello fechado, `R-ROT-4`→`SSOT-visual §20.1`, `R-INV-2C` (grupo paralelo), Anexo C agnóstico (sin literales de código ni ref muerta `capa-categorial.md`) con el mapeo regla→gate movido a `docs/roadmap/registro-conformidad-ssot.md`.

**Gate**: `kora check --strict` subtree corpus **37/37** (un fallo transitorio por YAML — `:` en escalar multilínea del `source_base` — detectado y corregido); `kora index` 745 sin error nuevo. **Verificación de contexto fresco (subagente)**: 7/8 OK + 1 defecto MAYOR cazado (`spec-opd §4.1` seguía enumerando «Cinco familias») → corregido, re-verificado 37/37. `reglas-opm-estrictas-es` solo se editó CON arbitraje explícito del operador.

**#24-2 RESUELTO (operador)**: grid de edición **inactiva por defecto** — `app/src/canvas/grid.ts` `GRID_DEFAULT.activa` `true → false`, alineando el código a `ui-forja/08` (`drawGrid:false`); `spec-opd R-OPD-UI-6` ya delegaba el default a ui-forja. El paquete-pausa queda **sin brechas vivas**.

**PUSHEADO Y DESPLEGADO 2026-06-14**: KORA `master` `017dc1b9 → 607b31d4` (reglas v1.4.0 + corpus); deep-opm-pro `main` `230cf86d → 31e564ee` (auditoría + grid default + fix e2e 08-grid). Deploy `docker compose up -d --build`: bundle **`index-Bwwc7F2H.js`** en `opforja.sanixai.com` — contenedores healthy, Postgres preservado (8 días), raíz 200, persistencia 401 sin cookie. **Gate de deploy**: check **2623/0**, build OK, design:governance OK; browser:smoke #1 254✓/20✗(contención: timeouts/«browser closed», 3 verificados verdes en aislamiento)/5 skip + el único fallo real (08-grid, por el cambio de default) **corregido y verificado en aislamiento** (e2e `08-mvp-alpha-residual:57` reescrito al nuevo default). El re-run completo del smoke no cerró por SIGTERM de tarea en background (infra, no fallos — 173+ verdes antes del corte). LECCIÓN: el smoke (~20 min) excede el cap foreground (10 min) ⇒ correr en background SIN `pkill -f playwright` (mata los `playwright-mcp` del harness → exit 144).

## Actualización 2026-06-12 — auditoría de coherencia del corpus SSOT OPM/Forja (64 conflictos remediados; paquete-pausa de 14 al operador)

**Mandato**: auditoría total de coherencia del corpus normativo OPM/Forja (`reglas-opm-estrictas-es` + familia spec-forja + capas base + puentes `docs/canon-opm/` + `ui-forja`) y remediación por cadena de precedencia, editando siempre la capa subordinada. Informe completo: `docs/auditorias/2026-06-12-auditoria-ssot-corpus.md` (matriz de conflictos + paquete-pausa + veredicto).

**Método**: 11 lectores paralelos cruzando el corpus dos a dos y contra `app/src`; un verificador adversarial de contexto fresco por hallazgo; 13 editores por archivo disjunto; verificación de la ola archivo por archivo; 4 lotes de reparación de menores (yo, en el hilo principal, tras tope de sesión de subagentes). **86 hallazgos → 77 confirmados + 1 dudoso + 8 refutados.**

**Remediado (64, en capa subordinada)**: (a) **deriva de registro de GAPs (32)** — `spec-forja-opl-es §20` y `spec-forja-opd-es §22` declaraban abiertos huecos ya cerrados en código por la remediación 06-11/12 (perfiles export, gate densidad, `Pr = p`, badge modificador junto al proceso, TAGGED-ITALIC, reverse jerarquía, fixtures estrictas agregación/generalización); filas → alineado con traza, índices depurados; los GAPs genuinamente abiertos NO se tocaron; (b) **frontera estética/semántica (7)** — `ui-forja/GOVERNANCE.md` (v1.1→1.2) interpone `spec-forja-opd-es` en su cadena de precedencia y acota su alcance a lo no-portador de semántica OPM; `ui-forja/08` reconciliado **por remisión** (no copia) cumpliendo la mitad documental de `R-§25-MIG-2`; colores = canal informativo en GOVERNANCE §2 + `01-design-spec` v1.2; (c) **base↔Forja y método↔base (22)** — R-ENT-3 → extensión declarada, Apéndice A sin agente humano, glosas de ID a espejo del canon, §18 EBNF como delta del Apéndice A base, A2.1 lifteada a R-AG-3/4, manual alineado por cita en ambos shards; (d) **puentes + README (3)** — precedencia corregida, familia de 4 piezas, versiones a frontmatter. `reglas-opm-estrictas-es` **NO se tocó** (intacta, verificado).

**Paquete-pausa (14, requiere operador → custodio-kora)**: enmiendas a la suprema, varias contradicciones internas suyas — cluster ruta-sobre-habilitadores (#9/#35/#39: §4.12 canónica vs §11.2 zona-no-canonizada; lado spec ya listo para alinearse), tabla bisimetría §9.2 (#1), alcance fuerza semántica §5.8↔§6.5 (#3), excepción como 6.ª familia (#12), propiedad de plantillas OPL (#14), Anexo C con identificadores de código (#2/#34), R-CONF-7 con sello fechado (#5), delegaciones sin destino (#6), abanicos convergentes (#32), abanico probabilístico (#33), invocación con grupo paralelo (#36), y **R-NOM-PROC-1 más estrecho que el checker es-CL desplegado** (B-6: acepta Despacho/Ingreso, la regla solo `-ción/-miento`). Decisión de producto: valor por defecto de la grid (#24 parte 2: código `activa=true` vs `08` `drawGrid:false`). Ninguno bloquea el uso del corpus hoy.

**Gates**: `kora check --strict` subtree corpus **37/37**; `kora index` 745 artefactos sin error nuevo; `design:governance` OK. El único `HIGH` del check global de KORA (`urn:kora:kb:guia-rapida-pneuma` roto en `.remember/remember.md`) es ajeno: buffer runtime no versionado, fuera del corpus.

**Estado de esta ola: PUSHEADO Y DESPLEGADO 2026-06-14** (junto con el paquete deliberado — ver entrada 2026-06-14 arriba, que es el cierre autoritativo). Esta ola del 06-12 (corpus en capa subordinada) viajó en los mismos commits: KORA `master` `607b31d4`, deep-opm-pro `main` `b60ca177`. Backlog ajeno al paquete: re-forward completo de la tabla §20 (#71) y realización en código de UIFORJA-08a/b/c (frente #4).

## Actualización 2026-06-12 — corte UX «integridad de modo + silencio cero» (C-1 + M-1/M-2 de la auditoría Jobs)

**Mandato**: ejecutar la recomendación única de `docs/auditorias/2026-06-12-auditoria-ux-jobs.md`. TDD completo:

1. **Ley silencio-cero** (`src/leyes/silencio-readonly.test.ts`): ninguna acción de edición bloqueada por solo-lectura es muda ni miente. `commitModelo` ahora **devuelve boolean** y usa el helper `mensajeBloqueoEdicion` (sim > readOnly > vista derivada — la simulación va primero porque fuerza `readOnly`); mensaje de sim: «Modo simulación: el modelo es de solo lectura. Sal con ⎋ para editar.» La ley cazó **8 flashes mentirosos** (`✓ Enlace/Objeto/Proceso creado`, `✓ Plegado`, `✓ Layout`, `✓ Apariencia ×2`, `✓ Estado/Selección eliminada`) que corrían incondicionales tras un commit rechazado — todos condicionados a `commiteado`.
2. **Modo enlace sellado en solo lectura**: `elegirTipoEnlace` e `iniciarConexionDesdeApariencia` guardan ANTES de encender `modoEnlace` (los targets verdes "conectables" mentían).
3. **Barra contextual sin acciones de edición en solo lectura**: `accionesParaContextoBarra(..., readOnly)` devuelve `[]`. **OJO**: la superficie viva en desktop es `CodexSelectionAnnotation` (el pivot Codex absorbió `BarraHerramientasElemento`, que sigue montado SOLO en mobile editable) — el gate va en ambos.
4. **Escape sale de simulación**: la barra prometía «⎋ salir» pero la cascada de Escape jamás llamó `salirModoSimulacion` (hallazgo en vivo durante la verificación). Añadido al final de la cascada (tras diálogos/modoEnlace, antes de vaciar selección) en `globalShortcutsPort`.
5. **Paleta M-1/M-2**: una sola columna sin truncado de label; con query la lista es **plana** (orden visual = orden de ejecución de ↵); ranking **prefix-first sobre el label** (escribir «abrir» ya no ejecuta «Tabla de Enlaces»); el pseudo-comando Escape («Cerrar modal…») fuera de la paleta. E2e de paleta reconciliados (`command-palette-section-resultados` con query).

**Lección de testing**: el testid real del toast es `flash-toast` — un grep con flag `-r` (replacement) pegado fabricó un `n-toast` fantasma que costó un ciclo de debug e2e. Verificar testids leyendo el componente, no el output de grep.

**Gate**: check **2623/0** (+19: 9 ley, 3 barra, 5 paleta, 2 Escape) · lint · governance OK · build OK · e2e 12-sim **10/10** (+1 C-1 end-to-end: toast visible + barra sin acciones + Escape sale) · paleta 9/9 · `browser:smoke` **274/0/5**.

**Deploy 2026-06-12** (`4eeeaf07`, pusheado): bundle `index-BhNvu9Hn.js` en `opforja.sanixai.com` — contenedores healthy, 200 público, 401 sin cookie, literal «Sal con ⎋» verificado en el chunk servido (`feature-dialogos-pesados-TO6H5_9j.js`; el mensaje vive en ese chunk, no en index — verificar por chunk referenciado, no solo por index).

## Actualización 2026-06-12 — resolución XOR inline en la barra de simulación (cierre del pendiente del backlog 2026-06-11, DESPLEGADO)

**Mandato**: cerrar el pendiente «`resolverRamaSimulacion` (kernel listo) sin UI inline en BarraSimulacion». TDD en 4 capas, dependencias unidireccionales intactas:

1. **Kernel** (`modelo/simulacion/runner.ts`): nueva consulta pura `decisionXorSimulacion(modelo, contexto)` — expone la decisión XOR pendiente del paso actual (`abanicoId`, `procesoId`, `enlaceIds`); `undefined` si no hay abanico de salida, la corrida terminó o se bloqueó. La UI nunca re-implementa la regla "abanico XOR cuyo puerto es el proceso del paso".
2. **Proyección** (`ui/simulacion/proyeccionBarra.ts`): `proyectarDecisionXorSimulacion` rotula cada rama — etiqueta del enlace, o `Entidad: estado` destino como fallback — y adjunta `probabilidad` si la rama la declara.
3. **Store** (`store/simulacion.ts`): acción `resolverRamaSimulacionActual(enlaceId)` — aplica `resolverRamaSimulacion` (el kernel resuelve el paso COMPLETO por la rama elegida), navega al OPD del paso siguiente si cambia, mensaje con la etiqueta de la rama; no-op silencioso si el enlace no es rama del abanico vigente (el kernel devuelve el mismo contexto).
4. **UI** (`BarraSimulacion.tsx` + port): grupo `decidir` en la fila de controles (testids `barra-simulacion-xor`/`-xor-rama`), un botón por rama con sufijo `Pr%` discreto; mismo lenguaje de widget continuo que segmented/seed (border `ruleStrong`, sin radio). Visible solo en avance manual — en autoavance el runner resuelve solo según el modo (determinista = mayor Pr, muestreo = RNG).

**Semántica**: elegir una rama NO es un toggle de política — resuelve ESE paso por esa rama y avanza; al completarse el paso la decisión desaparece. Los modos siguen gobernando el avance no-asistido.

**Lección de test**: el `describe` previo de `store/simulacion.test.ts` deja el store singleton DENTRO del modo simulación; sin `salirModoSimulacion()` en el `beforeEach`, `iniciarModoSimulacion` hace early-return sobre el modelo viejo (refuerza el pendiente "migrar tests de store al factory `crearOpmStore`").

**Gate**: check **2604/0** (+13: 3 kernel, 4 proyección, 2 store, 4 styles) · lint limpio · design:governance OK · build OK · e2e 12 **9/9** (+1: decisión XOR inline end-to-end sobre `modeloAbanicoRutasEstados`).

**Deploy 2026-06-12** (`f008f8d1`, pusheado): bundle `index-Bk_LRzsF.js` en `opforja.sanixai.com` — contenedores healthy, healthz internos ok (web/bug-capture/model-api), 200 público, 401 sin cookie en `/__deep-opm/modelos`, literal `barra-simulacion-xor` verificado en el bundle servido.

## Actualización 2026-06-12 — barrido R-CONF-7 COMPLETO: guards SSOT P3 + unicidad de rol + conformance de export (TODO DESPLEGADO)

**Estado**: el registro de conformidad (`docs/roadmap/registro-conformidad-ssot.md`) quedó **sin programadas ejecutables** — toda regla DEBE está implementada, declarada con gate explícito o enmendada en KORA. Tres cortes cerrados y desplegados en `opforja.sanixai.com` (verificación completa: contenedores healthy, healthz, 200/401):

1. **Guards SSOT P3** (`e586e7e0`): **V-4** R-EXC-1A en la firma — excepción temporal exige manejo ambiental (gatea creación, DSL e import; roundtrip reverse sano: el aplicador crea afiliaciones en fase 1, enlaces en fase 2). **V-5** R-OPD-EST-3 en `crearEnlace` — efecto plano a objeto sin estados rechazado (solo editor; legacy hidrata, checker acusa). **V-6** `esAfiliacionEfectivaAmbiental` (kernel puro) — herencia por cadena de exhibición consumida por el composer. **V-8** `normalizarColoresSvg` preserva alfa <1. 44 fixtures ajustados sin debilitar aserciones; SD Sync/Async corregidos a canónicos.
2. **R-OPD-HAB-4 núcleo editor** (`e7238bd5`): `crearEnlace` rechaza rol doble (R-ROL-UNIC-1) y duplicado exacto. Calibraciones load-bearing: los **derivados del refinamiento no cuentan** como rol declarado (OnStar SD1); **transformador+transformador no se bloquea** en creación (las ramas de abanico se agrupan después — checker nuevo `PAR_TRANSFORMADOR_DUPLICADO` acusa el residual sin abanico); el fixture SD Async ahora **co-aparece** el enlace global por OPD (`coAparecerEnlace`) en vez de duplicarlo; `bug-62ee85` inyecta su degenerado como legacy.
3. **Conformance de export** (`ce690057`): **R-VIS-EXP-5** `ATRIBUTOS_DE_PERFIL` como declaración ejecutable (el filtro la consume). **V-226** defaults declarados por familia. **V-227** `removerChromeEdicionSvg` — los halos de selección y joint-tools YA NO viajan al SVG/PNG exportado (brecha real encontrada en la verificación). **V-235** canal de simulación CONSERVADO deliberadamente (export en sim = snapshot declarado, R-OPD-SIM-6). V-228..V-234 verificadas conformes; veredicto regla por regla en el registro.

**Pendientes (todos gateados, ninguno ejecutable hoy)**: recomposición por fuerza semántica §6.5/§6.6 (R-OPD-REF-13) → con el corte out-zoom/plegado; out-zoom → esperando demanda de modelo productivo; GAPs §22 → frente #4 con agenda propia; residuo menor del export → selector de perfil en el diálogo JSON (kernel listo); vía ontología/tags (decisión HITL #3) → se dispara cuando exista el primer artefacto derivado para terceros (tablero/documento DT, horizonte 1-3 meses de la decisión HITL #2).

**Supuestos**: single-operator estable; la skill `modelamiento-opm`/hd-opm usan la FIRMA (V-4 los gatea ✓ — HODOM no usa excepciones temporales, verificado) pero NO `crearEnlace` (V-5 y R-OPD-HAB-4 no los tocan); el estatuto R-CONF-7 (SSOT v1.3.1) rige toda regla DEBE futura.

**Riesgos**: modelos persistidos en Postgres con excepción de manejo sistémico NO re-hidratarían (R-EXC-1A gatea import — mismo régimen aceptado para modificadores c/e; el único modelo prod es lab-sim-opm-v3, conforme ✓); el guard de unicidad puede sorprender flujos de edición que antes toleraban rol doble (mensaje accionable en ambos casos); `removerChromeEdicionSvg` opera por balanceo de `<g>` sobre string — si JointJS cambiara su serialización, el test lo detecta.

**Gate final**: typecheck estricto · unit **2591/0** · lint limpio · design:governance OK · laboratorio v3 construye y corre completo (sobretiempo desvía al manejador ambiental).

## Actualización 2026-06-11 — delegación de frontera V-37 (gap B.5 CERRADO) + SD canónico del laboratorio (DESPLEGADO)

**Opción 2 ejecutada (mandato operador)**: un paso con `opdHijoId` **DELEGA** sus transiciones y copias de valor a los subprocesos (`runner.ts`; fases del padre = preparación?/proceso). La frontera del SD declara, los hijos realizan — sin doble aplicación. El generador v3 ahora declara la **frontera funcional completa en el SD** (Muestra recibida→validada, Reactivo, Informe borrador→archivado [estado nuevo `archivado`], Registro LIS, efecto Bitácora) — la proyección viva la deriva al hijo y se **reasigna** cada externa a su subproceso semántico (`reanclarEnlaceExternoDerivado`, manual). **Lecciones**: la sync crea derivados DENTRO de la misma operación (capturar enlaces por extremos, NO `ultimoEnlaceId`); reasignar AL FINAL de la construcción; el efecto se deriva a TODOS los internos (consolidar en el realizador y borrar autos — la sync no los recrea si hay manual). `--subir` respeta optimistic locking (manda `revision`).

**Concurrencia**: validado y DESPLEGADO desde **worktree limpio** en `2c4fb71c` (el árbol llevaba WIP activo del operador: guards SSOT P3 — R-OPD-EST-3 duro, R-EXC-1A; reconcilié sus guards en 3 fixtures de test mías). Gate worktree limpio: check **2568/0** · e2e 12 **8/8** · generador 0 avisos, corrida 7 pasos (padre 0 transiciones). Bundle `index-52wonVe5.js`; modelo `lab-sim-opm-v3` re-subido con frontera; sonda prod 0 errores.

## Actualización 2026-06-11 — Laboratorio de simulación OPM v3 (modelo canónico de prueba del motor, SUBIDO A PROD)

**Mandato:** rehacer «Laboratorio complejo de simulacion OPM 2» como modelo canónico que ejercite todo el motor de simulación. Generador versionado: `app/scripts/generar-laboratorio-simulacion.ts` (kernel ops puros → validez por construcción; `--subir` lo guarda en prod vía login del operador). Modelo `lab-sim-opm-v3` **subido y verificado** (19 entidades, 16 estados, 31 enlaces, 2 OPDs, 1 abanico, **0 avisos metodológicos**).

- **Patrones cubiertos**: agente + instrumento HS + evento ET, pares TS anclados a estados, consumible sin estados, condición con bypass (Manejar Demora omitido en flujo feliz; Emitir Informe omitido con veredicto rechazado), XOR con Pr 0.7/0.3 + rutas etiquetadas, in-zoom 5 subprocesos en secuencia vertical + manejador ambiental DENTRO del contorno, excepción sobretiempo estocástica (det=6min<8 no desvía; muestreo sí), invocación con demora, efecto compacto (Bitácora — gap conocido: el par compacto NO transiciona en runtime), designaciones, duraciones, 2 atributos simulables (normal/uniform). Sanidad integrada: corrida determinista 7 pasos con asserts + barrido de semillas (rechazo semilla 8, sobretiempo semilla 1). Verificación visual por render H1.
- **BUG DE PRODUCTO encontrado y corregido**: `definirProbabilidadesAbanico` escribe `probabilidad` en las ramas XOR pero `validarMetadatosEnlace` solo la admitía con modificador evento → **ningún modelo con XOR probabilizado se podía reimportar** (export→import fallaba en `.metadatos`). Fix: Pr=p válida en cualquier procedural (rama de abanico o evento); test de roundtrip `serializacion/abanicoProbabilidades.test.ts`. **DESPLEGADO 2026-06-11** (bundle `index-2YgrXCDd.js`, junto con los perfiles canónicos de export `3a2db18c`): el v3 ya se puede cargar/editar en prod.
- **Lecciones del motor (en el header del script)**: la duración del paso se infiere del estado RESULTANTE de la transición; `descomponerProceso` siembra 3 placeholders (renombrarlos es el camino); el abanico a estados del mismo objeto exige `compartirAnclaExtremosEnlaces` antes de `formarAbanico` (como la acción de UI); frontera padre/hijo: el padre solo porta habilitadores (las transiciones duplicadas se aplicarían dos veces — gap B.5).
- **Forense del modelo viejo**: el dump de hoy 03:30 tenía solo «Laboratorio complejo de simulacion OPM 2» (`d2b85965…`); fue **borrado vía UI a las 17:01** (sesión del operador; mis únicos hits a prod fueron login+POST+GET 17:36 — `POST /modelos` es upsert de uno, no toca otros). Rescatado del backup a `~/backups/opforja/laboratorio-complejo-sim-opm-2-rescatado-20260611.json` por si se quiere reimportar.

**Gate:** check **2562/0** · lint limpio · render H1 de ambos OPDs revisado visualmente.

## Actualización 2026-06-11 — dictamen sobre la propuesta §10 (estereotipos/templates) + 3 decisiones HITL del operador

**Deliberación formal** (consenso-deliberativo, orquestación steipete↔allan-kelly, 3 rondas con verificación contra el árbol vivo) sobre `docs/auditorias/2026-06-11-auditoria-integral-opforja.md` §10. **Veredicto consensuado: la §10 vale como inventario de opciones, no como plan — no ejecutar la matriz §10.4 (~32 días).** La §10.5 (6 principios de diseño) se adopta como **contrato vinculante** para toda extensión futura, con veto por propiedad adicional: **ninguna expansión textual emite estructura de modelo fuera de `autoria/`** (cubre el retiro de `mapearFamiliaV` y cualquier sucesor).

**Decisiones HITL del operador (2026-06-11):**
1. **Estatuto SSOT constitucional-enmendable**: reglas DEBE con tráfico en el ciclo activo = deuda exigible; reglas DEBE sin tráfico se programan o se enmiendan con nota explícita; brecha silenciosa PROHIBIDA. Canonizado como **R-CONF-7** en `reglas-opm-estrictas-es` v1.3.0 (KORA).
2. **Horizonte multi-lector confirmado**: en 1-3 meses terceros (DT/hospital/GOREOS) recibirán artefactos derivados del modelo HODOM ⇒ el perfil `canon-documento` tiene consumidor real con fecha y **sube al corte adoptado**. Multi-cuenta en app sigue diferido (auth v2 cuando exista demanda nombrada).
3. **Clasificación de dominio vía ontología/tags, no estereotipos**: los 7 estereotipos de §10.1.1 quedan **descartados como lote**; explorar primero clasificación consultable barata (completar `OntologiaOrganizacional` parcial o tags livianos sobre el patrón aditivo). Si esa vía se queda corta en lo visual, esa fricción medida justificará (o no) el primer estereotipo real, con un artefacto derivado concreto como eval.

**Dispositivo del catálogo §10**: ADOPTADO → filtro de export por perfil incl. `canon-documento` (subordinando toda ruta de export al gate de perfil — `exportarModeloPdf` no se cablea crudo), completar checkers metodológicos faltantes (sobre los 16+ nativos; no es "port"), resolver colas colgantes `pdf.ts` (eliminar | cablear-subordinado-al-gate) y `diff.ts` (eliminar | marcar no-producto). DIFERIDO → vistas de requisitos, calor de cobertura, panel de métricas como feature, diff como feature. RECHAZADO → `@template` en normalizador, templates W6.7 como catálogo in-app, templates OPD in-canvas, wizard, biblioteca de ejemplos como feature. **Regla de proceso validada empíricamente**: re-auditar el árbol vivo antes de ejecutar cualquier diferido (la §10 quedó parcialmente obsoleta el mismo día por `2766eb74`).

## Actualización 2026-06-11 — tres preocupaciones del operador: efectos sin refinar, reuso de cosas entre OPDs, semántica del avance/animación de simulación

**Mandato:** (1) exceso de efectos nunca refinados a par consumo-resultado es problema estructural de la herramienta; (2) falta mecanismo para que un objeto interno de un in-zoom aparezca como externo en otro diagrama; (3) el avance por fases para donde no debe, "cierre"→"se completa", y la animación debe tener dirección semántica (consumo opuesto a resultado).

1. **Checker `EFECTO_SIN_TRANSICION`** (mejora, un aviso POR ENLACE): acusa cada efecto plano sobre objeto CON estados (sin `estadoEntrada/SalidaId`, sin extremos-estado, sin escisión) y sugiere refinar a TS3-TS5 o escindir en consumo+resultado. Complementa B-4 (objeto sin estados). Accionable: `SeccionExtremos` ya permite apuntar extremos a estados.
2. **`traerEntidadAlOpd`** (`canvas/operacionesBatch.ts`): crea la apariencia de una entidad existente en el OPD destino + apariciones de enlaces con ambos extremos visibles; idempotente. Acción de store `traerCosaAlOpdActivo` (undoable, selecciona al traer) + botón **«Traer aquí»** en cada fila del diálogo Buscar Cosas cuando la entidad no aparece en el OPD activo (`entidadesTraiblesAlOpd` en el viewmodel).
3. **Fases con valor semántico**: `fasesDelPasoSimulacion` omite la preparación VACÍA (solo entra con habilitadores/condición/evento) y el cierre REDUNDANTE (cuando hay fase resultado, ese es el beat final; el efecto del paso se aplica al cerrar la última fase de la lista, mecánica ya genérica). Proceso desnudo: `proceso → completado`. Copy: «Cierre del proceso» → «El proceso se completa», rótulo `cierre`→«completado». El frame "inicio" de foco conserva su quietud (muestra solo preparación aunque la primera fase real sea consumo). **Tokens por fase con dirección semántica**: `tokensDeFaseSimulacion` reemplaza el disparo de todos-los-enlaces-a-la-vez — en consumo viajan los de entrada (efecto en `reverse`: el enlace se dibuja proceso→objeto pero el flujo de consumo va objeto→proceso), en resultado los de salida en `normal`, preparación los habilitadores; proceso/cierre no transportan.

**Detalle clave del avance**: el primer click desde `preparado` **ACTIVA** la fase inicial en vez de saltarla (el frame "inicio" es quieto; sin ese beat, la primera fase real del paso — consumo cuando la preparación vacía se omite — nunca se observaría en ejecución; lo capturó el e2e de tokens visuales).

**Gate:** check **2561/0** (+10: 4 checker, 3 tokens, 2 traer, 1 fases) · lint · governance OK · e2e 12 **8/8** (incl. tokens visuales sin tocar) · `browser:smoke` **272/0/5** (paridad).

## Actualización 2026-06-11 — auditoría integral + remediación de los 5 cortes (evaluada y corregida)

**Auditoría integral en 6 frentes** (capacidades, OPCloud, 5 SSOT, simulación, arquitectura): `docs/auditorias/2026-06-11-auditoria-integral-opforja.md` (síntesis P1/P2 + plan de remediación en 5 cortes). **Remediación implementada** en `58b752e5`+`2766eb74` (operador/Codex) y **evaluada+corregida** por Claude el mismo día:

- **Verificado fiel al plan**: modificadores `c/e` rechazados en kernel (cierra import vía `validarMetadatosEnlace`), `puede estar` exclusivo en parser, aplicador reverse aplica multiplicidad/ruta/condicionanteEstado, AP-04, homogeneidad de etiquetados, `exp/iat` en token de sesión (cookies viejas ⇒ re-login único), `scripts/` en typecheck + import roto corregido, semilla RNG end-to-end con control UI, desvío a proceso de manejo en eventos temporales + gate de invocación, `crearOpmStore()` factory, canal de selección sin `resetCells` (`canalSeleccion: "halo"` + `sincronizarCanalesJointCanvasAdapter`), TAGGED-ITALIC, `Pr = p`, gate de densidad canon-diagrama cableado a `validarModelo`, linealidad con exención XOR, leyes headless opl/serializacion/persistencia + catch-vacíos, jerarquía reverse (`se descompone/despliega en` ⇒ `crear-refinamiento`), notas de mesa en canvas, saneo documental (notas de reconciliación en puentes canon-opm + `ui-forja/08`).
- **3 problemas corregidos por Claude** (mismo ciclo): (1) **regresión de granularidad en `useOpmStore`** — el rewrite usaba el estado completo como snapshot ⇒ TODA mutación re-renderizaba los ~600 consumidores; ahora el snapshot es el valor seleccionado, cacheado por identidad de estado (recompute en render para props frescas, referencia estable bajo `Object.is`); (2) **pérdida silenciosa en `planificarContexto`** — `X se descompone en A y B` creaba el refinamiento descartando los miembros sin aviso ⇒ diagnóstico `info` explícito; (3) **frontera render↛ui sin ley** — nueva ley en `arquitectura.test.ts` con 3 waivers CONGELADOS (zoom.ts→atajosTeclado + 2 tokens) y detector de waivers muertos; + ley canvas↛jointjs.
- **Pendientes anotados (aditivos, no bugs)**: ~~`resolverRamaSimulacion` (kernel listo) sin UI inline en BarraSimulacion~~ (HECHO 2026-06-12, ver entrada propia); `exportarModeloPdf`/`diffModelos`/`resumenParidadBehavioralOpcloud` son embriones sin consumidor de producto (paridad OPCloud = inventario 40 reglas + mapeo parcial 11); profundizar la auditoría de catch silenciosos con cuerpo (la ley cubre solo `catch {}` vacíos); migrar tests de store al factory para matar el flake de aislamiento de raíz.

**Gate:** typecheck estricto (incluye `scripts/`) · unit **2552/0** · lint limpio · `browser:smoke` 271/1/5 en la primera pasada — el único fallo (`mobile-readonly:364` lectura preservada) era **carrera del test, no producto**: la vista diagrama se monta antes de que `cargarLocal` commitee el modelo sembrado y el snapshot ANTES capturaba el modelo vacío (5/5 verde aislado con `--repeat-each`); endurecido `abrirModeloSembrado` con `expect.poll` hasta el commit real.

## Actualización 2026-06-11 — auditoría SSOT del layout canónico: A-1/A-2 + 4 hallazgos propios (LAYOUT_VERSION 3, RE-PIN PENDIENTE)

**Mandato del operador: revisar el layout en profundidad contra las SSOT y remediar/mejorar todo.** Auditoría de `src/autoria/layout.ts` contra `spec-forja-opd-es` §10/§11 (R-OPD-REF-1/2, R-OPD-LAY-1/9) con render H1 como evidencia antes/después (`8b6b7691`):

| Fix | Hallazgo | SSOT |
|---|---|---|
| **A-1** (residuo P1 hd-opm) | objetos internos colgaban del cursor acumulado (ROWH+wrap fantasma, ~130-180px de aire) → ahora del fondo REAL de los subs; muere "contorno > contenido" (SD0-P) | R-OPD-REF-1 |
| **A-2** (residuo P1 hd-opm) | externos enlazados estructuralmente (registro↔asiento) caían en lados opuestos cruzando la elipse → clusterizan mismo lado/estante, líder = miembro con ancla de rol | R-OPD-LAY-1 |
| **N-1** | fila top × columnas laterales de raíz plana podían ocluirse → guard determinista a punto fijo | R-OPD-LAY-1 |
| **N-2** | in-zoom de OBJETO caía a raíz plana sin contenedor → pasa por la rama contenedora (rectángulo, sin línea de tiempo) | R-OPD-REF-1/2 |
| **N-3** | el render inscribe la ELIPSE en el bbox: esquinas del contenido quedaban FUERA de la curva → inflación mínima por factor k de la esquina peor | R-OPD-REF-1 |
| **N-4** | objetos fila-abajo se empacaban desde X0 generando diagonales que cruzaban elipses → se alinean bajo su subproceso ancla | R-OPD-LAY-1 |

**Gate:** suite **2517/0** (+7 tests del motor: contención elíptica, cluster, oclusión, contorno objeto, ancla) · lint · smoke H1 OK · goldens DSL del repo intactos. **`LAYOUT_VERSION 2→3`** (componente del sello).

**RE-PIN DEL GOLDEN hd-opm PENDIENTE** (`docs/roadmap/protocolo-re-pin.md`): checks deterministas PASS; **falta (operador): (2) validación visual en opforja/H1 del HODOM regenerado, (3-4) regeneración y commit del golden en hd-opm** (`bun run scripts/generar-bundle-hodom.ts` — el diff NO será vacío: es el re-pin deliberado, citar este corte). Evidencia visual antes/después enviada al operador (4 PNG).

**Diferidos documentados:** A-3 routing ortogonal para diagonales largas (P3, superficie render); "A-2 para vistas" generic-view banda ancha/baja (candidato hd-opm no formalizado); convergencia motor-bundle ↔ `canvas/layoutSugerido` (D5 del acta de consenso).

## Actualización 2026-06-11 — encargo skill modelamiento-opm: S1 contención in-zoom desde proto + S2 léxico deverbal (RESUELTOS)

**Solicitud upstream de la skill** (`docs/solicitudes-upstream/2026-06-11-contencion-inzoom-proto-skill-modelamiento-opm.md`, hallazgos de su prueba end-to-end del loop M2/H1/H2): **S1 (P1)** `se descompone en` no llenaba `internosInzoom` — todo in-zoom compilado desde proto renderizaba los subprocesos FUERA del contorno (falso positivo LF-19); **S2 (P3)** léxico deverbal sin la familia en `-e` átona.

- **S1 RESUELTO sin re-pin**: el compilador, tras emitir los hechos del OPD hijo, registra los miembros de la lista y emite las agregaciones contorno→miembro que el DSL ya consume como contención (`registrarInternoInzoom`; cero enlaces nuevos en el bundle). El gate de re-pin NO aplicó: fix confinado a `compilar/*`; `layout.ts` y la vía DSL intactos — el golden byte-id hd-opm es la emisión DSL (proto≠fuente golden, F5-V12) y la suite lo defiende. Verificado visual: `PROTO_CAFE` renderiza el in-zoom canónico (subprocesos dentro de la elipse).
- **S2 RESUELTO**: `despliegue/repliegue/desague/deslinde/embarque/desembarque` al léxico curado B-6; guarda adversarial conservada.
- **Hallazgo colateral preexistente (deuda anotada en la solicitud)**: la cola `-ion` de `VERBAL_SUFIJO_RE` (para el inglés `-ing`) da falso negativo (`región` en cola valida el nombre).

**Gate:** check **2508/0** (+12: 4 S1 + 6+2 S2) · lint · `render:headless:smoke` OK. Sin cambio UI (sin governance/smoke browser). La skill no requiere cambio en KORA; resolución escrita en la solicitud.

**Follow-up mismo día (feedback operador, `c59ae86c`): `en esa secuencia` → línea de tiempo del in-zoom.** El marcador A10 se parseaba y descartaba. Cable: `Autor.ordenInzoom` + `secuenciarInternos` → `aplicarLayoutCompleto` (3er param, default vacío) apila cada interno declarado en su propia banda (ISO 19450: eje vertical = tiempo); el compilador conecta `nodo.secuencial`. Bisimetría cerrada (el OPL del bundle reexpresa `en esa secuencia` vía `agruparSubprocesosParalelos`); sin marcador = paralelo vigente (test); goldens DSL byte-idénticos (no declaran orden; 2511/0). Límite conocido: grupos `paralelo A, B` dentro de secuencia (formato G1) sin superficie proto importable.

## Actualización 2026-06-10 — selector de modelos en el shell mobile (DESPLEGADO)

**Reporte del operador post-auth: "en mobile no puedo acceder a laboratorio de simulación".** Causa raíz: NO era regresión de auth — el shell mobile-readonly **nunca tuvo selección de modelo** (su propio comentario delegaba a "la futura capa de tenants/auth"; proyectaba solo el SD vacío de sesión). Auth v1 cerró la identidad; este corte cierra la selección:

- `ui/mobile/seleccionModelos.ts` (helpers puros: `modeloSinContenido`, `debeAutoAbrirModelos`) + `VistaModelosLectura` (lista del tenant, tap ⇒ `cargarLocal` read-only) + tab **Modelos** (primera) en `MobileReadonlyApp` con `listarModelosGuardados()` al montar y **auto-switch** a la lista cuando el modelo de sesión está vacío y hay guardados (sin quitar control si el usuario ya navegó).
- E2E: lane mobile sube a **10/0/2** (+2: auto-abre-y-carga con siembra por API bajo la cookie del contexto; sin-guardados-no-auto-switch). Smoke total **269/0/5**.
- **DESPLEGADO y verificado en prod con la cuenta real del operador** (viewport iPhone): login → lista → tap "Laboratorio complejo de simulacion OPM 2" → diagrama + OPL (36 oraciones), 0 errores.
- ~~HALLAZGO colateral (deuda de test): asserts vacuos `__opmStore`~~ **SANEADO mismo día (`ffdb836d`)**: hook DEV-only `window.__opmTest.exportarModeloActual` (DCE verificado en dist) + 6 asserts endurecidos con guardia anti-vacua (`typeof snapshot === "string"`).
- **Gestos táctiles del canvas en lectura (`ffdb836d`, reporte operador: iPhone sin zoom/pan):** un dedo = pan (scroll del viewport, umbral 6px preserva tap), dos dedos = pinch-zoom anclado (`scaleUniformAtPoint`, clamp ZOOM_MIN/MAX). Cableado SOLO `readonlyMode` (en edición un dedo arrastra elementos). `handlers/gestosTouch.ts` (8 unit) + 3 e2e con TouchEvents sintéticos (incl. no-mutación bajo gestos). Lane mobile **13/0/2**, smoke **272/0/5**. **DESPLEGADO 2026-06-10** (bundle `index-yLPnsGkn.js`): verificado in-vivo en prod con la cuenta real y TouchEvents sintéticos — pinch 1→1.6 (clamp ZOOM_MAX) y pan +80/+80 px de scroll, 0 errores; `__opmTest` ausente del bundle (DCE OK).

## Actualización 2026-06-10 — corte auth/identidad v1: login obligatorio single-operator (DESPLEGADO Y OPERATIVO)

**Spec aprobado por el operador**: `docs/specs/auth-identidad-v1.md` (D1 single-operator · D2 email+password registro cerrado, scrypt `node:crypto` · D3 login obligatorio · D4 auth nativa sobre el handler existente). Plan ejecutado: `docs/superpowers/plans/2026-06-10-auth-identidad-v1.md` (11 tareas TDD inline).

- **Handler compartido** (`src/server/modelPersistence.ts`): endpoints `POST /__deep-opm/auth/login|logout` + gate `requireAuth` (401 sin Set-Cookie en TODA ruta de persistencia — no acuña tenants anónimos); cookie HMAC ampliada `{tenantId,userId,auth:true}` con rotación por nonce y Max-Age 30d; 401 uniforme "Credenciales inválidas" con verificación señuelo (sin oráculo de email ni de timing). Sin `auth` en options el handler es idéntico al previo.
- **Password hashing**: `src/server/passwordHash.ts` — scrypt `node:crypto` (uniforme Bun/Node; `Bun.password`/argon2id descartado porque el middleware Vite puede correr bajo Node). Cero deps nuevas.
- **Postgres** (`scripts/model-persistence-api.ts`): migración **4** `auth_identidad` (tabla `opforja_accounts` + membresía `opforja_account_tenants`, aditiva) + auth repo + gate **fail-closed** (`MODEL_REQUIRE_AUTH !== "false"`).
- **CLI** `bun run auth:cuenta` — `crear <email> [--tenant <id>]` (adopción de tenants anónimos existentes) / `reset` / `listar`; password por stdin. Operación documentada en `docs/deploy/opforja.md` § Cuentas y login.
- **Frontend**: `verificarSesion` al montar App (HALLAZGO: la app no hacía NINGUNA request a `/__deep-opm` en el arranque — el chequeo de sesión ocurría recién en la primera acción de persistencia; verificado con sonda Playwright); estado `requiereLogin` + `PantallaLogin` bloqueante (tokens ui-forja) + comando paleta "Cerrar sesión".
- **Dev/e2e**: dev middleware gana el gate por env `MODEL_REQUIRE_AUTH=true` con cuenta sembrada `dev@opforja.local` (`CUENTA_DEV_AUTH`); lane Playwright `auth` (3er webServer en PORT+2, project propio); chromium/mobile intactos.
- **Rollback**: `MODEL_REQUIRE_AUTH=false` en compose restaura el comportamiento anónimo sin tocar datos.

**Gate:** check **2481/0** · lint · governance · build · smoke **267/0/5** (259 base + 4 anclas W6.4 + 4 auth) · lane auth 4/4.

**DESPLEGADO Y OPERATIVO 2026-06-10** (mandato "procede hasta dejarlo operativo"): migración 4 aplicada (`model_api_migration_applied v4`); gate activo in-vivo (session/modelos sin auth ⇒ 401; healthz público 200); **cuenta del operador creada** (`felixsanhuezaluna@gmail.com`) **con adopción del único tenant con datos** (`tenant-746f6525…`, modelo "Laboratorio complejo de simulacion OPM 2"; los otros 28 tenants eran acuñaciones anónimas vacías); password temporal generada aleatoria en `~/.opforja-operator-credentials` (chmod 600, NO en el repo/chat — resetear con `auth:cuenta reset`). Verificación end-to-end real: login 200 (cookie `Secure HttpOnly SameSite=Lax Max-Age=2592000`) → `/modelos` lista el modelo adoptado → password mala 401 → logout 200 `Max-Age=0`; sonda navegador en prod: `pantalla-login` montada, `canvas-pane` ausente, 0 errores. Bundle `index-CPnVfGxL.js` + chunk `CommandPalette-D_U-04id.js` verificados por literales. **Dos fixes de deploy sobre la marcha:** (1) Dockerfile stage `model-api` no copiaba el CLI (`COPY app/scripts/auth-cuenta.ts`); (2) **nginx no proxyaba `/__deep-opm/auth/*`** (405 desde el estático) → location nuevo en `deploy/nginx.conf` con `limit_req zone=opforja_sesion burst=5`. **El riesgo "instancia pública sin auth" queda CERRADO; gate C3 de W6.1 desbloqueado.**

## Actualización 2026-06-10 — corte W6.4: anclas normativas en el Inspector + vistas

**Cierra la superficie W6 ejecutable sin decisiones HITL** (quedan W6.1 gateado por C3 y W6.2 en re-decisión). Las anclas (W5.1) ya viajaban en serialización, contexto W6.0 y registro [RATIFICAR]; faltaba su proyección por componente. TDD estricto, 4 ciclos:

- **Kernel:** `anclasDe(modelo, target)` en `modelo/anclasNormativas.ts` — consulta unificada por `TargetAncla` (4 niveles: entidad/enlace/opd/modelo), orden estable por id; el consumidor no ramifica por tipo.
- **Presentación:** `ui/inspector/anclasPresentacion.ts` — `formatearReferencia` compone `norma · artículos · sección` (artículos verbatim del proto: la expansión de rangos es presentación, no dato); `etiquetaEstadoAncla` conserva el vocabulario `[RATIFICAR]` del proto para pendientes.
- **UI:** `SeccionAnclas` READ-ONLY (las anclas nacen en el proto y solo transicionan vía re-elicitación; las acciones C1 siguen en el registro modelo-nivel W6.5-b). Montada en: rama entidad, rama enlace, y rama vacía ×2 ("Anclas del modelo" + "Anclas del OPD" activo — los OPDs no se seleccionan en canvas). Ficha: claveProto, chip estado (`vigente` / `[RATIFICAR]` con autoridad·estadoRatificación en title), referencias, nota.
- **Vistas (espejo W6.3):** chip `Anclas N` en el árbol OPD (`tagAnclasOpd` en `arbol/badges.ts`) para OPDs con anclas target `opd`; title enumera las claves.

**Gate:** check **2454/0** (+14) · lint limpio · `design:governance` OK · build OK · `browser:smoke` **259/0/5** (paridad) · **e2e nuevo `33-anclas-inspector.spec.ts` 4/4** (siembra anclas por import JSON y verifica las 3 superficies en navegador real — primera cobertura e2e de anclas).

**DESPLEGADO 2026-06-10** en `https://opforja.sanixai.com` (autorizado por el operador; `docker compose up -d --build`, Postgres preservado 4d). Bundle vigente `assets/index-BXmLgsbK.js`. Verificado in-vivo por literales: "Anclas del modelo"/"Anclas del OPD"/`arbol-tag-anclas`/`inspector-seccion-anclas` presentes; DCE confirmado (`opmRenderHeadless` ausente); raíz/healthz/session 200, contenedores healthy.

## Actualización 2026-06-10 — corte W6.5: notas de mesa + registro [RATIFICAR] (cierre del ciclo de re-elicitación)

**Contexto:** el operador preguntó si podía anotar comentarios sobre diagramas/OPL/componentes en opforja y que viajaran como contexto a la skill — exactamente el territorio W6.5 del acta de equilibrio. Mandato: ejecutar W6.5-a y W6.5-b con autonomía.

- **W6.5-a — notas de mesa (`02d213bd`):** `NotaMesa {id, target (TargetAncla 4 niveles), texto, fecha}` como extensión ADITIVA del `modelo.v0` con estatuto **meta** (V-204, como las anclas): NO emite OPL, NO cuenta como cosa, NO altera `validarModelo`. Distinción de categoría: la `descripcion` dice qué ES la cosa; la nota registra qué se PREGUNTA la mesa (desechable al resolverse, no se fosiliza). Kernel `modelo/notasMesa.ts` + serialización (espejo de anclas; guardia de exhaustividad C-3) + acciones undoables (`commitModelo`) + UI `SeccionNotasMesa` en Inspector (entidad/enlace/rama vacía=modelo) + sección **"## Notas de la mesa"** en el contexto W6.0 con target resuelto por NOMBRE (`nombreExtremo` para enlaces — `ExtremoEnlace` es objeto).
- **W6.5-b — registro [RATIFICAR] tipificado (`daa5cd5d`):** C1 — la app REGISTRA transiciones (`pendiente → anotado-en-mesa → ratificado-con-fuente`, la última EXIGE fuente) en `ancla.ratificacion` (persistido, undoable, no retrocede); el ancla OPM solo pasa a `vigente` vía re-elicitación de la skill. C2 — `construirLogDecisiones` emite **`deep-opm-pro.log-decisiones.v0`** con el formato exacto que el estado `re-elicitar` de la skill v1.6.0 **ya consume** (claveAncla, transición `de/a` fiel al camino recorrido, nivelAutoridad, fecha, `modeloHash`=protoHash del sello; **sin sello el export se bloquea ruidoso**) — NO requirió cambio en KORA. L9 app-side verificada (ancla `vigente` no reaparece ni en pendientes ni en el log). UI: `SeccionRegistroRatificar` en la rama vacía del Inspector (solo visible con pendientes) + comando de paleta "Copiar LogDecisiones v0". La serialización C1 ya existía (W5.2).
- **El ciclo de re-elicitación queda CERRADO de punta a punta:** la mesa anota (notas) y ratifica (registro) → exporta contexto W6.0 + LogDecisiones v0 → la skill re-elicita/aplica → re-emite el bundle (anclas `vigente`) → el registro se limpia solo (L9).

**Lección de sesión:** tests de store que commitean DEBEN resetear `activarReadOnly(false)` al sembrar — el singleton compartido entre archivos puede quedar read-only y `commitModelo` se bloquea silencioso (pasaba aislado, fallaba en suite).

**Gate:** check **2440/0** · lint limpio · `design:governance` OK · build OK (DCE verificado; literales W6.5 presentes en dist) · `browser:smoke` **259/0/5** (paridad exacta).

## Actualización 2026-06-09 — corte W6-α: superficie de integración app↔skill (W6.0 + W6.3 + W6.6)

**Contexto:** con el frente observabilidad (H1+H2+H5) cerrado, el operador delegó la elección del siguiente frente. Análisis: el frente que une los dos ejes pedidos (plataforma OPM general + integración con la skill `modelamiento-opm` para trabajar con el conocedor del dominio) **ya estaba diseñado en el mandato vigente — es W6** (backlog contingencial). Tres de sus piezas tenían el kernel hecho por cortes recientes; se ejecutó el corte W6-α (TDD, autónomo).

- **Fase 0 — reconciliación de spec W6 (`bb245ba3`):** la tabla W6 (06-04) precedía a G2/E-1/H1. Actualizada: W6.0/W6.1 sin glosario (G2 lo eliminó del pipeline), **W6.2 pasa a re-decisión** (panel de glosario no construible como estaba especificado; si se quiere superficie términos↔cosas sería sobre designaciones del proto), W6.3 anota kernel E-1, W6.6 sello 3-comp. Las decisiones rectoras C1-C5 del acta quedan intactas.
- **W6.0 — puente de contexto 1-click (`19d62a00`):** kernel puro `opl/contextoSkill.ts::exportarContextoSkill` (procedencia + pendientes [RATIFICAR] con autoridad/estado + diagnóstico JSON + OPL MD, en un markdown copiable); comando de paleta **"Copiar contexto para la skill"** (sección EXPORTAR); **contador de cruces** `crucesPuenteSkill` en `preferenciasUi` (persiste con el workspace): copiar contexto = cruce app→skill, `importarJson` de modelo CON sello = cruce skill→app (inequívoco: solo el compilador emite sellos). Mensaje "Contexto copiado para la skill (cruce #N)" — observable de g3 (acta equilibrio: "sin contador, g3 es infalsable"; el umbral lo fija el operador).
- **W6.3 — UI de vista derivada (`b8034c47`):** chip **"Vista"** en el árbol OPD para `generic-view` (`tagVistaOpd`, espejo del tag SM; title declara "sin semántica de refinamiento" + "solo lectura" si aplica). El comportamiento read-only **ya venía heredado del kernel** (`opdActivoEsSoloLectura` en `commitModelo` + editability port cubren `generic-view.readOnly`) — solo faltaba la distinción visual.
- **W6.6 — panel de procedencia (`79ee492d`):** la rama vacía del Inspector es el panel modelo-nivel: sello 3-comp + doctrina read-through + **advertencia si el modelo fue editado en la app** tras la emisión (`dirty`) — reporta, no degrada; la verificación real de divergencia corre donde vive el proto (`verify:reproducible`, H2).

**Gate:** check **2410/0** · lint limpio · `design:governance` OK · build OK (DCE headless verificado ausente; features presentes en dist) · `browser:smoke` **259/0/5 skip** (paridad con base saneada).

**DESPLEGADO 2026-06-09** en `https://opforja.sanixai.com` (autorizado por el operador; `docker compose up -d --build`, Postgres preservado 3d). Bundle vigente `assets/index-BqRvacaQ.js`. Verificado in-vivo: raíz/healthz/session 200, contenedores healthy; **W6.0** comando "Copiar contexto para la skill" en chunk `CommandPalette-G5VYL8tc.js` + contador `crucesPuenteSkill` en `feature-dialogos-pesados`; **W6.3** chip Vista y **W6.6** panel procedencia en `index-BqRvacaQ.js`; DCE confirmado (`opmRenderHeadless` ausente de todos los chunks de prod).

**Pendientes W6 restantes:** W6.1 paquete de dominio (gate C3 re-protección, decisión HITL), W6.2 re-decisión post-G2, W6.4 anclas en Inspector (tras W5.1, kernel listo), W6.5 registro [RATIFICAR] tipificado (C1; los 4 `[RATIFICAR]` vivos de HODOM F5-V12 son el primer caso real; exige estado `re-elicitar` en la skill → custodio-kora), W6.7 templates (candidato).

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

**Prompt de continuación (vigente, cierre 2026-06-11/12):** "Retomar `deep-opm-pro`. Leer ANTES `docs/HANDOFF.md` (entradas 2026-06-11/12). La sesión cerró el ciclo auditoría→remediación→producto: **(1) auditoría integral** en 6 frentes (`docs/auditorias/2026-06-11-auditoria-integral-opforja.md`: síntesis P1/P2 + plan de 5 cortes + §10 propositiva — el dictamen deliberativo la fijó como INVENTARIO, no plan); **(2) remediación de los 5 cortes** implementada (operador+Claude) y EVALUADA: 3 correcciones de Claude (granularidad `useOpmStore` con snapshot cacheado, aviso de miembros en reverse, ley render↛ui con waivers congelados) — DESPLEGADO; **(3) tres preocupaciones del operador resueltas**: checker `EFECTO_SIN_TRANSICION` (un aviso POR enlace), `traerEntidadAlOpd`+«Traer aquí» en Buscar Cosas, fases de simulación sin paradas vacías («se completa», primer click ACTIVA la fase inicial, tokens por fase con dirección semántica: efecto en consumo viaja `reverse`) — DESPLEGADO; **(4) Laboratorio de simulación OPM v3** (`lab-sim-opm-v3` en prod; generador `app/scripts/generar-laboratorio-simulacion.ts` con sanidad integrada y `--subir`; el viejo lo borró el operador vía UI 17:01, rescatado en `~/backups/opforja/laboratorio-complejo-sim-opm-2-rescatado-20260611.json`); **(5) delegación de frontera V-37** (gap B.5 CERRADO: paso con `opdHijoId` delega transiciones a los hijos) + SD canónico con frontera completa — DESPLEGADO desde worktree limpio (`2c4fb71c`); **(6) fix reimport XOR probabilizado** (Pr=p válida en procedurales) — DESPLEGADO. El operador cerró en paralelo: guards SSOT P3 (`e586e7e0`: R-OPD-EST-3 duro, R-EXC-1A, V-4/V-5/V-6/V-8), perfiles export canónicos (`3a2db18c`), conformidad R-CONF-7 y dictamen §10. **SUPUESTOS**: golden hd-opm re-pin SIGUE pendiente del operador; password temporal de `~/.opforja-operator-credentials` sin resetear (mi script --subir la usa). **RIESGOS**: sesiones concurrentes en main (validar/desplegar desde worktree limpio si hay WIP ajeno — precedente hoy); cookies pre-exp invalidadas (re-login único ya ocurrido). **Backlog priorizado** (de la auditoría, vivo): cortes 4-5 del plan (bisimetría de jerarquía reverse ya hecha; out-zoom de autoría; ~~resolución de decisiones XOR inline en barra sim~~ HECHA 2026-06-12; diff de modelos; export PDF real; métricas; notas visuales en canvas); paridad `behavioral.rules.ts` OPCloud; tests de store al factory `crearOpmStore`; catch-con-cuerpo silenciosos; W6.1/W6.2; A-3; auth v2; tabla §20 spec-OPL re-correr forward completo."

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

0. **W6 restante (integración app↔skill)** — solo quedan los gateados por decisión: W6.1 paquete de dominio (gate C3 re-protección HITL), W6.2 re-decisión post-G2. **HECHOS:** W6.0/W6.3/W6.6 (corte W6-α 2026-06-09) + W6.5-a/b (2026-06-10) + **W6.4 anclas en Inspector + vistas (corte W6.4, 2026-06-10)** — la superficie W6 ejecutable sin HITL está completa.
1. **Transporte familia-V→skill** — las 12 requiere-decisión (empezar por V12): superficie reverse / emisión estructurada / legacy permanente.
2. **Auth/tenants** — **v1 IMPLEMENTADO 2026-06-10** (identidad durable single-operator, login obligatorio; ver corte auth/identidad v1; deploy coordinado pendiente). Restante para cortes posteriores: invitaciones, roles efectivos (la membresía `opforja_account_tenants` ya existe con `rol`), UI de administración, multiusuario por tenant. Los 2 `test.fixme` mobile ahora son iterables (cuenta sembrada + modelo sembrado en el lane auth).
3. **Solicitud upstream skill modelamiento-opm (2026-06-11)** — `docs/solicitudes-upstream/2026-06-11-contencion-inzoom-proto-skill-modelamiento-opm.md`: **S1 (P1)** `se descompone en` no llena `internosInzoom` → todo in-zoom compilado desde proto renderiza con los subprocesos fuera del contorno (repro: el propio PROTO_CAFE del smoke H1) y `DESCOMPOSICION_SIN_SUBPROCESOS` acusa falso positivo; toca layout → **gateado por re-pin del golden hd-opm** (junto a A-1/A-2). **S2 (P3)** léxico deverbal en `-e` («Despliegue») para `PROCESO_NOMBRE_FORMA_VERBAL`.
4. **GAPs de alineación OPD** — backlog en `docs/roadmap/` §22 de spec-forja-opd-es.
5. **F1.9 responsive canónico** — consolidar 3 anchos en `ui-forja/tokens.css` + refactor de la barra + 2-3 archivos relacionados. Estimado: 1 sesión.
6. **F1.21 barra en mobile-no-readonly** — gatear render en `App.tsx:195`. Estimado: <30 min, blast radius 1 archivo.
7. **F1.22 panel de ayuda con atajo `?`** — overlay de ayuda + atajos del producto. Estimado: 1 sesión, blast radius 1-2 archivos (modal + atajos).
8. **Corte export por perfil + saneo de colas (dictamen §10) — NÚCLEO HECHO 2026-06-11.** `serializacion/perfilesExport.ts` declara los 3 perfiles (R-VIS-EXP-2 CERRADA): `canon-diagrama` (sin notasMesa/ontología/satisfacciones/procedencia), `canon-documento` (recupera satisfacciones+procedencia), `intercambio` (identidad, sin gate). `exportarModeloConPerfil` y `emitirDocumentoCanonico` (portada+métricas+árbol+OPL+procedencia, Markdown determinista) subordinados a `gateDensidadCanonica` — rechazo ruidoso, nunca export degradado. Paleta: comando «Exportar documento canónico (Markdown)» (acción de store con mensaje) y comandos PNG/ZIP deshabilitados si el OPD/modelo está bloqueado por densidad (EXPORT-GATE). Saneo: `pdf.ts` y `diff.ts` ELIMINADOS (colas colgantes; `metricasComplejidad` ganó consumidor real en el documento canónico). Checkers §10.3.1: verificado 6/6 ya cubiertos por nativos (ing→`checkProcesoNombreFormaVerbal`, inzoomed-content→`checkInzoomContenido`, object-name-singular→`checkObjetoNombreSingular`, part-unfold-content→`checkUnfoldContenido`, systemic-main-function→`checkSdSinProcesoPrincipal`, transforming-process→`checkProcesoTransforma`) — la §10.3.1 estaba obsoleta. **Residuo menor**: selector de perfil en el diálogo Importar/Exportar JSON (el export por perfil ya existe en kernel; la paleta/diálogo JSON sigue emitiendo `intercambio`). **Registro de conformidad R-CONF-7** (barrido 2026-06-11): `docs/roadmap/registro-conformidad-ssot.md` — declara programadas R-VIS-EXP-5, R-VIS-EXPORT-1A..1E, R-OPD-HAB-4, V-4/5/6/8, out-zoom y GAPs §22; V-7 queda como enmienda propuesta a `spec-forja-opd-es` §18.2 en KORA (R-CONF-7 precisado en SSOT v1.3.1).

> **Observabilidad del agente (upstream hd-opm) — H1 + H2 + H5 HECHOS 2026-06-09. Frente CERRADO.** **H1** render headless del proto/modelo → PNG+SVG por OPD (`docs/render-headless.md`; corte 1 en `main` `9a88cc1f` + corte 2 skill `modelamiento-opm` v1.6.0 en KORA `f3163e5`). **H2** golden-harness de reproducibilidad: `src/autoria/reproducibilidad.ts` + CLI `bun run verify:reproducible` (`docs/verify-reproducible.md`), reemplaza el `md5sum` manual. **H5** azúcar `aparecerEnlacePorTransicion` en el DSL (`autoria/dsl.ts`): sube el lookup de multi-edge por transición que hd-opm reimplementaba a mano; complementa F1. Herramientas dev/CLI (no desplegadas). Del hilo upstream solo quedan abiertos los mayores con agenda propia (A-1/A-2 re-pin gobernado, B-3/B-5).

## Riesgos activos

- ~~Instancia pública sin auth~~ **CERRADO 2026-06-10**: login obligatorio desplegado (auth v1). Riesgo residual: la password temporal del operador vive en `~/.opforja-operator-credentials` (600) hasta que la resetee.
- Sesiones abiertas antes del deploy de persistencia pueden necesitar recarga.
- `VITE_MOBILE_READONLY` como build flag requiere rebuild/redeploy para rollback.
- F1.21: si el operador entra a un modelo en modo simulación desde un viewport mobile-no-readonly, la barra productiva aparece dentro del shell mobile (UX tensionada, no roto). Documentado arriba.
