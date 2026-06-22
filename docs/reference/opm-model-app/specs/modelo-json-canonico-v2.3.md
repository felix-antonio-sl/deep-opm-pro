# Especificacion JSON canonica de Modelo OPM v2.3

Estado: aceptada como contrato de intercambio de la app.
Version de formato: `2.3.0`.
Schema canonico: [`schemas/opm-model.v2.3.schema.json`](../../schemas/opm-model.v2.3.schema.json).
Schema importable: [`schemas/opm-model.v2.3.import.schema.json`](../../schemas/opm-model.v2.3.import.schema.json).
Ejemplo minimo de contrato JSON: [`examples/modelo-minimo-v2.3.json`](examples/modelo-minimo-v2.3.json).
Templates canonicos: [`templates/`](templates/).
Guia para generadores: [`guia-generadores-json-opm.md`](guia-generadores-json-opm.md).
Verificador autonomo: [`scripts/verificar-spec-json-modelo.ts`](../../scripts/verificar-spec-json-modelo.ts).
CLI operativo: [`scripts/json-modelo.ts`](../../scripts/json-modelo.ts).
Corpus de conformidad: [`conformidad-json-opm.md`](conformidad-json-opm.md).

## 1. Proposito

Esta especificacion define el JSON que la app usa para exportar, importar,
versionar y curar modelos OPM. IndexedDB, sesiones, workspace y fixtures son
superficies de almacenamiento; no definen formatos propios.

El contrato operativo tiene dos perfiles:

- **Canon publicable**: salida estricta de `serializarModelo(modelo)`. Debe
  pasar JSON Schema canonico, checks post-schema, hidratacion, `validarModelo`
  y round-trip.
- **Importable/borrador**: entrada tolerada por `hidratarModelo` e
  `importarJSON`. Solo exige `version` y `meta`; las colecciones ausentes se
  hidratan como vacias. No debe llamarse canon hasta reserializarse y validar.
  Puede aceptar campos heredados de runtime, pero esos campos no sobreviven al
  export canonico.

Tipos TypeScript:

- `ModeloSerializadoCanonico`: perfil canon, todas las colecciones obligatorias.
- `ModeloSerializadoImportable`: perfil importable, `version` + `meta`
  obligatorios y colecciones opcionales.

Nota OPM: el ejemplo minimo prueba la forma JSON canonica y el estado de
construccion vacio aceptado por la app; no es un modelo OPM publicable con
funcion transformadora. Para iniciar un modelo semantico, usar
`templates/minimal-sd.v2.3.json` o una plantilla con proceso central.

## 2. Lectura categorial

La lectura formal minima distingue tres estructuras:

- `Mod`: objetos = instancias de `Modelo`; morfismos = operaciones puras
  admitidas por el aplicador (`Modelo -> Modelo`).
- `JsonCanon_2.3`: objetos = JSON que satisface el perfil canonico y los
  checks post-schema; morfismos = transformaciones puras de JSON canonico.
- `JsonImport_2.3`: objetos = JSON importable; morfismos = migradores o
  normalizadores parciales que producen un canon.

Conclusiones formales:

- `serializarModelo : Mod -> JsonCanon_2.3` es una proyeccion estructural que
  cambia representacion (`Map` -> arrays) sin olvidar hechos OPM persistentes
  dentro del subdominio valido. Las marcas volatiles de simulacion no son
  hechos persistentes y se proyectan fuera del canon. Fundamento:
  `urn:fxsl:kb:icas-preservacion` y `urn:fxsl:kb:icas-tiempo`.
- `hidratarModelo : JsonImport_2.3 -> Mod` es reconstruccion. Para todo modelo
  valido `M`, `hidratarModelo(serializarModelo(M)) ~= M`. Esto es una ley de
  section/retraction hasta equivalencia observacional, no una adjuncion
  declarada. Fundamento: `urn:fxsl:kb:icas-comparacion` y
  `urn:fxsl:kb:icas-efectos`.
- La equivalencia `~=` es bisimulacion observacional sobre estas observaciones:
  IDs, referencias, tipos OPM, estados, OPDs, refinamientos, apariencias,
  layouts y OPL generado. Excluye estado runtime volatil. Fundamento:
  `urn:fxsl:kb:icas-efectos`.
- La preservacion de operaciones se formula como naturalidad esperada: para
  toda operacion pura `op : M -> M'` soportada, debe existir una transformacion
  `op_json` tal que `serializarModelo(op(M)) = op_json(serializarModelo(M))`.
  Fundamento: `urn:fxsl:kb:icas-preservacion`.
- El JSON Schema actua como sketch operativo local. No expresa por si solo
  unicidad por campo `id` ni integridad referencial global; esos invariantes
  viven en checks post-schema y `validarModelo`. Fundamento:
  `urn:fxsl:kb:icas-universales`.
- `ajustes` viaja como anotacion contextual del modelo, no como hecho OPM puro:
  el formato factoriza pragmaticamente `ModeloOPM x AjustesUI -> JsonCanon`.
  Fundamento: `urn:fxsl:kb:icas-preservacion`.

Conclusiones heuristicas:

- La spec no afirma que `serializarModelo` sea full ni essentially surjective:
  existen JSON sintacticamente correctos que no son modelos OPM validos.
- La categoria `Ver` esta materializada en codigo con identidad `2.3.0 ->
  2.3.0`; los migradores no identitarios apareceran cuando exista una version
  de formato posterior.

## 3. Precedencia normativa

Cuando haya tension entre capas:

1. Semantica OPM: `urn:fxsl:kb:opm-es`.
2. Realizaciones visual/textual: `urn:fxsl:kb:opd-es` y `urn:fxsl:kb:opl-es`.
3. Procedimiento metodologico: `urn:fxsl:kb:manual-metodologico-opm-es`.
4. Implementacion de la app: tipos TS, serializador, validadores.

Regla de trazabilidad: toda regla de este contrato cita su capa propietaria.

## 4. Objeto raiz

Un documento canonico tiene exactamente estas claves raiz, en este orden de
emision:

```json
{
  "version": "2.3.0",
  "meta": {},
  "ajustes": {},
  "cosas": [],
  "estados": [],
  "opds": [],
  "enlaces": [],
  "modificadores": [],
  "apariencias": [],
  "abanicos": [],
  "escenarios": [],
  "aserciones": [],
  "requisitos": [],
  "estereotipos": [],
  "subModelos": []
}
```

Reglas:

- `version` es `2.3.0`; `schema_version` no es canonico. Propietaria:
  implementacion de app.
- `meta` es obligatorio. Propietaria: implementacion de app.
- Todas las colecciones se emiten como arrays en canon. Propietaria:
  implementacion de app.
- Las colecciones con `id` se ordenan por `id`. `apariencias` se ordena por
  `(entidad, cosa, instancia?, opd)`. Propietaria: implementacion de app; fundamento:
  `urn:fxsl:kb:icas-preservacion`.
- Las claves internas de objetos se emiten en orden alfabetico; la raiz conserva
  el orden publico listado arriba. Propietaria: implementacion de app;
  fundamento: `urn:fxsl:kb:icas-calidad-riesgo`.
- El importador puede tolerar colecciones ausentes, pero eso pertenece al
  perfil importable, no al perfil canonico. Propietaria: implementacion de app.
- Las claves no listadas no son parte del contrato canonico. Propietaria:
  implementacion de app.

## 5. Identidad

`IdPersistente` es un string opaco, estable y no derivado del layout ni de la
etiqueta visible. El espacio global de IDs cubre `cosas`, `estados`, `opds`,
`enlaces`, `modificadores`, `abanicos`, `escenarios`, `aserciones`,
`requisitos`, `estereotipos` y `subModelos`.

Reglas:

- Ningun `id` debe repetirse dentro de una coleccion ni entre colecciones.
  Propietaria: `urn:fxsl:kb:opm-es` para identidad persistente; enforcement de
  app en `hidratarModelo`, `validarModelo` y verificador.
- JSON Schema 2020-12 no expresa unicidad por `items[].id` de forma estandar.
  El verificador aplica un check post-schema obligatorio. Propietaria:
  `urn:fxsl:kb:icas-preservacion`.
- Los OPD tienen identidad persistente distinta de etiquetas humanas como
  `SD`, `SD1` o `SD1.1`. Propietaria: `urn:fxsl:kb:opm-es` y
  `urn:fxsl:kb:opl-es` (plantillas CX).

## 6. Colecciones

### 6.1 `meta`

Campos:

- `nombre`: string obligatorio.
- `descripcion`: string opcional.
- `tipoSistema`: `artificial | natural | social | socio_técnico`.
- `creado`: timestamp ISO-8601.
- `modificado`: timestamp ISO-8601.

Propietaria: implementacion de app; `tipoSistema` se alinea con
`urn:fxsl:kb:manual-metodologico-opm-es`.

### 6.2 `ajustes`

Objeto de preferencias del modelo. Controla OPL, formato, autoguardado y
validacion, pero no agrega hechos OPM.

Propietaria: implementacion de app. Relacion OPL: `urn:fxsl:kb:opl-es`.

### 6.3 `cosas`

Cada cosa representa un objeto o proceso OPM.

Campos obligatorios: `id`, `tipo`, `nombre`, `esencia`, `afiliacion`.

Reglas:

- `tipo` es `objeto | proceso`. Propietaria: `urn:fxsl:kb:opm-es`.
- Solo objetos pueden tener estados. Propietaria: `urn:fxsl:kb:opm-es`.
- Todo proceso publicable debe expresar transformacion observable. Propietaria:
  `urn:fxsl:kb:opm-es`; heuristica de completitud en
  `urn:fxsl:kb:manual-metodologico-opm-es`.
- `agent` e `instrument` se modelan mediante enlaces habilitadores, no como
  subtipo de cosa. Propietaria: `urn:fxsl:kb:opm-es`.
- `computacional` se discrimina por `tipo`: objeto computacional solo para
  `objeto`, proceso computacional solo para `proceso`. Propietaria:
  `urn:fxsl:kb:opm-es`; enforcement de schema.
- `duracion.unidad`, cuando aparece, acepta abreviaciones historicas
  (`ms`, `s`, `h`, `d`) y formas ISO/OPM textuales (`sec`, `hour`, `day`,
  `week`, `month`, `year`, ademas de `min`). Propietaria:
  `urn:fxsl:kb:opd-es`.
- `activoRuntime` es una marca volatil de simulacion aceptada solo en el perfil
  importable por compatibilidad. `serializarModelo` la elimina del canon
  publicable. Propietaria: `urn:fxsl:kb:icas-tiempo` y
  `urn:fxsl:kb:icas-efectos`.

### 6.4 `estados`

Cada estado pertenece a un objeto.

Campos obligatorios: `id`, `padre`, `nombre`, `inicial`, `final`,
`porDefecto`.

Reglas:

- `padre` debe referenciar una cosa `tipo === "objeto"`. Propietaria:
  `urn:fxsl:kb:opm-es`.
- `actualPersistente` y `actualRuntime` son distintos. `actualPersistente` es
  dato declarado por el modelador; `actualRuntime` es marca volatil aceptada en
  import y eliminada por el export canonico. Propietaria:
  `urn:fxsl:kb:opm-es`, `urn:fxsl:kb:icas-tiempo` y
  `urn:fxsl:kb:icas-efectos`.

### 6.5 `opds`

Cada OPD tiene identidad persistente propia.

Campos obligatorios: `id`, `nombre`, `tipo`, `opdPadre`.

Reglas:

- `tipo` es `jerárquico | vista_anclada | vista_ad_hoc`. Propietaria:
  `urn:fxsl:kb:opd-es` (V-114/V-244).
- Solo OPDs `jerárquico` pueden declarar `refina` y `tipoRefinamiento`.
  Propietaria: `urn:fxsl:kb:opd-es` (V-114/V-242); enforcement de schema.
- Un OPD `vista_anclada` debe declarar `subtipoVistaAnclada`. Propietaria:
  `urn:fxsl:kb:opd-es` (V-114/V-244); enforcement de schema.
- El arbol `opdPadre` no debe formar ciclos. Propietaria:
  `urn:fxsl:kb:opd-es` (V-220/V-221).
- Un canon publicable debe contener al menos un OPD jerarquico raiz
  (`opdPadre: null`) que materializa el SD. Propietaria:
  `urn:fxsl:kb:manual-metodologico-opm-es`; enforcement de `validarModelo`.

### 6.6 `enlaces`

Cada enlace reifica una relacion OPM entre cosas.

Campos obligatorios: `id`, `tipo`, `origen`, `destino`.

Tipos canonicos:

- Transformadores: `consumo`, `resultado`, `efecto`.
- Legados internos: `entrada`, `salida`.
- Habilitadores: `agente`, `instrumento`.
- Invocacion: `invocación`, `excepción`.
- Estructurales: `agregación`, `exhibición`, `generalización`,
  `clasificación`, `etiquetado`.

Reglas:

- `origen` y `destino` deben existir en `cosas`. Propietaria:
  `urn:fxsl:kb:opm-es`.
- La combinacion `(origen.tipo, destino.tipo)` debe ser compatible con
  `tipo`. Propietaria: `urn:fxsl:kb:opm-es`.
- Estados referenciados por `estadoOrigen` o `estadoDestino` deben existir y
  pertenecer al objeto correcto. Propietaria: `urn:fxsl:kb:opm-es`.
- `origenInstancia`, `destinoInstancia`, `estadoOrigenInstancia` y
  `estadoDestinoInstancia` son hints visuales opcionales para seleccionar una
  aparicion no principal declarada en `apariencias[].instancia`. No crean una
  existencia OPM nueva ni cambian la compatibilidad semantica del enlace.
  Propietaria: implementacion de app; fundamento: `urn:fxsl:kb:opd-es`
  (misma existencia con multiples apariciones visuales).
- `tipoExcepcion` solo puede aparecer cuando `tipo === "excepción"`.
  Propietaria: `urn:fxsl:kb:opm-es`; enforcement de schema.
- `probabilidad`, si aparece, debe estar en `[0, 1]`. Propietaria:
  `urn:fxsl:kb:manual-metodologico-opm-es`; enforcement de schema.
- Los tipos pertenecen a las familias canonicas de enlaces OPM. Propietaria:
  `urn:fxsl:kb:opm-es` (V-241).

### 6.7 `modificadores`

Modifican enlaces con control de evento o condicion.

Campos obligatorios: `id`, `enlace`, `tipo`.

Reglas:

- `tipo` es `evento | condición`. Propietaria: `urn:fxsl:kb:opm-es`.
- El enlace referenciado debe existir y ser compatible con control. Propietaria:
  `urn:fxsl:kb:opm-es`.

### 6.8 `apariencias`

El JSON v2.3 guarda apariencia y layout en un objeto plano por
retrocompatibilidad. En memoria se hidrata a dos mapas paralelos:
`apariencias` y `layouts`.

Campos obligatorios en canon: `entidad`, `cosa`, `opd`, `x`, `y`, `w`, `h`.
El perfil importable acepta apariencias legacy sin `entidad` y las normaliza al
serializar.

Campo opcional de identidad visual: `instancia`. Ausente significa aparicion
principal. Presente discrimina una aparicion adicional de la misma entidad en
el mismo OPD.

Reglas:

- `entidad` discrimina el coproducto `cosa | estado`. Propietaria:
  implementacion de app; fundamento categorial `urn:fxsl:kb:icas-universales`.
- `cosa` conserva el nombre legacy del campo y referencia el id de la entidad
  indicada por `entidad`. Propietaria: implementacion de app.
- `instancia` es un discriminador local de la fibra visual
  `(entidad, cosa, opd)`. No es id global y no crea una segunda existencia OPM;
  permite representar varias apariciones de la misma cosa/estado en el mismo
  OPD. Propietaria: `urn:fxsl:kb:opd-es`; fundamento categorial
  `urn:fxsl:kb:icas-preservacion`.
- Si `entidad` falta en un JSON importable, la hidratacion legacy la deriva por
  pertenencia a `cosas`/`estados`; el canon reserializado debe materializarla.
  Propietaria: implementacion de app.
- El mismo ID no puede existir como cosa y estado, porque haria ambigua la
  normalizacion legacy. Propietaria: `urn:fxsl:kb:opm-es`; enforcement de
  check post-schema.
- Si `entidad === "estado"`, no se admiten campos exclusivos de apariencia de
  cosa (`interno`, `semiPlegada`, `duplicada`, `modo`, `referenciaExterna`).
  Propietaria: implementacion de app; enforcement de schema.
- `semiPlegada` pide al renderer mostrar supresion parcial de estados;
  `duplicada` pide la marca visual de copia de apariencia. Ninguno crea una
  nueva existencia OPM. Propietaria: `urn:fxsl:kb:opd-es`.
- Si una misma entidad aparece mas de una vez en el mismo OPD, las apariciones
  adicionales deben declarar `instancia`. El renderer trata toda aparicion con
  `instancia` como duplicada visual aunque `duplicada` no este materializado.
  Propietaria: `urn:fxsl:kb:opd-es` (ISO/PAS 19450 §1.8).
- `modo === "referencia_externa"` exige `referenciaExterna`. Si `modo` falta o
  es `local`, `referenciaExterna` no debe aparecer. Propietaria:
  `urn:fxsl:kb:opd-es`; enforcement de schema.
- `w` y `h` deben ser positivos. Propietaria: `urn:fxsl:kb:opd-es`;
  enforcement de schema.
- No puede haber dos apariencias con la misma clave canonica interna. La clave
  se calcula como tupla estructurada serializada
  `apariencia:["entidad","id",instancia|null,"opd"]`, sin depender de
  delimitadores dentro de IDs. Propietaria: implementacion de app; enforcement
  de `hidratarModelo` y verificador.

### 6.9 Colecciones auxiliares

- `abanicos`: grupos XOR/OR/AND de enlaces.
- `escenarios`: etiquetas de ruta.
- `aserciones`: predicados habilitados sobre el modelo.
- `requisitos`: requisitos ligados a cosas.
- `estereotipos`: estereotipos aplicados a cosas.
- `subModelos`: referencias URI a modelos externos.

Todas estas entidades tienen `id` persistente y participan del espacio global
de unicidad. Propietaria: implementacion de app, con semantica OPM en
`urn:fxsl:kb:opm-es` cuando la entidad expresa hecho del modelo.

## 7. Bimodalidad OPD/OPL

OPM es bimodal: todo hecho del modelo debe poder observarse como OPD y como
OPL-ES equivalente.

Reglas:

- El JSON canonico preserva la informacion necesaria para renderizar OPD y
  regenerar OPL-ES. Propietaria: `urn:fxsl:kb:opd-es` y `urn:fxsl:kb:opl-es`.
- Campos que afectan OPL: nombres de cosas/estados/OPDs, `tipo`, `esencia`,
  `afiliacion`, estados y designaciones, enlaces, `estadoOrigen`,
  `estadoDestino`, multiplicidades, etiquetas, direccion, rutas,
  discriminantes, excepciones, refinamientos y ajustes OPL. Propietaria:
  `urn:fxsl:kb:opl-es`.
- Propiedad observacional: para todo modelo valido `M`,
  `OPL(M) = OPL(hidratarModelo(serializarModelo(M)))`. Fundamento:
  `urn:fxsl:kb:icas-efectos` como bisimulacion observacional.
- El verificador autonomo ejecuta esta propiedad sobre el ejemplo canonico.

## 8. Validacion autonoma

La garantia completa se cierra en cuatro niveles:

1. **JSON Schema canon/import**: draft 2020-12 con AJV y `ajv-formats`.
2. **Checks post-schema**: unicidad global de IDs, duplicados de apariencias y
   ambiguedad cosa/estado.
3. **Hidratacion/import**: conversion a `Modelo` sin colapsar duplicados.
4. **`validarModelo` + observaciones**: integridad global OPM, round-trip y OPL.

El verificador `bun run check:model-json` comprueba:

- ambos schemas compilan;
- el ejemplo minimo satisface canon e import;
- `importarJSON -> validarModelo -> serializarModelo` es idempotente;
- `serializarModelo` emite orden raiz canonico;
- el OPL observado se preserva bajo round-trip;
- un import minimo pasa import y falla canon;
- duplicados de ID fallan en post-schema;
- marcas legacy `activoRuntime`/`actualRuntime` pasan import, fallan canon y se
  eliminan al reserializar;
- `canonicalizarModeloJson` normaliza orden de colecciones y claves internas;
- condicionales de schema fallan para casos invalidos.

Adicionalmente:

- `bun run json:validate <archivo.json>` valida un JSON canonico exacto y
  ejecuta schema, post-schema, hidratacion, `validarModelo`, round-trip y OPL.
- `bun run json:canonicalize <entrada.json> <salida.json>` acepta perfil
  importable, hidrata, valida y emite canon publicable.
- `bun run check:json-cli` comprueba el CLI contra el ejemplo minimo y las
  plantillas canonicas.
- `bun run check:migradores-modelo` comprueba identidad, asociatividad de la
  composicion disponible y rechazo de versiones sin migrador.
- `bun run check:model-json-drift` compara el contrato TS
  `ModeloSerializadoCanonico`, las claves raiz compartidas y los schemas
  canon/import para detectar drift estructural.
- `bun run check:model-json-conformance` ejecuta el corpus positivo/negativo
  de conformidad OPM JSON: schema, post-schema, hidratacion, validacion,
  canonicalizacion, round-trip y OPL.

## 9. Leyes de round-trip

Para todo JSON canonico `J` que hidrata y valida:

```text
serializarModelo(hidratarModelo(J)) = canonicalizar(J)
```

Para todo `Modelo` valido `M`, modulo estado runtime volatil:

```text
hidratarModelo(serializarModelo(M)) ~= M
```

`canonicalizar(J)` significa reemitir con el orden y defaults canonicos del
serializador:

- raiz en el orden publico `version`, `meta`, `ajustes`, ...;
- claves internas alfabeticas;
- colecciones con `id` ordenadas por `id`;
- `apariencias` ordenadas por la clave canonica interna de apariencia
  `(entidad, cosa, instancia?, opd)`.

## 10. Compatibilidad y migracion

La categoria `Ver` de versiones queda declarada y materializada en
`src/nucleo/migraciones-json.ts`:

- Objetos: versiones de formato (`2.3.0`, `2.4.0`, ...).
- Morfismos: migradores puros `unknown -> unknown`.
- Identidad: migrador no-op de una version a si misma.
- Composicion: aplicacion secuencial de migradores.

Cada migrador debe declarar:

- `Preserva`: invariantes que conserva.
- `Reinterpreta`: campos cuyo significado cambia sin perdida.
- `Pierde`: informacion descartada o colapsada.

La composicion de migradores debe probarse. La deuda por constraints perdidos
es acumulativa. Fundamento: `urn:fxsl:kb:icas-lifecycle`.

En v2.3 existe el migrador identidad `2.3.0 -> 2.3.0`, con:

- `Preserva`: identidad de IDs, hechos OPM persistentes, bimodalidad OPD/OPL
  observable y perfil importable v2.3.
- `Reinterpreta`: nada.
- `Pierde`: nada.

Deuda planificada para v2.4:

- si se necesita persistir simulaciones, definir un perfil separado de snapshot
  runtime; no mezclarlo con el canon publicable;
- definir el primer migrador no identitario y sus tests de composicion directa.

## 11. Extension controlada

Las extensiones deben entrar por una de estas vias:

- campo opcional nuevo en una entidad existente;
- nueva coleccion con `id` persistente y validador asociado;
- nuevo literal de union, acompañado por render, OPL y validacion.

No se aceptan campos libres arbitrarios en JSON canonico. Para metadata
externa, usar `hiperenlaces`, `notas`, `requisitos`, `estereotipos` o proponer
una coleccion versionada.
