# Flujo operativo de caja diaria MVP

## Estado

Definicion funcional y UX creada en `TASK-026`.

Este documento define el flujo minimo de apertura, operacion y cierre de caja diaria para el MVP local. No implementa codigo, no modifica API, no modifica base de datos y no conecta SQL Server ni Azure SQL.

## Objetivo

Permitir que una cafeteria o despacho opere un turno real de caja con:

- Apertura de caja.
- Ventas y cuentas abiertas durante el turno.
- Movimientos manuales de efectivo.
- Cierre con arqueo.
- Diferencias documentadas.
- Resumen por metodo de pago.
- Mensajes claros para cajero, encargado y administrador.

## Principios UX

- La caja debe sentirse rapida y operativa, no contable.
- El cajero debe ver siempre si la caja esta sin abrir, abierta o cerrada.
- Ninguna venta se cobra sin turno de caja abierto.
- Los montos se muestran en CRC enteros.
- Las diferencias se explican con lenguaje simple: esperado, contado y diferencia.
- Las acciones irreversibles requieren confirmacion.
- Un turno cerrado queda solo lectura para cajero.

## Estados de caja

| Estado | Significado | Acciones permitidas |
| --- | --- | --- |
| Sin abrir | No hay turno abierto para la terminal actual. | Abrir caja, consultar cierres anteriores. |
| Abierta | Hay un turno activo para la terminal y cajero. | Vender, cobrar cuentas abiertas, registrar movimientos, ver resumen parcial, cerrar caja. |
| Cerrada | El turno fue arqueado y cerrado. | Ver resumen, imprimir/exportar reporte futuro, consultar detalle. |

Reglas:

- Una terminal no debe tener mas de un turno abierto.
- Si la caja esta sin abrir, el flujo de venta puede permitir armar carrito/cuenta, pero no cobrar.
- Si la caja esta cerrada, no se permiten nuevos cobros ni movimientos sobre ese turno.
- Si existe una cuenta abierta pendiente, el sistema debe advertir antes de cerrar caja.

## Apertura de caja

### Entrada al flujo

La pantalla principal debe mostrar un aviso visible cuando no hay caja abierta:

- Titulo: `Caja sin abrir`
- Accion primaria: `Abrir caja`
- Accion secundaria: `Ver cierres anteriores` futura/opcional.

### Datos minimos

| Campo | Regla UX |
| --- | --- |
| Terminal/caja | Seleccionada por defecto si solo existe una terminal. |
| Cajero | Usuario autenticado, no editable por cajero. |
| Monto inicial | CRC entero, requerido, permite cero. |
| Nota de apertura | Opcional, maximo corto. |

### Confirmacion

Antes de abrir:

- Mostrar terminal, cajero y monto inicial.
- Boton primario: `Abrir caja`.
- Boton secundario: `Cancelar`.

### Resultado esperado

Al abrir correctamente:

- Estado cambia a `Caja abierta`.
- Se muestra monto inicial.
- Se habilitan cobros, cuentas abiertas y movimientos.
- Se registra hora de apertura y usuario.

## Operacion durante caja abierta

### Ventas y cuentas abiertas

Durante caja abierta:

- Venta rapida puede cobrarse.
- Cuenta abierta puede cobrarse.
- Pagos pueden ser `cash`, `card`, `transfer` u `other`.
- Pago mixto suma varios metodos sobre la misma venta.
- Solo pagos en efectivo afectan efectivo esperado en caja.

Reglas:

- El total pagado debe igualar el total de la venta.
- La venta cobrada genera ticket interno.
- Anular una venta requiere permiso y motivo en tarea futura o flujo ya definido por Backend/API.

### Resumen parcial

La caja abierta debe ofrecer un resumen de lectura rapida:

| Dato | Significado |
| --- | --- |
| Monto inicial | Base de efectivo al abrir. |
| Ventas en efectivo | Total de pagos `cash` del turno. |
| Entradas manuales | Ingresos de efectivo registrados manualmente. |
| Salidas manuales | Egresos de efectivo registrados manualmente. |
| Efectivo esperado | Inicial + ventas efectivo + ingresos - salidas + ajustes. |
| Ventas por tarjeta | Total informativo por metodo. |
| Ventas por transferencia | Total informativo por metodo. |
| Otros pagos | Total informativo por metodo. |
| Total vendido | Suma de ventas cobradas del turno. |

## Movimientos manuales

### Tipos

| Tipo | Uso | Impacto |
| --- | --- | --- |
| Ingreso | Dinero que entra a caja sin ser venta. | Suma al efectivo esperado. |
| Egreso | Dinero que sale de caja. | Resta al efectivo esperado. |
| Ajuste | Correccion operativa autorizada. | Suma o resta segun signo definido por la accion. |

### Datos minimos

| Campo | Regla UX |
| --- | --- |
| Tipo | Requerido. |
| Monto | CRC entero, mayor a cero. |
| Motivo | Requerido. |
| Referencia | Opcional. |
| Usuario | Usuario actual, no editable por cajero. |

### Motivos sugeridos

- Compra menor.
- Cambio para caja.
- Retiro parcial.
- Correccion por error operativo.
- Otro.

### Confirmacion

Toda entrada, salida o ajuste debe confirmar:

- Tipo.
- Monto.
- Motivo.
- Nuevo efectivo esperado estimado.

## Cierre y arqueo

### Entrada al flujo

Desde caja abierta, accion `Cerrar caja`.

Antes de permitir el cierre, mostrar:

- Ventas cobradas.
- Cuentas abiertas pendientes.
- Movimientos manuales.
- Resumen por metodo de pago.
- Efectivo esperado.

Si hay cuentas abiertas pendientes, mostrar advertencia:

- Se puede bloquear el cierre o permitir cierre con confirmacion de encargado, segun decision de producto futura.
- Para el MVP recomendado: bloquear cierre hasta cobrar o cancelar las cuentas abiertas.

### Datos minimos de cierre

| Campo | Regla UX |
| --- | --- |
| Efectivo contado | CRC entero, requerido, permite cero. |
| Total tarjeta reportado | CRC entero opcional para conciliacion manual. |
| Total transferencia reportado | CRC entero opcional para conciliacion manual. |
| Otros pagos reportados | CRC entero opcional para conciliacion manual. |
| Nota de cierre | Requerida si existe diferencia fuera de cero. |

### Calculos

```text
efectivo_esperado = monto_inicial + pagos_efectivo + ingresos_manuales - egresos_manuales + ajustes
diferencia_efectivo = efectivo_contado - efectivo_esperado
```

Interpretacion:

- `0`: caja cuadrada.
- Mayor a `0`: sobrante.
- Menor a `0`: faltante.

## Reglas de diferencia

| Caso | Comportamiento |
| --- | --- |
| Diferencia cero | Permitir cierre con confirmacion simple. |
| Diferencia distinta de cero | Requerir nota de cierre. |
| Diferencia alta | Requerir confirmacion de encargado o permiso futuro. |
| Monto contado vacio | Bloquear cierre. |
| Monto contado negativo | Bloquear cierre. |

Umbral MVP sugerido para considerar diferencia alta:

- `1000` CRC o mas en valor absoluto.

Este umbral es configurable en producto futuro; para MVP puede quedar como regla documentada hasta que Backend/API lo formalice.

## Resumen por metodo de pago

El cierre debe presentar al menos:

| Metodo | Fuente | Uso |
| --- | --- | --- |
| Efectivo | Pagos `cash` del turno. | Calcula efectivo esperado. |
| Tarjeta | Pagos `card` del turno. | Conciliacion informativa. |
| Transferencia | Pagos `transfer` del turno. | Conciliacion informativa. |
| Otro | Pagos `other` del turno. | Conciliacion informativa. |

Para cada metodo:

- Cantidad de pagos.
- Monto total.
- Monto reportado por cajero si aplica.
- Diferencia informativa si aplica.

La diferencia que bloquea cierre en MVP es la de efectivo. Diferencias de tarjeta/transferencia quedan como advertencia o nota, porque normalmente dependen de dataphone, banco o comprobante externo.

## Mensajes y errores

### Apertura

| Codigo funcional | Mensaje UX |
| --- | --- |
| Caja ya abierta | `Esta terminal ya tiene una caja abierta.` |
| Monto inicial invalido | `El monto inicial debe ser cero o mayor.` |
| Sin permiso | `No tienes permiso para abrir caja.` |
| Error inesperado | `No se pudo abrir la caja. Intentalo de nuevo.` |

### Operacion

| Codigo funcional | Mensaje UX |
| --- | --- |
| Turno requerido | `Abre caja antes de cobrar.` |
| Movimiento sin motivo | `Agrega un motivo para registrar este movimiento.` |
| Monto invalido | `El monto debe ser mayor a cero.` |
| Cuenta no abierta | `Esta cuenta ya no permite cambios.` |

### Cierre

| Codigo funcional | Mensaje UX |
| --- | --- |
| Conteo requerido | `Ingresa el efectivo contado para cerrar caja.` |
| Conteo invalido | `El efectivo contado debe ser cero o mayor.` |
| Diferencia sin nota | `Explica la diferencia antes de cerrar caja.` |
| Cuentas pendientes | `Hay cuentas abiertas pendientes. Cobralas o cancelalas antes de cerrar.` |
| Caja ya cerrada | `Esta caja ya fue cerrada.` |
| Sin permiso | `No tienes permiso para cerrar caja.` |
| Error inesperado | `No se pudo cerrar la caja. Revisa los datos e intentalo de nuevo.` |

## Confirmaciones principales

- Abrir caja: confirmar monto inicial.
- Registrar egreso: confirmar salida de efectivo.
- Registrar ajuste: confirmar impacto en efectivo esperado.
- Cerrar caja sin diferencia: confirmar cierre definitivo.
- Cerrar caja con diferencia: confirmar faltante/sobrante y nota.

## Casos borde que deben respetar Backend/API y Web Dev

- No cobrar venta sin caja abierta.
- No crear dos cajas abiertas para la misma terminal.
- No cerrar caja con efectivo contado vacio.
- No cerrar caja con cuentas abiertas pendientes en MVP recomendado.
- No aceptar montos negativos.
- No aceptar movimiento manual sin motivo.
- No modificar caja cerrada.
- No confiar en totales enviados por cliente para esperado/diferencia.
- Resolver empresa/tenant server-side.
- Mostrar CRC enteros sin decimales.

## Tareas futuras sugeridas

- Backend/API: formalizar contratos de apertura, movimientos, cierre y detalle de caja segun este flujo.
- Web Dev: crear vista/dialogos de apertura, movimientos y cierre.
- QA: crear checklist de caja diaria con casos de diferencia, cuentas abiertas y resumen por metodo.
- SQL DEV/Data: ajustar modelo o migraciones solo si Proyecto aprueba persistencia real de turnos/cierres.
