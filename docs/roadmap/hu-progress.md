# Auditoria de avance HU v2

**Generado:** 2026-05-07T10:45:06.004Z
**Backlog:** `docs/historias-usuario-v2`
**Ledger de evidencia:** `docs/roadmap/hu-progress-evidence.json`
**Auditoria automatica:** 102/102 reglas matcheadas sobre 388 archivos fuente.


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
| Total backlog | 1126 | 313 | 22 | 413 | 378 | 28.5% |
| M0 | 130 | 109 | 7 | 14 | 0 | 88.7% |
| MVP-alpha | 121 | 121 | 0 | 0 | 0 | 100.0% |
| MVP-beta | 193 | 84 | 14 | 95 | 0 | 47.6% |

## Por corte

| Corte | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| MVP-alpha | 121 | 121 | 0 | 0 | 0 | 100.0% |
| MVP-beta | 193 | 84 | 14 | 95 | 0 | 47.6% |
| MVP-gamma | 434 | 108 | 8 | 318 | 0 | 24.0% |
| MVP-delta | 378 | 0 | 0 | 0 | 378 | 0.0% |
| Sin corte | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por prioridad

| Prioridad | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| M0 | 130 | 109 | 7 | 14 | 0 | 88.7% |
| M1 | 161 | 105 | 9 | 41 | 6 | 69.6% |
| S | 471 | 87 | 3 | 219 | 162 | 20.5% |
| C | 247 | 11 | 3 | 132 | 101 | 4.5% |
| W | 117 | 1 | 0 | 7 | 109 | 1.1% |
| sin-prioridad | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por epica

| Epica | Titulo | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---|---:|---:|---:|---:|---:|---:|
| 10 | Canvas — creación de cosas (proceso, objeto, enlace inicial, afiliación, esencia) | 17 | 17 | 0 | 0 | 0 | 100.0% |
| 11 | Canvas — modelado básico (agregación, multi-selección, enlaces procedurales, propiedades, alineación, borrado) | 22 | 22 | 0 | 0 | 0 | 100.0% |
| 12 | Canvas — descomposición de procesos | 31 | 26 | 2 | 3 | 0 | 87.6% |
| 13 | Canvas — estados (designaciones, par entrada-salida, supresión, layout interno) | 18 | 9 | 6 | 3 | 0 | 66.7% |
| 14 | Canvas — estilado visual de cosas, texto y enlaces | 15 | 5 | 0 | 10 | 0 | 40.0% |
| 15 | Canvas — enlaces avanzados (multiplicidad, rutas, XOR/O, condición/evento/NO, invocación) | 23 | 22 | 0 | 1 | 0 | 96.1% |
| 16 | Canvas — enlaces: propiedades, Tabla de Enlaces y estilo | 17 | 0 | 0 | 17 | 0 | 0.0% |
| 17 | Canvas — objetos avanzados (alias, unidad, descripción, URL, plegado parcial, designaciones de estado, duración) | 28 | 23 | 2 | 3 | 0 | 85.2% |
| 18 | Canvas — plegado parcial (vista compacta de refinadores intra-rectángulo) | 15 | 12 | 3 | 0 | 0 | 90.7% |
| 19 | Canvas — imágenes incrustadas en cosas (URL, pool, alternar imagen/texto, exportación) | 16 | 12 | 0 | 4 | 0 | 68.4% |
| 20 | Estructura — árbol OPD (navegación, orden, gestión, vistas derivadas) | 21 | 21 | 0 | 0 | 0 | 100.0% |
| 21 | Estructura — mapa del sistema (meta-vista gráfica del árbol de OPDs) | 18 | 0 | 0 | 18 | 0 | 0.0% |
| 30 | Persistencia — guardar/cargar, diálogos modales, versiones, archivado, búsqueda global, autosalvado | 34 | 34 | 0 | 0 | 0 | 100.0% |
| 31 | Persistencia — carpetas, jerarquía, permisos y navegación del workspace | 26 | 3 | 0 | 23 | 0 | 15.7% |
| 32 | Persistencia — sub-modelos (vistas de subsistema, archivos peer, composición cross-modelo) | 31 | 0 | 0 | 31 | 0 | 0.0% |
| 33 | Persistencia — plantillas (artefactos reutilizables, ámbitos Privado/Organizacional/Global) | 22 | 13 | 0 | 9 | 0 | 61.4% |
| 34 | Persistencia — creación de modelo nuevo (ruta simple + asistente de 12 etapas) | 28 | 8 | 0 | 20 | 0 | 18.3% |
| 35 | Persistencia — mover modelos y buscar cosas (Ctrl+F intra-modelo) | 20 | 5 | 0 | 15 | 0 | 31.8% |
| 40 | Colaboración — permisos de modelo, token de edición y auto-lectura desde carpeta | 25 | 0 | 0 | 0 | 25 | 0.0% |
| 41 | Colaboración — chat del modelo | 17 | 0 | 0 | 0 | 17 | 0.0% |
| 42 | Colaboración — notas adhesivas (anclaje, toggle, integración) | 22 | 0 | 0 | 22 | 0 | 0.0% |
| 50 | Panel OPL-ES — lente bimodal, edición inversa y sincronización con el canvas | 21 | 21 | 0 | 0 | 0 | 100.0% |
| 60 | Exportar a PDF — pipeline papel, opciones, selección de OPDs, integración Compartir | 35 | 0 | 0 | 35 | 0 | 0.0% |
| 61 | Exportar SVG — exportar diagramas OPD como imágenes vectoriales | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 70 | Interoperabilidad — importación de modelos OPCAT 4.2 (.opx) | 25 | 0 | 0 | 25 | 0 | 0.0% |
| 71 | Interoperabilidad — importar CSV de atributos, instancias y valores | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 80 | Configuración — gestión de usuarios, grupos y organización | 26 | 0 | 0 | 0 | 26 | 0.0% |
| 81 | Configuración — defaults de estilo visual, esencia, OPL, cuadrícula y herencia | 22 | 0 | 0 | 0 | 22 | 0.0% |
| 82 | Configuración — ontología organizacional (glosario canónico + sugerencia + reforzamiento) | 20 | 0 | 0 | 20 | 0 | 0.0% |
| 90 | Interacción — atajos de teclado | 21 | 20 | 0 | 1 | 0 | 95.8% |
| 91 | Interacción — modo tutorial, tooltips guiados y asistencia pedagógica | 16 | 0 | 0 | 16 | 0 | 0.0% |
| 1A | Canvas — cuadrícula, imán, redimensión y alineación | 18 | 15 | 3 | 0 | 0 | 93.6% |
| 1B | Canvas — operaciones de traer conectados (hidratar OPD con cosas y enlaces existentes) | 16 | 15 | 0 | 1 | 0 | 97.6% |
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
| SHARED | Patrones transversales | 9 | 6 | 2 | 1 | 0 | 81.3% |

## Pendientes M0 inmediatos

- Sin pendientes criticos detectados en el filtro actual.

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
