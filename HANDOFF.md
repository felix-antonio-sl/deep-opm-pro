# OpForja rehecho — tablero único

Estado: WP-0 cerrado tras aceptación y revisión; próximo paquete WP-1. El resto está pendiente.
Rama `rehacer`; base y tag `pre-rehacer`: `513ac041`. La directora creó/publicó rama y tag.
WP-0 se fija en el commit que incorpora este tablero; se identifica con `git log -1 --format=%H --grep="(WP-0)"`. El siguiente paquete anotará su SHA literal. La directora publica un commit por paquete.

## Autoridad y continuidad

La autoridad OPM es el canon vendorizado de `canon/`. Decisiones fijas: 1–28 de
`docs/rehacer/DECISIONS.md`. Contratos: `docs/rehacer/design/DESIGN.md`.
El [mapa temporal del plan](docs/rehacer/plan/README.md) resuelve las referencias a documentos
finales hasta WP-19; `docs/rehacer/` permanece íntegro. Continuar únicamente con WP-1 después
del cierre revisado/publicado de WP-0. No iniciar paquetes posteriores por el verde del andamiaje.

## Tablero lineal

| Orden | Paquete | Estado | Commit |
|---:|---|---|---|
| 0 | WP-0 | Cerrado: aceptación y revisión verdes | Este commit, `feat(rehacer): retirar legado y preparar andamiaje (WP-0)` |
| 1 | WP-1 | Pendiente | — |
| 2 | WP-2 | Pendiente | — |
| 3 | WP-4p | Pendiente | — |
| 4 | WP-6 | Pendiente | — |
| 5 | WP-8a | Pendiente | — |
| 6 | WP-11 | Pendiente | — |
| 7 | WP-18 | Pendiente | — |
| 8 | WP-3a | Pendiente | — |
| 9 | WP-3b | Pendiente | — |
| 10 | WP-5 | Pendiente | — |
| 11 | WP-7 | Pendiente | — |
| 12 | WP-8b | Pendiente | — |
| 13 | WP-4r | Pendiente | — |
| 14 | WP-9 | Pendiente | — |
| 15 | WP-13 | Pendiente | — |
| 16 | WP-10 | Pendiente | — |
| 17 | WP-12 | Pendiente | — |
| 18 | WP-14 | Pendiente | — |
| 19 | WP-15 | Pendiente | — |
| 20 | WP-16 | Pendiente | — |
| 21 | WP-17 | Pendiente | — |
| 22 | WP-19 | Pendiente | — |

H1 (tras ola 1), H2 (tras ola 3) y H3 (tras ola 5): pendientes. Ningún hito alcanzado.
WP-18 verifica su imagen después de WP-14; WP-17 ejecuta los e2e completos.

## WP-0: realización y evidencia

- Antes de la implementación se escribieron cuatro pruebas de arquitectura/andamiaje. RED observado:
  `PATH=/tmp/opforja-rehacer-tools:$PATH bun test src/arquitectura.test.ts` desde `app/`:
  2 pass / 2 fail; fallaron la arquitectura antigua y sus dependencias directas retiradas.
- Se movieron primero seis `fixtures/demo-models/*.json` con `git mv` a `app/fixtures/v0/`,
  conservando los bytes. Después se retiraron 2402 rutas exclusivamente versionadas de §11.4.
  No se borraron directorios completos ni archivos ignorados. El historial queda en `pre-rehacer`.
- Canon: cuatro carpetas, ocho archivos `content.md`/`object.yaml`, copiados byte a byte;
  `canon/LEEME.md` registra versiones, SHA256, precedencia y actualización. Hashes verificados
  contra las fuentes. Los 48 archivos de `docs/rehacer/` se preservan; diff contra tag vacío.
- `AGENTS.md` transcribe exactamente el bloque de DESIGN §11.2 (sin su sangría Markdown).
- Configuración mínima con dos dependencias runtime y cinco de desarrollo de §2.2, versiones
  exactas de las ya instaladas en la base; lockfile regenerado. `bun install`: 45 paquetes
  transitivos instalados. No hay dependencias directas de JointJS/Zustand/AI/ESLint/fuentes retiradas.
- GREEN final: `PATH=/tmp/opforja-rehacer-tools:$PATH bun run check` desde `app/`: TypeScript
  estricto (src, servidor, e2e, herramientas y configs) + 8 pass / 0 fail, 45 expect.
  Los controles en memoria rechazan nucleo→ui, opl↔opd, servidor→nucleo directo/UI,
  código de producto→pruebas y dev→dominio. Admiten las aristas legales y el migrador explícito.
- Línea base antigua aportada por la directora: 3682 pass / 2 skip preexistentes / 0 fail.
  Es solo referencia histórica; las suites retiradas estaban expresamente autorizadas por §11.4.

## Corrección de revisión WP-0 — ronda 1

La revisión detectó que producto→archivo `*.test.ts` dentro de una capa legal seguía
permitido. Se añadieron primero cuatro casos negativos (UI/núcleo, con `.test.ts`
y `.test` sin extensión); el focal dio RED: 4 pass / 4 fail, 45 expect, código 1.
Se corrigió el guard para rechazar destinos de prueba además de `src/pruebas/`.
Se mantienen permisos desde archivos de prueba y helpers de `src/pruebas/`, con
controles positivos explícitos. Focal GREEN y `bun run check`: 8 pass / 0 fail,
45 expect, código 0. Comandos desde `app/`, siempre con el wrapper autorizado:
`PATH=/tmp/opforja-rehacer-tools:$PATH bun test src/arquitectura.test.ts` y
`PATH=/tmp/opforja-rehacer-tools:$PATH bun run check`.
Solo cambió el test/guard de arquitectura y esta evidencia; sin stage, commit ni push
adicional. No cambió el contrato ni se trabajó otro paquete.

## Supuestos menores y delimitación

- La aceptación «git ls-files no lista ninguna ruta de §11.4» se interpreta como ausencia del
  inventario antiguo retirado, con sustituciones nuevas autorizadas `src/arquitectura.test.ts`
  y `HANDOFF.md`, más las excepciones finales/docs/rehacer del propio §11.4. No exige ausencia
  absoluta de `app/src/` ni de las rutas enumeradas como reescrituras. El inventario de retirada
  se contrastó con el tag; los nuevos archivos no son supervivencia del código antiguo.
- Ownership aclarado por la directora: `.gitignore` raíz corresponde al andamiaje WP-0; conserva
  cada patrón previo para proteger los artefactos locales y añade datos de desarrollo/variantes
  `.env`. `app/.gitignore` conserva `_eval-output/`. `deploy/.gitignore`, si existe localmente,
  se conserva. Dockerfile/Compose/.dockerignore/deploy.sh se reescriben en WP-18;
  README/NOTICE/docs/README en WP-19. Los archivos antiguos de esas reescrituras siguen
  temporalmente en el árbol y no describen todavía el producto nuevo.
- WP-0 no crea main/UI, servidor, contratos ni stubs futuros. El HTML es una página estática
  explícita. Dev/build/e2e/golden tienen destinos finales preparados y necesitan paquetes
  posteriores; no se afirma arranque o empaquetado. Playwright apunta al artefacto compilado
  `dist/servidor/principal.js`. `OPFORJA_E2E_DATOS` permite que WP-17 suministre/limpie una ruta;
  sin ella, la config crea un temporal, lo exporta a los workers y limpia al salir solo el propio.
  Vite no carga archivos `.env` (`envDir:false`).
- El detector usa regex para imports literales (incluye import type/multilínea, export-from,
  require e import dinámico literal) y resuelve rutas relativas/absolutas. TypeScript no
  configura aliases (`paths`/`baseUrl`). No sustituye un parser AST ni analiza rutas computadas
  dinámicamente; esas formas no se necesitan en el andamiaje. No escribe archivos.

## Pendiente editorial WP-19

DESIGN §11.1 todavía dice «24 respuestas» y «DS-1…DS-25». La autoridad fija incluye
DECISIONS 25–28 y DS-26 (género D1/D4), que deben conservarse al redactar `docs/decisiones.md`.
Propuesta precisa para WP-19: actualizar ese inventario editorial a decisiones 1–28 y DS-1…DS-26.
No cambia una decisión ni un contrato técnico; no se modificó DESIGN. No hay propuesta técnica abierta.

## Límites de la evidencia

El verde acredita retirada/andamiaje y los controles de arquitectura. Todavía no acredita
semántica OPM, OPD↔OPL, códec, render, servidor funcional, aceptación humana ni despliegue.
No se ejecutaron producción, contenedores, migración real, merge ni push a main.
El ejecutor no cambió ramas/tags ni hizo commit/push. No se leyeron credenciales ni `.env`.

## Revisión de cierre WP-0

La revisión independiente confirmó todas las aceptaciones y encontró un import de producto a
archivos de prueba que el guard permitía. Se corrigió con RED 4 pass / 4 fail y GREEN
8 pass / 0 fail, 45 aserciones, incluido check estricto. La revisión focal verificó la
corrección, con y sin extensión, y no encontró roturas nuevas. Canon, fixtures, 48 documentos
y AGENTS se verificaron también de forma independiente. H1–H3 siguen pendientes.
