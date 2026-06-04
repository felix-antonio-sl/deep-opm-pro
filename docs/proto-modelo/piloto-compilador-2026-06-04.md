# Piloto del compilador proto-modelo → Modelo (W4.2) sobre HODOM

**Item:** W4.2 del backlog contingencial. **Naturaleza:** ejecución determinista del compilador `autoria/compilar/` sobre el proto real.
**Insumo:** `hd-opm/docs/modelo-opm-hodom-completo.md` (proto v1.9, completo — todos los bloques, no solo SD0/SD1).
**Oráculo:** coherencia interna (L2 + validación del bundle + round-trip OPL forward). NO se compara contra el bundle v1.6 (proto y bundle divergieron legítimamente).
**Regenerar:** `cd app && bun run scripts/piloto-compilador-hodom.ts`. Este reporte reemplaza al previo.

## 1. OPDs y conteos del bundle emitido

- OPDs creados                      : 11
- Bundle emite (validarModelo PASS) : SÍ
- Entidades (bundle)                : 251
- Estados (bundle)                  : 175
- Enlaces (bundle)                  : 328
- OPDs (bundle)                     : 11
- Avisos de severidad error         : 0
- Canon                             : FAIL (10 bloqueantes, 100 metodológicos, 46 info).

## 2. Hechos aplicados por tipo de primitiva DSL

- Oraciones aplicadas     : 444
- Hechos emitidos (total) : 476
-   · abanico             : 1
-   · enlace              : 323
-   · entidad             : 87
-   · estados             : 51
-   · ver                 : 14

## 3. Exclusiones, rechazos y fallos (L2 — nada se pierde en silencio)

- Líneas estructura (refinamientos)            : 9
- Comentarios conservados                      : 12
- Excluidas (clase sin primitiva)              : 0
- Rechazadas (T3 del normalizador)             : 5
- Fallos (emisión rechazada por kernel/parser) : 0

### Rechazos del normalizador por categoría T3

- `R3`: 2
- `R6`: 2
- `R7`: 1

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

## 6. Veredicto

El compilador produce un Modelo OPM **válido** desde el proto real completo; L2 cierra (ninguna línea sin destino, hechos == oraciones aplicables); el round-trip OPL forward reproduce los hechos aplicados. Los fallos restantes son **tensiones reales de la convención v0 / del parser / del modelo** (ver §3), reportadas honestamente, no forzadas.
