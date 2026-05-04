---
epica: "EPICA-12"
titulo: "Canvas — descomposición de procesos"
slug: "canvas-inzooming"
doc_fuente: "opcloud-reverse/12-canvas-inzooming.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "M0"
hu_emitidas: 34
hu_canonicas: 31
hu_stubs: 3
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Cubre el mecanismo de **descomposición** (in-zooming, en jerga OPCloud) de procesos: un proceso del OPD padre se transforma en un contenedor-envolvente que aloja sus subprocesos y objetos internos en un OPD hijo jerárquicamente ligado. Es el mecanismo primario de control de complejidad en OPM. Coordina: gesto de activación, creación automática de OPD hijo con denominación `SDn`, preservación de entidad única a través de apariencias [V-97], render del refinable con contorno grueso [V-33], edición dentro del contenedor (subprocesos, objetos internos, concurrencia), semántica temporal codificada en coordenada Y [V-35], distinción formal síncrónica (`se descompone en`) vs asíncrónica (`se despliega en`) [OPL-ES CX1/CX3], modo alternativo en diagrama, e integración con árbol OPD, panel OPL-ES y mini-navegador.

## 2. Tabla de HU

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-12.001 | Activar menú contextual sobre proceso seleccionado [absorbida en HU-SHARED-001] | — | — | — | — | — |
| HU-12.002 | Identificar opción "Descomponer" en menú contextual con tooltip | MN | M0 | XS | opcloud-ui | — |
| HU-12.003 | Ejecutar descomposición desde el menú contextual y crear OPD hijo | ME | M0 | L | opm-semantica | [Glos 3.31] [V-62] [V-79] |
| HU-12.004 | Crear nodo `SDn` automáticamente en el árbol OPD | MN | M0 | S | mixto | [Glos 3.31] |
| HU-12.005 | Denominar nodo hijo con patrón "SDn: <Proceso> descompuesto" | MN | M0 | XS | opcloud-ui | — |
| HU-12.006 | Cambiar área visible al OPD hijo tras ejecutar descomposición | ME | M0 | S | mixto | — |
| HU-12.007 | Preservar entidad única del proceso refinado a través de OPDs | ME | M0 | M | opm-semantica | [V-95] [V-96] [V-97] |
| HU-12.008 | Renderizar proceso refinado como contenedor-envolvente | MN | M0 | M | opm-semantica | [V-33] [V-34] [V-79] [JOYAS §1] |
| HU-12.009 | Etiquetar contenedor con nombre en posición superior-centro interior | MN | M0 | XS | opcloud-ui | [JOYAS §3] |
| HU-12.010 | Render de fase 1 "Mostrar contenido" con externos parciales | MN | S | M | opm-semantica | [V-62] [V-80] |
| HU-12.011 | Completar fase 2 "Refinar enlaces" con externos restantes | ME | S | L | mixto | [V-62] |
| HU-12.012 | Emitir oración OPL-ES "se descompone en" al ejecutar descomposición | MN | M0 | M | opm-semantica | [OPL-ES CX1] [OPL-ES §1.7] |
| HU-12.013 | Añadir cláusula "en esa secuencia" en OPL-ES | MN | M0 | S | opm-semantica | [OPL-ES CX1] [V-35] |
| HU-12.014 | Distinguir verbos OPL-ES de refinamiento (descompone vs despliega) | ME | M0 | M | opm-semantica | [Glos 3.31] [Glos 3.81] [OPL-ES CX1] [OPL-ES CX3] |
| HU-12.015 | Crear subproceso dentro del contenedor por arrastre | MN | M0 | M | opm-semantica | [V-79] [Glos 3.31] [Glos 3.58] |
| HU-12.016 | Codificar orden temporal por coordenada Y del subproceso | MN | M0 | M | opm-semantica | [V-35] [V-77] |
| HU-12.017 | Crear subprocesos concurrentes en misma Y y emitir "paralelo" en OPL-ES | ME | M0 | M | opm-semantica | [V-32] [OPL-ES CX2] |
| HU-12.018 | Crear objeto interno dentro del contenedor | MN | M0 | M | opm-semantica | [V-84] [V-85] [Glos 3.39] |
| HU-12.019 | Emitir conector OPL-ES para objetos internos | MN | M0 | S | mixto | [OPL-ES CX1] |
| HU-12.020 | Restringir objeto interno al interior del contenedor | ME | M1 | L | opm-semantica | [V-84] [V-85] |
| HU-12.021 | Expandir contenedor al intentar sacar objeto interno hacia fuera | ME | M1 | L | opcloud-ui | — |
| HU-12.022 | Conectar subproceso interno con objeto interno | ME | M0 | S | opm-semantica | [V-61] [V-239] [V-240] |
| HU-12.023 | Renombrar subproceso in situ con diálogo emergente [especializa HU-SHARED-004] | MN | M0 | S | mixto | [Glos 3.76] [V-97] |
| HU-12.024 | Propagar renombrado de subproceso a biblioteca lateral y OPL-ES | ME | M0 | S | opm-semantica | [V-97] |
| HU-12.025 | Navegar entre OPDs cliqueando nodos del árbol | MN | M0 | S | opcloud-ui | — |
| HU-12.026 | Navegar al OPD hijo existente al re-ejecutar descomposición | ME | M0 | S | opm-semantica | [V-62] |
| HU-12.027 | Eliminar descomposición y revertir proceso refinable a proceso simple | ME | S | L | opm-semantica | [V-84] |
| HU-12.028 | Acceder a descomposición de objeto en diagrama [absorbida en HU-10.021] | — | — | — | — | — |
| HU-12.029 | Respetar afiliación ambiental dentro del SD hijo | ME | M1 | M | opm-semantica | [V-71] [V-95] [JOYAS §1] |
| HU-12.030 | Restringir ambiental al interior del contenedor del SD hijo | ME | S | M | mixto | [V-84] [V-85] |
| HU-12.031 | Render "paréntesis" del contorno: enlace al borde distribuye a subprocesos | ME | S | L | mixto | [V-91] [V-92] |
| HU-12.032 | Actualizar mini-navegador al cambiar de OPD | MN | M1 | S | opcloud-ui | — |
| HU-12.033 | Mostrar in-context árbol OPD al ejecutar descomposición [absorbida en HU-12.025] | — | — | — | — | — |
| HU-12.034 | Persistir estado de árbol OPD expandido/colapsado [especializa estado UI] | ME | S | S | opcloud-ui | — |

30 canónicas, 4 stubs.

## 3. Historias de usuario

### HU-12.001 — Activar menú contextual sobre proceso seleccionado [absorbida en HU-SHARED-001]

**Estado:** absorbida-en-shared (2026-05-03).
**Canónica:** HU-SHARED-001.
**Especialización local:** contexto = Proceso. Acciones-escritura: Descomponer (HU-12.003), Renombrar (HU-SHARED-004), Cambiar afiliación, Cambiar esencia.

---

### HU-12.002 — Identificar opción "Descomponer" en menú contextual con tooltip

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel:** U.
**Superficie:** menú contextual.
**Gesto:** pasar el cursor sobre la entrada "Descomponer".

**Historia:**
> Como modelador novato, quiero que el menú contextual identifique claramente la acción de descomposición con un tooltip explicativo para no confundirla con otras operaciones de refinamiento.

**Contexto de negocio:** la descomposición es semánticamente densa; un tooltip reduce la curva de aprendizaje.

**Criterios de aceptación:**
- **Dado** que el menú contextual está abierto (HU-SHARED-001), **cuando** paso el cursor sobre "Descomponer", **entonces** aparece un tooltip "Crea un OPD hijo con los subprocesos del proceso seleccionado".

**Modelo de datos tocado:** UI transitoria.
**Patrones aplicados:** HU-SHARED-001.
**Dependencias:** Bloqueada por HU-SHARED-001.
**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [ui, tooltip, descomposicion].

---

### HU-12.003 — Ejecutar descomposición desde el menú contextual y crear OPD hijo

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario; V, P secundarios.
**Superficie:** canvas-OPD + árbol OPD.
**Gesto:** clic en "Descomponer" del menú contextual.

**Historia:**
> Como modelador, quiero ejecutar descomposición de un proceso para abrir un OPD hijo donde refinarlo en sus subprocesos y objetos internos.

**Contexto de negocio:** [Glos 3.31] descomposición. [V-62] regla del refinamiento. [V-79] proceso descompuesto como contenedor.

**Criterios de aceptación:**
- **Dado** que el proceso `P` está seleccionado y elijo "Descomponer", **cuando** la operación termina, **entonces**: (a) se crea un nuevo `opd` con id único y `nombre = "SDn"` donde `n` es el siguiente índice (HU-12.004); (b) `P` se marca como refinable y se renderiza como contenedor (HU-12.008); (c) la apariencia de `P` en el OPD padre permanece con tamaño expandido [V-33]; (d) la vista cambia al OPD hijo (HU-12.006); (e) el panel OPL-ES emite la oración "se descompone en" (HU-12.012).
- **Dado** que `P` ya tenía un OPD hijo, **cuando** vuelvo a invocar "Descomponer", **entonces** la operación navega al hijo existente sin duplicar (HU-12.026).
- **Dado** que el modo es read-only, **cuando** intento descomponer, **entonces** la acción es no-op.

**Reglas y restricciones:**
- La entidad `P` permanece única en `modelo.entidades`; se crean nuevas `apariencia` para subprocesos y objetos internos.
- La operación entra al stack undo (HU-SHARED-002) como una sola operación reversible.

**Modelo de datos tocado:**
- `opd.id`, `opd.nombre`, `opd.apariencias`, `opd.enlaces` — persistente.
- `modelo.opds[id]` — persistente.
- `[propuesta]` `entidad.refinanciaPor: { tipo: "descomposicion", opdId: Id }` — persistente.

**Patrones aplicados:** HU-SHARED-001, HU-SHARED-002, HU-SHARED-003, HU-SHARED-006, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-10.001.

**Notas de evidencia:** [Glos 3.31]; [V-62]; [V-79]. Fuente OPCloud: `opcloud-reverse/12-canvas-inzooming.md` §3.1. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** L. **Etiquetas:** [canvas, kernel, descomposicion, opd-hijo].

---

### HU-12.004 — Crear nodo `SDn` automáticamente en el árbol OPD

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel:** L primario; P secundario.
**Superficie:** árbol OPD.
**Gesto:** consecuencia de HU-12.003.

**Historia:**
> Como modelador, quiero que el árbol OPD muestre el OPD hijo como nuevo nodo bajo el padre apenas ejecuto la descomposición, para tener navegación inmediata.

**Criterios de aceptación:**
- **Dado** que ejecuté descomposición (HU-12.003), **cuando** el árbol se actualiza, **entonces** aparece un nodo hijo bajo el OPD padre con `nombre = "SDn"`.
- **Dado** que existían SD0, SD1, **cuando** creo otro hijo, **entonces** el nuevo se llama SD2 (incremento monotónico de `modelo.nextSeq` para OPDs).

**Modelo de datos tocado:** `opd.nombre`, `modelo.opds[id]`, `modelo.nextSeq`.

**Patrones aplicados:** HU-SHARED-002.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [Glos 3.31]. Clase: observado + canonizado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [arbol-opd, navegacion, descomposicion].

---

### HU-12.005 — Denominar nodo hijo con patrón "SDn: <Proceso> descompuesto"

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel:** L.
**Superficie:** árbol OPD.

**Historia:**
> Como modelador, quiero que el nodo del árbol muestre el patrón "SDn: <Proceso> descompuesto" para reconocer qué proceso refina.

**Criterios de aceptación:**
- **Dado** que se creó SD2 al descomponer `Atender Paciente`, **cuando** el árbol se renderiza, **entonces** el nodo aparece como `SD2: Atender Paciente descompuesto`.
- **Dado** que renombro el proceso refinado (HU-SHARED-004), **cuando** la operación termina, **entonces** el nodo del árbol se actualiza con el nuevo nombre (HU-12.024).

**Modelo de datos tocado:** lente derivada de `opd.nombre` y `entidad.nombre`.

**Patrones aplicados:** HU-SHARED-004.

**Dependencias:** Bloqueada por HU-12.004.

**Notas de evidencia:** Clase: observado.

**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [arbol-opd, label].

---

### HU-12.006 — Cambiar área visible al OPD hijo tras ejecutar descomposición

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel:** L primario; U secundario.
**Superficie:** canvas-OPD.

**Historia:**
> Como modelador, quiero que el canvas se cambie automáticamente al OPD hijo tras descomponer, para empezar a refinarlo sin un clic adicional.

**Criterios de aceptación:**
- **Dado** que ejecuté HU-12.003, **cuando** la operación termina, **entonces** el canvas activo cambia al OPD hijo (`ui.opdActivoId = opdHijo.id`).
- **Dado** que estoy en el OPD hijo, **cuando** el canvas se renderiza, **entonces** el viewport está centrado en el contenedor del proceso refinado.

**Modelo de datos tocado:** `ui.opdActivoId` — transitorio.

**Patrones aplicados:** HU-SHARED-002.

**Dependencias:** Bloqueada por HU-12.003.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [navegacion, viewport].

---

### HU-12.007 — Preservar entidad única del proceso refinado a través de OPDs

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario; V secundario.
**Superficie:** canvas-OPD + lente derivada.

**Historia:**
> Como modelador experto, quiero que el proceso refinado siga siendo una sola entidad en el modelo, con una apariencia en el padre y otra en el hijo, para preservar identidad semántica.

**Contexto de negocio:** [V-95], [V-96], [V-97] establecen que la entidad es única; las apariencias son múltiples.

**Criterios de aceptación:**
- **Dado** que descompuse `P`, **cuando** consulto `modelo.entidades`, **entonces** existe una sola entrada para `P` (no duplicada).
- **Dado** que existe `apariencia1` de `P` en el OPD padre y `apariencia2` en el OPD hijo, **cuando** consulto `modelo.apariencias`, **entonces** ambas referencian el mismo `entidad.id`.
- **Dado** que renombro `P` desde cualquier OPD, **cuando** la operación termina, **entonces** ambas apariencias muestran el nuevo nombre (HU-12.024).

**Modelo de datos tocado:** invariantes sobre `apariencia.entidadId`.

**Patrones aplicados:** HU-SHARED-004.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [V-95], [V-96], [V-97]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, entidad-unica, identidad].

---

### HU-12.008 — Renderizar proceso refinado como contenedor-envolvente

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel:** V primario.
**Superficie:** canvas-OPD del padre.

**Historia:**
> Como modelador, quiero que el proceso descompuesto se vea como un contenedor agrandado con contorno grueso para distinguirlo visualmente de un proceso simple.

**Contexto de negocio:** [V-33], [V-34] prescriben contorno grueso para refinables; [V-79] el contenedor-envolvente.

**Criterios de aceptación:**
- **Dado** que `P` está descompuesto, **cuando** se renderiza, **entonces** la apariencia en el OPD padre muestra contorno de mayor grosor (típicamente 4px vs 2px) con el mismo color cyan `#3BC3FF` y dimensiones expandidas para contener subprocesos.
- **Dado** que el contenedor está vacío, **cuando** se renderiza, **entonces** mantiene el tamaño mínimo expandido aunque no haya subprocesos.

**Reglas y restricciones:** la expansión ajusta `apariencia.width` y `apariencia.height` automáticamente al contenido.

**Modelo de datos tocado:** `apariencia.width`, `apariencia.height` — persistente.

**Patrones aplicados:** ninguno específico.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [V-33], [V-34], [V-79]. [JOYAS §1]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [render, contenedor, descomposicion].

---

### HU-12.009 — Etiquetar contenedor con nombre en posición superior-centro interior

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel:** V.
**Superficie:** canvas-OPD del padre.

**Historia:**
> Como modelador, quiero que el contenedor descompuesto muestre el nombre del proceso en su parte superior-centro interior para reconocerlo aún cuando contiene subprocesos.

**Criterios de aceptación:**
- **Dado** que `P` está descompuesto, **cuando** se renderiza, **entonces** el nombre `entidad.nombre` aparece en posición superior-centro dentro del contenedor (no en el centro como un proceso simple).
- **Dado** que el nombre es largo, **cuando** se renderiza, **entonces** se usa la función `refactorText` para escalado. [JOYAS §3]

**Modelo de datos tocado:** lente derivada de `entidad.nombre`.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.008.

**Notas de evidencia:** [JOYAS §3]. Clase: observado.

**Prioridad:** M0. **Tamaño:** XS. **Etiquetas:** [render, label, descomposicion].

---

### HU-12.010 — Render de fase 1 "Mostrar contenido" con externos parciales

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel:** V primario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador, quiero que al abrir el OPD hijo se muestren los enlaces externos del proceso padre que tocan los subprocesos descompuestos, para entender el contexto.

**Contexto de negocio:** [V-62] regla del refinamiento; [V-80] proyección de externos.

**Criterios de aceptación:**
- **Dado** que abrí el OPD hijo, **cuando** se renderiza, **entonces** los enlaces externos del padre que tienen extremo dentro del contenedor aparecen como conexiones al borde del OPD hijo (apariencias proxy).
- **Dado** que un enlace externo conecta `EntidadExterna → P`, **cuando** se renderiza el hijo, **entonces** aparece `EntidadExterna` (ambiental, semitransparente) conectada al subproceso correspondiente.

**Modelo de datos tocado:** lente derivada; `aparienciaEnlace` proxy.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [V-62], [V-80]. Clase: confirmado por SSOT.

**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [render, descomposicion, externos].

**Estado implementación MVP-alpha (2026-05-04):** parcial cubierto. Al crear el
OPD hijo se materializan apariencias de los extremos externos conectados al
proceso padre, ubicadas fuera del contorno. No se dibujan enlaces al contorno
para consumo/resultado.

---

### HU-12.011 — Completar fase 2 "Refinar enlaces" con externos restantes

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel:** K primario; V secundario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador experto, quiero que al refinar el OPD hijo, los enlaces externos del padre se redistribuyan a los subprocesos correctos para preservar la semántica.

**Criterios de aceptación:**
- **Dado** que el padre tiene `Agente → P`, **cuando** completo la fase 2 conectando `Agente → SubprocesoA`, **entonces** la coherencia con el padre se mantiene: el enlace externo `Agente → P` queda derivado de `Agente → SubprocesoA`.
- **Dado** que un externo no tiene destino refinado, **cuando** se renderiza, **entonces** se marca como "no refinado" con advertencia.

**Reglas y restricciones:** [V-62].

**Modelo de datos tocado:** `enlace.*` (potencialmente nuevos enlaces internos).

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.010.

**Notas de evidencia:** [V-62]. Clase: confirmado por SSOT.

**Prioridad:** S. **Tamaño:** L. **Etiquetas:** [kernel, descomposicion, externos, fase2].

**Estado implementación MVP-alpha (2026-05-04):** parcial cubierto. Al
descomponer, el kernel crea tres subprocesos iniciales y proyecta externos por
tipo: `consumo` deriva al primer subproceso por orden `y`, `resultado` deriva
desde el último subproceso por orden `y`, y `agente`/`instrumento`/`efecto`
quedan como enlaces del contorno/refinable hasta refinamiento explícito;
cubierto por unit test y smoke browser para consumo/resultado y por unit test
para habilitadores/efecto. Sigue pendiente la reasignación manual entre
subprocesos, advertencias de externos no refinados y split de
`effect`/estado-específicos.

---

### HU-12.012 — Emitir oración OPL-ES "se descompone en" al ejecutar descomposición

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel:** L primario; K secundario.
**Superficie:** panel OPL-ES.

**Historia:**
> Como modelador, quiero que el panel OPL-ES emita la oración "Proceso se descompone en SubA, SubB y SubC" tras descomponer, para verificar que la semántica se reflejó.

**Contexto de negocio:** [OPL-ES CX1] plantilla de descomposición síncrónica.

**Criterios de aceptación:**
- **Dado** que descompuse `Atender Paciente` en `Triaje`, `Examinar`, `Tratar`, **cuando** el panel se actualiza, **entonces** emite: `*Atender Paciente* se descompone en *Triaje*, *Examinar* y *Tratar*.`
- **Dado** que el orden temporal está codificado por Y, **cuando** se emite, **entonces** las cláusulas se ordenan según Y ascendente (HU-12.013).

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.003, HU-12.015.

**Notas de evidencia:** [OPL-ES CX1], [OPL-ES §1.7]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [opl, descomposicion].

---

### HU-12.013 — Añadir cláusula "en esa secuencia" en OPL-ES

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel:** L primario.
**Superficie:** panel OPL-ES.

**Historia:**
> Como modelador, quiero que la oración OPL-ES de descomposición incluya "en esa secuencia" cuando hay orden temporal codificado por Y para que la lectura natural exprese tiempo.

**Criterios de aceptación:**
- **Dado** que `Triaje.y < Examinar.y < Tratar.y`, **cuando** el OPL-ES emite, **entonces** la oración termina con `, en esa secuencia.`
- **Dado** que dos subprocesos están en la misma Y (concurrentes), **cuando** se emite, **entonces** se usa "en paralelo" para esos pares (HU-12.017).

**Modelo de datos tocado:** lente derivada de `apariencia.y` de subprocesos.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.012, HU-12.016.

**Notas de evidencia:** [OPL-ES CX1], [V-35]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, secuencia, temporalidad].

**Estado implementación MVP-alpha (2026-05-04):** cubierto minimo para procesos
de descomposicion con subprocesos internos ordenados por `y`; la OPL-ES emite
"en esa secuencia" cuando hay mas de un subproceso. Falta semantica de
paralelismo para subprocesos con la misma `y`.

---

### HU-12.014 — Distinguir verbos OPL-ES de refinamiento (descompone vs despliega)

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** L primario; K secundario.
**Superficie:** panel OPL-ES.

**Historia:**
> Como modelador experto, quiero que el OPL-ES use "se descompone en" para descomposición síncrónica de procesos y "se despliega en" para despliegue estructural de objetos, para no confundir mecanismos.

**Contexto de negocio:** [Glos 3.31] descomposición; [Glos 3.81] despliegue. Mecanismos distintos.

**Criterios de aceptación:**
- **Dado** que un proceso fue descompuesto, **cuando** OPL-ES emite, **entonces** usa "se descompone en" [OPL-ES CX1].
- **Dado** que un objeto fue desplegado (EPICA-17 o A0), **cuando** OPL-ES emite, **entonces** usa "se despliega en" [OPL-ES CX3].

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [Glos 3.31], [Glos 3.81], [OPL-ES CX1], [OPL-ES CX3]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [opl, descomposicion, despliegue].

---

### HU-12.015 — Crear subproceso dentro del contenedor por arrastre

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel:** K primario; V secundario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador, quiero arrastrar un proceso al interior del contenedor del OPD hijo para crear subprocesos del refinamiento.

**Criterios de aceptación:**
- **Dado** que estoy en el OPD hijo, **cuando** arrastro un proceso al interior del contenedor, **entonces** se crea como en HU-10.001 con `apariencia.opdId = opdHijo.id` y posición dentro del contenedor.
- **Dado** que arrastro al exterior del contenedor, **cuando** suelto, **entonces** la creación procede pero la entidad queda como objeto del OPD hijo no contenido (anómalo; advertencia o auto-corrección).

**Modelo de datos tocado:** ver HU-10.001 con `apariencia.opdId = opdHijo.id`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [V-79], [Glos 3.58]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [canvas, kernel, subproceso].

---

### HU-12.016 — Codificar orden temporal por coordenada Y del subproceso

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel:** K primario; V secundario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador, quiero que el orden temporal de los subprocesos se infiera de su coordenada Y para que mover un subproceso verticalmente reordene la secuencia.

**Contexto de negocio:** [V-35] codifica tiempo en eje Y; [V-77] orden temporal.

**Criterios de aceptación:**
- **Dado** que tengo subprocesos en Y diferentes, **cuando** se infiere el orden, **entonces** se ordenan por Y ascendente.
- **Dado** que muevo un subproceso a una nueva Y, **cuando** la operación termina, **entonces** OPL-ES re-emite la secuencia con el nuevo orden (HU-12.013).

**Modelo de datos tocado:** lente derivada de `apariencia.y`.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.015.

**Notas de evidencia:** [V-35], [V-77]. Clase: confirmado por SSOT.

**Estado implementación MVP-alpha (2026-05-04):** cubierto minimo como lente
derivada de `apariencia.y`: la OPL de descomposicion se ordena por `y` y luego
por `x`. Falta validar reordenamiento completo tras drag dentro del contorno.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, temporalidad, orden].

---

### HU-12.017 — Crear subprocesos concurrentes en misma Y y emitir "paralelo" en OPL-ES

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario.
**Superficie:** canvas-OPD del hijo + panel OPL-ES.

**Historia:**
> Como modelador experto, quiero que dos subprocesos en la misma Y se interpreten como concurrentes y el OPL-ES emita "en paralelo" para reflejarlo.

**Criterios de aceptación:**
- **Dado** que `SubA.y = SubB.y`, **cuando** OPL-ES emite, **entonces** la oración incluye `*SubA* y *SubB* en paralelo`.
- **Dado** que hay tres subprocesos con dos en misma Y, **cuando** OPL-ES emite, **entonces** mantiene la secuencia y agrupa los paralelos.

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.016.

**Notas de evidencia:** [V-32], [OPL-ES CX2]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [kernel, concurrencia, opl].

---

### HU-12.018 — Crear objeto interno dentro del contenedor

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel:** K primario; V secundario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador, quiero crear objetos dentro del contenedor descompuesto para representar entidades manejadas internamente por el proceso.

**Criterios de aceptación:**
- **Dado** que arrastro un objeto al interior del contenedor, **cuando** la creación termina, **entonces** se crea con `apariencia.opdId = opdHijo.id` dentro del contenedor.
- **Dado** que el objeto interno tiene afiliación ambiental [V-71], **cuando** se renderiza, **entonces** se distingue por borde discontinuo y aplica las restricciones de HU-12.030.

**Modelo de datos tocado:** ver HU-10.002 con `apariencia.opdId = opdHijo.id`.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [V-84], [V-85], [Glos 3.39]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** M. **Etiquetas:** [canvas, kernel, objeto-interno].

---

### HU-12.019 — Emitir conector OPL-ES para objetos internos

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel:** L primario.
**Superficie:** panel OPL-ES.

**Historia:**
> Como modelador, quiero que el OPL-ES emita el rol del objeto interno respecto al proceso refinado para que la lectura sea coherente.

**Criterios de aceptación:**
- **Dado** que existe un objeto interno `O` con enlace a un subproceso, **cuando** OPL-ES emite, **entonces** la oración refleja la conexión: `*Subproceso* consume **O**.` o variante según tipo de enlace.

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.018, HU-12.022.

**Notas de evidencia:** [OPL-ES CX1]. Clase: observado + confirmado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [opl, objeto-interno].

---

### HU-12.020 — Restringir objeto interno al interior del contenedor

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador experto, quiero que los objetos internos no puedan moverse fuera del contenedor del OPD hijo para preservar la semántica de pertenencia.

**Criterios de aceptación:**
- **Dado** que un objeto interno está dentro del contenedor, **cuando** intento arrastrarlo fuera, **entonces** la posición se restringe (snap al borde interior) o se ofrece expandir el contenedor (HU-12.021).
- **Dado** que el contenedor es del OPD raíz, **cuando** el objeto interno se mueve, **entonces** la restricción no aplica (no hay "fuera").

**Modelo de datos tocado:** validación sobre `apariencia.x`, `apariencia.y`.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.018.

**Notas de evidencia:** [V-84], [V-85]. Clase: confirmado por SSOT.

**Prioridad:** M1. **Tamaño:** L. **Etiquetas:** [kernel, restriccion, objeto-interno].

---

### HU-12.021 — Expandir contenedor al intentar sacar objeto interno hacia fuera

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel:** V primario; U secundario.
**Superficie:** canvas-OPD.

**Historia:**
> Como modelador experto, quiero que al intentar arrastrar un objeto interno fuera del contenedor, el contenedor se expanda automáticamente para acomodarlo.

**Criterios de aceptación:**
- **Dado** que arrastro un objeto interno hacia el borde del contenedor, **cuando** sobrepasa el límite, **entonces** el contenedor se expande automáticamente y el objeto sigue dentro.
- **Dado** que el contenedor llega a un tamaño máximo, **cuando** intento expandir más, **entonces** la operación se bloquea con advertencia.

**Modelo de datos tocado:** `apariencia.width`, `apariencia.height` del contenedor.

**Patrones aplicados:** HU-SHARED-002.

**Dependencias:** Bloqueada por HU-12.020.

**Notas de evidencia:** Clase: observado.

**Prioridad:** M1. **Tamaño:** L. **Etiquetas:** [render, contenedor, expansion].

---

### HU-12.022 — Conectar subproceso interno con objeto interno

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador, quiero conectar subprocesos con objetos internos del contenedor mediante enlaces canónicos para representar las transformaciones del refinamiento.

**Criterios de aceptación:**
- **Dado** que arrastro enlace de subproceso a objeto interno, **cuando** elijo tipo (consumo, efecto, resultado), **entonces** la conexión sigue las reglas de HU-10.007 a HU-10.011.
- **Dado** que el enlace cruza el borde del contenedor (a un objeto externo), **cuando** confirmo, **entonces** la operación procede pero genera enlaces externos en el padre (fase 2; HU-12.011).

**Modelo de datos tocado:** ver HU-10.011.

**Patrones aplicados:** HU-SHARED-002, HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.015, HU-12.018.

**Notas de evidencia:** [V-61], [V-239], [V-240]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [canvas, kernel, enlace, refinamiento].

---

### HU-12.023 — Renombrar subproceso in situ con diálogo emergente [especializa HU-SHARED-004]

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel:** K primario; U secundario.
**Superficie:** diálogo de nombre.

**Historia:**
> Como modelador, quiero renombrar subprocesos del refinamiento usando la misma mecánica que en HU-10.003 / HU-SHARED-004.

**Criterios de aceptación:** ver HU-SHARED-004 con scope = entidad subproceso del OPD hijo.
- **Dado** que la entidad refinada es la misma (HU-12.007), **cuando** renombro el padre, **entonces** todas sus apariencias muestran el nuevo nombre (HU-12.024).

**Modelo de datos tocado:** `entidad.nombre`.

**Patrones aplicados:** HU-SHARED-004, HU-SHARED-009.

**Dependencias:** Bloqueada por HU-SHARED-004.

**Notas de evidencia:** [Glos 3.76], [V-97]. Clase: observado + canonizado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [renombrar, subproceso].

---

### HU-12.024 — Propagar renombrado de subproceso a biblioteca lateral y OPL-ES

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** L primario.
**Superficie:** biblioteca lateral, panel OPL-ES, árbol OPD.

**Historia:**
> Como modelador, quiero que el renombrado se propague a todas las superficies para mantener consistencia.

**Criterios de aceptación:**
- **Dado** que renombré una entidad, **cuando** la operación termina, **entonces** la biblioteca, el panel OPL-ES, el árbol OPD (incluyendo el patrón "SDn: <Proceso> descompuesto") y todas las apariencias muestran el nuevo nombre.

**Modelo de datos tocado:** lente derivada de `entidad.nombre`.

**Patrones aplicados:** HU-SHARED-007.

**Dependencias:** Bloqueada por HU-12.023.

**Notas de evidencia:** [V-97]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [propagacion, consistencia].

---

### HU-12.025 — Navegar entre OPDs cliqueando nodos del árbol

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel:** L primario; U secundario.
**Superficie:** árbol OPD.

**Historia:**
> Como modelador, quiero clicar nodos del árbol OPD para navegar entre OPDs sin perder el modelo.

**Criterios de aceptación:**
- **Dado** que clico el nodo `SD2`, **cuando** la acción termina, **entonces** `ui.opdActivoId = SD2.id` y el canvas se rerenderiza con su contenido.
- **Dado** que el modelo es grande, **cuando** cambio de OPD, **entonces** el cambio es perceptiblemente inmediato (<200ms para OPDs típicos).

**Modelo de datos tocado:** `ui.opdActivoId`.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.004.

**Notas de evidencia:** Clase: observado.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [arbol-opd, navegacion].

---

### HU-12.026 — Navegar al OPD hijo existente al re-ejecutar descomposición

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario; L secundario.
**Superficie:** menú contextual.

**Historia:**
> Como modelador, quiero que al invocar "Descomponer" sobre un proceso ya descompuesto, el sistema navegue al OPD hijo existente en lugar de crear uno nuevo.

**Criterios de aceptación:**
- **Dado** que `P` ya tiene `entidad.refinanciaPor.opdId = SD2`, **cuando** invoco "Descomponer", **entonces** la acción navega a SD2 (idempotencia) sin duplicar.

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** HU-SHARED-001.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [V-62]. Clase: confirmado por SSOT.

**Prioridad:** M0. **Tamaño:** S. **Etiquetas:** [navegacion, idempotencia].

---

### HU-12.027 — Eliminar descomposición y revertir proceso refinable a proceso simple

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario; L secundario.
**Superficie:** menú contextual + diálogo de confirmación.

**Historia:**
> Como modelador experto, quiero eliminar la descomposición de un proceso para revertirlo a proceso simple cuando el refinamiento es incorrecto.

**Criterios de aceptación:**
- **Dado** que `P` está descompuesto en SD2, **cuando** elijo "Eliminar descomposición" y confirmo, **entonces** el OPD hijo SD2 se elimina con cascada (HU-SHARED-005 scope OPD), `entidad.refinanciaPor` se limpia, y `P` vuelve a render simple.
- **Dado** que SD2 contenía sub-OPDs, **cuando** se elimina, **entonces** la cascada se aplica recursivamente con confirmación adicional.

**Modelo de datos tocado:** `modelo.opds[id]` se elimina; `entidad.refinanciaPor` se limpia.

**Patrones aplicados:** HU-SHARED-005, HU-SHARED-002, HU-SHARED-001.

**Dependencias:** Bloqueada por HU-12.003.

**Notas de evidencia:** [V-84]. Clase: inferido + canonizado.

**Prioridad:** S. **Tamaño:** L. **Etiquetas:** [kernel, eliminar, descomposicion].

---

### HU-12.028 — Acceder a descomposición de objeto en diagrama [absorbida en HU-10.021]

**Estado:** absorbida (2026-05-03).
**Canónica:** HU-10.021 — Descomposición de objeto en el mismo diagrama.
**Razón:** la mecánica de descomposición in-diagram para objetos vive en EPICA-10 con scope unificado.

---

### HU-12.029 — Respetar afiliación ambiental dentro del SD hijo

**Actor primario:** ME.
**Tipo:** opm-semantica.
**Nivel:** K primario; V secundario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador experto, quiero que las cosas con afiliación ambiental aparezcan en el SD hijo manteniendo borde discontinuo.

**Criterios de aceptación:**
- **Dado** que un objeto interno tiene `afiliacion = "ambiental"`, **cuando** se renderiza en SD hijo, **entonces** mantiene borde discontinuo (HU-10.015) [V-1].
- **Dado** que un externo proxy es ambiental, **cuando** se renderiza en el borde del SD hijo, **entonces** mantiene su distinción.

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.018.

**Notas de evidencia:** [V-71], [V-95]. [JOYAS §1]. Clase: confirmado por SSOT.

**Prioridad:** M1. **Tamaño:** M. **Etiquetas:** [render, ambiental, descomposicion].

---

### HU-12.030 — Restringir ambiental al interior del contenedor del SD hijo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel:** K primario.
**Superficie:** canvas-OPD del hijo.

**Historia:**
> Como modelador experto, quiero que un objeto ambiental dentro del SD hijo no pueda moverse fuera del contenedor para preservar coherencia con HU-12.020.

**Criterios de aceptación:** misma que HU-12.020 con la condición adicional de `afiliacion = "ambiental"`.

**Modelo de datos tocado:** validación sobre `apariencia` con `entidad.afiliacion`.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.020.

**Notas de evidencia:** [V-84], [V-85]. Clase: confirmado por SSOT.

**Prioridad:** S. **Tamaño:** M. **Etiquetas:** [kernel, restriccion, ambiental].

---

### HU-12.031 — Render "paréntesis" del contorno: enlace al borde distribuye a subprocesos

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel:** V primario.
**Superficie:** canvas-OPD del padre.

**Historia:**
> Como modelador experto, quiero que un enlace al contorno del proceso descompuesto se interprete visualmente como conectado a todos sus subprocesos para preservar lectura del padre.

**Criterios de aceptación:**
- **Dado** que un externo conecta a `P` (descompuesto), **cuando** se renderiza en el padre, **entonces** el enlace toca el contorno y la lectura semántica es "conecta a P (que se descompone)".
- **Dado** que el SD hijo está abierto, **cuando** se renderiza el externo, **entonces** se distribuye a los subprocesos relevantes (HU-12.010).

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.008.

**Notas de evidencia:** [V-91], [V-92]. Clase: confirmado por SSOT.

**Prioridad:** S. **Tamaño:** L. **Etiquetas:** [render, contorno, distribucion].

---

### HU-12.032 — Actualizar mini-navegador al cambiar de OPD

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel:** L.
**Superficie:** mini-navegador.

**Historia:**
> Como modelador, quiero que el mini-navegador se actualice al cambiar de OPD para mantener orientación visual.

**Criterios de aceptación:**
- **Dado** que cambio de OPD (HU-12.025/26), **cuando** la operación termina, **entonces** el mini-navegador refleja el OPD activo.

**Modelo de datos tocado:** lente derivada.

**Patrones aplicados:** ninguno.

**Dependencias:** Bloqueada por HU-12.025.

**Notas de evidencia:** Clase: observado.

**Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [mini-navegador].

---

### HU-12.033 — Mostrar in-context árbol OPD al ejecutar descomposición [absorbida en HU-12.025]

**Estado:** absorbida (2026-05-03).
**Canónica:** HU-12.025.
**Razón:** la actualización del árbol al cambiar de OPD es subset de la navegación canónica.

---

### HU-12.034 — Persistir estado de árbol OPD expandido/colapsado

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel:** L primario; P secundario.
**Superficie:** árbol OPD.

**Historia:**
> Como modelador, quiero que mi configuración de árbol expandido/colapsado se conserve entre sesiones para no reabrir nodos cada vez.

**Criterios de aceptación:**
- **Dado** que expando ciertos nodos, **cuando** cierro y reabro el modelo, **entonces** los mismos nodos siguen expandidos.

**Modelo de datos tocado:** `[propuesta]` `ui.arbolOpdExpandido: Set<Id>` — persistente local.

**Patrones aplicados:** ninguno, HU-SHARED-002.

**Dependencias:** Bloqueada por HU-12.025.

**Notas de evidencia:** Clase: observado.

**Prioridad:** S. **Tamaño:** S. **Etiquetas:** [arbol-opd, persistencia, ux].

---

## 4. Preguntas abiertas derivadas

| Código | Pregunta | Bloquea |
|---|---|---|
| Q12.1 | Semántica precisa de "descomposición en el mismo diagrama" vs OPD hijo. | HU-10.021 |
| Q12.2 | ¿La fase 2 "Refinar enlaces" es manual u ofrece autodistribución por afinidad? | HU-12.011 |
| Q12.3 | Comportamiento de eliminación de descomposición cuando hay sub-OPDs encadenados. | HU-12.027 |
| Q12.4 | ¿Cómo se rinde un externo proxy en el SD hijo: con stroke distintivo o transparencia? | HU-12.010 |

## 5. Referencias cruzadas

- Patrones: HU-SHARED-001 (menú), HU-SHARED-002 (undo), HU-SHARED-004 (renombrar), HU-SHARED-005 (eliminar), HU-SHARED-007 (OPL).
- Bloquea a: EPICA-13 (estados en subprocesos), EPICA-15 (enlaces avanzados al borde), EPICA-20 (árbol OPD).
