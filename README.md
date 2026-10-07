# OpForja

Modelador web de OPM/ISO 19450: un mismo modelo persistente se expresa como diagrama
OPD y lenguaje OPL. Permite crear, refinar, revisar, importar y exportar ese modelo
con identidad estable, operaciones atómicas y guardado en archivos JSON.

URL documentada: [opforja.sanixai.com](https://opforja.sanixai.com).
Esta referencia no acredita disponibilidad ni despliegue de la rama rehecha.

## Ejecutar en local

Desde la raíz, con Bun instalado:

```sh
cd app
bun install
bun servidor/cuenta.ts crear operador@example.invalid --datos .datos-dev
bun run dev
```

La cuenta se crea con dos entradas de clave por stdin. El servidor local y Vite
usan `.datos-dev`. No hay PostgreSQL en el servidor nuevo. Estos comandos son
instrucciones: este cierre no instala dependencias ni crea una cuenta real.

## Verificar

Desde `app/`:

```sh
bun run check
bun run e2e
bun run build
```

`check` incluye TypeScript y pruebas de núcleo, códec, OPL, OPD, editor, servidor
y herramientas. `e2e` compila y recorre 26 escenarios contra su servidor propio,
con datos y cuenta sintéticos, sin reutilizar un servidor existente. Puede fijarse
`OPFORJA_E2E_PUERTO=18877`; el default es 8787. El valor debe ser decimal 1..65535.

Chromium usa `PW_CHROMIUM=/ruta/al/chrome` explícito o el registro instalado de
Playwright (`PLAYWRIGHT_BROWSERS_PATH` si corresponde). No se descarga navegador
al ejecutar las pruebas. El fixture exige 0 errores de página y 0 solicitudes externas.

Para cambiar render: `bun run golden` y observar cada SVG cambiado. Una captura
no sustituye el export canónico. Los artefactos de build no se versionan.

## Mapa

| Ruta | Responsabilidad |
|---|---|
| `app/src/nucleo/` | modelo, operaciones puras, matriz y diagnósticos |
| `app/src/codec/` | importar/exportar JSON v0 y reconocer punto fijo |
| `app/src/opl/` | tabla única de plantillas, generar, analizar y aplicar planes |
| `app/src/opd/` | escena, dibujo SVG y exports canónicos |
| `app/src/editor/`, `app/src/ui/` | controlador, gestos, guardado e interfaz |
| `app/servidor/`, `app/herramientas/` | cuenta, API, archivos y migrador |
| `app/e2e/`, `app/fixtures/` | escenarios y documentos de prueba |
| `canon/`, `docs/` | autoridad vendorizada y documentación vigente |
| `deploy/` | circuito operativo sujeto a autorización |

## Contrato y límites

La integración externa usa [JSON v0 y API HTTP con token Bearer](docs/formato-v0.md).
No hay CLI mesa ni protocolo paralelo. Consulte la [guía](docs/guia.md),
[decisiones](docs/decisiones.md), [operación](docs/operacion.md) y
[registro de conformidad](docs/conformidad.md).

Una suite verde no equivale a validación humana del modelado ni a conformidad ISO
global. El registro conserva 180 requisitos ★, 32 brechas y 10 bisimetrías parciales;
no hay simulación. El layout importado puede conservar cruces u oclusiones B-15.
La migración se verificó con fuentes falsas; no se ejecutó PostgreSQL real.
WP-18/imagen Docker requiere autorización aparte y queda fuera del corte H3.

La historia del rehecho permanece en Git; no representa funciones actuales.
El cierre exige check/build/e2e reales y revisión contra el canon y modelos reales.
La lista del Anexo A de AGENTS rige cada cambio de modelado, parser o export.
Para reportar un defecto, incluya versión, gesto y regla, sin contenido privado
ni credenciales. [AGENTS.md](AGENTS.md) fija el contrato de colaboración.
