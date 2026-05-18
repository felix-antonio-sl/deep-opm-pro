# deep-opm-pro

Workspace de desarrollo del modelador OPM nuevo en `app/`, construido desde la
SSOT OPM/ISO 19450 y evidencia observacional de OPCloud. El repositorio ya no
debe leerse como una app heredada ni como un fork de OPCloud: los materiales
extraidos informan decisiones de producto, semantica visual, OPL y fixtures,
mientras que el codigo de aplicacion vive separado y con arquitectura propia.

## Estado Actual

- App principal: `app/` con Bun + Vite + Preact + Zustand + JointJS OSS.
- Kernel de dominio: `app/src/modelo/`, independiente del renderer.
- Renderer: `app/src/render/jointjs/` como adaptador, no como fuente de verdad.
- Backlog vivo: `docs/historias-usuario-v2/`.
- Roadmap operativo: `docs/roadmap/`.
- Memoria unica de traspaso: `docs/HANDOFF.md`.
- Evidencia curada preferente: `opm-extracted/`.

## Estructura

```text
deep-opm-pro/
|-- AGENTS.md                  # reglas activas para sesiones de desarrollo
|-- README.md                  # mapa operativo del repo
|-- NOTICE.md                  # limites de uso, autoria y material derivado
|-- setup.sh                   # regeneracion de material OPCloud grande
|-- app/                       # modelador OPM nuevo
|   |-- src/modelo/            # kernel OPM minimo
|   |-- src/opl/               # OPL forward
|   |-- src/render/jointjs/    # adaptador JointJS OSS
|   |-- src/ui/                # UI Preact/Zustand
|   `-- e2e/                  # smoke Playwright
|-- docs/
|   |-- HANDOFF.md             # estado vigente, decisiones, pendientes
|   |-- JOYAS.md               # hallazgos tecnicos validados
|   |-- historias-usuario-v2/  # backlog local vivo
|   `-- roadmap/              # cortes activos
|-- opm-extracted/             # derivado curado, versionado y trazable
|-- assets/                    # SVG/PNG canonicos observados
|-- fixtures/                  # modelos reales observados del sandbox
|-- config/                    # configuraciones extraidas
|-- catalog/                   # indices historicos
`-- webroot/                   # HTML/favicon capturados
```

El workspace no conserva por defecto artefactos pesados o efimeros. `_local/`,
`decompiled/`, `app/dist/`, `app/test-results/` y `.claude/` son salidas
ignoradas por git y se regeneran solo cuando hacen falta. `app/node_modules/`
tambien esta ignorado, pero suele mantenerse localmente para no frenar el ciclo
de desarrollo.

## Desarrollo

```bash
cd app
bun run dev              # servidor Vite local
bun run check            # typecheck + unit tests
bun run browser:smoke    # Playwright/Chromium
bun run build            # build produccion
bun run security:scan    # Bun Security Scanner API sobre bun.lock
bun run visual:audit     # auditoria visual in-vivo; escribe app/test-results/
bun run visual:deep      # auditoria visual profunda; escribe app/test-results/
```

`app/bunfig.toml` configura proteccion de supply-chain para instalaciones
futuras: scanner de Socket para Bun y edad minima de publicacion de 7 dias para
nuevas resoluciones. La instalacion reproducible sigue anclada en `app/bun.lock`.

## Produccion Privada

La primera instancia privada vive en `https://opforja.sanixai.com`.

- Despliegue: `docker compose up -d --build` desde la raiz del repo.
- Hosting: Nginx estatico en contenedor, publicado por Traefik en la red Docker
  externa `web`.
- Acceso: Basic Auth dedicado `opforja-auth@docker`; usuario operativo
  `fsanhuezal`; la contrasena no se versiona en claro.
- Datos: los modelos viven en `localStorage` del navegador y deben respaldarse
  con `Menu principal > Importar/Exportar JSON... > Descargar JSON`.
- Guia operativa completa: `docs/deploy/opforja.md`.

## Regla De Autoridad

La semantica OPM se resuelve contra la SSOT canonica:

1. `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`
2. `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-visual-es.md`
3. `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`
4. `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/metodologia-opm-es.md`

OPCloud operacionaliza OPM, pero no redefine la semantica. Ante tension entre
evidencia OPCloud y SSOT OPM, manda la SSOT.

## Insumos OPCloud

Antes de crear soluciones visuales o semanticas desde cero, consulta los
insumos en este orden:

1. `assets/svg/` y `opm-extracted/assets/svg/`
2. `assets/png/` y `opm-extracted/assets/png/`
3. `docs/JOYAS.md`
4. `opm-extracted/INDEX.md`, `MODULES.md`, `assets/INDEX.md`
5. `decompiled/` solo si `opm-extracted/` no alcanza; regeneralo con
   `bash setup.sh` antes de consultarlo
6. `fixtures/`
7. `catalog/`
8. `config/`

No copies bloques 1:1 de `opm-extracted/` o `decompiled/` dentro de `app/`.
Usalos como evidencia para implementar una arquitectura propia.

## Regeneracion

```bash
bash setup.sh
```

Ese comando repuebla bundles, decompilacion, assets publicos, `webroot/` y
configuracion extraida. `decompiled/` y `_local/` son grandes, gitignored y
regenerables; no son codigo fuente de la app ni se mantienen en el workspace
liviano.

## Verificacion Vigente

El corte documentado en `docs/HANDOFF.md` mantiene verde:

- `cd app && bun run check`
- `cd app && bun run browser:smoke`
- `cd app && bun run build`
- `cd app && bun run security:scan`
- `cd app && bun run visual:audit -- http://127.0.0.1:5173/`
- `cd app && bun run visual:deep -- http://127.0.0.1:5173/`

Las capturas, JSON y reportes de auditoria visual se generan en
`app/test-results/` y no se versionan. La memoria operativa versionada es
`docs/HANDOFF.md`.

Lee `docs/HANDOFF.md` antes de continuar trabajo de producto. Es el unico
handoff vigente del proyecto y debe reemplazarse, no duplicarse, cuando cambie
el estado operativo.

## Fuentes Externas

- OPCloud app publica: `https://opcloud.systems`
- OPCloud sandbox observado: `https://opcloud-sandbox.web.app`
- Bun Security Scanner API: `https://bun.com/docs/pm/security-scanner-api`
- Socket Bun scanner: `https://socket.dev/blog/socket-integrates-with-bun-1-3-security-scanner-api`
