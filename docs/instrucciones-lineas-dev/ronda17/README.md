# Ronda 17 — Beta2: simulacion conceptual + valores simples

**Fecha**: 2026-05-07  
**Supuesto base**: Beta1 cerrada por ronda 16 sobre al menos un dominio ancla real.  
**Objetivo**: cerrar **Beta2** con simulacion suficiente para razonar sobre un dominio real: modo simulacion, paso/corrida simple, estados/valores antes-despues y trazabilidad.

## 1. Filosofia operativa

- Beta2 no es runtime externo. Es simulacion conceptual y valores simples para pensar modelos OPM.
- Sin user functions, probabilidad avanzada, MQTT/HTTP/ROS ni backend.
- Reusar EPICA-17 value slots existentes y `validadores/valorSlot.ts` antes de crear un sistema nuevo de tipos.
- OPCloud se consulta para UX/controles y validacion de atributos, no se clona su motor.

## 2. Reglas duras comunes

- No tocar HU canonicas ni HANDOFF desde lineas.
- No modificar modelos ancla Beta1 salvo para agregar fixtures de simulacion derivados.
- Simulacion no persiste cambios como edicion del modelo salvo accion explicita "aplicar resultado", que queda fuera de Beta2 inicial.
- Modo simulacion bloquea edicion.
- Toda transicion debe ser explicable en un trace visible.

## 3. Vision general

| Linea | Titulo | HU/corte eje | Riesgo | Dominio nuevo |
|---|---|---|---|---|
| L1 | Kernel de simulacion conceptual | EPICA-B0 | Medio | `modelo/simulacion/*` |
| L2 | UI modo simulacion | EPICA-B0 | Medio | `ui/simulacion/*` |
| L3 | Valores simples y transiciones | EPICA-B1 subset | Medio | value slots + estados |
| L4 | Eval Beta2 sobre dominio ancla | Beta2 gate | Bajo | e2e/eval |

## 4. Mapa de archivos por linea

| Archivo | L1 | L2 | L3 | L4 |
|---|---|---|---|---|
| `app/src/modelo/simulacion/**` | NUEVO | lectura | EDIT | lectura |
| `app/src/store/simulacion*.ts` | NUEVO/EDIT | EDIT | EDIT | lectura |
| `app/src/ui/simulacion/**` | lectura | NUEVO | lectura | lectura |
| `app/src/modelo/validadores/valorSlot.ts` | lectura | — | EDIT aditivo | lectura |
| `app/src/render/jointjs/**` | lectura | EDIT minimo overlays | lectura | lectura |
| `app/e2e/12-beta2-*.spec.ts` | aditivo | aditivo | aditivo | NUEVO agregador |

## 5. Protocolo de conciliacion

Orden sugerido: **L1 -> L3 -> L2 -> L4 -> consolidacion operador**.

Rationale: el kernel define pasos puros; valores simples enriquecen el estado; UI consume ambos; L4 evalua el flujo completo.

## 6. Anclaje obligatorio

- Corte: `docs/roadmap/cortes-operativos.md` §7 Beta2.
- HU: `epica-b0-simulacion-conceptual.md` y subset de `epica-b1-simulacion-computacional.md`.
- OPCloud: `opm-extracted/src/app/dialogs/simulationElement/SimulationElement.ts`, `headlessRunner-dialog`, `models/modules/attribute-validation/*`.
- App: `app/src/modelo/validadores/valorSlot.ts`, EPICA-17 atributos, estados/designaciones.

## 7. Briefs

- [L1 Kernel de simulacion conceptual](linea-1-kernel-simulacion-conceptual.md)
- [L2 UI modo simulacion](linea-2-ui-modo-simulacion.md)
- [L3 Valores simples y transiciones](linea-3-valores-simples-transiciones.md)
- [L4 Eval Beta2 dominio ancla](linea-4-eval-beta2-dominio-ancla.md)

## 8. Gate Beta2

- Entrar/salir de modo simulacion.
- Ejecutar paso a paso y corrida simple determinista.
- Bloquear edicion durante ejecucion.
- Marcar proceso activo y estado actual.
- Cambiar valor/estado en memoria de simulacion con trace visible.
- Repetir sobre modelo ancla Beta1 sin editar JSON.

