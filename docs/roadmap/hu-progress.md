# Auditoria de avance HU v2

**Generado:** 2026-05-18T14:29:19.217Z
**Backlog:** `docs/historias-usuario-v2`
**Ledger de evidencia:** `docs/roadmap/hu-progress-evidence.json`
**Auditoria automatica:** 79/102 reglas matcheadas sobre 685 archivos fuente.


Regenerar desde la raiz del repo:

```bash
# Auditar el avance real contra app/src, app/e2e, app/scripts y assets/svg/links.
node docs/historias-usuario-v2/tools/progress-dashboard.mjs --sync-real

# Regenerar reportes desde el ledger vigente sin reescanear codigo.
node docs/historias-usuario-v2/tools/progress-dashboard.mjs
```

## Resumen ejecutivo

| Segmento | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| Total backlog | 1126 | 246 | 10 | 492 | 378 | 22.0% |
| M0 | 130 | 87 | 3 | 40 | 0 | 70.9% |
| MVP-alpha | 121 | 97 | 0 | 24 | 0 | 80.4% |
| MVP-beta | 193 | 70 | 4 | 119 | 0 | 38.7% |

## Por corte

| Corte | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| MVP-alpha | 121 | 97 | 0 | 24 | 0 | 80.4% |
| MVP-beta | 193 | 70 | 4 | 119 | 0 | 38.7% |
| MVP-gamma | 434 | 79 | 6 | 349 | 0 | 16.7% |
| MVP-delta | 378 | 0 | 0 | 0 | 378 | 0.0% |
| Sin corte | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por prioridad

| Prioridad | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| M0 | 130 | 87 | 3 | 40 | 0 | 70.9% |
| M1 | 161 | 84 | 2 | 69 | 6 | 52.6% |
| S | 471 | 66 | 2 | 241 | 162 | 15.6% |
| C | 247 | 9 | 3 | 134 | 101 | 3.9% |
| W | 117 | 0 | 0 | 8 | 109 | 0.0% |
| sin-prioridad | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por epica

| Epica | Titulo | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---|---:|---:|---:|---:|---:|---:|
| 10 | Canvas — creación de cosas (proceso, objeto, enlace inicial, afiliación, esencia) | 17 | 14 | 0 | 3 | 0 | 81.6% |
| 11 | Canvas — modelado básico (agregación, multi-selección, enlaces procedurales, propiedades, alineación, borrado) | 22 | 15 | 0 | 7 | 0 | 64.3% |
| 12 | Canvas — descomposición de procesos | 31 | 22 | 1 | 8 | 0 | 75.2% |
| 13 | Canvas — estados (designaciones, par entrada-salida, supresión, layout interno) | 18 | 9 | 1 | 8 | 0 | 52.1% |
| 14 | Canvas — estilado visual de cosas, texto y enlaces | 15 | 5 | 0 | 10 | 0 | 40.0% |
| 15 | Canvas — enlaces avanzados (multiplicidad, rutas, XOR/O, condición/evento/NO, invocación) | 23 | 22 | 0 | 1 | 0 | 96.1% |
| 16 | Canvas — enlaces: propiedades, Tabla de Enlaces y estilo | 17 | 0 | 0 | 17 | 0 | 0.0% |
| 17 | Canvas — objetos avanzados (alias, unidad, descripción, URL, plegado parcial, designaciones de estado, duración) | 28 | 23 | 0 | 5 | 0 | 79.6% |
| 18 | Canvas — plegado parcial (vista compacta de refinadores intra-rectángulo) | 15 | 12 | 3 | 0 | 0 | 90.7% |
| 19 | Canvas — imágenes incrustadas en cosas (URL, pool, alternar imagen/texto, exportación) | 16 | 11 | 0 | 5 | 0 | 63.2% |
| 20 | Estructura — árbol OPD (navegación, orden, gestión, vistas derivadas) | 21 | 21 | 0 | 0 | 0 | 100.0% |
| 21 | Estructura — mapa del sistema (meta-vista gráfica del árbol de OPDs) | 18 | 0 | 0 | 18 | 0 | 0.0% |
| 30 | Persistencia — guardar/cargar, diálogos modales, versiones, archivado, búsqueda global, autosalvado | 34 | 26 | 0 | 8 | 0 | 78.7% |
| 31 | Persistencia — carpetas, jerarquía, permisos y navegación del workspace | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 32 | Persistencia — sub-modelos (vistas de subsistema, archivos peer, composición cross-modelo) | 31 | 0 | 0 | 31 | 0 | 0.0% |
| 33 | Persistencia — plantillas (artefactos reutilizables, ámbitos Privado/Organizacional/Global) | 22 | 0 | 0 | 22 | 0 | 0.0% |
| 34 | Persistencia — creación de modelo nuevo (ruta simple + asistente de 12 etapas) | 28 | 2 | 0 | 26 | 0 | 5.0% |
| 35 | Persistencia — mover modelos y buscar cosas (Ctrl+F intra-modelo) | 20 | 0 | 0 | 20 | 0 | 0.0% |
| 40 | Colaboración — permisos de modelo, token de edición y auto-lectura desde carpeta | 25 | 0 | 0 | 0 | 25 | 0.0% |
| 41 | Colaboración — chat del modelo | 17 | 0 | 0 | 0 | 17 | 0.0% |
| 42 | Colaboración — notas adhesivas (anclaje, toggle, integración) | 22 | 0 | 0 | 22 | 0 | 0.0% |
| 50 | Panel OPL-ES — lente bimodal, edición inversa y sincronización con el canvas | 21 | 16 | 0 | 5 | 0 | 81.8% |
| 60 | Exportar a PDF — pipeline papel, opciones, selección de OPDs, integración Compartir | 35 | 0 | 0 | 35 | 0 | 0.0% |
| 61 | Exportar SVG — exportar diagramas OPD como imágenes vectoriales | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 70 | Interoperabilidad — importación de modelos OPCAT 4.2 (.opx) | 25 | 0 | 0 | 25 | 0 | 0.0% |
| 71 | Interoperabilidad — importar CSV de atributos, instancias y valores | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 80 | Configuración — gestión de usuarios, grupos y organización | 26 | 0 | 0 | 0 | 26 | 0.0% |
| 81 | Configuración — defaults de estilo visual, esencia, OPL, cuadrícula y herencia | 22 | 0 | 0 | 0 | 22 | 0.0% |
| 82 | Configuración — ontología organizacional (glosario canónico + sugerencia + reforzamiento) | 20 | 0 | 0 | 20 | 0 | 0.0% |
| 90 | Interacción — atajos de teclado | 21 | 20 | 0 | 1 | 0 | 95.8% |
| 91 | Interacción — modo tutorial, tooltips guiados y asistencia pedagógica | 16 | 0 | 0 | 16 | 0 | 0.0% |
| 1A | Canvas — cuadrícula, imán, redimensión y alineación | 18 | 8 | 3 | 7 | 0 | 51.1% |
| 1B | Canvas — operaciones de traer conectados (hidratar OPD con cosas y enlaces existentes) | 16 | 15 | 0 | 1 | 0 | 97.6% |
| 1C | Canvas — validaciones (interior/exterior, nombres duplicados, verificación metodológica, alcance de eliminación) | 17 | 0 | 0 | 17 | 0 | 0.0% |
| A0 | Extensión — estereotipos OPM (mecanismo genérico de ampliación del lenguaje) | 40 | 0 | 0 | 40 | 0 | 0.0% |
| A1 | Extensión — modelado de requisitos OPM (trazabilidad, plantilla canónica, vistas proyectadas) | 34 | 0 | 0 | 34 | 0 | 0.0% |
| A2 | Extensión — IA generativa para requisitos (AI Reqs Generation) | 24 | 0 | 0 | 0 | 24 | 0.0% |
| B0 | Simulación conceptual — modo, controles y marcas sobre canvas | 30 | 0 | 0 | 0 | 30 | 0.0% |
| B1 | Simulación computacional — valores escalares, firmas invocables y sorteo probabilístico | 27 | 0 | 0 | 0 | 27 | 0.0% |
| B2 | Simulación — funciones definidas por usuario (código en procesos) | 26 | 0 | 0 | 0 | 26 | 0.0% |
| B3 | Simulación — validación de rango, tipo primitivo y aplicación suave/dura | 18 | 0 | 0 | 0 | 18 | 0.0% |
| B4 | Simulación — condiciones y bucles (control-flow) | 26 | 0 | 0 | 0 | 26 | 0.0% |
| B5 | Simulación — entrada de usuario en tiempo de ejecución | 23 | 0 | 0 | 0 | 23 | 0.0% |
| C0 | Runtime — integración MQTT (broker, tópicos, Publish/Subscribe, gemelo digital) | 22 | 0 | 0 | 0 | 22 | 0.0% |
| C1 | Runtime — URL externas (HTTP/REST) como categoría ejecutable | 26 | 0 | 0 | 0 | 26 | 0.0% |
| C2 | Runtime ROS — integración con Robot Operating System | 28 | 0 | 0 | 0 | 28 | 0.0% |
| D0 | Análisis — detección de conocimiento faltante (predicción de enlaces sobre el grafo del modelo) | 22 | 0 | 0 | 0 | 22 | 0.0% |
| D1 | Análisis — calificación de informatividad del modelo (MFSP, INF, WINF, TWINF) | 16 | 0 | 0 | 0 | 16 | 0.0% |
| SHARED | Patrones transversales | 9 | 5 | 2 | 2 | 0 | 64.6% |

## Pendientes M0 inmediatos

- [HU-SHARED-007](../historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md) — Eco OPL-ES sincronizado (M0, pendiente)
- [HU-1C.004](../historias-usuario-v2/epicas/epica-1c-canvas-validaciones.md) — Crear cosa interna correcta directamente dentro del contenedor (M0, pendiente)
- [HU-10.007](../historias-usuario-v2/epicas/epica-10-canvas-creacion-cosas.md) — Iniciar enlace desde borde de cosa (M0, pendiente)
- [HU-11.001](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Crear cosa y sus partes en secuencia sobre el mismo OPD (M0, pendiente)
- [HU-11.004](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Fusionar múltiples enlaces de agregación en bus vertical único (M0, pendiente)
- [HU-11.014](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Renombrar etiqueta del enlace [especializa HU-SHARED-004] (M0, pendiente)
- [HU-11.024](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Guardar modelo explícitamente y ver confirmación (M0, pendiente)
- [HU-11.025](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Iniciar enlace desde zona de borde respetando handles (M0, pendiente)
- [HU-12.002](../historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md) — Identificar opción "Descomponer" en menú contextual con tooltip (M0, pendiente)
- [HU-12.016](../historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md) — Codificar orden temporal por coordenada Y del subproceso (M0, pendiente)
- [HU-12.017](../historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md) — Crear subprocesos concurrentes en misma Y y emitir "paralelo" en OPL-ES (M0, pendiente)
- [HU-12.018](../historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md) — Crear objeto interno dentro del contenedor (M0, pendiente)
- [HU-12.022](../historias-usuario-v2/epicas/epica-12-canvas-descomposicion.md) — Conectar subproceso interno con objeto interno (M0, pendiente)
- [HU-13.001](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Agregar primeros dos estados desde menú contextual (M0, pendiente)
- [HU-13.002](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Agregar primeros dos estados desde toolbar contextual (M0, pendiente)
- [HU-13.004](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Renombrar estado con diálogo [especializa HU-SHARED-004] (M0, pendiente)
- [HU-30.002](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Ver botón Guardar (disco) en barra principal (M0, pendiente)
- [HU-30.003](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Ver botón Cargar (carpeta) en barra principal (M0, pendiente)
- [HU-30.014](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Ctrl+S dispara guardado equivalente al botón (M0, pendiente)
- [HU-30.017](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Crear modelo nuevo desde "Nuevo Modelo" (M0, pendiente)
- [HU-34.001](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Activar "Nuevo Modelo" desde menú principal (M0, pendiente)
- [HU-34.004](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver pestaña inicial con literal "Modelo (No guardado)" (M0, pendiente)
- [HU-34.005](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver árbol OPD inicial con nodo único "SD" (M0, pendiente)
- [HU-34.006](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver lienzo OPD vacío tras "Nuevo Modelo" (M0, pendiente)
- [HU-34.007](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver panel OPL-ES vacío tras "Nuevo Modelo" (M0, pendiente)
- [HU-34.008](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver biblioteca "Cosas arrastrables" vacía (M0, pendiente)

## Brechas registradas

- Sin brechas registradas.

## Artefactos

- Dashboard: `docs/roadmap/hu-progress.html`
- Dataset completo: `docs/roadmap/hu-progress.json`
- Ledger editable: `docs/roadmap/hu-progress-evidence.json`

## Notas metodologicas

- Las HU absorbidas/fusionadas se excluyen del avance ponderado.
- `cubierto` pesa 1.0, `parcial` pesa 0.5 y `pendiente/diferido/bloqueado` pesa 0.
- El peso de una HU deriva de su tamano: XS=1, S=2, M=4, L=8, XL=13.
- La auditoria es conservadora: ausencia de evidencia exacta equivale a pendiente.
