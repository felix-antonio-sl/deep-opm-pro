# Próximo corte de opforja

No hay una iniciativa funcional abierta. El estado operativo se observa en Git, tests,
el [índice de bugs](../bugs/INDEX.md) y `cd app && bun run cordon:estado`.

Se abre trabajo solo ante una de estas señales:

1. un bug reproducible que afecte modelamiento, persistencia, comprensión o recuperación;
2. evidencia de uso real que muestre fricción o una decisión mal soportada;
3. una decisión explícita del operador sobre una capacidad ausente.

Las brechas normativas activas y fronteras sin testigo completo viven en el
[registro de conformidad SSOT](registro-conformidad-ssot.md). No son un calendario ni
se convierten en backlog por existir.

Cuando se abra un corte, edita esta fuente estable con su resultado observable y
criterio de cierre. Al cerrarlo, retira esa dirección: Git conserva la historia.
