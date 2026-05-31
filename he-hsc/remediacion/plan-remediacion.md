# Plan de Remediación — Sistemas HSC / SS Ñuble

## Prioridad 1 — Esta semana (costo cero o mínimo, alto impacto)

| # | Acción | Sistema | Esfuerzo | Impacto |
|---|---|---|---|---|
| R1 | Habilitar TLS en proxy nginx entre CLI y backends | SGH, DAU, LIS | 2h (configuración) | Elimina sniffing pasivo de sesiones |
| R2 | Restringir `cambiar_hospital.php` a roles administrativos | SGH | 1h (PHP) | Bloquea pivoteo cross-hospital |
| R3 | Log de acceso en `obt_paciente.php` — timestamp, usuario, RUT, IP | SGH | 2h (PHP) | Trazabilidad básica de accesos |
| R4 | Log de acceso en `resultadoseleccion.php` | LIS | 1h (PHP) | Trazabilidad de consultas de laboratorio |
| R5 | Eliminar `InsecureSkipVerify` del ESB client — configurar cadena de certificados | CLI | 1h (Go) | Cierra MITM contra ESB |

## Prioridad 2 — Este mes (requiere desarrollo leve)

| # | Acción | Sistema | Esfuerzo |
|---|---|---|---|
| R6 | Rate limiting en `obt_paciente.php` — max 30 req/min por IP | SGH | 3h (nginx/PHP) |
| R7 | Rate limiting en `resultadoseleccion.php` | LIS | 1h (nginx/PHP) |
| R8 | Verificación de binding paciente-sesión en `ver_pdf.php` | SGH | 4h (PHP) |
| R9 | Forzar validación de DV en LIS — rechazar RUTs sin DV válido | LIS | 2h (PHP) |
| R10 | Rotar todas las credenciales de DAU, SGH, LIS — eliminar defaults | Todos | 2h (admin) |
| R11 | Implementar expiración de sesión por inactividad (30 min) | SGH, DAU, LIS | 3h (PHP) |

## Prioridad 3 — Próximos 3 meses (requiere planificación)

| # | Acción | Impacto |
|---|---|---|
| R12 | Segmentar VLAN clínica — separar tráfico de sistemas de salud de red administrativa | Elimina sniffing cross-VLAN |
| R13 | Autenticación directa contra ESB — eliminar bridge DAU+SGH para token | Reduce superficie de ataque del bridge |
| R14 | Sanitización de output HTML en SGH y DAU — prevenir XSS en evoluciones/notas | Cierra vector de HTML injection |
| R15 | Implementar segundo factor para acceso clínico | Mitiga robo de credenciales |
| R16 | Runbook de incidentes alineado con Ley 21.663 y CSIRT | Cumplimiento normativo |
| R17 | Migrar LIS a identificadores LOINC para exámenes | Interoperabilidad + reduce error |

## Métricas de seguridad — Línea base vs Meta cutover

| Indicador | Hoy | Meta |
|-----------|-----|------|
| Endpoints clínicos sobre HTTPS | 0/34 | 34/34 (vía proxy TLS) |
| Sistemas con rate limiting | 0/4 | 3/4 |
| Sistemas con logs de acceso | 0/4 | 4/4 |
| Sistemas con validación de identidad (DV) | 0/4 | 3/4 |
| Sesiones con expiración | 0/4 | 4/4 |
| Cifrado en reposo | 0/4 | 1/4 (hd-hsc-os) |
| Segregación multi-hospital real | 0 | 1 (hd-hsc-os RLS) |
| Plan de respuesta a incidentes | No existe | Documentado + probado |
| 2FA para acceso clínico | No | Staff clínico |
