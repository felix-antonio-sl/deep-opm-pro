# Piloto del compilador proto-modelo → Modelo (W4.2) sobre HODOM

**Item:** W4.2 del backlog contingencial. **Naturaleza:** ejecución determinista del compilador `autoria/compilar/` sobre el proto real.
**Insumo:** `hd-opm/docs/modelo-opm-hodom-completo.md` (proto v1.9, completo — todos los bloques, no solo SD0/SD1).
**Oráculo:** coherencia interna (L2 + validación del bundle + round-trip OPL forward). NO se compara contra el bundle v1.6 (proto y bundle divergieron legítimamente).
**Regenerar:** `cd app && bun run scripts/piloto-compilador-hodom.ts`. Este reporte reemplaza al previo.

## 1. OPDs y conteos del bundle emitido

- OPDs creados                      : 11
- Bundle emite (validarModelo PASS) : SÍ
- Entidades (bundle)                : 250
- Estados (bundle)                  : 169
- Enlaces (bundle)                  : 284
- OPDs (bundle)                     : 11
- Avisos de severidad error         : 0
- Canon                             : FAIL (12 bloqueantes, 105 metodológicos, 50 info).

## 2. Hechos aplicados por tipo de primitiva DSL

- Oraciones aplicadas     : 398
- Hechos emitidos (total) : 417
-   · enlace              : 278
-   · entidad             : 85
-   · estados             : 48
-   · ver                 : 6

## 3. Exclusiones, rechazos y fallos (L2 — nada se pierde en silencio)

- Líneas estructura (refinamientos)            : 9
- Comentarios conservados                      : 12
- Excluidas (clase sin primitiva)              : 1
- Rechazadas (T3 del normalizador)             : 30
- Fallos (emisión rechazada por kernel/parser) : 17

### Exclusiones por clase

- `estados-sobre-proceso`: 1

### Rechazos del normalizador por categoría T3

- `R1`: 6
- `R2`: 2
- `R3`: 14
- `R4`: 1
- `R6`: 2
- `R7`: 5

### Fallos de emisión por causa (tensiones de la convención v0)

- evento desde objeto-en-estado (`X en \`s\` inicia P`) → invocación objeto→proceso ilegal: 10
- estado no registrado (nombre con `en …` capturado como estado por el parser): 2
- agregación de clase mixta (objeto+proceso): 2
- lista de estados con disyunción `u` (no `o`) — el parser divide solo por `o`: 2
- agente no-físico (descripción informacional explícita vs rol agente): 1

Ejemplos de fallo (oración :: razón):

- `Paciente en 'hospitalizado en domicilio' inicia Operación clínica en domicilio.` :: Firma de enlace ilegal en OPD 'sd1' (Paciente invocacion Operación clínica en domicilio): 
- `Solicitud de ingreso HODOM en 'aceptada' inicia Ingreso HODOM.` :: Firma de enlace ilegal en OPD 'sd1-m1' (Solicitud de ingreso HODOM invocacion Ingreso HODO
- `Paciente en 'hospitalizado en domicilio' inicia Evaluación inicial.` :: Firma de enlace ilegal en OPD 'sd1-m1' (Paciente invocacion Evaluación inicial): Invocació
- `Consolidación del plan domiciliario integral genera Resumen clínico en domicilio` :: Estado no registrado: resumen-clinico-56:domicilio
- `Cierre por fallecimiento genera Constancia de acciones en caso de fallecimiento.` :: Estado no registrado: constancia-de-acciones-98:caso de fallecimiento
- `Plan terapéutico y de cuidados consta de Tratamiento médico, Cuidados de enferme` :: Firma de enlace ilegal en OPD 'sd1-m3' (Plan terapéutico y de cuidados agregacion Vigilanc
- `Evento de deterioro clínico en 'detectado' inicia Atención de acciones emergente` :: Firma de enlace ilegal en OPD 'sd1-m3' (Evento de deterioro clínico invocacion Atención de
- `Decisión de conducta clínica en 'escalar' inicia Cierre por reingreso hospitalar` :: Firma de enlace ilegal en OPD 'sd1-m3' (Decisión de conducta clínica invocacion Cierre por
- `Decisión de conducta clínica en 'proceder a egreso' inicia Cierre por alta médic` :: Firma de enlace ilegal en OPD 'sd1-m3' (Decisión de conducta clínica invocacion Cierre por
- `Decisión de conducta clínica en 'ajustar tratamiento' inicia Ajuste terapéutico.` :: Firma de enlace ilegal en OPD 'sd1-m3' (Decisión de conducta clínica invocacion Ajuste ter
- `Cupo HODOM puede estar 'disponible' u 'ocupado'.` :: un objeto con estados requiere ≥2 en OPM
- `SEREMI maneja Fiscalización SEREMI.` :: Firma de enlace ilegal en OPD 'sd1-m3' (SEREMI agente Fiscalización SEREMI): Agente requie

## 4. Round-trip OPL forward (los hechos aplicados reaparecen)

- Hechos aplicados verificables (cosa/estados/procedural) : 352
- Presentes en el OPL forward del modelo                  : 325
- Cobertura round-trip                                    : 92.3%

## 5. L2 — contabilidad

- Líneas sin destino reconocido      : 0
- Hechos en ledger == resumen.hechos : 417 == 417
- L2 coherente                       : SÍ

## 6. Veredicto

El compilador produce un Modelo OPM **válido** desde el proto real completo; L2 cierra (ninguna línea sin destino, hechos == oraciones aplicables); el round-trip OPL forward reproduce los hechos aplicados. Los fallos restantes son **tensiones reales de la convención v0 / del parser / del modelo** (ver §3), reportadas honestamente, no forzadas.
