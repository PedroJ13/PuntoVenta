# TASK-051 - Adaptar API local a Azure Functions sin Azure SQL

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Backend/API
Prioridad: P1 pre-lanzamiento

## Contexto

Proyecto/PO eligio avanzar con opcion A+B: Web estatica + API publicada, dejando Azure SQL fuera. El API actual corre como servidor Node local; antes de publicar API se requiere adaptarlo o envolverlo como Azure Functions manteniendo contratos.

## Objetivo

Preparar la API para ejecutarse como Azure Functions sin cambiar contratos ni conectar Azure SQL.

## Alcance

- Crear estructura minima de Azure Functions para exponer las rutas actuales bajo `/api`.
- Mantener compatibilidad local con `api/src/server.js`.
- Mantener contratos existentes de health, catalogo, cuentas, caja, ventas, tickets y reportes.
- Mantener fallback fake/local y no requerir Azure SQL.
- Agregar scripts/checks locales para validar Functions si aplica.
- Documentar como correr/verificar localmente.

## Fuera de alcance

- No crear recursos Azure.
- No hacer deploy.
- No conectar Azure SQL.
- No migrar datos a cloud.
- No guardar secrets, tokens ni connection strings.
- No cambiar funcionalidad del POS.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CLOUD_DEPLOY_PREFLIGHT.md`
- `docs/FIRST_DEPLOY_DECISION_PACKAGE.md`
- `docs/API_CONTRACTS.md`
- `tasks/TASK-049-HANDOFF.md`
- `tasks/TASK-050-HANDOFF.md`
- `api/README.md`

## Dependencia

- Liberada por decision Proyecto/PO de opcion A+B.

## Criterios de aceptacion

- [x] API puede ejecutarse o exponerse en estructura compatible con Azure Functions.
- [x] Contratos existentes se mantienen.
- [x] `npm run check` en `api/` pasa.
- [x] No se crean recursos Azure.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- `npm run check` en `api/`.
- Smoke local de endpoints si aplica.
- Busqueda de secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-051-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
