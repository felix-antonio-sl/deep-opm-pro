# Chrome de gestión: higiene del gestor + paleta Cmd+K — diseño (Corte D, re-empaquetado)

**Fecha:** 2026-07-06 · **Estado:** aprobado; re-empaquetado por el comité doble (jobs×steipete con `cat-thinking`) y ratificado. **La parte de ESPECIES del gestor se fusionó con B′** (`2026-07-06-apuntes-taller-design.md` §6: dos zonas por rol, chip de rigor in-situ, CTA de una puerta). Lo que queda aquí: la **higiene pura** (adelantada a Ola 1, no depende de doctrina) y la **paleta** (Ola 2 o C′).

## 1. Higiene pura del gestor (Ola 1 — sin especies, ejecuta m-2/m-5/M-5)

- **Un solo buscador** que filtra todo (mata los dos apilados).
- **Sidebar mínima**: `Todas` · carpetas · `Archivo`; crear/renombrar al pie; drag de fila a carpeta.
- **Un solo estado vacío por contexto, con CTA** (el CTA definitivo de una puerta llega con B′⊕D; en Ola 1: «Nuevo apunte · Importar JSON» sobre lo existente).
- **«Importar JSON» = acción del encabezado**, no sección.
- **Footer con primario visual** real.
- **Copy es-CL llano** en todo el diálogo (M-5: cero jerga, cero bilingüismo).
- Acciones por fila al hover: `Abrir` (primario; Enter/doble-click) · `En pestaña nueva` · `Duplicar` · `Archivar` · `Eliminar` (confirmación nombrando el costo). Lo destructivo vive AQUÍ, no en el CLI.

## 2. Paleta Cmd+K — liviana, contextual primero

- **Tres estratos, no seis grupos** (poda jobs): **Contextual a la selección** (sus verbos arriba cuando hay selección) · **Crear** · **el resto por recencia/frecuencia**. La taxonomía pesada de seis grupos muere: solo se veía con el buscador vacío, y ahí mandan contextual + recientes.
- **Deduplicación** (m-5: `Ctrl+T` duplicado → queda uno; test de inventario: cero atajos repetidos).
- **Atajo visible** a la derecha; coincidencia difusa con sinónimos es-CL; microcopy verbo-primero sin jerga (M-5).
- La paleta **no duplica** la búsqueda de cosas (`Ctrl+F` es esa casa); hint cuando el texto no coincide con comandos.
- Auditoría de inventario al construir: los verbos recientes (Piezas, anclaje, apuntes, taller) caen en su estrato, no al final de una lista plana.

## 3. Orden

Higiene (§1) en **Ola 1**, en paralelo con A′-motor (línea propia, radio disjunto: un diálogo). Paleta (§2) en Ola 2 o junto a C′ (tras la re-auditoría in-vivo, que puede reordenar su prioridad).

## 4. Leyes y verificación

- e2e del gestor: buscador único filtra todo; CTA en vacío; eliminar exige confirmación nombrada; drag a carpeta persiste.
- e2e de la paleta: estrato contextual solo con selección; cero atajos duplicados; todo comando pertenece a un estrato.
- `design:governance` + smoke; copy auditado contra M-5.
