# TASK-053 - Configurar deploy Web API sin secrets en repo

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

Con API adaptada y recursos pilot creados, se requiere configurar el camino de deploy de Web + API sin guardar secrets en el repositorio.

## Objetivo

Configurar el mecanismo de deploy para Web estatica y API publicada, usando GitHub Secrets/Azure App Settings o equivalente, sin exponer secretos.

## Alcance

- Definir o crear workflows de deploy para Web y API si aplica.
- Configurar referencias a secrets por nombre, sin valores reales.
- Configurar App Settings necesarios en Azure sin escribir valores en repo.
- Confirmar que `app/` y `api/` se publican desde rutas correctas.
- Mantener Azure SQL fuera del deploy.

## Fuera de alcance

- No crear Azure SQL.
- No guardar tokens/secrets/connection strings en repo.
- No migrar datos.
- No hacer cambios funcionales.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/CLOUD_DEPLOY_PREFLIGHT.md`
- `docs/FIRST_DEPLOY_DECISION_PACKAGE.md`
- `tasks/TASK-051-HANDOFF.md`
- `tasks/TASK-052-HANDOFF.md`

## Dependencia

- Ejecutar despues de `TASK-052`.

## Criterios de aceptacion

- [x] Deploy Web/API queda configurado o bloqueo claro documentado.
- [x] Secrets se referencian por nombre, sin valores reales en repo.
- [x] Azure SQL sigue fuera del alcance.
- [x] Checks locales relevantes pasan.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revisar workflows/config.
- Ejecutar checks locales posibles.
- Buscar secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-053-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
