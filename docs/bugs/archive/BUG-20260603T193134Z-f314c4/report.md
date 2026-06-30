# BUG-20260603T193134Z-f314c4

**Creado**: 2026-06-03T19:31:34.000Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: 2026-06-03 — `oracionEfecto` (`app/src/opl/generadores/procedural.ts`) emite la
transición para el efecto TS3 compacto: par completo `*Proceso* cambia **Objeto** de
\`entrada\` a \`salida\`.` y variantes parciales (`de \`entrada\`.` / `a \`salida\`.`), en ambas
direcciones del enlace. La dirección reverse YA existía (parser ETS2 + `aplicar.ts` reancla la
frase al metadato `estadoEntradaId`/`estadoSalidaId`); quedó sellada con test del par completo
en `src/opl/parser/ts45.test.ts`. Roundtrip: fixture `cambio-estado-ts3-compacto`
(no-estricta solo por la limitación preexistente del ciclo estado-objeto del aplicador, ver L5).
Tests: 4 nuevos en `procedural.test.ts` + control de no-regresión del `afecta` genérico.

## Texto

El generador OPL no verbaliza la transición de estados de un efecto TS3 compacto: todo enlace
`efecto` con metadato `estadoEntradaId`/`estadoSalidaId` (proceso → objeto entero) se emite con
la plantilla genérica T3 `*Proceso* afecta **Objeto**.`, descartando el par de estados. La
transición queda viviendo solo en el JSON; la bimodalidad OPD↔OPL se degrada en superficie para
todos los efectos TS3 del modelo.

## Evidencia (bundle HODOM v1.6, consumidor headless hd-opm)

- `e-6` del SD0-C porta `estadoEntradaId: requiere prestaciones de modalidad hospitalaria` →
  `estadoSalidaId: egresado de HODOM`, y el OPL emite `*Hospitalización en domicilio* afecta
  **Paciente**.` (línea 28 de `hd-opm/opl/hodom-completo-v1.6.opl`).
- Patrón global, no ligado a supresión de estados: `e-12`/`e-21` (SD1, con los TRES estados del
  Paciente expresados en la vista) también salen como `afecta`. Ídem `e-29`, `e-76`, `e-227` y
  todos los efectos TS3 del bundle (p. ej. `e-32`, `e-87`, `e-203` sobre el Plan).
- Cero usos del verbo `cambia` como plantilla de efecto en todo el OPL emitido (las únicas 2
  ocurrencias del grep son strings del campo `descripcion`).

## Causa raíz (localizada en código)

El generador SÍ tiene la plantilla de transición — `oracionTransicionEstados` con verbo
`cambia` en `app/src/opl/generadores/procedural.ts` (~L95-118) — pero solo la emite para el
patrón **escindido TS4/TS5**: par `consumo` (desde estado visible A) + `resultado` (hacia
estado visible B), que detecta vía `estadoDeExtremo`. Para el **efecto TS3 compacto** (un solo
enlace `efecto` entidad→entidad con metadato `estadoEntradaId`/`estadoSalidaId`,
`app/src/modelo/tipos/enlace.ts` L92-94) no existe rama de emisión que verbalice el par: el
enlace queda excluido del agrupado AND (`generar.ts:269`) y cae en la forma simple `afecta`.
Los abanicos sí verbalizan transición (`abanico.ts:230-232`), lo que confirma que el gap es
solo la vía del efecto TS3 individual.

## Comportamiento esperado

Emitir la plantilla TS canónica para efectos TS3 con par de estados:
`*Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`.`
(equivalente a la oración que ya produce la vía TS4/TS5 escindida), con parser inverso que la
reancle al metadato TS3. Con un solo extremo de estado (solo entrada o solo salida), emitir la
variante parcial correspondiente.

## Origen del hallazgo

Evaluación deliberativa del SD0-C en `hd-opm` (acta
`hd-opm/docs/memorias-aprendizajes/acta-2026-06-03-mesa-evaluacion-sd0c.md`, sección «Fe de
erratas y adiciones post-consenso»): una corrida paralela detectó la divergencia en e-6; la
verificación del moderador la amplió a todos los efectos TS3 y refutó la hipótesis inicial
(estados suprimidos). Registrado en hd-opm como «comportamiento 6» del emisor OPL v0.

## Screenshots

(sin capturas — reporte manual desde consumidor headless)

## Contexto

```json
{
  "modeloId": "hodom-completo",
  "modeloNombre": "HODOM completo v1.6",
  "opdActivoId": "opd-sd0-clinico",
  "opdActivoNombre": "SD0-C - Hospitalizacion en domicilio",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": "e-6",
  "url": "manual://hd-opm/scripts/generar-bundle-hodom.ts",
  "capturedAt": "2026-06-03T19:31:34.000Z"
}
```
