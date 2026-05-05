# Auditoria de avance HU v2

**Generado:** 2026-05-05T20:30:24.738Z
**Backlog:** `docs/historias-usuario-v2`
**Ledger de evidencia:** `docs/roadmap/hu-progress-evidence.json`
**Auditoria automatica:** 45/49 reglas matcheadas sobre 159 archivos fuente.


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
| Total backlog | 1126 | 109 | 50 | 589 | 378 | 12.2% |
| M0 | 130 | 72 | 29 | 29 | 0 | 65.5% |
| MVP-alpha | 121 | 46 | 22 | 53 | 0 | 42.9% |
| MVP-beta | 193 | 46 | 23 | 124 | 0 | 31.3% |

## Por corte

| Corte | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| MVP-alpha | 121 | 46 | 22 | 53 | 0 | 42.9% |
| MVP-beta | 193 | 46 | 23 | 124 | 0 | 31.3% |
| MVP-gamma | 434 | 17 | 5 | 412 | 0 | 4.9% |
| MVP-delta | 378 | 0 | 0 | 0 | 378 | 0.0% |
| Sin corte | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por prioridad

| Prioridad | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| M0 | 130 | 72 | 29 | 29 | 0 | 65.5% |
| M1 | 161 | 17 | 12 | 126 | 6 | 17.1% |
| S | 471 | 18 | 8 | 283 | 162 | 5.9% |
| C | 247 | 2 | 1 | 143 | 101 | 1.2% |
| W | 117 | 0 | 0 | 8 | 109 | 0.0% |
| sin-prioridad | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por epica

| Epica | Titulo | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---|---:|---:|---:|---:|---:|---:|
| 10 | Canvas — creación de cosas (proceso, objeto, enlace inicial, afiliación, esencia) | 17 | 5 | 9 | 3 | 0 | 52.6% |
| 11 | Canvas — modelado básico (agregación, multi-selección, enlaces procedurales, propiedades, alineación, borrado) | 22 | 11 | 4 | 7 | 0 | 57.1% |
| 12 | Canvas — descomposición de procesos | 31 | 18 | 10 | 3 | 0 | 73.1% |
| 13 | Canvas — estados (designaciones, par entrada-salida, supresión, layout interno) | 18 | 2 | 6 | 10 | 0 | 29.2% |
| 14 | Canvas — estilado visual de cosas, texto y enlaces | 15 | 5 | 0 | 10 | 0 | 40.0% |
| 15 | Canvas — enlaces avanzados (multiplicidad, rutas, XOR/O, condición/evento/NO, invocación) | 23 | 16 | 1 | 6 | 0 | 76.5% |
| 16 | Canvas — enlaces: propiedades, Tabla de Enlaces y estilo | 17 | 0 | 0 | 17 | 0 | 0.0% |
| 17 | Canvas — objetos avanzados (alias, unidad, descripción, URL, plegado parcial, designaciones de estado, duración) | 28 | 0 | 3 | 25 | 0 | 9.3% |
| 18 | Canvas — plegado parcial (vista compacta de refinadores intra-rectángulo) | 15 | 12 | 2 | 1 | 0 | 88.4% |
| 19 | Canvas — imágenes incrustadas en cosas (URL, pool, alternar imagen/texto, exportación) | 16 | 0 | 0 | 16 | 0 | 0.0% |
| 20 | Estructura — árbol OPD (navegación, orden, gestión, vistas derivadas) | 21 | 9 | 0 | 12 | 0 | 38.9% |
| 21 | Estructura — mapa del sistema (meta-vista gráfica del árbol de OPDs) | 18 | 0 | 0 | 18 | 0 | 0.0% |
| 30 | Persistencia — guardar/cargar, diálogos modales, versiones, archivado, búsqueda global, autosalvado | 34 | 12 | 5 | 17 | 0 | 34.8% |
| 31 | Persistencia — carpetas, jerarquía, permisos y navegación del workspace | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 32 | Persistencia — sub-modelos (vistas de subsistema, archivos peer, composición cross-modelo) | 31 | 0 | 0 | 31 | 0 | 0.0% |
| 33 | Persistencia — plantillas (artefactos reutilizables, ámbitos Privado/Organizacional/Global) | 22 | 0 | 0 | 22 | 0 | 0.0% |
| 34 | Persistencia — creación de modelo nuevo (ruta simple + asistente de 12 etapas) | 28 | 6 | 0 | 22 | 0 | 13.3% |
| 35 | Persistencia — mover modelos y buscar cosas (Ctrl+F intra-modelo) | 20 | 0 | 0 | 20 | 0 | 0.0% |
| 40 | Colaboración — permisos de modelo, token de edición y auto-lectura desde carpeta | 25 | 0 | 0 | 0 | 25 | 0.0% |
| 41 | Colaboración — chat del modelo | 17 | 0 | 0 | 0 | 17 | 0.0% |
| 42 | Colaboración — notas adhesivas (anclaje, toggle, integración) | 22 | 0 | 0 | 22 | 0 | 0.0% |
| 50 | Panel OPL-ES — lente bimodal, edición inversa y sincronización con el canvas | 21 | 9 | 1 | 11 | 0 | 50.9% |
| 60 | Exportar a PDF — pipeline papel, opciones, selección de OPDs, integración Compartir | 35 | 0 | 0 | 35 | 0 | 0.0% |
| 61 | Exportar SVG — exportar diagramas OPD como imágenes vectoriales | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 70 | Interoperabilidad — importación de modelos OPCAT 4.2 (.opx) | 25 | 0 | 0 | 25 | 0 | 0.0% |
| 71 | Interoperabilidad — importar CSV de atributos, instancias y valores | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 80 | Configuración — gestión de usuarios, grupos y organización | 26 | 0 | 0 | 0 | 26 | 0.0% |
| 81 | Configuración — defaults de estilo visual, esencia, OPL, cuadrícula y herencia | 22 | 0 | 0 | 0 | 22 | 0.0% |
| 82 | Configuración — ontología organizacional (glosario canónico + sugerencia + reforzamiento) | 20 | 0 | 0 | 20 | 0 | 0.0% |
| 90 | Interacción — atajos de teclado | 21 | 0 | 0 | 21 | 0 | 0.0% |
| 91 | Interacción — modo tutorial, tooltips guiados y asistencia pedagógica | 16 | 0 | 0 | 16 | 0 | 0.0% |
| 1A | Canvas — cuadrícula, imán, redimensión y alineación | 18 | 0 | 0 | 18 | 0 | 0.0% |
| 1B | Canvas — operaciones de traer conectados (hidratar OPD con cosas y enlaces existentes) | 16 | 0 | 0 | 16 | 0 | 0.0% |
| 1C | Canvas — validaciones (interior/exterior, nombres duplicados, verificación metodológica, alcance de eliminación) | 17 | 4 | 4 | 9 | 0 | 39.6% |
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
| SHARED | Patrones transversales | 9 | 0 | 5 | 4 | 0 | 27.1% |

## Pendientes M0 inmediatos

- [HU-SHARED-007](../historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md) — Eco OPL-ES sincronizado (M0, pendiente)
- [HU-11.001](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Crear cosa y sus partes en secuencia sobre el mismo OPD (M0, pendiente)
- [HU-13.003](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Crear estado adicional individual con "Agregar estado" posterior (M0, pendiente)
- [HU-13.008](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Validar axioma "con estados ⇒ ≥ 2 estados" (M0, pendiente)
- [HU-13.010](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Designar estado como Inicial (M0, pendiente)
- [HU-13.011](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Designar estado como Final (M0, pendiente)
- [HU-13.017](../historias-usuario-v2/epicas/epica-13-canvas-estados.md) — Eco OPL-ES de estados posibles al crear estados (M0, pendiente)
- [HU-15.010](../historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md) — Renderizar conector XOR sobre el abanico (M0, pendiente)
- [HU-15.011](../historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md) — Renderizar conector curvo de O sobre el abanico (M0, pendiente)

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
