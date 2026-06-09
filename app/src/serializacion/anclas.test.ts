// W5.1 — round-trip, validación, byte-identidad y clave estable de AnclaNormativa.
// Las cuatro leyes operacionalizadas por el diseño v0 (diseno-ancla-normativa.md (retirado 2a83c1c5, en git) §7):
//   L8 — toda ancla del proto se compila a AnclaNormativa enumerable (round-trip nivel-ENLACE).
//   L8 negativo — target irresoluble ⇒ rechazo con diagnóstico (no exclusión silenciosa).
//   L9 — la clave estable sobrevive a la edición de la nota (id-explícito vs hash).
//   byte-identidad — un modelo SIN anclas serializa exactamente igual que antes del cambio.
import { describe, expect, test } from "bun:test";
import { crearAutor, emitirBundle } from "../autoria";
import { enumerarAnclas, anclaPorClaveProto, anclasDeTarget } from "../modelo/anclasNormativas";
import type { AnclaNormativa, Modelo } from "../modelo/tipos";
import { exportarModelo, hidratarModelo } from "./json";

/**
 * Modelo sintético equivalente a la frontera clínico↔programa de HODOM: dos procesos
 * (Atender episodio clínico / Operar programa) con un enlace de frontera entre ellos,
 * anclado a `DS art. 17` (la exclusión que separa el episodio del programa). La redacción
 * exacta de la etiqueta se fija al migrar el proto real (nota de honestidad dov-dori, §7).
 */
function construirFronteraClinicoPrograma() {
  const a = crearAutor({ id: "hodom-sint", nombre: "HODOM frontera (sintético)" });
  a.entidad("clinico", "proceso", "Atender episodio clínico", "fisica", "sistemica");
  a.entidad("programa", "proceso", "Operar programa", "fisica", "sistemica");
  a.entidad("frontera", "objeto", "Frontera clínico-programa", "informacional", "sistemica");
  a.opd("sd0", "SD0 - HODOM", null, 0);
  a.ver("sd0", "clinico", 0, 0);
  a.ver("sd0", "programa", 400, 0);
  a.ver("sd0", "frontera", 200, 200);
  // Enlace de frontera: el objeto-frontera es instrumento del proceso de programa.
  const enlaceFronteraId = a.enlazar("sd0", "frontera", "programa", "instrumento");
  if (!enlaceFronteraId) throw new Error("fixture: el enlace de frontera no se creó");
  return { a, enlaceFronteraId };
}

describe("AnclaNormativa — round-trip nivel-ENLACE (L8)", () => {
  test("un ancla nivel-enlace round-tripea estructurada y queda enumerable", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla(
      { enlace: enlaceFronteraId },
      {
        claveProto: "frontera-art17",
        estado: "pendiente-ratificacion",
        referencias: [{ norma: "DS", articulos: ["17"] }],
        nota: "exclusión que separa el episodio clínico del programa",
        ratificacion: { nivelAutoridad: "dt-seremi-legal", estadoRatificacion: "pendiente" },
      },
    );

    const json1 = exportarModelo(a.modelo);
    const hidratado = hidratarModelo(json1);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;

    // El ancla viaja en el bundle y queda enumerable.
    const anclas = enumerarAnclas(hidratado.value);
    expect(anclas.length).toBe(1);
    const ancla = anclas[0]!;
    expect(ancla.claveProto).toBe("frontera-art17");
    expect(ancla.target).toEqual({ tipo: "enlace", id: enlaceFronteraId });
    expect(ancla.estado).toBe("pendiente-ratificacion");
    expect(ancla.referencias).toEqual([{ norma: "DS", articulos: ["17"] }]);
    expect(ancla.ratificacion?.nivelAutoridad).toBe("dt-seremi-legal");
    expect(ancla.ratificacion?.estadoRatificacion).toBe("pendiente");

    // Helpers de resolución por target/clave.
    expect(anclaPorClaveProto(hidratado.value, "frontera-art17")?.id).toBe(ancla.id);
    expect(anclasDeTarget(hidratado.value, "enlace", enlaceFronteraId).length).toBe(1);

    // Exportar → hidratar → exportar es estable (round-trip idempotente sobre el JSON canónico).
    // (json1 viene del modelo crudo del DSL, pre-normalización; el canónico es el ya hidratado.)
    const jsonCanonico = exportarModelo(hidratado.value);
    const rehidratado = hidratarModelo(jsonCanonico);
    expect(rehidratado.ok).toBe(true);
    if (!rehidratado.ok) return;
    expect(exportarModelo(rehidratado.value)).toBe(jsonCanonico);
    // El ancla sobrevive el segundo round-trip idéntica.
    expect(enumerarAnclas(rehidratado.value)).toEqual(enumerarAnclas(hidratado.value));
  });

  test("anclas a los cuatro niveles (entidad/enlace/opd/modelo) round-tripean", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla({ entidad: "clinico" }, { claveProto: "anc-clinico", referencias: [{ norma: "Ley 20.584" }] });
    a.ancla({ enlace: enlaceFronteraId }, { claveProto: "anc-enlace" });
    a.ancla({ opd: "sd0" }, { claveProto: "anc-opd", nota: "OPD raíz" });
    a.ancla({ modelo: true }, { claveProto: "anc-modelo", referencias: [{ norma: "DS 1/2022" }] });

    const hidratado = hidratarModelo(exportarModelo(a.modelo));
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    const tipos = enumerarAnclas(hidratado.value).map((x) => x.target.tipo).sort();
    expect(tipos).toEqual(["enlace", "entidad", "modelo", "opd"]);
  });

  test("emitirBundle propaga las anclas a través del round-trip canónico del bundle", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla(
      { enlace: enlaceFronteraId },
      { claveProto: "frontera-art17", estado: "pendiente-ratificacion", referencias: [{ norma: "DS", articulos: ["17"] }], nivelAutoridad: "dt-seremi-legal" },
    );
    const { json, reporte } = emitirBundle(a, { lanzarEnError: false });
    const hidratado = hidratarModelo(json);
    expect(hidratado.ok).toBe(true);
    if (!hidratado.ok) return;
    expect(enumerarAnclas(hidratado.value).length).toBe(1);
    // El nivelAutoridad suelto armó una ratificación pendiente (azúcar C1).
    expect(enumerarAnclas(hidratado.value)[0]!.ratificacion?.estadoRatificacion).toBe("pendiente");
    expect(reporte).toContain("Anclas normativas");
  });
});

describe("AnclaNormativa — fixture negativo L8 (target irresoluble = rechazo)", () => {
  test("un ancla con enlace inexistente es RECHAZADA con diagnóstico (no exclusión silenciosa)", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla({ enlace: enlaceFronteraId }, { claveProto: "frontera-art17", referencias: [{ norma: "DS", articulos: ["17"] }] });

    // Corrompe el target a un id de enlace que no existe (simula extracción que perdió su ancla).
    const json = exportarModelo(a.modelo);
    const parsed = JSON.parse(json);
    const anclaId = Object.keys(parsed.modelo.anclasNormativas)[0]!;
    parsed.modelo.anclasNormativas[anclaId].target = { tipo: "enlace", id: "enlace-fantasma" };

    const hidratado = hidratarModelo(JSON.stringify(parsed));
    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("irresoluble");
  });

  test("ancla sin claveProto es rechazada (la clave estable es obligatoria)", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla({ enlace: enlaceFronteraId }, { claveProto: "k", referencias: [{ norma: "DS" }] });
    const parsed = JSON.parse(exportarModelo(a.modelo));
    const anclaId = Object.keys(parsed.modelo.anclasNormativas)[0]!;
    delete parsed.modelo.anclasNormativas[anclaId].claveProto;
    const hidratado = hidratarModelo(JSON.stringify(parsed));
    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("claveProto");
  });

  test("ratificado-con-fuente sin fuente es rechazado (C1: hecho confirmado exige fuente)", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla(
      { enlace: enlaceFronteraId },
      { claveProto: "frontera-art17", estado: "pendiente-ratificacion", ratificacion: { nivelAutoridad: "mesa", estadoRatificacion: "anotado-en-mesa" } },
    );
    const parsed = JSON.parse(exportarModelo(a.modelo));
    const anclaId = Object.keys(parsed.modelo.anclasNormativas)[0]!;
    parsed.modelo.anclasNormativas[anclaId].ratificacion.estadoRatificacion = "ratificado-con-fuente";
    const hidratado = hidratarModelo(JSON.stringify(parsed));
    expect(hidratado.ok).toBe(false);
    if (hidratado.ok) return;
    expect(hidratado.error).toContain("fuente");
  });

  test("el DSL rechaza claveProto duplicada", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla({ enlace: enlaceFronteraId }, { claveProto: "dup" });
    expect(() => a.ancla({ entidad: "clinico" }, { claveProto: "dup" })).toThrow(/duplicada/);
  });

  test("el DSL rechaza enlace inexistente en el target en construcción", () => {
    const { a } = construirFronteraClinicoPrograma();
    expect(() => a.ancla({ enlace: "e-9999" }, { claveProto: "x" })).toThrow(/inexistente/);
  });
});

describe("AnclaNormativa — clave estable sobrevive a la edición de la nota (L9 preparatorio)", () => {
  test("editar `nota` NO cambia `claveProto` — por qué se eligió id-explícito sobre hash", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla(
      { enlace: enlaceFronteraId },
      { claveProto: "frontera-art17", estado: "pendiente-ratificacion", nota: "borrador inicial", referencias: [{ norma: "DS", articulos: ["17"] }], nivelAutoridad: "dt-seremi-legal" },
    );

    // Snapshot de la clave antes de editar la nota.
    const antes = hidratarModelo(exportarModelo(a.modelo));
    expect(antes.ok).toBe(true);
    if (!antes.ok) return;
    const claveAntes = anclaPorClaveProto(antes.value, "frontera-art17")!.claveProto;

    // Edita la nota (caso NORMAL del ciclo de ratificación, no el borde).
    const editado = editarNotaAncla(antes.value, "frontera-art17", "redacción ratificada en mesa R17");

    const despues = hidratarModelo(exportarModelo(editado));
    expect(despues.ok).toBe(true);
    if (!despues.ok) return;
    const anclaDespues = anclaPorClaveProto(despues.value, "frontera-art17");

    // La clave SOBREVIVE: el match L9 (skill re-elicita por claveProto) sigue funcionando.
    expect(anclaDespues).toBeDefined();
    expect(anclaDespues!.claveProto).toBe(claveAntes);
    expect(anclaDespues!.nota).toBe("redacción ratificada en mesa R17");

    // Demostración del contraejemplo: un hash de contenido SÍ cambiaría con la nota.
    const hashAntes = hashContenido(antes.value.anclasNormativas![anclaDespues!.id] ?? anclaPorClaveProto(antes.value, "frontera-art17")!);
    const hashDespues = hashContenido(anclaDespues!);
    expect(hashDespues).not.toBe(hashAntes); // el hash rompería el match — por eso NO es la identidad.
  });

  test("ciclo L9: pendiente → ratificado-con-fuente → vigente, sin reaparecer pendiente", () => {
    const { a, enlaceFronteraId } = construirFronteraClinicoPrograma();
    a.ancla(
      { enlace: enlaceFronteraId },
      { claveProto: "frontera-art17", estado: "pendiente-ratificacion", referencias: [{ norma: "DS", articulos: ["17"] }], nivelAutoridad: "dt-seremi-legal" },
    );
    const m0 = hidratarModelo(exportarModelo(a.modelo));
    expect(m0.ok).toBe(true);
    if (!m0.ok) return;

    // La skill re-elicita: el ancla matchea por claveProto y transiciona a `vigente`.
    const reElicitado = reElicitarAncla(m0.value, "frontera-art17", { fuente: "Acta R17", responsable: "DT" });

    const m1 = hidratarModelo(exportarModelo(reElicitado));
    expect(m1.ok).toBe(true);
    if (!m1.ok) return;
    const ancla = anclaPorClaveProto(m1.value, "frontera-art17")!;
    // assert L9: NO reaparece pendiente.
    expect(ancla.estado).toBe("vigente");
    expect(ancla.ratificacion?.estadoRatificacion).toBe("ratificado-con-fuente");
    expect(ancla.ratificacion?.fuente).toBe("Acta R17");
  });
});

describe("AnclaNormativa — byte-identidad de serialización", () => {
  test("un modelo SIN anclas produce el mismo JSON canónico que antes del cambio (campo ausente)", () => {
    const { a } = construirFronteraClinicoPrograma();
    // Canónico = export → hidratar → export (el modelo crudo del DSL es pre-normalización).
    const baseHidratado = hidratarModelo(exportarModelo(a.modelo));
    expect(baseHidratado.ok).toBe(true);
    if (!baseHidratado.ok) return;
    const jsonCanonico = exportarModelo(baseHidratado.value);

    // Sin ninguna llamada a `ancla()`: el campo `anclasNormativas` debe estar AUSENTE.
    expect("anclasNormativas" in JSON.parse(jsonCanonico).modelo).toBe(false);
    expect(baseHidratado.value.anclasNormativas).toBeUndefined();

    // Re-hidratar y reexportar: byte-idéntico (la extensión ausente no agrega ninguna clave).
    const rehidratado = hidratarModelo(jsonCanonico);
    expect(rehidratado.ok).toBe(true);
    if (!rehidratado.ok) return;
    expect(rehidratado.value.anclasNormativas).toBeUndefined();
    expect(exportarModelo(rehidratado.value)).toBe(jsonCanonico);
  });

  test("anclasNormativas: {} vacío NO se emite (byte-identidad sobre colección vacía)", () => {
    const { a } = construirFronteraClinicoPrograma();
    const baseHidratado = hidratarModelo(exportarModelo(a.modelo));
    expect(baseHidratado.ok).toBe(true);
    if (!baseHidratado.ok) return;
    const jsonSin = exportarModelo(baseHidratado.value);
    // Inyecta una colección vacía sobre el modelo canónico y verifica que la serialización la descarta.
    const conVacio: Modelo = { ...baseHidratado.value, anclasNormativas: {} };
    const jsonVacio = exportarModelo(conVacio);
    expect(jsonVacio).toBe(jsonSin);
  });
});

// --- Helpers de simulación del ciclo (la app NO ratifica; aquí se simula la skill) ---------

function editarNotaAncla(modelo: Modelo, claveProto: string, nota: string): Modelo {
  const ancla = anclaPorClaveProto(modelo, claveProto)!;
  return {
    ...modelo,
    anclasNormativas: { ...modelo.anclasNormativas, [ancla.id]: { ...ancla, nota } },
  };
}

function reElicitarAncla(modelo: Modelo, claveProto: string, datos: { fuente: string; responsable: string }): Modelo {
  const ancla = anclaPorClaveProto(modelo, claveProto)!;
  const actualizada: AnclaNormativa = {
    ...ancla,
    estado: "vigente",
    ratificacion: {
      ...ancla.ratificacion!,
      estadoRatificacion: "ratificado-con-fuente",
      fuente: datos.fuente,
      responsable: datos.responsable,
      ratificadoEn: "2026-06-04",
    },
  };
  return {
    ...modelo,
    anclasNormativas: { ...modelo.anclasNormativas, [ancla.id]: actualizada },
  };
}

/** Hash de contenido ilustrativo (lo que NO se usa como identidad). Demuestra la fragilidad ante edición. */
function hashContenido(ancla: AnclaNormativa): string {
  return JSON.stringify({ target: ancla.target, referencias: ancla.referencias ?? [], nota: ancla.nota ?? "" });
}
