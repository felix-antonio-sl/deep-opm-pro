# Dossier — Validación, análisis y features derivadas del modelo (`app/src/modelo`)

- **Fecha de estudio:** 2026-09-30
- **Alcance:** `checkers.ts`, `validaciones.ts`, `validadores/`, `diagnostico*.ts`, `estadoCierre.ts`,
  `documentPolicy.ts`, `requisitos.ts`, `review.ts`, `hechos/`, `changes/`, `equivalencia/`,
  `razonamiento/`, `metricasComplejidad.ts`, `anclasNormativas.ts`, `paridadOpcloud.ts`,
  `capacidadesOpcloud.test.ts`, `perfilDiagrama.ts`, `exportarDiagnostico.ts`, `decision.ts`,
  `logDecisiones.ts`, `fichaTrabajo.ts`, `estereotipos*.ts`, `mesaExploracion.ts`, `notasMesa.ts`,
  `preguntaGuia.test.ts`, `procedenciaPanel.ts`, `shareSanitization.ts`, `tituloRegla.ts`,
  `submodelos.ts` + `submodelos/`, `reuse/`, `composicion/`, `opdSueltos.ts` (Apunte/Boceto).
- **Método:** lectura completa del código fuente del área (~8.170 LOC fuente; ~10.600 LOC de tests
  solo en la raíz de `modelo/`), rastreo de consumidores de producción con `grep`, lectura de specs
  vigentes (`2026-07-27-taller-modelos-ciclo-reversible-design.md`, registro de conformidad SSOT) y
  **cinco sondas ejecutables** (bun) que confirman defectos (ver §8). No se editó el repositorio.
- **Autoridad:** el corpus KORA (`urn:fxsl:kb:reglas-opm-estrictas-es`, etc.) no está instalado en
  este entorno; los identificadores de regla (R-*, V-*, §*) se catalogan tal como el código los cita.

---

## 1. Resumen ejecutivo

1. El área mezcla tres cosas muy distintas bajo el mismo directorio: **(a)** validación OPM real
   (firma legal de enlaces, transformación, refinamiento, estados, abanicos), **(b)** la maquinaria de
   diagnóstico (unificación, severidad, régimen Apunte/Modelo, cierre formal, export) y **(c)** una
   docena de *extensiones meta* y features de circunstancia (anclas normativas con ratificación,
   log de decisiones para una skill externa, mesa de exploración, notas de mesa, ficha de trabajo,
   piezas reutilizables con manifiesto, submodelos materializados, composición, review compartido,
   razonamiento, "capa categorial").
2. **Las reglas OPM son valiosas y en general correctas**, pero están repartidas en **tres
   productores paralelos** (`validaciones.ts`, `checkers.ts`, `diagnosticoVisual.ts`) con **tres
   tipos de aviso**, **tres escalas de severidad** y dos nombres `SeveridadAviso` que significan
   cosas diferentes. Un cuarto módulo (`diagnostico.ts`) los reconcilia con un mapa de
   "códigos equivalentes" y deduplicación por orden de inserción; un quinto
   (`diagnosticoSeveridad.ts`) reclasifica por tabla, ignorando la severidad que el propio checker
   declaró.
3. La firma legal de enlaces vive **dos veces**: como guard de edición
   (`operaciones/helpers.ts:58 validarFirmaEnlace`) y como diagnóstico post-hoc
   (`validaciones.ts` 6 reglas). La integridad referencial vive **dos veces**: fail-first en
   `integridadReferencial.ts:27 validarReferenciasOpd` (hidratación y cambios) y list-all en
   `diagnosticoVisual.ts` (`visual-*`).
4. **Defectos verificados con sondas** (ver §8): falso positivo de
   `DESCOMPOSICION_NO_PRESERVA_FRONTERA`; falso positivo de `PROCESO_SISTEMICO_DESCONECTADO` en la
   cadena procedural más elemental; notas/anclas/satisfacciones colgantes tras eliminar una entidad
   **vuelven el documento no hidratable**; `componerModelos` **descarta toda la metadata** del
   modelo A; la consulta `alcanzable` responde "NO alcanzable" para transiciones TS3 y pares
   escindidos (la forma canónica del cambio de estado).
5. Hay código muerto o solo-test: `paridadOpcloud.ts`, `hechos/` (+ `simulacion/integracionHechos.ts`),
   `equivalencia/verticalidad.ts`, `agruparPorSeveridad`/`resumenSeveridades*`,
   `registrarPadreSubmodelo`, campos `score`/`opdsBloqueadosPorDensidad`/`maxAparienciasEnOpd` de
   métricas.
6. Piezas de muy alta calidad para portar casi tal cual: `submodelos/firmaSemantica.ts` (partición
   exhaustiva por tipo, verificada por el typechecker), `changes/apply.ts` (lote semántico con
   precondiciones, diff por ruta, inversa verificable), `decision.ts`, `shareSanitization.ts`,
   `review.ts#projectReviewModel`, `equivalencia/verificar.ts` (con honestidad epistémica explícita),
   el léxico es-CL de `checkers.ts`.
7. Recomendación global: **un registro único de reglas** con clase declarada
   (`integridad` / `validez` / `método` / `estilo`), un único tipo de hallazgo, una única función
   de severidad por régimen y un índice precomputado del modelo; **una única tabla de firma legal**
   consumida por guard y diagnóstico; **un único tipo de referencia a elemento** (hoy hay siete);
   y recortar/aislar las extensiones meta de circunstancia fuera del núcleo `Modelo`.

---

## 2. Inventario de módulos

Leyenda de valor: **N** = núcleo OPM · **I** = importante · **M** = marginal · **A** = acreción.
"Prod" = archivos de producción (no test) que lo importan.

| Módulo | LOC | Propósito real | Prod | Valor | Recomendación |
|---|---:|---|---:|:-:|---|
| `checkers.ts` | 903 | 19 checks metodológicos (`AvisoMetodologico`) + helpers `contornoDeOpd`, `subprocesosInternosDeOpd` reusados por integridad | 2 | N | **simplify**: migrar al registro único; corregir 2 falsos positivos |
| `validaciones.ts` | 547 | 15 reglas de consistencia (`Aviso`): firma legal, duplicados, agente/instrumento, densidad | 8 | N | **simplify**: fusionar con checkers; firma legal vía tabla única |
| `diagnosticoVisual.ts` | 528 | 19 reglas `visual-*`: integridad referencial/geométrica + 3 reglas de realización del in-zoom | 1 | I | **simplify**: separar integridad (fusionar con `validarReferenciasOpd`) de realización (registro) |
| `diagnostico.ts` | 254 | Unifica 3 productores → `AvisoDiagnostico`, equivalencias de código, dedupe, alcance por OPD | 12 | I | **simplify**: desaparece con el registro único |
| `diagnosticoSeveridad.ts` | 184 | Tabla código→severidad, whitelist de degradación en Apunte, mapeo de escalas | 8 | I | **simplify**: severidad = f(clase, régimen) |
| `tituloRegla.ts` | 114 | Títulos humanos por regla + fallback slug | 1 | M | **simplify**: el título vive en la definición de la regla |
| `estadoCierre.ts` | 63 | Resumen de cierre (integridad/cierre/mejoras/bocetos) evaluando severidad dos veces | 3 | I | **keep (concepto)** / simplify implementación |
| `exportarDiagnostico.ts` | 104 | JSON serializable del diagnóstico (portapapeles, contexto skill) | 2 | M | **keep** reducido (es `Hallazgo[]` serializado) |
| `perfilDiagrama.ts` | 38 | Densidad por OPD (advertencia ≥21, bloqueo >25 apariencias) | 4 | M | **simplify**: heurística configurable; no bloquear export |
| `metricasComplejidad.ts` | 29 | Conteos + `score` inventado | 1 | A | **cut** (dejar conteos inline donde se usan) |
| `paridadOpcloud.ts` | 60 | Lista de 39 reglas OPCloud y 7 "implementadas" | 0 | A | **cut** |
| `capacidadesOpcloud.test.ts` | 342 | Test de integración de capacidades varias (ontología, split, decisión, requisitos, submodelos) | — | — | redistribuir en tests por capacidad |
| `preguntaGuia.test.ts` | 115 | Test de `Opd.preguntaGuia` en refinamientos/adopción | — | — | keep (el campo es útil y barato) |
| `validadores/valorSlot.ts` | 61 | Valida valor de slot de atributo (integer/float/char/string) | 4 | I | **keep** |
| `decision.ts` | 160 | Resolución de decisión en abanico XOR (estado fijo, uniforme, probabilidades, función) | 2 | I | **keep** (mover a simulación) |
| `requisitos.ts` | 248 | Requisito = objeto estereotipado + satisfacciones + requirement-view | 1 (barrel) | M | **simplify** |
| `estereotipos.ts` | 37 | Catálogo fábrica (`est:requirement`) + resolución | 10 | M | keep mínimo |
| `estereotiposVitrina.ts` | 32 | Agrupa catálogo por forma de plantilla | 1 | M | keep (UI) o mover a `app/` |
| `notasMesa.ts` | 80 | CRUD de notas de revisión ancladas | 4 | M | **simplify**: unificar con anotaciones de review |
| `anclasNormativas.ts` | 51 | Consultas sobre anclas normativas | 5 | A/M | **simplify/aislar** (dominio sanitario) |
| `logDecisiones.ts` | 154 | Ciclo de ratificación y LogDecisiones v0 para la skill `re-elicitar` | 1 | A | **cut del núcleo** (plugin de integración) |
| `procedenciaPanel.ts` | 33 | Texto de panel para sello de procedencia | 1 | M | cut (inline en viewmodel) |
| `fichaTrabajo.ts` | 133 | Normalización/actualización de ficha, modalidad, lentes | 5 | M | **simplify** |
| `documentPolicy.ts` | 127 | Proyección de especie/propiedad/pendientes/acciones del documento | 2 | M | simplify |
| `mesaExploracion.ts` | 332 | Fuentes → trazos → propuestas → confirmación (crea 1 entidad) | 3 | M/A | **simplify fuerte** o aislar |
| `review.ts` | 151 | Tipos de review compartido + proyección pública del modelo | 7 | I | **keep** (contrato servidor) |
| `shareSanitization.ts` | 85 | Redacta credenciales en URLs públicas | 2 | I | **keep** tal cual |
| `submodelos.ts` + `submodelos/estado.ts` + `materializacion.ts` | 281+80+365 | Referencias a submodelos, materialización del SD raíz, estado de carga, firma de snapshot | 3 / 12 | M | **simplify** (campos v0 duplicados) |
| `submodelos/firmaSemantica.ts` | 347 | Proyección semántica exhaustiva por tipo (firma de drift) | vía estado | I | **keep casi tal cual** |
| `changes/` (types, apply, refinement, xor) | 728 | Lote de cambios semánticos del agente/humano con precondiciones, diff, inversa | 17 | I | **keep** (con ajustes) |
| `reuse/` (piece, compare) | 620 | Pieza reutilizable: manifiesto, copia, referencia, actualización, comparación | 6 | A/M | **simplify fuerte** |
| `composicion/` (componer, interfaz, linealidad) | 438 | Fusión A+B con compartidas; sugerencia por nombre; linealidad | 3 | M | simplify; **corregir pérdida de metadata** |
| `equivalencia/` (frontera, verificar, preservacion, verticalidad) | 276 | Firma de frontera; preservación in-zoom (F2); correspondencia (muerta) | 4 | I | keep frontera/preservación **corregida**; cut verticalidad |
| `razonamiento/derivar.ts` | 253 | 5 consultas derivadas (afectan-a, requerido-por, alcanzable, impactos) | 3 | M | keep reducido; **corregir `alcanzable`** |
| `hechos/` | 238 | Proyección a hechos atómicos + "sheaf-check" de pegado | 0 (solo tests/leyes) | A | **cut** (o conservar solo la regla de pegado en el registro) |
| `opdSueltos.ts` | 18 | Bocetos = OPD con `padreId:null` ≠ raíz | 3+ | N (método) | keep |

---

## 3. Flujo actual del diagnóstico

```
                  ┌───────────────────────────┐
 Modelo ─────────►│ validarModelo()           │ Aviso{reglaId,severidad:error|advertencia|info,citaSSOT,...}
   │              │  validaciones.ts:59       │───┐
   │              └───────────────────────────┘   │
   │              ┌───────────────────────────┐   │
   ├─────────────►│ listarAvisosVisuales(opd) │ Aviso (mismo tipo), reglaId "visual-*"
   │              │  diagnosticoVisual.ts:32  │───┤
   │              └───────────────────────────┘   │    listarAvisosDiagnostico()  diagnostico.ts:58
   │              ┌───────────────────────────┐   ├──► map a AvisoDiagnostico (16 campos)
   └─────────────►│ verificarMetodologia()    │   │     + CODIGOS_EQUIVALENTES (diagnostico.ts:46)
                  │  checkers.ts:99           │───┘     + filtro por alcance (avisoAfectaOpd)
                  └───────────────────────────┘         + dedupe por id (último gana)
     AvisoMetodologico{codigo,severidad:info|advertencia|sugerencia,ssotRef,rationale,accionesSugeridas}
                                                            │
                         severidadDiagnostico(aviso,{esApunte}) diagnosticoSeveridad.ts:167
                         ├─ metodología: SEVERIDAD_POR_CODIGO (ignora aviso.severidad)
                         ├─ resto: error→bloqueo, advertencia→mejora, info→estilo
                         └─ esApunte && código ∈ CODIGOS_VALIDEZ_DEGRADABLES_APUNTE → estilo
                                                            │
   Consumidores: PanelDiagnostico (viewmodel agrupa por regla), árbol de OPDs (badges),
   overlay del canvas (llama validarModelo directo, no el unificado), App.tsx (header, en cada
   render sin memo), DialogoGraduar (evalúa severidad 2 veces), estadoCierre (catálogo, se
   persiste en el índice), exportarDiagnostico (portapapeles), autoria/bundle (gate del compilador),
   opl/contextoSkill (contexto para la skill), VistaBusquedaLectura (móvil).
```

Observaciones del flujo:

- `validarModelo` recibe `opdActivoId` solo para **ordenar** y para elegir `opdId` preferido; no
  cambia el conjunto de reglas. El overlay del canvas (`render/jointjs/overlayCanvas/avisos.ts:13`)
  consume `validarModelo` **sin** los checkers ni los visuales, así que la marca en el lienzo y el
  panel no ven el mismo conjunto.
- `App.tsx:137` ejecuta el diagnóstico completo en cada render (sin `useMemo`), lo que con el costo
  O(n²) de varios checks (ver §9.6) escala mal.
- `estadoCierre` se **persiste como derivado** en el resumen del catálogo
  (`persistencia/modelos.ts:32 estadoCierre?: EstadoCierreModelo`) y se recalcula al guardar o al
  cargar desde backend (`persistencia/backend.ts:628`). Es un valor derivado con riesgo de desfase si
  cambian las reglas.

---

## 4. Catálogo de reglas OPM codificadas (sagradas)

Columnas: **Regla/ID** · **Ubicación** · **Qué exige** · **Severidad efectiva** (modelo / apunte) ·
**Clase propuesta** (INT = integridad mecánica, VAL = validez OPM, MET = método, EST = estilo/heurística)
· **Notas** (duplicaciones con guard de edición, defectos).

### 4.1 Firma legal de enlaces (validez de un hecho)

Guard de edición único: `operaciones/helpers.ts:58 validarFirmaEnlace` (llamado por `crearEnlace`,
reconexión, cambio de tipo en grupo, proyección de refinamiento). Diagnóstico post-hoc para modelos
importados/legacy en `validaciones.ts`:

| Regla | Ubicación | Exige | Sev. | Clase | Notas |
|---|---|---|---|---|---|
| `generalizacion-mismo-tipo` [V-239] | `validaciones.ts:228` | especialización y general del mismo tipo OPM | bloqueo / estilo | VAL | guard: helpers.ts (generalización, agregación, clasificación y etiquetado también exigen mismo tipo; el diagnóstico solo verifica generalización) |
| `estructural-no-acepta-extremo-estado` [V-237][V-239] | `validaciones.ts:214` | estructurales fundamentales no unen estados | bloqueo / estilo | VAL | guard: helpers.ts:67. Excepción: `etiquetadoBidireccional` admite estado salvo "solo en destino" [V-30] (solo en guard) |
| `excepcion-temporal-proceso-proceso` [V-239] | `validaciones.ts:195` | sobretiempo/subtiempo: Proceso→Proceso sin estados | bloqueo / estilo | VAL | guard además exige R-EXC-1A (proceso de manejo) |
| `efecto-direccion-canonica` R-EFE-1, TS3–TS5 | `validaciones.ts:98` (+ `efectoObjetoAProcesosEnAbanicoLogico` :116) | efecto Proceso→Objeto/Estado; Estado→Proceso solo como entrada escindida; Objeto→Proceso solo como rama de abanico con puerto común en el objeto | bloqueo / estilo | VAL | **Inconsistencia**: el guard acepta Objeto→Proceso entidad-entidad **siempre** (helpers.ts, rama final de `efecto`), el diagnóstico solo dentro de abanico. Se puede crear y queda en bloqueo |
| `procedural-no-objeto-objeto` [V-239] | `validaciones.ts:241` | un procedural tiene un extremo proceso | bloqueo / estilo | VAL | guard implícito por tipo |
| `agente-requiere-objeto-fisico` [Glos 3.3][Glos 3.39] R-AG-1 | `validaciones.ts:359` | agente = objeto **físico** → proceso | bloqueo / estilo | VAL | guard: helpers.ts (`agente` exige esencia física) |
| Consumo/instrumento/resultado/invocación | solo guard `helpers.ts:58-130` | Consumo e Instrumento Objeto→Proceso; Resultado Proceso→Objeto; Invocación Proceso→Proceso | — | VAL | no tienen diagnóstico post-hoc; un import ilegal no se reporta |
| AP-04 | `operaciones/enlaces.ts:114` (guard) | resultado no apunta a estado **inicial** | — | VAL | sin diagnóstico |
| R-OPD-EST-3 / V-5 | guard `enlaces.ts:121-128`; diagnóstico `EFECTO_OBJETO_SIN_ESTADOS` `checkers.ts:392` | un objeto sin estados no puede ser afectado | bloqueo / estilo | VAL | par guard+residuo bien documentado |

### 4.2 Transformación, roles y unicidad

| Regla | Ubicación | Exige | Sev. | Clase | Notas |
|---|---|---|---|---|---|
| `PROCESO_NO_TRANSFORMA` R-PROC-2, V-115, §7.6 | `checkers.ts:319` (`procesoTransforma` :826, `tieneHijoTransformador` :834) | todo proceso consume, produce o afecta ≥1 objeto, directo o vía subproceso | bloqueo (tabla) aunque el checker declara `advertencia` / estilo | VAL | 3 productores del mismo hecho: `proceso-sin-entrada-ni-salida` `validaciones.ts:376` (salta procesos descompuestos) y `visual-subproceso-sin-transformado` `diagnosticoVisual.ts:294` (solo enlaces visibles del OPD). Convergen por `CODIGOS_EQUIVALENTES` |
| `PAR_TRANSFORMADOR_DUPLICADO` R-OPD-HAB-4, R-PREC-1..3 | `checkers.ts:343` | ≤1 transformador plano por par objeto-proceso fuera de abanico, sin TS3 compacto ni extremos estado | bloqueo / estilo | VAL | guard: `validarUnicidadRolPar` (`enlaces.ts:140`). Convergente con `consumo-doble-mismo-objeto` `validaciones.ts:444` [V-43] |
| `instrumento-y-agente-simultaneos` R-ROL-UNIC-1 / R-AG-1 | `validaciones.ts:416` | un objeto no es agente e instrumento del mismo proceso | bloqueo / estilo | VAL | |
| `EFECTO_SIN_TRANSICION` §3.15 | `checkers.ts:421` | efecto plano sobre objeto con estados debería declarar transición (TS3/TS4/TS5) o escindirse | mejora / estilo | MET | correcto como invitación a refinar |
| `RECURSO_LINEAL_MULTIPLES_CONSUMIDORES` F1 / R-CAT-LIN-2 | `checkers.ts:155` → `composicion/linealidad.ts:22` | un objeto `lineal` es consumido por ≤1 proceso; ramas XOR exentas | mejora / estilo | MET (extensión SSOT Forja, Anexo C) | no es ISO 19450; depende de `Entidad.lineal` |

### 4.3 Refinamiento (in-zoom / unfold)

| Regla | Ubicación | Exige | Sev. | Clase | Notas |
|---|---|---|---|---|---|
| `INZOOM_CONTENIDO_INSUFICIENTE` §7.1 | `checkers.ts:245` | una descomposición aporta ≥2 cosas internas | mejora | MET | excluye el caso sin subprocesos (lo cubre el siguiente) |
| `DESCOMPOSICION_SIN_SUBPROCESOS` §7.1, LF-19 | `checkers.ts:180` | in-zoom de proceso con ≥1 subproceso interno (no externo) | mejora | MET | |
| `UNFOLD_CONTENIDO_INSUFICIENTE` §7.2 | `checkers.ts:303` | un despliegue revela ≥2 refinadores estructurales | mejora | MET | cuenta enlaces estructurales desde la entidad en el OPD hijo |
| `INZOOM_NOMBRES_PLACEHOLDER_HIJOS` §7.1 | `checkers.ts:262` (`PLACEHOLDER_NOMBRE_RE` :88) | renombrar "Objeto_2", "<Padre> N" | mejora | EST | acopla el checker a los nombres semilla de `descomponerProceso` |
| `DESCOMPOSICION_NO_PRESERVA_FRONTERA` F2 / R-CAT-EQ-3 | `checkers.ts:130` → `equivalencia/preservacion.ts:27` → `verificar.ts:35` → `frontera.ts:11,22` | el OPD hijo ejerce sobre el contorno los mismos roles `entidad|tipo|rol` que el proceso abstracto | mejora | VAL (condición necesaria) | **Falso positivo verificado** (§8.1): la firma del OPD padre incluye enlaces de las entidades frontera con **otros** procesos |
| `subproceso-no-conecta-al-padre` [Glos 3.33] | `validaciones.ts:310` | ningún enlace explícito contorno↔subproceso interno | bloqueo / estilo | VAL | define "interno" **por geometría** (`dentroDe` :532), a diferencia de checkers (rol `contextoRefinamiento`) |
| `visual-transformador-contorno-no-distribuido` | `diagnosticoVisual.ts:261` | en una descomposición, cada transformador del contorno se proyecta a un subproceso concreto | bloqueo / estilo | VAL (realización) | |
| `visual-externo-dentro-contorno` | `diagnosticoVisual.ts:241` | una cosa externa del refinamiento no queda dentro del contorno | bloqueo / estilo | VAL (realización) | |
| `ambiental-dentro-contorno` [ISO in-zooming] | `validaciones.ts:150` | una cosa ambiental no externa debe estar dentro del contorno | mejora / estilo | MET | el id dice "dentro", el título dice "fuera": nombre confuso |
| `visual-subproceso-sin-transformado` | `diagnosticoVisual.ts:294` | cada subproceso interno transforma un objeto **visible en ese OPD** | bloqueo / estilo | VAL | converge a `PROCESO_NO_TRANSFORMA` pero con criterio local; puede quedar bloqueo aunque el checker global no acuse |
| `ORDEN_INZOOM_REFERENCIA_INVALIDA` R-IDP-0A / R-INV-2D | `checkers.ts:571` (+ barrera dura `integridadReferencial.ts:125`) | `ordenInzoom` solo en in-zoom de proceso y solo con subprocesos internos | bloqueo / bloqueo | INT | duplicado blando/duro; eliminación poda `ordenInzoom` (`operaciones/eliminacion.ts:92`) |
| `INVOCACION_REDUNDANTE_CON_ORDEN` R-INV-2B / §5.4 | `checkers.ts:524` | no dibujar invocación entre bandas adyacentes ya ordenadas | bloqueo (tabla) aunque el checker declara `sugerencia` / estilo | VAL | misma banda, saltos ≥2 o hacia atrás se conservan |
| `visual-contexto-refinamiento-huerfano`, `visual-parte-extraida-huerfana` | `diagnosticoVisual.ts:97,108` | metadata de refinamiento/parte extraída resoluble | bloqueo / bloqueo | INT | duplicado parcial de `validarAparienciasExtraidas` (`integridadReferencial.ts:98`) |

### 4.4 SD y propósito del sistema

| Regla | Ubicación | Exige | Sev. | Clase | Notas |
|---|---|---|---|---|---|
| `SD_SIN_PROCESO_PRINCIPAL` §6.1 / §6.11 | `checkers.ts:664` | el SD no vacío contiene ≥1 proceso sistémico | mejora | MET | SD vacío no avisa (buena decisión) |
| `PROCESO_SISTEMICO_DESCONECTADO` §6.4 | `checkers.ts:646` (`vecinosMetodologicos` :868) | todo proceso sistémico alcanza la función principal | mejora | MET | **Falso positivo verificado** (§8.2): la búsqueda solo recorre enlaces **estructurales** y refinamiento; A→X→B procedural se declara "desconectado". `padreRefinamientoDe` es O(n²) por nodo |

### 4.5 Estados, apariciones y OPL

| Regla | Ubicación | Exige | Sev. | Clase | Notas |
|---|---|---|---|---|---|
| `ESTADO_NOMBRE_CANONICO` R-NOM-EST-1 | `checkers.ts:196` → `nombresCanonicos.estadoTieneNombreCanonico` | estados sin nombre placeholder | mejora | EST | |
| `ENTIDAD_SIN_APARICIONES` §OPL/§apariciones | `checkers.ts:485` | toda entidad aparece en ≥1 OPD (si no, no emite OPL) | mejora | INT-blanda | exención por cadena mágica `[sin-aparicion-deliberada]` en `descripcion` (:97) |
| `imagen-estados-excluyentes` [Glos 3.39][Glos 3.68] | `validaciones.ts:177` | imagen interior y estados visibles no conviven | estilo | EST | es presentación, no OPM |
| `pegado-enlace-estado-suprimido` | `hechos/pegado.ts:39` | un OPD no muestra un enlace a un estado que suprime localmente | — (no cableado al diagnóstico) | INT | regla correcta **sin consumidor de producción** |
| `visual-enlace-extremo-no-visible` | `diagnosticoVisual.ts:207` | un enlace renderizado en un OPD tiene sus extremos con apariencia local | bloqueo | INT | duplicado de `validarReferenciasOpd` (`endpointVisibleEnOpd`) |

### 4.6 Abanicos, probabilidad y decisión

| Regla | Ubicación | Exige | Sev. | Clase |
|---|---|---|---|---|
| `PROBABILIDAD_FUERA_DE_ABANICO` V-18, §11.2, R-PROB-1 | `checkers.ts:457` | `Pr=p` solo en rama de abanico XOR | mejora | VAL (zona no canonizada: visible, no bloqueante) |
| Decisión requiere XOR con ≥2 ramas | `decision.ts:65,67` | resolver decisión solo en abanico XOR válido | — (error de operación) | VAL |
| Pesos de decisión ∈ [0,1], suman 1 (±1e-9), sin ramas ajenas | `decision.ts:146` | | — | VAL |
| Estado fijo pertenece al abanico | `decision.ts:84` | | — | VAL |
| XOR de exclusión (agente) ≥2 enlaces, sin repetidos, sin reagrupar existentes | `changes/xor.ts:14` | delega forma legal en `formarAbanico` | — | VAL |

### 4.7 Léxico es-CL (heurístico)

| Regla | Ubicación | Heurística | Sev. | Notas |
|---|---|---|---|---|
| `PROCESO_NOMBRE_FORMA_VERBAL` R-NOM-PROC-1 | `checkers.ts:215`, `esFormaVerbalValida` :746, `VERBAL_SUFIJO_RE` :48, `NOMINALIZACIONES_DEVERBALES_ES` :56 | sufijo verbal/deverbal en la primera o última palabra, o cabeza deverbal irregular curada | mejora | "Factura", "Estructura", "Mujer" pasan como proceso; aceptable como sugerencia |
| `OBJETO_NOMBRE_SINGULAR` R-NOM-OBJ-1 | `checkers.ts:230`, `esNombreObjetoSingular` :757, `CONECTORES_ES` :71, `INVARIABLES_SINGULAR` :42 | se juzga la cabeza nominal antes del primer conector; plural = termina en `s/es` salvo `is/us`; siglas 2–6 mayúsculas se aceptan | mejora | **falsos positivos**: "Mes", "Interés", "Estrés", "Compás". Clasificado "mejora", **impide `listoFormalmente`** |

El léxico curado (nominalizaciones deverbales, conectores, invariables) es conocimiento de dominio
lingüístico valioso: portarlo tal cual como tabla de datos.

### 4.8 Integridad mecánica visual (`diagnosticoVisual.ts`)

Todas severidad `error` → **bloqueo en ambos regímenes** (no están en la whitelist):
`visual-apariencia-entidad-inexistente` :54, `visual-apariencia-opd-inconsistente` :65,
`visual-geometria-apariencia-invalida` :76 (finito, w/h > 0), `visual-puerto-coordenadas-invalidas`
:88 (puertos relativos 0..1), `visual-enlace-opd-inconsistente` :129,
`visual-enlace-extremo-logico-inexistente` :143, `visual-simbolo-estructural-invalido` :155,
`visual-label-enlace-invalida` :166, `visual-enlace-modelo-inexistente` :213,
`visual-vertices-enlace-invalidos` :386, `visual-puerto-enlace-inexistente` :408,
`visual-puerto-enlace-interior` :420 (puerto debe estar en el borde, ε = 0,001).
Además `visual-solape-apariencias` :194 (estilo; O(n²) por OPD).
Y de `validaciones.ts`: `estructural-sin-duplicar` :254 (mejora; no es integridad aunque la
documentación lo lista como tal) y `orden-estructural-huerfano` :276 (metadato OPCloud
`orderedFundamentalTypes` sin enlace vigente; la eliminación ya lo limpia en
`operaciones/eliminacion.ts:175`).

La mayoría de estas condiciones ya son **rechazo duro de hidratación**
(`serializacion/validarApariencias.ts`, `integridadReferencial.ts`). En runtime solo aparecen si una
operación del kernel tiene un bug. Útiles como red de seguridad, pero deben vivir en **una sola**
función de integridad que devuelva la lista completa (hoy `validarReferenciasOpd` devuelve el primer
error y `diagnosticoVisual` reimplementa la lista).

### 4.9 Perfil de densidad y atributos

| Regla | Ubicación | Exige | Sev. | Notas |
|---|---|---|---|---|
| `canon-diagrama-densidad` "perfil canon-diagrama / EXPORT-GATE" | `validaciones.ts:80`, umbrales `perfilDiagrama.ts:4-5` (21 / 25) | ≤25 apariencias por OPD | >25 bloqueo, ≥21 mejora / estilo | **bloquea el export canónico** (`serializacion/perfilesExport.ts:50`). Heurística metodológica (Dori: OPD legible), no regla ISO |
| Valor de slot de atributo [Glos 3.4][V-163][V-164] | `validadores/valorSlot.ts:12` | integer entero, float finito, char = 1 carácter, string libre; placeholder `"value"` | error de operación | `char` cuenta unidades UTF-16 (un emoji falla) |

### 4.10 Reglas del régimen de documento (Apunte / Boceto)

| Regla | Ubicación | Exige |
|---|---|---|
| Boceto = `padreId:null` ∧ id ≠ `opdRaizId` (R-OPD-REF-20) | `opdSueltos.ts:9` | definición |
| "Boceto OPD sin integrar" bloquea export canónico de un Modelo; en Apunte observa | `perfilesExport.ts:73 gateOpdsSinAdoptar` + `CODIGO_OPD_SIN_ADOPTAR` `diagnosticoSeveridad.ts:111` | |
| Apunte relaja **validez**, nunca **integridad** (fail-closed) | `diagnosticoSeveridad.ts:113 CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`, `:167 severidadDiagnostico` | ley en `apunte-degradacion.test.ts`, `leyes/taller-*.test.ts` |
| Listo formalmente = 0 bloqueos de integridad + 0 bloqueos de cierre + 0 mejoras + 0 bocetos | `estadoCierre.ts:28` | spec `2026-07-27-taller-modelos-ciclo-reversible-design.md` §2.4 |
| Escritura bloqueada si el modelo tiene `procedencia` (upstream) | `fichaTrabajo.ts:85,106`, `changes/apply.ts:41` | |
| Contenido materializado de submodelos / vistas `readOnly` / entidades con `anclaje` no se editan | `changes/apply.ts:334 referenciasEnVistaProtegida`, `:328 referenciasExternas`, `:88-94` | |

---

## 5. Severidad, régimen y cierre: cómo funciona y qué sobra

**Hoy hay tres escalas y una tabla que las pisa:**

- `tipos/avisos.ts:31` `SeveridadAviso = "info" | "advertencia" | "sugerencia"` (checkers).
- `validaciones.ts:28` `SeveridadAviso = "error" | "advertencia" | "info"` (validaciones y visuales).
  **Mismo nombre, otra unión**; `tipos.ts:155` reexporta la primera y `diagnostico.ts` importa la
  segunda.
- `diagnosticoSeveridad.ts` `SeveridadIssue = "bloqueo" | "mejora" | "estilo"` (lo que ve la persona).

La severidad del checker **no se usa** para clasificar metodología: `SEVERIDAD_POR_CODIGO`
(`diagnosticoSeveridad.ts:19`) decide. Resultado: `PROCESO_NO_TRANSFORMA` se emite como
`advertencia` pero se muestra como **bloqueo**; `INVOCACION_REDUNDANTE_CON_ORDEN` se emite como
`sugerencia` y se muestra como **bloqueo**; `ORDEN_INZOOM_REFERENCIA_INVALIDA` se emite
`advertencia` y es **bloqueo**. Además `AvisoDiagnostico.severidad` conserva la escala cruda
(sugerencia→info), distinta de la visible: dos verdades en el mismo objeto.

**Degradación en Apunte:** whitelist por código (`CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`, 36 entradas
entre kebab-case, `visual-*` y SNAKE_UPPER) + la condición de export `opd-sin-adoptar` que ni
siquiera es regla del panel. `gateOpdsSinAdoptar` pregunta
`CODIGOS_VALIDEZ_DEGRADABLES_APUNTE.has(CODIGO_OPD_SIN_ADOPTAR)`, que es siempre verdadero:
indirección sin efecto.

**Cierre:** `clasificarEstadoCierre` (`estadoCierre.ts:28`) deduce la clase de cada aviso
evaluando la severidad **dos veces** (modo Modelo y modo Apunte) y comparando. Funciona, pero la
clase debería ser un atributo declarado de la regla.

**Qué preservar (semántica del producto, spec vigente §2.2–§2.4):**

- Dos regímenes documentales (Apunte / Modelo), sin nueva especie persistida (el bit `esApunte`
  vive en el índice del catálogo, no en `Modelo`).
- Integridad **nunca** degrada; validez y método pasan a observación en Apunte.
- "Listo formalmente" es una proyección, nunca un estado editable; graduar no repara nada.
- Graduar con pendientes es legítimo; la validación humana se declara "no registrada".

**Propuesta:** `clase: "integridad" | "validez" | "metodo" | "estilo"` en cada regla; severidad
visible = tabla 4×2 (`integridad→bloqueo/bloqueo`, `validez→bloqueo/observación`,
`metodo→mejora/observación`, `estilo→estilo/estilo`). Mover las heurísticas léxicas y de
placeholder a `estilo` para que no bloqueen "listo formalmente".

---

## 6. Contratos de datos

### 6.1 Diagnóstico (runtime; **no** se persisten salvo `EstadoCierreModelo` en el catálogo)

`tipos/avisos.ts:33-83` (textual, recortado a lo contractual):

```ts
export type CodigoChecker =
  | "PROCESO_NOMBRE_FORMA_VERBAL" | "ESTADO_NOMBRE_CANONICO" | "OBJETO_NOMBRE_SINGULAR"
  | "INZOOM_CONTENIDO_INSUFICIENTE" | "UNFOLD_CONTENIDO_INSUFICIENTE" | "PROCESO_NO_TRANSFORMA"
  | "PROCESO_SISTEMICO_DESCONECTADO" | "INZOOM_NOMBRES_PLACEHOLDER_HIJOS" | "SD_SIN_PROCESO_PRINCIPAL"
  | "RECURSO_LINEAL_MULTIPLES_CONSUMIDORES" | "DESCOMPOSICION_SIN_SUBPROCESOS"
  | "DESCOMPOSICION_NO_PRESERVA_FRONTERA" | "EFECTO_OBJETO_SIN_ESTADOS" | "EFECTO_SIN_TRANSICION"
  | "PAR_TRANSFORMADOR_DUPLICADO" | "PROBABILIDAD_FUERA_DE_ABANICO" | "ENTIDAD_SIN_APARICIONES"
  | "INVOCACION_REDUNDANTE_CON_ORDEN" | "ORDEN_INZOOM_REFERENCIA_INVALIDA";

export interface NavegacionAviso { tipo: "entidad" | "opd"; id: Id; opdId?: Id; }

export interface AvisoMetodologico {
  codigo: CodigoChecker;
  severidad: SeveridadAviso;          // "info" | "advertencia" | "sugerencia"
  entidadId?: Id;
  opdId?: Id;
  mensaje: string;
  rationale?: string;
  ssotRef?: string;
  navegarA?: NavegacionAviso;
  accionesSugeridas?: string[];
}
```

`validaciones.ts:28-39`:

```ts
export type SeveridadAviso = "error" | "advertencia" | "info";
export type ElementoAvisoTipo = "entidad" | "enlace" | "opd";
export interface Aviso {
  reglaId: string; severidad: SeveridadAviso; mensaje: string; citaSSOT: string;
  elementoTipo?: ElementoAvisoTipo; elementoId?: Id; opdId?: Id;
}
```

`diagnostico.ts:17-40` (16 campos; `reglaId`=`codigo`, `cita`≈`citaSSOT`≈`fuente`, `codigoVisible`,
`testIdCodigo` son redundancias):

```ts
export interface AvisoDiagnostico {
  id: string; origen: "validacion" | "metodologia" | "visual";
  reglaId: string; codigo: string; codigoVisible: string; testIdCodigo: string; titulo: string;
  severidad: SeveridadAviso; mensaje: string; destino: string; cita: string; citaSSOT: string;
  fuente?: string; fundamento?: string; acciones?: string[];
  avisoNavegable: Aviso | null;
  elementoTipo?: ElementoAvisoTipo; elementoId?: Id; opdId?: Id; navegarA?: NavegacionAviso;
}
export type AlcanceAvisosDiagnostico = { tipo: "opd"; opdId: Id } | { tipo: "modelo" };
```

Identidad de aviso: `${codigoCanónico}:${elementoTipo}:${elementoId}` (+`@opdId` para visuales no
equivalentes) — `diagnostico.ts:220`. Los **testids e2e** dependen de `testIdCodigo`: migrar con
cuidado o mantener el código canónico como id estable de regla.

`estadoCierre.ts:6` (se **persiste** en el resumen del catálogo, `persistencia/modelos.ts:32`):

```ts
export interface EstadoCierreModelo {
  bloqueosIntegridad: number; bloqueosCierre: number; mejoras: number;
  bocetos: number; pendientes: number; listoFormalmente: boolean;
}
```

`exportarDiagnostico.ts:12-39` (JSON copiado al portapapeles y enviado al contexto de la skill):

```ts
export interface DiagnosticoExport {
  modelo: string; fecha: string /* AAAA-MM-DD */; alcance: "modelo";
  totales: { bloqueo: number; mejora: number; estilo: number; total: number };
  sugerencias: Array<{ id: string; origen: "validacion" | "metodologia" | "visual";
    severidad: "bloqueo" | "mejora" | "estilo"; codigo: string; titulo: string; mensaje: string;
    destino: string; citaSSOT: string; opdId?: string; elementoId?: string; elementoTipo?: string }>;
}
```

### 6.2 Extensiones persistidas en `Modelo` (`tipos/modelo.ts:80`) que toca esta área

```ts
export interface Modelo {
  id: Id; nombre: string; descripcion?: string; opdRaizId: Id;
  opds: Record<Id, Opd>; entidades: Record<Id, Entidad>; estados: Record<Id, Estado>;
  enlaces: Record<Id, Enlace>; abanicos?: Record<Id, Abanico>;
  ontologia?: OntologiaOrganizacional;
  satisfaccionesRequisito?: Record<Id, SatisfaccionRequisito>;
  declaracionesNoNucleares?: Record<Id, DeclaracionNoNuclear>;
  familiasEfectosPreestado?: Record<Id, FamiliaEfectosPreestado>;
  anclasNormativas?: Record<Id, AnclaNormativa>;
  notasMesa?: Record<Id, NotaMesa>;
  mesaExploracion?: MesaExploracionV1;
  estereotipos?: Record<Id, Estereotipo>;
  procedencia?: SelloProcedencia;
  fichaTrabajo?: FichaTrabajo;
  lentesConocimiento?: LenteConocimiento[];
  submodelos?: Record<Id, SubmodeloReferencia>;
  pieceLineage?: Record<Id, PieceLineageRecord>;
  referenciaPadreSubmodelo?: ReferenciaPadreSubmodelo;
  archivado?: boolean; archivadoEn?: string; versiones?: VersionResumen[];
  crearVersionAlGuardar?: boolean; nextSeq: number;
}
```

De 27 campos, **8 son OPM** (`id…abanicos` + `nextSeq`); el resto son meta. Una reescritura debe
**leerlos todos** (compatibilidad del formato `deep-opm-pro.modelo.v0`), pero puede agruparlos en
un sobre `meta` o en colecciones de plugin.

Campos de `Entidad` relevantes (`tipos/entidad.ts:133-145`): `estereotipoId?`, `anclaje?`,
`requisito?: RequisitoEntidadMetadata`, `urls?`, `lineal?: boolean`. `Opd.preguntaGuia?` y
`Opd.ordenInzoom?: Id[][]` (`tipos/opd.ts:21,36`); `Opd.vista?: OpdVista` con
`requirement-view | submodel-view | generic-view`.

Tipos meta con contrato (`tipos/extensiones.ts`):

```ts
// :155-214
export type EstadoAncla = "vigente" | "pendiente-ratificacion";
export type NivelAutoridad = "operador-modelado" | "mesa" | "dt-seremi-legal";   // ← dominio sanitario CL en el núcleo
export type EstadoRatificacion = "pendiente" | "anotado-en-mesa" | "ratificado-con-fuente";
export type TargetAncla = { tipo: "entidad"; id: Id } | { tipo: "enlace"; id: Id } | { tipo: "opd"; id: Id } | { tipo: "modelo" };
export interface AnclaNormativa { id: Id; claveProto: string; target: TargetAncla; estado: EstadoAncla;
  referencias?: ReferenciaNorma[]; nota?: string; ratificacion?: RatificacionAncla; }
// :217
export interface NotaMesa { id: Id; target: TargetAncla; texto: string; fecha: string; }
// :291
export interface MesaExploracionV1 { schema: "deep-opm-pro.mesa-exploracion.v1";
  fuentes: Record<Id, FuenteExploracionTexto>; trazos: Record<Id, TrazoExploracion>;
  propuestas: Record<Id, PropuestaOpmExploracion>; confirmaciones: Record<Id, ConfirmacionExploracion>; }
// :311
export interface SelloProcedencia { protoHash: string; autoriaVersion: string; layoutVersion: string; doctrinaVersion?: string; }
// :548
export type DecisionPolicy =
  | { modo: "estado-fijo"; estadoId: Id } | { modo: "uniforme"; objetoId: Id }
  | { modo: "probabilidades"; pesos: Record<Id, number> }
  | { modo: "funcion"; funcionId: Id; fallback?: "uniforme" | "probabilidades" };
```

`FichaTrabajo` (`tipos/modelo.ts:67`): `preguntaHabilitante?, duenoSignificado?, responsableDecision?,
tiposModelo?: ("dominio"|"realizacion"|"introduccion-operacion")[], criterioSuficiencia?,
vidaUtil?: "respuesta-puntual"|"referencia-viva", revisarCuando?, modalidad?:
"existente"|"propuesto"|"exploratorio", historialModalidad?, revisionesHumanas?`.

`SubmodeloReferencia` (`extensiones.ts:499`) conserva **cuatro campos "compatibilidad v0"
duplicados** (`modeloId`≡`source.modeloId`, `anchorEntidadId`≡`anchor.entidadId`,
`opdVistaId`≡`materializacion.opdVistaId`, `compartidas`≡`contrato.compartidas`) y un `estado`
persistido que `refConEstadoDerivado` recalcula. `PieceManifest` (:410) y
`PieceReferenceMetadata` (:429) son **estructuralmente idénticos** salvo `schema`.

Esquemas versionados en uso: `deep-opm-pro.mesa-exploracion.v1`,
`deep-opm-pro.log-decisiones.v0` (`logDecisiones.ts:18`), `opforja.piece.v1`.

### 6.3 Lote de cambios semánticos (`changes/types.ts`) — contrato del agente/servidor

```ts
export type OperationPrecondition =
  | { kind: "idAbsent"; id: Id } | { kind: "opdExists"; id: Id }
  | { kind: "entity"; id: Id; expectedName?: string; expectedType?: TipoEntidad }
  | { kind: "state"; id: Id; expectedName?: string; expectedEntityId?: Id }
  | { kind: "link"; id: Id; expectedFingerprint?: string };
export type SemanticOperation = (OperationBase & ({ kind: "createObject" | "createProcess"; id; opdId; name; position }
  | { kind: "createState"; id; entityId; name } | { kind: "renameEntity"; entityId; beforeName; afterName }
  | { kind: "renameState"; stateId; beforeName; afterName }
  | { kind: "createProceduralLink"; id; opdId; source; destination; linkType; label? }
  | { kind: "deleteLink"; linkId } | { kind: "deleteState"; stateId } | { kind: "deleteEntity"; entityId }))
  | CreateXorExclusionOperation | CreateRefinementOperation
  | CopyPieceOperation | ConnectPieceReferenceOperation | ReplaceSubmodelReferenceOperation;
export interface SemanticChangeBatch { id: Id; operations: SemanticOperation[] }
export type ModelPath = readonly [collection: "entidades"|"estados"|"enlaces"|"opds"|"abanicos"|"submodelos"|"pieceLineage", id: Id, ...fields: string[]];
export type ChangeValidation =
  | { kind: "validated"; candidate: Modelo; effects: ValidatedEffects; diff: ModelDiff; inverse: SemanticInverse; readIds: Id[]; writeIds: Id[] }
  | { kind: "rejected"; code: "invalid-change"|"precondition-failed"|"id-collision"|"out-of-scope"|"external-owned"|"invalid-model"; message: string; references: Id[] };
```

Consumido por `server/agent/*` (repositorio Postgres/memoria, gateway, tools, http),
`store/intentHistory.ts`, `ui/agent/ChangeReview.tsx`, `persistencia/localRepository.ts`. Es un
contrato que una reescritura debe respetar (hay lotes persistidos por el servidor de agentes).
`fingerprintValue` (`apply.ts:460`, `json:` + JSON estable) es parte del contrato de
precondición `link.expectedFingerprint`.

### 6.4 Review compartido (`review.ts`) + API HTTP

Tipos: `ReviewAnchor = {kind:"model"} | {kind:"opd"|"entity"|"state"|"link"; id}`,
`ReviewAnnotation{id, shareId, documentId, revision, anchor, text, actorId, actorLabel,
actorKind:"reader"|"operator", createdAt, resolutions: ReviewResolution[]}`,
`ReviewShareRecord{..., tokenHash, revokedAt, permissions:{annotate}, snapshot: ReviewSnapshot}`,
`ReviewReaderView{share:{revision, source, modelName, capturedAt, permissions, omittedSourcesCount},
modelJson, sources, annotations}`.

Rutas (`server/modelPersistence.ts:180`, `server/review/service.ts:127-154`), raíz
`/__deep-opm/review`:

| Método | Ruta | Uso |
|---|---|---|
| GET | `/__deep-opm/review/{token}` (token `[A-Za-z0-9_-]{40,64}`) | vista pública del lector |
| POST | `/__deep-opm/review/{token}/annotations` | anotar (si `permissions.annotate`) |
| GET / POST | `/__deep-opm/review/grants` | operador: listar / crear shares |
| GET / DELETE | `/__deep-opm/review/grants/{shareId}` | operador: ver / revocar |
| POST | `/__deep-opm/review/grants/{shareId}/annotations/{annotationId}/resolve` | operador: resolver |

`projectReviewModel` (`review.ts:98`) sanea URLs, elimina `notasMesa` y filtra la mesa de
exploración a las fuentes incluidas, con cierre transitivo (trazo→fuentes, propuesta→trazos,
confirmación→todo). **Nota de privacidad a revisar:** conserva `fichaTrabajo.revisionesHumanas`
(`actorId`), `declaracionesNoNucleares`, `anclasNormativas` y `procedencia` en la vista pública.

### 6.5 Razonamiento y hechos

```ts
// razonamiento/derivar.ts:29
export type Consulta =
  | { tipo: "afectan-a"; entidadId: Id } | { tipo: "requerido-por"; procesoId: Id }
  | { tipo: "alcanzable"; entidadId: Id; estado: string }
  | { tipo: "impacto-de-eliminar"; elementoId: Id } | { tipo: "impacto-aguas-abajo"; elementoId: Id };
export interface HechoDerivado { readonly inferido: true; readonly via: Consulta["tipo"];
  readonly entidadId?: Id; readonly procesoId?: Id; readonly enlaceId?: Id; readonly estadoId?: Id; }
```

`Consulta` es contrato de `server/agent/tools.ts:227` (herramienta del agente) y de la acción
contextual de UI. `hechos/tipos.ts:10 Hecho` no tiene consumidor de producción.

### 6.6 Firma semántica (`submodelos/firmaSemantica.ts`)

Partición exhaustiva `Record<keyof T, "firmado"|"excluido">` para `Entidad` (:45), `Estado` (:72),
`Enlace` (:93), `Abanico` (:128), `Opd` (:144), `Apariencia` (:157), `AparienciaEnlace` (:175),
`Modelo` (:192). Hash `fnv1a-xxxxxxxx` sobre JSON con claves ordenadas (`submodelos/estado.ts:44`).
Firma de pieza = vecindad radio 1 (`proyectarSemanticoPieza` :324). Los hashes congelados
(`frozenAtHash`, `frozenAtPieza`, `revisionHash`, `baseFirmaSemantica`) **están persistidos**:
cambiar la proyección o el hash invalida el drift de todos los documentos existentes. Es contrato.

---

## 7. Features derivadas: análisis pieza por pieza

### 7.1 `equivalencia/`
- `frontera.ts` / `verificar.ts`: firma de frontera `entidad|tipoEnlace|rol` y comparación de
  conjuntos. Los comentarios son **ejemplares en honestidad** ("no demuestra identidad,
  bisimulación, equivalencia categorial ni sustituibilidad"). Mantener esa disciplina.
- **Defecto** (§8.1): `firmaFronteraDeOpd` toma *todos* los enlaces del OPD que tocan una entidad
  frontera, incluidos los que la conectan con procesos ajenos al refinado. Corrección: en el OPD
  abstracto, considerar solo enlaces cuyo otro extremo sea el proceso refinado; en el OPD hijo,
  solo enlaces cuyo otro extremo sea un subproceso interno o el contorno.
- `verticalidad.ts` (`verifyBoundaryCorrespondence`, `firmaFronteraEntidad`): **sin consumidor de
  producción**. Cut o convertir en regla de integridad de enlaces derivados (su lógica —faltantes,
  duplicados, huérfanos, base incoherente— sí es valiosa como verificación de proyección).

### 7.2 `composicion/`
- `componerModelos` (`componer.ts:166`): fusiona B en A (raíz de B → raíz de A, OPDs hijos con
  namespace `-c<n>`, dedupe de apariencias compartidas, desplazamiento horizontal). **Defecto**
  (§8.4): el resultado solo contiene `id, nombre, opdRaizId, opds, entidades, estados, enlaces,
  abanicos, nextSeq`; se pierden `descripcion`, `fichaTrabajo`, `notasMesa`, `anclasNormativas`,
  `estereotipos` (romperá integridad si hay estereotipos de catálogo aplicados), `submodelos`,
  `familiasEfectosPreestado`, `procedencia`, etc. El store (`acciones-capacidades.ts:236`) hace
  commit directo del resultado.
- `sugerirCompartidasPorInterfaz` (`interfaz.ts:9`): empareja por nombre normalizado (es-CL) con
  unicidad; identidad por id solo si coincide también el nombre. Correcto y prudente.
- Remapeos duplicados con `submodelos/materializacion.ts` (lo admite el propio comentario,
  `componer.ts:35-39`).

### 7.3 `razonamiento/derivar.ts`
- Cinco consultas cerradas (bien acotadas: "FRONTERA DURA anti scope-creep"). Útiles para el
  agente y para "impacto de eliminar".
- **Defecto** (§8.5): `alcanzable` (:136) construye el grafo de transición solo con
  `consumo(estado→proceso)` + `resultado(proceso→estado)`; ignora el efecto TS3 compacto
  (`estadoEntradaId/estadoSalidaId`) y el par escindido (`efecto` con extremos estado), que son la
  representación canónica en opforja.
- `impacto-de-eliminar` emite una fila por refinamiento sin identificarlo (:121-123).
- Cita un documento inexistente (`docs/roadmap/capa-categorial-opforja.md`).
- Duplica `entidadDeExtremo` (:52).

### 7.4 `hechos/`
- `hechosDe`, `seccionLocal`, `verificarPegado`: la única regla útil es
  `pegado-enlace-estado-suprimido`, que **no está cableada** al diagnóstico. Todo lo demás existe
  para leyes (`leyes/hechos-pegado`, `integracion-ss-fs`, `razonamiento`) que prueban que la capa
  existe. Acreción de la "capa categorial"; recomendación: **cut**, llevando la regla de pegado al
  registro de integridad.

### 7.5 `changes/`
- `applyChangeSet` (`apply.ts:37`): aplica un lote atómico sobre las operaciones del kernel,
  valida precondiciones por operación, protege vistas `readOnly`, materializaciones y entidades
  ancladas, exige integridad (`validarReferenciasOpd`), calcula diff por ruta hasta hojas, aplica
  alcance autorizado (`scopeIds`) y construye una **inversa que verifica** que el valor actual es
  el que escribió el cambio antes de restaurar (`validateInverse` :151). Diseño sólido; portar.
- Limitaciones: `COLLECTIONS` (:35) no incluye `nextSeq` ni colecciones meta
  (`notasMesa`, `anclasNormativas`, `familiasEfectosPreestado`, `satisfaccionesRequisito`); si una
  operación futura las toca, el diff y la inversa no lo verán. `idsEscritos` excluye `opds`.
  `referencesInError` extrae ids con regex del mensaje de error (frágil).
- `refinement.ts` exige pregunta y justificación (bien: el refinamiento es una decisión humana) y
  `expectedNextSeq` exacto.

### 7.6 `reuse/` (Piezas)
- Manifiesto `opforja.piece.v1` con identidad, función declarada, frontera por incidencia directa,
  versión por hash de vecindad, perfil, linaje, observaciones de comportamiento por dimensión
  (`time|errors|retry|internalBehavior`) y "pérdidas" de proyección; tres operaciones (copiar,
  referenciar solo lectura, actualizar referencia con revisión de cambio de frontera).
- Valor real: "copiar una cosa con su vecindad desde otro modelo" y "referenciarla en solo lectura
  con aviso de drift". El resto (dimensiones de comportamiento con evidencia, `safeSubstitution:
  false` literal, perfiles versionados, dos tipos idénticos manifest/metadata) es andamiaje
  especulativo. **Simplify fuerte**.

### 7.7 `submodelos.ts` + `submodelos/`
- Conectar/descargar/actualizar/desconectar un submodelo materializando **solo el SD raíz** del
  snapshot con ids `sm-…` y mapas de materialización; estado derivado
  (`descargado | cargado-sincronizado | cargado-no-sincronizado | desconectado`).
- `registrarPadreSubmodelo` sin consumidor. Campos v0 duplicados (§6.2). `marcarEstadoSubmodelo`
  permite fijar estados que luego `refConEstadoDerivado` sobreescribe (salvo `desconectado`).
- La firma semántica es la joya (§10).

### 7.8 Requisitos y estereotipos
- Requisito = objeto con `estereotipoId: "est:requirement"` + `requisito: {idLogico "Req#N",
  descripcion, dureza hard|soft, actor?, satisfaction?}`; satisfacciones persistidas en
  `satisfaccionesRequisito` con target entidad/enlace; un enlace satisfecho además recibe
  `requisitos: idLogico, mostrarRequisitos: true` (dato duplicado en dos lugares).
- `crearRequirementView` crea un OPD `readOnly` copiando la **primera** apariencia de cada
  entidad (geometría de otro OPD). Evidencia OPCloud R-4604. Marginal pero coherente con OPCloud.

### 7.9 Mesa de exploración (Apunte)
- Máquina de 4 colecciones para, en v1, **crear una sola entidad** (objeto o proceso) desde un
  trazo de texto, con precondición por firma semántica + nombre reforzado por ontología
  (`firmaEjecucionPropuesta` :261). Mucha estructura (N:M fuentes↔trazos↔propuestas,
  confirmaciones con targets tipo tupla de 1) para una operación mínima. Límite 128 kB de Markdown.
- Si se conserva el concepto "notas de fuente → propuesta → confirmación", reducirlo a un registro
  de propuestas con `fuente` textual y un `changes` batch pendiente (reusar `SemanticChangeBatch`
  en vez de un tipo de operación paralelo `OperacionSemanticaExploracion`).

### 7.10 Anclas normativas + LogDecisiones + procedencia
- Diseñadas para un flujo concreto: un "proto-modelo" Markdown compilado por una skill externa,
  con anclas `[RATIFICAR]` que la mesa anota/ratifica y exporta como `LogDecisiones v0` para el
  estado `re-elicitar` de la skill. `NivelAutoridad` incluye `"dt-seremi-legal"` (autoridad
  sanitaria chilena) **en el tipo del núcleo**: contradice "este repositorio no es la fuente de
  modelos de dominio".
- Recomendación: sacar del núcleo como **plugin de integración con autoría externa**; el núcleo
  solo necesita "anotación con target + estado + procedencia libre".

### 7.11 Ficha de trabajo, documentPolicy, lentes
- `FichaTrabajo`: contexto metodológico no derivable (pregunta habilitante, dueño del significado,
  criterio de suficiencia, vida útil, modalidad con historial, revisiones humanas). Tiene valor
  metodológico (método Forja), pero 11 campos con normalización manual. Simplificar a un bloque
  pequeño y opcional.
- `documentPolicy` (`deriveDocumentPolicy` :50): proyección informativa de especie/propiedad/
  pendientes/acciones; `edit` y `changeModality` son siempre iguales (redundancia);
  cuatro valores de acción (`read-only`, `read-only-by-default`, `upstream-owned`, `indeterminate`)
  para una UI que no concede permisos.

### 7.12 Otros
- `decision.ts`: correcto y bien validado; pertenece a simulación (su consumidor real es
  `simulacion/runner.ts`); `resolverDecisionEnlace` para un enlace suelto devuelve probabilidades
  uniformes sobre estados sin elegir rama (semántica dudosa).
- `shareSanitization.ts`: redacción de credenciales en query, fragmento y userinfo; aplica también
  a plantillas de estereotipos. Portar tal cual.
- `tituloRegla.ts`: `TITULOS_CHECKER` exhaustivo por tipo (bien) + mapa `string` para el resto
  (no exhaustivo: falta `canon-diagrama-densidad`, que cae al fallback).
- `metricasComplejidad.ts`: `score = entidades + estados·0,5 + enlaces·1,5 + opds·2` sin
  fundamento ni consumidor; los otros dos campos derivados tampoco se usan fuera del test.
- `paridadOpcloud.ts`: contador de auditoría cuyo test lee `opm-extracted/…/behavioral.rules.ts`;
  el mapeo está desactualizado (p. ej. `LegalConsumptionWarning` y
  `CannotConnectThingToItsInzoomedFather` sí están implementadas y no figuran).

---

## 8. Defectos verificados (sondas ejecutables en el scratchpad)

1. **Falso positivo `DESCOMPOSICION_NO_PRESERVA_FRONTERA`.** Modelo: SD con `P→B` (resultado) y
   `B→Q` (consumo, Q otro proceso); in-zoom de P con `P1→B`. Resultado de
   `observarPreservacionFrontera`: `diferencias: ["B|consumo|origen"]` — rol que pertenece a Q,
   no a P. Causa: `equivalencia/frontera.ts:22-37` no restringe al proceso refinado.
2. **Falso positivo `PROCESO_SISTEMICO_DESCONECTADO`.** SD con A (resultado→X) y B (X→consumo),
   ambos sistémicos: B se acusa "desconectado". Causa: `checkers.ts:868-881` solo recorre enlaces
   de naturaleza estructural.
3. **Metadata colgante vuelve el documento no hidratable.** `agregarNotaMesa` sobre una entidad,
   `eliminarEntidad`, `exportarModelo` → `hidratarModelo` devuelve
   `{"ok":false,"error":"Ancla normativa con target irresoluble: nm-3.target.id (entidad o-1)"}`.
   `operaciones/eliminacion.ts` no limpia `notasMesa`, `anclasNormativas` ni
   `satisfaccionesRequisito`, y `serializacion/validateAnnotations.ts` rechaza el documento completo
   (con un mensaje que habla de "Ancla" aunque sea una nota). Afecta también la lectura del
   snapshot de review (`server/review/service.ts:157` lanzaría "Invalid immutable snapshot").
4. **Composición pierde metadata.** `componerModelos(a, b, {})` con `descripcion`,
   `fichaTrabajo`, `notasMesa` y `lentesConocimiento` en A devuelve solo
   `enlaces,entidades,estados,id,nextSeq,nombre,opdRaizId,opds`.
5. **`alcanzable` ignora transiciones de efecto.** Solicitud `pendiente→aprobada`: con TS3 compacto
   → 0 hechos ("NO alcanzable"); con par escindido `efecto` → 0; solo con consumo+resultado a
   estados → 3.
6. (Por lectura) **Severidad incoherente** checker vs tabla (§5); `OBJETO_NOMBRE_SINGULAR`
   acusa "Mes"/"Interés" y, al ser "mejora", impide `listoFormalmente`.
7. (Por lectura) **Tres definiciones de "subproceso interno"**: geométrica
   (`validaciones.ts:319,532`), por rol `contextoRefinamiento` (`checkers.ts:635`) y por
   `aparienciaEsInternaDeRefinamiento` (`diagnosticoVisual.ts:323`).
8. (Por lectura) Guard vs diagnóstico del efecto Objeto→Proceso (§4.1): el editor lo permite fuera
   de abanico y el diagnóstico lo bloquea.

---

## 9. Olores de sobreingeniería y lastre (con ejemplos)

1. **Tres productores, tres tipos, tres escalas, una tabla que pisa, un mapa de equivalencias y
   dedupe por orden de inserción** para un solo concepto ("una regla encontró un problema en un
   elemento"). Ver §3 y §5.
2. **Siete tipos para "referencia a un elemento del modelo"**: `TargetAncla`,
   `TargetDeclaracionNoNuclear`, `TargetSatisfaccionRequisito`, `TargetHechoExploracion`,
   `ReviewAnchor` (en inglés, `entity/link`), `NavegacionAviso`, `Aviso.elementoTipo/elementoId`.
   Uno bastaría: `Ref = {kind:"model"} | {kind:"opd"|"entity"|"state"|"link"|"fan"; id; opdId?}`.
3. **Helpers duplicados**: `entidadDeExtremo` reimplementado en `razonamiento/derivar.ts:52`,
   `equivalencia/frontera.ts:3`, `composicion/linealidad.ts:20`, `hechos/proyeccion.ts`
   (existe `extremos.ts`); remapeos duplicados `composicion/componer.ts` ↔
   `submodelos/materializacion.ts`; `ok`/`fallo` locales en ≥5 archivos; cuatro estrategias de ids
   (`nextSeq`, `siguienteIdMeta` por máximo, `nsId`, `idSnapshot`); tres huellas de contenido
   (`firmaSnapshotSubmodelo`, `fingerprintValue`, `firmaEjecucionPropuesta`).
4. **Gobernanza autorreferente en el código**: comentarios con códigos de ronda/ola/acta
   ("Ronda 16 L3 (Beta1)", "W5.1", "W6.5-a", "C1/C2", "D6.4", "B-2", "B-6", "U5", "A6-2",
   "logdec-02", "anclas-02", "corrección 4", "custodio (Félix)", "Centinela", "ley en pinza",
   "vocabulario de carpintero"), rutas absolutas a `/home/felix/...` en
   `integridadReferencial.ts:21-23`, referencias a documentos retirados. Dificulta leer la regla
   OPM que está debajo.
5. **Capa "categorial" como fin en sí mismo**: `hechos/` (F0), `integracionHechos` (Ss↔Fs),
   `verticalidad` (lift cartesiano que "no construye una adjunción"): código que existe para que
   leyes demuestren que existe.
6. **Rendimiento**: diagnóstico completo en cada render de `App.tsx`; `padreRefinamientoDe`
   O(E·R) por nodo BFS; `opdIdDeEnlace` recorre todos los OPDs por enlace; `cantidadEstadosDe`
   recorre todos los estados por enlace efecto; `procesoTransforma` recorre todos los enlaces por
   proceso; solapes O(n²) por OPD. Un índice precomputado por pasada resolvería todo.
7. **Datos derivados persistidos**: `estadoCierre` en el catálogo, `SubmodeloReferencia.estado`
   recalculado, `requisitos` duplicado en el enlace.
8. **Exenciones por cadena mágica** en texto libre (`[sin-aparicion-deliberada]` en
   `descripcion`).
9. **Umbral de densidad fijo que bloquea export** (25 apariencias): una heurística de legibilidad
   convertida en compuerta dura.
10. **Dominio en el núcleo**: `NivelAutoridad "dt-seremi-legal"`, lentes `"salud"`,
    `"introduccion-operacion"`.

---

## 10. Partes de alta calidad para portar casi tal cual

1. **`submodelos/firmaSemantica.ts`** — partición exhaustiva por tipo con `Record<keyof T, …>`;
   añadir un campo sin clasificarlo rompe el typecheck. Principio "geometría = excluido;
   estructura/relación/valor = firmado". Portar con el mismo hash para no invalidar
   `frozenAtHash` persistidos.
2. **`changes/apply.ts`** — lote atómico con precondiciones, protección de contenido ajeno,
   integridad al final, diff por ruta, inversa verificable contra conflicto. Solo extender
   `COLLECTIONS`.
3. **Léxico es-CL de `checkers.ts:42-71`** — nominalizaciones deverbales, conectores, invariables:
   datos lingüísticos curados.
4. **`decision.ts`** — validación completa de pesos y políticas.
5. **`shareSanitization.ts`** y **`review.ts#projectReviewModel`** — cierre transitivo de
   fuentes/trazos/propuestas/confirmaciones.
6. **`equivalencia/verificar.ts`** — comparación de firmas con la advertencia epistémica correcta
   (corregir `frontera.ts`).
7. **Mensajes de los checkers** — accionables, con `rationale`, `ssotRef` y `accionesSugeridas`
   (acciones en lenguaje de la persona). Portar el texto.
8. **Semántica Apunte/Modelo fail-closed** y "listo formalmente como proyección" — el concepto,
   no la implementación.
9. **`composicion/interfaz.ts#sugerirCompartidasPorInterfaz`** — prudencia contra fusiones
   falsas por colisión de ids secuenciales.

---

## 11. Propuesta de diseño para la reescritura

```ts
type Ref = { kind: "model" } | { kind: "opd" | "entity" | "state" | "link" | "fan"; id: Id; opdId?: Id };
type ClaseRegla = "integridad" | "validez" | "metodo" | "estilo";
interface Regla {
  id: string;                 // estable: conserva los códigos actuales (testids, export)
  clase: ClaseRegla;
  titulo: string;
  fuente: string;             // "R-PROC-2 / V-115"
  porque?: string;            // rationale
  revisar(m: Modelo, ix: IndiceModelo): Hallazgo[];
}
interface Hallazgo { reglaId: string; ref: Ref; mensaje: string; acciones?: string[] }
type Regimen = "apunte" | "modelo";
const severidad = (c: ClaseRegla, r: Regimen) =>
  c === "integridad" ? "bloqueo" : c === "estilo" ? "estilo"
  : r === "apunte" ? "observacion" : c === "validez" ? "bloqueo" : "mejora";
```

- **Un registro** (`REGLAS: Regla[]`) sustituye `validarModelo`, `verificarMetodologia`,
  `listarAvisosVisuales`, `listarAvisosDiagnostico`, `CODIGOS_EQUIVALENTES`,
  `SEVERIDAD_POR_CODIGO`, `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`, `tituloDeRegla` y la doble
  evaluación de `estadoCierre`. Un hecho = una regla (fusionar los tres "no transforma" y los dos
  "consumo doble").
- **`IndiceModelo`** construido una vez por modelo (enlaces por entidad, estados por entidad,
  apariencias por OPD, contorno por OPD, subprocesos internos por OPD con **una** definición),
  memoizado por identidad de `Modelo` (el store es inmutable).
- **Tabla única de firma legal** `FIRMAS[tipoEnlace] → (origen, destino, extremos) => ok|motivo`,
  consumida por el guard de edición y por la regla `validez/firma-enlace` (cubre también consumo,
  instrumento, resultado, invocación, AP-04 que hoy no se reportan en import).
- **Una función de integridad list-all** usada por hidratación (falla si no vacía), por
  `applyChangeSet` y por la regla `integridad/*` del panel.
- **Cascada de eliminación genérica**: toda colección meta con `Ref` se poda al eliminar su
  objetivo (o se marca "huérfana" en vez de rechazar el documento completo).
- **Extensiones meta fuera del núcleo**: `Modelo` = hechos OPM + `meta?: {...}` con plugins
  (anotaciones, procedencia/autoría externa, piezas, mesa). Composición, copia y proyección
  operan sobre el núcleo y delegan cada plugin.

---

## 12. Recomendación keep / simplify / cut (tabla final)

| Pieza | Decisión | Justificación |
|---|---|---|
| Reglas OPM de `validaciones.ts` y `checkers.ts` | **keep semántica / simplify forma** | Son la validación metodológica valiosa; migrar al registro, conservar ids, mensajes y citas |
| Reglas de realización del in-zoom en `diagnosticoVisual.ts` (transformador no distribuido, externo dentro, subproceso sin transformado) | keep → registro | Validez de realización bimodal |
| Integridad `visual-*` | simplify | Fusionar con la integridad de hidratación (list-all) |
| `diagnostico.ts`, `diagnosticoSeveridad.ts`, `tituloRegla.ts` | simplify (desaparecen en el registro) | Pegamento entre productores paralelos |
| `estadoCierre.ts` | keep concepto | Proyección exigida por la spec vigente; recalcular, no confiar en el persistido |
| `exportarDiagnostico.ts` | keep mínimo | `Hallazgo[]` + severidad visible |
| `perfilDiagrama.ts` | simplify | Heurística configurable; aviso, no compuerta de export |
| `metricasComplejidad.ts` | cut | Campos sin consumidor, `score` sin fundamento |
| `paridadOpcloud.ts` (+test) | cut | Auditoría desactualizada, sin consumidor |
| `capacidadesOpcloud.test.ts` | redistribuir | Test ómnibus |
| `validadores/valorSlot.ts` | keep | Regla de atributo simple y correcta |
| `decision.ts` | keep (mover a simulación) | Correcto |
| `razonamiento/` | keep reducido + fix `alcanzable` | Útil para el agente e impacto de eliminación |
| `hechos/` + `integracionHechos` | cut (regla de pegado → registro) | Sin consumidor de producción |
| `equivalencia/frontera+verificar+preservacion` | keep + fix | Regla F2 útil, hoy con falso positivo |
| `equivalencia/verticalidad.ts` | cut o convertir en integridad de derivados | Sin consumidor |
| `composicion/` | simplify + fix | Perder metadata es inaceptable; unificar remapeos con submodelos |
| `changes/` | keep | Contrato del agente, diseño sólido; ampliar colecciones |
| `reuse/` | simplify fuerte | Conservar copiar/referenciar con drift; eliminar dimensiones especulativas y tipos gemelos |
| `submodelos*` | simplify | Quitar campos v0 duplicados, estado persistido derivado, funciones muertas |
| `submodelos/firmaSemantica.ts` | keep casi tal cual | Joya; contrato de hashes persistidos |
| `requisitos.ts`, `estereotipos*.ts` | simplify | Evitar el dato duplicado en el enlace; vitrina a `app/` |
| `notasMesa.ts` | simplify | Unificar con anotaciones de review bajo un `Ref` común; podar al eliminar |
| `anclasNormativas.ts`, `logDecisiones.ts`, `procedenciaPanel.ts` | cut del núcleo → plugin de autoría externa | Features de circunstancia con dominio sanitario embebido |
| `mesaExploracion.ts` | simplify fuerte o plugin | 4 colecciones N:M para crear una entidad |
| `fichaTrabajo.ts`, `documentPolicy.ts` | simplify | Conservar pregunta habilitante / criterio de suficiencia / modalidad; recortar el resto |
| `review.ts`, `shareSanitization.ts` | keep | Contrato HTTP y seguridad; revisar privacidad de la proyección |
| `opdSueltos.ts` (Boceto) | keep | Concepto del ciclo reversible |
| Exención `[sin-aparicion-deliberada]` | cut | Reemplazar por supresión explícita de hallazgo (si se necesita) |

---

## 13. Riesgos de migración y contratos a respetar

- **Ids de regla** (`reglaId`/`codigo`) son testids e2e, claves del export de diagnóstico y del
  contexto de skill: conservarlos como ids estables del registro.
- **Hashes persistidos** (`frozenAtHash`, `frozenAtPieza`, `revisionHash`, `baseFirmaSemantica`,
  `manifest.version.contentHash`): cualquier cambio de proyección o algoritmo debe versionarse o
  todos los anclajes y piezas quedarán "divergentes".
- **`SemanticChangeBatch` / `ChangeValidation` / `fingerprintValue`**: lotes persistidos por el
  servidor de agentes (Postgres) y la herramienta del agente.
- **Formato `deep-opm-pro.modelo.v0`** con sus extensiones opcionales: la hidratación debe seguir
  aceptando todos los campos (aunque se agrupen internamente) y **dejar de rechazar documentos
  completos por metadata huérfana** (preferir podar con aviso).
- **API `/__deep-opm/review/*`** y los tipos `Review*`.
- **Semántica Apunte/Modelo**: integridad nunca degrada; "listo formalmente" como proyección;
  graduar no repara. Existen leyes `leyes/taller-*.test.ts` y `apunte-degradacion.test.ts` que
  expresan esto y conviene portar como tests de la nueva función `severidad`.
- **Límite de la suite**: todo lo anterior se verificó por lectura y sondas puntuales; una suite
  verde no equivale a validación humana del modelado ni prueba ausencia de otros falsos positivos
  en los checkers.
