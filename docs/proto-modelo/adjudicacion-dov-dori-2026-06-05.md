# Adjudicación dov-dori — los 5 hallazgos del segundo dominio y el veredicto de fondo

**Fecha:** 2026-06-05 · **Convocante:** Felix (operador) · **Adjudicador:** dov-dori
(persona sintética; maestro OPM/ISO 19450; no afirma identidad ni afiliación real).
**Alcance:** acta de adjudicación. NO modifica código ni gramática. Solo dictamina.
**Insumos leídos:** `experimento-segundo-dominio.md`, `segundo-dominio/proto-permiso-edificacion.md`,
`gramatica-subdialecto-v0.md` (v0.2 + familia V), `2026-06-04-acta-mesa-flujo-canonico-…md`,
`diseno-ancla-normativa.md`, `normalizador.ts` (anclas + esencia + estado-pegado),
`emisor.ts` (emitirDescripcion/Resolutor), skill `modelamiento-opm` (canal E0-E2).

**Anclaje normativo.** Mis juicios OPM se anclan a la SSOT real en KORA
(`urn:fxsl:kb:reglas-opm-estrictas-es`, `…spec-forja-opl-es`), NO al puente stub
`docs/canon-opm/reglas-opm-estrictas.md` (que redirige). Cito regla por regla.

---

## Nota de método: nombrar la tensión antes de resolver

Cada hallazgo se adjudica nombrando primero **qué tensión del modelado** resuelve
o rompe, porque elegir un polo sin verlo es negligencia de praxis. Los cinco
hallazgos NO son del mismo género, y tratarlos como cinco parches del mismo tipo
sería el error. Dos son **léxicos de superficie** (a, e), uno es **un bug de
seguridad del compilador** (c), uno es **una decisión ontológica de fondo
transversal a dominios** (d), y uno es **una extensión de alfabeto mal planteada
que esconde un patrón genérico** (b). La indignación del operador con (b) está
justificada y apunta, sin saberlo, al hallazgo correcto: el problema no es que
falten siglas, es que se confundió *enumerar instancias* con *reconocer una
forma*.

---

## §1 · Adjudicación por hallazgo

### (a) Esencia plural de entidad singular — `Planos de arquitectura son informacionales y ambientales` → R3

**Tensión.** `Concreto↔Abstracto` (esencia) y, debajo, `Token↔Type` y
`Compacto↔Verboso`. Pero el hallazgo real que el experimento NO vio es otro:
**esto no es solo un problema de superficie ortográfica — es una violación de
nombre canónico que la gramática rechaza por la razón equivocada.**

**Diagnóstico canónico.** `Planos de arquitectura` y `Especificaciones técnicas`
son **nombres plurales**. La SSOT es inequívoca:

- **R-NOM-OBJ-1** (`SSOT-opl §1.2`): «un nombre de objeto DEBE ser **sustantivo
  singular** con palabras léxicas capitalizadas».
- **R-NOM-OBJ-2**: «un objeto plural DEBE nombrarse con sufijo **Conjunto** para
  inanimados o **Grupo** para humanos».

Es decir: el nombre canónico de un agregado de planos es **`Conjunto de planos
de arquitectura`** (o, si el modelo lo trata como un solo documento compuesto,
`Plano de arquitectura` singular). `Planos de arquitectura` **ya está mal
formado como nombre de objeto OPM**, con independencia de la esencia. El
rechazo R3 es *correcto por accidente*: el normalizador lo rechaza porque su
regla AESS exige `es` y su regla A1 exige una lista, pero la razón profunda por
la que esa oración no debe compilar tal cual es que **su sujeto no es un nombre
de objeto válido**.

**Por qué el "mapeo candidato" del experimento (§5.1) es la resolución
INCORRECTA.** El experimento propone: «`X son <esencia-pl> y <afiliacion-pl>`
con X sin separadores de lista → esencia singular». Eso enseñaría al compilador
a **aceptar plurales mal formados en silencio**, normalizándolos a una esencia
singular pero **conservando el nombre plural inválido**. Sería plantar barro: el
modelo quedaría con un objeto `Planos de arquitectura` que infringe R-NOM-OBJ-1,
emitido sin diagnóstico. Es exactamente el patrón que indignó al operador en (b)
—absorber lo que no entiendo— aplicado a la morfología.

**Resolución adjudicada (dos partes, la primera es la importante):**

1. **El plural se detecta y se devuelve al humano con diagnóstico, NO se
   normaliza a esencia singular.** La regla nueva es un **detector de nombre
   plural** (sufijo `-s`/`-es` sin sufijo `Conjunto`/`Grupo` en el sujeto de una
   oración copular o de descripción), que emite un rechazo nuevo:
   `R8 — nombre plural sin sufijo Conjunto/Grupo (R-NOM-OBJ-1/2): renómbralo
   "Conjunto de planos de arquitectura" o usa el singular`. El barro vuelve al
   modelador. Esto es coherente con el principio rector de la gramática (`:9`):
   rechaza-con-diagnóstico, jamás adivina.

2. **El verbo copular plural `son <esencia> y <afiliacion>` para un sujeto
   SINGULAR sí se acepta** (es ortografía española legítima: *"El expediente y
   sus anexos son informacionales"* — pero ahí el sujeto ya es lista, lo cubre
   A1). Para sujeto plural-de-nombre la respuesta es (1), no (2). La concordancia
   verbal `son`↔`es` es trivial y NO es el hallazgo; el hallazgo es el **nombre**.

**Generalización.** Todo dominio con agregados documentales (urbanismo: planos,
especificaciones, memorias; salud: exámenes, recetas, interconsultas) traerá
nombres plurales. La regla genérica —*plural sin sufijo canónico = rechazo
metodológico, no normalización*— los cubre a todos y mantiene la disciplina de
nombres de ISO 19450. El sufijo `Conjunto`/`Grupo` es la resolución que el corpus
ya legisló para `Token↔Type` cuando el modelador quiere referirse a la clase
como un todo nombrado.

**Firma OPM.** `Conjunto de planos de arquitectura` = objeto informacional
ambiental (esencia informacional por R-OBJ-3; ambiental por estar fuera del
control del sistema DOM — el solicitante los aporta). Sin estados (s=0): es un
insumo que se consume/requiere, no se transforma internamente en este modelo.

---

### (b) Alfabeto cerrado de normas — `(LGUC art. 116)`, `(OGUC §…)` no matchean

**Tensión.** `Hecho↔Supuesto` (procedencia jurídica = hecho confirmado externo,
no inventable) y `Explícito↔Tácito`. La indignación del operador es **correcta**
y la comparto sin reservas: codificar `DS|NT|DTO|Ley|Decreto` como el universo
de las normas chilenas es, en sus palabras, ser tan weón de creer que cinco
siglas agotan el derecho. No lo agotan. El error de diseño no es "faltan
siglas" — es **categorial**: se confundió *enumerar un conjunto abierto de
instancias* (los nombres de norma, que son infinitos: cada ley, cada decreto,
cada circular, cada norma técnica, cada ordenanza municipal tiene su propia
sigla) con *reconocer una forma sintáctica* (la estructura de una cita
normativa). Lo primero es imposible y absurdo. Lo segundo es trivial y robusto.

**Anatomía de una cita normativa (chilena, e ISO/general).** Una cita legal NO
se reconoce por su sigla. Se reconoce por su **forma**: un **designador de
cuerpo normativo** seguido (casi siempre) de un **localizador interno**. La
estructura genérica es:

```
<CUERPO>  [<numeración del cuerpo>]  [<LOCALIZADOR> <número/rango>]+  [<sección>]
```

donde:

- **`<CUERPO>`** = un **token-designador**: secuencia que empieza con
  mayúscula(s) o es una sigla reconocible como nombre de instrumento. En el
  derecho chileno: `LGUC`, `OGUC`, `DFL`, `DS`, `DL`, `DTO`, `Ley`, `Decreto`,
  `Res.` / `Res. Ex.`, `Circular`, `Ord.`, `NCh`, `NT`, `D.O.`, más el nombre
  propio de cualquier cuerpo (`Código Civil`, `Constitución`). En ISO/técnico:
  `ISO 19450`, `IEC 61508`, `RFC 2119`, `§`, `Art.`. **El conjunto de cuerpos es
  abierto por definición** — por eso enumerarlo es el error.
- **`<LOCALIZADOR>`** = el discriminante FUERTE y CERRADO: `art.` / `arts.` /
  `artículo` / `§` / `inc.` / `letra` / `N°` / `numeral` / `título`. **ESTO sí
  es un conjunto pequeño y estable**, transversal a todo el derecho.

**El insight de diseño:** la señal confiable de que un paréntesis es una cita
normativa **no es la sigla del cuerpo — es la presencia del localizador interno**
(`art.`, `§`, `N°`, `inc.`, `letra`) y/o un patrón de cuerpo+numeración
(`Ley 20.584`, `DFL 458`). El localizador es cerrado, finito y universal; el
cuerpo es libre. Se invierte la lógica: **el regex se ancla en el localizador,
no en el cuerpo.**

**Resolución adjudicada.** Reemplazar `ANCLA_PAREN_NORMA_RE` (alfabeto cerrado de
cuerpos) por un patrón de DOS señales independientes, cualquiera de las cuales
basta:

1. **Señal de localizador** (la fuerte): un paréntesis o cita inline que
   contenga `(?:art\.?|arts\.?|art[íi]culo|§|inc\.?|letra|N°|n[uú]m(?:eral)?|t[íi]tulo)`
   seguido de número/rango. El cuerpo es **lo que precede al localizador**,
   capturado libre (cualquier secuencia que empiece en mayúscula o sigla). Esto
   matchea `(LGUC art. 116)`, `(OGUC §5.1.6)`, `(Ley 19.880 art. 64)`,
   `(art. 17)` sin cuerpo, `(Código Civil art. 1545)`, e ISO `(ISO 19450 §7.3)`.
2. **Señal de cuerpo-con-numeración** (la débil, para citas sin localizador):
   `<SIGLA-mayúsc>\s+<número con puntos/guiones/barra>` → `DFL 458`, `DS 1/2022`,
   `NCh 433`, `Ley 20.584`. Sin localizador interno pero claramente un cuerpo
   normativo identificado por su número.

El `parsearReferencias` existente (`normalizador.ts:1160`) ya separa `norma` de
`articulos`/`seccion` y conserva artículos **verbatim** (§10.5 del diseño-ancla)
— esa maquinaria se reusa intacta; solo cambia el **detector** de qué es una
cita, no el parser de su contenido.

**Frontera dura (anti-falso-positivo).** El riesgo de un detector genérico es
tragarse paréntesis que NO son citas: `(opcional)`, `(ver SD1)`, `(el grande)`.
La señal-1 (localizador) es muy específica y casi nunca produce falsos
positivos. La señal-2 (sigla+número) podría confundir `(versión 2.1)` →
mitigación: el cuerpo debe empezar en **mayúscula** Y el número debe tener forma
de numeración legal (con punto/barra/guión, o ≥3 dígitos), no un decimal suelto.
Un paréntesis que no dispare ninguna de las dos señales **NO es una cita y NO se
extrae** — pero entonces, por (c), tampoco debe absorberse al nombre: se rechaza.

**Firma OPM.** Ninguna. Una cita normativa NO es cosa del modelo (no es objeto:
sin esencia propia del sistema; no es proceso: no transforma nada). Es
`AnclaNormativa` —**extensión declarada** (R-DOC-7), contenido meta del autor
(V-204)— exactamente como ya lo adjudicó `diseno-ancla-normativa.md §0`. El
hallazgo (b) NO toca la ontología; toca el **detector léxico** que alimenta ese
tipo ya diseñado.

**Lo que NO hay que hacer (lo que pidió el operador que NO se haga):** agregar
`LGUC|OGUC|DFL|Res|Circular|NCh` al enum. Eso sería repetir el error en escala
mayor y volver a fallar en el tercer dominio (¿y las ordenanzas municipales? ¿y
los autos acordados? ¿y `Boletín N°`?). El alfabeto de cuerpos es abierto; se
ancla en el localizador, que es cerrado.

---

### (c) BUG de silencio — la cita no reconocida se absorbe AL NOMBRE de la entidad

**Tensión.** `Hecho↔Supuesto` y `Conocido↔Desconocido`, pero sobre todo el
invariante que la propia arquitectura se impuso: **L2/L8 — "nada se pierde en
silencio"**. Este es, como dice el experimento, el hallazgo **más serio**, y
coincido: es peor que un rechazo. Un rechazo devuelve el barro al humano (sano);
este bug **produce un modelo válido pero semánticamente corrupto sin avisar**.

**Mecanismo confirmado (leí el código).** Cuando el normalizador NO extrae la
cita (sigla fuera del alfabeto actual — el bug (b)), la oración
`Otorgamiento … genera Permiso de edificación (LGUC art. 116).` viaja **completa,
con el paréntesis**, al parser. El parser produce un `ast.nombre =
"Permiso de edificación (LGUC art. 116)"`. El emisor (`emitirDescripcion`,
`emisor.ts:257`) llama `ctx.resolutor.resolver(ast.nombre, …)`; como ese string
NO coincide con la entidad `Permiso de edificación` ya creada en SD1, el
Resolutor decide `crear` una entidad **nueva**. Resultado: dos objetos distintos,
`Permiso de edificación` y `Permiso de edificación (LGUC art. 116)`. `validarModelo`
pasa (ambos son nombres no vacíos), el bundle emite, y **nadie se entera**. La
métrica de cobertura incluso lo cuenta como "aplicada" (sobrestimación que el
propio experimento ya confiesa, `:81`).

**Doble falla canónica.** Este nombre infringe **R-NOM-OBJ-1** (no es un
sustantivo singular limpio: arrastra material parentético que no es parte del
nombre del objeto) Y rompe **R-OPL-EQ-2** (superficies que el modelador entiende
como la misma cosa deben mapear al mismo nombre canónico). El bug es,
simultáneamente, un defecto ontológico (dos cosas donde hay una) y un defecto de
trazabilidad (la procedencia jurídica se perdió disfrazada de ruido en un
nombre).

**Resolución adjudicada — un guard anti-silencio, en DOS capas:**

1. **Capa preventiva (la que cierra (c) aunque (b) no se arregle).** Un guard de
   **nombre con paréntesis colgante**: antes de que el emisor cree una entidad,
   si `ast.nombre` (o cualquier nombre de cosa que el resolutor vaya a *crear*)
   contiene paréntesis, corchetes, `art.`/`§`/`N°`, o cualquier residuo
   sintáctico de cita, **NO crea la entidad en silencio** → emite rechazo:
   `R9 — nombre de cosa con material no nominal residual ("(LGUC art. 116)"):
   parece una cita normativa no extraída; usa la forma (Cuerpo art. N) reconocida
   o declara la cita como ancla`. El diagnóstico **nombra el residuo** y **sugiere
   la causa probable** (cita no reconocida), pero **NO adivina** que `LGUC art.
   116` es una norma ni la convierte en ancla por su cuenta — eso lo confirma el
   humano. Detecta, diagnostica, NO inventa.

2. **Capa de detección semántica (red de seguridad, independiente de la forma).**
   Un check post-compilación: si dos cosas del modelo tienen nombres donde uno es
   **prefijo limpio del otro** y el sufijo del más largo es **material
   parentético/cita**, emitir diagnóstico de *probable entidad duplicada por
   absorción*. Esto atrapa el caso aunque el residuo no sea una cita reconocible
   (p.ej. `Permiso (provisional)` vs `Permiso`). Severidad: advertencia
   metodológica que **escala a bloqueo** si el sufijo matchea el detector de cita
   de (b) — porque entonces es casi seguro corrupción, no homonimia legítima.

**Qué NO debe adivinar el guard.** No debe: (i) decidir que el paréntesis ES una
norma (podría ser `(borrador)`); (ii) fusionar las dos entidades automáticamente
(podrían ser legítimamente distintas en un dominio raro); (iii) extraer la cita
y crear el ancla sin confirmación. Su único trabajo es **negarse a crear en
silencio una entidad con nombre sospechoso** y devolver el control al humano con
un diagnóstico que nombra exactamente qué vio y qué cree que pasó. Esa es la
diferencia entre un compilador que respeta L2/L8 y uno que las viola por la
rendija del nombre — la frase exacta del experimento, que suscribo.

**Firma OPM.** No aplica (es un guard del compilador, no un hecho del modelo).
Pero su fundamento es OPM puro: R-NOM-OBJ-1 dice qué es un nombre de objeto
válido; el guard hace cumplir esa regla en el punto de creación. El compilador
debe ser **total con diagnóstico**, no total con corrupción silenciosa.

**Prioridad.** (c) es el único hallazgo que clasifico como **bloqueante para
declarar el compilador confiable**. (a), (b), (d), (e) son extensiones de
cobertura; (c) es un **modo de fallo que falsifica la garantía central del
diseño** (L2/L8). Mientras (c) viva, el sello de procedencia L6 y la cobertura
del 93–98.9% son **optimistas**: cuentan como éxito casos que son corrupción. Se
arregla primero.

---

### (d) `Resolución del permiso está acotada por un plazo de 30 días` → R7

**Tensión.** `Instantáneo↔Durativo` y `Determinista↔Probabilista`, sobre la
restricción temporal. Y `Hecho↔Supuesto`: el plazo es un hecho jurídico duro
(LGUC art. 118). Este NO es sobreajuste — el experimento lo clasifica bien como
rechazo correcto, y **colisiona con la oración en-reflexión homónima de HODOM**
(`está-acotado-por`, una de las 5 que el operador dejó pendientes). Esto eleva la
prioridad: **el patrón "X está acotado por un plazo/restricción" es transversal a
dominios** y ya no puede quedar indefinidamente en reflexión.

**Qué dice ISO 19450 / el corpus de restricciones temporales.** OPM **no tiene
una primitiva de "timing constraint" de primera clase** como la tendría una
máquina de estados temporizada o un diagrama de Gantt. Aquí OPM legisla poco —
es un **límite del formalismo**, y mi deber es declararlo, no fingir que existe
una primitiva. El corpus da la salida canónica explícita:

- **R-PROC-6** (`reglas-opm-estrictas-es:236`): «un proceso persistente NO DEBE
  usarse como escape genérico… Si no hay transformación ni condición sostenida
  relevante, DEBE reemplazarse por **enlace estructural etiquetado, atributo o
  estado**.»
- **R-OPL-PERSIST-3** (`:565`): «si la temporalidad sostenida no es
  semánticamente central, la superficie textual PUEDE simplificarse mediante
  **enlace estructural etiquetado**.»

Es decir: una restricción temporal en OPM se modela como **uno de tres**, según
qué pregunta del modelo deba responder el plazo. Esta es la decisión que el
operador debe tomar nombrando la tensión, no un mapeo automático:

**Opción A — atributo (exhibición-caracterización).** Si el plazo es un *dato
del proceso* que se quiere consultar/exhibir: `Resolución del permiso exhibe
Plazo legal.` donde `Plazo legal` es un objeto informacional (atributo) con valor
"30 días". Firma: RF2 (`Exhibidor exhibe Atributo`), R-OPL-RF-2 (`exhibe`).
Canónica, ya soportada por la gramática (regla A9/exhibición). **Esta es mi
recomendación por defecto**: un plazo legal ES naturalmente un atributo del
proceso resolutivo, y el corpus lo respalda directamente (un atributo es «objeto
que caracteriza otra cosa vía exhibición-caracterización», R-glosario 3.4 citado
en `:255`).

**Opción B — estado + evento de vencimiento.** Si el plazo *gatilla algo* al
vencer (el silencio administrativo positivo que el propio proto marca con
`[RATIFICAR]` en la línea 69): entonces el plazo NO es solo un atributo, es un
**reloj que dispara**. Se modela como un objeto `Plazo` con estados
`'vigente' / 'vencido'`, y el estado `'vencido'` **inicia** el proceso de
silencio administrativo (evento, `inicia`). Firma: evento (R-OPL §evento). Esto
es lo que el dominio realmente parece querer (la línea 69 lo insinúa), y es más
rico que A — pero solo se justifica **si el vencimiento tiene consecuencia
modelada**. Si no la tiene, B es sobre-modelado.

**Opción C — enlace estructural etiquetado** (la salida R-PROC-6/PERSIST-3 literal).
`Resolución del permiso` —«está acotada por»→ `Plazo de 30 días`, como relación
estructural etiquetada proceso↔objeto. **Pero ATENCIÓN a R-OPL-SE-2**: los
estructurales etiquetados DEBEN ser objeto↔objeto o proceso↔proceso; las mezclas
objeto↔proceso «pertenecen a exhibición-caracterización cuando son canónicas».
`Resolución`(proceso) ↔ `Plazo`(objeto) es una mezcla → **canónicamente es
exhibición, o sea recae en la Opción A**. Por eso C, para este caso concreto,
**colapsa en A**. C solo aplicaría limpio si ambos extremos fueran del mismo tipo.

**Resolución adjudicada para la familia V (decisión del operador, que destraba
las 5 en-reflexión):** mapear `X está acotado por <Y>` así:

- Si `<Y>` es un **plazo/cantidad temporal** (`un plazo de N días`, `N días
  hábiles`, `el plazo legal`) → **Opción A**: `X exhibe <Plazo>` (+ el valor como
  nota/atributo), y **si la línea o una vecina menciona consecuencia al vencer**
  → además **Opción B** (estado `'vencido'` + evento). El "30 días" concreto
  viaja como dato del atributo, no como nombre.
- Si `<Y>` es una **restricción normativa abstracta** (el caso HODOM:
  `está acotado por Deber de reserva`) → es objeto↔objeto (ambos abstractos):
  **enlace estructural etiquetado «está acotado por»** (Opción C limpia, R-OPL-SE-1:
  etiqueta en minúscula que funciona como predicado). Esto resuelve **la
  en-reflexión #2 de HODOM** (`Acceso del colaborador está acotado por Deber de
  reserva`): `Acceso del colaborador` y `Deber de reserva` son ambos
  informacionales → estructural etiquetado válido.

La clave que destraba la reflexión del operador: **`está acotado por` no es UN
mapeo — es DOS, según el tipo de los extremos**, exactamente como R-OPL-SE-2
obliga. Temporal→exhibición; abstracto-abstracto→estructural etiquetado. El
experimento lo intuyó al decir "transversal a dominios"; la respuesta canónica es
que la transversalidad se resuelve **bifurcando por la firma de los extremos**,
no con un verbo único.

**Firma OPM (caso edificación):** `Resolución del permiso exhibe Plazo legal.`
(`Plazo legal` = objeto informacional sistémico, valor "30 días", anclado a
`AnclaNormativa` LGUC art. 118). Más, si se ratifica el silencio administrativo:
`Plazo legal puede estar 'vigente' o 'vencido'.` + `Plazo legal en 'vencido'
inicia Silencio administrativo positivo.` — pero esto último **espera la
ratificación** del `[RATIFICAR]` de la línea 69, porque el operador aún no
confirmó que ese efecto aplica. Hecho vs supuesto: lo modelado es el atributo
(hecho); el evento de vencimiento es supuesto declarado hasta ratificar.

---

### (e) `Resolución del permiso notifica al Solicitante la resolución adoptada` → R3

**Tensión.** `Agente↔Paciente` (¿quién notifica a quién, y qué se transforma?) y
`Causa↔Efecto`. El experimento lo clasifica como "verbo nuevo legítimo, candidato
a familia V". Concuerdo en que es candidato — pero la firma OPM correcta **no es
un verbo nuclear nuevo**, y este es un buen caso para mostrar por qué la familia V
debe mapear a primitivas existentes, no inflar el enum.

**El enum de verbos OPL es cerrado y `notifica a` no está.** `spec-forja-opl-es
§1.1` enumera: `consume, genera, afecta, cambia…de…a, maneja, requiere, inicia,
invoca, exhibe, consta de` (+ estructurales/copulares). El parser «NO DEBE
reconocer como verbo OPL un token ausente de esta sección» (`:143`). Agregar
`notifica` al enum sería romper el cerramiento del vocabulario — prohibido.

**Lectura ontológica de "notificar".** Notificar es **producir un mensaje y
entregarlo a un receptor**. En OPM esto descompone limpiamente en primitivas
existentes:

1. **El resultado: un objeto-mensaje.** La notificación **crea** una `Notificación`
   (objeto informacional): firma **resultado** → `Resolución del permiso genera
   Notificación.` (verbo `genera`, canónico). Esto captura el corazón del hecho:
   notificar es, ante todo, producir el aviso. El "qué se notifica" (la
   resolución adoptada) es el *contenido* de ese objeto, capturable como atributo
   o como el propio estado del expediente que la notificación refleja.

2. **El receptor: ¿agente o destino?** Aquí está el juicio fino. El `Solicitante`
   NO es agente del proceso `Resolución` (no lo maneja — la DOM lo maneja). El
   Solicitante es **quien recibe** la notificación. OPM no tiene un "link de
   destinatario" nuclear; el receptor se modela como **relación estructural
   etiquetada objeto↔objeto** entre la `Notificación` y el `Solicitante`:
   `Notificación` —«dirigida a»→ `Solicitante` (R-OPL-SE-1, etiqueta predicado en
   minúscula; ambos objetos → R-OPL-SE-2 satisfecha). NO es exhibición (no es un
   atributo del solicitante), es una relación de direccionamiento.

**Resolución adjudicada (familia V, nueva entrada — la llamo V16 para el
registro):** `P notifica a <R> <contenido>` →
- **resultado**: `P genera <Mensaje>` (objeto informacional nuevo, nombre derivado:
  `Notificación` / `Aviso de resolución`);
- **estructural etiquetado**: `<Mensaje>` —«dirigido a»→ `<R>`;
- el `<contenido>` ("la resolución adoptada") → atributo del mensaje o, si ya es
  un estado del expediente, anclado como nota (no se inventa un objeto si el
  contenido ya existe en el modelo como estado `'aprobado'`/`'rechazado'`).

Esto es **1:N (compuesta)** en el vocabulario de la gramática (`:57`): una línea
del proto → dos emisiones (un `genera` + un estructural etiquetado). El verbo
`notifica` **nunca entra al enum**; se descompone en `genera` + etiquetado. Es el
mismo patrón de la familia V que ya funciona (V6 `compromete`→`afecta`+etiqueta;
V7 `precede a`→`invoca`).

**Por qué NO modelarlo como `P afecta Solicitante`.** Tentador, pero falso: el
Solicitante no cambia de estado por ser notificado (a menos que el modelo tenga
un estado `'notificado'` del solicitante, que sería sobre-modelado aquí). Lo que
existe nuevo en el mundo tras notificar es **el mensaje**, no un cambio en el
solicitante. La firma `genera <Mensaje>` + `dirigido a` es la fiel; `afecta
Solicitante` confundiría paciente con receptor.

**Firma OPM.** `Resolución del permiso genera Notificación.` (resultado) +
`Notificación dirigida a Solicitante.` (estructural etiquetado, objeto↔objeto). +
opcional `Notificación exhibe Resolución adoptada.` si se reifica el contenido.

---

### Síntesis de §1: los cinco no son del mismo género

| # | Género real | Resolución | ¿Mapeo o guard? | Bloqueante? |
|---|---|---|---|---|
| (a) | nombre mal formado (R-NOM-OBJ-1/2) | rechazo R8 (plural sin Conjunto/Grupo); NO normalizar | guard de rechazo | no |
| (b) | detector léxico mal anclado | regex anclado en **localizador** (cerrado), no en cuerpo (abierto) | detector genérico | no, pero alimenta (c) |
| (c) | **bug de seguridad: corrupción silenciosa** | guard anti-paréntesis-colgante + check de duplicado-por-absorción | guard de rechazo + check | **SÍ** |
| (d) | límite del formalismo (timing) | bifurca por firma: temporal→exhibición; abstracto↔abstracto→estructural etiquetado | mapeo V (doble) | no |
| (e) | verbo descomponible | `genera <Mensaje>` + estructural etiquetado «dirigido a» | mapeo V (compuesta) | no |

La indignación del operador con (b) es legítima y, además, **diagnóstica**: lo
que lo molestó (creer que un enum cerrado de instancias agota un dominio abierto)
es **exactamente** el error de diseño, y la corrección no es agregar instancias
sino **cambiar de eje** (reconocer forma, no enumerar instancias). Ese mismo error
—absorber/enumerar en vez de reconocer/rechazar— reaparece en (a) (el "mapeo
candidato" que normalizaría plurales malos) y es la causa raíz de (c). Tres de los
cinco hallazgos son la misma lección ontológica: **un compilador honesto reconoce
formas y rechaza lo que no reconoce; no enumera instancias ni absorbe lo
ambiguo.**

---

## §2 · Veredicto de fondo: ¿gramática determinista = utopía?

### El planteamiento es una falsa dicotomía — pero apunta a una frontera real

El operador pregunta si "la gramática es una utopía" y si "mejor lo dejamos a AI".
Mi primer deber como adjudicador es **rechazar el marco de la pregunta sin ser
complaciente con ninguna de las dos respuestas fáciles**:

- **NO** es cierto que la gramática determinista sea una utopía. Generó 93–98.9%
  de cobertura sobre dos dominios, con 0 fallos de emisión, leyes falsables y
  reproducibilidad byte-a-byte. Eso no es una utopía; es una herramienta que
  funciona y cuyos bordes están **medidos**. Decir "es utopía, deleguémoslo todo
  a AI" sería tirar evidencia dura a la basura por frustración con 5 casos de
  borde.
- **NO** es cierto que delegar todo a AI sea seguro. Hay un activo en este sistema
  que **un LLM no puede generar sin alucinar**: la **procedencia jurídica**. Una
  `AnclaNormativa` que dice `LGUC art. 116` es una afirmación de hecho legal
  verificable. Si un LLM la produce por traducción libre, puede inventar el
  artículo, el cuerpo, o la correspondencia hecho↔norma — y nadie lo notaría
  hasta que un permiso se impugne en tribunales. **La trazabilidad legal es
  precisamente lo que NO se puede delegar a generación probabilística.** Y la
  **reproducibilidad** (mismo proto → mismo bundle, byte a byte) es estructural a
  un compilador determinista y **ningún LLM la garantiza** (temperatura cero
  reduce la varianza, no la elimina; y el sello L6 perdería sentido).

**La pregunta real, como bien anticipa el brief, no es "¿hay LLM?" sino "¿DÓNDE
está la frontera?"** — y la arquitectura **ya respondió esa pregunta en el acta
del 2026-06-04**. El acta es explícita y, en mi lectura, **correcta**:

> «el LLM (skill `modelamiento-opm`) escribe/refina el proto en E0-E2 con juicio
> dialéctico; el compilador determinista es la RED DE SEGURIDAD verificable
> (gates, byte-identidad, leyes falsables). … Factorización epistémica:
> **verificar = determinista; validar = LLM + humano; servir = humano**.»

Esa factorización es el `Verificar↔Validar↔Servir` de mi propio mapa de
tensiones, y está bien resuelta. El operador no necesita una arquitectura nueva;
necesita **corregir la frontera dentro de la que ya eligió**, porque el
experimento reveló que la frontera estaba mal dibujada en un punto.

### Dónde estaba mal dibujada la frontera (el diagnóstico de fondo)

El error del estado actual NO es "tener una gramática determinista". Es que **la
gramática determinista cargó con una responsabilidad que no le corresponde: el
RECONOCIMIENTO de formas léxicas abiertas** (qué cuerpos normativos existen, qué
verbos de dominio significan qué). Eso es trabajo de **juicio**, y el juicio es
del LLM (E1/E2) y del humano. La familia V de 15 mapeos es la prueba: cada uno fue
una **decisión del operador**, no un descubrimiento del compilador. El compilador
no debe *aprender* verbos; debe *verificar* que las oraciones que recibe usan
verbos del enum cerrado, y **rechazar con diagnóstico** lo demás.

Dicho en mis términos: la gramática intentó resolver tensiones **de praxis**
(`incluir↔omitir`, `experto↔novato`, qué verbo de dominio mapea a qué primitiva)
que **ningún formalismo resuelve** — las navega el modelador. Un formalismo (y un
compilador que lo implementa) es un sistema de **resoluciones congeladas de
tensiones sustantivas**: qué es objeto, qué es proceso, qué firma tiene un enlace.
Eso la gramática lo hace bien (93–98.9%). Lo que NO puede hacer —y por lo que pena
en los bordes— es congelar las tensiones de praxis: cada dominio nuevo traerá 3-5
verbos/citas/morfologías que requieren **un juicio nuevo**. Eso no es un defecto
reparable de la gramática; es la **naturaleza de la frontera**. Por eso el acta ya
puso ese trabajo en E1/E2 (el LLM con juicio dialéctico), y por eso el operador
tiene razón a medias: **parte de esto sí va a AI — pero no la traducción al
modelo, sino la NORMALIZACIÓN del sub-dialecto y la propuesta de mapeo, que el
humano confirma.**

### La opción recomendada: (ii) refinada — "compilador como verificador total, LLM como normalizador-proponente"

Evalúo el espectro del brief:

- **(i) gramática determinista pura con bordes generalizados.** *Rechazada.*
  Generalizar (b) y (a) ayuda, pero NO elimina la cola infinita de verbos de
  dominio. Cada dominio nuevo seguiría atascando el flujo en R3 hasta que el
  operador decida un mapeo. Pone sobre un humano finito una tarea infinita. Es
  la utopía que el operador (con razón) sospecha — *si se pretende que la
  gramática sola baste*.
- **(iii) traducción LLM completa proto→modelo, compilador solo validador.**
  *Rechazada.* Rompe lo no negociable: reproducibilidad byte-a-byte (el sello L6
  pierde sentido) y, peor, pone la **emisión de `AnclaNormativa` en manos
  probabilísticas** → riesgo de alucinación de procedencia jurídica. Inaceptable
  para un sistema cuyo valor es la trazabilidad legal. El compilador-como-validador
  llegaría tarde: validaría un bundle que un LLM ya pudo corromper.
- **(ii) híbrido con frontera corregida.** *Recomendada, con una precisión.*

**Mi opción (ii-refinada), con la frontera dibujada al milímetro:**

```
┌─────────────────────── JUICIO (LLM + humano, canal E0-E2, FUERA de la app) ──────────────────────┐
│ E0  anclar función + beneficiario + clasificación        [humano decide, LLM propone]            │
│ E1  glosario: términos → rol/esencia/afiliación          [LLM propone, humano confirma]          │
│ E2  proto-modelo: prosa + bloques OPL sub-dialecto        [LLM ESCRIBE, humano valida]            │
│     · normaliza el sub-dialecto a OPL-ES estricto         ← AQUÍ va el trabajo léxico abierto     │
│     · propone el mapeo de cada verbo/cita de dominio      ← lo que la familia V hacía a mano      │
│     · propone extracción de citas a AnclaNormativa        ← humano confirma la procedencia        │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
                                          │  (proto-modelo en OPL-ES ya normalizado)
                                          ▼
┌─────────────── VERIFICACIÓN (compilador determinista, RED DE SEGURIDAD, DENTRO del repo) ────────┐
│ E4  compila: normalizador(total sobre enum cerrado) → parser → resolutor → emisor                │
│     · NO aprende verbos. Verifica que cada oración usa el enum cerrado. Lo demás: RECHAZA.        │
│     · guards anti-silencio (c): nombre limpio, sin paréntesis colgantes, sin duplicado-absorción  │
│     · emite AnclaNormativa SOLO desde citas con forma reconocida (b, detector de localizador)     │
│     · gates: L1 totalidad, L2 preservación, L8 anclas enumerables, validarModelo, byte-identidad  │
│     · sello de procedencia L6                                                                      │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘
                                          │  (bundle deep-opm-pro.modelo.v0 + OPL + reporte)
                                          ▼
                          E5/E6  OpForja: importa, ve, gestiona, refina (humano + mesa)
```

**La precisión clave que el brief plantea como opción (ii) y que yo endoso con un
matiz:** "el LLM normaliza el sub-dialecto a OPL-ES estricto + compilador verifica".
Mi matiz es **dónde corre el normalizador del sub-dialecto**. Hoy vive en el
compilador (`normalizador.ts`, determinista). El experimento muestra que ese
normalizador determinista hace dos cosas de **naturaleza distinta**:

1. **Reescrituras T2 cerradas** (A1 distribuir listas, A2 stripear prefijo, A6
   expandir multi-destino, AESS inyectar tipo): esto es **mecánico y cerrado** →
   **se queda determinista**, en el compilador. No requiere juicio. Funciona.
2. **Mapeo de verbos/citas/morfología de dominio** (familia V, alfabeto de
   normas, plurales): esto es **abierto y requiere juicio** → **sube a E2, al
   LLM-proponente con confirmación humana**. La familia V de 15 mapeos NO debió
   ser una tabla en el normalizador; debió ser **conocimiento de la skill** que
   propone "`alimenta` probablemente es `requiere`" y el humano confirma en E2,
   produciendo proto en OPL-ES ya estricto.

**Consecuencia:** el compilador determinista se **simplifica y se endurece**. Deja
de intentar adivinar mapeos de dominio (cola infinita) y se vuelve un **verificador
total sobre el enum cerrado**: si la oración usa `requiere`, compila; si usa
`alimenta`, **rechaza con diagnóstico** (no porque no sepa, sino porque `alimenta`
no es OPL-ES — el LLM debió normalizarlo en E2). La frontera se vuelve nítida:

> **El LLM traduce de "como habla el dominio" a "OPL-ES estricto". El compilador
> verifica que lo recibido ES OPL-ES estricto y lo proyecta al modelo de forma
> determinista y reproducible. El LLM NUNCA toca el bundle; el compilador NUNCA
> adivina semántica de dominio.**

Esto preserva **las cuatro restricciones duras** del brief:

| Restricción | Cómo se honra |
|---|---|
| **Trazabilidad legal** (no alucinable) | el LLM *propone* la extracción de cita; el **humano confirma** la procedencia en E2; el compilador solo emite `AnclaNormativa` desde citas con forma reconocida (b). La norma nunca nace de generación libre sin confirmación. |
| **Reproducibilidad** (mismo proto → mismo bundle) | el bundle lo produce SOLO el compilador determinista sobre proto en OPL-ES estricto. Byte-identidad y sello L6 intactos. El no-determinismo del LLM queda *aguas arriba* del artefacto OPL-ES, que es estable y versionable. |
| **Costo de mantención** (humano finito) | el compilador deja de crecer con cada dominio (no más tablas familia-V). El conocimiento de mapeo vive en la skill (reusable, mejorable sin tocar código del kernel). El humano confirma propuestas, no inventa reglas. |
| **Operador = un humano experto** | E2 "LLM propone, humano valida" es exactamente el régimen de trabajo de un experto finito: revisa y ratifica, no transcribe a mano 15 mapeos por dominio. |

### El punto de honestidad que el operador necesita oír

**La gramática determinista NO es una utopía, pero la gramática determinista
*que pretende cubrir el léxico de dominio por enumeración* SÍ lo es.** Esa
segunda —la que tiene `DS|NT|DTO|Ley|Decreto` hardcodeado y una tabla familia-V
que crece con cada dominio— es la que el operador correctamente intuye como
insostenible. La salida NO es "delegar todo a AI" (rompe trazabilidad y
reproducibilidad). La salida es **mover la línea**: el léxico abierto sube al
LLM (E2); la verificación cerrada y la emisión reproducible se quedan
deterministas. El acta del 2026-06-04 ya eligió esta arquitectura; el experimento
solo reveló que **el normalizador estaba del lado equivocado de la línea para una
parte de su trabajo**.

Y un punto que NO debo suavizar: **mientras (c) viva, la pregunta "¿es confiable?"
tiene respuesta NO**, con cualquier arquitectura. Un compilador que produce
modelos corruptos en silencio no es confiable aunque su cobertura sea 99%. (c) se
arregla **antes** de cualquier discusión sobre la frontera LLM/determinista,
porque es ortogonal a ella: el guard anti-silencio es necesario tanto si el
normalizador sube a la skill como si se queda. Es la primera pieza, no la última.

---

## §3 · Qué cambiaría en el repo (lista concreta, SIN implementar)

Ordenado por prioridad. No implemento nada; esto es el pliego de cambios para que
el operador decida y la mecánica (compilador / skill `modelamiento-opm`) ejecute.

**P0 — bloqueante (cierra (c), independiente de todo lo demás):**

1. **Guard de nombre con residuo no-nominal** en el emisor, antes de que el
   Resolutor *cree* una entidad: si el nombre a crear contiene `(`/`)`/`[`/`]` o
   tokens de localizador (`art.`/`§`/`N°`), **no crear** → rechazo nuevo
   `R9 — nombre con material no nominal residual` (fundamento: R-NOM-OBJ-1).
   Archivo de intervención: `app/src/autoria/compilar/emisor.ts` (zona
   `emitirDescripcion`/`Resolutor.resolver`).
2. **Check post-compilación de duplicado-por-absorción**: si dos cosas tienen
   nombres donde uno es prefijo limpio del otro y el sufijo es material
   parentético, emitir diagnóstico (advertencia; escala a bloqueo si el sufijo
   matchea el detector de cita). Archivo: nuevo check en
   `app/src/autoria/compilar/` o ley en `app/src/leyes/`.
3. **Test de regresión (fixture negativo de L2/L8)**: el proto de edificación con
   `(LGUC art. 116)` NO reconocida debe **rechazar**, no producir entidad
   duplicada. Hoy ese caso pasa en silencio — el fixture debe **fallar** con la
   gramática actual y **pasar** tras P0.1. Archivo: `app/src/autoria/compilar/*.test.ts`.

**P1 — generaliza (b), de raíz, no por enumeración:**

4. **Reescribir `ANCLA_PAREN_NORMA_RE`** (`normalizador.ts:1092`) de "enum de
   cuerpos" a "detector de **localizador** + cuerpo libre", con las dos señales de
   §1(b): localizador (`art.|arts.|§|inc.|letra|N°|numeral|título`) + cuerpo
   capturado libre; y cuerpo-con-numeración (`<Mayúsc> <número legal>`). Reusar
   `parsearReferencias`/`parsearReferenciaUnica` intactos. Archivos:
   `normalizador.ts` (`ANCLA_PAREN_NORMA_RE`, `ANCLA_NORMA_INLINE_RE`).
5. **Fixtures de extracción** para `(LGUC art. 116)`, `(OGUC §5.1.6)`,
   `(Ley 19.880 art. 64)`, `(art. 17)` sin cuerpo, `(ISO 19450 §7.3)`, **y
   negativos** que NO deben extraerse: `(opcional)`, `(ver SD1)`, `(versión 2.1)`.
   Archivo: `app/src/autoria/compilar/anclas.test.ts`.

**P2 — cierra los mapeos de dominio (a, d, e) y las 5 en-reflexión:**

6. **(a) Rechazo de plural sin sufijo canónico** `R8` (R-NOM-OBJ-1/2): detector de
   nombre plural en sujeto copular/descripción → diagnóstico que sugiere
   `Conjunto de…`/`Grupo de…` o singular. **NO** el "mapeo candidato" del
   experimento (que normalizaría en silencio). Archivo: `normalizador.ts`.
7. **(d) `está acotado por` bifurcado por firma de extremos** (resuelve la
   en-reflexión #2 de HODOM): temporal (`plazo de N días`) → exhibición
   (`exhibe Plazo`); abstracto↔abstracto → estructural etiquetado «está acotado
   por» (R-OPL-SE-2). Documentar en `gramatica-subdialecto-v0.md` §Familia V como
   **V (acotación)** con las dos ramas. Archivo: `gramatica-subdialecto-v0.md` +
   `normalizador.ts` (`mapearFamiliaV`) + tests.
8. **(e) `notifica a` → `genera <Mensaje>` + estructural etiquetado «dirigido a»**
   (compuesta 1:N). Nueva entrada familia V (V16). Archivos:
   `gramatica-subdialecto-v0.md`, `normalizador.ts`, `emisor.ts` (ruta compuesta),
   tests.

**P3 — corrige la frontera de fondo (el veredicto §2):**

9. **Mover el mapeo de verbos/citas/morfología de dominio del compilador a la
   skill `modelamiento-opm` (E2).** La familia V deja de ser tabla en
   `normalizador.ts` y pasa a ser **conocimiento de normalización de la skill**:
   el LLM propone "`alimenta`→`requiere`", el humano confirma, el proto resultante
   ya está en OPL-ES estricto. El compilador conserva SOLO las reescrituras T2
   cerradas (A1/A2/A6/AESS) y se vuelve **verificador total**: enum cerrado o
   rechazo. Esto es decisión de **arquitectura** del operador, no un parche;
   afecta el reparto de responsabilidad del acta D8 (E2 vs E4). Documentar como
   addendum al acta `2026-06-04-acta-mesa-flujo-canonico…md`.
10. **Actualizar la métrica de cobertura** para que NO cuente como "aplicada" una
    oración que produjo entidad duplicada (el experimento ya confiesa la
    sobrestimación, `:81`). Cobertura sana = aplicadas - corrupciones-silenciosas.
    Archivo: `app/scripts/experimento-segundo-dominio.ts` y el reporte.

**P4 — documental:**

11. **Re-correr el experimento del segundo dominio** tras P0-P2 y registrar la
    cobertura **honesta** (52/57 → la real, no la optimista). Actualizar
    `experimento-segundo-dominio.md`.

---

## §4 · Qué NO hacer

1. **NO agregar `LGUC|OGUC|DFL|Res|Circular|NCh` al enum de `ANCLA_PAREN_NORMA_RE`.**
   Es repetir el error que indignó al operador, en escala mayor, y volver a fallar
   en el tercer dominio. El alfabeto de cuerpos es **abierto**; se reconoce por el
   **localizador**, que es cerrado. (Esto es el §1(b) y la queja del operador,
   literal.)

2. **NO normalizar `Planos de arquitectura son …` a esencia singular conservando
   el nombre plural** (el "mapeo candidato" del experimento §5.1). Plantaría barro:
   un objeto que infringe R-NOM-OBJ-1 emitido sin diagnóstico. El plural se
   **rechaza con diagnóstico**, no se absorbe. *Reconocer y rechazar, no enumerar
   y absorber* — la lección de los tres hallazgos hermanos.

3. **NO delegar la traducción proto→modelo completa a un LLM** (opción iii). Rompe
   reproducibilidad byte-a-byte (sello L6 sin sentido) y, sobre todo, pone la
   emisión de `AnclaNormativa` en manos probabilísticas → **alucinación de
   procedencia jurídica**, el riesgo inaceptable para un sistema cuyo valor es la
   trazabilidad legal. El bundle lo produce SOLO el compilador determinista.

4. **NO dejar que un LLM emita `AnclaNormativa` sin confirmación humana de la
   fuente.** El LLM *propone* la extracción de la cita (E2); el humano *confirma*
   la procedencia. `nivelAutoridad` y `fuente` los declara el humano, no la
   máquina (ya lo fija `diseno-ancla-normativa.md §8`: "NO valida contenido legal",
   "NO decide autoridad"). Esto se mantiene sin importar dónde corra el
   normalizador.

5. **NO meter `notifica`, `alimenta`, `detecta`, `acota`, etc. al enum de verbos
   OPL** (`spec-forja-opl-es §1.1`). El enum es **cerrado** y es lo que hace
   verificable la bisimetría. Los verbos de dominio se **descomponen** en
   primitivas del enum (familia V), no lo inflan. Inflar el enum rompería el
   parser y la garantía de roundtrip.

6. **NO declarar el compilador "confiable" ni cerrar el experimento mientras (c)
   viva.** La cobertura del 93–98.9% es **optimista** hasta que el guard
   anti-silencio exista: cuenta corrupciones como éxitos. (c) es ortogonal a la
   discusión LLM/determinista y va **primero**.

7. **NO modelar el plazo de 30 días (d) como un proceso persistente** (`P-PROC-6`
   lo prohíbe como "escape genérico") ni como un objeto cuyo nombre sea
   `Plazo de 30 días` (vuelve a meter el valor en el nombre, primo de (c)). El
   plazo es **atributo** (exhibición) y su valor "30 días" es **dato del
   atributo**, no parte del nombre. Y el evento de vencimiento (silencio
   administrativo) **espera la ratificación** del `[RATIFICAR]` de la línea 69 —
   es supuesto declarado, no hecho, hasta que el operador lo confirme.

8. **NO tratar `está acotado por` como UN mapeo único.** Son **dos**, según la
   firma de los extremos (R-OPL-SE-2): temporal→exhibición; abstracto↔abstracto→
   estructural etiquetado. Forzar un verbo único violaría la regla que separa
   exhibición de estructural etiquetado.

---

## §5 · Addendum de ratificación P3 — frontera skill/compilador

**Ratificación del operador (2026-06-05):** Felix ratifica P3 y añade una
precisión vinculante: **llevar lo normativo a estándar también es responsabilidad
de la skill**. No queda como tarea del compilador.

**Decisión operativa.** La skill `modelamiento-opm`, en E0-E2 y fuera de la app,
debe:

1. normalizar el léxico abierto de dominio hacia OPL-ES estricto;
2. identificar referencias normativas por forma/localizador, no por enum de
   cuerpos normativos;
3. estandarizar cada referencia normativa en el proto con `cuerpo normativo`,
   `localizador`, `artículos/sección`, `target`, `claveProto`, `estado` y
   `nivelAutoridad` cuando aplique;
4. emitir ledger de normalización y devolver al operador cualquier barro
   normativo que no pueda confirmar;
5. dejar el proto listo para que `autoria/compilar` verifique, no para que
   adivine.

**Frontera dura.** El compilador sigue siendo determinista: verifica OPL-ES
estricto, rechaza con diagnóstico, emite `deep-opm-pro.modelo.v0`, preserva
byte-identidad y porta el sello L6. No aprende verbos de dominio, no inventa
procedencia jurídica y no convierte citas ambiguas en `AnclaNormativa` vigente.

**Lectura categorial (heurística, no norma OPM).** La traducción compilador
proto→bundle se mantiene como funtor de preservación: debe conservar identidad y
composición de los hechos (`urn:fxsl:kb:icas-preservacion`). El LLM/skill queda
aguas arriba como normalizador-proponente de superficie abierta. No se afirma
teorema de adjunción; es la lectura más débil que conserva la garantía
verificable.

**Cambio aplicado en KORA/local:** `modelamiento-opm` v1.5.2 agrega el estado
`normalizar-proto`, reglas P3 y protocolo de estandarización normativa E2.

---

*Fin de la adjudicación. dov-dori — persona sintética; los juicios OPM se anclan a
`urn:fxsl:kb:reglas-opm-estrictas-es` y `urn:fxsl:kb:spec-forja-opl-es` (KORA), y a
las actas y diseños citados del repo. La verdad del dominio (qué dice realmente la
LGUC art. 116) es del operador; yo modelo la forma.*
