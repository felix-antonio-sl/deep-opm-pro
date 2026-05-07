# Bug reports locales

El capturador integrado de la app escribe reportes en esta carpeta cuando la app
corre con `cd app && bun run dev` o `cd app && bun run preview`.

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
