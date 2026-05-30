# BUG-20260530T214922Z-fb6c2c

**Creado**: 2026-05-30T21:49:22.014Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: La sección "Extremos" del inspector de enlaces (selectores de
extremo + "Reanclar extremo"/"Mover ancla exacta" → DialogoMoverPuerto) se
ocultaba para todo enlace no-procedural (`SeccionExtremos.tsx` retornaba `null`),
dejando a los enlaces estructurales fundamentales sin ninguna vía para reasignar
su cosa origen/destino — aunque el kernel (`apuntarExtremoEnlace` +
`validarFirmaEnlace`) ya lo admitía. Se extrajo el predicado `seccionExtremosVisible`
y se habilitó la sección para estructurales fundamentales (agregación, exhibición,
generalización, clasificación), manteniendo el bloque de fan/abanico solo para
procedurales y los selectores de estado bloqueados (los estructurales rechazan
extremos Estado [V-237]). Desplegado en opforja.sanixai.com (bundle `index-bc_ZqQoE.js`).

## Texto

los enlances estructurales no puedo anclarlos adecuadamente a la cosa origen y target

## Screenshots

- [screenshots/01-google-chrome-2026-05-30-17.48.14.png](screenshots/01-google-chrome-2026-05-30-17.48.14.png)
- [screenshots/02-google-chrome-2026-05-30-17.48.27.png](screenshots/02-google-chrome-2026-05-30-17.48.27.png)

## Contexto

```json
{
  "modeloId": "modelo-hodom-completo-v1-3",
  "modeloNombre": "HODOM_completo v1_3",
  "opdActivoId": "opd-sd0-clinico",
  "opdActivoNombre": "SD0-C - Hospitalizacion en domicilio",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": "e-1",
  "pestanaActivaId": "pestana-5aef0c99-d823-4e91-ab45-794e991efe03",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-30T21:49:18.068Z"
}
```
