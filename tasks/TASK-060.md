# TASK-060 - Configurar secrets GitHub pilot y re-ejecutar workflows

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-059` confirmo que la Web publica y el API health responden `HTTP 200`, pero los workflows pilot fallaron porque no tienen secrets efectivos para deploy. Se requiere configurar los secrets sin exponer valores y re-ejecutar los workflows para que el deploy sea reproducible desde GitHub Actions.

## Objetivo

Configurar los secrets requeridos para GitHub Actions pilot y re-ejecutar los workflows Web/API hasta obtener resultado exitoso o bloqueo exacto documentado.

## Alcance

- Obtener o regenerar de forma segura los valores necesarios desde Azure, sin imprimirlos ni guardarlos en repo:
  - Static Web Apps deployment token para `swa-puntoventa-pilot-eastus2`.
  - Publish profile o credencial equivalente para `func-puntoventa-pilot-eastus2`.
- Configurar secrets en GitHub repo o ambiente `pilot`:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
  - `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`
- Re-ejecutar workflows:
  - `PuntoVenta API Pilot`
  - `PuntoVenta Web Pilot`
- Revisar runs/logs y documentar resultado.
- Validar de nuevo:
  - `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
  - `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
- Confirmar que no se crea ni usa Azure SQL.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No guardar secrets, tokens, publish profiles ni connection strings en repo.
- No exponer valores de secrets en logs, handoff ni chat.
- No hacer QA funcional completo.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-059-HANDOFF.md`
- `.github/workflows/puntoventa-web-pilot.yml`
- `.github/workflows/puntoventa-api-pilot.yml`

## Dependencia

- Ejecutar despues de `TASK-059`.

## Criterios de aceptacion

- [x] Secrets requeridos quedan configurados sin exponer valores, o bloqueo exacto documentado.
- [x] Workflow API pilot queda exitoso o bloqueo exacto documentado.
- [x] Workflow Web pilot queda exitoso o bloqueo exacto documentado.
- [x] Web publica responde.
- [x] API health publica responde.
- [x] No se crea ni usa Azure SQL.
- [x] Queda decision clara: crear QA publicado o siguiente desbloqueo.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia de configuracion de secrets sin valores.
- Evidencia de runs/logs de GitHub Actions.
- Checks HTTP no destructivos contra Web/API.
- Consulta Azure para confirmar ausencia de SQL.
- `git status --short --branch`.

## Handoff esperado

Crear o actualizar `tasks/TASK-060-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
