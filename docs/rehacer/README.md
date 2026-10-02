# Rehacer opforja: estudio, canon y diseño (propuesta)

**Estado al 2026-10-02:** diseño revisado por el dueño ([`DECISIONS.md`](DECISIONS.md) 25–28). La
implementación se hará en una **sesión nueva**, con el plan empaquetado en [`plan/`](plan/README.md).
Todavía no hay implementación. El código de `app/` no cambió, salvo una corrección independiente: un solo
`validarMultiplicidad`, que acepta `?`. Producción no se tocó.

Este directorio conserva, dentro del repositorio, el trabajo previo a rehacer opforja. Esos
documentos nacieron en un espacio efímero de sesión y aquí quedan recuperables. Cuando la
reescritura se implemente y cierre, el directorio se retira: Git conserva la historia.

## Encargo y decisiones del dueño

- «Rehaz OpForja con plena libertad creativa y de transformación, respetando absolutamente
  principios, semántica y reglas de OPM»: más usable, ágil, limpia, intuitiva, elegante, liviana
  y coherente. Hay que eliminar sobreingeniería, lastre y burocracia, sin sobresimplificar.
- «Más simple aún. Acá está el canon actualizado. Ni más ni menos»: el canon son **exactamente**
  los cuatro documentos de [`canon/`](canon/). Son byte a byte los de `kora-knowledge`
  `references/fxsl/`:
  - `reglas-opm-estrictas-es` 1.5.0;
  - `spec-forja-opd-es` 1.4.0;
  - `spec-forja-opl-es` 1.4.1;
  - `metodologia-forja-opm-es` 1.7.0.

  El producto implementa lo que el canon exige a la herramienta, ni más ni menos.
- Persistencia: **servidor mínimo**, con una cuenta y los modelos como archivos JSON
  `deep-opm-pro.modelo.v0` en el servidor. Sale PostgreSQL y hay una migración única.

El resto de las decisiones está en [`DECISIONS.md`](DECISIONS.md). Ahí se responden, con su
porqué, las 24 preguntas abiertas del estudio.

## Cómo se produjo

| Fase | Método | Resultado |
|---|---|---|
| Estudio del repositorio | 18 lectores: núcleo, análisis, simulación, OPL, serialización, store, render, capa app, UI, autoría/tutor/mesa/agente, servidor/deploy, tests/gobernanza, autoridad OPM, producto, bugs/auditorías, gobierno visual e historia Git, y UX en vivo con Playwright. Después, una síntesis y un crítico con sondas ejecutables contra el código real | [`understand/SYNTHESIS.md`](understand/SYNTHESIS.md) y los dossiers en [`understand/`](understand/) |
| Canon | 7 lectores leyeron los cuatro documentos completos, por tramos. Después, una especificación derivada y una auditoría adversarial contra la fuente | [`understand/CANON.md`](understand/CANON.md): 248 requisitos T-NNN, 180 núcleo ★, con la EBNF idéntica a la fuente |
| Diseño | 3 arquitectos con lentes distintas (minimalismo radical, fluidez del experto, conformidad por construcción) y 3 jueces (canon, simplicidad, usabilidad y factibilidad). Después, una síntesis y un crítico que revisó la cobertura del canon fila por fila | [`design/DESIGN.md`](design/DESIGN.md), el diseño final. Las alternativas están en `design/DESIGN-{A,B,C}.md` |
| Plan | Revisión del dueño y empaquetado para una sesión nueva | [`plan/README.md`](plan/README.md) (protocolo), [`plan/PROMPT.md`](plan/PROMPT.md) (mensaje de arranque) y [`plan/plan.json`](plan/plan.json) (23 paquetes en 6 olas) |

`CANON.md` es un texto derivado. Ante cualquier duda, manda [`canon/`](canon/).

## El diseño en una página

**Tesis.** Lo ilegal no se valida: no se puede escribir. Lo que el tipo no puede expresar lo decide
**una sola matriz de validez**. La consultan, sin copias, el menú del lienzo, las operaciones, el
editor OPL, el diagnóstico y el importador. Cada oración OPL se declara **una sola vez**, en una
tabla que sirve para generar y para reconocer. La simetría OPD↔OPL se **demuestra** enumerando la
matriz: unos 700 casos más modelos aleatorios con semilla.

**Tamaño.** Unas 15.300 líneas de fuente y 10.000 de pruebas. Hoy son 133.000 y 70.000: queda
alrededor del 12 %. La única dependencia de ejecución es Preact, más la fuente Inria Serif. Salen
JointJS, zustand, el SDK de IA y eslint.

**Arquitectura.**

```
nucleo ──► codec ──► servidor
   ├─────► opl ──┐
   └─────► opd ──┴──► editor ──► ui
```

- `nucleo`: los hechos OPM puros.
- `codec`: el formato v0.
- `opl`: el lenguaje OPL-ES.
- `opd`: la escena y el SVG propio, con los paths literales del canon.
- `editor`: el estado de la aplicación.
- `ui`: la interfaz en Preact.
- `servidor`: `Bun.serve` sobre archivos.

No se persiste nada derivado: ni puertos, ni vértices, ni visibilidad por OPD, ni etiquetas
`SDx.y`.

**Experiencia.**

- Una pantalla de edición. El lienzo y el OPL ocupan al menos el 95 % del ancho a 1440 px.
- Una cabecera de una fila, con un solo indicador de guardado.
- Una paleta flotante de cuatro verbos: Objeto, Proceso, Estado y Enlace.
- Un panel de Propiedades y un panel con OPL y Diagnóstico.
- Una franja al pie del lienzo como único canal de respuesta.
- 14 superficies en total. Hoy hay unos 38 modales, 4 indicadores de guardado y una paleta de 60
  ítems.
- Toda creación nace con nombre, sin nombres de relleno. El in-zoom no siembra subprocesos.
- El menú de enlaces ofrece solo lo legal, con una vista previa de la oración OPL.
- El editor OPL no renombra nunca, lo que elimina el defecto actual de identidad por posición
  (UX-01).

**Persistencia.**

- Modelos en `modelos/<id>.json`, con escritura atómica y control de concurrencia por sha256
  (`If-Match` → 412).
- Papelera de 30 días y copias previas rotadas, sin interfaz.
- Borrador local en IndexedDB y un conflicto de guardado que nunca pierde datos.
- Una cuenta: se conserva el hash scrypt actual, así que la contraseña sigue sirviendo.
- Token Bearer opcional para agentes externos.

**Importar es cargar, no juzgar.**

- Los modelos v0 existentes se importan con todas sus codificaciones históricas.
- Lo representable que viola el canon queda como error recuperable: bloquea el export canónico, no
  la edición.
- Lo no representable se descarta elemento por elemento, con un informe visible.
- El import nunca renombra.

**Exportes.**

- `canon-diagrama`: SVG por OPD con la fuente incrustada.
- `canon-documento`: un HTML autocontenido con el árbol de OPDs y, por cada OPD, su SVG y su OPL.
- OPL en Markdown y JSON v0.

## Qué sale del producto

- Simulación y probabilidades.
- Agente LLM integrado, tutor, mesa y su CLI.
- Apunte, Taller, Bocetos, Graduar y Biblioteca.
- Versiones visibles, carpetas y pestañas.
- Reutilización, anclaje, drift y estereotipos.
- Sub-modelos y composición.
- Revisión compartida, lector y paquete portátil.
- Captura de bugs, modo móvil de solo lectura y mapa del sistema.
- Paleta de comandos, tabla de enlaces y PNG.
- En el repositorio: `opm-extracted/`, `assets/`, `fixtures/` (salvo los seis bundles v0, que pasan
  a pruebas), `config/`, `catalog/`, `webroot/`, `ui-forja/` y casi todo `docs/`. La lista exacta y
  su justificación están en DESIGN §11.4.

## Desvíos y brechas declarados

El registro de conformidad planificado (DESIGN §11.3) declara 27 brechas, B-01 a B-27. Ninguna
queda en silencio. Las que más conviene revisar:

- **Diferidas por decisión:** RX1/RX2, descomposición de objeto y agente humano, que se verifica
  por el proxy «objeto físico».
- **B-27:** para que un rectángulo aislado viaje por OPL, se emite D2 como «mención mínima». Es un
  desvío consciente de DR-2.
- **B-19:** los habilitadores distributivos se ven en el contorno del OPD hijo (DR-13), un desvío
  de R-VIS-HIJO-1.
- **B-22:** el gate de más de 25 cosas por OPD bloquea siempre, porque no hay vistas tipificadas.

## Qué debe revisar el dueño antes de aprobar

Revisado el 2026-10-02. La simulación sale, D1 concuerda en género, el contrato externo es JSON v0 +
API con token y la implementación va en una sesión nueva ([`DECISIONS.md`](DECISIONS.md) 25–28). La
lista queda como registro de lo que se revisó.

1. **La lista de retiros** de la sección anterior, en especial la simulación. El canon no la exige,
   pero el historial de bugs muestra que se usó.
2. **Consumidores externos.** La skill `modelamiento-opm` y el CLI `mesa` dejan de funcionar tal
   cual. El contrato pasa a ser el JSON v0 más la API HTTP de modelos con token. Hay que actualizar
   sus referencias en KORA.
3. **Pérdidas al importar modelos reales**, siempre informadas:
   - vértices, geometría de estados y multiplicidades por rango;
   - enlaces negados, Bocetos y extensiones;
   - enlaces que hoy están ocultos en un OPD pasan a verse;
   - nombres fuera del léxico quedan como errores reparables.
4. **Cambios visibles en el OPL:**
   - D1/D3 atómicas en lugar de la clasificación compuesta;
   - sin AND agrupado;
   - orden de oraciones por nombre;
   - IV2 sin demora.
5. **La transición a producción:** migración única desde PostgreSQL con informe por modelo,
   conservando el volumen para volver atrás (DESIGN §9.4). Solo se hace con autorización explícita
   y solo mediante `./deploy/deploy.sh`.

## Maqueta de interfaz (parcial, en pausa)

[`maqueta/`](maqueta/) conserva las fuentes de una maqueta estática de la interfaz de DESIGN §7.
Es un lienzo de diseño de claude.ai (formato `.dc.html` con `canvas.json`), privado para el dueño,
que se interrumpió a pedido el 2026-09-30.

| Pantalla | Archivo | Estado |
|---|---|---|
| Editor de escritorio (SD) | `maqueta/Main.dc.html` | publicada en el lienzo |
| Crear enlace (solo tipos legales) | `maqueta/Enlace.dc.html` | redactada, sin publicar |
| Descomponer en bandas (SD1) | `maqueta/Descomponer.dc.html` | redactada, sin publicar |
| Editar OPL, informe de importación, biblioteca, ancho estrecho | — | pendientes: `canvas.json` ya reserva sus marcos |

Usa la paleta, los trazos y los paths de marcadores literales de spec-OPD §18, con un modelo de
ejemplo ilustrativo. Fuera del lienzo no se ejecuta, porque depende de su runtime (`support.js`).

La decisión que la maqueta dejaba a la vista ya está tomada: D1 concuerda en género
(`**Bodeguero** es físico.`, `**Caja** es física.`; DECISIONS 25, DS-26).

## Plan de implementación

Está empaquetado en [`plan/`](plan/README.md) para una sesión nueva:

- [`plan/PROMPT.md`](plan/PROMPT.md) explica cómo abrir esa sesión en Codex CLI: el arranque y
  un `/goal` por hito.
- [`plan/README.md`](plan/README.md) fija el protocolo: autoridad, mapa de rutas, preparación,
  olas, hitos H1–H3, reglas por paquete, orquestación y continuidad. Su sección «Con Codex CLI»
  es el contrato que citan esos objetivos.
- [`.codex/rules/rehacer.rules`](../../.codex/rules/rehacer.rules) y
  [`.codex/agents/revisor-rehacer.toml`](../../.codex/agents/revisor-rehacer.toml) dejan a git
  trabajar dentro del sandbox y definen al revisor de cada ola. WP-19 los retira.
- [`plan/plan.json`](plan/plan.json) tiene los 23 paquetes de DESIGN §12, con dependencias,
  archivos propios, lecturas exactas y criterios de aceptación.

La implementación va en una rama `rehacer` creada desde `main`, con el tag `pre-rehacer` sobre la
base. Se detiene en cada hito para revisión. Producción no cambia hasta un despliegue autorizado
mediante `./deploy/deploy.sh`.

## Límites

- Una suite verde no equivale a validación humana del modelado. Tampoco la equivalen estos
  documentos.
- El diseño no se ha ejercitado en código: las cifras de tamaño y rendimiento son estimaciones.
- Las sondas del estudio y las capturas de la app actual quedaron fuera del repositorio. Sus
  hallazgos están transcritos en `understand/SYNTHESIS.md` §10 y en `understand/ux-en-vivo.md`.
