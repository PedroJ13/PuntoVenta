# TASK-056 - Desbloquear deploy Web pilot y validar endpoints publicos

## Estado

Hecha

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-054` logro publicar/registrar la API en Azure Functions, pero el deploy Web no completo por error de SWA CLI `StaticSitesClient.exe` y los checks HTTP publicos fallaron por conectividad TCP desde el entorno Codex. Despues de `TASK-055`, se debe completar el deploy Web pilot y dejar evidencia suficiente para decidir QA publicado.

## Objetivo

Completar o desbloquear el deploy Web pilot y validar publicamente Web + API sin Azure SQL.

## Alcance

- Reintentar deploy Web pilot usando el camino mas seguro disponible.
- Preferir GitHub Actions si los secrets requeridos ya existen; si no, documentar bloqueo exacto.
- Alternativamente usar SWA CLI solo si se puede evitar repetir el fallo documentado o se obtiene evidencia mejor.
- Verificar URL publica Web: `https://gray-beach-00a0f870f.7.azurestaticapps.net`.
- Verificar API health publica: `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`.
- Confirmar que no existe ni se usa Azure SQL.
- Documentar si los checks fallan solo desde este entorno y pedir validacion externa/PO si aplica.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No cambiar funcionalidad del POS.
- No guardar secrets en repo.
- No hacer QA formal de flujos; solo smoke tecnico publicado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-054-HANDOFF.md`
- `tasks/TASK-055-HANDOFF.md`
- `.github/workflows/puntoventa-web-pilot.yml`
- `.github/workflows/puntoventa-api-pilot.yml`

## Dependencia

- Ejecutar despues de `TASK-055`.

## Criterios de aceptacion

- [x] Web pilot publica responde, o bloqueo exacto queda documentado.
- [x] API pilot health responde, o bloqueo de red/ambiente queda documentado con evidencia.
- [x] No se crea ni usa Azure SQL.
- [x] No quedan secrets en repo.
- [x] Queda recomendacion clara para QA publicado o para siguiente desbloqueo.
- [x] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Checks HTTP no destructivos contra URLs publicas.
- Consulta Azure para confirmar recursos y ausencia de SQL.
- `git status --short --branch`.
- Busqueda de secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-056-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
