---
epica: "EPICA-33"
titulo: "Persistencia — plantillas (artefactos reutilizables, ámbitos Privado/Organizacional/Global)"
slug: "persistencia-templates"
doc_fuente: "opcloud-reverse/33-persistencia-templates.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 22
hu_canonicas: 22
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Plantillas como artefactos de primer nivel: guardar el modelo actual como plantilla con ámbito (Privado/Organizacional/Global), insertar plantilla en OPD activo con merge de sub-OPDs y resolución de colisiones nominales con sufijo `_n`. Edición separada en "modo Plantilla" con prefijo `<<Plantilla>>`. Plantilla y copias quedan desacopladas tras insertar.

## 2. HU canónicas (denso)

### HU-33.001 — Disponer de plantillas como artefacto de primer nivel
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Las plantillas son ciudadanos de primer nivel del sistema. **Criterios:** menú "Plantillas" visible. **Modelo:** `[propuesta]` `plantilla.*`. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [plantilla].

### HU-33.002 — Guardar el modelo actual como plantilla
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Convertir modelo en plantilla reutilizable. **Criterios:** **Dado** "Guardar como plantilla", **cuando** ingreso ámbito, **entonces** se persiste como plantilla. **Modelo:** `plantilla.id`, `plantilla.nombre`, `plantilla.ambito`, `plantilla.contenido`. **Patrones:** HU-SHARED-002. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [persistencia, plantilla].

### HU-33.003 — Guardar plantilla en ámbito "Privado"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Solo yo veo. **Criterios:** ámbito = privado. **Deps:** Bloqueada por HU-33.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ambito].

### HU-33.004 — Guardar plantilla en ámbito "Organizacional"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Toda la org la usa. **Criterios:** solo AO puede crear este ámbito. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-33.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [ambito, org].

### HU-33.005 — Guardar plantilla en ámbito "Global"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Todas las orgs. **Criterios:** solo super-admin. **Deps:** Bloqueada por HU-33.002. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [ambito, global].

### HU-33.006 — Insertar plantilla en el OPD actual
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** K primario. **Historia:** Reutilizar plantilla en mi modelo. **Criterios:** **Dado** "Insertar plantilla", **cuando** elijo y confirmo, **entonces** todas las cosas y enlaces de la plantilla se mergean en el OPD activo. **Modelo:** `entidad.*`, `enlace.*`, `apariencia.*`, `aparienciaEnlace.*` nuevos en el modelo destino. **Patrones:** HU-SHARED-002, HU-SHARED-007. **Deps:** Bloqueada por HU-33.002. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [insertar, merge].

### HU-33.007 — Hacer merge recursivo de sub-OPDs bajo el OPD activo
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Cuando la plantilla tiene jerarquía. **Criterios:** sub-OPDs se crean como descendientes del OPD activo. **Deps:** Bloqueada por HU-33.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [merge, jerarquia].

### HU-33.008 — Resolver colisiones de nombre con sufijo `_n`
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Si nombres colisionan, agregar sufijo. **Criterios:** **Dado** colisión `Cosa` ya existente, **cuando** inserto, **entonces** la nueva se llama `Cosa_2`. **Patrones:** HU-SHARED-009. **Deps:** Bloqueada por HU-33.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [colision, sufijo].

### HU-33.009 — Preservar nombres de enlaces de exhibición al reinsertar
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Los enlaces de exhibición preservan etiquetas exactas. **Criterios:** etiquetas se importan tal cual. **Deps:** Bloqueada por HU-33.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [preservacion, exhibicion].

### HU-33.010 — Destacar visualmente los elementos recién insertados
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Distinguir lo nuevo. **Criterios:** halo temporal de 3s sobre los nuevos elementos. **Deps:** Bloqueada por HU-33.006. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render, feedback].

### HU-33.011 — Ver previsualización miniatura de plantilla al apuntar
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Ver antes de insertar. **Criterios:** tooltip con miniatura SVG. **Deps:** Bloqueada por HU-33.001. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [preview].

### HU-33.012 — Buscar plantillas por nombre en el modal
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Filtrar lista. **Criterios:** caja de búsqueda. **Deps:** Bloqueada por HU-33.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [busqueda].

### HU-33.013 — Extender búsqueda a subcarpetas con checkbox
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Búsqueda recursiva. **Criterios:** checkbox alterna scope. **Deps:** Bloqueada por HU-33.012. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [busqueda].

### HU-33.014 — Navegar carpetas de plantillas con breadcrumb
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Análogo a EPICA-31. **Criterios:** ver HU-31.006. **Deps:** Bloqueada por HU-33.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [navegacion].

### HU-33.015 — Ver carpeta vacía con mensaje "Sin plantillas"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Estado vacío explícito. **Criterios:** texto "Sin plantillas en esta carpeta". **Deps:** Bloqueada por HU-33.014. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [empty-state].

### HU-33.016 — Editar una plantilla existente en "modo Plantilla"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Modificar plantilla maestra. **Criterios:** **Dado** plantilla, **cuando** elijo "Editar", **entonces** se abre como modelo en modo Plantilla. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-33.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [editar, modo].

### HU-33.017 — Ver prefijo `<<Plantilla>>` en modo edición
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Reconocer modo. **Criterios:** título tiene prefijo. **Deps:** Bloqueada por HU-33.016. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [render, prefijo].

### HU-33.018 — Ver que plantilla y copias quedan desacopladas tras insertar
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Cambios en plantilla no propagan a inserciones previas. **Criterios:** **Dado** modifico plantilla, **cuando** consulto modelos donde se insertó previamente, **entonces** los modelos no cambian. **Deps:** Bloqueada por HU-33.006. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [desacoplamiento].

### HU-33.019 — Ver solo ámbitos permitidos en "Guardar" según rol
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** UX consistente con permisos. **Criterios:** dropdown ámbito muestra solo ámbitos accesibles. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-33.002. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [permisos].

### HU-33.020 — Marcar plantilla como favorita con estrella
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Acceso rápido a favoritas. **Criterios:** estrella toggle; sección "Favoritas" en lista. **Modelo:** `plantilla.favorita: boolean` `[propuesta]`. **Deps:** Bloqueada por HU-33.001. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [favoritos].

### HU-33.021 — Cortar carpeta de plantillas para reorganizar
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Análogo a HU-31.011. **Criterios:** ver HU-31.011. **Deps:** Bloqueada por HU-31.011. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [cut, plantilla].

### HU-33.022 — Cancelar modal de plantilla sin efecto colateral
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** ESC sin efectos. **Criterios:** ver HU-30.037. **Deps:** Bloqueada por HU-33.001. **Prioridad:** S. **Tamaño:** XS. **Etiquetas:** [cancelar].

## 3. Preguntas abiertas

| Q | Pregunta | Bloquea |
|---|---|---|
| Q33.1 | ¿Plantillas tienen versionado propio o son inmutables tras crear? | HU-33.016 |
| Q33.2 | ¿Hay límite de tamaño de plantilla? | HU-33.002 |

## 4. Referencias

- Patrones: HU-SHARED-002, HU-SHARED-003, HU-SHARED-007, HU-SHARED-009.
- Bloqueada por: EPICA-30, EPICA-31.
