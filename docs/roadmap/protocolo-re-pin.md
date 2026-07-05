# Protocolo de re-pin del golden hd-opm

**Estatus:** APROBADO por el operador (HITL-2, adenda del acta `2026-06-04-acta-mesa-flujo-canonico-dominio-opforja.md`). Realiza D6/L3. Documento corto y operativo — cierra W2.1 del backlog contingencial.

## Contrato por defecto: byte-identidad total

El bundle golden de hd-opm (`hd-opm/models/hodom-completo-*.deep-opm-pro.modelo.v0.json`, hoy v2.0) se regenera **byte-idéntico** (`diff -q` vacío) con:

```bash
cd ~/projects/hd-opm && bun run scripts/generar-bundle-hodom.ts   # regenera models/ y opl/
git -C ~/projects/hd-opm diff --stat                              # debe quedar vacío
```

**Toda fase del backlog que PUEDA preservar la byte-identidad, DEBE** (refactors internos puros: W3.1 layout único, W3.2 DSL-sobre-kernel, W4.1 primitivas aditivas, W5.1 extensiones aditivas). Es el gate más barato y más fuerte disponible: detecta el 100% de los cambios de salida.

## Re-pin (cambio deliberado): el golden se re-ancla, nunca se abandona

Cuando un cambio intencional (mejora de layout, cambio de esquema de ids, semántica nueva) haga imposible la byte-identidad:

1. **Checks deterministas** (todos PASS antes de pedir el ojo del operador):
   - canon nativo PASS (0 bloqueantes), round-trip JSON PASS, contención PASS, cero solapes;
   - conteos del generador iguales al golden vivo (el número exacto evoluciona con el dominio — la fuente es la salida del propio generador, no ningún documento; última verificación 2026-06-04: 264/192/438/37);
   - **OPL forward comparado bajo vista fija** — condición de validez RR-2: el OPL es proyección de modelo×vista; solo es oráculo cuando los campos de vista (`modoPlegado`, `estadosSuprimidos`, …) no cambian.
2. **Validación visual del operador** (Felix) en opforja — el oráculo de la geometría aprobada es humano y está formalizado aquí. Sin su visto bueno no hay re-pin.
3. **Bump explícito de versión** del componente que cambió (`autoriaVersion` / `layoutVersion` — campos de procedencia desde F5; hasta entonces, anotación en el commit).
4. **Commit del nuevo golden** en hd-opm con referencia a este protocolo y al motivo del cambio.

## Qué NO es un re-pin válido

- Regenerar el golden "porque el diff salió rojo" sin pasar por 1-4 (eso es falsificar el oráculo).
- Cambios de CONTENIDO del modelo HODOM (nuevas entidades/OPDs): esos mutan el golden legítimamente por la vía normal de hd-opm (su propio flujo de rondas + canon PASS) — el protocolo de re-pin gobierna cambios de **compilador/layout/formato**, no de dominio.

## Pendiente conectado

- **W2.2 — validación visual del v1.6 (layout R26 + 3 OPDs de R24-C)**: hito declarado en hd-opm, acción del operador; sirve de primer ejercicio del pin (bendice la referencia vigente).
