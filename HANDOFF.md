# Handoff — estado operativo de opforja

**Fecha de corte:** 2026-08-09

**Arquetipo:** repositorio de desarrollo

**Baseline evaluado:** `main` = `origin/main` = `2e7246a6`

**Build productivo observado:** `2761196a`

Este documento es una fotografía operativa, no una bitácora. Git conserva la
historia y el [roadmap](docs/roadmap/roadmap-2026-08-09.md) conserva solo dirección futura.

## Resumen ejecutivo

opforja está operativo como modelador OPM/ISO 19450 con edición bimodal OPD/OPL,
persistencia PostgreSQL, autenticación, exportación, Tutor contextual y ciclo reversible
entre Taller, Modelos, Apunte/Modelo y Boceto/OPD integrado.

No existe un corte funcional abierto que deba continuarse por inercia. La próxima línea
de producto requiere evidencia de uso, un bug reproducible o una decisión explícita del
operador. Publicar Git, desplegar la aplicación y promover un modelo externo siguen
siendo gates distintos.

## Estado por capa

| Capa | Estado al 2026-08-09 | Evidencia y límite |
|---|---|---|
| Fuente | `main` y `origin/main` coincidían en `2e7246a6`; árbol limpio antes de este corte documental | comprobación Git local; no prueba producción |
| Aplicación | sin cambios de lógica; este corte modifica tres fuentes documentales del corpus Tutor y sus huellas | el corpus local se regeneró; producción no contiene aún este corte |
| Producción | build `2761196a`; `/healthz` correcto; sesión anónima `401` esperada | sonda no autenticada; no prueba escritura ni recorrido humano |
| Canon | reglas 1.5.0, OPD 1.4.0, OPL 1.4.1, método 1.7.0 y capa categorial 1.3.0 | versiones observadas por el cordón y el resolutor local |
| Skills | emisiones Claude Code y Codex de `modelamiento-opm` 2.1.0 con sello esperado | identidad y procedencia; equivalencia semántica aún requiere revisión humana |
| Tutor | corpus schema 2, renderer 3 y 28 fuentes; corpus local regenerado con los manuales vigentes | producción conserva el corpus del build `2761196a` hasta un despliegue separado y autorizado |
| Documentación | navegación y vigencia consolidadas en el corte del 2026-08-09 | la guía de uso no tiene un comparador exhaustivo contra toda la interfaz |

## Capacidades cerradas que no se reabren sin regresión

- edición OPD/OPL y roundtrip con rechazo visible de pérdidas conocidas;
- persistencia con revisión y conflicto explícito, sin última escritura silenciosa;
- autenticación single-operator y separación por tenant del corte v1;
- diagnóstico, búsqueda, Inspector, paleta y chrome de gestión;
- Tutor contextual determinista, local y sin segundo modelo de estado;
- ciclo Apunte ⇄ Modelo mediante Graduar/Reabrir;
- ciclo Boceto ⇄ OPD integrado mediante Integrar/Devolver;
- Calcar, Anclar, Pieza y Centinela de Drift;
- corpus Tutor propagado a 28 fuentes en el último despliegue verificado;
- dirección de dependencias `modelo -> store -> app`, con UI y render como consumidores.

Integrar o graduar no certifica corrección del dominio. Una suite verde tampoco reemplaza
la validación humana del modelo ni autoriza su promoción fuera de este repositorio.

## Contratos vigentes

| Materia | Fuente |
|---|---|
| trabajo local, límites y verificación | [AGENTS.md](AGENTS.md) |
| mapa documental y precedencia | [docs/README.md](docs/README.md) |
| semántica OPM/Forja | KORA Pneuma, resuelta por [canon-opm](docs/canon-opm/resolutor-urn.json) |
| interfaz y estética | [ui-forja/GOVERNANCE.md](ui-forja/GOVERNANCE.md) |
| operación y despliegue | [deploy/opforja.md](docs/deploy/opforja.md) |
| especificaciones realizadas que aún gobiernan | [specs/README.md](docs/specs/README.md) |
| decisiones técnicas | [decisiones/README.md](docs/decisiones/README.md) |
| brechas normativas | [registro de conformidad](docs/roadmap/registro-conformidad-ssot.md) |
| defectos activos | [bugs/INDEX.md](docs/bugs/INDEX.md) |

## Brechas y riesgos vigentes

- **Out-zoom:** capacidad ausente y declarada; no abrir sin caso productivo.
- **Abanicos:** `R-FAN-5A` cubre entrada común y salidas alternativas. Otras formas
  permanecen fail-closed hasta que exista doctrina versionada.
- **Probabilidad sin pesos:** el modelo no distingue todavía la intención
  probabilística con pesos pendientes de una alternativa ordinaria.
- **Coedición:** el control de revisión evita sobrescritura silenciosa, pero no fusiona
  intenciones concurrentes.
- **Auth v2:** invitaciones, roles efectivos y administración multiusuario no forman
  parte del corte v1.
- **Seguridad web:** la CSP productiva conserva `'unsafe-inline'` y `'unsafe-eval'`;
  los headers presentes no equivalen a endurecimiento completo.
- **Accesibilidad:** existen gates y recorridos automatizados; no hay acreditación con
  lector de pantalla real ni auditoría WCAG completa.
- **Documentación ↔ producto:** hay leyes editoriales y E2E parciales, pero no un
  testigo de todas las afirmaciones de `uso-productivo.md`.
- **Canon ↔ skill:** el sello prueba versión e identidad, no equivalencia semántica
  integral.
- **Estado fuente ↔ producción:** `cordon:estado` compara el `HEAD` confirmado con
  producción. No demuestra que este corte documental sin commit ni sus fuentes Tutor
  regeneradas estén desplegados.

## Límites de autoridad

- Este repositorio implementa la mesa de modelamiento; no gobierna modelos de dominio.
- No se hardcodean rutas, etiquetas ni prioridades de repositorios externos.
- Un fixture externo puede revelar una capacidad general o una regresión; no se
  convierte por eso en contrato de producto.
- No se ejecutó despliegue, migración, `mesa push`, promoción de modelos ni escritura
  productiva durante este corte documental.

## Próxima llegada

1. Leer [AGENTS.md](AGENTS.md), este handoff y el
   [roadmap vigente](docs/roadmap/roadmap-2026-08-09.md).
2. Comprobar Git y ejecutar `cd app && bun run cordon:estado` antes de citar SHA,
   producción o deriva.
3. Elegir un corte solo si existe bug reproducible, evidencia de uso o decisión humana.
4. Ejecutar el gate focal correspondiente y ampliar según riesgo.
5. No desplegar sin autorización explícita ni confundir despliegue con promoción de
   modelos externos.
