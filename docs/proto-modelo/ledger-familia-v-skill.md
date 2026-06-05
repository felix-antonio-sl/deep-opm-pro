# Ledger F1 — familia-V → `modelamiento-opm normalizar-proto`

**Fecha:** 2026-06-05
**Estado:** F1 cerrado como ledger documental. No cambia producto ni default del compilador.
**Contrato padre:** `docs/proto-modelo/contrato-migracion-familia-v-skill.md`.
**Compatibilidad legacy:** `app/src/autoria/compilar/normalizador.ts` (`mapearFamiliaV`) sigue congelado hasta F5.

## Propósito

Este ledger traslada la responsabilidad de decisión de `V1`..`V17` al estado E2
de `modelamiento-opm` (`normalizar-proto`) sin retirar todavía el adaptador
legacy del compilador.

La salida E2 debe dejar cada caso en una de cuatro formas:

1. OPL-ES cerrado parseable.
2. Enlace etiquetado estructural ya decidido.
3. Ancla o pendiente con `claveProto` estable.
4. Rechazo explícito por barro léxico/normativo.

La regla de oro es anti-silencio: si la semántica no está determinada, la skill
no inventa una primitiva y el compilador no absorbe el residuo.

## Lectura categorial

Heurística de ingeniería, no norma OPM: la migración se trata como una
traducción que debe preservar identidad y composición (`urn:fxsl:kb:icas-preservacion`).

- **Identidad:** una línea ya estricta no debe cambiar al pasar por E2.
- **Composición:** una línea laxa que se descompone en varios hechos debe producir
  la misma composición observable que el adaptador legacy.
- **Fidelidad suficiente:** dos verbos con decisiones distintas no pueden colapsar
  al mismo hecho sin etiqueta/ancla que preserve la diferencia decidida.
- **No plenitud deliberada:** no todo verbo de dominio tiene imagen; los casos
  sin decisión siguen rechazados.

## Criterio común de retiro

Una regla V puede salir del camino normal del compilador cuando cumpla todo:

1. este ledger tiene caso positivo y negativo;
2. F2 convirtió esos casos en fixtures laxo→E2;
3. HODOM y segundo dominio conservan resultado equivalente;
4. F3 reporta `usoFamiliaV == 0` para los OPDs migrados;
5. byte-identidad o re-pin deliberado quedan verdes.

## Ledger por regla

### V1 — `habilita` objeto→proceso

- **Superficie legacy:** `X [en 's'] habilita P`, con `X` objeto y `P` proceso.
- **Decisión vigente:** `X` es condición/instrumento de `P`; si hay estado, el
  estado es el puerto origen.
- **Salida E2 esperada:** hecho instrumento-condición `P requiere X [en estado s]`
  con modificador `condicion`; si la superficie textual estricta no expresa el
  modificador, E2 debe registrarlo en el ledger de normalización, no perderlo.
- **Fixture positivo:** `Cupo HODOM en 'disponible' habilita Evaluación de la solicitud.`
  → condición desde `Cupo HODOM/disponible` hacia `Evaluación de la solicitud`.
- **Fixture negativo:** `Inspección pre-ruta habilita Vehículo de transporte para 'en ruta'.`
  → rechazo; es proceso→objeto con cola `para`, no V1.
- **Criterio de retiro:** F2 demuestra equivalencia de modificador `condicion`
  y preserva el rechazo proceso→objeto.

### V2 — `restringe`

- **Superficie legacy:** `X en 'e' restringe P`.
- **Decisión vigente:** solo se normaliza si `X` tiene exactamente dos estados;
  el estado útil es el complemento de `e`.
- **Salida E2 esperada:** instrumento-condición desde `X` en el estado
  complementario hacia `P`.
- **Fixture positivo:** `Cupo HODOM en 'ocupado' restringe Evaluación de ingreso.`
  con estados `disponible|ocupado` → condición desde `disponible`.
- **Fixture negativo:** `Semáforo en 'rojo' restringe Evaluar.` con
  `rojo|amarillo|verde` → rechazo por no binario.
- **Criterio de retiro:** F2 prueba complemento binario y rechazo de cardinalidad
  mayor que dos.

### V3 — `puede iniciar`

- **Superficie legacy:** `X [en 's'] puede iniciar P`.
- **Decisión vigente:** misma ruta que `inicia`; la modalidad `puede` no agrega
  primitiva OPM.
- **Salida E2 esperada:** evento desde `X` o `X/s` hacia `P`.
- **Fixture positivo:** `Discrepancia en 'detectada' puede iniciar Ajuste terapéutico.`
  → instrumento-evento desde el estado `detectada`.
- **Fixture negativo:** `S puede iniciar A o B.` → no V3; debe pasar a V15 o
  explicitar disyunción.
- **Criterio de retiro:** F2 separa forma unidestino de disyunción.

### V4 — `alimenta`

- **Superficie legacy:** `O alimenta P`.
- **Decisión vigente:** alimentar un proceso con un objeto equivale a instrumento
  persistente.
- **Salida E2 esperada:** `P requiere O.`
- **Fixture positivo:** `Resultado de examen alimenta Evaluación clínica evolutiva.`
  → `Evaluación clínica evolutiva requiere Resultado de examen.`
- **Fixture negativo:** `Proceso A alimenta Proceso B.` → rechazo o aclaración;
  proceso→proceso no es instrumento objeto→proceso.
- **Criterio de retiro:** F2 comprueba firma objeto→proceso.

### V5 — `detecta`

- **Superficie legacy:** `P detecta O`.
- **Decisión vigente:** detectar produce el objeto-evento detectado.
- **Salida E2 esperada:** `P genera O.`
- **Fixture positivo:** `Monitorización detecta Evento de deterioro clínico.`
  → `Monitorización genera Evento de deterioro clínico.`
- **Fixture negativo:** `Sensor detecta Paciente.` → aclaración; si no se produce
  un objeto informacional/evento, no normalizar.
- **Criterio de retiro:** F2 exige que el objeto resultante sea evento/dato
  producido, no receptor afectado.

### V6 — `compromete` / `libera`

- **Superficie legacy:** `P compromete O` o `P libera O`.
- **Decisión vigente:** efecto sobre `O`; el verbo original se conserva como
  etiqueta, porque `compromete` y `libera` no son el mismo matiz.
- **Salida E2 esperada:** `P afecta O.` + etiqueta serializable
  `[etiqueta: compromete|libera]`.
- **Fixture positivo:** `Ingreso HODOM compromete Capacidad de prestaciones.`
  → efecto etiquetado `compromete`.
- **Fixture negativo:** `Ingreso HODOM compromete a Profesional.` → aclaración;
  si el receptor humano cambia de obligación/estado, el objeto transformee debe
  nombrarse explícitamente.
- **Criterio de retiro:** F2 demuestra fidelidad de la etiqueta; no colapsar
  `compromete` y `libera` sin marca.

### V7 — `precede a`

- **Superficie legacy:** `A precede a B`, con `A` y `B` procesos.
- **Decisión vigente:** precedencia temporal estricta proceso→proceso se modela
  como invocación.
- **Salida E2 esperada:** `A invoca B.`
- **Fixture positivo:** `Traslado del paciente precede a Cierre por reingreso.`
  → `Traslado del paciente invoca Cierre por reingreso.`
- **Fixture negativo:** `Documento A precede a Documento B.` → rechazo o enlace
  etiquetado explícito; no invocación entre objetos.
- **Criterio de retiro:** F2 valida firma proceso→proceso.

### V8 — `puede suceder a`

- **Superficie legacy:** `A puede suceder a un B [opcional]`.
- **Decisión vigente:** relación estructural etiquetada `sucede a`; `opcional`
  viaja como multiplicidad `0..1`.
- **Salida E2 esperada:** enlace etiquetado `A —sucede a→ B`, con multiplicidad
  destino `0..1` si corresponde.
- **Fixture positivo:** `Episodio HODOM puede suceder a un Episodio HODOM previo opcional.`
  → tagged `sucede a`, `0..1`.
- **Fixture negativo:** `Proceso A puede suceder a Proceso B.` → aclaración;
  orden procedural debe ser V7/invocación si ambos son procesos.
- **Criterio de retiro:** F2 conserva etiqueta y multiplicidad.

### V9 — `corresponde a`

- **Superficie legacy:** `A corresponde a un B`.
- **Decisión vigente:** correspondencia entre objetos como relación estructural
  etiquetada.
- **Salida E2 esperada:** enlace etiquetado `A —corresponde a→ B`.
- **Fixture positivo:** `Parada corresponde a un Domicilio.`
  → tagged `corresponde a`.
- **Fixture negativo:** `Evaluación corresponde a Atención.` si ambos son
  procesos → aclaración; no etiquetar proceso↔proceso sin intención declarada.
- **Criterio de retiro:** F2 valida firma estructural y conserva etiqueta.

### V10 — `cumple`

- **Superficie legacy:** `A cumple B [para ...]`.
- **Decisión vigente:** relación estructural etiquetada `cumple`; cola `para ...`
  es modelado fino pendiente.
- **Salida E2 esperada:** tagged `cumple` + `AnclaNormativa` o pendiente con
  `claveProto` estable sobre el enlace.
- **Fixture positivo:** `Profesional ejecutor cumple Competencia requerida para el acto.`
  → tagged `cumple` + pendiente `para el acto`.
- **Fixture negativo:** `Proceso de inspección cumple.` → rechazo por target
  ausente.
- **Criterio de retiro:** F2 prueba que la cola no se pierde ni se convierte en
  objeto OPM.

### V11 — `habilita` objeto→objeto

- **Superficie legacy:** `A habilita B`, con ambos extremos objetos y sin estado.
- **Decisión vigente:** habilitación estructural, distinta de V1.
- **Salida E2 esperada:** enlace etiquetado `A —habilita→ B`.
- **Fixture positivo:** `Autorización sanitaria habilita Establecimiento HODOM.`
  → tagged `habilita`.
- **Fixture negativo:** `Cupo disponible habilita Evaluación.` → V1 si destino
  es proceso; no tagged objeto→objeto.
- **Criterio de retiro:** F2 separa V1/V11 por firma de extremos.

### V12 — colas condicionales y `dentro del`

- **Superficie legacy:** hecho principal + `cuando ...`, `según ...`, `por una ...`
  o `requiere X dentro del Y`.
- **Decisión vigente:** compilar hecho principal y adjuntar la cola como pendiente
  sobre el enlace creado.
- **Salida E2 esperada:** hecho OPM estricto + pendiente/ancla con `claveProto`
  estable; la cola no crea cosa ni proceso por sí sola.
- **Fixture positivo:** `Registro cambia Indicación a 'cumplida' cuando se completa la orden.`
  → transición + pendiente `cuando se completa la orden`.
- **Fixture negativo:** `Equipo consta de Médico y Otros profesionales según prestaciones.`
  → rechazo; cola informal de lista, no V12.
- **Criterio de retiro:** F2 distingue cola de hecho procedural vs cola de lista.

### V13 — guard compuesto

- **Superficie legacy:** `X en 'a' con Y 'b' inicia P`.
- **Decisión vigente:** dos guards conjuntos: evento desde `X/a` y condición
  desde `Y/b`.
- **Salida E2 esperada:** evento `X/a → P` + instrumento-condición `Y/b → P`.
- **Fixture positivo:** `Evento adverso en 'detectado' con Notificabilidad 'notificable' inicia Notificación.`
  → evento + condición.
- **Fixture negativo:** `Evento adverso con Notificabilidad inicia Notificación.`
  → rechazo; falta estado de `Y`.
- **Criterio de retiro:** F2 preserva ambas flechas; no colapsar guard compuesto.

### V14 — transición o invocación alternativa

- **Superficie legacy:** `P cambia X a 'e', o inicia Q`.
- **Decisión vigente:** transición `P→X/e` e invocación-evento `P→Q`; la decisión
  XOR solo se materializa si el kernel puede agrupar ramas homogéneas, si no viaja
  como pendiente.
- **Salida E2 esperada:** transición + evento/invocación + pendiente XOR cuando
  las ramas sean heterogéneas.
- **Fixture positivo:** `Atención cambia Condición a 'estable', o inicia Cierre por reingreso.`
  → transición + invocación-evento + pendiente XOR.
- **Fixture negativo:** `Atención cambia Condición a 'estable' o 'inestable'.`
  → no V14; es lista de estados/A6 o requiere separación.
- **Criterio de retiro:** F2 conserva el XOR sin forzar abanico ilegal.

### V15 — disyunción de consecuencias

- **Superficie legacy:** `X en 's' inicia A o B` o `S puede iniciar A o B`.
- **Decisión vigente:** dos ramas evento; abanico XOR si comparten puerto de
  entidad, pendiente XOR si el puerto es estado o las ramas no son agrupables.
- **Salida E2 esperada:** dos eventos + XOR materializado o pendiente explícito.
- **Fixture positivo:** `Suspensión puede iniciar Cierre disciplinario o Cierre voluntario.`
  → dos invocaciones-evento + abanico XOR.
- **Fixture negativo:** `Decisión inicia Cierre A y Cierre B.` → no XOR; `y`
  expresa concurrencia/secuencia no decidida.
- **Criterio de retiro:** F2 distingue disyunción exclusiva de lista conjuntiva.

### V16 — `notifica a`

- **Superficie legacy:** `P notifica a/al R [contenido]`.
- **Decisión vigente:** notificar produce un mensaje; el receptor no cambia de
  estado por defecto.
- **Salida E2 esperada:** `P genera Notificación.` + tagged
  `Notificación —dirigido a→ R`; contenido como pendiente sobre el enlace.
- **Fixture positivo:** `Resolución del permiso notifica al Solicitante la resolución adoptada.`
  → resultado `Notificación` + tagged `dirigido a` + cola de contenido.
- **Fixture negativo:** `Resolución afecta al Solicitante.` no debe reescribirse
  a V16; si hay cambio de estado del receptor, es efecto explícito.
- **Criterio de retiro:** F2 prueba que `notifica` no infla enum OPL ni se modela
  como `afecta R`.

### V17 — `está acotado por`

- **Superficie legacy:** `X está/acotado por Y`.
- **Decisión vigente:** bifurcar por firma: acotación temporal → atributo `Plazo`
  + cola; restricción abstracta → relación etiquetada.
- **Salida E2 esperada:** si `Y` es temporal, `X exhibe Plazo.` + pendiente con
  literal; si `Y` es abstracto, tagged `X —está acotado por→ Y`.
- **Fixture positivo temporal:** `Resolución está acotada por un plazo de 30 días.`
  → `Resolución exhibe Plazo.` + pendiente `un plazo de 30 días`.
- **Fixture positivo abstracto:** `Acceso del colaborador está acotado por Deber de reserva.`
  → tagged `está acotado por`.
- **Fixture negativo:** `Proceso está acotado por rápido.` → rechazo; `rápido`
  no es plazo ni restricción nombrada.
- **Criterio de retiro:** F2 cubre ambas ramas y un negativo ambiguo.

## Rechazos que siguen fuera de familia V

Estos cuatro casos son guardas anti-complacencia y no deben normalizarse sin
decisión nueva del operador:

1. `Cupo HODOM proyecta la Capacidad de prestaciones comprometida como día-cama para REM.`
2. `... y los demás veredictos parciales determinan Solicitud ... como 'aceptada', 'en espera' o 'rechazada'.`
3. `Equipo HODOM consta de ... y Otros profesionales según prestaciones.`
4. `Inspección pre-ruta habilita Vehículo de transporte para 'en ruta'.`

## Salida de F1

F1 queda cerrada cuando este ledger está referenciado por contrato, handoff y
backlog. F2 debe convertir los fixtures documentales de este archivo en pares
ejecutables laxo→E2 y en medición contra HODOM/segundo dominio.
