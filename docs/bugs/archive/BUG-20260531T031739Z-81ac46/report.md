# BUG-20260531T031739Z-81ac46

**Creado**: 2026-05-31T03:17:39.159Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Eliminado por completo el sistema de "hover tooltip" del canvas
(la barra inferior "Objeto OPM · {nombre} · {esencia} · {afiliación}"). Era la
variante `tipo: "hover-tooltip"` del overlay de feedback. Se borraron 4 archivos
dedicados (`hoverTooltipContent.ts`, `HoverTooltip.tsx`, `handlers/hoverTooltip.ts`
y sus tests) y se limpió la cascada: union `FeedbackOverlay`, puerto `FeedbackPort`
(`setHoverTooltip`/`clearHoverTooltip`/`idHoverTooltip`), slice `feedback.ts`,
`zustandFeedbackPort`, `OverlayLayer` (dispatch), `JointCanvas` (cableado del
handler) y los tests/probe que lo ejercitaban. Verificado sin vestigios (grep) y
sin regresión (1782 unit, e2e/11 7/7). Los sistemas hermanos (flash, inline-error,
hover OPL↔canvas) quedaron intactos. Desplegado en opforja.sanixai.com.

## Texto

elimina todo el sistema de hover inferior con info redundante que se ve en las capturas. y elimina cualquier vestigio del mismo. que no aparezca nunca más. hazte cargo de la cascada de efectos. tras ello commit + push y deploy

## Screenshots

- [screenshots/01-google-chrome-2026-05-30-23.16.27.png](screenshots/01-google-chrome-2026-05-30-23.16.27.png)
- [screenshots/02-google-chrome-2026-05-30-23.16.22.png](screenshots/02-google-chrome-2026-05-30-23.16.22.png)
- [screenshots/03-google-chrome-2026-05-30-23.16.17.png](screenshots/03-google-chrome-2026-05-30-23.16.17.png)

## Contexto

```json
{
  "modeloId": "modelo-hodom-completo-v1-3",
  "modeloNombre": "HODOM completo v1_3_2",
  "opdActivoId": "opd-sd0-clinico",
  "opdActivoNombre": "SD0-C - Hospitalizacion en domicilio",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-634a3097-2236-45ba-8964-0ad54fc6da24",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-31T03:17:36.879Z"
}
```
