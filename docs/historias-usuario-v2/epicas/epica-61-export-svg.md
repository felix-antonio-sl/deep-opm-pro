---
epica: "EPICA-61"
titulo: "Exportar SVG — exportar diagramas OPD como imágenes vectoriales"
slug: "export-svg"
doc_fuente: "opcloud-reverse/61-export-svg.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "C"
hu_emitidas: 26
hu_canonicas: 26
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Exporte vectorial de OPDs: SVG (preferido) y JPEG (raster). SVG preserva colores SSOT, drop-shadow físico, metadata OPM en atributos XML, y OPL como comentario. Compatible con Inkscape e Illustrator. Tres scopes: OPD activo, árbol completo, solo SD.

## 2. HU canónicas

### HU-61.001 — Acceder a "Exportar Diagramas" desde sub-menú "Exportar"
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Punto de entrada. **Criterios:** ítem en menú. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [export, ui].

### HU-61.002 — Listar tres salidas del sub-menú "Exportar" (PDF/SVG/Otro)
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Tres opciones. **Criterios:** sub-menú con PDF, SVG y otros. **Deps:** HU-61.001. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [menu].

### HU-61.003 — Abrir modal "Exportar Diagramas" con defaults seguros
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Modal con configuración. **Criterios:** defaults: SVG, OPD activo. **Deps:** HU-61.001. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [modal].

### HU-61.004 — Editar nombre de archivo propuesto
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Personalizar. **Criterios:** input editable. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export].

### HU-61.005 — Derivar nombre del OPD activo
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Default sensible. **Criterios:** `<opd.nombre>.svg`. **Deps:** HU-61.004. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [default].

### HU-61.006 — Alternar formato entre JPEG y SVG con selector
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Vector vs raster. **Criterios:** segment control. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [formato].

### HU-61.007 — Ocultar campo "Resolución de imagen" cuando formato es SVG
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Coherencia UI. **Criterios:** campo invisible si SVG (vector no requiere resolución). **Deps:** HU-61.006. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-61.008 — Exportar OPD actual como un solo archivo SVG
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** Scope OPD activo. **Criterios:** **Dado** scope = "OPD actual", **cuando** confirmo, **entonces** se descarga `.svg` con todas las apariencias del OPD. **Evidencia:** [V-0a]. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [export, scope].

### HU-61.009 — Exportar árbol completo como paquete SVG
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Scope todo el árbol. **Criterios:** ZIP con un SVG por OPD. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [batch].

### HU-61.010 — Exportar solo el SD como SVG
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** Scope SD solo. **Criterios:** un SVG con el OPD raíz. **Evidencia:** [V-0a]. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [scope, sd].

### HU-61.011 — Cancelar modal con ESC o clic fuera
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Cancelar. **Criterios:** estándar. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-61.012 — Incluir tooltips de procesos computacionales como decoración SVG
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** Para simulación. **Criterios:** elementos `<title>` en SVG con tooltips. **Evidencia:** [V-0a], [Glos 3.58]. **Deps:** HU-61.008, EPICA-B1. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [simulacion].

### HU-61.013 — Generar SVG con viewBox ajustado al bounding box
**Actor:** RV. **Tipo:** mixto. **Nivel:** V. **Historia:** Sin márgenes innecesarios. **Criterios:** `viewBox` calculado al bbox de apariencias + margen. **Evidencia:** [V-0a]. **Deps:** HU-61.008. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [render, viewBox].

### HU-61.014 — Preservar cromatismo y drop-shadow semántica
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** V. **Historia:** Fidelidad visual. **Criterios:** colores `#70E483`/`#3BC3FF`/`#586D8C` y `<feDropShadow>` para físicos. **Evidencia:** [V-1], [V-124]. [JOYAS §1, §8]. **Deps:** HU-61.008. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [render, fidelidad].

### HU-61.015 — Suprimir cromo de la aplicación en el SVG
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** V. **Historia:** Solo OPD, no toolbar. **Criterios:** sin botones, sin cuadrícula, sin elementos de chrome. **Evidencia:** [V-0a]. **Deps:** HU-61.008. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [purificacion].

### HU-61.016 — Preservar estilos autorales custom
**Actor:** AD. **Tipo:** opm-semantica. **Nivel:** V. **Historia:** Overrides del usuario. **Criterios:** `apariencia.estilo` se preserva en SVG. **Evidencia:** [V-1], [V-63]. **Deps:** HU-61.014. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [estilo].

### HU-61.017 — Optimizar SVG eliminando nodos innecesarios
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Tamaño compacto. **Criterios:** SVGO o equivalente. **Deps:** HU-61.008. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [optimizacion].

### HU-61.018 — Embeber fuentes vs referenciar por CSS
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Portabilidad de tipografía. **Criterios:** opción "Embeber Arial" en modal. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [tipografia].

### HU-61.019 — Aplicar background color opcional
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Fondo blanco o transparente. **Criterios:** toggle. **Deps:** HU-61.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [background].

### HU-61.020 — Embeber metadata OPM como atributos XML
**Actor:** ME. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** Metadata recuperable. **Criterios:** `data-opm-tipo`, `data-opm-id`, etc. **Evidencia:** [V-0a], [Glos 3.39], [Glos 3.58]. **Deps:** HU-61.008. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [metadata].

### HU-61.021 — Incluir OPL como comentario XML
**Actor:** RV. **Tipo:** opm-semantica. **Nivel:** X. **Historia:** OPL accesible al inspeccionar SVG. **Criterios:** bloque `<!--OPL: ... -->`. **Evidencia:** [OPL-ES D1]. **Deps:** HU-61.020. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [opl, comentario].

### HU-61.022 — Agregar `<title>` y `<desc>` accesibles
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Accesibilidad. **Criterios:** elementos para lectores de pantalla. **Deps:** HU-61.020. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [accesibilidad].

### HU-61.023 — Garantizar compatibilidad con Inkscape e Illustrator
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Editores externos. **Criterios:** test en ambos. **Deps:** HU-61.014. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [compatibilidad].

### HU-61.024 — Mostrar feedback post-descarga y permitir reabrir
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Confirmación. **Criterios:** toast + botón "Exportar otro". **Deps:** HU-61.008. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [feedback].

### HU-61.025 — Tests de fidelidad visual canvas↔SVG
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Asegurar paridad. **Criterios:** snapshot tests. **Deps:** HU-61.014. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [tests].

### HU-61.026 — Exportar OPD como GIF animado
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Para simulación. **Criterios:** scope adicional con frames de simulación. **Deps:** EPICA-B0. **Prioridad:** W. **Tamaño:** XL. **Etiquetas:** [gif, animacion].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q61.1 | ¿Soportar PNG además de JPEG para raster? |
| Q61.2 | ¿Inkscape compatibility implica sin uso de filtros SVG modernos? |

## 4. Referencias

- Patrones: HU-SHARED-007.
- Bloqueada por: EPICA-10, EPICA-50.
