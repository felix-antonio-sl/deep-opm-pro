import { describe, expect, test, beforeEach } from "bun:test";
import { store } from "../../store";

/**
 * Tests del slice modelo/acciones-colision — Brecha B3/B4:
 * "reuso vs renombrar ante colisión de nombre".
 *
 * Verifica que:
 *   - `confirmarNombreNuevaCosa` detecta colisión y suspende en `colisionPendiente`
 *     (B3: contexto "creacion").
 *   - `renombrarSeleccionada` detecta colisión y suspende en `colisionPendiente`
 *     (B4: contexto "rename").
 *   - Los resolvedores: reutilizar (crea aparición existente), renombrar (nuevo nombre),
 *     cancelar (elimina provisional o descarta).
 *   - Tipos incompatibles (objeto vs proceso) no ofrecen reuso.
 *
 * NOTA IMPORTANTE: La ruta B3 sólo se activa mediante `crearEntidadEnCanvas`
 * (que establece `nuevaCosaPendiente`), NO mediante `crearObjetoDemo` (que usa
 * el flujo del inspector con `solicitarFocusNombre`).
 */

const POS1 = { x: 100, y: 100 };
const POS2 = { x: 200, y: 200 };

function resetStore() {
  store.getState().nuevoModelo();
}

/** Crea una entidad en canvas y le asigna nombre; devuelve el id de la entidad. */
function crearConNombre(tipo: "objeto" | "proceso", nombre: string, pos = POS1): string {
  store.getState().crearEntidadEnCanvas(tipo, pos);
  const pendiente = store.getState().nuevaCosaPendiente;
  if (!pendiente) throw new Error(`No hay nuevaCosaPendiente tras crearEntidadEnCanvas(${tipo})`);
  store.getState().confirmarNombreNuevaCosa(nombre);
  // Si confirmar detectó colisión suspende — en ese caso devolvemos el id provisional.
  const cp = store.getState().colisionPendiente;
  if (cp) {
    return cp.contexto === "creacion" ? cp.entidadProvId : pendiente.entidadId;
  }
  return pendiente.entidadId;
}

describe("B3: colisión en confirmarNombreNuevaCosa (creacion)", () => {
  beforeEach(() => { resetStore(); });

  test("sin colisión — aplica nombre normalmente", () => {
    store.getState().crearEntidadEnCanvas("objeto", POS1);
    const pendiente = store.getState().nuevaCosaPendiente!;
    store.getState().confirmarNombreNuevaCosa("SensorUnicoAAA");
    expect(store.getState().modelo.entidades[pendiente.entidadId]?.nombre).toBe("SensorUnicoAAA");
    expect(store.getState().colisionPendiente).toBeNull();
    expect(store.getState().nuevaCosaPendiente).toBeNull();
  });

  test("con colisión mismoTipo — suspende y crea colisionPendiente con contexto creacion", () => {
    // Crear primer objeto con nombre conocido (sin colisión).
    store.getState().crearEntidadEnCanvas("objeto", POS1);
    const pendiente1 = store.getState().nuevaCosaPendiente!;
    store.getState().confirmarNombreNuevaCosa("Bomba");
    expect(store.getState().colisionPendiente).toBeNull(); // no colisiona la primera vez

    // Crear segundo objeto con el mismo nombre — debe detectar colisión.
    store.getState().crearEntidadEnCanvas("objeto", POS2);
    expect(store.getState().nuevaCosaPendiente).not.toBeNull();
    store.getState().confirmarNombreNuevaCosa("Bomba");

    const cp = store.getState().colisionPendiente;
    expect(cp).not.toBeNull();
    expect(cp?.contexto).toBe("creacion");
    expect(cp?.colision.nombre).toBe("Bomba");
    expect(cp?.colision.mismoTipo).toBe(true);
    // No hay nuevaCosaPendiente abierto (fue limpiado).
    expect(store.getState().nuevaCosaPendiente).toBeNull();
    // El primero fue correctamente nombrado.
    expect(store.getState().modelo.entidades[pendiente1.entidadId]?.nombre).toBe("Bomba");
  });

  test("con colisión tipo distinto — mismoTipo es false", () => {
    // Crear objeto "Bomba".
    store.getState().crearEntidadEnCanvas("objeto", POS1);
    store.getState().confirmarNombreNuevaCosa("Bomba");
    // Crear proceso "Bomba" — tipo distinto.
    store.getState().crearEntidadEnCanvas("proceso", POS2);
    expect(store.getState().nuevaCosaPendiente).not.toBeNull();
    store.getState().confirmarNombreNuevaCosa("Bomba");

    const cp = store.getState().colisionPendiente;
    expect(cp?.contexto).toBe("creacion");
    expect(cp?.colision.mismoTipo).toBe(false);
  });

  test("resolverColisionReutilizar — elimina provisional y crea apariencia de existente", () => {
    // Crear primer objeto "Bomba".
    store.getState().crearEntidadEnCanvas("objeto", POS1);
    store.getState().confirmarNombreNuevaCosa("Bomba");
    const entidadesAntes = Object.keys(store.getState().modelo.entidades).length;

    // Crear segundo objeto "Bomba" — suspende.
    store.getState().crearEntidadEnCanvas("objeto", POS2);
    store.getState().confirmarNombreNuevaCosa("Bomba");
    const cp = store.getState().colisionPendiente;
    expect(cp).not.toBeNull();

    // Resolver: reutilizar.
    store.getState().resolverColisionReutilizar();
    expect(store.getState().colisionPendiente).toBeNull();
    // La entidad provisional fue eliminada: no debe haber más entidades que antes.
    const entidadesDespues = Object.keys(store.getState().modelo.entidades).length;
    expect(entidadesDespues).toBe(entidadesAntes);
  });

  test("resolverColisionRenombrar — aplica nuevo nombre a la provisional", () => {
    // Crear primer objeto "Bomba".
    store.getState().crearEntidadEnCanvas("objeto", POS1);
    store.getState().confirmarNombreNuevaCosa("Bomba");

    // Crear segundo objeto "Bomba" — suspende.
    store.getState().crearEntidadEnCanvas("objeto", POS2);
    store.getState().confirmarNombreNuevaCosa("Bomba");
    const cp = store.getState().colisionPendiente;
    const entidadProvId = (cp as { entidadProvId: string }).entidadProvId;

    // Resolver: renombrar con nuevo nombre.
    store.getState().resolverColisionRenombrar("BombaB");
    expect(store.getState().colisionPendiente).toBeNull();
    expect(store.getState().modelo.entidades[entidadProvId]?.nombre).toBe("BombaB");
  });

  test("resolverColisionCancelar — elimina la provisional y cierra el diálogo", () => {
    // Crear primer objeto "Bomba".
    store.getState().crearEntidadEnCanvas("objeto", POS1);
    store.getState().confirmarNombreNuevaCosa("Bomba");
    const entidadesAntes = Object.keys(store.getState().modelo.entidades).length;

    // Crear segundo objeto "Bomba" — suspende.
    store.getState().crearEntidadEnCanvas("objeto", POS2);
    store.getState().confirmarNombreNuevaCosa("Bomba");
    expect(store.getState().colisionPendiente).not.toBeNull();

    // Resolver: cancelar.
    store.getState().resolverColisionCancelar();
    expect(store.getState().colisionPendiente).toBeNull();
    // La provisional fue eliminada.
    const entidadesDespues = Object.keys(store.getState().modelo.entidades).length;
    expect(entidadesDespues).toBe(entidadesAntes);
  });
});

describe("B4: colisión en renombrarSeleccionada (rename)", () => {
  beforeEach(() => { resetStore(); });

  test("sin colisión — renombra normalmente", () => {
    store.getState().crearEntidadEnCanvas("objeto", POS1);
    const id = store.getState().nuevaCosaPendiente!.entidadId;
    store.getState().confirmarNombreNuevaCosa("InicialNombre");
    // Ahora renombramos a un nombre único.
    store.getState().setSeleccion([id]);
    store.getState().renombrarSeleccionada("NombreUnicoZZZ");
    expect(store.getState().modelo.entidades[id]?.nombre).toBe("NombreUnicoZZZ");
    expect(store.getState().colisionPendiente).toBeNull();
  });

  test("con colisión — suspende en colisionPendiente con contexto rename", () => {
    // Crear dos objetos con nombres distintos.
    const id1 = crearConNombre("objeto", "Alpha", POS1);
    store.getState().crearEntidadEnCanvas("objeto", POS2);
    const id2 = store.getState().nuevaCosaPendiente!.entidadId;
    store.getState().confirmarNombreNuevaCosa("Beta");

    // Intentar renombrar Beta → Alpha.
    store.getState().setSeleccion([id2]);
    store.getState().renombrarSeleccionada("Alpha");

    const cp = store.getState().colisionPendiente;
    expect(cp).not.toBeNull();
    expect(cp?.contexto).toBe("rename");
    expect(cp?.colision.nombre).toBe("Alpha");
    // Beta no fue renombrado.
    expect(store.getState().modelo.entidades[id2]?.nombre).toBe("Beta");
    // El primero sigue siendo Alpha.
    expect(store.getState().modelo.entidades[id1]?.nombre).toBe("Alpha");
  });

  test("resolverColisionRenombrar desde rename — aplica el nuevo nombre", () => {
    crearConNombre("objeto", "Alpha", POS1);

    store.getState().crearEntidadEnCanvas("objeto", POS2);
    const id2 = store.getState().nuevaCosaPendiente!.entidadId;
    store.getState().confirmarNombreNuevaCosa("Beta");

    store.getState().setSeleccion([id2]);
    store.getState().renombrarSeleccionada("Alpha"); // colisiona
    expect(store.getState().colisionPendiente?.contexto).toBe("rename");

    store.getState().resolverColisionRenombrar("AlphaX");
    expect(store.getState().colisionPendiente).toBeNull();
    expect(store.getState().modelo.entidades[id2]?.nombre).toBe("AlphaX");
  });

  test("resolverColisionCancelar desde rename — no renombra y limpia el diálogo", () => {
    crearConNombre("objeto", "Alpha", POS1);

    store.getState().crearEntidadEnCanvas("objeto", POS2);
    const id2 = store.getState().nuevaCosaPendiente!.entidadId;
    store.getState().confirmarNombreNuevaCosa("Beta");

    store.getState().setSeleccion([id2]);
    store.getState().renombrarSeleccionada("Alpha"); // colisiona

    store.getState().resolverColisionCancelar();
    expect(store.getState().colisionPendiente).toBeNull();
    // Beta sigue igual.
    expect(store.getState().modelo.entidades[id2]?.nombre).toBe("Beta");
  });

  test("no ofrece reuso en contexto rename — resolverColisionReutilizar es no-op", () => {
    crearConNombre("objeto", "Alpha", POS1);

    store.getState().crearEntidadEnCanvas("objeto", POS2);
    const id2 = store.getState().nuevaCosaPendiente!.entidadId;
    store.getState().confirmarNombreNuevaCosa("Beta");

    store.getState().setSeleccion([id2]);
    store.getState().renombrarSeleccionada("Alpha"); // colisiona
    expect(store.getState().colisionPendiente?.contexto).toBe("rename");

    // Llamar reutilizar en un contexto rename — debe limpiar sin crear nada.
    store.getState().resolverColisionReutilizar();
    expect(store.getState().colisionPendiente).toBeNull();
    // Beta no fue fusionado con Alpha.
    expect(store.getState().modelo.entidades[id2]?.nombre).toBe("Beta");
  });
});
