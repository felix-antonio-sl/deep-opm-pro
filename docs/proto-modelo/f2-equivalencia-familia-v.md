# F2 — Equivalencia laxo↔E2 de la familia V (veredicto ejecutable)

**Fecha:** 2026-06-07
**Estado:** F2 cerrado como **fixtures ejecutables + clasificación medida**. No cambia el default ni el comportamiento del compilador (invariante del contrato F0).
**Contrato:** `contrato-migracion-familia-v-skill.md` · **Ledger F1:** `ledger-familia-v-skill.md`.
**Artefactos:** `app/src/autoria/compilar/usoFamiliaV.ts` (observación pura del ledger), `familia-v-e2.fixtures.ts` (tabla medida), `migracion-familia-v.test.ts` (25 tests verdes).

## Qué hace F2 (y qué no)

F2 **no ejecuta la skill** (ningún LLM en los tests). Codifica la salida E2 esperada
como texto y verifica, por cada regla V, si existe una forma OPL-ES estricta que:
(a) compila **sin** usar familia-V (`usoFamiliaV == 0`) y (b) produce el **mismo
modelo observable** que la ruta laxa legacy. La equivalencia se mide sobre una
proyección canónica (entidades nombre→tipo, enlaces tipo+extremos+etiqueta+
modificador, estados, anclas), no sobre ids posicionales.

El valor de F2 no es "17 fixtures verdes": es **clasificar con evidencia** qué
reglas pueden migrar a la skill hoy y cuáles necesitan una decisión de transporte
antes de F4/F5. F2 no finge equivalencia donde no la hay.

## Veredicto

### ✅ Migrable-estricto — 4 reglas (la skill ya puede emitir su forma E2)

| Regla | Verbo laxo | Forma E2 estricta (reverse-parseable) |
|---|---|---|
| **V3** | `X en 's' puede iniciar P` | `X en estado 's' inicia P.` (evento de estado) |
| **V4** | `O alimenta P` | `P requiere O.` (instrumento) |
| **V5** | `P detecta O` | `P genera O.` (resultado) |
| **V7** | `A precede a B` | `A invoca B.` (invocación) |

Para estas, la equivalencia laxo↔E2 es **verde dura**: mismo modelo, cero familia-V.
Son los mapeos verbo→verbo-del-enum y el evento de estado, cuyas formas estrictas
el parser reverse re-lee. Cumplen los puntos 1-2 del criterio de retiro F0.

### ⚠️ Requiere-decisión — 12 reglas (NO migran a texto estricto hoy)

`V1 V2 V6 V8 V9 V10 V11 V13 V14 V15 V16 V17`.

Su salida E2 emite uno de: **tagged solo-forward** (V8 `sucede a`, V9 `corresponde a`,
V10 `cumple`, V11 `habilita` obj→obj, V16 `dirigido a`), **modificador
condicion/evento sin superficie textual** (V1, V2, V13), **abanico/transición XOR**
(V14, V15) o **ancla pendiente** (V17, y las colas de V10). El parser reverse **no
re-lee** esas formas (son solo-forward por diseño, `parsear.ts`), así que "proto E2
estricto" no existe como texto para ellas. Demostrado en F2:

- **V8/V9**: la forma forward (`A sucede a B.`) compila a un modelo **distinto** del
  laxo (el tagged no se reconstruye por ruta reverse).
- **V11**: su única superficie es la que dispara V11 — la "forma E2" **vuelve a usar
  familia-V** (`usoFamiliaV == 1`), no migra.

**Decisión pendiente para el operador (gobierna F4/F5):** estas 12 reglas exigen
elegir el transporte de la salida E2 cuando no hay texto OPL-ES estricto. Opciones:
1. **Dar superficie reverse** a tagged/modificador en la gramática estricta (el
   parser reverse aprende a re-leer `A sucede a B.`, `X requiere Y [condicion]`,
   etc.) — sube la cobertura migrable pero amplía el parser reverse.
2. **Emisión estructurada**: la skill entrega no-texto sino las `Emision`/`Directiva`
   ya decididas (formato intermedio), y el compilador las consume sin re-derivar
   familia-V — preserva "ningún LLM toca el bundle" porque sigue siendo el
   compilador quien emite, pero el contrato de entrada deja de ser texto puro.
3. **Mantener legacy** para estas reglas indefinidamente (familia-V no se retira del
   todo; solo migran las 4 estrictas) — F5 parcial.

F2 no elige por el operador: expone que la frontera "skill normaliza a OPL-ES
estricto" cubre 4/16 reglas limpiamente y que el resto necesita esta decisión.

### 🔻 Deuda de la skill (negativo que el legacy NO rechaza)

- **V5** `P detecta O` se aplica **ciego al tipo de O**: `Monitorización detecta
  Paciente` → `genera Paciente` sin objetar que Paciente es receptor, no evento
  producido. El legacy no lo rechaza; la skill E2 **debe** rechazarlo (el ledger F1
  ya lo marca como negativo). Es deuda de normalización, no del compilador.

Los demás negativos (V2 no-binario, V3 disyunción, V4 proc→proc, V7 obj→obj) **sí**
los rechaza el legacy hoy (firma ilegal o cardinalidad) — verificados en F2.

## Cobertura del contrato F0 §"Fixtures mínimos"

| Exigido | Cubierto |
|---|---|
| V1/V2/V13 guardas y binariedad | ✅ (V1, V2, V13 + negativo V2 no-binario) |
| V8/V9/V10/V11/V17 etiquetadas y colas | ✅ (todas, clasificadas requiere-decisión) |
| V14/V15 disyunciones y abanicos homogéneos | ✅ |
| V16 `notifica` → genera + dirigido a | ✅ |
| rechazos persistentes (proyecta, determinan…como, etc.) | en `adjudicacion-dov-dori.test.ts` (en-reflexión) |
| normativa abierta con localizador | en `adjudicacion-dov-dori.test.ts` (P1) |

## Siguiente paso (F3) y bloqueo de F4/F5

- **F3 — auditoría `usoFamiliaV`**: `usoFamiliaV(ledger)` ya existe y es puro; F3 lo
  promueve a métrica por OPD en el piloto/reporte (no bloqueante por default).
- **F4/F5 bloqueados** hasta que el operador decida el transporte de las 12 reglas
  requiere-decisión. Las 4 estrictas (V3/V4/V5/V7) **podrían** retirarse antes en un
  F5 parcial: tienen equivalencia verde, fixture negativo y cero uso en su forma E2.
  Antes de retirarlas: piloto HODOM sin regresión + `usoFamiliaV` de los OPDs
  migrados en cero + byte-identidad/re-pin verde.

**Regenerar/verificar:** `cd app && bun test src/autoria/compilar/migracion-familia-v.test.ts`.
