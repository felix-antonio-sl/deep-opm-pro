---
epica: "EPICA-81"
titulo: "Configuración — defaults de estilo visual, esencia, OPL, cuadrícula y herencia"
slug: "config-style-defaults"
doc_fuente: "opcloud-reverse/81-config-style-defaults.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "C"
hu_emitidas: 22
hu_canonicas: 22
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Defaults configurables a nivel de organización con override por usuario: esencia inicial, modos OPL, alias display, cuadrícula, sincronización de colores, spell checking, visibilidad de notas. Cada cosa creada captura snapshot de defaults (no referencia viva).

## 2. HU canónicas

### HU-81.001 — Acceder a Configuración desde menú o engranaje
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [config].

### HU-81.002 — Navegar paneles por carril izquierdo
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-81.003 — Cambiar idioma del OPL en "Idioma y OPL"
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** dropdown ES/EN. **Evidencia:** [OPL-ES]. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [opl, idioma].

### HU-81.004 — Fijar esencia por defecto (Física/Informacional)
**Actor:** AO. **Tipo:** opm-semantica. **Nivel:** C. **Criterios:** dropdown. **Modelo:** `org.defaults.esencia`. **Evidencia:** [V-1], [Glos 3.25]. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [defaults, esencia].

### HU-81.005 — Configurar visibilidad de oraciones de esencia OPL
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** modos: siempre, oculta, contextual. **Evidencia:** [OPL-ES D1]. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [opl].

### HU-81.006 — Configurar opciones de visualización de unidades
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [unidades].

### HU-81.007 — Configurar opciones de display de alias OPL
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [alias].

### HU-81.008 — Configurar numeración OPL sincronizada con toggle del panel
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** ver HU-50.003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [opl, numeracion].

### HU-81.009 — Configurar Auto Format como default de creación
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** ver HU-10.006. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [auto-format].

### HU-81.010 — Configurar resaltado OPL↔OPD
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** ver HU-50.017. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render].

### HU-81.011 — Configurar sincronización de colores entre OPL y OPD
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** sincronización via JOYAS §1. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [color, sync].

### HU-81.012 — Fijar default de estilo por clase
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** estilo default por tipo (objeto/proceso/estado). **Evidencia:** [V-63], [JOYAS §1, §3]. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [defaults, estilo].

### HU-81.013 — Preservar estilo existente al cambiar default
**Actor:** AO. **Tipo:** opm-semantica. **Nivel:** V. **Historia:** Cambio del default no afecta cosas ya creadas. **Criterios:** snapshot semántico. **Evidencia:** [V-63]. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [snapshot].

### HU-81.014 — Configurar "Cuadrícula" On/Off como default
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** ver HU-1A.009. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [cuadricula].

### HU-81.015 — Configurar tamaño, color, grosor y factor de escala de la cuadrícula
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** ver HU-1A.011, HU-1A.012, HU-1A.013. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [cuadricula].

### HU-81.016 — Ver modal de confirmación al guardar configuración de cuadrícula
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** modal "ÉXITO". **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [feedback].

### HU-81.017 — Configurar verificación ortográfica en rótulos
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** toggle. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [spell-check].

### HU-81.018 — Configurar visibilidad por defecto de notas
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Criterios:** ver HU-42.010. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [notas].

### HU-81.019 — Configurar visibilidad por defecto de nombres de OPD en árbol
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** L. **Criterios:** ver HU-20.013. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [arbol].

### HU-81.020 — Heredar defaults de organización con override por usuario
**Actor:** AO. **Tipo:** mixto. **Nivel:** C. **Historia:** Cadena de herencia: SSOT → Org → Usuario → Modelo. **Criterios:** override en cada nivel. **Evidencia:** [V-1]. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [herencia].

### HU-81.021 — Restablecer panel a defaults canónicos u organizacionales
**Actor:** MN. **Tipo:** mixto. **Nivel:** C. **Criterios:** botón "Restablecer". **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [reset].

### HU-81.022 — Preservar instantánea del default al crear cada cosa
**Actor:** AO. **Tipo:** opm-semantica. **Nivel:** K. **Historia:** Default no es referencia viva. **Criterios:** **Dado** creo cosa con default X, **cuando** después cambio default X, **entonces** la cosa creada conserva valor original (no muta). **Evidencia:** [V-1]. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [snapshot, kernel].

## 3. Preguntas abiertas

| Q | Pregunta |
|---|---|
| Q81.1 | ¿Cambio de defaults dispara migración de modelos existentes? |

## 4. Referencias

- Patrones: HU-SHARED-003.
- Bloqueada por: EPICA-80, EPICA-1A, EPICA-50.
