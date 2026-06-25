# TASK-058 - Ejecutar deploy pilot por GitHub Actions

## Estado

Assigned

## Equipo responsable

Equipo/chat: Ejecucion Tecnica
Modo de ejecucion: Infra
Prioridad: P1 pre-lanzamiento

## Contexto

`TASK-056` dejo claro que el deploy Web no debe volver a depender del fallo local de SWA CLI y que la ruta recomendada es GitHub Actions, siempre que los cambios esten en GitHub y existan los secrets requeridos.

## Objetivo

Ejecutar o desbloquear el deploy pilot Web/API por GitHub Actions y dejar evidencia para decidir QA publicado.

## Alcance

- Confirmar que `TASK-057` dejo cambios en GitHub o documentar si falta push.
- Confirmar existencia/configuracion de secrets requeridos sin leer ni exponer valores:
  - `AZURE_STATIC_WEB_APPS_API_TOKEN_PUNTOVENTA`
  - `AZURE_FUNCTIONAPP_PUBLISH_PROFILE_PUNTOVENTA`
- Ejecutar o solicitar ejecucion de workflows pilot:
  - `PuntoVenta Web Pilot`
  - `PuntoVenta API Pilot`
- Revisar estado de runs/logs disponibles.
- Validar Web y API publicos desde una red disponible.
- Confirmar que no existe ni se usa Azure SQL.
- Recomendar QA publicado solo si Web/API responden.

## Fuera de alcance

- No crear Azure SQL.
- No migrar datos.
- No guardar secrets en repo.
- No hacer QA funcional completo.
- No cambiar codigo funcional salvo ajuste minimo de pipeline si hay fallo claro y acotado.

## Leer antes de trabajar

- `AGENTS.md`
- `chat-start/EJECUCION_TECNICA.md`
- `docs/PILOT_DEPLOY_CONFIG.md`
- `tasks/TASK-056-HANDOFF.md`
- `tasks/TASK-057-HANDOFF.md`
- `.github/workflows/puntoventa-web-pilot.yml`
- `.github/workflows/puntoventa-api-pilot.yml`

## Dependencia

- Ejecutar despues de `TASK-057`.

## Criterios de aceptacion

- [ ] Workflows pilot ejecutados correctamente o bloqueo exacto documentado.
- [ ] Web publica responde o bloqueo exacto documentado.
- [ ] API health publica responde o bloqueo exacto documentado.
- [ ] No se crea ni usa Azure SQL.
- [ ] No se exponen secretos.
- [ ] Queda recomendacion clara: crear QA publicado o siguiente desbloqueo.
- [ ] El handoff indica `Uso Azure SQL: No`.

## Verificacion esperada

- Evidencia de workflows/runs.
- Checks HTTP no destructivos contra:
  - `https://gray-beach-00a0f870f.7.azurestaticapps.net/`
  - `https://func-puntoventa-pilot-eastus2.azurewebsites.net/api/health`
- Consulta Azure para confirmar ausencia de SQL.
- Busqueda de secretos en archivos cambiados.

## Handoff esperado

Crear o actualizar `tasks/TASK-058-HANDOFF.md`.
Cerrar la tarea usando el formato de `C:\Work\Codex Templates\codex-project-templates\TASK_COMPLETION_REPORT_PROMPT.md`.
