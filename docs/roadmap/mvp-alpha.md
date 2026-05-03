# MVP-alpha

**Fecha:** 2026-05-03
**Estado:** activo

## Objetivo

Cerrar un kernel OPM editable, persistible y verificable sin repetir la ameba
del desarrollo anterior.

## Epicas foco

| Epica | Archivo | Rol |
|---|---|---|
| EPICA-10 | `docs/historias-usuario-v2/epicas/epica-10-canvas-creacion-cosas.md` | Crear cosas, nombrar, esencia, afiliacion, enlace inicial |
| EPICA-11 | `docs/historias-usuario-v2/epicas/epica-11-canvas-modelado-basico.md` | Links basicos, agregacion, agente, instrumento, propiedades minimas |
| EPICA-20 | `docs/historias-usuario-v2/epicas/epica-20-estructura-arbol-opd.md` | Modelo multi-OPD y navegacion primaria |
| EPICA-30 | `docs/historias-usuario-v2/epicas/epica-30-persistencia-save-load.md` | Save/load, versiones minimas, round-trip |
| EPICA-50 | `docs/historias-usuario-v2/epicas/epica-50-opl-pane.md` | OPL reactivo como lente textual primaria |

## Criterio de salida

- Crear Object y Process en un SD inicial.
- Separar entidad logica y apariencia visual desde el modelo.
- Crear enlaces legales por firma basica.
- Generar OPL-ES reactivo para cosas y enlaces basicos.
- Serializar e hidratar el modelo sin perdida.
- Renderizar con dimensiones, colores, tipografia y wrapper+line de `docs/JOYAS.md`.
- Cargar al menos un fixture reducido de regresion.
- `cd app && bun run check` verde.

## Reglas de alcance

- Sin colaboracion, backend, Firebase ni autenticacion.
- Sin simulacion, runtime externo, GenAI, requirements ni analisis.
- Sin construir una ontologia paralela de reglas locales.
- Toda regla operacional nueva vive cerca del codigo que la ejecuta, con cita SSOT.
