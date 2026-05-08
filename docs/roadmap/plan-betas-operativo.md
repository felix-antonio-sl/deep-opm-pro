# Plan operativo Beta1/Beta2 — anclas reales

**Origen**: ronda 16 L4 (catalogo simple + modelos ancla).
**Fecha decision**: 2026-05-08.

## Decision sobre origen del ancla L4

### Contexto

El brief de ronda 16 L4 §10 autoriza dos rutas para fijar el ancla pedagogica
del catalogo Beta1:

1. Importar / extraer un modelo OPM verificable desde alguno de los repos
   ancla candidatos: `~/projects/hd-dt`, `~/projects/hdos`, `~/projects/hdos-app`.
2. Construir un ancla sintetico desde conocimiento general y registrar la
   decision como deuda explicita.

### Hallazgo

Los tres repos candidatos NO contienen modelos OPM directamente importables:

- `~/projects/hd-dt` — corpus textual de roles, normativa y cartera
  prestacional; sin artefactos `*.opm.json` ni equivalentes serializados.
- `~/projects/hdos` — solo `db/`, `docs/`, `scripts/` y `eng.traineddata`
  (Tesseract); sin modelos OPM serializados.
- `~/projects/hdos-app` — Next.js app con `src/`, `tests/`, `db/migrations/`
  y `bugs/`; ningun archivo `.opm.json` ni snapshot de modelo OPM.

Search empleado: `find -maxdepth 4 -type f \( -name "*.opm.json" -o -name "*.opm" -o -iname "*opm-model*" -o -name "modelo*.json" \)` — sin resultados.

### Decision

Se construye un **ancla sintetico** desde conocimiento general como fixture
en `app/src/modelo/fixtures.ts`:

- **Ancla primario**: `crearPrestamoBibliotecario()` — dominio bibliotecario
  pedagogico no clinico. Multi-OPD (SD raiz + SD despliegue Biblioteca + SD
  in-zoom Procesar Prestamo). Estados de Libro (disponible / prestado /
  atrasado). Enlaces cubriendo agente, instrumento, consumo, resultado,
  efecto, agregacion (en SD1 despliegue) e invocacion (en SD2 descomposicion).
- **Ancla secundario liviano**: `crearComprarPan()` — SD plano sin
  descomposicion, util para validar que el catalogo simple acepta modelos
  triviales bajo la categoria `ancla-real`.

Ambos fixtures llevan `categoria: "ancla-real"`; las demos pre-existentes
(Cafetera, OnStar, SD Generico, etc.) se marcaron explicitamente como
`categoria: "demo-pedagogica"`.

### Reserva de scope

El **ancla "Beta1 dominio real" reservada al operador es HODOM-HSC**
(Hospital de San Carlos), que se ejecutara en **L5 / cierre semantico
dominio real** con el operador conduciendo. L4 NO modela HODOM-HSC; se
limita a fijar el catalogo y los anclas pedagogicos de superficie minima
para que L5 disponga del andamiaje sin haber agotado la decision de
dominio.

### Deuda registrada

| Item | Detalle | Lectura |
|---|---|---|
| Ancla primario sintetico, no extraido | hd-dt/hdos/hdos-app no exhiben modelos OPM | esperable hasta que un ancla real (HODOM-HSC en L5 o un modelado dirigido sobre hd-dt) genere un fixture exportable |
| Catalogo sin filtro UI por categoria | distincion solo en datos (`FixtureDemo.categoria`) | si Beta1 cierra sin filtro UI dedicado, se mantiene como afordancia post-Beta |

## Anclaje a HANDOFF

`docs/HANDOFF.md` § "Pendientes Y Supuestos Para Beta1/Beta2" §174
declara que Beta1 cierra cuando un dominio ancla real cumpla los 8
criterios. Los anclas L4 cubren los criterios estructurales (multi-OPD,
estados, enlaces avanzados) sobre el plano pedagogico; los criterios
metodologicos (validacion accionable, busqueda intra-modelo, edicion
desde TablaEnlaces) se ejercen sobre el mismo ancla en L1/L2/L3 y se
cierran finalmente en L5 con el dominio real.
