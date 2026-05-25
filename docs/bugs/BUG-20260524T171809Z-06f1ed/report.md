# BUG-20260524T171809Z-06f1ed

**Creado**: 2026-05-24T17:18:09.655Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Reescrita la geometría del self-loop en `app/src/render/jointjs/autoinvocacionLoop.ts` siguiendo el canon OpCloud (`SelfInvocationLink.calc` + `OpmProcess.getSelfInvocationMainVertices`): las dos ramas (salida/retorno) anclan en la INTERSECCIÓN de la elipse del proceso a ±35° de la dirección centro→pico, con el pico colgando recto bajo el centro a `dist ≈ height*0.55`. Esto elimina el "quiebre a distal anómalo": antes salida/retorno se colocaban a `±amplitud*0.45` horizontal mientras los quiebres se abrían a `±amplitud` (más anchos que los anclajes), produciendo un lazo que se ensanchaba hacia distal en vez de converger limpio al pico. El marcador conserva el rombo canónico de invocación (`LINK_ASSETS.procedural.invocacion.marker`, canon CANON-V2/L4) en el extremo de retorno. 1685 unit verdes; e2e 02/07 verdes.

## Texto

la marca del autoinvocación no es canónico y tiene un quibre a distal anómalo

## Screenshots

- [screenshots/01-google-chrome-2026-05-24-13.16.38.png](screenshots/01-google-chrome-2026-05-24-13.16.38.png)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-77290379-a609-45a4-8871-b49c8a09862f",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-24T17:18:05.680Z"
}
```
