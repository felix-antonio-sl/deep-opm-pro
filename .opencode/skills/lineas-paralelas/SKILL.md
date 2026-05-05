---
name: lineas-paralelas
description: 'Skill local para deep-opm-pro: estructura el trabajo pendiente del repo
  en N lineas de desarrollo paralelas, generando README maestro, un brief por linea
  y prompt generico de asignacion en docs/instrucciones-lineas-dev/<ronda>/, con minimo
  overlap por archivo y reuso obligatorio del corpus interno.'
---

# Lineas-Paralelas

## Proposito

Estructurar el trabajo pendiente de un repo en **N lineas de desarrollo
paralelas** con minimo overlap por archivo, dependencia explicita y orden de
merge controlado. Salida: tres clases de documento en
`docs/instrucciones-lineas-dev/<ronda>/`:

1. `README.md` maestro con filosofia, reglas duras comunes, tabla de
   colisiones y protocolo de conciliacion.
2. `linea-<i>-<slug>.md` por cada linea, autocontenido, asignable a un agente
   independiente.
3. `prompt-asignacion.md` con plantilla generica + invocaciones concretas por
   linea para ruteo a agentes.

El patron canonico de referencia es la ronda 3 ya emitida en
`docs/instrucciones-lineas-dev/ronda3/` del repo.

## Cuando Usar

- El operador pide estructurar trabajo pendiente para ejecucion concurrente.
- Hay HANDOFF.md vigente con pendientes priorizados que necesitan particion.
- Se quiere convergencia controlada con orden de merge declarado.
- Se necesita asignacion a agentes independientes con scope estricto.

## Cuando No Usar

- Tarea unica de una sola linea: escribir directo, no generar 3 docs.
- Decision arquitectural pura sin trabajo de implementacion: usar
  `urn:dev:artefacto:steipete` o un agente de pensamiento.
- Reescribir HANDOFF o backlog HU: esos archivos son responsabilidad del
  operador o de la skill custodio canonica.
- Generar codigo: esta skill emite documentos de instrucciones, no codigo.

## Workflow

### 1. Capturar intent

Identificar:

- **N**: numero de lineas a generar (suele ser 3-7).
- **Ronda destino**: nombre del directorio (`ronda3`, `ronda-2026-05`, etc.).
  Si el operador no lo da, usar `ronda<N+1>` calculando del directorio
  existente.
- **Pendientes a cubrir**: lista explicita o "los del HANDOFF".
- **Restricciones**: orden de merge sugerido, lineas excluidas, prioridades.

Si el intent es ambiguo: leer HANDOFF y proponer particion al operador antes
de codificar.

### 2. Leer HANDOFF y backlog

- `docs/HANDOFF.md`: estado, decisiones vigentes, pendientes inmediatos.
- `docs/historias-usuario-v2/` o equivalente: backlog HU para anclar cada
  linea.
- `docs/instrucciones-lineas-dev/<ronda-previa>/README.md` si existe: heredar
  formato y reglas duras estables.

Identificar:

- HU M0/M1 cubiertas por la ronda.
- Archivos clave del repo y su estado (tamaño, dueno conceptual).
- Decisiones vigentes que las lineas deben respetar.

### 3. Mapear corpus reusable

Antes de inventar, verificar fuentes ya disponibles:

- Recursos internos del repo a reusar (en `deep-opm-pro`: `opm-extracted/`
  con INDEX.md, MODULES.md, src/app/models/).
- SSOT canonica externa (en `deep-opm-pro`: `/home/felix/kora/artifacts/
  knowledge/fxsl/opm/opm-ssot-es/`).
- Briefs de rondas previas que se pueden citar como precedente.

Cada brief debe citar al menos un recurso interno reusable.

### 4. Particionar en N lineas

Criterios de particion:

- **Disjuntez por dominio**: cada linea con dominio nuevo crea archivo
  disjunto (`abanicos.ts`, `modificadores.ts`) en lugar de expandir archivos
  monoliticos compartidos.
- **Solo una linea modifica firmas compartidas criticas**. Las otras leen.
- **Riesgo equilibrado**: una linea con blast radius alto (la que define
  contrato) + el resto con blast radius medio o bajo.
- **Cada linea entrega una HU eje** y opcionalmente HU dependientes que caben
  en el slice.

Si dos lineas chocan en mas de 1-2 archivos compartidos: rebalancear o fundir.

### 5. Generar README maestro

Secciones obligatorias en este orden:

1. Encabezado con fecha, base commit, objetivo.
2. Filosofia operativa: no reinventar, HU como contrato, aditividad,
   modularidad por dominio, loop verde obligatorio.
3. Reglas duras comunes: aditividad, scope estricto, evidencia, reuso
   obligatorio del corpus interno y SSOT, citas explicitas, idiomas, tests,
   commits, qué no tocar.
4. Stack y comandos del repo.
5. Vision general de las N lineas: tabla con ID, titulo, pendiente que cierra,
   HU eje, tamaño, riesgo.
6. Mapa de archivos por linea (tabla de colisiones): filas = archivos, columnas
   = lineas, celdas = `aditivo | lectura | nuevo | vacio`.
7. Protocolo de conciliacion: orden de merge sugerido y rationale.
8. Anclaje obligatorio a HU y SSOT.
9. Brief por linea: tabla con enlaces.
10. Verificacion al cierre de la ronda con metricas esperadas.

### 6. Generar briefs por linea

Cada `linea-<i>-<slug>.md` con secciones obligatorias en orden:

1. **Mision**: que cierra la linea, slice minimo entregable, pendientes
   explicitos fuera de slice.
2. **HU base**: tabla de HU con path absoluto al archivo de la HU y aporte.
3. **Anclaje a evidencia**: SSOT, corpus interno reusable, estado actual del
   codigo (paths concretos).
4. **Archivos permitidos**: bloque `path  TIPO`, donde TIPO es `EDIT aditivo`,
   `LECTURA`, `NUEVO`, etc.
5. **Restricciones de no-colision**: que NO tocar, como evitar choques con
   otras lineas.
6. **Slice minimo shippeable**: subsecciones por capa (modelo, operaciones,
   serializacion, render, OPL, UX, cross-capa) con TS o pseudocodigo cuando
   ayuda.
7. **Tests obligatorios**: unit tests con conteo estimado, smoke browser si
   aplica.
8. **Verificacion**: comandos del repo (`cd app && bun run check`, etc.).
9. **Decisiones bloqueadas (no reabrir)**: lista cerrada con rationale breve.
10. **Decisiones que tomas vos (documentar en commit)**: lista abierta con
    opciones.
11. **Forma del entregable**: commits sugeridos con prefijos, co-author footer,
    qué no tocar.

### 7. Generar prompt de asignacion

`prompt-asignacion.md` contiene:

- Plantilla generica con `{{LINEA}}` y `{{PATH_BRIEF}}` placeholders.
- Reglas duras comunes citadas (no negociables).
- Loop verde obligatorio.
- Forma del entregable (hashes, tests, decisiones, bloqueos).
- Invocaciones concretas listas para copia-pega, una por linea.
- Notas operativas sobre aislamiento (worktrees), coherencia metodologica,
  reporte unificado.

## Reglas Duras

- Cada linea ancla HU especificas del backlog vivo. No inventar.
- Cambios solo aditivos como filosofia operativa de la ronda.
- Reuso obligatorio del corpus interno (`opm-extracted/` y similares) y SSOT.
  No reinventar la rueda.
- Tabla de colisiones explicita en README, sin celdas ambiguas.
- Cada decision semantica cita SSOT o documento canonico interno con id de
  seccion.
- Modularidad por dominio: archivos disjuntos cuando hay dominio nuevo.
- 11 secciones obligatorias en cada brief, en orden.
- No tocar HANDOFF.md ni `docs/historias-usuario-v2/` desde la skill.
- Idiomas: documentos en es-CL; identificadores y comandos en forma original.
- Loop verde obligatorio en cada brief con comandos del repo.
- Si una linea propone violar una regla comun del README, la skill rechaza la
  particion y propone reescribirla.

## Alcance De Despliegue

Esta skill se despliega **solo en `/home/felix/projects/deep-opm-pro`**:

- `<repo>/.claude/skills/lineas-paralelas/SKILL.md`
- `<repo>/.codex/skills/lineas-paralelas/SKILL.md`
- `<repo>/.opencode/skills/lineas-paralelas/SKILL.md`

No instalar en `~/.claude/skills/`, `~/.codex/skills/` ni
`~/.opencode/skills/` globales. La SSOT del SKILL.md fuente vive en
`~/kora/artifacts/skills/dev/lineas-paralelas/SKILL.md`; las proyecciones
runtime se mantienen sincronizadas con el toolchain
`python3 toolchain/kora transmute --target {target} --agent dev/lineas-paralelas`.

## Salida Esperada

Un directorio `<repo>/docs/instrucciones-lineas-dev/<ronda>/` completo:

```
<ronda>/
├── README.md                    (orquestacion de la ronda)
├── linea-1-<slug>.md            (brief autocontenido linea 1)
├── linea-2-<slug>.md            (brief autocontenido linea 2)
├── ...
├── linea-N-<slug>.md            (brief autocontenido linea N)
└── prompt-asignacion.md         (plantilla + invocaciones por linea)
```

Reporte breve al operador al cerrar:

- Tabla de N lineas con titulo, HU eje, riesgo y archivo dominio nuevo.
- Orden de merge sugerido con rationale en una linea.
- Metricas esperadas post-ronda (tests, smoke, build) si el repo las define.
- Confirmacion de regla "no tocar HANDOFF" cumplida.
