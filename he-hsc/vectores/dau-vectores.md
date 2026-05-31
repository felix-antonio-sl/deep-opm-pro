# Vectores de Ataque — DAU (:8080)

## CRÍTICOS

### V-DAU-1 | Exfiltración del board de urgencia
- **Endpoint:** `listadoPacientesBox/listadoPacientesBox.php`
- **Datos expuestos:** nombre, edad, motivo, box, ESI, médico, tiempo de espera
- **Explotación:** GET con sesión válida — una request
- **Impacto:** privacidad de todos los pacientes en urgencia. Datos vendibles
- **Remediación:** limitar campos expuestos, requerir rol específico

## ALTOS

### V-DAU-2 | Triage sin control de acceso por paciente
- **Endpoint:** `triageprueba/listadoTriage.php?c=<codAdmision>` (secuencial)
- **Datos expuestos:** signos vitales, alergias, AM, medicación crónica, motivo de consulta, categoría ESI
- **Explotación:** iterar `codAdmision`
- **Remediación:** binding de sesión a médico tratante del paciente

### V-DAU-3 | CIE-10 — falso negativo por método HTTP
- **Endpoint:** `obtener_cie.php` — GET funciona, POST devuelve `<tbody></tbody>` vacío
- **Explotación:** si un integrador usa POST por error → diagnósticos invisibles
- **Impacto:** decisión clínica sin diagnósticos
- **Remediación:** aceptar ambos métodos o devolver error explícito en POST

### V-DAU-4 | Identidad perdida en atención cerrada
- **Endpoint:** `atencion/index.php?a=<id>` — hidden fields vacíos si está cerrada
- **Impacto:** imposible verificar RUT del paciente post-alta
- **Remediación:** persistir identidad incluso en atención cerrada

### V-DAU-5 | Scanner endpoint rompe convención de parámetros
- **Endpoint:** `obtener_lista_exa_scanner.php` usa `c`/`cp` en vez de `a`/`u`
- **Explotación:** usar `a`/`u` → respuesta vacía sin error → falso negativo
- **Remediación:** unificar API de parámetros

### V-DAU-6 | Recetas solo POST (falso negativo en GET)
- **Endpoint:** `obtener_lista_recetas.php` — GET = vacío
- **Impacto:** recetas invisibles si el método es incorrecto
- **Remediación:** aceptar GET o devolver error

## MEDIOS

### V-DAU-7 | HTML injection en notas clínicas
- **Vector:** onclick con texto libre: `mostrar_anamnesis(id,'<texto>')`
- **Explotación:** inyectar `')` para romper el atributo e insertar JS
- **Impacto:** XSS persistente, robo de sesiones
- **Remediación:** escapar comillas en el PHP del DAU

## BAJOS

### V-DAU-8 | Board sin RUT — N+1 para resolver identidad
- **Vector:** `listadoPacientesBox.php` no expone RUT
- **Explotación:** requiere llamar `atencion/index.php` por cada fila → N requests
- **Impacto:** amplificación de tráfico, potencial DoS si el board tiene muchos pacientes
- **Remediación:** exponer RUT en el board (requiere balance con privacidad)
