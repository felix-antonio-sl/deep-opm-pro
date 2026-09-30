# Próximo corte de opforja

La iniciativa activa es el [producto integrado de opforja](../specs/opforja-producto-integrado.md),
abierta por decisión del operador. Su [registro de implementación y aceptación](implementacion-producto-integrado.md)
conserva el resultado de los seis incrementos y su evidencia de integración:
agente, cambios reversibles, continuidad, revisión compartida, escenarios,
recuperación y piezas reutilizables.

El candidato está implementado localmente, sin despliegue. Quedan la prueba con
la API real seleccionada, la evaluación con personas y la aceptación operativa.
I1 cierra con A01–A07, A20 y A22–A24: una suite con respuestas controladas no
satisface ese cierre. El estado implementado se observa
en Git, tests, el [índice de bugs](../bugs/INDEX.md) y `cd app && bun run cordon:estado`.

Se abre trabajo solo ante una de estas señales:

1. un bug reproducible que afecte modelamiento, persistencia, comprensión o recuperación;
2. evidencia de uso real que muestre fricción o una decisión mal soportada;
3. una decisión explícita del operador sobre una capacidad ausente.

Las brechas normativas activas y fronteras sin testigo completo viven en el
[registro de conformidad SSOT](registro-conformidad-ssot.md). No son un calendario ni
se convierten en backlog por existir.

Mantén aquí el resultado observable y criterio del corte activo. Al cerrarlo,
retira esa dirección o identifica el siguiente corte sustentado: Git conserva la historia.
