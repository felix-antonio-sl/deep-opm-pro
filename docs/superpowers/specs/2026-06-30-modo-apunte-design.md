# Spec de diseño — Modo apunte (especie hermana del modelo, sin rigor de cierre)

**Fecha:** 2026-06-30 · **Frente:** modo apunte · **Estado:** contrato cerrado por el operador (Félix, custodio), ejecución delegada a `steipete`.
**Gobernanza:** concepto y nombre por `steve-jobs` (8 correcciones, abajo); contrato de las 3 decisiones de cimiento por el operador (no reabrir); implementación por `steipete`.
**SSOT relacionada:** `CLAUDE.md §Identidad y límites` (frontera de dominio: opforja es la mesa, no modela dominio); `app/src/persistencia/modelos.ts` (gemelo `esBiblioteca`); `app/src/modelo/diagnosticoSeveridad.ts` (corrección 4); estado vivo `docs/HANDOFF.md`.

---

## 0. Encuadre (la función esencial)

Un **apunte** es una **especie de artefacto hermana del modelo** — no sub-tipo, no
capa, no garabato. Su función, en palabras de Jobs: «dejar que el operador piense
en OPM legítimo sin que el rigor de cierre lo interrumpa, en un archivo que no
miente sobre ser borrador».

Usa las **primitivas OPM legítimas** y el **lienzo de opforja**, pero **no se le
exige cerrar** como modelo válido. **Relaja el RIGOR, no la SEMÁNTICA.**

### Lo que NO es (precedente a no repetir)

D7 (modo boceto/pizarra, revertido 2026-06-23, `5adcf4ca`, «no resultó como
quería») era **garabato NO-OPM** (`Opd.bocetos?`, líneas/puntos sueltos) DENTRO de
un OPD, con un pipeline de promoción boceto→modelo/enlace. **El apunte es casi su
opuesto: OPM legítimo en un archivo propio.** No se replica nada de D7 — ni
`bocetos`, ni primitivas no-OPM, ni pipeline de promoción.

---

## 1. La LÍNEA DURA (la columna del diseño — no tocar)

> Se relaja la **VALIDEZ OPM** → observación; se conserva **SIEMPRE** la
> **INTEGRIDAD estructural** → bloqueo.
>
> - **Validez** = juicio sobre el *significado* (¿este enlace es legal?, ¿este
>   proceso transforma algo?, ¿el agente es humano?, ¿el nombre es concreto?).
>   En un apunte se degrada a observación al margen.
> - **Integridad** = precondición *mecánica* del documento (¿la aparición
>   referencia una entidad que existe?, ¿el enlace tiene ambos extremos?, ¿el JSON
>   tiene formato?). En un apunte **sigue bloqueando**, igual que en un modelo.

La integridad está protegida **por construcción**: vive en
`app/src/serializacion/validarIntegridad.ts::validarReferenciasOpd` (gate duro de
import/serialización, `Resultado<true>` → `fallo(...)`), un camino que **no recibe
ni conoce el flag `esApunte`**. Un apunte con una referencia OPD colgante se
rechaza al hidratarse exactamente igual que un modelo. La degradación del apunte
opera **solo** sobre la *severidad visible* de los diagnósticos del panel, jamás
sobre el gate de integridad.

---

## 2. Alcance: «skill primero + opforja mínimo» (decisión de cimiento 2)

El grueso del comportamiento vive en la **skill** (régimen permisivo de la voz).
En **opforja**, lo mínimo:

1. flag **aditivo** `esApunte?: boolean` — gemelo exacto de `esBiblioteca`:
   metadata del **record de persistencia** (`app/src/persistencia/modelos.ts`),
   **NO un campo del kernel OPM** (`Modelo`/`Entidad` intactos);
2. **badge** «Apunte» (marcador de identidad persistente en el lienzo);
3. **degradación por-clase** de los diagnósticos de cierre.

**Descartado** (decisión de cimiento 2): galería separada, persistencia nueva,
promoción con pipeline. «1ª clase» NO.

---

## 3. Las 8 correcciones de steve-jobs (el spec)

1. **UNA PALABRA.** El badge dice **«Apunte»** (singular), nunca «Borrador» ni
   «Boceto» — esas son la *explicación*, no el rótulo. El triaje de la skill puede
   **oír** sinónimos (bocetar / apunte / borrador), pero todo lo que el usuario VE
   y la doctrina NOMBRA es «Apunte».

2. **UN SOLO BIT DUEÑO.** El «régimen apunte» de la skill **no es un estado
   paralelo** — es el **reflejo de `esApunte`** (el bit persistido es la única
   verdad). Marcar apunte = UN gesto que (a) prende el flag y (b) pone la voz de la
   skill en *acompaña-sin-bloquear*. La skill **lee** el flag; no mantiene régimen
   propio. El triaje propone, el flag decide.

3. **UNA SOLA LISTA.** Las observaciones de la skill y los diagnósticos degradados
   de opforja son la **MISMA** salida de `validarModelo` / `listarAvisosDiagnostico`
   recomputada, mostrada en dos vistas (mesa + panel) — no dos inventarios. El modo
   apunte es una **lente de severidad** sobre la lista única, no una lista nueva.

4. **DEGRADAR POR CLASE, NO POR SEVERIDAD EN BRUTO** (load-bearing — blinda la
   línea dura). Cuando el modelo activo es apunte, degradar a observación SOLO una
   **whitelist de códigos de VALIDEZ OPM** (transformee, firma legal de enlaces,
   agente=humano, aciclicidad de refinamiento, nombres, AP-*). La **INTEGRIDAD
   estructural NUNCA degrada** (referencia OPD↔OPL colgante, enlace sin extremo,
   formato) — sigue siendo bloqueo incluso en apunte. El mecanismo es **whitelist
   (fail-closed)**: un código no listado conserva su severidad; así una regla de
   integridad nueva no degrada por accidente y «la ley falsable no se rompe».
   Implementación: `severidadDiagnostico(aviso, { esApunte })` en
   `app/src/modelo/diagnosticoSeveridad.ts` con `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`.

5. **EXCLUSIÓN MUTUA apunte⊕biblioteca, sellada por invariante.** Setear `esApunte`
   limpia/prohíbe `esBiblioteca` y viceversa (mismo patrón que `setSeleccionPorTipo`).
   Sellada en el único punto de gesto: `marcarApunte` y `marcarBiblioteca` en
   `app/src/persistencia/workspace.ts` (cada uno retira el flag hermano). Cierra el
   estado ilegal «biblioteca-borrador» que la persistencia hoy admitiría en silencio.

6. **DEUDA CATEGORIAL anotada ahora, pagada después.** `esBiblioteca`+`esApunte` =
   dos booleanos de especie = patrón O(N²). **NO refactorizar en este corte** (el
   flag aditivo es correcto). Trigger anotado en `docs/HANDOFF.md §Deuda categorial`:
   «al introducir un TERCER flag de especie, migrar `esBiblioteca`+`esApunte` →
   `especie: 'modelo'|'biblioteca'|'apunte'` discriminado antes de agregar el
   tercero». El invariante de la corrección 5 lo hace trivial.

7. **NO SOBRE-SUSPENDER EN LA SKILL** (frontera ética). En apunte se suspenden
   **EXACTAMENTE** las Reglas Duras **#12 (Anti-barro)** y **#13 (Anti-complacencia)**.
   Se MANTIENEN intactas: **#1 (bimodalidad)**, **#14 (aclaración serial cuando
   aplique)**, **#15 (la skill NO rellena campos en blanco)** — suspender #15 sería
   alucinación atribuida al humano: los huecos quedan COMO huecos, jamás se inventa
   transformee/esencia/agente no declarados —, el **vocabulario OPL cerrado (#17)** y
   la **integridad**. Fence explícito en la sección nueva de la skill.

8. **PROMOCIÓN = AUSENCIA DE SECCIÓN.** Graduar apunte→modelo reusa el **MISMO**
   control que marca/desmarca (un toggle bidireccional). Nada de pipeline, ni UI
   propia, ni gesto elaborado (eso era D7). Al graduar, `esApunte` se vuelve
   **AUSENTE** (no `false` — ausente, como el resto de la metadata opcional de
   `modelos.ts`). Los bloqueos de `validarModelo` re-enganchan solos porque la
   degradación lee la **PRESENCIA** del flag. Las observaciones acumuladas son el
   checklist de cierre (recomputadas, no persistidas).

---

## 4. Promoción sin rastro (resuelta por Jobs)

**SIN rastro.** NO existe `promovidoDesdeApunte`. Un modelo graduado pasó la
validación completa, **ES un modelo**; distinguirlo por su biografía crea casta y
re-semantiza el record (trampa cry-wolf). La procedencia ya vive en git. El toggle
bidireccional (marcar↔desmarcar) ES la promoción; no hay segundo gesto.

---

## 5. El badge

- **Una palabra:** «Apunte».
- **Hairline**, en tokens existentes (`inkFaint`/`inkSoft`), como el gemelo
  biblioteca (`app/src/ui/CintaBiblioteca.tsx`).
- **Editable**: biblioteca fuerza `readOnly`; el apunte **NO** — es para editar.
  El badge no toca `readOnly` ni pide confirmación: es identidad, no candado.
- **Persistente**: marcador de identidad porque el mismo lienzo sirve a dos
  especies. Vive en el slot `topbar` (gemelo de `CintaBiblioteca`), gobernado por
  `esApunteAbierto` (disjunto de `readOnly`).

---

## 6. Fuera de alcance (este corte)

- Galería/persistencia separada para apuntes (decisión 2: descartado).
- Pipeline de promoción / UI propia de graduación (corrección 8: es ausencia).
- Rastro de procedencia `promovidoDesdeApunte` (sección 4: sin rastro).
- Refactor del par `esBiblioteca`+`esApunte` a discriminado (corrección 6: deuda
  anotada, se paga al 3er flag).
- Tocar modelos de dominio (HODOM, gist) — frontera del `CLAUDE.md §Identidad`.
- Propagación cross-repo a `kora-pneuma` y a otros consumidores de la skill (fase
  posterior del operador; se deja IDENTIFICADA, no ejecutada).

---

## 7. Leyes falsables (TDD)

1. **Degradación por-clase** (`diagnosticoSeveridad.test.ts`): un código de VALIDEZ
   whitelisted con severidad `error` → `bloqueo` en modo normal, `estilo`
   (observación) con `{ esApunte: true }`; un código de INTEGRIDAD (no whitelisted)
   → su severidad **no cambia** entre modos. Guarda la corrección 4.
2. **Integridad incondicional** (`validarIntegridad`): `validarReferenciasOpd` de un
   modelo con referencia colgante devuelve `fallo` — no recibe `esApunte`, no hay
   bypass. Guarda la línea dura.
3. **Exclusión mutua** (`workspace`/`apunte.test.ts`): `marcarApunte(true)` retira
   `esBiblioteca`; `marcarBiblioteca(true)` retira `esApunte`. Guarda la corrección 5.
4. **Propagación del flag** (gemelo de `biblioteca.test.ts`): `construirModeloPersistido`
   propaga/hereda `esApunte`; el roundtrip de persistencia lo conserva.
