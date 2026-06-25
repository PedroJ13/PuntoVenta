# TASK-055 - Configurar Web pilot con API base URL publicada

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Web Dev
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-053` dejo configurado el deploy Web/API sin secrets en repo y `TASK-054` registro que la API quedo publicada en Azure Functions, pero el Web aun no tiene como default la API publicada. Para el pilot A+B se necesita que la Web pueda apuntar a la API publicada sin depender solo de override manual local.

## Objetivo

Configurar la Web pilot para usar la API publicada como base URL de ambiente publicado, manteniendo fallback/override local y sin incluir secrets.

## Alcance

- Definir la fuente de configuracion de `apiBaseUrl` para ambiente publicado.
- Usar como API pilot: `https://func-puntoventa-pilot-eastus2.azurewebsites.net`.
- Mantener compatibilidad local y override por `localStorage.pvApiBaseUrl` si existe.
- Evitar hardcode riesgoso que rompa desarrollo local.
- Documentar como validar que Web usa la API publicada.
- No hacer deploy.
- No crear ni usar Azure SQL.

## Fuera de alcance

- No ejecutar deploy Web.
- No cambiar endpoints o contratos API.
- No crear Azure SQL ni base de datos cloud.
- No guardar tokens, secrets ni connection strings.
- No hacer QA formal.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-053-HANDOFF.md`
- `tasks/TASK-054-HANDOFF.md`
- `app/README.md`

## Dependencia

- Ejecutar despues de `TASK-053`.
- `TASK-054` quedo bloqueada parcialmente, pero dejo API Function App publicada/registrada para usar como base URL.

## Criterios de aceptacion

- [x] Web tiene configuracion clara para API base URL publicada.
- [x] Desarrollo local sigue funcionando.
- [x] No se guardan secrets en repo.
- [x] No se crea ni usa Azure SQL.
- [x] Queda documentado como validar la configuracion.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Checks locales relevantes de Web.
- Inspeccion de config para confirmar ausencia de secrets.
- Evidencia de URL API base esperada en ambiente pilot.

## Handoff esperado

Crear o actualizar `tasks/TASK-055-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
