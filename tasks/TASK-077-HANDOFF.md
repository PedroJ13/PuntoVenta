# TASK-077 - Handoff

Equipo:
Ejecucion Tecnica

Modo de ejecucion:
Infra

Tarea completada:
TASK-077 - TASK-074.5 Ajustar guardrails Azure SQL pilot costo minimo

Archivos cambiados:
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `tasks/TASK-075.md`
- `tasks/TASK-077.md`
- `tasks/TASK-077-HANDOFF.md`

Verificacion ejecutada:
- `az sql db show`
- `az sql db update --auto-pause-delay 15`
- `az sql server show`
- `az sql db str-policy show`
- `az lock create`
- `az rest` para lock explicito en SQL Database por limitacion de `az lock create` con recurso hijo
- `az lock list`
- `az sql server firewall-rule list`
- `az functionapp config appsettings list` con salida filtrada sin secretos

Resultado:
Guardrails de costo minimo y seguridad operativa ajustados antes de liberar conexion API.

Recursos revisados:
- Resource group: `rg-puntoventa-pilot-eastus2`
- SQL Server: `sqlserver-puntoventa-pilot-brazilsouth`
- SQL Database: `sqldb-puntoventa-pilot`
- Region SQL: `brazilsouth`
- Function App: `func-puntoventa-pilot-eastus2`

Guardrails confirmados:
- Service objective: `GP_S_Gen5_1`
- Min capacity: `0.5`
- Auto-pause: `15` minutos
- Backup redundancy: `Local`
- Zone redundant: `false`
- TLS minimo: `1.2`
- PITR / short-term retention: `7` dias
- Differential backup interval: `12` horas
- Public network access: `Enabled`

Locks:
- SQL Server: `lock-puntoventa-sqlserver-pilot-cannotdelete`, nivel `CanNotDelete`
- SQL Database: `lock-puntoventa-sqldb-pilot-cannotdelete`, nivel `CanNotDelete`

Firewall:
- No se crearon reglas temporales para `TASK-077`.
- Verificacion de temporales `tmp-task074` / `tmp-task077`: `[]`
- Public network access queda `Enabled` porque la API accede desde Azure Functions mediante reglas firewall a IPs outbound actuales configuradas en `TASK-074`.

App settings:
- `SQL_CONNECTION_STRING` existe en Function App, sin exponer valor.
- `PV_SQLSERVER_ENABLED=false`.
- `APP_ENV=pilot`.

Uso DB cloud:
Si.
Motivo: ajuste/verificacion de configuracion Azure SQL pilot autorizada.
Alcance: auto-pause, locks, TLS/PITR/public network access y app settings filtrados. No se ejecutaron migraciones, seeds ni consultas de datos de negocio.

Riesgos o pendientes:
- `TASK-075` debe activar conexion API solo si aplica migraciones/smoke controlado.
- `PV_SQLSERVER_ENABLED` sigue en `false`; la API publicada no esta conectada todavia a Azure SQL.
- `PublicNetworkAccess=Enabled` requiere mantener firewall restringido; si cambian outbound IPs de Function App hay que actualizar reglas.
- Locks `CanNotDelete` protegen contra borrado accidental, pero pueden bloquear cambios destructivos futuros hasta que una tarea explicita los retire.
- Validar free limit / `BillOverUsage` queda fuera de esta tarea segun alcance de `TASK-077`.

Siguiente recomendado:
Proyecto procesa este handoff. Si se acepta, liberar `TASK-075` para Backend/API: aplicar migraciones aprobadas, conectar API pilot a Azure SQL, activar `PV_SQLSERVER_ENABLED=true` y ejecutar smoke tecnico controlado sin exponer secretos.
