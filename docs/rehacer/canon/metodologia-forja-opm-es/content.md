---
urn: urn:fxsl:kb:metodologia-forja-opm-es
nombre: metodologia-forja-opm-es
version: 1.7.0
estado: publicado
descripcion: "Metodología Forja — método de modelamiento OPM en opforja: destilación korificada del manual metodológico para la mesa de trabajo deep-opm-pro."
fuente: "SSOT OPM v1.5.1. Re-sincronizado desde la bestia (~/kora) artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-forja-es.md (sha256:7a30c72d1ad2c674fb3b29d4f0e01e5350ae66b652fdf932237073e42b8838b4) el 2026-06-15; cuerpo byte-fiel. DECISION HITL 2026-06-15: pneuma toma la posta como SSOT viva de OPM (urn:kora:kb:regimen-de-ley); la bestia queda como ultimo origen historico, ya no SSOT viva. Enmienda v1.6.0 del 2026-07-07: arranque bottom-up de primera clase. Correccion v1.6.1 del 2026-07-18: la firma de frontera se acota a equivalencia observacional relativa; se retira su identificacion automatica con equivalencia categorial, sustituibilidad total y fibracion. Enmienda v1.7.0 del 2026-07-27: separa el ciclo documental Apunte-Modelo del ciclo de componente Boceto-OPD integrado, incorpora sus inversas y preservaciones, y distingue graduacion, integracion, export canonico y validacion humana."
autor: FS
creado: 2026-05-31
lang: es
tags: [opm, methodology, opforja, deep-opm-pro, modeling-method, lessons, characterization, state-suppression, dimensionalization, submodel-composition, reverse-systems-engineering, requirements-analysis, knowledge-gaps, mbrse, llm-first, human-machine-task-analysis, digital-twin, cyber-physical-systems, configuration-simulation, quality-attributes]
familia: bok
depende: [urn:fxsl:kb:opm-es, urn:fxsl:kb:opl-es, urn:fxsl:kb:opd-es]
cita: [urn:fxsl:kb:opm-es, urn:fxsl:kb:opl-es, urn:fxsl:kb:opd-es, urn:fxsl:kb:reglas-opm-estrictas-es, urn:fxsl:kb:spec-forja-opd-es, urn:fxsl:kb:spec-forja-opl-es, urn:fxsl:kb:opm-categorial-es, urn:fxsl:kb:manual-metodologico-opm-es, urn:fxsl:kb:icas-higher-categories, urn:fxsl:kb:icas-procesos, urn:fxsl:kb:icas-calidad-riesgo, urn:fxsl:kb:icas-escala]
---

# Metodología Forja — método de modelamiento OPM en opforja (v1.7.0)

SSOT **primaria y autónoma** del *método* de modelar OPM con la herramienta
opforja (deep-opm-pro). Contiene todo el procedimiento (no requiere abrir otra
fuente para modelar) + el catálogo de lecciones forja + la realización del bundle.

## 0. Contrato

**0.1 Naturaleza.** Capa de **método**: orienta *cómo* construir un hecho OPM válido y *en qué orden*. No es norma bloqueante ni redefine primitivas.

**0.2 Precedencia (familia Forja, no cadena simple).** Hay cuatro planos ortogonales:
- **Plano de validez** (predica sobre el *hecho*): `reglas-opm-estrictas-es` decide validez operativa, severidad y extensiones declaradas, bajo las capas base `opm-es`/`opd-es`/`opl-es`.
- **Plano modal** (predica sobre la *realización*): `spec-forja-opd-es` gobierna OPD/visual y `spec-forja-opl-es` gobierna OPL/textual y roundtrip. Ninguna spec modal redefine validez nuclear.
- **Plano de método** (predica sobre el *camino*): este documento. Atado al plano de validez por **lifting**: *ninguna lección o procedimiento autoriza un hecho que la norma prohíbe, ni redefine una primitiva*. La norma no deroga el método (un modelo puede ser **conforme-pero-malo**; eso es lo que el método cubre).
- **Plano formal** (predica sobre la *lectura estructural*): `opm-categorial-es` explica y traza leyes bajo la superficie; no introduce vocabulario de modelador ni reglas nuevas sin capa propietaria.
- *(lente formal, opcional y aún hipotética: podría estudiarse una fibración
  sobre el plano de validez si se construyen proyección y lifts cartesianos.)*

**0.3 Invariante de pureza.** Todo principio se enuncia en **primitivas OPM** (objeto, proceso, estado, enlace, exhibición-caracterización, descomposición, despliegue). El dominio (HODOM u otro) aparece **solo** como ejemplo etiquetado y desmontable. Lentes formales (teoría de categorías) solo como nota al margen, nunca como el principio.

**0.4 Autonomía y no duplicación.** Este artefacto **contiene** el método; no apunta a `manual-metodologico-opm-es` para definirlo. El manual queda como SSOT tool-agnóstica de la que este deriva (`derived_from`), no como dependencia de lectura. Este documento NO DEBE duplicar la matriz de validez de `reglas-opm-estrictas-es`, la geometría completa de `spec-forja-opd-es`, las plantillas completas de `spec-forja-opl-es` ni la explicación categorial de `opm-categorial-es`; debe citar esos artefactos cuando una decisión metodológica los requiera.

**0.5 Cómo leer.** Reglas con verbo de obligación es-CL: **DEBE / DEBERÍA / PUEDE**. Tipografía canónica en ejemplos: objeto **negrita**, proceso *cursiva*, `estado` en backticks. Ejemplos en bimodalidad OPD↔OPL.

---

# Parte A — Método (destilado autónomo)

## A0. Antes de la semilla (fase pre-SD)

**A0.1 Divergencia de conceptos.** Antes de fijar UN SD, el modelador **DEBERÍA** generar **≥3 conceptos de solución** distintos, destilar el concepto central de cada uno y explicitar sus supuestos; recién entonces comprometer la arquitectura. *(anclaje: opm-es §Conceptos alternativos de solución.)*

**A0.2 Función vs. comportamiento (guard anti-arquitectura prematura).** **Función** = el valor para el beneficiario (qué/para quién, subjetivo). **Comportamiento** = cómo cambia el sistema en el tiempo (objetivo). Confundirlas colapsa a una arquitectura antes de tiempo (decidir "puente" cuando la función "cruzar el río" admite también "transbordador"). Mantener la función **agnóstica de arquitectura** mientras existan alternativas vivas.

**A0.3 Intención → función → forma.** En sistemas con varias tecnologías candidatas, el modelador **DEBERÍA** separar tres capas antes del SD definitivo: (1) intención/valor que se busca, (2) funciones solution-neutral que realizan ese valor, (3) formas solution-specific que implementan cada función. Las formas pueden desplegarse por generalización-especialización, pero la capa funcional no debe heredar nombres de tecnología antes de decidir la arquitectura.

**A0.4 Equivalencia observacional de realizaciones alternativas (cierre de A0.1).** Generar ≥3 conceptos (A0.1) no basta: el modelador necesita un criterio para comparar realizaciones. La misma **firma de frontera** —roles netos sobre las entidades declaradas— las hace indistinguibles **para esos observables**. No garantiza sustituibilidad total: estados, protocolos, errores, timing y efectos fuera de la firma pueden distinguirlas. Solo cuando el alcance declara la firma completa para el consumidor y verifica esos efectos puede tratarse como criterio operativo de intercambio. Esta es equivalencia observacional relativa, no equivalencia categorial por sí sola. *(anclaje: `reglas-opm-estrictas-es §Anexo C / R-CAT-EQ`; lectura crítica: `urn:fxsl:kb:opm-categorial-es`; jamás expuesta al modelador.)*

- **A0.4a Criterio operativo en opforja (realizaciones hermanas + in-zoom ↔ out-zoom).** Opforja PUEDE confirmar igualdad de firma para dos OPDs comparables; el resultado significa equivalencia respecto de la frontera modelada, no identidad ni bisimulación. Además, toda **descomposición** DEBE preservar la firma de frontera de su proceso abstracto. Añadir o quitar un rol prueba diferencia funcional visible; conservar todos los roles es condición necesaria, no siempre suficiente. Violación detectable: `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (pasivo).

## A1. Principio rector y clasificación

**A1.1 Regla rectora.** El modelado **DEBE** empezar por la **función**, seguir con valor/agentes/entorno/transformados, y solo después profundizar en estructura, control, simulación y gobernanza. La función es la semilla; el SD precede a todo refinamiento **integrado en el árbol**, aunque un Boceto bottom-up pueda existir antes de decidir ese SD; la claridad local nunca viola la completitud global; toda heurística está subordinada a la equivalencia OPD↔OPL y a la unicidad del hecho. **Práctica real = middle-out**: se empieza por el nivel mejor entendido y se refina/abstrae en ambas direcciones; "empezar por la función" fija la *semilla conceptual*, no obliga a construir top-down estricto.

**A1.2 Clasificación del sistema (pre-etapa obligatoria).** Determina qué componentes del SD aplican:

| Tipo | Propósito | Ocurrencia del problema | Agentes humanos |
|---|---|---|---|
| Artificial | sí | sí | sí |
| Natural | **no** → `resultado` | **no** | no (solo instrumentos) |
| Social | sí (5 componentes) | sí | sí; condiciones ambientales por enlace habilitador con estado |
| Socio-técnico | sí (5 componentes) | sí | sí; relaciones no fundamentales por enlace estructural etiquetado |

Patrones de referencia: Artificial `Airplane Flying`; Natural `Fetus Developing` (resultado, no propósito); Social `Conference Occurring`; Socio-técnico `Online Professional Identity Managing`; físico-con-partes-informacionales `Baggage Transporting` (la transformación dominante física fija la esencia → §9.11 en A5).

**A1.3 Modo reverse / MBRSE para sistemas existentes.** Cuando el sistema ya existe y no hay diseño ni requisitos completos, el método **NO** exige reconstruir top-down antes de modelar. Opera en ciclo:

`observaciones → requisitos inferidos → modelo conceptual OPM → brechas de conocimiento → predicciones/pruebas → actualización de observaciones/requisitos`.

Reglas de uso:
- Las observaciones pueden entrar en cualquier nivel de la jerarquía; el trabajo es **middle-out** con ciclos bottom-up y top-down.
- Un requisito inferido es **hipótesis de función/constraint**, no hecho normativo hasta que se conecte con estructura y comportamiento observables (§A7).
- No hace falta completar toda la jerarquía de requisitos para empezar: basta un conjunto pequeño de requisitos clave si permite explicar arquitectura y generar pruebas.
- Cada vuelta debe dejar al menos uno de tres saldos: hecho OPM mejor situado, brecha explícita o predicción testeable.

Preguntas guía para observar antes de plasmar:

| Lente | Pregunta |
|---|---|
| Función | ¿Qué logra el sistema? |
| Contexto | ¿En qué contexto logra esa función? |
| Arquitectura | ¿Qué subsistemas y relaciones hacen posible la función? |
| Desempeño | ¿Qué tan bien debe hacerlo y bajo qué variación? |
| Restricciones | ¿Qué dependencias externas o límites lo condicionan? |
| Interfaces | ¿Qué cruza la frontera del sistema y qué subsistemas internos acopla? |

**A1.4 Modos de aplicación real.** Además del diseño forward, Forja reconoce tres modos frecuentes: (a) **task analysis humano-máquina**, donde el OPD debe modelar personas, tecnología, decisiones, feedback y contingencias como un solo sistema procedimental; (b) **modelo prospectivo/To-Be**, donde el OPD describe una arquitectura futura o prototipo digital y debe marcar la fuerza epistémica de sus objetos/procesos; (c) **digital twin / CPS**, donde el OPD combina proceso físico, datos, simulación y predicción sin convertir cada variable en transformee. El modo elegido no cambia las primitivas OPM; cambia la disciplina de evidencia, validación y altitud.

**A1.5 Taller y arranque bottom-up de primera clase.** Forja reconoce dos
arranques hermanos, subordinados a la misma equivalencia OPD↔OPL y a la
función-semilla (A1.1):

- **SD-primero** (default del asistente guiado, A2): fija la función en el SD y
  refina hacia abajo (A3).
- **Bottom-up**: permite trazar Bocetos —OPDs no raíz todavía fuera del árbol de
  refinamiento— antes de comprometer un SD, y situarlos después donde agregan
  detalle motivado.

La mesa mantiene dos ciclos reversibles **independientes**:

```text
Documento: Apunte ⇄ Modelo       (Graduar a Modelo / Reabrir en Taller)
Componente: Boceto ⇄ OPD integrado (Integrar como… / Devolver a Bocetos)
```

El **Taller** es el espacio global de documentos Apunte; **Bocetos** es la banda
local de componentes todavía no integrados. Un Apunte puede contener OPDs
integrados y un Modelo puede conservar Bocetos como pendientes: ninguna de esas
combinaciones crea una tercera especie ni una etapa persistida.

Reglas de uso:

- **Integridad constante.** Apunte y Boceto relajan cierre u orden, nunca
  referencias, formato ni geometría. Un documento roto bloquea en cualquier
  régimen.
- **Ciclo documental.** Graduar a Modelo cambia el régimen de cierre del mismo
  documento: conserva identidad y hechos, vuelve exigibles sus pendientes y
  crea una versión. Si la integridad está sana, el operador PUEDE **Graduar con
  pendientes**; el gesto no corrige, integra ni certifica. **Graduar no
  integra** Bocetos. Reabrir en Taller es la inversa de régimen y conserva
  identidad, hechos y carpeta; tampoco invalida por sí sola una validación
  humana registrada sobre una versión.
- **Ciclo del componente.** Integrar como descomposición o despliegue fija padre
  y slot de refinamiento en un solo gesto, usando el mismo constructor de
  vínculo que el refinamiento top-down. La convergencia es del vínculo, no del
  contenido: el Boceto conserva su autoría. Devolver a Bocetos libera ese
  vínculo y preserva ID, hechos y subárbol. **Eliminar refinamiento** es una
  operación destructiva distinta, nunca la inversa de Integrar.
- **Cierre y export.** La preparación formal es derivada, no persistida. En
  régimen Modelo, un Boceto pendiente bloquea el export canónico según
  `reglas-opm-estrictas-es` R-CAN-BOCETO-1..4; en régimen Apunte se informa y
  marca el bosquejo sin bloquear la edición. Graduar y exportar son decisiones
  separadas.
- **Validación humana separada.** Integrar, Graduar a Modelo, exportar o marcar
  Biblioteca no aprueba el contenido ni sustituye a una persona o autoridad de
  dominio.

*(anclaje: A1.1 middle-out; A1.3 MBRSE; validez
`reglas-opm-estrictas-es` R-CAN-BOCETO-1..4; realización
`spec-forja-opd-es` §10.4 R-OPD-REF-20; contrato de producto
deep-opm-pro `2026-07-27-taller-modelos-ciclo-reversible-design.md`.)*

## A2. Construcción del SD (asistente agnóstico, 11 etapas)

Cada etapa **DEBE** cerrar con un hecho explícito listo para OPD/OPL. El asistente no termina cuando el usuario "entiende"; termina cuando los hechos mínimos quedaron decididos. Si una etapa no cierra, retroceder a la que bloquea.

> El asistente de las 11 etapas realiza el arranque **SD-primero**. El arranque
> **bottom-up** (A1.5) es su hermano legítimo para elicitación exploratoria:
> puede aplicar estas etapas cuando emerge un candidato a SD. Graduar no ejecuta
> ni completa el asistente de manera implícita; en régimen Modelo, lo pendiente
> reaparece como cierre exigible.

| # | Objetivo | Salida mínima |
|---|---|---|
| 0 | Clasificar (§A1.2) | tipo |
| 1 | Proceso principal | nombre canónico de **acción transformadora** (no clase ni etiqueta). ✓`Battery Charging` ✗`Battery`/`Proceso Principal` |
| 2 | Interesado primario | grupo beneficiario, **objeto físico**, nombre singular (sufijo Grupo/Conjunto) |
| 3 | Valor a transformar | atributo informacional del beneficiario + estados entrada→salida (2 por defecto) |
| 4 | Función principal | objeto proveedor de beneficio (+ atributo). Si hay múltiples transformados, **solo** el proveedor de beneficio define la función |
| 5 | Agencia humana | conjunto de agentes **o** `sin agentes humanos` explícito. Agente = humano/grupo humano; robots/SW/IA = instrumento |
| 6 | Delimitar sistema | nombre del sistema + el sistema **exhibe** el proceso principal (exhibición-caracterización) |
| 7 | Instrumentos | habilitadores no humanos presentes toda la duración (enlace instrumento, ○) |
| 8 | Transformados/resultados | consumo / resultado / par entrada-salida con transición de estados |
| 9 | Entorno | objetos ambientales, contorno discontinuo |
| 10 | Ocurrencia del problema | proceso ambiental que causa el estado problemático (artificial/social); `NO APLICA` explícito si natural |
| 11 | Verificación | compuerta `PASA/FALLA` (§A8) |

**A2.1 Reclasificación por desgaste (etapa 7).** Si el desgaste/degradación/amortización de un instrumento es relevante al alcance, el instrumento **DEBE** reclasificarse como **afectado** (`reglas-opm-estrictas-es` R-AG-3; el método no autoriza conservarlo como instrumento en ese caso — lifting, §0.2). El patrón alternativo «conservar como instrumento + atributo afectado/medido» (degradación como variable informacional de desempeño, observado en digital twins: **Cutting Tool** requiere *Machining* y exhibe **Tool Wear**) **solo** es legal si antes se ratifica en `reglas-opm-estrictas-es` como extensión declarada (p.ej. R-AG-3A: degradación como variable informacional con cambio neto cero del host, análoga al cambio de rol entre niveles §9.4); mientras esa ratificación no exista, aplicar la reclasificación. **Mantenimiento** (R-AG-4): si pertenece al alcance declarado, **DEBE** agregarse el atributo de degradación/amortización y un proceso de mantenimiento separado (*Machine Maintaining*); si queda fuera del alcance, **DEBE** declararse esa exclusión. ✓ **Machine** es afectado de *Metal Cutting* cuando su capacidad cambia. ✗ **Machine** como instrumento silencioso cuando su desgaste explica arquitectura o mantenimiento.

**A2.2 Doble rol.** Un objeto PUEDE ser agente de un proceso y transformado de **otro** proceso. En el **mismo** proceso, si beneficiario es transformado, el enlace transformador prevalece sobre el habilitador (no dos enlaces simultáneos). En sistemas de tarea, el mismo grupo humano PUEDE ser agente y beneficiario de valor; no duplicar artificialmente "operador" y "usuario" si el dominio no los distingue. Un agente puede ser ambiental: agencia expresa responsabilidad/acción humana, no afiliación sistémica.

**A2.3 Nombrado y esencia por defecto.**
- **Escala de nombrado de procesos** (4 niveles de info creciente, en forma nominalizada/gerundiva): (i) verbo (`Carga`); (ii) objeto+nominalización (`Carga de batería`, recomendado por defecto); (iii) cualificador+nominalización (`Carga automática`); (iv) cualificador+objeto+nominalización (`Carga automática de batería`). La norma admite **ambos** comienzos canónicos de nombre de proceso: infinitivo `-ar`/`-er`/`-ir` (`Cargar batería`) y nominalización `-ción`/`-miento` (`opl-es §1.1`; `reglas` R-NOM-PROC-1). Por método Forja se **DEBERÍA** preferir la nominalización (OPL más fluida) y **NO mezclar** ambas formas dentro de un mismo modelo; el infinitivo **NO se prohíbe**, porque el método no deroga lo que la norma admite (lifting, §0.2).
- **Nombrar agregados/atributos sin término natural**: cuando un compuesto o atributo central no tiene palabra en lenguaje natural (p.ej. el complejo `Conductor-Vehículo`, o el atributo de `Longitud/Anchura/...` sin nombre común), el modelador **DEBE** *inventar* un nombre expresivo; nombrar bien la abstracción es parte del análisis, no un accesorio.
- **Esencia primaria por defecto.** Fijar la esencia mayoritaria del sistema como *default* y NO anotar física/informacional cosa por cosa reduce el ruido; declarar la esencia solo cuando difiere del default (o mientras el thing está aislado sin enlaces). *(realización: ver Apéndice F.)*

**A2.4 Lentes parciales del SD.** Para elicitar sistemas complejos, el modelador **PUEDE** construir OPDs-lente separados de propósito, función, enablers, entorno y ocurrencia del problema antes de integrar el SD. Estos lentes son andamiaje de construcción y revisión; no sustituyen el SD integrado ni crean un mecanismo de refinamiento adicional.

**A2.5 Ocurrencia del problema como anti-función.** En sistemas artificiales/sociales, la ocurrencia del problema **DEBERÍA** modelarse como proceso ambiental/tradicional que produce o mantiene el estado problemático que el sistema busca transformar. Esta anti-función ayuda a verificar que la función principal no es una etiqueta de deseo sino la reversión concreta de una situación observable.

**A2.6 Beneficio distribuido.** Si el valor pertenece a varios grupos humanos, modelar el atributo de valor como exhibido por esos grupos o por un objeto de preocupación compartido; no colgarlo por comodidad del sistema técnico. El stakeholder portador del valor es parte del significado funcional.

## A3. Refinamiento (SD1)

**A3.1 Descomposición (proceso síncrono, orden fijo).** Inflar el proceso (contorno grueso en padre e hijo); subprocesos verticales por **Línea de Tiempo** (primero arriba); ≥2 subprocesos (refinamiento no trivial); cada subproceso ≥1 transformado. Secuencia: inflar → subprocesos → renombrar con dominio → traer externos conectados al padre → crear internos → estados → enlaces internos. **Paralelismo**: bordes superiores a la misma altura = `en paralelo`; el siguiente inicia cuando el último paralelo termina. **Preferida** sobre despliegue para síncronos (menos símbolos, OPL más corto, invocación implícita por línea de tiempo). El **orden vertical es semántico** (no cosmético): fija el orden de ejecución y es **verificable por simulación conceptual** (§A8) — si la animación de tokens corre en orden inesperado, revisar alturas relativas y enlaces de control. En procedimientos humano-máquina, usar una regla práctica más estricta: si el in-zoom supera ~5 subprocesos, buscar un proceso intermedio/out-zoom antes de saturar la lectura.

**A3.2 Despliegue (proceso/objeto asíncrono).** Subprocesos independientes, cualquier orden; ≥2 refinadores. Cuatro relaciones estructurales (cada una con su par despliegue/plegado):

| Relación | Despliegue expone |
|---|---|
| Agregación-participación | partes del todo |
| Exhibición-caracterización | rasgos/atributos del exhibidor |
| Generalización-especialización | especializaciones del general |
| Clasificación-instanciación | instancias de la clase |

Decisión agregación vs generalización: ¿cada subproceso es variante/tipo del mismo patrón? → generalización. ¿El todo necesita todas las partes? → agregación. Despliegue parcial → símbolo de colección incompleta.

**A3.3 Identidad de la descomposición.** Subprocesos = partes (agregación + ordenabilidad); objetos que el proceso **exhibe** = atributos del proceso; objetos que entran por migración mantienen identidad independiente (no son atributos). Simétrico para objetos: internos = partes, procesos internos = operaciones.
- **Descomposición de objeto ≠ línea de tiempo.** En la descomposición de un **objeto**, la posición codifica **disposición espacial/organización lógica (2D)**, NO orden temporal (a diferencia de la descomposición de proceso, A3.1). Útil para layout físico aproximado y para tablas/matrices (cada in-zoom añade una dimensión). *(opd-es V-77/V-78.)*
- **Alcance interno/externo (regla de frontera).** Un objeto creado *dentro* de un proceso descompuesto es **interno**: vive solo en el alcance de ese proceso (visible solo en su OPD). Si se necesita fuera, **DEBE** colocarse fuera del in-zoom. Una cosa no es interna y externa a la vez; reposicionarla gráficamente NO cambia su alcance — para moverla de alcance hay que recrearla.
- **Vista explicativa vs. mecanismo.** Un OPD que "despliega" métodos, insumos, herramientas y resultados puede ser una vista explicativa útil, pero el mecanismo OPM correcto depende de la semántica: orden temporal y transformees → descomposición; partes/rasgos/especializaciones/instancias → despliegue; artefactos compartidos entre procesos → objetos externos conectados. No copiar el nombre visual de una figura si contradice el mecanismo.

**A3.4 Distribución/migración de enlaces** (resumen; canon en `opd-es` §11-§12):

| Enlace | Contorno exterior |
|---|---|
| Agente / instrumento / efecto | PERMITIDO (distribuye a todos) |
| Consumo | PROHIBIDO — migra al **primer** subproceso; reasignar |
| Resultado | PROHIBIDO — migra al **último** subproceso; reasignar |
| Evento sistémico | PROHIBIDO (eventos de objetos **ambientales** sí cruzan) |

Reasignar cada transformador al subproceso que realmente consume/produce/completa. **Escisión con estado**: `*P* cambia **A** de \`s1\` a \`s2\`` al descomponer en P1,P2 → `*P1* cambia **A** de \`s1\`` + `*P2* cambia **A** a \`s2\``. Escisión con modificador de control NO permitida. **Antipatrón**: evento a subproceso no-primero (salta precondiciones) salvo verificación explícita.
- **Migración al primer subproceso (principio, no promesa de herramienta).** Al insertar el primer subproceso, los enlaces del contorno migran a él por defecto; es **responsabilidad del modelador reasignarlos** al subproceso real y devolver al contorno los habilitadores que aplican a todos. *(Si la herramienta automatiza la migración, verificarlo en opforja; no asumirlo.)*
- **Precedencia al abstraer (puntero, no copia).** Al recomponer/abstraer (out-zoom, plegado, supresión), cuando dos enlaces compiten por el mismo par cosa-proceso prevalece el de mayor fuerza semántica: `Consumo = Resultado > Efecto > Agente > Instrumento` (refinada por modificador de control dentro de cada tipo). La matriz completa y las combinaciones inválidas son canon de **`opd-es` §13** — el método **solo apunta**, no la reproduce.

**A3.5 Invocación implícita** (por disposición vertical, no gráfica): proceso→primer subproceso; subproceso→siguiente al terminar; último→contenedor.

**A3.6 Expresión/supresión de estados.** Suprimir en SD los estados **no** conectados a proceso; expresarlos en SD1 donde se conectan a subprocesos. Afectado en transición durante proceso activo está **indeterminado** e indisponible para otros procesos. → ver **LF-03** para la realización per-aparición.

## A4. Gestión de complejidad (niveles 2+)

**A4.1 Cuatro mecanismos canónicos** (3 intra-modelo + 1 inter-modelo):

| Mecanismo | Refinar / Abstraer | Uso |
|---|---|---|
| Descomposición / Recomposición | expone/oculta contenido interno | procesos síncronos; objetos con partes |
| Despliegue / Plegado | expone/oculta refinadores | procesos asíncronos; taxonomías; rasgos |
| Expresión / Supresión de estados | muestra/oculta estados | simplificación contextual (LF-03) |
| Composición inter-modelo por sub-modelo | referencia / desconexión | trabajo concurrente; encapsulación (LF-04) |

Las **vistas** (mapa del sistema, árbol de procesos/objetos, vistas ad hoc) NO son mecanismo ontológico: navegan/explican, no crean hechos. Operadores de canvas (`Bring`, etc.) son derivados, no mecanismos.

**A4.2 Heurística de profundidad.** Si un OPD de nivel N no agrega transformados/estados/enlaces nuevos respecto del padre, el refinamiento es innecesario. **Claridad**: ningún OPD > **20-25** entidades. Calibración empírica: los modelos detallados suelen abarcar **5-10 niveles** del árbol de procesos (referencia, no invariante).

**A4.3 Árbol OPD e identidad.** Etiquetas `SD/SD1/SD1.1` son **navegación**, NO identidad persistente. Cada OPD **DEBE** tener identificador persistente (URI/handle) recuperable en serialización. Cada modelo tiene su árbol local; los sub-modelos componen **por referencia**, no por super-árbol global. OPDs hoja = única clase eliminable. **Importancia = altitud de primera aparición**: la importancia de una cosa se mide por el OPD más alto donde aparece → subir al SD lo nuclear, diferir lo secundario a in-zooms (criterio de *dónde introducir* una entidad; conecta con la regla anti-"gran ficha").

**A4.4 Contrato de sub-modelo (interfaz congelada).** Mínimo: 1 objeto + 1 proceso por exhibición-caracterización e instrumento; un solo proceso por sub-modelo; cosas compartidas sin refinar. Tras crear: las compartidas **no** reciben nuevos enlaces/estados, **no** se renombran/eliminan, **no** se agregan nuevas compartidas (si la interfaz es incorrecta, destruir y recrear). Autoridad semántica = modelo propietario; el consumidor solo referencia, por id persistente. → ver **LF-04**.

**A4.5 Simplificación de OPD sobrecargado.** Identificar conjunto a extraer → nombrar proceso interino que los contenga → recomponer (abstraer enlaces + ocultar) → nuevo OPD descendiente → renumerar. Reducción neta = removidos − 1.

**A4.6 Viewpack arquitectónico.** En SoS/CPS densos, además del árbol OPD formal, el modelador **PUEDE** mantener un paquete de vistas metodológicas: inventario de componentes, carriles de valor/soporte, alternativas morfológicas, ruta primaria y contribución a atributos de desempeño. Estas vistas son proyecciones para decidir y comunicar; todo hecho que pretenda ser parte del modelo debe volver a una primitiva OPM y a OPL equivalente.

## A5. Heurísticas de modelado

| ID | Heurística | Regla |
|---|---|---|
| §9.1 | Proceso persistente → enlace estructural etiquetado | *Sostener/Mantener/Almacenar/Contener* sin cambio neto relevante → reemplazar por enlace estructural etiquetado (✓`Cimentación soporta Casa`). Excepción: esfuerzo no trivial (vuelo estacionario) → proceso explícito. El proceso persistente que **sí** sobrevive se realiza como cambio con **entrada=salida** (`*P* cambia **A** de \`s\` a \`s\``), no con verbo especial |
| §9.2 | Objeto transiente → invocación | creación-consumo inmediato sin observación → suprimir objeto + enlace de invocación (rayo) |
| §9.4 | Cambio de rol entre niveles | instrumento en SD PUEDE ser afectado en SD1 si cambio neto = 0 (✓ Dishwasher empty→loaded→empty) |
| §9.5 | Árbol de decisión de atributos | clasificar en 4 dimensiones binarias: explícito/implícito, cualitativo/cuantitativo, duro/blando (computable), inherente/emergente. Blandos PUEDEN no requerir seguimiento; emergentes definen la arquitectura |
| §9.6 | Homogeneidad de enlaces | estructurales homogéneos (obj↔obj, proc↔proc); procedimentales no homogéneos (obj↔proc). **Excepción**: exhibición-caracterización admite las 4 combinaciones |
| §9.8 | Caracterización con estado especificado | especializaciones que difieren por valor de atributo → atributo discriminante con caracterización con estado especificado (OPD más compacto) |
| §9.9 | Herencia | cada especialización hereda partes, rasgos, enlaces estructurales y procedimentales, y estados; PUEDE sobreescribir estados |
| §9.11 | Esencia de cosas mixtas | físico+informacional → clasificar como **físico** (esencia dominante tangible) |
| §9.12 | Estados directos vs atributo+valores | un solo atributo relevante → estados directos del objeto (✓`Fetus can be embryo or baby`). Múltiples atributos o nombre informativo → atributo+valores explícito |
| §9.13 | Generalización como abstracción del SD | varios específicos del SD1 con la misma relación al proceso principal → objeto general en SD + específicos en SD1 por generalización-especialización (evita sobrecarga del raíz). **Refactor crear-general (4 pasos)**: (1) combinar features/partes comunes en un general, (2) enlazar por gen-spec, (3) quitar de los específicos lo ahora heredado, (4) migrar al general los enlaces comunes (un solo enlace desde el general). **Under/over-specification**: al especializar, dejar el enlace genérico del padre = subespecificación (cualquier herramienta sirve para cualquier cocción); dejar genérico **y** específicos = sobreespecificación; reemplazar el genérico por los específicos entre las especializaciones correspondientes |
| §9.14 | Objetos implícitos + test del proceso | al modelar texto, forzar "¿qué objeto transforma este proceso?" revela entidades omitidas. **Test del proceso** (checklist, no redefine la primitiva opm-es): por defecto un sustantivo es **objeto**; para ser **proceso** debe cumplir los **tres** criterios — (1) transforma un objeto, (2) está asociado a tiempo, (3) está asociado a un verbo. Si tras los tres sigue ambiguo, sentido común |
| §9.15 | Sinónimos/homónimos | 1:1 cosa↔nombre canónico; sinónimos → un término; homónimos → cosas separadas. Las variantes de superficie infinitivo↔nominalización (`Verificar Identidad`/`Verificación de Identidad`) PUEDEN coexistir si mapean al **mismo nombre canónico interno**. **Reuso por nombre**: una cosa repetida es **nueva aparición de la misma entidad**, no un nombre nuevo ni una cosa nueva (ver Apéndice F) |
| §9.18 | Co-agentes | ≥2 agentes humanos simultáneos → múltiples enlaces de agente (AND implícito). ✗ agruparlos en "Agent Group" (pierde identidad). Si participan en momentos distintos → descomponer |
| §9.19 | Estado cíclico | un estado PUEDE ser inicial **y** final (ciclo cerrado, ✓ Dishwasher `empty`). ✗ duplicar `empty_start/end` |
| §9.20 | Atributos cuantitativos | declarar unidad + tipo (`Pressure [kPa] {p}`); tipos: boolean/string/integer/float/double/short/long/enumerated; rangos `[0..100]`,`(0..*)`, sub-rango no amplía silenciosamente |
| §9.21 | Cambio de estado vs. cambio de identidad | ¿modelar como **efecto** (mismo objeto, cambia estado) o **consumo+resultado** (nueva identidad)? Criterio: si se puede crear un atributo cuyos valores sean los estados candidatos y tenga sentido → cambio de estado; si no → cambio de identidad. Decisión subjetiva/contextual (dos modeladores pueden diferir legítimamente). *(semántica de enlaces: opm-es; aquí solo el criterio de decisión.)* |
| §9.22 | Objeto específico de estado como alias de referencia | cuando necesitas referenciar "el objeto en estado s" como si fuera entidad aparte, **no dupliques**: deriva un objeto-específico-de-estado (especialización que *refiere al estado de* el original). *(realización textual: opl-es.)* |
| §9.23 | Relaciones n-arias → enlaces binarios | toda relación ternaria o superior (n≥3) se modela como conjunto de enlaces **binarios** (estructurales/procedimentales) o vía un proceso *state-preserving*; OPM enfoca todo en binario. *(Reciprocidad/transitividad de enlaces y propiedades del fork son canon de opm-es/opd-es — referenciar, no copiar.)* |
| §9.24 | Estados de existencia/disponibilidad cualitativa | si una cantidad solo importa como presencia operable, usar estados cualitativos (`no-existente`, `bajo`, `existente`) en vez de atributo numérico. Si el valor alimenta cálculo/simulación, modelar atributo cuantitativo (§A7). No usar `no-existente` como decoración: debe habilitar NOT, creación, arranque, escasez o falla observable |
| §9.25 | Intermedio con uso externo | un "intermedio" producido y consumido dentro de una cadena solo se suprime si no tiene observación ni uso fuera de la cadena (§9.2). Si también alimenta otro proceso, regula el sistema o es producto útil, conservarlo como objeto/producto explícito; esa doble participación puede revelar brechas o requisitos ocultos |
| §9.26 | Control loop explícito | cuando un sistema es adaptable/tunable, no dejar **Sistema de control** como caja muda: explicitar, al nivel adecuado, el patrón `sensado → decisión → salida/señal`, los estados que lee y los procesos/estados que controla. Si el mecanismo es desconocido, marcar brecha en vez de inventarlo |
| §9.27 | Numeración local de pasos/requisitos | números visibles (`0`, `1`, `Req#11`) son etiquetas de navegación o trazabilidad, no identidad ontológica. La identidad vive en el nombre canónico y el id persistente; la numeración local PUEDE ayudar a leer rutas largas, pero no debe sustituir enlaces, orden vertical ni OPL |
| §9.28 | Calibración esencia/afiliación pre-SD | en CPS mixtos, hacer una matriz rápida físico/informacional × sistémico/ambiental con ejemplos canónicos antes del SD reduce discusiones tardías. Es calibración, no sustituto de justificar cada frontera controversial |
| §9.29 | Carriles de valor/soporte | para SoS densos, separar visualmente operandos, procesos de valor, instrumentos de valor, procesos de soporte e instrumentos de soporte ayuda a leer la arquitectura. Es layout metodológico, no nueva primitiva; si distorsiona el dominio, no usarlo |
| §9.30 | Variable CPS: atributo, dato u operando | si una magnitud describe una cosa, modelarla como atributo; si circula por analítica/control, como objeto informacional/dato; si cambia materialmente por el proceso, como transformee. No convertir toda métrica en objeto principal ni todo dato en atributo local |
| §9.31 | Propiedad emergente observable | rugosidad, desgaste, seguridad, eficiencia o carga pueden ser atributos exhibidos por objetos/procesos y a la vez foco de medición/modelado. Si una propiedad emerge de la interacción sistémica, declarar qué procesos la producen, miden o usan |
| §9.32 | Pre/Post condición a contingencia/mensaje | una precondición incumplida no debe quedar como falla muda: modelar contingencia, salto, espera o mensaje informativo según semántica. Una postcondición incumplida exige reparación, escalamiento o señal de error; si falta, el procedimiento está incompleto |
| §9.33 | Estado verificado y memoria de ejecución | en procedimientos, `on` y `on verificado` pueden ser estados distintos si procesos diferentes los escriben/leen. Si la verificación es solo evidencia epistémica o checklist, considerar atributo separado o memoria de ejecución; no mezclar estado físico y estado conocido sin decisión explícita |
| §9.34 | Modelo prospectivo/To-Be | si el OPD describe un prototipo, arquitectura futura o digital twin no desplegado, marcar los hechos como diseño/propuesta y validar utilidad stakeholder por separado de validez OPM. No leerlo como operación real demostrada |
| §9.35 | Instrumento por capacidad vs. herramienta concreta | en modelos transferibles, preferir capacidades instrumentales (`software de simulación`, `escaneo 3D`) a marcas o herramientas locales; en modelos descriptivos, aceptar herramienta concreta si la decisión de alcance lo exige |
| §9.36 | Aspecto transversal cuantificable | seguridad, costo, riesgo, tiempo, energía o usabilidad pueden ser overlays de atributos sobre objetos/procesos. Para compararlos, declarar tipo, unidad, rango, polaridad, función de agregación y umbral; sin eso no hay tradeoff auditable |
| §9.37 | Alternativa de diseño no es estado por defecto | variantes como password de 4 o 6 dígitos, ML o RL, layout A o B suelen ser especializaciones/instancias/configuraciones, no estados del mismo objeto. Usar estado solo si el mismo objeto cambia de valor en el tiempo |
| §9.38 | Stakeholder portador de valor | cuando el valor es organizacional o humano, identificar quién exhibe el atributo de valor. El sistema técnico puede habilitarlo, pero no necesariamente lo posee |

## A6. Control de flujo (compilación; canon en `opl-es` §7)

- **Condición vs espera**: enlace sin `c` → el proceso **espera** (obligatorio); con `c` → se **salta** (opcional). **Skip Semantics Precedence**: si un proceso mezcla enlaces de condición y sin-condición, la **omisión precede a la espera** (si falta cualquier objeto vinculado por condición, el proceso se salta aunque los no-condición estén satisfechos).
- **Evento vs condición**: múltiples eventos = OR (cualquiera dispara); múltiples condiciones = AND para ejecutar, OR para omitir.
- **Temporización**: un objeto tipo **reloj/temporizador** con valor concreto dispara procesos en instantes definidos; los eventos de estado pueden representar eventos temporales (eventos temporizados).
- **Abanicos**: XOR (arco simple) "exactamente m de f"; OR (arco doble) "al menos m de f". XOR probabilístico: probabilidades suman 1.
- **NOT**: estados `existente`/`no-existente` + enlace de instrumento/condición sobre `no-existente`. Realización compacta: un solo **enlace NOT** sobre el estado (`instrument-not`/`event-not`) en vez de N enlaces de condición a los demás estados.
- **Etiquetas de ruta**: desambiguan entrada↔salida; eliminan el AND para previos (solo coexisten los de igual etiqueta).
- **Iteración**: conjunto-miembro (enlaces del mismo tipo a conjunto y a miembro → n iteraciones); bucle por **self-invocation** (el proceso se invoca a sí mismo al terminar) o invocación último→padre, + proceso *Esperar* con restricción de tiempo para intervalos; nodo de decisión booleano.
- **Objeto booleano**: doble estado generado por decisión; cada estado → condición a proceso alterno (si-entonces-sino). n estados sin resultado especificado → 1/n por defecto.
- **Escenario / repertorio**: ruta por la jerarquía; en cada ramificación se materializa exactamente una; el conjunto = repertorio de comportamiento (debe cubrir el abanico XOR completo, no solo el caso feliz).
- **Enlaces con valor**: establecimiento (unidireccional), efecto de valor (bidireccional), par entrada-salida especificado; aplican a **valores** (estados de atributo), no a estados de objeto.

## A7. Cuantitativo · errores · requisitos · simulación (condensado)

- **Tasa** (consumo/generación/efecto) para flujos continuos/multiunidad. **Duración** con distribución para simulación estocástica.
- **Flujo computacional** (5 pasos): atributos con tipo → alias → proceso `{}` → fórmula → enlaces de flujo. Operandos no conmutativos con roles explícitos. Rangos validados con modo **soft** (acepta fuera de rango, marca) vs **hard** (bloquea), configurable por fase (diseño/ejecución/simulación); sub-rango heredado no amplía. Al usar tasa, **crear excepción si la cantidad del consumee/resultee < tasa × duración esperada** (evita consumir más de lo existente).
- **Métrica para tradeoff**: todo atributo usado para elegir diseño **DEBE** declarar unidad/tipo/rango, polaridad (`más es mejor`, `menos es mejor`, `cota obligatoria`, `óptimo interior`), función de agregación y umbral. La polaridad puede invertirse entre medidas de componente y medidas de proceso; no asumir que un número alto siempre mejora.
- **Fórmula como instrumento vs cómputo ejecutable**: en fase conceptual, una ecuación, simulador o modelo ML PUEDE ser objeto informacional/instrumento de un proceso (*Simulating requires Mathematical Equation*). Solo pasar a proceso computacional detallado cuando la fórmula deba ejecutarse, validarse por rango o explicar una decisión de arquitectura.
- **Procedencia de datos**: separar datos empíricos, sintéticos, simulados, declarados e inferidos cuando alimentan predicción o diseño. Un modelo predictivo que usa datos empíricos + sintéticos debe mostrar ambos orígenes o declararlos fuera de alcance.
- **Espacio de estados compuesto** = producto cartesiano de estados de atributos/partes; no todos los puntos son factibles → identificar infactibles por modelado de procesos (no recolapsar; ver LF-01). Precondiciones compuestas: cláusulas XOR numeradas unidas por AND.
- **Errores temporales**: excepción por sobretiempo/subtiempo → manejador que resuelve el afectado en transición a estado permisible (undertime detecta omisión). Sin manejador, el modelo es incompleto para simulación.
- **Requisitos en el modelo**: representar requisitos como objetos informacionales o estereotipo equivalente; mantener catálogo externo como SSOT y traer al OPD solo los requisitos relevantes. Trazabilidad por enlace estructural etiquetado `satisface` (no procedimental), desde objeto/proceso/enlace o desde un conjunto de componentes hacia el requisito.
- **Fuerza epistémica del requisito**: distinguir siempre (a) **norma/requisito prescriptivo** — obliga por fuente externa competente; (b) **requisito declarado de diseño/operación** — decisión del operador o stakeholder; (c) **requisito inferido** — hipótesis explicativa derivada de observaciones/modelo. Un requisito inferido **NO equivale** a norma ni a hecho demostrado: solo gana fuerza al conectarse con estructura, comportamiento y evidencia.
- **Requisitos inferidos en reverse engineering**: en sistemas existentes, los requisitos pueden inferirse desde observaciones, desde otros requisitos (`flow-up`/`flow-down`) o desde comportamiento del modelo. Son hipótesis: deben conectarse con estructura/función downstream o quedar como brecha/predicción; mientras no se validen, no deben presentarse como cumplimiento ni como verdad del dominio.
- **Layering de requisitos**: si un requisito tiene excepciones, bajarlo al contexto específico donde aplica; si no explica toda la arquitectura observada, buscar requisito upstream faltante. No crear requisitos nuevos si la arquitectura ya queda cubierta por los existentes.
- **Brechas y predicciones**: un requisito sin realización observable, una estructura sin requisito que la explique, un intermedio con doble uso o una interfaz crítica no modelada generan una brecha. Cada brecha **DEBERÍA** terminar en predicción testeable, acotación de alcance o dato pendiente.
- **Simulación**: recorrido en profundidad del árbol local; cruce a sub-modelo = transición explícita entre fronteras (no continuación de árbol global). Distinguir simulación conceptual (tokens) de ejecución computacional (fórmulas). Condiciones `c` se simulan como bypass/omisión, no como espera; iteraciones se modelan con invocación/autoinvocación, no con un primitivo `while`.
- **Simulación de configuraciones**: cuando hay variantes vivas, modelar el genérico + especializaciones/instancias seleccionables y comparar configuraciones por matriz de resultados. La simulación apoya decisión; no reemplaza requisitos mínimos, juicio stakeholder ni restricciones normativas.
- **Emergencia**: la arquitectura **DEBE** producir ≥1 capacidad emergente; sin ella, no es un sistema MBSE.

## A8. Invariantes y validación tripartita

**A8.1 Validación tripartita** (mapea al PanelMetodologia de opforja):
1. **Bloqueos estructurales** (CRÍTICA) — firma de enlaces, clases válidas, aciclicidad del árbol, integridad OPD↔OPL. Falla → no avanzar.
2. **Mejoras metodológicas** (ALTA/MEDIA) — claridad ≤20-25, completitud (estructura+comportamiento+función), bimodalidad, refinamiento motivado. Falla → avanzar declarando issue.
3. **Estilo/legibilidad** (BAJA) — tipografía, posicionamiento, etiquetas.

**Prácticas de validación continua** (no solo al cierre):
- **Bimodalidad activa**: tras *cada* edición gráfica, **leer la oración OPL generada** para cazar el enlace mal elegido en el sitio (confundir resultado por efecto, o consumo por instrumento, produce OPL sin sentido — `*Manufactura* consume **Plano**` cuando debía `requiere`). Detectar al crear evita la propagación de costo exponencial y engancha al experto de dominio no técnico. La bimodalidad no es solo invariante (A8.2): es **procedimiento**.
- **Simulación conceptual como compuerta de flujo**: correr la animación de tokens para verificar orden, precondiciones, ramas de condición y bucles **antes** de cualquier cómputo. Repetirla tras cada edición gráfica significativa; si se acumulan cambios antes de simular, el error lógico se vuelve difícil de localizar. Es el modo barato de cazar errores de orden/precedencia; si el orden observado ≠ esperado, revisar alturas de subprocesos y enlaces de control (cf. A3.1). *(Si opforja v0 no anima, la disciplina equivalente es ejecutar el gate tripartito paso a paso, no al final.)*
- **Condiciones y bucles ejecutables en opforja**: una condición incumplida debe verse como paso omitido en la traza; una invocación debe alterar el siguiente proceso observado; una autoinvocación debe repetir hasta que una condición de salida omita o derive la ejecución. Si el bucle no tiene salida, el runtime debe cortar por límite de seguridad con diagnóstico, no colgar la sesión.
- **Validación por niveles**: probar primero fragmentos/OPDs críticos, luego escenarios de sistema. Para configuraciones, ejecutar una matriz de casos representativos antes de convertir una variante en decisión de diseño.
- **Validación stakeholder separada**: un OPD puede ser OPM-válido y no ser útil para decidir. Cerrar modelos prospectivos, task-analysis o digital twin con dos marcas: validez metodológica y adecuación/feedback stakeholder.
- **Ledger de investigación**: en modo reverse/MBRSE, cerrar cada OPD con cuatro preguntas: (1) ¿qué requisito explica esta estructura?, (2) ¿qué estructura satisface este requisito?, (3) ¿qué hecho observado quedó sin explicación?, (4) ¿qué predicción o prueba sale de la brecha? Si las cuatro respuestas son vacías, el OPD probablemente solo documenta, no investiga.

**A8.2 Invariantes nucleares** (índice; autoridad = capa propietaria):

| Invariante | Capa |
|---|---|
| Exactamente un proceso principal por SD | manual |
| Enlace de agente solo a humanos; instrumento solo a no-humanos | opm-es |
| Todo habilitador persiste sin cambio neto | opm-es |
| Sistema exhibe el proceso principal | manual |
| Objetos ambientales con contorno discontinuo | opd-es |
| Consumo/resultado no en contorno exterior de proceso descompuesto | opd-es |
| Todo subproceso ≥1 transformado | manual |
| Bimodalidad: todo OPD tiene párrafo OPL equivalente | opm-es |
| Un hecho aparece en ≥1 OPD | opm-es |
| Estructurales homogéneos (excepción: exhibición-caracterización) | opm-es |
| Pre(P)/Post(P): habilitadores y afectados ∈ Pre∩Post; consumidos solo Pre; resultantes solo Post | opm-es |
| Refinamiento no trivial: descomposición ≥2 subprocesos; despliegue ≥2 refinadores | manual |
| Proceso sin valor funcional directo DEBERÍA ser ambiental | manual |
| Interfaz de sub-modelo congelada tras creación | manual |
| Cada OPD con identificador persistente ≠ etiqueta `SDx.y` | opd-es |
| Referencia inter-modelo explicita propietario y consumidor | opm-es |
| Estado cíclico (inicial+final) válido | manual |
| Salida no-determinista por defecto 1/n | manual |
| Ningún OPD > 20-25 entidades | manual |
| Nombres singulares; 1:1 cosa↔nombre canónico | opl-es / manual |

**Advertencias operativas de auditoría:**
- **Barridos sobre serialización**: ejecutar barridos de integridad sobre el JSON canónico, nunca sobre el OPL. El emisor textual omite entidades sin apariciones; una entidad desconectada puede existir en JSON y ser invisible en la capa textual (verificado en opforja v0).
- **Métrica antes que conclusión**: validar la métrica del barrido contra la SSOT semántica antes de fundar conclusiones. Una regla indiferenciada sobre-acusa (caso paradigmático: LF-19.3 — efecto sin rama es escritor legal).

---

# Frontera rectora (antes del catálogo)

Cuatro operaciones de la familia "estados/altitud" se confunden si no se separan por su **tipo de decisión**:

| Operación | Tipo | Alcance | Propietario |
|---|---|---|---|
| **Dimensionalización** (LF-01) | **ontológica**: cambia *qué es* la cosa (cuántos ejes/atributos) | invariante, **todas** las apariciones | §9.5 + §9.12 |
| **Caracterización** (LF-02) | **realización**: cómo se materializa un eje ya decidido | el OPD donde se aloja | §9.6 + §9.8 |
| **Supresión de estados** (LF-03) | **per-aparición sobre estados**: cambia *qué estados se muestran*, no la identidad | un OPD concreto | §7.5 |
| **Semi-plegado** (LF-05) | **per-aparición sobre partes**: oculta un *subconjunto de partes/atributos* (no estados), compactado dentro del todo | un OPD concreto | opd-es plegado parcial |

Dependencias: **LF-02 presupone LF-01** (primero decides los ejes, luego los realizas). **LF-03 y LF-05 son ortogonales** a la ontología (no cambian identidad) y **entre sí** (LF-03 oculta estados; LF-05 oculta partes; el plegado total de A4.1 oculta el refinador entero — LF-05 es el punto intermedio). El **colapso** es la rama dual de LF-01 (no separar cuando los ejes co-varían), no una lección aparte.

---

# Parte B — Catálogo de lecciones forja

**B.0 Molde LF-NN** (10 campos; cabecera con estado y grafo):
```
### LF-NN — Título · Estado: propuesta|consolidada|supersedida · refina/usa: LF-MM
1. Olor/gatillo — síntoma observable, dominio-agnóstico
2. Principio — la regla en una línea
3. Mecanismo OPM — primitiva canónica; CITA §, no redefine
4. Cuándo NO aplica — exclusiones + frontera vs otras LF
5. Liftea a — regla de norma que certifica el destino (opd-es/opl-es/reglas)
6. Realización opforja — campos/modo/helper del bundle (app v0; puede evolucionar) + OPL esperado
7. Ejemplo {correcto/incorrecto} — bimodal OPD↔OPL; preferir corpus OPM; dominio etiquetado
8. Consecuencia si lo ignoras — qué afirma falsamente el modelo / qué hecho queda invisible
9. Ancla SSOT — capa propietaria: opm-es/opl-es/opd-es/manual §
10. Bitácora — fecha · origen
```

**B.1 Reglas del catálogo.**
- **Grafo, no lista**: morfismos `refina` (caso especial de) y `usa` (sub-paso de). Transitividad heredada.
- **DRY**: ninguna lección reescribe el cuerpo de otra; solo referencia por ID.
- **Admisión (3 gates, en orden)**: (1) **lifteable** — si lo que prohíbe ya lo prohíbe la norma, es norma, no lección (mover/citar, no duplicar); (2) **no-derivable** — si es composición de lecciones existentes, entra como arista (`usa`/`refina`), no como nodo; (3) **reúso ≥2** — patrón visto en ≥2 sesiones/dominios; visto una vez nace `Estado: propuesta`.

---

### LF-01 — Dimensionalización vs colapso de estados ortogonales · Estado: consolidada
1. **Olor/gatillo** — nombre de estado conjuntivo (`X y Z`) o que mezcla adjetivos de ejes distintos; un objeto cuyo abanico de estados no forma una cadena.
2. **Principio** — separar ejes ortogonales en **atributos exhibidos** (cada uno con su state set); **colapsar** cuando co-varían y ningún proceso/norma los distingue.
3. **Mecanismo OPM** — exhibición-caracterización; realiza §9.5 (árbol de decisión de atributos), §9.12 (estados directos vs atributo+valores), §12.8 (espacio de estados compuesto).
4. **Cuándo NO aplica** — máquina **secuencial** (`a→b→c`, cada estado escrito por un proceso en orden) es **un** eje, no producto → no dimensionalizar. No confundir con LF-03 (supresión no cambia identidad).
5. **Liftea a** — `opd-es` (estados, caracterización); homogeneidad de enlaces §9.6 (exhibición admite las 4 combinaciones).
6. **Realización opforja** — el objeto deja de tener estados directos; crear entidades-atributo (`esAtributo:true`, **sin** `valorSlot`) + `estados`; enlace `exhibicion` objeto→atributo; opcional unfold `modo:"exhibicion"`. Auditar alcanzabilidad del producto antes de fijar cardinalidad; cruces inalcanzables → enlaces de condición, no recolapso.
7. **Ejemplo** — ✗`**Colaborador de cuidado** puede estar disponible y competente`. ✓`**Colaborador de cuidado** exhibe **Disponibilidad**, **Competencia** así como **Carga**; **Disponibilidad** puede estar \`disponible\` o \`ausente\`.` *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo afirma falsamente que las combinaciones cruzadas son imposibles; invisibiliza transiciones reales (p.ej. *competente-pero-sobrecargado*).
9. **Ancla SSOT** — `manual` §9.5, §9.12, §12.8; `opm-es` exhibición-caracterización.
10. **Bitácora** — 2026-05-31 · hd-opm M18/§9.10. Regla: `SEPARAR ⟺ (1∧2)∧(3∨4)` · `COLAPSAR ⟺ ¬1∨¬2` (1 alcanzabilidad, 2 transición independiente, 3 proceso lo lee aislado, 4 override normativo). Bifurcación previa producto(AND)/coproducto(XOR).

### LF-02 — Exhibición-caracterización como mecanismo de propiedad · Estado: consolidada · usa: LF-01
1. **Olor/gatillo** — tentación de crear procesos *Tener/Poseer/Asignar* para una propiedad; o colapsar una propiedad ortogonal en estado conjuntivo.
2. **Principio** — una propiedad de una cosa es un **atributo exhibido** (objeto-rasgo con su state set), no un proceso ni un estado conjuntivo.
3. **Mecanismo OPM** — realiza §9.6 (exhibición admite obj-exhibe-atributo, obj-exhibe-operación, proc-exhibe-atributo, proc-exhibe-operación), §9.8 (caracterización con estado especificado), §9.1 (proceso persistente → enlace estructural).
4. **Cuándo NO aplica** — **presupone LF-01**: si hay un solo eje relevante, usar **estados directos** (§9.12), no atributo. No promover a operación (proceso): la dimensión es rasgo, no acción. **Test de operación encapsulada**: un proceso es *operación* (rasgo procedimental "propio") de un objeto B **solo si** no tiene efecto sobre ni requiere ningún objeto fuera de B (solo afecta partes/rasgos/especializaciones de B); si toca algo externo, es un proceso de pleno derecho, no una operación encapsulada.
5. **Liftea a** — `opd-es` exhibición-caracterización; `opl-es` (sentencias `exhibe` + `puede estar`).
6. **Realización opforja** — helper `atributo` (value slot libre) o `atributoEstados` (estados discretos); enlace `exhibicion`; unfold `modo:"exhibicion"` aloja los atributos con estados completos. OPL: `**Obj** exhibe **Attr**.` + `**Attr** de **Obj** puede estar \`v1\`, \`v2\` o \`v3\`.`
7. **Ejemplo** — ✓`**Fetus** exhibits **Developmental Stage**; **Developmental Stage** of **Fetus** can be \`embryo\` or \`baby\`.` *(corpus OPM)*
8. **Consecuencia si lo ignoras** — procesos espurios (*Tener*) inflan el modelo, o atributos colapsados a estados conjuntivos (cae en LF-01).
9. **Ancla SSOT** — `manual` §9.6, §9.8, §9.1, §9.12; `opm-es` relaciones estructurales fundamentales.
10. **Bitácora** — 2026-05-31 · hd-opm M18 (Colaborador → U5 por caracterización).

### LF-03 — Altitud por expresión/supresión de estados per-aparición · Estado: consolidada · ortogonal: LF-01
1. **Olor/gatillo** — SD raíz sobrecargado con ciclos de vida de habilitadores; el mismo objeto debe mostrar su ciclo completo en in-zoom pero solo elegibilidad en la raíz.
2. **Principio** — qué estados se **muestran** es decisión **por OPD**, independiente de cuántos ejes **tiene** la cosa (eso es LF-01).
3. **Mecanismo OPM** — realiza §7.5 (expresión/supresión); `opd-es` V-86..V-90.
4. **Cuándo NO aplica** — **NO** suprimir un estado conectado a un proceso en ese OPD (§7.5). No cambia identidad (no es LF-01).
5. **Liftea a** — `opd-es` V-86..V-90 (supresión per-aparición, derivada, solo en descomposición).
6. **Realización opforja** — `Apariencia.estadosSuprimidos: Id[]` (lista per-OPD); visibilidad efectiva = `Estado.suprimido` global **∧** local (global domina, local refina).
7. **Ejemplo** — SD0 muestra `disponible` (compuerta de elegibilidad); el in-zoom muestra `disponible|ausente` con los procesos que la cambian. *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — o un raíz ilegible (>20-25 cosas), o la dinámica fina desaparece del in-zoom.
9. **Ancla SSOT** — `manual` §7.5; `opd-es` V-86..V-90.
10. **Bitácora** — 2026-05-31 · hd-opm M17.

### LF-04 — Objeto-frontera congelado entre sistemas composables · Estado: consolidada
1. **Olor/gatillo** — un "sistema" que en realidad son varios (red + establecimiento + programa + episodio); dos sub-equipos divergen sobre qué significa una entidad compartida.
2. **Principio** — modelar como sub-modelos composables; la interfaz es un **conjunto mínimo de objetos-frontera** con dueño declarado y estados **congelados**; el consumidor **referencia**, no redefine.
3. **Mecanismo OPM** — realiza §8.2 (contrato de interfaz de sub-modelo) + composición inter-modelo §8.1.
4. **Cuándo NO aplica** — si el sistema es genuinamente uno solo; no congelar una interfaz prematura. La autoridad semántica vive en el modelo propietario.
5. **Liftea a** — `opm-es` composición inter-modelo; invariantes `manual` (interfaz congelada; referencia explícita propietario/consumidor).
6. **Realización opforja** — dos SD0 en el mismo bundle; objetos-frontera como entidades compartidas **sin refinar**; referencia por id persistente; tras crear, no agregar estados/enlaces a la compartida.
7. **Ejemplo** — 4 objetos-frontera congelados entre el sistema clínico (por-episodio) y el sistema-programa (por-institución): **Solicitud**, **Cupo**, **Cartera**, **Episodio**. *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo compuesto se vuelve incoherente; clásico fallo de integración (dos significados de la misma entidad).
9. **Ancla SSOT** — `manual` §8.2, §8.1; `opm-es` composición.
10. **Bitácora** — 2026-05-31 · hd-opm §3.1 (structured cospan).

### LF-05 — Semi-plegado: altitud parcial sobre partes · Estado: consolidada · ortogonal: LF-03
1. **Olor/gatillo** — un todo con muchas partes/atributos satura el OPD, pero plegarlo entero pierde el contexto y dimensionalizar/extraer no corresponde.
2. **Principio** — mostrar un **subconjunto** de partes/atributos compactado *dentro* del todo, con indicador de los ocultos; altitud intermedia entre desplegado-total y plegado-total.
3. **Mecanismo OPM** — realiza el **plegado parcial** (símbolo de colección incompleta) de §A4.1, sobre partes/atributos.
4. **Cuándo NO aplica** — NO es supresión de estados (eso es LF-03); NO cambia identidad (no es LF-01); si la parte debe conectarse *fuera* del todo, **extraerla** (A4.5), no semi-plegarla.
5. **Liftea a** — `opd-es` plegado parcial / colección incompleta.
6. **Realización opforja** — `modoPlegado` por aparición (verificar soporte en opforja v0; en OPCloud es *semi-fold* con contador de partes ocultas y doble-clic para extraer una). OPL refleja "consta de X y N partes más".
7. **Ejemplo** — ✓ mostrar 2 de 8 categorías del **Plan** en un OPD denso, con indicador "…+6"; ✗ plegar el **Plan** entero perdiendo las 2 categorías relevantes a ese OPD. *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — o un OPD ilegible (>20-25), o pérdida total de contexto al plegar el todo.
9. **Ancla SSOT** — `opd-es` §10.12 (semi-plegado, V-116..V-120) y plegado parcial; `manual` §8.1, §7.2 (despliegue parcial/colección incompleta).
10. **Bitácora** — 2026-05-31 · libro Dori cap.21 + transcripciones OPCloud; reúso layout M14/M15/M16.

### LF-06 — Descomposición reactiva por eventos · Estado: propuesta
1. **Olor/gatillo** — subprocesos dentro de una descomposición que NO siguen orden fijo: cada uno se dispara por **su propio evento** (sistema reactivo: vigilancia, urgencia); la Línea de Tiempo vertical no aplica.
2. **Principio** — cuando el orden lo deciden eventos (no el tiempo), modelar cada subproceso activado por su evento desde estados/objetos distintos; no forzar verticalidad temporal.
3. **Mecanismo OPM** — descomposición + enlaces de **evento** a subprocesos (rompe la invocación implícita por línea de tiempo de A3.5).
4. **Cuándo NO aplica** — orden fijo → descomposición síncrona (A3.1); independientes sin orden ni evento → despliegue (A3.2). No confundir con el antipatrón "evento a subproceso no-primero" (A3.4): aquí *cada* subproceso tiene su evento, es legítimo.
5. **Liftea a** — `opd-es` V-59 (evento dentro de descomposición); A3.4 (evento de objeto ambiental cruza el contorno).
6. **Realización opforja** — un enlace de evento por subproceso; verificar render en opforja.
7. **Ejemplo** — ✓ vigilancia 24/7: `deterioro detectado`→*Respuesta clínica*, `falla de equipo`→*Sustitución*, cada uno por su evento, sin orden vertical. *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — se impone una secuencia vertical falsa a procesos reactivos; el modelo miente sobre el orden de ejecución.
9. **Ancla SSOT** — `opd-es` V-59, §9.3 (activación asincrónica por eventos — patrón reactivo).
10. **Bitácora** — 2026-05-31 · opm-visual-es §9.3. **`propuesta`**: reúso≥2 no demostrado (solo caso HODOM); consolidar al segundo avistamiento.

### LF-07 — Requisito inferido como sonda de completitud · Estado: propuesta
1. **Olor/gatillo** — una arquitectura rica no tiene requisitos que la expliquen, o un requisito inferido no encuentra estructura/proceso/enlace que lo satisfaga.
2. **Principio** — en reverse engineering, el requisito inferido es una **sonda**: si conecta con estructura y comportamiento, aumenta comprensión; si no conecta, revela brecha, mala altitud o requisito mal ubicado.
3. **Mecanismo OPM** — objeto informacional **Requisito** + enlace estructural etiquetado `satisface`; catálogo externo como SSOT de requisitos; aplica A7.
4. **Cuándo NO aplica** — no convertir toda observación en requisito; no duplicar requisitos ya cubiertos; no usar requisitos para justificar una arquitectura inventada sin observación.
5. **Liftea a** — `opm-es` objetos informacionales + relaciones estructurales; A7 requisitos/brechas.
6. **Realización opforja** — principio independiente de herramienta: hacer visible la traza requisito↔realización sin convertirla en procedimiento. En opforja, usar la representación disponible más simple (objeto informacional, estereotipo o traza externa) y preservar ids persistentes; si una capacidad no existe, el principio sigue vigente en el catálogo/metadatos.
7. **Ejemplo** — en glicólisis, `Req#11: Glycolysis shall be controllable...` se satisface localmente por **Sistema de control de hexoquinasa** y luego se replica por trazas a componentes de control derivados. *(Glicólisis, Fig. 7, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo describe piezas pero no explica por qué existen; las brechas quedan invisibles y las predicciones no se pueden auditar.
9. **Ancla SSOT** — A7; `opm-es` relaciones estructurales; realización OPCloud de requisitos como objeto informacional.
10. **Bitácora** — 2026-05-31 · revisión paper/capturas glicólisis (Fudge & Reeves 2024, Fig. 7). **`propuesta`** por un caso externo; consolidar al segundo uso no-HODOM o al integrar soporte nativo en opforja.

### LF-08 — Interfaz crítica incorporada como paso 0 · Estado: propuesta · usa: LF-07
1. **Olor/gatillo** — un proceso se trata como externo porque precede al "proceso clásico", pero controla la entrada, tasa, disponibilidad o variante de todo el sistema.
2. **Principio** — si una frontera determina el comportamiento del sistema, modelarla como subsistema/interfaz **dentro** del in-zoom pertinente, incluso como paso `0`, y no como mero instrumento ambiental.
3. **Mecanismo OPM** — descomposición de proceso (A3.1) + objetos frontera/interfaz; el paso 0 es etiqueta local, no identidad.
4. **Cuándo NO aplica** — si la frontera solo habilita sin cambio neto ni control de flujo, mantenerla como instrumento/condición ambiental; si pertenece a otro sistema propietario, usar objeto-frontera o sub-modelo (LF-04), no apropiación silenciosa.
5. **Liftea a** — A3.4 migración de enlaces al descomponer; A4.3 importancia=altitud; A7 requisitos de interfaz.
6. **Realización opforja** — principio independiente de herramienta: elevar la interfaz crítica al OPD donde explica comportamiento. En opforja, representarla con primitivas OPM ordinarias; el rótulo `0` es solo navegación local. Si la herramienta no soporta algún gesto visual, el principio se conserva mediante nombre, OPL y trazabilidad.
7. **Ejemplo** — en glicólisis, *Transporte de glucosa* se incorpora como paso `0` del modelo de glicólisis porque la tasa/variante de transporte explica control y fenómenos posteriores. *(Glicólisis, Fig. 6, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo pierde el punto de control más importante y explica mal las variaciones del sistema; las predicciones sobre regulación quedan desconectadas.
9. **Ancla SSOT** — A3.1, A3.4, A4.3, LF-04.
10. **Bitácora** — 2026-05-31 · revisión paper/capturas glicólisis (Fudge & Reeves 2024, Fig. 6). **`propuesta`**; comparar con interfaces HODOM/red antes de consolidar.

### LF-09 — Intermedio dual como producto/conector · Estado: propuesta · usa: LF-07
1. **Olor/gatillo** — una cadena lineal llama "intermedio" a objetos que además alimentan otros procesos, regulan el sistema o son productos útiles para otro nivel.
2. **Principio** — un intermedio con uso externo no es transiente: conservarlo como objeto/producto explícito y dejar que sus enlaces revelen doble rol.
3. **Mecanismo OPM** — resultado/consumo/efecto según corresponda; contradice la supresión por §9.2 solo cuando hay observación externa o función adicional.
4. **Cuándo NO aplica** — si el objeto se crea y consume de inmediato sin observación ni uso externo, aplicar §9.2 (objeto transiente → invocación). Si el uso externo es conjetura, marcar predicción/brecha, no hecho.
5. **Liftea a** — §9.2, §9.21, A7 brechas/predicciones.
6. **Realización opforja** — principio independiente de herramienta: conservar el intermedio cuando su doble uso explica arquitectura o abre una brecha. En opforja, expresarlo con el mínimo de objetos/enlaces necesarios y registrar la hipótesis fuera del nombre canónico; si la herramienta no soporta una vista compacta, la decisión metodológica no cambia.
7. **Ejemplo** — en glicólisis, varios metabolitos intermedios también son productos biosintéticos; el caso de `2PG` queda como predicción de funcionalidad adicional. *(Glicólisis, Fig. 6, ilustrativo)*
8. **Consecuencia si lo ignoras** — se borra el acoplamiento entre subsistemas, se pierden productos reales y no emergen brechas de conocimiento.
9. **Ancla SSOT** — §9.2, §9.21; A7.
10. **Bitácora** — 2026-05-31 · revisión paper/capturas glicólisis (Fudge & Reeves 2024, Fig. 6 y conclusión). **`propuesta`**.

### LF-10 — Control loop explícito: sensar, decidir, señalizar · Estado: propuesta · usa: LF-07
1. **Olor/gatillo** — aparece un **Sistema de control** o una capacidad "tunable/adaptable" sin mecanismos observables que lean estado, decidan y actúen.
2. **Principio** — descomponer el control en el trípode mínimo **sensado → decisión → salida/señal**, con los estados leídos y los procesos/estados controlados.
3. **Mecanismo OPM** — descomposición/despliegue según el caso; procesos si transforman información/estado, atributos exhibidos si son capacidades estructurales del controlador; enlaces de condición/evento/instrumento según firma.
4. **Cuándo NO aplica** — si el control es una restricción estática, usar atributo/estado; si el mecanismo es desconocido, declarar brecha; si el controlador pertenece a otro sistema, tratarlo como interfaz/sub-modelo.
5. **Liftea a** — A6 control de flujo; §9.26; A7 requisitos/brechas.
6. **Realización opforja** — principio independiente de herramienta: no dejar el control como caja muda cuando el objetivo es explicar adaptabilidad. En opforja, plasmar solo el nivel de sensado/decisión/salida que tenga evidencia o hipótesis declarada; si no se puede representar algún detalle, mantenerlo como brecha antes que inventarlo.
7. **Ejemplo** — en glicólisis, **Sistema de control** lee estados de glucosa/oxígeno/ATP/precursores, ejecuta *Toma de decisión* y emite **Salida de señal** que controla biosíntesis, metabolismo aeróbico y anaeróbico. *(Glicólisis, Fig. 6, ilustrativo)*
8. **Consecuencia si lo ignoras** — la adaptabilidad queda como palabra, no como arquitectura; no se puede localizar la falla de feedback ni derivar predicciones testeables.
9. **Ancla SSOT** — A6, A7, §9.14, §9.26.
10. **Bitácora** — 2026-05-31 · revisión paper/capturas glicólisis (Fudge & Reeves 2024, Fig. 6-7). **`propuesta`**.

### LF-11 — OPDs-lente del SD antes del SD integrado · Estado: propuesta
1. **Olor/gatillo** — la conversación de SD mezcla propósito, función, enablers, entorno y problema; el stakeholder valida una parte y rechaza otra sin que el modelador sepa dónde está la fricción.
2. **Principio** — construir vistas-lente parciales del SD para elicitar y revisar cada componente, y recién después componer el SD integrado.
3. **Mecanismo OPM** — OPDs auxiliares con primitivas ordinarias; no son refinamientos canónicos salvo que el árbol formal los adopte con una pregunta de refinamiento explícita.
4. **Cuándo NO aplica** — si el SD es simple y estable, no fragmentar; si el lente se vuelve fuente de verdad separada, integrarlo o descartarlo.
5. **Liftea a** — A2.4; A8 validación stakeholder; `opm-es` equivalencia OPD↔OPL cuando el lente se vuelve modelo.
6. **Realización opforja** — principio independiente de herramienta: usar el lente como andamiaje de método y preservar solo hechos integrados en el modelo canónico. En opforja puede representarse como OPD temporal o como nota externa; no depende de una función específica.
7. **Ejemplo** — en FPP, Purpose, Function, Enablers, Environment y Problem Occurrence se trabajan por separado antes de integrar el SD del prototipo de digital twin. *(FPP, ilustrativo)*
8. **Consecuencia si lo ignoras** — el SD captura una mezcla plausible pero no auditada; las discrepancias de stakeholder quedan ocultas como discusiones de layout.
9. **Ancla SSOT** — A2, A8; `urn:fxsl:kb:icas-procesos` (viewpoints y composición vertical) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/fpp`. **`propuesta`** por caso externo único.

### LF-12 — Task analysis humano-máquina como modelo procedimental verificable · Estado: propuesta
1. **Olor/gatillo** — una tarea crítica se documenta como lista humana o arquitectura técnica, pero no como sistema conjunto con feedback, decisiones, pre/postcondiciones y recuperación.
2. **Principio** — modelar humano + tecnología + procedimiento en un solo OPM cuando la seguridad o ejecución depende de su coordinación.
3. **Mecanismo OPM** — SD socio-técnico; agente humano ambiental/sistémico según frontera; instrumentos técnicos; estados de verificación; in-zoom procedimental; simulación conceptual.
4. **Cuándo NO aplica** — tareas triviales o documentación sin necesidad de verificación; dominios donde el humano solo recibe un resultado y no co-ejecuta la operación.
5. **Liftea a** — A1.4, A2.2, A3.1, A8; LF-10 cuando hay feedback/control.
6. **Realización opforja** — principio independiente de herramienta: plasmar el procedimiento con primitivas OPM y validar flujo. En opforja usar OPL, revisión visual y gates disponibles; no prometer animación ni monitoreo runtime si la herramienta no lo soporta.
7. **Ejemplo** — en el caso ISS/EVA, tripulación, estación robótica, brazo, estados de sistema, mensajes de error y procedimientos aparecen en un solo modelo task-analysis. *(48384, ilustrativo)*
8. **Consecuencia si lo ignoras** — la responsabilidad humano-máquina queda partida entre documentos; fallas de coordinación, orden o feedback no emergen en el modelo.
9. **Ancla SSOT** — A1.2 socio-técnico, A3.1, A6, A8.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/48384`. **`propuesta`**.

### LF-13 — Pre/Post condición como generador de contingencia · Estado: propuesta · usa: LF-12
1. **Olor/gatillo** — un subproceso tiene precondiciones/postcondiciones críticas, pero el OPD solo muestra el caso feliz o una excepción genérica.
2. **Principio** — cada precondición o postcondición crítica incumplida debe terminar en contingencia, espera, salto, mensaje, reparación o brecha explícita.
3. **Mecanismo OPM** — enlaces de condición/evento/instrumento, estados de existencia/verificación, procesos de manejo de disrupción, mensajes informacionales como resultado o efecto.
4. **Cuándo NO aplica** — condiciones triviales sin efecto de decisión; análisis de alto nivel donde la contingencia se declara fuera de alcance. Si se omite por alcance, debe quedar anotado.
5. **Liftea a** — A6, A7 errores, A8 simulación conceptual; §9.32.
6. **Realización opforja** — principio independiente de herramienta: no dejar fallas críticas como silencio semántico. En opforja, usar los enlaces y estados disponibles más simples; si el detalle excede el nivel, registrar la brecha.
7. **Ejemplo** — en OPM-TA, precondición impropia genera contingencia o mensaje informativo; postcondición impropia genera mensaje/reparación. *(48384, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo simula un procedimiento que solo funciona cuando todo sale bien y no puede explicar recuperación ni error humano-máquina.
9. **Ancla SSOT** — A6, A7, A8; `urn:fxsl:kb:icas-calidad-riesgo` (resiliencia como recuperación) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/48384`. **`propuesta`**.

### LF-14 — Ruta primaria y carriles de valor/soporte · Estado: propuesta
1. **Olor/gatillo** — una arquitectura SoS/CPS densa muestra muchos componentes y procesos, pero no se distingue qué transforma valor, qué soporta y qué queda contextual.
2. **Principio** — separar operandos, procesos de valor, instrumentos de valor, soporte e interfaces/contexto; luego extraer una ruta primaria antes de profundizar.
3. **Mecanismo OPM** — layout/vista metodológica + descomposición o simplificación A4.5 para la ruta que efectivamente entra al árbol formal.
4. **Cuándo NO aplica** — sistemas pequeños o dominios donde forzar "valor/soporte" oculta agencia, cuidado, gobernanza o red. No convertir carriles en semántica OPM.
5. **Liftea a** — A4.6, §9.29, A4.5; LF-08 si la interfaz crítica debe entrar al in-zoom.
6. **Realización opforja** — principio independiente de herramienta: usar carriles como lectura y selección de altitud. En opforja, el resultado debe expresarse como OPD normal; no depende de swimlanes nativos.
7. **Ejemplo** — en blockchain-CPS, la arquitectura separa operandos y procesos/instrumentos de valor/soporte, luego extrae la vía `Collecting → Monitoring → Processing → Optimizing → Adjusting`. *(block, ilustrativo)*
8. **Consecuencia si lo ignoras** — el OPD denso se vuelve inventario de piezas y no explica la cadena de valor ni las fronteras de soporte.
9. **Ancla SSOT** — A4.1 vistas no ontológicas, A4.5, A4.6; `urn:fxsl:kb:icas-escala` (SoS y boundary objects) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/block`. **`propuesta`**.

### LF-15 — Intención-función-forma para alternativas morfológicas · Estado: propuesta
1. **Olor/gatillo** — se modelan tecnologías candidatas en el SD antes de declarar qué función solution-neutral cumplen.
2. **Principio** — mantener intención y función separadas de la forma; especializar formas solo después de fijar la función que realizan.
3. **Mecanismo OPM** — generalización-especialización para alternativas de forma; enlaces estructurales etiquetados o vistas de contribución para intención/atributos de desempeño; SD agnóstico mientras haya opciones.
4. **Cuándo NO aplica** — arquitectura ya decidida y objetivo descriptivo; o una tecnología impuesta por norma/contrato, en cuyo caso declararla como requisito prescriptivo/declarado, no como inferencia.
5. **Liftea a** — A0.1, A0.2, A0.3, §9.13, A7 fuerza epistémica.
6. **Realización opforja** — principio independiente de herramienta: preservar alternativas sin mezclar función con implementación. En opforja, usar gen-spec y trazas simples; si el espacio combinatorio crece, pasar a LF-16.
7. **Ejemplo** — en blockchain-CPS, `Computing`, `Connecting`, `Controlling` se mantienen como funciones, mientras `AI Model`, `Smart Contract` o `Blockchain` son formas especializadas. *(block, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo sobrepromete una solución y pierde la comparación de arquitecturas; los requisitos inferidos se confunden con decisiones de diseño.
9. **Ancla SSOT** — A0, §9.13, A7; `urn:fxsl:kb:icas-procesos` (diseño como factorización Needs→Architecture→Capabilities) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/block`. **`propuesta`**.

### LF-16 — Configuración como selección de instancias para tradeoff · Estado: propuesta
1. **Olor/gatillo** — hay variantes del mismo objeto/proceso y se quiere elegir por seguridad, costo, tiempo, riesgo u otro atributo de desempeño.
2. **Principio** — representar el modelo genérico y las variantes como especializaciones/instancias configurables; comparar configuraciones por métricas declaradas.
3. **Mecanismo OPM** — generalización-especialización o clasificación-instanciación; multiplicidad/selección como decisión de configuración; A7 métricas y simulación de configuraciones.
4. **Cuándo NO aplica** — variantes irrelevantes para la decisión; espacios combinatorios enormes sin criterio de poda; restricciones normativas que fijan una única opción.
5. **Liftea a** — §9.37, A7 simulación de configuraciones, A8 validación por niveles.
6. **Realización opforja** — principio independiente de herramienta: conservar alternativas vivas hasta compararlas. En opforja puede realizarse con especializaciones, instancias o catálogo externo; la herramienta no necesita enumerar automáticamente todas las combinaciones para que el principio aplique.
7. **Ejemplo** — en IoT security, `4-Digit Password` y `6-Digit Password` son alternativas configurables de `Entered Password`, evaluadas por nivel de seguridad del proceso. *(securing, ilustrativo)*
8. **Consecuencia si lo ignoras** — las variantes quedan como estados falsos o decisiones prematuras; el tradeoff no es reproducible.
9. **Ancla SSOT** — §9.13, §9.20, A7, A8; `urn:fxsl:kb:icas-calidad-riesgo` (quality attributes dependen de configuración) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/securing`. **`propuesta`**.

### LF-17 — Aspecto transversal cuantificable como overlay gobernado · Estado: propuesta · usa: LF-02, LF-16
1. **Olor/gatillo** — seguridad, costo, riesgo, energía o usabilidad se tratan como documento aparte o como requisito plano sin relación con objetos/procesos.
2. **Principio** — un aspecto transversal puede modelarse como atributos exhibidos por objetos/procesos y procesos de cálculo/agregación, con polaridad y umbral declarados.
3. **Mecanismo OPM** — exhibición-caracterización; atributos cuantitativos; proceso computacional; trazas estructurales a requisitos/criterios de decisión.
4. **Cuándo NO aplica** — si el aspecto es puramente cualitativo en el alcance; si la métrica no tiene interpretación acordada; si la norma fija mínimos, esos mínimos siguen siendo prescriptivos y no se negocian por tradeoff.
5. **Liftea a** — LF-02, §9.36, A7 métrica para tradeoff.
6. **Realización opforja** — principio independiente de herramienta: gobernar el overlay como método, no como dependencia de estereotipos de una plataforma. En opforja, usar atributos, aliases/metadatos o catálogo externo; no redefinir primitivas.
7. **Ejemplo** — en IoT security, medidas de seguridad y procesos exhiben niveles cuantitativos agregados para comparar configuraciones. *(securing, ilustrativo)*
8. **Consecuencia si lo ignoras** — los atributos de calidad quedan invisibles o se convierten en claims no auditables; comparar diseños se vuelve opinión.
9. **Ancla SSOT** — LF-02, A7, §9.36; `urn:fxsl:kb:icas-calidad-riesgo` (quality attributes como funtores de medición) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/securing`. **`propuesta`**.

### LF-18 — Pipeline predictivo empírico-sintético para digital twin · Estado: propuesta · usa: LF-10
1. **Olor/gatillo** — un modelo digital twin/ML mezcla operación física, datos empíricos, simulación, datos sintéticos y predicción sin trazabilidad de procedencia.
2. **Principio** — separar proceso físico, producción de datos empíricos, simulación/datos sintéticos y modelado predictivo; declarar qué dato alimenta qué decisión.
3. **Mecanismo OPM** — procesos físicos e informacionales en un mismo in-zoom; objetos informacionales de datos/modelos; ecuaciones/simuladores como instrumentos o procesos computacionales según A7.
4. **Cuándo NO aplica** — sistemas sin uso predictivo; simulación conceptual sin datos; ML usado como caja externa fuera de alcance. Si la fuente de datos es desconocida, marcar brecha.
5. **Liftea a** — A1.4, A7 procedencia de datos, §9.30, §9.31, LF-10 si hay control adaptativo.
6. **Realización opforja** — principio independiente de herramienta: distinguir procedencia y rol de cada dato. En opforja, usar objetos informacionales y enlaces OPM simples; no detallar algoritmos si no afectan la arquitectura.
7. **Ejemplo** — en torneado optimizado, *Machining* produce datos empíricos, *Simulating* produce datos sintéticos, y *Modeling* requiere ambos para predecir rugosidad/desgaste. *(SE_8233, ilustrativo)*
8. **Consecuencia si lo ignoras** — el digital twin parece una caja predictiva sin evidencia; no se puede auditar si una predicción viene de medición, simulación o supuesto.
9. **Ancla SSOT** — A7, A8, §9.30, §9.31; `urn:fxsl:kb:icas-procesos` (trazabilidad vertical) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión `/home/felix/_TEMP_BORRAR/usos-opm/SE_8233` y contraste con `/fpp`. **`propuesta`**.

### LF-19 — Integridad de estados: flujo, caracterización, ambiental-observado · Estado: consolidada · usa: LF-01, LF-03
1. **Olor/gatillo** — auditoría acusa estados sin escritor, estados caracterizadores o estados ambientales usando una sola regla indiferenciada.
2. **Principio** — toda entidad con estados pertenece a una de tres categorías: **flujo**, **caracterización** o **ambiental-observado**; cada una debe una prueba distinta al modelo.
3. **Flujo** — la entidad transiciona como transformee; exige escritor. La rama explícita entrada→salida o resultado-con-estado solo es obligatoria cuando el veredicto importa; efecto o resultado sin rama es escritor legal con resolución dinámica.
4. **Caracterización** — valores asignados al clasificar, no transiciones. Exige declaración explícita y auditable en la glosa de la entidad de que el state-set es caracterización (valores asignados al clasificar, no flujo); sin declaración auditable, acusar por defecto.
5. **Ambiental-observado** — estados de entidades o atributos que cambia la realidad. Sin escritor sistémico es legítimo: el sistema lee; si constata la transición, declarar escritor-constatador excepcional y nominar fuente del dato en la glosa.
6. **Mecanismo OPM** — flujo usa enlaces transformadores; caracterización usa atributo+valores; ambiental-observado aplica herencia de afiliación y frontera sistémica/ambiental.
7. **Cuándo NO aplica** — no convertir un value-set en proceso; no exigir escritor sistémico a lo ambiental leído; no exigir rama explícita cuando la semántica de salida por defecto/probabilidad resuelve el destino.
8. **Liftea a** — A8 barridos de integridad; LF-01 decide cuándo dimensionalizar; LF-19 decide qué debe cada estado una vez que existe.
9. **Realización opforja** — convención de glosa del bundle para la declaración de caracterización (punto 4): literal estandarizado `Coproducto XOR-n ...` al inicio de la glosa de la entidad, parseable por el barrido de integridad (convención local hd-opm/Mesa 7; cualquier realización equivalente vale si el barrido la reconoce).
10. **Ancla SSOT** — `opm-iso-19450-es.md` §Enlaces transformadores con estado especificado / §Resolución de salida en efecto con solo estado de entrada, §Glosario (`Valor de atributo`) + §Valores de atributos, §Propiedades genéricas (`Herencia de afiliación`). El canon no prohíbe estados sin escritor: esta es disciplina de forja con autoridad de mesa, no ley ISO.
11. **Bitácora** — 2026-06-05 · origen: Mesa 7 hd-opm, consenso 3-0; plasmada localmente y verificada por barrido antes de ascender a metodología agnóstica.

---

# Apéndice F — Realización opforja (bundle `deep-opm-pro.modelo.v0`)

El intercambio con la herramienta usa el documento JSON `{ "formato": "deep-opm-pro.modelo.v0", "modelo": {...} }`. Núcleo del modelo tipado (lo que el método produce):

- **entidades** — `{id, tipo: objeto|proceso, nombre, esencia: fisica|informacional, afiliacion: sistemica|ambiental, descripcion?, esAtributo?, valorSlot?, refinamientos?}`. Atributo discreto: `esAtributo:true` **sin** `valorSlot` + estados.
- **estados** — `{id, entidadId, nombre, esInicial?, esFinal?, designaciones?, suprimido?}`. La app no acepta un único estado (≥2). Supresión **global** vía `suprimido`; supresión **per-aparición** vía `Apariencia.estadosSuprimidos[]` (LF-03).
- **enlaces** — `{id, tipo, origenId, destinoId, etiqueta?, estadoEntradaId?, estadoSalidaId?, multiplicidadDestino?}`. Tipos: `exhibicion`, `agregacion`, `agente`, `instrumento`, `efecto`, `resultado`, `consumo`, `invocacion`, `etiquetado`, etc.
- **refinamientos** (en la entidad) — `descomposicion: {opdId}` (in-zoom, contorno) | `despliegue: {opdId, modo: agregacion|exhibicion|generalizacion|clasificacion}` (unfold).
- **apariciones** (por OPD) — `{id, entidadId, opdId, x, y, width, height, contextoRefinamiento?, estadosSuprimidos?}`.
- **opds** — `{id, nombre, padreId, apariencias, enlaces, ordenLocal?}`. Árbol por `padreId`.

**Reglas de realización.** Nombres idénticos entre OPD/OPL/bundle. Toda referencia entre OPDs internamente consistente o la app rechaza el import. Omitir campos opcionales antes que inventarlos (la app normaliza). No emitir `formato` distinto. Exportación = instantánea, no fuente de verdad.

**Divergencias OPL operativas.** La autoridad viva sobre realización OPL y su trazabilidad es `urn:fxsl:kb:spec-forja-opl-es` §20. Este método no mantiene un inventario paralelo: al emitir bundles, delegar toda duda de generación, parseo o roundtrip a esa spec. Estado sincronizado 2026-06-04: el catálogo cubierto por fixtures OPL queda en bisimetría estricta; las exclusiones vivas son modificadores complejos, rutas, refinamientos y abanicos avanzados según el catálogo de fixtures.

**Auto-normalización verificada.** La app normaliza al hidratar (omitir campos opcionales antes que inventarlos). Esencia: conectar un objeto como atributo (exhibición-caracterización) tiende a coaccionarlo a **informacional**; el enlace de **agente** solo se ofrece desde cosas físicas (humanas) — dejar que la UI normalice en vez de pelear con ella. *(Verificar el alcance exacto de la coerción en la versión vigente de opforja.)*

## F.1 Capacidades-objetivo (OPCloud — ⚠ NO verificadas en opforja v0)

Técnicas observadas en **OPCloud** (la herramienta de referencia OPM, análoga a opforja). Se listan como **capacidad-objetivo / aspiracional**, NO como features operables de opforja v0 — **verificar disponibilidad antes de instruir sobre ellas** (anti-magia). Mapean a secciones del método indicadas:

- **OPL-pane bidireccional** (editar el modelo desde el texto: doble-clic en nombre/enlace abre su editor). → A8 bimodalidad.
- **Construir abanico XOR/OR arrastrando el enlace al mismo puerto** ya enlazado; sacarlo lo rompe. → A6.
- **Distribuir/recolectar enlace del contorno** a todos los subprocesos con un botón. → A3.4.
- **Resolver booleano de decisión** de 4 formas: estado fijo (enlace a estado) / 50-50 (a objeto) / función computacional / porcentajes explícitos. → A6.
- **Split input/output link**: transición *hacia*/*desde* un estado no especificado. → A3.4.
- **Ontología de organización** con enforcement none/suggest/enforce (term canónico + sinónimos). → §9.15 (alto valor para corpus con glosario canónico).
- **Requisitos**: satisfied-requirement-set sobre cosas y enlaces; *requirement views* read-only auto-generadas; estereotipo de requisito (id, descripción, hard/soft, actor). → A7 `satisface`.
- **Grilla** para alinear alturas de subprocesos (paralelismo/secuencia precisos). → A3.1.
- **Análisis de modelo**: informativity grading (clasifica OPL, detecta precedencias/in-out faltantes), missing-knowledge identification (ML, umbral de confianza), generación de requisitos por IA. → mecaniza A8.
- **Sub-modelo** (realización de LF-04): gesto "connect submodel" sobre el thing mínimo (1 objeto + 1 proceso por exhibición e instrumento; **un solo proceso**; sin refinar); nombre `<main> <sub>` controlado desde el padre; lazy-load; tres estados de sync (descargado / cargado-sincronizado / cargado-no-sincronizado); compartidas se ven transparentes; desconectar es irreversible y en ambos lados.

## F.2 Runtime opforja — condiciones y bucles (estado verificado 2026-06-03)

Realización canónica implementada en `deep-opm-pro` sin copiar gestos OPCloud ni añadir primitiva OPM:

- **Condición `c`** sobre consumo, efecto, agente o instrumento: si el objeto/estado condicionante no existe o no está vigente, la traza marca el proceso como `omitido`, no aplica transiciones/cambios/duración/salidas y avanza al siguiente paso secuencial.
- **Múltiples condiciones**: AND para ejecutar; OR para omitir. La omisión por condición precede a cualquier espera o diagnóstico por precondición no condicional.
- **Invocación explícita** `Proceso → Proceso`: al terminar el proceso origen, la simulación salta al proceso destino como siguiente paso lógico.
- **Autoinvocación**: se ejecuta como bucle por invocación al mismo proceso. El bucle terminal canónico usa una condición/decisión que, al fallar, omite el proceso y permite salir. Un límite de seguridad bloquea bucles sin salida y deja diagnóstico runtime.
- **Limitación conocida**: la ausencia de objetos sin estados no se infiere todavía como token consumible; para expresar ausencia/presencia ejecutable usar estados explícitos `existente`/`no-existente` o estado específico del objeto condicionante.
- **Artefactos ejecutables**: `app/src/modelo/simulacion/runner.ts`, `app/src/modelo/simulacion/integracionHechos.ts`, `app/src/modelo/simulacion/runner.test.ts`, `app/src/leyes/integracion-ss-fs.test.ts`.

---

## Bitácora del artefacto

| Fecha | Cambio |
|---|---|
| 2026-05-31 | v1.0.0 — destilación korificada autónoma del manual metodológico (v3.0.0) + LF-01..LF-04 + realización opforja. Forjado por la mesa Asto·Besto·Resto (hd-opm). Enmiendas integradas: precedencia por planos ortogonales + lifting (Besto), invariante de pureza OPM (Asto), frontera ontológica/per-aparición + campo "cuándo no aplica" (Resto), grafo de lecciones + 3 gates de admisión (Besto), molde de 10 campos + "consecuencia si lo ignoras" (Asto). |
| 2026-05-31 | v1.1.0 — barrido de 6 fuentes (3 capas SSOT iso/opl/visual, libro Dori 24 cap, curso atómico, transcripciones OPCloud) por 4 revisores; 25 clusters adjudicados por la mesa Asto·Besto·Resto. **Nuevo**: §A0 fase pre-SD (≥3 conceptos + función-vs-comportamiento); A2.3 nombrado (escala gerundio/nominalización, nombrar agregados) + esencia por defecto; A3.3 descomposición de objeto espacial-2D + alcance inner/outer; A3.4 precedencia al abstraer (puntero a opd-es §13, sin copiar matriz) + migración al primer subproceso; A3.1/A4.2/A4.3 notas (orden vertical semántico, banda 5-10 niveles, importancia=altitud); §9.14 test del proceso (3 criterios), §9.21 estado-vs-identidad, §9.22 objeto-específico-de-estado, §9.23 n-arias→binarias; A6 temporización/self-invocation/NOT compacto/skip>wait; A7 excepción cantidad<tasa×duración + rango soft/hard; A8 bimodalidad activa + simulación conceptual como gate; **LF-05 semi-plegado** (consolidada), **LF-06 descomposición reactiva** (propuesta); LF-02 test de operación encapsulada; Apéndice F.1 capacidades-objetivo OPCloud (rotuladas no-verificadas, anti-magia). Rechazados por la mesa como semántica/visual pura (quedan en su capa): matriz de precedencia completa, reciprocidad/transitividad, propiedades del fork, relatividad de instancia. |
| 2026-05-31 | v1.2.0 — revisión profunda de paper/capturas glicólisis (Fudge & Reeves 2024, Fig. 5-7) como práctica real OPM/OPCloud. **Nuevo**: A1.3 modo reverse/MBRSE observación→requisito→modelo→brecha→predicción; §9.24 estados de existencia/disponibilidad cualitativa; §9.25 intermedio con uso externo; §9.26 control loop explícito; §9.27 numeración local; A7 expandido para requisitos inferidos, layering, brechas y predicciones; A8 ledger de investigación; **LF-07 requisito inferido como sonda**, **LF-08 interfaz crítica como paso 0**, **LF-09 intermedio dual**, **LF-10 control loop explícito** (todas propuestas por caso externo único, pendientes de consolidación por reúso). |
| 2026-05-31 | v1.2.1 — ajuste de mesa Asto·Besto·Resto: A7 distingue requisito normativo/declarado/inferido y bloquea tratar inferencias como norma o hecho demostrado; LF-08/LF-09/LF-10 declaran `usa: LF-07`; campo de realización reformulado como principio metodológico general, adaptado a opforja pero no dependiente de capacidades específicas de la herramienta. |
| 2026-05-31 | v1.3.0 — revisión profunda y paralelizada de cinco casos OPM reales: OPM-TA humano-máquina (`48384`), blockchain/AI CPS (`block`), digital twin FPP (`fpp`), torneado optimizado/DT (`SE_8233`) y seguridad IoT configurable (`securing`). **Nuevo/refinado**: A0.3 intención→función→forma; A1.4 modos de aplicación real; A2.1 degradación como atributo medido; A2.4-A2.6 lentes SD, anti-función y beneficio stakeholder; A3.1 límite práctico de ~5 subprocesos procedimentales; A3.3 guard vista vs mecanismo; A4.6 viewpack arquitectónico; §9.28-§9.38; A7 métricas con polaridad, fórmula como instrumento, procedencia de datos y simulación de configuraciones; A8 simulación tras edición significativa, validación por niveles y validación stakeholder; **LF-11..LF-18** como propuestas. Mesa: no elevar extensiones de herramienta ni decisiones de caso a norma OPM; todos los principios quedan como método lifteable y general, con opforja solo como adaptación. |
| 2026-06-03 | v1.4.0 — A0.4 equivalencia funcional de realizaciones alternativas (cierre de A0.1): dos realizaciones son intercambiables si comparten **firma de frontera** (roles netos sobre entidades de frontera, abstrayendo el interior); A0.4a criterio operativo in-zoom↔out-zoom (la descomposición DEBE preservar la frontera del proceso abstracto; checker `DESCOMPOSICION_NO_PRESERVA_FRONTERA`). Lectura categorial (2-célula/equivalencia, `urn:fxsl:kb:icas-higher-categories`) bajo la superficie, nunca expuesta al modelador; verificada en deep-opm-pro (capa categorial F2). Coherente con `reglas-opm-estrictas-es §Anexo C / R-CAT-EQ`. |
| 2026-06-03 | v1.4.1 — condiciones y loops ejecutables en opforja: `c` como bypass/omisión, múltiples condiciones AND/OR, invocación como salto de proceso, autoinvocación como bucle con salida condicional y límite runtime. Anclado a `reglas-opm-estrictas-es R-EJEC-7..10` y leyes de simulación/integración Ss↔Fs. |
| 2026-06-04 | v1.4.2 — remediación de trazabilidad KORA: `relations.cites` declara `spec-forja-opl` e ICAS usadas como lentes; Apéndice F deja de duplicar inventario OPL v0 y delega el estado vivo a `spec-forja-opl` §20 / catálogo de fixtures. |
| 2026-06-04 | v1.4.3 — corrección A0.4a: opforja sí puede verificar realizaciones hermanas mediante `verificarEquivalencia`; la ley in-zoom↔out-zoom queda como caso vertical complementario, no como sustituto por ausencia de autoría de variantes. |
| 2026-06-04 | v1.4.4 — integración de familia Forja: precedencia por planos (validez, modalidad, método, formal) y regla explícita de no duplicación frente a `reglas-opm-estrictas`, `spec-forja-opd`, `spec-forja-opl` y `opm-categorial`. |
| 2026-06-05 | v1.5.0 — ascenso metodológico desde Mesa 7 hd-opm (consenso 3-0): LF-19 integridad de estados por flujo, caracterización y ambiental-observado; A8 añade advertencias de auditoría sobre barridos en JSON y validación previa de métricas contra SSOT semántica. |
| 2026-06-12 | v1.5.1 — auditoría de coherencia del corpus 2026-06-12: A2.1 lifteado a `reglas-opm-estrictas-es` R-AG-3/R-AG-4 (la vía «instrumento + atributo medido» queda condicionada a ratificación previa en reglas como extensión declarada, p.ej. R-AG-3A; condición de mantenimiento alineada a alcance declarado/exclusión declarada); A8 «métrica antes que conclusión» comprimida a referencia a LF-19.3 (se retira la narrativa del incidente 99-vs-8); LF-19.4 abstraído a declaración explícita y auditable de caracterización (el literal `Coproducto XOR-n` y su parseo por barrido bajan al nuevo campo 9 «Realización opforja» de LF-19, conforme al molde B; la acusación por defecto permanece en el método); anclas SSOT corregidas por misatribución de capa: LF-05.9 (`opd-es` §10.12 semi-plegado V-116..V-120; se añade `manual` §7.2) y LF-06.9 (`opd-es` §9.3, no `manual`). |
| 2026-07-07 | v1.6.0 — arranque bottom-up de primera clase (HITL custodio): **A1.5 nueva** (bosquejo → reconciliación → SD0 como hermano legítimo del SD-primero, bajo la misma ley de equivalencia OPD↔OPL y la función-semilla A1.1; el bosquejo es OPM legítimo con rigor de cierre relajado — los juicios de validez de método se observan, no bloquean; la integridad estructural NUNCA se relaja; la reconciliación cobra el rigor al graduar; sin mecanismo de refinamiento nuevo — se incorpora por **adopción**, spec-opd §10.4 R-OPD-REF-20, convergente por construcción con el top-down) + nota de preámbulo en A2 (el asistente de 11 etapas realiza el arranque SD-primero; el bottom-up no pasa por el asistente hasta la reconciliación, donde las 11 etapas se exigen sobre el SD resultante). Realiza la doctrina bottom-up resuelta 2026-07-06 y el working-artifact deep-opm-pro `2026-07-06-apuntes-taller-design.md`. *(Fila de bitácora repuesta 2026-07-09: la enmienda ya constaba en frontmatter/título; se completa el registro.)* |
| 2026-07-18 | v1.6.1 — corrección epistémica: igualdad de firma de frontera pasa a equivalencia observacional relativa y condición necesaria de sustitución; no implica identidad, bisimulación ni equivalencia categorial. La lectura de fibración queda como hipótesis hasta construir lifts cartesianos. |
| 2026-07-27 | v1.7.0 — separa los ciclos reversibles de documento (Apunte ⇄ Modelo) y componente (Boceto ⇄ OPD integrado); reserva Taller para el espacio global, incorpora Reabrir y Devolver como inversas preservantes, permite graduación explícita con pendientes cuando la integridad está sana y separa integración, cierre, export canónico y validación humana. |
