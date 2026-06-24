# API Contracts

## Estado

Contrato API MVP definido en `TASK-004`.

Este documento describe contratos para una API HTTP futura, preferiblemente Azure Functions bajo `/api`. No implementa endpoints, no conecta Azure SQL y no guarda secretos.

## Convenciones

- Base API: `/api`.
- Formato: JSON.
- Fechas: ISO 8601 en UTC.
- Moneda MVP: CRC.
- Multi-tenant: todos los endpoints deben resolver `company_id` server-side desde sesion/token/configuracion, no desde campos libres del cliente.
- Autenticacion completa queda pendiente; para MVP, asumir usuario autenticado y `currentUserId` resuelto server-side.
- Permisos MVP definidos en `docs/AUTH_PERMISSIONS.md`.
- No exponer connection strings, tokens, passwords, PINs ni errores internos.

## Formato de respuesta

Exito con objeto:

```json
{
  "data": {}
}
```

Exito con lista:

```json
{
  "data": [],
  "pagination": {
    "limit": 50,
    "offset": 0,
    "total": 0
  }
}
```

Error:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [
      {
        "field": "name",
        "message": "Required field."
      }
    ]
  }
}
```

## Codigos de error

| Codigo | HTTP | Uso |
| --- | --- | --- |
| `VALIDATION_ERROR` | 400 | Campos invalidos o faltantes. |
| `UNAUTHORIZED` | 401 | Usuario no autenticado. |
| `FORBIDDEN` | 403 | Usuario sin permiso para la accion. |
| `NOT_FOUND` | 404 | Recurso inexistente o fuera de la empresa actual. |
| `CONFLICT` | 409 | Duplicado, estado invalido o version inconsistente. |
| `INSUFFICIENT_STOCK` | 409 | Stock insuficiente al cobrar o ajustar. |
| `SHIFT_REQUIRED` | 409 | Se requiere turno de caja abierto. |
| `INVALID_STATE` | 409 | La entidad no permite la transicion solicitada. |
| `INTERNAL_ERROR` | 500 | Error no esperado, sin detalles internos. |

## Validaciones globales server-side

- Toda lectura/escritura debe filtrar por empresa actual.
- IDs recibidos deben existir y pertenecer a la empresa actual.
- Montos y cantidades no pueden ser negativos; cantidades operativas deben ser mayores a cero.
- Textos deben recortarse y respetar maximos de longitud del modelo.
- `sku`, `barcode`, `ticketNumber` y codigos funcionales deben validar unicidad por empresa.
- Estados deben transicionar solo por acciones permitidas.
- Operaciones de cobro deben ser atomicas: venta, lineas, pagos, movimientos de caja e inventario.
- Cuentas abiertas no descuentan inventario; el descuento ocurre al cobrar.
- Articulos preparados descuentan ingredientes segun receta al cobrar.

## Catalogo

### Categorias

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/categories` | Lista categorias activas/inactivas. |
| POST | `/api/categories` | Crea categoria. |
| PATCH | `/api/categories/{categoryId}` | Actualiza nombre, orden o estado. |

POST/PATCH:

```json
{
  "name": "Cafe",
  "sortOrder": 10,
  "isActive": true
}
```

Validaciones:

- `name` requerido y unico por empresa.
- `sortOrder` entero no negativo.

### Articulos, materia prima e insumos

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/items` | Lista articulos, materia prima e insumos. |
| GET | `/api/items/{itemId}` | Detalle de articulo. |
| POST | `/api/items` | Crea articulo. |
| PATCH | `/api/items/{itemId}` | Actualiza articulo. |

Query:

- `type`: `purchased_product`, `prepared_product`, `raw_material`, `operational_supply`, `deposit_container`.
- `categoryId`: filtro por categoria.
- `active`: `true`, `false` o vacio.
- `search`: nombre, SKU o barcode.
- `limit`, `offset`.

POST/PATCH:

```json
{
  "categoryId": 1,
  "itemType": "prepared_product",
  "sku": "CAF-003",
  "barcode": null,
  "name": "Capuchino",
  "description": "Bebida preparada",
  "baseUnit": "unit",
  "salePrice": 1850,
  "costAmount": 232,
  "taxRate": 0.13,
  "tracksInventory": true,
  "stockMinimum": 0,
  "isFavorite": true,
  "isActive": true
}
```

Validaciones:

- `itemType` debe existir en el modelo de datos.
- `baseUnit` debe ser `unit`, `g`, `kg`, `ml` o `l`.
- `sku` requerido y unico por empresa.
- `barcode` unico por empresa cuando existe.
- `salePrice`, `costAmount`, `taxRate` y `stockMinimum` no negativos.
- `prepared_product` debe tener receta activa antes de venderse como preparado.

## Recetas

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/recipes` | Lista recetas. |
| GET | `/api/recipes/{recipeId}` | Detalle con ingredientes. |
| POST | `/api/recipes` | Crea receta. |
| PUT | `/api/recipes/{recipeId}` | Reemplaza receta e ingredientes. |
| PATCH | `/api/recipes/{recipeId}` | Activa/inactiva receta. |

POST/PUT:

```json
{
  "outputItemId": 10,
  "name": "Capuchino",
  "outputQuantity": 1,
  "isActive": true,
  "ingredients": [
    {
      "ingredientItemId": 21,
      "quantity": 10,
      "unit": "g"
    },
    {
      "ingredientItemId": 22,
      "quantity": 150,
      "unit": "ml"
    }
  ]
}
```

Validaciones:

- `outputItemId` debe ser articulo de tipo `prepared_product`.
- Una receta activa por articulo preparado.
- Ingredientes deben existir y controlar inventario si se descontaran.
- `quantity` mayor a cero.
- Unidad compatible con el insumo.

## Cuentas abiertas

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/open-accounts` | Lista cuentas abiertas o historicas. |
| POST | `/api/open-accounts` | Crea cuenta abierta. |
| GET | `/api/open-accounts/{accountId}` | Detalle con lineas. |
| PATCH | `/api/open-accounts/{accountId}` | Renombra o cancela cuenta. |
| POST | `/api/open-accounts/{accountId}/lines` | Agrega linea. |
| PATCH | `/api/open-accounts/{accountId}/lines/{lineId}` | Cambia cantidad, precio autorizado o descuento. |
| DELETE | `/api/open-accounts/{accountId}/lines/{lineId}` | Elimina linea. |

Crear cuenta:

```json
{
  "terminalId": 1,
  "cashShiftId": 5,
  "customerId": null,
  "name": "Mostrador 1"
}
```

Agregar linea:

```json
{
  "itemId": 10,
  "quantity": 2,
  "unitPrice": 1850,
  "discountAmount": 0,
  "notes": ""
}
```

Validaciones:

- Solo cuentas `open` aceptan cambios de lineas.
- `quantity` mayor a cero.
- Cambios de precio/descuento requieren permiso server-side.
- Cancelar requiere motivo.
- No crear movimientos de inventario en cuentas abiertas.

## Ventas, pagos y tickets

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| POST | `/api/sales/checkout` | Cobra cuenta abierta o venta rapida. |
| GET | `/api/sales` | Lista ventas. |
| GET | `/api/sales/{saleId}` | Detalle de venta. |
| POST | `/api/sales/{saleId}/void` | Anula venta con motivo. |
| GET | `/api/sales/{saleId}/ticket` | Devuelve ticket interno imprimible. |

Checkout desde cuenta abierta:

```json
{
  "terminalId": 1,
  "cashShiftId": 5,
  "openAccountId": 12,
  "customerId": null,
  "payments": [
    {
      "paymentMethod": "cash",
      "amount": 5000,
      "reference": null
    },
    {
      "paymentMethod": "card",
      "amount": 755,
      "reference": "AUTH-123"
    }
  ]
}
```

Venta rapida sin cuenta abierta:

```json
{
  "terminalId": 1,
  "cashShiftId": 5,
  "customerId": null,
  "lines": [
    {
      "itemId": 10,
      "quantity": 2,
      "unitPrice": 1850,
      "discountAmount": 0
    }
  ],
  "payments": [
    {
      "paymentMethod": "cash",
      "amount": 4181
    }
  ]
}
```

Respuesta checkout:

```json
{
  "data": {
    "saleId": 1001,
    "ticketNumber": "PV-0001001",
    "status": "paid",
    "subtotalAmount": 3700,
    "taxAmount": 481,
    "totalAmount": 4181,
    "paidAt": "2026-06-20T20:00:00Z"
  }
}
```

Validaciones:

- Debe existir turno de caja abierto.
- Pagos deben sumar exactamente el total.
- Cobro debe ser transaccional.
- Si hay `openAccountId`, la cuenta debe estar `open`.
- Al cobrar, cambiar cuenta a `paid`.
- Generar `ticketNumber` unico por empresa.
- Para `purchased_product`, crear movimiento de inventario `sale`.
- Para `prepared_product`, crear movimientos `recipe_consumption` por ingrediente.
- Si falta stock, responder `INSUFFICIENT_STOCK` y no crear venta parcial.
- Anular requiere motivo y permiso.

Ticket:

```json
{
  "data": {
    "ticketNumber": "PV-0001001",
    "status": "paid",
    "businessName": "Cafeteria Central",
    "paidAt": "2026-06-20T20:00:00Z",
    "terminalName": "Caja 1",
    "cashierName": "Pedro",
    "lines": [
      {
        "name": "Capuchino",
        "quantity": 2,
        "unitPrice": 1850,
        "lineTotal": 3700
      }
    ],
    "payments": [
      {
        "paymentMethod": "cash",
        "amount": 4181
      }
    ],
    "totalAmount": 4181
  }
}
```

Formato visual y campos canonicos:

- `docs/TICKET_FORMAT_MVP.md`

## Compras

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/suppliers` | Lista proveedores. |
| POST | `/api/suppliers` | Crea proveedor. |
| GET | `/api/purchases` | Lista compras. |
| GET | `/api/purchases/{purchaseId}` | Detalle de compra. |
| POST | `/api/purchases` | Registra compra. |
| POST | `/api/purchases/{purchaseId}/void` | Anula compra con motivo. |

Crear compra:

```json
{
  "supplierId": 3,
  "supplierInvoiceReference": "FAC-908",
  "status": "posted",
  "notes": "",
  "lines": [
    {
      "itemId": 21,
      "quantity": 1000,
      "unitCost": 8.6,
      "taxAmount": 0
    }
  ]
}
```

Validaciones:

- Compra `posted` aumenta inventario con movimiento `purchase`.
- `quantity` mayor a cero.
- `unitCost` y `taxAmount` no negativos.
- Proveedor opcional para compra simple.
- Anular requiere motivo; reversa de inventario debe ser transaccional.

## Inventario

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/inventory/stock` | Stock actual por articulo/insumo. |
| GET | `/api/inventory/movements` | Movimientos de inventario. |
| POST | `/api/inventory/adjustments` | Ajuste manual o merma. |

Ajuste:

```json
{
  "itemId": 21,
  "movementType": "manual_adjustment",
  "quantityDelta": -250,
  "unit": "g",
  "reason": "Merma por calibracion de molino"
}
```

Validaciones:

- `quantityDelta` no puede ser cero.
- Ajuste manual o merma requiere motivo.
- No permitir stock negativo salvo decision explicita futura.
- Unidad debe ser compatible con el articulo.

## Caja y turnos

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/cash-shifts/current` | Turno abierto actual por terminal. |
| POST | `/api/cash-shifts/open` | Abre turno de caja. |
| POST | `/api/cash-shifts/{shiftId}/movements` | Entrada o salida manual de efectivo. |
| POST | `/api/cash-shifts/{shiftId}/close` | Cierra turno. |
| GET | `/api/cash-shifts/{shiftId}` | Detalle de turno. |

Abrir:

```json
{
  "terminalId": 1,
  "openingCashAmount": 25000
}
```

Movimiento:

```json
{
  "movementType": "cash_out",
  "amount": 5000,
  "reason": "Compra menor de emergencia"
}
```

Cerrar:

```json
{
  "countedCashAmount": 61250,
  "notes": "Cierre sin diferencia relevante"
}
```

Validaciones:

- Una terminal no debe tener dos turnos abiertos simultaneos.
- Montos no negativos; movimientos manuales requieren motivo.
- Cierre calcula esperado, contado y diferencia server-side.
- No cobrar ventas si no hay turno abierto.

## Reportes MVP

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/api/reports/sales-summary` | Ventas por dia/rango y totales. |
| GET | `/api/reports/sales-by-item` | Ventas por producto. |
| GET | `/api/reports/sales-by-category` | Ventas por categoria. |
| GET | `/api/reports/sales-by-payment-method` | Ventas por metodo de pago. |
| GET | `/api/reports/cash-shift/{shiftId}` | Cierre de caja. |
| GET | `/api/reports/top-items` | Productos mas vendidos. |
| GET | `/api/reports/low-stock` | Productos bajo minimo. |

Query comun:

- `from`: fecha/hora inicio UTC.
- `to`: fecha/hora fin UTC.
- `terminalId`: opcional.
- `limit`: opcional para rankings.

Respuesta resumen:

```json
{
  "data": {
    "from": "2026-06-20T00:00:00Z",
    "to": "2026-06-21T00:00:00Z",
    "salesCount": 42,
    "subtotalAmount": 210000,
    "taxAmount": 27300,
    "totalAmount": 237300
  }
}
```

Validaciones:

- `from` debe ser menor que `to`.
- Rango maximo recomendado para MVP: 31 dias.
- Reportes nunca deben mezclar empresas.

## Notas para implementacion futura

- Crear carpeta `api/` solo en tarea de implementacion Backend/API.
- Empezar con tests unitarios y dobles de repositorio.
- Usar Azure SQL real solo para migracion aprobada o smoke final.
- Mantener CORS acotado al dominio de Static Web Apps y localhost necesario.
- No imprimir payloads sensibles completos en logs.
