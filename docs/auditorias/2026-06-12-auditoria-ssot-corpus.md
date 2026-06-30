# Auditoría de coherencia del corpus SSOT OPM/Forja — 2026-06-12

> **Actualización 2026-06-14 — paquete-pausa RESUELTO.** Los 6 hallazgos de tensión conceptual se deliberaron en panel encarnado (dov-dori × polymath/cat-thinking × custodio-kora) y el operador arbitró el cuadro completo; los 6 mecánicos se aplicaron con su visto bueno. Todo se materializó en KORA: `reglas-opm-estrictas-es` **v1.4.0** (sexta familia de enlace — excepción procedimental), capas base (`opm-iso` 3.0.2, `opm-visual` 3.0.2, `opm-opl` 3.0.3) y specs (`spec-opd` 1.1.1, `spec-opl` 1.2.1) co-enmendadas; mapeo del Anexo C movido al registro de conformidad. Gate: `kora check --strict` subtree corpus **37/37**; verificación de contexto fresco 8/8 (cazó y se corrigió un residuo «cinco familias» en `spec-opd §4.1`). Única brecha viva del paquete: **#24-2** (valor por defecto de la grid — decisión de producto). Detalle en `docs/roadmap/registro-conformidad-ssot.md` §«Enmienda del corpus 2026-06-14».

## Resultado

El corpus quedó coherente en todo lo que se puede arbitrar editando capas subordinadas, y la autoridad suprema (`reglas-opm-estrictas-es`) no se tocó. La auditoría leyó las doce piezas del corpus KORA `opm-ssot-es`, los cuatro puentes locales `docs/canon-opm/` y `ui-forja/GOVERNANCE.md`+`08`, cruzándolas dos a dos y contra el código vivo de `app/src`. Se levantaron 86 hallazgos; un verificador adversarial de contexto fresco confirmó 78 (77 conflictos reales más un caso que depende de una decisión de producto) y refutó 8 por falsa equivalencia o por estar ya resueltos en otra sección.

De los 78 confirmados, **64 se remediaron en esta sesión** editando siempre la capa subordinada por la cadena de precedencia, y una ola de verificación de contexto fresco revisó cada edición archivo por archivo. Los **14 restantes forman un paquete que requiere tu decisión**: o tocan `reglas-opm-estrictas-es` (que no edito sin tu visto bueno, por ser la autoridad suprema y por tratarse en varios casos de contradicciones internas suyas), o son decisiones de producto que no me corresponden. Ninguno de esos 14 bloquea el uso del corpus hoy; son deuda de precisión, no fallas que impidan modelar.

El grueso de lo remediado (32 de 64) era **deriva de registro**: las tablas de GAPs (§20 de spec-OPL y §22 de spec-OPD) seguían declarando abiertos varios huecos que la remediación de los días 2026-06-11 y 2026-06-12 ya había cerrado en código (perfiles de export, gate de densidad, `Pr = p`, badge del modificador junto al proceso, itálica del tagged, reverse de jerarquía, fixtures estrictas). El segundo bloque grande fue la **frontera estética/semántica**: `ui-forja/GOVERNANCE.md` nunca se había actualizado tras la publicación de `spec-forja-opd-es` y seguía reclamando autoridad plena sobre apariencia JointJS; `ui-forja/08` aún prescribía como reglas duras las tres derogaciones que `spec-forja-opd-es §22` ya había registrado. Ambos se subordinaron por remisión, cumpliendo la mitad documental de `R-§25-MIG-2`.

Gates al cierre: `kora check --strict` sobre el subtree del corpus **37/37**; `kora index` reindexa los 745 artefactos sin error nuevo; `design:governance` de `deep-opm-pro` **OK**. El único `HIGH` del check global de KORA (`urn:kora:kb:guia-rapida-pneuma` roto en `.remember/remember.md`) es ajeno: vive en tu buffer de memoria runtime, que no está versionado ni forma parte del corpus.

---

## Método y alcance

| Fase | Cómo | Resultado |
|---|---|---|
| Lectura cruzada | 11 lectores paralelos, un par de specs cada uno (reglas interna, OPL/OPD/visual/semántica base ↔ Forja, método base ↔ Forja, manual+categorial, GAPs §20, GAPs §22, puentes) | 86 hallazgos en 6 dimensiones |
| Verificación adversarial | Un refutador de contexto fresco por hallazgo, con mandato de refutar y evidencia de primera mano (`archivo:línea`, Grep sobre código) | 77 confirmados, 1 dudoso, 8 refutados |
| Edición | 13 editores por archivo disjunto + poda de puentes; cada edición siguió la `remediacionAjustada` del verificador (que manda sobre la del lector) | 64 confirmados aplicados en capa subordinada |
| Verificación de la ola | Un verificador de contexto fresco por archivo, contra el brief original y la cadena de precedencia, mirando el diff real | 13/13 OK, 0 bloqueantes; 24 observaciones menores |
| Reparación de menores | Cuatro lotes (R1–R4) sobre los residuos que la verificación de la ola detectó | corpus de vuelta a 37/37 |

Cadena de precedencia aplicada: `reglas-opm-estrictas-es` (validez, suprema) > `metodologia-forja-es` (método) > `spec-forja-opd-es` / `spec-forja-opl-es` (visual / textual) > `ui-forja` (estética/chrome, subordinada a spec-OPD en lo semántico-visual) > capas base OPM (procedencia general; la divergencia deliberada de Forja se declara como extensión) > `opm-categorial-es` y `manual-opforja-es` (explican y enseñan, no legislan).

Regla editorial de oro del corpus respetada en cada edición: cada regla vive una sola vez en su capa propietaria; al alinear texto divergente se prefirió la cita o referencia antes que la re-redacción.

---

## Matriz de conflictos — remediados (64)

### Deriva de registro de GAPs (32) — tablas que mentían sobre el código vigente

`spec-forja-opl-es §20` y `spec-forja-opd-es §22` son, por su propia regla rectora (`R-§20-AUD-1` / `R-OPD-AUD-1`), el punto de partida de la auditoría de alineación spec↔código. Varias filas declaraban abiertos huecos ya cerrados, de modo que un agente que confiara en ellas habría reimplementado lo existente o reintroducido formas obsoletas (`N%` en vez de `Pr = p`, badge en `distance:0.5`).

| # | GAP / fila | Estado real (evidencia) | Acción |
|---|---|---|---|
| #72 | GAP-OPD-PERFIL-EXPORT (spec-OPD §1/§21/§22) | `serializacion/perfilesExport.ts` declara los 3 perfiles; cerrado `3a2db18c` | fila → alineado; índice depurado |
| #73 | GAP-OPD-EXPORT-GATE (§11/§22) | `gateDensidadCanonica` subordina export en triple superficie | fila → alineado; índice depurado |
| #74 | GAP-OPD-TAGGED-ITALIC (§7/§22) | `etiquetaTextoTagged` con `fontStyle:"italic"` (`58b752e5`) | fila → alineado; índice depurado |
| #75 | GAP-OPD-PROB-NOTACION (§6/§22) | `textoProbabilidad` emite `Pr = p` (`2766eb74`) | fila → alineado; §6 corregido |
| #76 | GAP-OPD-POS-MODIFICADOR (§6/§22) | `distanciaProcesoParaModificador` 0.8/0.2 junto al proceso | fila → alineado; residual estrecho anotado |
| #77 | GAP-OPD-VERIFY grid en export (§22) | grid es chrome DOM fuera del `<svg>`; V-227 verificada | fila → alineado |
| #78 | GAP-OPD-VERIFY current serializado (§3/§22) | `estadosDesignaciones.ts` + `validarEstados.ts` + round-trip | fila → alineado; §3 coherente |
| #79 | GAP-OPD-CATEGORIAS-OPD (§10/§22) | `Opd.vista` (3 kinds) + `padreId` | realización actualizada; residuo (jerárquico implícito, Mapa del Sistema) anotado |
| #80 | GAP-OPD-SUBMODELO-REF (§10/§22) | referencia por snapshot con `syncState` además de fusión | realización ampliada; GAP (referencia viva) sigue abierto |
| #65 | GAP-CX-PARSER (spec-OPL §7.1/§20) | reverse jerarquía `crear-refinamiento`; `opl-reverse.test.ts` | parcial-cerrado con residual nombrado |
| #66 | GAP-FIXTURE-AGREGACION (§6.1/§20) | `enlace-estructural-agregacion` (estricta) | cerrado |
| #67 | GAP-FIXTURE-GENERALIZACION (§6.3/§20) | `enlace-estructural-generalizacion` (estricta) | cerrado |
| #68 | GAP-VERIFY ruta/click/mutación (§11/§15/§20) | `RUTA_PREFIJO_RE` + `definirRutaEtiqueta`; `referenciaEnlaceEspecifico` | cerrado con confirmaciones |
| #69 | GAP-ABANICO-AGENTE-PARSE (§4.x/§20) | `ABANICO_VERBO_RE_LIST` cubre instrumento e inversos | cerrado/reclasificado |
| #70 | GAP-PLIEGA texto (§7.2/§20) | el parser reconoce `se pliega en` con warning; falta generador/reverse | texto corregido, GAP sigue abierto |
| #46 | GAP-PLACEHOLDER-ENTIDAD doble estado (§2.1 vs §20) | supresión de procesos vía `entidadOplEsEmitible` | cerrado para procesos; residual GAP-PLACEHOLDER-OBJETO acuñado |
| #71 | Tabla §20 como conjunto desfasada del frente reverse | sufijo `[etiqueta: …]` vivo sin registrar; columnas Parser «—» falsas | nota de cabecera datando el último pase; re-forward completo queda en backlog |

Donde un GAP seguía genuinamente abierto (recomposición, plegado total, XOR `puede ser`, referencia viva cross-model, drag triangular) **no se tocó**: la auditoría solo corrigió lo demostrablemente cerrado o cuyo texto describía un estado superado.

### Conflicto estética/semántica `ui-forja` ↔ `spec-forja-opd-es` (7)

| # | Hallazgo | Capa editada |
|---|---|---|
| #15 | GOVERNANCE omitía a `spec-forja-opd-es` de su cadena y reclamaba autoridad plena sobre apariencia JointJS/markers | GOVERNANCE §1/§3/§7: spec-OPD interpuesta, alcance acotado a lo no-portador de semántica OPM |
| #16 | `ui-forja/08` mantenía como reglas duras las tres derogaciones 08a/b/c ya registradas en spec-OPD §22 | 08 reconciliado por remisión (no por copia): `R-§25-MIG-2` cumplida en lo documental |
| #17 | Invariantes obsoletos en GOVERNANCE §2 («no hay resize handles», centrado en el centro geométrico) | reformulados por remisión a spec-OPD §11/§13 |
| #18 | «los colores OPM codifican semántica» en tensión con la doctrina color-informativo | GOVERNANCE §2 y `01-design-spec.md` §3.2: color = canal informativo (R-COLOR-1/2, R-OPD-COSA-5) |
| #24 | `ui-forja/08` prohibía la grid como regla absoluta; spec-OPD la admite como preferencia | 08: grid pasa a default de edición remitido a R-OPD-UI-6, supresión en export R-OPD-LAY-3 |
| #19 | Current declarado: el canon pide pin externo, la realización es punto interno, marcado «alineado» sin GAP | spec-OPD §3.2/§18.3: reclasificado GAP-OPD-CURRENT-GLIFO (espejo de DEFAULT-GLIFO) |
| #55 | Marca `ordered` (R-OPD-STR-5): símbolo fuera del vocabulario base sin marca de extensión | spec-OPD: «(extensión declarada)» con ancla OPL canónica |

### Desliz postmortem en capa subordinada (3 aplicados; los de reglas → paquete pausa)

| # | Hallazgo | Capa editada |
|---|---|---|
| #20 | `R-OPD-EDIT-7` era estado de bug fechado promovido a regla numerada | spec-OPD: reescrita al patrón kernel-normativo + GAP (como R-OPD-UI-5) |
| #21 | `R-OPD-LAY-10`/`R-OPD-UI-3`/`R-OPD-UI-4` con rationale de commit/paquete fechado | spec-OPD: kernel separado de realización, lo no respaldado marcado extensión |
| #27, #28 | A8 «métrica antes que conclusión» (narrativa del incidente Mesa 7) y `LF-19.4` con literal de glosa de herramienta | metod-forja: kernel conservado, narrativa comprimida a referencia a LF-19.3, literal abstraído |
| #43 | «Variante negada» canonizada sin declaración | spec-OPL: marcada extensión declarada, trazada a R-OPD-CTL-5 + kernel NOT |

### Conflicto y redundancia base ↔ Forja, y método ↔ base (resto, 22)

Selección de los de mayor efecto:

| # | Hallazgo | Capa que manda | Capa editada |
|---|---|---|---|
| #7, #42 | `R-ENT-3` (oración combinada eco-OPCloud) marcaba «Incorrecto» la plantilla atómica D1–D4 canónica | reglas (D1–D4) | spec-OPL: R-ENT-3 → extensión declarada de superficie; «Incorrecto» → «no preferida en emisión»; producción EBNF `(* ext *)` |
| #10 | El ejemplo end-to-end del Apéndice A violaba la reserva humana del agente y la unicidad procedimental | reglas (R-AG, R-ROL-UNIC-1) | spec-OPL: fan de instrumento no humano, unicidad restaurada |
| #11 | Glosas de rangos de ID divergentes del canon | reglas (§4.4–§4.11) | spec-OPL: glosas a espejo literal + fila RF* faltante |
| #13 | §8.3.1/§8.3.2 re-legislaban fuerza semántica/precedencia con IDs paralelos | reglas (§6.5/§6.6) | spec-OPL: reducido a delegación por URN |
| #40 | §7.7/§9.3 prohibían en despliegue la forma plural que §7.2 canoniza | spec-OPL interna | spec-OPL: safe-harbor de R-CX-COMP-3 ampliado |
| #41 | `tiene un … opcional` (RF2o) fuera del enum cerrado | spec-OPL | spec-OPL: extensión declarada de producto + producción `(* ext *)` |
| #44 | Nombre de instancia `Instancia : Clase` no derivable de la EBNF base | reglas (R-INS-3/V-58) | opm-opl-es A.3: producción dedicada |
| #45 | Multiplicidad sobre procedimentales mandada pero no derivable | OPM general (V-23) | opm-opl-es A.5 + sincronía spec-OPL §18 |
| #48 | Plantilla mixta de descomposición no derivable | OPM general | opm-opl-es A.10 + copias spec-OPL §18 |
| #47 | §18 «EBNF consolidada» duplica el Apéndice A base y ya divergió | spec-OPL | spec-OPL: §18 como delta que cita el Apéndice A base |
| #25 | `A2.1(b)` autorizaba conservar como instrumento lo que `R-AG-3` obliga a reclasificar | reglas (R-AG-3/4) | metod-forja: lifteada, vía (b) condicionada a ratificación previa |
| #26 | Índice de invariantes A8.2 con atribución de capa distinta que §15 base | base | metod-opm §15: fila 1/n corregida (opm-es → manual) |
| #29 | Ancla SSOT de `LF-05` citaba sección equivocada del manual | metod-forja | metod-forja: reatribuida a opd-es §10.12 |
| #30 | Nota de implementadores de la base prescribía «advertir» donde reglas manda prohibir | reglas (AP-21) | opm-iso: alineada al invariante, sin legislar severidad |
| #37 | La base imponía «deben soportar» vistas filtradas (invade plano operativo) | — | opm-iso: «deben» → «pueden/deberían» |
| #49 | Base §5.6 admite e/c en todo abanico; Forja/reglas los prohíben en resultado e invocación | reglas (AP-03/AP-10) | opm-visual §5.6 acotado |
| #50, #52, #54 | V-8, V-36, V-10: copias de la base más estrechas o con presupuestos derogados | reglas / Forja | opm-visual: reescritas al texto canónico |
| #57–#63 | Manual enseñaba gerundio posnominal, `afecta…de…a`, esencia escindida, `es` sin artículo, orden A2 distinto, R-AG-1 con excepciones de dominio, disciplina de brechas pre-R-CONF-7 | reglas / metod / spec-OPL | manual (ambos shards): alineado por cita a la capa propietaria |
| #38, #81, #82, #83, #84, #85 | Puentes locales: precedencia invertida, familia de 3 piezas, notas de reconciliación consumidas, README con versión incorrecta | fuentes y puentes | puentes y README actualizados |

---

## Paquete que requiere tu decisión (14)

Estos no se editaron porque tocan `reglas-opm-estrictas-es` (autoridad suprema) o son decisiones de producto. Ninguno bloquea el uso del corpus. Tres se agrupan en un mismo cluster.

### Contradicciones internas de `reglas-opm-estrictas-es` (requieren tu visto bueno para editar la suprema)

- **#9 + #35 + #39 — Ruta sobre habilitadores (cluster).** `reglas §4.12` (R-OPL-RUTA-3) declara la etiqueta de ruta sobre habilitadores «canónica condicionada» y a la vez `reglas §11.2` la lista como «zona no canonizada». `spec-forja-opl-es §8.3/§8.4` (C-25) espeja la contradicción. Resolución propuesta (la menos invasiva): conservar §4.12 y **retirar la fila de §11.2**, luego alinear C-25/§8.4 de la spec. El lado spec ya está listo para alinearse en cuanto decidas el lado reglas.
- **#1 — Tabla de bisimetría §9.2.** El gate `R-BI-TAB-1` repite las plantillas RF2 y CX1 con una sintaxis de lista degradada que viola `R-OPL-LISTA-1`. Corregir las dos filas para que citen las plantillas exactas de §4.10/§4.11.
- **#3 — Alcance de la resolución por fuerza semántica.** §5.8 la limita a la recomposición; §6.5 la enuncia sin restricción, lo que se lee como auto-resolución universal. Alinear §6.5 con §5.8 (y remitir la edición directa a R-EDIT-8).
- **#12 — La excepción y la taxonomía de cinco familias.** §5.1 cierra el universo en «exactamente cinco familias» pero §5.7 canoniza el enlace de excepción (proceso→proceso), que no cabe en ninguna. La opción más consistente con la decisión previa de elevar la invocación a familia (V-240) es declarar una **sexta familia** «Excepción procedimental». Requiere además decidir si se co-enmiendan las capas base (opm-visual §4.4, opm-iso L379) o se declara divergencia Forja.
- **#14 — Propiedad de las plantillas OPL.** El Mapa de familia de reglas se prohíbe a sí misma «plantillas OPL completas», pero §4.4–§4.11 las contiene todas (lo exige su Contrato de exhaustividad), y `spec-forja-opl-es` declara que no hace falta abrir reglas §4. Falta la regla de desempate: declarar que reglas conserva las tablas como referencia de validez/gate, y la superficie operativa es de spec-OPL.
- **#2 + #34 — Anexo C con identificadores de código (cluster).** El Anexo C fija en el canon nombres literales de funciones y archivos de la app (`verificarEquivalencia`, `law-composicion-*`, `app/src/leyes/`) y una referencia muerta a `docs/capa-categorial.md` (borrado en `2a83c1c5`), contra `R-APP-0`/`R-APP-1`. Reformular las reglas R-CAT-* en forma agnóstica y mover el mapeo regla→ley al registro de conformidad.
- **#5 — R-CONF-7 con sello de incidente fechado.** Lleva «decisión HITL FS 2026-06-11» dentro del cuerpo de la suprema. Mover la fecha al changelog/provenance del manifest; conservar una etiqueta de autoridad sin fecha.
- **#6 — Dos delegaciones sin destino.** `R-ROT-4` cita «(§20)» sin documento (el destino real es `opm-visual-es §20.1`, no §20 de las specs Forja); `R-OPL-PERSIST-3` delega «según la política metodológica» sin URN. Dos citas puntuales.
- **#32 — Abanicos convergentes de habilitadores.** La base los permite y ejemplifica (caja fuerte); `reglas §7.2` los declara «no aplica» sin declarar restricción. La implementación viva los soporta, así que no procede declarar restricción: corregir `opm-visual §5.5` y `opm-opl §11.2` admitiéndolos, y alinear reglas.
- **#33 — Abanico probabilístico sin anotar.** La base da default uniforme; `R-FAN-PROB-1` exige `Pr = p` explícito. Declarar el arbitraje intra-base (el DEBE viene de metod-opm §10.14) en reglas §6.8/§7.4.
- **#36 — Invocación con grupo paralelo.** La cláusula base «el último en terminar inicia al siguiente» no tiene cobertura local. Añadir `R-INV-2C` citando la base.

### Decisión de producto (1)

- **#24 (parte 2) — Valor por defecto de la grid.** El código arranca con grid activa (`GRID_DEFAULT.activa=true`); `ui-forja/08` conserva `drawGrid:false` como su default propuesto. Hay que ratificar uno de los dos (la parte documental ya quedó remitida a spec-OPD).

### Residuo adicional detectado en la reparación

- **R-NOM-PROC-1 más estrecho que el checker es-CL.** La regla admite literalmente solo infinitivo `-ar/-er/-ir` o nominalización `-ción/-miento`, pero el checker desplegado (calibración B-6) acepta deverbales irregulares (`Despacho`, `Ingreso`, `Cierre`, `Traslado`) y el manual los usa. Es divergencia reglas↔código: ampliar `R-NOM-PROC-1` para reconocer la nominalización deverbal del español ya implementada. (Paquete pausa, edita la suprema.)

---

## Hallazgos refutados (8, descartados)

| # | Hallazgo del lector | Por qué se descartó |
|---|---|---|
| #0 | `R-COSA-2` negaría los procesos persistentes que §2.3/D11/D12 regulan | Falsa equivalencia entre dos sentidos de «persistente»: R-COSA-2 regula la propiedad perseverancia, no la existencia de procesos persistentes |
| #4 | `R-OPL-TRANS-4` mapearía `can be` a `puede estar` colisionando con la especialización XOR | Las dos reglas operan sobre entradas distintas; no producen superficies incompatibles para la misma oración |
| #8 | BUG-f897bc legislado como zona prohibida en §7.7/§9.3 | Resuelto dentro de la misma sección: R-CX-COMP-3 distingue la oración de despliegue de la fusión prohibida |
| #23 | Arco lógico «extremo convergente» (reglas) vs «extremo común» (spec) | El término está definido en la procedencia que la propia regla cita; no hay divergencia |
| #31 | Operadores de restricción con conjuntos incompatibles | La base delega en opm-opl §12, que coincide; falsa divergencia |
| #51 | Supresión de estados: base «computa», Forja «almacena» | La base ISO define ambos mecanismos; premisa falsa |
| #53 | Glifo pin/gota reasignado del estado actual al inicial | V-133 es un default «recomendado» con cláusula de alternativa, no un mapeo obligatorio |
| #56 | Precedencia interina opd-es ↔ spec-forja-opd sin desempate | El desempate ya existe y es unívoco en el README del corpus (§Regla de precedencia operativa) |

---

## Veredicto final

**El corpus queda íntegro en su capa arbitrable.** Las 64 incoherencias que se resolvían editando capas subordinadas están remediadas y verificadas; el subtree del corpus pasa `kora check --strict` 37/37, el índice reindexa sin error nuevo y `design:governance` está OK. La autoridad suprema permaneció intacta.

### Brechas residuales con dueño

| Brecha | Dueño | Naturaleza |
|---|---|---|
| ~~Paquete de 13 enmiendas a `reglas-opm-estrictas-es`~~ | ~~operador → custodio-kora~~ | **RESUELTO 2026-06-14** (panel deliberado + arbitraje del operador → KORA v1.4.0; ver actualización al inicio) |
| Valor por defecto de la grid (#24 parte 2) | operador | decisión de producto/UX — **única brecha viva del paquete** |
| Realización en código de UIFORJA-08a/b/c (estado-pill, marcadores exhibición/instancia, straight-only) | deep-opm-pro (frente #4) | la mitad documental quedó cerrada hoy; resta el código |
| Re-forward completo de la tabla §20 de spec-OPL (#71) | deep-opm-pro (backlog) | corte propio; esta auditoría dejó el inventario de partida y los cierres por fila |
| `urn:kora:kb:guia-rapida-pneuma` roto en `.remember/remember.md` | operador | ajeno al corpus (buffer runtime no versionado) |
