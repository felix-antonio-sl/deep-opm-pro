# Puente directo mesa↔skill — diseño (Corte A′: motor + vitrina)

**Fecha:** 2026-07-06 · **Estado:** HISTÓRICO PARCIAL; la versión 1 fue realizada
y desplegada en su corte.

> **Aviso de vigencia (2026-07-18).** Este documento conserva el diseño y la
> procedencia de la vitrina (§6), pero ya no gobierna la autenticación ni el
> protocolo de escritura descritos en §§4, 5, 7 y 8. Esos contratos fueron
> sustituidos por el `Testigo-Base`, el commit atómico y el Bearer de mínimo
> privilegio de
> [Manual de opforja · A.6](../../manual-opforja.md#a6-puente-directo-mesaskill-cli).
> La fuente actual implementa ese protocolo 2.0, todavía no desplegado al
> publicar este aviso; producción conserva el puente anterior y W6.0 es el
> camino seguro hasta verificar un backend compatible.

## 1. Función esencial

Que la skill `modelamiento-opm` y la mesa opforja **compartan estado sin que el humano transporte bytes a mano**. Tras este corte: la skill **lee** (`mesa pull`) y **escribe** (`mesa push`) directo contra el backend; el operador pide y ratifica.

**Principio rector:** el rigor se cobra al graduar, no al explorar.
**Mandato de implementación:** la forma más elegante y mínima sin perder formalidad ni seguridad. Elegancia = **reuso** (generador W6.0, contrato de import, versiones, optimistic locking, degradación por especie).

**Partición del corte (steipete, ratificada):** la seguridad del puente NO depende de la vitrina — «nunca pisar» lo garantiza el 409 del servidor, no el chip.
- **A′-motor** (Ola 1, sin DOM): fundación `especieDe()` + token + CLI + leyes. Entrega el dolor #1 completo por el camino headless.
- **A′-vitrina** (Ola 2, todo Preact): chip ramificado + reuso del visor de versiones + colapso de hitos. Madura aparte, en paralelo con B′ (radios disjuntos).

## 2. Decisiones fijadas (no reabrir sin HITL)

| Decisión | Valor | Quién |
|---|---|---|
| Usuario objetivo | Félix, experto, en el bucle skill↔mesa | operador |
| Iteración ideal | un gesto: la skill lee/escribe directo | operador |
| Aterrizaje del push | nueva revisión del mismo modelo, snapshot previo, rollback=restaurar | operador |
| Token | env fail-closed single-operator (tabla scrypt = YAGNI, no reflotar) | operador + comité |
| Nacimiento humano | **todo nace apunte** (una puerta «Nuevo»); el CLI declara especie explícita al crear | operador 2026-07-06 |
| Bottom-up | primera clase (doctrina resuelta) → corte B′⊕D-especies | operador-custodio |
| Programa | Ola 1: A′-motor ∥ higiene-gestor ∥ solicitud custodio día 0 · Ola 2: B′⊕D-especies ∥ A′-vitrina · C′ paralelo | arbitraje sobre comité |

## 3. Fundación previa (mini-hito): `especieDe()`

Selector puro `especieDe(record): 'apunte' | 'modelo' | 'biblioteca'` computado **una vez al borde de lectura** desde los dos flags existentes, consumido por CLI (columna especie), gestor (zonas/chips) y graduación. **No toca el encoding** (los dos booleanos quedan; migrarlos antes del 3er flag está prohibido por CLAUDE.md) — mata el decode disperso que sembraría el O(N²).

**Guardia dura para ejecutores:** ningún flag booleano de especie nuevo en ningún corte del programa; un 3er discriminante obliga a la migración al discriminado ANTES de mergear. La forma futura del discriminado NO es el coproducto plano de 3: es el **producto rigor×rol restringido** por `rol=fuente ⇒ rigor=cierra` (ontología de dos ejes, ver spec B′ §2-bis).

## 4. Autenticación: token de agente

- **`MODEL_AGENT_TOKEN`** (≥48 chars, `openssl rand -hex 32`) en el env del contenedor `opforja-model-api` (`.env` chmod 600 del compose). Sin token en env → carril deshabilitado (fail-closed).
- **`MODEL_AGENT_IDENTITY`** = `tenantId:userId` fijos (la identidad del operador).
- Servidor: `crearTokenSessionResolver` lee `Authorization: Bearer`, compara en tiempo constante (`crypto.timingSafeEqual`) y produce **`{ tenantId, userId, auth: true }`** — el `auth: true` es load-bearing: sin él, el gate `requireAuth` devuelve 401 (hallazgo steipete). El resolver de token **no emite `setCookie` ni acuña tenants anónimos**. Composición: `crearResolverEncadenado([token, cookie])` en el punto de inyección existente.
- Agente: token en `~/.config/opforja/agent-token` (chmod 600). Revocación = rotar + `docker compose up -d`.

## 5. CLI de mesa — tres verbos (`app/scripts/mesa-cli.ts`, Bun, reusa el kernel)

Config: `OPFORJA_API_URL` + archivo de token. Un archivo, fetch plano, cero dependencias nuevas.

### `mesa modelos`
Lista: id, nombre, **especie** (vía `especieDe()`), revisión, fecha.

### `mesa pull <modeloId|nombre>`
1. **Base de trabajo con criterio exacto** (steipete): el autosave es la base sii `autosave.creadoEn > modelo.actualizadoEn`; si no, lo guardado. El encabezado expone **ambos testigos**: `rev N` + timestamp del autosave.
2. Contexto compuesto por **`exportarContextoSkill` — el mismo generador del botón W6.0** (función pura).
3. Encabezado declara: `Especie:` (la skill modula su régimen) y `Fuente: guardado rev N | autosave no consolidado (no ratificado)`.

### `mesa push <modeloId|nombre> <bundle.json> --nota "…"`
1. **Valida local** con el contrato de import duro; bundle inválido → rechaza sin tocar el backend.
2. **Carril por procedencia**: modelo con sello → exige bundle del compilador (JSON artesanal rechaza con «edita el proto y recompila»); modelo sin sello (nacido en la mesa) → push libre, la versión lo declara.
3. **Base no ratificada = rechazo mecánico** (steipete): si la base del pull fue autosave, el push exige `--confirmado-por-operador` (el humano ratificó en el diálogo); sin la bandera, rechaza. La norma de método se vuelve gate.
4. Snapshot de seguridad + guardado con optimistic locking; revisión avanzada → **409 → aborta** y pide re-pull. El 409 es la **guardia de fast-forward**: la mesa se niega a computar una fusión (pushout) sin base fresca — nunca fusiona a ciegas, nunca pisa.
5. **Push a un NOMBRE que no resuelve lo CREA** declarando especie explícita (`--especie apunte|modelo`, obligatoria al crear: la ceremonia se mata para el humano, la explicitud se conserva para la máquina); push a un modeloId inexistente = error (typo). Push a biblioteca rechaza (solo-lectura).
6. Push a apunte: valida solo integridad (validez→observación, maquinaria existente).
7. Salida: delta de conteos + revisión nueva.

### Historial (v1 = etiqueta; colapso diferido)
Cada push etiqueta su versión `agente·s<id>·<nota>` (procedencia visible — lo load-bearing). El **colapso visual por sesión se difiere a A′-vitrina** (la semántica de «sesión» con escritura intercalada humano↔agente es complejidad real; steipete).

## 6. A′-vitrina (Ola 2, paralela a B′)

- **Chip «Revisión nueva» ramificado** (poda jobs): sin cambios locales → `Recargar`; con cambios locales → `Ver la del agente` (reusa el **visor de versiones existente**, no se construye visor nuevo) + `Descartar los míos y traer la del agente` (nombrado por su costo).
- «Cambios locales» se define ANTES de construir (no existe dirty-bit limpio): base local < revisión remota + frescura de autosave/pila de undo. Riesgo top-2 del comité.
- **Gobierno visual**: el chip de revisión y el chip de drift del Centinela son ambos hairline en TINTA — diferenciarlos explícitamente; pasa `design:governance`.
- Colapso de hitos por sesión de agente (ancla = snapshot pre-agente).

## 7. Skill v1.12.0 (solicitud upstream, HITL custodio)

Camino primario directo: `mesa pull` → trabajar → `mesa push`; pull-antes-de-push · nunca push sin validación verde · respetar el 409 · sobre base no ratificada, pedir confirmación del operador (y pasar la bandera) · nota con procedencia. W6.0 portapapeles = fallback declarado. Incluye la **receta bottom-up disponible hoy** (apuntes + composición) mientras B′⊕D no despliega.

## 8. Leyes y verificación

| Ley | Falsación |
|---|---|
| **Determinismo del generador** (antes «bisimetría») | `mesa pull` byte-igual a `exportarContextoSkill` corrido sobre el MISMO modelo-fuente (chequeo de pureza; NO es la ley de seguridad — steipete). |
| **Counit: `pull∘push` preserva** | tras `push(B)`, un `pull` inmediato produce proyección semántica ≡ a la de B (módulo revisión/normalización). Atrapa la pérdida silenciosa del backend. |
| **Clausura: `push∘pull` sin delta = no-op** | pull sin ediciones + push ⇒ NO se crea revisión ni versión (rechazo-por-vacío). Sin esto, cada ciclo infla el historial. |
| **Push inválido no toca** | bundle que viola el contrato → cero llamadas de escritura. |
| **Carril por procedencia** | artesanal a modelo con sello → rechaza; a modelo sin sello → pasa. |
| **Fast-forward** | push sobre revisión avanzada → 409 → aborta; remoto intacto. |
| **Base ratificada** | push con base-autosave sin `--confirmado-por-operador` → rechaza. |
| **Token** | ausente/malformado/incorrecto → 401 tiempo-constante; env sin token → carril deshabilitado. |
| **Especie** | push a biblioteca rechaza; a apunte degrada validez y NUNCA integridad. |

Integración contra `devModelPersistence`. Gates: check + lint + governance (+ smoke en vitrina). Deploy toca `opforja-model-api` → gate humano del curador.

## 9. Riesgos (top del comité)

1. **Clasificación autosave-como-base** (crux de correctitud del pull) → criterio exacto + doble testigo + gate mecánico de ratificación.
2. **Dirty-bit del chip** → definición previa, diferido a vitrina; la seguridad ya vive en el 409.
3. **Token estático en prod** → entropía, 600, tiempo constante, rotación, alcance = cuenta del operador.

## 10. Procedencia

Brainstorming (4 HITL) → veredicto jobs #1 (5 podas) → matices arquitecto → mandato de elegancia (token env) → **comité doble jobs×steipete con cat-thinking** (partición motor/vitrina, `especieDe()`, leyes counit/clausura, 409 fast-forward, autosave exacto, etiqueta-antes-que-colapso) → «todo nace apunte» ratificado por el operador.
