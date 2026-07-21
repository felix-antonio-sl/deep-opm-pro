import { useEffect, useState } from "preact/hooks";
import type { ResolvedTutorContent } from "../tutor/contenidos";
import type { KnowledgeLens, TutorContentId } from "../tutor/tipos";

interface TutorContentView {
  contenido: ResolvedTutorContent;
  fuentes: readonly string[];
  referencias: readonly TutorSourceView[];
}

export interface TutorSourceView {
  key: string;
  title: string;
  href: string;
}

let tutorModulePromise: Promise<typeof import("../tutor/contenidoRuntime")> | null = null;

/** Carga diferida del corpus local. La política de decisión permanece síncrona;
 * este hook solo resuelve copy y rutas cuando una superficie ya tiene dueño. */
export function useTutorContent(
  contentId: TutorContentId | null,
  lenses: readonly KnowledgeLens[] = [],
): TutorContentView | null {
  const [view, setView] = useState<TutorContentView | null>(null);
  const lensKey = lenses.join("|");

  useEffect(() => {
    let activo = true;
    if (!contentId) {
      setView(null);
      return () => { activo = false; };
    }
    setView(null);
    tutorModulePromise ??= import("../tutor/contenidoRuntime");
    void tutorModulePromise.then((tutor) => {
      if (!activo) return;
      const activeLenses = lensKey === ""
        ? []
        : lensKey.split("|") as KnowledgeLens[];
      const contenido = tutor.resolveTutorContent(contentId, activeLenses);
      if (!contenido) {
        setView(null);
        return;
      }
      const refs = [
        ...contenido.sourceRefs,
        ...contenido.lensDetails.flatMap((detalle) => detalle.sourceRefs),
      ];
      const referencias = refs.flatMap((ref) => {
        const fuente = tutor.resolveTutorSourceRef(ref);
        return fuente ? [{
          key: `${ref.sourceId}:${ref.anchor}`,
          title: fuente.source.title,
          href: fuente.href,
        }] : [];
      });
      const unicas = referencias.filter((referencia, index, todas) =>
        todas.findIndex((otra) => otra.key === referencia.key) === index
      );
      setView({
        contenido,
        referencias: unicas,
        fuentes: unicas.map((referencia) => `${referencia.title} · ${referencia.href}`),
      });
    });
    return () => { activo = false; };
  }, [contentId, lensKey]);

  return view;
}
