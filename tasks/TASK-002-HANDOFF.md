# TASK-002 - Handoff

Equipo: Ejecucion Tecnica
Modo de ejecucion: SQL DEV / Data
Tarea completada: Definir modelo de datos MVP.

Archivos cambiados:

- `docs/DATA_MODEL.md`
- `docs/TASK_BOARD.md`
- `database/schema.sql`
- `database/migrations/20260620_001_initial_mvp_schema.sql`
- `tasks/TASK-002.md`
- `tasks/TASK-002-HANDOFF.md`

Verificacion ejecutada:

- Revision documental de `TASK-002`, `TASK-001-HANDOFF.md`, `docs/DEFINICION_PROYECTO.md` y `docs/DECISION_LOG.md`.
- Revision de reglas Azure SQL en `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`.
- Validacion estatica local del script SQL: 21 tablas, 13 indices, 134 constraints/defaults/FKs/checks y busqueda de patrones de secreto.
- `sqlcmd` no esta disponible en esta sesion, por lo que no hubo parseo/ejecucion contra motor SQL local.
- No se conecto a Azure SQL ni se ejecutaron migraciones en nube.

Resultado:

- Modelo inicial MVP definido para empresa, usuarios, roles, terminal, turnos de caja, categorias, articulos, recetas, cuentas abiertas, ventas, pagos, compras, inventario y caja.
- Inventario queda modelado por unidad base y movimientos.
- Articulos preparados quedan soportados por recetas e ingredientes.
- Cuentas abiertas quedan separadas de ventas cobradas; no descuentan inventario hasta el cobro.
- Se agrego una migracion T-SQL local revisable para Azure SQL / SQL Server.
- `TASK-004` queda desbloqueable por Proyecto cuando procese este handoff.

Uso DB cloud: No
Uso Azure SQL: No
Motivo: tarea de diseno/modelo local; no habia migracion aprobada para nube.
Alcance: documentacion y script T-SQL local.
Migracion aplicada: No aplica.
Validaciones: revision estatica local; 21 tablas, 13 indices, 134 constraints/defaults/FKs/checks; `sqlcmd` no disponible.
Firewall temporal creado: No
Firewall temporal retirado: No aplica

Riesgos o pendientes:

- El script no fue ejecutado contra SQL Server local porque no hay motor SQL confirmado en el workspace.
- Backend debe implementar el cobro como transaccion atomica para crear venta, pagos, movimientos de caja y movimientos de inventario.
- Seeds minimos quedan pendientes para una tarea posterior si Proyecto los requiere.
- Antes de aplicar en Azure SQL, crear una tarea explicita de migracion y validar con usuario/permisos adecuados.

Siguiente recomendado:

- Proyecto puede mover `TASK-004` a Ready/Assigned para definir contratos API contra este modelo.
- Web Dev puede continuar `TASK-003` con datos falsos sin depender de Azure SQL.

Movimiento de tablero:

- De: Ready
- A: Needs Review
