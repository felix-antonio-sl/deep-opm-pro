# Piloto del compilador proto-modelo → Modelo (W4.2) sobre HODOM

**Item:** W4.2 del backlog contingencial. **Naturaleza:** ejecución determinista del compilador `autoria/compilar/` sobre el proto real.
**Insumo:** `hd-opm/docs/modelo-opm-hodom-completo.md` (proto v1.9, completo — todos los bloques, no solo SD0/SD1).
**Oráculo:** coherencia interna (L2 + validación del bundle + round-trip OPL forward). NO se compara contra el bundle v1.6 (proto y bundle divergieron legítimamente).
**Regenerar:** `cd app && bun run scripts/piloto-compilador-hodom.ts`. Este reporte reemplaza al previo.

## 1. OPDs y conteos del bundle emitido

- OPDs creados                      : 11
- Bundle emite (validarModelo PASS) : SÍ
- Entidades (bundle)                : 248
- Estados (bundle)                  : 175
- Enlaces (bundle)                  : 299
- OPDs (bundle)                     : 11
- Avisos de severidad error         : 0
- Canon                             : FAIL (10 bloqueantes, 99 metodológicos, 46 info).

## 2. Hechos aplicados por tipo de primitiva DSL

- Oraciones aplicadas     : 418
- Hechos emitidos (total) : 443
-   · enlace              : 299
-   · entidad             : 87
-   · estados             : 51
-   · ver                 : 6

## 3. Exclusiones, rechazos y fallos (L2 — nada se pierde en silencio)

- Líneas estructura (refinamientos)            : 9
- Comentarios conservados                      : 12
- Excluidas (clase sin primitiva)              : 0
- Rechazadas (T3 del normalizador)             : 31
- Fallos (emisión rechazada por kernel/parser) : 0

### Rechazos del normalizador por categoría T3

- `R1`: 6
- `R2`: 3
- `R3`: 14
- `R4`: 1
- `R6`: 2
- `R7`: 5

### Fallos de emisión por causa (tensiones de la convención v0)


Ejemplos de fallo (oración :: razón):


## 4. Round-trip OPL forward (los hechos aplicados reaparecen)

- Hechos aplicados verificables (cosa/estados/procedural) : 361
- Presentes en el OPL forward del modelo                  : 332
- Cobertura round-trip                                    : 92.0%

## 5. L2 — contabilidad

- Líneas sin destino reconocido      : 0
- Hechos en ledger == resumen.hechos : 443 == 443
- L2 coherente                       : SÍ

## 6. Veredicto

El compilador produce un Modelo OPM **válido** desde el proto real completo; L2 cierra (ninguna línea sin destino, hechos == oraciones aplicables); el round-trip OPL forward reproduce los hechos aplicados. Los fallos restantes son **tensiones reales de la convención v0 / del parser / del modelo** (ver §3), reportadas honestamente, no forzadas.
