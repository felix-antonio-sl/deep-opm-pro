---
titulo: "Diagnostico piloto — EPICA-10 rebasada contra SSOT OPM + evidencia OPCloud"
fecha: 2026-04-28
fuente_primaria: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
fuente_opcloud: "/home/felix/projects/deep-opm-pro/"
epica_revisada: "EPICA-10 — canvas-creacion-cosas (22 HU)"
---

# Diagnostico piloto EPICA-10

## Resumen ejecutivo

Las 22 HU de EPICA-10 se construyeron con el metodo 1:1 desde `opcloud-reverse/10-canvas-creacion-cosas.md`. Al rebasarlas contra la SSOT OPM v3.0.0 y la evidencia OPCloud (`JOYAS.md`, `sandbox-data/`, `assets/`), emergen cinco patrones de gap que afectan a toda la epica y, por extension, al resto del inventario.

Ningun gap invalida completamente la epica — los gestos nucleares (crear cosa, crear link, cambiar afiliacion/esencia) estan correctamente identificados. Pero la precision semantica, la terminologia y la granularidad necesitan ajuste sistematico.

---

## Patron 1 — Terminologia: SSOT espanol vs jerga inglesa OPCloud

**Evidencia:** La SSOT OPM v3.0.0 usa terminos canonicos en espanol. Las HU mezclan terminos ingleses de OPCloud con espanol sin criterio.

| Concepto | SSOT OPM (canonico) | HU actual (inconsistente) |
|---|---|---|
| Afiliacion | `afiliacion` sistemica/ambiental | `affiliation` system/environment |
| Esencia | `esencia` fisica/informacional | `essence` physical/informatical |
| Descomposicion | `descomposicion` / `recomposicion` | `in-zooming` / `out-zooming` |
| Despliegue | `despliegue` / `plegado` | `unfolding` / `folding` |
| Estado | `estado` | `state` (mezclado) |
| Objeto con estados | `objeto con estados` | no usado explicitamente |
| Habilitador | `habilitador` (agente/instrumento) | referido como "Agent link" / "Instrument link" |
| Transformado | `transformado` (consumido/afectado/resultante) | "consumption/effect/result" |

**Accion:** Unificar terminologia al canon SSOT en todas las HU. Mantener equivalencia EN entre parentesis solo la primera vez que aparece un termino en cada epica.

---

## Patron 2 — Evidencia OPCloud no aprovechada (JOYAS.md)

**Evidencia:** `JOYAS.md` documenta parametros canonicos extraidos del codigo OPCloud que las HU mencionan genericamente.

| Dato | Valor canonico (JOYAS.md) | HU actual |
|---|---|---|
| Color borde Object | `#70E483` (verde lima) | "borde verde" (generico) |
| Color borde Process | `#3BC3FF` (cyan) | no especificado |
| Color links/triangulos | `#586D8C` (azul grisaceo) | no especificado |
| Color fondo things | `#fdffff` (blanco roto) | "blanco" |
| Dimensiones Object | 135x60 px | no especificado |
| Dimensiones Process | 135x60 px (elipse) | no especificado |
| Tipografia | Arial 14px semibold | no especificado |
| Link stroke-width | 2px visible + 15px wrapper | no especificado |
| Patron wrapper+line | Doble path (hit area transparente) | no documentado |
| Marcadores dinamicos | ID unico por enlace, no compartidos | no documentado |
| Router manhattan | padding:5, step:11 | no documentado |
| Puertos | port-group:aaa, r:2, magnet:true | mencionado como "magnet" |

**Accion:** Cada HU que toca render visual debe citar el valor canonico concreto de JOYAS.md. Separar "que OPM exige" (SSOT) de "como OPCloud lo implementa" (JOYAS.md) en las reglas.

---

## Patron 3 — Confusion OPCloud-UI vs OPM-semantica

**Evidencia:** Varias HU describen comportamientos que son afordances de OPCloud, no requisitos OPM.

| HU | Que es | Juicio |
|---|---|---|
| HU-10.004 (editar descripcion opcional) | Campo `Description` del popup de OPCloud | OPM no exige description. Es OPCloud-UI. Debe bajar prioridad o marcarse como OPCloud-ux opcional. |
| HU-10.006 (Auto Format checkbox) | Checkbox de capitalizacion de OPCloud | Puramente OPCloud-UI. No es requisito OPM. |
| HU-10.009 (preview OPL en link table) | Funcionalidad OPCloud del picker | Diferencial pedagogico valioso, pero no es requisito SSOT. Debe marcarse como OPCloud-inspirado. |
| HU-10.019 (pie menu radial "...") | Halo menu de OPCloud | Es UI OPCloud; el concepto "menu contextual" es generico. |
| HU-10.017 (biblioteca Draggable Things) | Panel lateral de OPCloud | Vista derivada del modelo, no requisito OPM. |
| HU-10.018 (OPD Navigator) | Miniatura de OPCloud | Vista derivada, no requisito OPM. |
| HU-10.022 (tab "Model (Not Saved)") | Indicador de estado de OPCloud | UI transitoria, no requisito OPM. |

**Accion:** Introducir una distincion explicita en las HU: `tipo: opm-semantica | opcloud-ui | mixto`. Las opm-semantica son M0. Las opcloud-ui se heredan de OPCloud pero pueden divergir si la SSOT o el diseno lo justifican.

---

## Patron 4 — Plantillas OPL sin alinear a OPL-ES SSOT

**Evidencia:** La SSOT `opm-opl-es.md` define plantillas canonicas OPL-ES con verbos espanoles precisos. Las HU usan formulaciones OPL-EN.

| Hecho | OPL-ES canonico (SSOT) | HU actual |
|---|---|---|
| Proceso creado | `*Procesar* es un proceso informacional y sistemico.` | `<Nombre> is an informatical and systemic process.` (ingles) |
| Objeto creado | `**Objeto** es un objeto informacional y sistemico.` | `<Nombre> is an informatical and systemic object.` (ingles) |
| Agente | `**Operador** maneja *Procesar*.` | `Y handles X.` |
| Instrumento | `**Herramienta** requiere *Procesar*.` | `Y requires X.` |
| Consumo | `*Procesar* consume **Consumido**.` | no verificado en las HU |
| Efecto con estados | `*Procesar* cambia **Objeto** de \`estado1\` a \`estado2\`.` | no verificado en las HU |

Convenciones OPL-ES (SSOT):
- Objeto: **negrita**
- Proceso: *cursiva*
- Estado: `monoespaciado`

**Accion:** Todo criterio de aceptacion que mencione OPL debe usar las plantillas OPL-ES canonicas con las convenciones tipograficas SSOT.

---

## Patron 5 — Conceptos SSOT ausentes

**Evidencia:** La SSOT define conceptos que no aparecen en las HU de EPICA-10 o aparecen degradados.

| Concepto SSOT | Estado en HU |
|---|---|
| Designaciones de estado (inicial, final, por defecto, Current) | Solo se mencionan en EPICA-13, no en EPICA-10 |
| Producto cartesiano 2x2x2 (8 representaciones de cosa) | Las HU mencionan solo 4 combinaciones (essence x affiliation), sin profundidad |
| Sombreado canonico como canal semantico (V-124 a V-127) | HU-10.014 menciona "sombra o borde" ambiguamente |
| Regla V-1: defaults informacional + sistemico | Correcto en HU-10.001 y HU-10.002 pero sin citar V-1 |
| Regla V-2: perseverancia no es visual | No mencionado; las HU tratan "persistent" como propiedad |
| Familias canonicas de enlace (V-239, V-240) | Las HU listan tipos de link sin organizarlos en las 5 familias |
| Diferencia `esencia` SSOT: "fisica" vs "informacional" (glosario 3.25) | Las HU usan "physical" vs "informatical" sin referencia al glosario |

**Accion:** Cada HU que toca un concepto normativo debe citar la regla SSOT correspondiente (V-xxx, termino de glosario, o seccion de opm-iso-19450-es.md).

---

## Recomendaciones para la metodologia (00-METODOLOGIA-HU.md)

1. **Fuente primaria pasa de `opcloud-reverse/` a SSOT OPM.** El orden de precedencia debe ser: SSOT OPM → evidencia OPCloud (JOYAS.md, sandbox-data, assets) → opcloud-reverse.
2. **Agregar campo `tipo` a cada HU:** `opm-semantica | opcloud-ui | mixto` para explicitar que es OPM esencial y que es UX heredable pero divergible.
3. **Citar reglas SSOT en cada HU.** No solo en MATRIZ-HU-REGLAS-SSOT.md, sino en el cuerpo: `[V-1]`, `[Glosario 3.25]`, `[OPL-ES T1]`.
4. **Unificar terminologia al espanol canonico SSOT.** Con equivalencia EN entre parentesis solo en la primera aparicion.
5. **Separar 'que OPM exige' de 'como OPCloud lo hace' en las reglas.** Asi queda claro que se puede divergir.
6. **Incluir valores canonicos de JOYAS.md en las HU de render.** No "borde verde" generico sino `#70E483`.

---

## Proximos pasos

1. Aprobar/ajustar este diagnostico.
2. Aplicar correcciones a EPICA-10 (22 HU) como piloto de revision.
3. Refinar `00-METODOLOGIA-HU.md` con las recomendaciones de arriba.
4. Replicar el patron de revision al resto de epicas M0.
