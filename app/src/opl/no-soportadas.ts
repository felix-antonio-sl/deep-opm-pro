import type { CodigoOpl } from './analizar';
interface LimiteOpl { readonly patron: RegExp; readonly codigo: CodigoOpl; readonly regla: string; readonly registro: string; readonly mensaje?: string; readonly enEtiqueta?: true; readonly prosaCompuesta?: true; }
// D19 (canon spec-OPL R-ENT-3): oración de propiedades genéricas con dos o tres valores que incluye la perseverancia.
const propiedad = '(?:físic[oa]|informacional|ambiental|sistémic[oa]|persistente|transitori[oa])', separador = '(?:, | [ye] )';
const conPerseverancia = (valor: string) => `(?:es (?:${propiedad}${separador})+${valor}(?:${separador}${propiedad})*|es ${valor}(?:${separador}${propiedad})+)\\.$`;
// spec-OPL §7.1 (CX1, CX2, CX11, CX12) sobre la superficie: subprocesos *N* con el sufijo «proceso» (R-OPL-9) y
// objetos internos **N**; la secuencia mixta admite grupos «paralelo» en cualquier posición.
const subproceso = '\\*N\\*(?: proceso)?', subprocesos = `${subproceso}(?:(?:, | [ye] )${subproceso})*`;
const secuencia = `(?:paralelo )?${subproceso}(?:(?:, [ye] |, | [ye] )(?:paralelo )?${subproceso})*`;
const internos = ', así como \\*\\*N\\*\\*(?:(?:, | [ye] )\\*\\*N\\*\\*)*', descompone = '^\\*N\\*(?: proceso)? ';
/** Reconocimiento de límites: la prosa no se degrada a un grafo plausible. */
export const NO_CANONIZADAS: readonly LimiteOpl[] = [
    { patron: /\*[^*]+\* es persistente\.|\*\*[^*]+\*\* es transitori[oa]\./u, codigo: 'non-canonical', regla: 'R-OPL-DESC-1', registro: 'B-16' },
    { patron: new RegExp(`^\\*[^*]+\\* ${conPerseverancia('persistente')}|^\\*\\*[^*]+\\*\\* ${conPerseverancia('transitori[oa]')}`, 'u'), codigo: 'non-canonical', regla: 'R-OPL-DESC-1', registro: 'B-16' },
    { patron: /puede ser .*`|\binicia e invoca\b|\bpuede generarse\b|\binvoca .* si .* ocurre\b/u, codigo: 'non-canonical', regla: 'R-MOD-INPUT-2', registro: 'B-16' },
    { patron: /(?:exactamente uno de|al menos uno de).*\bPr=/u, codigo: 'unsupported-canonical', regla: 'R-FAN-PR-1', registro: 'B-16' },
    { patron: /\bPr=|\bFANLOCAL\b|\bfan local\b|\b(?:XOR|OR|AND)\b/u, codigo: 'non-canonical', regla: 'R-CONF-6', registro: 'B-16' },
    { patron: /\binicia .* (?:ocurre si|de lo contrario)|\bestá en .* afecta .* de lo contrario/u, codigo: 'non-canonical', regla: 'AP-28', registro: 'B-16' },
    // CX13 (R-CX-DESP-2): la descomposición de objeto nombra sólo objetos y cierra con «, en esa secuencia», sin
    // paralelo; otra lectura de «se descompone en» no se degrada a una lista etiquetada.
    { patron: /^\*\*N\*\*(?: proceso)? (?:desde \S+ )?se descompone en (?!(?:\S+ en )?\*\*N\*\*(?:(?:, | [ye] )\*\*N\*\*)*, en esa secuencia(?:, así como \*N\*(?:(?:, | [ye] )\*N\*)*)?\.$)/u, codigo: 'non-canonical', regla: 'R-CX-DESP-2', registro: 'B-02', prosaCompuesta: true,
        mensaje: 'La descomposición de un objeto enumera sus partes y cierra con «, en esa secuencia» (CX13).' },
    // La de proceso enumera subprocesos y lleva «, en esa secuencia» o «paralelo» (CX1, CX2, mixta, CX11, CX12);
    // CXI la acepta sin marca si nombra objetos internos. Otra lectura no se degrada a una lista etiquetada.
    { patron: new RegExp(`${descompone}(?:desde \\S+ se descompone en (?!\\S+ en (?:${secuencia}, en esa secuencia|paralelo ${subprocesos})(?:${internos})?\\.$)`
        + `|se descompone en (?!(?:${secuencia}, en esa secuencia|paralelo ${subprocesos}|${subprocesos} y en paralelo ${subprocesos}, en esa secuencia)(?:${internos})?\\.$|${subprocesos}${internos}\\.$))`, 'u'),
        codigo: 'non-canonical', regla: 'R-CX-DESP-2', registro: 'B-16', prosaCompuesta: true,
        mensaje: 'La descomposición de un proceso enumera sus subprocesos y cierra con «, en esa secuencia» o empieza por «paralelo» (CX1, CX2).' },
    // Grafía histórica: el canon vigente escribe RF5 con el estado pospuesto al atributo.
    { patron: /\bexhiben? `s` \*\*N\*\*/u, codigo: 'non-canonical', regla: 'R-ZNC-1', registro: 'B-37' }
];
export const NO_SOPORTADAS: readonly LimiteOpl[] = [
    // Son metadatos sólo fuera del hueco de etiqueta de una lista cerrada reconocida.
    { patron: / [ye] más\.$|\bdonde\b|\bordenados por\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-SE-4', registro: 'B-54', enEtiqueta: true },
    { patron: /\bpuede ser\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-RF-5', registro: 'B-01' },
    { patron: /\b(?:consumen|generan|afectan|requieren|manejan|invocan)\b/u, codigo: 'unsupported-canonical', regla: 'DR-12', registro: 'B-09' },
    // DEC55 ofrece 0/1 y los rangos; «exactamente un» sigue sin literal canónico.
    { patron: /\bexactamente un(?:a)? \*\*/u, codigo: 'unsupported-canonical', regla: 'R-§18-PART-1', registro: 'B-10' },
    { patron: /^Por ruta .* (?:maneja|requiere|afecta|invoca|cambia)\b/u, codigo: 'unsupported-canonical', regla: 'R-OPL-RUTA-2', registro: 'B-07' },
    { patron: /\bes (?:persistente|transitoria|transitorio)\.$/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: new RegExp(`\\b${conPerseverancia('(?:persistente|transitori[oa])')}`, 'u'), codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: /\bes de tipo\b|\bvaría de\b|\ben \{|\b(?:se refina por|se pliega|se recompone|referencia el sub-modelo|vista de sub-modelo|referencia externa)\b/u, codigo: 'unsupported-canonical', regla: 'R-§19-SIM-2', registro: 'B-16' },
    // «Tiene» sigue siendo etiqueta libre; no inventa una exhibición con multiplicidad.
    { patron: /\b(?:después de|no maneja|no requiere|no consume|no genera|no afecta|no cambia)\b|\[etiqueta:/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    { patron: /^\*[^*]+\* (?:consume|genera|afecta|requiere|cambia) .*?(?:, | [ye] )(?:consume|genera|afecta|requiere|cambia) \*\*/u, codigo: 'unsupported-canonical', regla: 'R-§18-EXT-1', registro: 'B-16', prosaCompuesta: true },
    { patron: /\bexcede .* y .*es menor que\b/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-16' },
    // spec-OPL §2.3–§2.4: estado único (D14), designación por lista (D15, D16) y oración combinada (D17); oración entera.
    { patron: /^\*\*N\*\* está en `s`\.$|^Estados `s`(?:(?:, | [ye] )`s`)* de \*\*N\*\* son (?:iniciales|finales)\.$|^\*\*N\*\* está inicialmente en `s`(?: [ye] `s`)* y finalmente en `s`(?:(?:, | [ou] )`s`)*\.$/u, codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-61', mensaje: 'Oración canónica de estados (D14–D17) aún no ofrecida; no se aplica.' },
    // spec-OPL §7.1: CX11 paralela o con objetos internos y el grupo final «y en paralelo» de CX12; CXN sólo lee la secuencia.
    { patron: new RegExp(`${descompone}(?:desde \\S+ se descompone en \\S+ en (?:paralelo ${subprocesos}(?:${internos})?|${secuencia}, en esa secuencia${internos})`
        + `|se descompone en ${subprocesos} y en paralelo ${subprocesos}, en esa secuencia(?:${internos})?)\\.$`, 'u'),
        codigo: 'unsupported-canonical', regla: 'R-IMPORT-5', registro: 'B-48', prosaCompuesta: true,
        mensaje: 'Descomposición canónica de proceso aún no ofrecida (CX11 paralela o con «así como», CX12 «y en paralelo»); no se aplica.' }
];
