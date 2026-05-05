# Línea 5 — Plegado parcial nesting y filas activas

## 1. Misión

Resolver el pendiente de EPICA-18 para ronda 4: soportar anidamiento controlado de plegado parcial y hacer que las filas plegadas puedan participar en enlaces sin extraer la parte completa al canvas.

**Slice mínimo entregable**: decisión Q18.1 afirmativa y acotada, helper `plegadoNesting.ts`, orden compacto estable/configurable, bloqueo de plegado parcial sin refinadores desde UX, targets de fila plegada para crear enlace y tests.

**Fuera de slice**: navegación al OPD desplegado (HU-18.013), configuración global de umbral "y N más", edición drag de filas plegadas.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-18.008 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` | Conectar enlace desde una parte plegada a otra cosa. |
| HU-18.014 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` | Bloquear plegado parcial cuando la cosa no tiene refinadores. |
| HU-18.015 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` | Preservar orden compacto de partes. |
| HU-18.001, HU-18.002 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` | Base de vista parcial y lista interna. |
| Q18.1 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` | Pregunta abierta: anidamiento de plegado parcial. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md` glosario y sección de despliegue/plegado: los mecanismos revelan u ocultan refinadores intra-modelo.
  - `opm-iso-19450-es.md` V-61/constructos: enlaces siguen refiriendo a cosas del modelo, no a filas visuales.
  - `opm-visual-es.md` para gramática visual de refinamiento y abstracción.
- **Corpus interno reusable**:
  - `docs/JOYAS.md` §11 documenta in-zoom/refinamiento y separación visual/lógica.
  - `opm-extracted/src/app/models/consistency/bringConnectedRules.ts` evidencia reglas de traer conectados por relación/refinamiento.
  - `opm-extracted/src/app/configuration/elementsFunctionality/linkDrawing.ts` muestra patrones de endpoint visual frente a states/embedded cells; usar como referencia para targets de fila.
- **Estado actual del código**:
  - `app/src/modelo/plegado.ts` ya tiene `partesDePlegado`, `filasPlegadoParcial`, extracción/reinserción y contador.
  - `app/src/render/jointjs/proyeccion.ts` ya crea `partesPlegadas` metadata para filas y `parteEntidadDesdeSelector(...)` en `JointCanvas.tsx` extrae con doble clic.
  - `app/src/serializacion/json.ts` ya persiste `parteExtraidaDe` y `modoPlegado`.

## 4. Archivos permitidos

```text
app/src/modelo/tipos.ts                         EDIT aditivo si se agrega ordenPartes?
app/src/modelo/plegado.ts                       EDIT aditivo
app/src/modelo/plegado.test.ts                  EDIT aditivo
app/src/render/jointjs/plegadoNesting.ts        NUEVO
app/src/render/jointjs/proyeccion.ts            EDIT aditivo acotado
app/src/render/jointjs/proyeccion.test.ts       EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx          EDIT aditivo
app/src/store.ts                                EDIT aditivo
app/src/ui/InspectorEntidad.tsx                 EDIT aditivo
app/src/serializacion/json.ts                   EDIT aditivo si se agrega ordenPartes?
app/src/serializacion/json.test.ts              EDIT aditivo si se agrega ordenPartes?
app/e2e/opm-smoke.spec.ts                       EDIT aditivo
opm-extracted/**                                LECTURA
```

## 5. Restricciones de no-colisión

- No tocar `abanicos.ts`, `rutas.ts`, `autoinvocacion.ts` ni lógica de enlaces a estado.
- Si se agregan targets de fila para enlaces, reutilizar la acción de store de L2 si ya existe; si no, crear acción separada con nombre específico para parte plegada.
- No cambiar el significado de `parteExtraidaDe`: sigue identificando apariencias extraídas, no filas plegadas.
- Anidamiento debe ser acotado: máximo 1 nivel renderizado inicialmente, con indicador de que la parte tiene sus propias partes; no intentar recursión infinita.

## 6. Slice mínimo shippeable

### Modelo

Opción preferida:

```ts
export interface Apariencia {
  ordenPartes?: "alfabetico" | "creacion";
}
```

Si no hace falta persistir orden aún, mantener `alfabetico` por default y documentar por qué HU-18.015 queda cubierta por orden estable, no configurable.

### Operaciones

Extender `plegado.ts` con helpers puros:

```ts
export function partesDePlegadoOrdenadas(modelo: Modelo, apariencia: Apariencia): PartePlegada[];
export function partePlegadaTienePartes(modelo: Modelo, parteEntidadId: Id): boolean;
export function cambiarOrdenPartes(modelo: Modelo, opdId: Id, aparienciaId: Id, orden: "alfabetico" | "creacion"): Resultado<Modelo>;
```

Para HU-18.014, `cambiarModoPlegado(..., "parcial")` ya falla si no hay partes; la UI debe ocultar/deshabilitar la acción antes de llegar al error.

### Serialización

Solo si se agrega `ordenPartes`: round-trip opcional con default `alfabetico`.

### Render

`plegadoNesting.ts`:

```ts
export function filasPlegadoConNesting(args: {
  modelo: Modelo;
  opdId: Id;
  padreAparienciaId: Id;
}): FilaPlegadoParcialExtendida[];
```

Requisitos:

- Fila de parte con refinadores propios muestra indicador visual discreto (`▸` o suffix compacto).
- La fila sigue siendo target de doble clic para extraer.
- Si `modoEnlace` está activo y se hace clic en fila, se crea enlace con extremo entidad de la parte, anclado visualmente al rectángulo padre con etiqueta de parte.
- El render no debe aumentar sin límite la altura por nesting; un nivel visible basta.

### OPL

Sin cambios obligatorios. El OPL ya resume partes; si se agrega indicador de nesting, no verbalizarlo todavía.

### UX

En `InspectorEntidad.tsx`:

- Si no hay partes plegables, no mostrar acción `Plegado parcial` o mostrarla disabled con title corto.
- Si hay partes, permitir cambiar orden si se implementa `ordenPartes`.
- Para filas plegadas, clic en modo enlace crea enlace desde/hacia la parte sin extraerla; doble clic conserva extracción existente.

### Cross-capa

Si se agrega union `OrdenPartesPlegado`, agregar `Record<OrdenPartesPlegado, true>` en `completitud.test.ts`.

## 7. Tests obligatorios

- `plegado.test.ts`: no permite modo parcial sin refinadores.
- `plegado.test.ts`: orden alfabético estable y, si aplica, orden de creación.
- `plegado.test.ts`: parte plegada con refinamiento propio se marca como anidable sin expandir recursivamente.
- `proyeccion.test.ts`: fila plegada con partes propias expone indicador y target estable.
- `store.test.ts` o smoke: crear enlace desde fila plegada sin extraerla mantiene `enlace.origenId/destinoId` como entidad de la parte.
- `opm-smoke.spec.ts`: activar plegado parcial, iniciar enlace desde fila, verificar label/proxy y export JSON.

## 8. Verificación

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- `parteExtraidaDe` no cambia de significado.
- El modelo de enlace refiere a `entidadId`; la fila plegada es solo endpoint visual.
- Nesting completo recursivo queda fuera; esta línea implementa un nivel visible y reusable.
- HU-18.013 queda fuera.

## 10. Decisiones que tomas vos (documentar en commit)

- Si `ordenPartes` se persiste ahora o si se cubre HU-18.015 con orden estable por default.
- Símbolo visual del nesting de fila.
- Comportamiento de clic en fila cuando `modoEnlace` está activo y la fila ya está extraída.
- Si el enlace desde fila usa etiqueta de proxy existente o una etiqueta nueva específica.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): orden estable y nesting acotado en plegado parcial`
- `feat(render): filas plegadas anidables y targets de enlace`
- `feat(ui): bloquea plegado parcial sin refinadores`
- `test(...)` por capa

No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.
