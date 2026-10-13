import type { CodigoOpl } from './analizar';
interface LimiteOpl { readonly patron: RegExp; readonly codigo: CodigoOpl; readonly regla: string; readonly registro: string; readonly mensaje?: string; readonly enEtiqueta?: true; readonly prosaCompuesta?: true; }
// D19 (canon spec-OPL R-ENT-3): oración de propiedades genéricas con dos o tres valores que incluye la perseverancia.
const propiedad = '(?:físic[oa]|informacional|ambiental|sistémic[oa]|persistente|transitori[oa])', separador = '(?:, | [ye] )';
const conPerseverancia = (valor: string) => `(?:es (?:${propiedad}${separador})+${valor}(?:${separador}${propiedad})*|es ${valor}(?:${separador}${propiedad})+)\\.$`;
/** Reconocimiento de límites: la prosa no se degrada a un grafo plausible. */
export const NO_CANONIZADAS: readonly LimiteOpl[] = [
    { patron: /\*[^*]+\* es persistente\.|\*\*[^*]+\*\* es transitori[oa]\./u, codigo: 'non-canonical', regla: 'R-OPL-DESC-1', registro: 'B-16' },
    { patron: new RegExp(`^\\*[^*]+\\* ${conPerseverancia('persistente')}|^\\*\\*[^*]+\\*\\* ${conPerseverancia('transitori[oa]')}`, 'u'), codigo: 'non-canonical', regla: 'R-OPL-DESC-1', registro: 'B-16' },
    { patron: /puede ser .*`|\binicia e invoca\b|\bpuede generarse\b|\binvoca .* si .* ocurre\b/u, codigo: 'non-canonical', regla: 'R-MOD-INPUT-2', registro: 'B-16' },
    { patron: /(?:exactamente uno de|al menos uno de).*\bPr=/u, codigo: 'unsupported-canonical', regla: 'R-FAN-PR-1', registro: 'B-16' },
    { patron: /\bPr=|\bFANLOCAL\b|\bfan local\b|\b(?:XOR|OR|AND)\b/u, codigo: 'non-canonical', regla: 'R-CONF-6', registro: 'B-16' },
    { patron: /\binicia .* (?:ocurre si|de lo contrario)|\bestá en .* afecta .* de lo contrario/u, codigo: 'non-canonical', regla: 'AP-28', registro: 'B-16' },
    // Grafía histórica: el canon vigente escribe RF5 con el estado pospuesto al atributo.
    { patron: /\bexhiben? `s` \*\*N\*\*/u, codigo: 'non-canonical', regla: 'R-ZNC-1', registro: 'B-37' }
];
export const NO_SOPORTADAS: readonly LimiteOpl[] = [
    // Son metadatos sólo fuera del hueco de etiqueta de una lista cerrada reconocida.
    { patron: / [ye] más\.$|\bdonde\b|\bordenados por\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-SE-4', registro: 'B-54', enEtiqueta: true },
    { patron: /\bpuede ser\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-RF-5', registro: 'B-01' },
    { patron: /\*\*[^*]+\*\* se descompone en\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-CX-4', registro: 'B-02' },
    { patron: /\b(?:consumen|generan|afectan|requieren|manejan|invocan)\b/u, codigo: 'unsupported-canonical', regla: 'DR-12', registro: 'B-09' },
    // DEC55 ofrece 0/1 y los rangos; «exactamente un» sigue sin literal canónico.
    { patron: /\bexactamente un(?:a)? \*\*/u, codigo: 'unsupported-canonical', regla: 'R-§18-PART-1', registro: 'B-10' },
    { patron: /\bse despliega por (?:partes|especialización|instanciación|rasgos) en\b/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-11' },
    { patron: /^Por ruta .* (?:maneja|requiere|afecta|invoca|cambia)\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-RUTA-2', registro: 'B-07' },
    { patron: /\bes (?:persistente|transitoria|transitorio)\.$/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: new RegExp(`\\b${conPerseverancia('(?:persistente|transitori[oa])')}`, 'u'), codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: /\bes de tipo\b|\bvaría de\b|\ben \{|\b(?:se refina por|se pliega|se recompone|referencia el sub-modelo|vista de sub-modelo|referencia externa)\b/u, codigo: 'unsupported-canonical', regla: 'R-§19-SIM-2', registro: 'B-16' },
    // «Tiene» sigue siendo etiqueta libre; no inventa una exhibición con multiplicidad.
    { patron: /\b(?:después de|no maneja|no requiere|no consume|no genera|no afecta|no cambia)\b|\[etiqueta:/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: /^\*[^*]+\* (?:consume|genera|afecta|requiere|cambia) .*?(?:, | [ye] )(?:consume|genera|afecta|requiere|cambia) \*\*/u, codigo: 'unsupported-canonical', regla: 'R-§18-EXT-1', registro: 'B-16', prosaCompuesta: true },
    { patron: /\bexcede .* y .*es menor que\b/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    // spec-OPL §2.3–§2.4: estado único (D14), designación por lista (D15, D16) y oración combinada (D17); oración entera.
    { patron: /^\*\*N\*\* está en `s`\.$|^Estados `s`(?:(?:, | [ye] )`s`)* de \*\*N\*\* son (?:iniciales|finales)\.$|^\*\*N\*\* está inicialmente en `s`(?: [ye] `s`)* y finalmente en `s`(?:(?:, | [ou] )`s`)*\.$/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-61', mensaje: 'Oración canónica de estados (D14–D17) aún no ofrecida; no se aplica.' }
];
