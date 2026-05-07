# BUG-20260507T170832Z-2dae09

**Creado**: 2026-05-07T17:08:32.240Z

## Texto

no entiendo por que ese caso sale repetido y en otro espacio de clasificación (el que esta dentro del circulo rojo)

## Screenshots

- [screenshots/01-cleanshot-2026-05-07-at-13.07.54.jpg](screenshots/01-cleanshot-2026-05-07-at-13.07.54.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-movqoblb-95ndffld",
  "vistaMapaActiva": false,
  "url": "http://138.201.53.205:5173/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36",
  "viewport": {
    "width": 1920,
    "height": 963,
    "devicePixelRatio": 1
  },
  "capturedAt": "2026-05-07T17:07:23.074Z"
}
```

## Evaluacion

**Tipo**: bug UX / duplicacion de catalogo
**Severidad**: media, porque genera duda sobre si hay dos categorias distintas
para el mismo caso.
**Diagnostico**: `Ejemplo organizacional` estaba registrado dos veces en las
superficies de ejemplos. Primero aparecia como parte normal de `fixtureTodos()`
(`crearEjemploOrganizacional()`), y luego se agregaba manualmente como opcion
especial `__organizacional__` despues de un separador. Eso hacia parecer que el
mismo ejemplo pertenecia a otra clasificacion.

## Resolucion Aplicada

- Se elimino la opcion manual `__organizacional__` de `PantallaInicio`.
- Se elimino la opcion manual `__organizacional__` de `DialogoCargarModelo`.
- Se elimino la entrada duplicada del submenu `Ejemplos` en `MenuPrincipal`.
- `Ejemplo organizacional` queda una sola vez, como fixture canonico dentro de
  `fixtureTodos()`.
- El smoke `HU-30.021` ahora valida que el selector de ejemplos contiene
  exactamente una opcion `Ejemplo organizacional`.

## Decision

La accion legacy `cargarEjemploOrganizacional()` permanece en el store por
compatibilidad con codigo historico, pero ya no debe usarse para poblar entradas
UI paralelas mientras el mismo modelo viva en `fixtureTodos()`.
