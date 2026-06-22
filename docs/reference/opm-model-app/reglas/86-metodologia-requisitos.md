# 86 — Metodología: modelado de requisitos

**Alcance**: operaciones sobre requisitos, convención de trazabilidad `satisface`, análisis de vacíos, generación asistida, ejemplo canónico (mirilla de puerta).
**Capa SSOT propietaria**: `metodologia-opm-es.md` §13
**Aplicación en la app**: capacidad opcional de requisitos, vistas de Requirement.

## Reglas

### R-4600: Requisitos como capacidad metodológica del entorno

- Enunciado: el modelado de requisitos se trata como una **capacidad metodológica del entorno de modelado**. Las siguientes reglas aplican cuando el modelo incorpora requisitos como artefactos trazables.
- Referencia SSOT: `metodologia-opm-es.md` §13

### R-4601: Operaciones disponibles sobre requisitos

- Enunciado: una herramienta compatible puede:
  - agregar requisitos sobre elementos, enlaces o diagramas completos
  - remover requisitos
  - visualizar requisitos

Las relaciones mínimas recuperables son:
  - **Exhibición-caracterización**
  - **Agregación-participación**

- Referencia SSOT: `metodologia-opm-es.md` §13.1

### R-4602: Convención de trazabilidad `satisface`

- Enunciado: cuando se use trazabilidad de requisitos, el enlace estructural etiquetado con etiqueta **`satisface`** DEBERÍA usarse como convención entre artefacto y requisito cuando la capa textual activa sea OPL-ES. Si la capa activa es OPL-EN, la forma equivalente es **`satisfies`**.
- Referencia SSOT: `metodologia-opm-es.md` §13.2
- **Correcto (OPL-ES)**: `Asiento satisface Requisito RQ1 Asiento del Conductor.`
- **Incorrecto**: Conectar requisitos a artefactos vía enlaces procedimentales (los requisitos no transforman ni habilitan procesos).

### R-4603: Relación estructural, no procedimental

- Enunciado: los requisitos NO deben conectarse a artefactos vía enlaces procedimentales. La relación es **estructural**.
- Referencia SSOT: `metodologia-opm-es.md` §13.2
- Aplicación en código: validador rechaza procedimental hacia requisito.

### R-4604: Estereotipo canónico `<<Requirement>>`

- Enunciado: el estereotipo canónico para requisitos es `<<Requirement>>` (ver V-154). Un requisito sigue siendo, gráficamente, un objeto OPM estereotipado.
- Referencia SSOT: V-154
- Ver: `52-estereotipos-requirement.md`.

### R-4605: Atributos mínimos de un Requirement

- Enunciado: todo `<<Requirement>>` DEBE exponer o derivar, como mínimo:
  - `Name`
  - `ID`
  - `Requirement Essence`
  - `Satisfaction`
  - `Description`
- Referencia SSOT: V-155

### R-4606: `Requirement Essence` ≠ esencia de cosa

- Enunciado: el atributo `Requirement Essence` es distinto de la esencia de cosa definida en §1.3. Para evitar sobrecarga terminológica, la documentación canónica NO debe usar el nombre desnudo `Essence` para el atributo del requisito.
- Referencia SSOT: V-156

### R-4607: Ejemplo mínimo — mirilla de puerta

- Enunciado: ejemplo recuperable:
  - Mirilla de puerta: la mirilla es parte de la puerta
  - Restricciones dimensionales: 56-64 pulgadas
  - Componentes: lente y manguitos
  - Componente opcional: cubierta de mirilla
  - Función: vista unidireccional para ver visitantes
- Referencia SSOT: `metodologia-opm-es.md` §13.3
- Aplicación en código: fixture de prueba para requisitos.

### R-4608: Análisis de vacíos — heurística de detección

- Enunciado: la **identificación de conocimiento faltante** DEBERÍA usarse como heurística de detección de vacíos, NO como verdad del modelo. Herramientas disponibles:
  - `Pistol` (filtrado rápido)
  - `RGCN` (cuando esté disponible, mayor precisión)

El umbral de confianza DEBERÍA ajustarse explícitamente antes de aceptar sugerencias.

- Referencia SSOT: `metodologia-opm-es.md` §13.4

### R-4609: Generación asistida de requisitos

- Enunciado: la **generación asistida** toma OPPL como insumo y genera:
  - texto de requisito
  - tipo de verificación
  - criterios de aceptación
  - tripletas del modelo

La salida DEBE revisarse manualmente antes de integrarla al corpus o al modelo.

- Referencia SSOT: `metodologia-opm-es.md` §13.4
- Aplicación en código: propuesta, no integración automática.

### R-4610: Comparación de versiones para análisis

- Enunciado: el modelador DEBERÍA comparar resultados del análisis entre versiones sucesivas para distinguir mejoras reales de ruido introducido por cambios de disposición o renombrado.
- Referencia SSOT: `metodologia-opm-es.md` §13.4

### R-4611: Colección `Satisfied Requirement Set`

- Enunciado: el conjunto `Satisfied Requirement Set` se admite como colección especializada de requisitos. Si la implementación permite marcarla como ordenada, esa propiedad DEBE quedar serializada y ser recuperable en el canon-documento.
- Referencia SSOT: V-157

### R-4612: Vistas de Requisitos — OPD anclado

- Enunciado: las `Vistas de Requisitos` (`Requirement Views`) son OPDs derivados por **filtrado semántico** desde el modelo. Se clasifican como OPD de **vista anclada** según V-114.
- Referencia SSOT: V-254
- Aplicación en código: generar como vista anclada en árbol.

### R-4613: Vistas de Requisitos — solo lectura

- Enunciado: las Vistas de Requisitos son de **solo lectura** respecto al contenido OPM que proyectan. Editar sus elementos DEBE redirigirse a los OPDs jerárquicos fuente del modelo.
- Referencia SSOT: V-255

### R-4614: Trazabilidad con identificador persistente

- Enunciado: cuando se cita un requisito desde un artefacto externo (documento, test, trazabilidad), DEBE usarse el **identificador persistente** del requisito (URI, handle), no solo su nombre visible.
- Referencia SSOT: V-248, V-249 (extrapolación)
- Aplicación en código: cada requisito tiene ID serializado.

### R-4615: Criterios de aceptación serializables

- Enunciado: si el modelo admite criterios de aceptación por requisito, estos DEBERÍAN serializarse como atributos estructurados, no como prosa libre.
- Referencia SSOT: `metodologia-opm-es.md` §13.4 (generación asistida)
- Aplicación en código: `requisito.criteriosAceptacion: Criterio[]`.

### R-4616: Revisión manual obligatoria

- Enunciado: toda sugerencia generada por herramientas de análisis (ML, heurística) DEBE someterse a **revisión manual** antes de integrarse al modelo. La generación asistida es insumo, no decisión.
- Referencia SSOT: `metodologia-opm-es.md` §13.4

### R-4617: Requisito como objeto

- Enunciado: un requisito se modela como **objeto OPM estereotipado**, no como proceso. Tiene atributos (Name, ID, etc.) y participa en relaciones estructurales.
- Referencia SSOT: V-154, §13.2
- Aplicación en código: el tipo base de `<<Requirement>>` es objeto.

### R-4618: Relaciones fundamentales con requisitos

- Enunciado: las relaciones admisibles con requisitos son **estructurales**:
  - `satisface` / `satisfies` (trazabilidad)
  - agregación-participación (requisito tiene sub-requisitos)
  - exhibición-caracterización (requisito exhibe atributos)
  - generalización (jerarquía de requisitos)
- Referencia SSOT: `metodologia-opm-es.md` §13.1
- Aplicación en código: operaciones disponibles en UI de requisitos.

### R-4619: Colección `Satisfied Requirement Set` ordenada

- Enunciado: cuando la colección está marcada como ordenada, su orden DEBE preservarse en serialización y export. El orden indica prioridad o secuencia de verificación.
- Referencia SSOT: V-157

### R-4620: Requisitos opcionales con multiplicidad

- Enunciado: los requisitos opcionales se modelan con multiplicidad `?` (0..1) en agregación-participación hacia el requisito padre.
- Referencia SSOT: §7 multiplicidad
- Aplicación en código: el renderer marca la multiplicidad.

## Checklist

- [ ] Trazabilidad con `satisface` (OPL-ES) / `satisfies` (OPL-EN)
- [ ] Requisitos conectados por enlaces estructurales, no procedimentales
- [ ] Requisitos como objetos estereotipados `<<Requirement>>`
- [ ] Atributos mínimos: Name, ID, Requirement Essence, Satisfaction, Description
- [ ] `Requirement Essence` nombrado explícitamente
- [ ] Análisis de vacíos con umbral de confianza declarado
- [ ] Generación asistida con revisión manual
- [ ] Comparación de versiones para seguimiento
- [ ] Vistas de Requisitos como vistas ancladas read-only
- [ ] Trazabilidad externa por ID persistente
- [ ] Criterios de aceptación serializados
- [ ] Relaciones fundamentales admitidas (satisface, agregación, exhibición, generalización)
- [ ] `Satisfied Requirement Set` ordenada si se declara

## Antipatrones

- Requirement conectado por consumo/resultado/efecto/agente/instrumento
- Vista de Requisitos editable
- Usar "Essence" desnudo para el atributo del requisito
- Integrar sugerencias ML sin revisión humana
- Requisito como proceso (debe ser objeto)
- Citar requisito por nombre visible en trazabilidad externa

## Referencias cruzadas

- Estereotipos: `52-estereotipos-requirement.md`
- Enlaces estructurales: `14-enlaces-estructurales.md`
- Vistas ancladas: `40-navegacion-arbol-identidad.md`
- Multiplicidad: `16-modificadores-operadores.md`
- OPL estructurales: `72-opl-plantillas-estructurales.md`
