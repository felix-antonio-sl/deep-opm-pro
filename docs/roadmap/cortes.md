# Roadmap — cortes del compuesto OpForja

**Fecha:** 2026-06-22 · **Estado:** escalera vigente. **Reemplaza** a `cortes-operativos.md` (pisos alpha→beta cerrados) y `backlog-contingencial.md` (W1–W4 cerrados), ambos jubilados.
**Fuente de autoridad:** `docs/superpowers/specs/2026-06-22-compuesto-opforja-design.md` (diseño aprobado por el operador) + decisiones de autoridad resueltas por consenso (spec §5).
**Documento vivo:** se reescribe, no se acumula. El estado desplegado vive en `HANDOFF.md`; los gates en `quality-ledger.md`; el rastro de conformidad y de versiones de órganos en `registro-conformidad-ssot.md`.

## Principios de corte (invariantes)

1. **Loop-closure por corte:** ningún corte abre el siguiente sin cerrar su gate (verde) **y** declarar su *outcome* (a quién sirvió, qué decisión abarató). `output ≠ outcome` es invariante: cerrar con gate verde pero sin outcome declarado es brecha silenciosa prohibida (R-CONF-7).
2. **Owner por frontera + Owner del TODO:** el *Owner del Cordón* (el operador con sombrero explícito) responde por el valor del compuesto entero; cada frontera tiene un owner nombrado. Autoridad de escritura partida: sobre SSOT/skill se **propone** (pneuma, HITL custodio-kora); sobre app/docs se **escribe**.
3. **Métrica maestra:** *lead-time-to-validated-value* — tiempo desde editar un órgano hasta que el gate testifica que los demás siguen coherentes. Registrador = Owner del Cordón; vehículo = `registro-conformidad-ssot.md` + `logDecisiones.ts`; cadencia = cierre de corte + consolidación de HANDOFF. **No** es gate de CI.
4. **Honestidad de coste:** la divergencia se **reporta** (sello), la brecha se **declara** (R-CONF-7), el golden se re-pin con bump + ojo humano. Nunca se degrada ni se silencia. El cierre del organismo es **implicación**, no bicondicional, mientras haya fronteras sin testigo.
5. **Gate de filtro de valor (tramo E):** todo corte de expresión declara beneficiario + decisión soportada + test anti-paridad-OPCloud **antes** de abrir.
6. **No jubilar por fiat** las decisiones rectoras `UX-EXTERNA` y `EQUILIBRIO` (actas HITL vigentes): su reapertura exige HITL explícito del operador.
7. **Sin trigger, sin pago:** la deuda categorial `O(N²)` (coproducto tagged de selección) se paga **solo** si un corte introduce un 4º tipo seleccionable; el disparo es decisión de valor del owner, no efecto colateral.

---

## Tramo C — cordón umbilical (coherencia entre órganos)

Eleva y conecta los tres testigos del cordón. Decisiones de autoridad ya resueltas (spec §5).

- **C0 — Owner + vehículo.** Nombrar el *Owner del Cordón* (acta breve: owner + decisión-servida por cada frontera). Extender `registro-conformidad-ssot.md` con la tabla del control plane (5 órganos · versión observada · fuente · última verificación) y las filas *sin testigo*. Blast cero.
- **C1 — version-match skill↔app. ✅ RESUELTO 2026-06-24.** 7ª conjunción de `gate:refactor` (`bun run cordon:skill`): lee la versión AUTÉNTICA del **deploy** desde el bloque proof-carrying `<!-- kora:sello … -->` del **cuerpo** (NO del frontmatter, que el transmutador deja mínimo por diseño) y la compara con `CORDON_SKILL_ESPERADO` (`version` + `hash-fuente` + `target`) pineado en el repo. Matriz de dureza: `version` ≠ → **FALLO** `[CORDON] deploy stale: skill vX != esperada vY`; `hash-fuente` drift con `version` igual → **ADVERTENCIA** (no rompe); `target` ajeno → **FALLO**; deploy ausente → **SKIP nombrado**. **Sin prereq de pneuma**: la premisa «el transmutador borra el version» era una verificación incompleta del frontmatter — el version vive en el sello del cuerpo (universal en las 24 skills emitidas). Implementación: `app/src/canon/selloSkill.ts` + `app/scripts/cordon-skill-audit.ts`. Petición menor pendiente (no bloqueante): canonizar el contrato «leer del sello» en `ley/` (`docs/solicitudes-upstream/2026-06-24-cordon-version-skill-via-sello.md`). Owner: Cordón.
- **C2 — sello a 5 testigos.** Prereq bloqueante (blast cero): **colapsar** la lista del sello a un punto de verdad (`json.ts:344` importa `COMPONENTES_SELLO` de `procedencia.ts:88`; corregir doc `extensiones.ts:143`, off-by-one `json.ts:335` "4"→"3", comentario `reproducibilidad.ts:5`). Luego añadir `doctrinaVersion` + `skillVersion` como capa aditiva rollback-free (`procedencia.test.ts` es el hogar de regresión). `doctrinaVersion` solo se sella cuando exista su check reportador (C3). Owner: Cordón.
- **C3 — resolutor URN.** `docs/canon-opm/resolutor-urn.json` (mapa URN→path-relativo + semver observada) + lectora ~15 líneas; **apunta a pneuma** (régimen-de-ley HITL 2026-06-15); `KORA_RAIZ` env. Des-hardcodear los 4 puentes (`metodologia-forja.md:31`, `reglas-opm-estrictas.md:30`, `spec-forja-opd.md:28`, `spec-forja-opl.md:28`). **Test atómico en el mismo corte** (existencia + match de `source:`; SKIP nombrado si `KORA_RAIZ` no montada). El delta de versión se reporta, no bloquea. `doctrinaVersion` (C2) reusa este resolutor. Owner: Cordón + custodio-kora (HITL).
- **C-skill (D3).** Re-sincronizar `fuente:` de la skill a versiones vivas + bump a v1.10.0 + confirmar (no reescribir) el cuerpo; añadir bloque "Límites de la mesa". Tejido en C.
- **C-manual (D4).** Traer el manual al repo, **consolidado** en `docs/manual-opforja.md`; cita la SSOT por URN (nunca transcribe); puente inverso en el resolutor; `§10` abstracto (no HODOM); 2 piezas nuevas (§A pista-agente, §L límites); check `manual:limites` (no-contradicción §L ↔ registro). Tejido en C.

---

## Tramo X — exoesqueleto interno: sistema de diseño (D8)

Puede correr en paralelo a C (frontera dura, 100% local a deep-opm-pro, no toca KORA).

- **X-OlaA — versión única (valor real, barato, independiente).** Resolver la deriva viva de versión de diseño (`tokens.json` 1.1.0 vs `GOVERNANCE`/`01-design-spec` 1.2 → alinear a la autoridad normativa) y que `design:governance` **lea** la versión de la SSOT en vez de hardcodearla (`design-governance-audit.mjs:95`). Entrega valor verificable sola, sin generador.
- **X-OlaB — condicional (solo si Ola A prueba el balance de lead-time).** Generador `spec:gen`: P2a (`tokens.css` + front-matter `DESIGN.md`, byte-idéntico) → **P2b** (`tokens.ts`) gateado por *spike* de byte-identidad (si falla, **diferir** y dejar `tokens.ts` como espejo verificado) → P3 gate v2 bidireccional → P5 Intent Contract en `GOVERNANCE.md` con criterio net-positive de lead-time. `DESIGN.md` = vehículo (lo lee la skill local `design`, no el SaaS). Frontera dura: lo OPM-semántico **fuera** de `DESIGN.md`. Owner: Diseño.

---

## Tramo E — expresión (tests de estrés de la co-evolución)

Cada corte pasa el gate de filtro de valor (principio 5) antes de abrir.

- **E1 — estereotipos + vitrinas (D6).** Plantilla de subgrafo clonada-e-injertada; `Modelo.estereotipos?` aditiva; `Entidad.estereotipoId?:Id` + adaptador (migración del `requirement` = 9 sitios; `validarEntidades.ts:59` = cambio de contrato de import). OPL-invariante v1; canvas `<<Nombre>>`; **vitrinas** de objetos/enlaces/patrones compuestos. Propaga a las 5 partes (incl. skill + manual) **en el mismo corte**. Acota a mecanismo genérico + `requirement` reconstruido; catálogo multi-ámbito/permisos = paridad-OPCloud declarada-no-implementada.
- **E2 — modo pizarra (D7). REVERTIDO 2026-06-23.** Se construyó (D7.1 kernel `Opd.bocetos?` no-semántico + D7.2 UI pizarra + promoción boceto→modelo/enlace) y se desplegó, pero «no resultó como quería» el operador → revert quirúrgico de la totalidad del subsistema boceto (D6 intacto). Detalle en la historia git y en `HANDOFF.md` (entrada 2026-06-23).

---

## D1 — refactor, transversal

- **Temprano (blast cero):** congelar la ley **render↛SSOT** como test falsable (`dependencias-unidireccionales.test.ts`, allowlist congelado, caso negativo de control). Des-derivar bestia→pneuma se realiza en C3.
- **Bajo trigger:** deuda `O(N²)` (coproducto tagged, ~74 archivos; `KindSeleccion` ya existe) → migrar a `seleccion:{tipo,id}` discriminado **solo** si E1/E2 introducen un 4º tipo seleccionable. La migración precede a la feature.
- **Por valor:** split `enlaces.ts → firmas.ts` solo si abarata una decisión futura (no por tamaño). No tocar el par espejo OPL.

---

## Control plane y cierre

- **`bun run cordon:estado`** (~30 líneas, `app/scripts/`): imprime las 5 versiones de los órganos (leyéndolas de donde ya viven) y **lista las fronteras sin testigo** (deploy-semántico a2, `uso-productivo.md`) como filas marcadas «sin testigo / cierre=implicación». Su resultado se consigna por corte en `registro-conformidad-ssot.md`.
- **Cierre del organismo = meta, no hecho.** El bicondicional pleno (verde ⟺ los 5 órganos coherentes) se alcanza cuando las 6/7 fronteras tengan testigo. Hoy: implicación (verde ⟹ las fronteras testificadas conmutan).

## Decisiones de autoridad (resueltas)

Las 5 decisiones de placement/autoridad (skill, `doctrinaVersion`, mapa URN→path, manual, huecos) están **resueltas por consenso** — ver `docs/superpowers/specs/2026-06-22-compuesto-opforja-design.md` §5.
