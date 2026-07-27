# Ronda tutor contextual opforja

Fecha: 2026-07-21  
Base de planificación: `0706bcfca4aaad26f4b249fbd0e2927bb934a6a2`  
Objetivo: implementar el diseño aprobado del tutor contextual sin duplicar el modelador, el diagnóstico ni el corpus normativo.

## Filosofía operativa

- El contrato eje es `docs/superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md`; no se inventan HU para esta ronda.
- Se reutilizan las capacidades vivas y se intervienen solo los gaps verificables.
- El tutor es determinista, local, contextual y con una sola voz por intención o resultado.
- El modelo, store y UI del refinamiento se integran en secuencia; el trabajo paralelo se limita a archivos nuevos y auditoría de solo lectura.
- Cada corte debe quedar usable, recuperable y verde antes del siguiente.

## Reglas duras comunes

1. No copiar código desde `opm-extracted/`; usarlo como referencia y reutilizar solo assets compatibles ya inventariados.
2. No crear chat, panel tutor permanente, telemetría, llamadas de red, LLM ni heurísticas de nombres.
3. `PanelDiagnostico` conserva la propiedad única de hallazgos persistentes; no existe `Revalidar` manual.
4. `preguntaGuia`, ficha y lentes son metadatos: no emiten OPL nuclear ni alteran la firma de frontera.
5. La ausencia de metadatos en documentos legacy permanece ausencia después de exportar/hidratar.
6. Cada mutación de modelo tutorizada cruza un solo `commitModelo`; cancelar es identidad.
7. Integrar vincula un Boceto al árbol sin graduar; graduar cambia rigor, no hechos; marcar Biblioteca cambia rol, no certifica.
8. La linealidad múltiple es una mejora metodológica no bloqueante para composición.
9. La lente categorial solo explica preservación/composición y siempre cita una fuente resoluble.
10. No tocar deploy, base de datos de producto, mesa remota, infraestructura ni repos vecinos.
11. Todo cambio visual pasa `bun run design:governance`; todo corte pasa `bun run check` y su recorrido in-situ.
12. Commits semánticos atómicos sobre `main`, con push controlado después de cada unidad de valor.

## Stack y comandos

```bash
cd /home/felix/projects/deep-opm-pro/app
bun test <archivo-focal>
bun run check
bun run lint
bun run build
bun run design:governance
bun run browser:smoke
bun run cordon:estado
```

## Visión general

| Línea | Título | Contrato eje | Tamaño | Riesgo |
| --- | --- | --- | --- | --- |
| L1 | Núcleo transaccional y ciclo | Cortes 1A–3A | XL | Alto |
| L2 | Registro, corpus y cobertura | Cortes 2A, 3B–7C | L | Medio, aislado hasta integración |
| L3 | Verificación adversarial e in-situ | Gates 13–15 | M | Bajo en código; alto en criterio |

## Inventario 0.5 y delta por corte

| Corte | Capacidad inicial | Delta de esta ronda | Dueño |
| --- | --- | --- | --- |
| 1A | Descomposición directa, sin pregunta | `preguntaGuia`, gateway, edición inline, roundtrip y undo atómico | L1 |
| 1B | Unfold con agregación por defecto e integración directa | Elección explícita de 4 relaciones, integración completa y reordenamiento seguro | L1 |
| 2A | Flash y diagnóstico existentes, sin árbitro tutor | Snapshot mínimo, prioridad estable y deduplicación por resultado | L1+L2 |
| 2B | Apunte/Taller vivos | Copy de régimen, Taller integrable e integrar≠graduar | L1 |
| 2C | Graduación síncrona parcial | Validación, issues navegables, consecuencia y recuperación sin estado parcial | L1 |
| 2D | Biblioteca y guardia ya vivas | Contratos de rol/rigor y ruta combinada desde Apunte | L1+L2 |
| 3A | Estado vacío y descripción libre | Entrada SD-first/Taller y `FichaTrabajo` local sin procedencia | L1 |
| 3B | Objetos, procesos, propiedades, estados y designaciones vivos | Contenido/snapshot, declarado vs runtime y voz única | L2 |
| 3C | Enlaces, control, abanicos, multiplicidad y rutas vivos | Contenido honesto; caso probabilístico C queda `reference-only` | L2 |
| 3D | Requisitos y vocabulario organizacional vivos | Separar requisito/evidencia y declarar normalización léxica | L2 |
| 4A | OPL y preview inverso vivos | Eco/delta real y ruta honesta al canvas | L2 |
| 4B | Diagnóstico, búsqueda, mapa, tabla y razonamiento vivos | Anuncio reactivo y límites estructurales, sin botón manual | L2 |
| 5A | Simulación conceptual viva | Intervenir en bloqueo/paso/decisión; reproducción fluida silenciosa | L2 |
| 5B | Muestreo numérico/CSV vivo | Alcance exacto; no prometer dinámica de procesos | L2 |
| 6A | Piezas, Calcar/Anclar y drift vivos | Decisión independencia/seguimiento y recuperación real | L2 |
| 6B | Submodelo y composición vivos | Referencia/integración, heurística rotulada y linealidad no bloqueante | L2 |
| 7A | Notas, anclas y puente externo vivos | Despacho de autoridad; ficha upstream solo si transporte probado | L2 |
| 7B | Revisión, versiones e intercambio vivos | Secuencias de efectos, destinos, recibos y recuperación | L2 |
| 7C | Ctrl+K y corpus vivos, sin tutor registral | Manifiesto, descriptores, contenidos, escenarios y gate de cobertura | L2 |

## Mapa de archivos y colisiones

| Archivo o familia | L1 | L2 | L3 |
| --- | --- | --- | --- |
| `app/src/modelo/tipos/{opd,modelo}.ts` | EDIT exclusivo | lectura | lectura |
| `app/src/serializacion/*` | EDIT exclusivo | lectura | lectura |
| `app/src/modelo/operaciones/*refinamiento*` | EDIT exclusivo | lectura | lectura |
| `app/src/store/modelo/acciones-opd.ts` | EDIT exclusivo | lectura | lectura |
| `app/src/store/{tipos,sliceTypes,workspaceMod}.ts` | EDIT exclusivo | lectura | lectura |
| `app/src/ui/{App,ArbolOpd,DialogoGraduar,EstadoVacioOpm}.tsx` | EDIT exclusivo | lectura hasta integración | lectura |
| `app/src/tutor/**` | lectura de contrato | NUEVO exclusivo | lectura |
| `app/src/ui/CommandPalette.tsx` | integración final exclusiva | lectura durante paralelo | lectura |
| tests E2E tutor | lectura | lectura | NUEVO exclusivo |
| reporte/auditoría | lectura | lectura | NUEVO exclusivo |

## Protocolo de conciliación

1. L1 fija schema y gateway de refinamiento.
2. L2 entrega archivos nuevos del registro/corpus sin tocar hubs compartidos.
3. La raíz integra L2 en `App.tsx`/`CommandPalette.tsx` una vez verde L1.
4. L3 evalúa cada resultado integrado; no edita producto y devuelve `INEVITABLE` o `NO TODAVÍA`.
5. Un `NO TODAVÍA` reabre el corte afectado; no se compensa con trabajo posterior.

## Anclaje obligatorio a contrato y SSOT

- Diseño aprobado: `docs/superpowers/specs/2026-07-21-tutor-contextual-opforja-design.md`.
- Reglas: `docs/canon-opm/reglas-opm-estrictas-es.md`.
- Método: `docs/canon-opm/metodologia-opm-es.md`.
- OPD: `docs/canon-opm/spec-forja-opd-es.md`.
- Manuales: `docs/manual-opforja.md`, `docs/manual-opm-puro.md`, `docs/manual-sistemas-opm.md`, `docs/manual-software-opm.md`, `docs/manual-sanitarios-opm.md`.
- Corpus de referencia revisado: `opm-extracted/README.md`, `opm-extracted/MODULES.md`, `opm-extracted/REFACTOR-NOTES.md`, `opm-extracted/INDEX.md` y `opm-extracted/assets/`.

No hay HU viva específica del tutor en el backlog histórico; el usuario prohibió inventarla. Por eso, el diseño aprobado y sus cortes son el contrato verificable de esta ronda.

## Briefs

| Línea | Brief |
| --- | --- |
| L1 | [Núcleo transaccional y ciclo](linea-1-nucleo-transaccional.md) |
| L2 | [Registro, corpus y cobertura](linea-2-registro-corpus.md) |
| L3 | [Verificación adversarial](linea-3-verificacion-adversarial.md) |

## Verificación de cierre

- Roundtrip/legacy/OPL invariance de metadatos.
- Un commit de modelo por gesto tutorizado y undo/redo íntegro.
- Gate de cobertura sin acciones semánticas vivas sin clasificar.
- Referencias resolubles y manifiesto reproducible.
- Teclado, foco, `aria-live`, 390×844 read-only, 640×800 editable y 1280×720 compacto.
- `bun run check`, `lint`, `build`, `design:governance`, smoke e in-situ verdes.
- Producción permanece en `b1502882`; no se ejecuta deploy.
