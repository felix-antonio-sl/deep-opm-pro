# Plan Normativo UX/UI Del Modelador OPM

**Fecha:** 2026-05-20  
**Estado:** activo  
**Alcance:** experiencia de uso y superficie visual de `app/` para modelado OPM.  
**No alcance:** nuevas HU funcionales, cambio de JointJS, rediseño de marca, cambio de semantica OPM.

## 1. Proposito

La refactorizacion de dominio y enlaces dejo una semantica mas rigurosa que la UI debe volver operable. Este plan gobierna los cortes UX/UI para que el modelador sea una herramienta de modelado, no solo una proyeccion visual del store.

El objetivo es que cada regla importante del modelo tenga una affordance visible, cada operacion frecuente tenga un camino corto y cada error metodologico sea prevenido o explicado en contexto.

## 2. Principios

1. La UI DEBE hablar el lenguaje del modelador: objeto, proceso, estado, enlace, ancla, fan, OPD, OPL.
2. La UI DEBE permitir reconocer antes de recordar: si una accion es valida, debe aparecer cerca del lugar donde se decide.
3. La UI NO DEBE duplicar semantica OPM. Debe consumir view-models, puertos o selectores puros y emitir comandos.
4. La UI DEBE prevenir errores cuando la semantica ya sabe que una accion no aplica.
5. La UI DEBE preservar densidad operativa: sin landing, sin cards decorativas, sin texto instructivo permanente que no ejecute nada.
6. Todo corte visible DEBE tener smoke focal o prueba de UI cuando el flujo sea critico.

## 3. Corte 1 - Fans Y Anclaje Como Accion Contextual

### Problema

Despues del refactor de enlaces exactos, el inspector mostraba `Sin fan exacto` aunque existieran ramas compatibles. La operacion era semantica pero no descubrible.

### Regla

Cuando un enlace procedural seleccionado pueda formar un fan por extremo comun, el inspector DEBE mostrar una accion contextual `Crear fan`. La accion DEBE alinear las ramas en un puerto comun y formar el abanico mediante comando de aplicacion.

### Gate

- Unit: candidatos de fan posible.
- Store: creacion manual del fan con ancla compartida.
- E2E: seleccionar una rama compatible, ver `Fan posible`, ejecutar `Crear fan`, comprobar `Fan O` y puerto comun.

## 4. Corte 2 - Inspector Como Superficie De Tarea

### Problema

El inspector aun mezcla descripcion, edicion y acciones avanzadas con jerarquia irregular.

### Regla

Cada tab del inspector DEBE tener una intencion unica:

- `Propiedades`: atributos del enlace o entidad.
- `Extremos`: conectividad, anclas, fan, reanclaje.
- `Estilo`: apariencia no semantica.

Las acciones destructivas o estructurales DEBEN estar separadas visualmente de ediciones reversibles.

### Gate

- Snapshot DOM o smoke que asegure orden, labels y controles criticos.
- WCAG basico: foco visible, labels y botones con nombre accesible.

## 5. Corte 3 - Canvas Con Affordances De Modelado

### Problema

El canvas puede obedecer reglas OPM, pero algunas operaciones no muestran por adelantado por que un destino es valido, invalido o formara fan.

### Regla

Durante creacion, reanclaje y movimiento de enlaces, la UI DEBE mostrar feedback en el punto de accion:

- destino valido/invalido;
- extremo origen/destino;
- ancla exacta prevista;
- posibilidad de fan cuando el extremo comun es compatible.

### Gate

- Smoke focal de creacion de enlace y reanclaje sin crash.
- Validacion de que los overlays no tapan markers ni extremos.

## 6. Corte 4 - Feedback Metodologico En Contexto

### Problema

Los diagnosticos existen, pero pueden llegar tarde o lejos de la accion.

### Regla

Todo aviso metodologico accionable DEBE tener al menos una de estas salidas:

- badge anclado en canvas;
- mensaje contextual en inspector;
- accion correctiva directa cuando sea reversible y segura.

### Gate

- Tests de view-model/selector para mapear aviso a superficie visible.
- Smoke focal de un aviso navegable.

## 7. Corte 5 - Produccion Single-User Pulida

### Problema

Para primera version productiva, la experiencia debe ser consistente entre abrir, modelar, guardar, exportar SVG y reportar bugs.

### Regla

Las funciones de carga/importacion/ejemplos DEBEN sentirse como una sola entrada de trabajo. Export SVG NO DEBE incluir chrome UI. Captura de bugs DEBE conservar contexto operativo sin interrumpir el modelado.

### Gate

- `browser:smoke`.
- Smoke focal de abrir ejemplo, editar, guardar local, exportar SVG.
- Verificacion de deploy en `https://opforja.sanixai.com/`.

## 8. Gates Globales

Antes de cerrar un corte UX/UI:

```bash
cd app && bun run check
cd app && bun run lint
cd app && bun run build
cd app && bun run browser:smoke
```

Si el corte toca solo documentacion, basta verificar estado git. Si toca flujo visual, debe existir al menos una prueba focal que reproduzca el recorrido del usuario.

## 9. Politica De Commits

Los commits DEBEN ser atomicos por corte UX/UI. Cada commit DEBE indicar si cambia:

- flujo visible;
- contrato de UI;
- view-model/puerto;
- prueba focal;
- documentacion operativa.

## 10. Pendientes Priorizados

1. Completar Corte 1 y desplegar.
2. Auditar `InspectorEnlace` y `InspectorEntidad` como superficies de tarea.
3. Revisar feedback de creacion/reanclaje en canvas.
4. Unificar estados vacios, mensajes y acciones correctivas.
5. Ejecutar smoke productivo de abrir/editar/exportar/reportar bug.
