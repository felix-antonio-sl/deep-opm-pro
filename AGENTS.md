# AGENTS.md

## Misión
Construir y mantener el modelador OPM/ISO 19450 de `app/`: un solo modelo, dos expresiones
(OPD y OPL) simétricas y persistencia fiable. Este repositorio no es fuente de modelos de dominio.

## Autoridad
1. `canon/` (4 documentos vendorizados; versiones en `canon/LEEME.md`) es la autoridad OPM local.
   Precedencia: reglas > spec-OPD / spec-OPL > metodología.
2. `docs/especificacion.md` deriva del canon (T-NNN, DR-n); `docs/decisiones.md` fija las
   decisiones del dueño y DS-n.
3. `docs/conformidad.md` declara todo DEBE no cumplido. La brecha silenciosa está prohibida.
No inventes reglas OPM locales. Si el canon no decide, aplica la válvula de simplicidad
(especificación §0.5) y regístrala.

## Arquitectura
- Código en `app/`. Dependencias: `nucleo → codec | opl | opd → editor → ui`; `servidor → codec`;
  `opl` y `opd` no se importan entre sí. `src/arquitectura.test.ts` lo hace cumplir.
- La validez de enlaces vive solo en `nucleo/matriz.ts`; cada oración OPL solo en
  `opl/plantillas.ts`; toda mutación es una operación de `nucleo/operaciones.ts` y pasa por
  `editor.ejecutar`. No dupliques reglas en la UI ni en el parser.
- Todo cambio semántico conserva el roundtrip estricto OPD↔OPL y el punto fijo del códec.
- Vocabulario de dominio del canon en español; identificadores ASCII.
- Prefiere el menor incremento vertical observable; no refactorices capas vecinas por conveniencia.

## Verificación
Desde `app/`: `bun run check`. Añade solo lo que corresponda: el escenario e2e afectado para
interacción; `bun run golden` y revisión visual de cada SVG cambiado para render; `bun run build`
para empaquetado; `bun test ../deploy` al tocar `deploy/`. No declares roundtrip ni fidelidad
visual sin observarlos. El título de cada prueba de un requisito empieza por su T-ID.

## Lista de cierre (reglas, Anexo A; R-ANEXO-CHECK-1)
Todo cambio de modelado, parser, generador OPL, import/export o render canónico se revisa contra:
- Identidad: cosa, estado, enlace y OPD con id persistente, nunca `SDx.y` ni nombre (codec, forma).
- Firma: familia, dirección y tipos de extremos; ningún procedimental objeto-objeto, estructural
  a estado (salvo especialización de estado) ni invocación a objeto (matriz).
- Estado: todo estado con objeto dueño; sin doble por defecto; `Current` nunca runtime (estados, forma).
- OPL: todo hecho nuclear visible emite plantilla canónica (generar, roundtrip-*).
- Parseo: toda oración aceptada reconstruye el mismo hecho; nunca entidades plausibles (analizar, editor-opl).
- Modificadores: `c/e` solo en entrada canónica; nunca en resultado, estructural, invocación ni mitad escindida (matriz).
- Refinamiento: el hijo agrega detalle y no contradice al padre; sin ciclos (refinamiento, proyeccion, frontera).
- Distribución: consumo/resultado no quedan en el contorno; TS3 escindido salvo con control o en abanico (refinamiento).
- Vistas: no hay vistas tipificadas en el producto (registro B-16).
- UI: handles, overlays, guías y validación separados del canon; sin grilla (exportar, golden, e2e 18–19).
- Export: `canon-diagrama`/`canon-documento` declarados; una captura nunca es evidencia (exportar).
- Deuda: toda zona no canonizada queda registrada.

## Registro de conformidad
Todo diff que agregue, quite o cambie una fila de `NO_OFRECIDO`, `NO_SOPORTADAS`,
`NO_CANONIZADAS` o `CATALOGO`, o el estado de un DEBE, actualiza `docs/conformidad.md` en el
mismo commit. Cada fila de esas tablas lleva su `registro: 'B-nn'`.

## Entrega
- Revisa el diff y conserva trabajo ajeno.
- Despliega solo con `./deploy/deploy.sh` y solo cuando la solicitud lo autorice.
- Documenta límites reales: una suite verde no equivale a validación humana del modelado.
- Trabajo material inconcluso: un único `HANDOFF.md` en la raíz, estable y sin fecha; elimínalo
  al cerrar. No crees `MEMORY.md`, continuidades fechadas ni archivos de sesión.
