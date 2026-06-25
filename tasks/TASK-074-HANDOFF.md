# TASK-074 - Handoff

Equipo:
Ejecucion Tecnica

Modo de ejecucion:
Infra

Tarea completada:
TASK-074 - Provisionar Azure SQL pilot y configurar acceso seguro

Archivos cambiados:
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-073.md`
- `tasks/TASK-074.md`
- `tasks/TASK-074-HANDOFF.md`

Verificacion ejecutada:
- `az account show`
- `az group show --name rg-puntoventa-pilot-eastus2`
- `az functionapp show --name func-puntoventa-pilot-eastus2`
- `az sql server create`
- `az sql db create`
- `az sql server firewall-rule create`
- `az sql server firewall-rule delete`
- `az sql server firewall-rule list`
- `az functionapp config appsettings set`
- `az functionapp config appsettings list` con salida filtrada sin secretos
- `sqlcmd` para crear/verificar usuario runtime y permisos

Resultado:
Azure SQL pilot quedo provisionado y configurado para la siguiente fase.

Recursos:
- Resource group: `rg-puntoventa-pilot-eastus2`
- Region documentada original: `eastus2`
- Region SQL creada: `brazilsouth`
- SQL Server: `sqlserver-puntoventa-pilot-brazilsouth`
- SQL Server FQDN: `sqlserver-puntoventa-pilot-brazilsouth.database.windows.net`
- SQL Database: `sqldb-puntoventa-pilot`
- Function App: `func-puntoventa-pilot-eastus2`

Nota de region:
`eastus2` rechazo la creacion de nuevos Azure SQL Database servers con `RegionDoesNotAllowProvisioning`. El usuario aprobo usar la misma region utilizada por PuntoClub; se verifico que PuntoClub usa `brazilsouth` para SQL y se provisiono PuntoVenta alli.

Guardrails de costo:
- Edition: `GeneralPurpose`
- Service objective: `GP_S_Gen5_1`
- Compute model: serverless
- Min capacity: `0.5`
- Auto-pause delay: `60` minutos
- Backup redundancy: `Local`
- Zone redundant: `false`

Acceso runtime:
- Usuario runtime: `puntoventa_app_user`
- Permisos: `SELECT`, `INSERT`, `UPDATE`, `DELETE` sobre `SCHEMA::dbo`
- Sin permisos `ALTER`, `CREATE` ni `DROP` para runtime
- `SQL_CONNECTION_STRING` configurado en Azure Function App sin exponer valor
- `PV_SQLSERVER_ENABLED=false` se mantiene para no conectar la API antes de `TASK-075`

Firewall:
- Regla temporal local creada: `tmp-task074-sql-provision-200-229-6-68`
- Regla temporal local retirada: Si
- Verificacion de retiro: `[]`
- Reglas permanentes creadas solo para IPs outbound actuales de la Function App:
  - `func-puntoventa-api-01`: `52.179.221.166`
  - `func-puntoventa-api-02`: `52.177.149.208`
  - `func-puntoventa-api-03`: `52.179.218.36`
  - `func-puntoventa-api-04`: `52.179.221.159`
  - `func-puntoventa-api-05`: `52.179.223.29`
  - `func-puntoventa-api-06`: `52.167.19.53`
  - `func-puntoventa-api-07`: `20.119.136.5`

Uso DB cloud:
Si.
Motivo: provisionamiento autorizado de Azure SQL pilot, creacion de usuario runtime y configuracion de Function App para la siguiente fase.
Alcance: creacion de servidor/base, usuario runtime, reglas firewall y app setting secreto. No se ejecutaron migraciones de schema ni seeds.

Riesgos o pendientes:
- `TASK-075` debe aplicar migraciones aprobadas, habilitar `PV_SQLSERVER_ENABLED=true` y ejecutar smoke tecnico controlado.
- La API publicada sigue usando storage fake hasta `TASK-075`.
- Si la Function App cambia de plan o outbound IPs, hay que actualizar reglas firewall.
- La DB existe en `brazilsouth` mientras el resource group sigue en `eastus2`; queda documentado por restriccion regional de Azure SQL.
- No usar datos reales hasta QA/PO de persistencia real.

Siguiente recomendado:
Proyecto procesa este handoff. Si se acepta, liberar `TASK-075` para Backend/API: aplicar migraciones Azure SQL aprobadas, conectar API pilot, activar `PV_SQLSERVER_ENABLED=true` y ejecutar smoke tecnico corto sin exponer secretos.
