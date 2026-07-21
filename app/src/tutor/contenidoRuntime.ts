/** Entry point diferido del corpus. Mantenerlo separado del barrel síncrono
 * evita que Vite incorpore contenidos y fuentes al bundle principal. */
export { resolveTutorContent } from "./contenidos";
export { resolveTutorSourceRef } from "./fuentes";
