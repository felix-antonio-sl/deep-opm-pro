# Perfil OpForja — método (`metodo-opforja`)

Qué es: reglas propias de OpForja sobre el *método* de modelar: flujo de producto (Taller,
Apunte/Modelo, Bocetos), catálogo de lecciones forja (Parte B, LF-nn), heurísticas tomadas de casos
externos, lentes ICAS, capacidades observadas en OPCloud, la realización en el formato de intercambio
(Apéndice F) y la bitácora histórica.

Subordinación: este perfil no contradice el canon (`canon/metodologia-forja-opm-es` 2.0.0 y, por
encima, reglas, spec-OPD y spec-OPL). Cuando es más estricto que ISO lo dice con `[endurecimiento]`
y su brecha se declara en `docs/conformidad.md`; cuando extiende ISO, `[extensión]`. Las notas
«Corrección 2.0» ajustan el texto heredado donde chocaba con el canon corregido.

Procedencia: todo el texto viene, verbatim, de `metodologia-forja-opm-es` v1.7.0 (la sección de
origen se indica en cada bloque y se conserva la numeración). Las referencias «§9.n» del manual se
sustituyeron por los IDs propios A5.n; las referencias a la capa visual base (V-nn), a rutas
personales o de código y a documentos ausentes se sustituyeron por su dueño local; el detalle consta
en `mapa-metodologia-forja-opm-es.json`.

---

## 0. Contrato

Preámbulo de origen (canon v1.7.0, l.19–21):

SSOT **primaria y autónoma** del *método* de modelar OPM con la herramienta
opforja (deep-opm-pro). Contiene todo el procedimiento (no requiere abrir otra
fuente para modelar) + el catálogo de lecciones forja + la realización del bundle.

### 0.1 Naturaleza (origen: canon v1.7.0 §0.1)

**0.1 Naturaleza.** Capa de **método**: orienta *cómo* construir un hecho OPM válido y *en qué orden*. No es norma bloqueante ni redefine primitivas.

### 0.2 Precedencia por planos (origen: canon v1.7.0 §0.2)

**0.2 Precedencia (familia Forja, no cadena simple).** Hay cuatro planos ortogonales:
- **Plano de validez** (predica sobre el *hecho*): `reglas-opm-estrictas-es` decide validez operativa, severidad y extensiones declaradas, bajo las capas base `opm-es`/`opd-es`/`opl-es`.
- **Plano modal** (predica sobre la *realización*): `spec-forja-opd-es` gobierna OPD/visual y `spec-forja-opl-es` gobierna OPL/textual y roundtrip. Ninguna spec modal redefine validez nuclear.
- **Plano de método** (predica sobre el *camino*): este documento. Atado al plano de validez por **lifting**: *ninguna lección o procedimiento autoriza un hecho que la norma prohíbe, ni redefine una primitiva*. La norma no deroga el método (un modelo puede ser **conforme-pero-malo**; eso es lo que el método cubre).
- **Plano formal** (predica sobre la *lectura estructural*): `opm-categorial-es` explica y traza leyes bajo la superficie; no introduce vocabulario de modelador ni reglas nuevas sin capa propietaria.
- *(lente formal, opcional y aún hipotética: podría estudiarse una fibración
  sobre el plano de validez si se construyen proyección y lifts cartesianos.)*

> **Corrección 2.0:** la precedencia vigente es la de canon metodología 0.2 (reglas > spec-OPD / spec-OPL > metodología; manda la norma). Los planos, el lifting y la lente formal se conservan como lectura de producto; las capas base `opm-es`/`opd-es`/`opl-es` y `opm-categorial-es` no son autoridad local.


### 0.4 Autonomía y no duplicación (origen: canon v1.7.0 §0.4)

**0.4 Autonomía y no duplicación.** Este artefacto **contiene** el método; no apunta a `manual-metodologico-opm-es` para definirlo. El manual queda como SSOT tool-agnóstica de la que este deriva (`derived_from`), no como dependencia de lectura. Este documento NO DEBE duplicar la matriz de validez de `reglas-opm-estrictas-es`, la geometría completa de `spec-forja-opd-es`, las plantillas completas de `spec-forja-opl-es` ni la explicación categorial de `opm-categorial-es`; debe citar esos artefactos cuando una decisión metodológica los requiera.

### 0.5 Cómo leer (origen: canon v1.7.0 §0.5, parte)

- **0.5c** [extensión] (origen: canon v1.7.0 §0.5): Tipografía canónica en ejemplos: objeto **negrita**, proceso *cursiva*, `estado` en backticks.

> **Corrección 2.0:** la tipografía no porta el tipo de cosa en el canon (canon metodología 0.5b); es convención de presentación de OpForja.


---

# Parte A — Método (partes de producto, casos externos y extensiones)

## A0. Antes de la semilla (fase pre-SD)

### A0.1 Divergencia de conceptos (origen: canon v1.7.0 A0.1)

**A0.1 Divergencia de conceptos.** Antes de fijar UN SD, el modelador **DEBERÍA** generar **≥3 conceptos de solución** distintos, destilar el concepto central de cada uno y explicitar sus supuestos; recién entonces comprometer la arquitectura. *(anclaje: opm-es §Conceptos alternativos de solución.)*

### A0.3 Intención → función → forma (origen: canon v1.7.0 A0.3)

**A0.3 Intención → función → forma.** En sistemas con varias tecnologías candidatas, el modelador **DEBERÍA** separar tres capas antes del SD definitivo: (1) intención/valor que se busca, (2) funciones solution-neutral que realizan ese valor, (3) formas solution-specific que implementan cada función. Las formas pueden desplegarse por generalización-especialización, pero la capa funcional no debe heredar nombres de tecnología antes de decidir la arquitectura.

### A0.4 Equivalencia observacional (origen: canon v1.7.0 A0.4, A0.4a) [extensión]

**A0.4 Equivalencia observacional de realizaciones alternativas (cierre de A0.1).** Generar ≥3 conceptos (A0.1) no basta: el modelador necesita un criterio para comparar realizaciones. La misma **firma de frontera** —roles netos sobre las entidades declaradas— las hace indistinguibles **para esos observables**. No garantiza sustituibilidad total: estados, protocolos, errores, timing y efectos fuera de la firma pueden distinguirlas. Solo cuando el alcance declara la firma completa para el consumidor y verifica esos efectos puede tratarse como criterio operativo de intercambio. Esta es equivalencia observacional relativa, no equivalencia categorial por sí sola. *(anclaje: `reglas-opm-estrictas-es §Anexo C / R-CAT-EQ`; lectura crítica: `urn:fxsl:kb:opm-categorial-es`; jamás expuesta al modelador.)*

- **A0.4a Criterio operativo en opforja (realizaciones hermanas + in-zoom ↔ out-zoom).** Opforja PUEDE confirmar igualdad de firma para dos OPDs comparables; el resultado significa equivalencia respecto de la frontera modelada, no identidad ni bisimulación. Además, toda **descomposición** DEBE preservar la firma de frontera de su proceso abstracto. Añadir o quitar un rol prueba diferencia funcional visible; conservar todos los roles es condición necesaria, no siempre suficiente. Violación detectable: `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (pasivo).

> **Corrección 2.0:** la preservación de la firma de frontera (A0.4a) es `[extensión]` de producto y se acota a las cosas ya presentes en el OPD padre: un enlace nuevo de una cosa que sólo aparece en el OPD hijo es refinamiento, no contradicción (canon metodología A8.3b, ISO §14.2.3).


## A1. Principio rector y clasificación

### A1.1 Regla rectora (origen: canon v1.7.0 A1.1, parte)

- **A1.1f** [extensión] (origen: canon v1.7.0 A1.1): el SD precede a todo refinamiento **integrado en el árbol**, aunque un Boceto bottom-up pueda existir antes de decidir ese SD.

### A1.2 Clasificación del sistema (origen: canon v1.7.0 A1.2, tabla y patrones)

| Tipo | Propósito | Ocurrencia del problema | Agentes humanos |
|---|---|---|---|
| Artificial | sí | sí | sí |
| Natural | **no** → `resultado` | **no** | no (solo instrumentos) |
| Social | sí (5 componentes) | sí | sí; condiciones ambientales por enlace habilitador con estado |
| Socio-técnico | sí (5 componentes) | sí | sí; relaciones no fundamentales por enlace estructural etiquetado |

Patrones de referencia: Artificial `Airplane Flying`; Natural `Fetus Developing` (resultado, no propósito); Social `Conference Occurring`; Socio-técnico `Online Professional Identity Managing`; físico-con-partes-informacionales `Baggage Transporting` (la transformación dominante física fija la esencia → A5.11).

> **Corrección 2.0:** la fila «Natural» no exime del contenido mínimo del SD: también un sistema natural muestra beneficiario y función (canon metodología A2.7, ISO §14.1, §3.75). Las filas «Social» y «Socio-técnico» no definen sus «5 componentes» (propósito, función, habilitadores, cosas ambientales y ocurrencia del problema, según A2.4); el socio-técnico también tiene ocurrencia del problema (canon A2.5).


### A1.3 Modo reverse / MBRSE (origen: canon v1.7.0 A1.3)

**A1.3 Modo reverse / MBRSE para sistemas existentes.** Cuando el sistema ya existe y no hay diseño ni requisitos completos, el método **NO** exige reconstruir top-down antes de modelar. Opera en ciclo:

`observaciones → requisitos inferidos → modelo conceptual OPM → brechas de conocimiento → predicciones/pruebas → actualización de observaciones/requisitos`.

Reglas de uso:
- Las observaciones pueden entrar en cualquier nivel de la jerarquía; el trabajo es **middle-out** con ciclos bottom-up y top-down.
- Un requisito inferido es **hipótesis de función/constraint**, no hecho normativo hasta que se conecte con estructura y comportamiento observables (A7).
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

### A1.4 Modos de aplicación real (origen: canon v1.7.0 A1.4)

**A1.4 Modos de aplicación real.** Además del diseño forward, Forja reconoce tres modos frecuentes: (a) **task analysis humano-máquina**, donde el OPD debe modelar personas, tecnología, decisiones, feedback y contingencias como un solo sistema procedimental; (b) **modelo prospectivo/To-Be**, donde el OPD describe una arquitectura futura o prototipo digital y debe marcar la fuerza epistémica de sus objetos/procesos; (c) **digital twin / CPS**, donde el OPD combina proceso físico, datos, simulación y predicción sin convertir cada variable en transformee. El modo elegido no cambia las primitivas OPM; cambia la disciplina de evidencia, validación y altitud.

### A1.5 Taller y arranque bottom-up (origen: canon v1.7.0 A1.5)

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
deep-opm-pro (documento de diseño del 2026-07-27, ausente del repositorio).)*

## A2. Construcción del SD (partes de producto)

Nota de arranque (origen: canon v1.7.0 A2, l.153–157):

> El asistente de las 11 etapas realiza el arranque **SD-primero**. El arranque
> **bottom-up** (A1.5) es su hermano legítimo para elicitación exploratoria:
> puede aplicar estas etapas cuando emerge un candidato a SD. Graduar no ejecuta
> ni completa el asistente de manera implícita; en régimen Modelo, lo pendiente
> reaparece como cierre exigible.

Etapa de verificación del asistente (origen: canon v1.7.0 A2, tabla):

| # | Objetivo | Salida mínima |
|---|---|---|
| 11 | Verificación | compuerta `PASA/FALLA` (A8.1) |

### A2.1 Reclasificación por desgaste (origen: canon v1.7.0 A2.1, parte)

- **A2.1b** [extensión] (origen: canon v1.7.0 A2.1): El patrón alternativo «conservar como instrumento + atributo afectado/medido» (degradación como variable informacional de desempeño, observado en digital twins: **Cutting Tool** requiere *Machining* y exhibe **Tool Wear**) **solo** es legal si antes se ratifica en `reglas-opm-estrictas-es` como extensión declarada (p.ej. R-AG-3A: degradación como variable informacional con cambio neto cero del host, análoga al cambio de rol entre niveles A5.4); mientras esa ratificación no exista, aplicar la reclasificación.
- **A2.1c** [endurecimiento] (origen: canon v1.7.0 A2.1): **Mantenimiento** (R-AG-4): si pertenece al alcance declarado, **DEBE** agregarse el atributo de degradación/amortización y un proceso de mantenimiento separado (*Machine Maintaining*); si queda fuera del alcance, **DEBE** declararse esa exclusión.

### A2.3 Nombrado y esencia por defecto (origen: canon v1.7.0 A2.3, parte)

- **A2.3e** (origen: canon v1.7.0 A2.3): el infinitivo **NO se prohíbe**, porque el método no deroga lo que la norma admite (lifting, 0.2).
- **A2.3f** [extensión] (origen: canon v1.7.0 A2.3): Fijar la esencia mayoritaria del sistema como *default* y NO anotar física/informacional cosa por cosa reduce el ruido; declarar la esencia solo cuando difiere del default (o mientras el thing está aislado sin enlaces). *(realización: ver Apéndice F.)*

### A2.4 Lentes parciales del SD (origen: canon v1.7.0 A2.4)

**A2.4 Lentes parciales del SD.** Para elicitar sistemas complejos, el modelador **PUEDE** construir OPDs-lente separados de propósito, función, enablers, entorno y ocurrencia del problema antes de integrar el SD. Estos lentes son andamiaje de construcción y revisión; no sustituyen el SD integrado ni crean un mecanismo de refinamiento adicional.

### A2.6 Beneficio distribuido (origen: canon v1.7.0 A2.6)

**A2.6 Beneficio distribuido.** Si el valor pertenece a varios grupos humanos, modelar el atributo de valor como exhibido por esos grupos o por un objeto de preocupación compartido; no colgarlo por comodidad del sistema técnico. El stakeholder portador del valor es parte del significado funcional.

## A3. Refinamiento (partes de producto)

### A3.1 Descomposición (origen: canon v1.7.0 A3.1, parte)

- **A3.1h** [endurecimiento] (origen: canon v1.7.0 A3.1): ≥2 subprocesos (refinamiento no trivial).

> **Corrección 2.0:** ISO no fija mínimo de subprocesos (canon metodología A3.1c); el mínimo de dos es endurecimiento de OpForja.

- **A3.1i** [extensión] (origen: canon v1.7.0 A3.1): es **verificable por simulación conceptual** (A8.1) — si la animación de tokens corre en orden inesperado, revisar alturas relativas y enlaces de control.
- **A3.1j** [extensión] (origen: canon v1.7.0 A3.1): En procedimientos humano-máquina, usar una regla práctica más estricta: si el in-zoom supera ~5 subprocesos, buscar un proceso intermedio/out-zoom antes de saturar la lectura.

### A3.3 Identidad de la descomposición (origen: canon v1.7.0 A3.3, parte)

- **A3.3d** [extensión] (origen: canon v1.7.0 A3.3): Una cosa no es interna y externa a la vez; reposicionarla gráficamente NO cambia su alcance — para moverla de alcance hay que recrearla.

> **Corrección 2.0:** recrear para cambiar de alcance es conducta de herramienta; el alcance ISO es el contexto del proceso descompuesto (canon metodología A3.3c).

- **A3.3e** [extensión] (origen: canon v1.7.0 A3.3): **Vista explicativa vs. mecanismo.** Un OPD que "despliega" métodos, insumos, herramientas y resultados puede ser una vista explicativa útil, pero el mecanismo OPM correcto depende de la semántica: orden temporal y transformees → descomposición; partes/rasgos/especializaciones/instancias → despliegue; artefactos compartidos entre procesos → objetos externos conectados. No copiar el nombre visual de una figura si contradice el mecanismo.

### A3.4 Distribución/migración de enlaces (origen: canon v1.7.0 A3.4, parte)

- **A3.4j** [extensión] (origen: canon v1.7.0 A3.4): *(Si la herramienta automatiza la migración, verificarlo en opforja; no asumirlo.)*
- **A3.4l** [desviación declarada] (decisión del dueño, 2026-10-10; ISO §14.2.2.4, subcláusula 14.2.2.4.1 y su NOTA 2 [informativo]): al descomponer, OpForja asigna por defecto el enlace de resultado al último subproceso (y el de consumo al primero). La norma fija como defecto el primer subproceso para ambos y deja la reasignación al modelador (canon metodología A3.4c); la NOTA 2 permite que la herramienta establezca un defecto que el modelador modifica, de modo que OpForja realiza por defecto el reasignado que canon A3.4k recomienda como guía. La diferencia con el defecto ISO se declara en `docs/conformidad.md`.

## A4. Gestión de complejidad (partes de producto)

### A4.1 Mecanismos (origen: canon v1.7.0 A4.1, parte)

| Mecanismo | Refinar / Abstraer | Uso |
|---|---|---|
| Composición inter-modelo por sub-modelo | referencia / desconexión | trabajo concurrente; encapsulación (LF-04) |

> **Corrección 2.0:** ISO fija tres pares de refinamiento-abstracción (canon metodología A4.1a, ISO §14.2.1); la composición por sub-modelo es `[extensión]` de producto (A4.1c), no un cuarto mecanismo canónico.

- **A4.1c** [extensión] (origen: canon v1.7.0 A4.1): composición inter-modelo por sub-modelo (fila anterior).
- **A4.1d** [extensión] (origen: canon v1.7.0 A4.1): Operadores de canvas (`Bring`, etc.) son derivados, no mecanismos.

### A4.2 Heurística de profundidad (origen: canon v1.7.0 A4.2, parte)

- **A4.2c** (origen: canon v1.7.0 A4.2): Calibración empírica: los modelos detallados suelen abarcar **5-10 niveles** del árbol de procesos (referencia, no invariante).

### A4.3 Árbol OPD e identidad (origen: canon v1.7.0 A4.3, parte)

- **A4.3b** [extensión] (origen: canon v1.7.0 A4.3): Etiquetas `SD/SD1/SD1.1` son **navegación**, NO identidad persistente. Cada OPD **DEBE** tener identificador persistente (URI/handle) recuperable en serialización.
- **A4.3c** [extensión] (origen: canon v1.7.0 A4.3): Cada modelo tiene su árbol local; los sub-modelos componen **por referencia**, no por super-árbol global.
- **A4.3d** [extensión] (origen: canon v1.7.0 A4.3): OPDs hoja = única clase eliminable.

### A4.4 Contrato de sub-modelo (origen: canon v1.7.0 A4.4) [extensión]

**A4.4 Contrato de sub-modelo (interfaz congelada).** Mínimo: 1 objeto + 1 proceso por exhibición-caracterización e instrumento; un solo proceso por sub-modelo; cosas compartidas sin refinar. Tras crear: las compartidas **no** reciben nuevos enlaces/estados, **no** se renombran/eliminan, **no** se agregan nuevas compartidas (si la interfaz es incorrecta, destruir y recrear). Autoridad semántica = modelo propietario; el consumidor solo referencia, por id persistente. → ver **LF-04**.

### A4.6 Viewpack arquitectónico (origen: canon v1.7.0 A4.6)

**A4.6 Viewpack arquitectónico.** En SoS/CPS densos, además del árbol OPD formal, el modelador **PUEDE** mantener un paquete de vistas metodológicas: inventario de componentes, carriles de valor/soporte, alternativas morfológicas, ruta primaria y contribución a atributos de desempeño. Estas vistas son proyecciones para decidir y comunicar; todo hecho que pretenda ser parte del modelo debe volver a una primitiva OPM y a OPL equivalente.

## A5. Heurísticas de modelado (partes de producto y casos externos)


Los IDs «§9.n» del manual se reemplazan por A5.n (A5.1–A5.23 en el canon; A5.24–A5.38 aquí).

### A5.1 Proceso persistente (origen: canon v1.7.0 A5, fila manual §9.1)

- **A5.1b** [extensión] (origen: canon v1.7.0 A5 (fila manual §9.1)): El proceso persistente que **sí** sobrevive se realiza como cambio con **entrada=salida** (`*P* cambia **A** de \`s\` a \`s\``), no con verbo especial.

> **Corrección 2.0:** «proceso persistente» no es término ISO: la perseverancia dinámica define al proceso (ISO §3.50); A.4.4.2 sólo da la oración «is persistent/transient» sin más semántica. El caso sin transformación se modela como en canon metodología A5.1a.


### A5.15 Sinónimos/homónimos (origen: canon v1.7.0 A5, fila manual §9.15)

- **A5.15b** [extensión] (origen: canon v1.7.0 A5 (fila manual §9.15)): Las variantes de superficie infinitivo↔nominalización (`Verificar Identidad`/`Verificación de Identidad`) PUEDEN coexistir si mapean al **mismo nombre canónico interno**.

> **Corrección 2.0:** en el modelo, una cosa tiene un solo nombre (canon metodología A5.15, A2.3b); las variantes viven en un glosario externo del producto.


### A5.20 Atributos cuantitativos (origen: canon v1.7.0 A5, fila manual §9.20)

- **A5.20b** [extensión] (origen: canon v1.7.0 A5 (fila manual §9.20)): declarar unidad + tipo (`Pressure [kPa] {p}`); tipos: boolean/string/integer/float/double/short/long/enumerated; rangos `[0..100]`,`(0..*)`, sub-rango no amplía silenciosamente

> **Corrección 2.0:** el alias `{p}`, los tipos computacionales y los intervalos abiertos (`(0..*)`) son de producto; el canon sólo fija unidad y rango (canon A5.20).


### A5.23 Relaciones n-arias (origen: canon v1.7.0 A5, fila manual §9.23)

- **A5.23b** (origen: canon v1.7.0 A5 (fila manual §9.23)): o vía un proceso *state-preserving*; OPM enfoca todo en binario. *(Reciprocidad/transitividad de enlaces y propiedades del fork son canon de opm-es/opd-es — referenciar, no copiar.)*

### A5.24–A5.38 Heurísticas de casos externos (origen: canon v1.7.0 A5, filas manual §9.24–§9.38)

| ID | Heurística | Regla |
|---|---|---|
| A5.24 | Estados de existencia/disponibilidad cualitativa | si una cantidad solo importa como presencia operable, usar estados cualitativos (`no-existente`, `bajo`, `existente`) en vez de atributo numérico. Si el valor alimenta cálculo/simulación, modelar atributo cuantitativo (A7). No usar `no-existente` como decoración: debe habilitar NOT, creación, arranque, escasez o falla observable |
| A5.25 | Intermedio con uso externo | un "intermedio" producido y consumido dentro de una cadena solo se suprime si no tiene observación ni uso fuera de la cadena (A5.2). Si también alimenta otro proceso, regula el sistema o es producto útil, conservarlo como objeto/producto explícito; esa doble participación puede revelar brechas o requisitos ocultos |
| A5.26 | Control loop explícito | cuando un sistema es adaptable/tunable, no dejar **Sistema de control** como caja muda: explicitar, al nivel adecuado, el patrón `sensado → decisión → salida/señal`, los estados que lee y los procesos/estados que controla. Si el mecanismo es desconocido, marcar brecha en vez de inventarlo |
| A5.27 | Numeración local de pasos/requisitos | números visibles (`0`, `1`, `Req#11`) son etiquetas de navegación o trazabilidad, no identidad ontológica. La identidad vive en el nombre canónico y el id persistente; la numeración local PUEDE ayudar a leer rutas largas, pero no debe sustituir enlaces, orden vertical ni OPL |
| A5.28 | Calibración esencia/afiliación pre-SD | en CPS mixtos, hacer una matriz rápida físico/informacional × sistémico/ambiental con ejemplos canónicos antes del SD reduce discusiones tardías. Es calibración, no sustituto de justificar cada frontera controversial |
| A5.29 | Carriles de valor/soporte | para SoS densos, separar visualmente operandos, procesos de valor, instrumentos de valor, procesos de soporte e instrumentos de soporte ayuda a leer la arquitectura. Es layout metodológico, no nueva primitiva; si distorsiona el dominio, no usarlo |
| A5.30 | Variable CPS: atributo, dato u operando | si una magnitud describe una cosa, modelarla como atributo; si circula por analítica/control, como objeto informacional/dato; si cambia materialmente por el proceso, como transformee. No convertir toda métrica en objeto principal ni todo dato en atributo local |
| A5.31 | Propiedad emergente observable | rugosidad, desgaste, seguridad, eficiencia o carga pueden ser atributos exhibidos por objetos/procesos y a la vez foco de medición/modelado. Si una propiedad emerge de la interacción sistémica, declarar qué procesos la producen, miden o usan |
| A5.32 | Pre/Post condición a contingencia/mensaje | una precondición incumplida no debe quedar como falla muda: modelar contingencia, salto, espera o mensaje informativo según semántica. Una postcondición incumplida exige reparación, escalamiento o señal de error; si falta, el procedimiento está incompleto |
| A5.33 | Estado verificado y memoria de ejecución | en procedimientos, `on` y `on verificado` pueden ser estados distintos si procesos diferentes los escriben/leen. Si la verificación es solo evidencia epistémica o checklist, considerar atributo separado o memoria de ejecución; no mezclar estado físico y estado conocido sin decisión explícita |
| A5.34 | Modelo prospectivo/To-Be | si el OPD describe un prototipo, arquitectura futura o digital twin no desplegado, marcar los hechos como diseño/propuesta y validar utilidad stakeholder por separado de validez OPM. No leerlo como operación real demostrada |
| A5.35 | Instrumento por capacidad vs. herramienta concreta | en modelos transferibles, preferir capacidades instrumentales (`software de simulación`, `escaneo 3D`) a marcas o herramientas locales; en modelos descriptivos, aceptar herramienta concreta si la decisión de alcance lo exige |
| A5.36 | Aspecto transversal cuantificable | seguridad, costo, riesgo, tiempo, energía o usabilidad pueden ser overlays de atributos sobre objetos/procesos. Para compararlos, declarar tipo, unidad, rango, polaridad, función de agregación y umbral; sin eso no hay tradeoff auditable |
| A5.37 | Alternativa de diseño no es estado por defecto | variantes como password de 4 o 6 dígitos, ML o RL, layout A o B suelen ser especializaciones/instancias/configuraciones, no estados del mismo objeto. Usar estado solo si el mismo objeto cambia de valor en el tiempo |
| A5.38 | Stakeholder portador de valor | cuando el valor es organizacional o humano, identificar quién exhibe el atributo de valor. El sistema técnico puede habilitarlo, pero no necesariamente lo posee |

## A6. Control de flujo (extensiones)

- **A6k** [extensión] (origen: canon v1.7.0 A6): **Abanicos**: XOR (arco simple) "exactamente m de f"; OR (arco doble) "al menos m de f"

> **Corrección 2.0:** ISO define XOR = exactamente uno y OR = al menos uno, con arco discontinuo simple o doble (ISO §12.2; canon metodología A6e); «m de f» es generalización de producto (reglas R-FAN-M-1..4).

- **A6l** [extensión] (origen: canon v1.7.0 A6): **NOT**: estados `existente`/`no-existente` + enlace de instrumento/condición sobre `no-existente`. Realización compacta: un solo **enlace NOT** sobre el estado (`instrument-not`/`event-not`) en vez de N enlaces de condición a los demás estados.

> **Corrección 2.0:** el enlace negado no es construcción ISO ni es bimodal; el idioma ISO equivalente usa estados explícitos con condición o instrumento.

- **A6m** [extensión] (origen: canon v1.7.0 A6): conjunto-miembro (enlaces del mismo tipo a conjunto y a miembro → n iteraciones)
- **A6n** [extensión] (origen: canon v1.7.0 A6): **Enlaces con valor**: establecimiento (unidireccional), efecto de valor (bidireccional), par entrada-salida especificado; aplican a **valores** (estados de atributo), no a estados de objeto.

## A7. Cuantitativo · requisitos · simulación (casos externos y producto)

- **A7g** [extensión] (origen: canon v1.7.0 A7): **Flujo computacional** (5 pasos): atributos con tipo → alias → proceso `{}` → fórmula → enlaces de flujo. Operandos no conmutativos con roles explícitos. Rangos validados con modo **soft** (acepta fuera de rango, marca) vs **hard** (bloquea), configurable por fase (diseño/ejecución/simulación); sub-rango heredado no amplía.
- **A7h** (origen: canon v1.7.0 A7): **Métrica para tradeoff**: todo atributo usado para elegir diseño **DEBE** declarar unidad/tipo/rango, polaridad (`más es mejor`, `menos es mejor`, `cota obligatoria`, `óptimo interior`), función de agregación y umbral. La polaridad puede invertirse entre medidas de componente y medidas de proceso; no asumir que un número alto siempre mejora.
- **A7i** (origen: canon v1.7.0 A7): **Fórmula como instrumento vs cómputo ejecutable**: en fase conceptual, una ecuación, simulador o modelo ML PUEDE ser objeto informacional/instrumento de un proceso (*Simulating requires Mathematical Equation*). Solo pasar a proceso computacional detallado cuando la fórmula deba ejecutarse, validarse por rango o explicar una decisión de arquitectura.
- **A7j** (origen: canon v1.7.0 A7): **Procedencia de datos**: separar datos empíricos, sintéticos, simulados, declarados e inferidos cuando alimentan predicción o diseño. Un modelo predictivo que usa datos empíricos + sintéticos debe mostrar ambos orígenes o declararlos fuera de alcance.
- **A7k** (origen: canon v1.7.0 A7): **Requisitos en el modelo**: representar requisitos como objetos informacionales o estereotipo equivalente; mantener catálogo externo como SSOT y traer al OPD solo los requisitos relevantes. Trazabilidad por enlace estructural etiquetado `satisface` (no procedimental), desde objeto/proceso/enlace o desde un conjunto de componentes hacia el requisito.

> **Corrección 2.0:** la traza `satisface` es enlace estructural etiquetado sólo entre objetos (objeto → objeto requisito; ISO §10.1); desde un proceso, un enlace o un conjunto de componentes no es hecho OPM y se lleva como metadato externo del producto (canon metodología A7f).

- **A7l** (origen: canon v1.7.0 A7): **Fuerza epistémica del requisito**: distinguir siempre (a) **norma/requisito prescriptivo** — obliga por fuente externa competente; (b) **requisito declarado de diseño/operación** — decisión del operador o stakeholder; (c) **requisito inferido** — hipótesis explicativa derivada de observaciones/modelo. Un requisito inferido **NO equivale** a norma ni a hecho demostrado: solo gana fuerza al conectarse con estructura, comportamiento y evidencia.
- **A7m** (origen: canon v1.7.0 A7): **Requisitos inferidos en reverse engineering**: en sistemas existentes, los requisitos pueden inferirse desde observaciones, desde otros requisitos (`flow-up`/`flow-down`) o desde comportamiento del modelo. Son hipótesis: deben conectarse con estructura/función downstream o quedar como brecha/predicción; mientras no se validen, no deben presentarse como cumplimiento ni como verdad del dominio.
- **A7n** (origen: canon v1.7.0 A7): **Layering de requisitos**: si un requisito tiene excepciones, bajarlo al contexto específico donde aplica; si no explica toda la arquitectura observada, buscar requisito upstream faltante. No crear requisitos nuevos si la arquitectura ya queda cubierta por los existentes.
- **A7o** (origen: canon v1.7.0 A7): **Brechas y predicciones**: un requisito sin realización observable, una estructura sin requisito que la explique, un intermedio con doble uso o una interfaz crítica no modelada generan una brecha. Cada brecha **DEBERÍA** terminar en predicción testeable, acotación de alcance o dato pendiente.
- **A7p** (origen: canon v1.7.0 A7): **Simulación**: recorrido en profundidad del árbol local; cruce a sub-modelo = transición explícita entre fronteras (no continuación de árbol global). Distinguir simulación conceptual (tokens) de ejecución computacional (fórmulas). Condiciones `c` se simulan como bypass/omisión, no como espera; iteraciones se modelan con invocación/autoinvocación, no con un primitivo `while`.
- **A7q** (origen: canon v1.7.0 A7): **Simulación de configuraciones**: cuando hay variantes vivas, modelar el genérico + especializaciones/instancias seleccionables y comparar configuraciones por matriz de resultados. La simulación apoya decisión; no reemplaza requisitos mínimos, juicio stakeholder ni restricciones normativas.
- **A7r** [endurecimiento] (origen: canon v1.7.0 A7): **Emergencia**: la arquitectura **DEBE** producir ≥1 capacidad emergente; sin ella, no es un sistema MBSE.

## A8. Invariantes y validación (producto)

### A8.1 Validación tripartita (origen: canon v1.7.0 A8.1)

**A8.1 Validación tripartita** (mapea al PanelMetodologia de opforja):
1. **Bloqueos estructurales** (CRÍTICA) — firma de enlaces, clases válidas, aciclicidad del árbol, integridad OPD↔OPL. Falla → no avanzar.
2. **Mejoras metodológicas** (ALTA/MEDIA) — claridad ≤20-25, completitud (estructura+comportamiento+función), bimodalidad, refinamiento motivado. Falla → avanzar declarando issue.
3. **Estilo/legibilidad** (BAJA) — tipografía, posicionamiento, etiquetas.

Prácticas de validación continua (origen: canon v1.7.0 A8, l.327–331):

- **Simulación conceptual como compuerta de flujo**: correr la animación de tokens para verificar orden, precondiciones, ramas de condición y bucles **antes** de cualquier cómputo. Repetirla tras cada edición gráfica significativa; si se acumulan cambios antes de simular, el error lógico se vuelve difícil de localizar. Es el modo barato de cazar errores de orden/precedencia; si el orden observado ≠ esperado, revisar alturas de subprocesos y enlaces de control (cf. A3.1). *(Si opforja v0 no anima, la disciplina equivalente es ejecutar el gate tripartito paso a paso, no al final.)*
- **Condiciones y bucles ejecutables en opforja**: una condición incumplida debe verse como paso omitido en la traza; una invocación debe alterar el siguiente proceso observado; una autoinvocación debe repetir hasta que una condición de salida omita o derive la ejecución. Si el bucle no tiene salida, el runtime debe cortar por límite de seguridad con diagnóstico, no colgar la sesión.
- **Validación por niveles**: probar primero fragmentos/OPDs críticos, luego escenarios de sistema. Para configuraciones, ejecutar una matriz de casos representativos antes de convertir una variante en decisión de diseño.
- **Validación stakeholder separada**: un OPD puede ser OPM-válido y no ser útil para decidir. Cerrar modelos prospectivos, task-analysis o digital twin con dos marcas: validez metodológica y adecuación/feedback stakeholder.
- **Ledger de investigación**: en modo reverse/MBRSE, cerrar cada OPD con cuatro preguntas: (1) ¿qué requisito explica esta estructura?, (2) ¿qué estructura satisface este requisito?, (3) ¿qué hecho observado quedó sin explicación?, (4) ¿qué predicción o prueba sale de la brecha? Si las cuatro respuestas son vacías, el OPD probablemente solo documenta, no investiga.

> **Corrección 2.0:** el corte de bucles sin salida es política de runtime que una herramienta PUEDE aplicar (reglas R-EJEC-10), no hecho OPM; la severidad CRÍTICA/ALTA/MEDIA/BAJA es escala de producto.


### A8.2 Invariantes de producto (origen: canon v1.7.0 A8.2, filas)

| Invariante | Capa |
|---|---|
| Refinamiento no trivial: descomposición ≥2 subprocesos; despliegue ≥2 refinadores | manual |
| Interfaz de sub-modelo congelada tras creación | manual |
| Cada OPD con identificador persistente ≠ etiqueta `SDx.y` | opd-es |
| Referencia inter-modelo explicita propietario y consumidor | opm-es |

> **Corrección 2.0:** el mínimo de dos refinados es `[endurecimiento]`: ISO admite uno (ISO §10.3.1, §A.4.3). La interfaz congelada y la referencia inter-modelo son `[extensión]`.



**Advertencias operativas de auditoría:**
- **Barridos sobre serialización**: ejecutar barridos de integridad sobre el JSON canónico, nunca sobre el OPL. El emisor textual omite entidades sin apariciones; una entidad desconectada puede existir en JSON y ser invisible en la capa textual (verificado en opforja v0).
- **Métrica antes que conclusión**: validar la métrica del barrido contra la SSOT semántica antes de fundar conclusiones. Una regla indiferenciada sobre-acusa (caso paradigmático: LF-19.3 — efecto sin rama es escritor legal).

> **Corrección 2.0:** una cosa sin aparición en ningún OPD viola el invariante canónico A8.2i; la advertencia describe la detección en el producto.


---

# Frontera rectora (antes del catálogo)

Cuatro operaciones de la familia "estados/altitud" se confunden si no se separan por su **tipo de decisión**:

| Operación | Tipo | Alcance | Propietario |
|---|---|---|---|
| **Dimensionalización** (LF-01) | **ontológica**: cambia *qué es* la cosa (cuántos ejes/atributos) | invariante, **todas** las apariciones | A5.5 + A5.12 |
| **Caracterización** (LF-02) | **realización**: cómo se materializa un eje ya decidido | el OPD donde se aloja | A5.6 + A5.8 |
| **Supresión de estados** (LF-03) | **per-aparición sobre estados**: cambia *qué estados se muestran*, no la identidad | un OPD concreto | canon A3.6 |
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
3. **Mecanismo OPM** — exhibición-caracterización; realiza A5.5 (árbol de decisión de atributos), A5.12 (estados directos vs atributo+valores), A7c (espacio de estados compuesto).
4. **Cuándo NO aplica** — máquina **secuencial** (`a→b→c`, cada estado escrito por un proceso en orden) es **un** eje, no producto → no dimensionalizar. No confundir con LF-03 (supresión no cambia identidad).
5. **Liftea a** — `opd-es` (estados, caracterización); homogeneidad de enlaces A5.6 (exhibición admite las 4 combinaciones).
6. **Realización opforja** — el objeto deja de tener estados directos; crear entidades-atributo (`esAtributo:true`, **sin** `valorSlot`) + `estados`; enlace `exhibicion` objeto→atributo; opcional unfold `modo:"exhibicion"`. Auditar alcanzabilidad del producto antes de fijar cardinalidad; cruces inalcanzables → enlaces de condición, no recolapso.
7. **Ejemplo** — ✗`**Colaborador de cuidado** puede estar disponible y competente`. ✓`**Colaborador de cuidado** exhibe **Disponibilidad**, **Competencia** así como **Carga**; **Disponibilidad** puede estar \`disponible\` o \`ausente\`.` *(HODOM, ilustrativo)*

> **Corrección 2.0:** el ejemplo ✓ corregido según spec-OPL: «**Colaborador de cuidado** exhibe **Disponibilidad**, **Competencia** y **Carga**. **Disponibilidad** de **Colaborador de cuidado** puede estar `disponible` o `ausente`.» («así como» separa atributos de operaciones).

8. **Consecuencia si lo ignoras** — el modelo afirma falsamente que las combinaciones cruzadas son imposibles; invisibiliza transiciones reales (p.ej. *competente-pero-sobrecargado*).
9. **Ancla SSOT** — A5.5, A5.12, A7c; `opm-es` exhibición-caracterización.
10. **Bitácora** — 2026-05-31 · hd-opm M18/manual §9.10. Regla: `SEPARAR ⟺ (1∧2)∧(3∨4)` · `COLAPSAR ⟺ ¬1∨¬2` (1 alcanzabilidad, 2 transición independiente, 3 proceso lo lee aislado, 4 override normativo). Bifurcación previa producto(AND)/coproducto(XOR).

> **Corrección 2.0:** la regla de decisión se lee con COLAPSAR ⟺ ¬SEPARAR; el principio (punto 2) se alinea a ella.


### LF-02 — Exhibición-caracterización como mecanismo de propiedad · Estado: consolidada · usa: LF-01
1. **Olor/gatillo** — tentación de crear procesos *Tener/Poseer/Asignar* para una propiedad; o colapsar una propiedad ortogonal en estado conjuntivo.
2. **Principio** — una propiedad de una cosa es un **atributo exhibido** (objeto-rasgo con su state set), no un proceso ni un estado conjuntivo.
3. **Mecanismo OPM** — realiza A5.6 (exhibición admite obj-exhibe-atributo, obj-exhibe-operación, proc-exhibe-atributo, proc-exhibe-operación), A5.8 (caracterización con estado especificado), A5.1 (proceso persistente → enlace estructural).
4. **Cuándo NO aplica** — **presupone LF-01**: si hay un solo eje relevante, usar **estados directos** (A5.12), no atributo. No promover a operación (proceso): la dimensión es rasgo, no acción. **Test de operación encapsulada**: un proceso es *operación* (rasgo procedimental "propio") de un objeto B **solo si** no tiene efecto sobre ni requiere ningún objeto fuera de B (solo afecta partes/rasgos/especializaciones de B); si toca algo externo, es un proceso de pleno derecho, no una operación encapsulada.

> **Corrección 2.0:** el test de operación encapsulada es `[endurecimiento]`: ISO no limita los enlaces de una operación (ISO §3.46, §14.2.1.3).

5. **Liftea a** — `opd-es` exhibición-caracterización; `opl-es` (sentencias `exhibe` + `puede estar`).
6. **Realización opforja** — helper `atributo` (value slot libre) o `atributoEstados` (estados discretos); enlace `exhibicion`; unfold `modo:"exhibicion"` aloja los atributos con estados completos. OPL: `**Obj** exhibe **Attr**.` + `**Attr** de **Obj** puede estar \`v1\`, \`v2\` o \`v3\`.`
7. **Ejemplo** — ✓`**Fetus** exhibits **Developmental Stage**; **Developmental Stage** of **Fetus** can be \`embryo\` or \`baby\`.` *(corpus OPM)*

> **Corrección 2.0:** ejemplo admitido por la excepción de nombre informativo de canon metodología A5.12a (mismo caso Fetus).

8. **Consecuencia si lo ignoras** — procesos espurios (*Tener*) inflan el modelo, o atributos colapsados a estados conjuntivos (cae en LF-01).
9. **Ancla SSOT** — A5.6, A5.8, A5.1, A5.12; `opm-es` relaciones estructurales fundamentales.
10. **Bitácora** — 2026-05-31 · hd-opm M18 (Colaborador → U5 por caracterización).

### LF-03 — Altitud por expresión/supresión de estados per-aparición · Estado: consolidada · ortogonal: LF-01
1. **Olor/gatillo** — SD raíz sobrecargado con ciclos de vida de habilitadores; el mismo objeto debe mostrar su ciclo completo en in-zoom pero solo elegibilidad en la raíz.
2. **Principio** — qué estados se **muestran** es decisión **por OPD**, independiente de cuántos ejes **tiene** la cosa (eso es LF-01).
3. **Mecanismo OPM** — realiza canon A3.6 (expresión/supresión); spec-OPD (supresión de estados).
4. **Cuándo NO aplica** — **NO** suprimir un estado conectado a un proceso en ese OPD (canon A3.6). No cambia identidad (no es LF-01).
5. **Liftea a** — spec-OPD (supresión per-aparición, derivada, solo en descomposición).

> **Corrección 2.0:** la supresión por OPD es general (canon metodología A3.6a, ISO §14.2.1.1); «solo en descomposición» atañe sólo a la supresión calculada entre niveles del producto.

6. **Realización opforja** — `Apariencia.estadosSuprimidos: Id[]` (lista per-OPD); visibilidad efectiva = `Estado.suprimido` global **∧** local (global domina, local refina).

> **Corrección 2.0:** la visibilidad se lee: oculto ⇔ suprimido-global ∨ suprimido-local.

7. **Ejemplo** — SD0 muestra `disponible` (compuerta de elegibilidad); el in-zoom muestra `disponible|ausente` con los procesos que la cambian. *(HODOM, ilustrativo)*

> **Corrección 2.0:** en ISO la supresión parcial lleva el símbolo y la frase «, y otros estados» (canon A3.9b).

8. **Consecuencia si lo ignoras** — o un raíz ilegible (>20-25 cosas), o la dinámica fina desaparece del in-zoom.
9. **Ancla SSOT** — canon A3.6; spec-OPD (supresión de estados).
10. **Bitácora** — 2026-05-31 · hd-opm M17.

### LF-04 — Objeto-frontera congelado entre sistemas composables · Estado: consolidada
1. **Olor/gatillo** — un "sistema" que en realidad son varios (red + establecimiento + programa + episodio); dos sub-equipos divergen sobre qué significa una entidad compartida.
2. **Principio** — modelar como sub-modelos composables; la interfaz es un **conjunto mínimo de objetos-frontera** con dueño declarado y estados **congelados**; el consumidor **referencia**, no redefine.
3. **Mecanismo OPM** — realiza A4.4 (contrato de interfaz de sub-modelo) + composición inter-modelo A4.1c.
4. **Cuándo NO aplica** — si el sistema es genuinamente uno solo; no congelar una interfaz prematura. La autoridad semántica vive en el modelo propietario.
5. **Liftea a** — `opm-es` composición inter-modelo; invariantes `manual` (interfaz congelada; referencia explícita propietario/consumidor).
6. **Realización opforja** — dos SD0 en el mismo bundle; objetos-frontera como entidades compartidas **sin refinar**; referencia por id persistente; tras crear, no agregar estados/enlaces a la compartida.
7. **Ejemplo** — 4 objetos-frontera congelados entre el sistema clínico (por-episodio) y el sistema-programa (por-institución): **Solicitud**, **Cupo**, **Cartera**, **Episodio**. *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo compuesto se vuelve incoherente; clásico fallo de integración (dos significados de la misma entidad).
9. **Ancla SSOT** — A4.4, A4.1c; `opm-es` composición.
10. **Bitácora** — 2026-05-31 · hd-opm §3.1 (structured cospan).

### LF-05 — Semi-plegado: altitud parcial sobre partes · Estado: consolidada · ortogonal: LF-03
1. **Olor/gatillo** — un todo con muchas partes/atributos satura el OPD, pero plegarlo entero pierde el contexto y dimensionalizar/extraer no corresponde.
2. **Principio** — mostrar un **subconjunto** de partes/atributos compactado *dentro* del todo, con indicador de los ocultos; altitud intermedia entre desplegado-total y plegado-total.
3. **Mecanismo OPM** — realiza el **plegado parcial** (símbolo de colección incompleta) de canon A3.2d, sobre partes/atributos.

> **Corrección 2.0:** semi-plegado (expresión visual sin OPL propia) y plegado parcial (colección incompleta, canon A3.2d) son cosas distintas.

4. **Cuándo NO aplica** — NO es supresión de estados (eso es LF-03); NO cambia identidad (no es LF-01); si la parte debe conectarse *fuera* del todo, **extraerla** (A4.5), no semi-plegarla.
5. **Liftea a** — `opd-es` plegado parcial / colección incompleta.
6. **Realización opforja** — `modoPlegado` por aparición (verificar soporte en opforja v0; en OPCloud es *semi-fold* con contador de partes ocultas y doble-clic para extraer una). OPL refleja "consta de X y N partes más".

> **Corrección 2.0:** el semi-plegado no emite OPL; el plegado parcial usa la oración de colección incompleta de spec-OPL («… y al menos otra parte»), no «N partes más».

7. **Ejemplo** — ✓ mostrar 2 de 8 categorías del **Plan** en un OPD denso, con indicador "…+6"; ✗ plegar el **Plan** entero perdiendo las 2 categorías relevantes a ese OPD. *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — o un OPD ilegible (>20-25), o pérdida total de contexto al plegar el todo.
9. **Ancla SSOT** — spec-OPD §10.12 (semi-plegado) y plegado parcial; ISO §14.2.1.2 (despliegue parcial/colección incompleta).
10. **Bitácora** — 2026-05-31 · libro Dori cap.21 + transcripciones OPCloud; reúso layout M14/M15/M16.

### LF-06 — Descomposición reactiva por eventos · Estado: propuesta
1. **Olor/gatillo** — subprocesos dentro de una descomposición que NO siguen orden fijo: cada uno se dispara por **su propio evento** (sistema reactivo: vigilancia, urgencia); la Línea de Tiempo vertical no aplica.
2. **Principio** — cuando el orden lo deciden eventos (no el tiempo), modelar cada subproceso activado por su evento desde estados/objetos distintos; no forzar verticalidad temporal.

> **Corrección 2.0:** ISO modela el refinamiento asíncrono con despliegue por agregación y un evento por subproceso (ISO §14.2.2.5, Figura 54; canon A3.2a); la variante por descomposición de esta lección es `[extensión]` y sólo admite eventos internos al contexto (canon A3.4d, A3.8).

3. **Mecanismo OPM** — descomposición + enlaces de **evento** a subprocesos (rompe la invocación implícita por línea de tiempo de A3.5).
4. **Cuándo NO aplica** — orden fijo → descomposición síncrona (A3.1); independientes sin orden ni evento → despliegue (A3.2). No confundir con el antipatrón "evento a subproceso no-primero" (A3.4): aquí *cada* subproceso tiene su evento, es legítimo.

> **Corrección 2.0:** los subprocesos disparados por evento sin orden fijo van también a despliegue por agregación (ISO §14.2.2.5).

5. **Liftea a** — spec-OPD (evento dentro de descomposición); A3.4 (evento de objeto ambiental cruza el contorno).
6. **Realización opforja** — un enlace de evento por subproceso; verificar render en opforja.
7. **Ejemplo** — ✓ vigilancia 24/7: `deterioro detectado`→*Respuesta clínica*, `falla de equipo`→*Sustitución*, cada uno por su evento, sin orden vertical. *(HODOM, ilustrativo)*
8. **Consecuencia si lo ignoras** — se impone una secuencia vertical falsa a procesos reactivos; el modelo miente sobre el orden de ejecución.
9. **Ancla SSOT** — spec-OPD (evento dentro de descomposición; activación asincrónica por eventos — patrón reactivo).
10. **Bitácora** — 2026-05-31 · opm-visual-es (activación asincrónica por eventos). **`propuesta`**: reúso≥2 no demostrado (solo caso HODOM); consolidar al segundo avistamiento.

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
3. **Mecanismo OPM** — resultado/consumo/efecto según corresponda; contradice la supresión por A5.2 solo cuando hay observación externa o función adicional.
4. **Cuándo NO aplica** — si el objeto se crea y consume de inmediato sin observación ni uso externo, aplicar A5.2 (objeto transiente → invocación). Si el uso externo es conjetura, marcar predicción/brecha, no hecho.
5. **Liftea a** — A5.2, A5.21, A7 brechas/predicciones.
6. **Realización opforja** — principio independiente de herramienta: conservar el intermedio cuando su doble uso explica arquitectura o abre una brecha. En opforja, expresarlo con el mínimo de objetos/enlaces necesarios y registrar la hipótesis fuera del nombre canónico; si la herramienta no soporta una vista compacta, la decisión metodológica no cambia.
7. **Ejemplo** — en glicólisis, varios metabolitos intermedios también son productos biosintéticos; el caso de `2PG` queda como predicción de funcionalidad adicional. *(Glicólisis, Fig. 6, ilustrativo)*
8. **Consecuencia si lo ignoras** — se borra el acoplamiento entre subsistemas, se pierden productos reales y no emergen brechas de conocimiento.
9. **Ancla SSOT** — A5.2, A5.21; A7.
10. **Bitácora** — 2026-05-31 · revisión paper/capturas glicólisis (Fudge & Reeves 2024, Fig. 6 y conclusión). **`propuesta`**.

### LF-10 — Control loop explícito: sensar, decidir, señalizar · Estado: propuesta · usa: LF-07
1. **Olor/gatillo** — aparece un **Sistema de control** o una capacidad "tunable/adaptable" sin mecanismos observables que lean estado, decidan y actúen.
2. **Principio** — descomponer el control en el trípode mínimo **sensado → decisión → salida/señal**, con los estados leídos y los procesos/estados controlados.
3. **Mecanismo OPM** — descomposición/despliegue según el caso; procesos si transforman información/estado, atributos exhibidos si son capacidades estructurales del controlador; enlaces de condición/evento/instrumento según firma.
4. **Cuándo NO aplica** — si el control es una restricción estática, usar atributo/estado; si el mecanismo es desconocido, declarar brecha; si el controlador pertenece a otro sistema, tratarlo como interfaz/sub-modelo.
5. **Liftea a** — A6 control de flujo; A5.26; A7 requisitos/brechas.
6. **Realización opforja** — principio independiente de herramienta: no dejar el control como caja muda cuando el objetivo es explicar adaptabilidad. En opforja, plasmar solo el nivel de sensado/decisión/salida que tenga evidencia o hipótesis declarada; si no se puede representar algún detalle, mantenerlo como brecha antes que inventarlo.
7. **Ejemplo** — en glicólisis, **Sistema de control** lee estados de glucosa/oxígeno/ATP/precursores, ejecuta *Toma de decisión* y emite **Salida de señal** que controla biosíntesis, metabolismo aeróbico y anaeróbico. *(Glicólisis, Fig. 6, ilustrativo)*
8. **Consecuencia si lo ignoras** — la adaptabilidad queda como palabra, no como arquitectura; no se puede localizar la falla de feedback ni derivar predicciones testeables.
9. **Ancla SSOT** — A6, A7, A5.14, A5.26.
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
10. **Bitácora** — 2026-05-31 · revisión caso externo `fpp`. **`propuesta`** por caso externo único.

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
10. **Bitácora** — 2026-05-31 · revisión caso externo `48384`. **`propuesta`**.

### LF-13 — Pre/Post condición como generador de contingencia · Estado: propuesta · usa: LF-12
1. **Olor/gatillo** — un subproceso tiene precondiciones/postcondiciones críticas, pero el OPD solo muestra el caso feliz o una excepción genérica.
2. **Principio** — cada precondición o postcondición crítica incumplida debe terminar en contingencia, espera, salto, mensaje, reparación o brecha explícita.
3. **Mecanismo OPM** — enlaces de condición/evento/instrumento, estados de existencia/verificación, procesos de manejo de disrupción, mensajes informacionales como resultado o efecto.
4. **Cuándo NO aplica** — condiciones triviales sin efecto de decisión; análisis de alto nivel donde la contingencia se declara fuera de alcance. Si se omite por alcance, debe quedar anotado.
5. **Liftea a** — A6, A7 errores, A8 simulación conceptual; A5.32.
6. **Realización opforja** — principio independiente de herramienta: no dejar fallas críticas como silencio semántico. En opforja, usar los enlaces y estados disponibles más simples; si el detalle excede el nivel, registrar la brecha.
7. **Ejemplo** — en OPM-TA, precondición impropia genera contingencia o mensaje informativo; postcondición impropia genera mensaje/reparación. *(48384, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo simula un procedimiento que solo funciona cuando todo sale bien y no puede explicar recuperación ni error humano-máquina.
9. **Ancla SSOT** — A6, A7, A8; `urn:fxsl:kb:icas-calidad-riesgo` (resiliencia como recuperación) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión caso externo `48384`. **`propuesta`**.

### LF-14 — Ruta primaria y carriles de valor/soporte · Estado: propuesta
1. **Olor/gatillo** — una arquitectura SoS/CPS densa muestra muchos componentes y procesos, pero no se distingue qué transforma valor, qué soporta y qué queda contextual.
2. **Principio** — separar operandos, procesos de valor, instrumentos de valor, soporte e interfaces/contexto; luego extraer una ruta primaria antes de profundizar.
3. **Mecanismo OPM** — layout/vista metodológica + descomposición o simplificación A4.5 para la ruta que efectivamente entra al árbol formal.
4. **Cuándo NO aplica** — sistemas pequeños o dominios donde forzar "valor/soporte" oculta agencia, cuidado, gobernanza o red. No convertir carriles en semántica OPM.
5. **Liftea a** — A4.6, A5.29, A4.5; LF-08 si la interfaz crítica debe entrar al in-zoom.
6. **Realización opforja** — principio independiente de herramienta: usar carriles como lectura y selección de altitud. En opforja, el resultado debe expresarse como OPD normal; no depende de swimlanes nativos.
7. **Ejemplo** — en blockchain-CPS, la arquitectura separa operandos y procesos/instrumentos de valor/soporte, luego extrae la vía `Collecting → Monitoring → Processing → Optimizing → Adjusting`. *(block, ilustrativo)*
8. **Consecuencia si lo ignoras** — el OPD denso se vuelve inventario de piezas y no explica la cadena de valor ni las fronteras de soporte.
9. **Ancla SSOT** — A4.1 vistas no ontológicas, A4.5, A4.6; `urn:fxsl:kb:icas-escala` (SoS y boundary objects) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión caso externo `block`. **`propuesta`**.

### LF-15 — Intención-función-forma para alternativas morfológicas · Estado: propuesta
1. **Olor/gatillo** — se modelan tecnologías candidatas en el SD antes de declarar qué función solution-neutral cumplen.
2. **Principio** — mantener intención y función separadas de la forma; especializar formas solo después de fijar la función que realizan.
3. **Mecanismo OPM** — generalización-especialización para alternativas de forma; enlaces estructurales etiquetados o vistas de contribución para intención/atributos de desempeño; SD agnóstico mientras haya opciones.
4. **Cuándo NO aplica** — arquitectura ya decidida y objetivo descriptivo; o una tecnología impuesta por norma/contrato, en cuyo caso declararla como requisito prescriptivo/declarado, no como inferencia.
5. **Liftea a** — A0.1, A0.2, A0.3, A5.13, A7 fuerza epistémica.
6. **Realización opforja** — principio independiente de herramienta: preservar alternativas sin mezclar función con implementación. En opforja, usar gen-spec y trazas simples; si el espacio combinatorio crece, pasar a LF-16.
7. **Ejemplo** — en blockchain-CPS, `Computing`, `Connecting`, `Controlling` se mantienen como funciones, mientras `AI Model`, `Smart Contract` o `Blockchain` son formas especializadas. *(block, ilustrativo)*
8. **Consecuencia si lo ignoras** — el modelo sobrepromete una solución y pierde la comparación de arquitecturas; los requisitos inferidos se confunden con decisiones de diseño.
9. **Ancla SSOT** — A0, A5.13, A7; `urn:fxsl:kb:icas-procesos` (diseño como factorización Needs→Architecture→Capabilities) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión caso externo `block`. **`propuesta`**.

### LF-16 — Configuración como selección de instancias para tradeoff · Estado: propuesta
1. **Olor/gatillo** — hay variantes del mismo objeto/proceso y se quiere elegir por seguridad, costo, tiempo, riesgo u otro atributo de desempeño.
2. **Principio** — representar el modelo genérico y las variantes como especializaciones/instancias configurables; comparar configuraciones por métricas declaradas.
3. **Mecanismo OPM** — generalización-especialización o clasificación-instanciación; multiplicidad/selección como decisión de configuración; A7 métricas y simulación de configuraciones.
4. **Cuándo NO aplica** — variantes irrelevantes para la decisión; espacios combinatorios enormes sin criterio de poda; restricciones normativas que fijan una única opción.
5. **Liftea a** — A5.37, A7 simulación de configuraciones, A8 validación por niveles.
6. **Realización opforja** — principio independiente de herramienta: conservar alternativas vivas hasta compararlas. En opforja puede realizarse con especializaciones, instancias o catálogo externo; la herramienta no necesita enumerar automáticamente todas las combinaciones para que el principio aplique.
7. **Ejemplo** — en IoT security, `4-Digit Password` y `6-Digit Password` son alternativas configurables de `Entered Password`, evaluadas por nivel de seguridad del proceso. *(securing, ilustrativo)*
8. **Consecuencia si lo ignoras** — las variantes quedan como estados falsos o decisiones prematuras; el tradeoff no es reproducible.
9. **Ancla SSOT** — A5.13, A5.20, A7, A8; `urn:fxsl:kb:icas-calidad-riesgo` (quality attributes dependen de configuración) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión caso externo `securing`. **`propuesta`**.

### LF-17 — Aspecto transversal cuantificable como overlay gobernado · Estado: propuesta · usa: LF-02, LF-16
1. **Olor/gatillo** — seguridad, costo, riesgo, energía o usabilidad se tratan como documento aparte o como requisito plano sin relación con objetos/procesos.
2. **Principio** — un aspecto transversal puede modelarse como atributos exhibidos por objetos/procesos y procesos de cálculo/agregación, con polaridad y umbral declarados.
3. **Mecanismo OPM** — exhibición-caracterización; atributos cuantitativos; proceso computacional; trazas estructurales a requisitos/criterios de decisión.
4. **Cuándo NO aplica** — si el aspecto es puramente cualitativo en el alcance; si la métrica no tiene interpretación acordada; si la norma fija mínimos, esos mínimos siguen siendo prescriptivos y no se negocian por tradeoff.
5. **Liftea a** — LF-02, A5.36, A7 métrica para tradeoff.
6. **Realización opforja** — principio independiente de herramienta: gobernar el overlay como método, no como dependencia de estereotipos de una plataforma. En opforja, usar atributos, aliases/metadatos o catálogo externo; no redefinir primitivas.
7. **Ejemplo** — en IoT security, medidas de seguridad y procesos exhiben niveles cuantitativos agregados para comparar configuraciones. *(securing, ilustrativo)*
8. **Consecuencia si lo ignoras** — los atributos de calidad quedan invisibles o se convierten en claims no auditables; comparar diseños se vuelve opinión.
9. **Ancla SSOT** — LF-02, A7, A5.36; `urn:fxsl:kb:icas-calidad-riesgo` (quality attributes como funtores de medición) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión caso externo `securing`. **`propuesta`**.

### LF-18 — Pipeline predictivo empírico-sintético para digital twin · Estado: propuesta · usa: LF-10
1. **Olor/gatillo** — un modelo digital twin/ML mezcla operación física, datos empíricos, simulación, datos sintéticos y predicción sin trazabilidad de procedencia.
2. **Principio** — separar proceso físico, producción de datos empíricos, simulación/datos sintéticos y modelado predictivo; declarar qué dato alimenta qué decisión.
3. **Mecanismo OPM** — procesos físicos e informacionales en un mismo in-zoom; objetos informacionales de datos/modelos; ecuaciones/simuladores como instrumentos o procesos computacionales según A7.
4. **Cuándo NO aplica** — sistemas sin uso predictivo; simulación conceptual sin datos; ML usado como caja externa fuera de alcance. Si la fuente de datos es desconocida, marcar brecha.
5. **Liftea a** — A1.4, A7 procedencia de datos, A5.30, A5.31, LF-10 si hay control adaptativo.
6. **Realización opforja** — principio independiente de herramienta: distinguir procedencia y rol de cada dato. En opforja, usar objetos informacionales y enlaces OPM simples; no detallar algoritmos si no afectan la arquitectura.
7. **Ejemplo** — en torneado optimizado, *Machining* produce datos empíricos, *Simulating* produce datos sintéticos, y *Modeling* requiere ambos para predecir rugosidad/desgaste. *(SE_8233, ilustrativo)*
8. **Consecuencia si lo ignoras** — el digital twin parece una caja predictiva sin evidencia; no se puede auditar si una predicción viene de medición, simulación o supuesto.
9. **Ancla SSOT** — A7, A8, A5.30, A5.31; `urn:fxsl:kb:icas-procesos` (trazabilidad vertical) como lente formal.
10. **Bitácora** — 2026-05-31 · revisión caso externo `SE_8233` y contraste con `fpp`. **`propuesta`**.

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
10. **Ancla SSOT** — `opm-iso-19450-es` §Enlaces transformadores con estado especificado / §Resolución de salida en efecto con solo estado de entrada, §Glosario (`Valor de atributo`) + §Valores de atributos, §Propiedades genéricas (`Herencia de afiliación`). El canon no prohíbe estados sin escritor: esta es disciplina de forja con autoridad de mesa, no ley ISO.
11. **Bitácora** — 2026-06-05 · origen: Mesa 7 hd-opm, consenso 3-0; plasmada localmente y verificada por barrido antes de ascender a metodología agnóstica.

---

# Apéndice F — Realización opforja (bundle `deep-opm-pro.modelo.v0`)

El intercambio con la herramienta usa el documento JSON `{ "formato": "deep-opm-pro.modelo.v0", "modelo": {...} }`. Núcleo del modelo tipado (lo que el método produce):

- **entidades** — `{id, tipo: objeto|proceso, nombre, esencia: fisica|informacional, afiliacion: sistemica|ambiental, descripcion?, esAtributo?, valorSlot?, refinamientos?}`. Atributo discreto: `esAtributo:true` **sin** `valorSlot` + estados.
- **estados** — `{id, entidadId, nombre, esInicial?, esFinal?, designaciones?, suprimido?}`. La app no acepta un único estado (≥2). Supresión **global** vía `suprimido`; supresión **per-aparición** vía `Apariencia.estadosSuprimidos[]` (LF-03).

> **Corrección 2.0:** «La app no acepta un único estado (≥2)» es `[endurecimiento]` del producto: ISO define objeto con estados sin mínimo (ISO §3.66).

- **enlaces** — `{id, tipo, origenId, destinoId, etiqueta?, estadoEntradaId?, estadoSalidaId?, multiplicidadDestino?}`. Tipos: `exhibicion`, `agregacion`, `agente`, `instrumento`, `efecto`, `resultado`, `consumo`, `invocacion`, `etiquetado`, etc.
- **refinamientos** (en la entidad) — `descomposicion: {opdId}` (in-zoom, contorno) | `despliegue: {opdId, modo: agregacion|exhibicion|generalizacion|clasificacion}` (unfold).
- **apariciones** (por OPD) — `{id, entidadId, opdId, x, y, width, height, contextoRefinamiento?, estadosSuprimidos?}`.
- **opds** — `{id, nombre, padreId, apariencias, enlaces, ordenLocal?}`. Árbol por `padreId`.

**Reglas de realización.** Nombres idénticos entre OPD/OPL/bundle. Toda referencia entre OPDs internamente consistente o la app rechaza el import. Omitir campos opcionales antes que inventarlos (la app normaliza). No emitir `formato` distinto. Exportación = instantánea, no fuente de verdad.

**Divergencias OPL operativas.** La autoridad viva sobre realización OPL y su trazabilidad es `urn:fxsl:kb:spec-forja-opl-es` §20. Este método no mantiene un inventario paralelo: al emitir bundles, delegar toda duda de generación, parseo o roundtrip a esa spec. Estado sincronizado 2026-06-04: el catálogo cubierto por fixtures OPL queda en bisimetría estricta; las exclusiones vivas son modificadores complejos, rutas, refinamientos y abanicos avanzados según el catálogo de fixtures.

**Auto-normalización verificada.** La app normaliza al hidratar (omitir campos opcionales antes que inventarlos). Esencia: conectar un objeto como atributo (exhibición-caracterización) tiende a coaccionarlo a **informacional**; el enlace de **agente** solo se ofrece desde cosas físicas (humanas) — dejar que la UI normalice en vez de pelear con ella. *(Verificar el alcance exacto de la coerción en la versión vigente de opforja.)*

> **Corrección 2.0:** esencia física no equivale a humano: un robot es físico y es instrumento (ISO §3.30); el filtro por esencia física es una aproximación del producto.


## F.1 Capacidades-objetivo (OPCloud — ⚠ NO verificadas en opforja v0)

Técnicas observadas en **OPCloud** (la herramienta de referencia OPM, análoga a opforja). Se listan como **capacidad-objetivo / aspiracional**, NO como features operables de opforja v0 — **verificar disponibilidad antes de instruir sobre ellas** (anti-magia). Mapean a secciones del método indicadas:

- **OPL-pane bidireccional** (editar el modelo desde el texto: doble-clic en nombre/enlace abre su editor). → A8 bimodalidad.
- **Construir abanico XOR/OR arrastrando el enlace al mismo puerto** ya enlazado; sacarlo lo rompe. → A6.
- **Distribuir/recolectar enlace del contorno** a todos los subprocesos con un botón. → A3.4.
- **Resolver booleano de decisión** de 4 formas: estado fijo (enlace a estado) / 50-50 (a objeto) / función computacional / porcentajes explícitos. → A6.
- **Split input/output link**: transición *hacia*/*desde* un estado no especificado. → A3.4.
- **Ontología de organización** con enforcement none/suggest/enforce (term canónico + sinónimos). → A5.15 (alto valor para corpus con glosario canónico).
- **Requisitos**: satisfied-requirement-set sobre cosas y enlaces; *requirement views* read-only auto-generadas; estereotipo de requisito (id, descripción, hard/soft, actor). → A7 `satisface`.
- **Grilla** para alinear alturas de subprocesos (paralelismo/secuencia precisos). → A3.1.
- **Análisis de modelo**: informativity grading (clasifica OPL, detecta precedencias/in-out faltantes), missing-knowledge identification (ML, umbral de confianza), generación de requisitos por IA. → mecaniza A8.
- **Sub-modelo** (realización de LF-04): gesto "connect submodel" sobre el thing mínimo (1 objeto + 1 proceso por exhibición e instrumento; **un solo proceso**; sin refinar); nombre `<main> <sub>` controlado desde el padre; lazy-load; tres estados de sync (descargado / cargado-sincronizado / cargado-no-sincronizado); compartidas se ven transparentes; desconectar es irreversible y en ambos lados.

## F.2 Runtime opforja — condiciones y bucles (estado verificado 2026-06-03)

Realización canónica implementada en `deep-opm-pro` sin copiar gestos OPCloud ni añadir primitiva OPM:

> **Corrección 2.0:** el runtime descrito es política de la herramienta, no hecho OPM (reglas R-EJEC-10).


- **Condición `c`** sobre consumo, efecto, agente o instrumento: si el objeto/estado condicionante no existe o no está vigente, la traza marca el proceso como `omitido`, no aplica transiciones/cambios/duración/salidas y avanza al siguiente paso secuencial.
- **Múltiples condiciones**: AND para ejecutar; OR para omitir. La omisión por condición precede a cualquier espera o diagnóstico por precondición no condicional.
- **Invocación explícita** `Proceso → Proceso`: al terminar el proceso origen, la simulación salta al proceso destino como siguiente paso lógico.
- **Autoinvocación**: se ejecuta como bucle por invocación al mismo proceso. El bucle terminal canónico usa una condición/decisión que, al fallar, omite el proceso y permite salir. Un límite de seguridad bloquea bucles sin salida y deja diagnóstico runtime.
- **Limitación conocida**: la ausencia de objetos sin estados no se infiere todavía como token consumible; para expresar ausencia/presencia ejecutable usar estados explícitos `existente`/`no-existente` o estado específico del objeto condicionante.
- **Artefactos ejecutables**: rutas de código de la versión 1.x, retiradas (no existen en el repositorio; constan en el mapa de cambios).

---

## Bitácora del artefacto

| Fecha | Cambio |
|---|---|
| 2026-05-31 | v1.0.0 — destilación korificada autónoma del manual metodológico (v3.0.0) + LF-01..LF-04 + realización opforja. Forjado por la mesa Asto·Besto·Resto (hd-opm). Enmiendas integradas: precedencia por planos ortogonales + lifting (Besto), invariante de pureza OPM (Asto), frontera ontológica/per-aparición + campo "cuándo no aplica" (Resto), grafo de lecciones + 3 gates de admisión (Besto), molde de 10 campos + "consecuencia si lo ignoras" (Asto). |
| 2026-05-31 | v1.1.0 — barrido de 6 fuentes (3 capas SSOT iso/opl/visual, libro Dori 24 cap, curso atómico, transcripciones OPCloud) por 4 revisores; 25 clusters adjudicados por la mesa Asto·Besto·Resto. **Nuevo**: A0 fase pre-SD (≥3 conceptos + función-vs-comportamiento); A2.3 nombrado (escala gerundio/nominalización, nombrar agregados) + esencia por defecto; A3.3 descomposición de objeto espacial-2D + alcance inner/outer; A3.4 precedencia al abstraer (puntero a opd-es §13, sin copiar matriz) + migración al primer subproceso; A3.1/A4.2/A4.3 notas (orden vertical semántico, banda 5-10 niveles, importancia=altitud); A5.14 test del proceso (3 criterios), A5.21 estado-vs-identidad, A5.22 objeto-específico-de-estado, A5.23 n-arias→binarias; A6 temporización/self-invocation/NOT compacto/skip>wait; A7 excepción cantidad<tasa×duración + rango soft/hard; A8 bimodalidad activa + simulación conceptual como gate; **LF-05 semi-plegado** (consolidada), **LF-06 descomposición reactiva** (propuesta); LF-02 test de operación encapsulada; Apéndice F.1 capacidades-objetivo OPCloud (rotuladas no-verificadas, anti-magia). Rechazados por la mesa como semántica/visual pura (quedan en su capa): matriz de precedencia completa, reciprocidad/transitividad, propiedades del fork, relatividad de instancia. |
| 2026-05-31 | v1.2.0 — revisión profunda de paper/capturas glicólisis (Fudge & Reeves 2024, Fig. 5-7) como práctica real OPM/OPCloud. **Nuevo**: A1.3 modo reverse/MBRSE observación→requisito→modelo→brecha→predicción; A5.24 estados de existencia/disponibilidad cualitativa; A5.25 intermedio con uso externo; A5.26 control loop explícito; A5.27 numeración local; A7 expandido para requisitos inferidos, layering, brechas y predicciones; A8 ledger de investigación; **LF-07 requisito inferido como sonda**, **LF-08 interfaz crítica como paso 0**, **LF-09 intermedio dual**, **LF-10 control loop explícito** (todas propuestas por caso externo único, pendientes de consolidación por reúso). |
| 2026-05-31 | v1.2.1 — ajuste de mesa Asto·Besto·Resto: A7 distingue requisito normativo/declarado/inferido y bloquea tratar inferencias como norma o hecho demostrado; LF-08/LF-09/LF-10 declaran `usa: LF-07`; campo de realización reformulado como principio metodológico general, adaptado a opforja pero no dependiente de capacidades específicas de la herramienta. |
| 2026-05-31 | v1.3.0 — revisión profunda y paralelizada de cinco casos OPM reales: OPM-TA humano-máquina (`48384`), blockchain/AI CPS (`block`), digital twin FPP (`fpp`), torneado optimizado/DT (`SE_8233`) y seguridad IoT configurable (`securing`). **Nuevo/refinado**: A0.3 intención→función→forma; A1.4 modos de aplicación real; A2.1 degradación como atributo medido; A2.4-A2.6 lentes SD, anti-función y beneficio stakeholder; A3.1 límite práctico de ~5 subprocesos procedimentales; A3.3 guard vista vs mecanismo; A4.6 viewpack arquitectónico; A5.28-A5.38; A7 métricas con polaridad, fórmula como instrumento, procedencia de datos y simulación de configuraciones; A8 simulación tras edición significativa, validación por niveles y validación stakeholder; **LF-11..LF-18** como propuestas. Mesa: no elevar extensiones de herramienta ni decisiones de caso a norma OPM; todos los principios quedan como método lifteable y general, con opforja solo como adaptación. |
| 2026-06-03 | v1.4.0 — A0.4 equivalencia funcional de realizaciones alternativas (cierre de A0.1): dos realizaciones son intercambiables si comparten **firma de frontera** (roles netos sobre entidades de frontera, abstrayendo el interior); A0.4a criterio operativo in-zoom↔out-zoom (la descomposición DEBE preservar la frontera del proceso abstracto; checker `DESCOMPOSICION_NO_PRESERVA_FRONTERA`). Lectura categorial (2-célula/equivalencia, `urn:fxsl:kb:icas-higher-categories`) bajo la superficie, nunca expuesta al modelador; verificada en deep-opm-pro (capa categorial F2). Coherente con `reglas-opm-estrictas-es §Anexo C / R-CAT-EQ`. |
| 2026-06-03 | v1.4.1 — condiciones y loops ejecutables en opforja: `c` como bypass/omisión, múltiples condiciones AND/OR, invocación como salto de proceso, autoinvocación como bucle con salida condicional y límite runtime. Anclado a `reglas-opm-estrictas-es R-EJEC-7..10` y leyes de simulación/integración Ss↔Fs. |
| 2026-06-04 | v1.4.2 — remediación de trazabilidad KORA: `relations.cites` declara `spec-forja-opl` e ICAS usadas como lentes; Apéndice F deja de duplicar inventario OPL v0 y delega el estado vivo a `spec-forja-opl` §20 / catálogo de fixtures. |
| 2026-06-04 | v1.4.3 — corrección A0.4a: opforja sí puede verificar realizaciones hermanas mediante `verificarEquivalencia`; la ley in-zoom↔out-zoom queda como caso vertical complementario, no como sustituto por ausencia de autoría de variantes. |
| 2026-06-04 | v1.4.4 — integración de familia Forja: precedencia por planos (validez, modalidad, método, formal) y regla explícita de no duplicación frente a `reglas-opm-estrictas`, `spec-forja-opd`, `spec-forja-opl` y `opm-categorial`. |
| 2026-06-05 | v1.5.0 — ascenso metodológico desde Mesa 7 hd-opm (consenso 3-0): LF-19 integridad de estados por flujo, caracterización y ambiental-observado; A8 añade advertencias de auditoría sobre barridos en JSON y validación previa de métricas contra SSOT semántica. |
| 2026-06-12 | v1.5.1 — auditoría de coherencia del corpus 2026-06-12: A2.1 lifteado a `reglas-opm-estrictas-es` R-AG-3/R-AG-4 (la vía «instrumento + atributo medido» queda condicionada a ratificación previa en reglas como extensión declarada, p.ej. R-AG-3A; condición de mantenimiento alineada a alcance declarado/exclusión declarada); A8 «métrica antes que conclusión» comprimida a referencia a LF-19.3 (se retira la narrativa del incidente 99-vs-8); LF-19.4 abstraído a declaración explícita y auditable de caracterización (el literal `Coproducto XOR-n` y su parseo por barrido bajan al nuevo campo 9 «Realización opforja» de LF-19, conforme al molde B; la acusación por defecto permanece en el método); anclas SSOT corregidas por misatribución de capa: LF-05.9 (`opd-es` §10.12 semi-plegado; se añade `manual` §7.2) y LF-06.9 (`opd-es` §9.3, no `manual`). |
| 2026-07-07 | v1.6.0 — arranque bottom-up de primera clase (HITL custodio): **A1.5 nueva** (bosquejo → reconciliación → SD0 como hermano legítimo del SD-primero, bajo la misma ley de equivalencia OPD↔OPL y la función-semilla A1.1; el bosquejo es OPM legítimo con rigor de cierre relajado — los juicios de validez de método se observan, no bloquean; la integridad estructural NUNCA se relaja; la reconciliación cobra el rigor al graduar; sin mecanismo de refinamiento nuevo — se incorpora por **adopción**, spec-opd §10.4 R-OPD-REF-20, convergente por construcción con el top-down) + nota de preámbulo en A2 (el asistente de 11 etapas realiza el arranque SD-primero; el bottom-up no pasa por el asistente hasta la reconciliación, donde las 11 etapas se exigen sobre el SD resultante). Realiza la doctrina bottom-up resuelta 2026-07-06 y el working-artifact deep-opm-pro (documento de diseño del 2026-07-06, ausente del repositorio). *(Fila de bitácora repuesta 2026-07-09: la enmienda ya constaba en frontmatter/título; se completa el registro.)* |
| 2026-07-18 | v1.6.1 — corrección epistémica: igualdad de firma de frontera pasa a equivalencia observacional relativa y condición necesaria de sustitución; no implica identidad, bisimulación ni equivalencia categorial. La lectura de fibración queda como hipótesis hasta construir lifts cartesianos. |
| 2026-07-27 | v1.7.0 — separa los ciclos reversibles de documento (Apunte ⇄ Modelo) y componente (Boceto ⇄ OPD integrado); reserva Taller para el espacio global, incorpora Reabrir y Devolver como inversas preservantes, permite graduación explícita con pendientes cuando la integridad está sana y separa integración, cierre, export canónico y validación humana. |
| 2026-10-10 | perfil `metodo-opforja` — recibe del canon `metodologia-forja-opm-es` v1.7.0 el flujo de producto, el catálogo de lecciones, los casos externos, las lentes ICAS, OPCloud, el Apéndice F y esta bitácora; el canon pasa a 2.0.0 (sólo ISO 19450 y método `[guía]`). |
