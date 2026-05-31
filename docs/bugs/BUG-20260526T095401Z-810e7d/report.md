# BUG-20260526T095401Z-810e7d

**Creado**: 2026-05-26T09:54:01.618Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: Fix en `c777119` y `de5876f`. Multiplicidades ahora se reflejan en oraciones de transición, efecto y ruta. Traducción canónica per spec §10.1: `+`/`1..*`/`1..N` → `al menos un/una X` (singular); `?`/`0..1` → `un/una X opcional`; `*`/`0..*` → plural sin prefijo. Se eliminaron los símbolos crudos en superficie que violaban `R-MULT-1`.

## Texto

opl no se ajusta a las multiplicidades

## Screenshots

- [screenshots/01-cleanshot-2026-05-26-at-05.53.45.jpg](screenshots/01-cleanshot-2026-05-26-at-05.53.45.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-76f4b1b5-b96e-493a-b1a9-d409facb9c21",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1032,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-05-26T09:53:59.806Z"
}
```
