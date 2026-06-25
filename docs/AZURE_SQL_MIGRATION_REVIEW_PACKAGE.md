# Azure SQL Migration Review Package

Paquete preparado por `TASK-073` para revision antes de habilitar persistencia real en Azure SQL pilot.

## Estado

- Alcance: revision estatica y preparacion documental.
- Azure SQL usado: No.
- Migraciones ejecutadas: No.
- Recursos Azure creados o modificados: No.
- Secretos o connection strings guardados: No.

## Orden propuesto

1. `database/migrations/20260620_001_initial_mvp_schema.sql`
2. `database/migrations/20260622_002_daily_cash_flow.sql`
3. `database/seeds/local/20260622_001_demo_seed.sql` solo si Proyecto/PO aprueba cargar datos ficticios de demo en el pilot.

## Precondiciones

- `TASK-074` o tarea equivalente debe crear o habilitar una base Azure SQL pilot antes de cualquier ejecucion.
- La base debe estar vacia para la primera carga pilot. Si ya existe informacion real, se requiere una tarea de migracion incremental separada.
- La identidad de migracion debe ser distinta de la identidad runtime de la API.
- Los secretos deben configurarse fuera del repo, por ejemplo como App Settings o secret manager aprobado.
- La ejecucion debe usar un runner compatible con batches `GO`, como sqlcmd, SSMS o Azure Data Studio en modo script.
- No ejecutar desde la API ni desde un cliente que envie todo el archivo como una sola sentencia.

## Resultado de revision estatica

| Archivo | Resultado | Notas |
| --- | --- | --- |
| `database/migrations/20260620_001_initial_mvp_schema.sql` | Apto para revision Azure SQL | Usa T-SQL compatible SQL Server/Azure SQL: `IDENTITY`, `DATETIME2`, constraints e indices filtrados. No contiene `USE`, rutas locales, jobs, logins ni secretos. |
| `database/migrations/20260622_002_daily_cash_flow.sql` | Apto para revision Azure SQL con condicion de runner | Contiene separadores `GO` y recrea `CK_cash_movements_type` con `DROP CONSTRAINT`. Debe ejecutarse como script por batches y en base pilot vacia o controlada. |
| `database/seeds/local/20260622_001_demo_seed.sql` | Opcional para pilot demo | Datos ficticios y estables para demo. No debe interpretarse como seed productivo ni como autenticacion real. |

## Seeds ficticios

El seed local existente se puede reutilizar como seed pilot demo si se aprueba cargar datos ficticios.

- Tenant: `PV-DEMO-LOCAL`.
- Datos: catalogo, inventario, caja diaria, cuentas abiertas, ventas y pagos ficticios.
- Identificadores naturales estables para soportar reejecucion controlada.
- Hashes/PINs fake solo para entorno demo; no son credenciales productivas.

Si el pilot se decide con datos reales desde el inicio, no cargar este seed. En ese caso se debe crear una tarea SQL/Data separada para carga inicial, limpieza de datos y reglas de tenant.

## Riesgos

- `GO` en la migracion 002 exige runner por batches; un executor no compatible puede fallar.
- `DROP CONSTRAINT CK_cash_movements_type` es no destructivo para datos, pero debe revisarse si la base no esta vacia.
- El seed usa datos ficticios y no debe mezclarse con informacion real de clientes.
- La primera base pilot debe validar tenant isolation antes de recibir datos reales.
- Rollback destructivo solo es aceptable antes de datos reales y con autorizacion explicita.

## Rollback o mitigacion

- Si falla una migracion, detener la secuencia y conservar el error sin secretos en el handoff.
- Antes de cargar datos reales, la mitigacion preferida para una base pilot fallida es recrear la base desde cero mediante una tarea Infra/SQL autorizada.
- Despues de cargar datos reales, no usar `DROP DATABASE`, `DROP TABLE` ni truncados como rollback. Preparar migracion correctiva revisable.
- Si la API se conecta y aparece degradacion, deshabilitar persistencia SQL en runtime mediante configuracion aprobada y volver al modo publicado anterior hasta diagnosticar.

## Verificacion recomendada posterior

Cuando `TASK-074` habilite la base y exista autorizacion explicita para ejecutar SQL:

1. Ejecutar las migraciones en el orden indicado.
2. Confirmar existencia de tablas, constraints e indices principales.
3. Si se aprueba seed demo, ejecutar el seed y revisar conteos basicos por tabla.
4. Documentar version exacta de scripts ejecutados, runner usado y resultado.
5. Dejar la conexion API y smoke tecnico para `TASK-075`, no para esta tarea SQL/Data.
