# 10 — Primitivas visuales de cosas

**Alcance**: representación gráfica de objetos y procesos. Forma × Contorno × Profundidad = 8 combinaciones canónicas. Contorno grueso para refinables. Esencia (sombra) y afiliación (discontinuo) como canales normativos. Propagación por refinamiento.
**Capa SSOT propietaria**: `opm-visual-es.md` §1.1–1.4, §10.4, §16, §22 parcial; `opm-iso-19450-es.md` (propiedades genéricas)
**Aplicación en la app**: `src/render/jointjs/crear-cosa.ts`, `src/render/jointjs/paleta.ts`, `src/nucleo/` (atributos del modelo).

## Reglas

### R-200: Formas cerradas canónicas

- Enunciado: el vocabulario cerrado de formas es:
  | Forma geométrica | Entidad OPM |
  |---|---|
  | **Rectángulo** | Objeto |
  | **Elipse** | Proceso |
  | **Rectángulo redondeado** (rountangle) | Estado (siempre dentro de un objeto) |
- Referencia SSOT: §1.1 de `opm-visual-es.md`
- Aplicación en código: `crear-cosa.ts` usa `joint.shapes.standard.Rectangle` para objetos, `joint.shapes.standard.Ellipse` para procesos. Los estados se renderizan por `crear-estado.ts` (ver artefacto 11).
- Antipatrón: usar hexágonos, rombos, círculos, u otras formas para cosas OPM.

### R-201: Contorno continuo vs discontinuo — afiliación

- Enunciado: el atributo de contorno codifica afiliación:
  | Contorno | Codifica |
  |---|---|
  | Continuo (sólido) | **Sistémica** — la cosa pertenece al sistema |
  | Discontinuo (punteado) | **Ambiental** — la cosa pertenece al entorno |
- Referencia SSOT: §1.2
- Aplicación en código: `strokeDasharray: "6,3"` (u otro patrón sintético) para ambiental; `none` para sistémica.
- Antipatrón: usar punteado decorativo en UI (colisiona con V-224 e invalida distinción semántica).

### R-202: Sombra — esencia física vs informacional

- Enunciado: el atributo de profundidad codifica esencia:
  | Profundidad | Codifica |
  |---|---|
  | **Sombreado canónico** (sombra gris desplazada abajo-derecha) | Esencia física |
  | **Plano** (sin sombra canónica) | Esencia informacional |
- Referencia SSOT: §1.3
- Aplicación en código: `filter: { name: "dropShadow", args: { dx: 3, dy: 6, blur: 0, color: "gray" } }` (perfil OPCloud observado, normalizado a API JointJS). Aplicar SOLO si `esenciaEfectiva === "física"`.
- Antipatrón: aplicar sombra decorativa uniforme a todas las cosas; colisiona con V-124.

### R-203: V-1 — Valores por defecto

- Enunciado: los valores por defecto de toda cosa son **informacional** (sin sombra) y **sistémica** (borde continuo). Si no se especifica, toda cosa es informacional y sistémica.
- Referencia SSOT: V-1
- Aplicación en código: el kernel asume estos defaults; el modelador declara explícitamente cuando diverge.
- Nota v2: una herramienta puede exponer presets de sesión, pero NO alteran la semántica del modelo salvo serialización explícita.

### R-204: V-2 — Perseverancia no es visual

- Enunciado: la perseverancia (persistente/transitoria) NO es un canal visual. Se infiere del tipo: los objetos son persistentes, los procesos son transitorios.
- Referencia SSOT: V-2
- Aplicación en código: no hay marca gráfica adicional de perseverancia; es una consecuencia automática de la forma.

### R-205: Las ocho representaciones canónicas

- Enunciado: toda cosa OPM se renderiza como Forma × Contorno × Profundidad:

| # | Forma | Contorno | Profundidad | Cosa |
|---|---|---|---|---|
| 1 | Rectángulo | sólido | sombreado | Objeto físico sistémico |
| 2 | Rectángulo | sólido | plano | Objeto informacional sistémico |
| 3 | Rectángulo | discontinuo | sombreado | Objeto físico ambiental |
| 4 | Rectángulo | discontinuo | plano | Objeto informacional ambiental |
| 5 | Elipse | sólido | sombreado | Proceso físico sistémico |
| 6 | Elipse | sólido | plano | Proceso informacional sistémico |
| 7 | Elipse | discontinuo | sombreado | Proceso físico ambiental |
| 8 | Elipse | discontinuo | plano | Proceso informacional ambiental |

- Referencia SSOT: §1.4
- Aplicación en código: `crear-cosa.ts` debe cubrir las 8 combinaciones ortogonalmente, sin alias ni atajos.

### R-206: V-124 — Sombra solo en canon si es física

- Enunciado: el sombreado visible en el canon-diagrama DEBE corresponder exclusivamente a esencia física. La implementación DEBE suprimir en el export canónico toda sombra decorativa de UI aplicada uniformemente a cosas informacionales.
- Referencia SSOT: V-124
- Aplicación en código: el exportador post-procesa el SVG para remover sombras decorativas no semánticas.
- Decisión 2026-04-28: el hallazgo OPCloud de sombra uniforme se adopta como perfil de la sombra canónica física, no como sombra persistente para cosas informacionales.

### R-207: V-125 — Preservación de esencia en refinamiento

- Enunciado: si una cosa refinable es física, su contenedor refinado en el OPD hijo DEBE preservar la marca de esencia física. La esencia NO puede perderse visualmente por el solo hecho del refinamiento.
- Referencia SSOT: V-125
- Aplicación en código: `pass-embed-refinable.ts` y el flujo de creación del OPD hijo copia esencia del padre.
- Antipatrón: un proceso físico en SD que se vuelve plano (sin sombra) en SD1 por bug de propagación.

### R-208: V-126 — Triple origen de sombra colapsado en canon

- Enunciado: la sombra puede provenir de tres orígenes operativos:
  1. declaración explícita del modelador
  2. propiedad forzada por un estereotipo (ver §19)
  3. preset de sesión
  En el artefacto canónico, los tres colapsan a un mismo resultado semántico: sombra si y solo si la cosa es física.
- Referencia SSOT: V-126
- Aplicación en código: el modelo interno guarda `esenciaEfectiva` computada desde los tres orígenes y la usa para renderizar.

### R-209: V-127 — Reforzadores de edición no persisten en canon

- Enunciado: si una implementación usa reforzadores de canvas para hacer más visible la fisicidad en edición, esos reforzadores DEBEN diferenciarse perceptualmente de la sombra semántica y NO pueden persistir en el canon-diagrama.
- Referencia SSOT: V-127
- Aplicación en código: si el modo edición muestra una sombra más saturada o un halo adicional, el exportador debe normalizar a la sombra canónica.

### R-210: V-69 — Contorno grueso en refinamiento entre OPDs

- Enunciado: el contorno grueso (indicador de refinamiento) aplica tanto a descomposición (in-zooming) como a despliegue en nuevo diagrama (unfolding). Ambos producen contorno grueso en el refinable.
- Referencia SSOT: V-69
- Aplicación en código: `crear-cosa.ts` usa `strokeWidth: 3` cuando la cosa es refinable (en padre e hijo del refinamiento).

### R-211: V-70 — Despliegue intradiagrama NO produce contorno grueso

- Enunciado: el despliegue en el mismo diagrama (despliegue intradiagrama) NO produce contorno grueso, porque el refinable y los refinadores comparten OPD.
- Referencia SSOT: V-70
- Aplicación en código: distinguir en el modelo si el despliegue es intradiagrama o crea OPD hijo, y aplicar contorno grueso solo en el segundo caso.

### R-212: V-71 — Persistencia de tipo de contorno

- Enunciado: el tipo de contorno (sólido o punteado) persiste en todos los niveles de refinamiento. Un objeto ambiental mantiene contorno discontinuo en el OPD padre y en todos los OPDs hijo donde aparezca como externo.
- Referencia SSOT: V-71
- Aplicación en código: `pass-zonas-externos.ts` propaga `afiliacion` del modelo sin alterarla por posición en el OPD.

### R-213: Colores canónicos — informativos, no normativos

- Enunciado: los colores del esquema de referencia son informativos, no semánticos. La semántica se fija por forma, contorno y sombreado:

| Elemento | Color de borde | Color de fondo |
|---|---|---|
| Objeto | Verde | Transparente (informacional) o blanco |
| Proceso | Azul oscuro | Transparente (informacional) o blanco |
| Estado | Verde oliva | Gris claro |
| Enlace estructural | Negro | — |
| Enlace procedimental | Negro | — |

- Referencia SSOT: §1.1b + V-63 ampliada
- Aplicación en código: `paleta.ts` puede elegir paleta alternativa legible; las variantes cromáticas NO alteran la conformidad mientras preserven topología.
- Antipatrón: depender del color rojo para significar "consumo" o verde para "resultado"; la semántica va en la decoración, no en el color.

### R-214: V-63 ampliada — topología interna obliga

- Enunciado: los colores son informativos también para las decoraciones internas de triángulos estructurales. Una implementación puede emplear azul, negro u otra paleta legible siempre que preserve **sin ambigüedad** la topología semántica del símbolo (ver §1.7 y V-128).
- Referencia SSOT: V-63 ampliada
- Aplicación en código: es correcto usar triángulo con interior azul oscuro; NO es correcto eliminar la marca interior por razones cromáticas.

### R-215: Dimensiones y legibilidad

- Enunciado: aunque la SSOT no fija un tamaño absoluto, las cosas deben tener un tamaño tal que:
  - el rótulo quepa legible dentro del bounding box (V-195)
  - las decoraciones internas de triángulos sean perceptibles (V-128)
  - las piruletas y otros adornos sean distinguibles de handles UI (V-190, V-191)
- Referencia SSOT: §16.1, V-215
- Aplicación en código: dimensiones mínimas recomendadas: objeto ≥ 80×40 px; proceso ≥ 100×40 px; estado ≥ 50×20 px. Ajustar por rótulo.

### R-216: V-215 — Bandas de aspect ratio

- Enunciado: el tamaño de una cosa puede variar por decisión autoral, pero NO hasta el punto de impedir legibilidad, contención del rótulo o identificación de sus decoraciones. La implementación DEBE declarar bandas de aspect ratio admisibles o una política de autoajuste equivalente.
- Referencia SSOT: V-215
- Aplicación en código: documentar en ADR el aspect ratio admisible (ej. objeto: 0.4 ≤ h/w ≤ 2.0; proceso: 0.3 ≤ h/w ≤ 1.5).

### R-217: Alias decorativo entre paréntesis

- Enunciado: una cosa puede mostrar un alias breve junto al nombre entre paréntesis (ej. `Sistema de Turborreactor (str)`). Este alias decorativo es distinto del alias computacional entre llaves `{alias}` (ver §20 y V-158).
- Referencia SSOT: V-122
- Aplicación en código: el renderer imprime `Nombre (alias)` cuando existe, sin modificar la semántica del nombre canónico.

### R-218: Objeto con estados — layout interno

- Enunciado: los estados de un objeto se representan como rectángulos redondeados **contenidos** dentro del rectángulo del objeto propietario, dispuestos horizontalmente en la zona inferior.
- Referencia SSOT: §2.1
- Aplicación en código: `pass-estados-franja-inferior.ts` ordena los estados horizontalmente en la franja inferior del objeto.
- Ver detalle: `11-estados-designaciones.md`.

### R-219: V-33 extendido — contorno grueso también para objetos refinables

- Enunciado (deuda latente): el contorno grueso por refinamiento debe aplicar a **procesos** y **objetos** refinables indistintamente. Si en el futuro un objeto se refina por `unfolding` o `in-zooming`, debe recibir contorno grueso.
- Referencia SSOT: V-33, V-69
- Estado actual en el código: `crear-cosa.ts:79` restringe incorrectamente a procesos (deuda documentada en `docs/design/archive/auditoria-ssot-visual-2026-04-23.md` §2.11).
- Aplicación en código: eliminar la condición `cosa.tipo === "proceso"` del cálculo de `strokeWidth`.

### R-220: Coherencia cromática dentro de un OPD

- Enunciado: dentro de un mismo OPD, las cosas de igual clase semántica DEBEN compartir la misma base cromática y tipográfica, salvo variante autoral explícitamente declarada.
- Referencia SSOT: V-209
- Aplicación en código: `paleta.ts` asigna colores por clase (objeto, proceso) de forma consistente; no mezclar azul y verde para objetos en el mismo OPD sin razón.

## Checklist

- [ ] Toda cosa se dibuja con rectángulo (objeto) o elipse (proceso) — no hay otras formas
- [ ] El contorno discontinuo aplica si y solo si `afiliacion === "ambiental"`
- [ ] La sombra aplica si y solo si `esenciaEfectiva === "física"`
- [ ] Las 8 combinaciones canónicas se renderizan ortogonalmente, sin alias
- [ ] El color usado es informativo; la topología preserva semántica
- [ ] Contorno grueso (stroke-width=3) para refinables en in-zooming y unfolding
- [ ] Despliegue intradiagrama NO produce contorno grueso
- [ ] Esencia física se propaga al contenedor en OPD hijo
- [ ] Rótulo cabe dentro del bounding box; no hay truncamiento silencioso
- [ ] Alias decorativo `(alias)` separado de alias computacional `{alias}`
- [ ] Sombras decorativas de UI se suprimen en canon-diagrama

## Antipatrones

- Dibujar un proceso como hexágono "porque es diferente"
- Aplicar sombra uniforme a todas las cosas desde el estilo global
- Usar rojo para significar "atención" en un borde (colisiona con validación)
- Marcar un objeto como ambiental por color en lugar de por contorno discontinuo
- Olvidar propagar esencia al OPD hijo después de in-zooming
- Contorno grueso aplicado solo a procesos refinables (deuda actual)
- Un objeto ambiental cuyo contorno se vuelve sólido en SD1 al clasificarse como "interno"

## Referencias cruzadas

- Estados: `11-estados-designaciones.md`
- Refinamiento y contenedores: `30-refinamiento-entre-opds.md`
- Propiedades invariantes entre niveles: `35-invariantes-entre-niveles.md`
- Estilado autoral: `61-estilado-autoral.md`
- Canon: `01-canon-exportacion.md`
