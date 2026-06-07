# F3 — Auditoría `usoFamiliaV` (modo no bloqueante)

**Fecha:** 2026-06-07
**Estado:** F3 cerrado. Instrumentación de auditoría del uso del adaptador legacy
`mapearFamiliaV` por compilación, **no bloqueante** por contrato (no lanza, no
falla el build; solo reporta). No cambia el default ni el comportamiento del
compilador.
**Contrato:** `contrato-migracion-familia-v-skill.md` (F3 = "conteo `usoFamiliaV`
por compilación/reporte; default no bloqueante"). **Veredicto F2:**
`f2-equivalencia-familia-v.md`.

## Qué instrumenta

`app/src/autoria/compilar/usoFamiliaV.ts`:
- `usoFamiliaV(ledger)` → `{ total, porRegla }` (ya existía en F2).
- `usoFamiliaVPorOpd(ledger)` → uso desglosado por clave de OPD (insumo de F4:
  qué OPDs migrar y con qué reglas).
- `MIGRABLE_ESTRICTO_F2` = `{V3, V4, V5, V7}` — único punto que codifica el
  veredicto F2.
- `particionarUso(uso)` → separa migrable-estricto de requiere-decisión,
  preservando el total.

Cableado (solo reporte, no bloqueante) en `scripts/piloto-compilador-hodom.ts`
(§5d) y `scripts/experimento-segundo-dominio.ts` (§2b). Regenerar:
`cd app && bun run scripts/piloto-compilador-hodom.ts` /
`bun run scripts/experimento-segundo-dominio.ts`.

## Mapa de dependencia real (2026-06-07)

| Corpus | Total familia-V | Migrable (V3/V4/V5/V7) | Requiere-decisión | OPDs con V |
|---|---|---|---|---|
| **HODOM** (proto v1.10 completo) | 27 | 7 — `V3×2 V4×2 V5×1 V7×2` | 20 — `V1×2 V2×1 V6×2 V8×1 V9×1 V10×1 V11×1 V12×6 V13×1 V14×1 V15×2 V17×1` | 6 / 11 |
| **Permiso de edificación** (segundo dominio) | 7 | 2 — `V5×1 V7×1` | 5 — `V12×3 V16×1 V17×1` | — |

**Uso por OPD en HODOM** (insumo directo de F4):

| OPD | Reglas |
|---|---|
| `ii-2-b` | `V4×1 V6×2 V7×1 V9×1 V12×3 V13×1 V15×1 V17×1` |
| `p5` | `V3×1 V4×1 V7×1` |
| `sd1` | `V8×1` |
| `sd1-m2` | `V1×1` |
| `sd1-m2-1` | `V10×1 V12×1` |
| `sd1-m3` | `V1×1 V2×1 V3×1 V5×1 V11×1 V12×2 V14×1 V15×1` |

## Lectura para las decisiones pendientes

1. **El migrable-estricto NO es moot.** HODOM usa V3/V4/V5/V7 **7 veces** (3 OPDs:
   `p5`, `ii-2-b`, `sd1-m3`, `sd1-m2`... realmente `p5`, `ii-2-b`, `sd1-m3`). Un
   F5 parcial que los retire **sí** requiere migrar esas 7 líneas del proto a su
   forma E2 (F4) + re-pin — no es cambio de cero costo. Pendiente de de-risking:
   probar si esa migración preserva el bundle byte-a-byte.
2. **La decisión de transporte es la palanca grande.** Las 12 requiere-decisión
   concentran **20/27 (74%)** del uso en HODOM y **5/7 (71%)** en el segundo
   dominio. Dentro de ellas, **V12** (colas condicionales → ancla pendiente)
   domina: 6 en HODOM + 3 en edificación. Si el operador define el transporte de
   V12 primero, cubre el mayor volumen.
3. **`sd1` solo usa V8** (1 línea, tagged `sucede a`): un OPD casi-migrable que
   queda atado por una sola regla requiere-decisión — candidato a estudio de la
   opción "dar superficie reverse" acotada.

## Estado de las fases

- F0 contrato ✅ · F1 ledger ✅ · **F2 equivalencia ejecutable ✅** · **F3 auditoría ✅**.
- **De-risking F4 de las 4 migrables — EJECUTADO 2026-06-07** (read-only,
  `docs/proto-modelo/derisk-f4-migrables.md`): migrar V3/V4/V5/V7 a su forma E2 en
  el proto HODOM es **BYTE-IDÉNTICO** → un F5 parcial de esas 4 reglas es **cambio
  de cero costo** (no requiere re-pin del golden; solo bendecir la edición de 7
  líneas del proto + el retiro de las 4 reglas del compilador). De yapa, el
  de-risking destapó y corrigió un **bug de reentrancia** del `claveProto` de colas
  (contador módulo-global → por-compilación).
- **F4 (migrar pilotos a E2) y F5 (cambiar default) siguen GATEADOS** por la
  decisión de transporte de las 12 requiere-decisión y, para las 12, por el re-pin
  del proto HODOM (la edición de las líneas requiere-decisión SÍ puede cambiar el
  bundle). Para las 4 migrables, F5 parcial está de-riskeado y listo (espera la
  edición del proto en `hd-opm` + retiro, awareness del operador).
