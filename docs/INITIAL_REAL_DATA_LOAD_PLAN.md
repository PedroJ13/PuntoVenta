# Plan de carga inicial de datos reales

## Estado

Preparado por `TASK-079`.

Este documento no carga datos, no modifica Azure SQL, no ejecuta migraciones, no cambia API/Web y no guarda secretos.

## Objetivo

Definir una ruta segura para cargar datos reales minimos en el pilot con Azure SQL, despues de la aprobacion del pilot publicado con persistencia real.

La carga real debe hacerse en una tarea posterior explicita, con fuente de datos aprobada, responsable asignado, validacion previa y rollback/mitigacion definido.

## Contexto actual

- Azure SQL pilot esta activo para API con `PV_SQLSERVER_ENABLED=true`.
- La base pilot contiene datos ficticios de demo y ventas de smoke.
- Tenant demo actual: `PV-DEMO-LOCAL`.
- No hay datos reales cargados.
- El modelo es multiempresa por `company_id`, pero la API resuelve el tenant operativo mediante `PV_SQLSERVER_COMPANY_TAX_ID`.

## Decision recomendada

Crear una empresa/tenant real separada para el piloto y mantener el tenant demo aislado.

Recomendacion:

- No mezclar datos reales con `PV-DEMO-LOCAL`.
- Crear un nuevo tenant real con `tax_id` estable definido por Proyecto/PO.
- Cargar catalogo, usuarios operativos y terminal inicial bajo ese nuevo tenant.
- Cambiar `PV_SQLSERVER_COMPANY_TAX_ID` al tenant real solo en una tarea Backend/API o Infra posterior, despues de validar la carga.
- Mantener el tenant demo como referencia temporal hasta que QA/PO aprueben el tenant real.

No se recomienda borrar datos demo como primera accion. Si se decide limpiar, debe hacerse con tarea explicita y respaldo/rollback.

## Datos obligatorios

### Empresa / tenant

Formato esperado:

| Campo | Requerido | Regla |
| --- | --- | --- |
| `tax_id` | Si | Identificador estable del tenant; no debe reutilizar `PV-DEMO-LOCAL`. |
| `name` | Si | Nombre comercial visible. |
| `legal_name` | Opcional | Razon social si aplica. |
| `default_currency` | Si | `CRC` para piloto Costa Rica. |

### Roles

Roles minimos:

| `system_key` | Nombre sugerido | Uso |
| --- | --- | --- |
| `admin` | Administrador | Configuracion y operacion completa. |
| `cashier` | Cajero | Venta/caja. |
| `manager` | Encargado | Operacion y reportes. |

No crear roles nuevos si no hay regla operativa clara.

### Usuarios

Formato esperado:

| Campo | Requerido | Regla |
| --- | --- | --- |
| `user_key` | Si | Codigo estable para referencias internas de carga. |
| `display_name` | Si | Nombre visible del usuario. |
| `email` | Opcional | Unico por empresa si se entrega. |
| `role_system_keys` | Si | Lista separada por coma: `admin`, `cashier`, `manager`. |
| `is_active` | Si | `true` o `false`. |

Reglas:

- No entregar passwords.
- No entregar PINs planos.
- `pin_hash` debe quedar vacio hasta definir flujo seguro de credenciales.

### Terminal

Formato esperado:

| Campo | Requerido | Regla |
| --- | --- | --- |
| `code` | Si | Codigo estable, por ejemplo `CAJA-01`. |
| `name` | Si | Nombre visible, por ejemplo `Caja Principal`. |
| `is_active` | Si | `true` o `false`. |

Para el piloto inicial basta una terminal.

### Categorias

Formato esperado:

| Campo | Requerido | Regla |
| --- | --- | --- |
| `category_key` | Si | Codigo estable de carga. |
| `name` | Si | Nombre visible. |
| `sort_order` | Si | Numero entero para orden en POS. |
| `is_active` | Si | `true` o `false`. |

### Articulos y materiales

Formato esperado:

| Campo | Requerido | Regla |
| --- | --- | --- |
| `sku` | Si | Unico por empresa. |
| `item_type` | Si | `purchased_product`, `prepared_product`, `raw_material` u `operational_supply`. |
| `category_key` | Si | Debe existir en categorias. |
| `name` | Si | Nombre visible. |
| `description` | Opcional | Texto corto. |
| `barcode` | Opcional | Unico por empresa si existe. |
| `base_unit` | Si | `unit`, `g`, `kg`, `ml` o `l`. |
| `sale_price` | Condicional | Requerido para productos vendidos; entero CRC recomendado. |
| `cost_amount` | Opcional | Costo unitario/base si se conoce. |
| `tax_rate` | Si | Decimal entre `0` y `1`; usar `0` si no se aplica impuesto en piloto. |
| `tracks_inventory` | Si | `true` o `false`. |
| `stock_minimum` | Si | No negativo. |
| `current_stock` | Si | No negativo; en unidad base. |
| `is_favorite` | Si | `true` o `false`. |
| `is_active` | Si | `true` o `false`. |

Reglas:

- Montos CRC deben entregarse como enteros cuando sean precios de venta.
- `raw_material` y `operational_supply` no requieren `sale_price`.
- `prepared_product` debe tener receta si consume inventario.
- `current_stock` inicial debe venir validado por responsable operativo.

### Recetas

Formato esperado:

| Campo | Requerido | Regla |
| --- | --- | --- |
| `recipe_key` | Si | Codigo estable de carga. |
| `output_sku` | Si | SKU de articulo `prepared_product`. |
| `name` | Si | Nombre visible. |
| `output_quantity` | Si | Positivo; normalmente `1`. |
| `is_active` | Si | `true` o `false`. |

Ingredientes:

| Campo | Requerido | Regla |
| --- | --- | --- |
| `recipe_key` | Si | Debe existir en recetas. |
| `ingredient_sku` | Si | Debe existir como materia prima/insumo/producto controlado. |
| `quantity` | Si | Mayor que cero. |
| `unit` | Si | Unidad compatible con el ingrediente. |
| `is_optional` | Si | `true` o `false`. |

## Datos opcionales para primer piloto

### Clientes

No cargar clientes reales salvo que sean necesarios para la operacion piloto.

Minimo recomendado:

- Consumidor final por defecto.

Si se entregan clientes reales, limitar campos a:

- nombre;
- documento si es imprescindible;
- telefono si es imprescindible.

No cargar datos sensibles innecesarios.

### Proveedores

Opcional. Cargar solo si se va a registrar compras o inventario inicial por proveedor.

Campos maximos:

- nombre;
- documento;
- telefono;
- email.

### Caja inicial

No abrir caja real desde la carga SQL inicial salvo tarea explicita.

La apertura de caja debe ocurrir por flujo operativo/API para dejar movimientos consistentes.

El plan de datos puede incluir:

- terminal a usar;
- monto sugerido de apertura;
- responsable de apertura;
- fecha/hora operativa.

## Formato de entrega recomendado

Un archivo `.xlsx` o carpeta `.csv` con una tabla por entidad:

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

Reglas de archivo:

- UTF-8 si se usa CSV.
- Encabezados exactamente como los campos definidos.
- Sin formulas.
- Sin columnas de passwords, tokens, connection strings o PINs.
- Sin datos de tarjetas, cuentas bancarias o credenciales.
- Una fila por registro.
- Usar claves naturales (`tax_id`, `sku`, `category_key`, `recipe_key`, `user_key`) para relacionar hojas.

## Checklist de validacion previa

Antes de ejecutar cualquier carga:

- Confirmar responsable de negocio que aprueba los datos.
- Confirmar tenant real (`tax_id`) y que no sea `PV-DEMO-LOCAL`.
- Confirmar si el tenant demo se mantiene activo o se desactiva despues.
- Validar que no existan secretos, passwords ni PINs planos.
- Validar que no existan datos personales innecesarios.
- Validar unicidad de:
  - `company.tax_id`;
  - `users.email` por empresa cuando exista;
  - `roles.system_key` por empresa;
  - `terminals.code` por empresa;
  - `items.sku` por empresa;
  - `items.barcode` por empresa cuando exista;
  - `categories.name` por empresa si se usa como visible unico.
- Validar referencias:
  - `items.category_key` existe;
  - `recipes.output_sku` existe y es `prepared_product`;
  - `recipe_ingredients.recipe_key` existe;
  - `recipe_ingredients.ingredient_sku` existe.
- Validar montos:
  - precios y costos no negativos;
  - precios de venta CRC como enteros;
  - `tax_rate` entre `0` y `1`.
- Validar inventario:
  - unidades permitidas;
  - stock no negativo;
  - recetas con cantidades positivas;
  - no mezclar `kg/g` o `l/ml` sin conversion acordada.
- Validar que la carga sea idempotente por claves naturales o que se documente como una sola corrida.

## Estrategia de carga recomendada

Tarea posterior `SQL DEV/Data`:

1. Preparar script de staging revisable, sin ejecutar.
2. Convertir archivo aprobado a inserts/merge parametrizados o scripts idempotentes por claves naturales.
3. Cargar primero tenant, roles, usuarios sin credenciales, terminal, categorias e items.
4. Cargar recetas e ingredientes despues de validar items.
5. Cargar opcionales solo si Proyecto/PO los aprueban.
6. Verificar conteos por tenant.
7. No abrir caja ni crear ventas por SQL directo.

Tarea posterior `Backend/API` o `Infra`:

1. Cambiar `PV_SQLSERVER_COMPANY_TAX_ID` al tenant real solo despues de validar la carga.
2. Ejecutar smoke publicado corto contra tenant real.

Tarea posterior `QA`:

1. Validar catalogo real visible.
2. Validar caja/venta/ticket/reportes sin datos demo mezclados.

## Rollback y mitigacion

Antes de cargar:

- Registrar conteos por tabla y por `tax_id`.
- Confirmar PITR activo en Azure SQL.
- Definir ventana de carga y responsable.
- Mantener `PV_SQLSERVER_COMPANY_TAX_ID` apuntando al tenant demo hasta validar carga real.

Si falla antes de activar el tenant real en API:

- No borrar datos a ciegas.
- Preferir corregir script y reejecutar sobre claves naturales si la carga es idempotente.
- Si la carga quedo contaminada, preparar script correctivo revisable para desactivar o corregir filas del tenant real.

Si falla despues de activar el tenant real:

- Volver temporalmente `PV_SQLSERVER_COMPANY_TAX_ID` al tenant demo o desactivar SQL solo con tarea Backend/API o Infra aprobada.
- No usar `DROP`, `TRUNCATE` ni borrado masivo sin tarea explicita, respaldo y decision documentada.

## Tareas siguientes propuestas

1. `TASK-080` - SQL DEV/Data: Definir plantilla de carga inicial real en XLSX/CSV y checklist de validacion.
2. `TASK-081` - SQL DEV/Data: Preparar scripts revisables de carga para tenant real, sin ejecutar.
3. `TASK-082` - Proyecto/PO: Revisar y aprobar archivo de datos reales.
4. `TASK-083` - SQL DEV/Data: Ejecutar carga controlada en Azure SQL pilot con evidencia filtrada.
5. `TASK-084` - Backend/API o Infra: Cambiar tenant runtime a empresa real y ejecutar smoke corto.
6. `TASK-085` - QA: Validar pilot publicado con datos reales.
7. `TASK-086` - PO Test: Aprobar o rechazar pilot con datos reales.

## Uso Azure SQL

No. Este plan es documental y no ejecuta consultas ni cambios sobre la base cloud.
