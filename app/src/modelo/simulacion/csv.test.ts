import { expect, test } from "bun:test";
import { filasSimulacionACsv } from "./csv";

test("encabezado + filas en orden de columnas", () => {
  const csv = filasSimulacionACsv([{ a: 1, b: 2 }, { a: 3, b: 4 }], ["a", "b"]);
  expect(csv).toBe("a,b\n1,2\n3,4");
});

test("celda undefined → vacía", () => {
  expect(filasSimulacionACsv([{ a: undefined }], ["a"])).toBe("a\n");
});

test("escapa comas, comillas y saltos", () => {
  const csv = filasSimulacionACsv([{ a: 'x,"y"\nz' }], ["a"]);
  expect(csv).toBe('a\n"x,""y""\nz"');
});

test("sin filas → solo encabezado", () => {
  expect(filasSimulacionACsv([], ["a", "b"])).toBe("a,b");
});
