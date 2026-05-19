import { describe, expect, test } from "bun:test";
import { admiteSegmentsTool, connectorAdmiteSegmentsTool, routerAdmiteSegmentsTool } from "./toolsEnlace";

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

  test("deshabilita Segments cuando el connector no es lineal simple", () => {
    expect(connectorAdmiteSegmentsTool(undefined)).toBe(true);
    expect(connectorAdmiteSegmentsTool(null)).toBe(true);
    expect(connectorAdmiteSegmentsTool("straight")).toBe(true);
    expect(connectorAdmiteSegmentsTool({ name: "straight" })).toBe(true);

    expect(connectorAdmiteSegmentsTool("jumpover")).toBe(false);
    expect(connectorAdmiteSegmentsTool({ name: "jumpover", args: { type: "arc", size: 8 } })).toBe(false);
    expect(admiteSegmentsTool(undefined, { name: "jumpover" })).toBe(false);
    expect(admiteSegmentsTool({ name: "manhattan" }, { name: "straight" })).toBe(false);
    expect(admiteSegmentsTool(undefined, { name: "straight" })).toBe(true);
  });
});
