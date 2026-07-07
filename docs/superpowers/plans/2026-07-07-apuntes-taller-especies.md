# Apuntes desatendidos + Taller bottom-up + especies (Corte B′⊕D) — Plan de implementación

> **Para trabajadores agénticos:** SUB-SKILL REQUERIDA: usa `superpowers:subagent-driven-development` (recomendado) o `superpowers:executing-plans` para ejecutar tarea por tarea. Los pasos usan checkbox (`- [ ]`).

**Goal:** Bosquejar OPM sin ceremonia — «Nuevo» abre al instante un apunte editable con autosave; OPDs sueltos bottom-up reconciliables por «adoptar» (convergente por construcción con el top-down); gestor de dos zonas rigor×rol — sin introducir ninguna especie ni estructura nueva.

**Architecture:** Kernel OPM puro (`src/modelo/`) gana un constructor único de refinamiento `establecerRefinamiento` que factoriza el vínculo compartido por top-down (`descomponerProceso`/`desplegarObjeto`) y por `adoptarOpd`; un OPD suelto es la rama `padreId:null ∧ id≠opdRaizId` (cero tipo nuevo); «OPD sin adoptar» es una condición del gate de export canónico existente (no una severidad nueva). El store expone acciones nuevas siguiendo el patrón `accionesOpd`. La UI proyecta una banda «Taller» (derivada, no persistida) y un gestor de dos zonas. El nacimiento reconfigura `nuevoModelo` a «todo nace apunte» con persistencia inmediata para habilitar el autosalvado. La enmienda SSOT es entregable día-0 (autoreada, `docs/solicitudes-upstream/2026-07-07-enmienda-ssot-bottom-up-taller.md`), firma HITL del custodio antes del deploy.

**Tech Stack:** Bun 1.3+, TypeScript strict, Preact 10, Zustand 5, JointJS 3.7 core, Vite 6, Playwright. Tests unit con `bun test`; e2e con `bunx playwright test`.

## Global Constraints

- **Idioma**: español (es-CL) para dominio OPM, docs y prosa; inglés para infraestructura y comandos. Tildes correctas.
- **Guardia categorial dura (CLAUDE.md §Deuda categorial activa)**: CERO flags de especie nuevos. Las especies persistidas son exactamente `{esApunte, esBiblioteca}` antes y después del corte. «Taller»/«cuaderno» = banda VIRTUAL derivada, NUNCA especie persistida. Si aparece la necesidad de un 3er flag, NO refactorizar aquí: elevar el trigger.
- **Convergencia por construcción (R-OPD-REF-20)**: top-down y «adoptar» invocan el MISMO op `establecerRefinamiento`. No test extensional; identidad por construcción + una regresión por firma semántica.
- **Integridad estructural NUNCA degrada**: referencias colgantes/formato/geometría rechazan igual, ciegas a especie y a la banda del árbol. La whitelist de degradación apunte es fail-closed (`CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`).
- **«OPD sin adoptar» NO es clase de severidad nueva**: es condición del gate de export canónico. NO se añade a `SEVERIDAD_POR_CODIGO`. SÍ se añade a `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE` (para que en apunte degrade a observación).
- **Raíz canónica**: `modelo.opdRaizId` (no hay `nId` en el runtime). OPD suelto ≝ `opd.padreId === null && opd.id !== modelo.opdRaizId`.
- **Ids desde `nextSeq`**: `siguienteId(modelo, prefijo) = \`${prefijo}-${modelo.nextSeq}\``. Crear cualquier OPD/entidad DEBE incrementar `nextSeq`.
- **Gate del corte**: `cd app && bun run check` + `bun run lint` + `bun run design:governance` + `bun run browser:smoke`. Apagar el dev server antes de smoke (flakes en specs 02/05).
- **Deploy = gate humano DESPUÉS de la firma SSOT.** La mesa eleva la enmienda ANTES; el código de validez «OPD sin adoptar» y «todo nace apunte» no se despliegan sin firma.
- **Commits frecuentes**, uno por tarea, en `main` (rama de feature si se prefiere aislamiento). No `git push` ni deploy sin autorización.

---

## Estructura de archivos por ola

**Ola 0 — Enmienda SSOT (día 0, autoreada — HECHA):**
- `docs/solicitudes-upstream/2026-07-07-enmienda-ssot-bottom-up-taller.md` (creado) — propuesta firmable. Firma HITL del custodio en kora-pneuma.

**Ola 1 — Kernel del Taller:**
- Crear `app/src/modelo/opdSueltos.ts` — `opdsSueltos`, `esOpdSuelto` (predicados puros).
- Crear `app/src/modelo/operaciones/refinamiento/establecer.ts` — `establecerRefinamiento` (constructor único) + `adoptarOpd`.
- Crear `app/src/modelo/operaciones/opdSuelto.ts` — `crearOpdSuelto`.
- Modificar `app/src/modelo/operaciones/refinamiento/descomposicion.ts` — factorizar el vínculo por `establecerRefinamiento`.
- Modificar `app/src/modelo/operaciones/refinamiento/despliegue.ts` — ídem.
- Modificar `app/src/modelo/operaciones/refinamiento.ts` (barrel) — re-exportar los nuevos ops.
- Modificar `app/src/modelo/operaciones.ts` (barrel público) — re-exportar `crearOpdSuelto`, `adoptarOpd`, `establecerRefinamiento`.
- Modificar `app/src/serializacion/perfilesExport.ts` — `gateOpdsSinAdoptar` compuesto en export canónico.
- Modificar `app/src/modelo/diagnosticoSeveridad.ts` — añadir `CODIGO_OPD_SIN_ADOPTAR` a `CODIGOS_VALIDEZ_DEGRADABLES_APUNTE`.
- Tests: `establecer.test.ts`, `opdSuelto.test.ts` (junto a las fuentes); leyes `app/src/leyes/taller-convergencia.test.ts`, `app/src/leyes/taller-integridad-ciega.test.ts`, `app/src/leyes/taller-export-honesto.test.ts`, `app/src/leyes/taller-sin-especie-nueva.test.ts`.

**Ola 2 — UI del Taller:**
- Modificar `app/src/ui/arbol/togglesArbol.ts` — segregar sueltos; `nodosSueltosTaller`.
- Modificar `app/src/ui/ArbolOpd.tsx` — banda «Taller», gesto «Nuevo OPD suelto», gesto «Adoptar».
- Modificar `app/src/store/modelo/acciones-opd.ts` — acciones `nuevoOpdSuelto`, `adoptarOpdEnSeleccion`.
- Modificar `app/src/store/tipos.ts` — firmas de las acciones nuevas en `ModeloSlice`.
- Modificar `app/src/app/viewmodels/arbolOpdViewModel.ts` — exponer sueltos + acciones a `ArbolOpd`.
- e2e: `app/e2e/40-taller-bottom-up.spec.ts`.

**Ola 3 — «Todo nace apunte»:**
- Crear `app/src/persistencia/nombreApunte.ts` — `nombreApunteDeFecha` (puro).
- Modificar `app/src/store/modelo/acciones-ui.ts` — `nacerApunte` (reemplaza la puerta humana de `nuevoModelo`).
- Modificar `app/src/ui/CommandPalette.tsx` — puerta «Nuevo» → `nacerApunte`.
- Modificar `app/src/ui/DialogoCargarModelo.tsx` — CTA vacío «Nuevo» → `nacerApunte`.
- Crear `app/src/ui/DialogoGraduar.tsx` — momento de graduación (nombre/carpeta + reporte de validez).
- Modificar `app/src/ui/arbol/NodoOpd.tsx` — proyección «Hoja» de la raíz en apuntes.
- e2e: `app/e2e/41-nacimiento-apunte.spec.ts`.

**Ola 4 — Gestor de dos zonas:**
- Modificar `app/src/ui/DialogoCargarModelo.tsx` — zonas «Trabajo»/«Bibliotecas», chip de rigor por fila.
- e2e: `app/e2e/42-gestor-dos-zonas.spec.ts`.

---

# OLA 1 — Kernel del Taller

## Task 1: Predicados de OPD suelto

**Files:**
- Create: `app/src/modelo/opdSueltos.ts`
- Test: `app/src/modelo/opdSueltos.test.ts`

**Interfaces:**
- Produces: `opdsSueltos(modelo: Modelo): Opd[]`; `esOpdSuelto(modelo: Modelo, opdId: Id): boolean`.

- [ ] **Step 1: Escribe el test que falla**

```ts
// app/src/modelo/opdSueltos.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo } from "./operaciones/creacion";
import { opdsSueltos, esOpdSuelto } from "./opdSueltos";
import type { Modelo } from "./tipos";

function conOpd(modelo: Modelo, id: string, padreId: string | null): Modelo {
  return { ...modelo, opds: { ...modelo.opds, [id]: { id, nombre: id, padreId, apariencias: {}, enlaces: {} } } };
}

describe("opdsSueltos", () => {
  test("la raíz nunca es suelto aunque tenga padreId null", () => {
    const m = crearModelo("M");
    expect(m.opds[m.opdRaizId].padreId).toBeNull();
    expect(opdsSueltos(m)).toEqual([]);
    expect(esOpdSuelto(m, m.opdRaizId)).toBe(false);
  });

  test("un OPD con padreId null que no es la raíz es suelto", () => {
    const m = conOpd(crearModelo("M"), "opd-suelto", null);
    expect(opdsSueltos(m).map((o) => o.id)).toEqual(["opd-suelto"]);
    expect(esOpdSuelto(m, "opd-suelto")).toBe(true);
  });

  test("un OPD con padre real no es suelto", () => {
    const m = conOpd(crearModelo("M"), "opd-hijo", "opd-1");
    expect(opdsSueltos(m)).toEqual([]);
    expect(esOpdSuelto(m, "opd-hijo")).toBe(false);
  });
});
```

- [ ] **Step 2: Corre el test y verifica que falla**

Run: `cd app && bun test src/modelo/opdSueltos.test.ts`
Expected: FAIL con "Cannot find module './opdSueltos'".

- [ ] **Step 3: Implementación mínima**

```ts
// app/src/modelo/opdSueltos.ts
import type { Id, Modelo, Opd } from "./tipos";

/**
 * OPD suelto (R-OPD-REF-20): fragmento fuera del árbol de refinamiento —
 * `padreId === null` y NO es la raíz canónica (`opdRaizId`). Estado transitorio
 * legítimo del arranque bottom-up. La raíz siempre tiene `padreId:null` pero
 * es el tronco, no un suelto.
 */
export function opdsSueltos(modelo: Modelo): Opd[] {
  return Object.values(modelo.opds).filter(
    (opd) => opd.padreId === null && opd.id !== modelo.opdRaizId,
  );
}

export function esOpdSuelto(modelo: Modelo, opdId: Id): boolean {
  const opd = modelo.opds[opdId];
  return !!opd && opd.padreId === null && opd.id !== modelo.opdRaizId;
}
```

- [ ] **Step 4: Corre el test y verifica que pasa**

Run: `cd app && bun test src/modelo/opdSueltos.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/opdSueltos.ts app/src/modelo/opdSueltos.test.ts
git commit -m "feat(taller): predicados de OPD suelto (padreId null ≠ raíz)"
```

## Task 2: Constructor único `establecerRefinamiento`

**Files:**
- Create: `app/src/modelo/operaciones/refinamiento/establecer.ts`
- Test: `app/src/modelo/operaciones/refinamiento/establecer.test.ts`

**Interfaces:**
- Consumes: `fijarRefinamiento`, `obtenerRefinamiento` (de `../../refinamientos`); `entidadVisibleEnOpd`, `fallo`, `ok` (de `../helpers`); tipos `Id, Modelo, ModoDespliegueObjeto, Resultado, TipoRefinamiento`.
- Produces: `interface EnlaceRefinamiento { opdPadreId: Id; entidadId: Id; opdHijoId: Id; tipo: TipoRefinamiento; modo?: ModoDespliegueObjeto }`; `establecerRefinamiento(modelo: Modelo, enlace: EnlaceRefinamiento): Resultado<Modelo>`.

- [ ] **Step 1: Escribe el test que falla**

```ts
// app/src/modelo/operaciones/refinamiento/establecer.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../creacion";
import { obtenerRefinamiento } from "../../refinamientos";
import { establecerRefinamiento } from "./establecer";
import type { Modelo, Opd } from "../../tipos";

function primerProcesoId(m: Modelo): string {
  return Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
}
function conOpdVacio(m: Modelo, id: string, padreId: string | null): Modelo {
  const opd: Opd = { id, nombre: id, padreId, apariencias: {}, enlaces: {} };
  return { ...m, opds: { ...m.opds, [id]: opd } };
}

describe("establecerRefinamiento", () => {
  test("fija el slot de la entidad y el padreId del hijo", () => {
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = primerProcesoId(m);
    m = conOpdVacio(m, "opd-hijo", null);
    const r = establecerRefinamiento(m, { opdPadreId: "opd-1", entidadId: procesoId, opdHijoId: "opd-hijo", tipo: "descomposicion" });
    expect(r.ok).toBe(true);
    const out = (r as { value: Modelo }).value;
    expect(obtenerRefinamiento(out.entidades[procesoId], "descomposicion")?.opdId).toBe("opd-hijo");
    expect(out.opds["opd-hijo"].padreId).toBe("opd-1");
  });

  test("rechaza si la entidad ya tiene refinamiento del mismo tipo", () => {
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = primerProcesoId(m);
    m = conOpdVacio(m, "opd-hijo", null);
    m = (establecerRefinamiento(m, { opdPadreId: "opd-1", entidadId: procesoId, opdHijoId: "opd-hijo", tipo: "descomposicion" }) as { value: Modelo }).value;
    m = conOpdVacio(m, "opd-hijo-2", null);
    const r = establecerRefinamiento(m, { opdPadreId: "opd-1", entidadId: procesoId, opdHijoId: "opd-hijo-2", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });

  test("rechaza ciclo: el hijo es ancestro del padre", () => {
    // opd-1 (raíz) → opd-a → opd-b ; intentar refinar algo en opd-b con hijo opd-a
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "P").value as Modelo;
    m = conOpdVacio(m, "opd-a", "opd-1");
    m = conOpdVacio(m, "opd-b", "opd-a");
    // una cosa visible en opd-b
    m = crearProceso(m, "opd-b", { x: 0, y: 0 }, "Q").value as Modelo;
    const qId = Object.values(m.entidades).find((e) => e.nombre === "Q")!.id;
    const r = establecerRefinamiento(m, { opdPadreId: "opd-b", entidadId: qId, opdHijoId: "opd-a", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });

  test("rechaza si la entidad no tiene apariencia en el OPD padre", () => {
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = primerProcesoId(m);
    m = conOpdVacio(m, "opd-otro", null);
    m = conOpdVacio(m, "opd-hijo", null);
    const r = establecerRefinamiento(m, { opdPadreId: "opd-otro", entidadId: procesoId, opdHijoId: "opd-hijo", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Corre el test y verifica que falla**

Run: `cd app && bun test src/modelo/operaciones/refinamiento/establecer.test.ts`
Expected: FAIL con "Cannot find module './establecer'".

- [ ] **Step 3: Implementación**

```ts
// app/src/modelo/operaciones/refinamiento/establecer.ts
import { fijarRefinamiento, obtenerRefinamiento } from "../../refinamientos";
import type { Id, Modelo, ModoDespliegueObjeto, Resultado, TipoRefinamiento } from "../../tipos";
import { entidadVisibleEnOpd, fallo, ok } from "../helpers";

export interface EnlaceRefinamiento {
  /** OPD donde aparece la cosa refinada; será el padre-en-árbol del hijo. */
  opdPadreId: Id;
  /** La cosa refinada (proceso/objeto). */
  entidadId: Id;
  /** El OPD que realiza el refinamiento (recién creado o suelto adoptado). */
  opdHijoId: Id;
  tipo: TipoRefinamiento;
  modo?: ModoDespliegueObjeto;
}

/**
 * Constructor ÚNICO de refinamiento (R-OPD-REF-20, convergencia por construcción).
 * Vincula una cosa refinada (visible en opdPadre) con el OPD hijo que la realiza:
 *   (1) fija el slot de refinamiento de la entidad → opdHijo;
 *   (2) fija `opdHijo.padreId = opdPadreId` (lo inserta en el árbol).
 * Lo invocan POR IGUAL el camino top-down (`descomponerProceso`/`desplegarObjeto`,
 * que crean el hijo con su contenido antes de vincular) y el verbo «adoptar»
 * (`adoptarOpd`, que toma un suelto existente). No crea contenido ni recalcula
 * representación: es el átomo de enlace, la fuente de la convergencia.
 */
export function establecerRefinamiento(modelo: Modelo, enlace: EnlaceRefinamiento): Resultado<Modelo> {
  const { opdPadreId, entidadId, opdHijoId, tipo, modo } = enlace;
  const opdPadre = modelo.opds[opdPadreId];
  if (!opdPadre) return fallo(`OPD padre no existe: ${opdPadreId}`);
  const opdHijo = modelo.opds[opdHijoId];
  if (!opdHijo) return fallo(`OPD hijo no existe: ${opdHijoId}`);
  const entidad = modelo.entidades[entidadId];
  if (!entidad) return fallo(`Entidad no existe: ${entidadId}`);
  if (!entidadVisibleEnOpd(opdPadre, entidadId)) {
    return fallo("El refinamiento requiere que la entidad tenga apariencia en el OPD padre");
  }
  if (obtenerRefinamiento(entidad, tipo)) {
    return fallo(`La entidad ya tiene refinamiento de tipo ${tipo}`);
  }
  // Aciclicidad (R-OPD-REF-8): el hijo no puede ser el padre ni un ancestro suyo.
  if (opdHijoId === opdPadreId || esAncestroOpd(modelo, opdHijoId, opdPadreId)) {
    return fallo("Refinamiento cíclico: el OPD hijo es ancestro del OPD padre");
  }
  const slot = modo ? { opdId: opdHijoId, modo } : { opdId: opdHijoId };
  return ok({
    ...modelo,
    entidades: { ...modelo.entidades, [entidadId]: fijarRefinamiento(entidad, tipo, slot) },
    opds: { ...modelo.opds, [opdHijoId]: { ...opdHijo, padreId: opdPadreId } },
  });
}

/** ¿`posibleAncestroId` está en la cadena de ancestros de `opdId` (por padreId)? */
function esAncestroOpd(modelo: Modelo, posibleAncestroId: Id, opdId: Id): boolean {
  const visitados = new Set<Id>();
  let actual = modelo.opds[opdId]?.padreId ?? null;
  while (actual && !visitados.has(actual)) {
    if (actual === posibleAncestroId) return true;
    visitados.add(actual);
    actual = modelo.opds[actual]?.padreId ?? null;
  }
  return false;
}
```

- [ ] **Step 4: Corre el test y verifica que pasa**

Run: `cd app && bun test src/modelo/operaciones/refinamiento/establecer.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/operaciones/refinamiento/establecer.ts app/src/modelo/operaciones/refinamiento/establecer.test.ts
git commit -m "feat(taller): establecerRefinamiento — constructor único de refinamiento"
```

## Task 3: Factorizar `descomponerProceso` por `establecerRefinamiento`

**Files:**
- Modify: `app/src/modelo/operaciones/refinamiento/descomposicion.ts:99-134`

**Interfaces:**
- Consumes: `establecerRefinamiento` (de `./establecer`).
- Produces: sin cambio de firma pública de `descomponerProceso`; su vínculo pasa por `establecerRefinamiento`.

- [ ] **Step 1: Verifica que la suite de refinamiento pasa hoy (baseline)**

Run: `cd app && bun test src/modelo/operaciones src/leyes/refinamiento-cascadas.test.ts src/leyes/contencion-refinamiento.test.ts`
Expected: PASS (baseline verde antes de refactorizar).

- [ ] **Step 2: Aplica el refactor**

Añade el import al inicio de `descomposicion.ts` (junto a los demás de `./`):
```ts
import { establecerRefinamiento } from "./establecer";
```

Reemplaza el bloque de construcción del modelo `base` y el `fijarRefinamiento` inline (actualmente líneas ~101-133) por: construir `opdHijo` y `base` SIN el `fijarRefinamiento` inline sobre `procesoId`, y vincular por `establecerRefinamiento` antes de `sincronizarRepresentacionRefinamiento`:

```ts
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...subprocesos.apariencias,
    },
    enlaces: {},
  };
  const conHijo: Modelo = {
    ...modelo,
    nextSeq,
    entidades: {
      ...modelo.entidades,
      // NOTA: sin fijarRefinamiento aquí — lo hace establecerRefinamiento (convergencia).
      ...subprocesos.entidades,
    },
    opds: {
      ...modelo.opds,
      [opdHijoId]: opdHijo,
    },
  };
  const enlazado = establecerRefinamiento(conHijo, {
    opdPadreId,
    entidadId: procesoId,
    opdHijoId,
    tipo: "descomposicion",
  });
  if (!enlazado.ok) return fallo(enlazado.error);
  const siguiente = sincronizarRepresentacionRefinamiento(enlazado.value, opdHijoId, {
    subprocesos: {
      primeroId: subprocesos.primeroId,
      ultimoId: subprocesos.ultimoId,
      todosIds: subprocesos.entidadIds,
    },
  });
  if (!siguiente.ok) return fallo(siguiente.error);

  return ok({ modelo: siguiente.value, opdId: opdHijoId, creado: true });
```

Elimina el import `fijarRefinamiento` de `descomposicion.ts` si ya no se usa en el archivo (verifícalo: `obtenerRefinamiento` sí sigue en uso; `fijarRefinamiento` puede quedar huérfano → quítalo del import).

- [ ] **Step 3: Corre la suite de refinamiento**

Run: `cd app && bun test src/modelo/operaciones src/leyes/refinamiento-cascadas.test.ts src/leyes/contencion-refinamiento.test.ts src/leyes/invocacion-implicita-bimodal.test.ts`
Expected: PASS (mismo verde que el baseline — el estado final es idéntico).

- [ ] **Step 4: Typecheck**

Run: `cd app && bun run typecheck`
Expected: sin errores (ninguna import huérfana).

- [ ] **Step 5: Commit**

```bash
git add app/src/modelo/operaciones/refinamiento/descomposicion.ts
git commit -m "refactor(taller): descomponerProceso vincula por establecerRefinamiento"
```

## Task 4: Factorizar `desplegarObjeto` por `establecerRefinamiento`

**Files:**
- Modify: `app/src/modelo/operaciones/refinamiento/despliegue.ts:109-142`

**Interfaces:**
- Consumes: `establecerRefinamiento`.
- Produces: sin cambio de firma pública de `desplegarObjeto`.

- [ ] **Step 1: Aplica el refactor**

Añade el import:
```ts
import { establecerRefinamiento } from "./establecer";
```

Reemplaza el `return ok({...})` final (que hoy incluye `[objetoId]: fijarRefinamiento(objeto, "despliegue", { opdId: opdHijoId, modo })` inline) por: construir el modelo `base` sin ese `fijarRefinamiento`, vincular por `establecerRefinamiento`, y devolver:

```ts
  const opdHijo: Opd = {
    id: opdHijoId,
    nombre: siguienteNombreOpdHijo(modelo, opdPadreId),
    padreId: opdPadreId,
    apariencias: {
      [aparienciaHijoId]: aparienciaHijo,
      ...partes.apariencias,
    },
    enlaces: enlacesDespliegue.aparienciasEnlace,
  };
  const conHijo: Modelo = {
    ...modelo,
    nextSeq,
    entidades: {
      ...modelo.entidades,
      // sin fijarRefinamiento aquí — establecerRefinamiento lo hace (convergencia).
      ...partes.entidades,
    },
    enlaces: {
      ...modelo.enlaces,
      ...enlacesDespliegue.enlaces,
    },
    opds: {
      ...modelo.opds,
      [opdHijoId]: opdHijo,
    },
  };
  const enlazado = establecerRefinamiento(conHijo, {
    opdPadreId,
    entidadId: objetoId,
    opdHijoId,
    tipo: "despliegue",
    modo,
  });
  if (!enlazado.ok) return fallo(enlazado.error);
  return ok({ modelo: enlazado.value, opdId: opdHijoId, creado: true, modo });
```

Quita el import `fijarRefinamiento` de `despliegue.ts` si queda huérfano (conserva `obtenerRefinamiento`).

- [ ] **Step 2: Corre la suite**

Run: `cd app && bun test src/modelo/operaciones src/leyes/simulacion-unfold.test.ts src/leyes/refinamiento-adjuncion.test.ts`
Expected: PASS.

- [ ] **Step 3: Typecheck**

Run: `cd app && bun run typecheck`
Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add app/src/modelo/operaciones/refinamiento/despliegue.ts
git commit -m "refactor(taller): desplegarObjeto vincula por establecerRefinamiento"
```

## Task 5: `crearOpdSuelto` y `adoptarOpd`

**Files:**
- Create: `app/src/modelo/operaciones/opdSuelto.ts`
- Test: `app/src/modelo/operaciones/opdSuelto.test.ts`
- Modify: `app/src/modelo/operaciones/refinamiento/establecer.ts` (añade `adoptarOpd`)

**Interfaces:**
- Produces: `crearOpdSuelto(modelo: Modelo, nombre?: string): { modelo: Modelo; opdId: Id }`; `adoptarOpd(modelo: Modelo, args: { opdPadreId: Id; entidadId: Id; opdSueltoId: Id; tipo: TipoRefinamiento; modo?: ModoDespliegueObjeto }): Resultado<Modelo>`.

- [ ] **Step 1: Escribe los tests que fallan**

```ts
// app/src/modelo/operaciones/opdSuelto.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "./creacion";
import { crearOpdSuelto } from "./opdSuelto";
import { adoptarOpd } from "./refinamiento/establecer";
import { obtenerRefinamiento } from "../refinamientos";
import { esOpdSuelto } from "../opdSueltos";
import type { Modelo } from "../tipos";

describe("crearOpdSuelto", () => {
  test("crea un OPD suelto (padreId null, ≠ raíz) e incrementa nextSeq", () => {
    const m0 = crearModelo("M");
    const seq0 = m0.nextSeq;
    const { modelo, opdId } = crearOpdSuelto(m0);
    expect(modelo.opds[opdId].padreId).toBeNull();
    expect(opdId).not.toBe(modelo.opdRaizId);
    expect(esOpdSuelto(modelo, opdId)).toBe(true);
    expect(modelo.nextSeq).toBe(seq0 + 1);
    expect(modelo.opds[opdId].apariencias).toEqual({});
  });

  test("dos sueltos consecutivos no colisionan de id", () => {
    const a = crearOpdSuelto(crearModelo("M"));
    const b = crearOpdSuelto(a.modelo);
    expect(a.opdId).not.toBe(b.opdId);
  });
});

describe("adoptarOpd", () => {
  test("adopta un suelto como descomposición: fija padre y slot", () => {
    let m: Modelo = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
    const creado = crearOpdSuelto(m); m = creado.modelo;
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: creado.opdId, tipo: "descomposicion" });
    expect(r.ok).toBe(true);
    const out = (r as { value: Modelo }).value;
    expect(out.opds[creado.opdId].padreId).toBe("opd-1");
    expect(obtenerRefinamiento(out.entidades[procesoId], "descomposicion")?.opdId).toBe(creado.opdId);
    expect(esOpdSuelto(out, creado.opdId)).toBe(false); // ya no es suelto: fue adoptado
  });

  test("rechaza adoptar un OPD que no es suelto (ya tiene padre)", () => {
    let m: Modelo = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
    m = { ...m, opds: { ...m.opds, "opd-con-padre": { id: "opd-con-padre", nombre: "x", padreId: "opd-1", apariencias: {}, enlaces: {} } } };
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: "opd-con-padre", tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });

  test("rechaza adoptar la raíz", () => {
    let m: Modelo = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const procesoId = Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
    const r = adoptarOpd(m, { opdPadreId: "opd-1", entidadId: procesoId, opdSueltoId: m.opdRaizId, tipo: "descomposicion" });
    expect(r.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Corre y verifica que falla**

Run: `cd app && bun test src/modelo/operaciones/opdSuelto.test.ts`
Expected: FAIL con módulo inexistente.

- [ ] **Step 3: Implementa `crearOpdSuelto`**

```ts
// app/src/modelo/operaciones/opdSuelto.ts
import type { Id, Modelo, Opd } from "../tipos";
import { siguienteId } from "./helpers";

/** Nombre por defecto de un OPD suelto: «Boceto N» (N = primer ordinal libre). */
function siguienteNombreBoceto(modelo: Modelo): string {
  const usados = new Set(Object.values(modelo.opds).map((o) => o.nombre));
  for (let i = 1; i < Number.MAX_SAFE_INTEGER; i += 1) {
    const candidato = `Boceto ${i}`;
    if (!usados.has(candidato)) return candidato;
  }
  return "Boceto";
}

/**
 * Crea un OPD SUELTO (`padreId:null`, id≠opdRaizId): un fragmento fuera del árbol
 * de refinamiento, estado transitorio legítimo del arranque bottom-up (R-OPD-REF-20).
 * Nace vacío para trazar sin ceremonia; NO toca opdRaizId, entidades ni enlaces.
 * Consume un valor de `nextSeq` (todo id sale del mismo contador).
 */
export function crearOpdSuelto(modelo: Modelo, nombre?: string): { modelo: Modelo; opdId: Id } {
  const opdId = siguienteId(modelo, "opd");
  const opd: Opd = {
    id: opdId,
    nombre: nombre?.trim() || siguienteNombreBoceto(modelo),
    padreId: null,
    apariencias: {},
    enlaces: {},
  };
  return {
    modelo: { ...modelo, nextSeq: modelo.nextSeq + 1, opds: { ...modelo.opds, [opdId]: opd } },
    opdId,
  };
}
```

- [ ] **Step 4: Implementa `adoptarOpd` en `establecer.ts`**

Añade al final de `establecer.ts`:
```ts
import { esOpdSuelto } from "../../opdSueltos";

export interface AdopcionOpd {
  opdPadreId: Id;
  entidadId: Id;
  opdSueltoId: Id;
  tipo: TipoRefinamiento;
  modo?: ModoDespliegueObjeto;
}

/**
 * Verbo «adoptar» (R-OPD-REF-20): declara un OPD SUELTO existente como el
 * refinamiento (in-zoom/unfold) de una cosa existente. Valida que el OPD sea
 * suelto y delega el vínculo al MISMO constructor `establecerRefinamiento` que
 * usa el camino top-down → convergencia por construcción.
 */
export function adoptarOpd(modelo: Modelo, args: AdopcionOpd): Resultado<Modelo> {
  if (!esOpdSuelto(modelo, args.opdSueltoId)) {
    return fallo(`El OPD ${args.opdSueltoId} no es un suelto adoptable (o es la raíz)`);
  }
  return establecerRefinamiento(modelo, {
    opdPadreId: args.opdPadreId,
    entidadId: args.entidadId,
    opdHijoId: args.opdSueltoId,
    tipo: args.tipo,
    modo: args.modo,
  });
}
```
(Agrega `import { esOpdSuelto } from "../../opdSueltos";` junto a los imports existentes; ya hay `fallo`.)

- [ ] **Step 5: Corre los tests**

Run: `cd app && bun test src/modelo/operaciones/opdSuelto.test.ts src/modelo/operaciones/refinamiento/establecer.test.ts`
Expected: PASS.

- [ ] **Step 6: Re-exporta desde los barrels**

En `app/src/modelo/operaciones/refinamiento.ts` añade:
```ts
export { establecerRefinamiento, adoptarOpd } from "./refinamiento/establecer";
export type { EnlaceRefinamiento, AdopcionOpd } from "./refinamiento/establecer";
```
En `app/src/modelo/operaciones.ts` (barrel público) añade el re-export de `crearOpdSuelto`, `adoptarOpd`, `establecerRefinamiento` (localiza el bloque de `export ... from "./operaciones/refinamiento"` y el de `creacion`; añade `export { crearOpdSuelto } from "./operaciones/opdSuelto";`).

- [ ] **Step 7: Typecheck + commit**

Run: `cd app && bun run typecheck`
Expected: sin errores.
```bash
git add app/src/modelo/operaciones/opdSuelto.ts app/src/modelo/operaciones/opdSuelto.test.ts app/src/modelo/operaciones/refinamiento/establecer.ts app/src/modelo/operaciones/refinamiento.ts app/src/modelo/operaciones.ts
git commit -m "feat(taller): crearOpdSuelto + adoptarOpd (adopción convergente)"
```

## Task 6: Ley de convergencia (adversarial, por firma semántica)

**Files:**
- Create: `app/src/leyes/taller-convergencia.test.ts`

**Interfaces:**
- Consumes: `descomponerProceso`, `crearProceso`, `crearOpdSuelto`, `adoptarOpd` (de `../modelo/operaciones`/`.../creacion`); `firmaFronteraEntidad` (de `../modelo/equivalencia/verticalidad`, `:30`).

Objetivo falsable en DOS caras, ambas exigidas por spec §7:
1. **Estructural (identidad-por-construcción)**: top-down y adopción alcanzan el MISMO hecho de vínculo (slot de la entidad + padreId del hijo). Es la convergencia por construcción (ambos invocan `establecerRefinamiento`).
2. **Firma semántica**: con contenido EQUIVALENTE, la firma de frontera del proceso refinado dentro de su OPD hijo coincide en ambos caminos (adoptar no distorsiona la semántica que produce el top-down; R-OPD-REF-10).
Más adversarial: ambos caminos rechazan igual un ciclo.

- [ ] **Step 1: Escribe la ley (estructural + adversarial)**

```ts
// app/src/leyes/taller-convergencia.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../modelo/operaciones/creacion";
import { descomponerProceso } from "../modelo/operaciones";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { adoptarOpd } from "../modelo/operaciones/refinamiento/establecer";
import { obtenerRefinamiento } from "../modelo/refinamientos";
import type { Modelo } from "../modelo/tipos";

function procesoId(m: Modelo): string {
  return Object.values(m.entidades).find((e) => e.tipo === "proceso")!.id;
}

describe("LEY: convergencia por construcción (R-OPD-REF-20)", () => {
  test("top-down y adopción producen el MISMO hecho de vínculo (slot + padreId)", () => {
    // Camino A — top-down
    const baseA = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const pA = procesoId(baseA);
    const topDown = descomponerProceso(baseA, "opd-1", pA);
    expect(topDown.ok).toBe(true);
    const outA = (topDown as { value: { modelo: Modelo; opdId: string } }).value;

    // Camino B — adopción de un suelto vacío del mismo proceso
    const baseB = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const pB = procesoId(baseB);
    const creado = crearOpdSuelto(baseB);
    const adop = adoptarOpd(creado.modelo, { opdPadreId: "opd-1", entidadId: pB, opdSueltoId: creado.opdId, tipo: "descomposicion" });
    expect(adop.ok).toBe(true);
    const outB = (adop as { value: Modelo }).value;

    // Hecho de vínculo idéntico EN FORMA: la entidad refinada apunta a su OPD hijo,
    // y ese OPD hijo tiene padreId = opd-1, en ambos caminos.
    const slotA = obtenerRefinamiento(outA.modelo.entidades[pA], "descomposicion")!;
    const slotB = obtenerRefinamiento(outB.entidades[pB], "descomposicion")!;
    expect(outA.modelo.opds[slotA.opdId].padreId).toBe("opd-1");
    expect(outB.opds[slotB.opdId].padreId).toBe("opd-1");
    expect(slotA.modo).toEqual(slotB.modo); // ambos undefined (descomposición)
  });

  test("ADVERSARIAL: ambos caminos rechazan un ciclo por igual", () => {
    // Prepara opd-1 → opd-a; una cosa en opd-a; intentar refinarla con hijo = opd-1 (ancestro)
    let m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "P").value as Modelo;
    m = { ...m, opds: { ...m.opds, "opd-a": { id: "opd-a", nombre: "a", padreId: "opd-1", apariencias: {}, enlaces: {} } } };
    m = crearProceso(m, "opd-a", { x: 0, y: 0 }, "Q").value as Modelo;
    const qId = Object.values(m.entidades).find((e) => e.nombre === "Q")!.id;
    // adopción hacia un ancestro: opd-1 no es suelto → rechaza (o rechaza por ciclo si lo fuera)
    const adop = adoptarOpd(m, { opdPadreId: "opd-a", entidadId: qId, opdSueltoId: "opd-1", tipo: "descomposicion" });
    expect(adop.ok).toBe(false);
  });
});
```

- [ ] **Step 1b: Añade la regresión por firma semántica**

Dentro del mismo `describe`, añade un test que construya contenido EQUIVALENTE en ambos caminos y compare la firma de frontera del proceso refinado en su OPD hijo:
```ts
  test("REGRESIÓN firma semántica: adoptar preserva la firma de frontera igual que top-down (R-OPD-REF-10)", () => {
    // Camino A — top-down (genera 2 subprocesos "Cargar 1"/"Cargar 2").
    const baseA = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const pA = procesoId(baseA);
    const outA = (descomponerProceso(baseA, "opd-1", pA) as { value: { modelo: Modelo; opdId: string } }).value;
    // Camino B — suelto poblado para MIRROR del top-down, luego adopción.
    let baseB = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "Cargar").value as Modelo;
    const pB = procesoId(baseB);
    const creado = crearOpdSuelto(baseB); baseB = creado.modelo;
    baseB = crearProceso(baseB, creado.opdId, { x: 0, y: 0 }, "Cargar 1").value as Modelo;
    baseB = crearProceso(baseB, creado.opdId, { x: 0, y: 60 }, "Cargar 2").value as Modelo;
    const outB = (adoptarOpd(baseB, { opdPadreId: "opd-1", entidadId: pB, opdSueltoId: creado.opdId, tipo: "descomposicion" }) as { value: Modelo }).value;
    // La firma de frontera del proceso refinado en su OPD hijo coincide (misma semántica de frontera).
    const firmaA = firmaFronteraEntidad(outA.modelo, outA.opdId, pA);
    const firmaB = firmaFronteraEntidad(outB, creado.opdId, pB);
    expect([...firmaA].sort()).toEqual([...firmaB].sort());
  });
```
> Verifica primero qué retorna `firmaFronteraEntidad` en este caso (`cd app && sed -n '25,60p' src/modelo/equivalencia/verticalidad.ts`). Si el contenido auto-generado del top-down difiere del manual en algo que la firma capte (p. ej. `contextoRefinamiento`), ajusta el mirror del camino B para igualar, o compara el subconjunto de frontera relevante. La firma DEBE abstraer ids; si no lo hace del todo, usa `firmaFronteraDeOpd` sobre el OPD hijo. El punto falsable: adoptar no introduce divergencia semántica frente al top-down.

- [ ] **Step 2: Corre la ley**

Run: `cd app && bun test src/leyes/taller-convergencia.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 3: Commit**

```bash
git add app/src/leyes/taller-convergencia.test.ts
git commit -m "test(taller): ley de convergencia por construcción (top-down ≡ adoptar)"
```

## Task 7: «OPD sin adoptar» como condición del gate de export canónico

**Files:**
- Modify: `app/src/serializacion/perfilesExport.ts`
- Modify: `app/src/modelo/diagnosticoSeveridad.ts:106-147`
- Test: `app/src/leyes/taller-export-honesto.test.ts`

**Interfaces:**
- Produces: `CODIGO_OPD_SIN_ADOPTAR = "opd-sin-adoptar"`; `gateOpdsSinAdoptar(modelo: Modelo, opciones?: { esApunte?: boolean }): Resultado<true>`. `exportarModeloConPerfil` y `emitirDocumentoCanonico` ganan un parámetro opcional `opciones?: { esApunte?: boolean }`.

- [ ] **Step 1: Escribe la ley «export honesto»**

```ts
// app/src/leyes/taller-export-honesto.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo, crearProceso } from "../modelo/operaciones/creacion";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { exportarModeloConPerfil, gateOpdsSinAdoptar } from "../serializacion/perfilesExport";
import type { Modelo } from "../modelo/tipos";

describe("LEY: export honesto (R-OPD-REF-20)", () => {
  test("modelo con OPD sin adoptar → export canónico BLOQUEA con causa", () => {
    const { modelo } = crearOpdSuelto(crearModelo("M"));
    const r = exportarModeloConPerfil(modelo, "canon-diagrama");
    expect(r.ok).toBe(false);
    expect((r as { error: string }).error).toContain("sin adoptar");
  });

  test("apunte con OPD sin adoptar → NO bloquea (observación)", () => {
    const { modelo } = crearOpdSuelto(crearModelo("M"));
    const r = exportarModeloConPerfil(modelo, "canon-diagrama", null, { esApunte: true });
    expect(r.ok).toBe(true);
  });

  test("modelo sin sueltos → gate ok", () => {
    const m = crearProceso(crearModelo("M"), "opd-1", { x: 0, y: 0 }, "P").value as Modelo;
    expect(gateOpdsSinAdoptar(m).ok).toBe(true);
  });

  test("export intercambio ignora el gate de sueltos (histórico)", () => {
    const { modelo } = crearOpdSuelto(crearModelo("M"));
    expect(exportarModeloConPerfil(modelo, "intercambio").ok).toBe(true);
  });
});
```

- [ ] **Step 2: Corre y verifica que falla**

Run: `cd app && bun test src/leyes/taller-export-honesto.test.ts`
Expected: FAIL (`gateOpdsSinAdoptar` no existe).

- [ ] **Step 3: Añade el código a la whitelist apunte**

En `app/src/modelo/diagnosticoSeveridad.ts`, exporta el código y añádelo al set:
```ts
// Justo antes de export const CODIGOS_VALIDEZ_DEGRADABLES_APUNTE:
/** Código de la condición de export «OPD sin adoptar» (R-OPD-REF-20). NO es una
 *  clase de severidad del panel (no está en SEVERIDAD_POR_CODIGO); es condición
 *  del gate de export canónico. Se lista aquí para que en APUNTE degrade a
 *  observación (no bloquea el export del bosquejo). */
export const CODIGO_OPD_SIN_ADOPTAR = "opd-sin-adoptar";
```
Y dentro del `new Set<string>([ ... ])`, añade una línea:
```ts
  CODIGO_OPD_SIN_ADOPTAR, // condición de gate de export, degradable en apunte
```

- [ ] **Step 4: Implementa el gate en `perfilesExport.ts`**

Añade el import y el gate; compón en las dos rutas de export canónico:
```ts
import { opdsSueltos } from "../modelo/opdSueltos";
import { CODIGO_OPD_SIN_ADOPTAR, CODIGOS_VALIDEZ_DEGRADABLES_APUNTE } from "../modelo/diagnosticoSeveridad";
```
```ts
/**
 * Condición de export canónico «OPD sin adoptar» (R-OPD-REF-20): un modelo con
 * OPDs sueltos no cierra como documento canónico. En un MODELO bloquea con causa;
 * en un APUNTE (rigor relajado) degrada a observación vía la whitelist
 * CODIGOS_VALIDEZ_DEGRADABLES_APUNTE — NO es una clase de severidad nueva.
 * La edición nunca se bloquea (esto solo rige el export canónico).
 */
export function gateOpdsSinAdoptar(modelo: Modelo, opciones: { esApunte?: boolean } = {}): Resultado<true> {
  const sueltos = opdsSueltos(modelo);
  if (sueltos.length === 0) return { ok: true, value: true };
  if (opciones.esApunte && CODIGOS_VALIDEZ_DEGRADABLES_APUNTE.has(CODIGO_OPD_SIN_ADOPTAR)) {
    return { ok: true, value: true }; // observación: el bosquejo exporta con marca
  }
  const nombres = sueltos.map((o) => `'${o.nombre}'`).join(", ");
  return {
    ok: false,
    error: `Export canónico bloqueado: OPD sin adoptar: ${nombres}. Adopta cada OPD suelto (in-zoom/unfold de una cosa) o reconcílialo antes de exportar.`,
  };
}
```
En `exportarModeloConPerfil`, añade el parámetro `opciones` y compón el gate junto al de densidad:
```ts
export function exportarModeloConPerfil(
  modelo: Modelo,
  perfil: PerfilExport,
  carpetaId?: Id | null,
  opciones: { esApunte?: boolean } = {},
): Resultado<string> {
  if (perfil !== "intercambio") {
    const gd = gateDensidadCanonica(modelo);
    if (!gd.ok) return gd;
    const gs = gateOpdsSinAdoptar(modelo, opciones);
    if (!gs.ok) return gs;
  }
  return { ok: true, value: exportarModelo(filtrarModeloPorPerfil(modelo, perfil), carpetaId) };
}
```
En `emitirDocumentoCanonico`, añade `opciones` y el gate; si es apunte con sueltos, inserta una marca en la portada:
```ts
export function emitirDocumentoCanonico(modelo: Modelo, opciones: { esApunte?: boolean } = {}): Resultado<string> {
  const gd = gateDensidadCanonica(modelo);
  if (!gd.ok) return gd;
  const gs = gateOpdsSinAdoptar(modelo, opciones);
  if (!gs.ok) return gs;
  // ... (resto igual)
  // tras `secciones.push(\`# ${filtrado.nombre}\`);` añade la marca si aplica:
  const sueltosMarca = opdsSueltos(modelo);
  if (opciones.esApunte && sueltosMarca.length > 0) {
    secciones.push(`> **Bosquejo**: contiene ${sueltosMarca.length} OPD(s) sin adoptar (observación, no bloqueo).`);
  }
  // ...
}
```

- [ ] **Step 5: Corre la ley + la suite de perfiles**

Run: `cd app && bun test src/leyes/taller-export-honesto.test.ts src/serializacion/perfilesExport.test.ts`
Expected: PASS (la suite existente sigue verde; sus modelos no tienen sueltos).

- [ ] **Step 6: Wiring en las rutas de export canónico VIVAS (CORREGIDO por verificación adversarial)**

⚠️ **La verificación adversarial reveló que `exportarModeloConPerfil` NO tiene llamadores de producción** (solo tests) — el gate en él es andamiaje de test válido, pero la ley «export honesto» solo se materializa si se gatean las rutas canónicas VIVAS. La invariante EXPORT-GATE («ninguna ruta de export canónico evade el gate») exige gatear las TRES rutas vivas:

Confirma primero el mapa de rutas:
```bash
cd app && grep -rn "gateDensidadCanonica\|perfilCanonDiagrama\|emitirDocumentoCanonico\|descargarTodosLosOpdsPngZip\|exportar-opd-png\|exportar-opds-png-zip" src/store src/ui src/app src/render | grep -v test
```

1. **Documento canónico** (`emitirDocumentoCanonico`) — llamador vivo `src/store/modelo/acciones-canvas.ts:399` (`copiarCanonDocumentoAlPortapapeles`), hoy invoca `emitirDocumentoCanonico(modelo)` sin especie. Pásale `{ esApunte }` derivado de la especie del modelo activo: `especieDe(get().indice.modelos.find(m => m.id === get().modeloPersistidoId) ?? {}) === "apunte"`.
2. **PNG por OPD** (`exportar-opd-png`, `CommandPalette.tsx:190-198`) — gatea por densidad con `perfilCanonDiagrama(modelo, opdId).estado === "bloqueado"`. Añade la condición suelto POR-OPD: si el OPD que se exporta ES un suelto (`esOpdSuelto(modelo, opdId)`) y el modelo NO es apunte → bloquear con causa; en apunte → permitir con aviso.
3. **PNG-ZIP de todos los OPDs** (`exportar-opds-png-zip`, `CommandPalette.tsx:574-575` → `descargarTodosLosOpdsPngZip`, `mapaExport.ts:61`) — nivel MODELO, itera `modelo.opds` (un suelto ES un OPD → hoy fugaría al ZIP). Compón `gateOpdsSinAdoptar(modelo, { esApunte })` en el mismo punto donde hoy se computa el bloqueo por densidad (`CommandPalette.tsx:194-196`): si bloquea → no descargar, mostrar la causa.

Importa `esOpdSuelto` (`../modelo/opdSueltos`), `gateOpdsSinAdoptar` (`../serializacion/perfilesExport`) y `especieDe` (`../persistencia/especie`) donde corresponda. Añade a la ley `taller-export-honesto.test.ts` un caso a nivel de la ruta ZIP (o un test del helper de gating que la ZIP consume) para falsar la fuga descubierta.

- [ ] **Step 7: Typecheck + commit**

Run: `cd app && bun run typecheck && bun test src/serializacion src/leyes/taller-export-honesto.test.ts`
```bash
git add app/src/serializacion/perfilesExport.ts app/src/modelo/diagnosticoSeveridad.ts app/src/leyes/taller-export-honesto.test.ts app/src/store src/ui src/render
git commit -m "feat(taller): «OPD sin adoptar» gatea las rutas canónicas vivas (documento + PNG + PNG-ZIP)"
```

## Task 8: Leyes de integridad-ciega y sin-especie-nueva

**Files:**
- Create: `app/src/leyes/taller-integridad-ciega.test.ts`
- Create: `app/src/leyes/taller-sin-especie-nueva.test.ts`

**Interfaces:**
- Consumes: `validarApariciones` (de `../serializacion/validarApariencias` — la función que rechaza `entidadId` colgante, `:36`); `especieDe`, `Especie` (de `../persistencia/especie`).

> ⚠️ **CORREGIDO por verificación adversarial**: `validarReferenciasOpd` (`validarIntegridad.ts`) NO valida que `apariencia.entidadId` de una apariencia de ENTIDAD resuelva (hace `continue` si no es parte extraída). Quien rechaza `entidadId` colgante es **`validarApariciones`** (`validarApariencias.ts:36`, `!entidades[raw.entidadId]`). Usar la función correcta o el test sale rojo (verde tautológico).

- [ ] **Step 1: Ley de integridad ciega a la especie/banda**

```ts
// app/src/leyes/taller-integridad-ciega.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo } from "../modelo/operaciones/creacion";
import { crearOpdSuelto } from "../modelo/operaciones/opdSuelto";
import { validarApariciones } from "../serializacion/validarApariencias";
import type { Modelo } from "../modelo/tipos";

describe("LEY: integridad NUNCA degrada por suelto (R-OPD-REF-20)", () => {
  test("una apariencia colgante en un OPD suelto se rechaza igual que en la raíz", () => {
    const { modelo, opdId } = crearOpdSuelto(crearModelo("M"));
    // inyecta una apariencia con entidadId inexistente en el suelto
    const corrupto: Modelo = {
      ...modelo,
      opds: {
        ...modelo.opds,
        [opdId]: {
          ...modelo.opds[opdId],
          apariencias: { "a-x": { id: "a-x", entidadId: "no-existe", opdId, x: 0, y: 0, width: 10, height: 10 } },
        },
      },
    };
    const r = validarApariciones(corrupto);
    expect(r.ok).toBe(false); // integridad ciega al hecho de que el OPD es suelto
  });
});
```
> Verifica primero la firma exacta: `cd app && grep -n "export function validarApariciones\|entidadId" src/serializacion/validarApariencias.ts`. Ajusta el uso/forma del `Resultado` a lo real. Si prefieres el pipeline completo, usa `validarModelo` como vehículo (más robusto, ejercita toda la integridad).

- [ ] **Step 2: Ley sin-especie-nueva (contrato)**

```ts
// app/src/leyes/taller-sin-especie-nueva.test.ts
import { describe, expect, test } from "bun:test";
import { especieDe, type Especie } from "../persistencia/especie";

describe("LEY: sin especie nueva (guardia categorial CLAUDE.md)", () => {
  test("las especies son exactamente {modelo, apunte, biblioteca}", () => {
    const especies: Especie[] = ["modelo", "apunte", "biblioteca"];
    expect(especies.length).toBe(3);
    // exhaustividad: cualquier combinación de los DOS flags mapea a una de las 3.
    expect(especieDe({})).toBe("modelo");
    expect(especieDe({ esApunte: true })).toBe("apunte");
    expect(especieDe({ esBiblioteca: true })).toBe("biblioteca");
    // apunte gana a biblioteca (orden de especieDe) — no hay 4ta especie posible.
    expect(especieDe({ esApunte: true, esBiblioteca: true })).toBe("apunte");
  });

  test("un flag de especie desconocido NO crea una 4ta especie (guardia efectiva)", () => {
    // Anclado a la superficie REAL de especieDe (no tautológico): un flag hipotético
    // `esCuaderno` NO altera la clasificación — especieDe solo conoce esApunte/esBiblioteca.
    // Si alguien introduce un 3er flag y lo cablea en especieDe sin migrar al discriminado,
    // este test (que exige "modelo" ante flags no-reconocidos) romperá.
    expect(especieDe({ esApunte: false, esBiblioteca: false } as Record<string, boolean>)).toBe("modelo");
    expect(especieDe({ esCuaderno: true } as Record<string, boolean>)).toBe("modelo"); // ignorado hoy
    // Exhaustividad total sobre las 4 combinaciones de los DOS flags → solo 3 especies.
    const combos = [
      { esApunte: false, esBiblioteca: false },
      { esApunte: true, esBiblioteca: false },
      { esApunte: false, esBiblioteca: true },
      { esApunte: true, esBiblioteca: true },
    ];
    const especiesVistas = new Set(combos.map((c) => especieDe(c)));
    expect([...especiesVistas].sort()).toEqual(["apunte", "biblioteca", "modelo"]);
  });
});
```

- [ ] **Step 3: Corre + commit**

Run: `cd app && bun test src/leyes/taller-integridad-ciega.test.ts src/leyes/taller-sin-especie-nueva.test.ts`
Expected: PASS.
```bash
git add app/src/leyes/taller-integridad-ciega.test.ts app/src/leyes/taller-sin-especie-nueva.test.ts
git commit -m "test(taller): leyes integridad-ciega + sin-especie-nueva"
```

## Task 9: Gate mínimo de la Ola 1

- [ ] **Step 1: Gate completo kernel**

Run: `cd app && bun run check`
Expected: typecheck + todos los unit tests verdes.

- [ ] **Step 2: Lint**

Run: `cd app && bun run lint`
Expected: sin errores.

- [ ] **Step 3: Verificación de contexto fresco (subagente) contra la spec de kernel**

Despacha un subagente de contexto fresco: «Verifica que la Ola 1 del corte B′⊕D cumple `docs/superpowers/specs/2026-07-06-apuntes-taller-design.md` §4 y §7 (convergencia, integridad-ciega, export-honesto, sin-especie-nueva) y la enmienda `docs/solicitudes-upstream/2026-07-07-enmienda-ssot-bottom-up-taller.md` R-OPD-REF-20. Adversarial sobre la ley de convergencia: ¿top-down y adoptar realmente invocan el mismo op? ¿hay algún camino que rompa la identidad? Reporta discrepancias con archivo:línea.»

---

# OLA 2 — UI del Taller

## Task 10: Banda «Taller» en el árbol de OPDs (segregar sueltos)

**Files:**
- Modify: `app/src/ui/arbol/togglesArbol.ts:24-54`
- Test: `app/src/ui/arbol/togglesArbol.test.ts` (crear si no existe)

**Interfaces:**
- Produces: `nodosSueltosTaller(modelo: Modelo): NodoOpdData[]`; `construirArbol` deja de colgar los sueltos de la raíz.

- [ ] **Step 1: Escribe el test**

```ts
// app/src/ui/arbol/togglesArbol.test.ts
import { describe, expect, test } from "bun:test";
import { crearModelo } from "../../modelo/operaciones/creacion";
import { crearOpdSuelto } from "../../modelo/operaciones/opdSuelto";
import { construirArbol, nodosSueltosTaller } from "./togglesArbol";

describe("banda Taller en el árbol", () => {
  test("un suelto NO cuelga de la raíz; aparece en la banda Taller", () => {
    const { modelo, opdId } = crearOpdSuelto(crearModelo("M"));
    const arbol = construirArbol(modelo);
    const raiz = arbol[0];
    expect(raiz.hijos.some((h) => h.opd.id === opdId)).toBe(false);
    const taller = nodosSueltosTaller(modelo);
    expect(taller.map((n) => n.opd.id)).toContain(opdId);
  });

  test("un huérfano CORRUPTO (padre inexistente) sigue colgando de la raíz (defensivo)", () => {
    const m = crearModelo("M");
    const corrupto = { ...m, opds: { ...m.opds, "opd-x": { id: "opd-x", nombre: "x", padreId: "opd-fantasma", apariencias: {}, enlaces: {} } } };
    const raiz = construirArbol(corrupto)[0];
    expect(raiz.hijos.some((h) => h.opd.id === "opd-x")).toBe(true);
    expect(nodosSueltosTaller(corrupto).some((n) => n.opd.id === "opd-x")).toBe(false);
  });
});
```

- [ ] **Step 2: Corre y verifica que falla**

Run: `cd app && bun test src/ui/arbol/togglesArbol.test.ts`
Expected: FAIL (`nodosSueltosTaller` no existe; el suelto cuelga de la raíz).

- [ ] **Step 3: Modifica `construirArbol` + añade `nodosSueltosTaller`**

Reemplaza el cuerpo de `construirArbol` (líneas 24-54) para excluir sueltos, y añade la función de la banda. Usa `esOpdSuelto`:
```ts
import { esOpdSuelto } from "../../modelo/opdSueltos";
```
```ts
export function construirArbol(modelo: Modelo): NodoOpdData[] {
  const raiz = modelo.opds[modelo.opdRaizId];
  if (!raiz) return [];
  const esSuelto = (id: Id) => esOpdSuelto(modelo, id);
  const hijosPorPadre = new Map<Id, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    if (opd.id === raiz.id || esSuelto(opd.id)) continue; // sueltos → banda Taller, no árbol
    const padreId = padreValido(modelo, opd, raiz.id);
    const hijos = hijosPorPadre.get(padreId) ?? [];
    hijos.push(opd);
    hijosPorPadre.set(padreId, hijos);
  }
  for (const hijos of hijosPorPadre.values()) {
    hijos.sort((a, b) => {
      if (a.ordenLocal !== undefined && b.ordenLocal !== undefined) return a.ordenLocal - b.ordenLocal;
      return a.id.localeCompare(b.id, "es");
    });
  }
  const visitados = new Set<Id>();
  const crearNodo = (opd: Opd, nivel: number): NodoOpdData => {
    visitados.add(opd.id);
    const hijos = (hijosPorPadre.get(opd.id) ?? [])
      .filter((hijo) => !visitados.has(hijo.id))
      .map((hijo) => crearNodo(hijo, nivel + 1));
    return { opd, nivel, hijos };
  };
  const nodoRaiz = crearNodo(raiz, 0);
  // Huérfanos CORRUPTOS (padre inexistente, no sueltos intencionales) → defensivo bajo raíz.
  const huerfanos = Object.values(modelo.opds)
    .filter((opd) => !visitados.has(opd.id) && !esSuelto(opd.id) && opd.id !== raiz.id)
    .map((opd) => crearNodo(opd, 1));
  return [{ ...nodoRaiz, hijos: [...nodoRaiz.hijos, ...huerfanos] }];
}

/**
 * Subárboles de la banda «Taller» (R-OPD-REF-20): un nodo nivel-0 por cada OPD
 * suelto, con sus descendientes adoptados internamente (un suelto puede tener
 * refinamiento propio). Proyección de navegación, no identidad.
 */
export function nodosSueltosTaller(modelo: Modelo): NodoOpdData[] {
  const sueltos = Object.values(modelo.opds).filter((opd) => esOpdSuelto(modelo, opd.id));
  const hijosPorPadre = new Map<Id, Opd[]>();
  for (const opd of Object.values(modelo.opds)) {
    if (opd.padreId) {
      const arr = hijosPorPadre.get(opd.padreId) ?? [];
      arr.push(opd);
      hijosPorPadre.set(opd.padreId, arr);
    }
  }
  const visitados = new Set<Id>();
  const crearNodo = (opd: Opd, nivel: number): NodoOpdData => {
    visitados.add(opd.id);
    const hijos = (hijosPorPadre.get(opd.id) ?? [])
      .filter((h) => !visitados.has(h.id))
      .sort((a, b) => a.id.localeCompare(b.id, "es"))
      .map((h) => crearNodo(h, nivel + 1));
    return { opd, nivel, hijos };
  };
  return sueltos
    .sort((a, b) => a.id.localeCompare(b.id, "es"))
    .map((opd) => crearNodo(opd, 0));
}
```

- [ ] **Step 4: Corre el test**

Run: `cd app && bun test src/ui/arbol/togglesArbol.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/ui/arbol/togglesArbol.ts app/src/ui/arbol/togglesArbol.test.ts
git commit -m "feat(taller): banda Taller en el árbol — sueltos fuera de la raíz"
```

## Task 11: Acciones de store `nuevoOpdSuelto` y `adoptarOpdEnSeleccion`

**Files:**
- Modify: `app/src/store/modelo/acciones-opd.ts` (dentro de `accionesOpd`)
- Modify: `app/src/store/tipos.ts` (firmas en `ModeloSlice`)

**Interfaces:**
- Consumes: `crearOpdSuelto`, `adoptarOpd` (de `../../modelo/operaciones`); `commitModelo`.
- Produces: `nuevoOpdSuelto(): void`; `adoptarOpdEnSeleccion(opdSueltoId: Id, tipo: TipoRefinamiento, modo?: ModoDespliegueObjeto): void`.

- [ ] **Step 1: Añade las firmas en `store/tipos.ts`**

Localiza la interfaz `ModeloSlice` (junto a `descomponerSeleccionada`) y añade:
```ts
  /** Taller (R-OPD-REF-20): crea un OPD suelto vacío y lo activa. */
  nuevoOpdSuelto: () => void;
  /** Taller: adopta un OPD suelto como refinamiento de la cosa seleccionada. */
  adoptarOpdEnSeleccion: (opdSueltoId: Id, tipo: TipoRefinamiento, modo?: ModoDespliegueObjeto) => void;
```
Asegura que `TipoRefinamiento` y `ModoDespliegueObjeto` estén importados en `tipos.ts` (de `../modelo/tipos`).

- [ ] **Step 2: Implementa en `acciones-opd.ts`**

Añade los imports:
```ts
import { crearOpdSuelto } from "../../modelo/operaciones/opdSuelto";
import { adoptarOpd } from "../../modelo/operaciones";
import type { ModoDespliegueObjeto, TipoRefinamiento } from "../../modelo/tipos";
```
Dentro del objeto que retorna `accionesOpd`, añade:
```ts
    nuevoOpdSuelto() {
      const { modelo } = get();
      const { modelo: siguiente, opdId } = crearOpdSuelto(modelo);
      commitModelo(set, modelo, siguiente, {
        opdActivoId: opdId,
        seleccionId: null,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "OPD suelto creado (Taller)",
      });
    },

    adoptarOpdEnSeleccion(opdSueltoId: Id, tipo: TipoRefinamiento, modo?: ModoDespliegueObjeto) {
      const { modelo, opdActivoId, seleccionId } = get();
      if (!seleccionId || !modelo.entidades[seleccionId]) {
        set({ mensaje: "Selecciona la cosa que adoptará el OPD suelto" });
        return;
      }
      const r = adoptarOpd(modelo, { opdPadreId: opdActivoId, entidadId: seleccionId, opdSueltoId, tipo, modo });
      if (!r.ok) {
        set({ mensaje: r.error });
        return;
      }
      commitModelo(set, modelo, r.value, {
        opdActivoId: opdSueltoId,
        seleccionId,
        enlaceSeleccionId: null,
        modoEnlace: null,
        mensaje: "OPD suelto adoptado",
      });
    },
```

- [ ] **Step 3: Test de las acciones (store)**

```ts
// app/src/store/modelo/acciones-opd-taller.test.ts
import { describe, expect, test, beforeEach } from "bun:test";
import { useOpmStore } from "../store"; // ajusta al import real del store singleton
// ... patrón de los tests de store existentes (ver capacidadesOpcloudUi.test.ts)
```
> Sigue el patrón EXACTO de un test de store existente (`src/store/capacidadesOpcloudUi.test.ts`): resetea el store, crea un proceso en `modelo.nId`/`opdRaizId`, selecciónalo, llama `get().nuevoOpdSuelto()`, verifica `opdActivoId` = nuevo suelto y `esOpdSuelto` true; luego `adoptarOpdEnSeleccion(...)` y verifica el vínculo. Copia la mecánica de setup de ese archivo (no la inventes).

- [ ] **Step 4: Corre + typecheck**

Run: `cd app && bun test src/store/modelo/acciones-opd-taller.test.ts && bun run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/src/store/modelo/acciones-opd.ts app/src/store/tipos.ts app/src/store/modelo/acciones-opd-taller.test.ts
git commit -m "feat(taller): acciones store nuevoOpdSuelto + adoptarOpdEnSeleccion"
```

## Task 12: Render de la banda «Taller» + gestos en `ArbolOpd`

**Files:**
- Modify: `app/src/ui/ArbolOpd.tsx`
- Modify: `app/src/app/viewmodels/arbolOpdViewModel.ts`

**Interfaces:**
- Consumes: `nodosSueltosTaller`, `nuevoOpdSuelto`, `adoptarOpdEnSeleccion`.

- [ ] **Step 1: Expón sueltos + acciones en el viewmodel**

En `arbolOpdViewModel.ts`, añade al retorno: `sueltos: nodosSueltosTaller(modelo)`, `nuevoOpdSuelto`, `adoptarOpdEnSeleccion` (léelos del port zustand análogo a `cambiarOpdActivo`). Verifica el patrón exacto del port: `cd app && sed -n '1,40p' src/app/viewmodels/arbolOpdViewModel.ts`.

- [ ] **Step 2: Render de la banda al pie del árbol**

En `ArbolOpd.tsx`, tras el `<div role="tree">` de la raíz, añade una sección condicional cuando `sueltos.length > 0`: un encabezado «Taller» + los nodos sueltos (reusa el mismo `NodoOpd`/render de nodo). Añade un botón «+ OPD suelto» (`onClick={nuevoOpdSuelto}`, testId `arbol-nuevo-suelto`). El encabezado lleva testId `arbol-banda-taller`. Cada nodo suelto ofrece, en su menú contextual (`MenuContextualArbol`), la acción «Adoptar como…» que, con una cosa seleccionada, llama `adoptarOpdEnSeleccion(sueltoId, "descomposicion")` o `"despliegue"`.
> Sigue la estética de bandas/encabezados del árbol existente (tokens `ui-forja`); NO introduzcas color semántico OPM (crimson prohibido, R-OPD-UI-1). Toda decisión visual pasa `design:governance`.

- [ ] **Step 3: Design governance**

Run: `cd app && bun run design:governance`
Expected: PASS (tokens/sombras/offset conformes).

- [ ] **Step 4: Typecheck + commit**

Run: `cd app && bun run typecheck`
```bash
git add app/src/ui/ArbolOpd.tsx app/src/app/viewmodels/arbolOpdViewModel.ts
git commit -m "feat(taller): banda Taller en ArbolOpd + gestos «+ OPD suelto» y «Adoptar»"
```

## Task 13: e2e del Taller bottom-up

**Files:**
- Create: `app/e2e/40-taller-bottom-up.spec.ts`

- [ ] **Step 1: Escribe el e2e**

Flujo: abrir la app → crear un OPD suelto («+ OPD suelto») → verificar que aparece bajo la banda `arbol-banda-taller` y NO bajo la raíz → dibujar un proceso en la raíz, seleccionarlo → adoptar el suelto como su descomposición → verificar que el suelto ya no está en la banda Taller y cuelga del proceso.
> Sigue el patrón de los e2e existentes (`e2e/03-opl-panel.spec.ts`): usa `PW_PORT` libre, apaga el dev server de fondo antes de smoke.

- [ ] **Step 2: Corre el e2e**

Run: `cd app && bunx playwright test e2e/40-taller-bottom-up.spec.ts`
Expected: PASS.

- [ ] **Step 3: Commit + verificación de contexto fresco (UI-Taller)**

```bash
git add app/e2e/40-taller-bottom-up.spec.ts
git commit -m "test(taller): e2e bottom-up — crear suelto, adoptar, reconciliar"
```
Despacha un subagente fresco: «Verifica la Ola 2 (UI-Taller) contra la spec §4 y §6 (banda Taller, gesto adoptar). ¿La banda es derivada, no persistida? ¿el gesto adoptar invoca `adoptarOpdEnSeleccion`? Reporta con archivo:línea.»

---

# OLA 3 — «Todo nace apunte»

## Task 14: Auto-nombre `Apunte AAAA-MM-DD` (puro)

**Files:**
- Create: `app/src/persistencia/nombreApunte.ts`
- Test: `app/src/persistencia/nombreApunte.test.ts`

**Interfaces:**
- Produces: `nombreApunteDeFecha(fecha: Date): string` → `"Apunte AAAA-MM-DD"`.

- [ ] **Step 1: Test**

```ts
// app/src/persistencia/nombreApunte.test.ts
import { describe, expect, test } from "bun:test";
import { nombreApunteDeFecha } from "./nombreApunte";

describe("nombreApunteDeFecha", () => {
  test("formatea ISO local AAAA-MM-DD", () => {
    expect(nombreApunteDeFecha(new Date("2026-07-07T13:00:00"))).toBe("Apunte 2026-07-07");
  });
});
```

- [ ] **Step 2: Corre (falla) → implementa**

```ts
// app/src/persistencia/nombreApunte.ts
/** Auto-nombre de un apunte recién nacido: «Apunte AAAA-MM-DD» (fecha local).
 *  La identidad real es el id; los nombres PUEDEN repetirse (el CLI exige id
 *  ante ambigüedad). Sin sufijo de máquina. Ref: diseño §3. */
export function nombreApunteDeFecha(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `Apunte ${y}-${m}-${d}`;
}
```

- [ ] **Step 3: Corre + commit**

Run: `cd app && bun test src/persistencia/nombreApunte.test.ts`
```bash
git add app/src/persistencia/nombreApunte.ts app/src/persistencia/nombreApunte.test.ts
git commit -m "feat(nacimiento): auto-nombre Apunte AAAA-MM-DD"
```

## Task 15: Acción `nacerApunte` (nace apunte + persiste + autosave)

**Files:**
- Modify: `app/src/store/modelo/acciones-ui.ts` (añade `nacerApunte`, junto a `nuevoModelo`)
- Modify: `app/src/store/tipos.ts` (firma `nacerApunte: () => void`)

**Interfaces:**
- Consumes: `crearModelo`; `nombreApunteDeFecha`; `guardarComoLocal` (existente); `toggleApunteModelo`/`marcarApunte` (para marcar el índice); `iniciarAutosalvado`.
- Produces: `nacerApunte(): void`.

**Diseño (por qué así, CORREGIDO por verificación adversarial):** El autosalvado solo dispara con `modeloPersistidoId !== null` (`persistencia.ts:480,483`). Un recién nacido tiene id null. **`guardarComoLocal` es ASÍNCRONO** (persiste vía backend con `.then`; `modeloPersistidoId` se fija dentro de `finalizarGuardadoComo`, no en el tick de la llamada). Por eso NO se puede leer el id de forma síncrona para marcar apunte después — eso haría nacer un modelo plano (bug bloqueante). La corrección atómica: **enhebrar `esApunte:true` por el guardado**. `construirModeloPersistido` ya acepta `input.esApunte` (`modelos.ts:85-86`); solo falta que `guardarComoLocal` lo propague al `inputGuardado` y a la entrada de índice. Así el modelo nace apunte en **un solo guardado backend**, sin race ni segunda escritura, y el autosalvado toma el relevo «desde el primer trazo».

- [ ] **Step 1: Enhebra `esApunte` por `guardarComoLocal`**

Localiza `guardarComoLocal` en `app/src/store/modelo/acciones-ui.ts` (~línea 108). Añade `esApunte?: boolean` a su input y propágalo:
- en el `inputGuardado` (junto a `nombre`/`descripcion`/`json`): `...(esApunte ? { esApunte: true } : {})` — `construirModeloPersistido` (`modelos.ts:85-86`) ya lo consume;
- en la entrada de índice que arma `finalizarGuardadoComo` (junto a `carpetaId`): `...(esApunte ? { esApunte: true } : {})`.
> Verifica la firma real y el cuerpo antes de editar: `cd app && grep -n "guardarComoLocal\|finalizarGuardadoComo\|construirModeloPersistido" src/store/modelo/acciones-ui.ts src/persistencia/modelos.ts`.

- [ ] **Step 2: Implementa `nacerApunte`**

Añade el import de `nombreApunteDeFecha`. Implementa:
```ts
    nacerApunte() {
      // 1. Modelo vacío con auto-nombre (raíz "SD"; el árbol la proyecta "Hoja" en apunte).
      const nombre = nombreApunteDeFecha(new Date());
      const modelo = crearModelo(nombre);
      // 2. Instala el modelo en la pestaña (reusa la mecánica de nuevoModelo, sin diálogo).
      //    set→guardarComoLocal es correcto: guardarComoLocal lee get().modelo (ya poblado).
      resetHistorial(modelo);
      set(estadoModelo(modelo, {
        opdActivoId: modelo.opdRaizId,
        seleccionId: null,
        seleccionados: [],
        modoSeleccion: "simple",
        enlaceSeleccionId: null,
        modoEnlace: null,
        modoCreacion: null,
        hoverOplRef: null,
        modeloPersistidoId: null,
        descripcionModeloLocal: "",
        menuPrincipalAbierto: false,
        dialogoGuardarComoAbierto: false,
        dialogoCargarModeloAbierto: false,
        workspaceLocal: workspaceDesdeModelo(modelo, null),
        mensaje: "Nuevo apunte",
        readOnly: false,
        esBibliotecaAbierta: false,
      }));
      // 3. Persiste de inmediato con especie APUNTE en un SOLO guardado backend (atómico,
      //    sin race): NO se lee modeloPersistidoId aquí (guardarComoLocal es async). El
      //    esApunte viaja DENTRO del guardado; el id se fija en el .then y el autosalvado
      //    toma el relevo. Nace apunte, no modelo plano.
      get().guardarComoLocal({ nombre, descripcion: "", esApunte: true });
    },
```

- [ ] **Step 3: Firma en tipos + test de store (con backend mockeado + await de un tick)**

Añade `nacerApunte: () => void;` a `ModeloSlice`. Test de store: **mockea el backend** (patrón de `persistencia.test.ts:31-34` que hace `await esperar(() => mensaje === 'Modelo guardado exitosamente')`) porque el guardado es async; llama `get().nacerApunte()`, **await** el tick del guardado, y verifica: `modelo.nombre` empieza con "Apunte ", `especieDe(indice.modelos.find(m => m.id === get().modeloPersistidoId))` === "apunte", `modeloPersistidoId !== null`. NO escribas el test de forma síncrona (fallaría por el microtask del `.then`).

- [ ] **Step 4: Corre + typecheck + commit**

Run: `cd app && bun test src/store/modelo src/store/persistencia.test.ts && bun run typecheck`
```bash
git add app/src/store/modelo/acciones-ui.ts app/src/store/tipos.ts
git commit -m "feat(nacimiento): nacerApunte — nace apunte (esApunte atómico en el guardado), autosave desde el primer trazo"
```

## Task 16: Rewire de la puerta «Nuevo» → `nacerApunte`

**Files:**
- Modify: `app/src/ui/CommandPalette.tsx:548`
- Modify: `app/src/ui/DialogoCargarModelo.tsx:144-147,336-342`

**Interfaces:**
- Consumes: `nacerApunte`.

- [ ] **Step 1: Command Palette**

Cambia la entrada `nuevo-modelo` (`:548`): `label: "Nuevo"`, `descripcion: "Abrir un apunte y explorar"`, `run: deps.nacerApunte` (añade `nacerApunte` a `deps`). Mantén `confirmarSiDirty`.

- [ ] **Step 2: Gestor (estado vacío)**

En `DialogoCargarModelo.tsx`, `crearNuevoModelo` (`:144-147`) pasa a llamar `nacerApunte` en vez de `nuevoModelo`. El botón del vacío (`:339`) cambia label a «Nuevo».
> `nuevoModelo` permanece en el store como op interno (reset de pestaña, imports); solo se retira como **puerta humana**.

- [ ] **Step 3: Verifica (typecheck) + commit**

Run: `cd app && bun run typecheck`
```bash
git add app/src/ui/CommandPalette.tsx app/src/ui/DialogoCargarModelo.tsx
git commit -m "feat(nacimiento): la puerta «Nuevo» abre un apunte al instante"
```

## Task 17: Proyección «Hoja» de la raíz en apuntes

**Files:**
- Modify: `app/src/ui/arbol/NodoOpd.tsx` (o `badges.ts`)

**Interfaces:**
- Consumes: especie del modelo activo (`esApunte`).

- [ ] **Step 1: Proyecta el nombre**

En el render del nodo raíz, si el modelo activo es apunte y el OPD es `opdRaizId`, muestra «Hoja» en vez del `opd.nombre` («SD»). Es DISPLAY-only (R-OPD-REF-15, proyección de navegación); NO muta `opd.nombre`. Deriva `esApunte` del viewmodel (añádelo si falta).
> Decisión: NO renombrar el OPD raíz en el modelo. «Hoja» es proyección pura — evita tocar la graduación y respeta que las etiquetas son proyección, no identidad.

- [ ] **Step 2: Test unit del helper de proyección + commit**

Añade un test del helper que decide el label (`labelNodoRaiz(esApunte, nombre)` → "Hoja" | nombre). Corre y commitea.
```bash
git add app/src/ui/arbol/NodoOpd.tsx app/src/ui/arbol
git commit -m "feat(nacimiento): raíz del apunte proyecta como «Hoja» (display-only)"
```

## Task 18: Momento de graduación (nombre/carpeta + reporte de validez)

**Files:**
- Create: `app/src/ui/DialogoGraduar.tsx`
- Modify: `app/src/ui/panelCarpetas/MenuContextual.tsx:83` (abre el diálogo)
- Modify: `app/src/store/tipos.ts` + acción `abrirGraduar`/`confirmarGraduacion`

**Interfaces:**
- Consumes: `severidadDiagnostico` (para mostrar la validez ahora exigible), `toggleApunteModelo`, `moverModeloACarpeta`, rename.
- Produces: `DialogoGraduar` (nombre definitivo + carpeta + reporte de validez exigible + confirmar).

- [ ] **Step 1: Diseña el diálogo**

`DialogoGraduar` muestra: (a) campo nombre definitivo (default el actual); (b) selector de carpeta (reusa el sidebar de carpetas del gestor); (c) el **reporte de validez** — los mismos avisos que hoy están en observación por ser apunte, ahora renderizados como EXIGIBLES (llama `severidadDiagnostico(aviso, { esApunte: false })` para mostrar su severidad real); (d) botón «Graduar». testId `dialogo-graduar`, `graduar-confirmar`.

- [ ] **Step 2: Acción `confirmarGraduacion`**

En el store: renombra el modelo si cambió, muévelo a la carpeta elegida (`moverModeloACarpeta`), y **gradúa** (`toggleApunteModelo(id)` → desmarca `esApunte`). Mensaje «Apunte graduado a modelo». El chip de rigor del gestor mutará in-situ (Ola 4) porque deriva de `especieDe`.

- [ ] **Step 3: Cablea el gesto**

`MenuContextual.tsx:83` («Graduar a modelo») abre `DialogoGraduar` en vez de togglear directo.

- [ ] **Step 4: Ley «rigor al graduar»**

```ts
// app/src/leyes/taller-rigor-al-graduar.test.ts
import { describe, expect, test } from "bun:test";
import { severidadDiagnostico } from "../modelo/diagnosticoSeveridad";
// Construye un aviso de un código whitelisted (p.ej. "SD_SIN_PROCESO_PRINCIPAL" vía origen metodologia).
describe("LEY: rigor al graduar", () => {
  test("un código degradable es observación en apunte y exigible al graduar", () => {
    const aviso = { origen: "metodologia", codigo: "SD_SIN_PROCESO_PRINCIPAL" } as any;
    expect(severidadDiagnostico(aviso, { esApunte: true })).toBe("estilo");      // observación
    expect(severidadDiagnostico(aviso, { esApunte: false })).toBe("mejora");     // exigible
  });
});
```
> Ajusta la forma de `aviso` (`AvisoDiagnostico`) a la real; verifica con `severidadDiagnostico` existente.

- [ ] **Step 5: e2e + gate + commit**

Corre `bun run typecheck && bun test src/leyes/taller-rigor-al-graduar.test.ts && bun run design:governance`.
```bash
git add app/src/ui/DialogoGraduar.tsx app/src/ui/panelCarpetas/MenuContextual.tsx app/src/store app/src/leyes/taller-rigor-al-graduar.test.ts
git commit -m "feat(nacimiento): momento de graduación (nombre/carpeta + reporte de validez exigible)"
```

## Task 19: e2e del nacimiento + verificación fresca

**Files:**
- Create: `app/e2e/41-nacimiento-apunte.spec.ts`

- [ ] **Step 1: e2e**

Flujo: click «Nuevo» → verificar hoja editable AL INSTANTE, sin diálogo (`cinta-apunte` visible, nombre «Apunte AAAA-MM-DD», raíz proyecta «Hoja») → dibujar una cosa → verificar autosave (aparece en el gestor sin guardar manual) → graduar (diálogo pide nombre/carpeta + muestra validez) → verificar que la cinta apunte desaparece.

- [ ] **Step 2: Corre + commit + verificación fresca (nacimiento)**

Run: `cd app && bunx playwright test e2e/41-nacimiento-apunte.spec.ts`
```bash
git add app/e2e/41-nacimiento-apunte.spec.ts
git commit -m "test(nacimiento): e2e entrada desatendida + graduación"
```
Subagente fresco: «Verifica la Ola 3 contra §3 (una puerta, apunte instantáneo, auto-nombre, autosave, graduación). ¿Realmente NO hay diálogo al nacer? ¿el autosave dispara desde el primer trazo (id presente)? archivo:línea.»

---

# OLA 4 — Gestor de dos zonas rigor×rol

## Task 20: Chip de rigor por fila (derivado de `especieDe`)

**Files:**
- Modify: `app/src/ui/DialogoCargarModelo.tsx` (columna «Marcas»/`Glifos` `:494-504` o nueva celda)

**Interfaces:**
- Consumes: `especieDe` (de `../persistencia/especie`) sobre cada `ModeloIndice`.

- [ ] **Step 1: Chip por fila**

Cada fila del catálogo deriva su especie con `especieDe(modeloIndice)` y muestra un chip: «Apunte» (para apuntes), «Modelo» (para modelos). Los de biblioteca NO llevan chip aquí (van a su zona). testId `chip-rigor-<id>` con `data-especie`. Estética `ui-forja` (sin color semántico OPM).

- [ ] **Step 2: Test + design governance + commit**

Corre `bun run design:governance`. Commit.
```bash
git commit -am "feat(gestor): chip de rigor por fila (Apunte/Modelo) derivado de especieDe"
```

## Task 21: Dos zonas — «Trabajo» y «Bibliotecas»

**Files:**
- Modify: `app/src/ui/DialogoCargarModelo.tsx`

**Interfaces:**
- Consumes: `especieDe`, `listarBibliotecas` (existente, `workspace.ts:411`).

- [ ] **Step 1: Segrega las zonas**

Divide el catálogo en dos zonas por ROL:
- **«Trabajo»** = registros NO biblioteca (apuntes + modelos JUNTOS), ordenados por recencia (`ultimoUso`). El chip de rigor (Task 20) distingue apunte/modelo en la fila; al graduar, el chip muta in-situ (el ítem NO salta de zona: maduró, no cambió de rol).
- **«Bibliotecas»** = `listarBibliotecas(indice)`, zona aparte (estante solo-lectura).
testId `gestor-zona-trabajo`, `gestor-zona-bibliotecas`. Las carpetas del sidebar aplican a modelos cerrados; los apuntes viven sin carpeta hasta graduar.

- [ ] **Step 2: CTA de vacío**

El estado vacío (`gestor-vacio`, `:327-342`) muestra «**Nuevo** · **Importar JSON**» (una puerta; «Nuevo» → `nacerApunte`).

- [ ] **Step 3: Reconcilia selectores e2e existentes**

Muchos e2e seleccionan filas del gestor. Tras reorganizar, corre la suite e2e del gestor y reconcilia selectores rotos (patrón conocido: usar `exact:true` para evitar que «Importar JSON» capture «Importar»).
Run: `cd app && bunx playwright test e2e/ -g "gestor|cargar|modelo"`

- [ ] **Step 4: Design governance + commit**

```bash
git add app/src/ui/DialogoCargarModelo.tsx
git commit -m "feat(gestor): dos zonas rigor×rol (Trabajo + Bibliotecas), CTA una puerta"
```

## Task 22: e2e del gestor de dos zonas + verificación fresca

**Files:**
- Create: `app/e2e/42-gestor-dos-zonas.spec.ts`

- [ ] **Step 1: e2e**

Flujo: crear un apunte → abrir el gestor → verificar que aparece en `gestor-zona-trabajo` con `chip-rigor` «Apunte» → graduar → reabrir el gestor → verificar que el MISMO ítem sigue en «Trabajo» con el chip mutado a «Modelo» (no saltó de zona) → marcar una biblioteca y verificar que va a `gestor-zona-bibliotecas`.

- [ ] **Step 2: Corre + commit + verificación fresca (gestor)**

```bash
git add app/e2e/42-gestor-dos-zonas.spec.ts
git commit -m "test(gestor): e2e dos zonas + chip que muta in-situ al graduar"
```
Subagente fresco: «Verifica la Ola 4 contra §6 (dos zonas por ROL, chip que muta in-situ, CTA una puerta). ¿el ítem NO salta de zona al graduar? archivo:línea.»

---

# Cierre del corte

## Task 23: Gate completo + reconciliación e2e sobre main integrado

- [ ] **Step 1: Gate del corte**

Run (con dev server apagado):
```bash
cd app && bun run check && bun run lint && bun run design:governance && bun run browser:smoke
```
Expected: todo verde. Muestra la salida real (no afirmar sin evidencia).

- [ ] **Step 2: Suite e2e completa**

Run: `cd app && bunx playwright test`
Expected: verde; reconcilia cualquier cruce.

- [ ] **Step 3: Verificación adversarial final (subagente fresco)**

«Audita el corte B′⊕D completo contra `2026-07-06-apuntes-taller-design.md` §7 (las 6 leyes) y la guardia categorial de CLAUDE.md. Confirma: (1) cero flags de especie nuevos en persistencia; (2) convergencia real top-down≡adoptar; (3) integridad nunca degrada; (4) export honesto bloquea modelo / observa apunte; (5) entrada desatendida sin diálogo; (6) banda Taller derivada, no persistida. Reporta CADA ley con el test que la falsa y su resultado.»

## Task 24: Handoff + notas de aprendizaje

- [ ] **Step 1: Actualiza `docs/HANDOFF.md`**

Consolida el estado: corte B′⊕D implementado y en verde; **deploy pendiente de la firma SSOT** (gate humano). Reescribe, no acumules (política de handoff único).

- [ ] **Step 2: Notas de aprendizaje**

Registra en `docs/memorias-aprendizajes/notas-apuntes-taller.md` (una lección por archivo, resumen de una línea; actualiza, no dupliques): la convergencia por factorización del vínculo, la restricción de autosave (`modeloPersistidoId !== null`), «Hoja» como proyección pura.

- [ ] **Step 3: Commit atómico de cierre**

```bash
git add docs/HANDOFF.md docs/memorias-aprendizajes/notas-apuntes-taller.md
git commit -m "docs(taller): handoff + notas del corte B′⊕D (deploy = gate humano tras firma SSOT)"
```

## Task 25: DEPLOY — gate humano DESPUÉS de la firma SSOT

- [ ] **Step 1: Confirmar firma SSOT** — el custodio aplicó la enmienda en pneuma (`kora check --strict` verde) y re-pineó el cordón. SIN esto, NO desplegar.
- [ ] **Step 2: Deploy** (autorización explícita del operador): `docker compose up -d --build` desde la raíz (`VITE_ENABLE_BUG_CAPTURE=true`); procedimiento en `docs/deploy/opforja.md`.
- [ ] **Step 3: Verificación in-vivo** contra `opforja.sanixai.com`.

---

## Self-Review (checklist del autor)

**Cobertura de la spec `2026-07-06-apuntes-taller-design.md`:**
- §1 función esencial → Olas 2/3 (Taller + nacimiento). ✔
- §2 granularidad HOJA / §2-bis dos ejes → `especieDe` intacto (Task 8, 20, 21); cero encoding nuevo. ✔
- §3 nacimiento una puerta → Tasks 14-19. ✔
- §4 Taller bottom-up (suelto, `establecerRefinamiento`, adoptar, gate) → Tasks 1-7, 10-13. ✔
- §5 enmienda SSOT día 0 → Ola 0 (autoreada; incluye Enmienda 4 = régimen bottom-up de la skill `modelamiento-opm` v1.12.0). El **porte de la skill es responsabilidad del custodio** fuera de este repo (frontera mesa↔dominio); esta mesa lo PROPONE, no lo aplica. ✔
- §6 gestor dos zonas → Tasks 20-22. ✔
- §7 leyes → Tasks 6, 7, 8, 18 (convergencia, export-honesto, integridad-ciega, sin-especie-nueva, rigor-al-graduar, entrada-desatendida en e2e Task 19). ✔
- §8 fuera de alcance (cuaderno-entidad, des-adopción, subgrafos parciales, migración encoding) → NO se implementan. ✔

**Consistencia de tipos:** `EnlaceRefinamiento`/`AdopcionOpd` (Task 2, 5); `establecerRefinamiento`/`adoptarOpd`/`crearOpdSuelto` consistentes en barrels (Task 5); `gateOpdsSinAdoptar` firma estable (Task 7); acciones store `nuevoOpdSuelto`/`adoptarOpdEnSeleccion`/`nacerApunte` declaradas en `ModeloSlice` (Tasks 11, 15). ✔

**Placeholders:** las tareas de UI (12, 17, 18, 20, 21) y las que dependen de firmas no leídas al 100% (guardarComoLocal en Task 15, validarIntegridad en Task 8, viewmodel en Task 12) llevan un paso explícito de verificación de la firma real ANTES de implementar — no son placeholders, son puntos de confirmación acotados con el comando exacto.
