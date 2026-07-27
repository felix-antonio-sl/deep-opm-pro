import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

describe("TutorDetails · accesibilidad", () => {
  test("los summaries usan un target mínimo de 24 px", () => {
    const source = readFileSync(new URL("./TutorDetails.tsx", import.meta.url), "utf8");
    expect(source.match(/<summary style=\{style\.summary\}>/g)).toHaveLength(2);
    expect(source).toMatch(/summary:\s*\{[\s\S]*?minHeight:\s*24/);
  });
});
