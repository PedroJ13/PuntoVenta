# TASK-057 - Consolidar cambios locales para deploy pilot

## Estado

Needs Review

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-056` confirmo que GitHub Actions no se puede ejecutar desde esta sesion con `gh` por token invalido y que los cambios de `TASK-055` estan locales. Antes de intentar un deploy por Actions, el repo debe quedar consolidado con un commit/push seguro que incluya los cambios necesarios y no incluya secretos.

## Objetivo

Preparar y publicar los cambios locales necesarios para que GitHub Actions pueda ejecutar el deploy pilot Web/API.

## Alcance

- Revisar `git status` y separar cambios relacionados con deploy pilot.
- Confirmar que no haya secrets, tokens, connection strings ni `.env`.
- Ejecutar checks relevantes antes del commit.
- Crear commit local con los cambios necesarios para el deploy pilot.
- Intentar push al remoto configurado si las credenciales Git lo permiten.
- Si push no es posible, documentar bloqueo exacto y comandos seguros para retomarlo.
- No crear ni usar Azure SQL.

## Fuera de alcance

- No ejecutar deploy publicado.
- No crear Azure SQL.
- No migrar datos.
- No cambiar funcionalidad fuera de lo necesario para deploy/config pilot.
- No guardar secrets en repo.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/PROYECTO_TOOLING_ADOPTION.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-055-HANDOFF.md`
- `tasks/TASK-056-HANDOFF.md`

## Dependencia

- Ejecutar despues de `TASK-055` y `TASK-056`.

## Criterios de aceptacion

- [x] Cambios necesarios para deploy pilot quedan commiteados localmente.
- [x] Push a GitHub queda realizado o bloqueo exacto documentado.
- [x] Checks relevantes quedan ejecutados o bloqueo documentado.
- [x] No quedan secrets en repo.
- [x] No se crea ni usa Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- `git status --short --branch`.
- Checks locales relevantes.
- Busqueda de secretos en archivos cambiados.
- Evidencia de commit y, si aplica, push.

## Handoff esperado

Crear o actualizar `tasks/TASK-057-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
