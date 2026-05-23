# Estados como ciudadanos de primera clase — Diseño

**Fecha**: 2026-05-23
**Estado**: Diseño aprobado (tras brainstorming dialéctico + arbitraje polymath bajo cat-thinking). Listo para implementar.
**Autoría conceptual**: arbitraje polymath sobre `urn:fxsl:kb:icas-universales`, `urn:fxsl:kb:icas-preservacion` y `urn:fxsl:kb:icas-comparacion`.
**Implementación**: ciclo de paralelización en olas (esta semana).
**Anclaje SSOT**: `opm-iso-19450-es.md §3.71 (State)`, `opm-visual-es.md V-4 / V-202`, `opm-opl-es.md D5–D8`.

---

## 1. Contexto del problema

Hoy el modelador trata a las entidades y enlaces como ciudadanos de primera clase de la selección (cada uno con `seleccionId` y `enlaceSeleccionId` exclusivos en el store, halo dedicado, inspector dedicado, menú contextual dedicado, atajos dedicados). Los **estados de objeto** — que la SSOT OPM eleva a primer ciudadano semántico (§3.71) — son ciudadanos de segunda clase de la UX: clic en una cápsula redirige al objeto propietario; no hay halo de estado, inspector lateral de estado, menú contextual de estado, atajos de estado ni multi-selección de estados; sólo viven como rama del inspector de entidad (`SeccionLayoutEstados → SeccionDesignaciones`) y como sub-selectores `stateCapsuleN` durante modo enlace.

La consecuencia operativa: para tareas frecuentes (renombrar 5 estados, designar uno como inicial, eliminar uno, reordenar, etc.) el operador navega seleccionando objetos, abriendo tabs y haciendo clics en sub-secciones del Inspector — un loop con fricción artificial que mata el flujo de modelado.

## 2. Diagnóstico categorial

Una selección rigurosa es un coproducto: `Selección = Entidad + Enlace + Estado + ∅`. Hoy el store la implementa como dos campos paralelos (`seleccionId`, `enlaceSeleccionId`) sin sellar la exclusividad: la equivalencia con el coproducto sólo se cumple por convención (cada caller limpia el otro campo). Es lo que `urn:fxsl:kb:icas-comparacion` llama **equivalencia frágil**: A se comporta como `Entidad + Enlace` en cada caso de uso, pero no es categóricamente equivalente al coproducto. Es A "ya casi" coproducto, no A coproducto.

Para subir Estado a primer ciudadano se evaluaron dos enfoques:

- **Enfoque A — extender lo existente**: añadir `estadoSeleccionId: Id | null` como tercer campo paralelo, replicar la convención de exclusión, naturalizar los componentes (cada uno declara sobre los tres campos). Bajo `urn:fxsl:kb:icas-preservacion` y `urn:fxsl:kb:icas-universales`, A es funtor casi-libre: preserva el shape del store; los componentes/handlers/atajos existentes son extensiones naturales. Riesgo: la equivalencia frágil con el coproducto se mantiene; cualquier futura entidad seleccionable (anotación, marker, OPL fragment, etc.) repite el ritual.
- **Enfoque B — modelar el coproducto explícitamente**: reemplazar los campos por `seleccion: { tipo: "entidad"|"enlace"|"estado", id: Id } | null` (suma tagged). Bajo `urn:fxsl:kb:icas-universales`, B es **la** estructura universal: tipos imposibles desaparecen, el pattern-match exhaustivo en componentes es responsabilidad del compilador, cualquier ciudadano nuevo es un constructor adicional en el sum-type. Costo: refactor amplio (viewmodels, ports, handlers, todos los lugares donde se lee `seleccionId | enlaceSeleccionId`). No descubre nada nuevo del producto.

### Arbitraje

Se elige **A con dos sellos categoriales no negociables** que cierran la brecha de equivalencia frágil sin pagar el costo del refactor amplio antes de tiempo:

1. **Invariante de exclusividad mutua sellado en punto único** (`setSeleccion(kind, id|null)`). Toda mutación de selección pasa por este setter, que limpia atómicamente los otros dos campos. Sin el sello, A no es coproducto — es tres campos en triste vecindad. Con el sello, A es coproducto efectivo a nivel de invariante de runtime.
2. **Trigger explícito hacia B documentado**. Cuando entre el siguiente paquete (descubribilidad: OPL-jump global, Cmd+K, árbol OPD con estado como nodo) — esto es, **el siguiente funtor consumidor de la selección** — se migra a `seleccion: {tipo, id} | null` discriminada **antes** de construir ese funtor. La migración se documenta como deuda categorial en `CLAUDE.md` proyecto y aquí.

A queda como puente coherente, no como respuesta final. La forma final es B; A se gana el derecho a existir mientras el modelo del paquete actual no haya cristalizado más.

## 3. Scope cerrado del paquete

### Incluido

- Tercer campo `estadoSeleccionId: Id | null` en `OpmStore`, paralelo a `seleccionId` y `enlaceSeleccionId`.
- Punto único `setSeleccion(kind, id|null)` que sella la exclusividad mutua.
- Acciones simétricas: `seleccionarEstado`, `agregarEstadoASeleccion`, `toggleSeleccionEstado` (constraint: multi-select sólo dentro del mismo objeto propietario).
- Reescritura de `estadoSeleccionDesdeIds` para discriminar tres tipos (entidad/enlace/estado) y devolver el partial con los tres campos exclusivamente.
- Operación de dominio `reordenarEstado(modelo, estadoId, indiceDestino)` con bounds + retorno `Resultado<Modelo>`.
- Acciones from-selection en `acciones-estados.ts` (`renombrarSeleccionado`, `eliminarSeleccionado`, `designarSeleccionado`, etc.) que leen `estadoSeleccionId` para que atajos y menús contextuales no tengan que pasar el id.
- Multi-batch `designarBatch(ids[], designacion)` para aplicar designación a varios estados a la vez.
- Componente `HaloEstado` (rename inline + popover designación + eliminar) posicionado vía `rectCapsulaEstado`.
- Componente `InspectorEstado` (nombre / designaciones reutilizando `SeccionDesignaciones` / duración con `ModalDuracionEstado` / supresión / flechas ↑↓ de posición).
- Componente `MenuContextualEstado` (rename, designaciones, duración, suprimir, eliminar, agregar hermano).
- Integración pattern-match en `Inspector.tsx` (o `InspectorEntidad.tsx`): si `estadoSeleccionId !== null`, renderiza `InspectorEstado`.
- Atributos `data-hover`, `data-focus`, `data-selected`, `data-dragging` en cápsula (`composers/entidad.ts`) con CSS Bauhaus usando tokens existentes.
- Handler de click estado (modo normal: selecciona estado en vez de redirigir al objeto). Preserva modo enlace y modo creación.
- Handler de contextmenu sobre cápsula → `MenuContextualEstado`.
- Drag-reorder lógico de estados (mousedown sobre cápsula seleccionada → drag-mode → mouseup dispara `reordenarEstado`).
- Atajos: F2 rename, Del eliminar, D abre popover designación, T abre modal duración, Esc deselecciona (guard exclusivo por el sello).
- Smoke `e2e/15-estado-ciudadano.spec.ts` con los 10 escenarios definidos abajo.
- Unit tests categoriales en `seleccion.test.ts`, extensiones en `runtime.test.ts`, `estados.test.ts` y `acciones-estados.test.ts`.

### Excluido (deuda explícita / scope futuro)

- **Migración a `seleccion: {tipo, id} | null` discriminado (Enfoque B)**: trigger documentado en §10. NO se hace en este paquete.
- OPL-jump global (clic OPL frase de estado → selecciona estado en canvas).
- Cmd+K command palette con búsqueda de estados.
- Árbol OPD con estado como nodo hijo de objeto.
- Multi-select cross-objeto (queda rechazado por constraint operativo y debate de producto pendiente).
- Reordenar por drag visual del rectángulo gráfico (sólo drag-reorder lógico calculando slot destino contra hermanos).
- Edición batch de duración (no aporta a la metodología; se elimina del scope para no añadir complejidad).
- Halo de simulación específico para estado activo (vive ya como marker `●` cinabrio existente; no se duplica).

## 4. Arquitectura A con los dos sellos

### 4.1 Estructura

```text
OpmStore {
  seleccionId:        Id | null   // entidad
  enlaceSeleccionId:  Id | null   // enlace
  estadoSeleccionId:  Id | null   // estado  ← NUEVO
  seleccionados:      Id[]        // batch (admite IDs de estado, mismo-objeto)
  modoSeleccion:      "simple" | "multi"
}
```

**Invariante sellado (cardinalidad ≤1 en el conjunto {seleccionId, enlaceSeleccionId, estadoSeleccionId})**: al menos dos de los tres son `null` simultáneamente. `seleccionados.length > 1` es ortogonal y refleja multi-batch.

### 4.2 Punto único `setSeleccion`

```ts
type KindSeleccion = "entidad" | "enlace" | "estado" | "vacia";

setSeleccion(kind: KindSeleccion, id: Id | null): void
```

Implementación: produce el partial con exactamente uno (o cero) de los tres campos no-null, además de `seleccionados`, `modoSeleccion`, `modoEnlace`, `mensaje`. Todos los callers (handlers, atajos, OPL navigation, etc.) terminan invocando esta función.

### 4.3 `estadoSeleccionDesdeIds` reescrita

Discrimina por `tipoDeCosa(modelo, id)` que devuelve `"entidad" | "enlace" | "estado" | null`. Construye partial con los tres campos exclusivamente. Mezcla heterogénea (entidad+estado, etc.) colapsa a vacía con mensaje.

### 4.4 Tipado natural de componentes

`HaloEstado`, `InspectorEstado`, `MenuContextualEstado` declaran sobre los tres campos explícitamente. Ningún componente nuevo asume "estoy dentro de una entidad seleccionada"; el discriminador es siempre cuál de los tres campos es no-null. Esto cierra la naturalidad del funtor (cada nuevo consumer respeta el shape exclusivo).

## 5. Componentes nuevos

### 5.1 `app/src/ui/HaloEstado.tsx`

Halo flotante mínimo. Bauhaus. Se posiciona sobre la cápsula usando `rectCapsulaEstado(modelo, apariencia, estadoId)`. Acciones:

- Botón rename → activa input inline sobre la cápsula → confirma con Enter/blur, cancela con Esc.
- Popover designación: 4 toggles `inicial / final / default / current` (reutilizan `SeccionDesignaciones` lógica si aplica).
- Botón eliminar.

**Conformidad con V-202**: el halo es affordance UI, no gramática. No se exporta al canon. Se distingue de markers semánticos por color/tamaño/posición.

### 5.2 `app/src/ui/inspector/InspectorEstado.tsx`

Panel lateral. Reutiliza `SeccionDesignaciones` y `ModalDuracionEstado`. Bloques:

- Nombre (rename con validación de unicidad por objeto propietario).
- Designaciones (4 toggles, exclusiones SSOT D5–D8 aplican).
- Duración (botón → `ModalDuracionEstado` ya existente).
- Supresión (toggle).
- Posición (flechas ↑↓ que disparan `reordenarEstado`).

### 5.3 `app/src/ui/MenuContextualEstado.tsx`

Right-click. Items:

- Renombrar (F2)
- Designar como… (submenú con 4 designaciones)
- Editar duración (T)
- Suprimir
- Eliminar (Del)
- Agregar estado hermano

NO incluye jump-to-OPL (fuera de scope: depende del paquete de descubribilidad).

## 6. Cambios al store

| Archivo | Cambio |
|---|---|
| `app/src/store/tipos.ts` | Agregar `estadoSeleccionId: Id \| null` a `OpmStore` |
| `app/src/store/runtime.ts` | Reescribir `estadoSeleccionDesdeIds` para discriminar tres tipos; exponer helper `tipoDeCosa(modelo, id)` |
| `app/src/store/seleccion.ts` | Agregar `setSeleccion(kind, id\|null)`, `seleccionarEstado(id)`, `agregarEstadoASeleccion(id)`, `toggleSeleccionEstado(id)` con validación de mismo objeto propietario |
| `app/src/store/modelo/acciones-estados.ts` | Acciones from-selection (`renombrarEstadoSeleccionadoSmart`, `eliminarEstadoSeleccionado`, `designarEstadoSeleccionado(designacion)`); `designarBatch(ids[], designacion)` |
| `app/src/modelo/operaciones/estados.ts` | Agregar `reordenarEstado(modelo, estadoId, indiceDestino): Resultado<Modelo>` con bounds y persistencia de orden |

## 7. Cambios al render

| Archivo | Cambio |
|---|---|
| `app/src/render/jointjs/composers/entidad.ts` (función `attrsConEstados`) | Agregar atributos `data-hover`, `data-focus`, `data-selected`, `data-dragging` a `stateCapsule${index}` |
| `app/src/render/jointjs/jointjs.css` (o equivalente Bauhaus) | Reglas CSS que reaccionan a `[data-selected="true"]` etc. usando tokens existentes (`--bauhaus-cinabrio`, `--bauhaus-paper-02`, `--bauhaus-focus-ring`, `--bauhaus-axis-soft`) |
| `app/src/render/jointjs/handlers/seleccion.ts` (líneas 110-118) | Reemplazar redirect al objeto por `seleccionarEstadoRef.current(estadoId)` en modo normal; preservar modo enlace y creación; agregar multi-select (Shift/Ctrl) con guards |
| `app/src/render/jointjs/handlers/seleccion.ts` (handler `onElementContextmenu`) | Detectar cápsula de estado → `abrirMenuContextualEstadoRef(estadoId, posición)` |
| `app/src/render/jointjs/handlers/` (nuevo handler drag-estado) | Drag-reorder: mousedown sobre cápsula seleccionada → drag-mode → mousemove calcula slot destino contra `rectCapsulaEstado` de hermanos → mouseup dispara `reordenarEstado` |

## 8. Atajos

| Atajo | Condición | Acción |
|---|---|---|
| F2 | `estadoSeleccionId !== null` | Activa rename inline |
| Del | `estadoSeleccionId !== null` | `eliminarEstadoSeleccionado` |
| D | `estadoSeleccionId !== null` | Abre popover designación |
| T | `estadoSeleccionId !== null` | Abre modal duración |
| Esc | `estadoSeleccionId !== null` | Deselecciona |

Implementación en `app/src/ui/atajosTeclado.ts`. El guard `estadoSeleccionId !== null` es exclusivo por el invariante sellado: cuando hay estado seleccionado, no hay entidad ni enlace seleccionado, así que estos atajos no colisionan con F2/Del/D/T de entidad/enlace.

## 9. Testing

### Unit

- `app/src/store/seleccion.test.ts` (extender): test categorial obligatorio del invariante de exclusividad mutua. Loop sobre los 4 valores de `kind` invocando `setSeleccion(kind, id)`; verificar que exactamente uno o cero campos del trío sean no-null. Tests adicionales: `seleccionarEstado` setea sólo `estadoSeleccionId`; `agregarEstadoASeleccion` rechaza estados de otro objeto.
- `app/src/store/runtime.test.ts` (extender o crear): `estadoSeleccionDesdeIds` discrimina tres tipos; mezcla heterogénea colapsa.
- `app/src/modelo/operaciones/estados.test.ts` (extender — crear si no existe): `reordenarEstado` bounds (índice < 0, índice >= length); idempotencia (mismo índice → no-op); preserva semánticas existentes (designaciones, supresión).
- `app/src/store/modelo/acciones-estados.test.ts` (nuevo): `designarBatch` aplica a varios estados, propaga exclusiones SSOT; acciones from-selection respetan `estadoSeleccionId`.

### E2E

`app/e2e/15-estado-ciudadano.spec.ts` — 10 escenarios:

1. Crear objeto con 3 estados.
2. Click cápsula selecciona estado (no objeto).
3. Click cuerpo de objeto vuelve a seleccionar objeto.
4. F2 sobre estado seleccionado activa rename inline.
5. Shift+click hermano agrega al multi-select del mismo objeto.
6. Shift+click sobre estado de otro objeto rechazado.
7. Drag-reorder de cápsula persiste el nuevo orden tras recarga.
8. Right-click sobre cápsula muestra menú contextual de estado.
9. Modo enlace preservado: click cápsula durante modo enlace mantiene el comportamiento existente (selecciona como extremo).
10. Del con estado seleccionado elimina el estado.

### Regresiones críticas (deben seguir verdes)

- `app/e2e/03-opl-panel.spec.ts`
- `app/e2e/05-refinamiento-y-plegado.spec.ts`
- `app/e2e/02-canvas-y-render.spec.ts`
- `app/src/render/jointjs/composers/estados.test.ts` (si existe; revisar)
- `app/src/serializacion/validarEstados.test.ts`
- `app/src/ui/inspector/previewEstadosOpl.test.ts`
- `app/src/opl/roundtrip.test.ts`

## 10. Trigger explícito hacia B (deuda categorial)

**Cuándo migrar A → B**: cuando entre cualquiera de los siguientes funtores consumidores nuevos:

- OPL-jump global (frase OPL → seleccionar entidad referenciada en cualquier OPD).
- Cmd+K command palette con búsqueda de cosas seleccionables.
- Árbol OPD que muestra estado como nodo hijo del objeto.
- Cualquier cuarto tipo seleccionable (anotación, marker, OPL fragment, etc.).

**Cómo migrar**: reemplazar los tres campos `seleccionId`, `enlaceSeleccionId`, `estadoSeleccionId` por `seleccion: { tipo: KindSeleccion, id: Id } | null` discriminado. Adaptadores backwards-compat para las lecturas legadas durante la migración. Esto se hace **antes** de construir el nuevo funtor consumidor, no después.

**Por qué**: bajo `urn:fxsl:kb:icas-universales`, el coproducto tagged es la estructura universal; añadir un cuarto campo paralelo escala el costo del invariante sellado a O(N²) en checks; el discriminado lo deja en O(1).

Esta deuda se anota también en `CLAUDE.md` proyecto bajo "Decisiones vigentes" / "Deuda categorial activa".

## 11. Criterios de aceptación

- [ ] `app/src/store/tipos.ts` declara `estadoSeleccionId: Id | null` en `OpmStore`.
- [ ] `setSeleccion(kind, id|null)` existe como único punto de mutación de selección.
- [ ] Test categorial del invariante de exclusividad mutua en `seleccion.test.ts` pasa (loop sobre los 4 valores de `kind`).
- [ ] `reordenarEstado` existe en `modelo/operaciones/estados.ts` con tests de bounds.
- [ ] `HaloEstado`, `InspectorEstado`, `MenuContextualEstado` están implementados y montados.
- [ ] Click sobre cápsula en modo normal selecciona el estado, no el objeto.
- [ ] Modo enlace preservado (regresión 9 del smoke verde).
- [ ] Atajos F2/Del/D/T/Esc operan sobre estado seleccionado.
- [ ] Drag-reorder de cápsula persiste el nuevo orden.
- [ ] `e2e/15-estado-ciudadano.spec.ts` con los 10 escenarios pasa.
- [ ] `bun run check` verde (typecheck + unit).
- [ ] `bun run browser:smoke` verde (con `vite dev` apagado durante smoke).
- [ ] HANDOFF.md actualizado (reescrito, no acumulado).
- [ ] CLAUDE.md proyecto menciona deuda categorial trigger → B.

## 12. Anclajes y referencias

- SSOT OPM:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.71 (State).
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md` Regla V-4 (estado contenido en objeto), Regla V-202 (handles/halos = affordance UI, no gramática).
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md` D5–D8 (designaciones inicial/final/default/current).
- KBs categoriales (polymath / cat-thinking):
  - `urn:fxsl:kb:icas-universales` — sustentación de A como funtor casi-libre y B como objeto universal.
  - `urn:fxsl:kb:icas-preservacion` — A preserva el shape del store, los componentes existentes son extensiones naturales.
  - `urn:fxsl:kb:icas-comparacion` — diagnóstico de equivalencia frágil (A "ya casi" coproducto vs A coproducto efectivo con el sello del invariante).
- Canon local:
  - `docs/canon-opm/reglas-opm-estrictas.md` R-EST-1, R-COSA-3.
- HANDOFF: `docs/HANDOFF.md` (única memoria de traspaso vigente).
