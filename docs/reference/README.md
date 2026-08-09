# Referencias históricas

Material importado o preservado para investigación técnica. No gobierna el producto ni
reemplaza el canon KORA, las especificaciones vigentes o el comportamiento probado de
`app/`.

## Colecciones

| Ruta | Procedencia | Uso permitido |
|---|---|---|
| `opm-model-app/` | repositorio legado decomisionado | rastrear decisiones, reglas y schema anteriores |
| `opmodel/` | línea histórica OPL-first | comprender alternativas arquitectónicas y ADR previos |

`docs/JOYAS.md`, `opm-extracted/`, `assets/`, `fixtures/`, `config/` y `catalog/`
permanecen fuera de esta carpeta porque la implementación los consulta por rutas
estables. Tienen el mismo carácter de evidencia: informan, pero no gobiernan.

Las colecciones importadas son deliberadamente incompletas: algunos enlaces internos
apuntan a schemas, ejemplos, scripts o carpetas que no se migraron. Esos destinos no se
reconstruyen ni se interpretan como dependencias activas.

## Regla de uso

1. Confirmar primero si la respuesta vive en KORA, `AGENTS.md`, los manuales, las
   especificaciones activas o el código probado.
2. Usar esta carpeta solo como antecedente o evidencia comparativa.
3. No copiar una regla, API o decisión al árbol vivo sin revalidarla contra la autoridad
   actual y traducirla a una capacidad general de opforja.
4. Citar procedencia y fecha cuando una referencia histórica afecte una decisión nueva.
