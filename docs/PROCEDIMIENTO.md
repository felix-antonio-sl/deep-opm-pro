# deep-opm-pro — ingenieria inversa de OPCloud (version comercial)

## Objetivo

Repositorio de **ingenieria inversa** sobre la version comercial de OPCloud
(`https://opcloud.systems`). Reune todo el material extraible de la app web
publica: bundles decompilados, assets, configuraciones, catalogos de clases
y rutas.

**Fuente**: `https://opcloud.systems` — version oficial/comercial.
**Exclusivamente version comercial.**

Nota operativa: en el workspace liviano, `decompiled/` y `_local/` no se
conservan por defecto. Este procedimiento describe el estado materializado
despues de ejecutar `bash setup.sh`.

## Estructura

```
deep-opm-pro/
├── PROCEDIMIENTO.md           # este archivo
├── setup.sh                   # script para regenerar desde cero
├── webroot/                   # capturas raiz de la app
│   ├── index.html             # HTML raiz de la app (capturado)
│   └── favicon.ico            # favicon de la app
├── decompiled/                # 808 modulos webpack decompilados (91 MB)
│   ├── bundle.json            # manifiesto de modulos
│   ├── deobfuscated.js        # bundle completo deobfuscado (46 MB)
│   └── *.js                   # modulos individuales
├── assets/svg/                       # 73 SVGs descargados del CDN publico (540 KB)
│   ├── links/structural/      # 4 marcadores estructurales
│   ├── links/procedural/      # 26 marcadores procedimentales
│   ├── list-logical/          # 4 SVGs de lista logica
│   ├── toolbar/               # SVGs de toolbar
│   └── *.svg                  # things, states, UI icons
├── assets/png/                # 11 PNGs (icons + modelWizard)
│   ├── icons/                 # key-icon, pin, token-icon
│   └── modelWizard/           # 8 capturas del wizard
├── config/                    # configuraciones extraidas
│   ├── firebase.json          # Firebase config completa
│   ├── routes.json            # tabla de rutas Angular (28 rutas)
│   └── edx.config.json        # config academica (edX Technion)
├── catalog/                   # catalogos del codigo
│   ├── classes.txt            # ~376 clases OPM identificadas
│   └── modules.txt            # modulos clave con mapeo clase→archivo
└── _local/                    # NO versionado (bundles originales, 50 MB)
    └── bundles/               # main.a8737ee2a8ed30eb.js + runtime/polyfills/scripts/styles
```

## Procedimiento de extraccion

### Paso 1 — Descarga del bundle

```bash
# Bundle principal de produccion
curl -L -o main.js https://opcloud.systems/main.a8737ee2a8ed30eb.js
# 42 MB

# Bundles complementarios
curl -O https://opcloud.systems/runtime.fc52d5769e5144aa.js    # 15 KB
curl -O https://opcloud.systems/polyfills.18d88e2014052aca.js   # 186 KB
curl -O https://opcloud.systems/scripts.8153de010e3d945e.js     # 5.9 MB
curl -O https://opcloud.systems/styles.5c39161930f899e1.css     # 561 KB
```

### Paso 2 — Decompilacion con webcrack

```bash
npx --yes webcrack main.js --output decompiled/
```

Resultado: **808 modulos webpack** separados + `deobfuscated.js` (bundle
completo deobfuscado). 91 MB total.

### Paso 3 — Descarga de assets publicos

Los SVGs y PNGs se sirven desde el CDN de Firebase Hosting sin
autenticacion. Paths predecibles:

```bash
# Estructurales
curl -O https://opcloud.systems/assets/SVG/links/structural/aggregation.svg

# Procedimentales
curl -O https://opcloud.systems/assets/SVG/links/procedural/agent.svg

# Things
curl -O https://opcloud.systems/assets/SVG/object.svg

# UI
curl -O https://opcloud.systems/assets/SVG/newLogo.svg

# PNGs
curl -O https://opcloud.systems/assets/icons/key-icon.png
curl -O https://opcloud.systems/assets/modelWizard/page2.png
```

### Paso 4 — Extraccion de configuraciones del bundle decompilado

```bash
# Firebase config
grep -oP 'apiKey.*|projectId.*|authDomain.*|apiTarget.*' decompiled/deobfuscated.js

# Rutas Angular
grep -oP 'path:\s*"[^"]*"' decompiled/*.js | sort -u

# Clases OPM
grep -oP 'class [A-Z][a-zA-Z]*' decompiled/deobfuscated.js | sort -u

# URLs y endpoints
grep -oP 'https?://[a-zA-Z0-9._/-]+' decompiled/deobfuscated.js | sort -u

# Assets referenciados
grep -oP '"assets/[^"]+\.(svg|png|ico)"' decompiled/deobfuscated.js | sort -u
```

### Regeneracion rapida

```bash
bash setup.sh
```

Descarga el bundle, lo decompila, y descarga todos los assets en ~2 min.

## Configuracion Firebase (extraida del bundle)

```json
{
  "apiKey": "AIzaSyA5okv4Zyd2ZKdPHPI1NejiMvoIKr0_TV8",
  "projectId": "opcloud-trial",
  "authDomain": "opcloud-trial.firebaseapp.com",
  "databaseURL": "https://opcloud-trial.firebaseio.com",
  "messagingSenderId": "168141925790",
  "storageBucket": "",
  "backend": "https://opcloud-trial.uc.r.appspot.com"
}
```

## Metricas del material extraido

| Metrica | Valor |
|---------|-------|
| URL fuente | `opcloud.systems` |
| Bundle main | 42 MB |
| Modulos decompilados | 808 |
| Tamano decompilado | 91 MB |
| Firebase project | `opcloud-trial` |
| Exporters | CMMN, DMN, DCIM, SysML, OPL, Trace, CanonicalOPM |
| Chat colaborativo | Si |
| Graph insights | Si |
| NLP analysis | Si |
| Admin organizacional | Si (org settings, manual, analytics, groups, users) |
| Model comparison | Si |
| Auth guards | 16 |
| SVGs descargados | 73 |
| PNGs descargados | 11 (modelWizard + icons) |

## Modulos clave (decompiled/)

| Modulo | Tamano | Contenido principal |
|--------|--------|---------------------|
| `deobfuscated.js` | 46 MB | Bundle completo deobfuscado (todas las clases) |
| `37084.js` | 25 MB | Mega-chunk: AgentLink, AggregationLink, BasicOpmModel, BlankLink... |
| `38844.js` | 3.0 MB | — |
| `56910.js` | 1.9 MB | StackLayoutModel, StackLayoutView |
| `26930.js` | 1.8 MB | — |
| `23279.js` | 1.5 MB | EffectHandle, EffectScheduler, TransferState |
| `56487.js` / `36651.js` | 535 KB | Duplicados (webpack chunks) |
| `92624.js` | 502 KB | ConfirmationResultImpl |
| `68784.js` | 327 KB | — |
| `95244.js` / `48657.js` | 319 KB | Duplicados |

Para buscar una clase:

```bash
cd decompiled
grep -l "class AggregationLink" *.js
grep -l "class OpmModel" *.js
grep -l "getTriangleSVG" *.js
```

## Fuentes

- OPCloud app: `https://opcloud.systems`
- OPCloud marketing: `https://www.opcloud.tech`
- Firebase project: `opcloud-trial`
- Backend: `https://opcloud-trial.uc.r.appspot.com`
- webcrack: `https://github.com/j4k0xb/webcrack`
- Dori, D. et al. (2021). *Designing and Developing OPCloud, an OPM-based
  Collaborative Software Environment*.
