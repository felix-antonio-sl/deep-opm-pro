---
epica: "EPICA-30"
titulo: "Persistencia — guardar/cargar, diálogos modales, versiones, archivado, búsqueda global, autosalvado"
doc_fuente: "opcloud-reverse/30-persistencia-save-load.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "M0"
hu_emitidas: 37
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta épica cubre el **ciclo de vida básico de persistencia** del modelador: creación de modelo nuevo, primer guardado, guardado incremental, `Guardar como`, carga de modelos existentes, navegación jerárquica por el workspace (`Home/...`), historial de versiones con política de retención log-scale, gestión de archivados, búsqueda global por nombre, y autosalvado periódico. Incluye la invocación desde la **barra de herramientas principal** y desde el **menú principal** (hamburguesa), y los dos diálogos modales centrales (`Guardar Modelo`, `Cargar Modelo`).

Queda fuera de esta épica: permisos sobre carpetas/modelos (EPICA-40), organización de workspace a nivel de carpetas (EPICA-31), composición inter-modelo vía sub-models (EPICA-32), plantillas (EPICA-33), wizard de creación inicial (EPICA-34) y move/búsqueda de things dentro del modelo (EPICA-35).

La épica es **casi íntegramente UI + persistencia**: el canvas se conserva como telón de fondo pero toda la acción ocurre sobre chrome (menú lateral, modales, controles de vista). El kernel OPM no se toca — solo se serializa/deserializa en entrada y salida.

Las HU se numeran siguiendo la aparición en el doc fuente (§2–§9), sin reordenar por prioridad. El mapa de correspondencia con las secciones del doc fuente se documenta en cada HU.

## Tabla de HU de la épica

| ID | Título | Actor | Prioridad | Tamaño | Tipo | SSOT |
|---|---|---|---|---|---|---|---|
| HU-30.001 | Abrir menú principal hamburguesa desde barra de herramientas | MN | M0 | XS | opcloud-ui | — |
| HU-30.002 | Ver botón Guardar (diskette) en barra de herramientas principal | MN | M0 | XS | opcloud-ui | — |
| HU-30.003 | Ver botón Cargar (carpeta) en barra de herramientas principal | MN | M0 | XS | opcloud-ui | — |
| HU-30.004 | Ver pestaña superior Modelo (No guardado) antes del primer guardado | MN | M0 | XS | opcloud-ui | — |
| HU-30.005 | Primer Guardar equivale a Guardar como (abre diálogo modal Guardar Modelo) | MN | M0 | M | opcloud-ui | — |
| HU-30.006 | Ingresar Nombre del Modelo en diálogo Guardar Modelo | MN | M0 | S | opcloud-ui | — |
| HU-30.007 | Ingresar Descripción opcional en diálogo Guardar Modelo | MN | S | XS | opcloud-ui | — |
| HU-30.008 | Persistir payload OPM íntegro al guardar (layout, stroke, dash, alias) | MN | M0 | L | mixto | — |
| HU-30.009 | Navegar breadcrumb jerárquico Home/.../... en diálogo modal | MN | M0 | S | opcloud-ui | — |
| HU-30.010 | Retroceder un nivel con botón Atrás o flecha < | MN | M0 | XS | opcloud-ui | — |
| HU-30.011 | Ver grid Modelos Recientes siempre visible en el diálogo modal | ME | M1 | S | opcloud-ui | — |
| HU-30.012 | Ver canvas como telón de fondo durante diálogo modal (oscurecido 40-60%) | MN | M1 | XS | opcloud-ui | — |
| HU-30.013 | Guardar incremental con toast "guardado exitosamente" | MN | M0 | S | mixto | — |
| HU-30.014 | Ctrl+S dispara guardado equivalente al botón Guardar | ME | M0 | XS | mixto | — |
| HU-30.015 | Guardar como sobre modelo persistido (Nombre pre-cargado) | ME | M0 | M | opcloud-ui | — |
| HU-30.016 | Renombrar modelo existente con Renombrar sin Guardar como | ME | M1 | S | opcloud-ui | — |
| HU-30.017 | Crear modelo nuevo desde Nuevo Modelo (canvas vacío) | MN | M0 | S | mixto | — |
| HU-30.018 | Abrir diálogo modal Cargar Modelo desde barra de herramientas o menú principal | MN | M0 | S | opcloud-ui | — |
| HU-30.019 | Cargar modelo con doble clic sobre tile | MN | M0 | S | mixto | — |
| HU-30.020 | Cargar modelo con clic + botón Cargar | MN | M0 | XS | opcloud-ui | — |
| HU-30.021 | Cargar Ejemplo ▸ Ejemplos Globales | PD | S | M | opcloud-ui | — |
| HU-30.022 | Cargar Ejemplo ▸ Ejemplos Organizacionales | AD | S | M | opcloud-ui | — |
| HU-30.023 | Activar toggle Mostrar Versiones (carpetas `<Modelo> Versiones`) | ME | M1 | M | opcloud-ui | — |
| HU-30.024 | Aplicar política de retención log-scale (10/día, 1/sem, 1/mes, máx 12) | ME | M1 | L | opcloud-ui | — |
| HU-30.025 | Activar toggle Mostrar Archivados (modelos archivados + columna Archivado) | ME | M1 | M | opcloud-ui | — |
| HU-30.026 | Auto-archivar modelo no abierto durante 90 días | AO | S | M | opcloud-ui | — |
| HU-30.027 | Restaurar modelo archivado con Restaurar | ME | S | S | opcloud-ui | — |
| HU-30.028 | Buscar modelos por nombre en Búsqueda (filtro local) | ME | M1 | S | opcloud-ui | — |
| HU-30.029 | Activar Incluir Todas las Subcarpetas para búsqueda global con 3+ caracteres | ME | M1 | M | opcloud-ui | — |
| HU-30.030 | Crear carpeta nueva desde Nueva Carpeta | ME | M1 | S | opcloud-ui | — |
| HU-30.031 | Renombrar carpeta seleccionada con Renombrar | ME | M1 | S | opcloud-ui | — |
| HU-30.032 | Alternar vista tiles vs vista lista en diálogo modal | ME | S | S | opcloud-ui | — |
| HU-30.033 | Ordenar vista lista por Modelo/Descripción/Fecha/Autor | ME | S | S | opcloud-ui | — |
| HU-30.034 | Ver glifos editable/candado/autosalvado en tiles de modelo | MN | M1 | S | opcloud-ui | — |
| HU-30.035 | Autosalvado cada 5 minutos con glifo de flechas circulares | ME | S | M | opcloud-ui | — |
| HU-30.036 | Redirigir Guardar a Guardar como en modelo de solo lectura | CO | S | S | opcloud-ui | — |
| HU-30.037 | Cancelar diálogo modal con Cancelar o ESC sin persistir | MN | M0 | XS | mixto | — |

Total: **37 historias de usuario** (31 opcloud-ui, 6 mixto).

## Historias de usuario

### HU-30.001 — Abrir menú principal hamburguesa desde la barra de herramientas

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** barra-herramientas-principal-azul + menu-principal-lateral-izquierdo.
**Gesto canónico:** clic en botón hamburguesa (esquina superior izquierda).

**Historia:**
> Como modelador, quiero abrir el menú principal desde el botón hamburguesa para acceder a todas las operaciones de persistencia, settings, imports/exports y ayuda desde un único punto.

**Contexto de negocio:**
El menú principal concentra las operaciones con parámetros (`Guardar como`, `Cargar Ejemplo`, `Opciones de Modelo`, `Importar Modelo`, `Exportaciones`, `Configuración OPCloud`, `Acerca de`, `Ayuda`). El botón hamburguesa es el único punto de entrada; su visibilidad persistente en la barra de herramientas es crítica para descubrimiento.

**Criterios de aceptación:**
- **Dado** que estoy en el modelador con un modelo activo, **cuando** miro la esquina superior izquierda de la barra de herramientas principal azul, **entonces** veo el botón hamburguesa persistente.
- **Dado** que hago clic en el botón hamburguesa, **cuando** se procesa el gesto, **entonces** se abre el menú principal como overlay lateral izquierdo.
- **Dado** que el menú principal está abierto, **cuando** hago clic de nuevo en la hamburguesa o fuera del panel, **entonces** se cierra.
- **Dado** que el menú principal está abierto, **cuando** miro las entradas, **entonces** veo `Nuevo Modelo`, `Cargar Modelo`, `Cargar Ejemplo ▸`, `Guardar`, `Guardar como`, `Model Options ▸`, `Importar Modelo`, `Exports ▸`, `Configuración OPCloud`, `Acerca de`, `Ayuda`.

**Reglas y restricciones:**
- El botón hamburguesa es persistente, nunca se oculta.
- El menú principal es modal no-bloqueante: el canvas queda visible detrás.
- Las entradas con `▸` expanden submenús in-place.

**Modelo de datos tocado:**
- Ninguno directo (UI transitoria).

**Dependencias:**
- Bloquea a: HU-30.005, HU-30.017, HU-30.018, HU-30.021, HU-30.022.

**Integraciones:**
- Ninguna semántica; puramente UI.

**Notas de evidencia:**
- Fuente: `opcloud-reverse/30-persistencia-save-load.md` §2 tabla, §7.3.
- Frames: frame_00011 (menú principal abierto con Cargar Example expandido).
- Transcripción: revisada en carpeta 02 Main Menu Saving Loading.
- Clase de afirmación: observado + confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [ui, menu-principal, hamburguesa, barra de herramientas].

---

### HU-30.002 — Ver botón Guardar (diskette) en barra de herramientas principal

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** barra-herramientas-principal-azul (zona central-derecha).
**Gesto canónico:** ninguno (afordance visual).

**Historia:**
> Como modelador, quiero ver un botón Guardar visible y persistente en la barra de herramientas principal para guardar sin abrir el menú hamburguesa.

**Contexto de negocio:**
El Guardar de un clic es el gesto más frecuente del modelador. Exponerlo duplicado en la barra de herramientas (además de en el menú principal) reduce la fricción de un gesto crítico que debe ser una operación sin latencia cognitiva.

**Criterios de aceptación:**
- **Dado** que estoy en el modelador, **cuando** miro la barra de herramientas principal azul, **entonces** veo el ícono de diskette en la zona central-derecha.
- **Dado** que paso el cursor sobre el ícono, **cuando** espero el tooltip, **entonces** aparece el texto `Guardar` (o equivalente localizado).
- **Dado** que hago clic en el botón, **cuando** se procesa, **entonces** se dispara el flow de save (primer save → diálogo Guardar Modelo; incremental → toast).

**Reglas y restricciones:**
- El botón es persistente: nunca se oculta.
- Comparte comportamiento con la entrada `Guardar` del menú principal y con `Ctrl+S`.

**Dependencias:**
- Bloquea a: HU-30.005, HU-30.013.

**Integraciones:**
- Main menu: duplica `Guardar`.

**Notas de evidencia:**
- Fuente: §2 tabla, §7.1.
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [ui, barra de herramientas, save].

---

### HU-30.003 — Ver botón Cargar (carpeta) en barra de herramientas principal

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** barra-herramientas-principal-azul (junto al botón Guardar).
**Gesto canónico:** ninguno (afordance visual).

**Historia:**
> Como modelador, quiero ver un botón Cargar visible en la barra de herramientas principal para cargar un modelo sin pasar por el menú principal.

**Contexto de negocio:**
Simetría con HU-30.002: si Guardar está en barra de herramientas, Cargar también debe estarlo. La pareja Guardar/Cargar conforma el par canónico de persistencia visible.

**Criterios de aceptación:**
- **Dado** que estoy en el modelador, **cuando** miro la barra de herramientas principal, **entonces** veo el ícono de carpeta/upload adyacente al botón Guardar.
- **Dado** que hago clic en el botón, **cuando** se procesa, **entonces** se abre el diálogo `Cargar Modelo`.

**Reglas y restricciones:**
- Duplicación de la entrada `Cargar Modelo` del menú principal.

**Dependencias:**
- Bloquea a: HU-30.018.

**Integraciones:**
- Main menu: duplica `Cargar Modelo`.

**Notas de evidencia:**
- Fuente: §2 tabla, §7.1.
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [ui, barra de herramientas, load].

---

### HU-30.004 — Ver pestaña superior Model (No guardado) antes del primer save

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (eco de estado).
**Superficie UI:** pestaña-superior bajo la barra de herramientas principal.
**Gesto canónico:** ninguno (afordance visual).

**Historia:**
> Como modelador, quiero ver el indicador `Modelo (No guardado)` en la pestaña mientras el modelo no tiene identidad persistente para saber que mis cambios son volátiles.

**Contexto de negocio:**
El estado de persistencia debe ser siempre visible y no invasivo. El pestaña es la ubicación más natural para eco de identidad + estado. Un modelo sin guardar es vulnerable a pérdida; señalizarlo es una salvaguarda UX básica.

**Criterios de aceptación:**
- **Dado** que abro un modelo nuevo con `Nuevo Modelo` o recién cargué el modelador, **cuando** miro la pestaña, **entonces** muestra `Modelo (No guardado)`.
- **Dado** que realizo el primer save exitoso con nombre `X`, **cuando** se cierra el modal, **entonces** la pestaña pasa a mostrar `X` sin sufijo.
- **Dado** que hago cambios después del save (modelo "dirty"), **cuando** miro la pestaña, **entonces** se muestra con marcador dirty (indicador exacto: **pregunta abierta** §11 doc fuente).
- **Dado** que la pestaña muestra un nombre, **cuando** paso el cursor sobre el prefijo `x`, **entonces** puedo cerrar la pestaña.

**Reglas y restricciones:**
- El sufijo `(No guardado)` aplica cuando `modelo.id` no ha sido asignado todavía.
- Comportamiento del indicador dirty post-guardado: **pregunta abierta** (Q30.A).

**Modelo de datos tocado:**
- `modelo.id` — UUID nullable — persistente tras primer save.
- `modelo.name` — string — persistente.

**Dependencias:**
- Relaciona: HU-10.022 (equivalente en EPICA-10 durante creación inicial).
- Bloqueada por: HU-30.005 (transición sale del estado `(No guardado)`).

**Integraciones:**
- Eco de estado desde el módulo de persistencia.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.1, §7.2.
- Transcripción: confirmado.
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.
- Etiqueta: `requires-clarification` (comportamiento dirty).

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [ui, pestaña, persistencia-indicador, requires-clarification].

---

### HU-30.005 — Primer Guardar equivalente a Guardar como (abre diálogo Guardar Modelo)

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** barra-herramientas-principal (botón Guardar) + menu-principal (Guardar / Guardar como) + dialogo-guardar-modelo.
**Gesto canónico:** clic en cualquiera de las tres rutas.

**Historia:**
> Como modelador novato, quiero que la primera vez que pulse `Guardar` se abra el mismo diálogo que `Guardar como` para asignar nombre y ubicación sin tener que entender la diferencia.

**Contexto de negocio:**
El novato no distingue Guardar de Guardar como; OPCloud zanja esta ambigüedad haciendo que el primer guardado **sea** Guardar como. Este colapso reduce un paso cognitivo sin perder la flexibilidad para usuarios expertos que quieren Guardar como explícito después.

**Criterios de aceptación:**
- **Dado** que el modelo nunca fue persistido (pestaña muestra `Modelo (No guardado)`), **cuando** pulso `Guardar` en la barra de herramientas principal, **entonces** se abre el diálogo `Guardar Modelo` con campos vacíos.
- **Dado** el mismo estado inicial, **cuando** pulso `Guardar` en el menú principal, **entonces** se abre el mismo diálogo.
- **Dado** el mismo estado inicial, **cuando** pulso `Guardar como` en el menú principal, **entonces** se abre el mismo diálogo.
- **Dado** que el diálogo se abre, **cuando** miro la estructura, **entonces** veo `Nombre del Modelo`, `Descripción`, botón `Guardar` lateral, `Búsqueda`, toggles `Mostrar Versiones` / `Mostrar Archivados`, breadcrumb en `Home`, grid de `Modelos Recientes`, grid de carpetas, y botones al pie (`Guardar`, `Nueva Carpeta`, `Renombrar`, `Atrás`, `Cancelar`).

**Reglas y restricciones:**
- Regla de colapso: `primerGuardado() === guardarComo()`.
- El breadcrumb arranca en `Home` por defecto en el primer guardado.

**Modelo de datos tocado:**
- Ninguno directo hasta confirmación (ver HU-30.008).

**Dependencias:**
- Bloqueada por: HU-30.001, HU-30.002.
- Bloquea a: HU-30.006, HU-30.007, HU-30.008, HU-30.013.

**Integraciones:**
- Módulo de persistencia (`src/persistencia/`).

**Notas de evidencia:**
- Fuente: §3.1 paso 3.
- Transcripción: "the first time we'll clic on save is just like clicing save as".
- Frames: frame_00020 (diálogo recién abierto con campos vacíos).
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [persistencia, guardar, modal, flow-convergencia].

---

### HU-30.006 — Ingresar Nombre del Modelo en diálogo Guardar Modelo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (persiste al confirmar).
**Superficie UI:** dialogo-guardar-modelo (campo Nombre del Modelo).
**Gesto canónico:** escritura en input + Enter o botón Guardar.

**Historia:**
> Como modelador, quiero escribir el nombre del modelo en el campo `Nombre del Modelo` para asignarle identidad única antes de persistirlo.

**Contexto de negocio:**
El nombre es el identificador humano del modelo. Todo flujo posterior (carga, search, permisos, versionado) se ancla a este valor. El campo es texto libre; sin reglas duras observadas de longitud o caracteres reservados.

**Criterios de aceptación:**
- **Dado** que el diálogo está abierto, **cuando** hago foco en `Nombre del Modelo`, **entonces** puedo escribir texto libre.
- **Dado** que escribí un nombre y confirmo con el botón `Guardar` (lateral al campo o al pie del modal), **entonces** el modelo se persiste con ese nombre.
- **Dado** que escribí un nombre y presiono `Enter` en el campo, **cuando** se procesa, **entonces** el save se dispara (confirmado por **inferencia** por analogía con popup de rename de cosas).
- **Dado** que el campo está vacío, **cuando** intento confirmar, **entonces** el save se rechaza con feedback visual (o no permite confirmar — **pregunta abierta** sobre regla exacta).

**Reglas y restricciones:**
- Texto libre, sin límite de longitud observado.
- Unicidad dentro de una carpeta: **pregunta abierta** (ver §11 Q2 doc fuente sobre sobrescribir).
- El botón `Guardar` junto al campo y el botón `Guardar` al pie del modal son **equivalentes** (confirmado por transcripción).

**Modelo de datos tocado:**
- `modelo.name` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-30.005.
- Bloquea a: HU-30.008.

**Integraciones:**
- Módulo de persistencia.

**Notas de evidencia:**
- Fuente: §3.1 paso 5, §5.1, §8.
- Frames: frame_00025 (diálogo durante renombrado a `OnStar Example`), frame_00002 (con `Turbojet Engine System V1_3` pre-cargado).
- Transcripción: "both buttons are equivalent".
- Clase de afirmación: observado + confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [persistencia, guardar, modal, input, enter].

---

### HU-30.007 — Ingresar Description opcional en diálogo Guardar Modelo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (persiste al confirmar).
**Superficie UI:** dialogo-guardar-modelo (campo Description).
**Gesto canónico:** escritura en input.

**Historia:**
> Como modelador, quiero agregar una descripción textual opcional al modelo para documentar su propósito sin abandonar el flujo de guardado.

**Contexto de negocio:**
La descripción es metadato que aparece en la columna `Descripción` de la vista lista y en el hover de los tiles. Facilita la navegación de workspaces grandes y la recuperación de contexto semántico de un modelo meses después.

**Criterios de aceptación:**
- **Dado** que el diálogo `Guardar Modelo` está abierto, **cuando** ingreso texto en el campo `Descripción`, **entonces** el texto se asociará al modelo al confirmar.
- **Dado** que dejo `Descripción` vacío, **cuando** confirmo, **entonces** `modelo.description` queda `null` o `""` sin error.
- **Dado** que el modelo tiene descripción, **cuando** aparece en vista lista, **entonces** la columna `Descripción` muestra el texto.
- **Dado** que el modelo tiene descripción, **cuando** la vuelvo a abrir para save as, **entonces** el campo `Descripción` muestra el texto previo.

**Reglas y restricciones:**
- Texto libre.
- Soporte de markdown/URLs: **pregunta abierta** (§11 Q9 doc fuente).

**Modelo de datos tocado:**
- `modelo.description` — string nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-30.005.

**Integraciones:**
- Vista lista del modal (columna Description).

**Notas de evidencia:**
- Fuente: §3.1 paso 5, §5.1, §11 Q9.
- Frames: frame_00020, frame_00025.
- Clase de afirmación: observado + hipótesis (sobre markdown).
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamaño:** XS.
**Etiquetas:** [persistencia, guardar, modal, description, requires-clarification].

---

### HU-30.008 — Persistir payload OPM íntegro al guardar (layout, stroke, dash, alias)

**Actor primario:** MN.
**Actores secundarios:** RV, ME.
**Tipo:** mixto.
**Nivel categórico:** P primario; K (serialización).
**Superficie UI:** dialogo-guardar-modelo (botón Guardar) + toast post-guardado.
**Gesto canónico:** clic en botón Guardar (lateral o al pie).

**Historia:**
> Como modelador, quiero que el save preserve íntegramente todas las propiedades visuales y semánticas del modelo (layout, sombras, dash patterns, alias, unidades, puntas abiertas de effect link, semi-folding, etc.) para recuperar mi trabajo tal cual lo dejé.

**Contexto de negocio:**
El save es el contrato fundamental del modelador. Si al cargar no se recuperan todas las propiedades, el usuario pierde confianza y el producto es percibido como inestable. OPCloud demuestra con `OnStar Example` (frame_00039) que el ciclo save→load conserva el layout pixel-preciso, lo cual debe ser un invariante duro.

**Criterios de aceptación:**
- **Dado** que confirmo el save de un modelo con N things, M links, estados, alias, estilos custom, **cuando** el save completa, **entonces** todas las propiedades quedan persistidas en disco.
- **Dado** que cargo el mismo modelo en otra sesión, **cuando** se renderiza, **entonces** el layout se ve idéntico al momento del save (posiciones, sombras, dash patterns, puntas de link abiertas para effect).
- **Dado** que el modelo tiene alias, unidades o semi-folding, **cuando** hago save+load, **entonces** todas esas propiedades se recuperan.
- **Dado** que el save completa, **cuando** el diálogo se cierra, **entonces** el pestaña superior pasa de `Modelo (No guardado)` a mostrar el nombre asignado.

**Reglas y restricciones:**
- Invariante: save→load es idempotente sobre el payload.
- El payload serializado debe cubrir **todo** lo documentado en el corpus `opcloud-reverse/11-19`.
- Elementos transitorios NO se serializan: estado del modal, contenido del `Búsqueda`, toggles `Mostrar Versiones`/`Mostrar Archivados`, breadcrumb posición.

**Modelo de datos tocado:**
- `modelo.id` — UUID — persistente (generado en primer save).
- `modelo.name` — persistente.
- `modelo.description` — persistente.
- `modelo.ruta_carpeta` — string (`Home/...`) — persistente.
- `modelo.owner` — string — persistente.
- `modelo.created_at` / `modelo.updated_at` — timestamp — persistente.
- `modelo.payload` — estructura OPM completa — persistente.

**Dependencias:**
- Bloqueada por: HU-30.005, HU-30.006.
- Bloquea a: HU-30.013 (incremental save reutiliza la misma serialización), HU-30.019 (load recupera el payload).

**Integraciones:**
- Kernel OPM: serialización canónica en `src/nucleo/`.
- Render: invariante de fidelidad visual.
- Persistencia: backend de storage.

**Notas de evidencia:**
- Fuente: §3.1 paso 8, §6.
- Frames: frame_00039 (OnStar Example recargado con layout idéntico).
- Transcripción: "all visual properties preserved".
- Clase de afirmación: observado + confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) define qué constituye un modelo OPM pero no regula el formato de serialización ni el mecanismo de persistencia — es una decisión de implementación. La necesidad de preservar el payload completo es universal para cualquier herramienta OPM.

**Prioridad:** M0.
**Tamaño:** L.
**Etiquetas:** [persistencia, guardar, serialización, kernel, fidelidad-visual].

---

### HU-30.009 — Navegar breadcrumb jerárquico Home/.../... en modal

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (fila superior bajo Búsqueda).
**Gesto canónico:** clic en tile de carpeta para descender.

**Historia:**
> Como modelador, quiero navegar por la jerarquía de carpetas haciendo clic en los tiles para elegir dónde guardar o desde dónde cargar, viendo siempre mi ruta actual en el breadcrumb.

**Contexto de negocio:**
El workspace jerárquico (`Home/Models Calculation/Turbojet Engine System Versions`) es la estructura organizativa primaria. El breadcrumb es el indicador visible de ubicación; sin él, el usuario se desorienta en workspaces profundos.

**Criterios de aceptación:**
- **Dado** que el modal está abierto en `Home`, **cuando** hago clic en un tile de carpeta (p.ej. `Models Calculation`), **entonces** el breadcrumb se actualiza a `Home/Models Calculation` y el grid muestra el contenido de esa carpeta.
- **Dado** que navegué 3 niveles adentro, **cuando** miro el breadcrumb, **entonces** veo la ruta absoluta completa `Home/A/B/C`.
- **Dado** que estoy en un nivel profundo, **cuando** paso el cursor sobre un segmento del breadcrumb (p.ej. `A`), **entonces** puedo hacer clic para saltar directamente a ese nivel (**pregunta abierta**: la navegación por segmento exacta).
- **Dado** que navego, **cuando** el grid se actualiza, **entonces** el grid `Modelos Recientes` sigue visible independientemente de la ruta.

**Reglas y restricciones:**
- El breadcrumb empieza siempre en `Home` (no se observó raíz alternativa).
- La navegación nunca cierra el modal.

**Modelo de datos tocado:**
- Estado transitorio del modal (posición breadcrumb).

**Dependencias:**
- Bloqueada por: HU-30.005 o HU-30.018.
- Bloquea a: HU-30.010.

**Integraciones:**
- Lente del índice de modelos (filtrado por ruta_carpeta).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.8.
- Frames: frame_00028 (breadcrumb `Home/Models Calculation/Turbojet Engine System Versions`), frame_00022.
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [persistencia, modal, breadcrumb, navegación].

---

### HU-30.010 — Retroceder un nivel con botón Atrás o flecha <

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo.
**Gesto canónico:** clic en botón `Atrás` o flecha `<`.

**Historia:**
> Como modelador, quiero subir un nivel en la jerarquía con un clic en `Atrás` o en la flecha para retroceder sin tener que re-navegar desde Home.

**Contexto de negocio:**
La navegación breadcrumb necesita un operador de retroceso explícito. OPCloud ofrece dos afordances equivalentes (flecha `<` junto al breadcrumb, botón `Atrás` al pie del modal) para cubrir preferencias de interacción.

**Criterios de aceptación:**
- **Dado** que estoy en `Home/A/B`, **cuando** hago clic en `Atrás`, **entonces** el breadcrumb retrocede a `Home/A`.
- **Dado** que estoy en `Home/A/B`, **cuando** hago clic en la flecha `<` junto al breadcrumb, **entonces** retrocede a `Home/A`.
- **Dado** que estoy en `Home` (raíz), **cuando** hago clic en `Atrás`, **entonces** no pasa nada (botón deshabilitado o inerte).
- **Dado** que uso `Atrás`, **cuando** se procesa, **entonces** el modal no se cierra.

**Reglas y restricciones:**
- `Atrás` nunca cierra el modal (diferencia crítica con `Cancelar`).
- Ambas afordances son funcionalmente equivalentes.

**Dependencias:**
- Bloqueada por: HU-30.009.

**Notas de evidencia:**
- Fuente: §2 tabla, §4.5.
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [persistencia, modal, breadcrumb, navegación, back].

---

### HU-30.011 — Ver grid Modelos Recientes siempre visible en el modal

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L (lente).
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (fila horizontal bajo breadcrumb).
**Gesto canónico:** ninguno (lente pasiva).

**Historia:**
> Como modelador experto, quiero ver un grid de `Modelos Recientes` siempre visible en el modal para saltar directamente al último modelo sin re-navegar.

**Contexto de negocio:**
El 80% del tiempo el modelador vuelve a uno de sus últimos N modelos. Exponerlos como grid horizontal permanente independiente de la navegación es un atajo poderoso, análogo a "most recently used" de IDEs y editores.

**Criterios de aceptación:**
- **Dado** que el modal está abierto en cualquier nivel del breadcrumb, **cuando** miro bajo el breadcrumb, **entonces** veo el grid `Modelos Recientes` con hasta 5 miniaturas.
- **Dado** que el grid se muestra, **cuando** miro el orden, **entonces** está de más reciente a más antiguo.
- **Dado** que hago clic en un tile del grid, **cuando** estoy en Cargar Modelo, **entonces** carga ese modelo directamente; **cuando** estoy en Guardar Modelo, **entonces** navega a la carpeta de ese modelo.
- **Dado** que hay menos de 5 modelos recientes, **cuando** miro el grid, **entonces** se muestran solo los que existen sin placeholders.

**Reglas y restricciones:**
- Límite superior del grid: 5 tiles (observado).
- `Modelos Recientes` siempre visible: la navegación del breadcrumb no lo oculta.
- Orden: descendente por timestamp de última apertura.

**Modelo de datos tocado:**
- `usuario.recent_models` — lista ordenada de `modelo.id` — persistente por usuario.

**Dependencias:**
- Bloqueada por: HU-30.005 o HU-30.018.

**Integraciones:**
- Lente del historial de acceso del usuario.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.8.
- Frames: frame_00002 (Modelos Recientes visible en Guardar).
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, modal, recent, lente].

---

### HU-30.012 — Ver canvas como telón de fondo durante modal (oscurecido 40-60%)

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** canvas + overlay modal.
**Gesto canónico:** ninguno.

**Historia:**
> Como modelador, quiero seguir viendo el canvas OPM detrás del modal (oscurecido parcialmente) para no perder el contexto visual mientras guardo o cargo.

**Contexto de negocio:**
Un modal a pantalla completa desconecta al usuario del modelo que está persistiendo. Mantener el canvas como telón de fondo (oscurecido 40-60%) conserva el anclaje visual y la sensación de continuidad. Además, al cerrar el modal la selección y handles se preservan.

**Criterios de aceptación:**
- **Dado** que abro el diálogo `Guardar Modelo` o `Cargar Modelo`, **cuando** miro detrás del overlay, **entonces** el canvas sigue visible con oscurecimiento aproximado 40-60%.
- **Dado** que tenía una cosa seleccionada antes del modal, **cuando** cierro el modal con Cancelar o Guardar, **entonces** la selección y los handles se conservan.
- **Dado** que el modal está abierto, **cuando** intento hacer clic en el canvas detrás, **entonces** el clic es capturado por el overlay (no afecta el canvas).

**Reglas y restricciones:**
- Oscurecimiento observado: 40-60% de opacidad del overlay.
- El canvas no recibe eventos durante el modal.
- La selección es transitoria pero se preserva a través del ciclo modal.

**Dependencias:**
- Bloqueada por: HU-30.005 o HU-30.018.

**Integraciones:**
- Renderer: preservar estado de selección.

**Notas de evidencia:**
- Fuente: §4.1.
- Frames: frame_00020, frame_00025 (canvas OnStar visible detrás del overlay).
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** XS.
**Etiquetas:** [persistencia, modal, ui, render, overlay].

---

### HU-30.013 — Guardar incremental con toast "guardado exitosamente"

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categórico:** P primario; U (toast).
**Superficie UI:** barra-herramientas-principal (Guardar) + menu-principal (Guardar) + toast post-guardado.
**Gesto canónico:** clic en Guardar o Ctrl+S.

**Historia:**
> Como modelador, quiero que al pulsar Guardar en un modelo ya persistido se guarde en sitio y aparezca un toast de confirmación para no interrumpir mi flujo con un modal.

**Contexto de negocio:**
El save incremental es el gesto más frecuente durante el modelado activo. Debe ser instantáneo y con feedback no invasivo (toast), en contraposición al primer save que abre modal para capturar identidad. La diferencia de UX entre ambos casos se justifica porque el primer save tiene un compromiso cognitivo mayor (nombrar, ubicar).

**Criterios de aceptación:**
- **Dado** que el modelo ya fue persistido (tiene `modelo.id`), **cuando** pulso `Guardar` en la barra de herramientas o `Guardar` en el menú principal, **entonces** no se abre diálogo; el modelo se guarda en sitio.
- **Dado** que el save incremental completa exitosamente, **cuando** se procesa, **entonces** aparece un toast con mensaje `successfully saved` (o equivalente localizado).
- **Dado** que el toast aparece, **cuando** pasan unos segundos, **entonces** el toast se desvanece automáticamente sin interacción.
- **Dado** que el save incremental falla (sin red, sin permisos), **cuando** se procesa, **entonces** aparece un toast de error (comportamiento inferido, no observado directamente).
- **Dado** que el save incremental completa, **cuando** miro el pestaña superior, **entonces** conserva el nombre del modelo sin cambio.

**Reglas y restricciones:**
- Guardar incremental no abre modal — invariante.
- El toast es no bloqueante.
- Guardar incremental se aplica solo cuando `modelo.id` existe.

**Modelo de datos tocado:**
- `modelo.updated_at` — timestamp — persistente (se actualiza).
- `modelo.payload` — actualizado con el estado actual.

**Dependencias:**
- Bloqueada por: HU-30.005, HU-30.008.
- Bloquea a: HU-30.014 (atajos reutiliza el mismo flow).

**Integraciones:**
- Feedback UI: sistema de toast.
- Política de versiones (HU-30.024): cada save incremental puede crear snapshot.

**Notas de evidencia:**
- Fuente: §3.2.
- Transcripción: "clicing on save will pop up our message successfully saved" (carpeta 03).
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula la persistencia — la necesidad es universal para cualquier herramienta OPM pero el formato y mecanismo son decisiones de implementación.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [persistencia, guardar, toast, feedback, incremental].

---

### HU-30.014 — Ctrl+S dispara guardado equivalente al botón Guardar

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categórico:** U primario; P (delega a flow save).
**Superficie UI:** global (keyboard listener).
**Gesto canónico:** atajos `Ctrl+S` (o `Cmd+S` en macOS).

**Historia:**
> Como modelador experto, quiero pulsar Ctrl+S para guardar sin abandonar el teclado y mantener el ritmo de modelado.

**Contexto de negocio:**
`Ctrl+S` es el atajos universal para save desde los años 80. No ofrecerlo sería antinaturalezar el modelador. Debe ser equivalente al botón Guardar, cubriendo tanto primer save (abre modal) como incremental (toast).

**Criterios de aceptación:**
- **Dado** que el modelo nunca fue persistido, **cuando** presiono `Ctrl+S`, **entonces** se abre el diálogo `Guardar Modelo` (equivalente a HU-30.005).
- **Dado** que el modelo ya fue persistido, **cuando** presiono `Ctrl+S`, **entonces** se dispara save incremental con toast (equivalente a HU-30.013).
- **Dado** que estoy editando texto en un input (p.ej. `Nombre del Modelo` en el modal), **cuando** presiono `Ctrl+S`, **entonces** el atajos **NO** se dispara (evitar conflicto con el input del modal mismo — comportamiento inferido).

**Reglas y restricciones:**
- Shortcut global, captado a nivel de document.
- No debe interferir con el comportamiento default del navegador (usualmente `Ctrl+S` = "Guardar page" en HTML; se debe prevenir ese default).
- Detectar plataforma para usar `Cmd+S` en macOS.

**Dependencias:**
- Bloqueada por: HU-30.005, HU-30.013.

**Integraciones:**
- Sistema de atajos (EPICA-90).

**Notas de evidencia:**
- Fuente: §3.2, §8.
- Transcripción: confirmado en carpeta `17 Keys atajos`.
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula la persistencia — la necesidad es universal para cualquier herramienta OPM pero el formato y mecanismo son decisiones de implementación.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [persistencia, guardar, atajos, ctrl-s, keyboard].

---

### HU-30.015 — Guardar como sobre modelo persistido (Nombre del Modelo pre-cargado)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** menu-principal (Guardar como) + dialogo-guardar-modelo.
**Gesto canónico:** clic en `Guardar como` en el menú principal.

**Historia:**
> Como modelador experto, quiero usar `Guardar como` sobre un modelo ya persistido para clonarlo con nombre o ubicación distintos sin modificar el original.

**Contexto de negocio:**
`Guardar como` es la operación de clonación/variante. Pre-carga el nombre actual para facilitar versioning manual (añadir sufijo `v2`) o movimiento de ubicación. Su comportamiento exacto cuando el nombre no cambia es **pregunta abierta** (sobrescribir vs duplicate).

**Criterios de aceptación:**
- **Dado** que el modelo tiene nombre `X` y está persistido, **cuando** pulso `Guardar como`, **entonces** se abre el diálogo `Guardar Modelo` con `Nombre del Modelo` pre-cargado a `X`.
- **Dado** que el diálogo está abierto con `X` pre-cargado, **cuando** cambio el nombre a `Y` y confirmo `Guardar`, **entonces** se crea un modelo nuevo con nombre `Y`; el modelo `X` queda intacto en disco.
- **Dado** que mantengo el nombre `X` y confirmo `Guardar como`, **cuando** se procesa, **entonces** el comportamiento exacto (sobrescribir o duplicar) es **pregunta abierta** Q30.B (§11 Q2 doc fuente).
- **Dado** que cambio la carpeta destino, **cuando** confirmo `Guardar como`, **entonces** el modelo nuevo queda en la nueva carpeta.

**Reglas y restricciones:**
- Pre-carga del nombre: siempre con el nombre actual.
- Crear modelo nuevo = generar nuevo `modelo.id`.
- Warning observado en transcripción: "if you will save as it will replace the model to a newer model" — comportamiento ambiguo que requiere clarificación.

**Modelo de datos tocado:**
- `modelo.id` (nuevo) — UUID — persistente.
- Payload completo — clonado.

**Dependencias:**
- Bloqueada por: HU-30.005, HU-30.008.

**Integraciones:**
- Módulo de persistencia (operación de clonación).

**Notas de evidencia:**
- Fuente: §3.3.
- Transcripción: warning explícito.
- Clase de afirmación: confirmado por transcripción + hipótesis (para regla exacta).
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.
- Etiqueta: `requires-clarification`.

**Prioridad:** M0.
**Tamaño:** M.
**Etiquetas:** [persistencia, guardar-como, modal, clonación, requires-clarification].

---

### HU-30.016 — Renombrar modelo existente con Renombrar sin Guardar como

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario.
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (botón Renombrar al pie).
**Gesto canónico:** seleccionar modelo en grid + editar Nombre del Modelo + clic en `Renombrar`.

**Historia:**
> Como modelador experto, quiero renombrar un modelo existente sin crear una versión nueva para corregir errores de nombre sin ensuciar el historial.

**Contexto de negocio:**
`Renombrar` es la operación de renombrado in-place: cambia el nombre preservando `modelo.id` e historial. Se distingue de `Guardar como` (que crea modelo nuevo). La transcripción aclara explícitamente la distinción para evitar que usuarios usen `Guardar como` innecesariamente.

**Criterios de aceptación:**
- **Dado** que el modal está abierto en una carpeta con modelos, **cuando** selecciono un modelo y edito el campo `Nombre del Modelo`, **entonces** el botón `Renombrar` al pie queda habilitado.
- **Dado** que pulso `Renombrar`, **cuando** se procesa, **entonces** el modelo cambia de nombre en sitio sin crear versión nueva ni `modelo.id` nuevo.
- **Dado** que el modelo renombrado está cargado en otro pestaña/sesión, **cuando** se procesa el rename, **entonces** el nombre propaga (**pregunta abierta** sobre propagación en tiempo real).
- **Dado** que no selecciono modelo y sólo edito Nombre del Modelo, **cuando** miro, **entonces** el botón `Renombrar` permanece deshabilitado (requiere selección previa).

**Reglas y restricciones:**
- Renombrar preserva `modelo.id`, `modelo.created_at`, `modelo.versions`.
- Solo aplica si el usuario tiene permiso de escritura.

**Modelo de datos tocado:**
- `modelo.name` — string — persistente (actualizado).
- `modelo.updated_at` — timestamp — persistente.

**Dependencias:**
- Bloqueada por: HU-30.005, HU-30.008.
- Relaciona: HU-30.031 (rename de carpeta).

**Integraciones:**
- Módulo de persistencia (operación de update).

**Notas de evidencia:**
- Fuente: §3.4.
- Transcripción: "you don't need to save as it; if you will save as it will replace the model to a newer model".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, rename, modal, in-place].

---

### HU-30.017 — Crear modelo nuevo desde Nuevo Modelo (canvas vacío)

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categórico:** P primario; V (canvas reset).
**Superficie UI:** menu-principal (entrada Nuevo Modelo) + canvas.
**Gesto canónico:** clic en `Nuevo Modelo`.

**Historia:**
> Como modelador, quiero cerrar el modelo actual y abrir uno vacío con `Nuevo Modelo` para empezar desde cero sin cargar ejemplo.

**Contexto de negocio:**
`Nuevo Modelo` es el punto de arranque en blanco. Cierra el modelo actual (con confirmación implícita si hay cambios — **pregunta abierta**) y deja el canvas vacío, OPD Navigator vacío y biblioteca `Draggable OPM Things` vacía. El pestaña pasa a `Modelo (No guardado)`.

**Criterios de aceptación:**
- **Dado** que estoy trabajando en un modelo persistido sin cambios pendientes, **cuando** pulso `Nuevo Modelo`, **entonces** el modelo actual se cierra y el canvas queda vacío con un OPD raíz `SD`.
- **Dado** el mismo escenario, **cuando** `Nuevo Modelo` completa, **entonces** el OPD Navigator está vacío, la biblioteca `Draggable OPM Things` está vacía, la pestaña muestra `Modelo (No guardado)`.
- **Dado** que tengo cambios sin guardar, **cuando** pulso `Nuevo Modelo`, **entonces** aparece confirmación de descarte (**pregunta abierta** Q30.C §11 Q3 doc fuente).
- **Dado** que canvas queda vacío, **cuando** empiezo a modelar, **entonces** cualquier creación activa el flow de primer save.

**Reglas y restricciones:**
- El canvas queda en estado inicial — solo `SD` (panel único).
- La confirmación de descarte es esperable pero no observada directamente.

**Modelo de datos tocado:**
- Estado transitorio: reset del modelo en memoria.

**Dependencias:**
- Bloqueada por: HU-30.001.
- Bloquea a: HU-30.005 (primer save sobre este nuevo modelo).

**Integraciones:**
- Kernel: reset del modelo.
- Render: redibujar canvas vacío.

**Notas de evidencia:**
- Fuente: §3.5.
- Frames: frame_00035 (canvas vacío tras Nuevo Modelo).
- Clase de afirmación: observado + hipótesis (sobre confirmación de descarte).
- Fuente normativa: la SSOT OPM (ISO 19450) no regula la persistencia — la necesidad es universal para cualquier herramienta OPM pero el formato y mecanismo son decisiones de implementación.
- Etiqueta: `requires-clarification`.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [persistencia, new-model, canvas, reset, requires-clarification].

---

### HU-30.018 — Abrir diálogo Cargar Modelo desde la barra de herramientas o menú principal

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P secundaria.
**Superficie UI:** barra-herramientas-principal (Cargar) + menu-principal (Cargar Modelo) + dialogo-cargar-modelo.
**Gesto canónico:** clic en cualquiera de las dos rutas.

**Historia:**
> Como modelador, quiero abrir el diálogo `Cargar Modelo` desde la barra de herramientas o el menú principal para buscar y abrir un modelo existente en mi workspace.

**Contexto de negocio:**
Cargar es la operación dual a Guardar. El diálogo comparte estructura con `Guardar Modelo` pero sin campos de identidad (`Nombre del Modelo`, `Descripción`) y con controles específicos de búsqueda (`Incluir Todas las Subcarpetas`).

**Criterios de aceptación:**
- **Dado** que hago clic en el botón Cargar de la barra de herramientas principal, **cuando** se procesa, **entonces** se abre el diálogo `Cargar Modelo`.
- **Dado** que hago clic en `Cargar Modelo` del menú principal, **cuando** se procesa, **entonces** se abre el mismo diálogo.
- **Dado** que el diálogo se abre, **cuando** miro la estructura, **entonces** veo `Búsqueda`, checkbox `Incluir Todas las Subcarpetas`, toggles `Mostrar Versiones` / `Mostrar Archivados`, breadcrumb, grid `Modelos Recientes`, grid de carpetas, y botones al pie (`Nueva Carpeta`, `Renombrar`, `Atrás`, `Cancelar`).
- **Dado** que el diálogo se abre, **cuando** comparo con Guardar Modelo, **entonces** NO hay campos `Nombre del Modelo` ni `Descripción`, y sí hay checkbox `Incluir Todas las Subcarpetas`.
- **Dado** que abrí Cargar anteriormente, **cuando** vuelvo a abrir, **entonces** aparece en la última carpeta visitada (o `Home` si es la primera vez).

**Reglas y restricciones:**
- Cargar y Guardar son modales excluyentes — no pueden coexistir abiertos.
- Estructura análoga a Guardar con las diferencias listadas arriba.

**Dependencias:**
- Bloqueada por: HU-30.001, HU-30.003.
- Bloquea a: HU-30.019, HU-30.020, HU-30.028, HU-30.029.

**Integraciones:**
- Lente del índice de modelos.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.6 paso 1-2.
- Frames: frame_00008 (Cargar Modelo con Incluir Todas las Subcarpetas visible).
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [persistencia, load, modal].

---

### HU-30.019 — Cargar modelo con doble clic sobre tile

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categórico:** P primario; V secundaria (render del modelo cargado).
**Superficie UI:** dialogo-cargar-modelo (tile de modelo).
**Gesto canónico:** doble clic sobre tile.

**Historia:**
> Como modelador, quiero abrir un modelo con doble clic sobre su tile para cargarlo con el gesto más directo posible.

**Contexto de negocio:**
El doble clic es el flow canónico según transcripción — es el gesto observado en el flow principal. Reduce la carga de un clic-más-botón a un solo gesto concentrado sobre el objetivo.

**Criterios de aceptación:**
- **Dado** que el diálogo Cargar está abierto y hay modelos en la carpeta actual, **cuando** hago doble clic sobre un tile de modelo, **entonces** el modelo se carga y el diálogo se cierra.
- **Dado** que el modelo se carga, **cuando** se renderiza, **entonces** el canvas muestra el OPD raíz del modelo con todas sus propiedades preservadas (ver HU-30.008).
- **Dado** que el modelo se carga, **cuando** miro el pestaña superior, **entonces** muestra el nombre del modelo cargado.
- **Dado** que el doble clic se ejecuta sobre un tile de carpeta (no de modelo), **cuando** se procesa, **entonces** se navega dentro de esa carpeta (no se carga nada — el doble clic sobre carpeta es equivalente a clic simple más `Enter`).
- **Dado** que hay un modelo cargado previamente con cambios sin guardar, **cuando** hago doble clic sobre otro modelo, **entonces** aparece confirmación de descarte (**pregunta abierta** Q30.D §11 Q4 doc fuente, también relaciona con pestaña nuevo vs pestaña actual).

**Reglas y restricciones:**
- Doble clic es el flow canónico.
- Pestaña nuevo vs pestaña actual: **pregunta abierta**.
- Debe preservar toda la fidelidad visual (invariante HU-30.008).

**Modelo de datos tocado:**
- Reemplaza el modelo en memoria con el payload cargado.
- Actualiza `usuario.recent_models` moviendo el modelo al frente.

**Dependencias:**
- Bloqueada por: HU-30.008 (serialización), HU-30.018.

**Integraciones:**
- Kernel: deserialización.
- Render: re-draw completo.
- panel OPL-ES, OPD Navigator, biblioteca lateral: se repoblaron desde el modelo cargado.

**Notas de evidencia:**
- Fuente: §3.6 paso 3, §8.
- Frames: frame_00039 (modelo recargado).
- Transcripción: "double clic is the canonical flow".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula la persistencia — la necesidad es universal para cualquier herramienta OPM pero el formato y mecanismo son decisiones de implementación.
- Etiqueta: `requires-clarification` (pestaña nuevo vs actual).

**Prioridad:** M0.
**Tamaño:** S.
**Etiquetas:** [persistencia, load, modal, doble-clic, requires-clarification].

---

### HU-30.020 — Cargar modelo con clic + botón Cargar

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** dialogo-cargar-modelo (tile + botón Cargar).
**Gesto canónico:** clic sobre tile + clic en botón `Cargar`.

**Historia:**
> Como modelador, quiero seleccionar un modelo con clic simple y pulsar `Cargar` para tener un flow deliberado de dos pasos cuando prefiero confirmación explícita.

**Contexto de negocio:**
Complementa HU-30.019 (doble clic) ofreciendo un flow más cauteloso: selecciono, reviso el detalle, confirmo. Útil para modelos grandes donde accidentalmente abrir uno equivocado implicaría espera.

**Criterios de aceptación:**
- **Dado** que el diálogo Cargar está abierto, **cuando** hago clic simple sobre un tile de modelo, **entonces** el tile queda seleccionado (feedback visual) y el botón `Cargar` al pie se habilita.
- **Dado** que tengo un modelo seleccionado, **cuando** pulso el botón `Cargar`, **entonces** el modelo se carga con el mismo comportamiento de HU-30.019.
- **Dado** que cambio la selección haciendo clic en otro tile, **cuando** pulso `Cargar`, **entonces** se carga el modelo de la selección más reciente.

**Reglas y restricciones:**
- El botón `Cargar` existe — confirmado por transcripción, no observado directamente en frames (se asume presente al pie del modal).

**Dependencias:**
- Bloqueada por: HU-30.018.
- Análoga a: HU-30.019.

**Notas de evidencia:**
- Fuente: §3.6 paso 3.
- Transcripción: "the Cargar button exists; the canonical flow is double-clic".
- Clase de afirmación: confirmado por transcripción (existencia) + inferido (feedback visual exacto).
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [persistencia, load, modal, clic, botón-load].

---

### HU-30.021 — Cargar Cargar Example ▸ Ejemplos Globales

**Actor primario:** PD (facilitador pedagógico).
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** menu-principal (Cargar Example ▸ Ejemplos Globales).
**Gesto canónico:** clic en `Cargar Ejemplo ▸` + clic en `Ejemplos Globales`.

**Historia:**
> Como facilitador pedagógico, quiero cargar un ejemplo global de OPCloud para mostrar modelos canónicos (OnStar, elevator, etc.) disponibles a toda la comunidad sin crearlos desde cero.

**Contexto de negocio:**
Los ejemplos globales son material pedagógico compartido entre todas las organizaciones. Son la forma más rápida de onboarding — un modelador novato puede cargar `OnStar Example` y aprender OPM por inmersión en un modelo ya bien construido.

**Criterios de aceptación:**
- **Dado** que abro el menú principal, **cuando** hago clic en `Cargar Ejemplo ▸`, **entonces** se expanden dos subopciones: `Ejemplos Globales` y `Ejemplos Organizacionales`.
- **Dado** que hago clic en `Ejemplos Globales`, **cuando** se procesa, **entonces** se abre un diálogo análogo a `Cargar Modelo` apuntando al namespace de ejemplos globales.
- **Dado** que elijo un ejemplo con doble clic o botón, **cuando** se carga, **entonces** el modelo aparece en el canvas con todas las propiedades preservadas.
- **Dado** que cargo un ejemplo global, **cuando** intento guardarlo con `Guardar`, **entonces** se redirige a `Guardar como` porque es solo lectura (relaciona HU-30.036).

**Reglas y restricciones:**
- Ejemplos globales son solo lectura por defecto.
- Namespace separado del workspace personal.
- La lista es provista por OPCloud y administrada por ellos.

**Dependencias:**
- Bloqueada por: HU-30.001.
- Relaciona: HU-30.022, HU-30.036.

**Integraciones:**
- Módulo de persistencia (namespace examples).

**Notas de evidencia:**
- Fuente: §3.7.
- Frames: frame_00011 (menú principal con Cargar Example expandido).
- Transcripción: "global = abierto a todos los usuarios de OPCloud".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [persistencia, load, examples, pedagógico, global].

---

### HU-30.022 — Cargar Cargar Example ▸ Ejemplos Organizacionales

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** AO (admin organización), PD.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** menu-principal (Cargar Example ▸ Ejemplos Organizacionales).
**Gesto canónico:** clic en submenú + clic en Ejemplos Organizacionales.

**Historia:**
> Como autor de dominio, quiero cargar un ejemplo organizacional para reutilizar modelos canónicos creados por mi organización (plantillas internas, referencias de dominio).

**Contexto de negocio:**
Los ejemplos organizacionales son la capa intermedia entre globales y personales. Son creados por el admin de la organización y visibles solo dentro de ella. Permiten establecer un cánon de modelado interno (p.ej. en una universidad, todos los cursos de OPM pueden partir del mismo `Exemplar HealthSystem`).

**Criterios de aceptación:**
- **Dado** que mi usuario pertenece a una organización, **cuando** hago clic en `Ejemplos Organizacionales`, **entonces** se abre un diálogo con los ejemplos organizacionales visibles.
- **Dado** que no pertenezco a organización (usuario solo personal), **cuando** hago clic en `Ejemplos Organizacionales`, **entonces** el diálogo aparece vacío o la entrada está deshabilitada (**pregunta abierta** sobre comportamiento exacto).
- **Dado** que cargo un ejemplo organizacional, **cuando** intento guardarlo con `Guardar`, **entonces** se redirige a `Guardar como` (solo lectura según permisos de org).

**Reglas y restricciones:**
- Visibilidad: solo miembros de la organización.
- Administración: por admin de organización (EPICA-82 para ontología organizacional).
- Solo lectura por default, igual que globales.

**Dependencias:**
- Bloqueada por: HU-30.001.
- Relaciona: HU-30.021, HU-30.036, EPICA-40 (permisos), EPICA-82 (admin org).

**Notas de evidencia:**
- Fuente: §3.7.
- Transcripción: "organizacional = creado por el admin de la organización y visible solo dentro de ella".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [persistencia, load, examples, organización, permisos].

---

### HU-30.023 — Activar toggle Mostrar Versiones (carpetas `<Modelo> Versions`)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U (toggle).
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (toggle `Mostrar Versiones` lateral derecho).
**Gesto canónico:** clic en pastilla del toggle.

**Historia:**
> Como modelador experto, quiero activar `Mostrar Versiones` para ver el historial de versiones de cada modelo como carpetas derivadas `<Modelo> Versions` al mismo nivel que el modelo mismo.

**Contexto de negocio:**
El historial de versiones es clave para auditar evolución, revertir cambios y comparar estados. Exponerlo como carpeta derivada hace la navegación uniforme con la de carpetas normales, reduciendo la curva de aprendizaje.

**Criterios de aceptación:**
- **Dado** que el modal está abierto con `Mostrar Versiones` en off, **cuando** miro la estructura, **entonces** veo solo carpetas reales y modelos, sin carpetas derivadas de versiones.
- **Dado** que activo `Mostrar Versiones`, **cuando** se procesa, **entonces** para cada modelo con historial aparece una carpeta `<Modelo> Versions` al mismo nivel que el modelo.
- **Dado** que entro a la carpeta `Turbojet Engine System Versions`, **cuando** miro su contenido, **entonces** veo tiles con fecha como label (p.ej. `09-09-`) y glifo de candado indicando solo lectura.
- **Dado** que `Mostrar Versiones` está activo en vista lista, **cuando** miro las columnas, **entonces** aparece la columna `Carpetas` junto a las demás.
- **Dado** que desactivo `Mostrar Versiones`, **cuando** se procesa, **entonces** las carpetas de versiones se ocultan de inmediato.

**Reglas y restricciones:**
- Default: `Mostrar Versiones = off`.
- Las carpetas de versiones son **derivadas**, no creadas por el usuario — no pueden renombrarse ni moverse.
- Los tiles de versión muestran fecha, no nombre (el nombre se hereda del padre).
- El candado indica solo lectura — ver HU-30.034.

**Modelo de datos tocado:**
- Estado transitorio del modal (toggle on/off).
- `modelo.versions` — array de snapshots — persistente.

**Dependencias:**
- Bloqueada por: HU-30.005 o HU-30.018.
- Relaciona: HU-30.024 (política de retención).

**Integraciones:**
- Lente del índice de versiones.

**Notas de evidencia:**
- Fuente: §3.9, §5.1, §5.2.
- Frames: frame_00015 (vista lista con `Folders` y nombres `<Modelo> Versions`), frame_00022 (contenido de carpeta de versiones con 14+ tiles).
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [persistencia, version, modal, toggle, show-versions].

---

### HU-30.024 — Aplicar política de retención log-scale (10/día, 1/sem, 1/mes, máx 12)

**Actor primario:** ME.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; C (política de config).
**Superficie UI:** invisible (backend); observable en carpetas de versiones.
**Gesto canónico:** ninguno (automático).

**Historia:**
> Como modelador experto, quiero que el sistema aplique una política de retención log-scale que conserve hasta 10 versiones/día, 1/semana, 1/mes, con máximo total 12 snapshots, para tener granularidad reciente y profundidad histórica sin explotar en storage.

**Contexto de negocio:**
La retención log-scale es una optimización clásica de sistemas de backup: mayor granularidad en el tiempo reciente (cuando es más probable querer revertir), decreciente hacia atrás. 12 snapshots totales es el techo, lo que obliga al sistema a descartar los más antiguos cuando se supera.

**Criterios de aceptación:**
- **Dado** que guardo 15 veces en un mismo día, **cuando** consulto el historial, **entonces** hay como máximo 10 versiones de ese día.
- **Dado** que pasó una semana con múltiples versiones, **cuando** consulto, **entonces** se conserva aprox. 1 por semana antigua.
- **Dado** que pasaron meses, **cuando** consulto, **entonces** se conserva aprox. 1 por mes antigua.
- **Dado** que se alcanza el tope de 12, **cuando** guardo una nueva versión, **entonces** la más antigua se descarta (**pregunta abierta** Q30.E §11 Q5 doc fuente: regla exacta de selección).
- **Dado** que los autosaves también cuentan, **cuando** el sistema autosalva durante una sesión activa, **entonces** cada autosalvado es una versión contable.

**Reglas y restricciones:**
- Cuota: 10/día, 1/semana, 1/mes, máx 12 total.
- Autosaves cuentan dentro de la cuota (confirmado por transcripción).
- Regla de descarte FIFO: inferida, no explicitada.

**Modelo de datos tocado:**
- `modelo.versions` — array con atributos `timestamp`, `tipo (guardado | autosalvado)`.

**Dependencias:**
- Bloqueada por: HU-30.008 (save base), HU-30.035 (autosalvado).

**Integraciones:**
- Backend de persistencia: job/cron de retención.

**Notas de evidencia:**
- Fuente: §3.9, §5.3, §11 Q5.
- Transcripción: "OPCloud guarda hasta 10 versiones por día; luego una versión por semana; luego una por mes; total máximo 12 snapshots".
- Clase de afirmación: confirmado por transcripción + hipótesis (regla de descarte exacta).
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamaño:** L.
**Etiquetas:** [persistencia, version, cuota, retención, log-scale, requires-clarification].

---

### HU-30.025 — Activar toggle Mostrar Archivados (modelos archivados + columna Archived)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U (toggle).
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (toggle `Mostrar Archivados`).
**Gesto canónico:** clic en pastilla del toggle.

**Historia:**
> Como modelador experto, quiero activar `Mostrar Archivados` para ver los modelos archivados junto a los activos, con una columna adicional `Archived` en vista lista.

**Contexto de negocio:**
Los modelos archivados se ocultan por default para reducir ruido en el workspace. Exponerlos con un toggle es la forma de recuperarlos o auditar archivos antiguos sin contaminar la vista normal.

**Criterios de aceptación:**
- **Dado** que `Mostrar Archivados` está en off, **cuando** miro el grid/lista, **entonces** los modelos archivados NO aparecen.
- **Dado** que activo `Mostrar Archivados`, **cuando** se procesa, **entonces** los modelos archivados aparecen junto a los activos; en vista lista aparece columna `Archivado` (yes/no).
- **Dado** que paso el cursor sobre el toggle, **cuando** aparece tooltip, **entonces** muestra `Show Archivado Folders`.
- **Dado** que desactivo, **cuando** se procesa, **entonces** los archivados se ocultan de inmediato.

**Reglas y restricciones:**
- Default: `Mostrar Archivados = off`.
- Tooltip exacto: `Show Archivado Folders` (observado en frame_00028).
- En vista tiles, los archivados se distinguen por glifo de candado (observación).

**Modelo de datos tocado:**
- `modelo.archived` — boolean — persistente.

**Dependencias:**
- Bloqueada por: HU-30.005 o HU-30.018.
- Relaciona: HU-30.026, HU-30.027.

**Integraciones:**
- Lente del índice de modelos con filtro de archivado.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.10, §5.1, §5.2.
- Frames: frame_00028 (tooltip `Show Archivado Folders`, vista lista con Hanan Kohen como autor).
- Clase de afirmación: observado + confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [persistencia, archive, modal, toggle, show-archived].

---

### HU-30.026 — Auto-archivar modelo no abierto durante 90 días

**Actor primario:** AO.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; C (política).
**Superficie UI:** invisible (backend); observable en `Mostrar Archivados`.
**Gesto canónico:** ninguno (automático).

**Historia:**
> Como admin de organización, quiero que los modelos no abiertos durante 90 días se archiven automáticamente para mantener el workspace limpio sin intervención manual.

**Contexto de negocio:**
El auto-archivado es housekeeping automático. 90 días es un buffer razonable: modelos en uso activo nunca se archivan, modelos olvidados se mueven al archivo pero siguen recuperables. Alternativamente, el usuario puede archivar manualmente.

**Criterios de aceptación:**
- **Dado** que un modelo fue abierto por última vez hace 91+ días, **cuando** el job de archivado corre, **entonces** el modelo pasa a `archived=true`.
- **Dado** un modelo fue abierto ayer, **cuando** el job corre, **entonces** el modelo NO se archiva.
- **Dado** que un modelo fue archivado automáticamente, **cuando** lo cargo (ver HU-30.027), **entonces** se desarchiva.
- **Dado** que deseo archivar manualmente, **cuando** selecciono el modelo y uso una acción de archivado (UI exacta **pregunta abierta**), **entonces** pasa a `archived=true`.

**Reglas y restricciones:**
- Umbral: 90 días de no apertura.
- Auto-archivado + archivado manual ambos disponibles.
- Restaurar siempre posible mientras el modelo exista (HU-30.027).

**Modelo de datos tocado:**
- `modelo.archived` — boolean — persistente.
- `modelo.ultima_apertura` — timestamp — persistente.

**Dependencias:**
- Bloqueada por: HU-30.025 (requiere poder ver archivados).

**Integraciones:**
- Backend: job cron de archivado.

**Notas de evidencia:**
- Fuente: §3.10, §5.4.
- Transcripción: "un modelo no abierto durante 90 días se archiva automáticamente; también se puede archivar manualmente".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [persistencia, archive, auto, política, 90-días].

---

### HU-30.027 — Restaurar modelo archivado con Restaurar

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P.
**Superficie UI:** dialogo-cargar-modelo con `Mostrar Archivados` activo (botón `Restaurar` sobre modelo archivado).
**Gesto canónico:** seleccionar modelo archivado + clic en `Restaurar`.

**Historia:**
> Como modelador experto, quiero restaurar un modelo archivado para reactivarlo en mi workspace sin perder su contenido ni historial.

**Contexto de negocio:**
Archivado es estado reversible. El restore es la operación inversa, garantizando que el usuario pueda rescatar modelos antiguos sin importar cuánto tiempo estuvieron archivados (mientras existan en disco).

**Criterios de aceptación:**
- **Dado** que `Mostrar Archivados` está activo y veo un modelo archivado, **cuando** lo selecciono y uso `Restaurar`, **entonces** el modelo pasa a `archived=false`.
- **Dado** que restauré un modelo, **cuando** desactivo `Mostrar Archivados`, **entonces** el modelo sigue visible (porque ya no está archivado).
- **Dado** que restauré, **cuando** abro el modelo, **entonces** toda la historia (versiones, metadata) se preserva.

**Reglas y restricciones:**
- Restaurar preserva todo el estado previo al archivado.
- Funciona mientras el modelo exista en disco (no elimina).
- UI exacta del botón `Restaurar`: **pregunta abierta** (posiblemente en contexto menu o pie del modal tras selección).

**Modelo de datos tocado:**
- `modelo.archived` — boolean — persistente (true → false).

**Dependencias:**
- Bloqueada por: HU-30.025.
- Relaciona: HU-30.026.

**Notas de evidencia:**
- Fuente: §3.10, §5.4.
- Transcripción: "Para restaurar: mostrar archivados, seleccionar el modelo, pulsar `Restaurar`".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [persistencia, archive, restore, recuperación].

---

### HU-30.028 — Buscar modelos por nombre en Búsqueda (filtro local)

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U secundaria.
**Superficie UI:** dialogo-cargar-modelo + dialogo-guardar-modelo (campo Búsqueda).
**Gesto canónico:** escritura en campo Búsqueda.

**Historia:**
> Como modelador experto, quiero filtrar los modelos de la carpeta actual escribiendo en el campo `Búsqueda` para encontrar rápidamente sin navegar manualmente.

**Contexto de negocio:**
En carpetas con decenas de modelos, un filtro local por nombre es la forma más eficiente de encontrar. Sin filtro, se reduce a scroll manual. El campo Búsqueda es persistente y ubicado prominente en la fila superior del modal.

**Criterios de aceptación:**
- **Dado** que el modal está abierto en una carpeta con N modelos, **cuando** escribo texto en `Búsqueda`, **entonces** el grid/lista muestra solo modelos cuyo nombre contiene el texto (case-insensitive).
- **Dado** que escribo y luego borro, **cuando** el campo queda vacío, **entonces** el grid vuelve a mostrar todos los modelos.
- **Dado** que `Incluir Todas las Subcarpetas` está inactivo, **cuando** busco, **entonces** el filtro aplica solo a la carpeta actual (no a subcarpetas).
- **Dado** que la búsqueda local no produce resultados, **cuando** miro, **entonces** aparece mensaje o grid vacío.

**Reglas y restricciones:**
- Búsqueda es subcadena case-insensitive por nombre.
- En Guardar Modelo hay `Búsqueda` pero NO `Incluir Todas las Subcarpetas` (ver HU-30.029).

**Modelo de datos tocado:**
- Estado transitorio del modal.

**Dependencias:**
- Bloqueada por: HU-30.018 (Cargar Modelo) o HU-30.005 (Guardar Modelo).
- Bloquea a: HU-30.029 (búsqueda global extiende la local).

**Integraciones:**
- Lente del índice con filtro.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.11, §5.1, §5.2.
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, search, modal, filtro-local].

---

### HU-30.029 — Activar Incluir Todas las Subcarpetas para búsqueda global con 3+ chars

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U secundaria.
**Superficie UI:** dialogo-cargar-modelo (checkbox Incluir Todas las Subcarpetas + campo Búsqueda).
**Gesto canónico:** check + escritura en Búsqueda.

**Historia:**
> Como modelador experto, quiero activar `Incluir Todas las Subcarpetas` y buscar con 3+ caracteres para encontrar modelos en cualquier punto de la jerarquía sin recordar la ruta exacta.

**Contexto de negocio:**
La búsqueda global es indispensable en workspaces grandes (cientos de modelos, múltiples niveles). El umbral de 3 caracteres es para evitar búsquedas triviales con resultados excesivos. Los resultados se muestran como dropdown con rutas absolutas `Home/<Autor>/<Modelo>`.

**Criterios de aceptación:**
- **Dado** que `Incluir Todas las Subcarpetas` está activo y escribo `tur` (3 chars), **cuando** se procesa, **entonces** aparece un dropdown con resultados de toda la jerarquía.
- **Dado** que los resultados aparecen, **cuando** miro cada entrada, **entonces** cada una muestra la ruta absoluta `Home/<Autor>/<Modelo>`.
- **Dado** que escribo solo 2 caracteres, **cuando** espero, **entonces** no se lanza búsqueda global (umbral mínimo 3).
- **Dado** que hago clic en un resultado, **cuando** se procesa, **entonces** el modelo se carga (transcripción: "it opens it in a new pestaña").
- **Dado** que `Incluir Todas las Subcarpetas` está inactivo, **cuando** busco, **entonces** el filtro aplica solo a la carpeta actual (equivalente a HU-30.028).

**Reglas y restricciones:**
- Umbral: 3 caracteres mínimo para disparar búsqueda global.
- Only available in Cargar Modelo (no en Guardar Modelo).
- Respeto de permisos: **pregunta abierta** Q30.F (§11 Q7 doc fuente).

**Modelo de datos tocado:**
- Estado transitorio del modal.
- Lectura del índice completo con permiso del usuario.

**Dependencias:**
- Bloqueada por: HU-30.028.

**Integraciones:**
- Backend: índice de búsqueda.
- Permisos: filtrar por visibilidad del usuario.

**Notas de evidencia:**
- Fuente: §3.11, §5.2.
- Frames: frame_00044 (búsqueda `tur` con resultados cross-organizaciones).
- Transcripción: "con 3 caracteres o más y `Incluir Todas las Subcarpetas` activo, el resultado se expande a toda la jerarquía; it opens it in a new pestaña".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.
- Etiqueta: `requires-clarification` (permisos).

**Prioridad:** M1.
**Tamaño:** M.
**Etiquetas:** [persistencia, search, global, subfolders, dropdown, requires-clarification].

---

### HU-30.030 — Crear carpeta nueva desde Nueva Carpeta

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (botón `Nueva Carpeta` al pie).
**Gesto canónico:** clic en botón + ingreso de nombre en prompt.

**Historia:**
> Como modelador experto, quiero crear una carpeta nueva en la ubicación actual del breadcrumb desde el botón `Nueva Carpeta` para organizar mi workspace sin salir del flow de guardar/cargar.

**Contexto de negocio:**
La organización del workspace es responsabilidad del usuario. Permitir crear carpetas in-flow evita el zigzag cognitivo de abandonar el save para ir a un "gestor de carpetas" separado. La carpeta se crea en la ruta actual del breadcrumb.

**Criterios de aceptación:**
- **Dado** que el modal está abierto en una ruta (p.ej. `Home/A`), **cuando** pulso `Nueva Carpeta`, **entonces** aparece un prompt modal pidiendo nombre.
- **Dado** que el prompt está abierto, **cuando** ingreso un nombre y confirmo, **entonces** la carpeta se crea en `Home/A/<nombre>`.
- **Dado** que cancelo el prompt, **cuando** se procesa, **entonces** no se crea carpeta.
- **Dado** que la carpeta se crea exitosamente, **cuando** miro el grid, **entonces** la nueva carpeta aparece en el grid de carpetas.
- **Dado** que el nombre colide con una carpeta existente, **cuando** confirmo, **entonces** aparece error (**pregunta abierta** regla exacta).

**Reglas y restricciones:**
- Creación en breadcrumb actual.
- Nombre único dentro de la carpeta contenedora (inferido).
- Detalle extendido: ver EPICA-31.

**Modelo de datos tocado:**
- `carpeta.id`, `carpeta.name`, `carpeta.parent_path` — persistente.

**Dependencias:**
- Bloqueada por: HU-30.009 (breadcrumb).
- Relaciona: EPICA-31.

**Integraciones:**
- Módulo de carpetas (EPICA-31).

**Notas de evidencia:**
- Fuente: §2 tabla, §3.12.
- Clase de afirmación: observado + confirmado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, folders, modal, new-folder].

---

### HU-30.031 — Renombrar carpeta seleccionada con Renombrar

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P.
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (botón `Renombrar`).
**Gesto canónico:** seleccionar carpeta en grid + clic en `Renombrar`.

**Historia:**
> Como modelador experto, quiero renombrar una carpeta seleccionada sin clonarla para corregir errores de nombre o reorganizar taxonomía.

**Contexto de negocio:**
Análogo a HU-30.016 pero para carpetas. El botón `Renombrar` al pie del modal se habilita cuando hay carpeta (o modelo) seleccionado.

**Criterios de aceptación:**
- **Dado** que el modal está abierto y selecciono una carpeta en el grid, **cuando** pulso `Renombrar`, **entonces** aparece un prompt con el nombre actual pre-cargado.
- **Dado** que el prompt está abierto, **cuando** edito el nombre y confirmo, **entonces** la carpeta se renombra en sitio.
- **Dado** que cancelo, **cuando** se procesa, **entonces** el nombre no cambia.
- **Dado** que hay otra carpeta con el mismo nombre en el mismo nivel, **cuando** confirmo, **entonces** aparece error (**pregunta abierta**).

**Reglas y restricciones:**
- Renombrar preserva `carpeta.id` y todo el contenido (modelos y subcarpetas).
- Solo aplica con permiso de escritura.

**Modelo de datos tocado:**
- `carpeta.name` — string — persistente (actualizado).

**Dependencias:**
- Relaciona: HU-30.016, EPICA-31.

**Integraciones:**
- Módulo de carpetas.

**Notas de evidencia:**
- Fuente: §2 tabla, §3.12 paso 2.
- Clase de afirmación: observado + confirmado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, folders, rename, modal].

---

### HU-30.032 — Alternar vista tiles vs vista lista en modal

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V (render).
**Superficie UI:** dialogo-cargar-modelo + dialogo-guardar-modelo (selector íconos `↑`/`+`).
**Gesto canónico:** clic en íconos `↑`/`+` bajo `Modelos Recientes`.

**Historia:**
> Como modelador experto, quiero alternar entre vista tiles (grande, visual) y vista lista (compacta, con columnas) para elegir la presentación más adecuada según el volumen de modelos y la operación.

**Contexto de negocio:**
Las dos vistas complementan: tiles es mejor para escaneo visual rápido con pocos modelos, lista es mejor para muchos modelos con necesidad de ordenar por columnas. Ofrecer ambas cubre ambos casos.

**Criterios de aceptación:**
- **Dado** que el modal está en vista tiles (default), **cuando** miro, **entonces** veo grid de tiles con miniatura y nombre.
- **Dado** que hago clic en el ícono de vista lista, **cuando** se procesa, **entonces** la vista cambia a lista con columnas `Modelo / Descripción / Fecha / Autor`.
- **Dado** que hago clic en el ícono de vista tiles, **cuando** estoy en lista, **entonces** vuelvo a tiles.
- **Dado** que cambio de vista, **cuando** miro, **entonces** el cambio es inmediato sin perder selección ni breadcrumb.

**Reglas y restricciones:**
- Vista default: tiles.
- Selector visible solo en modo detallado (no siempre — observación parcial).
- Íconos exactos: `↑`/`+` (según doc fuente §2 tabla).

**Modelo de datos tocado:**
- Estado transitorio del modal; posiblemente preferencia persistente del usuario (**pregunta abierta**).

**Dependencias:**
- Bloqueada por: HU-30.005 o HU-30.018.
- Bloquea a: HU-30.033.

**Integraciones:**
- Ninguna semántica.

**Notas de evidencia:**
- Fuente: §2 tabla, §9.
- Frames: frame_00015 (vista lista).
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [persistencia, modal, view, vista-lista, vista-tiles, toggle].

---

### HU-30.033 — Ordenar vista lista por Model/Description/Date/Author

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; L secundaria.
**Superficie UI:** dialogo-cargar-modelo + dialogo-guardar-modelo en vista lista (cabeceras de columnas).
**Gesto canónico:** clic en cabecera.

**Historia:**
> Como modelador experto, quiero ordenar la vista lista por cualquiera de las columnas (`Model`, `Descripción`, `Date`, `Author`) para encontrar modelos por diferentes criterios.

**Contexto de negocio:**
Ordenar por fecha permite encontrar el más reciente; por autor permite agrupar por persona; por descripción permite escaneo alfabético por propósito. Es un patrón estándar de file managers.

**Criterios de aceptación:**
- **Dado** que estoy en vista lista, **cuando** miro las cabeceras, **entonces** veo `Model`, `Descripción`, `Date`, `Author` con indicador de orden (flecha `↑`/`↓`).
- **Dado** que la cabecera `Date` tiene flecha `↑` (default observado), **cuando** hago clic en `Date`, **entonces** el orden se invierte a `↓`.
- **Dado** que hago clic en otra cabecera (p.ej. `Author`), **cuando** se procesa, **entonces** el orden cambia a esa columna (default asc).
- **Dado** que `Mostrar Versiones` está activo, **cuando** miro las columnas, **entonces** aparece `Folders` como columna adicional.

**Reglas y restricciones:**
- Default: `Date ↑` (ascendente por fecha, según frame_00015).
- Indicador: flecha arriba/abajo.
- Columnas ordenables: `Model`, `Descripción`, `Date`, `Author`.

**Modelo de datos tocado:**
- Estado transitorio del modal.

**Dependencias:**
- Bloqueada por: HU-30.032.

**Integraciones:**
- Lente con ordenamiento.

**Notas de evidencia:**
- Fuente: §2 tabla, §5.5.
- Frames: frame_00015 (columnas visibles con indicador de orden).
- Clase de afirmación: observado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [persistencia, modal, vista-lista, sort, columns].

---

### HU-30.034 — Ver glifos editable/candado/autosalvado en tiles de modelo

**Actor primario:** MN.
**Actores secundarios:** CO, RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; U secundaria.
**Superficie UI:** dialogo-cargar-modelo + dialogo-guardar-modelo (tiles de modelo en grid).
**Gesto canónico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero ver distintos glifos en los tiles de modelo según su estado (editable / solo lectura / autosalvado) para entender de un vistazo qué puedo hacer con cada uno.

**Contexto de negocio:**
Los glifos son afordances visuales que codifican el estado de permisos/versión sin requerir hover o clic. Son críticos para UX: un modelador no debería intentar editar algo que es solo lectura y fallar.

**Criterios de aceptación:**
- **Dado** que veo tiles en el grid, **cuando** miro, **entonces** cada tile tiene uno de tres glifos:
  - (a) hoja con pequeño eslabón = modelo editable con permiso de escritura,
  - (b) hoja con candado pequeño = modelo solo lectura (permisos) o versión archivada,
  - (c) hoja con flechas circulares = autosalvado.
- **Dado** que paso el cursor sobre un tile con candado, **cuando** espero tooltip, **entonces** muestra razón (permiso solo lectura / versión histórica).
- **Dado** que veo un tile con flechas circulares, **cuando** lo cargo, **entonces** es una versión generada por autosalvado, no por save explícito.

**Reglas y restricciones:**
- Tres glifos exclusivos y mutuamente excluyentes.
- El candado es el marcador universal de "no editable desde esta sesión" (aplica a versiones y solo lectura).
- Existe glifo `🔗` compartido con "objeto con URL" — **pregunta abierta** Q30.G sobre si son el mismo símbolo o solo emparentados visualmente (§11 Q8 doc fuente).

**Modelo de datos tocado:**
- Derivado de `modelo.permiso_para_usuario_actual` y `modelo.versions`.

**Dependencias:**
- Bloqueada por: HU-30.018 o HU-30.023 (versiones) o HU-30.025 (archivados).

**Integraciones:**
- Renderer: asset library de glifos.
- Sistema de permisos (EPICA-40).

**Notas de evidencia:**
- Fuente: §2 tabla, §9.
- Frames: frame_00015 (candado en listado), frame_00022 (candados en versiones).
- Transcripción: confirma los tres tipos.
- Clase de afirmación: observado + confirmado.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.
- Etiqueta: `requires-clarification` (Q30.G glifo `🔗`).

**Prioridad:** M1.
**Tamaño:** S.
**Etiquetas:** [persistencia, modal, iconografía, permisos, glifos, requires-clarification].

---

### HU-30.035 — autosalvado cada 5 minutos con glifo de flechas circulares

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; C (config).
**Superficie UI:** invisible durante modelado; observable en historial de versiones.
**Gesto canónico:** ninguno (automático).

**Historia:**
> Como modelador, quiero que el sistema autosalve cada 5 minutos (configurable) para no perder trabajo si mi navegador se cierra inesperadamente.

**Contexto de negocio:**
autosalvado es un safety net crítico. El intervalo default de 5 min balancea entre protección de datos y overhead. Se almacena como versión con glifo distintivo (flechas circulares) para distinguirla de saves explícitos.

**Criterios de aceptación:**
- **Dado** que el modelo está cargado y tiene cambios, **cuando** pasan 5 minutos desde el último save/autosalvado, **entonces** se dispara autosalvado automáticamente.
- **Dado** que se dispara autosalvado, **cuando** miro el historial con `Mostrar Versiones`, **entonces** aparece una versión con glifo de flechas circulares.
- **Dado** que el modelo no tiene cambios (estado clean), **cuando** pasan 5 minutos, **entonces** NO se dispara autosalvado (optimización inferida).
- **Dado** que configuro el intervalo en `OPCloud Settings ▸ General`, **cuando** se ajusta, **entonces** el nuevo intervalo se aplica desde la siguiente ventana.
- **Dado** que los autosaves se acumulan, **cuando** alcanzo la cuota (HU-30.024), **entonces** autosaves antiguos se descartan junto con saves según política log-scale.

**Reglas y restricciones:**
- Intervalo default: 5 min.
- Configurable en `OPCloud Settings ▸ General` (EPICA-80).
- Autosaves cuentan contra la cuota de versiones.
- Glifo distintivo: flechas circulares.

**Modelo de datos tocado:**
- `modelo.versions[].type` — `"save" | "autosalvado"` — persistente.
- `usuario.settings.intervalo_autosalvado_minutos` — int — persistente.

**Dependencias:**
- Bloqueada por: HU-30.008 (save base).
- Relaciona: HU-30.024 (cuota), HU-30.034 (glifo).

**Integraciones:**
- Settings (EPICA-80).

**Notas de evidencia:**
- Fuente: §4.4, §7.7.
- Transcripción: "cada autosalvado produce una versión con glifo de flechas circulares. El intervalo por defecto es 5 min y es configurable en OPCloud Settings".
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** M.
**Etiquetas:** [persistencia, autosalvado, policy, version, intervalo-5min].

---

### HU-30.036 — Redireccionar Guardar a Guardar como en modelo de solo lectura

**Actor primario:** CO (colaborador editor).
**Actores secundarios:** RV, MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** barra-herramientas-principal (Guardar) + menu-principal (Guardar) + dialogo-guardar-modelo.
**Gesto canónico:** clic en Guardar; redirección automática.

**Historia:**
> Como colaborador con permiso de lectura, quiero que al pulsar `Guardar` el sistema me redirija a `Guardar como` para poder guardar mi trabajo como modelo nuevo sin modificar el original.

**Contexto de negocio:**
Cuando el usuario actual no tiene permiso de escritura (p.ej. cargó un ejemplo global u organizacional, o un modelo compartido solo lectura), un Guardar directo fallaría. OPCloud mejora la UX redirigiendo a Guardar como automáticamente, convirtiendo un error en una operación constructiva.

**Criterios de aceptación:**
- **Dado** que cargué un modelo solo lectura (permisos o versión histórica), **cuando** pulso `Guardar`, **entonces** NO se intenta guardar en sitio; en lugar de eso se abre el diálogo `Guardar Modelo` pre-cargado como Guardar como.
- **Dado** la misma situación, **cuando** pulso `Ctrl+S`, **entonces** se comporta igual que Guardar.
- **Dado** que confirmo el Guardar como, **cuando** se procesa, **entonces** se crea un modelo nuevo con mis cambios; el original permanece intacto.
- **Dado** que cancelo el Guardar como, **cuando** se procesa, **entonces** no se guarda nada y el modelo solo lectura permanece cargado.

**Reglas y restricciones:**
- Redirección automática: sin aviso adicional (confirmado por transcripción).
- Cubre modelos solo lectura por permisos y versiones históricas.

**Dependencias:**
- Bloqueada por: HU-30.015 (save as), HU-30.005.
- Relaciona: EPICA-40 (permisos), HU-30.021, HU-30.022 (ejemplos).

**Integraciones:**
- Sistema de permisos.

**Notas de evidencia:**
- Fuente: §4.3.
- Transcripción: confirmado en carpeta 11 Permissions.
- Clase de afirmación: confirmado por transcripción.
- Fuente normativa: la SSOT OPM (ISO 19450) no regula el formato ni el mecanismo de persistencia — es una decisión de implementación.

**Prioridad:** S.
**Tamaño:** S.
**Etiquetas:** [persistencia, guardar, permisos, solo lectura, redirección].

---

### HU-30.037 — Cancelar modal con Cancelar o ESC sin persistir

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categórico:** U.
**Superficie UI:** dialogo-guardar-modelo + dialogo-cargar-modelo (botón `Cancelar` al pie + tecla ESC).
**Gesto canónico:** clic en `Cancelar` o tecla ESC.

**Historia:**
> Como modelador, quiero cancelar el modal con Cancelar o ESC para salir sin aplicar cambios cuando cambio de opinión o cometí un error.

**Contexto de negocio:**
La cancelación no-destructiva es un derecho básico del usuario. Ofrecer dos afordances (botón explícito y atajos) cubre ambos estilos de interacción. Clave: cancelar nunca persiste nada.

**Criterios de aceptación:**
- **Dado** que el modal Guardar está abierto con datos llenados, **cuando** pulso `Cancelar`, **entonces** el modal se cierra sin persistir; el modelo sigue en `Modelo (No guardado)` o con su estado previo.
- **Dado** el mismo estado, **cuando** presiono `ESC`, **entonces** el modal se cierra igual que con Cancelar.
- **Dado** que el modal Cargar está abierto, **cuando** cancelo, **entonces** el modal se cierra sin cargar modelo; el modelo actual permanece.
- **Dado** que creé una carpeta o ejecuté Renombrar antes de cancelar el modal, **cuando** cancelo, **entonces** esas operaciones ya ejecutadas NO se revierten (el Cancelar aplica al próximo Guardar, no a operaciones ya realizadas).

**Reglas y restricciones:**
- Cancelar no revierte operaciones ya confirmadas durante el mismo ciclo de modal (crear carpeta, rename).
- ESC equivale a Cancelar (**inferido** por analogía — §11 Q no explícito, pero consistente con patrón UI estándar).

**Dependencias:**
- Bloqueada por: HU-30.005 o HU-30.018.

**Notas de evidencia:**
- Fuente: §2 tabla, §4.5, §8.
- Transcripción: Cancelar explícito; ESC por analogía.
- Clase de afirmación: observado (Cancelar) + inferido (ESC).
- Fuente normativa: la SSOT OPM (ISO 19450) no regula la persistencia — la necesidad es universal para cualquier herramienta OPM pero el formato y mecanismo son decisiones de implementación.

**Prioridad:** M0.
**Tamaño:** XS.
**Etiquetas:** [persistencia, modal, cancel, atajos, esc].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q30.A** — Indicador "dirty" en la pestaña tras guardado (cf. HU-30.004). La transcripción y frames no aclaran si hay marcador post-guardado para cambios no guardados. Marcada `requires-clarification`.
- **Q30.B** — `Guardar como` con mismo nombre: ¿sobrescribe o duplica? (cf. HU-30.015, §11 Q2). Transcripción ambigua — "will replace the model to a newer model" deja abierto el caso exacto.
- **Q30.C** — Confirmación de descarte al pulsar `Nuevo Modelo` con cambios sin guardar (cf. HU-30.017, §11 Q3). No observada en frames.
- **Q30.D** — Pestaña nuevo vs pestaña actual al cargar modelo (cf. HU-30.019, §11 Q4). La transcripción alterna entre ambas formulaciones.
- **Q30.E** — Política de descarte FIFO exacta al agotar la cuota de 12 versiones (cf. HU-30.024, §11 Q5). Se asume FIFO, no observada regla explícita.
- **Q30.F** — ¿Búsqueda global respeta permisos de lectura o indexa también modelos sin permiso? (cf. HU-30.029, §11 Q7). Transcripción no aclara.
- **Q30.G** — Glifo `🔗` del tile es el mismo que el de "objeto con URL" en canvas, o solo visualmente emparentados (cf. HU-30.034, §11 Q8). Requiere clarificación de iconografía.
- **Q30.H** — Soporte de markdown/URLs en `Descripción` (cf. HU-30.007, §11 Q9). No observado.
- **Q30.I** — Naturaleza exacta del marcador `...` circular gris flotante en canvas (§11 Q1 doc fuente). Afordance UI observada persistentemente sobre el canvas durante operaciones guardar/cargar, naturaleza abierta: ¿menú contextual de OPD? ¿marcador de SD raíz? ¿widget sin semántica en export? **Nueva HU candidata**: HU-30.038 (deferred hasta clarificar).
- **Q30.J** — Conflicto de edición cuando dos usuarios editan el mismo modelo en paralelo (§11 Q10). Fuera de alcance de EPICA-30, delegado a EPICA-40 y EPICA-41.
- **Q30.K** — ¿Los modelos archivados cuentan contra algún límite de cuota de storage de la organización? (§11 Q6). No observable.
- **Q30.L** — Persistencia de preferencias de vista (tiles vs lista, columna de orden) entre sesiones (cf. HU-30.032, HU-30.033).

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/30-persistencia-save-load.md` (14 frames muestreados en carpetas `02` y `13`).
- **Épicas de las que depende esta:**
  - **EPICA-10**: HU-10.022 (pestaña `Modelo (No guardado)` durante creación inicial) es análoga a HU-30.004 aquí.
- **Épicas que dependen de esta:**
  - **EPICA-31** (persistencia-folders): HU-30.030, HU-30.031 son el punto de entrada para CRUD de carpetas.
  - **EPICA-32** (persistencia-sub-models): composición inter-modelo requiere guardar/cargar operativo.
  - **EPICA-33** (persistencia-templates): templates se apoyan en el mecanismo de persistencia.
  - **EPICA-34** (persistencia-new-model): wizard reemplaza/complementa HU-30.017.
  - **EPICA-35** (persistencia-move-search): move de modelos y búsqueda de things dentro del modelo; complementa la búsqueda global de HU-30.029.
  - **EPICA-40** (colaboracion-permisos): HU-30.021, HU-30.022, HU-30.034, HU-30.036 dependen de permisos.
  - **EPICA-80** (config-user-org): intervalo de autosalvado (HU-30.035).
  - **EPICA-90** (interaccion-atajos): HU-30.014 (Ctrl+S) se integra con el sistema global de atajos.
- **Invariantes del repo:**
  - `src/persistencia/` — IndexedDB, workspace, event log (capa 1 ya en prod, según memory).
  - `src/nucleo/serializacion/` — contrato de persistencia de payload OPM.
  - `src/ui/` — widgets de modal, toast.
  - `src/render/` — invariante de fidelidad visual post-carga (HU-30.008).
- **SSOT visual:** convención `V-xx` aplicable a glifos de tiles (HU-30.034) requiere entrada en `ssot/opm-visual-es.md`.
- **ADR relevante:** ADR-003 (tres capas) menciona la estrategia de persistencia IndexedDB Capa 1.
