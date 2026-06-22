# 34 — Semi-plegado (compresión parcial de estructura)

**Alcance**: semi-plegado como mecanismo visual intermedio entre plegado y despliegue completos, por refinador, indicador numérico de ocultos, aplicación por OPD, enlaces procedimentales a refinadores semi-plegados.
**Capa SSOT propietaria**: `opm-visual-es.md` §10.12
**Aplicación en la app**: renderer de objetos con partes semi-plegadas, lógica de visibilidad.

## Reglas

### R-1500: V-116 — Semi-plegado como ícono de triángulo con nombre

- Enunciado: en una relación de agregación-participación, los refinadores (partes) pueden mostrarse como **íconos de triángulo con el nombre de la parte** dentro del rectángulo del todo (refinable), en lugar de como entidades separadas conectadas por enlaces estructurales explícitos. Esta representación compacta es el **semi-plegado**.
- Referencia SSOT: V-116
- Aplicación en código: el renderer dibuja un triángulo agregación mini seguido del nombre de la parte, embebido en el envelope del todo.

### R-1501: V-117 — Semi-plegado por refinador

- Enunciado: el semi-plegado es **por refinador**: algunos refinadores pueden estar semi-plegados (dentro del rectángulo del todo) mientras otros permanecen extraídos (fuera, con enlace estructural explícito visible). NO es necesariamente todo-o-nada.
- Referencia SSOT: V-117
- Aplicación en código: el modelo de apariencia permite `semiPlegado: boolean` por refinador.

### R-1502: V-118 — Indicador numérico de ocultos

- Enunciado: cuando hay refinadores semi-plegados y otros extraídos, un indicador numérico junto al triángulo de agregación muestra **cuántos refinadores permanecen ocultos dentro del semi-plegado** — NO el total de refinadores.
- Referencia SSOT: V-118
- Aplicación en código: el indicador muestra `#semiPlegados`, no `#total`.

### R-1503: V-119 — Semi-plegado por OPD

- Enunciado: el estado de semi-plegado es **por apariencia** (por OPD): un objeto puede estar semi-plegado en un OPD y completamente desplegado en otro. Son vistas independientes del mismo hecho estructural.
- Referencia SSOT: V-119
- Aplicación en código: `apariencias[cosa][opd].semiPlegado: boolean` por refinador.

### R-1504: V-120 — Enlaces procedimentales a refinadores semi-plegados

- Enunciado: los enlaces procedimentales pueden conectarse directamente a un refinador semi-plegado dentro del rectángulo del todo. Visualmente, la flecha entra al borde del rectángulo padre y apunta al nombre del refinador semi-plegado.
- Referencia SSOT: V-120
- Aplicación en código: routing especial para enlaces que terminan en ítems semi-plegados.

### R-1505: Semi-plegado solo en agregación-participación

- Enunciado: el semi-plegado canónico se aplica a agregación-participación. Otras relaciones estructurales fundamentales (exhibición, generalización, clasificación) NO tienen semi-plegado canónico en esta SSOT.
- Referencia SSOT: V-116 (estricto)
- Aplicación en código: restringir la operación a agregación.

### R-1506: Uso metodológico del semi-plegado

- Enunciado: metodológicamente, el modelador DEBERÍA usar semi-plegado para **inspección rápida de estructura** sin proliferación de OPDs y DEBERÍA evitarlo cuando oculte relaciones necesarias para el propósito del modelo.
- Referencia SSOT: `metodologia-opm-es.md` §8.1
- Aplicación en código: la herramienta ofrece semi-plegado como acción explícita.

### R-1507: No existe plantilla OPL canónica para semi-plegado

- Enunciado: NO existe plantilla OPL-ES canónica para el semi-plegado; su expresión es **exclusivamente visual**. En OPL, la relación de agregación se describe de la forma estándar (RF1).
- Referencia SSOT: §10.12 (introducción)
- Aplicación en código: el generador OPL emite la forma completa; el renderer decide si proyectar semi-plegado.

### R-1508: Semi-plegado vs colección incompleta

- Enunciado: el **semi-plegado** oculta refinadores dentro del todo (visible, con indicador). La **colección incompleta** (barra bajo triángulo) indica que hay refinadores no mostrados ni en el todo ni fuera. Son mecanismos distintos.
- Referencia SSOT: §1.8, V-118
- Aplicación en código: no mezclar la barra de colección incompleta con el indicador de semi-plegado.

### R-1509: Canon-diagrama admite semi-plegado

- Enunciado: el semi-plegado es parte de la gramática visible; persiste en canon-diagrama si se declara en la apariencia.
- Referencia SSOT: V-0b, §10.12
- Aplicación en código: exportador preserva el estilo semi-plegado.

### R-1510: Cambio dinámico entre formas

- Enunciado: el modelador puede alternar entre despliegue completo y semi-plegado sin cambiar la semántica del modelo. Es un ajuste de apariencia local.
- Referencia SSOT: V-119 (implícito)
- Aplicación en código: acción reversible; el modelo no cambia.

### R-1511: Nombre del refinador semi-plegado preserva política léxica

- Enunciado: el nombre del refinador mostrado en semi-plegado sigue la misma política léxica que cualquier cosa OPM (capitalización, unicidad).
- Referencia SSOT: V-47, `opm-opl-es.md` §1.2
- Aplicación en código: no hay abreviación automática del nombre en semi-plegado.

### R-1512: Separación visual del indicador

- Enunciado: el indicador numérico se posiciona junto al triángulo de agregación (interno, si está dentro del todo), no sobre el rótulo del todo.
- Referencia SSOT: V-118
- Aplicación en código: posicionamiento adyacente al triángulo.

## Checklist

- [ ] Semi-plegado aplica solo a agregación-participación
- [ ] Semi-plegado por refinador (mezcla admisible)
- [ ] Indicador numérico = cantidad de ocultos, no total
- [ ] Estado de semi-plegado por apariencia local (por OPD)
- [ ] Enlaces procedimentales pueden terminar en refinador semi-plegado
- [ ] Generador OPL emite forma completa (no especial)
- [ ] Canon-diagrama preserva semi-plegado si está declarado
- [ ] Indicador separado visualmente del rótulo del todo
- [ ] No confundir con colección incompleta (barra)

## Antipatrones

- Aplicar semi-plegado a exhibición / generalización / clasificación
- Mostrar el total de refinadores en el indicador (debe ser solo los ocultos)
- Perder el estado de semi-plegado al cambiar de OPD
- Generar OPL con sintaxis especial para semi-plegado
- Mezclar barra de colección incompleta con indicador de semi-plegado

## Referencias cruzadas

- Enlaces estructurales fundamentales: `14-enlaces-estructurales.md`
- Refinamiento: `30-refinamiento-entre-opds.md`
- Layout visual: `20-layout-visual-opd.md`
- Metodología de gestión de complejidad: `82-metodologia-complejidad-gobernanza.md`
- OPL plantillas estructurales: `72-opl-plantillas-estructurales.md`
