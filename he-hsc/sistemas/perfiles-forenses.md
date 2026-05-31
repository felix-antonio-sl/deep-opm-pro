# Sistemas Objetivo — Perfiles Forenses

Reconstrucción desde código del `hsc-agent-cli`. Cada sistema fue perfilado mediante
ingeniería inversa pasiva de sus endpoints, modelos de datos, mecanismos de autenticación,
y patrones de respuesta HTML.

## Inventario

| Sistema | Puerto | URL base | Tecnología | Sesión | Criticidad |
|---------|--------|----------|------------|--------|------------|
| SGH | :8085 | `/SGH/` | PHP legacy, HTML4 | PHPSESSID (form login) | Crítica — hospitalización, censo, evoluciones, documentos, recetas |
| DAU | :8080 | `/dau/vista/` | PHP legacy, Bootstrap+jQuery | PHPSESSID (form login) | Crítica — urgencia, triage ESI, diagnósticos CIE-10 |
| LIS | :8084 | `/WEB_SANCARLOS/` | PHP legacy | PHPSESSID (form login) | Alta — resultados de laboratorio, sin LOINC/SNOMED |
| ESB | :8201,8095-8099 | `esb.saludenred.cl` | HTTPS (TLS roto) | Bridge DAU+SGH→Token | Crítica — historial clínico nacional, epicrisis |

## Detalle forense completo

Referencia cruzada: `hd-hsc-os/docs/04-arquitectura/auditoria-forense-sistemas-ssnuble-hsc-2026-05-31.md`

### SGH — 14 endpoints, 7 hospitales, 1 instancia

- `obt_paciente.php` — búsqueda por RUT sin rate limiting → enumeración de pacientes
- `cambiar_hospital.php` — cambio de hospital sin control de acceso → pivoteo cross-hospital
- `ver_pdf.php` — documentos sin verificación de identidad → acceso por ID secuencial
- `listado_datos_camas_pacientes.php` — censo completo en una request → exfiltración masiva
- `cargar_detalle_evolucion.php` — JSON con 8 campos clínicos → acceso a evoluciones por ID

### DAU — 16 endpoints, flujo de urgencia completo

- `listadoPacientesBox.php` — board sin RUTs pero con nombres, edades, motivos, categorías ESI
- `triageprueba/listadoTriage.php` — signos vitales + alergias + antecedentes + medicación crónica
- `atencion/index.php` — hidden fields con RUT y codPacie (identidad frágil, se pierde al cerrar)
- `obtener_cie.php` — solo GET (POST = vacío) → falso negativo silencioso
- `obtener_lista_recetas.php` — solo POST (GET = vacío) → mismo patrón

### LIS — 3 endpoints, sin trazabilidad

- `resultadoseleccion.php` — resultados por RUT sin DV → colisión de identidad
- `detalleexamenes.php` — PDFs por ID secuencial → exfiltración masiva
- Sin binding a episodio — cualquier sesión ve resultados de cualquier RUT

### ESB — 5 puertos, TLS roto

- `:8201` TokenSesion en query string → logueable
- `:8099` XML epicrisis SGH dentro de JSON → inyectable vía MITM
- Bridge DAU+SGH → AccessToken en HTML sobre HTTP → capturable en red
- Sin scope por paciente → token autoriza acceso a toda la red nacional
