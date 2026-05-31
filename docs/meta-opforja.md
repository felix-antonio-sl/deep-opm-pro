# Lo que queremos lograr con OPFORJA

## 1. Modelado OPM Nuclear

### Creación de primitivas

- Crear objetos y procesos como las dos clases nucleares de cosas OPM.
- Crear cosas desde el canvas, desde barras contextuales, desde listas de cosas existentes y desde asistentes de creación.
- Nombrar objetos, procesos y estados con autoformato opcional.
- Renombrar cosas desde el diagrama, desde paneles textuales o desde diálogos de propiedades.
- Validar o advertir nombres duplicados para evitar que dos cosas lógicas distintas compartan el mismo nombre.
- Reutilizar una cosa existente como nueva instancia visual cuando se detecta un nombre ya usado y el tipo coincide.
- Proponer renombrar una cosa nueva cuando el nombre ya existe pero no corresponde reutilizar la misma cosa lógica.
- Distinguir objeto físico de objeto informático/informacional.
- Distinguir proceso físico de proceso informático/informacional.
- Configurar una esencia por defecto para cosas nuevas según preferencia personal u organizacional.
- Definir afiliación sistémica o ambiental para objetos y procesos.
- Cambiar esencia y afiliación durante el modelado y reflejarlas en la representación visual y textual.
- Crear atributos como objetos caracterizadores de objetos o procesos.
- Crear operaciones como procesos que caracterizan objetos o procesos.
- Asignar descripciones textuales a cosas.
- Asociar URLs, imágenes, videos, artículos, textos u otros recursos externos a una cosa.
- Mostrar indicadores visuales de que una cosa tiene descripción o recursos vinculados.
- Abrir recursos asociados desde la cosa.
- Crear múltiples apariciones visuales de una misma cosa lógica en distintos OPDs.
- Navegar entre ubicaciones de una misma cosa lógica.
- Evitar mezclar instancias visuales con cosas lógicas distintas.
- Crear cosas computacionales cuando un objeto o proceso debe portar valores, alias, unidades, rangos o lógica de cálculo.
- Asignar alias a cosas para referenciarlas en cálculos, ejecución y mensajes.
- Definir unidades para valores computacionales.
- Definir valores escalares iniciales en objetos computacionales.
- Marcar procesos como computacionales para que participen en ejecución numérica o conectada.

### Estados

- Agregar estados a objetos desde halo/contexto o desde barra secundaria.
- Crear dos estados iniciales al convertir por primera vez un objeto sin estados en un objeto con estados.
- Agregar estados adicionales uno a uno después de la primera creación.
- Nombrar estados en minúscula y avanzar rápidamente entre campos de edición.
- Renombrar estados sin romper su pertenencia al objeto.
- Marcar estados iniciales.
- Marcar estados finales.
- Marcar estados por defecto.
- Marcar estado actual declarado o estado current de simulación cuando corresponde.
- Permitir que un estado sea simultáneamente inicial y final cuando el ciclo del objeto lo exige.
- Impedir combinaciones de designaciones incompatibles cuando contradicen la semántica del estado actual.
- Suprimir estados para representar el objeto en forma compacta.
- Expresar estados suprimidos para volver a mostrarlos.
- Representar estados suprimidos como elipsis con conteo.
- Mostrar al pasar el cursor los nombres de los estados suprimidos.
- Reabrir estados suprimidos desde la elipsis.
- Modelar objetos que solo pueden estar en un estado a la vez.
- Modelar transición entre estados mediante pares input-output.
- Modelar efecto implícito como cambio de estado no detallado.
- Expandir un efecto implícito a enlaces in-out explícitos.
- Colapsar enlaces in-out nuevamente a efecto cuando se quiere simplificar.
- Usar estados como fuente de consumo.
- Usar estados como destino de resultado.
- Usar estados como entrada y salida de efecto.
- Usar estados como condición de ejecución.
- Usar estados como evento disparador.
- Usar estados como resultado fijo de simulación.
- Usar estados como conjunto de resultados alternativos en simulación.
- Permitir selección aleatoria entre estados cuando el resultado apunta al objeto y no a un estado específico.
- Forzar resultado determinista al conectar el resultado directamente a un estado.
- Asignar valores o rangos como especialización funcional de estados computacionales.
- Definir duración asociada a estado cuando el modelo requiere tiempo mínimo, nominal y máximo.
- Mostrar duración y unidades de duración en OPL cuando está configurado.

### Relaciones estructurales

- Modelar agregación-participación entre un todo y sus partes.
- Modelar composición de objetos, procesos o estructuras internas como jerarquías de partes.
- Modelar exhibición-caracterización para atributos y operaciones.
- Modelar generalización-especialización entre clases de objetos o procesos.
- Modelar clasificación-instanciación para distinguir clase e instancia.
- Crear relaciones estructurales unidireccionales etiquetadas.
- Crear relaciones estructurales bidireccionales etiquetadas cuando la semántica lo requiere.
- Crear relaciones estructurales recíprocas cuando una etiqueta inversa expresa el sentido opuesto.
- Crear relaciones estructurales sin etiqueta cuando el vínculo fundamental lo permite.
- Editar etiquetas estructurales.
- Definir multiplicidad fuente y destino en relaciones estructurales.
- Definir orden explícito de tines/participantes cuando el orden forma parte del hecho.
- Reordenar participantes estructurales y actualizar la formulación textual.
- Heredar rasgos, estados, relaciones y restricciones desde generales hacia especializados.
- Restringir especializaciones por atributo discriminante cuando el modelo lo exige.
- Representar participación compartida y composición sin multiplicar enlaces innecesarios.
- Crear una vista estructural de un sistema mediante unfolding.

### Relaciones procedurales

- Modelar consumo de objetos o estados por procesos.
- Modelar resultado de procesos hacia objetos o estados.
- Modelar efecto de procesos sobre objetos o estados.
- Modelar agentes que habilitan procesos por responsabilidad o capacidad de acción.
- Modelar instrumentos que habilitan procesos sin agencia.
- Mostrar u ocultar opciones de agente según el tipo y esencia de la cosa seleccionada.
- Modelar enlaces de invocación entre procesos.
- Modelar self-invocation para ciclos o repetición de procesos.
- Definir espera o intervalo entre iteraciones de self-invocation.
- Transformar una self-invocation con espera en una representación explícita con proceso de espera.
- Aplicar self-invocation al último subproceso pertinente dentro de un in-zoom.
- Modelar condiciones sobre consumo, instrumento, agente y efecto.
- Modelar eventos sobre consumo, instrumento, agente y efecto.
- Modelar eventos de entrada a estado.
- Modelar condiciones de existencia o de estado.
- Modelar skipping de procesos cuando una condición no se cumple.
- Modelar inicio de procesos cuando un evento ocurre.
- Modelar links state-specified para consumo, resultado, efecto, agente e instrumento.
- Modelar pares input-output completos, input-specified y output-specified.
- Modelar links `not` para expresar ejecución salvo un estado o condición excluida.
- Reemplazar enlaces existentes redibujando un nuevo enlace legal.
- Mostrar una tabla de enlaces permitidos según los tipos de origen/destino seleccionados.
- Bloquear, ocultar o advertir enlaces que no son metodológicamente válidos.
- Advertir consumos repetidos potencialmente inválidos dentro de una descomposición.

### Propiedades de enlaces

- Editar propiedades desde el enlace visual.
- Editar propiedades desde la oración OPL asociada.
- Elegir qué enlace editar cuando una oración corresponde a varios enlaces posibles.
- Definir multiplicidad fuente.
- Definir multiplicidad destino.
- Usar números enteros como multiplicidad.
- Usar rangos de multiplicidad.
- Usar `?` para opcionalidad.
- Usar `*` o rangos abiertos para cero o muchos.
- Usar `+` para uno o más.
- Usar símbolos o parámetros como multiplicidad.
- Agregar restricciones sobre parámetros de multiplicidad.
- Reflejar pluralización y restricciones en OPL.
- Definir tags o nombres de relación.
- Definir paths para distinguir variantes de ejecución o rutas alternativas.
- Mostrar paths en OPL y en el enlace.
- Usar probabilidades en fans XOR.
- Validar probabilidades como valores entre 0 y 1.
- Representar probabilidades por alternativa.
- Definir rates de consumo o producción.
- Asociar unidades a rates.
- Expresar rates en OPL.
- Modelar AND implícito mediante enlaces separados.
- Modelar XOR para selección de exactamente una alternativa.
- Modelar OR para selección de al menos una alternativa.
- Alternar visualmente entre OR y XOR en un fan.
- Separar o unir enlaces de un fan mediante manipulación visual.
- Crear OR/XOR sobre objetos, procesos, estados y links state-specified.
- Usar XOR/OR combinatorial cuando se requiere seleccionar exactamente o al menos `m` de `n`.
- Aplicar negación lógica mediante estados complementarios o links `not`.
- Definir puertos automáticos o puertos específicos.
- Mover puertos de enlace para mejorar legibilidad.
- Crear, mover y borrar vértices de enlace.
- Mantener routing visual con ports y vértices.
- Remover relación sin borrar las cosas conectadas.
- Copiar estilo entre enlaces.

## 2. Refinamiento y Jerarquía OPM

### In-zooming

- Refinar procesos en OPDs hijos.
- Crear subprocesos dentro del contorno del proceso refinado.
- Mantener visible el proceso padre como contexto del OPD hijo.
- Distribuir entradas, salidas, agentes e instrumentos del proceso padre hacia subprocesos.
- Alternar entre enlace conectado al proceso padre completo y enlace conectado a subprocesos específicos.
- Detectar cuándo un enlace ya no aplica a todos los subprocesos por eliminación de una conexión interna.
- Crear objetos internos dentro del in-zoom.
- Distinguir visual y semánticamente objetos internos del in-zoom frente a objetos externos.
- Impedir que una cosa externa quede accidentalmente pareciendo interna por arrastre o envolvimiento visual.
- Reubicar automáticamente fuera del contorno una cosa externa que fue soltada dentro sin intención semántica válida.
- Advertir cuando el scope visual no coincide con el scope metodológico.
- Representar secuencia por posición vertical de subprocesos.
- Usar grid y alineación para controlar orden temporal por altura.
- Reordenar subprocesos y actualizar el OPD tree cuando la configuración está en modo automático.
- Desactivar el reordenamiento automático globalmente, por usuario o por modelo.
- Modelar refinamiento síncrono y asincrónico de procesos cuando el comportamiento lo requiere.
- Ejecutar simulaciones conceptuales para verificar que el orden de subprocesos produce el comportamiento esperado.

### Unfolding

- Refinar objetos en OPDs de estructura interna.
- Crear partes internas de un objeto.
- Mostrar la relación todo-parte mediante agregación.
- Navegar desde el objeto folded al OPD unfolded.
- Mostrar contorno reforzado en la aparición folded para indicar refinamiento existente.
- Crear unfolds en diagrama nuevo.
- Crear unfolds dentro del mismo diagrama cuando se requiere detalle local.
- Usar unfolding para exponer atributos, partes, operaciones o subsistemas.
- Retirar apariciones visuales que sobrecargan un OPD sin borrar la cosa lógica.
- Mantener consistencia entre el objeto refinado y sus partes en distintos OPDs.

### Semi-folding

- Mostrar partes internas dentro de un objeto sin abrir el OPD hijo completo.
- Usar vista intermedia entre folded y unfolded.
- Presentar nombres de partes en una vista compacta.
- Extraer una parte específica desde la vista semi-folded hacia el canvas.
- Reinsertar una parte extraída dentro de la vista compacta.
- Conservar enlaces hacia partes ocultas.
- Mostrar conteo de partes ocultas cuando un enlace involucra partes no visibles.
- Permitir conectar una parte semi-folded directamente a procesos u otras cosas.
- Redirigir enlaces hacia la vista compacta cuando una parte vuelve a ocultarse.
- Reducir clutter sin perder trazabilidad de composición.

### Control interno/externo

- Mantener separación entre cosas internas y externas a un refinamiento.
- Crear cosas internas solo al soltarlas directamente en el contorno refinado o desde una lista de cosas existentes.
- Evitar que una cosa externa sea absorbida por redimensionamiento del contorno.
- Advertir si una misma cosa intenta aparecer simultáneamente como interna y externa de manera inconsistente.
- Apoyar la limpieza de scope mediante eliminación de la aparición visual incorrecta.
- Mantener enlaces válidos hacia cosas internas y externas según el contexto.

## 3. Bimodalidad OPD/OPL

### Sincronía diagrama-texto

- Generar OPL para cada hecho del OPD.
- Mantener equivalencia semántica entre diagrama y texto.
- Actualizar OPL cuando cambian nombres, enlaces, estados, multiplicidades, paths, probabilidades o rates.
- Resaltar OPL al pasar el cursor sobre una cosa o enlace del OPD.
- Resaltar OPD al pasar el cursor sobre una oración OPL.
- Configurar si el hover OPD→OPL está activo.
- Configurar si el hover OPL→OPD está activo.
- Sincronizar colores de OPD y OPL para presentaciones integradas.
- Desacoplar colores de OPD y OPL cuando se requiere exportación o énfasis independiente.
- Mostrar OPL por OPD y OPL consolidado del modelo.
- Producir texto legible para humanos y consistente para procesamiento automático.
- Reflejar esencia, afiliación, unidades y alias en OPL según preferencias.

### Edición desde OPL

- Editar nombres de objetos desde el texto OPL.
- Editar nombres de procesos desde el texto OPL.
- Abrir diálogo de propiedades de enlaces desde la oración OPL.
- Editar multiplicidad, tag, path, probabilidad, rate y estilo asociado a enlace desde el OPL cuando corresponde.
- Desambiguar enlaces cuando una oración textual corresponde a múltiples vínculos.
- Mostrar candidatos de enlace antes de abrir el editor correcto.
- Usar hover sobre candidatos para identificar el enlace visual.
- Actualizar el diagrama a partir de cambios iniciados desde el texto.

### Panel OPL

- Mostrar u ocultar numeración de oraciones.
- Mover el panel OPL al panel izquierdo.
- Minimizar el panel OPL para dejar de renderizarlo temporalmente y mejorar fluidez en diagramas grandes.
- Expandir el OPL completo como script.
- Copiar o reutilizar el script OPL completo en documentos externos.
- Configurar visibilidad de oraciones de esencia.
- Mostrar esencia solo cuando difiere del default.
- Mostrar u ocultar unidades de objetos computacionales.
- Mostrar u ocultar alias.
- Activar o desactivar autoformato por defecto.

## 4. Canvas, Navegación y Organización Visual

### Canvas

- Hacer pan sobre el OPD.
- Hacer zoom in y zoom out.
- Abrir, cerrar, redimensionar o desacoplar paneles laterales.
- Quitar y restaurar el navegador.
- Desacoplar el navegador y moverlo libremente.
- Ajustar tamaño del navegador.
- Mostrar una grilla configurable.
- Activar o desactivar grilla desde toolbar.
- Configurar tamaño de grilla en píxeles.
- Configurar color, grosor y escala visual de la grilla.
- Mover cosas con incrementos de grilla.
- Alinear objetos, procesos, estados y enlaces.
- Usar la alineación como ayuda para orden temporal en in-zoom.
- Agregar vértices a enlaces con clic.
- Eliminar vértices con doble clic.
- Deshacer y rehacer operaciones de modelado.
- Marcar cosas del modelo con colores para revisión o comunicación.
- Alternar visibilidad de notas.
- Ajustar tamaño de cosas manualmente.
- Mantener tamaño automático cuando se desea que la cosa se adapte al texto.
- Ajustar cosa a texto.
- Desactivar autosizing para permitir formas manuales.
- Respetar tamaño mínimo salvo modo manual.
- Evitar que texto largo rompa el layout mediante auto-resize.

### OPD Tree / OPD3

- Navegar por jerarquía de OPDs.
- Expandir todo el árbol.
- Colapsar todo el árbol.
- Ocultar nombres completos y mostrar solo numeración.
- Mostrar nuevamente nombres completos.
- Ajustar ancho del árbol.
- Colapsar y reabrir el panel del árbol.
- Navegar con mouse.
- Navegar con teclado.
- Entrar a OPDs hijos desde halos o toolbar.
- Eliminar OPDs hoja.
- Bloquear eliminación de OPDs internos.
- Deshacer eliminación de OPDs.
- Reordenar OPDs automáticamente según orden de procesos en el in-zoom.
- Reordenar OPDs manualmente cuando se desactiva el modo automático.
- Configurar reordenamiento automático a nivel de usuario.
- Configurar reordenamiento automático a nivel de modelo.
- Mostrar OPDs de submodelos cargados.
- Refrescar OPDs de submodelos cuando se requiere sincronización.

### OPD Manager

- Abrir una vista de gestión completa del árbol OPD.
- Buscar OPDs por nombre.
- Buscar OPDs por número.
- Abrir un OPD desde el gestor.
- Cortar OPDs.
- Pegar OPDs en otra ubicación jerárquica.
- Mover OPDs mediante arrastre.
- Reordenar la jerarquía de OPDs.
- Renombrar o reorganizar nodos cuando la operación está permitida.
- Abrir el gestor mediante atajo.
- Ver OPDs de modelos incluidos o submodelos.
- Navegar rápidamente en modelos con decenas o cientos de OPDs.

### System Map

- Generar un mapa completo del árbol OPD.
- Representar cada OPD como nodo/miniatura dentro de un OPD especial de mapa.
- Mostrar relaciones jerárquicas de in-zooming y unfolding.
- Ver el modelo completo como estructura navegable.
- Navegar al OPD original desde el mapa.
- Cerrar el mapa al saltar al OPD seleccionado.
- Usar el mapa para inspeccionar profundidad y ramificación del modelo.

### Draggable OPM Things

- Listar cosas existentes del modelo.
- Buscar cosas por nombre.
- Filtrar por objetos.
- Filtrar por procesos.
- Mostrar esencia física/informática.
- Mostrar afiliación sistémica/ambiental.
- Indicar atributos con su cosa propietaria.
- Mostrar advertencias cuando una cosa no puede reutilizarse en un contexto.
- Arrastrar una cosa existente a un OPD para crear una aparición visual.
- Usar la lista como vía preferente para reutilizar cosas y evitar duplicados.
- Abrir búsqueda de ubicaciones desde la lista de cosas.
- Soportar listas grandes mediante búsqueda, scroll y paginación conceptual.

## 5. Recuperación de Contexto y Conectividad

### Bring connected things

- Traer cosas conectadas que existen en otros OPDs.
- Traer conectividad directa de una cosa seleccionada.
- Configurar si se traen enlaces procedurales.
- Configurar si se traen enlaces estructurales/fundamentales.
- Usar defaults para filtros de conexión.
- Traer solo vecinos directos, evitando expansión metodológica excesiva por relaciones heredadas o de refinamiento.
- Reconstruir contexto local de un proceso in-zoomed.
- Traer objetos externos necesarios para entender un OPD hijo.
- Evitar redibujar manualmente conectividad ya existente en el modelo.

### Bring links between selected entities

- Seleccionar dos o más cosas ya visibles.
- Traer solo relaciones existentes entre esas cosas seleccionadas.
- Reconstruir conectividad parcial sin traer todo el vecindario.
- Traer enlaces estructurales entre seleccionados.
- Traer enlaces procedurales entre seleccionados.
- Mantener el OPD enfocado en un subconjunto controlado.
- Usar la función para reparar vistas incompletas después de arrastrar cosas existentes al canvas.

### Búsqueda de cosas

- Buscar objetos y procesos por nombre.
- Filtrar resultados por tipo.
- Ver todas las ubicaciones de una cosa.
- Saltar a una ubicación específica.
- Cambiar automáticamente al OPD donde vive la aparición elegida.
- Enfocar visualmente la cosa encontrada.
- Abrir búsqueda desde toolbar.
- Abrir búsqueda desde la lista de cosas arrastrables.
- Usar búsqueda para reutilizar cosas lógicas existentes.

## 6. Edición Visual, Estilo y Medios

### Estilo de cosas

- Cambiar fuente de objetos y procesos.
- Cambiar tamaño de fuente.
- Definir tamaño de fuente por defecto.
- Cambiar color de texto.
- Usar colores personalizados.
- Cambiar color de borde.
- Cambiar color de relleno.
- Alinear texto a izquierda, centro u otras posiciones.
- Posicionar texto manualmente en eje X/Y.
- Usar controles rápidos para ubicar texto arriba, abajo, izquierda, derecha o centro.
- Resetear posición manual de texto.
- Resetear estilo completo.
- Configurar estilos por defecto para nuevas cosas.
- Aplicar estilo sin alterar la semántica OPM.

### Estilo de enlaces

- Cambiar color de enlace.
- Cambiar grosor de enlace.
- Copiar estilo de un enlace.
- Aplicar estilo copiado a otro enlace.
- Mantener propiedades semánticas separadas de estilo visual.
- Editar estilo desde propiedades del enlace.

### Notas

- Crear notas libres en el canvas.
- Editar título de nota.
- Editar contenido de nota.
- Mover notas.
- Eliminar notas.
- Ocultar todas las notas sin borrarlas.
- Mostrar notas ocultas.
- Conectar nota a objeto o proceso mediante línea punteada.
- Usar notas como anotación no nuclear del modelo.
- Mantener notas fuera de la gramática OPM nuclear.

### Imágenes en cosas

- Asociar imágenes por URL.
- Validar URLs de imagen por extensión cuando corresponde.
- Previsualizar imagen antes de asociarla.
- Asociar varias imágenes a una misma cosa.
- Alternar/ciclar entre imágenes asociadas.
- Mostrar indicador visual de imagen embebida.
- Mostrar texto, imagen o ambos.
- Usar pool privado de imágenes.
- Usar pool organizacional de imágenes.
- Usar pool global de imágenes.
- Buscar imágenes por tags.
- Aplicar modo visual de imágenes a un OPD completo.
- Usar imágenes en templates.
- Usar imágenes en stereotypes.
- Exportar diagramas considerando imágenes embebidas por URL.

## 7. Gestión de Modelos

### Ciclo de vida

- Crear modelo nuevo.
- Abrir varios modelos en tabs.
- Indicar en tab si un modelo aún no está guardado.
- Guardar modelo actual.
- Guardar como nuevo modelo o nueva ubicación.
- Renombrar modelo.
- Cargar modelos desde navegador de modelos.
- Abrir modelo con doble clic.
- Cerrar modelo abierto.
- Autosalvar modelos según intervalo configurable.
- Configurar intervalo de autosave.
- Crear versiones por guardado manual.
- Crear versiones por autosave.

### Organización

- Crear carpetas.
- Crear subcarpetas.
- Renombrar carpetas.
- Eliminar carpetas vacías.
- Detectar carpetas aparentemente vacías que contienen versiones o archivados ocultos.
- Navegar por ruta de carpeta.
- Buscar modelos por nombre.
- Buscar modelos en subcarpetas tras umbral mínimo de caracteres.
- Ver modelos recientes.
- Ver detalles al pasar el cursor sobre modelos recientes.
- Cambiar entre vista de iconos y vista de lista.
- Ordenar vista de lista por nombre, descripción, fecha o autor.
- Mostrar autor y fecha de creación/modificación.
- Mover modelos entre carpetas.
- Mover modelos junto con autosaves y versiones.
- Cortar y pegar modelos.
- Mover carpetas completas cuando está permitido.

### Versionado

- Mostrar u ocultar versiones.
- Ver carpeta de versiones por modelo.
- Ver autosave versions.
- Recuperar versiones anteriores.
- Abrir versiones guardadas.
- Mantener hasta varias versiones recientes del mismo día.
- Mantener versiones representativas por semana y por mes.
- Aplicar política de retención resumida por día/semana/mes.
- Distinguir visualmente modelo editable, modelo read-only y autosave.
- Comparar versiones del mismo modelo.
- Usar comparación para auditar cambios entre versiones.

### Archivado

- Archivar automáticamente modelos tras inactividad prolongada.
- Archivar modelos manualmente.
- Ocultar modelos archivados de la vista normal.
- Mostrar archivados mediante toggle.
- Restaurar modelos archivados.
- Identificar en lista si un modelo está archivado.

## 9. Reutilización y Gobierno Semántico

### Templates

- Crear templates a partir de modelos o partes de modelo.
- Guardar templates.
- Insertar templates en el modelo actual.
- Insertar templates mediante selección y carga.
- Insertar templates con doble clic.
- Previsualizar el SD del template al pasar el cursor.
- Organizar templates en carpetas.
- Insertar templates de múltiples OPDs bajo el OPD actual.
- Crear OPDs hijos al insertar un template con jerarquía.
- Insertar varias copias de un mismo template con sufijos para evitar colisiones.
- Conservar nombres reutilizables en exhibición cuando la semántica permite compartirlos.
- Editar una copia insertada como parte normal del modelo.
- Desacoplar instancia insertada del template fuente.
- Editar templates desde el gestor de templates.
- Actualizar templates guardados sin actualizar automáticamente copias ya insertadas.

### Stereotypes

- Usar stereotypes.
- Anclar objetos o procesos a stereotypes.
- Traer componentes internos de un stereotype al OPD.
- Usar stereotypes para conjuntos de parámetros.
- Usar stereotypes para requisitos.
- Usar stereotypes para dispositivos o componentes recurrentes.
- Heredar componentes, atributos, rangos y propiedades desde el stereotype.
- Restringir subrangos dentro del rango definido por el stereotype.
- Bloquear rangos fuera del rango heredado.
- Usar stereotypes anidados cuando un componente reusable contiene otros componentes.
- Desvincular un stereotype conservando componentes cuando se requiere independencia.
- Remover stereotype y sus componentes cuando se decide eliminar la estructura heredada.
- Usar stereotypes dentro de templates.
- Usar stereotypes para acelerar modelado de estructuras repetibles y gobernadas.

### Ontología organizacional

- Definir términos preferidos para una organización.
- Definir múltiples formas aceptadas de un término preferido.
- Definir sinónimos no preferidos.
- Detectar uso de sinónimos al nombrar cosas.
- Sugerir reemplazo por término preferido.
- Reemplazar nombre por término preferido con un clic.
- Permitir cerrar sin cambiar cuando el modo es sugerido.
- Forzar selección de término preferido cuando el modo es obligatorio.
- Configurar nivel de enforcement: ninguno, sugerir o forzar.
- Administrar entradas de ontología.
- Agregar entradas nuevas.
- Editar términos preferidos y sinónimos.
- Filtrar entradas de ontología.
- Preservar consistencia terminológica entre modeladores de la organización.
- Integrar autoformato con reglas de ontología.

### Coherencia nominal

- Detectar nombres duplicados al crear o renombrar cosas.
- Mostrar ubicación de la cosa existente con el mismo nombre.
- Ofrecer reutilizar la cosa existente como instancia visual.
- Ofrecer renombrar la cosa nueva.
- Mantener nombre automático si el usuario cancela.
- Impedir fusionar cosas de tipos incompatibles.
- Advertir cuando un nombre existente corresponde a cosa refinada de manera incompatible.
- Recomendar traer la cosa desde Draggable OPM Things para reutilización explícita.
- Evitar divergencia semántica por homónimos accidentales.

## 10. Requisitos y Trazabilidad

### Modelado de requisitos

- Asociar requisitos a objetos.
- Asociar requisitos a procesos.
- Asociar requisitos a enlaces.
- Asociar requisitos a atributos, estados o partes cuando se requiere granularidad.
- Crear conjuntos de requisitos satisfechos por un elemento.
- Agregar múltiples requisitos separados por delimitador.
- Mostrar requisito asociado sobre un elemento.
- Ocultar requisito asociado sin eliminarlo.
- Mostrar u ocultar todos los requisitos de un OPD.
- Eliminar un requisito de su conjunto.
- Renumerar o mantener conjuntos de requisitos al remover entradas.
- Asociar un mismo requisito a varios elementos que lo satisfacen.
- Representar satisfacción parcial o total según convención del modelo.
- Conectar requisitos a sistemas externos mediante URL.
- Guardar hyperlink del requisito externo en cosa o enlace.
- Previsualizar URL de requisito externo.

### Vistas de requisitos

- Crear vista read-only por requisito.
- Listar requisitos existentes detectados en el modelo.
- Crear OPD de vista bajo una agrupación de requirement views.
- Incluir elementos que satisfacen el requisito.
- Incluir enlace cuando el requisito está asociado al enlace.
- Incluir source y target mínimos necesarios cuando el requisito vive en un enlace.
- Mantener la vista como derivada, no editable.
- Ajustar layout visual de una vista sin cambiar el modelo fuente.
- Actualizar vista cuando cambia el modelo.
- Actualizar vista desde menú contextual del OPD de requisito.
- Eliminar vista de requisito.
- Detectar posibles typos cuando dos requisitos parecen similares pero crean vistas distintas.

### Enriquecimiento

- Conectar stereotype de requisito a un requirement set.
- Modelar campos estructurados de requisito.
- Modelar id de requisito.
- Modelar nombre de requisito.
- Modelar descripción.
- Modelar actor o actor set.
- Modelar tipo de validación hard/soft.
- Modelar atributos adicionales del requisito.
- Desplegar requirement stereotype en OPD propio.
- Remover stereotype de requisito cuando ya no se requiere enriquecimiento.
- Usar requisitos enriquecidos dentro de stereotypes y templates.
- Vincular requisitos a herramientas externas mediante URL.

## 11. Análisis del Modelo

### Métricas

- Calcular métricas generales del modelo.
- Analizar composición del modelo.
- Contar tipos de elementos.
- Evaluar distribución de objetos, procesos, estados, enlaces y OPDs.
- Acceder al análisis desde configuración o menú de análisis.
- Usar métricas para revisar complejidad y completitud.

### Model validation

- Validar valores computacionales en tiempo de diseño.
- Validar valores durante ejecución.
- Validar valores durante simulación.
- Configurar validación por fase: diseño, ejecución, simulación o ambas.
- Definir validación soft que permite valor inválido pero lo marca visualmente.
- Definir validación hard que impide ingresar valor fuera de rango.
- Marcar valores dentro de rango.
- Marcar valores fuera de rango.
- Validar tipo de dato: integer, float, string, char, boolean y otros tipos soportados.
- Validar rangos cerrados, abiertos o compuestos.
- Validar default values.
- Resetear valor a default cuando existe.
- Mostrar u ocultar tipo/rango como atributo.
- Validar subrangos heredados desde stereotype.
- Bloquear subrangos incompatibles con el rango heredado.

### Informative grading

- Evaluar informatividad de oraciones OPL.
- Clasificar oraciones por categoría informativa.
- Medir score informativo por oración.
- Calcular score ponderado del modelo.
- Filtrar resultados por categoría.
- Filtrar por score mínimo.
- Revisar oraciones con baja informatividad.
- Descargar resultados a CSV.

### Missing knowledge identification

- Identificar conocimiento faltante en el modelo.
- Sugerir objetos faltantes.
- Sugerir enlaces faltantes.
- Sugerir relaciones faltantes.
- Evaluar sugerencias con razonamiento local PISTOL cuando aplica.
- Ajustar umbral de confianza.
- Exportar sugerencias.
- Usar las sugerencias como apoyo, no como verdad automática.

## 12. Importación y Exportación

### Exportación OPL

- Exportar OPL como HTML.
- Elegir nombre de archivo.
- Exportar con numeración.
- Exportar sin numeración.
- Obtener OPL por OPD.
- Obtener OPL consolidado del modelo sin repetición.
- Copiar OPL exportado a documentos externos.

### Exportación visual

- Exportar OPD actual como imagen.
- Exportar todo el OPD tree.
- Exportar solo System Diagram.
- Configurar resolución/DPI.
- Exportar a mayor calidad para documentación.
- Incluir o excluir tooltips de procesos computacionales.
- Exportar visualmente diagramas con imágenes asociadas.
- Generar imagen navegable o inspeccionable después de exportar.

### Exportación PDF

- Exportar modelo completo a PDF.
- Incluir URL del modelo.
- Incluir diagramas y OPL.
- Incluir tabla de contenidos.
- Incluir OPD tree.
- Incluir diccionario de elementos.
- Incluir objetos, procesos y estados.
- Incluir relaciones.
- Incluir descripciones.
- Incluir URLs asociadas.
- Incluir o excluir numeración OPL.
- Incluir o excluir tooltips computacionales.
- Mostrar progreso o tiempo estimado de generación.

### Exportación de submodelos

- Incluir submodelos cargados en vistas o exportaciones cuando se requiere contexto completo.
- Cargar submodelos antes de exportar para asegurar disponibilidad.
- Omitir submodelos no cargados cuando se desea exportación liviana.
- Navegar OPDs de submodelos desde gestores antes de exportar.

## 13. Simulación y Ejecución

### Simulación conceptual

- Entrar a modo simulación/ejecución desde toolbar principal.
- Ejecutar simulación conceptual visual.
- Animar tokens por enlaces del modelo.
- Ver procesos activarse según orden de ejecución.
- Ajustar velocidad de animación.
- Ejecutar simulación paso a paso o sincronizada.
- Detener simulación.
- Usar simulación para detectar secuencias incorrectas.
- Ver que el orden vertical de subprocesos afecta la ejecución.
- Corregir orden de subprocesos y observar actualización OPL.
- Reejecutar simulación para validar la corrección.
- Distinguir simulación conceptual de ejecución con cálculo o sistemas externos.

### Objetos computacionales

- Convertir objetos en computacionales.
- Definir valores concretos.
- Definir unidades.
- Definir alias.
- Definir tipo de valor.
- Definir rango permitido.
- Definir default value.
- Resetear valor al default.
- Simular valores de objetos según parámetros.
- Generar valores aleatorios desde distribuciones.
- Usar valores de objetos como instrumentos o entradas de cálculo.
- Usar partes refinadas de objetos computacionales mediante alias.

### Procesos computacionales

- Convertir procesos en computacionales.
- Usar funciones predefinidas como suma u operaciones básicas.
- Usar funciones TypeScript definidas por usuario.
- Abrir IDE integrado para editar función.
- Ver tooltip de proceso computacional.
- Acceder a objetos conectados mediante alias.
- Acceder a partes de objetos refinados mediante alias del todo y de la parte.
- Usar valores de instrumentos, consumos, efectos y resultados elegibles.
- Actualizar un objeto resultado con el valor calculado.
- Simular un proceso computacional ignorando valores fijos y usando parámetros.
- Combinar cálculo con condiciones, loops y estados.

### Simulación numérica

- Seleccionar objetos o procesos para simulación de valores.
- Definir tipo de distribución.
- Definir rango de muestreo.
- Ejecutar una corrida.
- Ejecutar múltiples corridas.
- Ejecutar corridas asíncronas.
- Descargar resultados a CSV.
- Elegir orden de columnas en CSV.
- Descargar todos los objetos computacionales o un subconjunto ordenado.
- Controlar frecuencia de descarga durante simulaciones largas.
- Evitar perder resultados en corridas extensas mediante descargas parciales.
- Comparar resultados simulados con valores calculados.

### Condiciones y loops

- Modelar decisiones por estados.
- Usar condiciones para elegir si un proceso ocurre o se salta.
- Usar invocation para continuar flujo entre procesos.
- Usar self-invocation para loops.
- Usar contador como objeto computacional de loop.
- Usar condición de completitud para terminar loop.
- Seleccionar estados aleatoriamente cuando un resultado apunta al objeto.
- Seleccionar estados con probabilidad igual por defecto.
- Seleccionar estados con probabilidad ponderada desde proceso computacional.
- Forzar resultado a un estado específico.
- Crear loops deterministas o probabilísticos.
- Detener simulación cuando un loop infinito se produce por condición de salida ausente.

## 14. Entrada de Usuario

### Input modelado formalmente

- Representar usuario como agente físico o grupo humano.
- Representar proceso de obtención de input como proceso explícito.
- Conectar usuario al proceso mediante enlace de agente.
- Habilitar opción de solicitar input solo cuando el usuario está modelado como agente.
- Representar input como objeto computacional.
- Conectar proceso de input con el objeto que recibirá el valor.
- Usar el input como dato formal del modelo, no como entrada ad hoc.

### Durante simulación

- Solicitar valor al usuario durante simulación.
- Mostrar pop-up de entrada cuando el proceso marcado se alcanza.
- Pasar valor ingresado a función definida por usuario.
- Exponer variable de input en el IDE/API de funciones.
- Usar input para actualizar objetos computacionales.
- Usar input para controlar cálculos.
- Usar input para controlar condiciones.
- Usar input para controlar loops.
- Usar input para controlar profundidad, número de iteraciones u otros parámetros de ejecución.
- Validar input dentro de la función o mediante rangos del objeto computacional.
- Combinar input humano con simulación conceptual, ejecución computacional
