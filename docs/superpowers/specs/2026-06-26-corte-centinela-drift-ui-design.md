# Diseño — Corte UI del Centinela de Drift (Anclaje α)

**Fecha:** 2026-06-26 · **Repo:** `deep-opm-pro` · **Frente:** gist-anchor / Anclaje · **Alcance:** Opción **α** (solo vigilancia) + «marcador-que-responde».
**Estado:** REALIZADO Y DESPLEGADO; conservar como contrato de diseño histórico, no como instrucción pendiente.
**Funda en:** `docs/auditorias/2026-06-24-acta-{nominacion-reuso-tipos-opforja,valor-anclaje-centinela-drift}.md`, veredicto Steve Jobs+mente-omega (2026-06-26). Estado actual: `docs/handoff-2026-07-21.md`.
**Kernel pre-existente (verde, sin UI):** `app/src/modelo/operaciones/anclaje.ts`.

---

## 1. Propósito y alcance

Hacer **visible y falsable** el valor del Anclaje: que una cosa anclada a una Pieza de una biblioteca gobernada **avise** cuando esa biblioteca cambió bajo sus pies, y que el curador pueda **Re-sincronizar** o **Soltar**. Hoy el kernel del Centinela está verde pero es invisible: nada en producción está anclado, no hay marcador, no hay resolutor de hash vivo. Este corte cose esos eslabones y se despliega.

**Entra (α):**
- Resolutor de **hash vivo** real: cargar las bibliotecas ancladas por `modeloId` desde el backend, computar su firma, evaluar drift.
- **Marcador** en el lienzo sobre cada cosa anclada **no-sincronizada** (divergente / no-resuelto).
- **Sección «Anclaje»** en el Inspector de la entidad: estado + Pieza/biblioteca + botones **Re-sincronizar** / **Soltar**, con copy honesto.

**NO entra (diferido, declarado):**
- El **gesto ergonómico de anclar** (sección de anclado / vitrina con elección Calcar/Anclar). El anclaje entra por **importación de bundle ya anclado** (fixture de gist; HODOM editado). Razón: el valor a falsar es *el aviso*, no el acto de anclar; y la puerta ergonómica está atada a la doctrina custodio-kora (a).
- **OPL/render canónico del anclaje** (C6/C7): bloqueado por la doctrina (a).
- **Drift granular por-Pieza** y «qué campo cambió» (C4): el drift de este corte es **biblioteca-nivel**.
- Listado agregado global de divergencias (un panel-resumen del modelo): segunda prioridad, no MVP.

## 2. Decisiones rectoras (no reabrir en implementación)

| # | Decisión | Origen |
|---|---|---|
| D1 | **Drift biblioteca-nivel.** Cualquier cambio en la biblioteca marca divergentes a **todas** sus cosas ancladas. El copy dice «la biblioteca cambió», **nunca** «tu Pieza cambió» (mentiría: quizá esa Pieza no se tocó). | acta valor §3.5 + Ψ-honestidad |
| D2 | **Sincronizado NO se marca.** La ausencia de marca comunica «al día»; solo lo no-sincronizado pide atención. | Jobs (sustracción) |
| D3 | **Crimson prohibido en el marcador.** Es UI-only (foco/selección). El marcador va en **tinta**, patrón chip hairline (`noteBadge`/`suppressedBadge`). | `composers/entidad.ts:462,973-977`, ui-forja/06 §100 |
| D4 | **Soltar es irreversible y se dice en el gesto.** El copy del botón lo declara antes del click; no hay undo de Soltar (Calco→Anclaje prohibido, ley de la adjunción). | `anclaje.ts:121-124` |
| D5 | **Cero matemática en superficie.** Vocabulario: Pieza / Anclaje / Soltar / biblioteca / sincronizado / divergente. Nunca fibración/pullback/Δ. | acta valor §condición 3 |
| D6 | **No mutar esencia.** El Anclaje es view+validate; re-sincronizar re-congela el hash, **no** reescribe la cosa. | acta nominación (iii) |
| D7 | **Renderer nunca es fuente de verdad.** El `driftMap` se computa en store (a partir del kernel puro) y se **pasa** al render; el render no lo calcula ni lo persiste. | CLAUDE.md §Arquitectura |

## 3. Arquitectura y flujo de datos

Dependencias unidireccionales, sin tocar el kernel (ya existe):

```
[ backend ]  cargarModeloBackend(modeloId)            (persistencia, ya existe)
     │
     ▼
[ store/modelo/acciones-anclaje.ts ]  (NUEVO — orquestación derivada)
   cargarYEvaluarDrift():
     1. junta los modeloId únicos de las bibliotecas ancladas
     2. carga cada uno, hidrata, firmaBiblioteca(modeloVivo) → hashVivo|null
     3. evaluarDriftModelo(modelo, resolverHashVivo) → driftMap: Record<Id,EstadoDrift>
   reSincronizarAnclajeEntidad(id) / soltarAnclajeEntidad(id):  envuelven el kernel + commitModelo
     │  driftMap vive en el slice (estado derivado de runtime, NO se serializa)
     ▼
[ render/jointjs ]  proyeccion.ts pasa driftMap a proyectarEntidad
   composers/entidad.ts: paso renderConDrift (análogo a renderConEstereotipo)
     │  marcador en tinta solo si driftMap[id] !== "sincronizado"
     ▼
[ ui/inspector/SeccionAnclaje.tsx ]  (NUEVO — lee driftMap, dispara acciones)
```

**Disparo de evaluación:** al activar/cargar un modelo en una pestaña (`store/runtime.ts → activarEstadoPestanas`), tras montar el estado, se invoca `cargarYEvaluarDrift()` (asíncrono, no bloquea el render inicial; el marcador aparece cuando resuelve). Re-disparo tras Re-sincronizar (actualiza la entidad afectada).

## 4. Componentes

### 4.1 Store — slice de drift (`store/modelo/acciones-anclaje.ts`, NUEVO)

Estado y acciones añadidas al `ModeloSlice` (tipo en `store/tipos.ts`):

```ts
driftMap: Record<Id, EstadoDrift>;          // derivado; inicial {}
cargarYEvaluarDrift(): Promise<void>;        // resuelve hashes vivos + evalúa
reSincronizarAnclajeEntidad(id: Id): Promise<void>;  // envuelve kernel + commit
soltarAnclajeEntidad(id: Id): void;          // envuelve kernel + commit
```

> **Nota de nombres:** las acciones del store se llaman `…Entidad` para **no** colisionar con las funciones puras del kernel (`reSincronizarAnclaje`, `soltarAnclaje`), que se importan y se invocan dentro. El store es el envoltorio con efecto (carga backend + `commitModelo`); el kernel es puro.
>
> **Nota de ensamblado (verificado en código):** el slice se compone por **capabilities declaradas** en `store/modelo/contrato.ts` (`MODELO_SLICE_CAPABILITIES` → `MODELO_SLICE_KEYS`). Las 4 keys nuevas (`driftMap`, `cargarYEvaluarDrift`, `reSincronizarAnclajeEntidad`, `soltarAnclajeEntidad`) **deben declararse ahí** (bucket nuevo `anclaje:` o uno existente), además de implementarse — si no, `contrato.test.ts` falla. `commitModelo` **no es método del slice**: es función exportada de `store/runtime.ts` con firma `commitModelo(set, previo, siguiente, extra?)`; el slice la importa y la invoca con `set` y el modelo actual.

**`cargarYEvaluarDrift`** (resolutor de hash vivo):
1. Recolecta los `modeloId` **únicos** de `entidad.anclaje.biblioteca.modeloId` sobre todas las entidades. Si no hay ninguno → `set({ driftMap: {} })` y termina.
2. Para cada `modeloId`: `cargarModeloBackend(modeloId)` → `hidratarModelo(json)` → `firmaBiblioteca(modeloVivo)`. Cualquier fallo (no encontrado, hidratación inválida, red) → `hashVivo = null` para ese `modeloId` (no se inventa estado).
3. `evaluarDriftModelo(modelo, (anclaje) => hashesVivos[anclaje.biblioteca.modeloId] ?? null)` → `Record<Id, EstadoDrift>`. `set({ driftMap })`.

**`reSincronizarAnclajeEntidad`:** carga la biblioteca, computa `firmaBiblioteca` viva, llama `reSincronizarAnclaje(modelo, id, hashVivo)` del kernel, `commitModelo` (entra al undo), y fija `driftMap[id] = "sincronizado"`. Si la biblioteca no resuelve → mensaje, sin mutar.

**`soltarAnclajeEntidad`:** llama `soltarAnclaje(modelo, id)` del kernel, `commitModelo`, y elimina `id` del `driftMap`. Síncrono (no necesita backend).

### 4.2 Render — marcador en el lienzo (`composers/entidad.ts` + `proyeccion.ts`)

**Paso de datos:** `driftMap` se enhebra como **parámetro posicional** (9º) de `proyectarModeloAJointCells`, con default `= null` — **espejo real de `simulacion`** (que es el 8º posicional, `proyeccion.ts:57`), **no** un campo de `OpcionesProyeccion` (que solo tiene `aliasVisibles/descripcionesVisibles/modoImagenGlobal/canalSeleccion`, `proyeccionTipos.ts:93-98`). `proyectarEntidad` recibe el `EstadoDrift` de la entidad como argumento. **Call sites:** solo el lienzo vivo (`JointCanvas.tsx:445`) pasa el `driftMap` real; `mapaExport.ts:138` y los ~70 call sites de `proyeccion.test.ts` toman el default `null` (export sin marcador, tests intactos). El default `= null` es lo que mantiene el blast radius en un solo call site.

**Marcador (nuevo paso `renderConDrift`):** se inyecta al final del pipeline, **espejo de `markupConEstereotipo`/`attrsConEstereotipo`** (líneas 463-499), antes o después del estereotipo (ortogonales). Solo si `estadoDrift && estadoDrift !== "sincronizado"` (D2).

- **Forma:** chip hairline en **tinta** (`CODEX.colores.ink`/`paper`), patrón `noteBadgeChip`/`suppressedBadgeChip` (líneas 931-956, 985-1010). **Esquina superior-izquierda** (`x≈4, y≈4`), libre (notas/fold ocupan sup-der; ⋯N ocupa inf-der).
- **Glifo (ajustable por `design:governance`, propuesta concreta):**
  - `divergente` → `⟳` (necesita re-sincronizar).
  - `no-resuelto` → `?` (no se pudo verificar la biblioteca).
  - `title` (tooltip) en palabras de carpintero: «La biblioteca de esta pieza cambió — revísala» / «No se pudo leer la biblioteca para verificar».
- **Sin estado interactivo en el marcador** (`pointerEvents:"none"` salvo el tooltip): la acción vive en el Inspector. El marcador **avisa y orienta de un vistazo**; no decide.

> **Gobernanza:** el marcador es un **indicador de estado** (chrome ui-forja), no semántica OPM de OPCloud — no hay asset OPCloud que clonar (regla de oro 3). Reusa el patrón de chip de estado existente; la forma final pasa `bun run design:governance`. No emite OPL, no cuenta como cosa.

### 4.3 Inspector — sección «Anclaje» (`ui/inspector/SeccionAnclaje.tsx`, NUEVO)

Montada en `InspectorEntidad.tsx` como su propia `FichaSeccion kicker="Anclaje"`, **solo si `entidad.anclaje`** existe (sin anclaje, la sección no aparece). Lee `modelo`, `entidad`, y `driftMap[entidad.id]` del store; dispara las acciones `…Entidad`. Nota: el canvas no marca lo sincronizado (D2), pero el Inspector de una cosa anclada **sí** informa su estado «al día» — son superficies distintas: el lienzo señala solo lo que pide atención; el Inspector, ya abierto sobre esa cosa, reporta su estado completo.

**Contenido según estado:**

- **`sincronizado`** — línea sobria: «Anclada a **{nombrePieza}** de **{nombreBiblioteca}** · al día». Sin botón de re-sync (deshabilitado/oculto). Botón **Soltar** disponible (con su advertencia, D4).
- **`divergente`** — el aviso, copy honesto biblioteca-nivel (D1):
  > **La biblioteca de esta pieza cambió.**
  > La anclaste a «{nombrePieza}» de {nombreBiblioteca}. Desde entonces, la biblioteca cambió.
  >
  > [ Re-sincronizar ]  [ Soltar ]
  >
  > Re-sincronizar adopta la versión nueva. Soltar la convierte en copia propia y deja de avisarte. **Soltar no se deshace.**
- **`no-resuelto`** — honestidad temporal: «No se pudo leer la biblioteca «{nombreBiblioteca}» para verificar si cambió.» Sin Re-sincronizar (no hay hash vivo). **Soltar** disponible. No se presenta como divergencia ni como al-día.

**Estilo:** tinta/tokens ui-forja; **sin crimson** en el cuerpo del aviso (D3); el énfasis es tipográfico (peso/kicker), no cromático de alarma. `data-testid` por estado para los e2e.

## 5. Manejo de estados y errores

| Situación | Resultado |
|---|---|
| Entidad sin `anclaje` | sin marcador, sin sección Inspector |
| Biblioteca resuelve, hash == frozen | `sincronizado` — sin marca |
| Biblioteca resuelve, hash ≠ frozen | `divergente` — marca `⟳` + aviso |
| Biblioteca no carga (ausente/red/hidratación inválida) | `no-resuelto` — marca `?`, sin inventar divergencia |
| Re-sincronizar con biblioteca caída | mensaje de error, modelo intacto |
| Soltar | quita `anclaje`, commit con undo, fuera del `driftMap` |

## 6. Las tres amarras del experimento (Jobs — contra el falso verde)

Condiciones de validación, **parte del corte**, no opcionales:

1. **Bundle real, no de juguete.** La validación se hace con **HODOM real anclado a raíces reales de gist** (`ent-Category` y/o `ent-Component`/`ent-Composite`, designadas por gist), no con un fixture de tres cajas. El bundle de import se construye desde HODOM.
2. **Mutación real persistida.** Anclar HODOM, persistir, **cambiar un tipo raíz de gist de verdad** en la biblioteca persistida, reabrir HODOM, y exigir que el marcador divergente aparezca **solo**, sin forzar el hash a mano. (Forzar el hash prueba `evaluarDrift`, que ya está verde — no el Centinela.)
3. **Criterio de muerte escrito ANTES del deploy.** En palabras de Félix-curador, sin matemática: «Si tras cambiar la raíz de gist abro HODOM y NO veo de un vistazo qué entidades quedaron divergentes, el Centinela no me ahorró el rastreo a mano → se mata el frente.»

## 7. Plan de pruebas (TDD)

- **Unit (store/resolutor)** — `acciones-anclaje.test.ts`: junta modeloId únicos; `no-resuelto` ante carga fallida; `driftMap` correcto ante hash igual/distinto; `reSincronizarAnclajeEntidad` re-congela y limpia el estado; `soltarAnclajeEntidad` quita anclaje y sale del `driftMap`; commits entran al undo.
- **Render** — `composers/entidad.test.ts`: marca presente solo si `driftMap[id] !== "sincronizado"`; ausente para `sincronizado` (D2); glifo por estado; **sin crimson** en los attrs del marcador (aserción dura D3); sobrevive a variantes (estados/plegado/selección).
- **E2E** (`e2e/`): importar un bundle con una cosa anclada divergente → marcador visible en canvas → abrir Inspector → ver el aviso + Re-sincronizar/Soltar → Re-sincronizar borra la marca; Soltar muestra la advertencia de irreversibilidad y desancla.
- **Validación en vivo (manual, amarra 2)** — el flujo HODOM↔gist real, documentado en el HANDOFF.
- **Gates:** `bun run check` + `lint` + `design:governance` (marcador) + `build` + `browser:smoke`. Cierre con `gate:refactor`.

## 8. Riesgos

- **Falso verde de laboratorio** (mitigado por las 3 amarras §6).
- **Drift biblioteca-nivel ruidoso:** un cambio menor de gist marca todo lo anclado. Honesto pero ruidoso; el copy lo dice; C4 (granular) lo afina después.
- **Marcador vs governance:** el glifo/posición puede requerir iteración en `design:governance`; tratado como chip de estado, no semántica OPM, para no rozar la doctrina (a).
- **Latencia de resolución:** cargar bibliotecas es asíncrono; el marcador aparece tras resolver. Aceptable (no bloquea el lienzo). Si una biblioteca es grande, considerar caché por `modeloId` dentro de la sesión (no-MVP).

## 9. Fuera de alcance (recordatorio)

Gesto ergonómico de anclar · OPL/render canónico del anclaje (espera (a)) · drift granular por-Pieza y diff de campo (C4) · panel-resumen agregado de divergencias · renombre interno D6→Calco.
