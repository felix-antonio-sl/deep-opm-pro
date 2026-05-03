---
epica: "EPICA-31"
titulo: "Persistencia — carpetas, jerarquía, permisos y navegación del espacio de trabajo"
doc_fuente: "opcloud-reverse/31-persistencia-folders.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 26
ultima_actualizacion: 2026-04-23
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
---

## Resumen

Esta épica cubre la **gestión jerárquica del espacio de trabajo**: carpetas como contenedor de modelos, con CRUD completo (crear, renombrar, eliminar, mover), matriz de permisos Owner/Write/Read sobre usuarios y grupos con anidación, iconografía diferenciada (carpeta estándar vs `Shared` vs modelo con candado), navegación tipo explorador (breadcrumb, back, up, doble clic), y dos vistas (icon view vs detailed view). Toda la feature ocurre sobre diálogos modales superpuestos al canvas (compartidos entre `Cargar Modelo` y `Guardar Como`); el canvas no participa.

La épica es periférica al modelador core pero crítica para la usabilidad del producto cuando se adopta colaborativamente: sin carpetas y permisos legibles, un espacio de trabajo con 50+ modelos se vuelve inmanejable. Las HU se numeran por aparición en el doc fuente, sin reordenar por prioridad.

## Tabla de HU de la épica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-31.001 | Abrir diálogo Cargar Modelo desde main menu | MN | M0 | S | opcloud-ui | — |
| HU-31.002 | Ver Home con Modelos Recientes y lista de carpetas | MN | M0 | S | opcloud-ui | — |
| HU-31.003 | Seleccionar carpeta con clic simple (activar acciones) | MN | M0 | XS | opcloud-ui | — |
| HU-31.004 | Abrir carpeta con doble clic o botón Abrir | MN | M0 | XS | opcloud-ui | — |
| HU-31.005 | Navegar hacia arriba con flecha back en breadcrumb | MN | M0 | XS | opcloud-ui | — |
| HU-31.006 | Ver breadcrumb con ruta completa | MN | M0 | S | opcloud-ui | — |
| HU-31.007 | Crear carpeta nueva con Nueva Carpeta e input inline | ME | M0 | S | opcloud-ui | — |
| HU-31.008 | Restringir creación en Home a admins | AO | M1 | S | opcloud-ui | — |
| HU-31.009 | Renombrar carpeta seleccionada | ME | M0 | S | opcloud-ui | — |
| HU-31.010 | Eliminar carpeta con confirmación | ME | M0 | S | opcloud-ui | — |
| HU-31.011 | Cortar carpeta con Cortar Carpeta | ME | M1 | S | opcloud-ui | — |
| HU-31.012 | Pegar carpeta cortada en destino | ME | M1 | S | opcloud-ui | — |
| HU-31.013 | Mover carpeta con drag-and-drop directo | ME | M1 | M | opcloud-ui | — |
| HU-31.014 | Unir permisos al mover carpeta entre destinos | AO | M1 | M | opcloud-ui | — |
| HU-31.015 | Abrir diálogo modal Permisos de Carpeta desde selección | AO | M1 | S | opcloud-ui | — |
| HU-31.016 | Ver matriz O/W/R con All Organization Users | AO | M1 | S | opcloud-ui | — |
| HU-31.017 | Ver Groups como filas expandibles en matriz | AO | M1 | S | opcloud-ui | — |
| HU-31.018 | Expandir grupo para ver usuarios individuales | AO | M1 | S | opcloud-ui | — |
| HU-31.019 | Activar Automatic Model Read Permission en carpeta | AO | S | S | opcloud-ui | — |
| HU-31.020 | Guardar cambios de permisos con toast de éxito | AO | M1 | XS | opcloud-ui | — |
| HU-31.021 | Ver permisos vigentes por hover tooltip | AO | S | XS | opcloud-ui | — |
| HU-31.022 | Alternar entre icon view y detailed view | ME | S | M | opcloud-ui | — |
| HU-31.023 | Ordenar columnas en detailed view con flechas | ME | S | S | opcloud-ui | — |
| HU-31.024 | Ver carpeta Shared con icono azul diferenciado | MN | M0 | XS | opcloud-ui | — |
| HU-31.025 | Ver modelo con candado cuando falta permiso | MN | M0 | XS | opcloud-ui | — |
| HU-31.026 | Ver menú contextual por clic derecho sobre carpeta | ME | S | S | opcloud-ui | — |

Total: **26 historias de usuario**.

## Historias de usuario

### HU-31.001 — Abrir diálogo Cargar Modelo desde main menu

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME, RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (consulta espacio de trabajo).
**Superficie UI:** main-menu + dialogo-modal-cargar-modelo.
**Gesto canónico:** clic en `Abrir` del main menu.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero abrir el diálogo modal `Cargar Modelo` desde el main menu para explorar el espacio de trabajo y elegir qué modelo abrir sin perder el contexto del canvas de fondo.

**Contexto de negocio:**
`Cargar Modelo` es el punto de entrada canónico al espacio de trabajo. Al ser un diálogo modal superpuesto, el canvas con el modelo actual permanece intacto al fondo (pestaña `Modelo (No Guardado)` visible), permitiendo cancelar sin efectos colaterales. Es el gesto obligatorio para pasar de la sesión actual a otro modelo.

**Criterios de aceptación:**
- **Dado** que estoy en el canvas, **cuando** activo `Abrir` desde el main menu, **entonces** se abre un diálogo modal centrado con título `Cargar Modelo`.
- **Dado** que el diálogo modal acaba de abrirse, **cuando** lo miro, **entonces** el breadcrumb muestra `Home` como ubicación inicial.
- **Dado** que el diálogo modal está abierto, **cuando** hago clic fuera del área del diálogo modal o en `Cancelar`, **entonces** el diálogo modal se cierra sin cambios sobre el modelo actual.
- **Dado** que el diálogo modal está abierto, **cuando** miro la UI, **entonces** veo la banda superior con `Buscar`, `Incluir Todas las Subcarpetas`, toggles `Mostrar Versiones` y `Mostrar Archivados`, todos OFF por defecto.

**Reglas y restricciones:**
- El diálogo modal es blocking: el canvas no se edita mientras está abierto.
- Defaults: toggles `Mostrar Versiones` y `Mostrar Archivados` en OFF; `Incluir Todas las Subcarpetas` en OFF.
- Paridad: `Guardar Como` abre el mismo diálogo modal con título `Guardar Como` — ver EPICA-30 HU correspondiente.

**Modelo de datos tocado:**
- `ui_state.load_modal.open` — boolean — transitorio.
- `ui_state.load_modal.current_folder` — `carpeta.id` — transitorio, inicializado a `Home`.

**Dependencias:**
- Bloquea a: HU-31.002, HU-31.003, HU-31.015.

**Integraciones:**
- Main menu (EPICA-30).
- Diálogo `Guardar Como` (paridad de maquinaria).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/31-persistencia-folders.md` §2, §3.1.
- Frames: frame_00005.
- Transcripción: `load model screen or save as screen`.
- Clase de afirmación: observado + confirmado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, dialogo-modal, cargar].

---

### HU-31.002 — Ver Home con Modelos Recientes y lista de carpetas

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L (lente espacio de trabajo).
**Superficie UI:** dialogo-modal-cargar-modelo (cuerpo en Home).
**Gesto canónico:** ninguno (render inmediato al abrir en Home).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero ver en la raíz `Home` una tira de modelos recientes y a continuación la lista de carpetas accesibles, para identificar rápido tanto lo último abierto como la estructura global.

**Contexto de negocio:**
Los usuarios pasan la mayor parte del tiempo volviendo a modelos recientes; exponer una tira `Modelos Recientes` en el `Home` reduce el trabajo cognitivo de navegar. A la vez, mostrar toda la lista de carpetas debajo orienta al usuario menos frecuente sobre la estructura disponible.

**Criterios de aceptación:**
- **Dado** que abro el diálogo modal y el breadcrumb es `Home`, **cuando** miro el cuerpo, **entonces** veo una fila `Modelos Recientes` con hasta seis tiles de documentos.
- **Dado** que un tile de Modelos Recientes pertenece a un modelo con permiso insuficiente, **cuando** lo veo, **entonces** tiene icono candado (ver HU-31.025).
- **Dado** que estoy en `Home`, **cuando** bajo la vista, **entonces** veo las carpetas accesibles con `Shared` siempre primera (icono azul) y el resto en gris.
- **Dado** que navego dentro de una subcarpeta, **cuando** miro el cuerpo, **entonces** NO veo la tira `Modelos Recientes` (es exclusiva de `Home`).

**Reglas y restricciones:**
- Capacidad observada: 6 tiles en `Modelos Recientes`.
- `Shared` siempre aparece primera en el listado de `Home` (convención observada §9).
- El orden del resto de carpetas es a definir (pregunta abierta del doc fuente, probablemente alfabético o por última modificación).

**Modelo de datos tocado:**
- `recent_models` — lista por usuario de `modelo.id` — persistente.
- `carpeta.parent` — `carpeta.id` nullable (null = Home) — persistente.

**Dependencias:**
- Bloqueada por: HU-31.001.

**Integraciones:**
- Tile de Modelos Recientes abre el modelo directamente (delegar a EPICA-30).
- Iconografía carpeta estándar vs Shared (HU-31.024).

**Notas de evidencia:**
- Fuente: §2 (tira Modelos Recientes), §3.1, §9.
- Frames: frame_00005, frame_00030, frame_00035.
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, home, recent-models, lente].

---

### HU-31.003 — Seleccionar carpeta con clic simple (activar acciones)

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** dialogo-modal-cargar-modelo (cuerpo) + barra-acciones-inferior.
**Gesto canónico:** clic simple sobre tile o fila de carpeta.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero seleccionar una carpeta con clic simple para activar las acciones `Renombrar`, `Cortar Carpeta`, `Eliminar Carpeta`, `Abrir` en la barra inferior, sin abrirla todavía.

**Contexto de negocio:**
El clic simple debe actuar como **selección**, no como navegación. Esto permite al usuario decidir qué acción tomar (abrir, renombrar, cortar, eliminar) sin forzar la navegación. Las acciones aparecen habilitadas o grises según permiso del usuario sobre la carpeta.

**Criterios de aceptación:**
- **Dado** que el diálogo modal está en `Home` sin selección, **cuando** miro la barra inferior, **entonces** solo `Nueva Carpeta`, `Atrás`, `Cancelar` están activos.
- **Dado** que hago clic simple sobre una carpeta, **cuando** miro la barra inferior, **entonces** `Renombrar`, `Eliminar Carpeta`, `Cortar Carpeta`, `Abrir` se activan según permiso del usuario.
- **Dado** que la carpeta seleccionada tiene permiso `R` solo, **cuando** miro las acciones, **entonces** `Renombrar`, `Eliminar Carpeta`, `Cortar Carpeta` permanecen grises (requieren `O`).
- **Dado** que hay una selección activa, **cuando** hago clic sobre otra carpeta, **entonces** la selección cambia y se re-evalúan los permisos.
- **Dado** que hay selección, **cuando** hago clic en zona vacía del cuerpo, **entonces** se deselecciona y la barra vuelve al estado sin-selección.

**Reglas y restricciones:**
- El clic simple es selector, no opener.
- Las acciones se habilitan por permiso: `R` → `Abrir`; `O` → `Renombrar`, `Eliminar Carpeta`, `Cortar Carpeta`, `Permisos de Carpeta`.
- Visualmente la carpeta seleccionada tiene fondo/borde resaltado.

**Modelo de datos tocado:**
- `ui_state.load_modal.selection` — `carpeta.id` nullable — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.001, HU-31.002.
- Bloquea a: HU-31.004, HU-31.009, HU-31.010, HU-31.011, HU-31.015.

**Integraciones:**
- Barra de acciones inferior (estado activo/gris).
- Matriz de permisos del kernel.

**Notas de evidencia:**
- Fuente: §2 (tabla activaciones), §3.2, §4.1, §5.3.
- Frames: frame_00005 (sin selección: `Renombrar` gris), frame_00020 (con selección: acciones activas).
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, selección, acciones-contextuales].

---

### HU-31.004 — Abrir carpeta con doble clic o botón Abrir

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; L (cambio de lente).
**Superficie UI:** dialogo-modal-cargar-modelo + breadcrumb.
**Gesto canónico:** doble clic sobre tile/fila, o clic en botón `Abrir`.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero abrir una carpeta con doble clic o con el botón `Abrir` para navegar a su contenido sin depender de un único gesto.

**Contexto de negocio:**
Ofrecer dos rutas (doble clic directo vs selección + botón) cubre tanto al usuario rápido como al que prefiere confirmar. La apertura actualiza el breadcrumb y refresca el cuerpo con las subcarpetas y modelos del destino.

**Criterios de aceptación:**
- **Dado** que hago doble clic sobre una carpeta con permiso `R`, **cuando** se ejecuta, **entonces** el breadcrumb se actualiza (p.ej. `Home` → `Home / Shared`) y el cuerpo muestra el contenido de la carpeta.
- **Dado** que tengo una carpeta seleccionada, **cuando** hago clic en `Abrir`, **entonces** el efecto es idéntico al doble clic.
- **Dado** que la carpeta tiene contenido mixto (subcarpetas + modelos), **cuando** entro, **entonces** veo ambas categorías según la vista activa (icon view / detailed view).
- **Dado** que no tengo permiso `R` sobre la carpeta, **cuando** intento abrir, **entonces** la acción está bloqueada (gris) — caso descrito en HU-31.003.

**Reglas y restricciones:**
- El doble clic es timing-sensible (default del sistema operativo).
- Al entrar, la selección previa se pierde; el cuerpo muestra contenido sin selección por defecto.

**Modelo de datos tocado:**
- `ui_state.load_modal.current_folder` — `carpeta.id` — transitorio.
- `ui_state.load_modal.selection` — `null` al abrir — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.003.
- Bloquea a: HU-31.005 (navegación ascendente requiere haber entrado).

**Integraciones:**
- Breadcrumb (HU-31.006).
- Lente del cuerpo (renderiza subcarpetas + modelos).

**Notas de evidencia:**
- Fuente: §3.2 paso 2.
- Frames: frame_00025 (subcarpeta abierta con `edX Model`, `gal_ep`, `n3`, `shani`, `t1`, `t2`).
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, navegación, doble-clic, abrir].

---

### HU-31.005 — Navegar hacia arriba con flecha back en breadcrumb

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** breadcrumb + toolbar-detailed-view.
**Gesto canónico:** clic en flecha `<` del breadcrumb, botón `Arriba` (detailed view), o botón `Atrás` de la barra inferior.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero subir un nivel en la jerarquía con la flecha back del breadcrumb, con el botón `Arriba` en detailed view o con `Atrás` en la barra inferior, para tener múltiples afordances equivalentes.

**Contexto de negocio:**
La navegación ascendente es tan frecuente como la descendente. Tener tres rutas (flecha visual en breadcrumb, `Arriba` en toolbar, `Atrás` en barra inferior) cubre distintos estilos de interacción y mantiene la acción siempre accesible.

**Criterios de aceptación:**
- **Dado** que estoy en `Home / Shared`, **cuando** hago clic en la flecha `<` del breadcrumb, **entonces** subo a `Home`.
- **Dado** que estoy en detailed view y hago clic en el botón `Arriba`, **cuando** se ejecuta, **entonces** el efecto es equivalente a la flecha back.
- **Dado** que hago clic en `Atrás` de la barra inferior, **cuando** se ejecuta, **entonces** el efecto es también equivalente.
- **Dado** que estoy en `Home`, **cuando** miro la flecha back, **entonces** está deshabilitada o invisible (no hay padre).
- **Dado** que subí un nivel, **cuando** miro la selección, **entonces** se perdió (reset).

**Reglas y restricciones:**
- Los tres gestos son intercambiables semánticamente.
- En `Home`, el acceso ascendente está bloqueado visualmente.

**Modelo de datos tocado:**
- `ui_state.load_modal.current_folder` — cambia a `carpeta.parent` — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.004.

**Integraciones:**
- Breadcrumb (HU-31.006).

**Notas de evidencia:**
- Fuente: §2, §3.2 paso 4.
- Frames: frame_00039 (cursor sobre flecha `<` al lado de `Home`).
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, breadcrumb, navegación, back].

---

### HU-31.006 — Ver breadcrumb con ruta completa

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** L.
**Superficie UI:** dialogo-modal-cargar-modelo (banda breadcrumb).
**Gesto canónico:** ninguno (render declarativo).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero ver el breadcrumb con la ruta completa (`Home / Shared / <sub>`) para saber en todo momento dónde estoy dentro de la jerarquía del espacio de trabajo.

**Contexto de negocio:**
El breadcrumb es el dispositivo clásico para ubicarse en un árbol profundo. Mostrar la ruta completa hasta la carpeta actual permite tanto orientación (saber dónde estoy) como navegación ascendente por segmentos (clic en un segmento salta a él — confirmar).

**Criterios de aceptación:**
- **Dado** que estoy en `Home`, **cuando** miro el breadcrumb, **entonces** muestra solo `Home`.
- **Dado** que estoy en `Home / Shared / OnStar`, **cuando** miro el breadcrumb, **entonces** muestra la ruta completa con separadores `/`.
- **Dado** que hago clic en un segmento intermedio del breadcrumb, **cuando** se ejecuta, **entonces** navego directamente a ese nivel (comportamiento a confirmar — **pregunta abierta**).
- **Dado** que la ruta es muy larga, **cuando** se renderiza, **entonces** se aplica truncado o scroll horizontal (a definir).

**Reglas y restricciones:**
- Separador: ` / ` con espacios.
- Segmento terminal (carpeta actual) no es clicable.
- Clickabilidad de segmentos intermedios: pregunta abierta.

**Modelo de datos tocado:**
- `ui_state.load_modal.breadcrumb` — derivado de `current_folder` + cadena de `parent` — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.004.

**Integraciones:**
- Navegación ascendente (HU-31.005).

**Notas de evidencia:**
- Fuente: §2, §3.2 paso 3.
- Frames: frame_00039, frame_00025.
- Clase de afirmación: observado; clickabilidad intermedia es hipótesis.
- Etiqueta: `requires-clarification` parcial.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, breadcrumb, navegación, requires-clarification].

---

### HU-31.007 — Crear carpeta nueva con Nueva Carpeta e input inline

**Actor primario:** ME.
**Actores secundarios:** AD, AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario (nueva entidad carpeta); U secundaria.
**Superficie UI:** dialogo-modal-cargar-modelo + input-inline.
**Gesto canónico:** clic en botón `Nueva Carpeta` + escritura + Enter/confirmar.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero crear una carpeta nueva dentro del directorio actual con `Nueva Carpeta` y un input inline para nombrarla, de modo que pueda organizar mis modelos sin cambiar de contexto.

**Contexto de negocio:**
La creación inline (en lugar de un diálogo modal secundario) mantiene al usuario en el flujo: ve el diálogo modal de `Cargar Modelo` con la nueva carpeta naciendo dentro. El gesto es simétrico entre icon view y detailed view. La creación solo procede si el usuario tiene permiso `W` sobre el directorio contenedor.

**Criterios de aceptación:**
- **Dado** que tengo permiso `W` sobre la carpeta actual, **cuando** hago clic en `Nueva Carpeta`, **entonces** aparece un input inline con foco listo para escribir.
- **Dado** que el input está activo, **cuando** escribo un nombre y confirmo con `Enter`, **entonces** se crea una carpeta con ese nombre dentro del directorio actual y aparece como tile/fila.
- **Dado** que el input está activo, **cuando** presiono `Esc` o hago clic fuera, **entonces** la creación se cancela sin efectos.
- **Dado** que intento crear con nombre vacío o duplicado en el mismo nivel, **cuando** confirmo, **entonces** aparece error inline y la carpeta no se crea.
- **Dado** que no tengo permiso `W`, **cuando** miro `Nueva Carpeta`, **entonces** está gris/deshabilitado.

**Reglas y restricciones:**
- Unicidad: nombre único dentro del mismo padre (no globalmente).
- Creación hereda permisos: owner = usuario actual, ACL inicial = default del tenant (a definir).
- Simetría entre icon view (tile aparece) y detailed view (fila nueva).

**Modelo de datos tocado:**
- `carpeta.id` — UUID — persistente.
- `carpeta.name` — string — persistente.
- `carpeta.parent` — `carpeta.id` nullable — persistente.
- `carpeta.owner` — `user.id` — persistente.
- `carpeta.archived` — boolean (default false) — persistente.
- `carpeta.acl` — lista de tuplas `(principal, {O,W,R})` — persistente.

**Dependencias:**
- Bloqueada por: HU-31.001.
- Relaciona: HU-31.008 (restricción admin en Home).

**Integraciones:**
- Validador de unicidad en nivel.
- Permisos: consulta `W` antes de habilitar.

**Notas de evidencia:**
- Fuente: §3.3.
- Frames: implícito en §3.3, no hay frame directo.
- Clase de afirmación: observado + inferido (detalle del input inline).

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, creación, new-folder, input-inline].

---

### HU-31.008 — Restringir creación en Home a admins

**Actor primario:** AO (admin de organización).
**Actores secundarios:** MN (afectado por la restricción).
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; C (política organizacional).
**Superficie UI:** dialogo-modal-cargar-modelo en Home + feedback de bloqueo.
**Gesto canónico:** ninguno (restricción automática).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero que solo admins puedan crear carpetas/modelos directamente en `Home` para mantener la raíz del espacio de trabajo limpia y estructurada, redirigiendo a los usuarios normales hacia `Shared`.

**Contexto de negocio:**
Si cualquier usuario pudiera crear en `Home`, el root degeneraría en ruido. La política observada: solo admins pueden crear en root; para el resto de usuarios, `Shared` es el único punto de entrada con write abierto. Esto jerarquiza la creación y deja `Home` como directorio curado.

**Criterios de aceptación:**
- **Dado** que soy admin, **cuando** estoy en `Home`, **entonces** `Nueva Carpeta` está habilitado.
- **Dado** que soy un usuario no-admin, **cuando** estoy en `Home`, **entonces** `Nueva Carpeta` está gris/deshabilitado con tooltip explicativo.
- **Dado** que soy un usuario no-admin, **cuando** entro a `Shared` (que tiene `W` para todos los modeladores), **entonces** `Nueva Carpeta` está habilitado.
- **Dado** que soy admin y creo una carpeta en `Home`, **cuando** se crea, **entonces** aparece en el listado junto a las existentes.

**Reglas y restricciones:**
- Restricción derivada de ACL de `Home`: `W` solo para rol admin.
- `Shared` tiene ACL default: `All Organization Users → W`.
- La restricción es del kernel de permisos, no UI: la UI solo refleja.

**Modelo de datos tocado:**
- `carpeta.acl` (sobre `Home`) — persistente.
- `role` (user vs admin) — persistente.

**Dependencias:**
- Bloqueada por: HU-31.007, HU-31.016 (matriz de permisos).

**Integraciones:**
- Sistema de roles organizacionales (EPICA-80).

**Notas de evidencia:**
- Fuente: §3.3 (transcripción: solo admins pueden crear en root).
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, permisos, admin, root, política-organización].

---

### HU-31.009 — Renombrar carpeta seleccionada

**Actor primario:** ME.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** barra-acciones-inferior + input-inline.
**Gesto canónico:** clic en `Renombrar` + escritura + Enter.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero renombrar una carpeta seleccionada con `Renombrar` + input inline para reorganizar mi espacio de trabajo sin abrir un diálogo modal separado.

**Contexto de negocio:**
El renombre requiere permiso `O` (owner) sobre la carpeta — la política observada en el doc fuente. La acción es simétrica con `Nueva Carpeta` en presentación (input inline sobre el tile/fila). Al confirmar, el nombre se actualiza en todas las vistas (breadcrumb si aplica, tiles, tabla).

**Criterios de aceptación:**
- **Dado** que tengo seleccionada una carpeta con permiso `O`, **cuando** hago clic en `Renombrar`, **entonces** el nombre del tile/fila se transforma en input editable con el nombre actual preseleccionado.
- **Dado** que el input está activo, **cuando** escribo un nuevo nombre y presiono `Enter`, **entonces** el nombre se persiste en `carpeta.name`.
- **Dado** que el input está activo, **cuando** presiono `Esc`, **entonces** el nombre original se conserva.
- **Dado** que no tengo permiso `O`, **cuando** miro `Renombrar`, **entonces** está gris.
- **Dado** que el nuevo nombre duplica uno existente en el mismo nivel, **cuando** confirmo, **entonces** error inline y no se persiste.
- **Dado** que renombré la carpeta, **cuando** consulto el breadcrumb (si está dentro de ella), **entonces** muestra el nuevo nombre.

**Reglas y restricciones:**
- Unicidad en el mismo padre.
- Requiere permiso `O`.
- Nombre no puede estar vacío.

**Modelo de datos tocado:**
- `carpeta.name` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-31.003.

**Integraciones:**
- Breadcrumb (si la carpeta renombrada está en la ruta activa).
- Lista de carpetas de nivel actual.

**Notas de evidencia:**
- Fuente: §3.4, §4.1.
- Frames: frame_00005 (Renombrar gris sin selección), frame_00020 (Renombrar activo con selección).
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, rename, input-inline].

---

### HU-31.010 — Eliminar carpeta con confirmación

**Actor primario:** ME.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U secundaria.
**Superficie UI:** barra-acciones-inferior + dialogo-modal-confirmación.
**Gesto canónico:** clic en `Eliminar Carpeta` + confirmar en diálogo modal.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero eliminar una carpeta seleccionada con `Eliminar Carpeta` y confirmar en un diálogo modal, para evitar borrados accidentales de contenido que podría ser compartido.

**Contexto de negocio:**
El borrado de carpetas es destructivo; requiere permiso `O` y confirmación explícita. El comportamiento exacto cuando la carpeta contiene modelos es **pregunta abierta** (§11.2 doc fuente): ¿rechaza, cascada, o mueve a papelera? La HU deja el comportamiento específico dentro del rango y marca la decisión como clarificación necesaria.

**Criterios de aceptación:**
- **Dado** que tengo seleccionada una carpeta vacía con permiso `O`, **cuando** hago clic en `Eliminar Carpeta`, **entonces** aparece diálogo modal de confirmación con texto `Delete <nombre>?`.
- **Dado** que confirmo el diálogo modal, **cuando** se ejecuta, **entonces** la carpeta desaparece del listado y se persiste la baja.
- **Dado** que cancelo el diálogo modal, **cuando** se cierra, **entonces** no hay efectos.
- **Dado** que la carpeta contiene modelos o subcarpetas, **cuando** intento eliminar, **entonces** el comportamiento es uno de: rechazo con mensaje / cascada tras segundo warning / archivado soft — **pregunta abierta**.
- **Dado** que no tengo permiso `O`, **cuando** miro `Eliminar Carpeta`, **entonces** está gris.

**Reglas y restricciones:**
- Requiere permiso `O`.
- Requiere confirmación (el patrón del producto lo exige aunque no haya frame directo §4.2).
- Comportamiento sobre contenido no vacío: `requires-clarification`.

**Modelo de datos tocado:**
- `carpeta` — baja persistente (o archivado, según clarificación).

**Dependencias:**
- Bloqueada por: HU-31.003.

**Integraciones:**
- Diálogo modal de confirmación genérico.
- Kernel de persistencia de carpetas.

**Notas de evidencia:**
- Fuente: §3.4, §4.1, §4.2, §11.2 (pregunta abierta).
- Clase de afirmación: observado + abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** M0.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, remove, confirmación, requires-clarification].

---

### HU-31.011 — Cortar carpeta con Cortar Carpeta

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (marca transitoria de corte).
**Superficie UI:** barra-acciones-inferior + indicador-corte.
**Gesto canónico:** clic en `Cortar Carpeta` sobre carpeta seleccionada.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero cortar una carpeta con `Cortar Carpeta` para marcarla como pendiente de pegar en otro destino, siguiendo el patrón cut/paste clásico.

**Contexto de negocio:**
El patrón cut/paste es universalmente comprensible y permite mover sin depender de tener origen y destino visibles simultáneamente. Marcar el corte es transitorio: vive mientras el diálogo modal está abierto (o hasta que se pegue/cancele — comportamiento tras cancelar diálogo modal es **pregunta abierta** §11.4).

**Criterios de aceptación:**
- **Dado** que tengo seleccionada una carpeta con permiso `O`, **cuando** hago clic en `Cortar Carpeta`, **entonces** la carpeta queda marcada visualmente (atenuada, borde punteado u otro indicador) y la UI registra el corte pendiente.
- **Dado** que hay un corte pendiente, **cuando** navego por la jerarquía, **entonces** el indicador persiste y aparece un cuarto ícono de `Pegar Carpeta` en la toolbar superior (detailed view) o botón en barra inferior.
- **Dado** que hago clic en `Cortar Carpeta` sobre otra carpeta, **cuando** se ejecuta, **entonces** el corte previo se reemplaza por el nuevo.
- **Dado** que no tengo permiso `O`, **cuando** miro `Cortar Carpeta`, **entonces** está gris.
- **Dado** que cerré el diálogo modal sin pegar, **cuando** lo vuelvo a abrir, **entonces** el corte **pregunta abierta**: ¿persiste o se pierde? (§11.4).

**Reglas y restricciones:**
- Requiere permiso `O` sobre la carpeta.
- Solo un corte pendiente activo a la vez.
- Persistencia del corte entre sesiones: abierto.

**Modelo de datos tocado:**
- `ui_state.load_modal.cut_pending` — `carpeta.id` nullable — transitorio (posiblemente persistente — abierto).

**Dependencias:**
- Bloqueada por: HU-31.003.
- Bloquea a: HU-31.012 (paste requiere cut previo).

**Integraciones:**
- Indicador visual de corte pendiente.

**Notas de evidencia:**
- Fuente: §3.5 pasos 1-2, §11.4, §11.6.
- Frames: frame_00020 (cuarto ícono paste visible en toolbar superior).
- Clase de afirmación: observado + abierto (persistencia entre sesiones).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, cut, move, requires-clarification].

---

### HU-31.012 — Pegar carpeta cortada en destino

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario (movimiento real); U secundaria.
**Superficie UI:** toolbar-superior (ícono paste) o barra-acciones-inferior + dialogo-modal-confirmación.
**Gesto canónico:** clic en `Pegar Carpeta` + confirmar.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero pegar una carpeta cortada en el destino actual con `Pegar Carpeta` y confirmar, para completar el movimiento de forma explícita.

**Contexto de negocio:**
El paste completa el ciclo cut/paste con confirmación: se evita la ejecución inmediata sin verificar destino. El movimiento cambia `carpeta.parent` y aplica la unión de permisos descrita en HU-31.014.

**Criterios de aceptación:**
- **Dado** que hay una carpeta cortada y estoy en un destino con permiso `W`, **cuando** hago clic en `Pegar Carpeta`, **entonces** aparece diálogo modal de confirmación con texto `Move <nombre> to <destino>?`.
- **Dado** que confirmo el diálogo modal, **cuando** se ejecuta, **entonces** la carpeta cambia de padre, aparece en el nuevo destino y desaparece del origen.
- **Dado** que confirmo, **cuando** se aplica, **entonces** los permisos del origen se unen con los del destino (ver HU-31.014).
- **Dado** que cancelo el diálogo modal de confirmación, **cuando** se cierra, **entonces** el corte permanece pendiente.
- **Dado** que intento pegar sobre el mismo padre, **cuando** confirmo, **entonces** la acción es no-op con mensaje informativo.
- **Dado** que no tengo permiso `W` sobre el destino, **cuando** navego allí con corte pendiente, **entonces** `Pegar Carpeta` está gris.

**Reglas y restricciones:**
- Requiere permiso `W` sobre destino.
- Confirma antes de ejecutar (§4.2).
- El corte se consume tras paste exitoso.
- No se permite pegar en una subcarpeta del propio cortado (evita ciclo).

**Modelo de datos tocado:**
- `carpeta.parent` — cambia — persistente.
- `carpeta.acl` — se recalcula por unión — persistente (ver HU-31.014).
- `ui_state.load_modal.cut_pending` — se limpia — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.011.
- Relaciona: HU-31.014.

**Integraciones:**
- Diálogo modal de confirmación.
- Validador de ciclos en la jerarquía.

**Notas de evidencia:**
- Fuente: §3.5 paso 4-5, §4.2.
- Frames: frame_00020 (cuarto ícono contextual paste).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, paste, move, confirmación].

---

### HU-31.013 — Mover carpeta con drag-and-drop directo

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (movimiento).
**Superficie UI:** dialogo-modal-cargar-modelo (cuerpo).
**Gesto canónico:** drag desde tile/fila origen + drop sobre tile/fila destino.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero mover una carpeta con drag-and-drop directo sobre el tile destino cuando ambas están visibles, para evitar el paso intermedio de cut/paste.

**Contexto de negocio:**
Cuando origen y destino son visibles simultáneamente (mismo nivel, por ejemplo), el drag-drop es más eficiente que cut/paste. Es la alternativa gestural al patrón del portapapeles. Requiere los mismos permisos (`O` sobre origen, `W` sobre destino) y dispara la misma confirmación.

**Criterios de aceptación:**
- **Dado** que tengo permiso `O` sobre una carpeta A y permiso `W` sobre una carpeta destino B visible en el mismo nivel, **cuando** arrastro A sobre B y suelto, **entonces** aparece diálogo modal de confirmación `Move A to B?`.
- **Dado** que confirmo, **cuando** se ejecuta, **entonces** A cambia de padre a B y los permisos se unen.
- **Dado** que cancelo, **cuando** se cierra el diálogo modal, **entonces** A permanece en su ubicación original.
- **Dado** que arrastro A sobre una zona inválida (modelo, zona vacía, sí mismo, o subcarpeta de A), **cuando** suelto, **entonces** no ocurre nada o feedback visual de "no drop".
- **Dado** que no tengo permiso suficiente, **cuando** arrastro, **entonces** el cursor indica "no permitido" y el drop no se procesa.

**Reglas y restricciones:**
- Permisos idénticos a cut/paste (HU-31.011, HU-31.012).
- Ciclos prohibidos: no se puede soltar sobre sí mismo ni sobre descendientes.
- Confirmación idéntica a paste.
- Feedback visual durante drag: ghost del tile que se mueve, highlight del destino válido.

**Modelo de datos tocado:**
- Idéntico a HU-31.012.

**Dependencias:**
- Bloqueada por: HU-31.012 (comparte confirmación y unión de permisos).
- Relaciona: EPICA-35 (move completo incluyendo modelos).

**Integraciones:**
- Motor drag-drop (lib interna o JointJS si se reutiliza).
- Validador de ciclos.

**Notas de evidencia:**
- Fuente: §3.5 alternativa observada en transcripción.
- Clase de afirmación: confirmado por transcripción.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [persistencia, ui, drag-drop, move].

---

### HU-31.014 — Unir permisos al mover carpeta entre destinos

**Actor primario:** AO.
**Actores secundarios:** ME (observador del efecto).
**Tipo:** opcloud-ui.
**Nivel categórico:** K primario (regla de política); P (persistencia ACL).
**Superficie UI:** ninguna visible directa (efecto al mover).
**Gesto canónico:** ninguno (consecuencia de HU-31.012 / HU-31.013).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero que al mover una carpeta se unan sus permisos con los del destino en lugar de reemplazarlos, para evitar pérdida accidental de accesos previos.

**Contexto de negocio:**
La regla observada en transcripción: "Mover una carpeta otorga a la carpeta origen los permisos de la carpeta destino **además** de los que ya tenía". Es unión, no reemplazo. Garantiza que ningún usuario pierde acceso por un move, al costo de requerir limpieza manual si se quiere restringir después.

**Criterios de aceptación:**
- **Dado** que una carpeta A tiene permisos `{grupo1:O, grupo2:R}` y la destino B tiene `{grupo3:W}`, **cuando** muevo A dentro de B, **entonces** A termina con ACL `{grupo1:O, grupo2:R, grupo3:W}` (unión).
- **Dado** que A ya tenía `grupo3:R` y B da `grupo3:W`, **cuando** se ejecuta la unión, **entonces** A termina con `grupo3:W` (el mayor nivel gana).
- **Dado** que se ejecutó el move, **cuando** abro `Permisos de Carpeta` sobre A, **entonces** veo la ACL resultante.
- **Dado** que se ejecutó el move, **cuando** miro la UI, **entonces** se muestra un diff de permisos antes de aplicar (**pregunta abierta** §11.5).

**Reglas y restricciones:**
- Regla: **unión acumulativa** de ACLs.
- Cuando hay conflicto (mismo principal, niveles diferentes), gana el **mayor alcance** (O > W > R).
- Visualización del diff pre-ejecución: `requires-clarification`.

**Modelo de datos tocado:**
- `carpeta.acl` — recalculada como unión por principal — persistente.

**Dependencias:**
- Bloqueada por: HU-31.012 y/o HU-31.013.

**Integraciones:**
- Matriz de permisos (EPICA-40 para detalles transversales).

**Notas de evidencia:**
- Fuente: §3.5 regla narrada, §11.5 pregunta abierta.
- Transcripción: "mover una carpeta otorga a la carpeta origen los permisos de la carpeta destino además de los que ya tenía".
- Clase de afirmación: confirmado por transcripción + abierto (visualización del diff).
- Etiqueta: `requires-clarification`.

**Prioridad:** M1.
**Tamano:** M.
**Etiquetas:** [persistencia, permisos, move, unión, acumulativo, requires-clarification].

---

### HU-31.015 — Abrir diálogo modal Permisos de Carpeta desde selección

**Actor primario:** AO.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; P (edita ACL).
**Superficie UI:** toolbar-superior (icono llave, detailed view) + barra-acciones-inferior (botón `Permisos de Carpeta`, icon view) + dialogo-modal-permisos-carpeta.
**Gesto canónico:** clic en icono llave (detailed view) o en botón `Permisos de Carpeta` (icon view).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero abrir el diálogo modal `Permisos de Carpeta` desde la carpeta seleccionada con el icono llave o con el botón explícito, para revisar y editar quién tiene qué nivel de acceso.

**Contexto de negocio:**
La llave es el icono universal de "control de acceso". Ofrecerla en la toolbar superior (detailed view) y como botón explícito (icon view) cubre ambos modos. El diálogo modal que se abre es superpuesto al `Cargar Modelo`, manteniendo contexto visual del árbol.

**Criterios de aceptación:**
- **Dado** que tengo una carpeta seleccionada con permiso `O`, **cuando** hago clic en el icono llave (detailed view), **entonces** se abre el diálogo modal `Permisos de Carpeta` con título `Folder: <nombre>` y lateral `Organization: <Technion>`.
- **Dado** que estoy en icon view, **cuando** hago clic en el botón `Permisos de Carpeta` (barra inferior o ubicación equivalente — **pregunta abierta** sobre ubicación exacta), **entonces** el efecto es idéntico.
- **Dado** que se abre el diálogo modal, **cuando** miro su contenido, **entonces** veo la matriz O/W/R con filas `All <Org> Users`, `Groups:` y botones `Guardar` y `Cerrar`.
- **Dado** que no tengo permiso `O`, **cuando** miro la llave/botón, **entonces** está gris.
- **Dado** que el diálogo modal está abierto, **cuando** hago clic en `Cerrar`, **entonces** se descarta cualquier cambio no guardado y se cierra.

**Reglas y restricciones:**
- Requiere permiso `O` (o superior de admin global).
- El diálogo modal es superpuesto al `Cargar Modelo`; este permanece al fondo.
- La transcripción menciona `Current Folder Permissions button` desde Cargar — se asume equivalente al botón `Permisos de Carpeta`.

**Modelo de datos tocado:**
- `ui_state.permissions_modal.open` — boolean — transitorio.
- `ui_state.permissions_modal.folder_id` — `carpeta.id` — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.003.
- Bloquea a: HU-31.016, HU-31.017, HU-31.018, HU-31.020.

**Integraciones:**
- Diálogo modal superpuesto sobre `Cargar Modelo`.

**Notas de evidencia:**
- Fuente: §3.6 paso 2, §2 tabla superficies.
- Frames: frame_00015 (diálogo modal abierto).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, permisos, dialogo-modal, llave, folder-permissions].

---

### HU-31.016 — Ver matriz O/W/R con All Organization Users

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; V (render matriz).
**Superficie UI:** dialogo-modal-permisos-carpeta (fila principal).
**Gesto canónico:** ninguno (render declarativo).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero ver la matriz O/W/R con la fila principal `All <Org> Users` para otorgar permisos organizacionales de un solo golpe sin tener que listar cada grupo.

**Contexto de negocio:**
La fila `All Organization Users` actúa como broche ancla: permite fijar un baseline de acceso para toda la organización (típicamente `R`). Los grupos y usuarios individuales refinan a partir de ahí. Es la entrada de más amplio alcance en la matriz.

**Criterios de aceptación:**
- **Dado** que abrí el diálogo modal, **cuando** miro la matriz, **entonces** veo la fila `All <Org> Users ↓` como primera entrada (el sufijo `<Org>` se reemplaza por el nombre real del tenant, p.ej. `All Technion Users`).
- **Dado** que estoy en la fila principal, **cuando** veo las columnas, **entonces** son tres: `O`, `W`, `R` de izquierda a derecha.
- **Dado** que marco `R` en la fila principal, **cuando** guardo (HU-31.020), **entonces** todos los usuarios de la organización reciben al menos `R` sobre la carpeta.
- **Dado** que desmarco `R` en la fila principal, **cuando** guardo, **entonces** los usuarios pierden el acceso organizacional salvo que tengan permiso explícito por grupo o usuario.

**Reglas y restricciones:**
- Orden de columnas: `O W R` de izquierda a derecha.
- Tres checkboxes independientes visualmente (aunque semánticamente acumulativos: O implica W implica R).
- La fila principal representa el principal sintético `org:<id>`.

**Modelo de datos tocado:**
- `carpeta.acl` — entrada con principal `org:<id>` — persistente.

**Dependencias:**
- Bloqueada por: HU-31.015.

**Integraciones:**
- Validador de combinaciones semánticas (p.ej. marcar O debería implicar W y R).

**Notas de evidencia:**
- Fuente: §3.6 paso 4, §9 (orden de columnas).
- Frames: frame_00015.
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, permisos, matriz, organization, all-users].

---

### HU-31.017 — Ver Groups como filas expandibles en matriz

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; V (render con expansión).
**Superficie UI:** dialogo-modal-permisos-carpeta (sección `Groups:`).
**Gesto canónico:** clic en flecha `↓`/`↑` para colapsar/expandir.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero ver los grupos de la organización como filas expandibles en la matriz, cada una con sus propios checkboxes O/W/R, para otorgar permisos a nivel de grupo sin tener que ir usuario por usuario.

**Contexto de negocio:**
La recomendación narrada es **dar permisos a grupos antes que a usuarios individuales** por manejabilidad: mover un usuario dentro/fuera de un grupo es un acto administrativo simple. Los grupos se presentan con flecha `↓` (colapsado) o `↑` (expandido) — **no son orden sino estado de expansión**, convención específica de este diálogo modal.

**Criterios de aceptación:**
- **Dado** que abrí el diálogo modal, **cuando** miro bajo `All <Org> Users`, **entonces** veo una sección `Groups:` con cada grupo de la organización listado como fila.
- **Dado** que un grupo está colapsado, **cuando** miro su flecha, **entonces** es `↓`.
- **Dado** que un grupo está expandido, **cuando** miro su flecha, **entonces** es `↑`.
- **Dado** que cada grupo tiene tres checkboxes O/W/R propios, **cuando** marco `W` en un grupo, **entonces** ese grupo (y por herencia, sus miembros) recibe `W`.
- **Dado** que un grupo tiene subgrupos, **cuando** lo expando, **entonces** los subgrupos aparecen anidados (con su propia expansión).

**Reglas y restricciones:**
- Flechas `↓`/`↑` = estado de expansión (NO orden).
- Los permisos otorgados a un grupo aplican al subárbol salvo que se refine por subgrupo o usuario.
- Recomendación de uso: preferir grupos.

**Modelo de datos tocado:**
- `carpeta.acl` — entradas con principal `group:<id>` — persistente.
- `group.subgroups` — lista — persistente.
- `ui_state.permissions_modal.expanded_groups` — set de `group.id` — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.015, HU-31.016.
- Bloquea a: HU-31.018.

**Integraciones:**
- Modelo de grupos organizacionales (EPICA-80).

**Notas de evidencia:**
- Fuente: §3.6 paso 4, §9 (convención flechas).
- Frames: frame_00015 (grupos `SafetyTechnologyGroup` colapsado, `ResearchGroup` expandido).
- Clase de afirmación: observado + confirmado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, permisos, grupos, expansión, anidación].

---

### HU-31.018 — Expandir grupo para ver usuarios individuales

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; V (render con detalle).
**Superficie UI:** dialogo-modal-permisos-carpeta (sección `Users:` dentro de grupo expandido).
**Gesto canónico:** clic en flecha `↓` del grupo para expandir.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero expandir un grupo para ver sus usuarios individuales con email y checkboxes O/W/R propios, para refinar permisos a nivel de usuario cuando la política de grupo no basta.

**Contexto de negocio:**
Aunque la recomendación es gestionar por grupo, hay casos donde un usuario específico necesita un nivel distinto: un externo invitado, un becario que requiere escritura temporal, etc. Expandir el grupo muestra `Users:` con cada miembro (email en paréntesis) y sus propios checkboxes, permitiendo el refinamiento sin sacar al usuario del grupo.

**Criterios de aceptación:**
- **Dado** que un grupo está colapsado, **cuando** hago clic en su flecha `↓`, **entonces** se expande y aparece `Users:` listando cada miembro.
- **Dado** que un usuario aparece expandido, **cuando** miro la fila, **entonces** veo `<nombre> (<email>)` con tres checkboxes O/W/R.
- **Dado** que marco `W` en un usuario específico, **cuando** guardo, **entonces** ese usuario recibe `W` independientemente del nivel del grupo padre.
- **Dado** que marco `R` en un usuario cuando el grupo tiene `W`, **cuando** guardo, **entonces** el comportamiento exacto es: ¿refinamiento restrictivo? ¿unión? — regla: **unión, el mayor nivel gana** (consistente con HU-31.014).
- **Dado** que el grupo expandido tiene subgrupos, **cuando** lo expando, **entonces** aparecen tanto `Users:` directos como los subgrupos anidados.

**Reglas y restricciones:**
- Permisos son aditivos: el usuario final tiene el máximo de (grupo, subgrupo, usuario individual).
- Email mostrado entre paréntesis para desambiguación.
- La anidación de grupos puede ser de profundidad arbitraria (aunque típicamente ≤3).

**Modelo de datos tocado:**
- `carpeta.acl` — entradas con principal `user:<id>` — persistente.
- `group.members` — lista — persistente.

**Dependencias:**
- Bloqueada por: HU-31.017.

**Integraciones:**
- Modelo de usuarios organizacionales.

**Notas de evidencia:**
- Fuente: §3.6 paso 4, §9.
- Frames: frame_00015 (ResearchGroup expandido con usuarios y emails).
- Clase de afirmación: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [persistencia, permisos, usuarios, nested, email].

---

### HU-31.019 — Activar Automatic Model Read Permission en carpeta

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario (política propagación); C (config de carpeta).
**Superficie UI:** dialogo-modal-permisos-carpeta (checkbox `Automatic Model Read Permission`).
**Gesto canónico:** marcar checkbox + Guardar.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero activar el checkbox `Automatic Model Read Permission` en una carpeta para que los modelos contenidos hereden automáticamente el permiso `R` de la carpeta sin tener que configurarlos individualmente.

**Contexto de negocio:**
Por defecto, los permisos de carpeta **no** propagan a los modelos que contiene (§7.2 doc fuente). Esto es deliberado: cada modelo puede tener permisos independientes. Pero para workflows donde "si puedes ver la carpeta, puedes leer los modelos", el checkbox `Automatic Model Read Permission` automatiza la herencia de `R`. Solo aplica a `R`, no a `W` ni `O` (que requieren decisión explícita por modelo).

**Criterios de aceptación:**
- **Dado** que abrí `Permisos de Carpeta` con permiso `O` sobre la carpeta, **cuando** miro la UI, **entonces** veo el checkbox `Automatic Model Read Permission`.
- **Dado** que marco el checkbox y guardo, **cuando** un usuario que tiene `R` sobre la carpeta intenta abrir un modelo, **entonces** accede (heredó `R` implícito).
- **Dado** que el checkbox está desmarcado (default), **cuando** un usuario con `R` de carpeta intenta abrir un modelo sin permiso explícito, **entonces** el modelo aparece con candado (HU-31.025).
- **Dado** que un modelo tiene permiso explícito que contradice la herencia automática, **cuando** aplica la regla, **entonces** gana el **mayor nivel** (unión, consistente con HU-31.014).
- **Dado** que muevo un modelo entre carpetas, **cuando** se aplica el destino con `Automatic Model Read Permission = ON`, **entonces** se re-evalúa la herencia.

**Reglas y restricciones:**
- El checkbox solo controla herencia de `R`; `W` y `O` NUNCA se heredan automáticamente.
- Default: OFF.
- La herencia es dinámica: si la ACL de la carpeta cambia, la herencia efectiva cambia.

**Modelo de datos tocado:**
- `carpeta.automatic_model_read_permission` — boolean (default false) — persistente.

**Dependencias:**
- Bloqueada por: HU-31.015.
- Relaciona: EPICA-40 (permisos de modelo).

**Integraciones:**
- Validador de acceso a modelo (al abrir un tile de modelo).
- Render candado (HU-31.025).

**Notas de evidencia:**
- Fuente: §7.2 (narración: permisos de carpeta no propagan por defecto), inferido de la existencia del checkbox para casos donde sí se quiere propagar.
- Clase de afirmación: inferido (el checkbox es pedido por el usuario en la tarea como "Automatic Model Read Permission"; la semántica de no-propagación default es explícita en §7.2).
- Etiqueta: `requires-clarification` (ubicación exacta y comportamiento en casos edge).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, permisos, auto-read, propagación, requires-clarification].

---

### HU-31.020 — Guardar cambios de permisos con toast de éxito

**Actor primario:** AO.
**Tipo:** opcloud-ui.
**Nivel categórico:** P primario; U (toast feedback).
**Superficie UI:** dialogo-modal-permisos-carpeta (botón `Guardar`) + toast.
**Gesto canónico:** clic en `Guardar`.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin, quiero guardar los cambios de permisos con el botón `Guardar` y recibir un toast `permission was updated successfully` para confirmar que la persistencia fue efectiva.

**Contexto de negocio:**
Los cambios de permisos son sensibles; feedback inmediato (toast) evita que el admin quede en duda sobre si el cambio se aplicó o no. `Cerrar` sin `Guardar` descarta los cambios — convención estándar de diálogo modal con botones explícitos.

**Criterios de aceptación:**
- **Dado** que hice cambios en la matriz, **cuando** hago clic en `Guardar`, **entonces** se persiste la ACL y aparece toast `permission was updated successfully`.
- **Dado** que hice cambios y cierro con `Cerrar` o `X`, **cuando** se cierra, **entonces** los cambios se descartan (pregunta implícita: ¿hay warning de cambios sin guardar? — **pregunta abierta**).
- **Dado** que `Guardar` falló por error de red o permiso, **cuando** se detecta, **entonces** aparece toast de error y los cambios permanecen en el diálogo modal para reintentar.
- **Dado** que guardé exitosamente, **cuando** cierro el diálogo modal y vuelvo a abrirlo, **entonces** los cambios persistidos se reflejan.

**Reglas y restricciones:**
- `Guardar` persiste; `Cerrar` descarta.
- Toast de éxito es observable y confirma la operación.
- Warning de "cambios sin guardar" al cerrar: `requires-clarification`.

**Modelo de datos tocado:**
- `carpeta.acl` — persistente.

**Dependencias:**
- Bloqueada por: HU-31.016, HU-31.017, HU-31.018.

**Integraciones:**
- Sistema de toasts global.

**Notas de evidencia:**
- Fuente: §3.6 paso 7.
- Clase de afirmación: confirmado por transcripción (mensaje exacto `permission was updated successfully`).

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [persistencia, permisos, guardar, toast, feedback].

---

### HU-31.021 — Ver permisos vigentes por hover tooltip

**Actor primario:** AO.
**Actores secundarios:** ME, RV.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; V (tooltip render).
**Superficie UI:** detailed view (carpeta) + tooltip.
**Gesto canónico:** hover sobre fila o tile de carpeta.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como admin o usuario avanzado, quiero ver los permisos vigentes sobre una carpeta simplemente haciendo hover, sin abrir el diálogo modal `Permisos de Carpeta`, para inspeccionar rápidamente qué acceso tengo.

**Contexto de negocio:**
Abrir el diálogo modal para cada inspección es costoso cognitivamente; el tooltip en hover es un atajo para "ver sin editar". Muestra la combinación vigente con formato `<nombre> [R/W/O]`. Nota: el orden textual del tooltip (`[R/W/O]` creciente en alcance) **no coincide** con el orden del diálogo modal (`O W R` decreciente) — inconsistencia observada (§9).

**Criterios de aceptación:**
- **Dado** que estoy en detailed view, **cuando** hago hover sobre una fila de carpeta, **entonces** aparece tooltip `<nombre> [R/W/O]` mostrando mi combinación vigente.
- **Dado** que tengo solo `R`, **cuando** hago hover, **entonces** el tooltip muestra `<nombre> [R]`.
- **Dado** que tengo `R` y `W`, **cuando** hago hover, **entonces** el tooltip muestra `<nombre> [R/W]`.
- **Dado** que el tooltip aparece, **cuando** muevo el cursor fuera, **entonces** desaparece sin delay percibido.
- **Dado** que estoy en icon view (tiles), **cuando** hago hover sobre un tile, **entonces** el tooltip aparece con el mismo formato (asumido por simetría — **pregunta abierta** de si solo existe en detailed view).

**Reglas y restricciones:**
- Formato: `[R/W/O]` textual, orden creciente en alcance (inconsistencia con el diálogo modal, documentada).
- Disponibilidad en icon view: a confirmar.
- No hay delay observado explícito para aparición/desaparición.

**Modelo de datos tocado:**
- Ninguno (lectura derivada).

**Dependencias:**
- Bloqueada por: HU-31.022 (vista detailed).

**Integraciones:**
- Lente de permisos efectivos (cálculo unión de grupos + usuario + org).

**Notas de evidencia:**
- Fuente: §2 (tabla superficies), §3.7, §9 (inconsistencia de orden).
- Frames: frame_00015 (tooltip `Bug examples [R/W/O]` visible).
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [persistencia, permisos, tooltip, hover, inspección].

---

### HU-31.022 — Alternar entre icon view y detailed view

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** U primario; V (render alternativo).
**Superficie UI:** dialogo-modal-cargar-modelo + toggle-vista.
**Gesto canónico:** clic en toggle (ubicación exacta a confirmar).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero alternar entre icon view (tiles) y detailed view (tabla con columnas) para elegir la representación que mejor se adapta a mi tarea (browsing visual vs análisis por metadatos).

**Contexto de negocio:**
Icon view es más escaneable visualmente (iconos, colores, candados); detailed view es mejor para ordenar por fecha/autor y ver metadatos. El producto ofrece ambas y el usuario elige. La ubicación exacta del toggle no tiene frame directo (§5.2 doc fuente) pero la transcripción lo nombra como cambio de vista.

**Criterios de aceptación:**
- **Dado** que estoy en icon view, **cuando** activo el toggle a detailed view, **entonces** el cuerpo del diálogo modal se reorganiza como tabla con columnas `Folders / Model / Description / Date / Author`.
- **Dado** que estoy en detailed view, **cuando** activo el toggle a icon view, **entonces** el cuerpo vuelve a tiles.
- **Dado** que cambio de vista, **cuando** se aplica, **entonces** la selección actual se preserva.
- **Dado** que cambio de vista, **cuando** navego después, **entonces** la vista elegida persiste para esa sesión (y posiblemente entre sesiones — **pregunta abierta**).
- **Dado** que estoy en detailed view, **cuando** miro la toolbar superior, **entonces** aparecen íconos de `Home`, `Arriba`, `Nueva Carpeta`, `Renombrar`, `Permisos de Carpeta` (llave) que NO son visibles en icon view.

**Reglas y restricciones:**
- Ambas vistas comparten la misma barra inferior de acciones.
- En detailed view aparece toolbar superior con íconos adicionales (consistente con §2 tabla superficies).
- Persistencia del toggle entre sesiones: a confirmar.

**Modelo de datos tocado:**
- `ui_state.load_modal.view_mode` — `"icon" | "detailed"` — transitorio o preferencia de usuario.

**Dependencias:**
- Bloqueada por: HU-31.001.

**Integraciones:**
- Renderer de tiles vs tabla.

**Notas de evidencia:**
- Fuente: §2, §5.2.
- Frames: frame_00005 (icon view), frame_00010 (detailed view).
- Clase de afirmación: observado (existencia de ambas vistas) + abierto (ubicación exacta del toggle, persistencia entre sesiones).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [persistencia, ui, vista, toggle, icon-view, detailed-view, requires-clarification].

---

### HU-31.023 — Ordenar columnas en detailed view con flechas

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** L primario; U (clic en header).
**Superficie UI:** detailed view (headers de tabla).
**Gesto canónico:** clic en header de columna.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero ordenar las columnas de la tabla en detailed view (`Folders`, `Model`, `Description`, `Date`, `Author`) con clic en el header, para ordenar los modelos por fecha, autor u otro criterio.

**Contexto de negocio:**
Las flechas `↑↓` en los headers de la tabla indican dirección de orden activo. Es el patrón estándar de tablas. Particularmente útil cuando hay muchos modelos en una carpeta y el usuario busca el más reciente o por autor específico.

**Criterios de aceptación:**
- **Dado** que estoy en detailed view, **cuando** miro los headers, **entonces** veo `Folders ↑`, `Model`, `Description`, `Date ↑`, `Author ↓` con flechas que indican columna activa de orden y dirección.
- **Dado** que hago clic en un header sin flecha, **cuando** se ejecuta, **entonces** se convierte en el activo con dirección ascendente (`↑`).
- **Dado** que hago clic en el header activo, **cuando** se ejecuta, **entonces** alterna la dirección (`↑` ↔ `↓`).
- **Dado** que ordeno por `Date ↓`, **cuando** miro la tabla, **entonces** los modelos más recientes aparecen arriba.
- **Dado** que ordeno por `Author`, **cuando** miro la tabla, **entonces** los modelos se ordenan alfabéticamente por autor.

**Reglas y restricciones:**
- Una sola columna activa a la vez.
- Las flechas `↑↓` en headers son dirección de orden (NO expansión — no confundir con el uso en grupos §9).
- Default de orden al entrar a una carpeta: a definir (probablemente `Date ↓`, más reciente primero).

**Modelo de datos tocado:**
- `ui_state.load_modal.sort` — `{column, direction}` — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.022.

**Integraciones:**
- Lente ordenada del contenido de carpeta.

**Notas de evidencia:**
- Fuente: §2 (tabla superficies), §5.2, §9.
- Frames: frame_00010.
- Clase de afirmación: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, sort, tabla, detailed-view].

---

### HU-31.024 — Ver carpeta Shared con icono azul diferenciado

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** V.
**Superficie UI:** dialogo-modal-cargar-modelo (icon view).
**Gesto canónico:** ninguno (render declarativo).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero ver la carpeta `Shared` con un icono azul diferenciado del resto (que es gris) para identificar de inmediato el punto de entrada colaborativo del espacio de trabajo.

**Contexto de negocio:**
`Shared` tiene **tratamiento especial**: es el único punto de entrada con `W` para no-admins en el root. Diferenciarla visualmente (azul vs gris) permite que cualquier usuario la identifique rápido sin leer el nombre. Además aparece siempre primera en el listado de `Home`.

**Criterios de aceptación:**
- **Dado** que estoy en `Home` en icon view, **cuando** miro las carpetas, **entonces** `Shared` tiene icono azul y el resto tiene icono gris.
- **Dado** que estoy en `Home`, **cuando** miro el orden, **entonces** `Shared` aparece primera.
- **Dado** que una carpeta no es `Shared` pero es "compartida" por permisos ACL, **cuando** la miro, **entonces** NO tiene icono azul (el azul es exclusivo de la raíz `Shared`).
- **Dado** que entro dentro de `Shared`, **cuando** miro el contenido, **entonces** las subcarpetas no heredan el color azul.

**Reglas y restricciones:**
- Icono azul exclusivo de la carpeta `Shared` en el root.
- Subcarpetas dentro de `Shared` tienen icono estándar (gris).
- Convención observada §9 (`Shared` tiene tratamiento especial).

**Modelo de datos tocado:**
- `carpeta.is_shared_root` — boolean derivado (flag sintético: `parent IS NULL AND name = 'Shared'`) — no necesariamente persistente.

**Dependencias:**
- Bloqueada por: HU-31.002.

**Integraciones:**
- Renderer de iconos.

**Notas de evidencia:**
- Fuente: §9 (convenciones no normativas).
- Frames: frame_00005, frame_00030, frame_00035.
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, shared, iconografía, render].

---

### HU-31.025 — Ver modelo con candado cuando falta permiso

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categórico:** V primario; L (lente permisos).
**Superficie UI:** dialogo-modal-cargar-modelo (tiles de modelo + detailed view).
**Gesto canónico:** ninguno (render declarativo).
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador, quiero ver los modelos sobre los que no tengo permiso de lectura con icono candado en lugar de ocultarlos, para entender qué existe en el espacio de trabajo aunque no pueda abrirlo.

**Contexto de negocio:**
La convención observada privilegia visibilidad sobre ocultamiento (§9). El candado comunica claramente "existe pero no accesible". Esto ayuda al usuario a entender la estructura del espacio de trabajo y saber cuándo pedir permiso; ocultar produce la sensación de espacio de trabajo más vacío de lo real.

**Criterios de aceptación:**
- **Dado** que hay un modelo en la carpeta actual sobre el que no tengo `R`, **cuando** miro el tile, **entonces** tiene icono candado sobre el documento.
- **Dado** que un modelo tiene candado, **cuando** intento abrirlo (doble clic o `Abrir`), **entonces** la acción está bloqueada o muestra mensaje de permiso insuficiente.
- **Dado** que tengo `R` sobre un modelo, **cuando** miro el tile, **entonces** NO tiene candado.
- **Dado** que un modelo aparece en `Modelos Recientes` pero perdí el acceso, **cuando** miro el tile, **entonces** tiene candado.
- **Dado** que estoy en detailed view, **cuando** miro la columna `Model`, **entonces** la fila muestra el candado como indicador (ubicación exacta por confirmar, típicamente junto al nombre).

**Reglas y restricciones:**
- El candado es icono, no overlay sobre todo el tile.
- Los modelos con candado aparecen listados (no se ocultan), cumpliendo principio de visibilidad.
- `Mostrar Archivados = OFF` oculta modelos archivados; el candado es distinto de archivado.
- Aplicable tanto en tiles como en filas.

**Modelo de datos tocado:**
- Lectura derivada: `model.acl` comparada con usuario actual → estado `locked`.

**Dependencias:**
- Bloqueada por: HU-31.002 (Modelos Recientes) o navegación a una carpeta con contenido.

**Integraciones:**
- Lente de permisos efectivos.
- Renderer de iconos.

**Notas de evidencia:**
- Fuente: §2 (tabla superficies), §4.4, §9.
- Frames: frame_00005, frame_00030, frame_00035.
- Clase de afirmación: observado.

**Prioridad:** M0.
**Tamano:** XS.
**Etiquetas:** [persistencia, ui, candado, permisos, iconografía, lente].

---

### HU-31.026 — Ver menú contextual por clic derecho sobre carpeta

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categórico:** U.
**Superficie UI:** dialogo-modal-cargar-modelo + context-menu.
**Gesto canónico:** clic derecho sobre tile o fila de carpeta.
**Fuente normativa primaria:** — (SSOT no regula UX de persistencia/carpetas).

**Historia:**
> Como modelador experto, quiero acceder a las acciones de carpeta (`Renombrar`, `Eliminar Carpeta`, `Cortar Carpeta`, `Permisos de Carpeta`, `Abrir`) con clic derecho en un menú contextual, para operar sin necesidad de ir a la barra inferior.

**Contexto de negocio:**
El clic derecho es un gesto avanzado pero universalmente esperado en explorers de archivos. Ofrecer un menú contextual con las mismas acciones de la barra inferior acelera el workflow del usuario experto que prefiere no desplazar el cursor a la parte inferior del diálogo modal. No tiene frame directo del comportamiento (doc fuente no lo menciona explícitamente) pero es una inferencia razonable dado el patrón del producto y la expectativa del usuario en contextos similares — marcada como `requires-clarification`.

**Criterios de aceptación:**
- **Dado** que hago clic derecho sobre una carpeta, **cuando** se ejecuta, **entonces** aparece menú contextual con acciones `Abrir`, `Renombrar`, `Cortar Carpeta`, `Eliminar Carpeta`, `Permisos de Carpeta` en ese orden.
- **Dado** que una acción no está disponible por permiso, **cuando** miro el menú, **entonces** aparece gris/deshabilitada consistente con la barra inferior.
- **Dado** que el menú está abierto, **cuando** hago clic fuera o `Esc`, **entonces** se cierra sin efecto.
- **Dado** que selecciono una acción del menú, **cuando** se ejecuta, **entonces** el efecto es idéntico al del botón correspondiente en la barra inferior.
- **Dado** que estoy en icon view vs detailed view, **cuando** hago clic derecho, **entonces** el menú es idéntico en ambas vistas.

**Reglas y restricciones:**
- Paridad total con la barra inferior (mismas acciones, mismos permisos).
- Menú cierra por click-outside o `Esc`.
- Comportamiento en clic derecho sobre modelo (no carpeta): fuera de alcance de esta HU — delegar a EPICA-35 o equivalente.
- **Existencia no confirmada** en el doc fuente; se marca como `requires-clarification`.

**Modelo de datos tocado:**
- `ui_state.context_menu.open` — boolean — transitorio.
- `ui_state.context_menu.target` — `carpeta.id` — transitorio.

**Dependencias:**
- Bloqueada por: HU-31.003.

**Integraciones:**
- Mismas acciones que barra inferior (HU-31.009, HU-31.010, HU-31.011, HU-31.015, HU-31.004).

**Notas de evidencia:**
- Fuente: no mencionado explícitamente en §2-§11 del doc fuente.
- Clase de afirmación: hipótesis (patrón esperado en explorers, no observado directamente).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [persistencia, ui, context-menu, shortcut, clic-derecho, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q31.1** (§11.1): Dónde y cómo se archiva una carpeta (acción explícita), y si el archivado es reversible desde el propio diálogo modal con `Mostrar Archivados = ON`. Relaciona con HU-31.010, potencial HU-31.027 (deferred).
- **Q31.2** (§11.2): Comportamiento exacto de `Eliminar Carpeta` cuando la carpeta contiene modelos: ¿rechaza, cascada tras warning, o mueve a papelera? Afecta HU-31.010.
- **Q31.3** (§11.3): Si `Mostrar Versiones` se combina con `Incluir Todas las Subcarpetas` para producir búsquedas sobre historial recursivo. No cubierto por HU-31.XXX en esta épica (delegado a HU de EPICA-30 sobre toggles `Mostrar Versiones`).
- **Q31.4** (§11.4): Persistencia del corte pendiente al cerrar el diálogo modal sin pegar. Afecta HU-31.011.
- **Q31.5** (§11.5): Visualización del diff de permisos antes del paste/drop al mover. Afecta HU-31.014.
- **Q31.6** (§11.6): Atajo para limpiar el corte pendiente distinto de pegar o cancelar. Potencial HU futura.
- **Q31.7** (adicional al doc fuente): Clickabilidad de segmentos intermedios del breadcrumb. Afecta HU-31.006.
- **Q31.8** (adicional): Ubicación exacta del toggle icon view / detailed view y persistencia entre sesiones. Afecta HU-31.022.
- **Q31.9** (adicional): Existencia y contenido de menú contextual por clic derecho. Afecta HU-31.026.
- **Q31.10** (adicional): Ubicación y comportamiento exacto del checkbox `Automatic Model Read Permission` (dentro del diálogo modal `Permisos de Carpeta` vs otra superficie). Afecta HU-31.019.
- **Q31.11** (adicional): Warning de "cambios sin guardar" al cerrar `Permisos de Carpeta` con `Cerrar` habiendo editado. Afecta HU-31.020.
- **Q31.12** (adicional): Orden default de las carpetas en Home (alfabético, por última modificación, manual). Afecta HU-31.002.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/31-persistencia-folders.md`.
- Épicas relacionadas:
  - **EPICA-30** (persistencia-save-load): maquinaria compartida del diálogo modal, toggles `Mostrar Versiones`/`Mostrar Archivados`, tile `Modelos Recientes` abre modelo.
  - **EPICA-32** (persistencia-sub-models): sub-modelos como casos especiales de contenido de carpeta.
  - **EPICA-33** (persistencia-templates): plantillas como subconjunto de modelos.
  - **EPICA-34** (persistencia-new-model): creación de modelo nuevo necesita elegir carpeta destino.
  - **EPICA-35** (persistencia-move-search): move de modelos individuales reutiliza cut/paste, drag-drop, confirmación.
  - **EPICA-40** (colaboracion-permisos): permisos de modelo individual son complementarios a los de carpeta; regla `Automatic Model Read Permission` los vincula.
  - **EPICA-41** (colaboracion-chat): notificación de cambios en permisos podría integrar chat.
  - **EPICA-80** (config-user-org): modelo de organización, grupos, subgrupos y usuarios que alimenta la matriz del diálogo modal.
- Invariantes del repo: `src/persistencia/` (IndexedDB espacio de trabajo, event log), integración con futuro backend de carpetas + ACL.
- SSOT OPM: esta épica NO toca el kernel semántico OPM; es infraestructura de espacio de trabajo. No hay referencias `V-xx` aplicables.
- Constitución categórica: las carpetas son metadatos externos al kernel OPM (ajenos al funtor render, ajenos al kernel de things/links). Pueden modelarse como categoría separada con sus propios morfismos (move, rename) — pero sin presión múltiple no se incorporan al funtor principal.
