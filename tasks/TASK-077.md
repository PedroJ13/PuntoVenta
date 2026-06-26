# TASK-077 - TASK-074.5 Ajustar guardrails Azure SQL pilot costo minimo

## Estado

Done

## Nombre del Equipo

Ejecucion Tecnica

## Modo

Infra

## Nombre de la tarea

TASK-077 - TASK-074.5 Ajustar guardrails Azure SQL pilot costo minimo

## Handoff esperado

Al finalizar, debe crear o actualizar `tasks/TASK-077-HANDOFF.md` usando el formato de handoff indicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/CLOUD_PERSISTENCE_DECISION_PLAN.md`
- `docs/AZURE_SQL_MIGRATION_REVIEW_PACKAGE.md`
- `tasks/TASK-074-HANDOFF.md`
- `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`

## Objetivo

Ajustar y documentar los guardrails de Azure SQL pilot provisionado en `TASK-074` antes de liberar conexion API, manteniendo costo minimo y seguridad operativa.

## Alcance

- Cambiar auto-pause de Azure SQL de `60` a `15` minutos si Azure lo permite.
- Agregar o confirmar locks `CanNotDelete` en:
  - SQL Server.
  - SQL Database.
- Documentar y verificar:
  - TLS minimo.
  - PITR / short-term retention.
  - Public network access.
- Confirmar que la API sigue con `PV_SQLSERVER_ENABLED=false`.
- Actualizar documentacion operativa si corresponde:
  - `docs/PILOT_DEPLOY_CONFIG.md`
  - `docs/ESTADO_OPERATIVO.md`
  - `docs/MVP_RELEASE_STATUS.md`
  - `docs/TASK_BOARD.md`
- Crear handoff con evidencia sin secretos.

## Fuera de alcance

- No conectar API a Azure SQL.
- No ejecutar migraciones ni seeds.
- No activar `PV_SQLSERVER_ENABLED=true`.
- No validar free limit ni `BillOverUsage` todavia; queda para una tarea posterior.
- No cambiar SKU salvo que sea necesario para habilitar auto-pause minimo y quede justificado.
- No exponer connection strings, usuarios, passwords ni secretos.
- No usar datos reales.

## Criterios de aceptacion

- [x] Auto-pause queda en `15` minutos o bloqueo exacto documentado.
- [x] Locks `CanNotDelete` confirmados en SQL Server y SQL Database.
- [x] TLS minimo documentado.
- [x] PITR / short-term retention documentado.
- [x] Public network access documentado.
- [x] Se confirma `PV_SQLSERVER_ENABLED=false`.
- [x] Handoff indica `Uso Azure SQL: Si`.
- [x] Handoff indica que no se ejecutaron migraciones ni se conecto la API.

## Verificacion esperada

- Evidencia de configuracion Azure SQL sin secretos.
- Evidencia de locks.
- Evidencia de auto-pause.
- Evidencia de TLS/PITR/public network access.
- App settings filtrados sin valores sensibles, confirmando SQL runtime deshabilitado.

## Dependencia

Liberada por Proyecto despues de revisar `TASK-074`. Bloquea `TASK-075`.
