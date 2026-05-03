# Sprint 0 - Reset controlado de app

**Fecha:** 2026-05-03
**Estado:** base implementada

## Intent

Reiniciar `app/` como implementacion limpia, no reiniciar el repo. El valor se
conserva en `assets/`, `fixtures/`, `catalog/`, `docs/JOYAS.md`, SSOT y
`docs/historias-usuario-v2/`.

## Blast radius

Medio. Toca `app/` y documentacion local, pero es reversible mientras `app/`
actual siga sin commitear o se archive antes de borrar.

## Corte tecnico inicial

1. Modelo minimo:
   - `Modelo`
   - `OPD`
   - `Entidad`
   - `Apariencia`
   - `Enlace`
2. Operaciones atomicas:
   - crear objeto
   - crear proceso
   - renombrar cosa
   - cambiar esencia
   - cambiar afiliacion
   - crear enlace legal basico
3. OPL forward:
   - D1-D4 para cosas
   - RF1/H1/H2/T1-T3 basicos segun enlace
4. Serializacion:
   - export JSON canonico minimo
   - import/hidratacion laxa desde el mismo JSON
5. Render:
   - Object rect 135x60
   - Process ellipse 135x60
   - wrapper+line 15px/2px
   - colores y tipografia de `docs/JOYAS.md`
6. Tests:
   - modelo
   - OPL
   - serializacion round-trip

## No hacer en Sprint 0

- No implementar todo EPICA-10.
- No implementar OPD tree completo.
- No persistir IndexedDB todavia si bloquea el slice.
- No crear schemas paralelos a mano.
- No copiar arquitectura OPCloud ni codigo de `decompiled/`.

## Resultado esperado

Un vertical slice pequeno que permita construir encima sin deuda temprana:

`fixture reducido -> modelo -> render -> OPL -> JSON -> hidratacion -> tests`

## Frontera

Ver `docs/roadmap/jointjs-boundary.md`: la frontera ya se cruzo y existe un
adapter minimo JointJS que conserva `Modelo` como fuente de verdad.

## Verificacion actual

Comandos verdes en `app/`:

- `bun run check`
- `bun run build`
- `bun run browser:smoke`
