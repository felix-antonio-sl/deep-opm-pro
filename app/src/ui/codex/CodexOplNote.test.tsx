// Ronda Codex v1 · L1 — estructura de CodexOplNote.
//
// Sin DOM-render library: se invoca el componente como funcion y se inspecciona
// el arbol de vnodes resultante (numero + cuerpo + slot de marginalia).
import { describe, expect, test } from "bun:test";
import { GLIFO_WARN } from "./glifos";
import { tokens } from "../tokens";
import { CodexOplNote } from "./CodexOplNote";

type Vnode = { type: unknown; props: Record<string, unknown> };

function hijos(v: Vnode): Vnode[] {
  const c = v.props.children;
  return (Array.isArray(c) ? c : [c]).filter((x): x is Vnode => !!x && typeof x === "object");
}

describe("CodexOplNote · estructura L1", () => {
  test("numero atenuado cuando la numeracion esta oculta", () => {
    const v = CodexOplNote({ numero: "01", cuerpo: "x", numeracionVisible: false }) as unknown as Vnode;
    const fila = hijos(v)[0]!;
    const numero = hijos(fila)[0]! as Vnode & { props: { style: Record<string, unknown> } };
    expect(numero.props.style.opacity).toBe(0);
  });

  test("seleccionada: numero crimson + cuerpo con subrayado UI", () => {
    const v = CodexOplNote({ numero: "05", cuerpo: "x", seleccionada: true }) as unknown as Vnode;
    const fila = hijos(v)[0]!;
    const [numero, cuerpo] = hijos(fila) as Array<Vnode & { props: { style: Record<string, unknown> } }>;
    expect(numero!.props.style.color).toBe(tokens.colors.crimson);
    expect(cuerpo!.props.style.borderBottom).toBe(`${tokens.stroke.hairline}px solid ${tokens.colors.crimson}`);
  });

  test("sin marginalia: no se renderiza el slot de validacion", () => {
    const v = CodexOplNote({ numero: "01", cuerpo: "x" }) as unknown as Vnode;
    // El segundo hijo es `null` cuando no hay marginalia.
    expect((v.props.children as unknown[])[1]).toBeNull();
  });

  test("marginalia alta: kicker △ en oliva canon (no crimson)", () => {
    const v = CodexOplNote({
      numero: "12",
      cuerpo: "x",
      marginalia: "beneficiarios externos al sistema",
      severidad: "alta",
    }) as unknown as Vnode;
    const nota = (v.props.children as Vnode[])[1] as Vnode & { props: { style: Record<string, unknown> } };
    expect(nota.props.style.color).toBe(tokens.colors.opm.state);
    const kicker = hijos(nota)[0]! as Vnode & { props: { children: unknown } };
    const texto = (Array.isArray(kicker.props.children) ? kicker.props.children : [kicker.props.children]).join("");
    expect(texto).toContain(GLIFO_WARN);
    expect(texto).toContain("ALTA");
  });

  test("marginalia critica: kicker en crimson UI", () => {
    const v = CodexOplNote({
      numero: "03",
      cuerpo: "x",
      marginalia: "objeto huerfano",
      severidad: "critica",
    }) as unknown as Vnode;
    const nota = (v.props.children as Vnode[])[1] as Vnode & { props: { style: Record<string, unknown> } };
    expect(nota.props.style.color).toBe(tokens.colors.crimson);
  });
});
