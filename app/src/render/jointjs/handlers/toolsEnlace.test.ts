import { describe, expect, test } from "bun:test";
import { routerAdmiteSegmentsTool } from "./toolsEnlace";

describe("toolsEnlace", () => {
  test("habilita Segments solo con router normal o implicito", () => {
    expect(routerAdmiteSegmentsTool(undefined)).toBe(true);
    expect(routerAdmiteSegmentsTool(null)).toBe(true);
    expect(routerAdmiteSegmentsTool("normal")).toBe(true);
    expect(routerAdmiteSegmentsTool({ name: "normal" })).toBe(true);

    expect(routerAdmiteSegmentsTool("manhattan")).toBe(false);
    expect(routerAdmiteSegmentsTool({ name: "manhattan", args: { padding: 5 } })).toBe(false);
    expect(routerAdmiteSegmentsTool({ name: "orthogonal" })).toBe(false);
    expect(routerAdmiteSegmentsTool({ args: { padding: 5 } })).toBe(false);
  });
});
