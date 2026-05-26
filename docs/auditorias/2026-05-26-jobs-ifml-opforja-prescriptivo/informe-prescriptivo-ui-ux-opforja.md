# Informe prescriptivo UI/UX - Opforja Jobs + IFML

**Fecha:** 2026-05-26
**Producto:** Opforja / deep-opm-pro
**URL auditada:** `https://opforja.sanixai.com/`
**Marco:** `jobs-web-ux` encarnado como criterio de producto + `ifml` como estructura formal de interacción.
**Evidencia viva:** `evidencia-ui-ux-profunda.json` y 14 capturas en `screenshots/`.
**Decisión nueva del operador:** eliminar la función de asistente y eliminar la existencia de ejemplos en toda la app.

## 0. Decisión de producto

La app objetivo queda definida así:

1. Opforja abre en un modelo vacío si no hay trabajo persistido.
2. No existe asistente.
3. No existen ejemplos, fixtures demostrativos, modelos sandbox ni caminos de onboarding con contenido precargado.
4. No existe banner de bienvenida.
5. No existe `System Diagram` como primer estado.
6. La app enseña por estructura, no por tutorial.
7. El modelador humano construye, nombra, conecta, diagnostica y corrige.

Esto no es una poda cosmética. Cambia el modelo IFML: desaparecen `AssistantWizard`, `WelcomeScreen`, `ExamplesCatalog` y cualquier `Template/Example` como punto de entrada. El default real pasa a ser `WorkbenchOPM -> EmptySD`.

## 1. Veredicto ejecutivo

Opforja tiene una mesa de trabajo prometedora: canvas, OPL, inspector, árbol OPD, command palette, diagnóstico, persistencia local, simulación y exportación ya conviven en un producto que funciona sin errores runtime observados.

Pero la UI todavía está organizada alrededor de deuda de onboarding: `System Diagram`, asistente, ejemplos, plantillas y tests históricos que protegen esa experiencia vieja. Esa deuda ya bloquea la claridad del producto.

Evidencia viva nueva:

```text
OK: 9
FAIL: 9
INFO: 6
consoleErrors: 0
pageErrors: 0
requestFailures: 0
screenshots: 14
```

Los 9 FAIL no son fallos técnicos de ejecución. Son fallos contra el producto objetivo:

- el primer paint todavía dice `system diagram`;
- hay FABs de bugs en desktop y mobile;
- command palette ofrece `Asistente guiado`;
- command palette ofrece `Plantillas`;
- `Abrir / importar modelo` ofrece ejemplos;
- `DialogoPlantillas` existe y abre;
- diagnóstico trata un proceso aislado como mejora blanda;
- mobile conserva los FABs;
- la estructura de tests/código sigue protegiendo asistente/ejemplos.

La ronda siguiente debe ser de sustracción fuerte. No agregar features hasta borrar esas contradicciones.

## 2. Evidencia viva

Archivo: `docs/auditorias/2026-05-26-jobs-ifml-opforja-prescriptivo/evidencia-ui-ux-profunda.json`.

Capturas:

| Captura | Hallazgo |
|---|---|
| `01-desktop-primer-paint.png` | Primer paint desktop: `sistema · system diagram`, canvas vacío y FABs visibles. |
| `02-palette-asistente.png` | `Asistente guiado` aparece en command palette. |
| `03-palette-plantillas.png` | `Plantillas` aparece en command palette. |
| `04-palette-ejemplo.png` | `Abrir / importar modelo` matchea `ejemplos`. |
| `05-palette-simulacion.png` | Simulación conceptual y numérica conviven como acciones de vista. |
| `06-palette-bug.png` | Captura y ledger de bugs aparecen en command palette. |
| `07-palette-configuracion.png` | Configuración abre correctamente. |
| `08-dialogo-abrir-importar.png` | Diálogo conserva selector `Cargar modelo de ejemplo`. |
| `09-dialogo-plantillas.png` | Catálogo de plantillas existe y ofrece guardar/insertar. |
| `10-dialogo-configuracion.png` | Configuración mezcla modelo, cuadrícula y OPL. |
| `11-dialogo-simulacion-numerica.png` | Simulación numérica abre con estado vacío de atributos simulables. |
| `12-inspector-objeto.png` | Inspector de objeto muestra ficha amplia de propiedades. |
| `13-diagnostico-expandido.png` | Proceso aislado aparece bajo `Mejoras`, no como bloqueo/pendiente fuerte. |
| `14-mobile-primer-paint.png` | Mobile muestra revisión, pero conserva FABs de bugs. |

## 3. Modelo IFML objetivo

### 3.1 Plataforma y roles

**Plataforma:** web híbrida desktop-first, con mobile de revisión.
**Rol primario:** `Modeler`.
**ViewPoint default:** `EdicionOPM`.
**ViewPoints secundarios:** `RevisionMobile`, `SimulacionConceptual`, `SimulacionNumerica`, `MapaSistema`, `ImportExport`.

### 3.2 ViewContainers válidos

```text
ViewContainer WorkbenchOPM [conjunctive, landmark]
  ViewComponent Header
  ViewComponent Toolbar
  ViewContainer OPLRail
  ViewContainer CanvasOPD [default]
  ViewContainer RightRail
    ViewComponent OPDTree
    ViewContainer DetailArea [XOR, default=Inspector]
      ViewComponent Inspector
      ViewComponent DiagnosticPanel
      ViewComponent Timeline
  ViewComponent FooterStatus

ViewContainer CommandPalette [Modal, CS-SRC]

ViewContainer OpenImportDialog [Modal, DE-FRM]
  ViewComponent SavedModelsList
  ViewComponent JsonImportExport

ViewContainer ConfigurationDialog [Modal, DE-FRM]

ViewContainer SimulationConceptual [ViewPoint]
ViewContainer SimulationNumericaDialog [Modal, DE-FRM]

ViewContainer MobileReview [XOR, default=Canvas]
  ViewContainer Canvas
  ViewContainer OPDs
  ViewContainer OPL
  ViewContainer Issues
```

### 3.3 ViewContainers que deben desaparecer

```text
ViewContainer WelcomeScreen
ViewContainer AssistantWizard
ViewContainer ExamplesCatalog
ViewContainer BuiltInFixturesSelector
ViewContainer TemplatesCatalog
```

`TemplatesCatalog` se elimina en esta ronda porque, en el producto actual, opera como otra forma de ejemplo/reuso prematuro. Si el futuro exige reutilización, se reintroduce como `Library` para artefactos creados por el usuario, nunca como catálogo de ejemplos ni onboarding.

### 3.4 Patrones IFML permitidos

| Patrón | Uso objetivo |
|---|---|
| `O-*` | Organización de workbench, rails, canvas y mobile tabs. |
| `CN-MD` | Canvas/selección como master, inspector/OPL/diagnóstico como details. |
| `CN-MLMD` | Modelo -> OPD -> cosa/enlace/estado -> propiedades/OPL. |
| `CS-SRC` | Command palette sin secciones vacías durante búsqueda. |
| `CS-MCS` | Búsqueda global de modelos/cosas/OPL, no ejemplos. |
| `DE-FRM` | Configuración, importar/exportar, colisiones, simulación numérica. |
| `CM-*` | Crear, renombrar, conectar, descomponer, guardar, importar, exportar. |
| `CM-NOTIF` | Diagnóstico, autosave, feedback de mutación, undo visible. |

`DE-WIZ` deja de aplicar porque se elimina el asistente.

## 4. Lista prescriptiva por severidad

### P0. Eliminar asistente de toda la app

**Evidencia:** `02-palette-asistente.png`; `CommandPalette.tsx:476`; `App.tsx:56`; `App.tsx:360`; `uiPanel.ts:447-550`; `creacionWizard.ts:1-224`.

**Diagnóstico Jobs:** el asistente convierte el producto en una app que pide una conversación antes de modelar. Aunque el wizard sea determinístico, carga la decisión inicial en una superficie separada del trabajo real. Ahora que el criterio es partir vacío, el asistente es deuda pura.

**Diagnóstico IFML:** `AssistantWizard` era un `DE-WIZ`; el modelo objetivo ya no tiene ese `ViewContainer`. Todo `Event` que navegue a asistente debe desaparecer. No se reemplaza por otro wizard.

**Eliminar:**

- `app/src/ui/asistente/`
- `app/src/modelo/creacionWizard.ts` y tests asociados, salvo que alguna función se reaproveche fuera del asistente. Si se conserva lógica de siembra para tests, debe renombrarse como helper interno no UI y no tener superficie.
- `app/src/app/ports/newModelAssistantPort.ts`
- `app/src/app/ports/zustandNewModelAssistantPort.ts`
- `app/src/app/viewmodels/asistenteNuevoModeloViewModel.ts`
- estado `asistente` en `app/src/store/tipos.ts`
- acciones `iniciarAsistente`, `siguienteEtapa`, `etapaAnterior`, `cancelarAsistente`, `confirmarAsistente`
- lazy import `AsistenteNuevoModelo` en `App.tsx`
- command `asistente-guiado` en `CommandPalette.tsx`
- sección visual `ASISTENTE` en command palette
- origen de pestaña `"asistente"` en `modelo/tipos/pestana.ts`
- copy de persistencia `Origen: generado por asistente IA` en `ChipPersistencia.tsx`
- tests que abren o esperan asistente.

**Reemplazar por:** nada. La primera acción del usuario es crear objeto/proceso, renombrar, conectar o importar JSON propio.

**Criterios de aceptación:**

- `rg -n "asistente|Asistente" app/src app/e2e` no devuelve superficies de producto.
- `Ctrl+K` con `asistente` devuelve `sin resultados - escribe otro comando`.
- No existe `data-ifml-pattern="DE-WIZ"` en la UI.
- No existe `role="dialog"` con nombre `Asistente nuevo modelo`.
- No existe origen de pestana `asistente`.

### P0. Eliminar ejemplos y fixtures demostrativos de toda la UI

**Evidencia:** `01-desktop-primer-paint.png`, `04-palette-ejemplo.png`, `08-dialogo-abrir-importar.png`; `App.tsx:110-113`; `DialogoCargarModelo.tsx:75-80`; `DialogoCargarModelo.tsx:97-115`; `PantallaInicio.tsx:3-9`; `PantallaInicio.tsx:61`.

**Diagnóstico Jobs:** los ejemplos hacen que la app parezca demo. Peor: contaminan el contrato de vacío. El usuario no debe preguntarse si está editando su modelo o un modelo didáctico.

**Diagnóstico IFML:** `BuiltInFixturesSelector` y `WelcomeScreen` son `ViewContainer` extraños al flujo de edición. El default debe ser `EmptySD`, no `ExampleLoaded`.

**Eliminar:**

- `usePrecargaBienvenida("System Diagram")` en `App.tsx`.
- `PantallaInicio` del render de desktop y mobile.
- `PantallaInicio.tsx` y su viewmodel si queda sin uso.
- `precargaBienvenidaViewModel.ts`.
- `welcomeScreenPort.ts` y `zustandWelcomeScreenPort.ts` si sólo existen para bienvenida.
- selector `Cargar modelo de ejemplo` en `DialogoCargarModelo`.
- `listarFixtures()` en UI de abrir/importar.
- `cargarFixtureDemo` como acción de UI.
- textos `Ejemplos...`, `Estás viendo un ejemplo`, `System Diagram` como default.
- e2e `26-onboarding-canvas-precargado.spec.ts`.
- aserciones de ejemplos en `01-carga-y-workspace`, `11-beta1-catalogo-ancla`, `12-command-palette`, `12-toolbar-overflow`, helpers `cargarModeloEjemplo`.

**Conservar sólo si es necesario para tests de dominio:**

- fixtures internos de modelo en `app/src/modelo/fixtures.ts`, pero no expuestos a UI ni a command palette. Si se mantienen, deben llamarse fixtures de test/desarrollo, no ejemplos de producto.

**Criterios de aceptación:**

- Primer paint no contiene `System Diagram`.
- `Abrir / importar modelo` no contiene selector de ejemplos.
- `Ctrl+K` con `ejemplo` devuelve `sin resultados - escribe otro comando`.
- `rg -n "Cargar modelo de ejemplo|Ejemplos|Estás viendo un ejemplo|System Diagram" app/src app/e2e` no devuelve UI/product tests activos, salvo fixtures de test explícitamente aislados.

### P0. Eliminar plantillas como superficie de producto en esta ronda

**Evidencia:** `03-palette-plantillas.png`, `09-dialogo-plantillas.png`; `CommandPalette.tsx:477-478`; `DialogoPlantillas.tsx:18-227`; `persistencia/plantillas.ts`.

**Diagnóstico Jobs:** plantillas agrega un sistema de reutilización antes de que el loop primario de modelado esté completamente limpio. Además queda semánticamente pegado a ejemplos. Si el producto objetivo elimina ejemplos, esta superficie no puede quedar como camino alternativo de contenido prefabricado.

**Diagnóstico IFML:** `TemplatesCatalog` no es necesario para `WorkbenchOPM`. Es un `ViewContainer` secundario que introduce CRUD y búsqueda extra sin resolver el JTBD central del modelador.

**Eliminar de UI:**

- comandos `guardar-plantilla` y `plantillas`;
- `DialogoPlantillas`;
- `dialogoPlantillasAbierto` y `dialogoGuardarPlantillaAbierto`;
- puertos `templateDialogsPort` y `zustandTemplateDialogsPort`;
- viewmodel `dialogoPlantillasViewModel`;
- storage local `opm:plantilla:*` desde producto;
- e2e HU-33 de plantillas como parte de producto visible.

**Conservar opcionalmente como módulo dormido:** sólo si se mueve fuera del bundle de UI y queda detrás de tests de dominio no visibles. Recomendación Jobs: eliminar del producto, no ocultar.

**Criterios de aceptación:**

- `Ctrl+K` con `plantillas` devuelve `sin resultados - escribe otro comando`.
- No existe `DialogoPlantillas` en bundle UI.
- No existe botón `Guardar modelo actual como plantilla`.
- No existe `Mis plantillas`.

### P0. Primer paint vacío, sin residuos

**Evidencia:** `01-desktop-primer-paint.png`; finding `no debe existir System Diagram` FAIL.

**Estado actual observado:** `Opforja Modelo + sistema · system diagram ... editor vacío ...`.

**Prescripción:**

```text
Tab: Modelo
Breadcrumb: modelo · SD
OPD tree: SD
OPL: Sin OPL todavía.
Canvas: O objeto · P proceso · R relación
Inspector vacío: Selecciona un elemento.
Footer-left: View Edición
Footer-right: Diagnóstico: sin pendientes
```

**Eliminar copy:**

```text
Pulsa Objeto o Proceso arriba para empezar.
System Diagram
sistema · system diagram
Empezar vacío
Bienvenida
```

**Criterios de aceptación:**

- Nuevo usuario sin modelos ve vacío real.
- No hay banner, wizard, ejemplo ni selector de ejemplo.
- La primera interacción visible es crear o importar trabajo propio.
- Mobile respeta el mismo contrato.

### P0. Retirar FABs de bugs del canvas

**Evidencia:** `01-desktop-primer-paint.png`, `14-mobile-primer-paint.png`; `CapturadorBugs.tsx:178-197`; DDR-0007.

**Diagnóstico Jobs:** dos círculos permanentes invaden el plano semántico. Son herramienta de desarrollo, no contenido del modelo.

**Diagnóstico IFML:** `CaptureBug Action` debe ser landmark global por command palette/atajo, no `ViewComponent` flotante en `CanvasOPD`.

**Prescripción:**

- `CapturadorBugs` puede seguir montado como host de diálogos y listeners.
- Eliminar botones `bug-capture-open` y `bug-ledger-open`.
- Mantener:
  - `Ctrl+Alt+B`;
  - `Ctrl+K -> Capturar bug`;
  - `Ctrl+K -> Bugs y features`.
- Si se requiere señal dev, usar footer textual sólo en modo dev: `bugs · captura`.

**Criterios de aceptación:**

- Desktop y mobile no muestran FABs.
- Atajo y command palette siguen abriendo captura/ledger.
- Tests visuales validan ausencia de FABs.

### P1. Reestructurar command palette

**Evidencia:** `02` a `07` muestran todas las secciones aunque la búsqueda tenga un resultado. `CommandPalette.tsx:515-525` crea siempre todos los grupos.

**Diagnóstico Jobs:** con búsqueda activa, la app debe responder a intención, no mostrar taxonomía interna.

**Prescripción:**

- Eliminar sección `ASISTENTE`.
- Eliminar acciones de plantillas y ejemplos.
- Con query no vacía, renderizar sólo grupos con resultados.
- Máximo 12 resultados visibles.
- Orden:
  1. acción exacta por label;
  2. acción frecuente;
  3. entidad/OPD/OPL;
  4. comandos secundarios.
- Empty state:

```text
sin resultados - escribe otro comando
```

- Footer:

```text
↑↓ navegar · ↵ ejecutar · esc cerrar
```

**Criterios de aceptación:**

- Query `asistente`, `ejemplo`, `plantilla` no devuelve acciones.
- Query `simulación` muestra sólo simulación, sin grupos vacíos.
- Query `bug` muestra sólo acciones de bug.
- `Esc`, `Enter`, flechas y focus visible pasan.

### P1. Convertir el inspector en la superficie primaria de modelado

**Evidencia:** `12-inspector-objeto.png`; `InspectorEntidad.tsx:203-320`; `Inspector.tsx:51-56`.

**Diagnóstico Jobs:** el inspector contiene potencia real, pero está demasiado denso para el primer ciclo de modelado. Un objeto recién creado muestra nombre, semántica, descripción, alias, unidad, URLs, imagen, esencia, afiliación, estados, enlaces, refinamiento, apariciones y estilo. Eso es correcto como capacidad, incorrecto como primer contacto.

**Diagnóstico IFML:** `Inspector` es `Details ViewComponent` con `ParameterBinding selectedElement`. Debe tener ramas progresivas por intención, no volcar todas las propiedades al mismo peso visual.

**Prescripción de estructura:**

```text
Inspector
  Header: tipo + identificador + nombre
  Bloque principal: Semántica mínima
    Esencia
    Afiliación
    Estados si objeto
  Bloque operativo: Relaciones
    Enlaces entrantes/salientes
    Acción: conectar
  Bloque avanzado colapsado: Refinamiento
  Bloque avanzado colapsado: Apariciones
  Bloque avanzado colapsado: Estilo
  Bloque avanzado colapsado: Metadatos
```

**Cambios concretos:**

- Empty inspector debe decir sólo `Selecciona un elemento.`
- Nombre debe seguir auto-enfocado al crear.
- `Descripción`, `Alias`, `Unidad`, `URLs`, `Imagen` pasan a `Metadatos`.
- `Estilo` colapsado por default.
- `Apariciones` colapsado por default salvo entidad con múltiples apariciones.
- `Refinamiento` visible para proceso; colapsado para objeto sin partes.
- Estados de objeto visibles sólo si el objeto tiene estados o si el usuario elige `Agregar estados`.
- Acciones destructivas o avanzadas deben estar al final de sección, no intercaladas con semántica.

**Microcopy:**

```text
Selecciona un elemento.
Nombre
Semántica
Relaciones
Estados
Refinamiento
Metadatos
Estilo
```

**Criterios de aceptación:**

- Objeto recién creado enfoca nombre y no abruma con más de 3 bloques abiertos.
- Proceso recién creado muestra `Nombre`, `Semántica`, `Relaciones`, `Refinamiento`.
- Estilo no ocupa espacio inicial.
- Todo campo avanzado sigue accesible en un click.

### P1. Diagnóstico: de sugerencias blandas a pendientes accionables

**Evidencia:** `13-diagnostico-expandido.png`; `PanelDiagnostico.tsx:13-29`; `PanelDiagnostico.tsx:96`; texto `Bloqueos · ninguno`, `Mejoras · 3`.

**Diagnóstico Jobs:** `Mejoras` minimiza defectos semánticos. Un proceso sin entradas/salidas no es mejora, es trabajo pendiente del modelador.

**Diagnóstico IFML:** `DiagnosticPanel` es `SystemEvent -> DiagnosticList`. Su severidad debe reflejar outcome operativo.

**Prescripción:**

- Renombrar:

```text
Bloqueos -> Bloqueos
Mejoras -> Pendientes
Estilo -> Estilo
sin sugerencias -> sin pendientes
```

- `Proceso sin entradas ni salidas` pasa a `bloqueo` cuando el OPD no puede considerarse semánticamente expresivo.
- Cada fila debe tener:
  - título;
  - una instrucción;
  - destino;
  - `Ir`;
  - `[cita]`.

**Microcopy:**

```text
Proceso sin entradas ni salidas
Conecta una entrada, una salida o descompón el proceso.
Ir
[cita]
```

**Criterios de aceptación:**

- Proceso aislado no aparece bajo `Mejoras`.
- Footer dice `N pendientes` o `N bloqueos` según severidad.
- Click en aviso selecciona elemento y colapsa diagnóstico al inspector.

### P1. Hacer visible deshacer después de toda mutación semántica

**Evidencia:** undo por teclado existe en auditoría previa, pero no aparece como outcome visible.

**Diagnóstico Jobs:** la reversibilidad invisible reduce exploración. El modelador debe sentir que puede corregir.

**Diagnóstico IFML:** cada `Action` mutante debe emitir un `ActionEvent normal` con feedback y `Undo Action`.

**Prescripción:**

Tras crear, renombrar, conectar, descomponer, aplicar OPL, importar JSON, simular cambios o resolver colisión:

```text
Aplicado: crear objeto · Deshacer
Aplicado: crear proceso · Deshacer
Aplicado: renombrar · Deshacer
Aplicado: conectar · Deshacer
Aplicado: descomponer · Deshacer
Aplicado: cambios OPL · Deshacer
```

El link `Deshacer` llama al mismo mecanismo que `Ctrl+Z`.

**Criterios de aceptación:**

- Feedback visible por 4 segundos o hasta siguiente acción.
- No desplaza layout.
- Click revierte.
- `Ctrl+Z` sigue funcionando.

### P1. Separar abrir, importar y guardar sin ejemplos

**Evidencia:** `08-dialogo-abrir-importar.png`; `DialogoCargarModelo.tsx:82-115`.

**Diagnóstico Jobs:** el diálogo actual mezcla guardados, archivados, versiones, JSON y ejemplos. Sin ejemplos, el diálogo puede respirar.

**Modelo IFML objetivo:**

```text
OpenImportDialog [DE-FRM]
  SavedModelsList
  JsonImportExport
  ArchiveToggle
  VersionsToggle
```

**Prescripción:**

- Título: `Abrir modelo`.
- Subtabs o secciones:
  - `Guardados`
  - `JSON`
  - `Archivados` como filtro, no modo.
- Eliminar `Ejemplos...`.
- El botón primario debe decir `Abrir`, no `Cargar`.
- Si abrir reemplaza modelo actual dirty, confirmación:

```text
Reemplazar modelo actual
Tienes cambios sin guardar. Guarda o descarta antes de abrir otro modelo.
```

**Criterios de aceptación:**

- No hay selector de ejemplos.
- Importar JSON conserva validación y error específico.
- Abrir modelo dirty requiere confirmación.

### P1. Configuración: reducir alcance y mover modelado al inspector

**Evidencia:** `10-dialogo-configuracion.png`; `DialogoConfiguracion.tsx:55-115`.

**Diagnóstico Jobs:** configuración mezcla identidad del modelo, cuadrícula y OPL. Es utilitaria, pero demasiado miscelánea.

**Prescripción:**

- Renombrar a `Preferencias`.
- Mantener aquí sólo:
  - cuadrícula;
  - snap;
  - OPL display;
  - preferencias de visualización global.
- Mover renombrado de modelo a header/breadcrumb o command `Renombrar modelo`.
- El estado de modelo sin guardar no debe decir "Guarda el modelo antes de cambiar su nombre persistido"; debe permitir renombrar localmente.

**Microcopy:**

```text
Preferencias
Modelo: renombrar desde el header.
Cuadrícula
OPL
Guardar preferencias
```

**Criterios de aceptación:**

- Renombrar modelo no depende de guardar.
- Preferencias no mezcla identidad y display.

### P1. Simulación numérica: mantener, pero contextualizar mejor

**Evidencia:** `11-dialogo-simulacion-numerica.png`; `DialogoSimulacionNumerica.tsx:109-116`.

**Diagnóstico Jobs:** la simulación numérica es una feature real, no onboarding. Debe sobrevivir. Su estado vacío actual explica demasiado y no conecta al próximo paso.

**Diagnóstico IFML:** `SimulationNumericaDialog` es `DE-FRM` con `RunSimulation Action`. El estado vacío debe tener `NavigationFlow` hacia el inspector del atributo cuando haya selección aplicable.

**Prescripción:**

Estado vacío:

```text
Sin atributos simulables.
Selecciona un atributo numérico y activa Simulable en el inspector.
```

Si hay objeto seleccionado sin atributo:

```text
Agregar atributo numérico
```

Si no hay selección:

```text
Selecciona un objeto con atributos numéricos.
```

**Criterios de aceptación:**

- No menciona "función" genérica.
- Tiene salida operativa si existe selección aplicable.
- `Ejecutar` disabled comunica por qué en tooltip o texto cercano.

### P1. Mobile: revisión real, no edición incompleta con FABs

**Evidencia:** `14-mobile-primer-paint.png`.

**Diagnóstico Jobs:** mobile se ve como modo revisión, lo cual es correcto. El error es heredar comandos flotantes y capacidad de edición poco clara.

**Modelo IFML:** `MobileReview` es XOR. No debe intentar replicar el desktop.

**Prescripción:**

- Sin FABs.
- Pestañas:

```text
Canvas
OPDs
OPL
Pendientes
```

- Cambiar `Sugerencias` a `Pendientes`.
- Mobile default es lectura/revisión. Si se permite edición, debe estar claramente acotada.
- Command palette mobile debe abrir, pero con comandos compatibles con mobile.

**Criterios de aceptación:**

- 390x844 sin overflow horizontal.
- No aparecen bugs FABs.
- No aparece asistente/ejemplos/plantillas.
- Diagnóstico mobile dice `Pendientes`, no `Sugerencias`.

### P2. OPL editor: conservar honestidad, quitar entrenamiento permanente

**Evidencia previa:** editor muestra reconocidas, aplicables y no aplicables.

**Prescripción:**

- Mantener preview antes de aplicar.
- Mantener `Aplicar N cambios`.
- Contraer ayuda de markdown bajo `sintaxis`.
- Copy visible:

```text
Edita una oración por línea.
Los cambios reconocidos aparecerán antes de aplicar.
```

**Criterios de aceptación:**

- No ocupa espacio permanente con tutorial.
- Cambios no aplicables tienen razón concreta.

### P2. Barra superior y persistencia: retirar origen asistente/fixture

**Evidencia:** `ChipPersistencia.tsx:23-64`; `ChipPersistencia.tsx:153-159`.

**Prescripción:**

- Quitar variante `asistente`.
- Quitar copy `Origen: generado por asistente IA`.
- Quitar variante `fixture` si los fixtures dejan de ser UI.
- Estados válidos:
  - `nuevo`;
  - `local-clean`;
  - `local-dirty`;
  - `importado`.

**Microcopy:**

```text
Sin guardar · Ctrl+S
Cambios sin guardar
Guardado
Importado desde JSON
```

**Criterios de aceptación:**

- Tooltip de persistencia no menciona asistente ni fixture.
- `System Diagram` no aparece como nombre inicial.

### P2. Search global y modelo: tipar resultados

**Prescripción:**

- Resultados de búsqueda deben distinguir:
  - `Comando`;
  - `Objeto`;
  - `Proceso`;
  - `Estado`;
  - `OPD`;
  - `OPL`.
- No mezclar workspace y modelo activo sin etiqueta.
- Resultado seleccionado debe mostrar destino antes de ejecutar.

**Criterios de aceptación:**

- `Ctrl+F` busca dentro del modelo.
- `Ctrl+Shift+F` busca workspace.
- `Ctrl+K` busca comandos.
- Cada superficie mantiene su job.

### P2. Enlaces y acciones contextuales: una sola voz por selección

**Prescripción:**

- Acciones sobre selección aparecen en:
  - inspector;
  - menú contextual;
  - command palette.
- Evitar barras flotantes permanentes o duplicadas.
- Para selección, el footer puede mostrar atajos contextuales breves.

**Criterios de aceptación:**

- Seleccionar entidad no abre controles que tapen el canvas.
- Acciones destructivas tienen confirmación o undo visible.

### P2. Documentación normativa y tests: reescribir el canon UI

**Evidencia:** `ui-forja/01-design-spec.md`, `03-scenes.md`, `06-ssot-compliance.md` todavía mencionan `System Diagram`, ejemplo precargado y asistente.

**Prescripción:**

- Actualizar `ui-forja`:
  - eliminar escenas de ejemplo precargado;
  - eliminar asistente SD como requisito de UI;
  - actualizar mobile a `Pendientes`;
  - definir empty default como norma.
- Retirar o reescribir tests:
  - `26-onboarding-canvas-precargado.spec.ts`;
  - tests de command palette que esperan ejemplos;
  - tests de plantillas si se elimina la superficie;
  - tests de asistente;
  - helpers `cargarModeloEjemplo`.

**Criterios de aceptación:**

- `ui-forja` y tests ya no contradicen el producto objetivo.
- `design:governance` no protege un diseño obsoleto.

## 5. Qué eliminar, mejorar, corregir y agregar

### 5.1 Eliminar

1. Asistente completo.
2. Bienvenida.
3. Ejemplos en primer paint.
4. Ejemplos en abrir/importar.
5. Sección `ASISTENTE` en command palette.
6. `System Diagram` como default.
7. `Empezar vacío`.
8. Plantillas visibles y guardado de plantillas en esta ronda.
9. FABs de bug capture y bug ledger.
10. Variante de persistencia `asistente`.
11. Variante de persistencia `fixture`, salvo uso interno sin UI.
12. Tests que fuerzan onboarding, ejemplos o asistente.
13. Documentación `ui-forja` que prescribe asistente/ejemplos.

### 5.2 Corregir

1. Primer paint debe ser `Modelo`, no `System Diagram`.
2. Breadcrumb debe ser `modelo · SD`.
3. Canvas vacío debe usar leyenda mínima.
4. Command palette debe ocultar grupos vacíos.
5. Diagnóstico debe decir `Pendientes`, no `Mejoras`.
6. Proceso aislado debe tener severidad fuerte.
7. Mobile debe eliminar FABs.
8. Abrir/importar debe separar guardados y JSON.
9. Configuración no debe bloquear renombrado local por no guardar.
10. Footer debe comunicar acciones aplicadas y undo.

### 5.3 Mejorar

1. Inspector con progresión: básico abierto, avanzado colapsado.
2. Diagnóstico con navegación clara y una instrucción por issue.
3. Simulación numérica con salida contextual hacia atributos.
4. Search con tipos de resultado.
5. Persistencia con estados menos ambiguos.
6. Mobile como revisión limpia.
7. OPL editor con ayuda colapsada.
8. Acciones contextuales sin overlays flotantes permanentes.

### 5.4 Agregar

Agregar sólo lo que reemplaza control perdido por sustracción:

1. Feedback reversible post-mutación en footer.
2. Empty state normativo compacto.
3. Estado `Pendientes` como lenguaje común de diagnóstico desktop/mobile.
4. Criterios E2E nuevos:
   - no assistant;
   - no examples;
   - no templates UI;
   - no bug FABs;
   - default empty;
   - command palette sin grupos vacíos;
   - inspector progresivo;
   - diagnóstico severo correcto.

No agregar tours, wizards, copilot, plantillas o ejemplos alternativos.

## 6. Plan de implementación recomendado

### Fase A - Corte de sustracción

Objetivo: borrar asistente, ejemplos, bienvenida, plantillas visibles y FABs.

Archivos principales:

- `app/src/ui/App.tsx`
- `app/src/ui/CommandPalette.tsx`
- `app/src/ui/CapturadorBugs.tsx`
- `app/src/ui/DialogoCargarModelo.tsx`
- `app/src/ui/PantallaInicio.tsx`
- `app/src/ui/asistente/*`
- `app/src/ui/DialogoPlantillas.tsx`
- `app/src/store/uiPanel.ts`
- `app/src/store/tipos.ts`
- `app/src/modelo/creacionWizard.ts`
- `app/src/modelo/tipos/pestana.ts`
- `app/src/ui/ChipPersistencia.tsx`
- e2e onboarding/asistente/plantillas/ejemplos.

Gate:

```bash
cd app
bun run typecheck
bun run test
bun run lint
bun run build
bun run design:governance
bunx playwright test e2e/01-carga-y-workspace.spec.ts e2e/12-command-palette.spec.ts e2e/21-estado-vacio-opm.spec.ts e2e/22-responsive-review.spec.ts e2e/27-visual-compliance-25-05.spec.ts
```

### Fase B - Inspector, diagnóstico y undo visible

Objetivo: hacer que la app sin asistente sea mejor para el modelador.

Archivos principales:

- `app/src/ui/Inspector.tsx`
- `app/src/ui/InspectorEntidad.tsx`
- `app/src/ui/InspectorEnlace.tsx`
- `app/src/ui/inspector/*`
- `app/src/ui/PanelDiagnostico.tsx`
- `app/src/app/viewmodels/panelDiagnosticoViewModel.ts`
- `app/src/ui/codex/CodexFooterKey.tsx`
- store/history/feedback ports.

Gate:

```bash
cd app
bunx playwright test e2e/20-inspector-tabs.spec.ts e2e/20-opl-editor-honesto.spec.ts e2e/23-inspector-resize.spec.ts e2e/29-colision-nombre.spec.ts
```

### Fase C - Import/export, simulación y mobile

Objetivo: limpiar superficies secundarias después de la poda.

Archivos principales:

- `DialogoCargarModelo.tsx`
- `PersistenciaJson.tsx`
- `DialogoSimulacionNumerica.tsx`
- `ModoRevisionMobile.tsx`
- `BarraPestanas.tsx`
- `ui-forja/*`

Gate:

```bash
cd app
bunx playwright test e2e/22-responsive-review.spec.ts e2e/30-simulacion-numerica.spec.ts e2e/11-dialogo-layout-regression.spec.ts
```

## 7. Modelo IFML de cierre

El IFD final debe validar estas invariantes:

1. `WorkbenchOPM` es el único default.
2. `CanvasOPD.Empty` es default si no hay contenido.
3. No hay `NavigationFlow` a `AssistantWizard`.
4. No hay `NavigationFlow` a `ExamplesCatalog`.
5. No hay `NavigationFlow` a `TemplatesCatalog`.
6. Todo `Event` interactivo tiene salida: `Action`, `NavigationFlow` o `DataFlow`.
7. Todo `Action` mutante produce feedback reversible.
8. `CommandPalette` es `CS-SRC`, no menú de onboarding.
9. `DiagnosticPanel` recibe `SystemEvent` y emite navegación a selección.
10. `MobileReview` es XOR con default `Canvas`.

Representación:

```text
User enters app
  -> WorkbenchOPM
  -> CanvasOPD.Empty [default]
  -> CreateObject/CreateProcess/CreateRelation
  -> Selection
  -> Inspector + OPL + Diagnostic
  -> FeedbackStatus
  -> UndoAction

No branch:
  - AssistantWizard
  - WelcomeScreen
  - ExamplesCatalog
  - TemplatesCatalog
```

## 8. Criterios de aceptación finales

La ronda no está cerrada hasta que todo esto sea verdadero:

1. Primer paint desktop no contiene `System Diagram`.
2. Primer paint mobile no contiene `System Diagram`.
3. Primer paint no contiene `Asistente`.
4. Primer paint no contiene `Ejemplo`.
5. `Ctrl+K asistente` no devuelve resultados.
6. `Ctrl+K ejemplo` no devuelve resultados.
7. `Ctrl+K plantillas` no devuelve resultados.
8. Abrir/importar no tiene selector de ejemplos.
9. No existe `DialogoPlantillas` visible.
10. No existen FABs de bugs en desktop.
11. No existen FABs de bugs en mobile.
12. Captura de bug sigue funcionando por `Ctrl+Alt+B`.
13. Command palette no muestra secciones vacías cuando hay query.
14. Inspector vacío dice sólo `Selecciona un elemento.`
15. Objeto recién creado muestra inspector progresivo, no todo expandido.
16. Proceso aislado aparece como pendiente/bloqueo fuerte.
17. Footer muestra `Deshacer` después de mutaciones.
18. OPL editor no muestra ayuda markdown permanente.
19. Configuración no bloquea renombrado local.
20. Mobile usa `Pendientes`, no `Sugerencias`.
21. `rg -n "asistente|Asistente|Cargar modelo de ejemplo|Estás viendo un ejemplo|System Diagram" app/src app/e2e` no devuelve UI o tests activos, salvo fixtures internos aislados.
22. `bun run check`, `lint`, `build`, `design:governance` pasan.

## 9. Conclusión

Opforja no necesita más ayuda inicial. Necesita una primera pantalla honesta y un inspector mejor.

La app correcta no tiene asistente, no tiene ejemplos y no finge que el usuario necesita ser guiado antes de modelar. Abre en vacío, deja crear rápido, muestra propiedades con precisión, diagnostica con severidad y permite deshacer.

Ese es el producto más fuerte: menos puertas, menos demostración, más modelado.
