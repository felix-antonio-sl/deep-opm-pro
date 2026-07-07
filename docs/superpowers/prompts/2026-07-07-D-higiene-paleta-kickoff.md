# Kickoff — D-higiene del gestor + paleta Cmd+K

> Prompt de arranque autocontenido. Cópialo tal cual. La parte de ESPECIES del gestor se fusionó con B′⊕D; aquí queda la higiene pura (sin especies, adelantable) + la paleta.

---

Estoy trabajando en el programa «experiencia ágil mesa↔skill» de opforja (deep-opm-pro), para mí (Félix, operador experto).

Necesito que el gestor de modelos/carpetas sea **una superficie honesta** (hoy el diálogo «Abrir modelo» tiene dos buscadores apilados, vacíos duplicados sin CTA, una sección «JSON» ambigua y un footer sin primario) y que la paleta **Cmd+K** sea **liviana y por intención** (hoy hay atajos duplicados y jerga en el chrome).

Con eso en mente: construye **D-higiene + paleta** — (1) **higiene pura del gestor** (un solo buscador, sidebar mínima de carpetas + Archivo, «Importar JSON» como acción del encabezado no sección, footer con primario visual, un vacío con CTA por contexto, copy es-CL llano, acciones destructivas al hover con confirmación nombrada); (2) **paleta de tres estratos** (Contextual a la selección primero · Crear · el resto por recencia), deduplicada (`Ctrl+T` duplicado → queda uno), microcopy verbo-primero sin jerga, sin duplicar la búsqueda de cosas (`Ctrl+F` es esa casa). Esto ejecuta m-2/m-5/M-5 de la auditoría Jobs.

Primero, lee estos archivos completos antes de responder:
- `docs/superpowers/specs/2026-07-06-chrome-gestion-design.md` — el diseño (higiene §1, paleta §2). **NOTA**: las dos zonas por especie del gestor pertenecen a B′⊕D, no a este corte; aquí solo la higiene que NO toca especies.
- `docs/auditorias/2026-06-12-auditoria-ux-jobs.md` — m-2 (las 5 fallas del diálogo «Abrir»), m-5 (`Ctrl+T` duplicado), M-5 (jerga del chrome, microcopy literal en su tabla).
- `app/src/ui/DialogoCargarModelo.tsx` — el gestor a reescribir (higiene).
- `app/src/ui/CommandPalette.tsx` + `app/src/ui/CommandPalette.test.ts` — la paleta a reagrupar; el test de inventario protege «cero atajos duplicados» y «todo comando pertenece a un estrato».
- `app/src/ui/DialogoVersiones.tsx` / `DialogoImportarExportarJson.tsx` — patrones de diálogo hermanos (footer con primario, importar como acción).
- `ui-forja/GOVERNANCE.md` — tokens, copy, cadena de precedencia visual.

Referencia de lo que quiero lograr: `2026-07-06-chrome-gestion-design.md` §1–§2, y la tabla de microcopy literal de la auditoría Jobs M-5.

Este es un problema **rutinario-a-difícil** y acotado (higiene de UI + microcopy + reagrupación de la paleta; sin kernel). No te subestimes en el gusto: el objetivo es que se sienta inevitable, no «arreglado». Valida el detalle visual con el agente `steve-jobs` dentro del corte (patrón PUERTA).

Cuando tengas suficiente para actuar, actúa. No re-deduzcas lo establecido, no re-litigues mis decisiones ni inventaríes opciones que no vas a seguir. ¿Sopesas una elección? Da una recomendación. Haz lo más simple que funcione bien. Sin features, refactors ni abstracciones extra. Sin manejo de errores para escenarios que no pueden ocurrir. Si estoy describiendo un problema, el entregable es tu evaluación. Reparte subtareas independientes entre subagentes y sigue trabajando (gestor y paleta son radios disjuntos). Verifica con un subagente de contexto fresco contra la spec **cada tarea**, e in-vivo el copy contra M-5. Antes de reportar avance, audita cada afirmación contra un resultado de herramienta de esta sesión. ¿Sin verificar? Dilo. ¿Tests fallando? Muestra la salida. Registra lecciones en `docs/memorias-aprendizajes/notas-chrome-gestion.md` — una por archivo, con resumen de una línea. Actualiza, no dupliques. Borra lo que resulte incorrecto. Pausa solo para: acciones destructivas, cambios reales de alcance, o input que solo yo puedo dar. Si no, procede de punta a punta. Nunca cierres tu turno con una promesa. Abre con el resultado — el TLDR que te pediría. Frases completas, sin cadenas de flechas, sin abreviaturas que no vi antes. Claro le gana a corto.

**Gate del corte**: `cd app && bun run check` + `lint` + `design:governance` + `browser:smoke`; e2e del gestor (buscador único, CTA en vacío, eliminar confirma, drag a carpeta persiste) + de la paleta (estrato contextual solo con selección, cero atajos duplicados). Toca UI → cambia el bundle → **deploy = gate humano**.
