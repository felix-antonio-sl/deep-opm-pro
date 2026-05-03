---
epica: "EPICA-80"
titulo: "Configuración — gestión de usuarios, grupos y organización"
slug: "config-user-org"
doc_fuente: "opcloud-reverse/80-config-user-org.md"
estado: "v2-canonica"
fecha: 2026-05-03
prioridad_predominante: "C"
hu_emitidas: 26
hu_canonicas: 26
hu_stubs: 0
fuente_normativa: "/home/felix/kora/artifacts/knowledge/fxsl/opm/opm-ssot-es"
---

## 1. Resumen

Configuración administrativa: perfil de usuario (nombre, foto, password, expiración), preferencias (autosalvado, log sharing), gestión de organización (crear/editar usuarios, grupos, subgrupos), defaults heredables. Solo accesible para administradores en partes correspondientes.

## 2. HU canónicas

### HU-80.001 — Abrir Configuración desde menú principal
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [config, ui].

### HU-80.002 — Abrir Configuración desde botón engranaje
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [atajo].

### HU-80.003 — Volver al canvas con botón "Atrás" sin perder modelo
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [navegacion].

### HU-80.004 — Ver panel lateral con grupos administrativos
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** U. **Criterios:** secciones: Perfil, Preferencias, Org Management, Group Management. **Prioridad:** M1. **Tamaño:** S. **Etiquetas:** [panel].

### HU-80.005 — Ver badge de identidad "Nombre / Organización" en canvas
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** V. **Prioridad:** M1. **Tamaño:** XS. **Etiquetas:** [identidad].

### HU-80.006 — Actualizar nombre completo desde "Mi perfil"
**Actor:** MN. **Tipo:** mixto. **Nivel:** P. **Modelo:** `usuario.nombre` `[propuesta]`. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [perfil].

### HU-80.007 — Cambiar foto de perfil subiendo archivo local
**Actor:** MN. **Tipo:** mixto. **Nivel:** P. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [perfil, foto].

### HU-80.008 — Cambiar foto pegando URL externa
**Actor:** MN. **Tipo:** mixto. **Nivel:** P. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [perfil, foto].

### HU-80.009 — Ver "Fecha de Expiración" del perfil propio como solo lectura
**Actor:** MN. **Tipo:** mixto. **Nivel:** L.  **Patrones:** HU-SHARED-003 (mecánica detectada por audit-hu.mjs). **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [expiracion].

### HU-80.010 — Restablecer contraseña propia con email
**Actor:** MN. **Tipo:** mixto. **Nivel:** P. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [seguridad].

### HU-80.011 — Deshabilitar "Restablecer contraseña" bajo SSO
**Actor:** MN. **Tipo:** mixto. **Nivel:** C. **Prioridad:** W. **Tamaño:** XS. **Etiquetas:** [sso].

### HU-80.012 — Ajustar intervalo de autosalvado
**Actor:** ME. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** input minutos; default 5. **Modelo:** `usuario.preferencias.autosalvadoIntervalo`. **Deps:** HU-30.035. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [config].

### HU-80.013 — Ajustar precisión decimal del tiempo
**Actor:** IS. **Tipo:** opcloud-ui. **Nivel:** C. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [config, simulacion].

### HU-80.014 — Alternar "Compartir logs habilitado/deshabilitado"
**Actor:** MN. **Tipo:** opcloud-ui. **Nivel:** C. **Criterios:** opt-in para enviar logs anonimizados. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [privacidad].

### HU-80.015 — Ocultar "Group/Organization Management" a usuarios sin rol admin
**Actor:** AO. **Tipo:** mixto. **Nivel:** C. **Patrones:** HU-SHARED-003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [permisos].

### HU-80.016 — Crear nuevo usuario desde "Organization Management"
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Criterios:** form crear usuario. **Modelo:** `usuario.*` `[propuesta]`. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [crear-usuario].

### HU-80.017 — Editar usuario existente
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [editar].

### HU-80.018 — Fijar fecha de expiración a un usuario
**Actor:** AO. **Tipo:** mixto. **Nivel:** C. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [expiracion].

### HU-80.019 — Desactivar usuario sin borrar historial
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Criterios:** soft-delete. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [desactivar].

### HU-80.020 — Crear grupo en "Group Management"
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Modelo:** `grupo.*` `[propuesta]`. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [grupo].

### HU-80.021 — Añadir/quitar usuarios de un grupo
**Actor:** AO. **Tipo:** mixto. **Nivel:** P. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [grupo].

### HU-80.022 — Anidar subgrupos dentro de grupo padre
**Actor:** AO. **Tipo:** mixto. **Nivel:** L. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [grupo, jerarquia].

### HU-80.023 — Ver grupo raíz sintético "Todos los usuarios de la org"
**Actor:** AO. **Tipo:** mixto. **Nivel:** L. **Criterios:** ver HU-40.024. **Prioridad:** C. **Tamaño:** XS. **Etiquetas:** [grupo, alias].

### HU-80.024 — Configurar defaults de organización (esencia, OPD tree, ontología)
**Actor:** AO. **Tipo:** mixto. **Nivel:** C. **Criterios:** ver EPICA-81. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [defaults].

### HU-80.025 — Heredar defaults de organización con override por usuario
**Actor:** MN. **Tipo:** mixto. **Nivel:** C. **Criterios:** preferencia usuario sobrescribe org. **Prioridad:** C. **Tamaño:** M. **Etiquetas:** [herencia].

### HU-80.026 — Impedir visibilidad cross-organización
**Actor:** AO. **Tipo:** mixto. **Nivel:** C. **Criterios:** aislamiento estricto. **Patrones:** HU-SHARED-003. **Prioridad:** C. **Tamaño:** S. **Etiquetas:** [seguridad, aislamiento].

## 3. Referencias

- Patrones: HU-SHARED-003.
- Bloqueada por: EPICA-30, EPICA-40.
