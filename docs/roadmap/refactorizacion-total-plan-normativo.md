# Plan Normativo De Refactorizacion Total

**Fecha:** 2026-05-17  
**Repo:** `deep-opm-pro`  
**Alcance:** `app/`, artefactos de validacion asociados y reportes de roadmap cuando midan avance.  
**Estado:** cortes 0-7 ejecutados; Corte 8 agregado como auditoria de consistencia transversal y remediacion acotada.  
**Autoridad superior:** `AGENTS.md`, `docs/HANDOFF.md`, `docs/JOYAS.md`, `opm-extracted/`, SSOT OPM local y HU vivas.

## 1. Proposito

Este documento fija una refactorizacion total **autolimitada** del modelador OPM.

La palabra "total" no autoriza reescritura abierta. Significa que el sistema debe quedar completamente gobernado por fronteras arquitectonicas explicitas: dominio OPM, comandos de aplicacion, store, render JointJS, UI, persistencia, OPL, validacion y pruebas. El objetivo es reducir acoplamiento, mejorar trazabilidad HU-codigo-test y permitir que nuevas funcionalidades entren sin aumentar el tamano efectivo del `OpmStore` ni mezclar responsabilidades.

El resultado esperado no es una arquitectura academica. Es una base de producto mas facil de cambiar, probar y auditar, conservando comportamiento observable.

## 2. Lenguaje Normativo

En este documento:

- **DEBE** indica una regla obligatoria.
- **NO DEBE** indica una prohibicion.
- **PUEDE** indica una opcion permitida.
- **DEBERIA** indica una preferencia fuerte, salvo evidencia contraria.
- **Corte** indica una unidad atomica de trabajo validable y reversible.
- **Bisimulacion** indica que el comportamiento observable antes y despues del refactor permanece equivalente bajo tests, fixtures y smokes definidos.

## 3. Anclaje Estructural

Este plan usa una lectura categorica debil y operacional:

- `urn:fxsl:kb:icas-procesos`: el diseno es factorizacion de `Needs -> Architecture -> Capabilities`; la implementacion debe ser un funtor de realizacion que preserve distinciones relevantes.
- `urn:fxsl:kb:icas-patrones`: un "God Object" es una falla de factorizacion; la solucion es descomponerlo en objetos con responsabilidad acotada y composicion explicita.
- `urn:fxsl:kb:icas-escala`: la composicion a escala requiere interfaces compartidas y fronteras declaradas.
- `urn:fxsl:kb:icas-efectos`: un refactor correcto preserva comportamiento observable mediante bisimulacion.
- `urn:fxsl:kb:icas-lifecycle`: el drift aparece cuando la evolucion rompe naturalidad entre diseno, implementacion y pruebas.

Estas URN no introducen nueva funcionalidad. Solo justifican la forma del plan.

## 4. Estado Inicial Que Este Plan Asume

Este plan parte de los siguientes hechos observados en el repo:

- `app/src` tiene aproximadamente 450 archivos TS/TSX y 83k lineas.
- `ui` concentra aproximadamente 26k lineas.
- `modelo` concentra aproximadamente 18.7k lineas.
- `render` concentra aproximadamente 11k lineas.
- `store` concentra aproximadamente 10.5k lineas.
- `OpmStore` expone mas de 400 claves entre estado y acciones.
- Existen 30 specs E2E y una suite unitaria amplia.
- El baseline HU documentado indica al menos 313 HU cubiertas o probadas por overlay LLM minimo y 435 HU activas no cubiertas.
- El modelo OPM, OPL, serializacion y render JointJS ya tienen una base funcional suficiente para exigir preservacion, no reescritura.

## 5. Objetivos

La refactorizacion DEBE lograr:

1. Reducir el acoplamiento directo entre UI/render y `OpmStore`.
2. Convertir capacidades de aplicacion en puertos explicitos y testeables.
3. Mantener `modelo/` como nucleo semantico OPM puro, sin dependencia de UI, JointJS ni Zustand.
4. Mantener JointJS como adapter de render/interaccion, no como dueño de reglas de dominio.
5. Separar view-models de componentes visuales cuando una pantalla consuma multiples selectores/acciones.
6. Mantener persistencia como adapter de infraestructura, no como regla de modelado.
7. Permitir pruebas por frontera: dominio, aplicacion, render, UI, persistencia y smokes.
8. Preservar el comportamiento observable existente.
9. Mejorar la trazabilidad HU -> codigo -> test -> reporte.
10. Hacer que nuevos cortes de HU entren por la frontera correcta.

## 6. No Objetivos

La refactorizacion NO DEBE:

1. Reescribir la aplicacion desde cero.
2. Cambiar Preact.
3. Cambiar Zustand por otro state manager.
4. Cambiar JointJS OSS.
5. Cambiar Bun/Vite como toolchain.
6. Cambiar semantica OPM.
7. Cambiar el formato JSON exportado sin migracion explicita.
8. Redibujar assets canonicos de OPCloud.
9. Introducir backend, auth, colaboracion real o almacenamiento remoto.
10. Usar la refactorizacion para agregar funcionalidades nuevas.
11. Mezclar cambios visuales de gusto con cortes de arquitectura.
12. Hacer commits masivos donde no sea claro que comportamiento se preservo.

## 7. Principios Rectores

### 7.1 Preservacion Primero

Todo corte DEBE poder explicarse como:

```text
antes: comportamiento observable A
despues: comportamiento observable A'
criterio: A y A' son equivalentes bajo tests/smokes/fixtures definidos
```

Si el corte cambia comportamiento, deja de ser refactor y DEBE declararse feature/fix.

### 7.2 Fronteras Antes Que Estilo

El plan NO DEBE perseguir limpieza estetica. Cada movimiento de archivos DEBE reducir una dependencia real, aislar una responsabilidad o habilitar una prueba mas local.

### 7.3 Compatibilidad Temporal

El `OpmStore` PUEDE seguir existiendo como fachada mientras se extraen puertos. La meta no es borrar Zustand; la meta es que UI y render dependan de interfaces mas pequeñas.

### 7.4 Capa De Dominio Intocable

`app/src/modelo`, `app/src/opl`, `app/src/serializacion` y sus tests DEBEN ser tratados como nucleo semantico. Pueden reorganizarse internamente, pero NO DEBEN importar UI, store, JointJS ni persistencia local.

### 7.5 Cortes Atomicos

Cada corte DEBE terminar en:

- typecheck verde;
- tests relevantes verdes;
- build o smoke cuando toque UI/render;
- diff revisable;
- descripcion clara de invariantes preservados.

## 8. Arquitectura Objetivo

La arquitectura objetivo se organiza en ocho estratos.

```text
HU / Flujos de usuario
  -> ViewModels UI
    -> Puertos de aplicacion
      -> Nucleo OPM / OPL / Validacion / Serializacion
      -> Adapters de infraestructura
    -> Adapter de render JointJS
  -> Componentes Preact
```

### 8.1 Nucleo OPM

Responsabilidad:

- tipos OPM;
- operaciones puras;
- validaciones;
- invariantes de estados/enlaces/refinamientos;
- serializacion semantica;
- generacion/parseo OPL.

Rutas principales:

- `app/src/modelo/`
- `app/src/opl/`
- `app/src/serializacion/`
- `app/src/leyes/`

Reglas:

- DEBE ser testeable sin DOM.
- DEBE evitar dependencias a `store`, `ui`, `render`, `persistencia`.
- PUEDE depender de helpers puros de `canvas` solo si se formaliza el boundary.

### 8.2 Capa De Aplicacion

Responsabilidad:

- casos de uso;
- orquestacion de comandos;
- transacciones de estado;
- coordinacion entre dominio, persistencia, OPL, render y UI.

Rutas objetivo:

- `app/src/app/commands/`
- `app/src/app/ports/`
- `app/src/app/viewmodels/`

Esta ruta no existe hoy. DEBE introducirse incrementalmente, sin mover todo de una vez.

### 8.3 Store

Responsabilidad:

- estado observable de la sesion;
- integracion con Zustand;
- snapshot/historial;
- fachada temporal de acciones existentes.

Reglas:

- `OpmStore` NO DEBE seguir creciendo indefinidamente.
- Nuevas capacidades DEBERIAN entrar primero como puerto o view-model.
- Las slices DEBEN representar capacidades, no solo archivos mas pequenos.
- Las acciones complejas DEBERIAN delegar a comandos puros o servicios de aplicacion.

### 8.4 UI

Responsabilidad:

- componentes Preact;
- accesibilidad;
- layout;
- gestos;
- rendering de estado ya preparado.

Reglas:

- Componentes grandes NO DEBEN conocer operaciones de dominio profundas.
- Un componente que consuma mas de 8 selectores/acciones del store DEBERIA tener view-model.
- Dialogos y paneles DEBERIAN recibir comandos pequeños y datos derivados.
- UI NO DEBE importar `render/jointjs` salvo adaptadores de integracion muy acotados.

### 8.5 Render JointJS

Responsabilidad:

- proyeccion de modelo a JointJS cells;
- handlers de interaccion canvas;
- medicion/geometry adapter;
- eventos de canvas.

Reglas:

- `JointCanvas` DEBE tender a ser adapter, no orquestador de aplicacion.
- Render NO DEBE mutar modelo directamente.
- Render DEBE emitir eventos/commands hacia capa de aplicacion o store-fachada.
- Proyeccion pura DEBE permanecer testeable sin DOM.

### 8.6 Persistencia

Responsabilidad:

- local storage;
- workspace local;
- versiones;
- autosalvado;
- import/export fisico.

Reglas:

- Persistencia NO DEBE decidir semantica OPM.
- Persistencia DEBE validar/hidratar via `serializacion`.
- Persistencia DEBE exponer errores tipados o resultados, no strings como unico contrato interno.

### 8.7 Validacion Y Diagnostico

Responsabilidad:

- reglas metodologicas;
- avisos accionables;
- citas SSOT;
- panel diagnostico;
- badges inline.

Reglas:

- Checkers DEBEN vivir fuera de UI.
- UI DEBE representar avisos, no calcularlos de forma ad hoc.
- Cada regla nueva DEBE tener test unitario y, si es visible, smoke o test de UI.

### 8.8 Pruebas Y Evidencia

Responsabilidad:

- equivalencia observable;
- cobertura HU;
- smoke browser;
- reportes de avance.

Reglas:

- Todo corte de refactor DEBE nombrar que pruebas lo protegen.
- Si una frontera nueva aparece, DEBE tener al menos un test local.
- Si una regla HU queda subreportada por el dashboard, DEBE registrarse o corregirse en el auditor.

## 9. Matriz De Dependencias Permitidas

| Desde | Puede depender de | No debe depender de |
|---|---|---|
| `modelo` | tipos/helpers puros internos | `ui`, `store`, `render`, `persistencia` |
| `opl` | `modelo` | `ui`, `store`, `render` |
| `serializacion` | `modelo` | `ui`, `store`, `render` |
| `persistencia` | `serializacion`, tipos de `modelo` | `ui`, `render` |
| `render/jointjs` | `modelo`, helpers puros, puertos/callbacks | `ui` salvo wrappers, persistencia |
| `ui` | view-models, store-fachada, tipos de modelo | operaciones profundas dispersas |
| `store` | dominio, aplicacion, persistencia, render adapter acotado | componentes UI |
| `app/commands` | dominio, puertos | Preact, DOM, JointJS directo salvo puerto |
| `app/viewmodels` | store-fachada, selectors, comandos | mutacion de dominio directa |

Toda excepcion DEBE justificarse en el commit.

## 10. Puertos Objetivo

Los puertos son contratos internos. Pueden implementarse primero como wrappers sobre el store existente.

### 10.1 `ModelCommandPort`

Comandos de modelado:

- crear cosa;
- crear enlace;
- mover/redimensionar;
- descomponer/desplegar;
- editar metadata;
- editar estados;
- editar refinamientos.

### 10.2 `SelectionPort`

Comandos y queries de seleccion:

- seleccionar entidad/enlace/estado;
- seleccion multiple;
- halos temporales;
- portapapeles visual.

### 10.3 `OplPort`

Contrato OPL:

- generar OPL actual;
- filtrar por seleccion;
- editar OPL inverso;
- copiar/exportar OPL.

### 10.4 `ProjectionPort`

Contrato render:

- proyectar OPD a cells;
- proyectar mapa;
- producir eventos de interaccion;
- resolver foco visual.

### 10.5 `PersistencePort`

Contrato persistencia:

- guardar;
- cargar;
- importar/exportar;
- autosalvar;
- versiones.

### 10.6 `WorkspacePort`

Contrato workspace:

- carpetas;
- mover/cortar/pegar;
- archivado;
- busqueda global.

### 10.7 `DiagnosticsPort`

Contrato diagnostico:

- calcular avisos;
- navegar a aviso;
- exponer severidad/cita/accion sugerida.

### 10.8 `SimulationPort`

Contrato simulacion:

- iniciar/detener modo simulacion;
- evaluar pasos;
- representar timeline.

## 11. Estrategia De Ejecucion Por Cortes

### Corte 0 - Congelar Baseline De Comportamiento

Objetivo:

- Crear el punto de comparacion antes de mover fronteras.

Acciones permitidas:

- Ejecutar suite actual.
- Registrar comandos y resultados.
- Identificar fixtures criticos: Cafetera, HODOM, modelos densos, estados, enlaces avanzados.
- Actualizar reportes HU si corresponde.

No permitido:

- Mover codigo.
- Cambiar UI.
- Cambiar reglas de dominio.

Gate:

```bash
cd app && bun run typecheck
cd app && bun run test
cd app && bun run build
cd app && bun run browser:smoke
```

Si el costo es excesivo, se permite una matriz reducida por corte, pero el baseline completo DEBE existir al inicio de la ronda.

### Corte 1 - ViewModels Para Superficies Grandes

Objetivo:

- Reducir UI -> store directo.

Primeras superficies:

- `TablaEnlaces`
- `JointCanvas`
- `App`
- `PanelOpl`
- `InspectorEntidad`
- `InspectorEnlace`

Acciones permitidas:

- Crear `app/src/app/viewmodels/`.
- Extraer selectors y comandos agregados.
- Mantener comportamiento visual.
- Mantener data-testid existentes.

No permitido:

- Cambiar layout salvo ajustes necesarios por compilacion.
- Cambiar textos visibles.
- Cambiar semantica de acciones.

Gate minimo:

```bash
cd app && bun run typecheck
cd app && bun test src/store.test.ts
cd app && bun run browser:smoke -- e2e/11-beta1-tabla-enlaces.spec.ts
```

Gate adicional si toca canvas:

```bash
cd app && bun test src/render/jointjs/proyeccion.test.ts
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/05-refinamiento-y-plegado.spec.ts
```

### Corte 2 - Puertos De Aplicacion Sobre Store Existente

Objetivo:

- Introducir interfaces pequeñas sin sustituir Zustand.

Acciones permitidas:

- Crear `app/src/app/ports/`.
- Crear adaptadores `zustand*Adapter`.
- Hacer que view-models dependan de puertos, no del store completo.
- Mantener export `useOpmStore` para compatibilidad temporal.

No permitido:

- Duplicar estado.
- Crear segundo store global.
- Crear framework de dependency injection pesado.

Gate:

```bash
cd app && bun run typecheck
cd app && bun run test
```

### Corte 3 - JointJS Como Adapter

Objetivo:

- Separar render puro, handlers y comandos de aplicacion.

Acciones permitidas:

- Extraer handlers de `JointCanvas` hacia modulos por intencion.
- Introducir un `CanvasInteractionPort`.
- Mantener `proyectarModeloAJointCells` puro.
- Mantener metadata OPM en cells para tests existentes.

No permitido:

- Cambiar libreria JointJS.
- Cambiar geometria canonica sin evidencia OPCloud/JOYAS.
- Reescribir proyeccion desde cero.

Gate:

```bash
cd app && bun test src/render/jointjs/proyeccion.test.ts src/render/jointjs/composers/halos.test.ts
cd app && bun run browser:smoke -- e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts
```

### Corte 4 - Persistencia Y Workspace Como Infraestructura

Objetivo:

- Separar persistencia local de comandos de modelado.

Acciones permitidas:

- Introducir `PersistencePort` y `WorkspacePort`.
- Tipar resultados de errores.
- Mover busqueda global/workspace fuera de slices monoliticas si el contrato queda claro.

No permitido:

- Cambiar formato exportado.
- Cambiar localStorage keys sin migracion.
- Introducir backend.

Gate:

```bash
cd app && bun test src/persistencia src/serializacion
cd app && bun run browser:smoke -- e2e/06-undo-redo-dirty.spec.ts e2e/01-carga-y-workspace.spec.ts
```

### Corte 5 - OPL Y Diagnostico Como Capacidades

Objetivo:

- Hacer que OPL y diagnostico sean servicios claros, no funciones dispersas entre UI/store.

Acciones permitidas:

- Introducir `OplPort` y `DiagnosticsPort`.
- Consolidar generacion, filtros, edicion inversa y citas.
- Mantener paneles UI como consumidores.

No permitido:

- Cambiar frases OPL sin tests.
- Cambiar severidades/citas sin revisar SSOT.

Gate:

```bash
cd app && bun test src/opl src/modelo/checkers.test.ts src/modelo/validaciones.test.ts
cd app && bun run browser:smoke -- e2e/03-opl-panel.spec.ts e2e/11-beta1-validacion-metodologica.spec.ts
```

### Corte 6 - Store Por Capacidades Reales

Objetivo:

- Reducir el contrato efectivo de `OpmStore`.

Acciones permitidas:

- Reagrupar slices por capacidades.
- Mantener compatibilidad mediante fachada.
- Deprecar acciones duplicadas o alias obsoletos.
- Crear tests de contract para slices.

No permitido:

- Eliminar compatibilidad usada por UI sin corte previo.
- Mezclar esta etapa con cambios de comportamiento.

Gate:

```bash
cd app && bun run typecheck
cd app && bun run test
cd app && bun run browser:smoke
```

### Corte 7 - Limpieza De Compatibilidad Temporal

Objetivo:

- Quitar wrappers, aliases y compat detectors que ya no sean necesarios.

Acciones permitidas:

- Eliminar codigo muerto probado.
- Actualizar imports.
- Actualizar auditor HU si dependia de tokens obsoletos.

No permitido:

- Quitar `data-testid` usados por smokes sin reemplazo.
- Quitar compatibilidad que aun use un corte no migrado.

Gate:

```bash
cd app && bun run typecheck
cd app && bun run test
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
```

### Corte 8 - Consistencia Transversal Y Cierre De Drift

Objetivo:

- Auditar y remediar inconsistencias creadas por la ejecucion acumulada de los
  cortes 0-7, sin abrir funcionalidad nueva.

Acciones permitidas:

- Corregir reportes, ledgers y handoff cuando contradigan el estado real del
  repo.
- Separar reglas HU acopladas artificialmente si subreportan o sobrereportan
  evidencia.
- Mover helpers o tests a la frontera arquitectonica ya definida cuando hayan
  quedado exportados por compatibilidad accidental.
- Registrar deuda residual medida cuando el fix real requiera un corte propio.

No permitido:

- Implementar HU pendientes para "hacer cuadrar" el dashboard.
- Cambiar comportamiento visible salvo fixes locales necesarios para estabilizar
  gates.
- Reescribir fronteras completas fuera de la inconsistencia observada.
- Borrar compatibilidad de datos legacy cubierta por serializacion o fixtures.

Gate:

```bash
cd app && bun run typecheck
cd app && bun run test
cd app && bun run build
cd app && bun run browser:smoke
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real
cd app && bun run scripts/quality-ledger.mjs --markdown
```

### Corte 9 - Cascadas De Efectos Y Fronteras Residuales

Objetivo:

- Cerrar efectos secundarios acumulados por los cortes 0-8 cuando ya existe
  evidencia concreta de drift entre arquitectura, tooling, reportes y runtime.

Acciones permitidas:

- Convertir metricas informativas en gates reproducibles cuando ya exista un
  baseline medido.
- Corregir reglas HU que quedaron apuntando a superficies movidas durante la
  refactorizacion.
- Mover dependencias productivas sobre hooks globales de debug hacia puertos o
  contextos explicitos.
- Reducir acoplamiento directo a `OpmStore` solo en puertos hoja o comandos con
  blast radius bajo y contrato verificable.
- Registrar deuda residual cuando la correccion real implique rediseñar una
  frontera completa.

No permitido:

- Implementar HU nuevas para recuperar metricas.
- Migrar masivamente todos los puertos tipados contra `OpmStore`.
- Eliminar el hook global de debug JointJS si aun lo usan las sondas in-vivo.
- Reescribir render/UI completo o mover overlays sin pruebas visuales dedicadas.

Gate:

```bash
cd app && bun run gate:refactor
```

## 12. Definicion De Hecho

Un corte esta hecho solo si cumple:

1. El diff es menor que el alcance declarado.
2. No agrega funcionalidad no solicitada.
3. No cambia texto/UI salvo que el corte lo declare.
4. Los tests relevantes pasan.
5. TypeScript pasa.
6. No introduce dependencia prohibida.
7. Se puede revertir el commit sin romper commits anteriores.
8. La descripcion del commit nombra la frontera refactorizada.
9. Si el corte mueve evidencia HU, los reportes se regeneran o se documenta por que no.

## 13. Politica De Commits

Cada commit DEBE ser atomico y semantico.

Formatos preferidos:

```text
refactor(ui): extrae viewmodel de tabla de enlaces
refactor(app): introduce puerto de comandos de modelo
refactor(render): aisla handlers jointjs de comandos canvas
refactor(persistencia): separa workspace port de slice global
test(refactor): fija contrato de proyeccion canvas
docs(refactor): registra baseline de fronteras
```

No se permite:

```text
refactor: cleanup
wip
big refactor
varios cambios
```

## 14. Politica De Rollback

Todo corte DEBE poder revertirse por commit.

Si un corte falla:

1. No se encadenan nuevos cortes encima.
2. Se identifica si falla compilacion, test, smoke o semantica.
3. Si el fix supera el alcance del corte, se revierte.
4. Si el fix es local y mantiene alcance, se corrige dentro del mismo corte.

## 15. Riesgos Y Controles

| Riesgo | Control |
|---|---|
| Reescritura accidental | No objetivos y cortes atomicos |
| Cambio visual no intencional | Smokes + capturas cuando toque UI |
| Perdida de semantica OPM | Tests de `modelo`, `opl`, `serializacion`, SSOT |
| Acoplamiento nuevo bajo otro nombre | Matriz de dependencias y puertos |
| Store duplicado | Prohibicion de segundo store global |
| JointJS absorbe dominio | Render como adapter, proyeccion pura |
| Persistencia decide reglas | Persistencia solo hidrata/guarda |
| HU subreportadas | Actualizar dashboard o baseline LLM |
| Cortes demasiado grandes | Commits por frontera, no por carpeta completa |

## 16. Indicadores De Avance

El avance de esta refactorizacion se mide por:

- reduccion de imports UI -> store directo;
- reduccion de selectores por componente grande;
- numero de puertos introducidos y usados;
- numero de acciones del store deprecadas o encapsuladas;
- ausencia de ciclos nuevos;
- tests locales por frontera;
- smokes sin regresion;
- dashboard HU sin perdida no explicada.

No se mide por:

- lineas movidas;
- numero de carpetas nuevas;
- porcentaje de codigo "limpio";
- desaparicion inmediata del store global.

## 17. Orden Recomendado De Ejecucion

Orden normativo:

1. Baseline completo.
2. `TablaEnlaces` view-model.
3. `PanelOpl` view-model.
4. `JointCanvas` interaction adapter.
5. `App` modal orchestration view-model.
6. Puertos de aplicacion usados por esas superficies.
7. Persistencia/workspace ports.
8. Diagnostico/OPL ports.
9. Reagrupacion final del store.
10. Limpieza de compatibilidad.

La razon de este orden es que empieza donde el retorno es alto y el riesgo es acotado: UI/store boundary. Luego ataca render, persistencia y store interno.

## 18. Prohibiciones Especificas

Durante esta refactorizacion:

- NO mover `opm-extracted/`.
- NO editar `decompiled/`.
- NO versionar `app/dist/` ni `app/test-results/`.
- NO reemplazar assets SVG canonicos.
- NO agregar dependencias sin ADR breve.
- NO crear `architecture/clean/` paralelo sin consumidores reales.
- NO crear abstracciones que solo envuelvan un metodo y no reduzcan acoplamiento.
- NO introducir nombres genericos como `Manager`, `Service`, `Handler` sin dominio claro.
- NO debilitar tests para hacer pasar el refactor.

## 19. ADR Minimo Para Excepciones

Toda excepcion a este plan DEBE registrarse como bloque breve en el PR/commit o en un documento de roadmap:

```text
Decision:
Contexto:
Regla exceptuada:
Alternativas consideradas:
Riesgo:
Rollback:
Validacion:
```

No se requiere ceremonia mayor para excepciones pequeñas, pero si trazabilidad.

## 20. Cierre Normativo

La refactorizacion total termina cuando:

1. Las superficies UI grandes dependen de view-models o puertos pequeños.
2. JointJS funciona como adapter de render/interaccion.
3. Persistencia y workspace quedan detras de puertos.
4. OPL y diagnostico quedan como capacidades separadas.
5. `OpmStore` sigue existiendo solo como composicion/fachada o se reduce a capacidades claras.
6. No hay nuevas dependencias prohibidas.
7. La suite relevante pasa.
8. El dashboard HU no muestra regresiones no explicadas.
9. `docs/HANDOFF.md` resume la nueva arquitectura operativa.

Este documento no exige perfeccion. Exige que cada proximo cambio reduzca acoplamiento real, preserve comportamiento y deje el sistema mas facil de modificar que antes.
