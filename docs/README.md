# PuntoVenta Docs

## Orden recomendado

- `ESTADO_OPERATIVO.md`: estado vivo corto; leer primero para saber que esta activo ahora.
- `CURRENT_BLOCKERS.md`: bloqueos activos, responsable y siguiente accion.
- `MVP_RELEASE_STATUS.md`: estado operativo y release.
- `TASK_BOARD.md`: tablero versionado por etapa y equipo/chat.
- `MVP_CRITERIA.md`: criterios de aceptacion del MVP.
- `BACKLOG.md`: inventario priorizado.
- `DECISION_LOG.md`: decisiones durables.
- `ARCHITECTURE.md`: arquitectura inicial.
- `AZURE_INFRA_PLAN.md`: plan inicial Azure, nombres de recursos, deploy, secretos y guardrails de costo.
- `CLOUD_DEPLOY_PREFLIGHT.md`: preflight cloud/deploy sin crear recursos ni ejecutar deploy.
- `FIRST_DEPLOY_DECISION_PACKAGE.md`: paquete de decision para autorizar o rechazar primer deploy.
- `PILOT_DEPLOY_CONFIG.md`: configuracion de workflows y App Settings pilot sin secretos en repo.
- `CLOUD_PERSISTENCE_DECISION_PLAN.md`: decision y plan para pasar del storage fake publicado a persistencia Azure SQL pilot sin crear recursos en la tarea de decision.
- `AZURE_SQL_MIGRATION_REVIEW_PACKAGE.md`: paquete revisable de migraciones y seed ficticio para Azure SQL pilot, sin ejecutar SQL ni crear recursos.
- `DATA_MODEL.md`: modelo de datos.
- `SQL_SERVER_EXPRESS_LOCAL.md`: convenciones para preparar SQL Server Express local sin secretos ni conexion real.
- `SMOKE_LOCAL_APP_API_SQL.md`: smoke tecnico local app/API/SQL para validar el flujo principal con SQL Server Express local.
- `QA_SQL_LOCAL_TECH_PACKAGE.md`: paquete tecnico consolidado para QA de la integracion SQL local.
- `API_CONTRACTS.md`: contratos API propuestos.
- `AUTH_PERMISSIONS.md`: autenticacion, roles y matriz de permisos MVP.
- `TICKET_FORMAT_MVP.md`: formato de ticket interno de caja para MVP, reimpresion y anulacion futura.
- `CASH_DAILY_FLOW_MVP.md`: flujo operativo de caja diaria, apertura, movimientos, cierre, arqueo y diferencias.
- `QA_TEST_PLAN.md`: checklist de validacion.
- `WORKFLOW_CODEX.md`: flujo de trabajo por chats.
- `TOOLS.md`: herramientas locales recomendadas/verificadas.
- `PROYECTO_TOOLING_ADOPTION.md`: orden de adopcion de tooling local; no instalar tooling nuevo antes de baseline local/Git y QA local estable.

## Regla

No duplicar todo en todos los docs. Cada doc debe tener una responsabilidad clara.

`ESTADO_OPERATIVO.md` manda para el presente. `MVP_RELEASE_STATUS.md`, `BACKLOG.md` y los handoffs son historia/evidencia cuando el estado corto ya resume el frente activo.

