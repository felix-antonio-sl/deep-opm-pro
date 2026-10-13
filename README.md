# OpForja

Modelador web de OPM/ISO 19450: un mismo modelo persistente se expresa como diagrama
OPD y lenguaje OPL. Permite crear, refinar, revisar, importar y exportar ese modelo
con identidad estable, operaciones atómicas y guardado en archivos JSON.
En servicio en [opforja.sanixai.com](https://opforja.sanixai.com).

## Ejecutar en local

Desde la raíz, con Bun instalado:

```sh
cd app
bun install
bun servidor/cuenta.ts crear operador@example.invalid --datos .datos-dev
bun run dev
```

La cuenta se crea con dos entradas de clave por stdin. El servidor local y Vite
usan `.datos-dev`.

## Verificar

Desde `app/`:

```sh
bun run check
bun run golden
bun run e2e
```

`check` incluye TypeScript y las pruebas de núcleo, códec, OPL, OPD, editor, servidor
y herramientas. `golden` compara el render con las expectativas sin reescribirlas;
`golden:update` las regenera sólo ante un cambio de render autorizado, revisando cada
SVG cambiado. `e2e` compila y recorre los escenarios de `e2e/` contra un servidor
propio con datos sintéticos (`OPFORJA_E2E_PUERTO`, default 8787). Chromium sale de
`PW_CHROMIUM` o del registro instalado de Playwright; no se descarga al probar.

## Mapa

| Ruta | Responsabilidad |
|---|---|
| `app/src/nucleo/` | modelo, operaciones puras, matriz y diagnósticos |
| `app/src/codec/` | importar/exportar JSON v0 y punto fijo |
| `app/src/opl/` | tabla única de plantillas, generar, analizar y aplicar planes |
| `app/src/opd/` | escena, dibujo SVG y exports canónicos |
| `app/src/editor/`, `app/src/ui/` | controlador, gestos, guardado e interfaz |
| `app/servidor/` | cuenta, API y almacenamiento en archivos |
| `app/herramientas/` | servidor de desarrollo y medición de la fuente |
| `app/e2e/`, `app/fixtures/` | escenarios y documentos de prueba |
| `canon/`, `perfil/` | autoridad OPM (sólo ISO 19450) y reglas propias de OpForja |
| `docs/` | especificación, conformidad, decisiones y documentos de uso |
| `deploy/` | despliegue y respaldo, sujetos a autorización |

## Documentación

La integración externa usa [JSON v0 y API HTTP con token Bearer](docs/formato-v0.md).
Consulte la [guía](docs/guia.md), la [operación](docs/operacion.md), el
[registro de conformidad](docs/conformidad.md) y las [decisiones](docs/decisiones.md).
[AGENTS.md](AGENTS.md) fija el contrato de colaboración y la lista de cierre de cada cambio.

Una suite verde no equivale a validación humana del modelado ni a conformidad ISO
global: lo no cumplido está declarado en el registro de conformidad. Para reportar un
defecto, incluya versión, gesto y regla, sin contenido privado ni credenciales.
