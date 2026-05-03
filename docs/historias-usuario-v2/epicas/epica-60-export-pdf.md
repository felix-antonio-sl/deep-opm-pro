---
epica: "EPICA-60"
titulo: "Exportar a PDF — pipeline papel, opciones, selección de OPDs, integración Compartir"
slug: "export-pdf"
doc_fuente: "opcloud-reverse/60-export-pdf.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "C"
hu_emitidas: 35
hu_canonicas: 35
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Generación de PDF papel con pipeline configurable: portada, índice, árbol OPD, sección "Diagramas y OPL" con rasterización por OPD, diccionario de elementos, relaciones. Toggles para incluir descripción, URL, OPL numerado, marca de agua, requirements. Selección granular de OPDs con árbol tri-state. Integración con "Compartir Modelo" (URL).

## 2. HU canónicas

### HU-60.001 — Activar "Exportar Modelo a PDF" desde menú principal "Exportar"
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Punto de entrada. **Criterios:** ítem "Exportar / PDF" abre modal HU-60.002. **Evidencia:** [V-0a]. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [export, ui].

### HU-60.002 — Abrir modal "Exportar a PDF" con configuración por defecto
**Actor:** RV. **Tipo:** mixto. **Nivel:** U. **Historia:** Modal con opciones. **Criterios:** todos los toggles default activos según preferencias. **Deps:** HU-60.001. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [modal].

### HU-60.003 — Pre-cargar "Nombre de archivo" con nombre del modelo
**Actor:** RV. **Tipo:** mixto. **Nivel:** P. **Historia:** Default sensible. **Criterios:** input pre-cargado con `modelo.nombre + ".pdf"`. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [export].

### HU-60.004 — Editar nombre de archivo antes de exportar
**Actor:** RV. **Tipo:** mixto. **Nivel:** P. **Historia:** Personalizar. **Criterios:** input editable. **Deps:** HU-60.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [export].

### HU-60.005 — Sanear nombre con caracteres especiales del modelo
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Filename válido. **Criterios:** caracteres `/<>:|` se sustituyen por `_`. **Deps:** HU-60.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [validacion].

### HU-60.006 — Indicador "La descarga puede tomar minutos"
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Manejar expectativa. **Criterios:** texto en modal. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-60.007 — Disparar generación con botón "Guardar"
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Ejecutar pipeline. **Criterios:** **Dado** clic en Guardar, **cuando** termina, **entonces** se genera PDF y se descarga. **Patrones:** HU-SHARED-002 (no necesario; export es no-mutating). **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [export, pipeline].

### HU-60.008 — Descargar PDF y abrirlo en pestaña externa
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Resultado tangible. **Criterios:** descarga + apertura. **Deps:** HU-60.007. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [descarga].

### HU-60.009 — Incluir URL del modelo en portada (toggle)
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Trazabilidad. **Criterios:** toggle controla inclusión. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [toggle].

### HU-60.010 — Incluir descripción de entidades (toggle)
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Documentación. **Criterios:** toggle. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [toggle].

### HU-60.011 — Incluir tooltips de procesos computacionales (toggle)
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Documentación de simulación. **Criterios:** toggle solo aparece con módulo simulación activo. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [toggle, simulacion].

### HU-60.012 — Numerar oraciones del OPL (toggle)
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Numeración en exporte. **Criterios:** toggle alineado con HU-50.003. **Evidencia:** [OPL-ES]. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [toggle, opl].

### HU-60.013 — Generar numeración OPL global continua
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Numeración global cross-OPD. **Criterios:** numeración continua entre OPDs (no reinicia por OPD). **Deps:** HU-60.012. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [opl, numeracion].

### HU-60.014 — Incluir Vistas de Requisitos (toggle)
**Actor:** AD. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Sección dedicada a requirements (EPICA-A1). **Criterios:** toggle activo solo si EPICA-A1 está activa. **Deps:** EPICA-A1. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [requirements].

### HU-60.015 — Incluir Diccionario de Elementos (toggle)
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Glosario al final. **Criterios:** toggle. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [toggle, diccionario].

### HU-60.016 — Agregar marca de agua "Confidencial" (toggle)
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Privacidad visual. **Criterios:** marca de agua diagonal en cada página. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [seguridad].

### HU-60.017 — Configurar resolución de OPDs como multiplicador
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Calidad ajustable. **Criterios:** dropdown 1×, 2×, 3×, 4×. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [resolucion].

### HU-60.018 — Abrir sub-modal "Seleccionar OPDs"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Granularidad. **Criterios:** botón abre sub-modal con árbol de OPDs. **Deps:** HU-60.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [seleccion, modal].

### HU-60.019 — Ver árbol jerárquico tri-state de OPDs
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Árbol con marcado. **Criterios:** cada nodo tiene checkbox tri-state (marcado / parcial / sin marcar). **Deps:** HU-60.018. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [tri-state, arbol].

### HU-60.020 — Alternar marca individual de OPD con clic
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Selección granular. **Criterios:** clic alterna. **Deps:** HU-60.019. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [seleccion].

### HU-60.021 — Alternar todos los hijos con doble clic en padre
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Acelerar selección. **Criterios:** doble clic propaga a descendientes. **Deps:** HU-60.019. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [seleccion, batch].

### HU-60.022 — Ver estado semi-marcado del padre cuando hijos parciales
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Visual tri-state. **Criterios:** indicador visual de "parcial". **Deps:** HU-60.019. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [tri-state, render].

### HU-60.023 — Confirmar selección con botón "Aplicar"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Cerrar sub-modal. **Criterios:** botón aplica y cierra. **Deps:** HU-60.018. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [confirmar].

### HU-60.024 — Descartar selección con botón "Cancelar"
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Salir sin guardar selección. **Criterios:** ESC o botón. **Deps:** HU-60.018. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-60.025 — Generar portada con metadata del modelo
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** Página inicial. **Criterios:** título, fecha, autor, organización, URL si toggle. **Evidencia:** [V-0a]. **Deps:** HU-60.007. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [portada].

### HU-60.026 — Generar Tabla de Contenidos
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Navegabilidad. **Criterios:** TOC con secciones. **Deps:** HU-60.007. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [toc].

### HU-60.027 — Generar sección "Árbol OPD" con indentación textual
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** Reflejar jerarquía. **Criterios:** lista indentada de OPDs. **Evidencia:** [V-0a]. **Deps:** HU-60.007. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [arbol].

### HU-60.028 — Generar sección "Diagramas y OPL" con rasterización por OPD
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** Cada OPD como imagen + OPL textual. **Criterios:** **Dado** OPD seleccionado, **cuando** se rasteriza, **entonces** se inserta como imagen junto a sus oraciones OPL-ES. **Evidencia:** [V-0a], [V-1]. **Deps:** HU-60.007, HU-60.017. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [rasterizacion, opl].

### HU-60.029 — Generar Diccionario con cromatismo textual por clase
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Glosario con colores. **Criterios:** entrada por entidad con su nombre coloreado según tipo. **Deps:** HU-60.015. **Evidencia:** [V-0a]. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [diccionario].

### HU-60.030 — Generar sección "Relaciones" con agrupación por tipo
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Tabla de enlaces agrupada. **Criterios:** sección con enlaces agrupados por `enlace.tipo`. **Deps:** HU-60.007. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [relaciones].

### HU-60.031 — Preservar convenciones visuales canvas↔PDF
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** V. **Historia:** Fidelidad visual. **Criterios:** colores SSOT, sombreado físico, borde discontinuo ambiental. **Evidencia:** [V-124], [V-63], [V-1]. [JOYAS §1, §8]. **Deps:** HU-60.028. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [render, fidelidad].

### HU-60.032 — Abrir modal "Compartir Modelo" con URL copiable
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Compartir. **Criterios:** botón → modal con URL. **Deps:** HU-30.018. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [share].

### HU-60.033 — Copiar URL al portapapeles con botón "Copiar"
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Copiar URL. **Criterios:** botón → clipboard + toast. **Deps:** HU-60.032. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [copiar].

### HU-60.034 — Incluir OPD activo en URL compartida (toggle)
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Deep link al OPD. **Criterios:** toggle agrega `?opdId=X` a URL. **Deps:** HU-60.032. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [share, deeplink].

### HU-60.035 — Abrir "Compartir" desde botón paper-plane de barra principal
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Acceso rápido. **Criterios:** botón en barra. **Deps:** HU-60.032. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [ui, share].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q60.1 | ¿Generación PDF en cliente (jsPDF) o servidor? |
| Q60.2 | ¿Marca de agua configurable o solo "Confidencial"? |
| Q60.3 | ¿OPL en PDF respeta tipografía SSOT (negrita/cursiva/monoespaciado)? |

## 4. Referencias

- Patrones: HU-SHARED-007.
- Bloqueada por: EPICA-50, EPICA-30.
