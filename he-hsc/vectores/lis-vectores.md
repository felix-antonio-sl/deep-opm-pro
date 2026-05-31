# Vectores de Ataque — LIS (:8084)

## CRÍTICOS

### V-LIS-1 | Resultados de cualquier paciente por RUT
- **Endpoint:** `resultadoseleccion.php` (POST `rut=X&BotonAccion=Buscar`)
- **Explotación:** sesión LIS válida + cualquier RUT → todos los exámenes validados
- **Impacto:** VIH, drogas, embarazo, marcadores tumorales — sin trazabilidad
- **Remediación:** binding de sesión a médico-paciente; log de acceso

## ALTOS

### V-LIS-2 | RUT sin dígito verificador — colisión de identidad
- **Endpoint:** `resultadoseleccion.php` recibe `rut` sin DV
- **Explotación:** error de tipeo (12345678 vs 12345679) → resultados de otro paciente
- **Impacto:** resultado atribuido al paciente equivocado → error clínico
- **Remediación:** validar DV en el LIS; rechazar RUTs inválidos

### V-LIS-3 | PDFs sin protección — exfiltración masiva por ID secuencial
- **Endpoint:** `detalleexamenes.php?id=X&user=Y`
- **Explotación:** iterar `id` → descargar todos los PDFs de laboratorio
- **Impacto:** resultados de todos los pacientes en formato imprimible
- **Remediación:** verificar binding paciente-sesión antes de servir PDF

## MEDIOS

### V-LIS-4 | Ejecución de pdftotext sobre PDFs del servidor
- **Vector:** el CLI ejecuta `pdftotext` sobre PDFs de `detalleexamenes.php`
- **Explotación:** si el LIS es comprometido → PDF malicioso → RCE en host del CLI
- **Impacto:** pivoteo de LIS a infraestructura de agentes
- **Remediación:** sandbox para pdftotext; validación de integridad del PDF

### V-LIS-5 | Sin LOINC, sin SNOMED, sin HL7
- **Vector:** nombres de exámenes en texto libre, sin codificación estándar
- **Impacto:** resultados no interoperables; correlación frágil entre órdenes y resultados
- **Remediación:** mapear catálogo local a LOINC (largo plazo)
