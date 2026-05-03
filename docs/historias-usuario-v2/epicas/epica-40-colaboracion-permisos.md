---
epica: "EPICA-40"
titulo: "Colaboración — permisos de modelo, token de edición y auto-lectura desde carpeta"
slug: "colaboracion-permisos"
doc_fuente: "opcloud-reverse/40-colaboracion-permisos.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "W"
hu_emitidas: 25
hu_canonicas: 25
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Configuración de permisos por modelo: matriz O/W/R con propietario, escritor (token único) y lectores. Token de edición se transfiere por doble clic. Auto-lectura desde carpeta (HU-31.019) se compone con permisos de modelo (unión). Toda la épica es `W` para MVP single-user; orquesta HU-SHARED-003 cuando se habilita multiusuario.

## 2. HU canónicas

### HU-40.001 — Abrir modal "Configuración de Permisos del Modelo" desde botón
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Punto de acceso. **Criterios:** botón junto al título del modelo abre modal. **Patrones:** HU-SHARED-003. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [permisos, modal].

### HU-40.002 — Ver cabecera "Modelo / Organización" en el modal
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Contexto claro. **Criterios:** cabecera con nombre modelo y org. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [ui].

### HU-40.003 — Ver lista de grupos expandibles
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Permisos por grupo. **Criterios:** filas con flecha de colapso. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [grupos].

### HU-40.004 — Otorgar lectura a un grupo completo con un checkbox
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Granularidad de grupo. **Criterios:** checkbox por grupo. **Modelo:** `permiso.grupoId`, `permiso.nivel = "reader"`. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-40.003. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [permiso, grupo].

### HU-40.005 — Expandir grupo para ver usuarios "Nombre Apellido (email)"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Granularidad por usuario. **Criterios:** lista expandida. **Deps:** Bloqueada por HU-40.003. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [usuarios].

### HU-40.006 — Otorgar lectura a un usuario individual con checkbox por fila
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Granularidad por usuario. **Criterios:** checkbox individual sobrescribe del grupo. **Modelo:** `permiso.usuarioId`. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-40.005. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [usuario].

### HU-40.007 — Reconocer al "Propietario del Modelo" por icono llave
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Distinguir propietario. **Criterios:** icono llave + tooltip. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [render, owner].

### HU-40.008 — Reconocer al "Editor Actual" por icono pluma
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Saber quién tiene token de escritura. **Criterios:** icono pluma. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [render, editor].

### HU-40.009 — Persistir cambios con botón "Guardar"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Persistencia de permisos. **Criterios:** botón "Guardar" + toast. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [guardar].

### HU-40.010 — Descartar cambios con botón "Cerrar"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Salir sin guardar. **Criterios:** botón cierra sin toast. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [cancelar].

### HU-40.011 — Ver toast "Permisos cambiados con éxito"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Confirmación. **Criterios:** toast 2s. **Deps:** Bloqueada por HU-40.009. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [feedback].

### HU-40.012 — Ver indicador "(solo lectura)" cuando pierdo el token
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Visibilizar pérdida de escritura. **Criterios:** indicador junto al título. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-40.013. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [read-only].

### HU-40.013 — Transferir token de edición con doble clic sobre usuario
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Transferir derecho de escritura. **Criterios:** **Dado** doble clic en lector, **cuando** confirmo, **entonces** ese usuario obtiene token. **Modelo:** `modelo.tokenEdicion`. **Patrones:** HU-SHARED-002. **Deps:** Bloqueada por HU-40.005. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [token, transferir].

### HU-40.014 — Impedir asignar escritura sin lectura previa (regla dura)
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Coherencia de permisos. **Criterios:** validación. **Deps:** Bloqueada por HU-40.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [validacion].

### HU-40.015 — Impedir compartir modelo entre organizaciones (regla dura)
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Aislamiento entre orgs. **Criterios:** validación bloquea. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [seguridad, aislamiento].

### HU-40.016 — Impedir quitar lectura al usuario que tiene el token de escritura
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Coherencia. **Criterios:** validación. **Deps:** Bloqueada por HU-40.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [validacion].

### HU-40.017 — Redirigir Save a "Save As" cuando el usuario tiene solo lectura
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Permitir clonar para personalizar. **Criterios:** ver HU-30.036. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-30.036. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [permisos].

### HU-40.018 — Recuperar token como Propietario con doble clic sobre sí mismo
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** Forzar regreso del token. **Criterios:** AO puede reclamar token sin consentimiento del actual editor. **Deps:** Bloqueada por HU-40.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [token, owner].

### HU-40.019 — Ceder token desde Escritor a otro lector o Propietario
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** P. **Historia:** El editor cede voluntariamente. **Criterios:** doble clic en otro usuario transfiere. **Deps:** Bloqueada por HU-40.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [token].

### HU-40.020 — Impedir que Escritor no-Propietario quite token a un tercero
**Actor:** RV. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Solo AO puede arrebatar. **Criterios:** validación. **Deps:** Bloqueada por HU-40.013. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [validacion].

### HU-40.021 — Activar "Permiso de Lectura Automático del Modelo" desde Permisos de Carpeta
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** C. **Historia:** Lectura automática. **Criterios:** ver HU-31.019. **Deps:** Bloqueada por HU-31.019. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [auto-lectura].

### HU-40.022 — Ver tooltip del checkbox "Permiso de Lectura Automático"
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** U. **Historia:** Explicar comportamiento. **Criterios:** tooltip educativo. **Deps:** Bloqueada por HU-40.021. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [tooltip].

### HU-40.023 — Calcular lectura efectiva como unión ACL modelo + auto-lectura carpeta
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** K. **Historia:** Composición de permisos. **Criterios:** **Dado** auto-lectura activa, **cuando** se calcula lectura efectiva, **entonces** se une con ACL del modelo. **Modelo:** lente derivada. **Patrones:** HU-SHARED-003. **Deps:** Bloqueada por HU-40.021. **Prioridad:** W. **Tamaño:** M. **Etiquetas:** [permisos, calculo].

### HU-40.024 — Tratar grupo raíz "Todos los Usuarios de la Org" como alias
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** L. **Historia:** Atajo organizacional. **Criterios:** entrada especial en lista de grupos. **Deps:** Bloqueada por HU-40.003. **Prioridad:** W. **Tamaño:** S. **Etiquetas:** [grupo, alias].

### HU-40.025 — Preservar canvas pasivo tras modal de permisos (overlay puro)
**Actor:** AO. **Tipo:** opcloud-ui. **Nivel:** V. **Historia:** Modal no edita canvas. **Criterios:** canvas oscurecido y no responde durante modal. **Deps:** Bloqueada por HU-40.001. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [modal, ui].

## 3. Preguntas abiertas

| Q | Pregunta | Bloquea |
|---|---|---|
| Q40.1 | ¿Existen niveles más finos que O/W/R (ej. "comentar")? | HU-40.001 |
| Q40.2 | ¿Auditoría de cambios de permisos? | HU-40.009 |

## 4. Referencias

- Patrones: HU-SHARED-001, HU-SHARED-002, HU-SHARED-003.
- Bloqueada por: EPICA-30, EPICA-31, EPICA-80 (admin de org).
