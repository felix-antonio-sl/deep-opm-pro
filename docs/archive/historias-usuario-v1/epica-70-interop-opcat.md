---
epica: "EPICA-70"
titulo: "Interop — importacion de modelos OPCAT 4.2 (.opx) al modelador OPM"
doc_fuente: "opcloud-reverse/70-interop-opcat.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 25
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-70.md"
---

## Resumen

Esta epica cubre el **unico flujo de ingreso** que permite hidratar el modelador con un modelo OPM existente producido por la herramienta legacy **OPCAT 4.2** (formato `.opx`). El alcance incluye: entrada al flujo desde el main menu, el modal `Import OPCAT Model` con sus tres fases (vacia → adjunto → error), la seleccion del archivo y validacion de version, el parsing del `.opx`, la materializacion del modelo en memoria (cosas, links, arbol OPD, OPL regenerado), las reglas de mapeo OPCAT → OPM canonico (retipificacion visual silenciosa), el camino de error con `DOWNLOAD LOG`, y la integracion con el ciclo `Save Model` posterior (el modelo importado es `Model (Not Saved)` hasta que el usuario guarda).

Queda fuera del alcance de esta epica:

- la exportacion inversa OPCloud → `.opx` (no existe evidencia en el corpus; probablemente unidireccional),
- la importacion de CSV (EPICA-71),
- la carga de modelos nativos del modelador (EPICA-30),
- la preservacion pixel-perfect del render OPCAT (OPCloud documenta explicitamente retipificacion; no es objetivo del modelador reproducir el canvas origen).

El corazon de esta epica es la **interoperabilidad semantica**: preservar la estructura OPM (cosas, links, jerarquia de OPDs) aunque se pierdan convenciones visuales del origen. Las HU distinguen entre lo que es **valor conservable** (semantica OPM) y lo que es **descarte explicito** (render OPCAT legacy). La SSOT OPM no prescribe el formato de importacion; esta epica captura la implementacion observada en OPCloud con las mejoras del modelador local donde se justifique.

Las HU se numeran siguiendo la aparicion en el doc fuente. El mapa de correspondencia con secciones del doc fuente se documenta en cada HU.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-70.001 | Abrir dialogo Import OPCAT desde main menu | MN | S | XS | opcloud-ui | — |
| HU-70.002 | Ver modal Import OPCAT en fase vacia | MN | S | S | opcloud-ui | — |
| HU-70.003 | Leer restriccion de version OPCAT 4.2 en bloque Attention | MN | S | XS | opcloud-ui | — |
| HU-70.004 | Acceder a link externo OPCAT Installation | MN | C | XS | opcloud-ui | — |
| HU-70.005 | Adjuntar archivo .opx con pill Import OPX Model | MN | S | S | opcloud-ui | — |
| HU-70.006 | Ver metadatos del archivo adjunto (File Name / File Size) | MN | S | XS | opcloud-ui | — |
| HU-70.007 | Habilitar boton IMPORT solo tras adjuntar archivo | MN | S | XS | opcloud-ui | — |
| HU-70.008 | Disparar importacion con boton IMPORT | MN | S | M | opcloud-ui | — |
| HU-70.009 | Parsear estructura OPM del .opx (cosas, links, OPDs) | MN | S | XL | mixto | — |
| HU-70.010 | Mapear tipos OPCAT a primitivas OPM canonicas | AD | S | L | opm-semantica | [V-1] [V-61] [V-239] |
| HU-70.011 | Reconstruir arbol OPD con sufijos in-zoomed / unfolded | MN | S | M | mixto | — |
| HU-70.012 | Poblar inventario Draggable OPM Things post-import | MN | S | S | opcloud-ui | — |
| HU-70.013 | Regenerar OPL del modelo importado desde el kernel | MN | S | M | opm-semantica | [OPL-ES] |
| HU-70.014 | Cargar modelo importado como Model (Not Saved) | MN | S | XS | opcloud-ui | — |
| HU-70.015 | Guardar modelo importado con Save Model posterior | MN | S | S | opcloud-ui | — |
| HU-70.016 | Cancelar Import desde fase vacia sin efectos | MN | M1 | XS | opcloud-ui | — |
| HU-70.017 | Cancelar Import tras adjuntar y descartar el archivo | MN | M1 | XS | opcloud-ui | — |
| HU-70.018 | Ver modal de error con IMPORT deshabilitado y boton DOWNLOAD LOG en rojo | MN | S | S | opcloud-ui | — |
| HU-70.019 | Descargar log de error con DOWNLOAD LOG | ME | S | M | opcloud-ui | — |
| HU-70.020 | Cerrar modal de error con OK sin persistir nada | MN | S | XS | opcloud-ui | — |
| HU-70.021 | Rechazar archivo de version OPCAT incompatible | MN | C | S | opcloud-ui | — |
| HU-70.022 | Rechazar archivo no-.opx desde el selector | MN | C | S | opcloud-ui | — |
| HU-70.023 | Re-abrir Import OPCAT sobre modelo ya cargado | ME | C | M | opcloud-ui | — |
| HU-70.024 | Advertir antes de descartar cambios no guardados al importar | MN | C | S | mixto | — |
| HU-70.025 | Emitir advertencia de retipificacion post-import | AD | C | M | mixto | — |

Total: **25 historias de usuario** (18 opcloud-ui, 3 mixto, 2 opm-semantica, 2 pendientes de clarificacion).

## Historias de usuario

### HU-70.001 — Abrir dialogo Import OPCAT desde main menu

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME, AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X (integracion externa) secundario.
**Superficie UI:** main-menu (lateral izquierdo) + entrada `Import Model`.
**Gesto canonico:** clic en `Import Model` desde el main menu abierto.

**Historia:**
> Como modelador, quiero abrir el dialogo de importacion OPCAT desde una entrada visible del main menu para ingresar un modelo legacy sin descubrir un flujo oculto.

**Contexto de negocio:**
La importacion desde OPCAT 4.2 es la unica via observada de hidratar modelos legacy al modelador. Exponerla como entrada de primer nivel del main menu (al mismo peso que `Load Model` y `Save`) comunica que es ciudadano de primera clase, no una utilidad escondida.

**Criterios de aceptacion:**
- **Dado** que el main menu esta cerrado, **cuando** abro la hamburguesa, **entonces** veo la entrada `Import Model` listada entre `Exports ▸` y el separador previo a `OPCloud Settings`.
- **Dado** que el main menu esta abierto, **cuando** hago clic en `Import Model`, **entonces** el main menu se cierra y se abre el modal `Import OPCAT Model` en fase vacia.
- **Dado** que la entrada no esta anidada, **cuando** la busco, **entonces** NO esta bajo un submenu `Interop ▸` o `Imports ▸` — aparece directa en el nivel raiz del main menu.

**Reglas y restricciones:**
- Entrada unica al flujo; no hay atajos de teclado para importacion observados (ver HU-90.xxx).
- El main menu se cierra automaticamente al abrir el modal para no competir visualmente.

**Modelo de datos tocado:**
- Ninguno (abre UI).

**Dependencias:**
- Bloquea a: HU-70.002 (modal se abre a continuacion).

**Integraciones:**
- Main menu shell (EPICA-UI transversal).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/70-interop-opcat.md` §2, §3.1 paso 1, §7.1.
- Frames: frame_00002.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, ui, main-menu, import-opcat].

---

### HU-70.002 — Ver modal Import OPCAT en fase vacia

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (fase vacia).
**Gesto canonico:** ninguno (render inmediato tras abrir).

**Historia:**
> Como modelador, quiero ver un modal con estructura clara (titulo, advertencia, zona de adjunto, botones) al invocar Import OPCAT para entender el flujo antes de adjuntar archivo.

**Contexto de negocio:**
El modal en fase vacia es la **invitacion visual** al flujo. Estructura tripartita invariante (titulo → bloque Attention → pill de archivo → botones al pie) que guia al usuario paso a paso. La ausencia de adjunto se senaliza con dos afordances convergentes: icono clip en el pill y boton `IMPORT` deshabilitado en gris.

**Criterios de aceptacion:**
- **Dado** que abri Import OPCAT, **cuando** se renderiza el modal, **entonces** veo el titulo `Import OPCAT Model` en la cabecera.
- **Dado** que el modal esta en fase vacia, **cuando** miro el contenido, **entonces** veo en orden: bloque `Attention` con texto de restriccion → pill `Import OPX Model` con icono clip → boton `IMPORT` deshabilitado gris → boton `CANCEL` habilitado.
- **Dado** que el modal esta abierto, **cuando** miro el fondo, **entonces** el canvas queda visible al ~45% de opacidad detras del modal.
- **Dado** que el modal no tiene adjunto, **cuando** observo el boton `IMPORT`, **entonces** tiene estilo gris deshabilitado y no responde a clics.

**Reglas y restricciones:**
- Modal centrado, no fullscreen.
- No hay barra de progreso; el feedback del upload viene despues (ver HU-70.008).
- El modal es blocker: no permite interactuar con el canvas detras sin cerrarlo.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-70.001.
- Bloquea a: HU-70.003, HU-70.005.

**Integraciones:**
- Shell de modales del modelador.

**Notas de evidencia:**
- Fuente: §2, §3.1 paso 2, §9.
- Frames: frame_00003.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, ui, modal, estado-vacio].

---

### HU-70.003 — Leer restriccion de version OPCAT 4.2 en bloque Attention

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (bloque `Attention`).
**Gesto canonico:** ninguno (lectura).

**Historia:**
> Como modelador, quiero leer en el modal que el archivo debe ser `.opx` guardado desde OPCAT 4.2 para no adjuntar formatos incompatibles ni perder tiempo con errores previsibles.

**Contexto de negocio:**
La restriccion de version es semantica: OPCloud solo sabe parsear el `.opx` del OPCAT 4.2. Exponerla **antes** del file picker (no post-error) reduce friccion y ensena al usuario el contrato de interoperabilidad.

**Criterios de aceptacion:**
- **Dado** que el modal esta abierto, **cuando** miro la parte superior, **entonces** veo el bloque `Attention` con texto `Attention: the input file must be .opx saved in OPCAT 4.2. Download OPCAT 4.2 from OPCAT Installation`.
- **Dado** que el bloque esta visible, **cuando** miro su formato, **entonces** el texto se presenta en dos lineas, con la palabra `Attention` marcada visualmente (peso o color).
- **Dado** que el bloque persiste en todas las fases del modal, **cuando** adjunto archivo o entro en estado de error, **entonces** el bloque sigue siendo visible (no desaparece tras adjuntar).

**Reglas y restricciones:**
- Texto fijo: la version `4.2` es literal, no derivada de un setting.
- El link `OPCAT Installation` se muestra como hipervinculo (ver HU-70.004).

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-70.002.

**Integraciones:**
- Ninguna; texto estatico.

**Notas de evidencia:**
- Fuente: §2, §5.1.
- Frames: frame_00003.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, ui, attention, version].

---

### HU-70.004 — Acceder a link externo OPCAT Installation

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** X (integracion externa).
**Superficie UI:** modal-import-opcat (link dentro de `Attention`).
**Gesto canonico:** clic en texto subrayado azul.

**Historia:**
> Como modelador que no tiene OPCAT 4.2 instalado, quiero acceder al sitio de descarga desde el mismo modal para resolver la dependencia sin cerrar el flujo.

**Contexto de negocio:**
La interoperabilidad impone una dependencia externa (OPCAT 4.2 es una aplicacion de escritorio del Technion). Exponer el link de descarga inline elimina el "dead end" para usuarios que descubren el flujo sin tener el origen instalado.

**Criterios de aceptacion:**
- **Dado** que el bloque `Attention` esta visible, **cuando** miro el texto, **entonces** la frase `OPCAT Installation` aparece como link (azul subrayado).
- **Dado** que el link es visible, **cuando** hago clic, **entonces** se abre el destino externo en nueva pestana/ventana (no reemplaza el modelador).
- **Dado** que el modal sigue abierto tras el clic, **cuando** vuelvo, **entonces** el estado del modal se conserva (sin adjunto aun si asi estaba).

**Reglas y restricciones:**
- El destino es externo al modelador, fuera de su alcance de mantenimiento.
- Si el sitio externo cae, la degradacion es del lado del usuario (el modelador no falla). Ver pregunta abierta Q70.11.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-70.003.

**Integraciones:**
- Navegador del usuario.

**Notas de evidencia:**
- Fuente: §2, §7.8, §11 pregunta 11.
- Frames: frame_00003.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [interop, ui, link-externo].

---

### HU-70.005 — Adjuntar archivo .opx con pill Import OPX Model

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** modal-import-opcat (pill `Import OPX Model`) + file picker del SO.
**Gesto canonico:** clic en el pill + seleccion en file picker.

**Historia:**
> Como modelador, quiero seleccionar un archivo `.opx` desde el file picker del sistema operativo al hacer clic en el pill del modal para adjuntar el modelo a importar.

**Contexto de negocio:**
El file picker del SO es la afordance estandar para subir archivos; usarlo evita reinventar un picker propio. El pill central del modal actua como trigger explicito; no se usa drag-and-drop observable.

**Criterios de aceptacion:**
- **Dado** que el modal esta en fase vacia, **cuando** hago clic en el pill `Import OPX Model`, **entonces** se abre el file picker nativo del sistema operativo.
- **Dado** que el file picker esta abierto, **cuando** selecciono un archivo y confirmo, **entonces** el modal pasa a fase adjunta (ver HU-70.006, HU-70.007).
- **Dado** que el file picker esta abierto, **cuando** cancelo la seleccion, **entonces** el modal queda en fase vacia sin cambios.

**Reglas y restricciones:**
- El icono del pill cambia: **clip** en fase vacia, **circulo azul solido** tras adjuntar.
- Drag-and-drop directo al modal no es un gesto observado; si se implementa, es extension documentada aparte.
- Filtrado de extension en el file picker es **pregunta abierta** (HU-70.022 y Q70.4).

**Modelo de datos tocado:**
- Archivo (blob) en memoria del navegador — transitorio hasta HU-70.008.

**Dependencias:**
- Bloqueada por: HU-70.002.
- Bloquea a: HU-70.006, HU-70.007, HU-70.022.

**Integraciones:**
- API File del navegador.

**Notas de evidencia:**
- Fuente: §2, §3.1 paso 3, §9.
- Frames: frame_00003, frame_00004, frame_00011.
- Clase de afirmacion: observado (cambio de icono) + inferido (mecanismo exacto del file picker).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, ui, file-picker, adjunto].

---

### HU-70.006 — Ver metadatos del archivo adjunto (File Name / File Size)

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (bloque de metadatos, fase adjunta).
**Gesto canonico:** ninguno (render automatico post-adjunto).

**Historia:**
> Como modelador, quiero ver el nombre y el tamano del archivo adjuntado para confirmar que seleccione el correcto antes de disparar la importacion.

**Contexto de negocio:**
El bloque de metadatos es el feedback positivo de la accion "adjuntar". Ver el nombre y tamano es mas robusto que confiar solo en el cambio de icono del pill; previene importar un archivo equivocado por error de seleccion.

**Criterios de aceptacion:**
- **Dado** que adjunte un `.opx`, **cuando** el modal se refresca, **entonces** aparece un bloque con dos lineas: `File Name: <nombre>.opx` y `File Size: <tamano formateado>` (ej. `1.397 MB`, `0.106 MB`).
- **Dado** que el bloque esta visible, **cuando** miro el formato, **entonces** ambas etiquetas (`File Name:`, `File Size:`) aparecen en peso destacado.
- **Dado** que cambio de archivo (adjunto otro), **cuando** el modal se refresca, **entonces** los metadatos reflejan el nuevo archivo.
- **Dado** que un separador horizontal delgado queda bajo el bloque de metadatos, **cuando** miro el modal, **entonces** separa los metadatos de los botones al pie.

**Reglas y restricciones:**
- El tamano se formatea en MB con 3 decimales (convencion observada: `1.397 MB`, `0.106 MB`).
- Nombres de archivo con espacios y `&` se aceptan sin normalizacion visible (ej. `746 computer network file sharing & storing system 14 Jan 2019.opx`).

**Modelo de datos tocado:**
- Metadatos del archivo (derivados de la API File del navegador) — transitorios.

**Dependencias:**
- Bloqueada por: HU-70.005.

**Integraciones:**
- API File.

**Notas de evidencia:**
- Fuente: §2, §3.1 paso 4, §5.3.
- Frames: frame_00004, frame_00011.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, ui, metadatos-adjunto].

---

### HU-70.007 — Habilitar boton IMPORT solo tras adjuntar archivo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (boton `IMPORT`).
**Gesto canonico:** ninguno (estado derivado).

**Historia:**
> Como modelador, quiero que el boton IMPORT solo sea clicable despues de adjuntar un archivo valido para no disparar una importacion sin origen.

**Contexto de negocio:**
El estado del boton es feedback visual claro: gris deshabilitado = no hay nada que importar; habilitado = listo para disparar. Evita errores de UX y dialogos adicionales de "no has adjuntado nada".

**Criterios de aceptacion:**
- **Dado** que el modal esta en fase vacia, **cuando** observo `IMPORT`, **entonces** aparece en gris y no responde a clics.
- **Dado** que adjunte un `.opx`, **cuando** se refresca el modal, **entonces** `IMPORT` cambia a estilo habilitado (color del theme, ej. azul/negro) y responde a clics.
- **Dado** que estaba en fase adjunta y descarto el archivo (HU-70.017), **cuando** vuelvo a fase vacia, **entonces** `IMPORT` vuelve a gris deshabilitado.
- **Dado** que tras un error (HU-70.018) `IMPORT` queda gris, **cuando** adjunto un archivo nuevo, **entonces** `IMPORT` se rehabilita (**pregunta abierta**: ver Q70.12, si el modal se resetea o el usuario debe cerrar con `OK` y re-invocar).

**Reglas y restricciones:**
- La habilitacion es derivada del estado del adjunto, no de validacion semantica pre-import.
- El boton permanece gris en el estado de error (HU-70.018).

**Modelo de datos tocado:**
- Ninguno persistente.

**Dependencias:**
- Bloqueada por: HU-70.005.
- Bloquea a: HU-70.008.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §2, §9.
- Frames: frame_00003 (gris), frame_00004 (habilitado), frame_00012 (gris en error).
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, ui, validacion, estado-boton].

---

### HU-70.008 — Disparar importacion con boton IMPORT

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; K, V, L secundarios.
**Superficie UI:** modal-import-opcat (boton `IMPORT`).
**Gesto canonico:** clic en boton habilitado.

**Historia:**
> Como modelador, quiero disparar la importacion pulsando IMPORT para transferir el archivo al parser y obtener el modelo materializado en el canvas.

**Contexto de negocio:**
El clic en `IMPORT` es la decision del usuario. Desencadena subida → parsing → materializacion → render. Es un gesto atomico: tras el clic, la UI debe mostrar progreso o estado terminal (exito o error), sin limbo.

**Criterios de aceptacion:**
- **Dado** que hay un `.opx` adjunto, **cuando** pulso `IMPORT`, **entonces** se inicia el proceso de importacion (subida + parsing).
- **Dado** que la importacion es exitosa, **cuando** termina, **entonces** el modal se cierra y el canvas se puebla con el modelo (ver HU-70.009 a HU-70.014).
- **Dado** que la importacion falla, **cuando** el parser reporta error, **entonces** el modal NO se cierra: pasa al estado de error (HU-70.018).
- **Dado** que la importacion esta en curso, **cuando** el usuario espera, **entonces** hay feedback de progreso (**pregunta abierta**: spinner/barra no observados en los frames; ver Q70.13).

**Reglas y restricciones:**
- La importacion puede correr en backend (OPCloud es SaaS). Para el modelador core local, el parser puede correr in-browser o via Worker.
- No hay doble confirmacion ("¿seguro?"). El clic dispara directo.

**Modelo de datos tocado:**
- Modelo en memoria (post-import): ver HU-70.009+.

**Dependencias:**
- Bloqueada por: HU-70.007.
- Bloquea a: HU-70.009, HU-70.010, HU-70.011, HU-70.012, HU-70.013, HU-70.014, HU-70.018.

**Integraciones:**
- Parser de `.opx` (HU-70.009).
- Materializador de modelo en memoria.
- Render del canvas (EPICA-10+).

**Notas de evidencia:**
- Fuente: §2, §3.1 paso 5, §9.
- Frames: frame_00004 (antes del clic), frame_00005 (despues).
- Clase de afirmacion: observado (inicio y fin del proceso) + abierto (feedback intermedio de progreso).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, import-opcat, backend].

---

### HU-70.009 — Parsear estructura OPM del .opx (cosas, links, OPDs)

**Actor primario:** MN.
**Actores secundarios:** AD.
**Tipo:** mixto.
**Nivel categorico:** X primario; K secundario.
**Superficie UI:** ninguna directa (proceso interno).
**Gesto canonico:** ninguno (trigger por HU-70.008).

**Historia:**
> Como modelador, quiero que el sistema parsee el `.opx` y extraiga la estructura OPM completa (cosas, links, estados, jerarquia de OPDs) para materializarla en el kernel del modelador.

**Contexto de negocio:**
El `.opx` es el formato legacy de OPCAT 4.2 (formato binario/XML exacto no documentado en el corpus; lo relevante es el **contenido semantico** que lleva). El parser debe extraer cada cosa, cada link, cada estado y la jerarquia completa de OPDs con sus mecanismos de refinamiento. La SSOT OPM no prescribe formato de importacion, pero si las estructuras semanticas a extraer.

**Criterios de aceptacion:**
- **Dado** que el `.opx` esta adjuntado y pulse `IMPORT`, **cuando** el parser procesa el archivo, **entonces** extrae: (a) inventario de cosas con nombre + essence, (b) inventario de links con tipo + source + target, (c) inventario de estados asociados a objetos, (d) jerarquia de OPDs (SD, SD1, SD1.1, ...) con el mecanismo (in-zoom vs unfolding) por cada OPD hijo.
- **Dado** que el parsing falla en alguna seccion del `.opx`, **cuando** el parser detecta corrupcion o dato incompatible, **entonces** registra el detalle en el log (HU-70.019) y marca la porcion como no renderizable.
- **Dado** que el parser completa la extraccion, **cuando** emite el resultado, **entonces** entrega una estructura que el materializador puede consumir sin conocer el formato `.opx`.

**Reglas y restricciones:**
- El parser es un adaptador: `.opx` → estructura intermedia → kernel. No mezclar parsing con render ni con validacion OPM.
- Formato del `.opx`: no observable en el corpus. **Inferido**: binario o XML estructurado con nodos para cosas, links, OPDs, OPL.
- La extraccion debe ser tolerante a campos legacy desconocidos (**inferido** por la existencia del modo error parcial, §3.3).

**Modelo de datos tocado:**
- Estructura intermedia (AST del `.opx`) — transitorio.
- Modelo del kernel (post-materializacion): `thing[]`, `link[]`, `state[]`, `opd[]`, `opdHierarchy`.

**Dependencias:**
- Bloqueada por: HU-70.008.
- Bloquea a: HU-70.010 (mapeo requiere la estructura extraida).

**Integraciones:**
- Kernel (`src/nucleo/`).
- Subsistema de importacion: adaptador nuevo tipo `src/adaptadores/opcat-import.ts` (nomenclatura sugerida).

**Notas de evidencia:**
- Fuente: §1, §6.1, §6.2.
- Clase de afirmacion: inferido (detalle del formato `.opx`) + observado (resultado final en el canvas).
- Etiqueta: `requires-clarification` (contrato exacto del `.opx` requiere acceso al SDK de OPCAT).

**Prioridad:** S.
**Tamano:** XL (parser nuevo, mapeo complejo).
**Etiquetas:** [interop, kernel, parsing, import-opcat, requires-clarification].

---

### HU-70.010 — Mapear tipos OPCAT a primitivas OPM canonicas

**Actor primario:** AD (autor de dominio).
**Actores secundarios:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** K primario; X secundario.
**Superficie UI:** ninguna directa.
**Gesto canonico:** ninguno (mapeo interno).

**Historia:**
> Como autor de dominio, quiero que el importador mapee cada constructo OPCAT a una primitiva OPM canonica del kernel para preservar la semantica OPM aunque cambien los identificadores de tipos.

**Contexto de negocio:**
OPCAT 4.2 y el kernel del modelador comparten la gramatica OPM (Thing, Process, Object, State, y los 6 link types estructurales + 4 procedurales). Los identificadores internos pueden diferir (ids, namespaces), pero la **semantica** es la misma. El mapeo es el puente. La SSOT OPM [V-1] [V-61] [V-239] define las primitivas destino; el adaptador traduce desde el vocabulario OPCAT.

**Criterios de aceptacion:**
- **Dado** que el parser extrajo una cosa de tipo `Process` OPCAT, **cuando** el mapeador la procesa, **entonces** crea una `thing` del kernel con `type=process`, `essence=<importado|default informatical>`, `affiliation=<importado|default systemic>`.
- **Dado** que el parser extrajo un link `Aggregation-Participation` OPCAT, **cuando** el mapeador lo procesa, **entonces** crea un `link` con `type=aggregation`, respetando source/target.
- **Dado** que el parser extrajo un state asociado a un object, **cuando** el mapeador lo procesa, **entonces** crea un `state` anidado al `thing` correspondiente.
- **Dado** que el parser extrajo un constructo OPCAT sin equivalente en el kernel (p.ej. un stereotype propietario, un constructo no-OPM), **cuando** el mapeador lo procesa, **entonces** registra una advertencia en el log de retipificacion (HU-70.025) y omite el constructo (no lo inventa).
- **Dado** que el mapeo define una convencion para essence/affiliation cuando no estan en el `.opx`, **cuando** el importador los asigna, **entonces** usa los defaults del kernel (`informatical`, `systemic`).

**Reglas y restricciones:**
- El mapeo es **lossy bajo control**: lo conservable se conserva, lo no-mapeable se descarta con advertencia (nunca silenciosamente).
- El mapeo vive en el adaptador; el kernel nunca conoce el vocabulario OPCAT.
- La semantica Agent/Instrument de OPM se preserva: si OPCAT marcaba un link como Agent, el importador produce `link.type=agent` (no lo reduce a Instrument).

**Modelo de datos tocado:**
- `thing`, `link`, `state`, `opd` — persistentes tras la importacion.
- Log de retipificacion — transitorio, consumido por HU-70.025.

**Dependencias:**
- Bloqueada por: HU-70.009.
- Bloquea a: HU-70.011, HU-70.012, HU-70.013.

**Integraciones:**
- Kernel.
- Log de retipificacion.

**Notas de evidencia:**
- Fuente normativa: [V-1] valores por defecto; [V-61] anatomia de enlace; [V-239] cinco familias canonicas.
- Fuente: §1 (hallazgo estrategico), §3.4, §6.1, §6.2.
- Clase de afirmacion: observado (existencia del mapeo) + inferido (tabla exacta de correspondencias, ya que OPCAT nativamente usa OPM).

**Prioridad:** S.
**Tamano:** L (contratos claros + tabla de mapeo + manejo de casos borde).
**Etiquetas:** [interop, kernel, mapeo, semantica].

---

### HU-70.011 — Reconstruir arbol OPD con sufijos in-zoomed / unfolded

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** K primario; V, L secundarios.
**Superficie UI:** opd-navigator.
**Gesto canonico:** ninguno (poblacion automatica post-import).

**Historia:**
> Como modelador, quiero ver el arbol completo de OPDs en el Navigator tras la importacion, con los nombres concatenando el mecanismo de refinamiento (`in-zoomed` o `unfolded`), para navegar la jerarquia del modelo legacy desde el primer instante.

**Contexto de negocio:**
OPCAT serializa no solo los OPDs sino tambien el **mecanismo** por el cual cada OPD hijo se origino (in-zoom vs unfolding). OPCloud visualiza ese mecanismo concatenandolo al nombre del refinable (ej. `Subsea Crude Oil & Gas Accessing in-zoomed`). Esta convencion es distintiva de la importacion OPCAT y aporta procedencia. La SSOT OPM define la jerarquia de OPDs pero no los sufijos de mecanismo — estos son convencion OPCloud.

**Criterios de aceptacion:**
- **Dado** que el `.opx` tenia cuatro OPDs hijos `SD1`, `SD1.1`, `SD1.2`, `SD1.3` con mecanismos in-zoom, **cuando** el importador materializa, **entonces** el Navigator muestra: `SD / SD1: <n1> in-zoomed / SD1.1: <n2> in-zoomed / SD1.2: <n3> in-zoomed / SD1.3: <n4> in-zoomed`.
- **Dado** que un OPD hijo se genero por unfolding en el origen, **cuando** aparece en el Navigator, **entonces** su nombre termina en ` unfolded`.
- **Dado** que el OPD raiz es `SD` (system diagram), **cuando** lo miro, **entonces** no tiene sufijo (es raiz, no refinamiento).
- **Dado** que el arbol se renderiza, **cuando** miro la indentacion, **entonces** refleja la profundidad real de la jerarquia del `.opx`.

**Reglas y restricciones:**
- Los sufijos `in-zoomed` / `unfolded` se persisten como parte del nombre del OPD en memoria tras la importacion (**pregunta abierta** Q70.10: si se mantienen al guardar nativo).
- El sufijo solo aplica a OPDs derivados de refinamiento, no a todos los OPDs.
- Si el modelador local decide normalizar nombres (omitir sufijos en OPDs nativos nuevos), debe documentar la divergencia de OPCloud.

**Modelo de datos tocado:**
- `opd.name` — string con sufijo — persistente.
- `opd.parentOpd` — ref — persistente.
- `opd.refinementMechanism` — `"in-zoom" | "unfolding" | null` — persistente.
- `opd.refinesThing` — ref al thing refinable — persistente.

**Dependencias:**
- Bloqueada por: HU-70.010.
- Bloquea a: HU-70.013 (OPL referencia OPDs por nombre), HU-70.014.

**Integraciones:**
- OPD Navigator (EPICA-20).
- Render del canvas (OPD activo).

**Notas de evidencia:**
- Fuente: §3.1 paso 7, §3.4, §7.3, §9.
- Frames: frame_00007, frame_00012.
- Clase de afirmacion: observado + hipotesis (persistencia en save nativo).
- Etiqueta: `requires-clarification` para Q70.10.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, navigator, arbol-opd, refinamiento].

---

### HU-70.012 — Poblar inventario Draggable OPM Things post-import

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** L.
**Superficie UI:** panel-biblioteca-lateral (Draggable OPM Things).
**Gesto canonico:** ninguno (lente automatica).

**Historia:**
> Como modelador, quiero ver todas las cosas del modelo importado listadas en la biblioteca lateral para inventariar el modelo y poder arrastrar instancias en OPDs nuevos.

**Contexto de negocio:**
La biblioteca lateral es **vista del modelo**, no paleta estatica. Tras la importacion debe reflejar la totalidad del inventario, con iconos que respetan el essence ya mapeado.

**Criterios de aceptacion:**
- **Dado** que el importador materializo N cosas, **cuando** se refresca la biblioteca, **entonces** aparecen N entradas, una por cada thing (no por apariencia).
- **Dado** que una cosa tiene `essence=physical`, **cuando** aparece en la biblioteca, **entonces** su icono refleja el glifo `physical` del modelador.
- **Dado** que una cosa tiene `essence=informatical`, **cuando** aparece en la biblioteca, **entonces** su icono refleja el glifo `informatical`.
- **Dado** que se populo la biblioteca, **cuando** hago scroll, **entonces** veo el inventario completo ordenado (orden exacto: **pregunta abierta** Q70.14 — probablemente alfabetico o por insercion).

**Reglas y restricciones:**
- La biblioteca es lente de la vista `thing[]` del modelo; no mantiene estado propio.
- Orden por defecto sujeto a decision del modelador local (el doc fuente no precisa).

**Modelo de datos tocado:**
- Ninguno (derivado de `thing[]`).

**Dependencias:**
- Bloqueada por: HU-70.010.

**Integraciones:**
- Kernel (lectura de `thing[]`).
- Biblioteca lateral (HU-10.017 como precedente de la mecanica).

**Notas de evidencia:**
- Fuente: §3.1 paso 8, §7.5.
- Frames: frame_00005.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, ui, biblioteca-lateral, lente].

---

### HU-70.013 — Regenerar OPL del modelo importado desde el kernel

**Actor primario:** MN.
**Tipo:** opm-semantica.
**Nivel categorico:** L primario; V secundario.
**Superficie UI:** opl-pane.
**Gesto canonico:** ninguno (lente automatica).

**Historia:**
> Como modelador, quiero ver el OPL del modelo importado regenerado por el modelador local (no transportado desde el `.opx`) para tener una sola fuente de verdad OPL consistente con mis convenciones.

**Contexto de negocio:**
El OPL es una **vista derivada** del modelo, no un atributo a transportar. Regenerarlo tras la importacion garantiza que:
- la numeracion sigue las convenciones del modelador local,
- el wording respeta la SSOT OPM local (ES-CL o EN segun setting),
- los sufijos `in-zoomed` / `unfolded` aparecen en las oraciones referentes a refinamientos.

La SSOT [OPL-ES] define el formato canonico de las oraciones OPL; siempre se regeneran desde el kernel, no se copian de fuente externa.

**Criterios de aceptacion:**
- **Dado** que el importador materializo el modelo, **cuando** se refresca el OPL pane, **entonces** aparecen oraciones OPL sintetizadas desde el modelo (no copiadas del `.opx`).
- **Dado** que una cosa tiene `essence=informatical` y `affiliation=systemic`, **cuando** miro el OPL, **entonces** la oracion es `<Nombre> is an informatical and systemic object.` (formato canonico, consistente con HU-10.016).
- **Dado** que hay un OPD con refinamiento in-zoom, **cuando** miro el OPL, **entonces** la oracion de zoom referencia el nombre con sufijo (ej. `Drilling & Inspecting in-zoomed1 zooms into ...`).
- **Dado** que el modelo importado fue guardado y se recarga, **cuando** el OPL se regenera, **entonces** es identico al OPL del momento post-import (invariante: OPL es puro derivado).

**Reglas y restricciones:**
- Nunca transportar OPL desde el `.opx`; siempre regenerar.
- Formato de oraciones: sigue el OPL renderer local (`src/render/opl-renderer.ts`).
- Idioma de las oraciones: setting del modelador local, no heredado del origen.

**Modelo de datos tocado:**
- Ninguno persistente (OPL es pura vista).

**Dependencias:**
- Bloqueada por: HU-70.010, HU-70.011.

**Integraciones:**
- OPL renderer (EPICA-50).
- Kernel (lectura del modelo).

**Notas de evidencia:**
- Fuente normativa: [OPL-ES] plantillas canonicas y convenciones tipograficas.
- Fuente: §3.1 paso 6-7, §6.1, §7.4.
- Frames: frame_00007, frame_00014.
- Clase de afirmacion: observado + inferido (mecanismo de regeneracion).

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, opl, kernel, lente].

---

### HU-70.014 — Cargar modelo importado como Model (Not Saved)

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** tab-superior.
**Gesto canonico:** ninguno (estado derivado).

**Historia:**
> Como modelador, quiero que el modelo importado quede como `Model (Not Saved)` en el tab superior para saber que debo guardarlo explicitamente si quiero persistirlo.

**Contexto de negocio:**
La importacion **no crea modelo guardado**: el resultado es volatil hasta que el usuario ejecuta `Save`. Senalizarlo en el tab evita perdida de datos por cierre accidental. La identidad del `.opx` origen (nombre del archivo) **no se hereda** al modelo: el usuario debe bautizar el modelo en el Save posterior.

**Criterios de aceptacion:**
- **Dado** que la importacion termino exitosamente, **cuando** miro el tab superior, **entonces** muestra `Model (Not Saved)`.
- **Dado** que el `.opx` se llamaba `Schilling 23.opx`, **cuando** hago `Save Model` despues, **entonces** el `Model Name` esta vacio en el dialogo (NO pre-carga `Schilling 23`).
- **Dado** que el tab esta en `Model (Not Saved)` post-import, **cuando** cierro la pestana sin guardar, **entonces** el modelo se pierde (advertencia previa cubierta en EPICA-30).

**Reglas y restricciones:**
- La identidad del `.opx` origen se descarta intencionalmente; el modelo importado es una instancia nueva bajo las reglas de persistencia del modelador.
- El tab `Model (Not Saved)` es el mismo marcador usado para `New Model` (simetria intencional).

**Modelo de datos tocado:**
- `model.name` — string — null/vacio tras importacion.
- `model.persisted` — boolean — false tras importacion.

**Dependencias:**
- Bloqueada por: HU-70.008.
- Bloquea a: HU-70.015.

**Integraciones:**
- Tab superior (UI transversal).
- EPICA-30 (Save / Load).

**Notas de evidencia:**
- Fuente: §2, §3.1 paso 8, §6.2, §9.
- Frames: frame_00015.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, ui, tab, persistencia-indicador].

---

### HU-70.015 — Guardar modelo importado con Save Model posterior

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** P primario; U secundario.
**Superficie UI:** dialogo `Save Model` (EPICA-30).
**Gesto canonico:** clic en `Save` de main toolbar + nombrar + confirmar.

**Historia:**
> Como modelador, quiero guardar el modelo importado via el flujo estandar `Save Model` para persistirlo como modelo nativo del modelador sin flujos especiales post-import.

**Contexto de negocio:**
El flujo post-import reutiliza el ciclo `Save` normal. Esta uniformidad reduce carga cognitiva: el usuario no aprende un flujo nuevo para persistir modelos importados; sigue el mismo patron que con un `New Model`.

**Criterios de aceptacion:**
- **Dado** que el modelo importado esta en memoria como `Model (Not Saved)`, **cuando** abro `Save` desde main toolbar, **entonces** se abre el dialogo `Save Model` estandar (EPICA-30).
- **Dado** que el dialogo esta abierto, **cuando** tecleo `Model Name` y confirmo, **entonces** el modelo se persiste bajo ese nombre con todas sus cosas, links, OPDs y convenciones mapeadas.
- **Dado** que guarde el modelo, **cuando** lo recargo desde `Load Model`, **entonces** vuelve a abrirse identico a lo que quedo tras la importacion (invariante de roundtrip kernel).
- **Dado** que guarde el modelo, **cuando** miro el tab, **entonces** cambia de `Model (Not Saved)` al nombre asignado.

**Reglas y restricciones:**
- El `Save Model` post-import es el unico camino observado para persistir; no hay "autosave post-import".
- El flujo respeta todas las reglas de EPICA-30 (colision de nombres, carpetas, versions).

**Modelo de datos tocado:**
- Se persisten todos los datos del modelo: `thing[]`, `link[]`, `state[]`, `opd[]`, `opdHierarchy`.

**Dependencias:**
- Bloqueada por: HU-70.014.
- Integra con: EPICA-30 (Save / Load).

**Integraciones:**
- EPICA-30 (Save Model).

**Notas de evidencia:**
- Fuente: §3.1 paso 9, §7.2.
- Frames: frame_00015.
- Clase de afirmacion: observado.

**Prioridad:** S.
**Tamano:** S (la mayoria del trabajo vive en EPICA-30; aqui solo se verifica integracion).
**Etiquetas:** [interop, persistencia, save, post-import].

---

### HU-70.016 — Cancelar Import desde fase vacia sin efectos

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (boton `CANCEL`, fase vacia).
**Gesto canonico:** clic en `CANCEL`.

**Historia:**
> Como modelador, quiero cerrar el modal Import sin efectos cuando aun no adjunte archivo para abortar el flujo sin consecuencias.

**Contexto de negocio:**
El usuario puede invocar `Import Model` por error o reconsiderar antes de adjuntar. `CANCEL` es la salida segura: cierra el modal y preserva el estado previo del workspace.

**Criterios de aceptacion:**
- **Dado** que el modal esta en fase vacia, **cuando** pulso `CANCEL`, **entonces** el modal se cierra.
- **Dado** que el modal se cerro por `CANCEL`, **cuando** miro el canvas, **entonces** el estado previo esta intacto (canvas vacio si era `New Model` o con el modelo previo si habia uno cargado).
- **Dado** que el modal se cerro por `CANCEL`, **cuando** miro el tab, **entonces** su contenido no cambio.

**Reglas y restricciones:**
- `CANCEL` no requiere confirmacion adicional.
- **Inferido**: `ESC` tambien cierra el modal (comportamiento estandar de dialogos del modelador).

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-70.002.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §4.1.
- Clase de afirmacion: observado + inferido (para ESC).

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [interop, ui, cancel].

---

### HU-70.017 — Cancelar Import tras adjuntar y descartar el archivo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (boton `CANCEL`, fase adjunta).
**Gesto canonico:** clic en `CANCEL`.

**Historia:**
> Como modelador, quiero cancelar la importacion despues de adjuntar un archivo para descartar el adjunto sin subirlo al backend.

**Contexto de negocio:**
Adjuntar no es equivalente a "subir"; el archivo sigue local en el navegador hasta que se pulsa `IMPORT`. `CANCEL` en fase adjunta descarta el adjunto transitoriamente sin tocar el backend.

**Criterios de aceptacion:**
- **Dado** que el modal esta en fase adjunta, **cuando** pulso `CANCEL`, **entonces** el modal se cierra y el adjunto se descarta.
- **Dado** que el modal se cerro con adjunto descartado, **cuando** vuelvo a abrir `Import Model`, **entonces** el modal vuelve a estar en fase vacia (no conserva el adjunto previo).
- **Dado** que el `.opx` estaba listo pero cancelo, **cuando** verifico el backend (si aplica), **entonces** NO hay residuo subido (el upload no ocurrio).

**Reglas y restricciones:**
- El archivo no se sube al backend hasta que el usuario pulsa `IMPORT` (**inferido** por §4.2).
- No hay "adjuntos persistentes" entre aperturas del modal.

**Modelo de datos tocado:**
- Ninguno persistente.

**Dependencias:**
- Bloqueada por: HU-70.005.

**Integraciones:**
- Ninguna.

**Notas de evidencia:**
- Fuente: §4.2.
- Clase de afirmacion: inferido.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [interop, ui, cancel, descarte].

---

### HU-70.018 — Ver modal de error con IMPORT deshabilitado y boton DOWNLOAD LOG en rojo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (estado error).
**Gesto canonico:** ninguno (render automatico tras falla de parsing).

**Historia:**
> Como modelador, quiero ver un estado de error explicito en el modal cuando la importacion falla para identificar el problema y decidir los siguientes pasos.

**Contexto de negocio:**
El camino de error tiene su propio vocabulario visual: `IMPORT` gris deshabilitado, `DOWNLOAD LOG` en rojo (unico uso de rojo como estado de boton en el corpus) y `OK` neutral. Distinguir el estado por color permite al usuario identificar la falla sin leer el texto.

**Criterios de aceptacion:**
- **Dado** que la importacion fallo, **cuando** el modal persiste tras el intento, **entonces** los botones al pie cambian a: `IMPORT` gris deshabilitado / `DOWNLOAD LOG` rojo habilitado / `OK` neutral habilitado.
- **Dado** que estoy en el estado de error, **cuando** miro el bloque superior, **entonces** el `File Name / File Size` del archivo que fallo sigue visible (no se limpia).
- **Dado** que estoy en el estado de error, **cuando** miro el bloque `Attention`, **entonces** sigue visible con el texto de restriccion.
- **Dado** que la importacion fallo parcialmente (**escenario anomalo §3.3**), **cuando** el modal esta en error, **entonces** el canvas de fondo puede mostrar render parcial del modelo (comportamiento a documentar y evaluar replicar o evitar en el modelador local; ver Q70.1).

**Reglas y restricciones:**
- Rojo del boton `DOWNLOAD LOG` es convencion observada; el modelador local debe adoptarlo o justificar divergencia.
- El modal NO se cierra automaticamente en error: el usuario debe elegir `DOWNLOAD LOG` o `OK`.
- El render parcial en error (observado) se considera **hipotesis arquitectonica discutible**: el modelador local puede preferir transactional all-or-nothing (recomendado).

**Modelo de datos tocado:**
- Log de error (transitorio, descargable via HU-70.019).

**Dependencias:**
- Bloqueada por: HU-70.008.
- Bloquea a: HU-70.019, HU-70.020.

**Integraciones:**
- Log del parser.

**Notas de evidencia:**
- Fuente: §2, §3.3, §4.4, §9.
- Frames: frame_00012.
- Clase de afirmacion: observado + hipotesis (render parcial en error).

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [interop, ui, error, modal].

---

### HU-70.019 — Descargar log de error con DOWNLOAD LOG

**Actor primario:** ME (experto) / AD.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U secundario.
**Superficie UI:** modal-import-opcat (estado error) + descarga del navegador.
**Gesto canonico:** clic en `DOWNLOAD LOG`.

**Historia:**
> Como modelador experto, quiero descargar un log de la importacion fallida para diagnosticar el problema y decidir si corregir el `.opx` origen, reportar el bug, o abandonar la importacion.

**Contexto de negocio:**
`DOWNLOAD LOG` es la unica pista de diagnostico disponible para el usuario cuando la importacion falla. Sin el, el camino de error seria opaco. El log debe ser legible sin herramientas especiales.

**Criterios de aceptacion:**
- **Dado** que el modal esta en estado de error, **cuando** pulso `DOWNLOAD LOG`, **entonces** se descarga un archivo con el log del parser al disco del usuario.
- **Dado** que descargue el log, **cuando** lo abro, **entonces** contiene al menos: nombre del archivo origen, timestamp, causa principal del fallo, trazas de parseo por seccion fallida.
- **Dado** que descargue el log, **cuando** el modal sigue abierto, **entonces** puedo seguir con `OK` para cerrar o reintentar descargar.

**Reglas y restricciones:**
- Formato del log: **pregunta abierta** (Q70.6) — candidatos razonables: texto plano, JSON estructurado. El modelador local debe elegir y documentar.
- Nombre del archivo descargado: `import-log-<timestamp>.txt` (nomenclatura sugerida, no observada).
- El log NO debe incluir datos sensibles del `.opx` completo (solo metadatos de error).

**Modelo de datos tocado:**
- Log generado por el parser — transitorio hasta descarga.

**Dependencias:**
- Bloqueada por: HU-70.018.

**Integraciones:**
- API de descarga del navegador (blob + URL.createObjectURL).

**Notas de evidencia:**
- Fuente: §3.3, §5.3, §6.3, §11 pregunta 6.
- Frames: frame_00012.
- Clase de afirmacion: observado (existencia del boton) + abierto (formato exacto del log).
- Etiqueta: `requires-clarification`.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [interop, error, log, diagnostico, requires-clarification].

---

### HU-70.020 — Cerrar modal de error con OK sin persistir nada

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** modal-import-opcat (estado error, boton `OK`).
**Gesto canonico:** clic en `OK`.

**Historia:**
> Como modelador, quiero cerrar el modal de error con OK para abandonar el intento sin que el modelo parcial (si lo hubo) contamine mi workspace.

**Contexto de negocio:**
El boton `OK` en error es el "acknowledge + cerrar". No reintenta, no descarga log, solo cierra. Es la salida mas rapida si el usuario quiere abandonar la importacion.

**Criterios de aceptacion:**
- **Dado** que el modal esta en estado de error, **cuando** pulso `OK`, **entonces** el modal se cierra.
- **Dado** que el modal se cerro por `OK`, **cuando** miro el canvas, **entonces** NO persiste ningun rastro de la importacion fallida (decision de arquitectura local: transactional rollback del render parcial si hubo).
- **Dado** que el modal se cerro por `OK`, **cuando** miro el tab, **entonces** sigue en el estado previo al intento (si era `New Model`, sigue vacio; si habia modelo previo, sigue ese).

**Reglas y restricciones:**
- `OK` en este contexto NO confirma ni persiste nada — es equivalente semantico a "cerrar acknowledging el error".
- La decision de hacer rollback transactional del render parcial (anulando §3.3 observado) es recomendacion del modelador local por coherencia atomica.

**Modelo de datos tocado:**
- Ninguno persistente (si hubo render parcial, se revierte).

**Dependencias:**
- Bloqueada por: HU-70.018.

**Integraciones:**
- Rollback del kernel (si hubo render parcial).

**Notas de evidencia:**
- Fuente: §2, §3.3 paso 4, §4.4.
- Frames: frame_00012.
- Clase de afirmacion: observado (boton) + decision arquitectonica local (rollback).

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [interop, ui, error, cerrar].

---

### HU-70.021 — Rechazar archivo de version OPCAT incompatible

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** X primario; U secundario.
**Superficie UI:** modal-import-opcat (estado error tras validacion de version).
**Gesto canonico:** clic en `IMPORT` con archivo de version distinta.

**Historia:**
> Como modelador, quiero que el sistema rechace explicitamente archivos `.opx` de versiones OPCAT distintas a 4.2 para no generar un modelo silenciosamente corrupto.

**Contexto de negocio:**
La restriccion `OPCAT 4.2` aparece en el bloque `Attention` pero el doc fuente no documenta el comportamiento exacto ante versiones distintas. El modelador local debe **elegir**: rechazo explicito con mensaje claro, o intento best-effort con warnings. Se recomienda rechazo explicito para evitar datos corruptos silenciosos.

**Criterios de aceptacion:**
- **Dado** que adjunte un `.opx` de OPCAT 4.1 o 4.3 (version distinta a 4.2), **cuando** pulso `IMPORT`, **entonces** el parser detecta la version, falla y entrega un log con `ERROR: version OPCAT <X> no soportada, requerido OPCAT 4.2`.
- **Dado** que el parser rechazo por version, **cuando** el modal entra en estado de error, **entonces** el usuario puede descargar el log y cerrar con `OK`.
- **Dado** que adjunte un `.opx` de OPCAT 4.2 valido, **cuando** pulso `IMPORT`, **entonces** el parser procede sin advertencia de version.
- **Dado** que el `.opx` no declara version en su metadata, **cuando** el parser intenta inferir, **entonces** trata como "version desconocida" y el comportamiento es rechazo (**decision arquitectonica conservadora**).

**Reglas y restricciones:**
- Preferir rechazo explicito sobre silent best-effort.
- La validacion de version ocurre lo mas temprano posible en el parsing (antes de materializar).
- **Pregunta abierta** Q70.5: si OPCloud actual es silencioso o rechaza; el modelador local debe decidir y documentar.

**Modelo de datos tocado:**
- Ninguno (aborta antes de materializar).

**Dependencias:**
- Bloqueada por: HU-70.008.
- Integra con: HU-70.018, HU-70.019.

**Integraciones:**
- Parser con validacion de version.

**Notas de evidencia:**
- Fuente: §2, §5.1, §11 pregunta 5.
- Clase de afirmacion: abierto (comportamiento exacto no observado).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [interop, validacion, version, requires-clarification].

---

### HU-70.022 — Rechazar archivo no-.opx desde el selector

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X secundario.
**Superficie UI:** file picker del SO + modal-import-opcat.
**Gesto canonico:** intento de adjuntar archivo con extension distinta a `.opx`.

**Historia:**
> Como modelador, quiero que el file picker filtre a `.opx` (o rechace archivos de otra extension) para no adjuntar por error un `.pdf`, `.csv` o `.opl`.

**Contexto de negocio:**
Filtrar la extension en el file picker es la primera linea de defensa contra adjuntos equivocados. Ahorra el ciclo completo de upload + parsing + error.

**Criterios de aceptacion:**
- **Dado** que abro el file picker desde el pill `Import OPX Model`, **cuando** el picker se abre, **entonces** el filtro por defecto es `*.opx` (con opcion de "All files" accesible si el usuario insiste).
- **Dado** que el usuario cambia el filtro a "All files" y adjunta un `.pdf`, **cuando** el modal recibe el adjunto, **entonces** detecta la extension invalida y rechaza con mensaje (ya sea bloqueando el attach o en validacion al pulsar IMPORT).
- **Dado** que adjunte un archivo con extension `.opx` pero contenido corrupto, **cuando** pulso `IMPORT`, **entonces** el parser falla y entra en estado de error (HU-70.018) — validacion de extension es solo preliminar.

**Reglas y restricciones:**
- El filtro del picker es orientativo; la validacion real es del parser.
- El modelador local puede implementar validacion MIME si desea robustez adicional.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloqueada por: HU-70.005.
- Integra con: HU-70.018 (error).

**Integraciones:**
- API File picker con filtro por extension.

**Notas de evidencia:**
- Fuente: §2, §11 pregunta 4.
- Clase de afirmacion: abierto (comportamiento exacto no observado).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [interop, validacion, tipo-archivo, requires-clarification].

---

### HU-70.023 — Re-abrir Import OPCAT sobre modelo ya cargado

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** main-menu + modal-import-opcat sobre canvas poblado.
**Gesto canonico:** clic en `Import Model` con modelo ya cargado.

**Historia:**
> Como modelador, quiero invocar Import OPCAT con un modelo ya cargado en el canvas para encadenar imports sucesivos (p.ej. procesar un batch manual).

**Contexto de negocio:**
El flujo 3.2 del doc fuente observa al usuario re-abriendo el modal sobre un canvas ya poblado con una importacion anterior. La pregunta abierta Q70.2 senala la ambiguedad: ¿la nueva importacion reemplaza el canvas actual, abre un tab nuevo, o merge? Decision arquitectonica critica.

**Criterios de aceptacion:**
- **Dado** que hay un modelo cargado (importado o nativo) en el canvas, **cuando** pulso `Import Model` desde el main menu, **entonces** el modal se abre en fase vacia, con el canvas de fondo visible al ~45%.
- **Dado** que el modelo de fondo era `Model (Not Saved)`, **cuando** completo una nueva importacion, **entonces** el canvas se reemplaza (comportamiento observado, **destructivo**).
- **Dado** que el modelo de fondo **estaba guardado**, **cuando** completo una nueva importacion, **entonces** el modelador local debe decidir (**pregunta abierta** Q70.2): (a) reemplaza el tab activo pidiendo confirmacion previa, o (b) abre un tab nuevo.
- **Dado** que el modelo de fondo tenia cambios sin guardar, **cuando** intento importar, **entonces** aparece advertencia de descarte (HU-70.024).

**Reglas y restricciones:**
- Recomendacion local: abrir tab nuevo si hay tabs multiples; confirmar descarte si solo hay un tab con cambios.
- Flujo batch no observado en el corpus; se infiere como casos de uso secundarios.

**Modelo de datos tocado:**
- `workspace.tabs` — estructura transversal al modelador (probablemente EPICA-30).

**Dependencias:**
- Bloqueada por: HU-70.001, HU-70.008.
- Relaciona: HU-70.024 (confirmacion descarte).

**Integraciones:**
- Gestion de tabs / workspace.

**Notas de evidencia:**
- Fuente: §3.2, §11 pregunta 2.
- Frames: frame_00010, frame_00011.
- Clase de afirmacion: observado (reapertura) + abierto (politica de tab).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [interop, ui, reapertura, requires-clarification].

---

### HU-70.024 — Advertir antes de descartar cambios no guardados al importar

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** modal de confirmacion intermedio + modal-import-opcat.
**Gesto canonico:** intento de import sobre tab con cambios no guardados.

**Historia:**
> Como modelador, quiero recibir una advertencia antes de descartar cambios sin guardar al invocar una importacion para no perder trabajo por error.

**Contexto de negocio:**
El flujo OPCloud observado NO muestra prompt "¿descartar cambios?" (Q70.3 abierta). Implementar esta advertencia en el modelador local es una **mejora de seguridad** sobre el comportamiento observado; protege al usuario de perdida accidental. Es un principio general de proteccion de datos, no especifico de OPCloud ni regulado por SSOT.

**Criterios de aceptacion:**
- **Dado** que el tab activo esta marcado `Model (Not Saved)` con contenido, **cuando** pulso `Import Model`, **entonces** aparece un prompt: "Hay cambios sin guardar. ¿Descartarlos y continuar con la importacion?" con botones `Descartar e Importar` / `Guardar antes` / `Cancelar`.
- **Dado** que el tab activo esta guardado **y sin cambios pendientes**, **cuando** pulso `Import Model`, **entonces** el modal abre directo (sin prompt).
- **Dado** que elijo `Descartar e Importar`, **cuando** el prompt se cierra, **entonces** se abre el modal `Import OPCAT Model` (HU-70.002).
- **Dado** que elijo `Guardar antes`, **cuando** el prompt se cierra, **entonces** se abre `Save Model` (EPICA-30); tras guardar, retorna al flujo de importacion.
- **Dado** que elijo `Cancelar`, **cuando** el prompt se cierra, **entonces** no ocurre la importacion.

**Reglas y restricciones:**
- Este prompt es una **mejora** sobre el comportamiento observado en OPCloud; documentar la decision como divergencia intencional.
- La deteccion de "cambios sin guardar" requiere flag `dirty` en el modelo (ver EPICA-30).

**Modelo de datos tocado:**
- `model.dirty` — boolean — transitorio.

**Dependencias:**
- Bloqueada por: HU-70.001, HU-70.023.
- Integra con: EPICA-30 (save).

**Integraciones:**
- Flag dirty del modelo.

**Notas de evidencia:**
- Fuente: §4.3, §11 pregunta 3.
- Clase de afirmacion: abierto (comportamiento OPCloud) + decision local (agregar prompt).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [interop, ui, confirmacion, requires-clarification].

---

### HU-70.025 — Emitir advertencia de retipificacion post-import

**Actor primario:** AD.
**Actores secundarios:** ME.
**Tipo:** mixto.
**Nivel categorico:** X primario; L, U secundarios.
**Superficie UI:** panel lateral o toast post-import.
**Gesto canonico:** ninguno (advertencia automatica).

**Historia:**
> Como autor de dominio, quiero ver una advertencia explicita de que se mapeo, que se degrado y que se descarto al importar un `.opx` para auditar la fidelidad de la importacion sin tener que comparar modelos visualmente.

**Contexto de negocio:**
El doc fuente §3.4 documenta que **OPCloud retipifica silenciosamente** el modelo importado: cambia tipografia, colores, sombras, degrada triangulos estructurales, deja digitos huerfanos, anade sufijos `in-zoomed`/`unfolded`. El usuario **no recibe feedback** de estos cambios. Para el modelador local se recomienda **ruptura intencional con OPCloud**: hacer transparente el mapeo y la perdida. No es requisito SSOT ni OPCloud — es principio de transparencia del modelador local.

**Criterios de aceptacion:**
- **Dado** que el importador termino exitosamente, **cuando** se completa la importacion, **entonces** se abre un panel lateral o toast con resumen: `Importadas N cosas, M links, K OPDs. Advertencias: <lista>`.
- **Dado** que hubo constructos OPCAT no mapeables, **cuando** reviso las advertencias, **entonces** veo lineas como `Constructo desconocido <tipo> en <ubicacion>: descartado`.
- **Dado** que algun triangulo del `.opx` no pudo decodificar su tipo estructural (agregacion, exhibicion, etc.), **cuando** reviso las advertencias, **entonces** veo `Triangulo con tipo ambiguo en <opd>: mapeado como outline-only, revisar semantica`.
- **Dado** que la importacion fue completa sin perdidas, **cuando** reviso el panel, **entonces** confirma `Sin perdidas detectadas`.
- **Dado** que el panel es descartable, **cuando** lo cierro, **entonces** queda accesible desde un item `Ver log de import` en algun menu o tab (**pregunta abierta** Q70.15 para ubicacion exacta).

**Reglas y restricciones:**
- Esta HU es **ruptura intencional con OPCloud**: OPCloud NO muestra advertencias (§3.4 explicito).
- El log de retipificacion complementa al log de error (HU-70.019): el primero es para imports exitosos pero con perdidas, el segundo para imports fallidos.
- La decision de hacer transparente el mapeo es consistente con los principios de la constitucion categorica (§ funtores explicitos, no silenciosos).

**Modelo de datos tocado:**
- `importReport` — estructura transitoria con contadores y advertencias — persistente mientras el modelo no se guarde; opcional al guardar.

**Dependencias:**
- Bloqueada por: HU-70.010.

**Integraciones:**
- Panel lateral / toast (UI transversal).
- Logging del mapeador.

**Notas de evidencia:**
- Fuente: §1 (hallazgo estrategico), §3.4, §5.2, §9.
- Frames: frame_00005, frame_00007, frame_00009 (baseline de contraste), frame_00014.
- Clase de afirmacion: observado (retipificacion silenciosa en OPCloud) + decision local (transparencia).
- Etiqueta: `mejora-sobre-opcloud`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [interop, diff, retipificacion, transparencia].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q70.1**: Render parcial en estado de error (frame_00012). ¿El modelador local debe replicar el comportamiento OPCloud o preferir rollback transactional? Recomendacion local: rollback (HU-70.020). Resolver con diseno.
- **Q70.2**: Politica de tabs al invocar Import sobre modelo guardado: ¿reemplaza o abre tab nuevo? Sin evidencia directa (HU-70.023).
- **Q70.3**: OPCloud no muestra prompt de descarte de cambios no guardados. Decidir si el modelador local lo implementa (HU-70.024 propone SI).
- **Q70.4**: Filtro de tipo de archivo en el selector OS — no observado (HU-70.022). Decidir filtro `.opx` by default con fallback.
- **Q70.5**: Comportamiento ante versiones distintas a OPCAT 4.2 — no documentado (HU-70.021). Recomendacion local: rechazo explicito.
- **Q70.6**: Formato del log de error (texto plano, JSON, XML) — no observado (HU-70.019). Decidir formato legible + machine-readable.
- **Q70.7**: Export inverso a `.opx` — no observado. **Hipotesis**: unidireccional. No cubierto por esta epica.
- **Q70.8**: Nombres con espacios y caracteres especiales — observados aceptados (`& _` en nombres). **Inferido** sin restriccion.
- **Q70.9**: Tamano maximo de `.opx` — no observado. Decision local: posible limite pragmatico (p.ej. 50 MB) con feedback claro al exceder.
- **Q70.10**: Persistencia de los sufijos `in-zoomed`/`unfolded` al guardar nativo (HU-70.011). Decidir: ¿se conservan literalmente o se derivan del mecanismo?
- **Q70.11**: Link `OPCAT Installation` — administrable vs hardcoded (HU-70.004). Probablemente hardcoded en el modelador local.
- **Q70.12**: Batch import en sesion unica — no observado claramente; HU-70.023 cubre parcial; queda abierto si se soporta multiples archivos en una sola invocacion del modal.
- **Q70.13**: Feedback de progreso durante importacion (spinner/barra) — no observado (HU-70.008). Recomendacion: spinner al menos para archivos > 1MB.
- **Q70.14**: Orden del inventario en la biblioteca lateral post-import (HU-70.012). Decidir: alfabetico vs orden de insercion.
- **Q70.15**: Ubicacion del acceso al log de retipificacion post-import (HU-70.025). Propuesta: item en `Model ▸ Import History` o similar.

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/70-interop-opcat.md`.
- Epicas que se conectan con esta:
  - **EPICA-30** (persistencia-save-load): el flujo post-import `Save Model` reutiliza el dialogo completo.
  - **EPICA-20** (estructura-opd-tree): la jerarquia importada se refleja en el Navigator con sufijos `in-zoomed`/`unfolded`.
  - **EPICA-50** (opl-pane): el OPL se regenera localmente tras la importacion (no se transporta).
  - **EPICA-10** (canvas-creacion-cosas) a **EPICA-1C** (canvas-validaciones): las convenciones de render del modelador se aplican al modelo importado.
  - **EPICA-71** (interop-csv): importacion analoga para CSV; probable reutilizacion del shell de dialogo.
  - **EPICA-60, EPICA-61** (exports): un modelo importado exporta por los mismos canales que un modelo nativo.
- Invariantes del repo:
  - `src/nucleo/` (kernel inmutable): el importador debe mapear a primitivas K; no puede inventar primitivas nuevas (ver `docs/ARQUITECTURA-CATEGORICA.md`).
  - `src/adaptadores/` (nuevo subsistema sugerido): el parser `.opx` + mapeador OPCAT→OPM vive aqui para no contaminar kernel ni render.
  - `src/render/opl-renderer.ts`: regenera OPL post-import.
  - `src/persistencia/`: integra con el ciclo Save del modelo importado.
- Constitucion categorica: el importador es un **funtor de ingreso** desde la categoria `OPCAT-SCHEMA` hacia la categoria `OPM-KERNEL`. Lossy por definicion (no todas las estructuras OPCAT tienen equivalente en el kernel); documentar la perdida es invariante (HU-70.025). Ver `docs/ARQUITECTURA-CATEGORICA.md` §funtores.
- SSOT OPM (`ssot/opm-*.md`): el modelo post-import debe ser conforme a la SSOT; si el `.opx` viola la SSOT, el importador debe normalizar o rechazar (decision a tomar por caso). La SSOT no prescribe el formato de importacion; esta epica recoge la implementacion observada en OPCloud como referencia.
