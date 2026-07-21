# Línea 2 — Registro, corpus y cobertura

## 1. Misión

Construir en archivos nuevos el motor determinista mínimo, el corpus tipado y los tres registros verificables para Cortes 2A y 3B–7C. El slice paralelo no integra hubs UI: entrega API pura, tests y manifiesto listos para que la raíz conecte secuencialmente.

## 2. HU base

| Contrato | Path absoluto | Aporte |
| --- | --- | --- |
| Diseño aprobado, §§8, 10–15 | `/home/felix/projects/deep-opm-pro/docs/superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md` | Arquitectura, cobertura, límites y gates |

No hay HU tutor viva. Está prohibido inventarla; los `capabilityId` trazan capacidades reales, no backlog ficticio.

## 3. Anclaje a evidencia

- Leer los catálogos vivos: acciones contextuales, atajos, paleta, Inspector, OPL, diagnóstico, simulación y persistencia.
- `opm-extracted/INDEX.md`, `MODULES.md` y `REFACTOR-NOTES.md` ya fueron auditados: reutilizar taxonomía conceptual/assets cuando encaje, no su arquitectura Angular.
- Toda entrada cita una fuente del resolver; la lente categorial solo usa preservación/composición.

## 4. Archivos permitidos

```text
app/src/tutor/tipos.ts                  NUEVO exclusivo
app/src/tutor/politica.ts               NUEVO exclusivo
app/src/tutor/fuentes.ts                NUEVO exclusivo
app/src/tutor/contenidos.ts             NUEVO exclusivo
app/src/tutor/capacidades.ts            NUEVO exclusivo
app/src/tutor/escenarios.ts              NUEVO exclusivo
app/src/tutor/*.test.ts                 NUEVO exclusivo
app/src/tutor/index.ts                  NUEVO exclusivo
docs/**manifest*tutor*.json|md           NUEVO si se genera de forma reproducible
app/src/ui/App.tsx                       LECTURA
app/src/ui/CommandPalette.tsx            LECTURA
app/src/store/**                         LECTURA
```

## 5. Restricciones de no-colisión

- No editar `App.tsx`, `CommandPalette.tsx`, store, serialización, Inspector, OPL ni diagnóstico.
- No crear un payload genérico de “capacidad”; snapshots discriminados solo cuando existen dos usos reales.
- No duplicar copy persistente del diagnóstico.
- No exponer acción para estados `reference-only`, `external` o `absent`.

## 6. Slice mínimo shippeable

### Modelo

Sin mutaciones del modelo. Tipos del tutor son proyecciones efímeras.

### Política

Función pura y total, variante `silent`, prioridad estable y deduplicación por `intentId/resultId`.

### Registro

`CapabilityDescriptor`, `TutorContent` y `TutorScenario` unidos por `capabilityId`; inventario honesto de todas las familias de §11.2.

### Corpus

Entradas breves `Ahora`/`Criterio`/`Fundamento`, lentes explícitas, referencias resolubles, sin copiar matrices normativas.

### Cross-capa

Exportar selectores/consultas que la raíz pueda integrar en una anotación existente y Ctrl+K sin store espejo.

## 7. Tests obligatorios

- Totalidad y determinismo del motor.
- Máximo una intervención visible por intención/resultado.
- Idempotencia/orden canónico de lentes.
- Toda entrada con fuente válida y propietaria.
- Gate descriptor/contenido/escenario.
- Ausentes/referencia/externos sin CTA.
- Catálogo completo y exenciones justificadas.

## 8. Verificación

```bash
cd /home/felix/projects/deep-opm-pro/app
bun test src/tutor
bun run typecheck
bun run check
```

## 9. Decisiones bloqueadas

- Cero red/LLM/telemetría.
- Una sola voz; `silent` es salida válida.
- `PanelDiagnostico` sigue siendo dueño de issues.
- OPM general es base fija; lentes especializadas son combinables.
- Caso probabilístico C, PDF/diff/merge/IA permanecen no vivos.

## 10. Decisiones que tomas vos

- La mínima unión discriminada que cubra dos familias reales sin armazón vacío.
- Granularidad de `capabilityId` suficiente para auditar entrypoints sin escanear JSX.
- Formato reproducible del manifiesto de fuentes y mecanismo de resolución de anclas.

Reportar cualquier capacidad viva no clasificable antes de ampliar tipos.

## 11. Forma del entregable

Un commit candidato `feat(tutor): registrar corpus y capacidades vivas`, sin integrar UI compartida. Entregar hash, archivos, tests, gaps y una nota explícita de que no se tocó HANDOFF ni producto fuera de `src/tutor`.

