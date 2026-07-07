# Kickoff — B′⊕D-especies (apuntes de primera clase + Taller bottom-up + gestor 2 zonas)

> Prompt de arranque autocontenido para la ola más grande del programa. Cópialo tal cual para lanzar el corte. Doctrina resuelta; diseño aprobado; esto lo ejecuta. **Requiere autoría de enmienda SSOT con firma del custodio ANTES del deploy.**

---

Estoy trabajando en el programa «experiencia ágil mesa↔skill» de opforja (deep-opm-pro), para mí (Félix, operador experto).

Necesito poder **bosquejar OPM sin ceremonia**: abrir una hoja y trazar sin nombrar, sin carpeta, sin SD exigido, con fragmentos sueltos legítimos — y **arrancar bottom-up**, de OPDs sueltos ir reconciliando hacia el SD0, con un camino de ascenso cuando el bosquejo madura. El rigor se cobra al graduar, no al explorar.

Con eso en mente: construye **B′⊕D-especies** — (1) **«todo nace apunte»**: una sola puerta «Nuevo» que abre al instante una hoja explorando (apunte = el `esApunte` existente), auto-nombre `Apunte AAAA-MM-DD`, sin diálogo, autosave desde el primer trazo; «modelo» es lo que un apunte se vuelve al **graduar** (ahí recién pide nombre/carpeta y la validez pasa de observación a exigible). (2) **Taller bottom-up**: OPD suelto (`Opd.padreId: null`, el tipo ya lo admite) bajo banda «Taller» del árbol; **constructor único `establecerRefinamiento(padre, hijo, modalidad)`** que invocan por igual el camino top-down y el verbo **«adoptar»** (convergencia por construcción, no test extensional); «OPD sin adoptar» = **condición del gate de export canónico existente** (`gateDensidadCanonica`), NO una clase de severidad nueva. (3) **Gestor de dos zonas rigor×rol** (Trabajo con chip de rigor que muta in-situ al graduar · Bibliotecas aparte). (4) **Enmienda SSOT** (metodología + spec-opd §10/§12) autoreada como entregable, para firma del custodio ANTES del deploy.

Primero, lee estos archivos completos antes de responder:
- `docs/superpowers/specs/2026-07-06-apuntes-taller-design.md` — el diseño gobernante (granularidad HOJA, dos ejes §2-bis, nacimiento §3, Taller §4, enmienda §5, gestor §6, leyes §7).
- `docs/solicitudes-upstream/2026-07-06-taller-bottom-up-doctrina.md` — doctrina **RESUELTA: bottom-up primera clase** (no la re-litigues).
- `docs/solicitudes-upstream/2026-07-06-skill-v112-puente-directo.md` — la enmienda SSOT ya elevada (Petición 2); tu autoría la realiza.
- `CLAUDE.md` §Deuda categorial activa — **guardia dura: cero flags de especie nuevos**; «Taller»/«cuaderno» = banda virtual, NO especie persistida; al 3er flag el discriminado es el producto rigor×rol restringido, no un coproducto plano.
- `app/src/modelo/tipos/opd.ts` — `Opd.padreId: Id | null` (la rama null es el OPD suelto; cero estructura nueva).
- `app/src/persistencia/workspace.ts` — `marcarApunte`/`marcarBiblioteca` (exclusión mutua sellada); la banda virtual del gestor se deriva de aquí.
- `app/src/modelo/diagnosticoSeveridad.ts` — `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE` (whitelist por-clase; «OPD sin adoptar» entra aquí para apuntes).
- `app/src/ui/DialogoCargarModelo.tsx` — el gestor a reorganizar en dos zonas.
- La refinación top-down existente (busca `descomponerProceso`/`desplegarObjeto` en `app/src/modelo/operaciones/`) — el camino que `establecerRefinamiento` debe factorizar con «adoptar».
- SSOT a enmendar (kora-pneuma, autoría del custodio): `/home/felix/kora-pneuma/artefactos/conocimiento/fxsl/metodologia-forja-opm-es.md` y `.../spec-forja-opd-es.md` §10/§12.

Referencia de lo que quiero lograr: `2026-07-06-apuntes-taller-design.md` completo, más el hallazgo del comité (dos ejes rigor×rol, constructor único) registrado en el frente 0 del HANDOFF.

Este es el problema **más difícil y grande** del programa (kernel + UI + SSOT; tamaño de toda la Ola 1). No te subestimes; escópalo como si estuviera en el tope de tu rango. **Empieza por escribir su plan de implementación** (skill writing-plans) antes de construir; el orden natural: enmienda SSOT autoreada (día 0, para firma en paralelo) · kernel del Taller (`establecerRefinamiento` + OPD suelto + adoptar + ley de convergencia) · UI del Taller (banda + gesto adoptar) · «todo nace apunte» (una puerta + momento de graduación) · gestor de dos zonas. **La enmienda SSOT NO se despliega sin firma del custodio** (la mesa eleva ANTES).

Cuando tengas suficiente para actuar, actúa. No re-deduzcas lo establecido, no re-litigues mis decisiones ni inventaríes opciones que no vas a seguir. ¿Sopesas una elección? Da una recomendación. Haz lo más simple que funcione bien. Sin features, refactors ni abstracciones extra. Sin manejo de errores para escenarios que no pueden ocurrir. Si estoy describiendo un problema, el entregable es tu evaluación. Reparte subtareas independientes entre subagentes y sigue trabajando. Verifica con un subagente de contexto fresco contra la spec **cada ola** (kernel · UI-Taller · nacimiento · gestor), y adversarialmente la ley de convergencia. Antes de reportar avance, audita cada afirmación contra un resultado de herramienta de esta sesión. ¿Sin verificar? Dilo. ¿Tests fallando? Muestra la salida. Registra lecciones en `docs/memorias-aprendizajes/notas-apuntes-taller.md` — una por archivo, con resumen de una línea. Actualiza, no dupliques. Borra lo que resulte incorrecto. Pausa solo para: acciones destructivas, cambios reales de alcance, o input que solo yo puedo dar (la **firma de la enmienda SSOT es mía como custodio**). Si no, procede de punta a punta. Nunca cierres tu turno con una promesa. Abre con el resultado — el TLDR que te pediría. Frases completas, sin cadenas de flechas, sin abreviaturas que no vi antes. Claro le gana a corto.

**Gate del corte**: `cd app && bun run check` + `lint` + `design:governance` + `browser:smoke`; leyes falsables de §7 (convergencia, rigor-al-graduar, integridad-ciega-a-especie, export-honesto, entrada-desatendida, sin-especie-nueva). Toca kernel+UI → cambia el bundle → **deploy = gate humano DESPUÉS de la firma SSOT**.
