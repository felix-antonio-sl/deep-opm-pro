# Render headless del modelo (H1)

Herramienta para que un **consumidor agente** (p. ej. la skill `modelamiento-opm`
operando un repo de dominio como hd-opm) obtenga una imagen por OPD **con el mismo
layout que opforja produciría**, sin abrir la UI ni intervención humana. Le da
"ojos" al agente: la primera pasada visual la hace él mismo (caza regresiones de
layout antes de entregar) y la pasada del humano baja de auditoría a confirmación.

Implementa el pedido upstream **H1** (`hd-opm/docs/memorias-aprendizajes/solicitud-upstream-observabilidad-agente-2026-06-09.md`).

## Uso

```bash
cd app
bun run render:headless --proto  <ruta.md>   --out <dir>   # compila el proto y renderiza
bun run render:headless --modelo <ruta.json> --out <dir>   # modelo ya emitido: solo renderiza
```

Opciones:

| Flag | Efecto |
|---|---|
| `--fondo blanco\|transparente` | fondo del PNG (def. `blanco`) |
| `--solo-opd <opdId>` | renderiza un único OPD |
| `--port <n>` | puerto del Vite efímero (def. `5199`) |
| `--url <u>` | usar un dev server ya levantado **con** `VITE_HEADLESS_RENDER=true` en vez del efímero |

El comando es **autónomo**: levanta su propio Vite efímero con el flag, conduce
Chromium, escribe la salida y apaga todo. No requiere dev server previo.

## Salida (`<out>/`)

| Archivo | Contenido |
|---|---|
| `00-indice.json` | punto de entrada del agente: modelo, fuente, `procedenciaHash`, `resumen`, y la lista de OPDs (`orden`, `opdId`, `nombre`, `png`, `svg`) |
| `NN-slug.png` | imagen por OPD (orden BFS) — **el agente la abre con Read y la ve** |
| `NN-slug.svg` | vectorial por OPD — diff estable entre versiones |
| `opl.md` | OPL del modelo |
| `reporte.md` | reporte de validación |
| `avisos.json` | diagnóstico del modelo (señal para el loop; incluye advertencias de canon) |
| `ledger.json` | trazabilidad línea-de-proto → destino (solo `--proto`) |
| `procedencia.json` | sello `{protoHash, autoriaVersion, layoutVersion}` (solo `--proto`; semilla de H2) |
| `conteos.json` | conteos de entidades/estados/enlaces/OPDs |

Con `--proto`, las **advertencias de canon no abortan** el render (`emitirBundle`
con `lanzarEnError: false`): quedan en `avisos.json` y el agente igual ve el proto.
Solo un fallo estructural duro (round-trip/contención) escribe `error.txt` y termina
con exit `1`.

## Arquitectura

La frontera **compilar (puro) → renderizar (navegador)**:

1. **Compilar** (Node puro): `compilarProto` + `emitirBundle` producen el JSON del
   modelo con layout aplicado, más todo lo textual (OPL, ledger, avisos, conteos,
   procedencia). No toca el navegador.
2. **Renderizar** (Chromium): solo el JSON del modelo cruza al navegador. El hook
   `window.__opmRenderHeadless__` (montado solo bajo `VITE_HEADLESS_RENDER`)
   reusa la cadena de export del canvas (`proyectarModeloAJointCells` → embed →
   ruteo → ajuste de bbox) y devuelve SVG + PNG por OPD.

Si el render falla, el agente **igual** recibe el diagnóstico textual del paso 1.

## Fidelidad y límites

- **Fiel a opforja**: el render usa el motor de layout de **autoría**
  (`aplicarLayoutCompleto`), idéntico al que opforja muestra al importar un bundle
  emitido — **no** el `layoutSugerido` del canvas interactivo (dos motores, política
  W3.1). Espera `document.fonts.ready` para medir texto con las fuentes reales.
- **PNG vs SVG**: el PNG es rasterización (puede variar por versión de Chromium /
  antialiasing) → para **diff estable** usar SVG; para **ver**, PNG. La
  byte-identidad se verifica sobre el bundle JSON (eso es H2), nunca sobre el PNG.
- **Read-through**: la herramienta nunca escribe de vuelta al proto ni al dominio.
- **Superficie cero en prod**: el hook se monta solo bajo el flag; el build de
  producción lo elimina por DCE (verificado: ausente en `dist/`).
- **Cross-machine**: vive en `deep-opm-pro/app`; el consumidor lo invoca en la
  misma máquina. El empaquetado distribuible es un corte aparte.

## Verificación

```bash
bun run render:headless:smoke   # E2E: compila un proto mínimo, renderiza, valida <out>/ (pesado, ~30-60s)
```
