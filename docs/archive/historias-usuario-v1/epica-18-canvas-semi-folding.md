---
epica: "EPICA-18"
titulo: "Canvas — semi-plegado (vista compacta de refinadores intra-rectangulo)"
doc_fuente: "opcloud-reverse/18-canvas-semi-folding.md"
estado: "revision-piloto"
last_check: 2026-04-28
prioridad_predominante: "S"
hu_emitidas: 15
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
evidencia_opcloud: "/home/felix/projects/deep-opm-pro/"
ultima_actualizacion: 2026-04-23
---

## Resumen

Esta epica cubre el **modo intermedio** entre la vista plegada (`folded`) y la vista completamente desplegada (`unfolded` u OPD hijo via descomposicion) de una cosa refinable. Semi-plegado permite **ver las partes dentro del rectangulo padre** sin abrir un OPD nuevo ni poblar el canvas con proxies sueltos, y **extraer selectivamente** una parte para trabajarla conservando el vinculo con el compacto.

La operacion cambia unicamente la **vista del OPD actual**; no crea OPDs hijos ni altera el grafo de refinamiento. Pero es **operativa**, no solo decorativa: las partes semi-plegadas pueden participar en enlaces, y cuando una parte extraida se reinserta, los enlaces a ella se redirigen al proxy compactado sin duplicar apariencias.

El tridente conceptual que distingue esta epica de sus vecinas:

- EPICA-12 (descomposicion): crea OPD hijo dedicado al refinamiento.
- EPICA-18 (semi-plegado — esta epica): muestra partes **inside** el rectangulo en el OPD actual.
- EPICA-20 (OPD tree): navegacion entre OPDs; no altera la vista local.

Las HU se numeran siguiendo la aparicion en el doc fuente, sin reordenar por prioridad.

## Tabla de HU de la epica

| ID | Titulo | Actor | Prioridad | Tamano | Tipo | SSOT |
|---|---|---|---|---|---|---|
| HU-18.001 | Activar vista semi-plegada desde halo/toolbar contextual sobre objeto refinable | ME | S | M | mixto | [ISO §Tabla de equivalencia] |
| HU-18.002 | Renderizar partes compactadas como lista vertical dentro del rectangulo padre | MN | S | M | mixto | [ISO §Tabla de equivalencia] [V-1] |
| HU-18.003 | Mostrar badge "has parts" en el rectangulo padre cuando esta en plegado | MN | S | S | mixto | [ISO §Tabla de equivalencia] |
| HU-18.004 | Extraer parte del compacto con doble clic | ME | S | M | mixto | [ISO §Tabla de equivalencia] |
| HU-18.005 | Mostrar contador de partes ocultas cuando hay extraccion parcial | MN | S | S | mixto | [ISO §Tabla de equivalencia] |
| HU-18.006 | Reinsertar parte extraida con accion hover sobre el enlace | ME | S | M | mixto | [ISO §Tabla de equivalencia] |
| HU-18.007 | Volver de semi-plegado a plegado completo | MN | S | S | mixto | [ISO §Tabla de equivalencia] |
| HU-18.008 | Conectar enlace desde una parte semi-plegada a otra cosa del canvas | ME | S | M | mixto | [ISO §Tabla de equivalencia] [V-61] |
| HU-18.009 | Redirigir enlaces al proxy compactado al reinsertar parte extraida | ME | S | M | mixto | [ISO §Tabla de equivalencia] |
| HU-18.010 | Ver eco OPL con resumen "and N more parts" para semi-plegado | MN | S | S | mixto | [ISO §Tabla de equivalencia] [OPL-ES] |
| HU-18.011 | Persistir view_mode_by_opd al guardar el modelo | ME | S | M | mixto | [ISO §Tabla de equivalencia] |
| HU-18.012 | Diferenciar semi-plegado de descomposicion clasica en la eleccion de la operacion | ME | S | S | mixto | [ISO §Tabla de equivalencia] |
| HU-18.013 | Navegar al OPD desplegado desde el rectangulo semi-plegado | ME | C | S | mixto | [ISO §Tabla de equivalencia] |
| HU-18.014 | Bloquear vista semi-plegada cuando la cosa no tiene refinadores | MN | S | XS | mixto | [ISO §Tabla de equivalencia] |
| HU-18.015 | Preservar orden compacto (compact_order) de las partes en semi-plegado | ME | C | S | mixto | [ISO §Tabla de equivalencia] |

Total: **15 historias de usuario** (15 mixto).

## Historias de usuario

### HU-18.001 — Activar vista semi-plegada desde halo/toolbar contextual sobre objeto refinable

**Actor primario:** ME (modelador experto).
**Actores secundarios:** MN (novato — lo descubre al explorar el halo).
**Tipo:** mixto.
**Nivel categorico:** U primario; V (cambio de render) secundaria; K (sin mutacion del modelo semantico, solo view-mode).
**Superficie UI:** halo radial + toolbar-contextual sobre cosa seleccionada.
**Gesto canonico:** clic en accion `Semi-Folded View` del halo o de la toolbar contextual.

**Historia:**
> Como modelador experto, quiero activar `Semi-Folded View` sobre una cosa ya refinada para ver sus partes dentro del rectangulo padre sin abrir un OPD hijo ni poblar el canvas con proxies sueltos.

**Contexto de negocio:**
En modelos densos, abrir un OPD hijo por cada refinamiento fuerza una navegacion constante y fragmenta el contexto. Semi-plegado ofrece una vista **inline** que mantiene todo en el mismo OPD pero evita el ruido visual del despliegue completo. Es una operacion de **vista**, no de modelo: cambia como se ve, no que existe.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa refinable seleccionada (con al menos un refinador), **cuando** abro el halo o la toolbar contextual, **entonces** veo la accion `Semi-Folded View`.
- **Dado** que hago clic en `Semi-Folded View`, **cuando** se ejecuta, **entonces** el rectangulo padre cambia su render a modo compacto y las partes internas se listan verticalmente adentro.
- **Dado** que active semi-plegado, **cuando** consulto el modelo kernel, **entonces** **no** hay mutacion de refinadores ni del grafo estructural — solo cambio `cosa.view_mode_by_opd` para el OPD actual.
- **Dado** que la cosa no tiene refinadores, **cuando** abro el halo, **entonces** la accion aparece deshabilitada (ver HU-18.014).

**Reglas y restricciones:**
- La operacion es local al OPD actual — no propaga a otros OPDs donde la misma cosa aparezca.
- Nomenclatura literal observada: `Semi-Folded View`.
- No requiere confirmacion.

**Modelo de datos tocado:**
- `cosa.view_mode_by_opd[opd_id]` — `"folded" | "unfolded" | "semi_folded"` — persistente (ver HU-18.011).

**Dependencias:**
- Bloqueada por: EPICA-12 (la cosa debe estar previamente desplegada en algun OPD para tener refinadores).
- Bloquea a: HU-18.002, HU-18.003, HU-18.004, HU-18.007.

**Integraciones:**
- Renderer JointJS (`src/render/jointjs/`) — factory de shape compacto.
- Lente OPL — cambia el fraseo (ver HU-18.010).
- OPD tree (EPICA-20) — el estado de vista puede reflejarse en el arbol.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: `opcloud-reverse/18-canvas-semi-folding.md` §2, §3.1, §4.3.
- Frames: frame_00009, frame_00011.
- Transcripcion: "activa `Semi-Folded View`. La cosa conserva una sola silueta en el canvas, pero ahora lista sus partes internamente en vista compacta".
- Clase de afirmacion: observado + confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, ui, semi-plegado, halo, toolbar-contextual].

---

### HU-18.002 — Renderizar partes compactadas como lista vertical dentro del rectangulo padre

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V primario; L (lente — lee refinadores) secundaria.
**Superficie UI:** canvas-render (shape compacto).
**Gesto canonico:** ninguno (render declarativo post-activacion).

**Historia:**
> Como modelador, quiero ver las partes del rectangulo padre como una lista vertical con triangulo pequeno y nombre para reconocerlas de un vistazo sin abrir otro OPD.

**Contexto de negocio:**
La convencion observada en OPCloud es una **lista vertical corta**, no un mini-diagrama libre. Esto mantiene la compacidad visual y evita que semi-plegado compita con la descomposicion clasica. El triangulo pequeno es la marca visual que identifica cada fila como "refinador".

**Criterios de aceptacion:**
- **Dado** que una cosa esta en `semi_folded`, **cuando** miro el canvas, **entonces** adentro del rectangulo veo las partes apiladas como filas verticales.
- **Dado** que cada fila representa un refinador, **cuando** la miro, **entonces** tiene un triangulo pequeno junto al nombre del refinador (convencion observada §9).
- **Dado** que el rectangulo padre tiene 5 partes y todas estan compactadas, **cuando** miro el canvas, **entonces** veo las 5 filas sin scroll interno (el rectangulo crece verticalmente para acomodarlas).
- **Dado** que una parte tiene nombre largo, **cuando** se renderiza, **entonces** el nombre se trunca con elipsis o el rectangulo se ensancha — regla exacta sujeta a SSOT visual.

**Reglas y restricciones:**
- Orden vertical de las filas respeta `refiner.compact_order` (ver HU-18.015).
- Render: lista vertical, NO mini-diagrama libre con posiciones 2D.
- Triangulo pequeno es el marcador canonico de "refinador" (distinto del triangulo grande de aggregation).
- El rectangulo padre ajusta altura dinamicamente al numero de partes visibles.

**Modelo de datos tocado:**
- Lectura de `cosa.refiners[]` desde el kernel.
- `refiner.visibility_in_opd[opd_id]` — `"inside_compact" | "extracted"` — persistente.

**Dependencias:**
- Bloqueada por: HU-18.001.
- Bloquea a: HU-18.003, HU-18.004.

**Integraciones:**
- Renderer JointJS — factory de shape compacto con sub-items.
- Layout (`src/render/layout/`) — pass que calcula altura del padre segun partes visibles.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado; [V-1] valores por defecto.
- Fuente: §3.1, §9.
- Frames: frame_00011, frame_00015.
- Transcripcion: "las partes compactadas se apilan como lista vertical corta, no como mini-diagrama interno libre".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, render, semi-plegado, layout, lista-vertical].

---

### HU-18.003 — Mostrar badge "has parts" en el rectangulo padre cuando esta en plegado

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V primario.
**Superficie UI:** canvas-render (sobre shape en modo plegado).
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador novato, quiero ver un badge visual sobre el rectangulo padre cuando tiene partes refinadas aunque este en plegado para saber que puedo desplegarlo o semi-desplegarlo.

**Contexto de negocio:**
Sin un indicador visual, el modelador no tiene forma de saber que una cosa esta refinada en otro lado. Esa invisibilidad mata el descubrimiento: si una cosa tiene partes pero la vista actual no las muestra, el modelador asume que esta vacia. El badge hace explicito el refinamiento latente.

**Criterios de aceptacion:**
- **Dado** que una cosa tiene >=1 refinador pero su `view_mode_by_opd` es `folded`, **cuando** la renderizo, **entonces** muestra un badge (icono pequeno, simbolo canonico OPM) indicando "has parts".
- **Dado** que la misma cosa pasa a `semi_folded`, **cuando** se re-renderiza, **entonces** el badge se oculta (las partes ahora son visibles inline).
- **Dado** que una cosa no tiene refinadores, **cuando** la renderizo, **entonces** NO hay badge.
- **Dado** que hago hover sobre el badge, **cuando** aparece tooltip, **entonces** indica el numero de partes refinadas y sugiere la accion `Semi-Folded View` o `Unfold`.

**Reglas y restricciones:**
- El simbolo exacto del badge sujeto a SSOT visual (`ssot/opm-visual-es.md` V-xx) — pregunta abierta si es un triangulo canonico OPM u otro glyph.
- El badge no debe interferir con el nombre ni con los conectores del shape.
- Posicion: esquina o borde del rectangulo, canonicamente observada.

**Modelo de datos tocado:**
- Lectura derivada de `cosa.refiners.length > 0` y `view_mode_by_opd[opd_id] === "folded"`.

**Dependencias:**
- Bloqueada por: EPICA-12 (refiners existen solo si la cosa fue desplegada alguna vez).
- Bloquea a: HU-18.001 (el badge invita a activar semi-plegado).

**Integraciones:**
- Renderer JointJS.
- Tooltip (superficie UI compartida con halo).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §2 tabla "Lista compacta de partes" + §3.1 paso 3 ("la cosa queda en plegado, marcada como refinada en otra parte").
- Frames: frame_00001 (baseline plegado/desplegado).
- Clase de afirmacion: inferido (el texto dice "marcada como refinada"; la marca exacta no esta detallada — badge es la hipotesis de renderizado canonico).
- Etiqueta: `requires-clarification` por el glyph exacto.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, semi-plegado, badge, affordance, requires-clarification].

---

### HU-18.004 — Extraer parte del compacto con doble clic

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; V (render cambia) secundaria.
**Superficie UI:** canvas-render (fila de parte dentro del rectangulo semi-plegado).
**Gesto canonico:** doble clic sobre la fila de la parte.

**Historia:**
> Como modelador experto, quiero hacer doble clic sobre una parte del compacto para sacarla al canvas como cosa trabajable sin perder su vinculo con el padre.

**Contexto de negocio:**
Semi-plegado es util precisamente porque permite **operaciones selectivas**: trabajar una parte especifica sin desplegar todo. El doble clic es el gesto canonico observado para "extraer" una parte y convertirla en proxy editable en el canvas.

**Criterios de aceptacion:**
- **Dado** que una cosa esta en `semi_folded` con partes visibles internas, **cuando** hago doble clic sobre una fila de parte, **entonces** esa parte se materializa como cosa normal en el canvas fuera del rectangulo padre.
- **Dado** que extraje una parte, **cuando** miro el padre, **entonces** esa parte ya no aparece dentro del compacto y el contador de ocultas se actualiza (ver HU-18.005).
- **Dado** que la extraje, **cuando** consulto el modelo, **entonces** `refiner.visibility_in_opd[opd_id] = "extracted"` y la parte conserva su identidad (mismo `cosa.id`).
- **Dado** que la parte extraida participa en enlaces, **cuando** los creo, **entonces** son enlaces reales en el modelo (no decorativos) — ver HU-18.008.
- **Dado** que hago doble clic sobre una fila, **cuando** no aplica extraccion (p.ej. el padre no esta en semi-plegado), **entonces** el gesto NO hace nada o abre renombrado — comportamiento exacto sujeto a SSOT.

**Reglas y restricciones:**
- El doble clic afecta solo la parte clickeada, no todas.
- La extraccion es **reversible** (ver HU-18.006).
- La identidad de la parte se preserva: es la misma entidad, cambia solo su visibilidad en este OPD.
- Posicion inicial de la parte extraida: al lado del padre — regla exacta sujeta a layout algoritmo.

**Modelo de datos tocado:**
- `refiner.visibility_in_opd[opd_id]` — `"inside_compact" | "extracted"` — persistente.
- `hidden_refiners_count` — derivado — transitorio.

**Dependencias:**
- Bloqueada por: HU-18.001, HU-18.002.
- Bloquea a: HU-18.005, HU-18.006, HU-18.008, HU-18.009.

**Integraciones:**
- Layout — colocar la parte extraida sin solapar.
- OPL pane — el fraseo puede cambiar si la parte extraida ya es visible por nombre propio.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §3.2, §5.1.
- Frames: frame_00015 (parte extraida y contador).
- Transcripcion: "el usuario hace doble clic sobre una de las partes internas. Esa parte sale del compacto y se materializa como cosa normal en el canvas".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, ui, semi-plegado, doble-clic, extraccion].

---

### HU-18.005 — Mostrar contador de partes ocultas cuando hay extraccion parcial

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** V primario; L (lente) secundaria.
**Superficie UI:** canvas-render (sobre rectangulo semi-plegado) o sobre proxy estructural.
**Gesto canonico:** ninguno (render declarativo).

**Historia:**
> Como modelador, quiero ver un contador con el numero de partes ocultas cuando algunas estan extraidas para saber cuantas me falta mostrar sin contar manualmente.

**Contexto de negocio:**
El contador hace explicita la diferencia entre "lo que veo" y "lo que existe". Cuando semi-plegado esta en uso con extraccion parcial, sin el contador el modelador pierde referencia rapida de cuantas partes hay. El contador es un affordance de **integridad**: te dice que hay mas.

**Criterios de aceptacion:**
- **Dado** que un padre tiene 5 refinadores, 2 extraidos y 3 compactados, **cuando** miro el rectangulo semi-plegado, **entonces** veo el numero `3` como filas visibles (o el total del refinamiento se infiere por suma, pero el contador separado expresa **las ocultas**, no el total).
- **Dado** que todas las partes estan dentro del compacto, **cuando** miro el rectangulo, **entonces** el contador de ocultas **no aparece** (0 ocultas).
- **Dado** que todas las partes estan extraidas, **cuando** miro el rectangulo, **entonces** el rectangulo vuelve a la apariencia cercana a plegado con contador que indica el total de extraidas, o el rectangulo oculta el modo interno y reporta "N parts extracted".
- **Dado** que reinserto una parte (ver HU-18.006), **cuando** vuelve al compacto, **entonces** el contador se recalcula automaticamente.

**Reglas y restricciones:**
- El contador expresa **partes faltantes de mostrarse**, no el total del refinamiento (regla dura §4.2 del doc fuente).
- Posicion: junto al proxy estructural o al borde del rectangulo padre — SSOT visual define el glyph exacto.
- Se suprime en exportaciones (PDF/SVG) — pregunta abierta §11.3.

**Modelo de datos tocado:**
- `hidden_refiners_count` — derivado de `refiners[].visibility_in_opd[opd_id] === "extracted"` — transitorio.

**Dependencias:**
- Bloqueada por: HU-18.004.

**Integraciones:**
- Renderer — glyph del contador.
- Exporters (EPICA-60, EPICA-61) — comportamiento en export pendiente.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §2 tabla "Indicador de partes ocultas", §3.2, §4.2, §11.3.
- Frames: frame_00015.
- Transcripcion: "aparece un contador pequeno indicando cuantas faltan".
- Clase de afirmacion: observado + confirmado por §4.2.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, render, semi-plegado, contador, indicador].

---

### HU-18.006 — Reinsertar parte extraida con accion hover sobre el enlace

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; V (render cambia) secundaria.
**Superficie UI:** canvas-render (enlace desde padre a parte extraida) + icono hover.
**Gesto canonico:** hover sobre el enlace/icono asociado, clic en accion emergente.

**Historia:**
> Como modelador experto, quiero hacer hover sobre el enlace de una parte extraida y usar un icono para devolverla al compacto sin perder sus enlaces ni renombrar.

**Contexto de negocio:**
La extraccion es reversible por diseno: cuando termine de trabajar una parte, quiero re-compactarla sin destruir lo que construi. El hover + icono es la afordance observada, menos invasiva que un dialogo.

**Criterios de aceptacion:**
- **Dado** que una parte esta extraida con un enlace al padre, **cuando** hago hover sobre el enlace o la parte extraida, **entonces** aparece un icono (o tooltip con accion) que ofrece "reinsertar al compacto".
- **Dado** que hago clic en la accion de reinsercion, **cuando** se ejecuta, **entonces** la parte desaparece del canvas como cosa suelta y reaparece como fila dentro del padre semi-plegado.
- **Dado** que reinserto la parte, **cuando** consulto el modelo, **entonces** `refiner.visibility_in_opd[opd_id] = "inside_compact"` y el contador de ocultas se recalcula.
- **Dado** que la parte tenia enlaces a otras cosas del canvas, **cuando** se reinserta, **entonces** los enlaces se redirigen al proxy compactado (ver HU-18.009), sin destruirse.

**Reglas y restricciones:**
- La accion es reversible: reinsertar no destruye refinador ni enlaces.
- El hover es el trigger canonico, no el clic directo.
- El icono de reinsercion es distinto al de eliminacion (debe ser claramente "compactar/devolver", no "borrar").

**Modelo de datos tocado:**
- `refiner.visibility_in_opd[opd_id]` — transicion `"extracted" → "inside_compact"` — persistente.
- Enlaces: cambio de endpoint visual (ver HU-18.009).

**Dependencias:**
- Bloqueada por: HU-18.004.
- Bloquea a: HU-18.009.

**Integraciones:**
- Renderer — redibuja el shape.
- Layout — reorganiza si hay otros shapes afectados.
- Kernel — no altera refiners, solo visibilidad.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §2 tabla "Icono/enlace de reinsercion", §3.3, §5.1.
- Frames: frame_00025 (reinsercion y vista compacta estable).
- Transcripcion: "hace hover sobre el enlace o el icono asociado a la parte extraida. Activa la accion de reinsercion".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, ui, semi-plegado, hover, reinsercion].

---

### HU-18.007 — Volver de semi-plegado a plegado completo

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario; V (render cambia) secundaria.
**Superficie UI:** halo/toolbar-contextual.
**Gesto canonico:** clic en accion `Folded View` (o toggle inverso de `Semi-Folded View`).

**Historia:**
> Como modelador, quiero volver a la vista plegada completa desde semi-plegado para compactar el rectangulo al minimo y reducir ruido visual.

**Contexto de negocio:**
Semi-plegado → plegado es el camino reverso natural. El usuario puede explorar en semi-plegado, extraer partes, trabajar, y luego querer volver a la vista mas compacta posible. Esta operacion es simetrica a la activacion (HU-18.001) y preserva el modelo.

**Criterios de aceptacion:**
- **Dado** que una cosa esta en `semi_folded` (con o sin partes extraidas), **cuando** hago clic en `Folded View`, **entonces** el rectangulo se compacta: partes extraidas se reinsertan automaticamente y el rectangulo oculta el listado interno.
- **Dado** que paso a `folded`, **cuando** consulto el modelo, **entonces** `view_mode_by_opd[opd_id] = "folded"` y todas las visibilidades de refiners en este OPD vuelven a `inside_compact`.
- **Dado** que la cosa tiene partes refinadas, **cuando** pasa a plegado, **entonces** aparece el badge "has parts" (HU-18.003).
- **Dado** que habia enlaces a partes extraidas, **cuando** se compactan, **entonces** todos los enlaces se redirigen al proxy del padre (HU-18.009) sin destruirse.

**Reglas y restricciones:**
- La operacion es reversible: plegado → semi-plegado conserva el estado.
- El cambio de modo no altera refiners ni enlaces en el modelo semantico.
- Nomenclatura canonica sujeta a OPCloud: puede aparecer como `Folded View` o como toggle del mismo control de semi-plegado.

**Modelo de datos tocado:**
- `cosa.view_mode_by_opd[opd_id]` — transicion `"semi_folded" → "folded"` — persistente.
- Todos los `refiner.visibility_in_opd[opd_id]` vuelven a `"inside_compact"`.

**Dependencias:**
- Bloqueada por: HU-18.001.
- Integra: HU-18.009 (rewire).

**Integraciones:**
- Renderer — redibuja en modo plegado.
- OPL pane — cambia fraseo (HU-18.010).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §3.1 (secuencia de estados), §5.2 (parametros implicitos).
- Clase de afirmacion: inferido — el doc fuente describe la transicion plegado → desplegado → semi-plegado, pero no explicita el retorno a plegado. Razonable como operacion simetrica.
- Etiqueta: `requires-clarification` por nomenclatura exacta del control.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, semi-plegado, plegado-reverso, requires-clarification].

---

### HU-18.008 — Conectar enlace desde una parte semi-plegada a otra cosa del canvas

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** K primario (crea enlace); U secundaria (drag).
**Superficie UI:** canvas + fila de parte dentro de rectangulo semi-plegado (o proxy extraido).
**Gesto canonico:** drag desde la parte (extraida o fila del compacto) hasta otra cosa.

**Historia:**
> Como modelador experto, quiero arrastrar un enlace desde una parte semi-plegada hacia otra cosa del canvas para modelar relaciones reales aunque la parte este compactada.

**Contexto de negocio:**
Esto es el punto **operativo critico** de semi-plegado: no es solo compresion visual, es un **proxy editable**. El modelador puede conectar partes compactadas con otras cosas del diagrama como si la parte estuviera plenamente visible. El enlace resultante es real en el modelo kernel.

**Criterios de aceptacion:**
- **Dado** que una parte esta semi-plegada (fila en compacto o extraida), **cuando** hago drag desde la parte hasta una cosa externa, **entonces** se abre la tabla de enlaces (HU-10.007+) y al confirmar se crea un enlace con `link.source = parte.id`, `link.target = otra_cosa.id`.
- **Dado** que el enlace existe y la parte esta `inside_compact`, **cuando** miro el canvas, **entonces** el enlace sale del rectangulo padre hacia la cosa externa con un modo de endpoint que representa el proxy (ver HU-18.009).
- **Dado** que el enlace existe, **cuando** consulto el modelo, **entonces** el enlace apunta semanticamente a la parte (NO al padre), aunque visualmente salga del padre.
- **Dado** que extraigo la parte despues, **cuando** se extrae, **entonces** el enlace se redirige visualmente a la parte extraida sin cambiar `link.source/target` del kernel.

**Reglas y restricciones:**
- La semantica del enlace es **del kernel**, no del renderer: apunta a la parte, no al padre.
- El render del endpoint depende de si la parte esta `inside_compact` o `extracted` (campo `link.endpoint_proxy_mode`).
- Esto requiere que el kernel soporte enlaces a entidades que estan visualmente dentro de un compacto — invariante: la identidad de la parte no cambia.

**Modelo de datos tocado:**
- `link.source`, `link.target` — IDs — persistente.
- `link.endpoint_proxy_mode` — `"direct" | "via_parent_proxy"` — persistente (ver §6 modelo implicito).

**Dependencias:**
- Bloqueada por: HU-18.002 (parte debe ser identificable visualmente), HU-10.007+ (mecanismo de drag de enlaces).
- Bloquea a: HU-18.009.

**Integraciones:**
- Renderer — calcular ruteo del enlace desde el proxy visual.
- Kernel validacion — aplicar reglas de enlace legal considerando tipo de parte, no del padre.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado; [V-61] anatomia formal de enlace.
- Fuente: §3.4, §7.3.
- Frames: frame_00020 (enlace hacia parte semi-plegada).
- Transcripcion: "arrastra un enlace desde la parte hacia un proceso u otra cosa. La relacion queda creada aunque la parte luego vuelva a entrar al compacto".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, semi-plegado, proxy-editable].

---

### HU-18.009 — Redirigir enlaces al proxy compactado al reinsertar parte extraida

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario (cambio de render); K (sin mutacion semantica).
**Superficie UI:** canvas-render (endpoint visual del enlace).
**Gesto canonico:** ninguno (consecuencia automatica de HU-18.006 o HU-18.007).

**Historia:**
> Como modelador experto, quiero que los enlaces a una parte extraida se redirijan automaticamente al proxy compactado al reinsertar la parte para no perder los enlaces ni duplicar apariencias.

**Contexto de negocio:**
Este es el contrato **clave** de semi-plegado como superficie operativa: los enlaces no se destruyen ni duplican al compactar; se reconectan al proxy del padre. Sin esta regla, la reinsercion seria destructiva y semi-plegado perderia utilidad.

**Criterios de aceptacion:**
- **Dado** que una parte P esta extraida y tiene enlace L a otra cosa C, **cuando** reinserto P al compacto (via HU-18.006 o HU-18.007), **entonces** L se redirige visualmente: ahora sale del rectangulo padre hacia C, no de P suelta.
- **Dado** que el enlace se redirigio, **cuando** consulto el modelo kernel, **entonces** `link.source = P.id` sigue intacto — solo cambia `link.endpoint_proxy_mode` a `via_parent_proxy`.
- **Dado** que la parte vuelve a extraerse mas tarde, **cuando** ocurre la extraccion, **entonces** el enlace se re-redirige a la parte extraida, `link.endpoint_proxy_mode = "direct"`.
- **Dado** que la parte tenia multiples enlaces, **cuando** se reinserta, **entonces** todos los enlaces se redirigen consistentemente.

**Reglas y restricciones:**
- La reconexion es **solo visual**: el modelo kernel preserva `link.source/target` inmutables.
- No se duplican apariencias: la parte tiene una unica identidad aunque su proxy visual cambie.
- `link.endpoint_proxy_mode` es el campo que captura esta semantica.
- La regla aplica tanto a reinsercion manual (HU-18.006) como a plegado completo (HU-18.007).

**Modelo de datos tocado:**
- `link.endpoint_proxy_mode` — `"direct" | "via_parent_proxy"` — persistente.

**Dependencias:**
- Bloqueada por: HU-18.006, HU-18.008.
- Bloquea a: HU-18.007 (la operacion de plegado depende de este mecanismo).

**Integraciones:**
- Renderer — pass que decide endpoint visual basado en `endpoint_proxy_mode`.
- Layout — ruteo del enlace ajustado.
- Kernel — invariante: NO mutacion de `link.source/target`.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §3.4, §6 (modelo implicito `link.endpoint_proxy_mode`), §9.
- Frames: frame_00025.
- Transcripcion: "cuando la parte se reabsorbe, el enlace se desvia y queda representado hacia el semi-plegado, no hacia una copia externa".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, enlaces, semi-plegado, proxy-rewire].

---

### HU-18.010 — Ver eco OPL con resumen "and N more parts" para semi-plegado

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** L (lente OPL).
**Superficie UI:** opl-pane.
**Gesto canonico:** ninguno (actualizacion automatica).

**Historia:**
> Como modelador, quiero que el OPL verbalice la vista semi-plegada con formato `X consists of A and N more parts` para que la oracion refleje que esta visible y que queda compactado.

**Contexto de negocio:**
OPL es el canal bimodal de OPM. Cuando la vista cambia, OPL debe reflejarlo. En semi-plegado, no es util listar los 10 refinadores si 8 estan compactados; el resumen "and N more parts" captura la intencion de la vista sin perder informacion sobre el total.

**Criterios de aceptacion:**
- **Dado** que un padre `OnStar System` tiene 5 refinadores en semi-plegado, 1 extraida (`Driver`), **cuando** miro el OPL, **entonces** aparece `OnStar System consists of Driver and 4 more parts.`
- **Dado** que pasa a desplegado completo (HU-18.007 inverso), **cuando** cambia, **entonces** el OPL cambia a `OnStar System consists of Driver, A, B, C and D.` (listado completo).
- **Dado** que todas las partes estan en compacto (ninguna extraida), **cuando** miro el OPL, **entonces** aparece `OnStar System consists of 5 parts.` (o formato canonico equivalente — sujeto a verificacion).
- **Dado** que cambia la visibilidad de una parte, **cuando** ocurre el cambio, **entonces** el OPL se regenera en vivo.

**Reglas y restricciones:**
- Formato canonico observado: `X consists of <partes_visibles_por_nombre> and N more parts.` (donde N = ocultas).
- El OPL se regenera desde el modelo + view-mode, no por evento (invariante OPL).
- La pluralizacion inglesa sigue convencion OPM: `1 more part` / `N more parts`.
- Si no hay partes visibles por nombre, formato alternativo: `X consists of N parts.` — pendiente verificacion.

**Modelo de datos tocado:**
- Lectura derivada de `cosa.view_mode_by_opd` + `refiners[].visibility_in_opd`.

**Dependencias:**
- Bloqueada por: HU-18.001.

**Integraciones:**
- Motor OPL (`src/render/opl-renderer.ts`).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado; `opm-opl-es.md` [OPL-ES] plantillas canonicas.
- Fuente: §2 tabla (ejemplo `object one consists of object three and two more parts`), §7.1.
- Transcripcion: "el OPL distingue entre partes explicitadas una por una, y el resto resumido como `and two more parts`".
- Clase de afirmacion: observado + confirmado.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, OPL, lente, semi-plegado].

---

### HU-18.011 — Persistir view_mode_by_opd al guardar el modelo

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** P (persistencia) primario; K (nuevo campo) secundaria.
**Superficie UI:** ninguna (capa persistencia + serializacion).
**Gesto canonico:** Save del modelo (EPICA-30).

**Historia:**
> Como modelador experto, quiero que el estado de semi-plegado persista por OPD al guardar para recuperar la vista exacta al reabrir el modelo, no empezar desde cero.

**Contexto de negocio:**
Si el estado de vista es solo de sesion, cada reapertura vuelve todo a plegado y pierde horas de trabajo de organizacion visual. Persistir `view_mode_by_opd` convierte semi-plegado en una decision de modelado permanente, no un ajuste efimero.

**Criterios de aceptacion:**
- **Dado** que una cosa esta en `semi_folded` con 2 partes extraidas, **cuando** guardo y recargo el modelo, **entonces** al abrir el OPD la cosa recupera `view_mode = semi_folded` y las 2 partes aparecen extraidas en la misma posicion.
- **Dado** que guarde, **cuando** inspecciono el JSON serializado, **entonces** existen los campos `cosa.view_mode_by_opd` y `refiner.visibility_in_opd` por cada par `(cosa, opd)`.
- **Dado** que abro el mismo modelo en otro OPD donde esa cosa tambien aparece, **cuando** miro ese otro OPD, **entonces** el estado de vista es independiente (por OPD, no global).
- **Dado** que abro un modelo antiguo sin estos campos, **cuando** se deserializa, **entonces** el default es `view_mode = folded` y `visibility = inside_compact` para todas las cosas/partes (migracion retrocompatible).

**Reglas y restricciones:**
- Persistencia **por OPD**, no global — pregunta abierta §11.1 del doc fuente parcialmente resuelta aqui como decision de diseno.
- Retrocompatibilidad con modelos sin estos campos.
- El estado de vista NO altera la semantica OPM (se puede exportar ignorando view-mode sin perder el modelo).

**Modelo de datos tocado:**
- `cosa.view_mode_by_opd` — `Record<opd_id, "folded" | "unfolded" | "semi_folded">` — persistente.
- `refiner.visibility_in_opd` — `Record<opd_id, "inside_compact" | "extracted">` — persistente.
- `refiner.compact_order` — number[] — persistente (ver HU-18.015).
- `link.endpoint_proxy_mode` — `"direct" | "via_parent_proxy"` — persistente.

**Dependencias:**
- Bloqueada por: HU-18.001, HU-18.004, HU-18.008.
- Integra: EPICA-30 (Save/Load), EPICA-70 (OPCAT interop — pregunta abierta sobre si OPCAT preserva view-mode).

**Integraciones:**
- Serializador kernel (`src/nucleo/serializacion.ts` analogo).
- Cargador de modelo.
- Exportadores (comportamiento sujeto a config).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §5.2 (parametros implicitos), §6 (modelo de datos implicito), §11.1 (pregunta abierta sobre persistencia).
- Clase de afirmacion: inferido — la pregunta abierta §11.1 no resuelve si es sesion o persistente; esta HU **decide como diseno** que es persistente por OPD, alineado con la filosofia del kernel OPM.
- Etiqueta: `requires-clarification` sobre si OPCAT (interop externa) preserva estos campos.

**Prioridad:** S.
**Tamano:** M.
**Etiquetas:** [persistencia, semi-plegado, view-mode, requires-clarification].

---

### HU-18.012 — Diferenciar semi-plegado de descomposicion clasica en la eleccion de la operacion

**Actor primario:** ME.
**Actores secundarios:** MN (aprendiendo la distincion).
**Tipo:** mixto.
**Nivel categorico:** U primario (UX/pedagogica); L (OPL ayuda).
**Superficie UI:** halo/toolbar-contextual + tooltip pedagogico.
**Gesto canonico:** hover/clic sobre acciones `In-Zoom` vs `Semi-Folded View`.

**Historia:**
> Como modelador experto, quiero que la UI diferencie visualmente `In-Zoom` de `Semi-Folded View` con tooltips explicativos para no confundir las dos operaciones que parecen similares.

**Contexto de negocio:**
La confusion entre descomposicion y semi-plegado es el error tipico del modelador novato:
- **Descomposicion (EPICA-12)**: crea OPD **hijo** dedicado al refinamiento. Cambia de diagrama.
- **Semi-plegado (EPICA-18)**: muestra partes **dentro** del rectangulo en el OPD **actual**. Sigue en el mismo diagrama.

Sin distincion clara en UI, el modelador elige mal y termina con OPDs hijos innecesarios o con diagramas abarrotados.

**Criterios de aceptacion:**
- **Dado** que abro el halo sobre una cosa refinable, **cuando** veo las opciones, **entonces** `In-Zoom` y `Semi-Folded View` aparecen como acciones distintas con iconos distintos.
- **Dado** que hago hover sobre `In-Zoom`, **cuando** aparece tooltip, **entonces** indica "crea un OPD hijo con el refinamiento".
- **Dado** que hago hover sobre `Semi-Folded View`, **cuando** aparece tooltip, **entonces** indica "muestra las partes dentro del rectangulo en este OPD sin cambiar de diagrama".
- **Dado** que ejecuto `In-Zoom`, **cuando** se abre un OPD hijo, **entonces** la vista salta al nuevo diagrama.
- **Dado** que ejecuto `Semi-Folded View`, **cuando** cambia el render, **entonces** sigo en el mismo diagrama sin navegacion.

**Reglas y restricciones:**
- Iconos visualmente distintos — SSOT visual define los glyphs.
- Tooltips en idioma del usuario (es-CL por default, ingles para terminos canonicos OPM como `In-Zoom`).
- La diferencia debe ser inmediatamente legible — esta HU es pedagogica.

**Modelo de datos tocado:**
- Ninguno directo (HU UX).

**Dependencias:**
- Bloqueada por: HU-18.001; relaciona EPICA-12.

**Integraciones:**
- Halo/toolbar — integracion con tooltips.
- Documentacion del producto — alineacion con guia del usuario.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado; [§Tabla de equivalencia] Descomposicion.
- Fuente: §1 (alcance explicito), §4.1 ("Semi-plegado no crea un nuevo OPD"), §7.2.
- Transcripcion: "semi-plegado no sustituye al OPD desplegado: es una vista alternativa en el OPD actual".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** S.
**Etiquetas:** [canvas, ui, semi-plegado, descomposicion, pedagogia, tooltip].

---

### HU-18.013 — Navegar al OPD desplegado desde el rectangulo semi-plegado

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** U primario; integracion con L (navegacion de OPDs).
**Superficie UI:** canvas-render + halo/toolbar.
**Gesto canonico:** doble clic sobre el borde del rectangulo padre semi-plegado o accion `Go to OPD`.

**Historia:**
> Como modelador experto, quiero saltar desde el rectangulo semi-plegado al OPD donde la cosa fue originalmente desplegada para ver el refinamiento completo sin perder contexto del modelo.

**Contexto de negocio:**
Semi-plegado es una vista **resumen** de un refinamiento que vive en otro OPD (el que se creo al hacer Unfold/In-Zoom originalmente). El puente entre ambos es clave: sin el, el modelador no puede "profundizar" cuando la vista resumida no basta.

**Criterios de aceptacion:**
- **Dado** que una cosa esta en `semi_folded` y existe un OPD hijo/equivalente con su refinamiento completo, **cuando** hago doble clic sobre el borde del rectangulo o uso accion `Go to OPD`, **entonces** la vista navega al OPD desplegado.
- **Dado** que la cosa NO tiene un OPD dedicado (solo fue desplegada inline en este OPD), **cuando** intento navegar, **entonces** la accion no aparece o esta deshabilitada.
- **Dado** que estoy en el OPD desplegado, **cuando** uso breadcrumb o back, **entonces** vuelvo al OPD origen con la vista semi-plegada intacta.

**Reglas y restricciones:**
- La accion requiere que exista OPD hijo — relaciona con EPICA-12 (descomposicion/despliegue que crean OPDs).
- Distingue el doble clic en **borde** (navegacion) del doble clic en **fila de parte** (extraccion, HU-18.004). SSOT visual debe diferenciar zonas.
- Si hay multiples OPDs con refinamiento, pregunta abierta: ¿cual elige?

**Modelo de datos tocado:**
- Lectura de `cosa.refiners[].opd_id` para saber a que OPD saltar.

**Dependencias:**
- Bloqueada por: HU-18.001; integra EPICA-12, EPICA-20 (OPD tree).

**Integraciones:**
- OPD Navigator (EPICA-20).
- Breadcrumb (EPICA-20).

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §3.1 (secuencia de estados OPD-hijo ↔ semi-plegado), §7.2.
- Clase de afirmacion: inferido — el doc fuente implica la relacion pero no explicita un gesto de navegacion directo. Razonable como operacion de puente.
- Etiqueta: `requires-clarification` sobre gesto exacto.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [canvas, ui, semi-plegado, navegacion, opd-tree, requires-clarification].

---

### HU-18.014 — Bloquear vista semi-plegada cuando la cosa no tiene refinadores

**Actor primario:** MN.
**Tipo:** mixto.
**Nivel categorico:** U primario.
**Superficie UI:** halo/toolbar-contextual.
**Gesto canonico:** hover/clic sobre accion `Semi-Folded View`.

**Historia:**
> Como modelador novato, quiero que la accion `Semi-Folded View` aparezca deshabilitada cuando la cosa no tiene partes refinadas para no intentar una operacion sin sentido.

**Contexto de negocio:**
§4.3 del doc fuente: "La accion depende de que la cosa ya sea refinable". Sin refinadores, no hay nada que compactar. Mostrar la accion habilitada sin refinadores confunde al novato y genera errores silenciosos.

**Criterios de aceptacion:**
- **Dado** que tengo una cosa sin refinadores (`cosa.refiners.length === 0`), **cuando** abro el halo/toolbar, **entonces** `Semi-Folded View` aparece deshabilitada (gris, no clickeable) o no aparece.
- **Dado** que la accion esta deshabilitada, **cuando** hago hover, **entonces** aparece tooltip explicando "Esta cosa no tiene partes refinadas. Haz `Unfold` o `In-Zoom` primero".
- **Dado** que agrego un refinador (via Unfold o In-Zoom), **cuando** vuelvo al halo, **entonces** la accion se habilita.

**Reglas y restricciones:**
- La regla es: `Semi-Folded View` disponible ⟺ `cosa.refiners.length > 0`.
- Tooltip pedagogico cuando esta deshabilitada.
- Preferencia: mantener visible pero deshabilitada (descubribilidad) en vez de ocultarla.

**Modelo de datos tocado:**
- Lectura de `cosa.refiners[]`.

**Dependencias:**
- Bloqueada por: HU-18.001.

**Integraciones:**
- Halo / toolbar.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §4.3 (regla explicita).
- Transcripcion: "si la cosa no tiene refinadores, no hay semi-plegado util".
- Clase de afirmacion: confirmado por transcripcion.

**Prioridad:** S.
**Tamano:** XS.
**Etiquetas:** [canvas, ui, semi-plegado, validacion, affordance].

---

### HU-18.015 — Preservar orden compacto (compact_order) de las partes en semi-plegado

**Actor primario:** ME.
**Tipo:** mixto.
**Nivel categorico:** V primario; P (persistencia del orden) secundaria.
**Superficie UI:** canvas-render (lista vertical dentro del compacto).
**Gesto canonico:** drag dentro de la lista (reordenar) — opcional.

**Historia:**
> Como modelador experto, quiero controlar el orden vertical de las partes dentro del rectangulo semi-plegado para agruparlas semanticamente y que el orden se preserve al guardar.

**Contexto de negocio:**
En semi-plegado con 5+ partes, el orden importa: agrupar partes afines (todas las entradas, todos los controles, todos los outputs) mejora la legibilidad. El orden debe ser **controlable** y **persistente**, no aleatorio ni determinado por orden de creacion.

**Criterios de aceptacion:**
- **Dado** que una cosa tiene 5 refinadores en semi-plegado, **cuando** miro el orden, **entonces** respeta `refiner.compact_order[i]`.
- **Dado** que arrastro una fila hacia arriba/abajo dentro del compacto, **cuando** suelto, **entonces** el `compact_order` se actualiza y persiste.
- **Dado** que guardo y recargo, **cuando** reabro el OPD, **entonces** el orden se preserva.
- **Dado** que un refinador no tiene `compact_order` asignado (modelo antiguo), **cuando** se renderiza, **entonces** se asigna por orden de insercion como fallback.

**Reglas y restricciones:**
- `compact_order` es un entero/indice por refinador.
- El drag de reordenamiento es el gesto natural; alternativa: botones up/down en cada fila.
- El orden es **por refinador en este padre**, no global.

**Modelo de datos tocado:**
- `refiner.compact_order` — number — persistente.

**Dependencias:**
- Bloqueada por: HU-18.002, HU-18.011.

**Integraciones:**
- Renderer — respeta el orden.
- Layout — pass que aplica orden vertical.
- Persistencia — serializa el campo.

**Notas de evidencia:**
- Fuente normativa primaria: `opm-iso-19450-es.md` [§Tabla de equivalencia] Semi-plegado.
- Fuente: §6 (`refiner.compact_order` en modelo implicito).
- Clase de afirmacion: inferido — el campo aparece en el modelo de datos implicito (§6) pero el gesto de reordenamiento no se observa explicitamente.
- Etiqueta: `requires-clarification` sobre gesto exacto de reordenamiento.

**Prioridad:** C.
**Tamano:** S.
**Etiquetas:** [canvas, render, semi-plegado, orden, layout, requires-clarification].

---

## Preguntas abiertas derivadas (trazabilidad con §11 doc fuente)

- **Q18.1** (del doc §11.1): ¿Semi-plegado es persistente por OPD o solo estado de sesion de la vista? **HU afectada**: HU-18.011 (resuelta como decision de diseno: persistente por OPD, sujeto a validacion con usuario).
- **Q18.2** (del doc §11.2): ¿Puede una parte quedar simultaneamente extraida en dos OPDs distintos como dos apariencias del mismo refinador? **Pendiente**: no cubierta como HU — requiere decidir antes si afecta invariantes del kernel (una identidad, multiples apariencias).
- **Q18.3** (del doc §11.3): ¿El contador de partes ocultas participa en exportaciones (PDF/SVG) o se suprime como chrome de edicion? **HU afectada**: HU-18.005 (marcada `requires-clarification`).
- **Q18.4** (nuevo, derivado de HU-18.003): Glyph exacto del badge "has parts" sobre rectangulo plegado — ¿triangulo OPM canonico, simbolo custom, o etiqueta textual?
- **Q18.5** (nuevo, derivado de HU-18.007): Nomenclatura exacta del control para volver de semi-plegado a plegado — ¿`Folded View`, toggle del mismo boton, o tercer estado del mismo control?
- **Q18.6** (nuevo, derivado de HU-18.013): Gesto exacto para navegar al OPD desplegado desde el rectangulo semi-plegado — ¿doble clic en borde, accion dedicada, breadcrumb inverso?
- **Q18.7** (nuevo, derivado de HU-18.015): Gesto exacto para reordenar `compact_order` — ¿drag dentro del compacto, botones up/down por fila, menu contextual?
- **Q18.8** (nuevo, derivado de HU-18.011): ¿El formato OPCAT (interop externa, EPICA-70) preserva `view_mode_by_opd`, `visibility_in_opd`, `compact_order` y `endpoint_proxy_mode`, o se pierden al exportar?

## Referencias cruzadas

- Doc fuente: `opcloud-reverse/18-canvas-semi-folding.md`.
- Fuente normativa: `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es` [opm-iso-19450-es.md §Tabla de equivalencia] Semi-plegado.
- Evidencia OPCloud: `/home/felix/projects/deep-opm-pro/` (assets/svg, JOYAS.md, sandbox-data, decompiled).
- Epicas que **bloquean** a esta: **EPICA-10** (creacion de cosas — base para que existan), **EPICA-12** (descomposicion/despliegue — produce los refinadores que semi-plegado visualiza), **EPICA-30** (save/load — persistencia de view-mode).
- Epicas **integradas** con esta: **EPICA-15** (enlaces avanzados — porque semi-plegado afecta endpoints), **EPICA-16** (enlaces propiedades — `endpoint_proxy_mode`), **EPICA-20** (OPD tree — navegacion), **EPICA-50** (OPL pane — fraseo de resumen), **EPICA-60/61** (export PDF/SVG — comportamiento del contador).
- Invariantes del repo:
  - `src/nucleo/tipos.ts` — nuevos campos `cosa.view_mode_by_opd`, `refiner.visibility_in_opd`, `refiner.compact_order`, `link.endpoint_proxy_mode`. Requiere **presion multiple** antes de tocar kernel (cf. CLAUDE.md).
  - `src/render/jointjs/` — factory de shape compacto con sub-items + badge `has parts`.
  - `src/render/layout/` — pass para altura dinamica del padre segun partes visibles + orden `compact_order`.
  - `src/render/opl-renderer.ts` — fraseo `consists of … and N more parts`.
- SSOT visual: `ssot/opm-visual-es.md` V-xx (seccion sobre badges y compactos — citar al implementar HU-18.002, HU-18.003).
