# Codex — Realización canónica de OPL

**Producto:** OpForja (editor OPM)
**Propuesta:** Codex · v1.0
**Capa SSOT propietaria:** `urn:fxsl:kb:opl-es` (opm-opl-es v3.0.0)

Este documento define **cómo Codex renderiza visualmente** las oraciones OPL respetando la gramática textual canónica del corpus OPM-ES.

OPL-ES no define colores ni familias tipográficas — eso pertenece a la capa visual (`opd-es`). Pero sí define **convenciones tipográficas Markdown** que Codex traslada al rendering en pantalla.

---

## 1. Convenciones tipográficas canónicas (§1.7 opm-opl-es)

| Cosa OPM | Markdown canónico | Codex (HTML/CSS) |
|---|---|---|
| Objeto | `**Objeto**` | `<b style="font-weight:700; font-style:normal">` |
| Proceso | `*Proceso*` (bold italic) | `<span style="font-weight:700; font-style:italic">` |
| Estado | `` `estado` `` | `<span style="font-family:mono; font-size:0.86em; color:olive">` |

**Helpers de referencia (componentes React):**

```tsx
function OplObj({ children })   { return <b style={{ fontWeight: 700, fontStyle: 'normal' }}>{children}</b>; }
function OplProc({ children })  { return <span style={{ fontWeight: 700, fontStyle: 'italic' }}>{children}</span>; }
function OplState({ children }) { return <span style={{
  fontFamily: 'JetBrains Mono', fontSize: '0.86em',
  color: 'var(--cx-opm-olive)', letterSpacing: '0.02em',
}}>{children}</span>; }
```

**Regla:** todo nombre de cosa OPM en cuerpo OPL DEBE pasar por uno de estos tres helpers. Nunca renderizar nombres en italic o regular sin envolverlos.

---

## 2. Verbos canónicos (§2 opm-opl-es)

Codex preserva los verbos OPL-ES estrictamente. No usar sinónimos ni traducciones libres.

| Función | OPL-EN | OPL-ES (canónico) | ❌ Evitar |
|---|---|---|---|
| Consumo | consumes | **consume** | — |
| Resultado | yields | **genera** | ❌ "produce" |
| Efecto | affects | **afecta** | — |
| Cambio de estado | changes…from…to | **cambia…de…a** | — |
| Agente | handles | **maneja** | — |
| Instrumento | requires | **requiere** | — |
| Agregación | consists of | **consta de** | ❌ "consiste en" |
| Exhibición | exhibits | **exhibe** | — |

**Casos especiales para Codex (revisados en v1):**

- En el OPL "Beneficiary Relevant Attribute puede ser problematic o satisfactory" → **debe ser** "puede **estar** `problematic` o `satisfactory`" (§1.5 ser/estar: estados usan `estar`, propiedades invariantes usan `ser`).
- "System Name consiste en System Handler, …" → **debe ser** "System Name **consta de** System Handler, …" (verbo agregación).
- "Main System Doing produce Main Output" → **debe ser** "Main System Doing **genera** Main Output" (T2 resultado).

---

## 3. Plantillas de plantilla → render Codex

Las plantillas más comunes y cómo Codex las pinta.

### 3.1 Clasificación (D1–D4)

```
<OplObj>System Name</OplObj> es informacional.
<OplObj>System Name</OplObj> es sistémico.
```

Cada hecho de clasificación en oración separada. No collapsar como "es un objeto informacional y sistémico" — no es canónico.

### 3.2 Agregación (RF1)

```
<OplObj>System Name</OplObj> consta de <OplObj>System Handler</OplObj>,
<OplObj>System Tool Set</OplObj> y <OplObj>Main Input</OplObj>.
```

### 3.3 Exhibición (RF2)

```
<OplObj>Beneficiary Group</OplObj> exhibe <OplObj>Beneficiary Relevant Attribute</OplObj>.
```

### 3.4 Estados de un objeto

```
<OplObj>Beneficiary Relevant Attribute</OplObj> puede estar
<OplState>problematic</OplState> o <OplState>satisfactory</OplState>.

Estado <OplState>problematic</OplState> de <OplObj>Beneficiary Relevant Attribute</OplObj>
es inicial.

Estado <OplState>satisfactory</OplState> de <OplObj>Beneficiary Relevant Attribute</OplObj>
es final.
```

Cada estado y sus flags (inicial/final/actual/por defecto) en oración separada.

### 3.5 Procedimentales (T1, T2)

```
<OplProc>Main System Doing</OplProc> consume <OplObj>Main Input</OplObj>.
<OplProc>Main System Doing</OplProc> genera <OplObj>Main Output</OplObj>.
```

Cuando un proceso consume Y genera, son DOS oraciones (no collapsar en "consume X y genera Y").

### 3.6 Cambio de estado (TS3)

```
<OplProc>Main System Doing</OplProc> cambia <OplObj>Beneficiary Relevant Attribute</OplObj>
de <OplState>problematic</OplState> a <OplState>satisfactory</OplState>.
```

### 3.7 State-specified (TS1, TS2 + §1.9)

```
<OplProc>Hornear Empanadas</OplProc> requiere <OplObj>Horno</OplObj> en <OplState>precalentado</OplState>.
```

Estado **después** del objeto con preposición "en", no antes.

### 3.8 Especialización (RF3, RF3b)

```
<OplObj>Especialización1</OplObj> y <OplObj>Especialización2</OplObj> son <OplObj>General</OplObj>.

<OplObj>Especialización</OplObj> es un <OplObj>General</OplObj>.
```

### 3.9 Clasificación-instanciación (RF4)

```
<OplObj>Instancia</OplObj> es una instancia de <OplObj>Clase</OplObj>.
```

---

## 4. Filtrado de OPL en la marginalia

Cuando hay selección, la columna OPL puede filtrarse:

- **Selección de un objeto:** muestra solo oraciones donde ese objeto aparece (clasificaciones, exhibiciones, transformaciones que lo afectan).
- **Selección de un proceso:** muestra solo oraciones procedimentales del proceso.
- **Selección de un estado:** muestra la línea `puede estar` y las dos líneas de flags + cualquier `cambia ... a este estado`.

**Render del filtro activo:** la línea meta del divider o del header del panel muestra:

```
filtrado · o.06 · 4/24 ✕
```

en JetBrains Mono 9px en crimson italic. El `✕` limpia el filtro.

---

## 5. Indicador de selección en OPL

Cuando una oración OPL está "selected" (ej. multi-select en SD1):

```
05  Beneficiary Relevant Attribute consta de Attribute 1, Attribute 2 y Attribute 3.
    ────────────────────────────────────────────────────────────────────────────────
```

- Número de oración (`05`) en **crimson** (no inkSoft).
- Body con `border-bottom: 1px solid var(--cx-crimson)55`.
- Color del body sube de inkMid a ink.

**No usar olive para selección** — olive es semántica de estado, crimson es UI (V-203).

---

## 6. Marginalia de validación

Cuando una oración tiene una observación de validación (severidad CRÍTICA, ALTA o MEDIA), aparece indentada al pie de la oración:

```
05  Beneficiary Group es ambiental.
    △ ALTA   beneficiarios externos al sistema → ambiental
             (metodología §5)
```

- Indent `38px` desde la izquierda (alineado con el body de la oración).
- Severity kicker en JetBrains Mono 9px, tracking `0.12em`, uppercase. Color por severidad:
  - `△ CRÍTICA` → `var(--cx-crimson)`
  - `△ ALTA` → `var(--cx-opm-olive)`
  - sin severidad (`— nota`) → `var(--cx-ink-soft)`
- Texto de la marginalia en italic serif 11px del mismo color.

**Reglas:**

- Las marginalias DEBEN referenciar la sección/regla SSOT pertinente (`metodología §5`, `visual V-209`, etc.) cuando aplique.
- Una oración puede tener máximo UNA marginalia visible. Si hay múltiples observaciones, la más severa gana visible y las demás quedan accesibles en hover/click.

---

## 7. Modelo en EN, OPL en ES (modelos mixtos, §18.5)

Codex soporta el patrón canónico:

> *"Un modelo con prosa de apoyo en español y OPL canónica en inglés es aceptable como artefacto editorial."* — §18.5

Inversamente: si los nombres del modelo están en inglés (como en el ejemplo precargado de OpForja: "System Name", "Beneficiary Group", "Main System Doing") y el OPL se renderiza con verbos canónicos en ES (`consume`, `genera`, `consta de`), eso ES aceptable.

**Limitaciones:**

- Un modelo solo tiene UNA "lengua activa" del OPL. No mezclar `consume` (ES) y `consumes` (EN) en el mismo párrafo OPL.
- Cuando se cambia la lengua, regenerar TODAS las oraciones — nunca edit parcial.

---

## 8. Nombres de procesos en ES (§1.1)

Cuando los nombres del modelo SÍ están en español, Codex respeta:

- **Infinitivo (-ar/-er/-ir)**: `Cocinar`, `Procesar Datos`, `Preparar Empanadas`
- **Nominalización**: `Fabricación`, `Verificación de Identidad`
- **Sufijo -miento (cuando aplique)**: `Mantenimiento Preventivo`

Estos nombres entran al helper `<OplProc>` que los rinde en bold italic. La capitalización de palabras léxicas se preserva tal como la introduce el modelador.

---

## 9. Estados en español (§1.3)

- En minúscula
- Forma pasiva o descriptiva del objeto contenedor
- Sin acentos especiales (uso normal del español)

Ejemplos: `pintado`, `inspeccionado`, `vacío`, `cargado`, `satisfecho`, `problematic` (cuando el modelo usa EN).

Codex los rinde con `<OplState>` que aplica monospace, tamaño 0.86em, color olive, tracking 0.02em.

---

## 10. Reglas que la implementación DEBE validar

| # | Regla | Acción si se viola |
|---|---|---|
| R1 | Todo nombre de cosa OPM en cuerpo OPL usa `<OplObj>`, `<OplProc>` o `<OplState>` | Fallo en linting de templates |
| R2 | Verbos canónicos solo: consume, genera, afecta, cambia, maneja, requiere, consta de, exhibe | Linting + autocorrección sugerida |
| R3 | `puede estar` para estados, `es` para propiedades invariantes (§1.5) | Autocorrección |
| R4 | Cada hecho del modelo = UNA oración OPL (no collapsar) | Splitter automático |
| R5 | Un modelo tiene una sola lengua OPL activa | Switcher global de lengua, no parcial |
| R6 | Estado SIEMPRE después del objeto con "en" (§1.9) | Linting |
| R7 | Indicador "selected" en OPL usa crimson, no olive | Code review |
| R8 | Marginalia de severidad referencia sección SSOT cuando aplique | Convenir per template |

---

## 11. Cómo Codex valida coherencia OPD ↔ OPL

El corpus SSOT establece (§5 opl-es) que el OPD y el OPL son **realizaciones equivalentes** de la semántica del modelo. Codex aprovecha esto:

- Al **seleccionar un símbolo en el OPD**, la OPL filtra a las oraciones donde aparece.
- Al **hover una oración OPL**, el símbolo correspondiente en el OPD recibe el subrayado crimson UI (preview de selección).
- Al **editar el nombre de un símbolo en el OPD**, todas las oraciones OPL que lo mencionan regeneran.

Esta bidireccionalidad es **fundamental** y debe implementarse en v1.

---

## 12. Apéndice — Ejemplo completo de SD (canónico)

OPL canónica para el ejemplo precargado de OpForja (SD raíz, ~24 oraciones):

```
01. System Name es informacional.
02. System Name es sistémico.
03. System Handler es físico.
04. System Handler es sistémico.
05. System Tool Set es informacional.
06. System Tool Set es sistémico.
07. Main Input es informacional.
08. Main Input es sistémico.
09. Main Output es informacional.
10. Main Output es sistémico.
11. Beneficiary Group es físico.
12. Beneficiary Group es ambiental.
13. Beneficiary Relevant Attribute es informacional.
14. Beneficiary Relevant Attribute es sistémico.
15. Beneficiary Relevant Attribute puede estar problematic o satisfactory.
16. Estado problematic de Beneficiary Relevant Attribute es inicial.
17. Estado satisfactory de Beneficiary Relevant Attribute es final.
18. Main System Doing es físico.
19. Main System Doing es sistémico.
20. Main System Doing consume Main Input.
21. Main System Doing genera Main Output.
22. Main System Doing cambia Beneficiary Relevant Attribute de problematic a satisfactory.
23. System Name consta de System Handler, System Tool Set y Main Input.
24. Beneficiary Group exhibe Beneficiary Relevant Attribute.
```

24 oraciones. Render esperado en marginalia siguiendo §1.7.

Para SD1 (in-zoom de o.06 — Beneficiary Relevant Attribute), agregar 10 más relativas a la descomposición en sub-atributos.
