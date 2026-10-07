# Guía de uso

### 7.1 Layout

**Escritorio (≥ 1100 px)**. A 1440×900 el lienzo ocupa ≥ 70 % y el lienzo más el OPL, ≥ 95 %.

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ ≡  Despacho ✎   SD › SD1 Despachar ▾        ● Guardado      ⛔2 ⚠5     ↶ ↷    Exportar ▾   ?   ⎋ │ 40 px
├──┬─────────────────────────────────────────────────────────────────────┬──────────────────────────┤
│OP│ ▭ Objeto  ⬭ Proceso  ◻ Estado  ⟶ Enlace                              │ PROPIEDADES              │
│Ds│                                                                     │ ⬭ Despachar · proceso    │
│  │                                                                     │ Física ◻  Ambiental ◻    │
│▸ │                     (lienzo SVG, cámara viewBox)                    │ Duración  mín · esp · máx│
│  │                                                                     │ Enlaces (6) ▸            │
│  │                                                                     ├──────────────────────────┤
│  │                                                                     │ OPL │ Diagnóstico (7)    │
│  │                                                                     │ ## SD                    │
│  │                                                                     │ *Despachar* consume …    │
│  │ ✓ Descomponer *Despachar* · 3 ajustes ▸                  − 100 % + ⤢│ [Editar] esencia▾ # ⌕    │
└──┴─────────────────────────────────────────────────────────────────────┴──────────────────────────┘
 32 px (riel; ≥1600 px: árbol abierto 220 px)                                400 px (redimensionable)
```

- **Cabecera única**:
  - ≡ vuelve a la Biblioteca;
  - el nombre del modelo se renombra con un clic;
  - la ruta de OPD navega con clic, y su ▾ abre el árbol como emergente cuando el riel está
    plegado;
  - un **indicador de guardado** único;
  - los contadores de diagnóstico (clic abre la pestaña);
  - deshacer y rehacer, Exportar, Ayuda y Salir.
- **Columna izquierda**: el árbol de OPDs. Por defecto es un riel de 32 px bajo 1600 px de ancho y
  está abierto (220 px) desde 1600. `Ctrl+\` lo alterna.
- **Columna derecha** (400 px, redimensionable, se recuerda en `localStorage`):
  - **Propiedades** arriba, con alto automático y a lo sumo el 50 %. Se abre con la selección.
  - Debajo, las pestañas **OPL | Diagnóstico**.
  - `Ctrl+.` pliega la columna (con `Ctrl+\` también plegado queda solo el lienzo; no hay un tercer
    conmutador «solo lienzo», CC-05). El panel OPL minimizado no se
    renderiza (T-247).
- **Sobre el lienzo** hay dos cosas: la paleta flotante de 4 verbos (arriba a la izquierda) y el
  zoom (abajo a la derecha).
- **Franja** (una línea al pie del lienzo, `aria-live`). Es el único canal de respuesta de las
  operaciones:
  - «✓ <etiqueta de la acción> · N ajustes ▸», donde ▸ despliega las trazas;
  - «✕ <mensaje> (<regla>). <acción>»;
  - «Deshecho: <acción>»;
  - los modos `navegacion` y `estatico`.

  Persiste hasta la siguiente operación. No es una superficie.

**Estrecho (< 1100 px)**. Es la misma aplicación, con una zona visible y pestañas inferiores.

```
┌──────────────────────────────────────┐
│ ≡ Despacho   SD1 ▾      ● Guardado ⋯ │ 40 px (⋯ = deshacer, rehacer, Exportar, Ayuda, Salir)
├──────────────────────────────────────┤
│   zona activa: Lienzo | OPL |        │
│   OPDs | Propiedades | Diagnóstico   │
│ ✓ franja                             │
├──────────────────────────────────────┤
│  Lienzo   OPL   OPDs   Propiedades ⛔2│ 48 px
└──────────────────────────────────────┘
```

No hay desplazamiento horizontal de página: el lienzo tiene cámara propia y el panel OPL ajusta
línea en lectura. Tocar, arrastrar y pellizcar para el zoom funcionan sin un modo especial (el
modo móvil de solo lectura queda fuera).

### 7.2 Superficies (inventario cerrado: 14)

| # | Superficie | Tipo | Por qué existe |
|---|---|---|---|
| 1 | Acceso | pantalla (y diálogo de reingreso) | una cuenta (DECISIONS 8) |
| 2 | Biblioteca | pantalla | lista simple (DECISIONS 7): nuevo, abrir, renombrar, eliminar a papelera y restaurar, importar, descargar |
| 3 | Editor: lienzo | pantalla | OPD (T-252) |
| 4 | Árbol de OPDs | panel | navegar el árbol (T-031, T-252) |
| 5 | Propiedades | panel | esencia, afiliación, estados, designaciones, control, etiquetas, ruta, multiplicidad, duración e incompleta; sección «Enlaces (N)» en lugar de una tabla de enlaces (DECISIONS 10) |
| 6 | OPL (lectura y edición) | panel | bimodalidad activa (T-240, T-241) y editor OPL |
| 7 | Diagnóstico | pestaña del 6 | la validación vive fuera del lienzo (T-228, T-260) |
| 8 | Menú de tipo de enlace | menú | solo tipos legales, con motivo, segundo gesto y vista previa OPL (T-040, T-253) |
| 9 | Menú contextual | menú | verbos de la selección, derivados del registro de comandos (descubribilidad) |
| 10 | Exportar | menú | perfiles canónicos, JSON y OPL, con gates y advertencias (T-280–T-286) |
| 11 | Decisión | diálogo genérico | confirmaciones destructivas, conflicto, borrador y eliminar refinamiento |
| 12 | Buscar (`Ctrl+K`) | diálogo | cosas y OPDs por nombre: ir o traer (DECISIONS 10, R-OPD-UI-1). No ejecuta comandos |
| 13 | Informe de importación | diálogo | normalizado, descartado, ignorado, rechazos, visibilidad y reparaciones (T-287, DECISIONS 12) |
| 14 | Ayuda | diálogo | atajos (generados del registro) y leyenda visual |

Los elementos en línea no cuentan como superficies: la edición de nombre en la figura, la franja y
las guías de banda. No hay paleta de comandos, pestañas de modelos, cintas ni tabla de enlaces.

### 7.3 Flujos

«↵» es Enter y «⎋» es Escape. Toda acción rechazada muestra en la franja la regla y la acción
canónica (P7), y toda acción se deshace en un paso.

1. **Entrar.**
   1. `/` sin sesión (`GET /api/sesion` → 401) lleva a Acceso: correo, clave y «Entrar».
   2. El error es uniforme: «Credenciales inválidas». Un 429 muestra «Demasiados intentos; espera N
      minutos».
   3. El éxito lleva a la URL pedida (`#/m/<id>/<opd>`) o a la Biblioteca.
   4. **Sesión vencida durante la edición** (401 al guardar): Acceso aparece como diálogo sobre el
      editor. Mientras tanto, el lienzo queda en modo `navegacion` y el borrador conserva todo. Al
      entrar se reintenta el guardado pendiente.
2. **Biblioteca.** Es una lista ordenada por modificación: nombre, «hace 2 h» y `262 cosas · 36
   OPDs`. Tiene un filtro de texto (`/`). Acciones por fila:
   - **Abrir**: clic o ↵.
   - **Renombrar**: `F2` o `⋯ › Renombrar`. Es edición en línea: el cliente hace `GET`,
     `renombrarModelo`, `exportarV0` y `PUT` con `If-Match`.
   - **Descargar**: `⋯ › Descargar JSON`, que hace `GET ?descargar=1`.
   - **Eliminar** (`Supr`): una Decisión «Mover *X* a la papelera (se conserva 30 días)». La sección
     «Papelera (N)» tiene **Restaurar** y **Eliminar definitivamente**. Restaurar muestra el
     Informe completo si recanonicaliza; ante 400/422 muestra el rechazo o la pérdida y mantiene
     la entrada. No ofrece aceptar pérdidas desde esta acción; la recuperación del original por
     el procedimiento operativo y su importación mantienen el flujo de informe de §7.3-3. Ante
     error de red o 5 xx se refrescan Biblioteca y Papelera; no se repite automáticamente el POST,
     porque la escritura puede haberse instalado aunque la respuesta fallara.
   - **Nuevo** (`N`): pide el nombre en línea, crea el modelo con `crearModelo`, lo sube con `POST`
     y lo abre.
3. **Importar** (botón, `I` o soltar un archivo).
   1. Un `.json` (documento v0, registro `{json}`, recuperación local o paquete portátil) pasa por
      `importarV0` en el cliente. Un `.md` o `.txt` pasa por `importarOpl` (§5.7). El modelo recibe
      siempre un `m-…` nuevo (§3.3, CC-16).
   2. Se abre el **Informe de importación**. Muestra:
      - un resumen: cosas, estados, enlaces y OPDs;
      - las secciones plegables «Normalizado (N)», «Descartado (N)» (con «Descargar original»),
        «Ignorado» (conteos), «Visibilidad por OPD» (DiffVisibilidad, cada línea en OPL, compuesta
        por `ui`) y «Errores del canon cargados (N)» (`diagnosticar` del resultado, T-288);
      - «Rechazos», si los hay, sin botón de crear.
   3. Si hay diagnósticos con `reparacion`, se ofrece la casilla **«Aplicar N reparaciones sugeridas
      antes de crear»**, desmarcada por defecto. Lista cada una: «renombrar **Pedido** (2.º) →
      **Pedido-2**», «migrar consumo de **Agua** a *Hervir*» (DS-7).
   4. «Crear modelo» hace `POST` y lo abre. Un `.json` con `descartado` no vacío conserva su original
      descargable desde el informe hasta cerrar el diálogo (DECISIONS 12).
4. **Crear objeto o proceso.**
   1. `O` o `P`, o clic en la paleta y luego en el lienzo. Aparece la figura en el cursor (o al
      centro de la vista, en un hueco libre) con el campo de nombre en foco. `Tab` alterna entre
      objeto y proceso.
   2. La validación léxica es en vivo. Si solo falla la mayúscula inicial, se ofrece «↵ usar
      **Pedido**» (sugerencia explícita, T-025).
   3. ↵ crea; `Mayús+↵` crea y abre otro campo 100 px debajo; ⎋ no crea nada (T-062).
   4. Si el nombre existe, la bandeja dice «Ya existe **Pedido** (objeto, en SD y SD2). ↵ Traer esa
      misma cosa aquí · Tab cambiar nombre · ⎋ descartar». Si el existente es de otro tipo, solo se
      puede cambiar el nombre o descartar (T-065, método §9.15).
   5. Dentro de un contenedor de descomposición, un proceso nuevo entra como subproceso en la banda
      bajo el cursor y un objeto como interno.
5. **Esencia y afiliación.**
   - Con la cosa seleccionada, `Mayús+F` alterna física/informacional y `Mayús+A`,
     sistémica/ambiental. También están los conmutadores de Propiedades y el menú contextual.
   - La sombra y el dash aparecen al instante, junto con D1/D3 en el OPL (T-240).
   - Volver ambiental un exhibidor propaga a sus rasgos: «3 rasgos pasaron a ambientales (R-OBJ-6)».
   - Pasar a informacional un objeto que es agente se rechaza con R-AG-1 (DS-20).
6. **Estados y designaciones.**
   - Con un objeto seleccionado, `S` abre una cápsula fantasma con el nombre en foco. ↵ crea un
     estado y termina; ⎋ no crea (DECISIONS 18: uno por gesto, siempre con nombre). Un objeto puede
     tener un solo estado (R-OBJ-2).
   - Con un estado seleccionado:

     | tecla | acción |
     |---|---|
     | `I` | inicial |
     | `F` | final |
     | `D` | por defecto, que reemplaza al anterior con traza |
     | `H` | ocultar en este OPD |
     | `Mayús+H` | ocultar en todos |
     | `←` `→` | reordenar |
     | `F2` o doble clic | renombrar |
     | `Supr` | eliminar; si tiene enlaces, una Decisión: «Los 2 enlaces anclados a `pagado` quedarán sobre **Pedido**» |

   - `Current` se marca desde Propiedades o el menú contextual.
   - No se puede ocultar un estado enlazado donde se ve (LF-03, `estado-enlazado`).
   - El chip `⋯N` muestra los estados ocultos; un clic en él ofrece «Mostrar estados ocultos».
7. **Crear enlace.**
   1. Al pasar sobre una cosa o una cápsula aparece su ancla de conexión: un rombo crimson, distinto
      de toda piruleta (R-DEC-2A).
   2. Se arrastra el ancla hasta otra cosa o cápsula. Los destinos con ≥1 tipo legal se realzan, y
      los demás se atenúan con `×` (T-253).
   3. Al soltar se abre el **menú de tipo** (`tiposLegales`):

      ```
      ┌ **Agua** en `fría` → *Hervir* ──────────────────────────────┐
      │ 1  consumo      *Hervir* consume **Agua** en `fría`.        │ ◀ último usado para este par
      │ 2  efecto       *Hervir* cambia **Agua** de `fría`.         │
      │ 3  instrumento  *Hervir* requiere **Agua** en `fría`.       │
      │ ─ desde *Hervir* ─                                           │
      │ 4  resultado    *Hervir* genera **Agua** en `fría`.         │
      │ ▸ 9 tipos no disponibles                                     │
      └ ↑↓ · 1–9 · ↵ · Tab otra orientación · ⎋ ────────────────────┘
      ```

      - Cada vista previa de una opción completa es la línea del resultado efectivo del ensayo
        que emitirá el generador real (`lineaDeEnlace`). Una pendiente muestra los datos requeridos.
      - «N no disponibles» se despliega con los motivos, por ejemplo «agente: solo desde objeto
        físico (AP-05)».
      - La fila resaltada al abrir es el último tipo usado para ese par de clases y orientación
        (`localStorage`).
   4. **El segundo gesto** usa la `alternativa`:
      - si existe el TS4 «*Pagar* cambia **Pedido** de `pendiente`.» y se arrastra de *Pagar* a
        `pagado`, la primera fila es «Completar cambio: de `pendiente` a `pagado`»;
      - si ya hay un resultado a `aprobado` y se arrastra otro a `rechazado`, aparecen «Abanico XOR
        con el existente» y «Abanico OR…», y la fila simple queda bloqueada con su motivo;
      - si hay un consumo y se intenta un instrumento, la fila bloqueada dice «Ya existe consumo
        entre **Agua** y *Hervir* (un procedimental por par, T-053)» y ofrece «Cambiar tipo del
        existente».
   5. ↵ o un dígito confirma la opción: una completa aceptada crea el enlace; una pendiente abre
      sus campos antes de insertar. Al confirmar datos se reevalúa el mismo gesto/sentido y solo
      `legal === true` permite creación. ⎋ cancela sin acción, id ni cambio de modelo.
      La línea creada se resalta 2 s en el OPL.
   6. Si el proceso está descompuesto, la franja informa la migración: «migrado a *Recibir*
      (R-DIST-1)».
   7. **Por teclado**: con una cosa o un estado seleccionado, `R` entra al modo enlace («Enlace desde
      **Agua**: elige destino · Tab/flechas · escribe un nombre · ⎋»).
      - `Tab` recorre solo los destinos legales.
      - Escribir busca en el lugar y ofrece al final «Crear objeto «Leche»» / «Crear proceso
        «Leche»». La cosa nueva se coloca con objeto arriba y proceso abajo (R-OPD-LAY-9).
      - ↵ abre el menú de tipo.
8. **Control e/c.**
   - Con un enlace seleccionado, `E` o `C` alternan evento o condición; la letra se ve en el lienzo
     y el OPL pasa a E\*/C\*. También está el selector de Propiedades: «ninguno · evento ·
     condición».
   - Donde no aplica, el selector aparece deshabilitado con el motivo: resultado, invocación,
     excepción, estructural, mitad escindida, o `c` con multiplicidad («combinación sin plantilla,
     DR-44»).
9. **Etiquetas, ruta y multiplicidad.**
   - Al seleccionar un etiquetado se abre el editor de etiqueta en el punto medio antes de
     persistir. El bidireccional tiene dos campos (`Tab`); el recíproco con estados requiere una
     etiqueta. Confirmar vuelve a consultar con los datos; cancelar conserva el modelo. Dos
     etiquetas válidas no vacías e iguales se normalizan mediante creación a recíproco con traza
     R-STRE-1. Unidireccional y recíproco sin estados admiten etiqueta ausente.
   - La ruta se edita en Propiedades (solo en consumo y resultado).
   - La multiplicidad por extremo legal se rota con `M` en el extremo objeto o refinador, y con
     `Mayús+M` en el origen de los etiquetados, en el orden —, `?`, `*`, `+`. Propiedades muestra la
     frase OPL al lado.
   - El género (Propiedades de la cosa) decide `un/una`.
   - Doble clic en una etiqueta del lienzo la edita en línea.
10. **Abanicos XOR/OR.**
    - Con ≥2 enlaces seleccionados (`Mayús+clic`), `X` forma un XOR y `Mayús+X` un OR. También
      están en el menú contextual y en Propiedades («N elementos»). Si `violacionesAbanico` o
      `noOfrecido` fallan, quedan deshabilitados con el motivo.
    - Aparece el arco en el extremo común y la oración con `exactamente uno de` / `al menos uno de`.
    - Un clic en el arco selecciona el abanico. Propiedades muestra el operador, las ramas, «Control
      de todas las ramas» (solo las combinaciones con plantilla) y «Disolver» (vuelve a AND).
      Con el abanico seleccionado, `X` alterna el operador.
11. **Descomponer y bandas.**
    1. Con un proceso seleccionado, `D` (o el menú «Descomponer»). `descomponer` crea **ya** el OPD
       hijo, con el contenedor y los externos colocados y **sin subprocesos semilla** (DECISIONS
       18), navega a él y abre el campo de nombre dentro del contenedor, en la banda 1.
    2. Se escribe `Recibir ↵ Validar ⇧↵ Verificar ↵ Despachar ⎋`: ↵ pasa a la banda siguiente
       (secuencia) y ⇧↵ queda en la misma banda (paralelo). Cada nombre confirmado queda como
       fantasma con su nombre real, nunca como placeholder.
    3. ⎋, o ↵ con el campo vacío, ejecuta **una** `agregarSubprocesos` con todos los nombres. Eso
       dispara la distribución 0→n y la escisión (DS-3, DS-4). La franja informa «consumo →
       *Recibir* · resultado → *Despachar* · TS3 escindido».
    4. `descomponer` y ese `agregarSubprocesos` comparten `gesto`, así que se deshacen en **un**
       paso (SYNTHESIS §8-10).
    5. Si se pulsa ⎋ sin nombres, la descomposición queda vacía: `refinamiento-trivial` advierte
       hasta que haya ≥2 subprocesos, y el gate bloquea el export.
    6. Más subprocesos: `P` dentro del contenedor (uno por gesto, en la banda bajo el cursor) o `N`
       con el contenedor seleccionado (reabre el campo encadenado).
    7. **Reordenar**:
       - arrastrar un subproceso en vertical muestra las guías de banda: soltar sobre una banda lo
         pone en paralelo y soltar entre bandas crea una banda nueva;
       - `[` y `]` lo mueven a la banda anterior o siguiente; `Mayús+[` y `Mayús+]` crean una banda
         nueva antes o después;
       - el arrastre horizontal queda confinado al contenedor;
       - el OPL (CX) se actualiza al soltar.
    8. Si el primer o el último subproceso cambian después, los enlaces no se mueven (T-076). La
       franja lo recuerda una vez: «Los enlaces siguen donde estaban; arrastra su extremo para
       reasignarlos».
12. **Desplegar por modo.**
    1. `U` (o el menú «Desplegar ▸ Agregación · Exhibición · Generalización · Clasificación», con
       las teclas `1`–`4`).
    2. Se abre el OPD hijo con la cosa arriba y sus hijos estructurales directos de ese modo.
    3. Un campo de nombre encadenado crea refinadores nuevos (↵ siguiente, ⎋ termina), cada uno con
       su enlace estructural. En exhibición, `Tab` alterna entre atributo (objeto) y operación
       (proceso).
13. **Colección incompleta.**
    - Con el triángulo seleccionado, `I` o la casilla de Propiedades: se ofrece en agregación,
      exhibición y generalización, nunca en clasificación. Se ve la barra bajo el triángulo y «… y
      al menos otra parte».
    - Si un OPD muestra solo parte de los refinadores, la marca aparece sola, con la nota
      `ajuste-automatico`.
14. **Navegar el árbol.**
    - Clic en un nodo del árbol o de la ruta.
    - ↵ o doble clic en una cosa refinada entra a su refinamiento; si tiene ambos, un menú
      «Descomposición / Despliegue».
    - `Alt+↑` sube al padre; `Alt+←/→` va al hermano anterior o siguiente. Atrás y Adelante del
      navegador recorren los OPDs visitados.
    - Siempre se encuadra el bbox (DS-22). Si la cosa seleccionada aparece en el destino, sigue
      seleccionada.
15. **Buscar y traer** (`Ctrl+K`).
    - Se escribe parte del nombre (sin distinguir mayúsculas ni acentos) y aparecen hasta 20
      resultados: cosas («**Pedido** · objeto · SD, SD2») y OPDs («SD2.1 · despliegue de
      **Pedido**»).
    - Sobre una cosa, ↵ la trae aquí y `⇧↵` va a ella: navega a su primer OPD en preorden y la
      selecciona. Sobre un OPD, ↵ navega.
    - Traer crea la aparición en un hueco libre del OPD activo; es la misma cosa (T-248). Sus
      enlaces con cosas visibles aparecen solos.
    - Un interno de otra descomposición no se puede traer (motivo A3.3). Es el camino para las
      cosas con `cosa-sin-aparicion`.
16. **Quitar ≠ eliminar** (T-251).
    - `Supr` quita de este OPD: la aparición desaparece y la franja dice «**Agua** quitada de SD1
      (sigue en el modelo) · Ctrl+Z». Si era la última: «**Agua** ya no aparece en ningún OPD (sigue
      en el modelo; Buscar › Traer)».
    - El contenedor y los internos no se pueden quitar; el motivo va en la franja.
    - `Mayús+Supr` elimina del modelo, con una Decisión que lista lo que se pierde: apariciones en N
      OPDs, enlaces y estados.
    - Si la cosa tiene refinamientos, se rechaza: «**Cocinar** tiene refinamiento (SD1). Elimina
      primero su refinamiento» (DS-5), con el botón «Ir a SD1».
    - Los textos de quitar y eliminar son distintos y nunca se confunden.
17. **Reanclar** (DS-9).
    - Al seleccionar un enlace o una rama del peine aparecen asas cuadradas crimson en sus extremos.
    - Arrastrar un asa a otra cosa o cápsula del OPD aplica `reanclarExtremo`, que conserva el id y
      valida con la matriz; si no es legal, `×` y el motivo en la franja.
    - Soltar el asa del objeto en una de sus cápsulas cambia el anclaje (T1 → TS1). Soltarla en otro
      subproceso reasigna un consumo o un resultado migrado (T-250).
18. **Duración.**
    - En Propiedades de un proceso: mín, esperada, máx y unidad (`ms…year`), con validación en vivo
      (F-10). Se ve `[min] {1, 3, 5}` en la elipse.
    - Crear una excepción sobre una fuente sin la cota exigida abre el campo con el aviso «R-EXC-2:
      define la duración máxima o se escribirá “su duración máxima”». Es canónico condicionado:
      pide el dato o advierte, nunca inventa (T-047).
19. **Editar OPL y aplicar** (§5.8). Tras aplicar, las líneas nuevas o cambiadas se resaltan 2 s por
    `LineaOpl.id`. Reabrir el editor sin tocar muestra «Sin cambios aplicables».
20. **Hover y clic bimodal** (T-242–T-245).
    - Pasar sobre un token del OPL realza su elemento en el lienzo (`paperWarm`, capa UI), y pasar
      sobre una cosa, un estado o un enlace realza sus tokens. El vínculo es la `Ref` o el `hecho`,
      nunca el texto. El panel **no** se desplaza con el hover (foco estable).
    - Un clic en un token selecciona y encuadra el elemento, navegando si está en otro OPD, sin
      mutar nada.
    - Seleccionar en el lienzo desplaza el panel a la primera línea del bloque actual que lo
      contiene.
    - «Filtrar por selección» (⌕) muestra solo las líneas con refs de la selección: primero el
      enlace, luego la cosa, y todo si no hay selección.
21. **Diagnóstico.**
    - La pestaña tiene contador y tres grupos: Bloqueos (error), Advertencias y Notas. El OPD actual
      va primero.
    - Cada ítem muestra el mensaje, la regla, la acción canónica e «Ir» (navega y selecciona).
    - Si tiene `reparacion`, también «Aplicar». Un grupo del mismo código con reparación ofrece
      «Aplicar a los N» (una `aplicarAcciones`, un paso de deshacer).
    - El lienzo queda limpio (T-228).
22. **Exportar** (`Exportar ▾`). Ofrece:
    - «Diagrama SVG de SD1 (canon-diagrama)», con «⚠ 3 cruces, 1 oclusión · Ver» si los hay;
    - «Documento HTML (canon-documento)»;
    - «OPL Markdown»;
    - «Modelo JSON».

    Si hay gate, el ítem aparece deshabilitado con los motivos («SD1 tiene 1 subproceso (AP-13) ·
    Ir»).
23. **Deshacer y rehacer.**
    - `Ctrl+Z` y `Ctrl+Mayús+Z` (o `Ctrl+Y`), con 200 pasos por modelo abierto.
    - Cada operación, cada «Aplicar» del OPL, cada «Aplicar a los N» y cada descomposición con
      nombres encadenados es un paso.
    - Deshacer **vuelve al OPD donde ocurrió** y restaura la selección. La franja dice «Deshecho:
      Descomponer *Cocinar*».
24. **Guardado y conflicto** (§8.4).
    - El indicador muestra «Guardado», «Cambios sin guardar», «Guardando…», «Sin conexión: guardado
      en este navegador», «Conflicto», «Sesión vencida», «No se pudo guardar» o «Versión nueva: recarga». `Ctrl+S` guarda
      ya.
    - En **conflicto** (412), el lienzo pasa a `navegacion` y aparece la Decisión «Otra sesión
      guardó este modelo a las 14:02»:
      - **[Conservar mis cambios]** sobrescribe, y la versión reemplazada va a la papelera;
      - **[Usar la versión guardada]** guarda la mía como modelo nuevo «Despacho (copia 14:05)» y
        carga la del servidor.

      Nada se pierde.
    - Si al abrir hay un **borrador** más nuevo, la Decisión dice «Hay cambios de este navegador sin
      subir (hace 3 min)» y ofrece [Recuperarlos], [Descartarlos] o [Descargar].
25. **Selección múltiple** (DECISIONS 22, mínima, sin portapapeles).
    - `Mayús+clic` agrega o quita una cosa o un enlace; ⎋ o un clic en vacío limpia la selección.
    - Con ≥2 cosas, arrastrar cualquiera mueve todas: es una `moverApariciones` y un paso de
      deshacer (los subprocesos, solo en horizontal). Las flechas mueven todas.
    - `Supr` con≥2 cosas pide una Decisión para quitar sus apariciones, conservando
      los hechos. `Mayús+Supr` pide eliminar del modelo y lista sus pérdidas.
    - Con ≥2 enlaces, se puede formar un abanico (flujo 10) o eliminarlos con `Supr`.
    - Propiedades muestra «N elementos» con solo esas acciones. No hay alinear, distribuir, copiar ni
      pegar.
26. **Enlaces de una cosa**, en Propiedades («Enlaces (N)»; reemplaza la tabla de enlaces).
    - Tiene una fila por enlace con el tipo, el otro extremo, el estado y los OPDs donde se ve
      (`SD, SD1`), agrupadas como el OPL.
    - Un clic en la fila selecciona el enlace, navegando si no se ve aquí. `Supr` en la fila lo
      elimina.
27. **Eliminar refinamiento**: se ofrece en el menú contextual del refinado o del nodo del árbol,
    solo si es hoja. La Decisión lista lo que se elimina, lo que se pierde y lo que se conserva en
    el padre (§4.5.6).
28. **Cambiar tipo**:
    - de cosa, con el conmutador de Propiedades, que se rechaza listando lo que impide el cambio
      (T-063);
    - de enlace, con ↵ sobre el enlace o sus ramas, que abre el menú para el mismo par
      y conserva el id. Tipo, sentido y etiquetas se confirman en una sola transacción
      y un deshacer; cancelar no cambia el modelo. Enter activa la opción o botón enfocado.

### 7.4 Atajos (registro único `editor/comandos.ts`; la Ayuda los lista)

Las letras solas actúan solo con el foco en el lienzo, el árbol o el panel, nunca dentro de un
campo de texto. No se usan atajos que reserva el navegador (`Ctrl+W/T/N/Tab/1…9`). La rueda
desplaza; `Ctrl`+rueda o pellizcar hace zoom multiplicativo de 10 %, anclado al cursor, entre 0,2 y
3. `overscroll-behavior: none`.

| Contexto | Tecla | Acción |
|---|---|---|
| global | `Ctrl+K` | buscar cosa u OPD (ir / traer) |
| global | `Ctrl+E` | editar el OPL del OPD activo |
| global | `Ctrl+Z` · `Ctrl+Mayús+Z` / `Ctrl+Y` · `Ctrl+S` | deshacer · rehacer · guardar ahora |
| global | `Alt+↑` · `Alt+←/→` | OPD padre · hermano anterior/siguiente |
| global | `Ctrl+0` · `+` · `−` · `Espacio`+arrastre | encuadrar · zoom · desplazar |
| global | `Ctrl+\` · `Ctrl+.` · `F9` | árbol · columna derecha · vista canon |
| global | `?` · `⎋` | ayuda · cancelar gesto → cerrar → deseleccionar |
| lienzo | `O` · `P` | crear objeto · proceso (en el cursor) |
| cosa | `F2` · `↵` / doble clic | renombrar · entrar al refinamiento (si no tiene, renombrar) |
| cosa | `R` · `S` (objeto) | modo enlace · nuevo estado |
| cosa | `D` (proceso) · `U` · `N` (contenedor o refinable) | descomponer · desplegar · nombres encadenados |
| cosa | `Mayús+F` · `Mayús+A` | física ↔ informacional · sistémica ↔ ambiental |
| cosa | `Supr` · `Mayús+Supr` | quitar de este OPD · eliminar del modelo |
| cosa | flechas · `Mayús`+flechas | mover 1 px · 10 px |
| subproceso | `[` `]` · `Mayús+[` `Mayús+]` | banda anterior/siguiente · banda nueva antes/después |
| estado | `I` · `F` · `D` · `H` · `Mayús+H` · `←/→` · `F2` · `Supr` | inicial · final · por defecto · ocultar aquí · en todos · reordenar · renombrar · eliminar |
| enlace | `E` · `C` · `M` · `Mayús+M` · `↵` · `Supr` | evento · condición · multiplicidad objeto/refinador · multiplicidad origen · cambiar tipo · eliminar |
| ≥2 enlaces | `X` · `Mayús+X` | abanico XOR · OR |
| abanico | `X` · `Supr` | alternar operador · disolver |
| triángulo | `I` · `↵` | colección incompleta · agregar refinador |
| modo enlace | `Tab` · letras · `↵` · `⎋` | siguiente destino legal · buscar o crear destino · menú de tipo · cancelar |
| editor de nombre | `↵` · `Mayús+↵` · `Tab` · `⎋` | confirmar · confirmar y otro (cosas; no en estados, DECISIONS 18) · alternar objeto/proceso (al crear) · cancelar |
| nombres encadenados | `↵` · `⇧↵` · `⎋` | banda siguiente · misma banda · terminar |
| menú de tipo | `↑↓` · `1`–`9` · `↵` · `Tab` | elegir · directo · crear · otra orientación |
| editor OPL | `Ctrl+Enter` · `Ctrl+↓/↑` · `⎋` | aplicar · siguiente/anterior no aplicable · salir |
| biblioteca | `/` · `↑↓` · `↵` · `N` · `I` · `F2` · `Supr` | buscar · recorrer · abrir · nuevo · importar · renombrar · eliminar |

En pantalla, los atajos se muestran según la plataforma (`Ctrl` o `⌘`). `comandos.test.ts` falla si
hay dos comandos con la misma tecla en el mismo contexto.

### 7.5 Estado vacío, errores y accesibilidad

- **OPD vacío**: al centro, «Crea un objeto (O) o un proceso (P)», con los dos botones. No hay
  asistente ni pregunta metodológica (A1.1).
- **Biblioteca vacía**: «Aún no hay modelos», con Nuevo e Importar.
- **Errores**:
  - Un rechazo de operación va a la franja, con la regla y la acción (P7).
  - Un error de red pasa el indicador a «Sin conexión» y el trabajo sigue en el borrador.
  - Un error inesperado de render de un OPD deja en el lienzo «No se pudo dibujar este OPD», con
    «Copiar detalle» (versión, OPD, pila; nunca el contenido del modelo). El resto de la app sigue,
    porque hay un límite de error por panel.
- **Accesibilidad**:
  - Cada cosa del lienzo es enfocable (`Tab` en orden de nombre), con `role="img"` y
    `aria-label="Objeto Pedido, físico"`.
  - El foco es visible en crimson; se respeta `prefers-reduced-motion`; la UI tiene contraste AA.
  - La severidad del diagnóstico se muestra con texto e ícono, no solo con color.

## Leyenda visual y límites

Los siguientes archivos son SVG de regresión obtenidos del dibujo del producto;
no son capturas del lienzo. Su geometría corresponde a sus modelos de prueba.

| Elemento | Forma | Ejemplo |
|---|---|---|
| Objeto físico/ambiental | rectángulo, sombra, borde discontinuo | [Objeto](../app/src/opd/__golden__/objeto-fisico-ambiental.svg) |
| Proceso físico/ambiental | elipse, sombra, borde discontinuo | [Proceso](../app/src/opd/__golden__/proceso-fisico-ambiental.svg) |
| Estados | cápsulas de radio 8 dentro del objeto | [Estados](../app/src/opd/__golden__/estados-ocultos-anclados.svg) |
| Consumo/resultado/efecto | dirección y terminales literales del canon | [Transformadores](../app/src/opd/__golden__/transformadores-estados.svg) |
| Agente/instrumento | piruletas correspondientes | [Habilitadores](../app/src/opd/__golden__/habilitadores.svg) |
| Abanico XOR/OR | sector mínimo, radios 30/35, acople al borde común | [XOR](../app/src/opd/__golden__/abanico-xor.svg) · [OR](../app/src/opd/__golden__/abanico-or.svg) |
| Estructurales | triángulo y peine | [Peines](../app/src/opd/__golden__/peines-cuatro-orientaciones.svg) |
| Excepciones | zigzag y cota de la fuente | [Excepciones](../app/src/opd/__golden__/excepciones.svg) |

Crimson identifica interacción (selección, asas, foco), nunca un hecho canónico.
F9 oculta UI/guías; el export canónico no las incluye. El fondo no tiene grilla.
Un arco de sector cero puede no ser visible aunque el modelo sea válido; no es
prueba de selección visual. La geometría importada puede cruzar figuras o rótulos:
los avisos B-15 se conservan y el export no rerutea para ocultarlos.

[Conformidad](conformidad.md) distingue superficies y diez parciales. El texto OPL
no reconstruye geometría, historial de borrado ni duración sin excepción. Current
declarado es una designación estática; no hay simulación. Ante un Informe conserve
el original y decida explícitamente las reparaciones; nada se aplica por defecto.
