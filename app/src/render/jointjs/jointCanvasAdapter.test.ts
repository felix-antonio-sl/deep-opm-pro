import { describe, expect, test } from "bun:test";
import { crearJointCellNamespace } from "./jointCanvasAdapter";

describe("jointCanvasAdapter", () => {
  test("registra shapes JointJS OSS y shapes OPM custom en el mismo namespace", () => {
    const namespace = crearJointCellNamespace() as { standard?: unknown; opm?: { AbanicoArc?: unknown } };

    expect(namespace.standard).toBeTruthy();
    expect(namespace.opm?.AbanicoArc).toBeTruthy();
  });
});
