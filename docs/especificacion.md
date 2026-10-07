Derivada de `canon/`: reglas OPM1.5.0, spec-OPD1.4.0, spec-OPL1.4.1 y metodología1.7.0; ante conflicto manda `canon/`, con precedencia reglas > spec-OPD/spec-OPL > método. Las decisiones del dueño y DS se conservan en [decisiones.md](decisiones.md); los incumplimientos, en [conformidad.md](conformidad.md). El cuerpo que sigue reproduce íntegro CANON.md derivado del diseño; sus menciones al análisis histórico no añaden autoridad.

# CANON — Especificación del producto opforja derivada del canon (ni más ni menos)

Fuente única: los 4 documentos entregados por el dueño del producto.

| Doc | Versión | Autoridad (plano) |
|---|---|---|
| `reglas-opm-estrictas-es` («reglas») | 1.5.0 | validez, severidad, tablas-gate de plantillas (precedencia máxima) |
| `spec-forja-opd-es` («spec-OPD») | 1.4.0 | realización visual OPD, canvas, export |
| `spec-forja-opl-es` («spec-OPL») | 1.4.1 | superficie OPL, EBNF, parseo, roundtrip, panel y edición OPL |
| `metodologia-forja-opm-es` («método») | 1.7.0 | método humano; solo exige a la herramienta lo que ancla en reglas o declara como integridad |

Derivado de los dossiers `canon-reglas-a/b`, `canon-opd`, `canon-opl-a/b/c`, `canon-metodologia` (leídos completos) y cotejado contra la fuente literal donde se transcribe texto. Las citas a `SSOT-*`, `opm-es`, `opd-es`, `opl-es`, `V-nnn`, `glosario`, OPCloud y `opm-categorial-es` **no se siguen**: solo cuenta el texto de los 4 documentos.

Convenciones de este documento:
- Obligación: palabra del canon (DEBE / NO DEBE / DEBERÍA / PUEDE); `inf.` = inferida de texto declarativo o de tabla normativa («Las tablas son normativas», reglas l.120).
- ★ = núcleo mínimo: sin eso el producto no es conforme en nivel «Completo» (R-CONF-2) sobre el gate mínimo de roundtrip (tabla 9.2, R-BI-TAB-1). Todo DEBE sin ★ sigue siendo exigible; solo puede escalonarse si se declara en el registro de conformidad (R-CONF-7) y, del lado OPL, el parser responde `unsupported-canonical` (R-IMPORT-5).
- `DR-n` = decisión de resolución tomada en §10 (la opción más simple conforme ante un gap o contradicción).

---

## 0. Principio de alcance

### 0.1 Qué entra

Entra exactamente lo que el canon exige **a la herramienta**:
1. Un **modelo único** (kernel) de cosas, estados, enlaces, abanicos, OPDs y apariencias, del que OPD y OPL son proyecciones (R-BI-0, R-BI-1, R-OPD-BIM-2, R-META-5).
2. **Impedir** las construcciones prohibidas y **advertir** las condicionadas o metodológicas, con diagnósticos tipados (R-EDIT-8, R-ESC-OP-3/4, R-APP-4, R-OPD-VAL-2, método A8.1).
3. **Generar** OPL-ES canónico desde el modelo y **parsear** OPL-ES hacia el mismo hecho (bimodalidad, R-BI-DUAL-1, R-ESC-OP-1/2, R-CONF-3).
4. **Renderizar** el OPD con el vocabulario visual cerrado (R-VIS-PRIM-1, R-§23-OPD-VOCAB).
5. **Operaciones** de refinamiento (descomposición, despliegue, supresión de estados) con distribución/escisión de enlaces e identidad persistente (reglas §8, spec-OPD §10).
6. **Exportar** los perfiles canónicos `canon-diagrama` y `canon-documento`, e intercambiar el modelo en el bundle JSON declarado (R-VIS-EXP-2, R-OPD-CAN-1, método Apéndice F).
7. Mantener un **registro de conformidad** del repo que declare toda regla DEBE aún no implementada (R-CONF-7, R-APP-2). La brecha silenciosa está PROHIBIDA.

### 0.2 Niveles de decisión (reglas l.110–118, textual) — contrato de comportamiento

| Estado | Significado operativo |
|---|---|
| **Canónico** | Se puede crear, serializar, importar y editar bidireccionalmente. |
| **Canónico condicionado** | Se puede usar solo si se cumplen las condiciones indicadas; si faltan, la herramienta debe pedir datos o advertir. |
| **No canonizado** | La SSOT no lo define. No se debe inventar como OPM nuclear; solo puede existir como extensión declarada. |
| **Prohibido** | Contradice una regla de la SSOT. La herramienta debe bloquearlo o reportarlo como error estructural. |
| **UI / vista** | Puede existir en pantalla, pero no es hecho OPM nuclear ni debe emitir OPL nuclear. |

Regla de no sobrebloqueo (R-AP-0C, R-APP-5, R-OPD-VAL-4, R-ZNC-1/2): solo se **bloquea** ante contradicción explícita o error de categoría; el silencio del canon se clasifica `no-canonizado` (diagnóstico `non-canonical`), NUNCA como prohibición ontológica. Una capacidad canónica que el producto no ofrece NO se prohíbe: simplemente no se ofrece en la UI y el parser responde `unsupported-canonical`.

### 0.3 Precedencia para arbitrar

1. `reglas` decide validez y severidad. Ante divergencia de plantilla entre `reglas` (tablas-gate) y `spec-OPL`, **manda `reglas`** (reglas l.41; R-§23-MIG-1).
2. `spec-OPD` / `spec-OPL` deciden la realización modal; no redefinen validez.
3. `método` no bloquea por sí solo (método §0.1): lo que nace solo del método es advertencia o nada.
4. Dentro de un documento, manda la regla más específica o la cláusula declarada (R-§21-PRESC-CONS).
5. OPCloud, libro, videos, «opforja v0» y rutas de código **no son autoritativos** (reglas Precedencia; spec-OPL §Precedencia de fuentes 5).

### 0.4 Qué NO entra (mencionado en el canon pero no exigido a la herramienta)

| Tema | Por qué no se exige | Fuente |
|---|---|---|
| Simulación / runtime (tokens, halos, pin runtime, trazas, límite de bucle, 1/n, tasas, distribuciones, estados suspendidos, headless) | Todo es condicional a que exista runtime; ninguna regla obliga a simular; reglas R-DOC-4C manda sacarlo del canon; método A8.1 ofrece el gate tripartito como sustituto | R-EJEC-3..10, R-EST-4, R-CONS-2/3, R-EFE-2/2A/2B/3, R-AG-2, R-EXC-4A, R-HER-6, R-PROB-1A, R-VIS-RUN-*, R-VIS-CONS-1, R-VIS-ASYNC-1, R-VIS-CTRL-1, spec-OPD §20 (R-OPD-SIM-1..7), método A6/A7/F.2 |
| Bilingüismo EN↔ES | Condicionado a «herramienta bilingüe» | R-OPL-TEXT-4, R-OPL-EQ-2/3, R-OPL-TRANS-1..11, R-OPL-LANG-1/2/3, R-OPL-6/7 (parte EN) |
| Composición inter-modelo, sub-modelos, referencias externas, interfaz congelada, composición por interfaz | Todo PUEDE o condicional a tener sub-modelos | R-META-4/6/7/8/12, CM1–CM3, R-OPL-CM-1, R-OPL-LANG-6/7, R-OPL-TOTAL-3, R-VIS-SUB-1..3, R-VIS-XMODEL-1, R-VIS-FAM-1 (sub-model), AP-18, R-OPD-REF-18, spec-OPL §24, método A4.4/LF-04 |
| Anexo C categorial (linealidad, firma de frontera entre hermanos, pushout) | «NUNCA se expone al modelador»; severidad «mejora metodológica»; PUEDE. **Excepción**: R-CAT-EQ-3 (toda descomposición DEBE preservar la firma de frontera) SÍ entra (T-089) y, por R-ANEXO-CAT-0, DEBE realizarse como ley o checker ejecutable (DR-16) | R-ANEXO-CAT-0, R-CAT-LIN-*, R-CAT-EQ-1/2, R-CAT-COMP-*, método A0.4a (igualdad de firma entre hermanas) |
| Bocetos, régimen Apunte/Modelo, Taller, Graduar, Reabrir, Integrar como…, Devolver a Bocetos, Biblioteca, versiones | Extensión declarada (PUEDE) con DEBE internos solo si existe | R-OPD-REF-20, R-CAN-BOCETO-1..4, R-ENT-2-APUNTE, método A1.5 |
| Estereotipos, `<<Requirement>>`, vitrinas, injerto | PUEDE (extensión) | R-OPD-ROT-6, R-VIS-STEREO-1/2, R-VIS-REQ-1 |
| Anclaje a Pieza / Centinela de Drift / Soltar / Calcar | Extensión declarada | R-OPD-ROT-9 |
| Capa computacional: alias `{alias}`, unidades `[u]` en nombre, alias decorativo `(…)`, tipos de dato (`es de tipo`), rangos e intervalos, `donde …`, `varía de … a`, slots, fórmulas | PUEDE / sin generador en el canon (GAP-TIPO, GAP-VARIA, GAP-RANGO-TEXTUAL, GAP-DONDE-EXPRESION) | R-OBJ-4, R-ATR-3..6, R-OPL-TIPO-1/2, R-OPL-RANGO-1..3, R-OPL-CONJ-1, R-OPL-10, R-ROT-4, R-BR-5, R-VIS-COMP-1..3, método §9.20 |
| Probabilidades `Pr=p`, abanico probabilístico, m-de-f | Condicionado a ofrecer la capacidad; R-FAN-M-* son PUEDE | R-PROB-1, R-FAN-PROB-1, R-FAN-6, R-FAN-M-1..4, R-FAN-8, R-OPD-CTL-9/10 |
| Negación `¬` / variantes negadas / NOT compacto | Extensión declarada, emisión-only (rompe bimodalidad) | R-OPD-CTL-5, spec-OPL §3.4/§4.1/§4.2 (GAP-NEGADA-REVERSE), método A6 NOT |
| Demora en invocación (`después de <demora>`), excepción combinada sub+sobretiempo | Extensión local (PUEDE) | R-OPD-INV-5, spec-OPL §5.3/§5.4 |
| Rasgo opcional `tiene un … opcional` (RF2o), sufijo `[etiqueta: …]`, forma posesiva de instrumento | PUEDE (extensión de producto) | spec-OPL §6.2, R-EST-TAG-3, §4.2 |
| Composición de oraciones eje (a) y (c) (predicados/sujetos coordinados), modo prosa compuesta | PUEDE / capacidad nueva (GAP-COMPOSICION) | R-COMP-EJE-2/4, R-OPL-CFG-3 |
| Semi-plegado, plegado explícito (`se pliega en`), recomposición (`se recompone desde`), `se refina por …` (CX4) como oraciones emitidas | Sin generador en el canon; semi-plegado sin OPL | R-BR-1, R-VIS-SEMI-1, R-OPD-STR-11/12, GAP-PLIEGA, GAP-RECOMPONE, GAP-REFINA |
| Vistas tipificadas (ancladas, ad hoc), mapa del sistema, árbol de objetos, `Bring connected things` | COND / PUEDE | R-VIEW-1..4, R-ARB-2, R-BRING-1, R-EDIT-5, R-VIS-BRING-1A..1G, R-OPD-REF-16/19 |
| Estilado autoral, bitmaps, modo imagen, alias/descripciones visibles, jumpover, carriles 44/50 px, stick figure | PUEDE | R-OPD-ROT-8, R-OPD-CFG-2/3, R-OPD-LAY-6/7, R-OPD-COSA-9, R-VIS-AUTOR-1 |
| Preset de esencia primaria del sistema | PUEDE | R-OBJ-5, R-OPD-CFG-4, método A2.3 |
| Modo de preservación de superficie | PUEDE | R-OPL-SUP-1 |
| Cambio de rol entre niveles (instrumento arriba, afectado abajo) | PUEDE condicionado | R-ROL-1/2/3, método §9.4 |
| Materialización de herencia (dibujar/emitir heredados), discriminantes, operación «crear general» | R-HER-8 prohíbe materializar; discriminantes sin marca en el modelo; «crear general» es «la herramienta o el modelador» (R-HER-7) ⇒ método. **Ojo**: R-HER-1 y R-VIS-HER-1 («DEBEN aplicarse aunque no se dibujen») SÍ obligan a que los validadores cuenten lo heredado (DR-43); R-VIS-HER-2 (afiliación por cadena estructural) entra en T-091 | R-HER-3/4/5/7, método §9.13 |
| Objetos específicos de estado materializados | Lectura de metamodelo | R-META-15/16 |
| Asistente guiado de 11 etapas, lentes SD, viewpack, ledger, carriles valor/soporte, validación stakeholder, marca epistémica | Método humano | método A0–A2, A4.6, A7, A8.1, LF-06..LF-18 |
| Descomposición reactiva por eventos (LF-06) | LF «propuesta», no ratificada | método LF-06 |
| Deshacer/rehacer | Ninguna regla lo exige (solo para Bring/composición, excluidos) | spec-OPD G-06 |
| Cosa duplicada en el mismo OPD (silueta) | Indicador condicionado a permitir el duplicado; no se exige permitirlo | reglas §3.10, GAP-OPD-DUPLICADO |
| Previsualización raster | No canónica (PUEDE) | R-OPD-EXP-1 |
| Principios y contenido del modelo (propósito declarado, alcance, función como proceso, SD con interesados/beneficiario, importancia proporcional, reclasificación por desgaste, tasa de consumo) | Obligan al **modelo/modelador**, no son verificables mecánicamente; R-PRIN-9 (vista = mismo modelo) se cumple por kernel único | R-PRIN-1..9, R-SD-1..3, R-IMP-1/2, R-AG-3/4, R-CONS-2/3, R-PROC-5..7 |
| Simplificación de OPD sobrecargado | PUEDE; R-SIMP-2 (prohibido crear enlaces proc↔proc sin semántica) solo rige si se ofrece; la vista padre derivada (§3.5) no crea enlaces entre pares | R-SIMP-1/2, método A4.5 |
| Marca `ordered` junto al triángulo; etiquetados bifurcados (`ordenados por`, `más`) | Extensión declarada / PUEDE | R-OPD-STR-5, R-OPL-SE-4, R-OPL-LISTA-2 |
| «La app no acepta un único estado (≥2)» | Limitación circunstancial de v0 descrita en el bundle; contradice R-OBJ-2 (`s ≥ 1`). No se exige ni se advierte | método Apéndice F |
| Gobierno documental: R-DOC-*, R-APP-0/1/6/7, R-§2x-PRESC/ENF/MIG/DEP, R-OPD-AUD-1, R-§20-AUD-1, tablas de trazabilidad a código v0, commits, sha256, «bestia», pneuma, HITL | No son funciones de la app | varios |
| Referencias circunstanciales a deep-opm-pro v0 (archivos `.ts`, JointJS, `standard.Rectangle`, `distance:0.8`, `linkPinning`, fixtures v0, paleta legacy OPCloud) | «Realización opforja» informativa; solo obliga donde una regla la eleva | spec-OPD §0 norma de lectura §18 |

### 0.5 Válvula de simplicidad (única vía legítima para no implementar un DEBE)

- R-CONF-7 (textual, resumido): «Toda regla DEBE con tráfico operativo (export canónico, OPL consumido, render) es deuda exigible. Una regla DEBE sin tráfico PUEDE programarse (registro de conformidad) o enmendarse. La brecha silenciosa está **PROHIBIDA**.»
- R-IMPORT-5: «si una oración es canónica pero la app aún no soporta su familia, el importador DEBE reportar `unsupported-canonical` y NO DEBE degradarla.»
- Anexo A gate «Deuda»: «Toda zona no canonizada DEBE quedar registrada como extensión, bloqueo o deuda explícita.»
- Estados admitidos del registro (R-APP-2): `enforzado`, `parcial`, `no implementado`, `zona laxa pendiente`. Una regla no se declara cerrada hasta cubrir UI, kernel, importación, generación OPL y exportación aplicables (R-APP-3).

---

## 1. Modelo de datos mínimo exigido

### 1.1 Entidades del modelo y sus reglas

| Elemento | Exigencia | Obligación | Fuente |
|---|---|---|---|
| Cosa | Exactamente dos clases: **objeto** (rectángulo) y **proceso** (elipse). No existen «entidades», «nodos», «actores», «componentes». Estado, enlace, atributo flotante, comentario, handle: NO son cosas. | inf. DEBE / NO DEBE | R-COSA-1, R-META-14, R-ENT-1, R-OPD-COSA-1, reglas §2.5 |
| Perseverancia | Derivada del tipo: objeto = persistente, proceso = transitorio. «No hay otras opciones.» Sin glifo. No se almacena. | inf. DEBE | R-COSA-2, R-OPD-COSA-1, R-OPD-BIM-4 (DR-3) |
| Esencia | {física, informacional}, default **informacional**; propiedad de la cosa (todas sus apariencias). | inf. DEBE | R-OBJ-3, R-OPD-COSA-2, R-REF-4 |
| Afiliación | {sistémica, ambiental}, default **sistémica**; persiste en todos los niveles. | inf. DEBE / DEBE | R-OBJ-3, R-CTRN-1/1A, R-OPD-COSA-4 |
| Nombre | Único en el modelo (1:1 cosa↔nombre canónico); reusar un nombre = nueva apariencia de la misma cosa; conflicto nominal se resuelve explícitamente (reusar / renombrar / descartar); nunca reescritura silenciosa. | DEBE (invariante) | método §9.15/A8.2, R-OPD-ROT-5, R-VIS-NOM-1, AP-22 |
| Léxico del nombre | Cosa: palabras separadas por un espacio, la primera capitalizada, caracteres = letra (incl. á é í ó ú ñ ü) · dígito · `-` · `_`, cada palabra empieza con letra. Estado: **una** palabra que empieza en minúscula. | DEBE (EBNF) | R-§18-LEX-1, R-OPL-LEX-1..3, EBNF A.2/A.3 (DR-8) |
| Estado | Solo en objetos; atómico; nunca flotante ni de proceso. Orden persistido (roundtrip preserva la lista y su orden). | inf. NO DEBE / DEBE | R-EST-1, R-PROC-4, AP-12, R-OPD-EST-1/2, spec-OPL §2.3 |
| Designaciones | Inicial 0..*, Final 0..* (combinables: D10), Por defecto 0..1, `Current` declarado 0..1 (persistente, distinto de runtime). | inf. DEBE | R-EST-2/3, R-OPD-EST-4..6 |
| Supresión de estados | Dos niveles: global (en el estado) y local (por apariencia). Oculto ⇔ suprimido global ∨ suprimido local. Suprimir NO borra. Un estado enlazado en ese OPD no se suprime ahí. Conjunto completo = unión en todos los OPDs. | inf. DEBE | R-OPD-EST-8, LF-03, R-CX-EST-2, R-OPL-TOTAL-5 (DR-15) |
| Atributo | Es un **objeto** exhibido (exhibición-caracterización); sus valores son **estados** del atributo. Sin campo «atributos». Valor puntual opcional (`valorSlot`). | DEBE | R-ATR-1/2, R-ENT-ATR-1/2, spec-OPL §2.5 |
| Instancia | Visual (misma cosa, otra apariencia) ≠ lógica (enlace de clasificación-instanciación). | inf. DEBE | R-INS-2, R-ENT-INS-1 |
| Duración (proceso) | `{min?, esperada?, max?, unidad?}`; unidad del sistema = default del modelo; duración > 0. EX1 exige `max`, EX2 exige `min`. | DEBE / inf. | R-EXC-2/3/4/5, R-PROC-3, R-OPD-INV-6 |
| Unidades de tiempo | `ms, sec, min, hour, day, week, month, year` | inf. DEBE | R-OPD-INV-6 |
| Género gramatical | Masculino por defecto, ajustable (para `un/una`). | inf. DEBE (default) | R-OPL-1 (DR-12) |
| Enlace | origen, destino, tipo (familia derivada), extremos de estado opcionales, control (`e`/`c`, a lo sumo uno), etiqueta opcional, ruta opcional, multiplicidad por extremo. Solo binario. | DEBE | R-META-13, R-VIS-CONSTRUCT-1, R-COMB-3, R-§21-OPL-MOD, método §9.23 |
| Familias | Seis, cerradas; todo enlace pertenece a exactamente una. | inf. DEBE | reglas §5.1, spec-OPD §4.1 |
| Modificador | Atributo del enlace base; NO agrega cosa ni enlace. | inf. DEBE / NO DEBE | R-ECA-4, R-MOD-NAT-1, R-OPD-CTL-1 |
| Abanico | ≥2 enlaces del mismo tipo con extremo común; operador XOR/OR; AND = ausencia de abanico. | inf. DEBE | spec-OPL §8.1, R-FAN-HAB-1, R-VIS-FAN-1 |
| Procedencia de escisión | Par TS4/TS5 producido al descomponer un TS3: metadato persistido; NUNCA nace de parseo aislado. | inf. DEBE | R-ESCIND-0 (DR-7) |
| Refinamiento | En la cosa refinada: descomposición {OPD hijo, **orden declarado en bandas**}; despliegue {OPD hijo, modo ∈ agregación/exhibición/generalización/clasificación}. | inf. DEBE | método Apéndice F, R-INV-2D, R-IDP-0A, R-REF-MEC-1 |
| Colección incompleta | Marca por (refinable, relación) para agregación, exhibición, generalización; NUNCA clasificación. | inf. DEBE / NO DEBE | reglas §3.10, R-STRF-3, R-OPD-STR-4, RF1i |
| OPD | Id persistente opaco ≠ etiqueta `SDx.y` (proyección de navegación, recalculable); padre; cosa refinada; tipo de refinamiento. Árbol con raíz `SD`. | DEBE | R-IDP-0B/0C/1/1A/2/3, R-ARB-1/3/4, R-OPD-REF-15, AP-17 |
| Apariencia | Realización local de una cosa en un OPD (posición, tamaño, supresiones, alcance). La existencia es única por modelo. Alcance (contenedor/interno/externo) persistido, no derivado de la geometría. | DEBE | spec-OPD Definiciones, R-VIS-APP-1, método A3.3, R-HIJO-6 |
| Identidad | Toda cosa, estado, enlace y OPD con id persistente separado de su etiqueta visible. | DEBE | Anexo A gate «Identidad», R-META-9 |
| Runtime | Nunca persistido como canon. | NO DEBE | R-EJEC-3, R-OPD-SIM-6 |
| Meta/UI | Notas, handles, estilos: si existen, marcados como meta; no emiten OPL nuclear. | DEBE | R-DOC-7, R-CONF-4, R-BR-4, R-BI-3, R-OPD-ROT-7 |

### 1.2 Tipos TypeScript mínimos (alineados con el bundle `deep-opm-pro.modelo.v0` del método, Apéndice F)

```ts
// Identidad opaca y estable (UUID). Nunca SDx.y ni nombre (R-IDP-0C, R-IDP-2, AP-17).
type Id = string;

type TipoCosa = 'objeto' | 'proceso';                    // R-COSA-1: cerrado
type Esencia = 'fisica' | 'informacional';               // default 'informacional'
type Afiliacion = 'sistemica' | 'ambiental';             // default 'sistemica'
type UnidadTiempo = 'ms' | 'sec' | 'min' | 'hour' | 'day' | 'week' | 'month' | 'year';
type ModoDespliegue = 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion';

interface Modelo {
  id: Id;
  nombre: string;
  unidadTiempo: UnidadTiempo;            // default del sistema (R-EXC-5)
  opdRaizId: Id;                          // SD
  entidades: Entidad[];
  estados: Estado[];                      // orden del arreglo = orden de estados por objeto
  enlaces: Enlace[];
  abanicos: Abanico[];
  opds: Opd[];
  apariciones: Aparicion[];
}

interface Entidad {
  id: Id;
  tipo: TipoCosa;                         // perseverancia = derivada (no se guarda)
  nombre: string;                         // único en el modelo; léxico EBNF
  esencia: Esencia;
  afiliacion: Afiliacion;
  genero?: 'f';                           // ausente = masculino (R-OPL-1)
  descripcion?: string;                   // glosa meta; no emite OPL
  valorSlot?: string;                     // solo objeto-atributo: "**A** de **X** es valor."
  duracion?: { min?: number; esperada?: number; max?: number; unidad?: UnidadTiempo }; // solo proceso
  coleccionIncompleta?: Array<'agregacion' | 'exhibicion' | 'generalizacion'>;        // nunca 'clasificacion'
  refinamientos?: {
    descomposicion?: { opdId: Id; orden: Id[][] };  // bandas: [[P1],[P2,P3],[P4]] (R-INV-2D)
    despliegue?: { opdId: Id; modo: ModoDespliegue };
  };
}

interface Estado {
  id: Id;
  entidadId: Id;                          // entidad.tipo === 'objeto'
  nombre: string;                         // una palabra en minúscula
  esInicial?: boolean;
  esFinal?: boolean;
  designaciones?: Array<'porDefecto' | 'current'>;  // ≤1 porDefecto y ≤1 current por objeto
  suprimido?: boolean;                    // supresión global
}

type TipoEnlace =
  | 'consumo' | 'resultado' | 'efecto'                          // 1 transformadora
  | 'agente' | 'instrumento'                                    // 2 habilitadora
  | 'invocacion'                                                // 3 invocación
  | 'excepcionSobretiempo' | 'excepcionSubtiempo'               // 4 excepción
  | 'agregacion' | 'exhibicion' | 'generalizacion' | 'clasificacion'   // 5 estructural fundamental
  | 'etiquetado' | 'etiquetadoBidireccional' | 'reciproco';     // 6 estructural etiquetada

type Multiplicidad = '?' | '*' | '+';     // ausente = 1..1 (default)

interface Enlace {
  id: Id;
  tipo: TipoEnlace;
  origenId: Id;                           // dirección canónica: ver §2.1
  destinoId: Id;
  estadoEntradaId?: Id;                   // estado en el extremo objeto "antes" / extremo origen (estructurales)
  estadoSalidaId?: Id;                    // estado en el extremo objeto "después" / extremo destino (estructurales)
  control?: 'e' | 'c';                    // a lo sumo uno (R-COMB-3); solo Pre(P)
  etiqueta?: string;                      // etiquetados: etiqueta (uni/recíproco) o etiqueta-f (bi)
  etiquetaInversa?: string;               // etiquetadoBidireccional: etiqueta-b
  ruta?: string;                          // solo consumo/resultado (DR-19)
  multiplicidadOrigen?: Multiplicidad;    // nunca en extremo proceso; nunca en el todo de agregación (DR-44)
  multiplicidadDestino?: Multiplicidad;
  escision?: { parId: Id; mitad: 'entrada' | 'salida' };   // R-ESCIND-0
}

interface Abanico {                       // AND = no existe abanico
  id: Id;
  operador: 'XOR' | 'OR';
  enlaceIds: Id[];                        // n ≥ 2, mismo tipo, extremo común
}

interface Opd {
  id: Id;
  nombre: string;                         // display
  padreId: Id | null;                     // null solo en la raíz
  refinaEntidadId?: Id;
  tipoRefinamiento?: 'descomposicion' | 'despliegue';
}

interface Aparicion {
  id: Id;
  entidadId: Id;
  opdId: Id;                              // ≤1 aparición por (entidad, OPD) (DR-25)
  x: number; y: number; width: number; height: number;
  contexto?: 'contenedor' | 'interno' | 'externo';   // alcance persistido (método A3.3)
  estadosSuprimidos?: Id[];               // supresión local (LF-03)
}
```

Notas de modelado (todas derivadas del canon):
- Etiqueta `SDx.y` = función pura del árbol (preorden; hijos en orden de creación): raíz `SD`, hijos `SD1, SD2…`, nietos `SD1.1…`. Nunca se persiste como identidad (R-IDP-1).
- Visibilidad de un enlace en un OPD = **derivada** (no se guarda): ver §3.5. Para compatibilidad con el bundle, el export escribe `opds[].apariencias` y `opds[].enlaces` como listas derivadas.
- Subprocesos = partes del proceso descompuesto (método A3.3); su pertenencia la da `refinamientos.descomposicion.orden`, no un enlace de agregación explícito.

---

## 2. Matriz de validez por tipo de enlace

### 2.1 Firma, extremos y modificadores (IMPEDIR todo lo que no figure como permitido)

Dirección canónica (origen → destino) usada en el modelo. «Obj» admite anclar a un estado del objeto donde la columna lo indique.

| Tipo | Familia | Origen → Destino | Estado en extremo objeto | `e` | `c` | Abanico XOR/OR | Multiplicidad | Ruta | Plantilla | Prohibiciones específicas (IDs) |
|---|---|---|---|---|---|---|---|---|---|---|
| consumo | transformadora | objeto → proceso | entrada (TS1) | SÍ (ET1, ETS1) | SÍ (CT1, CS1) | SÍ conv./div. | extremo objeto | SÍ | T1/TS1 | AP-06 en contorno de proceso descompuesto |
| resultado | transformadora | proceso → objeto | salida (TS2), **nunca estado inicial** | NO | NO | SÍ conv./div. (sin `e`/`c`) | extremo objeto | SÍ | T2/TS2 | AP-01, AP-02, AP-03, AP-04, AP-06 |
| efecto | transformadora | objeto ↔ proceso (objeto con ≥1 estado) | ninguno (T3) · entrada+salida (TS3) · solo entrada (TS4) · solo salida (TS5) | SÍ (ET2, ETS2–4) salvo fragmento escindido | SÍ (CT2, CS2–4) salvo fragmento escindido | SÍ (objetos / procesos) | extremo objeto | NO (DR-19) | T3/TS3/TS4/TS5 | R-EFE-1; AP-07 (TS3 sin escindir al descomponer); AP-08 |
| agente | habilitadora | objeto **físico** (proxy de humano) → proceso | requisito (HS1) | SÍ (EH1, EHS1) | SÍ (CH1, CS5) | SÍ conv./div. | extremo objeto | NO | H1/HS1 | AP-05 (DR-5) |
| instrumento | habilitadora | objeto → proceso | requisito (HS2) | SÍ (EH2, EHS2) | SÍ (CH2, CS6) | SÍ conv./div. | extremo objeto | NO | H2/HS2 | — |
| invocacion | invocación | proceso → proceso (origen = destino ⇒ autoinvocación) | — | NO (AP-10) | NO (AP-10) | SÍ conv./div. | NO | NO | IV1/IV2 | R-INV-1, R-IV-1 (nunca objeto); R-INV-2B/2D: rayo entre hermanos que repite una transición de banda **adyacente** = «doble vara», NO DEBE ⇒ **impedir** al crear; si aparece por reordenamiento de bandas ⇒ error estructural recuperable. Salto fuera de orden, bucle y cross-OPD sí van por rayo |
| excepcionSobretiempo | excepción | proceso fuente → proceso de manejo | — | NUNCA | NUNCA | NO (no canonizado) | NO | NO | EX1 | R-EXC-1/1B; R-EXC-2 «exige» `duracion.max` de la fuente = **canónico condicionado** ⇒ pedir el dato o advertir; sin cota se emite y parsea la frase de respaldo (R-EXC-DUR-1). Manejo no ambiental ⇒ advertir (R-EXC-1A) |
| excepcionSubtiempo | excepción | proceso fuente → proceso de manejo | — | NUNCA | NUNCA | NO | NO | NO | EX2 | R-EXC-3 «exige» `duracion.min` ⇒ pedir o advertir; sin cota, respaldo; manejo no ambiental ⇒ advertir |
| agregacion | estructural fund. | todo → parte, mismo tipo (obj→obj o proc→proc) | — | NO (AP-09) | NO | NO | **solo extremo parte** (la EBNF no tiene hueco en el todo; el plural «por multiplicidad del todo» no se ofrece, DR-12) | NO | RF1 | R-STRF-1 |
| exhibicion | estructural fund. | exhibidor → rasgo: obj→obj, obj→proc, proc→obj, proc→proc | — | NO | NO | NO | NO (DR-21) | NO | RF2/RF2b | — |
| generalizacion | estructural fund. | general → especialización, mismo tipo | **ninguno o ambos** (especialización de estado, R-OPL-RF-3: `lista_de_objetos_con_estado " son " objeto_con_estado`); nunca uno solo | NO | NO | NO | NO | NO | RF3/RF3b/RH1 | R-STRF-1; RX1/RX2 diferidos (DR-10) |
| clasificacion | estructural fund. | clase → instancia, mismo tipo | — | NO | NO | NO | NO | NO | RF4/RF4b | R-STRF-3 (sin colección incompleta) |
| etiquetado | estructural etiq. | obj→obj o proc→proc; origen = destino admitido (relación unaria, R-OPD-STR-10) | origen (SSE1), destino (SSE2), ambos (SSE3) | NO | NO | NO | ambos extremos | NO | SE1/SE2 | R-OPL-SE-2 (obj↔proc = exhibición) |
| etiquetadoBidireccional | estructural etiq. | obj→obj o proc→proc | origen (SSE4/SSE5); **nunca solo destino** | NO | NO | NO | ambos | NO | SE3 | AP-11; etiquetas iguales ⇒ normalizar a `reciproco` (R-STRE-1) |
| reciproco | estructural etiq. | obj→obj o proc→proc | ambos (SSE6), origen (SSE7); **nunca solo destino** | NO | NO | NO | ambos | NO | SE4/SE5 | AP-11 |

Reglas transversales de la matriz:

| ID | Regla | Oblig. | Consecuencia |
|---|---|---|---|
| R-EDIT-1 / R-OPD-EDIT-1 | Validar firma antes de crear un enlace; ofrecer solo los tipos legales para el par. | DEBE | menú de tipos filtrado por la matriz |
| R-EDIT-2 | Validar el extremo de estado antes de anclar. | DEBE | impedir anclajes ilegales (estado inicial en resultado; estado en proceso) |
| R-MOD-4, R-MOD-INPUT-1, R-OPD-CTL-3 | `e`/`c` solo en Pre(P) (consumo, efecto-entrada, agente, instrumento, con o sin estado); nunca Post(P). | NO DEBE | selector de control desactivado fuera de Pre(P) |
| R-COMB-3, AP-28, R-§21-OPL-MOD | A lo sumo un control por enlace; `c`+`e` no canonizado. | PUEDE (uno) / NO DEBE | campo escalar ⇒ imposible por construcción |
| R-ESCIND-0, R-ESC-1, AP-08 | Fragmento escindido (par TS4/TS5) sin `e`/`c`; un TS4/TS5 standalone sí admite (ETS3, ETS4, CS3, CS4). | NO DEBE | usar `escision` para decidir |
| R-ROL-UNIC-1, R-HAB-AG-5, R-OPD-HAB-4 | A lo sumo **un** enlace procedimental (consumo/resultado/efecto/agente/instrumento) por par (objeto, proceso) en edición directa; excepción: ramas de un mismo abanico (DR-6). Sin auto-resolución en edición. Entre un proceso y su descendiente no hay colisión: rigen R-ROL-1/3 y, al abstraer, la fuerza semántica (§6.5, DEC33). | DEBE («el editor DEBE impedir el segundo enlace», R-OPD-HAB-4; «DEBEN conectarse por a lo más un», R-HAB-AG-5) | impedir el segundo enlace |
| R-MULT-1/1A/1B/1C, R-OPD-MUL-1 | Multiplicidad solo en etiquetados, agregación y procedimentales; NUNCA en extremo proceso; la repetición se modela con proceso recurrente o subprocesos. | DEBE / NO DEBE / NUNCA | impedir |
| R-OPL-RUTA-2/3 | Ruta = nombre definido por el modelador, no autogenerado; producto la restringe a consumo/resultado (restricción declarada, no límite del canon). | DEBE | impedir en otros tipos; ruta vacía no existe |
| R-VIS-RUTA-1 | Con rutas, consumo y resultado se emparejan por coincidencia exacta de etiqueta. | DEBE | semántica (sin runtime: documental) |
| R-AG-1/1A/1B, AP-05 | Agente = exclusivamente humanos o grupos humanos; robots/software/IA/máquinas = instrumento. | DEBE | proxy declarado: agente solo desde objeto **físico** (método F); advertencia metodológica recordatoria (DR-5) |
| R-OBJ-2, R-EFE-1, R-OPD-EST-3 | Objeto sin estados solo puede crearse (resultado) o consumirse; efecto exige ≥1 estado. | inf. NO DEBE / DEBE («el editor DEBE restringir el enlace de efecto a objetos con ≥1 estado», R-OPD-EST-3) | impedir efecto a objeto sin estados propios ni heredados (DR-43) |
| R-RES-1, AP-04 | Resultado hacia objeto con estado inicial: al rectángulo o a estado no inicial; NUNCA al estado inicial. | DEBE / NUNCA | impedir |
| R-STRF-1/2/2A, R-EST-PERS-1/2, R-OPD-STR-3 | Salvo exhibición, refinable y refinadores de igual perseverancia (= mismo tipo). | DEBE | impedir |
| R-EXC-1B | `e`/`c` NUNCA sobre excepción. | NUNCA DEBE | impedir |
| R-DIST-1, AP-06 | Consumo/resultado nunca en el contorno de un proceso descompuesto. | NO DEBE | migrar automáticamente (§3.2); impedir anclaje directo al contorno |
| R-CX-DIST-2, AP-21 | Evento desde objeto **sistémico** no cruza la frontera de un proceso descompuesto; desde objeto ambiental PUEDE. | NO DEBE / PUEDE | migrar al primer subproceso (§3.2); impedir anclaje al contorno |
| AP-27 | Evento a subproceso no primero: bloquear si algún subproceso de una banda anterior tiene un enlace transformador sin `c` (efecto obligatorio no omitible); advertir si todos los previos son omisibles. | DEBE bloquearse / DEBE advertirse | impedir / advertir |
| §3.11 | Estado no contiene nada; un proceso no contiene estados. | inf. DEBE | impedir |
| R-OPL-SE-2, R-EST-TAG-1 | Etiquetados solo obj↔obj o proc↔proc. | DEBE | impedir |
| V-30 / R-EST-SSE-1, AP-11 | Bidireccional y recíproco no existen con estado solo en destino. | NO DEBE / DEBE bloquearse | impedir |

### 2.2 Abanicos (familias × dirección) — reglas §7.2 (textual)

| Familia | Convergente | Divergente |
|---|---|---|
| Consumo | N objetos → 1 proceso | 1 objeto → N procesos |
| Resultado | N procesos → 1 objeto | 1 proceso → N objetos |
| Efecto | N objetos ↔ 1 proceso | N procesos ↔ 1 objeto |
| Agente | N agentes → 1 proceso | 1 agente → N procesos |
| Instrumento | N instrumentos → 1 proceso | 1 instrumento → N procesos |
| Invocación | N procesos → 1 proceso | 1 proceso → N procesos |

- R-FAN-HAB-1 (textual): «los habilitadores convergentes (N agentes o N instrumentos sobre 1 proceso) son canónicos. Por defecto son **AND** (todos requeridos […]): se realizan como enlaces habilitadores planos al mismo proceso, sin arco lógico. El arco XOR/OR solo se dibuja para el abanico alternativo». Deroga R-OPD-CTL-7 «agente e instrumento solo admiten divergente» (DR-9).
- R-FAN-GEO-2: todo abanico DEBE clasificarse convergente (extremo común = destino) o divergente (extremo común = origen); el arco va en el extremo común (DR-9).
- AP-03, R-OPD-CTL-8: abanicos de resultado e invocación NO admiten `e`/`c`; en los demás, `e`/`c` van por rama y solo en Pre(P).
- Abanico con control mixto (algunas ramas `c`, otras no): no canonizado (spec-OPL §8.4) ⇒ rechazar como `non-canonical` (R-ZNC-COMB-1).
- Combinaciones abanico×control que spec-OPL §8.3 lista como **válidas** pero sin plantilla literal (C-19b: evento en fans de otros roles; condición en fan de instrumento de C-18, que solo trae la plantilla de consumo; condición en fan de agente vía R-FAN-3 general) son **canónicas no soportadas**: no se ofrecen en la UI y el parser responde `unsupported-canonical` (R-IMPORT-5), NO `non-canonical`. Solo lo no listado es `non-canonical` (R-COMB-1). Condición/evento en fan de invocación o de resultado es **inválido** (AP-03, AP-10, C-20, C-28): impedir.
- R-FAN-EST-1: cada rama PUEDE tener o no estado especificado propio.
- `Pr=p` solo dentro de abanico XOR declarado probabilístico (no ofrecido: §0.4). `Pr` sin abanico ⇒ `non-canonical` (reglas §11.2).

### 2.3 Matriz de combinaciones de spec-OPL §8.3 (lista blanca/negra, textual resumida)

| # | Combinación | Estatus | Plantilla OPL compuesta |
|---|---|---|---|
| C-01 | consumo × evento | válida | `**A** inicia *P*, que consume **A**.` |
| C-02 | consumo × condición | válida | `*P* ocurre si **A** existe, en cuyo caso **A** se consume, de lo contrario *P* se omite.` |
| C-03 | resultado × evento | **inválida** | — |
| C-04 | resultado × condición | **inválida** | — |
| C-05 | efecto × evento (objeto con estado) | válida | `**A** inicia *P*, que afecta **A**.` |
| C-06 | efecto × condición | válida | `*P* ocurre si **A** existe, en cuyo caso *P* afecta **A**, de lo contrario *P* se omite.` |
| C-07 | agente × evento | válida | `**Agente** inicia y maneja *P*.` |
| C-08 | agente × condición | válida | `**Agente** maneja *P* si **Agente** existe, de lo contrario *P* se omite.` |
| C-09 | instrumento × evento | válida | `**Instrumento** inicia *P*, que requiere **Instrumento**.` |
| C-10 | instrumento × condición | válida | `*P* ocurre si **Instrumento** existe, de lo contrario *P* se omite.` |
| C-11 | consumo × XOR convergente | válida | `*P* consume exactamente uno de **A**, **B** o **C**.` |
| C-12 | consumo × OR convergente | válida | `*P* consume al menos uno de **A**, **B** o **C**.` |
| C-13 | resultado × XOR divergente | válida | `*P* genera exactamente uno de **A**, **B** o **C**.` |
| C-14 | efecto × XOR/OR | válida | `*P* afecta exactamente uno de **A**, **B** o **C**.` |
| C-15 | agente × XOR | válida | `**Agente** maneja exactamente uno de *P*, *Q* o *R*.` |
| C-16 | instrumento × XOR divergente | válida | `Exactamente uno de *P*, *Q* o *R* requiere **B**.` |
| C-17 | invocación × XOR/OR | válida | `*P* invoca exactamente uno de *Q* o *R*.` |
| C-18 | consumo/efecto/instr × condición × XOR/OR (todas las ramas `c`, mismo tipo) | válida | `*P* ocurre si exactamente uno de **A**, **B** o **C** existe, en cuyo caso *P* consume exactamente uno de **A**, **B** o **C**, de lo contrario *P* se omite.` (plantilla solo para consumo; efecto usa reglas §7.4; instrumento sin plantilla ⇒ `unsupported-canonical`) |
| C-19 | efecto × evento × XOR/OR (objeto común, procesos alternativos) | válida | `**B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre.` |
| C-19b | otros transformadores/habilitadores × evento × XOR/OR | válida (canon) sin plantilla literal («plantilla específica por rol») | no se ofrece; parser `unsupported-canonical` (R-IMPORT-5) |
| C-20 | resultado × condición × XOR/OR | **inválida** | — |
| C-21 | consumo/resultado/efecto × XOR (ramas = estados de un objeto) | válida | `*P* cambia **Obj** a exactamente uno de `s1`, `s2` o `s3`.` — producto: solo para efecto; consumo/resultado usan la plantilla genérica de reglas §7.3 con `**Obj** en `s`` (DR-30) |
| C-21b | efecto TS3 × XOR/OR con entrada común | válida | `*P* cambia **Obj** de `s0` a exactamente uno de `s1`, `s2` o `s3`.` |
| C-22 | resultado × XOR × probabilidad | válida (no ofrecida) | `*P* genera exactamente uno de **A** `Pr=0.6`, **B** `Pr=0.4`.` |
| C-23 | cualquier rol × probabilidad sin abanico | **no-canonizada** | — |
| C-24 | consumo/resultado × … × ruta | válida | `Por ruta L1, *P* consume **A**.` (una oración por enlace) |
| C-25 | agente/instrumento × ruta | canónica-condicionada (no emitida por producto) | parser: `unsupported-canonical` (DR-19) |
| C-26 | `c` + `e` mismo enlace | **no-canonizada** | — |
| C-27 | estructural × `e`/`c` | **inválida** | — |
| C-28 | invocación × `e`/`c` | **inválida** | — |
| C-29 | escindido TS4/TS5 × `e`/`c` | **inválida** | — |
| C-30 | dos procedimentales objeto↔mismo proceso | resolución solo al recomponer (fuerza) | edición directa: impedir |
| C-31 | recomposición con roles distintos al mismo objeto | matriz de precedencia | §3.4 |

---

## 3. Refinamiento y consistencia inter-OPD

### 3.1 Mecanismos (reglas §8.1, textual)

| Par | Refinamiento | Abstracción | Ámbito |
|---|---|---|---|
| Estados | Expresión de estados | Supresión de estados | estados |
| Estructura | Despliegue (`unfolding`) | Plegado (`folding`) | comportamiento estructural |
| Comportamiento | Descomposición (`in-zooming`) | Recomposición (`out-zooming`) | comportamiento dinámico |
| Composición inter-modelo | Referencia a sub-modelo | Desconexión | cross-model (**no exigido**, §0.4) |

- R-REF-SYNC-1/2: descomposición síncrona (orden temporal); despliegue asíncrono, NO implica secuencia (su OPL NUNCA lleva `en esa secuencia` ni `paralelo`).
- R-REF-MEC-1: el despliegue DEBE aplicarse por relación fundamental (modo).
- R-OPL-CX-3: una descomposición PUEDE ocurrir en el mismo diagrama o en uno nuevo. Producto: siempre OPD nuevo (DR-24).

### 3.2 Descomposición (in-zoom) de proceso — operación atómica

Secuencia (R-VIS-INZOOM-1, R-OPD-REF-3, R-OPD-OP-1, método A3.1): Mostrar contenido → Refinar enlaces, en un solo gesto atómico (R-OPD-OP-3: el estado semidescompuesto NO DEBE persistirse como canónico).

| ID | Regla | Oblig. |
|---|---|---|
| R-HIJO-1, R-OPD-REF-1, R-ANID-1/1A | En el OPD hijo, la cosa refinada aparece agrandada como **contenedor** (elipse inflada), con **contorno grueso** en padre y en hijo. | DEBE |
| R-HIJO-3, R-OPD-REF-4 | El hijo copia como **externos** todas las cosas conectadas al padre por cualquier enlace (conservan esencia, contorno, estados; posición recalculada). | DEBE |
| R-HIJO-5 | Un externo NO se refina desde el OPD hijo donde es externo. | NO DEBE |
| R-HIJO-6, R-OPD-REF-5 | Internos (creados dentro, sin apariencia en el padre) se eliminan en cascada con el refinamiento; externos persisten. Mover un externo dentro del contenedor NO cambia su alcance: la herramienta DEBE advertir o rebotar (producto: rebotar). | DEBE |
| método A3.3 | Alcance persistido; «Una cosa no es interna y externa a la vez; reposicionarla gráficamente NO cambia su alcance». Internos solo se enlazan con cosas visibles en ese OPD hijo. | DEBE |
| R-OPD-UI-3 | El drag de un subproceso DEBE quedar confinado al interior del contenedor. | DEBE |
| R-INV-2/2A/2C/2D, R-IDP-0A, R-OPD-REF-2 | Orden temporal = **bandas declaradas** (fuente de verdad); la coordenada Y las realiza (arriba → abajo); misma banda = paralelo; el último del grupo paralelo en terminar invoca la banda siguiente. El layout NO reordena bandas (R-LAY-4). Descomposición de objeto: la posición NO es tiempo. | DEBE |
| R-INV-2B, R-INV-2D, R-OPD-INV-9 | La invocación implícita no se dibuja; un rayo entre hermanos que repite una transición de banda adyacente es «doble vara» y «viola R-INV-2B» ⇒ impedir (Prohibido: «bloquearlo o reportarlo como error estructural», reglas l.117). Salto fuera de orden, bucle, cross-OPD: rayo explícito legal. | NO DEBE |
| R-REF-NTRIV-1/3, AP-13, R-CX-0 | ≥2 subprocesos para cerrar; con <2: se permite en edición (placeholder), se advierte, se bloquea el export canónico y no se emite la oración de descomposición. | DEBE / NO DEBE / PUEDE |
| R-OPL-CX-4 | OPL-ES soporta descomposición de procesos y de objetos. Descomposición de objeto: DEBE, escalonable (DR-23). | DEBE |

Distribución de enlaces al descomponer (reglas §8.5 = spec-OPL §7.6 = spec-OPD §10.2, textual):

| Tipo de enlace | Contorno exterior del proceso padre | Distribución |
|---|---|---|
| Consumo | **PROHIBIDO** | Migra al **primer** subproceso |
| Resultado | **PROHIBIDO** | Migra al **último** subproceso |
| Efecto básico (sin estado) | PERMITIDO | A todos los subprocesos |
| Efecto entrada-salida | — | Escisión TS4/TS5 |
| Agente | PERMITIDO | A todos los subprocesos |
| Instrumento | PERMITIDO | A todos los subprocesos |
| Estructural | NO se distribuye | Permanece asociado al contenedor |
| Evento sistémico | **PROHIBIDO** cruzar frontera | — |
| Evento ambiental | Permitido cruzar frontera | Con modelado de contingencia |

Realización mínima conforme (DR-13/DR-14):
- «Permitido al contorno = a todos los subprocesos» se realiza dejando el enlace anclado al **contorno** del contenedor, con lectura distributiva («paréntesis algebraico», R-OPD-REF-11). No se crean copias por subproceso.
- Consumo/resultado/evento sistémico: el enlace **migra** (mismo `id`, R-OPD-OP-4) al primer subproceso (primera banda, primer elemento) / último (última banda, último elemento). Sin subprocesos aún, queda en el contorno como respaldo temporal (R-VIS-DIST-1) y migra al insertarse el primero; migraciones posteriores son responsabilidad del modelador (método A3.4: «es responsabilidad del modelador reasignarlos»).
- TS3 con ≥2 subprocesos: se reemplaza por el par escindido TS4 (subproceso temprano, sale de `s-entrada`) + TS5 (tardío, entra en `s-salida`), ambos con `escision {parId}` (R-ESCIND-1..3, R-ESC-1A: único mecanismo). Con 1 subproceso, TS3 migra entero a él.
- Invocación y excepción hacia/desde el proceso descompuesto: permanecen en el contorno (GAP no cubierto por la tabla; DR-14).
- R-OPD-EDIT-5: al insertar subprocesos, los enlaces del padre migran automáticamente; el modelador reasigna al subproceso real (reanclaje).

### 3.3 Despliegue (unfold) de cosa

| ID | Regla | Oblig. |
|---|---|---|
| R-REF-MEC-1, R-CX-DESP-1 | Por relación fundamental (modo); NO mezclar dos relaciones en una oración de despliegue. | DEBE / NO DEBE |
| R-HIJO-4, R-OPD-REF-4 | El hijo copia solo los hijos estructurales directos (de ese modo). | DEBE |
| R-OPD-REF-1, R-CTRN-2 | Despliegue en OPD nuevo marca contorno grueso; despliegue intradiagrama NO. | DEBE / NO DEBE |
| R-REF-NTRIV-2/3 | ≥2 refinadores para cerrar (idem AP-13). | DEBE |
| spec-OPL §7.2 edge | En despliegue las partes viven **fuera** del contenedor y se conectan por enlaces estructurales; pertenencia por presencia en el OPD hijo. | inf. |
| método A3.2, R-OPD-EDIT-6 | Despliegue parcial ⇒ colección incompleta; la herramienta DEBE rastrear refinadores y ajustar símbolo y OPL cuando cambia la colección. | DEBE |
| R-OPD-OP-5 | Si la herramienta rastrea refinadores y ajusta símbolo/OPL automáticamente (lo que R-OPD-EDIT-6 exige), DEBE conservar **trazabilidad de cada ajuste automático** (p. ej. diagnóstico `info` o entrada en el historial de la operación). Reglas lo formula como PUEDE; spec-OPD como DEBE (DR-45). | DEBE (si ajusta) |

### 3.4 Restricciones inter-OPD y consistencia

| ID | Regla | Oblig. |
|---|---|---|
| R-REF-1, AP-16, R-OPD-REF-8 | Sin ciclos de refinamiento (chequeo transitivo sobre ancestros). | NO DEBE (PROHIBIDO) |
| R-REF-2, AP-15, R-OPD-REF-17 | Sin instancia visual entre tipos distintos (una apariencia conserva el tipo de su cosa). | NO DEBE |
| R-REF-3, método A4.3 | Solo OPDs hoja eliminables del árbol. | inf. NO DEBE |
| R-REF-4, R-CX-1, R-OPD-REF-9 | Esencia, perseverancia y nombre NO cambian a través del refinamiento (por construcción: viven en la cosa). | NO DEBE |
| R-CONSIST-1 | Un hecho en un OPD NO DEBE contradecir otro (por construcción: kernel único). | NO DEBE |
| R-CTRN-1/1A, R-OPD-COSA-4 | Contorno/afiliación persiste en todos los niveles. | DEBE |
| R-OBJ-6, R-OPD-STR-13, R-VIS-HER-2 | «La afiliación DEBE heredarse por cadena estructural»; atributos **y operaciones** de cosa ambiental son ambientales «automáticamente» (propagar al crear la exhibición y al volver ambiental al exhibidor; advertir incoherencias en el resto de la cadena). | DEBE |
| R-OBJ-7 | Procesos ejecutados por cosas ambientales DEBEN modelarse ambientales (advertencia metodológica). | DEBE |
| R-OPD-OP-6 | Advertir si un objeto se incluye como refinador en más de un contexto con ambigüedad de pertenencia. | DEBE |
| R-OPD-REF-10, método A0.4a | La descomposición DEBE preservar la firma de frontera del proceso abstracto; checker pasivo `DESCOMPOSICION_NO_PRESERVA_FRONTERA`. Con vista del padre derivada (§3.5) se cumple por construcción (DR-16). | DEBE |
| R-SD-4, R-VIS-SD-1 | El SD contiene exactamente un proceso sistémico (PUEDE contener ambientales) ⇒ advertir. | inf. DEBE |
| R-OPD-VAL-6 | DEBERÍA detectar inconsistencias inter-OPD, cruce de eventos sistémicos, inclusión múltiple de refinador, generales redundantes junto a especializados. | DEBERÍA |
| R-HER-8, AP-29, R-EST-HER-1, R-OPD-STR-6 | Heredados NO se dibujan ni se emiten como explícitos duplicados; la herramienta no materializa herencia. | NO DEBE |
| R-HER-1, R-VIS-HER-1, R-OPD-STR-6 | La herencia (partes, rasgos, etiquetados, procedimentales; método §9.9 añade estados) «DEBE aplicarse aunque los enlaces heredados no se dibujen localmente» ⇒ los validadores que dependen de enlaces/estados consultan la cadena de generales (DR-43). | DEBE |
| R-HER-2 | Herencia múltiple permitida con trazabilidad de cada general (varios enlaces de generalización). | DEBE |

### 3.5 Proyección entre niveles (vista del OPD padre y visibilidad en el hijo)

| ID | Regla | Oblig. |
|---|---|---|
| R-OPL-DISP-3, R-OPL-PANEL-4 | En un OPD ascendente, los hechos refinados en descendientes se muestran **plegados** (hecho agregado). | DEBE |
| R-OPD-REF-13, reglas §6.5 | Al abstraer (vista padre), colisiones objeto↔mismo proceso se resuelven por fuerza semántica; en edición directa NO se auto-resuelven. | inf. DEBE |
| R-PREC-1..5, AP-30 | Matriz de precedencia (abajo); R+R y C+C inválidos; R+C ⇒ efecto solo con continuidad de identidad/estados; sin evidencia NO colapsar (conflicto reportado); transformador prevalece sobre habilitador. | DEBE / NO DEBE |
| R-VIS-HIJO-1, R-OPD-REF-6 | En un OPD hijo (textual): «enlaces estructurales al contenedor DEBEN verse, **enlaces procedimentales al contenedor NO DEBEN verse directamente** [(se distribuyen, §10.2)], enlaces entre internos DEBEN verse, y enlaces que no tocan contenedor ni internos DEBEN ocultarse». La cláusula procedimental choca con reglas §8.5 / R-OPD-REF-11 («PERMITIDO al contorno = a todos», «paréntesis algebraico»): DR-13 resuelve por lectura distributiva sobre el contorno; es desvío declarado de R-VIS-HIJO-1 y va al registro de conformidad (R-CONF-7). | DEBEN / NO DEBEN |

Realización (DR-13): la visibilidad es derivada. En un OPD `O`, el extremo `E` de un enlace se ve como `E` si `E` tiene apariencia en `O`; si no, como su ancestro de descomposición más cercano con apariencia en `O` (solo in-zoom abstrae; el despliegue no). Enlaces que colapsan en el mismo par (objeto, proceso) se fusionan por fuerza; los que colapsan sobre la misma cosa (interno↔subproceso) desaparecen. Varios efectos sobre el mismo objeto se fusionan en un efecto cuyo estado de entrada es el del enlace con entrada de la banda más temprana y cuyo estado de salida es el del enlace con salida de la banda más tardía (un par escindido se abstrae así de vuelta a su TS3). En OPDs hijos se aplica además R-VIS-HIJO-1.

Fuerza semántica (reglas §6.5, textual):
```
consumo = resultado > efecto > agente > instrumento
evento > sin control > condición
```

| Nivel | Enlace |
|---|---|
| 1 | Evento de consumo |
| 2 | Consumo = Resultado |
| 3 | Condición de consumo |
| 4 | Evento de efecto |
| 5 | Efecto |
| 6 | Condición de efecto |
| 7 | Evento de agente |
| 8 | Agente |
| 9 | Condición de agente |
| 10 | Evento de instrumento |
| 11 | Instrumento |
| 12 | Condición de instrumento |

Matriz de precedencia transformadora (reglas §6.6, textual):

| B↔P1 \ B↔P2 | Efecto | Resultado | Consumo |
|---|---|---|---|
| **Efecto** | Efecto | Resultado | Consumo |
| **Resultado** | Resultado | **Inválido** | Efecto |
| **Consumo** | Consumo | Efecto | **Inválido** |

Resolución mínima: «Inválido» ⇒ diagnóstico error AP-30 («Corregir el nivel hijo»); Resultado+Consumo ⇒ se muestran ambos y se emite diagnóstico de conflicto R-PREC-3 (no se colapsa sin evidencia, R-PREC-4).

### 3.6 Árbol OPD, identidad y OPL total

| ID | Regla | Oblig. |
|---|---|---|
| R-ARB-1 | Árbol con raíz `SD`; nodos = OPDs creados por refinamiento. | DEBE |
| R-ARB-4 | Cada arista ≡ `se refina por descomposición de … en` / `se refina por despliegue de … en` (semántica de la arista; no obliga a emitir CX4). | DEBE |
| R-IDP-0/0B/0C/1/1A/2/3 | Orden temporal, orden de navegación e identidad son canales separados; `SDx.y` es proyección y PUEDE mutar; id persistente estable; referencias externas por id. | DEBE |
| R-OPL-CX-ID-1, R-CX-2 | Toda `SDx.y` en OPL se resuelve al id persistente. | DEBE |
| R-OPL-TOTAL-1/2 | OPL completo = concatenación de párrafos por OPD en orden de navegación; cubre todo el modelo cargado, no solo el contexto actual. | DEBE / NO DEBE |
| R-OPL-TOTAL-4/5 | El OPL de un OPD expresa solo estados visibles/referenciados ahí; el conjunto completo de estados = unión. | DEBE |
| R-OPD-OP-4 | Toda migración preserva la identidad del hecho o declara eliminación/creación explícita. | DEBE |
| R-OPD-OP-2 | Recomposición = inversa (COND). Producto: «Eliminar refinamiento» destructivo con confirmación que PUEDE materializar en el padre la vista abstraída (§3.5) antes de borrar internos (DR-17). | DEBE (si se ofrece) |
| método A1.5-d | «Eliminar refinamiento es una operación destructiva distinta, nunca la inversa de Integrar». | inf. DEBE |

---

## 4. OPL-ES

### 4.1 Contrato textual y formato

| ID | Regla | Oblig. | Consecuencia |
|---|---|---|---|
| R-OPL-TEXT-2, R-OPL-EQ-5 | El OPL fija superficie; no redefine semántica. El modelo es invariante al OPL. | DEBE | OPL = proyección del kernel |
| R-OPL-TYPO-1, spec-OPL §1.1, R-§21-OPL-TIPO | **objeto** en negrita, *proceso* en cursiva, `estado` en monoespaciado (Markdown `**…**`, `*…*`, `` `…` ``). «la tipografía es portadora de tipo; sin ella el parser no distingue objeto de proceso». | DEBE | generar y parsear con esas marcas; el panel las renderiza |
| R-OPL-TYPO-2 | Colores, contornos, sombras y atributos visuales NO forman parte del OPL. | inf. NO DEBE | — |
| R-OPL-EBNF-4/5 | Un párrafo = oraciones separadas por salto de línea; toda oración termina en punto. | DEBE | una oración por línea |
| R-OPL-EBNF-6 | Toda oración ∈ {descripción de cosa, procedimental, estructural, gestión de contexto} (+ compuesta ext §9). | DEBE | clasificador de 4 ramas |
| spec-OPL §1, R-§21-OPL-VOCAB | Vocabulario = enum cerrado: generación NO emite verbo/cópula fuera de él; parseo NO reconoce otro. Verbos en 3.ª persona singular del presente indicativo. | DEBE / NO DEBE | lista blanca = palabras fijas de las plantillas de §4.4 (DR-27) |
| R-OPL-KW-1/2, R-VERB-KW-1/2 | Palabras clave exactas, salvo alternancia `y/e`, `o/u` decidida solo por la condición fonética del término siguiente. | DEBE | `e` ante sonido /i/ (`i-`, `hi-` + consonante); `u` ante sonido /o/ (`o-`, `ho-`); el parser acepta ambas (DR-26) |
| R-OPL-LISTA-1, R-§18-LISTA-1, R-COMP-EJE-1 | Listas: coma entre intermedios y `y`/`o` antes del último, SIN coma de Oxford. | DEBE | excepto `lista_de_secuencia_mixta` y `, y otros estados` (literal EBNF) |
| R-ENT-2 | NO se emite OPL canónico para cosas o estados con nombre placeholder. | NO DEBE | producto: no existen placeholders (DR-11) |
| R-OPL-INT-1/2, R-COMP-MAESTRA-1..3, R-§21-OPL-SPAN | Cada línea = texto + tokens; token portador ⇒ referencia tipada (`entidad`/`enlace`/`estado`; `opd` para `SDx.y`, DR-28); tokens sin referencia con rol `texto`; roles `texto`/`nombre`/`verbo`/`estado`; refs únicas por `tipo:id` en orden de primera aparición; cada token sabe a qué hecho (enlace) pertenece. Nunca fusión opaca. | DEBE / NUNCA | estructura `LineaOpl` (§4.11) |

### 4.2 Vocabulario fijo (reglas §4.3, textual)

Verbos:

| Función | OPL-ES |
|---|---|
| Consumo | consume |
| Resultado | genera |
| Efecto | afecta |
| Cambio de estado | cambia … de … a |
| Agente | maneja |
| Instrumento | requiere |
| Iniciación (evento) | inicia |
| Invocación | invoca |
| Ocurrencia (condicional/excepción) | ocurre |
| Existencia | existe |
| Omisión (pasiva) | se omite |
| Consumo (pasiva) | se consume |
| Agregación | consta de |
| Exhibición | exhibe |
| Especialización plural | son |
| Especialización singular | es un / es una |
| Instanciación | es una instancia de |
| Relación sin etiqueta | se relaciona con |
| Variación de rango | varía de … a |
| Tipo | es de tipo |
| Enumeración de estados | puede estar |
| Descomposición | se descompone en … en esa secuencia |
| Despliegue | se despliega en |
| Refinamiento entre OPDs | se refina por descomposición de … en |
| Plegado | se pliega en |
| Recomposición | se recompone desde |

Palabras clave:

| Función | OPL-ES |
|---|---|
| Condicional | si |
| Consecuencia | en cuyo caso |
| Alternativa | de lo contrario |
| Origen | de |
| Destino | a |
| Conjunción copulativa | y / e ante `i-` o `hi-` |
| Conjunción disyuntiva | o / u ante `o-` o `ho-` |
| Adición heterogénea | así como |
| XOR | exactamente uno de |
| OR | al menos uno de |
| Colección incompleta | al menos otro/a |
| Opcionalidad | un/una opcional |
| Cardinalidad inferior | al menos un/una |
| Ruta | por ruta |
| Duración | duración de |
| Sobretiempo | excede |
| Subtiempo | es menor que |
| Secuencia | en esa secuencia |

Reglas duras de cópula (spec-OPL §1.2): **R-VERB-EST-1** la enumeración de estados DEBE usar `puede estar`; **R-VERB-EST-2** `puede ser` DEBE reservarse a especialización XOR y NO DEBE enumerar estados (`Incorrecto: **Pedido** puede ser `pendiente`…`). **DIV-2**: `es inicial`, `es final`, `es por defecto`, `es inicial y final` son plantillas de designación, no verbos.

Palabras fijas adicionales que aparecen en plantillas canónicas y por tanto pertenecen al vocabulario cerrado (DR-27): `está en`, `en` (estado), `, que` (relativa de evento), `inicia y maneja`, `en cualquier estado`, `se invoca a sí mismo`, `paralelo`, `es afectado por`, `es manejado por`, `puede ser uno de`, `y otros estados`, `al menos otra parte`, `al menos otro rasgo`, `al menos otra especialización`, `Estado … de … es`, `declarado `Current``, `es valor`, `Si … entonces … ocurre y consume …, de lo contrario se omite`, `Por ruta … ,`, `opcional (cero o más)`, `exactamente un/una`, `es un {objeto|proceso}`, `físico`/`informacional`/`sistémico`/`ambiental` (solo en la forma combinada R-ENT-3).

### 4.3 Decisiones de diseño de superficie (reglas §4.2)

| ID | Regla | Oblig. |
|---|---|---|
| R-OPL-1 | Género masculino por defecto, ajustable al género natural del sustantivo (`un/una`). | inf. DEBE |
| R-OPL-2 | `estar` para estados mutables (`está en`); `ser` para propiedades invariantes. | inf. DEBE |
| R-OPL-3 | Artículos omitidos salvo donde se requieren (`es un/una`, `de lo contrario`, `al menos`). | inf. DEBE |
| R-OPL-4 | El estado sigue al objeto con `en`: `**Usuario** en `activo` maneja *Procesar*`. | inf. DEBE |
| R-OPL-5 | Pasiva refleja: `se consume`, `se omite` (no `es consumido`, `es omitido`). | inf. DEBE |
| R-OPL-6/7 | Orden sujeto-verbo-complemento de la plantilla; no reordenar si rompe el análisis bidireccional. | DEBE / NO DEBE |
| R-OPL-8 | Omitir la preposición personal `a` ante objetos directos (`maneja`, `requiere`, `consume` sin «a»). | DEBE |
| R-OPL-9 | Un proceso PUEDE aparecer como `Nombre` o `Nombre proceso` (el parser acepta el sufijo). | PUEDE |
| R-OPL-EQ-1/4 | Proceso en infinitivo o nominalización: ambas válidas; la herramienta NO DEBE forzar el infinitivo. | PUEDE / NO DEBE |
| R-COND-RAMA-1/2 | Rama negativa DEBE ser `de lo contrario *Proceso* se omite` (nunca espera ni transformación alterna); rama positiva de consumo en pasiva refleja `**Objeto** se consume`; efecto/cambio en voz activa. | DEBE |
| R-MOD-NAT-2 | Un enlace sin modificador NO emite rama `de lo contrario … se omite` (su semántica es espera). | NO DEBE |
| R-OPL-COND-ALT-2 | El generador DEBE preferir CT1 sobre la variante `Si … entonces …`. | DEBE |
| R-EST-DIR-1 | Estructurales: agregación y exhibición con el **vértice** como sujeto; generalización y clasificación con la **base** como sujeto. | DEBE |
| R-OPL-SE-1 | Etiqueta estructural de usuario: frase breve en minúscula que funciona como verbo o predicado nominal (EBNF `frase_no_capitalizada`). | DEBE |

### 4.4 Plantillas literales por familia

Estado de cada plantilla: **C** = canónica en `reglas` (tabla-gate, generar y parsear); **C·S** = canónica en `spec-OPL`; **P** = solo parseo (variante aceptada, no emitida); **X** = extensión o capacidad no exigida (§0.4): el parser responde `unsupported-canonical`. ★ = núcleo.

#### 4.4.1 Cosas y estados (reglas §4.4)

| ID | Plantilla OPL-ES | Estado |
|---|---|---|
| D1 | **Cosa** es física. | C ★ (emitida si física, DR-2) |
| D2 | **Cosa** es informacional. | C ★ (default: no se emite en canónico; parseo sí) |
| D3 | **Cosa** es ambiental. | C ★ (emitida si ambiental) |
| D4 | **Cosa** es sistémica. | C ★ (default: no se emite; parseo sí) |
| D5 | **Objeto** puede estar `estado1`, `estado2` o `estado3`. | C ★ |
| D6 | **Objeto** puede estar `estado1`, …, y otros estados. | C ★ (realización EBNF: `lista_de_estados, ", y otros estados"`) |
| D7 | Estado `s` de **Objeto** es inicial. | C ★ |
| D8 | Estado `s` de **Objeto** es final. | C ★ |
| D9 | Estado `s` de **Objeto** es por defecto. | C ★ |
| D10 | Estado `s` de **Objeto** es inicial y final. | C ★ (una oración, no dos) |
| D11 | **Cosa** es persistente. | C (P: coherente ⇒ sin cambio; incoherente ⇒ `non-canonical`, DR-3) |
| D12 | **Cosa** es transitoria. | C (P: ídem) |
| D13 | Estado `s` de **Objeto** es declarado `Current`. | C |
| R-ENT-3 | **Cosa** es un {objeto\|proceso} {esencia} y {afiliacion}. (`**Sensor** es un objeto físico y ambiental.`; solo esencia: `**Cosa** es un objeto físico.`; solo afiliación: `**Cosa** es un objeto ambiental.`) | C·S → P (reglas 9.2 manda la atómica, DR-2) |
| ENT-ATR valor | **Atributo** de **Objeto** es valor. | C (`valorSlot`) |
| ENT-ATR rango | **Atributo** de **Objeto** varía de X a Y. | X (GAP-VARIA) |
| ENT-ATR enum | **Atributo** de **Objeto** puede estar `valor1`, `valor2` o `valor3`. | C · P (el generador usa D5, DR-20) |
| Tipo de dato | `X es de tipo …` (EBNF `oracion_de_tipo_de_dato`) | X (GAP-TIPO) |
| Instancia (nombre) | `NombreInstancia : NombreClase` (rótulo, no oración) | render (DR-8) |

Ejemplo normativo (R-ENT-ATR-2): `Correcto: **Limpieza** de **Conjunto de Platos** puede estar `sucia` o `limpia`.` / `Incorrecto: … puede ser `sucia` o `limpia`.`

#### 4.4.2 Transformadores (reglas §4.5)

| ID | Tipo | Plantilla OPL-ES | Estado |
|---|---|---|---|
| T1 | Consumo | *Procesar* consume **Consumido**. | C ★ |
| T2 | Resultado | *Procesar* genera **Resultado**. | C ★ |
| T3 | Efecto | *Procesar* afecta **Afectado**. | C ★ |
| TS1 | Consumo con estado | *Proceso* consume **Objeto** en `estado`. | C ★ |
| TS2 | Resultado con estado | *Proceso* genera **Objeto** en `estado`. | C ★ |
| TS3 | Efecto entrada-salida | *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`. | C ★ |
| TS4 | Efecto solo entrada | *Proceso* cambia **Objeto** de `estado-entrada`. | C ★ |
| TS5 | Efecto solo salida | *Proceso* cambia **Objeto** a `estado-salida`. | C ★ |
| plural | — | `*Proceso* consumen **Objetos**.` · `*Procesos* generan **Objeto**.` · `*Procesos* afectan **Objeto**.` | C·S → X (DR-12) |
| pasivas legacy | — | `**Objeto** es consumido por *Proceso*` · `es generado por` | P opcional (no exigido) |
| persistente | — | proceso persistente explícito = TS3 con entrada = salida: `*P* cambia **A** de `s` a `s`.` (R-OPL-PERSIST-1/2) | C |

Nota crítica (reglas §4.5, textual): «TS4/TS5 tienen dos realizaciones distinguibles que comparten superficie textual; el régimen se determina por procedencia (ver R-ESCIND-0): (a) enlace escindido — par acoplado producido al descomponer un efecto entrada-salida (TS3) en subprocesos: TS4 temprano saca del estado de entrada, TS5 tardío pone en el de salida. Las dos mitades solo tienen sentido juntas y NO admiten modificadores de control. (b) efecto parcial standalone — enlace de efecto completo en sí mismo: TS4 solo-entrada cuya salida, si no se especifica, se resuelve al estado por defecto o a la distribución de probabilidad de estados; TS5 solo-salida. Admite evento/condición (ETS3, ETS4).» El parser produce SIEMPRE el régimen (b) (spec-OPL §3.5).

#### 4.4.3 Habilitadores (reglas §4.6)

| ID | Tipo | Plantilla | Estado |
|---|---|---|---|
| H1 | Agente | **Agente** maneja *Proceso*. | C ★ |
| H2 | Instrumento | *Proceso* requiere **Instrumento**. | C ★ |
| HS1 | Agente con estado | **Agente** en `estado` maneja *Proceso*. | C ★ |
| HS2 | Instrumento con estado | *Proceso* requiere **Instrumento** en `estado`. | C ★ |
| negadas | — | `**Agente** no maneja *Proceso*.` · `*Proceso* no requiere **Instrumento**.` · `*Proceso* no cambia **Objeto** de … a …` | X (emisión-only) |

«esta asimetría sujeto-verbo es portadora de la distinción humano/no-humano y NO DEBE igualarse» (spec-OPL §4.2).

#### 4.4.4 Evento (reglas §4.7)

| ID | Plantilla | Estado |
|---|---|---|
| ET1 | **Objeto** inicia *Proceso*, que consume **Objeto**. | C ★ |
| ET2 | **Objeto** inicia *Proceso*, que afecta **Objeto**. | C ★ |
| EH1 | **Agente** inicia y maneja *Proceso*. | C ★ |
| EH2 | **Instrumento** inicia *Proceso*, que requiere **Instrumento**. | C ★ |
| ETS1 | **Objeto** en `estado` inicia *Proceso*, que consume **Objeto**. | C ★ |
| ETS2 | **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada` a `estado-salida`. | C ★ |
| ETS3 | **Objeto** en `estado-entrada` inicia *Proceso*, que cambia **Objeto** de `estado-entrada`. | C ★ |
| ETS4 | **Objeto** en cualquier estado inicia *Proceso*, que cambia **Objeto** a `estado-destino`. | C ★ |
| EHS1 | **Agente** en `estado` inicia y maneja *Proceso*. | C ★ |
| EHS2 | **Instrumento** en `estado` inicia *Proceso*, que requiere **Instrumento** en `estado`. | C ★ |

#### 4.4.5 Condición (reglas §4.8)

| ID | Plantilla | Estado |
|---|---|---|
| CT1 | *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. | C ★ |
| CT2 | *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* afecta **Objeto**, de lo contrario *Proceso* se omite. | C ★ |
| CH1 | **Agente** maneja *Proceso* si **Agente** existe, de lo contrario *Proceso* se omite. | C ★ |
| CH2 | *Proceso* ocurre si **Instrumento** existe, de lo contrario *Proceso* se omite. | C ★ |
| CS1 | *Proceso* ocurre si **Objeto** está en `estado`, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. | C ★ |
| CS2 | *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada` a `estado-salida`, de lo contrario *Proceso* se omite. | C ★ |
| CS3 | *Proceso* ocurre si **Objeto** está en `estado-entrada`, en cuyo caso *Proceso* cambia **Objeto** de `estado-entrada`, de lo contrario *Proceso* se omite. | C ★ |
| CS4 | *Proceso* ocurre si **Objeto** existe, en cuyo caso *Proceso* cambia **Objeto** a `estado-salida`, de lo contrario *Proceso* se omite. | C ★ |
| CS5 | **Agente** maneja *Proceso* si **Agente** está en `estado`, de lo contrario *Proceso* se omite. | C ★ |
| CS6 | *Proceso* ocurre si **Instrumento** está en `estado`, de lo contrario *Proceso* se omite. | C ★ |
| COND-ALT | Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*. | P ★ (R-OPL-COND-ALT-1: el parser DEBE aceptarla) |

Efecto condicionado con estado de entrada pero sin cambio (`*P* ocurre si **A** está en `s`, en cuyo caso *P* afecta **A** …`) no tiene plantilla ni producción: `non-canonical` (DR-29).

#### 4.4.6 Excepción e invocación (reglas §4.9)

| ID | Plantilla | Estado |
|---|---|---|
| EX1 | *Manejo* ocurre si duración de *Fuente* excede máx-duración unidades-tiempo. | C ★ realizada `… excede <valor> <unidad>.` Ejemplo normativo (spec-OPL §5.3, «Correcto»): `*Manejar Excepción* ocurre si duración de *Procesar* excede 5 minutos.` |
| EX2 | *Manejo* ocurre si duración de *Fuente* es menor que mín-duración unidades-tiempo. | C ★ realizada `… es menor que <valor> <unidad>.` (test citado: `… es menor que 30 segundos`) |
| EX respaldo | `*Manejo* ocurre si duración de *Fuente* excede su duración máxima.` / `… es menor que su duración mínima.` | C·S: se **emite y parsea** cuando la cota falta (R-EXC-DUR-1); la falta de cota se advierte (canónico condicionado) |
| EX combinada | `*Manejo* ocurre si duración de *Fuente* es menor que mín-duración o excede máx-duración.` | X |
| IV1 | *Invocador* invoca *Invocado*. | C ★ |
| IV2 | *Invocador* se invoca a sí mismo. | C ★ |
| IV demora | `*Invocador* invoca *Invocado* después de <demora>.` · `… se invoca a sí mismo después de <demora>.` | X |

Nota (spec-OPL §5.3, DEBE): «`unidades-tiempo` es metavariable; la superficie DEBE realizarla como `<valor> <unidad>` cuando ambos existen; sin cota, la frase de respaldo preserva el tipo sin inventar duración». `<unidad>` en OPL = **palabra es-CL** de la unidad (los ejemplos normativos usan `minutos`, `segundos`); el enum `ms, sec, min, hour, day, week, month, year` fija **solo** la superficie visual del OPD (R-OPD-INV-6: «este enum fija solo la superficie visual»). Mapeo mínimo en DR-18; sin unidad propia se usa la del modelo (R-EXC-5).

#### 4.4.7 Estructurales fundamentales y etiquetados (reglas §4.10)

| ID | Plantilla | Estado |
|---|---|---|
| SE1 | **Origen** etiqueta **Destino**. | C ★ |
| SE2 | **Origen** se relaciona con **Destino**. | C ★ |
| SE3 | **Origen** etiqueta-f **Destino**. / **Destino** etiqueta-b **Origen**. (bidireccional, dos oraciones) | C |
| SE4 | **Origen** y **Destino** son etiqueta. (recíproco con etiqueta) | C |
| SE5 | **Origen** y **Destino** se relacionan. (recíproco sin etiqueta) | C |
| RF1 | **Todo** consta de **Parte1**, **Parte2** y **Parte3**. | C ★ |
| RF2 | **Exhibidor** exhibe **Atributo1** y **Atributo2**. | C ★ |
| RF2b | **Exhibidor** exhibe **Atributo1** así como *Operación1*. | C ★ |
| RF3 | **Especialización1** y **Especialización2** son **General**. | C ★ |
| RF3b | **Especialización** es un **General**. | C ★ |
| RF4 | **Instancia** es una instancia de **Clase**. | C ★ |
| RF4b | **Instancia1** y **Instancia2** son instancias de **Clase**. | C ★ |
| RX1 | **Especial** puede ser **General1** o **General2**. | C → X hasta resolver dirección (DR-10) |
| RX2 | **Especial** puede ser uno de **General1**, **General2** o **General3**. | C → X (DR-10) |
| RH1 | **Especial** es un **General1** y un **General2**. | C ★ |
| incompleta | `… y al menos otra parte / otro rasgo / otra especialización.` — RF1i: `**Todo** consta de **Parte1**, **Parte2** y al menos otra parte.` · `**Especialización1**, **Especialización2** y al menos otra especialización son **General**.` | C |
| esp. de estado | `**A** en `s1` y **B** en `s2` son **G** en `s`.` (R-OPL-RF-3; EBNF `oracion_de_especializacion_estado`) | C (escalonable) |
| RF2o | **Exhibidor** tiene un **Rasgo** opcional. | X |
| sufijo | `**Todo** consta de **Parte**. [etiqueta: componente critico]` | X |

Variantes de proceso (R-OPL-RF-1): agregación, exhibición, especialización e instanciación DEBEN soportar variantes de objeto y de proceso (misma plantilla con cursivas).

Estructurales con estado especificado (reglas §4.10, textual):

| ID | Grupo | Plantilla | Estado |
|---|---|---|---|
| SSE1 | Estado en origen, unidireccional | **Origen** en `estado` etiqueta **Destino**. | C |
| SSE2 | Estado en destino, unidireccional | **Origen** etiqueta **Destino** en `estado`. | C |
| SSE3 | Estado en ambos, unidireccional | **Origen** en `sa` etiqueta **Destino** en `sb`. | C |
| SSE4 | Estado en origen, bidireccional f-tag | **Origen** en `sa` etiqueta-f **Destino**. | C |
| SSE5 | Estado en origen, bidireccional b-tag | **Destino** etiqueta-b **Origen** en `sa`. | C |
| SSE6 | Estado en ambos, recíproco | **Origen** en `sa` y **Destino** en `sb` son etiqueta. | C |
| SSE7 | Estado en origen, recíproco | **Destino** y **Origen** en `sa` son etiqueta. | C |

«Restricción `V-30`: las variantes bidireccional y recíproco NO existen para el caso de estado solo en destino.» Con etiqueta nula, SSE1–SSE3 usan `se relaciona con` en lugar de `etiqueta`.

#### 4.4.8 Abanicos (reglas §7.3, textual; gate)

| Familia | XOR | OR |
|---|---|---|
| Consumo convergente | *P* consume exactamente uno de **A**, **B** o **C**. | *P* consume al menos uno de **A**, **B** o **C**. |
| Consumo divergente | Exactamente uno de *P*, *Q* o *R* consume **B**. | Al menos uno de *P*, *Q* o *R* consume **B**. |
| Resultado convergente | Exactamente uno de *P*, *Q* o *R* genera **B**. | Al menos uno de *P*, *Q* o *R* genera **B**. |
| Resultado divergente | *P* genera exactamente uno de **A**, **B** o **C**. | *P* genera al menos uno de **A**, **B** o **C**. |
| Efecto (objetos) | *P* afecta exactamente uno de **A**, **B** o **C**. | *P* afecta al menos uno de **A**, **B** o **C**. |
| Efecto (procesos) | **B** es afectado por exactamente uno de *P*, *Q* o *R*. | **B** es afectado por al menos uno de *P*, *Q* o *R*. |
| Agente divergente | **B** maneja exactamente uno de *P*, *Q* o *R*. | **B** maneja al menos uno de *P*, *Q* o *R*. |
| Agente convergente | *P* es manejado por exactamente uno de **A**, **B** o **C**. | *P* es manejado por al menos uno de **A**, **B** o **C**. |
| Instrumento divergente | Exactamente uno de *P*, *Q* o *R* requiere **B**. | Al menos uno de *P*, *Q* o *R* requiere **B**. |
| Instrumento convergente | *P* requiere exactamente uno de **A**, **B** o **C**. | *P* requiere al menos uno de **A**, **B** o **C**. |
| Invocación divergente | *P* invoca exactamente uno de *Q* o *R*. | *P* invoca al menos uno de *Q* o *R*. |
| Invocación convergente | Exactamente uno de *P* o *Q* invoca *R*. | Al menos uno de *P* o *Q* invoca *R*. |

Todas: C ★. Una rama con estado se escribe `**A** en `s`` dentro de la lista (R-FAN-EST-1; equivalencia de reglas §7.5: `*P* genera exactamente uno de **Obj** en `s1`, **Obj** en `s2`, …`).

Abanicos con estado de un mismo objeto (spec-OPL §8.1):
- R-FAN-5 (textual): «`*P* cambia **Obj** a exactamente uno de `s1`, `s2` o `s3`.` (resultado/efecto saliente) o `*P* cambia **Obj** de exactamente uno de `s1`, `s2`.` (consumo/efecto entrante)» — C·S. La segunda plantilla viene sin conjunción final (la EBNF `lista_de_estados` la hace opcional); el generador emite `o`/`u` antes del último (R-OPL-LISTA-1) y el parser acepta ambas. Para consumo/resultado con ramas de un mismo objeto el producto usa la plantilla genérica de §7.3 con `**Obj** en `s`` (DR-30); R-FAN-5 queda para efecto.
- R-FAN-5A (DEBE): fan XOR/OR de n≥2 TS3 con mismo proceso, objeto, entrada y operador: `*P* cambia **Obj** de `entrada` a exactamente uno de `s1`, `s2` o `s3`.` (OR: `a al menos uno de`). «La entrada común NO DEBE suprimirse.» Si varían entrada y salida a la vez, la generación DEBE fallar cerrado. R-FAN-5B: el parser reconstruye un TS3 por salida y **un único** abanico. — C·S.

Abanico × modificador (reglas §7.4 y spec-OPL, textual):
- Evento + XOR/OR: `**B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre.` (R-FAN-4: NO DEBE emitirse `**B** … afecta … procesos` ni `que afecta el proceso que ocurre`; nunca en fan de resultado.)
- Condición + XOR/OR (efecto divergente): `Exactamente uno de *P*, *Q* o *R* ocurre si **B** existe, en cuyo caso afecta **B**, de lo contrario se omite.`
- Condición + XOR/OR (consumo convergente, C-18): `*P* ocurre si exactamente uno de **A**, **B** o **C** existe, en cuyo caso *P* consume exactamente uno de **A**, **B** o **C**, de lo contrario *P* se omite.`
- R-FAN-3: el patrón condicional solo si TODAS las ramas portan `c` del mismo rol; abanico mixto ⇒ no canonizado (DR-31).

Estado: C, no ★ (escalonable; mientras no se ofrezca, el parser responde `unsupported-canonical`).

#### 4.4.9 Gestión de contexto (reglas §4.11 + spec-OPL §7)

| ID | Plantilla | Estado |
|---|---|---|
| CX1 | *Proceso* se descompone en *P1*, *P2* y *P3*, en esa secuencia. | C ★ |
| CX2 | *Proceso* se descompone en paralelo *P1* y *P2*. | C ★ |
| CX mixta | *Proceso* se descompone en *P1*, paralelo *P2* y *P3*, y *P4*, en esa secuencia. | C·S ★ (R-OPL-CX-5 DEBE preservar el paralelo dentro de la secuencia) |
| CX interno | spec-OPL §7.1 (textual): `… se descompone en *P1* y *P2*, así como **ObjetoInterno**.`; EBNF: `…, en esa secuencia, así como …` | C·S (PUEDE, R-OPL-CX-6; no emitida; el parser acepta ambos órdenes) |
| CX nuevo OPD | *Proceso* desde SD se descompone en SD1 en *P1* y *P2*, en esa secuencia. (EBNF) | P (DR-24) |
| CX3 | **Cosa** se despliega en SD1 en **T1**, **T2** y **T3**. | C ★ (oración de despliegue emitida en el OPD hijo, DR-24) |
| despliegue sin etiqueta | **Todo** se despliega en **Parte1** y **Parte2**. (+ `, así como *Operación*` en rasgos heterogéneos) | P |
| despliegue dedicado | `X desde SDp se despliega por {partes\|especialización\|instanciación\|rasgos} en SDh en …` | X (GAP-DESPLIEGUE-DEDICADO) |
| CX4 | SD se refina por descomposición de *Proceso* en SD1. (+ `por despliegue de **Cosa**`) | X (GAP-REFINA) |
| CX5/CX6 | *Proceso* se pliega en el OPD padre. · **Objeto** se pliega en el OPD padre. | X (GAP-PLIEGA; parser: `unsupported-canonical`, sin mutar) |
| CX7/CX8 | *Proceso* se recompone desde `diagrama`. · **Objeto** se recompone desde `diagrama`. | X (GAP-RECOMPONE) |
| CM1–CM3 | vistas de sub-modelo y referencias externas | X |

Reglas: R-CX-DESP-2 / R-CX-SYNC-2 — el despliegue NUNCA lleva `en esa secuencia` ni `paralelo` (`Incorrecto: **Pedido** se despliega en **Cabecera** y **Línea**, en esa secuencia.`). R-CX-0 — sin oración de refinamiento con <2 refinadores. R-OPD-OP-3 — un OPD semidescompuesto no emite oración canónica.

#### 4.4.10 Rutas (reglas §4.12, textual)

`Por ruta etiqueta, *Proceso* consume **Objeto**.`
`Por ruta etiqueta, *Proceso* genera **Objeto**.`

R-OPL-RUTA-1: `Por ruta` es expresión fija; NO DEBE flexionarse (`Incorrecto: Por la ruta rápida, *Cocinar* consume **Agua**.`). R-COMB-5: si algún enlace de un abanico porta ruta, el abanico NO DEBE agruparse y se emite una oración por enlace. Estado: C (no ★).

R-COMB-4 (DEBE, orden de superficie estable cuando coinciden dimensiones, textual): `[Por ruta L,] <abanico con cuantificador> <enlace base> [en `estado`] [, modificador de evento/condición] [`Pr=p`]`. «La ruta precede; la probabilidad cierra.» En producto (sin `Pr`, y ruta excluyente con abanico por R-COMB-5) se reduce a: el prefijo `Por ruta L, ` antepuesto a la oración completa del enlace, incluida su variante E\*/C\* (derivable por EBNF: `oracion_de_ruta = "Por ruta ", cadena_etiqueta, ", ", oracion_procedimental`, y `oracion_procedimental` incluye `oracion_de_control`; C-24 declara válida ruta × modificador).

#### 4.4.11 Multiplicidad (reglas §6.7 = spec-OPL §10.1 = spec-OPD §9, textual)

| Símbolo | Rango | OPL-ES |
|---|---|---|
| `?` | 0..1 | un/una opcional |
| `*` | 0..* | opcional (cero o más) |
| (sin símbolo) | 1..1 | (default; sin marca) |
| `+` | 1..* | al menos un/una |

R-MULT-1 (DEBE): la emisión antepone la frase al sustantivo, concordando género. `Correcto: *Cocinar* requiere al menos una **Olla**.` `Incorrecto: *Cocinar* requiere 1..* **Olla**.` La frase de cardinalidad es un sub-span propio (spec-OPL §10.3). Fuera de estos cuatro valores (rangos `qmín..qmáx`, intervalos, listas, parámetros, `al menos dos`, `dos o más`, `m a n`, restricciones `donde …`): X (DR-21). Huecos donde la EBNF admite la frase: objeto de consumo/resultado/instrumento, sujeto de agente, lista de efecto, disparador de evento (A.5), partes de agregación (A.9), ambos extremos de etiquetados (A.8). Las plantillas de **condición** (A.6) y el **todo** de la agregación NO tienen hueco (DR-44). Estado: C (no ★).

### 4.5 Orden y composición de oraciones (generador)

Reglas: R-OPL-DISP-1/2, R-OPL-PANEL-1 (bloques por OPD, orden jerárquico determinista y estable), R-COMP-ELEG-3 (orden determinista; DEBERÍA seguir la fuerza semántica en eje (a) y el orden del modelo en eje (b)), R-COMP-EJE-3 (DEBE coordinar destinos estructurales tras un verbo), R-CX-COMP-1..3 y R-COMP-ZP-1 (en OPD hijo de refinamiento NO fusionar enlaces de refinadores; la oración de refinamiento COEXISTE con las atómicas), R-COMP-ELEG-1/2/4, R-COMP-ZP-2/3.

Algoritmo de emisión (DR-32), por cada OPD en preorden del árbol:
1. **Oración de refinamiento** del OPD si es hijo: CX1/CX2/mixta (descomposición, ≥2 subprocesos) o CX3 (despliegue, ≥2 refinadores).
2. **Cosas visibles**, en orden de creación de su apariencia en el OPD: D1 si física, D3 si ambiental; D5/D6 con estados visibles en el orden del modelo; D10 o D7/D8, D9, D13 por estado visible designado; `es valor` si hay `valorSlot`.
3. **Procedimentales**, agrupados por proceso (orden de aparición), y por tipo en orden de fuerza: consumo, resultado, efecto, agente, instrumento; luego invocación y excepción. Cada enlace con control emite su plantilla E\*/C\* en lugar de la base (nunca ambas: es un solo hecho, R-ECA-4). Abanicos: una oración por abanico (§4.4.8) salvo ruta (R-COMB-5).
4. **Estructurales**: en OPDs no hijos, agrupados por vértice y relación (eje b: RF1, RF2/RF2b, RF3 plural agrupado por general, RF4b agrupado por clase; RH1 cuando una especialización tiene ≥2 generales, y esos enlaces salen de los grupos RF3); en OPDs hijos, una oración por enlace. Luego etiquetados (SE3 con etiquetas idénticas ⇒ SE4, R-STRE-1).
5. Empates: por nombre y luego por id.

Prosa compuesta eje (a) y (c): no se emite (PUEDE, §0.4). Por R-COMP-ZP-3 NO DEBE emitirse una oración compuesta que el parser no pueda descomponer.

### 4.6 Plegado y display (spec-OPL §12, §13, §16)

| ID | Regla | Oblig. |
|---|---|---|
| R-OPL-DISP-3 | En OPD ascendente, los hechos refinados en descendientes quedan plegados (vista abstraída §3.5). | DEBE |
| R-OPL-DISP-4 | Plegado y expandido DEBEN parsear al mismo conjunto de hechos (una línea abstraída del padre se resuelve al hecho refinado existente: `sin-cambio`). | NO DEBE / DEBE |
| R-OPL-CFG-1 | Visibilidad de esencia: exactamente tres modos, default `siempre`: `siempre` (la esencia se anota en toda frase donde aplique: el display añade D2), `solo-difiere` (= canónico), `oculta` (sin D1/D2). | DEBE |
| R-OPL-CFG-2, R-COMP-CFG-1/2, R-OPL-CFG-3/4, R-OPD-CFG-1 | Ninguna opción de display altera el texto canónico ni el conjunto de hechos. | NO DEBE |
| R-§21-OPL-DISP | Forma canónica (parseable, única autoritativa para reverse) y formas de display distinguibles. | DEBE |

### 4.7 Política de idioma

R-OPL-LANG-4/5: NO DEBE mezclarse EN y ES en un párrafo generado; los modelos mixtos solo existen como revisión/migración. Producto monolingüe es-CL; toda la maquinaria EN↔ES queda fuera (§0.4). R-OPL-EQ-5 / R-OPL-LANG-2: el modelo OPD es invariante al idioma.

### 4.8 EBNF normativa (spec-OPL §18, copia literal)

Única EBNF del canon entregado (reglas R-OPL-EBNF-1 remite a `SSOT-opl Apéndice A`, fuera del canon; DR-1). Párrafo introductorio de §18, textual: «EBNF normativa consolidada (es-CL, sin transformación de idioma). Cubre todas las familias canonizadas en §1–§12: declaraciones base, identificadores, descripción de cosas, procedimentales (transformadores + habilitadores + control), condición, estructurales, estructuras fundamentales, gestión de contexto, multiplicidad/cardinalidad y ruta. Las producciones marcadas `(* ext §n *)` son extensiones declaradas de esta spec y no figuran en el Apéndice A de `opm-opl-es`: `(* ext §2.0 *)` clasificación combinada eco-OPCloud, `(* ext §6.2 *)` rasgo opcional `tiene un … opcional`, `(* ext §6.5 *)` sufijo de etiqueta de enlace, `(* ext §9 *)` oración compuesta/coordinada.»

La EBNF opera sobre el texto con las marcas tipográficas retiradas (las marcas delimitan identificadores; DR-1). Defectos conocidos y su corrección en §10 (DR-1, DR-33).

```ebnf
(* ===== A.1 — Estructura del documento ===== *)
parrafo_opl_es = oracion_opl_es, { salto_de_linea, oracion_opl_es } ;
oracion_opl_es = oracion_formal_opl_es, "." ;
oracion_formal_opl_es = oracion_de_descripcion_de_cosa
 | oracion_procedimental
 | oracion_estructural
 | oracion_de_gestion_de_contexto
 | oracion_compuesta ;  (* ext §9 *)

(* ===== A.2 — Declaraciones base ===== *)
digito_no_cero = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' ;
digito_decimal = '0' | digito_no_cero ;
entero_positivo = digito_no_cero, {digito_decimal} ;
nombre_simple = letra, {caracter_de_cadena} ;
nombre = nombre_simple, { " ", nombre_simple } ;
segmento_etiqueta_opd = "SD", [entero_positivo] ;
palabra_capitalizada = letra_mayuscula, {caracter_de_cadena} ;
palabra_no_capitalizada = letra_minuscula, {caracter_de_cadena} ;
frase_no_capitalizada = palabra_no_capitalizada, { " ", palabra_no_capitalizada } ;
letra = letra_mayuscula | letra_minuscula ;
letra_mayuscula = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M'
 | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
 | 'Á' | 'É' | 'Í' | 'Ó' | 'Ú' | 'Ñ' | 'Ü' ;
letra_minuscula = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
 | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
 | 'á' | 'é' | 'í' | 'ó' | 'ú' | 'ñ' | 'ü' ;
caracter_de_cadena = letra | digito_decimal | '-' | '_' ;
identificador_de_tipo = "boolean" | "string" | tipo_numerico | "enumerated" ;
tipo_numerico = [prefijo], "integer" | "float" | "double" | "short" | "long" ;
prefijo = "unsigned " | "signed " ;
restriccion_de_participacion = singular_inferior | singular_superior | plural_inferior | plural_superior
 | ( "0" | limite_de_participacion, [ " a ", limite_de_participacion ] ) ;
singular_inferior = "un" | "una" | "un opcional" | "una opcional" | "al menos un" | "al menos una" ;
singular_superior = "exactamente un" | "exactamente una" ;
plural_inferior = "al menos dos" ;
plural_superior = "dos o más" ;
limite_de_participacion = entero_positivo | nombre_simple ;
unidad_de_medida = nombre_simple ;
numero_decimal = [ "-" ], ( "0" | entero_positivo ), [ ".", digito_decimal, {digito_decimal} ] ;
nombre_de_valor = nombre_simple | numero_decimal ;
limite_de_rango = nombre_de_valor | "*" ;
delimitador_inferior_de_rango = "[" | "(" ;
delimitador_superior_de_rango = "]" | ")" ;
intervalo_de_rango = delimitador_inferior_de_rango, limite_de_rango, "..", limite_de_rango, delimitador_superior_de_rango ;
expresion_de_rango = intervalo_de_rango, { ", ", intervalo_de_rango } ;
clausula_de_rango = " es ", ( nombre_de_valor | expresion_de_rango )
 | " varía de ", nombre_de_valor, " a ", nombre_de_valor ;

(* ===== A.3 — Identificadores ===== *)
identificador_de_objeto = nombre_singular_de_objeto, [ " en ", unidad_de_medida ], [ clausula_de_rango ] ;
identificador_de_proceso = nombre_singular_de_proceso | nombre_singular_de_proceso, " proceso" ;
identificador_de_cosa = identificador_de_objeto | identificador_de_proceso ;
identificador_de_estado = palabra_no_capitalizada ;
expresion_de_etiqueta = frase_no_capitalizada ;
nombre_singular_de_objeto = palabra_capitalizada, { " ", palabra_capitalizada | palabra_no_capitalizada } ;
nombre_singular_de_proceso = palabra_capitalizada, { " ", palabra_capitalizada | palabra_no_capitalizada } ;
estado_de_entrada = identificador_de_estado ;
estado_de_salida = identificador_de_estado ;
objeto_con_opcion_de_estado = identificador_de_objeto, [ " en ", identificador_de_estado ] ;
objeto_origen = identificador_de_objeto ;
objeto_destino = identificador_de_objeto ;
proceso_origen = identificador_de_proceso ;
proceso_destino = identificador_de_proceso ;
objeto_todo = identificador_de_objeto ;
proceso_todo = identificador_de_proceso ;
objeto_general = identificador_de_objeto ;
proceso_general = identificador_de_proceso ;
clase_de_objeto = identificador_de_objeto ;
clase_de_proceso = identificador_de_proceso ;
objeto_especial = identificador_de_objeto ;
objeto_con_estado = identificador_de_objeto, " en ", identificador_de_estado ;
nombre_de_modelo = nombre ;
etiqueta_visible_de_opd = segmento_etiqueta_opd, { ".", entero_positivo } ;
opd_padre = etiqueta_visible_de_opd ;
opd_hijo = etiqueta_visible_de_opd ;
identificador_de_proceso_activo = identificador_de_proceso ;
max_duracion_unidades_tiempo = nombre_de_valor, " unidades-tiempo" ;
min_duracion_unidades_tiempo = nombre_de_valor, " unidades-tiempo" ;
lista_de_estados = identificador_de_estado, { ", ", identificador_de_estado }, [ " o ", identificador_de_estado ] ;
lista_de_objetos = identificador_de_objeto, { ", ", identificador_de_objeto }, [ " y ", identificador_de_objeto ] ;
lista_de_procesos = identificador_de_proceso, { ", ", identificador_de_proceso }, [ " y ", identificador_de_proceso ] ;
lista_de_atributos = identificador_de_objeto, { ", ", identificador_de_objeto }, [ " y ", identificador_de_objeto ] ;
lista_de_operadores = identificador_de_proceso, { ", ", identificador_de_proceso }, [ " y ", identificador_de_proceso ] ;
lista_de_objetos_especiales = lista_de_objetos ;
lista_de_procesos_especiales = lista_de_procesos ;
lista_de_objetos_instancia = lista_de_objetos ;
lista_de_procesos_instancia = lista_de_procesos ;
lista_de_objetos_con_estado = objeto_con_estado, { ", ", objeto_con_estado }, [ " y ", objeto_con_estado ] ;
(* espejo de opm-opl-es A.5: el efecto admite multiplicidad por objeto (reglas §6.7 R-MULT-1/V-23); solo el slot de objeto la lleva, R-MULT-1A *)
objeto_procedimental = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
lista_de_objetos_procedimentales = objeto_procedimental, { ", ", objeto_procedimental }, [ " y ", objeto_procedimental ] ;
etiqueta_directa = expresion_de_etiqueta ;
etiqueta_nula_definida_por_usuario = expresion_de_etiqueta ;

(* ===== A.4 — Descripción de cosas ===== *)
oracion_de_descripcion_de_cosa = oracion_de_propiedad_generica
 | oracion_de_clasificacion_combinada  (* ext §2.0 *)
 | oracion_de_enumeracion_de_estados
 | oracion_de_estados_iniciales
 | oracion_de_estados_finales
 | oracion_de_estado_por_defecto
 | oracion_de_estado_current
 | oracion_de_tipo_de_dato ;
oracion_de_tipo_de_dato = identificador_de_objeto, " es de tipo ", identificador_de_tipo ;
oracion_de_propiedad_generica = identificador_de_cosa, " es ", ( esencia | afiliacion | perseverancia ) ;
(* ext §2.0 — clasificación combinada eco-OPCloud (R-ENT-3): esencia y afiliación en UNA oración
   con sustantivo de tipo; los adjetivos concuerdan con el sustantivo, no con la cosa. *)
oracion_de_clasificacion_combinada = identificador_de_cosa, " es un ", ( "objeto" | "proceso" ), " ",
 ( esencia_combinada | afiliacion_combinada | ( esencia_combinada, " y ", afiliacion_combinada ) ) ;  (* ext §2.0 *)
esencia_combinada = "físico" | "informacional" ;  (* ext §2.0 *)
afiliacion_combinada = "sistémico" | "ambiental" ;  (* ext §2.0 *)
oracion_de_enumeracion_de_estados = identificador_de_objeto, " puede estar ", lista_de_estados, [", y otros estados"] ;
oracion_de_estados_iniciales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es inicial" ;
oracion_de_estados_finales = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es final" ;
oracion_de_estado_por_defecto = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es por defecto" ;
oracion_de_estado_current = "Estado ", identificador_de_estado, " de ", identificador_de_objeto, " es declarado `Current`" ;
esencia = "física" | "informacional" ;
afiliacion = "ambiental" | "sistémica" ;
perseverancia = "persistente" | "transitoria" ;

(* ===== A.5 — Procedimentales ===== *)
oracion_procedimental = oracion_transformadora | oracion_habilitadora | oracion_de_invocacion | oracion_de_control ;
oracion_transformadora = oracion_de_consumo | oracion_de_resultado | oracion_de_efecto | oracion_de_cambio ;
(* multiplicidad procedimental (reglas §6.7 R-MULT-1 / V-23; §10.1): los slots de objeto admiten
   restricción de participación antepuesta; los slots de proceso NO la llevan (R-MULT-1A). *)
oracion_de_consumo = identificador_de_proceso, " consume ", [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
oracion_de_resultado = identificador_de_proceso, " genera ", [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
oracion_de_efecto = identificador_de_proceso, " afecta ", lista_de_objetos_procedimentales ;
oracion_de_cambio = oracion_de_cambio_entrada_salida | oracion_de_cambio_solo_entrada | oracion_de_cambio_solo_salida
 | oracion_de_cambio_entrada_comun_salida_fan ;
frase_de_cambio_entrada_salida = identificador_de_objeto, " de ", estado_de_entrada, " a ", estado_de_salida ;
frase_de_cambio_solo_entrada = identificador_de_objeto, " de ", estado_de_entrada ;
frase_de_cambio_solo_salida = identificador_de_objeto, " a ", estado_de_salida ;
oracion_de_cambio_entrada_salida = identificador_de_proceso, " cambia ", frase_de_cambio_entrada_salida ;
oracion_de_cambio_solo_entrada = identificador_de_proceso, " cambia ", frase_de_cambio_solo_entrada ;
oracion_de_cambio_solo_salida = identificador_de_proceso, " cambia ", frase_de_cambio_solo_salida ;
oracion_de_cambio_entrada_comun_salida_fan = identificador_de_proceso, " cambia ", identificador_de_objeto,
 " de ", estado_de_entrada, " a ", operador_de_fan, " ", lista_de_estados ;
oracion_habilitadora = oracion_de_agente | oracion_de_instrumento ;
oracion_de_agente = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " maneja ", identificador_de_proceso ;
oracion_de_instrumento = identificador_de_proceso, " requiere ", [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
oracion_de_control = oracion_de_evento | oracion_de_condicion | oracion_de_excepcion ;
oracion_de_evento = oracion_de_evento_de_consumo | oracion_de_evento_de_efecto
 | oracion_de_evento_de_agente | oracion_de_evento_de_instrumento ;
oracion_de_evento_de_consumo = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " inicia ", identificador_de_proceso,
 ", que consume ", identificador_de_objeto ;
oracion_de_evento_de_efecto = [ restriccion_de_participacion, " " ], identificador_de_objeto, " inicia ", identificador_de_proceso,
 ", que afecta ", identificador_de_objeto ;
oracion_de_evento_de_agente = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " inicia y maneja ", identificador_de_proceso ;
oracion_de_evento_de_instrumento = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado, " inicia ", identificador_de_proceso,
 ", que requiere ", objeto_con_opcion_de_estado ;
oracion_de_invocacion = identificador_de_proceso, " invoca ", lista_de_procesos
 | identificador_de_proceso, " se invoca a sí mismo" ;
oracion_de_excepcion = oracion_de_excepcion_por_sobretiempo | oracion_de_excepcion_por_subtiempo ;
oracion_de_excepcion_por_sobretiempo = identificador_de_proceso_activo,
 " ocurre si duración de ", identificador_de_proceso, " excede ", max_duracion_unidades_tiempo ;
oracion_de_excepcion_por_subtiempo = identificador_de_proceso_activo,
 " ocurre si duración de ", identificador_de_proceso, " es menor que ", min_duracion_unidades_tiempo ;
oracion_de_ruta = "Por ruta ", cadena_etiqueta, ", ", oracion_procedimental ;
cadena_etiqueta = nombre ;
(* Abanicos lógicos: el complemento puede coordinar bajo cuantificador de fan *)
operador_de_fan = "exactamente uno de" | "al menos uno de" ;

(* ===== A.6 — Condición ===== *)
oracion_de_condicion = oracion_transformadora_condicional | oracion_habilitadora_condicional ;
oracion_transformadora_condicional = oracion_de_consumo_condicional
 | oracion_de_consumo_condicional_con_estado
 | oracion_de_efecto_condicional ;
oracion_de_consumo_condicional = ( identificador_de_proceso, " ocurre si ", identificador_de_objeto,
 " existe, en cuyo caso ", identificador_de_objeto, " se consume, de lo contrario ",
 identificador_de_proceso, " se omite" )
 | ( "Si ", identificador_de_objeto, " existe entonces ", identificador_de_proceso,
 " ocurre y consume ", identificador_de_objeto, ", de lo contrario se omite ", identificador_de_proceso ) ;
oracion_de_consumo_condicional_con_estado = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_objeto, " se consume, de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_condicional = oracion_de_efecto_condicional_simple
 | oracion_de_efecto_entrada_salida_condicional
 | oracion_de_efecto_entrada_condicional
 | oracion_de_efecto_salida_condicional ;
oracion_de_efecto_condicional_simple = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, en cuyo caso ", identificador_de_proceso,
 " afecta ", identificador_de_objeto, ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_entrada_salida_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada,
 " a ", estado_de_salida, ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_entrada_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " está en ", estado_de_entrada, ", en cuyo caso ",
 identificador_de_proceso, " cambia ", identificador_de_objeto, " de ", estado_de_entrada,
 ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_de_efecto_salida_condicional = identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, en cuyo caso ", identificador_de_proceso,
 " cambia ", identificador_de_objeto, " a ", estado_de_salida,
 ", de lo contrario ", identificador_de_proceso, " se omite" ;
oracion_habilitadora_condicional = oracion_de_agente_condicional | oracion_de_instrumento_condicional ;
oracion_de_agente_condicional = ( objeto_con_opcion_de_estado, " maneja ",
 identificador_de_proceso, " si ", identificador_de_objeto, " existe, de lo contrario ",
 identificador_de_proceso, " se omite" )
 | ( objeto_con_opcion_de_estado, " maneja ", identificador_de_proceso, " si ",
 identificador_de_objeto, " está en ", identificador_de_estado, ", de lo contrario ",
 identificador_de_proceso, " se omite" ) ;
oracion_de_instrumento_condicional = ( identificador_de_proceso, " ocurre si ",
 identificador_de_objeto, " existe, de lo contrario ", identificador_de_proceso, " se omite" )
 | ( identificador_de_proceso, " ocurre si ", identificador_de_objeto, " está en ",
 identificador_de_estado, ", de lo contrario ", identificador_de_proceso, " se omite" ) ;

(* ===== A.7 — Multiplicidad, expresión y listas bifurcadas ===== *)
restriccion_de_expresion = "donde ", nombre, ( ( operacion_logica, nombre_de_valor )
 | ( inicio_conjunto, ( nombre | nombre_de_valor ), { ",", ( nombre | nombre_de_valor ) }, fin_conjunto ) ) ;
operacion_logica = "=" | "<" | ">" | "<=" | ">=" ;
inicio_conjunto = " en {" ;
fin_conjunto = "}" ;
conjunto_de_cosas_objeto = cosa_objeto, [ { ", ", cosa_objeto } ], " y ", ( cosa_objeto | "más" ),
 [ ( ", ordenados por ", criterio_de_orden ) | ( ", en esa secuencia" ) ] ;
conjunto_de_cosas_proceso = cosa_proceso, [ { ", ", cosa_proceso } ], " y ", ( cosa_proceso | "más" ),
 [ ( ", ordenados por ", criterio_de_orden ) | ( ", en esa secuencia" ) ] ;
criterio_de_orden = nombre ;
cosa_objeto = [ restriccion_de_participacion, " " ], objeto_con_opcion_de_estado ;
cosa_proceso = [ restriccion_de_participacion, " " ], identificador_de_proceso ;
oracion_de_especializacion_xor_objeto = oracion_basica_xor_objeto | oracion_xor_objeto_separada_por_comas ;
oracion_basica_xor_objeto = objeto_especial, " puede ser ", identificador_de_objeto, " o ", identificador_de_objeto ;
oracion_xor_objeto_separada_por_comas = objeto_especial, " puede ser uno de ",
 identificador_de_objeto, { ", ", identificador_de_objeto }, " o ", identificador_de_objeto ;
oracion_de_herencia_multiple_objeto = objeto_especial, " es ", lista_de_objetos_generales ;
lista_de_objetos_generales = " un ", identificador_de_objeto,
 [ { " un ", identificador_de_objeto } ], " y un ", identificador_de_objeto ;

(* ===== A.8 — Estructurales (enlaces etiquetados) ===== *)
oracion_estructural = oracion_de_enlace_estructural_etiquetado | oracion_de_agregacion
 | oracion_de_caracterizacion | oracion_de_rasgo_opcional  (* ext §6.2 *)
 | oracion_de_especializacion | oracion_de_instanciacion ;
oracion_de_enlace_estructural_etiquetado = oracion_etiquetado_unidireccional | oracion_etiquetado_bidireccional ;
oracion_etiquetado_unidireccional = oracion_etiquetado_unidireccional_simple | oracion_etiquetado_bifurcada ;
oracion_etiquetado_unidireccional_simple = oracion_etiquetado_nullTag_objeto
 | oracion_etiquetado_nullTag_proceso | oracion_etiquetado_nonNullTag_objeto | oracion_etiquetado_nonNullTag_proceso ;
oracion_etiquetado_nullTag_objeto = [restriccion_de_participacion, " "],
 objeto_origen, etiqueta_nula_unidireccional, [restriccion_de_participacion, " "], objeto_destino ;
oracion_etiquetado_nullTag_proceso = [restriccion_de_participacion, " "],
 proceso_origen, etiqueta_nula_unidireccional, [restriccion_de_participacion, " "], proceso_destino ;
oracion_etiquetado_nonNullTag_objeto = [restriccion_de_participacion, " "],
 objeto_origen, " ", etiqueta_directa, " ", [restriccion_de_participacion, " "], objeto_destino,
 [", ", restriccion_de_expresion] ;
oracion_etiquetado_nonNullTag_proceso = [restriccion_de_participacion, " "],
 proceso_origen, " ", etiqueta_directa, " ", [restriccion_de_participacion, " "], proceso_destino ;
etiqueta_nula_unidireccional = " se relaciona con " | etiqueta_nula_definida_por_usuario ;
oracion_etiquetado_bifurcada = oracion_bifurcada_nullTag_objeto | oracion_bifurcada_nullTag_proceso
 | oracion_bifurcada_nonNullTag_objeto | oracion_bifurcada_nonNullTag_proceso ;
oracion_bifurcada_nullTag_objeto = [restriccion_de_participacion, " "], objeto_origen,
 etiqueta_nula_unidireccional, conjunto_de_cosas_objeto ;
oracion_bifurcada_nullTag_proceso = [restriccion_de_participacion, " "], proceso_origen,
 etiqueta_nula_unidireccional, conjunto_de_cosas_proceso ;
oracion_bifurcada_nonNullTag_objeto = [restriccion_de_participacion, " "], objeto_origen,
 " ", etiqueta_directa, " ", conjunto_de_cosas_objeto ;
oracion_bifurcada_nonNullTag_proceso = [restriccion_de_participacion, " "], proceso_origen,
 " ", etiqueta_directa, " ", conjunto_de_cosas_proceso ;
oracion_etiquetado_bidireccional = oracion_bidireccional_asimetrica_objeto
 | oracion_bidireccional_asimetrica_proceso | oracion_bidireccional_simetrica_objeto
 | oracion_bidireccional_simetrica_proceso ;
oracion_bidireccional_asimetrica_objeto = ( [restriccion_de_participacion, " "],
 objeto_origen, etiqueta_directa_bidireccional, [restriccion_de_participacion, " "], objeto_destino,
 [", ", restriccion_de_expresion] )
 | ( [restriccion_de_participacion, " "], objeto_destino, etiqueta_inversa_bidireccional,
 [restriccion_de_participacion, " "], objeto_origen, [", ", restriccion_de_expresion] ) ;
oracion_bidireccional_simetrica_objeto = ( [restriccion_de_participacion, " "],
 objeto_origen, " y ", [restriccion_de_participacion, " "], objeto_destino, " son ", etiqueta_simetrica )
 | ( [restriccion_de_participacion, " "], objeto_origen, " y ", [restriccion_de_participacion, " "],
 objeto_destino, etiqueta_nula_bidireccional ) ;
oracion_bidireccional_asimetrica_proceso = ( [restriccion_de_participacion, " "],
 proceso_origen, etiqueta_directa_bidireccional, [restriccion_de_participacion, " "], proceso_destino )
 | ( [restriccion_de_participacion, " "], proceso_destino, etiqueta_inversa_bidireccional,
 [restriccion_de_participacion, " "], proceso_origen ) ;
oracion_bidireccional_simetrica_proceso = ( [restriccion_de_participacion, " "],
 proceso_origen, " y ", [restriccion_de_participacion, " "], proceso_destino, " son ", etiqueta_simetrica )
 | ( [restriccion_de_participacion, " "], proceso_origen, " y ", [restriccion_de_participacion, " "],
 proceso_destino, etiqueta_nula_bidireccional ) ;
etiqueta_simetrica = expresion_de_etiqueta ;
etiqueta_directa_bidireccional = expresion_de_etiqueta ;
etiqueta_inversa_bidireccional = expresion_de_etiqueta ;
etiqueta_nula_bidireccional = " se relacionan" | etiqueta_nula_definida_por_usuario ;

(* ===== A.9 — Estructuras fundamentales ===== *)
oracion_de_agregacion = oracion_de_agregacion_objeto | oracion_de_agregacion_proceso ;
oracion_de_agregacion_objeto = objeto_todo, " consta de ", lista_de_partes_objeto ;
oracion_de_agregacion_proceso = proceso_todo, " consta de ", lista_de_partes_proceso ;
lista_de_partes_objeto = parte_objeto, [ { ", ", parte_objeto } ], " y ", ( parte_objeto | "al menos otra parte" ) ;
lista_de_partes_proceso = parte_proceso, [ { ", ", parte_proceso } ], " y ", ( parte_proceso | "al menos otra parte" ) ;
parte_objeto = [restriccion_de_participacion, " "], identificador_de_objeto ;
parte_proceso = [restriccion_de_participacion, " "], identificador_de_proceso ;
oracion_de_caracterizacion = oracion_de_caract_objeto | oracion_de_caract_proceso ;
oracion_de_caract_objeto = identificador_de_objeto, " exhibe ",
 ( lista_de_atributos | lista_de_operadores | lista_de_atributos, ", así como ", lista_de_operadores ) ;
oracion_de_caract_proceso = identificador_de_proceso, " exhibe ",
 ( lista_de_operadores | lista_de_atributos | lista_de_operadores, ", así como ", lista_de_atributos ) ;
(* ext §6.2 — RF2o rasgo opcional: extensión declarada de producto; el reverse acepta además
   la variante plural « tiene … opcionales » que el generador no emite. *)
oracion_de_rasgo_opcional = identificador_de_cosa, " tiene ", ( "un " | "una " ),
 identificador_de_objeto, " opcional" ;  (* ext §6.2 *)
oracion_de_especializacion = oracion_de_especializacion_objeto | oracion_de_especializacion_proceso
 | oracion_de_especializacion_estado | oracion_de_especializacion_individual
 | oracion_de_especializacion_xor_objeto | oracion_de_herencia_multiple_objeto ;
oracion_de_especializacion_objeto = lista_de_objetos_especiales, " son ", identificador_de_objeto ;
oracion_de_especializacion_proceso = lista_de_procesos_especiales, " son ", identificador_de_proceso ;
oracion_de_especializacion_estado = lista_de_objetos_con_estado, " son ", objeto_con_estado ;
oracion_de_especializacion_individual = identificador_de_objeto, " es ", articulo, identificador_de_objeto ;
articulo = "un " | "una " ;
oracion_de_instanciacion = oracion_de_instanciacion_objeto | oracion_de_instanciacion_proceso ;
oracion_de_instanciacion_objeto = identificador_de_objeto, " es una instancia de ", identificador_de_objeto
 | lista_de_objetos_instancia, " son instancias de ", identificador_de_objeto ;
oracion_de_instanciacion_proceso = identificador_de_proceso, " es una instancia de ", identificador_de_proceso
 | lista_de_procesos_instancia, " son instancias de ", identificador_de_proceso ;

(* ===== A.10 — Gestión de contexto ===== *)
oracion_de_gestion_de_contexto = oracion_de_despliegue | oracion_de_plegado
 | oracion_de_descomposicion | oracion_de_recomposicion
 | oracion_de_composicion_intermodelo | oracion_de_referencia_externa ;
oracion_de_composicion_intermodelo = opd_hijo, " es una vista de sub-modelo de ", nombre_de_modelo
 | opd_hijo, " referencia el sub-modelo ", nombre_de_modelo, " desde ", opd_padre ;
oracion_de_referencia_externa = identificador_de_objeto, " en ", opd_hijo, " es referencia externa a ",
 identificador_de_objeto, " del modelo propietario ", nombre_de_modelo ;
oracion_de_despliegue = oracion_de_despliegue_objeto | oracion_de_despliegue_proceso ;
oracion_de_despliegue_objeto = oracion_de_despliegue_objeto_inespecificado
 | oracion_de_despliegue_objeto_todo | oracion_de_despliegue_objeto_general
 | oracion_de_despliegue_objeto_clase | oracion_de_despliegue_objeto_exhibidor ;
oracion_de_despliegue_objeto_inespecificado = identificador_de_objeto,
 " se despliega en ", lista_de_atributos, [", así como ", lista_de_operadores] ;
oracion_de_despliegue_objeto_todo = objeto_todo, " desde ", opd_padre,
 " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_objeto ;
oracion_de_despliegue_objeto_general = objeto_general, " desde ", opd_padre,
 " se despliega por especialización en ", opd_hijo, " en ", lista_de_objetos_especiales ;
oracion_de_despliegue_objeto_clase = clase_de_objeto, " desde ", opd_padre,
 " se despliega por instanciación en ", opd_hijo, " en ", lista_de_objetos_instancia ;
oracion_de_despliegue_objeto_exhibidor = identificador_de_objeto, " desde ", opd_padre,
 " se despliega por rasgos en ", opd_hijo, " en ", lista_de_atributos, [", así como ", lista_de_operadores] ;
oracion_de_despliegue_proceso = oracion_de_despliegue_proceso_inespecificado
 | oracion_de_despliegue_proceso_todo | oracion_de_despliegue_proceso_general
 | oracion_de_despliegue_proceso_clase | oracion_de_despliegue_proceso_exhibidor ;
oracion_de_despliegue_proceso_inespecificado = identificador_de_proceso,
 " se despliega en ", lista_de_operadores, [", así como ", lista_de_atributos] ;
oracion_de_despliegue_proceso_todo = proceso_todo, " desde ", opd_padre,
 " se despliega por partes en ", opd_hijo, " en ", lista_de_partes_proceso ;
oracion_de_despliegue_proceso_general = proceso_general, " desde ", opd_padre,
 " se despliega por especialización en ", opd_hijo, " en ", lista_de_procesos_especiales ;
oracion_de_despliegue_proceso_clase = clase_de_proceso, " desde ", opd_padre,
 " se despliega por instanciación en ", opd_hijo, " en ", lista_de_procesos_instancia ;
oracion_de_despliegue_proceso_exhibidor = identificador_de_proceso, " desde ", opd_padre,
 " se despliega por rasgos en ", opd_hijo, " en ", lista_de_operadores, [", así como ", lista_de_atributos] ;
oracion_de_plegado = oracion_de_plegado_objeto | oracion_de_plegado_proceso ;
oracion_de_plegado_objeto = identificador_de_objeto, " se pliega en ", opd_padre ;
oracion_de_plegado_proceso = identificador_de_proceso, " se pliega en ", opd_padre ;
oracion_de_descomposicion = oracion_de_descomposicion_en_diagrama
 | oracion_de_descomposicion_en_nuevo_diagrama | oracion_de_descomposicion_objeto_en_diagrama
 | oracion_de_descomposicion_objeto_en_nuevo_diagrama ;
(* alineación §7.1 plantilla Mixta: grupos paralelos intercalados en cualquier posición de la
   secuencia; corrige el bloque paralelo terminal « y en paralelo » de la base A.10, nunca emitido. *)
elemento_de_secuencia_mixta = identificador_de_proceso | ( "paralelo ", lista_de_procesos ) ;
lista_de_secuencia_mixta = elemento_de_secuencia_mixta, { ", ", elemento_de_secuencia_mixta },
 [ ( " y " | " e " | ", y " | ", e " ), elemento_de_secuencia_mixta ] ;
oracion_de_descomposicion_en_diagrama = ( identificador_de_proceso, " se descompone en ",
 lista_de_procesos, ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " se descompone en paralelo ", lista_de_procesos,
 [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " se descompone en ", lista_de_secuencia_mixta,
 ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] ) ;
oracion_de_descomposicion_en_nuevo_diagrama = ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_procesos, ", en esa secuencia",
 [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en paralelo ", lista_de_procesos, [", así como ", lista_de_objetos_en_zoom] )
 | ( identificador_de_proceso, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_secuencia_mixta,
 ", en esa secuencia", [", así como ", lista_de_objetos_en_zoom] ) ;
oracion_de_descomposicion_objeto_en_diagrama = identificador_de_objeto, " se descompone en ",
 lista_de_objetos, ", en esa secuencia", [", así como ", lista_de_procesos_en_zoom] ;
oracion_de_descomposicion_objeto_en_nuevo_diagrama = identificador_de_objeto, " desde ", opd_padre,
 " se descompone en ", opd_hijo, " en ", lista_de_objetos, ", en esa secuencia",
 [", así como ", lista_de_procesos_en_zoom] ;
lista_de_objetos_en_zoom = lista_de_objetos ;
lista_de_procesos_en_zoom = lista_de_procesos ;
oracion_de_recomposicion = oracion_de_recomposicion_proceso | oracion_de_recomposicion_objeto ;
oracion_de_recomposicion_proceso = identificador_de_proceso, " se recompone desde ", opd_hijo ;
oracion_de_recomposicion_objeto = identificador_de_objeto, " se recompone desde ", opd_hijo ;

(* ===== ext §9 — Oración compuesta / coordinada ===== *)
(* Extensión de esta spec: NO figura en Apéndice A de opm-opl-es. Coordina N hechos
   atómicos en UNA línea con sub-spans; cada hecho conserva ref+hint propios. *)
oracion_compuesta = oracion_compuesta_predicado_coordinado
 | oracion_compuesta_destino_enumerado
 | oracion_compuesta_sujeto_coordinado ;
conector_serial = ", " | " y " | " e " | " o " | " u " ;
oracion_compuesta_predicado_coordinado = identificador_de_proceso, " ",
 predicado_procedimental, { ", ", predicado_procedimental }, conector_final, predicado_procedimental ;
predicado_procedimental = ( "consume ", objeto_con_opcion_de_estado )
 | ( "genera ", objeto_con_opcion_de_estado )
 | ( "afecta ", lista_de_objetos )
 | ( "requiere ", objeto_con_opcion_de_estado )
 | ( "cambia ", frase_de_cambio_entrada_salida )
 | ( "consume ", operador_de_fan, " ", lista_de_objetos ) ;
oracion_compuesta_destino_enumerado = ( identificador_de_objeto, " exhibe ", lista_de_objetos )
 | ( identificador_de_objeto, " consta de ", lista_de_partes_objeto ) ;
oracion_compuesta_sujeto_coordinado = lista_de_objetos, " ", verbo_concordado_plural,
 " ", objeto_con_opcion_de_estado ;
verbo_concordado_plural = "consumen" | "generan" | "afectan" | "requieren" | "manejan" ;
conector_final = " y " | " e " | " o " | " u " ;
salto_de_linea = "\n" ;

(* ===== ext §6.5 — Sufijo de etiqueta de enlace ===== *)
(* Extensión declarada de producto: el generador adjunta la etiqueta de usuario de un enlace
   (procedimental o estructural fundamental) como sufijo tras el punto terminal de la oración
   base; el parser extrae el sufijo antes de cotejar la oración. Traza: procedural.ts·conEtiquetaEnlace
   (~273) / parsear.ts·ETIQUETA_SUFIX (línea 5) / aplicar.ts (patch fijar-etiqueta-enlace). *)
sufijo_de_etiqueta_de_enlace = " [etiqueta: ", expresion_de_etiqueta, "]" ;  (* ext §6.5 *)
oracion_con_etiqueta_de_enlace = oracion_opl_es, sufijo_de_etiqueta_de_enlace ;  (* ext §6.5 *)
```

Restricciones de §18 (textual):

- **R-§18-LEX-1**: el alfabeto léxico ADMITE letras ASCII, vocales acentuadas, `ñ`, `ü` (mayúscula/minúscula); `caracter_de_cadena` SE LIMITA a letra, dígito decimal, `-` y `_`; `nombre_simple` COMIENZA con letra. Los no-terminales normativos SE ESCRIBEN en `snake_case`.
- **R-§18-PART-1**: las restricciones de participación textuales PERTENECEN al conjunto cerrado `un/una`, `un/una opcional`, `al menos un/una`, `exactamente un/una`, `al menos dos`, `dos o más`, o límites numéricos/paramétricos (`0`, `m a n`).
- **R-§18-RANGO-1**: el rango textual USA `valor`, `varía de X a Y`, o intervalos `[..]`/`(..)` con `*` exclusivamente como límite abierto; la restricción de expresión INICIA con `donde`; las operaciones lógicas SON el conjunto ASCII `=`, `<`, `>`, `<=`, `>=`. Cualquier símbolo Unicode equivalente DEBE normalizarse a ASCII o declararse como extensión de visualización.
- **R-§18-CONJ-1**: la pertenencia a conjunto SE EMITE con `en { ... }`.
- **R-§18-LISTA-1**: las listas SEPARAN miembros intermedios con coma y el último con `y`/`o` (alternancia `e`/`u` por fonética), SIN coma de Oxford; las listas bifurcadas TERMINAN en `más`, `ordenados por criterio` o `en esa secuencia` solo donde la producción lo permita.
- **R-§18-NORM-1**: el parser NORMALIZA la entrada a la forma ASCII canónica antes de cotejar producciones; los caracteres del alfabeto extendido (acentos, `ñ`, `ü`) SE PRESERVAN en los nombres pero las operaciones lógicas y delimitadores SE NORMALIZAN a ASCII.
- **R-§18-EXT-1**: la `oracion_compuesta` es extensión de esta spec. Coordina N hechos atómicos en UNA línea; cada hecho coordinado CONSERVA su `ref` y su sub-span (`hint`). NO SE ADMITE la fusión opaca que descarte tokens/refs por hecho. La coordinación de sujeto SOLO SE EMITE cuando el canon define el plural concordado.
- Producciones derivables sin soporte en el canon (GAP-DONDE-EXPRESION, GAP-RANGO-TEXTUAL, GAP-DESPLIEGUE-DEDICADO, GAP-RECOMPONE, GAP-PLIEGA): el parser DEBE declarar su subconjunto soportado; lo demás ⇒ `unsupported-canonical`.

### 4.9 Roundtrip, bisimetría e invariantes

Tabla de bisimetría canónica (reglas §9.2, textual) — **gate mínimo** (R-BI-TAB-1: «toda construcción visual listada DEBE emitirse con la plantilla indicada y toda plantilla indicada DEBE reconstruir el mismo hecho nuclear»):

| Construcción visual | Plantilla OPL canónica |
|---|---|
| Rectángulo con sombra | **Cosa** es física. |
| Rectángulo sin sombra (default) | (default — no se emite oración salvo si se quiere explicitar) |
| Rectángulo punteado | **Cosa** es ambiental. |
| Elipse con sombra | *Cosa* es física. |
| Estado dentro de objeto | **Objeto** puede estar `estado1`, `estado2` o `estado3`. |
| Estado con borde grueso | Estado `s` de **Objeto** es inicial. |
| Estado con doble borde | Estado `s` de **Objeto** es final. |
| Estado con flecha diagonal | Estado `s` de **Objeto** es por defecto. |
| Estado con borde grueso + doble borde simultáneo | Estado `s` de **Objeto** es inicial y final. |
| Flecha objeto→proceso con punta cerrada | *Proceso* consume **Objeto**. (T1) |
| Flecha proceso→objeto con punta cerrada | *Proceso* genera **Objeto**. (T2) |
| Flecha bidireccional con puntas cerradas | *Proceso* afecta **Objeto**. (T3) |
| Flecha desde estado origen + flecha hacia estado destino | *Proceso* cambia **Objeto** de `entrada` a `salida`. (TS3) |
| Línea con piruleta negra (lollipop) en proceso | **Agente** maneja *Proceso*. (H1) |
| Línea con piruleta blanca en proceso | *Proceso* requiere **Instrumento**. (H2) |
| Anotación `e` sobre consumo | **Objeto** inicia *Proceso*, que consume **Objeto**. (ET1) |
| Anotación `c` sobre consumo | *Proceso* ocurre si **Objeto** existe, en cuyo caso **Objeto** se consume, de lo contrario *Proceso* se omite. (CT1) |
| Rayo proceso→proceso | *Invocador* invoca *Invocado*. (IV1) |
| Triángulo lleno con vértice al todo | **Todo** consta de **Parte1**, **Parte2** y **Parte3**. (RF1) |
| Triángulo con triángulo interior, vértice al exhibidor | **Exhibidor** exhibe **Atributo1** y **Atributo2**. (RF2) |
| Triángulo vacío, vértice al general | **Especialización1** y **Especialización2** son **General**. (RF3) |
| Triángulo con círculo interior, vértice a la clase | **Instancia** es una instancia de **Clase**. (RF4) |
| Proceso inflado con subprocesos verticales | *Proceso* se descompone en *P1* y *P2*, en esa secuencia. (CX1) |
| Arco discontinuo simple sobre fan | exactamente uno de … (XOR) |
| Arco doble sobre fan | al menos uno de … (OR) |
| Marca `/` sobre enlace de excepción | *Manejo* ocurre si duración de *Fuente* excede máx-duración. (EX1) |

Reglas de roundtrip:

| ID | Regla | Oblig. |
|---|---|---|
| R-BI-DUAL-1 | Cada OPD tiene su párrafo OPL; toda afirmación gráfica DEBE ser reproducible como OPL y toda oración OPL DEBE ser representable como constructo OPD. | DEBE |
| R-BI-0/0A/0B/1, R-ESC-OP-1/2 | Edición OPD válida ⇒ modifica el hecho y regenera OPL; edición OPL válida ⇒ modifica el hecho y regenera OPD; nunca divergencia silenciosa. | DEBE |
| R-BI-2, R-OPD-BIM-2 | Una oración sin firma OPD canónica se rechaza o se clasifica no soportada; NO DEBE crearse un grafo plausible. | DEBE / NO DEBE |
| R-BI-4 | El roundtrip preserva el **hecho**, no la superficie literal. | DEBE |
| R-§19-SIM-1 | Para todo modelo válido, `parsear(generar(m))` sin diagnósticos `error`. | DEBE |
| R-§19-SIM-2 | Reverse total solo sobre el subconjunto soportado; lo reconocible no aplicable ⇒ `unsupported-canonical` (warning), sin mutar (DR-34). | DEBE / NO DEBE |
| R-§19-SIM-3 | Fixture estricto: `generar(m) == generar(aplicar(parsear(generar(m))))` línea a línea, desde modelo vacío. | EXIGE |
| R-§19-ROT-1 | Toda bisimetría parcial DEBE declararse y su fixture marcarse no estricto. | DEBE |
| R-§19-DISP-1/2 | Líneas solo-display no producen patches; la frontera display/parseable es explícita en el clasificador. | NO DEBE / DEBE |
| R-§19-LENS-1 | La ausencia de una línea NO DEBE borrar el hecho: `no-delete-by-absence` (info). «El borrado es una acción explícita, nunca inferida por sustracción de prosa.» | NO DEBE |
| R-§19-LENS-2 | El preview NO DEBE mutar el modelo; solo cambia al aplicar. | NO DEBE |
| R-§19-LENS-3 | `exportarModelo(aplicar(modelo, patchesVacíos)) == exportarModelo(modelo)`. | DEBE |
| R-§19-COMP-1/2, R-COMP-REV-1/2 | «componer → parsear = identidad sobre el conjunto de hechos»: `parsear(componer(F)) = F`. | DEBE |
| §19.5 | Reordenar líneas equivalentes: tolerado (el texto es un conjunto de hechos; el generador reimpone el orden canónico). Variantes normalizables: toleradas. | inf. |
| R-OPD-BIM-3 | Canales semánticos (su cambio cambia hecho y OPL): forma, contorno, sombra física, marcador de extremo, topología del triángulo, anclaje a estado, dirección, designaciones, verticalidad de subprocesos. Ornamentales (no emiten OPL): grid, handles, sombras decorativas, notas, identificadores, `SDx.y`, posición no temporal, estilado. | DEBE |
| R-OPD-BIM-5 | Equivalencias que el resaltado cruzado DEBE respetar: resultado simple ≡ fan XOR por estados; bidireccional con etiquetas idénticas ≡ recíproco; todos-los-estados ≡ estados-suprimidos (mismo hecho, distinta vista). | DEBE |

Brechas de bisimetría declaradas por el producto (R-§19-ROT-1): (1) procedencia de escisión no viaja por OPL (se conserva en el JSON y al reparsear sobre el modelo existente, R-IMPORT-8); (2) borrado solo por OPD/inspector (OPL aditivo); (3) posiciones/tamaños solo en JSON.

### 4.10 Parseo (importación y edición OPL)

| ID | Regla | Oblig. |
|---|---|---|
| R-IMPORT-1 | Toda importación OPL DEBE parsearse contra la gramática antes de tocar el modelo (parse completo → aplicación). | DEBE |
| R-IMPORT-2 | Cada nombre se resuelve a una cosa existente, o crea una nueva solo si la tipografía la desambigua (**negrita** objeto, *cursiva* proceso, `mono` estado). | DEBE |
| R-IMPORT-3 | Estado inexistente: PUEDE crearse si el objeto dueño está inequívocamente identificado (producto: se crea). | PUEDE |
| R-IMPORT-4 | Firma contradictoria con tipos existentes ⇒ rechazar. | DEBE |
| R-IMPORT-5 | Canónica no soportada ⇒ `unsupported-canonical`; NO degradar. | DEBE / NO DEBE |
| R-IMPORT-6 | No canonizada ⇒ `non-canonical`; NO convertir en extensión silenciosa. | DEBE / NO DEBE |
| R-IMPORT-7 | Cambio de tipo ontológico de una cosa existente ⇒ bloquear y pedir decisión (renombrar, crear cosa nueva o corregir OPL). | DEBE |
| R-IMPORT-8 | Preservar metadato de layout/vista/estilo no expresable en OPL. | DEBE |
| R-CONF-6 | OPL fuera de la EBNF se clasifica legacy/extensión/error; NUNCA se presenta como OPL-ES canónico. | DEBE / NO DEBE |
| R-OPL-COND-ALT-1 | Aceptar la variante `Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*.` | DEBE |
| spec-OPL §2.0 | Aceptar D1–D4 atómicas y la clasificación combinada R-ENT-3. | DEBE |
| R-OPL-9 | Aceptar el sufijo ` proceso` en identificadores de proceso. | PUEDE |
| R-§18-NORM-1, R-MULT-3 | Normalizar (Unicode → ASCII en operadores y delimitadores; espacios); preservar acentos, `ñ`, `ü` en nombres. | DEBE |
| R-OPL-KW-2 | Aceptar `y/e` y `o/u` indistintamente. | inf. |
| spec-OPL §3.5 | TS4/TS5 parseados son siempre standalone (nunca fragmento escindido). | DEBE |
| spec-OPL §3.4 | TS3 sobre modelo vacío crea objeto y estados faltantes. | inf. |
| R-FAN-5B | Fan TS3 con entrada común ⇒ un TS3 por salida + un único abanico; roundtrip por igualdad de fact-set. | DEBE |
| spec-OPL §7.1 + R-BI-DUAL-1 | `*P* se descompone en …` ⇒ crea/confirma la descomposición, crea los subprocesos inexistentes en el OPD hijo, fija las bandas; un miembro existente que no es subproceso de P ⇒ rechazo `referencia-ambigua` (DR-35). | DEBE |

Método de parseo recomendado (el más simple conforme, DR-1): (1) normalizar; (2) tokenizar la línea en spans tipográficos (**objeto**, *proceso*, `estado`) y texto; (3) sustituir spans por huecos tipados y buscar el **esqueleto** en la tabla de plantillas de §4.4 (lista blanca); listas por patrón `{X}(, {X})* (y|e|o|u) {X}`; (4) enlazar huecos a entidades por nombre (crear según R-IMPORT-2/3); (5) validar con la matriz §2 (el mismo validador que el canvas); (6) producir patches. Una línea `**A** <frase en minúscula> **B**.` (u homóloga con *procesos*) que no calza con ningún esqueleto reservado es SE1 con esa etiqueta (DR-36).

### 4.11 Estructura de la línea OPL (panel e interacción)

```ts
type RefOpl = { tipo: 'entidad' | 'enlace' | 'estado' | 'opd'; id: Id };
interface TokenOpl {
  texto: string;
  rol: 'texto' | 'nombre' | 'verbo' | 'estado';
  ref?: RefOpl;
  hechoId?: Id;          // enlace al que pertenece el sub-span (R-OPL-INT-6, R-COMP-MAESTRA-3)
}
interface LineaOpl {
  texto: string;         // forma canónica Markdown (la que se exporta y se parsea)
  tokens: TokenOpl[];
  refs: RefOpl[];        // únicas por tipo:id, orden de primera aparición (R-OPL-INT-2)
  opdId: Id; opdEtiqueta: string; opdProfundidad: number;   // R-OPL-PANEL-2
  soloDisplay?: boolean; // rótulos, numeración (R-§19-DISP-1)
}
```

---

## 5. OPD: realización visual e interacción

Norma de lectura (spec-OPD §18, textual): «la **estructura** de cada marca (forma, topología, conteo de trazos, dirección) es normativa; los valores cromáticos son tokens informativos (R-OPD-COSA-5) y los píxeles son la realización vigente (cambiables si preservan la distinción a cualquier zoom)».

### 5.1 Regla rectora

- R-OPD-CAN-1..3, R-VIS-EXP-1..4, R-§23-OPD-EXPORT: es gramática lo que persiste en un export canónico declarado; lo visible solo en el canvas editable es UI transitoria y NO DEBE reutilizar canales reservados (formas, contornos, sombra, dash de afiliación, contorno grueso, piruletas, triángulos, arcos, marcas de estado, de simulación, de validación). Todo elemento persistente en `canon-diagrama` DEBE estar cubierto por una regla visual.
- R-OPD-CAN-5: el canvas DEBE distinguir al menos cinco modos: estático-exportable, edición, navegación, gestión-modal, runtime; solo el estático fundamenta conformidad (runtime: vacío sin simulación, declarado en el registro).
- R-OPD-CAN-4 / R-VIS-EXP-6: una captura de edición/navegación/modal no es evidencia de canonicidad.

### 5.2 Cosas: las ocho representaciones (reglas §3.2, textual)

| # | Forma | Contorno | Profundidad | Cosa |
|---|---|---|---|---|
| 1 | Rect | sólido | sombreado | Objeto físico sistémico |
| 2 | Rect | sólido | plano | Objeto informacional sistémico (default) |
| 3 | Rect | discontinuo | sombreado | Objeto físico ambiental |
| 4 | Rect | discontinuo | plano | Objeto informacional ambiental |
| 5 | Elipse | sólido | sombreado | Proceso físico sistémico |
| 6 | Elipse | sólido | plano | Proceso informacional sistémico (default) |
| 7 | Elipse | discontinuo | sombreado | Proceso físico ambiental |
| 8 | Elipse | discontinuo | plano | Proceso informacional ambiental |

| ID | Regla | Oblig. |
|---|---|---|
| R-SOMB-1/3, R-OPD-COSA-3, AP-19 | Sombra (abajo-derecha) ⟺ física; toda sombra decorativa suprimida en canon; reforzadores de canvas no persisten. | DEBE |
| R-CTRN-2, R-OPD-REF-1 | Contorno **grueso** = cosa refinada en otro OPD (en padre y en hijo); despliegue intradiagrama NO. | DEBE / NO DEBE |
| R-COLOR-1/2/3, R-OPD-COSA-5, R-§23-OPD-TOPO | Color informativo; semántica por forma, contorno, sombra y topología (legible en escala de grises). | DEBE |
| R-ROT-1/2/3, R-OPD-COSA-6, R-OPD-ROT-1, AP-23 | Rótulo íntegro, centrado, multilínea, inscrito en el bbox; autosize EXPANDE la forma; NO elipsis ni corte; rótulos en **negro** en canon. | DEBE / NO DEBE |
| R-OPD-COSA-7, AP-12 | Nunca estados dentro de una elipse. | NO DEBE |
| R-OPD-COSA-8 | Cosas de igual clase comparten base cromática y tipográfica. | DEBE |
| R-OPD-ROT-4, R-INS-3, spec-OPL §2.6 | Instancia lógica rotulada `NombreInstancia : NombreClase` («el nombre de una instancia lógica DEBE escribirse `NombreInstancia : NombreClase`», spec-OPL §2.6); producto: rótulo derivado del enlace de clasificación, no parte del nombre léxico (DR-8). | DEBE |
| R-OPD-ROT-7 | Notas (si existen): meta, sin OPL, excluidas de `canon-diagrama`. | inf. DEBE |

### 5.3 Estados

| Designación | Marca canónica | Cardinalidad |
|---|---|---|
| Inicial | borde grueso | 0..* |
| Final | doble borde | 0..* |
| Por defecto | flecha diagonal abierta apuntando al estado | 0..1 |
| `Current` declarado | glifo externo reservado (pin) | 0..1 |
| Normal | borde estándar | — |

- R-OPD-EST-1: rountangle SIEMPRE dentro del objeto, región inferior.
- R-OPD-EST-5: inicial + final = borde grueso + doble borde.
- R-OPD-EST-7: por defecto = flecha diagonal abierta **entrante** (`↗` es aproximación no conforme).
- R-OPD-EST-6 / R-EST-4: `Current` declarado ≠ marca de runtime (pin externo; el canon lo exige, DR-37).
- R-OPD-EST-9, reglas §3.10: con estados ocultos, chip `⋯N` (rountangle pequeño con elipsis y conteo) en la esquina inferior derecha; persiste en `canon-diagrama` (DR-15). OPL: D6.
- R-OPD-EST-4, R-VIS-EST-2: valores de atributo se dibujan como estados del objeto-atributo.

### 5.4 Enlaces: decoraciones y marcas

Decoraciones de extremo (reglas §3.7, textual):

| Decoración | Nombre | Uso |
|---|---|---|
| Punta cerrada (arrowhead) | punta cerrada | Enlaces transformadores |
| Círculo negro relleno | piruleta negra (black lollipop) | Enlace de agente (extremo proceso) |
| Círculo blanco vacío | piruleta blanca (white lollipop) | Enlace de instrumento (extremo proceso) |
| Línea en zigzag + punta | rayo (lightning bolt) | Enlace de invocación |
| Punta abierta | open arrowhead | Estructural etiquetado unidireccional |
| Arpón (media punta) | harpoon | Estructural etiquetado bidireccional/recíproco |

Transformadores (spec-OPD §4.1): consumo = punta cerrada EN el proceso; resultado = punta cerrada EN el objeto; efecto = punta cerrada en AMBOS extremos; TS4/TS5 = una punta (hacia el proceso / hacia el estado destino). «El anclaje es portador del hecho» (R-OPD-TR-6); invertir el extremo cambia el hecho (R-OPD-TR-2).

Triángulos (reglas §3.8, textual):

| Topología interna del triángulo | Relación |
|---|---|
| Interior completamente relleno | Agregación-participación |
| Triángulo interior distinguible | Exhibición-caracterización |
| Vacío (sin interior distinguible) | Generalización-especialización |
| Círculo interior distinguible | Clasificación-instanciación |

R-TRI-1/1A/2/2A/3, R-VIS-TRI-1, AP-20: vértice al refinable, base a refinadores, conectado por línea visible al refinable y a ≥1 refinador; colapsar la topología = no conforme. Con ≥2 ramas del mismo refinable y relación se comparte un triángulo (realización informativa).

Marcas textuales (reglas §3.9, textual; R-MARCA-1: DEBEN limitarse a esta tabla):

| Marca | Significado |
|---|---|
| `e` | Modificador de evento (objeto inicia el proceso) |
| `c` | Modificador de condición (proceso se omite si la precondición falla) |
| `/` | Excepción por sobretiempo |
| `//` | Excepción por subtiempo |
| `Pr=p` | Probabilidad del enlace en abanico probabilístico |
| Texto itálico sobre el eje | Etiqueta de enlace estructural |
| Texto sobre enlace procedimental | Etiqueta de ruta (path label) |

- R-OPD-CTL-2: `e`/`c` en minúscula sobre la línea cerca del extremo proceso.
- spec-OPD §6.2: `/` = una barra corta inclinada cruzando el enlace, cerca del manejador; `//` = par de barras paralelas (DR-38: sin punta adicional).
- Indicadores auxiliares (reglas §3.10, textual): colección incompleta = barra horizontal corta bajo el triángulo; supresión de estados = rountangle con `...` en esquina inferior derecha; multiplicidad = número/expresión junto al extremo (R-VIS-MULT-1, R-OPD-MUL-1); cosa duplicada = silueta desplazada (no se ofrece); supresor de enlaces `...` (no se ofrece).
- Abanicos (reglas §7.1, textual): AND = «enlaces separados, sin arco»; XOR = «arco discontinuo simple sobre el fan, en el extremo convergente»; OR = «dos arcos discontinuos concéntricos sobre el fan». «Extremo convergente» se lee como **extremo común** (definición de abanico de spec-OPD y R-OPD-CTL-7; DR-9).
- Duración (R-OPD-INV-6): dentro de la elipse, bajo el nombre: `[unidad] {min, esperada, max} {distribución, parámetros}`; sin distribución NO se emite placeholder (DR-18).
- Anidamiento (reglas §3.11, textual): objeto contiene estados, partes si está descompuesto, rasgos (semi-plegado); proceso inflado contiene subprocesos y objetos internos; estado no contiene NADA.

### 5.5 Catálogo formal (spec-OPD §18, copia literal)

§18.1 Paleta (tokens informativos):

| Token | Hex | Uso |
| --- | --- | --- |
| paper | `#fafaf8` | fondo, fill de markers huecos |
| paperWarm | `#eeece2` | resaltado bimodal entrante |
| ink | `#171511` | enlaces, markers, texto |
| inkMid / inkSoft | `#5a564c` / `#807b6e` | etiquetas secundarias / identificadores |
| opmObjeto | `#27613f` | stroke de objeto |
| opmProceso | `#1d3f78` | stroke de proceso |
| opmEstado / estadoFill / estadoFinalFill | `#68711f` / `#dedacb` / `#d6d2c6` | estado |
| crimson / crimsonSuave | `#8e2a2e` / `rgba(142,42,46,0.06)` | canal UI reservado (selección, foco); la simulación comparte el hue con separación por dash/glifo/z (§20, R-§23-OPD-CANAL) |
| legacy OPCloud | `#70E483 #3BC3FF #586D8C #fdffff` | solo compat de apariencias antiguas (GOVERNANCE §4, excepción aliases legacy); prohibido en superficies nuevas |

§18.2 Trazos, dashes y radios:

| Magnitud | Valor | Significado |
| --- | --- | --- |
| stroke entidad / estado / enlace / estructural | 1.5 / 1.2 / 1 / 1.2 | base |
| stroke estado inicial | 3 | designación inicial |
| estado final | doble contorno (fill + rect interno stroke 1, padding 3) | designación final |
| stroke cosa refinada | 4 | contorno grueso de refinamiento |
| arco de abanico | 1.5, dash `4 1` | XOR=1 arco r30; OR=2 arcos r30/35 |
| afiliación ambiental | dash `8 4` | contorno discontinuo |
| proxy de extracción | dash `5 4` | enlace de vista inter-OPD |
| simulación: proceso activo / involucrada / estado current / estado resultado / enlace activo | dash `6 3` sw3 / `4 3` sw2 / `4 2` sw2 / `7 3` sw2 / `7 4` linecap round | canal runtime (crimson; resultado en color de objeto). *Enmienda 2026-06-11 (V-7): valores reconciliados con la realización vigente (`composers/halos.ts`, `composers/enlace.ts`).* |
| radio estado / badge control / chip `⋯N` | 8 / 9 (círculo 18×18) / alto÷2 | rountangle / letra `c·e·¬` / supresión |
| sombra física | dropShadow dx6 dy6 blur2 `rgba(23,21,17,0.68)` | esencia física |
| hit-area de enlace | wrapper transparente 15 px | interacción |

§18.3 Marcadores (paths literales):

| Marcador | Geometría | Relleno |
| --- | --- | --- |
| Punta transformadora (consumo/resultado/efecto; terminal del rayo de invocación) | `M 0 0 L 23 8 L 12 0 L 23 -8 Z` (swallowtail, bbox 23×16) | paper, stroke ink |
| Piruleta agente / instrumento | `M0,0 L7,0 M12,0 m-5,0 a5,5 0 1,0 10,0 a5,5 0 1,0 -10,0` (palito 7 + círculo r5) | ink / paper |
| Triángulo estructural | `standard.Polygon` 30×30, refPoints `15,0 30,30 0,30` | agregación: ink; generalización: paper; exhibición: + triángulo interior 12×12 ink en (+9,+12); clasificación: + círculo r4 ink en (15,20) |
| Tagged unidireccional / bidireccional | polyline `0,0 20,-10 0,0 20,10` / arpón `0.5,0 20,±10` | abierto |
| Sobretiempo / subtiempo | polyline `4,10 13,-10` / `4,10 13,-10 8.5,0 17,0 13,10 22,-10` | trazo ink |
| Rayo de invocación | 4 vértices, offset perpendicular `min(22, max(12, len·0.08))`; autoinvocación: lazo a ±35°, pico `max(56, h·0.55)` | — |
| Glifos de estado | inicial: stroke 3 · final: doble contorno · default: flecha abierta entrante (vigente `↗`, GAP-OPD-DEFAULT-GLIFO) · current **declarado**: `●` interno en la cápsula (vigente; canon = glifo externo reservado pin, GAP-OPD-CURRENT-GLIFO; la marca de runtime NO es glifo: es anillo del canal de simulación, §18.2 y R-OPD-SIM-2) | — |

§18.4 Z-order y tipografía:

| Capa | z | Texto | Valor |
| --- | --- | --- | --- |
| contorno de refinamiento / proxy | 0 | rótulo de cosa | Inria Serif 17, proceso itálica |
| autoinvocación / enlace / bus | 1 / 4 / 4 | etiqueta de estado | serif itálica 13 |
| overlay abanico | 5 | etiquetas de enlace (verbo, multiplicidad, ruta, demora) | serif 11-12, ink/inkMid |
| entidad / triángulo / ramas | 10 / 12 / 13 | identificador `o.NN` | JetBrains Mono 9.5 (UI) |
| enlace a estado | 20 | badge control | serif 12 |
| halo selección / halos sim / halo selección de estado (UI) | 30 / 33-36 / 37 | wrap | >18 chars envuelve a ~132 px, sin elipsis |

Informativo, no obliga (§0.4): hex, px, fuentes concretas, radios r30/35, offsets, 135×60, paleta legacy, filas de simulación, `standard.Polygon`. Obliga: la estructura (conteo de arcos, relleno/vacío, interior triangular/circular, punta cerrada vs abierta vs arpón, dash vs continuo, doble borde, trazo grueso) y la separación de canales (R-§23-OPD-CANAL).

### 5.6 Layout y routing

| ID | Regla | Oblig. |
|---|---|---|
| R-OPD-LAY-1, R-LAY-2 | Sin oclusión entre cosas; enlaces no atraviesan cosas; minimizar cruces; si un re-ruteo sin cambio semántico eliminaría cruces, el export DEBE aplicarlo **o reportar advertencia** (producto: advertir). | DEBE |
| R-OPD-LAY-2, R-LAY-1 | Advertir entre 21 y 25 cosas por OPD; BLOQUEAR el export canónico con >25 (salvo vista tipificada o refinamiento declarado). Por OPD lógico. | DEBE |
| R-OPD-LAY-3, R-LAY-3 | Grid = decoración opcional de edición; suprimida en export; snap transparente; smart-guides en canal UI. | DEBE / NO DEBE |
| R-OPD-LAY-4 | Procedimentales rectos; estructurales fundamentales ortogonales (manhattan, sin diagonales); invocación y abanicos con vértices explícitos. | inf. |
| R-OPD-LAY-5 | Extremo al centro de la cosa con recorte en el perímetro real (intersección exacta con la elipse); enlaces nunca sueltos. | inf. DEBE |
| R-OPD-LAY-8, R-VIS-EXPORT-1D, R-VIS-LAYOUT-1 | Export auto-ajusta el viewport sin recortar símbolos, rótulos ni decoraciones. | DEBE |
| R-OPD-LAY-9 | Por defecto: objeto arriba / proceso abajo en transformadores; todo arriba / partes abajo en estructurales (triángulo al centro). | DEBERÍA |
| R-OPD-LAY-10 | Al cambiar de OPD, la vista DEBE centrar el bbox real del contenido. | DEBE |
| R-LAY-4, R-§23-OPD-TIEMPO | Todo layout preserva la semántica temporal vertical (bandas). | DEBE |
| R-ANID-1 | Al descomponer, el contenedor se agranda para contener a sus refinadores. | DEBE |

### 5.7 Canal UI, interacción y edición visual

| ID | Regla | Oblig. |
|---|---|---|
| R-OPD-UI-1, R-DEC-2/2A, AP-24 | Handles, halos, anclas, marquee, menús, toasts, ghosts, smart-guides, búsqueda = UI transitoria en canal reservado (crimson `#8e2a2e` + grises); crimson PROHIBIDO como marca semántica; handles no idénticos a piruletas. | DEBE / PROHIBIDO / NO DEBE |
| R-OPD-UI-2 | La selección NO redibuja el borde semántico (subrayado/halo en canal UI). | inf. NO DEBE |
| R-OPD-UI-3 | Afordances de manipulación en canal UI, no persisten; drag de subproceso confinado al contenedor. | DEBE |
| R-OPD-UI-5 | Feedback de destinos válidos/inválidos del modo enlace en canal UI. | DEBE |
| R-OPD-VAL-1, R-VIS-VAL-1 | Canvas limpio: validación en panel de diagnóstico, sin marcas persistentes en el OPD estático («por defecto el OPD estático DEBE quedar limpio de validación persistente», R-VIS-VAL-1). | DEBE |
| R-OPD-VAL-3 | Durante arrastre, un enlace inválido PUEDE mostrar marca transitoria (p. ej. `×`), fuera de canon, sin reutilizar canales semánticos. | PUEDE / NO |
| R-OPD-INT-1/3, R-OPL-INT-3 | Hover bidireccional OPD↔OPL por **referencia tipada** (nunca por coincidencia textual); resaltado entrante con `paperWarm`; el color no es vehículo del cruce modal. | DEBE / NUNCA |
| R-OPD-INT-2, R-OPL-INT-4/5 | Clic en token OPL navega/enfoca sin mutar; la selección en canvas filtra el panel (selección de enlace precede a la de entidad). | DEBE / NO DEBE |
| R-OPD-EDIT-1 | Validar firma antes de crear; ofrecer solo enlaces legales para el par. | DEBE |
| R-OPD-EDIT-2, R-EDIT-3/6/7 | Cambios de contorno, sombra, forma, marcador, triángulo o estado cambian el hecho y su OPL; estilo no. Cambiar el tipo de cosa recalcula perseverancia y revisa enlaces afectados. | DEBE |
| R-OPD-EDIT-3, R-EDIT-4 | Mover una cosa entre OPDs preserva identidad y solo cambia apariencias. | DEBE |
| R-OPD-EDIT-4, R-EDIT-8 | Combinación prohibida ⇒ bloquear antes de persistir; edición ambigua ⇒ bloquear hasta resolver. | DEBE |
| R-OPD-EDIT-5 | Al insertar subprocesos, migración automática (§3.2); el modelador reasigna. | inf. DEBE |
| R-OPD-EDIT-6 | Rastrear refinadores y ajustar símbolo (colección incompleta, contorno grueso) y OPL al cambiar la colección. | DEBE |
| R-OPD-EDIT-7 | Permitir reanclar los extremos de un **enlace estructural fundamental** (compuesto triangular). Para otros tipos el canon no lo exige (reanclar = borrar + crear es conforme). | DEBE |
| R-VIS-APP-1 | Separar «quitar de este OPD» (apariencia) de «eliminar del modelo» (cosa). | NO DEBE (eliminar apariencia ≠ cosa) |
| método §9.15 | Traer una cosa existente a otro OPD = nueva apariencia de la misma entidad. | invariante |
| R-OPD-CFG-1/2 | Ninguna opción de presentación altera el hecho; toggles de vista admitidos (supresión de estados global+local; el OPL local refleja la vista). | DEBE / PUEDE |

Operaciones mínimas del canvas que el canon presupone (★): crear objeto/proceso con nombre; renombrar; fijar esencia y afiliación; agregar/renombrar/reordenar/eliminar estados y designaciones; suprimir/expresar estados por OPD y global; crear enlace (menú filtrado) y fijar control, etiqueta(s), ruta, multiplicidad; formar/deshacer abanico XOR/OR; marcar colección incompleta; descomponer (in-zoom) y desplegar (unfold, eligiendo modo); reordenar subprocesos en bandas; eliminar refinamiento; navegar el árbol OPD; quitar apariencia vs eliminar del modelo; traer cosa existente; reanclar extremos de estructurales fundamentales; fijar duración (min/esperada/máx/unidad) de un proceso; mover/redimensionar; exportar.

---

## 6. Edición, importación y bloqueo; fallos y diagnóstico

### 6.1 Escenarios OPD↔OPL (reglas §10)

| ID | Regla | Oblig. |
|---|---|---|
| R-ESC-OP-1/2 | Toda edición válida (OPD u OPL) se proyecta a la otra modalidad o a metadato tipificado. | DEBE |
| R-ESC-OP-3 | Edición ambigua ⇒ bloquear hasta resolver identidad, firma o alcance. | DEBE |
| R-ESC-OP-4, R-AP-0 | Edición prohibida ⇒ rechazar o persistir solo como error estructural recuperable; nunca como canónica. | DEBE / NO DEBE |
| R-APP-4 | Si la UI permitiera algo no canónico: restringir por defecto, bloquear persistencia canónica o marcar error recuperable. | DEBE |
| R-EDIT-5 | Crear vistas no crea hechos nuevos (sin vistas en producto). | NO DEBE |
| método A8.1 «Bimodalidad activa» | Tras cada edición gráfica, el OPL actualizado es visible (idealmente la oración del cambio). | inf. DEBE |

### 6.2 Editor OPL (spec-OPL §15)

Clasificación por línea (R-OPL-EDIT-1, DEBE; precedencia: vacía → aplicable → error → sin-cambio):

| Estado | Condición canónica | Acción |
| --- | --- | --- |
| `ignorada-vacia` | la línea es solo whitespace tras `trim` | se descarta; NO produce patch ni diagnóstico |
| `aplicable` | la línea tiene ≥1 patch propuesto | se ofrece para aplicar; `cambioId` apunta al primer patch; `descripcionCambio` lo resume |
| `no-aplicable` | sin patches y con diagnóstico `severidad=error` | se bloquea con una `RazonNoAplicable` canónica |
| `sin-cambio` | sin patches y sin error (parseada, consistente con el modelo, o warning/info) | se reconoce pero NO muta |

R-OPL-EDIT-2 (DEBE): resumen estable (`total`, `aplicables`, `noAplicables`, `ignoradas`, `sinCambio`); botón `Aplicar N cambio(s)` si `aplicables>0`, `Sin cambios aplicables` si no.

Razones (R-OPL-EDIT-3, enum cerrado; NO DEBE crecer sin canonizar):

| `RazonNoAplicable` | Texto visible | Diagnóstico origen |
| --- | --- | --- |
| `forma-no-reconocida` | Forma OPL no reconocida | `syntax-error` (sin marca de punto), default |
| `entidad-no-existe` | La entidad referida no existe en el modelo | `unknown-symbol` |
| `referencia-ambigua` | Más de una entidad con ese nombre | `ambiguous-symbol` |
| `enlace-invalido-firma` | Firma de enlace inválida | `type-mismatch` |
| `conflicto-patches` | Cambios incompatibles sobre el mismo hecho | `patch-conflict` |
| `inversa-no-soportada` | Edición inversa no soportada / las líneas ausentes no borran hechos | `unsupported-canonical` (≡ `unsupported-kernel`, DR-34), `no-delete-by-absence` |
| `puntuacion-faltante` | La oración OPL-ES debe terminar en punto | `syntax-error` con mensaje de punto |
| `cambio-ya-presente` | Este cambio ya está aplicado al modelo | (línea consistente sin patch ⇒ `sin-cambio`) |

Mapeo a mutaciones (R-OPL-EDIT-5, DEBE; tres fases ordenadas: (1) no-enlace, (2) enlace, (3) abanicos):

| Patch | Operación de modelo | Descripción |
| --- | --- | --- |
| `crear-entidad` | crear objeto/proceso (+ esencia/afiliación si se declaró) | `crear <tipo> <nombre>` |
| `renombrar-entidad` | renombrar | `renombrar A -> B` |
| `cambiar-esencia` | cambiar esencia | `esencia A -> B` |
| `cambiar-afiliacion` | cambiar afiliación | `afiliacion A -> B` |
| `sincronizar-estados` | crear/renombrar estados | `sincronizar estados (...)` |
| `renombrar-estado` | renombrar estado | `estado A -> B` |
| `aplicar-designacion-estado` | inicial/final/por defecto/Current | `designar estado X como D` |
| `crear-enlace` | crear enlace (+ control/tiempos) | `crear enlace <tipo>` |
| `fijar-etiqueta-enlace` | renombrar etiqueta | `etiqueta enlace -> X` |
| `crear-abanico` | formar abanico XOR/OR | `crear abanico <op> (N ramas)` |

Más (producto, DR-35): `crear-refinamiento` / `fijar-orden` para `se descompone en` y `se despliega en`.

| ID | Regla | Oblig. |
|---|---|---|
| R-OPL-EDIT-4, R-OPL-FALLO-8 | Una línea ausente NO borra un hecho (`no-delete-by-absence`, info). | NO DEBE |
| R-OPL-EDIT-6 | Creación de enlace idempotente: si existe la tripla (tipo, origen, destino) se reusa. | DEBE |
| R-OPL-EDIT-7 | Inline limitado a: `renombrar-entidad`, `renombrar-estado`, `fijar-etiqueta-enlace`, `abrir-inspector-enlace` (no muta); validar que el id exista; lo más rico va al editor libre o al inspector. | DEBE / NO DEBE |
| R-OPL-EDIT-8 | Etiqueta, control y tiempos solo por las operaciones validadas del kernel (una sola API de mutación para OPD y OPL). | DEBE / NO DEBE |
| R-OPL-EDIT-9 | Editar una oración compuesta (listas) = mutación por hecho: solo mutan los hechos cuyos sub-spans cambiaron. | DEBE |

### 6.3 Modos de fallo (spec-OPL §17)

| ID | Regla | Oblig. |
|---|---|---|
| R-OPL-FALLO-1 | Diagnósticos tipados `{codigo, severidad: error\|warning\|info, linea}`; solo `error` bloquea la línea. | DEBE / NO DEBE |
| R-OPL-FALLO-2 | Aplicación fail-fast: ante el primer fallo se aborta sin aplicar posteriores (producto: todo-o-nada sobre copia del modelo, DR-39). | DEBE |
| R-OPL-FALLO-3 | Forma no reconocida ⇒ `forma-no-reconocida`; sin punto ⇒ `puntuacion-faltante`. | DEBE |
| R-OPL-FALLO-4 | Nombre que calza con >1 entidad ⇒ `referencia-ambigua`, se rechaza (con nombres únicos no ocurre, DR-22). | DEBE / NO DEBE |
| R-OPL-FALLO-5 | Entidad inexistente ⇒ `entidad-no-existe`; firma inválida ⇒ `enlace-invalido-firma`. | DEBE |
| R-OPL-FALLO-6 | Patches incompatibles sobre el mismo hecho ⇒ `conflicto-patches`, se rechazan. | DEBE |
| R-OPL-FALLO-7 | Partial-parse: un documento con líneas mezcladas NO se bloquea en bloque. | DEBE / NO DEBE |

### 6.4 Validación y diagnóstico del modelo

- R-CONF-3/5: validador integrado que cubre firma, clases, aciclicidad, refinamiento, contexto y consistencia OPD↔OPL (sin eso, conformidad «parcial»).
- Diagnóstico (DR-40) = `{codigo, regla, severidad: error|warning|info, familia: gramatical|metodologica|identidad|contencion|sugerencia, mensaje, accionCanonica, refs}`:
  - R-OPD-VAL-2: cinco familias distinguibles; metodológicas y sugerencias son vistas derivadas.
  - Método A8.1 tripartito: error = CRÍTICA (bloquea: firma, clases, aciclicidad, integridad OPD↔OPL); warning = ALTA/MEDIA (avanza declarando issue: claridad ≤20–25, completitud, bimodalidad, refinamiento motivado); info = BAJA (tipografía, posicionamiento, etiquetas).
  - R-AP-0B: todo diagnóstico de anti-patrón incluye su **acción canónica**; R-AP-0C: «Prohibido» ≠ «No canonizado».
- Método A8.2: barridos sobre el modelo, nunca sobre el OPL; advertir cosas sin apariencia (invisibles en OPL).

Advertencias exigidas (no bloquean):

| Código / regla | Condición | Oblig. |
|---|---|---|
| R-PROC-2, R-OPD-TR-8 | Proceso sin consumo/resultado/efecto (los habilitadores no cuentan; sí cuentan los transformadores heredados de su general, DR-43). | DEBE |
| método A3.1/A8.2 | Subproceso sin transformado. | inv. manual |
| R-REF-NTRIV-1/2, AP-13 | Refinamiento con <2 hijos (además bloquea export). | DEBE |
| R-LAY-1 | 21–25 cosas en un OPD. | DEBE |
| R-LAY-2 | Cruces u oclusión al exportar. | DEBE |
| R-SD-4, R-VIS-SD-1 | SD sin exactamente un proceso sistémico. | inf. DEBE |
| R-NOM-OBJ-1/2 | Objeto no singular / plural sin `Conjunto`/`Grupo`. | DEBE (heurístico) |
| R-NOM-PROC-1/2/3 | Proceso no deverbal; fuera de 2–4 palabras («DEBE emitir advertencia metodológica»); capitalización. | DEBE |
| R-NOM-EST-1 | Estado no en minúscula/forma pasiva o descriptiva (la minúscula inicial ya es léxica). | DEBE |
| R-OPL-SE-1 | Etiqueta estructural no es frase breve en minúscula. | DEBE |
| método A2.3 | Mezcla de infinitivo y nominalización en un mismo modelo (BAJA). | DEBERÍA |
| R-EXC-1A | Manejador de excepción no ambiental. | DEBE |
| R-OBJ-6/7, R-OPD-STR-13, R-VIS-HER-2 | Rasgo (atributo u operación) de cosa ambiental no ambiental; afiliación no heredada por la cadena estructural; proceso ejecutado por cosas ambientales no ambiental. | DEBE |
| AP-27 | Evento a subproceso no primero con previos omisibles. | DEBE advertirse |
| R-OPD-OP-6 | Refinador en más de un contexto. | DEBE |
| R-OPD-REF-5 | Intento de mover externo dentro del contenedor (rebote + aviso). | DEBE |
| LF-19 | Estado de objeto de flujo sin escritor (sin resultado/efecto que lo produzca), salvo: efecto o resultado sin estado sobre la entidad, glosa que empieza con `Coproducto XOR-n`, o entidad ambiental. NO DEBE bloquear. | DEBERÍA |
| AP-26 | Objeto con exactamente un resultado y un consumo y nada más (transiente). | DEBE reportarse |
| R-OPD-OP-5 | Ajuste automático de símbolo/OPL por cambio de la colección de refinadores (traza). | DEBE (si ajusta; severidad `info`) |
| AP-25, AP-22 | Proceso de soporte sin esfuerzo sostenido; sinónimos. | DEBE reportarse / método (no detectables mecánicamente; GAP-15) |
| AP-14 | Estados duplicados para separar inicio/fin. | **DEBE bloquearse** «como sinónimo falso»; no detectable mecánicamente (la sinonimia es juicio): se declara en el registro (R-CONF-7) y el producto facilita D10 |
| R-EXC-2/3 | Excepción cuya fuente no declara la cota exigida (`max`/`min`). | DEBE (canónico condicionado: pedir dato o advertir) |
| R-OPD-VAL-6 | Inconsistencias inter-OPD, generales redundantes junto a especializados. | DEBERÍA |

### 6.5 Anti-patrones (reglas §11.1) y consecuencia en producto

| # | Construcción no canónica | Regla de rechazo (canon) | Acción canónica | Producto |
|---|---|---|---|---|
| AP-01 | Resultado + `c` | DEBE bloquearse | Mover el control al lado de entrada | imposible (matriz §2) ★ |
| AP-02 | Resultado + `e` | DEBE bloquearse | Evento sobre consumo, efecto, agente o instrumento | imposible ★ |
| AP-03 | Abanico XOR/OR de resultado + `c`/`e` | DEBE bloquearse | Control al lado de entrada | imposible ★ |
| AP-04 | Resultado al estado inicial | DEBE bloquearse | Al rectángulo o a estado no inicial | impedir ★ |
| AP-05 | Agente a robot/software/IA/máquina | DEBE bloquearse | Instrumento | agente solo desde objeto físico + aviso (DR-5) ★ |
| AP-06 | Consumo/resultado en contorno de proceso descompuesto | DEBE bloquearse | Primer/último subproceso | migración automática; impedir anclaje ★ |
| AP-07 | TS3 sin escindir al descomponer | DEBE bloquearse | TS4 temprano + TS5 tardío | escisión automática ★ |
| AP-08 | Escindido + `c`/`e` | DEBE bloquearse (no aplica a ETS3/ETS4 standalone) | Control sobre el TS3 completo | impedir por `escision` ★ |
| AP-09 | `c`/`e` sobre estructural | DEBE bloquearse | — | imposible ★ |
| AP-10 | `c`/`e` sobre invocación | DEBE bloquearse | Nodo de decisión booleano, fan de invocación | imposible ★ |
| AP-11 | Bi/recíproco con estado solo en destino | DEBE bloquearse | Unidireccional o estado en origen | impedir |
| AP-12 | Estados de proceso | DEBE bloquearse | Subprocesos o atributo exhibido | imposible ★ |
| AP-13 | Refinamiento con 1 hijo | DEBE bloquearse en cierre/export; PUEDE persistir como placeholder | ≥2 hijos | advertir + bloquear export ★ |
| AP-14 | Duplicar estados para inicial+final | DEBE bloquearse como sinónimo falso | Estado único inicial y final | permitir D10; método |
| AP-15 | Instancia visual entre tipos distintos | DEBE bloquearse | Misma cosa o clasificación | imposible ★ |
| AP-16 | Refinamiento cíclico | DEBE bloquearse | Romper ciclo | impedir ★ |
| AP-17 | `SDx.y` como identificador externo | DEBE bloquearse | Id persistente | por modelo ★ |
| AP-18 | Modificar referencia externa en consumidor | DEBE bloquearse | — | no aplica (sin sub-modelos) |
| AP-19 | Sombra decorativa en informacional | DEBE suprimirse en canon | Sombra = física | por construcción del render ★ |
| AP-20 | Triángulo sin topología | DEBE bloquearse | Interior correcto | por construcción ★ |
| AP-21 | Evento sistémico cruza frontera | DEBE bloquearse | Mover dentro o reclasificar ambiental | migración/impedir ★ |
| AP-22 | Sinónimos múltiples | DEBE reportarse | Nombre canónico único | unicidad nominal + método |
| AP-23 | Truncamiento de rótulo | DEBE bloquearse | Ajustar bbox | autosize por construcción ★ |
| AP-24 | Canales semánticos para UI/validación | DEBE bloquearse | Canal UI reservado | por construcción ★ |
| AP-25 | Proceso de soporte sin esfuerzo sostenido | DEBE reportarse | Estructural etiquetado | método |
| AP-26 | Transiente creado y consumido sin observación | DEBE reportarse | Invocación | advertir (heurística) |
| AP-27 | Evento a subproceso intermedio | DEBE bloquearse / advertirse según previos | Primer subproceso o declarar omisión | impedir/advertir |
| AP-28 | `c` y `e` en el mismo enlace | No canonizado; NO DEBE emitirse | Control externo explícito | imposible ★ |
| AP-29 | Heredados dibujados como explícitos | DEBE bloquearse salvo vista derivada | Inferir por herencia | no se materializa herencia ★ |
| AP-30 | R+R o C+C al recomponer | DEBE bloquearse | Corregir el hijo | error en vista padre derivada |

---

## 7. Exportación canónica, intercambio y migración

| ID | Exigencia | Oblig. |
|---|---|---|
| R-VIS-EXP-2, R-OPD-CAN-1 | Declarar al menos los perfiles `canon-diagrama` (por OPD, vectorial, gramática visible + metadato mínimo) y `canon-documento` (por modelo; PUEDE incluir OPL, diccionarios, árbol de OPDs, portada). | DEBE |
| R-OPD-EXP-1/3, R-VIS-EXPORT-1A | `canon-diagrama` sin handles, grid, overlays, toasts, chrome, marcas de validación ni sombras decorativas; rótulos en negro; estilado normalizado; viewport auto-ajustado. Recomendado: SVG. | DEBE |
| R-OPD-CAN-2, R-VIS-EXP-3/5 | Todo lo que persiste en `canon-diagrama` tiene regla visual; un elemento presente en un solo perfil se declara atributo de perfil. | DEBE |
| Export OPL | OPL completo en Markdown (tipografía R-OPL-TYPO-1), bloques por OPD en orden del árbol; parte de `canon-documento`. | DEBE |
| Gates de export canónico | (1) OPD con >25 cosas (R-LAY-1); (2) refinamiento con <2 hijos (R-REF-NTRIV-3, AP-13); (3) errores estructurales abiertos (R-ESC-OP-4, R-AP-0); (4) rótulos truncados (AP-23, imposible por autosize); (5) Bocetos en régimen Modelo (solo si existen, R-CAN-BOCETO-2). El bloqueo NO afecta la edición. | DEBE |
| R-LAY-2, R-OPD-LAY-1 | Advertencia de cruces/oclusión al exportar. | DEBE |
| R-OPD-EXP-2 | Export parcial declarado como tal; recursos dependientes embebidos, referenciados o declarados ausentes. | inf. DEBE |
| R-OPD-EXP-1 | Previsualización raster: no canónica; si un perfil rasteriza, declara resolución que preserve dash, contornos, triángulos y rótulos. | PUEDE / DEBE (si existe) |
| método Apéndice F | Intercambio JSON `{ "formato": "deep-opm-pro.modelo.v0", "modelo": {...} }` con el núcleo `entidades`, `estados`, `enlaces`, `refinamientos` (en la entidad), `apariciones`, `opds` (`{id, nombre, padreId, apariencias, enlaces, ordenLocal?}`). «Nombres idénticos entre OPD/OPL/bundle. Toda referencia entre OPDs internamente consistente o la app rechaza el import. Omitir campos opcionales antes que inventarlos (la app normaliza). No emitir `formato` distinto. Exportación = instantánea, no fuente de verdad.» | inf. DEBE / NO DEBE |
| R-IDP-3, R-OPL-CX-ID-1 | Referencias a OPDs por id persistente, nunca `SDx.y`. | DEBE |
| R-§19-LENS-3 | Export determinista (aplicar patches vacíos = identidad). | DEBE |
| R-ESC-OP-4 | Importar un bundle con violaciones canónicas: se carga marcando errores estructurales recuperables (visibles en diagnóstico, bloquean export canónico); referencias rotas ⇒ rechazo del import (método F). | DEBE |
| Migración | El canon no exige migración de datos más allá del bundle anterior: importar `deep-opm-pro.modelo.v0` (mismo formato) es la ruta. §23/§25 de las specs son migración documental (no aplica). | — |

Campos del bundle (método F, textual): `entidades {id, tipo: objeto|proceso, nombre, esencia: fisica|informacional, afiliacion: sistemica|ambiental, descripcion?, esAtributo?, valorSlot?, refinamientos?}`; `estados {id, entidadId, nombre, esInicial?, esFinal?, designaciones?, suprimido?}`; `enlaces {id, tipo, origenId, destinoId, etiqueta?, estadoEntradaId?, estadoSalidaId?, multiplicidadDestino?}`; `refinamientos` = `descomposicion: {opdId}` | `despliegue: {opdId, modo: agregacion|exhibicion|generalizacion|clasificacion}`; `apariciones {id, entidadId, opdId, x, y, width, height, contextoRefinamiento?, estadosSuprimidos?}`; `opds {id, nombre, padreId, apariencias, enlaces, ordenLocal?}`. Los tipos de §1.2 agregan campos opcionales (control, abanicos, orden en bandas, duración, etiquetaInversa, ruta, multiplicidadOrigen, escisión, coleccionIncompleta, genero) como extensión declarada (DR-41).

---

## 8. Método Forja: solo lo que exige capacidades de herramienta

| Exigencia | Oblig. | Consecuencia | Fuente |
|---|---|---|---|
| Bimodalidad activa: tras cada edición gráfica se ve la oración OPL generada; todo OPD tiene su párrafo OPL. | inf. DEBE | OPL en vivo | A8.1, A8.2 |
| Validación tripartita CRÍTICA / ALTA-MEDIA / BAJA; solo CRÍTICA bloquea. | inf. DEBE | panel de diagnóstico (§6.4) | A8.1 |
| El método no bloquea: lo que nace solo del método es advertencia. | declarativa | severidad ≤ warning | §0.1, §0.2 |
| Middle-out: no forzar el orden de construcción. | inf. | la UI no impone SD-primero | A1.1 |
| Refinamiento: in-zoom con orden vertical semántico y paralelismo por bordes superiores alineados; despliegue en 4 modos con colección incompleta; supresión global y por apariencia. | inf. DEBE | §3 | A3.1–A3.6, LF-03 |
| Contorno del descompuesto: consumo, resultado y evento sistémico PROHIBIDOS en el contorno; escisión sin modificador; «Si la herramienta automatiza la migración, verificarlo». | PROHIBIDO / PUEDE | §3.2 | A3.4 |
| Alcance interno/externo persistido; reposicionar no cambia alcance. | DEBE | §3.2 | A3.3 |
| Identidad: OPD con id ≠ `SDx.y`; solo OPDs hoja eliminables; 1:1 cosa↔nombre; reuso por nombre = nueva apariencia. | DEBE / invariante | §1, §3.4 | A4.3, §9.15 |
| Estructurales homogéneos salvo exhibición (4 combinaciones); procedimentales obj↔proc (salvo invocación). | invariante | matriz §2 | §9.6, A8.2 |
| Estado inicial+final válido; N enlaces de agente al mismo proceso (AND). | PUEDE | no impedir | §9.19, §9.18 |
| Agente solo desde cosas físicas (humanas); atributo por exhibición PUEDE coaccionarse a informacional. | DEBE (invariante) / PUEDE | §2 | F, A8.2 |
| Check pasivo `DESCOMPOSICION_NO_PRESERVA_FRONTERA`. | DEBE | por construcción (DR-16) | A0.4a |
| Advertencias: OPD >20–25, refinamiento sin aporte, subproceso sin transformado, <2 subprocesos, LF-19, mezcla infinitivo/nominalización. | inf. / DEBERÍA | §6.4 | A4.2, A3.1, LF-19, A2.3 |
| Ningún gesto (exportar, integrar, graduar, marcar Biblioteca) certifica validación humana. | inf. NO DEBE | textos de la UI | A1.5-f |
| Intercambio JSON Apéndice F. | inf. DEBE | §7 | F |
| Régimen Apunte/Modelo, Bocetos, Integrar como…/Devolver a Bocetos, Graduar/Reabrir, Taller. | PUEDE (extensión) — si se implementa: integridad constante, Integrar ≠ Graduar, Devolver preserva id/hechos/subárbol, Bocetos bloquean export en Modelo, en Apunte los placeholders emiten OPL (R-ENT-2-APUNTE) | fuera del núcleo (DR-42) | A1.5, R-OPD-REF-20, R-CAN-BOCETO-1..4 |
| Asistente de 11 etapas, lentes, ledger, simulación conceptual animada, validación stakeholder, marca epistémica, LF-06..LF-18. | solo método | no se implementa | A0–A2, A7, A8.1, LF |
| Runtime (condición = omisión en traza, AND/OR, invocación como salto, bucle con límite de seguridad). | DEBE solo si hay runtime | fuera del núcleo | A6, A8.1, F.2 |

---

## 9. Requisitos numerados

Tipos: `gob` gobierno del repo · `mod` modelo de datos · `imp` impedir · `adv` advertir · `gen` generar OPL · `par` parsear/editar OPL · `ren` renderizar · `ope` operación · `int` interacción · `exp` export/import · `ver` verificación. Obligación según canon (inf. = inferida). ★ = núcleo mínimo.

Conteo (248 requisitos deduplicados tras la auditoría; clasificados por la obligación principal, la primera de la celda):

| Obligación principal | Total | ★ |
|---|---|---|
| DEBE (explícito; incluye EXIGE, DEBEN, invariante, «DEBE bloquearse/reportarse», «DEBE si existe») | 166 | 125 |
| DEBE inferido | 39 | 30 |
| NO DEBE (explícito; incluye NUNCA, PROHIBIDO) | 24 | 20 |
| NO DEBE inferido | 2 | 1 |
| DEBERÍA | 4 | 0 |
| PUEDE (explícito) | 7 | 1 |
| PUEDE inferido | 1 | 1 |
| Inferida sin verbo modal | 5 | 2 |
| **Total** | **248** | **180** |

Los ★ con obligación PUEDE o inferida son soportes necesarios de un DEBE ★ (T-023 apariencia ≠ cosa; T-076 respaldo temporal en el contorno; T-170/T-171 parseo de SE1 y semántica de conjunto de hechos).

### 9.1 Alcance y gobierno

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-001 | Mantener en el repo un registro de conformidad: cada regla DEBE del canon con estado `enforzado`/`parcial`/`no implementado`/`zona laxa pendiente`; ninguna brecha silenciosa. | DEBE | gob | R-CONF-7, R-APP-2, Anexo A «Deuda» | ★ |
| T-002 | Una regla no se declara cerrada hasta cubrir UI, kernel, importación, OPL y export aplicables. | NO DEBE | gob | R-APP-3 | |
| T-003 | No inventar reglas OPM/OPL: lo que el canon calla se clasifica `no-canonizado`/extensión declarada, nunca prohibición ontológica; bloquear solo contradicción explícita o error de categoría. | NO DEBE | gob | R-ZNC-1/2, R-APP-5, R-AP-0C, R-OPD-VAL-4, R-§23-DEP-2, R-COMB-1 | ★ |
| T-004 | Toda capacidad del producto fuera del núcleo OPM (notas, UI, estilos) se tipifica como UI/vista o extensión declarada y no emite OPL nuclear. | DEBE | gob | R-DOC-7, R-CONF-4, R-BI-3 | ★ |
| T-005 | Producto monolingüe es-CL (UI y OPL); NO mezclar EN/ES en un párrafo. | DEBE / NO DEBE | gen | R-OPL-LANG-4/5, R-OPL-EQ-5 | ★ |
| T-006 | Solo símbolos y elementos con semántica OPM asignada; nada sin semántica se persiste como hecho. | inf. DEBE / NO DEBE | mod | R-CONF-1, R-CONF-4, R-VIS-PRIM-1 | ★ |

### 9.2 Modelo de datos

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-010 | Kernel único: OPD y OPL son proyecciones del mismo modelo; el OPL se deriva y nunca es fuente; sin divergencia silenciosa. | DEBE | mod | R-BI-0/1, R-OPD-BIM-2, R-META-5, R-CONSIST-1 | ★ |
| T-011 | Toda mutación pasa por un único conjunto de operaciones validadas compartido por canvas, inspector y OPL. | DEBE | mod | R-OPL-EDIT-5/8, R-OPD-BIM-2 | ★ |
| T-012 | Cosa ∈ {objeto, proceso} (enum cerrado). | inf. DEBE | mod | R-COSA-1, R-META-14, R-ENT-1 | ★ |
| T-013 | Esencia {física, informacional} default informacional; afiliación {sistémica, ambiental} default sistémica; ambas en la cosa, no en la apariencia. | inf. DEBE | mod | R-OBJ-3, R-OPD-COSA-2/4, R-REF-4, R-CTRN-1 | ★ |
| T-014 | Perseverancia derivada del tipo; no se almacena ni tiene glifo. | inf. DEBE | mod | R-COSA-2, R-OPD-COSA-1 | ★ |
| T-015 | Estados solo en objetos, atómicos, con orden persistido; nunca flotantes ni en procesos. | inf. DEBE / NO DEBE | mod | R-EST-1, R-PROC-4, R-OPD-EST-1/2, R-ENT-EST-2 | ★ |
| T-016 | Designaciones inicial y final (0..*, combinables) y por defecto (≤1 por objeto). | inf. DEBE | mod | R-EST-2/3, R-OPD-EST-5 | ★ |
| T-017 | Designación `Current` declarada (≤1 por objeto), persistente y distinta de toda marca de runtime. | DEBE | mod | R-EST-4, R-OPD-EST-6, D13 | |
| T-018 | Supresión de estados en dos niveles (global y por apariencia); oculto ⇔ global ∨ local; suprimir no borra; conjunto completo = unión. | inf. DEBE | mod | R-OPD-EST-8, LF-03, R-CX-EST-2, R-OPL-TOTAL-5 | ★ |
| T-019 | Atributo = objeto exhibido; valores = estados del atributo; sin campo «atributos». | DEBE | mod | R-ATR-1/2, R-ENT-ATR-1/2 | ★ |
| T-020 | Valor puntual opcional de atributo (`valorSlot`). | inf. | mod | spec-OPL §2.5 | |
| T-021 | Duración de proceso `{min, esperada, max, unidad}`; unidad temporal del modelo como default; duración > 0. | DEBE / PUEDE | mod | R-EXC-4/5, R-PROC-3, R-OPD-INV-6 | ★ |
| T-022 | Id persistente opaco para cosa, estado, enlace y OPD, estable bajo renumeración; nunca `SDx.y` ni nombre. | DEBE | mod | R-IDP-0C/2/3, R-META-9, Anexo A «Identidad», AP-17 | ★ |
| T-023 | Apariencia ≠ cosa: una cosa PUEDE aparecer en N OPDs; ≤1 apariencia por (cosa, OPD). | PUEDE / NO DEBE | mod | R-VIS-APP-1, R-PRIN-9, R-INS-2, DR-25 | ★ |
| T-024 | Nombre único en el modelo (objetos y procesos comparten espacio); reuso de nombre = nueva apariencia. | invariante | mod | método §9.15/A8.2, R-VIS-NOM-1, DR-22 | ★ |
| T-025 | Léxico de nombres: cosa = palabras (letra/dígito/`-`/`_`, acentos, ñ, ü) separadas por un espacio, cada una empieza con letra, la primera en mayúscula; estado = una palabra que empieza en minúscula. Si la herramienta normaliza (casing, espacios), NO DEBE hacerlo en silencio. | DEBE / NO DEBE | imp | R-§18-LEX-1, R-OPL-LEX-1..3, R-OPD-ROT-5, R-VIS-AUTOR-2, DR-8 | ★ |
| T-026 | Enlace binario con tipo (familia derivada, 6 familias cerradas), origen, destino, estado de entrada/salida opcional, control, etiqueta(s), ruta y multiplicidad por extremo. | DEBE | mod | R-META-13, reglas §5.1, método §9.23 | ★ |
| T-027 | Control `e`/`c` como atributo escalar del enlace (a lo sumo uno); no crea cosa ni enlace. | DEBE / PUEDE | mod | R-ECA-4, R-MOD-NAT-1, R-COMB-3, R-§21-OPL-MOD | ★ |
| T-028 | Abanico XOR/OR como entidad explícita (n ≥ 2, mismo tipo, extremo común); AND = ausencia de abanico. | inf. DEBE | mod | spec-OPL §8.1, R-FAN-HAB-1, R-VIS-FAN-1 | ★ |
| T-029 | Refinamiento en la cosa: descomposición `{opdId, orden en bandas}` y despliegue `{opdId, modo}`; a lo sumo uno de cada. | inf. DEBE | mod | método F, R-INV-2D, R-IDP-0A | ★ |
| T-030 | Orden temporal declarado (bandas) como fuente de verdad; la Y lo realiza; orden, navegación e identidad son canales separados. | DEBE | mod | R-IDP-0/0A/0B, R-INV-2D, R-LAY-4 | ★ |
| T-031 | Árbol de OPDs con raíz `SD`; OPD con padre, cosa refinada y tipo de refinamiento; etiqueta `SDx.y` derivada (preorden, hijos por orden de creación) y mutable. | DEBE / PUEDE | mod | R-ARB-1/3/4, R-IDP-1/1A, DR-4 | ★ |
| T-032 | Procedencia de escisión en el par TS4/TS5 (referencia mutua). | inf. DEBE | mod | R-ESCIND-0, DR-7 | ★ |
| T-033 | Alcance de la apariencia (contenedor/interno/externo) persistido, no derivado de la geometría. | DEBE | mod | método A3.3, R-HIJO-6 | ★ |
| T-034 | Marca de colección incompleta por (refinable, relación) para agregación, exhibición y generalización; nunca clasificación. | inf. DEBE / NO DEBE | mod | reglas §3.10, R-STRF-3, R-OPD-STR-4 | |
| T-035 | Género gramatical por cosa, masculino por defecto, ajustable. | inf. DEBE | mod | R-OPL-1, DR-12 | |
| T-036 | Ningún estado de runtime se persiste en el modelo. | NO DEBE | mod | R-EJEC-3, R-OPD-SIM-6, Anexo A «Estado» | ★ |

### 9.3 Validez (impedir)

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-040 | Validar la firma antes de crear un enlace y ofrecer solo los tipos legales para el par (matriz §2.1). | DEBE | imp | R-EDIT-1, R-OPD-EDIT-1, Anexo A «Firma» | ★ |
| T-041 | Validar el extremo de estado antes de anclar. | DEBE | imp | R-EDIT-2 | ★ |
| T-042 | Consumo solo objeto(/estado) → proceso; resultado solo proceso → objeto(/estado). | inf. DEBE | imp | reglas §5.2 | ★ |
| T-043 | Resultado nunca anclado al estado inicial. | DEBE / NUNCA | imp | R-RES-1, AP-04, R-OPD-TR-3 | ★ |
| T-044 | Efecto solo hacia objetos con ≥1 estado (propio o heredado de un general, DR-43). | DEBE | imp | R-EFE-1, R-OBJ-2, R-OPD-EST-3 | ★ |
| T-045 | Agente solo desde objeto físico (proxy declarado de humano); robots, software, IA y máquinas van como instrumento. | DEBE | imp | R-AG-1/1A/1B, AP-05, R-OPD-HAB-1, método F, DR-5 | ★ |
| T-046 | Invocación solo proceso → proceso (autoinvocación = mismo proceso); nunca toca objetos. | DEBE / NO DEBE | imp | R-INV-1, R-IV-1, R-OPD-INV-1 | ★ |
| T-047 | Excepción solo proceso fuente → proceso de manejo (impedir otra firma). Sobretiempo exige `duracion.max` y subtiempo `duracion.min` de la fuente: canónico condicionado ⇒ pedir el dato al crear o advertir; nunca inventar la cota. | DEBE | imp | R-EXC-1/2/3, R-EXC-DUR-1, R-OPD-CTL-6, reglas l.115 | ★ |
| T-048 | Agregación, generalización y clasificación solo entre cosas del mismo tipo; exhibición admite las 4 combinaciones. | DEBE / PUEDE | imp | R-STRF-1/2/2A, R-EST-PERS-1/2, R-OPD-STR-3 | ★ |
| T-049 | Etiquetados solo objeto↔objeto o proceso↔proceso. | DEBE | imp | R-OPL-SE-2, R-EST-TAG-1 | ★ |
| T-050 | Bidireccional/recíproco con estado solo en destino: impedir. | NO DEBE / DEBE bloquearse | imp | V-30, R-EST-SSE-1, AP-11, R-OPD-STR-9 | |
| T-051 | `e`/`c` solo en consumo, efecto, agente e instrumento (Pre(P)); nunca en resultado, estructural, invocación, excepción ni fragmento escindido. | NO DEBE / NUNCA | imp | R-MOD-1..4, R-MOD-INPUT-1/2, R-MOD-CAT-1/2, R-EXC-1B, AP-01/02/08/09/10 | ★ |
| T-052 | A lo sumo un control por enlace (`c`+`e` imposible). | NO DEBE | imp | R-COMB-3, AP-28, R-§21-OPL-MOD | ★ |
| T-053 | A lo sumo un enlace procedimental por par (objeto, proceso), salvo ramas de un mismo abanico; entre niveles rigen R-ROL-1/3 y la precedencia al abstraer (DEC33); sin auto-resolución en edición. | DEBE | imp | R-ROL-UNIC-1, R-HAB-AG-5, R-OPD-HAB-4, reglas §6.5, DR-6 | ★ |
| T-054 | Abanico: n ≥ 2, mismo tipo, extremo común; solo en consumo, resultado, efecto, agente, instrumento e invocación (convergente o divergente). | inf. DEBE | imp | spec-OPL §8.1, reglas §7.2, R-FAN-HAB-1, DR-9 | ★ |
| T-055 | Abanicos de resultado e invocación sin `e`/`c`. | DEBE bloquearse | imp | AP-03, R-OPD-CTL-8, R-FAN-4 | ★ |
| T-056 | Abanico con control mixto: rechazar como `non-canonical`. Abanico×control listado como válido pero sin plantilla literal (C-19b, C-18 instrumento, agente): no ofrecer; parser `unsupported-canonical`. | DEBE / NO DEBE | imp | R-ZNC-COMB-1, R-COMB-1, R-FAN-3, R-IMPORT-5, spec-OPL §8.3/§8.4 | |
| T-057 | Multiplicidad solo en etiquetados (ambos extremos), agregación (extremo parte) y procedimentales (extremo objeto); nunca en extremo proceso; valores `?`, `*`, `+` (ausente = 1..1); no se ofrece junto con `c` (sin hueco en A.6, DR-44). | DEBE / NO DEBE / NUNCA | imp | R-MULT-1/1A, R-OPD-MUL-1, R-COMB-6, EBNF A.5/A.6/A.8/A.9, DR-21, DR-44 | |
| T-058 | Ruta solo en consumo y resultado (restricción de producto declarada); etiqueta definida por el modelador, nunca autogenerada. | DEBE / NO DEBE | imp | R-OPL-RUTA-2/3, DR-19 | |
| T-059 | Nada dentro de un estado; ningún estado dentro de un proceso. | inf. DEBE | imp | reglas §3.11, R-OPD-COSA-7, AP-12 | ★ |
| T-060 | Consumo, resultado y evento de objeto sistémico nunca anclados al contorno de un proceso descompuesto (evento de objeto ambiental sí). | NO DEBE / PUEDE | imp | R-DIST-1, R-CX-DIST-1/2, AP-06, AP-21 | ★ |
| T-061 | Evento a subproceso no primero: impedir si un subproceso de banda anterior tiene transformador sin `c`; si no, advertir. | DEBE bloquearse / DEBE advertirse | imp | AP-27 | |
| T-062 | Sin placeholders: cosa y estado nacen con el nombre que escribe el modelador (no hay «cosa sin nombrar» que emitir); R-ENT-2 queda satisfecho por construcción. No se rechazan nombres escritos por el usuario por parecerse a un patrón (`Objeto 2`, `Proceso`): eso es heurística de v0, no canon. | NO DEBE (emitir) | imp | R-ENT-2, spec-OPL Definiciones («Placeholder»), DR-11 | ★ |
| T-063 | Cambio de tipo objeto↔proceso: recalcular y revisar enlaces; impedir si deja estados o enlaces inválidos. | DEBE | imp | R-EDIT-3, R-OPD-EDIT-2 | ★ |
| T-064 | Combinación prohibida ⇒ bloqueo antes de persistir; edición ambigua ⇒ bloqueo hasta resolver identidad, firma o alcance. | DEBE | imp | R-EDIT-8, R-ESC-OP-3/4, R-APP-4, R-OPD-EDIT-4 | ★ |
| T-065 | Conflicto de unicidad nominal resuelto explícitamente (reusar / renombrar / descartar); nunca reescritura silenciosa del rótulo. | NO DEBE | imp | R-OPD-ROT-5, AP-22 | ★ |
| T-066 | Los internos de una descomposición solo se enlazan con cosas visibles en ese OPD hijo. | inf. DEBE | imp | método A3.3 | ★ |

### 9.4 Refinamiento y consistencia inter-OPD

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-070 | Descomponer proceso (in-zoom) como operación atómica: crea OPD hijo con la cosa como contenedor agrandado y copia como externos todas las cosas conectadas al padre. | DEBE | ope | R-HIJO-1/3, R-OPD-REF-1/4, R-OPD-OP-1/3, R-VIS-INZOOM-1, R-ANID-1 | ★ |
| T-071 | Desplegar cosa por un modo (agregación/exhibición/generalización/clasificación) en OPD hijo, copiando solo los hijos estructurales directos de ese modo. | DEBE | ope | R-REF-MEC-1, R-HIJO-4, R-CX-DESP-1 | ★ |
| T-072 | Descomposición de objeto (in-zoom de objeto, posición no temporal). | DEBE | ope | R-OPL-CX-4, R-OPD-REF-1/2, DR-23 | |
| T-073 | Distribución al descomponer: consumo → primer subproceso; resultado → último; efecto sin estado, agente e instrumento quedan en el contorno con lectura distributiva; estructurales en el contenedor; evento de objeto sistémico → primer subproceso. | DEBE / inf. | ope | R-DIST-1/1A, reglas §8.5, R-OPD-REF-11, R-OPD-EDIT-5, DR-13 | ★ |
| T-074 | Escisión: TS3 al descomponer (≥2 subprocesos) ⇒ TS4 en el temprano + TS5 en el tardío, par acoplado sin `e`/`c`; único mecanismo. | DEBE | ope | R-ESCIND-1..3, R-ESC-1/1A, AP-07/08, R-OPD-TR-7 | ★ |
| T-075 | Toda migración conserva el id del enlace. | DEBE | ope | R-OPD-OP-4, R-CX-DIST (efecto OPL) | ★ |
| T-076 | Enlaces que quedan en el contorno sin subprocesos: respaldo temporal que migra al insertar el primero; luego la reasignación es del modelador. | inf. PUEDE | ope | R-VIS-DIST-1, método A3.4, DR-13 | ★ |
| T-077 | Refinamiento no trivial: ≥2 subprocesos o refinadores; con <2 se permite en edición, se advierte y se bloquea el export canónico. | DEBE / NO DEBE / PUEDE | adv | R-REF-NTRIV-1..3, AP-13, R-OPD-REF-7 | ★ |
| T-078 | Sin ciclos de refinamiento (chequeo transitivo). | NO DEBE | imp | R-REF-1, AP-16, R-OPD-REF-8 | ★ |
| T-079 | Un externo no se refina desde el OPD hijo donde es externo. | NO DEBE | imp | R-HIJO-5 | ★ |
| T-080 | Internos se eliminan en cascada con su refinamiento; externos persisten. | DEBE | ope | R-HIJO-6, R-OPD-REF-5 | ★ |
| T-081 | Mover un externo dentro del contenedor no cambia su alcance: rebote y aviso. | DEBE | ope | R-OPD-REF-5, método A3.3 | |
| T-082 | Drag de subproceso confinado al contenedor; posición vertical dada por la banda. | DEBE | ope | R-OPD-UI-3, R-INV-2/2A | ★ |
| T-083 | Solo OPDs hoja eliminables; «Eliminar refinamiento» es destructivo, con confirmación, distinto de cualquier inversa no destructiva. | inf. NO DEBE / DEBE | ope | R-REF-3, método A4.3/A1.5-d, DR-17 | ★ |
| T-084 | Sin instancia visual entre tipos distintos. | NO DEBE | imp | R-REF-2, AP-15, R-OPD-REF-17 | ★ |
| T-085 | Vista del OPD padre derivada: enlaces de subprocesos se muestran abstraídos al contenedor, colisiones por fuerza semántica (12 niveles) y matriz 3×3; conflictos reportados sin colapso automático. | DEBE / NO DEBE | ren | R-OPL-DISP-3, R-OPD-REF-13, reglas §6.5/§6.6, R-PREC-1..5, AP-30, DR-13 | ★ |
| T-086 | En un OPD hijo solo se ven enlaces que tocan el contenedor o internos. | DEBEN | ren | R-VIS-HIJO-1, R-OPD-REF-6 | ★ |
| T-087 | Rastrear refinadores y ajustar automáticamente símbolo (contorno grueso, colección incompleta) y OPL al cambiar la colección, dejando traza de cada ajuste automático. | DEBE | ope | R-OPD-EDIT-6, R-OPD-OP-5, DR-45 | ★ |
| T-088 | Advertir refinador incluido en más de un contexto con pertenencia ambigua. | DEBE | adv | R-OPD-OP-6 | |
| T-089 | Firma de frontera de la descomposición preservada (checker pasivo `DESCOMPOSICION_NO_PRESERVA_FRONTERA`; por construcción con vista derivada, pero realizado como ley ejecutable en la suite). | DEBE | adv | R-OPD-REF-10, método A0.4a, R-CAT-EQ-3, R-ANEXO-CAT-0, DR-16 | |
| T-090 | Advertir SD sin exactamente un proceso sistémico. | inf. DEBE | adv | R-SD-4, R-VIS-SD-1 | |
| T-091 | Afiliación ambiental heredada por la cadena estructural: los rasgos (atributos **y operaciones**) de una cosa ambiental son ambientales «automáticamente» (propagar al crear la exhibición **y** al volver ambiental al exhibidor); advertir incoherencias restantes en la cadena estructural; advertir proceso ejecutado por cosas ambientales no ambiental. | DEBE | adv | R-OBJ-6/7, R-OPD-STR-13, R-VIS-HER-2 | |
| T-092 | No materializar herencia: heredados ni se dibujan ni se emiten. | NO DEBE | ren | R-HER-8, AP-29, R-EST-HER-1, R-OPD-STR-6 | ★ |
| T-093 | Herencia múltiple permitida (varios generales). | DEBE | mod | R-HER-2 | ★ |
| T-094 | DEBERÍA detectar inconsistencias inter-OPD, inclusión múltiple de refinador y generales redundantes junto a especializados. | DEBERÍA | adv | R-OPD-VAL-6 | |

### 9.5 OPL: generación

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-100 | OPL completo = bloques por OPD en preorden del árbol, orden determinista y estable; cubre todo el modelo cargado. | DEBE / NO DEBE | gen | R-OPL-TOTAL-1/2, R-OPL-DISP-1/2, R-OPL-PANEL-1 | ★ |
| T-101 | Cada bloque expresa solo los estados visibles en su OPD; D6 cuando hay estados suprimidos. | DEBE | gen | R-OPL-TOTAL-4, R-OPD-EST-9 | ★ |
| T-102 | Tipografía Markdown: **objeto**, *proceso*, `estado`. | DEBE | gen | R-OPL-TYPO-1, spec-OPL §1.1, R-§21-OPL-TIPO | ★ |
| T-103 | Una oración por línea, terminada en punto. | DEBE | gen | R-OPL-EBNF-4/5 | ★ |
| T-104 | Vocabulario cerrado (palabras fijas de las plantillas); verbos en 3.ª persona singular del presente; sin sinónimos. | DEBE / NO DEBE | gen | spec-OPL §1, R-OPL-VERB-1, R-§21-OPL-VOCAB, DR-27 | ★ |
| T-105 | Emitir con las plantillas literales de reglas §4 y §7 (tablas-gate); la tabla 9.2 es el mínimo. | DEBE | gen | R-BI-TAB-1, reglas l.41 | ★ |
| T-106 | Esencia/afiliación: D1 si física, D3 si ambiental; defaults (D2, D4) no se emiten en canónico. | DEBE | gen | R-BI-TAB-1 (tabla 9.2), DR-2 | ★ |
| T-107 | Estados: D5 con `puede estar` (nunca `puede ser`), en el orden del modelo, `o`/`u` final. | DEBE / NUNCA | gen | R-VERB-EST-1, R-ENT-EST-1, D5 | ★ |
| T-108 | Designaciones D7, D8, D9 y D10 (una sola oración si inicial y final). | inf. DEBE | gen | reglas §4.4, spec-OPL §2.4 | ★ |
| T-109 | Designación D13 para `Current` declarado. | inf. DEBE | gen | D13 | |
| T-110 | Transformadores T1–T3, TS1–TS5. | DEBE | gen | reglas §4.5 | ★ |
| T-111 | Habilitadores H1, H2, HS1, HS2 (asimetría sujeto-verbo intacta). | DEBE / NO DEBE | gen | reglas §4.6, spec-OPL §4.2 | ★ |
| T-112 | Un enlace con control emite su plantilla de evento (ET1, ET2, EH1, EH2, ETS1–ETS4, EHS1, EHS2) o de condición (CT1, CT2, CH1, CH2, CS1–CS6) en lugar de la base: un solo hecho, una sola oración. | DEBE | gen | reglas §4.7/§4.8, R-ECA-4, R-MOD-NAT-2 | ★ |
| T-113 | Preferir CT1 sobre la variante `Si … entonces …`. | DEBE | gen | R-OPL-COND-ALT-2 | ★ |
| T-114 | Rama negativa siempre `de lo contrario *Proceso* se omite`; positiva de consumo en pasiva refleja. | DEBE / NO DEBE | gen | R-COND-RAMA-1/2 | ★ |
| T-115 | Excepción EX1/EX2 realizada como `<valor> <unidad>` con la unidad propia o la del modelo, `<unidad>` como palabra es-CL (`excede 5 minutos`); sin cota, frase de respaldo `su duración máxima` / `su duración mínima` (emitida y parseada). | DEBE | gen | reglas §4.9, spec-OPL §5.3 (R-EXC-DUR-1, nota de realización), R-OPD-INV-6, DR-18 | ★ |
| T-116 | Invocación IV1 y autoinvocación IV2. | DEBE | gen | reglas §4.9 | ★ |
| T-117 | Estructurales RF1, RF2, RF2b, RF3, RF3b, RF4, RF4b, RH1 y variantes de proceso; RH1 cuando una especialización tiene ≥2 generales. | DEBE | gen | reglas §4.10, R-OPL-RF-1/4/6 | ★ |
| T-118 | Colección incompleta: `… y al menos otra parte / otro rasgo / otra especialización`; nunca en clasificación. | DEBE / NO DEBE | gen | reglas §4.10, R-STRF-3 | |
| T-119 | Etiquetados SE1 (etiqueta de usuario) y SE2 (`se relaciona con` si no hay etiqueta). | DEBE | gen | reglas §4.10, R-OPL-SE-5, R-EST-TAG-2 | ★ |
| T-120 | Etiquetados SE3, SE4, SE5; SE3 con etiquetas idénticas se emite como SE4. | DEBE | gen | reglas §4.10, R-STRE-1 | |
| T-121 | Estructurales con estado SSE1–SSE7 y especialización de estado. | DEBE | gen | reglas §4.10, R-OPL-RF-3 | |
| T-122 | Abanicos: las 24 plantillas de reglas §7.3; ramas con estado como `**A** en `s``. | DEBE | gen | reglas §7.3, R-FAN-2, R-FAN-EST-1 | ★ |
| T-123 | Abanico de efecto sobre estados de un objeto (R-FAN-5) y fan TS3 con entrada común (R-FAN-5A: la entrada común NO DEBE suprimirse; fallar cerrado si varían entrada y salida). | DEBE / NO DEBE | gen | spec-OPL §8.1, DR-30 | |
| T-124 | Abanico × modificador solo con plantilla: condición con todas las ramas `c` (C-18 y reglas §7.4) y evento en fan de efecto con objeto común (R-FAN-4). | DEBE / NO DEBE | gen | reglas §7.4, R-FAN-3/4 | |
| T-125 | Descomposición en el OPD hijo: CX1 (secuencial), CX2 (una banda paralela) o mixta; sin rayos de invocación implícita. | DEBE | gen | reglas §4.11, R-OPL-CX-5, R-IV-2, DR-24 | ★ |
| T-126 | Despliegue en el OPD hijo: CX3 `**Cosa** se despliega en SDx en …`; nunca `en esa secuencia` ni `paralelo`. | DEBE / NO DEBE | gen | reglas §4.11, R-OPL-CX-2, R-CX-DESP-2, R-CX-SYNC-2, DR-24 | ★ |
| T-127 | Sin oración de refinamiento con <2 refinadores ni para OPD semidescompuesto. | NO DEBE | gen | R-CX-0, R-OPD-OP-3 | ★ |
| T-128 | Multiplicidad antepuesta al sustantivo (`un/una opcional`, `opcional (cero o más)`, `al menos un/una`) como sub-span propio; nunca símbolos crudos. | DEBE | gen | R-MULT-1, spec-OPL §10.1/§10.3 | |
| T-129 | Ruta como prefijo fijo `Por ruta L, ` antepuesto a la oración completa (también a su variante E\*/C\*), con orden de superficie estable; con ruta, una oración por enlace (no agrupar abanico). | DEBE / NO DEBE | gen | R-OPL-RUTA-1, R-COMB-4, R-COMB-5, spec-OPL §11, C-24 | |
| T-130 | Listas con coma y `y`/`o` final sin coma de Oxford; alternancia `e`/`u` por fonética. | DEBE | gen | R-OPL-LISTA-1, R-OPL-KW-2, R-§18-LISTA-1, DR-26 | ★ |
| T-131 | Fuera de OPDs hijos, coordinar destinos estructurales del mismo vértice y relación tras un solo verbo (eje b). | DEBE | gen | R-COMP-EJE-3, R-COMP-ELEG-3 | ★ |
| T-132 | En OPDs hijos de refinamiento, una oración por enlace de refinador, coexistiendo con la oración de refinamiento; nunca fusión en su reemplazo. | NO DEBE / DEBE | gen | R-CX-COMP-1..3, R-COMP-ZP-1 | ★ |
| T-133 | No emitir oraciones compuestas indescomponibles; composición eje (a)/(c) no se emite. | NO DEBE | gen | R-COMP-ZP-2/3, R-COMP-EJE-4 | ★ |
| T-134 | Orden determinista dentro del bloque (refinamiento, cosas, procedimentales por fuerza, estructurales). | DEBE / DEBERÍA | gen | R-COMP-ELEG-3, DR-32 | ★ |
| T-135 | Cada línea con tokens tipados (`entidad`/`enlace`/`estado`/`opd`), refs únicas en orden de aparición y token → hecho. | DEBE | gen | R-OPL-INT-1/2/6, R-COMP-MAESTRA-1..3, R-§18-EXT-1, DR-28 | ★ |
| T-136 | Notas, UI y meta no emiten OPL; semi-plegado y runtime no tienen OPL. | NO DEBE | gen | R-BR-1/3/4, R-OPD-BIM-4 | ★ |
| T-137 | La instancia visual no emite oración de instanciación. | NO DEBE | gen | R-ENT-INS-1 | ★ |
| T-138 | Proceso persistente explícito como TS3 con entrada = salida; sin verbo especial. | DEBE / NO DEBE | gen | R-OPL-PERSIST-1/2, R-PROC-7 | |
| T-139 | Tres modos de visibilidad de esencia (`siempre` default, `solo-difiere`, `oculta`) solo en display; el canónico no cambia. | DEBE / NO DEBE | int | R-OPL-CFG-1/2, R-OPL-PANEL-5 | |

### 9.6 OPL: parseo, importación y edición

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-150 | Parsear contra la gramática (plantillas + EBNF) antes de tocar el modelo; parse completo y luego aplicación. | DEBE | par | R-IMPORT-1, R-CONF-3 | ★ |
| T-151 | Declarar explícitamente el subconjunto de producciones soportado. | DEBE | par | spec-OPL §18, R-§19-SIM-2 | ★ |
| T-152 | Normalizar antes de cotejar (Unicode → ASCII en operadores y delimitadores; espacios), preservando acentos, ñ y ü en nombres. | DEBE | par | R-§18-NORM-1, R-MULT-3, R-OPL-RANGO-3 | ★ |
| T-153 | Tipografía como portadora de tipo: crear cosa nueva solo si la tipografía la desambigua; si no, resolver a cosa existente. | DEBE | par | R-IMPORT-2 | ★ |
| T-154 | Estado inexistente se crea si el objeto dueño está identificado. | PUEDE | par | R-IMPORT-3 |  |
| T-155 | Firma que contradice tipos existentes ⇒ rechazo `enlace-invalido-firma`. | DEBE | par | R-IMPORT-4, R-OPL-FALLO-5 | ★ |
| T-156 | Canónica no soportada ⇒ `unsupported-canonical` (warning), sin mutar ni degradar. | DEBE / NO DEBE | par | R-IMPORT-5, R-§19-SIM-2, DR-34 | ★ |
| T-157 | No canonizada ⇒ `non-canonical`, sin convertirla en extensión silenciosa; OPL fuera de la EBNF nunca se presenta como canónico. | DEBE / NO DEBE | par | R-IMPORT-6, R-CONF-6, R-COMB-1 | ★ |
| T-158 | Cambio de tipo ontológico de una cosa existente ⇒ bloquear y pedir decisión (renombrar, crear cosa nueva, corregir OPL). | DEBE | par | R-IMPORT-7, R-OPD-EDIT-2 | ★ |
| T-159 | Reparseo preserva layout y metadatos no expresables en OPL (posiciones, escisión). | DEBE | par | R-IMPORT-8 | ★ |
| T-160 | Parser estricto: sin firma canónica se rechaza; nunca grafo plausible. | DEBE / NO DEBE | par | R-BI-2, R-OPD-BIM-2, Anexo A «Parseo» | ★ |
| T-161 | Aceptar la variante `Si **Objeto** existe entonces *Proceso* ocurre y consume **Objeto**, de lo contrario se omite *Proceso*.` | DEBE | par | R-OPL-COND-ALT-1 | ★ |
| T-162 | Aceptar D1–D4 atómicas y la clasificación combinada R-ENT-3; ausencia ⇒ defaults. | DEBE | par | spec-OPL §2.0/§2.7/§2.8, DR-2 | ★ |
| T-163 | Aceptar el sufijo ` proceso` en identificadores de proceso y ambas alternancias `y/e`, `o/u`. | PUEDE / inf. | par | R-OPL-9, R-OPL-KW-2 | |
| T-164 | TS4/TS5 parseados siempre como standalone. | DEBE | par | spec-OPL §3.5, R-ESCIND-0 | ★ |
| T-165 | TS3 sobre modelo vacío crea el objeto y sus estados. | inf. | par | spec-OPL §3.4 |  |
| T-166 | `*P* se descompone en …` crea o confirma la descomposición, crea los subprocesos inexistentes y fija las bandas; `se despliega en` crea o confirma el despliegue; miembro existente ajeno ⇒ rechazo. | DEBE | par | R-BI-DUAL-1, R-OPL-CX-2..5, DR-35 | ★ |
| T-167 | Resolver `SDx.y` en OPL al id persistente del OPD. | DEBE | par | R-OPL-CX-ID-1, R-CX-2 | ★ |
| T-168 | Una línea abstraída del OPD padre se resuelve al hecho refinado existente (`sin-cambio`). | DEBE | par | R-OPL-DISP-4, DR-13 | ★ |
| T-169 | Fan TS3 con entrada común ⇒ un TS3 por salida y un único abanico. | DEBE | par | R-FAN-5B | |
| T-170 | Línea `**A** <frase en minúscula> **B**.` sin otro esqueleto ⇒ SE1 con esa etiqueta. | inf. | par | R-EST-TAG-1, DR-36 | ★ |
| T-171 | El texto es un conjunto de hechos: reordenar líneas no muta; al regenerar se reimpone el orden canónico. | inf. | par | spec-OPL §19.5 | ★ |
| T-172 | Una línea ausente nunca borra un hecho: `no-delete-by-absence` (info); el borrado es explícito (canvas/inspector). | NO DEBE | par | R-§19-LENS-1, R-OPL-EDIT-4, R-OPL-FALLO-8 | ★ |
| T-173 | Preview puro: clasificar sin mutar; aplicar en una fase separada. | NO DEBE | par | R-§19-LENS-2 | ★ |
| T-174 | Clasificación por línea: `ignorada-vacia`, `aplicable`, `no-aplicable`, `sin-cambio`, con esa precedencia. | DEBE | par | R-OPL-EDIT-1 | ★ |
| T-175 | Resumen por contadores y botón `Aplicar N cambio(s)` / `Sin cambios aplicables`. | DEBE | int | R-OPL-EDIT-2 | |
| T-176 | Razones de no-aplicabilidad del enum cerrado de 8 con sus textos visibles. | DEBE / NO DEBE | par | R-OPL-EDIT-3 | ★ |
| T-177 | Diagnóstico de parser tipado `{codigo, severidad, linea}`; solo `error` bloquea la línea. | DEBE / NO DEBE | par | R-OPL-FALLO-1 | ★ |
| T-178 | `forma-no-reconocida`, `puntuacion-faltante`, `referencia-ambigua`, `entidad-no-existe`, `conflicto-patches` según corresponda. | DEBE | par | R-OPL-FALLO-3..6 | ★ |
| T-179 | Partial-parse: líneas mezcladas no bloquean el documento en bloque. | DEBE / NO DEBE | par | R-OPL-FALLO-7 | ★ |
| T-180 | Aplicación fail-fast y atómica (todo o nada sobre copia del modelo). | DEBE | par | R-OPL-FALLO-2, DR-39 | ★ |
| T-181 | Patches aplicados en tres fases: no-enlace, enlace, abanicos. | DEBE | par | R-OPL-EDIT-5 | ★ |
| T-182 | Creación de enlace idempotente sobre (tipo, origen, destino). | DEBE | par | R-OPL-EDIT-6 | ★ |
| T-183 | Edición inline limitada a renombrar entidad, renombrar estado, fijar etiqueta de enlace y abrir inspector; valida el id antes de mutar. | DEBE / NO DEBE | int | R-OPL-EDIT-7 | |
| T-184 | Editar una oración de lista muta solo los hechos cuyos sub-spans cambiaron. | DEBE | par | R-OPL-EDIT-9 | ★ |
| T-185 | Líneas solo-display (rótulos de bloque, numeración) no generan patches; frontera display/parseable explícita. | NO DEBE / DEBE | par | R-§19-DISP-1/2, R-§21-OPL-DISP | ★ |

### 9.7 Roundtrip

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-190 | Toda afirmación gráfica reproducible como OPL y toda oración OPL aceptada representable como constructo OPD. | DEBE | ver | R-BI-DUAL-1, R-OPD-BIM-1 | ★ |
| T-191 | `parsear(generar(m))` sin diagnósticos `error` para todo modelo válido. | DEBE | ver | R-§19-SIM-1 | ★ |
| T-192 | Roundtrip estricto desde modelo vacío: `generar(m) == generar(aplicar(parsear(generar(m))))` línea a línea, para todas las filas de la tabla 9.2 y lo soportado. | EXIGE | ver | R-§19-SIM-3, R-BI-TAB-1 | ★ |
| T-193 | Bisimetrías parciales declaradas (escisión, borrado, layout) y marcadas no estrictas. | DEBE | ver | R-§19-ROT-1 | ★ |
| T-194 | `parsear(componer(F)) = F` para toda oración de lista. | DEBE | ver | R-§19-COMP-1, R-COMP-REV-1/2 | ★ |
| T-195 | Roundtrip preserva el hecho, no la superficie literal. | DEBE | ver | R-BI-4 | ★ |
| T-196 | Export determinista: `export(aplicar(m, [])) == export(m)`. | DEBE | ver | R-§19-LENS-3 | ★ |

### 9.8 OPD: render

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-200 | Las 8 combinaciones forma × contorno × sombra como función pura de (tipo, esencia, afiliación). | inf. DEBE | ren | reglas §3.2, spec-OPD §2.1 | ★ |
| T-201 | Sombra ⟺ física; sin sombras decorativas. | DEBE | ren | R-SOMB-1..3, R-OPD-COSA-3, AP-19 | ★ |
| T-202 | Contorno grueso solo en cosas refinadas en otro OPD (padre e hijo). | DEBE / NO DEBE | ren | R-CTRN-2, R-OPD-REF-1 | ★ |
| T-203 | Semántica independiente del color; rótulos en negro en canon. | DEBE | ren | R-COLOR-2, R-ROT-3, R-OPD-COSA-5, R-OPD-ROT-1 | ★ |
| T-204 | Rótulo íntegro y centrado; autosize expande la forma; nunca elipsis ni corte. | DEBE / NO DEBE | ren | R-ROT-1/2, R-OPD-COSA-6, AP-23 | ★ |
| T-205 | Cosas de igual clase comparten base cromática y tipográfica. | DEBE | ren | R-OPD-COSA-8 |  |
| T-206 | Estado: rountangle en la región inferior del objeto; inicial = borde grueso, final = doble borde, por defecto = flecha diagonal abierta entrante. | DEBE / inf. | ren | R-OPD-EST-1/5/7, R-EST-2 | ★ |
| T-207 | `Current` declarado con pin externo reservado, distinto de inicial/final/por defecto. | DEBE | ren | R-EST-4, R-OPD-EST-6, DR-37 | |
| T-208 | Chip `⋯N` con estados ocultos; persiste en canon. | DEBE | ren | R-OPD-EST-9, reglas §3.10, DR-15 | ★ |
| T-209 | Punta cerrada (swallowtail `M 0 0 L 23 8 L 12 0 L 23 -8 Z`) según dirección: en el proceso (consumo), en el objeto (resultado), en ambos (efecto), una (TS4/TS5). | inf. DEBE | ren | R-OPD-TR-1/2/6, reglas §3.7 | ★ |
| T-210 | Piruleta negra (agente) / blanca (instrumento) en el extremo proceso, colgando de una línea visible. | DEBE | ren | R-DEC-1/1A, R-OPD-HAB-2 | ★ |
| T-211 | Rayo zigzag con punta cerrada en el invocado; autoinvocación en bucle. | inf. DEBE | ren | R-OPD-INV-1 | ★ |
| T-212 | Triángulos con topología interna (relleno, triángulo interior, vacío, círculo interior); vértice al refinable, base a refinadores, líneas visibles. | DEBE | ren | R-TRI-1..3, R-VIS-TRI-1, AP-20, R-OPD-STR-1/2 | ★ |
| T-213 | Etiquetado: punta abierta (uni), arpones (bi/recíproco), etiqueta en itálica sobre el eje. | inf. DEBE | ren | reglas §3.7/§3.9, R-OPD-STR-8 | ★ |
| T-214 | Letras `e`/`c` en minúscula sobre la línea cerca del extremo proceso. | DEBE | ren | R-OPD-CTL-2 | ★ |
| T-215 | Marcas `/` y `//` cerca del manejador. | inf. DEBE | ren | spec-OPD §6.2, reglas §3.9, DR-38 | ★ |
| T-216 | Arco discontinuo simple (XOR) o doble concéntrico (OR) en el extremo común del abanico; AND sin arco. | DEBE | ren | R-FAN-GEO-1/2, R-OPD-CTL-7, reglas §7.1, DR-9 | ★ |
| T-217 | Barra corta bajo el triángulo para colección incompleta. | inf. DEBE | ren | reglas §3.10, R-OPD-STR-4 | |
| T-218 | Multiplicidad junto al extremo del enlace. | DEBE | ren | R-VIS-MULT-1, R-OPD-MUL-1 | |
| T-219 | Etiqueta de ruta sobre el enlace procedimental. | inf. DEBE | ren | reglas §3.9 | |
| T-220 | Duración dentro de la elipse, bajo el nombre: `[unidad] {min, esperada, max}`; sin placeholder si falta. | inf. DEBE / NO DEBE | ren | R-OPD-INV-6, R-VIS-DUR-1/2 | ★ |
| T-221 | Contenedor in-zoom agrandado con subprocesos por bandas (arriba → abajo; misma banda a la misma altura). | DEBE | ren | R-ANID-1/1A, R-INV-2/2A, R-VIS-REF-1, R-OPD-REF-2 | ★ |
| T-222 | Instancia lógica rotulada `Nombre : Clase`. | DEBE | ren | R-INS-3, R-OPD-ROT-4, spec-OPL §2.6, DR-8 | |
| T-223 | Marcas textuales limitadas a la tabla de reglas §3.9; vocabulario visual cerrado. | DEBE | ren | R-MARCA-1, R-VIS-PRIM-1, R-§23-OPD-VOCAB | ★ |
| T-224 | Anclaje al centro con recorte en el perímetro real; enlaces nunca sueltos. | inf. DEBE | ren | R-OPD-LAY-5 | ★ |
| T-225 | Routing: procedimentales rectos, estructurales ortogonales, invocación con rayo. | inf. | ren | R-OPD-LAY-4 | |
| T-226 | Posiciones por defecto: objeto arriba/proceso abajo; todo arriba/partes abajo. | DEBERÍA | ren | R-OPD-LAY-9 | |
| T-227 | Canal UI reservado (crimson + grises) para handles, halos, selección, feedback; handles no idénticos a piruletas; la selección no redibuja el borde semántico. | DEBE / PROHIBIDO / NO DEBE | ren | R-OPD-UI-1/2/5, R-DEC-2/2A, AP-24, R-OPD-CAN-3 | ★ |
| T-228 | Canvas limpio: la validación vive en el panel, sin marcas persistentes en el OPD. | DEBE | ren | R-OPD-VAL-1, R-VIS-VAL-1 | ★ |
| T-229 | Grid opcional de edición, suprimida en export; snap transparente; smart-guides sin el dash de afiliación. | DEBE / NO DEBE | ren | R-LAY-3, R-OPD-LAY-3, R-OPD-UI-6 | |
| T-230 | Cinco modos visuales distinguibles (estático-exportable, edición, navegación, gestión-modal, runtime vacío declarado). | DEBE | ren | R-OPD-CAN-5, R-VIS-MODO-1 | |
| T-231 | Al cambiar de OPD, centrar el bbox real del contenido. | DEBE | int | R-OPD-LAY-10 | |

### 9.9 Interacción bimodal

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-240 | OPL visible y actualizado inmediatamente tras cada edición gráfica. | inf. DEBE | int | método A8.1, R-BI-0A | ★ |
| T-241 | Panel OPL en bloques rotulados por OPD, con sangría por profundidad. | DEBE | int | R-OPL-PANEL-1/2 | ★ |
| T-242 | Hover bidireccional OPD↔OPL por referencia tipada, nunca por coincidencia textual; resaltado entrante `paperWarm`. | DEBE / NUNCA | int | R-OPL-INT-3, R-OPD-INT-1/3 | ★ |
| T-243 | Clic en token OPL navega y enfoca el elemento sin mutar el modelo. | DEBE / NO DEBE | int | R-OPL-INT-4, R-OPD-INT-2 | ★ |
| T-244 | Filtrar el panel por la selección activa (enlace antes que entidad; sin selección, todo). | DEBE | int | R-OPL-INT-5, R-OPD-INT-2 | |
| T-245 | Hover/clic sobre un sub-span resuelve el hecho de ese sub-span. | DEBE | int | R-OPL-INT-6, R-COMP-MAESTRA-3 | |
| T-246 | Numeración on/off solo de display. | DEBE / NO DEBE | int | R-OPL-PANEL-3, R-OPL-CFG-4 | |
| T-247 | Panel minimizable; restaurar sin pérdida; DEBERÍA detener el render minimizado. | DEBE / DEBERÍA | int | R-OPL-PANEL-6 | |
| T-248 | Mover una cosa entre OPDs preserva identidad y solo cambia apariencias. | DEBE | ope | R-EDIT-4, R-OPD-EDIT-3 | ★ |
| T-249 | Cambios en canales semánticos cambian hecho y OPL; cambios ornamentales no. | DEBE / NO DEBE | ope | R-EDIT-6/7, R-OPD-EDIT-2, R-OPD-BIM-3 | ★ |
| T-250 | Reanclar extremos de enlaces estructurales fundamentales (compuesto triangular). | DEBE | ope | R-OPD-EDIT-7 | |
| T-251 | Distinguir «quitar de este OPD» de «eliminar del modelo». | NO DEBE (confundir) | ope | R-VIS-APP-1 | ★ |
| T-252 | Operaciones mínimas del canvas de §5.7 (crear/nombrar cosas, estados, designaciones, enlaces con control/etiqueta, abanicos, refinar, reordenar bandas, navegar árbol, traer cosa existente). | inf. DEBE | ope | reglas §8, spec-OPD §15, método §9.15 | ★ |
| T-253 | Feedback de destinos válidos/inválidos en modo enlace, en canal UI. | DEBE | int | R-OPD-UI-5 | |
| T-254 | Ningún gesto de la UI se presenta como validación humana del modelo. | inf. NO DEBE | int | método A1.5-f, R-CAN-BOCETO-4 | |

### 9.10 Validación y diagnóstico

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-260 | Validador integrado que cubre firma, clases, aciclicidad, refinamiento, contexto y consistencia OPD↔OPL. | inf. DEBE | adv | R-CONF-3/5, método A8.1 | ★ |
| T-261 | Diagnóstico con código, regla, severidad (error/warning/info ≙ CRÍTICA/ALTA-MEDIA/BAJA), familia (gramatical, metodológica, identidad, contención, sugerencia), acción canónica y refs. | inf. DEBE | adv | R-OPD-VAL-2, método A8.1, R-AP-0B/0C, DR-40 | ★ |
| T-262 | Validadores sobre el modelo, nunca sobre el OPL; advertir cosas sin apariencia. | inf. DEBE | adv | método A8.2 | |
| T-263 | Advertir proceso sin consumo, resultado ni efecto (habilitadores no cuentan; los transformadores heredados del general sí, DR-43). | DEBE | adv | R-PROC-2, R-OPD-TR-8, R-HER-1, R-VIS-HER-1 | ★ |
| T-264 | Advertir subproceso sin transformado. | invariante | adv | método A3.1/A8.2 | |
| T-265 | Advertir 21–25 cosas en un OPD. | DEBE | adv | R-LAY-1, R-OPD-LAY-2 | ★ |
| T-266 | Advertencias léxicas: objeto no singular / plural sin `Conjunto`/`Grupo`; proceso no deverbal o fuera de 2–4 palabras; estado no descriptivo; etiqueta estructural no minúscula. | DEBE | adv | R-NOM-OBJ-1/2, R-NOM-PROC-1..3, R-NOM-EST-1, R-OPL-SE-1 | |
| T-267 | Advertir mezcla de infinitivo y nominalización en un modelo; nunca forzar el infinitivo. | DEBERÍA / NO DEBE | adv | método A2.3, R-OPL-EQ-4 | |
| T-268 | Advertir manejador de excepción no ambiental. | DEBE | adv | R-EXC-1A, R-EXC-AMBIENTAL-1 | ★ |
| T-269 | Impedir el rayo entre hermanos que repite una transición de banda adyacente (doble vara); si surge por reordenamiento, error estructural recuperable. | NO DEBE | imp | R-INV-2B, R-INV-2D, R-OPD-INV-9, reglas l.117 | |
| T-271 | Advertir estado de objeto de flujo sin escritor (excepciones LF-19); nunca bloquear. | DEBERÍA / NO DEBE | adv | LF-19 | |
| T-272 | Reportar objeto transiente (exactamente un resultado y un consumo, nada más). | DEBE reportarse | adv | AP-26 | |

### 9.11 Export, import e intercambio

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-280 | Perfil `canon-diagrama` por OPD (SVG): gramática visible sin UI, grid, overlays, validación ni sombras decorativas; rótulos negros; estilado normalizado; viewport ajustado sin recortes. | DEBE | exp | R-VIS-EXP-2..4, R-OPD-CAN-1/2, R-OPD-EXP-1/3, R-OPD-LAY-8, R-VIS-EXPORT-1A/1D | ★ |
| T-281 | Perfil `canon-documento` por modelo: por OPD en orden del árbol, su diagrama y su párrafo OPL. | DEBE | exp | R-VIS-EXP-2, R-OPD-CAN-1, R-OPD-EXP-1 | ★ |
| T-282 | Export del OPL completo en Markdown canónico. | DEBE | exp | R-OPL-TYPO-1, R-OPL-TOTAL-1 | ★ |
| T-283 | Gates del export canónico: >25 cosas, refinamiento con <2 hijos, errores estructurales abiertos (y Bocetos en régimen Modelo si existen); sin bloquear la edición. | DEBE | exp | R-LAY-1, R-REF-NTRIV-3, AP-13, R-ESC-OP-4, R-CAN-BOCETO-2 | ★ |
| T-284 | Advertencia de cruces/oclusión al exportar. | DEBE | exp | R-LAY-2, R-OPD-LAY-1 | |
| T-285 | Export parcial declarado como tal; recursos dependientes embebidos, referenciados o declarados ausentes. | inf. DEBE | exp | R-OPD-EXP-2, R-VIS-EXPORT-1B | |
| T-286 | Intercambio JSON `{ "formato": "deep-opm-pro.modelo.v0", "modelo": {...} }` con el núcleo del Apéndice F; no emitir otro `formato`; export = instantánea. | inf. DEBE / NO DEBE | exp | método Apéndice F, DR-41 | ★ |
| T-287 | Import JSON: rechazar referencias inconsistentes; normalizar opcionales; nombres idénticos entre OPD, OPL y JSON. | inf. DEBE | exp | método Apéndice F | ★ |
| T-288 | Import con violaciones canónicas: cargar como errores estructurales recuperables visibles que bloquean el export canónico; nunca persistirlas como canónicas. | DEBE / NO DEBE | exp | R-ESC-OP-4, R-EDIT-8, R-AP-0 | |
| T-289 | Referencias a OPDs siempre por id persistente. | DEBE | exp | R-IDP-3, AP-17 | ★ |

### 9.12 Verificación

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-300 | Tests de plantillas del generador y de vocabulario cerrado. | inf. DEBE | ver | spec-OPL §22 | ★ |
| T-301 | Suite de roundtrip bisimétrico desde modelo vacío con fixtures por fila de la tabla 9.2, escisión y abanicos. | EXIGE | ver | R-§19-SIM-3, R-BI-TAB-1 | ★ |
| T-302 | Leyes safe-lens ejecutables: no borrar por ausencia, preview puro, preservación de hechos, `unsupported-canonical` sin mutación. | inf. DEBE | ver | spec-OPL §22, R-§19-LENS-1..3 | ★ |
| T-303 | Checklist de cierre del Anexo A de reglas usado como gate de cambios de modelado, parser, generador, import/export y render. | DEBE | ver | R-ANEXO-CHECK-1 | ★ |
| T-304 | Tests de topología de marcadores y del kernel de refinamiento/distribución; smoke e2e de interacción y canvas (§24). El ejemplo «Lavar Platos» (spec-OPD Apéndice B) es ilustrativo, no fixture obligatorio (y difiere de DR-13 en la distribución del instrumento). | inf. DEBE | ver | spec-OPD §24, Apéndice B | |
| T-305 | Una captura de edición/navegación/modal no se acepta como evidencia de canonicidad. | NO DEBE | ver | R-OPD-CAN-4, R-VIS-EXP-6 | |

### 9.13 Capacidades opcionales (PUEDE) y solo-si-existen

| ID | Requisito | Oblig. | Tipo | Fuente | ★ |
|---|---|---|---|---|---|
| T-320 | Bocetos y régimen Apunte/Modelo; si existen: integridad constante, Integrar ≠ Graduar, Devolver preserva id, hechos y subárbol, Bocetos bloquean export en Modelo, placeholders emiten OPL en Apunte. | PUEDE (DEBE internos) | ope | R-OPD-REF-20, R-CAN-BOCETO-1..4, R-ENT-2-APUNTE, método A1.5 | |
| T-321 | Coaccionar a informacional un objeto al volverlo atributo. | PUEDE | ope | método F | |
| T-322 | Durante el arrastre, marca transitoria de enlace inválido (fuera de canon). | PUEDE | ren | R-OPD-VAL-3 | |
| T-323 | Simulación: si existe, R-EJEC-7..10, R-OPD-SIM-1..7 y F.2 son DEBE, en canal propio no persistente. | DEBE si existe | ope | reglas §2.8, spec-OPD §20, método F.2 | |
| T-324 | Extensiones de §0.4 (Pr, m-de-f, negación, demora, tipos, rangos, estereotipos, sub-modelos, vistas, semi-plegado, composición eje a): si se implementan, rigen sus reglas y su generador + parser juntos (nunca emisión-only). | PUEDE | gob | §0.4, R-§19-ROT-1 | |

---

## 10. Gaps y contradicciones del canon, y su resolución más simple conforme

Criterio de resolución: (1) precedencia del canon (§0.3); (2) si el canon no decide, la opción más simple que no viole ningún DEBE y no invente prohibiciones; (3) si persiste la ambigüedad semántica, **diferir** la construcción (no ofrecerla; parser `unsupported-canonical`; registro de conformidad) y pedir decisión al dueño.

### 10.1 Decisiones de resolución (DR)

| DR | Gap / contradicción | Fuentes en tensión | Resolución |
|---|---|---|---|
| DR-1 | La EBNF «formal completa» vive en `SSOT-opl Apéndice A` (fuera del canon). La única EBNF entregada (spec-OPL §18) dice cubrir todo pero omite producciones de plantillas canónicas (abanicos de habilitadores e invocación, fan de estados sin entrada común, fan bajo evento, `Pr`, `después de`, negadas, `es valor`, D10, CX4, `es afectado por`, `es manejado por`, condición con estado sobre efecto) y tiene defectos (ver DR-33). No define si el parser recibe texto con marcas. | R-OPL-EBNF-1/2, R-IMPORT-1, spec-OPL §18, opl-c §13 A/B/C/R | Gramática del producto = **tablas de plantillas** de §4.4 (validez, reglas manda) + EBNF §18 como base léxica y estructural, corregida (DR-33). Entrada = Markdown con marcas; las marcas delimitan identificadores. Parser por esqueletos (§4.10). El subconjunto soportado se declara (T-151). |
| DR-2 | Emisión de esencia/afiliación: reglas tabla 9.2 manda `**Cosa** es física.` y no emitir el default; spec-OPL R-ENT-3 exige la oración combinada y R-OPL-CFG-1/2 un canónico `siempre`. | R-BI-TAB-1 vs R-ENT-3, R-OPL-CFG-1/2, §13 | Desempate reglas l.41: canónico emite **D1/D3 atómicas solo si difieren del default**; D2/D4 no se emiten. Parser acepta D1–D4 y la combinada; ausencia ⇒ default. Los tres modos de visibilidad operan solo en display (`siempre` añade D2 informacional en el panel). |
| DR-3 | Perseverancia: «No hay otras opciones» vs procesos persistentes, D11/D12. | R-COSA-2, R-OBJ-3 vs R-PROC-2A/5..7, D11/D12 | Sin campo: derivada del tipo. D11/D12 nunca se emiten; al parsear, coherentes ⇒ `sin-cambio`, incoherentes ⇒ `non-canonical`. Proceso persistente = patrón TS3 entrada = salida (R-OPL-PERSIST-2). |
| DR-4 | Numeración y posición de OPDs no fijadas (orden de hermanos; Bocetos fuera del árbol). | R-IDP-1/1A, R-OPL-TOTAL-1, GAP-11 reglas-b | Etiquetas por preorden con hermanos en orden de creación; si existieran Bocetos, sus bloques van tras el árbol. |
| DR-5 | Agente «EXCLUSIVAMENTE humanos» (AP-05 DEBE bloquearse) sin dato «humano» en el modelo. | R-AG-1, AP-05, GAP-OPD-AGENTE-HUMANO, método F | Proxy declarado del propio canon: agente **solo desde objeto físico** (bloqueo); la humanidad queda como advertencia metodológica recordatoria. Sin campo nuevo. |
| DR-6 | Unicidad de rol vs abanicos por estado y TS3. | R-ROL-UNIC-1, R-OPD-HAB-4, R-OPD-TR-5 vs R-OPD-CTL-11, R-FAN-5A, TS3 | Un enlace procedimental por par (objeto, proceso); TS3 es **un** enlace con dos estados; excepción: ramas de un mismo abanico. |
| DR-7 | TS4/TS5 escindido vs standalone comparten superficie; «el régimen se determina por procedencia»; spec-OPL «aún no exige un metadato normativo». | R-ESCIND-0, GAP-PROCEDENCIA-ESCIND, GAP-05 | Campo `escision {parId, mitad}` persistido en JSON; OPL parseado ⇒ standalone; al reparsear sobre el modelo existente el enlace es `sin-cambio` y conserva el metadato (R-IMPORT-8). Borrar una mitad deja la otra como standalone (diagnóstico info). Brecha declarada (R-§19-ROT-1). |
| DR-8 | Léxico estrecho vs nombres con alias `(…)`, `{…}`, `[u]`, `Instancia : Clase`. | R-OPL-LEX-2, R-§18-LEX-1 vs R-ROT-4, R-INS-3, R-OPL-10, R-OPD-ROT-2/4 | Nombres restringidos al léxico EBNF (bloqueo). Alias y unidades no se soportan (§0.4). `Nombre : Clase` es rótulo derivado del enlace de clasificación, no parte del nombre. |
| DR-9 | Abanicos de habilitadores: spec-OPD «agente e instrumento solo admiten divergente» vs reglas R-FAN-HAB-1 (convergentes canónicos, AND por defecto) y §7.2/§7.3; «extremo convergente» indefinido en divergentes. | R-OPD-CTL-7 vs R-FAN-HAB-1, R-FAN-GEO-1/2 | Reglas manda: XOR/OR en ambas direcciones para agente/instrumento; AND = enlaces planos. Arco en el **extremo común** (definición del glosario de spec-OPD). |
| DR-10 | Especialización XOR: plantillas RX1/RX2 ponen al especial como sujeto y a generales exclusivos; los ejemplos «Correcto» ponen al general como sujeto con especializaciones. | reglas §4.10 RX1/RX2 vs spec-OPL R-VERB-EST-2, R-EST-GEN-1, §6.3 | Semántica irresuelta: **diferir** (no se ofrece; parser `unsupported-canonical`; registro). Pedir decisión al dueño. |
| DR-11 | Placeholders: R-ENT-2 prohíbe emitir OPL para nombres placeholder; solo se enumeran los de proceso; GAP-PLACEHOLDER-OBJETO. | R-ENT-2, GAP-A15 | La cosa/estado nace con nombre (edición inline al crear; si se cancela, no se crea). Placeholder = «marcador de span pendiente … sin nombre» (spec-OPL Definiciones): sin cosas sin nombre no hay placeholders; los nombres que escribe el usuario no se filtran por patrón (la lista `Objeto`/`Proceso N` es heurística de v0). R-ENT-2 queda vacío por construcción; R-ENT-2-APUNTE solo aplica si hay régimen Apunte (no ofrecido). |
| DR-12 | Plural «por multiplicidad» (`*Proceso* consumen **Objetos**`, `*Procesos* generan …`) incoherente y contrario a R-MULT-1A; la EBNF mantiene verbos en singular. Género sin campo. | spec-OPL §3/§4, R-MULT-COMB-1 vs R-MULT-1A, EBNF A.5 | Nunca verbos en plural; la multiplicidad es frase antepuesta al objeto (EBNF). Formas plurales ⇒ `unsupported-canonical`. Género: campo opcional `genero: 'f'` (default masculino, R-OPL-1). |
| DR-13 | Enlaces del padre tras descomponer: «permitido al contorno = a todos» vs «procedimentales al contenedor NO visibles directamente (se distribuyen)»; identidad del hecho a través de la migración; vista del padre. | reglas §8.5, R-OPD-REF-6/11, R-VIS-HIJO-1, R-OPD-OP-4, R-OPL-DISP-3 | Un solo hecho por enlace: agente, instrumento y efecto sin estado quedan en el **contorno** con lectura distributiva (sin copias); consumo, resultado, evento sistémico y TS3 migran (mismo id) o se escinden. La vista del OPD padre se **deriva** abstrayendo extremos internos al contenedor (§3.5). |
| DR-14 | La tabla de distribución no cubre invocación ni excepción del proceso descompuesto (R-HIJO-2 «cuando la regla de copia lo exija»). | GAP-29 reglas-b | Permanecen en el contorno; sin migración. |
| DR-15 | LF-03 (punto 6) escribe la visibilidad como «`Estado.suprimido` global **∧** local (global domina, local refina)», ambiguo; R-OPD-EST-8 la escribe bien: «visibilidad efectiva = ¬suprimido-global ∧ ¬suprimido-local» (≡ oculto ⇔ global ∨ local). R-VIS-SUPR-1 / R-OPD-EST-10 dicen «estados no referenciados NO se suprimen» (probable errata frente a LF-03/A3.6); supresión computada «solo en descomposición»; estatus del chip `⋯N` condicional. | LF-03, R-VIS-SUPR-1, R-OPD-EST-8/9/10, C-09 | Oculto ⇔ global ∨ local. Un estado enlazado en un OPD no se suprime ahí (LF-03). Sin supresión computada automática: la decide el modelador por OPD. El chip `⋯N` persiste en `canon-diagrama` (indicador normativo de reglas §3.10) y el OPL usa D6. |
| DR-16 | Firma de frontera: checker «pasivo» sin definición computable. | R-OPD-REF-10, método A0.4a, GAP-16 | Con la vista del padre derivada del hijo, la frontera se preserva por construcción. Como R-ANEXO-CAT-0 exige que cada regla del Anexo C sea «ejecutable por una ley o checker verificable», se realiza como ley de test (firma de roles netos `entidad|tipoEnlace|rol` del contenedor en el padre = del hijo) y se identifica en el registro. |
| DR-17 | Recomposición (out-zoom) canónica pero COND; «Eliminar refinamiento» destructivo; borrado con subárbol. | R-OPD-OP-2, método A1.5-d, GAP-21 | Solo se elimina un refinamiento cuyo OPD hijo es hoja. La confirmación lista lo que se pierde y PUEDE materializar en el padre la vista abstraída (recomposición simple); los conflictos R-PREC-3 se muestran para decisión del modelador. |
| DR-18 | Unidades de duración en inglés (`ms, sec, min…`) en canon es-CL; R-OPD-INV-6 dice que ese enum «fija solo la superficie visual» y delega la textual a spec-OPL §5.3, cuyos ejemplos normativos usan palabras es-CL (`excede 5 minutos`, `es menor que 30 segundos`) sin tabla de mapeo; EBNF fija el literal `unidades-tiempo` mientras §5.3 lo declara metavariable. | R-OPD-INV-6, spec-OPL §5.3, EBNF A.5, C-11 | OPD: token del enum (`[min]`). OPL: `<valor> <palabra es-CL>` con mapeo fijo mínimo `ms`→milisegundos, `sec`→segundos, `min`→minutos, `hour`→horas, `day`→días, `week`→semanas, `month`→meses, `year`→años (singular si el valor es 1). `unidades-tiempo` = metavariable; la EBNF se corrige así. Sin cota: frase de respaldo (R-EXC-DUR-1). El mapeo exacto es decisión pendiente menor del dueño (§10.3). |
| DR-19 | Ruta: canónica sobre toda oración procedimental (A.5) pero «restricción de producto» a consumo/resultado; ¿qué hace el parser con ruta sobre habilitadores? | R-OPL-RUTA-3, C-25, GAP-08 | Se mantiene la restricción declarada: ruta solo en consumo/resultado; otras ⇒ `unsupported-canonical`. |
| DR-20 | Valores de atributo: plantilla propia `**Atributo** de **Objeto** puede estar …` y D5 genérico. | reglas §4.13 vs D5 | Generador usa D5 (el atributo es un objeto); parser acepta ambas (la forma «de **Objeto**» crea la exhibición si falta). |
| DR-21 | Multiplicidad: `*` → `opcional (cero o más)` no es derivable de la EBNF; rangos, intervalos y parámetros sin plantilla en prosa (GAP-RANGO-TEXTUAL); R-MULT-1 excluye exhibición pero RF2o la usa. | spec-OPL §10.1/§10.2 vs EBNF A.2, R-MULT-1 vs RF2o | Solo `?`, `*`, `+` y default, con las frases de §10.1 (el parser acepta `opcional (cero o más)` como plantilla). Todo lo demás, y la exhibición opcional, ⇒ `unsupported-canonical`. |
| DR-22 | Unicidad nominal vs `referencia-ambigua` («más de una entidad con ese nombre») y «homónimos → cosas separadas». | método §9.15, R-OPL-FALLO-4, R-OPD-ROT-5 | Nombre único en todo el modelo (objetos y procesos); la ambigüedad es imposible; un cambio de tipo por OPL cae en R-IMPORT-7. |
| DR-23 | Descomposición de objeto: DEBE (R-OPL-CX-4) pero la EBNF le exige `, en esa secuencia`, contra «la posición NO es tiempo». | EBNF A.10 vs R-OPD-REF-2, R-CX-DESP-2, método A3.3 | Escalonable: se declara en el registro (las partes se modelan por despliegue de agregación). Si se implementa, sin marca temporal (corrige la EBNF). |
| DR-24 | CX1 (sin OPDs) es plantilla-gate, pero R-OPL-CX-2/3 exigen declarar OPD padre/hijo en refinamiento en OPD nuevo; CX3 lleva etiqueta; spec-OPL emite con verbo de relación. | reglas §4.11, 9.2 vs R-OPL-CX-2/3, spec-OPL §7.2, GAP-A07 | Refinamiento siempre en OPD nuevo. Descomposición: CX1/CX2/mixta dentro del bloque del OPD hijo (el bloque declara OPD y padre). Despliegue: CX3 con la etiqueta del hijo; los enlaces del refinador van además en oraciones atómicas (R-CX-COMP-1). El parser acepta además las formas `desde SDp … en SDh en …` y `se despliega en` sin etiqueta. |
| DR-25 | Cosa duplicada en el mismo OPD (silueta) sin soporte en v0. | reglas §3.10, GAP-OPD-DUPLICADO | No se ofrece: ≤1 apariencia por (cosa, OPD). |
| DR-26 | Alternancia `e/u`: «e ante `i-` o `hi-`» aplicado literal da «e hielo»; «condición fonética». | R-OPL-KW-2, GAP-07 | Regla fonética: `e` ante sonido /i/ (`i-`, `hi-` + consonante; no `hie-`, `hia-`), `u` ante /o/ (`o-`, `ho-`). |
| DR-27 | «Enum cerrado» de verbos y conectores omite palabras que las plantillas usan (`está en`, `es afectado por`, `paralelo`, `que`, `a sí mismo`, `en cualquier estado`, `y otros estados`…). | spec-OPL §1, GAP-A03, G8 | Vocabulario cerrado = unión de las palabras fijas de las plantillas soportadas (§4.2). |
| DR-28 | Referencias tipadas cerradas a `entidad/enlace/estado`, pero `SDx.y` debe anclar al OPD persistente y la ruta a una «ruta nombrada». | R-OPL-INT-1 vs R-CX-2, R-OPL-RUTA-2, G15 | Tipos de ref: `entidad`, `enlace`, `estado`, `opd`. La ruta referencia su enlace. |
| DR-29 | Condición con estado sobre efecto sin cambio (`… está en `s`, en cuyo caso *P* afecta …`) usada en el Apéndice A sin plantilla ni producción. | spec-OPL Apéndice A, EBNF A.6 | No existe: la condición con estado sobre efecto usa CS2–CS4; la otra forma ⇒ `non-canonical`. |
| DR-30 | Fan de estados: R-FAN-5 realiza con `cambia` también fans de consumo/resultado (irreversible: se pierde el rol); reglas §7.5 usa la plantilla genérica con `**Obj** en `s``. | R-FAN-5 vs reglas §7.3/§7.5, G7 | Consumo/resultado: plantilla genérica de §7.3 con ramas `**Obj** en `s``. Efecto: R-FAN-5 / R-FAN-5A. |
| DR-31 | Fan con control mixto sin realización; fan×control fuera de efecto sin plantilla (C-19b); voz de la rama positiva en C-18 vs R-COND-RAMA-2. | spec-OPL §8.4, R-FAN-3, C-18, G5/G6 | Control uniforme por abanico; mixto ⇒ `non-canonical`. Solo se ofrecen las combinaciones con plantilla (C-18, reglas §7.4, R-FAN-4), usadas literalmente (lo específico manda sobre R-COND-RAMA-2). |
| DR-32 | Orden de oraciones solo «determinista y estable»; agrupación eje (b) vs zona prohibida en «OPD hijo de refinamiento». | R-COMP-ELEG-3, R-COMP-EJE-3 vs R-CX-COMP-2, GAP-A19 | Algoritmo de §4.5: agrupación eje (b) en OPDs no hijos; atómico en hijos, con la oración de refinamiento coexistiendo. |
| DR-33 | Defectos de la EBNF: precedencia `,`/`\|` (`nombre_singular_de_*`, `tipo_numerico`); herencia múltiple con doble espacio y sin comas; listas sin `e`/`u` y con conector final opcional; listas de partes con ≥2 obligatorias (canon usa `**Todo** consta de **Parte**.`); orden `, en esa secuencia` vs `, así como`; `es físico` no derivable; `oracion_de_ruta` y sufijo inalcanzables; compuesta con sujeto objeto. | opl-c §13 C–J, R–S | Se corrige en favor de las plantillas: agrupar alternativas entre paréntesis; RH1 literal (`es un **G1** y un **G2**`); conectores `y/e/o/u` obligatorios antes del último; listas de un elemento válidas; orden `…, en esa secuencia, así como …` (EBNF) aceptado; solo `es física` (femenino) en atómicas, masculino solo en la combinada; `Por ruta` alcanzable como prefijo de consumo/resultado; compuestas no soportadas. |
| DR-34 | Dos códigos para lo mismo: `unsupported-canonical` (reglas R-IMPORT-5) y `unsupported-kernel` (spec-OPL R-§19-SIM-2). | R-IMPORT-5 vs R-§19-SIM-2 | Reglas manda: código `unsupported-canonical` (severidad warning, sin mutación); `unsupported-kernel` se documenta como sinónimo. |
| DR-35 | Reverse de `se descompone en`: spec-OPL crea el refinamiento con hijo vacío y NO crea miembros, contra R-BI-DUAL-1/R-BI-0B («toda oración OPL DEBE ser representable como constructo OPD»). | spec-OPL §7.1/§20.1 vs reglas §9.1, §10.1 | Reglas manda: crear los subprocesos inexistentes dentro del OPD hijo y fijar las bandas; un nombre que ya existe fuera de esa descomposición ⇒ rechazo (ambigüedad de alcance, R-ESC-OP-3). |
| DR-36 | Etiquetados sin estrategia de parseo (GAP-TAG-PARSER) con un verbo libre y enum cerrado. | spec-OPL §6.5, GAP-A08 | Esqueleto residual `**A** <frase_no_capitalizada> **B**.` (y con *procesos*) ⇒ SE1, solo si no calza con otro esqueleto. |
| DR-37 | Glifo `Current` declarado: canon = pin externo; v0 = `●` interno (GAP-OPD-CURRENT-GLIFO); default: flecha abierta entrante vs `↗`. | R-EST-2, R-OPD-EST-6/7, §18.3 | Implementar la marca canónica desde el inicio (pin externo; flecha diagonal abierta entrante). |
| DR-38 | Excepción sin marcador de extremo definido; sin regla de abanico. | spec-OPD §6.2/§18.3, C-18 opd | Línea recta con `/` o `//` cerca del manejador, sin punta adicional; sin abanicos de excepción. |
| DR-39 | Partial-parse vs fail-fast; atomicidad no definida. | R-OPL-FALLO-2/7, G22 | Las líneas `aplicable` se aplican juntas, todo o nada, sobre una copia del modelo; ante el primer fallo se aborta sin cambios y se reporta. |
| DR-40 | Tres taxonomías de severidad: reglas (bloqueo, advertencia, mejora metodológica, vista/UI, extensión pendiente), spec-OPD (5 familias), método (CRÍTICA/ALTA-MEDIA/BAJA), spec-OPL (error/warning/info). | reglas Definiciones, R-OPD-VAL-2, método A8.1, R-OPL-FALLO-1 | Un solo registro de diagnóstico con `severidad` (error/warning/info ≙ CRÍTICA/ALTA-MEDIA/BAJA) y `familia` (5 de spec-OPD); «vista/UI» y «extensión pendiente» se expresan como `info` con familia `sugerencia` o en el registro. |
| DR-41 | El bundle del Apéndice F carece de campos para control, abanicos, rutas, orden en bandas, multiplicidad de origen, duración, régimen; `apariciones` vs `apariencias`; `opds.enlaces` ambiguo. | método F, GAP-6/6b | Se conserva el núcleo con sus nombres y se agregan campos opcionales (§1.2) como extensión declarada; `opds[].apariencias` y `opds[].enlaces` se escriben como listas derivadas. |
| DR-42 | Bocetos/régimen: DEBE en reglas (R-CAN-BOCETO-*) pero extensión declarada PUEDE en spec-OPD; términos definidos solo en el método; campo `padreId` como detalle de implementación. | R-CAN-BOCETO-1..4 vs R-OPD-REF-20, método A1.5, GAP-10 reglas-b | Fuera del núcleo (PUEDE). Sin Bocetos: todo OPD no raíz es hijo de refinamiento; el régimen es siempre riguroso. Sus DEBE internos aplican solo si se implementa. |
| DR-43 | Herencia no materializada (R-HER-8, AP-29) pero «DEBE aplicarse aunque los enlaces heredados no se dibujen» (R-VIS-HER-1, R-OPD-STR-6). R-HER-1 hereda partes, rasgos, etiquetados y procedimentales (no estados); método §9.9 añade «y estados». Sin cálculo de herencia, los validadores sobre-acusan (proceso especializado «sin transformación»; efecto a especialización «sin estados»), contra R-AP-0C. | R-HER-1/8, R-VIS-HER-1, R-OPD-STR-6 vs R-PROC-2, R-EFE-1, método §9.9 | Sin materializar nada: los validadores R-PROC-2 (T-263) y R-EFE-1 (T-044) consultan también la cadena de generales (transitiva, herencia múltiple incluida). Estados heredados solo cuentan para R-EFE-1 en efecto básico T3 (el método los hereda; negarlo sería prohibir sin contradicción explícita); el anclaje a estado (TS\*, HS\*, SSE\*) se limita a estados propios del objeto. No se emite OPL ni se dibuja lo heredado. |
| DR-44 | Multiplicidad sin hueco textual: R-COMB-6 dice que la multiplicidad «PUEDE combinarse con cualquier … modificador admisible», pero las producciones de condición (A.6) y el todo de la agregación (A.9) no admiten `restriccion_de_participacion`; el único camino del todo es el plural «por multiplicidad» (rechazado, DR-12). | R-COMB-6, R-MULT-COMB-1 vs EBNF A.6/A.9, DR-12 | No se ofrecen multiplicidad + `c` ni multiplicidad en el todo; si llegan por OPL/JSON ⇒ `unsupported-canonical` y registro (R-CONF-7). Evento sí la admite (A.5). |
| DR-45 | Rastreo de refinadores: reglas R-OPD-OP-5 lo hace PUEDE («si lo hace, DEBE conservar trazabilidad de cada ajuste automático»); spec-OPD R-OPD-EDIT-6 lo hace DEBE. | R-OPD-OP-5 vs R-OPD-EDIT-6 | Se implementa (satisface ambas) y cada ajuste automático deja traza (diagnóstico `info` con la regla y el refinable afectados). |

### 10.2 Otras tensiones registradas (sin decisión adicional necesaria)

| Tema | Fuente | Tratamiento |
|---|---|---|
| Orden temporal por Y (R-INV-2, R-OPD-INV-2 «con tolerancia» no cuantificada) vs orden declarado (R-INV-2D, R-IDP-0A). | CONTRA-02, C-10, GAP-12 | Bandas declaradas; la Y se deriva (T-030). Sin tolerancia. |
| `monoespaciado` sobrecargado: estados y `diagrama` (CX7/CX8). | CONTRA-03 | CX7/CX8 no soportados; no hay colisión. |
| `es valor` con «ser» mientras los valores son estados (`estar`). | CONTRA-04 | `valorSlot` no es estado; plantilla literal. |
| Simulación dentro del canon pese a R-DOC-4C. | CONTRA-06 | Excluida (§0.4). |
| Contorno «grueso» en dos canales (estado inicial y cosa refinada). | GAP-10 reglas-a | Canales distintos (rountangle vs cosa); sin conflicto. |
| EX1 en tabla 9.2 sin `unidades-tiempo`. | GAP-3 reglas-b | DR-18. |
| 1/n como hecho de modelo (§7.5) vs regla de simulación (§6.8). | GAP-8 reglas-b | Sin probabilidades en el producto. |
| «Probabilístico sin pesos» sin plantilla ni marca. | GAP-9 reglas-b | `Pr` no ofrecido. |
| SD con un proceso sistémico: ¿edición o cierre? | GAP-13 reglas-b | Advertencia (T-090), sin bloqueo. |
| AP sin regla primaria o no detectables (AP-14, AP-22, AP-25). | GAP-15 reglas-b | Método / advertencia; no bloqueo mecánico. |
| «Placeholder de edición tipificado» indefinido. | GAP-16 reglas-b | Refinamiento con <2 hijos persiste normalmente con advertencia; bloquea export. |
| «Modelado de contingencia» del evento ambiental. | GAP-17 reglas-b, GAP-A16 | Sin exigencia adicional a la herramienta. |
| Parámetros de multiplicidad sin sintaxis. | GAP-18 reglas-b, G13 | No soportados (DR-21). |
| Tabla 9.2 omite construcciones canónicas (proceso ambiental, TS1/TS2/TS4/TS5, HS*, etc.). | GAP-19 reglas-b | El gate completo son las tablas de §4.4 (T-105). |
| «Semántica de control tipificada» para eventos OR / condiciones AND. | R-BR-2, GAP-21 reglas-b | Enlaces separados; semántica implícita (OR entre eventos, AND entre condiciones). Sin tipo nuevo. |
| Cambio de rol entre niveles vs precedencia al abstraer. | R-ROL-1, GAP-13 método | Neto cero no ofrecido (B-34); habilitador sobre transformación con cambio neto es R-ROL-3; al abstraer prevalece la fuerza (DEC33, T-053). |
| Gate «Firma» del Anexo A más estricto que el canon («un structural conecta estado» = falla). | GAP-23 reglas-b | SSE permitidos según §4.4.7. |
| «Replica layout» como falla del gate «Refinamiento». | GAP-24 reglas-b | Método (no mecánico). |
| `docs/HANDOFF.md` (R-APP-1) vs `AGENTS.md` (HANDOFF.md raíz único). | GAP-26 reglas-b | Rige AGENTS.md del repo; el registro de conformidad vive en `docs/` (circunstancial). |
| Formato del registro de conformidad no definido. | GAP-27 reglas-b | Tabla `regla · estado (R-APP-2) · superficies cubiertas (R-APP-3) · nota`. |
| Valores de atributo como rangos sin geometría. | GAP-28 reglas-b | Rangos no soportados. |
| `cambio-ya-presente` inalcanzable como no-aplicable. | G19 | Se usa `sin-cambio`. |
| Borrado desde OPL inexistente (asimetría). | G21 | Declarado (T-172, T-193). |
| Evidencia OPCloud elevada a DEBE (numeración, minimizar, hover en compuestas). | G17, S3 | Se cumple: son baratos (T-246/T-247). |
| Probabilidad descartada en reverse. | G4, P | `Pr` no ofrecido. |
| Apéndices A/B de spec-OPL con oraciones no derivables o mal modeladas (`es físico`, `requiere exactamente uno de …`, `*Aprobar* maneja *…*`, duplicación base + modificador). | opl-c §8.1/§9.1 | No sirven como fixtures literales; se reescriben conforme a §4.4. |
| Ejemplo «Lavar Platos»: el evento del usuario no está marcado. | G-12 opd | Fixture sin `e` en el agente. |
| Autocontención declarada de spec-OPD/spec-OPL vs delegaciones a reglas. | C-01, T opl-c | Resuelto dentro del canon de 4 documentos. |
| Frontmatter desactualizado, numeración de familias, huecos de IDs, versiones §23/§24, metadatos `legacy` vs `publicado`, «sincronizar con KORA v3.0.0». | C-03, GAP-03/11/12 reglas-a, GAP-30, T opl-c | Sin efecto en la herramienta. |
| Errata `solापamiento` (R-COMP-ELEG-4); referencia cruzada rota de GAP-FAN-M. | G26/G27 | Sin efecto. |
| Ejemplo «Lavado de Platos» (spec-OPD Apéndice B): «**Lavavajillas** (externo) distribuye su piruleta blanca a los tres» sugiere una piruleta por subproceso, mientras DR-13 deja un único instrumento en el contorno. | spec-OPD Apéndice B vs R-OPD-REF-11 | El ejemplo es ilustrativo; manda la lectura distributiva (R-OPD-REF-11). No se usa como fixture literal (T-304). |
| Exención del gate >25 cosas «salvo vista tipificada o refinamiento declarado» sin definición operativa de «refinamiento declarado»; spec-OPD §21 reconoce que v0 bloquea todo OPD >25. | R-LAY-1, R-OPD-LAY-2 | Sin vistas tipificadas en producto: se bloquea todo OPD >25 (conservador) y se declara la exención no realizada en el registro. |
| Bundle v0 «no acepta un único estado (≥2)» vs R-OBJ-2 (`s ≥ 1`). | método F vs reglas R-OBJ-2 | Manda reglas: se admite un único estado, sin advertencia (se retiró T-270). |
| Multiplicidad en fans: R-MULT-COMB-2 la realiza «por rama», pero las plantillas de abanico (reglas §7.3) no muestran hueco. | spec-OPL §8.2 vs reglas §7.3 | Se antepone la frase al sustantivo de la rama como en la oración base (EBNF `objeto_procedimental`); si la plantilla no lo admite (condición) rige DR-44. |

### 10.3 Decisiones pendientes del dueño (bloquean solo lo diferido)

1. Dirección y semántica de la especialización XOR (RX1/RX2) — DR-10.
2. Si la descomposición de objeto entra en la primera versión — DR-23.
3. Si se desea un dato explícito «humano» en lugar del proxy «físico» para agentes — DR-5.
4. Mapeo exacto de unidades de tiempo a palabras es-CL en OPL (singular/plural) — DR-18 (menor; hay mapeo por defecto).

---

## Correcciones de auditoría

Auditoría adversarial contra los 4 documentos fuente (recorridos sección por sección; EBNF de §4.8 verificada por `diff` contra spec-OPL §18: idéntica; plantillas de reglas §4.4–§4.11, §7.3, §7.4 y §9.2 verificadas por script: todas presentes salvo CM3, ya excluida). Cada fila indica el cambio hecho en este documento y su fuente (línea del `content.md` correspondiente).

| # | Tipo | Dónde (CANON) | Corrección | Fuente |
|---|---|---|---|---|
| A-01 | obligación mal asignada | §2.1 invocación, §3.2 R-INV-2B, §6.4, T-269 | El rayo «doble vara» entre bandas adyacentes pasaba como advertencia; es un NO DEBE que «viola R-INV-2B» ⇒ Prohibido ⇒ **impedir** (error estructural recuperable si surge por reordenamiento). T-269 pasa a tipo `imp`. | reglas l.806–808 (R-INV-2B/2D), l.117 (Prohibido); spec-OPD l.359 |
| A-02 | exigencia mal leída | §2.1 excepciones, §4.4.6, §6.4, T-047 | «Fuente sin cota ⇒ IMPEDIR» era más estricto que el canon y dejaba incoherente la frase de respaldo («solo parseo» creaba lo que el producto prohibía). R-EXC-2/3 «exige» = canónico condicionado ⇒ pedir el dato o advertir; la frase de respaldo se **emite y parsea** (R-EXC-DUR-1). | reglas l.115, l.864–865; spec-OPL l.862, l.866, l.884 |
| A-03 | plantilla no literal | §4.4.6 (EX1/EX2, nota), DR-18, T-115 | El ejemplo `excede 5 min` contradecía el ejemplo normativo `excede 5 minutos`; el enum `ms…year` «fija solo la superficie visual». OPL usa palabra es-CL; se añade mapeo mínimo y se registra como decisión menor pendiente (§10.3 punto 4). | spec-OPL l.859, l.876, l.3062; spec-OPD l.365 |
| A-04 | matriz errónea | §2.3 C-18 | Faltaba «instr»: C-18 es «consumo/efecto/instr × condición × XOR/OR (todas las ramas `c`, mismo tipo)». | spec-OPL l.1574 |
| A-05 | clasificación errónea | §2.2, §2.3 C-19b, T-056 | Combinaciones abanico×control **listadas como válidas** sin plantilla literal (C-19b, C-18 instrumento, agente por R-FAN-3) se trataban como no-canonizadas (R-COMB-1). Son canónicas no soportadas ⇒ `unsupported-canonical` (R-IMPORT-5). Condición/evento en fan de invocación o resultado: inválido (impedir), no «sin plantilla». | spec-OPL l.1444, l.1496, l.1574–1577; reglas l.1309 |
| A-06 | transcripción alterada | §2.3 C-21 | La fila decía «efecto × XOR»; el canon dice «consumo/resultado/efecto». Se restituye y se marca la restricción de producto DR-30. | spec-OPL l.1578 |
| A-07 | plantilla no literal | §4.4.8 R-FAN-5 | La plantilla de ramas solo-entrada es `… de exactamente uno de `s1`, `s2`.` (sin `o`) y con roles «(resultado/efecto saliente)» / «(consumo/efecto entrante)». Se transcribe literal y se documenta la conjunción final. | spec-OPL l.1505 |
| A-08 | plantilla no literal | §4.4.9 CX interno | Se añade la forma literal de spec-OPL §7.1 (`…, así como **ObjetoInterno**.`, sin `en esa secuencia`) junto al orden EBNF; el parser acepta ambos. | spec-OPL l.1217 |
| A-09 | DEBE omitido | §4.4.10, T-129 | Faltaba R-COMB-4 (orden de superficie estable `[Por ruta L,] … [Pr=p]`). | spec-OPL l.1456 |
| A-10 | DEBE omitido / transcripción | §3.5 R-VIS-HIJO-1 | Se omitía la cláusula «enlaces procedimentales al contenedor NO DEBEN verse directamente». Se transcribe y se declara que DR-13 es desvío consciente (registro). | reglas l.1460; spec-OPD l.404, l.423 |
| A-11 | DEBE omitido | §3.3, §6.4, T-087, DR-45 nueva | Faltaba R-OPD-OP-5: si la herramienta ajusta automáticamente símbolo/OPL, DEBE dejar traza de cada ajuste. Se registra la tensión PUEDE (reglas) vs DEBE (spec-OPD R-OPD-EDIT-6). | reglas l.1215; spec-OPD l.523 |
| A-12 | «más» (alcance excedido) | §5.7 R-OPD-EDIT-7, T-250, operaciones mínimas | «Reanclar extremos de un enlace, incluidos los estructurales» generalizaba. El DEBE es solo para **estructurales fundamentales**. | spec-OPD l.524 |
| A-13 | «más» (alcance excedido) | T-062, DR-11 | Se rechazaban nombres escritos por el usuario con patrón `Objeto N`/`Proceso N`. Placeholder = «span pendiente … sin nombre»; si toda cosa nace nombrada, R-ENT-2 se cumple por construcción; la lista de patrones es heurística de v0. | spec-OPL l.43, l.212, l.256, l.2774 |
| A-14 | «más» (alcance excedido) | T-270 (retirado), §6.4, §0.4, §10.2 | «Advertir objeto con un único estado» derivaba de «La app no acepta un único estado (≥2)» (limitación v0) y contradice R-OBJ-2 (`s ≥ 1`). Retirado. | método l.639; reglas l.169 |
| A-15 | matriz errónea | §2.1 generalización | «Estado opcional en ambos» permitía anclar a un solo extremo. R-OPL-RF-3/EBNF exigen **ninguno o ambos** (`lista_de_objetos_con_estado " son " objeto_con_estado`). | reglas l.616; spec-OPL EBNF A.9 |
| A-16 | matriz errónea / contradicción interna | §2.1 agregación, §1.2, T-057, DR-44 nueva | «Multiplicidad en ambos extremos» de agregación no tiene realización OPL (el todo no tiene hueco en la EBNF y el plural se rechaza en DR-12). Solo extremo parte. Tampoco hay hueco en las plantillas de condición (A.6): multiplicidad + `c` no se ofrece. | spec-OPL EBNF A.6/A.9, l.976, l.1464; DR-12 |
| A-17 | caso omitido | §2.1 etiquetado | Se explicita la relación unaria (origen = destino) admitida para etiquetados. | spec-OPD l.337 |
| A-18 | obligación mal asignada | §2.1 transversal R-ROL-UNIC-1, T-053 | Era «inf. DEBE»; es DEBE explícito («el editor DEBE impedir el segundo enlace»; «DEBEN conectarse por a lo más un»). | spec-OPD l.247; spec-OPL l.641 |
| A-19 | obligación mal asignada | §2.1 R-EFE-1, T-044 | Era «inf. DEBE»; R-OPD-EST-3 dice «el editor DEBE restringir el enlace de efecto a objetos con ≥1 estado». | spec-OPD l.177 |
| A-20 | obligación mal asignada | §5.2 R-OPD-ROT-4, T-222 | Era «inf. DEBE»; spec-OPL §2.6: «el nombre de una instancia lógica DEBE escribirse `NombreInstancia : NombreClase`». | spec-OPL l.356 |
| A-21 | obligación mal asignada | §5.7 R-OPD-VAL-1, T-228 | Era «inf. DEBE»; R-VIS-VAL-1: «el OPD estático DEBE quedar limpio de validación persistente». | reglas l.1484 |
| A-22 | «no exigido» que sí se exige | §0.4 herencia, §3.4, §6.4, T-044, T-263, DR-43 nueva | La herencia se marcaba «solo método o PUEDE». R-HER-1 y R-VIS-HER-1 («DEBEN aplicarse aunque no se dibujen») obligan a que los validadores cuenten lo heredado; sin eso R-PROC-2 y R-EFE-1 sobre-acusan (contra R-AP-0C). Resolución mínima sin materializar. | reglas l.834, l.841, l.1445; spec-OPD l.318; método l.259 |
| A-23 | DEBE incompleto | §3.4, §6.4, T-091 | Afiliación heredada «por cadena estructural» (R-VIS-HER-2) y aplicada a **atributos y operaciones** «automáticamente» (R-OPD-STR-13); CANON solo cubría atributos al crear la exhibición. | reglas l.1446; spec-OPD l.319 |
| A-24 | «no exigido» que sí se exige | §0.4 Anexo C, DR-16, T-089 | R-CAT-EQ-3 es DEBE y R-ANEXO-CAT-0 exige que cada regla del anexo sea «ejecutable por una ley o checker verificable»; «declarar satisfecho en el registro» no basta: ley de test. | reglas l.1502, l.1513 |
| A-25 | DEBE omitido | T-025 | Normalización léxica o de casing «NO se aplica silenciosamente» (R-OPD-ROT-5, R-VIS-AUTOR-2). | spec-OPD l.493; reglas l.1483 |
| A-26 | obligación mal asignada | §6.4 AP-14 | Estaba agrupado como «DEBE reportarse»; AP-14 es «DEBE bloquearse como sinónimo falso». No detectable mecánicamente ⇒ registro de conformidad. | reglas l.1351 |
| A-27 | omisión en §0.4 | §0.4 | Se añaden R-PRIN-1..9, R-SD-1..3, R-IMP-1/2, R-AG-3/4, R-CONS-2/3 (contenido del modelo, método), R-SIMP-1/2, marca `ordered` (R-OPD-STR-5), etiquetados bifurcados (R-OPL-SE-4) y la limitación v0 de ≥2 estados. | reglas l.137–145, l.1168–1170, l.1206–1207, l.612; spec-OPD l.317 |
| A-28 | descripción inexacta de gap | DR-15 | La fórmula «∧» ambigua es de LF-03; R-OPD-EST-8 está bien escrita (¬global ∧ ¬local). Se corrige la atribución. | método l.433; spec-OPD l.198 |
| A-29 | «textual» no literal | §5.4 abanicos | Decía «extremo común» presentado como texto de reglas §7.1, que dice «extremo convergente». Se restituye el literal y se remite a DR-9. | reglas l.1013 |
| A-30 | «copia literal» abreviada | §5.5 (§18.2 fila simulación, §18.3 glifos de estado) | Se restituyen las dos celdas completas. | spec-OPD l.598, l.613 |
| A-31 | tensiones no registradas | §10.2 | Se añaden: ejemplo «Lavado de Platos» vs DR-13; exención del gate >25 sin definición; bundle v0 ≥2 estados vs R-OBJ-2; multiplicidad por rama en abanicos. | spec-OPD l.856, l.477, l.651; método l.639; spec-OPL l.1543 |
| A-32 | «más» (fixture impuesto) | T-304 | El e2e «Lavar Platos» era requisito; §24 exige smoke e2e, el ejemplo es ilustrativo. | spec-OPD l.777, l.856 |
| A-33 | soporte faltante | §5.7 operaciones mínimas | Se añade «fijar duración (min/esperada/máx/unidad)», necesaria para R-OPD-INV-6 y para las cotas de EX1/EX2. | spec-OPD l.365; reglas l.864–868 |
| A-34 | conteo | §9 | Recalculado con el mismo criterio tras A-01…A-33: 248 requisitos (DEBE 166/125★, DEBE inf. 39/30★, sin modal 5/2★; el resto sin cambios; ★ total 180). | — |

Verificado sin cambios: EBNF §4.8 (idéntica a spec-OPL §18), tablas de plantillas D/T/H/E/C/EX/IV/SE/RF/SSE/CX y abanicos, tabla 9.2, fuerza semántica y matriz 3×3, vocabulario §4.2, 8 representaciones, decoraciones, triángulos, marcas, tablas R-OPL-EDIT-1/3/5 y paleta §18.1/§18.4.
