# Plan de implementación de opforja rehecho

**Estado al 2026-10-02:** empaquetado y listo para ejecutarse en una **sesión nueva**
(DECISIONS 28), en h289, sobre `~/projects/deep-opm-pro`. Esta sesión no implementa. La
ejecución empieza con el mensaje de [`PROMPT.md`](PROMPT.md).

Qué se construye: el diseño de [`../design/DESIGN.md`](../design/DESIGN.md). Es un modelador
OPM bimodal OPD/OPL que implementa lo que el canon exige a la herramienta, ni más ni menos, con un
servidor mínimo sobre archivos. El plan legible por máquina está en [`plan.json`](plan.json): olas,
dependencias, archivos propios, lecturas y aceptación de cada paquete.

## Autoridad

1. [`../canon/`](../canon/): los cuatro documentos. Mandan ante cualquier conflicto.
2. [`../DECISIONS.md`](../DECISIONS.md): decisiones fijas del dueño (1–28). No se reabren.
3. [`../understand/CANON.md`](../understand/CANON.md): requisitos T-NNN y decisiones DR-n
   derivados del canon.
4. [`../design/DESIGN.md`](../design/DESIGN.md): contratos, flujos y plan (§12). Un contrato
   solo cambia con una propuesta en `HANDOFF.md`, nunca en solitario.

Decisiones de la revisión ya aplicadas al diseño:

- D1 y D4 concuerdan en género (DS-26).
- La simulación sale (B-21).
- El contrato externo es JSON v0 + API con token (DESIGN §8).

## Mapa de rutas mientras dure la implementación

DESIGN usa las rutas del repositorio final. Hasta que WP-19 cierre, equivalen a estas:

| En DESIGN | Durante la implementación |
|---|---|
| `canon/` | WP-0 lo crea copiando byte a byte `docs/rehacer/canon/` |
| `docs/especificacion.md` | `docs/rehacer/understand/CANON.md` (WP-19 lo mueve) |
| `understand/…`, `SYNTHESIS.md`, dossiers | `docs/rehacer/understand/…` |
| `DECISIONS.md` | `docs/rehacer/DECISIONS.md` |
| `pre-rehacer:<ruta>` | código anterior, legible con `git show pre-rehacer:<ruta>` |
| sondas `probe_critico*` | no se versionaron; sus hallazgos están en `SYNTHESIS.md` §10 |

`docs/rehacer/` se conserva hasta WP-19 (DESIGN §11.4). Es la fuente del plan.

## Preparación (paso 0)

1. En h289, en `~/projects/deep-opm-pro`: `git status` sin cambios versionados pendientes (si los
   hay, detenerse y avisar; no se descartan), `git switch main` y `git pull --ff-only origin main`.
2. Crear la rama `rehacer` desde `main` y el tag `pre-rehacer` sobre esa base, y hacer push de
   ambos. Todo el trabajo va en `rehacer`.
3. Entorno: Bun 1.3.x y Chromium de Playwright (si no existe `/opt/pw-browsers`, el de la
   máquina). El corpus KORA no hace falta, porque el canon está versionado.
4. Línea base del código anterior, solo como referencia: `cd app && bun install && bun run check`.
   Hoy fallan 14 pruebas de anclaje y composición que dependen de un backend; no bloquean nada.

## Olas e hitos

| Ola | Paquetes | Cómo corren |
|---|---|---|
| 0 | WP-0 → WP-1 | en serie |
| 1 | WP-2, WP-4p, WP-6, WP-8a, WP-11, WP-18 | en paralelo; WP-6 se integra tras WP-4p y WP-11 tras WP-6; WP-18 solo redacta |
| 2 | WP-3a, WP-3b, WP-5, WP-7, WP-8b | en paralelo; los gates de WP-8b se integran tras WP-5 |
| 3 | WP-4r → WP-9; WP-13 | WP-13 corre cuando cierran sus dependencias; WP-17 se redacta |
| 4 | WP-10, WP-12 y el tren de UI (WP-14, WP-15, WP-16) | el tren se integra junto; se verifica la imagen de WP-18 |
| 5 | WP-17 → WP-19 | e2e completos, documentación final y PR `rehacer` → `main` |

Hitos de revisión con el dueño:

- **H1, tras la ola 1.** Contratos, matriz, proyección, códec, geometría y servidor en verde. Los 6
  fixtures v0 importan bien. B-28 declara la equivalencia con distribución refinada pendiente de
  WP-4r/H2; H1 no acredita esa integración mediante stubs.
- **H2, tras la ola 3.** Núcleo, diagnóstico, OPL de ida y vuelta, y editor. El roundtrip estricto
  por enumeración de la matriz da verde, y la equivalencia menú/creación por resultado efectivo de
  distribución refinada real tiene sus propiedades verdes (WP-4r, integración N de B-28).
- **H3, tras la ola 5.** UI completa y 26 e2e en verde. Hay PR abierto y nada desplegado.

## Protocolo por paquete

1. Leer **solo** las `lecturas` del paquete en `plan.json`, más esta página. Las secciones de
   DESIGN se ubican por su encabezado (`grep -n '^#' docs/rehacer/design/DESIGN.md`).
2. Escribir primero las pruebas. Cada prueba de requisito se titula con su T-ID
   (`test('T-043 …')`), así `bun test -t T-043` la encuentra.
3. Tocar solo los `archivos` del paquete. Los archivos compartidos declarados se tocan en
   serie (DESIGN §12.1):
   - `nucleo/enlaces.ts`;
   - `nucleo/cosas.ts`;
   - `opl/documento.ts`.
   - `nucleo/matriz.ts`: WP-2 produce consulta y normalización; WP-4r agrega el ensayo compartido
     de distribución.
   - `nucleo/propiedades.test.ts`: WP-3b prueba creación sin refinamientos; WP-4r amplía la
     integración refinada sin retirar la cobertura anterior.
4. Ninguna regla OPM vive fuera de `nucleo/matriz.ts` o `nucleo/diagnostico.ts`. Ninguna oración
   OPL vive fuera de `opl/plantillas.ts`. Toda mutación es una `Operacion` registrada.
5. Cerrar con `cd app && bun run check` en verde, más las verificaciones de `aceptacion`. Ninguna
   prueba se debilita, se salta ni se pone en cuarentena para pasar.
6. Hacer **un commit semántico por paquete**, en español, por ejemplo
   `feat(nucleo): matriz de validez única (WP-2)`, con los T-ID que cierra. Lo acompaña cualquier
   fila nueva B-nn del registro de conformidad.
7. Actualizar el tablero de `HANDOFF.md` y hacer push a `origin/rehacer`.

## Ejecución

Un solo agente escribe, un paquete a la vez, en este orden lineal, que respeta todas las
dependencias de `plan.json`:

`WP-0 → WP-1 → WP-2 → WP-4p → WP-6 → WP-8a → WP-11 → WP-18 → WP-3a → WP-3b → WP-5 → WP-7 →
WP-8b → WP-4r → WP-9 → WP-13 → WP-10 → WP-12 → WP-14 → WP-15 → WP-16 → WP-17 → WP-19`

- WP-18 se redacta en su turno; la verificación de su imagen se hace después de WP-14.
- WP-14, WP-15 y WP-16 se cierran con `bun run check` y `bun run build`; sus e2e los ejecuta WP-17.
- La opción A de la frontera menú/creación, resuelta por coordinación delegada en HANDOFF,
  conserva este orden: WP-2 prueba etiquetas pendientes/completas y reglas nativas; WP-3b ejecuta
  propiedades reales sin refinamientos; WP-4r implementa la distribución pura única consumida por
  consulta, creación y reparación y completa las propiedades refinadas. B-28 permanece explícita
  en conformidad/HANDOFF hasta esa aceptación. DS-20 usa siempre el original anterior a insertar
  frente al resultado efectivo final; nunca un borrador intermedio como modelo previo.
- Entre paquetes no se pregunta si seguir. Una ambigüedad que el canon y DESIGN dejan abierta se
  resuelve con la opción más simple que los respete y se anota en `HANDOFF.md`.
- Al cerrar cada ola, el agente relee el diff de la ola contra el canon y DESIGN (firma, OPL
  literal, roundtrip y brechas sin registro) y corrige antes de seguir.
- Un golden SVG nuevo o cambiado no se acepta sin abrir el SVG y mirarlo.
- Mientras WP-0 no reescriba `AGENTS.md`, si el vigente contradice este plan (por ejemplo, al pedir
  usar el corpus KORA instalado), manda el plan: el canon son los cuatro documentos de
  `docs/rehacer/canon/`.

## Continuidad

Cada paquete cerrado queda con commit y push. `HANDOFF.md` es el tablero único: estado de cada
paquete con su commit, decisiones tomadas sin el dueño y resultados de cada hito. Si la sesión se
interrumpe, la siguiente lee el tablero, verifica `bun run check` en `origin/rehacer` y sigue con
el primer paquete pendiente.

## Prohibido en la sesión de implementación

- Desplegar, tocar producción o ejecutar la migración real desde PostgreSQL. El procedimiento
  queda escrito (DESIGN §9.4) y requiere autorización explícita, solo mediante `./deploy/deploy.sh`.
- Hacer merge a `main` sin aprobación del dueño. WP-19 solo abre el PR.
- Agregar capacidades fuera de alcance (DESIGN §1.3) o reabrir decisiones fijas.
- Dejar una brecha sin registro: todo DEBE no cumplido va a `docs/conformidad.md` en el mismo
  commit.

## Costo y duración

Estudio, canon y diseño consumieron unos 15 M tokens de subagentes y chocaron dos veces con el
límite de sesión. La implementación costará eso o más y ocupará varias ventanas de límite. Los
hitos H1–H3 son los puntos naturales para pausar.

## Después del plan

- Revisión humana de tres modelos grandes migrados (DESIGN §13.6) y aprobación del PR.
- Despliegue autorizado según DESIGN §9.4.
- Fuera de este repositorio (DECISIONS 27): actualizar las referencias de la skill
  `modelamiento-opm` en KORA al contrato JSON v0 + API con token.
