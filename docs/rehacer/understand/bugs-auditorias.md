# Dossier — Evidencia de uso real: `docs/bugs` y `docs/auditorias`

Área: registro de bugs/features capturados desde la app en producción y el conjunto de
auditorías, actas deliberativas y evaluaciones. Objetivo del dossier: extraer los dolores
reales del usuario, qué pidió y por qué, qué defectos se repiten y qué revelan sobre la
complejidad accidental, para informar una reescritura de opforja que preserve la semántica
OPM (ISO 19450) y elimine lastre.

Fecha de corte del análisis: 2026-09-30. Nada del repo fue editado.

---

## 0. Qué se leyó (y cómo)

| Fuente | Cobertura |
|---|---|
| `docs/bugs/README.md`, `INDEX.md`, `HISTORY.md` (147 líneas, 122 filas), `statuses.json` (119 claves) | Leídos completos |
| `docs/bugs/archive/BUG-*/report.md` + `payload.json` (122 carpetas, 375 archivos, 6,6 MB) | Texto original del usuario extraído de los 122 reportes; lectura completa de los ~32 reportes con cuerpo extendido (diagnóstico, causa raíz, rondas); estadísticas sobre los 122 `payload.json` |
| `docs/auditorias/*.md` vigentes (11 archivos) + `evidencia/2026-09-23-jev.json` | Leídos completos (el JSON, cabecera y estructura) |
| Auditorías archivadas recuperadas de Git (`git show 557c7ec^:` y `87f1e55^:`) | `2026-06-11-auditoria-integral-opforja.md` (610 l.), `2026-06-12-auditoria-ux-jobs.md`, `2026-07-07-reauditoria-ux-diagramatica.md`, `2026-05-26-alineacion-opl/README.md`, `opcloud-enlaces-pendientes/README.md` (cabecera y estado), `auditoria-documental-2026-08-09.md`, `2026-06-04-acta-mesa-equilibrio-encarnacion.md` (inicio) |
| Código de soporte del capturador | `app/src/server/bugCapture.ts`, `bugIndex.ts` (índice de funciones), `app/src/ui/CapturadorBugs.tsx` (índice), `app/scripts/bug-*.ts`, `vite.config.ts`, `docker-compose.yml`, `deploy/nginx.conf` |
| Verificaciones puntuales en código | Estado vigente de hallazgos P1 de la auditoría integral y de hallazgos UX; duplicación de `validarMultiplicidad` (ver §6.8) |

---

## 1. Resumen ejecutivo

1. **Un solo usuario real, casi todo en 19 días.** Los 122 reportes vienen de un único
   operador (Mac + Chrome, 120/122), en producción (`opforja.sanixai.com`, 119/122), sin
   ningún reporte desde móvil. El 84% se concentra entre el 2026-05-23 y el 2026-06-09.
   Después hubo 4 reportes (julio) y cero en agosto y septiembre. El 2026-05-26 hubo **42
   reportes en ~95 minutos**. Es un registro de *sesiones de revisión intensivas del
   producto*, no de uso sostenido por terceros.
2. **Casi todo se probó sobre modelos de juguete.** 103 de 122 reportes vienen de
   modelos llamados «Modelo», «Modelo copia», «Modelo_simu», «System Diagram» o «Modelo de
   test 2». Solo ~14 vienen del modelo de dominio real (HODOM). Los dolores medidos son
   de *edición básica y fidelidad de notación*, no de escala.
3. **Los dolores dominantes, en orden:** (a) verbalización OPL incorrecta o ausente,
   (b) semántica de enlaces con estados (qué se puede conectar y cómo se lee),
   (c) fidelidad de la notación visual frente a OPCloud (flechas, formas, sombras,
   anclajes), (d) interacción directa en el canvas (drag/resize/click sobre estados),
   (e) chrome del shell (barras, paneles, solapes de texto) y (f) el viewport, que debe
   centrarse y conservar el encuadre.
4. **El usuario pide sustraer.** Hay 9 pedidos explícitos de «sacar», «eliminar» o
   marcar algo como redundante (mapa del sistema, hover inferior, barra inferior, botón de
   paleta, comando duplicado, ids `o.13`). Cada uno se ejecutó sin reclamo posterior.
5. **Las regresiones vienen de fixes locales sobre capas acopladas.** Se documentan cuatro
   cadenas de regresión (estados en el canvas, barra de simulación, efecto
   objeto→proceso, supresión OPL por nombre placeholder) donde cada fix produjo el
   siguiente bug. En el caso de los estados, 10 reportes cayeron en 20 minutos.
6. **La gobernanza autorreferente pesa más que los bugs.** Hay 6 actas deliberativas con
   paneles de «expertos» encarnados por LLM (Besto/Resto, steipete/allan-kelly/steve-jobs,
   salubrista), confianzas numéricas y ciclos de refutación. Cuatro de ellas sirven a una
   sola feature, el Anclaje/Centinela de Drift, que **no tiene ningún reporte de uso**, cuyo
   beneficiario es el mismo operador y cuyo dolor el acta califica de «inminente-no-activo».
   Esa feature suma ~4,7k líneas de código y tests, además de 7 archivos de leyes.
7. **Hay oro que portar.** El contrato de persistencia (revision + 409), la partición
   semántica/presentación de campos (`firmaSemantica.ts`), la ley `silencio-readonly`, el
   catálogo de reglas OPM que surgió al corregir bugs (dirección del efecto, TS3/TS4/TS5,
   modificadores, placeholders, multiplicidad) y las dos auditorías UX, que son la mejor
   evidencia de producto del repo.
8. **Un bug declarado resuelto sigue vivo.** El inspector de enlaces y la tabla de enlaces
   todavía rechazan `?` como multiplicidad por una **duplicación de validadores** (§6.8).
   Es un ejemplo exacto del tipo de complejidad accidental que la reescritura debe matar.

---

## 2. Inventario del área (artefactos y código de soporte)

### 2.1 `docs/bugs/`

| Pieza | Propósito real | Observación | Recomendación |
|---|---|---|---|
| `README.md` | Describe el capturador, el formato `BUG-<ts>-<hex>/`, el índice vivo, el histórico y `statuses.json` | Menciona un «README.md del archivo mensual» del que el índice recuperaría cierres. Ese archivo **no existe** (`find archive -name README.md` → 0). | simplify |
| `INDEX.md` | Ledger de activos (regenerado) | Hoy vacío: 0 activos | cut (derivable) |
| `HISTORY.md` | Ledger histórico completo (regenerado): tipo, estado, resumen truncado a ~130 caracteres, resolución, capturas y nota | 122 filas, todas en «Resuelto». Es la vista más útil para humanos, pero trunca justo el texto del usuario. | simplify (una tabla generada on-demand) |
| `statuses.json` | Metadata editable que sobrescribe tipo, estado, resolución y nota | 119 de 122 ids. Las notas llevan conteos de gates, hashes de bundle y URLs de deploy. | simplify |
| `archive/BUG-*/report.md` | Texto del usuario + capturas + contexto, y a veces diagnóstico y rondas | **71 `report.md` siguen diciendo «Estado: Nuevo»** mientras el ledger dice «Resuelto»: tres fuentes de verdad desincronizadas (report.md, payload.json, statuses.json). | simplify |
| `archive/BUG-*/payload.json` | Versión estructurada | Esquema estable (§3.1). Solo 1 de 122 trae `repro` (modelo adjunto). | keep (contrato) |
| `archive/*/mockup-*.html`, `sonda-bug-*.mjs`, `screenshot-*.png` | Mockups comparativos, sondas Playwright contra prod | Artefactos de una sola vez. Las sondas `app/scripts/sonda-bug-*.mjs` ya no existen en `app/scripts` (0), solo queda una copia en el archivo. | cut |

### 2.2 Código que sostiene el capturador

| Archivo | Líneas | Rol | Recomendación |
|---|---:|---|---|
| `app/src/server/bugCapture.ts` | 226 | Handler HTTP: POST crea la carpeta, escribe screenshots (png/jpeg/webp base64), `payload.json` y `report.md`, y regenera los índices. GET devuelve el ledger. | keep, simplificado |
| `app/src/server/bugIndex.ts` | 528 | Lee carpetas, `statuses.json` y los README de archivo (inexistentes), y renderiza INDEX/HISTORY en Markdown, con inferencia de tipo y estado | cut (reemplazar por ~60 líneas o por un issue tracker) |
| `app/src/ui/CapturadorBugs.tsx` | 607 | Modal: texto, pegar/adjuntar capturas, contexto automático, copia el id al portapapeles, tabla del ledger dentro de la app | simplify (sin la vista de ledger) |
| `app/scripts/bug-capture-api.ts`, `bug-index.ts` | 39 + 17 | Sidecar Bun y regenerador manual | simplify |
| `vite.config.ts` (`bugCapturePlugin`), `docker-compose.yml` servicio `bug-capture` (monta `./docs/bugs` en el contenedor), `deploy/nginx.conf` (`/__deep-opm/bug-reports`, `limit_req 1r/s burst 5`) | — | La producción escribe dentro del árbol del repo | simplify |
| Tests: `bugCapture.test.ts` (217), `e2e/10-capturador-bugs.spec.ts` | — | — | keep lo mínimo |

**Valor real del capturador.** Alto: es el único canal de feedback de uso que existe, y el
contexto automático (modelo, OPD, selección, viewport y UA) ahorra preguntas. Casi todo lo
que lo rodea es burocracia: el triple ledger, el índice con inferencias, la vista del
ledger dentro de la app y los atajos duplicados (Ctrl+Shift+B y Ctrl+Alt+B).

### 2.3 `docs/auditorias/` (vigente + archivado)

| Artefacto | Tipo | Aporte real | Recomendación |
|---|---|---|---|
| `2026-06-04-persistencia-backend.md` | Auditoría técnica | Contrato de persistencia: backend-only, `revision` + 409, límites y poda de versiones, rate limits, backups | **keep** (convertir en contrato) |
| `2026-06-12-auditoria-ssot-corpus.md` | Auditoría del corpus normativo | Catálogo de tensiones de reglas OPM (familias de enlace, ruta sobre habilitadores, `Pr = p`, R-NOM-PROC-1 deverbal, grid por defecto) | keep como fuente de reglas; cut la narrativa del proceso |
| `2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md` | Acta deliberativa (Besto × Resto) | Frontera producto/dominio, pivote único `deep-opm-pro.modelo.v0`, roles del compilador frente al parser reverse, plan F0–F5 | Extraer 5 decisiones; cut la ceremonia |
| `2026-06-24-acta-alcance-anclaje-gist.md` | Acta (steipete × allan-kelly) | Alcance mínimo del «anchor» | cut |
| `2026-06-24-acta-nominacion-reuso-tipos-opforja.md` | Acta (Jobs/steipete/allan) | Nombres Calcar/Anclar/Pieza/Soltar; adjunción Σ⊣Δ | cut (conservar solo el glosario si la feature sobrevive) |
| `2026-06-24-acta-valor-anclaje-centinela-drift.md` | «Duelo» de valor | Admite que el valor está condicionado y que el dolor es «inminente-no-activo» | cut, pero citarla como evidencia de que la feature es especulativa |
| `2026-06-26-acta-arranque-centinela-drift.md` | Acta | Orden de fases y firma de `proyectarModeloAJointCells` | cut |
| `2026-06-26-acta-quietud-firma-centinela.md` | Acta + ratificación HITL | **Partición campo a campo significado/presentación** (útil fuera del Centinela) | Extraer la partición como contrato; cut el resto |
| `2026-06-30-acta-c4-drift-granular-pieza.md` | Nota de corte | `frozenAtPieza`, vecindad RADIO-1 | cut, salvo que el Anclaje sobreviva |
| `2026-07-09-acta-manual-sanitarios-opm.md` | Acta editorial | Diseño de un manual de dominio sanitario | cut del repo del modelador (pertenece al dominio) |
| `2026-09-23-evaluacion-jev.md` + `evidencia/…json` | Evaluación exploratoria de un LLM-juez | 24/24 en casos sintéticos redactados por el propio evaluador; «no hay evidencia local de ahorro» | cut (sin necesidad acreditada) |
| *(archivada)* `2026-06-11-auditoria-integral-opforja.md` | Auditoría técnica de 7 agentes | P1 de kernel, reverse OPL, simulación y arquitectura | **keep como lista de chequeo** |
| *(archivada)* `2026-06-12-auditoria-ux-jobs.md` | Auditoría UX en vivo | La mejor evidencia UX: C-1 fuga de modos, M-1..M-6 | **keep (insumo de diseño)** |
| *(archivada)* `2026-07-07-reauditoria-ux-diagramatica.md` | Reauditoría en vivo | Confirma la persistencia de M-3/M-4/M-6 y que el Centinela **agravó** el Inspector | **keep** |
| *(archivada)* `2026-05-26-alineacion-opl/` | Triage de 48 GAPs OPL | Bugs de canon en generadores | keep como checklist OPL |
| *(archivada)* `opcloud-enlaces-pendientes/README.md` | Roadmap de emulación OPCloud del ruteo | Muestra el costo de emular Rappid/OPCloud (ports, manhattan, sort, beautify, symbolAnchors) | Evidencia de acreción; cut |
| *(archivada)* `auditoria-documental-2026-08-09.md` | Poda documental | Archivó 23 artefactos y afirma que «abrir una línea de producto requiere evidencia de uso, un bug reproducible o decisión humana» | Adoptar el principio; cut el artefacto |
| `README.md` de auditorías | Política de vigencia | «Conserva una auditoría solo mientras código, tests o una norma la citen». En la práctica, el código cita actas (p. ej. `firmaSemantica.ts`), lo que obliga a conservarlas | simplify: no citar actas desde código |

---

## 3. Contratos de datos del área

### 3.1 Payload persistido de un reporte (`payload.json`)

Emitido por `app/src/server/bugCapture.ts:69-78`. Forma real, contada sobre los 122
archivos: `id` 122, `createdAt` 122, `text` 122, `context` 121, `screenshots` 121,
`type/status/resolution` 117, `repro` 1.

```ts
// bugCapture.ts:69-78 (forma escrita en disco)
{
  id,                       // "BUG-YYYYMMDDTHHMMSSZ-<hex6>"
  type: "Bug",              // "Bug" | "Feat" (sobrescribible en statuses.json)
  status: "Nuevo",          // libre; el ledger usa "Nuevo" | "Resuelto" | ...
  resolution: "Pendiente.",
  createdAt: now.toISOString(),
  text: payload.text,
  context,                  // objeto libre, ver abajo
  screenshots: archivosScreenshots, // ["screenshots/01-<nombre>.<png|jpg|webp>", ...]
}
```

Contexto capturado por la UI (claves observadas en 121/121):
`modeloId, modeloNombre, opdActivoId, opdActivoNombre, seleccionEntidadId,
seleccionEnlaceId, pestanaActivaId, vistaMapaActiva, url, userAgent,
viewport{width,height,devicePixelRatio}, capturedAt`.

Tipos del handler (`bugCapture.ts:8-27`), citados tal cual:

```ts
export interface BugCaptureHandlerOptions {
  repoRoot: string;
  bugsRoot?: string;
  maxBodyBytes?: number;
  maxScreenshots?: number;
  now?: () => Date;
  randomHex?: () => string;
}

type BugPayload = {
  text: string;
  screenshots: ScreenshotPayload[];
  context: unknown;
};

type ScreenshotPayload = {
  name: string;
  type: string;
  dataUrl: string;
};
```

Límites: body de 25 MB (`DEFAULT_MAX_BODY_BYTES`) y 12 capturas como máximo. Solo acepta
`data:image/(png|jpeg|webp);base64`. El id se construye con `crearBugId`
(`bugCapture.ts:161-164`).

### 3.2 API HTTP del capturador

| Método | Ruta | Respuesta |
|---|---|---|
| `POST` | `/__deep-opm/bug-reports` | `201 {id, path, directory, screenshots}`; `400` si el mensaje de error empieza con `Payload`, `Texto` o `Screenshot` (clasificación por prefijo de string, `bugCapture.ts:221-225`); `500` en otro caso |
| `GET` | `/__deep-opm/bug-reports` | `200 {active[], history[], counts{active,history}}` |
| otro | — | `405` |

Montada en dev y preview (plugin Vite) y en prod (sidecar `bug-capture` detrás de nginx con
`limit_req 1r/s burst 5`). En build estático puro queda oculta salvo
`VITE_ENABLE_BUG_CAPTURE=true`.

### 3.3 `statuses.json`

`Record<BugId, { type: "Bug"|"Feat"; status: string; resolution: string; note?: string;
screenshots?: string[] }>`. Sobrescribe lo que dicen el payload y el report.

**Para la reescritura:** si se conserva el capturador, el contrato mínimo que vale la pena
migrar es `{id, createdAt, text, context, screenshots[]}` más, idealmente, **un snapshot
del modelo o del OPD activo y su OPL**. La mayoría de los bugs de OPL y de enlaces se
reproducían solo con el modelo, que casi nunca venía adjunto (1 de 122).

### 3.4 Contratos del producto que las auditorías fijan (para respetar o migrar)

- **Pivote único de intercambio `deep-opm-pro.modelo.v0`** (acta de flujo canónico D1:
  «No hay segundo esquema»). Aparece en `app/src/serializacion/portablePackage.ts:9` y las
  extensiones aditivas están en `app/src/modelo/tipos/extensiones.ts:88,134,208,300`. Hay
  también un envoltorio de transporte `deep-opm-pro.paquete.v0` (acta EQUILIBRIO, C5), que
  «transporta, no modela».
- **Persistencia** (auditoría de persistencia, verificado en `app/src/server/modelPersistence.ts`):
  - backend-only: nada del modelo OPM se guarda en el storage del navegador;
  - `revision` por modelo, `SELECT … FOR UPDATE` y **`409 Modelo desactualizado`**
    (`modelPersistence.ts:357`) ante una revisión obsoleta; un POST de `revisiones` hace
    commit atómico (`:290`);
  - body de 15 MB (`DEFAULT_MAX_BODY_BYTES`, `modelPersistence.ts:183`), con nginx a 25 MB;
  - versiones podadas en escala logarítmica (`MODEL_MAX_VERSIONS_PER_MODEL`, 30 por
    defecto) y un autosave único por `(tenant_id, modelo_id)`;
  - aislamiento `WHERE tenant_id` en todas las queries, SQL parametrizado, HMAC-SHA256 con
    `timingSafeEqual`;
  - abierto: tenants huérfanos, sesión de 180 días sin rotación y cookie sin `exp` según la
    auditoría integral.
  Referencia de escala: el bundle HODOM v1.6 (36 OPDs) pesa unos 5 MB.
- **Partición semántica/presentación de campos**
  (`app/src/modelo/submodelos/firmaSemantica.ts:45-157`, ratificada en el acta de quietud).
  Es un `Record<keyof T, ClaseCampo>` por tipo, exhaustivo por construcción. Clasificación
  ratificada:
  - FIRMADO — Entidad: `tipo, nombre, esencia, afiliacion, refinamientos, alias, unidad,
    esAtributo, valorSlot, lineal, estereotipoId, anclaje, requisito,
    orderedFundamentalTypes, descripcion, urls, simulacion`. Estado: `nombre, esInicial,
    esFinal, designaciones, duracion, orden`. Enlace: `tipo, origenId, destinoId,
    etiqueta, multiplicidadOrigen/Destino, modificador, subtipoModificador, probabilidad,
    demora, backwardTag, requisitos, tasa, unidadesTasa, tiempoMaximo/Minimo(+unidad),
    grupoEstructuralId, estadoEntradaId, estadoSalidaId, efectoEscindido, derivado`.
    Abanico: completo. Opd: `padreId, ordenInzoom, nombre, vista`.
  - EXCLUIDO (presentación) — Entidad: `imagen, layoutEstados`. Estado: `suprimido,
    width, height, x, y`. Enlace: `rutaEtiqueta, mostrarRequisitos`. Apariencia entera
    (`x,y,width,height,modoTamano,modoPlegado,ordenPartes,parteExtraidaDe,
    contextoRefinamiento,ports,estadosSuprimidos`). AparienciaEnlace entera (`vertices,
    symbolPos, symbolAnchors, labelPositions`). Opd: `apariencias, enlaces, ordenLocal`.

  Para una reescritura es la mejor frontera disponible entre «modelo OPM» y «vista/layout».
  Dos puntos requieren criterio OPM al migrar: el acta clasifica **`rutaEtiqueta` como
  presentación**, pero varios bugs (§5.5) muestran que la etiqueta de ruta **tiene
  semántica de ejecución** (empareja consumo y resultado en simulación y en OPL). También
  `estadosSuprimidos` (supresión por OPD, ISO 19450) quedó como presentación.

---

## 4. Perfil de uso real (lo que dicen los datos)

| Métrica | Valor |
|---|---|
| Reportes totales | 122 (114 marcados «Bug» y 8 «Feat»; al menos 15 «Bug» son en realidad pedidos de feature o preguntas) |
| Días con reportes | 19 |
| Ventana densa | 2026-05-23 → 2026-06-09: 118/122 |
| Picos | 2026-05-26: 42 (02:02–03:35 UTC y ~15:00); 2026-06-05: 15 (10 entre 03:56 y 04:16); 2026-05-23: 11; 2026-06-04: 10 |
| Después del 2026-06-09 | 4 reportes (08 y 09 de julio). Agosto y septiembre: 0. `INDEX.md` sin activos. |
| Plataforma | Macintosh 120/122; viewports 2133 px (73), 1422 (20), 1920 (13), 2400 (11); **0 móviles** |
| Entorno | Producción 119, IP de dev 1, «manual» 1 (reporte escrito desde un generador headless del repo de dominio) |
| Modelos | «Modelo» 71, «Modelo copia» 13, «Modelo_simu» 9, «System Diagram(1)» 6, «Modelo de test 2» 4, «Laboratorio complejo de simulación» 3, HODOM (varias versiones) ~12, «apuntes HD» 1, «Comprar Pan» 1 |
| Con capturas | 82/122 (116 capturas) |
| Longitud del texto | Mediana de 14 palabras; 45 reportes de 10 palabras o menos; máximo 105 |
| Reportes con modelo adjunto | 1 |

**Lectura.** El producto se usó como banco de pruebas de *fidelidad OPM* por su propio
autor, comparándolo con OPCloud (mencionado como «referente» en 5 textos, además de
múltiples capturas comparativas). Los mensajes son telegráficos y visuales («esto no lo
podemos hacer», «mira que feo se ve», «la barra no sé para qué sirve»). Casi no hay datos
de: colaboración, modelos grandes navegados por terceros, uso móvil, importación y
exportación, versiones o restauración. **Las features que no aparecen en los bugs
(móvil, Anclaje/Centinela, submodelos, requisitos, razonamiento, tutor, Jev) no tienen
evidencia de uso.** Eso no prueba que sean inútiles, pero les quita la presunción de
necesidad.

---

## 5. Taxonomía de dolores (con conteos, ids y citas del usuario)

Los conteos son aproximados porque un reporte puede caer en dos categorías. Los ids se
abrevian al sufijo hex.

### 5.1 OPL: verbalización ausente, incorrecta o poco natural — ~24

Es el núcleo bimodal del producto y la categoría con más reportes.

- **OPL suprimido por «no canónico»**: b768d4 («que no por no tener un nombre correcto no
  se genere el opl de un proceso»), 4c5463 (ídem con estados), **76af16** (julio: «no se
  genera OPL de proceso y cuando estoy en modo taller no se forma ningún OPL»). Un primer
  fix fue **revertido** (cf27104d→f0faf77f) porque solo relajaba el panel y dejaba
  divergentes el editor libre, los exports, el móvil y la skill.
- **Transiciones de estado**: affa5e («cargar cambia objeto desde bueno»), 83aad5
  («procesar cambia objeto a bueno»), f314c4 (el efecto TS3 compacto se emitía como
  «afecta» y perdía el par de estados en todo el bundle HODOM), 59993d («P cambia
  exactamente 1 de B en s1, B en s2 o B en s3»).
- **Multiplicidad**: eec502 («igual que opcloud en cuanto a +, *»), 45dbc2 («techo
  descapotable opcional… no deja usar el símbolo ?»), 84a6ed (plural de opcionales),
  30f6ea, 810e7d, 35087a («sigue sin… aceptar símbolos como ?»).
- **Prosa**: bf4e25 («El coche se maneja con el volante»), f897bc («más prosaico con
  copulativos»), 923dcf (Logical AND compuesto en una sola oración, como OPCloud).
- **Abanicos y efecto**: 7b49ec (abanico de efecto objeto→procesos), 276ea7 («sigue
  estando muy mal el opl de esto», **4 reaperturas en un día**), c37715 (modificador no
  capturado en OPL).
- **Rutas**: c96ad9 y a4d837 (paths de estado sin lógica; reutilizaban la salida).
- **Preview**: 9bc7e0 (el preview del menú degradaba el extremo Estado al objeto dueño).
- **Preguntas de semántica** (no son bugs): 0e3997 («si ya se declara en sd, ¿de nuevo en
  sd1?»; respuesta: el OPL de cada OPD verbaliza sus apariencias), 142989 («¿cómo
  funciona lo de las variantes?»).

### 5.2 Semántica de enlaces con estados y qué se puede conectar — ~14

bfb79a («un objeto no puede afectar a un proceso»), 5d7651 («¿un efecto puede afectar un
estado específico?»), 0c3cde y f22ba6 (dividir el efecto en par input/output; «split del
enlace no funcionó»), 82cc4f («que se pueda iniciar y terminar los enlaces en los
estados»), 9ce8c1, f77842, 916191 («tras ello no se pueden realizar más enlaces de ningún
tipo»), b0416c (ghost del enlace bajo el objeto), fb6c2c (reanclar estructurales),
cc4801 (asignar probabilidades en la UI), 738f53 (agregar atributos), af718d y e12ad9
(raíz del bus estructural = grupo, no primera rama).

### 5.3 Notación visual canónica frente a OPCloud — ~19

Flechas transformadoras (7fcdba reabierto, ad14a6, 16a874, **66ff2f «después de muchos
intentos, aún no tenemos la flecha canónica»**), autoinvocación (06f1ed, reabierto),
estado como rountangle (9e3b9b), contorno continuo del proceso sistémico refinado
(a8c184), sombras física/informacional (6ae261, 4e8a3e, f28eb5), anclaje centrado
(7264f4), cápsulas que truncan la última letra (7ae086: «competent», «programad»), ruteo
«bus/abanico» automático (6a6a06), etiqueta de ruta en ambos enlaces (e1458f, ffe132),
ids `o.13` visibles (c65ba1).

### 5.4 Interacción directa en el canvas (estados, drag, resize) — ~16

a41f5c («no se pueden redimensionar ni las cosas ni los estados»), 00f799 (no se pueden
eliminar estados), e7fe11 (sin halo al seleccionar estados), 9cad06 y 67d9e3/1daba8
(«estado volador»), **la cascada del 2026-06-05** (422d7d feat → b91e85 «mira la
secuencia desastrosa tras tu intento de arreglar el bug. un desastre» → 0cdec2, 1637da,
eb3b17, 0c6ed9, fcaeaf), b2477a (alinear/distribuir «solo funcionó una vez»), 2c59cf
(swipe de trackpad = atrás del navegador).

### 5.5 Simulación — ~10

Integración con rutas (df336b, 37ebd2 «simula 1 solo paso en vez de 2»), visual (5f7132
«mira que feo se ve la representación visual de simulación»), inicio y fin visibles
(551dbf) y **la barra de simulación en cadena** (f23d0a, 52df54, 42c24c, a8e599, 17477a;
ver §6.2). La auditoría UX sumó C-1 (se podía editar dentro de la simulación y la acción
fallaba en silencio) y M-6 (la barra decía «Listo para simular» y «completado» a la vez).

### 5.6 Viewport, centrado y encuadre — 7 (regla del usuario muy estable)

ad9486 (canvas «infinito» y zoom menos sensible), 276694 («la primera cosa en el centro
del canvas… y se fije la vista en ese punto»), afcfbe (reabierto: «debes identificar el
centro geométrico del canvas y poner las nuevas cosas en torno a él»), b6be2b (al refinar,
el foco volvía a la esquina), 029853 («inclumpliendo la regla de que todo se tiene que
armar y ordenar a partir del centro geométrico»), dd058f (una cosa creada en in-zoom
quedaba dentro del contorno), 9de6df (julio: renombrar con doble clic desenfoca; «cada vez
hay que recentrar manualmente»).

### 5.7 Atajos de teclado — 6

445a97 (O objeto, P proceso, S estado con objeto seleccionado), 58fefc (los atajos no
funcionaban tras cambiar de vista hasta usar un botón), c76a40 y **f688a1** (la «R» de
relación falló en mayo y **de nuevo en julio**: retornaba en silencio sin selección),
5a6c58 y 932476 (atajos del propio capturador).

### 5.8 Chrome del shell: barras, paneles, solapes, jerarquía — ~26

77e6cf («la barra no sé para qué sirve y no funciona»), 509ecc (scrollbar innecesaria),
6ea103 (el menú no cierra al hacer clic fuera), 895504 y 38acaa («repiensa desde 0 la
mejor distribución en esta barra. ahora es incómoda y poco funcional»), f81da4, cffd05,
1f46fe y 7f09f9 (texto cortado o solapado: header, kicker, breadcrumbs), 86aa78 (contraste
de selección), ec523c (orden del inspector: nombre, esencia, afiliación, descripción),
fbb0f1 y 3575b7 (propiedades y advertencias «compiten no funcionalmente»; el diagnóstico
pasa a la izquierda), 78ee6e, d5c889, 1372c7, d2530d y 624056 (paneles redimensionables y
ocultables), d7f92b (modo 100% canvas), 844f4e («ninguno de estos controles de este
subpanel funcionan»), 679f28 (hacer usable la vista de gestión de modelos), 98f2fb («cual
es la diferencia entre estas 2? si no hay diferencia solo deja 1»).

### 5.9 Persistencia y gestión de modelos — 3

6ce450 («no puedo guardar. al apretar el guardar no pasa nada»: «Guardar como» rechazaba
el mismo nombre del modelo actual), 679f28 y 142989.

### 5.10 Meta: el propio sistema de bugs — 6

a0d7bc («que exista una lista de los bugs y su estado para no repetirnos»), 932476,
7ff54e, 5a6c58, 86aa78 y el atajo duplicado. **El usuario pidió el ledger para no repetir
reportes.** Aun así, varios temas se reportaron 3 a 6 veces (§6), porque el problema no
era la memoria del reporte sino fixes que no cerraban la causa.

### 5.11 Pedidos de sustracción (señal de diseño clave)

| Id | Pedido literal | Resultado |
|---|---|---|
| dd0c18 | «sacar la función del mapa del sistema. no tiene valor actual» | Retirada de la UI, pero «se conserva código interno no expuesto para evitar refactor destructivo amplio» (código muerto deliberado) |
| 81ac46 | «elimina todo el sistema de hover inferior con info redundante… que no aparezca nunca más. hazte cargo de la cascada» | Se borraron 4 archivos y se limpió la unión `FeedbackOverlay`, el puerto, el slice, el adapter, OverlayLayer y JointCanvas: **7 capas para un tooltip** |
| aad990 | «esto en la barra inferior es redundante… deberíamos eliminar la barra inferior ¿cuál es su funcionalidad real?» | Eliminada (todo lo que mostraba ya existía en otra parte) |
| b5a202 | «el botón para abrir la paleta de comandos, no lo uso. saquémoslo» | Retirado |
| 98f2fb | «si no hay diferencia solo deja 1» | Deduplicado |
| c65ba1 | «¿podemos sacar los id tipo 0.13 de las cosas?» | Ocultos en el canvas |
| 1f46fe | «barra superior desproporcionadamente alta» | 60→48 px |
| 17477a (ronda 2) | La auditoría eliminó la tag «Simulación», el chip «sin plan» y el `modo` duplicado | — |
| M-4 / M-5 (UX) | Inspector de 2,1 pantallas; jerga «MARGINALIA», «Selection», «Y 2483», «re-elicitación» | Parcialmente corregido (hoy `FichaSeccion` es colapsable) |

**Conclusión para la reescritura:** el usuario valora *menos superficie, más canvas, cero
redundancia*. Ninguna eliminación produjo quejas posteriores.

---

## 6. Bugs recurrentes y cadenas de regresión (la evidencia de complejidad accidental)

### 6.1 Estados en el canvas: oscilación de diseño en 10 días

1. 05-26 a41f5c: «no se pueden redimensionar… estados» → se agregan handles de resize y
   `width/height` persistidos por estado.
2. 05-26 9cad06: «estado volador» al hacer clic. Se da por resuelto por el cambio de
   forma (9e3b9b), una causalidad dudosa.
3. 06-05 03:24 422d7d (feat): «que las cápsulas de estado se puedan mover».
4. 06-05 03:56–04:16: **10 reportes** en 20 minutos (estado volador de *otro* estado,
   desplazamientos acoplados estado↔objeto, resize en todas direcciones, estado que sale
   del objeto, no se puede enlazar desde estado a proceso, ghost debajo del objeto) y
   b91e85: «un desastre».
5. Resolución: «se retiró la geometría libre de estados: las cápsulas son layout-managed,
   no se arrastran ni redimensionan».
6. Luego el ledger de 422d7d se reescribió (validado el 2026-07-18) diciendo lo contrario:
   «las cápsulas pueden arrastrarse… x/y se persiste y el renderer la limita». El código
   actual (`render/jointjs/composers/estados.ts:42-48,107,166`) usa `estado.x/width` con
   clamp.

**Qué revela:** el estado es un sub-elemento del objeto, pero el renderer lo trata como
elemento JointJS parcial. Anchors de conexión, handles de resize y drag custom compiten por
el mismo `pointerdown`, y JointJS entrega `element:pointerup` a la vista de origen del
gesto, no a la vista bajo el cursor (916191). Hay tres fuentes de geometría: layout
automático, x/y manual persistido y clamp del renderer, más el orden de markup de los
handles («con selección única los 8 resize handles se dibujan exactamente sobre los 8
connect-anchors y los tapan», 916191). **Recomendación:** en la reescritura, los estados
deben ser layout-managed dentro del objeto, sin geometría persistida. Si se quiere
reordenarlos, basta un orden (`Estado.orden`, ya firmado como semántico) y no x/y libres.
Enlazar desde un estado debe ser un gesto único y explícito.

### 6.2 Barra de simulación: cuatro fixes, cada uno causa del siguiente

| Paso | Reporte | Fix | Efecto colateral |
|---|---|---|---|
| 1 | 1f46fe (header alto) | header 60→48 px | La barra de simulación tenía `top: 60` hardcodeado |
| 2 | 52df54 «se va descuadrando» | `alignItems: flex-start`, narrativa `flexBasis 100%`, `maxHeight 90px`; se exporta `s` y se agrega su tipo `EstilosBarra` de 32 entradas para testear estilos | La barra crece a 3 filas y hace más visible el hueco del paso 1 |
| 3 | 42c24c «filtrándose visualmente el fondo» | constante `CODEX_HEADER_HEIGHT` + JSDoc «SSOT» + 3 tests | — |
| 4 | a8e599 «diferénciate… sorpréndeme» + tapaba los botones de ocultar paneles | La barra pasa de overlay fijo a slot `topbar` del canvas; spines crimson con gradiente, live dot pulsante, 5 tests más | — |
| 5 | 17477a «botones que parezcan más botones» | Ronda 1: 10 cambios y 8 tests de estilos. Ronda 2 tras una «auditoría ux-design» de 22 hallazgos: 10 correcciones más. Hubo ronda 3. Se generó una sonda de prod de 11 checks | **23 KB de reporte** por una frase de 13 palabras |

Hoy `BarraSimulacion.tsx` tiene 1171 líneas con **28 comentarios `BUG-…`** y
`BarraSimulacion.styles.test.ts` tiene 320 líneas que afirman valores CSS
(`s.tag.letterSpacing === "0.12em"`, `s.barraSpine.width === 3`, `s.narrativa.maxHeight
=== "90px"`). Son *change-detector tests*: no protegen comportamiento, congelan decisiones
estéticas y encarecen cualquier cambio.

**Qué revela:** layout con posicionamiento absoluto y fijo acoplado a medidas de otro
componente; CSS-in-JS sin pseudo-clases (se inyectan `<style>` a mano para `:hover` y
`:focus`); y una cultura de «anclar invariantes» con tests sobre literales de estilo.
**Recomendación:** la barra de simulación como región del layout, no como overlay, con CSS
real (clases o tokens) y ningún test sobre valores de estilo. Verificar con un escenario
de navegador que compruebe que nada queda cubierto.

### 6.3 Efecto objeto→proceso: flip-flop semántico

1. 05-26 bfb79a: «un objeto no puede afectar a un proceso» → la validación rechaza el
   efecto Objeto→Proceso suelto.
2. 06-03 7b49ec: el patrón OPCloud «abanico lógico de efecto desde un objeto hacia
   procesos» se permite *solo* como rama de abanico O/XOR. Si queda suelto,
   `efecto-direccion-canonica` da error (`modelo/validaciones.ts:98-112`).
3. 06-03 276ea7 (4 reaperturas el mismo día): el OPL invertía la semántica («O afecta P»).
   Cierre final: «el efecto OPM siempre lo ejerce un proceso sobre un objeto; un objeto no
   afecta procesos». La oración queda en forma pasiva «O es afectado por exactamente uno de
   P, Q y R», con variantes para evento y condición. El parser acepta la forma legacy solo
   como entrada y la normaliza.

**Qué revela:** faltaba una regla OPM explícita y centralizada sobre la dirección del
efecto. Se infirió caso a caso en la validación, la firma de creación, el generador y el
parser, en cuatro lugares. **Recomendación:** una tabla única de firmas legales de enlace
(tipo × extremo origen × extremo destino × contexto de abanico) consumida por kernel, UI,
OPL forward y reverse.

### 6.4 Supresión del OPL por nombre placeholder (R-ENT-2): regla autoimpuesta contra el uso

- La auditoría de alineación OPL (05-26) marcó como bug de severidad alta que
  `entidadOplEsEmitible` «siempre emite» y pidió **conectar la supresión**.
- Ese mismo día el usuario reportó dos veces lo contrario (b768d4, 4c5463): quería ver el
  OPL aunque el nombre no fuera canónico. Se relajó.
- En julio (76af16), en el modo *apunte* (boceto), los procesos nacen como «Proceso1…» y
  **todo el OPL desaparecía**. El primer fix se revirtió. El fix final crea un *régimen*
  «R-ENT-2-APUNTE» que atraviesa panel, editor libre, export Markdown, documento canónico,
  skill, mesa y móvil (`opl/opciones.ts:4-17`, `opl/generar.ts:78`,
  `opl/exportarMarkdown.ts:5`), con bump de spec v1.3.0.

Código vigente (`app/src/opl/generadores/refsHints.ts:212-218`):

```ts
export function entidadOplEsEmitible(entidad: Entidad, esApunte = false): boolean {
  // R-ENT-2 (spec-forja-opl-es): un proceso con nombre placeholder no produce
  // OPL canónica. Excepción de apunte: el boceto emite todo su OPL; el
  // diagnóstico de nominación sigue avisando por separado.
  if (entidad.tipo === "proceso") return esApunte || !esNombreProcesoPlaceholder(entidad.nombre);
  return true;
}
```

`esNombreProcesoPlaceholder` (`modelo/nombresCanonicos.ts:43-48`) reconoce `proceso`,
`proceso N` y `proceso parte [N]`.

**Qué revela:** una regla editorial del canon local se impuso como supresión silenciosa
de la bimodalidad OPD↔OPL, que es el invariante del producto, y obligó a multiplicar
«regímenes». **Recomendación:** el OPL siempre verbaliza lo que existe en el OPD. La
calidad del nombre es diagnóstico, nunca supresión. Si se conserva una forma «canónica
de publicación», que sea un perfil de export explícito, no el comportamiento del panel.

### 6.5 Flechas y marcas «canónicas»: iteración sin especificación visual cerrada

7fcdba (reabierto), ad14a6 («siguen siendo anómalos»), 16a874 (superado) y 66ff2f («después
de muchos intentos»). El criterio cambió en el camino: la invocación usó swallowtail, luego
rayo más swallowtail. 06f1ed se reabrió porque se emitía un vértice por tramo en vez del
zigzag de cuatro vértices de OPCloud. **Qué revela:** faltaba una especificación visual con
imágenes de referencia y un test visual; la corrección se hizo por aproximación sucesiva
sobre composers JointJS. **Recomendación:** tabla de marcadores SVG con fixture visual por
tipo de enlace (una sola fuente), comparada contra las capturas de OPCloud que el usuario
aportó.

### 6.6 Ruteo y puertos: la emulación de OPCloud se revirtió en parte

El roadmap `opcloud-enlaces-pendientes` implementó puertos dinámicos persistidos
(`portId`), router manhattan con obstáculos, ranuras estructurales, «unificación de enlaces
con estados», sort post-drag, `beautifyConnectedLinks`, `symbolPos`, `symbolAnchors` con
editor fino y «auto anclas», y `labelPositions`. Después:
- 6a6a06: «no funciona el sistema de ruteo» → «deja de formar un bus/abanico O
  automático. La unión implícita de puertos… [se elimina]».
- 7fcdba: «`crearEnlace` persiste `portId` y… anulaba `center+boundary`» → «el render
  normal de consumo, resultado y efecto **ignora ports persistidos**».

**Qué revela:** se persistió en el modelo geometría derivable (ports), lo que produjo
inconsistencias entre lo persistido y lo renderizado. **Recomendación:** no persistir
puertos ni anclajes salvo override manual explícito. Enlaces procedurales rectos
centro→borde (lo que el usuario terminó validando) y ruteo simple para estructurales.

### 6.7 Viewport centrado: 7 reportes para una sola regla

La regla del usuario es clara y estable: *todo se crea y se encuadra alrededor del centro
geométrico del canvas; ninguna acción debe mover el encuadre sin pedirlo*. Se implementó
en piezas: fit al primer render, fit al primer elemento, posición de la siembra, proxies
al descomponer, posición libre en in-zoom y `focus({preventScroll:true})` en el rename
inline (`ui/RenombradoInline.tsx:24`, `ui/ArbolOpd.tsx:308`). **Recomendación:** un
único servicio de viewport con dos operaciones (`encuadrar(opd)` al activar o poblar y
`preservar()` en todo lo demás) y una única función de colocación de nuevas cosas.

### 6.8 Validadores duplicados: un bug «resuelto» que sigue vivo (verificado)

`validarMultiplicidad` existe dos veces con regex distintas:

```ts
// app/src/modelo/operaciones/enlaces.ts:53 — sin "?"
const MULTIPLICIDAD_CANONICA_RE = /^\d+$|^N$|^\+$|^\*$|^\d+\.\.\d+$|^\d+\.\.N$|^\d+\.\.\*$/;
// app/src/modelo/enlaceMultiplicidad.ts:14 — con "?"
const MULTIPLICIDAD_RE = /^\d+$|^N$|^\+$|^\*$|^\?$|^\d+\.\.\d+$|^\d+\.\.N$|^\d+\.\.\*$/;
```

`modelo/operaciones.ts:83` reexporta la primera, que es la que usan `ui/InspectorEnlace.tsx:157`,
`ui/inspectorEnlace/SeccionMultiplicidad.tsx:29-30`, `ui/TablaEnlaces.tsx:513` y
`ajustarMultiplicidad` (`operaciones/enlaces.ts:67`, cuyo mensaje de error dice «usa 1, +,
*, ?, …»). Se ejecutó para comprobarlo: `validarMultiplicidad("?")` desde
`modelo/operaciones` devuelve `false` y desde `modelo/enlaceMultiplicidad` devuelve `true`.
BUG-45dbc2 y BUG-35087a («sigue sin… aceptar ?») constan como resueltos. **Es el patrón
exacto de complejidad accidental: la misma regla OPM codificada dos veces, y se corrige
una sola.**

### 6.9 Atajos y silencio

La «R» falló en mayo (c76a40) y en julio (f688a1): «retornaba en silencio-cero cuando no
había cosa seleccionada». La auditoría UX C-1 encontró **8 flashes «✓ … creado» que
corrían aunque el commit fuera rechazado por solo-lectura**, y un Escape que no salía de
la simulación pese a que la barra prometía «⎋ salir». Todo esto se cerró con
`app/src/leyes/silencio-readonly.test.ts` (153 líneas). **Recomendación:** esa ley es
producto. Portarla: *ningún early-return sin mensaje; ningún éxito sin commit*.

### 6.10 Cierres dudosos y ledger sesgado a «Resuelto»

- 679f28 («hacer más usable esta vista de modelos») se cerró como «resuelto por el
  conjunto de mejoras UX de junio 1–3» (header, barra y paleta), que no tocan la vista de
  modelos.
- 48967c («esta función parece que no funciona») se cerró por «el conjunto de fixes de
  OPL».
- 9cad06 (estado volador) se cerró por el cambio de forma del estado. El mismo síntoma
  reapareció 10 días después (67d9e3 y 1daba8).
- dd0c18 retiró la feature de la UI y conservó el código muerto «para evitar refactor
  destructivo».

El ledger es 100% «Resuelto», pero la tasa real de reapertura temática (§6.1–6.9) es alta.

---

## 7. Features pedidas y por qué

| Pedido | Ids | Motivo explícito o inferido | Estado | Valor para la reescritura |
|---|---|---|---|---|
| Canvas grande/infinito + zoom suave | ad9486 | Modelos que crecen hacia los bordes | Hecho | core |
| Creación y encuadre desde el centro | 276694, afcfbe, b6be2b, 029853, dd058f | «todo se arma a partir del centro geométrico» | Hecho, en piezas | core (un servicio) |
| Atajos O/P/S/R con canvas activo | 445a97, 58fefc, c76a40, f688a1 | Modelar con teclado; la auditoría UX lo destaca como fortaleza | Hecho | core |
| Enlazar desde y hacia estados | 82cc4f, 9ce8c1, f77842, 916191 | Transiciones OPM (TS3/TS4/TS5) | Hecho | core OPM |
| Dividir el efecto en par input/output | 0c3cde, f22ba6 | Escindir TS3 en TS4/TS5 | Hecho | core OPM |
| Multiplicidad como OPCloud (`?`, `+`, `*`, rangos) | eec502, 45dbc2, 35087a | Paridad con el referente | **Parcial (§6.8)** | core |
| AND compuesto en una sola oración | 923dcf | OPL legible, como OPCloud | Hecho | important |
| OPL más natural (reflexivo, plurales) | bf4e25, 84a6ed, f897bc | Legibilidad en español | Hecho, incremental | important |
| Probabilidades de XOR en la UI | cc4801 | La semántica existía sin UI | Hecho | important |
| Agregar atributos | 738f53 | Faltaba el gesto | Hecho | core |
| Simulación con inicio y fin visibles | 551dbf | Mostrar la corrida a terceros | Hecho | marginal/important |
| Rutas (paths) en OPL y simulación | c96ad9, ffe132, a4d837, df336b, 37ebd2 | Caso Agua/Calentar (sol→liq→gas) | Hecho | important (OPM) |
| Paneles ocultables y redimensionables | 1372c7, 78ee6e, d5c889, d2530d, 624056 | Espacio para el canvas | Hecho | core de UX |
| Modo 100% canvas | d7f92b | Foco y presentación | Hecho | important |
| Diagnóstico bajo el OPL (izquierda) | 3575b7, fbb0f1 | Separar propiedades de advertencias | Hecho | layout |
| Header rediseñado | 38acaa, 895504 | «incómoda y poco funcional» | Hecho | layout |
| Mover las cápsulas de estado | 422d7d | Ordenar visualmente | Hecho, deshecho y rehecho | **cut** (usar orden, no x/y) |
| Ledger de bugs | a0d7bc | «para no repetirnos» | Hecho | simplify |
| Atajos del capturador y copiar id | 932476, 7ff54e, 5a6c58 | Fricción de reportar | Hecho | marginal |

**Nunca pedidas por el usuario** (sin reporte de uso): Anclaje/Calco/Pieza/Centinela de
Drift, vista móvil de solo lectura, Jev, tutor, manual sanitario, razonamiento F3,
submodelos y composición, requisitos, mesa de exploración. Algunas pueden tener valor OPM
(p. ej. requisitos), pero la evidencia de esta área no las respalda.

---

## 8. Reglas OPM codificadas que emergieron o se precisaron vía bugs (catálogo sagrado)

Son las reglas que el uso real validó o forzó a precisar. Se cita la ubicación vigente
verificada. La reescritura debe preservarlas; conviene centralizarlas en tablas únicas.

| # | Regla | Ubicación vigente | Origen |
|---|---|---|---|
| R1 | **Dirección del efecto**: el efecto lo ejerce un proceso sobre un objeto (Proceso→Objeto/Estado). Estado→Proceso vale solo como efecto de entrada escindido. Objeto→Proceso vale **solo** como rama de abanico lógico O/XOR; suelto es error `efecto-direccion-canonica` | `app/src/modelo/validaciones.ts:98-112` (`reglaEfectoDireccionCanonica`, `efectoObjetoAProcesosEnAbanicoLogico`); cita R-EFE-1 | bfb79a, 7b49ec, 276ea7 |
| R2 | OPL del abanico de efecto con objeto común y procesos alternativos, en pasiva: «O es afectado por exactamente/al menos uno de P, Q y R.»; con evento: «O inicia exactamente uno de P, Q y R, y es afectado por el proceso que ocurre.»; con condición: «Exactamente uno de P, Q y R ocurre si O existe, en cuyo caso afecta O, de lo contrario se omite.» La forma legacy «O afecta a…» solo como entrada | `app/src/opl/generadores/abanico.ts`, parser | 276ea7 |
| R3 | **Transición TS3/TS4/TS5**: «P cambia O de `e1` a `e2`», «…de `e1`.», «…a `e2`.», también para el efecto TS3 compacto con `estadoEntradaId/estadoSalidaId` | `app/src/opl/generadores/procedural.ts:146` (`oracionTransicionEstados`), `:407` (`oracionEfecto`); campos en `app/src/modelo/tipos/enlace.ts` | affa5e, 83aad5, f314c4 |
| R4 | **Modificadores c/e/¬**: solo en procedurales; nunca en resultado, invocación, excepciones temporales ni enlaces TS4/TS5 escindidos (AP-01/02/03/08/10, V-240) | `app/src/modelo/modificadores.ts:198-209` (`validarModificadorEnlace`); P1 de la auditoría integral, **ya corregido** | Auditoría integral #1 |
| R5 | **Estados «puede estar» ≠ especialización «puede ser»** | `app/src/opl/parser/parsear.ts:158-171` (solo acepta «puede estar»); P1 **ya corregido** | Auditoría integral #2 |
| R6 | **Estructurales no aceptan extremos Estado** (V-237/V-239) | `app/src/modelo/operaciones/helpers.ts:68`, `modelo/validaciones.ts:224` | fb6c2c |
| R7 | **Contorno**: sólido = sistémico, discontinuo = ambiental. Persiste a través de niveles. El refinamiento se marca con trazo grueso, no con discontinuidad (R-CTRN-1/V-71). La afiliación se hereda por la cadena de exhibición (V-6/R-OPD-STR-13) | `app/src/render/jointjs/composers/entidad.ts:102-113` | a8c184 |
| R8 | **Estado = rountangle** (radio fijo), no píldora | `composers/entidad.ts:878-885` | 9e3b9b |
| R9 | **Esencia física = sombra** (canal semántico, no decoración). Informacional sin sombra | `composers/entidad.ts:123-133` | 6ae261, 4e8a3e |
| R10 | Transformadores (consumo, resultado, efecto e invocación) con **swallowtail cerrado**; invocación con rayo/zigzag; autoinvocación con zigzag de 4 vértices por tramo | `composers/markers.ts`, `render/jointjs/autoinvocacionLoop.ts` | 66ff2f, 06f1ed |
| R11 | **Multiplicidad**: `1, 0..1, N, 0..N, +, *, ?, 1..*, 2..*`, más `d`, `d..d`, `d..N`, `d..*`. `?` es singular opcional («un X opcional») y se verbaliza en OPL, sin símbolos crudos (R-MULT-1) | `app/src/modelo/enlaceMultiplicidad.ts:7-21` (la correcta) y **duplicado incorrecto** en `modelo/operaciones/enlaces.ts:53` | eec502, 45dbc2, 35087a, 810e7d |
| R12 | **Rutas de estado (`rutaEtiqueta`)**: el OPL y la simulación emparejan consumo-desde-estado con resultado-hacia-estado **por etiqueta de ruta**; las etiquetas libres no participan; un resultado no se reutiliza entre paths; la simulación encadena rutas sobre el mismo objeto en ocurrencias sucesivas | `opl/generadores/procedural.ts:32,134-163`; `modelo/simulacion/plan.ts:195-200` (`rutaCompartida`); `modelo/rutas.ts` | c96ad9, a4d837, df336b, 37ebd2 |
| R13 | **OPL por OPD**: cada OPD verbaliza las apariencias presentes en él; no se repiten declaraciones del padre | `opl/generar.ts` (proyección modelo×vista) | 0e3997 |
| R14 | **Probabilidades XOR**: solo en abanico XOR, suman 100%, notación `Pr = p` por rama | `app/src/modelo/abanicos.ts:122` (`definirProbabilidadesAbanico`) | cc4801; corpus #33 |
| R15 | **AND procedimental compuesto**: agrupar enlaces simples del mismo tipo y sujeto (excluye rutas, etiquetas, modificadores, estados y abanicos) | `opl/generar.ts` (`generarLineasOpl`) | 923dcf |
| R16 | **Placeholders**: `esNombreProcesoPlaceholder` suprime el OPL de procesos placeholder salvo en apunte (R-ENT-2 / R-ENT-2-APUNTE) | `opl/generadores/refsHints.ts:212-218`, `modelo/nombresCanonicos.ts:43-48` | b768d4, 4c5463, 76af16. **Recomendación: convertir en diagnóstico, no en supresión** |
| R17 | Nominación de procesos en es-CL (R-NOM-PROC-1): infinitivo o nominalización, incluidos los deverbales irregulares («Despacho», «Ingreso», «Cierre»). Solo avisa | checkers de nominación; corpus «Residuo adicional» | fe9662; auditoría SSOT |
| R18 | Agente humano (esencia física como proxy), unicidad de rol procedimental (R-ROL-UNIC-1), **AP-04 resultado→estado inicial** y R-SD-4 (exactamente un proceso sistémico) | Auditoría integral: pendientes o zonas grises | — |
| R19 | **Modo simulación = solo lectura con aviso**; ningún bloqueo en silencio; Escape sale | `app/src/leyes/silencio-readonly.test.ts` | UX C-1 |
| R20 | **Seis familias de enlace** (se agregó la «excepción procedimental» proceso→proceso: sobretiempo, subtiempo y combinada con marcas `/`, `//`) | KORA `reglas-opm-estrictas-es` v1.4.0; enlaces `excepcionSobretiempo/Subtiempo/SubSobretiempo` | Auditoría SSOT #12 |

Tensiones normativas abiertas o recientes, útiles para decidir en la reescritura (auditoría
SSOT):
- Etiqueta de ruta sobre habilitadores: se resolvió conservar R-OPL-RUTA-3.
- Abanicos convergentes de habilitadores: se admiten (la implementación ya los soporta).
- Default de la grid (activa en código; `ui-forja/08` proponía `drawGrid:false`): decisión
  de producto pendiente.
- `R-ENT-3` (oración combinada eco-OPCloud) se degradó a «extensión declarada de
  superficie»; la plantilla atómica D1–D4 es la canónica. Esto tensiona con el pedido
  923dcf (AND compuesto).

---

## 9. Patrones de sobreingeniería y lastre revelados (con ejemplos concretos)

1. **Triple fuente de verdad del estado de un bug.** `report.md` (71 siguen en «Nuevo»),
   `payload.json` y `statuses.json` (que sobrescribe), más `INDEX.md` y `HISTORY.md`
   generados y un `bugIndex.ts` de 528 líneas que además busca README mensuales que no
   existen.
2. **Documentación de cierre inflada.** Las notas de resolución incluyen conteos de gates
   («check 3132/0 + smoke 302/0 + ledger 6/6»), hashes de bundle y dominios de deploy. El
   reporte 17477a tiene 23 KB, con secciones «Handoff explícito», «Prompt breve de
   continuación» y «Riesgos… de percepción».
3. **Comentarios con ids de bug en el código de producción.** Hay 230 ocurrencias en 56
   archivos (`BarraSimulacion.tsx` tiene 28; `store/tipos.ts` tiene 8 en la interfaz del
   store). El código narra su historia en lugar de su intención.
4. **Tests que congelan estilos.** `BarraSimulacion.styles.test.ts` (320 l.),
   `CodexFrame.test.ts` (asserta 48px) y `CodexColHeader.test.tsx`
   (`gridTemplateRows: "auto auto"`). Para testear se exportó el objeto de estilos `s` con
   un tipo de 32 entradas.
5. **Sondas de un solo uso contra producción** (`sonda-bug-*.mjs`) que asumen «sesión
   autenticada y el modelo `modelo-simulacion-lab-complejo` disponible». Luego se borraron.
6. **Mockups HTML comparativos «Actual/A/B/C» por bug de CSS** (52df54, a8e599).
7. **Capas de indirección para UI trivial.** Retirar un tooltip tocó la unión
   `FeedbackOverlay`, `FeedbackPort` (`set/clear/idHoverTooltip`), el slice `feedback.ts`,
   `zustandFeedbackPort`, `OverlayLayer` y `JointCanvas` (81ac46).
8. **Gobernanza autorreferente por paneles de personas LLM.** Las actas simulan comités
   («Besto», «Resto», «steipete», «allan-kelly», «steve-jobs», «salubrista») con
   «confianza N4 (0.88)», «triple aceptación», «ciclos de refutación», «vector
   axiológico declarado» y «HITL» del mismo operador. Cuatro actas y una nota de corte
   (~1.000 líneas) sirven al Anclaje/Centinela, una feature cuyo propio duelo de valor la
   declara condicionada a un dolor «inminente-no-activo» del único usuario.
9. **Matemática categorial como justificación de features.** «adjunción Σ⊣Δ», «fibración
   de Grothendieck», «pullback estático», «Σ no tiene sección». El acta de valor lo admite
   como riesgo: «el día que "pullback" aparezca en un tooltip, Allan recupera la razón».
10. **Emulación de OPCloud por ingeniería inversa del código descompilado**
    (`opm-extracted/`, `behavioral.rules.ts`). Trajo ports persistidos, `symbolAnchors`,
    `labelPositions`, beautify y sort, parte de lo cual luego se ignoró o revirtió (§6.6).
11. **Regímenes y excepciones que se propagan por todas las superficies**
    (R-ENT-2-APUNTE, §6.4) en vez de reglas simples.
12. **Reglas duplicadas** (validarMultiplicidad ×2, §6.8) y la triplicación de constantes
    de layout INZOOM que el acta de flujo reconoce (`descomposicion.ts:38`,
    `layoutSugerido.ts:63`, `autoria/layout.ts:10`).
13. **Código muerto conservado a propósito** («Mapa del sistema»: «se conserva código
    interno no expuesto para evitar refactor destructivo amplio»). La auditoría integral
    halló además los huérfanos `sociotecnico.ts` (235 l. con solo su test) y `lifeline.ts`
    (0 consumidores).
14. **El manual y el corpus como tests** (`leyes/manual-*.test.ts`,
    `corpus-documental.test.ts`, 730 l.). Hay huellas SHA-256 de documentos en
    `app/src/tutor/fuentes.ts`, y editar un doc obliga a regenerar el corpus (auditoría
    documental).
15. **Evaluaciones especulativas de infraestructura.** La evaluación Jev propone 14
    aplicaciones de un LLM-juez sobre 24 casos sintéticos redactados por el mismo
    evaluador, sin necesidad acreditada. El propio documento reconoce que «no hay evidencia
    local de ahorro».
16. **Hallazgos técnicos de fondo** de la auditoría integral: reproyección total del grafo
    JointJS en cada clic de selección (`resetCells`), estado mutable a nivel de módulo en
    el store (causa de los flakes), unos 53 `catch` silenciosos, 105 `as unknown` en la
    frontera JointJS y `useOpmStore` re-suscribiéndose en cada render (604 sitios).

---

## 10. Partes de alta calidad que vale la pena portar (casi tal cual)

| Pieza | Por qué | Ubicación |
|---|---|---|
| Partición semántica/presentación de campos, exhaustiva por tipo | La mejor definición existente de «qué es el modelo» frente a «qué es la vista»; el typecheck falla si un campo nuevo no se clasifica | `app/src/modelo/submodelos/firmaSemantica.ts:45-157` (+ ley `leyes/anclaje-particion.test.ts`) |
| Ley «silencio cero» en solo-lectura | Invariante de UX verificable: todo bloqueo emite mensaje y no hay flash de éxito sin commit | `app/src/leyes/silencio-readonly.test.ts` |
| Contrato de persistencia con `revision` + 409, backend-only, poda de versiones y aislamiento por tenant | Simple, correcto y ya probado en producción | `app/src/server/modelPersistence.ts`; auditoría 06-04 |
| `validarModificadorEnlace` (tabla de legalidad) | Compacta y con citas AP-* | `app/src/modelo/modificadores.ts:198-209` |
| `reglaEfectoDireccionCanonica` + abanico lógico | Captura una distinción OPM sutil y la explica en el mensaje | `app/src/modelo/validaciones.ts:98-125` |
| Generadores OPL forward (31/31 fieles según la auditoría integral) y plantillas TS3/TS4/TS5 | Núcleo bimodal validado por el usuario | `app/src/opl/generadores/*` |
| Capturador de bugs, en versión mínima | Único canal de feedback; el contexto automático es útil | `bugCapture.ts` (sin `bugIndex.ts`) |
| Onboarding sin tutorial, keyboard-first y OPL como feedback continuo | La auditoría UX lo califica de «excepcional» y pide «no tocar» | UX Jobs, «Lo que ya está al nivel» |
| FNV-1a determinista + `ordenarJson` | Hash estable para golden y procedencia | `autoria/procedencia.ts:30-56` (según la auditoría integral) |

---

## 11. Lo que la auditoría UX exige conservar y lo que exige corregir (insumo directo de diseño)

**Conservar** (auditoría Jobs, 2026-06-12):
1. Cero tutorial: estado vacío con «O objeto · P proceso · R relación», chip «⌘K» y
   sugerencia del siguiente paso con un clic. Primera entidad creada en menos de 10
   segundos.
2. **Bisimetría OPL como feedback continuo** («cada gesto produce una oración en español
   en <100ms»): el diferenciador del producto.
3. Keyboard-first real (O/P/S/R, ⌘K, atajos visibles).
4. Estado del sistema visible («● Sin guardar ⌃S · ● Auto», contador de oraciones,
   diagnóstico no modal).
5. Identidad visual propia (hairlines, mono para metadata).

**Corregir en el diseño nuevo** (vigentes o recurrentes):
- **C-1** Integridad de modo: la simulación no ofrece affordances de edición.
- **M-1/M-2** Paleta de comandos a una columna, sin truncar, con ranking que prioriza el
  prefijo del label.
- **M-3** El scaffolding no se denuncia a sí mismo: rename encadenado inline al sembrar
  (Enter pasa al siguiente) y un solo aviso agrupado («N subprocesos esperan nombre»). La
  reauditoría del 07-07 midió un salto de △2 a △13 avisos al descomponer.
- **M-4** Inspector con jerarquía por frecuencia: medía 1803 px en un panel de 852 px (2,1
  pantallas) y el Centinela agregó una séptima sección. Nombre y semántica abiertos; lo
  raro plegado. Tamaño solo si hay override.
- **M-5** Sin jerga interna ni bilingüismo: «MARGINALIA», «Selection», «Y 2483», «Anotar
  para la re-elicitación», «Modelador OPM» frente a «Opforja».
- **m-4** Reencuadrar al cambiar el viewport.
- **m-6** El inspector vacío no ofrece «Notas de mesa».

---

## 12. Recomendación keep/simplify/cut por pieza del área

| Pieza | Decisión | Justificación |
|---|---|---|
| Capturador in-app (POST + contexto + capturas) | **simplify** | Canal de feedback real; agregar snapshot del modelo y del OPL; quitar la vista de ledger y el atajo duplicado |
| `bugIndex.ts` + INDEX/HISTORY/statuses | **cut** | Burocracia; basta un JSONL o issues con etiquetas; los cierres van en commits |
| Carpetas `archive/` con mockups y sondas | **cut** (la historia queda en Git) | Sin consumidores |
| Comentarios `BUG-…` en código | **cut** | La intención va en el nombre y en el test de comportamiento, no en arqueología |
| Tests de estilos literales | **cut** | Cambiar por escenarios de navegador (nada cubierto, nada solapado, texto sin overflow) |
| Auditoría de persistencia | **keep** como contrato breve | Decisiones de datos |
| Partición semántica/presentación (acta de quietud) | **keep** (contrato), cut el acta | Frontera de dominio; revisar `rutaEtiqueta` y `estadosSuprimidos` con criterio OPM |
| Auditoría SSOT del corpus | **keep** la lista de reglas y tensiones; cut el relato | Fuente de reglas |
| Auditoría integral (archivada) | **keep** como checklist de conformidad OPM | Contiene los P1 y P2 semánticos |
| Auditorías UX (archivadas) | **keep** | Mejor evidencia de producto |
| Alineación OPL (archivada) | **keep** como checklist de GAPs OPL | Bugs de canon en generadores |
| Actas Anclaje/Centinela (4) + C4 | **cut** | Sin demanda de uso; gobernanza autorreferente |
| Acta de flujo canónico | **simplify** a 5 decisiones: pivote único `modelo.v0`, IA y wizard fuera de la app, compilador proto como herramienta externa, byte-identidad/golden solo si hay consumidor, contención de refinamiento como ley | El resto es plan F0–F5 de otro producto (autoría de dominio) |
| Acta EQUILIBRIO | **simplify** a una decisión: el LLM genera afuera y la app muestra y gestiona | — |
| Acta del manual sanitario | **cut** del repo del modelador | Contenido de dominio |
| Evaluación Jev + evidencia | **cut** | Sin necesidad acreditada |
| `opcloud-enlaces-pendientes` | **cut** | Evidencia de una emulación sobredimensionada |
| Política «no abrir trabajo sin evidencia de uso, bug reproducible o decisión humana» | **keep** (principio) | Es el antídoto contra la acreción que el propio repo formuló |

---

## 13. Implicancias concretas para la reescritura (derivadas de la evidencia)

1. **Una sola fuente por regla OPM.** Tabla de firmas legales de enlace (tipo × extremos
   × contexto de abanico × modificadores) y tabla de multiplicidades, consumidas por
   kernel, UI, OPL forward, parser reverse e import. Esto mata las clases §6.3 y §6.8.
2. **El OPL nunca suprime lo que el OPD muestra.** La calidad de nombre es diagnóstico.
   Los «perfiles» (publicación o canon) solo aplican al export explícito.
3. **Estados layout-managed** dentro del objeto; orden como dato semántico; sin x/y
   libres ni handles propios; enlazar desde un estado es un gesto claro.
4. **Viewport con una política explícita**: encuadrar al activar o poblar un OPD,
   preservar en todo lo demás y colocar las cosas nuevas alrededor del centro visible.
5. **No persistir geometría derivable** (ports, anclajes y posición de labels salvo
   override). Enlaces procedurales rectos centro→borde.
6. **Especificación visual con fixtures SVG** por tipo de enlace y cosa, comparadas contra
   las capturas de OPCloud del usuario (una sola iteración).
7. **Modos con integridad**: la simulación es de solo lectura, sin affordances de edición
   y con aviso ante cualquier intento.
8. **Shell mínimo**: canvas + OPL + inspector plegable, paneles ocultables y
   redimensionables, modo solo canvas. Sin barra inferior, sin duplicados en la paleta,
   sin jerga.
9. **Scaffolding amable**: rename encadenado al sembrar y avisos agrupados.
10. **Capturador mínimo con snapshot del modelo** para que cada bug sea reproducible. Los
    cierres se registran en el commit, no en tres archivos.
11. **Tests de comportamiento, no de estilo**: leyes semánticas (roundtrip OPD↔OPL,
    legalidad de enlaces, silencio cero) y escenarios de navegador para layout, sin
    literales CSS.
12. **Sin comités simulados.** Las decisiones de producto se registran como decisiones
    breves con evidencia (bug, caso o uso) y no se citan desde el código.

---

## 14. Límites de este análisis

- Todo el registro proviene de **un solo usuario-autor**. Refleja sus prioridades de
  fidelidad OPM frente a OPCloud, no las de modeladores externos.
- La mediana de 14 palabras obliga a inferir desde capturas (no se abrieron las 116 PNG;
  se usaron el diagnóstico y el cierre escritos).
- La historia Git del clon es superficial (69 commits), así que las reaperturas se
  reconstruyeron desde las notas del ledger, no desde commits.
- Las auditorías archivadas se leyeron desde Git; sus afirmaciones de estado son de su
  fecha. Se verificó en el código vigente que P1-#1 (modificadores), P1-#2 («puede ser»),
  M-4 (inspector plegable) y M-6 (texto «Simulando») ya están corregidos, y que la
  divergencia de `validarMultiplicidad` sigue viva.
- «Sin reporte» no equivale a «sin valor»: las features no mencionadas (requisitos,
  submodelos, móvil) necesitan otra fuente de evidencia antes de decidir su corte.
