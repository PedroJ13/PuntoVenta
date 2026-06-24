# TASK-006 - Definir plan inicial de infraestructura Azure

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

El proyecto usara Azure, pero la infraestructura debe planificarse con costo controlado, secretos fuera del repo y sin despertar Azure SQL antes de tiempo.

## Objetivo

Definir el plan inicial de infraestructura Azure para frontend, API, secretos, despliegue y Azure SQL de bajo costo, sin crear recursos todavia.

## Alcance

- Proponer nombres de recursos para ambiente piloto/MVP.
- Definir si se usara Azure Static Web Apps para frontend.
- Definir si se usara Azure Functions para API HTTP.
- Definir estrategia de GitHub Actions.
- Definir estrategia de secretos y App Settings.
- Definir guardrails de costo y uso para Azure SQL.
- Documentar que Azure SQL no se usa para tareas visuales o frontend.

## Fuera de alcance

- No crear recursos Azure.
- No ejecutar deploy.
- No crear ni exponer secretos.
- No aplicar migraciones.
- No conectar Azure SQL.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/MVP_RELEASE_STATUS.md`
- `docs/TASK_BOARD.md`
- `docs/DEFINICION_PROYECTO.md`
- `docs/PULSO_A_PROYECTO_PROTOTIPO_APROBADO.md`
- `C:\Work\azure-infra-templates\WEB_AZURE_STATIC_APPS_FUNCTIONS.md`
- `C:\Work\azure-infra-templates\AZURE_SQL_DATABASE.md`

## Criterios de aceptacion

- [x] Hay propuesta de recursos y nombres.
- [x] Hay estrategia de deploy frontend/API.
- [x] Hay estrategia de secretos fuera del repo.
- [x] Hay reglas de costo y uso para Azure SQL.
- [x] El handoff indica explicitamente que no se crearon recursos.

## Verificacion esperada

- Revision documental del plan.
- Confirmar que no se ejecutaron comandos de creacion de recursos.
- Confirmar `Uso Azure SQL: No`.

## Handoff esperado

Crear o actualizar `tasks/TASK-006-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
