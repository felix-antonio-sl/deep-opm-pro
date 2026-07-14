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
| «La idea ya viene disfrazada de solución» | S3 |
| «No sé si modelar el dominio o la arquitectura» | §1 · S4 |
| «Quiero capturar requisitos y cobertura» | S5 · S6 · S7 |
| «Necesito comparar alternativas de arquitectura» | S8 |
| «Tengo servicios, APIs, eventos y bases de datos» | S9 · S10 · S11 |
| «La confiabilidad, seguridad o rendimiento quedaron como adjetivos» | S7 · S12 |
| «Quiero delegar implementación a un agente» | §5 · S13 · S14 |
| «¿OpForja genera código o mantiene sincronía con el repo?» | S15 · §9 |
| «Necesito modelar CI/CD y despliegue» | §6 · S16 |
| «Hubo un incidente y el modelo quedó viejo» | §7 · S17 · S18 |
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
| Intención y comportamiento | modelo OPM + OPL confirmado por el dueño de dominio | **mesa principal** para función, frontera, estados, enlaces y refinamiento |
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
- Especie: respuesta | instrumento
- Criterio de suficiencia: <qué debe mostrar para bastar>
- Criterio de muerte: <qué lo vuelve residuo>
```

**Respuesta** es un modelo que muere al decidir algo — por ejemplo, elegir una
arquitectura. **Instrumento** vive mientras sostenga una tarea recurrente — por
ejemplo, un mapa de interfaces críticas — y por eso necesita fecha de revisión.

### 2.4 Secuencia ágil de arranque

1. Inventariar solo las fuentes necesarias para la pregunta.
2. Extraer el ledger: hechos, decisiones, restricciones, hipótesis y términos.
3. Normalizar nombres; no inventar definiciones para llenar huecos.
4. Abrir un **apunte** y trazar el fragmento mejor entendido en el Taller.
5. Leer el OPL con el dueño de dominio; una oración extraña revela un hecho extraño.
6. Reconciliar los fragmentos con un SD o adoptar los OPDs sueltos.
7. Graduar cuando la función, frontera y deuda estén suficientemente claras.
8. Conservar el ledger y la base documental; el modelo no los sustituye.

Esta secuencia aprovecha capacidades **HOY**: apuntes, Taller, adopción, OPL,
diagnóstico y graduación. No requiere una futura IA de ingestión para aportar valor.

---

## 3. Dominio, ideas, necesidades y requisitos

### S1 · Modela la transformación del dominio, no las pantallas

**Pregunta.** ¿Qué cambia en el mundo cuando el producto funciona?

**La tentación.** Empezar con *Iniciar sesión*, *Mostrar formulario*, «dashboard» y
tablas, porque son fáciles de imaginar.

**El corte.** El primer SD describe el cambio de valor sin comprometer interfaz ni
stack. «Permitir reservar salas» todavía es débil; «*Confirmación de reserva*
cambia **Solicitud de reserva** de `pendiente` a `confirmada` y genera **Reserva**»
declara transformee, estados y resultado. La UI aparecerá después como instrumento
o interfaz de la realización elegida.

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
**Sala**, **Persona solicitante** y sus procesos. En el modelo de sistema software,
**API de reservas**, **Almacén de reservas** y **Procesador de notificaciones** son
objetos/instrumentos que realizan esa función. Se conectan por los objetos-frontera
que ambos entienden.

Software, robots e IA son **instrumentos**, nunca agentes OPM
(`urn:fxsl:kb:reglas-opm-estrictas-es` R-AG-1/R-AG-1A). «Agente de desarrollo» es
un rol operativo de la ingeniería agéntica; dentro del modelo OPM, su runtime sigue
siendo software. El humano que autoriza, revisa o responde sí puede ser agente.

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
meta (`pendiente | satisface | parcial | no-satisface`). Puede apuntar **HOY** a una
entidad o enlace del mismo modelo. La vista no crea hechos nuevos y el metacontrato
de satisfacción aparece en el perfil `canon-documento`; no debe confundirse con un
enlace OPM nuclear ni con una ejecución de test.

### S6 · Cobertura de modelo no es evidencia de test

**Pregunta.** ¿Qué significa que algo «satisface» un requisito?

**La tentación.** Marcar una cosa como `satisface` y dar el requisito por probado.

**El corte.** La cobertura en opforja afirma «esta parte del diseño realiza esta
intención». La evidencia ejecutable vive en un test, check de CI, informe o control
operacional. **HOY** la mesa no enlaza de forma tipada a esos artefactos externos ni
consulta su resultado.

Usar una tabla externa mínima hasta contar con trazas externas estructuradas:

```markdown
| Requisito | Cobertura OPM | Evidencia ejecutable | Veredicto |
|---|---|---|---|
| REQ-7 | Validación de disponibilidad | tests/reservas/concurrencia.test.ts | CI verde |
```

Extender `TargetSatisfaccionRequisito` con targets externos tipados
`test|código|ADR|pipeline|métrica` es **CORTO**, no una capacidad actual (§8).

### S7 · Cualidades no funcionales necesitan medida y escenario

**Pregunta.** ¿«rápido», «seguro» o «escalable» permite decidir algo?

**La tentación.** Colgar adjetivos del sistema o convertir cada calidad en estado
sin atributo.

**El corte.** Declarar un requisito, su actor, escenario, medida, unidad, umbral y
fuente. La estructura OPM muestra dónde se satisface y qué proceso/objeto afecta; la
medición vive fuera. Ejemplo: `REQ-PERF-3`, hard, «p95 de confirmación < 500 ms con
100 solicitudes/s», cubierto por *Confirmación de reserva* y verificado por un test
de carga externo.

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

### S13 · Vistas y Piezas no agregan hechos

Una **Vista genérica** reúne apariciones existentes para responder una pregunta de
lectura; su OPL es delta-cero. Úsala para «interfaces de Reserva» o «superficie de
fallos», no para afirmar relaciones que el modelo nuclear no contiene.

Una **Pieza** empaqueta un tipo o subgrafo reusable. **Calcar** crea una copia
independiente; **Anclar** mantiene una referencia viva a una biblioteca y el
Centinela de Drift avisa si esa Pieza cambió. El drift vigilado es entre modelo y
biblioteca de opforja: no detecta cambios de código, schema o API externa.

---

## 5. Desarrollo con agentes

### 5.1 El contrato de implementación

Un agente de código no necesita todo el modelo: necesita una **rebanada decidible**.
Antes de delegar, emitir un contrato breve en el issue, task o documento de trabajo:

```markdown
### Contrato de implementación
- Objetivo verificable: <cambio observable>
- Modelo: <id/nombre · revisión · protoHash si existe>
- Contexto OPM: <OPDs y OPL relevantes>
- Requisitos: <IDs + estado de cobertura>
- Decisiones ya tomadas: <ADRs / restricciones>
- Archivos o módulos probables: <alcance inicial, no mandato ciego>
- Pruebas de aceptación: <casos y comando de gate>
- Fuera de alcance: <no hacer>
- Gate humano: <qué decisión no puede tomar el agente>
```

**HOY**, `mesa pull <modelo>` entrega contexto W6.0 — procedencia, pendientes
`[RATIFICAR]`, notas, diagnóstico y OPL — y el agente debe combinarlo con el
contrato del repositorio (`AGENTS.md`/`CLAUDE.md`), el código y los tests. El
contexto W6.0 es del **modelo**, no un brief de implementación completo.

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
documentación/ADR si cambió arquitectura; modelo y OPL actualizados si cambió
comportamiento; revisión o snapshot de opforja en el hito.

El modelo no se actualiza por renombrar una función interna que no altera el dominio.
Sí se actualiza si cambia ownership, interfaz, estado observable, condición, fallo o
resultado.

### 5.2 Loop técnico del agente modelador

Para cambios del propio modelo, la pista agente de `manual-opforja.md` sigue vigente:

`mesa pull → re-elicitar/editar proto → compilar → validar → render headless → mesa push`

Reglas duras: pull fresco; proto como fuente para modelos sellados; validación local
verde; 409 implica re-pull, jamás forzar; push sin delta es no-op; nota significativa.
El chip de revisión deja la llegada visible al operador.

---

## 6. Despliegue y entrega continua

### S16 · Modela el pipeline; ejecútalo fuera

OPM puede hacer legible el sistema de entrega:

- **Código fuente** y **Configuración** habilitan *Construcción de artefacto*;
- *Construcción de artefacto* genera **Artefacto desplegable**;
- *Verificación de artefacto* cambia su estado de `candidato` a `verificado` o
  `rechazado`;
- *Despliegue* cambia **Release** de `aprobada` a `desplegada` en un **Ambiente**;
- una señal de salud condiciona *Promoción* o inicia *Rollback*;
- **Responsable de release** es agente humano cuando existe aprobación humana;
  CI/CD, registry y orquestador son instrumentos.

Este modelo sirve para exponer compuertas, artefactos, responsabilidades y caminos de
recuperación. opforja **no ejecuta el pipeline, no firma imágenes, no consulta CI y
no despliega**. Los manifests y el historial del pipeline conservan la verdad
operativa.

### 6.1 Gate de release sugerido

Antes de un release cuya semántica cambió:

1. requisitos afectados identificados;
2. OPL relevante confirmado;
3. tests asociados verdes;
4. ADR o interfaz actualizada si corresponde;
5. fallos/rollback modelados cuando son parte de la decisión;
6. snapshot manual de opforja con nombre de hito;
7. commit/tag/artefacto registrados en sus sistemas propietarios.

La asociación automática `modelo revision ↔ commit ↔ build ↔ deploy` es **CORTO**
mediante un manifiesto de evidencia (§8). **HOY** se registra en la descripción del
snapshot o en el documento de release.

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

### S18 · Drift, versiones y mantenimiento del contrato

opforja **HOY** guarda versiones manuales, restaura una versión como copia y agrupa
las revisiones de una sesión de agente. Úsalas en hitos semánticos, no como sustituto
de Git:

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
| Pregunta respondida y sin uso recurrente | archivar el modelo-respuesta |
| Instrumento sin dueño, revisión ni consumo | candidato a retiro |

Mantención no es mantener cada rectángulo alineado con una clase. Es conservar la
verdad del contrato que aún se usa para decidir.

---

## 8. Frontera de capacidad y extensiones de corto plazo

### 8.1 Matriz del ciclo de vida

| Etapa | opforja **HOY** | **CORTO** propuesto | **FUERA** / sistema propietario |
|---|---|---|---|
| Base documental | descripción/proto, anclas normativas, `[RATIFICAR]`, notas | ancla de fuente genérica con URI/localizador/hash | ingestión, OCR, búsqueda y gestión documental |
| Descubrimiento | apunte, Taller, OPL, validación, vistas | import de ledger normalizado como contexto, no como hechos automáticos | entrevistas y decisión de dominio |
| Requisitos | objeto requisito, hard/soft, actor, satisfacción, cobertura a cosa/enlace, vista | targets externos tipados + export de cobertura | backlog, aceptación y evidencia CI |
| Arquitectura | refinamiento, composición, submodelos, Piezas, interfaces, simulación conceptual | vínculo repo/modelo y manifiesto de hito | diseño especializado, benchmarks, threat modeling completo |
| Desarrollo | mesa pull/push, proto, bundle, render, golden | export determinista de Contexto de desarrollo | edición/generación de código, PRs, code review |
| Verificación | reglas OPM, roundtrip, firma de frontera, reproducibilidad | gate CI que valide bundle/manifiesto versionado | tests funcionales, carga, seguridad, CI |
| Despliegue | modelar pipeline y fallos | manifiesto modelo↔commit↔build↔deploy | ejecución CI/CD, secretos, infra |
| Operación | modelar señales, incidentes e hipótesis | import explícito de evidencia resumida y firmada | logs, métricas, trazas, alertas |
| Evolución | snapshots, restaurar copia, drift de Piezas | reporte de impacto basado en requisitos e interfaces | diff código↔modelo y sincronía automática |

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

#### C4 · Manifiesto de hito

Documento pequeño y verificable:

```json
{
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

- **Solicitud de reserva** puede estar `pendiente`, `confirmada`, `rechazada`.
- *Confirmación de reserva* cambia **Solicitud de reserva** de `pendiente` a
  `confirmada` y genera **Reserva**.
- *Confirmación de reserva* requiere **Disponibilidad de sala**.
- **Persona aprobadora** maneja *Aprobación de reserva* cuando la sala lo exige.

El dominio todavía no dice REST, SQL ni colas.

### 9.3 Requisitos

- `REQ-1` hard: no confirmar dos reservas solapadas para la misma sala e intervalo.
  Cobertura OPM: proceso *Validación de disponibilidad* y enlace que condiciona la
  confirmación. Evidencia externa: test de concurrencia.
- `REQ-2` hard: una sala restringida requiere aprobación humana. Cobertura: estado
  de **Aprobación** y condición de ejecución.
- `REQ-3` soft mientras no se ratifique: p95 < 500 ms. Cobertura: *Confirmación de
  reserva*; evidencia futura: test de carga.

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
el dominio.

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

1. Pull del modelo/contexto y lectura del contrato del repo.
2. Seleccionar OPDs y requisitos relevantes.
3. Emitir contrato de implementación con no-objetivos y gate humano.
4. Implementar cambio acotado y tests.
5. Ejecutar gates; revisar diff.
6. Actualizar modelo solo si cambió el contrato.
7. Commit/push/PR según el flujo del repo; snapshot de modelo si es hito semántico.

### C. Preparar un release

1. Identificar requisitos y cambios semánticos.
2. Confirmar OPL, ADRs e interfaces.
3. Verificar tests y compuertas de despliegue/rollback.
4. Crear snapshot del modelo y registrar commit/build/deploy externamente.
5. Ejecutar pipeline fuera de opforja.

### D. Responder a incidente o evolución

1. Capturar evidencia externa; no escribir causa antes de investigarla.
2. Crear apunte con observado, esperado e hipótesis `[RATIFICAR]`.
3. Comparar contra modelo y tests.
4. Decidir si falló implementación o cambió el contrato.
5. Corregir el artefacto propietario y cerrar el loop.
6. Versionar o archivar el modelo según su criterio de muerte.

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

- **2026-07-14** — Creación. Manual de dominio de software desde base documental
  hasta mantención, con cadena de autoridad por artefacto, piezas de decisión,
  workflow humano–agente, ejemplo Lumbre, matriz `HOY/CORTO/FUERA` y cuatro
  extensiones cortas que no convierten opforja en ALM ni plataforma DevOps.
