# 33 — Supresión y expresión de estados

**Alcance**: supresión bajo demanda en OPD padre, expresión en OPD hijo, unión de estados suprimidos, supresor visual, aplicabilidad restringida a descomposición.
**Capa SSOT propietaria**: `opm-visual-es.md` §10.6
**Aplicación en la app**: `src/render/jointjs/pass-estados.ts`, lógica de visibilidad por OPD.

## Reglas

### R-1400: V-86 — Supresión bajo demanda

- Enunciado: un estado `s` de una cosa T se suprime en el OPD padre cuando:
  - existe un OPD hijo de descomposición donde T aparece como externo, **y**
  - existe un enlace entre T y la cosa refinada que referencia `s` como estado de origen o destino

La supresión se computa **bajo demanda**, no se almacena.

- Referencia SSOT: V-86
- Aplicación en código: función `estadosVisiblesEnPadre(cosa, opdPadre)` calcula la supresión dinámicamente.

### R-1401: V-87 — Supresión solo en descomposición

- Enunciado: la supresión de estados solo aplica a **descomposición**, no a despliegue.
- Referencia SSOT: V-87
- Aplicación en código: la lógica de supresión se desactiva cuando el OPD hijo es unfolding.

### R-1402: V-88 — Estados no referenciados permanecen visibles

- Enunciado: estados NO referenciados en enlaces a la cosa refinada NO se suprimen — permanecen visibles en el OPD padre.
- Referencia SSOT: V-88
- Aplicación en código: solo los estados que participan en enlaces migran a hijo; el resto permanece en padre.

### R-1403: V-89 — Unión de supresiones

- Enunciado: cuando existen múltiples OPDs hijo de descomposición que suprimen estados del mismo objeto, el conjunto de estados suprimidos es la **unión** de los estados suprimidos por cada OPD hijo.
- Referencia SSOT: V-89
- Aplicación en código: `estadosSuprimidos(cosa, opd) = ∪ estadosSuprimidosPorHijo(opd)`.

### R-1404: V-90 — Expresión en OPD hijo (mecanismo inverso)

- Enunciado: los estados suprimidos en el OPD padre (SDn) se revelan en el OPD hijo (SDn+1) vinculados a subprocesos específicos. Este es el mecanismo **inverso** de la supresión.
- Referencia SSOT: V-90
- Aplicación en código: al entrar a SDn+1, mostrar los estados relevantes vinculados a los enlaces migrados.

### R-1405: Supresor visual en objeto

- Enunciado: cuando un objeto tiene más estados que los mostrados, se indica con un símbolo `...` en un rountangle en la **esquina inferior derecha** del objeto.
- Referencia SSOT: §1.8
- Aplicación en código: agregar rountangle mini con `...` si `estadosVisibles.length < estadosTotal.length`.

### R-1406: Aplicabilidad por OPD

- Enunciado: el estado de supresión es **por apariencia local** (por OPD). Un objeto puede tener estados suprimidos en el OPD padre y todos visibles en otro OPD donde aparezca completo.
- Referencia SSOT: V-52, §10.6
- Aplicación en código: `apariencias[cosa][opd].estadosVisibles` por apariencia.

### R-1407: Supresión NO pierde información

- Enunciado: la supresión es **visual**: los estados siguen existiendo en el modelo. Solo se ocultan en una apariencia específica.
- Referencia SSOT: §10.6 (implícito)
- Aplicación en código: el modelo preserva el conjunto completo; el renderer filtra.

### R-1408: Método de decisión — supresión vs expresión

- Enunciado: metodológicamente:
  - los estados DEBERÍAN **suprimirse** en el SD cuando no están conectados a ningún proceso
  - los estados DEBERÍAN **expresarse** en SD1 donde se conectan a subprocesos
- Referencia SSOT: `metodologia-opm-es.md` §7.5
- Aplicación en código: asistente de descomposición sugiere supresión automática de estados sin uso local.

### R-1409: Estado indeterminado durante proceso activo

- Enunciado: mientras un proceso que afecta está activo, el afectado está "en transición" entre estado de entrada y estado de salida. Su estado es **indeterminado** y NO disponible para uso por otros procesos. Si el proceso se detiene prematuramente, el afectado permanece en estado indeterminado a menos que un manejador de excepciones lo resuelva.
- Referencia SSOT: `metodologia-opm-es.md` §7.5
- Aplicación en código: el motor de simulación expone `estadoActual: Estado | "indeterminado"`.

### R-1410: Mecanismo inverso — supresión completa

- Enunciado: la supresión completa de estados de un objeto (sin mostrar ningún rountangle) es admisible si no hay enlaces con estado especificado al objeto en el OPD actual.
- Referencia SSOT: §10.6 implícito, V-88
- Aplicación en código: el renderer puede omitir enteramente la franja inferior si no hay estado relevante.

### R-1411: Aridad de supresión — parcial por apariencia

- Enunciado: la supresión puede ser parcial: solo algunos estados se ocultan mientras otros permanecen visibles.
- Referencia SSOT: V-87 (implícito), §10.6
- Aplicación en código: renderer filtra por estado individual, no por objeto completo.

### R-1412: Supresión no propaga a refinables internos

- Enunciado: la supresión aplica al objeto como apariencia externa. Si el objeto se refina en su propio OPD hijo, la supresión en el padre externo NO afecta la visibilidad de estados en el OPD hijo propio del objeto.
- Referencia SSOT: V-86 (estricto), V-52
- Aplicación en código: supresión es por (cosa, opd), no global.

## Checklist

- [ ] Supresión computada bajo demanda, no almacenada
- [ ] Supresión solo aplica a descomposición
- [ ] Estados no referenciados permanecen visibles
- [ ] Supresión múltiple = unión de supresiones por hijo
- [ ] Expresión en hijo vincula estados a subprocesos
- [ ] Supresor `...` presente cuando hay estados ocultos
- [ ] Supresión por apariencia local, no global
- [ ] La supresión no elimina estados del modelo
- [ ] Estados sin uso en SD → suprimir en SD
- [ ] Estado indeterminado distinguido de estados declarados

## Antipatrones

- Almacenar estados suprimidos en el modelo (viola "bajo demanda")
- Suprimir estados usados por enlaces presentes en el mismo OPD
- Aplicar supresión durante unfolding (viola V-87)
- Olvidar el supresor `...` cuando hay estados ocultos
- Mostrar un objeto en el SD con 20 estados no referenciados (viola heurística)

## Referencias cruzadas

- Estados: `11-estados-designaciones.md`
- Refinamiento: `30-refinamiento-entre-opds.md`
- Distribución de enlaces: `31-distribucion-enlaces-descomposicion.md`
- Simulación runtime: `50-simulacion-runtime-visual.md`
- Metodología SD1: `81-metodologia-sd1-descomposicion.md`
