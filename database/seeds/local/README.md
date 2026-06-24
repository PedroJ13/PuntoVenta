# Local Seeds

Seeds locales ficticios para SQL Server Express. No contienen datos reales, secretos, passwords, tokens ni cadenas de conexion.

## Archivos

- `20260622_001_demo_seed.sql`: datos demo minimos para desarrollo local.

## Precondiciones

Ejecutar primero las migraciones MVP:

1. `database/migrations/20260620_001_initial_mvp_schema.sql`
2. `database/migrations/20260622_002_daily_cash_flow.sql`

## Como ejecutarlo

Usar la base local de desarrollo aprobada por la tarea vigente, por ejemplo `PuntoVentaLocal`.

Ejemplo con `sqlcmd` si esta disponible en la maquina:

```powershell
sqlcmd -S "localhost\SQLEXPRESS" -d "PuntoVentaLocal" -E -i "database\seeds\local\20260622_001_demo_seed.sql"
```

En este repositorio no se guarda ninguna cadena de conexion real. Si se usa otra herramienta local, mantener host, base y credenciales fuera de git.

## Idempotencia

El seed es idempotente: puede ejecutarse mas de una vez. Usa claves naturales estables:

- Empresa: `tax_id = PV-DEMO-LOCAL`
- Terminal: `code = CAJA-01`
- Usuarios: emails `*.demo@puntoventa.local`
- Roles: `system_key`
- Articulos: `sku`
- Recetas: articulo de salida

## Datos incluidos

- Empresa demo.
- Roles demo: administrador, cajero y encargado.
- Usuarios demo con hashes ficticios no aptos para autenticacion real.
- Terminal demo `CAJA-01`.
- Consumidor final por defecto.
- Categorias de bebidas, reposteria e insumos.
- Articulos de venta, materia prima e insumos operativos.
- Recetas demo para espresso y cafe latte.
- Proveedor demo.

## Guardrails

- Uso Azure SQL: No.
- Datos reales: No.
- Secretos versionados: No.
- El seed no abre caja, no crea ventas y no crea cuentas abiertas; esos flujos deben probarse desde API o tareas futuras para evitar estados operativos persistidos por defecto.
