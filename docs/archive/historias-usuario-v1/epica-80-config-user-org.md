---
epica: "EPICA-80"
titulo: "Config — gestion de usuarios, grupos y organizacion (OPCloud Settings administrativo)"
doc_fuente: "opcloud-reverse/80-config-user-org.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "C"
hu_emitidas: 26
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
metodologia_revision: "DIAGNOSTICO-PILOTO-EPICA-10.md"
---

## Resumen

Esta epica cubre la **seccion administrativa** del menu `Settings` de OPCloud: entrada a la pagina, gestion del perfil propio, gestion de usuarios (administrador), gestion de grupos y subgrupos, gestion de organizacion, defaults organizacionales, reglas de precedencia usuario-vs-organizacion, roles y visibilidad cross-organizacion. Excluye explicitamente la parte visual/estilistica de `Settings` (cubierta por EPICA-81), la ontologia organizacional (EPICA-82), los permisos por modelo/carpeta (EPICA-40, EPICA-31) y las metricas de `Analyze Model` (EPICA-D0, EPICA-D1).

El corpus de reverse tiene una asimetria importante: el perfil propio del modelador regular esta completamente observado (frames 00008, 00025, 00028) mientras que las paginas `Group Management` y `Organization Management` solo estan **inferidas** desde la narracion de Intro 13 y referencias cruzadas (Intro 11, 24, 25, 27, 28, 36). Todas las HU derivadas de esas paginas llevan la etiqueta `requires-clarification` y clase de afirmacion `inferido` o `hipotesis`. Esto no bloquea el inventariado: mantiene la trazabilidad honesta y delimita el backlog activable.

La prioridad predominante es **C (Could-have)** porque la gestion administrativa no es prerequisito para que exista el modelador OPM core — se usa cuando el producto llega a multiusuario organizacional. Hay un bloque pequeno de HU **M1** (apertura de Settings, perfil propio, indicador de identidad) por ser friccion minima sin la cual el modelador regular pierde orientacion, y varias **W** para flujos que dependen de infra externa (SSO, auditoria).

Las HU se numeran siguiendo la aparicion en el doc fuente §2 (estructura), §3 (flujos), §6 (modelo de datos), §7 (integraciones).

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-80.001 | Abrir Settings desde Main Menu | MN | M1 | XS | opcloud-ui | — |
| HU-80.002 | Abrir Settings desde boton engranaje del canvas | MN | M1 | XS | opcloud-ui | — |
| HU-80.003 | Volver al canvas con boton Back sin perder el modelo | MN | M1 | XS | opcloud-ui | — |
| HU-80.004 | Ver panel lateral de Settings con grupos administrativos | MN | M1 | S | opcloud-ui | — |
| HU-80.005 | Ver badge de identidad `Full Name / Organization` en canvas | MN | M1 | XS | opcloud-ui | — |
| HU-80.006 | Actualizar Full Name desde Update My Profile | MN | C | S | mixto | — |
| HU-80.007 | Cambiar foto de perfil subiendo archivo local | MN | C | S | mixto | — |
| HU-80.008 | Cambiar foto de perfil pegando URL externa | MN | C | S | mixto | — |
| HU-80.009 | Ver Expiration Date del perfil propio como read-only | MN | C | XS | mixto | — |
| HU-80.010 | Reset Password propio con envio de email | MN | C | S | mixto | — |
| HU-80.011 | Deshabilitar Reset Password bajo SSO activo | MN | W | XS | mixto | — |
| HU-80.012 | Ajustar Autosave Time Interval con Save por-campo | ME | C | XS | opcloud-ui | — |
| HU-80.013 | Ajustar Time Precision decimal places | IS | C | XS | opcloud-ui | — |
| HU-80.014 | Alternar Log Sharing Enabled/Disabled | MN | C | XS | opcloud-ui | — |
| HU-80.015 | Ocultar Group/Organization Management a usuarios sin rol administrador | AO | C | S | mixto | — |
| HU-80.016 | Crear nuevo usuario desde Organization Management | AO | C | M | mixto | — |
| HU-80.017 | Editar usuario existente (Full Name, Email, Expiration) | AO | C | M | mixto | — |
| HU-80.018 | Fijar Expiration Date concreta a un usuario | AO | C | S | mixto | — |
| HU-80.019 | Desactivar usuario sin borrar historial | AO | C | S | mixto | — |
| HU-80.020 | Crear grupo en Group Management | AO | C | M | mixto | — |
| HU-80.021 | Anadir/quitar usuarios de un grupo | AO | C | S | mixto | — |
| HU-80.022 | Anidar subgrupos dentro de un grupo padre | AO | C | M | mixto | — |
| HU-80.023 | Ver grupo raiz sintetico `<Org> All Users` | AO | C | XS | mixto | — |
| HU-80.024 | Configurar defaults de organizacion (essence, OPD tree, ontology) | AO | C | M | mixto | — |
| HU-80.025 | Heredar defaults de organizacion con override por-usuario | MN | C | M | mixto | — |
| HU-80.026 | Impedir visibilidad cross-organizacion de usuarios/grupos | AO | C | S | mixto | — |

Total: **26 historias de usuario** (8 opcloud-ui, 18 mixto).

## Historias de usuario

### HU-80.001 — Abrir Settings desde Main Menu

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME, AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C (config) secundario.
**Superficie UI:** main-menu (hamburguesa ≡) + pagina-settings.
**Gesto canonico:** clic en entrada `OPCloud Settings` del menu.

**Historia:**
> Como modelador, quiero abrir la pagina Settings desde el Main Menu del canvas para acceder a mi configuracion personal sin buscarla en otro lugar.

**Contexto de negocio:**
El Main Menu es el punto de entrada canonico a acciones globales del producto. Exponer `OPCloud Settings` ahi es la via predecible — coincide con la expectativa de "mi perfil / mis preferencias" en herramientas SaaS. Corresponde a la primera de las dos rutas declaradas en transcripcion Intro 13.

**Criterios de aceptacion:**
- **Dado** que estoy en el canvas, **cuando** abro el Main Menu (≡), **entonces** veo la entrada `OPCloud Settings`.
- **Dado** que el Main Menu esta abierto, **cuando** hago clic en `OPCloud Settings`, **entonces** se abre la pagina `Settings` a pantalla completa reemplazando el canvas.
- **Dado** que se abrio `Settings`, **cuando** miro el panel lateral, **entonces** esta colapsado con los grupos visibles segun mi rol (ver HU-80.004).
- **Dado** que abri Settings, **cuando** inspecciono la URL/ruta interna, **entonces** es independiente de la URL del modelo que tenia abierto (no pierde el modelo, ver HU-80.003).

**Reglas y restricciones:**
- El acceso desde Main Menu es equivalente al del engranaje (HU-80.002).
- El modelo abierto antes de entrar a Settings permanece en memoria; Settings no lo descarta.

**Modelo de datos tocado:**
- Ninguno persistente; solo estado de navegacion UI.

**Dependencias:**
- Bloquea a: HU-80.004, HU-80.006–HU-80.014.

**Integraciones:**
- Main Menu (nav global).
- Estado del modelo abierto (se preserva).

**Notas de evidencia:**
- Fuente: `opcloud-reverse/80-config-user-org.md` §2.1.
- Transcripcion Intro 13: "we can go from the main menu clicking on OPCloud settings".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [config, ui, navigation, main-menu].

---

### HU-80.002 — Abrir Settings desde boton engranaje del canvas

**Actor primario:** MN.
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U.
**Superficie UI:** canvas (esquina superior derecha, boton engranaje).
**Gesto canonico:** clic en icono engranaje.

**Historia:**
> Como modelador, quiero abrir Settings con un clic en el engranaje junto a mi nombre para acceder a la configuracion sin desplegar el Main Menu.

**Contexto de negocio:**
El engranaje es el atajo visual directo. Su proximidad al badge `<Full Name> / <Organization>` lo hace descubrible por afordancia visual. Es la segunda ruta declarada en transcripcion Intro 13 y complementa el Main Menu.

**Criterios de aceptacion:**
- **Dado** que estoy en el canvas, **cuando** miro la esquina superior derecha, **entonces** veo el badge de identidad y un icono engranaje adyacente.
- **Dado** que el engranaje esta visible, **cuando** hago clic, **entonces** se abre la misma pagina `Settings` que por HU-80.001.
- **Dado** que abri Settings via engranaje, **cuando** comparo con la apertura por Main Menu, **entonces** ambas cargan identica pagina y estado inicial.

**Reglas y restricciones:**
- El engranaje siempre esta visible; no tiene estado disabled.
- El clic es clic simple, no requiere doble clic ni modificador.

**Modelo de datos tocado:**
- Ninguno.

**Dependencias:**
- Bloquea a: HU-80.004 y siguientes.

**Integraciones:**
- Canvas header.

**Notas de evidencia:**
- Fuente: §2.1.
- Frames: frame_00001, frame_00003.
- Transcripcion Intro 13: "clicking on the gear button near the name of your modeler".
- Clase de afirmacion: confirmado por transcripcion + observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [config, ui, navigation, shortcut, engranaje].

---

### HU-80.003 — Volver al canvas con boton Back sin perder el modelo

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (persistencia del estado del modelo) secundario.
**Superficie UI:** pagina-settings (cabecera: `← Back`).
**Gesto canonico:** clic en `← Back`.

**Historia:**
> Como modelador, quiero volver al canvas con el boton Back sin perder el modelo que tenia abierto para retomar el trabajo donde lo deje.

**Contexto de negocio:**
Entrar a Settings debe ser una excursion reversible. El modelo abierto, su zoom, seleccion, OPD activa y cambios sin guardar deben sobrevivir la visita a configuracion. La pagina Settings es una vista overlay logica, no una carga de ruta que descarte estado.

**Criterios de aceptacion:**
- **Dado** que tengo un modelo abierto con cambios no guardados, **cuando** entro a Settings y luego hago clic en `← Back`, **entonces** vuelvo al canvas con el modelo, OPD activa, zoom y seleccion intactos.
- **Dado** que el modelo tenia indicador `Model (Not Saved)`, **cuando** vuelvo del Settings, **entonces** el indicador sigue presente (ver HU-10.022).
- **Dado** que modifique algun parametro en Settings y confirme, **cuando** vuelvo al canvas, **entonces** el efecto del parametro aplica (p.ej. nuevo intervalo de autosave queda activo).

**Reglas y restricciones:**
- Back nunca destruye el modelo in-memory.
- No hay confirmacion de "salir de Settings sin guardar" aunque haya campos con cambios pendientes — ver HU-80.012 sobre guardado por-campo y §4.4 del doc fuente.

**Modelo de datos tocado:**
- Estado volatil del modelo abierto (no persistente) — preservar.

**Dependencias:**
- Bloqueada por: HU-80.001 o HU-80.002.

**Integraciones:**
- Estado de navegacion UI.
- Runtime del modelo.

**Notas de evidencia:**
- Fuente: §2.1 tabla ("cierra la pagina y devuelve al canvas sin perder el modelo abierto").
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [config, ui, navigation, back, reversible].

---

### HU-80.004 — Ver panel lateral de Settings con grupos administrativos

**Actor primario:** MN.
**Actores secundarios:** ME, AO.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; C secundario.
**Superficie UI:** pagina-settings (panel lateral izquierdo).
**Gesto canonico:** clic en cabecera de grupo para expandir.

**Historia:**
> Como modelador, quiero ver en el panel lateral de Settings los grupos disponibles (User, Group, Organization, Analyze, Manuals) para navegar entre las areas de configuracion.

**Contexto de negocio:**
El panel lateral es el mapa de Settings. La jerarquia ontologica (User → Group → Organization) refleja como esta estructurada la identidad en OPCloud. Cada grupo expande a subentradas que son paginas-formulario en el area principal.

**Criterios de aceptacion:**
- **Dado** que abri Settings, **cuando** miro el panel lateral, **entonces** veo los grupos: `User Management`, `Group Management` (si aplica rol), `Organization Management` (si aplica rol), `Analyze Model`, `OPCloud Manuals`, cada uno con icono y flecha `⌄`.
- **Dado** que soy modelador regular, **cuando** miro el panel, **entonces** NO veo `Group Management` ni `Organization Management` (ver HU-80.015).
- **Dado** que hago clic en `User Management`, **cuando** se expande, **entonces** aparecen `Update My Profile`, `OPL Settings`, `OPCloud Settings`.
- **Dado** que hago clic en una subentrada, **cuando** se activa, **entonces** carga el formulario correspondiente en el area principal.
- **Dado** que el panel esta colapsado, **cuando** entro por primera vez, **entonces** el area principal esta vacia hasta que elija una subentrada.

**Reglas y restricciones:**
- El menu es de construccion en cliente: el rol se resuelve al renderizar (§4.1 del doc fuente).
- Color de fondo: azul marino oscuro; texto blanco; ancho ~330px (convencion observada).
- Solo un grupo puede estar expandido a la vez es **pregunta abierta** — no observado en frames.

**Modelo de datos tocado:**
- `user.role` (lectura) — determina visibilidad de entradas.

**Dependencias:**
- Bloqueada por: HU-80.001 o HU-80.002.
- Bloquea a: HU-80.015.

**Integraciones:**
- Resolver de rol del usuario.

**Notas de evidencia:**
- Fuente: §2.2.
- Frames: frame_00004, frame_00005, frame_00008.
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** S.
**Etiquetas:** [config, ui, menu, sidebar].

---

### HU-80.005 — Ver badge de identidad `Full Name / Organization` en canvas

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; L (lente de identidad) secundario.
**Superficie UI:** canvas (esquina superior derecha).
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero ver siempre mi nombre y organizacion en el canvas para saber en que contexto organizacional estoy trabajando.

**Contexto de negocio:**
El badge compacto `<Full Name>` / `<Organization>` es el recordatorio persistente del contexto organizacional. Alinea con la regla de aislamiento inter-organizacional (HU-80.026): saber "desde que organizacion estoy modelando" es critico porque los modelos no cruzan organizaciones.

**Criterios de aceptacion:**
- **Dado** que estoy logueado, **cuando** miro la esquina superior derecha del canvas, **entonces** veo mi `Full Name` en la linea superior y `Organization` en tipografia menor abajo.
- **Dado** que cambio mi `Full Name` en el perfil, **cuando** vuelvo al canvas, **entonces** el badge refleja el nuevo nombre.
- **Dado** que el badge esta presente, **cuando** hago clic sobre el, **entonces** **pregunta abierta**: ¿abre Settings, muestra menu de usuario, no hace nada? No observado.

**Reglas y restricciones:**
- El badge es eco del estado de sesion, no editable in-place.
- El engranaje esta adyacente al badge (HU-80.002).

**Modelo de datos tocado:**
- `user.full_name` (lectura).
- `user.organization_id → organization.name` (lectura).

**Dependencias:**
- Relaciona: HU-80.006 (cambio de nombre propaga aqui).

**Integraciones:**
- Canvas header.

**Notas de evidencia:**
- Fuente: §2.1 tabla, §9 ("Badge de identidad compacto").
- Frames: frame_00001, frame_00003 (`OPCloud Modeler / Technion`).
- Clase de afirmacion: observado.

**Prioridad:** M1.
**Tamano:** XS.
**Etiquetas:** [config, ui, canvas, identity, badge].

---

### HU-80.006 — Actualizar Full Name desde Update My Profile

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; P (persistencia) secundario.
**Superficie UI:** pagina-settings → User Management → Update My Profile.
**Gesto canonico:** edicion de input + clic en `Save Changes`.

**Historia:**
> Como modelador, quiero editar mi Full Name desde el perfil para que aparezca correctamente en badges, permisos, chat y notas.

**Contexto de negocio:**
El nombre del modelador es la identidad visible en toda la superficie colaborativa (permisos de modelo, notas, chat). Editarlo debe ser directo y el cambio debe propagar. El formulario consolida cambios en un unico `Save Changes` — asimetria deliberada frente a los `Save` por-campo de OPCloud Settings administrativo (§9 del doc fuente).

**Criterios de aceptacion:**
- **Dado** que estoy en `Update My Profile`, **cuando** miro el campo `Full Name`, **entonces** esta prellenado con el valor actual y es editable.
- **Dado** que edito el `Full Name`, **cuando** hago clic en `Save Changes`, **entonces** se persiste en `user.full_name`.
- **Dado** que guarde el nuevo nombre, **cuando** vuelvo al canvas (Back), **entonces** el badge (HU-80.005) muestra el nuevo nombre.
- **Dado** que guarde el nombre, **cuando** otros usuarios abren modales de permisos que me referencian, **entonces** ven el nuevo nombre.
- **Dado** que edite y no pulse `Save Changes`, **cuando** navego fuera, **entonces** el cambio se descarta — **pregunta abierta**: ¿hay warning? No observado.

**Reglas y restricciones:**
- Texto libre; no hay validacion observada de caracteres.
- SSO puede bloquear la edicion si el IdP sincroniza el nombre (§4.2); no observado.

**Modelo de datos tocado:**
- `user.full_name` — string — persistente.

**Dependencias:**
- Bloqueada por: HU-80.001 o HU-80.002, HU-80.004.

**Integraciones:**
- Badge canvas (HU-80.005).
- Modales de permisos (EPICA-40).
- Notas y chat (EPICA-41, EPICA-42).

**Notas de evidencia:**
- Fuente: §2.3 tabla, §3.2, §5.1 tabla.
- Frames: frame_00008.
- Transcripcion Intro 13: "we can change our name by using the url and giving ourselves a different icon. finishing, we should click save changes."
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, ui, profile, rename].

---

### HU-80.007 — Cambiar foto de perfil subiendo archivo local

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; P secundario; X (storage) terciario.
**Superficie UI:** pagina-settings → Update My Profile (boton `Upload Image`).
**Gesto canonico:** clic en boton + selector de archivo.

**Historia:**
> Como modelador, quiero subir una imagen local como foto de perfil para personalizar mi identidad visual en la organizacion.

**Contexto de negocio:**
Subir archivo es la via universal: no requiere URL publica ni hosting externo. Junto con la via URL (HU-80.008) cubren los dos patrones de entrada canonicos. La preview cuadrada lateral confirma visualmente el resultado antes de guardar.

**Criterios de aceptacion:**
- **Dado** que estoy en `Update My Profile`, **cuando** hago clic en `Upload Image`, **entonces** se abre el selector de archivo del sistema operativo.
- **Dado** que selecciono una imagen valida, **cuando** se sube, **entonces** la preview lateral muestra la nueva imagen.
- **Dado** que la imagen esta en preview, **cuando** hago clic en `Save Changes`, **entonces** la imagen persiste y se asocia al perfil.
- **Dado** que selecciono un archivo no-imagen, **cuando** intento subir, **entonces** **pregunta abierta**: ¿hay validacion de MIME? No observado.
- **Dado** que subi una imagen, **cuando** otros usuarios ven mi avatar (en chat/permisos), **entonces** ven la nueva imagen.

**Reglas y restricciones:**
- Tamano maximo, formatos aceptados: no observados — **pregunta abierta**.
- Se guarda en `user.profile_picture_url` (URL resultante del upload al storage).

**Modelo de datos tocado:**
- `user.profile_picture_url` — string URL — persistente.

**Dependencias:**
- Bloqueada por: HU-80.006 (comparte `Save Changes`).

**Integraciones:**
- Storage externo (presumiblemente bucket de OPCloud).
- Caching de imagen en clientes (HU-80.007 relaciona con §11 Q10 del doc fuente).

**Notas de evidencia:**
- Fuente: §2.3 tabla, §3.2.
- Frames: frame_00008.
- Transcripcion Intro 13.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, ui, profile, upload, avatar].

---

### HU-80.008 — Cambiar foto de perfil pegando URL externa

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; P secundario.
**Superficie UI:** pagina-settings → Update My Profile (input `Or paste URL`).
**Gesto canonico:** pegar URL + clic en `Save Changes`.

**Historia:**
> Como modelador, quiero pegar una URL externa como foto de perfil para reutilizar una imagen ya hospedada sin subirla de nuevo.

**Contexto de negocio:**
La entrada por URL cubre casos comunes: avatar ya hospedado (GitHub, Gravatar, corporate CDN). Es alternativa, no complemento, al upload — el input y el boton son controles distintos pero desembocan en el mismo campo (`user.profile_picture_url`).

**Criterios de aceptacion:**
- **Dado** que estoy en `Update My Profile`, **cuando** pego una URL en el input `Or paste URL`, **entonces** la preview lateral intenta cargar la imagen desde esa URL.
- **Dado** que la URL es valida y retorna una imagen, **cuando** la preview la muestra, **entonces** puedo guardar con `Save Changes`.
- **Dado** que la URL devuelve 404 o no-imagen, **cuando** la preview falla, **entonces** **pregunta abierta**: ¿muestra placeholder/error? No observado.
- **Dado** que pego URL y luego uso `Upload Image`, **cuando** el upload completa, **entonces** el upload gana (la URL queda descartada).

**Reglas y restricciones:**
- La URL se persiste literalmente; OPCloud no la descarga ni la cachea (hipotesis por validar — Q10 §11).
- CORS del origen puede bloquear la visualizacion; no hay mitigacion observada.

**Modelo de datos tocado:**
- `user.profile_picture_url` — string URL — persistente.

**Dependencias:**
- Bloqueada por: HU-80.006 (comparte `Save Changes`).

**Integraciones:**
- Cache de imagen (Q10 §11 doc fuente).

**Notas de evidencia:**
- Fuente: §2.3 tabla, §3.2, §11 Q10.
- Frames: frame_00008.
- Clase de afirmacion: observado + abierto (cache behavior).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, ui, profile, url, avatar, requires-clarification].

---

### HU-80.009 — Ver Expiration Date del perfil propio como read-only

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; L (lente de politica) secundario.
**Superficie UI:** pagina-settings → Update My Profile (campo `Expiration Date`).
**Gesto canonico:** ninguno (display).

**Historia:**
> Como modelador, quiero ver mi fecha de expiracion como campo read-only para conocer el estado de vigencia de mi cuenta sin poder manipularlo.

**Contexto de negocio:**
La fecha de expiracion es una politica **fijada por el administrador**, no negociable por el usuario. Mostrarla read-only cumple dos funciones: transparencia (el usuario sabe que existe y que dice) y aislamiento del control (nadie puede extender su propia vigencia). El texto `Permanent Access` como string literal (en lugar de null/infinito) comunica el estado de forma no-ambigua.

**Criterios de aceptacion:**
- **Dado** que estoy en `Update My Profile`, **cuando** miro el campo `Expiration Date`, **entonces** veo el valor (ej. `Permanent Access`) en texto gris, no editable.
- **Dado** que el administrador fijo una fecha concreta, **cuando** abro mi perfil, **entonces** veo esa fecha en lugar de `Permanent Access`.
- **Dado** que intento hacer clic o editar, **cuando** interactuo con el campo, **entonces** no admite foco de escritura.
- **Dado** que mi cuenta expira, **cuando** llega la fecha, **entonces** **pregunta abierta**: ¿que mensaje/flujo de bloqueo ocurre? (§4.3) No observado.

**Reglas y restricciones:**
- `expiration_date` puede ser `"permanent"` (string especial) o una fecha ISO.
- El administrador edita desde HU-80.018.

**Modelo de datos tocado:**
- `user.expiration_date` — date | "permanent" — persistente (lectura).

**Dependencias:**
- Bloqueada por: HU-80.006 (estar en el formulario).
- Relaciona: HU-80.018 (edicion por administrador).

**Integraciones:**
- Politica de autenticacion (EPICA externa).

**Notas de evidencia:**
- Fuente: §2.3 tabla, §4.3, §9.
- Frames: frame_00008 (`Permanent Access`).
- Clase de afirmacion: observado + abierto (flujo de expiracion).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, profile, read-only, expiration, requires-clarification].

---

### HU-80.010 — Reset Password propio con envio de email

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; X (servicio email) secundario.
**Superficie UI:** pagina-settings → Update My Profile (boton `Reset Password`).
**Gesto canonico:** clic en boton.

**Historia:**
> Como modelador, quiero iniciar el reseteo de mi contrasena con un clic para recibir instrucciones por email sin contactar al administrador.

**Contexto de negocio:**
Auto-servicio para reseteo es estandar en SaaS. Dispara un email al `E-mail Address` registrado; el flujo de cambio continua fuera de la app. Es critico que el boton quede neutralizado bajo SSO (HU-80.011) porque en ese modo el IdP gestiona el password.

**Criterios de aceptacion:**
- **Dado** que estoy en `Update My Profile` y NO uso SSO, **cuando** hago clic en `Reset Password`, **entonces** OPCloud envia email al `E-mail Address` del perfil con instrucciones.
- **Dado** que envie reset, **cuando** reviso mi bandeja, **entonces** recibo un correo con link/token.
- **Dado** que hago clic en el link del email, **cuando** el flujo de reset se completa, **entonces** mi nueva contrasena aplica en el siguiente login (flujo fuera de alcance detallado).
- **Dado** que hago clic muchas veces seguidas, **cuando** se envian solicitudes repetidas, **entonces** **pregunta abierta**: ¿hay rate limit? No observado.

**Reglas y restricciones:**
- El boton es equivalente al de `Organization Management` cuando el administrador lo ejecuta sobre otro usuario (HU-80.016 / HU-80.017, no observado directamente).
- La respuesta en la UI tras clic: no observada — hipotesis toast.

**Modelo de datos tocado:**
- Ninguno persistente directo; dispara evento de email.

**Dependencias:**
- Bloquea a: HU-80.011 (caso SSO).

**Integraciones:**
- Servicio de email saliente.
- Autenticacion (EPICA externa).

**Notas de evidencia:**
- Fuente: §2.3 tabla, §3.3.
- Transcripcion Intro 13.
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, ui, profile, password, email].

---

### HU-80.011 — Deshabilitar Reset Password bajo SSO activo

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; X (IdP) secundario.
**Superficie UI:** pagina-settings → Update My Profile (boton `Reset Password`).
**Gesto canonico:** ninguno (render disabled).

**Historia:**
> Como modelador autenticado via SSO, quiero que el boton Reset Password este deshabilitado o ausente para no generar expectativas que el flujo SSO no puede cumplir.

**Contexto de negocio:**
Bajo SSO el password vive en el IdP corporativo, no en OPCloud. Permitir `Reset Password` generaria un dead-end; neutralizarlo evita la confusion. La regla es explicita en la transcripcion de Intro 13.

**Criterios de aceptacion:**
- **Dado** que mi sesion usa SSO, **cuando** entro a `Update My Profile`, **entonces** el boton `Reset Password` esta deshabilitado (greyed out) o ausente.
- **Dado** que el boton esta deshabilitado, **cuando** intento hacer clic, **entonces** no ocurre nada.
- **Dado** que mi sesion NO es SSO, **cuando** entro al perfil, **entonces** el boton esta habilitado normalmente (HU-80.010).

**Reglas y restricciones:**
- La determinacion de SSO es por sesion / configuracion de organizacion.
- Hipotesis: tooltip `Managed by your identity provider` — no observado.

**Modelo de datos tocado:**
- `user.sso_subject` (lectura, determina estado SSO).

**Dependencias:**
- Bloqueada por: HU-80.010 (define el caso normal).

**Integraciones:**
- Sistema de autenticacion.

**Notas de evidencia:**
- Fuente: §2.3 tabla, §4.2.
- Transcripcion Intro 13: "if you are using SSO this will not be optional".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** W (depende de infra SSO).
**Tamano:** XS.
**Etiquetas:** [config, ui, profile, sso, disabled].

---

### HU-80.012 — Ajustar Autosave Time Interval con Save por-campo

**Actor primario:** ME.
**Actores secundarios:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; P (runtime autosave) secundario.
**Superficie UI:** pagina-settings → User Management → OPCloud Settings (input `Set Autosave Time Interval` + boton `Save`).
**Gesto canonico:** edicion numerica + clic en `Save` adyacente.

**Historia:**
> Como modelador, quiero ajustar cada cuantos minutos OPCloud autoguarda mi modelo para adaptar la frecuencia a mi estilo de trabajo y conectividad.

**Contexto de negocio:**
Autosave protege contra perdida de trabajo pero tiene costo (red, merge potencial). Exponer el intervalo da control sin comprometer la seguridad base. El patron `Save` por-campo (no un `Save Changes` global) permite al usuario confirmar ese parametro especifico con intencion explicita, porque tiene efecto inmediato en runtime (§9 del doc fuente).

**Criterios de aceptacion:**
- **Dado** que estoy en `OPCloud Settings`, **cuando** miro `Set Autosave Time Interval`, **entonces** veo un input numerico con valor `5` (default) y un boton `Save` adyacente.
- **Dado** que cambio el valor a `10`, **cuando** hago clic en el `Save` de ese campo, **entonces** el nuevo intervalo persiste y aplica al runtime de autosave.
- **Dado** que cambio el valor y NO pulso `Save`, **cuando** navego fuera, **entonces** el cambio se descarta sin warning (§4.4).
- **Dado** que el nuevo intervalo esta activo, **cuando** pasa ese tiempo, **entonces** OPCloud ejecuta autosave del modelo abierto.
- **Dado** que intento valor ≤ 0, **cuando** hago `Save`, **entonces** **pregunta abierta**: ¿validacion? No observado.

**Reglas y restricciones:**
- Unidad: minutos (label `Minutes` al lado del input).
- Default: 5.
- Rango valido: no declarado — **pregunta abierta**.

**Modelo de datos tocado:**
- `user.preferences.autosave_interval_minutes` — int — persistente.

**Dependencias:**
- Bloqueada por: HU-80.004.

**Integraciones:**
- Runtime de autosave (EPICA-30 persistencia).

**Notas de evidencia:**
- Fuente: §2.5 tabla, §3.4.
- Frames: frame_00025.
- Transcripcion Intro 13: "autosaving by default occurs every five minutes. i can set it to a longer or shorter time period."
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, autosave, save-por-campo, runtime].

---

### HU-80.013 — Ajustar Time Precision decimal places

**Actor primario:** IS (ingeniero de simulacion).
**Actores secundarios:** ME.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; V (render numerico) secundario.
**Superficie UI:** pagina-settings → User Management → OPCloud Settings (input `Time precision` + boton `Save`).
**Gesto canonico:** edicion numerica + clic en `Save` adyacente.

**Historia:**
> Como ingeniero de simulacion, quiero controlar los decimales con que se renderizan valores numericos para leer resultados con la precision que mi dominio requiere.

**Contexto de negocio:**
En simulacion computacional (EPICA-B1) los valores numericos pueden requerir alta precision (finanzas, ingenieria) o baja (ergonomia, presentacion ejecutiva). El control por-usuario evita imponer un unico estilo y permite exportar/leer con legibilidad. Es un `Save` por-campo por el mismo motivo que autosave: efecto inmediato en render.

**Criterios de aceptacion:**
- **Dado** que estoy en `OPCloud Settings`, **cuando** miro `Time precision: No. of places to the right of the decimal point`, **entonces** veo un input numerico con valor `2` (default) y boton `Save`.
- **Dado** que cambio a `4`, **cuando** hago `Save`, **entonces** los valores numericos del canvas (states computacionales, resultados de simulacion) se renderizan con 4 decimales.
- **Dado** que el cambio aplica, **cuando** exporto el modelo a PDF/SVG, **entonces** la precision del render tambien refleja el nuevo valor.
- **Dado** que hay valores con menos decimales que el setting, **cuando** se renderizan, **entonces** se pad-rellenan con ceros o se preservan como estan — **pregunta abierta**: no observado.

**Reglas y restricciones:**
- Default: 2.
- Aplica a render; no altera el valor almacenado.
- Rango valido: no declarado.

**Modelo de datos tocado:**
- `user.preferences.time_precision_decimals` — int — persistente.

**Dependencias:**
- Bloqueada por: HU-80.004.

**Integraciones:**
- Renderer numerico (canvas, OPL, simulacion).

**Notas de evidencia:**
- Fuente: §2.5 tabla.
- Frames: frame_00025.
- Clase de afirmacion: observado.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, precision, save-por-campo, render-numerico].

---

### HU-80.014 — Alternar Log Sharing Enabled/Disabled

**Actor primario:** MN.
**Tipo:** opcloud-ui.
**Nivel categorico:** U primario; X (telemetria externa) secundario.
**Superficie UI:** pagina-settings → User Management → OPCloud Settings (desplegable `Log Sharing`).
**Gesto canonico:** cambio de seleccion en desplegable.

**Historia:**
> Como modelador, quiero activar o desactivar el envio de telemetria de errores al equipo OPCloud para equilibrar colaboracion con privacidad segun mi contexto.

**Contexto de negocio:**
Log Sharing es un canal de diagnostico para el equipo producto. Activarlo permite a OPCloud detectar y corregir errores de forma proactiva; desactivarlo respeta entornos sensibles (salud, defensa, investigacion confidencial). El desplegable binario (en vez de toggle) deja abierto el camino a un tercer estado futuro (§9 del doc fuente).

**Criterios de aceptacion:**
- **Dado** que estoy en `OPCloud Settings`, **cuando** miro `Log Sharing`, **entonces** veo un desplegable con valores `Enabled` (default) y `Disabled`.
- **Dado** que cambio a `Disabled`, **cuando** la seleccion se registra, **entonces** OPCloud deja de enviar telemetria de errores desde mi sesion.
- **Dado** que cambio la seleccion, **cuando** NO hay boton `Save` adyacente, **entonces** el cambio persiste al seleccionar (hipotesis §3.5).
- **Dado** que `Log Sharing=Enabled` y ocurre un error, **cuando** OPCloud recibe el log, **entonces** el equipo puede investigar sin intervencion del usuario.
- **Dado** que el administrador de organizacion fijo un valor, **cuando** comparo con mi override, **entonces** **pregunta abierta** (§11 Q8): ¿es per-user o per-org con override?

**Reglas y restricciones:**
- Default: `Enabled`.
- Persistencia al cambio de seleccion (sin boton `Save` adyacente) — hipotesis.
- Alcance declarado: per-usuario, pero ambiguedad con organizacion.

**Modelo de datos tocado:**
- `user.preferences.log_sharing` — enum `{Enabled, Disabled}` — persistente (hipotesis).

**Dependencias:**
- Bloqueada por: HU-80.004.

**Integraciones:**
- Servicio de telemetria externa (OPCloud backend).

**Notas de evidencia:**
- Fuente: §2.5 tabla, §3.5, §11 Q8.
- Frames: frame_00028.
- Transcripcion Intro 13: "log sharing when applicable, meaning that you will help us in OPCloud — if there is any issue we'll get notification automatically."
- Clase de afirmacion: confirmado por transcripcion + abierto (scope per-user vs per-org).
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, ui, telemetria, log-sharing, privacidad, requires-clarification].

---

### HU-80.015 — Ocultar Group/Organization Management a usuarios sin rol administrador

**Actor primario:** AO (administrador de organizacion).
**Actores secundarios:** MN (que NO debe verlas).
**Tipo:** mixto.
**Nivel categorico:** U primario; C secundario; K (regla de autorizacion) terciario.
**Superficie UI:** pagina-settings (panel lateral).
**Gesto canonico:** ninguno (render condicional por rol).

**Historia:**
> Como administrador, quiero que los modeladores regulares NO vean las entradas `Group Management` y `Organization Management` para mantener las acciones administrativas invisibles a usuarios no autorizados.

**Contexto de negocio:**
Menu role-based-visibility en vez de guarda de tipo "clic → permiso denegado". Decision sobria: si no podes usarlo, no lo ves. Reduce ruido para el modelador regular y protege de escalada de privilegios por UI.

**Criterios de aceptacion:**
- **Dado** que mi rol es `modeler`, **cuando** abro Settings, **entonces** el panel lateral **no** incluye `Group Management` ni `Organization Management`.
- **Dado** que mi rol es `org_admin`, **cuando** abro Settings, **entonces** el panel si incluye ambas entradas.
- **Dado** que mi rol es `system_admin`, **cuando** abro Settings, **entonces** ademas de lo anterior **pregunta abierta** (§11 Q2, Q9): ¿ve un selector de organizacion o entradas globales adicionales? No observado.
- **Dado** que intento acceder a la URL/ruta de `Group Management` siendo modeler (hack), **cuando** el backend evalua, **entonces** rechaza la operacion (defensa en profundidad — hipotesis).

**Reglas y restricciones:**
- Resolucion de rol: en cliente al renderizar menu (§4.1 del doc fuente).
- Defensa en backend: no observada pero es expectativa estandar.

**Modelo de datos tocado:**
- `user.role` (lectura) — determina render.

**Dependencias:**
- Bloqueada por: HU-80.004.

**Integraciones:**
- Backend de autorizacion (fuera de alcance detallado).

**Notas de evidencia:**
- Fuente: §2 intro, §4.1, §5.4 tabla.
- Transcripcion Intro 13: "some options are privileged only to admins and other high-profile users", "if you have permission to group management or organization management you will see the option there".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, ui, permisos, rol-based-menu, autorizacion].

---

### HU-80.016 — Crear nuevo usuario desde Organization Management

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** K (identidad) primario; U, P secundarios.
**Superficie UI:** pagina-settings → Organization Management (formulario `+ Nuevo usuario`, inferido).
**Gesto canonico:** clic en `+ Nuevo usuario` + llenar formulario + `Save`.

**Historia:**
> Como administrador de organizacion, quiero crear un nuevo usuario en mi organizacion para onboarding de modeladores sin depender del equipo OPCloud central.

**Contexto de negocio:**
El CRUD de usuarios es la funcion administrativa principal. Permite escalar la organizacion sin friccion. Campos esperados replican los del perfil propio: `Full Name`, `E-mail Address`, selector de rol, asignacion inicial a grupos, posibilidad de fijar `Expiration Date` (HU-80.018). La existencia de este flujo se infiere por la asimetria: los campos read-only del perfil (expiration) solo tienen sentido si **alguien** los edita desde otra pantalla.

**Criterios de aceptacion:**
- **Dado** que soy administrador de organizacion y estoy en `Organization Management`, **cuando** miro la cabecera, **entonces** veo accion `+ Nuevo usuario`.
- **Dado** que hago clic en `+ Nuevo usuario`, **cuando** se abre el formulario, **entonces** contiene al menos `Full Name`, `E-mail Address`, selector de rol (`modeler` / `org_admin`), `Expiration Date`, grupos iniciales.
- **Dado** que lleno el formulario y guardo, **cuando** persiste el nuevo usuario, **entonces** **pregunta abierta**: ¿se envia email de bienvenida/invitacion automatico? No observado.
- **Dado** que el email introducido ya existe en la organizacion, **cuando** intento guardar, **entonces** se rechaza con error (hipotesis por unicidad de email).
- **Dado** que cree el usuario, **cuando** el intenta loguearse, **entonces** lo logra (flujo de primer login — depende de HU-80.010 o SSO).

**Reglas y restricciones:**
- `organization_id` del nuevo usuario se fija a la organizacion del administrador que lo crea — sin posibilidad de crear en otra organizacion (HU-80.026).
- Rol por default: `modeler`.
- Formato `Expiration Date`: **pregunta abierta** (§11 Q7).

**Modelo de datos tocado:**
- `user.*` — creacion completa.
- `user.organization_id` — derivado del administrador que crea.
- `user.role` — enum `{modeler, org_admin, system_admin}`.
- `user.group_ids` — array (opcional al crear).

**Dependencias:**
- Bloqueada por: HU-80.015 (acceso al panel).
- Bloquea a: HU-80.017, HU-80.018, HU-80.019, HU-80.021.

**Integraciones:**
- Servicio de email (invitacion — hipotesis).
- Autenticacion.

**Notas de evidencia:**
- Fuente: §2.7, §3.6 (flujo inferido), §5.1 tabla, §11 Q7.
- Clase de afirmacion: inferido desde asimetria read-only del perfil.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, admin, user-crud, create, requires-clarification].

---

### HU-80.017 — Editar usuario existente (Full Name, Email, Expiration)

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** K primario; U, P secundarios.
**Superficie UI:** pagina-settings → Organization Management (ficha de usuario, inferida).
**Gesto canonico:** clic en usuario de la tabla + editar + `Save`.

**Historia:**
> Como administrador, quiero editar los datos de un usuario existente (nombre, email, expiration, rol, grupos) para mantener la identidad al dia cuando cambian sus circunstancias.

**Contexto de negocio:**
Reflejar cambios organizacionales: matrimonio (cambio de apellido), cambio de correo corporativo, extension/reduccion de contrato. La ficha expandida es analoga a `Update My Profile` pero con campos habilitados que en el perfil propio son read-only (Expiration).

**Criterios de aceptacion:**
- **Dado** que estoy en `Organization Management`, **cuando** hago clic en un usuario, **entonces** se abre su ficha editable.
- **Dado** que edito `Full Name`, **cuando** guardo, **entonces** el cambio persiste y propaga (badges, permisos).
- **Dado** que edito `E-mail Address`, **cuando** guardo, **entonces** futuros emails de reset (HU-80.010) van a la nueva direccion.
- **Dado** que cambio el `role` de modeler a org_admin, **cuando** el usuario refresca su sesion, **entonces** ve las nuevas entradas administrativas en Settings (HU-80.015).
- **Dado** que cambios simultaneos los hace el propio usuario (HU-80.006), **cuando** se persisten, **entonces** se aplican reglas last-write-wins — **pregunta abierta**.

**Reglas y restricciones:**
- Unicidad de email intra-organizacion.
- Editar rol de un usuario activo: propagacion exige nueva sesion — hipotesis.
- Audit trail: **pregunta abierta** (§11 Q4).

**Modelo de datos tocado:**
- `user.full_name`, `user.email`, `user.expiration_date`, `user.role`, `user.group_ids` — persistentes.

**Dependencias:**
- Bloqueada por: HU-80.016.

**Integraciones:**
- Autenticacion.
- Badges canvas (HU-80.005).

**Notas de evidencia:**
- Fuente: §3.6 (inferido), §5.1, §11 Q4.
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, admin, user-crud, edit, requires-clarification].

---

### HU-80.018 — Fijar Expiration Date concreta a un usuario

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** K primario; P, X (autenticacion) secundarios.
**Superficie UI:** pagina-settings → Organization Management (ficha de usuario, campo `Expiration Date`).
**Gesto canonico:** selector de fecha.

**Historia:**
> Como administrador, quiero fijar una fecha de expiracion concreta a un usuario para modelar licencias temporales (consultores, pasantes, contratos) sin mantener cuentas activas indefinidamente.

**Contexto de negocio:**
La expiracion es la contraparte de `Permanent Access` (HU-80.009). Permite politica de seguridad: una vez que expira, el usuario no puede loguearse. Es el mecanismo minimo de ciclo de vida sin requerir desactivacion manual (HU-80.019).

**Criterios de aceptacion:**
- **Dado** que edito un usuario, **cuando** accedo al campo `Expiration Date`, **entonces** esta editable (contraste con HU-80.009).
- **Dado** que selecciono una fecha concreta, **cuando** guardo, **entonces** `user.expiration_date` queda en esa fecha.
- **Dado** que el usuario ve su perfil, **cuando** mira `Expiration Date`, **entonces** ve la fecha fijada (no `Permanent Access`).
- **Dado** que llega la fecha, **cuando** el usuario intenta loguearse, **entonces** se rechaza — flujo fuera de alcance detallado (§4.3).
- **Dado** que fije una fecha pasada, **cuando** guardo, **entonces** **pregunta abierta**: ¿se permite (expiracion inmediata) o se rechaza?

**Reglas y restricciones:**
- Formato: **pregunta abierta** (§11 Q7) — date picker, string, plazo relativo.
- Valor especial: `"permanent"` para volver a Permanent Access.
- Cambiar `Expiration Date` mientras el usuario esta logueado: no rompe la sesion activa — hipotesis.

**Modelo de datos tocado:**
- `user.expiration_date` — date | "permanent" — persistente.

**Dependencias:**
- Bloqueada por: HU-80.016.

**Integraciones:**
- Servicio de autenticacion.

**Notas de evidencia:**
- Fuente: §4.3, §5.1, §11 Q7.
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, admin, user-crud, expiration, licencia, requires-clarification].

---

### HU-80.019 — Desactivar usuario sin borrar historial

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** K primario; P secundario.
**Superficie UI:** pagina-settings → Organization Management (ficha, accion desactivar — inferida).
**Gesto canonico:** clic en accion `Deactivate` o similar.

**Historia:**
> Como administrador, quiero desactivar un usuario sin borrar su historial para preservar trazabilidad de modelos, comentarios y ownership tras offboarding.

**Contexto de negocio:**
Eliminar duramente un usuario destruye referencias (¿quien era el Model Owner? ¿quien escribio esa nota?). La desactivacion suave (soft-delete) es el patron estandar: bloquea login pero preserva atribucion. Resuelve parcialmente la pregunta abierta §11 Q6 sobre que pasa con modelos de un usuario removido.

**Criterios de aceptacion:**
- **Dado** que estoy editando un usuario, **cuando** elijo la accion `Deactivate`, **entonces** el usuario queda inhabilitado para iniciar sesion.
- **Dado** que un usuario esta desactivado, **cuando** otros ven modelos/notas que el creo, **entonces** su nombre sigue visible (con indicador visual opcional de "inactivo") — hipotesis.
- **Dado** que el usuario desactivado es `Model Owner`, **cuando** se intenta operar el modelo, **entonces** **pregunta abierta** (§11 Q6): ¿se transfiere ownership, se orfana, se bloquea?
- **Dado** que el administrador reactiva al usuario, **cuando** se reactiva, **entonces** recupera acceso con su historial intacto.

**Reglas y restricciones:**
- Soft-delete: preservar fila, marcar `deactivated_at`.
- Transferencia de ownership: **pregunta abierta** (§11 Q6).
- Hard-delete: no observado, probablemente no expuesto en UI.

**Modelo de datos tocado:**
- `user.deactivated_at` — timestamp nullable — persistente (hipotesis campo nuevo).

**Dependencias:**
- Bloqueada por: HU-80.017.

**Integraciones:**
- Ownership de modelos (EPICA-30, EPICA-31, EPICA-40).

**Notas de evidencia:**
- Fuente: §11 Q6.
- Clase de afirmacion: inferido + abierto.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, admin, user-crud, deactivate, soft-delete, requires-clarification].

---

### HU-80.020 — Crear grupo en Group Management

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** pagina-settings → Group Management (accion `+ Nuevo grupo`, inferida).
**Gesto canonico:** clic en `+ Nuevo grupo` + ingreso de nombre + `Save`.

**Historia:**
> Como administrador, quiero crear un grupo dentro de mi organizacion para agrupar modeladores por equipos, proyectos o areas y facilitar la gestion de permisos.

**Contexto de negocio:**
Los grupos son la unidad de permisionamiento recomendada por OPCloud (transcripcion Intro 24: "it is better to give permission to a group rather than individual, as individual modelers is hard to manage while a group can be entered and exited without any kind of from the admin to handle it"). Crear grupos es prerequisito para HU-80.021 (membresia) y HU-80.022 (subgrupos anidados).

**Criterios de aceptacion:**
- **Dado** que soy administrador de organizacion y estoy en `Group Management`, **cuando** hago clic en `+ Nuevo grupo`, **entonces** se abre prompt/formulario para nombre del grupo.
- **Dado** que ingreso nombre y confirmo, **cuando** se persiste, **entonces** el nuevo grupo aparece en la lista.
- **Dado** que cree el grupo, **cuando** entro a modales de permisos (EPICA-40), **entonces** aparece como candidato para asignar permisos.
- **Dado** que ingreso un nombre que ya existe en la organizacion, **cuando** intento guardar, **entonces** se rechaza con error (unicidad por-organizacion — hipotesis).

**Reglas y restricciones:**
- `organization_id` se fija al de la organizacion del administrador.
- Nombre: texto libre; unicidad intra-organizacion (hipotesis).
- Grupo creado queda vacio — la membresia se gestiona en HU-80.021.

**Modelo de datos tocado:**
- `group.id` — UUID — persistente.
- `group.name` — string — persistente.
- `group.organization_id` — UUID — persistente.
- `group.parent_group_id` — null al crear flat — persistente.

**Dependencias:**
- Bloqueada por: HU-80.015.
- Bloquea a: HU-80.021, HU-80.022.

**Integraciones:**
- Modales de permisos (EPICA-40).
- Modales de permisos de carpeta (EPICA-31).

**Notas de evidencia:**
- Fuente: §2.6, §3.7 (inferido).
- Transcripcion Intro 24 (cross-ref).
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, admin, group-crud, create, requires-clarification].

---

### HU-80.021 — Anadir/quitar usuarios de un grupo

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** K primario; U secundario.
**Superficie UI:** pagina-settings → Group Management (ficha de grupo, seccion miembros — inferida).
**Gesto canonico:** seleccion/busqueda de usuarios + confirmacion.

**Historia:**
> Como administrador, quiero anadir o quitar usuarios de un grupo para reflejar cambios en los equipos sin modificar permisos modelo-por-modelo.

**Contexto de negocio:**
La membresia es el mecanismo dinamico: anadir un modelador al grupo `Team Clinical` le da acceso a todos los modelos y carpetas con permiso a ese grupo. Es la razon por la que los administradores prefieren grupos sobre individuos (Intro 24).

**Criterios de aceptacion:**
- **Dado** que abro la ficha de un grupo, **cuando** miro la seccion `Members`, **entonces** veo la lista actual de miembros.
- **Dado** que hago clic en `Add member`, **cuando** el picker se abre, **entonces** puedo buscar/seleccionar usuarios de mi organizacion (HU-80.026).
- **Dado** que anado usuario `U`, **cuando** se persiste, **entonces** `U.group_ids` incluye el ID del grupo y el acceso a modelos permitido por el grupo aplica inmediatamente a `U`.
- **Dado** que quito usuario `U` del grupo, **cuando** se persiste, **entonces** pierde el acceso derivado del grupo (otros accesos directos o por otro grupo se preservan).
- **Dado** que un usuario esta en varios grupos, **cuando** obtiene permisos, **entonces** la union de todos los grupos aplica.

**Reglas y restricciones:**
- Un usuario puede estar en varios grupos simultaneamente.
- Cambios propagan en tiempo real o al proximo refresh — **pregunta abierta**.
- Aislamiento: no se pueden anadir usuarios de otra organizacion (HU-80.026).

**Modelo de datos tocado:**
- `group.member_user_ids` — array UUID — persistente.
- `user.group_ids` — array UUID — persistente (vista dual).

**Dependencias:**
- Bloqueada por: HU-80.020.

**Integraciones:**
- Permisos de modelo (EPICA-40).
- Permisos de carpeta (EPICA-31).

**Notas de evidencia:**
- Fuente: §2.6, §3.7 (inferido).
- Transcripcion Intro 24.
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, admin, group-crud, membership, requires-clarification].

---

### HU-80.022 — Anidar subgrupos dentro de un grupo padre

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** K.
**Superficie UI:** pagina-settings → Group Management (accion `Create subgroup` — inferida).
**Gesto canonico:** expand grupo padre + accion `+ Subgrupo`.

**Historia:**
> Como administrador, quiero anidar subgrupos dentro de un grupo padre para modelar jerarquias organizacionales (Ejemplo: Team → Squads) sin duplicar configuracion.

**Contexto de negocio:**
El anidamiento de grupos permite herencia natural: miembros de un subgrupo heredan permisos del grupo padre (hipotesis). Es consistente con la referencia a subgrupos en EPICA-40 §6.

**Criterios de aceptacion:**
- **Dado** que estoy en un grupo padre, **cuando** elijo `Create subgroup`, **entonces** se crea un nuevo grupo con `parent_group_id = <padre>`.
- **Dado** que existen subgrupos, **cuando** miro la lista de grupos, **entonces** se representan jerarquicamente (indent, arbol).
- **Dado** que un usuario es miembro de un subgrupo, **cuando** se calculan sus permisos, **entonces** hereda permisos del grupo padre — **pregunta abierta**: ¿herencia vs solo namespacing?
- **Dado** que borro un grupo con subgrupos, **cuando** confirma, **entonces** **pregunta abierta**: ¿cascada, se rechaza, se promueven a raiz?

**Reglas y restricciones:**
- Profundidad maxima de anidamiento: no declarada.
- Herencia de permisos: hipotesis fuerte pero no observada.

**Modelo de datos tocado:**
- `group.parent_group_id` — UUID nullable — persistente.

**Dependencias:**
- Bloqueada por: HU-80.020.

**Integraciones:**
- EPICA-40 (permisos que referencian subgrupos).

**Notas de evidencia:**
- Fuente: §2.6, §6.2 (modelo), cross-ref EPICA-40 §6.
- Transcripcion Intro 24.
- Clase de afirmacion: inferido.
- Etiqueta: `requires-clarification`.

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, admin, group-crud, subgroup, anidamiento, requires-clarification].

---

### HU-80.023 — Ver grupo raiz sintetico `<Org> All Users`

**Actor primario:** AO (administrador de organizacion).
**Actores secundarios:** MN (como miembro implicito).
**Tipo:** mixto.
**Nivel categorico:** L (lente) primario; K (sinteticidad) secundario.
**Superficie UI:** pagina-settings → Group Management (listado) + modales de permisos.
**Gesto canonico:** ninguno (entidad derivada).

**Historia:**
> Como administrador, quiero ver un grupo raiz `<Organization> All Users` que automaticamente incluye a todos los miembros para dar permisos "a toda la organizacion" sin mantener membresia manual.

**Contexto de negocio:**
Grupo sintetico: no se crea ni se edita; su membresia es `{u : u.organization_id == <org>}`. Sirve para el patron comun de "permiso org-wide". Confirmado en transcripcion Intro 11 como "the first group in each organization".

**Criterios de aceptacion:**
- **Dado** que soy miembro de una organizacion, **cuando** miro Group Management o modales de permisos, **entonces** veo el grupo `<Org> All Users`.
- **Dado** que intento editar la membresia del grupo sintetico, **cuando** interactuo, **entonces** la accion esta bloqueada / el grupo es read-only.
- **Dado** que se agrega un usuario nuevo a la organizacion (HU-80.016), **cuando** se persiste, **entonces** queda automaticamente en `<Org> All Users`.
- **Dado** que asigno permiso de carpeta a `<Org> All Users`, **cuando** se aplica, **entonces** todos los usuarios actuales y futuros de la org tienen ese acceso.

**Reglas y restricciones:**
- Grupo derivado, no almacenado: membresia = consulta sobre `user.organization_id`.
- Nombre sigue patron `<Organization Name> All Users`.
- No es borrable ni renombrable.

**Modelo de datos tocado:**
- Ninguno nuevo; es vista derivada.

**Dependencias:**
- Relaciona: HU-80.016 (alta de usuario), EPICA-40 (permisos).

**Integraciones:**
- Modales de permisos (EPICA-40, EPICA-31).

**Notas de evidencia:**
- Fuente: §6.2 ("El grupo raiz `<Org> All Users` es sintetico: alias que resuelve a todos los usuarios cuya `organization_id` coincide").
- Transcripcion Intro 11.
- Clase de afirmacion: confirmado por transcripcion cruzada.

**Prioridad:** C.
**Tamano:** XS.
**Etiquetas:** [config, admin, group-crud, synthetic-group, derived-entity].

---

### HU-80.024 — Configurar defaults de organizacion (essence, OPD tree, ontology)

**Actor primario:** AO (administrador de organizacion).
**Tipo:** mixto.
**Nivel categorico:** C (config) primario; K (regla de herencia) secundario.
**Superficie UI:** pagina-settings → Organization Management (panel defaults, inferido).
**Gesto canonico:** edicion de controles + `Save`.

**Historia:**
> Como administrador, quiero fijar los defaults visuales y metodologicos de mi organizacion (Things Default Essence, OPD Tree Arrangement, ontology enforcement) para que todos los modeladores arranquen con convenciones alineadas.

**Contexto de negocio:**
Los defaults organizacionales son el "style guide vivo" de la organizacion. Sin ellos, cada modelador configuraria a su gusto y los modelos inter-equipo serian inconsistentes. Confirmado por transcripcion Intro 25 para OPD Tree Arrangement; extrapolado a los otros tres parametros narrados en el corpus.

**Criterios de aceptacion:**
- **Dado** que soy administrador de organizacion y estoy en `Organization Management`, **cuando** accedo al panel de defaults, **entonces** veo controles para al menos `Things Default Essence`, `OPD Tree Arrangement`, `Ontology Enforcement Level`.
- **Dado** que cambio `Things Default Essence` a `Physical`, **cuando** guardo, **entonces** usuarios nuevos de la organizacion veran `Physical` como default en `OPL Settings` (y EPICA-81), salvo override local.
- **Dado** que cambio `OPD Tree Arrangement` a `Manually`, **cuando** guardo, **entonces** usuarios existentes que NO hayan sobrescrito ese parametro heredan el cambio en su proximo login (HU-80.025).
- **Dado** que cambio `Ontology Enforcement Level` a `Enforce`, **cuando** guardo, **entonces** el comportamiento de la ontologia (EPICA-82) pasa a rechazar terminos fuera del lexico.
- **Dado** que cambie un default, **cuando** usuarios con override local lo abren, **entonces** NO ven el cambio (su override sigue activo).

**Reglas y restricciones:**
- Precedencia: override-usuario > default-organizacion > default-OPCloud-fabrica (§6.4).
- El `Reset to Default` en paneles de usuario restaura al default-organizacion, no al de fabrica — **pregunta abierta** (§11 Q5).
- Cambios propagan a futuros logins; sesiones activas pueden o no refrescar — **pregunta abierta**.

**Modelo de datos tocado:**
- `organization.defaults.things_default_essence` — enum `{physical, informatical}` — persistente.
- `organization.defaults.opd_tree_arrangement` — enum `{automatic, manually}` — persistente.
- `organization.defaults.ontology_enforcement_level` — enum `{none, suggest, enforce}` — persistente.

**Dependencias:**
- Bloqueada por: HU-80.015.
- Bloquea a: HU-80.025.
- Relaciona: EPICA-81, EPICA-82.

**Integraciones:**
- OPL Settings del usuario (EPICA-81).
- Ontology enforcement (EPICA-82).
- Render defaults al crear nuevas cosas (EPICA-10).

**Notas de evidencia:**
- Fuente: §2.7, §5.3 tabla, §7.2, §7.3.
- Transcripcion Intro 25: "the default is automatic; this is also inherited from your organization default".
- Clase de afirmacion: confirmado por transcripcion (parcial) + inferido (otros parametros).
- Etiqueta: `requires-clarification` (parametros no observados directamente).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, admin, org-defaults, inherit, style-guide, requires-clarification].

---

### HU-80.025 — Heredar defaults de organizacion con override por-usuario

**Actor primario:** MN.
**Actores secundarios:** ME, AO.
**Tipo:** mixto.
**Nivel categorico:** K (regla de precedencia) primario; C, U secundarios.
**Superficie UI:** pagina-settings → User Management → OPL Settings / OPCloud Settings (campos con valores efectivos).
**Gesto canonico:** ninguno al heredar; edicion normal al override.

**Historia:**
> Como modelador, quiero heredar los defaults de mi organizacion hasta que decida sobrescribir un parametro concreto, para beneficiarme de las convenciones sin perder autonomia.

**Contexto de negocio:**
El mecanismo override-per-user sobre default-per-org es la forma canonica de balancear consistencia con flexibilidad. Sin override, el administrador impondria tirania; sin default, cada usuario reinventaria la rueda. La regla "latest-write-wins con fuente" (§4.5) implementa la logica clave.

**Criterios de aceptacion:**
- **Dado** que soy usuario nuevo y NO he modificado ningun setting, **cuando** abro `OPL Settings` u `OPCloud Settings`, **entonces** veo los valores default de la organizacion.
- **Dado** que el administrador cambia un default (HU-80.024) y yo NO lo he sobrescrito, **cuando** refresco mi sesion, **entonces** veo el nuevo valor.
- **Dado** que sobrescribo un parametro localmente, **cuando** el administrador cambia el default, **entonces** mi override prevalece (latest-write-wins con fuente usuario).
- **Dado** que un parametro tiene override local, **cuando** miro la UI, **entonces** **pregunta abierta** (§4.5): ¿hay indicador visual de "override activo"? No observado.
- **Dado** que quiero volver al default organizacional, **cuando** uso `Reset to Default`, **entonces** el parametro vuelve al default de la organizacion (no de fabrica — §11 Q5).

**Reglas y restricciones:**
- Precedencia: `effective(u, p) = u.preferences[p] ?? u.organization.defaults[p] ?? opcloud_default[p]`.
- Los cambios del administrador NO notifican al usuario — **pregunta abierta** (§11 Q11).
- `Reset to Default` restaura al default de organizacion — **pregunta abierta** (§11 Q5).

**Modelo de datos tocado:**
- `user.preferences.*` (escritura al override) — persistente.
- `organization.defaults.*` (lectura al heredar) — persistente.

**Dependencias:**
- Bloqueada por: HU-80.024.
- Relaciona: EPICA-81 (Style/OPL Settings).

**Integraciones:**
- Renderer, OPL, ontologia.

**Notas de evidencia:**
- Fuente: §4.5, §6.4, §7.2, §11 Q5, Q11.
- Transcripcion Intro 25: "unless you change it yourself, you will inherit the organization default".
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (indicador visual, notificacion de cambio, scope de Reset to Default).

**Prioridad:** C.
**Tamano:** M.
**Etiquetas:** [config, ui, inherit, override, precedence, requires-clarification].

---

### HU-80.026 — Impedir visibilidad cross-organizacion de usuarios/grupos

**Actor primario:** AO (administrador de organizacion).
**Actores secundarios:** MN, ME.
**Tipo:** mixto.
**Nivel categorico:** K (regla de aislamiento) primario; U, X secundarios.
**Superficie UI:** pickers de usuario/grupo en todos los modales (permisos, membresia, invitaciones).
**Gesto canonico:** ninguno (filtrado automatico).

**Historia:**
> Como administrador, quiero que los pickers de usuario y grupo muestren solo miembros de mi organizacion para cumplir el aislamiento inter-organizacional exigido por OPCloud.

**Contexto de negocio:**
La regla "no cross-organization sharing" (transcripcion Intro 11) es uno de los invariantes estructurales de OPCloud. Modelos, carpetas, grupos y usuarios viven en un "universo" organizacional aislado. Es un compromiso de privacidad y compliance: una organizacion no puede ver la existencia de usuarios de otra.

**Criterios de aceptacion:**
- **Dado** que soy administrador de la organizacion `Technion`, **cuando** abro el picker de usuarios (en permisos, membresia, etc.), **entonces** veo solo usuarios con `organization_id = Technion`.
- **Dado** que existe un usuario en `MIT`, **cuando** busco su email en mi picker, **entonces** no aparece.
- **Dado** que soy system admin, **cuando** opero, **entonces** **pregunta abierta** (§11 Q2): ¿puedo cambiar de organizacion dentro de Settings? No observado.
- **Dado** que intento via API crear un grupo con un miembro de otra organizacion, **cuando** el backend evalua, **entonces** rechaza la operacion (defensa en profundidad).
- **Dado** que comparto un modelo, **cuando** elijo destinatarios, **entonces** solo veo usuarios de mi organizacion (consistente con Intro 11).

**Reglas y restricciones:**
- Filtro: `WHERE user.organization_id = current_user.organization_id`.
- System admin puede tener excepcion — **pregunta abierta**.
- La regla aplica a usuarios, grupos, modelos y carpetas.

**Modelo de datos tocado:**
- Ninguno nuevo; es regla de query.

**Dependencias:**
- Bloqueada por: HU-80.016 (crear usuarios respetando la regla), HU-80.020 (crear grupos idem).
- Relaciona: EPICA-30 (save/load, aislamiento de modelo), EPICA-40 (permisos).

**Integraciones:**
- Backend de queries.
- Pickers en toda la UI.

**Notas de evidencia:**
- Fuente: §7.1 ("La regla de aislamiento inter-organizacional de Intro 11 (`you cannot share model between organizations`) es consistente con el atributo `organization_id` en User"), §11 Q2.
- Transcripcion Intro 11.
- Clase de afirmacion: confirmado por transcripcion.
- Etiqueta: `requires-clarification` (excepcion system admin).

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [config, admin, isolation, cross-org, invariante, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q80.1** (§11.1): ¿Que vistas exactas presentan `Group Management` y `Organization Management` cuando un administrador las abre? Afecta HU-80.016 a HU-80.022. Todas marcadas `requires-clarification`.
- **Q80.2** (§11.2): ¿System admin tiene selector de organizacion dentro de Settings? Afecta HU-80.026 (excepcion) y HU-80.015 (entradas globales).
- **Q80.3** (§11.3): ¿Desplegables sin `Save` (Spell Checking, Log Sharing, Notes, OPD names) persisten al cambio o al blur? Afecta HU-80.014.
- **Q80.4** (§11.4): ¿Existe audit log de cambios de permisos/roles? HU candidata diferida (no inventariada aqui — ver HU-80.027 potencial).
- **Q80.5** (§11.5): ¿`Reset to Default` restaura al default de organizacion o al de fabrica OPCloud? Afecta HU-80.025.
- **Q80.6** (§11.6): ¿Que sucede con modelos activos cuando el `Model Owner` se desactiva? Afecta HU-80.019.
- **Q80.7** (§11.7): ¿Formato exacto de `Expiration Date` editable por administrador? Afecta HU-80.018.
- **Q80.8** (§11.8): ¿`Log Sharing` es realmente per-usuario o per-organizacion con override? Afecta HU-80.014, HU-80.024.
- **Q80.9** (§11.9): ¿Existe pagina de ajustes globales system visible solo al system admin fuera del arbol User/Group/Organization? Candidata nueva no inventariada.
- **Q80.10** (§11.10): ¿Imagen de perfil se cachea localmente o siempre se resirve? Afecta HU-80.008.
- **Q80.11** (§11.11): ¿Se notifica al usuario cuando el administrador cambia un default que el no habia sobrescrito? Afecta HU-80.025.
- **Q80.12** (§11.12): ¿Pueden coexistir multiples organization admins en una misma organizacion? Afecta HU-80.016 (rol asignable).
- **Q80.13** (candidata de invitacion): El flujo de email de invitacion post-creacion de usuario (HU-80.016) no se observa; podria ser HU-80.028 diferida.
- **Q80.14** (candidata auditoria): Audit log de cambios admin → HU-80.029 diferida hasta confirmar existencia.

## Referencias cruzadas

- **Doc fuente:** `opcloud-reverse/80-config-user-org.md`.
- **Hermano:** `opcloud-reverse/81-config-style-defaults.md` (EPICA-81) cubre los controles visuales/estilisticos que comparten pagina Settings con esta epica. Separacion deliberada: aqui gestion administrativa, alli defaults visuales.
- **Complementaria:** `opcloud-reverse/82-config-organization-ontology.md` (EPICA-82) — la ontologia organizacional vive en `Organization Management` pero su detalle funcional es alli. HU-80.024 apunta al enforcement level como bisagra.
- **Consumidoras:** EPICA-30 (save/load, ownership), EPICA-31 (folders y permisos), EPICA-33 (templates — scope `Private`/`Organization`/`Global` dependiente de rol), EPICA-40 (permisos de modelo — consume usuarios y grupos), EPICA-41 (chat — usa identidades), EPICA-42 (notes — idem).
- **Dependientes de defaults:** EPICA-10 (creacion de cosas — hereda `Things Default Essence`), EPICA-20 (OPD tree — hereda `OPD Tree Arrangement`), EPICA-81 (UI de OPL/Style Settings).
- **Invariantes del repo:** no hay kernel tocado — esta epica es casi completamente `C (config)` con toques de `P (persistencia)` para `user.preferences` y `organization.defaults`. Su aterrizaje en el repo seria un modulo `src/config/` nuevo (no existe actualmente) o delegacion a `src/persistencia/` para workspace-settings.
- **Relacion con produccion:** el modelador core del repo no tiene multi-tenant hoy. Esta epica es `W` (out-of-scope) para MVP-α y MVP-β; se activaria si el producto evoluciona a SaaS multi-organizacional, decision que excede el roadmap actual (EPICA-80 en bloque queda fuera del corte productivo inicial).
- **SSOT OPM:** esta epica no cita `V-xx` porque no toca render OPM. Sus invariantes son los de identidad/autorizacion estandar SaaS, no OPM.
