# Bug reports locales

El capturador integrado de la app escribe reportes en esta carpeta cuando la app
corre con `cd app && bun run dev`, `cd app && bun run preview` o en `opforja`
mediante el sidecar interno `bug-capture`.

Formato generado:

```text
docs/bugs/BUG-<timestamp>-<hex>/
├── report.md
├── payload.json
└── screenshots/
    ├── 01-captura.png
    └── ...
```

Cada reporte tiene un id estable `BUG-...` para referenciarlo en prompts a
agentes. El `report.md` contiene texto, links relativos a screenshots y contexto
de la app; `payload.json` conserva la version estructurada.

## Índice vivo y estados

`INDEX.md` es el ledger operativo para no repetir reportes. Lista cada `BUG-*`
activo con tipo (`Bug`/`Feat`), estado, fecha, contexto, resumen, resolución,
número de capturas y nota.

`HISTORY.md` es el histórico completo: activos + archivados en
`docs/bugs/archive/**`. Para bugs archivados intenta recuperar el cierre desde
el `README.md` del archivo mensual; si no hay detalle, los marca como
archivados sin resolución detallada.

La metadata editable vive en `statuses.json`. Si un bug/feat no aparece ahí, el
índice usa el tipo, estado y resolución persistidos en `payload.json`/`report.md`;
los reportes nuevos nacen como `type: "Bug"`, `status: "Nuevo"` y
`resolution: "Pendiente."`.

Regenerar manualmente:

```bash
cd app && bun run bug:index
```

El sidecar `bug-capture` también regenera `INDEX.md` automáticamente después de
guardar cada reporte nuevo. También regenera `HISTORY.md`.

En produccion estatica pura el capturador permanece oculto salvo build con
`VITE_ENABLE_BUG_CAPTURE=true`. Si se habilita, debe existir un backend que
atienda `POST /__deep-opm/bug-reports`; en `opforja` ese backend es el sidecar
Bun definido en `docker-compose.yml`.
