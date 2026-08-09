# Taller, Modelos y ciclo reversible — contrato de producto y propagación

**Fecha:** 2026-07-27

**Estado:** IMPLEMENTADO, PUBLICADO, DESPLEGADO Y CERRADO EN **GO**. P1/P2
desplegaron `26f6f551`; P3 terminó en GO integral, P4 quedó propagada y P5 cerró
después de dos recorridos autenticados separados por una ventana productiva de
3 h 14 min.

**Reemplaza parcialmente:** `2026-07-06-apuntes-taller-design.md` en vocabulario
visible, gestor y reversibilidad. Conserva sus decisiones de kernel, integridad y
convergencia.

## 1. Problema resuelto

La interfaz usaba «Taller» para dos escalas distintas: el espacio donde viven
documentos exploratorios y la banda local de OPDs todavía no integrados. A la vez,
«Trabajo» reunía Apuntes y Modelos, por lo que graduar tenía consecuencias formales
pero casi ninguna consecuencia espacial visible. El camino inverso solo existía
como idea y podía confundirse con eliminar un refinamiento.

El contrato nuevo da un nombre inequívoco a cada escala, conserva el formalismo
OPM y hace reversibles los dos ciclos que realmente usa un modelador:

```text
Documento:  Taller / Apunte  ⇄  Modelos / Modelo
Componente: Boceto          ⇄  OPD integrado
Rol:        Modelo de Trabajo ⇄ Modelo de Biblioteca
Retención:  vivo            ⇄  archivado
```

Cada línea cambia una sola dimensión. Ninguna transición certifica la validez
humana del modelo.

## 2. Vocabulario canónico de interfaz

### 2.1 Espacios globales

| Nombre | Qué contiene | Qué expresa | Qué no expresa |
| --- | --- | --- | --- |
| **Taller** | Documentos `Apunte` vivos | Régimen exploratorio; cierre formal en observación | No significa que todo su contenido sea Boceto |
| **Modelos** | Documentos `Modelo` de Trabajo vivos | Reconocimiento del régimen formal | No significa aprobación humana ni ausencia automática de pendientes |
| **Bibliotecas** | Documentos `Modelo` con rol Biblioteca | Fuente gobernada para reuso | No es un tercer grado de madurez |
| **Archivo** | Documentos archivados de cualquier especie/rol | Retención y salida de la actividad corriente | No expresa rigor, validez ni obsolescencia semántica |

Las carpetas organizan Taller y Modelos. Bibliotecas es un estante global y
Archivo una lente transversal.

### 2.2 Régimen del documento

- **Apunte**: el mismo material OPM bajo un régimen que relaja el cierre
  metodológico, nunca la integridad referencial.
- **Modelo**: el mismo material OPM bajo un régimen que vuelve exigible el cierre.
- **Graduar a Modelo**: `Apunte → Modelo`.
- **Reabrir en Taller**: `Modelo de Trabajo → Apunte`.

No se introduce una etapa persistida ni una nueva especie. Los estados legales
siguen siendo `(Apunte, Trabajo)`, `(Modelo, Trabajo)` y
`(Modelo, Biblioteca)`.

### 2.3 Estado del componente OPD

- **Boceto**: OPD no raíz todavía fuera del árbol de refinamiento. Su
  representación formal sigue siendo el caso existente `padreId:null`; puede
  contener cosas, enlaces, estados, geometría, OPL, pregunta guía y un subárbol.
- **OPD integrado**: OPD vinculado como refinamiento de exactamente una cosa y
  situado en el árbol.
- **Integrar como…**: `Boceto → OPD integrado`, eligiendo descomposición o
  despliegue.
- **Devolver a Bocetos**: `OPD integrado → Boceto`.
- **Eliminar refinamiento**: operación destructiva distinta; elimina el subárbol
  y nunca se presenta como la inversa de Integrar.

«OPD suelto» y `adoptarOpd` permanecen como términos de implementación y
compatibilidad interna. La voz de producto usa Boceto, Integrar y OPD integrado.

### 2.4 Preparación y validación

La preparación formal es una proyección, no un estado editable:

- **Listo formalmente**: cero bloqueos de integridad, bloqueos de cierre,
  mejoras exigibles y Bocetos.
- **Con pendientes**: existe al menos una de esas condiciones.

La graduación separa cuatro planos:

1. **Integridad**: bloqueo duro; no se puede graduar un documento roto.
2. **Integración**: enumera Bocetos aún fuera del árbol.
3. **Cierre formal OPM**: bloqueos metodológicos y mejoras.
4. **Validación humana**: se declara «no registrada»; requiere persona o
   autoridad de dominio y corresponde a una versión.

Si integridad está sana pero quedan condiciones de integración o cierre, la
persona decide entre **Seguir en Taller y corregir** y
**Graduar con pendientes**. Graduar no repara nada.

## 3. Leyes de preservación

### L1. Identidad documental

Graduar y reabrir conservan el mismo `model.id`, registro y hechos OPM. Graduar
conserva la carpeta por defecto, pero puede trasladar el documento al destino
que la persona elija explícitamente; reabrir conserva la carpeta vigente. Cada
transición confirma una versión, pero no duplica el documento.

### L2. Identidad del componente

Integrar y devolver conservan el mismo `opd.id`, cosas, enlaces, estados,
apariencias, geometría, pregunta guía y descendientes.

### L3. Una dimensión por transición

- Graduar/reabrir cambia régimen y espacio, no hechos.
- Integrar/devolver cambia pertenencia al árbol, no régimen documental.
- Marcar/quitar Biblioteca cambia rol, no hechos ni rigor.
- Archivar/restaurar cambia retención, no madurez.

### L4. Integridad no negociable

Apunte y Boceto permiten exploración, no corrupción. Las referencias rotas
continúan bloqueando.

### L5. Estado derivado

`Listo formalmente` y `Con pendientes` se recalculan desde el payload y el
diagnóstico vigentes. No se persiste un flag que pueda quedar obsoleto.

## 4. Transiciones, efectos y recuperación

| Gesto | Precondición | Efectos | Preserva | Recuperación |
| --- | --- | --- | --- | --- |
| Nuevo | sesión y backend disponibles | crea registro `Apunte` en Taller | — | el nacimiento es inmediato; luego puede archivarse/eliminarse |
| Graduar a Modelo | Apunte íntegro, nombre y destino | versión + destino elegido + cambio atómico de índice a Modelo | ID y hechos | conflicto/fallo conserva Apunte; luego puede Reabrirse |
| Reabrir en Taller | Modelo de Trabajo, revisión observada | versión «Reapertura en Taller» + cambio atómico a Apunte | ID, hechos, carpeta | cancelar/fallo conserva Modelo |
| Integrar como… | Boceto y cosa destino compatibles | fija padre y slot de refinamiento | ID y contenido del Boceto | undo restaura Boceto |
| Devolver a Bocetos | OPD integrado no raíz con dueño único | libera slot y fija `padreId:null` en la raíz del subárbol | subárbol y todos sus hechos | undo restaura vínculo exacto |
| Eliminar refinamiento | refinamiento existente | elimina subárbol | solo lo ajeno al subárbol | confirmación destructiva; no equivale a Devolver |
| Marcar Biblioteca | Apunte o Modelo elegible | si era Apunte, gradúa; luego designa rol | hechos e ID | quitar rol vuelve a Modelo de Trabajo |
| Archivar | documento vivo | cambia retención | especie, rol y hechos | Restaurar |

## 5. Almacenamiento y concurrencia

### 5.1 Sin migración de esquema

El corte reutiliza `esApunte`, `esBiblioteca`, `archivado`, `Opd.padreId` y los
slots de refinamiento existentes. No agrega una tercera especie, un flag de
Boceto ni un flag de preparación.

### 5.2 Reapertura atómica

El protocolo de commit acepta una intención tipada `reopening:{kind:"reopen"}`.
Servidor y repositorio validan que:

- la operación sea sobre un registro existente;
- no se combine con graduación;
- el destino no sea Apunte ni Biblioteca;
- la revisión observada siga vigente;
- modelo, versión e índice se confirmen como una unidad.

Un conflicto no adelanta la UI ni deja índice y payload en regímenes distintos.

### 5.3 Fuente efectiva y testigo de transición

Al preparar una graduación o reapertura de un documento inactivo se leen juntos
el guardado y su autosalvado. Si el autosalvado es estrictamente posterior, esa
es la fuente visible y la que se preserva. El diálogo conserva además el testigo
CAS completo —revisión, marcas de tiempo, hashes y fuente—. Si cualquiera de
esas condiciones cambia antes de confirmar, la transición se detiene sin
escribir y exige volver a abrir la revisión.

Un documento ya abierto en sesión conserva su estado vivo como candidato; el
servidor sigue verificando un testigo fresco antes del commit.

### 5.4 Preparación derivada

El backend ya lee el payload al listar. Esa lectura hidrata el modelo y adjunta a
su resumen un `estadoCierre` transitorio. El campo no entra al JSON persistido.

### 5.5 Procedencia visual aditiva sin estado nuevo

Un OPD integrado debe contener una apariencia de la cosa refinada para pasar la
integridad dura del bundle. Como un Boceto bottom-up puede no traerla, Integrar
materializa una proyección derivada solo cuando falta:

- descomposición: contorno canónico que envuelve el contenido existente;
- despliegue: apariencia normal de la cosa sobre la estructura.

No se agrega un flag de Boceto, preparación ni madurez. La apariencia derivada
usa el `contextoRefinamiento` ya existente, ampliado de forma retrocompatible
con `tipo:"despliegue"` y `origen:"adopcion"`. Esta procedencia sobrevive
guardar/abrir y permite que `Devolver a Bocetos` retire exclusivamente la
proyección creada por Integrar, sin tocar apariencias autoradas.

`Devolver a Bocetos` quita además el refinamiento mediante el kernel existente y
desvincula solo la raíz elegida. Los descendientes conservan sus padres
internos. La operación rechaza raíz, Boceto ya suelto, ausencia de dueño,
procedencia ambigua y vínculos inconsistentes.

## 6. Tutor contextual

Las nuevas entradas semánticas son:

- `workspace:reopen-workshop` → `cap.lifecycle.degrade`;
- `tree:return-sketch` → `cap.refinement.unadopt`.

Cada capacidad declara secuencia de efectos y recuperación. Cuando el diálogo
de producto ya explica exactamente la consecuencia, el arbitraje puede callar
la voz adicional del Tutor; la superficie conserva `data-tutor-*`, la fuente y
la política verificable. En Devolver a Bocetos el Tutor confirma explícitamente
la preservación del subárbol.

Referencias metodológicas usadas en el corte:

- `urn:fxsl:kb:icas-preservacion`;
- `urn:fxsl:kb:icas-efectos`;
- `urn:fxsl:kb:icas-lifecycle`;
- `urn:dev:kb:canon-diseno-producto-integrado`.

## 7. Propagación implementada dentro del repositorio

```text
kernel de dominio
  → protocolo de persistencia y repositorios
  → store transaccional
  → ports y viewmodels
  → gestor, cintas, menús y diálogos
  → tutor contextual
  → manuales, cheatsheet y recorridos E2E
```

La propagación se considera completa solo si cada flecha tiene una prueba:
inversas de dominio, rollback de persistencia, store, registro de efectos del
Tutor y recorridos reales de ambos ciclos.

## 8. Plan post-implementación: propagación y gestión de efectos

Este plan **no autoriza el despliegue**. Comienza después del commit y push del
corte, y cada fase tiene un gate de entrada.

### Fase P0 — cierre de fuente

**Gate:** `main` limpio; `HEAD == origin/main`; gates locales verdes.

Acciones:

1. Publicar los commits semánticos.
2. Registrar SHA, pruebas y límites en el handoff.
3. Confirmar que no hubo migración, escritura de modelos ni `mesa push`.

Evidencia: SHA remoto, divergencia `0/0`, resultados de `gate:refactor`.

### Fase P1 — autorización y preflight productivo

**Gate:** autorización explícita del operador para desplegar.

Acciones:

1. Ejecutar `bun run cordon:estado` y exigir fuente/deploy observables.
2. Resolver Compose con el nombre estable del proyecto y verificar volúmenes.
3. Capturar agregados pre-deploy sin contenido sensible.
4. Crear backup PostgreSQL con cierre de `pg_dump`, permisos `600`, gzip y
   checksum.
5. Ensayar restauración en una base aislada si existe ventana y autorización;
   integridad de gzip por sí sola no prueba restaurabilidad.

Abortar si: el árbol está sucio, hay divergencia, el volumen no es el esperado,
el backup falla o producción ya no corresponde al baseline observado.

### Fase P2 — despliegue controlado

**Gate:** P1 verde y backup aceptado.

Acciones:

1. Ejecutar únicamente `./deploy/deploy.sh`.
2. Verificar código de salida, SHA servido y salud de web/API/PostgreSQL/sidecar.
3. Comparar identidad del contenedor y volumen PostgreSQL, reinicios y agregados
   pre/post.

Rollback técnico: desplegar el build anterior. No hay down-migration porque no
hay cambio de schema; los documentos modificados por el nuevo ciclo usan flags y
versiones que el producto anterior ya comprende.

### Fase P3 — verificación funcional graduada

**Gate:** servicios sanos.

Nivel 1, sin autenticación ni escrituras:

- raíz y assets 200;
- `/healthz`;
- sesión anónima 401;
- headers de seguridad;
- SHA exacto.

Nivel 2, solo con cuenta/tenant de prueba autorizados:

1. Crear un Apunte sintético sin datos reales.
2. Trazar un Boceto con contenido reconocible.
3. Integrarlo y devolverlo; comparar ID y contenido.
4. Graduar eligiendo carpeta, reabrir y volver a graduar; comparar `model.id`,
   hechos y versiones, y comprobar que la reapertura conserva la carpeta
   elegida.
5. Confirmar agrupación Taller/Modelos y Tutor contextual.
6. Eliminar o archivar el artefacto de prueba según la política acordada.

Abortar y volver al build anterior ante pérdida de identidad/contenido,
desincronización índice-payload, error de CAS no recuperable o imposibilidad de
abrir documentos existentes.

**Corte final observado 2026-07-27:** P3 **GO integral** sobre `26f6f551`.
El mismo documento y el Boceto `opd-3` conservaron identidad, hechos, carpeta y
cuatro versiones durante el ciclo completo. El Tutor mantuvo una sola voz y el
runtime quedó sin errores inesperados. Axe 4.10.2 terminó con cero violaciones
en los cinco estados auditados. El tenant sintético fue eliminado y los
agregados regresaron al baseline. En ese corte P4 y P5 quedaron habilitadas; sus
cierres están registrados a continuación. El reporte productivo del 2026-07-27 se
preserva como antecedente histórico en Git y no constituye estado actual.

### Fase P4 — propagación humana y documental

**Gate:** P3 verde.

Acciones:

- publicar la guía de vocabulario: Taller/Apunte, Boceto/OPD integrado,
  Modelos/Modelo, Biblioteca/rol;
- comunicar que `Graduar con pendientes` no valida humanamente;
- explicar que `Devolver a Bocetos` preserva y `Eliminar refinamiento` destruye;
- actualizar material de soporte o capturas externas que aún digan
  «Gestor de dos zonas», «Adoptar» o «banda Taller».

No migrar nombres almacenados ni reescribir modelos: el cambio es de navegación
y semántica de interfaz.

**Estado 2026-07-27:** propagación repo-local completada en la guía del Tutor,
manuales, canon, cheatsheets, especificación de gestión, reporte y handoff. No
se ejecutaron comunicaciones externas.

### Fase P5 — observación y cierre

**Gate:** al menos un recorrido autorizado y ausencia de regresión crítica.

Observar durante la ventana acordada:

- errores de commit/revisión en graduación y reapertura;
- errores de hidratación al calcular preparación;
- fallos de apertura en documentos históricos;
- confusión reportada entre Devolver y Eliminar;
- documentos inesperadamente ausentes de su espacio.

No inventar analítica inexistente. Usar logs, bugs reproducibles y evidencia de
sesiones autorizadas. Cerrar con un corte explícito:

- **GO**: identidad, contenido, agrupación y rollback demostrados;
- **GO con límite**: runtime sano pero falta recorrido autenticado o restauración;
- **NO-GO**: pérdida, incompatibilidad o desincronización reproducible.

**Cierre 2026-07-27 — GO:** la ventana observable transcurrió entre
`04:35:21Z` y `07:49:33Z` sobre `26f6f551`. Dos recorridos autenticados quedaron
separados por 3 h 14 min. El segundo abrió un payload sintético
`deep-opm-pro.modelo.v0`, ejecutó el ciclo reversible completo y confirmó
identidad, hechos, agrupación, cuatro versiones y rollback. Los diálogos
`Devolver a Bocetos` y `Eliminar refinamiento y subárbol` mostraron efectos
preservador y destructivo inequívocos.

Durante la ventana, web/API registraron únicamente respuestas `200` y los
`401` de sesión anónima y `404` de autosave ausente esperados; no hubo `5xx`,
errores de hidratación, conflictos, bugs activos ni reinicios. El tenant
sintético se eliminó y los ocho agregados regresaron exactamente al baseline.
No se infiere comprensión humana ni adopción real a partir de esta sonda.

### Propagación al ecosistema — 2026-07-27

El contrato se elevó a la SSOT KORA y a la skill `modelamiento-opm` en
`e43ebf791d31325efa410dd31c7aad38c2dd04f5`:

- reglas `1.5.0`, OPD `1.4.0` y método `1.7.0`;
- skill `2.1.0`, emitida para Claude Code, Codex y OpenCode con paridad fiel;
- resolver, fuentes del Tutor y cordón repo-local alineados con esas versiones
  y con el hash de la skill;
- identificadores internos `adoptarOpd` y `origen:"adopcion"` preservados como
  compatibilidad, sin elevarlos a vocabulario de usuario ni a OPL.

Esta propagación no modifica modelos, esquema ni datos. La publicación Git y la
instalación de la skill son hechos separados del despliegue de la app: hasta un
nuevo deploy autorizado, producción conserva el corpus Tutor del build anterior.

## 9. Matriz de efectos posteriores

| Superficie | Efecto esperado | Riesgo | Mitigación/observable |
| --- | --- | --- | --- |
| Usuarios actuales | «Trabajo» se divide en Taller y Modelos | creer que desaparecieron documentos | conteos globales, apertura por espacio activo y comunicación |
| Datos existentes | clasificación derivada al listar | payload histórico no hidratable | fallo explícito, tests de compatibilidad y rollback de app |
| Persistencia | una nueva clase de commit de reapertura | índice adelantado, versión huérfana o autosave sustituido | transacción, fuente efectiva, testigo CAS y prueba de cero escrituras al fallar |
| Rendimiento | listado hidrata payload para derivar cierre | aumento de costo con catálogos grandes | medir latencia real antes de optimizar; no persistir cache prematura |
| Tutor | dos entrypoints vivos adicionales | voz duplicada | arbitraje por propietario e intención |
| Export | términos visibles cambian a Boceto sin integrar | automatismos que comparen texto | códigos internos permanecen estables |
| Soporte/documentación | vocabulario anterior queda obsoleto | instrucciones contradictorias | búsqueda repo-wide y puntero de supersesión |
| Rollback | documentos reabiertos existen como Apunte | build anterior debe leerlos | usa encoding preexistente; smoke de lectura histórica |

## 10. Criterios de aceptación

- Un documento realiza `Apunte → Modelo → Apunte` con el mismo ID y hechos.
- Un OPD realiza `Boceto → integrado → Boceto` con el mismo ID y subárbol.
- La graduación bloquea integridad, pero permite asumir deuda formal de manera
  explícita.
- Modelos separa Listos formalmente y Con pendientes sin persistir otro estado.
- Biblioteca y Archivo no se confunden con madurez.
- El Tutor declara efectos/recuperación y evita una segunda voz cuando producto
  ya es suficiente.
- El backend falla cerrado ante conflicto y no deja escrituras parciales.
- La entrega local puede cerrarse sin afirmar despliegue ni validación humana.
