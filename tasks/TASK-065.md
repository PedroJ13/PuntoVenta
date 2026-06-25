# TASK-065 - Documentar baseline pilot reproducible Web API

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P2 recomendable

## Contexto

Despues de `TASK-064`, el pilot debe quedar con CORS restringido, Web/API publicados, deploy Web por Static Web Apps y deploy API por GitHub OIDC/RBAC. Se requiere dejar un runbook corto para operar y verificar el baseline pilot sin depender de memoria de chats.

## Objetivo

Documentar el baseline pilot reproducible Web/API, incluyendo URLs, workflows, autenticacion OIDC/RBAC, CORS, politicas SCM/FTP y verificaciones de salud.

## Alcance

- Actualizar o crear documentacion de operacion pilot en `docs/`.
- Incluir URLs Web/API publicas.
- Incluir workflows GitHub Actions relevantes y criterios de exito.
- Incluir estado esperado de politicas:
  - `scm allow:false`
  - `ftp allow:false`
- Incluir CORS esperado despues de `TASK-064`.
- Incluir confirmacion de que Azure SQL sigue fuera del pilot.
- Incluir comandos/checks no destructivos para verificar Web/API.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No cambiar infraestructura.
- No modificar secrets.
- No hacer QA funcional completo.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `tasks/TASK-063-HANDOFF.md`
- `tasks/TASK-064-HANDOFF.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `docs/CURRENT_BLOCKERS.md`

## Dependencia

- Ejecutar despues de `TASK-064`.

## Criterios de aceptacion

- [x] Baseline pilot reproducible queda documentado en `docs/`.
- [x] URLs, workflows, OIDC/RBAC, CORS y politicas SCM/FTP quedan claros.
- [x] Azure SQL queda explicitamente fuera del baseline.
- [x] Checks de verificacion quedan documentados.
- [x] No se exponen secretos.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Revision de docs actualizados.
- Busqueda textual de secretos en archivos tocados.
- `git status --short --branch`.

## Handoff esperado

Crear o actualizar `tasks/TASK-065-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
