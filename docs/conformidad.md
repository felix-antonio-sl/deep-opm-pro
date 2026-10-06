# Conformidad de OpForja

Canon vendorizado: reglas OPM 1.5.0, spec-OPD 1.4.0, spec-OPL 1.4.1 y metodología 1.7.0; versiones y precedencia en [canon/LEEME.md](../canon/LEEME.md).
Estados admitidos (R-APP-2): `enforzado`, `parcial`, `no implementado`, `zona laxa pendiente`.
Superficies (R-APP-3): U = UI, N = núcleo, I = importación, G = generación OPL, P = parseo OPL, X = exportación. Cierre sólo con evidencia de todas las superficies aplicables.

DEC 30 conserva el registro compacto y su evidencia anterior íntegra en [bitácora](rehacer/bitacora.md#conformidad-anterior-al-paso-1-de-decisión-30).
DEC 29 retira las representaciones locales de abanico; su realización en paso 2 está en verificación. DEC 31–32 y defectos del dictamen siguen pendientes de pasos 3–4; no hay aceptación nueva por esta actualización.

## Brechas

| id | regla | estado | U N I G P X | qué hace el producto | decisión |
|---|---|---|---|---|---|
| B-02 | Descomposición de objeto (T-072, R-OPL-CX-4, DR-23) | parcial | U·N·I·P | N rechaza descomponer objetos; I convierte a despliegue sin crear enlaces o descarta el OPD redundante. U/P pendientes. | DEC 2, DS-18; parser pendiente: unsupported-canonical. |
| B-03 | Agente humano (R-AG-1, AP-05, T-045) | parcial | N | N exige objeto físico y emite info agente-humano; no verifica el papel humano. | DEC 3, DR-5: juicio humano; referencia T-ID a revisar en paso 4. |
| B-04 | Multiplicidad sin hueco junto a `c`, en efecto con estados y en SSE (T-057, DR-44, EBNF A.5/A.6/A.8) | parcial | U·N·I·P | N rechaza las tres combinaciones sin plantilla; I retira multiplicidades con informe. U/P pendientes. | DR-44; multiplicidades en abanico pendientes de revisar por S4. |
| B-05 | Recíproco con estados sin etiqueta (SE5 con estado, reglas §4.10) | parcial | U·N·I·P | Consulta/creación N exigen etiqueta para recíproco con estado y normalizan con traza; I descarta anclajes sin etiqueta. U/P pendientes. | Reglas §4.10; parser pendiente: unsupported-canonical. |
| B-06 | Efectos sin plantilla FAN-5/5A y extremo común en estado (R-FAN-EST-1, PUEDE) | parcial | U·N·I·G·P | N rechaza el común en estado y TS3 salida común sin literal; I retira sólo el abanico con informe, conserva enlaces/estados. G atómico tras import. U/P pendientes. | DEC 29: extremo común en estado no implementado (PUEDE); no se añade dialecto ni representación local. |
| B-07 | Ruta fuera de consumo y resultado (C-25, T-058) | parcial | U·N·I·P | N limita rutas a consumo/resultado y permite fijar/retirar valores; I descarta otras rutas con informe. U/P pendientes. | DR-19; parser pendiente: unsupported-canonical. |
| B-08 | Control en abanico sin plantilla (T-056, T-124, C-19b; C-18 instrumento/agente) | parcial | U·N·I·P | N exige control uniforme y combinaciones con plantilla; I descarta el abanico sin perder controles. U/P pendientes. | Reglas §7.4; condiciones C-18 con estados pendientes de reparar por S3. |
| B-09 | Plurales por multiplicidad (DR-12, T-128) | parcial | G·P | G usa nombre singular con frase de multiplicidad antepuesta; plural canónico no acreditado en P. | DR-12; parser pendiente de WP-9. |
| B-10 | Participación distinta de `?`, `*`, `+` (numérica, rangos y exactamente un) | parcial | I·P | I normaliza equivalencias legacy admitidas y descarta participaciones no canónicas por campo, con informe. P pendiente. | DR-21; parser pendiente: unsupported-canonical. |
| B-12 | Import con violaciones canónicas (T-288, R-ESC-OP-4) | parcial | I | I recupera contextos representables y descarta elementos irrepresentables con informe; positivos satisfacen forma. Gates X tienen cobertura acotada. | P8, DS-19; no acredita un pipeline adicional ni todas las reparaciones de importación. |
| B-13 | Bisimetrías parciales declaradas (R-§19-ROT-1, T-193) | parcial | G·P | DS-10 emite ramas con ruta sin transportar XOR/OR por OPL; JSON conserva datos. Reconstrucción estricta no comprobada. | DESIGN §5.9: diez bisimetrías parciales; inversa WP-9/10/19 pendiente. |
| B-14 | Heurísticas léxicas R-NOM-* y frase breve R-OPL-SE-1 (T-266) | parcial | N | N emite heurísticas de nombres/etiquetas con falsos positivos y negativos posibles; requiere juicio contextual. | DEC 19; no se declara detector lingüístico completo. |
| B-15 | Cruces y oclusión (R-LAY-2, T-284) | parcial | X | X advierte cruces, atravesamientos y solapes sin reruteo; escena conserva radios 30/35 y no busca representaciones alternativas. Menú/minimización global pendientes. | DEC 29; modelos importados con errores recuperables conservan sus gates y respuesta rechazada, sin throw geométrico. |
| B-16 | Extensiones con sintaxis OPL fuera de alcance (CANON §0.4) | parcial | I·P | I descarta extensiones fuera de alcance y vistas tipificadas con informe; P aún no implementado. | CANON §0.4, DEC 9: unsupported-canonical; Pr= fuera de abanico, non-canonical. |
| B-17 | Inconsistencias inter-OPD (R-OPD-VAL-6, T-094, DEBERÍA) | parcial | N | N detecta refinador en varios contextos y general redundante; reparación elimina este último diagnóstico. No es validador inter-OPD general. | R-OPD-VAL-6; alcance diagnóstico acotado. |
| B-18 | Estado sin escritor con excepciones LF-19 (T-271) | parcial | N | N informa estado sin escritor; exceptúa inicial, ambiental, salida no especificada y glosa Coproducto XOR-n recuperable. | LF-19; no demuestra ejecución ni exhaustividad semántica. |
| B-19 | R-VIS-HIJO-1 (T-086): procedimentales distributivos visibles en el contorno del hijo | parcial | N·G·X | N mantiene agente/instrumento/efecto sin estado en contorno del hijo; X observa esas tres variantes. G específica del contorno pendiente. | DR-13: desvío declarado; no habilita consumo/resultado ni evento sistémico en contorno. |
| B-20 | Duración sin excepción que la cite (R-BI-DUAL-1, T-193) | zona laxa pendiente | G·P | Duración sin EX carece de oración y queda en JSON; evidencia G sobre EX no cierra su ausencia ni P. | Canon sin plantilla; strict pendiente. T204/T220 conservan crecimiento inscrito; export y mirada individual realizados en paso 2, sin aceptación de ola. |
| B-22 | Gate >25 cosas (R-LAY-1, T-283): exención salvo vista tipificada o refinamiento declarado | parcial | X | Gate por OPD bloquea >25 cosas; X observa permitir 21/25 y rechazar 26. Exención por refinamiento incumplida; menú pendiente. | Bloqueo conservador declarado; sin vistas tipificadas. |
| B-23 | AP-14: estados duplicados para inicio/fin, bloqueo como sinónimo falso | zona laxa pendiente | N | N reconoce igualdad nominal, no sinonimia inicio/fin; permite estado inicial-final sin detector semántico adicional. | GAP-15: juicio humano; DEBE de sinonimia sin enforzar. |
| B-24 | AP-22 sinónimos y AP-25 proceso de soporte sin esfuerzo sostenido, DEBE reportarse | zona laxa pendiente | N | N comprueba unicidad nominal y ausencia de transformación; no identifica sinónimos ni esfuerzo sostenido. | GAP-15; heurísticas no cierran AP-22/AP-25. |
| B-26 | T-100: OPL completo cubre todo el modelo cargado | parcial | G·X | N bloquea documento por huérfanos; G genera bloques visibles. X observa cosa sin aparición: diagrama local permitido/documento rechazado. Menú pendiente. | DS-6, CC-01; no acredita todos los huérfanos ni cobertura textual completa. |
| B-27 | T-106 / DR-2 frente a mención mínima T-190/R-BI-DUAL-1 | parcial | G·P | G emite D2 mínimo para cosa visible no mencionada y nunca D4; P/strict pendientes. | DS-2, CC-27: desvío consciente de DR-2. |
| B-28 | T-040 / DESIGN §10.2: equivalencia menú/creación por resultado efectivo con refinamientos | parcial | N·U | N comparte distribución pura entre consulta, creación y reparación y compara resultado final con original (DS-20). U pendiente. | Integración refinada histórica WP-4r; S5 exige revisar reordenamiento de bandas, sin crédito UI/strict. |
| B-29 | T-085/T-261: continuidad R+C abstraída y metadatos de conflictos (R-PREC-1/2/3/4, AP-30) | parcial | N·G·X | N recompone R+C con continuidad de identidad/estados y conserva procedencia; X observa continuidad y su negativo. G específica pendiente. | DEC 31 cambia precedencia temporal; celdas de Tabla 27 se implementarán/probarán en paso 3. |
| B-30 | T-260/T-261/T-283: integración temporal del catálogo de diagnóstico y gates | parcial | N·U | N tiene catálogo/gates y reparaciones reales que retiran sus diagnósticos; U pendiente. No acredita importación adicional ni parser. | CC-23; S6/S7 y límites por fila pendientes de reparar, sin crédito OPD↔OPL. |

## Reservas del registro

Paso 4 auditará las filas ausentes B-01/B-11/B-21/B-25, el retiro de simulación DEC 26 y los T-ID faltantes/erróneos del [dictamen externo §6](rehacer/evaluacion/dictamen-e53fb47.md). Los registros de realizaciones locales retiradas por DEC 29 y su evidencia G permanecen en la bitácora, sin crédito de funcionalidad actual. Los defectos S2–S7/G1–G5 siguen pendientes; el paso 2 no los recertifica.

## Trazabilidad ★ y bisimetrías

El objetivo ★ sigue en DESIGN §12.6 y CANON §9; sus T-ID pendientes se revisan en paso 4. Las diez bisimetrías parciales siguen en DESIGN §5.9/B-13 y conservan JSON; las tablas finales se completan en WP-19. Generación, códec e importación comprobados en paquetes históricos no acreditan OPD↔OPL estricto: inversa WP-9, integración WP-10 y H2 siguen pendientes. Detalles, negativos y límites históricos constan íntegros en la bitácora.
