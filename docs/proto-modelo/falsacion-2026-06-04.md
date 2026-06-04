# Falsación del normalizador del sub-dialecto del proto-modelo — HODOM (W1.3)

**Fecha:** 2026-06-04 · **Generado por:** `app/scripts/falsacion-proto-hodom.ts` (determinista).
**Corpus:** `/home/felix/projects/hd-opm/docs/modelo-opm-hodom-completo.md` — 52 bloques ```opl.
**Spec falsada:** `docs/proto-modelo/gramatica-subdialecto-v0.md` · **Árbitro de «estricto»:** `app/src/opl/parser/parsear.ts`.

> Reporte regenerable: `cd app && bun run scripts/falsacion-proto-hodom.ts`. No se edita a mano.

## 1. Conteo por clase

Total de líneas no vacías clasificadas: **472**.

| Clase | N | % |
|---|---:|---:|
| estricta | 232 | 49.2% |
| normalizada | 186 | 39.4% |
| compuesta | 26 | 5.5% |
| estructura | 11 | 2.3% |
| comentario | 12 | 2.5% |
| rechazada | 5 | 1.1% |

**Cobertura T1+T2+V+estructura** (estricta + normalizada + compuesta + estructura, sobre el total): **455/472 = 96.4%**.
**Cobertura sobre hechos** (excluyendo 12 comentarios): **455/460 = 98.9%**.

## 2. Reglas T2/V aplicadas (líneas `normalizada` + `compuesta`)

| Regla | N |
|---|---:|
| A1 — distribuir esencia/afiliación sobre lista | 13 |
| A2 — normalizar prefijo `en uno de los estados` | 45 |
| A3 — `afecta X (de a a b)` → `cambia X de a a b` | 2 |
| A4 — estado pegado → `en \`estado\`` | 29 |
| A6 — TS multi-destino → una por destino | 5 |
| A8 — conector `e`/`así como` → `y` | 6 |
| A9 — cola `como su operación` separada | 2 |
| AESS — esencia/afiliación sin `un objeto/proceso` | 84 |
| V1 — `habilita` (obj→proc) → instrumento-condición | 2 |
| V10 — `cumple` → tagged «cumple» + cola anotada | 1 |
| V11 — `habilita` (obj→obj) → tagged «habilita» | 1 |
| V12 — cola condicional / R4 → hecho + cola anotada | 6 |
| V13 — guard compuesto → evento + instrumento-condición | 1 |
| V14 — `cambia X a 'e', o inicia Q` → TS + evento (+XOR) | 1 |
| V15 — `inicia A o B` → ramas evento + abanico XOR | 2 |
| V2 — `restringe` (binario) → condición sobre estado complementario | 1 |
| V3 — `puede iniciar` → evento (ruta `inicia`) | 2 |
| V4 — `alimenta` → instrumento (`requiere`) | 2 |
| V5 — `detecta` → resultado (`genera`) | 1 |
| V6 — `compromete`/`libera` → afecta + verbo anotado | 2 |
| V7 — `precede a` → invocación | 2 |
| V8 — `puede suceder a` → tagged «sucede a» (+0..1) | 1 |
| V9 — `corresponde a` → tagged «corresponde a» | 1 |

## 3. Rechazos por categoría (R1–R7)

Total de líneas rechazadas: **5** (1.1% del corpus).

### R3 — verbo fuera del enum cerrado — 2 línea(s)

- `Inspección pre-ruta habilita Vehículo de transporte para 'en ruta'.`
- `Cupo HODOM proyecta la Capacidad de prestaciones comprometida como día-cama para REM.`

### R6 — cola informal en lista — 2 línea(s)

- `Evaluación clínica de elegibilidad, Informe social, Veredicto de voluntariedad y los demás veredictos parciales determinan Solicitud de ingreso HODOM como 'aceptada', 'en espera' o 'rechazada'.`
- `Equipo HODOM consta de Dirección Técnica, Coordinación, Médico de Atención Directa, Médico Regulador, Enfermero clínico, Kinesiólogo, Técnico de enfermería, Trabajador Social y Otros profesionales según prestaciones.`

### R7 — relación no primitiva — 1 línea(s)

- `Acceso del colaborador de cuidado a la información clínica está acotado por Deber de reserva.`

## 4. Segundo eje — aceptación real del parser (ley L1)

De **421** oraciones verificables por L1 (`estricta|normalizada` + emisiones-oración de `compuesta`; clase `estructura` y emisiones-directiva excluidas por L1), el parser real acepta **421** sin `unsupported-kernel` (= **100.0%**).

**Ley L1 verde:** toda salida estricta|normalizada parsea de verdad. Cero deuda GAP.

## 5. Divergencias spec-vs-realidad (hallazgos de la falsación)

La spec v0 fijó la regla, el parser fijó la realidad. Estos puntos divergen y la spec debe revisarse con esta evidencia:

1. **Especialización**: el corpus usa `A es un B` y el parser la acepta como **generalización** (kind `estructural`). La forma del canon `A puede ser B` NO funciona: el parser la lee como una declaración de **estados** (`B` como nombre de estado). El normalizador emite y conserva `es un/una B` — la forma realmente aceptada. **Veredicto: la spec debe declarar `es un/una` como la superficie estricta de especialización; `puede ser` es trampa para este parser.**
2. **Estados (A2 invertida)**: la spec A2 propone *agregar* el prefijo `en uno de los estados`. La realidad: el parser **mangla** ese prefijo (lo mete dentro del primer estado). La forma estricta real es **sin** prefijo: `X puede estar 'a' o 'b'`. El normalizador **stripea** el prefijo (no lo agrega). **Veredicto: invertir A2.**
3. **Esencia sin `un objeto/proceso` (AESS)**: la forma del corpus `X es físico/a y sistémico/a` (sin `un objeto`) NO es descripción para el parser: cae a `metadata` (falso positivo — no crea entidad). Fue la regla **más aplicada (83 líneas)**. El normalizador inyecta `un objeto`/`un proceso` infiriendo el tipo del contexto. **Veredicto: AESS es obligatoria; la spec la subestimó al meterla en A11 («aceptado tal cual»).**
4. **A7 (TS sin origen)**: la spec temía que `cambia X a 'b'` (sin origen) degradara a R5. La realidad: el parser **la acepta** (TS5 compacta). Cero R5 en el corpus. **Veredicto: A7 nunca degrada con este parser; eliminar la condicional de A7.**
5. **Degradación silenciosa (9 líneas)**: parsean sin `unsupported-kernel` (L1 verde) pero el AST absorbe info en el nombre — son **falsos positivos del parser**, no de la gramática:
   - multiplicidad sufija (`con multiplicidad N`) absorbida en el nombre del destino — 9 línea(s). Ej.: `Paciente exhibe Dispositivo invasivo con multiplicidad 0..N.`
   **Veredicto: deuda de PARSER** (multiplicidad canónica es prefijo `1..N **X**`, no sufijo `con multiplicidad`; el estado canónico va en backticks `\`e\``, no `estado 'e'`). El normalizador podría reescribir estas formas en una iteración futura; hoy las deja pasar porque el parser no las rechaza.

## 6. Veredicto del gate W1.3 (recomendación para el operador)

- **Cobertura sobre hechos:** 455/460 = 98.9% (estricta+normalizada+estructura).
- **Ley L1:** **verde** (100%).
- **Rechazos:** 5 (1.1%) — decisiones de modelado reales (guards compuestos, alternativas, verbos de dominio), no fallos del normalizador.

**Recomendación: PASA.** El normalizador cubre el 98.9% de los hechos del corpus real con L1 verde, idempotencia y trazabilidad por regla. Los rechazos están bien diagnosticados y devuelven el barro al humano (anti-complacencia). Antes de promover a KORA, la spec v0 debe absorber las 4 divergencias de la sección 5 (especialización=`es un`, A2 invertida, AESS obligatoria, A7 sin condicional) y abrir un GAP de parser por la degradación silenciosa de multiplicidad/estado.

