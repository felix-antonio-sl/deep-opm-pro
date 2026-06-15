# Orden in-zoom: sincronización canvas→campo (cara 4 de la bimodalidad)

Estado: diseño aprobado (lectura categorial con cat-thinking: veredicto «ship + ajusta D2», 2026-06-15).
Alcance: **Fase 1·U8** — completa la cuarta cara de la bimodalidad de `Opd.ordenInzoom: Id[][]`.

## 0. Contexto: las cuatro caras del campo

`Opd.ordenInzoom` es secuencia de bandas; banda = subprocesos en paralelo a la misma altura
(eje Y = línea de tiempo, ISO 19450). Tres caras ya están en producción:

1. **OPL → campo** (reverse): `parser/` reconstruye las bandas del texto «… en esa secuencia».
2. **campo → OPL** (forward): `generadores/refinamiento.ts::describirProcesosTemporales` →
   `agruparPorOrdenInzoom`.
3. **campo → canvas** (layout): `autoria/layout.ts::aplicarLayoutCompleto` lee `opd.ordenInzoom`
   y asigna banda Y por índice de banda.

Falta la **cara 4 — canvas → campo**: que reposicionar subprocesos en un in-zoom DECLARE el orden.
Decisión del operador (firme): **sincronización viva**. «Cambiar posición ES intención explícita».

## 1. Lectura categorial (par cociente / sección, NO adjunción ni bisimulación)

- Sea `O` el conjunto de campos `ordenInzoom` en **forma normal** y `G` el conjunto de geometrías
  (posiciones de los subprocesos internos).
- `layout : O → G` realiza un campo en geometría (cara 3).
- `derivar : G → O` proyecta la geometría a su campo (cara 4, esta unidad).
- `derivar` es un **cociente** (colapsa toda geometría dentro de la tolerancia ±4px a un mismo
  campo). `layout` es una **sección** de ese cociente: `derivar ∘ layout = id_O` (ley en U8.4).
- La inversa **`layout ∘ derivar = id_G` es FALSA por diseño**: `derivar` no normaliza la geometría
  del usuario (no re-centra ni re-espacia), así que el roundtrip por `G` no recupera los píxeles.
  No es adjunción ni bisimulación: es un retracto (split mono/epi).
- La sección protege **por construcción** la conmutatividad `OPL(geometría) = OPL(campo) ∘ derivar`,
  porque `derivar` y el forward OPL comparten el MISMO agrupador `agruparSubprocesosParalelos`.

## 2. Forma normal del cociente (canonicidad)

El objeto `O` no admite dos representantes del mismo orden. Reglas de `derivar`:

- **Partición TOTAL de los internos, o `undefined`.** Nunca cobertura parcial. Si por cualquier
  razón no se logra particionar todos los subprocesos internos, se devuelve `undefined`.
- **`< 2 bandas` (todo paralelo o ≤1 subproceso) ⇒ `undefined`.** Evita dos representantes del
  objeto inicial: `undefined` y `[[todos]]` denotarían el mismo «sin orden secuencial». La forma
  normal elige `undefined`. (Coincide con `podarOrdenInzoom` en `eliminacion.ts`, que también
  colapsa el campo de `<1` banda a ausente.)
- Cada banda viene **ordenada intra-banda por X** (luego por id), igual que `agruparSubprocesosParalelos`.
- El resultado satisface trivialmente la anticadena de `validarOrdenInzoom` (cada id en una banda).

## 3. Las 4 unidades (TDD red→green por unidad)

### U8.1 · Helper puro de kernel — `derivarOrdenInzoomDeGeometria`
- Firma: `derivarOrdenInzoomDeGeometria(modelo, opdId): Id[][] | undefined`.
- Vive en `src/modelo/operaciones/refinamiento/helpers.ts` (KERNEL; NO importa de `opl/`).
- Toma el contorno de descomposición de proceso del OPD; junta los subprocesos INTERNOS
  (proceso, dentro del contorno, excluye contorno y externos) con el MISMO criterio geométrico
  `dentroDe` que usa el forward OPL (`aparienciasInternasDeRefinamiento`), reimplementado con los
  helpers kernel `dentroDe` + tipo proceso (sin dep hacia `opl/`).
- Agrupa con **`agruparSubprocesosParalelos`** (reuso compartido con el forward → conmutatividad).
- Mapea `Apariencia[][]` → `Id[][]` (entidadId por banda).
- Aplica la forma normal del §2 (`<2` bandas ⇒ `undefined`).
- NO muta el modelo: helper puro.

### U8.2 · Guard de idempotencia — `aplicarOrdenInzoomDerivado` (puro)
- Firma: `aplicarOrdenInzoomDerivado(modelo, opdId): Modelo`.
- Deriva con U8.1. Compara con `opd.ordenInzoom` actual **en forma normal** (`mismaSecuenciaBandas`
  sobre `formaNormalBandas`).
- Si difieren: escribe el campo (o lo BORRA si `derivar` da `undefined` y había orden de ≥2 bandas).
- Si son iguales: **devuelve el modelo SIN tocar** (referencia idéntica) → no-op aguas arriba.
- **Refinamiento de forma normal (riesgo §6, pérdida silenciosa):** un campo de `≤1 banda`
  (p.ej. `[[a,b]]` = «todo paralelo» declarado por OPL «… en paralelo A y B») es el MISMO
  representante del cociente que `undefined`. El guard los trata como iguales → un drag cosmético
  que no cruza banda NO borra ese campo (no hay pérdida de orden, no hay churn). El reverse OPL
  además solo emite campos de ≥2 bandas o ninguno (`planificar.ts`: «en esa secuencia»); el campo
  de 1 banda es un borde teórico que esta normalización neutraliza.
- Justificación D2 (load-bearing): un nudge cosmético dentro de tolerancia produce el mismo campo
  → no-op → no destruye un paralelo declarado por OPL con un arrastre de 5px, no genera churn en
  undo ni en `verify:reproducible`. Solo CRUZAR una banda reescribe (eso ES reordenar).

### U8.3 · Hook de drag-end (store)
- Engancha SOLO la acción `moverAparienciaConPuertos` (`store/modelo/acciones-canvas.ts`), que es
  el ÚNICO callsite del drag manual del canvas (`render/jointjs/handlers/drag.ts::onElementPointerup`
  → `moverAparienciaConPuertosRef.current`). NO toca `moverApariencia`/`moverEntidad` ni el
  `moverAparienciaPorId` genérico del kernel (que corre en auto-layout/import/carga → cerraría el
  ciclo `campo→layout→geometría→derivar→campo` y pisaría campos declarados por OPL/import).
- Tras componer el move + ajuste de puertos (modelo `embellecido`), si la apariencia movida es un
  subproceso interno de un in-zoom, deriva GLOBAL sobre ese OPD (re-derive de TODOS los internos,
  no incremental — o se rompe la anticadena) con U8.2 y compone el resultado en el MISMO modelo
  `siguiente` que entra a `commitModelo`.
- **Undo atómico GRATIS**: `commitModelo` empuja UN solo `previo` al `undoStack` por llamada. Como
  move + set-orden viajan en un único `siguiente`, el undo los revierte como UNA transacción. No
  requiere batching especial.
- `dirtyModelo` se preserva (es layout puro respecto al modelo persistido; el campo derivado viaja
  con el move y no marca el modelo como semánticamente sucio más allá de lo que el move ya hacía).

### U8.4 · Ley de sección (`derivar ∘ layout = id_O`)
- Fixture: campo `ordenInzoom` declarado (CX1 secuencia, CX2 con banda paralela). `aplicarLayoutCompleto`
  lo realiza en geometría; `derivarOrdenInzoomDeGeometria` recupera el MISMO campo.
- Comentario explícito en el test: la inversa `layout ∘ derivar = id_G` es FALSA por diseño (no se
  normaliza la geometría del usuario); NO se escribe.
- Refuerzo de conmutatividad: el OPL del modelo con campo derivado == OPL del modelo con campo
  declarado (mismo agrupador).

## 4. Qué NO se hace

- NO se engancha el move genérico del kernel (`moverAparienciaPorId`) ni `moverApariencia`/`moverEntidad`.
- NO se deriva en auto-layout, import, carga ni undo/redo (solo drag-end manual).
- NO se normaliza la geometría del usuario (la inversa es falsa por diseño).
- NO se escribe `[[todos]]` para «todo paralelo»: la forma normal es `undefined`.
- NO se toca el render (la verdad vive en el campo del kernel; el render proyecta).
- NO se toca HODOM ni el golden hd-opm (aditivo sobre campo opcional; los modelos generados usan
  enlaces → fallback; el drag manual solo aplica a edición interactiva).

## 5. Blast radius y gate

- ~3 archivos de producción + tests: `refinamiento/helpers.ts` (U8.1+U8.2), `acciones-canvas.ts`
  (U8.3), nueva ley en `leyes/`. Aditivo, reversible, retrocompat.
- Gate: `bun run check` (typecheck + unit) + `bun run lint` + `bun run build` + `bun run design:governance`.
