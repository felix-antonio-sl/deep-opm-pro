# REFACTOR-NOTES

Notas técnicas del pipeline de extracción y refactorización. Útil para
debugging futuro o si OPCloud cambia su build y hay que adaptar las
heurísticas.

## Pipeline en tres pasos

### 1. `tools/extract.mjs` — splitter

Divide los chunks decompilados en archivos por path semántico.

Marcadores que webcrack inserta:

```
; // CONCATENATED MODULE: ./src/app/models/BasicOpmModel.ts
```

El extractor:

1. Lee `decompiled/deobfuscated.js` (mina principal: 344 módulos OPM
   concatenados), `decompiled/37084.js` (chunk principal Angular: 282 OPM +
   libs npm), y los 14 chunks lazy-loaded pequeños.
2. Escanea **todos** los markers (incluyendo `./node_modules/`) para conocer
   los límites; emite sólo los que empiezan con `./src/`.
3. Para cada marker `./src/`, toma el contenido desde la línea siguiente al
   marker hasta la línea anterior al siguiente marker — **menos** el
   preámbulo del siguiente módulo, que webpack inserta como bloque:
   ```
   // EXTERNAL MODULE: ./src/app/foo.ts
   import * as foo from "./12345.js";
   ; // CONCATENATED MODULE: ./src/app/bar.ts
   ```
4. Des-indenta usando el menor indent común no-vacío del bloque (corresponde
   al indent del closure webpack: 4 espacios típicamente, 6 en bloques
   anidados de `deobfuscated.js`).
5. Aplica una limpieza textual mínima: comentarios `/* harmony import|export */`,
   `// EXPORTS`, `// UNUSED EXPORTS:`, `// EXTERNAL MODULE: ...`, `// sourceMappingURL=...`.
6. Escribe a `src/<path>`. Si el path ya existe (chunks duplican código por
   lazy-loading), conserva la versión **más larga** y registra la colisión
   en `src/_index.json`.

### 2. `tools/refactor.mjs` — limpieza semántica

Convierte el output post-webcrack en código directamente legible. Pasadas en
orden:

1. **Renombrar exports renombrados**: webcrack incrusta el nombre original
   como comentario antes del export key minificado:
   ```js
   util_util /* uuid */.uR        // antes
   uuid                           // después
   ```
   Patrón: `(\w+)\s*/\*\s*(\w+)\s*\*/\s*(\.\w+|\["..."\])` → `$2`.
   Iteramos hasta punto fijo (encadenamientos requieren varias pasadas).
2. **Limpiar residuo ESM webpack**:
   ```
   _OpmTaggedLink__WEBPACK_IMPORTED_MODULE_0__   →   OpmTaggedLink
   ```
3. **Renombrar variables prefijadas** con basename del archivo
   (concatenación webpack):
   ```
   BasicOpmModel_uuid   →   uuid
   ```
   Sólo si el sufijo no es palabra reservada.
4. **Eliminar self-assignments**: tras renombrar, líneas como
   `var uuid = uuid;` quedan inválidas. Las eliminamos.
5. **Eliminar requires recolectados**: `var X = __webpack_require__(N)` y
   `var X = require("./N.js")` quedan redundantes — sus referencias se
   resolvieron por nombre o se documentan en el header.
6. **Header de requires**: añadimos al inicio del archivo
   `// requires (webpack module ids): N1, N2, ...` para trazabilidad.

### 3. `tools/build-index.mjs` — catálogo

Recorre `src/`, parsea con regex (no AST — pragmatismo) y emite:

- `INDEX.md` — clases por orden alfabético y por categoría.
- `MODULES.md` — un row por archivo con todos los símbolos top-level.
- `assets/INDEX.md` — cross-reference SVG/PNG → archivos que los referencian.

Buckets de categoría usados (regex sobre el path):

| Categoría | Predicado |
|---|---|
| Modelo (núcleo) | `/models/[^/]+\.(ts\|js)$` |
| LogicalPart | `/models/LogicalPart/` |
| VisualPart | `/models/VisualPart/` |
| DrawnPart | `/models/DrawnPart/` (excl. Links) |
| Links | `/models/DrawnPart/Links/` |
| Consistency | `/models/consistency/` |
| Commands & Actions | `/models/(components/commands\|Actions)/` |
| Modules | `/models/(modules\|hiddenAttributes\|notes)/` |
| DSM / DCM | `/models/DSM/` / `/services/dcm/` |
| ImportOPX | `/ImportOPX/` |
| Dialogs | `/dialogs/` |
| Layout y módulos UI | `/modules/(app\|layout\|shared\|Settings)/` |
| Configuration | `/configuration/` |
| Rappid components | `/rappid-components/` |
| Database / Auth | `/database/` |
| Services genéricos | `/services/(?!dcm)` |

## Decisiones de heurística

### ¿Por qué no AST?

Considerado y descartado. Razones:

- El código post-webcrack es **estructuralmente JS válido**, así que pasarlo
  por @babel/parser produce un AST limpio. Pero los patrones a refactorizar
  son textuales (comentarios incrustados, prefijos de variable), no
  estructurales. AST + traverse + generate añade complejidad y dependencia
  npm sin ganancia clara.
- Las regex usadas son lo bastante específicas para no tocar identifiers
  que coinciden por accidente (las patrones requieren contexto inmediato:
  `/* Word */.key`).

### ¿Por qué `extends OpmFundamentalLink` aparece dos veces para la misma clase?

`OpmFundamentalLink`, `OpmTaggedLink` y otras Link logical están definidas
**dentro** de `OpmLogicalThing.ts` en el código fuente original, **y**
duplicadas dentro de `shared.ts` (un módulo enorme de 6.2k líneas que
contiene casi todo el runtime visual). Webpack chunked-loading duplica
estas clases en distintos chunks. La extracción preserva ambas; el INDEX
las muestra dos veces para reflejar la realidad del bundle.

### ¿Por qué clases con 1232 líneas o 1946 líneas?

Algunos archivos (`behavioral.rules.ts`, `OpmVisualThing.ts`,
`shared.ts` con 6261 líneas) son **megaclases o megamódulos** que webcrack
no logra dividir más. `behavioral.rules.ts` define ~30 reglas como clases
sucesivas; `shared.ts` contiene Rappid + utilidades + clases globales; el
INDEX señala todas con la misma fila.

### ¿Por qué quedan 7 referencias a `__WEBPACK_IMPORTED_MODULE_` en `src/`?

Casos edge donde el patrón no matchea (probablemente strings literales o
patrones encadenados anidados). No vale la pena cubrirlos: el código sigue
siendo legible y ejecutable como referencia.

## Cómo añadir más fuentes

Si OPCloud cambia su deploy o aparecen chunks nuevos:

1. Editar `tools/extract.mjs`, lista `SOURCES` — añadir el nuevo chunk.
2. Re-correr el pipeline. Idempotente.
3. Si la nueva fuente introduce paths que no existían: aparecerán bajo
   `src/<nuevo-path>` automáticamente; el INDEX los recogerá.

## Errores conocidos

- **Indent residual**: algunos archivos tienen 2 espacios de indent extra al
  inicio de cada línea (cuando todas las líneas no-vacías comparten
  ≥ 2 espacios extra al closure mínimo). Es estético, no afecta lectura ni
  ejecución. Una pasada de Prettier resolvería.
- **Imports cross-archivo no resueltos**: el código no tiene `import` reales
  entre archivos extraídos. Las clases se referencian por nombre asumiendo
  ámbito global del bundle webpack original. Para ejecutar este código
  habría que resolver las referencias manualmente; pero el objetivo es
  **lectura**, no ejecución.
- **Algunas clases aparecen anidadas en archivos grandes** (e.g.
  `shared.ts` con 6.2k líneas contiene `BiDirectionalTaggedLink`,
  `OpmEllipsis`, `OpmFundamentalLink`, etc.). Es fiel al bundle original;
  el INDEX las apunta correctamente con su línea base.
