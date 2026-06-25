# TASK-072 - Handoff

Equipo:
Ejecucion Tecnica

Modo de ejecucion:
Infra

Tarea completada:
TASK-072 - Definir decision y plan de persistencia real cloud

Archivos cambiados:
- `docs/CLOUD_PERSISTENCE_DECISION_PLAN.md`
- `docs/README.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-072.md`
- `tasks/TASK-072-HANDOFF.md`

Verificacion ejecutada:
- Lectura de `AGENTS.md`
- Lectura de `chat-start/EJECUCION_TECNICA.md`
- Lectura de `docs/ESTADO_OPERATIVO.md`
- Lectura de `docs/MVP_RELEASE_STATUS.md`
- Lectura de `docs/FIRST_DEPLOY_DECISION_PACKAGE.md`
- Lectura de `docs/AZURE_INFRA_PLAN.md`
- Lectura de `docs/DATA_MODEL.md`
- Lectura de `docs/SQL_SERVER_EXPRESS_LOCAL.md`
- Lectura de `docs/PILOT_BASELINE_RUNBOOK.md`
- Lectura de `tasks/TASK-071-HANDOFF.md`
- `git status --short --branch`

Resultado:
Se preparo la decision tecnica y operativa para pasar de storage fake publicado a persistencia real cloud. La recomendacion es avanzar con Azure SQL pilot, pero solo en tareas separadas y con autorizacion explicita posterior antes de crear recursos.

Documento principal:

```text
docs/CLOUD_PERSISTENCE_DECISION_PLAN.md
```

Decision:

```text
Avanzar con Azure SQL pilot como ruta recomendada para persistencia real cloud.
No crear Azure SQL ni modificar cloud dentro de TASK-072.
```

Alcance minimo recomendado:

- empresa demo y tenant minimo;
- usuarios/roles minimos si aplican al flujo publicado;
- terminal y caja diaria;
- catalogo, articulos, materias primas y recetas necesarias para demo;
- cuentas abiertas;
- ventas, pagos, ticket interno;
- movimientos de inventario y caja;
- reportes MVP.

Orden seguro validado:

1. `TASK-073`: SQL DEV/Data prepara migraciones Azure SQL revisables y seeds ficticios si se aprueban.
2. `TASK-074`: Infra provisiona Azure SQL pilot y configura runtime access solo con autorizacion explicita.
3. `TASK-075`: Backend/API conecta API pilot a Azure SQL y ejecuta smoke tecnico controlado.
4. `TASK-076`: QA valida Web/API publicado con persistencia Azure SQL.
5. PO Test posterior: aprobar o rechazar piloto con persistencia real.

Recursos/config que harian falta, sin valores sensibles:

- SQL Server: `sqlserver-puntoventa-pilot-eastus2`
- SQL Database: `sqldb-puntoventa-pilot`
- Runtime SQL user: `puntoventa_app_user`
- App setting no secreto: `PV_SQLSERVER_ENABLED=true`
- App setting secreto: `SQL_CONNECTION_STRING`
- App settings no secretos existentes: `APP_ENV=pilot`, `ALLOWED_ORIGINS`

Riesgos o pendientes:
- Costo de Azure SQL debe aprobarse antes de `TASK-074`.
- Migraciones deben revisarse antes de provisionar/conectar.
- Seeds deben ser ficticios; no usar datos reales.
- Runtime SQL no debe usar usuario admin.
- Secrets deben vivir fuera del repo y no imprimirse en handoffs/logs.
- Rollback debe contemplar volver a storage fake por configuracion si Proyecto lo decide.

Uso DB cloud:
No. Uso Azure SQL: No.

Siguiente recomendado:
Proyecto debe procesar este handoff. Si acepta la ruta propuesta, liberar `TASK-073`; mantener `TASK-074` bloqueada hasta autorizacion explicita de creacion de Azure SQL, presupuesto/SKU, region y responsable.
