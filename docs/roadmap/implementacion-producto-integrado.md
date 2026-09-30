# Producto integrado de opforja: implementación y aceptación pendiente

**Objetivo:** construir, comprender y corregir un documento de sistema junto con
un agente integrado, conservando significado, autoridad, trabajo concurrente y
recuperación.

**Estado al 2026-09-30:** candidato implementado y consolidado en `main` mediante
commits semánticos, a partir de `07fddc1ec47950a53144e800d795d9e8405091eb`.
La sincronización con `origin/main` se verifica al publicar; no se ha desplegado.
La implementación mecánica está comprobada; la aceptación con proveedor real y
personas permanece abierta. La [especificación](../specs/opforja-producto-integrado.md)
conserva requisitos y criterios A01–A24. Este documento reemplaza el inventario
previo de pasos de implementación por contratos realizados, evidencia y pendientes.

## Resultado implementado

| Incremento | Comportamiento disponible | Evidencia principal en `app/` |
|---|---|---|
| I1 · tareas y cambios | Encargo persistente, intención y presupuesto, consulta de fuentes/reglas, propuestas, revisión OPD/OPL, incorporación delegada o revisada, recibos, deshacer/reaplicar, Detener y Continuar. La edición manual funciona con agente deshabilitado. | `src/server/agent/{taskRuntime,taskIntegration,changeGateway,http,tools}.test.ts`, `src/store/{documentOperations,intentHistory}.test.ts`, `e2e/agent-{workbench,opl-editing}.spec.ts` |
| I2 · continuidad | Política documental derivada, modalidad/contexto en la ficha, importación con original recuperable, navegación de profundidad y alcance OPL explícito. Proponer un refinamiento conserva la frontera y requiere incorporar el cambio revisado. | `src/modelo/{documentPolicy,fichaTrabajo}.test.ts`, `src/persistencia/documentMigration.test.ts`, `e2e/{document-continuity,document-depth,refinement-proposal}.spec.ts` |
| I3 · revisión compartida | Revisión fija, fuentes elegidas expresamente, indicador de fuentes omitidas, lectura anónima, anotaciones/resoluciones y revocación. URLs compartidas sin los campos de credenciales reconocidos por la política. | `src/modelo/{review,shareSanitization}.test.ts`, `src/server/review/`, `e2e/revision-{reader,owner}.spec.ts` |
| I4 · escenarios | Habilitadores presentes/ausentes/desconocidos, prioridad de omisión sin efectos, escenario separado del documento, explicaciones y límites del perfil. | `src/modelo/simulacion/{enablers,condition-precedence,scenario}.test.ts`, `e2e/scenario-explanation.spec.ts` |
| I5 · recuperación | Snapshot, diario e historial atómicos en IndexedDB, identidad separada, guardado local distinto de sincronización, conflicto con ambas ramas recuperables y descarga incluso si falla IndexedDB. Paquete y lector estático con reapertura sin red. | `src/persistencia/{localRepository,syncQueue}.test.ts`, `src/app/ports/documentPersistencePort.test.ts`, `src/serializacion/portablePackage.test.ts`, `e2e/{offline-document,sync-conflicts,portable-reader}.spec.ts` |
| I6 · piezas y fuentes | Copia con identidad propia/linaje; referencia protegida; actualización revisable y reversible con comparación acotada. Autoría XOR mediante el kernel común y matriz de capacidades versionada. Archivo Markdown aportado explícitamente, UTF-8 conservado y acceso por párrafo. | `src/modelo/reuse/`, `src/modelo/changes/xor.test.ts`, `src/server/agent/{xorIntegration,sourceAdapters}.test.ts`, `e2e/reusable-pieces.spec.ts` |

La referencia de pieza materializa la entidad y sus estados. Declara las
relaciones incidentes y los límites que no materializa; una firma de frontera
no acredita equivalencia de comportamiento ni sustitución segura. Los perfiles
anteriores y sus flags se mantienen compatibles; no se publicó corpus KORA ni se
retiraron contratos externos por inferencia.

## Contratos que sostienen el conjunto

- **Un kernel y un circuito de efectos.** `modelo -> store -> app`; el servidor
  comparte funciones puras. Las propuestas generativas y las humanas de
  refinamiento/pieza convergen en el gateway. El LLM no envía parches libres ni
  concede permisos. OPD y OPL proyectan el mismo modelo.
- **Incorporación confirmada.** Bajo el lock del documento se comprueban base,
  copia local, intención, controlador, fuente/propiedad y perfil; se guardan
  revisión, recibo, inversa y evento. Repetir el mismo cambio recupera su recibo.
  Un fallo 500 después de enviar commit conserva incertidumbre hasta consultar
  ese recibo; no libera la edición suponiendo que no hubo efecto.
- **Deshacer sobre el presente.** La inversa comprueba efectos y dependencias;
  conserva trabajo posterior independiente y presenta conflictos si ya existe
  trabajo dependiente. Reaplicar crea una intención nueva sobre base vigente.
- **Tarea acotada.** Presupuesto reservado antes de inferir, una política de
  reintentos, leases/cancelación, llamadas completas de herramientas y fuentes
  versionadas. Cerrar un criterio de edición requiere citar un resultado con
  recibo confirmado. Esa asociación auditable no prueba por sí sola suficiencia
  semántica del criterio.
- **Persistencia honesta.** «Guardado aquí» exige escritura local de la revisión
  actual; «Sincronizado» exige confirmación remota de esa revisión. No se adopta
  un ancestro remoto nuevo sobre una edición anterior. La cuenta que inició una
  lectura/escritura se revalida después de esperas; otra cuenta no recibe el
  contenido anterior. Conflictos conservan ambas ramas.
- **Lectura independiente.** Compartir fija una copia revocable y separa fuentes
  autorizadas. El paquete elimina texto de fuentes omitidas del modelo
  serializado y conserva sus localizadores. El worker del lector solo controla
  `/portable-reader/`; no cachea el editor ni la API. Un perfil incompatible
  conserva los bytes originales.

La decisión vigente sobre inferencia está en
[EQUILIBRIO](../decisiones/equilibrio-llm.md); configuración, datos y recuperación
en [operación](../deploy/opforja.md) y [uso productivo](../uso-productivo.md).

## Proveedor y Jev

El operador eligió **`mimo-v2.6-pro`**. El adaptador candidato usa la API directa
MiMo y AI SDK Core con versiones exactas, solo en servidor. OpenCode Zen sigue
como ruta alternativa explícita; no se prueban credenciales contra proveedores
al azar. La sonda es:

```bash
cd app
bun --env-file=../.env run scripts/probe-agent-provider.ts --provider xiaomi-mimo --model mimo-v2.6-pro --synthetic
```

La clave `OPFORJA_AGENT_API_KEY` no estaba disponible en el entorno o `.env` del
proyecto y el portapapeles no era accesible desde esta sesión. No se ha ejecutado
inferencia real con MiMo. La sonda conserva límites de consumo y no imprime claves,
headers ni contenido privado. La configuración exacta se encuentra en el runbook.

[Jev fue evaluado con tres llamadas reales](../auditorias/2026-09-23-evaluacion-jev.md)
y 24 decisiones sintéticas en español. La siguiente evaluación útil es contraste
requisito/evidencia, seguida de apoyo fuente/afirmación y selección de consultas
cerradas. No se incorporó una llamada obligatoria a Jev en el producto: faltan
comparación, calibración en dominio y medición del ahorro total. No reemplaza el
proveedor generativo, el kernel, los permisos ni las comprobaciones de código.

## Evidencia de integración

- `bun run check`: **3.682 pruebas, cero fallos, 14.929 aserciones**, incluido
  typecheck. Se ejecutó con `OPFORJA_TEST_DATABASE_URL` apuntando a PostgreSQL 16
  aislado; las pruebas de gateway y revisión usaron esa base, no producción.
- Navegador: **16 escenarios focales correctos**, contando el preview de producción
  y el lector portátil. Edición OPL por teclado, agente deshabilitado, continuidad de
  importación, profundidad/OPL completo, refinamiento y pieza revisables con
  incorporación/deshacer, propietario y lectores móviles, escenarios,
  persistencia tras cerrar/reabrir Chromium y conflicto con elección explícita.
  También se comprobó importar y versionar Markdown sin ejecutar sus instrucciones,
  renderizar abanicos O/XOR y elegir una rama XOR durante la simulación.
- Build de producción: arranque del editor y exportación PNG comprobados por
  `25-produccion-preview.preview.spec.ts`; lector portátil comprobado después de
  preparar su shell y abrir una página nueva sin red. Los 69 recursos de su
  manifiesto existen y no incluyen `editorBootstrap`.
- `bun run design:governance`: correcto. Inspección móvil a 390 × 844: acciones
  secundarias plegadas, barra de 26 px y canvas de 447 px, sin desborde horizontal;
  apertura del paquete desde esas acciones comprobada.

La prueba del editor con API inaccesible mantiene el servidor estático disponible;
no acredita instalar el editor completo para arrancar sin ninguna red. El lector
portátil sí se comprobó sin red. El build advierte un chunk del editor de alrededor
de 1 MB minificado; no se midieron todavía los objetivos p95 de la especificación.

Los escenarios normales usan `playwright.config.ts`; `portable-reader.spec.ts` y
el smoke de producción usan `--config playwright.preview.config.ts`. No ejecutar
múltiples runners sobre los mismos puertos ni editar los módulos del servidor
durante una prueba de Vite: una recarga puede reemplazar el documento DEV abierto.

## Verificación de la consolidación Git · 2026-09-30

El candidato completo pasó nuevamente `bun run check`: 3.682 pruebas,
cero fallos, ninguna omitida y 14.929 aserciones, con PostgreSQL 16 temporal
sobre un puerto local aislado. También pasaron el build, el gobierno visual,
12 escenarios focales del editor y dos de preview (arranque/exportación PNG
y lector portátil sin red). El corte independiente de escenarios pasó
`bun run check` sobre su árbol aislado: 3.496 pruebas y cero fallos.

Esta consolidación conserva la aceptación pendiente que sigue. No ejecutó
inferencia real ni despliegue y no repitió la evaluación humana ni la inspección
visual móvil registrada en el corte anterior.

## Lo que falta para aceptar el producto con evidencia completa

1. **T1/T9 · proveedor real:** disponer de una clave local accesible para la ruta
   seleccionada, ejecutar la sonda y el recorrido real con herramientas, cambios,
   steering, recibos, undo/reapertura y cota de consumo. Las pruebas controladas no
   satisfacen A02 por sí solas.
2. **T9 · uso humano:** evaluar el recorrido con las cinco personas y el contraste
   descritos en la especificación; comprobar comprensión del significado,
   propuesta/incorporación, recuperación y ayuda requerida. No sustituirlas por
   participantes simulados.
3. **T9 · operación:** medir latencias y tiempo a resultado útil con tamaño/red
   declarados; probar rollback del binario anterior con las migraciones aditivas.
   La suite verde no acredita esos resultados ni la corrección humana de modelos.
4. **Publicación:** sin despliegue en esta ejecución. Si se solicita, utilizar
   únicamente `./deploy/deploy.sh`, conservar datos y comprobar el candidato en
   destino. La fuente queda consolidada mediante commits por intención; el despliegue requiere un encargo propio.

El trabajo restante se concentra en esa aceptación. No abre una plataforma de
clasificadores, un segundo runtime de agente, conectores externos ni otros
refactors. Cuando se cierre, retirar este plan del índice activo; la documentación
canónica y Git conservan contratos y evolución.
