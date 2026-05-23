# BUG-20260523T180247Z-e3f245

**Creado**: 2026-05-23T18:02:47.238Z

## Texto

es posible eso sintacticamente en términos opm?

## Screenshots

- [screenshots/01-google-chrome-2026-05-23-14.02.09.png](screenshots/01-google-chrome-2026-05-23-14.02.09.png)
- [screenshots/02-google-chrome-2026-05-23-14.02.15.png](screenshots/02-google-chrome-2026-05-23-14.02.15.png)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-415b5add-20eb-44a3-939f-63ebdc1cfd41",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2400,
    "height": 1161,
    "devicePixelRatio": 0.800000011920929
  },
  "capturedAt": "2026-05-23T18:02:44.035Z"
}
```

## Resolución 2026-05-23

**Pregunta**: ¿es posible eso sintácticamente en términos OPM?

**Respuesta**: las piezas son canónicas por separado (resultado a estado
específico TS2; abanico OR "al menos uno de"; modificador `c`), pero la
**combinación** `resultado + modificador c + abanico OR a estados` no está
canonizada en la SSOT-OPL §7. Las plantillas CT (Condición Transformadores)
y CS (Condición con Estado) cubren `consumo+c`, `efecto+c`, `agente+c`,
`instrumento+c` y sus variantes con estado, **pero ninguna entrada para
resultado+c**. La frase "puede generarse" que aparecía en la OPL era
invención del generador local para cubrir un caso que el modelador permitía
en la UI pero que OPM canónico no formaliza.

**Decisión**: restringir el UI. El select de modificador en
`InspectorEnlace` ya no ofrece `Condición` ni `Evento` cuando el enlace es
de tipo `resultado` (excepción de backward-compat: si un modelo legacy ya
lo tiene asignado, la opción se mantiene visible para que sea editable y
removible).

**Implementación**:
- `app/src/ui/inspectorEnlace/SeccionMultiplicidad.tsx`: helper
  `modificadorOfrecido(tipo, modificadorActual, candidato)` filtra los
  options `c`/`e` cuando `tipo === "resultado"`.
- Test de regresión en `SeccionMultiplicidad.test.ts` cubre los 4 casos
  (oculta nuevo c/e en resultado, preserva opción cargada, permite en
  input-side procedurales).
- Generador OPL y modelo de datos no se tocan (compat hacia atrás).

**Loop verde**: 1565 unit (+4) / 219 smoke / 1 skip / 0 fail.
