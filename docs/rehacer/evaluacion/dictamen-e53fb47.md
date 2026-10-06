# Dictamen externo: OpForja rehecho, corte `e53fb47`

> **Resuelto por el dueño el 2026-10-06** (DECISIONS 29–32, que mandan sobre este dictamen):
> - D1 y D2: abanicos como en la versión anterior (DECISIONS 29). El abanico desde un estado deja
>   de existir, así que la recomendación de subir el arco de capa (§3) ya no hace falta.
> - D3: protocolo ligero (DECISIONS 30).
> - D4: precedencia según ISO 19450, Tabla 27 (DECISIONS 31), en lugar de la ambigüedad A1.
> - D5: enlaces internos al refinamiento ocultos en el padre (DECISIONS 32), ya aplicado en DESIGN §4.6.

6 de octubre de 2026. Evaluación independiente de solo lectura, pedida por el dueño sobre el
dossier «opforja-corte-evaluacion» y la rama `origin/rehacer`. No se aplicó, editó, publicó ni
desplegó nada.

Cómo leer las marcas: **(O)** observado en una corrida nueva de este evaluador; **(L)** leído en
código o documentos; **(I)** inferido; **(P)** propuesta. Las afirmaciones del tablero y del
informe de la directora se tratan como afirmaciones a contrastar.

## Alcance y método

- Unidades evaluadas: `f4e16b8` (WP-4r, último cierre) y `e53fb47` (corte gráfico, rojo). El
  snapshot del ZIP coincide byte a byte con `e53fb47` en 63 de 64 archivos; solo difiere
  `HANDOFF.md` (O).
- Corridas nuevas en una copia aislada, sin `.env`, Docker ni escritura de golden (O):
  - `bun run check` en `f4e16b8`: 1.698 pruebas, 1.696 pasan. Las 2 que fallan (T-204) piden
    Chromium 1217 y aquí hay 1194: es entorno, no código.
  - `bun run check` en cada commit de paquete: reproduce exactamente el recuento declarado en el
    tablero.
  - `bun run check` en `e53fb47`: 1.889 pruebas, 1.862 pasan y 27 fallan (25 declarados + los
    2 de entorno).
  - `bun run build`: falla porque aún no existen `src/main.tsx` (WP-14) ni
    `herramientas/migrar-postgres.ts` (WP-12). Esperable, pero no hay nada ejecutable.
  - Importación de los 6 fixtures v0 y generación de su OPL.
- Tres revisiones especializadas de solo lectura: semántica OPM/OPL contra el canon (14 sondas
  reproducibles), fidelidad gráfica OPD (goldens renderizados y mirados) y conformidad con el
  plan y los contratos aprobados en `main` (`513ac04`).
- No verificado: T-204 con Chromium 1217, la imagen de WP-18, la autenticidad de las
  autorizaciones transmitidas por terceros, y cualquier interfaz (no existe).

## Veredicto

1. **La base técnica es real y en gran parte fiel al canon (O, L).** La matriz única cubre los 15
   tipos y las 6 familias, y las plantillas atómicas coinciden literalmente con spec-OPL. Los 14
   commits cumplen los criterios de aceptación comprobables del plan aprobado y reproducen sus
   checks.
2. **No hay producto todavía (O).** Faltan la inversa OPL (WP-9), el editor (WP-13) y toda la
   interfaz (WP-14–16): más de la mitad del código previsto y todo lo que el usuario toca.
3. **La suite no detecta defectos semánticos que crean o pierden hechos (O).** Siete
   verificados con sondas y modelos reales (§2). Dos nacen del DESIGN que escribí yo, no de la
   implementación.
4. **Los dos bloqueos actuales son autoinfligidos (L, I).** El gráfico viene de convertir una
   preferencia estética en requisito duro. B-31 viene de ofrecer abanicos sin oración canónica.
   Ambos se disuelven con decisiones simples (§3 y §4).
5. **El proceso es hoy el mayor riesgo para terminar (O).** El tablero pasó de 8 KB a 447 KB y el
   registro de conformidad dejó de ser legible. Hubo unas 12 detenciones para decisiones menores
   y varias revisiones «independientes» por paquete. Aun así, esas revisiones no vieron los
   defectos de §2, porque contrastaban el producto con su propio contrato y no con el canon sobre
   modelos reales.

## 1. Qué está realizado y con qué evidencia

| Capacidad | Evidencia nueva | Estado |
|---|---|---|
| Contratos, identidad, forma, léxico, herencia, colocación (WP-1) | check verde reproducido | realizado |
| Matriz única de validez (WP-2) | check verde; contraste con el canon tipo por tipo | realizado; defectos S3, S4 y S7 en §2 |
| Operaciones de cosas, estados, enlaces y abanicos, y cierre DS-20 (WP-3a, WP-3b) | check verde | realizado |
| Proyección por OPD y ley de frontera (WP-4p) | check verde; OPL de modelos reales | realizado con el defecto S1 |
| Refinamiento y distribución (WP-4r) | check verde; 200×40 secuencias | realizado con el defecto S5; el generador nunca cambia el orden temporal (`pruebas/azar.ts:33`) |
| Diagnóstico y gates (WP-5) | check verde; 34 códigos con caso positivo y negativo | realizado con el defecto S6 |
| Códec v0 (WP-6) | los 6 fixtures importan en ≤ 44 ms; solo pierde 2 etiquetas en inglés del metamodelo | realizado; el roundtrip estricto OPD↔OPL no está acreditado (WP-9 y WP-10) |
| Geometría, marcadores y fuente (WP-8a) | check verde salvo T-204 por entorno | realizado |
| Escena y export (WP-8b) | verde en `f4e16b8`; rojo en `e53fb47` | ver §3 |
| Servidor de archivos, CAS, sesión y respaldo (WP-11) | check verde; hash scrypt verificado aparte | realizado; no hay instancia levantada |
| OPL de ida (WP-7) | OPL de los fixtures leído | realizado con S1, S2 y menores |
| Empaquetado (WP-18) | 30/0 en `deploy` | redactado; imagen sin probar |
| Inversa OPL, editor, UI, e2e y documentación final | — | no existe; hay stubs |

Afirmaciones que solo constan en el tablero:

- la revisión visual individual de los goldens de WP-8b;
- los dictámenes identificados por hash;
- la «recertificación» narrativa de H1 (sus criterios sí están verdes);
- las autorizaciones transmitidas por la coordinación o interpretadas por la dirección (§5).

## 2. Los 25 fallos y lo que la suite no ve

**Clasificación (O).** La del informe es correcta:

- 20 fallan por el mismo `RangeError: Agrupamiento uniforme pendiente` (`escena.ts:314`): 12 de
  escena y 8 golden de duración;
- 5 golden ya no coinciden byte a byte: 4 de contenedor y 1 de duraciones.

**Regresiones que el análisis dejó fuera:**

- **(O, L) La exportación lanza en lugar de responder.** `exportarDiagrama` (`exportar.ts:109`)
  llama a `escena()` sin capturar el error. Un modelo válido hace que el export reviente en vez
  de devolver la `Respuesta` que fija DESIGN §6.8 (P7). En `f4e16b8` no ocurría.
- **(L) Oráculos relajados** en `escena.test.ts`:
  - el centro exacto del arco `{300, 135}` pasó a «cualquier punto del lienzo 300 × 220»;
  - `toHaveLength(2)` pasó a `≥ 2`.

  Hoy no ocultan un fallo, pero esas aserciones quedaron casi vacías.

**Defectos semánticos que la suite no detecta.** Todos se verificaron con sondas o con los
fixtures reales.

| Id | Qué pasa | Regla del canon | Dónde | Tipo |
|---|---|---|---|---|
| S1 | Al abstraer un in-zoom, las invocaciones entre subprocesos aparecen en el padre como autoinvocaciones y sin deduplicar. SD_Sync dice tres veces «*Main System Doing* se invoca a sí mismo.» y OnStar dos veces. Eso afirma un bucle que no existe. | R-CAT-EQ-3 (preservar la firma de frontera); R-EJEC-9 (autoinvocación = bucle); R-CONSIST-1; R-INV-2D | `proyeccion.ts:73`; lo fija `proyeccion.test.ts:66`; nace en **DESIGN §4.6, paso 2** («si el enlace no admite reflexivo, desaparece») | contrato: corregir DESIGN. Si ambos extremos colapsan por abstracción en la misma cosa, el enlace desaparece siempre; deduplicar por clave |
| S2 | La excepción en el padre toma la cota del padre: «excede 60 minutos» cuando la excepción nace en un subproceso de 5 | spec-OPL §5.3 («el manejo, la fuente… el valor y la unidad DEBEN preservarse») | `plantillas.ts:271-283` | reparación ordinaria |
| S3 | El abanico C18 con estados en sus ramas pierde los estados y cambia la condición | CS1; C-18 no tiene variante con estado; DR-31 lo manda a B-08 | `matriz.ts:234`, `plantillas.ts:61` | no ofrecerlo (B-08) y registrarlo |
| S4 | La multiplicidad desaparece en abanicos. En los divergentes solo cuenta la de la primera rama | R-MULT-COMB-2 (multiplicidad por extremo) | `plantillas.ts:61,71-72`, `generar.ts:126` | realizarla o no ofrecerla (B-04) |
| S5 | Al reordenar bandas, el par escindido queda invertido (la salida antes que la entrada) sin ningún diagnóstico | R-ESCIND-2/3, R-ESC-OP-4 | `refinamiento.ts:133-147`, `forma.ts:75-80` | reparación: redistribuir o rechazar |
| S6 | La colección incompleta solo se dice en la raíz: un despliegue parcial afirma «**Auto** consta de **Motor**.» sin «y al menos otra parte». Además, `refinamiento-trivial` cuenta los refinadores del modelo y no los revelados | reglas §4.10; R-REF-NTRIV-2; AP-13 | `generar.ts:201`, `diagnostico.ts:130` | reparación ordinaria |
| S7 | Se acepta un enlace que duplica uno heredado del general | reglas l.1366 (AP-29: «DEBE bloquearse»); R-HER-8 | `matriz.ts:91-98` | reparación o registro; CANON.md lo lee de forma más estrecha |

Menores:

- alternancia y/e: SE4/SE5 y SSE6/SSE7 producen «**Libro** y **Índice**», CXM pone «, y » y RH1
  pone «e un»;
- la heurística deverbal no reconoce `-ura` ni `-ncia`, que R-NOM-PROC-1 enumera;
- el cambio de rol entre niveles (R-ROL-1, PUEDE) se rechaza como violación cuando debería
  declararse «no soportado».

Ambigüedad que decide el dueño (A1): la continuidad R+C solo se recompone en el orden
resultado → consumo (`proyeccion.ts:349,373`). Con «crea, cambia y consume» dentro del hijo, el
padre dice que *cambia* el objeto, lo que lo pone en Pre(P) y en Post(P). El orden inverso se
reporta como conflicto. Está registrado como B-29; conviene confirmar esa consecuencia.

## 3. La propuesta de vértices `481a4ff`

**Veredicto: no aprobar el parche (O, mirado en PNG).**

- **Lo que conserva:** el acople único, la identidad y la dirección de cada rama, los marcadores
  y el número de arcos.
- **Lo que añade y el canon no pide:**
  - radios de unos 270 px, que dejan el arco a mitad de rama, lejos del extremo común. Choca con
    spec-OPD §6.3 («XOR = 1 arco r=30; OR = 2 arcos r=30/35») y con R-OPD-CTL-7 («el arco DEBE
    posicionarse en el extremo común»);
  - rodeos en horquilla más allá de los procesos;
  - reempaquetado de estados;
  - la regla de no dibujar nada cuando no hay candidato.

  En `X-duracion-XOR-consumo--DOS-VERTICES…png` las ramas atraviesan Registro y vuelven en
  horquilla. Los SVG `B-v2-*` con r 206–299 y r 698 tienen el mismo defecto.

**Causa real del bloqueo (O).** Reconstruí los 8 modelos con la regla aprobada en `main`: acople
único, rectas y arco r30/35 centrado en el acople. La geometría es canónica, pero el arco queda
100 % oculto bajo el objeto. El fallo está en el orden de capas del DESIGN aprobado: los arcos (5)
van por debajo de las cosas con relleno (10). Eso es un error mío de diseño.

**(P) Delta mínimo de DESIGN:**

1. Dibujar el arco en la capa de sus ramas (20 cuando el extremo común es un estado). Con solo
   eso, el arco se ve y cruza las dos ramas junto al estado.
2. Ampliar el aviso B-15 a «arco, marcador o rótulo ocluido».
3. `escena()` nunca lanza: dibuja siempre con la regla aprobada y avisa.
4. Retirar la búsqueda de empaquetado, la adaptación de radio (B-33) y los vértices automáticos.
   Los vértices quedan solo como trazado explícito del autor (R-OPD-LAY-4).

Esto sana los 20 `RangeError`. Los 5 golden se regeneran con exportaciones genuinas y se miran.

**Otros defectos gráficos en los modelos reales, en `f4e16b8` (O):**

- **G1. Peines estructurales sin evitar obstáculos.** Los triángulos de agregación y exhibición
  caen dentro de otras cosas, y las ramas tachan rótulos (metamodelo, System_Diagram, SD_Sync,
  OnStar). El aviso subestima: `exportar.ts:36` exime a toda cosa que contenga un punto del
  peine (16 cruces reales, 2 avisados). Canon: R-OPD-LAY-4/7/9.
- **G2. El orden de capas también tapa otras marcas.** La multiplicidad «?» queda dentro del
  objeto, porque `escena.ts:112` la desplaza hacia el interior. Hay un resultado de 10 px con la
  punta bajo la elipse (SD_Sync) y un efecto que pasa bajo otro proceso. Canon: R-OPD-MUL-1.
- **G3. El tamaño automático crece desde la esquina sin recolocar** (`escena.ts:134-135`). Deja
  cosas solapadas y rótulos tapados (OnStar profundo). En el in-zoom, el rótulo se calcula antes
  de expandir el contorno. Canon: R-OPD-LAY-1.
- **G4. Medias puntas del bidireccional y el recíproco del mismo lado.** DESIGN §6.3 pide lados
  opuestos (`escena.ts:241-242`). La prueba T-213 mira cada extremo por separado, nunca el par.
- **G5. Menores:**
  - la marca `e` tapa la punta;
  - la etiqueta de ruta queda tachada por su enlace;
  - la autoinvocación tiene doble zigzag;
  - la piruleta tiene el marco invertido;
  - el triángulo usa trazo 1 en vez de 1.2.

Lo que está bien: los paths de marcadores son byte-idénticos a spec-OPD §18.3. Las ocho
representaciones de cosas, los estados, las orientaciones, los abanicos sin estado y la
separación entre canon y capa de edición son correctos.

## 4. WP-9, B-31 y VAL

- **La delimitación es correcta en lo formal (L).** Una autorización gráfica no concede parser,
  inversa ni strict, y B-31 no reabre las decisiones 1–28.
- **Las opciones A y B omiten la que el propio diseño usa: no ofrecer.**
  - B-31 cubre dos bordes de abanico cuyas ramas no comparten terminal:
    - el mismo objeto con estados distintos, o sin estado en alguna rama;
    - TS3 con entradas distintas y salida común.
  - El canon no tiene oración para ellos. FAN-5A canoniza la entrada común, no la salida común.
  - El diseño aprobado ya resolvía así otros casos sin plantilla: B-04, B-05, B-06 y B-08
    dicen «no se ofrece».
- **(P) Recomendación: opción C.**
  - Se retira FANLOCAL y el núcleo deja de ofrecer esos dos bordes.
  - El import los carga como enlaces sueltos con informe, igual que B-06.
  - Se registra la brecha como «no implementado».
  - Así WP-9 se implementa con el contrato original, H2 vuelve a ser alcanzable y desaparece el
    caso gráfico de los «terminales propios».
  - Coste: retirar la generación FANLOCAL de WP-7 y sus pruebas, que es código no canónico.
- Si el dueño prefiere conservar FANLOCAL, la opción A es coherente por dentro. Pero obliga al
  parser a aceptar para siempre un dialecto OPL que no es del canon. La B hace imposible H2.
- **VAL** corrige una contradicción real del DESIGN: el orden de §5.7 frente a §5.2 al crear la
  exhibición que exige `fijarValor`. Ya está autorizada. Se aplica en WP-9 como reparación
  ordinaria, directamente sobre la base si se adopta C.

## 5. Arquitectura y protocolo

**Arquitectura (L).** La dirección de módulos se respeta. La validez vive solo en la matriz, las
oraciones solo en `plantillas.ts` y las mutaciones son operaciones. `AGENTS.md` coincide
exactamente con el texto aprobado, y el canon vendorizado es byte-idéntico.

Hay tres debilidades.

- **`arquitectura.test.ts` deja huecos:**
  - ignora los imports no relativos;
  - solo mira `.ts` y `.tsx`;
  - cuenta `src/codec/pruebas.ts` como producto.
- **El código es denso:** 475 líneas de fuente pasan de 160 caracteres, `escena.ts` tiene una de
  600 y `plantillas.ts` una de 1.165.
- **La búsqueda de empaquetado de `escena.ts` es difícil de mantener:** combina 2 orientaciones,
  k filas, 3 alturas, 8 anclajes y 2 lados, con decenas de constantes sin nombre. Además mueve
  estados y agranda el objeto en cada render.

**Qué comprobaciones dan evidencia (O):**

- el check por paquete, reproducible commit a commit;
- RED→GREEN;
- los títulos con T-ID;
- las sondas sobre modelos reales;
- mirar los SVG.

**Qué cuesta sin resolver el bloqueo (O, L):**

- varias revisiones «globales» por paquete, con freezes, recibos, relevos y dictámenes firmados
  por hash;
- unas 12 detenciones para decisiones menores, que suman 264 menciones a «autoriz» en el
  tablero;
- narrativa de proceso dentro del registro de conformidad: la fila B-31 tiene 4.092 caracteres
  cuando el formato aprobado usa 200–400.

El tablero creció unos 32 KB por paquete; solo WP-7 sumó 91 KB. Cada reanudación tiene que leer
más de 100.000 tokens.

**Procedencia (L).** Varias autorizaciones son delegadas («coordinación Korax») o
interpretaciones de la dirección («ok. continúa entonces» leído como aprobación de B-33). Algunas
las tomó la dirección por su cuenta («no es una nueva autorización humana»). Eso choca con la
regla del plan: un contrato «nunca cambia en solitario».

**(P) Protocolo ligero, sin perder historia:**

1. Mover el `HANDOFF.md` actual, íntegro, a `docs/rehacer/bitacora.md`. Reiniciar `HANDOFF.md`
   como tablero de una página: paquetes, decisiones abiertas y siguiente paso.
2. Reescribir cada fila de `docs/conformidad.md` en el formato aprobado de DESIGN §11.3, en tres
   líneas como máximo. La evidencia va a la bitácora.
3. Una revisión por ola, no por paquete, contra el canon y con modelos reales y sondas. Sin
   dictámenes firmados ni freezes.
4. Detenerse solo en los hitos o ante una contradicción contractual verdadera. Toda autorización
   debe ser una frase directa del dueño, citada; nada delegado ni interpretado.
5. Pruebas sin salida por consola, con el T-ID exacto en el título.

## 6. Qué cerrar antes del siguiente commit

1. **Volver a verde.** `e53fb47` dejó `origin/rehacer` en rojo, y DESIGN §12.4 exige check verde
   para integrar.
2. **Que `escena()` y `exportarDiagrama` nunca lancen con un modelo válido.**
3. **B-33.** Añadir la fila o, si se adopta §3, retirar la adaptación de radio y la mención.
4. **Coherencia entre conformidad y DESIGN:**
   - B-32 figura `enforzado` dentro de la tabla de brechas, que solo admite otros estados;
   - faltan B-01, B-11, B-21 y B-25 (B-21 debería figurar como retirada, por DECISIONS 26);
   - B-29 y B-30 no están en DESIGN;
   - la cabecera dice 28 cuando DESIGN tiene 30;
   - B-03 cita T-043.
5. **Trazabilidad por T-ID:**
   - 14 requisitos ★ de paquetes cerrados no tienen prueba ni brecha: T-003, T-005, T-010,
     T-012, T-013, T-019, T-023, T-026, T-027, T-036, T-084, T-249, T-289 y T-300;
   - hay títulos con un T-ID equivocado: T-043 en `azar.test.ts:36` y `diagnostico.test.ts:73`,
     T-303 en `forma.test.ts` y `secuencias.test.ts:11`, y T-248 en `cosas.test.ts:73`;
   - la única prueba titulada T-282 solo afirma que el stub está pendiente.
6. Registrar o corregir S3, S4, S7 y el rechazo de R-ROL-1.
7. **Menores:**
   - etiquetas de paquete erróneas en los stubs;
   - `--no-env-file` del Dockerfile sin reflejo en DESIGN §9.1 (es un buen cambio: hay que
     registrarlo);
   - la base `f42024d` de `plan.json` frente al tag real `513ac04`;
   - los README, que quedan para WP-19.

## 7. Camino crítico

**Decisiones del dueño, las únicas necesarias:**

- **D1. Abanicos sin terminal común:** opción C (recomendada) u opción A.
- **D2. Abanico uniforme en el OPD:** regla aprobada, con el arco en la capa de sus ramas y
  aviso de oclusión (recomendado), o el parche de vértices. Ver §3.
- **D3. Protocolo ligero de §5.**
- **D4. Dirección de la continuidad R+C (A1, B-29).**
- **D5. Corrección de DESIGN §4.6, paso 2 (S1).** Es un cambio de contrato, aunque corrige un
  error frente al canon.

**Reparaciones ordinarias, sin consulta:**

- S2 a S7, G1 a G5 y los menores;
- que el export no lance;
- el registro y los T-ID de §6.

**Secuencia (P), supuestos explícitos:**

- la misma máquina h289, con Chromium 1217;
- el dueño disponible en los hitos;
- sin cambios de alcance.

| Paso | Contenido | Termina con |
|---|---|---|
| 0 | D1–D5 | respuestas citadas en el tablero |
| 1 | aplicar D2, S1–S7, G1–G4, el registro y los T-ID | un commit verde en `rehacer` |
| 2 | WP-9 (con VAL) → WP-13 | H2: roundtrip estricto por enumeración de la matriz, en verde |
| 3 | WP-10 → WP-12 → WP-14 → WP-15 → WP-16 → WP-17 → WP-19 | H3: 26 e2e, build y check verdes desde un clon limpio, y PR abierto |
| 4 | fuera del plan: imagen WP-18 (requiere autorizar Docker), revisión humana de 3 modelos grandes, aprobación del PR, despliegue con `./deploy/deploy.sh` y migración real | app desplegada, con autorizaciones separadas |

Tamaño restante estimado con DESIGN §2.3: unas 8.000–9.000 líneas de fuente. Se reparten en
inversa OPL (~1.600), editor (~1.200), interfaz (~3.900) y e2e (~1.450). No se da fecha.

## Qué conserva valor

- La matriz única, las operaciones con cierre DS-20 y la distribución con escisión.
- Las plantillas atómicas literales.
- El códec con informe y punto fijo.
- El servidor mínimo.
- Las pruebas generativas.
- El check reproducible commit a commit.
- El canon vendorizado intacto y `AGENTS.md`.

Nada de esto requiere rehacerse.

## Datos faltantes

- T-204 con Chromium 1217.
- La imagen de WP-18.
- La confirmación directa del dueño de las autorizaciones delegadas o interpretadas.
- Una corrida de los 26 e2e, que todavía no existen.
