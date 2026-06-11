# Solicitud upstream — contención interna del in-zoom sin superficie proto

**Fecha**: 2026-06-11 · **Consumidor solicitante**: skill `modelamiento-opm`
v1.8.0 (KORA, `urn:kora:artefacto:modelamiento-opm`) · **Contexto**: prueba
end-to-end del loop M2/H1/H2 (proto → compilador con sello → render headless →
golden-harness) con un modelo real, 2026-06-10/11.

Mismo formato que las solicitudes de hd-opm: diagnóstico verificado contra el
código vivo, con claims falsables; deep-opm-pro decide la solución.

---

## S1 (P1) — `se descompone en` no llena `internosInzoom`: todo in-zoom compilado desde proto renderiza roto

### Síntoma observable

`bun run render:headless --proto <md>` sobre **cualquier** proto con in-zoom
produce un OPD hijo con el contorno del proceso refinado **vacío** y los
subprocesos **fuera** de él, en una fila con aristas colineales superpuestas
que atraviesan las cajas. Esto viola la semántica visual del in-zoom
(`spec-forja-opd-es`: los subprocesos viven dentro del contorno) y dispara el
checker `DESCOMPOSICION_SIN_SUBPROCESOS` (LF-19) como **falso positivo de
modelado** — el autor sí declaró subprocesos; es la herramienta la que no los
contiene.

**Repro mínima (sin modelo nuevo)**: renderizar el `PROTO_CAFE` del propio
smoke H1 (`scripts/render-headless-smoke.ts`) y mirar
`02-sd1-in-zoom-de-hacer-cafe.png` — mismo defecto. El smoke pasa porque solo
verifica que el PNG exista, no su composición.

### Diagnóstico (verificado contra el código, 5 claims)

1. **El layout depende de `internosInzoom`**: `aplicarLayoutCompleto(modelo,
   internosInzoom)` (`src/autoria/layout.ts:54`) consulta
   `internosInzoom.get(opd.id)` (líneas 414 y 630) para componer el contorno.
   Sin entradas, no hay contención.
2. **El único escritor de `internosInzoom` es el DSL**:
   `registrarInternoInzoom` (`src/autoria/dsl.ts:395`) tiene un único llamador
   — `enlazar(...)` cuando consume una **agregación** cuyo origen es el proceso
   con `refinamientos.descomposicion.opdId === opdId` (`dsl.ts:537`).
3. **El compilador del proto nunca lo llama**: al procesar `X se descompone en
   A y B` (`compilar/estructura.ts:187`), `compilar/compilador.ts:175-191`
   ejecuta `refDescomp` + `autor.ver` (contorno) y registra el ledger, pero
   **no registra los miembros de la lista como internos** ni emite las
   agregaciones que el DSL consumiría.
4. **`consta de` no es vía alternativa**: `compilar/normalizador.ts:192-208`
   tipa el **sujeto como objeto** (clase explícita — conflicto con el proceso
   refinado) y conserva el ` y ` interno de la lista, con lo que la oración
   `Proyección a runtime consta de Transmutación y Despliegue` creó la entidad
   fantasma «Transmutación y Despliegue» y abortó el canon
   (`proceso-sin-entrada-ni-salida` + `visual-subproceso-sin-transformado`).
5. **Consecuencia neta**: la membresía interna del in-zoom **no tiene
   superficie proto**. El camino primario M2 de la skill (proto → compilador)
   no puede producir un in-zoom visualmente válido, y H1 (los «ojos» del
   agente) reporta como defecto de modelado lo que es un gap de la herramienta.

### Qué pedimos (deep-opm-pro decide el cómo)

Que la oración `X se descompone en A, B …` registre los miembros de su lista
como internos del OPD hijo (vía `registrarInternoInzoom` o emitiendo las
agregaciones contorno→subproceso que `dsl.ts:537` ya consume). Es la semántica
OPM natural de la oración: los subprocesos nombrados en la descomposición SON
el interior del in-zoom. Alternativa si se prefiere opt-in: una superficie
explícita nueva — pero la default debería ser la contención, no la fila plana.

### Qué NO pedimos

- No pedimos tocar `mapearFamiliaV` ni el léxico del compilador.
- No pedimos cambio en la skill (su lado del contrato ya está en v1.8.0).
- No ignoramos el gate: **esto toca layout → byte-identidad del golden hd-opm
  → protocolo re-pin** (`docs/roadmap/protocolo-re-pin.md`). La solicitud entra
  al backlog gateado junto a A-1/A-2 (ahora iterables con H1), no como hotfix.

### Evidencia

- `app/_local/proto-kora-proyeccion.md` + `app/_local/render-v1/` (defecto) y
  `render-v2/` (frontera/afiliación corregidas en el proto; contención sigue
  rota — no es corregible desde el proto).
- `app/_local/render-cafe/02-sd1-in-zoom-de-hacer-cafe.png` (repro con el
  proto de referencia del smoke).
- Bundle sellado `a98c4d6832cb23f4` byte-idéntico bajo H2 (PASS): el gap es de
  composición visual, no de reproducibilidad.

## S2 (P3, menor) — léxico deverbal de `PROCESO_NOMBRE_FORMA_VERBAL`

«Despliegue» (nominalización deverbal legítima de *desplegar*, término real del
dominio KORA) acusa `info`. La calibración es-CL (B-6) cubre deverbales
irregulares Ingreso/Cierre/Retiro/Traslado y sufijos `-ura`/`-ncia`, pero no la
familia en `-e` átona (despliegue, repliegue, desagüe, deslinde). Pedido:
ampliar el léxico o documentar la exclusión. No bloquea (severidad info); la
skill lo maneja hoy como decisión declarada.

---

**Trazabilidad**: hallazgos producidos por la prueba del loop completo de la
skill `modelamiento-opm` v1.8.0 (estado `revisar-visual`, 2 iteraciones
read-through). El ancla `ratificar:frontera-deploy` del modelo de prueba queda
como pendiente real para ejercitar W6.5 cuando se importe el bundle.

---

## RESOLUCIÓN (deep-opm-pro, 2026-06-11)

**S1 — RESUELTO, sin re-pin.** Los 5 claims se verificaron exactos contra el
código. Implementación (la primera alternativa pedida): el compilador, TRAS
emitir los hechos del OPD hijo (para respetar la esencia/afiliación declarada
y no perder hechos del ledger), registra cada miembro de la lista de
`X se descompone en …` y emite la agregación contorno→miembro que el DSL ya
consumía como contención (`registrarInternoInzoom`; no crea enlace en el
bundle). Un miembro declarado SOLO en la lista se crea como proceso interno
(es interior declarado). `NodoOpd` gana `miembros: string[]`
(`compilar/estructura.ts::extraerMiembros`, lista simple coma/` y `).

**Por qué NO aplicó el gate de re-pin**: el fix vive íntegro en `compilar/*`
(vía proto); `layout.ts` y la vía DSL no se tocan. El golden de byte-identidad
hd-opm es la emisión **DSL** (proto≠fuente golden, F5-V12) — la suite completa
(2508/0, incluye los goldens familia-V) lo defiende. Solo cambia el layout de
bundles compilados desde proto, que es el efecto pedido.

Verificación: 4 tests nuevos en `compilador.test.ts` (contención geométrica
miembro⊂contorno, cero agregaciones inventadas en el bundle, LF-19 sin falso
positivo, miembro solo-lista existe como proceso) + render in-vivo del
`PROTO_CAFE`: subprocesos DENTRO de la elipse del contorno.

**S2 — RESUELTO.** La familia deverbal en `-e` átona entra al léxico curado
B-6: `despliegue, repliegue, desague (NFD), deslinde, embarque, desembarque`;
guarda adversarial conservada (parque/bosque siguen acusados).

**Hallazgo colateral (deuda preexistente, fuera de alcance)**: el sufijo de
cola `-ion` de `VERBAL_SUFIJO_RE` (pensado para el inglés `-ing`) produce un
falso negativo — `Norte de la región` pasa como forma verbal porque la cola
`región` matchea. Documentado aquí; no se tocó.

**Para la skill**: ningún cambio requerido en KORA. El smoke H1 sigue verde y
el render del in-zoom desde proto ya es canónico; `revisar-visual` dejará de
ver el defecto. Commits: `feat(compilar): S1 …` + `feat(checkers): S2 …`.
