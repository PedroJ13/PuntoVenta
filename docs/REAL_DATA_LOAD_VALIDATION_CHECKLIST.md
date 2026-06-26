# Checklist de validacion para carga inicial real

## Estado

Preparado por `TASK-080`.

Este checklist valida la fuente de datos antes de preparar scripts o ejecutar cualquier carga. No carga datos, no ejecuta SQL, no modifica Azure SQL y no contiene datos reales.

## Artefacto fuente

Plantilla recomendada:

- `docs/templates/puntoventa_carga_inicial_real_template.xlsx`

Hojas esperadas:

1. `company`
2. `roles`
3. `users`
4. `terminals`
5. `categories`
6. `items`
7. `recipes`
8. `recipe_ingredients`
9. `customers_optional`
10. `suppliers_optional`
11. `opening_cash_plan`

## Bloqueo antes de carga

La carga real sigue bloqueada hasta que Proyecto/PO entregue y apruebe una fuente completada.

No preparar scripts finales ni tocar Azure SQL si falta cualquiera de estos puntos:

- responsable de negocio que aprueba los datos;
- tenant real definido y distinto de `PV-DEMO-LOCAL`;
- archivo fuente revisado sin secretos ni datos sensibles innecesarios;
- ventana de carga y mitigacion acordadas;
- tarea posterior explicita para scripts o carga.

## Seguridad y privacidad

Confirmar que el archivo fuente no contiene:

- passwords;
- PINs planos;
- tokens;
- connection strings;
- datos de tarjetas;
- datos bancarios;
- datos personales no necesarios para el piloto.

Si aparece cualquiera de esos datos, detener la carga y pedir una fuente corregida.

## Validacion por hoja

### `company`

- `tax_id` requerido, estable y distinto de `PV-DEMO-LOCAL`.
- `name` requerido.
- `default_currency` requerido; usar `CRC` para piloto Costa Rica.
- Una sola empresa/tenant real para la primera carga.

### `roles`

- `system_key` requerido y unico.
- Roles minimos esperados: `admin`, `cashier`, `manager`.
- No crear roles nuevos sin regla operativa clara.

### `users`

- `user_key` requerido y unico.
- `display_name` requerido.
- `email` opcional, pero unico si se entrega.
- `role_system_keys` debe referenciar roles existentes.
- No incluir passwords ni PINs.

### `terminals`

- `code` requerido y unico.
- `name` requerido.
- Para piloto inicial basta una terminal activa.

### `categories`

- `category_key` requerido y unico.
- `name` requerido.
- `sort_order` entero.
- `is_active` en `true` o `false`.

### `items`

- `sku` requerido y unico.
- `item_type` debe ser `purchased_product`, `prepared_product`, `raw_material` u `operational_supply`.
- `category_key` debe existir en `categories`.
- `base_unit` debe ser `unit`, `g`, `kg`, `ml` o `l`.
- `sale_price` debe ser CRC entero cuando el articulo se vende.
- `tax_rate` entre `0` y `1`.
- `stock_minimum` y `current_stock` no negativos.
- `prepared_product` debe tener receta si consume inventario.

### `recipes`

- `recipe_key` requerido y unico.
- `output_sku` debe existir en `items` y ser `prepared_product`.
- `output_quantity` mayor que cero.

### `recipe_ingredients`

- `recipe_key` debe existir en `recipes`.
- `ingredient_sku` debe existir en `items`.
- `quantity` mayor que cero.
- `unit` compatible con el ingrediente.

### `customers_optional`

- Cargar solo si es necesario para operacion piloto.
- Minimizar datos personales.
- No cargar datos sensibles innecesarios.

### `suppliers_optional`

- Cargar solo si se va a operar compras o inventario inicial por proveedor.
- Minimizar campos a lo necesario.

### `opening_cash_plan`

- Usar como plan operativo, no como instruccion de carga SQL directa.
- La apertura de caja real debe ocurrir por flujo operativo/API en tarea posterior si aplica.

## Aprobacion

Antes de preparar scripts o carga:

| Punto | Estado | Responsable | Nota |
| --- | --- | --- | --- |
| Fuente completada | Pendiente | Proyecto/PO |  |
| Seguridad revisada | Pendiente | Proyecto/PO |  |
| Tenant real aprobado | Pendiente | Proyecto/PO |  |
| Validacion tecnica de referencias | Pendiente | SQL DEV/Data |  |
| Ventana y mitigacion acordadas | Pendiente | Proyecto/PO |  |
| Tarea posterior creada | Pendiente | Proyecto |  |

## Uso Azure SQL

No. Este checklist es documental y no se conecta a Azure SQL.
