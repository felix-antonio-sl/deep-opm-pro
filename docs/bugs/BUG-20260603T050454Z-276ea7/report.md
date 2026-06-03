# BUG-20260603T050454Z-276ea7

**Creado**: 2026-06-03T05:04:54.090Z
**Tipo**: Bug
**Estado**: Resuelto
**Resolución**: El OPL de abanicos XOR/O de efecto con modificador evento Objeto -> Procesos ahora emite la forma OPCloud en español: `O inicia exactamente uno de P, Q y R, que afecta el proceso que ocurre.`

## Texto

sigue estando muy mal el opl de esto

## Cierre

- Causa raíz inicial: la plantilla de abanico de efecto reutilizaba la forma genérica `afecta exactamente uno de ...`, sin distinguir el modificador evento.
- Reapertura 2026-06-03: la corrección anterior seguía verbalizando `afecta a ...`; el patrón OPCloud observado es `O initiates exactly one of P, Q, and R, which affects the occurring process`.
- Cambio aplicado: cuando todas las ramas son `efecto` + `evento`, el puerto común es un objeto y las alternativas son procesos, el generador emite `inicia exactamente/al menos uno de ..., que afecta el proceso que ocurre`.
- Parser inverso: acepta esa forma OPCloud-es y crea enlaces `efecto` con modificador `evento`, agrupados en el abanico XOR/O sin invertir el sujeto objeto.
- Verificación: `bun test src/opl/generar.test.ts src/opl/parser/parser.test.ts -t "evento de efecto desde objeto"`, `bun test src/opl/generar.test.ts src/opl/parser/parser.test.ts src/opl/parser/parsear.test.ts`, `bun run check`, `bun run lint`, `bun run design:governance`, `bun run build`.

## Screenshots

- [screenshots/01-cleanshot-2026-06-03-at-01.04.21.jpg](screenshots/01-cleanshot-2026-06-03-at-01.04.21.jpg)

## Contexto

```json
{
  "modeloId": "modelo-1",
  "modeloNombre": "Modelo",
  "opdActivoId": "opd-1",
  "opdActivoNombre": "SD",
  "seleccionEntidadId": null,
  "seleccionEnlaceId": null,
  "pestanaActivaId": "pestana-527e3c27-e0f5-4e47-a2c2-d0342d283e15",
  "vistaMapaActiva": false,
  "url": "https://opforja.sanixai.com/",
  "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "viewport": {
    "width": 2133,
    "height": 1070,
    "devicePixelRatio": 0.8999999761581421
  },
  "capturedAt": "2026-06-03T05:04:51.828Z"
}
```
