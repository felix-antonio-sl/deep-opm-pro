import { fixtureTodos } from "../src/modelo/fixtures.ts";

const PERFILES = [
  { id: "chico", preferidos: ["Comprar Pan", "Cafetera Domestica"] },
  { id: "mediano", preferidos: ["Ejemplo organizacional", "Logistica de Envios"] },
  { id: "grande", preferidos: ["Prestamo Bibliotecario", "OnStar System"] },
];

export function fixturesUxRegresion() {
  const disponibles = fixtureTodos();
  return PERFILES.map((perfil, index) => {
    const fixture = perfil.preferidos
      .map((nombre) => disponibles.find((item) => item.modelo.nombre === nombre))
      .find(Boolean) ?? disponibles[index] ?? disponibles[0];
    return {
      id: perfil.id,
      nombre: fixture.modelo.nombre,
      descripcion: fixture.descripcion,
      payload: {
        formato: "deep-opm-pro.modelo.v0",
        modelo: fixture.modelo,
      },
    };
  });
}

export function fixtureUxPorId(id) {
  return fixturesUxRegresion().find((fixture) => fixture.id === id);
}

if (import.meta.main) {
  console.log(JSON.stringify(fixturesUxRegresion().map((fixture) => ({
    id: fixture.id,
    nombre: fixture.nombre,
    opds: Object.keys(fixture.payload.modelo.opds).length,
    entidades: Object.keys(fixture.payload.modelo.entidades).length,
    enlaces: Object.keys(fixture.payload.modelo.enlaces).length,
  })), null, 2));
}
