# Piloto del compilador proto-modelo → Modelo (W4.2) sobre HODOM

**Item:** W4.2 del backlog contingencial. **Naturaleza:** ejecución determinista del compilador `autoria/compilar/` sobre el proto real.
**Insumo:** `hd-opm/docs/modelo-opm-hodom-completo.md` (proto v1.9, completo — todos los bloques, no solo SD0/SD1).
**Oráculo:** coherencia interna (L2 + validación del bundle + round-trip OPL forward). NO se compara contra el bundle v1.6 (proto y bundle divergieron legítimamente).
**Regenerar:** `cd app && bun run scripts/piloto-compilador-hodom.ts`. Este reporte reemplaza al previo.

## 1. OPDs y conteos del bundle emitido

- OPDs creados                      : 11
- Bundle emite (validarModelo PASS) : SÍ
- Entidades (bundle)                : 252
- Estados (bundle)                  : 175
- Enlaces (bundle)                  : 329
- OPDs (bundle)                     : 11
- Avisos de severidad error         : 0
- Canon                             : FAIL (10 bloqueantes, 108 metodológicos, 46 info).

## 2. Hechos aplicados por tipo de primitiva DSL

- Oraciones aplicadas     : 445
- Hechos emitidos (total) : 476
-   · abanico             : 1
-   · enlace              : 324
-   · entidad             : 86
-   · estados             : 51
-   · ver                 : 14

## 3. Exclusiones, rechazos y fallos (L2 — nada se pierde en silencio)

- Líneas estructura (refinamientos)            : 9
- Comentarios conservados                      : 12
- Excluidas (clase sin primitiva)              : 0
- Rechazadas (T3 del normalizador)             : 4
- Fallos (emisión rechazada por kernel/parser) : 0

### Rechazos del normalizador por categoría T3

- `R3`: 2
- `R6`: 2

### Fallos de emisión por causa (tensiones de la convención v0)


Ejemplos de fallo (oración :: razón):


## 4. Round-trip OPL forward (los hechos aplicados reaparecen)

- Hechos aplicados verificables (cosa/estados/procedural) : 367
- Presentes en el OPL forward del modelo                  : 334
- Cobertura round-trip                                    : 91.0%

## 5. L2 — contabilidad

- Líneas sin destino reconocido      : 0
- Hechos en ledger == resumen.hechos : 476 == 476
- L2 coherente                       : SÍ

## 5b. Anclas normativas (W5.2 — compilación determinista)

> El compilador determinista solo procesa marcas DENTRO de bloques ```opl (hechos y comentarios `#`).
> En el corpus HODOM las citas normativas viven mayormente en PROSA interbloque — alcance de la skill E2,
> FUERA de W5.2. Por eso el conteo de anclas compiladas es honestamente bajo: NO es un fallo del compilador.

- Anclas detectadas en bloques opl                                  : 9
-   · compiladas a AnclaNormativa                                   : 0
-   · candidatas conservadas (`[C1]`-style, §10.3)                  : 9
-   · en líneas rechazadas (en ledger, no compiladas)               : 0
- Anclas en el bundle                                               : 10
-   · pendientes de ratificación                                    : 10
- L8 coherente (detectadas == compiladas + candidatas + rechazadas) : SÍ

## 5c. Procedencia y staleness (W5.3 — L6)

> Staleness sobre artefactos estables (hashes de contenido), no ids internos. La divergencia
> se REPORTA, no degrada: el proto sigue siendo el portador canónico de la trazabilidad legal.

- protoHash (proto-modelo)                 : ca0831e8176a43a9
- glosarioHash (glosario de dominio)       : 9b4180ce3c4d1c97
- autoriaVersion                           : 1
- layoutVersion                            : 2
- Sello presente en el bundle (round-trip) : SÍ
- Divergencia bundle↔archivos actuales     : NO (sin staleness)

## 5d. Auditoría de uso de la familia V (F3 — no bloqueante)

> Migrable-estricto = V3/V4/V5/V7 (equivalencia E2 verde, retirables con piloto+byte-identidad).
> Requiere-decisión = las otras 12 (tagged/modificador/abanico/ancla; el reverse no las re-lee).
> Detalle del veredicto: `docs/proto-modelo/f2-equivalencia-familia-v.md`.

- Líneas resueltas por familia V (total) : 27
-   · migrable-estricto (V3/V4/V5/V7)    : 7 [V3×2, V4×2, V5×1, V7×2]
-   · requiere-decisión (12 reglas)      : 20 [V1×2, V10×1, V11×1, V12×6, V13×1, V14×1, V15×2, V17×1, V2×1, V6×2, V8×1, V9×1]
- OPDs que aún usan familia V            : 6 / 11

Uso por OPD (clave → reglas):
- `ii-2-b`: V12×3, V13×1, V15×1, V17×1, V4×1, V6×2, V7×1, V9×1
- `p5`: V3×1, V4×1, V7×1
- `sd1`: V8×1
- `sd1-m2`: V1×1
- `sd1-m2-1`: V10×1, V12×1
- `sd1-m3`: V1×1, V11×1, V12×2, V14×1, V15×1, V2×1, V3×1, V5×1

## 6. Veredicto

El compilador produce un Modelo OPM **válido** desde el proto real completo; L2 cierra (ninguna línea sin destino, hechos == oraciones aplicables); el round-trip OPL forward reproduce los hechos aplicados; L6 cierra (el sello de procedencia viaja en el bundle y coincide con los artefactos de la emisión). Los fallos restantes son **tensiones reales de la convención v0 / del parser / del modelo** (ver §3), reportadas honestamente, no forzadas.
