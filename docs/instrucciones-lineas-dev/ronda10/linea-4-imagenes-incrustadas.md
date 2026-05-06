# Línea 4 — Imágenes incrustadas (URL externa + modos + render compuesto + cache)

## 1. Misión

Agregar imágenes incrustadas a objetos OPM (EPICA-19), con scope limitado a single-user MVP:
- **Insertar imagen por URL pública** con validación de extensión (HU-19.002).
- **Previsualizar antes de confirmar** (HU-19.003).
- **Modos de render**: Imagen / Texto / Imagen+Texto (HU-19.007, HU-19.011).
- **Insignia "📷"** clickeable que abre menú edición (HU-19.001, HU-19.008).
- **Reemplazar / quitar imagen** (HU-19.009, HU-19.010).
- **Render compuesto vía overlay separado** (composer nuevo `imagenOverlay.ts`); NO toca composer base entidad.
- **Suprimir imagen interior** cuando la cosa está descompuesta o desplegada (HU-19.012).
- **Exclusión mutua imagen ↔ estados visibles** (HU-19.013).
- **OPL invariante**: imágenes NO afectan oraciones OPL (HU-19.015).
- **Cache bitmap remoto + degradación** a "Solo texto" si URL caída (HU-19.016).

**Fuera de slice**:
- HU-19.004..006 pool organizacional con tags y ámbitos: requiere multi-user. **Difiere a ronda futura cuando exista multi-user**.
- HU-19.014 PDF excluye imagen / SVG las preserva: bloqueado por regla "no introducir librerías nuevas" (export PDF/SVG ya bloqueados).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L4 |
|---|---|---|
| HU-19.001 — Menú imagen desde barra secundaria | pendiente | `Toolbar.tsx` aditivo: botón "📷" cuando entidad seleccionada es objeto. |
| HU-19.002 — Insertar por URL con validación extensión | pendiente | `imagenObjeto.ts` valida extensión `.png\|.jpg\|.jpeg\|.gif\|.svg\|.webp` + `URL.canParse`. |
| HU-19.003 — Previsualizar URL | pendiente | `ModalImagenObjeto.tsx` muestra `<img src={url}>` antes de confirmar. |
| HU-19.007 — Modos Imagen/Texto/Imagen+Texto | pendiente | `Entidad.imagen?.modo: "imagen" \| "texto" \| "imagen-texto"`. Click en insignia alterna. |
| HU-19.008 — Reabrir edición desde insignia | pendiente | Click derecho sobre insignia 📷 abre `ModalImagenObjeto` en modo edición. |
| HU-19.009 — Reemplazar imagen | pendiente | Modal en modo edición permite cambiar URL. |
| HU-19.010 — Eliminar imagen | pendiente | Botón "Quitar" en modal. `quitarImagenEntidad`. |
| HU-19.011 — Forzar modo a OPD desde Opciones | pendiente | `Toolbar.tsx` toggle global `uiModoImagenGlobal: "imagen" \| "texto" \| "imagen-texto" \| null` (null = respeta cada cosa). Aditivo, no toca JSON. |
| HU-19.012 — Suprimir imagen en cosa con descomposición/despliegue | pendiente | Render: si `entidad.refinamiento` definido, NO renderizar imagen. |
| HU-19.013 — Exclusión mutua imagen ↔ estados visibles | pendiente | Validador: si `imagen.modo` includes "imagen" y la cosa tiene estados visibles, aviso. UI: alterna a modo "texto" si emerge conflicto. |
| HU-19.015 — OPL invariante | pendiente | Tests `opl/generar.test.ts`: OPL para entidad con imagen es idéntico al sin imagen. |
| HU-19.016 — Cache + degradación a "Solo texto" | pendiente | `imagenObjeto.ts` mantiene cache simple con timestamp; si fetch falla, degradar `modo` a "texto" + emitir aviso. |

## 3. Anclaje a evidencia

- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.* (Object): la imagen es presentación, NO altera la semántica OPM. OPL invariante (HU-19.015).
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md` V-* (representación visual): permite enriquecer cosas con metadata visual.
- **Corpus interno reusable**:
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/configuration/elementsFunctionality/imageRepoConfig.ts` (si existe): config de pool. **NO se replica** (multi-user). L4 implementa solo URL externa.
  - `/home/felix/projects/deep-opm-pro/opm-extracted/src/app/models/VisualPart/OpmVisualThing.ts` (si existe): atributo `urlImage?` o similar.
- **Estado actual del código (post-9.5)**:
  - `app/src/modelo/tipos/entidad.ts`: ya tiene `urls?: UrlObjetoTipada[]` (ronda 7). **L4 agrega `imagen?: ImagenEntidad`** como campo separado (semántica distinta: URLs son referencias informativas; imagen es render visual).
  - `app/src/modelo/objetoMetadata.ts`: ya tiene `editarAlias`, `editarUnidad`, `editarDescripcion`, `agregarUrl`, `eliminarUrl`. **L4 agrega `editarImagen`, `quitarImagen`, `cambiarModoImagen`**.
  - `app/src/render/jointjs/composers/entidad.ts`: composer base. **L4 NO lo modifica**; agrega `composers/imagenOverlay.ts` que renderiza la imagen como cell adicional sobre la cell base (patrón ronda 7 badges).
  - `app/src/ui/inspector/SeccionUrls.tsx`: ya gestiona URLs. **L4 agrega `SeccionImagen.tsx` separado** (responsabilidades distintas).
  - `app/src/ui/ModalUrlsObjeto.tsx`: modal URLs. **L4 agrega `ModalImagenObjeto.tsx` separado**.

## 4. Archivos permitidos

```text
app/src/modelo/tipos/entidad.ts                    EDIT aditivo (Entidad.imagen?: ImagenEntidad + interface ImagenEntidad)
app/src/modelo/objetoMetadata.ts                   EDIT extiende (editarImagen, quitarImagen, cambiarModoImagen)
app/src/modelo/objetoMetadata.test.ts              EDIT aditivo
app/src/modelo/imagenObjeto.ts                     NUEVO (validación URL, cache bitmap, degradación)
app/src/modelo/imagenObjeto.test.ts                NUEVO
app/src/modelo/validaciones.ts                     EDIT aditivo (exclusión imagen ↔ estados)
app/src/modelo/validaciones.test.ts                EDIT aditivo
app/src/serializacion/validarEntidades.ts          EDIT aditivo (validar Entidad.imagen)
app/src/serializacion/validarEntidades.test.ts     EDIT aditivo
app/src/render/jointjs/composers/imagenOverlay.ts  NUEVO (render imagen como cell aditiva)
app/src/render/jointjs/composers/imagenOverlay.test.ts  NUEVO
app/src/render/jointjs/proyeccion.ts               EDIT aditivo (incluir cells del overlay imagen + flag global modoImagen)
app/src/render/jointjs/handlers/seleccion.ts       EDIT aditivo (click en insignia 📷 alterna modo, click-derecho abre modal edición)
app/src/store/modelo/acciones-entidad.ts           EDIT extiende (editarImagenEntidad, quitarImagenEntidad, cambiarModoImagen)
app/src/store/modelo/acciones-ui.ts                EDIT extiende (abrirModalImagen, cerrarModalImagen, fijarModoImagenGlobal)
app/src/store/tipos.ts                             EDIT aditivo
app/src/ui/Toolbar.tsx                             EDIT aditivo (botón 📷 + toggle modo global)
app/src/ui/inspector/SeccionImagen.tsx             NUEVO (en Inspector cuando entidad es objeto: muestra preview + botón "Editar imagen")
app/src/ui/InspectorEntidad.tsx                    EDIT aditivo (montar SeccionImagen)
app/src/ui/ModalImagenObjeto.tsx                   NUEVO (URL input + preview + selector modo + botones Confirmar/Quitar/Cancelar)
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (smoke imagen URL + modos + supresión por refinamiento + degradación)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA (no editar)
docs/historias-usuario-v2/**                       LECTURA (no editar)
```

## 5. Restricciones de no-colisión

- **No tocar `tipos/apariencia.ts`** (territorio L1).
- **No tocar `tipos/enlace.ts`** (territorio L2).
- **No tocar `operaciones/*`** (territorios L1/L2/L3).
- **No tocar `composers/entidad.ts`**: L4 agrega `composers/imagenOverlay.ts` separado que se monta vía `proyeccion.ts` aditivamente. **Esta es la decisión clave de L4 para evitar choque con L1**.
- **No tocar `composers/grid.ts`** (territorio L1, archivo nuevo).
- **No tocar `Dialogo.tsx` ni `ConfirmacionContext.tsx`** (territorio L5).
- **`Toolbar.tsx`**: L4 agrega botón 📷 + toggle modo global en sección "Visualización". L1 agrega secciones grid/alinear/distribuir. Cada uno agrega botones a su sección sin reordenar.
- **`acciones-entidad.ts`**: L4 agrega métodos imagen al final. L1 agrega métodos resize/autosize en otra sección. Cero choque.
- **`acciones-ui.ts`**: L4 agrega abrirModalImagen + fijarModoImagenGlobal. L5 agrega `solicitarConfirmacionAlCerrar`. Métodos disjuntos.
- **`opm-smoke.spec.ts`**: smokes aditivos al final.

## 6. Slice mínimo shippeable

### 6.1 Capa modelo

```ts
// app/src/modelo/tipos/entidad.ts (aditivo)
export interface ImagenEntidad {
  url: string;            // URL pública absoluta
  modo: "imagen" | "texto" | "imagen-texto";  // default "imagen-texto" al crear
  cache?: { ts: number; estado: "ok" | "fallido" };  // session-only, NO se serializa profundo
}

export interface Entidad {
  // ... campos existentes
  imagen?: ImagenEntidad;
}
```

```ts
// app/src/modelo/imagenObjeto.ts (NUEVO)
const EXTENSIONES_VALIDAS = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"];

export function validarUrlImagen(url: string): Resultado<string> {
  // URL.canParse + extensión
}

export function precargarBitmap(url: string): Promise<HTMLImageElement | null> {
  // Image() + onload/onerror, timeout 5s
}

export function degradarSiFallido(modelo: Modelo, entidadId: Id): Modelo {
  // Si imagen.cache.estado === "fallido": cambiar modo a "texto".
}
```

```ts
// app/src/modelo/objetoMetadata.ts (extiende)
export function editarImagen(modelo: Modelo, entidadId: Id, imagen: ImagenEntidad): Resultado<Modelo> { /* ... */ }
export function quitarImagen(modelo: Modelo, entidadId: Id): Resultado<Modelo> { /* ... */ }
export function cambiarModoImagen(modelo: Modelo, entidadId: Id, modo: ImagenEntidad["modo"]): Resultado<Modelo> { /* ... */ }
```

```ts
// app/src/modelo/validaciones.ts (aditivo)
export function validarExclusionImagenEstados(modelo: Modelo): Aviso[] {
  // Si entidad tiene imagen.modo includes "imagen" Y tiene estados con apariencia visible:
  //   aviso severidad "media": "Imagen y estados visibles excluyentes en <entidad>"
}
```

### 6.2 Capa render

```ts
// app/src/render/jointjs/composers/imagenOverlay.ts (NUEVO)
import type { dia } from "jointjs";
import type { Apariencia, Entidad } from "../../../modelo/tipos";
import type { JointCellJson } from "../proyeccionTipos";

/**
 * Compone cells de overlay de imagen sobre la cell base de la entidad.
 * NO modifica el composer base; se monta vía proyeccion.ts aditivamente.
 *
 * Render según modo:
 * - "imagen": rect SVG completo con <image> que cubre body, oculta texto del nombre.
 * - "texto": no renderiza nada (default original).
 * - "imagen-texto": rect parcial superior con <image>, deja espacio inferior para texto.
 */
export function componerImagenOverlay(
  apariencia: Apariencia,
  entidad: Entidad,
  modoGlobal: "imagen" | "texto" | "imagen-texto" | null,
): JointCellJson | null {
  // Si entidad.refinamiento definido: no renderizar (HU-19.012).
  // Si !entidad.imagen: null.
  // modoEfectivo = modoGlobal ?? entidad.imagen.modo.
  // Si modoEfectivo === "texto": null.
  // Renderizar cell standard.Image con position/size del bbox + insignia 📷 en esquina.
}

export function componerInsigniaCamara(apariencia: Apariencia, entidad: Entidad): JointCellJson | null {
  // Insignia 📷 superpuesta en esquina inferior-izquierda cuando entidad.imagen existe.
  // Click → store.cambiarModoImagen (alterna).
  // Click-derecho → store.abrirModalImagen.
}
```

```ts
// app/src/render/jointjs/proyeccion.ts (aditivo)
// En proyectarModeloAJointCells:
// for (cada apariencia con entidad imagen):
//   const overlay = componerImagenOverlay(apariencia, entidad, modoGlobal);
//   if (overlay) cells.push(overlay);
//   const insignia = componerInsigniaCamara(apariencia, entidad);
//   if (insignia) cells.push(insignia);
//
// fijarOpcionesProyeccionGlobal: agregar opción modoImagenGlobal?.
```

### 6.3 Capa store + UI

```ts
// app/src/store/modelo/acciones-entidad.ts (extiende)
editarImagenEntidad(entidadId, imagen) { /* commitModelo */ }
quitarImagenEntidad(entidadId) { /* commitModelo */ }
cambiarModoImagenEntidad(entidadId, modo) { /* commitModelo */ }

// app/src/store/modelo/acciones-ui.ts (extiende)
abrirModalImagen(entidadId) { set({ modalImagenAbierto: entidadId }) }
cerrarModalImagen() { set({ modalImagenAbierto: null }) }
fijarModoImagenGlobal(modo) { set({ uiModoImagenGlobal: modo }) }  // null = respeta cada cosa
```

```tsx
// app/src/ui/ModalImagenObjeto.tsx (NUEVO)
// data-testid="modal-imagen-objeto"
// Inputs: URL (text), Modo (radio: imagen | texto | imagen+texto)
// Preview: <img src={urlPreview} onError={() => mostrarErrorURL} />
// Botones: Confirmar / Quitar / Cancelar
```

```tsx
// app/src/ui/inspector/SeccionImagen.tsx (NUEVO)
// Si entidad seleccionada es objeto:
//   - Si tiene imagen: thumbnail + botón "Editar imagen" + botón "Quitar"
//   - Si no: botón "Agregar imagen"
//   onClick → store.abrirModalImagen(entidadId).
```

```tsx
// app/src/ui/Toolbar.tsx (aditivo)
// Toggle global modo imagen:
//   [📷] alterna entre {null, "imagen", "texto", "imagen-texto"}
//   data-testid="toolbar-modo-imagen-global"
```

## 7. Tests obligatorios

- **Tests existentes intactos**.
- **Tests aditivos** (~10 tests / ~30 expects):
  - `imagenObjeto.test.ts`: validar URL, validar extensión, precargar bitmap (mock fetch), degradación por fallo.
  - `objetoMetadata.test.ts`: editarImagen, quitarImagen, cambiarModoImagen.
  - `validaciones.test.ts`: validarExclusionImagenEstados.
  - `composers/imagenOverlay.test.ts`: renderiza por modo, no renderiza si refinamiento, insignia clickeable.
  - `serializacion/validarEntidades.test.ts`: imagen aditivo + roundtrip lossless.
  - `opl/generar.test.ts`: aditivo verificando que la oración de la entidad NO cambia con/sin imagen (HU-19.015).
- **Smokes aditivos**:
  - `test("agregar imagen URL a objeto, modo imagen-texto, render con insignia")`
  - `test("alternar modo imagen ↔ texto desde insignia con click")`
  - `test("ocultar imagen en cosa descompuesta")`
  - `test("toggle global modo imagen aplica a todo el OPD activo")`

## 8. Verificación

```bash
cd app
bun run typecheck
bun run test src/modelo/imagenObjeto.test.ts src/modelo/objetoMetadata.test.ts src/modelo/validaciones.test.ts src/render/jointjs/composers/imagenOverlay.test.ts src/serializacion/validarEntidades.test.ts src/opl/generar.test.ts
bun run check
bun run browser:smoke
bun run build  # bundle puede crecer ~3-6 KB por overlay
```

## 9. Decisiones bloqueadas (no reabrir)

- **`Entidad.imagen?` es campo separado de `Entidad.urls`**: URLs son referencias informativas (ronda 7), imagen es render visual. NO se mezclan.
- **Composer separado `imagenOverlay.ts`**: NO se modifica `composers/entidad.ts`. Patrón ronda 7 (badges 📄/🔗) replicado.
- **Cache simple in-memory**: NO se persiste. Si el browser se recarga, re-fetch.
- **`uiModoImagenGlobal`** es state del store **no persistente** (similar a `vistaMapaActiva`).
- **HU-19.004..006 (pool organizacional)** difiere a multi-user.
- **HU-19.014 (PDF/SVG export)** bloqueada por dependencias nuevas.
- **OPL invariante** (HU-19.015): la imagen NO genera ninguna oración.

## 10. Decisiones que tomas vos (documentar en commit)

- **`ImagenEntidad.cache`** se serializa o no: recomendado **NO serializar** (queda solo en memoria). Si se serializa, hidratar como `{ts: 0, estado: "ok"}` y forzar re-fetch al cargar.
- **Insignia 📷**: emoji literal o SVG. Recomendado: emoji + `data-testid="entidad-insignia-imagen"` para tests.
- **Posición de la insignia**: esquina inferior-izquierda (libre de marcadores designación que están arriba). Documentar.
- **Validación URL**: `URL.canParse` (estándar) o regex. `URL.canParse` preferido.
- **Preview en modal**: si el browser falla cargar (CORS), mostrar mensaje "URL no accesible" sin bloquear el confirmar (puede que funcione al guardar).
- **Cuando un objeto adquiere refinamiento (descomp/desplie) Y tiene imagen**: render NO la muestra (HU-19.012); pero la metadata se preserva en el JSON. Si el usuario quita el refinamiento, la imagen vuelve a aparecer.

## 11. Forma del entregable

```
1. feat(canvas): imagenes incrustadas con URL externa + modos render + cache + degradacion (EPICA-19 parcial)

   Cierra ~13 HU (HU-19.001/.002/.003/.007/.008/.009/.010/.011/.012/.013/.015/.016 +
   foundation .014). HU-19.004/.005/.006 pool organizacional difieren a multi-user.

   - tipos/entidad.ts aditivo: ImagenEntidad
   - imagenObjeto.ts NUEVO: validar URL, cache, degradacion
   - objetoMetadata.ts extiende: editarImagen/quitarImagen/cambiarModo
   - validaciones.ts aditivo: exclusion imagen ↔ estados
   - composers/imagenOverlay.ts NUEVO (overlay separado, no toca composer base)
   - proyeccion.ts aditivo: incluir overlay imagen + opcion modo global
   - handlers/seleccion.ts aditivo: click insignia / right-click edicion
   - acciones-entidad.ts extiende: imagen
   - acciones-ui.ts extiende: modal imagen + toggle global
   - Toolbar.tsx aditivo: boton imagen + toggle global
   - inspector/SeccionImagen.tsx NUEVO
   - ModalImagenObjeto.tsx NUEVO
   - serializacion/validarEntidades.ts aditivo: roundtrip lossless
   - ~10 tests / ~30 expects
   - 4 smokes nuevos

   OPL invariante (HU-19.015): test verifica oracion entidad sin cambio con/sin imagen.

   Refs: docs/instrucciones-lineas-dev/ronda10/linea-4-imagenes-incrustadas.md,
         SSOT opm-iso-19450-es.md §Object (imagen es presentacion, no semantica),
         opm-extracted/src/app/configuration/elementsFunctionality/imageRepoConfig.ts (referencial).

   Co-Authored-By: <implementador> <noreply@...>
```

**Reporte de cierre**:
- Hash + LOC nuevos.
- Output check / smoke / build.
- Tamaño chunk principal antes/después.
- Confirmación: composers/entidad.ts intacto; OPL invariante; JSON pre-ronda 10 hidrata sin pérdida.

**Qué NO tocar**: territorios L1/L2/L3/L5, composers/entidad.ts, HANDOFF, historias-usuario-v2, JOYAS, customShapes.ts, in-vivo-test.mjs, home/.
