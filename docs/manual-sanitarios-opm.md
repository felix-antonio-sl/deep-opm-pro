# Manual sanitario de opforja — modelar sistemas sanitarios complejos con OPM

Perfil **avanzado de dominio**: conserva las decisiones que cambian porque el
sistema es sanitario. Hereda el ciclo productivo del
[manual para transformar sistemas](manual-sistemas-opm.md) y el método del
[manual de opforja](manual-opforja.md). Su estructura propia es:
**tres lentes × cinco escalas**.

---

## 0. Contrato, frontera y ruteo

**Qué es.** Un catálogo de **piezas-decisión** —bifurcaciones reales del modelado
sanitario— organizado por las tres lentes del dominio, más un hilo trabajado y los
límites propios de salud.

**Qué asume.** El ciclo evidencia→AS-IS→TO-BE→intervención→aprendizaje, la ficha,
el sobre de autonomía y el retiro se asumen desde el
[manual transversal](manual-sistemas-opm.md). Primitivas, método Forja A0–A8, OPL,
bundle y mesa humano-agente se asumen desde el
[manual de opforja](manual-opforja.md). La
autoridad semántica es el corpus OPM/Forja SSOT ES (`urn:fxsl:kb:reglas-opm-estrictas-es`,
`urn:fxsl:kb:spec-forja-opd-es`, `urn:fxsl:kb:spec-forja-opl-es`,
`urn:fxsl:kb:metodologia-forja-opm-es`, resueltas por
[canon-opm](canon-opm/resolutor-urn.json)).
El conocimiento sanitario de respaldo vive en el corpus salubrista de KORA
(`urn:salud:kb:*`) y se cita por URN. Las oraciones OPL de este manual son
didácticas; la forma exacta la fija `urn:fxsl:kb:spec-forja-opl-es`. La capa de
referencia rápida son las hojas
[gestión sanitaria](cheatsheets/opforja-sanitarios-gestion.html) y
[sistemas sociosanitarios](cheatsheets/opforja-sociosanitarios.html); este manual
es su propietario.

**Regla editorial.** Cada pieza enseña lo **distintivo sanitario** de una decisión;
su esqueleto agnóstico (cola, recurso, interfaz) se apunta a la autoridad general.
Prosa que valdría igual para un sistema de despacho de pedidos pertenece al
[manual transversal](manual-sistemas-opm.md), no aquí.

**Veto declarado.** Los repos de modelado `hd-opm` y `hodom-opm` **no se citan como
ejemplares ni como buenas prácticas** (orden del operador, 2026-07-09). Todos los
ejemplos son ficticios y frescos: la **Red de Ranquil** (provincia inventada:
Hospital de Ranquil, SAR Los Aromos, CESFAM El Espino, UHD del hospital). La
hospitalización domiciliaria aparece como **materia de dominio** vía el corpus
normativo (`urn:salud:kb:hodom-norma-tecnica-2024`, `urn:salud:kb:hodom-reglamento-ds1-2022`),
nunca como esos modelos.

### Ruteo por síntoma

| Si tu problema es… | Ve a |
|---|---|
| «Mi modelo se está volviendo un mega-diagrama» | §1 · P11 · P12 |
| «¿El paciente es lo que cambia o quien recibe el valor?» | P1 |
| «Mezclé lo clínico con lo administrativo en un objeto» | P2 |
| «¿Modelo personas o atenciones?» | P3 |
| «¿Quién responde: el equipo, el cuidador, la organización?» | P4 |
| «¿Dónde queda el consentimiento / rechazo / contención?» | P5 |
| «Quiero modelar camas, pabellones, cupos» | P6 · P7 |
| «Tengo listas de espera» | P8 |
| «La urgencia se tapa y no sé por qué» | P9 · §8 |
| «Quiero medir gestión (ocupación, estada, reingreso)» | P10 |
| «No sé dónde termina mi sistema» | P11 |
| «La derivación se pierde / la contrarreferencia no vuelve» | P12 · §8 |
| «Triaje, priorización, categorización de demanda» | P13 |
| «Casos tiempo-dependientes que saltan la ruta normal» | P14 |
| «Hospitalización domiciliaria / camas virtuales» | P15 |
| «Quiero que los modelos de la red hablen el mismo idioma» | P16 |
| «Modelo un territorio o una población, no un servicio» | §6 · P17 |
| «Necesito ver la equidad, no el promedio» | P18 |
| «Vigilancia, brotes, campaña de invierno» | P19 |
| «Garantías con plazo (tipo GES)» | P20 |
| «Metí el sistema de información como quien atiende» | P21 |
| «Tengo una exigencia normativa sin fuente a mano» | P22 |
| «¿Qué puede decidir solo el agente modelador?» | P23 |
| «No sé por dónde empezar / me exige demasiado rigor» | P24 · §2 |
| «¿La mesa calcula esto?» | §9 |

---

## 1. El sistema sanitario como objeto OPM

Única sección de lectura lineal; se lee una vez. Cuatro propiedades del dominio
tuercen el método general:

**a) Es sociotécnico.** La clasificación (metodología §A1.2) no es trámite: activa
propósito, ocurrencia del problema y **agencia humana**. En salud casi todo proceso
central es manejado por personas o grupos con responsabilidad jurídica y ética, beneficiario
humano, y condiciones ambientales que habilitan o niegan. Las preguntas del SD
cambian de tono: no «¿qué hace el software?» sino «¿quién responde y qué cambia en
quién?».

**b) Está gobernado por norma que casi siempre se infiere.** Leyes, garantías,
normas técnicas y protocolos gobiernan los procesos, pero el modelador rara vez
tiene la fuente delante al modelar. El dominio obliga a la disciplina de **fuerza
epistémica** (metodología §A7): norma con fuente ≠ requisito declarado ≠ inferencia.
Aquí el ancla `[RATIFICAR]` no es un detalle técnico: es la costura que impide
plasmar recuerdos como hechos (P20, P22).

**c) Tiene forma de red, no de árbol.** La falla número uno del dominio es la
**fragmentación**: derivaciones que no vuelven, transiciones que pierden al paciente,
continuidad que se corta entre niveles (`urn:salud:kb:gestion-redes-general`,
`urn:salud:kb:post-agudo-ltss-transiciones`). Su reflejo en el modelado: el
mega-diagrama que intenta contener la red entera y muere inmantenible. El corte es
**composición por interfaz** (P11, P12): cada subsistema su modelo, objetos-frontera
compartidos, y el hueco estructural — la interfaz sin proceso consumidor — visible
en vez de escondido.

**d) La escala es una entrada de la decisión, no una propiedad del dibujo.** Toda
recomendación sanitaria tiene escala (unidad · establecimiento · red · territorio ·
nacional), y cruzarlas sin declarar es el **error de escala**: la falacia ecológica
(atribuir al individuo la propiedad del agregado) y su inversa atomística (creer que
sumar micro-procesos reproduce la red — la cola y la interfaz tienen propiedades
emergentes que solo existen en la escala superior). Por eso cada modelo declara su
escala en la ficha (§2) y cada pieza porta la suya.

**La espina.** De las hojas de la familia: **tres lentes que no se mezclan** —
**asistencial** (el paciente), **gestión** (el recurso y el flujo), **sistémica**
(la continuidad y la frontera de la red) — y las tres son **ortogonales a la
escala**: se replican en cada una. A escala territorial, el «paciente» de la lente
asistencial es la **población**; el «recurso» de la lente de gestión es la capacidad
de la red; las «interfaces» de la sistémica son los niveles de atención (§6). La
regla operativa no cambia: **un foco por OPD, escala declarada**. Un OPD que
responde dos preguntas de lentes distintas son dos OPDs.

---

## 2. Ficha sanitaria y vida útil

Extiende la [ficha de trabajo transversal](manual-sistemas-opm.md#23-ficha-de-trabajo);
no crea una ficha paralela:

```markdown
### Extensión sanitaria de la ficha
- Lente: asistencial | gestión | sistémica
- Escala: unidad | establecimiento | red | territorio | nacional
- Autoridad clínica, gestora o normativa:
- Daño no tolerable:
- Fuente normativa y vigencia, si aplica:
- Cadencia o gatillo de revisión:
```

La vida útil usa el vocabulario común:

- **respuesta puntual:** muere cuando se responde la pregunta o cesa el evento; el
  modelo de un brote suele pertenecer aquí;
- **referencia viva:** sostiene una observación, preparación o tarea recurrente; el
  sistema de vigilancia suele pertenecer aquí y necesita revisión.

“Instrumento” no es un tipo documental: en OPM significa objeto no humano que
habilita un proceso.

A8 clasifica bloqueos estructurales, mejoras metodológicas y
estilo/legibilidad. La aceptación sanitaria es separada: un dueño competente debe
confirmar plausibilidad clínica, autoridad normativa, escala, seguridad y utilidad.
El criterio de suficiencia se pre-registra; el agente modelador no juzga su propio
trabajo.

La interfaz de graduación muestra severidades reales, pero deja decidir a la
persona. El método no declara cerrado un modelo con problemas portantes, anclas
normativas pendientes o falta de aceptación sanitaria.

Rampa recomendada para un equipo nuevo: una unidad, una pregunta de flujo, hasta
12 entidades y lente de gestión —por ejemplo, el ciclo de una cama (P6). Lo acotado
va primero; la escala siguiente la decide la pregunta.

---

## 3. Lente asistencial — el paciente

Las piezas siguen el orden de la trayectoria: quién cambia, qué estado, qué
episodio, quién actúa, quién autoriza.

### P1 · ¿El paciente es transformee, beneficiario o ambos? `[asistencial · unidad–establecimiento]`

**Pregunta.** ¿Qué rol juega el paciente frente al proceso central?

**La tentación.** Duplicarlo: un **Paciente** que «pasa por el proceso» y un
«Usuario» que «recibe el valor»; o colgar el valor del sistema técnico («el HIS
mejora la atención»).

**El corte.** El paciente suele ser transformee **y** beneficiario a la vez: un
solo objeto. Si el beneficiario es transformado por el mismo proceso, el enlace
transformador prevalece — no se dibujan dos enlaces simultáneos ni dos copias de la
misma persona (metodología §A2.2). El atributo de valor vive en el paciente
(su estado clínico), no en la plataforma (§A2 etapas 2–4).

**Realización mínima.** *Atención de urgencia* cambia **Paciente** de
`descompensado` a `estabilizado`. Beneficiario: el mismo **Paciente**. OPL testigo:
«*Atención de urgencia* cambia **Paciente** de `descompensado` a `estabilizado`».

**Cómo se rompe.** Las dos copias divergen: una acumula estados clínicos, la otra
queda de adorno; la función pierde su atributo de valor auditable y el SD ya no
puede decir qué valor entrega ni a quién.

### P2 · Estado clínico y estado administrativo no comparten eje `[asistencial · unidad–establecimiento]`

**Pregunta.** ¿La condición clínica y la situación asistencial son estados del
mismo eje?

**La tentación.** Un solo abanico de estados del **Paciente**: `grave`,
`hospitalizado`, `compensado`, `dado de alta` — mezcla de dos dimensiones que
cambian por procesos distintos.

**El corte.** Ejes ortogonales se dimensionalizan, no se colapsan (metodología
LF-01; el mecanismo es la exhibición-caracterización, LF-02): el paciente exhibe
**Condición clínica** (`descompensada`, `compensada`) y **Situación asistencial**
(`en espera`, `ingresado`, `egresado`) como atributos con estados propios. El
egreso administrativo puede *condicionarse* a la condición clínica; jamás
confundirse con ella.

**Realización mínima.** **Paciente** exhibe **Condición clínica** y **Situación
asistencial**. *Compensación* cambia **Condición clínica** de `descompensada` a
`compensada`. *Egreso hospitalario* cambia **Situación asistencial** de `ingresado`
a `egresado`. *Egreso hospitalario* ocurre si **Condición clínica** está en
`compensada`, de lo contrario *Egreso hospitalario* se omite (toda condición
declara sus dos ramas — R-COND-RAMA-1).

**Cómo se rompe.** El eje mezclado legaliza transiciones absurdas (alta de un
paciente `grave`), la simulación conceptual recorre trayectorias sin sentido y los
indicadores de gestión terminan leyendo estados clínicos — el error de medición
nace en el modelo.

### P3 · ¿Episodio o paciente? `[asistencial · unidad–red]`

**Pregunta.** ¿Modelo la identidad longitudinal (la persona) o la ocurrencia
temporal (la atención)?

**La tentación.** Crear un «Paciente» nuevo en cada contacto (la persona del
episodio); o lo inverso: colgarlo todo de la persona eterna sin episodios,
imposibilitando contar atenciones.

**El corte.** Son dos cosas con ciclos de vida distintos: el **Episodio** se
**genera** (resultado de la admisión) y se cierra; el **Paciente** se **transforma**
(sus estados persisten entre episodios — la trayectoria de por vida,
`urn:salud:kb:health-systems-science-fundamentos`). El episodio se enlaza
estructuralmente a su paciente. La multimorbilidad vive en la persona; el motivo de
consulta, en el episodio.

**Realización mínima.** *Admisión de urgencia* genera **Episodio de urgencia**.
**Episodio de urgencia** pertenece a **Paciente** (enlace estructural etiquetado;
la etiqueta es decisión declarada). *Alta del episodio* cambia **Episodio de
urgencia** de `abierto` a `cerrado` — el **Paciente** sigue existiendo.

**Cómo se rompe.** Personas duplicadas rompen la trayectoria (nadie puede seguir la
multimorbilidad); o los conteos mienten — el indicador cuenta personas cuando la
pregunta pedía atenciones, y viceversa (P10 hereda el defecto).

### P4 · Quién actúa: equipo, cuidador, organización `[asistencial · unidad–establecimiento]`

**Pregunta.** ¿Quién maneja cada proceso — y es humano?

**La tentación.** «El hospital atiende», «el sistema decide» — la organización o el
software como actor difuso; o degradar al **cuidador** a instrumento del equipo.

**El corte.** Agente = persona o grupo de personas, exclusivamente
(`urn:fxsl:kb:reglas-opm-estrictas-es` R-AG-1). Un equipo, comité, turno o
dirección explícitamente modelado como colectivo humano puede manejar un proceso.
El hospital o la organización abstracta no adquiere enlace de agente por tener
responsabilidad institucional. El **cuidador es agente** cuando su acción constituye
el cuidado —por ejemplo, en hospitalización domiciliaria o salud mental—, no un
recurso del equipo.

**Realización mínima.** **Equipo de UHD** maneja *Visita domiciliaria*.
**Cuidador** maneja *Cuidado entre visitas*. *Cuidado entre visitas* requiere
**Pauta de cuidados** (eso sí es instrumento).

**Cómo se rompe.** Responsabilidad invisible: nadie puede leer del modelo quién
responde por qué; el análisis de tarea humano-máquina (metodología §A1.4) se vuelve
imposible y la delegación real (qué puede hacer el cuidador solo) queda sin
frontera.

### P5 · La voluntad del paciente es condición, no adorno `[asistencial · unidad]` — **«No lo decides tú»**

**Pregunta.** ¿El consentimiento, el rechazo y la contención gobiernan el proceso o
lo decoran?

**La tentación.** Dibujar la trayectoria clínica como si la única agencia fuera del
equipo: el consentimiento como «trámite» (un papel-instrumento) y la contención como
un paso más del protocolo.

**El corte.** Decidir es un acto de **agencia del paciente** (humano → agente): su
resultado (**Consentimiento** `otorgado`/`rechazado`) es un objeto informacional
cuyo estado **condiciona o dispara** los procesos siguientes. La contención es
último recurso normado: su condición de entrada es materia de norma con fuente
(Ley 20.584, Ley 21.331 — `urn:salud:kb:gestion-redes-salud-mental`), no de
memoria. Si dudas de qué exige la norma: **no lo decides tú** — ancla
`[RATIFICAR]` y sigue (P22).

**Realización mínima.** **Paciente** maneja *Decisión informada*. *Decisión
informada* genera **Consentimiento**. **Consentimiento** puede estar `otorgado` o
`rechazado`. **Consentimiento** en `otorgado` inicia *Tratamiento*.
**Consentimiento** en `rechazado` inicia *Reformulación del plan* — no un callejón
sin salida.

**Cómo se rompe.** Un modelo que «funciona» pisoteando la autoridad del paciente es
falso en el mundo aunque valide en la mesa (Verificar↔Validar); en salud mental, una
contención sin condición de último recurso modelada es un riesgo real documentado,
no una omisión estética.

---

## 4. Lente de gestión — el recurso y el flujo

### P6 · La cama es un objeto con estados, no un proceso `[gestión · establecimiento]`

**Pregunta.** ¿Dónde vive la capacidad instalada?

**La tentación.** Un gran proceso «Gestión de camas»; o la cama reducida a número
(«camas disponibles: 38» como atributo suelto del hospital).

**El corte.** La capacidad es un conjunto de recursos con estados: **Cama**
`libre` / `ocupada` / `bloqueada` / `en aseo`. Los procesos (asignar, liberar,
bloquear, preparar) **transforman esos estados** — sin transformee no hay proceso
(`urn:fxsl:kb:reglas-opm-estrictas-es`, familia R-PROC). El número agregado es un
indicador **derivado** (P10), no la cosa.

**Realización mínima.** *Asignación de cama* cambia **Cama** de `libre` a
`ocupada`. **Gestor de camas** maneja *Asignación de cama*. *Preparación de cama*
cambia **Cama** de `en aseo` a `libre`.

**Cómo se rompe.** Sin estados no hay dónde vivan ocupación ni estada (el indicador
queda huérfano de estructura); «Gestión de camas» acumula tres transformaciones
distintas en un proceso multifunción; y la simulación conceptual no puede mostrar el
cuello porque el cuello no existe en el modelo.

### P7 · Reutilizable no es consumible `[gestión · establecimiento]`

**Pregunta.** ¿Este recurso vuelve o se gasta?

**La tentación.** Tratar el insumo como si volviera solo (stock eterno) o la cama
como si se consumiera; y en ambos casos, omitir el proceso de retorno.

**El corte.** La cama, el pabellón, el sillón de diálisis **ciclan**: vuelven a
`libre` por un proceso explícito (aseo, preparación) — si el retorno no tiene
proceso, el modelo miente sobre la capacidad. La unidad de sangre, el fármaco, el
insumo **se consumen** (enlace de consumo); un recurso consumible no clonable puede
designarse lineal (`urn:fxsl:kb:reglas-opm-estrictas-es` R-CAT-LIN-1), y sus
conflictos de uso se advierten (R-CAT-LIN-2).

**Realización mínima.** *Transfusión* consume **Unidad de glóbulos rojos**.
*Preparación de cama* cambia **Cama** de `en aseo` a `libre`. Dos físicas
distintas, dos firmas distintas.

**Cómo se rompe.** Capacidad fantasma: camas que «reaparecen» sin proceso de aseo
esconden el cuello real (que era el aseo, no la dotación); o abastecimiento
confundido con capacidad — se pide más dotación cuando faltaba logística.

### P8 · La cola: ¿estado del paciente u objeto propio? `[gestión · establecimiento–territorio]`

**Pregunta.** ¿Basta `en espera` o la lista de espera merece existencia propia?

**La tentación.** La «Lista de espera» como caja mágica — un objeto sin semántica
donde los pacientes «están» — o, al revés, ignorar que la cola tiene **reglas**.

**El corte.** Ambas formas son legítimas; la decisión es qué pregunta respondes. Si
solo importa el hecho de esperar: estado del paciente (`en espera` → `citado`). Si
importa la **disciplina de la cola** — y en salud casi siempre importa: la espera
sanitaria es priorizada, no FIFO (garantías primero, severidad primero, tiempo de
espera como criterio) — entonces la lista es un objeto informacional propio, y
*Priorización* es un proceso que la transforma. Ahí viven la equidad y la garantía.

**Realización mínima.** **Lista de espera de especialidad** es un objeto
informacional y sistémico. **Lista de espera de especialidad** puede estar
`sin priorizar` o `priorizada`. *Priorización* cambia **Lista de espera de
especialidad** de `sin priorizar` a `priorizada`. **Paciente** puede estar
`en espera`, `citado`, `atendido`.

**Cómo se rompe.** La caja mágica esconde la priorización: imposible mostrar al
gestor (o al auditor) por qué alguien espera más que otro; el indicador de espera
(P10) queda sin procedencia estructural; y la garantía con plazo (P20) no tiene
dónde morder.

### P9 · Boarding: el estado-trampa `[gestión · establecimiento]`

**Pregunta.** ¿La admisión a cama es instantánea en tu modelo?

**La tentación.** La flecha simple urgencia → hospitalización: el paso como acto
sin duración ni estado.

**El corte.** El *boarding* — paciente ya admitido, retenido en urgencia esperando
cama — es un **estado real** del paciente entre dos subsistemas, y es la métrica
centinela del flujo hospitalario (`urn:salud:kb:gestion-redes-urgencias`,
`urn:salud:kb:management-engineering-ext-capacidad`): el cuello no suele ser el
triaje sino la salida. Hacerlo visible es la decisión. Y la espera se **descompone**:
`admitido sin cama` (el que espera entrar) no es `en espera de egreso` (el que
ocupa la cama esperando salir) — dos estados, dos dueños, dos intervenciones.

**Realización mínima.** **Paciente** puede estar `en atención de urgencia`,
`admitido sin cama`, `hospitalizado`, `en espera de egreso`, `egresado`.
*Asignación de cama* cambia **Paciente** de `admitido sin cama` a `hospitalizado`.
*Egreso hospitalario* cambia **Paciente** de `en espera de egreso` a `egresado`.

**Cómo se rompe.** El modelo declara instantáneo lo que dura horas: el gestor
optimiza el triaje (donde no está el problema), la señal centinela no existe en el
tablero, y la discusión «¿faltan camas o falla el egreso?» no puede ni plantearse
(§8 la trabaja completa).

### P10 · El indicador mide, no manda `[gestión · transversal a escalas]`

**Pregunta.** ¿Dónde y cómo vive un indicador en el modelo?

**La tentación.** Plasmar un umbral de ocupación como norma («no superar»), como
atributo suelto sin fórmula, o esperar que la mesa lo calcule.

**El corte.** Un indicador es un **objeto informacional** que declara
**polaridad, unidad, fórmula y procedencia** (metodología §A7). Mide, no manda: si
un umbral obliga, eso es una **norma anclada** (P20, P22), no el indicador. Y la
mesa captura la **estructura** del indicador (de qué estados y conteos se deriva);
el número se mide fuera (§9).

**Realización mínima.** **Índice ocupacional** es un objeto informacional. Su
ficha A7: fórmula = camas en `ocupada` / camas totales; polaridad = óptimo
interior; procedencia = registro
de gestión de camas. Valor ilustrativo de Ranquil: `0,92` — utilería, no benchmark;
los umbrales reales del sector viven en
`urn:salud:kb:management-engineering-ext-capacidad` y se citan, no se copian.

**Cómo se rompe.** El indicador-norma fabrica cry-wolf normativo (P22); el número
sin fórmula es irrefutable (nadie puede auditarlo); y prometer que la mesa lo
computa es la falsa promesa que §9 prohíbe.

---

## 5. Lente sistémica — la continuidad y la frontera

### P11 · ¿Dónde termina MI sistema? `[sistémica · establecimiento–red]`

**Pregunta.** ¿Qué es sistémico y qué es ambiental en este modelo?

**La tentación.** Frontera por comodidad del dibujo («lo que cupo adentro»), o el
alcance infinito («modelemos el sistema de salud»).

**El corte.** Sistémico vs ambiental es **decisión declarada** — la afiliación no
depende del layout (metodología §A2, etapas 6 y 9). La frontera se elige por la
pregunta de gestión (ficha, §2) y se verifica por su **firma**: qué consume, produce
y habilita cruza el borde (§A0.4). Mover la frontera es re-decidir, no arrastrar
cajas.

**Realización mínima.** En el modelo de la UHD de Ranquil: **Equipo de UHD** y
**Cupo de UHD** son sistémicos; **CESFAM El Espino** es un objeto físico y
ambiental (la afiliación se declara con la forma AESS, R-ENT-3); la
**Contrarreferencia** cruza la frontera — existe precisamente para eso (P12).

**Cómo se rompe.** Todo-adentro → mega-diagrama inmantenible (la falla c de §1);
todo-afuera → un sistema sin responsabilidad que no explica nada; frontera
implícita → cada lector imagina una distinta y el modelo deja de ser un acuerdo.

### P12 · La derivación y su vuelta son una interfaz `[sistémica · red]`

**Pregunta.** ¿Cómo se conectan dos subsistemas asistenciales sin fundirlos?

**La tentación.** Una flecha «deriva a» entre establecimientos — el traspaso como
acto sin contenido — o fundir ambos en un solo modelo gigante.

**El corte.** **Composición por interfaz**: cada subsistema su modelo; entre ellos,
**objetos-frontera** (metodología LF-04) que uno genera y el otro consume o
requiere. La **Interconsulta** y la **Contrarreferencia** son esos objetos — la
continuidad es bidireccional o no es (`urn:salud:kb:gestion-redes-general`). La
composición no duplica entidades ni deja referencias colgantes
(`urn:fxsl:kb:reglas-opm-estrictas-es`, familia R-CAT-COMP).

**Realización mínima.** En el CESFAM: *Derivación a especialidad* genera
**Interconsulta**. En el hospital: *Atención de especialidad* requiere
**Interconsulta**. *Atención de especialidad* genera **Contrarreferencia** (una
oración por hecho: el and-fan solo agrupa enlaces del mismo tipo). De vuelta en el
CESFAM: *Continuidad en APS* requiere **Contrarreferencia**. Tres procesos, dos
modelos, una interfaz.

**Cómo se rompe.** La vuelta no existe: una **Contrarreferencia** que nadie consume
es el hueco estructural de la **fragmentación** — el paciente se pierde justo donde
el modelo no quiso mirar. El §8 muestra cómo ese hueco se localiza y se registra
como brecha con predicción (§A7).

### P13 · Triaje y estratificación son un abanico, no una cadena de IFs `[sistémica/gestión · establecimiento–territorio]`

**Pregunta.** ¿Cómo se modela segmentar la demanda por riesgo?

**La tentación.** El triaje como cascada de condiciones («si es grave entonces…»),
o un proceso «Categorizar» sin objeto que cambie.

**El corte.** Clasificar es **poblar un eje**: el resultado del triaje es un estado
(o atributo con estados) del paciente — un **abanico multi-destino declarado**, con
la correspondencia estado→rama explícita. Las formas laxas tipo «según» están
retiradas del ecosistema precisamente porque perdían enlaces en silencio (skill
`modelamiento-opm`, tabla de retiros). La estratificación poblacional (pirámide de
riesgo, `urn:salud:kb:health-systems-science-operativa`) es el mismo corte a otra
escala: especializar la población en estratos (P18).

**Realización mínima.** **Paciente** exhibe **Categoría de triaje**. **Categoría
de triaje** puede estar `sin clasificar`, `C1`, `C2`, `C3`, `C4` o `C5`.
El abanico XOR se declara en una oración agrupada:
“*Triaje* cambia **Categoría de triaje** a exactamente uno de `C1`, `C2`, `C3`,
`C4` o `C5`.” No se escriben cinco transiciones independientes: afirmarían
enlaces separados y podrían sugerir que todas ocurren. **Enfermera de triaje**
maneja *Triaje*. **Categoría de triaje** en `C1` inicia *Reanimación inmediata*.

**Cómo se rompe.** La cadena de IFs esconde el eje (nadie ve la distribución de la
demanda); la correspondencia implícita pierde ramas sin ruido; y el recurso deja de
poder asignarse por riesgo porque el riesgo no es un estado consultable.

### P14 · El bypass es un hecho del modelo, no una nota al margen `[sistémica · red–territorio]`

**Pregunta.** ¿Cómo entra la ruta tiempo-dependiente que salta la red normal?

**La tentación.** Todas las rutas dibujadas equivalentes, y la excepción en texto
libre: «cuando es un infarto va directo al hospital base».

**El corte.** La condición clínica tiempo-dependiente se modela **estricta**: un
evento de estado (`X en estado s inicia P`) o una condición de ejecución que
**omite** el nodo intermedio. El control de flujo se usa cuando responde una
pregunta de ejecución — cuándo ocurre o se omite un paso — no como decoración
(hoja `opforja-control-flujo`, `urn:fxsl:kb:spec-forja-opl-es` §control). La cola
«cuando…» en prosa está retirada: rechaza ruidoso.

**Realización mínima.** **Paciente** en `sospecha de infarto` inicia *Traslado
directo a hemodinamia del hospital base* — el bypass apunta a una **capacidad**
(la hemodinamia), no a un nivel — y la ruta por *Atención en SAR Los Aromos* queda
declaradamente omitida bajo esa condición.

**Cómo se rompe.** La regla vive en la cabeza de quien dibujó: la simulación
conceptual recorre la ruta lenta como si fuera legal, y la red «cumple» en el
modelo el bypass que incumple en la realidad — el modelo certifica lo que no pasa.

### P15 · La hospitalización domiciliaria es una válvula con ruta de retorno `[sistémica · establecimiento–red]`

**Pregunta.** ¿Cómo se modela la cama virtual sin mentir sobre lo que es?

**La tentación.** La UHD como «una sala más» (menos hospital), o peor: como
atención ambulatoria con visitas.

**El corte.** Es **régimen hospitalario en domicilio** — responsabilidad clínica
continua y dirección técnica (`urn:salud:kb:hodom-norma-tecnica-2024`,
`urn:salud:kb:hodom-reglamento-ds1-2022`) —, no atención domiciliaria ambulatoria;
y **tampoco equivale a la cama cerrada** intrahospitalaria: su capacidad y latencia
de rescate son menores, por eso la selección exige bajo riesgo y reversibilidad
(`urn:salud:kb:hodom-invariante-no-equivale-cerrada`: hospitalario **de régimen**,
no **de intensidad**). De ahí las dos compuertas del modelo: criterios de ingreso y
**ruta de retorno de primera clase**. El cupo
domiciliario es capacidad con estados (P6 aplicada); el ingreso exige condiciones
habilitantes (domicilio apto, cuidador — que es agente, P4); y el **escalamiento**
(retorno al hospital) es un proceso con evento disparador, no una esperanza.

**Realización mínima.** **Cupo de UHD** puede estar `libre` u `ocupado`.
**Resultado de evaluación domiciliaria** puede estar `apto` o `no apto`. *Ingreso
a UHD* cambia **Paciente** de `hospitalizado` a `hospitalizado en domicilio`.
*Ingreso a UHD* ocurre si **Resultado de evaluación domiciliaria** está en `apto`,
de lo contrario *Ingreso a UHD* se omite. **Paciente** en
`descompensación en domicilio` inicia *Retorno al hospital*.

**Cómo se rompe.** Sin ruta de retorno modelada, la válvula es una trampa: el
paciente agudo queda en casa sin proceso de escalamiento — y el modelo lo bendice.
Confundirla con lo ambulatorio borra la responsabilidad continua que la norma exige
sostener; equipararla a la cama cerrada esconde la brecha de rescate que justifica
sus compuertas.

### P16 · Bibliotecas gobernadas: que la red hable un idioma `[sistémica · red]`

**Pregunta.** ¿Cómo comparten tipos los modelos de una red sin divergir en
silencio?

**La tentación.** Cada establecimiento define su propio **Paciente**, **Cama**,
**Derivación** (modelos incomparables); o copiar-pegar tipos entre modelos — la
copia diverge y nadie lo nota.

**El corte.** Los tipos comunes viven en una **biblioteca gobernada** y los modelos
los reusan por **Calcar** (copia desacoplada, consciente) o **Anclar** (referencia
viva vigilada: el Centinela de Drift avisa cuando la Pieza de la biblioteca cambió —
`urn:fxsl:kb:spec-forja-opd-es` R-OPD-ROT-9). El Anclaje no emite OPL nuclear: es
contenido meta del autor. Y la gobernanza es un **principio**, no maquinaria: la red
necesita **un curador del vocabulario**; el chip ⟳ divergente es una señal
organizacional — alguien decide re-sincronizar o soltar — no un adorno. (Donde esto
suponga varios establecimientos reales operando la misma mesa, es prospectivo y se
declara: §9.)

**Realización mínima.** El **Paciente** del modelo de urgencia de Ranquil se ancla
a la Pieza **Paciente** de la biblioteca de la red; cuando la biblioteca evoluciona,
el marcador de drift lo señala en el lienzo y el Inspector ofrece re-sincronizar o
soltar (irreversible).

**Cómo se rompe.** La red «comparte» tipos solo de palabra: dos hospitales miden
«ocupación» sobre Camas distintas y comparan peras con manzanas; o el Calco
silencioso divergió hace meses y las decisiones de red se toman sobre vocabularios
que ya no coinciden.

---

## 6. La escala poblacional — las tres lentes suben de escala

No es una cuarta lente: es la misma tríada con otro objeto. A escala
territorio/nacional, el «paciente» de la lente asistencial es la **población**, el
«recurso» es la capacidad de la red, y las «interfaces» son los niveles de
atención. Cada pieza porta su lente-madre en el tag. Aquí es donde el **error de
escala** muerde con más fuerza — por eso la marca «No lo decides tú» aparece dos
veces.

### P17 · ¿La población es un objeto propio o un agregado de pacientes? `[asistencial-a-escala · territorio–nacional]` — **«No lo decides tú»**

**Pregunta.** ¿Qué cosa es «la población» en tu modelo?

**La tentación.** Promediar los pacientes de tus otros modelos y llamarlo
población; o al revés, atribuir a un individuo la tasa del agregado.

**El corte.** A esta escala la **Población** es un objeto propio — un grupo humano
con atributos poblacionales (cobertura, prevalencia) y estados propios — **no** la
suma de tus objetos-Paciente. Cruzar propiedades entre escalas es inferencia
cross-escala: la **falacia ecológica** (agregado→individuo) y la **atomística**
(suma de micro→red). Una inferencia cross-escala **no se plasma como hecho**: se
rediseña en la escala correcta o queda como `[RATIFICAR]` — el agente modelador la
eleva siempre (P23).

**Realización mínima.** **Población inscrita de El Espino** exhibe **Cobertura de
control cardiovascular**. **Cobertura de control cardiovascular** puede estar
`bajo meta` o `en meta`. *Rescate de inasistentes* cambia **Cobertura de control
cardiovascular** de `bajo meta` a `en meta`. **Equipo de sector** maneja *Rescate
de inasistentes*.

**Cómo se rompe.** El modelo poblacional hereda estados clínicos individuales que
no significan nada en el agregado; o el gestor lee el indicador de red como
atributo del encuentro — y receta al individuo la medicina del promedio.

### P18 · ¿Población homogénea o estratificada? `[gestión-a-escala · territorio]`

**Pregunta.** ¿Tu pregunta de gestión es de equidad? Entonces el promedio es tu
enemigo.

**La tentación.** «La población» como un solo objeto homogéneo: la meta se cumple
«en promedio» y el modelo queda en paz.

**El corte.** Si la pregunta es de equidad, la población se **especializa en
estratos** («puede ser»: urbana/rural, quintiles, aseguramiento, pueblos
originarios) y la inequidad se modela como **indicador-brecha entre estratos** — un
objeto informacional propio (P10 aplicada dos veces más una resta), con su
polaridad (`menos brecha es mejor`). El promedio esconde la brecha por
construcción; el estrato la exhibe.

**Realización mínima.** **Población inscrita** puede ser **Población urbana** o
**Población rural** («puede ser» es especialización XOR y va con «o»; si los
estratos no fueran excluyentes, la forma es «**Población urbana** y **Población
rural** son **Población inscrita**»). **Brecha de cobertura** es un objeto
informacional. Su ficha A7: fórmula = cobertura urbana − cobertura rural;
polaridad = menos es mejor; procedencia = registros de sector. Valores de Ranquil:
utilería rotulada.

**Cómo se rompe.** La inequidad es invisible por construcción — no hay dónde
mirarla; la meta promedio se cumple mientras el estrato rural cae, y el modelo
**certifica** una equidad que no existe. Ese es un daño de diseño, no de datos.

### P19 · El brote es un evento poblacional con umbral `[sistémica/asistencial-a-escala · territorio–nacional]`

**Pregunta.** ¿Cómo entra la señal epidemiológica al modelo de capacidad?

**La tentación.** La vigilancia como proceso decorativo sin gatillo; o modelar el
brote «dentro» del sistema asistencial, como si el sistema lo produjera.

**El corte.** El brote es un proceso **ambiental** — la ocurrencia del problema
(metodología §A2.5) — que cambia el estado de la **Población**; la **señal con
umbral** es el evento que inicia la respuesta. Regla dura del dominio: **capacidad
y epidemiología se leen juntas** — un modelo de camas ciego a la señal invernal
modela un hospital que no existe (`urn:salud:kb:gestion-redes-urgencias`). Y en la
ficha (§2), distingue la vida útil: el modelo **del brote** es una respuesta
puntual (muere al cerrarse el brote); el **sistema de vigilancia** que lo detecta
es una referencia viva. Si existe para preparación, su revisión pregunta por
fidelidad y obligación, no por consumo reciente.

**Realización mínima.** *Circulación viral invernal* es un proceso físico y
ambiental. *Circulación viral invernal* cambia **Población** de `endemia basal` a
`sobre umbral`. **Población** en `sobre umbral` inicia *Activación del plan de
invierno*. *Activación del plan de invierno* cambia **Dotación de camas** de
`basal` a `reforzada` (con estados explícitos el verbo es «cambia … de … a», no
«afecta» — R-OPD-EST-3).

**Cómo se rompe.** El hospital «sorprendido» cada invierno: la capacidad se modeló
ciega a la señal — el anti-patrón registrado del rol salubrista (vigilancia
omitida). O vigilancia-teatro: señales que nadie conectó a ninguna respuesta.

### P20 · La garantía con plazo es un ancla, no un atributo mágico `[sistémica-a-escala · nacional]` — **«No lo decides tú»**

**Pregunta.** ¿Cómo entra una garantía tipo GES al modelo?

**La tentación.** «Es GES» como etiqueta suelta del paciente; o plasmar el plazo
que recuerdas como hecho del modelo.

**El corte.** La garantía es **norma con plazo**: se adjunta como **ancla
normativa** al proceso garantizado (cuerpo normativo + localizador + vigencia), y
el plazo se realiza como **evento temporal**: el sobretiempo dispara una excepción
con manejador (metodología §A7, errores temporales) — la gestión del
incumplimiento es un proceso, no un bochorno. El plazo que recuerdas no es el plazo
que rige: `[RATIFICAR]` hasta tener la fuente (P22).

**Realización mínima.** *Atención de especialidad garantizada* porta ancla
normativa (estado `pendiente-ratificación` hasta la fuente). *Gestión de
incumplimiento de garantía* ocurre si duración de *Atención de especialidad
garantizada* excede el plazo garantizado — la cota de sobretiempo (EX1); el valor
y la unidad los fija el ancla ratificada. *Gestión de incumplimiento de garantía*
cambia **Caso garantizado** de `en plazo` a `incumplido gestionado`.

**Cómo se rompe.** Garantías «cumplidas» contra plazos inventados; o el modelo sin
manejador de sobretiempo — incompleto para simular justo el escenario que le
importa al gestor (¿qué pasa cuando el plazo vence?).

---

## 7. Reglas sanitarias transversales

### P21 · El sistema de información jamás atiende `[transversal · todas las escalas]`

**Pregunta.** ¿Quién actúa y con qué?

**La tentación.** «El HIS registra», «el sistema agenda», «la IA decide la cama» —
el software como quien hace. Es el error número uno del dominio, en ambas hojas.

**El corte.** Agente = humano o grupo humano, **exclusivamente**; software, IA,
dispositivos y sistemas externos entran por enlace de **instrumento** aunque
coloquialmente «decidan» (`urn:fxsl:kb:reglas-opm-estrictas-es` R-AG-1 y R-AG-1A;
anti-patrón AP-05). La responsabilidad ayuda a identificar a la persona o grupo que
debe representarse; no convierte al software ni a una entidad abstracta en agente.

**Realización mínima.** *Registro clínico* requiere **Ficha clínica electrónica**.
**Profesional de urgencia** maneja *Registro clínico*. La ficha electrónica es
interoperable (`urn:salud:kb:estandares-it-core-cl`) — y sigue siendo instrumento.

**Cómo se rompe.** Responsabilidad diluida («lo decidió el sistema») que ningún
auditor acepta; el análisis humano-máquina imposible; y la validación de la mesa
acusando el enlace de agente ilegal en cada import.

### P22 · Inferido no es norma — y la norma caduca `[transversal]` — **«No lo decides tú»**

**Pregunta.** ¿Este requisito que estoy plasmando, quién lo manda?

**La tentación.** Plasmar como hecho la norma recordada («el protocolo dice…»); o
ratificar una vez y creer que es para siempre.

**El corte.** Tres caras (metodología §A7, fuerza epistémica): (1) **norma con
fuente** → ancla normativa vigente; (2) **afirmación normativa recordada** → ancla
`[RATIFICAR]`, que se resuelve contra la fuente — jamás por borrado silencioso; (3)
**norma ratificada que caducó** → las garantías, aranceles y normas técnicas tienen
vigencia: re-ratificar es mantenimiento, no ceremonia. Una hipótesis clínica o de
modelado no es ancla normativa: se resuelve con evidencia, decisión humana,
supuesto explícito o declaración fuera de alcance. El puente descrito en la
[pista agente](manual-opforja.md#pista-agente) transporta pendientes; nunca los
ratifica por sí solo.

**Realización mínima.** Oración estricta + ancla: «*Notificación de brote* genera
**Notificación ENO** `[RATIFICAR #plazo-eno: plazo normativo de notificación
vigente]`» — el hecho compila; el pendiente queda auditable.

**Cómo se rompe.** El cry-wolf normativo (todo `[RATIFICAR]`, nadie ratifica) o su
inverso (inferencias plasmadas como ley); y el modelo normativo-zombi: una norma
derogada operando en el modelo años después de morir en el diario oficial.

### P23 · Elevaciones sanitarias del agente modelador `[gobernanza sanitaria]`

El sobre general pertenece al
[manual para transformar sistemas](manual-sistemas-opm.md#52-sobre-de-autonomía)
y el protocolo técnico, a la
[pista agente](manual-opforja.md#pista-agente). El delta sanitario es qué debe
elevar siempre:

- significado clínico y estado buscado;
- consentimiento, seguridad y daño no tolerable;
- umbrales, plazos y autoridad normativa;
- inferencias entre individuo, establecimiento, red y población;
- frontera entre niveles de atención;
- suficiencia de evidencia clínica, gestora o poblacional.

El agente puede corregir sintaxis, layout, serialización y roundtrip; no puede
afirmar hechos clínicos, ratificar sus propias hipótesis ni juzgar la ficha.

**Realización mínima.** (Sin OPL: es un contrato de trabajo.) El agente encuentra
que «Egreso» necesita saber si el paciente tiene cuidador: **no inventa** el
estado — deja el hueco, anota la pregunta, y el dueño de la pregunta lo declara.

**Cómo se rompe.** Deuda de autonomía: un portafolio «productivo» sembrado de
hechos clínicos que ningún clínico afirmó — indistinguibles de los verdaderos hasta
que uno muerde.

### P24 · El sistema observado antes que el prescrito `[entrada sanitaria]`

**Pregunta.** ¿Cuánto rigor le debes al primer trazo?

**La tentación.** Exigir el SD perfecto antes de empezar (parálisis por método); o
lo inverso: bautizar «modelo» lo que es exploración sin cobrarle nunca el rigor.

**El corte.** Lo distintivo sanitario es que el sistema suele existir antes de ser
diseñado como un todo. Se modela en modo reverso (metodología §A1.3), desde la
práctica observada, no solo desde el procedimiento prescrito. El dueño sanitario
acepta el AS-IS antes de diseñar el TO-BE.

La mecánica de apunte, Taller, adopción y graduación pertenece al
[manual de opforja](manual-opforja.md#2-flujo-de-modelamiento-forja). Graduar cambia
el régimen de rigor; no resuelve una ambigüedad clínica, un OPD huérfano ni la falta
de aceptación sanitaria.

**Realización mínima.** (Flujo, sin OPL.) Bosqueja el flujo de urgencia como
apunte; cuando la pregunta esté clara, completa la extensión sanitaria, reconcilia
los OPDs y revisa las severidades antes de decidir la graduación.

**Cómo se rompe.** El mega-SD prematuro decide arquitectura antes de entender la
función (metodología §A0.2); o el portafolio de «modelos» que son apuntes con
corbata — exploración nunca graduada que alguien ya usa para decidir.

---

## 8. El hilo — Red de Ranquil, de la ficha al veredicto

Ejemplo trabajado **pequeño**: tres OPDs, una ficha, un veredicto. La Red de
Ranquil es ficticia; sus números son utilería. El hilo usa las piezas P6, P9, P10,
P11, P12 y P15 — las demás piezas de este manual usan fragmentos independientes y
no acumulan estado entre sí.

**La ficha (pre-registrada el día 1):**

> - **Pregunta de gestión**: ¿la saturación de la urgencia de Ranquil responde a
>   falta de camas o a fallas del proceso de egreso — y dónde exactamente?
> - **Dueño**: equipo de subdirección médica del hospital (grupo humano nombrado).
> - **Lente**: gestión (con una excursión sistémica declarada) · **Escala**: establecimiento→red.
> - **Vida útil**: respuesta puntual — muere cuando la intervención se decida.
> - **Criterio de suficiencia (fechado)**: el modelo descompone la espera en estados
>   con dueño identificable, localiza estructuralmente dónde se corta la ruta de
>   retorno, y entrega los indicadores que discriminan las hipótesis. **No** exige
>   adjudicar cuál hipótesis pesa más: eso lo dirán los números medidos fuera (§9).

**OPD 1 — el flujo con la espera descompuesta** `[gestión · establecimiento]`.
**Paciente** puede estar `en atención de urgencia`, `admitido sin cama`,
`hospitalizado`, `en espera de egreso`, `egresado`. *Asignación de cama* cambia
**Paciente** de `admitido sin cama` a `hospitalizado`. *Asignación de cama* cambia
**Cama** de `libre` a `ocupada` (P6). La descomposición clave (P9): el que espera
**entrar** no es el que espera **salir** — y la espera de egreso se dimensionaliza
(LF-01, como en P2): **Paciente** exhibe **Motivo de espera de egreso**, que puede
estar `esperando trámite`, `esperando cuidador`, `esperando contrarreferencia`.
Cada estado tiene un dueño
distinto (gestión de camas, trabajo social, APS): la espera dejó de ser una niebla.

**OPD 2 — la interfaz que no vuelve** `[sistémica · red]`. *Egreso a UHD* genera
**Contrarreferencia** (P12, P15). En el modelo del CESFAM debería existir
*Continuidad en APS* que la **requiera** — y al modelar el AS-IS de Ranquil, no
existe: la **Contrarreferencia** se genera y ningún proceso la consume. El modelo
no lo esconde: lo registra como **brecha** (metodología §A7 — estructura sin
consumidor → predicción testeable: «los reingresos precoces de egresados a UHD se
concentran en pacientes cuya contrarreferencia nadie procesó»). Esa ausencia
localizada ES el hallazgo.

**OPD 3 — el tablero con procedencia** `[gestión · establecimiento]`. Dos
indicadores (P10), cada uno con fórmula y procedencia declaradas: **Días-cama en
espera de egreso** (por sub-estado — discrimina la hipótesis «proceso») y
**Solicitudes sin cama libre disponible** (discrimina la hipótesis «capacidad»).
La mesa estructura ambos; los números se miden en los registros del hospital.

**El veredicto (cualitativo/estructural, declarado).** El modelo **no adjudica**
entre capacidad y proceso — eso exige los números que la mesa no computa (§9). Lo
que entrega, y basta para el criterio pre-registrado: (1) la espera descompuesta en
estados con dueño — tres colas distintas donde antes había una; (2) el corte
estructural de la contrarreferencia, localizado y registrado como brecha con
predicción; (3) los dos indicadores discriminantes listos para medirse. La
subdirección decide con esto rediseñar el trámite de egreso y nombrar un dueño de
la contrarreferencia en APS. **Cumplido el criterio, el modelo muere**: se archiva
con su ficha; si la pregunta renace, nace una ficha nueva.

---

## 9. Cuando la mesa no llega

La frontera general vive en el
[manual para transformar sistemas](manual-sistemas-opm.md#9-frontera-de-capacidad-de-opforja).
Estas son sus consecuencias propias en salud:

| Lo que el dominio pide | Lo que la mesa da — y lo que no |
|---|---|
| Calcular colas, ocupación, tiempos de espera (teoría de colas, simulación de eventos discretos) | La mesa captura la **estructura** del flujo (estados, procesos, abanicos) y la simulación **conceptual** recorre orden, precondiciones y ramas. Los **números** se calculan fuera (planilla, R, un simulador DES) sobre los indicadores que el modelo estructura (P10). Prometer cálculo de colas es la falsa promesa capital de este dominio. |
| Inferir un diagnóstico, riesgo individual, causalidad o señal epidemiológica | La mesa modela hipótesis, estados y respuesta; no realiza juicio clínico ni inferencia epidemiológica. Personas competentes y herramientas especializadas producen el veredicto. |
| Certificar cumplimiento normativo, seguridad clínica o equidad | El modelo conserva anclas, responsabilidades, estratos y evidencia esperada; no certifica conformidad ni reemplaza auditoría especializada. |
| Integrar el portafolio de toda una red | No hay federación automática. La alternativa operable es composición por objetos-frontera (P12) y vocabulario gobernado mediante bibliotecas/Piezas (P16). |

---

## Apéndice A — Mapa de herencia y autoridad

Cada pieza sanitaria aplica un patrón general sin volver a explicarlo. LF-* refiere
al catálogo de lecciones de `urn:fxsl:kb:metodologia-forja-opm-es`.

| Pieza(s) | Esqueleto agnóstico | Autoridad |
|---|---|---|
| P1 | transformee/beneficiario y doble rol | metodología §A2.2, etapas 2–4 |
| P2 | dimensionalización de estados ortogonales; exhibición-caracterización | LF-01 · LF-02 |
| P3 | objeto generado vs objeto transformado; identidad longitudinal | reglas R-PROC/consumo-resultado |
| P4, P21 | agente humano vs instrumento | reglas R-AG-1, R-AG-1A · AP-05 |
| P5 | resultado informacional que condiciona ejecución | opl-es §control (c, evento) |
| P6, P7 | recurso con estados; recurso lineal consumible | reglas R-CAT-LIN-1/2 (LF-19 como lectura de integridad de estados) |
| P8 | cola como objeto vs estado; tensión Incluir↔Omitir | `urn:fxsl:kb:tensiones-modelamiento` B1 |
| P9 | estado intermedio visible entre subsistemas; espera dimensionalizada | LF-03 · LF-01 |
| P10 | atributo cuantitativo con polaridad/unidad/fórmula/procedencia | metodología §A7 |
| P11 | frontera declarada y firma de frontera | metodología §A0.4 · reglas R-CAT-EQ-2/3 |
| P12 | objeto-frontera congelado; composición por interfaz | LF-04 · reglas R-CAT-COMP |
| P13 | abanico multi-destino declarado, correspondencia estado→rama explícita | spec-forja-opl-es R-FAN-5/R-FAN-7 |
| P14 | evento de estado + condición/omisión | opl-es §7 · metodología §A6 |
| P15 | capacidad con estados + proceso de escalamiento por evento | P6 + opl-es §control |
| P16 | reuso gobernado: Calco/Anclaje/Centinela | spec-forja-opd R-OPD-ROT-9 |
| P17, P18 | objeto-agregado propio; especialización en estratos | metodología §A2 · «puede ser» |
| P19 | ocurrencia del problema como proceso ambiental; evento por umbral | metodología §A2.5 |
| P20, P22 | ancla normativa; fuerza epistémica del requisito; error temporal | metodología §A7 · skill `modelamiento-opm` §anclas |
| P23 | elevaciones sanitarias del sobre de autonomía | [manual de sistemas §5](manual-sistemas-opm.md#5-ingeniería-agéntica-del-trabajo) |
| P24 | entrada reversa sanitaria sobre bosquejo bottom-up | metodología §A1.3/A1.5 · spec-forja-opd R-OPD-REF-20 |

---

## Fuentes y siguiente paso

Procedencia de creación:
[acta de deliberación sanitaria](auditorias/2026-07-09-acta-manual-sanitarios-opm.md).
Git conserva la historia editorial.

Autoridades de uso:

- [manual para transformar sistemas](manual-sistemas-opm.md);
- [manual de opforja](manual-opforja.md);
- [resolutor OPM/Forja](canon-opm/resolutor-urn.json);
- corpus sanitario `urn:salud:kb:*`.

Vuelve al [índice documental](README.md) o usa las
[hojas rápidas](cheatsheets/README.md).
