# Especificaciones de opforja

Índice único de especificaciones con valor vigente. Algunas rutas se conservan bajo
`../superpowers/specs/` porque código y tests las citan; el nombre del directorio es
procedencia histórica, no una herramienta requerida para mantener el producto.

## Contratos vigentes o citados por implementación

| Especificación | Estado documental | Alcance que conserva |
|---|---|---|
| [Auth/identidad v1](auth-identidad-v1.md) | vigente | cuenta, sesión, tenant y operación single-operator |
| [Invocación implícita bimodal](2026-06-14-invocacion-implicita-bimodal-design.md) | realizada y citada | representación de `ordenInzoom` y simetría OPL |
| [Sincronización canvas→orden](2026-06-15-orden-inzoom-canvas-sync-design.md) | realizada y citada | cuarta cara de la bimodalidad del orden |
| [Centinela de Drift](../superpowers/specs/2026-06-26-corte-centinela-drift-ui-design.md) | realizada y citada | estado derivado, aviso y recuperación de Anclaje |
| [Gesto de Anclar](../superpowers/specs/2026-06-29-gesto-anclar-puerta-design.md) | realizada y citada | fundación Calcar/Anclar desde la interfaz |
| [Modo Apunte](../superpowers/specs/2026-06-30-modo-apunte-design.md) | realizada y citada | especie, persistencia y degradación controlada |
| [Apuntes y Taller](../superpowers/specs/2026-07-06-apuntes-taller-design.md) | base histórica aún referida | decisiones de kernel e integridad absorbidas por el ciclo sucesor |
| [Puente mesa↔skill](../superpowers/specs/2026-07-06-puente-directo-mesa-skill-design.md) | histórico parcial citado | vitrina y contrato del protocolo implementado; auth posterior prevalece |
| [Tutor contextual](../superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md) | realizada y enmendada | arquitectura y corpus del Tutor; el ciclo del 2026-07-27 prevalece |
| [Taller, Modelos y ciclo reversible](../superpowers/specs/2026-07-27-taller-modelos-ciclo-reversible-design.md) | contrato vigente realizado | vocabulario, reversibilidad, propagación y cierre GO |

## Reemplazos y precedencia

- El contrato del [ciclo reversible](../superpowers/specs/2026-07-27-taller-modelos-ciclo-reversible-design.md)
  reemplaza el vocabulario visible, gestor y reversibilidad del diseño de Apuntes/Taller.
- Auth v1 y el [manual de opforja](../manual-opforja.md) prevalecen sobre las secciones
  históricas de autenticación del puente mesa↔skill.
- La implementación y sus tests deciden estado y qué parte de un diseño está
  materializada; ninguna spec realizada se interpreta como tarea pendiente.

## Material retirado el 2026-08-09

Se desplazaron a `_archivo/`:

- la alternativa `mobile-readonly-v1`, porque no tenía consumidores y el corte mobile
  ya figura cerrado en el producto;
- las specs de chrome de gestión e Inspector legible, porque sus contratos ya están
  realizados y cubiertos por `ui-forja/`, tests y Git.
- la spec del compuesto opforja, porque su control plane ya está realizado y sus
  contratos vigentes fueron absorbidos por `AGENTS.md`, el registro de conformidad y
  los comandos ejecutables.

No se editaron esos documentos históricos durante el traslado.
