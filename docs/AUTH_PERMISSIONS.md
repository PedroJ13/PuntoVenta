# Auth and Permissions

## Estado

Definicion MVP creada en `TASK-009`.

Este documento define autenticacion y permisos para API/UI futura. No implementa login, no crea usuarios reales, no configura proveedores OAuth y no guarda secretos.

## Objetivo MVP

Proteger operaciones de caja, catalogo, inventario y reportes con reglas simples:

- Todo endpoint operativo requiere usuario autenticado.
- La API resuelve `company_id` server-side desde la sesion/token/configuracion, nunca desde payload libre del cliente.
- La API resuelve `currentUserId` server-side y lo usa para auditoria.
- Los roles MVP son: Administrador, Cajero, Encargado y Auditor/PO.
- Las acciones sensibles requieren permiso explicito aunque la UI oculte botones.

## Modelo conceptual

Entidades ya previstas en `docs/DATA_MODEL.md`:

- `users`
- `roles`
- `user_roles`
- `companies`

Campos sensibles:

- `users.pin_hash` solo puede guardar hash, nunca PIN plano.
- No guardar passwords, tokens, connection strings ni secretos en base o repo.

## Resolucion de identidad

Para MVP:

1. Cliente llama API con una credencial de sesion futura.
2. Middleware/adapter de API valida credencial.
3. API construye contexto server-side:

```json
{
  "companyId": 1,
  "userId": 10,
  "roles": ["cashier"],
  "permissions": ["sales.checkout", "open_accounts.manage"]
}
```

Reglas:

- `companyId` no se acepta desde body/query para operaciones normales.
- Si un ID no pertenece a `companyId`, responder `NOT_FOUND` o `FORBIDDEN` segun convenga no revelar existencia.
- Todos los repositorios deben recibir `companyId` desde contexto autenticado.
- Todos los cambios auditables deben guardar `created_by_user_id`, `opened_by_user_id`, `sold_by_user_id` o equivalente.

## Roles MVP

### Administrador

Responsable de configuracion completa del negocio.

Puede:

- Administrar usuarios y roles.
- Configurar catalogo, categorias, articulos y recetas.
- Abrir/cerrar caja si hace falta.
- Vender y anular.
- Registrar compras e inventario.
- Ver reportes.
- Autorizar descuentos, cambios de precio, anulaciones y ajustes.

### Cajero

Responsable de operacion diaria de caja.

Puede:

- Abrir turno propio.
- Crear y manejar cuentas abiertas.
- Agregar/quitar lineas de cuenta.
- Cobrar ventas.
- Reimprimir ticket.
- Cerrar turno propio.
- Ver catalogo necesario para vender.

No puede por defecto:

- Cambiar precios sin autorizacion.
- Aplicar descuentos sin autorizacion.
- Anular ventas.
- Hacer ajustes de inventario.
- Editar catalogo/recetas.
- Ver reportes administrativos completos.

### Encargado

Responsable de inventario, compras y supervision operativa.

Puede:

- Gestionar catalogo operativo.
- Gestionar materia prima, insumos y recetas.
- Registrar compras.
- Registrar ajustes/mermas con motivo.
- Autorizar descuentos/cambios de precio si Proyecto lo acepta.
- Ver reportes operativos.
- Anular ventas/compras si tiene permiso asignado.

### Auditor/PO

Responsable de consulta y validacion, sin operacion destructiva.

Puede:

- Ver reportes.
- Ver ventas, tickets, caja e inventario.
- Ver catalogo y recetas.

No puede:

- Cobrar ventas.
- Cambiar catalogo.
- Ajustar inventario.
- Anular ventas/compras.
- Crear usuarios.

## Matriz de permisos

| Area | Accion | Administrador | Cajero | Encargado | Auditor/PO |
| --- | --- | --- | --- | --- | --- |
| Sesion | Iniciar sesion | Si | Si | Si | Si |
| Usuarios | Crear/editar usuarios | Si | No | No | No |
| Catalogo | Ver categorias/articulos | Si | Si | Si | Si |
| Catalogo | Crear/editar categorias | Si | No | Si | No |
| Catalogo | Crear/editar articulos | Si | No | Si | No |
| Recetas | Ver recetas | Si | Consulta | Si | Si |
| Recetas | Crear/editar recetas | Si | No | Si | No |
| Cuentas abiertas | Crear/renombrar cuenta | Si | Si | Si | No |
| Cuentas abiertas | Agregar/quitar lineas | Si | Si | Si | No |
| Cuentas abiertas | Cancelar cuenta | Si | Si con motivo | Si | No |
| Ventas | Cobrar venta | Si | Si | Si | No |
| Ventas | Cambiar precio | Si | Requiere autorizacion | Si | No |
| Ventas | Aplicar descuento | Si | Requiere autorizacion | Si | No |
| Ventas | Anular venta | Si | No | Si con motivo | No |
| Tickets | Ver/reimprimir ticket | Si | Si | Si | Si |
| Caja | Abrir turno | Si | Si | Si | No |
| Caja | Entrada/salida manual | Si | No | Si con motivo | No |
| Caja | Cerrar turno propio | Si | Si | Si | No |
| Caja | Cerrar turno ajeno | Si | No | Si | No |
| Compras | Ver compras | Si | No | Si | Si |
| Compras | Registrar compra | Si | No | Si | No |
| Compras | Anular compra | Si | No | Si con motivo | No |
| Inventario | Ver stock/movimientos | Si | Consulta basica | Si | Si |
| Inventario | Ajuste manual/merma | Si | No | Si con motivo | No |
| Reportes | Ver ventas/caja/inventario | Si | Turno propio basico | Si | Si |
| Sistema | Configuracion tecnica | Si | No | No | No |

## Permisos sugeridos

Usar permisos atomicos en API aunque la UI agrupe por rol:

```text
users.manage
catalog.read
catalog.write
recipes.read
recipes.write
open_accounts.manage
sales.checkout
sales.override_price
sales.discount
sales.void
tickets.read
cash.open
cash.move
cash.close_own
cash.close_any
purchases.read
purchases.write
purchases.void
inventory.read
inventory.adjust
reports.read
system.configure
```

## Acciones sensibles

Siempre validar server-side:

- Cambio de precio en una linea de venta.
- Descuento en una linea o venta.
- Anulacion de venta.
- Anulacion de compra.
- Ajuste manual de inventario.
- Registro de merma.
- Entrada/salida manual de caja.
- Cierre de turno ajeno.
- Creacion/edicion de usuarios.
- Cambios de catalogo, recetas e impuestos.
- Acceso a reportes fuera del turno propio.

Reglas:

- Acciones sensibles deben registrar usuario, fecha/hora UTC y motivo cuando aplique.
- Motivo obligatorio para anulaciones, ajustes, mermas y movimientos manuales de caja.
- Si el usuario no tiene permiso, responder `FORBIDDEN`.
- No confiar en flags enviados por frontend para autorizacion.

## Comportamiento API esperado

### Request autorizado

La capa API debe inyectar contexto:

```js
{
  auth: {
    companyId,
    userId,
    roles,
    permissions
  }
}
```

Cada handler valida:

- usuario autenticado;
- permiso requerido;
- recurso pertenece a `companyId`;
- estado de entidad permite la accion;
- motivo cuando aplica.

### Errores

Usar codigos ya definidos en `docs/API_CONTRACTS.md`:

- `UNAUTHORIZED`: no hay sesion valida.
- `FORBIDDEN`: usuario autenticado sin permiso.
- `NOT_FOUND`: recurso no existe o no pertenece a empresa.
- `INVALID_STATE`: estado no permite la accion.
- `VALIDATION_ERROR`: faltan campos o motivo.

## UI futura

La UI puede ocultar botones por rol, pero eso no reemplaza autorizacion API.

Comportamientos sugeridos:

- Mostrar solo acciones permitidas por `permissions`.
- Para cambios de precio/descuento, si el cajero no tiene permiso, pedir autorizacion de Administrador/Encargado en flujo futuro.
- Para reportes, Cajero solo ve resumen de su turno propio salvo permiso adicional.

## Pendientes de decision

- Proveedor de autenticacion: login local simple, Azure Entra ID B2C, proveedor externo u otro.
- Si el MVP requiere PIN rapido de cajero para autorizar acciones en la misma terminal.
- Duracion de sesion y politica de expiracion.
- Si Encargado puede anular ventas por defecto o solo Administrador.
- Si Cajero puede cancelar cuentas abiertas sin autorizacion o solo con motivo.
- Nivel de auditoria requerido para descuentos y cambios de precio.

## Tareas posteriores recomendadas

- Implementar middleware local de auth fake para tests Backend/API.
- Definir endpoint futuro `GET /api/me` para devolver usuario, roles y permisos.
- Implementar guards de permisos por endpoint.
- Agregar tests unitarios para `UNAUTHORIZED`, `FORBIDDEN` y aislamiento por `companyId`.
- Elegir proveedor real de autenticacion antes de publicar piloto.
