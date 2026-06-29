// B5 (gesto de anclar) — gobernanza de apertura de biblioteca.
//
// Spec §2(d): abrir una biblioteca la pone en solo-lectura global; «Editar
// biblioteca» (tras una confirmación) la desbloquea sin dejar de ser
// biblioteca; al re-abrirla vuelve a solo-lectura. Estos tests falsan la
// transición de estado del store (el motor del banner) sin depender del
// backend, y fijan el COPY del diálogo contra deriva textual.
import { describe, expect, test } from "bun:test";
import { store } from "../store";
import { COPY_ADVERTENCIA_BIBLIOTECA } from "../ui/CintaBiblioteca";

describe("B5 — gobernanza de apertura de biblioteca", () => {
  test("abrir biblioteca → solo-lectura; editar → editable; re-abrir → solo-lectura", () => {
    // Abrir una biblioteca: solo-lectura global + cinta de modo encendida.
    store.getState().gobernarAperturaBiblioteca(true);
    expect(store.getState().readOnly).toBe(true);
    expect(store.getState().esBibliotecaAbierta).toBe(true);

    // «Editar biblioteca» (confirmado) desbloquea, pero la cinta sigue
    // mostrándose porque el modelo NO deja de ser una biblioteca.
    store.getState().activarReadOnly(false);
    expect(store.getState().readOnly).toBe(false);
    expect(store.getState().esBibliotecaAbierta).toBe(true);

    // Re-abrir la biblioteca vuelve a solo-lectura.
    store.getState().gobernarAperturaBiblioteca(true);
    expect(store.getState().readOnly).toBe(true);
    expect(store.getState().esBibliotecaAbierta).toBe(true);

    // Abrir un modelo NO biblioteca limpia ambos (la cinta no se fuga).
    store.getState().gobernarAperturaBiblioteca(false);
    expect(store.getState().readOnly).toBe(false);
    expect(store.getState().esBibliotecaAbierta).toBe(false);
  });

  test("el COPY del diálogo de advertencia es exactamente el del spec §2(d)", () => {
    expect(COPY_ADVERTENCIA_BIBLIOTECA).toBe(
      "Editar esta biblioteca puede hacer divergir los modelos anclados a ella. " +
        "La próxima vez que se abran, verán un aviso de cambio. No se rompe nada: solo se enteran.",
    );
  });
});
