// Módulo de autoría headless dominio-agnóstico: construir un Modelo OPM programáticamente (DSL
// imperativo re-entrante) y emitir un bundle validado (deep-opm-pro.modelo.v0) + OPL + reporte,
// con layout canónico (orden de ejecución → bandas, fishbone/peine, contorno-al-contenido,
// colocación adaptiva anti-aireado) y política de canon (bloquean solo avisos estructurales).
//
// Uso:
//   import { crearAutor, emitirBundle } from ".../autoria";
//   const a = crearAutor({ id: "x", nombre: "X" });
//   const { entidad, opd, estados, ver, enlazar, refDescomp } = a;
//   entidad("p", "proceso", "Hacer café", "fisica", "sistemica"); ...
//   const { json, opl, reporte } = emitirBundle(a, { descripcion: ["..."] });
export { crearAutor } from "./dsl";
export type { Autor } from "./dsl";
export { emitirBundle } from "./bundle";
// W4.2 — compilador proto-modelo → Modelo.
export { compilarProto } from "./compilar/compilador";
export type {
  ResultadoCompilacion,
  Ledger,
  DestinoLedger,
  ResumenLedger,
  OpcionesCompilacion,
} from "./compilar/compilador";
export { leerEstructura } from "./compilar/estructura";
export type { PlanEstructura, NodoOpd } from "./compilar/estructura";
export { aplicarLayoutCompleto, LAYOUT } from "./layout";
export type {
  EntKey,
  OpdKey,
  ExtremoEntrada,
  OpcionesEnlace,
  OpcionesAutor,
  OpcionesBundle,
  ResultadoBundle,
} from "./tipos";
