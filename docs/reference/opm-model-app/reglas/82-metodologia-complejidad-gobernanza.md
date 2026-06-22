# 82 — Metodología: gestión de complejidad y gobernanza

**Alcance**: niveles 2+, mecanismos canónicos, organización del árbol OPD y modelo compuesto, vistas, precedencia en recomposición, práctica desde nivel medio, emergencia, gobernanza del modelo, operaciones de gestión.
**Capa SSOT propietaria**: `metodologia-opm-es.md` §8, §8b
**Aplicación en la app**: organización de árbol, vistas ancladas, sub-modelos, gobernanza.

## Reglas

### R-4200: Cuatro mecanismos canónicos de refinamiento-abstracción

- Enunciado:

| Mecanismo | Refinamiento | Abstracción | Uso |
|---|---|---|---|
| Descomposición / Recomposición | Expone contenido interno | Oculta contenido interno | Procesos síncronos; objetos con partes espaciales |
| Despliegue / Plegado | Expone refinadores vía relación estructural | Oculta refinadores | Procesos asíncronos; taxonomías; rasgos |
| Expresión / Supresión de estados | Muestra estados | Oculta estados irrelevantes | Simplificación contextual |
| Composición inter-modelo por sub-modelo | Referencia a sub-modelo | Retiro o desconexión | Trabajo concurrente; encapsulación |

Las vistas NO son mecanismo ontológico del mismo rango. Operaciones Bring son operadores derivados, no mecanismos de refinamiento.

- Referencia SSOT: `metodologia-opm-es.md` §8.1
- Aplicación en código: UI distingue los cuatro mecanismos.

### R-4201: Decisión descomposición vs despliegue para procesos síncronos

- Enunciado: **descomposición DEBERÍA preferirse** porque:
  - requiere menos símbolos
  - genera OPL más corto
  - reemplaza eventos/enlaces de invocación explícitos con invocación implícita de la línea de tiempo

El despliegue de procesos síncronos es semánticamente equivalente pero más verboso.

- Referencia SSOT: `metodologia-opm-es.md` §8.1

### R-4202: Plegado en puertos

- Enunciado: variante de plegado donde la operación (proceso rasgo) se desplaza al contorno del exhibidor (objeto). Útil cuando el modelador quiere que los rectángulos de objetos representen disposición física y tamaños relativos. El plegado en puertos también aplica a atributos de procesos.
- Referencia SSOT: `metodologia-opm-es.md` §8.1
- Aplicación en código: operación opcional.

### R-4203: Uso metodológico del semi-plegado

- Enunciado: el modelador DEBERÍA usar semi-plegado para **inspección rápida** de estructura sin proliferación de OPDs y DEBERÍA evitarlo cuando oculte relaciones necesarias para el propósito del modelo.
- Referencia SSOT: `metodologia-opm-es.md` §8.1
- Ver: `34-semi-plegado.md`.

### R-4204: Refinamiento dual — ramas hermanas

- Enunciado: un SD PUEDE tener ramas hermanas de **distinto tipo** de refinamiento. Ejemplo: SD1 como descomposición del proceso principal y SD2 como despliegue del objeto sistema.
- Referencia SSOT: `metodologia-opm-es.md` §8.1

### R-4205: Heurística de profundidad

- Enunciado: si un OPD de nivel N NO agrega transformados, estados ni enlaces nuevos respecto de su padre, la refinación es **probablemente innecesaria**.
- Referencia SSOT: `metodologia-opm-es.md` §8.1
- Aplicación en código: warning al detectar OPD hijo sin contenido nuevo.

### R-4206: Etiquetas visibles NO son identidad persistente

- Enunciado: las etiquetas visibles `SDx.y` NO constituyen identidad persistente del OPD. Cada OPD DEBE tener además un identificador persistente recuperable en la serialización. Metodológicamente, quien modela NO DEBE usar `SDx.y` como identificador estable para trazabilidad externa, integración entre modelos o auditoría.
- Referencia SSOT: `metodologia-opm-es.md` §8.2, V-247..V-249

### R-4207: Modelo compuesto ≠ super-árbol ontológico

- Enunciado: cada modelo OPM individual tiene su propio árbol OPD. Cuando existen sub-modelos, el resultado NO es un único super-árbol ontológico, sino un **modelo compuesto por referencia**:
  - árbol OPD local para refinamiento dentro del modelo individual
  - referencias explícitas entre modelos para composición inter-modelo
- Referencia SSOT: `metodologia-opm-es.md` §8.2

### R-4208: Integridad del árbol local

- Enunciado: el modelador DEBE tratar los OPDs hoja como única clase eliminable y DEBERÍA usar OPDs de vista solo como artefactos de navegación, no como nodos de refinamiento.
- Referencia SSOT: `metodologia-opm-es.md` §8.2, V-113

### R-4209: Mapa del Sistema como vista anclada

- Enunciado: el **Mapa del Sistema** es una vista anclada al árbol que muestra el contenido de cada OPD como índice navegable mediante miniaturas. NO constituye refinamiento ni reabre el contrato OPD⇄OPL local. Esencial para navegación en modelos complejos. El modelador DEBERÍA generarlo para modelos con más de **10 OPDs**.
- Referencia SSOT: `metodologia-opm-es.md` §8.2, §16

### R-4210: OPD Último (flat-model)

- Enunciado: representación plana obtenida por aplanamiento recursivo del árbol OPD local. Útil para uso automatizado, pero NO sustituye la identidad persistente ni la estructura explícita de referencias entre modelos.
- Referencia SSOT: `metodologia-opm-es.md` §8.2

### R-4211: Especificación completa del sistema — tres constructos

- Enunciado: por modelo individual:

| Constructo | Contenido |
|---|---|
| Especificación de modelo OPD | Colección de OPDs sucesivos |
| Especificación de modelo OPL | Colección de párrafos OPL con duplicados eliminados |
| Especificación de modelo OPM | Presentación lado a lado: OPD + OPL |

En modelos compuestos, la especificación global DEBE preservar estas especificaciones locales y declarar explícitamente la composición entre modelos. NO DEBE inferirse un único texto global solamente desde la numeración visible del árbol.

- Referencia SSOT: `metodologia-opm-es.md` §8.2
- Aplicación en código: exportador genera los tres constructos.

### R-4212: Sub-modelos para trabajo concurrente

- Enunciado: cuando múltiples modeladores trabajan en subsistemas simultáneamente, el modelador DEBERÍA separar subsistemas en sub-modelos. Las conexiones entre modelo principal y sub-modelos DEBEN mantenerse **mínimas** para reducir acoplamiento.
- Referencia SSOT: `metodologia-opm-es.md` §8.2

### R-4213: Contrato de interfaz de sub-modelo

- Enunciado: la creación de un sub-modelo requiere un mínimo de:
  - un objeto + un proceso conectados por exhibición-caracterización y enlace de instrumento
  - un solo proceso por sub-modelo
  - las cosas compartidas DEBEN estar sin refinar

Una vez creado:
- Las cosas compartidas en el modelo principal NO PUEDEN recibir nuevos enlaces de refinamiento ni nuevas conexiones
- Las cosas compartidas en el sub-modelo NO PUEDEN renombrarse, recibir nuevos estados ni eliminarse
- NO PUEDEN agregarse nuevas cosas compartidas después de la creación; si la interfaz es incorrecta, DEBE destruirse y recrearse
- Los sub-modelos PUEDEN anidarse recursivamente
- La autoridad semántica pertenece al modelo propietario
- La referencia DEBE resolverse por identificador persistente

- Referencia SSOT: `metodologia-opm-es.md` §8.2
- Ver: `42-sub-modelos-inter-modelo.md`.

### R-4214: Tres categorías de vista

- Enunciado:

| Categoría | Función | Regla de uso |
|---|---|---|
| OPD jerárquico | Nodo del árbol local de refinamiento | Único que participa directamente en refinamiento |
| Vista anclada | Artefacto de navegación ligado al árbol o composición | Recorrer, resumir o inspeccionar sin crear hechos nuevos |
| Vista ad hoc | Artefacto explicativo transversal | Reúne hechos existentes |

- Referencia SSOT: `metodologia-opm-es.md` §8.3
- Aplicación en código: cada OPD tiene categoría declarada.

### R-4215: Reglas metodológicas para vistas

- Enunciado:
  - Solo el OPD jerárquico DEBE tratarse como nodo de refinamiento
  - Una vista anclada PUEDE facilitar navegación, pero NO sustituye identidad persistente
  - Una vista ad hoc NO DEBE usarse como ancla de identidad ni como fuente única de trazabilidad
  - Las vistas NO DEBEN editarse cuando eso altere hechos cuyo origen pertenece a OPDs jerárquicos o a modelos propietarios externos
- Referencia SSOT: `metodologia-opm-es.md` §8.3

### R-4216: Precedencia en recomposición — aplicación metodológica

- Enunciado:
  - Cuando dos enlaces compiten por el mismo par cosa-proceso durante abstracción, el modelador DEBE resolver usando la jerarquía formal de `opm-visual-es` §13
  - Si la recomposición produce una combinación inválida, el refinamiento DEBE corregirse en el nivel hijo antes de seguir abstrayendo
  - La fuerza semántica solo se usa para colisiones entre hechos candidatos al mismo enlace abstracto; NO autoriza a fusionar hechos distintos ni a borrar evidencia semántica legítima
- Referencia SSOT: `metodologia-opm-es.md` §8.4
- Ver: `32-precedencia-recomposicion.md`.

### R-4217: Desde el nivel medio

- Enunciado: el modelador comienza por el nivel que mejor entiende y refina/abstrae en ambas direcciones.
- Referencia SSOT: `metodologia-opm-es.md` §8.5

### R-4218: Procedimiento de simplificación de OPD sobrecargado

- Enunciado:
  1. Identificar conjunto TO de cosas a extraer
  2. Nombrar un nuevo proceso interino que los contenga
  3. Ejecutar in-diagram recomposición (abstracción de enlaces + ocultamiento de contenido)
  4. Crear nuevo OPD descendiente con los hechos extraídos
  5. Renumerar OPDs hijos afectados

Reducción neta: `procesos_removidos + objetos_removidos + enlaces_removidos - 1`.

- Referencia SSOT: `metodologia-opm-es.md` §8.5
- Aplicación en código: asistente de simplificación.

### R-4219: Recorrido en profundidad para documentos complejos

- Enunciado: al modelar estándares o documentos extensos, el modelador DEBERÍA seguir una estrategia en profundidad: profundizar completamente en una sección antes de avanzar. Esto permite descubrir inconsistencias locales más rápidamente.
- Referencia SSOT: `metodologia-opm-es.md` §8.5

### R-4220: Cierre de brecha objeto-proceso

- Enunciado: documentos y estándares frecuentemente separan descripción de objetos (estructura) de descripción de procesos (comportamiento). El modelador DEBE conectar ambas vistas, enlazando cada proceso con los objetos que transforma. Esta integración revela vacíos y objetos implícitos.
- Referencia SSOT: `metodologia-opm-es.md` §8.5

### R-4221: Emergencia como criterio de validación

- Enunciado: el modelador DEBE verificar que la arquitectura del sistema (estructura + comportamiento) produce **al menos una capacidad emergente**: una funcionalidad que el sistema completo exhibe pero ninguna parte individual posee. Si NO existe emergencia, la colección de partes NO constituye un sistema en el sentido MBSE.
- Referencia SSOT: `metodologia-opm-es.md` §8.6

### R-4222: Gobernanza — aplicación de ontología

- Enunciado: tres niveles:

| Nivel | Comportamiento |
|---|---|
| Ninguno | Sin restricción terminológica |
| Sugerir | Sugiere término estándar; el modelador puede ignorar |
| Forzar | Impide confirmar términos no estandarizados |

Toda sustitución motivada por ontología DEBE ser trazable como política de normalización o metadato reversible.

- Referencia SSOT: `metodologia-opm-es.md` §8.7

### R-4223: Clasificación de informatividad del modelo (OPPL)

- Enunciado: las sentencias OPPL se clasifican en: Definición, Estructural, Procedimental, Meta, Desconocida. Métricas:
  - nivel informativo
  - puntaje ponderado
  - promedio INF
  - total de sentencias OPPL

El modelador DEBERÍA ejecutar clasificación periódicamente para identificar enlaces de precedencia faltantes y procesos sin entradas/salidas.

- Referencia SSOT: `metodologia-opm-es.md` §8.7, `opm-iso-19450-es.md` glosario E1

### R-4224: Comparación de versiones

- Enunciado: el modelador DEBERÍA comparar versiones del modelo para seguimiento de mejoras y detección de regresiones.
- Referencia SSOT: `metodologia-opm-es.md` §8.7
- Aplicación en código: diff entre snapshots.

### R-4225: Instancias visuales — decisión

- Enunciado: ante nombres duplicados, el modelador DEBE decidir entre:
  - reutilizar la cosa existente como nueva apariencia visual
  - renombrar con nombre único
  - descartar la nueva cosa

La opción "cerrar" sin resolver NO DEBERÍA usarse.

- Referencia SSOT: `metodologia-opm-es.md` §8.7

### R-4226: Operaciones de gestión del modelo

- Enunciado: capacidades del ciclo de vida del modelo:
  - **Persistencia**: guardar/cargar como puntos de control regulares
  - **Permisos**: lectura precede a escritura; verificar antes de colaboración concurrente
  - **Exportación**: tratar como instantáneas publicables, NO fuente de verdad
  - **Plantillas**: copia local al insertar; actualizaciones de fuente NO se propagan
  - **Reubicación del modelo**: conserva autoguardado e historial; revisar antes y después
  - **Búsqueda y navegación asistida**: usar para inspección antes de editar en modelos densos

- Referencia SSOT: `metodologia-opm-es.md` §8.8

### R-4227: Sub-modelos para desacoplar edición

- Enunciado: cuando múltiples modeladores editan simultáneamente, separar en sub-modelos reduce conflictos. La interfaz congelada asegura estabilidad.
- Referencia SSOT: `metodologia-opm-es.md` §8.2

### R-4228: Dos procesos hermanos del mismo SD

- Enunciado: no es apropiado tener dos procesos sistémicos en SD. Si el sistema naturalmente se descompone en dos "procesos principales", considerar:
  - Crear un proceso paraguas que los agrupe
  - Separar en dos modelos distintos, cada uno con su propio SD
- Referencia SSOT: V-46
- Aplicación en código: el asistente fuerza uno.

### R-4229: Límite de profundidad recomendado

- Enunciado: los modelos detallados suelen abarcar entre **5 y 10 niveles** de detalle en el árbol de procesos OPD.
- Referencia SSOT: `opm-iso-19450-es.md` §OPM como plano común
- Aplicación en código: warning al exceder 10 niveles.

## Checklist

- [ ] Cuatro mecanismos canónicos distinguibles
- [ ] Descomposición preferida sobre despliegue para síncronos
- [ ] Plegado en puertos disponible
- [ ] Semi-plegado usado para inspección, no para ocultar relaciones críticas
- [ ] `SDx.y` no usado como identidad externa
- [ ] Sub-modelos como mecanismo, no super-árbol
- [ ] Integridad del árbol preservada
- [ ] Mapa del Sistema generado para modelos > 10 OPDs
- [ ] Tres constructos de especificación generables
- [ ] Contrato de interfaz de sub-modelo enforzado
- [ ] Tres categorías de OPD distinguidas (jerárquico, anclada, ad hoc)
- [ ] Precedencia en recomposición aplicada
- [ ] Procedimiento de simplificación disponible
- [ ] Recorrido en profundidad documentado
- [ ] Verificación de emergencia
- [ ] Aplicación de ontología configurable
- [ ] Clasificación OPPL ejecutable
- [ ] Comparación de versiones disponible
- [ ] Profundidad máxima vigilada (warning > 10 niveles)

## Antipatrones

- OPD hijo sin contenido nuevo
- Interfaz de sub-modelo mutable tras creación
- Vista ad hoc usada como identidad persistente
- Fusionar enlaces hacia objetos distintos en recomposición
- Modelo compuesto con super-árbol ontológico implícito
- SD con dos procesos sistémicos
- Sistema sin emergencia verificada
- Recorrido en anchura que dispersa la atención sin cerrar secciones

## Referencias cruzadas

- Refinamiento: `30-refinamiento-entre-opds.md`
- Precedencia: `32-precedencia-recomposicion.md`
- Semi-plegado: `34-semi-plegado.md`
- Navegación y categorías: `40-navegacion-arbol-identidad.md`
- Sub-modelos: `42-sub-modelos-inter-modelo.md`
- Validación y ontología: `62-validacion-marcas-error.md`
- SD1: `81-metodologia-sd1-descomposicion.md`
- Heurísticas: `83-metodologia-heuristicas-avanzadas.md`
