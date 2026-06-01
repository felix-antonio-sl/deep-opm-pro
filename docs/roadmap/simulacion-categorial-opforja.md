# Simulación categorial de opforja — motor (anamorfismo) + experiencia (Codex)

> **Estado:** propuesta de diseño para el equipo (kernel + UI/UX + docs). No implementado.
> **Fecha:** 2026-06-01. **Reemplaza** por completo cualquier borrador previo de esta ruta.
> **Hermano de:** `docs/roadmap/capa-categorial-opforja.md` (cimiento de hechos + 4 pisos). La simulación **reusa el cimiento F0** y se conecta con equivalencia (F2) y razonamiento (F3).
> **Autoridad de diseño:** `ui-forja/GOVERNANCE.md` + specs `01`–`08` + `tokens.json`. Gate: `cd app && bun run design:governance`.

---

## §0. Resumen ejecutivo

Simular un modelo OPM es **desplegar su comportamiento en el tiempo**. Categorialmente eso es un **anamorfismo**: el *unfold* de una coalgebra `paso : EstadoSistema → F(EstadoSistema)` desde un estado inicial. Y resulta que **opforja ya lo tiene a medio construir**: `app/src/modelo/simulacion/runner.ts::ejecutarPaso` es la coalgebra (pura), `ejecutarCorrida` es el unfold, `ContextoSimulacion` es el carrier. No hay que reescribir — hay que **generalizar**.

Este documento tiene dos mitades que se espejan, porque **la forma es parte del contenido**:

- **Parte I — el motor**: la simulación como anamorfismo parametrizado por un *functor de efecto* `F` (que desbloquea modos determinista / muestreo / exhaustivo del mismo motor), con tiempo híbrido mínimo, componible con in-zoom por lentes, y conectada al resto de la capa categorial.
- **Parte II — la experiencia**: cómo cada construcción formal se vuelve una interacción **intuitiva y satisfactoria** bajo el lenguaje Codex, de modo que simular se sienta tan natural como riguroso es su cimiento. **Cero entrenamiento.**

**Tesis de diseño:** la UX es el *functor de presentación* de la coalgebra. Si el functor es fiel (no inventa ni pierde) y natural (el usuario siente la estructura sin que se la expliquen), simular es a la vez correcto y placentero.

---

## §1. Principios rectores

**Vector axiológico (techo):** la simulación existe para que un humano **comprenda el comportamiento** de su modelo. El rigor categorial va *debajo*; la experiencia va *delante*. Ninguna profundidad formal justifica una pantalla que exija tutorial.

**Tres autoridades, una dirección:**
1. **OPM/SSOT** decide qué es legal simular (modos de transformación, línea de tiempo, instancias operacionales).
2. **Teoría de categorías** (`icas-efectos`, `icas-interaccion`, `icas-tiempo`) decide la *estructura* del motor (coalgebra, functor, lente).
3. **Codex** (`ui-forja/`) decide la *forma sensible* (tipografía-primero, hairlines, crimson UI-only, cero entrenamiento).

**Disciplina de lenguaje (heredada del consenso):** en código, vocabulario OPM/dominio (`ejecutarPaso`, `corredor`, `traza`, `rama`); en docs, la lectura formal (anamorfismo, functor, bisimulación). El usuario **jamás** lee "functor" en pantalla.

---

# PARTE I — EL MOTOR (cimiento categorial)

## §2. La idea: simular = anamorfismo (ya latente en B0)

| Pieza coalgebraica | Dónde vive HOY en opforja | Estado |
|---|---|---|
| **Carrier** `EstadoSistema` | `modelo/simulacion/tipos.ts::ContextoSimulacion` `{plan, pasoActual, estado, estadosCurrent, valoresRuntime, trace}` | ✅ existe, inmutable |
| **Coalgebra** `paso` | `runner.ts::ejecutarPaso(modelo, ctx) → ctx'` — **pura** | ✅ existe |
| **Unfold** (anamorfismo) | `runner.ts::ejecutarCorrida` | ✅ existe |
| **Reloj** | `pasoActual += 1` (índice discreto) | ⚠️ sin duración real |
| **Functor `F`: no-determinismo** | `modelo/decision.ts` (policies XOR/OR) **no consumido por el runner** | ❌ desconectado |
| **Functor `F`: probabilidad** | `modelo/simulacion/parametros.ts` (7 distribuciones) **solo para valores/CSV** | ⚠️ desconectado |

**El cambio nuclear:** hoy `planificarSimulacion` pre-calcula un `PasoSimulacion[]` **lineal** y `ejecutarPaso` avanza un índice. Eso es recorrer una lista, no un anamorfismo pleno. El rediseño: **`paso` lee el estado actual + el modelo y *genera* el siguiente estado** (eligiendo rama cuando hay abanico). El plan deja de ser una lista pre-computada; **emerge del unfold**. Esto desbloquea XOR/OR/bucles (hoy ❌). **Compatibilidad:** el plan lineal actual es exactamente el caso `F = Identidad`; el determinismo de B0 se preserva como un modo.

## §3. El carrier, el functor `F`, y los cuatro modos

`F` no es fijo: **se deriva del modelo y de lo que el usuario pide**. Del **mismo** `ejecutarPaso` salen cuatro modos que hoy habría que codificar por separado:

| Modo | `F` | Qué produce | Reusa |
|---|---|---|---|
| **Determinista** | `Id` + tiempo (rama nominal / mayor probabilidad) | una traza (lo de hoy) | — |
| **Muestreo** (Monte Carlo) | `Dist` (muestrea con semilla) | N trazas → estadísticas | `parametros.ts` |
| **Exhaustivo** | `Powerset` (todas las ramas) | árbol de ejecución | `decision.ts` |
| **Simbólico** | sin instanciar | = razonamiento (catamorfismo, F3) | cimiento F0 |

**Decisión semántica explícita (no default oculto):** cuando coexisten no-determinismo (XOR) y probabilidad (Pr), el **orden importa** (`Dist∘Powerset ≠ Powerset∘Dist`). En OPM se **deriva**: abanico XOR *con* `Pr` → `Dist`; XOR/OR *sin* `Pr` → `Powerset`. Queda registrado en el OPL, nunca en el código.

## §4. Tiempo híbrido — lo mínimo, no lo elegante

La traza es una sección de un **sheaf temporal**; el **diagrama de vida útil** de OPM es esa sección. El tiempo es **híbrido**: continuo dentro del proceso (duración `min/nominal/max`, ya en `tipos/estado.ts::DuracionTemporal`), discreto en transiciones/eventos/excepciones (sobretiempo/subtiempo = umbral continuo → evento discreto). **Para ejecutar basta** un reloj discreto + duración + excepciones por umbral + lifeline + orden paralelo. El sheaf completo es para *verificar*, no para *correr* — no se implementa.

## §5. Composición por lentes — simular el todo = componer las partes

Un proceso es una **lente** (Moore machine: estado→observable, estado+input→siguiente). El in-zoom síncrono es **composición de lentes**; como las lentes componen, **simular un proceso descompuesto = componer la simulación de sus subprocesos es teorema**, no aspiración (`icas-interaccion`). Hoy el plan recursa OPDs hijos secuencialmente; el rediseño los **compone**. El "cambio de rol" instrumento↔afectado = composición de lentes con cambio neto nulo.

## §6. La simulación no es isla

- **Cimiento F0:** `estadosCurrent`/`valoresRuntime`, proyectados, son **hechos de ejecución**; la traza es una **secuencia de conjuntos de hechos**. `hechosDe` se extiende a `hechosDe(estadoSimulacion)`.
- **Equivalencia F2:** correr dos variantes y comparar = **bisimulación** → verifica que son equivalentes.
- **Razonamiento F3:** el unfold exhaustivo, resumido, **es** razonamiento de alcanzabilidad (fold del unfold). Mismo motor, dual.

## §7. Mapeo a B0 real + líneas rojas del motor

**Reusar (ya existe, solo enchufar al functor):** `decision.ts` → `Powerset`/selección de rama; `parametros.ts` → `Dist`/muestreo; `DuracionTemporal` → reloj híbrido.

**Líneas rojas del motor (no romper):** firma de `ContextoSimulacion` (o adaptador), el vector `focoPasoActualSimulacion`, el gate puro `debeAnimarTokensSim`, el port `useZustandSimulationPort`, el timing `intervaloAutoAvanceMs(v)=900/v`. **OPCloud** resolvió esto con un "runner" (sync/async/headless) desacoplado del bucle — que es exactamente nuestro functor `F`; pero su motor de ejecución está **ofuscado**, así que tomamos la *idea* (runner=estrategia), no el código.

---

# PARTE II — LA EXPERIENCIA (UX/UI canónica al servicio de la UX)

> Aquí el rigor se vuelve placer. Cada decisión cita un principio de diseño (jobs-web-ux I–XV) y usa tokens Codex exactos.

## §8. Tabla maestra: construcción formal → correlato sensible

Esta tabla **es** la tesis del documento. Leerla de izquierda a derecha es ver cómo la matemática se vuelve experiencia.

| Construcción categorial | Correlato de experiencia | Realización Codex |
|---|---|---|
| **Anamorfismo** (unfold paso a paso) | reproducción + línea de tiempo navegable | botones-palabra + marcos `· · ·` |
| **Carrier** `EstadoSistema` (el "ahora") | proceso activo + estados alcanzados + token en vuelo | halo crimson dashed + OPL resaltado + token verde |
| **Functor `F`** (los modos) | selector `modo: determinista · muestreo · exhaustivo` | segmented inline (revelado solo si hay ramas) |
| **No-determinismo** (`Powerset`) | navegar el árbol de ramas | `rama 1 de 2 ◂ ▸` |
| **Probabilidad** (`Dist`) | rama elegida + su probabilidad + semilla | marginalia bajo el paso |
| **Traza** (secuencia de hechos) | bitácora del recorrido + scrubbing | filas de traza + marcos |
| **Bisimulación** (F2) | comparar dos corridas | (fase ulterior) split lado a lado |
| **Dualidad fold/unfold** | `simular` (desplegar) ↔ `consultar` (resumir) | dos verbos, un motor |
| **Tiempo híbrido** | reloj + duración; vida útil | timer mono + panel de vida útil |

## §9. El registro visual de simulación (decisión de color canónica)

**Problema:** la simulación es una **capa temporal** proyectada sobre el OPD estático; el ojo debe leer "esto es la dimensión viva". Codex resuelve registros con *tinta* (estático), *crimson* (foco/UI), *canon OPM* (clases). La simulación es un cuarto registro — y la regla Codex (principio I: sustracción) dice **no inventes un color**.

**Decisión (la versión canónica):**

| Elemento de simulación | Canal | Token Codex | Por qué |
|---|---|---|---|
| **Token en vuelo** (instancia de objeto fluyendo por un enlace) | color + **movimiento** | `opmGreen` `#27613f` | un token *es* una instancia de objeto; el movimiento = vida |
| **Proceso activo** ("el ahora") | **textura + crimson** | `crimson` `#8e2a2e`, halo `dashed 6 3`, 3px | crimson = registro de foco/current de Codex; resuelve V-132 sin color nuevo |
| **Estado alcanzado** ("current" temporal) | crimson | anillo/subrayado `crimson` sobre la cápsula | "lo current" es crimson en Codex |
| **Distinción dinámico vs estático** | **movimiento + dashed**, jamás un 4º color | — | principio I (sustracción) |

> **Divergencia con B0 (honesta):** hoy `halos.ts` usa `SIM_VERDE #16a34a` (brillante, fuera de canon) y un pin ámbar `#f59e0b`. La versión canónica **los retira** → migra a `opmGreen` + crimson + textura. Costo: actualizar `composers/halos.ts` y los e2e que afirman `#16a34a`. Es deuda de canonicidad que V-132 (pendiente) habilita pagar ahora. Ver §22.

## §10. La BarraSimulacion canónica (palabras, no iconos)

Codex no usa iconos de reproducción: **los controles son palabras** separadas por `·`, con hover→peso 600 y activo→subrayado crimson. Reemplaza la Toolbar al entrar en simulación (`position: fixed; top: 60px` en desktop — recordar el bug de clipping f23d0a).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Simulación   ▸ Aprobar Solicitud      paso 3 de 8        SD ▸ SD1              │  ← estado (XIII)
│                                                                                │
│ reproducir ⌘P · pausa · ◂ atrás · paso ▸ · correr · reiniciar      salir  ⎋   │  ← controles (palabras)
│                                                                                │
│ velocidad  ½× · 1× · 2× · 4×          modo  determinista · muestreo · exhaustivo│  ← segmented (XI)
└──────────────────────────────────────────────────────────────────────────────┘
        marcos:  1 · 2 · ⟨3⟩ · 4 · 5 · 6 · 7 · 8            00:03 / 00:08          ← timeline + timer mono
```

**Microcopy literal (es-CL; principio XV — el copy es UI):**
- Botón principal: **`reproducir`** (no "play"). Al reproducir, muta a **`pausa`**.
- `paso ▸` avanza uno; `◂ atrás` retrocede uno (reversibilidad, §13).
- `correr` = "ejecutar hasta el final"; marginalia: *"corre los pasos restantes sin animación"*.
- `reiniciar` = "volver al paso 0" (no borra el modelo). **Nunca** "reset".
- `salir ⎋` = "salir de simulación" (vuelve a edición). El canvas vuelve a ser editable.
- Estado activo (arriba izq.): `▸ Aprobar Solicitud` en cursiva (es un proceso) + crimson (es el "ahora").
- Contador: `paso 3 de 8` (lenguaje natural, no `3/8` salvo en el timer mono).

**Realización Codex (tokens exactos):** Inria Serif 13.5px, `ink #171511`; separadores `·` en `inkFaint #b5b0a4`; activo peso 600 + `border-bottom: 1px solid crimson`; shortcuts en `<kbd>` JetBrains Mono 10px `letter-spacing 0.06em` borde `rule`; timer en mono 10px `inkSoft`; transición `120ms ease` solo en color/peso; **cero radios, cero sombras**.

## §11. Progressive disclosure de modos (default brutal)

**Principio IV (default brutal) + I (sustracción):** la mayoría de los modelos son lineales-deterministas. Para ellos, **el selector de modo no aparece** — sería ruido. El default es **Determinista**, sin preguntar.

```
Modelo SIN abanicos:   [ no se muestra selector de modo ]   ← cero ruido
Modelo CON abanicos:   modo  determinista · muestreo · exhaustivo   ← se revela
```

- **Determinista** (default): elige la rama de mayor `Pr` (o la primera si no hay `Pr`). Reproducción única, fluida.
- **Muestreo**: muestrea con semilla visible. Aparece `semilla 42 ↺` (clickeable para re-tirar). Reproducibilidad (principio VII).
- **Exhaustivo**: explora el árbol. Aparece `rama 1 de 2 ◂ ▸` para navegar. Latencia honesta (§16).

> Esto evita **Settings Paralysis** (anti-patrón): un selector de 3 opciones que solo aparece cuando importa, no 30 sliders.

## §12. Trazabilidad y confianza (por qué pasó cada paso)

**Principios VII (trazabilidad) + IX (confianza calibrada):** cuando hay una elección, el usuario debe ver **por qué**. La traza (que ya existe) se enriquece con marginalia bajo el paso — **anotación al pie**, no tooltip flotante (Codex prohíbe tooltips):

```
3   Aprobar Solicitud   cambió Solicitud de ‹pendiente› a ‹aprobada›
    — rama «aprobar» elegida · determinista (Pr mayor: 0.7)            ← determinista
    — rama «aprobar» elegida · muestreo (Pr 0.7, semilla 42)           ← muestreo
    — rama «aprobar» · exhaustivo, vista 1 de 2                        ← exhaustivo
    △ MEDIA  la precondición «monto < límite» se asumió verdadera
```

**Distinción honesta (jamás mezclar):** un hecho **declarado** (está en el modelo) se renderiza normal; uno **inferido** (lo dedujo el motor) lleva marca; uno **aleatorio** (muestreado) muestra su semilla. Esto evita **False Confidence** y **Hallucination Hand-Wave**.

## §13. Reversibilidad (principio VIII — undo es ley)

Simular debe sentirse **sin miedo**: explorar y volver atrás siempre.

- **`◂ atrás`** retrocede un paso; **`paso ▸`** avanza. El recorrido es bidireccional.
- **La línea de tiempo es navegable (scrubbing):** los marcos `1 · 2 · ⟨3⟩ · 4 …` son clickeables → saltar a cualquier paso. Marco actual en crimson + peso 600. Realización: **segmented inline de marcos** (Codex: discreto y tipográfico, no slider continuo).
- **`⌘Z`** deshace dentro de la simulación. La simulación **nunca muta el modelo** (es read-only) → salir siempre es seguro (no hay **Generation Surprise**).

## §14. El canvas vivo (animación canónica)

El protagonista es el **movimiento**, no el color (Codex).

- **Token en vuelo:** círculo `opmGreen #27613f` (r=6) que recorre el enlace durante consumo/resultado, vía `linkView.sendToken`. Duración = `duración del paso / velocidad`. Es una instancia de objeto fluyendo — semánticamente correcto.
- **Halo del proceso activo:** elipse **crimson** `dashed 6 3`, 3px, 6px fuera del bbox, `pointer-events: none`, `z: 35`. Resuelve V-132 (diferenciado del refinable azul) **sin** color nuevo.
- **Estado alcanzado:** anillo/subrayado crimson sobre la cápsula del estado (en vez del pin ámbar fuera de canon).
- **Motion (principio III + V):** transiciones `120–150ms ease`, solo fade de opacidad para entrada/salida de halos; el token viaja en línea recta (connector `straight`). **Sin** easing decorativo. La velocidad percibida se cuida: el halo aparece en <150ms, antes de que el token termine.

## §15. El OPL como narración sincronizada

El panel OPL **cuenta la historia** mientras corre (ya implementado, se conserva intacto):
- La oración del proceso activo gana `data-sim-activa="true"` → barra lateral `inset 2px 0 0 bosque` + fondo `bosqueSoft`. (**Línea roja:** los e2e dependen de `data-sim-activa`.)
- Si además está seleccionada: doble barra `inset 4px bosque, inset 2px crimson`.
- **Narrativa:** leer el OPL resaltado paso a paso es leer la ejecución en prosa OPM. Esto *es* la bimodalidad (F1) en acción temporal.

## §16. Latencia honesta (principio X)

El modo **exhaustivo** puede explotar (árbol de ramas). Nunca **Loading Limbo**:
- Progreso real: `explorando rama 7 de ~32`.
- Límite con aviso: si supera N ramas, marginalia `△ ALTA  el árbol superó 200 ramas; mostrando las 200 primeras` (principio XV).
- El modo muestreo con N corridas muestra `corrida 40 de 100` y permite cancelar (`⎋`).

## §17. Teclado y accesibilidad (principios XII, XIV)

| Tecla | Acción |
|---|---|
| `Espacio` | reproducir / pausa (ya existe) |
| `→` o `.` | paso adelante |
| `←` | paso atrás |
| `R` | reiniciar |
| `M` | ciclar modo (si hay ramas) |
| `⎋` | salir de simulación |

- Foco visible canónico: `outline: 1px solid crimson; offset: 2px`.
- **Peor pantalla (XIV):** la barra cabe en mobile (`position: static`, controles envuelven) y desktop (`fixed` bajo header). Contraste: `ink/paper` ~16:1; nunca confiar solo en color (el proceso activo se marca con halo *dashed* + crimson + el contador textual, no solo color).
- Respeta `prefers-reduced-motion`: sin token animado, el halo y el resaltado OPL bastan para seguir el paso.

## §18. Estados con microcopy literal (principio XV)

| Estado | Qué ve el usuario | Microcopy |
|---|---|---|
| **Listo** | barra cargada, paso 0 | `Listo para simular · reproducir ⌘P` |
| **Reproduciendo** | token + halo + OPL vivo | `Reproduciendo · paso 3 de 8` |
| **Pausado** | halo fijo en paso actual | `Pausado en el paso 3 · paso ▸ para continuar` |
| **Completado** | `✓` verde | `Simulación completada · 8 pasos · reiniciar para repetir` |
| **Sin procesos** | barra mínima | `Este modelo no tiene procesos que simular` |
| **Rama bloqueada** | marginalia | `Paso omitido: la precondición «X» no se cumple` |

## §19. Anti-patrones evitados (checklist jobs-web-ux)

| Anti-patrón | Cómo lo evitamos |
|---|---|
| **Magic Button** | `reproducir` muestra el primer proceso antes de actuar; nada es opaco. |
| **Generation Surprise** | la simulación es read-only; nunca muta el modelo. |
| **Loading Limbo** | exhaustivo/muestreo con progreso real y cancelación. |
| **False Confidence** | cada rama muestra modo + probabilidad + semilla. |
| **Settings Paralysis** | un selector de 3 modos, revelado solo si hay ramas. |
| **Chat Trap** | todo por teclado y palabras; cero dependencia de un chat. |
| **Copy Negligence** | microcopy específico (§18), nunca "algo salió mal". |

---

# PARTE III — EJECUCIÓN

## §20. Plan de fases (motor + UX entrelazados)

> Prerrequisito duro: **F0 (cimiento de hechos)** del plan hermano. La traza se proyecta a hechos.

| Fase | Motor | Experiencia | Gate |
|---|---|---|---|
| **S0 — Canonizar B0** | (sin cambio de motor) | migrar registro visual a Codex (§9): halo crimson dashed, retirar `#16a34a`/ámbar; BarraSimulacion a palabras + segmented (§10); scrubbing de marcos (§13) | `check` + `design:governance` + e2e/12 actualizado |
| **S1 — Generalizar a unfold** | `paso` generativo (no plan lineal); `F=Id` preserva determinismo | sin cambio visible (default brutal) | `check` + leyes |
| **S2 — Modos por functor** | enchufar `decision.ts` (`Powerset`) + `parametros.ts` (`Dist`) a `F` | selector de modo revelado (§11); marginalia de rama (§12); navegación de ramas (exhaustivo) | + e2e modos |
| **S3 — Tiempo híbrido** | duración real + excepciones por umbral | timer real, panel de vida útil | + e2e tiempo |
| **S4 — Composición in-zoom** | componer lentes de subprocesos | simular modelos refinados; navegación multi-OPD viva (ya existe) | + e2e |

Cada fase es TDD (ley/test primero). S0 es seguro y de alto valor percibido (hace la simulación *sentirse* canónica antes de tocar el motor). **Lecciones del repo:** apagar vite antes de `browser:smoke`; e2e con `PW_PORT` libre.

## §21. Líneas rojas (preservar intacto)

`ContextoSimulacion` (o adaptador), `focoPasoActualSimulacion`, `debeAnimarTokensSim`, `useZustandSimulationPort`, `intervaloAutoAvanceMs(v)=900/v`, `data-sim-activa` + `testid="opl-line"`, el token vía `linkView.sendToken`, y la regla de **canvas read-only durante simulación**.

## §22. Decisiones de canonización (divergencias B0 → Codex, con costo)

| Divergencia hoy | Canónico | Costo |
|---|---|---|
| Halo `SIM_VERDE #16a34a` | halo **crimson** dashed (§9) | editar `composers/halos.ts`; actualizar e2e que afirman `#16a34a`; cumple V-132 |
| Pin estado `#f59e0b` ámbar | anillo **crimson** sobre cápsula | editar `halos.ts`; sin color fuera de paleta |
| Slider continuo 0.25–4× | segmented `½× · 1× · 2× · 4×` | el motor sigue usando `v` (ahora discreto); más Codex |
| Iconos play/pause (si los hubiera) | **palabras** `reproducir · pausa` | ninguno (B0 ya usa texto) |

> Estas no son caprichos: el gate `design:governance` verifica V-63/V-132/V-203/V-209. La paleta de simulación canónica (verde-instancia + crimson-foco + movimiento) **pasa el gate**; `#16a34a`/ámbar no.

## §23. No-alcance (descartado con razón)

- **Sheaf temporal completo como motor** — overkill; el reloj discreto basta (sheaf = verificación, no ejecución).
- **Free monad / cofree comonad (plan/sustrato)** — sobre-ingeniería para un simulador conceptual; la inmutabilidad TS (modelo `readonly`, estado evoluciona) da la misma garantía. Se reconsidera solo si hay multi-agente.
- **Loop de runs de OPCloud** para la simulación conceptual — opforja ya tiene algo mejor (paso conceptual puro); el Monte Carlo de runs pertenece a valores (B1).
- **Tooltips flotantes, iconos vectoriales, colores fuera de paleta, animación decorativa** — contra Codex.

## §24. Gate y riesgos

**Gate por fase:** `cd app && bun run check` + (si toca UI) `bun run design:governance` + e2e (`02-canvas`, `03-opl`, `12-beta2-modo-simulacion`).

| Riesgo | Mitigación |
|---|---|
| Migrar color rompe e2e | S0 actualiza e2e/12 junto con el cambio; deuda de canonicidad acotada |
| `paso` generativo introduce regresión en determinismo | `F=Id` produce exactamente el plan lineal actual; property test de paridad |
| Exhaustivo explota | límite + progreso + cancelación (§16) |
| Romper la UX sólida de B0 | líneas rojas §21; S0 es aditivo sobre la experiencia existente |
| No-determinismo no reproducible | semilla explícita en `EstadoSistema`; Monte Carlo reproducible |

---

## Anexo — Trazas a código y tokens exactos

**Motor:** `modelo/simulacion/{runner,tipos,plan,valores,parametros,csv,foco,animacionTokens}.ts`, `modelo/decision.ts`, `modelo/abanicos.ts`, `tipos/estado.ts::DuracionTemporal`, `store/simulacion.ts`, `app/ports/zustandSimulationPort.ts`.
**Experiencia:** `ui/simulacion/BarraSimulacion.tsx`, `render/jointjs/JointCanvas.tsx` (token), `render/jointjs/composers/halos.ts` (halos), `ui/panelOpl/Bloques.tsx` (`data-sim-activa`).
**Tokens Codex (exactos):** `paper #fafaf8` · `ink #171511` · `inkSoft #807b6e` · `inkFaint #b5b0a4` · `rule #d3cec1` · `crimson #8e2a2e` · `opmGreen/bosque #27613f` · `opmBlue #1d3f78` · `opmOlive #68711f` · `stateFill #dedacb`. Tipografía: Inria Serif (cuerpo/OPL), Inria Sans (kickers), JetBrains Mono (ids/shortcuts/timer). Motion: `120–150ms ease`, solo color/opacidad. Sin radios ni sombras de elevación en chrome.

> Nota: confirmar nombres exactos de componentes UI contra `app/src/ui/` al iniciar cada fase; este anexo fija subsistemas y puntos de anclaje, no un diff.
