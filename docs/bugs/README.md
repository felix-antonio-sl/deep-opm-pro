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

En produccion estatica pura el capturador permanece oculto salvo build con
`VITE_ENABLE_BUG_CAPTURE=true`. Si se habilita, debe existir un backend que
atienda `POST /__deep-opm/bug-reports`; en `opforja` ese backend es el sidecar
Bun definido en `docker-compose.yml`.
