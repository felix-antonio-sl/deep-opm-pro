# Línea 2 — Modificadores avanzados de enlace + ruta editable + advertencia consumo

## 1. Misión

Cerrar **EPICA-15 al 95%+** y completar el kernel de modificadores procedurales:
- **Subtipos de modificador**: distinguir Condición / Evento / NO con marcadores OPM canónicos (HU-11.026/.027 + HU-15.014/.015/.016).
- **Probabilidad visible**: render del valor cuando `modificador === "evento"` y `probabilidad` definida (HU-15.018).
- **Ruta editable** sobre rama de abanico hacia estado: input texto libre que aparece como etiqueta sobre la línea y "Por ruta X" en OPL (HU-15.005..007 cierre — están como parciales, dejarlas cubiertas).
- **Mover puerto**: diálogo "Mover Puerto" + remover relación existente (HU-15.022/.023).
- **Advertencia consumo duplicado**: validador emite aviso cuando 2 enlaces consumo apuntan al mismo objeto desde el mismo proceso (HU-15.025).

Slice mínimo: extensión kernel `Enlace.subtipoModificador?` + render markers + OPL extendido + Inspector enlace.

**Fuera de slice**:
- Sustituir conexión manual por NO sobre estado excluido (HU-15.017): requiere semántica adicional, difiere a ronda 11.
- Validación cross-OPD profunda más allá de consumo duplicado.
- Refactor de `acciones-enlace.ts` (ya partido en ronda 9.5).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L2 |
|---|---|---|
| HU-11.026 — Tabla de tipos extendida (subtipo enlace) | parcial | Decisión: `subtipoModificador` solo para `modificador="evento"` o `"condicion"`. NO se introduce `enlace.subtipo` general. |
| HU-11.027 — Modificador como atributo | cubierto base; faltan subtipos | Extender con `subtipoModificador?: "C" \| "E" \| "no"` aditivo. |
| HU-15.014 — Subtipo Condición | absorbida en .027 | Render badge "C" + oración OPL "si X, ..." |
| HU-15.015 — Subtipo Evento | parcial (existe `modificador="evento"`) | Render badge "E" + probabilidad opcional. |
| HU-15.016 — Modificador NO | parcial (existe `modificador="no"`) | Render badge "¬" + oración OPL "no X". |
| HU-15.018 — Probabilidad de evento visible | cubierto en kernel; falta render | Render del porcentaje junto al badge "E" cuando `probabilidad` definida. |
| HU-15.022 — Mover Puerto diálogo | pendiente | `DialogoMoverPuerto.tsx` con selector de entidad/estado destino. |
| HU-15.023 — Remover relación desde diálogo | pendiente | Botón "Remover" dentro del diálogo Mover Puerto. |
| HU-15.025 — Advertencia consumo duplicado | parcial | Regla en `validaciones.ts`: aviso severidad media cuando 2+ enlaces `consumo` con mismo origen y destino. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.* (Modifiers): condición/evento/negación como anotaciones de enlace.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-opl-es.md` D5..D8: oraciones OPL para modificadores (`oracionCondicion`, `oracionEvento`, `oracionNegada`). Ya existen en `opl/generadores/procedural.ts`.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-visual-es.md` V-* badges textuales sobre línea.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/Logical/OpmLogicalLink.ts` (si existe): atributos `condition`/`event`/`negation`.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/components/commands/EditModifierCommand.ts` (si existe): patrón command.
- **Estado actual del código (post-9.5)**:
  - `app/src/modelo/tipos/enlace.ts`: ya tiene `Modificador = "condicion" | "evento" | "no"` + `Enlace.modificador?` + `Enlace.probabilidad?`. **L2 agrega `subtipoModificador?: "C" | "E" | "no"`** como refinamiento del modificador (redundante pero permite badges distintos sin reabrir el campo `modificador`).
  - `app/src/modelo/modificadores.ts`: ya tiene `aplicarModificador`, `quitarModificador`, `definirProbabilidad`. **L2 agrega `aplicarSubtipoModificador`**.
  - `app/src/render/jointjs/composers/markers.ts` (4.8 KB): tiene render de badges existente. **L2 extiende con badges C/E/¬**.
  - `app/src/opl/generadores/procedural.ts`: tiene `oracionEvento`, `oracionCondicion`, `oracionNegada`. **L2 las refina con probabilidad cuando aplica**.
  - `app/src/modelo/rutas.ts` y `app/src/render/jointjs/rutaLabels.ts` ya cierran HU-15.005..007 (cubiertas en ronda 7). L2 verifica que están y no las rompe.
  - `app/src/modelo/validaciones.ts` (390 LOC): ya tiene reglas. **L2 agrega regla `advertirConsumoDuplicado`**.

## 4. Archivos permitidos

```text
app/src/modelo/tipos/enlace.ts                    EDIT aditivo (subtipoModificador?: "C" | "E" | "no")
app/src/modelo/modificadores.ts                   EDIT extiende (aplicarSubtipoModificador)
app/src/modelo/modificadores.test.ts              EDIT aditivo
app/src/modelo/operaciones/enlaces.ts             EDIT extiende opcional (moverPuerto)
app/src/modelo/operaciones/enlaces.test.ts        EDIT aditivo opcional
app/src/modelo/validaciones.ts                    EDIT aditivo (advertirConsumoDuplicado)
app/src/modelo/validaciones.test.ts               EDIT aditivo
app/src/render/jointjs/composers/markers.ts       EDIT aditivo (badges C/E/¬ + render probabilidad)
app/src/render/jointjs/composers/markers.test.ts  EDIT aditivo
app/src/opl/generadores/procedural.ts             EDIT aditivo (refinar oraciones modificador con probabilidad)
app/src/opl/generadores/procedural.test.ts        EDIT aditivo
app/src/serializacion/validarEnlaces.ts           EDIT aditivo (validar subtipoModificador)
app/src/serializacion/validarEnlaces.test.ts      EDIT aditivo
app/src/store/modelo/acciones-enlace.ts           EDIT extiende (aplicarSubtipoModificador, moverPuertoEnlaceSeleccionado)
app/src/store/tipos.ts                            EDIT aditivo
app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx  EDIT aditivo (selector subtipo modificador C/E/¬)
app/src/ui/inspectorEnlace/SeccionRuta.tsx        EDIT verificar (HU-15.005..007 ya cubierto; ajustar si emerge gap)
app/src/ui/inspectorEnlace/SeccionExtremos.tsx    EDIT aditivo (botón "Mover Puerto")
app/src/ui/DialogoMoverPuerto.tsx                 NUEVO
app/e2e/opm-smoke.spec.ts                         EDIT aditivo (smoke modificador C/E/¬ + ruta + mover puerto + consumo duplicado)
opm-extracted/**                                  LECTURA
docs/HANDOFF.md                                   LECTURA (no editar)
docs/historias-usuario-v2/**                      LECTURA (no editar)
```

## 5. Restricciones de no-colisión

- **No tocar `tipos/apariencia.ts`** (territorio L1).
- **No tocar `tipos/entidad.ts`** (territorio L4).
- **No tocar `operaciones/refinamiento/*`** (territorio L3).
- **No tocar `operaciones/apariencias.ts`, `operaciones/entidad.ts`, `operaciones/estados.ts`, `operaciones/eliminacion.ts`** (otras territorios).
- **No tocar `composers/entidad.ts`, `composers/grid.ts`, `composers/imagenOverlay.ts`** (L1, L4).
- **No tocar `Toolbar.tsx`, `JointCanvas.tsx`, `App.tsx`** salvo si emerge un atajo nuevo (declarar y mínimo).
- **`composers/markers.ts`**: L2 agrega badges aditivos (C/E/¬ + render probabilidad). NO toca markers existentes.
- **`opl/generadores/procedural.ts`**: L2 refina oraciones existentes con probabilidad sin alterar el formato base. Tests existentes deben pasar; si pasan con la refinación, OK.
- **`store/modelo/acciones-enlace.ts`** ya existe (post-9.5). L2 agrega métodos al final del objeto retornado, sin reordenar los previos.
- **`opm-smoke.spec.ts`**: agregar smokes al final.

## 6. Slice mínimo shippeable

### 6.1 Capa modelo

```ts
// app/src/modelo/tipos/enlace.ts (aditivo)
export interface Enlace {
  // ... campos existentes
  subtipoModificador?: "C" | "E" | "no"; // refinamiento de modificador para distinguir UI/OPL/markers
}
```

```ts
// app/src/modelo/modificadores.ts (extiende)
export function aplicarSubtipoModificador(
  modelo: Modelo,
  enlaceId: Id,
  subtipo: "C" | "E" | "no",
): Resultado<Modelo> {
  // El subtipoModificador refina la presentación. El campo modificador ya existe;
  // este nuevo campo permite distinguir badge sin reabrir el modificador.
  // Validación: subtipo "C" requiere modificador="condicion"; "E" requiere "evento"; "no" requiere "no".
}
```

```ts
// app/src/modelo/validaciones.ts (aditivo)
export function advertirConsumoDuplicado(modelo: Modelo): Aviso[] {
  const avisos: Aviso[] = [];
  // Agrupar enlaces por (origenId, destinoId, tipo="consumo")
  // Si más de uno: aviso severidad "media", sugerir abanico OR/XOR.
  return avisos;
}
```

```ts
// app/src/modelo/operaciones/enlaces.ts (extiende opcional)
export function moverPuertoEnlace(
  modelo: Modelo,
  enlaceId: Id,
  lado: "origen" | "destino",
  nuevoExtremo: ExtremoEntrada,
  opcionRemover?: boolean,
): Resultado<Modelo> {
  // Si opcionRemover: elimina el enlace en lugar de moverlo.
  // Reusa apuntarExtremoEnlace(modelo, enlaceId, lado, nuevoExtremo) o eliminarEnlace.
}
```

### 6.2 Capa render

```ts
// app/src/render/jointjs/composers/markers.ts (aditivo)
// Agregar: si enlace.subtipoModificador === "C": badge "C" texto en path con fondo amarillo.
// Si === "E": badge "E" + probabilidad si definida (formato "70%").
// Si === "no": badge "¬" texto rojo.
// Posicionar a 50% de la línea con offset 12px arriba.
```

### 6.3 Capa OPL

```ts
// app/src/opl/generadores/procedural.ts (aditivo)
// Si enlace.subtipoModificador === "E" y enlace.probabilidad definida:
//   "(probabilidad: 70%)"
// Si === "C": "si <condicion>"
// Si === "no": "no"
// Reusar oracionEvento/Condicion/Negada existentes y refinar.
```

### 6.4 Capa UI

```tsx
// app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx (aditivo)
// Si enlace.modificador definido, mostrar selector subtipo:
// [C] [E] [¬]
// Click cambia subtipoModificador via store.
```

```tsx
// app/src/ui/DialogoMoverPuerto.tsx (NUEVO)
// Modal: selector entidad destino + opción "Remover relación".
// data-testid="dialogo-mover-puerto"
```

```tsx
// app/src/ui/inspectorEnlace/SeccionExtremos.tsx (aditivo)
// Botón "Mover Puerto" abre DialogoMoverPuerto pasando el enlace seleccionado.
```

## 7. Tests obligatorios

- **Tests existentes intactos**: 561 tests pasan sin tocar.
- **Tests aditivos** (~12 tests / ~40 expects):
  - `modificadores.test.ts`: aplicarSubtipoModificador valida coherencia con `modificador`.
  - `validaciones.test.ts`: advertirConsumoDuplicado emite aviso cuando hay 2+ consumos.
  - `operaciones/enlaces.test.ts`: moverPuertoEnlace cambia extremo / remueve.
  - `composers/markers.test.ts`: render badges C/E/¬ con/sin probabilidad.
  - `opl/generadores/procedural.test.ts`: oraciones con probabilidad y "no".
  - `serializacion/validarEnlaces.test.ts`: subtipoModificador roundtrip + default safe.
- **Smokes aditivos**:
  - `test("aplicar subtipo Evento + probabilidad 70% emite badge y OPL")`
  - `test("aplicar subtipo NO emite badge ¬ y oración OPL negada")`
  - `test("mover puerto desde diálogo cambia extremo del enlace")`
  - `test("dos consumos al mismo objeto emiten advertencia")`

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/modelo/modificadores.test.ts src/modelo/validaciones.test.ts src/modelo/operaciones/enlaces.test.ts src/render/jointjs/composers/markers.test.ts src/opl/generadores/procedural.test.ts src/serializacion/validarEnlaces.test.ts
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- **`Enlace.modificador` (existente, ronda 7)** se mantiene como campo principal: `condicion | evento | no`. NO se renombra ni elimina.
- **`Enlace.subtipoModificador?`** es **refinamiento aditivo** que distingue badge visual sin sobreponerse a `modificador`. JSON pre-ronda 10 hidrata sin `subtipoModificador` (default no badge especial).
- **Probabilidad** sigue en `enlace.probabilidad?` (ronda 7).
- **Ruta editable HU-15.005..007** ya está cubierta; no se reabre.
- **HU-15.017 (sustituir conexión manual por NO sobre estado excluido)** queda fuera. Difiere a ronda 11 (requiere semántica de negación sobre estados específicos).
- **No introducir `enlace.subtipo` como campo separado del modificador**: la decisión es refinar el modificador, no abrir un campo paralelo.

## 10. Decisiones que tomas vos (documentar en commit)

- **Render del badge "E"**: con o sin probabilidad si está definida. Recomendado: con (HU-15.018 lo pide).
- **Posición exacta de los badges en la línea del enlace**: depende del routing. Probar con `linkLabels` de JointJS o overlay SVG aparte.
- **`DialogoMoverPuerto.tsx`**: posición y estilos según `Dialogo.tsx` patrón. Si `Dialogo` ya provee infra, reusar.
- **Validación severidad de consumo duplicado**: "media" sugerida; si LCD del usuario lo prefiere "alta", documentar.
- **Si emergen smokes flaky**: documentar en reporte.

## 11. Forma del entregable

Commits sugeridos:

```
1. feat(enlace): subtipos modificador C/E/no + probabilidad visible + mover puerto + advertencia consumo

   - tipos/enlace.ts aditivo: subtipoModificador?: "C" | "E" | "no"
   - modificadores.ts extiende: aplicarSubtipoModificador
   - validaciones.ts aditivo: advertirConsumoDuplicado (HU-15.025)
   - operaciones/enlaces.ts extiende: moverPuertoEnlace (HU-15.022/.023)
   - composers/markers.ts aditivo: badges C/E/no + probabilidad
   - opl/generadores/procedural.ts aditivo: oraciones refinadas
   - inspectorEnlace/SeccionMultiplicidad.tsx aditivo: selector subtipo
   - inspectorEnlace/SeccionExtremos.tsx aditivo: boton Mover Puerto
   - DialogoMoverPuerto.tsx NUEVO
   - ~12 tests / ~40 expects nuevos
   - 4 smokes nuevos

   Cierra ~10 HU (HU-11.026/.027, HU-15.014..018, HU-15.022/.023, HU-15.025).
   EPICA-15 enlaces avanzados pasa de 18+1/23 a ~22+1/23.

   Refs: docs/instrucciones-lineas-dev/ronda10/linea-2-modificadores-enlace.md,
         SSOT opm-iso-19450-es.md §Modificadores, opm-opl-es.md D5-D8.

   Co-Authored-By: <implementador> <noreply@...>
```

**Reporte de cierre**:
- Hash + LOC nuevos.
- Output bun run check / smoke / build.
- Tests aditivos + conteo.
- Decisiones declaradas (de §10).
- Confirmación: tipos apariencia/entidad/refinamiento intactos; OPL roundtrip preservado para enlaces sin modificador.

**Qué NO tocar**: territorios L1/L3/L4/L5, tests existentes, JointCanvas.tsx, Toolbar.tsx (salvo si emerge atajo nuevo declarado), HANDOFF, historias-usuario-v2, JOYAS, customShapes.ts, in-vivo-test.mjs, home/.
