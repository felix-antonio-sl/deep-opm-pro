# Vectores de Ataque — SGH (:8085)

## CRÍTICOS

### V-SGH-1 | Captura de sesión por sniffing de red
- **Superficie:** HTTP plano, PHPSESSID en texto claro
- **Explotación:** `tcpdump -i any port 8085 -w sgh.pcap`
- **Impacto:** sesión clínica completa — lectura de fichas, evoluciones, censo, documentos
- **Detección:** inexistente
- **Remediación:** TLS en proxy nginx entre CLI y backend

### V-SGH-2 | Fuerza bruta de credenciales
- **Endpoint:** `funciones/autenticacion.php` (POST, 200 con `login_form` en falla)
- **Explotación:** diccionario + iteración. Sin rate limiting, sin lockout, sin CAPTCHA
- **Impacto:** acceso total a SGH con credenciales válidas
- **Detección:** logs de acceso HTTP (si existen) mostrarían volumen anómalo
- **Remediación:** rate limiting, delay exponencial, lockout tras N intentos

## ALTOS

### V-SGH-3 | Pivoteo cross-hospital
- **Endpoint:** `cambiar_hospital.php` (POST `hh=<hospital_id>`)
- **Explotación:** cambiar `hh=1` a Herminda Martin con sesión de San Carlos
- **Impacto:** datos de 7 hospitales accesibles con credenciales de 1
- **Remediación:** validar permisos del usuario por hospital; loguear cada cambio

### V-SGH-4 | Enumeración de pacientes por RUT
- **Endpoint:** `obt_paciente.php?rut=X&v=Y`
- **Explotación:** script iterando RUTs chilenos (~20M posibles, ~200K con ficha en el hospital)
- **Impacto:** lista de pacientes del hospital + determinación de hospitalizados activos
- **Remediación:** rate limiting, requerir codPacie o ingreso_id como segundo factor

### V-SGH-5 | Acceso a documentos por ID secuencial
- **Endpoint:** `ver_pdf.php?form=X&id=Y` (ID incremental)
- **Explotación:** iterar `id` de 1 a N, descargar todos los PDFs
- **Impacto:** epicrisis, ingresos, recetas — documentos clínicos completos
- **Remediación:** verificar que la sesión tenga relación con el paciente del documento

## MEDIOS

### V-SGH-6 | HTML injection en evoluciones
- **Vector:** `cargar_historial_evolucion.php` retorna HTML con texto libre de evoluciones
- **Explotación:** clínico con acceso de escritura inyecta `<script>` en nota de evolución
- **Impacto:** XSS persistente, robo de PHPSESSID de otros usuarios
- **Remediación:** sanitizar output HTML en el PHP del SGH

## BAJOS

### V-SGH-7 | MoJibake como canal encubierto
- **Vector:** SGH emite nombres con corrupción de encoding (Latin-1 como UTF-8)
- **Explotación:** teórica — encoding malicioso podría confundir parsers
- **Impacto:** bajo — el CLI repara el mojibake activamente
- **Remediación:** corregir encoding en el PHP del SGH (UTF-8 consistente)
