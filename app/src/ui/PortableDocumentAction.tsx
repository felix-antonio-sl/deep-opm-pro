import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";
import type { Modelo } from "../modelo/tipos";
import { Dialogo, DialogoAccion } from "./Dialogo";
import { tokens } from "./tokens";

const PortablePanel = lazy(() => import("./portable/PortablePackagePanel").then((module) => ({ default: module.PortablePackagePanel })));

export function PortableDocumentAction({ model, opdId }: { model: Modelo; opdId: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setOpen(true)} style={{ border: 0, padding: "5px 12px", background: "transparent",
      color: tokens.colors.inkMid, font: `12px ${tokens.typography.serif}`, cursor: "pointer" }}>Paquete portátil…</button>
    {open ? <Dialogo open title="Paquete portátil" size="lg" onCancel={() => setOpen(false)}
      actions={<DialogoAccion onClick={() => setOpen(false)}>Cerrar</DialogoAccion>}>
      <Suspense fallback={<p role="status">Abriendo la exportación…</p>}>
        <PortablePanel model={model} selectedOpdId={opdId} />
      </Suspense>
    </Dialogo> : null}
  </>;
}
