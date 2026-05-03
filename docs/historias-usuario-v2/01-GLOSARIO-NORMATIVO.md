---
titulo: "Glosario normativo — vocabulario único del inventario v2"
fecha: 2026-05-03
estado: "activo"
fuente_primaria: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md"
verificado_por: "tools/validate-hu.ts"
---

## 1. Propósito

Define el vocabulario único del inventario v2. Para cada concepto OPM existe **una sola forma canónica en español**. Las formas inglesas u obsoletas están **prohibidas en cuerpo de HU canónica** (rechazadas por el linter). Pueden aparecer entre comillas dentro de `**Notas de evidencia:**` cuando se cita literalmente OPCloud.

Las equivalencias EN se mencionan entre paréntesis solo la primera vez que el término aparece en cada épica y solo cuando ayuda a interoperar con literatura OPM/OPCloud.

## 2. Términos OPM canónicos

| Canónico (usar) | Equivalente EN (referencia) | Definición breve | Citación SSOT |
|---|---|---|---|
| **cosa** | thing | Elemento OPM: objeto o proceso. | [Glos 3.76] |
| **objeto** | object | Cosa con existencia (potencial o real). | [Glos 3.39] |
| **proceso** | process | Cosa que transforma uno o más objetos. | [Glos 3.58] |
| **estado** | state | Situación cualitativa o valor que un objeto puede asumir. | [Glos 3.68] |
| **enlace** | link | Conexión semántica entre cosas. | [Glos 3.36] |
| **afiliación** | affiliation | Eje sistémica/ambiental de una cosa. | [V-1] |
| **esencia** | essence | Eje informacional/física de una cosa. | [V-1] |
| **sistémica** | systemic | Cosa interna al sistema modelado. | [V-1] |
| **ambiental** | environmental | Cosa externa al sistema modelado. | [V-1] |
| **informacional** | informatical | Cosa cuya existencia es de información. | [V-1] |
| **física** | physical | Cosa cuya existencia es física. | [V-1] |
| **descomposición** | in-zooming | Refinamiento que abre un OPD hijo dentro del proceso. | [Glos 3.31], [Met §6] |
| **recomposición** | out-zooming | Operación inversa de descomposición. | [Glos 3.31] |
| **despliegue** | unfolding | Refinamiento estructural (parte/clase/atributo). | [Glos 3.81] |
| **plegado** | folding | Operación inversa del despliegue. | — |
| **plegado parcial** | semi-folding | Compresión visual intra-rectángulo de partes. | — |
| **habilitador** | enabler | Cosa que habilita un proceso (agente o instrumento). | [Glos 3.34] |
| **agente** | agent | Habilitador humano. | [Glos 3.3] |
| **instrumento** | instrument | Habilitador no humano. | [Glos 3.35] |
| **transformado** | transformee | Objeto que un proceso transforma (consumido, afectado o resultante). | [Glos 3.78] |
| **consumido** | consumed | Transformado que el proceso destruye. | [Glos 3.20] |
| **afectado** | affected | Transformado que el proceso modifica. | [Glos 3.4] |
| **resultante** | resulting | Transformado que el proceso crea. | [Glos 3.66] |
| **agregación-participación** | aggregation-participation | Familia de enlace estructural todo/parte. | [V-239] |
| **exhibición-característica** | exhibition-characterization | Familia de enlace estructural cosa/atributo. | [V-239] |
| **clasificación-instanciación** | classification-instantiation | Familia de enlace estructural clase/instancia. | [V-239] |
| **generalización-especialización** | generalization-specialization | Familia de enlace estructural superclase/subclase. | [V-239] |
| **etiquetado** | tagged | Familia de enlace estructural genérico con etiqueta. | [V-239] |
| **invocación** | invocation | Enlace procedural proceso→proceso. | [Glos 3.36] |
| **auto-invocación** | self-invocation | Proceso que se invoca a sí mismo. | — |
| **designación de estado** | state designation | Calificación de un estado: inicial, final, por defecto, Current. | [Glos 3.71a], [V-237] |
| **estereotipo** | stereotype | Mecanismo de extensión de OPM (property set). | — |
| **descripción del sistema** | system diagram (SD) | OPD raíz que delimita el sistema. | [Met §6], [Glos 3.69] |
| **OPD** | OPD | Diagrama de cosas y enlaces. | [Glos 3.40] |
| **OPL** | OPL | Object-Process Language; lenguaje natural derivado del OPD. | [Glos 3.42] |
| **OPL-ES** | — | OPL en español, plantillas T/D/TS. | — |
| **slot de valor** | value slot | Primitiva visible distinta del estado cualitativo. | [V-163] |
| **rango** | range | Especificación de valores admisibles para un slot. | [V-164] |
| **validación blanda** | soft validation | Validación que advierte pero no bloquea. | [V-219] |
| **validación dura** | hard validation | Validación que bloquea. | [V-220] |

## 3. Términos UI heredados de OPCloud

Estos términos describen afordances específicas de OPCloud. Se usan en HU `opcloud-ui` y `mixto`. No tienen contraparte SSOT exclusiva; el linter no los exige ni los prohíbe.

| Forma canónica ES | Equivalente OPCloud | Aclaración |
|---|---|---|
| barra principal | main toolbar | Barra superior del modelador con primitivas arrastrables. |
| canvas-OPD | canvas | Área principal de edición del OPD. |
| panel OPL-ES | OPL pane | Panel lateral con la traducción textual del modelo. |
| árbol OPD | OPD tree | Panel jerárquico de OPDs. |
| navegador OPD | OPD navigator | Miniatura del OPD activo. |
| biblioteca lateral | draggable things library | Lista de cosas existentes arrastrables. |
| diálogo de nombre | name popup | Popup emergente al crear/renombrar. |
| menú contextual | context menu | Menú radial / de tres puntos. |
| tabla de enlaces | links table | Tabla de tipos de enlace válidos al crear. |
| alternador de afiliación | affiliation toggle | Switch sistémica ↔ ambiental. |
| alternador de esencia | essence toggle | Switch informacional ↔ física. |
| pasar el cursor | hover | Acción de apuntar sin clicar. |
| arrastrar y soltar | drag and drop | Gesto de creación/movimiento. |
| atajo de teclado | keyboard shortcut | Combinación de teclas. |

## 4. Términos prohibidos en cuerpo

El linter rechaza estos términos en cuerpo de HU canónica viva. Para usarlos solo dentro de `**Notas de evidencia:**` y entre comillas:

```
thing, affiliation, essence, in-zooming, out-zooming, unfolding, folding,
enabler, transformee, aggregation (sin guión), hover, to-the-(left|right|top|bottom),
informatical, stateful
```

## 5. Modelo de datos — raíces

Las únicas raíces permitidas en `**Modelo de datos tocado:**` son:

- `entidad`, `apariencia`, `enlace`, `aparienciaEnlace`, `opd`, `modelo` — implementadas en `app/src/modelo/tipos.ts`.
- `estado`, `estereotipo` — propuestas; cada referencia se marca `[propuesta]`.

Nombres prohibidos (sustitución exacta):

```
cosa.X       → entidad.X
thing.X      → entidad.X
object.X     → entidad.X
link.X       → enlace.X
appearance.X → apariencia.X
```

## 6. Convenciones tipográficas en OPL-ES

Cuando una HU cita OPL-ES en criterios de aceptación o ejemplos:

- **Negrita** para objetos: `**Conductor**`.
- *Cursiva* para procesos: `*Rescatar*`.
- `Monoespaciado` para estados: `` `crudo` ``.

Ejemplo: `**Conductor** maneja *Rescatar*.` [OPL-ES T5]

## 7. Niveles categóricos abreviados

| Nivel | Dominio | Ejemplos |
|---|---|---|
| K | Kernel, tipos, validadores, reglas | crear cosa, validar afiliación |
| V | Render visual, canvas | dimensiones, colores, sombreado |
| L | Lentes derivadas | OPL eco, árbol OPD, mapa de sistema |
| P | Persistencia, workspace, versionado | save/load, folders, versiones |
| U | UI, gestos, popups, modales | diálogo de nombre, menú contextual |
| C | Configuración usuario / org | defaults, ontología organizacional |
| X | Integración externa | import, export, runtime |
| D | Dominio o profile | requirements, GenAI |

## 8. Actores canónicos

| Código | Rol |
|---|---|
| MN | Modelador novato |
| ME | Modelador experto |
| AM | Administrador / owner del modelo |
| AO | Administrador / owner de la organización |
| RV | Revisor / consumidor de modelo (read-only) |
| IS | Ingeniero de simulación / domain expert |
| INT | Sistema externo / integrador (MQTT, ROS, URL) |

## 9. Etiquetas (vocabulario controlado)

Vocabulario de etiquetas obligatorio. Cualquier etiqueta nueva debe ser justificada y documentada aquí.

```
canvas, kernel, opl, persistencia, colaboracion, exportacion, interop,
configuracion, interaccion, extension, simulacion, runtime, analisis,
validacion, render, ux, atajo, accesibilidad, seguridad, performance
```

Etiquetas funcionales por tipo de cosa o enlace:

```
proceso, objeto, estado, enlace-estructural, enlace-procedural,
agregacion, exhibicion, clasificacion, generalizacion, etiquetado,
agente, instrumento, consumo, efecto, resultado, invocacion
```
