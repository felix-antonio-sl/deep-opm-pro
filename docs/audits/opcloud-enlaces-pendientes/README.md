# Pendientes de emulación OPCloud para enlaces

**Fecha**: 2026-05-14
**Autor**: agente Claude + operador
**Estado**: documento vivo de roadmap; A/B/C del roadmap original ya tienen implementación base. Quedan brechas avanzadas OPCloud.

## Contexto

En esta sesión cerramos la primera tanda de mejoras al manejo de enlaces alineadas con OPCloud (commit `6b1030b`):

- Procedurales van **rectos** (sin router manhattan).
- `jumpover` aplicado **global** (no condicional al router).
- Multiplicidades en **fracción del path** (0.1 origen, 0.9 destino) en vez de píxeles.

Validado contra modelo HODOM real (`/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json`, 28 apariencias, 59 enlaces). Loop verde 100% en cada paso (1182 unit / 172 smoke).

Reverse-engineering completo de `opm-extracted/` (código descompilado OPCloud) reveló **3 mecanismos canónicos faltantes** que producen maraña visual en modelos densos. Este documento los detalla para no re-investigar y registra qué parte ya fue llevada a nuestra arquitectura.

## Estado 2026-05-13

Implementado en la app:

- **Router Manhattan con obstáculos**: `app/src/render/jointjs/opcloudRouting.ts` aplica `manhattan` post-mount con `padding: 5`, `step: 11`, `startDirections/endDirections` para tramos de triángulo e `isPointObstacle` sobre entidades/triángulos.
- **Puertos dinámicos OPCloud-style**: `app/src/modelo/operaciones/ports.ts` materializa `portId` por extremo, conserva ports en JSON y limpia ports no usados.
- **Ranuras estructurales OPCloud-style**: los enlaces estructurales conectados a la misma apariencia usan la secuencia `0, +10%, -10%, ...` adaptada a puertos relativos. Esto emula `getStructuralLinkConnectionPointDelta()` sin introducir anchors persistidos ajenos a nuestra arquitectura.
- **Unificación de enlaces con estados**: resultados desde un proceso hacia estados del mismo objeto comparten puerto de origen; consumos/agentes/instrumentos desde estados del mismo objeto hacia un proceso comparten puerto de destino, siguiendo `uniteResults`, `uniteConsumptions` y `uniteAgentsAndInstruments`.
- **Sort post-drag compatible con ports**: `app/src/render/jointjs/sortStructuralLinks.ts` mantiene compatibilidad con anchors OPCloud y ahora también permuta endpoints conectados por `port`.
- **`beautifyConnectedLinks` post-drag**: `app/src/render/jointjs/beautifyConnectedLinks.ts` lee `sourceAnchor/targetAnchor` reales desde `LinkView`, persiste puertos con `actualizarPuertosEnlacesDesdePuntos()` y combina movimiento+puertos en un solo undo visual. En buses estructurales, el tramo común se expande a todos los enlaces semánticos del grupo para no embellecer solo la primera rama visual.
- **Símbolo estructural persistente/editable**: `AparienciaEnlace.symbolPos` conserva el centro del triángulo estructural al estilo OPCloud/OPX (`symbolPos` en `OPXStructuralParams`). Draggear el triángulo actualiza el JSON; en buses se sincroniza la posición en todas las ramas agrupadas.
- **Anclas persistentes del símbolo estructural**: `AparienciaEnlace.symbolAnchors` conserva offsets relativos al centro del triángulo (`refinable` y `refinador`). El renderer usa ports JointJS con layout `absolute`, de modo que el triángulo sigue arrastrando sus enlaces en vivo. En buses estructurales OPCloud-style, las ramas del mismo grupo comparten el puerto `out`; la separación visual se expresa creando un `grupoEstructuralId` distinto.
- **Ciclo interactivo base del símbolo estructural**: click sobre el triángulo de bus selecciona el grupo estructural; el Inspector permite cambiar el tipo fundamental (`agregacion`/`exhibicion`/`generalizacion`/`clasificacion`), separar/volver a automático y marcar `ordered` como `orderedFundamentalTypes` en la entidad refinable, emulando el patrón OPCloud de `orderedFundamentalTypes`.
- **Ciclo de faltantes/semifolding**: el Inspector de enlace estructural expone `Traer faltantes` y `Semiplegar grupo`. La operación `traerRelacionesEstructuralesFaltantes()` materializa en el OPD activo refinadores/enlaces estructurales existentes en otros OPDs del mismo refinable; `plegarGrupoEstructural()` oculta las ramas visibles bajo el refinable usando el plegado parcial existente, equivalente MVP al `semiFolded` operacional de OPCloud. El Inspector de entidad ahora expone `Quitar semiplegado estructural` cuando detecta relaciones fundamentales ocultas, equivalente al remove/fold-out de `semiFolded`.
- **Agregaciones faltantes derivadas desde in-zoom**: `agregacionesInzoomFaltantes()` y `traerAgregacionesInzoomFaltantes()` emulan `foldInAllFundamentalRelations()` / `bringMissingFundamentals(Aggregation)` de OPCloud para hijos internos de descomposición. Si el operador selecciona un grupo estructural existente, las agregaciones creadas heredan `grupoEstructuralId`; si selecciona la cosa refinable, el Inspector de Refinamiento muestra `Traer agregaciones de in-zoom`.
- **Fold completo estructural**: `plegarCompletoGrupoEstructural()` usa el slot existente `Apariencia.modoPlegado = "plegado"` para ocultar ramas/refinadores sin mostrar filas internas. El Inspector de enlace agrega `Plegar completo`; el Inspector de entidad agrega `Quitar plegado estructural`; el renderer JointJS muestra un badge compacto `▸` con conteo de relaciones ocultas. Es la adaptación local del concepto OPCloud `OpmSemifoldedFundamental`: misma semántica de fold-out, pero sin crear una shape lógica extra fuera de nuestra arquitectura.
- **Distribución avanzada del triángulo estructural**: la proyección reserva posiciones de triángulos estructurales y separa automáticamente símbolos que caerían superpuestos, siguiendo el patrón OPCloud `TriangleClass.checkFOrOverLapping()` pero sin mutar el modelo cuando la posición no fue persistida por el operador. Esto hace que grupos manuales (`grupoEstructuralId`) separados se vean realmente separados aun cuando su centro geométrico inicial coincide con el bus automático.
- **Wrapping de labels largos**: labels de ruta, etiquetas de enlace y labels de ramas estructurales usan `textWrap` de JointJS para no invadir líneas/triángulos en textos largos. Es el primer tramo de labels avanzados; todavía no incluye posición persistida ni requirements/rate/time/tags.

Validación de esta ronda:

- `bun run typecheck`
- `bun run test`: 1243 pass / 0 fail
- `bun run build`
- `bun run lint`
- `bun run browser:smoke`: 173 pass / 0 fail

Pendientes reales después de A/B/C/D/E/G/H-base/I-base/I-remove/J-inzoom/K-fold-completo/L-triangle-layout/L-label-wrap:

- Ajuste avanzado de vertices superiores de OPCloud alrededor del símbolo estructural persistido: ya existe la base de anclas/ports y separación de símbolos superpuestos; falta editar manualmente esos offsets y propagar heurísticas OPCloud más finas para modelos muy densos.
- Labels avanzados OPCloud: wrapping básico ya existe; faltan wrapping por segmento visible, posición persistida, requirements, rate/time/path/tags/backtags.
- Familias avanzadas fuera del MVP actual: exception links de tiempo, tagged/bidirectional links y metadatos avanzados de requisitos.

## Pendiente #1 — Puertos dinámicos (`findClosestEmptyPort`)

### Problema operativo

Cuando 5+ enlaces convergen a un mismo cell (proceso/objeto), JointJS calcula el anchor con la regla default (`bbox`, centro→centro). Si los orígenes están agrupados espacialmente (ej. 4 objetos arriba de un proceso), todas las intersecciones bbox-line caen en una zona pequeña del top, produciendo "estrella" de convergencia visualmente confusa.

### Cómo OPCloud lo resuelve

`OpmEntity.findClosestEmptyPort(point, allowSamePort)` en `opm-extracted/src/app/models/DrawnPart/OpmEntity.ts:645-692`. Al crear/persistir cada enlace, se crea un **port único por enlace** en el punto exacto donde la línea cortaría el bbox del cell destino, expresado como coordenadas `%` (rectangulares) o fracción `0..1` (procesos elipsoides).

Snippet canónico (resumido):

```ts
findClosestEmptyPort(point, allowSamePort = false) {
  const thisSize = this.get("size");
  const thisPos = this.get("position");
  const normalizedPoint = {
    x: point.x - thisPos.x,
    y: point.y - thisPos.y,
  };
  let refX = clamp(normalizedPoint.x / thisSize.width, 0, 1);
  let refY = clamp(normalizedPoint.y / thisSize.height, 0, 1);

  const portId = uuid();
  const isRectShape = this.constructor.name.includes("Object")
                   || this.constructor.name.includes("State");
  this.addPort({
    id: portId,
    group: "aaa",                     // único port-group global
    args: {
      x: isRectShape ? refX * 100 + "%" : refX,
      y: isRectShape ? refY * 100 + "%" : refY,
    },
    markup: this.defaultPortMarkup,
  });
  return portId;
}
```

- **Group único `"aaa"`** (no port-groups por lado). Todos los ports comparten markup.
- **Rectángulos** (Object, State): coordenadas porcentuales del bbox.
- **Procesos** (elipse): coordenadas fraccionarias `0..1` (JointJS interpola al borde).
- **Garbage collection**: `removeUnusedPorts()` (`OpmEntity.ts:271-297`) elimina ports sin links conectados al `pointerUp`.

El comentario del código en `:656-679` muestra que hubo un intento de anti-colisión (push radial cuando otro port está a <20px), pero está deshabilitado en producción. OPCloud actualmente **no fuerza spacing mínimo** entre ports.

### Cómo lo implementaríamos en nuestra app

Cambio estructural moderado. Toca modelo + composer + handlers.

**1. Extender modelo de apariencias** (`app/src/modelo/tipos/apariencia.ts`):

```ts
interface Apariencia {
  // ... campos existentes ...
  /** Mapa portId → coords {x,y} en fracción 0..1 del bbox. Solo se persiste
   *  para los ports realmente conectados a enlaces (otros se descartan). */
  ports?: Record<Id, { x: number; y: number }>;
}
```

**2. Extender modelo de enlace** (`app/src/modelo/tipos/enlace.ts`): cada extremo puede ahora referenciar un portId opcional.

```ts
interface ExtremoEnlace {
  kind: "entidad" | "estado";
  id: Id;
  portId?: Id;  // ← nuevo: si está, el extremo conecta al port específico
}
```

**3. Acción `calcularPortParaEnlace`** (`app/src/modelo/operaciones/ports.ts` nuevo):

```ts
// Llamado al crear/reanclar enlace.
function calcularPortParaEnlace(
  modelo: Modelo,
  opdId: Id,
  aparienciaCell: Apariencia,
  puntoOpuesto: Posicion,  // centro de la otra apariencia del enlace
): { portId: Id; modelo: Modelo } {
  // 1. Normalizar punto a coords relativas del bbox.
  const refX = clamp((puntoOpuesto.x - aparienciaCell.x) / aparienciaCell.width, 0, 1);
  const refY = clamp((puntoOpuesto.y - aparienciaCell.y) / aparienciaCell.height, 0, 1);
  // 2. Generar portId.
  const portId = nuevoId(modelo);
  // 3. Agregar port a la apariencia.
  const apFinal = {
    ...aparienciaCell,
    ports: { ...(aparienciaCell.ports ?? {}), [portId]: { x: refX, y: refY } },
  };
  return { portId, modelo: actualizarApariencia(modelo, opdId, apFinal) };
}
```

**4. Composer JointJS** (`app/src/render/jointjs/composers/entidad.ts`): emitir `ports.items` en el cell con los ports persistidos.

**5. Composer enlace** (`app/src/render/jointjs/composers/enlace.ts:195-218` `endpointJoint`): si el extremo tiene `portId`, emitir `{ id: aparicionId, port: portId }`.

**6. Garbage collection** post-commit: tras cualquier cambio en `modelo.enlaces`, recorrer ports de apariencias y eliminar los no referenciados.

### Tests sugeridos

- Unit: dado 5 enlaces de objetos en distintas posiciones hacia un mismo proceso, cada uno produce un portId distinto, distribuidos en distintos puntos del perímetro.
- Integration: serialización JSON conserva los ports; al hidratar y volver a guardar, los portIds son estables.
- Smoke: visual — 5 enlaces a un proceso no convergen al mismo punto.

### Riesgos

- **Migración de modelos existentes**: los modelos guardados sin ports siguen funcionando (extremos sin `portId` → comportamiento JointJS default). Sin breaking change.
- **Drag de entidad con ports activos**: JointJS conserva ports al mover el cell (coords relativas). Sin trabajo adicional.
- **Reanclaje manual**: el usuario que arrastra el extremo del enlace a otra entidad → recalcular portId del nuevo destino. Hook en `change:source`/`change:target` (`drag.ts:100-106`).

### Referencias

- OPCloud: `opm-extracted/src/app/models/DrawnPart/OpmEntity.ts:645-692` (findClosestEmptyPort), `:271-297` (removeUnusedPorts).
- Uso en producción: `BlankLink.ts:87-95` (al soltar el drag de creación), `beautifyConnectedLinks` (`OpmEntity.ts:869-942`).

---

## Pendiente #2 — `sortStructuralLinks`: descruzar enlaces por permutación

### Problema operativo

Tras un drag de entidad o aplicación de autolayout, los enlaces **estructurales** (agregación, exhibición, generalización, clasificación) pueden quedar cruzados porque las permutaciones de anchors no son óptimas. Resultado: triángulos con ramas que se cruzan visualmente.

### Cómo OPCloud lo resuelve

`OpmEntity.sortStructuralLinks(init)` en `OpmEntity.ts:567-643`. Algoritmo:

1. Filtrar enlaces conectados a la entidad que tengan `source/anchor` o `target/anchor` definidos (solo estructurales — procedurales no tienen anchor explícito).
2. Para cada par de enlaces, calcular intersecciones de sus paths SVG usando helper `getIntersectionPointsOfPaths(view1.path, view2.path)`. Si todos los pares tienen 0 intersecciones → `alreadyGood`, retornar.
3. Si hay cruces, enumerar **todas las permutaciones** del array de anchors con `permutationsOfArray(arr)`. Para cada permutación:
   - Aplicar `link.prop(side + "/anchor", perm[i])` a cada enlace.
   - Recalcular intersecciones de pares.
   - Si 0 intersecciones → aceptar permutación, retornar.
4. Si ninguna permutación funciona → restaurar el array original.

Complejidad: O(N!) pero acotado por el filtro estricto (solo estructurales, típicamente ≤7 por entidad). 7! = 5040 permutaciones, cada una requiere recalcular 21 pares de intersección. Viable.

Llamado tras cada `pointerUp` que mueva una entidad (`OpmEntity.ts:706` en pointerUpHandle).

Snippet canónico:

```ts
sortStructuralLinks(init = getInitRappidShared()) {
  const inLinks = this.graph.getConnectedLinks(this, { inbound: true })
    .filter(l => l?.prop("target/anchor"));
  const outLinks = this.graph.getConnectedLinks(this, { outbound: true })
    .filter(l => l?.prop("source/anchor"));
  const links = [...inLinks, ...outLinks];
  const arr = [];
  for (const link of links) {
    const side = inLinks.includes(link) ? "target" : "source";
    arr.push(link.prop(side + "/anchor"));
  }
  // checking if the current links positions are already OK.
  let alreadyGood = true;
  for (const link1 of links) {
    for (const link2 of links) {
      if (link1 === link2) continue;
      const view1Path = link1.findView(init.paper)?.path;
      const view2Path = link2.findView(init.paper)?.path;
      if (!view1Path || !view2Path) continue;
      const inters = getIntersectionPointsOfPaths(view1Path, view2Path);
      if (inters.length > 0) alreadyGood = false;
    }
  }
  if (alreadyGood) return;
  let permutations = permutationsOfArray(arr);
  let perm;
  while (perm = permutations.pop()) {
    let good = true;
    for (const l of links) {
      const side = inLinks.includes(l) ? "target" : "source";
      l.prop(side + "/anchor", perm[links.indexOf(l)]);
    }
    for (const link1 of links) {
      for (const link2 of links) {
        if (link1 !== link2) {
          /* ... recheck intersections; prune permutations comparing same anchor pairs ... */
        }
      }
    }
    if (good === true) return;
  }
  // return to original if no good perm found.
  for (const link of links) {
    const side = inLinks.includes(link) ? "target" : "source";
    link.prop(side + "/anchor", arr[links.indexOf(link)]);
  }
}
```

### Cómo lo implementaríamos en nuestra app

Hook post-drag. Toca handlers + un helper de intersección.

**1. Helper intersección paths SVG** (`app/src/canvas/geometria/intersecciones.ts` nuevo):

```ts
/** Cuenta intersecciones entre dos segmentos polilíneos definidos como
 *  arrays de puntos. Para JointJS, `linkView.path` se traduce a polyline
 *  via `path.toPolyline()`. */
export function contarIntersecciones(p1: Posicion[], p2: Posicion[]): number;
```

**2. Helper permutaciones** (`app/src/canvas/geometria/permutaciones.ts` nuevo):

```ts
export function permutaciones<T>(arr: T[]): T[][];
```

**3. Aplicar tras drag** (`app/src/render/jointjs/handlers/drag.ts:114-124`):

```ts
graphEvents(graph).on("change:position", (cell: dia.Cell) => {
  // ... reposicionamiento abanico actual ...

  // Post-drag sort de structural links conectados a la entidad movida.
  const enlacesEstructurales = obtenerEnlacesEstructuralesConectados(
    modeloActual, opdActual, meta.entidadId,
  );
  if (enlacesEstructurales.length >= 2) {
    sortStructuralLinks(paper, graph, modeloActual, enlacesEstructurales);
  }
});
```

**4. Función `sortStructuralLinks`** (`app/src/render/jointjs/sortStructuralLinks.ts` nuevo): replicar el algoritmo del snippet.

### Tests sugeridos

- Unit: dada una entidad con 4 enlaces estructurales en orden tal que producen 2 cruces → `sortStructuralLinks` retorna una permutación con 0 cruces.
- Unit: si la permutación inicial ya es óptima → no se modifica.
- Smoke: drag visual de una entidad con triángulo de agregación + 3 ramas; tras pointerUp los anchors no cruzan.

### Riesgos

- **O(N!) explosión**: con N >7 (raro pero posible en HODOM) el cómputo crece. Cap: si N > 7, abortar y dejar como está.
- **Solo aplica a enlaces con anchor explícito**: la mayoría hoy NO los tiene. Requiere implementar pendiente #1 primero o limitarse a estructurales del triángulo.
- **Re-emitir cells**: cambiar anchors via `link.prop()` no requiere re-emitir todo, JointJS lo aplica en vivo. Sin re-render completo.

### Referencias

- OPCloud: `OpmEntity.ts:567-643` (sortStructuralLinks), `:535-566` (getStructuralLinkConnectionPointDelta — slots de anchor 0%, ±10%, ..., ±90%).
- Llamadas: `OpmEntity.ts:706` (en pointerUpHandle).

---

## Pendiente #3 — Router manhattan con `isPointObstacle`

### Problema operativo

Nuestro router manhattan actual (`composers/enlace.ts:483` `routerManhattan`) usa `{ padding: 5, step: 11 }`. **No evita atravesar entidades** en el path. En modelos densos, enlaces estructurales pueden cruzar por encima de procesos no relacionados, generando confusión visual.

### Cómo OPCloud lo resuelve

`OpmFundamentalLink` constructor en `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts:3559-3686` define una función `isPointObstacle` que se pasa como arg al router manhattan. Esa función pregunta a `graph.findModelsFromPoint(point)` y retorna `true` si ese punto está sobre un `DrawnEntity` (objeto/proceso) o un `Triangle`.

Snippet canónico (shared.ts:3569-3590):

```ts
const isPointObstacle = function (point) {
  if (sourceElement.graph?.findModelsFromPoint(point).find(c =>
    OPCloudUtils.isInstanceOfDrawnEntity(c)
    || c.constructor.name.includes("Triangle")
  )) {
    return true;
  }
  return false;
};

const router = {
  name: "manhattan",
  args: {
    padding: 5,
    step: 11,
    startDirections: ["bottom"],     // o ["top"] para link superior del triángulo
    isPointObstacle: isPointObstacle,
  },
};
```

- `startDirections: ["bottom"]` fuerza el path a salir hacia abajo del source (rama inferior del triángulo).
- `endDirections: ["top"]` análogo para la rama superior (`mainUpperLink`, shared.ts:3645).
- `isPointObstacle` se pasa al router manhattan de JointJS como predicado custom; el router salta esos puntos.

### Cómo lo implementaríamos en nuestra app

Cambio acotado a `composers/enlace.ts` + acceso al graph.

**1. Adaptar `routerManhattan`** (`composers/enlace.ts:483`) para aceptar el graph:

```ts
export function routerManhattanConObstaculos(
  graph: dia.Graph,
  startDirections?: string[],
  endDirections?: string[],
): Record<string, unknown> {
  const isPointObstacle = (point: { x: number; y: number }) => {
    const models = (graph as unknown as { findModelsFromPoint: (p: any) => dia.Cell[] })
      .findModelsFromPoint(point);
    return models.some(c => {
      const meta = (c as unknown as { get: (k: string) => any }).get("opm");
      return meta?.kind === "entidad" || c.constructor.name.includes("Triangle");
    });
  };
  return {
    name: "manhattan",
    args: {
      padding: 5,
      step: 11,
      ...(startDirections ? { startDirections } : {}),
      ...(endDirections ? { endDirections } : {}),
      isPointObstacle,
    },
  };
}
```

**2. Pasar el graph a la proyección**: el proyector actual (`composers/enlace.ts:97`) genera cells JSON sin acceso al graph. El graph está disponible solo después de instanciar el paper. Alternativa: agregar el `router` como configuración aplicada **post-mount** (`JointCanvas.tsx` después de `graph.fromJSON`).

```ts
// En JointCanvas.tsx después de graph.fromJSON(cells):
for (const link of graph.getLinks()) {
  const meta = link.get("opm");
  if (meta?.kind === "enlace" && esEstructural(meta.tipo)) {
    link.router(routerManhattanConObstaculos(graph,
      direccionEstructural(meta.tipo, "start"),
      direccionEstructural(meta.tipo, "end"),
    ));
  }
}
```

**3. Direcciones por tipo**: triángulo de agregación → fuente entra "bottom", destino entra "top". Genera el zigzag canónico hacia arriba/abajo según relación.

### Tests sugeridos

- Unit: `routerManhattanConObstaculos(graphMock)` retorna config con `isPointObstacle` callable.
- Integration: enlace estructural entre A y C, con B en el medio → path computado evita el bbox de B.
- Smoke: visual — modelo HODOM con triángulos de agregación; las ramas no atraviesan entidades.

### Riesgos

- **Performance**: `findModelsFromPoint` por cada step del router puede ser caro en modelos con cientos de cells. Profilar.
- **Acceso al graph**: rompe la pureza del composer JSON-only. Aceptable como post-mount config.
- **Procedurales rectos**: NO aplicar este router a procedurales (canon OPCloud — solo fundamentales/estructurales).

### Referencias

- OPCloud: `shared.ts:3559-3686` (constructor OpmFundamentalLink), `:3639-3676` (mainUpperLink y rama inferior), `:3569-3574` (isPointObstacle).

---

## Estado del roadmap original

El roadmap A/B/C original queda así:

| # | Pendiente | Estado | Nota |
|---|---|---|---|
| A | **#3 isPointObstacle** | Implementado | Adaptado como post-mount en JointJS OSS. |
| B | **#1 Puertos dinámicos** | Implementado + ampliado | Incluye ranuras estructurales y unificación de enlaces con estados. |
| C | **#2 sortStructuralLinks** | Implementado base | Permuta anchors y ports; queda pendiente persistir decisiones visuales si se requiere. |

La siguiente ruta de alto impacto ya no es A/B/C/D/E, sino **F/G/H**. G tiene implementación base.

| # | Pendiente | Impacto | Costo |
|---|---|---|---|
| F | labels OPCloud avanzados | Medio/alto | M |
| G | ciclo interactivo completo del triángulo estructural | Medio/alto | En curso: tipo/ordered/grupo, faltantes, semiplegado y remove/fold-out listos; faltan fold completo y faltantes desde inzoom procedural |
| H | vertices superiores/anchors visuales persistidos alrededor del símbolo | Medio | M |

## Notas operativas

- **Modelos guardados**: ningún cambio rompe modelos existentes. Los ports y anchors son aditivos; los modelos sin ports siguen funcionando con el comportamiento default JointJS.
- **Tests del modelo HODOM real**: usar `/home/felix/projects/hd-hsc-os/docs/models/opm-hodom-bundle-v1.1.json` como benchmark de densidad (28 apariencias, 59 enlaces).
- **Dev server**: matar Vite bg antes de smoke (`pgrep -af vite | grep -v eval | awk '{print $1}' | xargs -r kill`).
- **Reverse-engineering**: snippets canónicos extraídos en sesión 2026-05-12. Archivos clave OPCloud:
  - `opm-extracted/src/app/models/DrawnPart/OpmEntity.ts` (ports, sort, beautify)
  - `opm-extracted/src/app/configuration/rappidEnviromentFunctionality/shared.ts` (router, connector, labels, fundamentales)
  - `opm-extracted/src/app/models/DrawnPart/Links/*.ts` (markers específicos)

## Estado técnico validado

Loop verde de referencia:
- typecheck/build clean
- lint clean
- 1235 unit / 0 fail
- 173 smoke / 0 fail

Lo que YA está hecho:
- router Manhattan OPCloud con obstáculos y direcciones de triángulo
- puertos dinámicos y preservación JSON de `ports`/`portId`
- triángulos estructurales con puertos `in`/`out`
- grouping/separación estructural por `grupoEstructuralId`
- sort estructural post-drag compatible con anchors y ports
- `beautifyConnectedLinks` post-drag desde anchors reales de `LinkView`
- `symbolPos` persistido y editable para triángulos estructurales simples y buses
- selector de grupo estructural desde el triángulo + cambio de tipo + `orderedFundamentalTypes`
- ciclo OPCloud-style de faltantes, semiplegado y quitar semiplegado estructural
- unificación OPCloud-style de enlaces procedurales con estados
- `7a9d65e` — layoutConContorno con anchos reales + heurística semántica (HODOM SD-1: 0 solapamientos)
- `f93112e` — externos densos en multi-columna
- `c064537` — bound Bellman-Ford en BFS (autolayout no cuelga con ciclos)
- `5f5985d` / `08c0702` / `187562a` / `3e2332e` — markers visuales (resultado swallowtail, lollipop coords positivas, badges canónicos, badge position medio del enlace)
- `855400f` — lote SSOT (microcopy, modificadores, feDropShadow SVG, supresor estados)
- `74051e7` (operador) — autolayout denso (grilla 2D) + fit-to-viewport
