# Chrome de gestión: gestor de modelos/carpetas + paleta Cmd+K — diseño (Corte D)

**Fecha:** 2026-07-06 · **Estado:** diseño para aprobación del operador · **Mandato:** simple, intuitivo y elegante (operador, 2026-07-06). Absorbe y ejecuta las evidencias m-2 y m-5/M-5 de la auditoría Jobs 2026-06-12. Validación de detalle visual por `steve-jobs` dentro del corte (patrón PUERTA).

## 1. Gestor de modelos y carpetas — UNA superficie honesta

Reemplaza el diálogo «Abrir modelo» actual (dos buscadores apilados, vacíos duplicados sin CTA, sección «JSON» ambigua, footer sin primario — m-2).

- **Un solo buscador** arriba, que filtra todo lo visible (mata los dos apilados).
- **Sidebar mínima** a la izquierda: `Todas` · carpetas del workspace · `Archivo`. Crear/renombrar carpeta al pie de la sidebar. Arrastrar una fila a una carpeta la mueve.
- **Lista única con bandas por especie**, en este orden: **Apuntes** (fuera de carpetas por diseño, orden por recencia) · **Modelos** (de la carpeta activa) · **Bibliotecas**. Chip discreto de especie por fila (el badge «Apunte» y el flag biblioteca existen).
- **Fila**: nombre · chip especie · revisión/fecha. Acciones al hover: `Abrir` (primario; Enter/doble-click) · `En pestaña nueva` · `Duplicar` · `Archivar` · `Eliminar` (con confirmación nombrando el costo). Lo destructivo vive AQUÍ, no en el CLI (spec del puente §4).
- **Vacíos con CTA**: un solo estado vacío por contexto — «Aún no hay modelos aquí. **Nuevo modelo** · **Nuevo apunte** · **Importar JSON**».
- **«Importar JSON» = acción del encabezado**, no sección (mata la sección «JSON»).
- **Footer con primario visual** real (mata «Cancelar Abrir» plano).
- Copy es-CL llano en todo el diálogo (M-5: cero jerga interna, cero bilingüismo).

## 2. Paleta Cmd+K — comandos por intención

- **Agrupación por intención**, con la sección contextual PRIMERO: si hay selección, sus verbos arriba (`Selección: Facturar` → renombrar, estados, refinar, anclar…); luego `Crear` · `Navegar` · `Vista` · `Exportar` · `Modelo` · `Sistema`.
- **Recientes/frecuentes** al tope cuando el buscador está vacío.
- **Deduplicación** (m-5: `Ctrl+T` aparece en dos comandos — queda uno) y auditoría de microcopy: cada comando en es-CL llano, verbo primero, sin jerga (M-5).
- **Atajo visible** a la derecha de cada comando; coincidencia difusa <<búsqueda tolerante a errores y abreviaciones>> con sinónimos en español.
- La paleta **no duplica** la búsqueda de cosas del modelo: `Ctrl+F` sigue siendo esa casa; la paleta muestra el hint cuando el texto no coincide con comandos.
- Escala: el inventario de comandos se audita al construir (los cortes recientes agregaron verbos — Piezas, anclaje, apuntes — que deben caer en sus grupos, no al final de una lista plana).

## 3. Orden y dependencias

Después del Corte B′ (las bandas por especie del gestor asumen apuntes de primera clase). Ejecuta de paso la porción m-2/m-5/M-5 del frente C′; el resto de C′ (M-3, M-4, M-6, m-1/m-3/m-4/m-6) sigue en su re-auditoría propia.

## 4. Leyes y verificación

- e2e del gestor: buscador único filtra las tres bandas; CTA en vacío; eliminar exige confirmación nombrada; drag a carpeta persiste en el workspace.
- e2e de la paleta: sección contextual aparece solo con selección; cero atajos duplicados (test de inventario); todo comando pertenece a un grupo.
- `design:governance` + smoke; copy auditado contra M-5.
