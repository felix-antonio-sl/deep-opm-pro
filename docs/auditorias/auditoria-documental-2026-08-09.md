# Auditoría documental de opforja

**Fecha de corte:** 2026-08-09

**Arquetipo:** repositorio de desarrollo

## Veredicto

El árbol activo quedó reducido a orientación, contratos vigentes, decisiones técnicas,
operación, aprendizaje, referencias y dirección futura con un propietario explícito por
materia. En ese corte se creó una instantánea operativa, retirada después al cerrar el
trabajo; Git conserva esa evidencia. La próxima dirección vive en el
[roadmap](../roadmap/roadmap-2026-08-09.md); las specs realizadas, actas y auditorías
históricas ya no se interpretan como backlog.

## Intervención

- se reescribieron el README raíz, el índice documental y el índice `ui-forja` como
  entradas para una persona o agente sin contexto;
- se crearon índices para decisiones, specs, referencias, notas técnicas y la ruta
  histórica `superpowers/specs`;
- se separó la decisión EQUILIBRIO de su acta y se conservó como decisión durable;
- se sustituyeron la continuidad histórica por una instantánea raíz temporal y el
  roadmap anterior por el corte del 2026-08-09;
- se archivaron 23 artefactos sin editar: planes ejecutados, prompts, notas de sesión,
  auditorías cerradas, specs reemplazadas, una solicitud upstream resuelta y el reporte
  productivo del 2026-07-27;
- se redujo el registro de conformidad a brechas declaradas o controles que todavía
  tienen un consumidor verificable;
- se corrigieron punteros de estado, autoridad `AGENTS.md`/`CLAUDE.md`, marca opforja,
  runbook de rollback y límites entre producto, canon, dominio y producción.

## Consecuencias técnicas controladas

Tres documentos editados son fuentes del corpus Tutor. Sus huellas SHA-256 se
actualizaron en `app/src/tutor/fuentes.ts`, el corpus se regeneró y el build lo consumió
sin cambiar lógica de producto.

Las sondas visuales heredadas ya no sobrescriben un reporte operativo activo sin fecha:
generan `_reporte.md` junto a sus resultados efímeros en `app/test-results/`. Una ley
ejecutable del corpus protege ese límite.

## Evidencia

- `bun run check`: typecheck y 3410 pruebas aprobadas, 0 fallos;
- `bun run lint`: 0 errores;
- `bun run build`: corpus regenerado y build Vite aprobado;
- `bun run design:governance`: 3 pruebas aprobadas y auditoría `OK`;
- auditoría local: 84 documentos Markdown activos, 0 enlaces locales rotos y 0 H1
  inválidos; `CLAUDE.md` se excluye porque es un adaptador de una línea;
- `git diff --check`: aprobado, sin whitespace final en archivos intervenidos;
- `bun run cordon:estado`: 4 pruebas aprobadas, canon y skills resueltos, producción
  saludable y árbol local declarado con cambios.

## Límites y decisiones pendientes

- No hubo prueba humana exhaustiva de navegación documental ni validación del modelo
  OPM mediante la interfaz.
- No se ejecutaron E2E de navegador porque no cambió comportamiento ni interacción; las
  escenas estáticas solo recibieron normalización editorial.
- El baseline conserva siete rutas históricas inexistentes en comentarios de código
  (`estados-ciudadania`, `capa-categorial`, tres instrucciones `ronda9`, una épica de
  simulación y una derivación de Anclaje). No rompen build ni navegación documental,
  pero requieren decidir si se reconstruye su procedencia o se retiran esas citas.
- No se hizo commit, push, despliegue, migración ni escritura productiva.
- Producción conserva el build `2761196a`; este corte local y su corpus Tutor no están
  publicados.
- Las brechas activas y sus gates permanecen en el
  [registro de conformidad](../roadmap/registro-conformidad-ssot.md). Abrir una línea de
  producto todavía requiere evidencia de uso, un bug reproducible o decisión humana.
