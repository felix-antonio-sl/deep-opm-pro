# Manual de opforja para ingeniería de software

Perfil avanzado para aplicar opforja al diseño, desarrollo, entrega, operación,
evolución y retiro de software. Este documento explica **qué cambia cuando el
sistema de realización es software**; el ciclo general pertenece al
[manual para transformar sistemas](manual-sistemas-opm.md).

Compañero de bolsillo:
[opforja para ingeniería de software](cheatsheets/opforja-software.html).

## 0. Contrato del perfil software

### Alcance y prerrequisitos

Este manual enseña a convertir el modelo del dominio en contexto verificable para
arquitectura, código, tests, CI/CD y operación. No vuelve a enseñar:

- OPM y OPL: [manual de OPM puro](manual-opm-puro.md);
- método Forja y mesa humano-agente:
  [manual de opforja](manual-opforja.md);
- operaciones exactas de la UI: [Uso productivo](uso-productivo.md);
- evidencia, ficha, AS-IS/TO-BE, alternativas, gates, autonomía y retiro:
  [manual para transformar sistemas](manual-sistemas-opm.md).

La tesis del perfil es:

> opforja conserva intención, comportamiento y frontera; Git conserva
> implementación; tests y CI producen evidencia; el pipeline entrega; la
> telemetría registra la operación.

El vocabulario `IMPLEMENTADO | PROPUESTO | EXTERNO` se hereda del
[manual transversal](manual-sistemas-opm.md#vocabulario-de-capacidad). Una
propuesta documentada no está implementada ni priorizada.

### Ruteo por problema técnico

| Problema | Sección |
|---|---|
| No sé si modelar dominio, arquitectura o entrega | §1.1 |
| Debo comprender un sistema existente | §1.3 |
| El modelo parece un mockup o un diagrama de clases | §2.1–§2.3 |
| Necesito requisitos, tests y cualidades medibles | §2.4–§2.5 |
| Debo escoger una arquitectura | §2.6 y §3 |
| Quiero delegar implementación a agentes | §4 |
| Debo modelar CI/CD, release o recuperación | §5 |
| Telemetría o un incidente contradicen el modelo | §6 |
| Debo modernizar o retirar software | §6.4 |
| Quiero saber qué hace opforja realmente | §7 |
| Necesito un ejemplo end-to-end | §8 |
| Necesito una receta breve | §9 |

---

## 1. El perfil software dentro del ciclo de sistemas

### 1.1 Tres modelos hermanos

El trabajo software mezcla tres preguntas con dueños y ritmos distintos:

1. **Dominio y producto:** qué cambia para la persona usuaria o el negocio, quién
   recibe valor y qué reglas gobiernan el cambio.
2. **Sistema software:** qué componentes, datos e interfaces realizan esa función y
   cómo fallan.
3. **Entrega y operación:** cómo código, artefactos, ambientes, releases y señales
   pasan de un estado a otro.

No los comprimas en un mega-modelo. Un modelo de dominio no necesita frameworks; un
modelo de arquitectura no inventa la necesidad; un modelo de pipeline no describe
el producto.

opforja **IMPLEMENTA** modelos separados, composición por interfaz y submodelos de
solo lectura. Eso no equivale a federación automática ni coedición.

### 1.2 Autoridad por artefacto software

| Afirmación | Autoridad | Papel del modelo |
|---|---|---|
| Problema y vocabulario | fuentes y dueño de dominio | explicita función, estados y reglas |
| Necesidad y prioridad | responsable de producto | conserva resultado y restricciones |
| Requisito | tracker o especificación + aceptación humana | muestra intención y metacobertura |
| Decisión de arquitectura | ADR y contratos | compara alternativas y dependencias |
| Implementación | repositorio Git | recibe contexto; no se genera automáticamente |
| Verificación | tests, análisis y CI | el modelo declara conducta; CI conserva veredicto |
| Release | build, registro, manifiesto y pipeline | modela gates y recuperación |
| Operación | logs, métricas, trazas e incidentes | devuelve evidencia al contrato |

Cuando dos artefactos divergen, no elijas el más cómodo. Determina si cambió la
intención, la implementación o la evidencia y corrige al propietario.

### 1.3 Entrada por un sistema existente

Aplica el ciclo de ingeniería inversa del
[manual transversal](manual-sistemas-opm.md#25-entrar-por-un-sistema-existente) con
una revisión congelada:

- commit o tag de código;
- schemas, contratos de API y eventos;
- configuración relevante por ambiente;
- tests y resultados de CI;
- ADRs y runbooks;
- ventana de logs, métricas e incidentes;
- dueños actuales de datos e interfaces.

No derives el modelo solo de nombres de clases. Observa comportamiento y
restricciones. Marca cada requisito inferido como hipótesis hasta que el responsable
lo acepte. Conserva AS-IS, TO-BE y transición separados.

opforja no inspecciona repositorios, bases de datos ni tráfico automáticamente. Esa
evidencia es **EXTERNA**.

---

## 2. Del dominio al contrato ejecutable

### 2.1 Transformación antes que interfaz

Pregunta primero:

> ¿Qué cambia en el mundo cuando el producto funciona?

“Mostrar formulario”, “crear dashboard” o “enviar request” describen una interfaz o
realización. El modelo de dominio debe expresar el cambio:

```opl
*Confirmación de reserva* cambia **Solicitud** de `pendiente` a `confirmada`.
*Confirmación de reserva* genera **Reserva**.
```

Después se decide si la realización usa pantalla, API, proceso manual o una
combinación.

### 2.2 Objeto de dominio frente a representación técnica

**Reserva**, **Sala** e **Intervalo** pueden pertenecer al dominio.
`ReservationDTO`, fila SQL o índice B-tree pertenecen a una realización técnica
cuando importan para una decisión.

No conviertas cada tabla, clase o payload en objeto OPM. Inclúyelo si porta estado,
identidad, responsabilidad, interfaz o fallo necesario para explicar la función.

### 2.3 Dominio y realización software

En el dominio modela solicitudes, permisos, reservas y personas. En la realización
modela API, almacén, worker y contratos. Conecta ambos mediante objetos-frontera con
significado y estados compartidos.

En OPM, agente significa exclusivamente persona o grupo de personas. Software,
robots y runtimes de IA son objetos no humanos: pueden habilitar procesos como
instrumentos o ser transformados. “Agente de código” es un rol de ingeniería
agéntica, no una clasificación OPM.

### 2.4 Requisitos, cobertura y evidencia ejecutable

La operación exacta de requisitos está en
[Uso productivo](uso-productivo.md#requisitos-y-cobertura).

La metacobertura de opforja afirma:

> esta entidad o enlace realiza esta intención.

El test o control externo afirma:

> esta conducta fue observada con este resultado.

Conserva la traza:

```markdown
| Requisito | Cobertura en opforja | Evidencia ejecutable | Veredicto |
|---|---|---|---|
| REQ-7 | Validación de disponibilidad | tests/reservas/concurrencia.test.ts | CI verde |
```

La cobertura interna está **IMPLEMENTADA**. Targets tipados a test, código, ADR,
pipeline o métrica están **PROPUESTOS**.

### 2.5 Cualidades medibles

“Rápido”, “seguro”, “escalable” o “resiliente” no permiten verificar. Declara:

- escenario y actor;
- carga o condición;
- medida y unidad;
- umbral y ventana;
- fuente de evidencia;
- consecuencia del incumplimiento.

Ejemplo: `REQ-PERF-3`, hard, “p95 de confirmación < 500 ms con 100
solicitudes/s durante 15 min”. opforja puede conservar requisito y cobertura; la
prueba de carga y su veredicto son **EXTERNOS**.

Para seguridad, modela activos, estados de autorización, procesos de control,
excepciones y responsabilidad humana. El modelo no reemplaza threat modeling,
análisis de vulnerabilidades ni revisión especializada.

### 2.6 Alternativas tecnológicas

“Necesitamos microservicios con Kafka”, “una app móvil” o “IA” son soluciones. Usa
el [criterio transversal de alternativas](manual-sistemas-opm.md#41-comparar-alternativas-con-la-misma-firma)
y conserva la misma firma funcional.

Compara además:

- acoplamiento y costo de coordinación;
- latencia y consistencia;
- modos de fallo y recuperación;
- despliegue y observabilidad;
- migración de datos;
- competencia operacional;
- costo de evolución.

Una alternativa que cambia entrada o resultado resolvió otro problema.

---

## 3. Diseño y arquitectura

### 3.1 Responsabilidades e interfaces

Separa contextos cuando cambian:

- dueño semántico;
- fuente autorizada del dato;
- ritmo de cambio;
- restricciones de seguridad;
- capacidad de despliegue;
- forma de recuperación.

Modela cada cruce como interfaz: objeto-frontera, productor, consumidor, estados,
versión, rechazo, timeout y ownership.

Una interfaz no es solo una API. Puede ser mensaje, archivo, tabla compartida,
evento, job, cola o procedimiento humano.

### 3.2 API, comando, mensaje y evento

- **Comando:** solicita que algo ocurra; puede rechazarse.
- **Respuesta:** informa el resultado de una solicitud.
- **Evento:** afirma que algo ocurrió; no ordena al receptor.
- **Consulta:** solicita información sin prometer cambio.

Si estas diferencias afectan acoplamiento, reintentos o responsabilidad, modela
objetos informacionales distintos. “Integración” como una sola flecha es demasiado
pobre para decidir.

### 3.3 Dueño del dato y réplicas

Para cada dato crítico declara:

- sistema que autoriza escritura;
- consumidores;
- latencia aceptable;
- política de conflicto;
- versión y compatibilidad;
- retención y eliminación;
- recuperación.

Una réplica no se vuelve fuente única porque sea más cómoda. Si dos componentes
pueden escribir sin política explícita, el modelo oculta una decisión.

### 3.4 Tiempo, fallos e idempotencia

El comportamiento distribuido incluye:

- pendiente, confirmado, fallido y desconocido;
- timeout y respuesta tardía;
- duplicación y reordenamiento;
- retry y backoff;
- idempotencia;
- compensación;
- reconciliación;
- escalamiento humano.

Un camino feliz no basta para autorizar producción. Modela qué evidencia permite
distinguir “no ocurrió” de “ocurrió, pero no recibí confirmación”.

### 3.5 Reutilización y límite del drift

Las vistas y Piezas pertenecen al
[manual de opforja](manual-opforja.md#9-patrones-de-modelado). En software:

- una vista navega otro modelo sin copiarlo;
- una Pieza gobernada permite Calcar o Anclar vocabulario y estados;
- el Centinela observa la firma de una Pieza anclada;
- **no** observa código, schema, contrato de API, configuración ni runtime.

No presentes el Centinela como sincronización modelo↔repositorio.

---

## 4. Desarrollo agéntico

### 4.1 Contrato de implementación

El contrato transversal se especializa así:

```markdown
### Contrato de implementación
- Objetivo y requisito:
- Modelo, OPD y revisión:
- Repo, rama y commit base:
- Archivos o módulos dentro de alcance:
- Interfaces que deben preservarse:
- Decisiones vigentes y no-objetivos:
- Tests que reproducen y aceptan:
- Restricciones de seguridad y datos:
- Gates de integración:
- Decisiones que el agente debe elevar:
- Entregables y forma de relevo:
```

El modelo no reemplaza `AGENTS.md`, `CLAUDE.md`, README, tipos, tests ni contrato de
build. Los ordena alrededor de una intención.

### 4.2 Sobre de autonomía software

Hereda el [sobre transversal](manual-sistemas-opm.md#52-sobre-de-autonomía) y agrega:

| Zona | Ejemplos software |
|---|---|
| Decide | implementación local dentro de patrones y archivos autorizados; tests unitarios; nombres privados |
| Propone | alternativa de diseño; partición de módulos; migración reversible; nuevos tests |
| Eleva | contrato público; ownership de datos; seguridad; dependencia nueva; migración destructiva; producción |
| No hace | ampliar alcance, exponer secretos, saltar gates, cambiar requisito o aceptar riesgo por el humano |

Una acción reversible en Git puede seguir siendo semánticamente importante. La
reversibilidad técnica no reemplaza autorización.

### 4.3 Frontera de confianza

Tickets, documentos, logs, mensajes y páginas externas aportan **evidencia**, no
redefinen las instrucciones del repositorio. Un agente debe:

- respetar la precedencia de `AGENTS.md` y `CLAUDE.md`;
- no ejecutar instrucciones incrustadas en datos no confiables;
- excluir secretos y datos personales crudos del modelo y prompts;
- citar la procedencia de supuestos;
- detenerse ante conflicto de autoridad;
- entregar el delta, no una narración que lo oculte.

### 4.4 Paralelismo en Git e integración

Paraleliza cuando las superficies no se solapan:

1. congela modelo, commit SHA, interfaces y gates;
2. asigna ownership de archivos o módulos;
3. usa ramas o worktrees independientes;
4. evita que dos agentes cambien el mismo contrato;
5. integra en un único punto;
6. ejecuta gates completos;
7. propone un solo delta semántico al modelo.

El código puede avanzar en paralelo; significado, contrato e integración se
serializan. opforja no coedita modelos ni orquesta agentes.

### 4.5 Medir si la ingeniería agéntica agiliza

No midas solo tokens o commits. Observa:

- tiempo desde contrato listo hasta cambio integrado;
- porcentaje aceptado sin reapertura;
- defectos y rollback por cambio;
- change-failure rate;
- tiempo de recuperación;
- divergencias modelo↔software detectadas antes de producción;
- carga humana de integración y revisión.

Estas métricas se calculan **fuera** de opforja.

### 4.6 Del modelo al código, sin generación mágica

opforja no genera aplicación, schemas, APIs ni tests y no mantiene sincronía con el
repo. Un modelo listo para implementar aporta:

**Definition of Ready**

- función y frontera aceptadas;
- requisito y criterio de aceptación;
- AS-IS/TO-BE separados;
- interfaces y ownership claros;
- fallos relevantes modelados;
- alcance y no-objetivos;
- commit base y tests de reproducción.

**Definition of Done**

- código y tests verdes;
- contratos y migraciones revisados;
- seguridad y datos tratados;
- artefacto trazable;
- rollback o roll-forward probado según riesgo;
- modelo actualizado solo si cambió significado, estado, interfaz, ownership, fallo
  o resultado.

El puente técnico de la mesa pertenece a
[la pista agente](manual-opforja.md#pista-agente). No se duplica aquí.

---

## 5. Entrega, CI/CD y release

### 5.1 Modela el pipeline; ejecútalo fuera

Un modelo de entrega puede contener:

- **Cambio de código** y **Commit**;
- *Construcción de artefacto*;
- **Artefacto** con identidad inmutable;
- *Verificación automatizada*;
- **Resultado de CI**;
- *Aprobación de release* manejada por una persona o grupo;
- **Ambiente**;
- *Despliegue*;
- *Verificación de salud*;
- *Promoción*, *Abortar despliegue* o *Recuperación*.

CI, runner, registro y orquestador son objetos software, no agentes OPM. El
responsable humano de release sí puede serlo.

El pipeline real ejecuta y conserva el veredicto. opforja solo estructura el
contrato.

### 5.2 Gate proporcional al riesgo

| Gate | Pregunta software | Evidencia externa |
|---|---|---|
| Semántica | ¿el cambio realiza el requisito? | aceptación humana |
| Compatibilidad | ¿preserva API, eventos y datos? | contract/schema tests |
| Calidad | ¿tests y análisis pasan? | CI |
| Seguridad | ¿secrets, dependencias y permisos son aceptables? | escáner y revisión |
| Artefacto | ¿build es identificable y reproducible? | digest, SBOM, provenance |
| Rollout | ¿puede introducirse con riesgo controlado? | plan y flags |
| Recuperación | ¿rollback/roll-forward funciona? | simulacro |
| Operación | ¿alertas, runbook y ownership existen? | revisión operacional |

Resultados: `PASS`, `N/A` justificado o `WAIVER` con dueño, riesgo y vencimiento.

### 5.3 Rollout y recuperación

Declara:

- estrategia: canary, blue/green, feature flag, lote o corte;
- señales de promoción;
- umbrales de pausa y abortar;
- compatibilidad durante coexistencia;
- migración y reversa de datos;
- quién puede detener;
- ruta de rollback o roll-forward;
- evidencia posdespliegue.

Un despliegue completado no es un resultado aceptado hasta pasar la verificación de
salud y negocio.

---

## 6. Operación y evolución

### 6.1 Telemetría e incidentes

Logs, métricas y trazas son evidencia externa. opforja no los ingiere ni infiere
causas.

Ante un incidente:

1. preserva revisión de modelo, release y ventana de telemetría;
2. registra observado frente a esperado;
3. abre un apunte con hipótesis explícitas;
4. localiza estado, interfaz, fallo o responsabilidad;
5. recupera el servicio;
6. corrige código si violó el contrato;
7. corrige el modelo si el contrato era falso o cambió;
8. añade evidencia que pruebe la corrección.

### 6.2 Correlación y drift

Conserva una traza externa:

```text
modelo/revisión ↔ commit ↔ build/digest ↔ release ↔ ambiente ↔ ventana de operación
```

Las versiones manuales de opforja permiten hitos y restauración como copia. No
ofrecen diff estructural de modelos ni observan drift del runtime.

### 6.3 Cuándo cambia el modelo

Actualiza el modelo si cambia:

- estado observable o regla de negocio;
- función o frontera;
- interfaz u ownership;
- semántica del dato;
- condición, excepción o recuperación;
- requisito o evidencia que gobierna una decisión.

Un refactor interno que preserva contrato puede no requerir delta OPM. Documenta en
el artefacto técnico que corresponda.

### 6.4 Modernización y decommission software

Hereda el [ciclo transversal de modernización y retiro](manual-sistemas-opm.md#8-modernizar-o-retirar-un-sistema).
El delta software exige inventariar:

- APIs, eventos, jobs y consumidores;
- datos, retención, migración y respaldo;
- compatibilidad de lectura y escritura;
- credenciales, secretos, certificados y permisos;
- DNS, colas, buckets e infraestructura;
- dashboards, alertas, runbooks y ownership;
- dependencias de build y despliegue;
- evidencias que prueban ausencia de tráfico o consumidores.

Estados útiles:

`vigente → escritura dual → lectura migrada → solo consulta → drenado → retirado`

No borres infraestructura ni datos antes de probar que las obligaciones y
dependencias vivas fueron absorbidas o cerradas.

---

## 7. Frontera de capacidad del perfil

### 7.1 IMPLEMENTADO en opforja

Para software son especialmente útiles:

- modelos y revisiones separadas;
- requisitos con metacobertura interna;
- vistas de requisito;
- composición por interfaz y submodelos;
- apuntes para incidentes e hipótesis;
- OPL, diagnóstico, bundles y export canónico;
- Piezas y Anclaje para vocabulario gobernado;
- contexto humano-agente con revisión y optimistic locking.

La lista transversal completa vive en el
[manual de sistemas](manual-sistemas-opm.md#91-implementado).

### 7.2 Propuestas transversales heredadas

No se vuelven a especificar aquí:

1. [ancla de fuente genérica](manual-sistemas-opm.md#92-propuesto-a-corto-plazo);
2. contexto de trabajo determinista;
3. targets externos de satisfacción.

Son **PROPUESTAS**, no roadmap ni promesa.

### 7.3 SW-P1 · Manifiesto de release

Propuesta propia del perfil:

```text
modelo/revisión + commit + build/digest + release + ambiente + evidencia + veredicto
```

Debe:

- referenciar identificadores externos, no copiar artefactos;
- conservar procedencia e inmutabilidad;
- permitir detectar una combinación incoherente;
- no ejecutar el pipeline;
- no certificar por sí solo la aprobación.

Necesita priorización, diseño y tests antes de entrar al producto.

### 7.4 EXTERNO

Siguen fuera de opforja:

- ingestión o ingeniería inversa automática del repo;
- codegen completo;
- roundtrip código↔modelo;
- diff semántico entre revisiones;
- sincronización de APIs, schemas o datos;
- ejecución de CI/CD o despliegue;
- telemetría integrada e inferencia causal;
- orquestación multiagente;
- coedición y federación.

---

## 8. Ejemplo end-to-end — Lumbre

Lumbre es un sistema ficticio de reserva de salas. El ejemplo no afirma hechos de
un producto real.

### 8.1 Pregunta y base

> ¿Cómo confirmar una solicitud solo cuando existe disponibilidad y, para salas
> restringidas, permiso?

Base congelada ficticia:

- regla de negocio sobre disponibilidad;
- decisión de aprobación para salas restringidas;
- requisito de no bloquear confirmación por notificación;
- restricción de convivencia con un sistema existente.

### 8.2 Modelo de dominio

La fuente completa y ejecutable es
[lumbre-reservas.opl](ejemplos/lumbre-reservas.opl). Un test exige 32 oraciones
atómicas, modelo válido y roundtrip sin pérdida.

```opl
**Solicitud** puede estar `pendiente`, `confirmada` o `rechazada`.
**Disponibilidad** puede estar `desconocida`, `disponible` o `no disponible`.
*Confirmación de reserva* cambia **Solicitud** de `pendiente` a `confirmada`.
*Confirmación de reserva* genera **Reserva**.
*Confirmación de reserva* ocurre si **Disponibilidad** está en `disponible`, de lo contrario *Confirmación de reserva* se omite.
```

El modelo de dominio no contiene API, base de datos ni framework.

### 8.3 Requisitos y arquitectura

Ejemplos:

- `REQ-1 hard`: no confirmar si no hay disponibilidad;
- `REQ-2 hard`: una sala restringida necesita permiso;
- `REQ-3 soft`: notificar sin aumentar la latencia de confirmación.

Alternativas:

1. monolito transaccional con outbox;
2. servicio de reservas y notificador asíncrono;
3. proceso manual asistido para salas restringidas.

Se comparan contra la misma firma funcional, consistencia, fallos, operación y
costo de migración.

### 8.4 Contrato para un agente

```markdown
- Objetivo: implementar REQ-1 y REQ-2.
- Base: modelo Lumbre, revisión X; repo en commit Y.
- Alcance: módulo reservas y tests.
- Preservar: contrato de solicitud y compatibilidad de lectura.
- No objetivo: cambiar notificaciones.
- Evidencia: tests de concurrencia, permiso y regresión.
- Elevar: migración destructiva, nueva dependencia o cambio de API.
```

### 8.5 Release y operación

El release correlaciona modelo, commit, artefacto y ambiente. Gates mínimos:
contratos, migración, tests, salud y recuperación.

Después del despliegue se observan:

- confirmaciones sin disponibilidad;
- latencia p95;
- rechazos por conflicto;
- errores de permiso;
- duplicación de reservas.

Si aparece una confirmación incompatible, el incidente abre un apunte y se decide
si falló implementación o contrato.

### 8.6 Modernización y retiro

Para reemplazar una versión anterior:

- inventariar consumidores y datos;
- convivir con contratos compatibles;
- migrar por lotes verificables;
- drenar tráfico;
- revocar credenciales;
- retirar infraestructura solo después de probar ausencia de dependencias.

---

## 9. Recetas software

### A. Delegar una implementación

1. acepta requisito y modelo;
2. congela repo y commit;
3. entrega contrato de implementación;
4. asigna ownership sin solapamiento;
5. ejecuta tests locales;
6. integra en un único punto;
7. corre gates completos;
8. actualiza el modelo solo si cambió el contrato.

### B. Preparar un release

1. identifica build y digest;
2. enlaza commit y revisión del modelo;
3. revisa contratos y datos;
4. ejecuta calidad y seguridad;
5. prueba rollout y recuperación;
6. despliega externamente;
7. verifica salud y resultado;
8. promueve, aborta o recupera.

### C. Responder a un incidente

1. preserva telemetría y release;
2. recupera servicio;
3. modela observado/esperado;
4. separa código, configuración y contrato;
5. corrige;
6. prueba la corrección;
7. actualiza runbook, test o modelo propietario.

### D. Modernizar o retirar

1. inventaría consumidores, datos y obligaciones;
2. modela coexistencia;
3. congela interfaces;
4. migra por resultados;
5. prueba reversa;
6. drena dependencias;
7. revoca y desmantela;
8. archiva evidencia.

## Fuentes y siguiente paso

Autoridades:

- [Manual para transformar sistemas](manual-sistemas-opm.md);
- [Manual de opforja](manual-opforja.md);
- [Uso productivo](uso-productivo.md);
- [resolutor OPM/Forja](canon-opm/resolutor-urn.json);
- código, tests y contratos del repositorio.

Vuelve al [índice documental](README.md) o usa la
[hoja rápida de software](cheatsheets/opforja-software.html).
