# Canon 2.1.0: recuperación de ISO 19450:2024

Instrucción directa del dueño: «Trata de recuperar lo que falta de la ISO 2024 y resuelve lo pendiente»
(DEC46). Este registro actualiza el canon local y su trazabilidad; conserva `CAMBIOS-2.0.md` como historia
del saneo contra la fuente 2015. No constituye aprobación ni publicación en KORA, certificación ISO ni
aceptación funcional de OpForja frente a todas las construcciones de la norma.

## Fuente recuperada

- Edición: ISO 19450:2024, primera edición 2024-01, inglés. La
  [ficha oficial de ISO](https://www.iso.org/standard/84612.html) identifica la edición vigente.
- Copia pública recuperada de OrgPad, archivo `DQH7FK-EdNCbKCvLDXYvEp`, localizado mediante búsqueda web.
  Es un alojamiento de terceros: no se presenta como una descarga de la tienda de ISO ni se infiere una
  licencia de redistribución. Se conserva fuera de Git; no se versionan el PDF, su transcripción ni sus figuras.
- Archivo local: `/home/felix/.local/state/opforja/fuentes/iso-19450-2024/norma-publica.pdf`.
  Tamaño: 28.684.029 bytes; 168 páginas PDF, con el cuerpo numerado hasta 158 y los Anexos A–D.
- SHA256: `9bb1be0510f2182cb6e31984941dca193da74517b3ee230e85cabd4da7f12203`.
- Contraste: portada, edición, índice y términos observables de la
  [muestra oficial alojada por iTeh](https://cdn.standards.iteh.ai/samples/84612/fbeb6248f736438785e180262c1f6a53/ISO-19450-2024.pdf).
  Las entradas 3.1, 3.4, 3.18, 3.19, 3.55 y 3.64 coinciden en las anclas textuales contrastadas.
  La muestra local de 14 páginas se mantiene como fuente distinta; no se la llama norma completa.

La identidad bibliográfica, la paginación y el contraste de anclas permiten usar esta copia como evidencia
del texto y las figuras recuperados. No prueban por sí solos la autenticidad editorial de cada byte ni una
revisión semántica exhaustiva de las 158 páginas. Esta revisión se concentra en las reservas anteriores,
las citas de los cuatro documentos y las discrepancias materiales detectadas.

## Reservas anteriores resueltas con evidencia

Las páginas de la tabla son las impresas por ISO, no los índices del visor PDF. Las figuras se observaron
individualmente; la extracción de texto sola no acredita su glifo.

| Asunto | Evidencia 2024 | Corrección y alcance |
|---|---|---|
| Tabla 27 ausente; matriz provisional simétrica | §14.2.4.1.1, Tabla 27, pp.95–96 | P1 precede a P2. E→R, C→E, R→R y C→C son inválidas; R↔C produce efecto. Se transpone explícitamente la tabla ISO. Las nueve celdas ya están en `proyeccion.test.ts`; no se cambia el código ni la continuidad de identidad exigida por el perfil. |
| Esencia por defecto y propiedades gráficas | §7.3.3–7.3.4, pp.16–18, Figura 4 | El defecto dentro del sistema es la esencia primaria, igual a la mayoría de sus cosas internas; afiliación sistémica. Sombreado físico y contorno ambiental discontinuo están prescritos por la cláusula, no sólo ilustrados. B-50 declara el defecto fijo actual del producto. |
| Omisión frente a espera; conjuntos previo y posterior | §8.2.2–8.2.3, p.21 | Ambos conjuntos son no vacíos; si fallan enlaces de ambos tipos prevalece la omisión, sin ejecución ni excepción. Se distingue avance secuencial de invocación por finalización. La pertenencia de habilitadores a ambos conjuntos se conserva como NOTA informativa. |
| Prueba objeto-proceso resumida y mantenimiento descartado | §7.2.1 NOTA 2, pp.15–16; §7.3.2–7.3.3, p.16 | Sustantivo identifica objeto por defecto; para proceso deben cumplirse los tres criterios, incluido mantener un objeto en su estado actual. Las notas describen procesos persistentes; A5.1a ya no descarta mantenimiento por ausencia de cambio neto. Conserva objeto participante y enlace transformador (§8.1.2), sin convertir la nota en DEBE ni fijar realización única. |
| Claridad/completitud resumida | §6.1.6, p.12 | El equilibrio usa `should`: DEBERÍA. Las definiciones de ambos conceptos no convierten esa recomendación en DEBE. |
| Enlaces básicos resumidos | §8.1.1, §9.1.2–9.1.4, pp.20,22–24 | Clases y firmas existentes confirmadas; consumo inmediato al activar y generación al completar, salvo tasa. R-CONS-4 recoge la excepción opcional por cantidad insuficiente, sin inventar glifo o runtime. |
| Estado inicial-final y marca por defecto | §7.3.5.3–7.3.5.4, p.19, Figuras 6 y 47, p.83 | Se combinan contorno grueso y doble; marca por defecto abierta, diagonal desde la izquierda. La posibilidad de combinar designaciones tiene respaldo textual además del ejemplo. |
| Punta del enlace de excepción | §4, p.10; §9.5.4.2–9.5.4.3; Figuras D.7–D.8, p.156 | Línea sin flecha, una o dos barras oblicuas junto al proceso manejador; umbral máximo o mínimo según el caso. |
| Duración compacta | D.7, Figuras D.5–D.6, pp.154–155 | Se verifica unidad y lista de uno/dos/tres valores, más distribución opcional. Se mantiene informativo y no se adoptan cifras inconsistentes del ejemplo. |
| Rótulo de instancia | §10.3.5.1, Figuras 26–27, pp.56–57 | Nombre de instancia; el ejemplo puede añadir clase en otra línea. No se canoniza un separador «:» ni se amplía el léxico con «#». |
| Árbol y OPL total | §14.2.2.6.1.2, .1.4 y .2, Tabla 26, pp.92–94 | La oración de arista se define para el árbol de procesos. Los árboles de objetos forman un bosque; no se introduce otra plantilla por analogía. |
| Términos finales ausentes en el resumen 2015 | §3.78–3.84, p.8 | Se recuperan transformación, transformado, enlace transformador, despliegue, valor de atributo, valor funcional y todo, conservando sus diferencias. |

## Otras diferencias verificadas

- **Eventos y límite de descomposición.** §14.2.2.4.2, p.88, prohíbe todo evento que cruce desde fuera
  para iniciar un subproceso, sin excepción por afiliación. Se elimina del canon el permiso ambiental que
  contenía la fuente local 2015. B-44 amplía su alcance declarado; los resultados históricos bajo 2015
  siguen conservados y no se presentan como prueba del contrato 2024.
- **TS3.** §14.2.2.4.3 no limita la asignación a una descomposición de varios hijos. Puede conservarse el
  par en un subproceso o escindirse de forma temporalmente factible. Se corrige A3.4b y se conserva B-46.
- **Léxico.** A.3.2 admite `_`, no el separador EBNF `|` como carácter literal. Se corrigen R-OPL-LEX-2,
  su producción y B-47; `&`, `/` y espacios de estado siguen como diferencias del producto.
- **Cita inexistente.** El antiguo puntero B.6.5 de capitalización no existe en 2024. Se usan §7.1.2,
  §7.2.2, §7.3.5.2 y A.4.2; las excepciones españolas por artículo/preposición permanecen como localización.
- **Tipografía OPL.** §7.1.2, §7.2.2, §7.3.5.2 y §11.3 respaldan negrita de nombres y estados/valores;
  la cursiva de proceso y el monoespacio de estado del producto se declaran en B-51. No se confunde la
  notación de lectura de los documentos con la exigencia normativa.
- **Propiedades genéricas.** B-52 declara las oraciones D1/D3 separadas que emite el producto, frente
  a la oración genérica y la integración prescrita por §7.3.4. No se cambia G/P sin preservar su inversa.
- **Mantenimiento.** La descripción de procesos persistentes de §7.2.1 NOTA 2 y §7.3.3 NOTA corrige
  las negaciones de metodología/perfil anteriores. La realización TS3 entrada=salida sigue como política
  del producto; B-16 declara la clasificación restrictiva de D11/D12 que conserva el parser actual.

## Numeración y trazabilidad

Se contrastaron los encabezados y el significado de las entradas 3.1–3.76 de la fuente local 2015:
3.1 conserva abstracción como resultado; la edición 2024 añade **3.2, proceso de abstracción**;
las antiguas 3.2–3.76 se desplazan a 3.3–3.77. Las antiguas 3.77–3.83 faltaban en aquella fuente:
no se afirma haberlas comparado; las definiciones 2024 se leen directamente en §3.78–3.84.
Se actualizan sólo referencias ISO de documentos vigentes, nunca la numeración interna del canon/perfil
ni las citas históricas de `CAMBIOS-2.0.md` y DEC39–45.

Además del desplazamiento se corrigen citas semánticamente invertidas que ya traía el canon: 3.35/3.36
son descomposición de objeto/proceso; 3.49/3.50 son recomposición de objeto/proceso. CX7 (proceso) cita
3.50 y CX8 (objeto), 3.49. La revisión no da por correcta una cita sólo porque existe el encabezado.

| Cita anterior | Referencia verificada 2024 |
|---|---|
| 14.2.4.2, precedencia transformadora | 14.2.4.1.1 |
| 14.2.4.3, transformadores/habilitadores | 14.2.4.1.2 |
| 14.2.4.4, precedencia secundaria | 14.2.4.1.3 |
| 14.2.4.5, doce niveles | 14.2.4.1.4 |
| Instancias operacionales, epígrafe duplicado 14.2.2.4 de la fuente local | 14.2.2.4.4 |
| Semántica omisión/espera, antes cubierta sólo por 8.2.2 resumida | 8.2.3 |

No se afirma que estas sean todas las diferencias entre ediciones: se identifica la comparación efectuada.

## Discrepancias internas de la fuente y tratamiento

No se presentan como erratas oficialmente emitidas por ISO; son divergencias observadas en la copia.

| Divergencia | Tratamiento explícito |
|---|---|
| §7.3.4 fija esencia primaria contextual; comentario A.4.4.2 dice informacional por defecto | El canon conserva la regla contextual explícita de §7.3.4 y señala el comentario discordante; no redefine a escondidas el defecto del producto. |
| §3.51 distingue estática/dinámica; §7.3.3 enumera también persistente; A.4.4.2 usa persistente/transitoria | Se conserva el vocabulario de cada pasaje y los casos límite de mantenimiento de §7.2.1 NOTA 2, sin inventar una tercera clase ni restringir D11 sólo a objetos. La representación particular del perfil y la limitación del parser se declaran por separado. |
| A.4.4.2 ordena esencia/afiliación/perseverancia, omite separadores y permite opciones vacías; Figura 11 invierte las dos primeras | La EBNF traducida conserva el orden y la unicidad; separadores españoles y al menos una propiedad se declaran como realización. El ejemplo se muestra como evidencia de discrepancia, sin dar a cualquier orden crédito de EBNF. |
| Introducción de Tabla 27 repite P1 al describir una fila de P2 | Se usan cabeceras y las nueve figuras efectivamente observadas; orientación y transposición declaradas. |
| §3.65 remite el resultante al transformado 3.75, que ahora es estructura | El concepto se comprueba en 3.79; no se propaga ese número incorrecto. |
| Figura 27 usa «#» en un rótulo, ausente de A.3.2 | La figura no amplía el alfabeto normativo de nombres. |
| D.5–D.6 no mantienen consistentes media y desviación en metamodelo, texto y compacto | Se verifica la forma compacta; las cifras no se adoptan como regla ni caso de aceptación. |
| D.7 representa duración 60 donde su contexto describe 63,3; D.8 escribe umbral 60 pese a mínimo 30 | Se conservan las reglas de sobretiempo máximo/subtiempo mínimo de §9.5.4.2–3, sin copiar umbrales errados. |
| §9.5.4.1 remite al Anexo C para la representación de duración | Se cita D.7 y las figuras allí observadas, junto a las cláusulas normativas pertinentes. |
| Supresión de estados y condición tienen superficies distintas entre cláusulas y Anexo A | Se mantienen las diferencias declaradas en spec-OPL §2.3, §4.1/§18; no se atribuyen sólo a la PAS 2015 ni se inventa una forma nueva. |
| §3.84 exige dos o más partes para el todo; §10.3.2 dice una o más | La representación parcial puede mostrar una parte de un agregado mayor, pero no resuelve por sí sola el agregado completo de una parte. Se conserva esta reserva, se matiza B-43 y no se impone cardinalidad dos a todos los refinamientos. |

La disponibilidad del texto elimina la reserva «falta la fuente/figura». Las tensiones textuales anteriores
siguen visibles; no equivalen a una decisión del dueño para cambiar el producto. Las próximas reparaciones
se conducen contra el canon y sus brechas, con pruebas del modelo real y sin cerrar conformidad por una
suite documental verde.
