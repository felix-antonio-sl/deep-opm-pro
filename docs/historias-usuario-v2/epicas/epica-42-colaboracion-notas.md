---
epica: "EPICA-42"
titulo: "Colaboración — notas adhesivas (anclaje, toggle, integración)"
slug: "colaboracion-notes"
doc_fuente: "opcloud-reverse/42-colaboracion-notes.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 22
hu_canonicas: 22
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Notas adhesivas (sticky notes) ancladas al canvas del OPD activo. Útiles para anotar contexto sin afectar la semántica OPM. Persisten en el JSON del modelo. Toggle para ocultar todas. Sin OPL eco (las notas no son entidades OPM).

## 2. HU canónicas

### HU-42.001 — Crear nota por doble clic en zona vacía del canvas
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Crear nota rápido. **Criterios:** doble clic crea nota amarilla con título + cuerpo. **Modelo:** `[propuesta]` `nota.id`, `nota.opdId`, `nota.x`, `nota.y`, `nota.titulo`, `nota.cuerpo`, `nota.autorId`. **Patrones:** HU-SHARED-002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [nota, propuesta].

### HU-42.002 — Editar título con doble clic sobre la franja superior
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Edit inline. **Criterios:** doble clic abre input. **Deps:** Bloqueada por HU-42.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [edicion, titulo].

### HU-42.003 — Editar cuerpo de nota con doble clic
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Edit cuerpo. **Criterios:** análogo a HU-42.002 sobre área de cuerpo. **Deps:** Bloqueada por HU-42.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [edicion, cuerpo].

### HU-42.004 — Confirmar edición con botón "Actualizar"
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Persistir edición. **Criterios:** botón confirma. **Deps:** Bloqueada por HU-42.002. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [confirmar].

### HU-42.005 — Mover nota por drag desde handle central
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Reposicionar nota. **Criterios:** arrastre por handle. **Modelo:** `nota.x`, `nota.y`. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-42.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [drag].

### HU-42.006 — Redimensionar nota con handles
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Cambiar tamaño. **Criterios:** handles esquinas/bordes. **Modelo:** `nota.width`, `nota.height` `[propuesta]`. **Deps:** Bloqueada por HU-42.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [redimension].

### HU-42.007 — Anclar nota a una cosa OPM con línea discontinua
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Asociar nota a entidad. **Criterios:** drag desde nota a apariencia crea línea discontinua. **Modelo:** `nota.anclajeId: Id` `[propuesta]`. **Deps:** Bloqueada por HU-42.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [anclaje].

### HU-42.008 — Eliminar nota con Delete o icono papelera
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Eliminar. **Criterios:** ver HU-SHARED-005 con scope "modelo". **Patrones:** HU-SHARED-005. **Deps:** Bloqueada por HU-42.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [eliminar].

### HU-42.009 — Ocultar y mostrar todas las notas con toggle
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Toggle global. **Criterios:** toggle "Mostrar notas" en barra. **Modelo:** `ui.notasVisibles`. **Deps:** Bloqueada por HU-42.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [toggle].

### HU-42.010 — Configurar "Mostrar notas por defecto" en preferencias
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Default por usuario. **Criterios:** preferencia. **Deps:** Bloqueada por HU-42.009. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [config].

### HU-42.011 — Listar notas del OPD actual en panel lateral
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Vista de notas. **Criterios:** panel lateral con lista. **Deps:** Bloqueada por HU-42.001. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [panel, lista].

### HU-42.012 — Navegar al elemento anclado con clic en nota del panel
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Saltar al ancla. **Criterios:** clic navega + selecciona ancla. **Patrones:** HU-SHARED-008. **Deps:** Bloqueada por HU-42.011. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [navegacion].

### HU-42.013 — Filtrar panel por autor
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Ver solo mis notas. **Criterios:** dropdown autor. **Deps:** Bloqueada por HU-42.011. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [filtro].

### HU-42.014 — Filtrar por asociación (cosa / enlace / OPD)
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Filtrar por tipo de ancla. **Criterios:** dropdown. **Deps:** Bloqueada por HU-42.011. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [filtro].

### HU-42.015 — Editar nota con markdown ligero
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Formato en cuerpo. **Criterios:** **negrita**, *cursiva*, listas. **Deps:** Bloqueada por HU-42.003. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [markdown].

### HU-42.016 — Atribuir autor y timestamp automáticos
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Trazabilidad. **Criterios:** `nota.autorId`, `nota.creadoEn`. **Deps:** Bloqueada por HU-42.001. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [trazabilidad].

### HU-42.017 — Conservar historial de cambios (audit trail)
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Versionado de notas. **Criterios:** array de versiones. **Modelo:** `nota.versiones` `[propuesta]`. **Deps:** Bloqueada por HU-42.016. **Prioridad:** C. **Tamaño:** L. **Etiquetas:** [audit, propuesta].

### HU-42.018 — Marcar nota como privada o pública dentro del modelo
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Privacidad. **Criterios:** toggle. **Modelo:** `nota.privada: boolean`. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-42.001. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [privacidad].

### HU-42.019 — Persistir notas en el JSON del modelo al guardar
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Persistencia con el modelo. **Criterios:** notas son parte de `modelo.notas` `[propuesta]`. **Deps:** Bloqueada por HU-30.008. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [persistencia].

### HU-42.020 — Incluir notas visibles en exportaciones del OPD
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** X. **Historia:** Notas en PDF/SVG. **Criterios:** notas se exportan si toggle activo. **Deps:** Bloqueada por HU-42.009, EPICA-60. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [export].

### HU-42.021 — Mostrar nota como bloque amarillo en mini-navegador
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Visible en mini-navegador. **Criterios:** bloque amarillo en miniatura. **Deps:** Bloqueada por HU-10.018. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render, mini-navegador].

### HU-42.022 — Convertir nota en mensaje de chat del modelo
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Pivotar nota → chat. **Criterios:** botón "Compartir en chat" copia contenido a chat. **Deps:** Bloqueada por HU-41.004. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [chat, conversion].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q42.1 | ¿Notas privadas se persisten o son solo de sesión? |
| Q42.2 | ¿El audit trail es global o por nota? |

## 4. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-005, HU-SHARED-008.
- Bloqueada por: EPICA-30 (persistencia).
