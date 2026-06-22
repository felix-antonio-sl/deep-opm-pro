# 52 — Estereotipos y extensiones del lenguaje

**Alcance**: estereotipos como extensiones tipadas, sintaxis visible (`<<Nombre>>`, `«Nombre»`), propiedades forzadas, entidades derivadas, caso canónico `<<Requirement>>`, vistas de requisitos.
**Capa SSOT propietaria**: `opm-visual-es.md` §19
**Aplicación en la app**: `src/suite/kora/profile.ts`, `src/suite/hdos/profile.ts`, soporte general de estereotipos.

## Reglas

### R-2200: V-142 — Estereotipo como extensión declarada

- Enunciado: un estereotipo es una extensión declarada sobre una cosa OPM que puede aportar:
  - **prefijo textual visible**
  - **propiedades forzadas** de la cosa anfitriona
  - **estructura derivada**
  - **entidades auxiliares derivadas**
  - **restricciones de aplicabilidad**
- Referencia SSOT: V-142
- Aplicación en código: `profile.ts` declara los estereotipos como objetos con campos correspondientes.

### R-2201: V-143 — Estereotipos mixtos por defecto

- Enunciado: los estereotipos son mixtos por defecto: cada estereotipo DEBE declarar explícitamente si aplica a objetos, procesos o ambos. NO se presume polimorfismo universal.
- Referencia SSOT: V-143
- Aplicación en código: cada estereotipo declara `aplicableA: "objeto" | "proceso" | "ambos"`.

### R-2202: V-144 — Sintaxis visible en canvas

- Enunciado: la representación visual canónica de un estereotipo usa prefijo ASCII `<<Nombre>>` embebido en el rótulo visible de la cosa, o alternativamente un **distintivo visible** que preserve el mismo contenido textual en el canon-diagrama.
- Referencia SSOT: V-144
- Aplicación en código: el renderer concatena `<<Req>>` al rótulo si el estereotipo lo declara.

### R-2203: V-145 — Sintaxis textual canónica en OPL

- Enunciado: la representación textual canónica en OPL puede usar comillas angulares `«Nombre»`. Las formas `<<Nombre>>` y `«Nombre»` se consideran **equivalentes de superficie** siempre que remitan al mismo estereotipo.
- Referencia SSOT: V-145
- Aplicación en código: el generador OPL emite `«Req»` o `<<Req>>` según política del perfil.

### R-2204: V-146 — Estereotipo no ocultable

- Enunciado: un artefacto canónico NO puede ocultar por completo la condición estereotipada de una cosa. Si el prefijo se omite del rótulo visible por razones de layout, el estereotipo DEBE persistir mediante **distintivo**, **icono** o **metadato explícito** de export ligado a la cosa.
- Referencia SSOT: V-146
- Aplicación en código: si el rótulo no muestra `<<...>>`, agregar distintivo visual.

### R-2205: V-147 — Propiedades forzadas recuperables

- Enunciado: un estereotipo puede forzar propiedades de la cosa anfitriona, incluida esencia, conjunto mínimo de partes o presencia de atributos derivados. Toda propiedad forzada DEBE ser recuperable en OPL o en el metadato canónico del artefacto.
- Referencia SSOT: V-147
- Aplicación en código: propiedades forzadas serializadas explícitamente.

### R-2206: V-148 — Remoción sin residuos

- Enunciado: la remoción del estereotipo NO puede dejar residuos semánticos ambiguos. La implementación DEBE declarar si las propiedades forzadas:
  - se revocan
  - se conservan explícitamente
  - requieren confirmación del modelador
- Referencia SSOT: V-148
- Aplicación en código: política de remoción declarada en ADR.

### R-2207: V-149 — Descomposición canónica trazable

- Enunciado: la descomposición canónica impuesta por un estereotipo NO se presume equivalente a una descomposición voluntaria del modelador. DEBE ser trazable como **estructura derivada** del estereotipo en el modelo o en el export canónico.
- Referencia SSOT: V-149
- Aplicación en código: marcar entidades derivadas por estereotipo con flag específico.

### R-2208: V-150 — Distinguibilidad visual

- Enunciado: un estereotipo NO puede depender exclusivamente del OPL para su legibilidad. El OPD exportado DEBE permitir identificar visualmente que la cosa está estereotipada, aunque no necesariamente todo el detalle de la plantilla.
- Referencia SSOT: V-150
- Aplicación en código: distintivo visible por defecto.

### R-2209: V-151 — Esencia forzada por estereotipo

- Enunciado: cuando un estereotipo fuerce esencia física, la sombra visible sigue interpretándose bajo §1.3 como fisicidad efectiva de la cosa, NO como mera decoración del estereotipo. El origen de la fuerza DEBE ser trazable en el modelo, no en una semántica paralela del render.
- Referencia SSOT: V-151
- Aplicación en código: la cosa marca `esenciaOrigen: "estereotipo"` si aplica.

### R-2210: V-152 — Entidades derivadas con patrón reservado

- Enunciado: un estereotipo puede generar entidades derivadas con patrón nominal reservado `<Rol> of <HostThing>`. Ese patrón queda reservado para entidades derivadas del estereotipo y NO debe reutilizarse arbitrariamente para nombres manuales.
- Referencia SSOT: V-152
- Aplicación en código: validador rechaza nombres manuales con patrón `X of Y` si no son derivados.

### R-2211: V-153 — Ciclo de vida de entidades derivadas

- Enunciado: las entidades derivadas por estereotipo pueden aparecer en el canvas, en ramas auxiliares del árbol o en vistas derivadas. Su ciclo de vida DEBE depender del **host** que las originó, salvo que la plantilla declare reutilización explícita.
- Referencia SSOT: V-153
- Aplicación en código: eliminar host → cascada sobre derivadas.

### R-2212: V-154 — `<<Requirement>>` como caso canónico

- Enunciado: `<<Requirement>>` se declara como estereotipo canónico de requisito en esta adaptación. Un requisito sigue siendo, gráficamente, un objeto OPM estereotipado.
- Referencia SSOT: V-154
- Aplicación en código: el perfil base puede exponer `<<Requirement>>` predefinido.

### R-2213: V-155 — Atributos mínimos de `<<Requirement>>`

- Enunciado: todo `<<Requirement>>` DEBE exponer o derivar, como mínimo:
  - `Name`
  - `ID`
  - `Requirement Essence`
  - `Satisfaction`
  - `Description`
- Referencia SSOT: V-155
- Aplicación en código: plantilla `<<Requirement>>` genera estos atributos automáticamente.

### R-2214: V-156 — `Requirement Essence` distinta de esencia de cosa

- Enunciado: el atributo `Requirement Essence` del estereotipo `<<Requirement>>` es **distinto** de la esencia de cosa definida en §1.3. Para evitar sobrecarga terminológica, la documentación canónica NO debe usar el nombre desnudo `Essence` para el atributo del requisito.
- Referencia SSOT: V-156
- Aplicación en código: atributo usa nombre completo `Requirement Essence`.

### R-2215: V-157 — `Satisfied Requirement Set` admitido

- Enunciado: el conjunto `Satisfied Requirement Set` se admite como colección especializada de requisitos. Si la implementación permite marcarla como ordenada, esa propiedad DEBE quedar serializada y ser recuperable en el canon-documento.
- Referencia SSOT: V-157
- Aplicación en código: colección serializada con `ordenada: boolean`.

### R-2216: V-254 — Vistas de Requisitos como vista anclada

- Enunciado: las `Vistas de Requisitos` (`Requirement Views`) son OPDs derivados por filtrado semántico desde el modelo. Se clasifican como **OPD de vista anclada** según V-114 y participan del árbol en esa categoría.
- Referencia SSOT: V-254
- Aplicación en código: generar Requirement Views como vista anclada.

### R-2217: V-255 — Vistas de Requisitos son read-only

- Enunciado: las Vistas de Requisitos son de **solo lectura** respecto al contenido OPM que proyectan. Editar sus elementos DEBE redirigirse a los OPDs jerárquicos fuente del modelo.
- Referencia SSOT: V-255
- Aplicación en código: UI en vista de requisitos sin botones de edición; link "editar en SD original".

### R-2218: Trazabilidad de requisitos en OPL-ES

- Enunciado: cuando se use trazabilidad de requisitos, el enlace estructural etiquetado con etiqueta `satisface` DEBERÍA usarse como convención en OPL-ES (`satisfies` si la capa activa es OPL-EN).
- Referencia SSOT: `metodologia-opm-es.md` §13.2
- Aplicación en código: plantilla reservada.

### R-2219: Trazabilidad estructural, no procedimental

- Enunciado: los requisitos NO deben conectarse a artefactos vía enlaces procedimentales. Los requisitos no transforman ni habilitan procesos; la relación es **estructural**.
- Referencia SSOT: `metodologia-opm-es.md` §13.2
- Aplicación en código: validador rechaza consumo/resultado/efecto/agente/instrumento hacia requisitos.

### R-2220: Operaciones disponibles sobre requisitos

- Enunciado: una herramienta compatible puede agregar, remover y visualizar requisitos sobre elementos, enlaces o diagramas completos. Las relaciones mínimas recuperables son:
  - Exhibición-caracterización
  - Agregación-participación
- Referencia SSOT: `metodologia-opm-es.md` §13.1
- Aplicación en código: API de requisitos expone estas operaciones.

### R-2221: Análisis de vacíos y generación asistida

- Enunciado: el entorno de modelado PUEDE ofrecer capacidades auxiliares:
  - identificación de conocimiento faltante (heurística de vacíos)
  - generación asistida de requisitos (con revisión manual obligatoria)
  - comparación de versiones
- Referencia SSOT: `metodologia-opm-es.md` §13.4
- Aplicación en código: funciones opcionales con revisión humana.

### R-2222: Normalización léxica trazable

- Enunciado: la normalización léxica organizacional, los alias de casing o las reescrituras automáticas del rótulo NO pueden aplicarse silenciosamente como si fueran mero estilado. DEBEN ser trazables como política de normalización o como metadato reversible del modelo.
- Referencia SSOT: V-216
- Aplicación en código: normalización deja registro reversible.

### R-2223: Compatibilidad con OPL

- Enunciado: la política de naming de entidades derivadas hereda la política léxica de la capa textual activa del corpus (V-121). El estereotipo no la sobrescribe.
- Referencia SSOT: V-121
- Aplicación en código: entidades derivadas respetan convenciones OPL-ES.

## Checklist

- [ ] Cada estereotipo declara su aplicabilidad (objeto/proceso/ambos)
- [ ] Prefijo `<<Nombre>>` en canvas y `«Nombre»` en OPL equivalentes
- [ ] Estereotipo no ocultable (distintivo/icono/metadato)
- [ ] Propiedades forzadas recuperables
- [ ] Remoción con política declarada (revocar/conservar/confirmar)
- [ ] Descomposición canónica marcada como derivada
- [ ] Visible en OPD exportado
- [ ] Esencia forzada trazable al estereotipo
- [ ] Patrón `X of Y` reservado para entidades derivadas
- [ ] Ciclo de vida de derivadas depende del host
- [ ] `<<Requirement>>` con atributos mínimos
- [ ] `Requirement Essence` ≠ esencia de cosa
- [ ] `Satisfied Requirement Set` admitido
- [ ] Requirement Views como vista anclada read-only
- [ ] Trazabilidad vía `satisface` (OPL-ES) / `satisfies` (OPL-EN)
- [ ] Requisitos conectados por enlaces estructurales, no procedimentales
- [ ] Normalización léxica trazable

## Antipatrones

- Estereotipo sin distintivo visible y sin prefijo en rótulo (invisible en canon)
- Usar "Essence" desnudo para el atributo de Requirement
- Requirement conectado por enlace de consumo o efecto
- Vista de Requisitos editable (viola V-255)
- Normalización léxica silenciosa sin registro
- Ciclo de vida de entidad derivada sin dependencia del host

## Referencias cruzadas

- Primitivas: `10-primitivas-cosas.md`
- Capa computacional: `53-capa-computacional.md`
- Navegación (vistas ancladas): `40-navegacion-arbol-identidad.md`
- OPL plantillas estructurales: `72-opl-plantillas-estructurales.md`
- Metodología requisitos: `86-metodologia-requisitos.md`
- Estilado autoral (normalización): `61-estilado-autoral.md`
