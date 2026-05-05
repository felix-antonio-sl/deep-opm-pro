# Línea 5 — Plegado parcial avanzado (EPICA-18)

## 1. Misión

Completar plegado parcial: **extracción** de partes al canvas, **reanclaje** de enlaces al proxy del padre al reinsertar, **contador "y N partes más"** y plantilla OPL con resumen pedagógico. Construye sobre el plegado parcial básico ya implementado (`apariencia.modoPlegado: "completo" | "parcial"`).

**Slice mínimo entregable**:
- Operación `extraerParteDePlegado(opdId, padreAparienciaId, parteEntidadId)`: crea apariencia independiente para la parte en el OPD actual, deja referencia al padre.
- Operación `reinsertarParteEnPlegado(opdId, padreAparienciaId, parteAparienciaId)`: elimina apariencia extraída, reancla enlaces al proxy del rectángulo padre con etiqueta de la parte.
- `apariencia.parteExtraidaDe?: { padreAparienciaId, parteEntidadId }` para distinguir partes extraídas de creaciones independientes.
- Render de la lista compacta interna muestra contador `y N partes más` cuando hay extracciones (HU-18.005).
- OPL "y N partes más" cuando N > umbral configurable (HU-18.010).
- Cuando se reinserta, los enlaces existentes a la parte siguen vivos visualmente apuntando al rectángulo padre con etiqueta.

**Pendientes explícitos** (no entran a este slice):
- Anidamiento (Q18.1): plegado parcial dentro de plegado parcial. Postergado.
- Configuración del umbral N (Q18.2): hardcodear umbral 3 en este slice; configurable en ronda 4.
- HU-18.013 (navegar al OPD desplegado desde rectángulo plegado): UX puro, queda para ronda UX.

## 2. HU base (lectura obligatoria antes de codificar)

| HU | Path | Aporta |
|---|---|---|
| HU-18.004 | `docs/historias-usuario-v2/epicas/epica-18-canvas-plegado-parcial.md` (18.004) | Extraer parte con doble clic |
| HU-18.005 | (mismo, 18.005) | Contador "y N más" |
| HU-18.006 | (mismo, 18.006) | Reinsertar parte extraída |
| HU-18.009 | (mismo, 18.009) | Reanclaje al proxy al reinsertar |
| HU-18.010 | (mismo, 18.010) | OPL "y N partes más" |
| HU-18.001, HU-18.002 (referencia) | (mismo) | Plegado parcial básico ya implementado |

## 3. Anclaje a evidencia

- **SSOT**:
  - `opm-iso-19450-es.md` — `[Glos 3.81]` despliegue, `[V-61]` enlaces y endpoints (cómo el enlace mantiene referencia por id, no por apariencia).
  - `opm-visual-es.md` — render de partes compactadas y proxy.
  - `opm-opl-es.md` — plantillas de partes y truncado pedagógico.
- **opm-extracted/**:
  - `rg -i "fold|unfold|extract|reinsert|partial.*fold|semi.*fold" opm-extracted/src/app/`.
  - `opm-extracted/src/app/models/` — buscar acciones `ExtractPart`, `InsertPart`, `RedirectLinkOnFold`.
  - `opm-extracted/src/app/rappid-components/rappid-paper/` — patrón de partes extraídas y proxies visuales.
- **Estado actual**:
  - `app/src/modelo/plegado.ts` (108 LOC) — base. Extender aquí.
  - `app/src/modelo/plegado.test.ts` — patrón de tests.
  - `app/src/modelo/operaciones.ts` — lectura. Eventualmente exponer wrapper minimal si el store lo requiere.
  - `app/src/render/jointjs/JointCanvas.tsx` — render del rectángulo padre con lista interna.
  - `app/src/opl/generar.ts` — agregar truncado.

## 4. Archivos permitidos (scope estricto)

```
app/src/modelo/tipos.ts                     EDIT aditivo (Apariencia.parteExtraidaDe?)
app/src/modelo/plegado.ts                   EDIT aditivo (extraerParte, reinsertarParte, contarPartesOcultas)
app/src/modelo/plegado.test.ts              EDIT aditivo
app/src/modelo/operaciones.ts               EDIT aditivo acotado (wrapper si store no puede importar plegado.ts directo)
app/src/serializacion/json.ts               EDIT aditivo (round-trip parteExtraidaDe)
app/src/serializacion/json.test.ts          EDIT aditivo
app/src/opl/generar.ts                      EDIT aditivo (truncado "y N partes más")
app/src/opl/generar.test.ts                 EDIT aditivo
app/src/render/jointjs/JointCanvas.tsx      EDIT aditivo (lista compacta con contador, proxy visual)
app/src/render/jointjs/factory.ts           EDIT aditivo
app/src/store.ts                            EDIT aditivo (extraerParte, reinsertarParte)
app/src/ui/Inspector.tsx (o partials)       EDIT aditivo (botón Extraer al canvas, Reinsertar)
```

**Prohibido**: tocar `validaciones.ts` (L4), `abanicos.ts` (L2), `modificadores.ts` (L3), `Enlace.origenId/destinoId` (L1), `Toolbar.tsx`, `PanelAvisos.tsx` (L4), `HANDOFF`, HU.

## 5. Restricciones de no-colisión

1. **`tipos.ts`**: agregar `Apariencia.parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id }`. Bloque al final del tipo `Apariencia`.
2. **`plegado.ts`**: extender, no reescribir. Las funciones existentes (`cambiarModoPlegado`) se preservan intactas.
3. **`operaciones.ts`**: solo wrapper si imprescindible. Preferir que `store.ts` importe directo de `plegado.ts`. Si requiere wrapper, ubicarlo cerca del wrapper de `cambiarModoPlegado` ya existente.
4. **Reanclaje de enlaces**: enlaces que apuntaban a la apariencia extraída se redirigen visualmente al rectángulo padre. **El modelo no cambia** (los enlaces refieren por `entidad.id`, no por apariencia). Solo cambia el render: `aparienciaEnlace` recalcula sus vértices y endpoint hacia el padre con etiqueta de la parte.
5. **OPL truncado**: agregar caso al patrón existente sin reescribir. Umbral 3 hardcoded.
6. **Render proxy visual**: si la parte está extraída y el padre está en modo `parcial`, mostrar la parte en la lista interna del padre con marca visual ("extraída en este OPD") y la apariencia extraída independiente en el canvas conectada por línea fina punteada al padre (proxy).

## 6. Slice mínimo shippeable

### 6.1 Modelo
- `tipos.ts`:
  ```ts
  export interface Apariencia {
    // ...existentes
    parteExtraidaDe?: { padreAparienciaId: Id; parteEntidadId: Id };
  }
  ```

### 6.2 Operaciones (`plegado.ts`)
```ts
export function extraerParteDePlegado(
  modelo: Modelo,
  opdId: Id,
  padreAparienciaId: Id,
  parteEntidadId: Id
): Modelo;

export function reinsertarParteEnPlegado(
  modelo: Modelo,
  parteAparienciaId: Id
): Modelo;

export function contarPartesOcultas(
  modelo: Modelo,
  opdId: Id,
  padreAparienciaId: Id
): number;

export function partesExtraidasEn(
  modelo: Modelo,
  opdId: Id,
  padreAparienciaId: Id
): Apariencia[];
```

Reglas:
- `extraerParteDePlegado` requiere padre en modo `parcial`. Si no, falla.
- `reinsertarParteEnPlegado` solo en apariencias con `parteExtraidaDe`. Si no, falla.
- Al reinsertar: el render redirige enlaces, pero el modelo solo elimina la apariencia.

### 6.3 Render JointJS
- Cuando padre está en modo `parcial`:
  - Lista interna muestra todas las partes en orden estable.
  - Las partes extraídas tienen marca visual (ej. tachado fino, cursiva, color desaturado).
  - Si hay extracciones y N partes ocultas (no extraídas) supera umbral 3, agregar fila final `y N partes más`.
- Apariencia extraída en canvas: render normal + línea punteada gris al rectángulo padre como proxy de pertenencia.
- Cuando se reinserta: la línea punteada y la apariencia extraída desaparecen; los enlaces existentes que apuntaban a la apariencia extraída se reanclan al rectángulo padre con etiqueta de la parte (mostrar nombre de la parte cerca del extremo del enlace).

### 6.4 OPL
- Agregar caso al generador: cuando un padre tiene plegado parcial con N partes ocultas y N > 3, emitir oración:
  - `**Padre** consiste en **A**, **B**, **C** y N partes más.`
- Si N <= 3, enumerar todas (no truncar).

### 6.5 UX inspector
- Cuando una apariencia con padre plegado parcial es seleccionable (clic en fila de la lista interna del padre):
  - Botón "Extraer al canvas" (ejecuta `extraerParteDePlegado`).
- Cuando una apariencia extraída es seleccionada:
  - Botón "Reinsertar al padre" (ejecuta `reinsertarParteEnPlegado`).
- Doble clic sobre la fila de la lista interna como atajo para "Extraer al canvas" (HU-18.004).

### 6.6 Serialización
- `parteExtraidaDe` viaja en JSON. Default `undefined` al deserializar.

## 7. Tests obligatorios

### Unit tests (estimado +10 tests)
- `plegado.test.ts`:
  - `extraerParteDePlegado` crea apariencia con `parteExtraidaDe` y la apariencia es independiente del padre.
  - `extraerParteDePlegado` falla si padre no está en modo `parcial`.
  - `reinsertarParteEnPlegado` elimina apariencia extraída.
  - `contarPartesOcultas` excluye partes extraídas.
  - Idempotencia: extraer y reinsertar restaura el modelo.
- `json.test.ts`:
  - Round-trip preserva `parteExtraidaDe`.
- `generar.test.ts`:
  - OPL truncado con N > 3.
  - OPL enumera todas con N <= 3.

### Smoke browser (estimado +1 test)
- Activar plegado parcial en proceso descompuesto con 5 partes → doble clic en una parte → verificar extracción al canvas con línea punteada al padre → verificar contador "y 4 partes más" → conectar un enlace a la apariencia extraída → reinsertar → verificar que el enlace apunta al rectángulo padre con etiqueta de la parte → guardar y recargar.

## 8. Verificación

```bash
cd app
bun run check          # +10 unit tests
bun run browser:smoke  # +1 smoke
bun run build          # verde
```

## 9. Decisiones bloqueadas (no reabrir)

- `parteExtraidaDe` es campo opcional sobre `Apariencia`, no nuevo tipo. Razón: consistencia con `modoPlegado`.
- Modelo no cambia al reinsertar (enlaces refieren por entidad, no apariencia). Solo cambia render.
- Umbral N para truncado OPL: 3 hardcoded. Configurable en ronda 4.
- Anidamiento (plegado parcial dentro de plegado parcial): fuera de slice.

## 10. Decisiones que tomás vos (documentar en commit)

- Render de proxy visual al extraer: línea punteada al padre vs flecha tipo "perteneciente a". Elegir y documentar.
- Posición de la marca visual de "extraída" en lista interna: estilo (tachado, cursiva, opacidad). Documentar.
- Etiqueta de la parte en enlaces reanclados: nombre de la parte, o `padre.parte`, o badge. Elegir y documentar.
- Atajo doble clic vs botón explícito: incluir doble clic o solo botón. Documentar.

## 11. Forma del entregable

Commits sugeridos:
- `feat(modelo): apariencia.parteExtraidaDe y operaciones extraer/reinsertar en plegado.ts`.
- `feat(serializacion): round-trip parteExtraidaDe`.
- `feat(opl): truncado pedagogico "y N partes mas"`.
- `feat(render): lista compacta con contador y proxy visual`.
- `feat(ui): boton extraer y reinsertar`.
- `test(...)` separado o integrado.

Co-author footer estándar.
