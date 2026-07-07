// Hook de plegado de sección: estado abierto/cerrado con memoria de sesión
// (vía `seccionColapso`) + suscripción al evento «abrir» para expandir-al-navegar.
// Lo comparten `FichaSeccion` (secciones de primer nivel) y `SeccionDisclosure`
// (sub-bloques internos de Semántica). La lógica pura vive en `seccionColapso.ts`.
import { useEffect, useRef, useState } from "preact/hooks";
import { EVENTO_ABRIR_COLAPSO, escribirAbierta, leerAbierta } from "./seccionColapso";

export function useColapso(colapsoId: string, defaultAbierta: boolean): readonly [boolean, () => void] {
  const [abierta, setAbierta] = useState(() => leerAbierta(colapsoId, defaultAbierta));

  // Reactivo: si el default pasa de cerrado→abierto en vivo (p. ej. la sección
  // «Anclaje» cuando el drift aparece tras el montaje), la sección se abre sola
  // para mostrar lo que ahora importa. Solo en la transición, no en cada render
  // con default=true (respeta un cierre manual posterior).
  const defaultPrevio = useRef(defaultAbierta);
  useEffect(() => {
    if (defaultAbierta && !defaultPrevio.current) {
      setAbierta(true);
      escribirAbierta(colapsoId, true);
    }
    defaultPrevio.current = defaultAbierta;
  }, [defaultAbierta, colapsoId]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onAbrir = (evento: Event) => {
      const key = (evento as CustomEvent<{ key?: string }>).detail?.key;
      if (key === colapsoId) setAbierta(true);
    };
    window.addEventListener(EVENTO_ABRIR_COLAPSO, onAbrir as EventListener);
    return () => window.removeEventListener(EVENTO_ABRIR_COLAPSO, onAbrir as EventListener);
  }, [colapsoId]);

  const alternar = () => setAbierta((previa) => {
    const proxima = !previa;
    escribirAbierta(colapsoId, proxima);
    return proxima;
  });

  return [abierta, alternar] as const;
}
