# TASK-034 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL DEV/Data
Tarea completada: Crear seeds locales ficticios para SQL Server Express
Archivo de tarea: `tasks/TASK-034.md`
Estado entregado: Needs Review

## Resultado

Status: exitosa

Se crearon seeds locales ficticios para SQL Server Express bajo `database/seeds/local/`. Los seeds son idempotentes, respetan `company_id`, no contienen datos reales, no contienen secretos y fueron validados en una base local temporal despues de ejecutar las migraciones MVP.

## Archivos cambiados

- `database/seeds/local/20260622_001_demo_seed.sql`
- `database/seeds/local/README.md`
- `tasks/TASK-034.md`
- `tasks/TASK-034-HANDOFF.md`
- `docs/TASK_BOARD.md`

## Datos incluidos

- Empresa demo con `tax_id = PV-DEMO-LOCAL`.
- Roles demo: administrador, cajero y encargado.
- Usuarios demo con emails `*.demo@puntoventa.local` y hashes ficticios no aptos para autenticacion real.
- Terminal demo `CAJA-01`.
- Consumidor final por defecto.
- Categorias: bebidas calientes, bebidas frias, reposteria e insumos.
- Articulos de venta: espresso, cafe latte, agua botella 600ml y queque chocolate.
- Materia prima e insumos: cafe en grano, leche y vaso 12oz.
- Recetas demo para espresso y cafe latte.
- Proveedor demo local.

## Idempotencia y precondiciones

El seed puede ejecutarse mas de una vez. Usa claves naturales estables:

- Empresa: `tax_id`
- Roles: `system_key`
- Usuarios: `email`
- Terminal: `code`
- Categorias: `name` por empresa
- Articulos: `sku`
- Recetas: articulo de salida
- Ingredientes: receta + articulo insumo

Precondicion: ejecutar primero las migraciones:

1. `database/migrations/20260620_001_initial_mvp_schema.sql`
2. `database/migrations/20260622_002_daily_cash_flow.sql`

La documentacion de ejecucion local quedo en `database/seeds/local/README.md`.

## Verificacion ejecutada

- Lectura de `AGENTS.md`.
- Lectura de `chat-start/EJECUCION_TECNICA.md`.
- Lectura de `docs/README.md`.
- Lectura de `docs/MVP_RELEASE_STATUS.md`.
- Lectura de `docs/TASK_BOARD.md`.
- Lectura de `docs/SQL_SERVER_EXPRESS_LOCAL.md`.
- Lectura de `docs/DATA_MODEL.md`.
- Lectura de `tasks/TASK-033-HANDOFF.md`.
- Lectura de `database/migrations/20260620_001_initial_mvp_schema.sql`.
- Lectura de `database/migrations/20260622_002_daily_cash_flow.sql`.
- Revision estatica de `database/seeds/local/20260622_001_demo_seed.sql`.
- Ejecucion local en SQL Server Express con autenticacion Windows integrada.
- Ejecucion de migraciones y seed en base local temporal.
- Ejecucion del seed dos veces para validar idempotencia.
- Busqueda de secretos y connection strings reales en archivos cambiados.

## Evidencia local

```text
connected=true
Microsoft SQL Server 2022 (RTM) - 16.0.1000.6 (X64)
database=PuntoVentaLocal_Task034_SeedTest_20260622_120114
sql_ok=database/migrations/20260620_001_initial_mvp_schema.sql batches=1
sql_ok=database/migrations/20260622_002_daily_cash_flow.sql batches=3
sql_ok=database/seeds/local/20260622_001_demo_seed.sql batches=1
sql_ok=database/seeds/local/20260622_001_demo_seed.sql batches=1
companies=1
roles=3
users=2
terminals=1
customers=1
categories=4
items=7
recipes=2
recipe_ingredients=5
suppliers=1
```

## Resultado por criterio

| Criterio | Resultado |
| --- | --- |
| Existen seeds locales ficticios en `database/seeds/local/` | Cumple |
| Incluyen empresa demo y datos operativos minimos | Cumple |
| Respetan `company_id` y no mezclan tenants | Cumple |
| Queda documentado como ejecutarlos localmente | Cumple |
| No se guardan secretos ni datos reales | Cumple |
| No se conecta Azure SQL | Cumple |
| El handoff indica `Uso Azure SQL: No` | Cumple |

## Uso DB/cloud

- Uso SQL Server Express local: Si, motivo: validacion controlada del seed en base temporal.
- Base local temporal usada: `PuntoVentaLocal_Task034_SeedTest_20260622_120114`.
- Uso DB cloud: No.
- Uso Azure SQL: No.
- Recursos Azure creados: No.
- Secretos creados o expuestos en archivos: No.
- Connection strings reales guardadas: No.

## Riesgos o pendientes

- La base temporal de validacion quedo creada como evidencia; no se borro para evitar eliminar artefactos locales sin instruccion explicita.
- El seed no abre caja, no crea ventas y no crea cuentas abiertas. Esto es intencional para que los flujos operativos los genere la API o tareas futuras.
- Futuras tareas de API SQL deben decidir si cargan estos seeds automaticamente o si quedan como paso manual de ambiente local.

## Siguiente recomendado

Proyecto puede procesar este handoff. La siguiente tarea tecnica puede conectar la API local a SQL Server Express con repositorios SQL reales usando estas migraciones y seeds como base.

## Movimiento de tablero

- De: Assigned
- A: Needs Review
