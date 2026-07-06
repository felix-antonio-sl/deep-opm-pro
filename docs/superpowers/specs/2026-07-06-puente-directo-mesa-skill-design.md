# Puente directo mesa↔skill — diseño (Corte A′)

**Fecha:** 2026-07-06 · **Estado:** aprobado por el operador (brainstorming interactivo + veredicto adversarial `steve-jobs` con la skill `modelamiento-opm` v1.11.0 como lente) · **Spec gobernante del corte.**

## 1. Función esencial

Que la skill `modelamiento-opm` y la mesa opforja **compartan estado sin que el humano transporte bytes a mano**. Hoy el operador es el portapapeles del bucle (copiar contexto W6.0 → pegar → re-emitir bundle → re-importar). Tras este corte: la skill **lee** (`mesa pull`) y **escribe** (`mesa push`) directo contra el backend, y el operador solo pide y ratifica.

**Principio rector:** el rigor se cobra al graduar, no al explorar.
**Mandato de implementación (operador, 2026-07-06):** la forma más elegante, minimalista y simple que no pierda formalidad ni seguridad; autorizado refactorizar desde 0 si es necesario. Lectura aplicada: la elegancia aquí es **reuso** — el corte no necesita refactor desde cero; cada pieza nueva se apoya en maquinaria existente (generador W6.0, contrato de import, versiones, optimistic locking, degradación por especie).

## 2. Decisiones fijadas (no reabrir sin HITL)

| Decisión | Valor | Quién |
|---|---|---|
| Usuario objetivo | Félix, experto, en el bucle skill↔mesa | operador |
| Dolor #1 | plomería mesa↔skill | operador |
| Iteración ideal | un gesto: la skill lee/escribe directo | operador |
| Aterrizaje del push | nueva revisión del mismo modelo, snapshot previo, rollback=restaurar | operador |
| Corte B (Taller bottom-up) | **fuera de ESTE corte**; doctrina **resuelta por el operador-custodio 2026-07-06: primera clase** → corte propio B′ (spec `2026-07-06-apuntes-taller-design.md`); mientras B′ no exista, bottom-up = apuntes + composición | veredicto jobs + resolución custodio |
| Corte C (agilidad diagramática) | **frente propio paralelo**; arranca con re-auditoría in-vivo (la lista M/m es de 2026-06-12 y el Inspector cambió) | veredicto jobs, aceptado |
| Horizonte nombrado (no de este corte) | diálogo dialéctico anclado EN la mesa (canal inverso skill→mesa sobre notas W6.5-a) | veredicto jobs |

## 3. Autenticación: token de agente (elegancia sobre ceremonia)

- **`MODEL_AGENT_TOKEN`** (≥ 48 chars aleatorios, `openssl rand -hex 32`) en el env del contenedor `opforja-model-api` (mismo `.env` chmod 600 que ya exige el compose). **Sin token en env → carril deshabilitado** (fail-closed, como `MODEL_SESSION_SECRET`).
- **`MODEL_AGENT_IDENTITY`** = `tenantId:userId` a los que el token resuelve (la identidad del operador; single-operator hoy).
- Servidor: `crearTokenSessionResolver` lee `Authorization: Bearer <token>`, compara en **tiempo constante** (`crypto.timingSafeEqual`), produce la misma `PersistenciaSesion {tenantId, userId}` que la cookie; se **encadena** al resolver de cookies existente (Bearer primero, cookie después). Cero cambio para el navegador.
- Agente: token en `~/.config/opforja/agent-token` (chmod 600, convención del host).
- Revocación = rotar el token + `docker compose up -d` (single-operator: suficiente y honesto). **Camino de crecimiento** (solo si llega multi-agente): tabla `opforja_agent_tokens` con hash scrypt — NO se construye hoy (YAGNI).
- Sin privilegio nuevo: el token ve exactamente lo que ve la cuenta del operador. Rate-limit nginx existente aplica.

## 4. CLI de mesa — tres verbos (`app/scripts/mesa-cli.ts`, Bun, reusa el kernel)

Config: `OPFORJA_API_URL` (default: instancia productiva) + archivo de token. Un solo archivo; fetch plano; sin dependencias nuevas.

### `mesa modelos`
Lista modelos del tenant: id, nombre, **especie** (modelo/apunte/biblioteca), revisión, fecha.

### `mesa pull <modeloId|nombre>`
1. Baja el estado: **autosave si es más nuevo** que lo guardado, si no lo guardado («lo que ves es lo que la skill recibe»; `Ctrl+S` deja de ser peaje).
2. Compone el contexto con **`exportarContextoSkill` — el MISMO generador del botón W6.0** (función pura del kernel). Un generador, dos consumidores.
3. Encabeza con la **declaración de especie y de estado** (poda A.2 del veredicto):
   - `Especie: modelo | apunte | biblioteca` (la skill modula su régimen — §Régimen apunte ya existe).
   - `Fuente: guardado rev N | autosave no consolidado (estado no ratificado)`.
   - Regla de método: sobre estado **no ratificado** la skill lee y propone, pero **no cierra el loop con push** sin ratificación del humano.

### `mesa push <modeloId|nombre> <bundle.json> --nota "…"`
1. **Valida local** con el contrato de import duro del producto (mismos validadores de `serializacion/`); bundle inválido → rechaza **sin tocar el backend**.
2. **Carril por procedencia** (poda A.1, matizada — read-through hecho mecánico):
   - Modelo **con sello** (nació de un proto): exige bundle **emitido por el compilador** (porta sello); un JSON artesanal → **rechaza** con instrucción («edita el proto y recompila»). El sello lo pone la máquina: cero fricción humana.
   - Modelo **sin sello** (nacido en la mesa): push libre; la versión declara `sin sello`.
3. Snapshot de seguridad + guardado con **optimistic locking**: si la revisión avanzó (409) → **aborta** y pide re-pull. Nunca pisa.
4. **Push a un NOMBRE que no resuelve lo CREA** (`--apunte` disponible en ese nacimiento); push a un **modeloId** inexistente es **error** (protección contra typos — un id no se inventa). No hay verbos `crear/archivar/eliminar/status` (poda A.3): lo destructivo queda en la interfaz, donde el humano lo ve.
5. Push a **apunte**: valida **solo integridad** (la validez degrada a observación — maquinaria por-especie existente). Push a **biblioteca**: rechaza (solo-lectura por doctrina B1).
6. Salida: delta de conteos (±entidades/enlaces/OPDs) + revisión nueva.

### Historial como hitos (poda A.5)
Una **sesión de agente = un hito**: las versiones del push llevan etiqueta `agente·s<id>·<nota>`; el diálogo de versiones **agrupa** las entradas consecutivas de una misma sesión en un hito colapsable cuyo ancla es el snapshot pre-agente. El historial sigue siendo línea de hitos, no log de transacciones.

## 5. UI: el chip que no miente (poda A.4)

Cuando el modelo abierto queda detrás del backend (verificación de revisión al recuperar foco de la ventana; el 409 del autosave también lo gatilla), aparece un chip hairline en TINTA (jamás crimson):

- **Sin cambios locales**: `Revisión nueva — Recargar` (recargar es honesto: no destruye nada).
- **Con cambios locales sin guardar**: dos acciones nombradas por su costo — `Ver la del agente` (no destructivo: abre la revisión nueva en pestaña de lectura) y `Descartar los míos y traer la del agente` (destructivo, dice lo que hace). No existe «Recargar» a secas en esta rama.

## 6. Skill v1.12.0 (solicitud upstream, HITL custodio — canal de siempre)

El cuerpo aprende el **camino primario directo**: `mesa pull` → trabajar → `mesa push`, con reglas de método: pull-antes-de-push (base fresca) · nunca push sin validación local verde · respetar el 409 (re-pull, jamás forzar) · sobre autosave no ratificado no se cierra el loop · nota de versión con procedencia. El puente W6.0 por portapapeles queda como **fallback declarado** (sesión sin acceso al host). Incluye la **receta bottom-up disponible hoy**: bosquejar fragmentos como **apuntes** (rigor relajado) y llevarlos al modelo madre por **composición de modelos** — sin esperar doctrina nueva.

## 7. Fuera de alcance (con destino nombrado)

- **Taller bottom-up / OPD suelto / verbo «adoptar»**: doctrina RESUELTA por el operador-custodio (2026-07-06, primera clase — ver la solicitud, ya cerrada) → corte propio **B′** con spec `2026-07-06-apuntes-taller-design.md`; su enmienda SSOT pasa por firma del custodio antes del deploy.
- **Servidor MCP**: fase 2 natural encima del CLI.
- **Diálogo anclado en la mesa** (skill→mesa): horizonte declarado del frente, no de este corte.
- **Agilidad diagramática (C′)**: frente propio; re-auditoría in-vivo primero.

## 8. Leyes y verificación

| Ley | Falsación |
|---|---|
| **Bisimetría del puente** | El contexto de `mesa pull` es **byte-igual** al del botón W6.0 para el mismo modelo (mismo generador; test compara ambos). |
| **Push inválido no toca** | Bundle que viola el contrato de import → el backend no recibe ninguna llamada de escritura. |
| **Carril por procedencia** | Push artesanal a modelo con sello → rechaza; a modelo sin sello → pasa. |
| **Nunca pisar** | Push sobre revisión avanzada → 409 → aborta; el modelo remoto queda intacto. |
| **Token** | ausente/malformado/incorrecto → 401 en tiempo constante; env sin token → carril deshabilitado (fail-closed). |
| **Especie** | Push a biblioteca rechaza; push a apunte degrada validez y NUNCA integridad (reusa las leyes del modo apunte). |

Integración contra `devModelPersistence` (middleware dev existente): pull→mutar→push→revisión+hito; conflicto→409. Smoke del chip (ramas con/sin cambios locales). Gates: `check` + lint + `design:governance` + smoke. Deploy toca `opforja-model-api` y la app → gate humano del curador, como siempre.

## 9. Riesgos

- **Token estático en prod**: entropía alta, archivo 600, tiempo constante, revocación por rotación, alcance = cuenta del operador (sin privilegio nuevo). Aceptado por diseño single-operator; camino de crecimiento nombrado.
- **La skill escribe el derivado en modelos con proto**: cerrado por el carril de procedencia (rechazo mecánico).
- **Autosave como base de trabajo**: cerrado por la declaración de estado + regla de método (no cerrar loop sobre no-ratificado).

## 10. Procedencia

Brainstorming interactivo 2026-07-06 (4 clarificaciones HITL) → enfoque A elegido sobre MCP/buzón → veredicto adversarial `steve-jobs` con lente `modelamiento-opm` (A vive con 5 podas · B se corta a upstream · C frente propio · horizonte nombrado) → matices del arquitecto aceptados por el operador (carril por procedencia en vez de sello absoluto; bottom-up hoy por apuntes+composición) → mandato de elegancia (token env en vez de tabla+scrypt+CLI de gestión).
