# Auditoría de la implementación opforja vs SSOT consolidada v1.4.0 — 2026-06-14

> Mide el código vivo de `app/src` contra el corpus KORA `opm-ssot-es` **consolidado
> a v1.4.0** (reglas-opm-estrictas-es v1.4.0, spec-forja-opl-es v1.2.1,
> spec-forja-opd-es v1.1.1, bases co-enmendadas; working tree de KORA limpio). No
> es la auditoría *del corpus* (esa es `2026-06-12-auditoria-ssot-corpus.md`); es la
> auditoría *de la implementación contra el corpus ya coherente*.
>
> **Vara**: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`. Los
> `docs/canon-opm/` son puentes resumidos; las citas son a la fuente KORA.

## Método

Fan-out de 6 auditores por subsistema (cada uno contra su spec gobernante), con un
refutador adversarial de contexto fresco por hallazgo (Read/Grep/test de primera
mano, mandato de refutar). **9 hallazgos → 8 confirmados + 1 refutado.** El foco
fueron los **deltas v1.4.0** (sexta familia/excepción, abanicos convergentes de
habilitadores, `Pr=p` casos A/B/C) por ser las reglas más nuevas que el código
precede; más un barrido de divergencias silenciosas por subsistema.

| Subsistema | Spec | Hallazgos | Confirmados |
|---|---|---|---|
| `src/modelo`+`src/leyes` | reglas-opm-estrictas-es | 1 | 1 |
| `src/opl/generadores` | spec-forja-opl-es | 1 | 0 (refutado) |
| `src/opl/parser` | spec-forja-opl-es | 2 | 2 |
| `src/render/jointjs`+`src/canvas` | spec-forja-opd-es | 0 | 0 |
| `src/ui`+tokens | ui-forja/GOVERNANCE | 3 | 3 |
| `src/store`+simulación | metodologia-forja-es + lab sim v3 | 2 | 2 |

## Deltas v1.4.0 confirmados CONFORMES (no son brechas)

Verificado de primera mano que el código ya satisface dos de los tres deltas nuevos
— la consolidación alineó la SSOT a lo que el código ya hacía, no exigió cambio:

- **R-EXC-1B (sexta familia / excepción autónoma)**: la excepción es un `TipoEnlace`
  de primera clase (`excepcionSobretiempo|Subtiempo|SubSobretiempo`, `tipos/enlace.ts:14-29`),
  NO un modificador. `validarModificadorEnlace` (`modificadores.ts:202`) **rechaza**
  modificadores `e`/`c`/`NO` sobre excepciones temporales (el «error de categoría» de
  R-EXC-1B ya está enforced). No hay constante «cinco familias» hardcodeada que migrar.
  *Residual menor anotado*: el mensaje/`ssotRef` cita `[AP-01..AP-10]`, no R-EXC-1B; cosmético.
- **R-FAN-HAB-1 (abanicos convergentes de habilitadores)**: `validarUnicidadRolPar`
  (`operaciones/enlaces.ts:1029-1070`) sólo colisiona con `mismoPar` (mismo objeto Y
  mismo proceso); dos agentes/instrumentos distintos al mismo proceso (`A→P`, `B→P`) son
  pares distintos → **permitidos**. `checkParTransformadorDuplicado` opera sólo sobre
  transformadores. Ningún guard rechaza ni acusa habilitadores convergentes (AND).

## Brechas confirmadas (8)

Cada una con LOCALIZADOR (spec § ↔ archivo:línea), severidad ajustada por el
refutador, y veredicto adversarial. El fix va al CÓDIGO en todos los casos.

### A3-1 — MAYOR — Excepción combinada (subtiempo+sobretiempo) rompe la bisimetría

- **Regla**: spec-forja-opl-es §5.3 L889 (variante combinada `… es menor que mín o excede máx.`) + L914 Roundtrip («manejo, fuente, dirección de cota, valor y unidad DEBEN preservarse»); reglas §5.1 familia 4 / R-EXC-1B.
- **Código**: `app/src/opl/parser/parsear.ts:534-557` (sólo `EXCEPCION_SOBRETIEMPO_RE` y `EXCEPCION_SUBTIEMPO_RE`, mutuamente excluyentes); generador correcto en `app/src/opl/generadores/procedural.ts:233-234` (emite la forma combinada).
- **Tipo**: divergencia-silenciosa. El tipo `excepcionSubSobretiempo` es de primera clase (`constantes.ts:6`, creable desde UI) y el forward emite `… es menor que <min> o excede <max>.`, pero el parser no tiene plantilla combinada. Al reimportar, `EXCEPCION_SOBRETIEMPO_RE` matchea con fuente corrupta («Procesar es menor que 30 segundos o»), pierde la cota mínima y produce un `unknown-symbol` engañoso (`planificar.ts:764`). No roundtripea.
- **Veredicto adversarial**: CONFIRMADO con test bun de primera mano — la oración del generador da AST de excepción con fuente corrupta y cota mínima perdida, diagnósticos vacíos. No cerrado en el registro. Fix sólo de código.
- **Fix**: añadir `EXCEPCION_COMBINADA_RE` en `parsearExcepcion`, probada ANTES de las simples; extender el AST de excepción + `planificarExcepcion` para crear `excepcionSubSobretiempo` con ambas cotas. Endurecer `EXCEPCION_SOBRETIEMPO_RE` para que la fuente no atraviese `es menor que`/`o excede`. Roundtrip estricto.

### A5-1 — MAYOR — Borde de OPD activo usa azul-proceso OPM en chrome (viola crimson único)

- **Regla**: ui-forja/GOVERNANCE.md §2 (paleta OPM = canal informativo por clase; selección visual = crimson) + 01-design-spec §3.3 («un solo color de acento UI: crimson, V-203»).
- **Código**: `app/src/ui/biblioteca/ListaBibliotecaCosas.tsx:134` — `opdButtonActive` con `border: 1px solid tokens.colors.canvas.proceso` (#3BC3FF).
- **Tipo**: divergencia-silenciosa. El estado «OPD activo» es de UI, no clase OPM; codificarlo con azul-proceso mezcla el canal de clase con el de estado. Todo el resto del chrome activo usa crimson (`BarraSimulacion.tsx:441/:84`). El gate `design:governance` sólo valida el VALOR de los aliases, no su consumo, por eso pasó. `tokens.test.ts:45` afirma `crimson !== canvas.proceso`.
- **Veredicto adversarial**: CONFIRMADO de primera mano (git blame data la línea a 2026-05-07, previa a la doctrina crimson único). El texto ya es crimson; sólo el borde diverge.
- **Fix**: borde → `tokens.colors.crimson`. Sin tocar texto ni fondo.

### A3-2 — MENOR — Etiqueta de ruta perdida al reimportar transición con modificador condición

- **Regla**: spec-forja-opl-es §11.1 L1855-1856 (Reverse: el parser DEBE asociar `Por ruta <etiqueta>,` al enlace; Roundtrip: `parsear(emitir(ruta)) = ruta`).
- **Código**: `app/src/opl/parser/parsear.ts:193-200` (`aplicarRutaAlAst` sólo enriquece `procedimental` y `evento`; `condicion` cae a `return ast` sin la ruta — comentario auto-confeso L185-188); generador emite el prefijo en `procedural.ts:166`.
- **Tipo**: divergencia-silenciosa (pérdida silenciosa, periférica, no corrompe el modelo nuclear).
- **Veredicto adversarial**: CONFIRMADO — `enlaceAdmiteRuta` (`rutas.ts:35`) es agnóstico al modificador, así que una transición condición-con-ruta es válida; el forward la emite, el reverse la descarta sin diagnóstico. Sin cobertura en `roundtrip.test.ts`.
- **Fix**: en `aplicarRutaAlAst`, propagar `rutaEtiqueta` al enlace base del wrapper `condicion` (análogo a la rama `evento`); roundtrip test.

### A6-2 — MENOR — `definirProbabilidad` acepta Pr=p en evento suelto fuera de abanico (V-18)

- **Regla**: reglas-opm-estrictas-es §11.2 L1397 (Zona no canonizada: «Enlace probabilístico sin fan: `Pr=p` se define solo dentro de abanicos (V-18); fuera no tiene canonicidad») + R-PROB-1/V-18 + R-ZNC-1/2 (silencios de la SSOT) + R-ZNC-COMB-1 (no silenciar lo no-canónico).
- **Código**: `app/src/modelo/modificadores.ts:75-86` (`definirProbabilidad` sólo verifica `modificador === "evento"` y rango; no comprueba pertenencia a abanico). Cableado vía `store/modelo/acciones-enlace.ts:406` ← `InspectorEnlace`/`SeccionMultiplicidad.tsx:72`.
- **Tipo**: divergencia-silenciosa, pero en **zona no canonizada** (silencio, no prohibición).
- **Veredicto adversarial**: CONFIRMADO en las tres capas (kernel/store/UI). NO está cerrado en el registro: el ítem `Pr = p` cerrado corresponde a la relajación de `validarMetadatosEnlace` para el REIMPORT (`6881b37a`), no al setter interactivo. La vía canónica `definirProbabilidadesAbanico` SÍ gatea XOR; el setter de evento suelto no. El lab sim v3 usa sólo la vía canónica (sin regresión).
- **Fix** (respeta R-ZNC: visible, no bloqueante): **checker `PROBABILIDAD_FUERA_DE_ABANICO`** severidad `mejora` que acusa todo enlace con `probabilidad` definida que NO sea rama de un abanico XOR. Hace la no-canonicidad visible sin sobre-legislar el silencio (patrón de `EFECTO_SIN_TRANSICION`/B-2/B-4). `validarMetadatosEnlace` (import) intacto.

### A5-2 — MENOR — Swatches de clase en DialogoBuscarCosas usan paleta canvas legacy

- **Regla**: ui-forja/GOVERNANCE.md §4 (nuevas superficies deben preferir `colors.opm.*` sobre aliases `canvas.*`) + 01-design-spec §3.2.
- **Código**: `app/src/ui/DialogoBuscarCosas.tsx:156-158` — `colorIndicador` retorna `canvas.objeto/proceso/enlace` (#70E483/#3BC3FF/#586D8C) en un diálogo de chrome.
- **Veredicto adversarial**: CONFIRMADO; el caso gemelo ya está migrado en `TablaEnlaces.tsx:559-565` a `colors.opm.*` con comentario explícito. Disciplina de paleta (preferencia soft), no engaño semántico → menor.
- **Fix**: objeto/estado → `colors.opm.object`; proceso → `colors.opm.process`; enlace → `colors.inkMid`. Espejar `TablaEnlaces`.

### A5-3 — MENOR — Fila del Timeline usa `canvas.fill` (#fdffff) en vez de paper

- **Regla**: ui-forja/01-design-spec §3.1 (chrome en escala neutra fría, `--cx-paper #fafaf8`) + GOVERNANCE §4.
- **Código**: `app/src/ui/Timeline.tsx:265` — `background: tokens.colors.canvas.fill` (#fdffff); el contenedor (`:204`) y las filas hermanas (`:311/:320`) usan `paper`. Único outlier de `canvas.fill` en `src/ui`.
- **Veredicto adversarial**: CONFIRMADO; inconsistencia interna del propio componente. Subido de `info` a `menor`.
- **Fix**: `background: tokens.colors.paper`.

### A1-1 / A6-1 — MENOR — Caso C «probabilístico sin pesos» no declarable (capacidad-ausente)

- **Regla**: reglas-opm-estrictas-es §6.8/§7.4 L1100, R-FAN-PROB-1 caso (C): el modelador DEBE poder declarar explícitamente «probabilístico sin pesos» — ni número inventado ni default uniforme silencioso; al simular se asume 1/n (regla de simulación), pero el modelo registra que los pesos quedan pendientes.
- **Código**: `app/src/modelo/tipos/extensiones.ts:233-237` (`DecisionPolicy` = `estado-fijo | uniforme | probabilidades | funcion`; no hay modo «probabilístico-sin-pesos»). Caso B (alternativas ordinarias) y caso C (declarado probabilístico, pesos pendientes) son byte-indistinguibles; ambos caen a `policyUniformeDesdeEnlaces` en `decision.ts:70`.
- **Tipo**: capacidad-ausente. **NO es divergencia silenciosa peligrosa**: el uniforme se computa SÓLO al simular (`runner.ts:181-185`, bajo `modo === "muestreo"`); el store nunca muta el modelo (`iniciarModoSimulacion` fuerza readOnly). Ningún validador/checker escribe `1/n` como hecho. Verificado.
- **Veredicto adversarial** (ambos auditores): CONFIRMADO; ambos recomiendan **declarar PROGRAMADA** (R-CONF-7).
- **Decisión**: **DECLARAR PROGRAMADA** en `docs/roadmap/registro-conformidad-ssot.md`. Es un DEBE condicionado a la intención del modelador, sin modelo productivo que lo demande; implementarlo (variante de coproducto + serialización + UI + OPL + diagnóstico) sería feature especulativa sin consumidor, contra «lo más simple que funcione bien». La declaración R-CONF-7 ES el estado conforme para esta clase (brecha registrada ≠ brecha silenciosa). Destino: corte de simulación cuando exista demanda nombrada.

## Hallazgo refutado (1)

### A2-1 — REFUTADO — El generador emite `Pr=p` sobre enlace procedimental fuera de abanico

- El auditor lo marcó divergencia-silenciosa mayor; el refutador lo **refutó**: spec-forja-opl-es L1547 documenta explícitamente el patrón **emit-and-discard** (`procedural.ts·sufijoProbabilidad` y `abanico.ts` emiten `Pr=p`, el parser lo descarta como anotación de superficie al reconstruir el hecho base). La emisión no rompe el roundtrip del hecho base. No se toca el generador.
- **Propuesta-ssot (no-legislar aquí)**: el propio detalle del refutador señala una **tensión interna de la SSOT** — spec-opl §5.1 L812 tokeniza `Pr=p` como hint de evento y R-COMB-4 L1494 lo lista como marcador de cierre composicional, en tensión con R-FAN-6/C-23/§8.4 («fuera de fan no es canon»). Esto NO se resuelve en código: se eleva como propuesta al custodio-kora. El fix práctico relacionado (hacer visible el Pr-suelto) lo aporta A6-2 (checker), sin tocar el generador ni la SSOT.

## Plan de remediación por olas

| Ola | Brechas | Gate |
|---|---|---|
| 1 — OPL parser (bisimetría) | A3-1 (mayor), A3-2 (menor) | `bun run check` + roundtrip |
| 2 — UI tokens (no-semántico) | A5-1 (mayor), A5-2, A5-3 (menores) | `bun run check` + `design:governance` |
| 3 — kernel checker | A6-2 (menor, checker `mejora`) | `bun run check` |
| 4 — declaración | A1-1/A6-1 (PROGRAMADA en registro R-CONF-7) | doc |

Cierre: verificador de contexto fresco contra este informe + gates; consolidación
en `docs/HANDOFF.md`; poda de lo implementado (la historia git es la red).
