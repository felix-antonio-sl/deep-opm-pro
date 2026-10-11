# Cambios del canon 2.2.0

Declaración directa del dueño (DEC47): «nunca tuvimos la norma 2024 disponible. lo hicimos todo con el avance
2015. asegúrate que esté en línea con eso». La revisión 2.1.0 (commit `7edd80f`) se apoyaba en una edición 2024
de la que no se dispuso; se retira. La única fuente del canon es ISO/PAS 19450:2015, el texto entregado por el
dueño (DEC39), que no se versiona en el repositorio.

## Canon

Los cuatro documentos vuelven al contenido de la versión 2.0.0, revisado cláusula por cláusula contra la PAS 2015
(`CAMBIOS-2.0.md`). Sólo cambian tres líneas del frontmatter de cada uno: `version: 2.2.0`, `estado: local` y la
fuente. Se retira todo lo que la 2.1.0 había introducido, sin excepción, porque ninguna corrección de esa revisión
quedó contrastada sólo con la PAS. Con la PAS 2015 la versión 2.0.0 era correcta en, al menos, estos puntos que la
2.1.0 había cambiado:

| Asunto | PAS 2015 | Canon 2.2.0 |
|---|---|---|
| Caracteres de nombre | A.3.2 escribe `'|'` entre comillas en `string character`: es un carácter literal; `_` no figura. | R-OPL-LEX-2 admite letra, dígito, `-`, `|`, `&`, `/` y espacio. |
| Escisión del TS3 | §14.2.2.4.3: «contains more than one subprocess». | R-ESCIND-1 exige asignar entrada y salida cuando hay más de un subproceso. |
| Evento que cruza el contorno | §14.2.2.4.2: el sistémico NO DEBE cruzar; si el origen es ambiental, el modelador DEBERÍA modelar la contingencia. | reglas §8.5 y AP-21 distinguen ambas afiliaciones. |
| Tabla 27 | Sus figuras no están en la fuente. | Matriz con R+R y C+C inválidas, marcada no verificable (DEC44). |
| Glosario | Numeración 3.1–3.76; faltan 3.77–3.83. | Citas con la numeración de la PAS; sin los términos 3.77–3.84 de 2024. |
| Capitalización | B.6.5 existe en la PAS. | Se conserva la cita B.6.5. |

Tampoco se conservan, por depender sólo de 2024: el defecto contextual de esencia primaria, la omisión frente a la
espera (§8.2.3), los conjuntos previo y posterior no vacíos, los procesos persistentes de §7.2.1 NOTA 2, la prueba
objeto-proceso con «mantener», el rótulo de instancia sin «:», las marcas gráficas de estado inicial-final y por
defecto, la punta de la excepción y la duración compacta de D.7. Donde la PAS está resumida, la regla sigue como
en la 2.0.0, con su marca «no verificable» cuando la tenía.

## Fuera del canon

- `CAMBIOS-2.1.md` se elimina; su contenido queda en el historial de Git (commit `7edd80f`) y en DEC46 como
  historia.
- `perfil/` vuelve al texto de la 2.0.0, más dos notas de producto de B-44 en opd-opforja §10.2 y AP-21 y en
  metodo-opforja, ahora fundadas en la PAS: el rechazo del evento ambiental es endurecimiento de producto.
- `docs/conformidad.md` vuelve a la versión posterior a la corrección de B-37 (`ac163e5`):
  - **B-44:** el producto ya cumple la prohibición del evento sistémico; rechazar también el ambiental es
    endurecimiento declarado.
  - **B-47:** vuelve a declarar que el producto rechaza `|`, `&` y `/`, que la PAS admite.
  - **B-50, B-51 y B-52:** desaparecen, porque se apoyaban sólo en 2024.
  - **B-53:** es nueva; declara que la matriz de precedencia del producto (DEC31) invalida además efecto→resultado
    y consumo→efecto.
- `docs/especificacion.md` y `AGENTS.md` dejan de citar 2024; la especificación describe el producto con B-44 y
  B-53 como diferencias declaradas.
- El código del producto no cambia. El único texto tocado en `app/` es el comentario de
  `app/src/nucleo/eventos-frontera.test.ts`.

## Después de la 2.2.0

DEC48 («vuelve a admitir el evento ambiental. manda la norma») cambia el producto, no el canon. R-CX-DIST-2 rechaza
sólo el cruce del evento sistémico y admite el ambiental, como reglas §8.5 y AP-21. Las notas de B-44 en el perfil y
en `docs/conformidad.md` dejan de declarar endurecimiento el rechazo del ambiental. DEC49 («retíralo, manda la
norma») saca de la regla la invocación entre procesos, que la cláusula no nombra: B-44 queda sin endurecimiento.
