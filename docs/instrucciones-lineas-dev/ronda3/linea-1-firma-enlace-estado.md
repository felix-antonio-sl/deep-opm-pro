# Línea 1 — Firma de Enlace con extremo Estado (HU-13.014 cascada M0)

## 1. Misión

Cerrar EPICA-13 a nivel M0 extendiendo la firma de `Enlace` para que `origenId` y `destinoId` puedan apuntar a `Estado.id` además de `Entidad.id`. Habilita expresar transiciones canónicas OPM ("Cocinar cambia Huevo de crudo a cocido") y desbloquea HU dependientes en EPICA-13 y EPICA-15.

**Slice mínimo entregable**:
- Tipo `ExtremoEnlace = { kind: "entidad" | "estado"; id: Id }` (o variante union etiquetada equivalente).
- `Enlace.origenId` y `Enlace.destinoId` migran a `ExtremoEnlace`. Helper de resolución a `Entidad` desde cualquier extremo.
- `validarFirmaEnlace`: solo enlaces procedurales aceptan extremo estado; estructurales lo rechazan con mensaje y cita SSOT.
- `refrescarEnlacesExternosDerivados`: preserva `kind` al proyectar a OPD hijo.
- Render JointJS: el extremo del enlace ancla a la cápsula de estado correcta.
- OPL-ES: plantilla TS3 "{P} cambia {O} de {e1} a {e2}" cuando consumo+resultado comparten objeto+proceso con kinds estado.
- Hidratación legacy: modelos sin `kind` cargan sin pérdida (`kind: "entidad"` por default).
- `completitud.test.ts` extendido con `Record<ExtremoKind, true>`.

**Pendientes explícitos** (no entran a este slice; quedan para ronda 4):
- HU-15.013 (ramas de abanico a estados distintos): consume firma L1 + abanico L2; integra al final.
- HU-15.005 (etiqueta de ruta sobre rama a estado): depende de HU-15.013.
- HU-15.017 (sustituir N conexiones por NOT estado): depende de L3 (modificador NO) además de L1.
- Edición visual del extremo arrastrando entre cápsulas: posible pero opcional; basta selector inspector si aprieta el tiempo.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-13.014 | `docs/historias-usuario-v2/epicas/epica-13-canvas-estados.md` (sección 13.014) | Crear enlace dirigido a estado específico |
| HU-13.015 | (mismo archivo, 13.015) | Convertir efecto en par entrada-salida |
| HU-13.018 | (mismo archivo, 13.018) | OPL-ES TS3 transición |
| HU-13.001, HU-13.010, HU-13.011 | (mismo archivo) | Contexto: estados ya existen como `Modelo.estados` top-level con designaciones |

Y como referencia (NO implementar aquí):
- HU-15.005 y HU-15.013 (EPICA-15) consumirán esta firma; la cobertura de pruebas debe garantizar que su implementación posterior no requiera segundo refactor.

## 3. Anclaje a evidencia

- **SSOT primaria**:
  - `opm-iso-19450-es.md` — `[V-61]` enlaces y endpoints, `[V-237]` axiomas de estados, `[Glos 3.68]` estados.
  - `opm-opl-es.md` — `[OPL-ES TS3]` plantilla canónica de transición.
  - `opm-visual-es.md` — render del extremo apuntando a cápsula de estado.
- **opm-extracted/** (lectura obligatoria antes de inventar):
  - `opm-extracted/src/app/models/LogicalPart/` y `VisualPart/` — patrón Logical/Visual para endpoints multi-tipo.
  - `opm-extracted/src/app/models/consistency/structural.rules.ts` — reglas de validación de firma a leer (no copiar) para inspirarse en cómo OPCloud rechaza endpoints inválidos.
  - `opm-extracted/src/app/models/Actions/` — buscar acciones tipo `addStateLink` o `connectToState` para semántica observable.
  - Ejecutar: `rg -i "state.*link|link.*state|stateId|origin.*state|target.*state" opm-extracted/src/app/`.
- **Estado actual**:
  - `app/src/modelo/tipos.ts` — `Enlace`, `Estado`. La extensión va aquí.
  - `app/src/modelo/operaciones.ts` — `validarFirmaEnlace`, `refrescarEnlacesExternosDerivados`, `crearEnlace`, `splitEffectEnPar`. Cascada principal.
  - `app/src/modelo/validaciones.ts` — regla `procedural-no-objeto-objeto`. Considerar si extender o agregar regla nueva `estructural-no-acepta-estado`.
  - `app/src/serializacion/json.ts` — round-trip; debe migrar legacy.
  - `app/src/opl/generar.ts` — agregar caso TS3.
  - `app/src/render/jointjs/JointCanvas.tsx` y factory — cómo el enlace JointJS define `source`/`target`.
  - `app/src/completitud.test.ts` — agregar `Record<ExtremoKind, true>`.

## 4. Archivos permitidos (scope estricto)

```
app/src/modelo/tipos.ts                     EDIT aditivo (ExtremoEnlace, Enlace.origenId/destinoId)
app/src/modelo/operaciones.ts               EDIT aditivo acotado (helpers de extremo, validarFirmaEnlace, refrescarEnlacesExternosDerivados, splitEffectEnPar)
app/src/modelo/operaciones.test.ts          EDIT aditivo
app/src/modelo/validaciones.ts              EDIT aditivo (regla "extremo estado solo en proceduralmente legales")
app/src/modelo/validaciones.test.ts         EDIT aditivo
app/src/serializacion/json.ts               EDIT aditivo (lossless legacy: kind opcional con default "entidad")
app/src/serializacion/json.test.ts          EDIT aditivo (fixture legacy)
app/src/opl/generar.ts                      EDIT aditivo (caso TS3 transición)
app/src/opl/generar.test.ts                 EDIT aditivo
app/src/render/jointjs/linkAssets.ts        LECTURA
app/src/render/jointjs/JointCanvas.tsx      EDIT aditivo (resolver source/target con kind)
app/src/render/jointjs/factory.ts (o eq.)   EDIT aditivo
app/src/store.ts                            LECTURA (no editar; las acciones existentes ya pasan por operaciones.ts)
app/src/ui/Inspector.tsx (o partials)       EDIT aditivo (selector "Apuntar a estado: <dropdown>")
app/src/completitud.test.ts                 EDIT aditivo
```

**Lectura permitida**: cualquier archivo de `app/` y `opm-extracted/` para informarse.

**Prohibido**: tocar `app/src/modelo/abanicos.ts` (no existe aún, lo crea L2), `modificadores.ts` (L3), `plegado.ts` extender (L5 lo extiende; lectura sí), `PanelAvisos.tsx` (L4), `Toolbar.tsx`, archivos de épicas, HANDOFF.

## 5. Restricciones de no-colisión

1. **`tipos.ts`**: extender `Enlace` agregando `ExtremoEnlace`. Mantener compatibilidad de tipos: si la migración requiere cambiar `origenId: Id` por `origenId: ExtremoEnlace`, hacerlo y exponer helper `extremoEsEntidad(e)`, `extremoEsEstado(e)` para call-sites de lectura. Esto **es el cambio cross-app principal** — TS gritará en cada call-site.
2. **`operaciones.ts`**: edición aditiva acotada solo a las funciones citadas en el slice. **No** introducir lógica nueva en otras funciones por arrastre. Si una función queda `unused` post-cambio, dejarla como está; L5 no lo necesita.
3. **`validaciones.ts`**: agregar regla nueva en lugar de modificar regla existente. Citar SSOT.
4. **JSON retro-compatible**: deserializar `origenId: "ent_xxx"` (string legacy) debe asumir `{ kind: "entidad", id: "ent_xxx" }`. Test obligatorio con fixture viejo.
5. **`completitud.test.ts`**: agregar `Record<ExtremoKind, true>` y `Record<DesignacionEstado, true>` ya existe; no duplicar.

## 6. Slice mínimo shippeable

### 6.1 Modelo
- `tipos.ts`:
  ```ts
  export type ExtremoKind = "entidad" | "estado";
  export interface ExtremoEnlace { kind: ExtremoKind; id: Id; }
  export interface Enlace {
    // ...
    origenId: ExtremoEnlace;
    destinoId: ExtremoEnlace;
    // ...
  }
  ```
- Helper en `operaciones.ts` o nuevo `extremos.ts`:
  ```ts
  export function entidadDeExtremo(modelo: Modelo, extremo: ExtremoEnlace): Entidad;
  export function objetoContenedorDeExtremo(modelo: Modelo, extremo: ExtremoEnlace): Entidad | undefined;
  // estado.entidadId resuelve la entidad contenedora; entidad resuelve a sí misma
  ```

### 6.2 Validación de firma
- En `validaciones.ts`, regla nueva `estructural-no-acepta-extremo-estado` (severidad **error**):
  - Para todo enlace estructural (agregación, exhibición, generalización, clasificación), si `origenId.kind === "estado"` o `destinoId.kind === "estado"`, generar Aviso con cita `[V-237]` y `[V-239]`.
- En `operaciones.ts:validarFirmaEnlace`, integrar la verificación bloqueante en creación.

### 6.3 Serialización
- `json.ts`: al serializar, extremo viaja como `{ kind, id }`. Al deserializar, si encuentra `string`, asume `{ kind: "entidad", id }`. Test con fixture legacy.

### 6.4 OPL-ES TS3
- En `opl/generar.ts`: detectar el patrón "consumo de O en estado e1 + resultado de O en estado e2 con mismo proceso P" y emitir oración única `*P* cambia **O** de \`e1\` a \`e2\`.` con cita `[OPL-ES TS3]`. Cuando solo hay consumo a estado o solo resultado a estado, mantener oraciones individuales con plantillas existentes pero con la mención del estado en la oración (por ejemplo `*P* consume **O** en estado \`e1\``).
- Si `splitEffectEnPar` produjo objeto sintético, asegurarse que las oraciones derivadas usen el patrón con kind correcto.

### 6.5 Render
- En `JointCanvas.tsx` o adaptador: cuando un extremo tiene `kind: "estado"`, el endpoint visual del enlace JointJS apunta a la cápsula del estado dentro del rectángulo de la entidad contenedora. Coordenadas: usar el centro horizontal de la cápsula de estado y la altura correspondiente dentro del bbox del padre.
- Si el estado está suprimido (`estado.suprimido === true`, ver HU-13.007 — no implementado, pero el campo puede llegar), el endpoint cae al borde de la entidad contenedora.

### 6.6 UX inspector
- En el partial de Inspector para enlace, agregar selector "Apuntar a estado específico" con dropdown de estados de la entidad correspondiente. Estado inicial: `"(toda la entidad)"`. Al elegir un estado, `extremo.kind = "estado"; extremo.id = estado.id`. Al volver a `"(toda la entidad)"`, `extremo.kind = "entidad"; extremo.id = entidad.id`.
- Disponible solo si la entidad endpoint tiene >= 2 estados.

### 6.7 Cross-capa
- `completitud.test.ts`: agregar `Record<ExtremoKind, true>` que TS exige completar en todas las capas (kernel, validación, serialización, OPL, render). Esto fuerza al desarrollador futuro a actualizar todas las capas si extiende `ExtremoKind`.

## 7. Tests obligatorios

### Unit tests (estimado +12 tests)
- `operaciones.test.ts`:
  - Crear enlace con `destinoId.kind = "estado"` válido en proceso → consumo, agente, instrumento, efecto, resultado.
  - Crear enlace estructural con extremo estado → falla con mensaje de validación.
  - `splitEffectEnPar` preserva kinds en consumo y resultado.
  - `refrescarEnlacesExternosDerivados` preserva kind en proyección al OPD hijo.
- `validaciones.test.ts`:
  - Regla `estructural-no-acepta-extremo-estado` detecta agregación/exhibición/generalización/clasificación con extremo estado.
- `json.test.ts`:
  - Round-trip preserva `kind` y `id`.
  - Hidratar fixture legacy (string `id`) asume `kind: "entidad"`.
- `generar.test.ts`:
  - Patrón consumo+resultado con mismo objeto y kinds estado emite oración única TS3.
  - Solo consumo a estado: oración individual con mención del estado.
- `completitud.test.ts`:
  - `Record<ExtremoKind, true>` completo.

### Smoke browser (estimado +1-2 tests)
- `bun run browser:smoke` agregar caso: crear modelo "Cocinar cambia Huevo de crudo a cocido" → verificar OPL TS3 emergente y render con extremos en cápsulas correctas → guardar y recargar → ronda completa.

## 8. Verificación

```bash
cd app
bun run check          # >= 175 unit tests verdes (163 base + ~12 nuevos)
bun run browser:smoke  # >= 21 smoke verdes
bun run build          # verde, drift bundle < +20 KB
```

## 9. Decisiones bloqueadas (no reabrir)

- `ExtremoEnlace` es **objeto etiquetado**, no string fundido (`ent_xxx` vs `est_xxx`). Razón: type safety y exhaustividad cross-capa.
- Solo enlaces procedurales aceptan extremo estado. Estructurales rechazan. Razón: SSOT `[V-237]` y `[V-239]`.
- Hidratación legacy es **lossless**: cualquier modelo serializado pre-L1 carga sin pérdida.
- HU-15.013 (ramas a estados distintos) NO entra a L1. Será consecuencia natural cuando L2 (abanicos) y L1 estén en `main`.

## 10. Decisiones que tomás vos (documentar en commit)

- Helpers de resolución: archivo nuevo `app/src/modelo/extremos.ts` o ubicar en `operaciones.ts`. Documentar elección.
- Render del extremo cuando kind=estado: anclar al centro de cápsula vs anclar al borde superior. Elegir y documentar.
- UX inspector: dropdown vs lista de radios para selector. Elegir y documentar.
- Cita SSOT exacta en mensajes de error de validación: `[V-237]` o `[V-239]` o ambos. Elegir y documentar.

## 11. Forma del entregable

Commits sugeridos (dividir si crece):
- `feat(modelo): ExtremoEnlace y migracion de Enlace.origenId/destinoId`.
- `feat(validaciones): regla estructural-no-acepta-extremo-estado`.
- `feat(serializacion): hidratacion lossless de extremos legacy`.
- `feat(opl): plantilla TS3 transicion entre estados`.
- `feat(render): puerto del enlace ancla a capsula de estado`.
- `feat(ui): selector de extremo estado en inspector`.
- `test(...)` separado o integrado por commit.

Co-author footer estándar. No tocar HANDOFF ni HU.
