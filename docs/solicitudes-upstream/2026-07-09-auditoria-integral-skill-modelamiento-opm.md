# Auditoría integral de la skill `modelamiento-opm` → v1.13.0 — RESUELTA

**Fecha**: 2026-07-09 · **Estado**: RESUELTA (aplicada, verificada, cordón re-pineado)
**Método**: 3 sondas paralelas (doctrina SSOT · capacidades de la mesa · inventario de afirmaciones de la skill) + verificación de primera mano contra código (regla: grep + `file:line` antes de documentar). Pentamotor mente-omega (clase C3).

## Motivación

La mesa evolucionó más rápido que su skill: entre la v1.12.0 (2026-07-07) y esta auditoría se integraron y desplegaron las 4 líneas del programa mesa↔skill (2026-07-08). La skill seguía enseñando el mundo pre-CLI: humano como portapapeles (W6.0) e import manual por UI, cuando el norte declarado del programa es «que la skill y la mesa compartan estado sin que el humano transporte bytes».

## Hallazgos (jerarquizados)

### H1 — MAYOR: el CLI `mesa` no existía para la skill

Cero menciones de `mesa modelos|pull|push`, del token de agente, del carril por procedencia del push ni de la vitrina de revisión. Verificado contra `app/scripts/mesa-cli.ts`, `src/mesa/{contextoPull,validarPush,esSinDelta}.ts`, `package.json:31`.

### H2 — MEDIA: capacidades desplegadas ausentes de la tabla

Todo-nace-apunte (`nombreApunte.ts:8`), Taller en UI (banda «Taller» `ArbolOpd.tsx:334`, «+ OPD suelto» `:216`, «Adoptar»), gestor «Modelos» dos zonas con «Importar JSON» (`DialogoCargarModelo.tsx:226,339`), vitrina de revisión del agente («Sesión de agente · N revisiones» `DialogoVersiones.tsx:93`), versión visible en footer.

### H3 — MEDIA: fibras pre-doctrina bottom-up

Ninguna de las 9 referencias citaba versión SSOT (diseño aceptado: citan por URN+sección), pero `wizard-sd.md` no sabía que el SD-primero es ahora uno de dos arranques hermanos (metodología §A1.5) y `bundle-deep-opm-pro.md` no documentaba los 2 rechazos duros de import vigentes (`estereotipoId` irresoluble, `ordenInzoom` con ids no internos).

### H4 — MENOR: higiene documental y de runtime

(a) `§Scripts` decía «En v1.0.0 está vacío» siendo v1.12.0 (fósil de 12 iteraciones); `scripts/` no existe en la fuente pneuma. (b) `anti-patrones-opforja.md` se distribuía pero no estaba indexada en §Referencias. (c) El runtime claude-code arrastraba 2 directorios huérfanos (`recursos/`, `scripts/`) de la era pre-pneuma — el mismo residuo saneado en codex el 2026-06-30. (d) `ejemplo-minimo-sd.md` duplicado byte-idéntico en `recursos/`.

### H5 — Derivas internas de la SSOT (no de la skill)

(a) `metodologia-forja-opm-es.md`: la Bitácora del artefacto terminaba en v1.5.1 sin la fila v1.6.0 firmada el 2026-07-07 (la enmienda solo constaba en frontmatter/título). (b) `spec-forja-opd-es.md` Apéndice C: índice decía `R-OPD-REF-1..19` con `R-OPD-REF-20` ya vigente.

### Refutado (no se tocó)

La sonda SSOT acusó que la familia `R-COSA-*` no existía en `reglas-opm-estrictas-es`; verificación directa: `R-COSA-1/2/3` existen (líneas 162-164). La cita de la skill es correcta.

### Incidente colateral (reparado)

Durante la ronda de sondas, un `mv` accidental anidó `~/.claude/skills/modelamiento-opm/` dentro de `pensamiento-modelador/`, rompiendo ambas skills en el runtime. Reparado por restauración quirúrgica + verificación de byte-identidad contra la emisión. Lección: los agentes de sonda se despachan con mandato explícito de solo-lectura.

## Qué se cambió (v1.13.0, cambio menor aditivo)

1. **Nueva §Puente directo mesa↔skill (CLI `mesa`)** — camino primario de transporte: 3 verbos, config token, `pull` = contexto W6.0 (ley de determinismo del generador: un generador, dos consumidores) + encabezado `Especie`/`Fuente`; `push` = disciplina de escritura (5 reglas del veredicto + clausura sin-delta exit 4 + 409 re-pull exit 3 + versión `agente·<nota>`); vitrina como garantía de no-clobber. W6.0 copy/paste re-titulado como **fallback**.
2. **Regla Dura #29** (no-clobber del puente directo) + #26 extendida al pull.
3. **Triaje**: 2 rutas nuevas (pull / push). **Cuándo usar**: bullet del trabajo directo contra la mesa.
4. **Régimen apunte**: todo-nace-apunte (puerta «Nuevo», `Apunte AAAA-MM-DD`, graduación); **Régimen bosquejo**: realización en UI (Taller) + `--especie apunte` para bosquejos por el puente.
5. **Capacidades**: +4 filas (puente directo, especies/graduación/gestor, Taller UI, vitrina); actualizadas W6.0 (mismo generador) e instancia productiva (carril token, versión en footer). **Límites** re-fechados 2026-07-09 (T1-T4 intactos; matiz: agente/operador se serializan, no co-editan).
6. **Handoff/entregar**: push directo primario; manual = gestor «Modelos» → «Importar JSON». `serializar-bundle` paso 5 (entrega directa). `re-elicitar` acepta contexto vía pull.
7. **Fibras**: `wizard-sd.md` nota de arranques hermanos (A1.5); `bundle-deep-opm-pro.md` + 2 filas de rechazo de import.
8. **Higiene**: §Scripts retirada; `anti-patrones-opforja.md` indexada; huérfanos del runtime eliminados.
9. **SSOT (reparación mecánica de registro, no doctrina)**: fila v1.6.0 repuesta en la bitácora de metodología; índice `R-OPD-REF-1..20` en spec-opd.

## Qué NO se cambió, con porqué

- **Formato de intercambio**: ninguno nuevo — el pull ES el contexto W6.0 (la actualización enseña transporte, no re-especifica formato).
- **Estados del workflow**: ningún estado nuevo; el CLI es transporte de los existentes.
- **Fibra nueva para el CLI**: descartada — 3 verbos caben en SKILL.md; una fibra duplicaría.
- **Version-pin en fibras**: se mantiene el diseño URN+sección (el riesgo es de cobertura, no de versión; mitigado con esta pasada).
- **`R-COSA-*`**: cita correcta, refutación de sonda documentada arriba.

## Verificación

- `kora.py transmutar` → 3 targets re-emitidos y aplicados; **paridad 3/3 fiel**.
- `kora.py velar` → **12/12 coherente** (incluye las 2 reparaciones SSOT).
- Hash fuente `sha256:78b34228…` = sello en los 3 runtimes.
- Cordón deep-opm-pro re-pineado: `bun run cordon:skill` → **OK v1.13.0**; `bun run check` → **3128/0**.
- Rótulos de UI citados verificados contra código (`file:line` en H2).
