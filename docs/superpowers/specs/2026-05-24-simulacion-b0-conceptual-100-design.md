# Diseño — Simulación B0 conceptual al 100% (autocontenido)

**Fecha:** 2026-05-24
**Repo:** `deep-opm-pro`
**Corte:** Beta2 / EPICA-B0 (simulación conceptual)
**Estado:** diseño validado, pendiente plan de implementación.
**Autoridad superior:** `AGENTS.md`, `CLAUDE.md`, `docs/HANDOFF.md`, SSOT OPM
(`/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`), `docs/JOYAS.md`,
`opm-extracted/` (evidencia OpCloud), `docs/roadmap/cortes-operativos.md`.

## 1. Objetivo

Cerrar al 100% la épica B0 (simulación conceptual) **en su parte autocontenida**:
todo lo que se construye sobre el kernel de simulación actual sin abrir
EPICA-12. El resultado es un modo simulación que "se siente OpCloud": token
verde viajando por los enlaces, frase OPL del proceso activo resaltada, y
controles de barra completos (velocidad fina, headless, atajo de teclado).

## 2. Punto de partida (lo que ya existe y NO se rehace)

- **Kernel conceptual** (`app/src/modelo/simulacion/`): `plan.ts` (orden por
  `apariencia.y` ascendente), `runner.ts` (`iniciarSimulacion`, `ejecutarPaso`,
  `ejecutarCorrida`, `reiniciarSimulacion`), transiciones de estado (*Current*),
  `valores.ts` (valores runtime separados del modelo persistente), `trace` con
  diagnósticos de bloqueo. Modo Sync determinista. `PasoSimulacion` ya expone
  `enlacesEntradaIds` y `enlacesSalidaIds`.
- **Store** (slice `ln` en `store/tipos.ts`: `ln: ContextoSimulacion | null`):
  contexto inmutable; `readOnlyPrevSimulacion` ya gestiona el read-only al
  entrar/salir (B0.024 cubierto).
- **UI** (`app/src/ui/simulacion/BarraSimulacion.tsx` + `zustandSimulationPort`):
  Play auto-avance/Pausa, select de velocidad (0.5/1/2×), Paso, Correr,
  Reiniciar, Salir, contador `Paso N/M`, proceso activo (texto), trace compacto.
- **Canvas** (`render/jointjs/composers/halos.ts`, `proyeccion.ts`,
  `OpcionesSimulacionRender`): halo de proceso activo (cinabrio CANON-V2), halo
  de entidad involucrada, **disco dorado de estado *current*** (B0.018), enlaces
  involucrados resaltados estáticamente. `foco.ts` sincroniza el paso con el
  canvas.
- **Smoke** `app/e2e/12-beta2-modo-simulacion.spec.ts`: entrar/paso/correr/
  reiniciar/salir, OPD sin procesos, play automático.

## 3. Alcance

### 3.1 Entra (HU autocontenidas)

| HU | Entrega |
|---|---|
| B0.017 | Token verde animado **viajando** sobre cada enlace en uso del paso activo |
| B0.025 | Highlight de la frase OPL del proceso activo (panel OPL estático, solo resalta) |
| B0.028 | Atajo `Espacio` → Play/Pausa, con guard de contexto (solo en modo sim) |
| B0.011 / B0.012 | Slider de velocidad 0.25×–4× (reemplaza el select de 3 opciones), ajustable en caliente |
| B0.015 | Toggle "Headless runner" explícito: corrida sin animación, salto directo |
| B0.019 | Borde oliva del estado inicial preservado durante la simulación |
| B0.010 / B0.030 | Ocultar controles no aplicables durante ejecución + tooltips en cada control |
| B0.026 | Navegar OPDs manualmente durante la simulación sin abortar el contexto `ln` |

### 3.2 Sale (diferido con nota explícita)

- **B0.014 Async paralelo** (procesos misma-Y concurrentes): depende de
  HU-12.017 (subprocesos concurrentes), pendiente en EPICA-12.
- **B0.020–B0.022 Ciclo simular→OPL→reordenar-Y→re-simular**: depende de
  HU-12.016 (codificar orden temporal por Y del subproceso), pendiente.

Ambos se documentan como diferidos en `docs/HANDOFF.md` al cierre, con el
motivo (dependencia E12). No se abre E12 en este ciclo.

### 3.3 No-objetivos

- No tocar B1–B5 (computacional, funciones de usuario, rangos, control-flow,
  input runtime).
- No cambiar la semántica del kernel de simulación ni el orden de planificación.
- No clonar el `SimulationModule`/`Simulation` de OpCloud 1:1: se usa la
  semántica como referencia, con stack propio (Preact/JointJS OSS).

## 4. Arquitectura por capa

Respeta el flujo estricto `modelo → store → render`; la animación **no es verdad
de modelo** y vive solo en el adaptador render.

### 4.1 `modelo/simulacion/` (kernel puro, sin DOM)

- Exponer `enlacesEnUsoDelPaso(paso: PasoSimulacion): Id[]` derivado de
  `enlacesEntradaIds ∪ enlacesSalidaIds` (los campos ya existen). Función pura,
  testeable sin render. Es el contrato que el render consume para saber qué
  enlaces animar.
- Sin cambios en `runner.ts`/`plan.ts`.

### 4.2 `store` (slice `ln`)

- Añadir `headless: boolean` al contexto/preferencia de simulación (default
  `false`).
- Extender el rango de `velocidad` a 0.25–4× (hoy 0.5/1/2). El reducer
  `fijarVelocidad` valida y clampa al rango.
- `zustandSimulationPort` expone `headless`, `alternarHeadless`, y la velocidad
  extendida. El resto del puerto no cambia.

### 4.3 `render/jointjs`

- **Token viajero** (`composers/tokenSimulacion.ts` nuevo, o helper en
  `JointCanvas.tsx`): dado el paso activo + el `paper` vivo
  (`CanvasAdapterContext`), por cada enlace de `enlacesEnUsoDelPaso` dispara la
  API nativa OSS de token sobre el `linkView`
  (`paper.findViewByModel(link).sendToken(token, duration, callback)` — **firma
  exacta validada contra docs.jointjs.com en el plan**). `duration` se ata a
  `intervaloAutoAvanceMs(velocidad)` ya existente. Si `headless`, no anima.
  Token = círculo verde según **JOYAS §9** (autoridad del token de simulación).
  En el plan: verificar si `tokens.ts` ya tiene un verde de simulación
  reutilizable; si no, añadirlo como token semántico (no literal), respetando
  la regla de oro #2.
- **Borde oliva estado inicial** (B0.019): añadir en `halos.ts` un halo/borde
  para el estado designado *inicial* cuando hay simulación activa.
- Navegación OPD durante sim: el token/halos se proyectan solo si el OPD visible
  contiene el paso activo; cambiar de OPD no toca el contexto `ln`.

### 4.4 `ui/panelOpl`

- Highlight de la frase del proceso activo (B0.025): el panel lee
  `procesoActivoId` del contexto `ln` y marca la línea OPL correspondiente.
  Cero reemisión de OPL (semántica fija); solo estilo de resaltado. Reusar el
  mecanismo de resaltado existente del panel si lo hay.

### 4.5 `ui/simulacion/BarraSimulacion.tsx`

- Slider `<input type="range">` 0.25–4× (paso fino) en vez del `<select>` de 3
  opciones; ajustable durante ejecución (B0.012).
- Toggle "Headless" (checkbox/botón `aria-pressed`).
- `title`/tooltip en cada control (B0.030).
- Ocultar (o deshabilitar con razón) los controles no aplicables mientras
  `autoAvance` está activo (B0.010): p.ej. Paso/Correr/Reiniciar.

### 4.6 `app/ports/globalShortcutsPort.ts`

- Registrar `Espacio` → Play/Pausa con **guard de contexto**: solo actúa cuando
  hay simulación activa (`ln !== null`) y el foco no está en un input/textarea
  editable. No roba la barra espaciadora en modo edición.

## 5. Flujo de datos

```
ejecutarPaso (runner, puro)
  → store.ln actualizado (pasoActual, trace, estadosCurrent)
  → JointCanvas reacciona a ln:
       · halos.ts proyecta proceso activo + estado current + estado inicial
       · tokenSimulacion dispara sendToken sobre enlacesEnUsoDelPaso (si !headless)
  → panelOpl resalta la frase de ln.plan[pasoActual].procesoId
  → BarraSimulacion refleja contador/velocidad/headless
```

## 6. Estrategia de pruebas

- **Unit** (`modelo/simulacion/`): `enlacesEnUsoDelPaso` (incluye casos sin
  enlaces, con entrada+salida, deduplicación); clamp de velocidad al rango;
  toggle headless en el reducer.
- **Unit** (`app/ports`): guard del atajo Espacio (no dispara fuera de sim ni
  con foco en input).
- **Render** (`render/jointjs/proyeccion.test.ts` o nuevo): la proyección incluye
  el borde oliva del estado inicial cuando hay sim activa; el comando de token se
  emite para los enlaces en uso (jsdom no anima — se verifica intención, no
  píxeles).
- **Smoke** (`12-beta2-modo-simulacion.spec.ts`, extender): slider cambia
  velocidad; `Espacio` togglea Play; OPL resalta el proceso activo; headless
  salta al final sin animación; navegar OPD durante sim no rompe la corrida.

## 7. Riesgos y decisiones

- **`sendToken` requiere el `paper` vivo**: disponible vía
  `CanvasAdapterContext`. La sincronización token↔timing del paso se ata al
  mismo `intervaloAutoAvanceMs(velocidad)`; si el token dura más que el intervalo
  a velocidades altas, se trunca/encola (decisión: truncar — el siguiente paso
  manda).
- **jsdom no anima**: los tests verifican que el token se dispara, no su
  movimiento; la validación visual real es smoke + in-vivo.
- **Color del token**: verde de simulación según JOYAS §9; verificar token
  reutilizable en `tokens.ts` antes de añadir uno (regla de oro #2). Debe
  distinguirse del cinabrio de proceso activo (B0.029 ya resuelto por CANON-V2).
- **Atajo Espacio**: el guard es crítico para no degradar la edición; test
  unitario obligatorio.

## 8. Criterio de cierre

B0 autocontenido cierra cuando:

1. En modo simulación, al ejecutar un paso, un token verde viaja por cada enlace
   en uso (salvo headless).
2. La frase OPL del proceso activo se resalta sin reemitir el OPL.
3. `Espacio` togglea Play/Pausa solo en simulación; el slider ajusta 0.25–4× en
   caliente; el toggle headless omite la animación.
4. El estado inicial conserva su borde oliva durante la sim.
5. Cambiar de OPD durante la corrida no aborta el contexto.
6. `bun run check` y el smoke `12-beta2` extendido pasan verdes.
7. `docs/HANDOFF.md` registra B0.014 y B0.020–022 como diferidos por dependencia
   de EPICA-12.
