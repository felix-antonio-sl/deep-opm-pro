# De-risking F4 — byte-identidad de migrar V3/V4/V5/V7 en HODOM

**Naturaleza:** read-only sobre `hd-opm` (NUNCA escribe el proto). Reescribe en memoria las
líneas migrable-estricto a su forma E2 y compara el bundle. **Regenerar:**
`cd app && bun run scripts/derisk-f4-migrables-hodom.ts`. Reemplaza al previo.

## 1. Reescrituras laxo → E2 (las 7 líneas migrables)

- **V5** ✓
  - laxo: `Monitorización de signos vitales detecta Evento de deterioro clínico.`
  - E2  : `Monitorización de signos vitales genera Evento de deterioro clínico.`
- **V3** ✓
  - laxo: `Discrepancia de conciliación en estado 'detectada' puede iniciar Ajuste terapéutico.`
  - E2  : `Discrepancia de conciliación en estado 'detectada' inicia Ajuste terapéutico.`
- **V7** ✓
  - laxo: `Traslado del paciente al establecimiento precede a Cierre por reingreso hospitalario.`
  - E2  : `Traslado del paciente al establecimiento invoca Cierre por reingreso hospitalario.`
- **V3** ✓
  - laxo: `Dispositivo invasivo en estado 'con complicación' puede iniciar Atención de acciones emergentes.`
  - E2  : `Dispositivo invasivo en estado 'con complicación' inicia Atención de acciones emergentes.`
- **V4** ✓
  - laxo: `Resultado de examen alimenta Evaluación clínica evolutiva.`
  - E2  : `Evaluación clínica evolutiva requiere Resultado de examen.`
- **V4** ✓
  - laxo: `Resultado de interconsulta alimenta Evaluación clínica evolutiva.`
  - E2  : `Evaluación clínica evolutiva requiere Resultado de interconsulta.`
- **V7** ✓
  - laxo: `Evaluación de entorno seguro precede a Realización de la atención en domicilio.`
  - E2  : `Evaluación de entorno seguro invoca Realización de la atención en domicilio.`

## 2. Guardas de validez (el veredicto byte solo vale si TODAS pasan)

- Las 7 reescrituras se aplicaron al proto                      : SÍ
- Modelo observable idéntico (entidades/enlaces/estados/anclas) : SÍ
- Uso familia-V migrable cayó a 0                               : SÍ (7 → 0)
- Uso requiere-decisión intacto                                 : SÍ (20 → 20)
- Guardas OK                                                    : SÍ

## 3. Veredicto byte-a-byte

✅ **BYTE-IDÉNTICO.** Migrar V3/V4/V5/V7 a su forma E2 en el proto HODOM produce el MISMO
bundle, byte a byte. **F5-parcial es cambio de cero costo**: el operador solo debe bendecir la
edición del proto (7 líneas) y el retiro de esas 4 reglas del compilador — sin re-pin del golden.

## 4. Hallazgo colateral (corregido)

La primera corrida de este de-risking falló la guarda «modelo observable idéntico» por un
**bug de reentrancia**: el contador de `claveProto` de colas (`cola-fina-N`) era módulo-global
(`emisor.ts`), no por-compilación — compilar dos protos en un proceso daba claves divergentes
(`cola-fina-1..10` y luego `11..20`), violando el diseño W5.2 (claveProto estable nacida en el
proto). Corregido hilando un holder `secuenciaColaAncla` por compilación en `ContextoEmision`
(test de reentrancia en `anclas.test.ts`). El de-risking no es byte-confiable sin esta corrección.
