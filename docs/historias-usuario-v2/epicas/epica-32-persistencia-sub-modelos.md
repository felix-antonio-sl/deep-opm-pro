---
epica: "EPICA-32"
titulo: "Persistencia — sub-modelos (vistas de subsistema, archivos peer, composición cross-modelo)"
slug: "persistencia-sub-models"
doc_fuente: "opcloud-reverse/32-persistencia-sub-models.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "S"
hu_emitidas: 32
hu_canonicas: 31
hu_stubs: 1
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Sub-modelos: composición cross-modelo donde un modelo padre referencia un sub-modelo (archivo peer). Las cosas compartidas se atenúan visualmente; el sub-modelo se carga on-demand y se sincroniza periódicamente. Reglas de bloqueo: no se permite refinar cosas ya refinadas, ni eliminar cosas compartidas, ni renombrar desde file manager. La SSOT [Glos 3.40] permite composición.

## 2. HU canónicas (denso)

Para acelerar, agrupo por bloques temáticos. Cada HU mantiene formato canónico mínimo.

### HU-32.001 — Habilitar "Conectar Sub-modelo" con selección válida
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Como modelador experto, quiero conectar un grupo seleccionado como sub-modelo para reutilizar lógica entre modelos. **Criterios:** **Dado** selección con proceso + objeto + exhibición + instrumento, **cuando** la valido, **entonces** se habilita botón "Conectar como sub-modelo". **Modelo:** validación. **Patrones:** HU-SHARED-008. **Evidencia:** [Glos 3.40]. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [composicion].

### HU-32.002 — Bloquear "Conectar Sub-modelo" si hay cosas ya refinadas
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** No permitir composición si hay refinamientos preexistentes (conflicto semántico). **Criterios:** **Dado** alguna cosa con descomposición o despliegue activos, **cuando** intento conectar, **entonces** se bloquea con explicación. **Deps:** Bloqueada por HU-32.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [validacion, refinamiento].

### HU-32.003 — Validar regla mínima (proceso + objeto + exhibición + instrumento)
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Asegurar coherencia mínima del sub-modelo. **Criterios:** validador requiere ese cuádruple. **Deps:** Bloqueada por HU-32.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [validacion].

### HU-32.004 — Abrir diálogo "Crear Sub-modelo" con nombre sugerido
**Actor:** ME. **Tipo:** mixto. **Nivel:** U. **Historia:** Diálogo guiado. **Criterios:** input nombre con default `<Selección> Submodelo`. **Deps:** Bloqueada por HU-32.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [dialogo].

### HU-32.005 — Crear archivo peer del sub-modelo al confirmar
**Actor:** ME. **Tipo:** mixto. **Nivel:** P primario. **Historia:** Persistir el sub-modelo como archivo paralelo. **Criterios:** **Dado** confirmo, **cuando** termina, **entonces** existe `modelo` peer en la misma carpeta con la selección extraída. **Modelo:** nuevo `modelo` + referencia desde el padre. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-32.004. **Prioridad:** S. **Tamaño:** L. **Etiquetas:** [persistencia, peer].

### HU-32.006 — Emitir nodo árbol `SDx.y: <Nombre> Vista de Subsistema` en el padre
**Actor:** ME. **Tipo:** mixto. **Nivel:** L. **Historia:** Ver sub-modelo en el árbol del padre. **Criterios:** **Dado** sub-modelo creado, **cuando** se renderiza el árbol, **entonces** aparece nodo distintivo. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [arbol].

### HU-32.007 — Abrir menú contextual extendido del nodo sub-modelo [absorbida en HU-SHARED-001]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-001.
**Especialización local:** contexto = sub-modelo. Acciones: Abrir, Sincronizar, Desvincular, Permisos.

### HU-32.008 — Abrir sub-modelo en pestaña nueva desde menú contextual
**Actor:** ME. **Tipo:** mixto. **Nivel:** U. **Historia:** Editar el sub-modelo independientemente. **Criterios:** **Dado** clic en "Abrir", **cuando** termina, **entonces** se abre pestaña nueva con el peer.  **Patrones:** HU-SHARED-001 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-SHARED-001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [navegacion, peer].

### HU-32.009 — Listar padre y sub-modelo como peers en "Cargar Modelo"
**Actor:** RV. **Tipo:** mixto. **Nivel:** L. **Historia:** Ambos modelos visibles en navegador. **Criterios:** ambos aparecen como tiles independientes. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [navegador].

### HU-32.010 — Marcar pestaña del padre con glifo flecha-izquierda de composición
**Actor:** MN. **Tipo:** mixto. **Nivel:** V. **Historia:** Distinguir visualmente. **Criterios:** glifo en pestaña del padre. **Deps:** Bloqueada por HU-32.005. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [glifo].

### HU-32.011 — Atenuar render de cosas compartidas dentro del sub-modelo
**Actor:** MN. **Tipo:** mixto. **Nivel:** V. **Historia:** Visualizar las cosas que vienen del padre con menor saturación. **Criterios:** apariencias compartidas con `opacity = 0.5`. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, atenuacion].

### HU-32.012 — Atenuar render de cosas compartidas dentro del padre
**Actor:** MN. **Tipo:** mixto. **Nivel:** V. **Historia:** Análoga a HU-32.011 desde el padre. **Criterios:** ídem. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render].

### HU-32.013 — Restaurar saturación al refinarse una cosa compartida
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Como modelador experto, quiero saturación normal cuando refino una cosa compartida en el sub-modelo. **Criterios:** la atenuación se quita al iniciar refinamiento. **Deps:** Bloqueada por HU-32.011. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [render].

### HU-32.014 — Mostrar alias `{id}` local al sub-modelo en etiqueta
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Distinguir alias por sub-modelo. **Criterios:** etiqueta `{alias-local}` en sub-modelo. **Deps:** Bloqueada por HU-17.007. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [alias, sub-modelo].

### HU-32.015 — Calcular numeración `SDx.y` relativa al modelo abierto
**Actor:** RV. **Tipo:** mixto. **Nivel:** L. **Historia:** Numeración consistente con qué modelo se ve. **Criterios:** numeración recalculada al cambiar modelo activo. **Deps:** Bloqueada por HU-32.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [numeracion].

### HU-32.016 — Renderizar sub-nodos `(solo lectura)` del sub-modelo bajo nodo del padre
**Actor:** RV. **Tipo:** mixto. **Nivel:** L. **Historia:** Ver árbol del peer dentro del padre, marcado read-only. **Criterios:** sub-árbol expandible read-only.  **Patrones:** HU-SHARED-003 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-32.006. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [arbol, read-only].

### HU-32.017 — Restringir biblioteca a compartidas + nativas del sub-modelo
**Actor:** ME. **Tipo:** mixto. **Nivel:** L. **Historia:** No mostrar cosas del padre que no son compartidas. **Criterios:** biblioteca filtrada. **Deps:** Bloqueada por HU-32.005. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [biblioteca].

### HU-32.018 — Renderizar badge verde para sincronizado
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Saber si peer está al día. **Criterios:** badge verde cuando sincronizado, ámbar cuando no. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [badge, sync].

### HU-32.019 — Mutar badge a amarillo al detectar desincronización
**Actor:** ME. **Tipo:** mixto. **Nivel:** V. **Historia:** Detectar drift. **Criterios:** **Dado** sub-modelo modificado, **cuando** se detecta, **entonces** badge se vuelve ámbar. **Deps:** Bloqueada por HU-32.018. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [sync].

### HU-32.020 — Chequear sincronía periódicamente (~30s)
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Historia:** Polling de sync. **Criterios:** chequeo cada 30s. **Deps:** Bloqueada por HU-32.019. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [polling].

### HU-32.021 — Descargar todos los sub-modelos con botón "Descargar todos"
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Historia:** Liberar memoria. **Criterios:** descarga todos los peers cargados. **Deps:** Bloqueada por HU-32.005. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [memoria].

### HU-32.022 — Cargar on-demand al expandir nodo sub-modelo
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Historia:** Lazy loading. **Criterios:** **Dado** nodo colapsado, **cuando** lo expando, **entonces** se carga el peer. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [lazy].

### HU-32.023 — Renombrar y alias de cosas compartidas desde el sub-modelo
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Cambiar nombre/alias propaga a peer. **Criterios:** propagación bidireccional. **Patrones:** HU-SHARED-004. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [renombrar, propagacion].

### HU-32.024 — Prohibir agregar estados a cosas compartidas desde el sub-modelo
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Restringir mutaciones que afectan al padre. **Criterios:** menú contextual oculta "Agregar estados" cuando es compartida.  **Patrones:** HU-SHARED-001 (mecánica detectada por audit-hu.mjs). **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [restriccion].

### HU-32.025 — Prohibir eliminar cosas compartidas desde cualquier lado
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** Eliminar requiere desvincular primero. **Criterios:** "Eliminar" deshabilitado para compartidas. **Patrones:** HU-SHARED-005. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [restriccion].

### HU-32.026 — Bloquear enlaces fundamentales nuevos desde compartidas en el padre
**Actor:** ME. **Tipo:** mixto. **Nivel:** K. **Historia:** No agregar enlaces estructurales nuevos al padre desde compartidas. **Criterios:** validación. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [restriccion].

### HU-32.027 — Prohibir renombrar desde file manager; exigir desde menú del nodo
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Historia:** Forzar canal canónico. **Criterios:** desde diálogo Cargar, "Renombrar" deshabilitado para sub-modelos. Solo desde menú del nodo árbol. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [restriccion].

### HU-32.028 — Desvincular desde menú contextual del nodo en el padre
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Historia:** Romper la composición. **Criterios:** **Dado** clic "Desvincular", **cuando** confirmo, **entonces** se rompe la referencia y las cosas compartidas se duplican localmente. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [desvincular], HU-SHARED-001.
### HU-32.029 — Desvincular bilateralmente desde el sub-modelo y guardar ambos
**Actor:** ME. **Tipo:** mixto. **Nivel:** P. **Historia:** Análogo a HU-32.028 desde el peer. **Criterios:** ídem con guardado de ambos archivos. **Deps:** Bloqueada por HU-32.028. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [desvincular].

### HU-32.030 — Incluir sub-modelos no cargados en exporte PDF con fetch automático
**Actor:** RV. **Tipo:** mixto. **Nivel:** X. **Historia:** Exporte completo. **Criterios:** **Dado** export PDF, **cuando** hay sub-modelos no cargados, **entonces** se cargan temporalmente para incluirlos. **Deps:** Bloqueada por EPICA-60. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [export].

### HU-32.031 — Permisar sub-modelo independientemente del padre
**Actor:** AO. **Tipo:** mixto. **Nivel:** C. **Historia:** Permisos peer-independientes. **Criterios:** sub-modelo puede tener permisos distintos al padre. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-32.005. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [permisos].

### HU-32.032 — Mantener sub-modelo en el mismo folder que el padre
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Historia:** Convención de organización. **Criterios:** al crear, default es misma carpeta del padre. **Deps:** Bloqueada por HU-32.005. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [organizacion].

## 3. Preguntas abiertas

| Q | Pregunta | Bloquea |
|---|---|---|
| Q32.1 | ¿La sincronización es lock-based o resolución de conflictos? | HU-32.020 |
| Q32.2 | ¿Múltiples sub-modelos por padre o solo uno? | HU-32.005 |

## 4. Referencias

- Patrones: HU-SHARED-001 (especializado), HU-SHARED-002, HU-SHARED-003, HU-SHARED-004, HU-SHARED-005, HU-SHARED-008.
- Bloqueada por: EPICA-30, EPICA-31. Bloquea a: EPICA-60 (export con peers).
