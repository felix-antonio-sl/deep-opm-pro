import { describe, expect, test } from "bun:test";
import {
  baseWitnessMatches,
  autosaveTimestampAfter,
  createBaseWitness,
  decodeBaseWitness,
  encodeBaseWitness,
  type ObservedBaseState,
} from "./baseWitness";

const savedJson = '{"formato":"deep-opm-pro.modelo.v0","modelo":{"id":"m1","nombre":"Guardado"}}';
const autosaveJson = '{"formato":"deep-opm-pro.modelo.v0","modelo":{"id":"m1","nombre":"Autosave"}}';

function observed(autosave: ObservedBaseState["autosave"] = null): ObservedBaseState {
  return {
    modelId: "m1",
    saved: {
      revision: 3,
      updatedAt: "2026-07-17T10:00:00.000Z",
      json: savedJson,
    },
    autosave,
  };
}

describe("mesa base witness", () => {
  test("round-trip opaco conserva ambas fuentes y la elección", () => {
    const state = observed({
      createdAt: "2026-07-17T10:00:05.000Z",
      json: autosaveJson,
    });
    const witness = createBaseWitness(state);
    const encoded = encodeBaseWitness(witness);

    expect(encoded.startsWith("mesa-v1.")).toBe(true);
    expect(decodeBaseWitness(encoded)).toEqual(witness);
    expect(witness.source).toBe("autosave");
    expect(baseWitnessMatches(witness, state)).toBe(true);
  });

  test("representa explícitamente la ausencia de autosave", () => {
    const state = observed();
    const witness = createBaseWitness(state);

    expect(witness.autosave).toBeNull();
    expect(witness.source).toBe("saved");
    expect(baseWitnessMatches(witness, state)).toBe(true);
  });

  test("detecta cambio de revisión, aparición y cambio de autosave aunque conserve timestamp", () => {
    const state = observed();
    const witness = createBaseWitness(state);

    expect(baseWitnessMatches(witness, {
      ...state,
      saved: { ...state.saved, revision: 4 },
    })).toBe(false);
    expect(baseWitnessMatches(witness, observed({
      createdAt: "2026-07-17T09:59:00.000Z",
      json: autosaveJson,
    }))).toBe(false);

    const stateWithAutosave = observed({
      createdAt: "2026-07-17T10:00:05.000Z",
      json: autosaveJson,
    });
    const autosaveWitness = createBaseWitness(stateWithAutosave);
    expect(baseWitnessMatches(autosaveWitness, observed({
      createdAt: "2026-07-17T10:00:05.000Z",
      json: `${autosaveJson} `,
    }))).toBe(false);
  });

  test("no confía en una fuente declarada que contradice las marcas observadas", () => {
    const state = observed({
      createdAt: "2026-07-17T10:00:05.000Z",
      json: autosaveJson,
    });
    const witness = { ...createBaseWitness(state), source: "saved" as const };

    expect(baseWitnessMatches(witness, state)).toBe(false);
  });

  test("rechaza tokens malformados o de otra versión", () => {
    expect(decodeBaseWitness("no-es-un-testigo")).toBeNull();
    const wrongVersion = `mesa-v1.${Buffer.from(JSON.stringify({ version: 2 }), "utf8").toString("base64url")}`;
    expect(decodeBaseWitness(wrongVersion)).toBeNull();
    const canonical = encodeBaseWitness(createBaseWitness(observed()));
    expect(decodeBaseWitness(`${canonical}!`)).toBeNull();
    expect(decodeBaseWitness(`${canonical}.`)).toBeNull();
  });

  test("la marca del autosave atómico queda estrictamente después del guardado", () => {
    const savedUpdatedAt = "2026-07-17T10:00:00.000Z";
    const createdAt = autosaveTimestampAfter(savedUpdatedAt);

    expect(createdAt).toBe("2026-07-17T10:00:00.001Z");
    expect(createBaseWitness(observed({ createdAt, json: autosaveJson })).source).toBe("autosave");
  });

  test("elige la fuente por instante real aunque las zonas horarias inviertan el orden textual", () => {
    const witness = createBaseWitness({
      ...observed(),
      saved: {
        ...observed().saved,
        updatedAt: "2026-07-17T12:00:00.000+02:00",
      },
      autosave: {
        // 10:00:00.001Z es posterior a 12:00+02:00 (=10:00Z),
        // aunque su representación textual comience por una hora menor.
        createdAt: "2026-07-17T10:00:00.001Z",
        json: autosaveJson,
      },
    });

    expect(witness.source).toBe("autosave");
  });
});
