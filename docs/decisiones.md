# Decisiones del dueño del producto y del orquestador (fijas para el diseño)

## Del dueño (textuales)
- «Rehaz OpForja con plena libertad creativa y de transformación, manteniendo siempre un respeto absoluto por los principios, la semántica y las reglas de OPM.» Objetivo: más usable, ágil, limpia, intuitiva, elegante, liviana, coherente. Eliminar sobreingeniería, lastre, burocracia y complejidad acumulada. Simplificar con criterio sin sobresimplificar.
- «más simple aún. acá está el canon actualizado. ni más ni menos»: el canon son EXACTAMENTE 4 documentos (reglas-opm-estrictas-es 1.5.0, spec-forja-opd-es 1.4.0, spec-forja-opl-es 1.4.1, metodologia-forja-opm-es 1.7.0). Autoridad local: canon/<slug>/content.md. Especificación derivada: docs/especificacion.md (248 requisitos T-NNN).
- Persistencia (respuesta explícita 2026-09-30): **«Servidor mínimo»** — el mismo cliente + un servicio pequeño con UNA cuenta y los modelos guardados como archivos JSON (`deep-opm-pro.modelo.v0`) en el servidor. Conserva el acceso desde cualquier navegador. Sin PostgreSQL. Migración única de los modelos actuales de PostgreSQL a archivos.

## Del orquestador (derivadas del alcance «ni más ni menos»)
- Alcance del producto = lo que CANON.md exige a la herramienta (+ infraestructura mínima: cuenta, abrir/guardar/listar/eliminar modelos, exportar). Lo que CANON.md §0.4 lista como «no entra» NO se implementa: simulación, bilingüismo, sub-modelos/composición, Bocetos/Apunte/Taller/Graduar/Biblioteca/versiones, estereotipos/requisitos, anclaje/drift/calcar, capa computacional, Pr/m-de-f, negación, demora, semi-plegado, vistas/Bring/mapa, estilado autoral, agente LLM integrado, tutor, mesa, revisión compartida, lector portátil, captura de bugs, modo móvil de solo lectura.
- Deshacer/rehacer: el canon no lo exige ni lo prohíbe; es afordancia básica de editor, no hecho OPM. Se conserva solo si su costo es trivial (snapshots inmutables).
- Formato: se lee y escribe `deep-opm-pro.modelo.v0` (mismo sobre y nombres de campo del núcleo actual, Records por id) para compatibilidad con los modelos existentes y con bundles externos (Apéndice F: «No emitir formato distinto»). Campos de extensiones retiradas se ignoran al importar y se reportan como no representados.
- Registro de conformidad (R-CONF-7): un único documento del repo que declara cada DEBE no implementado (brecha silenciosa prohibida).
- Canon vendorizado en el repo (los 4 documentos, tal cual) como autoridad local; se retiran puentes/resolutor URN.
- Idioma: UI, OPL y docs en español es-CL; el código de dominio usa el vocabulario del canon en español (como el formato v0 y los tipos de CANON.md §1.2), de forma consistente en todo el código.
- No desplegar (no autorizado). Mantener `./deploy/deploy.sh` como único circuito, adaptado al nuevo servicio.
- Decisiones pendientes del canon (CANON.md §10.3) con default conforme: RX1/RX2 diferidos (`unsupported-canonical`), descomposición de objeto diferida y declarada, agente solo desde objeto físico (proxy declarado por el método).

## Material histórico de preparación (conservado en Git)
`understand/SYNTHESIS.md` (1.212 líneas, en especial §3.9 casos límite, §7 dolores de UX en vivo y del histórico de bugs, §8 riesgos de sobresimplificación —21 ítems—, §10 correcciones del crítico con sondas ejecutables: estado real de cada ★), `understand/ux-en-vivo.md` y `understand/bugs-auditorias.md`. El diseño final DEBE resolver explícitamente cada riesgo de §8 y cada ítem de §10.2 marcado FALTA/CONTRADICE/PARCIAL.

## Respuestas a las preguntas abiertas (SYNTHESIS §9) — fijas
1. RX1/RX2 (DR-10): diferidos; el parser responde `unsupported-canonical`; declarado en el registro.
2. Descomposición de objeto (DR-23): diferida y declarada en el registro (no se ofrece en la UI; parser `unsupported-canonical`).
3. Agente (DR-5): proxy «objeto físico» del método; sin dato «humano» adicional.
4. Unidades (DR-18): mapeo es-CL fijo singular/plural (ms→milisegundo(s), sec→segundo(s), min→minuto(s), hour→hora(s), day→día(s), week→semana(s), month→mes(es), year→año(s)).
5. Deshacer/rehacer: SÍ, por instantáneas inmutables del modelo (barato); no es hecho OPM.
6. Versiones: sin versiones en la UI. El servidor conserva, por robustez, las últimas N copias previas de cada archivo (rotación simple en disco, sin UI, recuperables por el operador). JSON descargable siempre disponible.
7. Pestañas y carpetas: NO. Una lista simple de modelos (nuevo, abrir, renombrar, eliminar a papelera, importar, descargar).
8. Login: una cuenta (DECISIONS: servidor mínimo). Sin PostgreSQL.
9. Simulación y probabilidades: se RETIRAN (canon §0.4; «ni más ni menos»).
10. Búsqueda: SÍ, mínima («Buscar» por nombre de cosa u OPD → navegar/seleccionar; es canal UI previsto por R-OPD-UI-1). Tabla de enlaces: NO (inspector + OPL bastan).
11. Lector móvil y capturador de bugs: fuera. La app es usable en anchos estrechos sin modo aparte.
12. Modelos productivos con extensiones: se importan; el migrador lista cada pérdida (campo no representado) en un reporte visible; nada se pierde en silencio. La migración única desde PostgreSQL escribe además un reporte por modelo.
13. hd-opm / skill / CLI mesa: el contrato externo es el JSON v0 + la API HTTP de modelos. El servidor acepta además un token Bearer opcional (variable de entorno) equivalente a la cuenta, para que agentes externos lean/escriban modelos por la misma API. Se retira el CLI mesa y el protocolo de testigo.
14. Forma del bundle: v0 tal cual (mapas por id, `opds[].apariencias`, `opds[].enlaces` emitido como lista derivada), mismo `formato`.
15. JointJS: se reemplaza por render SVG propio (golden SVG como red de regresión).
16. Canon en el repo: `canon/` con los 4 documentos tal cual; registro de conformidad en `docs/conformidad.md` mantenido junto al código (sin test autorreferente de prosa).
17. `opm-extracted/`, `assets/`, `fixtures/` (salvo los bundles v0 de `fixtures/demo-models/*.json`, que pasan a fixtures de test), `config/`, `catalog/`, `webroot/`, `ui-forja/`, `setup.sh`: se retiran del árbol (el historial Git queda).
18. Estados: crear un estado pide su nombre (uno por gesto; sin placeholders, DR-11). In-zoom: crea el OPD hijo con el contenedor y SIN subprocesos semilla; el modelador los crea con nombre; AP-13 advierte hasta ≥2.
19. Convención de nombres: la léxica EBNF se valida al nombrar (error visible, sin normalización silenciosa); R-NOM-* son advertencias metodológicas.
20. Se abandonan la clasificación compuesta y el AND agrupado en la emisión (reglas 9.2 manda D1/D3 atómicas); el parser sigue aceptando la combinada R-ENT-3.
21. IV2 nace sin demora.
22. Selección múltiple mínima: SÍ (shift-clic; mover, eliminar/quitar, y seleccionar ≥2 enlaces para formar abanico). Sin portapapeles.
23. = 18.
24. `canon-documento` = archivo HTML autocontenido (árbol OPD + por cada OPD su SVG canónico y su OPL). Además export OPL Markdown, SVG por OPD y JSON v0.

## Decisiones de revisión del dueño (2026-10-02) — fijas
25. **D1 y D4 concuerdan en género** (`**Bodeguero** es físico.`, `**Caja** es física.`), con el género de la cosa (masculino por defecto). El parser acepta ambas formas. DESIGN lo recoge como DS-26.
26. **La simulación se retira** (confirmado tras revisar su uso histórico). Queda declarada en el registro de conformidad (modo runtime vacío, B-21; T-323 en B-25).
27. **Contrato para agentes externos: JSON v0 + API HTTP del servidor mínimo con token Bearer** (DESIGN §8). Se retiran el CLI `mesa` y su protocolo de testigo. Tarea externa a este repositorio: actualizar las referencias de la skill `modelamiento-opm` en KORA cuando el servidor nuevo esté desplegado.
28. **La implementación se hace en una sesión nueva**, a partir del plan empaquetado en `plan/` (`plan/README.md`, `plan/PROMPT.md`, `plan/plan.json`). Esta sesión no implementa.

## Decisiones del dueño tras la evaluación externa del corte `e53fb47` (2026-10-06) — fijas
Dictamen histórico: `89aaa3a5:docs/rehacer/evaluacion/dictamen-e53fb47.md`, conservado en Git. Estas decisiones mandan sobre DESIGN, que debe alinearse con ellas.

29. **Abanicos como en la versión anterior de opforja** («inspirémonos en la versión antigua de opforja. ahí se dibujaba bien»). Respuesta a D1 y D2 del dictamen.
    - Un abanico existe solo si todas sus ramas comparten el mismo extremo en el borde de la cosa común, objeto o proceso (`pre-rehacer:app/src/modelo/abanicos.ts`, `puertosExactosDeEnlace`). Un extremo común en un estado, o en estados distintos del mismo objeto, no forma abanico: los enlaces quedan sueltos. El estado en el extremo no común de cada rama se conserva (R-FAN-EST-1 es PUEDE).
    - Se retiran FANLOCAL y su texto OPL local (B-31), la adaptación de radio (B-33), la búsqueda de empaquetado de estados y la propuesta de vértices. El import carga esos abanicos como enlaces sueltos con informe, como B-06. Se registra una brecha «no implementado (PUEDE)».
    - El dibujo es el de la versión anterior (`pre-rehacer:app/src/render/jointjs/abanicoOverlay.ts`). El acople es el recorte del borde de la cosa común hacia el centroide de los otros extremos. El arco va centrado en el acople, con radio 30 (XOR) o 30 y 35 (OR) y el sector mínimo de las ramas. `escena()` y los exports nunca lanzan con un modelo válido: si algo queda tapado, avisan (B-15).
30. **Protocolo ligero.**
    - El `HANDOFF.md` actual se mueve íntegro a `docs/rehacer/bitacora.md`, y `HANDOFF.md` queda como tablero de una página: paquetes, decisiones abiertas y siguiente paso.
    - Cada fila de `docs/conformidad.md` vuelve al formato de DESIGN §11.3, en tres líneas como máximo; la evidencia va a la bitácora.
    - Hay una revisión por ola, contra el canon y con modelos reales.
    - Solo se detiene el trabajo en los hitos o ante una contradicción contractual verdadera.
    - Una autorización vale solo si es una frase textual del dueño, citada. No valen las delegadas ni las interpretadas.
31. **Precedencia al abstraer según ISO 19450 (Tabla 27, §14.2.4.1.1).** Depende del orden temporal de los subprocesos y DESIGN §4.6, paso 4, la recoge:
    - consumo → resultado da efecto, igual que resultado → consumo;
    - consumo → efecto y efecto → resultado son inválidos.
32. **Un enlace interno a un refinamiento no se ve en el padre** («cámbialo por supuesto»). Si los dos extremos de un enlace quedan dentro de la misma cosa refinada, el enlace es interno y desaparece en el OPD abstracto, aunque su tipo admita reflexivo. Corrige DESIGN §4.6, paso 2: las invocaciones entre subprocesos ya no se ven como «se invoca a sí mismo» (R-CAT-EQ-3, R-EJEC-9, R-INV-2D).

## Resoluciones directas posteriores — vigentes

Frases role=user recibidas textualmente; ID y fecha originales no observables.

> «Autorizo la propuesta V3 (SHA-256 1a9a0de9607950c56cbf5f26582649f37eab4fe9031d4c7545eeae934bb7f221): cambiarTipoEnlace recibe etiquetas?: DatosEtiquetas y las valida en la misma transacción, conservando identidad, validaciones y trazas. Aplícala en DESIGN y en el código, cierra WP-15 con check verde y publícalo. Rendimiento: no sigas optimizando el generador. Una sola medición en frío dentro de la suite mide la compilación JIT y el ruido del proceso, no el producto. Autorizo cambiar la metodología de rendimiento.test.ts: cada meta se mide como la mediana de 5 identidades frescas, después de un calentamiento con otra identidad, y nunca sobre una respuesta cacheada. Los límites (3× de DESIGN §2.4) no cambian. Deja la regla en una línea en DESIGN §2.4. Después sigue con WP-16 sin detenerte. La revisión de ola va al cerrar WP-16, como tenías previsto. No hace falta registrar recibos parciales ni archivos auxiliares de diagnóstico: la evidencia es el commit con check verde.»

> Autorizo añadir sentido?: 'directo' | 'inverso' a cambiarTipoEnlace, relativo a sus extremos actuales, tal como lo propones en HANDOFF.md. Omitido, conserva el comportamiento vigente. Indicado, construye y valida extremos, tipo y etiquetas en una sola transacción, con identidad, trazas y un solo deshacer. Es coherente con el sentido que ya trae OpcionTipo. Aplícalo en DESIGN §4.2 y en el código.
>
> Agrega una prueba que recorra todas las opciones legales de tiposLegales para enlaces existentes, en ambos sentidos y con y sin etiquetas, y compruebe que aplicar cada una con cambiarTipoEnlace deja un enlace igual a su candidato.
>
> El menú de agregación sobre las ramas del símbolo compuesto y los tres textos de conformidad son reparaciones ordinarias: corrígelos sin consultarme. Con check verde, publica WP-16 y sigue con WP-17 → WP-19 hasta H3 sin detenerte, salvo ante otra contradicción real del contrato.

La unión de los pasos 1+2 en un commit verde se autorizó con «unamos 1  o 2 en un solo commit».
«Un commit semántico por paso, siempre con check verde, y push a origin/rehacer.
Revisión una vez por ola, contra el canon y con modelos reales. Detente solo en H2,
en H3 o ante una contradicción real del contrato.» La reanudación tras H2 fue
«continúa sin parar a informarme mientras no tengas un problema significativo».
La historia íntegra permanece en Git hasta 89aaa3a5 bajo docs/rehacer/bitacora.md.
No se infiere autorización de Docker, producción, migración real o merge.

### 1.6 Decisiones de esta síntesis (DS-n)

Estas son las resoluciones que CANON.md no fija, o que ajustan una DR por una exigencia más fuerte
del canon. Todas van a `docs/decisiones.md` y, si tocan un DEBE, también a «Brechas».

| DS | Decisión | Origen · por qué |
|---|---|---|
| DS-1 | **Orden de oraciones por nombre** (colación `es`, sensibilidad base, luego id), salvo los subprocesos, que siguen sus bandas. | C1 = A P-2 = B DB-2. R-§19-SIM-3 exige un orden reproducible desde el texto; R-COMP-ELEG-3 solo pide determinismo. |
| DS-2 | **Mención mínima**: toda cosa visible en un OPD aparece en al menos una oración de su bloque; si ninguna la menciona, se emite D2 (`**X** es informacional.`). | C2 = A P-3. R-BI-DUAL-1: un rectángulo aislado debe viajar por OPL (T-190). Desvía DR-2/T-106 («D2 no se emite»): registrado como B-27 (CC-27). |
| DS-3 | **Distribución al pasar de 0 a ≥1 subprocesos en una operación.** Después, la reasignación es del modelador (T-076), con `reanclarExtremo` uniforme (DS-9). No se persiste `migracionAutomatica`. | C3. T-076 dice «luego la reasignación es del modelador». La entrada encadenada de nombres (§7.3-10) crea todos los subprocesos en una operación, así que primero y último se aciertan en el gesto típico. |
| DS-4 | **Un TS3 con control, o que es rama de un abanico, no se escinde**: migra entero al primer subproceso, con traza. | B §4.6.4. AP-08: las mitades no admiten control. R-FAN-5A: la escisión rompería el abanico. |
| DS-5 | **`eliminarCosas` rechaza una cosa con refinamientos** (`tiene-refinamiento` · «Elimina primero su refinamiento»). Solo se eliminan OPDs hoja, vía `eliminarRefinamiento`. | A §4.3. T-083 ★ / R-REF-3. |
| DS-6 | **Quitar de este OPD nunca elimina del modelo.** Una cosa puede quedar sin aparición y un enlace puede quedar sin vista. Se diagnostican `cosa-sin-aparicion` y `enlace-sin-vista` (warning, «Traer a este OPD»). | A, B. T-262 («advertir cosas sin apariencia») presupone que existen. T-251: quitar ≠ eliminar, sin atajos. |
| DS-7 | **El import nunca renombra ni normaliza nombres.** Duplicados y nombres fuera del léxico se cargan tal cual como `error` (`nombre-duplicado`, `nombre-fuera-de-lexico`) con una **reparación sugerida** de un clic. | A, jueces. Apéndice F pide nombres idénticos entre OPD, OPL y JSON; T-025 prohíbe normalizar en silencio; SYNTHESIS §8-9 pide resolver explícitamente. |
| DS-8 | **Especialización de estado implementada**: una generalización entre objetos con par de estados (ambos o ninguno). Plantilla `{Ly:Oe} son {O} en {s}.` (EBNF `oracion_de_especializacion_estado`; la lista admite un elemento). | B. T-121 pasa a `enforzado`. |
| DS-9 | **Reanclar extremos en todos los tipos** con una operación, `reanclarExtremo`, que conserva el id. Soltar el asa del objeto en una de sus cápsulas cambia T1 a TS1. | B DB-10. R-OPD-EDIT-7 lo exige para estructurales; uniformar es más simple, y es la corrección más frecuente tras un in-zoom. |
| DS-10 | **Ruta en ramas de abanico admitida**: con alguna ruta, el abanico se emite como una oración por enlace (R-COMB-5). El operador XOR/OR no viaja por OPL: es una bisimetría parcial declarada. | A, B. Reduce una brecha a una bisimetría declarada y no descarta datos del modelador. |
| DS-11 | **Edición OPL con alcance = OPD activo.** El panel muestra todo el modelo. | C6. |
| DS-12 | **El editor OPL libre no renombra.** Renombrar se hace sobre el token (R-OPL-EDIT-7) o en el lienzo. | C7 = A P-16. Elimina la identidad posicional (UX-01). |
| DS-13 | **Dos SE1 inversas del mismo bloque se leen como un SE3.** Si las etiquetas son iguales, recíproco. | C9 = A P-21. |
| DS-14 | **Unicidad nominal sin distinguir mayúsculas** (clave `claveNombre`, sensible a acentos). | C11. DR-22. |
| DS-15 | **Frases de multiplicidad literales**: `un opcional` / `una opcional`, `opcional (cero o más)`, `al menos un` / `al menos una`. | C12. R-MULT-1. |
| DS-16 | **Eliminar un refinamiento materializa en el padre la vista abstraída** de los enlaces con el exterior. | C14 = A P-8. DR-17. |
| DS-17 | **RF2b sin coma**: se genera `{O} exhibe {Ly:O} así como {Ly:P}.` (reglas manda en plantillas) y se aceptan ambas formas al parsear. | A. |
| DS-18 | **OPD no representable ⇒ se descarta el OPD, nunca los hechos.** Aplica a Boceto, vista, OPD suelto o descomposición de objeto que choca con un despliegue: sus cosas, estados y enlaces siguen en el modelo, y las cosas pueden quedar sin aparición. La **descomposición de objeto** sin despliegue previo se convierte en `despliegue` por agregación **sin crear enlaces**, conservando apariciones y posiciones. | A P-20 más la corrección de C4. No se inventan hechos y no se pierden datos del modelador. |
| DS-19 | **Negación v0 (`modificador: "no"`) ⇒ se descarta el enlace entero**, con informe. | A 4.7: conservarlo sin `no` invertiría el hecho. |
| DS-20 | **Cierre de operaciones**: una operación se rechaza si el modelo resultante tiene un error de contexto de la matriz que el de entrada no tenía. Hay una excepción: `moverSubproceso` (T-269, AP-27: lo que surge por reordenar queda como error recuperable). | Uniforma el revalidar de `fijarEsencia`, `cambiarTipoCosa`, `eliminarEstado` y `reanclarExtremo` en una sola regla. |
| DS-21 | **Fuente incrustada**: `canon-diagrama` y `canon-documento` llevan Inria Serif regular e itálica (subconjunto latino, woff2 en base64). Las métricas salen de una tabla generada en Chromium. | A, B. AP-23 y R-OPD-LAY-8 en cualquier visor. |
| DS-22 | **Cámara**: al cambiar de OPD siempre se encuadra el bbox real (zoom ≤ 1). Crear, renombrar o aplicar OPL nunca mueven la cámara, salvo el desplazamiento mínimo para mostrar lo creado fuera de vista. | T-231 (DEBE). Se corrige C §6.5. |
| DS-23 | **Un solo dibujo, dos adaptadores**: `opd/dibujo.ts` produce un árbol `NodoSvg`. El lienzo lo convierte a vnodes de Preact (identidad por `key`) y el export lo serializa a cadena. | Sin `preact-render-to-string` ni `innerHTML`; se prueba en Bun sin DOM. |
| DS-24 | **Unidad de tiempo por defecto `min`.** | R-EXC-5 exige un default; A P-15. |
| DS-25 | **Colocación en el núcleo** (`nucleo/colocacion.ts`), porque las operaciones y el OPL deben dejar apariciones con posición. | C §6.5. |
| DS-26 | **D1 y D4 concuerdan en género**: `**Bodeguero** es físico.` · `**Caja** es física.`, con el género de la cosa (masculino por defecto, femenino si `genero: 'f'`). El parser acepta ambas formas para cualquier cosa. | Decisión del dueño (DECISIONS 25, 2026-10-02). R-OPL-1 fija el género gramatical; las plantillas de reglas §4.4 usan «Cosa», femenino. |

---

## Contratos de implementación conservados

La numeración siguiente conserva las referencias del diseño anterior. DEC29–32
y las resoluciones directas posteriores prevalecen. No acredita lectura del
original ISO ni sustituye las cuatro primarias locales.

### 2.4 Rendimiento objetivo (modelo sintético de tamaño HODOM: 262 cosas, 192 estados, 433 enlaces, 36 OPDs)

| Operación | Objetivo | Medio |
|---|---|---|
| operación del núcleo, incluido el cierre DS-20 | < 3 ms | registros inmutables, `indice` memoizado por identidad de `Modelo` |
| `proyectar` de un OPD | < 3 ms | un recorrido de enlaces con el mapa `internoDe` |
| `escena` + `dibujar` de un OPD de ≤ 25 cosas | < 5 ms | escena pura; Preact difunde por `key` |
| `generarModelo` (36 bloques) | < 25 ms | memo por `(Modelo, opd)` |
| `diagnosticar` completo | < 30 ms | memo; en `requestIdleCallback` tras cada cambio |
| `importarV0` y `exportarV0` | < 150 ms y < 20 ms | una pasada por colección |
| `planificar` de 1 000 líneas | < 60 ms | ensayo sobre copia |

`src/rendimiento.test.ts` construye el modelo con `pruebas/azar.ts` (semilla fija, perfil
`hodom`); cada meta usa la mediana de cinco identidades frescas tras calentar con otra, nunca una respuesta cacheada, y falla si supera **3×** su objetivo.

---

### 4.2 API de operaciones (todas `Operacion<A>`, puras) — CONTRATO

```ts
export interface ExtremoRef { readonly cosa: Id; readonly estado?: Id }
export type EstadosEnlace =
  | { readonly estado: Id | null }                                      // consumo, resultado, agente, instrumento
  | { readonly entrada: Id | null; readonly salida: Id | null }         // efecto
  | { readonly generalizacion: { readonly general: Id; readonly especializacion: Id } | null }
  | { readonly origen: Id | null; readonly destino: Id | null };        // etiquetados

// modelo.ts
export function crearModelo(a: { readonly id: Id; readonly nombre: string }): Modelo;   // SD vacío 'opd-1', secuencia 2, 'min'
export const renombrarModelo:        Operacion<{ nombre: string }>;
export const fijarUnidadTiempo:      Operacion<{ unidad: UnidadTiempo }>;
export const fijarDescripcionModelo: Operacion<{ texto: string | null }>;

// cosas.ts
export const crearCosa: Operacion<{ opd: Id; tipo: TipoCosa; nombre: string; x: number; y: number;
                                    banda?: { indice: number; paralelo: boolean }; alcance?: 'interno' | 'externo' }>;
  // en un OPD de descomposición, `alcance` (o, si falta, el punto dentro/fuera del contenedor) decide:
  // interno ⇒ proceso = subproceso (en `banda` o banda nueva al final), objeto = objeto interno;
  // si la descomposición tenía 0 subprocesos, distribuye (§4.5.3). externo ⇒ aparición externa.
  // Hereda afiliación ambiental del contenedor (R-OBJ-6, traza). creados[0] = id nuevo.
export const renombrarCosa:    Operacion<{ cosa: Id; nombre: string }>;       // léxico + unicidad; nunca corrige
export const cambiarTipoCosa:  Operacion<{ cosa: Id }>;                        // T-063: rechaza con estados, refinamientos o enlaces inválidos
export const fijarEsencia:     Operacion<{ cosa: Id; esencia: Esencia }>;
export const fijarAfiliacion:  Operacion<{ cosa: Id; afiliacion: Afiliacion }>;
  // ambiental ⇒ propaga a sus rasgos por la cadena de exhibición, transitiva (rasgo de rasgo), con traza por
  // cosa (T-091, R-OPD-STR-13, CC-02)
export const fijarGenero:      Operacion<{ cosa: Id; genero: 'm' | 'f' }>;
export const fijarDescripcion: Operacion<{ cosa: Id; texto: string | null }>;
export const fijarValor:       Operacion<{ objeto: Id; valor: string | null }>;  // exige ser rasgo de ≥1 exhibición; léxico nombre_de_valor
export const fijarDuracion:    Operacion<{ proceso: Id; duracion: Duracion | null }>;   // F-10
export const fijarIncompleta:  Operacion<{ cosa: Id; relacion: RelacionIncompleta; activa: boolean }>;
export const traerCosa:        Operacion<{ cosa: Id; opd: Id; x: number; y: number }>;
  // 'ya-aparece'; 'es-interno' si es interno de otra descomposición (A3.3); en OPD de descomposición,
  // un punto dentro del contenedor rebota fuera (T-081, traza).
export const moverApariciones: Operacion<{ opd: Id; mover: readonly { cosa: Id; x: number; y: number }[] }>;
  // 1..n; el contenedor arrastra a sus internos; interno confinado (R-OPD-UI-3); externo dentro del
  // contenedor ⇒ rebote con traza (T-081); subproceso: solo x (P6).
export const redimensionar:    Operacion<{ opd: Id; cosa: Id; ancho: number; alto: number }>;
export const quitarDeOpd:      Operacion<{ opd: Id; cosas: readonly Id[] }>;
  // 'es-contenedor' (contenedor o refinable en su propio OPD hijo); 'es-interno' (internos: «elimínalo del modelo»);
  // la última aparición SÍ se quita (DS-6): traza «**X** ya no aparece en ningún OPD (sigue en el modelo)».
export const eliminarCosas:    Operacion<{ cosas: readonly Id[] }>;
  // 'tiene-refinamiento' si alguna tiene descomposición o despliegue (DS-5, T-083).
  // Cascada declarada: estados, enlaces incidentes (a la cosa o a sus estados), ramas de abanico (<2 ⇒ disuelve),
  // apariciones, miembros de bandas y objetosInternos (banda vacía ⇒ se retira). Sin re-migración.

// estados.ts
export const agregarEstado:  Operacion<{ objeto: Id; nombre: string; indice?: number }>;   // creados[0] = id
export const renombrarEstado: Operacion<{ estado: Id; nombre: string }>;
export const moverEstado:    Operacion<{ estado: Id; indice: number }>;
export const eliminarEstado: Operacion<{ estado: Id }>;
  // los enlaces anclados pierden el anclaje con traza (TS1→T1, TS3→TS4/TS5, especialización de estado ⇒ sin estados,
  // recíproco sin estado de origen ⇒ sin estados); porDefecto/current/ocultos se limpian;
  // el cierre DS-20 rechaza si deja un efecto T3 sin estados (R-EFE-1) — 'efecto-sin-estados'.
export const designar:       Operacion<{ estado: Id; designacion: Designacion; activa: boolean }>;
  // porDefecto y current reemplazan al anterior del objeto (traza)
export const suprimirEstado: Operacion<{ estado: Id; opd: Id | null; activa: boolean }>;
  // null = global; activa=true rechaza 'estado-enlazado' si un enlace anclado se ve donde se ocultaría (LF-03)

// matriz.ts (consulta; §4.3.4)
export interface DatosEtiquetas { readonly etiqueta?: string | null; readonly inversa?: string | null }
export function tiposLegales(m: Modelo, a: { readonly opd: Id; readonly desde: ExtremoRef; readonly hacia: ExtremoRef;
                                           readonly etiquetas?: DatosEtiquetas }): readonly OpcionTipo[];
// enlaces.ts
export const crearEnlace:       Operacion<{ opd: Id; candidato: EnlaceNuevo; abanicoCon?: { enlace: Id; operador: Operador } }>;
  // 'no-visible' (T-066/visibilidad), 'interno-no-visible', forma, 'no-ofrecido', 'ya-existe', contexto (DS-20);
  // proceso descompuesto con ≥1 subproceso ⇒ distribución §4.5.3 del enlace nuevo (recursiva) + aparición externa
  // del objeto en cada OPD de descomposición atravesado (R-HIJO-3); estado oculto donde se ve ⇒ se muestra (traza, LF-03).
  // abanicoCon: crea y forma/extiende el abanico en la misma transacción (R-FAN-5, DR-6). creados[0] = id.
  // exhibición desde un exhibidor ambiental (o con afiliación ambiental heredada por la cadena) ⇒ el rasgo y
  // sus propios rasgos pasan a ambientales, con traza (T-091 «al crear la exhibición», R-OBJ-6, CC-02).
  // valida etiquetas con normalizarEtiquetas antes de persistir: igualdad válida no vacía ⇒ recíproco,
  // traza R-STRE-1; el resultado efectivo cumple F-11. Los datos faltantes o inválidos no se insertan.
export const cambiarTipoEnlace: Operacion<{ enlace: Id; tipo: TipoEnlace; etiquetas?: DatosEtiquetas; sentido?: 'directo' | 'inverso' }>;   // conserva id; campos incompatibles previos se retiran con traza; rama de abanico ⇒ 'abanico'
  // Los datos explícitos se incorporan antes de normalizarEtiquetas, matriz y ensayo DS-20.
  // Datos inaplicables ⇒ rechazo atómico como fijarEtiqueta; {} equivale a datos ausentes.
  // Mismo tipo: conserva sus campos (incluida escision), salvo etiquetas explícitamente reemplazadas/eliminadas; sin datos mantiene comportamiento previo.
  // Sentido relativo a extremos actuales: omitido conserva comportamiento vigente; explícito construye y valida
  // ambos extremos, tipo y etiquetas por roles elegidos en una transacción, incluso con el mismo tipo.
  // Conserva identidad/secuencia, asociaciones compatibles por dueño/rol, validaciones/trazas y un deshacer;
  // normalización, forma, oferta y DS-20 se contrastan contra el original real. UI transmite OpcionTipo.sentido.
export const fijarEstados:      Operacion<{ enlace: Id; estados: EstadosEnlace }>;   // forma de `estados` debe calzar con el tipo
export const fijarControl:      Operacion<{ enlace: Id; control: Control | null }>;
export const fijarEtiqueta:     Operacion<{ enlace: Id; etiqueta: string | null; inversa?: string | null }>;
  // bidireccional con etiqueta === inversa ⇒ recíproco (traza R-STRE-1)
export const fijarRuta:         Operacion<{ enlace: Id; ruta: string | null }>;
export const fijarMultiplicidad: Operacion<{ enlace: Id; extremo: 'objeto' | 'refinador' | 'origen' | 'destino'; valor: Multiplicidad | null }>;
export const reanclarExtremo:   Operacion<{ opd: Id; enlace: Id; extremo: 'origen' | 'destino'; hacia: ExtremoRef }>;
  // DS-9: extremo en la dirección de extremos(); conserva id; `hacia.estado` fija el anclaje (T1→TS1);
  // 'no-visible', forma, contexto (DS-20), 'abanico' si rompe su abanico. Una mitad escindida reanclada a otro
  // proceso conserva su `escision`.
export const distribuirEnlace:  Operacion<{ enlace: Id }>;          // aplica §4.5.3 a un enlace del contorno (reparación de AP-06/AP-21/AP-07)
export const eliminarEnlaces:   Operacion<{ enlaces: readonly Id[] }>;
  // mitad escindida ⇒ la otra queda standalone (traza, DR-7); abanicos con <2 ramas se disuelven (traza)
  // Toda operación que deja a un objeto con `valor` sin exhibición que lo tenga como rasgo (eliminarEnlaces,
  // eliminarCosas del exhibidor, cambiarTipoEnlace, reanclarExtremo) retira el `valor` con traza «el valor 12 de
  // **Peso** se quitó: ya no es atributo» (F-13, T-020; nada queda sin oración en silencio, CC-03).

// abanicos.ts
export const formarAbanico:       Operacion<{ enlaces: readonly Id[]; operador: Operador }>;   // creados[0] = id
export const fijarOperador:       Operacion<{ abanico: Id; operador: Operador }>;
export const agregarRama:         Operacion<{ abanico: Id; enlace: Id }>;
export const quitarRama:          Operacion<{ abanico: Id; enlace: Id }>;   // <2 ⇒ disuelve (traza)
export const disolverAbanico:     Operacion<{ abanico: Id }>;
export const fijarControlAbanico: Operacion<{ abanico: Id; control: Control | null }>;   // todas las ramas (R-FAN-3)

// refinamiento.ts
export const descomponer:        Operacion<{ opd: Id; proceso: Id; bandas?: readonly (readonly string[])[] }>;   // creados[0] = OPD hijo
export const agregarSubprocesos: Operacion<{ opd: Id; bandas: readonly (readonly string[])[];
                                             posicion: 'final' | { antesDeBanda: number } | { enBanda: number } }>;
export const moverSubproceso:    Operacion<{ opd: Id; proceso: Id; destino: { banda: number } | { nuevaBandaAntesDe: number } }>;
export const fijarBandas:        Operacion<{ opd: Id; bandas: readonly (readonly Id[])[] }>;   // partición del MISMO conjunto; sin migración
export const desplegar:          Operacion<{ opd: Id; cosa: Id; modo: ModoDespliegue; refinadores?: readonly string[] }>;  // creados[0] = OPD hijo
export const agregarRefinadores: Operacion<{ opd: Id; nombres: readonly string[]; tipo?: TipoCosa }>;
export const eliminarRefinamiento: Operacion<{ opd: Id }>;                   // solo hoja (DS-16)

// consultas puras (memoizadas por identidad de Modelo)
export function indice(m: Modelo): Indice;
export function proyectar(m: Modelo, opd: Id): Vista;
export function etiquetaOpd(m: Modelo, opd: Id): string;                    // 'SD', 'SD1', 'SD1.2'
export function opdsEnPreorden(m: Modelo): readonly Id[];
export function erroresContexto(m: Modelo): readonly Violacion[];           // matriz §4.3.2 + abanicos (errores)
export function diagnosticar(m: Modelo): readonly Diagnostico[];
export function gatesExportacion(m: Modelo, alcance: { readonly opd: Id } | 'modelo'): readonly Rechazo[];
export function validarForma(m: Modelo): readonly Violacion[];
export function colocar(m: Modelo, opd: Id, tam: { ancho: number; alto: number }, punto?: { x: number; y: number }): { x: number; y: number };
export function buscarPorNombre(m: Modelo, consulta: string, max?: number): readonly Coincidencia[];   // sin mayúsculas ni acentos
export function describirEnlace(m: Modelo, e: Enlace): string;              // «consumo: Pedido → Despachar» (sin opl/)
export function sugerirNombre(m: Modelo, nombre: string, tipo: 'cosa' | 'estado', excluir?: Id): string;   // léxico + sufijo -2…
export interface Coincidencia { readonly ref: Ref; readonly texto: string; readonly detalle: string }   // «**Pedido** · objeto · SD, SD2»
```

Toda operación que recibe un nombre llama a `lexico.validarNombreCosa`, a `validarNombreEstado` o
a `validarEtiqueta`. Si el nombre choca, devuelve `Rechazo{codigo:'unicidad-nominal', refs:[cosa
existente]}`, y la UI usa esa ref para ofrecer «traer esa misma cosa» (T-065). **Ninguna operación
capitaliza, recorta ni corrige**: la UI ofrece `sugerirNombre` y el operador lo acepta.

**Registro único de operaciones** (`nucleo/operaciones.ts`). Lo usan el historial, las reparaciones
del diagnóstico y el aplicador OPL:

```ts
export const OPERACIONES = { renombrarModelo, fijarUnidadTiempo, fijarDescripcionModelo, crearCosa, renombrarCosa,
  cambiarTipoCosa, fijarEsencia, fijarAfiliacion, fijarGenero, fijarDescripcion, fijarValor, fijarDuracion, fijarIncompleta,
  traerCosa, moverApariciones, redimensionar, quitarDeOpd, eliminarCosas, agregarEstado, renombrarEstado, moverEstado,
  eliminarEstado, designar, suprimirEstado, crearEnlace, cambiarTipoEnlace, fijarEstados, fijarControl, fijarEtiqueta,
  fijarRuta, fijarMultiplicidad, reanclarExtremo, distribuirEnlace, eliminarEnlaces, formarAbanico, fijarOperador,
  agregarRama, quitarRama, disolverAbanico, fijarControlAbanico, descomponer, agregarSubprocesos, moverSubproceso,
  fijarBandas, desplegar, agregarRefinadores, eliminarRefinamiento } as const;
export type NombreOperacion = keyof typeof OPERACIONES;
export type ArgsDe<K extends NombreOperacion> = Parameters<(typeof OPERACIONES)[K]>[1];
export type Accion = { [K in NombreOperacion]: { readonly op: K; readonly args: ArgsDe<K> } }[NombreOperacion];
export function aplicarAccion(m: Modelo, a: Accion): Respuesta<Hecho>;
export function aplicarAcciones(m: Modelo, as: readonly Accion[]): Respuesta<Hecho>;   // secuencia atómica: primer rechazo aborta
export function etiquetaAccion(m: Modelo, a: Accion): string;    // «Descomponer *Cocinar*» (historial y franja)
```

**Índice** (`nucleo/indice.ts`, memo en `WeakMap<Modelo, Indice>`):

```ts
export interface Indice {
  readonly estadoDe: ReadonlyMap<Id, { readonly objeto: Id; readonly posicion: number }>;
  readonly enlacesDeCosa: ReadonlyMap<Id, readonly Id[]>;      // incidentes, incluidos los anclados a sus estados
  readonly enlacesDeEstado: ReadonlyMap<Id, readonly Id[]>;
  readonly abanicoDeEnlace: ReadonlyMap<Id, Id>;
  readonly aparicionesDe: ReadonlyMap<Id, readonly Id[]>;      // cosa → OPDs en preorden
  readonly refinamientosDe: ReadonlyMap<Id, { readonly descomposicion?: Id; readonly despliegue?: Id }>;
  readonly hijosDe: ReadonlyMap<Id, readonly Id[]>;            // OPD → hijos por `orden`
  readonly preorden: readonly Id[];
  readonly etiqueta: ReadonlyMap<Id, string>;
  readonly internoDe: ReadonlyMap<Id, Id>;                     // cosa interna → OPD de descomposición
  readonly subprocesoDe: ReadonlyMap<Id, { readonly opd: Id; readonly banda: number }>;
  readonly porClaveNombre: ReadonlyMap<string, readonly Id[]>; // ≥2 ⇒ nombre duplicado
}
export function claveNombre(nombre: string): string;          // NFC, espacios colapsados, recorte, toLocaleLowerCase('es')
```

#### 4.3.4 Consumidores (sin copias)

```ts
export type Alternativa =
  | { readonly k: 'completarCambio'; readonly enlace: Id; readonly estados: EstadosEnlace }   // TS4/TS5 ⇒ TS3
  | { readonly k: 'abanicoCon'; readonly enlace: Id }                                        // ofrecer XOR y OR
  | { readonly k: 'cambiarTipoExistente'; readonly enlace: Id };
export type OpcionTipo =
  | { readonly tipo: TipoEnlace; readonly sentido: 'directo' | 'inverso'; readonly legal: true;
      readonly candidato: EnlaceNuevo; readonly avisos: readonly Violacion[] }
  | { readonly tipo: TipoEnlace; readonly sentido: 'directo' | 'inverso'; readonly legal: false;
      readonly motivo: Violacion; readonly alternativa?: Alternativa }
  | { readonly tipo: 'etiquetadoBidireccional'; readonly sentido: 'directo' | 'inverso';
      readonly legal: 'pendiente'; readonly requiere: readonly ['etiqueta', 'inversa'];
      readonly avisos: readonly Violacion[] }
  | { readonly tipo: 'reciproco'; readonly sentido: 'directo' | 'inverso';
      readonly legal: 'pendiente'; readonly requiere: readonly ['etiqueta'];
      readonly avisos: readonly Violacion[] };
export function violacionesForma(m: Modelo, e: Enlace | EnlaceNuevo): readonly Violacion[];
export function normalizarEtiquetas(e: EnlaceNuevo): Respuesta<EnlaceNuevo>;
```

- **`tiposLegales`** evalúa una intención por cada fila y cada sentido admisible del gesto.
  - Los estados arrastrados van al rol que la fila admite. En efecto, van a `entrada` si el gesto
    sale del estado y a `salida` si llega a él. En generalización, van al par solo si ambos extremos
    son estados.
  - `etiquetas` aporta datos del usuario en los roles origen/destino de la opción después de
    aplicar `sentido`; no se infieren de nombres ni se intercambian por una suposición lingüística.
    La firma del gesto y las precondiciones decidibles se validan primero con la misma matriz.
  - Un bidireccional sin los datos requeridos devuelve `legal:'pendiente'`, requiere etiqueta e
    inversa y no contiene candidato. Un recíproco con estados y sin etiqueta suministrada también
    queda pendiente. Un null explícito, vacío o léxico inválido en un dato requerido devuelve
    rechazo; unidireccional y recíproco sin estados conservan la etiqueta opcional ausente/null.
    El hecho real recíproco con estados y sin etiqueta sigue rechazado por B-05.
  - Una intención completa pasa por `normalizarEtiquetas` (léxico único; igualdad bidireccional
    válida y no vacía ⇒ recíproco con traza R-STRE-1), `violacionesForma`, `noOfrecido` y las
    precondiciones. Su admisibilidad se evalúa sobre el resultado efectivo de distribución (§4.5.3)
    y el cierre DS-20. `legal:true.candidato` conserva la intención completa que recibe creación;
    puede transformarse antes de persistir. F-11 se exige al modelo efectivo final.
  - Si R-ROL-UNIC-1 bloquea por un enlace existente L sobre el mismo par, adjunta la `alternativa`
    del «segundo gesto»:
    - si L es un TS4 y el gesto llega a otro estado del objeto, o L es un TS5 y el gesto sale de un
      estado, `completarCambio`;
    - si L es del mismo tipo y el abanico sería legal, `abanicoCon`;
    - si no, `cambiarTipoExistente`.
    Una colisión solo por ancestro/descendiente conserva el rechazo sin estas alternativas de
    mismo par. La identidad de un hecho es semántica y no depende del orden de claves anidadas.
  - Orden: completas legales por `menu`, pendientes seleccionables por `menu`, luego rechazadas
    con motivo. Los consumidores comparan `legal === true/false/'pendiente'` explícitamente.
- **`normalizarEtiquetas`** es un ayudante puro compartido por consulta y operaciones de enlaces;
  conserva la entrada, usa `validarEtiqueta` sin trim/capitalización y devuelve la intención
  normalizada con sus trazas. No es una operación registrada. La consulta conserva el candidato
  completo original para que creación pueda emitir la traza de su normalización.
- **`crearEnlace`**, `reanclarExtremo` y `cambiarTipoEnlace` usan las mismas funciones, más la
  distribución y el cierre DS-20. Consulta completa, creación y reparación consumen la misma
  distribución pura; no se ignoran R-DIST-1/AP-07/R-CX-DIST-2 en los hechos efectivos.
  DS-20 compara siempre el original real, antes de insertar candidato o reservar ids, con el
  resultado efectivo final; el borrador que ya contiene el enlace no se toma por modelo previo.
- **Integración serial (B-28):** WP-2 verifica las reglas y los estados de datos; WP-3 b verifica
  equivalencia real sobre constructores sin refinamientos; WP-4r agrega la distribución compartida
  a consulta/creación/reparación y cierra la equivalencia refinada. Hasta WP-4r/H2 no se declara
  esa equivalencia completa ni se acredita con stubs; el límite permanece en conformidad/HANDOFF.
- **Planificador OPL**: cada hecho reconocido se convierte en el mismo `EnlaceNuevo`.
  - Forma, contexto o precondición fallidos dan `type-mismatch` y la razón `enlace-invalido-firma`,
    con la regla en el mensaje.
  - `noOfrecido` da `unsupported-canonical`.
- **`diagnosticar`**: aplica `violacionesContexto` y `violacionesAbanico` a todo enlace y todo
  abanico, y produce `enlace-invalido` y `abanico-invalido`.
- **Importador**: `violacionesForma` y `noOfrecido` descartan el elemento con informe; los errores
  de contexto se cargan.

`erroresContexto(m)` = las violaciones de severidad `error` de `violacionesContexto` sobre todos
los enlaces, más `violacionesAbanico` sobre todos los abanicos. Es la base del cierre DS-20.

### 4.6 Proyección por OPD (`nucleo/proyeccion.ts`) — CONTRATO

```ts
export interface Vista {
  readonly opd: Id;
  readonly clase: 'raiz' | 'descomposicion' | 'despliegue';
  readonly cosas: readonly CosaVista[];
  readonly enlaces: readonly EnlaceVisto[];
  readonly abanicos: readonly AbanicoVisto[];
  readonly incompletas: readonly { readonly refinable: Id; readonly relacion: RelacionIncompleta; readonly declarada: boolean }[];
  readonly conflictos: readonly Diagnostico[];             // AP-30 / R-PREC-3 de este OPD
}
export interface CosaVista {
  readonly cosa: Id;
  readonly rol: 'libre' | 'contenedor' | 'subproceso' | 'interno' | 'externo' | 'refinable';
  readonly banda?: number;                                 // subprocesos
  readonly estadosVisibles: readonly Id[];                 // en el orden del modelo
  readonly ocultos: number;                                // chip ⋯N y D6
}
export interface EnlaceVisto {
  readonly clave: string;                                  // estable: tipo|extremos vistos|estados|control
  readonly enlace: Enlace;                                 // hecho visto (sintetizado si abstraído; id = primer subyacente)
  readonly hechos: readonly Id[];                          // enlaces del modelo que representa (1 si es directo)
  readonly abstraido: boolean;
}
export interface AbanicoVisto { readonly abanico: Id; readonly operador: Operador; readonly ramas: readonly Id[]; readonly comun: Id }
```

Algoritmo (DR-13, R-VIS-HIJO-1, reglas §6.5/§6.6):

1. `visto(x)` es `x` si `x` tiene aparición en el OPD. Si no, y `x` es un **proceso** interno de una
   descomposición D, es `visto(D.cosa)`. En otro caso es indefinido. Solo el in-zoom abstrae y solo
   eleva procesos, así el hecho abstraído conserva su firma.
2. Para cada enlace se calculan sus extremos vistos. Si uno es indefinido, el enlace no se ve. Si
   ambos extremos vistos son la misma cosa y al menos uno fue elevado por abstracción, el enlace es
   interno al refinamiento y no se ve, aunque su tipo admita reflexivo (R-CAT-EQ-3, R-EJEC-9,
   R-INV-2D, DECISIONS 32). Un reflexivo propio entre extremos visibles se conserva.
3. En un OPD de **descomposición** se ven los enlaces que tocan al contenedor o a un interno, y se
   ocultan los que unen dos externos (R-VIS-HIJO-1). Los procedimentales al contorno se ven en el
   contorno: es un desvío declarado (DR-13, B-19). En un **despliegue** se ven los que tocan a la
   cosa o a un refinador, y se ocultan los que unen dos externos. Los estructurales y etiquetados
   nunca se abstraen.
4. Los procedimentales abstraídos se agrupan por par visto (objeto, proceso). En un grupo con más
   de un hecho:
   - el transformador prevalece sobre el habilitador (R-PREC-5);
   - entre transformadores rige la Tabla 27 de ISO 19450 (§14.2.4.1.1, DECISIONS 31), que depende
     del orden temporal de los dos subprocesos (banda del primero → banda del segundo):
     - E→E da E; R→E da R; E→C da C;
     - R→C y C→R dan E, con la entrada del hecho temprano y la salida del tardío, si hay
       continuidad de estados trazables (R-PREC-2), conservando la procedencia; sin ella se muestran
       ambos y se emite `conflicto-resultado-consumo` (R-PREC-3/4), `warning` de `contencion` (§4.4);
     - C→C, R→R, C→E (afectar lo ya consumido) y E→R (crear lo que ya existía) dan
       `precedencia-invalida` y se muestran ambos;
     - si los dos hechos están en la misma banda, el orden no se conoce y rige la matriz simétrica
       de reglas §6.6: E+E da E, E+R da R, E+C da C, R+C da E con la misma condición, y R+R y C+C
       son inválidos;
   - entre habilitadores, el agente prevalece sobre el instrumento;
   - el control resultante es el de mayor fuerza: evento > sin control > condición.

   Los 12 niveles de fuerza son los de T-085. En los efectos fusionados, la entrada es la del hecho
   con entrada de banda más temprana y la salida la del de banda más tardía: un par escindido
   vuelve a verse como su TS3.
5. Un abanico se ve si todas sus ramas se ven y siguen siendo distintas. Si las ramas colapsan en un
   mismo extremo, se ve como un único enlace fusionado.
6. Estados visibles: `¬suprimido ∧ id ∉ aparicion.ocultos`, **salvo** los anclados por un enlace
   visible en ese OPD, que siempre se ven. `suprimirEstado` rechaza ocultarlos, y
   `crearEnlace`/`fijarEstados` los des-suprimen localmente con traza (LF-03).
7. Memo por `(modelo, opd)` en `WeakMap`: consultar la misma vista memoizada cuesta O(1).
   Para una vista nueva, con el índice básico ya construido, el costo es O(D + P + E + A + S):
   D OPDs del modelo, P procesos relevantes, E enlaces escaneados, A apariciones de la vista y
   S estados o entradas ocultos inspeccionados o emitidos. Los auxiliares temporales privados
   y puros se comparten por identidad de Modelo y se preparan en O(D + P); cada consulta de
   secuencia cuesta O(1). La construcción fría del índice básico se mide aparte. Se conservan
   las latencias de §2.4 y todas las pruebas existentes.

**Ley de frontera** (T-089, DR-16). La firma `{(externa, tipo fusionado, estados)}` de los enlaces
del contenedor en la vista del padre es igual a la fusión de los enlaces entre externos y {contenedor
∪ internos} del hijo. `frontera.test.ts` la verifica con una implementación independiente de ~40
líneas y con mutantes que deben ponerla roja.

### 5.9 Cómo se garantiza `parsear(generar(m))` y el fixture estricto R-§19-SIM-3

WP-9 realiza la inversa canónica de las superficies ofrecidas con PLANTILLAS compartidas, plan puro y aplicación nuclear. DEC 29 retiró los dominios locales de abanicos en estado; no son una obligación de reconocimiento ni una nueva bisimetría parcial. Las siete suites siguientes acreditan el corpus ofrecido y H2 tuvo revisión conjunta favorable. WP-10 añade auto-reparseo de todos los OPDs de los seis fixtures, el sintético y HODOM; el estricto completo sólo se ejecuta donde los gates reales del Modelo lo ofrecen, preservando los rechazos. La UI conserva el alcance observado y las diez parciales siguen vigentes; la ola 4 cerró con revisión favorable, y cada revisión debe contrastar el candidato con el canon y modelos reales.

1. **Por construcción** (P4): generar y reconocer usan el mismo `patron`. `plantillas.test.ts`
   exige, por cada plantilla G, que `hacia(desde(h))` sea la identidad sobre el hecho, en todas sus
   opciones: con y sin estado; multiplicidad `?`, `*` y `+`; género m y f; `y`/`e` y `o`/`u`; listas
   de 1 a 4.
2. **Por enumeración** (`roundtrip-matriz.test.ts`).
   - Un enumerador recorre `MATRIZ`. Para cada tipo construye el modelo mínimo: objetos `Alfa` y
     `Ilustre` con estados `uno`, `dos` y `tres`, y procesos `Beta` y `Omega`.
   - Recorre todas las variantes legales de sus dimensiones:
     - estados en cada extremo admitido;
     - control ∈ {∅, e, c}, multiplicidad ∈ {∅, ?, *, +}, ruta ∈ {∅, `Uno`};
     - género ∈ {m, f}, esencia y afiliación.

     Descarta las que la forma, el contexto o `noOfrecido` rechazan.
   - Para abanicos recorre cada familia × {XOR, OR} × {convergente, divergente} × {con o sin estado
     por rama} × los controles admitidos × {sin ruta, con ruta en una rama}.
   - Para refinamiento recorre CX1, CX2 y CXM con internos, y CX3 por modo.
   - En cada caso exige tres cosas:
     1. `generar` produce solo plantillas de la tabla;
     2. el auto-reparseo sobre el mismo modelo da 0 patches y 0 errores (R-§19-SIM-1, T-191);
     3. es estricto: `generar(m) === generar(aplicarPlan(v, planificar(v, 'modelo', generarDocumentoOpl(m))).valor.modelo)`, con `v = crearModelo(…)`,
        línea a línea (R-§19-SIM-3, T-192), salvo en los casos marcados como bisimetría parcial.
   - El corpus actual construye 2996 modelos y realiza 2734 importaciones estrictas distintas; conserva 2992 comparaciones por origen y 258 reutilizaciones de argumentos exactos. La construcción, auto-reparseo y reconstrucción completa entran en el límite de 3 s, sin precalentar la respuesta medida.
3. **Aleatorio con semilla** (`roundtrip-azar.test.ts`): 200 modelos de `pruebas/azar.ts`, con
   perfil `estricto` (sin construcciones de bisimetría parcial: exige 1, 2 y 3) y perfil `completo`
   (exige 1 y 2).
4. **Tabla 9.2 nominal** (`roundtrip-tabla92.test.ts`): una prueba con nombre por fila, con el T-ID
   en el título (T-301).
5. **Modelos reales** (`roundtrip-modelos.test.ts`): los 6 de `app/fixtures/v0` importados y el
   sintético grande. Exige auto-reparseo por OPD con 0 cambios (UX-01 no puede volver) y el estricto
   sobre el documento completo para los que pasan los gates.
6. **Composición** (T-194): `analizar(componer(F))` da el mismo conjunto de hechos para toda
   oración de lista (RF1, RF2, RF3, RF4b, RFE, D5, CX, abanicos). F se genera al azar.
7. **Leyes de lente segura** (T-302, `lente.test.ts`):
   - la ausencia no borra;
   - la vista previa no muta (identidad de objeto del modelo);
   - `unsupported-canonical` no muta;
   - `exportarV0(aplicarPlan(m, planificar(m, o, '')).valor.modelo) === exportarV0(m)`.

**Bisimetrías parciales declaradas** (R-§19-ROT-1, T-193). Cada una tiene su fixture marcado «no
estricto» y su fila en la tabla 3 de `docs/conformidad.md`:

1. La procedencia de escisión: el texto no distingue un TS4/TS5 escindido de uno standalone. Se
   conserva en el JSON y al reparsear sobre el modelo existente (T-159).
2. El borrado: el OPL es aditivo.
3. Posiciones y tamaños.
4. Estados ocultos en **todos** los OPDs, por supresión global o local en todos: D6 no los nombra.
   La supresión local, en cambio, sí se reconstruye (`sincronizar-estados` con `otros`).
5. Duración de proceso sin una excepción que la cite: no hay plantilla (zona laxa, B-20).
6. `descripcion`, y `genero` cuando ninguna oración muestra `un/una`.
7. Refinamientos triviales (<2): sin oración CX (R-CX-0), no se reconstruyen desde el texto.
8. El operador de un abanico con ruta (DS-10).
9. Dos etiquetados opuestos con etiquetas distintas se reconstruyen como un bidireccional (DS-13).
10. Cosas sin aparición y enlaces sin vista: no pertenecen a ningún bloque (DS-6).

---

### 6.3 Geometría (`opd/geometria.ts`)

- **Recorte exacto** (R-OPD-LAY-5, T-224). El segmento va de centro a centro y se recorta en el
  perímetro real, conservando la identidad de cada terminal; los abanicos usan su acople común específico descrito abajo (DEC 29).
  - En el rectángulo, `s = min(w/2/|dx|, h/2/|dy|)`, y el punto es `c + s·d`.
  - En la elipse, `s = 1/√((dx/rx)² + (dy/ry)²)`.
  - En el estado, el recorte se hace sobre el rectángulo de la cápsula, con el arco de radio 8 en
    las esquinas.
- **Procedimentales**, rectos (R-OPD-LAY-4, T-225); sin vértices de fan (DEC 29):
  - Consumo: punta en el proceso. Resultado: punta en el objeto o el estado.
  - Efecto T3: punta en ambos extremos.
  - TS3: dos tramos, `estado_entrada → proceso` (punta en el proceso) y `proceso → estado_salida`
    (punta en el estado).
  - TS4: `estado → proceso`. TS5: `proceso → estado` (R-OPD-TR-6, T-209).
  - Agente e instrumento: piruleta negra o blanca en el extremo proceso, colgando de la línea
    (T-210).
- **Invocación** (T-211). Es la polilínea `A, M1, M2, B`, con:
  - `M1 = lerp(A,B,0.46) + n·k` y `M2 = lerp(A,B,0.54) − n·k`;
  - `k = min(22, max(12, |AB|·0.08))`;
  - la punta cerrada en el invocado.

  El rayo es una decoración derivada de la recta.
- **Autoinvocación**. Es un lazo bajo el proceso:
  - sale de los puntos del borde a ±35° de la vertical inferior;
  - llega a un pico a `max(56, alto·0.55)` bajo el borde, con el quiebre del rayo en el pico;
  - termina con la punta en el retorno (porte de `autoinvocacionLoop`).
- **Excepción**: una recta sin punta, con `/` (una barra corta inclinada) o `//` (dos barras
  paralelas) a 22 px del manejador (DR-38, T-215).
- **Estructurales fundamentales**. Se dibujan como un peine ortogonal por grupo (refinable,
  relación) (T-212, T-225):
  - La orientación es el eje dominante del vector refinable→centroide de refinadores.
  - El vértice del triángulo (30×30) va a 24 px del borde del refinable, unido por un tramo recto.
  - La barra común va a 16 px de la base, y de ella bajan tramos ortogonales al centro de cada
    refinador, recortados en su borde.
  - Los refinadores se ordenan por su coordenada transversal, así el peine no cruza sus propias
    ramas.
  - La colección incompleta se marca con una barra corta de 14 px entre la base y la barra común
    (T-217).
  - La multiplicidad de la parte va junto al extremo del refinador.
- **Etiquetados**, rectos (T-213):
  - El unidireccional lleva punta abierta en el destino; el bidireccional y el recíproco, arpón en
    ambos extremos (media punta, en lados opuestos).
  - La etiqueta va en itálica sobre el eje: al centro en el unidireccional y el recíproco. En el
    bidireccional, la etiqueta va a 1/3 desde el origen y la inversa a 1/3 desde el destino, en
    lados opuestos.
  - La multiplicidad se marca en ambos extremos (T-218).
- **Abanicos** (T-216, DR-9, DEC 29): sólo se forman con un extremo común en el borde de
  la cosa, nunca en un estado. El acople es el recorte de ese borde hacia el centroide de
  los otros extremos efectivos, incluidos sus estados no comunes y las cajas expandidas.
  Todas las ramas conservan una recta por tramo, recortada en sus perímetros propios y
  orientada según sus hechos; no hay búsqueda de packing, vértices gráficos ni radios adaptados.
  El arco se centra en el acople: XOR usa radio 30; OR, radios 30 y 35; dash `4 1`, trazo 1.5.
  El sector angular mínimo de las ramas evita el mayor hueco angular. En FAN5 A lo determina
  la dimensión variable, conservando ambos tramos del TS3 y su entrada común.
  AND es la ausencia de arco. Efectos, controles y rutas representables conservan sus reglas;
  DS-10 desagrupa el texto con ruta sin perder el abanico nuclear o gráfico.
  Las posiciones persistidas, IDs, estados, hechos, dirección, marcadores y capas se conservan.
  `escena()` y los exports no lanzan con un modelo válido: cruces u oclusiones se advierten
  según B-15, sin reruteo automático ni rechazo por no encontrar una geometría alternativa.
- **Marcas de control** (T-214): `e` o `c` en minúscula dentro de un círculo de 18 px (fondo papel,
  borde tinta), sobre la línea a 28 px del borde del proceso.
- **Ruta y multiplicidad** (T-218, T-219):
  - La ruta va en serif 11 a mitad del segmento, desplazada 10 px a la izquierda del sentido
    objeto→proceso.
  - La multiplicidad va a 14 px del extremo objeto y a 10 px en perpendicular.
- **Estados dentro del objeto** (T-206):
  - Van en filas en la región inferior, con separación 8. La cápsula mide 26 de alto y
    `texto(itálica 13) + 16` de ancho (+6 si es inicial). El objeto crece para contenerlas, nunca al
    revés.
  - Inicial: trazo 3. Final: doble contorno (rectángulo interior a 3 px, trazo 1). Inicial y final
    llevan ambos.
  - **Por defecto**: flecha diagonal abierta **entrante**, desde arriba a la izquierda hacia la
    esquina de la cápsula (no `↗`, DR-37).
  - **Current** declarado: pin externo (círculo r 3.5 con pie) sobre la esquina superior derecha,
    fuera de la cápsula (DR-37, T-207).
- **Chip `⋯N`** (T-208): una cápsula de alto 16 en la esquina inferior derecha del objeto, con los
  estados ocultos. Persiste en `canon-diagrama` (DR-15).
- **Rótulo** (T-204): serif 17 (itálica en procesos), envuelto por palabras a ~132 px, sin elipsis.
  La forma se agranda: ancho = máx(declarado, rótulo + 28, fila de estados + 16), y el alto
  análogamente. En la elipse, el rectángulo de texto se inscribe (semiejes = medio contenido × √2 +
  8).
- **Duración** (T-220): va bajo el nombre dentro de la elipse, como `[min] {1, 3, 5}` en serif 11.
  Los valores ausentes se muestran como `–`. Sin duración no se dibuja nada.
- **Instancia lógica** (T-222): el rótulo es `Nombre : Clase` si el objeto es instancia por
  clasificación (la clase es la primera por nombre).
- **Contenedor** (T-221): la cosa refinada, en su OPD de descomposición, se dibuja agrandada, con el
  rótulo arriba por dentro y los subprocesos en filas por banda (misma banda, misma altura).
- **Cruces** (para advertencias): intersección segmento–segmento y segmento–rectángulo o elipse, en
  `advertenciasEscena` (§6.8).

### 10.7 E2E Playwright (26 escenarios)

Infraestructura:

- `cd app && bun run e2e` ejecuta el build y Playwright con `app/playwright.config.ts`.
  `webServer` lanza `bun --no-env-file dist-servidor/principal.js --host 127.0.0.1 --datos <tmp>`
  desde `app`, con `env -i`, `PATH` explícito, `PORT=<puerto-e2e>`, `OPFORJA_WEB=<ruta absoluta a app/dist>`,
  `OPFORJA_VERSION=e2e`, `OPFORJA_SECRETO` y `OPFORJA_TOKEN` sintéticos de prueba.
  Espera `<BASE>/salud` y no reutiliza un servidor existente. La ruta absoluta a dist se obtiene con fileURLToPath(new URL('./dist',import.meta.url)) bajo el ejecutor Node de Playwright. `e2e/configuracion.ts` valida `OPFORJA_E2E_PUERTO` como decimal entero 1..65535 (default 8787), normaliza el puerto y deriva una única BASE usada por config, setup y fixtures.
- `<tmp>` es un directorio temporal exclusivo de la corrida, compartido entre servidor y setup
  mediante `OPFORJA_E2E_DATOS`; quien lo crea lo retira al finalizar. No se usan datos reales.
- `globalSetup`, después de estar disponible `/salud`, reconstruye sólo la web con el Vite instalado y `OPFORJA_VERSION=e2e`; exige salida 0 antes de abrir páginas. No recompila el servidor mientras está activo. Después ejecuta desde `app`
  `bun --no-env-file dist-servidor/cuenta.js crear <correo-sintético> --datos <tmp>` con dos líneas
  iguales por stdin de una clave sintética de al menos 10 caracteres; exige salida 0. Después
  siembra modelos por la API real con el mismo token sintético del servidor.
- Chromium de `/opt/pw-browsers` (`PLAYWRIGHT_BROWSERS_PATH`), con `@playwright/test` fijado a la
  versión cuyo `browsers.json` coincide, o `launchOptions.executablePath` desde `PW_CHROMIUM`.
- Precisión serial WP-19: `e2e/soporte.ts` conserva el executablePath explícito de `PW_CHROMIUM`; omitido usa exclusivamente `chromium.executablePath()`, que consulta el registro instalado y `PLAYWRIGHT_BROWSERS_PATH`. Sin instalaciones ni cambio de escenarios/guardas.
- El contrato «app lista» es `document.body.dataset.listo === "1"`.
- Los localizadores van por rol y nombre accesible. El estado se lee con `GET /api/modelos/:id` y
  con el OPL visible. No se usa CSS ni `import("/src/…")`.
- Un fixture exige 0 errores de página.
- Precisión serial WP-17: `editor/gestos.ts` sólo realización de alternativa abanicoCon ofrecida: orientación y estados de efecto por extremos originales, APPEND gestos.test/lienzo.test; `servidor/cuenta.ts` limita su guard CLI a la entrada propia fuente/compilada; APPEND de `cuenta.test.ts` comprueba servidor compilado con stdin abierto y CLI compilada real. Sin cambio de cuenta/autenticación.

| # | Escenario | Verifica |
|---|---|---|
| 1 | acceso | la clave errónea da el mensaje uniforme; la correcta lleva a la Biblioteca; salir vuelve a Acceso |
| 2 | biblioteca | nuevo con nombre abre el editor vacío; renombrar en línea se refleja en `GET`; descargar ≡ `GET`; eliminar lleva a la papelera, y restaurar lo devuelve; no hay pestañas ni carpetas |
| 3 | importar JSON | `System_Diagram.json` muestra el informe con conteos y visibilidad; la casilla de reparaciones está desmarcada; crear dibuja el OPD con N líneas de OPL; `GET` es canónico |
| 4 | crear y nombrar | `O` nombre ↵ y `P` nombre ↵; un nombre inválido se bloquea con ayuda; ⎋ no crea; una colisión ofrece «traer esa misma cosa», que crea una aparición y no una cosa |
| 5 | esencia, afiliación, métricas | física da `feDropShadow` y D1; ambiental da dash y D3; el `getBBox()` de tres rótulos queda dentro de `metricas.ts` ± 2 % |
| 6 | estados | `S` nombre ↵ crea uno; ⎋ no crea; nunca aparece `estado1`; `I`+`F` dan D10; `D` da por defecto; `H` da el chip `⋯1` y D6 |
| 7 | enlace por arrastre | el menú solo trae tipos legales, con vista previa y «N no disponibles»; consumo da `*P* consume **O**.`; agente desde informacional sale no disponible con motivo |
| 8 | segundo gesto | desde un TS4, arrastrar a otro estado ofrece «Completar cambio», que da TS3; un segundo resultado ofrece «Abanico XOR con el existente», que da un arco |
| 9 | control, etiqueta, multiplicidad | `C` en consumo da CT1; resultado sale deshabilitado con motivo; etiquetado `usa` con `M`=`+` sobre objeto femenino da `al menos una **Olla**` |
| 10 | abanico | dos consumos y `X` dan un arco y `consume exactamente uno de`; `Mayús+X` da dos arcos; disolver |
| 11 | descomponer con bandas | `D` crea el OPD hijo **sin** subprocesos; `A ↵ B ⇧↵ C ↵ D ⎋` da el CXM exacto; el consumo migra a *A*; el TS3 se escinde; en SD la línea abstraída se mantiene; **un** `Ctrl+Z` lo deshace todo; `D ⎋` da la advertencia AP-13 |
| 12 | bandas y doble vara | `]` sobre *B* cambia el OPL; una invocación *A*→*B* adyacente se rechaza como doble vara |
| 13 | desplegar | `U` agregación con dos partes da CX3 y RF1 atómicas; la colección incompleta da la barra y «y al menos otra parte» |
| 14 | navegación y cámara | árbol, ruta, ↵ entra, `Alt+↑` sube; al cambiar de OPD el bbox queda encuadrado |
| 15 | quitar ≠ eliminar | `Supr` en la última aparición deja la cosa en el modelo (`cosa-sin-aparicion`), y `Ctrl+K › Traer` la devuelve; `Mayús+Supr` en una cosa refinada se rechaza con «Elimina primero su refinamiento» |
| 16 | editar OPL | agregar `**Cliente** es físico.` da «1 aplicable»; Aplicar pone la cosa en el lienzo con la línea resaltada; reabrir da «Sin cambios aplicables»; una línea inválida muestra su razón y no bloquea las demás |
| 17 | bimodal | el hover de un token realza el elemento (atributo de realce en la capa UI) y viceversa; un clic en un token de otro bloque navega y selecciona sin cambiar la `rev` |
| 18 | diagnóstico y reparación | un proceso sin transformación da una advertencia e «Ir» lo selecciona; un modelo sembrado con dos nombres duplicados muestra «Aplicar a los N», que renombra con sufijo; el SVG no tiene marcas |
| 19 | exportar y vista canon | el SVG descargado no tiene `data-ref` ni clases UI, y sí `@font-face`; un OPD con 1 subproceso deja el ítem deshabilitado por AP-13; `F9` dibuja el mismo SVG que el export; tras «Guardado», el JSON exportado ≡ `GET`; una cosa quitada de su último OPD deshabilita `canon-documento` (B-26) |
| 20 | deshacer | aplicar un OPL con 3 cambios y deshacer vuelve al modelo previo y al OPD donde ocurrió; rehacer |
| 21 | guardado y conflicto | editar da «Guardado» y `GET` lo refleja; un PUT concurrente por la API da «Conflicto»: «Conservar mis cambios» deja la versión del servidor en la papelera, y en otra corrida «Usar la guardada» crea la «(copia …)»; la red cortada da «Sin conexión», y al recargar se recupera el borrador |
| 22 | reanclar | arrastrar el extremo de una parte a otra cosa cambia el OPL de `consta de`; arrastrar el extremo proceso de un consumo migrado a otro subproceso lo reasigna con el mismo id |
| 23 | duración y excepción | duración máx de 5 min; un sobretiempo a manejador ambiental da `excede 5 minutos`; un manejador sistémico da una advertencia |
| 24 | ancho estrecho | a 390×844, las pestañas cambian de zona, no hay desplazamiento horizontal y crear un objeto funciona |
| 25 | selección múltiple y enlaces de una cosa | `Mayús+clic` en 3 cosas y arrastrar mueve las 3, y un `Ctrl+Z` las devuelve; `Supr` da una Decisión; Propiedades lista los enlaces con sus OPDs y un clic navega |
| 26 | bimodal idempotente (SYNTHESIS §7.3) | con `System_Diagram.json` importado, en cada OPD, abrir el editor OPL sin tocar da «Sin cambios aplicables»; agregar una línea, aplicar y deshacer deja, tras el autoguardado, la `rev` original en `GET` |

---


## Riesgos y mitigaciones — transferencia de las tablas 13.1 y 13.2

Son distinciones y mecanismos del diseño; la acreditación efectiva y las superficies
pendientes se consultan en conformidad, no se deducen de esta tabla. Las migraciones,
respaldos, Docker y transición son procedimientos previstos, no ejecutados.

### 13.1 Riesgos de sobresimplificación de SYNTHESIS §8 (los 21, resueltos)

| # | Riesgo | Resolución | Dónde se prueba |
|---|---|---|---|
| 1 | Datos de producción con extensiones (`esApunte`, familias por preestado, anclas, notas, piezas, `Estado.duracion`) | El importador descarta cada campo **con su ruta**. La migración escribe un informe por modelo y archiva cada payload original; antes se hace `pg_dump` (§9.4-2). Las familias por preestado dejan varios efectos sobre el mismo par: se **cargan** como `enlace-invalido` (R-ROL-UNIC-1, recuperable), nunca se fusionan en silencio | `codec.test`, `migrar-postgres.test` |
| 2 | Consumidores externos (`hd-opm`, skill, `mesa`, golden HODOM) | El contrato es JSON v0 + API HTTP + token Bearer (DECISIONS 13), en `formato-v0.md`. El export satisface los tipos v0 actuales; el servidor canonicaliza lo que llega (422 si hay pérdidas); la igualdad byte a byte del HODOM se reemplaza por la ley de punto fijo | `codec-fijo.test`, `principal.test` |
| 3 | Superficie OPL nueva y AND compuesto | Se abandonan la clasificación compuesta y el AND agrupado en la emisión (DECISIONS 20); el parser acepta ENT3; los `.opl.txt` viejos se retiran | `analizar.test`, `generar.test` |
| 4 | Vista del padre derivada (fuerza, R-PREC) | Una prueba por nivel de fuerza y por celda 3×3 en WP-4 p, **antes** de retirar las proyecciones persistidas; el importador las ignora recién en WP-6 | `proyeccion.test` |
| 5 | Reemplazar JointJS sin red | golden genuinos y diagnósticos diferenciados, observados individualmente; marcadores literales contra el canon; reductor de gestos puro; e2e de estados, enlaces, reanclaje y abanicos; toda la geometría es derivada | `golden.test`, `gestos.test`, e2e 5–13, 22 |
| 6 | Simulación y probabilidades | Se retiran (DECISIONS 9). El import las descarta con informe; `Pr=` da `unsupported-canonical` o `non-canonical` | `codec.test`, `analizar.test` |
| 7 | Sin deshacer, búsqueda ni tabla de enlaces | Deshacer y rehacer por instantáneas (200 pasos, fusión por gesto, vuelve al OPD); `Ctrl+K` para cosas y OPDs; «Enlaces (N)» en Propiedades y «Filtrar por selección» en el OPL | e2e 14, 15, 20, 25 |
| 8 | Sin versiones ni local-first | Copias previas en el servidor (30, cada ≥10 min); papelera de 30 días, también para versiones reemplazadas; borrador en IndexedDB; descarga JSON; respaldo diario; CAS | `almacen.test`, `guardado.test`, e2e 21 |
| 9 | Unicidad nominal frente a duplicados | **No se rechaza ni se renombra** (DS-7): se carga con `nombre-duplicado` (error) y una reparación de un clic («Aplicar a los N»); en edición, la colisión ofrece «traer esa misma cosa» | `codec.test`, `diagnostico.test`, e2e 18 |
| 10 | DR-11 lento en el in-zoom | `D`, nombres encadenados (↵ secuencia, ⇧↵ paralelo) y ⎋: un gesto, un paso de deshacer, sin semillas | e2e 11 |
| 11 | Import tolerante que persiste grafos inválidos | Lo representable se carga como error que **bloquea el export canónico** por gate; lo no representable se descarta por elemento con informe; el almacén solo guarda documentos con forma | `codec.test`, `diagnostico.test`, `exportar.test` |
| 12 | Capturador de bugs como único canal de feedback | Fuera (DECISIONS 11). Queda el límite de error por panel con «Copiar detalle» (sin contenido del modelo) y el README indica dónde reportar | revisión |
| 13 | CANON.md derivado y 4 decisiones pendientes | Canon vendorizado en `canon/`; `especificacion.md` declarada derivada; DR-5, DR-10, DR-18 y DR-23 fijadas por DECISIONS 1–4 y registradas (B-01, B-02, B-03) | — |
| 14 | Pruebas primero | Cada WP abre con sus pruebas; las leyes y sondas se reexpresan antes del código que protegen; WP-1 deja los contratos para programar contra ellos | revisión única por ola |
| 15 | Licencia: el historial conserva lo retirado | Declarado en `NOTICE.md`; purgar el historial es decisión del dueño | — |
| 16 | DR-2 sin T-153 rompe el roundtrip desde vacío | D1/D3 «solo si difieren», la mención mínima D2 (DS-2) y la creación por tipografía entran **juntas** en WP-9, con `roundtrip-matriz` como gate | `roundtrip-matriz.test` |
| 17 | Retirar `canvas/operacionesBatch.ts` en bloque | `traerCosa`, `quitarDeOpd` y `eliminarCosas` nacen en el núcleo en WP-3 a con pruebas; lo viejo solo se retira en la rama, que no llega a producción sin los e2e 14–15 | `cosas.test`, e2e 14, 15 |
| 18 | Retirar el diálogo de abrir modelos | La Biblioteca en lista simple es WP-14, y sus e2e 2–3 son condición de merge | e2e 2, 3 |
| 19 | Migrar el par TS3 | El import fusiona consumo(estado) + resultado(estado) del mismo par, fuera de abanico, en un `efecto` con el id del consumo; `efectoEscindido` pasa a `escision`; cada fusión queda en el informe | `codec.test`, `codec-derivados.test` |
| 20 | Cotas de excepción en el enlace | `tiempoMaximo`/`tiempoMinimo` pasan a `duracion.max/min` de la fuente; ante conflicto se conserva la primera; EX1/EX2 salen con el número | `codec.test`, `generar.test` |
| 21 | La visibilidad derivada cambia el OPL por OPD | Etapa 12: `informe.visibilidad` por OPD, en el diálogo de importación (como OPL) y en el informe de migración; el operador lo revisa en el ensayo (§9.4-4) | `codec-visibilidad.test` |

### 13.2 Ítems de SYNTHESIS §10.2 marcados FALTA, CONTRADICE, PARCIAL o N/A

| Req. | Estado previo | Mecanismo nuevo | Prueba |
|---|---|---|---|
| T-001 ★ | FALTA | `docs/conformidad.md` con Brechas exhaustivas (§11.3), `registro` en cada fila de código y la regla de AGENTS | revisión del diff |
| T-025 ★ | PARCIAL | `lexico.ts` valida al nombrar con error visible; ninguna operación ni el import reescriben nombres; la reparación es explícita (DS-7) | `lexico.test`, `codec.test`, e2e 4 |
| T-053 ★ | PARCIAL | R-ROL-UNIC-1 distributiva sobre ancestros y descendientes; el segundo gesto ofrece completar el cambio, un abanico o cambiar el tipo; en OPL, TS1+TS2 del mismo par dan `enlace-invalido-firma` con la acción «usa `cambia … de … a …`» | `matriz.test`, `editor-opl.test`, e2e 8 |
| T-060 ★ | CONTRADICE | R-DIST-1/AP-06/AP-21 en la matriz (lo cargado es error con reparación `distribuirEnlace`) + distribución 0→n + enlace tardío distribuido | `matriz.test`, `refinamiento.test` |
| T-062 ★ | CONTRADICE | `crearCosa`, `agregarEstado`, `agregarSubprocesos` y `agregarRefinadores` exigen nombre; in-zoom y despliegue sin semillas | `cosas.test`, e2e 4, 6, 11 |
| T-063 ★ | N/A (no existía) | `cambiarTipoCosa` + cierre DS-20 | `cosas.test` |
| T-074 ★ | FALTA | escisión 0→≥2, más DS-4 (con control o en abanico: entero) | `refinamiento.test`, e2e 11 |
| T-075 ★ | CONTRADICE | toda migración mueve el **mismo** enlace | `refinamiento.test` |
| T-079 ★ | FALTA | precondición `externo-no-refinable` | `refinamiento.test` |
| T-081 | FALTA | `traerCosa` y `moverApariciones` rebotan al externo con traza; el alcance es dato | `cosas.test`, e2e 11 |
| T-100 ★ | PARCIAL | `opdsEnPreorden` (DFS por `orden`) como única función de orden: panel, export y documento; lo que no está en ningún OPD se declara (B-26) y bloquea `canon-documento` | `proyeccion.test`, `generar.test`, `diagnostico.test` |
| T-101 ★ | FALTA | D6 con estados visibles y «y otros estados»; reconstrucción local por `sincronizar-estados` | `generar.test`, e2e 6 |
| T-116 ★ | CONTRADICE | IV2 `se invoca a sí mismo.` sin demora (el tipo no tiene demora, DECISIONS 21) | `generar.test` |
| T-125 ★ | PARCIAL | CX1 con `, en esa secuencia` solo en el bloque del hijo | `generar.test` |
| T-126 ★ | CONTRADICE | CX3 `se despliega en SDx en …` | `generar.test` |
| T-139 | CONTRADICE | los modos de esencia solo en líneas `soloDisplay` | `generar.test` |
| T-153 ★ | FALTA | el planificador crea por tipografía, una vez, y resuelve por `claveNombre` | `editor-opl.test`, `roundtrip-matriz.test` |
| T-155 ★ | PARCIAL | todo candidato pasa por la matriz; una violación da `type-mismatch` y `enlace-invalido-firma` con la regla | `analizar.test`, `editor-opl.test` |
| T-157 ★ | FALTA | `NO_CANONIZADAS` da `non-canonical` sin mutar, incluido `Pr=` fuera de abanico | `analizar.test` |
| T-158 ★ | PARCIAL | una tipografía contradictoria da `no-aplicable` con el detalle y dos acciones (renombrar la existente, otro nombre) | `editor-opl.test` |
| T-161 ★ | FALTA | plantilla COND-ALT (solo parseo) | `analizar.test` |
| T-165 | FALTA | TS3 sobre vacío crea el objeto (tipografía), sus estados y el efecto | `roundtrip-matriz.test` |
| T-166 ★ | CONTRADICE | `crear-refinamiento` + `fijar-orden` (crea los faltantes, fija las bandas); un miembro ajeno da `referencia-ambigua` | `editor-opl.test` |
| T-170 ★ | FALTA | SE1 residual (paso 5 del analizador) | `analizar.test` |
| T-182 ★ | PARCIAL | una sola codificación del efecto; idempotencia por identidad de enlace; comparación contra la vista | `editor-opl.test`, e2e 26 |
| T-192 ★ | PARCIAL | enumeración finita completa (2996 modelos,2734 importaciones estrictas reales) + `azar` (200) + tabla 9.2 + documento (pasadas A/B) | `roundtrip-*.test` |
| T-228 ★ | CONTRADICE | diagnóstico solo en su panel; `dibujar` no tiene capa de validación | `exportar.test`, e2e 18 |
| T-263 ★ | PARCIAL | un solo código `proceso-sin-transformacion` (warning) con herencia y subprocesos; se retira el duplicado `error` | `diagnostico.test` |
| T-268 ★ | CONTRADICE | la matriz no restringe la afiliación del manejador; `manejador-no-ambiental` es warning con reparación | `matriz.test`, `diagnostico.test`, e2e 23 |
| T-281 ★, T-283 ★ | PARCIAL | `canon-documento` HTML autocontenido con la fuente; gates >25, <2 y error, sin bloquear la edición (exención registrada, B-22) | `exportar.test`, e2e 19 |
| T-284 | PARCIAL | advertencias de cruces, atravesamientos y solapes en el menú antes de exportar (B-15) | `exportar.test` |

Los que el crítico encontró CUMPLE (T-080, T-162, T-164, T-171, T-172, T-175, T-241, T-246,
T-247, T-248, T-251, T-262, T-265) se conservan con prueba propia en su WP. T-262 queda como
diagnóstico `cosa-sin-aparicion` (DS-6), no como invariante.

## Verificación y continuidad del contrato

La documentación conserva las 32 decisiones y DS-1–26, las resoluciones de etiquetas,
sentido y mediana, y los límites de 180 requisitos ★, 32 brechas y diez parciales.
La revisión del Anexo A usa los 12 gates de AGENTS sobre el candidato y modelos reales;
T303/B-35 es ese examen manual, sin callback ficticio ni fila de catálogo.
La evidencia de cierre es el commit con check verde, build y 26 escenarios reales.
H3 exige revisión favorable, aceptación, publicación verificada y PR abierto, sin merge.
WP-18/imagen Docker requiere autorización aparte y no se incluye en H3.

La transferencia conserva cuerpos e IDs de pruebas existentes. Los controles mínimos
adicionales de trazabilidad (T014), lente (T164) y paneles (T242/T243) contrastan dato
derivado, TS4/TS5 standalone y realce/navegación por Ref con núcleo/controlador reales.
Su crédito es parcial: el montaje nativo no acredita DOM ni bisimetría universal.
Las referencias canónicas de T003 apuntan a canon/; el fallback del navegador conserva
PW_CHROMIUM explícito y usa chromium.executablePath() con el registro instalado.
Son precisiones operativas de dirección dentro del encargo, sin nueva regla OPM,
instalación ni autorización humana atribuida a otro actor.
