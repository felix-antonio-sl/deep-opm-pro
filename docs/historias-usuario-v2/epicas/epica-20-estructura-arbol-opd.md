---
epica: "EPICA-20"
titulo: "Estructura — árbol OPD (navegación, orden, gestión, vistas derivadas)"
slug: "estructura-opd-tree"
doc_fuente: "opcloud-reverse/20-estructura-opd-tree.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 22
hu_canonicas: 21
hu_stubs: 1
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Árbol OPD: navegación primaria del modelo multi-OPD, ordenamiento manual y automático, gestión jerárquica con integridad (no eliminar nodos internos), búsqueda por nombre, y management con cut/paste. Es la lente de navegación canónica del modelo.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo |
|---|---|---|---|---|---|
| HU-20.001 | Ver árbol OPD persistente en panel lateral izquierdo | MN | M0 | S | mixto |
| HU-20.002 | Ver nodo raíz SD al abrir modelo nuevo | MN | M0 | XS | opm-semantica |
| HU-20.003 | Generar nodo hijo al ejecutar descomposición [absorbida en HU-12.004] | — | — | — | — |
| HU-20.004 | Generar nodo hijo al ejecutar despliegue | MN | M0 | M | mixto |
| HU-20.005 | Identificar tipo de refinamiento por sufijo del nodo | MN | M0 | S | opcloud-ui |
| HU-20.006 | Anidar nietos recursivamente en jerarquía SDn.m | ME | M0 | S | opm-semantica |
| HU-20.007 | Navegar a OPD con clic en nodo del árbol | MN | M0 | S | mixto |
| HU-20.008 | Sincronizar canvas con nodo seleccionado del árbol | MN | M0 | S | mixto |
| HU-20.009 | Navegar por teclado con Ctrl+arriba / Ctrl+abajo | ME | M1 | S | opcloud-ui |
| HU-20.010 | Ajustar ancho del panel árbol con divisor arrastrable | ME | M1 | XS | opcloud-ui |
| HU-20.011 | Abrir menú contextual del árbol [especializa HU-SHARED-001] | ME | M1 | S | opcloud-ui |
| HU-20.012 | Expandir o colapsar todo el árbol de una vez | ME | M1 | XS | opcloud-ui |
| HU-20.013 | Alternar entre "Ocultar nombres" y "Mostrar nombres" | RV | C | XS | opcloud-ui |
| HU-20.014 | Renombrar OPD desde el árbol | ME | M1 | S | mixto |
| HU-20.015 | Eliminar solo nodos hoja del árbol | ME | M0 | M | opm-semantica |
| HU-20.016 | Impedir eliminación de nodos internos con mensaje claro | ME | M0 | S | mixto |
| HU-20.017 | Reordenar hermanos manualmente con arrastre en el árbol | ME | S | M | opcloud-ui |
| HU-20.018 | Reordenar hermanos automáticamente según canvas del padre | ME | S | M | mixto |
| HU-20.019 | Configurar modo Automático vs Manual en preferencias | AO | S | S | opcloud-ui |
| HU-20.020 | Abrir "Gestión del Árbol OPD" con Ctrl+D | ME | S | M | opcloud-ui |
| HU-20.021 | Buscar OPD por nombre o número en gestión | ME | S | S | opcloud-ui |
| HU-20.022 | Cortar y pegar nodos en gestión del árbol | ME | S | L | opcloud-ui |

21 canónicas, 1 stub.

## 3. Historias de usuario

### HU-20.001 — Ver árbol OPD persistente en panel lateral izquierdo

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero un panel lateral siempre visible con el árbol OPD para navegar.
**Criterios:** **Dado** modelo cargado, **cuando** la UI se renderiza, **entonces** el panel izquierdo muestra el árbol con nodos para cada OPD.
**Deps:** Bloqueada por HU-30.002 (cargar modelo).
**Evidencia:** [Glos 3.40]. Clase: observado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [lente, navegacion, panel].

---

### HU-20.002 — Ver nodo raíz SD al abrir modelo nuevo

**Actor primario:** MN. **Tipo:** opm-semantica. **Nivel:** L.
**Historia:** Como modelador, quiero ver el SD como raíz al crear un modelo nuevo.
**Criterios:** **Dado** modelo nuevo, **cuando** se renderiza el árbol, **entonces** existe un único nodo `SD` (Diagrama del Sistema).
**Modelo:** `modelo.opdRaizId` apunta al SD. **Deps:** Bloqueada por HU-34.001.
**Evidencia:** [Met §6], [Glos 3.69]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [kernel, sd].

---

### HU-20.003 — Generar nodo hijo al ejecutar descomposición [absorbida en HU-12.004]

**Estado:** absorbida (2026-05-03). **Canónica:** HU-12.004.

---

### HU-20.004 — Generar nodo hijo al ejecutar despliegue

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero que el árbol incluya un nodo cuando ejecuto despliegue (similar a descomposición).
**Criterios:** **Dado** ejecuté despliegue (HU-17.028), **cuando** termina, **entonces** se crea nodo `SDn: <Obj> desplegado` bajo el padre con sufijo distintivo (HU-20.005).
**Modelo:** `modelo.opds[id]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-17.028. **Evidencia:** [Glos 3.81]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [arbol, despliegue, refinamiento].

---

### HU-20.005 — Identificar tipo de refinamiento por sufijo del nodo

**Actor primario:** MN. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero distinguir descomposición ("descompuesto") de despliegue ("desplegado") por sufijo en el nombre del nodo.
**Criterios:** descomposición → "SDn: <Proceso> descompuesto"; despliegue → "SDn: <Objeto> desplegado".
**Deps:** Bloqueada por HU-12.005, HU-20.004. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [arbol, sufijo].

---

### HU-20.006 — Anidar nietos recursivamente en jerarquía SDn.m

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** L.
**Historia:** Como modelador experto, quiero que las descomposiciones de subprocesos generen nietos en el árbol.
**Criterios:** **Dado** descompongo `SD2`, **cuando** termina, **entonces** se crea `SD2.1` bajo `SD2`. Recursivo en niveles arbitrarios.
**Modelo:** `modelo.opds[id]` con jerarquía implícita. **Deps:** Bloqueada por HU-12.003.
**Evidencia:** [Glos 3.31]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [jerarquia, recursion].

---

### HU-20.007 — Navegar a OPD con clic en nodo del árbol

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero clicar un nodo y ver su OPD.
**Criterios:** ver HU-12.025. **Deps:** Bloqueada por HU-20.001.
**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [navegacion].

---

### HU-20.008 — Sincronizar canvas con nodo seleccionado del árbol

**Actor primario:** MN. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador, quiero que cambiar de OPD desde canvas (HU-12.026) marque el nodo correspondiente en el árbol.
**Criterios:** **Dado** `ui.opdActivoId` cambia, **cuando** se sincroniza, **entonces** el nodo correspondiente queda resaltado.
**Deps:** Bloqueada por HU-20.001. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [sincronizacion].

---

### HU-20.009 — Navegar por teclado con Ctrl+arriba / Ctrl+abajo

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador experto, quiero saltar al OPD anterior/siguiente con atajo.
**Criterios:** Ctrl+↑ navega al hermano superior; Ctrl+↓ al hermano inferior; Ctrl+→ al primer hijo.
**Deps:** Bloqueada por HU-20.001. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [atajo, navegacion].

---

### HU-20.010 — Ajustar ancho del panel árbol con divisor arrastrable

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador, quiero redimensionar el panel.
**Criterios:** divisor vertical entre panel y canvas, arrastrable. Ancho persistido.
**Modelo:** `usuario.preferencias.anchoPanelArbol` `[propuesta]`.
**Deps:** Bloqueada por HU-20.001. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [ui, redimension].

---

### HU-20.011 — Abrir menú contextual del árbol [especializa HU-SHARED-001]

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador experto, quiero menú contextual sobre nodos del árbol.
**Criterios:** ver HU-SHARED-001 con contexto = nodo OPD. Acciones: Renombrar (HU-20.014), Eliminar (HU-20.015), Reordenar (HU-20.017), Cut/paste (HU-20.022).
**Patrones:** HU-SHARED-001. **Deps:** Bloqueada por HU-SHARED-001.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [ui, menu-contextual].

---

### HU-20.012 — Expandir o colapsar todo el árbol de una vez

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero un botón "Expandir todo" / "Colapsar todo".
**Criterios:** dos acciones en panel. **Deps:** Bloqueada por HU-20.001.
**Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [ui, expansion].

---

### HU-20.013 — Alternar entre "Ocultar nombres" y "Mostrar nombres"

**Actor primario:** RV. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como revisor, quiero ocultar nombres del árbol para reducir clutter.
**Criterios:** toggle "Mostrar nombres" en preferencias del panel. Cuando está oculto, solo se ve el código `SDn`.
**Deps:** Bloqueada por HU-20.001. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [ui, toggle].

---

### HU-20.014 — Renombrar OPD desde el árbol

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador, quiero cambiar el nombre del OPD para identificarlo claramente.
**Criterios:** ver HU-SHARED-004 con scope = OPD. Unicidad por modelo. **Modelo:** `opd.nombre`.
**Patrones:** HU-SHARED-004, HU-SHARED-009. **Deps:** Bloqueada por HU-SHARED-004.
**Evidencia:** [Glos 3.40]. Clase: confirmado.
**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [opd, renombrar].

---

### HU-20.015 — Eliminar solo nodos hoja del árbol

**Actor primario:** ME. **Tipo:** opm-semantica. **Nivel:** K.
**Historia:** Como modelador, quiero eliminar OPDs que son hojas (sin descendientes) sin afectar la integridad jerárquica.
**Criterios:**
- **Dado** OPD hoja, **cuando** elijo "Eliminar OPD", **entonces** se elimina con cascada (HU-SHARED-005 scope OPD); las apariencias del padre que apuntaban a la descomposición se actualizan.
- **Dado** OPD con descendientes, **cuando** intento eliminar, **entonces** se bloquea (HU-20.016).
**Patrones:** HU-SHARED-005. **Deps:** Bloqueada por HU-SHARED-005.
**Evidencia:** [Glos 3.40]. Clase: confirmado.
**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, eliminar, opd].

---

### HU-20.016 — Impedir eliminación de nodos internos con mensaje claro

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** K.
**Historia:** Como modelador, quiero que el sistema explique por qué no puedo eliminar un OPD interno y sugiera "Eliminar descendientes primero".
**Criterios:** **Dado** OPD con descendientes, **cuando** intento eliminar, **entonces** se muestra explicación + sugerencia.
**Deps:** Bloqueada por HU-20.015. **Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [validacion, integridad].

---

### HU-20.017 — Reordenar hermanos manualmente con arrastre en el árbol

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador experto, quiero arrastrar nodos para reordenar hermanos manualmente.
**Criterios:** **Dado** modo "Manual" activo (HU-20.019), **cuando** arrastro un nodo, **entonces** su orden cambia entre hermanos.
**Modelo:** `opd.ordenLocal: number` `[propuesta]`. **Patrones:** HU-SHARED-002.
**Deps:** Bloqueada por HU-20.019. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ordenamiento, manual].

---

### HU-20.018 — Reordenar hermanos automáticamente según canvas del padre

**Actor primario:** ME. **Tipo:** mixto. **Nivel:** L.
**Historia:** Como modelador experto, quiero que el árbol respete el orden Y de los procesos descompuestos en el canvas padre.
**Criterios:** **Dado** modo "Automático", **cuando** los subprocesos se renderizan, **entonces** el orden del árbol refleja `apariencia.y` de los subprocesos en el padre.
**Deps:** Bloqueada por HU-12.016. **Evidencia:** [V-35]. Clase: confirmado.
**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ordenamiento, automatico].

---

### HU-20.019 — Configurar modo Automático vs Manual en preferencias

**Actor primario:** AO. **Tipo:** opcloud-ui. **Nivel:** C.
**Historia:** Como administrador, quiero elegir cómo se ordena el árbol globalmente.
**Criterios:** preferencia con dos opciones; default "Automático".
**Modelo:** `usuario.preferencias.modoOrdenArbol`.
**Deps:** Bloqueada por HU-20.001. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [config].

---

### HU-20.020 — Abrir "Gestión del Árbol OPD" con Ctrl+D

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** U.
**Historia:** Como modelador experto, quiero un panel especializado para mover y reordenar OPDs masivamente.
**Criterios:** **Dado** Ctrl+D, **cuando** se abre, **entonces** se muestra panel con vista jerárquica + acciones masivas.
**Deps:** Bloqueada por HU-20.001. **Prioridad:** S. **Tamaño:** M. **Etiquetas:** [ui, gestion, atajo].

---

### HU-20.021 — Buscar OPD por nombre o número en gestión

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador, quiero buscar un OPD por su nombre o por SDn.
**Criterios:** caja de búsqueda dentro del panel de gestión con filtrado en vivo.
**Deps:** Bloqueada por HU-20.020. **Prioridad:** S. **Tamaño:** S. **Etiquetas:** [busqueda].

---

### HU-20.022 — Cortar y pegar nodos en gestión del árbol

**Actor primario:** ME. **Tipo:** opcloud-ui. **Nivel:** L.
**Historia:** Como modelador experto, quiero reorganizar OPDs con cortar/pegar para reestructurar el modelo.
**Criterios:**
- **Dado** OPD seleccionado, **cuando** elijo "Cortar", **entonces** se marca; al elegir destino y "Pegar", el OPD se mueve.
- **Dado** la operación rompería integridad (ciclos), **cuando** confirmo, **entonces** se rechaza.
**Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-20.020.
**Prioridad:** S. **Tamaño:** L. **Etiquetas:** [gestion, cut-paste].

---

## 4. Preguntas abiertas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q20.1 | ¿"Cortar y pegar" un OPD afecta las apariencias en el OPD padre original? | HU-20.022 |
| Q20.2 | ¿La búsqueda en gestión filtra por nombre exacto, prefijo o coincidencia parcial? | HU-20.021 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-004, HU-SHARED-005, HU-SHARED-008.
- Bloqueada por: EPICA-12 (descomposición), EPICA-17 (despliegue), EPICA-30 (carga).
