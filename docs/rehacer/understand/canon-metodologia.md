# Dossier normativo — `metodologia-forja-opm-es` v1.7.0

Fuente: `canon/metodologia-forja-opm-es/content.md` (leído completo, líneas 1–698: frontmatter, §0, Parte A A0–A8, Frontera rectora, Parte B B.0/B.1 + LF-01..LF-19, Apéndice F + F.1 + F.2, Bitácora).

Convención de este dossier. Cada entrada lleva:
- **Obligación**: tal como la escribe el canon (DEBE / NO DEBE / DEBERÍA / PUEDE / PROHIBIDO / "invariante"). Si el texto no trae verbo modal, se marca `inferido` y se explica por qué.
- **Herramienta**: IMPEDIR · ADVERTIR · GENERAR-OPL · PARSEAR-OPL · RENDERIZAR · OPERACIÓN · MODELO-DE-DATOS · IMPORT/EXPORT · SOLO-MÉTODO (disciplina del modelador humano, no pide feature) · NO-APLICA.

Regla de lectura clave para la herramienta, derivada de §0.1 y §0.2: **este documento es capa de método, "no es norma bloqueante"**. Solo puede producir *bloqueos* en la herramienta lo que el propio texto ancla en `reglas-opm-estrictas-es` (lifting) o lo que declara como integridad estructural (A1.5, A8.1 nivel 1, Apéndice F import). Todo lo demás es, a lo sumo, advertencia (A8.1 niveles 2–3) o disciplina humana sin feature.

---

## 1. Lo que este documento le pide realmente a la herramienta (síntesis)

1. **Bimodalidad viva**: tras cada edición gráfica debe verse la oración OPL generada (A8.1 "Bimodalidad activa"); todo OPD tiene su párrafo OPL (A8.2).
2. **Panel de validación tripartito** con severidades CRÍTICA (bloquea) / ALTA-MEDIA (avanza declarando issue) / BAJA (estilo) (A8.1). Barridos sobre el modelo/JSON, nunca sobre el OPL (A8.2 advertencias).
3. **Refinamiento**: descomposición (in-zoom, orden vertical semántico, paralelismo por bordes superiores alineados, contorno grueso), despliegue en 4 modos (agregación, exhibición, generalización, clasificación) con colección incompleta, expresión/supresión de estados global y por aparición, semi-plegado por aparición (A3, A4.1, LF-03, LF-05).
4. **Reglas de contorno** del proceso descompuesto: consumo, resultado y evento sistémico PROHIBIDOS en el contorno exterior; agente/instrumento/efecto permitidos (A3.4). Precedencia al abstraer `Consumo = Resultado > Efecto > Agente > Instrumento` (A3.4).
5. **Identidad**: OPD con id persistente distinto de la etiqueta `SDx.y` (A4.3); 1:1 cosa↔nombre canónico y reúso por nombre = nueva aparición de la misma entidad (§9.15, Apéndice F); solo OPDs hoja eliminables (A4.3); alcance interno/externo no cambia por reposicionar (A3.3).
6. **Ciclos reversibles** de A1.5: documento Apunte ⇄ Modelo (Graduar / Reabrir) y componente Boceto ⇄ OPD integrado (Integrar como… / Devolver a Bocetos), con integridad constante y bloqueo de export canónico en régimen Modelo si hay Bocetos pendientes.
7. **Formato de intercambio** JSON `{ "formato": "deep-opm-pro.modelo.v0", "modelo": {...} }` (Apéndice F), rechazo de import con referencias inconsistentes, ≥2 estados por entidad con estados.
8. **Runtime de simulación** (si existe): condición `c` = omisión visible en traza, AND para ejecutar/OR para omitir, omisión precede a espera, invocación como salto, autoinvocación como bucle con límite de seguridad y diagnóstico (A6, A7, A8.1, F.2).
9. **Advertencias metodológicas** opcionales pero anunciadas: `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (A0.4a, pasivo), OPD > 20–25 entidades, refinamiento que no agrega nada, subproceso sin transformado, descomposición <2 subprocesos, estado de flujo sin escritor (LF-19), mezcla infinitivo/nominalización (A2.3).

Casi todo el resto (A0, A1.1–A1.4, las 11 etapas como pensamiento, A2.1, A2.4–A2.6, la mayoría de §9.x, A7, ledger, stakeholder, LF-07..LF-18, B.0/B.1) es **método humano**: no exige features, solo que las primitivas OPM ordinarias estén disponibles.

---

## 2. §0 Contrato

**§0.1 Naturaleza** · Obligación: declarativa · Herramienta: condiciona severidad.
"Capa de **método**: orienta *cómo* construir un hecho OPM válido y *en qué orden*. No es norma bloqueante ni redefine primitivas."
→ Consecuencia: ninguna regla nacida solo del método debe implementarse como bloqueo duro; se implementa como ADVERTIR (niveles 2–3 de A8.1) o no se implementa.

**§0.2 Precedencia por cuatro planos ortogonales** · Obligación: declarativa ("*ninguna lección o procedimiento autoriza un hecho que la norma prohíbe, ni redefine una primitiva*") · Herramienta: arquitectura de validación.
- Plano de validez: `reglas-opm-estrictas-es` decide validez, severidad y extensiones.
- Plano modal: `spec-forja-opd-es` (OPD/visual) y `spec-forja-opl-es` (OPL/roundtrip). "Ninguna spec modal redefine validez nuclear."
- Plano de método: este documento, atado por **lifting**. "La norma no deroga el método (un modelo puede ser **conforme-pero-malo**; eso es lo que el método cubre)."
- Plano formal: `opm-categorial-es` (no pertenece al canon entregado).
- Lente fibración: "opcional y aún hipotética".
→ Herramienta: los bloqueos provienen de `reglas`; las advertencias de método nunca desbloquean algo que `reglas` prohíbe (IMPEDIR prevalece sobre ADVERTIR). El plano formal y la fibración: NO-APLICA.

**§0.3 Invariante de pureza** · Obligación: declarativa · Herramienta: SOLO-MÉTODO (redacción).
Principios en primitivas OPM (objeto, proceso, estado, enlace, exhibición-caracterización, descomposición, despliegue); dominio solo como ejemplo etiquetado; categorías solo al margen.
→ Consecuencia indirecta: la herramienta no necesita vocabulario de dominio ni de teoría de categorías.

**§0.4 Autonomía y no duplicación** · Obligación: "NO DEBE duplicar la matriz de validez de `reglas-opm-estrictas-es`, la geometría completa de `spec-forja-opd-es`, las plantillas completas de `spec-forja-opl-es` ni la explicación categorial".
→ Herramienta: las plantillas OPL y reglas geométricas que aparecen aquí son **parciales**; la autoridad de realización está en las dos specs modales. NO-APLICA directo.

**§0.5 Cómo leer** · Obligación: verbos es-CL DEBE/DEBERÍA/PUEDE; "Tipografía canónica en ejemplos: objeto **negrita**, proceso *cursiva*, `estado` en backticks. Ejemplos en bimodalidad OPD↔OPL."
→ Herramienta: `inferido` PUEDE — si el panel OPL usa tipografía, debería ser coherente con esta (objeto negrita, proceso cursiva, estado monoespaciado). Confirmar contra `spec-forja-opl-es`.

---

## 3. Parte A — Método

### A0. Fase pre-SD

**A0.1 Divergencia de conceptos** · DEBERÍA · SOLO-MÉTODO.
"el modelador **DEBERÍA** generar **≥3 conceptos de solución** distintos, destilar el concepto central de cada uno y explicitar sus supuestos; recién entonces comprometer la arquitectura."

**A0.2 Función vs. comportamiento** · inferido (guard) · SOLO-MÉTODO.
"**Función** = el valor para el beneficiario (qué/para quién, subjetivo). **Comportamiento** = cómo cambia el sistema en el tiempo (objetivo)." "Mantener la función **agnóstica de arquitectura** mientras existan alternativas vivas."

**A0.3 Intención → función → forma** · DEBERÍA · SOLO-MÉTODO.
Separar (1) intención/valor, (2) funciones solution-neutral, (3) formas solution-specific; formas por generalización-especialización; "la capa funcional no debe heredar nombres de tecnología antes de decidir la arquitectura."

**A0.4 Equivalencia observacional de realizaciones alternativas** · declarativa · NO-APLICA (criterio de comparación humano).
"La misma **firma de frontera** —roles netos sobre las entidades declaradas— las hace indistinguibles **para esos observables**. No garantiza sustituibilidad total [...] Esta es equivalencia observacional relativa, no equivalencia categorial por sí sola." "jamás expuesta al modelador".

**A0.4a Criterio operativo en opforja** · dos obligaciones:
- "Opforja PUEDE confirmar igualdad de firma para dos OPDs comparables; el resultado significa equivalencia respecto de la frontera modelada, no identidad ni bisimulación." → PUEDE · OPERACIÓN opcional (candidata a omitir, ver §9 sobreingeniería).
- "toda **descomposición** DEBE preservar la firma de frontera de su proceso abstracto. Añadir o quitar un rol prueba diferencia funcional visible; conservar todos los roles es condición necesaria, no siempre suficiente. Violación detectable: `DESCOMPOSICION_NO_PRESERVA_FRONTERA` (pasivo)." → DEBE (sobre el modelo) · ADVERTIR (pasivo = no bloqueante). Código de diagnóstico textual: `DESCOMPOSICION_NO_PRESERVA_FRONTERA`.

### A1. Principio rector y clasificación

**A1.1 Regla rectora** · DEBE (dirigido al modelado) · SOLO-MÉTODO.
"El modelado **DEBE** empezar por la **función**, seguir con valor/agentes/entorno/transformados, y solo después profundizar en estructura, control, simulación y gobernanza. [...] el SD precede a todo refinamiento **integrado en el árbol**, aunque un Boceto bottom-up pueda existir antes de decidir ese SD; la claridad local nunca viola la completitud global; toda heurística está subordinada a la equivalencia OPD↔OPL y a la unicidad del hecho. **Práctica real = middle-out** [...]".
→ Herramienta: no debe forzar orden de construcción (middle-out); consecuencia real: la herramienta NO DEBE impedir crear OPDs antes del SD (ver A1.5 Bocetos). La "unicidad del hecho" y la equivalencia OPD↔OPL sí son requisitos de herramienta (GENERAR-OPL/MODELO-DE-DATOS), pero su autoridad está en las specs.

**A1.2 Clasificación del sistema (pre-etapa obligatoria)** · "obligatoria" para el método · SOLO-MÉTODO (o dato opcional del asistente).
Tabla textual:

| Tipo | Propósito | Ocurrencia del problema | Agentes humanos |
|---|---|---|---|
| Artificial | sí | sí | sí |
| Natural | **no** → `resultado` | **no** | no (solo instrumentos) |
| Social | sí (5 componentes) | sí | sí; condiciones ambientales por enlace habilitador con estado |
| Socio-técnico | sí (5 componentes) | sí | sí; relaciones no fundamentales por enlace estructural etiquetado |

Patrones: Artificial `Airplane Flying`; Natural `Fetus Developing`; Social `Conference Occurring`; Socio-técnico `Online Professional Identity Managing`; físico-con-partes-informacionales `Baggage Transporting` (→ §9.11).
→ Herramienta: no requiere campo. Si existiera asistente, podría guardar el tipo; el canon no lo pide.

**A1.3 Modo reverse / MBRSE** · declarativa (el método "NO exige reconstruir top-down") · SOLO-MÉTODO.
Ciclo textual: `observaciones → requisitos inferidos → modelo conceptual OPM → brechas de conocimiento → predicciones/pruebas → actualización de observaciones/requisitos`.
Reglas: observaciones en cualquier nivel (middle-out); requisito inferido = hipótesis; basta conjunto pequeño de requisitos clave; "Cada vuelta debe dejar al menos uno de tres saldos: hecho OPM mejor situado, brecha explícita o predicción testeable."
Tabla de lentes (Función/Contexto/Arquitectura/Desempeño/Restricciones/Interfaces) con sus preguntas: método.

**A1.4 Modos de aplicación real** · declarativa · SOLO-MÉTODO.
(a) task analysis humano-máquina; (b) prospectivo/To-Be "debe marcar la fuerza epistémica de sus objetos/procesos"; (c) digital twin/CPS "sin convertir cada variable en transformee". "El modo elegido no cambia las primitivas OPM".
→ Herramienta: el "marcar fuerza epistémica" no tiene realización definida (ver GAP-12); basta la glosa/descripcion.

**A1.5 Taller y arranque bottom-up de primera clase** · mezcla de declarativas (inferido DEBE para la mesa) y un PUEDE · **es la sección con más exigencias de producto**.
Arranques hermanos: **SD-primero** ("default del asistente guiado, A2") y **Bottom-up** ("permite trazar Bocetos —OPDs no raíz todavía fuera del árbol de refinamiento— antes de comprometer un SD").
Bloque textual:
```text
Documento: Apunte ⇄ Modelo       (Graduar a Modelo / Reabrir en Taller)
Componente: Boceto ⇄ OPD integrado (Integrar como… / Devolver a Bocetos)
```
"El **Taller** es el espacio global de documentos Apunte; **Bocetos** es la banda local de componentes todavía no integrados. Un Apunte puede contener OPDs integrados y un Modelo puede conservar Bocetos como pendientes: ninguna de esas combinaciones crea una tercera especie ni una etapa persistida."

Desglose de exigencias:
- **A1.5-a Integridad constante** · inferido DEBE ("nunca") · IMPEDIR. "Apunte y Boceto relajan cierre u orden, nunca referencias, formato ni geometría. Un documento roto bloquea en cualquier régimen."
- **A1.5-b Ciclo documental** · inferido DEBE · OPERACIÓN + MODELO-DE-DATOS. "Graduar a Modelo cambia el régimen de cierre del mismo documento: conserva identidad y hechos, vuelve exigibles sus pendientes y crea una versión." "**Graduar no integra** Bocetos." "Reabrir en Taller es la inversa de régimen y conserva identidad, hechos y carpeta; tampoco invalida por sí sola una validación humana registrada sobre una versión." → requiere: atributo de régimen del documento (apunte|modelo), operación Graduar (con creación de versión) y Reabrir.
- **A1.5-c Graduar con pendientes** · PUEDE (el operador) · OPERACIÓN. "Si la integridad está sana, el operador PUEDE **Graduar con pendientes**; el gesto no corrige, integra ni certifica."
- **A1.5-d Ciclo del componente** · inferido DEBE · OPERACIÓN. "Integrar como descomposición o despliegue fija padre y slot de refinamiento en un solo gesto, usando el mismo constructor de vínculo que el refinamiento top-down. La convergencia es del vínculo, no del contenido: el Boceto conserva su autoría. Devolver a Bocetos libera ese vínculo y preserva ID, hechos y subárbol. **Eliminar refinamiento** es una operación destructiva distinta, nunca la inversa de Integrar." → tres operaciones distintas: Integrar como… (descomposición | despliegue + modo), Devolver a Bocetos (no destructiva), Eliminar refinamiento (destructiva).
- **A1.5-e Cierre y export** · DEBE vía lifting (R-CAN-BOCETO-1..4) · IMPORT/EXPORT + ADVERTIR. "La preparación formal es derivada, no persistida. En régimen Modelo, un Boceto pendiente bloquea el export canónico según `reglas-opm-estrictas-es` R-CAN-BOCETO-1..4; en régimen Apunte se informa y marca el bosquejo sin bloquear la edición. Graduar y exportar son decisiones separadas." → la "preparación" se calcula, no se guarda como flag.
- **A1.5-f Validación humana separada** · inferido NO DEBE · OPERACIÓN (UI/semántica). "Integrar, Graduar a Modelo, exportar o marcar Biblioteca no aprueba el contenido ni sustituye a una persona o autoridad de dominio." → la herramienta no debe presentar ninguno de esos gestos como aprobación.
Anclajes: A1.1, A1.3, R-CAN-BOCETO-1..4, `spec-forja-opd-es` §10.4 R-OPD-REF-20, doc de producto `2026-07-27-taller-modelos-ciclo-reversible-design.md` (externo, circunstancial).

### A2. Construcción del SD (asistente agnóstico, 11 etapas)

**A2 (encabezado)** · DEBE (dirigido a cada etapa del método) · SOLO-MÉTODO; asistente guiado en la herramienta = `inferido` PUEDE.
"Cada etapa **DEBE** cerrar con un hecho explícito listo para OPD/OPL. El asistente no termina cuando el usuario "entiende"; termina cuando los hechos mínimos quedaron decididos. Si una etapa no cierra, retroceder a la que bloquea."
Nota: "El asistente de las 11 etapas realiza el arranque **SD-primero**. [...] Graduar no ejecuta ni completa el asistente de manera implícita; en régimen Modelo, lo pendiente reaparece como cierre exigible."
→ Herramienta: el canon habla de "asistente guiado" como default pero en ningún lugar dice que la herramienta DEBA tener un wizard. Lo que sí se desprende: en régimen Modelo ciertas comprobaciones de cierre del SD se vuelven exigibles (ver GAP-9).

Tabla textual (salida mínima por etapa):

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

Consecuencias concretas para la herramienta que salen de la tabla (no del wizard):
- Etapa 6: la herramienta DEBE permitir exhibición-caracterización **objeto→proceso** (el sistema exhibe el proceso principal). Coherente con §9.6.
- Etapa 7: enlace instrumento con símbolo `○` (RENDERIZAR; autoridad geométrica en spec-forja-opd).
- Etapa 9: objetos ambientales con contorno discontinuo (RENDERIZAR; también invariante A8.2).
- Etapa 5 + Apéndice F: agente solo desde cosas físicas (humanas); robots/SW/IA → instrumento (la herramienta no puede saber "humano": realización = ofrecer agente solo desde objetos físicos; lo demás es juicio humano).
- Etapa 11: compuerta PASA/FALLA = panel tripartito A8.1.

**A2.1 Reclasificación por desgaste** · DEBE (vía R-AG-3/R-AG-4) · SOLO-MÉTODO (la herramienta no conoce la relevancia del desgaste).
"Si el desgaste/degradación/amortización de un instrumento es relevante al alcance, el instrumento **DEBE** reclasificarse como **afectado** (`reglas-opm-estrictas-es` R-AG-3 [...])". Patrón "instrumento + atributo medido" (p.ej. R-AG-3A) "**solo** es legal si antes se ratifica en `reglas-opm-estrictas-es` como extensión declarada"; "mientras esa ratificación no exista, aplicar la reclasificación". Mantenimiento (R-AG-4): si está en alcance "**DEBE** agregarse el atributo de degradación/amortización y un proceso de mantenimiento separado (*Machine Maintaining*); si queda fuera del alcance, **DEBE** declararse esa exclusión." Ejemplos: ✓ **Machine** es afectado de *Metal Cutting*; ✗ **Machine** como instrumento silencioso.
→ Herramienta: NO debe permitir, por método, el patrón R-AG-3A salvo que `reglas` lo ratifique (cruzar con dossier de reglas).

**A2.2 Doble rol** · PUEDE + regla de prevalencia (inferido DEBE) · ADVERTIR/IMPEDIR (cruzar con reglas).
"Un objeto PUEDE ser agente de un proceso y transformado de **otro** proceso. En el **mismo** proceso, si beneficiario es transformado, el enlace transformador prevalece sobre el habilitador (no dos enlaces simultáneos)." Mismo grupo PUEDE ser agente y beneficiario; "Un agente puede ser ambiental".
→ Herramienta: no impedir agente ambiental; advertir (o impedir, si reglas lo declara) enlace habilitador + transformador simultáneos entre el mismo par objeto-proceso.

**A2.3 Nombrado y esencia por defecto** · varias obligaciones:
- Escala de nombrado: (i) verbo (`Carga`); (ii) objeto+nominalización (`Carga de batería`, recomendado por defecto); (iii) cualificador+nominalización (`Carga automática`); (iv) cualificador+objeto+nominalización (`Carga automática de batería`). La norma admite infinitivo `-ar`/`-er`/`-ir` y nominalización `-ción`/`-miento` (R-NOM-PROC-1). "Por método Forja se **DEBERÍA** preferir la nominalización [...] y **NO mezclar** ambas formas dentro de un mismo modelo; el infinitivo **NO se prohíbe**". → DEBERÍA · ADVERTIR (estilo, nivel BAJA) ante mezcla de formas; NO DEBE impedir infinitivo.
- "el modelador **DEBE** *inventar* un nombre expresivo" para agregados/atributos sin término natural → SOLO-MÉTODO.
- Esencia primaria por defecto: "Fijar la esencia mayoritaria del sistema como *default* y NO anotar física/informacional cosa por cosa reduce el ruido; declarar la esencia solo cuando difiere del default (o mientras el thing está aislado sin enlaces). *(realización: ver Apéndice F.)*" → inferido DEBERÍA · MODELO-DE-DATOS (esencia por defecto del modelo) + GENERAR-OPL (emitir esencia solo cuando difiere). Ver GAP-4: Apéndice F no trae ese campo.

**A2.4 Lentes parciales del SD** · PUEDE · SOLO-MÉTODO. "no sustituyen el SD integrado ni crean un mecanismo de refinamiento adicional." (Realizable con Bocetos, sin feature nueva.)

**A2.5 Ocurrencia del problema como anti-función** · DEBERÍA · SOLO-MÉTODO.

**A2.6 Beneficio distribuido** · inferido · SOLO-MÉTODO. "no colgarlo por comodidad del sistema técnico."

### A3. Refinamiento (SD1)

**A3.1 Descomposición (proceso síncrono, orden fijo)** · inferido DEBE (redactado como procedimiento/regla) · RENDERIZAR + GENERAR-OPL + ADVERTIR + OPERACIÓN.
Textual: "Inflar el proceso (contorno grueso en padre e hijo); subprocesos verticales por **Línea de Tiempo** (primero arriba); ≥2 subprocesos (refinamiento no trivial); cada subproceso ≥1 transformado. Secuencia: inflar → subprocesos → renombrar con dominio → traer externos conectados al padre → crear internos → estados → enlaces internos. **Paralelismo**: bordes superiores a la misma altura = `en paralelo`; el siguiente inicia cuando el último paralelo termina. **Preferida** sobre despliegue para síncronos [...]. El **orden vertical es semántico** (no cosmético): fija el orden de ejecución y es **verificable por simulación conceptual** (§A8) [...]. En procedimientos humano-máquina [...] si el in-zoom supera ~5 subprocesos, buscar un proceso intermedio/out-zoom antes de saturar la lectura."
Consecuencias:
- RENDERIZAR: proceso descompuesto con contorno grueso en el OPD padre y en el hijo.
- GENERAR-OPL/simulación: el orden de subprocesos se deriva de la coordenada vertical del borde superior; bordes superiores iguales ⇒ `en paralelo`.
- ADVERTIR: descomposición con <2 subprocesos; subproceso sin transformado (invariantes "manual" de A8.2).
- OPERACIÓN: "traer externos conectados al padre" (llevar al in-zoom las cosas enlazadas al proceso padre). La secuencia en sí es método.
- ~5 subprocesos procedimentales: SOLO-MÉTODO (regla práctica).

**A3.2 Despliegue (proceso/objeto asíncrono)** · inferido DEBE · OPERACIÓN + RENDERIZAR + ADVERTIR.
"Subprocesos independientes, cualquier orden; ≥2 refinadores." Tabla textual:

| Relación | Despliegue expone |
|---|---|
| Agregación-participación | partes del todo |
| Exhibición-caracterización | rasgos/atributos del exhibidor |
| Generalización-especialización | especializaciones del general |
| Clasificación-instanciación | instancias de la clase |

"Despliegue parcial → símbolo de colección incompleta." Criterio agregación vs generalización: método.
→ OPERACIÓN despliegue con modo ∈ {agregacion, exhibicion, generalizacion, clasificacion}; ADVERTIR <2 refinadores; RENDERIZAR colección incompleta cuando el despliegue es parcial.

**A3.3 Identidad de la descomposición** · declarativa + un DEBE.
- "Subprocesos = partes (agregación + ordenabilidad); objetos que el proceso **exhibe** = atributos del proceso; objetos que entran por migración mantienen identidad independiente (no son atributos). Simétrico para objetos: internos = partes, procesos internos = operaciones." → GENERAR-OPL (inferido): las cosas internas del in-zoom se leen como partes del refinado.
- "**Descomposición de objeto ≠ línea de tiempo.** En la descomposición de un **objeto**, la posición codifica **disposición espacial/organización lógica (2D)**, NO orden temporal" → inferido DEBE · GENERAR-OPL: no emitir secuencia temporal para in-zoom de objeto.
- "**Alcance interno/externo (regla de frontera).** Un objeto creado *dentro* de un proceso descompuesto es **interno**: vive solo en el alcance de ese proceso (visible solo en su OPD). Si se necesita fuera, **DEBE** colocarse fuera del in-zoom. Una cosa no es interna y externa a la vez; reposicionarla gráficamente NO cambia su alcance — para moverla de alcance hay que recrearla." → DEBE · MODELO-DE-DATOS (alcance persistido, no derivado de la geometría; Apéndice F sugiere `contextoRefinamiento?` en apariciones) + OPERACIÓN (arrastrar no cambia alcance).
- "**Vista explicativa vs. mecanismo.** [...] No copiar el nombre visual de una figura si contradice el mecanismo." → SOLO-MÉTODO.

**A3.4 Distribución/migración de enlaces** · PROHIBIDO / PERMITIDO · IMPEDIR + OPERACIÓN + GENERAR-OPL.
Tabla textual:

| Enlace | Contorno exterior |
|---|---|
| Agente / instrumento / efecto | PERMITIDO (distribuye a todos) |
| Consumo | PROHIBIDO — migra al **primer** subproceso; reasignar |
| Resultado | PROHIBIDO — migra al **último** subproceso; reasignar |
| Evento sistémico | PROHIBIDO (eventos de objetos **ambientales** sí cruzan) |

Textual: "Reasignar cada transformador al subproceso que realmente consume/produce/completa. **Escisión con estado**: `*P* cambia **A** de \`s1\` a \`s2\`` al descomponer en P1,P2 → `*P1* cambia **A** de \`s1\`` + `*P2* cambia **A** a \`s2\``. Escisión con modificador de control NO permitida. **Antipatrón**: evento a subproceso no-primero (salta precondiciones) salvo verificación explícita."
- "**Migración al primer subproceso (principio, no promesa de herramienta).** Al insertar el primer subproceso, los enlaces del contorno migran a él por defecto; es **responsabilidad del modelador reasignarlos** [...]. *(Si la herramienta automatiza la migración, verificarlo en opforja; no asumirlo.)*" → PUEDE (automatizar) · OPERACIÓN opcional.
- "**Precedencia al abstraer (puntero, no copia).** Al recomponer/abstraer (out-zoom, plegado, supresión), cuando dos enlaces compiten por el mismo par cosa-proceso prevalece el de mayor fuerza semántica: `Consumo = Resultado > Efecto > Agente > Instrumento` (refinada por modificador de control dentro de cada tipo). La matriz completa y las combinaciones inválidas son canon de **`opd-es` §13**". → inferido DEBE · RENDERIZAR/OPERACIÓN (enlace abstraído en el OPD padre). Matriz completa fuera del canon (GAP-1).
Consecuencias:
- IMPEDIR consumo, resultado y evento sistémico sobre el contorno exterior del proceso descompuesto (in-zoom); permitir evento cuyo origen es objeto ambiental. Refuerzo en A8.2 ("Consumo/resultado no en contorno exterior de proceso descompuesto").
- IMPEDIR escisión de un enlace con modificador de control (c/e) entre subprocesos.
- GENERAR/PARSEAR-OPL las formas escindidas `cambia **A** de \`s1\`` y `cambia **A** a \`s2\`` (entrada sola / salida sola).
- ADVERTIR evento hacia subproceso que no es el primero (salvo patrón LF-06).

**A3.5 Invocación implícita** · inferido DEBE · OPERACIÓN (simulación) / GENERAR-OPL.
"(por disposición vertical, no gráfica): proceso→primer subproceso; subproceso→siguiente al terminar; último→contenedor." → la herramienta no dibuja enlaces de invocación para la secuencia del in-zoom; la secuencia se infiere de la posición.

**A3.6 Expresión/supresión de estados** · inferido · OPERACIÓN + simulación.
"Suprimir en SD los estados **no** conectados a proceso; expresarlos en SD1 donde se conectan a subprocesos. Afectado en transición durante proceso activo está **indeterminado** e indisponible para otros procesos. → ver **LF-03**".
→ OPERACIÓN supresión/expresión por aparición (LF-03); runtime: objeto en transición indisponible.

### A4. Gestión de complejidad

**A4.1 Cuatro mecanismos canónicos** · inferido DEBE (canónicos) · OPERACIÓN.
Tabla textual:

| Mecanismo | Refinar / Abstraer | Uso |
|---|---|---|
| Descomposición / Recomposición | expone/oculta contenido interno | procesos síncronos; objetos con partes |
| Despliegue / Plegado | expone/oculta refinadores | procesos asíncronos; taxonomías; rasgos |
| Expresión / Supresión de estados | muestra/oculta estados | simplificación contextual (LF-03) |
| Composición inter-modelo por sub-modelo | referencia / desconexión | trabajo concurrente; encapsulación (LF-04) |

"Las **vistas** (mapa del sistema, árbol de procesos/objetos, vistas ad hoc) NO son mecanismo ontológico: navegan/explican, no crean hechos. Operadores de canvas (`Bring`, etc.) son derivados, no mecanismos."
→ OPERACIÓN para los 4 (el cuarto es candidato a sobreingeniería, ver §9). NO DEBE: vistas/operadores de canvas no crean hechos (MODELO-DE-DATOS). Un árbol de OPDs como navegación es natural pero no exigido.

**A4.2 Heurística de profundidad** · inferido (heurística) / "invariante" en A8.2 · ADVERTIR.
"Si un OPD de nivel N no agrega transformados/estados/enlaces nuevos respecto del padre, el refinamiento es innecesario. **Claridad**: ningún OPD > **20-25** entidades. Calibración empírica: [...] **5-10 niveles** [...] (referencia, no invariante)."
→ ADVERTIR (nivel ALTA/MEDIA) refinamiento vacío y OPD con >20–25 entidades (umbral difuso, GAP-17). Los 5–10 niveles: NO-APLICA.

**A4.3 Árbol OPD e identidad** · DEBE · MODELO-DE-DATOS + IMPEDIR.
"Etiquetas `SD/SD1/SD1.1` son **navegación**, NO identidad persistente. Cada OPD **DEBE** tener identificador persistente (URI/handle) recuperable en serialización. Cada modelo tiene su árbol local; los sub-modelos componen **por referencia**, no por super-árbol global. OPDs hoja = única clase eliminable. **Importancia = altitud de primera aparición** [...]".
→ MODELO-DE-DATOS: id persistente por OPD ≠ etiqueta; etiqueta derivada del árbol (renumerable). IMPEDIR (inferido) eliminar un OPD que tenga hijos. "Importancia=altitud": SOLO-MÉTODO.

**A4.4 Contrato de sub-modelo (interfaz congelada)** · inferido DEBE (si se soporta sub-modelo) · IMPEDIR.
"Mínimo: 1 objeto + 1 proceso por exhibición-caracterización e instrumento; un solo proceso por sub-modelo; cosas compartidas sin refinar. Tras crear: las compartidas **no** reciben nuevos enlaces/estados, **no** se renombran/eliminan, **no** se agregan nuevas compartidas (si la interfaz es incorrecta, destruir y recrear). Autoridad semántica = modelo propietario; el consumidor solo referencia, por id persistente. → ver **LF-04**."

**A4.5 Simplificación de OPD sobrecargado** · inferido PUEDE (procedimiento) · OPERACIÓN opcional.
"Identificar conjunto a extraer → nombrar proceso interino que los contenga → recomponer (abstraer enlaces + ocultar) → nuevo OPD descendiente → renumerar. Reducción neta = removidos − 1." → Si la herramienta lo ofrece: extraer selección a un proceso interino con in-zoom propio; renumerar etiquetas. Realizable manualmente con descomposición.

**A4.6 Viewpack arquitectónico** · PUEDE · SOLO-MÉTODO. "todo hecho que pretenda ser parte del modelo debe volver a una primitiva OPM y a OPL equivalente."

### A5. Heurísticas de modelado (§9.x)

Todas son método. Solo se destaca la consecuencia de herramienta cuando existe.

| ID | Enunciado (condensado; textual donde es normativo) | Obligación | Herramienta |
|---|---|---|---|
| §9.1 | Proceso persistente (*Sostener/Mantener/Almacenar/Contener* sin cambio neto) → enlace estructural etiquetado (✓`Cimentación soporta Casa`). Excepción: esfuerzo no trivial. "El proceso persistente que **sí** sobrevive se realiza como cambio con **entrada=salida** (`*P* cambia **A** de \`s\` a \`s\``), no con verbo especial" | inferido | GENERAR/PARSEAR-OPL: NO impedir efecto con estado entrada = estado salida; no inventar verbo especial. Enlace estructural etiquetado con etiqueta libre |
| §9.2 | Objeto transiente (creación-consumo inmediato sin observación) → suprimir objeto + enlace de invocación (rayo) | inferido | RENDERIZAR enlace de invocación proceso→proceso (rayo) |
| §9.4 | "instrumento en SD PUEDE ser afectado en SD1 si cambio neto = 0 (✓ Dishwasher empty→loaded→empty)" | PUEDE | NO impedir cambio de rol entre niveles (ver GAP-13 vs precedencia al abstraer) |
| §9.5 | Árbol de decisión de atributos en 4 dimensiones binarias; "Blandos PUEDEN no requerir seguimiento" | PUEDE | SOLO-MÉTODO |
| §9.6 | "estructurales homogéneos (obj↔obj, proc↔proc); procedimentales no homogéneos (obj↔proc). **Excepción**: exhibición-caracterización admite las 4 combinaciones" | invariante (A8.2) | IMPEDIR estructurales heterogéneos salvo exhibición; IMPEDIR procedimentales obj↔obj o proc↔proc (salvo invocación proc→proc, que el propio §9.2/A6 usa) |
| §9.8 | Especializaciones que difieren por valor de atributo → caracterización con estado especificado | inferido | SOLO-MÉTODO (requiere que exista la primitiva) |
| §9.9 | Herencia: especialización hereda partes, rasgos, enlaces, estados; "PUEDE sobreescribir estados" | PUEDE | SOLO-MÉTODO (no se exige cálculo de herencia) |
| §9.11 | físico+informacional → **físico** | inferido | SOLO-MÉTODO |
| §9.12 | un solo atributo relevante → estados directos (✓`Fetus can be embryo or baby`); múltiples → atributo+valores | inferido | SOLO-MÉTODO |
| §9.13 | Generalización como abstracción del SD; refactor crear-general en 4 pasos; under/over-specification | inferido | SOLO-MÉTODO (no pide operación automática) |
| §9.14 | Test del proceso: "por defecto un sustantivo es **objeto**; para ser **proceso** debe cumplir los **tres** criterios — (1) transforma un objeto, (2) está asociado a tiempo, (3) está asociado a un verbo" | inferido | SOLO-MÉTODO |
| §9.15 | "1:1 cosa↔nombre canónico; sinónimos → un término; homónimos → cosas separadas. Las variantes de superficie infinitivo↔nominalización [...] PUEDEN coexistir si mapean al **mismo nombre canónico interno**. **Reuso por nombre**: una cosa repetida es **nueva aparición de la misma entidad**, no un nombre nuevo ni una cosa nueva" | invariante (A8.2) + PUEDE | OPERACIÓN: crear/parsear una cosa con nombre existente ⇒ nueva aparición de la misma entidad; IMPEDIR/ADVERTIR dos entidades con el mismo nombre. PARSEAR-OPL: nombres resuelven a entidad existente. Variantes de superficie → GAP-3 |
| §9.18 | Co-agentes: ≥2 agentes simultáneos → múltiples enlaces de agente (AND implícito); ✗ "Agent Group" | inferido | MODELO-DE-DATOS: permitir N enlaces agente al mismo proceso |
| §9.19 | "un estado PUEDE ser inicial **y** final (ciclo cerrado [...]). ✗ duplicar `empty_start/end`" | PUEDE | MODELO-DE-DATOS: NO impedir `esInicial` y `esFinal` simultáneos |
| §9.20 | "declarar unidad + tipo (`Pressure [kPa] {p}`); tipos: boolean/string/integer/float/double/short/long/enumerated; rangos `[0..100]`,`(0..*)`, sub-rango no amplía silenciosamente" | inferido DEBERÍA | MODELO-DE-DATOS (unidad, tipo, alias, rango) + GENERAR/PARSEAR (sintaxis `Nombre [unidad] {alias}`, confirmar en spec-opl) + ADVERTIR ampliación de rango heredado. Apéndice F no trae estos campos (GAP-6) |
| §9.21 | Cambio de estado vs cambio de identidad (efecto vs consumo+resultado); "Decisión subjetiva/contextual" | inferido | SOLO-MÉTODO |
| §9.22 | Objeto específico de estado como alias de referencia (no duplicar); "realización textual: opl-es" | inferido | GENERAR-OPL remitido a opl-es (fuera del canon; GAP-1) |
| §9.23 | n≥3 → enlaces binarios o proceso state-preserving; "OPM enfoca todo en binario" | inferido | MODELO-DE-DATOS: solo enlaces binarios (origen, destino) |
| §9.24 | Estados cualitativos `no-existente`, `bajo`, `existente`; "No usar `no-existente` como decoración" | inferido | SOLO-MÉTODO (relevante para runtime F.2) |
| §9.25 | Intermedio con uso externo: suprimir solo si no tiene observación ni uso fuera de la cadena | inferido | SOLO-MÉTODO |
| §9.26 | Control loop explícito `sensado → decisión → salida/señal`; "Si el mecanismo es desconocido, marcar brecha" | inferido | SOLO-MÉTODO |
| §9.27 | "números visibles (`0`, `1`, `Req#11`) son etiquetas de navegación o trazabilidad, no identidad ontológica"; "PUEDE ayudar a leer rutas largas, pero no debe sustituir enlaces, orden vertical ni OPL" | PUEDE | NO-APLICA (no requiere campo; la herramienta no debe derivar identidad de números en nombres) |
| §9.28 | Matriz rápida esencia × afiliación pre-SD | inferido | SOLO-MÉTODO |
| §9.29 | Carriles de valor/soporte: "layout metodológico, no nueva primitiva" | inferido | SOLO-MÉTODO (sin swimlanes) |
| §9.30 | Variable CPS: atributo / dato / operando | inferido | SOLO-MÉTODO |
| §9.31 | Propiedad emergente observable | inferido | SOLO-MÉTODO |
| §9.32 | Pre/Post condición incumplida → contingencia/salto/espera/mensaje/reparación | inferido | SOLO-MÉTODO |
| §9.33 | Estado verificado y memoria de ejecución (`on` vs `on verificado`) | inferido | SOLO-MÉTODO |
| §9.34 | Modelo prospectivo/To-Be: "marcar los hechos como diseño/propuesta y validar utilidad stakeholder por separado" | inferido | SOLO-MÉTODO (sin campo definido; GAP-12) |
| §9.35 | Instrumento por capacidad vs herramienta concreta | inferido | SOLO-MÉTODO |
| §9.36 | Aspecto transversal cuantificable: declarar tipo, unidad, rango, polaridad, agregación, umbral | inferido | SOLO-MÉTODO (LF-17: metadatos/catálogo externo bastan) |
| §9.37 | Alternativa de diseño no es estado por defecto | inferido | SOLO-MÉTODO |
| §9.38 | Stakeholder portador de valor | inferido | SOLO-MÉTODO |

(Nota: no existen §9.3, §9.7, §9.10, §9.16, §9.17 en el documento.)

### A6. Control de flujo (compilación; canon en `opl-es` §7)

Todo inferido (bullets descriptivos). Consecuencia: MODELO-DE-DATOS para modificadores + semántica de runtime. Textual:
- "**Condición vs espera**: enlace sin `c` → el proceso **espera** (obligatorio); con `c` → se **salta** (opcional). **Skip Semantics Precedence**: si un proceso mezcla enlaces de condición y sin-condición, la **omisión precede a la espera** (si falta cualquier objeto vinculado por condición, el proceso se salta aunque los no-condición estén satisfechos)."
- "**Evento vs condición**: múltiples eventos = OR (cualquiera dispara); múltiples condiciones = AND para ejecutar, OR para omitir."
- "**Temporización**: un objeto tipo **reloj/temporizador** con valor concreto dispara procesos en instantes definidos; los eventos de estado pueden representar eventos temporales (eventos temporizados)."
- "**Abanicos**: XOR (arco simple) "exactamente m de f"; OR (arco doble) "al menos m de f". XOR probabilístico: probabilidades suman 1." → RENDERIZAR arco simple/doble; ADVERTIR si probabilidades ≠ 1 (inferido).
- "**NOT**: estados `existente`/`no-existente` + enlace de instrumento/condición sobre `no-existente`. Realización compacta: un solo **enlace NOT** sobre el estado (`instrument-not`/`event-not`) en vez de N enlaces de condición a los demás estados." → tokens de tipo `instrument-not`, `event-not`.
- "**Etiquetas de ruta**: desambiguan entrada↔salida; eliminan el AND para previos (solo coexisten los de igual etiqueta)."
- "**Iteración**: conjunto-miembro [...]; bucle por **self-invocation** [...] o invocación último→padre, + proceso *Esperar* con restricción de tiempo para intervalos; nodo de decisión booleano."
- "**Objeto booleano**: doble estado generado por decisión; cada estado → condición a proceso alterno (si-entonces-sino). n estados sin resultado especificado → 1/n por defecto."
- "**Escenario / repertorio**: [...] debe cubrir el abanico XOR completo, no solo el caso feliz."
- "**Enlaces con valor**: establecimiento (unidireccional), efecto de valor (bidireccional), par entrada-salida especificado; aplican a **valores** (estados de atributo), no a estados de objeto."
→ Herramienta: la autoridad OPL de todo esto es `opl-es` §7 (fuera del canon) y `spec-forja-opl-es` (en canon). El método solo fija la semántica de ejecución. Apéndice F no trae campos para modificadores, abanicos, probabilidades ni rutas (GAP-6).

### A7. Cuantitativo · errores · requisitos · simulación

Mayoritariamente SOLO-MÉTODO. Textual y consecuencias:
- "**Tasa** [...] **Duración** con distribución para simulación estocástica." → inferido PUEDE (solo si hay simulación cuantitativa; sobreingeniería para herramienta simple).
- "**Flujo computacional** (5 pasos): atributos con tipo → alias → proceso `{}` → fórmula → enlaces de flujo. [...] Rangos validados con modo **soft** (acepta fuera de rango, marca) vs **hard** (bloquea), configurable por fase (diseño/ejecución/simulación); sub-rango heredado no amplía. Al usar tasa, **crear excepción si la cantidad del consumee/resultee < tasa × duración esperada**." → inferido PUEDE · ADVERTIR/IMPEDIR configurable. Sobreingeniería (ver §9).
- "**Métrica para tradeoff**: todo atributo usado para elegir diseño **DEBE** declarar unidad/tipo/rango, polaridad (`más es mejor`, `menos es mejor`, `cota obligatoria`, `óptimo interior`), función de agregación y umbral." → DEBE (al modelador) · SOLO-MÉTODO (LF-17 admite metadatos/catálogo externo).
- "**Fórmula como instrumento vs cómputo ejecutable**: en fase conceptual, una ecuación, simulador o modelo ML PUEDE ser objeto informacional/instrumento de un proceso (*Simulating requires Mathematical Equation*)." → PUEDE · SOLO-MÉTODO.
- Procedencia de datos: SOLO-MÉTODO.
- "**Espacio de estados compuesto** = producto cartesiano [...] identificar infactibles por modelado de procesos (no recolapsar; ver LF-01). Precondiciones compuestas: cláusulas XOR numeradas unidas por AND." → SOLO-MÉTODO.
- "**Errores temporales**: excepción por sobretiempo/subtiempo → manejador [...]. Sin manejador, el modelo es incompleto para simulación." → inferido · runtime (solo si simulación temporal).
- "**Requisitos en el modelo**: representar requisitos como objetos informacionales o estereotipo equivalente; mantener catálogo externo como SSOT [...]. Trazabilidad por enlace estructural etiquetado `satisface` (no procedimental), desde objeto/proceso/enlace o desde un conjunto de componentes hacia el requisito." → inferido · MODELO-DE-DATOS: enlace estructural etiquetado con etiqueta libre basta. "desde [...] enlace" (enlace como origen de un enlace) → GAP-14.
- Fuerza epistémica del requisito (prescriptivo / declarado / inferido): "Un requisito inferido **NO equivale** a norma ni a hecho demostrado" → SOLO-MÉTODO.
- Requisitos inferidos en reverse engineering, layering: SOLO-MÉTODO.
- "**Brechas y predicciones**: [...] Cada brecha **DEBERÍA** terminar en predicción testeable, acotación de alcance o dato pendiente." → DEBERÍA · SOLO-MÉTODO.
- "**Simulación**: recorrido en profundidad del árbol local; cruce a sub-modelo = transición explícita entre fronteras (no continuación de árbol global). Distinguir simulación conceptual (tokens) de ejecución computacional (fórmulas). Condiciones `c` se simulan como bypass/omisión, no como espera; iteraciones se modelan con invocación/autoinvocación, no con un primitivo `while`." → inferido DEBE (si hay runtime) · OPERACIÓN. NO DEBE existir primitivo `while`.
- Simulación de configuraciones: SOLO-MÉTODO.
- "**Emergencia**: la arquitectura **DEBE** producir ≥1 capacidad emergente; sin ella, no es un sistema MBSE." → DEBE (al modelo) · SOLO-MÉTODO (no verificable por la herramienta).

### A8. Invariantes y validación tripartita

**A8.1 Validación tripartita** · inferido DEBE ("mapea al PanelMetodologia de opforja") · ADVERTIR/IMPEDIR.
Textual:
1. "**Bloqueos estructurales** (CRÍTICA) — firma de enlaces, clases válidas, aciclicidad del árbol, integridad OPD↔OPL. Falla → no avanzar."
2. "**Mejoras metodológicas** (ALTA/MEDIA) — claridad ≤20-25, completitud (estructura+comportamiento+función), bimodalidad, refinamiento motivado. Falla → avanzar declarando issue."
3. "**Estilo/legibilidad** (BAJA) — tipografía, posicionamiento, etiquetas."
→ Panel de diagnósticos con tres niveles; nivel 1 bloquea (qué exactamente bloquea lo define `reglas`); niveles 2–3 no bloquean.

**A8.1 Prácticas de validación continua**:
- **Bimodalidad activa** · inferido DEBE para la herramienta · GENERAR-OPL. "tras *cada* edición gráfica, **leer la oración OPL generada** para cazar el enlace mal elegido en el sitio (confundir resultado por efecto, o consumo por instrumento, produce OPL sin sentido — `*Manufactura* consume **Plano**` cuando debía `requiere`). [...] La bimodalidad no es solo invariante (A8.2): es **procedimiento**." → la herramienta debe mostrar el OPL actualizado de inmediato y, idealmente, la oración del cambio recién hecho.
- **Simulación conceptual como compuerta de flujo** · inferido PUEDE para la herramienta · RENDERIZAR/OPERACIÓN. "correr la animación de tokens [...] **antes** de cualquier cómputo. [...] *(Si opforja v0 no anima, la disciplina equivalente es ejecutar el gate tripartito paso a paso, no al final.)*" → la animación no es obligatoria; su sustituto es el panel tripartito.
- **Condiciones y bucles ejecutables en opforja** · "debe" · OPERACIÓN (runtime). "una condición incumplida debe verse como paso omitido en la traza; una invocación debe alterar el siguiente proceso observado; una autoinvocación debe repetir hasta que una condición de salida omita o derive la ejecución. Si el bucle no tiene salida, el runtime debe cortar por límite de seguridad con diagnóstico, no colgar la sesión." → DEBE si hay runtime.
- Validación por niveles: SOLO-MÉTODO.
- **Validación stakeholder separada**: "Cerrar modelos prospectivos, task-analysis o digital twin con dos marcas: validez metodológica y adecuación/feedback stakeholder." → SOLO-MÉTODO (no se define campo; relación con "validación humana registrada" de A1.5 → GAP-10).
- Ledger de investigación (4 preguntas): SOLO-MÉTODO.

**A8.2 Invariantes nucleares** · "invariante" (autoridad = capa propietaria) · consecuencia por fila:

| Invariante (textual) | Capa | Herramienta |
|---|---|---|
| Exactamente un proceso principal por SD | manual | ADVERTIR (exigible en régimen Modelo; ver GAP-9). Requiere saber cuál es el SD raíz |
| Enlace de agente solo a humanos; instrumento solo a no-humanos | opm-es | IMPEDIR agente desde objeto no físico (realización Apéndice F); "humano" es juicio humano |
| Todo habilitador persiste sin cambio neto | opm-es | IMPEDIR estado entrada/salida en enlaces habilitadores (cruzar con reglas) |
| Sistema exhibe el proceso principal | manual | ADVERTIR en SD |
| Objetos ambientales con contorno discontinuo | opd-es | RENDERIZAR |
| Consumo/resultado no en contorno exterior de proceso descompuesto | opd-es | IMPEDIR |
| Todo subproceso ≥1 transformado | manual | ADVERTIR |
| Bimodalidad: todo OPD tiene párrafo OPL equivalente | opm-es | GENERAR-OPL por OPD |
| Un hecho aparece en ≥1 OPD | opm-es | ADVERTIR entidades/enlaces sin aparición (ver "Barridos") |
| Estructurales homogéneos (excepción: exhibición-caracterización) | opm-es | IMPEDIR |
| Pre(P)/Post(P): habilitadores y afectados ∈ Pre∩Post; consumidos solo Pre; resultantes solo Post | opm-es | runtime/simulación (semántica) |
| Refinamiento no trivial: descomposición ≥2 subprocesos; despliegue ≥2 refinadores | manual | ADVERTIR |
| Proceso sin valor funcional directo DEBERÍA ser ambiental | manual | SOLO-MÉTODO (no computable) |
| Interfaz de sub-modelo congelada tras creación | manual | IMPEDIR (si hay sub-modelos) |
| Cada OPD con identificador persistente ≠ etiqueta `SDx.y` | opd-es | MODELO-DE-DATOS |
| Referencia inter-modelo explicita propietario y consumidor | opm-es | MODELO-DE-DATOS (si hay sub-modelos) |
| Estado cíclico (inicial+final) válido | manual | NO impedir |
| Salida no-determinista por defecto 1/n | manual | runtime |
| Ningún OPD > 20-25 entidades | manual | ADVERTIR |
| Nombres singulares; 1:1 cosa↔nombre canónico | opl-es / manual | ADVERTIR plural (heurístico, BAJA); IMPEDIR/fusionar duplicado de nombre |

**A8.2 Advertencias operativas de auditoría** · inferido DEBE · ADVERTIR / arquitectura.
- "**Barridos sobre serialización**: ejecutar barridos de integridad sobre el JSON canónico, nunca sobre el OPL. El emisor textual omite entidades sin apariciones; una entidad desconectada puede existir en JSON y ser invisible en la capa textual (verificado en opforja v0)." → los validadores operan sobre el modelo, no sobre el texto OPL; conviene advertir entidades sin apariciones (invisibles en OPL).
- "**Métrica antes que conclusión**: [...] Una regla indiferenciada sobre-acusa (caso paradigmático: LF-19.3 — efecto sin rama es escritor legal)." → los checks deben respetar las excepciones de LF-19.

---

## 4. Frontera rectora (antes del catálogo)

Tabla textual:

| Operación | Tipo | Alcance | Propietario |
|---|---|---|---|
| **Dimensionalización** (LF-01) | **ontológica**: cambia *qué es* la cosa (cuántos ejes/atributos) | invariante, **todas** las apariciones | §9.5 + §9.12 |
| **Caracterización** (LF-02) | **realización**: cómo se materializa un eje ya decidido | el OPD donde se aloja | §9.6 + §9.8 |
| **Supresión de estados** (LF-03) | **per-aparición sobre estados**: cambia *qué estados se muestran*, no la identidad | un OPD concreto | §7.5 |
| **Semi-plegado** (LF-05) | **per-aparición sobre partes**: oculta un *subconjunto de partes/atributos* (no estados), compactado dentro del todo | un OPD concreto | opd-es plegado parcial |

"Dependencias: **LF-02 presupone LF-01** [...]. **LF-03 y LF-05 son ortogonales** a la ontología (no cambian identidad) y **entre sí** (LF-03 oculta estados; LF-05 oculta partes; el plegado total de A4.1 oculta el refinador entero — LF-05 es el punto intermedio). El **colapso** es la rama dual de LF-01".
→ Herramienta (MODELO-DE-DATOS): atributos/estados son propiedad de la **entidad** (todas las apariciones); supresión de estados y semi-plegado son propiedad de la **aparición** (un OPD). Nótese que "§7.5" referido aquí no existe en este documento (es del manual; GAP-1).

---

## 5. Parte B — Catálogo de lecciones forja

**B.0 Molde LF-NN** · NO-APLICA (gobierno documental). Textual:
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
Nota: el campo 6 declara "(app v0; puede evolucionar)" → las realizaciones opforja de las LF no son contrato para una herramienta rehecha; solo el principio lo es.

**B.1 Reglas del catálogo** · NO-APLICA. Grafo `refina`/`usa`; DRY; admisión por 3 gates (lifteable, no-derivable, reúso ≥2; "visto una vez nace `Estado: propuesta`").
→ Consecuencia de lectura: solo las LF **consolidadas** (LF-01, 02, 03, 04, 05, 19) pesan como requisito; las **propuestas** (LF-06..LF-18) son método no ratificado.

### LF consolidadas (con consecuencia real de herramienta)

**LF-01 — Dimensionalización vs colapso de estados ortogonales · consolidada**
- Principio: "separar ejes ortogonales en **atributos exhibidos** (cada uno con su state set); **colapsar** cuando co-varían y ningún proceso/norma los distingue."
- No aplica: máquina secuencial `a→b→c` es un eje.
- Realización opforja (textual): "el objeto deja de tener estados directos; crear entidades-atributo (`esAtributo:true`, **sin** `valorSlot`) + `estados`; enlace `exhibicion` objeto→atributo; opcional unfold `modo:"exhibicion"`. Auditar alcanzabilidad del producto antes de fijar cardinalidad; cruces inalcanzables → enlaces de condición, no recolapso."
- Ejemplo textual: ✗`**Colaborador de cuidado** puede estar disponible y competente`. ✓`**Colaborador de cuidado** exhibe **Disponibilidad**, **Competencia** así como **Carga**; **Disponibilidad** puede estar \`disponible\` o \`ausente\`.` *(HODOM)*
- Regla formal (bitácora): `SEPARAR ⟺ (1∧2)∧(3∨4)` · `COLAPSAR ⟺ ¬1∨¬2` (1 alcanzabilidad, 2 transición independiente, 3 proceso lo lee aislado, 4 override normativo).
- Obligación: inferido (lección consolidada, sin verbo modal). Herramienta: MODELO-DE-DATOS (atributos con estados, exhibición) + GENERAR-OPL (la forma con varios atributos "exhibe **A**, **B** así como **C**"; confirmar en spec-opl). La decisión separar/colapsar es SOLO-MÉTODO. PUEDE advertir (estilo) nombres de estado conjuntivos `X y Z` (inferido).

**LF-02 — Exhibición-caracterización como mecanismo de propiedad · consolidada · usa LF-01**
- Principio: "una propiedad de una cosa es un **atributo exhibido** (objeto-rasgo con su state set), no un proceso ni un estado conjuntivo."
- Test de operación encapsulada (textual): "un proceso es *operación* (rasgo procedimental "propio") de un objeto B **solo si** no tiene efecto sobre ni requiere ningún objeto fuera de B (solo afecta partes/rasgos/especializaciones de B); si toca algo externo, es un proceso de pleno derecho".
- Realización opforja: "helper `atributo` (value slot libre) o `atributoEstados` (estados discretos); enlace `exhibicion`; unfold `modo:"exhibicion"` aloja los atributos con estados completos. OPL: `**Obj** exhibe **Attr**.` + `**Attr** de **Obj** puede estar \`v1\`, \`v2\` o \`v3\`.`"
- Ejemplo: ✓`**Fetus** exhibits **Developmental Stage**; **Developmental Stage** of **Fetus** can be \`embryo\` or \`baby\`.` *(corpus, en inglés)*
- Obligación: inferido. Herramienta: GENERAR/PARSEAR-OPL con las plantillas `**Obj** exhibe **Attr**.` y `**Attr** de **Obj** puede estar \`v1\`, \`v2\` o \`v3\`.`; OPERACIÓN crear atributo (con valor libre o con estados); despliegue modo exhibición. Test de operación: PUEDE advertir (inferido) que una "operación" exhibida toca objetos externos; en principio SOLO-MÉTODO.

**LF-03 — Altitud por expresión/supresión de estados per-aparición · consolidada**
- Principio: "qué estados se **muestran** es decisión **por OPD**, independiente de cuántos ejes **tiene** la cosa".
- Cuándo NO: "**NO** suprimir un estado conectado a un proceso en ese OPD (§7.5)." → IMPEDIR.
- Liftea a `opd-es` V-86..V-90 "(supresión per-aparición, derivada, solo en descomposición)".
- Realización opforja (textual): "`Apariencia.estadosSuprimidos: Id[]` (lista per-OPD); visibilidad efectiva = `Estado.suprimido` global **∧** local (global domina, local refina)."
- Herramienta: MODELO-DE-DATOS (supresión global en el estado + lista por aparición) + OPERACIÓN (suprimir/expresar) + RENDERIZAR (estados visibles) + IMPEDIR supresión de estado enlazado en ese OPD. Fórmula de visibilidad ambigua (GAP-5).

**LF-04 — Objeto-frontera congelado entre sistemas composables · consolidada**
- Principio: "modelar como sub-modelos composables; la interfaz es un **conjunto mínimo de objetos-frontera** con dueño declarado y estados **congelados**; el consumidor **referencia**, no redefine."
- No aplica: sistema genuinamente único; "no congelar una interfaz prematura".
- Realización opforja: "dos SD0 en el mismo bundle; objetos-frontera como entidades compartidas **sin refinar**; referencia por id persistente; tras crear, no agregar estados/enlaces a la compartida."
- Ejemplo: **Solicitud**, **Cupo**, **Cartera**, **Episodio** *(HODOM)*.
- Obligación: inferido DEBE (si se modela composición). Herramienta: MODELO-DE-DATOS (varios SD raíz o varios modelos, marca de compartida con dueño) + IMPEDIR edición de compartidas (A4.4). Candidato fuerte a sobreingeniería; contradicción con A4.3 (GAP-7).

**LF-05 — Semi-plegado: altitud parcial sobre partes · consolidada · ortogonal LF-03**
- Principio: "mostrar un **subconjunto** de partes/atributos compactado *dentro* del todo, con indicador de los ocultos; altitud intermedia entre desplegado-total y plegado-total."
- No aplica: no es supresión de estados; "si la parte debe conectarse *fuera* del todo, **extraerla** (A4.5), no semi-plegarla."
- Realización opforja: "`modoPlegado` por aparición (verificar soporte en opforja v0; en OPCloud es *semi-fold* con contador de partes ocultas y doble-clic para extraer una). OPL refleja "consta de X y N partes más"."
- Ejemplo: ✓ mostrar 2 de 8 categorías del **Plan** con indicador "…+6"; ✗ plegar el **Plan** entero.
- Obligación: inferido DEBERÍA (consolidada pero con realización condicionada "verificar soporte"). Herramienta: MODELO-DE-DATOS (`modoPlegado` por aparición + subconjunto visible) + RENDERIZAR (partes dentro del todo + indicador "…+N") + GENERAR-OPL ("consta de X y N partes más"; confirmar forma exacta en spec-opl). `modoPlegado` no figura en el modelo del Apéndice F (GAP-6).

**LF-19 — Integridad de estados: flujo, caracterización, ambiental-observado · consolidada · usa LF-01, LF-03**
- Principio: "toda entidad con estados pertenece a una de tres categorías: **flujo**, **caracterización** o **ambiental-observado**; cada una debe una prueba distinta al modelo."
- Flujo (textual): "la entidad transiciona como transformee; exige escritor. La rama explícita entrada→salida o resultado-con-estado solo es obligatoria cuando el veredicto importa; efecto o resultado sin rama es escritor legal con resolución dinámica."
- Caracterización: "Exige declaración explícita y auditable en la glosa de la entidad de que el state-set es caracterización [...]; sin declaración auditable, acusar por defecto."
- Ambiental-observado: "Sin escritor sistémico es legítimo: el sistema lee; si constata la transición, declarar escritor-constatador excepcional y nominar fuente del dato en la glosa."
- No aplica: "no convertir un value-set en proceso; no exigir escritor sistémico a lo ambiental leído; no exigir rama explícita cuando la semántica de salida por defecto/probabilidad resuelve el destino."
- Realización opforja: "literal estandarizado `Coproducto XOR-n ...` al inicio de la glosa de la entidad, parseable por el barrido de integridad (convención local hd-opm/Mesa 7; cualquier realización equivalente vale si el barrido la reconoce)."
- Ancla: "El canon no prohíbe estados sin escritor: esta es disciplina de forja con autoridad de mesa, no ley ISO."
- Obligación: inferido DEBERÍA ("acusar por defecto" = advertencia). Herramienta: ADVERTIR "estado sin escritor" solo para entidades de flujo; no advertir si (a) hay efecto o resultado sin estado especificado sobre la entidad, (b) la glosa (`descripcion`) de la entidad empieza con `Coproducto XOR-n` (o marca equivalente), (c) la entidad es ambiental. NO DEBE bloquear.

### LF propuestas (método no ratificado; ninguna exige feature)

| LF | Título | Estado | Principio (condensado) | Consecuencia herramienta |
|---|---|---|---|---|
| LF-06 | Descomposición reactiva por eventos | propuesta | "cuando el orden lo deciden eventos (no el tiempo), modelar cada subproceso activado por su evento [...]; no forzar verticalidad temporal." Realización: "un enlace de evento por subproceso; verificar render en opforja." | PUEDE: no impedir eventos a subprocesos no-primeros (suprimir la advertencia de A3.4 cuando cada subproceso tiene su evento). Choca con "orden vertical semántico" (GAP-11) |
| LF-07 | Requisito inferido como sonda de completitud | propuesta · — | Requisito inferido = sonda; objeto informacional **Requisito** + enlace estructural etiquetado `satisface`; catálogo externo SSOT. Realización: "principio independiente de herramienta [...] si una capacidad no existe, el principio sigue vigente en el catálogo/metadatos." Ejemplo `Req#11: Glycolysis shall be controllable...` | SOLO-MÉTODO (basta objeto informacional + enlace etiquetado) |
| LF-08 | Interfaz crítica incorporada como paso 0 | propuesta · usa LF-07 | Si una frontera determina el comportamiento, modelarla dentro del in-zoom, incluso como paso `0`; "el rótulo `0` es solo navegación local" | SOLO-MÉTODO |
| LF-09 | Intermedio dual como producto/conector | propuesta · usa LF-07 | Intermedio con uso externo no es transiente; "registrar la hipótesis fuera del nombre canónico" | SOLO-MÉTODO |
| LF-10 | Control loop explícito | propuesta · usa LF-07 | Trípode **sensado → decisión → salida/señal** | SOLO-MÉTODO |
| LF-11 | OPDs-lente del SD | propuesta | Vistas-lente parciales antes del SD integrado; "puede representarse como OPD temporal o como nota externa; no depende de una función específica" | SOLO-MÉTODO (realizable con Bocetos) |
| LF-12 | Task analysis humano-máquina | propuesta | Humano + tecnología + procedimiento en un solo OPM; "no prometer animación ni monitoreo runtime si la herramienta no lo soporta" | SOLO-MÉTODO |
| LF-13 | Pre/Post condición como generador de contingencia | propuesta · usa LF-12 | Toda pre/post crítica incumplida → contingencia, espera, salto, mensaje, reparación o brecha | SOLO-MÉTODO |
| LF-14 | Ruta primaria y carriles valor/soporte | propuesta | Separar operandos/valor/soporte y extraer ruta primaria; "no depende de swimlanes nativos"; ejemplo `Collecting → Monitoring → Processing → Optimizing → Adjusting` | SOLO-MÉTODO |
| LF-15 | Intención-función-forma | propuesta | Función separada de forma; formas por gen-spec | SOLO-MÉTODO |
| LF-16 | Configuración como selección de instancias | propuesta | Genérico + variantes como especializaciones/instancias; "la herramienta no necesita enumerar automáticamente todas las combinaciones" | SOLO-MÉTODO |
| LF-17 | Aspecto transversal como overlay gobernado | propuesta · usa LF-02, LF-16 | Atributos exhibidos con polaridad y umbral; "usar atributos, aliases/metadatos o catálogo externo; no redefinir primitivas" | SOLO-MÉTODO |
| LF-18 | Pipeline predictivo empírico-sintético | propuesta · usa LF-10 | Separar proceso físico, datos empíricos, sintéticos, predicción; ejemplo *Machining*/*Simulating*/*Modeling* | SOLO-MÉTODO |

---

## 6. Apéndice F — Realización opforja (bundle `deep-opm-pro.modelo.v0`)

**F-formato** · inferido DEBE + "No emitir `formato` distinto" (NO DEBE) · IMPORT/EXPORT.
Textual: "El intercambio con la herramienta usa el documento JSON `{ "formato": "deep-opm-pro.modelo.v0", "modelo": {...} }`."

**F-núcleo del modelo tipado** · inferido DEBE (contrato de intercambio) · MODELO-DE-DATOS. Textual:
- **entidades** — `{id, tipo: objeto|proceso, nombre, esencia: fisica|informacional, afiliacion: sistemica|ambiental, descripcion?, esAtributo?, valorSlot?, refinamientos?}`. Atributo discreto: `esAtributo:true` **sin** `valorSlot` + estados.
- **estados** — `{id, entidadId, nombre, esInicial?, esFinal?, designaciones?, suprimido?}`. La app no acepta un único estado (≥2). Supresión **global** vía `suprimido`; supresión **per-aparición** vía `Apariencia.estadosSuprimidos[]` (LF-03).
- **enlaces** — `{id, tipo, origenId, destinoId, etiqueta?, estadoEntradaId?, estadoSalidaId?, multiplicidadDestino?}`. Tipos: `exhibicion`, `agregacion`, `agente`, `instrumento`, `efecto`, `resultado`, `consumo`, `invocacion`, `etiquetado`, etc.
- **refinamientos** (en la entidad) — `descomposicion: {opdId}` (in-zoom, contorno) | `despliegue: {opdId, modo: agregacion|exhibicion|generalizacion|clasificacion}` (unfold).
- **apariciones** (por OPD) — `{id, entidadId, opdId, x, y, width, height, contextoRefinamiento?, estadosSuprimidos?}`.
- **opds** — `{id, nombre, padreId, apariencias, enlaces, ordenLocal?}`. Árbol por `padreId`.

**F-reglas de realización** (textual) · DEBE/NO DEBE inferidos · IMPORT/EXPORT:
"Nombres idénticos entre OPD/OPL/bundle. Toda referencia entre OPDs internamente consistente o la app rechaza el import. Omitir campos opcionales antes que inventarlos (la app normaliza). No emitir `formato` distinto. Exportación = instantánea, no fuente de verdad."
→ IMPEDIR import con referencias rotas; normalizar opcionales al hidratar; export como snapshot; el nombre de la entidad es el mismo en OPD, OPL y JSON.
→ IMPEDIR entidad con exactamente un estado ("La app no acepta un único estado (≥2)").

**F-divergencias OPL operativas** · NO-APLICA (delegación). "La autoridad viva sobre realización OPL y su trazabilidad es `urn:fxsl:kb:spec-forja-opl-es` §20. [...] las exclusiones vivas son modificadores complejos, rutas, refinamientos y abanicos avanzados según el catálogo de fixtures."

**F-auto-normalización** · inferido (hedged: "Verificar el alcance exacto") · OPERACIÓN.
"Esencia: conectar un objeto como atributo (exhibición-caracterización) tiende a coaccionarlo a **informacional**; el enlace de **agente** solo se ofrece desde cosas físicas (humanas) — dejar que la UI normalice en vez de pelear con ella."
→ La herramienta PUEDE coaccionar esencia informacional al crear atributo; DEBE (vía invariante A8.2) ofrecer agente solo desde objetos físicos.

**F.1 Capacidades-objetivo (OPCloud — NO verificadas)** · explícitamente "capacidad-objetivo / aspiracional, NO como features operables" · NO-APLICA como requisito. Lista textual resumida: OPL-pane bidireccional (doble-clic abre editor); construir abanico XOR/OR arrastrando al mismo puerto; distribuir/recolectar enlace del contorno con un botón; resolver booleano de decisión de 4 formas; split input/output link; ontología de organización none/suggest/enforce; requisitos con satisfied-requirement-set y requirement views; grilla para alturas; análisis de modelo (informativity grading, missing-knowledge ML, requisitos por IA); sub-modelo con lazy-load y tres estados de sync, desconexión irreversible.
→ Nota: "OPL-pane bidireccional" coincide con lo que la herramienta ya debe tener por la bimodalidad/roundtrip de `spec-forja-opl-es` (no por este apéndice).

**F.2 Runtime opforja — condiciones y bucles (estado verificado 2026-06-03)** · declarativo sobre lo implementado; anclado a `reglas-opm-estrictas-es R-EJEC-7..10` · OPERACIÓN (runtime). Textual:
- "**Condición `c`** sobre consumo, efecto, agente o instrumento: si el objeto/estado condicionante no existe o no está vigente, la traza marca el proceso como `omitido`, no aplica transiciones/cambios/duración/salidas y avanza al siguiente paso secuencial."
- "**Múltiples condiciones**: AND para ejecutar; OR para omitir. La omisión por condición precede a cualquier espera o diagnóstico por precondición no condicional."
- "**Invocación explícita** `Proceso → Proceso`: al terminar el proceso origen, la simulación salta al proceso destino como siguiente paso lógico."
- "**Autoinvocación**: se ejecuta como bucle por invocación al mismo proceso. El bucle terminal canónico usa una condición/decisión que, al fallar, omite el proceso y permite salir. Un límite de seguridad bloquea bucles sin salida y deja diagnóstico runtime."
- "**Limitación conocida**: la ausencia de objetos sin estados no se infiere todavía como token consumible; para expresar ausencia/presencia ejecutable usar estados explícitos `existente`/`no-existente` o estado específico del objeto condicionante."
- Artefactos: `app/src/modelo/simulacion/runner.ts`, `.../integracionHechos.ts`, `.../runner.test.ts`, `app/src/leyes/integracion-ss-fs.test.ts` (circunstancial).
→ Si la herramienta rehecha ofrece simulación, DEBE comportarse así (la fuerza normativa real está en R-EJEC-7..10 de `reglas`).

---

## 7. Bitácora del artefacto (circunstancial)

Versiones 1.0.0 (2026-05-31) → 1.7.0 (2026-07-27). Relevante para la herramienta:
- v1.4.0/1.4.3: A0.4/A0.4a y el checker `DESCOMPOSICION_NO_PRESERVA_FRONTERA`; `verificarEquivalencia` existe en v0.
- v1.4.1: condiciones y loops ejecutables (R-EJEC-7..10).
- v1.5.0: LF-19 y advertencias de barrido.
- v1.6.0: arranque bottom-up (bosquejo → reconciliación → SD0, "se incorpora por **adopción**", R-OPD-REF-20).
- v1.7.0: separa ciclo documento (Apunte ⇄ Modelo) y componente (Boceto ⇄ OPD integrado); Reabrir/Devolver como inversas; graduación con pendientes; separa integración, cierre, export y validación humana.
Todo lo demás (mesa Asto·Besto·Resto, HITL, pneuma, bestia, sha256, rutas `/home/felix/_TEMP_BORRAR/...`) es procedencia: NO-APLICA.

---

## 8. Sobreingeniería o circunstancial para una herramienta simple

1. **Nombres y artefactos de v0**: formato `deep-opm-pro.modelo.v0`, "PanelMetodologia", helpers `atributo`/`atributoEstados`, `verificarEquivalencia`, rutas `app/src/modelo/simulacion/*.ts`, "(verificado en opforja v0)", "verificar soporte en opforja v0". El campo 6 del molde dice "app v0; puede evolucionar". Lo normativo es el principio; el único compromiso duro es "No emitir `formato` distinto" (compatibilidad de intercambio).
2. **F.1 completo** (capacidades OPCloud aspiracionales, no verificadas): ontología none/suggest/enforce, requirement views, informativity grading, missing-knowledge ML, requisitos por IA, lazy-load de sub-modelos con 3 estados de sync, grilla, botón distribuir/recolectar. El canon mismo dice que no son features.
3. **A1.5 como producto completo**: "Taller" como espacio global de documentos, "carpeta", "marcar Biblioteca", "crea una versión" al graduar, "validación humana registrada sobre una versión". Mínimo suficiente: un campo `régimen: apunte|modelo` por documento, OPDs Boceto (sin vínculo de refinamiento), operaciones Integrar/Devolver/Eliminar refinamiento, y bloqueo de export en régimen Modelo con Bocetos pendientes. Versiones, carpetas y Biblioteca son contrato de producto externo (`2026-07-27-taller-modelos-ciclo-reversible-design.md`), no OPM.
4. **A0.4a igualdad de firma entre OPDs hermanos** (PUEDE) y toda la lente categorial (fibración, ICAS, `opm-categorial-es`): omitible. El check pasivo de descomposición que no preserva frontera es barato y sí vale.
5. **A4.4 / LF-04 composición inter-modelo por sub-modelo** con interfaz congelada: pesado (dos SD0, compartidas, dueño/consumidor). Es "mecanismo canónico" en A4.1, pero puede quedar fuera de una primera versión si se declara.
6. **A7 simulación cuantitativa**: tasas, duraciones con distribución, flujo computacional con fórmulas, rangos soft/hard configurables por fase (diseño/ejecución/simulación), excepción cantidad < tasa × duración, errores de sobretiempo/subtiempo. Nada de eso es necesario para modelar/validar OPM conceptual.
7. **Animación de tokens** (A8.1): el propio canon la reemplaza por "ejecutar el gate tripartito paso a paso". El runtime F.2 solo se exige si se ofrece simulación.
8. **Asistente guiado de 11 etapas** como wizard: el canon lo nombra "default del asistente guiado" pero nunca exige la feature; las 11 etapas son pensamiento del modelador.
9. **LF-19 literal `Coproducto XOR-n`**: convención local hd-opm/Mesa 7; "cualquier realización equivalente vale".
10. **Viewpack, carriles de valor/soporte, lentes SD, ledger, validación stakeholder de dos marcas, procedencia de datos, polaridad de métricas** (A4.6, §9.29, A2.4, A8.1, A7, LF-11..LF-18): explícitamente "principio independiente de herramienta".
11. **Anclas a capas fuera del canon** (opm-es, opd-es, opl-es, manual, opm-iso-19450-es, ICAS): por instrucción del dueño no se siguen.

---

## 9. GAPs y contradicciones

- **GAP-1 Punteros fuera del canon.** Varias decisiones se delegan a documentos no entregados: matriz completa de precedencia al abstraer y combinaciones inválidas (`opd-es` §13, A3.4); control de flujo OPL (`opl-es` §7, A6); objeto específico de estado (`opl-es`, §9.22); supresión V-86..V-90 y semi-plegado V-116..V-120 (`opd-es`, LF-03/LF-05); "§7.5", "§8.1/8.2", "§12.8" (manual); invariantes con capa "manual"/"opm-es"/"opd-es" (A8.2); LF-19 ancla en `opm-iso-19450-es.md`. Si `reglas`/`spec-forja-opd`/`spec-forja-opl` no los reproducen, quedan sin fuente en el canon.
- **GAP-2 Severidad de invariantes A8.2.** §0.1 dice que el método "no es norma bloqueante", pero A8.1 nivel 1 bloquea y A8.2 lista invariantes cuya capa es "manual" (fuera del canon). Qué invariantes bloquean y cuáles advierten debe decidirse con `reglas-opm-estrictas-es`.
- **GAP-3 Nombre canónico vs superficie.** A2.3 dice "NO mezclar" infinitivo/nominalización en un modelo; §9.15 dice que las variantes "PUEDEN coexistir si mapean al **mismo nombre canónico interno**". Esto supone un nombre canónico interno distinto del de superficie, que el modelo del Apéndice F no tiene (solo `nombre`) y que choca con "Nombres idénticos entre OPD/OPL/bundle".
- **GAP-4 Esencia por defecto sin campo.** A2.3 remite la realización de la esencia primaria por defecto al Apéndice F, pero este solo trae `esencia` por entidad (obligatoria) y ningún default a nivel de modelo.
- **GAP-5 Fórmula de visibilidad de estados (LF-03).** "visibilidad efectiva = `Estado.suprimido` global **∧** local" está mal escrita: si se lee literal, un estado se oculta solo si está suprimido global Y localmente, lo que contradice "global domina". La lectura coherente es: oculto ⇔ suprimido global ∨ suprimido en la aparición. Además, "supresión per-aparición [...] solo en descomposición" (V-86..V-90) choca con A3.6 ("Suprimir en SD los estados no conectados"), que se aplica al SD raíz.
- **GAP-6 Modelo de datos incompleto frente al método.** El Apéndice F no tiene campos para: modificadores de control (condición `c`, evento `e`, NOT `instrument-not`/`event-not`), abanicos XOR/OR y probabilidades, etiquetas de ruta, multiplicidad de origen (solo `multiplicidadDestino?`), unidad/tipo/alias/rango de atributos (§9.20), `modoPlegado` (LF-05), régimen Apunte/Modelo y estado Boceto (A1.5), sub-modelo/compartida/dueño (LF-04), versión. La lista de tipos de enlace termina en "etc." Tampoco se explican `ordenLocal?`, `designaciones?`, `contextoRefinamiento?`, `valorSlot?`.
- **GAP-6b Nombres inconsistentes en el Apéndice F.** La colección se llama `apariciones`, dentro de `opds` se llama `apariencias` y LF-03 usa `Apariencia.estadosSuprimidos`. Hay `enlaces` a nivel de modelo y también `opds.enlaces`, sin decir si estos últimos son hechos o apariciones de enlaces.
- **GAP-7 Sub-modelos: un bundle o varios modelos.** LF-04 lo realiza como "dos SD0 en el mismo bundle"; A4.3 dice "Cada modelo tiene su árbol local; los sub-modelos componen **por referencia**, no por super-árbol global"; A8.2 exige "Exactamente un proceso principal por SD". No se define si un bundle con dos SD0 son dos modelos ni cómo se marca la referencia propietario/consumidor.
- **GAP-8 Migración de enlaces.** La tabla de A3.4 manda resultado al **último** subproceso, pero el bullet dice que al insertar el primer subproceso "los enlaces del contorno migran a él por defecto". Solo se concilia porque al insertar el primero, primero = último; tras insertar más no se dice qué pasa.
- **GAP-9 "Lo pendiente reaparece como cierre exigible".** A2 y A1.5 dicen que en régimen Modelo los pendientes se vuelven exigibles, pero no enumeran cuáles (¿las 11 etapas del SD? ¿Bocetos? ¿advertencias de nivel 2?) ni qué significa "exigible" más allá del bloqueo de export por Bocetos (R-CAN-BOCETO-1..4).
- **GAP-10 Validación humana registrada.** A1.5 menciona "una validación humana registrada sobre una versión" y A8.1 "dos marcas: validez metodológica y adecuación/feedback stakeholder", sin definir registro, campo ni versión en el modelo de datos.
- **GAP-11 Descomposición reactiva vs orden vertical.** A3.1 declara el orden vertical semántico y A3.5 deriva la invocación implícita de él; LF-06 pide subprocesos disparados por eventos "sin orden vertical". No hay forma de indicar a la herramienta que un in-zoom es reactivo, así que el OPL/simulación le impondría una secuencia (lo que LF-06 llama "el modelo miente").
- **GAP-12 Marca epistémica (To-Be).** A1.4 y §9.34 exigen "marcar la fuerza epistémica" o "marcar los hechos como diseño/propuesta", sin realización definida (¿glosa?, ¿campo?).
- **GAP-13 Cambio de rol entre niveles vs precedencia al abstraer.** §9.4 permite que un instrumento en SD sea afectado en SD1 (cambio neto 0); la precedencia al abstraer (`Efecto > Instrumento`) haría que al recomponer el enlace del padre se derive como efecto, lo que contradice el instrumento del SD. A2.1 añade que la vía "instrumento + atributo medido" solo es legal si `reglas` ratifica R-AG-3A. La herramienta necesita una regla para no sobrescribir el enlace del padre.
- **GAP-14 `satisface` desde un enlace.** A7 permite trazabilidad "desde objeto/proceso/enlace o desde un conjunto de componentes hacia el requisito". Un enlace como origen de otro enlace (y un conjunto como origen) no existe en el modelo de datos (origenId/destinoId apuntan a entidades) y rompe §9.23 (solo binarios entre cosas).
- **GAP-15 Obligación del runtime.** A8.1 dice "Si opforja v0 no anima, la disciplina equivalente es ejecutar el gate tripartito" (runtime opcional), mientras F.2 y A8.1 "Condiciones y bucles ejecutables" describen un runtime con límite de seguridad como parte del producto. No queda claro si la herramienta rehecha DEBE tener simulación.
- **GAP-16 Check pasivo sin definición.** `DESCOMPOSICION_NO_PRESERVA_FRONTERA` es "detectable (pasivo)", pero no se define qué es la firma de frontera computable (qué roles cuentan, cómo tratar la escisión con estado de A3.4 o la distribución de habilitadores) ni qué significa "pasivo" (se asume advertencia no bloqueante).
- **GAP-17 Umbrales difusos.** "20-25 entidades" (¿qué umbral dispara?), "~5 subprocesos", "2 por defecto" estados (etapa 3). Para implementar hay que fijar un número.
- **GAP-18 "≥2 estados" como regla de app.** "La app no acepta un único estado (≥2)" es comportamiento de la herramienta afirmado en un documento de método; su autoridad normativa debe confirmarse en `reglas`.
- **GAP-19 Tipografía.** §0.5 fija tipografía "canónica en ejemplos"; no dice si el panel OPL de la herramienta debe reproducirla (se remite a `spec-forja-opl-es`).
- **GAP-20 Idioma de ejemplos.** LF-02 y §9.12 dan ejemplos OPL en inglés (`exhibits`, `can be`) junto a plantillas es-CL (`exhibe`, `puede estar`). Las plantillas es-CL son las que sirven a la herramienta; las inglesas son corpus ilustrativo.
- **GAP-21 Eliminar OPD vs Eliminar refinamiento.** A4.3 "OPDs hoja = única clase eliminable" y A1.5 "Eliminar refinamiento es una operación destructiva distinta": no se dice si eliminar un refinamiento con subárbol exige borrar primero las hojas o borra en cascada.
