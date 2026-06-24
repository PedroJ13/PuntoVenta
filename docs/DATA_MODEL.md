# Data Model

## Estado

Modelo inicial MVP definido en `TASK-002`.

Script local revisable:

- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `database/migrations/20260622_002_daily_cash_flow.sql`

No se ha aplicado en Azure SQL. Cualquier ejecucion contra nube requiere una tarea explicita de migracion.

## Principios

- Multi-tenant desde el inicio por `company_id` en entidades operativas.
- Inventario controlado en unidad base: `unit`, `g`, `kg`, `ml` o `l`.
- Las cuentas abiertas no descuentan inventario al agregar articulos; el descuento ocurre al cobrar.
- Los articulos preparados descuentan insumos segun receta al vender.
- Consumidor final se modela como cliente por defecto por empresa.
- Caja MVP inicia con una sola terminal, pero el modelo permite mas terminales despues.
- Facturacion electronica queda fuera; `sales.ticket_number` es ticket interno.
- Borrado fisico no es el flujo normal: las entidades maestras usan `is_active`.

## Entidades MVP

### Empresa, usuarios y roles

- `companies`: tenant/empresa operativa.
- `users`: usuarios/cajeros/encargados por empresa.
- `roles`: roles iniciales como administrador, cajero, encargado o auditor.
- `user_roles`: asignacion muchos-a-muchos de usuarios a roles.

Reglas:

- `roles.company_id + system_key` es unico.
- `users.company_id + email` es unico cuando existe email.
- `pin_hash` puede existir para operacion de caja, pero nunca debe guardar PIN plano.

### Caja y terminal

- `terminals`: caja o terminal operativa.
- `cash_shifts`: apertura/cierre de caja.
- `cash_movements`: entradas, salidas, pagos en efectivo y ajustes de cierre.

Reglas:

- `cash_shifts.status` permite `open`, `closed` o `void`.
- Una empresa/terminal solo puede tener un turno `open` a la vez.
- Montos de apertura, esperado, contado y reportados por metodo no pueden ser negativos.
- `cash_shifts.difference_amount` puede ser negativo, cero o positivo y representa `contado - esperado`.
- `cash_shifts.opening_note` guarda nota opcional de apertura.
- `cash_shifts.closing_note` guarda nota de cierre; si hay diferencia distinta de cero, la API debe requerirla.
- `cash_shifts.card_reported_amount`, `transfer_reported_amount` y `other_reported_amount` quedan para conciliacion informativa.
- `cash_shifts.high_difference_threshold_amount` permite marcar diferencias altas sin hardcodear el umbral.
- `cash_movements.amount` siempre es positivo.
- `cash_movements.signed_amount` indica el impacto en efectivo esperado: positivo para ingreso/aumento, negativo para egreso/disminucion.
- `cash_movements.movement_type` permite `opening`, `sale_cash_payment`, `cash_in`, `cash_out`, `cash_adjustment` o `closing_adjustment`.
- Movimientos manuales y ajustes requieren motivo.
- Los pagos no efectivo se reportan por metodo, pero no cambian efectivo esperado.

### Catalogo e inventario

- `categories`: categorias visibles en POS.
- `items`: articulo vendido, materia prima, insumo operativo o deposito/envase futuro.
- `inventory_movements`: kardex simple por articulo/insumo.

Tipos de `items.item_type`:

- `purchased_product`: producto comprado y vendido tal cual.
- `prepared_product`: articulo vendido que consume receta.
- `raw_material`: materia prima usada en recetas.
- `operational_supply`: insumo controlado, no necesariamente vendido.
- `deposit_container`: deposito/envase documentado para fase futura.

Reglas:

- `items.company_id + sku` es unico.
- `items.company_id + barcode` es unico cuando existe codigo de barras.
- `current_stock`, `stock_minimum`, `sale_price`, `cost_amount` y `tax_rate` no pueden ser negativos.
- El movimiento de inventario guarda `quantity_delta` positivo o negativo; nunca cero.
- Las fuentes de movimiento son flexibles por `source_type/source_id` para enlazar venta, compra, linea o ajuste sin forzar todos los FKs desde el primer MVP.

### Recetas

- `recipes`: receta activa por articulo preparado.
- `recipe_ingredients`: insumos requeridos para producir/vender el articulo.

Reglas:

- Una receta activa se asocia a un `output_item_id`.
- Cada ingrediente apunta a un `items.id` de materia prima, insumo o producto controlado.
- Las cantidades de ingredientes son positivas y se expresan en unidad base.
- Al cobrar una venta de `prepared_product`, la aplicacion debe crear movimientos `recipe_consumption` por cada ingrediente.

### Cuentas abiertas y ventas

- `customers`: cliente opcional; incluye consumidor final por defecto.
- `open_accounts`: cuenta abierta en preparacion.
- `open_account_lines`: lineas temporales de cuenta abierta.
- `sales`: venta cobrada con ticket interno.
- `sale_lines`: lineas finales de venta con snapshot de nombre.
- `payments`: pagos simples o mixtos.

Reglas:

- `open_accounts.status` permite `open`, `paid` o `cancelled`.
- Una cuenta abierta no crea movimientos de inventario definitivos.
- Al cobrar, se crea `sales`, `sale_lines`, `payments`, `cash_movements` cuando aplique y `inventory_movements`.
- `sales.company_id + ticket_number` es unico.
- `payments.payment_method` permite `cash`, `card`, `transfer` u `other`.
- Los montos de ventas, descuentos, impuestos y totales no pueden ser negativos.

### Compras

- `suppliers`: proveedor.
- `purchases`: compra simple o factura de proveedor.
- `purchase_lines`: detalle comprado.

Reglas:

- Una compra posteada aumenta inventario con movimientos `purchase`.
- `supplier_invoice_reference` queda opcional para compras simples.
- Compras pueden estar en `draft`, `posted` o `voided`.

## Indices iniciales

- Busqueda operativa por empresa, estado y fecha en turnos, cuentas abiertas, ventas, compras y movimientos.
- Unicidad filtrada de caja abierta por empresa y terminal.
- Busqueda de articulos por empresa, tipo, categoria y activo.
- Busqueda de movimientos de inventario por articulo y fecha.
- Unicidad de codigos funcionales: SKU, barcode, ticket interno, terminal y roles.

## Datos sensibles

- No guardar passwords, PINs, tokens ni connection strings.
- `users.pin_hash` debe recibir solo hash producido fuera de SQL.
- Datos de clientes/proveedores se limitan a lo minimo operativo.
- Todos los accesos API deben filtrar por `company_id` para evitar cruce entre empresas.

## Pendientes

- Definir si se agregan seeds minimos en una tarea posterior.
- Validar script contra SQL Server/Azure SQL cuando exista tarea de migracion.
- Backend debe convertir el cobro en una transaccion atomica: venta, pagos, caja e inventario.
- `TASK-004` debe definir contratos API respetando este modelo.
