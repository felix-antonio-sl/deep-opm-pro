# Conformidad de OpForja

Canon vendorizado: reglas OPM 1.5.0, spec-OPD 1.4.0, spec-OPL 1.4.1 y metodología
1.7.0; versiones, precedencia y hashes en [canon/LEEME.md](../canon/LEEME.md).
Estados admitidos (R-APP-2): `enforzado`, `parcial`, `no implementado`, `zona laxa pendiente`.
Superficies (R-APP-3): U = UI, N = núcleo, I = importación, G = generación OPL,
P = parseo OPL, X = exportación. Una regla se cierra solo con evidencia de todas sus
superficies aplicables; las consultas headless no acreditan operación, UI ni importación.

Este registro reúne las cinco filas materializadas por `NO_OFRECIDO` en WP-2, el desvío B-19
materializado por la proyección de WP-4p y la brecha temporal B-28 de integración menú/creación.
El inventario objetivo completo de 28 brechas continúa en
[DESIGN §11.3](rehacer/design/DESIGN.md#113-docsconformidadmd-forma-y-contenido-inicial-de-brechas),
según el mapa temporal del [plan](rehacer/plan/README.md). Sus descripciones de comportamiento
objetivo no son evidencia de realización. Cada paquete incorporará las filas que materialice;
WP-19 reunirá el documento final. Ninguna de las siete filas siguientes se declara cerrada.

## Brechas materializadas

| id | regla | estado actual | superficies aplicables | qué hace el producto hoy y evidencia | decisión y comportamiento objetivo pendiente |
|---|---|---|---|---|---|
| B-02 | Descomposición de objeto (T-072, R-OPL-CX-4, DR-23) | no implementado | U·N·I·P | N: `noOfrecidoDescomposicion` devuelve `nf-descomposicion-objeto` para un objeto y `null` para un proceso; T-072 de `matriz.test.ts`. `descomponer` continúa pendiente: no se acredita rechazo operativo. | DECISIONS 2, DS-18: operación rechaza `descomposicion-objeto`; parser responde `unsupported-canonical`; import convierte a despliegue por agregación sin crear enlaces o descarta el OPD si ya existe despliegue. Pendiente de sus paquetes. |
| B-04 | Multiplicidad sin hueco junto a `c`, en efecto con estados y en SSE (T-057, DR-44, EBNF A.5/A.6/A.8) | no implementado | U·N·I·P | N: `noOfrecido` reconoce las tres combinaciones y F-5 las detecta; T-057 y T-040 de `matriz.test.ts`. Los candidatos del menú no contienen multiplicidad; no se acredita selector UI ni rechazo operativo. | DR-44: no ofrecer con motivo; operación rechaza; import descarta con informe; parser responde `unsupported-canonical`. |
| B-05 | Recíproco con estados sin etiqueta (SE5 con estado, reglas §4.10) | no implementado | U·N·I·P | N: `noOfrecido` sigue rechazando el hecho sin etiqueta. La consulta con estados y etiqueta ausente devuelve `pendiente` sin candidato; null/vacío/léxico inválido se rechazan; con etiqueta válida devuelve intención completa y forma válida. T-050/T-120 de `matriz.test.ts` prueban ambos sentidos y pureza. No acredita captura UI ni creación real. | El import descarta los anclajes; parser responde `unsupported-canonical`; operaciones y UI usan la consulta única. Pendiente de sus paquetes. |
| B-06 | Abanico de efecto fuera de FAN-5/5A: ambas dimensiones de estados variables o efectos mixtos | no implementado | U·N·I·G·P | N: consulta acepta T3 puro y estados de un mismo objeto/par con entrada o salida común; excluye las otras combinaciones. T-054 de `matriz.test.ts`. La alternativa `abanicoCon` consulta estas mismas restricciones. | R-FAN-5/5A: no ofrecer; import descarta el abanico con informe y conserva enlaces. UI, operaciones, import y OPL pendientes. |
| B-08 | Control en abanico sin plantilla (T-056, T-124, C-19b; C-18 instrumento/agente) | parcial | U·N·I·P | N: control mixto da `abanico-invalido` por R-FAN-3; control homogéneo canónico sin plantilla devuelve B-08. Se aceptan consumo con proceso común y `c`, efecto con objeto común y `c`/`e`. F-5 detecta los no ofrecidos. T-056, T-055 y T-040 de `matriz.test.ts`. | Reglas §7.4: selector «Control de todas las ramas» ofrece solo combinaciones con plantilla; import descarta abanico con informe y conserva controles de enlaces; parser distingue `non-canonical` de `unsupported-canonical`. Pendiente de sus paquetes. |
| B-19 | R-VIS-HIJO-1 (T-086): procedimentales distributivos visibles en el contorno del hijo | parcial | N·G·X | N: `proyectar` oculta enlaces entre dos externos y conserva los procedimentales al contorno según DR-13. T-086 de `proyeccion.test.ts` observa un instrumento en el contorno junto a los hechos internos; no acredita OPL ni render/export. | DR-13 mantiene la lectura distributiva para agente, instrumento y efecto sin estado. Es un desvío declarado de la cláusula textual de R-VIS-HIJO-1; no autoriza consumo/resultado o evento sistémico en contorno contra R-DIST-1/R-CX-DIST-2. G y X se verificarán en WP-7 y WP-8b; permanece parcial. |
| B-28 | T-040 / DESIGN §10.2: equivalencia menú/creación por resultado efectivo con refinamientos | parcial | N·U | WP-2 comprueba consulta real, datos pendientes/completos, F-11/B-05, normalización pura con traza R-STRE-1, duplicados semánticos y alternativas del mismo par. Se conservan las negativas de contexto sobre contorno persistido. Creación y distribución refinada real siguen pendientes; ningún stub acredita esta integración. | Opción A resuelta por coordinación delegada en HANDOFF. WP-3b prueba creación real sin refinamientos; WP-4r comparte la distribución pura de consulta/creación/reparación y completa la integración N en H2, con DS-20 contra el original anterior a insertar. U sigue pendiente de WP-15 y su aceptación e2e en WP-17. H1 no acredita la integración refinada; B-28 no se cierra hasta comprobar todas sus superficies. |

## Trazabilidad y bisimetrías

La trazabilidad ★ objetivo continúa en DESIGN §12.6 y CANON §9; la lista cerrada de
bisimetrías parciales continúa en DESIGN §5.9. WP-2 acredita únicamente las consultas de matriz, la normalización pura de etiquetas
y su integración con F-2/F-5/F-11 y las pruebas de DS-20 existentes. B-28 mantiene pendiente
la equivalencia real de creación y distribución refinada. WP-4p aporta la proyección y frontera
derivadas con preorden/etiquetas únicos y registra B-19 para su desvío DR-13. Los títulos T-ID
se ejecutan con `bun test -t`.
No acredita códec, OPD↔OPL, generación, parseo, render ni exportación canónica. Las tablas finales
y sus evidencias se reunirán durante los paquetes propietarios y WP-19.
