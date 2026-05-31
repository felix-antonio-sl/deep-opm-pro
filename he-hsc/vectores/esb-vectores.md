# Vectores de Ataque — ESB Salud En Red (esb.saludenred.cl)

## CRÍTICOS

### V-ESB-1 | TLS deshabilitado — MITM completo
- **Vector:** `InsecureSkipVerify: true` en `TLSClientConfig`
- **Explotación:** ARP spoofing + certificado autofirmado entre proxy y ESB
- **Impacto:** captura de TokenSesion + AccessToken → acceso nacional. Modificación de epicrisis, diagnósticos, resúmenes clínicos
- **Remediación:** configurar cadena de certificados correcta; eliminar `InsecureSkipVerify`

## ALTOS

### V-ESB-2 | TokenSesion en query string
- **Vector:** `?ParametroFUC={"TokenSesion":"<token>",...}`
- **Explotación:** leer logs del proxy o del ESB → extraer tokens de líneas de log
- **Remediación:** enviar token en header Authorization, no en query string

### V-ESB-3 | AccessToken viaja en HTML sobre HTTP
- **Vector:** bridge SGH → `visor.saludenred.cl/#/rut/tipo/idryf/access%2Ftoken`
- **Explotación:** sniffing HTTP en :8085 → AccessToken en texto claro
- **Remediación:** HTTPS en el proxy SGH; token en POST, no en URL fragment

### V-ESB-4 | Token sin scope por paciente
- **Vector:** TokenSesion autoriza acceso a cualquier endpoint clínico
- **Explotación:** con token válido, consultar cualquier RUT/IDRyF en la red
- **Remediación:** scope token por paciente/establecimiento; expiración corta

## MEDIOS

### V-ESB-5 | Bridge de identidad frágil
- **Vector:** 4 pasos (DAU→SGH→visor→ESB), cada uno con punto de fallo
- **Explotación:** si el SGH no responde, todo el bridge falla → denial of service
- **Remediación:** autenticación directa contra ESB (sin bridge DAU+SGH)

### V-ESB-6 | IDRyF expuesto como identificador nacional
- **Vector:** `IdentityCheck.idryf` en JSON de salida
- **Impacto:** correlación de pacientes entre sistemas usando identificador nacional
- **Remediación:** no exponer IDRyF en outputs no esenciales
