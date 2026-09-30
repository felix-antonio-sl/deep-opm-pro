# opforja: especificación del producto integrado

**Promesa:** comprende lo que cambias.

**Resultado objetivo:** una persona y el apoyo agéntico de opforja construyen, examinan y corrigen una representación de un sistema en el mismo espacio de trabajo. El documento conserva significado, procedencia y revisiones; permite explorar consecuencias y compartir lo comprendido.

**Fecha de elaboración:** 2026-09-10. **Base de código examinada:** 07fddc1ec47950a53144e800d795d9e8405091eb.

Esta es la especificación objetivo y la entrada al desarrollo solicitada por el operador. Define comportamiento y aceptación; las capacidades nuevas son **PROPUESTAS**, no implementadas ni validadas por su inclusión aquí. La dirección incorpora revisión adversarial de dos agentes separados: Dov Dori y un revisor con la skill modelamiento-opm, bajo dirección de diseño Steve Jobs. Son perspectivas sintéticas, no asesoría de las personas reales ni certificación ISO.

## 1. Decisión de producto y alcance

opforja existe para hacer comprensible y modificable el funcionamiento de un sistema. Su unidad de trabajo es un **documento de sistema**: una representación con propósito, identidad, declaraciones, vistas, fuentes, asuntos abiertos y revisiones. El sistema real permanece fuera del documento.

El apoyo agéntico en tiempo real es parte constitutiva del producto desde el primer incremento. Debe sostener un encargo, observar cambios relevantes, usar herramientas, elaborar y comprobar cambios, atender correcciones y cerrar un resultado. El usuario trabaja sobre su sistema sin transportar contexto entre aplicaciones, escoger skills ni administrar una flota de agentes.

Esta decisión sustituye la secuencia anterior que situaba la ayuda integrada al final. El núcleo determinista y la interfaz usable siguen siendo necesarios, pero el primer recorrido desarrollado debe incluir trabajo agéntico real.

### Personas y trabajo

| Persona | Trabajo que el producto debe permitir |
|---|---|
| Autor o modelador | Expresar lo conocido, explorar alternativas y mantener una representación útil |
| Especialista de dominio | Corregir una afirmación y explicar su fundamento sin dominar la organización del editor |
| Lector o revisor | Entender una revisión, navegar su profundidad y señalar una discrepancia precisa |
| Responsable del documento | Definir propósito, resolver significado, decidir incorporación y compartir revisiones |
| Mantenedor de producto y corpus | Conservar compatibilidad, capacidades observables y procedencia normativa |

La misma persona puede asumir varios papeles. Compartir acceso o delegar una tarea no transfiere por sí solo autoridad sobre el dominio.

### Frontera del producto

Incluye autoría bimodal, trabajo agéntico integrado, documentación progresiva, escenarios acotados, lectura compartida, revisión, persistencia y portabilidad. Los conectores aportan fuentes autorizadas y las bibliotecas aportan piezas con procedencia.

Quedan fuera del objetivo inicial la ejecución de procesos reales del dominio, la publicación autónoma, un marketplace, la simulación empresarial general, la conversión universal entre formalismos y la generación de software desde cualquier modelo. La voz puede añadirse como otra entrada al mismo contrato; el texto y la manipulación directa deben resolver el recorrido completo.

## 2. Estado de partida comprobado y distancia

La tabla identifica implementación observada en el código y límites documentados. No acredita el comportamiento de toda la instancia productiva ni una suite completa ejecutada durante esta especificación.

| Capacidad | Evidencia actual | Distancia al objetivo |
|---|---|---|
| Identidad y ciclo documental | [graduar/reabrir](../../app/src/persistencia/workspace.ts), [política de especie](../../app/src/persistencia/especie.ts) | Se conserva identidad; falta sustituir la organización y sus políticas visibles |
| Edición directa OPL | [tokens interactivos](../../app/src/ui/panelOpl/RenderToken.tsx), [editor libre](../../app/src/ui/panelOpl/EditorOplHonesto.tsx) | Ya hay renombrado directo; falta centralidad, acceso por teclado y edición contextual más amplia |
| Separación de capas | [ley de dependencias](../../app/src/leyes/dependencias-unidireccionales.test.ts) | Permite renovar interfaz y añadir servicios sin trasladar semántica al render |
| Fuentes y propuestas | [mesa de exploración](../../app/src/modelo/mesaExploracion.ts) | Implementa un circuito acotado; no es todavía un runtime agéntico general ni un protocolo de cambios multipaso |
| Agente externo y concurrencia | [contexto pull](../../app/src/mesa/contextoPull.ts), [Testigo-Base](../../app/src/mesa/baseWitness.ts), [API de persistencia](../../app/src/server/modelPersistence.ts) | Lectura y commit atómico de revisiones; falta interacción continua, tareas y operaciones compartidas en vivo |
| Derivación | [consultas sobre el grafo](../../app/src/modelo/razonamiento/derivar.ts) | Las consultas estructurales no son por sí solas una prueba de ejecutabilidad |
| Simulación conceptual | [runner](../../app/src/modelo/simulacion/runner.ts), [contexto runtime](../../app/src/modelo/simulacion/tipos.ts) | Requiere corregir habilitadores y representar conocimiento incompleto antes del ensayo prometido |
| Notas y versiones | [notas ancladas](../../app/src/modelo/notasMesa.ts), [versiones](../../app/src/persistencia/versiones.ts) | Base parcial para revisión; falta interlocución compartida sobre revisiones estables |
| Persistencia | [uso productivo](../uso-productivo.md) | Backend obligatorio; guardar localmente y sincronizar es capacidad nueva |
| Distribución | [límites actuales](../uso-productivo.md#límites-honestos) | Falta compartir revisiones con permisos por documento; lectura móvil existente no equivale al lector objetivo |

Se reutilizarán las capacidades que satisfagan los nuevos contratos. El número de archivos conservados o eliminados no será medida del avance.

## 3. Resolución de la confrontación

Las siguientes decisiones conservan objeciones que cambiaron el diseño. Los requisitos posteriores son la resolución propuesta; no se promedian criterios incompatibles.

| Objeción | Contraejemplo que debe resistir el producto | Resolución |
|---|---|---|
| Una ayuda invocable sigue dejando el trabajo en manos del usuario | El usuario repite contexto después de cada corrección | Intención persistente, herramientas y seguimiento de eventos desde el primer incremento |
| Integración puede confundirse con permiso ilimitado | Delegar revisar Entregar termina modificando Facturar | Alcance y autoridad fijados por tarea; la selección no los amplía |
| Confirmar cada microcambio anula la delegación | Crear cinco estados requiere cinco aprobaciones | Delegación por resultado y lotes coherentes; detenerse solo ante una decisión material fuera del mandato |
| Un documento único puede borrar fuentes propietarias | Editar una proyección sobrescribe el proto o una biblioteca externa | Un espacio de trabajo con fuentes y fronteras explícitas; una autoridad por contenido |
| La sustracción puede borrar diferencias necesarias | Compartir un bosquejo parece certificar un modelo cerrado | Asuntos abiertos, régimen de exportación y alcance de revisión conservados |
| La fluidez del texto puede ocultar un cambio semántico | Una paráfrasis se presenta como OPL o un resumen como el modelo completo | OPL formal, explicación y propuesta tienen correspondencias y alcances identificables |
| Un ensayo puede prometer más que su motor | Falta un habilitador y aun así aparece un resultado exitoso | Cobertura declarada, datos iniciales explícitos, comprobación de habilitadores e indeterminación |
| Una tarea válida puede sobrescribir trabajo humano | La respuesta llega después de una corrección concurrente | Base versionada, precondiciones, invalidación y aplicación atómica |
| Deshacer puede destruir trabajo posterior | Volver a un snapshot borra una edición humana intercalada | Inversa semántica por intención y revisión de dependencias |
| Cero entrenamiento puede convertirse en falsa pericia | La persona opera controles pero confunde instrumento y transformee | Usabilidad inicial y aprendizaje de modelado se evalúan por separado |

Se eligió **documento compartido con trabajo agéntico acotado y operaciones comunes**. Se descartó como destino agregar un chat lateral al editor sin contrato de tareas: preserva la separación cognitiva y no cierra el trabajo. Se descartó una reescritura total inicial: no aporta una prueba temprana de mejor comprensión y obliga a reconstruir capacidades que ya tienen consumidores.

La tensión entre el canon web-AI, que exige que la persona examine propuestas antes de incorporarlas, y la ejecución delegada se resuelve en la autoridad de la tarea. La exploración autónoma produce una variante examinable. Un comando directo o un encargo explícito de edición concede autoridad acotada para ejecutar; no concede validación del dominio ni publicación.

## 4. Documento, significado y fuentes

**DOC-01. Identidad.** El documento, sus entidades, estados, enlaces y OPDs conservan identificadores estables. Las etiquetas de navegación, nombres y posiciones no sustituyen identidad. Una aparición es una representación local de una entidad.

**DOC-02. Propósito progresivo.** El documento admite comenzar con una explicación o un ejemplo. Propósito, beneficiario, pregunta y criterio de suficiencia se recogen cuando afectan una decisión; no se exige completar un formulario inicial. La incertidumbre material permanece abierta o da lugar a una pregunta dirigida.

**DOC-03. Planos separados.** El documento distingue declaraciones incorporadas al modelo, material fuente, propuestas, hipótesis, supuestos, resultados derivados y revisiones humanas. Una declaración incorporada puede seguir siendo un supuesto del dominio. Aplicar un cambio no lo convierte en hecho observado.

**DOC-04. Contexto del modelo.** El trabajo identifica si describe lo existente, propone un diseño o explora una posibilidad. Cambiar esa modalidad no reetiqueta silenciosamente las declaraciones previas. Una alternativa conserva su base y diferencias.

Adoptar un diseño registra una decisión sobre la representación. Implementarlo en el sistema real requiere evidencia externa y no se deriva de ese acto. El contexto y horizonte de la representación se conservan al compartir y exportar.

**DOC-05. Fuente propietaria.** Todo documento declara si su contenido es de autoría nativa o derivado de una fuente externa. En el segundo caso, los cambios se proponen a la fuente o se crea explícitamente una variante de autoría propia. Se preserva el original y se declara la separación. Nunca se retira un sello para eludir este contrato.

La autoridad se comprueba también por modelo, fragmento o referencia afectada. Un contenedor nativo puede incluir submodelos y piezas externas protegidas; su propiedad no se hereda del contenedor. Copiar como contenido independiente exige una decisión explícita, identidad propia y conservación del linaje.

**DOC-06. Procedencia.** Una afirmación sustentada en una fuente conserva identidad y versión de la fuente, localizador del fragmento, transformación realizada y supuestos añadidos. Si falta respaldo, se dice. La fuente original no se sustituye por el resumen del agente.

**DOC-07. Revisión.** Una revisión humana identifica actor, versión, alcance y resultado. Se distinguen comprobación formal, correspondencia con el dominio y utilidad para el propósito. Ninguna queda acreditada por las otras.

Las fuentes, observaciones y tareas son metadatos de trabajo; no añaden primitivas OPM. Los submodelos conservan sus fronteras y propiedad aunque se naveguen dentro del mismo producto.

## 5. Experiencia observable

### Superficie principal

El sistema ocupa el foco. El texto OPL se muestra coordinado con el nivel y la selección, con acceso evidente al OPL completo. La autoría experta puede mantener ambas expresiones visibles. El índice y las propiedades aparecen cuando ayudan a la tarea; no son tres columnas obligatorias en todo momento.

La interfaz tiene una entrada de intención, **«Qué quieres conseguir»**, vinculada al documento. La conversación ampliada, las fuentes y la actividad de la tarea son desplegables del mismo trabajo. El usuario puede escribir mientras el agente trabaja, seleccionar el fragmento afectado y corregir el encargo sin trasladarse a otro producto.

| Gesto | Comportamiento exigido |
|---|---|
| Tocar una cosa, estado o frase | Seleccionar el mismo significado y revelar sus acciones pertinentes |
| Renombrar desde OPD u OPL | Una operación actualiza las apariciones y el texto correspondientes |
| Cambiar una relación desde su frase | Presentar las alternativas legales y su consecuencia; confirmar una operación semántica |
| Ver por dentro | Navegar a un refinamiento existente conservando origen y retorno |
| Describir por dentro | Crear una propuesta de refinamiento motivado; no confundirse con navegar |
| Escribir una intención | Iniciar o corregir una tarea contextual y mostrar el resultado en el documento |
| Detener | Revocar nuevos efectos de la tarea y conservar lo ya confirmado |
| Ensayar | Abrir un escenario separado de la revisión base |
| Compartir | Mostrar la revisión y el alcance de información que recibirá el destinatario |

Las explicaciones tienen referentes seleccionables. Una respuesta que menciona Entregar permite llegar al proceso correspondiente. La ayuda útil puede ser un cambio, una comparación, una pregunta decisiva o una explicación; no se mide por cantidad de conversación.

### Foco, teclado y legibilidad

Todas las operaciones centrales tienen acceso por teclado y foco visible. Enter confirma una edición local; Escape la abandona; Cmd/Ctrl+Z deshace la última intención aplicable. El doble clic y el arrastre tienen alternativas explícitas.

Una propuesta no cambia el viewport ni desplaza la selección humana automáticamente. El resultado invita a **«Ver cambios»**. Color y animación no son los únicos portadores de autoría, estado o error. Reducir movimiento conserva la información.

Laptop de 13 pulgadas es la superficie inicial de autoría. Teléfono permite lectura, navegación, observación y respuesta sobre una revisión. La gramática visual OPM conserva formas, marcadores, contornos y orden semántico en todas las superficies.

## 6. Trabajo agéntico en tiempo real

### Capacidades mínimas

**AG-01. Intención sostenida.** La tarea conserva resultado buscado, alcance, exclusiones, fuentes permitidas, autoridad, condiciones de parada y criterio de suficiencia. El usuario no debe reformularla ante cada evento o respuesta.

**AG-02. Iniciativa útil.** Con una tarea activa, el agente identifica trabajo pendiente, consulta fuentes autorizadas, examina el modelo, llama al verificador, construye cambios y comprueba su efecto. Puede detectar una contradicción que impide el resultado antes de que el usuario la pregunte. Sin tarea activa, no inventa un objetivo de trabajo ni genera actividad de fondo.

**AG-03. Contexto vivo.** Los cambios confirmados del documento actualizan el contexto de la tarea. Seleccionar otra cosa puede aportar contexto a una nueva instrucción deíctica, pero no cambia por sí solo intención, alcance o permisos.

**AG-04. Corrección durante ejecución.** Una instrucción como «conserva también la ruta presencial» revisa el encargo activo. Se detienen operaciones pendientes incompatibles, se conservan resultados válidos y se replantea el trabajo restante. La tarea no empieza de cero por perder su último intercambio conversacional.

**AG-05. Acción material.** El agente usa operaciones del producto para crear, modificar, comparar, consultar y verificar. Pegar texto con instrucciones que el usuario debe ejecutar no satisface un encargo de edición.

**AG-06. Continuidad visible.** La interfaz muestra el objetivo en curso, el estado real y una acción pertinente. Los avances se expresan como resultados o cambios observables, no como una narración continua de razonamiento.

**AG-07. Atención limitada.** El agente no interrumpe por cada observación ni repite avisos descartados mientras su fundamento no cambie. La falta de una decisión que altera el significado del trabajo sí puede suspender la parte dependiente; el trabajo independiente autorizado continúa.

**AG-08. Finalización.** Una tarea termina al cumplir su criterio, ser cancelada o sufrir un fallo definitivo. La necesidad de una decisión suspende solo la parte dependiente; agotar el presupuesto suspende la ejecución y conserva un resultado incompleto con continuación explícita. Al recibir la decisión o ampliar el presupuesto se comprueba vigencia y se retoma el mismo objetivo. El cierre informa qué cambió, qué se comprobó y qué sigue abierto. No sigue mejorando indefinidamente después de cumplir el encargo.

**AG-09. Vigencia del conocimiento.** Todo resultado conserva sus dependencias relevantes: revisión y elementos leídos, versiones de fuentes, supuestos y decisiones que lo condicionan. Si cambia una dependencia, se marca desactualizado y se vuelve a comprobar antes de usarlo. La tarea conserva también exclusiones y alternativas rechazadas con su razón para no reintroducirlas sin evidencia nueva.

Una edición ajena al resultado no reinicia la tarea. El control conservador de revisión del primer incremento puede exigir releer la base antes de un commit, pero conserva objetivo y trabajo todavía válido.

### Autoridad de la tarea

Las siguientes son facultades internas del producto, no un menú de modos que el usuario deba aprender.

| Situación | Facultad predeterminada | Límite |
|---|---|---|
| «Qué depende de Entregar» | Leer y derivar con herramientas | No incorpora declaraciones |
| «Propón cómo descomponer Entregar» | Elaborar y comprobar una variante | Incorporación mediante revisión del cambio |
| «Renombra Listo a Preparado» con referente inequívoco | Ejecutar esa edición directa y reversible | El resultado autorizado ya está especificado |
| «Completa este proceso usando estas fuentes; conserva la ruta presencial» | Ejecutar una tarea multipaso en variante por defecto | No inventar hechos ni incorporar al vigente sin autoridad para ello |
| «Aplica estos cambios al documento mientras trabajamos» sobre un alcance definido | Ejecutar lotes válidos dentro de esa delegación | No ampliar frontera, publicar, cambiar propietario o certificar dominio |
| Contradicción descubierta por iniciativa del agente | Investigar y proponer una resolución dentro de la tarea | No escoger silenciosamente entre verdades de dominio incompatibles |

Cuando una frase no fija suficiente autoridad de edición, el producto puede avanzar en una propuesta. La delegación se resume en lenguaje natural, por ejemplo: **«Completaré el detalle de Entregar en una variante, usando estas dos fuentes y conservando la ruta presencial»**. Si el mandato ya es claro, no se pide confirmación redundante.

Un mismo lote puede contener muchas operaciones dependientes. Se examina como un cambio con intención comprensible, no como una lista de tokens o docenas de botones Aplicar. Los lotes demasiado amplios para explicar su consecuencia se subdividen por intención.

El término agente de software describe al colaborador computacional. En un modelo OPM de ese trabajo, su eventual papel habilitador se representa conforme al criterio de instrumento no humano; no se convierte en agente OPM por llamarse agente en el producto.

### Estados y recuperación

| Estado observable | Condición y comportamiento |
|---|---|
| Preparando | Capturando la base, alcance y fuentes; todavía sin cambio incorporado |
| Trabajando | Ejecutando herramientas o elaborando un resultado; Detener disponible |
| Propuesta disponible | Hay un cambio comprobable; se puede examinar, corregir o descartar |
| Necesita una decisión | Explica el dato preciso y su efecto; conserva el resto del trabajo |
| Actualizando por cambios | Una base relevante cambió; recalcula antes de aplicar |
| Aplicado | La transacción confirmó; muestra revisión y deshacer |
| Suspendido | Sesión cerrada, conexión perdida, presupuesto agotado o servicio temporalmente no disponible; conserva tarea y resultados para continuar, sin iniciar nuevos efectos |
| Terminado, cancelado o fallido | Estado terminal con resultado, causa y recuperación pertinentes |

Cerrar el documento suspende el trabajo activo por defecto y conserva el encargo recuperable. Reabrir permite **«Continuar»** tras comprobar contexto y autoridad. La primera versión no ejecuta indefinidamente en segundo plano con la aplicación cerrada.

La cancelación tiene un punto de orden explícito: una transacción confirmada antes de aceptar Detener conserva su recibo; ninguna transacción posterior a esa aceptación puede autorizarse con la tarea revocada. Deshacer lo ya aplicado es una operación distinta.

## 7. Contrato común de operaciones y eventos

El editor, la interfaz textual, el agente integrado y los clientes externos utilizan el mismo contrato de efectos. El kernel sigue siendo determinista. La interpretación abierta vive en un servicio del producto con límites y fallos explícitos.

    Intención humana + documento + fuentes permitidas
                         |
                  Tarea contextual
                /                  \
       Agente de software      Edición directa
                \                  /
                 Operación semántica
                         |
         Validar base, autoridad e invariantes
                         |
              Commit atómico + recibo
                  /             \
             OPD / OPL       Persistencia
                         |
             Eventos para continuar la tarea

Esta es arquitectura de responsabilidades, no un despliegue ya existente. El servicio de tareas no depende de componentes UI. El render representa el resultado y nunca decide el significado.

### Información mínima de los contratos

| Contrato | Información obligatoria |
|---|---|
| ContextSnapshot | Documento, destino de trabajo identificado como vigente o variante, revisión, huella de trabajo local pendiente, alcance, referencias, fuentes autorizadas, perfil normativo y capacidades efectivas |
| TaskIntent | Identidad de tarea y destino vigente/variante, resultado, alcance, exclusiones, criterio de suficiencia, fuentes, autoridad y presupuesto |
| ChangeSet | Identidad idempotente, tarea y autor, destino vigente/variante, base, operaciones tipadas, elementos leídos y escritos, versiones de fuentes, supuestos y decisiones dependientes, explicación del cambio y resultados de comprobación |
| CommitReceipt | Identidad de cambio, resultado inequívoco, revisión anterior y posterior, efectos aplicados y vínculo a la operación inversa |
| TaskEvent | Identidad de evento y tarea, secuencia, estado, revisión pertinente y referencias a resultados; sin razonamiento interno como requisito de auditoría |

La serialización y los nombres físicos se fijarán en el primer incremento técnico. Los campos y sus garantías anteriores forman parte del contrato objetivo.

**TX-01. Integridad atómica.** Ninguna salida parcial de generación se incorpora como un grafo inválido. El streaming puede mostrar intención, texto provisional y previews distinguibles; solo los lotes completos y verificados producen cambios semánticos.

**TX-02. Base vigente.** Antes de aplicar se comprueban revisión, trabajo local pendiente y precondiciones del conjunto afectado. Una revisión de servidor no acredita que el agente haya visto ediciones aún locales. La capa de operaciones incorpora primero ese trabajo o rechaza la base; nunca lo pisa.

**TX-03. Concurrencia.** En el primer corte, una base semántica cambiada invalida la aplicación y exige nueva lectura. Una optimización posterior puede aceptar cambios independientes solo si demuestra independencia de lecturas, escrituras e invariantes, no por diferencia textual de rutas. Una incorporación que cambie el significado examinado requiere una nueva propuesta.

**TX-04. Idempotencia.** Reintentar tras un timeout o reconectar no duplica entidades, lotes ni revisiones. El recibo se persiste con el commit. Un estado de resultado desconocido se consulta por identidad antes de reintentar.

**TX-05. Deshacer.** Cada intención aplicada tiene un inverso semántico comprobado. Deshacer una tarea no restaura indiscriminadamente el snapshot anterior. Si hay trabajo posterior dependiente, se presenta el conflicto o una reversión compatible, preservando ambos resultados.

**TX-06. Eventos recuperables.** El cliente puede reanudar por cursor y deduplicar entregas. Un hueco exige recuperar un snapshot antes de proseguir. Reordenamiento, duplicación y pérdida de conexión no permiten concluir que una operación se aplicó sin recibo.

**TX-07. Autoridad comprobada.** El gateway comprueba documento, tarea, usuario, revisión y permisos en el momento del commit. Ningún prompt, fuente recuperada, salida de herramienta o token compartido amplía esa autoridad.

**TX-08. Fuente externa.** Toda operación comprueba la autoridad de los modelos, fragmentos y referencias afectados, incluso dentro de un documento nativo. Los contenidos derivados respetan DOC-05. El agente integrado no elude los contratos de procedencia que sí se exigen al agente externo.

## 8. Invariantes OPM y explicaciones

| Requisito | Comportamiento y fuente propietaria |
|---|---|
| OPM-01 Ontología | Objetos y procesos conservan sus distinciones; estados pertenecen a objetos; transformación y habilitación no se intercambian por comodidad. Reglas Forja, familia de entidades y R-AG-1/1A |
| OPM-02 Bimodalidad | Todo hecho incorporado tiene correspondencia OPD/OPL en el perfil soportado. Ediciones en una modalidad producen la misma operación de significado. R-BI-DUAL-1, R-BI-4 y spec OPL §19 |
| OPM-03 Alcance textual | El resumen y el OPL local indican su alcance; existe acceso al OPL completo y a los hechos fuera del foco. R-OPL-TOTAL-1..5 |
| OPM-04 Profundidad | Navegar, materializar una vista y crear un refinamiento son operaciones distintas. La vista no crea hechos. R-VIEW-1..4, R-BRING-1 |
| OPM-05 Refinamiento | Crear detalle exige una pregunta útil, preservación de frontera e invariantes y ausencia de ciclos. R-REF-1..4 y mecanismos propietarios |
| OPM-06 Posición | El orden de ejecución es una declaración semántica del refinamiento; la posición lo realiza. Una edición intencional del orden modifica declaración y OPL en una transacción. Mover para legibilidad y auto-layout conservan orden, bandas de paralelismo y hechos; si no pueden, no aplican la reorganización. R-LAY-4, R-INV-2D, R-IDP-0A y spec OPD |
| OPM-07 Señales | Selección, autoría agéntica, preview y error no reutilizan contornos, marcadores ni otros signos con significado OPM. Spec OPD y precedencia de ui-forja |
| OPM-08 Pendientes | Un bosquejo preserva integridad y hechos locales bimodales; la condición de pendiente no autoriza perderlos ni afirmar cierre. R-ENT-2-APUNTE y R-CAN-BOCETO-1..4 |
| OPM-09 Cobertura | Cada capacidad declara su soporte de edición, reverse, importación, exportación y ensayo. Un perfil parcial no se anuncia como conformidad total |

Las fuentes Forja incluyen decisiones locales de herramienta y adaptación lingüística. No se atribuyen automáticamente a ISO. La ficha pública de ISO 19450:2024 y la muestra consultada en la revisión previa permiten identificar la edición; esta especificación no contiene una auditoría del texto íntegro ni certifica conformidad con él.

Una explicación en lenguaje abierto puede acompañar OPL y apuntar a sus referentes. No reemplaza silenciosamente una oración formal. La aplicación muestra el cambio formal que una interpretación introduciría antes de incorporarlo salvo edición directa o delegación expresamente aplicable.

**OPM-10. Edición sin borrado implícito.** Omitir una oración en un resumen o en una edición parcial no borra el hecho omitido. El borrado es una operación explícita. Una producción reconocida sin aplicador preserva el input, informa la construcción no soportada y no muta el modelo. Una oración compuesta permite examinar los hechos individuales que expresa. Spec OPL §19, R-§19-SIM-2, R-§19-DISP-1/2, R-§19-LENS-1..3 y R-§19-COMP-1/2.

## 9. Ensayos y resultados derivados

**SIM-01. Escenario independiente.** Un ensayo fija revisión base, propósito, alcance, datos iniciales, supuestos, parámetros y capacidades utilizadas. Nunca altera el modelo base por el mero hecho de ejecutarse.

**SIM-02. Conocimiento.** El contexto de ensayo distingue condición satisfecha, incumplida y desconocida. Esa distinción pertenece al conocimiento del escenario; no inventa un estado de dominio llamado desconocido si el dominio no lo declara.

**SIM-03. Resultados diferenciados.** Avance posible, espera por precondición base, omisión por condición incumplida, evento no ocurrido o perdido, indeterminación y construcción no soportada se distinguen. Espera no significa imposibilidad general del sistema. No se usa una única etiqueta de éxito o fracaso para todos ellos.

La omisión por condición incumplida se decide antes de cualquier espera por enlaces base. El proceso omitido no aplica transiciones, cambios de valor, duración, resultados ni invocaciones de salida. R-EJEC-7/8/9 y tabla §6.1 de reglas Forja.

**SIM-04. Evidencia del resultado.** Una respuesta permite recorrer las declaraciones, datos y reglas que la sustentan. Un límite de pasos, una rama no explorada o datos faltantes conservan su efecto sobre la conclusión.

El resultado distingue «existe una trayectoria» de «todas las trayectorias». Un dato desconocido irrelevante no invalida una conclusión acotada; un límite de exploración informa truncamiento, no imposibilidad. Se prohíbe usar defaults silenciosos de estado inicial para producir certeza donde falta información.

**SIM-05. Lenguaje.** Se dice **«En este escenario…»** y **«Con las condiciones declaradas…»**. Alcanzabilidad estructural, ejecución bajo condiciones y predicción del sistema real son afirmaciones distintas.

**SIM-06. Habilitadores.** Antes de ofrecer resultados de ejecución, deben comprobarse existencia y estado requerido de agentes e instrumentos según los enlaces aplicables. Una transición del transformee no acredita por sí sola que el proceso podía ocurrir.

**Brecha observada durante la revisión:** el revisor OPM reprodujo un proceso que alcanza su resultado aunque el instrumento requerido está en otro estado. El runner actual comprueba modificadores de evento/condición y transiciones, pero ese recorrido no garantiza los habilitadores base. La corrección y sus pruebas son requisito previo a la promesa SIM-06; no están implementadas por este documento.

El primer ensayo cubre un conjunto declarado de transformaciones, estados y habilitadores. La generalización se incorpora construcción por construcción con testigos positivos, negativos e indeterminados. Los resultados derivados no se convierten automáticamente en hechos del documento.

## 10. Lectura, revisión y piezas

**READ-01. Compartir una revisión.** El destinatario recibe una revisión identificada y navegable. Los cambios posteriores del autor no modifican silenciosamente lo compartido.

**READ-02. Alcance de acceso.** El autor examina qué contenido, fuentes y observaciones se incluyen. Tener acceso al modelo no concede acceso implícito a todas sus fuentes. El lector distingue fuente ausente de fuente no autorizada.

**READ-03. Observación anclada.** Una discrepancia conserva revisión, referente, autor y texto. Si el referente desaparece en una revisión posterior, la observación sigue siendo legible sobre su revisión de origen.

**READ-04. Cierre de revisión.** Resolver una observación registra qué cambió o por qué se mantiene la decisión. No borra retrospectivamente la discrepancia ni equivale a certificar el sistema entero.

**REUSE-01. Piezas.** Un fragmento reutilizable declara función, frontera, versión, perfil y procedencia. Insertarlo comprueba identidades y compatibilidad. Actualizarlo muestra un cambio examinable y reversible; la biblioteca de dominio conserva su propietario.

Insertar como referencia mantiene la protección de la fuente. Crear una copia independiente registra una bifurcación con identidad propia y linaje; no se presenta como actualización de la referencia original.

La igualdad de una firma de frontera acredita solo el observable comparado. Dos piezas con iguales entradas y salidas pueden diferir en tiempo, errores, reintentos o conducta interna. La comparación declara esas dimensiones cuando afectan al consumidor; no anuncia sustitución segura ni bisimulación a partir de la firma. Reglas Forja R-CAT-EQ-1..3.

El lector utiliza las mismas proyecciones semánticas. No reconstruye el modelo mediante una interpretación LLM ni mantiene una segunda versión manual de OPL.

## 11. Persistencia y autonomía del documento

**SAVE-01. Estados verdaderos.** En el estado inicial, Guardado significa confirmación del backend. Guardado aquí solo se mostrará después de una escritura local durable; Sincronizado requiere confirmación remota de la misma revisión.

**SAVE-02. Trabajo local.** El destino incluye abrir, leer, editar, deshacer y exportar sin conexión tras disponer del documento y los recursos necesarios. La inferencia remota puede suspenderse; el producto sigue permitiendo trabajo manual y determinista.

**SAVE-03. Reconexión.** Los cambios pendientes tienen identidad y base. La sincronización no aplica último escritor gana a conflictos de significado. Un conflicto conserva ambas ramas y permite resolución.

**SAVE-04. Portabilidad.** El paquete portable incluye esquema/versiones, identidades, declaraciones, vistas necesarias, fuentes incluidas con autorización, localizadores de las omitidas y revisiones seleccionadas. Puede abrirse con un lector compatible sin depender de la cuenta o del proveedor LLM original.

**SAVE-05. Fallo local.** Si el almacenamiento local falla, el producto no muestra guardado ni descarta el trabajo. Ofrece copia descargable y mantiene visible el alcance no persistido.

No es obligatorio descargar fuentes remotas completas para cada edición. La portabilidad declara qué contiene y qué requiere acceso externo; no promete autosuficiencia falsa.

## 12. Latencia, límites y acceso a fuentes

Tiempo real significa continuidad interactiva: la persona ve estados y resultados relevantes, puede intervenir durante el trabajo y el agente atiende una base actualizada. No significa plazo determinista para cualquier inferencia.

| Aspecto | Objetivo de aceptación inicial |
|---|---|
| Interacción local | Respuesta visible p95 menor de 100 ms en selección y edición del caso de referencia |
| Inicio de tarea | Acuse visible menor de 300 ms; procesamiento remoto no bloquea edición |
| Espera | Si pasan 2 s, mostrar estado real y Detener; nunca porcentaje inventado |
| Resultado agéntico | Medir tiempo al primer resultado útil y al cierre, separado de tiempo a primer token |
| Presupuesto | Toda tarea tiene límite de tiempo, uso y herramientas; al agotarse conserva resultados y ofrece continuación |
| Avisos | Una interrupción exige que cambie una acción o decisión del usuario; observaciones secundarias quedan junto a su referente |

Son metas propuestas, no mediciones ya obtenidas. La primera prueba registra equipo, navegador, tamaño de modelo, red y servicio. Se rechaza ocultar una espera lenta mediante animaciones de progreso ficticio.

El runtime utiliza credenciales de servicio fuera del navegador, herramientas acotadas al documento y acceso a fuentes conforme al usuario. Texto de una fuente es contenido, no una instrucción con autoridad. Las pruebas incluyen una fuente que intenta ampliar permisos, publicar contenido o modificar otro documento.

La configuración del servicio declara proveedor, residencia/retención aplicable, límites y costo antes de habilitarlo para datos reales. Los recibos técnicos evitan duplicar fuentes o secretos en logs. Este documento no elige un proveedor ni autoriza enviar el corpus privado completo a un tercero.

## 13. Evolución coordinada de contratos

La implementación actual sigue rigiéndose por sus contratos vigentes hasta que el incremento que los reemplaza actualice fuente y pruebas. Esta especificación no cambia por sí sola el canon publicado.

| Contrato actual | Cambio objetivo | Secuencia exigida |
|---|---|---|
| [EQUILIBRIO](../decisiones/equilibrio-llm.md) | Servicio agéntico dentro del producto; kernel determinista preservado | Especificar efectos/fallos/autoridad y actualizar la decisión en el incremento de integración |
| [Gobierno visual](../../ui-forja/GOVERNANCE.md) | Foco de trabajo y paneles contextuales; retirar tres columnas/360 px como obligación universal | Actualizar contrato visual y escenas junto con la nueva interfaz |
| Ciclo Taller/Apunte/Modelo | Documento continuo con política de pendientes y revisión | Mantener flags compatibles primero; reemplazar efectos mediante migración comprobable |
| R-ENT-2-APUNTE y R-CAN-BOCETO-1..4 | Expresar las protecciones en la política sucesora | Preparar enmienda en KORA; publicar por su circuito; consumir versiones compatibles |
| Puente mesa y modelamiento-opm | Clientes externos e integrados sobre operaciones y revisiones comunes | Mantener compatibilidad del puente hasta migrar consumidores; conservar no-clobber y procedencia |
| Fuentes del Tutor y skills | Capacidades internas y ayuda contextual con corpus versionado | Cambiar la fuente propietaria; renderizar/instalar por el circuito KORA; evaluar comportamiento efectivo |
| Exportación actual | Paquete portable y revisión compartida sin cierre implícito | Mantener importación de documentos anteriores y declarar pérdidas en exportes reducidos |

**MIG-01. Sin pérdida silenciosa.** La migración conserva original, identidad, hechos, apariciones, OPDs sueltos, flags significativos, fuentes, revisiones y propiedad. Todo dato no representable conserva un contenedor recuperable y una advertencia concreta; no se elimina para hacer pasar un importador.

**MIG-02. Regímenes.** Un Apunte se abre con sus pendientes; un Modelo no adquiere validación humana retrospectiva; una Biblioteca mantiene su protección de fuente; un Boceto conserva su independencia del árbol. La nueva interfaz no integra ni gradúa por inferencia.

**MIG-03. Perfil fijado.** Un documento conoce el perfil con que fue interpretado. Actualizar corpus o motor no cambia silenciosamente su significado; una migración semántica requiere mostrar diferencias y conservar recuperación.

**MIG-04. Retiro.** La interfaz anterior puede coexistir como recuperación durante el piloto con los mismos documentos y un solo núcleo. Se retira cada recorrido cuando el sucesor cubre sus consumidores y la recuperación probada. No se mantienen dos fuentes de significado.

### Propuesta no normativa para revisar en KORA

Esta propuesta queda en el repositorio de opforja; no modifica ni reemplaza las SSOT publicadas. Mantener `Apunte` como régimen documental y `Boceto` como estado local de un OPD: una política visual unificada puede mostrar ambos en el mismo documento, pero no infiere integración, graduación, propiedad ni ratificación. La transición Apunte↔Modelo conserva la identidad del documento; Integrar/Devolver conserva la identidad y el contenido del OPD; graduar y reabrir tampoco equivalen a revisión humana. `R-ENT-2-APUNTE` conserva su regla de emisión OPL en todas las superficies y R-CAN-BOCETO-1..4 conserva sus gates de exportación. El consumidor propuesto es `deriveDocumentPolicy` más la importación recuperable; sus pruebas son `documentPolicy.test.ts`, `documentMigration.test.ts` y `e2e/document-continuity.spec.ts`. Custodia, deliberación, publicación y selección de versiones compatibles siguen pendientes del circuito KORA.

## 14. Secuencia desde el código actual

Cada incremento es una entrega vertical. La tabla define resultados y dependencias, no fechas ni estimaciones de calendario.

| Incremento | Resultado exigido | Dependencias y cierre |
|---|---|---|
| I1. Trabajar juntos sobre una transformación | Intención persistente, contexto del modelo, una tarea agéntica multipaso real, corrección durante ejecución, cambio comprobado, deshacer y reabrir | Operaciones acotadas sobre el kernel actual; gateway, base/recibos y servicio reales; aceptación A01–A07 |
| I2. Continuidad del documento | Biblioteca unificada, pendientes contextuales, revisión por versión y navegación coherente | DOC/MIG; conserva políticas actuales mientras migra su fuente; A08–A10 |
| I3. Comprensión compartida | Lector de revisión fija, fuentes según acceso y observación anclada | Identidad/revisiones de I1–I2; A11–A12 |
| I4. Ensayos explicables | Escenarios separados, habilitadores correctos, indeterminación y límites visibles | Corregir brecha del motor y fijar cobertura; A13–A15 |
| I5. Autonomía y portabilidad | Guardado local, reconexión sin pérdida y paquete recuperable | Operaciones idempotentes y revisiones de I1; A16–A18 |
| I6. Reutilización y expansión | Piezas versionadas, fuentes adicionales y tareas más amplias sobre el mismo contrato | Evidencia de uso y compatibilidad por construcción; A19, A21 |

La agencia atraviesa todos los incrementos. I6 amplía su alcance; no es su primera aparición.

### Primer incremento listo para convertir en plan

**Resultado:** construir conjuntamente una transformación pequeña y corregirla mientras el agente trabaja.

Entrada: un documento nativo sintético de pedido, con propósito y referencias iniciales suficientes, más una explicación breve aportada como fuente. Para un mismo pedido, retiro presencial y reparto son alternativas excluyentes ya declaradas en el documento inicial. Esa decisión es un dato del fixture sintético, no una inferencia sobre cualquier negocio. El flujo no exige ambas rutas simultáneamente.

La cobertura inicial de autoría incluye objeto, proceso, estado y enlaces procedimentales básicos. La exclusión XOR y los refinamientos existentes entran en lectura, OPL, preservación y comprobación; su autoría nueva se amplía en otro corte con cobertura explícita. I1 no puede declarar éxito si conserva las figuras pero pierde la exclusión entre rutas.

Encargo de referencia: **«Completa la preparación y entrega del pedido a partir de esta explicación; conserva la ruta de retiro presencial»**. El agente recupera contexto, distingue hechos y huecos, ejecuta herramientas y produce una variante con varios cambios relacionados. Mientras trabaja, la persona renombra un estado y añade **«El retiro presencial no necesita repartidor»**. El agente mantiene el encargo y revalida el resultado contra la corrección.

La persona examina el cambio en OPD y OPL, lo incorpora como una intención, deshace preservando la edición humana previa, lo reaplica, guarda y reabre. Un segundo recorrido delega un cambio inequívoco sobre el documento vigente y verifica que no requiere aprobar cada operación.

I1 incluye deliberadamente servicio agéntico real, gateway de operaciones, eventos recuperables, cancelación, error de proveedor y medición de interacción. Un mock sirve a tests deterministas, pero una demostración solo con respuestas pregrabadas no cierra I1.

La cobertura de I1 incluye también A20, A22, A23 y A24: acceso a fuentes, vigencia de resultados, edición textual sin pérdidas y suspensión recuperable son condiciones de la primera agencia integrada, no endurecimiento pospuesto.

El primer plan técnico delimitará archivos y operaciones exactas. Reutilizará modelo, store y contratos de app sin una refactorización general. Las decisiones de transporte, proveedor y almacenamiento de tareas se resolverán por la capacidad exigida y sus pruebas, manteniendo estos invariantes.

## 15. Aceptación y pruebas que pueden refutar el diseño

| ID | Prueba | Resultado requerido |
|---|---|---|
| A01 | Persona nueva abre un ejemplo y corrige un estado desde texto o figura | Reconoce la misma modificación en ambas expresiones sin explicación previa de controles |
| A02 | Encargo multipaso con herramientas reales sobre el fixture con rutas excluyentes | Produce un cambio material comprobado y conserva el XOR; la persona no transporta contexto ni ejecuta instrucciones manuales del agente |
| A03 | La persona precisa durante ejecución que retiro presencial no necesita repartidor | Se conserva intención, se afecta solo la dependencia de esa ruta y se invalida el resultado incompatible; no se pierde la exclusión ni se exigen ambas rutas |
| A04 | La persona selecciona otro proceso sin instrucción nueva | El agente no amplía ni cambia su mandato |
| A05 | Una edición humana ocurre antes de llegar un cambio agéntico | No se sobrescribe; nueva base o conflicto explícito |
| A06 | Detener coincide con un commit; respuesta se pierde y luego se reintenta | Recibo inequívoco, ningún efecto nuevo después de revocación y ninguna aplicación duplicada |
| A07 | Deshacer una intención agéntica con edición humana intercalada | Conserva lo ajeno; las dependencias conflictivas se resuelven explícitamente |
| A08 | Abrir y recorrer Apunte, Modelo, Biblioteca y Boceto anteriores | Identidad, significado, pendientes y protecciones se conservan |
| A09 | Renumerar OPDs, navegar, crear una vista, refinar y reorganizar geometría | Referencias estables; vista sin hechos nuevos; frontera preservada; auto-layout conserva ordenInzoom, paralelismo y hechos; cambio intencional de orden actualiza OPD, OPL y plan |
| A10 | Exportar texto local, resumen y modelo completo | Alcance explícito y acceso al OPL total; ningún pendiente desaparece por presentación |
| A11 | Otra persona abre una revisión compartida desde teléfono | Comprende la transformación, navega y deja observación en un referente preciso |
| A12 | El autor cambia o elimina el referente después | La observación sigue siendo legible sobre su revisión de origen |
| A13 | Ensayar con un habilitador base requerido presente, ausente y en estado incompatible | Avance en el caso habilitado; espera sin producir resultado en los impedidos |
| A14 | Comparar condición falsa, dato desconocido y construcción no soportada; combinar condición falsa e instrumento base ausente | Distingue omisión, indeterminación y falta de soporte. En el caso combinado omite antes de esperar, sin valores, transiciones, duración ni invocación de salida |
| A15 | Derivación alcanza un estado por el grafo pero falta una condición de ejecución | Distingue alcanzabilidad de ejecutabilidad y explica la limitación |
| A16 | Cortar red, editar, cerrar y reabrir tras guardar aquí | El trabajo confirmado localmente se recupera y la falta de sincronización sigue visible |
| A17 | Dos clientes cambian declaraciones relacionadas y reconectan | Conserva ambas revisiones; no fusiona significado por último escritor |
| A18 | Abrir paquete en otro entorno compatible sin proveedor LLM | Reconstruye lo incluido y declara dependencias omitidas |
| A19 | Insertar y actualizar una pieza con cambios de frontera dentro de un documento nativo | Conserva autoridad externa, comprueba compatibilidad y muestra diferencia; copia independiente explícita y reversión disponibles |
| A20 | Fuente recuperada intenta ordenar acceso a otro documento o publicación | Se trata como contenido; no amplía autoridad ni produce esos efectos |
| A21 | Dos piezas comparten firma neta, pero una duplica el efecto al reintentar | La diferencia de conducta permanece visible; no se anuncia equivalencia total |
| A22 | Cambiar una fuente o supuesto del que depende una propuesta; cambiar después otro irrelevante | La primera pierde vigencia y se recomprueba; la segunda no reinicia el objetivo ni repone alternativas rechazadas |
| A23 | Resumir OPL, omitir una línea, editar una producción sin aplicador y abrir una oración compuesta | Se conservan hechos/input; se declara soporte y se accede a los hechos individuales |
| A24 | Faltan una decisión o presupuesto; falla temporalmente el proveedor; después se continúa | Conserva intención y resultados, permite trabajo manual, distingue suspensión de cierre y retoma sobre base vigente sin repetir efectos confirmados |

La evaluación inicial de uso incluye cinco personas ajenas al diseño, combinando lectores de dominio y modeladores. Se propone como umbral inicial que al menos cuatro completen el recorrido central sin enseñanza de controles, expliquen correctamente qué cambió y distingan propuesta de declaración incorporada. Toda pérdida de datos, sobrescritura silenciosa o interpretación semántica falsa del caso central bloquea el cierre aunque los tiempos sean buenos. Es un umbral formativo, no evidencia estadística de adopción universal.

Se registran tiempo a primera comprensión, cierre de tarea, ayuda requerida, errores de significado, recuperación, interrupciones y tamaño de cambios examinables. Se compara el mismo caso con el recorrido actual, sin enseñar uno y dejar el otro sin entrenamiento.

Para código: gate mínimo [AGENTS.md](../../AGENTS.md), pruebas semánticas y escenario de navegador afectados. Los cambios visuales cumplen además el contrato de ui-forja; los transversales usan el gate correspondiente. Se reportan por separado comprobación mecánica, revisión conceptual, prueba con servicio real, uso humano y despliegue. Ninguna suite acredita todas esas cosas.

## 16. Fuentes, responsabilidades y límites

### Fuentes propietarias

La autoridad local está en [AGENTS.md](../../AGENTS.md), el [índice documental](../README.md) y los contratos citados. Las referencias KORA se resuelven por URN mediante el [resolutor](../canon-opm/resolutor-urn.json); no se copia su corpus al producto.

| Fuente | Uso en esta especificación |
|---|---|
| urn:dev:kb:steve-jobs-canon-diseno | Sustracción, foco, unidad, reversibilidad y prueba de uso |
| urn:dev:kb:steve-jobs-principios-web-ai | Control, trazabilidad, latencia y confianza calibrada |
| urn:dev:kb:steve-jobs-principios-agentico | Acción por resultado y herramientas como frontera de alcance |
| urn:fxsl:kb:reglas-opm-estrictas-es | Validez, identidad, agentes/instrumentos, vistas y regímenes |
| urn:fxsl:kb:spec-forja-opd-es | Gramática visual, refinamiento y orden semántico |
| urn:fxsl:kb:spec-forja-opl-es | Correspondencia textual, edición, cobertura y OPL completo |
| urn:fxsl:kb:metodologia-forja-opm-es | Trabajo progresivo, procedencia, juicio humano y operación con agentes |
| urn:fxsl:kb:opm-es | Procedencia conceptual delegada, sin reemplazar reglas Forja |
| [ISO 19450:2024](https://www.iso.org/standard/84612.html) | Edición de referencia; no se afirma auditoría normativa integral |

Los registros KORA examinados de canon Jobs y reglas Forja conservan disponibilidad con publicación legacy. Esto no constituye una nueva aprobación ni una evaluación de equivalencia semántica de todo el corpus instalado.

### Responsabilidades y decisiones de desarrollo

El operador fijó la dirección de producto y la necesidad de agencia integrada. Esta especificación propone su realización. El responsable de producto custodia la experiencia; el responsable semántico custodia compatibilidad OPM; desarrollo implementa y comprueba; el mantenedor KORA tramita enmiendas en su fuente; los usuarios de dominio validan significado y utilidad.

Proveedor y modelo de inferencia, transporte, almacenamiento de tareas y política operativa de datos se concretan en el primer plan técnico con evidencia de ejecución y condiciones aplicables. Esas elecciones no autorizan reducir AG-01..09 a un chatbot ni trasladar integridad al LLM.

La amplitud del motor de ensayos, la usabilidad del nuevo recorrido y el comportamiento de la agencia en vivo siguen siendo cuestiones por comprobar. El criterio para continuar es el recorrido que cada incremento permite realizar, no la fidelidad estética a una maqueta ni el volumen de código producido.

## 17. Testigo de la brecha de habilitadores

Reproducción ejecutada por el revisor modelamiento-opm contra la base indicada al inicio, sin escribir archivos. Es evidencia de un caso; no inventario exhaustivo del simulador. Usa un vehículo físico como instrumento para que el resultado no dependa de la distinción terminológica entre agente humano y software.

Desde app/, con Bun disponible:

```bash
bun -e '
import {
  crearModelo, crearObjeto, crearProceso, crearEstadosIniciales,
  crearEnlace, cambiarEsencia, renombrarEstado
} from "./src/modelo/operaciones";
import { extremoEntidad, extremoEstado } from "./src/modelo/extremos";
import { iniciarSimulacion, ejecutarPaso } from "./src/modelo/simulacion/runner";

const must = r => { if (!r.ok) throw Error(r.error); return r.value; };
let m = crearModelo("Habilitador requerido");
for (const n of ["Pedido", "Vehiculo"])
  m = must(crearObjeto(m, m.opdRaizId, {x:100,y:100}, n));
m = must(crearProceso(m, m.opdRaizId, {x:300,y:200}, "Entregar"));
const id = n => Object.values(m.entidades).find(e => e.nombre === n).id;
const p=id("Pedido"), v=id("Vehiculo"), e=id("Entregar");
m = must(cambiarEsencia(m, v, "fisica"));
const ps=must(crearEstadosIniciales(m,p)); m=ps.modelo;
const vs=must(crearEstadosIniciales(m,v)); m=vs.modelo;
for (const [i,n] of [
  [ps.estadoIds[0],"listo"], [ps.estadoIds[1],"entregado"],
  [vs.estadoIds[0],"no disponible"], [vs.estadoIds[1],"disponible"]
]) m=must(renombrarEstado(m,i,n));
m=must(crearEnlace(m,m.opdRaizId,
  extremoEstado(ps.estadoIds[0]),extremoEntidad(e),"consumo"));
m=must(crearEnlace(m,m.opdRaizId,
  extremoEntidad(e),extremoEstado(ps.estadoIds[1]),"resultado"));
m=must(crearEnlace(m,m.opdRaizId,
  extremoEstado(vs.estadoIds[1]),extremoEntidad(e),"instrumento"));
let c=iniciarSimulacion(m,m.opdRaizId);
c={...c,estadosCurrent:{
  ...c.estadosCurrent,[p]:ps.estadoIds[0],[v]:vs.estadoIds[0]
}};
const result=ejecutarPaso(m,c);
console.log(JSON.stringify({
  instrumento:"Vehiculo", esencia:m.entidades[v].esencia,
  requerido:m.estados[vs.estadoIds[1]].nombre,
  observado:m.estados[c.estadosCurrent[v]].nombre,
  resultado:result.estado,
  pedido:m.estados[result.estadosCurrent[p]].nombre,
  diagnostico:result.trace[0]?.diagnostico??null
},null,2));
'
```

Salida observada:

```json
{
  "instrumento": "Vehiculo",
  "esencia": "fisica",
  "requerido": "disponible",
  "observado": "no disponible",
  "resultado": "completado",
  "pedido": "entregado",
  "diagnostico": null
}
```

R-EJEC-6..9 y la tabla de control §6.1 de reglas OPM/Forja obligan a distinguir habilitación base ausente, condición incumplida y evento. A13 requiere que este caso deje de producir el resultado de entrega antes de ofrecer SIM-06.
