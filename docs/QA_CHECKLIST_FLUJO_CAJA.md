# Checklist QA - Flujo de caja

## Objetivo

Validar el flujo principal de caja de PuntoVenta para cafeteria/despacho, primero sobre prototipo o app base con datos falsos y luego contra la version con backend, inventario y tickets persistidos.

## Alcance QA

- Venta rapida desde pantalla de caja.
- Cuentas abiertas en paralelo.
- Agregar articulos, cambiar cantidades y eliminar lineas.
- Cambio entre cuentas sin perdida de carrito.
- Cobro con metodo de pago.
- Generacion, impresion/reimpresion y anulacion de ticket cuando existan.
- Validacion futura de descuento de inventario segun tipo de articulo.

## Fuera de alcance de este checklist inicial

- Facturacion electronica.
- Manejo de mesas.
- Azure, deploy o base de datos cloud.
- Correcciones de UI o implementacion.
- Pruebas automatizadas.

## Severidades esperadas

- P0: riesgo grave de seguridad, datos cruzados entre empresas, cobros duplicados o perdida irreversible de ventas/tickets.
- P1: bloquea flujo principal de caja, cobro, cuenta abierta, totales o ticket.
- P2: degrada una operacion importante con workaround razonable.
- P3: ajuste menor visual, copy, orden o ergonomia que no bloquea caja.

## Ambiente actual

Validacion actual prevista:

- `prototype/index.html` como prototipo aprobado.
- `app/index.html` como app base si `TASK-003` ya fue procesada por Proyecto.
- Datos falsos en memoria.
- Sin API, sin persistencia real y sin Azure SQL.

## Checklist A - Prototipo o app base sin backend

| ID | Caso | Pasos minimos | Resultado esperado | Severidad si falla |
| --- | --- | --- | --- | --- |
| QA-CJ-001 | Abrir pantalla de ventas | Cargar la app y entrar a Ventas | Se muestra Caja rapida, categorias, productos, cuenta activa y totales en cero o estado inicial valido | P1 |
| QA-CJ-002 | Crear cuenta abierta | Presionar Nueva cuenta | Se crea una cuenta nueva, queda activa y aparece en pestanas de cuentas | P1 |
| QA-CJ-003 | Renombrar cuenta | Presionar Renombrar y guardar nombre valido | El nombre visible de la cuenta cambia sin perder lineas | P2 |
| QA-CJ-004 | Cancelar renombre | Abrir Renombrar y cancelar o dejar vacio | La cuenta conserva su nombre anterior | P3 |
| QA-CJ-005 | Agregar articulo desde categoria | Seleccionar una categoria y presionar un articulo | El articulo aparece en la cuenta activa con cantidad 1 y totales actualizados | P1 |
| QA-CJ-006 | Agregar mismo articulo dos veces | Presionar dos veces el mismo articulo | La linea acumula cantidad, no crea duplicado innecesario | P2 |
| QA-CJ-007 | Buscar por nombre | Buscar un articulo por texto parcial | El grid muestra coincidencias y permite agregar el articulo | P2 |
| QA-CJ-008 | Buscar por codigo | Buscar un articulo por codigo visible en datos | El grid muestra la coincidencia esperada | P2 |
| QA-CJ-009 | Limpiar busqueda | Buscar algo y presionar Limpiar | Se restaura el listado filtrado por categoria activa | P3 |
| QA-CJ-010 | Aumentar cantidad | Agregar articulo y presionar + | La cantidad y subtotal de linea aumentan correctamente | P1 |
| QA-CJ-011 | Disminuir cantidad | Presionar - en una linea con cantidad mayor a 1 | La cantidad y totales disminuyen correctamente | P1 |
| QA-CJ-012 | Eliminar linea | Presionar - hasta llegar a cero | La linea desaparece y los totales se recalculan | P1 |
| QA-CJ-013 | Mantener cuenta al cambiar de pestana | Agregar articulos a Cuenta A, cambiar a Cuenta B y volver | Cada cuenta conserva sus lineas, cantidades y totales | P1 |
| QA-CJ-014 | Agregar articulos a cuenta no inicial | Crear o seleccionar otra cuenta y agregar articulo | Solo cambia la cuenta activa; las demas no reciben el articulo | P1 |
| QA-CJ-015 | Totales con impuesto estimado | Agregar articulos de distintos precios | Subtotal, impuesto y total coinciden con los calculos esperados | P1 |
| QA-CJ-016 | Cambiar metodo de pago | Seleccionar Efectivo, Tarjeta y SINPE | Solo un metodo queda activo y se refleja en el ticket | P2 |
| QA-CJ-017 | Cobrar cuenta con lineas | Agregar articulos y presionar Cobrar e imprimir ticket | Se abre ticket con fecha, metodo, lineas y total correcto | P1 |
| QA-CJ-018 | Intentar cobrar cuenta vacia | Activar cuenta sin lineas y presionar Cobrar | No se genera ticket vacio ni error visible incoherente | P1 |
| QA-CJ-019 | Cerrar ticket | Abrir ticket y presionar Cerrar | El modal se cierra y la app queda operable | P2 |
| QA-CJ-020 | Imprimir ticket | Abrir ticket y presionar Imprimir | Se invoca impresion del navegador sin romper el estado de la venta | P2 |
| QA-CJ-021 | Reimprimir ultimo ticket | Presionar accion PR | Si no esta implementado, debe quedar identificado como gap esperado; si existe, debe reabrir ultimo ticket | P2 |
| QA-CJ-022 | Anular venta o cuenta | Buscar accion de anulacion/cancelacion | Si no esta implementada, debe quedar identificado como gap esperado; si existe, debe pedir motivo | P1 |
| QA-CJ-023 | Navegar a inventario y volver | Ir a Materia prima y regresar a Ventas | Las cuentas abiertas conservan estado en memoria | P2 |
| QA-CJ-024 | Responsive basico caja | Probar ancho desktop y mobile/tablet | La caja sigue usable sin solapes que impidan cobrar | P2 |
| QA-CJ-025 | Caracteres y moneda | Revisar simbolos de colon, nombres y textos | No hay caracteres corruptos visibles en textos criticos ni montos | P2 |

## Checklist B - Validacion futura con backend

| ID | Caso | Pasos minimos | Resultado esperado | Severidad si falla |
| --- | --- | --- | --- | --- |
| QA-BE-001 | Persistir cuenta abierta | Crear cuenta, recargar o abrir nueva sesion autorizada | La cuenta abierta persiste segun contrato y pertenece al tenant correcto | P1 |
| QA-BE-002 | Concurrencia de cuentas | Dos cajas o sesiones operan cuentas distintas | No se mezclan lineas, totales ni usuarios responsables | P0 |
| QA-BE-003 | Cobro idempotente | Cobrar una cuenta y evitar doble submit | No se crea venta duplicada ni doble descuento de inventario | P0 |
| QA-BE-004 | Numeracion de ticket | Cobrar ventas consecutivas | Cada ticket tiene numeracion interna unica y trazable | P1 |
| QA-BE-005 | Reimpresion de ticket | Reimprimir ticket existente | Reimprime el mismo ticket sin crear nueva venta ni nuevo movimiento | P1 |
| QA-BE-006 | Anulacion con motivo | Anular venta cerrada con usuario autorizado | Registra motivo, usuario, fecha y movimientos reversos definidos | P1 |
| QA-BE-007 | Permisos de cajero | Cajero intenta descuento, cambio precio o anulacion restringida | La accion se bloquea o pide autorizacion segun regla | P1 |
| QA-BE-008 | Producto comprado | Vender producto terminado comprado | Descuenta unidades del producto vendido al cerrar venta | P1 |
| QA-BE-009 | Producto preparado | Vender producto con receta | Descuenta insumos segun receta, no stock de producto final preconvertido | P1 |
| QA-BE-010 | Materia prima no vendible | Intentar vender materia prima no configurada para venta | No aparece como articulo vendible o se bloquea la venta | P1 |
| QA-BE-011 | Deposito/envase | Vender articulo con deposito asociado | Agrega deposito segun configuracion y queda trazable para devolucion futura | P2 |
| QA-BE-012 | Stock insuficiente | Vender articulo sin stock o insumos suficientes | El sistema bloquea o advierte segun decision de producto documentada | P1 |
| QA-BE-013 | Cuenta abierta e inventario | Agregar articulo a cuenta abierta sin cobrar | No descuenta inventario definitivo salvo decision documentada de reserva | P1 |
| QA-BE-014 | Pago mixto | Cobrar venta con dos metodos | Registra pagos, total cubierto y ticket correcto | P2 |
| QA-BE-015 | Apertura de caja | Iniciar turno con monto base | Las ventas quedan asociadas a caja, turno y cajero | P1 |
| QA-BE-016 | Cierre de caja | Cerrar turno con conteo real | Calcula esperado, contado y diferencia sin perder ventas | P1 |
| QA-BE-017 | Auditoria minima | Revisar venta, anulacion y movimiento de inventario | Hay usuario, fecha, caja y referencia de origen | P1 |
| QA-BE-018 | Aislamiento tenant | Usuario de una empresa intenta ver datos de otra | No puede acceder ni inferir ventas, cuentas, tickets o inventario ajeno | P0 |

## Gaps actuales esperados

- No hay persistencia real de cuentas, ventas o tickets.
- No hay descuento real de inventario.
- No hay anulacion implementada en el prototipo.
- La accion de reimpresion aparece como acceso visual, pero debe confirmarse implementacion funcional.
- No hay permisos, usuarios ni roles en UI actual.
- No hay apertura/cierre real de caja.
- No hay validacion contra API ni base de datos.

## Evidencia recomendada por ejecucion QA

Registrar por corrida:

- Archivo o URL validada.
- Fecha y ambiente.
- Navegador y viewport principal.
- Casos ejecutados y resultado por ID.
- Capturas solo para fallos P0/P1/P2 relevantes.
- Lista de hallazgos con severidad, pasos, resultado actual y esperado.

