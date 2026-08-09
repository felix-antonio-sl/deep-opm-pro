# Decisiones técnicas vigentes

Índice de las decisiones que todavía condicionan desarrollo, operación o arquitectura.
El objetivo es resolver rápido qué documento manda sin convertir actas históricas en una
segunda fuente de estado.

## Precedencia

1. [AGENTS.md](../../AGENTS.md) gobierna límites, arquitectura y entrega local.
2. El canon OPM/Forja se resuelve desde KORA mediante
   [canon-opm/resolutor-urn.json](../canon-opm/resolutor-urn.json).
3. [ui-forja/GOVERNANCE.md](../../ui-forja/GOVERNANCE.md) gobierna estética y chrome
   bajo la precedencia semántica OPM.
4. Las especificaciones citadas por código/tests conservan contratos de realización.
5. Actas y auditorías explican por qué se eligió una dirección; no prueban estado actual.

## Mapa de decisiones

| Materia | Decisión vigente | Fuente |
|---|---|---|
| frontera del producto | opforja implementa la mesa; los modelos de dominio viven y se gobiernan fuera | [AGENTS.md](../../AGENTS.md) |
| dependencias | `modelo -> store -> app`; UI y render consumen `app` | [AGENTS.md](../../AGENTS.md) |
| bimodalidad | todo cambio semántico revisa forward y reverse OPD/OPL | [AGENTS.md](../../AGENTS.md) |
| LLM | el razonamiento asistido vive fuera del kernel; la gestión determinista permanece dentro | [EQUILIBRIO](equilibrio-llm.md) |
| dominio ↔ mesa | contratos de importación/exportación, sin rutas ni autoridad de dominio embebidas | [Acta de flujo canónico](../auditorias/2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md) |
| identidad | auth v1 usa cuenta durable, sesión y aislamiento por tenant; no es auth multiusuario completa | [Spec auth v1](../specs/auth-identidad-v1.md) |
| orden in-zoom | `ordenInzoom` conserva bandas y sincronización bimodal; no se reemplaza por rayos redundantes | [Invocación implícita](../specs/2026-06-14-invocacion-implicita-bimodal-design.md) y [sincronización canvas](../specs/2026-06-15-orden-inzoom-canvas-sync-design.md) |
| Anclaje | Calcar desacopla; Anclar mantiene vínculo; Pieza es el referente; el drift es aviso, no decisión | [Actas de Anclaje](../auditorias/README.md#decisiones-con-referencia-viva) |
| ciclo de modelamiento | Apunte/Modelo y Boceto/OPD integrado son ciclos distintos y reversibles | [Contrato del ciclo](../superpowers/specs/2026-07-27-taller-modelos-ciclo-reversible-design.md) |
| Tutor | proyección determinista y contextual; no duplica modelo, diagnóstico ni corpus | [Diseño del Tutor](../superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md) |
| despliegue | solo `./deploy/deploy.sh` estampa y despliega una versión trazable | [Runbook](../deploy/opforja.md) |

## Cómo mantener este índice

- Añadir una fila solo si una decisión cambia conducta futura o arbitra una tensión real.
- Si una decisión es reemplazada, actualizar la fila hacia su sucesora y archivar el
  operativo anterior; Git conserva la deliberación.
- No copiar el contenido completo de una spec o acta. Este archivo orienta y enlaza.
