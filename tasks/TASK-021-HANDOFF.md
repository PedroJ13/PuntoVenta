# TASK-021 - Handoff

Nombre del equipo/chat: QA
Modo: QA
Nombre de la tarea: QA revalidar montos CRC en app y API local
Archivo de tarea: `tasks/TASK-021.md`

## Resultado

Status: aprobada

Se revalido el hallazgo P2 de `TASK-019` sobre montos CRC con decimales. El hallazgo queda cerrado.

Resultado general: aprobado. No hay P0/P1/P2 abiertos sobre el alcance de esta revalidacion.

## Ambiente

- Fecha: 2026-06-21
- API local: `http://127.0.0.1:7071`
- App local: `app/index.html` / modulos `app/src/state.js` y `app/src/ui.js`
- Caso revalidado: Capuchino `1850 * 0.13 = 240.5`
- Uso DB cloud: No
- Uso Azure SQL: No
- Recursos Azure creados: No

## Archivos cambiados

- `docs/TASK_BOARD.md`
- `tasks/TASK-021.md`
- `tasks/TASK-021-HANDOFF.md`

## Verificacion ejecutada

- Lectura de `tasks/TASK-021.md`.
- Lectura de `tasks/TASK-019-HANDOFF.md`.
- Lectura de `tasks/TASK-020-HANDOFF.md`.
- Lectura de `docs/QA_CHECKLIST_FLUJO_CAJA.md`.
- `node --test` desde `api/`: 20 tests pasan.
- Flujo integrado app/API local con API fake embebida en `127.0.0.1:7071`.
- Validacion de cuenta abierta, checkout, ticket y formato UI.
- Busqueda local de secretos/SQL en `api/` y `app/`.

## Resultado por caso

| ID | Resultado | Evidencia / nota |
| --- | --- | --- |
| CRC-001 | Pasa | App conecta con API fake local. |
| CRC-002 | Pasa | Cuenta abierta con Capuchino devuelve enteros: subtotal `1850`, impuesto `241`, total `2091`. |
| CRC-003 | Pasa | Checkout/ticket API devuelve enteros: `subtotalAmount=1850`, `taxAmount=241`, `totalAmount=2091`, `paymentAmount=2091`, `lineTaxAmount=241`, `lineTotal=1850`. |
| CRC-004 | Pasa | Formato UI no muestra decimales: subtotal `₡1 850`, impuesto `₡241`, total `₡2 091`. |
| CRC-005 | Pasa | `showReceipt()` abre ticket `PV-0001001` y renderiza pago SINPE `₡2 091`. |

## Evidencia de ticket app

```text
receiptNumber: PV-0001001
receiptTax: ₡241
receiptTotal: ₡2 091
receiptPayments: Pago SINPE / ₡2 091
receiptLines: Capuchino / 1 x ₡1 850 / ₡1 850
```

## Hallazgos

### P0/P1

- Ninguno.

### P2/P3

- Ninguno. El P2 de `TASK-019` queda cerrado.

## Riesgos o pendientes

- La validacion fue local con API fake en memoria; no cubre Azure SQL, deploy ni persistencia real.
- La regla de redondeo al colon mas cercano queda validada para la API fake. Si luego se define regla fiscal avanzada, debe tratarse como cambio de contrato.

## Recomendacion QA

Avanzar:

- Proyecto puede cerrar el hallazgo P2 de `TASK-019`.
- Proyecto puede procesar `TASK-021` y marcarlo `Done` si no requiere revision adicional.

## Movimiento de tablero

- De: In Progress
- A: Needs Review

