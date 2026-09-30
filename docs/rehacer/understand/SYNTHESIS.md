# SYNTHESIS — Comprensión integral de opforja (deep-opm-pro)

Fecha: 2026-09-30. Base: `8ada528`; la rama de trabajo `fxai/confident-feynman-bvw7k5` ya tiene
encima `96b398e` (unifica `validarMultiplicidad` y acepta `?` al hidratar), que esta síntesis
tiene en cuenta. Fase: solo comprensión. Las afirmaciones marcadas «(sonda)» se verificaron
ejecutando el kernel con `bun test` desde `understand/probe_critico*.test.ts`, sin tocar el repo.
Las correcciones del crítico de completitud están en §10.

Insumos: los 18 dossiers de `understand/` y `CANON.md` (derivado de `reglas-opm-estrictas-es`
1.5.0, `spec-forja-opd-es` 1.4.0, `spec-forja-opl-es` 1.4.1 y `metodologia-forja-opm-es` 1.7.0;
248 requisitos T-NNN, 180 ★; decisiones DR-1..DR-45). Mandato del dueño: «más simple aún. acá
está el canon actualizado. ni más ni menos».

Criterio: **CONSERVAR** lo que el canon exige a la herramienta o la infraestructura mínima para
abrir, guardar y exportar; **SIMPLIFICAR** cuando la capacidad se queda con otra realización (menos
código, una sola fuente, sin inventos); **RETIRAR** lo que el canon no exige y cuya ausencia no
rompe una capacidad necesaria; **CASO LÍMITE** se argumenta en §3.9 y, si hace falta, se pregunta
en §9.

Estados de conformidad frente a CANON.md: **CUMPLE**, **PARCIAL** (existe con defectos),
**FALTA**, **CONTRADICE** (el código inventa, sobrebloquea o emite otra superficie).
Origen de las reglas: **[ISO]** = constructo OPM base (ISO 19450) tal como lo recoge `reglas`;
**[F]** = regla o realización Forja (specs y método); **[F·prod]** = restricción de producto
fijada en CANON.md (DR). La atribución [ISO]/[F] sigue al canon y a los dossiers; no se cotejó
contra el texto de ISO 19450.

Tamaño medido hoy (`find app/src … | wc -l`): **133.362 líneas de fuente TS/TSX** y **70.053 de
tests**; además 76 specs e2e (16.037 líneas), 29 scripts (7.278), unos 16.500 de
`docs/reference/`, 12 MB de `opm-extracted/` y 84 assets de OPCloud.

---

## 1. Propósito, usuarios y necesidades

### 1.1 Propósito (lo que no debe perderse)

- `README.md:3-6`: «Modelador web de OPM/ISO 19450 para construir, revisar y mantener un mismo
  modelo mediante sus dos expresiones coordinadas: el diagrama OPD y el lenguaje OPL.»
- `docs/manual-opforja.md:51-61`: «una figura en el canvas vale solo si porta un hecho OPM
  válido y ese hecho puede expresarse en OPL. Tampoco descubre la verdad del dominio […] el
  dueño humano las ratifica y opforja custodia que el significado aceptado se exprese con
  primitivas OPM correctas.»
- CANON §0.1 lo reduce a siete exigencias: kernel único con OPD y OPL como proyecciones;
  impedir lo prohibido y advertir lo condicionado; generar y parsear OPL-ES; renderizar el OPD
  con vocabulario cerrado; operaciones de refinamiento con distribución, escisión e identidad
  persistente; exportar `canon-diagrama`, `canon-documento` y el bundle JSON; mantener un
  registro de conformidad (R-CONF-7, T-001).
- Frontera estable (docs-product §1.2): el repo no es fuente de modelos de dominio, no ejecuta
  procesos reales, no ingiere documentación, no ofrece coedición en tiempo real ni codegen.
  `NOTICE.md`: no hay licencia OSS declarada; `assets/`, `config/`, `catalog/`, `fixtures/`,
  `webroot/` y `opm-extracted/` son evidencia observacional de OPCloud y no se copian a `app/`.

### 1.2 Usuarios: declarados frente a observados

| Usuario | Evidencia | Consecuencia |
|---|---|---|
| Operador único experto (el dueño) | 122 reportes de un solo operador, Mac+Chrome 120/122, producción `opforja.sanixai.com` 119/122; `auth-identidad-v1.md` D1 «single-operator» | Diseñar para un experto que modela modelos grandes, con teclado |
| Modelos grandes reales | HODOM: 262 entidades, 192 estados, 433 enlaces y 36 OPDs (unos 5 MB); biblioteca gist | Rendimiento, búsqueda y navegación de árbol importan |
| Agentes y repos externos | skill `modelamiento-opm` (portapapeles W6.0), CLI `mesa pull/push`, `hd-opm` que compila bundles con `app/src/autoria/`, `render:headless`, `verify:reproducible` | Consumidores fuera del canon; hoy imponen byte-identidad al kernel |
| Novatos, revisores, lector móvil | Sin evidencia: 0 reportes móviles; la evaluación con 5 personas (A01, T9) sigue pendiente | La ingeniería pedagógica (tutor, 16 hojas, 5 manuales) no tiene usuario acreditado |

Perfil de uso (bugs-auditorias §4): el 84 % de los reportes cae entre el 2026-05-23 y el
2026-06-09 (42 el 2026-05-26); luego 4 en julio y 0 en agosto y septiembre; 103 de 122 vienen
de modelos de juguete; mediana de 14 palabras; 1 solo adjunta el modelo. Son sesiones de
revisión de fidelidad OPM frente a OPCloud, no uso sostenido por terceros.

### 1.3 Necesidades reales (voz del usuario) y su anclaje en el canon

| Familia (conteo aprox.) | Citas o ids | Anclaje en CANON |
|---|---|---|
| OPL correcto y siempre emitido (~24) | b768d4 «que no por no tener un nombre correcto no se genere el opl», 76af16, f314c4 (TS3 compacto emitido como «afecta»), 45dbc2/35087a (`?`) | §4 completo; DR-11 (sin placeholders por construcción); R-MULT-1 |
| Semántica de enlaces con estados (~14) | bfb79a «un objeto no puede afectar a un proceso», 0c3cde/f22ba6 (escindir efecto), 82cc4f (enlaces desde y hacia estados), fb6c2c (reanclar estructurales) | §2.1; R-ESCIND-0; R-OPD-EDIT-7 |
| Notación visual canónica (~19) | 66ff2f «después de muchos intentos, aún no tenemos la flecha canónica», 9e3b9b (rountangle), a8c184, 6ae261 (sombras) | §5 (8 representaciones, marcadores, triángulos) |
| Manipulación directa en canvas (~16) | cascada del 2026-06-05: 10 reportes en 20 minutos, b91e85 «un desastre» | §5.7 operaciones mínimas del canvas |
| Foco y viewport (7) | 029853 «todo se tiene que armar y ordenar a partir del centro geométrico», 9de6df | R-OPD-LAY-10 (centrar al cambiar de OPD) |
| Sustracción de chrome (~26 de shell, 9 pedidos explícitos de quitar) | dd0c18 «sacar la función del mapa del sistema», 81ac46, aad990, b5a202, 98f2fb «si no hay diferencia solo deja 1» | Coherente con «ni más ni menos»; ninguna eliminación produjo quejas |
| Simulación (~10) | 37ebd2, 551dbf, cc4801 (probabilidades en UI) | **Fuera del canon** (§0.4): tensión explícita, ver §9 |
| Persistencia (3) | 6ce450 «no puedo guardar» | Infraestructura mínima |

La auditoría UX de 2026-06-12 pide conservar: cero tutorial («O objeto · P proceso · R
relación»), OPL como feedback continuo en menos de 100 ms, teclado primero, estado visible e
identidad visual propia.

---

## 2. Historia y decisiones (con sus porqués)

La historia Git visible empieza el 2026-07-26 con `56bab8d`, que importa 2.271 archivos y unas
480 mil líneas; lo anterior se reconstruye desde fechas en `docs/`, bugs y actas. De 69 commits,
24 son solo documentales.

| Fecha | Decisión | Porqué | Estado hoy | Lectura para rehacer |
|---|---|---|---|---|
| ~2026-04 | Ingeniería inversa de OPCloud (`setup.sh`, `opm-extracted/`, `JOYAS.md`: 135×60, manhattan `padding:5 step:11`, hit-area 15) | Paridad visual y semántica sin copiar código | Vigente como referencia | Conservar `JOYAS.md`; retirar el código decompilado (riesgo legal) |
| 2026-05 | MVP alpha, beta1 (búsqueda, tabla de enlaces), beta2 (simulación); capturador de bugs in-app | Operador único prueba en producción | Vigente | Canal de feedback valioso; el ledger triple es burocracia |
| ≤2026-05 → 06-01 | Paletas V1 OPCloud → V2 «Bauhaus» → «Drafting» → Codex (05-25) → V4 con swallowtail (06-01) | Identidad propia y fidelidad | Codex vigente; fósiles V1/V2 vivos (`modelo/constantes.bauhaus.ts`, `focus.css:5`) | Una sola fuente de tokens |
| 2026-06-04 | Pivote único `deep-opm-pro.modelo.v0`; compilador proto (`app/src/autoria/`); byte-identidad del bundle HODOM como oráculo | Reconciliar hd-opm (generaba bundles) y opforja (editaba) sin segundo esquema | Vigente | Conservar el formato; retirar el acoplamiento a un consumidor externo |
| 2026-06-04 | EQUILIBRIO: IA y wizard fuera de la app | Kernel determinista | Revertida el 2026-09-23 (agente integrado) | El canon no exige agente |
| 2026-06-04/06 | Backend PostgreSQL y backend-only (sin localStorage) | Techo de 5-10 MB de localStorage con modelos escala HODOM | Vigente; el 09-30 volvió a local-first con IndexedDB | Ida y vuelta en cuatro meses: elegir una sola vía |
| 2026-06-05 | Se retira la geometría libre de estados tras 10 reportes en 20 minutos | Tres fuentes de geometría compitiendo por el mismo `pointerdown` | Revertido a medias: `render/jointjs/composers/estados.ts:42-48` usa `estado.x/width` con clamp | Estados gestionados por layout, sin x/y persistidos |
| 2026-06-10 | Auth v1 single-operator (scrypt, registro cerrado, cookie HMAC, tenant) | Recuperar el tenant desde cualquier navegador y proteger la instancia pública | Vigente | Infraestructura mínima (caso límite) |
| 2026-06-14/15 | `Opd.ordenInzoom: Id[][]` (bandas) y ley `derivar ∘ layout = id` | R-INV-2B prohíbe dibujar la invocación implícita («doble vara») | Vigente, de alta calidad | El canon lo exige (T-030) y lo mueve a `refinamientos.descomposicion.orden` |
| 2026-06-22 | Decommission de `opmodel` y `opm-model-app`; opforja queda como sucesor | Unificar | Material histórico en `docs/reference/` | Archivar |
| 2026-06-23 | Se revierte el «modo boceto/pizarra» (garabato no-OPM) | «no resultó como quería»: primitivas no-OPM contaminan el modelo | Lección durable | Nada de dibujo libre (coherente con T-006) |
| 2026-06-24→30 | Reuso: Calcar, Anclar, Pieza, Centinela de Drift | Comparar modelos que comparten tipos (gist ↔ HODOM) | ~4,7k líneas + 7 leyes; ningún reporte de uso; su acta de valor lo llama «inminente-no-activo» | Retirar (extensión R-OPD-ROT-9) |
| 2026-06-30 | Modo Apunte (`esApunte`), degradación por whitelist fail-closed | Pensar en OPM sin que el cierre interrumpa | Vigente | Extensión PUEDE (DR-42): retirar |
| 2026-07-06→27 | Taller bottom-up, Bocetos, puente mesa↔skill, ciclo reversible Apunte⇄Modelo y Boceto⇄OPD | Bosquejar sin ceremonia; que la skill lea y escriba | Vigente | Extensión PUEDE: retirar; se conserva la lección «una dimensión por transición» |
| 2026-07-21 | Tutor contextual determinista | Enseñar el método en el punto de decisión | ~4,9k líneas; `tutor:corpus` rompe `dev`/`build` fuera de la máquina del dueño | El canon excluye el asistente del método (§0.4): retirar |
| 2026-08-09 | Poda documental y de código inerte (neto −9,7k) | Reducir corpus sin consumidores | Vigente | Continuar en la misma dirección |
| 2026-09-02/09 | Familias de efectos por preestado, declaraciones no nucleares, mesa de exploración | Casos reales de modelado (HODOM, LGUC) | Vigente | No exigidas; retirar con reporte de pérdida en import (§9) |
| 2026-09-30 | Commit `8ada528`: 194 archivos, +24.703 líneas (agente MiMo, local-first, revisión compartida, paquete portátil, piezas) | Encargo «integrar el agente y optimizar el producto» | No desplegado; cero inferencia real; `HANDOFF.md` abierto | Retirar; contradice «menor incremento vertical» de `AGENTS.md` |

Patrones que explican la complejidad: (1) las decisiones de interfaz se revierten en días,
justificadas por paneles sintéticos («Steve Jobs», «Dov Dori», «steipete», «N4 (0.88)»),
mientras las invariantes semánticas (integridad nunca degrada, identidad conservada, validez por
whitelist) sobreviven; (2) se emuló OPCloud por ingeniería inversa (ports, `symbolAnchors`,
`labelPositions`) y luego se ignoró o revirtió (6a6a06, 7fcdba); (3) cada feature se cerraba con
ceremonia (handoffs, 230 comentarios `BUG-…`, tests que congelan estilos); (4) la autoridad OPM
vivió fuera del repo (KORA), con puentes vacíos y un build que no arranca en otra máquina.
`CANON.md` resuelve eso por primera vez con un texto derivado y cerrado.

---

## 3. Inventario de capacidades (consolidado y deduplicado)

Rutas relativas a `app/src/` salvo indicación. «Canon» remite a secciones o ids de CANON.md.

### 3.1 Kernel del modelo

| # | Capacidad | Decisión | Justificación | Archivos hoy |
|---|---|---|---|---|
| K1 | Tipos Modelo/Entidad/Estado/Enlace/Abanico/Opd/Apariencia | SIMPLIFICAR | Reducir a CANON §1.2: fuera las 14 extensiones de la raíz, `nextSeq` visible, `subtipoModificador`, `puertoEntidadId`, `Estado.x/y/w/h`, geometría de ports | `modelo/tipos/{modelo,entidad,estado,enlace,abanico,opd,apariencia,extensiones}.ts` |
| K2 | Firma de enlaces (qué par admite qué tipo) | CONSERVAR | T-040; `validarFirmaEnlace` es exhaustiva (`satisfies never`) y cita reglas. Ajustes: F11 manejador ambiental pasa a advertencia (R-EXC-1A), añadir `reciproco`, quitar `excepcionSubSobretiempo` | `modelo/operaciones/helpers.ts:58-148` |
| K3 | Guards de creación: AP-04, efecto exige estados, unicidad de rol por par | CONSERVAR y completar | T-043, T-044, R-OPD-HAB-4; considerar estados heredados (DR-43). La unicidad es **parcial**: `validarUnicidadRolPar` (`enlaces.ts:1053-1105`) bloquea solo el duplicado exacto y la mezcla transformador+habilitador; dos transformadores sobre el mismo par pasan (lo acusa después `PAR_TRANSFORMADOR_DUPLICADO`). También falta impedir consumo/resultado anclados al contorno en el OPD hijo (AP-06, T-060; sonda: `crearEnlace` acepta `Sal → Hornear` en SD1). La creación rechaza `origen = destino` (`enlaces.ts:104`, «Sprint 0»), lo que bloquea el etiquetado unario (R-OPD-STR-10) | `modelo/operaciones/enlaces.ts:90-188`, `:1040-1110` |
| K4 | Control `e`/`c` (uno por enlace, solo Pre(P)) | CONSERVAR y corregir | T-027, AP-01/02/03/09/10 se cumplen. **AP-08 no**: `modificadores.ts:205` exige `efectoEscindido.modo === "par"`, pero `splitEffectEnPar` (`eliminacion.ts:251,259`) no fija `modo`. La sonda aplica `evento` a una mitad escindida y el OPL emite `**Agua** en `fría` inicia *Hervir*, que afecta **Agua** en `fría`.`, que no es ninguna plantilla | `modelo/modificadores.ts:198-209` |
| K5 | Negación `¬` (modificador `no`) | RETIRAR | §0.4: extensión emisión-only que rompe la bimodalidad | `tipos/enlace.ts:33`, `opl/generadores/procedural.ts:367-400` |
| K6 | Multiplicidad | SIMPLIFICAR | Solo `?`, `*`, `+` y default (DR-21); nunca en extremo proceso ni en el todo de la agregación (DR-44). El validador duplicado ya se unificó en `96b398e`, pero la regla única (`enlaceMultiplicidad.ts:3-10`) sigue admitiendo `N`, `0..N`, `2..*` y rangos, y ni el kernel ni la hidratación miran el tipo de enlace ni el extremo (R-MULT-1) | `modelo/enlaceMultiplicidad.ts` (única fuente desde `96b398e`) |
| K7 | Estados y designaciones | SIMPLIFICAR | Admitir 1 estado (R-OBJ-2); `porDefecto` ≤1 y `current` ≤1 por objeto sin exclusión mutua inventada; orden por posición; sin geometría. La regla ≥2 está en cinco sitios: `estados.ts:85,121,166`, `serializacion/validarEstados.ts:85` y el parser (`opl/parser/planificar.ts:341-349`, sonda: `**Agua** puede estar `fría`.` ⇒ `syntax-error`) | `modelo/operaciones/estados.ts`, `modelo/estadosDesignaciones.ts:17,24,58-65` |
| K8 | Supresión de estados global y por apariencia | CONSERVAR y corregir | T-018 y DR-15 exigen los dos niveles (el dossier docs-opm-authority G5 proponía retirar el global: el canon lo contradice). El predicado `estadoVisibleEnAparicion` es correcto (oculto ⇔ global ∨ local), pero la supresión local **sobrebloquea**: `suprimirEstadoEnAparicion` usa `estadoTieneEnlaces`, que mira el modelo entero (`visibilidadEstados.ts:114`, `estadosDesignaciones.ts:71-76`). Un estado enlazado solo en SD no se puede ocultar en SD1 (sonda); LF-03 prohíbe solo ocultarlo en el OPD donde está enlazado | `modelo/visibilidadEstados.ts`, `tipos/estado.ts:30`, `tipos/apariencia.ts:66`, ley `leyes/supresion-estados-aparicion.test.ts` |
| K9 | Abanicos XOR/OR | SIMPLIFICAR | T-028: `{operador, enlaceIds}` sin puerto, sin OPD dueño, sin `decision`; conservar las reglas de formación | `modelo/abanicos.ts:354-397`, `tipos/abanico.ts` |
| K10 | Probabilidades `Pr=p` en ramas y en eventos sueltos | RETIRAR | §0.4 (no ofrecido); C-23 (Pr sin abanico) es no canonizado | `modelo/abanicos.ts:122,143-158,477-492`, `modelo/modificadores.ts:62-87` |
| K11 | Rutas (`rutaEtiqueta`) | SIMPLIFICAR | Solo consumo y resultado (DR-19); nombre dado por el modelador. Hoy la partición `firmaSemantica` la trata como presentación: es semántica | `modelo/rutas.ts:32-38`, `opl/generadores/procedural.ts:31-36,134-163` |
| K12 | Duración de proceso `{min, esperada, max, unidad}` | AÑADIR (FALTA) | T-021; EX1/EX2 toman la cota de la fuente; enum `ms…year` | Hoy solo `Estado.duracion` (`tipos/estado.ts:13-20,29`) y umbrales en el enlace (`tipos/enlace.ts:82-89`) |
| K13 | Excepciones de sobretiempo y subtiempo | SIMPLIFICAR | T-047; sin cota: frase de respaldo más advertencia; retirar la combinada | `tipos/enlace.ts:29`, `opl/generadores/procedural.ts:233-238` |
| K14 | Demora de invocación, `backwardTag`, tasa, `unidadesTasa`, requisitos de enlace | RETIRAR | §0.4 | `tipos/enlace.ts:79-89` y vecinos |
| K15 | Descomposición (in-zoom) atómica | SIMPLIFICAR y corregir | §3.2: distribución sin copias (DR-13); primero/último por bandas, no por geometría; invocación y excepción quedan en el contorno (DR-14). La **escisión automática TS3→TS4/TS5 no existe** (sonda). Con el TS3 compacto, SD1 recibe tres copias `*Sub* afecta **Agua**.` sin estados. Con el par consumo+resultado, SD1 recibe TS1/TS2 (`*Calentar* consume **Agua** en `fría`.` / `*Apagar* genera **Agua** en `caliente`.`) en lugar de TS4/TS5. La escisión con `efectoEscindido` solo ocurre con el comando manual `splitEffectEnPar` (`eliminacion.ts:204`). Además siembra **tres** subprocesos «`P` 1..3» (`constantesInzoom.ts` `minSubthings: 3`), no dos | `modelo/operaciones/refinamiento/{descomposicion,proyeccion,establecer}.ts` (proyeccion.ts 850 líneas) |
| K16 | Orden temporal en bandas | CONSERVAR | T-030, R-INV-2/2A/2C/2D. Se traslada a `refinamientos.descomposicion.orden` | `tipos/opd.ts:29-36`, `opl/generadores/refinamiento.ts:246-298`, `operaciones/refinamiento/helpers.ts` (`derivarOrdenInzoomDeGeometria`) |
| K17 | Despliegue (unfold) en 4 modos | CONSERVAR | §3.3; hijos estructurales directos | `modelo/operaciones/refinamiento/*` |
| K18 | Colección incompleta con rastreo y traza (DR-45) | AÑADIR (FALTA) | T-034, R-OPD-EDIT-6; hoy no existe ni en el modelo ni en el OPL (grep sin resultados) | — |
| K19 | Alcance persistido (contenedor/interno/externo) | CONSERVAR | T-033; corregir los validadores que deciden por geometría | `tipos/apariencia.ts:15-25`; `modelo/validaciones.ts:150-161,309-330,532` |
| K20 | Vista del OPD padre derivada (fuerza semántica y matriz R-PREC) | SIMPLIFICAR | §3.5; hoy son proyecciones persistidas (`Enlace.derivado`) más `inheritedFanGuard.ts` (264); el canon pide derivarla | `modelo/operaciones/refinamiento/proyeccion.ts`, `modelo/inheritedFanGuard.ts` |
| K21 | Herencia consultada por validadores sin materializar | SIMPLIFICAR | DR-43, R-HER-8 | `modelo/inheritedFanGuard.ts` |
| K22 | Aciclicidad de refinamiento, solo hojas eliminables | CONSERVAR | AP-16, R-REF-3 | `operaciones/refinamiento/establecer.ts:63-65`, `modelo/opdEliminacion.ts` |
| K23 | Etiqueta `SDx.y` derivada del árbol | SIMPLIFICAR | T-031: función pura en preorden. Hoy la etiqueta se **escribe en `Opd.nombre` al crear el hijo** (`siguienteNombreOpdHijo`, `refinamiento/helpers.ts:299-310`) y la UI la recupera con regex (`NodoOpd.tsx:237-243`). Tras eliminar o reordenar hijos no se recalcula (R-IDP-1) | `ui/arbol/NodoOpd.tsx:237-243`, `refinamiento/helpers.ts:299` |
| K24 | Nombre único y colisión explícita (reusar, renombrar, descartar) | CONSERVAR | T-024; corregir los duplicados tras unfold/in-zoom. Ojo: `validarNombreEntidad` y `crearEntidad` pasan el nombre por `parsearNombreUnidadEntidad` (separa `[u]`) y por `nombreReforzadoPorOntologia`, que en modo `enforce` **reescribe el nombre en silencio** (`ontologia.ts:31-34`, `entidad.ts:79-81`), contra T-025/T-065. Ambos se van con K28/K29 | `modelo/operaciones/colisionNombre.ts`, `ui/DialogoColisionNombre.tsx` |
| K25 | Integridad referencial | CONSERVAR | T-022; rechazo solo por referencias rotas (§7 canon) | `modelo/integridadReferencial.ts:27-86` |
| K26 | Apariencia ≠ cosa; quitar de este OPD ≠ eliminar del modelo; traer cosa existente | CONSERVAR | T-023, T-248, T-251, R-VIS-APP-1, método §9.15. Las operaciones reales viven fuera del kernel, en `canvas/operacionesBatch.ts`: `traerEntidadAlOpd` (`:263`, idempotente, trae también las apariencias de enlace con ambos extremos visibles) y `ocultarAparienciaBatch` (`:303`). El store las importa, de modo que la capa `store` depende de `canvas`. Portarlas al kernel | `canvas/operacionesBatch.ts:263,303`, `store/modelo/acciones-canvas.ts:1002-1010` |
| K27 | Placeholders que suprimen OPL | RETIRAR | DR-11: la cosa nace con nombre; la supresión rompe la bimodalidad (b768d4, 76af16) | `opl/generadores/refsHints.ts:212-218`, `modelo/nombresCanonicos.ts:43-48` |
| K28 | Linealidad, `lineal`, composición, submodelos, ontología organizacional | RETIRAR | §0.4 (Anexo C, sub-modelos); `Sugerir` sin consumidor | `tipos/entidad.ts:145`, `modelo/submodelos.ts`, `modelo/composicion/`, `modelo/ontologia.ts` |
| K29 | Capa computacional (alias, `[u]`, tipos, rangos); se conserva `valorSlot` | SIMPLIFICAR | §0.4 excluye todo salvo `valorSlot` (T-020, plantilla `es valor`). Contrato: hoy `valorSlot` es un objeto `{tipo: integer\|float\|char\|string, placeholder: "value", valor?}` (`tipos/entidad.ts:64-68`) y el canon usa un `string`: migrar `valor` y descartar `tipo`. Hoy `oracionValorAtributo` **reemplaza** la oración de clasificación del atributo (`estructural.ts:36-37,51-56`), así que un atributo físico o ambiental con valor pierde D1/D3. Conservar `esAtributo?`: está en el núcleo del bundle del método F (CANON §7) y en el JSON real | `tipos/entidad.ts:23,124-125`, `opl/generadores/estructural.ts:51-56` |
| K31 | Refinamiento de un externo desde el OPD hijo | AÑADIR guard (FALTA) | T-079 ★ (R-HIJO-5). La sonda despliega y descompone `Horno` (externo) desde SD1 sin error; ni `establecer.ts` ni `descomposicion.ts`/`despliegue.ts` lo impiden | `modelo/operaciones/refinamiento/*` |
| K32 | Plegado parcial e intradiagrama (`modoPlegado`, `ordenPartes`, `parteExtraidaDe`, «se lista con … como rasgos») | RETIRAR | §0.4 (semi-plegado sin OPL, T-136) y DR-24 (refinamiento siempre en OPD nuevo). Hoy emite y parsea OPL propio (`opl/generadores/plegado.ts:11-23`) | `modelo/plegado.ts` (474), `render/jointjs/composers/plegado.ts`, `plegadoNesting.ts` |
| K33 | Agrupación y orden manual de estructurales (`grupoEstructuralId`, `orderedFundamentalTypes`, `separar/volver/cambiarTipo/fijarOrdenGrupoEstructural`) | RETIRAR | La agrupación estructural del OPL se deriva por vértice y relación (T-131); la marca `ordered` es extensión (§0.4, R-OPD-STR-5) | `tipos/enlace.ts` (`grupoEstructuralId`), `tipos/entidad.ts:145-151`, `operaciones/enlaces.ts:283+` |
| K34 | Metadatos de presentación en la cosa (`layoutEstados`, `urls`, `imagen`, `modoTamano`) | RETIRAR | Bitmaps, modo imagen y estilado autoral son PUEDE (§0.4); la región de estados es fija (R-OPD-EST-1) | `tipos/entidad.ts`, `tipos/apariencia.ts`, `ui/ModalImagenObjeto.tsx`, `ui/ModalUrlsObjeto.tsx` |
| K30 | Firma de frontera como ley de test | CONSERVAR | DR-16, T-089; hoy hay falsos positivos en `DESCOMPOSICION_NO_PRESERVA_FRONTERA` | `modelo/equivalencia/`, `checkers.ts:130-138` |

### 3.2 Diagnóstico y validación

| # | Capacidad | Decisión | Justificación | Archivos hoy |
|---|---|---|---|---|
| D1 | Tres productores de avisos, tres taxonomías de severidad | SIMPLIFICAR | DR-40: un registro `{codigo, regla, severidad error/warning/info, familia, mensaje, accionCanonica, refs}`. Hoy hay 19 `CodigoChecker` (`tipos/avisos.ts:33-52`) y unos 35 `reglaId` en `validaciones.ts` y `diagnosticoVisual.ts`; el reparto está en §10.4 | `modelo/validaciones.ts` (547), `modelo/checkers.ts` (903), `modelo/diagnosticoVisual.ts` (528), `diagnostico.ts`, `diagnosticoSeveridad.ts` |
| D2 | Gates de export (>25 cosas, <2 hijos, errores estructurales) | CONSERVAR y **completar** (hoy PARCIAL) | §7 canon, R-LAY-1, AP-13, T-283 ★. En el código solo existen el gate de densidad y el de Bocetos (`perfilesExport.ts:20-49`), y se aplican al Markdown `canon-documento` (portapapeles) y al JSON con perfil. Faltan los gates de <2 hijos (`INZOOM_CONTENIDO_INSUFICIENTE` es «mejora») y de errores estructurales. La descarga PNG por OPD y el ZIP de todos los OPDs (`mapaExport.ts:48-84`, desde `CommandPalette`) **no tienen ningún gate** | `modelo/validaciones.ts:80-85`, `serializacion/perfilesExport.ts` |
| D3 | Advertencias metodológicas (nombres, SD con un proceso sistémico, proceso sin transformar) | CONSERVAR como warning | §6.4; hoy `PROCESO_NO_TRANSFORMA` es «bloqueo», y el canon lo pone entre las advertencias que no bloquean | `checkers.ts:42-71,195-240,319,664`, `diagnosticoSeveridad.ts:27-30` |
| D4 | Degradación por Apunte (36 códigos) | RETIRAR | Se va con Apunte (DR-42) | `diagnosticoSeveridad.ts:113,174` |
| D5 | Registro de conformidad | REHACER | T-001 exige el registro (tabla regla · estado R-APP-2 · superficies R-APP-3 · nota); retirar el test que exige filas literales. Hoy tiene 52 líneas con 4 filas (out-zoom, R-FAN-PROB-1, GAPs §22 y una fila «cerrada»), redactadas contra la SSOT anterior. Frente a los unos 205 DEBE de CANON §9 casi todo es brecha silenciosa (§10.3): hay que regenerarlo desde los T-NNN | `docs/roadmap/registro-conformidad-ssot.md`, `leyes/manual-limites.test.ts` |
| D6 | Panel de diagnóstico con «Ir a…» y anunciador ARIA | CONSERVAR | §6.4 | `ui/PanelDiagnostico.tsx` |
| D7 | Badges de validación persistentes sobre el lienzo | RETIRAR | T-228 ★ (R-OPD-VAL-1, R-VIS-VAL-1): la validación vive en el panel. Hoy `JointCanvas.tsx:265` sincroniza todos los avisos de `validarModelo` como `ErrorBadge` anclados a celdas (`overlayCanvas/avisos.ts`, `ErrorBadge.tsx`). Se puede conservar la marca transitoria de arrastre (T-322, PUEDE) | `render/jointjs/overlayCanvas/**`, `store/feedback.ts` |
| D8 | Reglas inventadas: `ambiental-dentro-contorno`, `PROCESO_SISTEMICO_DESCONECTADO`, `EFECTO_SIN_TRANSICION` (que propone escindir en consumo+resultado, contra DR-6), `INZOOM_NOMBRES_PLACEHOLDER_HIJOS`, `RECURSO_LINEAL_…`, `PROBABILIDAD_FUERA_DE_ABANICO`, `imagen-estados-excluyentes`, `orden-estructural-huerfano` | RETIRAR | T-003: no inventar reglas. Ninguna figura en CANON §6.4 ni §6.5; las tres últimas pertenecen a extensiones que se retiran | `modelo/validaciones.ts:150-175`, `checkers.ts:436,654`, `diagnosticoSeveridad.ts` |

### 3.3 OPL

| # | Capacidad | Decisión | Justificación | Archivos hoy |
|---|---|---|---|---|
| O1 | Generador forward por OPD, en bloques y en orden del árbol | CONSERVAR y corregir | T-010; alinear las ~20 divergencias de §4.8 y el algoritmo DR-32 | `opl/generar.ts`, `opl/generadores/{procedural,estructural,abanico,refinamiento,refsHints}.ts` |
| O2 | Parser reverse | SIMPLIFICAR y completar | DR-1: parser por esqueletos con tabla de plantillas; hoy ~15 regex con catch-all «X es Y» y planificador con identidad posicional. **Solo la oración de clasificación crea cosas** (`planificarDescripcion`, `planificar.ts:291-311`). Sobre un modelo vacío, `*Hornear* consume **Harina**.`, D5, TS3, RF1, IV2 y las plantillas de abanico dan `unknown-symbol` (sonda), contra T-153, T-165 y T-166. El roundtrip desde vacío funciona hoy solo porque el generador antepone siempre `es un objeto informacional y sistémico.`: cuando se aplique DR-2 (D1/D3 solo si difieren) hay que implementar T-153 a la vez. `se descompone en` crea un OPD hijo vacío y no los miembros (`planificar.ts:150-158`, contra DR-35). No existe el código `non-canonical` (`parser/tipos.ts:6-13`, T-157) | `opl/parser/parsear.ts` (955), `opl/parser/planificar.ts` (1105, `:34`), `aplicar.ts` (577) |
| O3 | Editor OPL con clasificación por línea (4 estados, 8 razones) | CONSERVAR y corregir | R-OPL-EDIT-1/3; `clasificadorEdicion.ts` coincide exacto con el canon. Falta idempotencia (UX-01), alcance por OPD y partial-parse (DR-39) | `opl/clasificadorEdicion.ts`, `ui/panelOpl/EditorOplHonesto.tsx`, `store/modelo/acciones-canvas.ts:341-367` |
| O4 | Panel OPL con tokens navegables y filtro por selección | CONSERVAR | R-OPL-INT-*, R-OPD-INT-1/2; bloques por OPD con sangría por profundidad (T-241, `opl/bloquesJerarquicos.ts`), panel minimizable (T-247, `PanelOpl.tsx:105`) y numeración (T-246) ya existen | `opl/interaccion.ts`, `opl/bloquesJerarquicos.ts`, `ui/panelOpl/RenderToken`, `Bloques`, `ui/codex/oplTipografia.tsx` |
| O5 | Edición inline (renombrar cosa, estado, etiqueta) | CONSERVAR | R-OPL-EDIT-7 | `opl/edicionCanvas.ts` |
| O6 | Visibilidad de esencia (siempre / solo-difiere / oculta) | CONSERVAR y corregir | R-OPL-CFG-1: tres modos, default `siempre` en display; el texto canónico es `solo-difiere` con D1/D3 atómicas. Hoy el export Markdown, el roundtrip y el editor usan el modo de display (`siempre`, `estructural.ts:39`), de modo que el «canónico» cambia con la configuración (T-139, CONTRADICE) | `opl/opciones.ts:9-21`, diálogo de configuración |
| O7 | Export OPL Markdown | CONSERVAR | §7 canon. Unificar el orden: el export recorre en DFS (`exportarMarkdown.ts:50-80`) y el panel y el planificador en **BFS** (`ordenarOpdsParaOpl`, `bloquesJerarquicos.ts:67-82`). El canon pide preorden (DFS) con hermanos en orden de creación (DR-4), y ambos desempatan por `ordenLocal` y nombre. El BFS del panel CONTRADICE T-100 | `opl/exportarMarkdown.ts` |
| O8 | Familias de efectos por preestado | RETIRAR | No es construcción del canon; R-FAN-5A cubre el abanico TS3 con entrada común | `modelo/familiasEfectosPreestado.ts`, generador y parser asociados |
| O9 | Superficies extendidas: negación, demora, EX combinada, RF2o, `[etiqueta: X]`, posesivo, AND agrupado, duración de estado, «tiene unidad», oración de paralelo muerta, plegado parcial «se lista con … como rasgos», verbos en plural por multiplicidad (`constan`, `invocan`, contra DR-12) | RETIRAR | §0.4, R-COMP-ZP-3 y DR-12. Caso grave: `crearAutoInvocacion` fija `demora = "1s"` por defecto (`modelo/autoinvocacion.ts:9`), así que toda autoinvocación creada desde la UI o parseada como IV2 canónico se emite `*P* se invoca a sí mismo después de 1s.` (sonda): IV2 nunca sale canónico y el roundtrip IV2 no es estricto | `procedural.ts:214,232,274-278,367-400,461-490`, `estructural.ts:66-80`, `duracionMetadata.ts:20-22,42-45`, `refinamiento.ts:105-107`, `generadores/plegado.ts:11-23`, `autoinvocacion.ts:5-48` |
| O10 | `contextoSkill`, OPL estructurado, composición intermodelo | RETIRAR | Consumidores externos y sub-modelos fuera del canon | `opl/contextoSkill.ts`, `opl/estructurado.ts`, `opl/generadores/composicionIntermodelo.ts` |

### 3.4 OPD: render e interacción

| # | Capacidad | Decisión | Justificación | Archivos hoy |
|---|---|---|---|---|
| R1 | Gramática visual (8 representaciones, contorno grueso, estados, marcadores, triángulos, arcos XOR/OR, chip ⋯N) | CONSERVAR (reglas) | §5; corregir glifos de por defecto y `Current` (DR-37) | `render/jointjs/composers/entidad.ts:88-160,870-955,1092-1130`, `linkAssets.ts`, `markers.ts`, `abanicoOverlay.ts` |
| R2 | Motor JointJS 3.7.7 (+jquery, backbone, lodash, dagre; 418 KB core) | SIMPLIFICAR (caso límite) | Escena geométrica pura más SVG propio; `canon-diagrama` = serializar la escena. Riesgo en §8 | `render/jointjs/**` (~10.950), `canvas/**` (~2.300) |
| R3 | Ports persistidos, `symbolPos`, `symbolAnchors`, `labelPositions`, sort de estructurales (hasta 5040 permutaciones) | RETIRAR | Geometría derivable; el canon persiste solo x, y, width y height de la apariencia | `modelo/operaciones/ports.ts` (505, geometría dentro del kernel), `render/jointjs/labelLayout.ts` |
| R4 | Ruteo: procedimentales rectos centro→borde; estructurales ortogonales | CONSERVAR simple | R-OPD-LAY-4/5 | `render/jointjs/composers/enlace.ts:750-773` |
| R5 | Jumpover, carriles 44/50, bitmaps, estilado autoral, mapa del sistema, semi-plegado | RETIRAR | §0.4 (PUEDE) | `enlace.ts`, `canvas/mapa/**` (1.552 líneas, apagado por `app/features.ts:8`) |
| R6 | Triángulo compartido (bus) de agregación | SIMPLIFICAR | Realización informativa permitida; hoy el triángulo del bus es inerte | `render/jointjs/agregacionBus.ts` (399) |
| R7 | Autoinvocación con zigzag | CONSERVAR (render); corregir el kernel | IV2. El render sirve; el kernel crea la autoinvocación con `demora: "1s"` (ver O9) y existe solo por una ruta aparte (`modelo/autoinvocacion.ts`), porque `crearEnlace` rechaza `origen = destino` | `render/jointjs/autoinvocacionLoop.ts`, `modelo/autoinvocacion.ts` |
| R8 | Menú de tipos filtrado por firma y modo enlace con tipo sugerido | CONSERVAR | R-OPD-EDIT-1, R-OPD-UI-5; eliminar el preview OPL divergente | `ui/MenuTipoEnlace.tsx` (`:265-286`), `modelo/opcionesEnlace.ts:12,45,100`, `canvas/modoEnlace.ts:19,113` |
| R9 | Reanclar extremos de estructurales fundamentales | CONSERVAR y completar | R-OPD-EDIT-7; el reanclaje existe en el inspector, pero no cubre el compuesto triangular | `ui/inspectorEnlace/SeccionReanclaje.tsx` |
| R10 | Estados como cápsulas gestionadas por layout dentro del objeto | SIMPLIFICAR | R-OPD-EST-1; sin x/y propios | `render/jointjs/composers/estados.ts` |
| R11 | Drag de subproceso confinado; rebote de externo movido dentro del contenedor | CONSERVAR y completar | R-OPD-UI-3 (cumple con `restrictTranslate`); R-OPD-REF-5 (hoy advierte, no rebota) | `render/jointjs/**`, `diagnosticoVisual.ts:241` |
| R12 | Viewport: centrar al cambiar de OPD, crear alrededor del centro visible | SIMPLIFICAR | R-OPD-LAY-10; un servicio con `encuadrar(opd)` y `preservar()` | piezas dispersas (`ui/RenombradoInline.tsx:24`, `ui/ArbolOpd.tsx:308`, adaptador) |
| R13 | Export `canon-diagrama` SVG limpio por OPD | SIMPLIFICAR | R-OPD-EXP-1/3. Hoy la descarga al usuario es PNG: `descargarOpdActualPng` toma el paper vivo y arrastra chrome, y el ZIP usa un paper offscreen. Ya existe un camino SVG offscreen (`exportarOpdOffscreenSvgPng`, `mapaExport.ts:165`, con `removerChromeEdicionSvg` `:240` y `normalizarColoresSvg` `:360`), que usan el lector portátil, la revisión y el render headless, pero no el usuario. Es la base natural de `canon-diagrama`; le faltan descarga SVG y gates (D2) | `render/jointjs/mapaExport.ts` |
| R14 | Grid opcional, suprimida en export | CONSERVAR | R-OPD-LAY-3 | configuración de cuadrícula |
| R15 | Traer conectados (bring connected) | RETIRAR | §0.4. **No retirar** `traerEntidadAlOpd` (`canvas/operacionesBatch.ts:263`), que realiza «traer cosa existente» (T-252) y vive en el mismo módulo que `traerConectadosBatch` (`:147`) | `ui/DialogoTraerConectados.tsx`, `canvas/reglasTraer.ts`, `canvas/operacionesBatch.ts:147-262` |
| R16 | Selección múltiple, rubber band, eliminar en lote, mover con flechas | CASO LÍMITE: CONSERVAR mínimo | No exigido. Sin él, borrar o mover grupos en modelos de 25 cosas por OPD cuesta N gestos. Conservar selección múltiple, eliminar y mover; retirar alinear, distribuir, `conectarMultiAlTodo` y copiar/pegar (`UiPortapapelesVisual`) | `canvas/seleccionMultiple.ts`, `render/jointjs/handlers/rubberBand.ts`, `canvas/operacionesBatch.ts` |
| R17 | Rutado y estética heredados de OPCloud (`opcloudRouting`, `beautifyConnectedLinks`, `sortStructuralLinks`, `abanicoDragSync`, `gestosTouch`, overlays de familias y declaraciones) | RETIRAR | Geometría derivable o extensiones; R4 basta (rectos al centro, ortogonales en estructurales) | `render/jointjs/*.ts` (~1,1k) |

### 3.5 Store, capa de aplicación e interfaz

| # | Capacidad | Decisión | Justificación | Archivos hoy |
|---|---|---|---|---|
| U1 | Store único (~557 claves, 11 slices) | SIMPLIFICAR | Documento + selección + interacción + diálogo; `aplicar(op)` como única mutación (T-011) | `store/runtime.ts` (1.769), `store/tipos.ts` (956), `store/**` (14.375) |
| U2 | `commitModelo` con 3 sincronizaciones de puertos, guard de herencia, familias, checkpoint IndexedDB | SIMPLIFICAR | validar → aplicar → derivar; sin sincronizaciones geométricas | `store/runtime.ts:1103-1181` |
| U3 | Undo/redo | CASO LÍMITE: CONSERVAR simple | El canon no lo exige (§0.4), pero sin él la edición directa es frágil; el redo actual tiene un bug de rebase | `store/runtime.ts:1595-1769` (`:1742`) |
| U4 | 112 ports y 48 viewmodels | RETIRAR la indirección | ~3,5k líneas de reenvío; 8 puertos con lógica real | `app/ports/**`, `app/viewmodels/**` |
| U5 | Atajos O/P/S/R, Shift+I, Shift+U, Ctrl+0, Ctrl+K, Ctrl+S, Ctrl+Z | CONSERVAR | Operaciones mínimas §5.7; evitar Ctrl+W/T/Tab/1..9/D/H reservados por el navegador | `ui/atajosTeclado.ts`, `app/ports/globalShortcutsPort.ts:221-340` |
| U6 | Paleta de comandos | SIMPLIFICAR | 60 ítems con duplicados; añadir un menú visible mínimo (Archivo) | `ui/CommandPalette.tsx` |
| U7 | Inspector de entidad (17 secciones) y de enlace (12) | SIMPLIFICAR | Nombre, esencia/afiliación, estados, descripción, refinamiento, duración; enlace: tipo, extremos con estado, control, multiplicidad, etiqueta, ruta | `ui/InspectorEntidad.tsx`, `ui/InspectorEnlace.tsx`, `ui/inspector/**`, `ui/inspectorEnlace/**` |
| U8 | Timeline de subprocesos | CONSERVAR como editor de bandas | §5.7 «reordenar subprocesos en bandas»; hoy mueve Y sin escribir `ordenInzoom` | `ui/Timeline.tsx`, `store/modelo/acciones-canvas.ts:852-876` |
| U9 | Árbol OPD y breadcrumb | CONSERVAR | R-ARB-1, navegación | `ui/ArbolOpd.tsx`, `ui/arbol/**`, `ui/Breadcrumb.tsx` |
| U10 | Buscar cosas (Ctrl+F) | CASO LÍMITE: CONSERVAR | No exigido; sin él, navegar 36 OPDs y 262 entidades es impracticable. Existe además `DialogoBuscarGlobal.tsx` (95), una búsqueda entre modelos guardados que es acreción y se retira | `ui/DialogoBuscarCosas.tsx` |
| U11 | Tabla de enlaces | CASO LÍMITE: SIMPLIFICAR | No exigida; compensa la selección de líneas de 1 px y sirve de vista de revisión | `ui/TablaEnlaces.tsx` |
| U12 | Configuración (cuadrícula, esencia OPL) | CONSERVAR | R-OPL-CFG-1, R-OPD-LAY-3 | diálogo de configuración |
| U13 | Tutor «Criterio / Fundamento», pregunta guía obligatoria, estado vacío con dos arranques | RETIRAR | §0.4 y §8 canon: el método no bloquea; `TutorDetails` se usa en 26 archivos | `tutor/**`, `ui/**` (tutor), `CodexSelectionAnnotation.tsx` |
| U14 | Panel del agente, acciones documentales (revisión, propuesta, pieza, paquete) | RETIRAR | No exigidos; ocupan unos 165 px fijos sobre el lienzo | `ui/agent/**`, `ui/portable/**`, `ui/review/**`, `ui/reuse/**` |
| U15 | Anotación de selección en canvas (917 líneas) | SIMPLIFICAR | 2 o 3 acciones, sin superponerse | `ui/codex/CodexSelectionAnnotation.tsx` |
| U16 | Pestañas múltiples | CASO LÍMITE: RETIRAR | No exigidas; generan la identidad dual `modelo.id`/record id | `store/pestanas.ts:294-296` |
| U17 | Shells móviles (lectura por flag, edición sin herramientas) | RETIRAR (caso límite) | No exigidos; 0 uso móvil | `ui/mobile/**`, `VITE_MOBILE_READONLY` en `docker-compose.yml:8` |
| U18 | Capturador de bugs y ledger en la app | RETIRAR del producto | No exigido; si se conserva como herramienta de desarrollo, añadir snapshot del modelo | `server/bugCapture.ts`, `server/bugIndex.ts`, `ui/CapturadorBugs.tsx` |
| U19 | Lenguaje visual Codex | SIMPLIFICAR | Una fuente de unas 30 variables; hoy 5 copias con deriva (`index.html:8-131` distinto) | `ui/tokens.ts` (473), `render/jointjs/constantes.codex.ts`, `ui-forja/tokens.*` |
| U20 | ~38 modales y 4 indicadores de guardado | SIMPLIFICAR | Un indicador; un router de diálogos | `ui/Dialogo*.tsx`, `ui/DocumentPersistenceStatus.tsx` |
| U21 | Import/Export JSON visible | CONSERVAR | §7 canon; hoy el diálogo es inalcanzable y «Borrar» no confirma | `ui/DialogoImportarExportarJson.tsx`, `ui/PersistenciaJson.tsx:118` |
| U22 | Abrir, guardar como, nuevo modelo y login | CONSERVAR simplificado (infraestructura mínima) | Es la única vía para abrir un modelo. Hoy `DialogoCargarModelo.tsx` (1.108 líneas) es el gestor «Trabajo de modelado», con Taller, Modelos, Bibliotecas, Archivo y carpetas. Retirar esos espacios (P8, §3.7) **no** retira el diálogo: queda una lista de modelos con abrir, renombrar, duplicar, eliminar e importar JSON | `ui/DialogoCargarModelo.tsx`, `ui/DialogoGuardarComo.tsx`, `ui/PantallaLogin.tsx` |
| U23 | Menús contextuales de cosa, estado, enlace y OPD | CONSERVAR | T-252 y T-251 (quitar de este OPD frente a eliminar del modelo); es donde falta descubribilidad (§7.1-6) | `ui/MenuContextual{Entidad,Estado,Enlace,Arbol}.tsx` (~660), `ui/ejecutarAccionContextual.ts` |
| U24 | Halo flotante de estado | RETIRAR | Su propio comentario lo declara duplicado del inspector y del menú contextual (`HaloEstado.tsx:9-17`) | `ui/HaloEstado.tsx` (351) |
| U25 | Gestión del árbol OPD (renombrar, eliminar hoja, reordenar hermanos) | CONSERVAR simplificado | T-083 (solo hojas eliminables). Retirar el reorden manual (`ordenLocal`, `modelo/opdReorden.ts` 283), que contradice DR-4 (hermanos en orden de creación). Retirar también `moverNodo` (`opdReorden.ts:130`): reasigna el padre de un OPD, incluso a `null`, sin mover la cosa refinada, lo que rompe la relación OPD hijo ↔ refinamiento (R-ARB-1, R-IDP) | `ui/GestionArbolOpd.tsx`, `ui/MenuContextualArbol.tsx`, `modelo/opdReorden.ts` |
| U26 | Hoja de atajos, duración de estado, mover puerto | RETIRAR | `CheatsheetAtajos` no es exigido (basta la paleta); `ModalDuracionEstado` edita `Estado.duracion`, que no es canon (el canon pide duración de **proceso**, K12); `DialogoMoverPuerto` es geometría de puertos (R3) | `ui/CheatsheetAtajos.tsx`, `ui/ModalDuracionEstado.tsx`, `ui/DialogoMoverPuerto.tsx` |

### 3.6 Persistencia y servidor

| # | Capacidad | Decisión | Justificación | Archivos hoy |
|---|---|---|---|---|
| P1 | Formato `deep-opm-pro.modelo.v0` | CONSERVAR | Método F: «No emitir `formato` distinto»; campos nuevos como opcionales (DR-41) | `serializacion/json.ts:19-39` |
| P2 | Hidratación todo-o-nada con whitelist y 9 migraciones implícitas | SIMPLIFICAR | R-ESC-OP-4: cargar con errores recuperables; rechazar solo referencias rotas; un migrador explícito que informe pérdidas | `serializacion/**` (3.633), `validarEstados.ts:85` |
| P3 | Axioma ≥2 estados y rechazo del manejador no ambiental | RETIRAR | R-OBJ-2 (s ≥ 1); R-EXC-1A solo advierte | `serializacion/validarEstados.ts:85`, validadores de import |
| P4 | Backend Bun + PostgreSQL con `revision` y 409 | CASO LÍMITE: CONSERVAR mínimo | Infraestructura para abrir y guardar en una instancia pública con datos reales | `server/modelPersistence.ts:183,290,357`, `app/scripts/model-persistence-api.ts` |
| P4b | Repositorio en memoria para `vite dev` y E2E | CONSERVAR mínimo | Sin él, desarrollo y smoke E2E exigen PostgreSQL; hoy arrastra Taller y Graduar (`repoMemoria.ts` importa `graduarApunte` y `reabrirModeloEnTaller`) | `server/repoMemoria.ts` (359), `server/devModelPersistence.ts` (176), `vite.config.ts` |
| P5 | Auth v1 (scrypt, cookie HMAC 30 días) | CASO LÍMITE: CONSERVAR | Sin login la instancia pública queda abierta | `server/passwordHash.ts`, `server/persistenceSession.ts`, `docs/specs/auth-identidad-v1.md` |
| P6 | Autosave | CASO LÍMITE: SIMPLIFICAR | Protege trabajo; un solo carril | `server/modelPersistence.ts`, `persistencia/autosalvado.ts` |
| P7 | Versiones manuales con poda logarítmica | CASO LÍMITE: RETIRAR o mínimo | §0.4 lista «versiones» entre extensiones; decide el dueño | `persistencia/politicaVersiones.ts` |
| P8 | Workspace, carpetas, especies, archivo, recientes | RETIRAR (carpetas: caso límite) | No exigidos; basta una lista de modelos | `persistencia/workspace.ts`, `ui/panelCarpetas/**` |
| P9 | Local-first (IndexedDB, journal sin poda, syncQueue, recuperación) | RETIRAR | No exigido; introducido el 09-30 sin desplegar | `persistencia/localRepository.ts`, `syncQueue.ts` |
| P10 | Paquete portátil, lector, service worker | RETIRAR | No exigido | `serializacion/portablePackage.ts`, `ui/portable/**`, `sw.js` |
| P11 | Revisión compartida por token | RETIRAR | No exigida | `server/review/**` |
| P12 | Agente LLM y gateway de cambios | RETIRAR (conservar la idea) | No exigido. La idea «operación tipada → validar → aplicar con inversa» ya tiene realización en el **kernel**: `modelo/changes/` (768 líneas; `SemanticOperation` con precondiciones, `applyChangeSet`, `diffModel` con `ModelChange {path, before, after}`, `buildInverse` y `validateInverse`, `apply.ts:37-151`). `store/runtime.ts:25` ya lo usa para el historial. Es la base portable de `aplicar(op)` y de un undo por diferencias, aunque cubre pocas operaciones (crear, renombrar, enlace procedimental, borrar, XOR, refinamiento) | `server/agent/**` (~4,65k), `server/agent/changeGateway.ts:146-244,287-329`, `modelo/changes/**` |
| P13 | Puente mesa (CLI, `MesaBaseWitnessV1`) | RETIRAR (caso límite) | Consumidor externo; la skill puede usar la API de modelos y el JSON | `mesa/**`, `app/scripts/mesa-cli.ts` |
| P14 | Autoría headless, compilador proto, `render:headless`, `verify:reproducible` | RETIRAR (caso límite) | Consumidor externo `hd-opm`; el import JSON cubre el intercambio | `autoria/**` (~6,95k) |
| P15 | Deploy (`./deploy/deploy.sh`, compose, nginx, backup) | CONSERVAR simplificado | `AGENTS.md` exige `deploy.sh`; retirar el sidecar de bugs y la dependencia del corpus KORA | `deploy/**`, `docker-compose.yml`, `Dockerfile` |

### 3.7 Extensiones Forja y material meta

| Capacidad | Decisión | Justificación |
|---|---|---|
| Apunte, Taller, Bocetos, Integrar, Devolver, Graduar, Reabrir, Biblioteca, Archivo | RETIRAR | DR-42: PUEDE; si se conservaran, arrastran DEBE internos (T-320) |
| Simulación conceptual y numérica (kernel 3.340 + barra 1.171 + panel 377) | RETIRAR | §0.4: runtime excluido; queda como referencia el pipeline ECA (`modelo/simulacion/runner.ts:58-369`, `plan.ts`) |
| Estereotipos, `<<Requirement>>`, requisitos, satisfacción | RETIRAR | §0.4 |
| Anclaje, Pieza, Calco, Centinela, `modelo/reuse/`, plantillas locales | RETIRAR | §0.4 (R-OPD-ROT-9) |
| Anclas normativas, declaraciones no nucleares, notas de mesa, mesa de exploración, ficha de trabajo, log de decisiones, sello de procedencia | RETIRAR con reporte de pérdida al importar | T-004: no emiten OPL; no los exige el canon |
| Razonamiento («impacto de eliminar», «qué requiere», «aguas abajo») | RETIRAR | No exigido; la confirmación de «eliminar refinamiento» que lista pérdidas sí se conserva (DR-17) |
| Canon/cordón, `canon/doctrina.ts`, resolutor URN, `tutor:corpus` | RETIRAR | Gobierno documental (§0.4) y build que depende de `/home/felix/...` |

### 3.8 Verificación, documentación y material de referencia

| Pieza | Decisión | Justificación |
|---|---|---|
| Leyes de producto: `law-json-roundtrip`, matriz de refinamiento, `opl-reverse` (safe-lens), `invocacion-implicita-bimodal`, `refinamiento-{cascadas,frontera,equivalencia}`, `supresion-estados-aparicion`, `hechos-pegado`, `contencion-refinamiento` L7, atomicidad de undo, `silencio-readonly`, `completitud.test.ts` | CONSERVAR | T-300..T-302; son leyes no tautológicas y rápidas (293 tests en 1,13 s) |
| `dependencias-unidireccionales` | SIMPLIFICAR a regla de lint | — |
| Leyes sobre prosa (`corpus-documental`, `manual-limites`, `manual-*-opm`), `taller-*`, `anclaje-*` (1.321 líneas), tests de estilos literales (`BarraSimulacion.styles.test.ts` 320) | RETIRAR | Congelan documentos o estética |
| E2E: 76 specs, 337 tests; 24 fallos estables de infraestructura (15 por la carrera de Ctrl+K) | SIMPLIFICAR | 25 a 40 escenarios por rol accesible, con contrato «app lista»; conservar las 13 fábricas de `e2e/_smoke-helpers.ts:544-1130` |
| Gates `design:governance`, `cordon:*`, `quality:gate`, `ux:eval`, `bug:index`, `in-vivo-*`, `gate:refactor` de 8 pasos | RETIRAR | `bun run check` + smoke + build; se conserva el presupuesto de bundle (≤124,62+5 kB gzip) |
| `docs/manual-opm-puro.md`, `manual-opforja.md` §0-§10, `JOYAS.md`, `NOTICE.md`, `AGENTS.md`, specs de invocación implícita §1-§4 y sincronización de orden | CONSERVAR (el manual, como material humano) | Conocimiento durable. `manual-opm-puro.md` **no** es autoridad y diverge del canon: su Apéndice B (`:1695-1790`) lista D11/D12, CX4, RX1/RX2, `varía de X a Y` y `es de tipo`, que el canon no emite o difiere (DR-3, DR-10, §0.4). Marcar esas divergencias o archivarlo junto a `docs/reference/` |
| `docs/canon-opm/` (4 fichas de unos 4 KB y `resolutor-urn.json`) | REEMPLAZAR | Hoy son punteros a KORA. Es el sitio natural para la copia versionada de los 4 documentos del canon y de `CANON.md` (pregunta 16) |
| Manuales de sistemas, software y sanitarios; 16 hojas rápidas; actas; `docs/reference/` (~16.500); `ui-forja/01-08` desfasados | RETIRAR o archivar | Fuera del producto o superados |
| `opm-extracted/` (12 MB, ~164k líneas decompiladas), `assets/` (usa 9 de 84), `fixtures/`, `catalog/`, `config/`, `webroot/` (con gtag), `setup.sh`, skills `lineas-paralelas` ×2 | RETIRAR | Riesgo legal (NOTICE), sin consumidores; reemplazar los 9 SVG por glifos |

### 3.9 Casos límite documentados

1. **Undo/redo** (U3): no exigido (§0.4, spec-OPD G-06), pero la edición directa y la aplicación
   OPL multipaso lo necesitan. Conservar una pila de estados inmutables, una entrada por
   `aplicar(op)`; retirar el historial de intenciones del agente.
2. **Backend, login y autosave** (P4-P6): ninguna regla los pide, pero abrir y guardar en la
   instancia pública con modelos reales sí. Mínimo: cuentas, modelos con `revision` y 409,
   autosave único por modelo.
3. **Versiones** (P7): §0.4 las nombra junto a Bocetos. Se retiran si autosave y JSON bastan.
4. **Carpetas y pestañas** (P8, U16): una lista de modelos (renombrar, duplicar, eliminar) cubre
   la infraestructura; sin pestañas desaparece la identidad dual `modelo.id`/record id.
5. **Forma del v0** (P1): CANON §1.2 usa arreglos y `apariciones` en la raíz; el v0 real usa
   mapas por id y `opds[].apariencias`. DR-41 manda conservar el núcleo con sus nombres: mantener
   la forma v0 y leer §1.2 como tipos ilustrativos.
6. **Consumidores externos** (`hd-opm`, skill, `mesa`, `render:headless`): salen del producto; su
   contrato pasa a ser el JSON v0 y la API de modelos (se pierde la byte-identidad HODOM).
7. **Timeline** (U8) queda como editor de bandas; **búsqueda** y **tabla de enlaces** (U10, U11)
   quedan porque sin ellas los modelos grandes no se navegan.
8. **Motor de render** (R2): el cambio lo justifica la complejidad accidental, no el canon;
   exige golden SVG antes (§8).
9. **Estados y subprocesos semilla** (K7, K15): el canon admite un estado y pide nacer con nombre
   (DR-11). Hoy S crea dos estados `estado1`/`estado2` (`estados.ts:92-95`), el in-zoom siembra
   **tres** subprocesos «`P` 1..3» y el despliegue tres partes «`X` parte 1..3» (sonda), todos con
   nombres semilla. Propuesta: S crea un estado con edición enfocada; el in-zoom siembra dos
   subprocesos (el mínimo de AP-13) con renombrado encadenado y no crea el que se cancela.
10. **Registro de conformidad** (D5): sí se exige (T-001); se retira su test autorreferente.
11. **Lector móvil y capturador**: no exigidos; el capturador puede sobrevivir como herramienta de
    desarrollo fuera del bundle.
12. **Selección múltiple** (R16): no exigida; se conserva la mínima (seleccionar, mover, eliminar)
    porque sin ella operar sobre un OPD de 20-25 cosas es lento.
13. **Repositorio en memoria** (P4b): no es producto, pero sin él no hay `dev` ni E2E sin
    PostgreSQL.
14. **Visibilidad de enlaces y abanicos por OPD** (K20, §5.1): hoy se persiste (`opd.enlaces`,
    `abanico.opdId`) y decide qué oraciones salen en cada bloque OPL (`generar.ts:130-175`).
    Derivarla, como pide el canon, cambia qué muestra cada OPD en los modelos existentes; el
    migrador debe comparar el OPL por OPD antes y después.

---

## 4. Catálogo consolidado de reglas OPM

### 4.1 Autoridad y niveles

- Precedencia (CANON §0.3): `reglas` decide validez y severidad y manda en plantillas;
  `spec-OPD`/`spec-OPL` deciden la realización; el método no bloquea por sí solo; OPCloud, el
  libro y el código v0 **no** son autoritativos.
- Niveles: Canónico · Canónico condicionado (pedir dato o advertir) · No canonizado
  (`non-canonical`, nunca prohibición) · Prohibido (impedir o error estructural recuperable) ·
  UI/vista (no emite OPL).
- No sobrebloquear (R-AP-0C, T-003): lo canónico que no se ofrece responde
  `unsupported-canonical` (R-IMPORT-5) y va al registro de conformidad (R-CONF-7).

### 4.2 Ontología: cosas, estados y atributos

| Regla | Origen | Código | Nota |
|---|---|---|---|
| Cosa = objeto o proceso, enum cerrado (R-COSA-1, T-012) | [ISO] | CUMPLE (`tipos/entidad.ts:16`) | — |
| Perseverancia derivada del tipo, sin campo ni glifo (DR-3); D11/D12 nunca se emiten | [ISO]/[F] | CUMPLE | Proceso persistente = TS3 con entrada = salida |
| Esencia física/informacional (default informacional); afiliación sistémica/ambiental (default sistémica); en la cosa, no en la apariencia (T-013) | [ISO] | CUMPLE | La frontera nunca es efecto del layout |
| Afiliación heredada por cadena estructural; rasgos de cosa ambiental son ambientales; propagar y advertir (R-OBJ-6/7, R-OPD-STR-13, T-091) | [F] | PARCIAL (`modelo/afiliacionEfectiva.ts`, solo render) | Falta propagación al crear exhibición y advertencia |
| Nombre único en el modelo, objetos y procesos en un mismo espacio; reuso = nueva apariencia; colisión explícita (T-024, DR-22) | [F] | PARCIAL (`colisionNombre.ts`; duplicados tras unfold/in-zoom) | — |
| Léxico: cosa = palabras con letra/dígito/`-`/`_`, primera capitalizada; estado = una palabra en minúscula; sin normalización silenciosa (T-025) | [F] | PARCIAL (no se valida la capitalización; `-ing` aceptado en `nombresCanonicos.ts:80`) | — |
| Sin placeholders: la cosa y el estado nacen con nombre (R-ENT-2, DR-11) | [F] | CONTRADICE (nombres semilla y supresión del OPL, `refsHints.ts:212-218`) | — |
| Estado solo en objeto, atómico, orden persistido; ningún proceso tiene estados (T-015, AP-12) | [ISO] | CUMPLE | — |
| Objeto con 1 o más estados es válido (R-OBJ-2, s ≥ 1) | [ISO] | CONTRADICE (`validarEstados.ts:85`, `estados.ts:78-110` exigen ≥2) | T-270 retirado del canon |
| Designaciones: inicial 0..*, final 0..* (combinables en D10), por defecto 0..1, `Current` declarado 0..1 (T-016, T-017) | [ISO] + [F] (`Current` declarado) | PARCIAL: `esInicial/esFinal` y `designaciones[]` duplicados; exclusión default⊕current inventada (`estadosDesignaciones.ts:17,24`) | — |
| Supresión: oculto ⇔ suprimido global ∨ local; no se suprime un estado enlazado en ese OPD; conjunto completo = unión (T-018) | [F] | PARCIAL: el predicado cumple (`estadoVisibleEnAparicion`), pero la supresión local sobrebloquea: prohíbe ocultar en un OPD un estado que está enlazado solo en otro (`visibilidadEstados.ts:114`, sonda). El OPL no emite D6 `…, y otros estados.` cuando hay estados ocultos (FALTA T-101 ★, sonda) | — |
| Atributo = objeto exhibido; valores = estados del atributo; `valorSlot` → `**A** de **X** es valor.` (T-019, T-020) | [ISO] | PARCIAL: el OPL emite «Atr es valor» | — |
| Instancia visual ≠ lógica; rótulo `NombreInstancia : NombreClase` derivado del enlace (R-OPD-ROT-4, DR-8) | [ISO]/[F] | FALTA el rótulo derivado | — |
| Duración de proceso `{min?, esperada?, max?, unidad?}`, > 0, unidad del modelo por defecto; enum `ms, sec, min, hour, day, week, month, year` (T-021) | [ISO] | FALTA (solo `Estado.duracion`; enum propio `ms, s, min, h, dia, sem, mes, año`) | — |
| Género gramatical por cosa, masculino por defecto (T-035) | [F] | FALTA (no hay campo) | Necesario para `un/una` |
| Colección incompleta por (refinable, relación), nunca en clasificación (T-034) | [ISO] | FALTA | — |
| Ningún estado de runtime se persiste (T-036) | [F] | PARCIAL (parámetros de simulación persistidos en `Entidad.simulacion`) | — |

### 4.3 Enlaces: firma, extremos y marcas (CANON §2.1)

| Tipo | Familia | Origen → destino | Estado en extremo objeto | `e`/`c` | Abanico | Mult. | Ruta | Código |
|---|---|---|---|---|---|---|---|---|
| consumo | transformadora [ISO] | objeto → proceso | entrada (TS1) | sí/sí | sí | objeto | sí | CUMPLE |
| resultado | transformadora [ISO] | proceso → objeto | salida (TS2), nunca inicial | no/no | sí, sin control | objeto | sí | CUMPLE (AP-04 en `enlaces.ts:113-116`) |
| efecto | transformadora [ISO] | objeto ↔ proceso, objeto con ≥1 estado | ninguno (T3), entrada+salida (TS3), entrada (TS4), salida (TS5) | sí salvo mitad escindida | sí | objeto | no (DR-19) | PARCIAL: la UI ofrece efecto sin estados; dos codificaciones del cambio de estado |
| agente | habilitadora [ISO] | objeto **físico** → proceso (proxy de humano, DR-5 [F]) | HS1 | sí/sí | sí | objeto | no | CUMPLE (`helpers.ts:99-103`) |
| instrumento | habilitadora [ISO] | objeto → proceso | HS2 | sí/sí | sí | objeto | no | CUMPLE |
| invocacion | invocación [ISO] | proceso → proceso (mismo = autoinvocación) | — | nunca (AP-10) | sí | no | no | PARCIAL: la firma cumple; la autoinvocación nace con `demora: "1s"` y emite `… se invoca a sí mismo después de 1s.` (no IV2); la «doble vara» debe impedirse al crear (R-INV-2B) |
| excepcionSobretiempo / excepcionSubtiempo | excepción, 6.ª familia [F] | proceso fuente → proceso de manejo | — | nunca | no | no | no | PARCIAL: cotas en el enlace; manejador no ambiental se rechaza (debe advertir) |
| agregacion | estructural fundamental [ISO] | todo → parte, mismo tipo | — | nunca | no | solo parte | no | CUMPLE (dirección refinable → refinador) |
| exhibicion | estructural fundamental [ISO] | 4 combinaciones obj/proc | — | nunca | no | no | no | CUMPLE |
| generalizacion | estructural fundamental [ISO] | general → especialización, mismo tipo | ninguno o ambos | nunca | no | no | no | PARCIAL (el código rechaza todo estado) |
| clasificacion | estructural fundamental [ISO] | clase → instancia, mismo tipo | — | nunca | no | no | no | CUMPLE |
| etiquetado | etiquetada [ISO] | obj→obj o proc→proc; unaria admitida | origen, destino o ambos | nunca | no | ambos | no | PARCIAL: la relación **unaria** (origen = destino, R-OPD-STR-10) se rechaza (`enlaces.ts:104`, `opcionesEnlace.ts:71`, «Sprint 0»; sonda) y el parser no reconoce `**Persona** conoce **Persona**.` |
| etiquetadoBidireccional | etiquetada [ISO] | obj→obj o proc→proc | nunca solo destino (AP-11) | nunca | no | ambos | no | CUMPLE; etiquetas iguales ⇒ `reciproco` (R-STRE-1) |
| reciproco | etiquetada [ISO] | obj→obj o proc→proc | nunca solo destino | nunca | no | ambos | no | FALTA como tipo |
| excepcionSubSobretiempo | — | — | — | — | — | — | — | CONTRADICE: extensión (X), retirar |

### 4.4 Reglas transversales y de control

| Regla | Origen | Código |
|---|---|---|
| Validar firma y extremo de estado antes de crear; ofrecer solo tipos legales (T-040, T-041) | [F] | CUMPLE (`MenuTipoEnlace`, `opcionesEnlace.ts:45,100`) |
| A lo sumo **un** procedimental por par (objeto, proceso) en edición directa, salvo ramas de un mismo abanico; el enlace al contorno cuenta para todos los subprocesos (R-ROL-UNIC-1, R-OPD-HAB-4, DR-6) | [ISO]/[F] | PARCIAL (`enlaces.ts:1053-1105`): solo impide el duplicado exacto y la mezcla transformador+habilitador. Consumo desde estado más resultado a estado sobre el mismo par se crean sin error (sonda) y se leen como TS3. El enlace al contorno tampoco cuenta para los subprocesos: la guarda compara solo el par exacto (objeto, subproceso) y además ignora los enlaces derivados. En la reescritura, el abanico debe crearse como un solo gesto que produce sus ramas, porque la creación de enlaces ya no podrá permitir el segundo transformador «para agruparlo después» |
| `e`/`c` solo en Pre(P) (consumo, efecto de entrada, agente, instrumento); a lo sumo uno; nunca en resultado, invocación, excepción, estructurales ni mitades escindidas (R-MOD-4, R-COMB-3, AP-01/02/03/08/09/10/28) | [ISO] | PARCIAL (`modificadores.ts:198-209`): falla AP-08, porque la guarda mira `efectoEscindido.modo === "par"` y `splitEffectEnPar` no fija `modo` (sonda) |
| Consumo y resultado nunca anclados al contorno de un proceso descompuesto (AP-06, T-060 ★) | [ISO] | CONTRADICE: en el OPD hijo `crearEnlace` acepta `Sal → Hornear` (contorno) y el OPL del hijo emite `*Hornear* consume **Sal**.` (sonda) |
| Sin control el proceso espera; con `c` se omite; con `e` se dispara; la rama negativa es `de lo contrario *P* se omite` (R-ECA-1, R-COND-RAMA-1/2, R-MOD-NAT-2) | [ISO] | CUMPLE en OPL |
| Multiplicidad solo en etiquetados, agregación (parte) y procedimentales; nunca en extremo proceso (R-MULT-1/1A/1B) | [ISO] | PARCIAL (doble validador; `?` rechazado en inspector) |
| Ruta solo en consumo y resultado; nombre del modelador; emparejamiento por etiqueta idéntica (R-OPL-RUTA-2/3, R-VIS-RUTA-1, DR-19) | [ISO] + [F·prod] | PARCIAL |
| Evento desde objeto sistémico no cruza la frontera de un proceso descompuesto (AP-21) | [F] | PARCIAL (migración automática) |
| Evento a subproceso no primero: bloquear si un previo tiene transformador no omitible; advertir si todos son omisibles (AP-27) | [F] | FALTA (no verificado) |
| Salvo exhibición, refinable y refinadores con igual perseverancia (R-STRF-1) | [ISO] | CUMPLE (`helpers.ts:81-98`) |
| Estado no contiene nada; proceso no contiene estados (§3.11) | [ISO] | CUMPLE |

### 4.5 Abanicos

- AND = enlaces separados sin arco (sin entidad). XOR = un arco discontinuo; OR = dos arcos
  concéntricos, en el **extremo común** (R-FAN-GEO-2, DR-9). [ISO]
- ≥2 enlaces del mismo tipo con extremo común; familias convergentes y divergentes de consumo,
  resultado, efecto, agente, instrumento e invocación (CANON §2.2). [ISO]
- Habilitadores convergentes = AND plano por defecto; XOR/OR admitido en ambas direcciones
  (R-FAN-HAB-1). [F]
- Resultado e invocación sin `e`/`c`; en los demás, el control va por rama y es uniforme; un
  abanico con control mixto es `non-canonical` (R-FAN-3, DR-31). [F]
- Fan TS3 con entrada común: `*P* cambia **Obj** de `entrada` a exactamente uno de …`; si varían
  entrada y salida, la generación falla cerrada; el parser crea un TS3 por salida y un único
  abanico (R-FAN-5A/5B). [F]
- Con ruta en alguna rama no se agrupa (R-COMB-5). `Pr=p` no se ofrece (§0.4).
- Código: `abanicos.ts:354-397` CUMPLE en formación; sobrebloquea al exigir además el mismo puerto
  geométrico (A4, `:381-392`) y el OPL emite la lista con «y» en lugar de «o» (CONTRADICE).

### 4.6 Refinamiento y consistencia entre OPDs

| Regla | Origen | Código |
|---|---|---|
| Descomposición síncrona con orden; despliegue asíncrono, nunca `en esa secuencia` ni `paralelo` (R-REF-SYNC-1/2) | [ISO] | CUMPLE |
| Siempre en OPD nuevo (DR-24); operación atómica, sin estado semidescompuesto persistido (R-OPD-OP-3) | [F·prod] | CUMPLE |
| Contenedor agrandado con contorno grueso en padre e hijo; externos copiados; externo no se refina en el hijo; internos en cascada; mover un externo dentro no cambia su alcance (rebote) (R-HIJO-1..6) | [ISO]/[F] | PARCIAL. Cumplen: contorno agrandado, externos copiados, cascada de internos (T-080; sonda: al eliminar `Hornear` caen `Hornear 1..3` y quedan los externos) y alcance persistido (tras moverlo, el externo sigue `rol: "externo"`). Faltan: el rebote (T-081; solo advierte `visual-externo-dentro-contorno`) y la prohibición de refinar un externo desde el hijo (T-079 ★: la sonda despliega y descompone `Horno` en SD1 sin error) |
| Orden = bandas declaradas; Y lo realiza; misma banda = paralelo; el último del grupo invoca la banda siguiente; el layout no reordena (R-INV-2/2A/2C/2D, R-LAY-4) | [ISO] + [F] (bandas) | CUMPLE en campo; PARCIAL en layout (el auto-layout sin `ordenInzoom` cambia el OPL) |
| Doble vara: rayo entre bandas adyacentes = impedir (R-INV-2B); salto, bucle y cross-OPD por rayo explícito | [F] | PARCIAL: diagnóstico `INVOCACION_REDUNDANTE_CON_ORDEN`; `subproceso-no-conecta-al-padre` prohíbe el bucle de retorno (sobrebloqueo) |
| ≥2 subprocesos o refinadores para cerrar; con menos se permite, se advierte, bloquea el export y no se emite oración (AP-13, R-CX-0) | [ISO]/[F] | CUMPLE (`checkers.ts:245-315`) |
| Distribución: consumo → primer subproceso; resultado → último; efecto sin estado, agente e instrumento quedan en el contorno con lectura distributiva **sin copias**; TS3 ⇒ TS4 temprano + TS5 tardío con `escision {parId, mitad}`; evento sistémico migra al primero; estructurales quedan en el contenedor; invocación y excepción quedan en el contorno (DR-13, DR-14) | [ISO] tabla + [F] realización | CONTRADICE: `proyeccion.ts:703-735` crea copias derivadas para agente, instrumento y efecto, decide primero/último por geometría y envía invocación y excepción saliente al último, y la excepción entrante al primero (`:719-721`). Además **ninguna** migración conserva el id (T-075 ★): también consumo y resultado se realizan como copias `derivado` con id nuevo, y el original sigue en el refinado (sonda: `consumo:Harina→Hornear` + `consumo:Harina→Mezclar[derivado]`). La escisión TS3 no es automática: el TS3 compacto se copia como `afecta` sin estados a cada subproceso, y el par consumo+resultado llega al hijo como TS1/TS2 (sonda) |
| Despliegue por modo; hijo copia solo hijos estructurales directos; contorno grueso solo en OPD nuevo; rastrear refinadores con traza (R-REF-MEC-1, R-OPD-EDIT-6, DR-45) | [ISO]/[F] | PARCIAL (sin colección incompleta ni traza). Siembra tres partes «`X` parte 1..3». La oración CX3 sale sin etiqueta de OPD (`**Auto** se despliega en **Auto parte 1**, …`, no `… en SD1 en …`) y se emite en SD y en SD1 (sonda) |
| Sin ciclos; sin instancia visual entre tipos distintos; solo hojas eliminables; esencia, perseverancia y nombre invariantes (R-REF-1..4) | [ISO] | CUMPLE |
| Vista del padre derivada: extremo se abstrae al ancestro de descomposición con apariencia; fusión por fuerza (`consumo = resultado > efecto > agente > instrumento`; `evento > sin control > condición`); matriz R-PREC (R+R y C+C inválidos; R+C ⇒ efecto solo con continuidad, si no conflicto) (§3.5) | [ISO] fuerza/precedencia + [F] derivación | PARCIAL: proyecciones persistidas; `PAR_TRANSFORMADOR_DUPLICADO` como checker |
| Hijo: estructurales al contenedor visibles; entre internos visibles; lo que no toca contenedor ni internos se oculta (R-VIS-HIJO-1; desvío declarado por DR-13) | [F] | PARCIAL |
| Firma de frontera preservada por la descomposición (R-OPD-REF-10, R-CAT-EQ-3) como ley de test (DR-16) | [F] | PARCIAL (falso positivo en el checker) |
| Herencia no se dibuja ni se emite, pero los validadores la consultan (R-HER-1/8, DR-43) | [ISO] | PARCIAL |
| SD con exactamente un proceso sistémico ⇒ advertir (R-SD-4) | [ISO] | CUMPLE (`SD_SIN_PROCESO_PRINCIPAL`) |
| Árbol con raíz SD; `SDx.y` en preorden con hermanos en orden de creación; referencias por id (R-ARB-1, R-IDP-0..3, DR-4) | [F] | CONTRADICE: la etiqueta se escribe en `Opd.nombre` al crear (`refinamiento/helpers.ts:299-310`) y se lee con regex; el panel ordena en BFS; hay reorden manual (`ordenLocal`) y reasignación de padre (`moverNodo`) |
| OPL total = párrafos por OPD en orden de navegación; cada OPD verbaliza solo sus estados visibles (R-OPL-TOTAL-1..5) | [ISO] | PARCIAL: la verbalización por OPD cumple, pero sin D6 cuando se ocultan estados; el orden es BFS en el panel y DFS en el export; la oración de refinamiento CX1/CX3 aparece en el bloque del padre **y** en el del hijo (DR-24 la ubica en el hijo) |
| Eliminar refinamiento solo si el hijo es hoja, con confirmación que lista pérdidas (DR-17); nunca es la inversa de Integrar | [F] | CUMPLE (`DialogoEliminarRefinamiento`) |

### 4.7 OPL-ES

Principios [F sobre ISO]: tipografía portadora de tipo (`**objeto**`, `*proceso*`,
`` `estado` ``); una oración por línea terminada en punto; vocabulario cerrado (unión de
las palabras fijas de las plantillas, DR-27); verbos en 3.ª persona singular; listas con coma
y `y`/`o` antes del último, sin coma de Oxford; `e` ante sonido /i/ y `u` ante /o/ (DR-26); estado
tras el objeto con `en`; pasiva refleja (`se consume`, `se omite`); `puede estar` para estados
y `puede ser` reservado a especialización; sin `a` personal; monolingüe es-CL (T-005).

Plantillas exactas (CANON §4.4; todas canónicas y ★ salvo D13, VAL, SE3-SE5, SSE, RF1i,
abanico×control, rutas, multiplicidad y EX de respaldo):

```
Cosas y estados
D1  **Cosa** es física.                     (solo si física; DR-2)
D3  **Cosa** es ambiental.                  (solo si ambiental; D2/D4 solo se parsean)
D5  **Objeto** puede estar `e1`, `e2` o `e3`.
D6  **Objeto** puede estar `e1`, `e2`, y otros estados.
D7  Estado `s` de **Objeto** es inicial.      D8 … es final.      D9 … es por defecto.
D10 Estado `s` de **Objeto** es inicial y final.   (una oración)
D13 Estado `s` de **Objeto** es declarado `Current`.
VAL **Atributo** de **Objeto** es valor.
R-ENT-3 **Cosa** es un objeto físico y ambiental.   (solo parseo)
Transformadores
T1 *P* consume **O**.   T2 *P* genera **O**.   T3 *P* afecta **O**.
TS1 *P* consume **O** en `s`.   TS2 *P* genera **O** en `s`.
TS3 *P* cambia **O** de `a` a `b`.   TS4 *P* cambia **O** de `a`.   TS5 *P* cambia **O** a `b`.
Habilitadores
H1 **Agente** maneja *P*.   HS1 **Agente** en `s` maneja *P*.
H2 *P* requiere **Instrumento**.   HS2 *P* requiere **Instrumento** en `s`.
Evento
ET1 **O** inicia *P*, que consume **O**.     ET2 **O** inicia *P*, que afecta **O**.
EH1 **Agente** inicia y maneja *P*.         EH2 **I** inicia *P*, que requiere **I**.
ETS1 **O** en `s` inicia *P*, que consume **O**.
ETS2 **O** en `a` inicia *P*, que cambia **O** de `a` a `b`.
ETS3 **O** en `a` inicia *P*, que cambia **O** de `a`.
ETS4 **O** en cualquier estado inicia *P*, que cambia **O** a `b`.
EHS1 **Agente** en `s` inicia y maneja *P*.  EHS2 **I** en `s` inicia *P*, que requiere **I** en `s`.
Condición
CT1 *P* ocurre si **O** existe, en cuyo caso **O** se consume, de lo contrario *P* se omite.
CT2 *P* ocurre si **O** existe, en cuyo caso *P* afecta **O**, de lo contrario *P* se omite.
CH1 **Agente** maneja *P* si **Agente** existe, de lo contrario *P* se omite.
CH2 *P* ocurre si **I** existe, de lo contrario *P* se omite.
CS1 *P* ocurre si **O** está en `s`, en cuyo caso **O** se consume, de lo contrario *P* se omite.
CS2 *P* ocurre si **O** está en `a`, en cuyo caso *P* cambia **O** de `a` a `b`, de lo contrario *P* se omite.
CS3 *P* ocurre si **O** está en `a`, en cuyo caso *P* cambia **O** de `a`, de lo contrario *P* se omite.
CS4 *P* ocurre si **O** existe, en cuyo caso *P* cambia **O** a `b`, de lo contrario *P* se omite.
CS5 **Agente** maneja *P* si **Agente** está en `s`, de lo contrario *P* se omite.
CS6 *P* ocurre si **I** está en `s`, de lo contrario *P* se omite.
COND-ALT (solo parseo) Si **O** existe entonces *P* ocurre y consume **O**, de lo contrario se omite *P*.
Excepción e invocación
EX1 *Manejo* ocurre si duración de *Fuente* excede 5 minutos.
EX2 *Manejo* ocurre si duración de *Fuente* es menor que 30 segundos.
EXr … excede su duración máxima. / … es menor que su duración mínima.   (sin cota; se advierte)
IV1 *Invocador* invoca *Invocado*.   IV2 *Invocador* se invoca a sí mismo.
Estructurales
RF1 **Todo** consta de **P1**, **P2** y **P3**.       RF1i … y al menos otra parte.
RF2 **Exhibidor** exhibe **A1** y **A2**.            RF2b … exhibe **A1** así como *Op1*.
RF3 **E1** y **E2** son **General**.   RF3b **E** es un **General**.   RH1 **E** es un **G1** y un **G2**.
RF4 **I** es una instancia de **Clase**.   RF4b **I1** e **I2** son instancias de **Clase**.
SE1 **Origen** etiqueta **Destino**.   SE2 **Origen** se relaciona con **Destino**.
SE3 **Origen** etiqueta-f **Destino**. / **Destino** etiqueta-b **Origen**.   (dos oraciones)
SE4 **Origen** y **Destino** son etiqueta.   SE5 **Origen** y **Destino** se relacionan.
SSE1..SSE7 variantes con `en `s``; bi/recíproco nunca con estado solo en destino.
Abanicos (XOR = exactamente uno de, OR = al menos uno de; lista con «o»)
*P* consume exactamente uno de **A**, **B** o **C**.     Exactamente uno de *P*, *Q* o *R* genera **B**.
**B** es afectado por exactamente uno de *P*, *Q* o *R*.  *P* es manejado por exactamente uno de **A**, **B** o **C**.
*P* invoca exactamente uno de *Q* o *R*.                 *P* cambia **Obj** de `s0` a exactamente uno de `s1`, `s2` o `s3`.
**B** inicia exactamente uno de *P*, *Q* o *R*, y es afectado por el proceso que ocurre.
Gestión de contexto
CX1 *P* se descompone en *P1*, *P2* y *P3*, en esa secuencia.
CX2 *P* se descompone en paralelo *P1* y *P2*.
CXm *P* se descompone en *P1*, paralelo *P2* y *P3*, y *P4*, en esa secuencia.
CX3 **Cosa** se despliega en SD1 en **T1**, **T2** y **T3**.
Ruta y multiplicidad
Por ruta L, *P* consume **O**.   (antepuesto a la oración completa, incluida la de control)
? → un/una **X** opcional   * → **X** opcional (cero o más)   + → al menos un/una **X**
```

Reglas de emisión (DR-32), por OPD en preorden: (1) oración de refinamiento si es hijo;
(2) cosas visibles en orden de aparición: D1/D3, D5/D6, designaciones, `es valor`;
(3) procedimentales por proceso y por fuerza (consumo, resultado, efecto, agente, instrumento;
luego invocación y excepción), cada enlace con control emite solo su E\*/C\*; un abanico, una
oración; (4) estructurales agrupados por vértice y relación en OPDs no hijos, atómicos en
hijos; etiquetados al final; (5) empates por nombre e id. No se emite prosa compuesta en el
eje (a) (R-COMP-ZP-3).

Roundtrip y parseo [F]: `parsear(generar(m))` sin errores (R-§19-SIM-1); fixture estricto
línea a línea desde modelo vacío (R-§19-SIM-3, T-301); `no-delete-by-absence` (R-§19-LENS-1);
el preview no muta; aplicar patches vacíos = identidad (R-§19-LENS-3); parser por esqueletos
(DR-1) con `**A** <frase en minúscula> **B**.` como SE1 residual (DR-36); tipografía decide si
crear objeto o proceso (R-IMPORT-2); cambio de tipo ontológico ⇒ bloquear (R-IMPORT-7); TS4/TS5
parseados son siempre standalone; `se descompone en` crea los subprocesos faltantes (DR-35).
Editor [F]: 4 estados (`ignorada-vacia`, `aplicable`, `no-aplicable`, `sin-cambio`), 8 razones
cerradas (`forma-no-reconocida`, `entidad-no-existe`, `referencia-ambigua`,
`enlace-invalido-firma`, `conflicto-patches`, `inversa-no-soportada`, `puntuacion-faltante`,
`cambio-ya-presente`), mutaciones en tres fases (no-enlace, enlace, abanicos), creación de
enlace idempotente por tripla, aplicables todo-o-nada sobre copia (DR-39), sin bloquear el
documento en bloque (R-OPL-FALLO-7).

### 4.8 Divergencias del generador y del parser actuales (CONTRADICE salvo indicación)

| Canon | Hoy | Ubicación |
|---|---|---|
| D1/D3 atómicas solo si difieren | `**X** es un objeto físico y ambiental.` compuesta, incluso para defaults | `opl/generadores/estructural.ts:25-49` |
| `es por defecto.` / `es declarado `Current`.` / D10 una oración | `es Default.` / `es Current.` / `(inicial)` dentro de la lista D5 | `opl/generadores/duracionMetadata.ts:37-40,59-70` |
| `**A** de **X** es valor.` | `**A** es valor.` | generador de atributos |
| CS1 `… en cuyo caso **O** se consume …` | `… en cuyo caso *P* consume **O** en `s` …` | `procedural.ts:334` |
| SE3 en dos oraciones | una oración `**O** f **D**, y **D** b **O**.` | `procedural.ts:269` |
| Frases de multiplicidad (3 valores) | glifos crudos, rangos y pluralización | `procedural.ts`, `refsHints.ts:190-204` |
| Abanico con «o» | lista con «y» | `opl/generadores/abanico.ts` |
| `y/e`, `o/u` fonéticos | siempre `y`/`o` | `refsHints.ts:259-269` |
| Lista de 2 con `y` | `*P1*, *P2*` | `refinamiento.ts:305-308` |
| Estructurales agrupados en OPD no hijo (R-COMP-EJE-3) | una oración por enlace | `estructural.ts:67-79` |
| AND procedimental atómico | `*P* consume **A** y **B**.` agrupado, que el parser no descompone (✘ en la matriz de simetría) | `opl/generar.ts` (`generarLineasOpl`) |
| Descomposición de objeto sin orden temporal (DR-23) | `… en esa secuencia` en objetos | `refinamiento.ts:86-94` |
| Nada de negación, demora, EX combinada, RF2o, `[etiqueta: X]`, posesivo, duración de estado, `tiene unidad` | se emiten | ver O9 en §3.3 |
| Siempre emitir lo que existe | proceso con nombre semilla no emite OPL | `refsHints.ts:212-218` |
| TS3 con una sola codificación | par consumo+resultado **y** `efecto` con `estadoEntradaId/estadoSalidaId`. Reproducción mínima (sonda): con un solo TS3 en SD, compacto o en par, reparsear el OPL generado sobre el mismo modelo propone 1 `crear-enlace`, y tras aplicarlo vuelve a proponerlo; el reverse no es idempotente ni siquiera sin refinamiento | `opl/fixtures-roundtrip.ts:395-455` (raíz de UX-01), `generar.ts` (`transicionesEstadoInteractivo`) |
| Identidad por referencia tipada | identidad por posición de línea | `opl/parser/planificar.ts:34` |
| D6 `**O** puede estar `a`, `b`, y otros estados.` si hay estados ocultos (T-101 ★) | D5 truncado, sin marca | `opl/generar.ts:95-98`, `duracionMetadata.ts:65-70` |
| IV2 `*P* se invoca a sí mismo.` | `… después de 1s.` por la demora por defecto | `modelo/autoinvocacion.ts:9`, `procedural.ts:214` |
| CX1 `*P* se descompone en *P1*, *P2* y *P3*, en esa secuencia.` solo en el bloque del hijo, en primer lugar (DR-24, DR-32 §1) | sin coma antes de `en esa secuencia`; emitida en el padre y en el hijo, tras la clasificación | `opl/generar.ts:101-126`, `refinamiento.ts` |
| CX3 `**Cosa** se despliega en SD1 en **T1**, …` | sin `SDx en`; emitida en el padre y en el hijo | `refinamiento.ts` |
| Valor de atributo **además** de su clasificación D1/D3 | `oracionValorAtributo` sustituye la clasificación, así que el atributo físico o ambiental pierde D1/D3 | `estructural.ts:36-37` |
| Mitad TS4 con evento: ETS3 `**O** en `a` inicia *P*, que cambia **O** de `a`.` (y AP-08 lo impide en mitades escindidas) | `**Agua** en `fría` inicia *Hervir*, que afecta **Agua** en `fría`.` | `modificadores.ts:205`, `procedural.ts` |
| Canónico = `solo-difiere` independiente del display (T-139) | export y roundtrip con el display `siempre` | `estructural.ts:39`, `exportarMarkdown.ts` |
| Verbos siempre en singular (DR-12) | `constan`, `invocan`, `son` según multiplicidad | `estructural.ts:66-80`, `procedural.ts:232` |
| Parser: `afecta` sin `a` personal; sin `si … ocurre` en invocación | acepta `afecta a exactamente uno de` y `invoca exactamente uno de … si … ocurre` | `opl/parser/groups.ts:146,184` |

Coinciden con el canon (docs-opm-authority §6.1): T1-T3, TS1-TS5, H1/H2, HS1/HS2, ET1/ET2,
EH1/EH2, CT1/CT2, CH1/CH2, CS2 y CS4-CS6, EX1/EX2, IV1, RF1-RF4b, SE1/SE2/SE4/SE5, CX2,
mixta, rutas y D5 con `puede estar`. Corrección del crítico: IV2 y CX1 salieron de esta lista (ver
las filas nuevas de la tabla), y esta coincidencia es de **generación**. El parser inverso no crea
cosas desde esas plantillas sobre un modelo vacío (O2), así que la simetría solo se sostiene cuando
las cosas ya existen o las declara una oración de clasificación previa.

### 4.9 OPD: gramática visual

| Regla | Origen | Código |
|---|---|---|
| 8 representaciones: rectángulo/elipse × contorno sólido/discontinuo × con/sin sombra; sombra abajo-derecha ⟺ física (R-SOMB-1) | [ISO] | CUMPLE (`entidad.ts:118,123-139`, `dropShadow dx6 dy6 blur2`) |
| Contorno discontinuo = ambiental, persiste en todos los niveles | [ISO] | CUMPLE (`strokeDasharray "8 4"`, `entidad.ts:102-113`) |
| Contorno grueso = refinada en otro OPD (padre e hijo); despliegue intradiagrama no | [ISO] | CUMPLE (`entidad.ts:88-99`, 4 vs 1,5) |
| Rótulo íntegro, autosize, sin elipsis, en negro en canon (AP-23) | [F] | CUMPLE (`constantes.codex.ts:31-33`) |
| Estado: rountangle dentro del objeto, región inferior; inicial borde grueso; final doble borde | [ISO] | CUMPLE (`entidad.ts:878-913`) |
| Por defecto: flecha diagonal abierta **entrante**; `Current`: pin **externo** (DR-37) | [ISO]/[F] | CONTRADICE (`↗` y `●` interno, `entidad.ts:930-955`) |
| Chip `⋯N` de estados ocultos, persiste en export | [F] | CUMPLE (`entidad.ts:1092-1130`) |
| Marcadores: punta cerrada transformadores (consumo en el proceso, resultado en el objeto, efecto en ambos); piruleta negra agente, blanca instrumento en el extremo proceso; rayo con punta invocación; punta abierta etiquetado uni; arpón bi/recíproco | [ISO] | CUMPLE (`linkAssets.ts:24-90`) |
| Triángulo: vértice al refinable; lleno = agregación; triángulo interior = exhibición; vacío = generalización; círculo interior = clasificación | [ISO] | CUMPLE (`linkAssets.ts:93-117`, `markers.ts:34-116`) |
| Marcas: `e`, `c` cerca del proceso; `/` y `//` cerca del manejador, sin punta (DR-38); etiqueta estructural itálica; ruta sobre procedimental; multiplicidad junto al extremo | [ISO]/[F] | CUMPLE (`markers.ts:250-260`) |
| XOR un arco, OR dos arcos concéntricos, en el extremo común | [ISO] | CUMPLE (`abanicoOverlay.ts:9-49`) |
| Duración dentro de la elipse `[unidad] {min, esperada, max}` | [F] | FALTA |
| Color informativo; paleta `paper #fafaf8`, objeto `#27613f`, proceso `#1d3f78`, estado `#68711f`; crimson `#8e2a2e` solo para UI | [F] | CUMPLE (tokens Codex) |
| Layout: sin oclusión; procedimentales rectos al centro con recorte en el perímetro; estructurales ortogonales; advertir 21-25 cosas y bloquear export con más de 25; centrar al cambiar de OPD; grid solo de edición | [F] | PARCIAL (centrado frágil, UX-05) |
| Canal UI: selección subrayada en crimson sin redibujar bordes; canvas limpio de validación persistente; hover OPD↔OPL por referencia tipada | [F] | PARCIAL: selección y hover cumplen; el lienzo **no** está limpio de validación, porque `JointCanvas.tsx:265` sincroniza cada aviso de `validarModelo` como `ErrorBadge` persistente sobre la celda (T-228 ★, CONTRADICE) |
| Export `canon-diagrama` vectorial por OPD sin chrome; `canon-documento` con OPL | [F] | PARCIAL: el usuario solo descarga PNG (el del OPD activo, desde el paper vivo) y un ZIP PNG, sin gates. `canon-documento` es un Markdown copiado al portapapeles, con métricas, árbol y OPL pero **sin los diagramas** que exige T-281 (`perfilesExport.ts:135-200`). Existe un SVG offscreen reutilizable (`mapaExport.ts:165`) |

### 4.10 Diagnóstico exigido

Registro único DR-40 con severidad `error` (CRÍTICA, bloquea export: firma, clases,
aciclicidad, integridad OPD↔OPL), `warning` (ALTA/MEDIA) e `info` (BAJA), y cinco familias
(gramatical, metodológica, identidad, contención, sugerencia). Advertencias que **no**
bloquean (CANON §6.4): R-PROC-2 (proceso sin transformar, contando lo heredado), subproceso sin
transformado, <2 hijos (además bloquea export), 21-25 cosas, cruces al exportar, SD sin un único
proceso sistémico, nombres (R-NOM-OBJ/PROC/EST), etiqueta estructural, mezcla
infinitivo/nominalización, manejador no ambiental, afiliación no heredada, AP-27, refinador en
más de un contexto, externo movido dentro, LF-19, AP-26, traza de ajustes, excepción sin cota.
Anti-patrones AP-01..AP-30 con acción canónica en cada diagnóstico (R-AP-0B). Hoy:
`PROCESO_NO_TRANSFORMA` y el subproceso recién creado aparecen como «bloqueo» (CONTRADICE).

### 4.11 Balance de conformidad frente a CANON.md

(Revisado por el crítico: los cambios frente a la versión anterior están en §10.1.)

- **Cumple bien**: kernel único (T-010); firma y menú filtrado (T-040); AP-04 y régimen de
  control en enlaces no escindidos; bandas como fuente de verdad del campo (T-030); predicado de
  visibilidad de estados; aciclicidad (T-078); cascada de internos (T-080); gramática visual salvo
  dos glifos; tipografía y la mayoría de plantillas **de generación**; clasificación del editor
  OPL (4 estados y 8 razones); tokens y hover por referencia; `no-delete-by-absence`; reordenar
  líneas no muta (T-171, sonda); gate de densidad; bloques OPL por OPD con sangría y panel
  minimizable (T-241, T-247).
- **Parcial**: unicidad de rol (T-053: solo el duplicado exacto y la mezcla con habilitador);
  control (AP-08 roto en mitades escindidas); supresión local (sobrebloquea); vista del padre;
  herencia; alcance (validadores por geometría); multiplicidad (sin guarda de extremo y con
  rangos); rutas; partial-parse; import tolerante; `canon-diagrama` (PNG, sin SVG de usuario);
  `canon-documento` (sin diagramas); gates de export (solo densidad y Bocetos); centrado;
  diagnóstico unificado; afiliación heredada; firma de frontera; OPL total (BFS en panel,
  refinamiento duplicado en padre e hijo).
- **Falta**: duración de proceso y cotas EX (T-021), enum de unidades, `reciproco`, colección
  incompleta con traza (T-034, DR-45), género (T-035), glifos por defecto y `Current` (DR-37),
  alternancia `e/u`, agrupación estructural, reanclaje del compuesto triangular, rebote de
  externos (T-081), AP-26, AP-27, rótulo `Instancia : Clase`; **además**: D6 (T-101 ★),
  **escisión automática** al descomponer (T-074 ★), prohibir refinar un externo desde el hijo
  (T-079 ★), etiquetado unario, creación de cosas por tipografía en el parser (T-153 ★, T-165),
  miembros al parsear `se descompone en` (T-166 ★, DR-35), código `non-canonical` (T-157 ★),
  gates <2 hijos y errores estructurales (T-283 ★), registro de conformidad completo (T-001 ★).
- **Contradice**: ≥2 estados (kernel, hidratación y parser); default⊕current; rechazo del
  manejador no ambiental; `PROCESO_NO_TRANSFORMA` como bloqueo; `subproceso-no-conecta-al-padre`;
  supresión de OPL por placeholder; clasificación compuesta y canónico dependiente del display
  (T-139); `es Default/Current`; AND agrupado; copias en la distribución **con id nuevo también
  para consumo y resultado** (T-075 ★); TS3 compacto copiado como `afecta` sin estados; `SDx.y`
  escrito en el nombre; IV2 con `después de 1s`; consumo o resultado al contorno aceptado en el
  hijo (AP-06, T-060 ★); badges de validación en el lienzo (T-228 ★); reglas inventadas (D8);
  reverse no idempotente con un solo TS3 (UX-01 mínimo); extensiones emitidas como canon.

---

## 5. Contratos

### 5.1 JSON persistido: `deep-opm-pro.modelo.v0`

Definido en `serializacion/json.ts:19-39` y `modelo/tipos/*`:

```ts
interface DocumentoModelo { formato: "deep-opm-pro.modelo.v0"; modelo: Modelo; carpetaId?: Id | null }
// modelo (forma observada, fixtures y export en vivo):
{ id: "modelo-1", nombre, opdRaizId: "opd-1", nextSeq,
  entidades: { "o-1": { id, tipo: "objeto"|"proceso", nombre, esencia, afiliacion, descripcion?, esAtributo?, valorSlot?: { tipo, placeholder: "value", valor? },
                        refinamientos?: { descomposicion?: { opdId }, despliegue?: { opdId, modo } }, … } },
  estados:   { "s-7": { id, entidadId, nombre, esInicial?, esFinal?, designaciones?, suprimido?, duracion?, orden?, x?, y?, width?, height? } },
  enlaces:   { "e-5": { id, tipo, origenId: { kind: "entidad"|"estado", id, portId? }, destinoId: {…},
                        etiqueta /* obligatorio, "" si vacío */, modificador?, subtipoModificador?, multiplicidadOrigen?, multiplicidadDestino?,
                        estadoEntradaId?, estadoSalidaId?, efectoEscindido?: { grupoId, enlacePadreId, rol, modo? },
                        derivado?, rutaEtiqueta?, probabilidad?, demora?, backwardTag?, tasa?, tiempoMaximo?, … } },
  abanicos:  { … { id, operador: "O"|"XOR", enlaceIds, opdId, puertoComun: { entidadId, lado, portId }, puertoEntidadId, decision? } },
  opds:      { "opd-11": { id, nombre, padreId, preguntaGuia?, ordenInzoom?: Id[][], vista?, ordenLocal?,
                           apariencias: { "a-14": { id, entidadId, opdId, x, y, width, height,
                                                    contextoRefinamiento?: { tipo, refinableEntidadId, rol, contenedorAparienciaId, origen? },
                                                    ports?, estadosSuprimidos?, modoPlegado?, … } },
                           enlaces: { "ae-21": { id, enlaceId, opdId, vertices, symbolPos?, symbolAnchors?, labelPositions? } } } },
  descripcion?, /* + 14 extensiones en la raíz (familias por preestado, mesa, piezas, anclas, notas, declaraciones…) y metadatos de persistencia: archivado?, archivadoEn?, versiones?, crearVersionAlGuardar? */ }
```

Diferencias con CANON §1.2 y método F: el canon muestra arreglos y `apariciones` en la raíz;
`control: 'e'|'c'` en lugar de `modificador`; `escision {parId, mitad}` en lugar de
`efectoEscindido`; orden en `refinamientos.descomposicion.orden` en lugar de `Opd.ordenInzoom`;
`Opd.refinaEntidadId`/`tipoRefinamiento`; `Modelo.unidadTiempo`, `Entidad.duracion`, `genero` y
`coleccionIncompleta`, `etiquetaInversa`, `reciproco` y `Multiplicidad '?'|'*'|'+'`. Método F
fija: nombres idénticos entre OPD, OPL y bundle; referencias entre OPDs consistentes o rechazo;
«Omitir campos opcionales antes que inventarlos»; «No emitir `formato` distinto»; «Exportación =
instantánea». DR-41: conservar el núcleo con sus nombres y agregar los campos de §1.2 como
opcionales.

Propuesta conforme: conservar `formato` y la forma del v0 (mapas por id, `opds[].apariencias`,
`opds[].enlaces` como listas derivadas en el export); añadir los campos opcionales del canon;
dejar de emitir `portId`, `ports`, `symbolAnchors`, `labelPositions`, `x/y` de estado,
`subtipoModificador`, `puertoEntidadId` y las extensiones; importar todo lo anterior
descartándolo con un reporte de pérdidas (`documentMigration.collectUnrepresented` ya existe);
cargar con errores recuperables y rechazar solo referencias rotas (R-ESC-OP-4); export
determinista con claves ordenadas (R-§19-LENS-3). Hoy el v0 no es punto fijo: `modoPlegado`
se materializa, JSONB reordena claves y el patrón hidratar→exportar aparece en 7 o más sitios.
Corpus de regresión para el migrador: `serializacion/json.test.ts` y
`json-roundtrip-campos.test.ts` (877 líneas).

**Precisiones de contrato del crítico** (verificadas contra `modelo/tipos/*.ts` y contra el bundle
real `app/_local/bundles/simulacion-opm-laboratorio-complejo.json`):

- Raíz: `Modelo` tiene **14** extensiones, no 13: `ontologia`, `satisfaccionesRequisito`,
  `declaracionesNoNucleares`, `familiasEfectosPreestado`, `anclasNormativas`, `notasMesa`,
  `mesaExploracion`, `estereotipos`, `procedencia`, `fichaTrabajo`, `lentesConocimiento`,
  `submodelos`, `pieceLineage` y `referenciaPadreSubmodelo` (`tipos/modelo.ts:80-119`). También
  lleva `descripcion?` a nivel de modelo (el canon la pone en la entidad) y **metadatos de
  persistencia dentro del payload** (`archivado`, `archivadoEn`, `versiones[]`,
  `crearVersionAlGuardar`), que el migrador debe sacar del documento. `modelo.id` no sirve como
  identidad: `crearModelo` lo fija a `"modelo-1"` (`creacion.ts:20`) y solo algunas rutas lo
  cambian por un UUID (`store/runtime.ts:1592`); la identidad real es el id del registro en el
  servidor.
- Ids: secuenciales y con prefijo de tipo (`o-`, `p-`, `s-`, `e-`, `a-`, `ae-`, `opd-`, `efe-`),
  generados con `nextSeq`. Son opacos y estables en la práctica (T-022); se conservan tal cual.
- `Entidad`: el núcleo real incluye **`esAtributo?`** (está en el bundle del método F, CANON §7, y
  en el JSON real). `valorSlot` es un **objeto** `{tipo: "integer"|"float"|"char"|"string",
  placeholder: "value", valor?}` y no un `string`. El resto son extensiones: `alias`, `unidad`,
  `simulacion`, `estereotipoId`, `anclaje`, `requisito`, `urls`, `imagen`, `layoutEstados`,
  `lineal`, `orderedFundamentalTypes`. El legado `refinamiento` singular se migra ya a
  `refinamientos`.
- `Estado`: `designaciones` usa `"inicial"|"final"|"default"|"current"` (el canon escribe
  `porDefecto`) y convive con `esInicial`/`esFinal`, que el código mantiene redundantes
  (`estadosDesignaciones.ts:99-111`). `duracion` es `{unidad, min, nominal, max}`, todos
  obligatorios, con el enum propio `ms|s|min|h|dia|sem|mes|año`. Los nombres son únicos por objeto
  sin distinguir mayúsculas (`validarEstados.ts:86-90`).
- `Enlace`: `etiqueta` es **obligatorio** (`string`, vacío si no hay). `multiplicidad*` es texto
  libre validado por regex (admite `N`, `0..N`, `2..*`). El control se codifica en dos campos:
  `modificador: "condicion"|"evento"|"no"` y `subtipoModificador: "C"|"E"|"no"`; el mapeo al canon
  es `condicion→c`, `evento→e`, y `no` es negación (se retira con pérdida). Las cotas de excepción
  están en el **enlace** (`tiempoMaximo`, `unidadTiempoMaximo`, `tiempoMinimo`,
  `unidadTiempoMinimo`, como texto): el migrador debe moverlas a `duracion.max`/`duracion.min`
  del proceso fuente (T-021, T-047). `efectoEscindido` es
  `{grupoId, enlacePadreId, rol, modo?: "par"|"standalone"}` y se mapea a `escision {parId, mitad}`
  buscando la otra mitad del mismo `grupoId`. Además existen `grupoEstructuralId`, `requisitos`,
  `mostrarRequisitos`, `tasa` y `unidadesTasa` (se retiran) y `derivado` (se descarta al derivar
  la vista, pero ojo con §3.9-14).
- `Abanico`: `opdId`, `puertoComun {entidadId, lado, portId}` y `puertoEntidadId` son
  **obligatorios** en el tipo y aparecen en el bundle real; `decision?` es la política de
  probabilidad o función, que se retira. Hoy el abanico **pertenece a un OPD** y solo se verbaliza
  en él (`generar.ts:131`); al quitar `opdId` hay que derivar su visibilidad.
- `Apariencia`: `contextoRefinamiento.rol` vale `"contorno"|"interno"|"externo"` (el canon dice
  `contenedor`), con `enlacesPadreIds?` y `origen?: "adopcion"` (Bocetos). Extensiones:
  `modoTamano`, `modoPlegado`, `ordenPartes`, `parteExtraidaDe`, `ports`.
- `Opd`: `vista?` es `requirement-view | submodel-view | ad hoc` (se retira); `preguntaGuia?`
  (tutor, se retira); `ordenLocal?` (se retira por DR-4, aunque el método F lo nombra: se lee y se
  descarta); `ordenInzoom?` pasa a `refinamientos.descomposicion.orden`.
- Invariante del import que no está en el canon: `validarEstados.ts:85` rechaza **todo el
  documento** si un objeto tiene un solo estado (se retira, P3).

### 5.2 Otros formatos vigentes (todos RETIRAR)

`deep-opm-pro.paquete.v0`, `deep-opm-pro.log-decisiones.v0`, `deep-opm-pro.mesa-exploracion.v1`,
`opforja.piece.v1`, `opforja.portable-package` v1, `opforja.local-recovery.v1`,
`opforja.local-history.v1`, `opforja.mesa-base.v1`, `WorkspaceIndice` y el payload de bugs.
Se rescatan como utilidades `canonicalJson`, `constantTimeEqual` y `assertExactKeys`.

### 5.3 API HTTP

Hoy (`server/`, `app/scripts/model-persistence-api.ts`): `/healthz`; `/__deep-opm/auth/login|logout`;
`/__deep-opm/session`; `/__deep-opm/modelos` (GET con `?includePayload=1`, POST legado con CAS,
DELETE), `/modelos/:id/revisiones` (commit atómico, `409 Modelo desactualizado` en
`modelPersistence.ts:357`), `/versiones`, `/autosave` (`revisionBase`); `/__deep-opm/workspace`
(CAS); `/__deep-opm/agent/*` (status, tasks, events SSE, instructions, continue, stop, presence,
grants, changes prepare/commit/undo/reapply/receipt, pieces, refinements);
`/__deep-opm/review/*` (grants, token, annotations, resolve, público antes de sesión);
`POST|GET /__deep-opm/bug-reports`. Enrutador: 401 sin sesión; Bearer de agente solo GET y
revisiones; header `x-opforja-session-identity`; errores clasificados por prefijo de mensaje.
Límites: body 15 MB (`modelPersistence.ts:183`), nginx 25 MB; 30 versiones con poda logarítmica.

Mínimo propuesto (mismo prefijo, para no romper nginx): `/healthz`; `auth/login|logout`;
`session`; `modelos` (GET resúmenes, GET/POST/PUT con `revisionBase` y 409/DELETE por id);
`modelos/:id/autosave`; versiones solo si el dueño las mantiene.

### 5.4 Esquema de base de datos

Hoy (migraciones 1 a 7): `tenants`, `users`, `accounts`, `account_tenants` (rol `owner`),
`models` (payload JSONB, `revision`, columnas espejo), `model_versions`, `model_autosaves`
(uno por `(tenant_id, modelo_id)`), `workspaces` (índice JSONB, `revision`), `agent_tasks`,
`agent_changes`, `agent_events`, `agent_results` (muerta), `agent_variants`, `review_shares`,
`review_annotations`, `review_resolutions`, `schema_migrations`; todas con prefijo real `opforja_` (`app/scripts/model-persistence-api.ts:70-351`, `server/agent/postgresRepository.ts:23-76`, `server/review/postgresRepository.ts:27-56`). Timestamps como TEXT; aislamiento
`WHERE tenant_id`; SQL parametrizado. Mínimo: `accounts` (+ tenant), `models`,
`model_autosaves` y, si se decide, `model_versions`. La migración de datos pasa cada payload por
el importador v0 con reporte.

### 5.5 Exportación

`canon-diagrama`: SVG por OPD (o ZIP) sin handles, grid, overlays, chrome ni marcas de validación,
rótulos en negro y viewport ajustado. `canon-documento` (T-281 ★): **por OPD, en preorden, su
diagrama y su párrafo OPL**; el Markdown de OPL solo es una parte (T-282). Gates: >25 cosas, <2 hijos,
errores estructurales. Intercambio: JSON v0 (§5.1); no hay ni debe haber import OPCloud.

Estado real (crítico): `PERFILES_EXPORT = ["canon-diagrama", "canon-documento", "intercambio"]`
(`perfilesExport.ts:9`). `emitirDocumentoCanonico` produce Markdown con portada, métricas, árbol,
OPL y declaraciones no nucleares, **sin diagramas**, y solo se copia al portapapeles
(`store/modelo/acciones-canvas.ts:397-413`). El export Markdown usa viñetas `- ` y encabezados
`## SD`, y el OPL sale en el modo de display (`siempre`), no en el canónico. Los gates aplicados son
densidad y Bocetos; no hay gate de <2 hijos ni de errores estructurales, y el PNG/ZIP de
diagramas no tiene gates (D2).

### 5.6 Contratos internos que conviene portar

`Resultado<T,E> = {ok:true,value} | {ok:false,error}` (`modelo/tipos/comunes.ts:14-16`);
`OplReferencia`/`OplToken`/`OplLineaInteractiva` (`opl/interaccion.ts:3-35`, casi igual a
`RefOpl`/`TokenOpl`/`LineaOpl` de CANON §4.11, falta `hechoId` y el tipo `opd`);
`EstadoLineaOpl` y `RazonNoAplicable` (`opl/clasificadorEdicion.ts`); códigos `syntax-error`,
`unknown-symbol`, `ambiguous-symbol`, `type-mismatch`, `unsupported-kernel` (sinónimo de
`unsupported-canonical`, DR-34), `no-delete-by-absence`, `patch-conflict` (`opl/parser/tipos.ts:6-13`).
Hay que **añadir** `non-canonical` (T-157), que hoy no existe y cae en `syntax-error`, y ajustar la
severidad: `unsupported-kernel` sale como `error` en la negación (`parsear.ts:576`) y el
clasificador lo traduce a `inversa-no-soportada`, cuando el canon lo pide `warning` sin mutación.
También `SemanticOperation`, `ModelDiff` y `SemanticInverse` de `modelo/changes/types.ts` (base de
`aplicar(op)` y del undo por diferencias) y el predicado `estadoVisibleEnAparicion`; la partición campo a
campo semántica/presentación (`modelo/submodelos/firmaSemantica.ts:45-157`), exhaustiva por
tipo, como frontera modelo/vista (revisar `rutaEtiqueta`, que es semántica); los
`Record<Union,true>` de `completitud.test.ts`.

---

## 6. Diagnóstico de arquitectura

### 6.1 Tamaño por capa y objetivo

Suma aproximada; los dossiers se solapan en el agente. El objetivo es una estimación de orden
de magnitud para un producto que implemente CANON.md completo.

| Capa | Hoy (líneas fuente) | Lo que exige el canon | Objetivo estimado |
|---|---:|---|---:|
| `modelo/` tipos, operaciones y refinamiento | ~13.400 | tipos §1.2, matriz §2, refinamiento §3, derivaciones | 4.000-5.000 |
| `modelo/` análisis y diagnóstico | ~8.200 | registro DR-40 con unas 40 reglas | 1.500-2.000 |
| `modelo/simulacion` + UI | ~3.300 + ~1.900 | nada | 0 |
| `opl/` | ~6.900 | tabla de plantillas, generador, parser, editor | 3.000-4.000 |
| `serializacion/` + `persistencia/` | ~7.300 | import/export v0 y cliente HTTP | 1.000-1.500 |
| `store/` | ~14.400 | documento, selección, undo | 1.500-2.000 |
| `render/` + `canvas/` | ~13.300 | escena, SVG, interacción | 4.000-6.000 |
| `app/ports` + `viewmodels` | ~9.100 | — | 0-500 |
| `ui/` | ~21.700 + ~14.100 | shell, lienzo, OPL, árbol, inspector, diálogos | 6.000-8.000 |
| `autoria`, `tutor`, `mesa`, `agent`, `canon` | ~13.300 | nada | 0 |
| `server/` (con agente, revisión y bugs) | ~7.700 + 1.100 del script inline | auth y modelos | 1.000-1.500 |
| **Total** | **~133.000** | | **~22.000-31.000** |

### 6.2 Complejidad accidental (con evidencia)

1. **Geometría derivable persistida**: puertos (`modelo/operaciones/ports.ts`, 505, dentro del
   kernel; 4-5 resincronizaciones por enlace, ~56 ms con 60 enlaces), `symbolAnchors`,
   `labelPositions`, x/y de estados; el render ya ignora los puertos persistidos (7fcdba).
2. **Hechos derivados guardados como hechos**: `Enlace.derivado` de `proyeccion.ts` (850) e
   `inheritedFanGuard.ts` (264), donde el canon pide derivar (§3.5).
3. **Tres codificaciones del cambio de estado** (par consumo+resultado, TS3 compacto, familias
   por preestado): raíz de UX-01.
4. **Una regla, varias implementaciones**: tres productores de diagnóstico; import que duplica
   al kernel (la regla ≥2 estados está en cinco sitios, K7); previews OPL propios
   (`MenuTipoEnlace.tsx:265-286`, `previewEstadosOpl`); dos rutas de creación de enlace
   (`crearEnlace` y `crearAutoInvocacion`, esta con otra política). Corrección del crítico:
   `validarMultiplicidad` ya se unificó en `96b398e` (bug 45dbc2 cerrado), y las constantes INZOOM
   ya tienen fuente única en `modelo/constantesInzoom.ts` (W3.1), con `canvas/constantesInzoom.ts`
   como reexportación y `descomposicion.ts:53` y `layoutSugerido.ts:69` como consumidores.
5. **Store monolítico**: ~557 claves; estado de módulo (14 tests fallan por orden,
   `persistencia/backend.ts:29-35`); 78 claves de diálogo; 7 copias de reconciliación; checkpoint
   IndexedDB en cada commit; `useOpmStore` en 604 sitios; re-render de la raíz en cada hover.
6. **Indirección sin lógica**: 49 adaptadores `useZustand*Port`, 31 puertos alias, ~20 viewmodels
   de reenvío; retirar un tooltip tocó 7 capas (81ac46). Al revés, hay **dependencias invertidas**:
   el store importa operaciones de modelo alojadas en `canvas/` (`operacionesBatch.ts`,
   `seleccionMultiple.ts`, `layoutSugerido.ts` desde `store/modelo/acciones-canvas.ts`,
   `store/runtime.ts` y `store/seleccion.ts`), contra `modelo -> store -> app`.
7. **Adaptador JointJS**: `resetCells` en cada clic, 5 post-pasadas, hasta 5.040 permutaciones al
   ordenar estructurales, ~70-105 casts `as unknown`, 36 specs e2e acopladas a sus clases.
8. **Regímenes transversales**: `esApunte` (≥7 derivaciones con 2 semánticas) y
   R-ENT-2-APUNTE en todas las superficies; tres carriles de guardado, local-first y versiones.
9. **Build y tests atados a otra máquina**: `tutor:corpus` lee `/home/felix/kora-knowledge`
   (`app/scripts/generar-corpus-tutor.ts:59`); E2E sin contrato de «app lista».
10. **Gobernanza y fósiles dentro del producto**: 230 comentarios `BUG-…`, tests de prosa y CSS,
    5 copias de tokens, ~140 aliases de color, `modelo/constantes.bauhaus.ts`, mapa del sistema
    (1.552), `ToolbarMas` (352), `sociotecnico.ts` (235), `lifeline.ts`, `oracionParalelo`.
11. **Errores silenciados**: ~53 `catch` vacíos y acciones que fallan sin mensaje (esencia,
    afiliación, mover, vértices).

### 6.3 Partes portables casi tal cual

Además de lo marcado CONSERVAR en §3: `modelo/operaciones/helpers.ts:58-148`,
`operaciones/enlaces.ts:90-188,1040-1110`, `modificadores.ts:198-209`, `abanicos.ts:354-397`,
`integridadReferencial.ts`, léxico de `checkers.ts:42-71`; `opl/interaccion.ts`,
`clasificadorEdicion.ts`, `refinamiento.ts:246-298`, verificación por inversa de
`planificarOrdenInzoom`, `parser/text.ts`, `PatchRegistry`; `linkAssets.ts`, topologías de
`markers.ts`, `abanicoOverlay.ts`, `autoinvocacionLoop.ts`, `normalizarColoresSvg` y
`removerChrome` de `mapaExport.ts` y su camino SVG offscreen (`exportarOpdOffscreenSvgPng`);
`modelo/changes/{types,apply}.ts` (operaciones tipadas con precondiciones, diff e inversa);
`modelo/visibilidadEstados.ts` (predicado y operaciones puras, sin la guarda global);
`opl/bloquesJerarquicos.ts` (bloques por OPD con profundidad, cambiando BFS por preorden);
`traerEntidadAlOpd` y `ocultarAparienciaBatch` de `canvas/operacionesBatch.ts`, movidas al kernel;
`modelo/politicaApariciones.ts` (≤1 apariencia por cosa y OPD, DR-25); `ui/codex/oplTipografia.tsx`, `ui/codex/glifos.ts`,
`Dialogo.tsx`, `atajosTeclado.ts`, el renombrado encadenado; CAS con 409, poda logarítmica,
scrypt con señuelo y `deploy.sh`; las leyes de §3.8, `completitud.test.ts`, las fábricas de
`e2e/_smoke-helpers.ts` y los fixtures `docs/ejemplos/puente-vecinal.opl` y
`lumbre-reservas.opl` tras corregir su superficie.

### 6.4 Forma objetivo (esbozo, respetando `modelo -> store -> app`)

```
modelo/   tipos §1.2 · tabla única de firmas · aplicar(modelo, op): Resultado<Modelo>
          derivaciones puras: visibilidad por OPD, vista del padre, SDx.y, herencia · reglas DR-40
opl/      tabla de plantillas compartida · generar(modelo, opd) · parsear(texto) → patches
          · clasificar · aplicar todo-o-nada
escena/   escena(modelo, opd): geometría + marcas (pura) · svg(escena) = canon-diagrama
store/    documento {modelo, revision, pilaUndo} · selección discriminada · interacción
app/ui    shell de una fila · lienzo SVG · panel OPL · árbol · inspector · diálogos
server/   auth · modelos (CAS) · autosave
```

---

## 7. Dolores de UX y oportunidades

### 7.1 Observados en vivo (ux-en-vivo, 1440×900 y otros viewports)

1. **UX-01, crítico**: el editor OPL no es idempotente. Sin cambios propone «4 aplicables» y al
   aplicar crea un `efecto` compacto que duplica el par consumo+resultado, colgado del contorno
   en SD1 (rompe R-§19-SIM-3 y R-§19-LENS-3).
2. **Lienzo ~42 % del viewport** (830×640 px): panel del agente (~165 px, aun «no disponible»),
   acciones documentales, pregunta guía y barra de simulación (~280 px) se apilan encima; OPL
   fija en 240 px incluso a 1920 px.
3. **Toolbar desbordada** (UX-02/03): «Relación» tapada a 1440 px; toolbar de 0 px a 1024 px;
   indicador «Conectando: …» fuera de pantalla. **Cuatro señales de guardado** contradictorias.
4. **Vista frágil** (UX-05): zoom que salta a 160 %, cosas que nacen fuera de vista, lienzo en
   blanco tras el renombrado encadenado; `Ctrl+0` sin botón.
5. **Puertas metodológicas**: pregunta guía obligatoria; «Criterio / Fundamento» en casi todo
   panel; subproceso recién creado marcado «bloqueo».
6. **Descubribilidad**: paleta como única puerta (60 ítems con duplicados y comandos del equipo);
   menú contextual sin Renombrar, Eliminar, Agregar estado ni Conectar; inspectores de 17 y 12
   secciones con ids internos (`port-e-5-origen`).
7. **Estados**: renombre sin foco (UX-07); el menú «Relación» se cierra al elegir un estado
   (UX-06); la línea desde `fría` cruza el texto de `caliente`. Además: backticks literales,
   ayuda del editor incorrecta, «(1 oraciones)», glifos Mac en Linux, móvil de lectura que importa.

Conservar: teclado O/P/S/R, OPL inmediata con banda de cambios, tokens que seleccionan y filtran,
cápsulas con renombrado inline, in-zoom con renombrado encadenado y distribución correcta, tabla
de enlaces, diagnóstico con «Ir a…», undo transaccional.

### 7.2 Del histórico de bugs: regresiones en cadena

Estados en el canvas (x/y libre → layout → x/y con clamp; 10 reportes en 20 minutos); barra de
simulación (cuatro fixes, cada uno causa del siguiente; 1.171 líneas con 28 comentarios `BUG-…`
y 320 líneas de tests de CSS); dirección del efecto (4 reaperturas en un día); supresión del OPL
por placeholder (un fix revertido y un «régimen» nuevo en todas las superficies); flechas
canónicas sin especificación visual cerrada; ruteo con puertos persistidos que luego se ignoran;
viewport resuelto en piezas (7 reportes para una sola regla); `?` declarado resuelto dos veces y
aún rechazado. Patrón común: la regla OPM no tenía una fuente única y cada fix local tocaba capas
acopladas.

### 7.3 Oportunidades

- Lienzo + OPL ≥ 70 % del viewport; header de una fila con un solo estado de guardado; Objeto,
  Proceso, Estado y Enlace visibles a cualquier ancho ≥ 768 px; modo activo anunciado en el lienzo.
- Idempotencia bimodal verificada en navegador (generar → reparsear → 0 cambios, con in-zoom y
  estados) y una sola codificación por hecho.
- Un servicio de viewport (`encuadrar(opd)` al activar o poblar, `preservar()` en lo demás) y
  colocación alrededor del centro visible.
- Metodología como diagnóstico, nunca como campo obligatorio; vocabulario OPM en la interfaz.
- Pasos objetivo: proceso 2 (hoy 3), consumo 2 (hoy 3-5), dos estados 3 (hoy ~6), extremo a
  estado 1 (hoy 3-4), in-zoom 5 (hoy ~8), encuadrar 0 (hoy `Ctrl+0` oculto).

---

## 8. Riesgos de sobresimplificación

1. **Datos de producción**: modelos con `esApunte`, familias por preestado, anclas, notas, piezas
   o `Estado.duracion`. Mitigar con un migrador v0 que liste cada pérdida y `pg_dump` previo.
2. **Consumidores externos** (`hd-opm`, skill, CLI `mesa`, golden HODOM byte-idéntico): pactar el
   JSON v0 como único contrato antes de retirar `autoria/` y `mesa/`.
3. **Superficie OPL nueva** (D1 atómica, `es por defecto`, frases de multiplicidad, AND atómico):
   invalida textos y fixtures; deja sin atender el pedido 923dcf de AND compuesto.
4. **Vista del padre derivada**: la fuerza semántica y la matriz R-PREC son sutiles; hacen falta
   fixtures por celda antes de retirar las proyecciones persistidas.
5. **Reemplazar JointJS** sin golden SVG ni escenarios de interacción reabre las cadenas de
   regresión de estados, anclas y ruteo.
6. **Simulación y probabilidades**: el canon las excluye, pero el dueño las usó (~10 reportes).
7. **Undo, búsqueda y tabla de enlaces**: sin ellos, 36 OPDs y 262 entidades son inmanejables.
8. **Versiones y local-first**: retirarlos deja autosave y JSON como únicas redes de seguridad.
9. **Unicidad nominal estricta** frente a modelos con duplicados: resolver explícitamente, no
   rechazar en bloque.
10. **DR-11** mal aplicado puede hacer lento el in-zoom; el renombrado encadenado debe seguir
    siendo un solo gesto.
11. **Import tolerante** sin límites puede persistir grafos inválidos como canónicos; el export
    canónico debe bloquearse mientras existan errores estructurales.
12. **Capturador de bugs**: es el único canal de feedback real.
13. **CANON.md es derivado**, no la fuente, y tiene cuatro decisiones pendientes (DR-5, DR-10,
    DR-18, DR-23).
14. **Tests primero**: las leyes de §3.8 se portan antes que el código que protegen.
15. **Licencia**: sacar `opm-extracted/`, `assets/`, `fixtures/`, `config/` y `webroot/` del árbol no
    los borra del historial Git.
16. **DR-2 sin T-153** (crítico): hoy toda cosa se crea en el reverse gracias a la oración compuesta
    `es un objeto informacional y sistémico.`. Si se aplica «D1/D3 solo si difieren» sin que el
    parser cree cosas por tipografía, el roundtrip desde vacío (T-192) se rompe para toda cosa con
    valores por defecto. Deben cambiarse juntos, con la suite T-301 como gate.
17. **Retirar `canvas/operacionesBatch.ts` en bloque** (crítico): arrastraría `traerEntidadAlOpd`,
    `ocultarAparienciaBatch` y `eliminarBatch`, que realizan T-251, T-252 y T-248. Hay que moverlos
    al kernel antes de retirar el resto (alinear, distribuir, traer conectados, portapapeles).
18. **Retirar `DialogoCargarModelo` con Taller, Bibliotecas y Archivo** (crítico): es la única vía
    para abrir modelos; se simplifica, no se retira (U22).
19. **Migrar el TS3**: el par consumo desde estado más resultado a estado es la codificación que
    usan los modelos existentes (y la que llega al hijo como TS1/TS2). El migrador debe fusionar
    cada par del mismo (objeto, proceso) en un único `efecto` con `estadoEntradaId` y
    `estadoSalidaId` (DR-6), y el par escindido (`efectoEscindido`) en `escision`, sin tocar los
    ids que sobreviven (T-075).
20. **Cotas de excepción**: hoy viven en el enlace (`tiempoMaximo`/`tiempoMinimo` como texto con
    unidad propia). Si se retiran sin migrarlas a `duracion` del proceso fuente, los EX1/EX2
    existentes caen a la frase de respaldo.
21. **Visibilidad derivada** (§3.9-14): los modelos actuales guardan qué enlace y qué abanico se
    ve en cada OPD, y eso define el OPL por OPD. Derivarla puede hacer aparecer o desaparecer
    oraciones; comparar el OPL por OPD antes y después de migrar.

---

## 9. Preguntas abiertas para el dueño

Pendientes del propio canon (CANON §10.3):
1. Dirección y semántica de la especialización XOR (RX1/RX2, DR-10).
2. ¿Entra la descomposición de objeto en la primera versión, sin marca temporal (DR-23)?
3. ¿Dato explícito «humano» para agentes o basta el proxy «físico» (DR-5)?
4. Mapeo de unidades de tiempo a palabras es-CL en OPL, singular y plural (DR-18).

Alcance (casos límite de §3.9):
5. ¿Se conserva undo/redo aunque el canon no lo exija?
6. ¿Versiones manuales, solo autosave o solo JSON descargable?
7. ¿Pestañas múltiples y carpetas, o una lista simple de modelos?
8. ¿Se mantiene login y backend Postgres para la instancia pública, con un solo operador?
9. ¿Se confirma retirar la simulación y las probabilidades, pese a su uso previo (cc4801, 37ebd2)?
10. ¿Se conservan búsqueda de cosas y tabla de enlaces como infraestructura de navegación?
11. ¿Lector móvil y capturador de bugs quedan fuera del producto?

Datos y consumidores:
12. ¿Qué modelos productivos importan y cuáles usan extensiones (familias por preestado,
    anclas, Apunte, Bocetos, notas)? ¿Se aceptan las pérdidas del migrador?
13. ¿Siguen vivos `hd-opm`, la skill `modelamiento-opm` y el CLI `mesa`? ¿Basta el JSON v0 y la
    API de modelos como contrato?
14. ¿El bundle conserva la forma v0 (mapas por id, `opds[].apariencias`) o se adopta la forma de
    CANON §1.2 (arreglos, `apariciones` en la raíz) sin cambiar `formato`?

Técnica y gobierno:
15. ¿Se autoriza reemplazar JointJS por un render SVG propio?
16. ¿Dónde vive el canon en el repo (copia versionada de los 4 documentos, `CANON.md`) y quién
    mantiene el registro de conformidad (T-001)?
17. ¿Se retiran del repositorio (y del historial) `opm-extracted/` y los demás derivados de
    OPCloud?

Superficie y UX:
18. ¿Al pulsar S se crea un estado o dos? ¿El in-zoom siembra dos subprocesos con renombrado
    encadenado y se descarta el que se cancela?
19. ¿Se confirma la convención de nombres del canon (primera palabra capitalizada, sin `-ing`)?
20. ¿Se acepta abandonar la clasificación compuesta y el AND agrupado (forma OPCloud, pedido
    923dcf) que hoy aparecen en todo el OPL?

Añadidas por el crítico:
21. ¿La autoinvocación debe nacer sin demora (IV2 canónico)? Hoy nace con `1s` y la demora es una
    extensión que se retira (§0.4).
22. ¿Se conserva la selección múltiple mínima (seleccionar, mover, eliminar) aunque el canon no la
    exija? ¿Y copiar/pegar?
23. ¿El in-zoom siembra dos subprocesos (mínimo de AP-13) o ninguno, dejando que el modelador los
    cree? Hoy siembra tres con nombres semilla.
24. ¿`canon-documento` se entrega como archivo (Markdown con SVG embebidos, o HTML/PDF) en lugar del
    portapapeles? T-281 exige el diagrama de cada OPD junto a su OPL.

---

## 10. Correcciones del crítico

Crítico de completitud, 2026-09-30. Método: recorrido de `app/src` con `ls` y `grep` para detectar
módulos no mencionados; contraste de cada afirmación CUMPLE o PARCIAL de §4 con el código; lectura
de los tipos y del bundle real `app/_local/bundles/simulacion-opm-laboratorio-complejo.json`;
10 sondas ejecutables que llaman al kernel real sin tocar el repositorio
(`understand/probe_critico.test.ts` a `probe_critico10.test.ts`; se ejecutan desde `app/` con
`bun test <ruta>`). Todas las correcciones siguientes ya están aplicadas en su sección; esta lista
es el registro.

### 10.1 Correcciones aplicadas en su lugar

| # | Sección | Antes | Ahora | Evidencia |
|---|---|---|---|---|
| C-01 | Cabecera | Base `8ada528` | La rama tiene encima `96b398e` (multiplicidad unificada) | `git log` |
| C-02 | K3, §4.4, §4.11 | Unicidad de rol por par CUMPLE | PARCIAL: solo impide el duplicado exacto y la mezcla con habilitador; dos transformadores sobre el mismo par pasan, también por OPL (TS1+TS2 del mismo par crea consumo y resultado) | `enlaces.ts:1053-1105`; sondas 7 y 10 |
| C-03 | K4, §4.4 | Control `e`/`c` CUMPLE, AP-08 incluido | AP-08 roto: la guarda mira `modo === "par"` y `splitEffectEnPar` no fija `modo`; el evento sobre la mitad emite una oración que no es plantilla | `modificadores.ts:205`, `eliminacion.ts:251,259`; sonda 8 |
| C-04 | K6, §6.2-4 | Validador de multiplicidad duplicado (bug vivo) | Unificado en `96b398e`; siguen los rangos y `N`, y no hay guarda de tipo ni de extremo | `enlaceMultiplicidad.ts:3-10` |
| C-05 | K7 | ≥2 estados en kernel e import | También en el parser (`syntax-error`); cinco sitios en total | `planificar.ts:341-349`; sonda 2 |
| C-06 | K8, §4.2 | Supresión CUMPLE | PARCIAL: la supresión local sobrebloquea con una guarda global; falta D6 (T-101 ★) | `visibilidadEstados.ts:114`; sondas 3 y 4 |
| C-07 | K15, §4.6, §4.11 | «Cumple bien: escisión TS3→TS4/TS5» | La escisión automática no existe. El TS3 compacto se copia como `afecta` sin estados en cada subproceso; el par consumo+resultado llega al hijo como TS1/TS2. `efectoEscindido` solo nace del comando manual | sondas 6 y 7; `eliminacion.ts:204` |
| C-08 | §4.6, §4.11 | Copias derivadas solo para agente, instrumento y efecto | También consumo y resultado se copian con id nuevo; el original sigue en el refinado (T-075 ★ CONTRADICE); la excepción entrante va al primero | sonda 4; `proyeccion.ts:703-735` |
| C-09 | §3.9-9, K15 | «El in-zoom siembra dos subprocesos» | Hoy siembra tres («`P` 1..3»); el despliegue siembra tres partes; S crea `estado1`/`estado2` | `constantesInzoom.ts`; sonda 4 |
| C-10 | K23, §4.6 | SDx.y extraído del nombre con regex | Además se escribe en `Opd.nombre` al crear; hay reorden manual y `moverNodo` | `refinamiento/helpers.ts:299-310`, `opdReorden.ts:130` |
| C-11 | K24 | Colisión explícita CONSERVAR | La ontología en modo `enforce` y el separador de `[u]` reescriben el nombre en silencio (T-025) | `ontologia.ts:31-34`, `entidad.ts:79-81` |
| C-12 | K26, §6.2-6 | «kernel + menús» | Las operaciones reales están en `canvas/operacionesBatch.ts` (`traerEntidadAlOpd`, `ocultarAparienciaBatch`) y el store depende de `canvas/` | `operacionesBatch.ts:263,303`; `grep` de imports en `store/` |
| C-13 | K29, §5.1 | `valorSlot` se conserva | Es un objeto con `tipo` computacional; reemplaza la clasificación del atributo; `esAtributo` es núcleo del bundle | `tipos/entidad.ts:64-68`, `estructural.ts:36-37,51-56`, CANON §7 |
| C-14 | §3.1 | — | Filas nuevas K31 (T-079 FALTA), K32 (plegado), K33 (grupos y orden estructural), K34 (metadatos de presentación) | sonda 5; `modelo/plegado.ts` |
| C-15 | §3.2 | D2 gates CONSERVAR como si existieran | D2 PARCIAL: solo densidad y Bocetos; el PNG/ZIP no tiene gates. D5 pasa a REHACER (4 filas). Filas nuevas D7 (badges en el lienzo, T-228) y D8 (reglas inventadas) | `perfilesExport.ts:20-49`, `mapaExport.ts:48-84`, `JointCanvas.tsx:265` |
| C-16 | O2, §4.8 | Parser por simplificar | No crea cosas salvo por clasificación (T-153, T-165); `se descompone en` crea un hijo vacío (DR-35); no existe `non-canonical` (T-157); el roundtrip desde vacío depende de la oración compuesta | `planificar.ts:150-158,291-311`, `parser/tipos.ts:6-13`; sonda 2 |
| C-17 | O4 | — | T-241, T-246 y T-247 ya cumplen (`bloquesJerarquicos.ts`, `PanelOpl.tsx:105`) | lectura |
| C-18 | O6 | Tres modos CONSERVAR | El canónico (export y roundtrip) usa el display `siempre` (T-139 CONTRADICE) | `estructural.ts:39`; sonda 4 (export MD) |
| C-19 | O7, §4.6 | «Unificar DFS/BFS» | Canónico = preorden DFS con hermanos por creación; el BFS del panel CONTRADICE T-100 y ambos desempatan por nombre | `bloquesJerarquicos.ts:67-82`, `exportarMarkdown.ts:50-80` |
| C-20 | O9, R7, §4.3, §4.8 | IV1/IV2 coinciden con el canon | IV2 sale `después de 1s` por la demora por defecto; se añade «se lista con … como rasgos» y los verbos en plural | `autoinvocacion.ts:9`; sonda 1 |
| C-21 | §3.4 | R13 «PNG del canvas vivo»; R15 retirar sin matiz | Existe SVG offscreen reutilizable; R15 no debe arrastrar `traerEntidadAlOpd`; filas nuevas R16 (selección múltiple) y R17 (rutado OPCloud) | `mapaExport.ts:165,240,360` |
| C-22 | §3.5 | — | U10 añade `DialogoBuscarGlobal` (retirar); filas nuevas U22 (abrir y guardar: simplificar, no retirar), U23 (menús contextuales), U24 (halo de estado), U25 (árbol: retirar reorden y `moverNodo`), U26 (hoja de atajos, duración de estado, mover puerto) | `DialogoCargarModelo.tsx:21-26`, `HaloEstado.tsx:9-17` |
| C-23 | §3.6 | — | P4b (repositorio en memoria para dev y E2E); P12 identifica `modelo/changes/` como realización portable de «operación tipada con inversa» | `repoMemoria.ts`, `vite.config.ts`, `modelo/changes/apply.ts:37-151` |
| C-24 | §3.8 | `manual-opm-puro.md` CONSERVAR sin matiz | Diverge del canon (D11/D12, CX4, RX, `varía de`, `es de tipo`); `docs/canon-opm/` debe alojar el canon | `manual-opm-puro.md:1695-1790` |
| C-25 | §3.9 | 11 casos límite | Se añaden 12 (selección múltiple), 13 (repositorio en memoria) y 14 (visibilidad persistida de enlaces y abanicos) | `generar.ts:130-175` |
| C-26 | §4.3 | Etiquetado e invocación CUMPLE | PARCIAL: la relación unaria se rechaza («Sprint 0») y la autoinvocación nace con demora | `enlaces.ts:104`, `opcionesEnlace.ts:71`; sonda 1 |
| C-27 | §4.4 | — | Fila nueva AP-06/T-060 ★ CONTRADICE: consumo al contorno aceptado en el hijo | sonda 9 |
| C-28 | §4.6 | R-HIJO PARCIAL (solo rebote) | Se detalla qué cumple (cascada, alcance persistido) y qué falta (T-079 ★, T-081); CX3 sin `SDx`; refinamiento emitido en padre e hijo | sondas 4 y 5 |
| C-29 | §4.8 | 17 divergencias | Nueve filas más (D6, IV2, CX1, CX3, valor de atributo, ETS en mitad escindida, T-139, plurales, parser con `a` personal). UX-01 se reproduce con un solo TS3 en SD. Se matiza la lista «coinciden con el canon» (IV2 y CX1 salen; la coincidencia es de generación) | sondas 6 y 7 |
| C-30 | §4.9 | Canal UI CUMPLE «(verificar badges)»; export PARCIAL | Badges verificados: CONTRADICE T-228. `canon-documento` sin diagramas y solo al portapapeles | `JointCanvas.tsx:265`, `perfilesExport.ts:135-200` |
| C-31 | §4.11 | Balance | Reescrito con C-02…C-30 | — |
| C-32 | §5.1 | Contrato aproximado | 14 extensiones; `etiqueta` obligatoria; `Abanico.opdId/puertoComun/puertoEntidadId` obligatorios; `valorSlot` objeto; `designaciones` con `default`; rol `contorno`; cotas de excepción en el enlace; mapeo `modificador→control`; metadatos de persistencia dentro del payload; `modelo.id` no fiable | `tipos/*.ts`; bundle real |
| C-33 | §5.4 | Nombres de tablas sin prefijo | Prefijo real `opforja_` | `model-persistence-api.ts:70-351` |
| C-34 | §5.5 | `canon-documento` = Markdown OPL | T-281 exige diagrama y OPL por OPD; estado real del código | `perfilesExport.ts`, `acciones-canvas.ts:397-413` |
| C-35 | §5.6 | Códigos del parser portables | Añadir `non-canonical`; corregir la severidad de `unsupported-kernel`; portar `modelo/changes` y el predicado de visibilidad | `parsear.ts:576`, `clasificadorEdicion.ts:187` |
| C-36 | §6.2-4 | «constantes INZOOM triplicadas» | Ya unificadas en `modelo/constantesInzoom.ts` (W3.1) | `descomposicion.ts:48-60`, `layoutSugerido.ts:63-69` |
| C-37 | §6.3 | Portables | Se añaden el SVG offscreen, `modelo/changes`, `visibilidadEstados`, `bloquesJerarquicos`, `traerEntidadAlOpd`/`ocultarAparienciaBatch` y `politicaApariciones` | lectura |
| C-38 | §8 | 15 riesgos | Se añaden 16 a 21 (DR-2 sin T-153, retirar `operacionesBatch` en bloque, retirar el diálogo de abrir, migración del par TS3, cotas de excepción, visibilidad derivada) | — |
| C-39 | §9 | 20 preguntas | Se añaden 21 a 24 (demora de IV2, selección múltiple, semilla del in-zoom, formato de `canon-documento`) | — |

### 10.2 Requisitos ★ (y algunos no ★) que la versión anterior no evaluaba

| Req. | Estado | Evidencia |
|---|---|---|
| T-001 ★ registro de conformidad | FALTA de hecho (4 filas frente a unos 205 DEBE) | `docs/roadmap/registro-conformidad-ssot.md` |
| T-025 ★ léxico sin normalización silenciosa | PARCIAL (ontología `enforce`, separación de `[u]`) | `ontologia.ts:31-34` |
| T-053 ★ un procedimental por par | PARCIAL | C-02 |
| T-060 ★ consumo/resultado/evento sistémico no en el contorno | CONTRADICE | sonda 9 |
| T-062 ★ sin placeholders | CONTRADICE (`Objeto`, `estado1`, «`P` 1..3», «`X` parte 1..3») | `creacion.ts:72-74`, sonda 4 |
| T-063 ★ cambio de tipo con revisión | N/A: no existe la operación; declararlo en el registro | `grep` sin resultados |
| T-074 ★ escisión al descomponer | FALTA | C-07 |
| T-075 ★ la migración conserva el id | CONTRADICE | C-08 |
| T-079 ★ no refinar un externo desde el hijo | FALTA | sonda 5 |
| T-080 ★ cascada de internos | CUMPLE | sonda 5 |
| T-081 rebote del externo | FALTA (queda dentro, con `rol: "externo"` persistido) | sonda 5 |
| T-100 ★ preorden estable | PARCIAL (BFS en el panel) | C-19 |
| T-101 ★ D6 con estados ocultos | FALTA | sonda 4 |
| T-116 ★ IV2 | CONTRADICE (demora) | sonda 1 |
| T-125 ★ CX1 en el hijo | PARCIAL (sin coma, también en el padre) | sonda 4 |
| T-126 ★ CX3 con `SDx en` | CONTRADICE | sonda 4 |
| T-139 esencia solo de display | CONTRADICE | C-18 |
| T-153 ★ crear por tipografía | FALTA | sonda 2 |
| T-155 ★ firma inválida ⇒ `enlace-invalido-firma` | PARCIAL (rechaza, pero como `unknown-symbol`) | sonda 10 |
| T-157 ★ `non-canonical` sin extensión silenciosa | FALTA (no hay código; `Pr=0.5` sin abanico crea un consumo en silencio) | sonda 10 |
| T-158 ★ cambio de tipo por OPL ⇒ pedir decisión | PARCIAL (bloquea como `unknown-symbol`) | sonda 10 |
| T-161 ★ COND-ALT | FALTA (`unknown-symbol`) | sonda 10 |
| T-162 ★ D1–D4 y combinada | CUMPLE | sondas 2 y 10 |
| T-164 ★ TS4/TS5 parseados standalone | CUMPLE | sonda 10 |
| T-165 TS3 sobre vacío crea objeto y estados | FALTA | sonda 2 |
| T-166 ★ `se descompone en` crea miembros | CONTRADICE (hijo vacío) | `planificar.ts:150-158` |
| T-170 ★ SE1 residual | FALTA (`syntax-error`) | sonda 10 |
| T-171 ★ reordenar líneas no muta | CUMPLE (caso simple) | sonda 3 |
| T-172 ★ `no-delete-by-absence` | CUMPLE | `planificar.ts:37-47` |
| T-175 botón `Aplicar N cambio(s)` | CUMPLE | `clasificadorEdicion.ts:136-139` |
| T-182 ★ creación idempotente por tripla | PARCIAL (sí en T1/T2; no con TS3, UX-01) | sondas 6 y 7 |
| T-192 ★ roundtrip estricto desde vacío | PARCIAL (T1/T2 y clasificación sí; TS3, IV2 y D6 no) | sondas 1, 6 y 7 |
| T-228 ★ lienzo limpio de validación | CONTRADICE | C-30 |
| T-241 ★, T-246, T-247 panel OPL | CUMPLE | C-17 |
| T-248 ★, T-251 ★ mover entre OPDs y quitar frente a eliminar | CUMPLE (en `canvas/`) | C-12 |
| T-262 advertir cosas sin apariencia | CUMPLE (`ENTIDAD_SIN_APARICIONES`) | `checkers.ts` |
| T-263 ★ proceso sin transformar | PARCIAL (sin herencia; como bloqueo y además duplicado como `error` en `proceso-sin-entrada-ni-salida`, `validaciones.ts:404`) | lectura |
| T-265 ★ 21–25 cosas | CUMPLE (`canon-diagrama-densidad`) | `validaciones.ts:80-96` |
| T-268 ★ manejador no ambiental ⇒ advertir | CONTRADICE (rechaza en la firma) | sonda 1 |
| T-281 ★, T-283 ★ perfiles y gates | PARCIAL | C-15, C-34 |
| T-284 cruces u oclusión al exportar | PARCIAL (`visual-solape-apariencias` en edición; nada al exportar, sin cruces) | `diagnosticoVisual.ts` |

### 10.3 Diagnósticos existentes y su destino

| Código actual | Destino | Motivo |
|---|---|---|
| `PROCESO_NOMBRE_FORMA_VERBAL`, `ESTADO_NOMBRE_CANONICO`, `OBJETO_NOMBRE_SINGULAR` | CONSERVAR (warning, metodológica) | R-NOM-* (T-266) |
| `INZOOM_CONTENIDO_INSUFICIENTE`, `UNFOLD_CONTENIDO_INSUFICIENTE`, `DESCOMPOSICION_SIN_SUBPROCESOS` | FUSIONAR en AP-13 (warning y gate de export) | T-077, T-283 |
| `PROCESO_NO_TRANSFORMA` + `proceso-sin-entrada-ni-salida` | FUSIONAR en R-PROC-2 (warning, contando la herencia) | T-263; hoy son bloqueo y error |
| `SD_SIN_PROCESO_PRINCIPAL` | CONSERVAR | T-090 |
| `DESCOMPOSICION_NO_PRESERVA_FRONTERA` | CONSERVAR como ley de test; corregir el falso positivo | DR-16 |
| `EFECTO_OBJETO_SIN_ESTADOS`, `PAR_TRANSFORMADOR_DUPLICADO`, `consumo-doble-mismo-objeto`, `instrumento-y-agente-simultaneos`, `estructural-sin-duplicar`, `agente-requiere-objeto-fisico`, `generalizacion-mismo-tipo`, `procedural-no-objeto-objeto`, `excepcion-temporal-proceso-proceso`, `estructural-no-acepta-extremo-estado` | CONSERVAR solo como errores recuperables de **import** (T-288); en edición se impiden | T-040, T-053 |
| `efecto-direccion-canonica` | NORMALIZAR al importar (una dirección canónica), no error | el canon admite objeto ↔ proceso |
| `INVOCACION_REDUNDANTE_CON_ORDEN`, `ORDEN_INZOOM_REFERENCIA_INVALIDA` | CONSERVAR (error recuperable) e impedir al crear | T-269, integridad |
| `ENTIDAD_SIN_APARICIONES` | CONSERVAR | T-262 |
| `canon-diagrama-densidad` | CONSERVAR | T-265 y gate |
| `visual-solape-apariencias` | CONSERVAR como aviso de oclusión al exportar | T-284 |
| `visual-subproceso-sin-transformado` | CONSERVAR (warning) | T-264 |
| `visual-transformador-contorno-no-distribuido` | CONSERVAR hasta que AP-06 se impida | T-060 |
| `visual-externo-dentro-contorno` | REEMPLAZAR por rebote más aviso | T-081 |
| `visual-apariencia-*`, `visual-enlace-modelo-inexistente`, `visual-enlace-extremo-logico-inexistente`, `visual-enlace-opd-inconsistente`, `visual-contexto-refinamiento-huerfano`, `visual-geometria-apariencia-invalida` | CONSERVAR como integridad referencial | T-022, R-ESC-OP-4 |
| `visual-puerto-*`, `visual-label-enlace-invalida`, `visual-simbolo-estructural-invalido`, `visual-vertices-enlace-invalidos`, `visual-parte-extraida-huerfana`, `visual-enlace-extremo-no-visible` | RETIRAR con la geometría persistida o la visibilidad derivada | R3, K20 |
| `subproceso-no-conecta-al-padre` | RETIRAR (sobrebloqueo) | §4.6 |
| `ambiental-dentro-contorno`, `PROCESO_SISTEMICO_DESCONECTADO`, `EFECTO_SIN_TRANSICION`, `INZOOM_NOMBRES_PLACEHOLDER_HIJOS` | RETIRAR (reglas inventadas o contrarias a DR-6 y DR-11) | T-003 |
| `RECURSO_LINEAL_MULTIPLES_CONSUMIDORES`, `PROBABILIDAD_FUERA_DE_ABANICO`, `imagen-estados-excluyentes`, `orden-estructural-huerfano` | RETIRAR con su extensión; `Pr` sin abanico pasa a `non-canonical` del parser | §0.4, C-23 |
| **Faltan**: AP-26, AP-27, LF-19, R-OPD-OP-6, mezcla de infinitivo y nominalización, afiliación heredada, excepción sin cota, traza de ajustes (DR-45) | AÑADIR | CANON §6.4 |

### 10.4 Clasificaciones revisadas por riesgo

- **RETIRAR que habría eliminado algo necesario**: R15 y el módulo `canvas/operacionesBatch.ts`
  (contienen «traer cosa existente» y «quitar de este OPD»); P8 y el gestor de modelos
  (`DialogoCargarModelo` es la única vía para abrir: U22); O8, familias por preestado (su retiro
  es seguro porque el abanico TS3 con entrada común se parsea aparte, `groups.ts:180`, pero hay que
  migrar los datos, §8-1); P12 y el agente (`modelo/changes/` no es del agente: es kernel y el
  store lo usa, `runtime.ts:25`); el repositorio en memoria (P4b).
- **CONSERVAR que en realidad es acreción**: `DialogoBuscarGlobal` (U10); halo de estado (U24);
  hoja de atajos (U26); reorden manual de OPDs y `moverNodo` dentro de U9/U25; el manual OPM
  puro como supuesta referencia normativa (§3.8); la supresión de estados como «cumple bien» (su
  guarda sobrebloquea); los códigos de diagnóstico de D8 dentro de «advertencias metodológicas»
  (D3).
- **Sin cambio tras verificar**: K2 (firma exhaustiva, `satisfies never`, `helpers.ts:58-148`),
  K22 (aciclicidad), K25 (integridad), el predicado de visibilidad, `clasificadorEdicion.ts`
  (4 estados, 8 razones, botón), `no-delete-by-absence`, AP-04, el agente físico, la cascada de
  internos y el alcance persistido.

### 10.5 Límites de esta crítica

Las sondas prueban el kernel y el OPL, no la interfaz: los hallazgos de interacción de §7 siguen
dependiendo de `ux-en-vivo.md`. No se verificaron T-167 (resolución de `SDx.y` en OPL), T-168
(línea abstraída del padre ⇒ `sin-cambio`), T-181 (tres fases de aplicación), T-184 (edición por
sub-span), T-194 (composición inversa) ni el rendimiento. Una suite verde no equivale a validación
humana del modelado, y tampoco lo hace esta crítica.
