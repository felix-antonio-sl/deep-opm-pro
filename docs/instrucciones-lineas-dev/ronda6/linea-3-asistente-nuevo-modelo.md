# Linea 3 — Asistente nuevo modelo (12 etapas)

## 1. Mision

Implementar la ruta guiada de creacion de modelo descrita por la metodologia [Met §6]: un wizard secuencial con barra de progreso "Etapa N de 12", navegacion adelante/atras/cancelar, captura de funcion principal, beneficiario, atributo + estados, handler, nombre del sistema, herramientas, entrada, salida y ambientales; y al confirmar, siembra el SD con layout radial determinista mas OPL-ES pre-poblado y biblioteca alfabetica.

**Slice minimo entregable**: helper kernel `app/src/modelo/creacionWizard.ts` que recibe los datos de las 12 etapas y emite un `Modelo` sembrado con apariencias posicionadas radialmente; componente `app/src/ui/AsistenteNuevoModelo.tsx` con las 12 pantallas + navegacion + cancelacion confirmada; estado del wizard en `store.ts` con `iniciarAsistente`, `siguienteEtapa`, `etapaAnterior`, `cancelarAsistente`, `confirmarAsistente`; entrada "Nuevo modelo por asistente" en `MenuPrincipal.tsx`; tests unit + store + smoke.

**Fuera de slice**: HU-34.002/.003 (boton "+" en barra de pestanas y multi-pestana), persistencia remota o Firebase, AI generativa para sugerir entidades, plantillas pre-configuradas, edicion del SD desde el propio asistente, layout force-directed (queda determinista), customizacion del orden de etapas, integracion con seleccion previa del lienzo.

## 2. HU base

| HU | Path absoluto | Aporte |
|---|---|---|
| HU-34.010 | `/home/felix/projects/deep-opm-pro/docs/historias-usuario-v2/epicas/epica-34-persistencia-nuevo-modelo.md` | Activar "Nuevo Modelo por Asistente" desde menu principal. |
| HU-34.011 | idem | Modal con barra "Etapa N de 12". |
| HU-34.012 | idem | Etapa 0 Bienvenida. |
| HU-34.013 | idem | Etapa 1 Funcion principal (proceso central). |
| HU-34.014 | idem | Etapa 2 Beneficiario. |
| HU-34.015 | idem | Etapa 3 Atributo + estados entrada/salida. |
| HU-34.016 | idem | Etapa 4 Handler (coincide con beneficiario o agentes adicionales). |
| HU-34.017 | idem | Etapa 5 Nombre del sistema. |
| HU-34.018 | idem | Etapa 6 Herramientas (instrumentos). |
| HU-34.019 | idem | Etapa 7 Entrada principal (consumos). |
| HU-34.020 | idem | Etapa 8 Salida principal (resultado/efecto + verbo). |
| HU-34.021 | idem | Etapa 9 Objetos ambientales (checkbox por cosa ya ingresada). |
| HU-34.022 | idem | Navegar "Anterior" preservando datos. |
| HU-34.023 | idem | Cancelar con confirmacion si hay datos ingresados. |
| HU-34.024 | idem | Confirmar y sembrar SD radial. |
| HU-34.025 | idem | SD pre-poblado con layout radial "sol". |
| HU-34.026 | idem | OPL-ES pre-poblado con lineas numeradas (delegado al generador existente). |
| HU-34.027 | idem | Biblioteca con entradas alfabeticas tras asistente. |
| HU-34.028 | idem | Continuar modelando con estado "(No guardado)". |

## 3. Anclaje a evidencia

- **SSOT**: `metodologia-opm-es.md` §6 fija las 12 etapas y su orden; `opm-iso-19450-es.md` §nombres canonicos para SD; `opm-opl-es.md` plantillas D1-D4 y T1-T3 que se reutilizan al pre-poblar OPL.
- **Corpus interno reusable**:
  - `opm-extracted/MODULES.md` y `opm-extracted/INDEX.md` documentan `NewModelComponent` o equivalentes en `src/app/dialogs/new-model-wizard*` (verificar nombre exacto al revisar). Buscar `WizardComponent`, `StepperComponent`, formularios con FormBuilder, constructores de SD radial.
  - `opm-extracted/REFACTOR-NOTES.md` puede listar el algoritmo radial original.
  - `assets/svg/` contiene iconos (folder, regFile, etc.); el asistente puede reusar `assets/svg/folder.svg` para la entrada "biblioteca", pero no introducir iconos nuevos.
  - `docs/JOYAS.md` §1 y §3 fijan colores y tipografia para OPL pre-poblado.
- **Estado actual del codigo**:
  - `app/src/store.ts` ya tiene `crearModeloNuevo()` (de L2 ronda 5) que crea pestana con SD vacio y titulo "(No guardado)". El asistente debe consumirlo y luego mutar el modelo via `commitModelo` con la siembra radial.
  - `app/src/ui/MenuPrincipal.tsx` (103 LOC) ya tiene entradas Nuevo/Guardar como/Cargar. El asistente agrega una nueva accion "Nuevo modelo por asistente".
  - `app/src/modelo/operaciones.ts` (1743 LOC) ya tiene `crearObjeto`, `crearProceso`, `crearEnlace`, `crearEstado`. La siembra debe componer estos helpers; no agregar primitivas nuevas.
  - `app/src/modelo/layout.ts` puede contener helpers para posiciones; revisar antes de implementar layout radial.
  - `app/src/ui/Dialogo.tsx`, `app/src/ui/DialogoConfirmacion.tsx` y `app/src/ui/ConfirmacionContext.tsx` proveen modales reutilizables para el caso "Cancelar con datos ingresados".
  - `app/src/persistencia/workspace.ts` ya marca el modelo como "(No guardado)" cuando no esta persistido; el modelo sembrado por el asistente queda en ese estado (HU-34.028).

## 4. Archivos permitidos

```text
app/src/modelo/creacionWizard.ts             NUEVO
app/src/modelo/creacionWizard.test.ts        NUEVO
app/src/ui/AsistenteNuevoModelo.tsx          NUEVO
app/src/ui/MenuPrincipal.tsx                 EDIT aditivo
app/src/ui/App.tsx                           EDIT aditivo (montar modal cuando asistente activo)
app/src/store.ts                             EDIT aditivo
app/src/store.test.ts                        EDIT aditivo
app/src/modelo/tipos.ts                      EDIT aditivo opcional (`modelo.nombre?`, `modelo.descripcion?` si no existen)
app/src/modelo/layout.ts                     LECTURA o aditivo helper radial
app/src/serializacion/json.ts                EDIT aditivo si tipos cambian
app/src/serializacion/json.test.ts           EDIT aditivo si tipos cambian
app/src/opl/generar.ts                       LECTURA (delegar pre-poblacion al generador existente)
app/src/persistencia/local.ts                LECTURA (no persiste, queda dirty)
app/e2e/opm-smoke.spec.ts                    EDIT aditivo
docs/JOYAS.md                                LECTURA
opm-extracted/**                             LECTURA
/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es/** LECTURA
```

## 5. Restricciones de no-colision

- No tocar dialogos de archivo (`DialogoCargarModelo.tsx`, `DialogoGuardarComo.tsx`) — pertenecen a L4.
- No tocar `PanelOpl.tsx` ni `app/src/opl/` — pertenecen a L2; el asistente solo consume `generarOpl` indirectamente via render normal del store.
- No tocar `ArbolOpd.tsx` ni `MapaSistema.tsx` — pertenecen a L5.
- No tocar `InspectorEnlace.tsx`, `InspectorEntidad.tsx`, `StyleControls.tsx` ni `TablaEnlaces.tsx` — pertenecen a L6.
- No tocar el detector ni el ledger.
- No introducir librerias de wizard (formik, react-hook-form, etc.); usar `useState` + componentes propios. Validacion de nombres delega a helpers de operaciones existentes.
- No alterar `crearModeloNuevo` existente; el asistente lo invoca al confirmar y luego ejecuta una secuencia de operaciones aditivas para sembrar.
- No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`.

## 6. Slice minimo shippeable

### Modelo

Helper puro `app/src/modelo/creacionWizard.ts`:

```ts
export interface DatosAsistente {
  funcionPrincipal: string;                   // proceso central, no vacio
  beneficiario: string;                        // objeto beneficiario, no vacio
  atributo: { nombre: string; estadoEntrada: string; estadoSalida: string } | null;
  beneficiarioEsHandler: boolean;              // si true, no se crea agente adicional
  agentesAdicionales: string[];                // lista opcional
  nombreSistema: string;                       // no vacio (HU-34.017)
  herramientas: string[];                      // instrumentos, opcional
  entradas: string[];                          // consumos, opcional
  salidas: { nombre: string; verbo: "creates" | "affects" | "changes" }[]; // resultado/efecto, opcional
  ambientales: string[];                       // subset de cosas ya creadas, opcional
}

export function validarDatosAsistente(datos: Partial<DatosAsistente>, etapa: EtapaAsistente): Resultado<void>;
export function sembrarModeloDesdeAsistente(datos: DatosAsistente): Resultado<Modelo>;
```

`sembrarModeloDesdeAsistente`:
1. Crea `Modelo` nuevo via los helpers existentes (`crearModeloNuevo` interno o equivalente).
2. Crea proceso central (funcion principal) en el centro del SD.
3. Crea objeto beneficiario.
4. Si hay atributo: crea entidad atributo con dos estados (entrada/salida) y enlace exhibicion-caracteristica desde beneficiario.
5. Si beneficiario es handler: marca o conecta como agente; si no, crea agentes adicionales.
6. Asigna `modelo.nombre = datos.nombreSistema`.
7. Por cada herramienta: crea entidad objeto + enlace instrumento -> proceso.
8. Por cada entrada: crea entidad objeto + enlace consumo objeto -> proceso (segun verbo).
9. Por cada salida: crea entidad objeto + enlace resultado o efecto (segun verbo) proceso -> objeto.
10. Por cada ambiental: marca `entidad.afiliacion = "ambiental"` en la entidad referida.
11. Posiciona apariencias con layout radial determinista (proceso al centro; beneficiario arriba; agentes derecha; instrumentos izquierda; entradas arriba-izquierda; salidas abajo-derecha; ambientales periferia).
12. Devuelve `Modelo` sembrado, sin persistir.

### Operaciones

Sin operaciones nuevas en `operaciones.ts`. La siembra se compone llamando los helpers existentes.

### Store

Estado nuevo:

```ts
asistente: null | {
  etapaActual: EtapaAsistente;       // 0..11
  datos: Partial<DatosAsistente>;
  cancelado: boolean;
};
```

Acciones:

```ts
iniciarAsistente(): void;
siguienteEtapa(parcial: Partial<DatosAsistente>): void;
etapaAnterior(): void;
cancelarAsistente(): void;       // si hay datos, abre confirmacion via ConfirmacionContext
confirmarAsistente(): void;      // ejecuta sembrarModeloDesdeAsistente y commitModelo
```

`siguienteEtapa` debe persistir `parcial` en `datos`, validar (`validarDatosAsistente`), y avanzar etapa solo si es valido. Si no, dejar mensaje en estado UI.

### Serializacion

Si `modelo.nombre` o `modelo.descripcion` no existen ya como campos opcionales, agregarlos en `tipos.ts` con default `""` y hidratacion tolerante en `json.ts`. Si ya existen (de L2 ronda 5), reusarlos.

### Render

Sin cambios. Las apariencias creadas por la siembra se proyectan via `proyeccion.ts` normal.

### OPL

Sin cambios en el generador. Una vez sembrado el modelo, `generarOpl` emite las oraciones automaticas (HU-34.026).

### UX

Componente modal `AsistenteNuevoModelo.tsx`:

- Barra de progreso superior con "Etapa N de 12" (visualmente: 12 puntos o 12 segmentos).
- Cuerpo cambia segun `etapaActual`:
  - Etapa 0: Bienvenida con texto explicativo (es-CL) y "Siguiente".
  - Etapa 1: input "Funcion principal del sistema (proceso central)".
  - Etapa 2: input "Beneficiario".
  - Etapa 3: tres inputs "Atributo relevante", "Estado entrada", "Estado salida"; opcional (boton "Saltar").
  - Etapa 4: checkbox "El beneficiario es tambien handler" + input lista (linea por agente).
  - Etapa 5: input "Nombre del sistema".
  - Etapa 6: textarea o lista "Herramientas (instrumentos)"; opcional.
  - Etapa 7: textarea o lista "Entradas (consumos)"; opcional.
  - Etapa 8: lista de salidas con dropdown verbo (creates/affects/changes); opcional.
  - Etapa 9: lista checkbox de cosas ya creadas (excepto el proceso central) marcadas como ambientales; opcional.
  - Etapa 10: vista de resumen + boton "Confirmar y llevame al modelo".
  - Etapa 11 (post-confirm): asistente cerrado, modal desaparece, canvas muestra SD pre-poblado.
- Pie con botones "Anterior" (deshabilitado en etapa 0), "Siguiente" (Etapa 0..9) o "Saltar" (donde aplica), "Cancelar".
- Cancelar: si hay datos, abre `DialogoConfirmacion` "¿Descartar el asistente? Perderas los datos ingresados".
- Atajos: ESC = Cancelar; Enter = Siguiente cuando el campo principal es valido.

### Cross-capa

- Al confirmar: `confirmarAsistente` invoca `sembrarModeloDesdeAsistente`, `commitModelo`, marca el modelo como dirty y mantiene titulo "(No guardado)" segun L2 ronda 5.
- El SD activo despues del asistente es el SD recien sembrado; `opdActivoId` apunta a el.

## 7. Tests obligatorios

- Unit creacionWizard: `validarDatosAsistente` rechaza funcion principal vacia, beneficiario vacio, nombre del sistema vacio.
- Unit creacionWizard: `sembrarModeloDesdeAsistente` con dataset minimo (proceso, beneficiario, nombre) crea SD con un proceso central + un objeto beneficiario y emite OPL no vacia.
- Unit creacionWizard: dataset completo con 2 herramientas, 2 entradas, 2 salidas (con verbos distintos), 1 ambiental crea N entidades y N enlaces correctos; ambiental tiene `afiliacion = "ambiental"`.
- Unit layout: posiciones radiales son deterministas (mismo input -> mismas coordenadas) y no se solapan dentro de tolerancia minima.
- Store: `iniciarAsistente` setea etapa 0 con datos vacios.
- Store: `siguienteEtapa({funcionPrincipal: "Conducir"})` avanza a etapa 1 si datos validos; falla si `funcionPrincipal` vacio.
- Store: `etapaAnterior` preserva datos.
- Store: `cancelarAsistente` con datos abre confirmacion; sin datos cierra directo.
- Store: `confirmarAsistente` con dataset valido produce modelo nuevo, mantiene `(No guardado)`, deja stack undo con un solo entry.
- Component/UI: navegacion adelante/atras, validacion inline, contador "Etapa N de 12".
- Smoke: invocar asistente desde menu, completar flujo minimo (proceso + beneficiario + nombre), confirmar, verificar SD con 2 entidades visibles y OPL con >= 1 oracion.

## 8. Verificacion

```bash
cd app
bun run check
bun run browser:smoke
bun run build
```

## 9. Decisiones bloqueadas (no reabrir)

- 12 etapas: orden fijo segun [Met §6]; bienvenida cuenta como etapa 0 y vista pre-poblada como etapa 11.
- Etapas obligatorias: 0 (vista), 1 (funcion principal), 2 (beneficiario), 5 (nombre del sistema), 10 (confirmar).
- Etapas opcionales (con boton "Saltar"): 3 (atributo), 4 (handler adicional, default = beneficiario es handler), 6 (herramientas), 7 (entradas), 8 (salidas), 9 (ambientales).
- Layout radial es determinista; no se usa force-directed.
- El asistente no autopersiste; el modelo queda dirty y el usuario debe Guardar (HU-34.028, congruente con L2 ronda 5).
- No se introduce backend ni AI generativa.

## 10. Decisiones que tomas vos (documentar en commit)

- Algoritmo concreto del layout radial (radio, espaciado angular por categoria, escalado segun cantidad). Documentar formula.
- Si la barra de progreso muestra 12 segmentos clickeables (jump-to) o solo lineal con anterior/siguiente. Preferir lineal.
- Si el asistente bloquea pestanas/atajos globales mientras esta abierto. Preferir bloqueo via overlay.
- Como manejar nombres duplicados ingresados por el usuario en entradas/salidas/herramientas. Preferir suffix automatico ("Cosa", "Cosa 2") con feedback visual.
- Texto exacto de la etapa Bienvenida y de la cancelacion confirmada (es-CL, tono profesional, breve).
- Si el verbo "creates/affects/changes" se traduce al UI (es-CL: "crea / afecta / cambia") o se mantiene EN; preferir es-CL en UI con mapping interno.

## 11. Forma del entregable

Commits sugeridos:

- `feat(modelo): siembra modelos OPM desde datos del asistente con layout radial`
- `feat(ui): agrega asistente nuevo modelo de 12 etapas`
- `feat(store): cablea ciclo iniciar/siguiente/anterior/cancelar/confirmar del asistente`
- `test(asistente): cubre validaciones, navegacion y siembra`

Co-author footer estandar si aplica al implementador. No tocar `docs/HANDOFF.md` ni `docs/historias-usuario-v2/`. Reportar comandos ejecutados, tests agregados, decisiones tomadas, HU parcialmente cubiertas y bloqueos.
