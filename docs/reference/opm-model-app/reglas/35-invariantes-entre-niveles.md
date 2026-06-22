# 35 — Propiedades invariantes entre niveles de refinamiento

**Alcance**: esencia, perseverancia, nombres, consistencia de hechos, importancia proporcional, instancia visual vs lógica, prohibición de refinamiento cíclico.
**Capa SSOT propietaria**: `opm-visual-es.md` §10.9, §10.10, §10.11
**Aplicación en la app**: `src/render/layout/`, validador al crear OPDs hijo, consistencia cross-OPD.

## Reglas

### R-1600: V-95 — Esencia invariante

- Enunciado: la **esencia** (física/informacional) NO cambia a través del refinamiento. Es una propiedad estática de la cosa.
- Referencia SSOT: V-95
- Aplicación en código: al copiar una apariencia al OPD hijo, preservar `esencia`. El validador rechaza mutaciones de esencia por nivel.

### R-1601: V-96 — Perseverancia invariante

- Enunciado: la **perseverancia** (persistente/transitoria) NO cambia a través del refinamiento. Está determinada por el tipo: los objetos son persistentes, los procesos son transitorios.
- Referencia SSOT: V-96
- Aplicación en código: no hay migración objeto↔proceso por refinamiento.

### R-1602: V-97 — Nombres invariantes

- Enunciado: los **nombres** NO cambian a través del refinamiento. La convención de capitalización se mantiene consistente en todos los OPDs del modelo.
- Referencia SSOT: V-97
- Aplicación en código: el nombre canónico vive en `cosa.nombre`; las apariencias lo referencian, no lo duplican con variantes.

### R-1603: V-98 — Consistencia de hechos del modelo

- Enunciado: un hecho afirmado en un OPD NO puede contradecir un hecho afirmado en otro OPD. El refinamiento o la abstracción de hechos NO constituye contradicción.
- Referencia SSOT: V-98
- Aplicación en código: validador global verifica consistencia cross-OPD; contradicciones generan error.
- Ejemplo: si SD afirma `Proceso consume Objeto`, SD1 no puede afirmar lo contrario; refinar el consumo en subprocesos SÍ es admisible.

### R-1604: V-99 — Importancia proporcional al OPD más alto

- Enunciado: la importancia relativa de una cosa es proporcional al OPD más alto de la jerarquía donde aparece. Cosas que aparecen en SD son más importantes que las que aparecen solo en SDn.
- Referencia SSOT: V-99
- Aplicación en código: métricas de importancia usan `OPDMásAlto(cosa)`.

### R-1605: V-100 — Prohibición de refinamiento cíclico

- Enunciado: NO se puede refinar una cosa desde dentro de su propio árbol de refinamiento. El chequeo es **transitivo**: se verifica toda la cadena de ancestros del OPD. Esto previene loops infinitos.
- Referencia SSOT: V-100
- Aplicación en código: validador rechaza in-zooming de una cosa que aparece en la cadena ancestral del OPD hijo.

### R-1606: V-101 — Instancia visual ≠ instancia lógica

- Enunciado:
  - una **instancia visual** es la misma entidad del modelo mostrada en un OPD diferente (misma identidad, diferente vista)
  - una **instancia lógica** es una relación de clasificación o herencia (entidad diferente)
- Referencia SSOT: V-101
- Aplicación en código: duplicar apariencia NO crea nueva entidad.

### R-1607: V-102 — No instancia visual entre tipos distintos

- Enunciado: NO se puede crear una instancia visual entre tipos diferentes: un objeto NO puede ser instancia visual de un proceso, ni viceversa.
- Referencia SSOT: V-102
- Aplicación en código: validador rechaza esta operación.

### R-1608: V-125 — Esencia física preservada en contenedor refinado

- Enunciado: si una cosa refinable es física, su **contenedor** refinado en el OPD hijo DEBE preservar la marca de esencia física. La esencia NO puede perderse visualmente por el solo hecho del refinamiento.
- Referencia SSOT: V-125
- Aplicación en código: `pass-embed-refinable.ts` copia esencia al envelope.

### R-1609: V-74 — Herencia de afiliación

- Enunciado: los atributos de objetos ambientales son automáticamente ambientales. Los procesos de entidades ambientales son ambientales. La afiliación se hereda por la cadena estructural.
- Referencia SSOT: V-74
- Aplicación en código: propagación por cadena estructural al agregar parte/rasgo.

### R-1610: V-72 — Herencia semántica en refinamiento por despliegue

- Enunciado: la herencia aplica a través de niveles de refinamiento por despliegue. Cuando un general se despliega en especializaciones, cada especialización hereda automáticamente los enlaces del general en todos los OPDs donde participe.
- Referencia SSOT: V-72
- Aplicación en código: cálculo de enlaces efectivos incluye herencia.

### R-1611: Invariante de aridad del constructo básico

- Enunciado: el constructo básico de OPD (V-60) conserva su aridad (2 cosas + 1 enlace) en cualquier apariencia y a través de refinamientos. El refinamiento introduce constructos derivados, no altera el átomo.
- Referencia SSOT: V-60, `opm-iso-19450-es.md` §Metamodelo
- Aplicación en código: el modelo trata el constructo básico como invariante estructural.

### R-1612: Invariante cromático opcional

- Enunciado: el cromatismo es informativo (V-63). Cambiar la paleta a través de niveles NO altera la semántica, pero la coherencia cromática DEBERÍA preservarse por buena práctica (V-209).
- Referencia SSOT: V-63, V-209
- Aplicación en código: paleta uniforme por defecto.

### R-1613: Una cosa, múltiples apariencias

- Enunciado: V-52 permite que cualquier elemento aparezca en cualquier número de OPDs. Las apariencias son **vistas** locales de la misma existencia global.
- Referencia SSOT: V-52, V-123
- Aplicación en código: `cosa` global; `apariencia(cosa, opd)` local.

### R-1614: Estados suprimidos no contradicen expresados

- Enunciado: un estado puede estar suprimido en el OPD padre y expresado en SDn+1 sin contradicción. Es una proyección distinta del mismo hecho.
- Referencia SSOT: V-98, V-86, V-90
- Aplicación en código: validador considera supresión como caso de abstracción, no contradicción.

### R-1615: Herencia múltiple admitida

- Enunciado: se permite herencia múltiple. Una especialización puede heredar de varios generales.
- Referencia SSOT: V-28
- Aplicación en código: grafo de generalización es DAG.

### R-1616: Migración de enlaces comunes al general

- Enunciado: al crear un general a partir de especializaciones existentes, los enlaces comunes a todas las especializaciones se mueven al general.
- Referencia SSOT: V-76
- Aplicación en código: operación "crear general" identifica enlaces comunes y promueve.

### R-1617: Coherencia de cambio de rol

- Enunciado: un objeto puede ser instrumento en nivel abstracto y afectado en nivel detallado SOLO SI el cambio neto a nivel abstracto es cero (estado inicial = estado final). Esto preserva consistencia (V-98).
- Referencia SSOT: V-42, V-111
- Aplicación en código: validador verifica invariancia neta al hacer el cambio de rol.

### R-1618: Cambio de rol no aplica a despliegue

- Enunciado: el cambio de rol instrumento↔afectado aplica a **descomposición**, no a despliegue (V-112).
- Referencia SSOT: V-112
- Aplicación en código: restricción en el validador.

### R-1619: Prohibición de duplicar cosa con nombre distinto

- Enunciado: agregar una apariencia local de una cosa NO debe crear una cosa nueva con nombre distinto. Si el modelador quiere dos entidades, debe crear dos cosas distintas desde el modelo.
- Referencia SSOT: V-47, V-101, `metodologia-opm-es.md` §9.15
- Aplicación en código: UI distingue explícitamente "duplicar apariencia" vs "crear cosa nueva".

## Checklist

- [ ] Esencia preservada entre niveles
- [ ] Perseverancia preservada (objeto↔proceso no migra)
- [ ] Nombre único preservado
- [ ] Sin contradicción de hechos entre OPDs
- [ ] Refinamiento/abstracción NO es contradicción
- [ ] Importancia proyectada al OPD más alto
- [ ] Prohibición transitiva de refinamiento cíclico
- [ ] Instancia visual ≠ instancia lógica
- [ ] Instancia visual no entre tipos distintos
- [ ] Esencia física propagada al contenedor
- [ ] Afiliación heredada por cadena estructural
- [ ] Herencia semántica en refinamiento por despliegue
- [ ] Aridad del constructo básico invariante
- [ ] Estados suprimidos no contradicen expresados
- [ ] Herencia múltiple admitida
- [ ] Enlaces comunes migran al general al crearlo
- [ ] Cambio de rol solo con cambio neto = 0 en abstracto
- [ ] Cambio de rol solo en descomposición

## Antipatrones

- Un objeto físico que se vuelve informacional al refinar
- Un proceso en SD que se vuelve objeto en SD1
- Renombrar una apariencia al copiar al OPD hijo
- Refinamiento cíclico no detectado (bug crítico)
- Crear "copia visual" con nombre ligeramente distinto (viola V-101/V-47)
- Cambio de rol con estado neto ≠ 0 en abstracto

## Referencias cruzadas

- Refinamiento: `30-refinamiento-entre-opds.md`
- Distribución de enlaces: `31-distribucion-enlaces-descomposicion.md`
- Metamodelo y apariencias: `41-metamodelo-apariencia-existencia.md`
- Enlaces estructurales (herencia): `14-enlaces-estructurales.md`
- Invariantes globales: `99-invariantes-verificaciones.md`
