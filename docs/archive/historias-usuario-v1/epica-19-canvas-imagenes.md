---
epica: "EPICA-19"
titulo: "Canvas — imagenes incrustadas en cosas (URL, pool, alternar imagen/texto, exportacion)"
doc_fuente: "opcloud-reverse/19-canvas-imagenes.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 16
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre el enriquecimiento visual de cosas OPM mediante la incrustacion de bitmaps
dentro de su contenedor. Las imagenes operan exclusivamente en las capas V/U/P/C sin tocar
el nucleo semantico (K) ni la lente OPL (L): toda la epica es `opcloud-ui` excepto la
invariante OPL que se declara como guarda `opm-semantica`. Los ejes funcionales son:

1. **Origen del bitmap:** URL publica o pool organizacional de tres ambitos (Private / Organizational / Global).
2. **Render dual por cosa:** alternador `Imagen` / `Texto` / `Imagen+Texto` por instancia visual, con defecto `Imagen+Texto`.
3. **Anulacion a nivel OPD:** un alternador de diagrama fuerza el modo de render a todas las cosas del OPD actual.
4. **Coexistencia con otras features:** imagenes se suprimen automaticamente en cosas con in-zoom, unfolded o con estados visibles; se preservan en SVG pero no se incrustan en PDF.
5. **Persistencia:** modelo de imagen por cosa (`cosa.imagen`) y pool por organizacion; ambos acompanados de tags, permisos por ambito y validaciones de extension de URL.

Las HU se numeran por aparicion en el doc fuente, agrupando flows (§3), restricciones (§4),
controles (§5), datos (§6) e integraciones (§7) en historias atomicas. Cuando el doc fuente
lista una pregunta abierta (§11), la HU correspondiente se marca `requires-clarification`.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-19.001 | Abrir menu de imagen desde barra secundaria con cosa seleccionada | MN | S | S | opcloud-ui | — |
| HU-19.002 | Incrustar imagen en objeto por URL publica con validacion de extension | MN | S | M | opcloud-ui | — |
| HU-19.003 | Previsualizar URL en ventana emergente antes de confirmar insercion | MN | S | S | opcloud-ui | — |
| HU-19.004 | Insertar imagen desde pool organizacional con selector de ambito | AD | S | M | opcloud-ui | — |
| HU-19.005 | Guardar imagen en pool con tags obligatorios y ambito segun permisos | AD | S | M | opcloud-ui | — |
| HU-19.006 | Filtrar pool por tag desde caja de busqueda | AD | S | S | opcloud-ui | — |
| HU-19.007 | Alternar modo render Imagen/Texto/Imagen+Texto con clic izquierdo en insignia | MN | S | S | opcloud-ui | — |
| HU-19.008 | Reabrir ventana de edicion con clic derecho sobre insignia de camara | ME | S | S | opcloud-ui | — |
| HU-19.009 | Reemplazar imagen existente desde ventana emergente en modo edicion | ME | S | S | opcloud-ui | — |
| HU-19.010 | Eliminar imagen asociada con boton Remover de la ventana emergente | ME | S | XS | opcloud-ui | — |
| HU-19.011 | Forzar modo Imagen/Texto/Imagen+Texto a todo el OPD desde Opciones de Visualizacion OPD | ME | S | S | opcloud-ui | — |
| HU-19.012 | Suprimir render interior de imagen en cosa con in-zoom o unfolded | MN | S | S | opcloud-ui | — |
| HU-19.013 | Resolver exclusion mutua entre imagen y estados visibles | MN | S | S | opcloud-ui | — |
| HU-19.014 | Preservar imagenes en exportacion SVG; excluirlas en PDF/JPEG | RV | C | S | opcloud-ui | — |
| HU-19.015 | Mantener OPL invariante ante estado de imagen | MN | M0 | XS | opm-semantica | [SSOT §Representacion bimodal] [OPL-ES] |
| HU-19.016 | Cachear bitmap remoto y degradar a Solo texto ante URL caida | ME | C | M | opcloud-ui | — |

Total: **16 historias de usuario** (1 opm-semantica, 15 opcloud-ui).

## Historias de usuario

### HU-19.001 — Abrir menu de imagen desde barra secundaria con cosa seleccionada

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** barra-secundaria (grupo de imagen) sobre seleccion.
**Gesto canonico:** clic en icono `Imagen` tras seleccionar una cosa.

**Historia:**
> Como modelador, quiero acceder al menu de imagen desde la barra secundaria al seleccionar una cosa para descubrir las tres vias de insercion (URL, pool, anulacion OPD) sin recordar atajos.

**Contexto de negocio:**
La feature de imagen es opcional y visual. Exponerla como grupo contextual cuando hay seleccion evita contaminar la UI de un modelador que no la usa. El icono de camara en la barra es la puerta canonica; el menu lista las tres entradas documentadas.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa seleccionada, **cuando** miro la barra secundaria, **entonces** aparece un grupo de iconos de imagen con al menos tres acciones: `Imagen por URL`, `Insertar desde Pool`, `Opciones de Visualizacion OPD`.
- **Dado** que no tengo ninguna cosa seleccionada, **cuando** miro la barra secundaria, **entonces** el grupo de imagen muestra solo `Opciones de Visualizacion OPD` habilitado y oculta las entradas dependientes de seleccion.
- **Dado** que hago clic en el icono de imagen, **cuando** se despliega, **entonces** veo las tres entradas y puedo activar cualquiera de ellas.
- **Dado** que la cosa seleccionada no es un objeto (ej. proceso), **cuando** miro el menu, **entonces** las entradas dependientes de imagen aparecen (la habilitacion formal queda como pregunta abierta Q19.1).

**Reglas y restricciones:**
- La barra alterna grupos dinamicamente segun haya seleccion (§9 fuente).
- El icono es consistente con la insignia de camara que aparece sobre la cosa una vez incrustada la imagen (§2 fuente).
- Si solo hay procesos seleccionados, marcar la HU con `requires-clarification` hasta resolver Q19.1.

**Modelo de datos tocado:**
- Ninguno; solo estado de UI contextual.

**Dependencias:**
- Bloqueada por: HU-10.002 (existir un objeto).
- Bloquea a: HU-19.002, HU-19.004, HU-19.011.

**Integraciones:**
- Selector de cosas; barra secundaria.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §2 tabla UI, §9 convenciones.
- Frames: frame_00045, frame_00050.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, barra-contextual, imagen].

---

### HU-19.002 — Incrustar imagen en objeto por URL publica con validacion de extension

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P (persistencia de `cosa.imagen.origen`) y U (ventana emergente) secundarios.
**Superficie UI:** ventana emergente `Imagen por URL`.
**Gesto canonico:** pegar URL + `Previsualizar` + `Insertar`.

**Historia:**
> Como modelador, quiero pegar una URL de imagen publica en la ventana emergente `Imagen por URL` para enriquecer visualmente una cosa sin depender de un backend.

**Contexto de negocio:**
La via URL es la mas liviana para poblar modelos de ejemplo o para usuarios sin permisos de pool organizacional. El modelo referencia el bitmap por URL externa, sin duplicar binarios. La validacion de extension reduce intentos fallidos antes de la Previsualizacion.

**Criterios de aceptacion:**
- **Dado** que abri la ventana emergente `Imagen por URL`, **cuando** pego una URL que termina en `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg` o `.webp` y pulso `Previsualizar`, **entonces** la imagen se descarga y se muestra inline en el modal.
- **Dado** que la URL no termina en una extension reconocida, **cuando** pulso `Previsualizar`, **entonces** el sistema muestra un aviso de error y no intenta cargar el bitmap.
- **Dado** que la Previsualizacion se cargo correctamente, **cuando** pulso `Insertar`, **entonces** el bitmap queda incrustado en el contenedor de la cosa seleccionada y se muestra una insignia de camara en la esquina superior-izquierda.
- **Dado** que la URL es valida pero el servidor remoto responde 4xx/5xx, **cuando** pulso `Previsualizar`, **entonces** la ventana emergente muestra error especifico de red y deja `Insertar` deshabilitado.
- **Dado** que cerre la ventana emergente con `Cancelar` sin pulsar `Insertar`, **cuando** consulto la cosa, **entonces** NO tiene imagen asociada.

**Reglas y restricciones:**
- Extensiones aceptadas: `.jpg`, `.jpeg`, `.png`, `.gif`, `.svg`, `.webp` (hipotesis a validar contra §4.1; fuente solo lista `.jpg/.jpeg/.png` expresamente).
- Se admite URL `https://` — `http://` queda a decision del operador (pregunta abierta Q19.2).
- El OPL no cambia al insertar (ver HU-19.015).

**Modelo de datos tocado:**
- `cosa.imagen.origen` — string URL — persistente.
- `cosa.imagen.modo` — `"imagen_y_texto" | "imagen" | "texto"` — persistente; defecto `imagen_y_texto` al insertar.
- `cosa.imagen.ref_pool` — `null` cuando el origen es URL libre — persistente.

**Dependencias:**
- Bloqueada por: HU-19.001.
- Bloquea a: HU-19.003, HU-19.007, HU-19.008, HU-19.009.

**Integraciones:**
- Fetch remoto (CORS-dependiente).
- Renderizador JointJS: pinta el bitmap dentro del bounding box del rectangulo.
- Navegador OPD: miniatura refleja la imagen.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.1, §4.1, §5.1.
- Frames: frame_00008, frame_00015, frame_00020.
- Transcripcion: "pega URL → Preview → Insert"; "si no termina en extension de imagen, muestra error".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, ui, imagen, url, validacion, persistencia].

---

### HU-19.003 — Previsualizar URL en ventana emergente antes de confirmar insercion

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (previsualizacion) secundaria.
**Superficie UI:** ventana emergente `Imagen por URL` — area de previsualizacion.
**Gesto canonico:** clic en `Previsualizar`.

**Historia:**
> Como modelador, quiero previsualizar la imagen en la ventana emergente antes de insertarla para verificar que la URL apunta al bitmap correcto sin ensuciar el canvas.

**Contexto de negocio:**
La Previsualizacion es el contrato de confianza: si el modelador no puede ver la imagen antes de insertarla, el riesgo de incrustar una URL incorrecta fuerza un ciclo edicion/deshacer. El boton `Insertar` debe estar deshabilitado hasta que la Previsualizacion cargue.

**Criterios de aceptacion:**
- **Dado** que la ventana emergente esta abierta con campo URL vacio, **cuando** miro los botones, **entonces** `Previsualizar` esta deshabilitado hasta escribir al menos una URL candidata.
- **Dado** que escribi una URL, **cuando** pulso `Previsualizar`, **entonces** el area de previsualizacion muestra el bitmap descargado.
- **Dado** que la Previsualizacion aun no ha cargado o fallo, **cuando** miro `Insertar`, **entonces** esta deshabilitado.
- **Dado** que la Previsualizacion cargo y luego cambio la URL, **cuando** vuelvo a pulsar `Previsualizar`, **entonces** la previsualizacion se refresca con el nuevo bitmap y `Insertar` se vuelve a habilitar.

**Reglas y restricciones:**
- La Previsualizacion es transitoria — no persiste hasta confirmar `Insertar`.
- La ventana emergente no oscurece el canvas completo (§5.1 fuente).

**Modelo de datos tocado:**
- Ninguno persistente; el bitmap vive solo en memoria de la ventana emergente.

**Dependencias:**
- Bloqueada por: HU-19.002.

**Integraciones:**
- Fetch remoto; manejo de errores CORS.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.1 (pasos 3–6), §5.1.
- Frames: frame_00008 (Previsualizar deshabilitado), frame_00020 (Previsualizar cargado).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, imagen, previsualizacion, ventana-emergente].

---

### HU-19.004 — Insertar imagen desde pool organizacional con selector de ambito

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** MN, AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (lee pool), V (inserta) secundarios.
**Superficie UI:** modal `Gestion de Pool de Imagenes` con pestañas `Privado / Organizacional / Global`.
**Gesto canonico:** clic en `Insertar desde Pool` + seleccion de pestaña + seleccion de miniatura + `Insertar`.

**Historia:**
> Como autor de dominio, quiero elegir una imagen de un pool compartido con ambito Privado/Organizacional/Global para reusar bitmaps aprobados sin pegar URLs manuales.

**Contexto de negocio:**
El pool es la biblioteca de imagenes de la organizacion. Separar ambitos (Privado → propio del usuario; Organizacional → compartido por el tenant; Global → curado por OPCloud) evita el anti-patron de URL fija por cada modelo. Es la via recomendada para produccion.

**Criterios de aceptacion:**
- **Dado** que la ventana emergente `Imagen por URL` esta abierta, **cuando** pulso `Insertar desde Pool`, **entonces** se abre el modal `Gestion de Pool de Imagenes`.
- **Dado** que el modal abrio, **cuando** miro las pestañas, **entonces** veo tres pestañas `Privado`, `Organizacional`, `Global` y puedo alternar entre ellas.
- **Dado** que navego a `Global`, **cuando** miro la grilla, **entonces** veo miniaturas del catalogo curado (iconos AWS, laptop, avion, auto, rueda, etc.).
- **Dado** que selecciono una miniatura y pulso `Insertar`, **cuando** el modal cierra, **entonces** la imagen se incrusta en la cosa seleccionada con modo `imagen_y_texto`.
- **Dado** que cancelo con `Cancelar`, **cuando** el modal cierra, **entonces** no se modifica la cosa.

**Reglas y restricciones:**
- Las pestañas disponibles dependen del rol del usuario (modelador regular ve las tres pero solo puede escribir en Privado — ver HU-19.005).
- La imagen insertada desde pool persiste con `cosa.imagen.ref_pool = <id>` ademas de `cosa.imagen.origen = <url resuelta>`.
- Pool Global esta respaldado por catalogo externo (repositorio Amazon — §7.6 fuente).

**Modelo de datos tocado:**
- `cosa.imagen.origen` — string URL — persistente.
- `cosa.imagen.ref_pool` — `string | null` — persistente; no-null cuando el origen es pool.
- `cosa.imagen.modo` — `"imagen_y_texto"` — persistente (defecto).

**Dependencias:**
- Bloqueada por: HU-19.001.
- Relaciona: EPICA-82 (ontologia organizacional) si el pool se administra alli.

**Integraciones:**
- Backend de OPCloud (en nuestro repo: servicio de pool a definir).
- Cache local del bitmap (HU-19.016).

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.3, §5.2.
- Frames: frame_00030, frame_00038.
- Transcripcion: "Private / Organizational / Global"; "Global trae un catalogo curado".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, ui, imagen, pool, biblioteca-organizacional].

---

### HU-19.005 — Guardar imagen en pool con tags obligatorios y ambito segun permisos

**Actor primario:** AD.
**Actores secundarios:** AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; U (modal de guardado), C (permisos) secundarios.
**Superficie UI:** ventana emergente `Imagen por URL` (boton `Guardar en Pool`) + formulario inline de tags y ambito.
**Gesto canonico:** clic en `Guardar en Pool` + ingresar tags + seleccionar ambito + confirmar `Guardar en Pool`.

**Historia:**
> Como autor de dominio, quiero guardar una imagen al pool con al menos un tag y un ambito valido para reutilizarla en futuros modelos y compartirla segun mi rol.

**Contexto de negocio:**
Agregar una imagen a la biblioteca es distinto de incrustarla en una cosa: el pool es un inventario reusable. Exigir tags garantiza que la busqueda posterior (HU-19.006) funcione. Restringir ambito por rol protege el catalogo organizacional de contaminacion.

**Criterios de aceptacion:**
- **Dado** que tengo una imagen previsualizada o ya insertada en la ventana emergente, **cuando** pulso `Guardar en Pool`, **entonces** se abre un formulario que exige al menos un tag y un ambito.
- **Dado** que el formulario esta abierto y soy un modelador regular, **cuando** miro el selector de ambito, **entonces** solo `Privado` esta habilitado.
- **Dado** que soy admin de organizacion, **cuando** miro el selector, **entonces** puedo elegir `Privado` u `Organizacional`.
- **Dado** que soy admin global (staff de OPCloud), **cuando** miro el selector, **entonces** tambien puedo elegir `Global` — pregunta abierta Q19.3 sobre si este rol aplica a este repo.
- **Dado** que intento guardar sin ingresar ningun tag, **cuando** pulso confirmar, **entonces** el formulario bloquea el guardado y muestra aviso.
- **Dado** que ingrese tags (ej. `car`, `white car`) y elegi ambito `Privado`, **cuando** confirmo, **entonces** aparece mensaje `guardado exitosamente en el pool` y la imagen queda listada en la pestaña correspondiente.

**Reglas y restricciones:**
- Tag minimo: 1 (§5.3 fuente).
- Tags son strings libres; separacion por coma o chips (hipotesis visual).
- Ambito `Global` requiere rol admin externo — queda `deferred` o `requires-clarification`.

**Modelo de datos tocado:**
- `pool_imagen.id` — UUID — persistente.
- `pool_imagen.ambito` — `"privado" | "organizacional" | "global"` — persistente.
- `pool_imagen.tags` — `string[]` con ≥1 elemento — persistente.
- `pool_imagen.url` — string — persistente.
- `pool_imagen.propietario` — string (user id) — persistente.

**Dependencias:**
- Bloqueada por: HU-19.002 (imagen en ventana emergente) o HU-19.004.
- Relaciona: EPICA-40 (permisos), EPICA-80 (config org/user).

**Integraciones:**
- Backend de pool.
- Sistema de permisos.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.2, §4.5, §5.3, §6.
- Transcripcion: "un modelador regular solo ve Private como destino".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, ui, imagen, pool, tags, permisos].

---

### HU-19.006 — Filtrar pool por tag desde caja de busqueda

**Actor primario:** AD.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L (lente filtrada del pool).
**Superficie UI:** modal `Gestion de Pool de Imagenes` — panel `Buscar por Tags`.
**Gesto canonico:** escribir tag en caja + Enter o clic de aplicar.

**Historia:**
> Como modelador, quiero buscar imagenes por tag en el pool para encontrar el bitmap que necesito sin desplazarme por la grilla completa.

**Contexto de negocio:**
El pool crece con el uso; sin busqueda por tag el flujo se degrada rapido. El panel `Buscar por Tags` filtra la grilla inline en la pestaña activa.

**Criterios de aceptacion:**
- **Dado** que el modal del pool esta abierto en la pestaña `Global`, **cuando** ingreso el tag `toolkit` en `Buscar por Tags` y confirmo, **entonces** la grilla filtra y muestra solo las miniaturas con ese tag.
- **Dado** que hay multiples tags ingresados, **cuando** confirmo, **entonces** la grilla muestra imagenes que cumplen la conjuncion de tags (AND) — pregunta abierta Q19.4 sobre AND vs OR.
- **Dado** que limpio la caja de busqueda, **cuando** el filtro se vacia, **entonces** la grilla vuelve a mostrar todas las miniaturas del ambito activo.
- **Dado** que cambio de pestaña (`Privado` → `Global`), **cuando** ocurre el cambio, **entonces** el filtro se resetea (o se mantiene — pregunta abierta Q19.5).

**Reglas y restricciones:**
- Busqueda es case-insensitive (hipotesis).
- No hay paginacion observada; hipotesis que el pool cabe en la grilla.

**Dependencias:**
- Bloqueada por: HU-19.004.

**Integraciones:**
- Backend de pool (query por tags).

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.3 paso 4, §5.2.
- Frames: frame_00030.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, imagen, pool, busqueda, tags].

---

### HU-19.007 — Alternar modo render Imagen/Texto/Imagen+Texto con clic izquierdo en insignia

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; U (insignia) y P (persiste modo) secundarios.
**Superficie UI:** insignia de camara sobre la cosa.
**Gesto canonico:** clic izquierdo sobre insignia.

**Historia:**
> Como modelador, quiero ciclar el modo de render de la cosa entre `Imagen+Texto`, `Solo texto` e `Solo imagen` con clics sobre la insignia de camara para elegir la representacion mas legible sin abrir dialogo.

**Contexto de negocio:**
Tres modos de render permiten usar el mismo bitmap en contextos distintos: `Imagen+Texto` como defecto explicativo, `Solo texto` para suprimir la imagen sin desasociarla, `Solo imagen` para diagramas compactos. El clic izquierdo es una afordancia descubrible por el tooltip (`Alternar Imagen/Texto, Clic Derecho para Editar`).

**Criterios de aceptacion:**
- **Dado** que una cosa tiene imagen y modo `imagen_y_texto`, **cuando** hago clic izquierdo sobre la insignia, **entonces** la cosa pasa a modo `texto` (solo rotulo) y la insignia permanece.
- **Dado** que la cosa esta en modo `texto`, **cuando** hago clic izquierdo, **entonces** pasa a modo `imagen` (solo bitmap, sin rotulo superpuesto).
- **Dado** que la cosa esta en modo `imagen`, **cuando** hago clic izquierdo, **entonces** vuelve a `imagen_y_texto`.
- **Dado** que el clic ocurre fuera de la insignia (sobre el shape), **cuando** se procesa, **entonces** NO cambia el modo — ese clic es seleccion.
- **Dado** que la cosa aparece en otro OPD, **cuando** miro su modo alli, **entonces** se mantiene independiente por instancia (pregunta abierta Q19.6: ¿por-cosa o por-instancia?).

**Reglas y restricciones:**
- Defecto al insertar: `imagen_y_texto` (§5.3).
- La insignia conserva posicion fija (esquina superior-izquierda) — no se puede mover (§9).
- El modo `Solo imagen` suprime el rotulo en canvas pero la cosa sigue listada con su nombre en `Cosas OPM Arrastrables` (§9).

**Modelo de datos tocado:**
- `cosa.imagen.modo` — `"imagen" | "texto" | "imagen_y_texto"` — persistente; granularidad por instancia visual.

**Dependencias:**
- Bloqueada por: HU-19.002.
- Relaciona: HU-19.011 (anulacion a nivel OPD).

**Integraciones:**
- Renderizador (pintar rotulo, bitmap o ambos).
- Persistencia del modo.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.4, §5.4.
- Frames: frame_00015, frame_00068, frame_00074.
- Transcripcion: "cada clic cicla modo".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, imagen, alternador, insignia].

---

### HU-19.008 — Reabrir ventana de edicion con clic derecho sobre insignia de camara

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** insignia de camara + ventana emergente `Imagen por URL` (modo edicion).
**Gesto canonico:** clic derecho sobre insignia.

**Historia:**
> Como modelador, quiero abrir la ventana emergente de edicion con clic derecho sobre la insignia de camara para reemplazar, remover o re-guardar la imagen asociada sin buscar en la barra.

**Contexto de negocio:**
El clic derecho es la dualidad del clic izquierdo sobre la insignia: editar vs. alternar. Cargar directamente la ventana emergente en modo edicion (con botones `Guardar / Remover / Guardar en Pool / Insertar desde Pool / Cancelar`) evita pasos intermedios y preserva el contexto de la cosa.

**Criterios de aceptacion:**
- **Dado** que una cosa tiene imagen e insignia visible, **cuando** hago clic derecho sobre la insignia, **entonces** se abre la ventana emergente `Imagen por URL` con la URL actual prellenada y la previsualizacion cargada.
- **Dado** que la ventana emergente se abre en modo edicion, **cuando** miro los botones, **entonces** veo `Guardar`, `Insertar desde Pool`, `Remover`, `Guardar en Pool`, `Cancelar` (§5.1 fuente).
- **Dado** que cierro con `Cancelar`, **cuando** la ventana cierra, **entonces** la cosa conserva la imagen sin modificacion.
- **Dado** que el navegador ya tiene un menu contextual del sistema, **cuando** hago clic derecho, **entonces** la ventana emergente suprime el menu nativo del navegador.

**Reglas y restricciones:**
- La ventana emergente distingue modo creacion (boton `Insertar`) de modo edicion (boton `Guardar`).
- El clic derecho sobre el shape sin imagen no abre esta ventana emergente (comportamiento indefinido — queda fuera de scope).

**Modelo de datos tocado:**
- Ninguno directamente; prepara el estado de la ventana emergente.

**Dependencias:**
- Bloqueada por: HU-19.002.
- Bloquea a: HU-19.009, HU-19.010.

**Integraciones:**
- Ventana emergente `Imagen por URL`.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.5, §5.1, §5.4.
- Frames: frame_00020.
- Transcripcion: "Right Click to Edit".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, imagen, ventana-emergente, edicion].

---

### HU-19.009 — Reemplazar imagen existente desde ventana emergente en modo edicion

**Actor primario:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P (actualiza `cosa.imagen.origen`) secundaria.
**Superficie UI:** ventana emergente `Imagen por URL` en modo edicion.
**Gesto canonico:** reemplazar URL o insertar desde pool + `Guardar`.

**Historia:**
> Como modelador, quiero cambiar la imagen asociada a una cosa sin eliminar la cosa ni resetear sus otros atributos para ajustar el render visual segun evoluciona el modelo.

**Contexto de negocio:**
Las imagenes se eligen iterativamente: el modelador explora hasta encontrar el bitmap que mejor representa la cosa. Forzar eliminar + re-insertar perderia el modo de render y el ref_pool previo. La ventana emergente en modo edicion es la via atomica.

**Criterios de aceptacion:**
- **Dado** que la ventana emergente esta abierta en modo edicion con la imagen actual, **cuando** cambio la URL y pulso `Previsualizar`, **entonces** la nueva imagen carga en la zona de previsualizacion.
- **Dado** que previsualice la nueva imagen, **cuando** pulso `Guardar`, **entonces** `cosa.imagen.origen` se actualiza al nuevo valor, `cosa.imagen.ref_pool` se ajusta (null si vino de URL libre), y el canvas re-renderiza la cosa.
- **Dado** que en modo edicion pulso `Insertar desde Pool` y elijo otra imagen, **cuando** confirmo, **entonces** se comporta como reemplazo (no crea una segunda imagen).
- **Dado** que reemplace la imagen, **cuando** consulto el modo `cosa.imagen.modo`, **entonces** conserva el modo previo (no resetea a defecto).

**Reglas y restricciones:**
- El reemplazo no altera `cosa.imagen.modo`.
- El bitmap previo queda disponible en cache local hasta que sea evicto (HU-19.016).

**Modelo de datos tocado:**
- `cosa.imagen.origen` — string URL — persistente.
- `cosa.imagen.ref_pool` — `string | null` — persistente.

**Dependencias:**
- Bloqueada por: HU-19.008.

**Integraciones:**
- Cache local (HU-19.016).

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.5, §5.1.
- Clase de afirmacion: inferido de la presencia de `Guardar` en modo edicion + comportamiento observado del `Insertar desde Pool` en la misma ventana emergente.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, imagen, edicion, reemplazo].

---

### HU-19.010 — Eliminar imagen asociada con boton Remover de la ventana emergente

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P secundaria.
**Superficie UI:** ventana emergente `Imagen por URL` en modo edicion — boton `Remover`.
**Gesto canonico:** clic en `Remover`.

**Historia:**
> Como modelador, quiero desasociar la imagen de una cosa sin eliminar la cosa misma para volver a un render textual cuando la imagen deja de aportar valor.

**Contexto de negocio:**
`Remover` revierte el enriquecimiento visual. La cosa vuelve a la representacion canonica OPM (solo rotulo). La insignia desaparece; la cosa queda como si nunca hubiera tenido imagen.

**Criterios de aceptacion:**
- **Dado** que la cosa tiene imagen, **cuando** pulso `Remover` en la ventana emergente de edicion, **entonces** `cosa.imagen` se anula (o se borran `origen`, `modo`, `ref_pool`).
- **Dado** que confirme el remover, **cuando** la ventana emergente cierra, **entonces** la insignia de camara desaparece y el canvas pinta solo el rotulo.
- **Dado** que elimine la imagen y consulto el OPL, **entonces** no hay cambio alguno (ver HU-19.015).
- **Dado** que hice remover, **cuando** ejecuto deshacer (HU-90.xxx), **entonces** la imagen se restaura con su modo previo — comportamiento esperado, pendiente de verificar via HU-90.xxx.

**Reglas y restricciones:**
- Remover no pide confirmacion explicita (comportamiento observado §3.5).
- Remover es reversible solo por deshacer.

**Modelo de datos tocado:**
- `cosa.imagen` — pasa de objeto con origen/modo/ref_pool a `null` o undefined — persistente.

**Dependencias:**
- Bloqueada por: HU-19.008.
- Relaciona: EPICA-90 (deshacer/rehacer).

**Integraciones:**
- Renderizador (eliminar insignia).

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.5, §5.1.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, imagen, eliminacion].

---

### HU-19.011 — Forzar modo Imagen/Texto/Imagen+Texto a todo el OPD desde Opciones de Visualizacion OPD

**Actor primario:** ME.
**Actores secundarios:** RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** V primario; P (persiste anulacion) secundaria.
**Superficie UI:** barra secundaria — grupo `Opciones de Visualizacion OPD` (sin seleccion activa).
**Gesto canonico:** clic en uno de los tres iconos del grupo.

**Historia:**
> Como modelador, quiero forzar a todas las cosas del OPD actual a renderizar en `Solo imagen`, `Solo texto` o `Imagen+Texto` para cambiar la vista global sin editar cada cosa por separado.

**Contexto de negocio:**
Cuando se presenta un modelo en reunion o se exporta para documentacion, es comun querer un diagrama solo-texto (publicacion formal) o solo-imagen (pitch visual). La anulacion a nivel OPD es la palanca global; preserva las preferencias por instancia al desactivarse (pregunta abierta Q19.7).

**Criterios de aceptacion:**
- **Dado** que no tengo ninguna cosa seleccionada, **cuando** miro la barra secundaria, **entonces** el grupo `Opciones de Visualizacion OPD` esta visible y habilitado.
- **Dado** que pulso `Solo imagen` en el grupo OPD, **cuando** el cambio aplica, **entonces** todas las cosas del OPD actual con imagen pintan solo el bitmap, ocultando rotulos.
- **Dado** que pulso `Solo texto`, **cuando** el cambio aplica, **entonces** todas las cosas ocultan bitmap y muestran solo rotulo; las que no tienen imagen se ven iguales.
- **Dado** que pulso `Imagen+Texto`, **cuando** el cambio aplica, **entonces** todas las cosas vuelven al render por instancia previo (pregunta abierta: ¿o al defecto explicito?).
- **Dado** que navego a otro OPD, **cuando** reviso su render, **entonces** la anulacion del OPD anterior no aplica alli (cada OPD mantiene su propia anulacion).
- **Dado** que una cosa nueva se agrega al OPD con anulacion activa, **cuando** se renderiza, **entonces** hereda el modo del OPD.

**Reglas y restricciones:**
- La anulacion OPD no borra `cosa.imagen.modo` por instancia — es una capa superior.
- Afecta el OPD actual y sus instancias alli, no otras instancias en otros OPDs (§3.6).

**Modelo de datos tocado:**
- `opd.modo_visualizacion_imagen` — `"imagen" | "texto" | "imagen_y_texto" | null` — persistente; null = respeta modo por instancia.

**Dependencias:**
- Bloqueada por: HU-19.001.
- Relaciona: HU-19.007.

**Integraciones:**
- Renderizador por OPD.
- EPICA-20 (arbol OPD): propagacion por diagrama, no transversal.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §3.6, §5.4 implicito.
- Frames: frame_00050.
- Transcripcion: "cada OPD y cada instancia es propia".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, imagen, anulacion-opd, barra].

---

### HU-19.012 — Suprimir render interior de imagen en cosa con in-zoom o unfolded

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas en vista in-zoom/unfold + tooltip de la insignia.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero que la imagen se suprima automaticamente cuando entro a una cosa con in-zoom o unfolded para no competir con el render de sus refinadores.

**Contexto de negocio:**
El interior de una cosa con in-zoom pertenece a los refinadores (partes, features, especializaciones). La imagen ocuparia el mismo espacio y resultaria ilegible. La regla canonica es: refinamiento gana sobre bitmap. La insignia persiste como marcador inerte con tooltip explicativo.

**Criterios de aceptacion:**
- **Dado** que una cosa con imagen recibe in-zoom (entrar al OPD hijo), **cuando** miro el interior, **entonces** NO se pinta el bitmap; se pintan los refinadores.
- **Dado** que entre al OPD hijo, **cuando** miro la insignia de camara, **entonces** sigue visible en la cosa padre (marcador inerte).
- **Dado** que hago hover sobre la insignia en la vista con in-zoom, **cuando** aparece el tooltip, **entonces** muestra `La vista de imagen esta deshabilitada en cosa con in-zoom`.
- **Dado** que salgo del in-zoom y vuelvo al OPD padre, **cuando** miro la cosa, **entonces** la imagen se restaura al render anterior.
- **Dado** que una cosa esta unfolded (features/especializacion visibles), **cuando** miro el interior, **entonces** aplica la misma regla: imagen suprimida.

**Reglas y restricciones:**
- El modelo (`cosa.imagen.*`) NO se altera — solo el render.
- El usuario no puede editar la imagen desde la vista con in-zoom (§4.2), si desde el padre.
- La regla es visual-only; no afecta exportacion del OPD padre.

**Modelo de datos tocado:**
- Ninguno; solo render.

**Dependencias:**
- Bloqueada por: HU-19.002.
- Relaciona: EPICA-12 (in-zoom), EPICA-18 (semi-folding/unfolding).

**Integraciones:**
- Renderizador — regla de composicion entre imagen y refinamiento.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §4.2, §7.2.
- Frames: frame_00055.
- Transcripcion: "The image view is unabled in inzoomed thing".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, imagen, inzoom, unfold].

---

### HU-19.013 — Resolver exclusion mutua entre imagen y estados visibles

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** V.
**Superficie UI:** canvas — render de objeto con estados.
**Gesto canonico:** ninguno (regla declarativa) + `suprimir estados` manual cuando se requiere imagen.

**Historia:**
> Como modelador, quiero que el sistema decida una regla clara entre mostrar estados o mostrar imagen para que el interior del objeto no compita visualmente.

**Contexto de negocio:**
Estados visibles ocupan el interior del rectangulo — igual que la imagen. OPCloud instruye al usuario a alternar manualmente (`suprimir estados` para ver imagen; re-exponerlos para editarlos). Es la regla defecto; podria refinarse con prioridad automatica en iteraciones posteriores.

**Criterios de aceptacion:**
- **Dado** que un objeto tiene imagen asociada y estados visibles, **cuando** se renderiza, **entonces** se muestran los estados y la imagen se suprime (comportamiento observado por defecto — regla a validar contra EPICA-13).
- **Dado** que hago `suprimir estados` sobre el objeto, **cuando** los estados desaparecen, **entonces** la imagen se renderiza en el interior.
- **Dado** que re-expongo los estados, **cuando** vuelven a mostrarse, **entonces** la imagen se suprime nuevamente.
- **Dado** que el modo OPD es `Solo imagen` (HU-19.011), **cuando** el OPD se renderiza, **entonces** pregunta abierta Q19.8: ¿la anulacion fuerza suprimir estados o los conserva?

**Reglas y restricciones:**
- Regla defecto (hipotesis): estados ganan sobre imagen cuando ambos estan expuestos.
- La alternancia manual (suprimir estados) queda a cargo del modelador.
- Ninguna de las dos capas destruye a la otra en el modelo — es exclusion solo en render.

**Modelo de datos tocado:**
- Ninguno; solo composicion de render.

**Dependencias:**
- Relaciona: EPICA-13 (estados), HU-19.007.

**Integraciones:**
- Renderizador: regla de precedencia entre estados e imagen.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §4.3, §7.3.
- Transcripcion: "para ver la imagen, suprimir los estados".
- Clase de afirmacion: observado + confirmado + abierto (para la interaccion con anulacion OPD).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, imagen, estados, requires-clarification].

---

### HU-19.014 — Preservar imagenes en exportacion SVG; excluirlas en PDF/JPEG

**Actor primario:** RV (revisor / lector).
**Actores secundarios:** ME, AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion externa — export).
**Superficie UI:** pipeline de exportacion (SVG y PDF).
**Gesto canonico:** ninguno (comportamiento del exportador).

**Historia:**
> Como revisor, quiero que al exportar el OPD en SVG las imagenes se conserven y que al exportar en PDF las URLs se listen sin incrustar el bitmap para preservar portabilidad y reducir peso del PDF.

**Contexto de negocio:**
SVG admite incrustaciones (base64 o href) sin explotar el peso del archivo. PDF podria incrustar bitmaps pero eso dispara el tamaño y complica impresion. OPCloud toma la decision de preservar en SVG y listar solo URLs en PDF (§7.5). Esta HU alinea el comportamiento del exportador del repo con esa convencion.

**Criterios de aceptacion:**
- **Dado** que exporto el OPD actual como SVG, **cuando** descargo el archivo, **entonces** cada cosa con imagen incluye la URL o la incrustacion del bitmap y se renderiza correctamente al abrir el SVG en un visor.
- **Dado** que exporto el OPD como PDF, **cuando** descargo el archivo, **entonces** las cosas con imagen aparecen con placeholder (solo rotulo) y las URLs se listan en un bloque de metadatos o pagina anexa.
- **Dado** que exporto como JPEG (si existe esa ruta), **cuando** descargo, **entonces** aplica la misma exclusion que PDF — los bitmaps no se rasterizan como parte del export.
- **Dado** que una cosa esta en modo `Solo imagen` al exportar a PDF, **cuando** se renderiza el PDF, **entonces** se muestra el rotulo (reemplazo del bitmap por el nombre).

**Reglas y restricciones:**
- SVG = preservacion; PDF/JPEG = exclusion con listado de URLs.
- La insignia de camara en exportacion es pregunta abierta (Q19.9).
- La razon de la exclusion en PDF es peso + portabilidad (§7.5 + inferencia).

**Modelo de datos tocado:**
- Ninguno — es comportamiento del exportador.

**Dependencias:**
- Bloqueada por: HU-19.002.
- Relaciona: EPICA-60 (export PDF), EPICA-61 (export SVG).

**Integraciones:**
- `src/render/export/*` (a definir en este repo).
- Manejo CORS para incrustaciones SVG.

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §7.5.
- Transcripcion: "SVG conserva las imagenes; PDF y JPEG no las incrusta".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [canvas, export-svg, export-pdf, imagen].

---

### HU-19.015 — Mantener OPL invariante ante estado de imagen

**Actor primario:** MN.
**Actores secundarios:** RV.
**Tipo:** opm-semantica.
**Fuente normativa primaria:** `opm-iso-19450-es.md` [§Representacion bimodal] — "todo modelo OPM individual se expresa en dos formas equivalentes: OPD y OPL-ES"; `opm-opl-es.md` [OPL-ES] — gramatica de sentencias canonicas que excluye enriquecimientos visuales.
**Nivel categorico:** L (lente OPL) — invariante declarativa.
**Superficie UI:** panel-opl-es.
**Gesto canonico:** ninguno.

**Historia:**
> Como modelador, quiero que el panel OPL-ES no mencione nunca la existencia, URL o modo de la imagen para preservar la semantica OPM como lenguaje textual dual al diagrama.

**Contexto de negocio:**
OPM se define como lenguaje bimodal: OPD + OPL-ES son equivalentes semanticos. La imagen es un enriquecimiento visual sin significado OPM; mencionarla en el OPL crearia un artefacto fuera de la gramatica. Esta HU formaliza la invariante para que cualquier regresion del OPL emisor respete la independencia visual. Aunque toda la epica es `opcloud-ui`, esta HU es `opm-semantica` porque protege el contrato bimodal del estandar.

**Criterios de aceptacion:**
- **Dado** que incrusto una imagen en una cosa, **cuando** consulto el OPL, **entonces** no aparece ninguna sentencia nueva ni se modifica la existente.
- **Dado** que cambio el modo `imagen/texto/imagen_y_texto`, **cuando** consulto el OPL, **entonces** sigue igual.
- **Dado** que elimino la imagen (Remover), **cuando** consulto el OPL, **entonces** no hay cambio.
- **Dado** que aplico anulacion de OPD (`Solo imagen`), **cuando** consulto el OPL, **entonces** no aparece mencion a la anulacion.

**Reglas y restricciones:**
- La capa de imagen es V/U/P/C pura — nunca K ni L con sentencias.
- Cualquier regresion que introduzca sentencias OPL derivadas de imagen es bug y bloquea la epica.

**Modelo de datos tocado:**
- Ninguno; es invariante.

**Dependencias:**
- Relaciona: HU-10.016 (eco OPL).

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`) debe ignorar `cosa.imagen.*`.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` §Representacion bimodal; `opm-opl-es.md`.
- Fuente OPCloud: §3.1 paso 9, §6 cierre, §7.1.
- Transcripcion: "El OPL no cambia".
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0 (invariante — protege contrato OPL).
**Tamano:** XS.
**Etiquetas:** [canvas, opl, imagen, invariante].

---

### HU-19.016 — Cachear bitmap remoto y degradar a Solo texto ante URL caida

**Actor primario:** ME.
**Actores secundarios:** MN, RV.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; V (render degradado) secundaria.
**Superficie UI:** canvas — render fallback.
**Gesto canonico:** ninguno (comportamiento automatico).

**Historia:**
> Como modelador, quiero que el repo cachee los bitmaps remotos tras descargarlos y que, si una URL queda caida, la cosa degrade a `Solo texto` en vez de mostrar un icono roto para mantener el modelo legible.

**Contexto de negocio:**
La dependencia de URL externa fractura la portabilidad del modelo (§7.6 fuente). Una cache local reduce latencia en cargas repetidas y funciona como respaldo. El degradado a `Solo texto` ante fallo evita modelos con imagenes rotas — un problema habitual en presentaciones y exports. Este comportamiento es mencionado como pregunta abierta en la fuente (§11.5) y se propone como canonico aqui.

**Criterios de aceptacion:**
- **Dado** que inserto una imagen por URL, **cuando** la descarga termina, **entonces** el bitmap se guarda en cache local (IndexedDB o Cache API) indexado por URL.
- **Dado** que abro el modelo en otra sesion con la misma URL, **cuando** la cosa se renderiza, **entonces** el bitmap se sirve desde cache si esta disponible.
- **Dado** que la URL queda caida (404 / timeout), **cuando** la cosa intenta renderizarse, **entonces** cae al modo `Solo texto` como degradacion automatica y se muestra indicador de error inline (tooltip `Imagen inaccesible`).
- **Dado** que la URL vuelve a estar disponible, **cuando** el modelador refresca manualmente la cosa, **entonces** el bitmap se re-descarga y se restaura el render previo.
- **Dado** que la cache supera un umbral de tamaño (ej. 100 MB), **cuando** llega una imagen nueva, **entonces** se evicta la mas antigua (LRU — hipotesis a validar).

**Reglas y restricciones:**
- Politica de cache: LRU por fecha de acceso (hipotesis).
- Umbral de cache: parametro configurable (ver EPICA-80).
- El degradado es a `Solo texto`, no a placeholder — preserva modelo legible.
- Esta HU es la respuesta canonica a la pregunta abierta §11.5 del doc fuente.

**Modelo de datos tocado:**
- `cache_imagen.url` — string (key) — persistente en IndexedDB.
- `cache_imagen.blob` — `Blob` binario — persistente.
- `cache_imagen.ultimo_acceso` — timestamp — persistente.
- `cosa.imagen.estado` (transitorio) — `"ok" | "cargando" | "error"` — no persistente.

**Dependencias:**
- Bloqueada por: HU-19.002.
- Relaciona: EPICA-30 (persistencia), EPICA-80 (config organizacion).

**Integraciones:**
- IndexedDB (`src/persistencia/`).
- Fetch + manejo de errores.
- Renderizador (deteccion de `cosa.imagen.estado === "error"` y degradado a texto).

**Notas de evidencia:**
- Fuente normativa primaria: ninguna — la capa de imagen es opcloud-ui pura.
- Fuente OPCloud: §7.6 (dependencia externa), §11.4 (serializacion abierta), §11.5 (fallback abierto), §11.8 (tamaño sin cota).
- Clase de afirmacion: hipotesis propuesta por el repo para cerrar preguntas abiertas del doc fuente.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [canvas, persistencia, imagen, cache, fallback, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q19.1** (≡ §11.1 fuente): ¿Puede una elipse (Proceso) recibir imagen? La UI lo ofreceria al seleccionar cualquier cosa, pero no hay demo. Afecta a HU-19.001 y HU-19.002. Hasta resolver, marcar el flow sobre procesos como `requires-clarification`.
- **Q19.2** (≡ §4.1 fuente ampliado): Extensiones exactas aceptadas en la validacion de URL y politica `http://` vs `https://`. Afecta a HU-19.002.
- **Q19.3** (≡ §4.5 fuente ampliado): ¿Existe rol admin global en este repo capaz de escribir en ambito `Global`? Afecta a HU-19.005 — puede quedar deferred si no hay tal rol.
- **Q19.4** (§5.2 ampliado): ¿Busqueda del pool por tags usa AND u OR cuando hay multiples? Afecta a HU-19.006.
- **Q19.5** (§5.2 ampliado): ¿El filtro de tags se resetea o persiste al cambiar de pestaña Privado/Organizacional/Global? Afecta a HU-19.006.
- **Q19.6** (≡ §11.3 fuente): Persistencia inter-OPD del modo imagen/texto — ¿por-cosa o por-instancia visual? Afecta a HU-19.007.
- **Q19.7** (§3.6 ampliado): Cuando la anulacion OPD se desactiva (vuelve a `Imagen+Texto`), ¿restaura los modos por instancia previos o aplica defecto explicito? Afecta a HU-19.011.
- **Q19.8** (§4.3 ampliado): Interaccion entre anulacion OPD `Solo imagen` y objetos con estados visibles: ¿la anulacion fuerza `suprimir estados`? Afecta a HU-19.013.
- **Q19.9** (≡ §11.6 fuente): ¿La insignia de camara aparece en SVG/PDF o es solo chrome del editor? Afecta a HU-19.014.
- **Q19.10** (≡ §11.4 fuente): Serializacion del bitmap en el formato persistente — ¿URL, hash, incrustacion base64, referencia al pool? Afecta a HU-19.002, HU-19.004, HU-19.016.
- **Q19.11** (≡ §11.7 fuente): Relacion imagen ↔ simulacion (tokens y estados sobre bitmap pueden perder contraste). Escalar a EPICA-B0 cuando se redacte.
- **Q19.12** (≡ §11.8 fuente): Limite de tamaño / resolucion del bitmap. Afecta a HU-19.002, HU-19.005, HU-19.016.

## Referencias cruzadas

- Fuente normativa: `opm-iso-19450-es.md`, `opm-opl-es.md`.
- Evidencia OPCloud: `JOYAS.md`, `sandbox-data/`, `assets/svg/`, `decompiled/`.
- Doc fuente original: `opcloud-reverse/19-canvas-imagenes.md`.
- Epicas relacionadas:
  - EPICA-10 (creacion de cosas) — prerequisito: una cosa debe existir antes de recibir imagen.
  - EPICA-12 (in-zoom) — HU-19.012 depende de la regla de supresion en in-zoom.
  - EPICA-13 (estados) — HU-19.013 articula la exclusion mutua imagen↔estados.
  - EPICA-18 (semi-folding) — HU-19.012 aplica tambien a unfolding.
  - EPICA-14 (canvas-styling) — imagen es capa visual separada del estilado de borde/tipografia.
  - EPICA-30 (persistencia) — HU-19.016 persiste cache en IndexedDB.
  - EPICA-40 (permisos) — HU-19.005 respeta ambito segun rol.
  - EPICA-50 (OPL pane) — HU-19.015 protege invariante OPL.
  - EPICA-60 (export PDF) y EPICA-61 (export SVG) — HU-19.014 define el comportamiento por formato.
  - EPICA-80 (config user/org) — parametros de cache y defaults de pool.
  - EPICA-82 (ontologia organizacional) — administracion del pool.
  - EPICA-90 (shortcuts) — deshacer/rehacer aplica a insercion, reemplazo, remover.
  - EPICA-A0 (stereotypes) y EPICA-33 (templates) — §7.4: imagenes usables en stereotypes y templates sin demo especifica.
  - EPICA-B0 (simulacion conceptual) — Q19.11 relaciona imagen con render de simulacion.
