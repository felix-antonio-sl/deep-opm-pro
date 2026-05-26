# Auditoría profunda forense — alineación OPL (OPFORJA)

- **Fecha**: 2026-05-26 · **Complementa**: `README.md` (triage). · **HEAD**: `3a14795`.
- **Alcance**: fichas forenses de los GAPs accionables (`corregir-código`, `relajar/ajustar-spec`) + resolución de los 4 `requiere-decisión-operador`. Los `diferir-feature` se listan como backlog (§4).
- **Canon**: `docs/canon-opm/spec-forja-opl.md` + `reglas-opm-estrictas.md`. READ-ONLY sobre `app/src/**`.

## 0. Resolución de los 4 GAPs de decisión (verificados en código)

| GAP | Veredicto resuelto | Evidencia |
|-----|--------------------|-----------|
| GAP-PARSE-TS4 (`cambia O de \`s\`` solo origen) | **confirmar-y-cerrar** — ya cubierto | `parser/parsear.ts:628` CS3 `^(.+?)\s+cambia\s+(.+?)\s+de\s+\`?([^\`]+?)\`?$`. Solo falta fixture (→ Ola 3). |
| GAP-PARSE-TS5 (`cambia O a \`s\`` solo destino) | **confirmar-y-cerrar** — ya cubierto | `parser/parsear.ts:635` CS4 `^(.+?)\s+cambia\s+(.+?)\s+a\s+\`?([^\`]+?)\`?$`. Solo falta fixture. |
| GAP-ABANICO-AGENTE-PARSE | **parser-faltante → diferir** | `ABANICO_VERBO_RE_LIST` (`parsear.ts:283`) no contiene formas pasivas `es manejado por`/`es requerido por`; el fan de agente/instrumento inverso no se reconstruye. Backlog de parsers. |
| GAP-VERIFY click→foco | **relajar/ajustar-spec** | El handler vive en `app/src/ui`, no en `opl/`. Ajustar §14 para no exigir el handler dentro de la capa OPL pura. |

## 1. Bugs que violan canon (corregir-código)

### GAP-PLACEHOLDER-ENTIDAD · alta · corregir-código
- **Conducta actual** (`generadores/refsHints.ts:203-206`): `export function entidadOplEsEmitible(entidad: Entidad): boolean { void entidad; return true; }`. El argumento se descarta; siempre emite.
- **Canónica esperada**: §2 R-ENT-2 — un proceso/objeto/estado **placeholder** (sin nombre canónico) NO DEBE producir OPL canónica (queda como diagnóstico).
- **Causa raíz**: el predicado existe (`nombresCanonicos.ts·esNombreProcesoPlaceholder`) pero nunca se conectó al gate de emisión.
- **Corrección**: `return !esNombreProcesoPlaceholder(entidad.nombre)` para procesos (y el predicado de placeholder análogo para objetos/estados si aplica). Importar de `nombresCanonicos.ts`.
- **Tests afectados**: `generadores/refsHints.test.ts` (añadir caso placeholder→no emite); revisar `generar.test.ts` por si algún modelo de prueba usa nombres placeholder y cambia el conteo de oraciones.
- **Roundtrip**: nulo (suprime emisión; el parser no recibe esas líneas).

### GAP-EVENTO-RESULTADO · alta · corregir-código
- **Conducta actual** (`generadores/procedural.ts:272-276`, `oracionEvento`): `case "resultado": … return \`${destinoOpl} inicia ${origenOpl}, que genera ${destinoOpl}${sufijo}.\``. El objeto-resultado **inicia** el proceso que lo genera. Además la rama `if (estado)` es **código muerto** (ambas ramas idénticas).
- **Canónica esperada**: §5 R-MOD-INPUT-2 — el modificador de evento aplica SOLO al lado INPUT (consumo/agente/instrumento); un resultado es OUTPUT y no puede disparar su proceso (causalidad: no existe aún).
- **Causa raíz**: `oracionEvento` trata todas las familias por simetría sin filtrar OUTPUT.
- **Corrección**: en `case "resultado"`, NO emitir evento; degradar a la oración base de resultado (`oracionEnlaceSinModificador`). Eliminar la rama `estado` muerta.
- **Tests afectados**: `generadores/procedural.test.ts` (snapshot de evento-resultado cambia/desaparece). Añadir aserción negativa: evento sobre resultado degrada a base.
- **Roundtrip**: el parser ya no recibe `X inicia P, que genera X`; verificar que no había fixture dependiente.

### GAP-CONDICION-RESULTADO · alta · corregir-código
- **Conducta actual** (`procedural.ts:313-317`, `oracionCondicion`): `case "resultado": … \`${origenOpl} ocurre si ${destinoOpl} puede generarse, en cuyo caso ${origenOpl} genera ${destinoOpl}…\``. Léxico `puede generarse` no canónico; condición sobre OUTPUT. Rama `estado` muerta (idéntica).
- **Espejo** (`generadores/abanico.ts:176`, `oracionAbanicoCondicional`): `${puertoOpl} ocurre si ${cuantificador} ${lista} puede generarse, …` — misma raíz léxica (GAP-FAN-RESULTADO-COND).
- **Canónica esperada**: §5 — condición es modificador INPUT; el léxico de condición canónico es `existe`/`está en \`estado\``, no `puede generarse`.
- **Causa raíz**: realización inventada para el caso resultado+condición.
- **Corrección**: en `case "resultado"` de `oracionCondicion` y en la rama de salida de `oracionAbanicoCondicional`, no emitir condición sobre output; degradar a base de resultado/fan. Eliminar `puede generarse` del léxico.
- **Tests afectados**: `procedural.test.ts`, `abanico.test.ts`, `parser.condicionesExcepciones.test.ts` (si parsea `puede generarse`).
- **Roundtrip**: retirar `puede generarse` del generador exige confirmar que el parser no dependía de él.

### GAP-EVENTO-INVOCACION · media · corregir-código
- **Conducta actual** (`procedural.ts:282-283`): `case "invocacion": return \`${origenOpl} inicia e invoca ${destinoOpl}${sufijo}.\``.
- **Canónica esperada**: §5 R-MOD-CAT-1 — la invocación es relación proceso→proceso autónoma; no admite extremo-objeto iniciador (evento es modificador objeto→proceso).
- **Corrección**: degradar a invocación base (`${origenOpl} invoca ${destinoOpl}…`).
- **Tests**: `procedural.test.ts`.

### GAP-CONDICION-INVOCACION · baja · corregir-código
- **Conducta actual** (`procedural.ts:323-324`): `case "invocacion": return \`${origenOpl} invoca ${destinoOpl} si ${origenOpl} ocurre.\``. Tautológico.
- **Canónica esperada**: §5 — invocación no admite modificador de condición de enlace.
- **Corrección**: degradar a invocación base.
- **Tests**: `procedural.test.ts`.

### GAP-INVOCACION-TILDE · baja · corregir-código
- **Conducta actual** (`procedural.ts:187` autoinvocación, `:205` invocación): emite `despues de ${enlace.demora}` — falta tilde (`después de`).
- **Canónica esperada**: es-CL ortográfico (§0/§1).
- **Corrección**: `despues de` → `después de` en ambas líneas.
- **Tests/roundtrip**: el parser DEBE aceptar `después de` (y normalizar `despues de` legacy, §18). Verificar `parsear.ts` (normalización de tildes) antes de cambiar, para no romper modelos guardados.

### GAP-PROB-SUPERFICIE · media · corregir-código (DECIDIDO: solo canónico)
- **Conducta actual** (`procedural.ts:421-422`, `sufijoProbabilidad`): emite `(probabilidad: N%)` por enlace.
- **Canónica esperada**: §8 R-FAN-6 — la probabilidad `Pr=p` es canónica SOLO dentro de un abanico XOR, por rama.
- **Decisión del operador (2026-05-26)**: **solo canónico**. El export DEBE emitir `Pr=p` por rama de fan XOR; `(probabilidad: %)` se retira. NO se conserva el formato humano como alias.
- **Corrección**: en `sufijoProbabilidad` (`procedural.ts:421`) y `abanico.ts`, emitir `Pr=p` (con `p` la probabilidad de la rama) en la forma canónica de fan XOR; suprimir `(probabilidad: %)`.
- **Tests**: `procedural.test.ts`, `abanico.test.ts` (actualizar snapshots de probabilidad). Roundtrip: confirmar que el parser reconoce `Pr=p`.

## 2. Reclasificación forense — GAP-XOR NO es bug de alta

- **Conducta actual** (`refinamiento.ts:332-350`, `emitirEspecializacion`): emite, por hijo, `${hijo} es un ${padre}.`
- **Análisis**: `es un` (singular, hijo→padre) **es canónico** para el hecho de generalización/especialización individual (§6.3 RF3). La forma `puede ser` (§1.2 R-VERB-EST-2) se exige **solo** para **especialización XOR exclusiva** entre hermanos (`Padre puede ser HijoA o HijoB`), que es una superficie *parent-centric* distinta, no la negación de `es un`.
- **Veredicto corregido**: NO es bug de canon. Es **feature-faltante** (media): falta la superficie `puede ser` para grupos de especialización marcados XOR. `emitirEspecializacion` es además un **misnomer** (emite el hecho de generalización, no XOR). 
- **Acción**: mover GAP-XOR y GAP-spec `emitirEspecializacion` a **diferir-feature** (paquete con GAP-XOR-PARSER). Si el operador quiere la forma `puede ser` para todo grupo de especialización (no solo XOR), es decisión de producto, no corrección de bug.
- **Corrección menor inmediata**: dar entrada en spec (§6.3) a `emitirEspecializacion` como emisor del hecho `es un` (cierra el GAP-spec sin tocar código).

Esta reclasificación reduce los bugs reales **de 8 a 6** (GAP-XOR sale; GAP-PROB-SUPERFICIE queda condicionado a decisión de superficie).

## 3. Ajustes de spec (relajar/ajustar-spec) — ediciones exactas

| GAP | Edición en `spec-forja-opl.md` |
|-----|-------------------------------|
| GAP-EXC-UNIDADES-LITERAL | §5.3: reconocer que la excepción realiza el literal de unidad con valor+unidad concretos (`formatoTiempo`), no el placeholder; nota de realización. |
| GAP-COL-RESOLUCION | §8.3.1/§8.3.2: declarar que la resolución de colisión de rol y la precedencia de recomposición viven en el kernel (`modelo/**`), NO exigen generador OPL de reporte. |
| GAP-COMP-GUARDA | §9.3: marcar el guard de no-coordinación en refinamiento como "por construcción / no-aplicable hasta que exista la capa de composición (GAP-COMPOSICION)". |
| GAP-spec `emitirDespliegueOcurren` | §7.2: dar entrada al emisor de despliegue (`refinamiento.ts`) o marcarlo helper no normativo. |
| GAP-spec `emitirEspecializacion` | §6.3: dar entrada como emisor del hecho `es un` (ver §2). |
| GAP-spec formateadores inline duración | §2.5/§5: dar entrada a `oracionesUnidadDescripcionEstados`/`formatear*Inline` (`duracionMetadata.ts`) o marcarlos no normativos. |
| GAP-spec colapso de bloques | §12–§13: dar entrada a `aplanarBloquesOpl`/`chevronEstadoBloque`/`togglearColapsoBloque` (`bloquesJerarquicos.ts`) como mecánica display. |
| GAP-VERIFY click→foco | §14: aclarar que el handler click→foco vive en UI, fuera de la capa OPL. |

## 4. Backlog diferido (features/parsers; fuera de las olas de corrección)

- **Generadores faltantes**: GAP-VARIA (`varía de … a`), GAP-TIPO (`es de tipo`), GAP-NOMBRE-INSTANCIA (`Instancia : Clase`), GAP-REFINA (`se refina por`), GAP-PLIEGA (plegado total), GAP-RECOMPONE, GAP-FAN-EVENTO (fan bajo evento), GAP-FAN-M (`exactamente m de f`), GAP-COMPOSICION (capa §9), GAP-XOR (`puede ser` XOR, reclasificado §2).
- **Parsers faltantes**: GAP-XOR-PARSER, GAP-TAG-PARSER, GAP-SSE-PARSER, GAP-CX-PARSER (descomposición serial), GAP-COMP-REVERSE, GAP-ABANICO-AGENTE-PARSE.
- **Fixtures bloqueados por parser ausente**: GAP-FIXTURE-{TAGGED, SSE, DESCOMPOSICION}.
- **Confirmar-y-cerrar (ya cubiertos)**: GAP-FIXTURE-AGREGACION y GAP-FIXTURE-GENERALIZACION (fixtures existen), GAP-PARSE-TS4/TS5 (CS3/CS4 existen), GAP-PROCEDENCIA-ESCIND, GAP-VERIFY ruta/sub-span.

## 5. Resumen forense

- **Bugs reales confirmados: 7** (tras reclasificar GAP-XOR como feature y decidir GAP-PROB-SUPERFICIE como solo-canónico): GAP-PLACEHOLDER-ENTIDAD, GAP-EVENTO-RESULTADO, GAP-CONDICION-RESULTADO (+ espejo fan), GAP-EVENTO-INVOCACION, GAP-CONDICION-INVOCACION, GAP-INVOCACION-TILDE, **GAP-PROB-SUPERFICIE** (`Pr=p` obligatorio). Todos en `procedural.ts` (+ `abanico.ts` espejo, + `refsHints.ts` el de placeholder).
- **2 GAPs de decisión resueltos como ya-cubiertos** (TS4/TS5), 1 como diferir (fan agente), 1 como ajuste-spec (click→foco).
- **Orden de corrección recomendado**: Ola 1 = los 7 bugs (`procedural.ts` + `refsHints.ts` + espejo `abanico.ts`) vía TDD; Ola 2 = los 8 ajustes de spec (§3, sin tocar código); Ola 3 = fixtures con backend ya listo (incl. TS4/TS5 ahora confirmados). Features y parsers → backlog.
