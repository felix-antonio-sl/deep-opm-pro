# Línea 2 — Abanicos lógicos O/XOR (EPICA-15)

## 1. Misión

Implementar abanicos lógicos OPM: cuando dos o más enlaces parten del mismo puerto de un proceso, formar un cluster con operador `O` (al menos uno) o `XOR` (exactamente uno). Cubre HU-15.008–012. El abanico es agrupación de enlaces compartiendo puerto, con operador y conector visual canónico.

**Slice mínimo entregable**:
- Tipo `Abanico = { id: Id; opdId: Id; puertoEntidadId: Id; operador: "O" | "XOR"; enlaceIds: Id[] }`.
- `Modelo.abanicos: Record<Id, Abanico>` top-level.
- Operación `formarAbanico(opdId, enlaceIds[]): Abanico` cuando se conecta segunda rama desde el mismo puerto.
- Operación `alternarOperadorAbanico(abanicoId, operador)`.
- Operación `disolverAbanico(abanicoId)` cuando queda 1 o 0 enlaces.
- Render: triángulo conector cerca del puerto para XOR, abrazadera curva para O. Marcadores SVG canónicos.
- OPL-ES distinguido: "exactamente uno de" (XOR) vs "al menos uno de" (O).
- Validación: rechazar abanicos con menos de 2 enlaces.
- `completitud.test.ts` con `Record<OperadorAbanico, true>`.

**Pendientes explícitos** (no entran a este slice; quedan para ronda 4):
- HU-15.013 (ramas a estados distintos): consume L1 + L2. Si L1 ya está mergeada, L2 puede absorber HU-15.013 al final del slice. Por defecto, fuera del slice.
- HU-15.005 y HU-15.007 (etiqueta de ruta sobre rama): dependen de HU-13.014 (L1) y HU-15.013.
- Drag visual para formar abanico arrastrando rama: nice-to-have. Inspector + UI dedicada bastan.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-15.008 | `docs/historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md` (sección 15.008) | Crear segunda rama sobre mismo puerto |
| HU-15.009 | (mismo archivo, 15.009) | Alternar O/XOR |
| HU-15.010 | (mismo archivo, 15.010) | Render conector XOR |
| HU-15.011 | (mismo archivo, 15.011) | Render conector O |
| HU-15.012 | (mismo archivo, 15.012) | OPL distingue XOR/O |

Referencia (NO implementar aquí): HU-15.013 (ramas a estados), HU-15.005 (etiqueta ruta).

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md` — `[V-239]` axiomas de operadores lógicos sobre enlaces; `[Glos 3.60]` enlaces.
  - `opm-visual-es.md` — render canónico del conector XOR (triángulo) y O (abrazadera curva).
  - `opm-opl-es.md` — plantillas de operadores lógicos.
- **opm-extracted/** (lectura obligatoria):
  - `rg -i "fan|xor\|or " opm-extracted/src/app/` para mapear cómo OPCloud agrupa.
  - `opm-extracted/src/app/models/components/` y `LogicalPart/` `VisualPart/` — buscar `OpmLogicalLink`, `LogicalLink`, `XorLink`, `OrLink`.
  - `opm-extracted/src/app/rappid-components/rappid-paper/` — overlays de conectores en JointJS.
  - `assets/svg/links/` — verificar si ya hay SVG canónico para XOR/O. Si no, generar SVG sigue las dimensiones JOYAS.
- **Estado actual**:
  - `app/src/modelo/tipos.ts` — agregar `Abanico` y `Modelo.abanicos`.
  - `app/src/modelo/operaciones.ts` — lectura. La lógica nueva vive en `abanicos.ts`.
  - `app/src/render/jointjs/linkAssets.ts` — agregar marker SVG si hace falta.
  - `app/src/render/jointjs/JointCanvas.tsx` — overlay del conector lógico.
  - `app/src/opl/generar.ts` — agregar caso de abanico.

## 4. Archivos permitidos (scope estricto)

```
app/src/modelo/tipos.ts                     EDIT aditivo (Abanico, OperadorAbanico, Modelo.abanicos)
app/src/modelo/abanicos.ts                  NUEVO (formar, alternar, disolver, validar)
app/src/modelo/abanicos.test.ts             NUEVO
app/src/modelo/operaciones.ts               LECTURA (no editar)
app/src/serializacion/json.ts               EDIT aditivo (round-trip Modelo.abanicos)
app/src/serializacion/json.test.ts          EDIT aditivo
app/src/opl/generar.ts                      EDIT aditivo (caso abanico XOR/O)
app/src/opl/generar.test.ts                 EDIT aditivo
app/src/render/jointjs/linkAssets.ts        EDIT aditivo (SVG conector XOR/O si no existe)
app/src/render/jointjs/JointCanvas.tsx      EDIT aditivo (overlay conector cerca del puerto)
app/src/render/jointjs/factory.ts (o eq.)   EDIT aditivo
app/src/store.ts                            EDIT aditivo (acciones formarAbanico, alternarOperador, disolverAbanico)
app/src/ui/Inspector.tsx (o partials)       EDIT aditivo (sección Abanico cuando enlace es parte de uno)
app/src/completitud.test.ts                 EDIT aditivo (Record<OperadorAbanico, true>)
assets/svg/links/                           EDIT solo si falta SVG canónico XOR u O
```

**Lectura permitida**: cualquier archivo de `app/` y `opm-extracted/`.

**Prohibido**: editar `operaciones.ts`, `validaciones.ts`, `plegado.ts`, `Enlace.origenId/destinoId` (terreno L1), `modificadores.ts` (L3), `PanelAvisos.tsx` (L4), `HANDOFF`, HU.

## 5. Restricciones de no-colisión

1. **No tocar `Enlace.origenId/destinoId`**. L1 lo migra a `ExtremoEnlace`. L2 solo lee `enlace.origenId.id` y `enlace.origenId.kind` (asumiendo que L1 ya mergeo). Si L2 desarrolla en paralelo antes de L1: usar `enlace.origenId` como string opaque y hacer rebase trivial al merge.
2. **`tipos.ts`**: agregar `Abanico` en bloque al final del archivo. No editar ni reordenar tipos existentes.
3. **`Modelo.abanicos`** es `Record<Id, Abanico>` top-level análogo a `Modelo.estados`. Default `{}` al crear modelo.
4. **`abanicos.ts` es la única fuente de mutación de Abanicos**. `operaciones.ts` no toca abanicos. El store importa de `abanicos.ts`.
5. **OPL**: agregar caso al switch de plantillas, no reescribir casos existentes.
6. **Render**: el conector lógico es un overlay independiente del enlace en JointJS (un Element o un Path adicional cerca del puerto). No modifica el render de los enlaces miembros.

## 6. Slice mínimo shippeable

### 6.1 Modelo
- `tipos.ts`:
  ```ts
  export type OperadorAbanico = "O" | "XOR";
  export interface Abanico {
    id: Id;
    opdId: Id;
    puertoEntidadId: Id;     // proceso o entidad de origen del cluster
    operador: OperadorAbanico;
    enlaceIds: Id[];          // >= 2; orden estable de inserción
  }
  // Modelo extendido:
  abanicos: Record<Id, Abanico>;
  ```

### 6.2 Operaciones (`abanicos.ts`)
```ts
export function formarAbanico(modelo: Modelo, opdId: Id, enlaceIds: Id[], operador: OperadorAbanico = "O"): Modelo;
export function agregarRamaAAbanico(modelo: Modelo, abanicoId: Id, enlaceId: Id): Modelo;
export function quitarRamaDeAbanico(modelo: Modelo, abanicoId: Id, enlaceId: Id): Modelo;
export function alternarOperadorAbanico(modelo: Modelo, abanicoId: Id, operador: OperadorAbanico): Modelo;
export function disolverAbanico(modelo: Modelo, abanicoId: Id): Modelo;

// Detección automática (helper opcional):
export function detectarPuertoCompartido(modelo: Modelo, opdId: Id, enlace: Enlace): Abanico | undefined;
```

Reglas de invariante:
- `enlaceIds.length >= 2` siempre. Si baja a 1 o 0, `disolverAbanico` se invoca automáticamente.
- Todos los enlaces de un abanico tienen el mismo `origenId` (mismo puerto). Si difiere, falla.
- Tipo de los enlaces miembros debe ser homogéneo (todos consumo, o todos resultado, etc.) — verificar y documentar.
- Si el modelador conecta una segunda rama desde un puerto que ya tiene abanico, la rama se agrega al abanico existente con `agregarRamaAAbanico`. Si no había abanico, se forma con las dos ramas.

### 6.3 Serialización
- `Modelo.abanicos` viaja como `Record<Id, Abanico>` en JSON. Default `{}` al deserializar si falta. Modelos legacy cargan sin pérdida.

### 6.4 OPL-ES
- Caso nuevo en `generar.ts`: para cada abanico, emitir oración única que enumere los miembros con la conjunción correcta:
  - `XOR`: `*P* requiere exactamente uno de **A**, **B** o **C**.`
  - `O`: `*P* requiere al menos uno de **A**, **B** o **C**.`
- El verbo y la conjugación dependen del tipo de enlace homogéneo del cluster. Citar `[OPL-ES T1]` o cláusula análoga (consultar `opm-opl-es.md`).

### 6.5 Render JointJS
- Overlay del conector cerca del puerto del proceso:
  - **XOR**: triángulo equilátero pequeño (lado ~10 px), rotado para apuntar hacia las ramas. Color `#586D8C`.
  - **O**: arco curvo (Bezier) que abraza las ramas cerca del puerto. Trazo 1.5 px, color `#586D8C`.
- Posicionamiento: el overlay se ancla al puerto del proceso y se reposiciona al mover el proceso. Si JointJS soporta tools/decorators, usarlos; de lo contrario, render como Element separado.
- SVG: revisar `assets/svg/links/` para conector existente; si falta, agregar `assets/svg/links/logical/xor.svg` y `or.svg` siguiendo dimensiones JOYAS.

### 6.6 UX inspector
- Cuando un enlace seleccionado pertenece a un abanico, mostrar sección "Abanico" en inspector con:
  - Operador (toggle XOR / O).
  - Lista de ramas miembros (clic navega).
  - Botón "Quitar de abanico" (`quitarRamaDeAbanico`).
- Cuando dos o más enlaces seleccionados comparten puerto y no forman abanico, mostrar acción "Formar abanico".

### 6.7 Cross-capa
- `completitud.test.ts`: agregar `const _coverageOperador: Record<OperadorAbanico, true> = { O: true, XOR: true };`. TS rompe si se agrega operador sin actualizar todas las capas.

## 7. Tests obligatorios

### Unit tests (estimado +10 tests)
- `abanicos.test.ts`:
  - `formarAbanico` con 2 enlaces del mismo puerto crea abanico.
  - `formarAbanico` con enlaces de puertos distintos falla.
  - `agregarRamaAAbanico` agrega tercera rama.
  - `quitarRamaDeAbanico` con `enlaceIds.length === 2` dispara `disolverAbanico`.
  - `alternarOperadorAbanico` cambia operador y preserva miembros.
  - `disolverAbanico` elimina abanico sin tocar enlaces.
- `json.test.ts`:
  - Round-trip preserva `Modelo.abanicos`.
  - Modelo legacy sin `abanicos` deserializa con `abanicos = {}`.
- `generar.test.ts`:
  - OPL XOR: "exactamente uno de **A** o **B**".
  - OPL O: "al menos uno de **A** o **B**".
- `completitud.test.ts`:
  - `Record<OperadorAbanico, true>` completo.

### Smoke browser (estimado +1 test)
- Crear proceso con dos consumos al mismo puerto → verificar formación automática de abanico, conector visible, OPL emerge → alternar XOR/O → guardar y recargar.

## 8. Verificación

```bash
cd app
bun run check          # +10 unit tests
bun run browser:smoke  # +1 smoke
bun run build          # verde
```

## 9. Decisiones bloqueadas (no reabrir)

- `Modelo.abanicos` top-level (no anidado en Enlace). Razón: consistencia con `Modelo.estados`.
- Operadores limitados a `O` y `XOR`. NAND/NOR/Y excluidos por SSOT.
- Heterogeneidad de tipos en cluster: rechazar. Razón: semántica OPM exige operador sobre conjunto homogéneo.
- HU-15.013 (ramas a estados): fuera del slice; depende de L1.

## 10. Decisiones que tomás vos (documentar en commit)

- Detección de puerto compartido: automática al crear segunda rama, vs explícita por acción del modelador. Elegir y documentar.
- Render conector XOR: triángulo SVG estático vs JointJS tool decorator. Elegir y documentar.
- Comportamiento al eliminar un enlace miembro: recalcular abanico (auto-disolver si <2) o dejar inválido y advertencia. Elegir y documentar.

## 11. Forma del entregable

Commits sugeridos:
- `feat(modelo): tipo Abanico y Modelo.abanicos`.
- `feat(modelo): operaciones formar/alternar/disolver abanico en abanicos.ts`.
- `feat(serializacion): round-trip Modelo.abanicos lossless legacy`.
- `feat(opl): plantillas XOR y O para abanicos logicos`.
- `feat(render): conectores XOR/O sobre puerto compartido`.
- `feat(ui): seccion Abanico en inspector`.
- `test(...)` separado o integrado.

Co-author footer estándar. No tocar HANDOFF ni HU.
