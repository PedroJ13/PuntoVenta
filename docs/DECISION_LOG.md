# Decision Log

Registrar solo decisiones durables que cambian alcance, arquitectura, costos, seguridad o flujo de trabajo.

## Formato

```md
## YYYY-MM-DD - Titulo

Decision:

Motivo:

Impacto:

Riesgo aceptado:
```

## Decisiones iniciales

## 2026-06-20 - Alcance inicial de PuntoVenta

Decision:

Construir un sistema web de punto de venta para cafeteria/despacho, enfocado primero en venta de mostrador, cuentas abiertas, ticket de caja, inventario, materia prima, articulos y recetas.

Motivo:

El PO necesita una caja rapida para operar ventas y controlar insumos/productos sin la complejidad de mesas de restaurante.

Impacto:

El MVP se disena alrededor de la pantalla de ventas y operaciones de caja, no como ERP completo.

Riesgo aceptado:

Algunas capacidades administrativas quedaran simples al inicio.

## 2026-06-20 - Facturacion electronica fuera de alcance actual

Decision:

La facturacion electronica queda fuera del alcance actual. El sistema generara ticket de caja.

Motivo:

El objetivo inmediato es operar caja y dar vision del producto sin integrar Hacienda/proveedor fiscal.

Impacto:

El flujo de cobro termina en ticket interno imprimible/reimprimible.

Riesgo aceptado:

Una fase futura debera revisar requerimientos fiscales si el negocio lo solicita.

## 2026-06-20 - Inventario por receta y consumo variable

Decision:

La materia prima se controla en unidades base, por ejemplo cafe en gramos, y los articulos preparados descuentan inventario segun receta al vender.

Motivo:

Un kilo de cafe no se convierte anticipadamente en 100 productos iguales; puede terminar en diferentes combinaciones de express, americanos y capuchinos.

Impacto:

El modelo de datos debe separar materia prima, articulo de venta, receta y consumo teorico.

Riesgo aceptado:

La merma real y diferencia contra consumo teorico requeriran ajustes o control avanzado en una fase posterior.

## 2026-06-20 - Cierre de alcance MVP operativo

Decision:

El primer MVP queda enfocado en caja rapida, cuentas abiertas, ticket interno, caja/turno, catalogo, compras simples, inventario por materia prima/receta y reportes basicos. Quedan fuera del primer corte: facturacion electronica, multi-sucursal, modo offline, impresora termica real, contabilidad, programa de lealtad, depositos/envases retornables y codigo de barras obligatorio.

Motivo:

El prototipo aprobado ya valida la direccion funcional y el riesgo principal ahora es crecer el alcance antes de cerrar caja e inventario minimo.

Impacto:

Las tareas tecnicas deben priorizar modelo de datos, app base con datos falsos, checklist QA de caja y contratos API antes de integrar servicios reales.

Riesgo aceptado:

Algunas funciones utiles para operacion futura se documentan como P1/P2 o post-MVP y no bloquearan el primer piloto.

## 2026-06-20 - Reglas MVP de caja, cuentas e inventario

Decision:

Las cuentas abiertas no descuentan inventario al agregar articulos; el descuento ocurre al cobrar. El cliente por defecto sera consumidor final. El MVP usara una sola caja/terminal inicial. Los articulos preparados descuentan insumos segun receta al vender, no mediante produccion previa por lote.

Motivo:

Estas reglas reducen complejidad operativa y mantienen el foco en una caja funcional para cafeteria/despacho.

Impacto:

El modelo de datos debe soportar cuentas abiertas como ventas en preparacion, ventas cobradas como evento que afecta inventario y caja, y recetas con consumo teorico por unidad vendida.

Riesgo aceptado:

No habra reserva de inventario para cuentas abiertas en el primer MVP; si una cuenta queda abierta mucho tiempo, el stock disponible puede requerir control operativo.

## 2026-06-20 - Impuestos y reportes MVP

Decision:

Los impuestos se manejaran en MVP como configuracion simple por articulo o tasa aplicable, sin integracion fiscal. Los reportes indispensables del primer piloto son ventas por dia/rango, ventas por producto/categoria, ventas por metodo de pago, cierre de caja, productos mas vendidos, stock actual y productos bajo minimo.

Motivo:

El MVP necesita totales operativos claros sin convertir el sistema en facturacion electronica ni contabilidad completa.

Impacto:

Backend/API y modelo de datos deben dejar campos suficientes para subtotal, impuesto simple, total, metodo de pago, cierre de caja e inventario minimo.

Riesgo aceptado:

Calculos fiscales avanzados, reportes contables y utilidad detallada quedan para fases posteriores.

