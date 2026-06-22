# ADR-005: OPM Graph Generator as the primary product slice

| Campo | Valor |
|-------|-------|
| Fecha | 2026-04-11 |
| Estado | **Vigente** — actualizado 2026-04-16 con ADR-008 |
| Precede | ADR-003, ADR-004 |
| Complementado por | ADR-008 (19-jointjs-renderer-adr) |
| Autor | Felix (Ominono) + steipete |

> **Actualizacion 2026-04-16**
>
> La tesis central de esta ADR se confirma: el Generator sigue siendo la surface primaria del producto. El pipeline se actualiza para reflejar ADR-008:
>
> **Pipeline original (ADR-005)**:
> ```text
> intent capture / wizard → SdDraft → SemanticKernel → ValidationReport → OPL → DiagramSpec → SVG/PNG
> ```
>
> **Pipeline actualizado**:
> ```text
> intent capture / wizard → SdDraft → SemanticKernel → ValidationReport → OPL → VisualRenderSpec → joint.dia.Graph → SVG/PNG
> ```
>
> Cambios concretos:
> - `DiagramSpec` queda como artefacto legacy; `VisualRenderSpec` lo reemplaza como frontera kernel → visual
> - `DiagramPreview.tsx` del generator renderiza via `JointDiagramPreview` (no SVG manual)
> - Export SVG/PNG sale de `paper.toSVG()` de JointJS, no del render SVG manual
>
> Los invariantes I1-I5 del ADR original se preservan integramente. Ver tambien Fase 4 de `20-jointjs-execution-plan.md`.

---

## Texto original (2026-04-11, Proposed)

## Problema

`opmodel` tiene un core semántico fuerte, pero la superficie principal sigue cargando demasiado peso en el editor visual. Eso produce fricción alta para el trabajo que más importa ahora:

- construir un SD válido rápido
- refinar a SD1 sin pelear con el canvas
- mantener semántica OPM dura y OPL equivalente
- obtener una salida visual exportable y legible

El editor visual actual sirve como herramienta, pero hoy no es la mejor superficie para convertir una intención de modelado en un artefacto OPM correcto.

## Decisión

Introducir un nuevo slice principal de producto:

```text
OPM Graph Generator
```

Su pipeline canónico será:

```text
intent capture / wizard
  -> SdDraft
  -> SemanticKernel
  -> ValidationReport
  -> OPL
  -> DiagramSpec
  -> SVG/PNG
```

La visualización deja de ser superficie autora primaria. La fuente de verdad sigue siendo la semántica OPM expresada en `SemanticKernel`, gobernada por el corpus SSOT.

## Tesis

No construir “draw.io para OPM”.

Construir una superficie guiada para:

1. describir un sistema
2. producir un SD válido
3. mostrar OPL equivalente
4. derivar un diagrama exportable de alta calidad
5. refinar el proceso principal hacia SD1

La referencia de UX no es un canvas libre sino una herramienta tipo generador, más cercana a un wizard + renderer que a un editor geométrico pesado.

## Beneficiario

El operador que necesita modelar sistemas reales en OPM con velocidad, claridad metodológica y bajo costo cognitivo.

## Invariantes

### I1. SemanticKernel sigue siendo SSOT

Ninguna decisión visual puede introducir o alterar semántica por fuera del kernel.

### I2. OPL y diagrama son modalidades derivadas

Toda salida del nuevo slice debe poder explicarse desde el mismo kernel:

```text
SemanticKernel -> OPL
SemanticKernel -> DiagramSpec -> SVG
```

### I3. Wizard alineado al corpus

La construcción del SD debe seguir el wizard agnóstico y las reglas del corpus OPM:

- tipo de sistema
- proceso principal
- beneficiario
- valor / estados
- función principal
- agentes
- instrumentos
- inputs / outputs
- contexto
- problem occurrence si aplica
- gate de consistencia

### I4. Validación visible, no implícita

La superficie debe exponer qué reglas pasan o fallan. No se acepta “parece OPM” como criterio suficiente.

### I5. Refinamiento explícito

La transición de SD a SD1 debe ser una acción explícita y guiada, no una expansión visual arbitraria.

## No objetivos de esta ADR

- reemplazar de inmediato el editor visual actual
- eliminar el canvas existente
- abrir edición visual libre compleja como camino principal
- resolver toda la profundidad de refinamiento más allá de SD1 en el primer corte
- introducir colaboración multiusuario
- mezclar esta línea con simulación rica o system mapping genérico

## Consecuencias positivas

- menor fricción de entrada
- producto más alineado con la metodología real de OPM
- mejor leverage del core semántico ya construido
- visualización más pulida sin degradar semántica
- camino claro para exportación y handoff

## Costos

- nueva superficie web
- nuevos contratos intermedios (`SdDraft`, `ValidationReport`, `DiagramSpec`)
- trabajo de integración entre wizard, kernel, renderer y export
- convivencia temporal con el editor actual

## Superficies afectadas

- `packages/core/`
- `packages/web/`
- `docs/opl-first/`
- fixtures en `tests/`

## Criterio de éxito del slice

Esta ADR se considera validada cuando el sistema puede, para al menos 3 casos reales:

1. capturar intención o wizard input
2. construir un SD válido
3. renderizar OPL equivalente
4. derivar un SVG legible y exportable
5. refinar el proceso principal a SD1
6. mostrar validación explícita en cada paso

## Resumen corto

El siguiente movimiento correcto no es seguir empujando el canvas como centro del producto.

El siguiente movimiento correcto es abrir una nueva superficie principal, guiada y semántica, donde `opmodel` genere OPM real desde intención hacia `SemanticKernel`, y desde ahí derive OPL y diagrama.