# deep-opm-pro

Repositorio de **ingenieria inversa** sobre la version comercial de OPCloud
(`https://opcloud.systems`). Reune todo el material extraible de la app web
publica — codigo decompilado, assets, configuraciones, datos runtime del
sandbox demo, catalogos de clases, y hallazgos documentados.

**Proposito**: servir como base de conocimiento para el desarrollo de software
basado en el estandar ISO 19450 (OPM), usando los insumos de ingenieria inversa
de OPCloud como evidencia de producto verificada.

## Estructura

```
deep-opm-pro/
├── README.md                  # este archivo
├── AGENTS.md                  # instrucciones para sesiones de desarrollo
├── setup.sh                   # regenera bundles + decompilacion + assets
├── .gitignore
├── docs/                      # documentacion de ingenieria inversa
│   ├── HANDOFF.md             # estado, decisiones, pendientes, riesgos
│   ├── JOYAS.md               # hallazgos y descubrimientos detallados
│   └── PROCEDIMIENTO.md       # procedimiento de extraccion paso a paso
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
├── fixtures/                  # modelos del sandbox organizados por nombre
│   ├── empty-model/           # modelo vacio (1 OPD)
│   ├── onstar-system/         # OnStar System (2 OPDs)
│   ├── opm-meta-model/        # OPM structure meta-model (4 OPDs)
│   ├── sd-async/              # SD async process (2 OPDs)
│   ├── sd-sync/               # SD sync process (2 OPDs)
│   ├── system-diagram/        # System Diagram suelto (1 OPD)
│   └── meta/                  # metadata de UI (DOM, palette, toolbar)
├── webroot/                   # capturas raiz de opcloud.systems
│   ├── index.html             # HTML raiz de la app capturado
│   └── favicon.ico
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
cat docs/JOYAS.md
cat docs/HANDOFF.md

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
| Modelos de ejemplo | Sandbox demo | 7 modelos / 12 OPDs |
| OPL texts | Sandbox demo | 11 |
| Rutas Angular | Decompilacion | 28 |
| Config Firebase | Decompilacion | completa |

## Fuentes

- OPCloud app: `https://opcloud.systems`
- OPCloud sandbox: `https://opcloud-sandbox.web.app` (demo sin auth)
- Firebase project: `opcloud-trial`
- Backend: `https://opcloud-trial.uc.r.appspot.com`
- Dori, D. et al. (2021). *Designing and Developing OPCloud*
