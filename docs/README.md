# Documentación — deep-opm-pro

Modelador OPM/ISO 19450 nuevo, con arquitectura propia. No es fork de OPCloud.

**Instancia en producción:** `https://opforja.sanixai.com`

## Entrada rápida

| Si quieres... | Lee |
|---|---|
| Entender el proyecto y su arquitectura | `../CLAUDE.md` |
| Saber qué está desplegado y qué falta | `HANDOFF.md` |
| Usar el modelador como usuario | `uso-productivo.md` |
| Aprender a modelar con método (humano o agente) | `manual-opforja.md` |
| Desplegar o administrar la instancia | `deploy/opforja.md` |
| Conocer las decisiones técnicas clave | `canon-opm/` (puentes a KORA) |
| Consultar el plan de cortes activos | `roadmap/cortes.md` |
| Revisar auditorías técnicas | `auditorias/README.md` |
| Leer especificaciones de frentes activos | `specs/` |
| Consultar la referencia histórica del decommission | `reference/PROCEDENCIA.md` |
| Verificar el estado del sistema de bugs | `bugs/INDEX.md` |

## Estructura

```
docs/
├── README.md                    ← este archivo (índice navegable)
├── HANDOFF.md                   ← estado operativo vigente (única memoria de traspaso, consolidada)
├── uso-productivo.md            ← guía operativa del usuario (entrar, guardar, atajos)
├── manual-opforja.md            ← manual integrado: método Forja + pista humano + pista agente
├── JOYAS.md                     ← hallazgos técnicos validados de ingeniería inversa
├── render-headless.md           ← herramienta dev: render headless del proto (H1)
├── verify-reproducible.md       ← herramienta dev: verificación de reproducibilidad (H2)
│
├── canon-opm/                   ← puentes locales a las SSOT OPM en KORA
│   ├── reglas-opm-estrictas.md
│   ├── spec-forja-opl.md
│   ├── spec-forja-opd.md
│   ├── metodologia-forja.md
│   └── resolutor-urn.json       ← mapa URN→path (re-ancla a pneuma)
│
├── deploy/
│   └── opforja.md               ← operación de la instancia Docker
│
├── roadmap/                     ← planes y cortes de producto
│   ├── README.md                ← índice del roadmap
│   ├── cortes.md                ← escalera del compuesto (C-cordón · E-expresión · X-exoesqueleto)
│   ├── quality-ledger.md        ← gates ejecutables de calidad
│   ├── registro-conformidad-ssot.md ← mapeo regla DEBE → gate/estado (R-CONF-7)
│   └── protocolo-re-pin.md      ← protocolo de re-pin para cambios en SSOT
│
├── auditorias/                  ← auditorías con referencia viva o valor prospectivo
│   └── README.md                ← política y índice (qué vive y por qué)
│
├── specs/                       ← especificaciones técnicas de frentes (vivo o canónico)
│   ├── auth-identidad-v1.md
│   ├── mobile-readonly-v1-steipete-cat-jointjs.md
│   ├── 2026-06-14-invocacion-implicita-bimodal-design.md
│   └── 2026-06-15-orden-inzoom-canvas-sync-design.md
│
├── superpowers/                 ← diseños de frentes activos + planes TDD archivados
│   ├── specs/                   ← un diseño por frente en curso/reciente (ver carpeta, crece por corte)
│   └── plans/                   ← planes de ejecución TDD archivados
│
├── reference/                   ← referencia histórica del decommission (opmodel/opm-model-app, 2026-06-22); ver PROCEDENCIA.md
│
├── memorias-aprendizajes/       ← lecciones del bucle modelar-OPM-con-OpForja
│
├── solicitudes-upstream/        ← peticiones desde/hacia skills y KORA
│
└── bugs/                        ← capturador integrado
    ├── README.md                ← formato y uso
    ├── INDEX.md                 ← ledger operativo de bugs activos
    ├── HISTORY.md               ← histórico completo (activos + archivados)
    ├── BUG-*/                   ← reportes activos
    └── archive/BUG-*/           ← reportes resueltos (regenerable con `bun run bug:index`)
```

## Convenciones documentales

- **Idioma:** español (es-CL) para documentación y vocabulario del dominio OPM en el código; inglés para infraestructura (stack, dependencias, utilidades) y comandos de shell.
- **Handoff único:** `HANDOFF.md` es la única memoria de traspaso. Nunca crear handoffs paralelos o fechados.
- **SSOT OPM:** las fuentes de verdad viven en KORA (`urn:fxsl:kb:*`). Los archivos en `canon-opm/` son puentes locales, no copias.
- **Repo liviano:** no versionar artefactos regenerables o efímeros. Lo que no ofrece valor actual se elimina; la historia git es la red de recuperación.
