# Spec de diseño — La PUERTA del Anclaje (gesto de fundación del modelador)

**Fecha:** 2026-06-29 · **Frente:** gist-anchor / Anclaje · **Estado:** diseño aprobado por el curador (Félix), pendiente de plan de implementación.
**Gobernanza:** diseño de UI por `steve-jobs` (a cargo, delegado por el operador); plan de implementación por panel `steipete × allan-kelly`; ejecución orquestada por `steipete` vía paralelización (skill `lineas-paralelas`).
**SSOT relacionada:** acta de nominación `docs/auditorias/2026-06-24-acta-nominacion-reuso-tipos-opforja.md`; acta de valor/criterio de muerte `docs/auditorias/2026-06-24-acta-valor-anclaje-centinela-drift.md`; estado vivo `docs/HANDOFF.md` §Frentes abiertos 1.

---

## 0. Encuadre (la función esencial)

Una sola cosa: **traer una Pieza gobernada de una biblioteca al lienzo, decidiendo en el mismo gesto si la copio y la olvido (Calcar) o la copio y la dejo vigilada (Anclar).**

Hoy el kernel del Anclaje y el Centinela de Drift están desplegados, pero **no existe el verbo de fundación en la interfaz**: solo se gestiona un anclaje ya existente (Re-sincronizar / Soltar). Este corte construye la PUERTA — el gesto que crea anclajes — para que el caso real del curador (anclar derivados a gist y enterarse cuando gist cambia) sea ejercitable end-to-end desde el producto, sin inyectar anclaje por bundle.

Beneficiarios: el **explorador** (~80%, solo quiere Calcar una copia para adaptar) y el **comparador** (~20%, quiere saber si el canon se movió). El diseño sirve a ambos sin obligar al primero a aprender al segundo.

---

## 1. Modelo de datos y los dos verbos (APROBADO)

**Designar una biblioteca.** Un modelo persistido lleva un flag `esBiblioteca?: boolean` en su registro (mismo patrón que `archivado`/`autosalvado` en `app/src/persistencia/modelos.ts`), toggleable desde la gestión de modelos. Un modelo marcado aparece como **origen de Piezas** en el navegador; sus entidades son las Piezas.

**La mecánica del anclaje es relacional, no depende del flag.** El `anclaje` de cada entidad guarda el `modeloId` de su biblioteca; el Centinela ya resuelve el hash vivo de cualquier modelo por su id (`bibliotecasAncladas` + `cargarYEvaluarDrift` en `app/src/store/modelo/acciones-anclaje.ts`). El flag `esBiblioteca` gobierna **solo la navegación** (qué modelos se ofrecen como fuente y exponen Anclar). Varias bibliotecas son posibles de fábrica (el bucle ya itera sobre N bibliotecas ancladas).

**Los dos verbos sobre una Pieza:**
- **Calcar** (Σ, default brutal): clona la Pieza al OPD activo — datos copiados, identidad fresca, **sin** anclaje. Reusa el motor de clonado que ya sirve a la Vitrina (`injertarEstereotipo`/clonado con ids frescos).
- **Anclar** (Δ): **Calcar + atar** — a la entidad recién clonada se le asigna `anclaje = { piezaId, biblioteca: { modeloId, frozenAtHash, nombre } }`, con `frozenAtHash` = la firma viva de la biblioteca leída del backend (mismo cálculo del Centinela: `firmaBiblioteca`). Resultado: una entidad local (instantánea) que el Centinela vigila contra la Pieza viva.

**Invariante "Unlink = Σ":** un Anclaje *es* un Calco con un vínculo vivo encima; **Soltar** quita el vínculo y queda exactamente un Calco. No hay dos motores de clonado: hay uno, y Anclar le añade el `anclaje`. Por eso este corte **no necesita kernel nuevo**: `injertarEstereotipo` (clona) + `anclarAPieza` (ata, ya existe) compuestos.

**Gobernanza de la biblioteca (decisión del curador):**
- Abrir una biblioteca → **solo-lectura global** (reusa `readOnly` + `activarReadOnly` del store; bonus: en `readOnly`, guardar ya "guarda como copia nueva", `persistencia.ts:305-308`).
- **Editar biblioteca** → gesto explícito con **confirmación + advertencia única** → `activarReadOnly(false)`, editable mientras está abierta; al re-abrir vuelve a solo-lectura.
- Fundamento: materializa el invariante (i) del acta (base **evolutiva, no congelada, con fricción consciente**) y **fortalece el Centinela** — como los cambios a la biblioteca son deliberados, el aviso de drift es señal, no ruido accidental (ataca el caveat #1 del criterio de muerte).

**Invariantes del acta respetados:** default Calcar; decisión **en el gesto** (no inferida); Anclar = view+validate, no muta esencia (iii); Calco terminal-en-procedencia (iv); la PUERTA solo "trae del catálogo" (crea fresco), **no** retro-ancla una cosa existente — consistente con la ley de la adjunción (Calco→Anclaje prohibido; retro-anclar un Calco de facto la violaría).

---

## 2. La PUERTA — UI (APROBADO, veredicto de steve-jobs)

**(a) Una sola superficie «Piezas», no una cuarta.** Generalizar `app/src/ui/VitrinaEstereotipos.tsx` en una superficie `Piezas` con **selector de fuente** (`Este modelo` + cada modelo con `esBiblioteca=true`). **Retirar** `BibliotecaDock` (pausada, no montada; reclama la palabra "Biblioteca"). Renombrar la **etiqueta** `Injertar`→`Calcar` y "Vitrina de estereotipos"→"Piezas" (`CommandPalette.tsx:566`). Modal-como-paleta (reversible), no dock permanente. ⚠️ Es renombre **de la cara** (etiquetas visibles), NO el refactor interno masivo `estereotipo*`→`calco*` (370+ refs), que sigue diferido.

**(b) Default brutal + escotilla, no menú.** Por cada Pieza: `[ Calcar ]` sólido tinta (fondo `ink`, texto `paper`, como `botonResync`) + `Anclar` en hairline callado al lado (peso de `botonSoltar`). `Enter` sobre el ítem enfocado = Calcar. **Anclar solo aparece con fuente = biblioteca externa.** La distinción se enseña en **una línea** bajo el selector de fuente, no por ítem. Tras Calcar/Anclar la Pieza aterriza en la posición de inserción default del OPD, **seleccionada**, y el modal queda abierto. Rechazados: split-button (esconde Anclar tras caret), Alt+click (invisible), dos botones iguales (obliga al 80% a decidir).

```
PIEZAS                                                  [ Cerrar ]
──────────────────────────────────────────────────────────
Fuente:  ( Este modelo )  ( gist )*  ( HODOM-lib )
         De gist: Calcar trae una copia tuya; Anclar la
         mantiene vigilada (te avisa si gist cambia).
──────────────────────────────────────────────────────────
OBJETOS · 3
   «Recurso»   objeto físico · en origen / en destino
                                   [ Calcar ]   Anclar
ENLACES · 2
   «maneja»    agente · proceso    [ Calcar ]   Anclar
PATRONES · 1
   «Transacción»  Parte→Transar→Recurso (5 cosas)
                                   [ Calcar ]   Anclar
                                       4 piezas en gist
```
Con `Este modelo` activo, la columna `Anclar` desaparece (solo `[ Calcar ]`).

**(c) El anclaje al-día se DECLARA, al peso mínimo.** Revertir `entidad.ts:214 // D2: sincronizado no se marca`. El **mismo chip** de la esquina superior-izquierda pasa a tener **tres estados** (mismo slot, misma forma 15px, cambia glifo y peso):

| Estado | Glifo | Peso (tinta) | Título (hover) |
|---|---|---|---|
| sincronizado | marca de amarre **dibujada en path** (no carácter de fuente) | `inkFaint` | `Anclada a ‹Pieza› de ‹biblioteca› · al día` |
| no-resuelto | `?` serif | `inkSoft` | `No se pudo leer la biblioteca para verificar si cambió` |
| divergente | `⟳` serif | `ink` | `La biblioteca de esta pieza cambió — revísala` |

Gradiente de atención monótono **faint → soft → solid**, todo tinta, **cero crimson**. El glifo de reposo va dibujado como **path** (no carácter) para control de color y para evitar `⚓` U+2693 (dispara presentación emoji a color, rompe la disciplina cromática). **Sustracción:** NO se pone el rótulo `«Pieza»` sobre el anclado en el lienzo — el origen ya vive en el Inspector (`SeccionAnclaje`); el lienzo dice "está atado + su salud", el Inspector dice "a qué". División honesta.

**(d) Banner de solo-lectura, una confirmación.** Cinta en el slot `topbar` de `CodexCanvasMount` (donde viven los banners de modo, p. ej. `BarraSimulacion`), dos estados; la confirmación es **una vez** al desbloquear (gravedad por copy, no por crimson):
```
Solo-lectura:  ⊙ Biblioteca «gist» · solo lectura        [ Editar biblioteca ]
Editando:      ◉ Editando «gist» · los anclados verán un aviso  [ Terminar edición ]
Diálogo:       "Editar esta biblioteca puede hacer divergir los modelos anclados
                a ella. La próxima vez que se abran, verán un aviso de cambio.
                No se rompe nada: solo se enteran."   [ Cancelar ] [ Editar de todos modos ]
```
**Sustracción:** sin confirmaciones por-edición (entrenan a descartar avisos a ciegas — el anti-patrón que el Centinela combate); la cinta de "editando" carga el peligro de ahí en adelante.

---

## 3. Doctrina (a) a elevar al custodio-kora (NO bloquea el código)

La realización visual del Anclaje (chip de tres estados, incluido el al-día declarado) **roza doctrina de dominio aún no escrita**. Siguiendo el precedente **R-VIS-STEREO-1** (`docs/solicitudes-upstream/2026-06-22-estereotipos-vitrinas-ssot-skill.md`): se construye como **realización declarada** en un working-artifact + el manual, sin inventar regla de validez, respetando la precedencia `reglas-opm-estrictas > spec-forja-opd > ui-forja > impl`.

Entregable paralelo (no bloqueante): redactar `docs/solicitudes-upstream/2026-06-29-anclaje-forma-doctrina.md` con:
- la **forma del Anclaje** (realización visual del chip de 3 estados; el Anclaje NO emite OPL nuclear, igual que el estereotipo es meta; `frozenAtHash` = referencia-a-snapshot evolutivo);
- que **Anclar no muta esencia** (invariante iii — argumento para que el custodio lo bendiga);
- la pregunta abierta: ¿una entidad anclada **puede editar su esencia localmente**? (hoy el kernel no lo impide; la edición produciría drift detectable — se realiza como "vista que avisa"; la regla dura la decide el custodio);
- nota de que el **verbo de fundación formal** (`promover-a-Pieza`, registro global gobernado) queda **DIFERIDO**: este corte usa bibliotecas pragmáticas (modelo designado), suficientes para el caso real.

---

## 4. Alcance y fases del corte (insumo para el panel de planificación)

Componentes del corte, con dependencias para particionar en líneas paralelas. **El panel `steipete × allan-kelly` refina esto en líneas/olas/gates; lo de abajo es el mapa de bloques, no el plan final.**

| Bloque | Qué | Archivos núcleo | Depende de |
|---|---|---|---|
| **B1 — Flag biblioteca** | `esBiblioteca?` en `ModeloPersistido` + migración + toggle en gestión de modelos + endpoint | `persistencia/modelos.ts`, `server/modelPersistence.ts`, UI de gestión de modelos | — |
| **B2 — Superficie Piezas** | Generalizar Vitrina: selector de fuente, cargar Piezas de biblioteca externa (del backend), `Injertar`→`Calcar` (etiqueta), retirar `BibliotecaDock`, relabel CommandPalette | `ui/VitrinaEstereotipos.tsx`, `ui/CommandPalette.tsx`, retirar `ui/biblioteca/BibliotecaDock.tsx` | B1 (lee el flag) |
| **B3 — Verbo Anclar** | Acción store `anclarPiezaBiblioteca` (Calcar + `anclarAPieza` + `frozenAtHash` del backend); botón `Anclar` por ítem solo en fuente externa | `store/modelo/acciones-anclaje.ts` (o capacidades), `ui/VitrinaEstereotipos.tsx` | B2 |
| **B4 — Chip 3 estados** | Revertir `D2: sincronizado no se marca`; marca de amarre en path (`inkFaint`/`inkSoft`/`ink`) | `render/jointjs/composers/entidad.ts:214-215,523-578` | — (independiente) |
| **B5 — Banner solo-lectura** | Cinta topbar 2 estados + `Dialogo` de confirmación "Editar biblioteca"; activar `readOnly` al abrir biblioteca | `ui/App.tsx` (`CodexCanvasMount.topbar`), editability port, store | B1 (lee el flag) |
| **B6 — Doctrina (a)** | Working-artifact `solicitudes-upstream/2026-06-29-anclaje-forma-doctrina.md` | docs/ | — (paralelo, no bloquea) |

**Realización visual del anclaje al-día (B4):** ver §2(c). **Cero crimson** en todos los bloques (CrowdSec/CODEX).

**Gate por línea + reconciliación:** cada línea gatea contra su base (`bun run check` desde `app/`); al integrar, reconciliación e2e sobre `main` integrado (la skill `lineas-paralelas` y la memoria de rondas paralelas exigen esto). **e2e nuevos:** el flujo de la PUERTA (abrir Piezas → fuente biblioteca → Calcar / Anclar → marca al-día → mutar biblioteca → ⟳) extiende el patrón de `e2e/34-centinela-drift.spec.ts`. Smoke completo + `gate:refactor` al cierre. Deploy al final, autorizado por el curador.

---

## 5. Invariantes y restricciones (no negociables)

1. **Cero crimson** para alarma (CrowdSec/CODEX); el drift y el peligro usan tinta + copy.
2. **Default Calcar**; decisión en el gesto; Anclar a un gesto de distancia, no inferida.
3. **Precedencia** `reglas-opm-estrictas > spec-forja-opd > ui-forja > impl`; toda mudanza visual pasa `bun run design:governance`.
4. **No tocar el kernel** `operaciones/anclaje.ts` ni `firmaSemantica.ts` (Anclar compone `injertarEstereotipo` + `anclarAPieza` existentes).
5. **No regresión** del Centinela ya desplegado (`e2e/34` debe seguir verde) ni del Calco/D6 (renombre solo de etiqueta visible).
6. **Sin verbo de fundación formal** en este corte (diferido); bibliotecas = modelos designados.

---

## 6. Criterio de cierre del corte

- Gate `gate:refactor` verde desde `app/` (check + lint + build + governance + smoke + ledger).
- e2e nuevo del flujo de la PUERTA, adversarial (el anclaje solo enciende drift tras mutación real de la biblioteca).
- Validación in-vivo del flujo con gist real (abrir Piezas de gist → Anclar una Pieza a un derivado → mutar gist → el chip aparece) — extiende las amarras.
- Doctrina (a) elevada como working-artifact (no bloquea deploy).
- Deploy autorizado por el curador; HODOM sin regresión.
- HANDOFF + memoria consolidados.
