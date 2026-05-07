# Logistica de Envios

**Propósito:** Transformar un pedido en una entrega mediante procesamiento logistico con tres sub-procesos.

**Descripción:** Modelo multi-nivel: SD con in-zooming a SD1 (Recibir Pedido, Preparar Paquete, Enviar Paquete). Incluye invocacion entre sub-procesos.

**OPDs:** SD, SD1
**Entidades:** 8
**Enlaces:** 8
**Estados:** 0

## OPL-ES

```
SD del sistema Logistica de Envios.
Pedido es un objeto fisico.
Operador Logistico es un objeto fisico y ambiental.
Sistema Logistico es un objeto fisico.
Procesar Envio es un proceso fisico.
Entrega es un objeto fisico.
Procesar Envio consume Pedido.
Procesar Envio produce Entrega.
Operador Logistico manipula Procesar Envio.
Procesar Envio usa Sistema Logistico.

SD1 del sistema Logistica de Envios.
Procesar Envio es un proceso fisico.
Pedido es un objeto fisico.
Entrega es un objeto fisico.
Operador Logistico es un objeto fisico y ambiental.
Sistema Logistico es un objeto fisico.
Recibir Pedido es un proceso fisico.
Preparar Paquete es un proceso fisico.
Enviar Paquete es un proceso fisico.
Recibir Pedido consume Pedido.
Enviar Paquete produce Entrega.
Operador Logistico manipula Procesar Envio.
Procesar Envio usa Sistema Logistico.
Recibir Pedido invoca Preparar Paquete.
Preparar Paquete invoca Enviar Paquete.
```