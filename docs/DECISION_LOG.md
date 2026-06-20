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

