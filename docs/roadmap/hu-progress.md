# Auditoria de avance HU v2

**Generado:** 2026-05-05T03:59:37.927Z
**Backlog:** `docs/historias-usuario-v2`
**Ledger de evidencia:** `docs/roadmap/hu-progress-evidence.json`
**Auditoria automatica:** 39/39 reglas matcheadas sobre 80 archivos fuente.


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
| Total backlog | 1126 | 77 | 55 | 616 | 378 | 9.8% |
| M0 | 130 | 49 | 33 | 48 | 0 | 51.7% |
| MVP-alpha | 121 | 28 | 24 | 69 | 0 | 29.8% |
| MVP-beta | 193 | 38 | 26 | 129 | 0 | 29.3% |

## Por corte

| Corte | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| MVP-alpha | 121 | 28 | 24 | 69 | 0 | 29.8% |
| MVP-beta | 193 | 38 | 26 | 129 | 0 | 29.3% |
| MVP-gamma | 434 | 11 | 5 | 418 | 0 | 3.4% |
| MVP-delta | 378 | 0 | 0 | 0 | 378 | 0.0% |
| Sin corte | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por prioridad

| Prioridad | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---:|---:|---:|---:|---:|---:|
| M0 | 130 | 49 | 33 | 48 | 0 | 51.7% |
| M1 | 161 | 15 | 13 | 127 | 6 | 15.3% |
| S | 471 | 13 | 8 | 288 | 162 | 4.9% |
| C | 247 | 0 | 1 | 145 | 101 | 0.3% |
| W | 117 | 0 | 0 | 8 | 109 | 0.0% |
| sin-prioridad | 0 | 0 | 0 | 0 | 0 | 0.0% |

## Por epica

| Epica | Titulo | HU vivas | Cubiertas | Parciales | Pendientes | Diferidas | Avance ponderado |
|---|---|---:|---:|---:|---:|---:|---:|
| 10 | Canvas — creación de cosas (proceso, objeto, enlace inicial, afiliación, esencia) | 17 | 5 | 9 | 3 | 0 | 52.6% |
| 11 | Canvas — modelado básico (agregación, multi-selección, enlaces procedurales, propiedades, alineación, borrado) | 22 | 9 | 4 | 9 | 0 | 46.4% |
| 12 | Canvas — descomposición de procesos | 31 | 18 | 10 | 3 | 0 | 73.1% |
| 13 | Canvas — estados (designaciones, par entrada-salida, supresión, layout interno) | 18 | 6 | 7 | 5 | 0 | 50.0% |
| 14 | Canvas — estilado visual de cosas, texto y enlaces | 15 | 0 | 0 | 15 | 0 | 0.0% |
| 15 | Canvas — enlaces avanzados (multiplicidad, rutas, XOR/O, condición/evento/NO, invocación) | 23 | 11 | 3 | 9 | 0 | 54.9% |
| 16 | Canvas — enlaces: propiedades, Tabla de Enlaces y estilo | 17 | 0 | 0 | 17 | 0 | 0.0% |
| 17 | Canvas — objetos avanzados (alias, unidad, descripción, URL, plegado parcial, designaciones de estado, duración) | 28 | 1 | 3 | 24 | 0 | 11.1% |
| 18 | Canvas — plegado parcial (vista compacta de refinadores intra-rectángulo) | 15 | 10 | 2 | 3 | 0 | 74.4% |
| 19 | Canvas — imágenes incrustadas en cosas (URL, pool, alternar imagen/texto, exportación) | 16 | 0 | 0 | 16 | 0 | 0.0% |
| 20 | Estructura — árbol OPD (navegación, orden, gestión, vistas derivadas) | 21 | 7 | 0 | 14 | 0 | 27.8% |
| 21 | Estructura — mapa del sistema (meta-vista gráfica del árbol de OPDs) | 18 | 0 | 0 | 18 | 0 | 0.0% |
| 30 | Persistencia — guardar/cargar, diálogos modales, versiones, archivado, búsqueda global, autosalvado | 34 | 4 | 5 | 25 | 0 | 14.6% |
| 31 | Persistencia — carpetas, jerarquía, permisos y navegación del workspace | 26 | 0 | 0 | 26 | 0 | 0.0% |
| 32 | Persistencia — sub-modelos (vistas de subsistema, archivos peer, composición cross-modelo) | 31 | 0 | 0 | 31 | 0 | 0.0% |
| 33 | Persistencia — plantillas (artefactos reutilizables, ámbitos Privado/Organizacional/Global) | 22 | 0 | 0 | 22 | 0 | 0.0% |
| 34 | Persistencia — creación de modelo nuevo (ruta simple + asistente de 12 etapas) | 28 | 0 | 0 | 28 | 0 | 0.0% |
| 35 | Persistencia — mover modelos y buscar cosas (Ctrl+F intra-modelo) | 20 | 0 | 0 | 20 | 0 | 0.0% |
| 40 | Colaboración — permisos de modelo, token de edición y auto-lectura desde carpeta | 25 | 0 | 0 | 0 | 25 | 0.0% |
| 41 | Colaboración — chat del modelo | 17 | 0 | 0 | 0 | 17 | 0.0% |
| 42 | Colaboración — notas adhesivas (anclaje, toggle, integración) | 22 | 0 | 0 | 22 | 0 | 0.0% |
| 50 | Panel OPL-ES — lente bimodal, edición inversa y sincronización con el canvas | 21 | 3 | 1 | 17 | 0 | 18.2% |
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
| 1C | Canvas — validaciones (interior/exterior, nombres duplicados, verificación metodológica, alcance de eliminación) | 17 | 3 | 4 | 10 | 0 | 35.4% |
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
| SHARED | Patrones transversales | 9 | 0 | 7 | 2 | 0 | 37.5% |

## Pendientes M0 inmediatos

- [HU-1C.004](../historias-usuario-v2/epicas/epica-1c-canvas-validaciones.md) — Crear cosa interna correcta directamente dentro del contenedor (M0, pendiente)
- [HU-11.001](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Crear cosa y sus partes en secuencia sobre el mismo OPD (M0, pendiente)
- [HU-11.004](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Fusionar múltiples enlaces de agregación en bus vertical único (M0, pendiente)
- [HU-11.014](../historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md) — Renombrar etiqueta del enlace [especializa HU-SHARED-004] (M0, pendiente)
- [HU-15.005](../historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md) — Definir etiqueta de ruta de texto libre sobre una rama a estado (M0, pendiente)
- [HU-15.007](../historias-usuario-v2/epicas/epica-15-canvas-enlaces-avanzados.md) — Verbalizar etiqueta de ruta en OPL-ES (`por ruta X...`) (M0, pendiente)
- [HU-20.015](../historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md) — Eliminar solo nodos hoja del árbol (M0, pendiente)
- [HU-20.016](../historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md) — Impedir eliminación de nodos internos con mensaje claro (M0, pendiente)
- [HU-30.001](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Abrir menú principal hamburguesa desde barra de herramientas (M0, pendiente)
- [HU-30.005](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Primer Guardar abre diálogo "Guardar como" (M0, pendiente)
- [HU-30.006](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Ingresar nombre del modelo en diálogo (M0, pendiente)
- [HU-30.009](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Navegar breadcrumb en diálogo modal (M0, pendiente)
- [HU-30.010](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Retroceder un nivel con botón Atrás o flecha "<" (M0, pendiente)
- [HU-30.013](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Guardar incremental con toast "guardado exitosamente" (M0, pendiente)
- [HU-30.015](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — "Guardar como" sobre modelo persistido (Nombre pre-cargado) (M0, pendiente)
- [HU-30.018](../historias-usuario-v2/epicas/epica-30-persistencia-save-load.md) — Abrir diálogo "Cargar Modelo" (M0, pendiente)
- [HU-34.001](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Activar "Nuevo Modelo" desde menú principal (M0, pendiente)
- [HU-34.004](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver pestaña inicial con literal "Modelo (No guardado)" (M0, pendiente)
- [HU-34.005](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver árbol OPD inicial con nodo único "SD" (M0, pendiente)
- [HU-34.006](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver lienzo OPD vacío tras "Nuevo Modelo" (M0, pendiente)
- [HU-34.007](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver panel OPL-ES vacío tras "Nuevo Modelo" (M0, pendiente)
- [HU-34.008](../historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md) — Ver biblioteca "Cosas arrastrables" vacía (M0, pendiente)
- [HU-50.002](../historias-usuario-v2/epicas/epica-50-opl-pane.md) — Numerar oraciones OPL-ES con prefijo ordinal (M0, pendiente)
- [HU-50.017](../historias-usuario-v2/epicas/epica-50-opl-pane.md) — Resaltar cruzado OPL-ES↔OPD al pasar el cursor (M0, pendiente)
- [HU-50.018](../historias-usuario-v2/epicas/epica-50-opl-pane.md) — Filtrar OPL-ES por selección activa en canvas (M0, pendiente)
- [HU-50.019](../historias-usuario-v2/epicas/epica-50-opl-pane.md) — Editar nombre de cosa por doble clic en OPL-ES (M0, pendiente)
- [HU-50.020](../historias-usuario-v2/epicas/epica-50-opl-pane.md) — Editar propiedades de enlace por doble clic en verbo (M0, pendiente)
- [HU-50.022](../historias-usuario-v2/epicas/epica-50-opl-pane.md) — Propagar edición OPL-ES al canvas en vivo (M0, pendiente)

## Brechas registradas

- HU-13.014 — Extremos Estado estan modelados, serializados y renderizados; falta gesto directo de creacion arrastrando al estado para cerrar la HU como cubierta.
- HU-15.010, HU-15.011 — Abanicos O/XOR tienen kernel, store, inspector y OPL; falta reemplazar el overlay textual por triangulo XOR y abrazadera O canonicos.
- HU-15.020 — Auto-invocacion con demora por defecto sigue pendiente; la ronda 3 cubre invocacion normal con demora opcional.

## Artefactos

- Dashboard: `docs/roadmap/hu-progress.html`
- Dataset completo: `docs/roadmap/hu-progress.json`
- Ledger editable: `docs/roadmap/hu-progress-evidence.json`

## Notas metodologicas

- Las HU absorbidas/fusionadas se excluyen del avance ponderado.
- `cubierto` pesa 1.0, `parcial` pesa 0.5 y `pendiente/diferido/bloqueado` pesa 0.
- El peso de una HU deriva de su tamano: XS=1, S=2, M=4, L=8, XL=13.
- La auditoria es conservadora: ausencia de evidencia exacta equivale a pendiente.
