# Plan Normativo De Frontera Render/UI

**Fecha:** 2026-05-18  
**Repo:** `deep-opm-pro`  
**Alcance:** frontera entre `app/src/render/jointjs/` y UI Preact asociada al canvas.  
**Estado:** Corte 1 cerrado; Corte 2 pendiente. No es Corte 11 automatico ni extension implicita de la refactorizacion total.  
**Autoridad superior:** `AGENTS.md`, `docs/HANDOFF.md`, `docs/JOYAS.md`, `opm-extracted/`, SSOT OPM local y HU vivas.

## 1. Objetivo

Separar la responsabilidad de render/interaccion JointJS de la responsabilidad de chrome UI del canvas, preservando comportamiento observable y sin introducir funcionalidades nuevas.

El resultado esperado es que `JointCanvas` actue como integrador de renderer y puertos de canvas, pero no como propietario directo de controles UI concretos ni de sincronizacion de feedback que pertenezca a la capa de aplicacion/UI.

Este plan existe para cerrar una deuda residual medida: `JointCanvas` todavia renderiza chrome UI concreto (`MenuTipoEnlace`, `RenombradoInline`) y, al inicio del plan, sincronizaba feedback desde render. La deuda debe resolverse como corte focalizado de frontera render/UI, no como limpieza general ni como continuacion automatica de cortes previos.

## 2. Lenguaje Normativo

En este documento:

- **DEBE** indica regla obligatoria.
- **NO DEBE** indica prohibicion.
- **PUEDE** indica opcion permitida.
- **DEBERIA** indica preferencia fuerte salvo evidencia contraria.
- **Corte** indica unidad atomica validable, reversible y con gates explicitos.
- **Chrome UI del canvas** indica controles Preact superpuestos o asociados al canvas que no son primitives JointJS: menus, renombrado inline, overlays de feedback y slots visuales.

## 3. Alcance

El plan cubre exclusivamente:

- frontera de feedback entre render JointJS, aplicacion y UI;
- slots de chrome UI montados alrededor de `JointCanvas`;
- desacoplamiento de `MenuTipoEnlace` y `RenombradoInline` desde el renderer;
- contratos minimos para que el canvas publique intencion, posicion y seleccion sin conocer componentes concretos;
- smokes focales de canvas, validacion y tabla de enlaces.

Los cambios DEBEN mantenerse dentro de la frontera necesaria de `app/` y pruebas asociadas. Cualquier actualizacion documental posterior debe justificarse por evidencia real del corte, no por este plan.

## 4. No Objetivos

Este plan NO DEBE:

1. Convertirse automaticamente en Corte 11 de `docs/roadmap/refactorizacion-total-plan-normativo.md`.
2. Reescribir `JointCanvas`.
3. Cambiar JointJS OSS, Preact, Zustand, Bun o Vite.
4. Cambiar semantica OPM, OPL, validaciones ni formato JSON exportado.
5. Redibujar markers, iconos, shapes o assets canonicos.
6. Introducir nuevas funcionalidades de link editing, routing, puertos canonicos o reconexion.
7. Mezclar rediseño visual con separacion de responsabilidades.
8. Migrar masivamente puertos type-only acoplados a `OpmStore`.
9. Tocar `decompiled/`, `_local/`, `app/dist/` ni reportes regenerables.
10. Modificar HU vivas salvo que una evidencia ejecutada demuestre drift del detector.

## 5. Estado De Partida

Hechos asumidos desde `docs/HANDOFF.md`:

- La dependencia global de UI sobre `globalThis.__opmJointAdapter` ya quedo cerrada; el global permanece solo como hook de debug/in-vivo.
- `JointCanvas` expone adapter por `CanvasAdapterContext`.
- `JointCanvas` todavia renderiza chrome UI concreto.
- Corte 1 ya saco el adapter concreto de feedback Zustand fuera de `render/jointjs`.
- `gate:refactor` ya protege typecheck, tests, lint, build, smoke browser, dashboard HU vigente y quality ledger.
- La deuda actual es focal: frontera render/UI, no nucleo OPM ni persistencia.

## 6. Principios De Corte

### 6.1 Render No Es UI

`app/src/render/jointjs/` DEBE limitarse a proyeccion, geometry, eventos de canvas, integracion JointJS y adaptadores tecnicos. No debe decidir que componente Preact concreto se monta para un menu o una edicion inline.

### 6.2 UI No Posee Semantica OPM

Los slots UI del canvas PUEDEN renderizar controles y emitir comandos, pero NO DEBEN reimplementar reglas OPM. La validacion debe seguir pasando por puertos, comandos o funciones de dominio existentes.

### 6.3 Feedback Como Puerto

El feedback visible asociado al canvas DEBE viajar por un contrato explicito. El renderer puede publicar eventos tecnicos y estados de interaccion; la UI decide presentacion, timing y chrome.

### 6.4 Bisimulacion Observable

Cada corte DEBE preservar:

- seleccion de entidades y enlaces;
- creacion y edicion de enlaces permitidos;
- rechazo visible de enlaces invalidos;
- renombrado inline existente;
- comportamiento de tabla de enlaces;
- smokes existentes de canvas.

## 7. Cortes Propuestos

### Corte 1 - Feedback Port

Objetivo:

Extraer la sincronizacion de feedback desde `JointCanvas` hacia un puerto explicito de feedback de canvas.

Alcance permitido:

- Definir un contrato pequeño para feedback de interaccion canvas: tipo, mensaje, severidad, ancla opcional y ciclo de vida.
- Adaptar `JointCanvas` para emitir intenciones o eventos de feedback sin conocer presentacion concreta.
- Mantener el comportamiento visual actual mediante adapter UI equivalente.
- Cubrir rechazos de validacion y estados transitorios relevantes del canvas.

Reglas:

- El contrato NO DEBE depender de tipos internos de JointJS salvo adaptadores tecnicos acotados.
- El puerto NO DEBE importar Zustand completo si basta una interfaz minima.
- El corte NO DEBE cambiar textos, severidades ni timing observable salvo correccion documentada.

Gate minimo:

```bash
cd app && bun run gate:refactor
```

Smokes focales:

- canvas: seleccion, drag y edicion basica siguen operativos;
- validacion: intento invalido muestra feedback y no muta modelo;
- tabla enlaces: estado visible de enlaces no pierde sincronizacion despues de feedback.

Estado:

- Cerrado el 2026-05-18.
- `render/jointjs` ya no importa `zustandFeedbackPort` ni
  `useZustandFeedbackOverlays`; `JointCanvas` recibe `feedbackPort` y overlays
  por props.
- `app/src/ui/JointCanvasFeedbackBoundary.tsx` aloja el adapter Zustand y
  mantiene el comportamiento visual equivalente.
- `app/src/render/jointjs/renderUiBoundary.test.ts` blinda esta frontera.

Validacion ejecutada:

```bash
cd app && bun test src/store/feedback.test.ts src/render/jointjs/overlayCanvas/avisos.test.ts src/render/jointjs/overlayCanvas/hoverTooltipContent.test.ts src/app/ports/diagnosticsPort.test.ts src/app/ports/canvasInteractionPort.test.ts src/render/jointjs/jointCanvasAdapter.test.ts src/render/jointjs/renderUiBoundary.test.ts
cd app && bunx playwright test e2e/11-beta1-validacion-metodologica.spec.ts e2e/02-canvas-y-render.spec.ts e2e/11-beta1-tabla-enlaces.spec.ts --grep "panel metodologia|ErrorBadge inline|HoverTooltip|ciclo de feedback|renderiza todos los markers|renderiza modificadores|arrastra una cosa JointJS|lista, filtra|resalta filas filtradas|resalta extremo de estado|edicion de etiqueta"
cd app && bun run gate:refactor
```

### Corte 2 - Chrome UI Slots

Objetivo:

Mover `MenuTipoEnlace` y `RenombradoInline` fuera del ownership directo de `JointCanvas`, conservando su montaje funcional mediante slots de chrome UI del canvas.

Alcance permitido:

- Definir slots o render props para chrome UI asociado al canvas.
- Hacer que `JointCanvas` publique estado suficiente: seleccion, coordenadas/ancla, modo de interaccion y callbacks minimos.
- Montar `MenuTipoEnlace` y `RenombradoInline` desde una capa UI contenedora o adapter de chrome.
- Mantener accesibilidad, foco, escape/cancelacion y commit existentes.

Reglas:

- `JointCanvas` NO DEBE importar directamente `MenuTipoEnlace` ni `RenombradoInline` al cierre del corte.
- Los slots NO DEBEN convertirse en un bus generico sin contrato; deben nombrar capacidades reales.
- Los componentes UI NO DEBEN leer estructuras internas de JointJS.
- El corte NO DEBE modificar reglas de creacion de enlaces ni reglas de renombrado.

Gate minimo:

```bash
cd app && bun run gate:refactor
```

Smokes focales:

- canvas: menu de tipo de enlace aparece en el ancla correcta y permite operacion existente;
- validacion: enlace invalido sigue rechazado con feedback visible;
- tabla enlaces: renombrado de etiqueta/enlace se refleja sin snapshot stale.

## 8. Deudas Diferidas

Quedan fuera de este plan:

- puertos canonicos invisibles por perimetro;
- reanclaje/reconexion validado por firmas OPM;
- routing manhattan OPCloud-like completo;
- bus estructural de agregacion compartido multi-refinador;
- propiedades avanzadas de enlaces;
- migracion masiva de puertos type-only acoplados a `OpmStore`;
- rediseño visual del canvas;
- posicion lateral de `HU-50.004`;
- cambios al dashboard HU no exigidos por evidencia nueva.

Estas deudas DEBEN tener plan propio si se abordan. No deben entrar como oportunismo dentro de la frontera render/UI.

## 9. Gates De Cierre

Cada corte de este plan DEBE cerrar con:

```bash
cd app && bun run gate:refactor
```

Ademas, el operador DEBE ejecutar o verificar smokes focales sobre:

- canvas;
- validacion;
- tabla de enlaces.

El cierre DEBE registrar evidencia concreta de que:

- no se amplio el ownership de `JointCanvas`;
- no se agrego dependencia de UI concreta dentro de `render/jointjs`;
- no se degradaron validaciones OPM;
- no se modificaron assets canonicos;
- no se actualizaron reportes regenerables sin necesidad.

## 10. Criterio De Exito

El plan se considera completado cuando:

1. El feedback del canvas viaja por contrato explicito.
2. `MenuTipoEnlace` y `RenombradoInline` se montan como chrome UI por slots o contenedor equivalente.
3. `JointCanvas` conserva integracion JointJS sin poseer UI concreta.
4. `bun run gate:refactor` pasa.
5. Los smokes focales de canvas, validacion y tabla de enlaces pasan o quedan documentados con falla preexistente no atribuible al corte.

El resultado correcto es menos acoplamiento y mismo comportamiento observable. Cualquier mejora funcional debe esperar otro plan.
