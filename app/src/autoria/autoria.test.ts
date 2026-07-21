import { describe, expect, test } from "bun:test";
import { crearAutor, emitirBundle } from "./index";
import { construirCafetera } from "./_fixtures/cafetera";
import { hidratarModelo } from "../serializacion/json";

describe("autoría DSL", () => {
  test("construye un modelo y resuelve claves a ids", () => {
    const a = crearAutor({ id: "x", nombre: "X" });
    a.entidad("p", "proceso", "Hacer algo", "fisica", "sistemica");
    a.entidad("o", "objeto", "Cosa", "fisica", "ambiental");
    a.estados("o", ["a", "b"], "a");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "p", 0, 0);
    a.ver("sd0", "o", 0, 0);
    a.enlazar("sd0", "p", "o", "efecto", { entrada: "a", salida: "b" });
    expect(Object.keys(a.modelo.entidades).length).toBe(2);
    expect(Object.keys(a.modelo.estados).length).toBe(2);
    expect(Object.keys(a.modelo.enlaces).length).toBe(1);
    expect(Object.keys(a.modelo.opds).length).toBe(1);
    expect(a.modelo.opdRaizId).toBe("opd-sd0");
    expect(a.id("p")).toBe("p-p");
  });

  test("es re-entrante: dos autores no comparten estado", () => {
    const a = crearAutor();
    const b = crearAutor();
    a.entidad("x", "objeto", "X", "fisica", "ambiental");
    expect(Object.keys(a.modelo.entidades).length).toBe(1);
    expect(Object.keys(b.modelo.entidades).length).toBe(0);
  });

  test("lanza ante clave de entidad/estado no registrada", () => {
    const a = crearAutor();
    a.opd("sd0", "SD0", null);
    expect(() => a.ver("sd0", "no-existe", 0, 0)).toThrow(/Entidad no registrada/);
  });

  test("la agregación contorno→subproceso se consume como contención interna (no enlace)", () => {
    const a = construirCafetera();
    // 3 agregaciones contorno→sub fueron consumidas; no aparecen como enlaces.
    expect(a.internosInzoom.get("opd-inzoom")?.size).toBe(3);
  });
});

describe("autoría DSL — métodos y validación (cobertura)", () => {
  test("estados rechaza un único estado (deep-opm-pro exige ≥2)", () => {
    const a = crearAutor();
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    expect(() => a.estados("o", ["solo"])).toThrow(/unico estado/);
  });

  test("estados preserva designación dual inicial+final en el mismo estado", () => {
    const a = crearAutor();
    a.entidad("o", "objeto", "Reservorio", "fisica", "sistemica");
    a.estados("o", ["vacío", "lleno"], "vacío", "vacío");

    const estado = a.modelo.estados[a.idEstado("o", "vacío")]!;

    expect(estado.esInicial).toBe(true);
    expect(estado.esFinal).toBe(true);
    expect(estado.designaciones).toEqual(["inicial", "final"]);
  });

  test("idOpd e idEstado lanzan ante clave no registrada", () => {
    const a = crearAutor();
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    expect(() => a.idOpd("no-existe")).toThrow(/OPD no registrado/);
    expect(() => a.idEstado("o", "fantasma")).toThrow(/Estado no registrado/);
  });

  test("atributo declara value slot; atributoEstados solo marca esAtributo", () => {
    const a = crearAutor();
    const attrId = a.atributo("color", "Color");
    const attrEstId = a.atributoEstados("nivel", "Nivel");
    expect(a.modelo.entidades[attrId]!.esAtributo).toBe(true);
    expect(a.modelo.entidades[attrId]!.valorSlot).toBeDefined();
    expect(a.modelo.entidades[attrEstId]!.esAtributo).toBe(true);
    expect(a.modelo.entidades[attrEstId]!.valorSlot).toBeUndefined();
  });

  test("extremo resuelve entidad y estado", () => {
    const a = crearAutor();
    a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
    a.estados("o", ["a", "b"], "a");
    expect(a.extremo("o")).toEqual({ kind: "entidad", id: a.id("o") });
    expect(a.extremo({ entidad: "o", estado: "a" })).toEqual({ kind: "estado", id: a.idEstado("o", "a") });
  });

  test("refDespliegue / refDespliegueExh / refDespliegueGen registran el modo correcto", () => {
    const modo = (fn: "refDespliegue" | "refDespliegueExh" | "refDespliegueGen") => {
      const a = crearAutor();
      a.entidad("o", "objeto", "Cosa", "fisica", "sistemica");
      a.opd("d1", "D1", null);
      a[fn]("o", "d1");
      return a.modelo.entidades[a.id("o")]!.refinamientos?.despliegue?.modo;
    };
    expect(modo("refDespliegue")).toBe("agregacion");
    expect(modo("refDespliegueExh")).toBe("exhibicion");
    expect(modo("refDespliegueGen")).toBe("generalizacion");
  });

  test("aparecerEnlace agrega una aparición sin duplicar el enlace lógico", () => {
    const a = crearAutor();
    a.entidad("herramienta", "objeto", "Herramienta", "fisica", "ambiental");
    a.entidad("proceso", "proceso", "Procesar", "fisica", "sistemica");
    a.opd("sd0", "SD0", null);
    a.opd("vista", "Vista", "sd0");
    for (const opd of ["sd0", "vista"]) {
      a.ver(opd, "herramienta", 0, 0);
      a.ver(opd, "proceso", 0, 0);
    }

    const enlaceId = a.enlazar("sd0", "herramienta", "proceso", "instrumento");
    if (!enlaceId) throw new Error("La prueba esperaba un enlace instrumento");
    const aparicionId = a.aparecerEnlace("vista", "herramienta", "proceso", "instrumento");
    const repetidaId = a.aparecerEnlace("vista", "herramienta", "proceso", "instrumento");

    expect(enlaceId).toBe("e-1");
    expect(Object.keys(a.modelo.enlaces)).toHaveLength(1);
    expect(aparicionId).toBe(repetidaId);
    expect(a.modelo.opds["opd-vista"]!.enlaces[aparicionId]!.enlaceId).toBe(enlaceId);
    expect(Object.values(a.modelo.opds["opd-vista"]!.enlaces).filter((ap) => ap.enlaceId === enlaceId)).toHaveLength(1);
  });

  test("aparecerEnlace y posicionarEtiqueta resuelven extremos de estado por firma", () => {
    const a = crearAutor();
    a.entidad("pedido", "objeto", "Pedido", "fisica", "sistemica");
    a.entidad("aprobar", "proceso", "Aprobar", "fisica", "sistemica");
    a.estados("pedido", ["pendiente", "aprobado"], "pendiente", "aprobado");
    a.opd("sd0", "SD0", null);
    a.opd("vista", "Vista", "sd0");
    for (const opd of ["sd0", "vista"]) {
      a.ver(opd, "pedido", 0, 0);
      a.ver(opd, "aprobar", 0, 0);
    }

    const enlaceId = a.enlazar("sd0", { entidad: "pedido", estado: "pendiente" }, "aprobar", "consumo");
    expect(() => a.posicionarEtiqueta("vista", { entidad: "pedido", estado: "pendiente" }, "aprobar", "consumo", 0.65)).toThrow(/no aparece/);

    const aparicionId = a.aparecerEnlace("vista", { entidad: "pedido", estado: "pendiente" }, "aprobar", "consumo");
    const etiquetaId = a.posicionarEtiqueta("vista", { entidad: "pedido", estado: "pendiente" }, "aprobar", "consumo", 0.6549, {
      offset: { x: 4.444, y: -9.876 },
      angle: 12.3456,
    });

    expect(a.modelo.enlaces[enlaceId!]!.origenId).toEqual({ kind: "estado", id: a.idEstado("pedido", "pendiente") });
    expect(etiquetaId).toBe(aparicionId);
    expect(a.modelo.opds["opd-vista"]!.enlaces[aparicionId]!.labelPositions?.etiqueta).toEqual({
      distance: 0.655,
      offset: { x: 4.444, y: -9.876 },
      angle: 12.346,
    });
  });

  test("aparecerEnlace lanza si la firma no identifica un enlace existente", () => {
    const a = crearAutor();
    a.entidad("herramienta", "objeto", "Herramienta", "fisica", "ambiental");
    a.entidad("proceso", "proceso", "Procesar", "fisica", "sistemica");
    a.opd("sd0", "SD0", null);
    a.ver("sd0", "herramienta", 0, 0);
    a.ver("sd0", "proceso", 0, 0);

    expect(() => a.aparecerEnlace("sd0", "herramienta", "proceso", "instrumento")).toThrow(/no existe enlace/);
  });
});

describe("autoría — emitirBundle (cafetera, dominio NO-HODOM)", () => {
  const bundle = emitirBundle(construirCafetera());

  test("emite sin lanzar: round-trip + contención + canon PASS", () => {
    expect(bundle.conteos.entidades).toBe(9);
    expect(bundle.conteos.opds).toBe(2);
    expect(bundle.conteos.estados).toBe(2);
  });

  test("el JSON es un bundle deep-opm-pro.modelo.v0 válido y re-hidratable", () => {
    const parsed = JSON.parse(bundle.json);
    expect(parsed.formato).toBe("deep-opm-pro.modelo.v0");
    expect(parsed.modelo.opds).toBeDefined();
    // control fuerte (no tautológico): el JSON re-hidrata sin error, no solo parsea.
    const re = hidratarModelo(bundle.json);
    expect(re.ok).toBe(true);
  });

  test("canon sin bloqueantes (0 avisos de severidad error)", () => {
    expect(bundle.avisos.filter((a) => a.severidad === "error").length).toBe(0);
  });

  test("OPL no vacío y nombra el proceso raíz", () => {
    expect(bundle.opl.length).toBeGreaterThan(0);
    expect(bundle.opl).toContain("Hacer café");
  });

  test("cero solapamientos reales en todos los OPDs (consciente de contención)", () => {
    const modelo = JSON.parse(bundle.json).modelo;
    const contiene = (A: any, B: any) =>
      A.x <= B.x && A.y <= B.y && A.x + A.width >= B.x + B.width && A.y + A.height >= B.y + B.height;
    const inter = (a: any, b: any) =>
      a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    let solapes = 0;
    for (const opd of Object.values<any>(modelo.opds)) {
      const aps = Object.values<any>(opd.apariencias);
      for (let i = 0; i < aps.length; i++)
        for (let j = i + 1; j < aps.length; j++) {
          const a = aps[i], b = aps[j];
          if (inter(a, b) && !contiene(a, b) && !contiene(b, a)) solapes++;
        }
    }
    expect(solapes).toBe(0);
  });
});

describe("autoría — emitirBundle respeta la severidad canónica del diagnóstico", () => {
  test("un bloqueo metodológico también bloquea la emisión", () => {
    const autor = crearAutor({ id: "efecto-sin-estados", nombre: "Efecto sin estados" });
    autor.entidad("proceso", "proceso", "Transformar", "fisica", "sistemica");
    autor.entidad("objeto", "objeto", "Resultado", "fisica", "sistemica");
    autor.opd("sd", "SD", null);
    autor.ver("sd", "proceso", 0, 0);
    autor.ver("sd", "objeto", 0, 0);
    autor.enlazar("sd", "proceso", "objeto", "efecto");

    expect(() => emitirBundle(autor)).toThrow(/EFECTO_OBJETO_SIN_ESTADOS/);
  });
});

describe("autoría — emitirBundle: modelo textual derivado (G1, solicitud upstream hd-opm)", () => {
  test("sin la opción: modeloTextual ausente (byte-identidad de consumidores existentes)", () => {
    const bundle = emitirBundle(construirCafetera());
    expect(bundle.modeloTextual).toBeUndefined();
  });

  test("con emitirModeloTextual: emite el modelo textual markdown derivado", () => {
    const bundle = emitirBundle(construirCafetera(), { emitirModeloTextual: true });
    const md = bundle.modeloTextual;
    expect(typeof md).toBe("string");
    // Header explícito: producto derivado, no se edita a mano.
    expect(md).toContain("<!-- DERIVADO — no editar a mano -->");
    // Estructura del modelo textual: encabezado de modelo + secciones por OPD.
    expect(md).toContain("\n# ");
    expect(md).toContain("\n## ");
    // Contenido real: nombra el proceso raíz del dominio cafetera.
    expect(md).toContain("Hacer café");
  });
});
