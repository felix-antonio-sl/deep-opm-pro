import { describe, expect, test } from "bun:test";
import { toolbarStyle } from "./toolbarStyles";

describe("toolbarStyle clusters", () => {
  test("expone estilos para clusters por intención", () => {
    expect(toolbarStyle.cluster.display).toBe("inline-flex");
    expect(toolbarStyle.cluster.alignItems).toBe("center");
    expect(toolbarStyle.cluster.gap).toBe("4px");
    expect(toolbarStyle.clusterLabel.position).toBe("absolute");
    expect(toolbarStyle.clusterLabel.overflow).toBe("hidden");
  });
});
