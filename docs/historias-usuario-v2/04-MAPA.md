---
titulo: "Mapa — índice de épicas y matriz inversa SSOT"
fecha: 2026-05-03
estado: "activo"
total_epicas: 48
total_shared: 9
total_hu_canonicas: 1117
total_stubs: 48
---

## 1. Propósito

Vista única de navegación del inventario v2. Combina:
- Índice de épicas con prioridad y conteos.
- Matriz inversa SSOT (V-xxx, Glos 3.x, OPL-ES, JOYAS) → HU canónicas que las citan (regenerable por linter).
- Capas funcionales como agrupación lógica.

## 2. Índice de épicas por capa funcional

### 2.1 Canvas y modelado central (13 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 10 | [Creación de cosas](epicas/epica-10-canvas-creacion-cosas.md) | M0 | 17 | 5 |
| 11 | [Modelado básico](epicas/epica-11-canvas-modelado-basico.md) | M0 | 22 | 5 |
| 12 | [Descomposición](epicas/epica-12-canvas-descomposicion.md) | M0 | 30 | 4 |
| 13 | [Estados](epicas/epica-13-canvas-estados.md) | M0 | 18 | 2 |
| 14 | [Estilado](epicas/epica-14-canvas-styling.md) | C | 15 | 2 |
| 15 | [Enlaces avanzados](epicas/epica-15-canvas-enlaces-avanzados.md) | M1 | 23 | 2 |
| 16 | [Enlaces propiedades](epicas/epica-16-canvas-enlaces-propiedades.md) | M1 | 18 | 4 |
| 17 | [Objetos avanzados](epicas/epica-17-canvas-objetos-avanzados.md) | M1 | 30 | 4 |
| 18 | [Plegado parcial](epicas/epica-18-canvas-plegado-parcial.md) | S | 15 | 0 |
| 19 | [Imágenes](epicas/epica-19-canvas-imagenes.md) | S | 16 | 0 |
| 1A | [Cuadrícula y resize](epicas/epica-1a-canvas-grid-resize.md) | M1 | 18 | 0 |
| 1B | [Traer conectados](epicas/epica-1b-canvas-traer-conectados.md) | M1 | 16 | 0 |
| 1C | [Validaciones](epicas/epica-1c-canvas-validaciones.md) | M1 | 19 | 3 |

### 2.2 Estructura (2 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 20 | [Árbol OPD](epicas/epica-20-estructura-arbol-opd.md) | M0 | 21 | 1 |
| 21 | [Mapa del sistema](epicas/epica-21-estructura-mapa-sistema.md) | S | 18 | 0 |

### 2.3 Persistencia (6 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 30 | [Save/Load](epicas/epica-30-persistencia-save-load.md) | M0 | 35 | 2 |
| 31 | [Carpetas](epicas/epica-31-persistencia-folders.md) | S | 26 | 0 |
| 32 | [Sub-modelos](epicas/epica-32-persistencia-sub-modelos.md) | S | 31 | 1 |
| 33 | [Plantillas](epicas/epica-33-persistencia-plantillas.md) | S | 22 | 0 |
| 34 | [Nuevo modelo](epicas/epica-34-persistencia-nuevo-modelo.md) | M1 | 28 | 0 |
| 35 | [Mover y buscar](epicas/epica-35-persistencia-mover-buscar.md) | M1 | 20 | 0 |

### 2.4 Colaboración (3 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 40 | [Permisos](epicas/epica-40-colaboracion-permisos.md) | W | 25 | 0 |
| 41 | [Chat](epicas/epica-41-colaboracion-chat.md) | W | 17 | 0 |
| 42 | [Notas](epicas/epica-42-colaboracion-notas.md) | S | 22 | 0 |

### 2.5 OPL (1 épica)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 50 | [Panel OPL-ES](epicas/epica-50-opl-pane.md) | M0 | 22 | 6 |

### 2.6 Exportación (2 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 60 | [Export PDF](epicas/epica-60-export-pdf.md) | C | 35 | 0 |
| 61 | [Export SVG](epicas/epica-61-export-svg.md) | C | 26 | 0 |

### 2.7 Interoperabilidad (2 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 70 | ~~[Importar OPCAT](epicas/epica-70-interop-opcat.md)~~ — **descartada del proyecto (2026-05-05)** | S | 25 | 0 |
| 71 | [Importar CSV](epicas/epica-71-interop-csv.md) | S | 26 | 0 |

### 2.8 Configuración (3 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 80 | [Usuarios y org](epicas/epica-80-config-usuarios-organizacion.md) | C | 26 | 0 |
| 81 | [Defaults de estilo](epicas/epica-81-config-defaults-estilo.md) | C | 22 | 0 |
| 82 | [Ontología organizacional](epicas/epica-82-config-ontologia-organizacion.md) | S | 20 | 0 |

### 2.9 Interacción (2 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| 90 | [Atajos](epicas/epica-90-interaccion-shortcuts.md) | M1 | 21 | 0 |
| 91 | ~~[Tutorial](epicas/epica-91-interaccion-tutorial.md)~~ — **descartada del proyecto (2026-05-05)** | C | 16 | 0 |

### 2.10 Extensiones del lenguaje (3 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| A0 | [Estereotipos](epicas/epica-a0-extension-estereotipos.md) | M0 | 40 | 0 |
| A1 | [Requisitos](epicas/epica-a1-extension-requisitos.md) | S | 34 | 0 |
| A2 | [IA generativa](epicas/epica-a2-extension-ai-generativa.md) | C | 24 | 0 |

### 2.11 Simulación (6 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| B0 | [Conceptual](epicas/epica-b0-simulacion-conceptual.md) | S | 30 | 0 |
| B1 | [Computacional](epicas/epica-b1-simulacion-computacional.md) | S | 27 | 0 |
| B2 | [Funciones de usuario](epicas/epica-b2-simulacion-funciones-usuario.md) | S | 26 | 0 |
| B3 | [Validación de rangos](epicas/epica-b3-simulacion-validacion-rangos.md) | S | 18 | 0 |
| B4 | [Condiciones y bucles](epicas/epica-b4-simulacion-condiciones-bucles.md) | S | 26 | 0 |
| B5 | [Entrada de usuario](epicas/epica-b5-simulacion-entrada-usuario.md) | S | 23 | 0 |

### 2.12 Runtime (3 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| C0 | [MQTT](epicas/epica-c0-runtime-mqtt.md) | W | 22 | 0 |
| C1 | [URLs HTTP/REST](epicas/epica-c1-runtime-urls.md) | W | 26 | 0 |
| C2 | [ROS](epicas/epica-c2-runtime-ros.md) | W | 28 | 0 |

### 2.13 Análisis (2 épicas)

| Épica | Título | Prioridad | HU canónicas | Stubs |
|---|---|---|---:|---:|
| D0 | [Conocimiento faltante](epicas/epica-d0-analisis-conocimiento-faltante.md) | S | 22 | 0 |
| D1 | [Informatividad](epicas/epica-d1-analisis-informatividad.md) | S | 16 | 0 |

## 3. HU compartidas (9)

Ver `03-PATRONES-TRANSVERSALES.md` para catálogo completo.

| ID | Título |
|---|---|
| HU-SHARED-001 | Menú contextual unificado |
| HU-SHARED-002 | Pila de deshacer / rehacer |
| HU-SHARED-003 | Permisos y read-only propagado |
| HU-SHARED-004 | Renombrar con validación nominal |
| HU-SHARED-005 | Eliminar con scope |
| HU-SHARED-006 | Estado dirty del modelo |
| HU-SHARED-007 | Eco OPL-ES sincronizado |
| HU-SHARED-008 | Selección de canvas |
| HU-SHARED-009 | Validación nominal |

## 4. Matriz inversa SSOT (extracto)

> **Nota**: la matriz completa se regenera con el linter. Esta sección es ejemplificativa y no exhaustiva.

| Cita SSOT | HU canónicas que la citan |
|---|---|
| `[V-1]` (defaults afiliación/esencia) | HU-10.001, HU-10.002, HU-10.012, HU-10.013, HU-10.015, HU-12.029, HU-1C.001, HU-A0.001, HU-A0.014, ... |
| `[V-61]` (enlace canónico) | HU-10.007, HU-10.011, HU-11.018, HU-11.019, HU-11.020, HU-11.025, HU-13.014, HU-15.022, ... |
| `[V-124]` (sombreado físico) | HU-10.013, HU-10.014, HU-A0.014, HU-A0.027, HU-60.031, HU-61.014 |
| `[V-237]` (Current persistente) | HU-13.013, HU-B0.018, HU-B0.027 |
| `[V-239]` (familias estructurales) | HU-10.008, HU-11.003, HU-11.012, HU-11.026, HU-11.027, HU-1C.014, HU-A2.008, HU-15.008–013, ... |
| `[V-240]` (procedurales) | HU-10.008, HU-11.026, HU-11.027, HU-15.015–016, HU-15.019–020, HU-1C.014 |
| `[Glos 3.3]` (agente) | HU-10.010, HU-11.010, HU-1C.014, HU-34.016, HU-B5.002 |
| `[Glos 3.31]` (descomposición) | HU-12.003, HU-12.014, HU-18.012 |
| `[Glos 3.39]` (objeto) | HU-10.002, HU-1C.014, HU-71.009, HU-C1.003 |
| `[Glos 3.58]` (proceso) | HU-10.001, HU-1C.014, HU-34.013, HU-71.009 |
| `[Glos 3.71a]` (designación de estado) | HU-13.010, HU-13.011, HU-13.012, HU-13.013, HU-17.033, HU-17.034 |
| `[Glos 3.76]` (cosa nombrada) | HU-10.003, HU-12.023, HU-1C.007, HU-34.017, HU-SHARED-009 |
| `[Glos 3.81]` (despliegue) | HU-12.014, HU-17.028, HU-18.001 |
| `[OPL-ES D1]` (cosa-esencia-afiliación) | HU-10.001, HU-10.002, HU-10.016 (absorbida HU-SHARED-007), HU-34.026, HU-50.007 (absorbida) |
| `[OPL-ES T1..T5]` (transformadores) | HU-10.009, HU-11.011, HU-11.009, HU-11.010, HU-50.010 (absorbida) |
| `[OPL-ES TS3]` (transición de estado) | HU-13.018, HU-13.014 |
| `[OPL-ES CX1]` (descomposición) | HU-12.012, HU-12.013, HU-12.014 |
| `[OPL-ES §7 CS1]` (condicional) | HU-B4.001, HU-B4.006 |
| `[OPL-ES §8.2 IV1]` (invocación) | HU-B4.008, HU-B4.010, HU-B4.024 |
| `[OPL-ES §12]` (rangos) | HU-B3.002, HU-B3.003, HU-B3.005, HU-B3.007 |
| `[Met §6]` (etapas SD) | HU-12.014, HU-20.002, HU-34.013–021 |
| `[Met §8.3]` (Requirement Views) | HU-A1.020, HU-A1.021, HU-A1.022, HU-A1.023 |
| `[JOYAS §1]` (paleta) | HU-10.014, HU-10.015, HU-50.016, HU-60.031, HU-61.014, HU-B0.016, HU-B4.003 |
| `[JOYAS §2]` (dimensiones) | HU-10.001, HU-10.002 |
| `[JOYAS §3]` (tipografía) | HU-10.001, HU-10.002, HU-12.009, HU-50.016, HU-1A.001 |
| `[JOYAS §4]` (wrapper+line) | HU-10.007, HU-11.018, HU-11.025, HU-14.012, HU-16.017 |
| `[JOYAS §6]` (manhattan router) | HU-10.007 |
| `[JOYAS §7]` (puertos) | HU-10.007, HU-11.020, HU-11.025, HU-15.024 |
| `[JOYAS §8]` (drop shadow) | HU-10.014, HU-60.031, HU-61.014 |
| `[JOYAS §9]` (OPL templates) | HU-15.004, HU-B0.016, HU-B0.017, HU-B0.018, HU-17.034 |
| `[JOYAS §10]` (estados embebidos) | HU-13.001, HU-13.009 |
| `[JOYAS §13]` (triángulo agregador) | HU-11.003 |

## 5. Cómo regenerar la matriz inversa

```bash
cd /home/felix/projects/deep-opm-pro
bun run docs/historias-usuario-v2/tools/validate-hu.ts
# El linter parsea citas y puede emitir matriz inversa con --emit-matrix (futuro)
```

## 6. Conteos cuantitativos

| Categoría | Conteo |
|---|---|
| Épicas | 48 |
| HU canónicas vivas (en épicas) | 1.117 |
| HU shared canónicas | 9 |
| Stubs (absorbidas/fusionadas) | 48 |
| HU originales (v1) | 1.164 |
| Reducción neta | ~3% (canónicas) |

| Prioridad | HU canónicas |
|---|---:|
| M0 | ~150 |
| M1 | ~180 |
| S | ~430 |
| C | ~210 |
| W | ~50 |

> Cifras verificadas contra el corpus por `tools/audit-hu.mjs` (URN icas-lifecycle).
