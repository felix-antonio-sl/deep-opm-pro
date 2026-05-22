# BUG-20260507T173915Z-617932

**Creado**: 2026-05-07T17:39:15.334Z

## Texto

mira que feos se ven eso iconos

## Screenshots

- [screenshots/01-cleanshot-2026-05-07-at-13.38.56.jpg](screenshots/01-cleanshot-2026-05-07-at-13.38.56.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Cafetera Domestica",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": "o-3",
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-movrrvik-dxs4294k",
  "vistaMapaActiva": false,
  "url": "http://138.201.53.205:5173/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1920,
    "height": 963,
    "devicePixelRatio": 1
  },
  "capturedAt": "2026-05-07T17:39:00.919Z"
}
```

## Evaluación

**Estado:** resuelto por commit `4e55eb3`.

La captura corresponde a la primera versión de la `BarraHerramientasElemento`,
donde los iconos canónicos `addStates.svg`/`inzoom.svg`/`editAlias.svg` se
mostraban comprimidos dentro de botones de 34 px. El resultado visual era una
mezcla pesada de círculos azules OPCloud + texto compacto (`Copiar`, `Pegar`,
`Img`, `...`) en una barra muy densa.

El commit `4e55eb3 ui(barra-elemento): aplana iconos addStates/inzoom/editAlias
a SVG inline` reemplazó esos tres SVG circulares por iconos lineales inline de
16 px. Esto conserva la acción y reduce el peso visual dentro del halo flotante.

**Pendiente no bloqueante:** si vuelve a percibirse ruido visual, el siguiente
ajuste debe unificar también `Copiar`, `Pegar`, `Img` y `...` como iconos
lineales, pero ya no es el bug capturado en esta imagen.
