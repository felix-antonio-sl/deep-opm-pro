import { describe, expect, test } from "bun:test";
import { createBaseWitness } from "../mesa/baseWitness";
import { crearTestigoBaseBrowser } from "./baseWitnessBrowser";

describe("crearTestigoBaseBrowser", () => {
  test("produce el mismo testigo que el servidor para saved y autosave", async () => {
    const state = {
      modelId: "m-1",
      saved: {
        revision: 4,
        updatedAt: "2026-07-18T03:00:00.000Z",
        json: "{\"saved\":true}",
      },
      autosave: {
        createdAt: "2026-07-18T03:00:01.000Z",
        json: "{\"autosave\":true}",
      },
    };

    await expect(crearTestigoBaseBrowser(state)).resolves.toEqual(
      createBaseWitness(state),
    );
  });
});
