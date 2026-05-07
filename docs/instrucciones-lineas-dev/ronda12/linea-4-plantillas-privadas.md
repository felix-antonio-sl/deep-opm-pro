# Línea 4 — EPICA-33 plantillas privadas (catálogo + insertar + merge en OPD activo)

## 1. Misión

Abrir **MVP-β fase dominio-aditivo** con plantillas como artefactos de primer nivel. Restringir esta ronda al **ámbito Privado** (single-user MVP); ámbitos Organizacional/Global se difieren a post-multi-user. Cubre **13 HU vivas** de EPICA-33:

- **HU-33.001** plantillas como artefacto de primer nivel (S, UI).
- **HU-33.002** guardar el modelo actual como plantilla (S, persistencia).
- **HU-33.003** ámbito Privado (S, persistencia).
- **HU-33.006** insertar plantilla en el OPD actual (S, kernel).
- **HU-33.007** merge recursivo de sub-OPDs bajo el OPD activo (S, kernel).
- **HU-33.008** resolver colisiones de nombre con sufijo `_n` (S, kernel).
- **HU-33.009** preservar nombres de enlaces de exhibición al reinsertar (S, kernel).
- **HU-33.010** destacar visualmente elementos recién insertados (C, render).
- **HU-33.012** buscar plantillas por nombre (S, UI).
- **HU-33.014** navegar carpetas de plantillas con breadcrumb (S, UI).
- **HU-33.015** carpeta vacía con mensaje "Sin plantillas" (S, UI).
- **HU-33.018** plantilla y copias quedan desacopladas tras insertar (S, semántica).
- **HU-33.022** cancelar modal de plantilla sin efecto colateral (S, UX).

Slice mínimo entregable: **persistencia + UI catálogo + merge atómico**:

- `persistencia/plantillas.ts` nuevo: CRUD plantillas privadas en localStorage (paralelo a `persistencia/local.ts`).
- `WorkspaceIndice.plantillas?: PlantillaIndice[]` aditivo en `persistencia/workspace.ts`.
- `tipos` `Plantilla`, `PlantillaIndice` en `modelo/tipos/` (o subarchivo nuevo `tipos/plantilla.ts`).
- `canvas/operacionesBatch.ts` extendido con `insertarPlantillaBatch(modeloDestino, opdDestinoId, modeloFuente, opdFuenteId)`.
- `acciones-canvas.ts` extendido con `insertarPlantillaEnOpdActivo(plantillaId)`.
- `acciones-ui.ts` extendido con `abrirDialogoPlantillas`, `abrirDialogoGuardarPlantilla`.
- `ui/DialogoPlantillas.tsx` nuevo: catálogo + búsqueda + breadcrumb carpetas + botón Insertar.
- `ui/DialogoGuardarPlantilla.tsx` nuevo: input nombre + ámbito (Privado bloqueado en Privado para esta ronda) + Guardar.
- `ui/MenuPrincipal.tsx` extendido con "Guardar como plantilla..." + "Plantillas...".
- `ui/Toolbar.tsx` extendido con botón "Plantillas" (icono `assets/svg/template.svg`).

**Fuera de slice**:
- HU-33.004/.005 ámbitos org/global (requieren multi-user): ronda post-MVP.
- HU-33.011 preview SVG miniatura (C): bajo prioridad.
- HU-33.013 búsqueda recursiva en subcarpetas (C): bajo prioridad.
- HU-33.016/.017 modo plantilla AO (M0 multi-user): post.
- HU-33.019 dropdown ámbito por rol (multi-user): post.
- HU-33.020 favoritas (C): bajo prioridad.
- HU-33.021 cortar carpeta plantillas (C): bajo prioridad.
- No tocar EPICA-31 carpetas/permisos (diferida).

## 2. Deudas que cierra

| HU | Estado actual | Aporte L4 |
|---|---|---|
| HU-33.001 | pendiente | Menú principal + Toolbar tienen entrada visible "Plantillas". Plantillas son persistencia separada de modelos (no ensucian workspace de modelos). |
| HU-33.002 | pendiente | `DialogoGuardarPlantilla.tsx`: input nombre + descripción opcional. Botón "Guardar" persiste plantilla con id, nombre, descripción, ámbito="privado", contenido (modelo OPM serializado completo), creadoEn, actualizadoEn. |
| HU-33.003 | pendiente | Por defecto y único ámbito habilitado en MVP-β: `"privado"`. Tipo `AmbitoPlantilla = "privado" \| "organizacional" \| "global"` en tipos; solo `"privado"` se materializa en runtime. Org/global se rechazan con mensaje "Disponible cuando se habilite multi-usuario". |
| HU-33.006 | pendiente | `insertarPlantillaEnOpdActivo(plantillaId)` invoca `insertarPlantillaBatch(modeloDestino, opdDestinoId, plantillaContenido, opdFuenteId)` que mergea entidades + enlaces + apariencias del OPD fuente al OPD destino. Atómico: un solo `commitModelo` con mensaje "Insertar plantilla: N entidades, M enlaces". |
| HU-33.007 | pendiente | Merge recursivo: si la plantilla tiene sub-OPDs (refinamiento descomposición/despliegue), se crean como descendientes del OPD activo. La jerarquía relativa se preserva. |
| HU-33.008 | pendiente | Resolver colisiones nominales: si una entidad importada tiene mismo nombre que existente en el OPD destino (`validarNombreEntidad` rechaza), agregar sufijo `_2`, `_3`, etc. hasta encontrar nombre libre. Patrón: inspirado en `opm-extracted/src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts` (ahí ofrece "Use Existing Thing"; en MVP-β temprano elegimos siempre `_n` automático sin diálogo). |
| HU-33.009 | pendiente | Etiquetas de enlaces (especialmente `exhibicion`) se importan tal cual del modelo fuente, sin renombrado. Si el enlace tiene `etiqueta`, se preserva. |
| HU-33.010 | pendiente | Halo temporal de 3s sobre los IDs nuevos: `OpmStore.idsResaltadosTemporales: Id[]` runtime + `acciones-ui.resaltarTemporalmente(ids, ms)` con setTimeout. Estilo CSS `outline: 2px solid #FFFC7F` (paleta JOYAS amarillo) o similar. |
| HU-33.012 | pendiente | Input búsqueda en `DialogoPlantillas`: filtra por `nombre` o `descripcion` (case-insensitive). Debounce 200ms. |
| HU-33.014 | pendiente | Breadcrumb canónico (componente reusable de `panelCarpetas/Breadcrumb.tsx` ya existente del workspace de modelos): adaptar para árbol de carpetas de plantillas. **Nota**: en esta ronda, el árbol de carpetas de plantillas es plano (sin subcarpetas) salvo que el workspace de modelos ya tenga carpetas mergeable. **Decisión MVP-β temprana**: Plantillas en una sola carpeta raíz "Mis plantillas"; breadcrumb muestra solo la raíz. HU-33.014 cubierta como UI placeholder + diferida ampliación. |
| HU-33.015 | pendiente | Si la lista de plantillas está vacía, `DialogoPlantillas` muestra mensaje "Sin plantillas en esta carpeta. Crea una desde Menú principal → Guardar como plantilla.". |
| HU-33.018 | pendiente (semántica) | Plantilla almacena modelo serializado completo. Insertar genera nuevas entidades/enlaces con IDs únicos. Modificar la plantilla después no afecta inserciones previas (los IDs son distintos). Tests cubren explícitamente: insertar A; modificar plantilla; verificar A intacto. |
| HU-33.022 | pendiente | `DialogoPlantillas` y `DialogoGuardarPlantilla` heredan wrapper `Dialogo.tsx` con captura Esc. Esc/Cancelar no commit. Modelo no entra dirty. |

**Total esperado**: 13 HU pendientes → cubiertas (toda EPICA-33 vivas excepto HU-33.004/.005/.011/.013/.016/.017/.019/.020/.021 explícitamente diferidas).

## 3. Anclaje a evidencia

- **JOYAS** (`docs/JOYAS.md`):
  - §1 paleta secundaria: amarillo `#FFFC7F` adecuado para halo temporal HU-33.010 (tonalidad cálida no agresiva).
- **Assets canónicos** (`assets/svg/`):
  - `template.svg`: icono canónico para botón Toolbar, MenuPrincipal y tile en `DialogoPlantillas`.
- **opm-extracted/ verificado**:
  - `opm-extracted/src/app/dialogs/templates-import/templates-import.ts`: `TemplatesComponent` con `data.mode = "save" \| "edit" \| "import"`, `TemplateType.PERSONAL/ORG/SYS`, `getSettings(type)` retorna config por tab. **Patrón de UI con tabs por ámbito**; **simplificación MVP-β**: mostrar solo tab Privado.
  - `opm-extracted/src/app/dialogs/existing-name-dialog/existing-name-dialog.component.ts`: diálogo "Use Existing Thing" cuando hay duplicado al insertar. **Patrón referencial**: en MVP-β temprano simplificamos a sufijo `_n` automático sin diálogo.
  - `opm-extracted/src/app/dialogs/submodel-name-dialog/`: input de nombre canónico con botones "Rename" y "Create Sub-Model". **Patrón** para `DialogoGuardarPlantilla.tsx`.
- **SSOT**:
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md` §plantillas: artefactos reutilizables independientes del modelo activo.
  - `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md` §3.6 apariencia: una entidad puede aparecer en distintos modelos (no solo en distintos OPDs del mismo modelo).
- **Estado actual del código (post-ronda-11)**:
  - `app/src/persistencia/local.ts:` exports `listarModelosLocales`, `guardarModeloLocal`, `cargarModeloLocal`, `renombrarModeloLocal`, `tocarUltimoUso`, `listarRecientes`, `borrarModeloLocal`, `actualizarMetadataModeloLocal`. **Patrón canónico** que `persistencia/plantillas.ts` replica para plantillas (CRUD básico en localStorage con namespace separado `opm:plantilla:*`).
  - `app/src/persistencia/workspace.ts:`: `WorkspaceIndice` ya tiene `modelos`, `carpetas`, `recientes`, `busquedaGlobalUltima`, `preferenciasUi`. **L4 agrega `plantillas?: PlantillaIndice[]`** aditivo.
  - `app/src/ui/panelCarpetas/Breadcrumb.tsx` existe. **L4 reusa** (puede instanciarlo con datos de plantillas).
  - `app/src/ui/MenuPrincipal.tsx`: ya tiene Renombrar, Guardar Como, Cargar Ejemplo. **L4 agrega** "Guardar como plantilla..." + "Plantillas...".
  - `app/src/ui/Dialogo.tsx` wrapper con captura Esc + headers/footers canónicos.
  - `app/src/canvas/operacionesBatch.ts`: ya tiene patrón batch atómico. **L4 agrega `insertarPlantillaBatch`**.

## 4. Archivos permitidos

```text
app/src/modelo/tipos/plantilla.ts                  NUEVO (Plantilla, PlantillaIndice, AmbitoPlantilla)
app/src/modelo/tipos.ts                            EDIT aditivo (re-export tipos plantilla)
app/src/modelo/tipos/ui.ts                         EDIT aditivo (PreferenciasUiUsuario.plantillasOrden?)
app/src/persistencia/plantillas.ts                 NUEVO (CRUD plantillas localStorage namespace opm:plantilla:*)
app/src/persistencia/plantillas.test.ts            NUEVO
app/src/persistencia/workspace.ts                  EDIT aditivo (WorkspaceIndice.plantillas? + helpers)
app/src/canvas/operacionesBatch.ts                 EDIT extiende (insertarPlantillaBatch con merge + sufijo _n)
app/src/canvas/operacionesBatch.test.ts            EDIT aditivo (tests merge + sufijo + sub-OPDs + idempotencia desacople)
app/src/store/tipos.ts                             EDIT aditivo (6 acciones plantillas)
app/src/store/modelo/acciones-canvas.ts            EDIT extiende (insertarPlantillaEnOpdActivo)
app/src/store/modelo/acciones-ui.ts                EDIT extiende (abrirDialogoPlantillas, abrirDialogoGuardarPlantilla, guardarComoPlantillaConfirmar, resaltarTemporalmente)
app/src/ui/DialogoPlantillas.tsx                   NUEVO (catálogo + búsqueda + breadcrumb + insertar)
app/src/ui/DialogoGuardarPlantilla.tsx             NUEVO (nombre + descripción + ámbito Privado)
app/src/ui/MenuPrincipal.tsx                       EDIT aditivo (Guardar como plantilla..., Plantillas...)
app/src/ui/Toolbar.tsx                             EDIT aditivo (botón Plantillas con template.svg)
app/e2e/opm-smoke.spec.ts                          EDIT aditivo (~4 smokes plantillas)
opm-extracted/**                                   LECTURA
docs/HANDOFF.md                                    LECTURA
docs/historias-usuario-v2/**                       LECTURA
docs/JOYAS.md                                      LECTURA
assets/svg/**                                      LECTURA
```

Cualquier otro archivo es **fuera de scope**.

## 5. Restricciones de no-colisión

- **No tocar `modelo/tipos/entidad.ts` ni `modelo/tipos/enlace.ts` ni `modelo/tipos/opl.ts`** (territorio L2).
- **No tocar `modelo/tipos/modelo.ts`** (Plantilla NO entra en `Modelo`; vive en workspace separado).
- **No tocar `opl/generadores/*`** (plantilla insertada produce entidades ya existentes para OPL — generación normal).
- **No tocar `acciones-entidad.ts`** (territorio L1 + L2).
- **No tocar `MenuContextualEntidad.tsx` ni `DialogoTraerConectados.tsx`** (territorio L3, archivos nuevos).
- **No tocar reglas traer / layoutRadial / seleccionMultiple** (territorio L3).
- **No tocar `persistencia/local.ts` salvo lectura para patrón** (los CRUD de plantillas viven en `plantillas.ts`).
- **No tocar `progress-dashboard.mjs`** (territorio L5).
- **`Toolbar.tsx`**: L4 (botón Plantillas), L1 (modo sticky), L2 (atributo numérico), L3 (traer conectados). Hunks disjuntos.
- **`MenuPrincipal.tsx`**: solo L4 toca (en MVP-β temprano nadie más agrega items). L1 cierre HU-30.021 va en `DialogoCargarModelo`.
- **`acciones-canvas.ts`**: L4 (insertarPlantillaEnOpdActivo), L1 (multi-al-todo), L3 (3 traer). Hunks disjuntos.
- **`acciones-ui.ts`**: L4 (4 acciones plantillas), L1 (read-only redirect + cargar ejemplo), L3 (abrir traer). Hunks disjuntos.
- **`tipos/ui.ts`**: L4 (`plantillasOrden?`), L3 (`traerConectadosUltimo?`). Aditivos disjuntos.
- **`canvas/operacionesBatch.ts`**: L4 (1 batch nuevo), L3 (3 batchs nuevos), L1 (verificación atomicidad sin nuevos exports). Hunks disjuntos.

## 6. Comportamiento esperado

- **Tipos** (`modelo/tipos/plantilla.ts`):
  ```typescript
  export type AmbitoPlantilla = "privado" | "organizacional" | "global";
  export interface Plantilla {
    id: Id;
    nombre: string;
    descripcion?: string;
    ambito: AmbitoPlantilla;
    contenido: ModeloPersistido; // serialización OPM completa
    creadoEn: string; // ISO
    actualizadoEn: string; // ISO
  }
  export interface PlantillaIndice {
    id: Id;
    nombre: string;
    descripcion?: string;
    ambito: AmbitoPlantilla;
    creadoEn: string;
    actualizadoEn: string;
  }
  ```
- **Persistencia** (`persistencia/plantillas.ts`):
  - `listarPlantillas(ambito?: AmbitoPlantilla): Resultado<PlantillaIndice[]>`.
  - `guardarPlantilla(input: { nombre; descripcion?; modeloPersistido; ambito? }): Resultado<Plantilla>`.
  - `cargarPlantilla(id: Id): Resultado<Plantilla>`.
  - `borrarPlantilla(id: Id): Resultado<void>`.
  - `renombrarPlantilla(id, nombre, descripcion?): Resultado<PlantillaIndice>`.
  - Namespace localStorage: `opm:plantilla:<id>` para contenido completo + `opm:plantilla-indice:<id>` para metadata + `opm:plantillas-lista` para lista de IDs (paralelo a estructura de modelos).
- **Insertar atómico** (`canvas/operacionesBatch.insertarPlantillaBatch`):
  - Genera nuevos IDs para cada entidad/enlace/apariencia/aparienciaEnlace de la plantilla (para garantizar HU-33.018 desacople).
  - Itera entidades fuente: si nombre ya existe en el OPD destino, agrega sufijo `_n` (HU-33.008).
  - Itera enlaces fuente: re-mapea `origenId`/`destinoId` a los nuevos IDs de entidades; preserva etiquetas (HU-33.009).
  - Itera sub-OPDs (refinamientos): crea OPDs hijos del OPD destino con IDs nuevos (HU-33.007).
  - Aplica todas las inserciones a un único snapshot del modelo destino, retorna nuevo modelo + lista de IDs nuevos.
  - Llama `acciones-ui.resaltarTemporalmente(idsNuevos, 3000)` para HU-33.010.
- **DialogoPlantillas**:
  - Lista de tiles con icono `template.svg` + nombre + fecha actualizada + descripción.
  - Input búsqueda en header con debounce 200ms.
  - Breadcrumb canónico (raíz "Mis plantillas").
  - Botón "Insertar" sobre tile seleccionado dispara `insertarPlantillaEnOpdActivo(plantilla.id)` y cierra el diálogo.
  - Estado vacío: "Sin plantillas en esta carpeta..." con CTA al menú principal.
- **DialogoGuardarPlantilla**:
  - Input nombre + textarea descripción opcional.
  - Dropdown ámbito (en MVP-β temprano: solo Privado habilitado).
  - Botón "Guardar plantilla" dispara `guardarComoPlantillaConfirmar()` y cierra.
- **Halo temporal** (HU-33.010):
  - `OpmStore.idsResaltadosTemporales: Id[]` runtime (no serializado).
  - `resaltarTemporalmente(ids, ms = 3000)`: set IDs + setTimeout que limpia tras `ms`.
  - Render canvas: si `apariencia.entidadId` está en `idsResaltadosTemporales`, agrega clase CSS `apariencia-resaltada-temporal` con outline `#FFFC7F`.

## 7. Pruebas requeridas

**Unit tests**:

- `persistencia/plantillas.test.ts`:
  - Guardar plantilla persiste con id único + recuperable por `cargarPlantilla`.
  - `listarPlantillas` retorna PlantillaIndice ordenado por `actualizadoEn` desc.
  - `borrarPlantilla` elimina ambas claves localStorage.
- `canvas/operacionesBatch.test.ts`:
  - `insertarPlantillaBatch` mergea entidades + enlaces + apariencias del OPD fuente al destino con IDs nuevos.
  - HU-33.008: nombre duplicado obtiene sufijo `_2`, `_3`.
  - HU-33.009: etiqueta de enlace exhibición preservada.
  - HU-33.007: sub-OPDs creados como descendientes del destino.
  - HU-33.018: modificar plantilla después de insertar no afecta el modelo destino.

**Smoke browser** (`app/e2e/opm-smoke.spec.ts`), ~4 nuevos:

- "HU-33.001/.002/.003: Menú → Guardar como plantilla → DialogoGuardarPlantilla → Privado → Guardar persiste y aparece en DialogoPlantillas".
- "HU-33.006/.007/.008: insertar plantilla en OPD activo crea entidades nuevas con sufijo _n si hay colisión y mergea sub-OPDs".
- "HU-33.010: tras insertar, los nuevos elementos tienen halo amarillo durante 3s".
- "HU-33.022: cancelar DialogoGuardarPlantilla con Esc no persiste plantilla y modelo no entra dirty".

**Detector**: L4 declara las reglas siguientes para consolidación L5 (~6 reglas):

- HU-33.001/.002: `app/src/persistencia/plantillas.ts` existe + `app/src/ui/MenuPrincipal.tsx` string `Guardar como plantilla`.
- HU-33.003: `app/src/modelo/tipos/plantilla.ts` string `AmbitoPlantilla` con `"privado"`.
- HU-33.006/.007/.008/.009: `app/src/canvas/operacionesBatch.ts` string `insertarPlantillaBatch`.
- HU-33.010: `app/src/store/modelo/acciones-ui.ts` string `resaltarTemporalmente`.
- HU-33.012/.014/.015: `app/src/ui/DialogoPlantillas.tsx` existe.
- HU-33.018: regla cubierta por test de operacionesBatch.test.ts (HU-33.018 desacople); evidencia en test file path.

## 8. Métricas esperadas

- **Tests aditivos**: ~14 unit + 4 smokes nuevos.
- **HU cerradas L4**: 13 HU pendientes → cubiertas.
- **Reglas detector ronda 12 que esta línea aporta**: ~6 reglas nuevas.
- **Build**: chunk principal + ~5-8 KB (`DialogoPlantillas`, `DialogoGuardarPlantilla`, persistencia plantillas). Algunos pueden cargarse lazy si superan ~5 KB.
- **Smoke browser**: 72 → ~76.

## 9. Loop verde y commits

```bash
cd app
bun run check          # 624 → ~638 unit
bun run browser:smoke  # 72 → 76
bun run build          # main chunk objetivo < 195 KB / < 53 KB gzip
```

Commits sugeridos (orden):

1. `feat(modelo): tipos Plantilla, PlantillaIndice, AmbitoPlantilla aditivos (HU-33.001/.003)`
2. `feat(persistencia): CRUD plantillas localStorage namespace opm:plantilla (HU-33.002)`
3. `feat(canvas): insertarPlantillaBatch con merge + sufijo _n + sub-OPDs (HU-33.006/.007/.008/.009)`
4. `feat(store): acciones plantillas + halo temporal resaltarTemporalmente (HU-33.010)`
5. `feat(ui): DialogoPlantillas con catálogo + búsqueda + breadcrumb (HU-33.012/.014/.015)`
6. `feat(ui): DialogoGuardarPlantilla con nombre + ámbito Privado (HU-33.001/.022)`
7. `feat(menu): MenuPrincipal con Guardar como plantilla y Plantillas... (HU-33.001)`
8. `feat(toolbar): botón Plantillas con template.svg (HU-33.001)`
9. `test(e2e): smokes plantillas L4 (~4 nuevos)`

## 10. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| **`insertarPlantillaBatch` no atómico**: si genera múltiples commits para entidades + enlaces + sub-OPDs. | Patrón ronda 11 L4: snapshot inicial, todas las operaciones en memoria, un solo `commitModelo`. Test verifica un solo undo entry. |
| **Colisión de nombres recursiva**: si `Cosa` y `Cosa_2` ambos existen, sufijo debe encontrar `Cosa_3`. | Loop incrementa sufijo hasta `validarNombreEntidad` aceptar. Cap en 1000 iteraciones para evitar infinite loop pathológico. |
| **HU-33.018 desacople requiere IDs nuevos**: si la inserción reusa IDs de plantilla, modificar plantilla afecta inserción. | `insertarPlantillaBatch` genera nuevos IDs (UUIDs nuevos) para cada elemento de la plantilla durante la inserción. Test explícito. |
| **Halo temporal interfiere con render canvas**: si la clase CSS persiste tras 3s o se queda. | `setTimeout` limpia `idsResaltadosTemporales` tras `ms`. Cleanup automático también si el operador hace cambios que invalidan los IDs. |
| **DialogoPlantillas crece bundle si tiene muchos componentes**: catálogo + búsqueda + breadcrumb. | Lazy import del DialogoPlantillas via dynamic import (patrón ronda 11 L2 para PantallaInicio). Si chunk supera 8 KB, separar. |
| **localStorage limit ~5MB**: plantillas pueden ocupar mucho. | Documentar límite. No cap explícito en MVP-β temprano. Si excede, error claro al guardar. |
| **Plantilla con sub-OPDs profundos**: merge recursivo puede romper performance. | Limit profundidad a 10 niveles. Tests con plantilla de profundidad 5. |
| **Drift con persistencia/local.ts si se duplica lógica**: tentación copy-paste. | Extraer helpers comunes a `persistencia/storage.ts` si emerge duplicación. En MVP-β temprano, OK duplicar firmas si claras. |
| **HU-33.014 breadcrumb requiere árbol carpetas**: si plantillas son planas, breadcrumb es trivial. | MVP-β temprano: solo raíz "Mis plantillas". Breadcrumb muestra esa raíz solo. Documentar diferimiento. |

## 11. Salida esperada

Al cierre de L4, el operador debe poder:

- Guardar el modelo actual como plantilla privada con un click desde Menú principal.
- Ver el catálogo de plantillas con búsqueda y carpeta raíz.
- Insertar una plantilla en el OPD activo: las entidades y enlaces de la plantilla aparecen como nuevos elementos del modelo, con halo amarillo de 3s.
- Confiar en que insertar varias veces la misma plantilla no rompe nombres (sufijos `_n` automáticos).
- Confiar en que modificar la plantilla después no afecta inserciones previas.
- Cancelar cualquier diálogo de plantilla sin efectos colaterales.

**MVP-β fase dominio-aditivo iniciada**. EPICA-33 cierra al menos 13/22 HU canónicas, dejando los ámbitos org/global, modo plantilla AO, favoritas y cortar carpeta para rondas posteriores cuando se habilite multi-user.
