# TASK-059 - Ejecutar workflows pilot desde GitHub UI y validar URLs externas

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-057` publico en GitHub los cambios necesarios para el deploy pilot. `TASK-058` confirmo que los workflows existen en `main`, pero no pudo ejecutarlos desde esta sesion porque `gh` tiene token invalido y las herramientas disponibles no permiten disparar `workflow_dispatch`. Tambien siguen fallando los checks HTTP hacia Azure desde este entorno.

## Objetivo

Ejecutar o coordinar desde GitHub UI los workflows pilot y validar desde una red externa si Web/API publicos responden.

## Alcance

- Confirmar en GitHub UI que existen los secrets requeridos sin exponer valores:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
  - `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`
- Ejecutar manualmente desde GitHub Actions:
  - `PuntoVenta API Pilot`
  - `PuntoVenta Web Pilot`
- Revisar resultado de runs/logs.
- Validar desde una red externa:
  - `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
  - `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- Confirmar que no se crea ni usa Azure SQL.
- Recomendar si procede crear tarea QA publicado.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No guardar secrets en repo.
- No hacer QA funcional completo.
- No cambiar funcionalidad del POS.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-057-HANDOFF.md`
- `tasks/TASK-058-HANDOFF.md`
- `.github/workflows/puntoventa-web-pilot.yml`
- `.github/workflows/puntoventa-api-pilot.yml`

## Dependencia

- Ejecutar despues de `TASK-058`.

## Criterios de aceptacion

- [x] Workflows pilot quedan ejecutados con resultado documentado, o bloqueo exacto documentado.
- [x] Web publica responde o bloqueo exacto documentado.
- [x] API health publica responde o bloqueo exacto documentado.
- [x] No se crea ni usa Azure SQL.
- [x] No se exponen secretos.
- [x] Queda decision clara: crear QA publicado o siguiente desbloqueo.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia de runs/logs de GitHub Actions.
- Checks HTTP desde navegador/red externa.
- Consulta Azure para confirmar ausencia de SQL si aplica.
- `git status --short --branch`.

## Handoff esperado

Crear o actualizar `tasks/TASK-059-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
