# Conformidad de OpForja

Canon vendorizado: reglas OPM 1.5.0, spec-OPD 1.4.0, spec-OPL 1.4.1 y metodología 1.7.0; versiones y precedencia en [canon/LEEME.md](../canon/LEEME.md).
Estados (R-APP-2): `enforzado`, `parcial`, `no implementado`, `zona laxa pendiente`. Superficies (R-APP-3): U UI, N núcleo, I importación, G generación OPL, P parseo OPL, X exportación. No se cierra una regla por una sola superficie.
Historia original íntegra en [bitácora](rehacer/bitacora.md#conformidad-anterior-al-paso-1-de-decisión-30). Pasos 1+2 publicados `26935f4`, paso 3 `5d23f8a`; paso 4 publicado `69aee956`, revisión única de ola 1–4 favorable. WP-9 publicado2abecc6 con check2653/0/TSC0; WP-13 publicado bc22451d tras revisión conjunta GLOBAL_FAVORABLE y aceptación técnica de dirección con gate2756/0/TSC0/exit0; H2 se detuvo y fue reanudado por instrucción directa. WP-10 publicado c94178fa tras aceptación técnica con check2783/0/TSC0/exit0; WP-12 publicado6c99b17 con fuentes falsas. WP-14 publicado efbe04a tras aceptación técnica: armazón/acceso/Biblioteca/Informe y build total verdes. WP-15 publicado ed5e0f8 con lienzo y cambio de tipo con datos atómicos: check2855/0/TSC0 y build total verdes. WP-16 cerrado y aceptado técnicamente en este commit tras la misma revisión de ola4 GLOBAL_FAVORABLE: paneles, selección visible, tipografía OPL y orientación atómica autorizada. Gate final2884/0/TSC0/exit0, build8 total0 y browser8/10; crédito U acotado, e2e completos pendientes. Dirección conserva Git y verifica publicación; WP17 tras remoto verificado. DEC 29 retiró B-31/B-32/B-33/FANLOCAL; no son funciones actuales.

## Brechas

| id | regla | estado | U N I G P X | qué hace el producto | decisión |
|---|---|---|---|---|---|
| B-01 | RX1/RX2 puede ser (R-OPL-RF-5, DR-10) | no implementado | U·P | P reconoce RX1/RX2 como unsupported-canonical; conserva modelo y no inventa especialización. U pendiente. | DEC 1; analizar/lente WP-9, capacidad sin implementar. |
| B-02 | Descomposición de objeto (T-072, R-OPL-CX-4, DR-23) | parcial | U·N·I·P | N rechaza descomponer objetos; I convierte a despliegue o descarta redundante. P informa unsupported-canonical sin acciones; U pendiente. | DEC 2, DS-18; no nueva descomposición de objeto. |
| B-03 | Agente humano (R-AG-1, AP-05, T-045) | parcial | N | N exige objeto físico y emite info agente-humano; no verifica el papel humano. | DEC 3, DR-5: juicio humano. |
| B-04 | Multiplicidad sin hueco (T-057, DR-44, EBNF A.5/A.6/A.8) | parcial | N·I·G·U·P | N comprueba huecos por rama/extremo; I retira fan/campo irrepresentable con informe y sin perder ramas. G conserva ofrecidas; P usa las mismas guardas al ensayar. U pendiente. | S4/WP-9; no nueva plantilla ni multiplicidad inventada. |
| B-05 | Recíproco con estados sin etiqueta (SE5 con estado, reglas §4.10) | parcial | U·N·I·P | N exige etiqueta para recíproco con estado; I descarta anclaje sin etiqueta. P bloquea firma irrepresentable sin mutar; U pendiente. | Reglas §4.10; no recuperar una etiqueta inexistente. |
| B-06 | Efectos sin plantilla FAN-5/5A y extremo común en estado (R-FAN-EST-1, PUEDE) | parcial | U·N·I·G·P | N rechaza común en estado y TS3 salida común sin literal; I retira sólo fan con informe. G atómico tras import; P excluye línea entera del dominio retirado. U pendiente. | DEC 29; FAN5s/e/A ofrecidos sí recuperan único grupo atómico. |
| B-07 | Ruta fuera de consumo y resultado (C-25, T-058) | parcial | U·N·I·P | N ofrece rutas sólo C/R; I retira otras rutas con informe. P informa unsupported-canonical para rutas fuera de esas firmas; U pendiente. | DR-19; conserva etiqueta de ruta sin interpretar su contenido como gramática. |
| B-08 | Control en abanico sin plantilla (T-056, T-124, C-18/19b) | parcial | N·I·U·P | C18 con estado carece de hueco: N rechaza, I retira sólo fan conservando ramas. P ensaya mismas guardas y excluye línea irrepresentable; CS1 atómico permanece. U pendiente. | S3/DR-31; no dialecto para controlar ramas con estados. |
| B-09 | Plurales por multiplicidad (DR-12, T-128) | parcial | G·P | G antepone multiplicidad al nombre singular; P recupera ese literal y clasifica plural verbal no soportado como unsupported-canonical. | DR-12; no acredita inflexión plural lingüística ni la ofrece. |
| B-10 | Participación distinta de `?`, `*`, `+` (numérica, rangos y exactamente un) | parcial | I·P | I normaliza equivalencias legacy admitidas o retira el campo con informe. P reconoce participación numérica/rango no ofrecida y deja línea sin acciones. | DR-21; ?/*/+ canónicos sí se reconstruyen. |
| B-11 | Despliegue dedicado se despliega por modo en | no implementado | P | P reconoce la forma dedicada se despliega por modo en como unsupported-canonical. CX3 genérico emitido sí reconstruye los cuatro modos por sus relaciones. | spec-OPL §7/WP-9; no nueva oración dedicada. |
| B-12 | Import con violaciones canónicas (T-288, R-ESC-OP-4) | parcial | I | I recupera contextos representables y descarta elementos irrepresentables con informe; positivos satisfacen forma. Gates X tienen cobertura acotada. | P8, DS-19; no acredita un pipeline adicional ni todas las reparaciones de importación. |
| B-13 | Bisimetrías parciales declaradas (R-§19-ROT-1, T-193) | parcial | G·P | Auto-reparseo conserva identidad/JSON; estricto recupera texto en corpus ofrecido. Diez parciales reproducidas siguen pérdidas textuales: DS10 no transporta operador. | DESIGN §5.9; lente/WP-9 y modelos WP-10: 49 OPDs auto, cinco documentos estrictos ofrecidos; H3 pendiente. |
| B-14 | Heurísticas léxicas R-NOM-* y frase breve R-OPL-SE-1 (T-266) | parcial | N | N emite heurísticas de nombres/etiquetas con falsos positivos y negativos posibles; requiere juicio contextual. | DEC 19; no se declara detector lingüístico completo. |
| B-15 | Cruces y oclusión (R-LAY-2, T-284) | parcial | X | X usa incidencia por tramo/peine y puerto de estado; avisa caja/cápsula ajena al tramo, área de rótulo (incluso propio), figura estructural, cruce, solape y punta corta. Pintura fina aclara etiquetas propias sin mover centros; no rerutea ni garantiza layout libre. | G1/G2/G5; importados con separación insuficiente conservan avisos/gates. |
| B-16 | Extensiones con sintaxis OPL fuera de alcance (CANON §0.4) | parcial | I·P | I descarta extensiones/vistas tipificadas con informe. P clasifica unsupported-canonical/non-canonical antes del residual; nombres/estados/rutas opacos preservan su tipo. | CANON §0.4, DEC 9/29; sin parser local de extensiones. |
| B-17 | Inconsistencias inter-OPD (R-OPD-VAL-6, T-094, DEBERÍA) | parcial | N | N detecta refinador en varios contextos y general redundante; reparación elimina este último diagnóstico. No es validador inter-OPD general. | R-OPD-VAL-6; alcance diagnóstico acotado. |
| B-18 | Estado sin escritor con excepciones LF-19 (T-271) | parcial | N | N informa estado sin escritor; exceptúa inicial, ambiental, salida no especificada y glosa Coproducto XOR-n recuperable. | LF-19; no demuestra ejecución ni exhaustividad semántica. |
| B-19 | R-VIS-HIJO-1 (T-086): procedimentales distributivos visibles en el contorno del hijo | parcial | N·G·X | N mantiene agente/instrumento/efecto sin estado en contorno del hijo; X observa esas tres variantes. G específica del contorno pendiente. | DR-13: desvío declarado; no habilita consumo/resultado ni evento sistémico en contorno. |
| B-20 | Duración sin excepción que la cite (R-BI-DUAL-1, T-193) | zona laxa pendiente | G·P | Duración sin EX no tiene oración; JSON la conserva. Auto-reparseo no la cambia, importación desde texto no la reconstruye. | Canon sin plantilla; parcial5 reproducida en lente.test, no capacidad nueva. |
| B-21 | Modos visuales/simulación runtime (T-230) | no implementado | U | Runtime/simulación retirados; controlador WP-13 realiza cuatro estados efímeros, UI aún pendiente. Current declarado no es runtime. | RETIRADA DEC 26; no crédito de modos UI ni simulación por el controlador. |
| B-22 | Gate >25 cosas (R-LAY-1, T-283): exención salvo vista tipificada o refinamiento declarado | parcial | X | Gate por OPD bloquea >25 cosas; X observa permitir 21/25 y rechazar 26. Exención por refinamiento incumplida; menú WP16 expone gates y navegación, sin exención nueva. | Bloqueo conservador declarado; sin vistas tipificadas. |
| B-23 | AP-14: estados duplicados para inicio/fin, bloqueo como sinónimo falso | zona laxa pendiente | N | N reconoce igualdad nominal, no sinonimia inicio/fin; permite estado inicial-final sin detector semántico adicional. | GAP-15: juicio humano; DEBE de sinonimia sin enforzar. |
| B-24 | AP-22 sinónimos y AP-25 proceso de soporte sin esfuerzo sostenido, DEBE reportarse | zona laxa pendiente | N | N comprueba unicidad nominal y ausencia de transformación; no identifica sinónimos ni esfuerzo sostenido. | GAP-15; heurísticas no cierran AP-22/AP-25. |
| B-25 | Bocetos/coacción/simulación/extensiones (T-320/321/323/324) | no implementado | U·I·P | Capacidades fuera de alcance: I informa descartes, P reconoce límites y no construye grafos plausibles. U pendiente; arrastre T322 pertenece a UI futura. | CANON §0.4/PUEDE; no dialecto ni simulación nueva. |
| B-26 | T-100: OPL completo cubre todo el modelo cargado | parcial | G·X·U | N bloquea documento por huérfanos; G genera bloques visibles. X observa cosa sin aparición: diagrama local permitido/documento rechazado. U WP16 muestra los gates por export e Ir. | DS-6, CC-01; no acredita todos los huérfanos ni cobertura textual completa. |
| B-27 | T-106 / DR-2 frente a mención mínima T-190/R-BI-DUAL-1 | parcial | G·P | G emite D2 mínimo informacional para visible no mencionado; P reconstruye su dimensión sin perder género expresado por D1/D4. | DS-2/CC-27: desvío de DR-2 permanece; strict WP-9 acotado a superficies emitidas. |
| B-28 | T-040 / DESIGN §10.2: consulta/creación por resultado efectivo refinado | parcial | N·U | N comparte distribución pura y DS-20 final/original; rechazo AP-29 en destino distribuido sin reservar ID. fijarBandas invierte sólo si el contexto final es válido; excepción exclusiva moverSubproceso intacta. U pendiente. | S5/S7; las 8000 acciones y generador históricos se conservan. |
| B-29 | T-085/T-261: continuidad R+C abstraída y metadatos de conflictos (R-PREC-1/2/3/4, AP-30) | parcial | N·G·X | N aplica las nueve celdas temporales y la simétrica para orden desconocido; recompone R↔C sólo con continuidad trazable, conserva hechos y errores. G específica pendiente. | DEC 31–32: frontera/DS16/LF-03/costo y dos vistas reales observados; check1830/0/TSC0 y ola1–4 favorable/publicada69aee956; superficies G aún pendientes. |
| B-30 | T-260/T-261/T-283: catálogo y gates | parcial | N·U | Catálogo conserva códigos y reparaciones reales; trivial cuenta refinadores revelados, no todos los nucleares. AP-29/ESCIND-2 y límite RROL1 trazables; heurística deverbal acotada. U WP16 consume catálogo, tres grupos, Ir y reparaciones opt-in con un undo; auditoría completa pendiente. | S6/S7; CC-23, sin crédito de parser ni auditoría lingüística completa. |
| B-34 | Cambio distributivo de rol neto cero (R-ROL-1, PUEDE) | no implementado | N·I·G·X·U·P | N identifica instrumento ancestro/efecto hijo con mismo estado explícito y rechaza no-ofrecido; I conserva enlaces. P respeta el rechazo sin acciones; gates bloquean X, U pendiente. | S3/S7/WP-9; límite producto recuperable, no prohibición OPM. |

## Trazabilidad ★

Requisitos ★ de CANON §9, con evidencia por superficie. Un título o inventario no acredita el comportamiento ni la inversa; cada fila limita las superficies realizadas. U acredita interacciones parciales realizadas en WP-14/15/16, incluidos paneles; e2e completos pendientes. WP-10 acredita auto de todos los OPDs importados y estricto sólo en documentos ofrecidos por gates, sin limpiar modelos; H2 tiene revisión conjunta GLOBAL_FAVORABLE y aceptación técnica de dirección, sin ampliar el crédito de las filas. Las referencias históricas son ubicaciones de contraste, sin recertificarlas por esta tabla.

| requisito | regla / alcance | estado | superficies | evidencia y límite |
|---|---|---|---|---|
| T-001 | R-CONF-7, R-APP-2, Anexo A «Deuda» | parcial | P | analizar.test comprueba regla y registro de cada límite inverso. No acredita auditoría completa del canon/deuda ni enforzado global. |
| T-003 | R-ZNC-1/2, R-APP-5, R-AP-0C, R-OPD-VAL-4, R-§23-DEP-2, R-COMB-1 | parcial | N·I | Inventario de primaria y metadatos en trazabilidad.test; auditoría semántica completa de matriz/catálogo pendiente de revisión global. Recuperación import probada, no permiso por silencio. |
| T-004 | R-DOC-7, R-CONF-4, R-BI-3 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-005 | R-OPL-LANG-4/5, R-OPL-EQ-5 | parcial | G | vocabulario.test y plantillas.test: léxico español funcional; U pendiente. |
| T-006 | R-CONF-1, R-CONF-4, R-VIS-PRIM-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/codec/codec.test.ts; alcance específico, cierre por superficies pendiente |
| T-010 | R-BI-0/1, R-OPD-BIM-2, R-META-5, R-CONSIST-1 | parcial | N·G·P·X | Mismo modelo/hecho y pureza; inversa G/P y controlador realizados en corpus ofrecido, contrastados en revisión H2. WP-10 añade auto de 49 OPDs y cinco documentos estrictos desde base nueva; OnStar/Async/Sync conservan gates. U WP15/16 consume el mismo modelo en lienzo/paneles; diez parciales y bisimetría global pendientes. |
| T-011 | R-OPL-EDIT-5/8, R-OPD-BIM-2 | parcial | N·P·U | estado/comandos/gestos/lienzo.test y browser WP-15: operaciones reales, cambio con datos atómico, ID/undo/Franja, cámara/gestos. WP16 añade Plan OPL vigente, aplicar atómico/undo y batch diagnóstico real; e2e completos pendientes. |
| T-012 | R-COSA-1, R-META-14, R-ENT-1 | enforzado | N·I | tipos.test negativas compiladas de tercer tipo + codec.test rechazo real de categorías. |
| T-013 | R-OBJ-3, R-OPD-COSA-2/4, R-REF-4, R-CTRN-1 | enforzado | N | cosas.test/trazabilidad.test: defaults objeto/proceso y mismos datos intrínsecos entre apariciones. |
| T-014 | R-COSA-2, R-OPD-COSA-1 | parcial | N·X | tipos/escena derivan glifo y perseverancia del tipo; no campo persistido específico. Auditoría global pendiente. |
| T-015 | R-EST-1, R-PROC-4, R-OPD-EST-1/2, R-ENT-EST-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec.test.ts, src/nucleo/estados.test.ts; alcance específico, cierre por superficies pendiente |
| T-016 | R-EST-2/3, R-OPD-EST-5 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/nucleo/estados.test.ts; alcance específico, cierre por superficies pendiente |
| T-018 | R-OPD-EST-8, LF-03, R-CX-EST-2, R-OPL-TOTAL-5 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/estados.test.ts, src/nucleo/proyeccion.test.ts; otros casos en suites del requisito; alcance específico, cierre por superficies pendiente |
| T-019 | R-ATR-1/2, R-ENT-ATR-1/2 | enforzado | N·G·X | trazabilidad.test: RF2/D5, estados propios del objeto exhibido y export SVG genuino; no colección nuclear de atributos. |
| T-021 | R-EXC-4/5, R-PROC-3, R-OPD-INV-6 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/codec/codec.test.ts; alcance específico, cierre por superficies pendiente |
| T-022 | R-IDP-0C/2/3, R-META-9, Anexo A «Identidad», AP-17 | parcial | N·I·G·X·U según prueba | codec-reglas/ids/modelo/enlaces.test; WP-15 browser conserva ID/seq al cambiar tipo con etiquetas y deshacer. P y resto de UI pendientes; no cierre global. |
| T-023 | R-VIS-APP-1, R-PRIN-9, R-INS-2, DR-25 | enforzado | N·I·X | trazabilidad.test/cosas.test: identidad compartida dos OPD y geometrías distintas; rechazo ya-aparece sin IDs. |
| T-024 | método §9.15/A8.2, R-VIS-NOM-1, DR-22 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-025 | R-§18-LEX-1, R-OPL-LEX-1..3, R-OPD-ROT-5, R-VIS-AUTOR-2, DR-8 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/nucleo/cosas.test.ts, src/nucleo/lexico.test.ts; alcance específico, cierre por superficies pendiente |
| T-026 | R-META-13, reglas §5.1, método §9.23 | enforzado | N·I | tipos.test negativas compiladas binariedad/firmas + matriz.test 15 firmas y codec.test. |
| T-027 | R-ECA-4, R-MOD-NAT-1, R-COMB-3, R-§21-OPL-MOD | parcial | N·G·X | tipos.test lista/doble-control inválidos; fijarControl e↔c real conserva ID/cantidad y cambia ambas expresiones; U/P pendientes. |
| T-028 | spec-OPL §8.1, R-FAN-HAB-1, R-VIS-FAN-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/nucleo/abanicos.test.ts; alcance específico, cierre por superficies pendiente |
| T-029 | método F, R-INV-2D, R-IDP-0A | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/codec/codec.test.ts; alcance específico, cierre por superficies pendiente |
| T-030 | R-IDP-0/0A/0B, R-INV-2D, R-LAY-4 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/codec/codec.test.ts; alcance específico, cierre por superficies pendiente |
| T-031 | R-ARB-1/3/4, R-IDP-1/1A, DR-4 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/proyeccion.test.ts; alcance específico, cierre por superficies pendiente |
| T-032 | R-ESCIND-0, DR-7 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-derivados.test.ts, src/codec/codec-reglas.test.ts, src/codec/codec.test.ts; otros casos en suites del requisito; alcance específico, cierre por superficies pendiente |
| T-033 | método A3.3, R-HIJO-6 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts; alcance específico, cierre por superficies pendiente |
| T-036 | R-EJEC-3, R-OPD-SIM-6, Anexo A «Estado» | parcial | I·X | trazabilidad.test: runtime descartado con informe, ausente JSON/SVG; Current declarado permanece. UI retirada DEC 26. |
| T-040 | R-EDIT-1, R-OPD-EDIT-1, Anexo A «Firma» | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; otros casos en suites del requisito; alcance específico, cierre por superficies pendiente |
| T-041 | R-EDIT-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-042 | reglas §5.2 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-043 | R-RES-1, AP-04, R-OPD-TR-3 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-044 | R-EFE-1, R-OBJ-2, R-OPD-EST-3 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-045 | R-AG-1/1A/1B, AP-05, R-OPD-HAB-1, método F, DR-5 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-046 | R-INV-1, R-IV-1, R-OPD-INV-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-047 | R-EXC-1/2/3, R-EXC-DUR-1, R-OPD-CTL-6, reglas l.115 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-048 | R-STRF-1/2/2A, R-EST-PERS-1/2, R-OPD-STR-3 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/estados.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-049 | R-OPL-SE-2, R-EST-TAG-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-051 | R-MOD-1..4, R-MOD-INPUT-1/2, R-MOD-CAT-1/2, R-EXC-1B, AP-01/02/08/09/10 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-052 | R-COMB-3, AP-28, R-§21-OPL-MOD | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-053 | R-ROL-UNIC-1, R-HAB-AG-5, R-OPD-HAB-4, reglas §6.5, DR-6 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/abanicos.test.ts, src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-054 | spec-OPL §8.1, reglas §7.2, R-FAN-HAB-1, DR-9 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/nucleo/abanicos.test.ts, src/nucleo/cosas.test.ts; otros casos en suites del requisito; alcance específico, cierre por superficies pendiente |
| T-055 | AP-03, R-OPD-CTL-8, R-FAN-4 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/abanicos.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-059 | reglas §3.11, R-OPD-COSA-7, AP-12 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec.test.ts, src/nucleo/estados.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-060 | R-DIST-1, R-CX-DIST-1/2, AP-06, AP-21 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-derivados.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-062 | R-ENT-2, spec-OPL Definiciones («Placeholder»), DR-11 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts; alcance específico, cierre por superficies pendiente |
| T-063 | R-EDIT-3, R-OPD-EDIT-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-064 | R-EDIT-8, R-ESC-OP-3/4, R-APP-4, R-OPD-EDIT-4 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; otros casos en suites del requisito; alcance específico, cierre por superficies pendiente |
| T-065 | R-OPD-ROT-5, AP-22 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts; alcance específico, cierre por superficies pendiente |
| T-066 | método A3.3 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/enlaces.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-070 | R-HIJO-1/3, R-OPD-REF-1/4, R-OPD-OP-1/3, R-VIS-INZOOM-1, R-ANID-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-071 | R-REF-MEC-1, R-HIJO-4, R-CX-DESP-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-073 | R-DIST-1/1A, reglas §8.5, R-OPD-REF-11, R-OPD-EDIT-5, DR-13 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-074 | R-ESCIND-1..3, R-ESC-1/1A, AP-07/08, R-OPD-TR-7 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/estados.test.ts, src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-075 | R-OPD-OP-4, R-CX-DIST (efecto OPL) | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/propiedades.test.ts, src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-076 | R-VIS-DIST-1, método A3.4, DR-13 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-077 | R-REF-NTRIV-1..3, AP-13, R-OPD-REF-7 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/diagnostico.test.ts, src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-078 | R-REF-1, AP-16, R-OPD-REF-8 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-079 | R-HIJO-5 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-080 | R-HIJO-6, R-OPD-REF-5 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-082 | R-OPD-UI-3, R-INV-2/2A | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-083 | R-REF-3, método A4.3/A1.5-d, DR-17 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/proyeccion.test.ts, src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-084 | R-REF-2, AP-15, R-OPD-REF-17 | parcial | N·I·X | trazabilidad.test: tipo nuclear igual en dos OPD. Import overrides visuales incompatible requiere cotejo adicional; no crédito por dibujo solo. |
| T-085 | R-OPL-DISP-3, R-OPD-REF-13, reglas §6.5/§6.6, R-PREC-1..5, AP-30, DR-13 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/proyeccion.test.ts, src/opd/escena.test.ts; alcance específico, cierre por superficies pendiente |
| T-086 | R-VIS-HIJO-1, R-OPD-REF-6 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/proyeccion.test.ts, src/opd/escena.test.ts; alcance específico, cierre por superficies pendiente |
| T-087 | R-OPD-EDIT-6, R-OPD-OP-5, DR-45 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/proyeccion.test.ts, src/nucleo/refinamiento.test.ts; alcance específico, cierre por superficies pendiente |
| T-092 | R-HER-8, AP-29, R-EST-HER-1, R-OPD-STR-6 | parcial | N/I/G/X según prueba; U/P pendientes | src/codec/codec-reglas.test.ts, src/nucleo/matriz.test.ts, src/nucleo/proyeccion.test.ts; alcance específico, cierre por superficies pendiente |
| T-093 | R-HER-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/cosas.test.ts, src/nucleo/estados.test.ts, src/nucleo/herencia.test.ts; alcance específico, cierre por superficies pendiente |
| T-100 | R-OPL-TOTAL-1/2, R-OPL-DISP-1/2, R-OPL-PANEL-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/contratos.test.ts, src/opl/documento.test.ts; alcance específico, cierre por superficies pendiente |
| T-101 | R-OPL-TOTAL-4, R-OPD-EST-9 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-102 | R-OPL-TYPO-1, spec-OPL §1.1, R-§21-OPL-TIPO | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-103 | R-OPL-EBNF-4/5 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-104 | spec-OPL §1, R-OPL-VERB-1, R-§21-OPL-VOCAB, DR-27 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/vocabulario.test.ts; alcance específico, cierre por superficies pendiente |
| T-105 | R-BI-TAB-1, reglas l.41 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/decision29.test.ts, src/opl/plantillas.test.ts; alcance específico, cierre por superficies pendiente |
| T-106 | R-BI-TAB-1 (tabla 9.2), DR-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts, src/opl/plantillas.test.ts; alcance específico, cierre por superficies pendiente |
| T-107 | R-VERB-EST-1, R-ENT-EST-1, D5 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-108 | reglas §4.4, spec-OPL §2.4 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-110 | reglas §4.5 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-111 | reglas §4.6, spec-OPL §4.2 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-112 | reglas §4.7/§4.8, R-ECA-4, R-MOD-NAT-2 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-113 | R-OPL-COND-ALT-2 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-114 | R-COND-RAMA-1/2 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-115 | reglas §4.9, spec-OPL §5.3 (R-EXC-DUR-1, nota de realización), R-OPD-INV-6, DR-18 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts, src/opl/plantillas.test.ts; alcance específico, cierre por superficies pendiente |
| T-116 | reglas §4.9 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-117 | reglas §4.10, R-OPL-RF-1/4/6 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts, src/opl/plantillas.test.ts; alcance específico, cierre por superficies pendiente |
| T-119 | reglas §4.10, R-OPL-SE-5, R-EST-TAG-2 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-122 | reglas §7.3, R-FAN-2, R-FAN-EST-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts, src/opl/plantillas.test.ts; alcance específico, cierre por superficies pendiente |
| T-125 | reglas §4.11, R-OPL-CX-5, R-IV-2, DR-24 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-126 | reglas §4.11, R-OPL-CX-2, R-CX-DESP-2, R-CX-SYNC-2, DR-24 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-127 | R-CX-0, R-OPD-OP-3 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts, src/opl/plantillas.test.ts; alcance específico, cierre por superficies pendiente |
| T-130 | R-OPL-LISTA-1, R-OPL-KW-2, R-§18-LISTA-1, DR-26 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-131 | R-COMP-EJE-3, R-COMP-ELEG-3 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-132 | R-CX-COMP-1..3, R-COMP-ZP-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-133 | R-COMP-ZP-2/3, R-COMP-EJE-4 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-134 | R-COMP-ELEG-3, DR-32 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-135 | R-OPL-INT-1/2/6, R-COMP-MAESTRA-1..3, R-§18-EXT-1, DR-28 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-136 | R-BR-1/3/4, R-OPD-BIM-4 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-137 | R-ENT-INS-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/generar.test.ts; alcance específico, cierre por superficies pendiente |
| T-150 | R-IMPORT-1, R-CONF-3 | parcial | G·P·U | analizar/editor-opl: análisis puro y plan separado de aplicación nuclear; EditorOpl WP16 aplica Plan vigente inmediato con un undo. Diez parciales y e2e completos pendientes. |
| T-151 | spec-OPL §18, R-§19-SIM-2 | parcial | G·P; U pendiente | analizar: subconjunto y límites con regla/registro antes de SE1 residual. |
| T-152 | R-§18-NORM-1, R-MULT-3, R-OPL-RANGO-3 | parcial | G·P; U pendiente | analizar: NFC, espacios, spans opacos, operadores externos; pureza/intercalación. |
| T-153 | R-IMPORT-2 | parcial | G·P; U pendiente | editor-opl/roundtrip-matriz: tipografía crea una vez en el mismo merge real. |
| T-155 | R-IMPORT-4, R-OPL-FALLO-5 | parcial | G·P; U pendiente | editor-opl/Tabla9.2: rechazo nuclear de firma, sin grafo plausible ni IDs consumidos. |
| T-156 | R-IMPORT-5, R-§19-SIM-2, DR-34 | parcial | G·P; U pendiente | analizar/lente: unsupported-canonical conserva original y excluye línea entera. |
| T-157 | R-IMPORT-6, R-CONF-6, R-COMB-1 | parcial | G·P; U pendiente | analizar: non-canonical bloquea; contenido de nombres no es gramática. |
| T-158 | R-IMPORT-7, R-OPD-EDIT-2 | parcial | G·P; U pendiente | editor-opl: tipo incompatible/ambigüedad bloquea; no primer candidato. |
| T-159 | R-IMPORT-8 | parcial | G·P; U pendiente | editor-opl/lente: auto-no-op preserva escisión/posiciones/EX fuente; pérdidas textuales siguen declaradas. |
| T-160 | R-BI-2, R-OPD-BIM-2, Anexo A «Parseo» | parcial | G·P; U pendiente | roundtrip-matriz/azar: import genuino, strict por texto completo; no bisimetría fuera de dominio. |
| T-161 | R-OPL-COND-ALT-1 | parcial | G·P; U pendiente | analizar/editor-opl: COND-ALT recupera consumo condicionado y regenera CT1. |
| T-162 | spec-OPL §2.0/§2.7/§2.8, DR-2 | parcial | G·P; U pendiente | analizar/Tabla9.2: dimensiones literales/ENT3 desde mismas PLANTILLAS. |
| T-164 | spec-OPL §3.5, R-ESCIND-0 | parcial | G·P; U pendiente | lente/roundtrip-matriz: TS4/TS5 standalone sin inventar procedencia de escisión. |
| T-166 | R-BI-DUAL-1, R-OPL-CX-2..5, DR-35 | parcial | G·P; U pendiente | roundtrip-matriz/editor-opl: CX con bandas reales y modos; identidad existente preservada. |
| T-167 | R-OPL-CX-ID-1, R-CX-2 | parcial | G·P; U pendiente | editor-opl: SD1 resuelve ID persistente del hijo, creación en contexto exacto. |
| T-168 | R-OPL-DISP-4, DR-13 | parcial | G·P; U pendiente | editor-opl: EX elevado usa cota/unidad de fuente original por hechos; padre intacto. |
| T-170 | R-EST-TAG-1, DR-36 | parcial | G·P; U pendiente | analizar: SE1 residual mismo tipo y frase no capitalizada; negativos reales. |
| T-171 | spec-OPL §19.5 | parcial | G·P; U pendiente | editor-opl: inversión de líneas deja acciones vacías e identidad intacta. |
| T-172 | R-§19-LENS-1, R-OPL-EDIT-4, R-OPL-FALLO-8 | parcial | G·P; U pendiente | editor-opl/lente: ausencia informa sin borrar; no auto-note al texto completo. |
| T-173 | R-§19-LENS-2 | parcial | G·P; U pendiente | editor-opl: preview puro, replay atómico e IDs de ensayo; rollback sin reserva. |
| T-174 | R-OPL-EDIT-1 | parcial | G·P; U pendiente | editor-opl: cuatro estados/ocho razones y resumen reales. |
| T-176 | R-OPL-EDIT-3 | parcial | G·P; U pendiente | editor-opl: razones cerradas y fan retirado sin acciones; límite explícito. |
| T-177 | R-OPL-FALLO-1 | parcial | G·P; U pendiente | editor-opl: símbolos ambiguos/tipo incompatibles sin selección arbitraria. |
| T-178 | R-OPL-FALLO-3..6 | parcial | G·P; U pendiente | editor-opl: conflicto excluye ambas líneas y preserva independientes. |
| T-179 | R-OPL-FALLO-7 | parcial | G·P; U pendiente | editor-opl/lente: modelo original intacto ante errores/unsupported y stale. |
| T-180 | R-OPL-FALLO-2, DR-39 | parcial | G·P; U pendiente | editor-opl: cada fallo retira línea entera; sin ID consumido ni aplicación parcial de línea. |
| T-181 | R-OPL-EDIT-5 | parcial | G·P; U pendiente | editor-opl/roundtrip-matriz: fase2 crea/extiende fan atómico, fase3 resuelve grupo único. |
| T-182 | R-OPL-EDIT-6 | parcial | G·P; U pendiente | editor-opl: firma incluye etiquetas/estados; ajustes de modificadores sin duplicar IDs. |
| T-184 | R-OPL-EDIT-9 | parcial | G·P; U pendiente | editor-opl: lista conserva estados/IDs anteriores y agrega sólo sub-span nuevo. |
| T-185 | R-§19-DISP-1/2, R-§21-OPL-DISP | parcial | G·P; U pendiente | editor-opl: cabeceras display no producen acciones, sí contexto. |
| T-190 | R-BI-DUAL-1, R-OPD-BIM-1 | parcial | G·P; U pendiente | roundtrip-matriz/Tabla9.2: hechos visibles emiten y se reconocen; huérfanos no inventados. |
| T-191 | R-§19-SIM-1 | parcial | G·P; U pendiente | roundtrip-matriz/azar y modelos WP-10: auto cero errores/acciones por cada OPD, 49 OPDs de seis fixtures+sintético+HODOM, identidad/JSON e informes intactos. |
| T-192 | R-§19-SIM-3, R-BI-TAB-1 | parcial | G·P; U pendiente | roundtrip-matriz:2996 modelos/2734 imports reales,5786 propuestas y presupuesto3000ms intacto. WP-10 reconstruye cinco documentos ofrecidos desde base nueva; tres modelos conservan sus gates. |
| T-193 | R-§19-ROT-1 | parcial | G·P; U pendiente | lente: diez parciales explícitas reproducidas; permanecen pérdidas textuales, no cerradas. |
| T-194 | R-§19-COMP-1, R-COMP-REV-1/2 | parcial | G·P; U pendiente | composicion:68 casos originales +136 vectores generativos semilla0x1949; conjuntos de hechos. |
| T-195 | R-BI-4 | parcial | G·P; U pendiente | editor-opl: COND-ALT preserva hecho y regenera superficie CT1 canónica. |
| T-196 | R-§19-LENS-3 | parcial | G·P; U pendiente | editor-opl/lente: plan sin acciones devuelve exactamente mismo Modelo; stale bloquea. |
| T-200 | reglas §3.2, spec-OPD §2.1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/tokens.test.ts; alcance específico, cierre por superficies pendiente |
| T-201 | R-SOMB-1..3, R-OPD-COSA-3, AP-19 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/tokens.test.ts; alcance específico, cierre por superficies pendiente |
| T-202 | R-CTRN-2, R-OPD-REF-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts; alcance específico, cierre por superficies pendiente |
| T-203 | R-COLOR-2, R-ROT-3, R-OPD-COSA-5, R-OPD-ROT-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/exportar.test.ts, src/opd/tokens.test.ts; alcance específico, cierre por superficies pendiente |
| T-204 | R-ROT-1/2, R-OPD-COSA-6, AP-23 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/exportar.test.ts, src/opd/metricas.test.ts; alcance específico, cierre por superficies pendiente |
| T-206 | R-OPD-EST-1/5/7, R-EST-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/geometria.test.ts, src/opd/golden.test.ts; alcance específico, cierre por superficies pendiente |
| T-208 | R-OPD-EST-9, reglas §3.10, DR-15 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts; alcance específico, cierre por superficies pendiente |
| T-209 | R-OPD-TR-1/2/6, reglas §3.7 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/exportar.test.ts, src/opd/marcadores.test.ts; alcance específico, cierre por superficies pendiente |
| T-210 | R-DEC-1/1A, R-OPD-HAB-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/marcadores.test.ts; alcance específico, cierre por superficies pendiente |
| T-211 | R-OPD-INV-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/geometria.test.ts; alcance específico, cierre por superficies pendiente |
| T-212 | R-TRI-1..3, R-VIS-TRI-1, AP-20, R-OPD-STR-1/2 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/geometria.test.ts, src/opd/marcadores.test.ts; alcance específico, cierre por superficies pendiente |
| T-213 | reglas §3.7/§3.9, R-OPD-STR-8 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/marcadores.test.ts; alcance específico, cierre por superficies pendiente |
| T-214 | R-OPD-CTL-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts; alcance específico, cierre por superficies pendiente |
| T-215 | spec-OPD §6.2, reglas §3.9, DR-38 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/marcadores.test.ts; alcance específico, cierre por superficies pendiente |
| T-216 | R-FAN-GEO-1/2, R-OPD-CTL-7, reglas §7.1, DR-9 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/decision29.test.ts, src/opd/escena.test.ts, src/opd/geometria.test.ts; otros casos en suites del requisito; alcance específico, cierre por superficies pendiente |
| T-220 | R-OPD-INV-6, R-VIS-DUR-1/2 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts; alcance específico, cierre por superficies pendiente |
| T-221 | R-ANID-1/1A, R-INV-2/2A, R-VIS-REF-1, R-OPD-REF-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts; alcance específico, cierre por superficies pendiente |
| T-223 | R-MARCA-1, R-VIS-PRIM-1, R-§23-OPD-VOCAB | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/golden.test.ts; alcance específico, cierre por superficies pendiente |
| T-224 | R-OPD-LAY-5 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/geometria.test.ts; alcance específico, cierre por superficies pendiente |
| T-227 | R-OPD-UI-1/2/5, R-DEC-2/2A, AP-24, R-OPD-CAN-3 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/exportar.test.ts; alcance específico, cierre por superficies pendiente |
| T-228 | R-OPD-VAL-1, R-VIS-VAL-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/escena.test.ts, src/opd/exportar.test.ts; alcance específico, cierre por superficies pendiente |
| T-240 | método A8.1, R-BI-0A | parcial | N·G·P·U acotadas | WP16 PanelOpl/EditorOpl actualizan texto y selección del mismo Modelo; browser12 contrasta cambio real/undo. Diez parciales, corpus ofrecido y e2e completos limitan el crédito. |
| T-241 | R-OPL-PANEL-1/2 | parcial | G·U acotadas | paneles.test y browser12: cabeceras/preorden/profundidad y tokens de generarModelo reales, sin HTML arbitrario; corpus ofrecido y e2e completos pendientes. |
| T-242 | R-OPL-INT-3, R-OPD-INT-1/3 | parcial | U acotada | browser12: hover tipado realza con paperWarm, sin mutación ni navegación; el lienzo conserva render canónico. Cobertura e2e completa pendiente. |
| T-243 | R-OPL-INT-4, R-OPD-INT-2 | parcial | U acotada | PanelOpl/ArbolOpd y browser12: clic por ref/hecho selecciona y navega por ID, sin alterar Modelo; historial y destino instalado contrastados. E2e completo pendiente. |
| T-248 | R-EDIT-4, R-OPD-EDIT-3 | parcial | N·I·G·X·U acotadas | src/nucleo/cosas.test.ts, src/nucleo/estados.test.ts, src/pruebas/trazabilidad.test.ts; alcance específico, cierre por superficies pendiente. paneles.test/browser12: traer en hueco libre conserva cosa/enlaces e ir distingue aparición/internos. |
| T-249 | R-EDIT-6/7, R-OPD-EDIT-2, R-OPD-BIM-3 | parcial | N·G | Operaciones reales mover/redimensionar mantienen OPL/hechos; control semántico sí cambia. U pendiente. |
| T-251 | R-VIS-APP-1 | parcial | N·I·G·X·U acotadas | src/nucleo/cosas.test.ts; alcance específico, cierre por superficies pendiente. paneles.test/browser12: quitar vs borrar enumera pérdidas/apariciones, refinamiento conserva padre y cancelación no muta. |
| T-252 | reglas §8, spec-OPD §15, método §9.15 | no implementado | pendiente | Sin callback nativo con este T-ID: evidencia o implementación pendiente; contrato en DESIGN §12.6. |
| T-260 | R-CONF-3/5, método A8.1 | parcial | N·I·G·X·U acotadas | src/nucleo/diagnostico.test.ts; alcance específico, cierre por superficies pendiente. paneles.test/browser12: tres grupos, OPD activo primero, regla/acción/Ir reales. |
| T-261 | R-OPD-VAL-2, método A8.1, R-AP-0B/0C, DR-40 | parcial | N·I·G·X·U acotadas | src/nucleo/diagnostico.test.ts, src/nucleo/reparaciones.test.ts; alcance específico, cierre por superficies pendiente. paneles.test/browser12: dos reparaciones opt-in replanteadas sobre candidato puro, una ejecución/undo real. |
| T-263 | R-PROC-2, R-OPD-TR-8, R-HER-1, R-VIS-HER-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/diagnostico.test.ts; alcance específico, cierre por superficies pendiente |
| T-265 | R-LAY-1, R-OPD-LAY-2 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/diagnostico.test.ts; alcance específico, cierre por superficies pendiente |
| T-268 | R-EXC-1A, R-EXC-AMBIENTAL-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/nucleo/diagnostico.test.ts, src/nucleo/matriz.test.ts; alcance específico, cierre por superficies pendiente |
| T-280 | R-VIS-EXP-2..4, R-OPD-CAN-1/2, R-OPD-EXP-1/3, R-OPD-LAY-8, R-VIS-EXPORT-1A/1D | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/exportar.test.ts; alcance específico, cierre por superficies pendiente |
| T-281 | R-VIS-EXP-2, R-OPD-CAN-1, R-OPD-EXP-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opd/decision29.test.ts, src/opd/exportar.test.ts; alcance específico, cierre por superficies pendiente |
| T-282 | R-OPL-TYPO-1, R-OPL-TOTAL-1 | parcial | N/I/G/X según prueba; U/P pendientes | src/opl/documento.test.ts; alcance específico, cierre por superficies pendiente |
| T-283 | R-LAY-1, R-REF-NTRIV-3, AP-13, R-ESC-OP-4, R-CAN-BOCETO-2 | parcial | N·I·G·X·U acotadas | src/nucleo/diagnostico.test.ts, src/opd/exportar.test.ts; alcance específico, cierre por superficies pendiente. paneles.test/browser12: menú conserva TODOS los gates SVG/HTML e Ir; JSON/OPL no limpian Modelo. |
| T-286 | método Apéndice F, DR-41 | parcial | N·I·G·P·X·U acotadas | codec-fijo/reglas y armazon.test: import JSON/OPL genuino asigna ID nuevo; Biblioteca GET/descarga exacta. Probes13/15 build+servidor reales; WP16 descarga JSON/OPL/SVG/HTML actuales, con gates/avisos y perfiles reales; 26e2e/cierre global pendientes. |
| T-287 | método Apéndice F | parcial | N·I·G·P·X·U acotadas | codec-derivados/reglas/visibilidad; migrar-postgres:25casos fuente falsa, sin PG real. armazon/guardado y probes13/15: Informe/Blob original exactos, BOM/UTF8 ilegible sin POST, opt-in nuclear, apertura antes de confirmar y rechazo422. WP16 consume los mismos Informes y exports actuales; cierre global/26e2e pendientes. |
| T-289 | R-IDP-3, AP-17 | parcial | N·I·P·X | Renumeración derivada conserva IDs; editor-opl resuelve SDx.y al hijo persistente y distingue contexto. U pendiente. |
| T-300 | spec-OPL §22 | parcial | G·P | plantillas/vocabulario y siete suites WP-9 con núcleo real; WP-10 contrasta todos los OPDs importados y documentos completos ofrecidos. U pendiente; modelos con gates no se acreditan como strict. |
| T-301 | R-§19-SIM-3, R-BI-TAB-1 | parcial | G·P | roundtrip-tabla92:26 filas con hechos esperados manuales; no segundo parser/oráculo automático. |
| T-302 | spec-OPL §22, R-§19-LENS-1..3 | parcial | G·P | lente: conservación aditiva/pureza/no-op y diez parciales; no nueva capacidad textual. |
| T-303 | R-ANEXO-CHECK-1 | no implementado | U·N·I·G·P·X | Gate de revisión manual global de ola pendiente; ninguna automatización ni cambio de títulos lo sustituye. |

## Bisimetrías parciales — diez casos de DESIGN §5.9

JSON conserva los datos. WP-9 reproduce las diez parciales con modelos y operaciones reales; su auto-reparseo no muta, pero una importación desde texto pierde datos indicados. Se conservan límites, no se agregan parciales por DEC29.

| caso | diferencia textual | estado | evidencia / siguiente verificación |
|---|---|---|---|
| 1 | Procedencia escindida TS4/TS5 frente standalone | parcial | lente: auto-no-op conserva escisión/JSON; import standalone no inventa procedencia. |
| 2 | Borrado; OPL aditivo | parcial | lente: ausencia no elimina ni reserva ID; no reconstruye borrado desde texto. |
| 3 | Posiciones y tamaños | parcial | lente: mueve/redimensiona con operaciones, OPL igual; import pierde geometría. |
| 4 | Estados ocultos en todos los OPD, global/local | parcial | lente/editor-opl: D6 conserva ocultos globales; sincroniza sólo visibilidad local explícita. |
| 5 | Duración sin excepción que la cite | zona laxa pendiente | lente: duración nuclear sin EX conservada en auto-no-op y ausente tras import textual. |
| 6 | Descripción/género si no hay un/una | parcial | lente: descripción/género sin hueco explícito siguen JSON; no inferencia de nombre. |
| 7 | Refinamiento trivial menor de dos | parcial | lente: refinamiento trivial sin CX no se reconstruye; SD ajeno diagnosticado. |
| 8 | Operador de fan con ruta DS-10 | parcial | lente/roundtrip-matriz: ruta por rama permanece; XOR/OR no viaja en DS10. |
| 9 | Etiquetados opuestos de etiquetas distintas | parcial | lente: dos dirigidos opuestos se recomponen bidireccionales, conserva etiquetas distintas. |
| 10 | Cosas sin aparición / enlaces sin vista | parcial | lente: cosa sin aparición/enlace sin vista no aparece en texto; JSON y original íntegros. |
