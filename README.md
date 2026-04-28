# deep-opm-pro

Repositorio de **ingenieria inversa** sobre la version comercial de OPCloud
(`https://opcloud.systems`). Reune todo el material extraible de la app web
publica — codigo decompilado, assets, configuraciones, datos runtime del
sandbox demo, catalogos de clases, y hallazgos documentados.

**Proposito**: servir como base de conocimiento para entender como la
implementacion de referencia del estandar ISO 19450 (OPM) materializa
visual y funcionalmente el canon OPM.

## Estructura

```
deep-opm-pro/
├── README.md                  # este archivo
├── HANDOFF.md                 # estado, decisiones, pendientes, riesgos
├── PROCEDIMIENTO.md           # procedimiento de extraccion paso a paso
├── JOYAS.md                   # hallazgos y descubrimientos detallados
├── setup.sh                   # regenera bundles + decompilacion + assets
├── .gitignore
├── index.html                 # HTML raiz de la app capturado
├── favicon.ico
├── assets/
│   ├── svg/                   # 73 SVGs canonicos del CDN publico
│   └── png/                   # 11 PNGs (icons + modelWizard)
├── config/                    # configuraciones extraidas del bundle
│   ├── firebase.json          # apiKey, projectId, backend URL
│   ├── routes.json            # 28 rutas Angular con guards
│   ├── assets.json            # inventario de assets referenciados
│   └── edx.config.json        # integracion academica Technion edX
├── catalog/                   # catalogos generados
│   ├── classes.txt            # 376 clases OPM identificadas
│   └── modules.md             # modulos clave con mapeo clase→archivo
├── sandbox-data/              # datos extraidos del sandbox demo
│   ├── *.json                 # 18 JSONs con cells por OPD
│   ├── *.png                  # 15 screenshots
│   └── *.txt                  # 11 textos OPL
├── decompiled/                # [gitignored] 808 modulos webpack (91 MB)
│   └── regenerar con: bash setup.sh
└── _local/                    # [gitignored] bundles originales (49 MB)
```

## Uso

```bash
# Clonar
git clone <repo-url> deep-opm-pro && cd deep-opm-pro

# Regenerar material grande (bundles + decompilacion)
bash setup.sh

# Navegar los hallazgos
cat JOYAS.md
cat HANDOFF.md

# Buscar en el codigo decompilado (requiere setup.sh primero)
cd decompiled
grep -l "class AggregationLink" *.js
grep -l "getTriangleSVG" *.js
```

## Lo que contiene

| Artefacto | Fuente | Cantidad |
|-----------|--------|----------|
| Modulos JS decompilados | `opcloud.systems` (webpack bundle) | 808 |
| Clases OPM catalogadas | Decompilacion | 376 |
| SVGs canonicos | CDN publico | 73 |
| PNGs | CDN publico | 11 |
| Modelos de ejemplo | Sandbox demo | 6 modelos / 10 OPDs |
| OPL texts | Sandbox demo | 11 |
| Rutas Angular | Decompilacion | 28 |
| Config Firebase | Decompilacion | completa |

## Fuentes

- OPCloud app: `https://opcloud.systems`
- OPCloud sandbox: `https://opcloud-sandbox.web.app` (demo sin auth)
- Firebase project: `opcloud-trial`
- Backend: `https://opcloud-trial.uc.r.appspot.com`
- Dori, D. et al. (2021). *Designing and Developing OPCloud*
