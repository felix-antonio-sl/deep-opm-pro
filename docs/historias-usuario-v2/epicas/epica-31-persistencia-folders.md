---
epica: "EPICA-31"
titulo: "Persistencia — carpetas, jerarquía, permisos y navegación del workspace"
slug: "persistencia-folders"
doc_fuente: "opcloud-reverse/31-persistencia-folders.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 26
hu_canonicas: 26
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Workspace jerárquico de carpetas con matriz de permisos O/W/R (Owner/Writer/Reader), navegación, cortar-pegar, drag-and-drop, y reglas de unión de permisos al mover entre carpetas. Multi-usuario; en single-user MVP solo se necesita la jerarquía (sin permisos).

## 2. HU canónicas (resumen denso)

Cada HU sigue el formato canónico con: actor, tipo, nivel, historia, 1-3 criterios concretos, modelo de datos, patrones, dependencias, prioridad, tamaño, etiquetas.

### HU-31.001 — Abrir diálogo "Cargar Modelo" desde menú principal
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** atajo a HU-30.018. **Criterios:** clic en menú abre HU-30.018. **Deps:** Bloqueada por HU-30.018. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [ui].

### HU-31.002 — Ver "Home" con Modelos Recientes y lista de carpetas
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Como modelador, quiero ver Home como vista raíz al abrir Cargar. **Criterios:** **Dado** Home, **cuando** se renderiza, **entonces** muestra Modelos Recientes y carpetas de primer nivel. **Deps:** Bloqueada por HU-30.018. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [home, navegacion].

### HU-31.003 — Seleccionar carpeta con clic simple
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Activar acciones de menú al seleccionar. **Criterios:** clic resalta y habilita botones. **Deps:** Bloqueada por HU-31.002. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [seleccion].

### HU-31.004 — Abrir carpeta con doble clic o botón "Abrir"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Navegar al interior. **Criterios:** doble clic o botón Abrir entran a la carpeta y actualizan breadcrumb. **Deps:** Bloqueada por HU-31.003. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [navegacion].

### HU-31.005 — Navegar hacia arriba con flecha back en breadcrumb
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Volver al padre. **Criterios:** flecha "←" navega al padre. **Deps:** Bloqueada por HU-31.004. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [navegacion].

### HU-31.006 — Ver breadcrumb con ruta completa
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Ver dónde estoy. **Criterios:** breadcrumb `Home / A / B / C` siempre visible. **Deps:** Bloqueada por HU-31.004. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [breadcrumb].

### HU-31.007 — Crear carpeta nueva con "Nueva Carpeta" e input inline
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Como modelador experto, quiero crear carpeta sin abandonar el flujo. **Criterios:** **Dado** botón "Nueva Carpeta", **cuando** clico, **entonces** aparece input inline para nombre. Confirmar crea `carpeta` y enfoca dentro de la nueva. **Modelo:** `[propuesta]` `carpeta.id`, `carpeta.nombre`, `carpeta.padreId`. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-31.004. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [crear, carpeta, propuesta].

### HU-31.008 — Restringir creación en Home a admins
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Solo admins pueden crear carpetas en Home. **Criterios:** **Dado** usuario sin rol AO en Home, **cuando** intenta crear, **entonces** botón está oculto/deshabilitado. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-31.007. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [permisos, admin].

### HU-31.009 — Renombrar carpeta seleccionada [especializa HU-SHARED-004]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Cambiar nombre. **Criterios:** ver HU-SHARED-004 con scope = carpeta; unicidad por carpeta padre. **Modelo:** `carpeta.nombre`. **Patrones:** HU-SHARED-004. **Deps:** Bloqueada por HU-31.007. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [renombrar].

### HU-31.010 — Eliminar carpeta con confirmación [especializa HU-SHARED-005]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Eliminar carpeta vacía o con cascada. **Criterios:** **Dado** carpeta con N modelos, **cuando** elimino, **entonces** se pide confirmación; cascada o bloqueo según contenido. **Patrones:** HU-SHARED-005. **Deps:** Bloqueada por HU-31.007. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [eliminar].

### HU-31.011 — Cortar carpeta con "Cortar Carpeta"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Reorganizar mediante cortar/pegar. **Criterios:** menú contextual "Cortar"; carpeta se marca como pendiente. **Modelo:** `ui.portapapelesCarpeta` `[propuesta]`.  **Patrones:** HU-SHARED-001 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-31.007. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [cut].

### HU-31.012 — Pegar carpeta cortada en destino
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Completar el cortar. **Criterios:** **Dado** portapapeles activo, **cuando** elijo "Pegar" en otra carpeta, **entonces** la carpeta se mueve. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-31.011. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [paste].

### HU-31.013 — Mover carpeta con drag-and-drop directo
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Alternativa al cut/paste. **Criterios:** arrastrar carpeta a otra mueve directamente. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-31.007. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [drag, mover].

### HU-31.014 — Unir permisos al mover carpeta entre destinos
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Como admin, quiero que mover una carpeta resuelva permisos de forma predecible. **Criterios:** **Dado** carpeta movida, **cuando** termina, **entonces** los permisos efectivos = unión de los previos + los heredados del nuevo padre, con resolución del más restrictivo en caso de conflicto. **Modelo:** `carpeta.permisos`. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-31.013. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [permisos, mover].

### HU-31.015 — Abrir diálogo modal "Permisos de Carpeta"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Configurar permisos. **Criterios:** menú contextual abre modal con matriz O/W/R.  **Patrones:** HU-SHARED-001 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-31.007. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [permisos, dialogo].

### HU-31.016 — Ver matriz O/W/R con "All Organization Users"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Ver permisos de todos a la vez. **Criterios:** matriz con fila "All Organization Users" y columnas O/W/R. **Deps:** Bloqueada por HU-31.015. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [permisos, matriz].

### HU-31.017 — Ver Groups como filas expandibles
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Filtrar por grupo. **Criterios:** filas con flecha expandible. **Deps:** Bloqueada por HU-31.016. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [grupos].

### HU-31.018 — Expandir grupo para ver usuarios individuales
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Granularidad por usuario. **Criterios:** clic en flecha expande lista. **Deps:** Bloqueada por HU-31.017. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [usuarios].

### HU-31.019 — Activar "Permiso de Lectura Automático del Modelo" en carpeta
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Como admin, quiero que todos los modelos de la carpeta hereden lectura automáticamente. **Criterios:** checkbox propaga lectura a todos los modelos descendientes. **Modelo:** `carpeta.lecturaAutomatica`. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-31.015. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [permisos, propagacion].

### HU-31.020 — Guardar cambios de permisos con toast de éxito
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Confirmación visible. **Criterios:** botón "Guardar" persiste y muestra toast. **Deps:** Bloqueada por HU-31.015. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [guardar, feedback].

### HU-31.021 — Ver permisos vigentes con tooltip al apuntar
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Ver derechos efectivos sin abrir modal. **Criterios:** tooltip sobre carpeta lista permisos efectivos. **Deps:** Bloqueada por HU-31.015. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [tooltip].

### HU-31.022 — Alternar entre vista iconos y vista detallada
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Dos modos de visualización. **Criterios:** toggle. **Deps:** Bloqueada por HU-31.002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [vista].

### HU-31.023 — Ordenar columnas en vista detallada
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Ver HU-30.033 para modelos. **Criterios:** clic en encabezado alterna asc/desc. **Deps:** Bloqueada por HU-31.022. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ordenar].

### HU-31.024 — Ver carpeta "Compartida" con icono azul diferenciado
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Distinguir carpetas compartidas. **Criterios:** icono azul si la carpeta tiene permisos para múltiples usuarios. **Deps:** Bloqueada por HU-31.015. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render, compartido].

### HU-31.025 — Ver modelo con candado cuando falta permiso [especializa HU-SHARED-003]
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Visibilizar read-only. **Criterios:** icono candado cuando solo lectura. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-31.015. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [render, permisos].

### HU-31.026 — Ver menú contextual por clic derecho sobre carpeta [especializa HU-SHARED-001]
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Acceso rápido a operaciones. **Criterios:** ver HU-SHARED-001 con contexto = carpeta. Acciones: Abrir, Renombrar, Eliminar, Cortar, Permisos. **Patrones:** HU-SHARED-001. **Deps:** Bloqueada por HU-SHARED-001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [menu-contextual].

## 3. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q31.1 | ¿Cuál es la unidad mínima de permiso (carpeta, modelo, OPD)? | HU-31.014 |
| Q31.2 | ¿Mover carpeta con muchos modelos requiere confirmación adicional? | HU-31.013 |

## 4. Referencias cruzadas

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-004, HU-SHARED-005.
- Bloqueada por: EPICA-30. Bloquea a: EPICA-32, EPICA-33, EPICA-35, EPICA-40, EPICA-80.
