// Fixture de dominio DEMO (cafetera doméstica) — NO HODOM. Prueba que la capacidad de autoría es
// dominio-agnóstica: un sistema cualquiera con SD raíz + in-zoom de proceso (secuencia con AND-join).
import { crearAutor, type Autor } from "../index";

export function construirCafetera(): Autor {
  const a = crearAutor({ id: "cafetera", nombre: "Cafetera doméstica" });
  const { entidad, opd, estados, ver, enlazar, refDescomp } = a;

  // Entidades
  entidad("hacer-cafe", "proceso", "Hacer café", "fisica", "sistemica");
  entidad("barista", "objeto", "Barista", "fisica", "ambiental");
  entidad("agua", "objeto", "Agua", "fisica", "ambiental");
  estados("agua", ["fría", "caliente"], "fría");
  entidad("cafe-grano", "objeto", "Café en grano", "fisica", "ambiental");
  entidad("cafe-molido", "objeto", "Café molido", "fisica", "sistemica");
  entidad("cafe", "objeto", "Café", "fisica", "sistemica");
  // Subprocesos del in-zoom
  entidad("calentar", "proceso", "Calentar agua", "fisica", "sistemica");
  entidad("moler", "proceso", "Moler café", "fisica", "sistemica");
  entidad("extraer", "proceso", "Extraer", "fisica", "sistemica");

  // OPDs
  opd("sd0", "SD0 - Hacer café", null, 0);
  opd("inzoom", "Hacer café (in-zoom)", "sd0", 10);
  refDescomp("hacer-cafe", "inzoom");

  // SD raíz plano: proceso central + objetos por rol.
  ver("sd0", "hacer-cafe", 0, 0);
  ver("sd0", "barista", 0, 0);
  ver("sd0", "agua", 0, 0);
  ver("sd0", "cafe-grano", 0, 0);
  ver("sd0", "cafe", 0, 0);
  enlazar("sd0", "barista", "hacer-cafe", "agente");
  enlazar("sd0", "agua", "hacer-cafe", "consumo");
  enlazar("sd0", "cafe-grano", "hacer-cafe", "consumo");
  enlazar("sd0", "hacer-cafe", "cafe", "resultado");

  // In-zoom: contorno + 3 subprocesos (Calentar ∥ Moler → Extraer, AND-join).
  ver("inzoom", "hacer-cafe", 0, 0); // contorno
  ver("inzoom", "calentar", 0, 0);
  ver("inzoom", "moler", 0, 0);
  ver("inzoom", "extraer", 0, 0);
  ver("inzoom", "barista", 0, 0);
  ver("inzoom", "agua", 0, 0);
  ver("inzoom", "cafe-grano", 0, 0);
  ver("inzoom", "cafe-molido", 0, 0);
  ver("inzoom", "cafe", 0, 0);
  // Partes (agregación contorno→sub, se consume como contención interna).
  enlazar("inzoom", "hacer-cafe", "calentar", "agregacion");
  enlazar("inzoom", "hacer-cafe", "moler", "agregacion");
  enlazar("inzoom", "hacer-cafe", "extraer", "agregacion");
  // Orden: Calentar y Moler en paralelo, convergen (AND-join) en Extraer.
  enlazar("inzoom", "calentar", "extraer", "invocacion");
  enlazar("inzoom", "moler", "extraer", "invocacion");
  // Frontera distribuida a los subprocesos.
  enlazar("inzoom", "barista", "calentar", "agente");
  enlazar("inzoom", "calentar", "agua", "efecto", { entrada: "fría", salida: "caliente" });
  enlazar("inzoom", "moler", "cafe-molido", "resultado");
  enlazar("inzoom", "cafe-grano", "moler", "consumo");
  enlazar("inzoom", "agua", "extraer", "consumo");
  enlazar("inzoom", "cafe-molido", "extraer", "consumo");
  enlazar("inzoom", "extraer", "cafe", "resultado");

  return a;
}
