# BUG-20260605T010727Z-916191

**Creado**: 2026-06-05T01:07:27.795Z
**Tipo**: Bug
**Estado**: Resuelto (fix local; pendiente deploy)
**Resolución**: Regresión de `90437ed` ("Fix OPM state path routing"). `finalizarDragDesdeAnchor` resolvía el destino del drag desde el `elementView` de `element:pointerup`, pero JointJS entrega ese evento SIEMPRE a la sourceView del gesto (la vista del pointerdown), nunca a la vista bajo el cursor. Consecuencias: (a) origen entidad → destino==origen → cancelación silenciosa: ningún enlace entidad→entidad por drag-desde-anchor se podía crear ("no se pueden realizar más enlaces de ningún tipo"); (b) origen estado → destino=entidad dueña → menú "Conectar O [s1] → O" con tipos objeto→objeto ("alternativas de enlace limitadas"). Fix: el destino se resuelve solo por punto (`extremoDestinoEnPunto`: `elementFromPoint` + `findElementViewsAtPoint`), que era el camino que el guard pre-90437ed protegía. Cobertura: 2 e2e nuevos en `e2e/24-conexion-anchor.spec.ts` (drag hover entidad→entidad; drag estado→proceso espera "Conectar O [s1] → P").

**Hallazgo secundario (NO corregido aquí)**: desde `285eba3` (26-may), con selección única los 8 resize handles se dibujan exactamente sobre los 8 connect-anchors y los tapan (orden de markup) → arrastrar desde un anchor de una entidad SELECCIONADA inicia resize, no conexión. Es lo que rompe el test 1 de `e2e/24-conexion-anchor.spec.ts` (selecciona antes del drag) y lo que enmascaró esta regresión. Requiere decisión de diseño (ui-forja): separar geometría handles/anchors.

## Texto

A continuación la secuencia que falla:
- intento hacer un enlace desde un estado a un proceso dando alternativas de enlace limitadas
- Tras ello no se pueden realizar más enlaces de ningún tipo

## Screenshots

- [screenshots/01-google-chrome-2026-06-04-21.04.59.png](screenshots/01-google-chrome-2026-06-04-21.04.59.png)
- [screenshots/02-google-chrome-2026-06-04-21.05.08.png](screenshots/02-google-chrome-2026-06-04-21.05.08.png)
- [screenshots/03-google-chrome-2026-06-04-21.05.12.png](screenshots/03-google-chrome-2026-06-04-21.05.12.png)
- [screenshots/04-google-chrome-2026-06-04-21.05.22.png](screenshots/04-google-chrome-2026-06-04-21.05.22.png)
- [screenshots/05-google-chrome-2026-06-04-21.05.50.png](screenshots/05-google-chrome-2026-06-04-21.05.50.png)
- [screenshots/06-google-chrome-2026-06-04-21.05.56.png](screenshots/06-google-chrome-2026-06-04-21.05.56.png)
- [screenshots/07-google-chrome-2026-06-04-21.06.11.png](screenshots/07-google-chrome-2026-06-04-21.06.11.png)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-0ab6db7a-ee0e-4095-bac3-9c02634d6c06",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-05T01:07:24.048Z"
}
```
