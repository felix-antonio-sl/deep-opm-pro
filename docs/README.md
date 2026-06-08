# Documentación — deep-opm-pro

Modelador OPM/ISO 19450 nuevo, con arquitectura propia. No es fork de OPCloud.

**Instancia en producción:** `https://opforja.sanixai.com`

## Entrada rápida

| Si quieres... | Lee |
|---|---|
| Entender el proyecto y su arquitectura | `../CLAUDE.md` |
| Saber qué está desplegado y qué falta | `HANDOFF.md` |
| Usar el modelador como usuario | `uso-productivo.md` |
| Desplegar o administrar la instancia | `deploy/opforja.md` |
| Conocer las decisiones técnicas clave | `canon-opm/` (puentes a KORA) |
| Consultar el plan de cortes activos | `roadmap/cortes-operativos.md` |
| Revisar auditorías técnicas | `auditorias/` |
| Verificar el estado del sistema de bugs | `bugs/INDEX.md` |

## Estructura

```
docs/
├── README.md                    ← este archivo
├── HANDOFF.md                   ← estado operativo vigente (única memoria de traspaso)
├── uso-productivo.md            ← guía del usuario del modelador
├── JOYAS.md                     ← hallazgos técnicos validados de ingeniería inversa
│
├── canon-opm/                   ← puentes locales a las SSOT OPM en KORA
│   ├── reglas-opm-estrictas.md
│   ├── spec-forja-opl.md
│   ├── spec-forja-opd.md
│   └── metodologia-forja.md
│
├── deploy/
│   └── opforja.md               ← operación de la instancia Docker
│
├── roadmap/                     ← planes y cortes de producto
│   ├── README.md                ← índice del roadmap
│   ├── cortes-operativos.md     ← escalera operativa (alpha → beta → gamma → delta)
│   ├── backlog-contingencial.md ← mandato del operador
│   ├── quality-ledger.md        ← gates ejecutables de calidad
│   └── protocolo-re-pin.md     ← protocolo de re-pin para cambios en SSOT
│
├── auditorias/                  ← auditorías técnicas vigentes
│   └── README.md                ← política y índice
│
├── specs/                       ← especificaciones técnicas de frentes activos
│   └── mobile-readonly-v1-steipete-cat-jointjs.md
│
└── bugs/                        ← reportes del capturador integrado
    ├── README.md                ← formato y uso
    ├── INDEX.md                 ← ledger operativo de bugs activos
    └── BUG-*/                   ← reportes individuales
```

## Convenciones documentales

- **Idioma:** español (es-CL) para documentación; inglés para identificadores de código.
- **Handoff único:** `HANDOFF.md` es la única memoria de traspaso. Nunca crear handoffs paralelos o fechados.
- **SSOT OPM:** las fuentes de verdad viven en KORA (`urn:fxsl:kb:*`). Los archivos en `canon-opm/` son puentes locales, no copias.
- **Repo liviano:** no versionar artefactos regenerables o efímeros. Lo que no ofrece valor actual se elimina; la historia git es la red de recuperación.
