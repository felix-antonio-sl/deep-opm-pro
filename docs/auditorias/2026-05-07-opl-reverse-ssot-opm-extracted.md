# Auditoria dirigida — OPL reverse alpha-lock desde SSOT + opm-extracted

**Fecha:** 2026-05-07  
**Pregunta:** que significa implementar `OPL reverse libre completo` antes de
cerrar alpha, leyendo en profundidad la SSOT OPM-ES y `opm-extracted/`.  
**Scope:** contrato de producto y arquitectura para ronda 14; impacto sobre
ronda 13 grande como medio piso beta0.  
**Fuentes primarias:**  
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-opl-es.md`
- `/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/opm-iso-19450-es.md`
- `opm-extracted/src/app/rappid-components/rappid-opl/rappid-opl.component.ts`
- `opm-extracted/src/app/modules/layout/opl-container/opl-container.component.ts`
- `opm-extracted/src/app/modules/app/export-opl.service.ts`
- `opm-extracted/src/app/dialogs/opl-dialog/opl-dialog.component.ts`
- `opm-extracted/src/app/models/modules/attribute-validation/validation-module.ts`
- `opm-extracted/src/app/models/LogicalPart/LogicalTextModule.ts`

## 1. Veredicto

`OPL reverse libre completo` debe definirse desde la **SSOT OPL-ES**, no desde
OPCloud.

La SSOT ya contiene una gramatica formal completa y vinculante. `opm-extracted`
aporta evidencia muy util para render, orden de OPDs, export, settings,
highlight canvas↔OPL y edicion indirecta por doble clic sobre tokens/enlaces,
pero **no contiene un parser inverso general reutilizable**. OPCloud genera y
presenta OPL; cuando el usuario interactua con una sentencia, abre editores de
entidad/enlace existentes. No interpreta un parrafo OPL arbitrario escrito por
humano para reconciliarlo con el modelo.

Conclusion operativa:

> Alpha no se cierra con "mas edicion inline del panel OPL". Alpha se cierra
> cuando deep-opm-pro implementa un parser OPL-ES propio, basado en el Apendice
> A de la SSOT, con binding semantico al kernel, preview/diff y aplicacion
> undoable.

## 2. Hallazgos SSOT que gobiernan el parser

### 2.1 La gramatica formal ya existe y es autoridad

`opm-opl-es.md` declara que OPL-ES es la capa textual canonica, responsable de
fijar superficie lexica, sintactica y plantillas textuales, preservando
equivalencia de ida y vuelta entre OPL-EN y OPL-ES (`opm-opl-es.md:54-70`).

El Apendice A es mecanizable y vinculante:

- `parrafo_opl_es = oracion_opl_es, { salto_de_linea, oracion_opl_es }`
- `oracion_formal_opl_es = descripcion | procedimental | estructural |
  gestion_contexto`
- identificadores, listas, estados, etiquetas, rangos, cardinalidades,
  condiciones, control, refinamiento e intermodelo estan definidos en EBNF
  (`opm-opl-es.md:806-1334`).

Implicacion: el parser no debe ser un set de regex sueltas por HU. Puede tener
un tokenizer pragmatico, pero su AST debe mapear a las familias del Apendice A.

### 2.2 "Libre completo" no significa lenguaje natural arbitrario

La SSOT fija verbos y palabras clave canonicas: `consume`, `genera`, `afecta`,
`cambia`, `maneja`, `requiere`, `inicia`, `invoca`, `consta`, `exhibe`, `es`,
`puede estar`, `se descompone`, `se despliega`, `se refina`, etc.
(`opm-opl-es.md:173-203`).

El orden sujeto-verbo-complemento se preserva para simplificar el analisis
bidireccional (`opm-opl-es.md:156-158`). Por tanto, "libre completo" significa:

- acepta OPL-ES canonico escrito por humano, no solo texto generado por la app;
- cubre todas las familias del Apendice A que el kernel actual puede representar;
- diagnostica explicitamente frases fuera de gramatica o fuera de kernel;
- no intenta interpretar castellano libre sin forma OPL.

### 2.3 Markdown OPL es superficie, no identidad

La SSOT define convenciones de Markdown: objeto en negrita, proceso en cursiva,
estado en monoespaciado (`opm-opl-es.md:146-154`). Esas marcas ayudan a
desambiguar, pero el parser debe tolerar entrada humana sin Markdown cuando la
gramatica y la tabla de simbolos lo permitan.

Politica recomendada:

- input: Markdown opcional;
- parser: usa marcas como hints, no como unica fuente de tipo;
- output normalizado: vuelve a emitir la superficie canonica con Markdown.

### 2.4 Identidad persistente no vive en el texto visible

La SSOT separa etiqueta visible de OPD (`SD`, `SD1`, `SD1.1`) e identidad
persistente. El OPD visible no sustituye al id interno (`opm-opl-es.md:891-912`,
`opm-iso-19450-es.md:780-786`, `opm-iso-19450-es.md:888-898`).

Implicacion para OPL reverse:

- el binder debe resolver `SD`, `SD1`, etc. contra metadata del modelo;
- si una etiqueta visible es ambigua por renumeracion, se debe diagnosticar;
- los patches nunca deben crear ids derivados del texto visible como identidad
  persistente.

### 2.5 Round-trip preserva semantica, no superficie exacta

La SSOT explicita que la equivalencia de ida y vuelta preserva el hecho del
modelo y la estructura argumental, no una unica forma superficial espanola
(`opm-opl-es.md:1374-1389`).

Implicacion:

- `canvas -> OPL -> parser -> modelo -> OPL` debe preservar hechos;
- puede normalizar articulos, Markdown, espacios y forma editorial;
- debe ser determinista: mismo texto + mismo modelo base produce mismo patch.

## 3. Hallazgos de opm-extracted

### 3.1 OPCloud genera OPL, no parsea OPL libre

`OplService.generateOpl()` llama a `oplGenerating.generateOPL(options)` y luego
aplica gramatica/formato (`validation-module.ts:8783-8803`). La funcion
`generateOplSpec()` esta vacia en el extracto. No aparece un flujo simetrico
`parseOpl -> applyModel`.

`ExportOPLAPIService.exportOPL()` recorre todos los OPDs, renderiza cada OPD,
llama `generateOpl()`, extrae `innerText` y concatena HTML/texto para export
(`export-opl.service.ts:63-138`). Esto confirma un pipeline forward.

### 3.2 El panel OPL de OPCloud es una lente interactiva

`RappidOplComponent` mantiene `opls`, refresca en cambios de graph y sincroniza
highlight OPD↔OPL (`rappid-opl.component.ts:87-195`). Cada sentencia guarda
`cells`, lo que permite saber que cosas/enlaces originaron esa oracion.

Interacciones relevantes:

- click en sentencia copia texto al clipboard (`rappid-opl.component.ts:390-401`);
- doble click en un token `<b>` abre editor de texto de la entidad/estado
  correspondiente (`rappid-opl.component.ts:402-428`);
- doble click en el cuerpo de la sentencia abre editor del link, o popup de
  seleccion si hay varios links (`rappid-opl.component.ts:430-449`).

Esto es valioso para UX de ronda 14, pero no equivale a parser inverso libre.
OPCloud evita parsear: reutiliza la referencia `cells` ya generada por el
pipeline forward.

### 3.3 Settings OPL no son semantica de parser

`opl-dialog.component.ts` gestiona idioma, tabla OPL, numeracion, auto-format,
alias/unidades y preferencias de organizacion (`opl-dialog.component.ts:72-190`).
Sirve para decidir politicas editoriales y toggles de superficie. No provee
reconciliacion textual.

### 3.4 TreeParser aporta orden y etiquetas visibles, no identidad semantica

`treeParser.ts` produce titulos `SD`, `SD1: nombre`, etc. desde el arbol
(`treeParser.ts:9-80`). Es referencia util para export/orden textual, pero la
SSOT exige preservar ids persistentes fuera de esas etiquetas.

### 3.5 LogicalTextModule confirma edicion de nombres, no parrafo completo

`LogicalTextModule` actualiza nombre desde input y compone modulos textuales
activos (`LogicalTextModule.ts:36-75`). Es analogico a lo que ya hace
deep-opm-pro con edicion inline de tokens OPL: rename de entidad/estado/etiqueta.
No cubre crear enlaces, estados, refinamientos o aplicar un parrafo OPL.

## 4. Estado actual de deep-opm-pro

La app ya tiene buena mitad forward:

- `app/src/opl/generar.ts` y generadores por familia cubren OPL-ES forward.
- `app/src/ui/PanelOpl.tsx` agrupa, busca, copia/exporta y permite edicion
  inline limitada.
- `app/src/opl/edicionCanvas.ts` aplica intenciones inversas acotadas:
  renombrar entidad, renombrar estado, editar etiqueta de enlace.
- `HU-SHARED-007` explicita la bisimulacion y exige inverso editable valido
  (`docs/historias-usuario-v2/shared/HU-SHARED-007-eco-opl.md:144-152`).

Brecha real:

> Falta parser de documento OPL-ES, binder semantico, diff/preview y aplicador
> general de cambios al kernel.

## 5. Definicion operativa de "OPL reverse libre completo"

Para alpha-lock, "libre completo" queda definido asi:

### 5.1 Input aceptado

- Parrafos OPL-ES canonicos segun `opm-opl-es.md` Apendice A.
- Texto humano no necesariamente generado por la app.
- Markdown OPL opcional en entrada (`**Objeto**`, `*Proceso*`, `` `estado` ``).
- Numeracion opcional al inicio de linea (`1. ...`), ignorada semanticamente.
- Separacion por lineas; cada linea contiene una oracion OPL terminada en punto.

### 5.2 Cobertura gramatical minima

El parser debe reconocer al menos estas familias como AST tipado:

- descripcion de cosas: propiedades, estados, inicial/final/default/current,
  tipo de dato;
- procedimental: consumo, resultado, efecto, cambio de estado, agente,
  instrumento, evento, condicion, excepcion, invocacion;
- estructural: agregacion, caracterizacion/exhibicion, especializacion,
  instanciacion, relacion etiquetada uni/bidireccional, cardinalidad,
  restricciones de expresion;
- contexto: descomposicion, despliegue, plegado, recomposicion, referencia a
  OPD visible;
- listas AND/OR/XOR, orden, secuencia, rutas y labels.

Familias que el kernel actual no soporte plenamente (sub-modelos peer,
referencias externas intermodelo) se parsean y producen diagnostico
`unsupported-kernel`, no se ignoran.

### 5.3 Binding semantico

El parser produce AST; el binder lo resuelve contra:

- tabla de simbolos de objetos, procesos, estados y enlaces;
- OPD activo y mapa de etiquetas visibles `SD* -> opdId`;
- nombres canonicos internos;
- politicas de desambiguacion.

Reglas:

- nombre unico existente: bind directo;
- nombre nuevo en sentencia creadora: candidato a crear;
- nombre ambiguo: diagnostico con candidatos, no aplicar;
- tipo incompatible (objeto vs proceso): diagnostico;
- estado mencionado para objeto sin ese estado: candidato a crear solo si la
  sentencia de estados lo declara o el usuario aprueba en preview.

### 5.4 Aplicacion y diff

El output de `parse + bind` no muta el modelo directamente. Produce:

```text
ParseResult
  ast: OracionOplAst[]
  diagnosticos: DiagnosticoOpl[]
  patch: PatchOplPropuesto[]
```

El usuario ve preview/diff antes de aplicar. Al aplicar:

- cada patch entra al undo stack como una operacion atomica de usuario;
- cambios destructivos requieren confirmacion explicita;
- ausencia de una oracion en el texto editado **no borra** por defecto. La
  reconciliacion estricta con deletes implicitos debe ser un modo separado,
  no el comportamiento normal.

### 5.5 Salida esperada

- `canvas -> OPL -> parser -> modelo` preserva hechos OPM para el subconjunto
  soportado por el kernel actual.
- `texto OPL humano valido -> preview -> aplicar -> OPL generado` produce OPL
  canonico equivalente, aunque no preserve espacios/Markdown exactos.
- Diagnosticos explican linea, columna, familia esperada, simbolos candidatos y
  accion sugerida.

## 6. Arquitectura recomendada para ronda 14

Ronda 14 no deberia mezclarse con UX foundation. Debe ser secuencial o con
paralelismo controlado por capas:

1. **Lexer + parser SSOT**  
   `app/src/opl/parser/` con tokens, AST y diagnosticos. Sin tocar store.
2. **Binder semantico**  
   tabla de simbolos `Modelo -> SimboloOpl[]`, resolucion de nombres, OPD labels,
   ambiguedades y politicas.
3. **Patch planner**  
   AST+bindings -> `PatchOplPropuesto[]` sin mutar modelo.
4. **Applicator undoable**  
   `aplicarPatchOpl(modelo, patch)` usando operaciones existentes cuando existan.
5. **UI PanelOpl edit/preview**  
   editor textual con diagnostics inline, preview/diff, aplicar/cancelar.
6. **Evals alpha-lock**  
   corpus de oro: ejemplos SSOT, fixtures demo, modelos generados por la app,
   casos humanos escritos a mano, errores esperados.

## 7. Impacto sobre ronda 13 grande

La auditoria **no cambia las cuatro lineas de ronda 13**. Si acaso, las hace mas
claras:

- L1 Toolbar split/lazy: puede mejorar arquitectura y eventos IFML, pero no toca
  `PanelOpl`, parser, generadores ni store OPL.
- L2 tokens: sin impacto OPL.
- L3 checkers: validacion metodologica es DataFlow derivado del modelo, no
  generacion ni parsing OPL.
- L4 barra flotante: no introduce acciones OPL ni edicion textual.

Ronda 13 sigue siendo **beta0 foundation / medio piso**. Ronda 14 queda como
**alpha-lock OPL reverse** con contrato ya definido.

## 8. Riesgos si se ignora esta lectura

- Implementar "reverse" como regex de 6 casos y declarar alpha cerrado
  falsamente.
- Copiar UX OPCloud de doble click OPL y confundirla con parser libre.
- Mezclar parser con refactor de Toolbar/checkers y generar cascada imposible de
  validar.
- Borrar hechos por ausencia de lineas sin preview, rompiendo modelos reales.
- Crear ids desde etiquetas `SD1` visibles y perder identidad persistente.

## 9. Decision final

Antes de correr ronda 13 grande: no hay que reabrir sus 4 lineas. Si hay WIP, se
continua. Solo deben actualizarse los briefs para citar esta auditoria y
mantener una barrera dura:

> Ninguna linea de ronda 13 implementa OPL reverse, unifica generadores OPL,
> cambia `app/src/opl/**` ni modifica semantica OPL. Todo eso queda en ronda 14.

Antes de iniciar ronda 14: convertir esta auditoria en briefs de parser por
capas, con evals de round-trip como gate de cierre alpha.
