# TASK-049 - Preflight cloud deploy sin crear recursos

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

QA y PO aprobaron el MVP SQL local, y `TASK-048` dejo tooling minimo local. Antes de cualquier creacion de recursos o deploy, hace falta un preflight tecnico de cloud/deploy para revisar herramientas, plan y riesgos sin tocar Azure.

## Objetivo

Preparar el preflight de deploy cloud del MVP sin crear ni modificar recursos Azure.

## Alcance

- Revisar `docs/AZURE_INFRA_PLAN.md`.
- Revisar `docs/PROYECTO_TOOLING_ADOPTION.md`.
- Confirmar herramientas locales disponibles solo con comandos de version o status.
- Revisar `app/staticwebapp.config.json`.
- Revisar estrategia de API para deploy futuro sin ejecutar deploy.
- Identificar variables/secretos requeridos sin crear ni guardar secretos.
- Documentar riesgos, pasos previos y decision necesaria antes de crear recursos.

## Fuera de alcance

- No crear recursos Azure.
- No conectar Azure SQL.
- No hacer deploy.
- No ejecutar `az` contra recursos.
- No ejecutar `swa deploy`.
- No instalar herramientas nuevas.
- No guardar secrets, connection strings ni tokens.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/ESTADO_OPERATIVO.md`
- `docs/CURRENT_BLOCKERS.md`
- `docs/AZURE_INFRA_PLAN.md`
- `docs/PROYECTO_TOOLING_ADOPTION.md`
- `tasks/TASK-045-HANDOFF.md`
- `tasks/TASK-047-HANDOFF.md`
- `tasks/TASK-048-HANDOFF.md`

## Dependencia

- Liberada por `TASK-048`.

## Criterios de aceptacion

- [x] Preflight documenta estado de herramientas locales.
- [x] Preflight documenta rutas/componentes a publicar.
- [x] Preflight documenta variables/secretos necesarios sin valores reales.
- [x] Preflight documenta riesgos y decisiones pendientes.
- [x] No se crean recursos Azure.
- [x] No se conecta Azure SQL.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Comandos de version/status no destructivos.
- Revision documental.
- `git status --short --branch`.
- Busqueda de secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-049-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
