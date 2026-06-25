# TASK-052 - Provisionar recursos pilot Web API sin Azure SQL

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

Despues de adaptar API a Azure Functions en `TASK-051`, se necesita provisionar recursos `pilot` para Web + API. La decision aprobada excluye Azure SQL del primer deploy.

## Objetivo

Provisionar recursos Azure minimos para Web estatica y API en ambiente `pilot`, sin Azure SQL.

## Alcance

- Confirmar suscripcion/tenant/region antes de ejecutar.
- Crear o validar resource group `pilot` si no existe.
- Crear Static Web App para `app/`.
- Crear Function App y recursos minimos asociados para API.
- Crear Application Insights/logging basico si aplica.
- Documentar nombres, URLs, costos/sku y comandos usados.
- No crear Azure SQL.

## Fuera de alcance

- No conectar Azure SQL.
- No crear base de datos cloud.
- No migrar datos.
- No guardar secrets en repo.
- No hacer deploy funcional si requiere tarea separada.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/AZURE_INFRA_PLAN.md`
- `docs/CLOUD_DEPLOY_PREFLIGHT.md`
- `docs/FIRST_DEPLOY_DECISION_PACKAGE.md`
- `tasks/TASK-051-HANDOFF.md`

## Dependencia

- Ejecutar despues de `TASK-051`.

## Criterios de aceptacion

- [x] Recursos pilot para Web + API quedan provisionados o bloqueo claro documentado.
- [x] No se crea Azure SQL.
- [x] No se guardan secrets en repo.
- [x] URLs/nombres/sku quedan documentados.
- [x] Handoff indica costos/guardrails y `Uso Azure SQL: No`.

## Verificacion esperada

- Comandos Azure usados con salida resumida.
- `git status --short --branch`.
- Busqueda de secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-052-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
