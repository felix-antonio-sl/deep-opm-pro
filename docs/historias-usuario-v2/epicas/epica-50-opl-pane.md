---
epica: "EPICA-50"
titulo: "Panel OPL-ES — lente bimodal, edición inversa y sincronización con el canvas"
slug: "opl-pane"
doc_fuente: "opcloud-reverse/50-opl-pane.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 28
hu_canonicas: 21
hu_stubs: 7
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Lente textual canónica bimodal del modelo. La generación de oraciones se delega a HU-SHARED-007 (eco OPL); esta épica cubre el panel UI: numeración, edición inversa, resaltado cruzado, filtrado por selección, copia, exportación y búsqueda. Las HU de "verbalización" se canonizan en SHARED-007; aquí se conservan como stubs con especialización de plantilla.

## 2. Tabla de HU (resumen)

| ID | Título | Tipo | Estado |
|---|---|---|---|
| HU-50.001 | Renderizar panel OPL-ES persistente | opcloud-ui | canónica |
| HU-50.002–003 | Numeración de oraciones | opcloud-ui | canónica |
| HU-50.004–006 | Mover/minimizar/restaurar panel | opcloud-ui | canónica |
| HU-50.007–015 | Verbalizaciones por familia [absorbidas en HU-SHARED-007] | — | stub |
| HU-50.016 | Colorear tokens OPL-ES por clase | opm-semantica | canónica |
| HU-50.017 | Resaltar cruzado en hover | opcloud-ui | canónica |
| HU-50.018 | Filtrar por selección | opcloud-ui | canónica |
| HU-50.019 | Editar nombre por doble clic | opcloud-ui | canónica |
| HU-50.020 | Editar enlace por doble clic en verbo | opcloud-ui | canónica |
| HU-50.021 | Seleccionar enlace en oración multi-enlace | opcloud-ui | canónica |
| HU-50.022 | Propagar edición OPL-ES → canvas | mixto | canónica |
| HU-50.023 | Copiar OPL-ES al portapapeles | opcloud-ui | canónica |
| HU-50.024 | Exportar OPL-ES a HTML | opcloud-ui | canónica |
| HU-50.025 | Buscar texto en panel | opcloud-ui | canónica |
| HU-50.026 | Indentar oraciones por nivel de OPD | opcloud-ui | canónica |
| HU-50.027 | Expandir/colapsar bloques | opcloud-ui | canónica |
| HU-50.028 | Toggle AI Text para oraciones compuestas | opcloud-ui | canónica |

22 canónicas, 6 stubs.

## 3. HU canónicas

### HU-50.001 — Renderizar panel OPL-ES persistente en franja inferior
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Panel siempre visible. **Criterios:** ubicación: franja inferior (default) o lateral (HU-50.004). Altura redimensionable. **Patrones:** HU-SHARED-007. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [opl, panel].

### HU-50.002 — Numerar oraciones OPL-ES con prefijo ordinal
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Cada oración numerada `1.`, `2.`. **Criterios:** numeración global o por OPD según HU-50.026. **Deps:** HU-50.001. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [numeracion].

### HU-50.003 — Alternar numeración con toggle "123"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** On/off. **Criterios:** toggle visible. **Deps:** HU-50.002. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [toggle].

### HU-50.004 — Mover panel OPL-ES al panel lateral
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Reubicar panel. **Criterios:** botón cambia ubicación; se persiste por sesión. **Deps:** HU-50.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ui, layout].

### HU-50.005 — Minimizar panel OPL-ES y detener su render
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Apagar render para performance. **Criterios:** toggle minimiza; cuando minimizado, no se computa OPL. **Deps:** HU-50.001. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [performance].

### HU-50.006 — Restaurar panel OPL-ES desde barra colapsada
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Volver a abrir. **Criterios:** botón flotante restaura. **Deps:** HU-50.005. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-50.007 — Verbalizar esencia y afiliación de cada cosa [absorbida en HU-SHARED-007]
**Estado:** absorbida. **Canónica:** HU-SHARED-007. **Especialización:** plantillas [OPL-ES D1].

### HU-50.008 — Verbalizar enlace estructural "consiste en" [absorbida en HU-SHARED-007]
**Estado:** absorbida. **Canónica:** HU-SHARED-007.

### HU-50.009 — Verbalizar enlace estructural "exhibe" [absorbida en HU-SHARED-007]
**Estado:** absorbida. **Canónica:** HU-SHARED-007.

### HU-50.010 — Verbalizar enlaces procedurales [absorbida en HU-SHARED-007]
**Estado:** absorbida. **Canónica:** HU-SHARED-007. **Especialización:** plantillas [OPL-ES T1] [OPL-ES T2] [OPL-ES T3].

### HU-50.011 — Verbalizar estados de un objeto con estados [absorbida en HU-SHARED-007]
**Estado:** absorbida. **Canónica:** HU-SHARED-007. **Especialización:** plantilla [OPL-ES D8].

### HU-50.012 — Verbalizar descomposición síncrona [absorbida en HU-SHARED-007]
**Estado:** absorbida. **Canónica:** HU-SHARED-007 + HU-12.012. **Especialización:** plantilla [OPL-ES TS1].

### HU-50.013 — Verbalizar despliegue asíncrono "ocurren"
**Actor:** ME. **Tipo:** opm-semantica. **Nivel:** L. **Historia:** Como modelador experto, quiero que el OPL distinga el despliegue (ocurren / partes) de la descomposición (se descompone). **Criterios:** **Dado** despliegue de objeto, **cuando** OPL emite, **entonces** aparece: `**Objeto** se despliega en **Parte1** y **Parte2**.` [OPL-ES TS1]. **Patrones:** HU-SHARED-007. **Deps:** HU-17.028. **Evidencia:** [OPL-ES TS1]. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [opl, despliegue].

### HU-50.014 — Verbalizar despliegue de característica (exhibe) [absorbida en HU-SHARED-007]
**Estado:** absorbida. **Canónica:** HU-SHARED-007.

### HU-50.015 — Verbalizar especialización (es un/una)
**Actor:** ME. **Tipo:** opm-semantica. **Nivel:** L. **Historia:** OPL para generalización-especialización. **Criterios:** **Dado** enlace generalización, **cuando** emite, **entonces**: `**Subtipo** es un **Supertipo**.`. **Patrones:** HU-SHARED-007. **Evidencia:** [OPL-ES TS1]. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, especializacion].

### HU-50.016 — Colorear tokens OPL-ES por clase de cosa
**Actor:** MN. **Tipo:** mixto. **Nivel:** V. **Historia:** Color visual por tipo. **Criterios:** objetos en color verde lima `#70E483`, procesos en cyan `#3BC3FF`, estados en gris. [JOYAS §1] **Deps:** HU-50.001. **Evidencia:** [JOYAS §1]. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [render, color].

### HU-50.017 — Resaltar cruzado OPL-ES↔OPD al pasar el cursor
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Sincronización visual. **Criterios:** **Dado** apunto a token OPL-ES, **cuando** la acción termina, **entonces** la apariencia OPD correspondiente se resalta y viceversa. **Deps:** HU-50.001. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [render, sync].

### HU-50.018 — Filtrar OPL-ES por selección activa en canvas
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Mostrar solo oraciones de selección. **Criterios:** **Dado** selección, **cuando** activo "Filtrar por selección", **entonces** OPL-ES muestra solo oraciones que tocan los seleccionados. **Patrones:** HU-SHARED-008. **Deps:** HU-50.001. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [filtro].

### HU-50.019 — Editar nombre de cosa por doble clic en OPL-ES
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Edición inversa. **Criterios:** **Dado** doble clic en token nombre, **cuando** ingreso nuevo nombre, **entonces** se invoca HU-SHARED-004 con ese nombre. **Patrones:** HU-SHARED-004, HU-SHARED-007. **Deps:** HU-50.001. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [edicion-inversa].

### HU-50.020 — Editar propiedades de enlace por doble clic en verbo
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Edición inversa de enlace. **Criterios:** **Dado** doble clic en verbo, **cuando** abro propiedades, **entonces** se abre diálogo HU-11.013. **Patrones:** HU-SHARED-007. **Deps:** HU-50.001. **Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [edicion-inversa].

### HU-50.021 — Seleccionar enlace específico en oración multi-enlace
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Cuando hay varios enlaces en una oración, distinguir cuál se edita. **Criterios:** clic en token de enlace selecciona ese específico. **Deps:** HU-50.020. **Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [edicion-inversa].

### HU-50.022 — Propagar edición OPL-ES al canvas en vivo
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Bidireccionalidad efectiva. **Criterios:** **Dado** edito propiedad desde OPL-ES, **cuando** confirmo, **entonces** el canvas se actualiza en el siguiente frame. **Patrones:** HU-SHARED-007. **Deps:** HU-50.019, HU-50.020. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [sync, bidireccional].

### HU-50.023 — Copiar OPL-ES completo al portapapeles
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Llevarse OPL fuera. **Criterios:** botón "Copiar todo" → `navigator.clipboard.writeText`. **Deps:** HU-50.001. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [copiar].

### HU-50.024 — Exportar OPL-ES a archivo HTML
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** OPL como deliverable. **Criterios:** botón "Exportar HTML" descarga archivo con tipografía OPL preservada. **Deps:** HU-50.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [export].

### HU-50.025 — Buscar texto dentro del panel OPL-ES
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Encontrar oración por subcadena. **Criterios:** caja de búsqueda local. **Deps:** HU-50.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [busqueda].

### HU-50.026 — Indentar oraciones jerárquicamente por nivel de OPD
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Mostrar jerarquía. **Criterios:** **Dado** modelo con N niveles, **cuando** se renderiza, **entonces** las oraciones se indentan según `opd.profundidad`. **Deps:** HU-50.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [render, jerarquia].

### HU-50.027 — Expandir y colapsar bloques OPL-ES jerárquicos
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Foco en niveles. **Criterios:** flechas de colapso por bloque. **Deps:** HU-50.026. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [colapso].

### HU-50.028 — Activar "Toggle AI Text" para oraciones compuestas
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Generación de oraciones más naturales por IA. **Criterios:** toggle alterna entre OPL-ES canónico y versión IA enriquecida. **Modelo:** `[propuesta]` cache LLM. **Deps:** HU-50.001. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [ia, propuesta].

## 4. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q50.1 | ¿Edición inversa (HU-50.022) admite cambios estructurales o solo nombres/etiquetas? |
| Q50.2 | ¿Cómo se renderiza OPL cuando hay sub-modelos cargados? |

## 5. Referencias

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-004, HU-SHARED-007, HU-SHARED-008.
- Bloqueada por: EPICA-10, EPICA-11, EPICA-13, EPICA-12, EPICA-17.
