# Ticket Format MVP

## Estado

Formato de ticket de caja MVP definido en `TASK-010`.

Este documento define el comprobante interno de caja para pantalla, reimpresion e impresion futura. No es factura electronica, no sustituye comprobantes fiscales y no implementa impresora termica.

## Objetivo

El ticket debe ser rapido de leer, imprimible en formato angosto y suficiente para:

- confirmar la venta al cliente;
- reimprimir un comprobante interno;
- consultar una venta desde historial;
- soportar anulacion futura con trazabilidad.

## Principios UX

- Primero identidad del negocio y numero interno.
- Luego fecha, caja, cajero y estado.
- Lineas de venta compactas y legibles.
- Totales claros, con total final destacado.
- Pagos separados del total para soportar pago mixto.
- Mensaje explicito: `Comprobante interno - no es factura electronica`.
- Evitar textos largos porque el formato futuro puede ser termico.

## Estados del ticket

### Venta pagada

Estado normal posterior a `POST /api/sales/checkout`.

Debe mostrar:

- Numero interno.
- Fecha/hora de pago.
- Lineas, totales y pagos.
- Estado visual: `PAGADO`.

### Reimpresion

Mismo contenido de la venta pagada, con marca adicional:

```text
REIMPRESION
```

Reglas:

- No debe generar un nuevo numero interno.
- Debe conservar fecha/hora original de pago.
- Puede mostrar fecha/hora de reimpresion si backend la provee.
- Debe ser claro que es copia del comprobante interno.

### Anulacion futura

Cuando una venta anulada pueda consultarse o reimprimirse:

```text
ANULADO
Motivo: <motivo corto>
Anulado por: <usuario>
Fecha anulacion: <fecha/hora>
```

Reglas:

- No ocultar importes originales.
- No permitir que un ticket anulado parezca cobro vigente.
- Motivo obligatorio.

## Campos obligatorios

### Encabezado

| Campo | Ejemplo | Fuente sugerida |
| --- | --- | --- |
| Nombre del negocio | `Cafeteria Central` | Configuracion empresa. |
| Texto de tipo | `Ticket de caja` | Constante UI/API. |
| Estado | `PAGADO` | `sales.status`. |
| Numero interno | `PV-0001001` | `sales.ticketNumber`. |
| Fecha/hora venta | `21/06/2026 08:30` | `sales.paidAt`, zona local de negocio para UI. |
| Caja/terminal | `Caja 1` | `terminal`. |
| Cajero | `Pedro` | Usuario vendedor. |

### Lineas

| Campo | Ejemplo |
| --- | --- |
| Nombre articulo | `Capuchino` |
| Cantidad | `2` |
| Precio unitario | `CRC 1,850` |
| Total linea | `CRC 3,700` |

### Totales

| Campo | Ejemplo |
| --- | --- |
| Subtotal | `CRC 3,700` |
| Descuento | `CRC 0` |
| Impuesto | `CRC 481` |
| Total | `CRC 4,181` |

### Pagos

| Campo | Ejemplo |
| --- | --- |
| Metodo | `Efectivo` |
| Monto | `CRC 4,181` |
| Referencia opcional | `AUTH-123` |

### Pie

Texto obligatorio:

```text
Comprobante interno - no es factura electronica
Gracias por su compra
```

## Campos opcionales MVP

- Nombre o referencia de cuenta abierta.
- Cliente, si no es consumidor final.
- Referencia de pago tarjeta/SINPE.
- Fecha/hora de reimpresion.
- Nombre comercial adicional.
- Telefono o direccion corta del negocio.
- Nota corta del negocio.

No incluir en MVP:

- Clave fiscal.
- QR fiscal.
- Consecutivo Hacienda.
- Detalle contable.
- Datos sensibles de tarjeta.

## Orden visual recomendado

```text
CAFETERIA CENTRAL
Ticket de caja
PAGADO

No. PV-0001001
Fecha: 21/06/2026 08:30
Caja: Caja 1
Cajero: Pedro

--------------------------------
2 x Capuchino
    CRC 1,850        CRC 3,700
1 x Croissant mantequilla
    CRC 1,600        CRC 1,600
--------------------------------
Subtotal             CRC 5,300
Descuento            CRC 0
Impuesto             CRC 689
TOTAL                CRC 5,989
--------------------------------
Pago efectivo        CRC 3,000
Pago tarjeta         CRC 2,989

Comprobante interno - no es factura electronica
Gracias por su compra
```

## Jerarquia visual

1. Negocio: centrado, mayusculas o peso alto.
2. Estado: visible cerca del encabezado.
3. Numero interno: facil de ubicar para reimpresion.
4. Lineas: cantidad y nombre primero; importes alineados.
5. Total: mayor peso visual.
6. Mensaje legal interno: claro, sin competir con total.

## Copy canonico

Usar estos textos en UI/API:

| Concepto | Texto |
| --- | --- |
| Tipo | `Ticket de caja` |
| Estado pagado | `PAGADO` |
| Reimpresion | `REIMPRESION` |
| Anulado | `ANULADO` |
| Numero | `No.` |
| Fecha | `Fecha` |
| Caja | `Caja` |
| Cajero | `Cajero` |
| Subtotal | `Subtotal` |
| Descuento | `Descuento` |
| Impuesto | `Impuesto` |
| Total | `TOTAL` |
| Efectivo | `Pago efectivo` |
| Tarjeta | `Pago tarjeta` |
| Transferencia/SINPE | `Pago SINPE` |
| Nota fiscal | `Comprobante interno - no es factura electronica` |
| Cierre | `Gracias por su compra` |

## Contrato API sugerido para ticket

`GET /api/sales/{saleId}/ticket` debe incluir, como minimo:

```json
{
  "data": {
    "ticketNumber": "PV-0001001",
    "status": "paid",
    "businessName": "Cafeteria Central",
    "paidAt": "2026-06-21T14:30:00Z",
    "terminalName": "Caja 1",
    "cashierName": "Pedro",
    "accountName": "Mostrador 1",
    "lines": [
      {
        "name": "Capuchino",
        "quantity": 2,
        "unitPrice": 1850,
        "discountAmount": 0,
        "taxAmount": 481,
        "lineTotal": 3700
      }
    ],
    "subtotalAmount": 3700,
    "discountAmount": 0,
    "taxAmount": 481,
    "totalAmount": 4181,
    "payments": [
      {
        "paymentMethod": "cash",
        "amount": 4181,
        "reference": null
      }
    ],
    "footerNote": "Comprobante interno - no es factura electronica"
  }
}
```

## Restricciones para impresora termica futura

- Disenar para ancho angosto: 32 a 42 caracteres aproximados.
- No depender de colores.
- No depender de logos o imagenes para entender el ticket.
- Usar texto corto y alineacion simple.
- Evitar tablas anchas.
- Mantener nombres largos en una o dos lineas.
- Preparar salida imprimible HTML primero; integracion con impresora queda para fase posterior.

## Recomendaciones para UI actual

- El dialog actual de recibo puede evolucionar hacia este orden visual.
- Agregar numero interno cuando backend lo provea.
- Agregar subtotal, impuesto y pagos, no solo total.
- Agregar texto `Comprobante interno - no es factura electronica`.
- Agregar marca `REIMPRESION` cuando se abra desde historial.
- Agregar estado `ANULADO` cuando corresponda.

## Tareas posteriores recomendadas

- Web Dev: actualizar dialog de ticket en `app/` para reflejar este formato.
- Backend/API: ampliar contrato `GET /api/sales/{saleId}/ticket` con campos de caja, cajero, subtotal, descuento, impuesto, pagos y estado.
- QA: agregar casos de ticket pagado, reimpresion y anulado futuro al checklist.
- Diseno/UX: validar legibilidad en ancho termico antes de integrar impresora real.
