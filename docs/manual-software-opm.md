# Manual de opforja para ingeniería de software — del dominio a la operación

Manual **avanzado de dominio** para usar opforja en el ciclo de vida del software:
desde la base documental, las ideas y necesidades hasta el diseño, desarrollo,
despliegue, operación, evolución y retiro. Es hermano de `manual-opforja.md`, que
enseña la mesa y el método, y de `manual-opm-puro.md`, que enseña OPM.

Compañero de bolsillo: `docs/cheatsheets/opforja-software.html`.

---

## 0. Contrato, alcance y ruteo

### Qué es

Este manual enseña **qué decisiones de ingeniería de software conviene modelar**,
qué artefacto conserva cada decisión y cómo entregar contexto verificable a humanos
y agentes de desarrollo. No enseña sintaxis OPM, botones básicos ni una metodología
de programación completa: los cruza cuando hacen falta y apunta a su autoridad.

Su tesis es simple:

> opforja es la mesa semántica del sistema; el repositorio, los tests, el pipeline y
> la telemetría siguen siendo las fuentes operativas de implementación y ejecución.

El modelo no es un dibujo previo al código ni un gemelo automático del repositorio.
Es un **contrato de intención, comportamiento y frontera** que permite decidir qué
construir, dividir el trabajo y detectar cuándo el software ya no realiza la función
acordada.

### Qué asume

- OPM y el método Forja se asumen desde `manual-opm-puro.md` y
  `manual-opforja.md`; aquí no se duplican.
- La operación cotidiana de la UI se asume desde `uso-productivo.md`.
- La autoridad OPM/Forja vive en el corpus resuelto por
  `docs/canon-opm/resolutor-urn.json`.
- El código define el contrato exacto de las capacidades de la app. Este manual
  describe su uso; no redefine sus tipos ni sus gates.

### Leyenda de capacidad

Este manual usa tres marcas para evitar promesas ambiguas:

| Marca | Significado |
|---|---|
| **HOY** | Capacidad implementada y verificable en la app o su toolchain local. |
| **CORTO** | Extensión acotada, compatible con la arquitectura vigente y propuesta aquí; no está comprometida en el roadmap hasta que el operador la priorice. |
| **FUERA** | No existe o exige otro producto/sistema; no se presenta como capacidad de opforja. |

### Ruteo por síntoma

| Si tu problema es… | Ve a |
|---|---|
| «Tengo documentos, entrevistas y notas, pero no un modelo» | §2 · S1 · S2 |
| «El sistema ya existe y debo entenderlo o modernizarlo» | §2.5 · §7.2 |
| «La idea ya viene disfrazada de solución» | S3 |
| «No sé si modelar el dominio o la arquitectura» | §1 · S4 |
| «Quiero capturar requisitos y cobertura» | S5 · S6 · S7 |
| «Necesito comparar alternativas de arquitectura» | S8 |
| «Tengo servicios, APIs, eventos y bases de datos» | S9 · S10 · S11 |
| «La confiabilidad, seguridad o rendimiento quedaron como adjetivos» | S7 · S12 |
| «Quiero delegar implementación a uno o varios agentes» | §5.1 · S14 · §5.2 · S15 |
| «¿opforja genera código o mantiene sincronía con el repo?» | S15 · §9 |
| «Necesito modelar CI/CD y despliegue» | §6 · S16 |
| «Hubo un incidente y el modelo quedó viejo» | §7 · S17 · S18 |
| «Necesito modernizar o retirar un sistema» | §7.1 · §7.2 · Runbook E |
| «Quiero saber qué se puede implementar pronto» | §8 |
| «Necesito una receta operativa corta» | §10 |

---

## 1. El lugar de opforja en un sistema de trabajo de software

### 1.1 Tres modelos, no un mega-modelo

El software mezcla tres preguntas que conviene separar:

1. **Dominio y producto** — qué cambia para el usuario o el negocio, quién recibe
   valor, qué reglas gobiernan el cambio y cuál es la frontera del problema.
2. **Sistema software** — qué componentes, datos e interfaces realizan esa función;
   qué alternativas preservan la misma firma de frontera; cómo fallan.
3. **Entrega y operación** — cómo código, artefactos, releases, ambientes y señales
   de runtime pasan de un estado a otro.

Son modelos hermanos, conectados por objetos-frontera, no niveles obligatorios de un
solo árbol. Un modelo de dominio no debe llenarse de nombres de frameworks; un modelo
de arquitectura no debe inventar la necesidad que pretende realizar; un modelo de
entrega no debe convertirse en la descripción del producto.

**Regla de corte:** si dos OPDs responden preguntas con dueños distintos, criterios
de suficiencia distintos o ritmos de cambio distintos, probablemente pertenecen a
modelos distintos. opforja **HOY** puede mantenerlos separados, componer modelos
guardados mediante una interfaz compartida y conectar submodelos como vistas de solo
lectura. Eso no equivale a federación automática ni coedición distribuida.

### 1.2 Cadena de autoridad por artefacto

La productividad agéntica exige que cada afirmación tenga un dueño. Si todo se
declara «fuente de verdad», nada lo es.

| Plano | Fuente operativa | Papel de opforja |
|---|---|---|
| Evidencia del dominio | documentos, entrevistas registradas, normativa, datos | estructura hechos, términos, transformaciones, supuestos y preguntas |
| Intención y comportamiento | modelo OPM + OPL confirmado por su dueño semántico autorizado | **mesa principal** para función, frontera, estados, enlaces y refinamiento |
| Requisitos | tracker/especificación + tests de aceptación | representa requisitos y qué cosas/enlaces los satisfacen; no reemplaza el tracker |
| Arquitectura | ADRs, contratos de interfaz, modelo OPM | compara alternativas y hace visibles dependencias, ownership y fallos |
| Implementación | repositorio Git | entrega contexto; no es fuente del código ni lo genera **HOY** |
| Verificación | tests y CI | expresa qué conducta debía verificarse; el veredicto vive en CI |
| Despliegue | pipeline, manifiestos, registro de artefactos | modela el proceso y sus compuertas; no despliega |
| Operación | logs, métricas, trazas, incidentes | formula hipótesis y actualiza el contrato; no ingiere telemetría |

La cadena no es lineal para siempre. Operación devuelve evidencia al dominio; una
decisión de arquitectura modifica requisitos; un test fallido puede revelar que el
modelo era falso. La disciplina es **volver al artefacto propietario**, no parchear
una copia derivada.

### 1.3 Lo que hace productiva a la mesa

Un modelo productivo de software no necesita describir cada clase. Debe reducir al
menos una de estas incertidumbres:

- qué valor cambia y para quién;
- qué estado o dato porta ese cambio;
- qué regla permite, impide o bifurca el comportamiento;
- dónde está la frontera y quién posee cada dato/interfaz;
- qué alternativa de solución preserva la función;
- qué requisito cubre qué parte del sistema;
- qué falla puede ocurrir y cómo se recupera;
- qué debe saber un implementador o agente para cambiar el sistema sin adivinar.

Si el modelo no cambia una decisión, no reduce riesgo ni mejora el relevo, es
ceremonia. Archívalo o acótalo.

---

## 2. Desde la base documental del dominio

### 2.1 La base documental es evidencia, no OPM crudo

La base puede contener Markdown, PDFs, tickets, ADRs, glosarios, contratos de API,
capturas, normas e historias orales. Ninguno entra íntegro al modelo. Primero se
separa:

- **hecho observado** — alguien competente lo confirma o existe una fuente;
- **decisión** — una persona autorizada escoge entre alternativas;
- **restricción** — limita soluciones posibles;
- **hipótesis** — parece cierta, pero falta evidencia;
- **pregunta** — deuda de conocimiento que no debe rellenar el agente;
- **término** — nombre canónico y sinónimos que el equipo debe normalizar.

La app **HOY no ingiere, indexa ni interpreta automáticamente** una carpeta de
documentos. El humano o el agente leen las fuentes, construyen un ledger y llevan a
opforja solo los hechos que aportan al propósito del modelo.

### 2.2 Ledger mínimo de evidencia

Antes del primer modelo cerrado, mantener junto a la base documental una tabla
liviana como esta:

```markdown
| ID | Fuente y localizador | Afirmación | Fuerza | Destino | Estado |
|---|---|---|---|---|---|
| D-01 | docs/dominio.md §3 | una reserva bloquea un intervalo de una sala | confirmado | objeto/enlace | modelar |
| E-02 | entrevista 2026-07-14, min 18 | el aprobador puede delegar | testimonio | proceso | ratificar |
| N-03 | ADR-007 | mensajería asíncrona para notificaciones | decisión | arquitectura | vigente |
```

**HOY**, este ledger vive fuera de opforja, y sus referencias pueden quedar en la
descripción del modelo, la cabecera del proto o la descripción de un requisito. Las
`AnclaNormativa` existentes son para procedencia **normativa**; no se deben abusar
como contenedor genérico de cualquier página o commit.

Una `AnclaFuente` genérica, dirigida a modelo/OPD/cosa/enlace y con
`uri + localizador + revisión/hash`, es una extensión **CORTO** (§8). Hasta que
exista, la trazabilidad documental general es disciplina externa declarada, no una
capacidad fingida de la mesa.

### 2.3 Ficha de iniciativa software

La ficha evita que el modelo crezca por inercia. Vive **HOY** en la descripción del
modelo o en la cabecera del proto:

```markdown
### Ficha de iniciativa software
- Pregunta que habilita: <decisión concreta>
- Dueño humano: <quién valida el dominio y decide la muerte del modelo>
- Beneficiario: <quién recibe valor>
- Sistema y frontera: <dentro / fuera>
- Base documental: <rutas/URLs + revisión o commit>
- Modelo: dominio | sistema software | entrega-operación
- Vida útil documental: decisión puntual | consulta recurrente
- Criterio de suficiencia: <qué debe mostrar para bastar>
- Criterio de muerte: <qué lo vuelve residuo>
```

**Decisión puntual** responde una pregunta y puede archivarse una vez tomada la
decisión —por ejemplo, elegir una arquitectura—. **Consulta recurrente** vive
mientras sostenga una tarea repetida —por ejemplo, un mapa de interfaces críticas—
y por eso necesita dueño y fecha de revisión.

### 2.4 Secuencia ágil de arranque

1. Inventariar solo las fuentes necesarias para la pregunta.
2. Extraer el ledger: hechos, decisiones, restricciones, hipótesis y términos.
3. Normalizar nombres; no inventar definiciones para llenar huecos.
4. Abrir un **apunte** y trazar el fragmento mejor entendido en el Taller.
5. Leer el OPL con el dueño de dominio; una oración extraña revela un hecho extraño.
6. Hacer emerger y reconciliar el SD; adoptar cada OPD suelto como in-zoom o
   unfold de una cosa existente. Un modelo no cierra con OPDs sueltos.
7. Graduar cuando la función, frontera y deuda estén suficientemente claras.
8. Conservar el ledger y la base documental; el modelo no los sustituye.

Esta secuencia aprovecha capacidades **HOY**: apuntes, Taller, adopción, OPL,
diagnóstico y graduación. No requiere una futura IA de ingestión para aportar valor.

### 2.5 Entrar por un sistema existente: ingeniería inversa / MBRSE

MBRSE es ingeniería inversa de sistemas basada en modelos. Cuando el sistema ya
existe, no se reconstruye primero un diseño ideal. Se itera:

`observaciones → requisitos inferidos → modelo AS-IS → brechas →`
`predicciones/pruebas → nuevas observaciones`

1. Congelar una revisión de código, contratos, configuración y evidencia operativa.
2. Observar función, contexto, estados, interfaces, ownership, fallos, restricciones
   y desempeño bajo variación; marcar qué es observado, documentado o inferido.
3. Registrar cada requisito inferido como hipótesis `[RATIFICAR]`; su dureza
   `hard|soft` depende de la obligación, no de que ya esté ratificado.
4. Modelar *middle-out*: empezar en el nivel mejor entendido y abstraer o refinar
   solo lo necesario para explicar o cambiar el sistema.
5. Dejar por vuelta al menos un saldo verificable: hecho OPM mejor situado, brecha
   explícita o predicción comprobable.
6. Conservar AS-IS —sistema observado— y TO-BE —diseño objetivo— como modelos
   separados, con estados de transición, compatibilidad y criterio de salida
   explícitos.
7. Pedir al dueño semántico autorizado que acepte la línea base AS-IS y declare qué
   pendientes `[RATIFICAR]` no pueden portar una decisión o implementación.

Cerrar cada vuelta preguntando: ¿qué requisito explica esta estructura?, ¿qué
estructura realiza este requisito?, ¿qué observación quedó sin explicación? y ¿qué
prueba puede falsar la hipótesis? Si todas las respuestas están vacías, el modelo
probablemente documenta formas sin aumentar comprensión.

**HOY**, opforja aporta apuntes, requisitos, OPDs/OPL, vistas y modelos separados.
El ledger, código, tests, configuración y telemetría siguen siendo evidencia externa.
La app no inspecciona repositorios, bases de datos ni tráfico para reconstruir el
sistema automáticamente.

**CORTO**, C1–C3 pueden mejorar referencias a fuentes, contexto de desarrollo y
evidencia externa. La ingestión o ingeniería inversa automática queda **FUERA**.

---

## 3. Dominio, ideas, necesidades y requisitos

### S1 · Modela la transformación del dominio, no las pantallas

**Pregunta.** ¿Qué cambia en el mundo cuando el producto funciona?

**La tentación.** Empezar con *Iniciar sesión*, *Mostrar formulario*, «dashboard» y
tablas, porque son fáciles de imaginar.

**El corte.** El primer SD describe el cambio de valor sin comprometer interfaz ni
stack. «Permitir reservar salas» todavía es débil. Dos hechos OPL atómicos declaran
el transformee, sus estados y el resultado sin mezclar predicados:

```opl
*Confirmación de reserva* cambia **Solicitud** de `pendiente` a `confirmada`.
*Confirmación de reserva* genera **Reserva**.
```

La UI aparecerá después como instrumento o interfaz de la realización elegida.

**Cómo se rompe.** La solución queda optimizada para el primer mockup, pero nadie
puede comparar otra arquitectura ni verificar qué resultado importaba.

### S2 · Objeto de dominio no es registro de base de datos

**Pregunta.** ¿La cosa existe para el dominio o solo para una implementación?

**La tentación.** Convertir cada tabla, DTO o clase en objeto OPM.

**El corte.** **Reserva**, **Sala** y **Intervalo** pueden existir como conceptos del
dominio. **Fila de reservas**, **ReservationDTO** o **índice B-tree** pertenecen a
una realización técnica si son relevantes para una decisión. Un objeto OPM no gana
valor por parecerse al código; lo gana por portar identidad, estado o relación
necesarios para explicar la función.

**Cómo se rompe.** El modelo se convierte en un diagrama de clases incompleto que
cambia con cada refactor y pierde la razón de negocio.

### S3 · Necesidad no es solución

**Pregunta.** ¿La frase permite más de una arquitectura legítima?

**La tentación.** «Necesitamos microservicios con Kafka» como propósito.

**El corte.** Separar la necesidad («notificar una reserva confirmada sin bloquear
la confirmación») de la decisión («usar mensajería asíncrona»). La primera fija
función y restricciones; la segunda es una alternativa de arquitectura que debe
preservar la misma firma de frontera.

**Cómo se rompe.** La tecnología se vuelve requisito por repetición y no puede
compararse contra una solución más simple.

### S4 · Dominio y sistema software son modelos hermanos

**Pregunta.** ¿Estoy diciendo qué ocurre o cómo el software lo realiza?

**La tentación.** Introducir **API**, **Base de datos** y **Worker** en el SD de
dominio, o esconder toda responsabilidad técnica detrás de «Sistema».

**El corte.** En el modelo de dominio, las cosas son **Solicitud**, **Reserva**,
**Sala**, **Persona solicitante** y sus procesos. En el modelo del sistema software,
**API de reservas**, **Almacén de reservas** y **Procesador de notificaciones** son
objetos no humanos que realizan esa función. Cuando habilitan un proceso sin
transformarse, se conectan mediante un enlace de **instrumento**; si un proceso los
crea, consume o cambia, ocupan el rol transformador correspondiente. Ambos modelos
se conectan mediante objetos-frontera que entienden.

Software, robots e IA nunca son agentes OPM
(`urn:fxsl:kb:reglas-opm-estrictas-es` R-AG-1/R-AG-1A). «Agente de desarrollo» es
un rol operativo de la ingeniería agéntica; dentro del modelo, su runtime sigue
siendo un objeto software. La persona que autoriza, revisa o responde sí puede ser
agente OPM.

### S5 · Requisitos visibles y navegables **HOY**

opforja ya ofrece requisitos estructurados:

1. `Ctrl+K` → **Crear requisito**, o seleccionar un objeto y **Marcar como
   requisito**.
2. Declarar ID lógico, descripción, dureza `hard|soft`, actor y estado de
   satisfacción.
3. Seleccionar una cosa o enlace y usar **Vincular requisito existente**.
4. Desde un requisito, abrir **Vista de requisito** para reunir en una vista de solo
   lectura el requisito y sus coberturas.

El requisito es un objeto OPM con metadata de autor; la relación de satisfacción es
meta (`pendiente | satisface | parcial | no-satisface`) y puede apuntar **HOY** a
una entidad o enlace del mismo modelo. La vista no crea hechos nuevos y la
satisfacción no es un enlace OPM nuclear ni el resultado de ejecutar un test.

La satisfacción se conserva en el modelo y en el JSON de intercambio. La proyección
JSON interna `canon-documento` también la retiene, pero el comando visible
**Exportar documento canónico (Markdown)** **HOY no la renderiza**. No uses ese
Markdown como matriz de cobertura; conserva la traza externa descrita en S6.

### S6 · Cobertura de modelo no es evidencia de test

**Pregunta.** ¿Qué significa que algo «satisface» un requisito?

**La tentación.** Marcar una cosa como `satisface` y dar el requisito por probado.

**El corte.** La cobertura en opforja afirma «esta parte del diseño realiza esta
intención». La evidencia ejecutable vive en un test, check de CI, informe o control
operacional. **HOY** la mesa no enlaza de forma tipada a esos artefactos externos ni
consulta su resultado.

Usar una tabla externa mínima hasta contar con trazas externas estructuradas:

```markdown
| Requisito | Metacobertura de diseño en opforja | Evidencia ejecutable | Veredicto |
|---|---|---|---|
| REQ-7 | Validación de disponibilidad | tests/reservas/concurrencia.test.ts | CI verde |
```

Extender `TargetSatisfaccionRequisito` con targets externos tipados
`test|código|ADR|pipeline|métrica` es **CORTO**, no una capacidad actual (§8).

### S7 · Cualidades no funcionales necesitan medida y escenario

**Pregunta.** ¿«rápido», «seguro» o «escalable» permite decidir algo?

**La tentación.** Colgar adjetivos del sistema o convertir cada calidad en estado
sin atributo.

**El corte.** Declarar un requisito y su actor en los campos estructurados **HOY**.
El escenario, medida, unidad, umbral y fuente viven por ahora en su descripción y en
el ledger externo. La metacobertura muestra qué entidad o enlace del diseño lo
realiza; no puede apuntar a un estado aislado. Ejemplo: `REQ-PERF-3`, hard, «p95 de
confirmación < 500 ms con 100 solicitudes/s», cubierto por *Confirmación de reserva*
o por su enlace de condición y verificado por un test de carga externo.

Para seguridad, modelar además activos, estados de autorización, procesos de
control, excepciones y responsabilidad humana. Una etiqueta «seguro» no es modelo
de amenazas ni reemplaza análisis especializado.

### S8 · Alternativas antes del compromiso

**Pregunta.** ¿Las opciones realizan la misma función o cambian el problema?

**La tentación.** Comparar «monolito vs microservicios» por popularidad.

**El corte.** Construir alternativas con la misma firma de frontera: entradas,
resultados, agentes/instrumentos y restricciones netas. Comparar después costo de
coordinación, fallos, latencia, despliegue y evolución. Una alternativa que exige
otra entrada o entrega otro resultado no es equivalente: cambió el contrato.

**HOY**, las alternativas pueden vivir como modelos separados, versiones o
realizaciones hermanas; el verificador de frontera ayuda en descomposiciones. No hay
diff estructural automático entre modelos.

---

## 4. Diseño y arquitectura de software

### S9 · Un contexto por responsabilidad, una interfaz por cruce

**Pregunta.** ¿Dónde termina la responsabilidad de este subsistema?

**La tentación.** Un OPD con todos los servicios y flechas de dependencia.

**El corte.** Cada subsistema declara función, datos propios y firma de frontera.
Los cruces se modelan mediante objetos informacionales — comando, consulta,
respuesta, evento, archivo — que un proceso genera y otro consume o requiere.

opforja **HOY** permite:

- **Componer con modelo** guardado, declarando entidades compartidas y previendo el
  delta antes de aplicar.
- Detectar referencias colgantes y advertir conflictos de recursos lineales.
- Conectar un **submodelo** a una cosa ancla y materializar su SD como vista de solo
  lectura con estado de sincronía.

La composición es explícita y reversible con deshacer; no es federación viva entre
repositorios ni sincronía automática entre equipos.

### S10 · API, mensaje y evento no son la misma cosa

**Pregunta.** ¿Qué cruza realmente la frontera?

**La tentación.** Una flecha «llama API» que mezcla canal, operación, payload y
resultado.

**El corte.** Separar cuando la decisión lo exige:

- **API de reservas** — objeto software/instrumento que habilita interacción;
- **Solicitud de confirmación** — objeto informacional de entrada;
- *Confirmación de reserva* — proceso;
- **Reserva confirmada** — resultado o estado del objeto de dominio;
- **Evento de reserva confirmada** — objeto informacional generado para otro
  proceso, si su existencia y entrega importan.

Si el mensaje nace y muere sin que nadie necesite observarlo, la invocación puede
ser una abstracción mejor. No reificar cada paquete de red.

### S11 · Dueño del dato y fuente única

**Pregunta.** ¿Quién puede cambiar este objeto y quién solo lo observa?

**La tentación.** Compartir una base de datos y llamar «integración» a la ausencia
de frontera.

**El corte.** El modelo debe mostrar el proceso que transforma el dato, los procesos
que solo lo requieren, y el objeto-frontera que cruza. Duplicar la misma entidad al
componer modelos oculta ownership; declarar una entidad compartida conserva una
identidad de interfaz.

Para datos replicados, distinguir **dato autorizado** y **réplica**, con sus estados
de sincronía si el desfase afecta decisiones. opforja no ejecuta reconciliación ni
CDC; hace visible el contrato que esas tecnologías deben realizar.

### S12 · Fallos, tiempo e idempotencia son comportamiento

**Pregunta.** ¿Qué ocurre cuando una dependencia demora, duplica o falla?

**La tentación.** Modelar solo el happy path y delegar «manejo de errores» al código.

**El corte.** Usar estados, condiciones, eventos y excepciones para responder
preguntas concretas:

- ¿qué objeto queda `pendiente`, `confirmado`, `fallido` o `compensado`?;
- ¿qué sobretiempo inicia recuperación?;
- ¿qué clave o estado evita aplicar dos veces el mismo efecto?;
- ¿qué proceso reintenta, compensa o eleva a un humano?;
- ¿qué señal vuelve observable el fallo?

La simulación **HOY** es conceptual: recorre microfases, precondiciones y ramas. No
calcula confiabilidad, throughput ni colas. Es útil para falsar el comportamiento
con expertos antes de implementar; los números se verifican fuera.

### S13 · Las Vistas navegan; las Piezas reutilizan

Una **Vista genérica** reúne apariciones existentes para responder una pregunta de
lectura; su OPL es delta-cero. Úsala para «interfaces de Reserva» o «superficie de
fallos», no para afirmar relaciones que el modelo nuclear no contiene.

La superficie **Piezas** reúne hoy dos mecanismos distintos:

- Desde **Este modelo**, un estereotipo con plantilla puede **Calcar** e injertar
  un subgrafo independiente con identidades frescas.
- Desde una **biblioteca externa**, el MVP expone una entidad —objeto o proceso—
  y sus estados. **Calcar** copia esa entidad; **Anclar** hace la copia y conserva
  una referencia viva a la Pieza, vigilada por el Centinela de Drift.

El Anclaje es metadata y no emite OPL nuclear, pero las cosas, estados y enlaces
calcados sí forman parte del modelo. Patrones-subgrafo y enlaces como Pieza externa
todavía no están implementados. El Centinela vigila la relación modelo↔biblioteca,
no código, schema ni API externa.

---

## 5. Desarrollo con agentes

### 5.1 El contrato de implementación

Un agente de código no necesita todo el modelo: necesita una **rebanada decidible**.
Antes de delegar, emitir un contrato breve en el issue, task o documento de trabajo:

```markdown
### Contrato de implementación
- Objetivo verificable: <cambio observable>
- Modelo: <id/nombre · revisión · protoHash si existe>
- Repo/base: <repositorio · commit SHA; rama solo como etiqueta informativa>
- Contexto OPM: <OPDs y OPL relevantes>
- Requisitos: <IDs + estado de cobertura>
- Decisiones ya tomadas: <ADRs / restricciones>
- Archivos o módulos probables: <alcance inicial, no mandato ciego>
- Coordinación: <ejecutor · outputs exclusivos · interfaces compartidas · orden/integrador>
- Pruebas de aceptación: <casos y comando de gate>
- Fuera de alcance: <no hacer>
- Gate humano: <qué decisión no puede tomar el agente y quién confirma el OPL/delta>
```

**HOY**, desde el directorio `app/`, `bun run mesa pull <modelo>` entrega el
contexto W6.0 —procedencia, pendientes `[RATIFICAR]`, notas, diagnóstico y OPL—.
En este manual, `mesa pull` y `mesa push` se usan después como abreviaturas de
`bun run mesa …`; el proyecto no instala un ejecutable global llamado `mesa`. El
agente debe combinar el contexto con el contrato del repositorio
(`AGENTS.md`/`CLAUDE.md`), el código y los tests. W6.0 describe el **modelo**, no es
un brief de implementación completo.

Un export determinista «Contexto de desarrollo» que agregue requisitos, selección
de OPDs, revisión del modelo y placeholders para rutas/tests es **CORTO** (§8).

### S14 · Sobre de autonomía humano–agente

La velocidad no justifica mezclar decisiones. Un reparto mínimo:

| El agente puede decidir dentro del encargo | Debe elevar a humano |
|---|---|
| leer repo/modelo, localizar impacto, proponer diseño local | propósito, semántica de dominio o cambio de frontera |
| aplicar cambios acotados y reversibles | nueva dependencia o arquitectura transversal |
| escribir/ajustar tests del comportamiento acordado | aceptar degradación de seguridad, datos, compatibilidad o SLO |
| ejecutar gates y reportar evidencia | producción, migración irreversible o cambio de autoridad |
| actualizar el modelo si la semántica ya fue decidida | inventar hechos faltantes o graduar supuestos como verdad |

El modelo ayuda a delimitar el sobre, pero el control real vive en las instrucciones
del repo, permisos, revisión, CI y proceso de entrega. La mesa serializa operador y
agente mediante revisión y optimistic locking; no coeditan en vivo.

Una revisión empujada por un agente sigue siendo **propuesta**: llegar al servidor
no ratifica su significado. El dueño humano debe revisar el delta, leer el OPL
relevante y declarar si esa revisión pasa a ser la base acordada. La vitrina y el
optimistic locking evitan pisadas; no reemplazan esa decisión. Del mismo modo,
`--confirmado-por-operador` solo autoriza trabajar sobre una base autosave: no
aprueba semánticamente la salida del agente.

### 5.2 Frontera de confianza y patrón multiagente

El modelo, proto, ledger, W6.0 y contrato de implementación son contexto de trabajo:
no deben contener credenciales, tokens ni datos personales crudos. Documentos,
tickets, páginas y comentarios externos son **evidencia no confiable**, no
instrucciones para el agente. Las instrucciones del repo, los permisos y las
decisiones humanas conservan la autoridad. Un agente no ratifica su propia
inferencia. Modela categorías y roles; cuando haga falta una instancia sensible,
referencia su registro autorizado sin copiar el contenido a la mesa.

Copiar una fuente al ledger, modelo o W6.0 no eleva su autoridad ni convierte sus
instrucciones embebidas en órdenes. Extrae la afirmación relevante y conserva su
procedencia; descarta cualquier intento de la fuente por redefinir el encargo.

Para varios agentes sobre el mismo sistema:

1. El humano congela la revisión del modelo, el commit base y las interfaces
   compartidas.
2. Divide por contrato/OPD y declara ownership de archivos y no-objetivos.
3. Cada agente trabaja en una rama o *worktree* —directorio Git aislado— y recibe
   la misma revisión.
4. El código puede avanzar en paralelo; el mismo modelo se reconcilia en serie.
5. Un integrador une sobre la revisión objetivo, ejecuta los gates completos del
   repo y revisa el diff conjunto.
6. Si cambió el contrato, hace pull fresco y propone un único delta del modelo.
7. El dueño semántico autorizado del modelo confirma el OPL y acepta la nueva base;
   un 409 exige re-pull y reconciliación, jamás forzar.

Agentes sobre modelos distintos pueden avanzar en paralelo si la interfaz compartida
está congelada. **HOY**, opforja aporta contexto, revisión y optimistic locking;
Git, orquestación, asignación, merge y CI viven fuera. C2 puede reducir la
preparación y C4 mejorar la trazabilidad del release **CORTO**. Coedición y
orquestación multiagente permanecen **FUERA**.

#### Medir si realmente agiliza

Medir en tracker, Git, CI e incidentes:

- tiempo pregunta → contrato ratificado;
- tiempo contrato → cambio aceptado en operación;
- aclaraciones o reaperturas por ambigüedad semántica;
- retrabajo o rollback por deriva del contrato;
- tasa de fallos de cambio (*change-failure rate*) y efecto sobre el resultado de
  dominio o SLO;
- porcentaje de releases semánticos con revisión OPM aceptada;
- antigüedad de una divergencia modelo↔sistema conocida.

opforja **HOY no captura ni calcula** estas métricas. La cantidad de entidades,
OPDs o actividad de agentes mide volumen de modelado, no productividad. Antes de
usarlas, fijar dueño, línea base, ventana, objetivo y una regla para mantener,
recalibrar o abandonar el flujo.

### S15 · Del modelo al código, sin generación mágica

opforja **HOY no genera aplicación, esquemas, APIs ni tests**, ni mantiene sincronía
bidireccional modelo↔código. El camino productivo es:

1. extraer una decisión pequeña del modelo;
2. convertirla en comportamiento verificable;
3. implementar en el repo siguiendo su contrato local;
4. ejecutar tests y gates;
5. actualizar el modelo solo si cambió el contrato semántico, no por cada refactor;
6. crear una versión del modelo en un hito relevante.

**Definition of Ready para código:** función y frontera claras; requisito nombrado;
estados/fallos relevantes; deuda `[RATIFICAR]` no portante; criterio de aceptación;
dueño humano.

**Definition of Done:** código y tests verdes; evidencia enlazada externamente;
documentación/ADR si cambió arquitectura; modelo y OPL actualizados **y confirmados
por su dueño humano** si cambió comportamiento; versión de opforja correlacionada
con el hito cuando corresponda.

El modelo no se actualiza por renombrar una función interna que no altera el dominio.
Sí se actualiza si cambia ownership, interfaz, estado observable, condición, fallo o
resultado.

### 5.3 Loop técnico del agente modelador

Para cambios del propio modelo, la pista agente de `manual-opforja.md` sigue vigente:

`bun run mesa pull → re-elicitar/editar proto → compilar → validar →`
`render headless → bun run mesa push`

Reglas duras: pull fresco; proto como fuente para modelos sellados; validación local
verde; 409 implica re-pull, jamás forzar; push sin delta es no-op; nota significativa.
El chip de revisión deja la llegada visible al operador; no ratifica su significado.

---

## 6. Despliegue y entrega continua

### S16 · Modela el pipeline; ejecútalo fuera

OPM puede hacer legible el sistema de entrega:

```opl
*Construcción de artefacto* requiere **Código fuente**.
*Construcción de artefacto* requiere **Configuración**.
*Construcción de artefacto* genera **Artefacto desplegable** en `candidato`.
*Verificación de artefacto* cambia **Artefacto desplegable** de `candidato` a `verificado`.
*Rechazo de artefacto* cambia **Artefacto desplegable** de `candidato` a `rechazado`.
*Despliegue* requiere **Ambiente**.
*Despliegue* cambia **Release** de `aprobada` a `desplegada`.
**Señal de salud** puede estar `saludable` o `degradada`.
**Señal de salud** en `degradada` inicia *Rollback*.
*Rollback* cambia **Release** de `desplegada` a `retirada`.
```

Cada oración expresa un hecho. **Código fuente**, **Configuración** y **Ambiente**
ocupan el rol de instrumento porque habilitan sin transformarse. **Responsable de
release** es agente humano cuando existe aprobación humana; CI/CD, registro de
artefactos y orquestador son objetos software y se conectan como instrumentos solo
en los procesos que efectivamente habilitan.

Este modelo sirve para exponer compuertas, artefactos, responsabilidades y caminos de
recuperación. opforja **no ejecuta el pipeline, no firma imágenes, no consulta CI y
no despliega**. Los manifiestos y el historial del pipeline conservan la verdad
operativa.

### 6.1 Gate de release sugerido

Según el riesgo del cambio, el responsable de release debe poder responder:

| Gate | Decisión mínima | Evidencia propietaria |
|---|---|---|
| Semántica | requisitos afectados y OPL aceptado por su dueño | modelo + tracker |
| Compatibilidad y datos | consumidores, migración y ventana de compatibilidad resueltos | ADR, contratos y plan de migración |
| Calidad y seguridad | pruebas y controles aplicables aprobados | CI, escáneres y revisión |
| Integridad y procedencia | versión del modelo, commit, build y artefacto identificables e inmutables | documento de release, Git, registro de artefactos, procedencia y SBOM —inventario de componentes— |
| Rollout | estrategia, ambiente y umbrales de promoción/aborto definidos | pipeline |
| Recuperación | rollback o roll-forward probado y con responsable | pipeline + runbook |
| Operación | SLO/señales, alertas y dueño operacional preparados | observabilidad |
| Privacidad y secretos | datos y credenciales tratados por sistemas autorizados | gestor de secretos + políticas |

No todas las filas aplican a cada entrega: el responsable declara aplicabilidad y
evidencia según el riesgo. Para cada fila registra fuera de opforja
`PASS | N/A | WAIVER` —excepción aprobada—, aprobador, evidencia y riesgo residual.
Cualquier otro estado bloquea el release.

La autoridad corresponde al gate: dueño semántico del modelo, arquitectura/datos,
seguridad, release u operaciones según el caso; no a un «dueño de dominio» genérico.
opforja **HOY** modela estados, compuertas, responsables y caminos de recuperación,
pero no certifica que un gate haya pasado.

**HOY**, el botón **Crear version ahora** crea `Snapshot <fecha>` con la descripción
fija `Versión manual`; la UI no permite ponerle un nombre de hito ni marcarla para
preservación. Registra de forma autoritativa fecha/ID, rótulo semántico, commit,
build y deploy en el documento de release, Git o registro de artefactos. La
descripción mutable del modelo puede repetir el rótulo como ayuda, no como evidencia
de integridad. Las versiones creadas por `mesa push` sí reciben `agente·<nota>`.

C3 puede tipar evidencias y C4 correlacionar modelo, commit, build y deploy
**CORTO**. Tests, firma, escaneo, secretos, despliegue y rollback son **FUERA**.

Después del deploy, observar señales y SLO durante la ventana acordada y decidir
**promover, abortar o recuperar**. El release no cierra solo porque el pipeline
terminó: cierra cuando el responsable acepta el resultado en operación o ejecuta la
recuperación.

---

## 7. Operación, mantenimiento y evolución

### S17 · Telemetría prueba o refuta; no se transforma sola en modelo

**Pregunta.** ¿Qué observación de runtime cambia una decisión del sistema?

**La tentación.** Copiar dashboards al OPD o esperar que el modelo se mantenga desde
logs.

**El corte.** Logs, métricas y trazas son evidencia externa. Un incidente puede
nacer como apunte con:

- estado observado y estado esperado;
- proceso que falló o se demoró;
- objeto afectado;
- hipótesis explícitas `[RATIFICAR]`;
- camino de recuperación;
- cambio propuesto y criterio de falsación.

El agente puede comparar esa evidencia con OPL y localizar contradicciones, pero la
app **HOY no ingiere telemetría ni ejecuta inferencia causal**.

El apunte del incidente conserva una instantánea operativa declarada y la
investigación, pero no modifica por sí solo el contrato base. Solo un patrón causal
ratificado después de resolver el incidente entra al modelo conceptual, mediante una
decisión humana explícita.

### S18 · Drift, versiones y mantenimiento del contrato

opforja **HOY** crea versiones manuales con nombre automático, restaura una versión
como copia y agrupa las revisiones de una sesión de agente. Úsalas en hitos
semánticos, no como sustituto de Git. Para versiones manuales, usa la fecha/ID como
clave de correlación y conserva fuera de la UI rótulos como:

- `dominio-validado`;
- `arquitectura-seleccionada`;
- `release-1.4-contrato`;
- `incidente-2026-07-14-corregido`.

No existe diff estructural de versiones. Comparar capturas no demuestra equivalencia;
el JSON, OPL, requerimientos y firma de frontera son la evidencia disponible. El
golden-harness verifica reproducibilidad de una emisión, no diferencia semántica
entre dos diseños.

El Centinela de Drift cubre Piezas ancladas a bibliotecas, **no código ni runtime**.
No presentar su chip como prueba de que la implementación sigue al modelo.

### 7.1 Cuándo actualizar, bifurcar o matar

| Situación | Acción |
|---|---|
| Refactor interno sin cambio observable | no tocar el modelo |
| Cambio de estado, regla, interfaz, ownership o fallo observable | actualizar modelo y OPL |
| Alternativa todavía en evaluación | bifurcar modelo/realización; no sobrescribir la base acordada |
| Migración AS-IS → TO-BE | modelos separados con interfaz y estados de transición explícitos |
| Pregunta respondida y sin uso recurrente | archivar el modelo de decisión puntual |
| Modelo de consulta recurrente sin dueño, revisión ni consumo | candidato a retiro |

Mantención no es mantener cada rectángulo alineado con una clase. Es conservar la
verdad del contrato que aún se usa para decidir.

### 7.2 Mantener, modernizar y retirar un sistema existente

Una actualización de dependencia o refactor que no cambia conducta observable no
obliga a editar el modelo. Sí lo hacen cambios de interfaz, ownership, estado,
compatibilidad, seguridad, disponibilidad, fallo o recuperación **cuando alteran el
contrato o una decisión representada**. Parchear una vulnerabilidad CVE sin ese
cambio exige evidencia de seguridad, no dibujar una diferencia inexistente.

Para modernizar, mantener AS-IS y TO-BE separados y modelar explícitamente:
consumidores, estados de transición, migración de datos, convivencia de versiones,
rollback y criterio de término. No sobrescribir el AS-IS con el diseño deseado:
borra precisamente la brecha que la modernización debe cerrar.

Retirar el modelo no retira el sistema, y retirar el sistema no implica borrar el
modelo: este puede quedar como evidencia histórica. Antes del retiro definitivo
(*decommission*) verificar:

- autorización humana `go/no-go`, responsable y fecha efectiva;
- corte gradual, umbral de aborto y recuperación/restauración probada;
- consumidores migrados o terminados;
- datos migrados, retenidos o eliminados bajo su política;
- APIs, eventos, jobs y dependencias cerrados;
- credenciales revocadas e infraestructura retirada;
- alertas, runbooks y soporte actualizados;
- ventana de recuperación cerrada y evidencia archivada.

**HOY**, opforja puede expresar el proceso, los estados y responsables, mantener
AS-IS/TO-BE y conservar el modelo histórico. Inventario automático, análisis de
dependencias o vulnerabilidades, migración, revocación y desmantelamiento son
**FUERA**.
C1 puede anclar el registro externo de retiro y C3 enlazar evidencia de sus
requisitos **CORTO**. C4 permanece acotado al release; no certifica el retiro.

---

## 8. Frontera de capacidad y extensiones de corto plazo

### 8.1 Matriz del ciclo de vida

| Etapa | opforja **HOY** | **CORTO** propuesto | **FUERA** / sistema propietario |
|---|---|---|---|
| Base documental | descripción/proto, anclas normativas, `[RATIFICAR]`, notas | ancla de fuente genérica con URI/localizador/hash | ingestión, OCR, búsqueda y gestión documental |
| Descubrimiento | apunte, Taller, OPL, validación, vistas | `AnclaFuente` + Contexto de desarrollo que referencia el ledger, sin importar hechos automáticamente | entrevistas y decisión de dominio |
| Requisitos | objeto requisito, hard/soft, actor, satisfacción, cobertura a cosa/enlace, vista | targets externos tipados + export de cobertura | backlog, aceptación y evidencia CI |
| Arquitectura | refinamiento, composición, submodelos, Piezas, interfaces, simulación conceptual | `AnclaFuente` a repo/ADR | diseño especializado, benchmarks, threat modeling completo |
| Desarrollo | `bun run mesa pull/push` desde `app/`, proto, bundle, render, golden; revisión del mismo modelo serializada | export determinista de Contexto de desarrollo | edición/generación de código, ramas/worktrees, PRs, merge y code review |
| Verificación | reglas OPM, roundtrip, firma de frontera, reproducibilidad | targets externos de requisito + validación CI del manifiesto | tests funcionales, carga, seguridad, CI |
| Despliegue | modelar pipeline y fallos | manifiesto modelo↔commit↔build↔deploy | ejecución CI/CD, SBOM/procedencia, firma, escáneres, secretos e infraestructura |
| Operación | modelar señales, incidentes e hipótesis | `AnclaFuente` a incidente/dashboard + target externo `métrica`, sin importar ni firmar telemetría | logs, métricas, trazas, alertas |
| Evolución | versiones manuales, restaurar copia, drift de Piezas, AS-IS/TO-BE y estados de transición | `AnclaFuente` + targets externos | diff código↔modelo, inventario, migraciones, desmantelamiento y sincronía automática |

### 8.2 Cuatro incrementos pequeños y coherentes

Estas extensiones son implementables sin convertir opforja en ALM, tracker o
plataforma DevOps. Son propuestas de este manual; requieren priorización antes de
entrar al roadmap.

#### C1 · `AnclaFuente` genérica

Extensión meta aditiva, hermana de `AnclaNormativa`, con target
`modelo|opd|entidad|enlace`, `uri`, `localizador`, `revision/hash`, estado y nota.
No emite OPL nuclear ni altera validación OPM. Criterio de cierre: roundtrip JSON,
Inspector read-only, documento canónico y contexto W6.0.

#### C2 · Contexto de desarrollo determinista

Export derivado que reúne ficha, selección de OPDs/OPL, requisitos y coberturas,
diagnóstico, procedencia y huecos explícitos para alcance de código/tests. Reutiliza
el generador W6.0; no inventa un segundo modelo. Criterio: misma entrada produce
bytes iguales y todo dato vuelve a su fuente.

#### C3 · Targets externos de satisfacción

Ampliar la cobertura de requisito con referencia tipada a `test`, `código`, `ADR`,
`pipeline` o `métrica`, usando URI + revisión. Es traza, no veredicto: la app no
ejecuta ni declara verde el target. Criterio: referencia íntegra, no colgante dentro
del documento exportado, y UI que distingue cobertura de diseño de evidencia.

#### C4 · Manifiesto de release

Documento pequeño y verificable para correlacionar un release:

```json
{
  "schemaVersion": 1,
  "modeloId": "…",
  "modeloRevision": 12,
  "protoHash": "…",
  "repo": "…",
  "commit": "…",
  "build": "…",
  "deploy": "…"
}
```

El pipeline puede validar presencia/formato y adjuntarlo al release. opforja no
consulta ni modifica Git o producción. Criterio: generación explícita, esquema
versionado, sin credenciales y verificación reproducible.

### 8.3 Lo que no conviene prometer a corto plazo

- generación completa de código desde OPM;
- roundtrip automático código↔modelo;
- diff semántico confiable de modelos arbitrarios;
- edición multiusuario concurrente;
- federación de modelos entre organizaciones;
- despliegue o rollback desde la mesa;
- observabilidad integrada o inferencia causal automática;
- cálculo de rendimiento, colas, seguridad o costo;
- reemplazo del tracker, ADRs, Git, CI/CD o plataforma de observabilidad.

Cada punto abre un producto distinto o una investigación. Añadirlo por entusiasmo
debilitaría la función que opforja ya cumple bien: modelar y validar significado.

---

## 9. Ejemplo end-to-end — Lumbre, reservas de salas

Ejemplo ficticio y deliberadamente pequeño. Su propósito es mostrar relevos entre
artefactos, no proponer una arquitectura universal.

### 9.1 Base documental

- `<repo-lumbre>/docs/dominio-reservas.md`: una sala no admite reservas solapadas.
- entrevista con Operaciones, 2026-07-14: algunas salas requieren aprobación.
- ADR candidata: notificación asíncrona para no bloquear confirmación.
- borrador de SLO sin fuente de carga: p95 < 500 ms `[RATIFICAR]`.

El ledger separa el hecho de no solapamiento, la regla de aprobación, la decisión
arquitectónica todavía candidata y el umbral no ratificado.

### 9.2 Modelo de dominio

**Pregunta:** ¿qué debe ocurrir para que una persona obtenga una reserva válida sin
doble asignación?

La fuente reproducible es
[`docs/ejemplos/lumbre-reservas.opl`](ejemplos/lumbre-reservas.opl). Sus 32
oraciones se parsean y reimportan sin pérdida mediante una ley automatizada. El
núcleo del modelo declara:

- **Solicitud** en `pendiente | confirmada | rechazada`, asociada a una **Ventana
  solicitada** que exhibe **Sala** e **Intervalo**;
- *Validación de disponibilidad* requiere la ventana y afecta **Disponibilidad**;
- *Aprobación de reserva* y *Exención de aprobación* cambian **Permiso** de
  `pendiente` a `habilitado` bajo condiciones mutuamente excluyentes de **Sala**;
- *Confirmación de reserva* cambia **Solicitud** de `pendiente` a `confirmada` y
  genera **Reserva** solo con disponibilidad y permiso habilitado;
- *Rechazo por conflicto* cambia **Solicitud** a `rechazada` cuando la
  disponibilidad es `no disponible`.

El dominio todavía no dice REST, SQL ni colas.

### 9.3 Requisitos

- `REQ-1` hard: no confirmar dos reservas solapadas para la misma sala e intervalo.
  Metacobertura: *Validación de disponibilidad*, su enlace de instrumento desde
  **Ventana solicitada**, el enlace condicional de **Disponibilidad** a
  *Confirmación de reserva* y *Rechazo por conflicto*. Evidencia externa: test de
  concurrencia.
- `REQ-2` hard: una sala restringida requiere aprobación humana. Metacobertura:
  *Aprobación de reserva*, enlace agente de **Persona aprobadora**, condición de
  **Sala** `restringida` y condición de **Permiso** `habilitado` sobre la
  confirmación.
- `REQ-3` soft: p95 < 500 ms. La dureza expresa su obligatoriedad relativa; la
  fuente y el umbral siguen `[RATIFICAR]`. Cobertura: *Confirmación de reserva*;
  evidencia futura: test de carga.

`hard|soft`, el estado de satisfacción y `[RATIFICAR]` son ejes independientes:
obligatoriedad, cobertura y autoridad/evidencia, respectivamente. Ratificar una
fuente no convierte automáticamente un requisito soft en hard. Antes de la
validación humana, las coberturas permanecen `pendiente` o `parcial`.

La Vista de requisito muestra diseño cubierto; CI dirá si la implementación pasa.

### 9.4 Alternativas de arquitectura

Dos modelos preservan la misma entrada (**Solicitud**), resultado (**Reserva**) y
regla de aprobación:

- A: aplicación modular + base transaccional + notificación en background.
- B: servicio de reservas + evento **Reserva confirmada** + procesador separado.

La alternativa B agrega coordinación, entrega al menos una vez e idempotencia. Si
esas propiedades no reducen un riesgo real, A es más simple. opforja hace visible la
diferencia; no decide por moda.

### 9.5 Contrato para el agente de desarrollo

```markdown
- Objetivo: impedir confirmaciones solapadas bajo concurrencia.
- Modelo: Lumbre arquitectura A, revisión 4; REQ-1.
- Comportamiento: una sola transición pendiente→confirmada puede ganar por sala+intervalo.
- Fallo esperado: la segunda solicitud queda rechazada por conflicto, sin Reserva.
- Alcance: módulo reservas + prueba de concurrencia; sin cambiar notificaciones.
- Gate: tests unitarios/integración + check del repo.
- Elevar: cualquier cambio de schema público o semántica de aprobación.
```

El agente inspecciona el repo, implementa y prueba. No deriva un schema desde el OPD
ni modifica la frontera por conveniencia.

### 9.6 Release y operación

El modelo de entrega declara artefacto, verificación, despliegue, healthcheck y
rollback. El pipeline real ejecuta. Después del release, una métrica de conflictos y
un incidente de doble reserva son evidencia externa.

Si aparece una doble reserva, se abre un apunte del incidente: estado observado,
hipótesis de carrera, proceso afectado, señal y recuperación. Si la causa exige nueva
regla de idempotencia, se actualizan dominio/arquitectura, REQ-1, test y modelo. Si fue
solo un bug local que ya violaba el contrato, se corrige código/tests sin reescribir
el dominio. El apunte es una instantánea operacional declarada; una hipótesis no
entra al canon conceptual hasta que la evidencia y el dueño la ratifican.

### 9.7 Modernización y retiro

Si Lumbre migra de la alternativa A a B, A queda como AS-IS y B como TO-BE. Un
modelo de transición hace visibles consumidores, coexistencia, migración de datos,
compatibilidad, rollback y el criterio que permite apagar A. Código, tráfico y
migración siguen en sus sistemas propietarios.

Si el producto se retira, una persona autorizada decide el `go/no-go`; el equipo
cierra consumidores y datos bajo su política, revoca accesos, desmonta operación y
prueba recuperación antes del corte final. El modelo de Lumbre puede archivarse
después como evidencia histórica: opforja documenta el significado y la transición,
no ejecuta el retiro.

---

## 10. Runbooks mínimos

### A. Empezar una iniciativa

1. Escribir ficha y pregunta.
2. Congelar una revisión de la base documental.
3. Crear ledger de evidencia.
4. Abrir apunte; bosquejar el fragmento más claro.
5. Confirmar OPL con dueño de dominio.
6. Adoptar/reconciliar, declarar frontera y requisitos.
7. Graduar solo cuando el modelo sirva a la decisión.

### B. Delegar un cambio a un agente

1. Hacer pull fresco del modelo/contexto, leer el contrato del repo y fijar el
   commit base.
2. Congelar revisión del modelo e interfaces; seleccionar OPDs y requisitos.
3. Emitir uno o más contratos con ownership, no-objetivos y gate humano.
4. Implementar en ramas/worktrees separados y ejecutar tests.
5. El integrador une sobre la base acordada, ejecuta los gates completos del repo y
   revisa el diff conjunto.
6. Si cambió el contrato, hacer pull fresco y empujar un único delta del modelo como
   propuesta.
7. El dueño semántico autorizado revisa el delta/OPL y declara la base acordada.
8. Commit/push/PR según el flujo del repo; correlacionar una versión del modelo si
   es un hito semántico.

### C. Preparar un release

1. Clasificar el riesgo y declarar qué filas del gate §6.1 aplican.
2. Confirmar requisitos, OPL, ADRs, interfaces y compatibilidad de datos.
3. Verificar calidad, seguridad, integridad y tratamiento de secretos en sus
   sistemas propietarios.
4. Preparar rollout, señales operativas y recuperación con responsables.
5. Registrar el commit; si es un hito semántico, crear la versión manual y anotar
   su fecha/ID.
6. Ejecutar el pipeline fuera de opforja.
7. Registrar build, artefacto, deploy y evidencias; observar la ventana acordada y
   decidir: promover, abortar o recuperar.

### D. Responder a incidente o evolución

1. Activar el mando operacional, contener o recuperar y preservar evidencia; la
   seguridad del sistema precede a documentar.
2. Ya estabilizado, crear apunte con observado, esperado e hipótesis `[RATIFICAR]`.
3. Comparar contra evidencia, modelo y tests sin declarar causa prematura.
4. Decidir si falló implementación o cambió el contrato.
5. Corregir el artefacto propietario y cerrar el loop.
6. Versionar o archivar el modelo según su criterio de muerte.

### E. Modernizar o retirar un sistema

1. Congelar evidencia y modelos AS-IS; definir dueño y resultado TO-BE.
2. Inventariar consumidores, datos, interfaces, jobs, credenciales y operación en
   sus sistemas propietarios.
3. Modelar transición, convivencia, migración, rollback y criterio de término.
4. Obtener `go/no-go` humano con retención de datos, corte gradual, umbral de aborto
   y restauración probada.
5. Ejecutar fuera de opforja por etapas y correlacionar evidencia externa.
6. Verificar consumidores, datos, accesos, infraestructura, alertas y soporte.
7. Obtener aceptación final, cerrar la ventana de recuperación y archivar o retirar
   el modelo según la política de retención y su criterio de muerte.

---

## Apéndice A — Mapa rápido de artefactos

| Decisión | Mejor hogar | Señal de abuso |
|---|---|---|
| propósito, función, estados, frontera | modelo OPM/OPL | solo existe en una épica o slide |
| evidencia y fuente | documento/ledger; ancla normativa cuando aplica | se convirtió una cita en cosa OPM |
| requisito y cobertura de diseño | tracker + requisito opforja | `satisface` se usa como «test pasó» |
| alternativa arquitectónica | modelo + ADR | el modelo guarda la decisión sin el porqué |
| detalle de código | repo | se modela cada clase o función |
| aceptación ejecutable | tests/CI | el OPD pretende ser evidencia runtime |
| release y deploy | pipeline/manifiestos | se registra manualmente como estado verdadero en la mesa |
| observación operativa | telemetría/incidente | dashboard copiado al modelo |

## Apéndice B — Autoridades y capacidades citadas

- Método y validez: `urn:fxsl:kb:metodologia-forja-opm-es` y
  `urn:fxsl:kb:reglas-opm-estrictas-es`.
- Realización visual/textual: `urn:fxsl:kb:spec-forja-opd-es` y
  `urn:fxsl:kb:spec-forja-opl-es`.
- Operación agente↔mesa: `urn:kora:artefacto:modelamiento-opm`.
- Requisitos: `app/src/modelo/requisitos.ts`,
  `app/src/modelo/tipos/extensiones.ts`, `app/src/ui/DialogoRequisito.tsx`.
- Composición/submodelos: `app/src/modelo/composicion/`,
  `app/src/modelo/submodelos.ts`, `app/src/ui/DialogoComposicion.tsx`.
- Versiones: `app/src/persistencia/versiones.ts`, `app/src/ui/DialogoVersiones.tsx`.
- Procedencia/compilación: `app/src/autoria/`, `docs/render-headless.md`,
  `docs/verify-reproducible.md`.
- Estado y límites vigentes: `docs/handoff-2026-07-12.md`,
  `docs/roadmap/roadmap-2026-07-12.md`,
  `docs/roadmap/registro-conformidad-ssot.md`.

---

## Bitácora

- **2026-07-14** — Ciclo productivo completado con ingeniería inversa/MBRSE,
  frontera de confianza y patrón multiagente, métricas de agilidad, gate de release
  por riesgo y modernización/retiro, sin ampliar la frontera de C1–C4.
- **2026-07-14** — Corrección factual y semántica. Oraciones OPL atómicas,
  autoridad humana tras `mesa push`, límites reales de Piezas/export/versiones y
  matriz `CORTO` alineada exclusivamente con C1–C4.
- **2026-07-14** — Creación. Manual de dominio de software desde base documental
  hasta mantención, con cadena de autoridad por artefacto, piezas de decisión,
  workflow humano–agente, ejemplo Lumbre, matriz `HOY/CORTO/FUERA` y cuatro
  extensiones cortas que no convierten opforja en ALM ni plataforma DevOps.
