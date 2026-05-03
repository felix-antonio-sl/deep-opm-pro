---
epica: "EPICA-30"
titulo: "Persistencia — guardar/cargar, diálogos modales, versiones, archivado, búsqueda global, autosalvado"
slug: "persistencia-save-load"
doc_fuente: "opcloud-reverse/30-persistencia-save-load.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 37
hu_canonicas: 34
hu_stubs: 3
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Cornerstone de persistencia: guardar/cargar modelo (primero como "Guardar como"), diálogos modales con grid de modelos recientes, versiones con política de retención log-scale, archivado, búsqueda global, autosalvado cada 5 minutos, y vista alterna tiles/lista. La SSOT no prescribe persistencia; toda la épica es UI heredado de OPCloud salvo el invariante `entidad/apariencia/enlace/opd/modelo` íntegro al serializar.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo |
|---|---|---|---|---|---|
| HU-30.001 | Abrir menú principal hamburguesa | MN | M0 | XS | opcloud-ui |
| HU-30.002 | Ver botón Guardar (disco) en barra principal | MN | M0 | XS | opcloud-ui |
| HU-30.003 | Ver botón Cargar (carpeta) en barra principal | MN | M0 | XS | opcloud-ui |
| HU-30.004 | Ver pestaña "Modelo (No guardado)" antes del primer guardado [absorbida en HU-SHARED-006] | — | — | — | — |
| HU-30.005 | Primer Guardar abre diálogo "Guardar como" | MN | M0 | M | opcloud-ui |
| HU-30.006 | Ingresar nombre del modelo en diálogo | MN | M0 | S | opcloud-ui |
| HU-30.007 | Ingresar descripción opcional | MN | S | XS | opcloud-ui |
| HU-30.008 | Persistir payload OPM íntegro al guardar | MN | M0 | L | mixto |
| HU-30.009 | Navegar breadcrumb en diálogo modal | MN | M0 | S | opcloud-ui |
| HU-30.010 | Retroceder un nivel con flecha "<" | MN | M0 | XS | opcloud-ui |
| HU-30.011 | Ver grid "Modelos Recientes" en diálogo | ME | M1 | S | opcloud-ui |
| HU-30.012 | Ver canvas como telón oscurecido durante diálogo | MN | M1 | XS | opcloud-ui |
| HU-30.013 | Guardar incremental con toast "guardado exitosamente" | MN | M0 | S | mixto |
| HU-30.014 | Ctrl+S dispara guardado | ME | M0 | XS | mixto |
| HU-30.015 | "Guardar como" sobre modelo persistido | ME | M0 | M | opcloud-ui |
| HU-30.016 | Renombrar modelo existente sin Guardar como | ME | M1 | S | opcloud-ui |
| HU-30.017 | Crear modelo nuevo desde "Nuevo Modelo" | MN | M0 | S | mixto |
| HU-30.018 | Abrir diálogo "Cargar Modelo" | MN | M0 | S | opcloud-ui |
| HU-30.019 | Cargar modelo con doble clic en tile | MN | M0 | S | mixto |
| HU-30.020 | Cargar modelo con clic + botón "Cargar" | MN | M0 | XS | opcloud-ui |
| HU-30.021 | Cargar Ejemplo Global | RV | S | M | opcloud-ui |
| HU-30.022 | Cargar Ejemplo Organizacional | AO | S | M | opcloud-ui |
| HU-30.023 | Activar toggle "Mostrar Versiones" | ME | M1 | M | opcloud-ui |
| HU-30.024 | Aplicar política log-scale (10/día, 1/sem, 1/mes, máx 12) | ME | M1 | L | opcloud-ui |
| HU-30.025 | Activar toggle "Mostrar Archivados" | ME | M1 | M | opcloud-ui |
| HU-30.026 | Auto-archivar modelo no abierto durante 90 días | AO | S | M | opcloud-ui |
| HU-30.027 | Restaurar modelo archivado | ME | S | S | opcloud-ui |
| HU-30.028 | Buscar modelos por nombre (filtro local) | ME | M1 | S | opcloud-ui |
| HU-30.029 | "Incluir todas las subcarpetas" para búsqueda global con 3+ caracteres | ME | M1 | M | opcloud-ui |
| HU-30.030 | Crear carpeta nueva [absorbida en HU-31.007] | — | — | — | — |
| HU-30.031 | Renombrar carpeta seleccionada [absorbida en HU-31.009] | — | — | — | — |
| HU-30.032 | Alternar vista tiles vs lista | ME | S | S | opcloud-ui |
| HU-30.033 | Ordenar vista lista por columna | ME | S | S | opcloud-ui |
| HU-30.034 | Ver glifos editable/candado/autosalvado en tiles | MN | M1 | S | opcloud-ui |
| HU-30.035 | Autosalvado cada 5 minutos con glifo circular | ME | S | M | opcloud-ui |
| HU-30.036 | Redirigir Guardar a "Guardar como" en read-only [especializa HU-SHARED-003] | RV | S | S | opcloud-ui |
| HU-30.037 | Cancelar diálogo modal con Cancelar o ESC | MN | M0 | XS | mixto |

35 canónicas, 2 stubs. (Otras 4 HU absorbidas en patrones shared y EPICA-31.)

## 3. Historias de usuario

### HU-30.001 — Abrir menú principal hamburguesa desde barra de herramientas

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero un punto de acceso al menú principal con todas las acciones de archivo.
**Criterios:** **Dado** clic en icono hamburguesa, **cuando** se abre, **entonces** muestra Nuevo, Guardar, Guardar como, Cargar, Exportar, etc.
**Deps:** ninguna. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui, menu].

---

### HU-30.002 — Ver botón Guardar (disco) en barra principal

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero un botón visible para guardar sin abrir menú.
**Criterios:** icono disco siempre visible. Tooltip "Guardar (Ctrl+S)".
**Deps:** ninguna. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui, atajo].

---

### HU-30.003 — Ver botón Cargar (carpeta) en barra principal

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero un botón visible para cargar.
**Criterios:** icono carpeta abre diálogo "Cargar".
**Deps:** ninguna. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui].

---

### HU-30.004 — Ver pestaña "Modelo (No guardado)" [absorbida en HU-SHARED-006]

**Estado:** absorbida. **Canónica:** HU-SHARED-006.

---

### HU-30.005 — Primer Guardar abre diálogo "Guardar como"

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero que el primer Guardar pida nombre y carpeta.
**Criterios:** **Dado** modelo nuevo, **cuando** clico Guardar, **entonces** se abre diálogo modal con campos Nombre, Descripción y navegador de carpetas.
**Modelo:** UI transitoria + creación de `modelo.id`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-30.002. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [persistencia, dialogo].

---

### HU-30.006 — Ingresar nombre del modelo en diálogo

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero nombrar mi modelo.
**Criterios:** input texto con validación de unicidad por carpeta.
**Modelo:** `modelo.nombre`. **Deps:** Bloqueada por HU-30.005.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [persistencia, nombre].

---

### HU-30.007 — Ingresar descripción opcional

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero documentar el modelo con descripción.
**Criterios:** textarea opcional.
**Modelo:** `modelo.descripcion` `[propuesta]`. **Deps:** Bloqueada por HU-30.005.
**Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [persistencia, descripcion].

---

### HU-30.008 — Persistir payload OPM íntegro al guardar (layout, stroke, dash, alias)

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** P primario.
**Historia:** Como modelador, quiero que todo el modelo se serialice (entidades, apariencias, enlaces, OPDs, estados, estilos, alias) sin pérdida.
**Criterios:** **Dado** Guardar, **cuando** termina, **entonces** el snapshot incluye `modelo.entidades`, `modelo.opds`, `modelo.enlaces` y todas las propiedades visuales (`apariencia.estilo`, `enlace.estilo`).
**Modelo:** `modelo.*` íntegro. **Patrones:** HU-SHARED-006.
**Deps:** Bloqueada por HU-30.005. **Prioridad:** M0. **Tamaño:** L. **Etiquetas:** [persistencia, integridad].

---

### HU-30.009 — Navegar breadcrumb en diálogo modal

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero ver dónde estoy en la jerarquía y saltar a niveles superiores.
**Criterios:** breadcrumb tipo `Home / Carpeta1 / Carpeta2`. Clic en segmento navega a ese nivel.
**Deps:** Bloqueada por HU-30.005. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [ui, navegacion].

---

### HU-30.010 — Retroceder un nivel con botón Atrás o flecha "<"

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero retroceder un nivel sin tener que clicar en breadcrumb.
**Criterios:** flecha "<" navega al padre.
**Deps:** Bloqueada por HU-30.009. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui, navegacion].

---

### HU-30.011 — Ver grid "Modelos Recientes" siempre visible

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador experto, quiero ver mis últimos modelos abiertos.
**Criterios:** grid lateral con últimos 10 modelos.
**Deps:** Bloqueada por HU-30.018. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, recientes].

---

### HU-30.012 — Ver canvas oscurecido como telón

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero ver el canvas atenuado durante el diálogo modal para preservar contexto sin distraer.
**Criterios:** overlay con opacidad 40-60%.
**Deps:** Bloqueada por HU-30.005. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [ui, modal].

---

### HU-30.013 — Guardar incremental con toast "guardado exitosamente"

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** P.
**Historia:** Como modelador, quiero confirmación visible de cada guardado.
**Criterios:** **Dado** Guardar exitoso, **cuando** termina, **entonces** toast 2s. **Patrones:** HU-SHARED-006.
**Deps:** Bloqueada por HU-30.005. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [ui, feedback].

---

### HU-30.014 — Ctrl+S dispara guardado equivalente al botón

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** U.
**Historia:** Como modelador experto, quiero el atajo Ctrl+S.
**Criterios:** **Dado** Ctrl+S (o Cmd+S en macOS), **cuando** la acción termina, **entonces** equivale a clic en botón Guardar.
**Patrones:** HU-SHARED-002, HU-SHARED-003. **Deps:** Bloqueada por HU-30.002.
**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [atajo].

---

### HU-30.015 — "Guardar como" sobre modelo persistido (Nombre pre-cargado)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador experto, quiero clonar un modelo existente con otro nombre/carpeta.
**Criterios:** **Dado** modelo abierto, **cuando** elijo "Guardar como", **entonces** se abre diálogo con nombre actual pre-cargado para edición.
**Modelo:** crea `modelo` nuevo con copia profunda. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-30.005. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [persistencia, clonar].

---

### HU-30.016 — Renombrar modelo existente con "Renombrar" sin Guardar como

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador experto, quiero solo cambiar el nombre sin clonar.
**Criterios:** menú contextual del modelo en diálogo "Cargar" → "Renombrar".
**Modelo:** `modelo.nombre`. **Patrones:** HU-SHARED-004 (validación), HU-SHARED-001.

**Deps:** Bloqueada por HU-30.018. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [renombrar].

---

### HU-30.017 — Crear modelo nuevo desde "Nuevo Modelo"

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** P.
**Historia:** Como modelador, quiero un canvas en blanco para empezar de cero.
**Criterios:** **Dado** "Nuevo Modelo" en menú, **cuando** clico, **entonces** se abre nueva pestaña con canvas vacío y SD raíz.
**Modelo:** `modelo.id`, `modelo.opdRaizId`. **Deps:** ver EPICA-34.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [persistencia, nuevo].

---

### HU-30.018 — Abrir diálogo "Cargar Modelo"

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero abrir diálogo de carga.
**Criterios:** clic en botón Cargar (HU-30.003) abre diálogo modal con tiles + grid de recientes.
**Deps:** Bloqueada por HU-30.003. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [ui, dialogo].

---

### HU-30.019 — Cargar modelo con doble clic sobre tile

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** P.
**Historia:** Como modelador, quiero cargar con doble clic.
**Criterios:** **Dado** diálogo Cargar, **cuando** doble clic en tile, **entonces** el modelo se carga en pestaña actual o nueva (Q30.1).
**Modelo:** `modelo.*`. **Patrones:** HU-SHARED-006.
**Deps:** Bloqueada por HU-30.018. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [carga].

---

### HU-30.020 — Cargar modelo con clic + botón "Cargar"

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero alternativa al doble clic.
**Criterios:** clic seleccciona; botón Cargar confirma.
**Deps:** Bloqueada por HU-30.018. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui].

---

### HU-30.021 — Cargar Ejemplo Global

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como revisor, quiero ver ejemplos predefinidos globales.
**Criterios:** sub-menú "Ejemplos / Global" con modelos de muestra.
**Deps:** Bloqueada por HU-30.018. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ejemplos].

---

### HU-30.022 — Cargar Ejemplo Organizacional

**Actor primario:** AO. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como administrador organizacional, quiero ver ejemplos curados de mi org.
**Criterios:** sub-menú "Ejemplos / Organización".
**Deps:** Bloqueada por HU-30.018. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ejemplos, org].

---

### HU-30.023 — Activar toggle "Mostrar Versiones"

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador experto, quiero ver carpetas `<Modelo> Versiones` cuando lo necesite.
**Criterios:** toggle en diálogo Cargar; al activarlo aparecen carpetas de versiones.
**Modelo:** `modelo.versiones` `[propuesta]`.
**Deps:** Bloqueada por HU-30.018. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [versiones].

---

### HU-30.024 — Aplicar política log-scale (10/día, 1/sem, 1/mes, máx 12)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero política de retención inteligente: muchas versiones recientes, pocas antiguas.
**Criterios:** retención: hasta 10 versiones del último día, 7 semanales, 12 mensuales máximo.
**Modelo:** `modelo.politicaRetencion` `[propuesta]`.
**Deps:** Bloqueada por HU-30.023. **Prioridad:** M1. **Tamaño:** L. **Etiquetas:** [retencion, politica].

---

### HU-30.025 — Activar toggle "Mostrar Archivados"

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero ver modelos archivados cuando los necesite.
**Criterios:** toggle muestra modelos con `modelo.archivado = true` `[propuesta]` y columna "Archivado".
**Deps:** Bloqueada por HU-30.018. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [archivado].

---

### HU-30.026 — Auto-archivar modelo no abierto durante 90 días

**Actor primario:** AO. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como administrador, quiero archivar modelos sin actividad para mantener orden.
**Criterios:** job que marca `archivado = true` cuando `ultimaApertura > 90 días`.
**Modelo:** `modelo.archivado`, `modelo.ultimaApertura`.
**Deps:** Bloqueada por HU-30.025. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [archivado, automatico].

---

### HU-30.027 — Restaurar modelo archivado

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero des-archivar.
**Criterios:** botón "Restaurar" cambia `archivado = false`.
**Deps:** Bloqueada por HU-30.025. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [archivado].

---

### HU-30.028 — Buscar modelos por nombre (filtro local)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero filtrar la lista por subcadena.
**Criterios:** caja de búsqueda filtra en vivo.
**Deps:** Bloqueada por HU-30.018. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [busqueda].

---

### HU-30.029 — "Incluir todas las subcarpetas" para búsqueda global con 3+ caracteres

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero buscar globalmente cuando estoy navegando una carpeta específica.
**Criterios:** checkbox "incluir subcarpetas"; activado solo con ≥3 caracteres en búsqueda.
**Deps:** Bloqueada por HU-30.028. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [busqueda, global].

---

### HU-30.030 — Crear carpeta nueva [absorbida en HU-31.007]

**Estado:** absorbida. **Canónica:** HU-31.007.

---

### HU-30.031 — Renombrar carpeta seleccionada [absorbida en HU-31.009]

**Estado:** absorbida. **Canónica:** HU-31.009.

---

### HU-30.032 — Alternar vista tiles vs lista

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero alternar entre vista tiles y lista detallada.
**Criterios:** toggle en cabecera del diálogo.
**Deps:** Bloqueada por HU-30.018. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, vista].

---

### HU-30.033 — Ordenar vista lista por columna (Modelo/Descripción/Fecha/Autor)

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero ordenar por cualquier columna.
**Criterios:** clic en encabezado alterna asc/desc.
**Deps:** Bloqueada por HU-30.032. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ordenar].

---

### HU-30.034 — Ver glifos editable/candado/autosalvado en tiles

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** V.
**Historia:** Como modelador, quiero distinguir visualmente: editable (icono lápiz), read-only (candado), autosalvado activo (flechas circulares).
**Criterios:** glifos según permisos y estado.
 **Patrones:** HU-SHARED-003 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-30.018. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [render, glifos].

---

### HU-30.035 — Autosalvado cada 5 minutos con glifo de flechas circulares

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como modelador, quiero autosalvado periódico para no perder progreso.
**Criterios:**
- **Dado** modelo dirty, **cuando** transcurren 5 minutos, **entonces** se ejecuta save automático y `dirty = false` (HU-SHARED-006).
- **Dado** que se ejecuta autosalvado, **cuando** termina, **entonces** se muestra glifo circular durante la operación.
**Modelo:** `modelo.autosalvado`. **Patrones:** HU-SHARED-006.
**Deps:** Bloqueada por HU-30.013. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [autosalvado].

---

### HU-30.036 — Redirigir Guardar a "Guardar como" en modelo de solo lectura [especializa HU-SHARED-003]

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** P.
**Historia:** Como revisor, quiero que Guardar me ofrezca clonar a uno propio cuando no tengo escritura.
**Criterios:** **Dado** read-only, **cuando** intento Guardar, **entonces** se abre "Guardar como" en lugar de bloquear.
**Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-30.005, HU-SHARED-003.
**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [permisos, clonar].

---

### HU-30.037 — Cancelar diálogo modal con Cancelar o ESC sin persistir

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** U.
**Historia:** Como modelador, quiero cerrar diálogos sin guardar nada.
**Criterios:** botón Cancelar y tecla ESC cierran sin efectos.
**Deps:** Bloqueada por HU-30.005, HU-30.018. **Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui, cancelar].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q30.1 | ¿Cargar reemplaza pestaña actual o abre nueva? | HU-30.019 |
| Q30.2 | Política exacta de cuándo se purgan versiones bajo log-scale. | HU-30.024 |
| Q30.3 | Frecuencia de autosalvado: ¿siempre 5 min o configurable? | HU-30.035 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-004, HU-SHARED-006.
- Bloquea a: EPICA-31, EPICA-32, EPICA-33, EPICA-34, EPICA-35, todas las épicas que requieren persistencia.
