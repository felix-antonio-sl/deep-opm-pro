import type { Id, Modelo, OntologiaOrganizacional, Resultado, TerminoOntologia } from "./tipos";

export interface EvaluacionNombreOntologia {
  modo: OntologiaOrganizacional["modo"];
  entrada: string;
  nombre: string;
  canonico?: string;
  accion: "none" | "suggest" | "enforce";
  termino?: TerminoOntologia;
}

export function evaluarNombreOntologia(modelo: Modelo, nombre: string): EvaluacionNombreOntologia {
  const entrada = nombre.trim();
  const ontologia = modelo.ontologia;
  if (!ontologia || ontologia.modo === "none" || !entrada) {
    return { modo: ontologia?.modo ?? "none", entrada: nombre, nombre: entrada, accion: "none" };
  }

  const termino = buscarTerminoOntologia(ontologia, entrada);
  if (!termino) return { modo: ontologia.modo, entrada: nombre, nombre: entrada, accion: "none" };
  if (claveOntologia(termino.canonico) === claveOntologia(entrada)) {
    return { modo: ontologia.modo, entrada: nombre, nombre: termino.canonico, canonico: termino.canonico, accion: "none", termino };
  }

  if (ontologia.modo === "suggest") {
    return { modo: ontologia.modo, entrada: nombre, nombre: entrada, canonico: termino.canonico, accion: "suggest", termino };
  }
  return { modo: ontologia.modo, entrada: nombre, nombre: termino.canonico, canonico: termino.canonico, accion: "enforce", termino };
}

export function nombreReforzadoPorOntologia(modelo: Modelo, nombre: string): string {
  const evaluacion = evaluarNombreOntologia(modelo, nombre);
  return evaluacion.accion === "enforce" ? evaluacion.nombre : nombre.trim();
}

export function definirOntologiaOrganizacional(
  modelo: Modelo,
  ontologia: OntologiaOrganizacional | undefined,
): Resultado<Modelo> {
  const normalizada = normalizarOntologia(ontologia);
  if (!normalizada.ok) return normalizada;
  if (!normalizada.value) {
    const { ontologia: _ontologia, ...resto } = modelo;
    return { ok: true, value: resto };
  }
  return { ok: true, value: { ...modelo, ontologia: normalizada.value } };
}

export function normalizarOntologia(value: OntologiaOrganizacional | undefined): Resultado<OntologiaOrganizacional | undefined> {
  if (!value) return { ok: true, value: undefined };
  if (value.modo !== "none" && value.modo !== "suggest" && value.modo !== "enforce") {
    return { ok: false, error: "Modo de ontología inválido" };
  }
  const terminos: TerminoOntologia[] = [];
  const canonicos = new Set<string>();
  const alias = new Set<string>();
  for (const termino of value.terminos ?? []) {
    const canonico = termino.canonico.trim();
    if (!canonico) continue;
    const claveCanonica = claveOntologia(canonico);
    if (canonicos.has(claveCanonica) || alias.has(claveCanonica)) {
      return { ok: false, error: `Término de ontología duplicado: ${canonico}` };
    }
    canonicos.add(claveCanonica);
    const sinonimos = [...new Set((termino.sinonimos ?? []).map((item) => item.trim()).filter(Boolean))]
      .filter((item) => claveOntologia(item) !== claveCanonica);
    for (const sinonimo of sinonimos) {
      const clave = claveOntologia(sinonimo);
      if (canonicos.has(clave) || alias.has(clave)) {
        return { ok: false, error: `Sinónimo de ontología duplicado: ${sinonimo}` };
      }
      alias.add(clave);
    }
    terminos.push({
      canonico,
      ...(sinonimos.length > 0 ? { sinonimos } : {}),
      ...(termino.descripcion?.trim() ? { descripcion: termino.descripcion.trim() } : {}),
    });
  }
  return { ok: true, value: { modo: value.modo, terminos } };
}

function buscarTerminoOntologia(ontologia: OntologiaOrganizacional, nombre: string): TerminoOntologia | null {
  const clave = claveOntologia(nombre);
  return ontologia.terminos.find((termino) =>
    claveOntologia(termino.canonico) === clave ||
    (termino.sinonimos ?? []).some((sinonimo) => claveOntologia(sinonimo) === clave)
  ) ?? null;
}

function claveOntologia(value: string): Id {
  return value.trim().normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("es-CL");
}
