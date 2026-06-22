---
titulo: "Metodologia — Inventario de historias de usuario del modelador OPM"
fecha: 2026-04-28
alcance: "Revisar las 48 epicas existentes contra SSOT OPM v3.0.0 + evidencia OPCloud (JOYAS.md, sandbox-data, assets, decompiled, catalog, config), aplicando lecciones de si-partiese-desde-0.md."
estado: "revision-piloto"
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
fuente_opcloud: "/home/felix/projects/deep-opm-pro/"
fuente_original: "/home/felix/projects/opm-model-app/opcloud-reverse/"
piloto: "epica-10-canvas-creacion-cosas.md"
diagnostico: "DIAGNOSTICO-PILOTO-EPICA-10.md"
artefactos_derivados: ["INDICE-HU.md", "epica-*.md", "MATRIZ-HU-REGLAS-SSOT.md", "RESUMEN-ROADMAP.md"]
---

## 1. Proposito

Este documento establece la **metodologia canonica** para revisar y mantener las 48 epicias
de historias de usuario del modelador OPM. La revision rebasa cada HU contra tres fuentes
en orden de precedencia:

1. **SSOT OPM v3.0.0** (`opm-iso-19450-es.md` → `opm-visual-es.md` → `opm-opl-es.md`) como
   autoridad normativa para semantica, gramatica visual y plantillas OPL-ES;
2. **Evidencia OPCloud** (`JOYAS.md`, `sandbox-data/`, `assets/svg/`, `assets/png/`,
   `decompiled/`, `catalog/`, `config/`) como referencia de producto comprobada;
3. **opcloud-reverse** como corpus de observacion original cuya funcion ahora es trazabilidad
   historica, no autoridad de diseno.

Las HU nacieron 1:1 desde `opcloud-reverse/`; la revision las rebasa contra SSOT + evidencia
OPCloud nueva + lecciones de `si-partiese-desde-0.md`.

La unidad de analisis sigue siendo la **historia de usuario**.

## 2. Principios rectores

### 2.1 Precedencia de fuentes (revisada 2026-04-28)

El orden de autoridad para establecer que exige una HU es:

```
SSOT OPM v3.0.0 > evidencia OPCloud (JOYAS, assets, decompiled, sandbox, catalog, config) > opcloud-reverse
```

Dentro de la evidencia OPCloud, el orden de verificacion antes de generar soluciones de novo es:

1. `assets/svg/` (73 SVGs canonicos — no redibujar marcadores, iconos ni shapes)
2. `assets/png/` (11 PNGs de UI)
3. `JOYAS.md` (colores, dimensiones, tipografia, patron wrapper+line, markers, routing, puertos, OPL)
4. `decompiled/` (808 modulos searchables con `rg "class Foo" decompiled` para implementacion exacta)
5. `sandbox-data/` (6 modelos reales con cells JSON + OPL + screenshots como fixtures y validacion)
6. `catalog/` (376 clases + mapeo modulo->clase para guiar la arquitectura)
7. `config/` (rutas, Firebase, assets — como referencia de superficie funcional, no a copiar arquitectura)

La arquitectura final puede diferir (no Firebase, no Angular), pero SVGs, dimensiones, colores,
tipografia, clases y plantillas OPL se reutilizan directamente.

Cada HU conserva la **clase de afirmacion** del material fuente OPCloud. Si un comportamiento
se marco como "hipotesis" o "abierto", la HU lo refleja explicitamente.

### 2.2 Clasificacion de HU por tipo (nuevo)

Toda HU declara uno de tres tipos:

| Tipo | Significado | Prioridad tipica | Criterio |
|---|---|---|---|
| `opm-semantica` | La SSOT OPM exige este comportamiento | M0 | Si se omite, el modelo no es OPM conforme |
| `opcloud-ui` | Es una afordance observada en OPCloud, no exigida por la SSOT | M1, S o C | Puede divergir en implementacion o diferirse sin romper OPM |
| `mixto` | La necesidad es generica (SSOT), la implementacion es referencial (OPCloud) | M0/M1 | Ej: "menu contextual" es generico; "halo radial" es OPCloud |

Las HU `opcloud-ui` heredan la solucion OPCloud como referencia pero no estan obligadas a
reproducirla. En los criterios de aceptacion, lo que es SSOT se marca con `[V-xxx]`, `[Glos 3.x]`
o `[OPL-ES Txxx]`; lo que es OPCloud se marca con `[OPCloud §x]` o `[JOYAS §x]`.

### 2.3 Granularidad atomica

Sin cambios respecto a la version original.

### 2.4 Alineacion con SSOT OPM

Cada HU se etiqueta con el **nivel categorico** en que opera. Ademas, las HU
`opm-semantica` citan explicitamente las reglas SSOT que las respaldan:

- Reglas visuales: `[V-xxx]` de `opm-visual-es.md`
- Terminos de glosario: `[Glos 3.x]` de `opm-iso-19450-es.md`
- Plantillas OPL-ES: `[OPL-ES Txxx]`, `[OPL-ES Dx]` de `opm-opl-es.md`
- Colores/dimensiones/tipografia: `[JOYAS §x]`

### 2.5 Outcome antes que formalizacion

Sin cambios. Si la HU no tiene beneficiario identificable, outcome observable y
reversibilidad, probablemente es refactor disfrazado.

## 3. Sistema de IDs

Sin cambios respecto a la version original. IDs inmutables. Las renumeraciones estan prohibidas.

## 4. Taxonomia de epicas

Sin cambios. 48 epicas. Correspondencia biyectiva con `opcloud-reverse/`.

## 5. Actores canonicos

Sin cambios respecto a la version original.

## 6. Formato canonico de una HU (revisado)

Cada HU vive como **seccion markdown de tercer nivel** (`###`). Estructura obligatoria:

```markdown
### HU-{EPICA}.{NNN} — {titulo breve en imperativo, en espanol SSOT}

**Actor primario:** {codigo} ({rol}).
**Actores secundarios:** {codigos}, si aplica.
**Tipo:** {opm-semantica | opcloud-ui | mixto}.
**Nivel categorico:** {K | V | L | P | U | D | C | X} (primario); {otros} (secundarios).
**Superficie UI:** {barra-principal | canvas-opd | panel-opl-es | ...}.
**Gesto canonico:** {arrastrar | clic | doble-clic | atajo | dialogo | ...}.

**Historia:**
> Como {actor}, quiero {accion observable} para {beneficio concreto}.

**Contexto de negocio:**
{2-4 oraciones: que exige la SSOT, como lo implementa OPCloud, por que importa.}

**Criterios de aceptacion (Gherkin):**
- **Dado** {precondicion}, **cuando** {accion}, **entonces** {consecuencia observable}.
- Las consecuencias que son SSOT citan [V-xxx], [Glos 3.x] o [OPL-ES Txxx].
- Las consecuencias que son OPCloud citan [OPCloud §x] o [JOYAS §x].

**Reglas y restricciones:**
- {enumera reglas: primero las SSOT con su cita, luego las OPCloud como referencia.}

**Modelo de datos tocado:**
- `{entidad}.{campo}` — {tipo inferido} — {persistente | transitorio}.

**Dependencias:**
- **Bloqueada por:** HU-{ID} ({razon}).
- **Bloquea a:** HU-{ID} ({razon}).

**Integraciones:**
- {otros subsistemas que reaccionan}.

**Notas de evidencia:**
- Fuente normativa: {cita SSOT: [V-xxx], [Glos 3.x], [OPL-ES Txxx]}.
- Fuente OPCloud: {`opcloud-reverse/{doc}.md` §{seccion}}.
- Evidencia visual: {JOYAS §x, assets/svg/..., sandbox-data/...}.
- Clase de afirmacion: {confirmado por SSOT | observado + confirmado | inferido | hipotesis | abierto}.

**Prioridad:** {M0 | M1 | S | C | W}.
**Tamano:** {XS | S | M | L | XL}.
**Etiquetas:** [{tag1}, {tag2}, ...].
```

### 6.1 Ejemplo completo (actualizado con piloto EPICA-10)

```markdown
### HU-10.001 — Crear proceso por arrastre desde barra principal

**Actor primario:** MN (modelador novato).
**Actores secundarios:** ME (modelador experto).
**Tipo:** opm-semantica.
**Nivel categorico:** K (kernel) primario; V (render) y U (dialogo emergente) secundarios.
**Superficie UI:** barra-principal + canvas-opd + dialogo-nombre.
**Gesto canonico:** arrastrar icono de proceso desde la barra hasta una posicion del canvas.

**Historia:**
> Como modelador novato, quiero arrastrar el icono de proceso desde la barra al canvas para crear un proceso OPM con un solo gesto y nombrarlo de inmediato.

**Contexto de negocio:**
La SSOT OPM [Glos 3.58] define Proceso como "transformacion de uno o mas objetos".
OPCloud implementa la creacion por arrastre desde barra (confirmado por transcripcion).
Un solo gesto que combina creacion mas invitacion a nombrar reduce la friccion cognitiva.

**Criterios de aceptacion:**
- **Dado** que estoy en un OPD, **cuando** arrastro el icono de proceso hasta (x, y), **entonces** se crea una elipse con `tipo=proceso`, `afiliacion=sistemica`, `esencia=informacional`, nombre por defecto `Un Proceso`. [V-1]
- **Dado** que se creo el proceso, **cuando** se renderiza, **entonces** se abre un dialogo de nombre con el texto preseleccionado.
- **Dado** que se creo el proceso, **cuando** consulto el panel OPL-ES, **entonces** aparece: `*Un Proceso* es un proceso informacional y sistemico.` [OPL-ES D1..D4]

**Reglas y restricciones:**
- Valores por defecto: `esencia = informacional`, `afiliacion = sistemica`. [V-1]
- Dimensiones canonicas: 135x60 px. [JOYAS §2]
- Borde: `#3BC3FF` (cyan). Fondo: `#fdffff`. Tipografia: Arial 14px semibold. [JOYAS §1, §3]

**Modelo de datos tocado:**
- `cosa.id` — UUID — persistente.
- `cosa.tipo` — `"proceso"` — persistente.
- `cosa.nombre` — string — persistente.
- `cosa.posicion` — `{x, y}` — persistente.
- `cosa.afiliacion` — `"sistemica"` (defecto) — persistente.
- `cosa.esencia` — `"informacional"` (defecto) — persistente.

**Dependencias:**
- Bloquea a: HU-10.002, HU-10.007, HU-10.012, HU-10.013.

**Integraciones:**
- Panel OPL-ES: emite oracion sintetica [OPL-ES D1..D4].
- Panel lateral de cosas: inserta entrada.

**Notas de evidencia:**
- Fuente normativa: [Glos 3.58] Proceso; [V-1] valores por defecto.
- Fuente OPCloud: `opcloud-reverse/10-canvas-creacion-cosas.md` §3.1, §5.1.
- Evidencia visual: JOYAS §1 colores, §2 dimensiones, §3 tipografia.
- Clase de afirmacion: confirmado por transcripcion + confirmado por SSOT.

**Prioridad:** M0.
**Tamano:** M.
**Etiquetas:** [canvas, kernel, proceso, creacion, arrastre, dialogo-nombre, opl-es].
```

## 7. Niveles de prioridad

Sin cambios. M0 = must-have kernel OPM, M1 = must-have producto, S = should-have,
C = could-have, W = won't-have. Regla: una HU no puede ser M0 si depende de otra
que no es M0.

## 8. Tamanos

Sin cambios. XS ≤2h, S ½-1 dia, M 2-3 dias, L 1-2 semanas, XL >2 semanas.

## 9. Etiquetas

Sin cambios respecto al vocabulario controlado original.

## 10. Trazabilidad (ampliada)

### 10.1 Bidireccional

Cada HU cita **siempre**:

- **Fuente normativa primaria:** reglas SSOT que la respaldan ([V-xxx], [Glos 3.x], [OPL-ES Txxx]).
- **Fuente OPCloud:** documento de `opcloud-reverse/` con seccion precisa y frames.
- **Evidencia visual/concreta:** JOYAS §x, assets/svg/..., sandbox-data/..., decompiled/...
- Clase de afirmacion (confirmado por SSOT / observado + confirmado / inferido / hipotesis / abierto).

### 10.2 Preguntas abiertas

Sin cambios. Las HU con `requires-clarification` entran al backlog pero no se activan
hasta resolver la pregunta.

### 10.3 Referencias SSOT en el cuerpo de la HU

Las HU `opm-semantica` citan reglas SSOT inline en criterios y reglas. Formato:

- `[V-xxx]` para reglas visuales de `opm-visual-es.md`
- `[Glos 3.x]` para terminos de glosario de `opm-iso-19450-es.md`
- `[OPL-ES Txxx]` para plantillas OPL-ES de `opm-opl-es.md`
- `[JOYAS §x]` para parametros visuales canonicos extraidos de OPCloud

## 11. Convenciones de escritura (revisadas)

### 11.1 Idioma y terminologia

Espanol para toda la redaccion. **Terminologia OPM canonica en espanol SSOT:**

| SSOT (usar) | Evitar |
|---|---|
| `afiliacion` (sistemica / ambiental) | `affiliation` |
| `esencia` (fisica / informacional) | `essence`, `informatical` |
| `descomposicion` / `recomposicion` | `in-zooming` / `out-zooming` |
| `despliegue` / `plegado` | `unfolding` / `folding` |
| `objeto con estados` | `stateful object` |
| `habilitador` (agente / instrumento) | `enabler` |
| `transformado` (consumido / afectado / resultante) | `transformee` |
| `enlace` | `link` |
| `cosa` (objeto o proceso) | `thing` |
| `estado` | `state` |

La equivalencia en ingles se menciona entre parentesis solo la primera vez que el
termino aparece en cada epica, y solo cuando ayuda a la interoperabilidad con
literatura OPM/OPCloud.

Nombres de UI de OPCloud que no tienen traduccion SSOT (ej. `Auto Format`) se
mantienen en ingles entre comillas. Nombres SSOT se usan sin comillas.

### 11.2 Voz y verbos

Sin cambios. Criterios testables, sin hedging.

### 11.3 OPL-ES en criterios de aceptacion

Cuando un criterio incluye salida OPL, usar las plantillas OPL-ES canonicas con
las convenciones tipograficas SSOT:

- Objeto: **negrita**
- Proceso: *cursiva*
- Estado: `monoespaciado`

Ejemplo: `**Conductor** maneja *Rescatar*.` [OPL-ES T5]

## 12. Ciclo de vida de una HU

Sin cambios respecto a la version original.

Se agrega el estado `revision-piloto` para las epicas en proceso de rebasamiento
contra SSOT + evidencia OPCloud.

## 13. Entregables del proyecto

Sin cambios. Se agrega `DIAGNOSTICO-PILOTO-EPICA-10.md` como artefacto de la
fase de revision.

## 14. Proceso de produccion (revisado)

1. **Diagnostico piloto** sobre EPICA-10 para calibrar gaps y patrones.
2. **Refinar metodologia** (este documento) con los patrones encontrados.
3. **Revisar epicas M0** (11 epicas del nucleo irreducible) aplicando la metodologia refinada.
4. **Actualizar INDICE-HU.md** y MATRIZ-HU-REGLAS-SSOT.md con los cambios.
5. **Revisar epicas restantes** (M1, S, C, W) por orden de dependencia.

## 15. Criterios de completitud (revisados)

El inventario se considera completo cuando:

- las 48 epicas tienen archivo propio,
- cada epica revisada declara `estado: revision-piloto` o superior en su frontmatter,
- cada HU declara `Tipo: opm-semantica | opcloud-ui | mixto`,
- las HU `opm-semantica` citan reglas SSOT ([V-xxx], [Glos 3.x], [OPL-ES Txxx]),
- las HU de render citan valores canonicos de JOYAS.md cuando aplica,
- las preguntas abiertas del doc fuente estan reflejadas,
- el INDICE-HU.md y MATRIZ-HU-REGLAS-SSOT.md reflejan los cambios.

## 16. Que NO hace este inventario (ampliado)

- **No inventa funcionalidad** no presente en OPCloud o exigida por la SSOT.
- **No genera soluciones de novo** sin antes verificar que existe en los insumos de
  ingenieria inversa (assets/svg, JOYAS.md, decompiled/, sandbox-data/, catalog/).
- **No reproduce** literalmente OPCloud — el objetivo es informar el modelador OPM.
  La UI puede divergir si la SSOT lo justifica.
- **No copia la arquitectura** de OPCloud (Firebase, Angular). SVGs, dimensiones,
  colores, tipografia, clases y plantillas OPL se reutilizan; la arquitectura no.
- **No cierra** decisiones de arquitectura del repo.
- **No prioriza** de forma definitiva.

## 17. Referencias (ampliadas)

- **SSOT OPM v3.0.0:** `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/`
  - `opm-iso-19450-es.md` — capa semantica (URN `urn:fxsl:kb:opm-es`)
  - `opm-visual-es.md` — capa grafica (URN `urn:fxsl:kb:opd-es`)
  - `opm-opl-es.md` — capa textual (URN `urn:fxsl:kb:opl-es`)
  - `metodologia-opm-es.md` — capa procedimental
- **Evidencia OPCloud (deep-opm-pro):** `/home/felix/projects/deep-opm-pro/`
  - `JOYAS.md` — hallazgos tecnicos validados (colores, dimensiones, tipografia, OPL)
  - `assets/svg/` — 73 SVGs canonicos
  - `assets/png/` — 11 PNGs de UI
  - `decompiled/` — 808 modulos webpack (regenerar con `bash setup.sh`)
  - `sandbox-data/` — 6 modelos reales (cells JSON + OPL + screenshots)
  - `catalog/` — 376 clases + mapeo modulo->clase
  - `config/` — firebase.json, routes.json, assets.json, edx.config.json
  - `AGENTS.md` — principio rector de desarrollo
- **Corpus original:** `/home/felix/projects/opm-model-app/opcloud-reverse/`
- **Lecciones aprendidas:** `/home/felix/projects/opm-model-app/docs/archive/si-partiese-desde-0.md`
