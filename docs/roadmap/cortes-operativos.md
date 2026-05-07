# Cortes operativos de producto

**Fecha:** 2026-05-07  
**Estado:** capa operativa vigente sobre el backlog HU v2; alpha-lock OPL reverse resuelto.  
**No sustituye:** `docs/historias-usuario-v2/05-ROADMAP.md` ni edita las HU
canonicas.  
**Si gobierna:** planificacion de rondas desde la ronda 13 grande en adelante.

## 1. Decisión de producto

El roadmap deja de optimizar por paridad general con OPCloud y pasa a optimizar
por capacidad real de modelar dominios vivos del operador:

- `/home/felix/projects/hd-dt`
- `/home/felix/projects/hdos`
- `/home/felix/projects/hdos-app`
- KORA/HDOS/HODOM/GOREOS como familia de dominios objetivo.

El usuario primario del siguiente ciclo no es un usuario nuevo ni un modelador
OPM generico. Es el operador modelando sistemas reales complejos con OPM como
lenguaje de pensamiento, validacion y simulacion.

Filtro de valor:

> Una capacidad merece subir de corte si reduce el tiempo entre "tengo un
> dominio real" y "puedo modelarlo, validarlo, corregirlo y simularlo sin
> workaround estructural".

## 2. Dialéctica de recalibración

| Tesis vieja | Antitesis observada | Sintesis operativa |
|---|---|---|
| MVP-alpha termina cuando el core editable/persistente esta casi completo. | Alpha tenia `HU-SHARED-007`: OPL inverso editable. El operador no aceptaba cerrar alpha sin OPL reverse. | **Alpha queda cerrado** cuando OPL reverse pasa parser, preview, apply undoable y smoke. Este gate ya esta resuelto en ronda 14 alpha-lock. |
| MVP-beta = modelador usable para dominio real. | El corte beta vigente mezcla capacidades de dominio real con paridad OPCloud pesada (`A0`, wizard 12 etapas). | Dividir beta en **beta0 foundation**, **beta1 modelado dominio real**, **beta2 simulacion**. |
| Ronda 13 grande abre beta. | Ronda 13 grande es infraestructura UX/metodologica; no prueba todavia KORA/HDOS/GOREOS end-to-end. | Ronda 13 grande pasa a ser **medio piso beta0**, no beta oficial. |
| OPCloud es referente de backlog. | Muchas HU existen solo porque OPCloud las tiene; no todas producen valor para el producto propio. | OPCloud sigue como evidencia semantica/visual, no como obligacion de paridad. HU sin valor para dominios objetivo se bajan, congelan o descartan operativamente. |
| Workspace/carpeta completa es productividad gamma. | Para el operador basta catalogo simple; carpetas/permisos no son necesarios para single-user local. | Beta requiere **catalogo sin carpetas**. Carpetas/permisos salen del camino critico. |
| Wizard de 12 etapas pertenece a la app. | El operador prefiere skill externa para crear modelos asistidos. | EPICA-34 wizard app baja a delta; se crea skill ahora fuera de la app. |

## 3. Escalera operativa desde ronda 13

| Piso | Nombre | Propósito | Gate de salida |
|---|---|---|---|
| **13 grande** | **Beta0 foundation, medio piso en curso** | UX foundation: split Toolbar, tokens central, checkers metodologicos, barra contextual, IFML local. | `browser:smoke` verde, bundle bajo control, toolbar delgado, checkers visibles, acciones contextuales usables. |
| **13.1** | **Normalización IFML + UI bugs** | Modal-stack, flujos explicitos, eventos, breadcrumbs minimos si procede, bugs visuales evidentes. | No quedan flujos criticos opacos ni bugs visuales que bloqueen modelado diario. |
| **13.2** | **Visual-canvas fidelity** | Apariencia exacta de shapes, enlaces, anclaje, routing, cruces y layout aplicable usando `assets/`, `JOYAS.md`, `opm-extracted/`. | Un modelo mediano se ve profesional y estable; los enlaces se entienden sin trabajo manual excesivo. |
| **13.3** | **Bug capture loop dev-only** | Capturar screenshot + texto + metadata en disco con ID referenciable por agentes. | El operador puede decir "arregla BUG-YYYYMMDD-NNN" y el agente puede leer imagen/texto desde el repo local. |
| **14** | **Alpha-lock OPL reverse** | OPL inverso libre completo suficiente para editar desde texto y reconciliar con canvas. | **Cerrado**: parser SSOT + diagnosticos + preview de patches + apply undoable + smoke UI. Alpha queda 100%. |
| **14.1** | **Refinamiento OPM completo sobre Thing — hardening** | Continuar desde el corte `refinamiento OPM completo sobre Thing`: auditar deuda de slots visuales separados (`refineeInzooming`/`refineeUnfolding`/`refineable`), cubrir e2e object-inzoom y process-unfold, y validar OPL especifico de descomposicion de objeto contra SSOT. | Decision documentada sobre slots, 2 smokes nuevos verdes, OPL de object decomposition auditado y corregido si aplica. |
| **Beta1** | **Dominio real mediano** | Modelar HD/KORA/GOREOS con validacion metodologica, tabla de enlaces, busqueda, estados, descomposicion y catalogo simple. | Un modelo ancla real se construye, valida, guarda/carga, busca y corrige sin workaround mayor. |
| **Beta2** | **Simulacion conceptual + valores simples** | Ejecutar simulacion conceptual y valores simples sobre procesos/estados/atributos. | Un flujo real de dominio puede simular estado/valor antes-despues con trazabilidad. |
| **Gamma** | **Productividad operativa secundaria** | Mapa del sistema, export, imagenes, estilos avanzados, plantillas avanzadas, organizacion no critica. | Trabajo largo mas comodo, no requisito para probar beta. |
| **Delta** | **Capacidades especializadas** | Estereotipos, wizard app, colaboracion, permisos, simulacion avanzada, runtime externo, IA generativa. | Solo suben con necesidad concreta y eval asociado. |

## 4. Corte alpha-lock

### Propósito

Cerrar el core OPM de forma honesta. Alpha se considera cerrada cuando OPL
reverse deja de ser parcial y puede editar OPL-ES canonico con propagacion al
canvas.

### Incluye

- Todo el alpha ya cubierto por rondas 1-13.
- `HU-SHARED-007` resuelta como bloqueo final.
- Parser OPL-ES, diagnosticos, preview de patches y aplicacion undoable.

### OPL reverse esperado

El operador eligio **libre completo**. La gramatica exacta queda fijada por la
auditoria dirigida `docs/auditorias/2026-05-07-opl-reverse-ssot-opm-extracted.md`.

Interpretacion operativa resuelta:

- Acepta parrafos OPL-ES canonicos escritos por humano, no solo OPL generado
  por la app.
- Reconoce la gramatica formal del Apendice A de `opm-opl-es.md`: descripcion
  de cosas, procedimental, estructural y gestion de contexto.
- Produce AST tipado, binder semantico contra el modelo, diagnosticos y
  `PatchOplPropuesto[]`; no muta el modelo durante parse/bind.
- Reconoce entidades, procesos, estados, enlaces canonicos, OPDs visibles
  (`SD`, `SD1`, etc.) y los resuelve contra identidad persistente interna.
- Puede crear y actualizar elementos del modelo desde OPL cuando la sentencia
  es semantica y operacionalmente valida.
- Emite diagnosticos claros cuando una frase no puede mapearse al kernel,
  cuando el nombre es ambiguo o cuando una produccion OPL valida pertenece a
  una capacidad aun no soportada por el kernel.
- Ofrece preview/diff antes de aplicar cambios destructivos.
- Aplica cambios como operacion undoable y atomica.
- Preserva round-trip semantico: canvas -> OPL -> parser -> modelo -> OPL sin
  perdida de hechos OPM para el subconjunto soportado por el kernel actual.

Estado 2026-05-07:

- Implementado en `app/src/opl/parser/` con `parsearParrafoOpl`,
  `planificarEdicionOplLibre` y `aplicarPatchesOpl`.
- UI en `PanelOpl`: boton `Editar`, textarea, diagnosticos, preview y `Aplicar`.
- Store: `aplicarEdicionOplLibre` entra por `commitModelo`, por tanto es
  undoable y respeta read-only.
- Evals: `app/src/opl/parser/parser.test.ts`, `store.test.ts` y smoke
  `panel OPL aplica edicion libre con preview y propaga al canvas`.
- Dashboard: MVP-alpha **100.0%** (121 cubiertas, 0 parciales, 0 pendientes).

### Anti-alcance

- No exige entender lenguaje natural arbitrario fuera de gramatica OPL.
- No exige resolver ambiguedades sin pedir confirmacion.
- No borra hechos por mera ausencia de una linea en el texto editado; los
  deletes implicitos requieren modo estricto separado y confirmacion.
- No usa etiquetas visibles `SD*` como identidad persistente.
- No clona el panel OPL de OPCloud: `opm-extracted` aporta render/export/UX de
  highlight y doble click, pero no parser inverso libre reutilizable.
- No exige simulacion.

## 5. Beta0 foundation

### Propósito

Preparar la app para modelado real. No es beta oficial; es el medio piso que
evita construir beta sobre chrome, flujos y validacion debiles.

### Incluye ronda 13 grande

- Split `Toolbar.tsx` por modo del editor.
- Tokens central + lint contra literales de color UI.
- Checkers metodologicos destilados de OPCloud.
- `PanelMetodologia` como vista derivada por DataFlow.
- `BarraHerramientasElemento` como toolbar contextual CN-SOT/CN-MOT.
- Lazy splits y control de bundle.

### Incluye normalizaciones 13.1-13.3

- IFML flow cleanup: modal-stack, eventos tipados o reemplazados, flujos
  visibles.
- UI bugs visuales que bloqueen uso diario.
- Apariencia exacta de shapes como prioridad visual primaria.
- Enlaces, anclajes, routing y cruces.
- Autolayout como **vista sugerida / aplicar layout**, no como movimiento
  persistente automatico.
- Capturador de bugs dev-only.

## 6. Beta1 — modelado de dominio real

### Propósito

Modelar dominios reales medianos con validacion metodologica. Los dominios
ancla son `hd-dt`, `hdos`, `hdos-app` y la familia KORA/HDOS/HODOM/GOREOS.

### Capacidades nucleares

| Capacidad | Fuente HU/capa | Decisión |
|---|---|---|
| Descomposicion robusta | EPICA-12 | Beta1. |
| Estados y designaciones | EPICA-13 | Beta1. |
| Enlaces avanzados | EPICA-15 | Beta1. |
| Tabla de enlaces y propiedades | EPICA-16 | **Sube como eje beta fuerte**. |
| Traer conectados residual | EPICA-1B | Beta1 si hay residuo real. |
| Validacion metodologica | EPICA-1C | **Nucleo beta**. |
| Busqueda intra-modelo | EPICA-35 | **Sube desde gamma a beta**. |
| Catalogo simple de modelos | EPICA-30/31 subset | Beta1, **sin carpetas**. |
| Workspace con carpetas/permisos | EPICA-31 completa | Fuera de beta. |
| Mapa del sistema | EPICA-21 | Gamma; visualizacion secundaria. |

### Eval de salida

Beta1 solo cierra cuando al menos un dominio ancla real:

1. se modela con multiples OPDs;
2. usa descomposicion, estados, enlaces avanzados y propiedades;
3. pasa validacion metodologica con avisos accionables;
4. permite buscar elementos y navegar al resultado;
5. permite inspeccionar/editar enlaces desde tabla;
6. guarda/carga sin perdida;
7. no requiere editar JSON ni usar workaround de desarrollo.

## 7. Beta2 — simulación

### Propósito

Agregar simulacion suficiente para razonar sobre dominio real sin saltar a
runtime externo.

### Alcance aceptado

- Simulacion conceptual de procesos/estados.
- Valores simples sobre atributos.
- Cambios de estado/valor antes-despues.
- Ejecucion paso a paso o corrida simple.
- Trazabilidad de por que cambio cada valor/estado.

### Fuera de beta2

- Funciones definidas por usuario.
- Probabilidad avanzada.
- MQTT/HTTP/ROS.
- Integracion backend.
- Simulacion distribuida o multiusuario.

## 8. Gamma

Gamma deja de ser "todo lo que OPCloud tiene para productividad" y pasa a ser
comodidad operativa secundaria.

Incluye:

- Mapa del sistema como visualizacion secundaria.
- Export PDF/SVG si hay necesidad concreta de comunicacion externa.
- Imagenes incrustadas.
- Estilo visual avanzado no bloqueante.
- Plantillas avanzadas.
- Notas adhesivas.
- Organización avanzada no necesaria para beta.
- Import CSV si hay caso real de datos tabulares.

## 9. Delta

Delta contiene capacidades costosas o sin eval inmediato.

| Capacidad | Decisión |
|---|---|
| A0 estereotipos OPM | **Delta**, no beta. |
| EPICA-34 wizard app 12 etapas | **Delta**; se crea skill externa ahora. |
| Colaboracion multiusuario/permisos/chat | Delta. |
| Configuracion usuarios/org/defaults | Delta. |
| IA generativa en app | Delta. |
| Simulacion avanzada B2-B5 | Delta. |
| Runtime externo C0-C2 | Delta. |
| Analisis D0/D1 | Delta. |

## 10. Descartar, congelar o bajar por OPCloud parity

Regla:

> Una HU que existe solo porque OPCloud la tiene no sube a ningun corte si no
> sirve a KORA/HDOS/GOREOS o no tiene eval observable.

Tratamiento:

- **Descartar operativamente**: si contradice el producto propio o no aporta
  valor plausible.
- **Congelar**: si podria servir, pero no hay dominio/eval.
- **Bajar a delta**: si requiere infraestructura o complejidad significativa.
- **Mantener como referencia historica**: sin contar en planificacion.

EPICA-70 y EPICA-91 ya estan descartadas del proyecto y no deben contaminar
pendientes operativos.

## 11. Capturador de bugs dev-only

### Propósito

Cerrar el loop humano-agente sobre bugs visuales sin depender de descripciones
fragiles en chat.

### Contrato

- Dev-only.
- No feature de usuario final.
- No versiona capturas.
- Guarda en disco local bajo ruta gitignored.

Estructura propuesta:

```text
app/bug-reports/
  index.json
  BUG-20260507-001/
    screenshot.png
    reporte.md
    metadata.json
```

Contenido minimo:

- ID estable (`BUG-YYYYMMDD-NNN`).
- Screenshot.
- Texto del operador.
- Ruta/pantalla actual.
- Modelo activo si aplica.
- Seleccion actual si aplica.
- Timestamp.
- Version git corta.

Eval:

> El operador puede decir "arregla BUG-20260507-001" y el agente puede leer
> screenshot + texto + metadata sin pedir contexto adicional.

## 12. Ajuste futuro del dashboard

No se editan HU canonicas en esta fase. El ajuste recomendado es agregar una
capa operativa al dashboard:

- corte canonico original (`alpha/beta/gamma/delta`);
- corte operativo (`alpha-lock/beta0/beta1/beta2/gamma/delta/congelado/descartado`);
- razon de override;
- dominio/eval que lo justifica.

Hasta que esa capa exista, este documento gobierna la planificacion manual de
rondas.

## 13. Preguntas abiertas que no bloquean este documento

1. Elegir el primer dominio ancla entre `hd-dt`, `hdos` y `hdos-app`.
2. Decidir si GOREOS tiene corpus local verificable o queda como familia futura.
3. Definir si el catalogo simple vive en `DialogoCargarModelo`, pantalla inicio
   o una vista propia.
4. Definir si el bug capture dev-only usa endpoint Vite, script local o ambos.

Resuelto el 2026-05-07: la gramatica exacta de `OPL reverse libre completo`
queda fijada por `docs/auditorias/2026-05-07-opl-reverse-ssot-opm-extracted.md`.
