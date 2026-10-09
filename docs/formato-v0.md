# Formato JSON v0 y API HTTP

### 3.4 Códec `deep-opm-pro.modelo.v0`

#### 3.4.1 Contrato (`codec/*.ts`)

```ts
export interface Entrada { readonly ruta: string; readonly mensaje: string; readonly regla?: string }
      // ruta: "enlaces.e-19.multiplicidadOrigen"
export interface LineaDiff { readonly enlace?: Id; readonly abanico?: Id; readonly texto: string }
      // texto = describirEnlace(): "consumo: Pedido → Despachar"
export interface DiffVisibilidad {
  readonly opd: Id; readonly etiqueta: string;
  readonly aparecen: readonly LineaDiff[]; readonly desaparecen: readonly LineaDiff[];
}
export interface Informe {
  readonly normalizado: readonly Entrada[];   // transformación equivalente (no pierde hechos)
  readonly descartado: readonly Entrada[];    // información no representable: pérdida declarada
  readonly ignorado: Readonly<Record<string, number>>;   // campos visuales/derivables: ruta → conteo
  readonly rechazos: readonly Entrada[];      // el documento no se puede leer ⇒ no se importa
  readonly visibilidad: readonly DiffVisibilidad[];      // SYNTHESIS §8-21
}
export type ResultadoImport =
  | { readonly ok: true; readonly modelo: Modelo; readonly informe: Informe }
  | { readonly ok: false; readonly informe: Informe };        // informe.rechazos no vacío
export function importarV0(texto: string): ResultadoImport;   // puro y total: nunca lanza
export function exportarV0(m: Modelo): string;                // determinista, canónico
export function leerCanonico(texto: string): Respuesta<Modelo>;   // §3.4.4
export function revision(texto: string): Promise<string>;     // sha256 hex de los bytes UTF-8 (CAS)
export function informeVacio(i: Informe): boolean;            // normalizado = descartado = rechazos = [] ∧ visibilidad = []
export function resumen(m: Modelo): { readonly nombre: string; readonly cosas: number; readonly opds: number };
      // lo usa el servidor para su índice, sin importar nucleo/ (§2.2, CC-19)
export const ID_MODELO: RegExp;                               // /^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/ (CC-16)
```

Estas leyes se prueban sobre todos los fixtures y 200 modelos de `pruebas/azar.ts`:

- **Punto fijo**: `exportarV0(importarV0(exportarV0(m)).modelo) === exportarV0(m)`, con informe
  vacío.
- **Determinismo**: `exportarV0(m)` es igual en dos llamadas y `exportarV0(aplicar(m, [])) ===
  exportarV0(m)` (T-196).

#### 3.4.2 Etapas del importador (puras; acumulan todas las entradas; P8)

1. **Sobre.** `JSON.parse`; si falla, rechazo «JSON inválido». Acepta cuatro formas (CC-08):
   - `{formato:"deep-opm-pro.modelo.v0", modelo}`;
   - el registro persistido `{json: string, …}`, que se desenvuelve;
   - el sobre de recuperación `{format:"opforja.local-recovery.v1", document}`: se toma
     `document.snapshotJson` (la copia vigente); las ramas de `conflicts[]` van a `descartado` con su
     conteo y quedan en «Descargar original»;
   - el paquete portátil `{format:"opforja.portable-package", version:1, payload, integrity}`: se
     verifica el SHA-256 del `payload` (si no coincide, rechazo), se toma el `modelJson` de la
     revisión `manifest.selectedRevisionId` y el resto (otras revisiones, `sources`) va a
     `descartado` con conteo. El lector portátil no vuelve; solo se leen los paquetes existentes.

   Otro `formato` se rechaza (no se adivina). `carpetaId` del sobre va a `ignorado`.
2. **Colecciones.** `entidades`, `estados`, `enlaces`, `abanicos` y `opds` se aceptan como `Record`
   (v0) o como arreglo (bundles del Apéndice F); si faltan, quedan vacías. En un OPD, la clave
   `apariciones` se acepta como alias de `apariencias` (vocabulario del Apéndice F, `normalizado`).
   Es rechazo solo lo ambiguo **dentro** de una colección: dos elementos de un arreglo con el mismo
   `id`, o una clave de `Record` distinta de su `id`. Un mismo id en **dos colecciones distintas**
   (bundles externos que numeran por colección) no es ambiguo: se conserva en la primera por el
   orden `entidades, estados, enlaces, abanicos, opds` y se reasigna en las siguientes con un id
   nuevo `prefijo-N` tomado de la secuencia (§3.3), reescribiendo sus referencias (`normalizado`,
   CC-09).
3. **Referencias** (método F: rechazo, sin reparar). Cada referencia rota es un rechazo con su ruta:
   - estado a entidad; extremo a entidad o estado; `estadoEntradaId` y `estadoSalidaId`;
   - aparición a entidad y OPD; refinamiento a OPD; `opdRaizId`;
   - abanico a enlace (salvo derivados, etapa 8); escisión a su par; `ordenInzoom` a sus ids.

   **`padreId` no es rechazo** (compatibilidad con `normalizarModelo` de v0, que nunca rechaza el
   árbol, CC-07): un `padreId` colgante o autorreferente se trata como ausente (etapa 6,
   `normalizado`), y un ciclo de `padreId` se rompe tratando como ausente el `padreId` del OPD de
   menor id del ciclo (`normalizado`). Dos ranuras de refinamiento que apuntan al mismo OPD, o dos
   entidades que refinan el mismo OPD, conservan la primera por id cuya cosa aparece en ese OPD; las
   demás ranuras van a `descartado` (regla F-7).
4. **Cosas.**
   - `tipo` ausente o fuera de `objeto|proceso` es rechazo.
   - `esencia` o `afiliacion` ausentes toman el default (`normalizado`); con valor inválido, el
     default va a `descartado` con el valor original.
   - **El nombre se conserva tal cual**, salvo la forma NFC (`normalizado` si cambió). No se
     recorta, no se capitaliza ni se desambigua (DS-7): duplicados y nombres fuera del léxico se
     diagnostican (§4.4) y llevan su reparación sugerida.
   - `descripcion` y `genero` (`"f"`) se conservan.
   - `valorSlot.valor` pasa a `valor` (texto). `valorSlot` sin valor va a `ignorado`, y su `tipo`
     distinto de `string` a `descartado`. Un `valor` de un objeto que, tras la etapa 7, no es rasgo
     de ninguna exhibición va a `descartado` (regla T-020: sin exhibidor no hay oración VAL, CC-03).
   - `esAtributo` y `layoutEstados` van a `ignorado` (derivable y visual).
   - `alias`, `unidad`, `imagen`, `urls`, `simulacion`, `estereotipoId`, `anclaje`, `requisito`,
     `lineal` y `orderedFundamentalTypes` (marca `ordered`, extensión B-16: su pérdida se declara,
     CC-10) van a `descartado`.
   - `duracion` de proceso se conserva si pasa F-10; si no, va a `descartado`.
5. **Estados.**
   - Si el dueño es un proceso, el estado va a `descartado` (AP-12), y cada referencia a él se
     resuelve en la etapa 7 como «anclaje descartado».
   - Orden: `orden` si todos lo tienen; si no, el sufijo numérico del id; si no, el orden de
     aparición.
   - El nombre queda tal cual (NFC).
   - Designaciones: `esInicial`/`esFinal` **o** `designaciones` ∋ `inicial`/`final` (la unión; los
     duplicados van a `normalizado`). `default` o `porDefecto` pasan a `porDefecto` del objeto; si
     hay más de uno, se conserva el primero por orden y el resto va a `descartado`. `current` igual.
     `suprimido` se conserva.
   - `duracion` de estado va a `descartado`; `x/y/width/height`, a `ignorado`.
   - Un objeto con un solo estado es válido (R-OBJ-2).
6. **OPDs.** La raíz es `opdRaizId`. Todo otro OPD se clasifica:
   - **Refinamiento de proceso o de cosa por despliegue.** Una entidad lo apunta en
     `refinamientos.descomposicion|despliegue`; la forma legacy `refinamiento:{tipo, opdId, modo?}`
     va a `normalizado`. Sin `despliegue.modo`, se usa `agregacion` (`normalizado`).
   - **Descomposición de objeto** (DS-18).
     - Si el objeto no tiene despliegue, se convierte en `OpdDespliegue{modo:'agregacion'}` que
       conserva todas las apariciones y posiciones. **No crea enlaces**. Va a `normalizado`, regla
       DR-23, con la lista de objetos del OPD que no son partes por agregación («no se creó ningún
       enlace; revisa si son partes»).
     - Si ya tiene despliegue, el OPD va a `descartado` con sus apariciones.
   - **Boceto** (`padreId: null` sin ser raíz), **huérfano** (con padre, pero ninguna entidad lo
     refina) o **vista** (`vista` presente). El OPD va a `descartado`, con el conteo de apariciones.
     **Sus cosas, estados y enlaces siguen en el modelo** y pueden quedar sin aparición (DS-6,
     diagnóstico `cosa-sin-aparicion`).
   - Un OPD de refinamiento cuyo padre fue descartado se recuelga del primer OPD, en preorden, que
     conserve una aparición de su cosa (`normalizado`). Si no hay ninguno, se descarta igual, de
     forma recursiva.
   - Un OPD que refina la cosa refinada de uno de sus ancestros (ciclo de refinamiento, R-REF-1) va
     a `descartado` con su subárbol, como un OPD no representable (DS-18): sus hechos siguen en el
     modelo (CC-24).
   - **Padre** = `padreId`. Si falta (o la etapa 3 lo anuló), es la raíz, como en v0
     (`normalizado`, CC-07). Si el padre no muestra la cosa refinada, se le agrega una aparición en un
     hueco libre (`colocar`, `normalizado`).
   - Orden entre hermanos: `ordenLocal` si todos lo tienen y es único; si no, el orden natural de
     ids (`normalizado`).
   - **Bandas** (descomposición):
     - Con `ordenInzoom`, se filtra a procesos internos y se completa con los internos faltantes
       en bandas nuevas al final, ordenadas por Y (`normalizado`).
     - Sin él, se derivan de la geometría (porte de `agruparSubprocesosParalelos`): internos por la
       `y` del borde superior, misma banda si |Δy| ≤ 4 px (`normalizado`).
   - **Internos**: se leen de `contextoRefinamiento.rol` (`contorno` es el contenedor; `interno`;
     `externo`). Sin contexto, se usa el porte de `aparienciaEsInternaDeRefinamiento`: dentro del
     bbox del contorno y sin aparición en el padre (`normalizado`). Un interno que aparece fuera de
     su subárbol pasa a externo (`normalizado`, A3.3).
   - **Apariciones**:
     - Una duplicada en el OPD conserva la de menor id (`normalizado`, DR-25).
     - Las coordenadas se redondean a entero y un tamaño < 20 pasa a 135×60 (`normalizado`).
     - `estadosSuprimidos` pasa a `ocultos`, filtrado a estados propios.
     - `ports`, `modoTamano`, `modoPlegado`, `ordenPartes`, `parteExtraidaDe` e `id` van a
       `ignorado`. `preguntaGuia` y un `nombre` de OPD que no sea etiqueta automática
       (`^SD[\d.]*$`) van a `descartado`.
   - **Apariciones de enlace** (`opds[].enlaces[*]`): `id`, `enlaceId` y `opdId` se reconocen (son
     la entrada de la etapa 12); `vertices`, `symbolPos`, `symbolAnchors` y `labelPositions` van a
     `ignorado` con su conteo (geometría: los procedimentales son rectos, T-225). Nunca caen en
     «campo desconocido», que las mandaría a `descartado` y haría responder 422 al servidor (CC-10).
7. **Enlaces.** Un extremo `string` pasa a `{kind:"entidad", id}` (`normalizado`). Un enlace cuyos
   extremos no calzan con la firma, tras el mapeo, va a `descartado` entero con su regla: consumo
   invertido, objeto→objeto o estructural reflexivo. Por tipo v0:
   - **`consumo`, `agente`, `instrumento`**: el origen es un objeto o su estado y el destino un
     proceso ⇒ `{objeto, proceso, estado?}`.
   - **`resultado`**: el origen es un proceso y el destino un objeto o su estado.
   - **`efecto`** tiene una sola codificación interna:
     - el compacto `P→O` con `estadoEntradaId`/`estadoSalidaId` da T3, TS3, TS4 o TS5;
     - un extremo estado da `entrada` si es `estado→P` y `salida` si es `P→estado`;
     - `O→P` entre entidades es la rama v0 y da T3 (la dirección no es semántica);
     - `efectoEscindido{grupoId, rol, modo:"par"}` con compañero pone `escision{par, mitad}` en
       ambos; `modo:"standalone"`, o un grupo de un solo miembro, queda sin escisión
       (`normalizado`); `enlacePadreId` va a `ignorado`.
   - **Par v0 consumo(estado s₁) + resultado(estado s₂)** sobre el mismo (objeto, proceso), sin que
     ninguno sea rama de un abanico **y sin `ruta` ni multiplicidad en ninguno** (la fusión solo se
     hace si no pierde nada, CC-11). Se fusiona en un `efecto` TS3 con el id del consumo,
     `entrada = s₁` y `salida = s₂`. El control del consumo pasa al efecto. Queda en `normalizado`
     (SYNTHESIS §8-19, tabla 9.2) y registra el **alias** `id del resultado → id del consumo`, que
     usan las etapas 8, 9 y 12. Si alguno lleva ruta o multiplicidad (TS3–TS5 no tienen hueco, DR-19 y
     DR-44), **no se fusiona**: ambos se cargan tal cual y quedan como `enlace-invalido`
     (R-ROL-UNIC-1), error recuperable que decide el operador (P8).
     **Excepción de documento directo canónico (CC-11, autorizada por coordinación de Félix):**
     antes de la fusión C+R se construye un candidato que conserva ambos enlaces, sus tipos,
     ids y contexto recuperable. Solo se reconoce si `validarForma(candidato)` es vacía,
     no hay pérdidas (`descartado`), rechazos ni diff sustantivo de visibilidad, y la entrada
     v0 **DIRECTA completa** coincide en sus bytes **EXACTAMENTE** con
     `exportarV0(candidato)`. En ese caso se conservan los dos hechos y no se aplica la
     fusión legacy. El reconocimiento no elimina pérdidas, rechazos, diferencias de
     visibilidad ni información ignorada. No añade campos ni marcadores al formato v0.
     Reformatear o envolver el documento sigue la ruta legacy ordinaria y puede fusionarlo;
     en los sobres persistido, de recuperación y portátil rigen las reglas ordinarias.
     Esta excepción estructural se realiza antes de fusionar, no mediante limpieza posterior
     del Informe, y queda ligada a la ley de §3.4.4.
   - **`invocacion`** (se admite origen = destino) y **`excepcionSobretiempo|Subtiempo`** conservan
     su tipo.
     - `tiempoMaximo`/`tiempoMinimo` con su unidad pasan a `duracion.max|min` de la fuente
       (`normalizado`, R-EXC-2/3). La unidad v0 (`ms|s|min|h|dia|sem|mes|año` y variantes canónicas)
       se lleva al enum; un valor no numérico va a `descartado`.
     - Si dos cotas de la misma fuente chocan, se conserva la primera y la otra va a `descartado`.
     - `excepcionSubSobretiempo` da dos enlaces: sobretiempo con el id original y subtiempo con
       `<id>~sub` (`normalizado`).
   - **Estructurales fundamentales**: origen = refinable y destino = refinador.
     - Una **generalización con estado en ambos extremos**, sobre objetos, da
       `estados{general, especializacion}` (DS-8).
     - Con estado en un solo extremo, o en agregación, exhibición o clasificación, el **anclaje** va
       a `descartado` y el enlace se conserva (R-OPL-RF-3, matriz §2.1).
   - **`etiquetado`**: `etiqueta` vacía da SE2; los estados en los extremos pasan a
     `estadoOrigen/Destino`.
   - **`etiquetadoBidireccional`**:
     - con `backwardTag === etiqueta` (ambas vacías incluidas) pasa a `reciproco` (`normalizado`,
       R-STRE-1);
     - con exactamente una vacía, da dos `etiquetado` opuestos (`normalizado`, DS-13);
     - un estado solo en el destino, o un estado de destino en un bidireccional con etiquetas
       distintas, va a `descartado` como anclaje (V-30, AP-11).
   - **`modificador`** `condicion|evento` pasa a `c|e`. Si falta y `subtipoModificador` es `C|E`,
     igual (`normalizado`). **`"no"`** manda el **enlace entero** a `descartado` (DS-19).
     `subtipoModificador` va a `ignorado`. Un control en un tipo sin control (AP-01/02) o en una
     mitad escindida (AP-08) va a `descartado`.
   - **Multiplicidad**:
     - `?` y `0..1` dan `?`; `*`, `0..*` y `0..N` dan `*`; `+`, `1..*` y `1..N` dan `+`; `1` y
       `1..1` quedan ausentes.
     - Un entero de 2 a 999999 (texto o número) se conserva y `n..n` da `n`; `2..*` se conserva y
       `2..N` da `2..*` (DEC35).
     - Otro valor, como `0` o `2..5`, va a `descartado` (DR-21), igual que una multiplicidad en un
       extremo ilegal (proceso, todo).
     - Una multiplicidad que `noOfrecido` rechaza va a `descartado` (DR-44): junto a `c`, en efecto
       con estados o en etiquetado con estado.
   - **`rutaEtiqueta`** pasa a `ruta` en consumo y resultado (también en ramas de abanico, DS-10).
     En otro tipo va a `descartado` (DR-19).
   - Una `etiqueta` no vacía en tipos no etiquetados va a `descartado`.
   - `probabilidad`, `demora`, `tasa`, `unidadesTasa`, `requisitos` y `mostrarRequisitos` van a
     `descartado`; `grupoEstructuralId` y `portId`, a `ignorado`.
8. **Derivados v0** (`derivado.tipo = "enlace-externo-refinamiento"`), ya resuelta la estructura de
   refinamiento:
   - **`origen:"automatico"`** (o ausente) es una proyección materializada: se descarta
     (`ignorado`) y el enlace padre se ubica donde el canon lo pone:
     - consumo, evento de objeto sistémico y TS4, en el primer subproceso (el del derivado, si
       existe);
     - resultado y TS5, en el último;
     - TS3 sin control y fuera de abanico, en la escisión (el padre queda como mitad de entrada y el
       derivado de salida como la otra). Si el TS3 viene de la fusión consumo+resultado, los
       derivados del consumo y del resultado dan la mitad de entrada (id del consumo) y la de salida
       (id del resultado);
     - TS3 con control o en abanico, en el primero, entero;
     - agente, instrumento y efecto simple, en el contorno.

     Todo va a `normalizado`.
   - **`origen:"manual"`** es un reanclaje del modelador: el padre toma el extremo del derivado y
     conserva su id. Si hay varios, el primero reancla el padre y los demás quedan como enlaces
     propios con su id (`normalizado`).
   - Un derivado huérfano va a `descartado`.
   - Esta etapa es **mapeo de datos**, no aplicación de reglas: solo mueve extremos a donde los
     derivados indican. No llama a la distribución de §4.5.3 (que vive en `nucleo/refinamiento.ts`,
     WP-4r). Lo que queda en el contorno contra el canon (un consumo sin derivado, un TS3 sin
     derivados) se **carga** y lo marca `diagnosticar` como error con reparación `distribuirEnlace`,
     que el Informe ofrece en «Aplicar N reparaciones» (P8, CC-21).
   - **Enlaces idénticos repetidos** (DEC33): v0 copiaba el mismo hecho en varios OPD. Tras los
     derivados, un enlace igual a otro anterior en todo salvo el id se elimina y su id queda como
     alias del primero (`normalizado`, R-ROL-UNIC-1). No se funden ramas de abanico ni mitades de
     escisión; un enlace que difiere en estado, control, multiplicidad o ruta no es idéntico.
9. **Abanicos.**
   - `operador` `O` pasa a `OR`; `XOR` queda igual.
   - **Abanicos derivados** (CC-26): v0 proyectaba el abanico del padre en cada OPD hijo como otro
     abanico persistido, con ramas `derivado` y `puertoComun.portId = "port-fan-ref-…"`
     (`proyectarAbanicosExternosDerivados`). Un abanico cuyas ramas son todas `derivado`, o que tras
     mapear cada rama a su `enlacePadreId` repite las ramas de otro abanico, es proyección: va a
     `ignorado` (nunca a `descartado`, que falsearía una pérdida y haría responder 422).
   - `enlaceIds` pasa a `enlaces`. Se retiran los ids de enlaces descartados; con menos de 2 ramas,
     el abanico va a `descartado`. Un enlace en dos abanicos se queda en el primero (`normalizado`).
   - `puertoComun`, `puertoEntidadId` y `opdId` son derivados: no se informan si coinciden con lo
     derivado; si difieren, van a `normalizado`, o al diff de la etapa 12 en el caso de `opdId`.
   - `decision` va a `descartado`.
   - Las violaciones de contexto se **cargan**: tipos mixtos, sin extremo común, control mixto.
   - Un abanico que cae en `NO_OFRECIDO` (extremo común en estado, control sin plantilla o efecto sin plantilla; B-06, B-08) va a
     `descartado` y sus enlaces se conservan.
   - **Regla de cierre de F-5**: toda combinación que `noOfrecido` rechace se descarta en su mínimo
     elemento (el campo, el anclaje o el abanico), con informe. Esto incluye el recíproco sin
     etiqueta con estados (B-05), cuyos anclajes van a `descartado`.
10. **Modelo.**
    - `secuencia` según §3.3; `unidadTiempo` ausente toma `min` (`normalizado`); `descripcion` se
      conserva.
    - Van a `descartado`, una entrada por campo con conteo: `ontologia`,
      `satisfaccionesRequisito`, `declaracionesNoNucleares`, `familiasEfectosPreestado`,
      `anclasNormativas`, `notasMesa`, `mesaExploracion`, `estereotipos`, `procedencia`,
      `fichaTrabajo`, `lentesConocimiento`, `submodelos`, `pieceLineage` y
      `referenciaPadreSubmodelo`.
    - Van a `ignorado`: `archivado`, `archivadoEn`, `versiones` y `crearVersionAlGuardar`.
    - Toda clave desconocida va a `descartado` como «campo desconocido» (patrón
      `collectUnrepresented`).
11. **Cierre.** `validarForma(modelo)` debe ser vacía. Una violación residual es un error del
    importador: en pruebas y en desarrollo lanza; en producción da rechazo «error interno del
    importador», con las violaciones. Nunca se guarda un modelo sin forma.
12. **Diff de visibilidad** (SYNTHESIS §3.9-14 y §8-21). Definición exacta (CC-12), para cada OPD
    `o`, con `V = proyectar(modelo, o)`:
    - `v0(o)` = los ids de `opds[o].enlaces[*].enlaceId`, tras mapear reasignaciones (etapa 2),
      alias de fusión (etapa 7) y derivados (etapa 8, cada derivado a su `enlacePadreId`);
    - `directos(o)` = los `hechos` de las `EnlaceVisto` con `abstraido === false`;
    - `abstraidos(o)` = los `hechos` de las `EnlaceVisto` con `abstraido === true`;
    - **desaparecen** = `v0(o) − (directos(o) ∪ abstraidos(o))`;
    - **aparecen** = `directos(o) − v0(o)` (lo abstraído nunca «aparece»: el export solo lista lo
      directo, y v0 listaba el enlace original en el padre, que aquí queda abstraído);
    - **abanicos**: un abanico con `opdId = o` «desaparece» si no se ve en `o` **y** la regla de
      `opdId` del export (§3.4.3) no elegiría `o`; nunca se informa que un abanico «aparece» (el v0
      le da un solo OPD y aquí se ve en todos los que muestran sus ramas).

    Las diferencias van a `informe.visibilidad` con `describirEnlace`. Como `exportarV0` escribe
    `opds[o].enlaces = directos(o)` y `abanicos[].opdId` con la misma regla que consulta el diff, un
    v0 exportado por este mismo códec da diff vacío por construcción (lo exige el punto fijo).

#### 3.4.3 Forma exacta emitida por `exportarV0`

- Mismas claves y valores del núcleo v0 donde el concepto existe. Hay campos nuevos solo donde v0
  no tiene concepto (DR-41): `unidadTiempo`, `genero`, `duracion` y `coleccionIncompleta`.
- **Cotas de excepción también en el enlace** (CC-13): v0 guarda la cota en el enlace
  (`tiempoMaximo`/`unidadTiempoMaximo` en sobretiempo, `tiempoMinimo`/`unidadTiempoMinimo` en
  subtiempo) y así la leen los consumidores externos y el stack viejo en un rollback. El export las
  **deriva** de `duracion.max|min` de la fuente (valor como texto; unidad v0: `ms`→`ms`, `sec`→`s`,
  `min`→`min`, `hour`→`h`, `day`→`dia`, `week`→`sem`, `month`→`mes`, `year`→`año`). El importador
  las reconoce como derivadas y no las informa cuando coinciden con la duración de la fuente; si
  difieren, rige la etapa 7.
- Los opcionales se omiten cuando valen su default; `etiqueta` está siempre presente (`""`).
- Los `Record` se ordenan por id en orden natural (`o-2` < `o-10`) y las claves de cada objeto en el
  orden fijo mostrado. Las coordenadas son enteros.
- La salida es `JSON.stringify(doc, null, 2) + "\n"`.

```jsonc
{ "formato": "deep-opm-pro.modelo.v0",
  "modelo": {
    "id": "m-3f9a1c0d2b7e", "nombre": "Despacho", "descripcion": "…", "unidadTiempo": "sec",
    "opdRaizId": "opd-1", "nextSeq": 42,
    "entidades": {
      "o-3": { "id": "o-3", "tipo": "objeto", "nombre": "Pedido", "esencia": "informacional",
               "afiliacion": "sistemica", "descripcion": "…", "genero": "f",
               "valorSlot": { "tipo": "string", "placeholder": "value", "valor": "12" },
               "coleccionIncompleta": ["agregacion"] },
      "p-4": { "id": "p-4", "tipo": "proceso", "nombre": "Despachar", "esencia": "fisica", "afiliacion": "sistemica",
               "duracion": { "min": 1, "esperada": 3, "max": 5, "unidad": "min" },
               "refinamientos": { "descomposicion": { "opdId": "opd-2" },
                                  "despliegue": { "opdId": "opd-5", "modo": "agregacion" } } } },
    "estados": {
      "s-5": { "id": "s-5", "entidadId": "o-3", "nombre": "pendiente", "orden": 0,
               "esInicial": true, "designaciones": ["default"] },
      "s-6": { "id": "s-6", "entidadId": "o-3", "nombre": "listo", "orden": 1, "esFinal": true, "suprimido": true } },
    "enlaces": {
      "e-7":  { "id": "e-7", "tipo": "consumo", "origenId": { "kind": "estado", "id": "s-5" },
                "destinoId": { "kind": "entidad", "id": "p-4" }, "etiqueta": "",
                "modificador": "condicion", "multiplicidadOrigen": "+", "rutaEtiqueta": "L1" },
      "e-8":  { "id": "e-8", "tipo": "efecto", "origenId": { "kind": "entidad", "id": "p-9" },
                "destinoId": { "kind": "entidad", "id": "o-3" }, "etiqueta": "", "estadoEntradaId": "s-5",
                "efectoEscindido": { "grupoId": "e-8", "enlacePadreId": "e-8", "rol": "entrada", "modo": "par" } },
      "e-10": { "id": "e-10", "tipo": "agregacion", "origenId": { "kind": "entidad", "id": "o-3" },
                "destinoId": { "kind": "entidad", "id": "o-12" }, "etiqueta": "", "multiplicidadDestino": "*" },
      "e-11": { "id": "e-11", "tipo": "generalizacion", "origenId": { "kind": "estado", "id": "s-20" },
                "destinoId": { "kind": "estado", "id": "s-31" }, "etiqueta": "" },          // especialización de estado
      "e-13": { "id": "e-13", "tipo": "etiquetadoBidireccional", "origenId": { "kind": "entidad", "id": "o-3" },
                "destinoId": { "kind": "entidad", "id": "o-14" }, "etiqueta": "colaboran", "backwardTag": "colaboran" } },
    "abanicos": { "f-12": { "id": "f-12", "opdId": "opd-1",
                            "puertoComun": { "entidadId": "p-4", "lado": "destino", "portId": "puerto-f-12" },
                            "puertoEntidadId": "p-4", "operador": "XOR", "enlaceIds": ["e-7", "e-15"] } },
    "opds": {
      "opd-1": { "id": "opd-1", "nombre": "SD", "padreId": null,
                 "apariencias": { "a-opd-1-o-3": { "id": "a-opd-1-o-3", "entidadId": "o-3", "opdId": "opd-1",
                                  "x": 120, "y": 80, "width": 135, "height": 60, "estadosSuprimidos": ["s-6"] } },
                 "enlaces": { "ae-opd-1-e-7": { "id": "ae-opd-1-e-7", "enlaceId": "e-7", "opdId": "opd-1", "vertices": [] } } },
      "opd-2": { "id": "opd-2", "nombre": "SD1", "padreId": "opd-1", "ordenLocal": 0,
                 "ordenInzoom": [["p-9"], ["p-14", "p-15"]],
                 "apariencias": { "a-opd-2-p-4": { "…": "…", "contextoRefinamiento":
                                  { "tipo": "descomposicion", "refinableEntidadId": "p-4", "rol": "contorno" } } },
                 "enlaces": { } } } } }
```

Mapeos de salida:

| Interno | v0 |
|---|---|
| `Consumo`, `Agente`, `Instrumento` | `origenId` = objeto (`kind:"estado"` si hay `estado`), `destinoId` = proceso, `multiplicidadOrigen` = `mult` |
| `Resultado` | `origenId` = proceso, `destinoId` = objeto (o su estado), `multiplicidadDestino` |
| `Efecto` | **siempre compacto**: `origenId` = proceso, `destinoId` = objeto (entidad), `estadoEntradaId`, `estadoSalidaId`, `multiplicidadDestino`; `escision` ⇒ `efectoEscindido{grupoId = enlacePadreId = id de la mitad de entrada, rol, modo:"par"}` |
| `Invocacion`, `Excepcion` | `origenId` = origen, `destinoId` = destino; en excepciones, además la cota derivada de la fuente (`tiempoMaximo`/`unidadTiempoMaximo` o `tiempoMinimo`/`unidadTiempoMinimo`, CC-13) |
| `Agregacion` · `Exhibicion` · `Generalizacion` · `Clasificacion` | `origenId` = refinable, `destinoId` = refinador; agregación `mult` ⇒ `multiplicidadDestino`; `Generalizacion.estados` ⇒ ambos extremos `kind:"estado"` |
| `Etiquetado` | extremos con `kind:"estado"` si están anclados; `multiplicidadOrigen/Destino`; `etiqueta` (`""` = SE2) |
| `Bidireccional` | `etiquetadoBidireccional`, `etiqueta`, `backwardTag` = `inversa` |
| `Reciproco` | `etiquetadoBidireccional` con `backwardTag === etiqueta` (`""` y `""` si no hay etiqueta) |
| `control` | `modificador` `evento` / `condicion` |
| `Operador` `OR` | `"O"` |
| `porDefecto` · `current` | `designaciones:["default"]` / `["current"]` en ese estado (orden `default, current`) |
| `inicial` · `final` | `esInicial` · `esFinal` (nunca duplicados en `designaciones`) |
| Refinamientos | `entidades[*].refinamientos` derivado de los OPDs; `contextoRefinamiento` solo en OPDs de descomposición (`contorno`, `interno`, `externo`) |
| Visibilidad | `opds[o].enlaces` = `proyectar(m, o).enlaces` directos (hechos subyacentes con `abstraido === false`) |
| Abanico | `opdId` = primer OPD (preorden) donde es visible; si no lo es en ninguno, el primero donde se ve alguna rama o, en su defecto, la raíz; `puertoComun{entidadId: extremo común, lado, portId:"puerto-<id>"}`, `puertoEntidadId` |
| Nombre de OPD | `nombre` = etiqueta `SDx.y` |

#### 3.4.4 Punto fijo y lector estricto

- El reconocimiento previo a fusión C+R de §3.4.2-7 conserva los hechos de un v0 DIRECTO
  canónico completo: exige forma válida, ausencia de pérdidas/rechazos/diff sustantivo e
  igualdad íntegra EXACTA de bytes contra el export del candidato que conserva ambos
  enlaces. Mantiene sus tipos, ids y contexto recuperable; no elimina evidencia ni añade
  marcadores. La versión reformateada o envuelta sigue la ruta legacy ordinaria y puede
  fusionarse. Esta consecuencia de representación fue documentada en el
  contrato de implementación; la excepción no modifica canon ni DECISIONS 1–28 ni formato v0.
- Lo que el export deriva (`opds[].enlaces`, `apariencias[].id`, `opds[].nombre`,
  `efectoEscindido.enlacePadreId`, `abanicos[].opdId|puertoComun|puertoEntidadId`, `refinamientos`,
  las cotas `tiempoMaximo|tiempoMinimo` de las excepciones) el importador lo **reconoce y no lo
  informa**. Por eso `importarV0(exportarV0(m)).informe` es vacío.
- Compatibilidad: el documento emitido satisface los tipos v0 actuales (`etiqueta` siempre, abanico
  con sus tres campos, `refinamientos` en plural). Las diferencias observables para un lector v0
  antiguo (el stack viejo en un rollback, §9.4) son estas (CC-13):
  - admite objetos con **un** estado y la multiplicidad `?`;
  - no emite `ports`, `symbolAnchors`, `labelPositions` ni `x/y` de estado;
  - emite la especialización de estado como generalización entre estados;
  - admite enlaces sin aparición en ningún OPD y cosas sin aparición (DS-6), que el lector viejo
    rechaza («todo enlace tiene al menos una apariencia»);
  - admite, como errores cargados, lo que el lector viejo rechazaba en la frontera: agente desde
    objeto informacional y manejador de excepción sistémico (T-268 es advertencia);
  - el lector viejo descarta en silencio los campos nuevos (`duracion`, `unidadTiempo`, `genero`,
    `coleccionIncompleta`); las cotas de excepción sobreviven porque también van en el enlace.

  Queda declarado en `docs/formato-v0.md`.
- `leerCanonico(texto)` hace `importarV0` y exige tres cosas: `ok`, `informeVacio(informe)` y
  `exportarV0(modelo) === texto`. Lo usa el servidor en cada escritura para decidir si guarda los
  bytes recibidos (§8.1). El almacén **tiende** a contener solo documentos canónicos, pero un cambio
  futuro del códec puede dejar archivos que ya no son punto fijo de la versión nueva. Por eso nadie
  exige `leerCanonico` para **leer** (CC-14):
  - el servidor, al arrancar, solo mueve a `archivo/invalidos/` lo que no pasa `JSON.parse` o da
    `importarV0(...).ok === false`; un archivo legible pero no canónico sigue sirviéndose tal cual;
  - el cliente, al abrir, usa `importarV0`. Si `leerCanonico` falla pero el import es `ok` sin
    `descartado`, abre y marca «Cambios sin guardar» (el próximo guardado canonicaliza). Si hay
    `descartado`, muestra antes el Informe de importación con «Abrir de todos modos»; el primer
    guardado de ese modelo va con `?respaldo=1`, así el original queda en la papelera y nada se
    pierde en silencio.
  - la restauración de papelera también importa antes de canonicalizar (§8.1). Los rechazos o
    descartes conservan la entrada intacta y se informan; un histórico sin descartes puede
    restaurarse canónico con su Informe completo y un respaldo exacto del original.

---

### 8.1 Rutas HTTP exactas — CONTRATO

Formato común de todas las respuestas:

- Las respuestas JSON llevan `Content-Type: application/json; charset=utf-8` y `Cache-Control:
  no-store`.
- **Toda** respuesta lleva `X-Opforja-Version: <OPFORJA_VERSION>`.
- Un error se responde como `{ "error": string, "detalle"?: unknown, "informe"?: Informe }`.

En la columna Auth, **sesión** es una cookie válida **o** `Authorization: Bearer <OPFORJA_TOKEN>`
(§8.2). «+ CSRF» aplica solo a la cookie. Esta API, junto con el JSON v0, es el **contrato externo
completo** (DECISIONS 13): no hay CLI `mesa` ni protocolo de testigo.

| Método y ruta | Auth | Petición | Respuestas |
|---|---|---|---|
| `GET /salud` | no | — | `200 {"ok":true,"version":"<sha>"}` |
| `GET /api/sesion` | sesión | — | `200 {"email"}` · `401` |
| `POST /api/sesion` | no | `{"email","clave"}` (≤ 4 KB) | `204` + `Set-Cookie` · `401 {"error":"Credenciales inválidas"}` · `429 {"error":"Demasiados intentos","reintentarEn":s}` |
| `DELETE /api/sesion` | cookie + CSRF | — | `204` (borra la cookie); con Bearer ⇒ `400` |
| `GET /api/modelos` | sesión | — | `200 {"modelos":[{"id","nombre","modificado","rev","bytes","cosas","opds"}]}` (por `modificado` desc) |
| `POST /api/modelos` | sesión + CSRF | cuerpo = documento v0; `?aceptarPerdidas=1` opcional | `201 {"id","rev","canonicalizado"?,"informe"?}` · `400 {"error":"Documento inválido","informe"}` (rechazos) · `409` (id existe) · `413` · `422 {"error":"El documento pierde información al importarse","informe"}` · `507` (>2 000 modelos) |
| `GET /api/modelos/:id` | sesión | `?descargar=1` opcional | `200` cuerpo = documento + `ETag: "<rev>"`; con `descargar=1` además `Content-Disposition: attachment; filename="<nombre saneado>.opforja.json"` · `404` |
| `PUT /api/modelos/:id` | sesión + CSRF | `If-Match: "<rev>"` obligatoria; cuerpo = documento con `modelo.id === :id`; `?aceptarPerdidas=1`, `?respaldo=1` opcionales | `200 {"rev","canonicalizado"?,"informe"?}` · `400` · `404` · `412 {"error":"Revisión desactualizada","rev":"<actual>"}` · `413` · `422` · `428` (sin If-Match) |
| `DELETE /api/modelos/:id` | sesión + CSRF | `If-Match` opcional | `204` (a papelera) · `404` · `412` |
| `GET /api/papelera` | sesión | — | `200 {"entradas":[{"entrada","id","nombre","eliminado","motivo":"eliminado"|"reemplazado"}]}` |
| `POST /api/papelera/:entrada/restaurar` | sesión + CSRF | — | `201 {"id","rev","canonicalizado"?,"informe"?}` (con id ocupado se asigna `m-…` nuevo y se reescribe `modelo.id`) · `400` (rechazos con informe, o límite de nombre) · `404` · `413` · `422` (pérdidas, con informe; conserva la entrada) · `507` |
| `DELETE /api/papelera/:entrada` | sesión + CSRF | — | `204` (definitivo) |
| `GET /*` | no | — | estáticos de `OPFORJA_WEB`; toda ruta sin extensión da `index.html` (`no-store`); `/assets/*` inmutables por 1 año |

Reglas de las rutas:

- **`rev`** es el SHA-256 hexadecimal del texto almacenado: CAS por contenido, sin contadores.
- **Ids de modelo** (CC-16): `:id` y `modelo.id` deben cumplir `ID_MODELO` (§3.3); un `:id` que no
  la cumple da `404` sin tocar el disco, y un `POST` cuyo `modelo.id` no la cumple da `400`. Así
  ninguna ruta escapa de `modelos/` ni choca con los temporales `.tmp-*`.
- **El almacén solo guarda documentos canónicos**. Un cuerpo recibido se trata así:
  1. Si `leerCanonico` lo acepta, se guardan los bytes recibidos. Es el camino del cliente web, que
     siempre envía `exportarV0`.
  2. Si no, pasa por `importarV0`:
     - con `rechazos`, responde `400`;
     - con `descartado` no vacío, responde `422` con el informe, salvo `?aceptarPerdidas=1`;
     - en otro caso, guarda `exportarV0(modelo)` y responde con `"canonicalizado": true`, la `rev`
       de lo guardado y el informe.

  Así un agente externo con el token puede escribir un v0 válido sin reproducir el formateo exacto,
  y ninguna pérdida ocurre en silencio (DECISIONS 12–13). Los errores de canon (diagnóstico) **no**
  impiden guardar (T-288).
- **Restaurar papelera** importa el texto original antes de exportarlo. Con `rechazos` responde
  400; con `descartado` no vacío responde 422. En ambos casos devuelve el Informe completo y
  conserva la entrada original intacta (bytes, nombre y fecha), sin instalar un modelo ni crear
  respaldo. Esta ruta no admite `aceptarPerdidas`: recuperar un original con descartes exige el
  procedimiento operativo y el flujo de importación ya previsto. Si no hay rechazos ni descartes,
  restaura canónico; si la fuente no pasaba `leerCanonico`, responde con `canonicalizado: true`
  y su Informe original completo, incluida visibilidad, y conserva los bytes exactos como
  respaldo `motivo:"reemplazado"` con la retención de 30 días de §8.3. Ese respaldo queda durable
  antes de retirar la entrada fuente; ningún fallo elimina la única copia original. Restaurar
  una fuente canónica mantiene el flujo actual, incluida la reescritura de id ocupado. El mutex
  de entrada, el de id y el cupo coordinado siguen aplicando; no se promete una transacción
  multidirectorio ni se ocultan errores de escritura. Los nombres de respaldo se coordinan con
  todos los productores de papelera para no sobrescribir originales. Los límites comunes de
  tamaño, nombre y cupo se comprueban sobre el candidato canónico a instalar: nombre > 200
  caracteres da 400 con error e Informe original cuando haya recanonicalización, sin inventar
  un rechazo del códec. Los errores 400/413/507 por límites no instalan un modelo ni retiran la
  entrada fuente. Esto no añade un límite al tamaño del histórico que CC-14 permite leer.
- **`?respaldo=1`** (conflicto «Conservar mis cambios», §8.4). Dentro del mutex, antes de escribir,
  mueve el archivo vigente a la papelera con `motivo:"reemplazado"`.
- **Renombrar** desde la Biblioteca no tiene ruta propia: es `GET`, `renombrarModelo`, `exportarV0`
  y `PUT` con `If-Match`. Hay una sola vía de escritura.
- **Límites**: cuerpo ≤ 25 MB (`413`); ≤ 2 000 modelos (`507`); nombre de modelo ≤ 200
  caracteres.
- **Seguridad**. Todas las respuestas llevan estas cabeceras (HSTS lo pone Traefik):
  - `Content-Security-Policy: default-src 'self'; img-src 'self' data: blob:; style-src 'self';
    font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors
    'none'`;
  - `X-Content-Type-Options: nosniff`;
  - `Referrer-Policy: no-referrer`;
  - una `Permissions-Policy` restrictiva.

### 8.2 Autenticación de una cuenta

- **Cuenta**: `/datos/cuenta.json` = `{"email", "hashClave", "versionCredencial"}`. `hashClave` usa
  el formato `scrypt$16384$8$1$<sal>$<hash>`, porte exacto de `passwordHash.ts`, así que la
  migración copia el hash actual sin pedir la clave.
- **CLI** (`servidor/cuenta.ts`, en el contenedor):
  - `bun servidor/cuenta.js crear <email>` pide la clave dos veces por stdin (≥ 10 caracteres) y
    falla si ya existe una cuenta;
  - `clave` cambia la clave y sube `versionCredencial`, lo que cierra las sesiones;
  - `cerrar-sesiones` sube `versionCredencial`.

  Todas aceptan `--datos <dir>`.
- **Sesión**: la cookie es `opforja_sesion=<b64url({"v":versionCredencial,"exp":epoch})>.<b64url(HMAC-SHA256)>`,
  con `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000` (30 días; `Secure` se omite solo
  en `localhost`). Se verifica en tiempo constante; un `v` distinto del de la cuenta da 401.
- **Login**: siempre se verifica contra un hash, el de la cuenta o un señuelo, para igualar el
  costo, y la respuesta es uniforme. Cinco fallos por IP (según `X-Forwarded-For` de Traefik) en 15
  min dan 429 por 15 min; 20 fallos globales en 15 min dan 429 global.
- **CSRF**: toda petición que muta **con cookie** exige la cabecera `X-Opforja: 1`. Si viene
  `Origin`, debe coincidir con el host; si no, 403.
- **Token Bearer opcional** (DECISIONS 13):
  - Sin `OPFORJA_TOKEN`, toda cabecera `Authorization` da 401.
  - Si existe, se compara con `timingSafeEqual(sha256(t), sha256(OPFORJA_TOKEN))`.
  - Un token válido actúa como la cuenta en `/api/modelos*` y `/api/papelera*`, sin CSRF porque no
    es una credencial ambiente.
  - No sirve para `/api/sesion` ni para cambiar la clave.
  - Los fallos cuentan para el límite de intentos.
  - En el log se registra `auth:"bearer"`, nunca el token.

## Uso externo con token

El operador configura OPFORJA_TOKEN en el proceso; no se guarda en el modelo ni en
el repositorio. Los valores de este ejemplo son variables proporcionadas fuera
 del repositorio, no credenciales suministradas por la documentación.

```sh
curl -H "Authorization: Bearer $OPFORJA_TOKEN" "$OPFORJA_URL/api/modelos"
curl -H "Authorization: Bearer $OPFORJA_TOKEN" \
  -H 'Content-Type: application/json' --data-binary @modelo.opforja.json \
  "$OPFORJA_URL/api/modelos"
```

Para PUT use el ETag vigente en If-Match. Un 422 es una pérdida declarada: examine
el Informe y conserve el original; no active aceptarPerdidas automáticamente.
La autenticación, CAS y el punto fijo se comprueban en pruebas reales; esta guía
no autoriza conectarse a una instalación ni efectuar migraciones.

Los números §3.4/§8.1/§8.2 se conservan del contrato de diseño para interpretar
sus referencias históricas; las decisiones actuales prevalecen y están en
[decisiones.md](decisiones.md). Las diez parciales se documentan en
[conformidad.md](conformidad.md#bisimetrías-parciales).
