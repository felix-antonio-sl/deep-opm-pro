---
titulo: "Roadmap — cortes MVP del inventario v2"
fecha: 2026-05-03
estado: "activo"
---

## 1. Propósito

Cortes operativos para implementación. Refina `RESUMEN-ROADMAP.md` del v1 con la estructura consolidada del v2 (HU canónicas + shared).

## 2. Cortes

| Corte | Objetivo | Épicas foco | Shared bloqueantes |
|---|---|---|---|
| **MVP-α** | Kernel OPM editable y persistente | 10, 11, 20, 30, 50 | 002, 003, 006, 007, 008, 009 |
| **MVP-β** | Modelador usable para dominio real | 12, 13, 15, 16, 1B, 1C, 34, A0 | 001, 004, 005 |
| **MVP-γ** | Productividad, organización e intercambio | 14, 17, 18, 19, 1A, 21, 31, 32, 33, 35, 42, 60, 61, ~~70~~, 71, 82, 90, ~~91~~, A1 | (todas las shared estabilizadas) |
| **MVP-δ** | Capacidades avanzadas diferidas | 40, 41, 80, 81, A2, B0..B5, C0..C2, D0, D1 | — |

## 3. Detalle del MVP-α

**Objetivo:** modelador OPM mínimo viable con persistencia.

**Salida observable:**
- Crear cosas (procesos, objetos), nombrarlas, conectarlas con enlaces canónicos.
- Navegar OPDs en árbol.
- Guardar/cargar modelo en IndexedDB.
- Panel OPL-ES con eco bidireccional.
- 6 fixtures canónicos cargables.

**Bloque de HU críticas:**
- Toda EPICA-10 (creación de cosas).
- HU-11.001..11.011 (modelado básico estructural y procedural).
- HU-20.001..20.008 (árbol OPD core).
- HU-30.001..30.018 (save/load core).
- HU-50.001, HU-50.016, HU-50.019, HU-50.022 (panel OPL-ES esencial).
- HU-SHARED-002, HU-SHARED-006, HU-SHARED-007, HU-SHARED-008, HU-SHARED-009 (todas).
- HU-SHARED-003 en modo trivial (single-user, sin red).

**Estimación de esfuerzo:** ~150 HU activas, ~12-16 semanas con dotación 2-3 ingenieros.

## 4. Detalle del MVP-β

**Objetivo:** modelador usable en dominio real (KORA, HDOS, etc.).

**Bloque de HU críticas adicionales:**
- EPICA-12 completa (descomposición).
- EPICA-13 (estados con designaciones).
- EPICA-15 (enlaces avanzados con multiplicidad y XOR/O).
- EPICA-16 (propiedades de enlace).
- EPICA-1B (traer conectados).
- EPICA-1C (validaciones metodológicas).
- EPICA-34 (asistente de creación).
- EPICA-A0 (estereotipos como mecanismo de extensión genérico).

**Habilita:** modelado de dominios complejos sin código intermedio.

## 5. Detalle del MVP-γ

**Objetivo:** productividad operativa.

**Áreas:**
- **Visual y UX**: 14 (estilo), 18 (plegado), 19 (imágenes), 1A (cuadrícula), 21 (mapa).
- **Persistencia avanzada**: 31 (carpetas), 32 (sub-modelos), 33 (plantillas), 35 (mover y buscar).
- **Documentación y export**: 42 (notas), 60 (PDF), 61 (SVG).
- **Interoperabilidad**: ~~70 (OPCAT)~~ descartada, 71 (CSV).
- **Configuración**: 82 (ontología organizacional).
- **Interacción**: 90 (atajos), ~~91 (tutorial)~~ descartada.
- **Extensión**: 17 (atributos avanzados), A1 (requisitos).

## 6. Detalle del MVP-δ

**Objetivo:** capacidades especializadas.

**Áreas:**
- **Colaboración multiusuario**: 40 (permisos), 41 (chat).
- **Administración**: 80 (usuarios/org), 81 (defaults).
- **IA generativa**: A2.
- **Simulación completa**: B0..B5.
- **Runtime externo**: C0 (MQTT), C1 (URLs), C2 (ROS).
- **Análisis**: D0 (conocimiento faltante), D1 (informatividad).

Estas capacidades requieren infraestructura externa o presupuesto de ingeniería significativo. Diferibles sin afectar el modelador core.

## 7. Épicas descartadas del proyecto

Las siguientes épicas **no serán abordadas en deep-opm-pro**. Las HU correspondientes se conservan en sus archivos como referencia histórica y trazabilidad SSOT, pero **quedan fuera del alcance del proyecto** y no deben asignarse a ninguna ronda de desarrollo ni aparecer en briefs de líneas paralelas. Decisión del operador, irreversible salvo nueva instrucción explícita.

| Épica | Título | Fecha de descarte | Razón |
|---|---|---|---|
| 70 | [Importación OPCAT 4.2 (.opx)](epicas/epica-70-interop-opcat.md) | 2026-05-05 | Fuera de alcance del proyecto |
| 91 | [Modo tutorial / tooltips guiados / asistencia pedagógica](epicas/epica-91-interaccion-tutorial.md) | 2026-05-05 | Fuera de alcance del proyecto |

## 7. Dependencias críticas entre cortes

```
α: 10 → 11 → 20 → 30 → 50           (cierre del eje)
β: 12 → 13 → 15/16 → 1C → A0
γ: (todas las shared estables)
δ: (B0 → B1..B5)  (C0..C2 independientes)  (D0..D1 independientes)
```

Reglas:
- No iniciar β sin α completo.
- A0 antes de A1 y A2 (estereotipos son mecanismo base).
- B0 antes de B1..B5 (runner conceptual primero).

## 8. Criterios de cierre por corte

| Criterio | α | β | γ | δ |
|---|---|---|---|---|
| Linter `validate-hu` verde | ✓ | ✓ | ✓ | ✓ |
| Tests e2e cubren flujos M0/M1 | ✓ | ✓ | ✓ | ✓ |
| 6 fixtures canónicos cargan | ✓ | — | — | — |
| Dominio real (KORA/HDOS) modelable | — | ✓ | — | — |
| Multi-usuario y permisos | — | — | — | ✓ |
| Simulación end-to-end | — | — | — | ✓ |
