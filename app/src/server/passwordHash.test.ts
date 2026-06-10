import { describe, expect, test } from "bun:test";
import { hashPassword, verifyPassword } from "./passwordHash";

describe("passwordHash — scrypt (auth v1)", () => {
  test("hash y verificación correcta", () => {
    const hash = hashPassword("secreto-claro");
    expect(hash.startsWith("scrypt$")).toBe(true);
    expect(verifyPassword("secreto-claro", hash)).toBe(true);
  });

  test("password incorrecta no verifica", () => {
    const hash = hashPassword("secreto-claro");
    expect(verifyPassword("otra", hash)).toBe(false);
  });

  test("salt aleatoria: dos hashes de la misma password difieren", () => {
    expect(hashPassword("x")).not.toBe(hashPassword("x"));
  });

  test("hash malformado no verifica ni lanza", () => {
    expect(verifyPassword("x", "")).toBe(false);
    expect(verifyPassword("x", "argon2$lo-que-sea")).toBe(false);
    expect(verifyPassword("x", "scrypt$16384$8$1$basura")).toBe(false);
  });
});
