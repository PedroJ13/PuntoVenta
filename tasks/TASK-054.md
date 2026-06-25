# TASK-054 - Ejecutar primer deploy pilot Web API sin Azure SQL

## Estado

Blocked

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

Despues de adaptar API, provisionar recursos y configurar deploy, se puede ejecutar el primer deploy pilot Web + API sin Azure SQL.

## Objetivo

Ejecutar primer deploy pilot de Web estatica + API publicada, sin Azure SQL, y dejar evidencia tecnica para QA publicado.

## Alcance

- Ejecutar deploy Web + API segun configuracion aprobada.
- Verificar URL publica de Web.
- Verificar health/API publicada.
- Confirmar que Azure SQL no fue creado ni usado.
- Documentar URLs, comandos, estado de checks y limitaciones.
- Preparar evidencia para una tarea QA publicada posterior.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos a cloud.
- No hacer QA formal.
- No guardar secrets en repo.
- No cambiar funcionalidad del POS.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `tasks/TASK-051-HANDOFF.md`
- `tasks/TASK-052-HANDOFF.md`
- `tasks/TASK-053-HANDOFF.md`
- `docs/CLOUD_DEPLOY_PREFLIGHT.md`
- `docs/FIRST_DEPLOY_DECISION_PACKAGE.md`

## Dependencia

- Ejecutar despues de `TASK-053`.

## Criterios de aceptacion

- [ ] Web pilot publica responde.
- [ ] API pilot health responde.
- [x] No se usa Azure SQL.
- [x] URLs y evidencia quedan documentadas.
- [x] Queda recomendacion clara para QA publicado.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- HTTP checks no destructivos contra URLs publicas.
- `npm run check` antes del deploy si aplica.
- Busqueda de secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-054-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
